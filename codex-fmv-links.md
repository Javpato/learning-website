# Work order — Keyword → definition links in the FMV TDs, exams, formulaire

Read `AGENTS.md` first. This order is executed in PHASES — do ONLY the phase
named in your prompt.

Goal: every key technical term in an exercise or exam links to the exact
place in the cours where it is defined, via
`<Terme id="…">le mot tel qu'écrit</Terme>` (component already registered;
it renders a deep link `#def-<id>` plus a hover gloss).

The id inventory is `platform/lib/content/glossaire-fmv.ts` — the ONLY legal
ids. Do not invent ids; report missing terms instead.

## Rules (all phases)

- INSERTION-ONLY: wrap existing words; never rewrite, add or delete prose.
  The diff must show only `<Terme id="…">…</Terme>` wrappers appearing.
- Wrap the FIRST occurrence of each glossary term **per exercise**
  (per `<ExerciseView>` block; per `<ExamProblem>` for exams; per section
  for the formulaire). Later occurrences in the same block stay bare.
- The wrapped text is the word as it already appears (inflected, capitalised,
  elided as-is) — e.g. `des <Terme id="ligne-de-niveau">lignes de niveau</Terme>`.
  Match synonyms to their entry: « col » and « point selle » → `point-selle`;
  « nullcline » → `isocline` ; « courbe de niveau » → `ligne-de-niveau`.
- NEVER wrap: text inside `$…$`/`$$…$$`, headings, component string props
  (`title="…"`), text already inside a `<Terme>`/`<Def>`, or the lesson
  links in « Théorie utile ».
- Do not wrap a term inside the very lesson that defines it (not applicable
  in TDs/exams, which define nothing — no `<Def>` may ever appear here).
- MDX safety: do not break a `$…$` span across lines while wrapping; keep
  every line's math intact.

## Phases

- **LINKS-FR** — writable files: the 11 files
  `platform/app/[locale]/math/fonctions-plusieurs-variables/{td-1…td-7,examens/cc,examens/partiel,examens/final,formulaire}/content.fr.mdx`.
- **LINKS-EN** / **LINKS-ES** — same directories, `content.en.mdx` /
  `content.es.mdx`. Mirror the fr sibling EXACTLY: same Terme ids, same
  count, at the equivalent word of the translated sentence (English/Spanish
  term forms, e.g. `<Terme id="valeur-propre">eigenvalue</Terme>`). The
  verifier enforces identical Terme id sets per file across locales.

## Acceptance (self-verify before finishing)

- [ ] Only `<Terme…>` wrappers appear in the diff (no prose changes).
- [ ] Every id exists in `glossaire-fmv.ts`.
- [ ] ≤ 1 wrap per term per exercise/problem/section.
- [ ] From `platform/`: `VERIFY_SKIP_PARITY=1 npm run verify:content` passes
      (for LINKS-EN/LINKS-ES: plain `npm run verify:content` must pass).

Report terms that appear often in exercises but are missing from the
glossary.
