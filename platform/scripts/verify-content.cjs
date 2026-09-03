#!/usr/bin/env node
/*
 * Verify the L2 Chimie learning-track content (analog of verify-sql.cjs).
 * Checks, across every content.fr.mdx under math/fonctions-plusieurs-variables
 * and physics:
 *   1. every <ExerciseView|LessonMeta|RelatedExercises|LessonStateSelector|
 *      MockExamView id="..."> resolves in the content registry;
 *   2. every registry exercise id appears in exactly one MDX file;
 *   3. every lesson id has exactly one lesson page using it in LessonMeta;
 *   4. $ / $$ math delimiters are balanced in every file;
 *   5. every <QItem> block contains at least one <QOption ... correct>;
 *   6. glossary integrity (lib/content/glossaire-fmv.ts): ids are unique
 *      ASCII kebab-case, lessonIds resolve, no `$` anywhere in the file
 *      (`short` renders in a title attribute where KaTeX cannot run);
 *      every <Terme id> / <Def id> in MDX resolves in the glossary; every
 *      <Def id> appears exactly once across fr files and in the lesson file
 *      matching its glossary lessonId.
 *
 * Env flags (used only while the FR-first rewrite is in flight):
 *   VERIFY_SKIP_PARITY=1     skip the en/es-vs-fr structural parity check;
 *   VERIFY_STRICT_GLOSSARY=1 additionally require every glossary entry to
 *                            have its <Def> present (final-state check).
 *
 * The registry lives in TypeScript; rather than compile it, this script
 * re-derives the id inventory from the TS sources with regexes (ids are
 * simple string literals `id: "..."`).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APP = path.join(ROOT, "app", "[locale]");

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error("✗ " + msg);
};

function readIds(file, kind) {
  const src = fs.readFileSync(path.join(ROOT, "lib", "content", file), "utf8");
  const ids = [];
  const re = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return ids;
}

const allIds = new Set([
  ...readIds("math-fmv.ts"),
  ...readIds("math-analyse.ts"),
  ...readIds("physics-em.ts"),
  ...readIds("cs-reseaux.ts"),
]);
const exerciseIds = [...allIds].filter((id) => /-td\d+-\d+$/.test(id));
const lessonIds = [...allIds].filter((id) => /-c\d+$/.test(id));
const examIds = [...allIds].filter((id) => /-exam-/.test(id));

// Glossaries (terme id -> lessonId of its definition site). One file per
// track; ids must stay unique ACROSS files, since <Terme id> resolves in a
// single merged map (lib/content/registry.ts).
const GLOSSARY_FILES = ["glossaire-fmv.ts", "glossaire-analyse.ts", "glossaire-reseaux.ts"];
const termeLesson = new Map();
const termeSource = new Map(); // terme id -> glossary file that declared it
for (const gf of GLOSSARY_FILES) {
  const glossarySrc = fs.readFileSync(path.join(ROOT, "lib", "content", gf), "utf8");
  const entryRe = /id:\s*"([^"]+)"[\s\S]*?lessonId:\s*"([^"]+)"/g;
  let m;
  while ((m = entryRe.exec(glossarySrc))) {
    if (termeLesson.has(m[1]))
      fail(
        `${gf}: terme id "${m[1]}" already declared in ${termeSource.get(m[1])} — ids must be unique across glossaries`,
      );
    termeLesson.set(m[1], m[2]);
    termeSource.set(m[1], gf);
  }
  if (glossarySrc.includes("$"))
    fail(`${gf}: contains '$' — glossary strings render in title attributes, KaTeX cannot run there`);
}

// collect mdx files
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/^content\.(fr|en|es)\.mdx$/.test(e.name)) out.push(p);
  }
  return out;
}

function localeOf(file) {
  return path.basename(file).split(".")[1]; // fr | en | es
}

const mdxFiles = [
  ...walk(path.join(APP, "math", "fonctions-plusieurs-variables")),
  ...walk(path.join(APP, "math", "analyse-convergence")),
  ...walk(path.join(APP, "physics")),
  ...walk(path.join(APP, "cs", "reseaux")),
];

// 6a. glossary self-checks (duplicate ids and stray '$' are caught while the
// glossaries are read, above)
for (const [id, lessonId] of termeLesson) {
  const gf = termeSource.get(id);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))
    fail(`${gf}: terme id "${id}" is not ASCII kebab-case`);
  if (!lessonIds.includes(lessonId))
    fail(`${gf}: terme "${id}" points to unknown lesson "${lessonId}"`);
}

const exerciseUse = new Map();
const lessonUse = new Map();
const examUse = new Map();
const defUse = new Map(); // terme id -> count across fr files
const lessonOfFile = new Map(); // fr file -> lesson id (from <LessonMeta id>)
const defsByFile = new Map(); // fr file -> Set of def ids
const idSetByFile = new Map(); // file -> Set of referenced ids (structure check)

for (const file of mdxFiles) {
  const rel = path.relative(ROOT, file);
  const loc = localeOf(file);
  const src = fs.readFileSync(file, "utf8");

  // 1. id references resolve (fr counts toward the exactly-once inventory)
  const refRe = /<(ExerciseView|LessonMeta|RelatedExercises|LessonStateSelector|MockExamView)\s+id="([^"]+)"/g;
  const fileIds = new Set();
  let m;
  while ((m = refRe.exec(src))) {
    const [, comp, id] = m;
    if (!allIds.has(id)) fail(`${rel}: <${comp} id="${id}"> — unknown id`);
    if (comp === "ExerciseView" || comp === "LessonMeta" || comp === "MockExamView") {
      fileIds.add(`${comp}:${id}`);
    }
    if (loc === "fr") {
      if (comp === "ExerciseView") exerciseUse.set(id, (exerciseUse.get(id) ?? 0) + 1);
      if (comp === "LessonMeta") lessonUse.set(id, (lessonUse.get(id) ?? 0) + 1);
      if (comp === "MockExamView") examUse.set(id, (examUse.get(id) ?? 0) + 1);
    }
  }
  // 6b. glossary references resolve; Def/Terme count toward locale parity
  const termRe = /<(Def|Terme)\s+id="([^"]+)"/g;
  while ((m = termRe.exec(src))) {
    const [, comp, id] = m;
    if (!termeLesson.has(id)) fail(`${rel}: <${comp} id="${id}"> — unknown glossary term`);
    fileIds.add(`${comp}:${id}`);
    if (comp === "Def" && loc === "fr") {
      defUse.set(id, (defUse.get(id) ?? 0) + 1);
      if (!defsByFile.has(file)) defsByFile.set(file, new Set());
      defsByFile.get(file).add(id);
    }
  }
  if (loc === "fr") {
    const lm = src.match(/<LessonMeta\s+id="([^"]+)"/);
    if (lm) lessonOfFile.set(file, lm[1]);
  }
  idSetByFile.set(file, fileIds);

  // 4b. multi-line $$ blocks must have their fences on their own lines —
  // micromark only closes a multi-line math block on a bare "$$" line, so
  // "$$content…" / "…content$$" spanning lines silently swallows the rest
  // of the document (single-line "$$…$$" is fine).
  {
    let inMath = false;
    src.split("\n").forEach((line, i) => {
      const n = (line.match(/\$\$/g) || []).length;
      if (n === 2 && !inMath) return; // single-line $$…$$
      if (n === 1) {
        const s = line.trim();
        if (s === "$$") {
          inMath = !inMath;
        } else {
          fail(`${rel}:${i + 1}: multi-line $$ fence with content attached — put the $$ on its own line`);
          inMath = !inMath;
        }
      } else if (n === 2 && inMath) {
        fail(`${rel}:${i + 1}: unexpected $$…$$ inside an open $$ block`);
      }
    });
  }

  // 4b-ter. Inline $…$ spans must not wrap across lines. micromark only
  // recognizes inline math on a single line: "$a +\nb$" ships as literal
  // dollar text behind a green build. Detected as an odd number of single-$
  // on a line outside display blocks and code fences (16 wrapped spans had
  // shipped in cs/reseaux, 19 more files in physics/FMV).
  {
    let inMath = false;
    let inCode = false;
    src.split("\n").forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith("```")) {
        inCode = !inCode;
        return;
      }
      if (inCode) return;
      if ((line.match(/\$\$/g) || []).length === 1) {
        // display fence (bare or malformed — 4b already flags malformed)
        inMath = !inMath;
        return;
      }
      if (inMath) return;
      const stripped = line.replace(/\$\$[^$]*\$\$/g, "").replace(/\\\$/g, "");
      if ((stripped.match(/\$/g) || []).length % 2 === 1) {
        fail(`${rel}:${i + 1}: inline $…$ spans a line break — join the span onto one line`);
      }
    });
  }

  // 4b-bis. Control characters in the source. A form feed, backspace, vertical
  // tab or escape is never legitimate in MDX prose, and it is what a mangled
  // backslash escape decays into: "\frac" became FORMFEED + "rac" in lesson 01's
  // guiding question, which then rendered as the literal word "rac" behind a
  // green build. The bare-macro check below cannot see it, because after the
  // mangling the word "frac" is no longer present at all.
  {
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/[\x00-\x08\x0b\x0c\x0e-\x1f]/);
      if (m) {
        const code = m[0].charCodeAt(0).toString(16).padStart(2, "0");
        fail(`${rel}:${i + 1}: control character U+00${code.toUpperCase()} in source — usually a mangled backslash escape`);
        break;
      }
    }
  }

  // 4c. LaTeX macros written without their backslash inside math ("$sum u_n$"
  // renders as the word "sum"). Cheap to write by accident, invisible in a
  // green build, and it has happened.
  {
    // `cdots`/`ldots` must be listed in their own right: a trailing "(?![A-Za-z])"
    // makes "cdot" fail to match "cdots", which is how a bare \cdots once shipped.
    // Spacing macros are listed too: a bare "qquad" is always a stripped
    // \qquad (the letter-run has no other reading), and 31 of them had
    // shipped. Short macros like \in or \le are deliberately NOT listed —
    // "e^{in\theta}" is a legitimate i·n·θ, and flagging it would train
    // authors to ignore this check.
    const MACROS = /(?<![\\A-Za-z_{])(sum|prod|int|frac|sqrt|infty|alpha|beta|gamma|lambda|theta|varepsilon|cdots|cdot|ldots|dots|forall|exists|partial|nabla|times|leq|geq|neq|approx|qquad|quad)(?![A-Za-z])/;
    const spans = src.match(/\$\$[\s\S]*?\$\$|\$[^$\n]*\$/g) || [];
    for (const span of spans) {
      // upright-text constructs legitimately contain words (B_{\rm int})
      const stripped = span
        .replace(/\\(?:text|mathrm|operatorname|mathbf|mathcal)\{[^}]*\}/g, "")
        .replace(/\\rm\s+[A-Za-z]+/g, "");
      const m = stripped.match(MACROS);
      if (m) {
        fail(`${rel}: "${m[1]}" inside math without its backslash — ${span.replace(/\s+/g, " ").slice(0, 60)}`);
        break;
      }
    }
  }

  // 4. balanced math delimiters (strip $$ blocks first, then count single $)
  const noDisplay = src.replace(/\$\$/g, "");
  const singles = (noDisplay.match(/(?<!\\)\$/g) || []).length;
  if (singles % 2 !== 0) fail(`${rel}: unbalanced $ math delimiters`);
  const displays = (src.match(/\$\$/g) || []).length;
  if (displays % 2 !== 0) fail(`${rel}: unbalanced $$ math delimiters`);

  // 5. each QItem has a correct option
  const qitems = src.split(/<QItem[\s>]/).slice(1);
  qitems.forEach((block, i) => {
    const end = block.indexOf("</QItem>");
    const body = end >= 0 ? block.slice(0, end) : block;
    if (!/<QOption[^>]*\scorrect/.test(body)) {
      fail(`${rel}: QItem #${i + 1} has no correct <QOption>`);
    }
  });
}

// 2. every exercise appears exactly once
for (const id of exerciseIds) {
  const n = exerciseUse.get(id) ?? 0;
  if (n === 0) fail(`exercise ${id} not present in any MDX`);
  if (n > 1) fail(`exercise ${id} present in ${n} MDX files`);
}
// 3. every lesson has exactly one LessonMeta usage
for (const id of lessonIds) {
  const n = lessonUse.get(id) ?? 0;
  if (n === 0) fail(`lesson ${id} has no page using <LessonMeta>`);
  if (n > 1) fail(`lesson ${id} used by ${n} LessonMeta blocks`);
}
for (const id of examIds) {
  const n = examUse.get(id) ?? 0;
  if (n === 0) fail(`exam ${id} has no MockExamView page`);
  if (n > 1) fail(`exam ${id} used by ${n} MockExamView blocks`);
}

// 6c. each <Def> appears exactly once (fr) and in the lesson its entry names
for (const [id, n] of defUse) {
  if (n > 1) fail(`<Def id="${id}"> appears ${n} times across fr files (must be unique)`);
}
for (const [file, defs] of defsByFile) {
  const inLesson = lessonOfFile.get(file);
  for (const id of defs) {
    const want = termeLesson.get(id);
    if (want && want !== inLesson) {
      fail(
        `${path.relative(ROOT, file)}: <Def id="${id}"> — glossary places this definition in ${want}, not ${inLesson ?? "a non-lesson file"}`,
      );
    }
  }
}
if (process.env.VERIFY_STRICT_GLOSSARY === "1") {
  for (const [id] of termeLesson) {
    if (!defUse.get(id)) fail(`glossary term "${id}" has no <Def> in any fr lesson`);
  }
}

// Translated files must reference exactly the same structural ids as their
// French sibling (same exercises, same lesson/exam anchors, same Def/Terme).
if (process.env.VERIFY_SKIP_PARITY === "1") {
  console.log("⚠ locale-parity check skipped (VERIFY_SKIP_PARITY=1 — FR-first rewrite in flight)");
} else {
  for (const file of mdxFiles) {
    const loc = localeOf(file);
    if (loc === "fr") continue;
    const frSibling = path.join(path.dirname(file), "content.fr.mdx");
    const frIds = idSetByFile.get(frSibling);
    if (!frIds) {
      fail(`${path.relative(ROOT, file)}: translated file has no content.fr.mdx sibling`);
      continue;
    }
    const ids = idSetByFile.get(file);
    for (const k of frIds) if (!ids.has(k)) fail(`${path.relative(ROOT, file)}: missing ${k} present in fr`);
    for (const k of ids) if (!frIds.has(k)) fail(`${path.relative(ROOT, file)}: extra ${k} absent from fr`);
  }
}

const locCounts = { fr: 0, en: 0, es: 0 };
for (const f of mdxFiles) locCounts[localeOf(f)]++;
console.log(`Locales: fr=${locCounts.fr} en=${locCounts.en} es=${locCounts.es}`);
console.log(
  `Checked ${mdxFiles.length} MDX files · ${lessonIds.length} lessons · ${exerciseIds.length} exercises · ${examIds.length} exams`,
);
if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("✓ content verification passed");
