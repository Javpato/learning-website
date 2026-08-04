---
name: mdx-safety
description: Read BEFORE editing any content.*.mdx file, any component in platform/components/learn/, or platform/mdx-components.tsx. Covers the traps that produce silently-broken pages behind a green build — multi-line $$ fences that swallow the document, KaTeX/$ inside component string props, the RSC child-identity bug that blanks Quiz and HintLadder, deep-linked heading anchors, and the design-token / CSP guardrails. Also read before adding a compound MDX component or changing how one matches its children.
---

# MDX safety (platform/)

The rules below exist because each one already shipped a broken page **behind a
passing build**. `npm run verify:content` now catches some of them; the rest are
only caught by knowing them. Do not skip this file because the edit "looks like
a one-liner" — every incident in this list was a one-liner.

Authoritative sources — read the relevant one before editing:

- `AGENTS.md` — hard guardrails (never lock content, design tokens only, no CDN,
  KaTeX never MathJax, provenance, do-not-revert list).
- `COURSE_PLAYBOOK.md` §3 — the full incident write-ups these rules come from.
- `platform/CLAUDE.md` — stack, 8-part page method, layout conventions, i18n rules.

## The four that a green build will not catch

**1. RSC child-identity trap.** A `"use client"` component can NEVER match MDX
children with `c.type === SomeComponent` — across the server/client boundary
`.type` is a lazy reference, so the comparison silently fails. This blanked all
138 quizzes and every hint ladder at once. Discriminate on **props shape**
(`typeof c.type === "string"` → host/prompt; else `props.of` / `props.id` /
fallback), and recurse into host elements — authors sometimes omit the blank
line before `<QOption>`, which makes MDX nest the options inside the prompt
`<p>`. **Any new compound component must use a props-only API.**

**2. `$$` fences must sit on their own lines.** micromark closes a multi-line
math block ONLY on a bare `$$` line. `$$content…\n…content$$` silently swallows
the rest of the page — lesson 05 lost 90% of its content with a green build.
Single-line `$$…$$` is fine. Now enforced by `verify-content.cjs`.

**3. No `$` / KaTeX in component string props** — `title=`, `fil=`, glossary
`short`. They render as literal attribute text. Unicode (q₁, ∂, ±, ⃗) is fine
and is the correct workaround.

**4. Never deep-link a rehype-slug heading id.** They are accented and encode
badly. Mint ASCII anchors by convention (`def-<id>`) via a component.

**5. Never put a bar character inside `$…$` inside a TABLE CELL.** GFM splits
cells on `|` before the math is tokenised, so `$|r|<1$` breaks into fragments
and the leftover `<1` is parsed as a JSX tag — a hard build error with a
baffling message (`Unexpected character '1' before name`). And `\|` is worse
than useless there: GFM unescapes it to a bare `|`, silently turning a norm
into an absolute value with no error at all. **In table cells write
`\lvert x\rvert` and `\lVert f\rVert`** — with a trailing space before a
letter, since `\lvertx` is an unknown macro. Outside tables, `|` and `\|` are
fine. 55 rows in the analyse track were affected.

## Tables need remark-gfm

Markdown tables render **only** because `remark-gfm` is in `remarkPlugins` in
`next.config.mjs`. It was missing until 2026-08-03, so every table on the site —
decision fiches, formulaire, hypothesis passports — rendered as literal
`| a | b |` text behind a completely green build, even though `.prose-page
table` styling had existed all along. If tables ever go back to pipe soup, that
plugin is the first thing to check.

## Inline math

Inline `$…$` must NOT span a line break. When wrapping words in `<Terme>` or
reflowing a paragraph, keep every `$…$` span intact on one line.

## Before you finish

From `platform/`:

```
npm run verify:content   # MDX ↔ registry integrity, $$ fences, math delimiters,
                         # quizzes, Def/Terme resolution, locale parity
npx tsc --noEmit
```

During an FR-first window (en/es not yet regenerated), parity will fail by
design — use `VERIFY_SKIP_PARITY=1 npm run verify:content`.

A full static export is `GITHUB_PAGES=true NODE_OPTIONS=--max-old-space-size=8192
npm run build`. `out/` only regenerates with `GITHUB_PAGES=true` — never trust a
stale `out/`. See `COURSE_PLAYBOOK.md` §4 for the post-build canaries (anchor↔link
match, `lesson-state` truncation canary, quiz/hint greps across all three locales).

## Two more traps worth knowing

- **`glob` in Python treats `[locale]` as a character class.** Always
  `glob.escape()` the app-dir path segment — a silent zero-file scan once
  "passed".
- **Never `git add` a directory while a parallel content job writes in it.**
  Commit per reviewed unit with explicit file paths.
