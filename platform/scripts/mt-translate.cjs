#!/usr/bin/env node
/*
 * Machine-translation harness for course content (FR -> EN / ES).
 *
 * The problem: content.fr.mdx is prose *interleaved* with things that must
 * survive byte-identical — KaTeX ($…$, $$…$$), component tags and their `id`
 * props, code fences, hrefs, numbers and units. Pasting raw MDX into Google
 * Translate mangles all of it (stripped \qquad, translated ids, reflowed
 * fences), which is exactly the class of corruption this repo has had to
 * repair by hand before.
 *
 * The fix is protect -> translate -> restore:
 *
 *   1. `extract` splits the French file into a *skeleton* (every tag, fence,
 *      id and math span, kept verbatim) and a *bundle* of pure prose
 *      segments, one per line, each prefixed with a [[n]] marker. Inline
 *      math / tags / code inside a segment become {{k}} masks.
 *   2. You paste the bundle into Google Translate (or any MT engine) and save
 *      the result. Nothing but prose ever reaches the engine, so there is
 *      nothing for it to corrupt, and it costs no model tokens.
 *   3. `inject` keys the translation back by [[n]] marker, checks that every
 *      segment came back with its {{k}} masks intact, restores them into the
 *      skeleton and writes content.<loc>.mdx.
 *
 * Anything that fails a check is *never* guessed at: that segment falls back
 * to the French source and is listed in the report, so a bad MT round-trip
 * shows up as untranslated French rather than as silent corruption.
 *
 * Usage:
 *   node scripts/mt-translate.cjs extract <file-or-dir>...      [--outdir .mt] [--chunk 4500]
 *   node scripts/mt-translate.cjs auto    --to en,es            [--outdir .mt]
 *   node scripts/mt-translate.cjs inject  --to en               [--outdir .mt] [--in DIR] [--dry]
 *   node scripts/mt-translate.cjs status                        [--outdir .mt]
 *
 * After `inject`, always run `npm run verify:content`. This tool guarantees
 * structural fidelity; it does not guarantee the translation reads well, and
 * MT prose still wants a human (or model) editing pass for register.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APP = path.join(ROOT, "app", "[locale]");

// ── configuration ─────────────────────────────────────────────────────────

// Props whose value is prose meant for the reader. Everything else — id, of,
// expected, unit, starter, href, author, preset, lang, className, mode, which,
// provenance, work (bibliographic titles) — is left byte-identical.
const TRANSLATABLE_PROPS = new Set(["title", "task", "hint", "fil", "label"]);

const LOCALES = { en: "English", es: "Spanish" };

const WRAP = 76; // body prose is re-wrapped to roughly the French width

// Placeholders. SEG never reaches the MT engine (it lives in the skeleton);
// MASK does, so it is deliberately bracket-shaped — engines pass those
// through — and matched back tolerantly (whitespace may be inserted).
const SEG_OPEN = "⟪"; // ⟪
const SEG_CLOSE = "⟫"; // ⟫
const seg = (n) => `${SEG_OPEN}SEG:${n}${SEG_CLOSE}`;
const SEG_RE = /⟪SEG:(\d+)⟫/g;
const mask = (k) => `{{${k}}}`;
const MASK_RE = /\{\{\s*(\d+)\s*\}\}/g;
const MARKER_RE = /\[\s*\[\s*(\d+)\s*\]\s*\]/;

const HAS_WORD = /[A-Za-zÀ-ÖØ-öø-ÿ]{2,}/;

const USAGE = `
mt-translate — machine-translate course MDX without corrupting it.

  extract <file-or-dir>...   split French MDX into a skeleton + a prose bundle
      --outdir DIR             work directory            (default platform/.mt)
      --chunk N                max characters per bundle file      (default 4500)

  auto    --to en,es         translate the bundle online (unofficial, no key)
  inject  --to en            fold a translated bundle back into content.en.mdx
      --in DIR                 translated chunks       (default <outdir>/out.<loc>)
      --dry                    report only, write nothing
      --no-terms               skip the glossary / label-table enforcement
  status                     what has been extracted and translated so far

Typical run:

  node scripts/mt-translate.cjs extract "app/[locale]/math/analyse/07-series"
  # paste .mt/bundle/*.txt into translate.google.com (Text or Documents tab),
  # save each result as .mt/out.en/001.txt, 002.txt, …
  node scripts/mt-translate.cjs inject --to en
  npm run verify:content

Only prose ever reaches the translation engine: math, tags, ids, hrefs, code
and units stay in the skeleton. Any segment that comes back damaged falls back
to French and is listed in .mt/report.<loc>.txt rather than being guessed at.
`.trim();

// ── small helpers ─────────────────────────────────────────────────────────

const log = (...a) => console.log(...a);
const warn = (...a) => console.error(...a);

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      out[k] = v !== undefined ? v : argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
    } else out._.push(a);
  }
  return out;
}

function walkFr(target) {
  const st = fs.statSync(target);
  if (st.isFile()) return [target];
  const found = [];
  (function rec(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) rec(p);
      else if (e.name === "content.fr.mdx") found.push(p);
    }
  })(target);
  return found.sort();
}

// ═══════════════════════════════════════════════════════════════════════════
// Scanner: find every region of the source that must not be translated.
// ═══════════════════════════════════════════════════════════════════════════

// A JSX tag, scanned quote-aware so that `title="a > b"` does not end it early
// and so that a multi-line `task="…"` prop stays one unit. Bails at a blank
// line to stop a stray `<` in prose from swallowing the document.
function scanTag(src, i) {
  let j = i + 1;
  if (src[j] === "/") j++;
  if (!/[A-Za-z]/.test(src[j] || "")) return -1;
  let quote = null;
  for (; j < src.length; j++) {
    const c = src[j];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === "{") {
      // JSX expression prop — skip a balanced brace group
      let depth = 1;
      j++;
      while (j < src.length && depth > 0) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") depth--;
        j++;
      }
      j--;
      continue;
    }
    if (c === ">") return j + 1;
    if (c === "\n" && src.startsWith("\n\n", j)) return -1;
  }
  return -1;
}

function atLineStart(src, i) {
  return i === 0 || src[i - 1] === "\n";
}

function lineEnd(src, i) {
  const n = src.indexOf("\n", i);
  return n === -1 ? src.length : n;
}

/**
 * Regions of `src` that are protected from translation.
 *   block:true  — owns whole lines (code fence, display-math block); the
 *                 skeleton keeps them verbatim and they never join a segment.
 *   block:false — inline (tag, inline code, $…$, comment); becomes a {{k}}
 *                 mask inside the surrounding prose segment.
 */
function protectedRegions(src) {
  const regions = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];

    if (atLineStart(src, i)) {
      // fenced code block
      const fence = /^ {0,3}(`{3,}|~{3,})/.exec(src.slice(i, lineEnd(src, i) + 1));
      if (fence) {
        const marker = fence[1][0].repeat(3);
        let j = lineEnd(src, i) + 1;
        while (j < src.length) {
          const le = lineEnd(src, j);
          if (src.slice(j, le).trim().startsWith(marker)) {
            j = le;
            break;
          }
          j = le + 1;
        }
        regions.push({ s: i, e: Math.min(j, src.length), block: true, kind: "fence" });
        i = Math.min(j, src.length);
        continue;
      }
      // display-math block: a bare `$$` line, up to the next bare `$$` line
      const line = src.slice(i, lineEnd(src, i));
      if (line.trim() === "$$") {
        let j = lineEnd(src, i) + 1;
        while (j < src.length) {
          const le = lineEnd(src, j);
          if (src.slice(j, le).trim() === "$$") {
            j = le;
            break;
          }
          j = le + 1;
        }
        regions.push({ s: i, e: Math.min(j, src.length), block: true, kind: "mathblock" });
        i = Math.min(j, src.length);
        continue;
      }
    }

    if (c === "<") {
      if (src.startsWith("<!--", i)) {
        const e = src.indexOf("-->", i);
        const end = e === -1 ? src.length : e + 3;
        regions.push({ s: i, e: end, block: false, kind: "comment" });
        i = end;
        continue;
      }
      const e = scanTag(src, i);
      if (e !== -1) {
        regions.push({ s: i, e, block: false, kind: "tag" });
        i = e;
        continue;
      }
    }

    if (c === "{" && src.startsWith("{/*", i)) {
      const e = src.indexOf("*/}", i);
      const end = e === -1 ? src.length : e + 3;
      regions.push({ s: i, e: end, block: false, kind: "comment" });
      i = end;
      continue;
    }

    if (c === "`") {
      const m = /^(`+)/.exec(src.slice(i));
      const ticks = m[1];
      const close = src.indexOf(ticks, i + ticks.length);
      if (close !== -1 && !src.slice(i, close).includes("\n\n")) {
        const end = close + ticks.length;
        regions.push({ s: i, e: end, block: false, kind: "code" });
        i = end;
        continue;
      }
    }

    // markdown link / image destination: `](…)`. The link *text* stays
    // translatable, the href must not move.
    if (c === "]" && src[i + 1] === "(") {
      let depth = 0;
      let j = i + 1;
      for (; j < src.length; j++) {
        if (src[j] === "(") depth++;
        else if (src[j] === ")") {
          depth--;
          if (depth === 0) break;
        } else if (src[j] === "\n" && src.startsWith("\n\n", j)) {
          j = -1;
          break;
        }
      }
      if (j > 0 && j < src.length) {
        regions.push({ s: i, e: j + 1, block: false, kind: "href" });
        i = j + 1;
        continue;
      }
    }

    if (c === "$") {
      const dbl = src.startsWith("$$", i);
      const delim = dbl ? "$$" : "$";
      const close = src.indexOf(delim, i + delim.length);
      // math never spans a blank line; an unmatched $ is left as prose
      if (close !== -1 && !src.slice(i, close).includes("\n\n")) {
        const end = close + delim.length;
        regions.push({ s: i, e: end, block: false, kind: "math" });
        i = end;
        continue;
      }
    }

    i++;
  }
  return regions;
}

// ═══════════════════════════════════════════════════════════════════════════
// Extraction: source -> { skeleton, segments, masks }
// ═══════════════════════════════════════════════════════════════════════════

const BULLET_RE = /^(\s*(?:[-*+]|\d+[.)])\s+)/;
const HEADING_RE = /^(#{1,6}\s+)/;
const QUOTE_RE = /^(\s*>\s?)/;

function extractFile(src, state) {
  if (src.includes(SEG_OPEN) || src.includes(SEG_CLOSE)) {
    throw new Error("source already contains the ⟪⟫ placeholder characters");
  }

  const regions = protectedRegions(src);
  const regionAt = new Map(regions.map((r) => [r.s, r]));

  // Turn a protected tag into skeleton text, lifting translatable prop values
  // out as their own segments so `title="…"` gets translated but `id="…"`
  // cannot be touched.
  const tagWithProps = (text) =>
    text.replace(/\b([a-zA-Z][a-zA-Z0-9]*)\s*=\s*(["'])([\s\S]*?)\2/g, (whole, name, q, value) => {
      if (!TRANSLATABLE_PROPS.has(name)) return whole;
      if (!HAS_WORD.test(value)) return whole;
      const inner = maskInline(value, state);
      const id = state.segments.length;
      state.segments.push({ id, kind: "prop", text: inner.text, masks: inner.ids });
      return `${name}=${q}${seg(id)}${q}`;
    });

  // Split into logical lines: newlines inside a protected region do not split.
  const lines = []; // { text, start, blockRegion|null }
  {
    let cur = "";
    let start = 0;
    let i = 0;
    const push = (blockRegion) => {
      lines.push({ text: cur, start, blockRegion: blockRegion || null });
      cur = "";
    };
    while (i < src.length) {
      const r = regionAt.get(i);
      if (r) {
        if (r.block) {
          if (cur !== "") push(null);
          start = i;
          cur = src.slice(r.s, r.e);
          push(r);
          i = r.e;
          if (src[i] === "\n") i++;
          start = i;
          continue;
        }
        cur += src.slice(r.s, r.e);
        i = r.e;
        continue;
      }
      if (src[i] === "\n") {
        push(null);
        i++;
        start = i;
        continue;
      }
      if (cur === "") start = i;
      cur += src[i];
      i++;
    }
    if (cur !== "") push(null);
  }

  // Classify each logical line.
  const BLANK = "blank";
  const BLOCK = "block";
  const TAGLINE = "tagline";
  const PROSE = "prose";
  const classified = lines.map((l) => {
    if (l.blockRegion) return { ...l, cls: BLOCK };
    if (l.text.trim() === "") return { ...l, cls: BLANK };
    // strip the inline protected regions to see what prose is left
    const stripped = stripRegions(l.text);
    const hasTag = /<[A-Za-z/]/.test(l.text);
    if (stripped.trim() === "" && hasTag) return { ...l, cls: TAGLINE };
    return { ...l, cls: PROSE, hasWords: HAS_WORD.test(stripped) };
  });

  // Group prose runs into segments and emit the skeleton.
  const out = [];
  let n = 0;
  while (n < classified.length) {
    const l = classified[n];
    if (l.cls === BLANK) {
      out.push("");
      n++;
      continue;
    }
    if (l.cls === BLOCK) {
      out.push(l.text);
      n++;
      continue;
    }
    if (l.cls === TAGLINE) {
      out.push(tagWithProps(l.text));
      n++;
      continue;
    }

    // PROSE — collect this line plus its continuations
    const run = [l];
    let m = n + 1;
    while (m < classified.length) {
      const c = classified[m];
      if (c.cls !== PROSE) break;
      if (BULLET_RE.test(c.text) || HEADING_RE.test(c.text) || QUOTE_RE.test(c.text)) break;
      if (isTableRow(c.text) !== isTableRow(l.text)) break;
      if (isTableRow(c.text)) break; // each table row stands alone
      run.push(c);
      m++;
    }
    n = m;

    const first = run[0].text;
    const prefixMatch = HEADING_RE.exec(first) || BULLET_RE.exec(first) || QUOTE_RE.exec(first);
    const prefix = prefixMatch ? prefixMatch[1] : (/^\s*/.exec(first) || [""])[0];
    const body = [first.slice(prefix.length), ...run.slice(1).map((r) => r.text.trim())].join(" ").trim();

    if (!HAS_WORD.test(stripRegions(body))) {
      // nothing to translate (a bare formula line, a `|---|---|` rule) —
      // keep it verbatim rather than shipping it to the engine
      out.push(run.map((r) => tagWithProps(r.text)).join("\n"));
      continue;
    }

    const inner = maskInline(body, state);
    const id = state.segments.length;
    state.segments.push({
      id,
      kind: "prose",
      text: inner.text,
      masks: inner.ids,
      prefix,
      indent: " ".repeat(prefix.length),
      wrap: !isTableRow(first),
    });
    out.push(prefix + seg(id));
  }

  return out.join("\n");
}

function isTableRow(text) {
  const t = text.trim();
  return t.startsWith("|") && t.endsWith("|") && t.length > 2;
}

function stripRegions(text) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/`[^`]*`/g, " ");
}

/**
 * Replace every protected region inside a prose fragment with a {{k}} mask.
 * Returns the maskable text plus the ids it uses, so `inject` can check that
 * the engine gave every one of them back.
 */
function maskInline(text, state) {
  const regions = protectedRegions(text);
  const ids = [];
  let out = "";
  let i = 0;
  for (const r of regions) {
    if (r.s < i) continue;
    out += text.slice(i, r.s);
    let content = text.slice(r.s, r.e);
    if (r.kind === "tag") content = liftTagProps(content, state);
    const k = state.masks.length;
    state.masks.push(content);
    // Whether the span was glued to its neighbours. The bundle always pads
    // masks — engines drop a token welded to the next word — and `detighten`
    // puts the original spacing back before anything is restored.
    state.tight.push([!/[ \t]$/.test(out) || out === "", !/^[ \t]/.test(text.slice(r.e)) || r.e >= text.length]);
    ids.push(k);
    out += mask(k);
    i = r.e;
  }
  out += text.slice(i);

  // GFM table pipes are structure, not prose — mask them too so the engine
  // cannot drop or re-order columns.
  if (isTableRow(text)) {
    out = out.replace(/\|/g, () => {
      const k = state.masks.length;
      state.masks.push("|");
      state.tight.push([false, false]);
      ids.push(k);
      return mask(k);
    });
  }

  return { text: out.replace(/\s+/g, " ").trim(), ids };
}

// A tag captured as an inline mask may still carry a translatable prop.
function liftTagProps(tagText, state) {
  return tagText.replace(/\b([a-zA-Z][a-zA-Z0-9]*)\s*=\s*(["'])([\s\S]*?)\2/g, (whole, name, q, value) => {
    if (!TRANSLATABLE_PROPS.has(name)) return whole;
    if (!HAS_WORD.test(value)) return whole;
    const inner = maskInline(value, state);
    const id = state.segments.length;
    state.segments.push({ id, kind: "prop", text: inner.text, masks: inner.ids });
    return `${name}=${q}${seg(id)}${q}`;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Glossary + fixed-label enforcement (applied after MT, before restore)
// ═══════════════════════════════════════════════════════════════════════════

// Numbered-block labels and register markers that must match the house style
// rather than whatever the engine picked. Source: the course-translate skill.
const FIXED_LABELS = {
  en: [
    ["Définition", "Definition"],
    ["Exemple (chimie)", "Example (chemistry)"],
    ["Exemple", "Example"],
    ["Remarque", "Remark"],
    ["Méthode", "Method"],
    ["Étape", "Step"],
    ["Pourquoi ?", "Why?"],
    ["Le plan de bataille", "The battle plan"],
    ["Prédis", "Predict"],
    ["Agis", "Act"],
    ["Observe", "Observe"],
    ["Relie", "Connect"],
  ],
  es: [
    ["Définition", "Definición"],
    ["Exemple (chimie)", "Ejemplo (química)"],
    ["Exemple", "Ejemplo"],
    ["Remarque", "Observación"],
    ["Méthode", "Método"],
    ["Étape", "Paso"],
    ["Pourquoi ?", "¿Por qué?"],
    ["Le plan de bataille", "El plan de batalla"],
    ["Prédis", "Predice"],
    ["Agis", "Actúa"],
    ["Observe", "Observa"],
    ["Relie", "Relaciona"],
  ],
};

function loadGlossary(locale) {
  const dir = path.join(ROOT, "lib", "content");
  const pairs = [];
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /^glossaire-.*\.ts$/.test(f));
  } catch {
    return pairs;
  }
  const re =
    /label:\s*\{\s*fr:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*es:\s*"((?:[^"\\]|\\.)*)"/g;
  for (const f of files) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    let m;
    while ((m = re.exec(src))) {
      const fr = m[1];
      const target = locale === "en" ? m[2] : m[3];
      if (fr && target && fr.toLowerCase() !== target.toLowerCase()) pairs.push([fr, target]);
    }
  }
  return pairs;
}

// id -> label, for forcing the <Def> definition sites onto the canonical term.
function loadGlossaryById(locale) {
  const dir = path.join(ROOT, "lib", "content");
  const byId = new Map();
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /^glossaire-.*\.ts$/.test(f));
  } catch {
    return byId;
  }
  const re =
    /id:\s*"([^"]+)"[\s\S]{0,400}?label:\s*\{\s*fr:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*es:\s*"((?:[^"\\]|\\.)*)"/g;
  for (const f of files) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    let m;
    while ((m = re.exec(src))) byId.set(m[1], locale === "en" ? m[3] : m[4]);
  }
  return byId;
}

/**
 * A <Def id="x"> is the single definition site for term x, and the parity
 * check pins its id across locales. MT will happily render the term three
 * different ways; force it to the glossary label so the definition site and
 * the glossary agree by construction.
 */
function forceDefLabels(body, byId, stats) {
  return body.replace(/(<Def\s+id="([^"]+)"[^>]*>)([\s\S]*?)(<\/Def>)/g, (whole, open, id, inner, close) => {
    const label = byId.get(id);
    if (!label) return whole;
    const bold = /^\s*\*\*[\s\S]*\*\*\s*$/.test(inner);
    const next = bold ? `**${label}**` : label;
    if (next !== inner) stats.count++;
    return open + next + close;
  });
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Force house terminology onto MT output. Longest source term first, so
 * "développement limité" wins over "développement". Only fires when the
 * French term survived untranslated — MT often leaves domain terms alone,
 * which is precisely the case the glossary exists to fix.
 */
function enforceTerminology(text, locale, stats) {
  const pairs = [...FIXED_LABELS[locale], ...loadGlossary(locale)].sort((a, b) => b[0].length - a[0].length);
  let out = text;
  for (const [fr, to] of pairs) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}-])${escapeRe(fr)}(?![\\p{L}\\p{N}-])`, "giu");
    out = out.replace(re, (hit) => {
      stats.count++;
      // preserve a leading capital
      return /^[A-ZÀ-Þ]/.test(hit) ? to.charAt(0).toUpperCase() + to.slice(1) : to;
    });
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════════
// Restore
// ═══════════════════════════════════════════════════════════════════════════

// Bundle form: every mask stands alone as its own whitespace-delimited token.
// Google Translate reliably drops a `{{k}}` welded to the following word.
function padMasks(text) {
  return text
    .replace(MASK_RE, (_, k) => ` ${mask(k)} `)
    .replace(/[ \t]+/g, " ")
    .trim();
}

// Inverse of padMasks: put back the spacing the French had around each span,
// so `les {{15}} sommes partielles {{16}}` becomes `les {{15}}sommes
// partielles{{16}}` again before the tags are restored.
function detighten(text, tight) {
  return text
    .replace(/[ \t]*\{\{\s*(\d+)\s*\}\}[ \t]*/g, (whole, k) => {
      const t = tight[+k] || [false, false];
      return (t[0] ? "" : " ") + mask(+k) + (t[1] ? "" : " ");
    })
    .replace(/[ \t]+/g, " ")
    .trim();
}

function resolve(text, resolvedSegs, masks) {
  let out = text;
  for (let pass = 0; pass < 20; pass++) {
    const before = out;
    out = out.replace(MASK_RE, (whole, k) => (masks[+k] !== undefined ? masks[+k] : whole));
    out = out.replace(SEG_RE, (whole, n) => (resolvedSegs[+n] !== undefined ? resolvedSegs[+n] : whole));
    if (out === before) break;
  }
  return out;
}

// Wrap on the *masked* text so a line break can never land inside $…$ or a
// tag, using the restored length of each mask as its true width.
function wrapMasked(masked, masks, width, indent) {
  const widthOf = (t) => t.replace(MASK_RE, (_, k) => masks[+k] ?? "").length;
  const words = masked.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  let curW = 0;
  for (const w of words) {
    const ww = widthOf(w);
    if (cur && curW + 1 + ww > width) {
      lines.push(cur);
      cur = w;
      curW = ww;
    } else {
      cur = cur ? `${cur} ${w}` : w;
      curW = cur === w ? ww : curW + 1 + ww;
    }
  }
  if (cur) lines.push(cur);
  return lines.map((l, i) => (i === 0 ? l : indent + l)).join("\n");
}

// ═══════════════════════════════════════════════════════════════════════════
// Commands
// ═══════════════════════════════════════════════════════════════════════════

function cmdExtract(args) {
  const targets = args._.length ? args._ : [APP];
  const outdir = path.resolve(ROOT, args.outdir || ".mt");
  const chunkSize = Number(args.chunk || 4500);

  const files = targets.flatMap((t) => walkFr(path.resolve(process.cwd(), t)));
  if (!files.length) {
    warn("no content.fr.mdx found under: " + targets.join(", "));
    process.exit(1);
  }

  const state = { segments: [], masks: [], tight: [] };
  const skeletons = {};
  for (const f of files) {
    const rel = path.relative(ROOT, f);
    const src = fs.readFileSync(f, "utf8");
    const before = state.segments.length;
    skeletons[rel] = extractFile(src, state);
    log(`  ${rel} — ${state.segments.length - before} segments`);
  }

  fs.rmSync(outdir, { recursive: true, force: true });
  fs.mkdirSync(outdir, { recursive: true });
  fs.writeFileSync(
    path.join(outdir, "map.json"),
    JSON.stringify({ version: 1, files, skeletons, segments: state.segments, masks: state.masks, tight: state.tight }, null, 1),
  );

  // The bundle: one segment per line, [[n]]-marked. No blank lines — an
  // engine that swallows one cannot then shift everything after it.
  const bundleLines = state.segments.map((s) => `[[${s.id + 1}]] ${padMasks(s.text)}`);
  const chunks = [];
  let cur = [];
  let curLen = 0;
  for (const line of bundleLines) {
    if (cur.length && curLen + line.length + 1 > chunkSize) {
      chunks.push(cur);
      cur = [];
      curLen = 0;
    }
    cur.push(line);
    curLen += line.length + 1;
  }
  if (cur.length) chunks.push(cur);

  const bundleDir = path.join(outdir, "bundle");
  fs.mkdirSync(bundleDir, { recursive: true });
  chunks.forEach((c, i) => {
    fs.writeFileSync(path.join(bundleDir, `${String(i + 1).padStart(3, "0")}.txt`), c.join("\n") + "\n");
  });

  const chars = bundleLines.reduce((a, l) => a + l.length, 0);
  log("");
  log(`Extracted ${state.segments.length} segments / ${state.masks.length} protected spans`);
  log(`from ${files.length} file(s) — ${chars.toLocaleString()} characters of prose.`);
  log("");
  log(`Bundle:  ${path.relative(process.cwd(), bundleDir)}/001.txt … ${String(chunks.length).padStart(3, "0")}.txt`);
  log("");
  log("Next — for each target locale (en, es):");
  log("  1. translate.google.com  ->  Text tab, French -> target,");
  log("     paste one chunk file at a time (they are sized to fit the box);");
  log("     or the Documents tab, which takes each .txt whole.");
  log(`  2. save each result as ${path.relative(process.cwd(), outdir)}/out.<loc>/001.txt … (same numbering)`);
  log("  3. node scripts/mt-translate.cjs inject --to <loc>");
}

function readOutputs(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(txt|md)$/i.test(f))
    .sort();
  return files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
}

function cmdInject(args) {
  const locale = String(args.to || "");
  if (!LOCALES[locale]) {
    warn("--to must be one of: " + Object.keys(LOCALES).join(", "));
    process.exit(1);
  }
  const outdir = path.resolve(ROOT, args.outdir || ".mt");
  const mapPath = path.join(outdir, "map.json");
  if (!fs.existsSync(mapPath)) {
    warn(`no ${path.relative(process.cwd(), mapPath)} — run \`extract\` first`);
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

  const inDir = path.resolve(ROOT, args.in || path.join(outdir, `out.${locale}`));
  const raw = readOutputs(inDir);
  if (raw === null) {
    warn(`no translated text in ${path.relative(process.cwd(), inDir)}`);
    warn("save the Google Translate output there, one file per bundle chunk.");
    process.exit(1);
  }

  // Key by [[n]] marker, not by line order: an engine is allowed to reflow.
  // A line with no marker is a continuation of the previous segment (the
  // Documents tab re-wraps long lines). A later file repeating a marker wins
  // outright — that is what makes the retry bundle below work.
  const got = new Map();
  {
    let cur = null;
    for (const line of raw.split("\n")) {
      const m = MARKER_RE.exec(line);
      if (m) {
        cur = Number(m[1]) - 1;
        got.set(cur, line.slice(m.index + m[0].length).trim());
      } else if (cur !== null && line.trim()) {
        got.set(cur, (got.get(cur) + " " + line.trim()).trim());
      }
    }
  }

  const problems = [];
  const termStats = { count: 0 };
  const resolvedSegs = [];

  // props first — their resolved text is spliced into tags that prose masks
  // then reference
  const order = [...map.segments].sort((a, b) => (a.kind === "prop" ? -1 : 1) - (b.kind === "prop" ? -1 : 1));
  for (const s of order) {
    let text = got.get(s.id);
    let reason = null;

    if (text === undefined || !text.trim()) {
      reason = "missing from the translated bundle";
    } else {
      const want = [...s.masks].sort((a, b) => a - b);
      const have = [];
      let mm;
      const re = new RegExp(MASK_RE.source, "g");
      while ((mm = re.exec(text))) have.push(Number(mm[1]));
      have.sort((a, b) => a - b);
      if (want.join(",") !== have.join(",")) {
        reason = `mask mismatch — expected {${want.join(",")}} got {${have.join(",")}}`;
      }
    }

    if (reason) {
      problems.push({ id: s.id, reason, fr: s.text });
      text = s.text; // fall back to French rather than guess
    } else {
      if (!args["no-terms"]) text = enforceTerminology(text, locale, termStats);
      text = detighten(text, map.tight || []);
    }

    if (s.kind === "prose" && s.wrap && !s.masks.some((k) => map.masks[k].includes("\n"))) {
      text = wrapMasked(text, map.masks, WRAP, s.indent);
    }
    resolvedSegs[s.id] = resolve(text, resolvedSegs, map.masks);
  }

  const defStats = { count: 0 };
  const byId = args["no-terms"] ? new Map() : loadGlossaryById(locale);

  let written = 0;
  for (const [rel, skeleton] of Object.entries(map.skeletons)) {
    let body = resolve(skeleton, resolvedSegs, map.masks);
    body = forceDefLabels(body, byId, defStats);
    const dest = path.join(ROOT, rel.replace(/content\.fr\.mdx$/, `content.${locale}.mdx`));
    if (args.dry) {
      log(`would write ${path.relative(process.cwd(), dest)} (${body.length} bytes)`);
    } else {
      fs.writeFileSync(dest, body.endsWith("\n") ? body : body + "\n");
      written++;
    }
  }

  const reportPath = path.join(outdir, `report.${locale}.txt`);
  const report = problems.length
    ? problems.map((p) => `[[${p.id + 1}]] ${p.reason}\n    FR: ${p.fr}`).join("\n") + "\n"
    : "no problems — every segment round-tripped with its protected spans intact\n";
  fs.writeFileSync(reportPath, report);

  // A ready-to-paste bundle of just the stragglers. Translate it, drop the
  // result into the out.<loc> directory as a new file, re-run inject: the
  // repeated markers override the damaged first attempt.
  const retryPath = path.join(outdir, `retry.${locale}.txt`);
  if (problems.length) {
    fs.writeFileSync(retryPath, problems.map((p) => `[[${p.id + 1}]] ${p.fr}`).join("\n") + "\n");
  } else {
    fs.rmSync(retryPath, { force: true });
  }

  log("");
  log(`Injected ${map.segments.length - problems.length}/${map.segments.length} segments into ${written} file(s).`);
  log(`Terminology forced to the glossary / label table: ${termStats.count} substitution(s).`);
  log(`<Def> sites pinned to the canonical glossary label: ${defStats.count}.`);
  if (problems.length) {
    warn(`${problems.length} segment(s) fell back to French — see ${path.relative(process.cwd(), reportPath)}`);
    warn(`re-translate just those: ${path.relative(process.cwd(), retryPath)}`);
    warn(`then save the result into ${path.relative(process.cwd(), inDir)}/ as a new file and inject again.`);
  }
  log("");
  log("Now run:  npm run verify:content");
}

// Optional online backend. Unofficial endpoint, best effort, no key: it is a
// convenience so a small batch needs no copy-paste at all. If it rate-limits
// or changes shape, fall back to the bundle files — that path always works.
async function cmdAuto(args) {
  const locales = String(args.to || "en,es")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const outdir = path.resolve(ROOT, args.outdir || ".mt");
  const bundleDir = path.join(outdir, "bundle");
  if (!fs.existsSync(bundleDir)) {
    warn("run `extract` first");
    process.exit(1);
  }
  const files = fs.readdirSync(bundleDir).filter((f) => f.endsWith(".txt")).sort();

  for (const loc of locales) {
    if (!LOCALES[loc]) {
      warn(`skipping unknown locale ${loc}`);
      continue;
    }
    const dest = path.join(outdir, `out.${loc}`);
    fs.mkdirSync(dest, { recursive: true });
    for (const f of files) {
      const text = fs.readFileSync(path.join(bundleDir, f), "utf8");
      const lines = text.split("\n").filter((l) => l.trim());
      const done = [];
      for (let i = 0; i < lines.length; i += 8) {
        const batch = lines.slice(i, i + 8).join("\n");
        done.push(await gtranslate(batch, loc));
        await new Promise((r) => setTimeout(r, 250));
      }
      fs.writeFileSync(path.join(dest, f), done.join("\n") + "\n");
      log(`  ${loc}/${f}`);
    }
  }
  log("");
  log("Now run, per locale:  node scripts/mt-translate.cjs inject --to <loc>");
}

async function gtranslate(text, tl) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&dt=t&tl=" +
    encodeURIComponent(tl) +
    "&q=" +
    encodeURIComponent(text);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`translate endpoint returned ${res.status}`);
  const data = await res.json();
  return (data[0] || []).map((seg) => seg[0]).join("");
}

function cmdStatus(args) {
  const outdir = path.resolve(ROOT, args.outdir || ".mt");
  const mapPath = path.join(outdir, "map.json");
  if (!fs.existsSync(mapPath)) return log("no extraction in " + path.relative(process.cwd(), outdir));
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  log(`${map.files.length} file(s), ${map.segments.length} segments, ${map.masks.length} protected spans`);
  for (const loc of Object.keys(LOCALES)) {
    const dir = path.join(outdir, `out.${loc}`);
    log(`  ${loc}: ${fs.existsSync(dir) ? fs.readdirSync(dir).length + " output file(s)" : "not translated yet"}`);
  }
}

// ── entry ─────────────────────────────────────────────────────────────────

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  switch (cmd) {
    case "extract":
      return cmdExtract(args);
    case "inject":
      return cmdInject(args);
    case "auto":
      return cmdAuto(args);
    case "status":
      return cmdStatus(args);
    default:
      log(USAGE);
      process.exit(cmd ? 1 : 0);
  }
}

main().catch((e) => {
  warn(e.stack || String(e));
  process.exit(1);
});
