# Work order — Translate the « Analyse & convergence » track to English and Spanish

Read `AGENTS.md` first. This order is executed per UNIT BATCH — do ONLY the
units named in your prompt (e.g. « L02 L03 td-1 »).

Every unit under `platform/app/[locale]/math/analyse-convergence/` has an
authored `content.fr.mdx`. For each named unit, regenerate its
`content.en.mdx` and `content.es.mdx` as **faithful, complete** translations
of the fr file. Writable files: only those `content.en.mdx` /
`content.es.mdx`. Never touch the fr file, `page.tsx`, or `lib/content/*.ts`.

All rules of `codex-translate.md` and `codex-fmv-translate.md` apply. The
essentials, restated:

- Translate all prose and text-valued string props (`title="…"`, `fil="…"`,
  `unit="…"` only when it is a word, never a symbol).
- **Never** change component names or structure, `id` props, numeric props
  (`answer`, `tolerance`, `points`), math content, numbers, units, or hrefs.
- Keep French university terms (TD, partiel, contrôle continu, polycopié)
  with a gloss at first use — e.g. "TD (tutorial sheet)" / "TD (trabajo
  dirigido)".
- Same warm register: « tu » → informal "you" / «tú».
- MDX safety: inline math never spans a line break; each `$$` alone on its
  own line with blank lines around the block; blank line after an opening
  and before a closing component tag; no dollar signs in string props.
- Every LaTeX macro keeps its backslash (`\sum`, `\int`, `\sqrt`) — the
  verifier rejects bare macros inside math.

Specific to this track:

- `<Def id="…">` / `<Terme id="…">`: KEEP every one, identical ids, wrapped
  around the equivalent translated word —
  `<Def id="convergence-uniforme">**uniform convergence**</Def>` /
  `<Def id="convergence-uniforme">**convergencia uniforme**</Def>`. The
  verifier enforces identical Def/Terme id sets vs fr per directory, so a
  dropped or added wrapper fails the build.
- Terminology must agree with the `en` / `es` `label` and `short` fields of
  `platform/lib/content/glossaire-analyse.ts` (and `glossaire-fmv.ts` for
  the multivariable terms) — read them before translating.
- Numbered block labels translate as, keeping the numbers identical:
  Définition → Definition / Definición · Théorème → Theorem / Teorema ·
  Proposition → Proposition / Proposición · Exemple → Example / Ejemplo ·
  Exemple (physique) → Example (physics) / Ejemplo (física) · Remarque →
  Remark / Observación · Méthode → Method / Método · Étape → Step / Paso ·
  *Pourquoi ?* → *Why?* / *¿Por qué?* · Corrigé → Solution / Corrección ·
  « cas non concluant » → "inconclusive case" / «caso no concluyente».
- Fixed phrases: « Le plan de bataille » → "The battle plan" / «El plan de
  batalla» · « Prédis / Agis / Observe / Relie » → "Predict. / Act. /
  Observe. / Connect." / «Predice. / Actúa. / Observa. / Relaciona.» ·
  « Pièges classiques » → "Classic traps" / «Trampas clásicas» ·
  « Vérification rapide » → "Quick check" / «Comprobación rápida» ·
  « À toi » → "Your turn" / «Te toca» · « Résumé de la leçon » → "Lesson
  summary" / «Resumen de la lección».
- Decimal commas inside math stay byte-identical (`0{,}368` stays
  `0{,}368`) — the numbers are the same object in every locale.
- Exam and TD disclaimers must keep their meaning exactly: reconstructed
  preparation material, never an official paper.

Acceptance per unit: from `platform/`, `npm run verify:content` (no flags)
passes once BOTH en and es exist, and each translated file covers exactly
the same content as fr — no dropped paragraph, no summarising, no added
commentary. Do NOT run `npm run build`.
