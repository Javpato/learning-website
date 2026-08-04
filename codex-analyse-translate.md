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

### Vocabulary introduced by the proof-led rewrite (L00, L05–L12, formulaire)

The French for these units was rewritten in August 2026 and the en/es siblings
are **stale**: they still contain the older mission-driven lesson. Regenerate
them from scratch against the current fr file; do not try to patch them.

- `<Epigraph author work href translated>` — translate **nothing** but the
  quotation itself, and only when the fr file carries `translated`. If the
  quotation is in its original French (Cauchy, Abel, Poincaré, Painlevé,
  Lagrange, Fourier, Hermite), give a faithful English/Spanish rendering and
  **add** the `translated` prop to the en/es file. `author`, `work` and `href`
  are never altered — `work` is a bibliographic reference, not prose.
- `<GuidingQuestion>` / `<GuidingAnswer>` — ordinary prose, translate fully.
  These replaced `<Mission>` / `<MissionSolved>`; if you see a Mission in an
  old en/es file, it is the stale content and must go.
- `<Proof title="…">` — the title is a short lowercase phrase and IS
  translated. The component prefixes it with "Démonstration —" itself, so do
  not add that word to the title.
- Fixed phrases inside proofs: « **Idée.** » → "**Idea.**" / «**Idea.**» ·
  « **Ce que la preuve apprend.** » → "**What the proof teaches.**" /
  «**Lo que enseña la demostración.**» · « Contre-exemple n » →
  "Counterexample n" / «Contraejemplo n» · « Lemme n » → "Lemma n" /
  «Lema n» · « Corollaire » → "Corollary" / «Corolario» ·
  « Remarque (cas non concluant) » → "Remark (inconclusive case)" /
  «Observación (caso no concluyente)».
- These units contain **no** `<Mission>`, `<MissionSolved>`, `<Accroche>`,
  "plan de bataille" or "Exemple (physique)". If your output has any of them,
  you translated the wrong source file.

### Table cells: never a bare bar

Inside a markdown TABLE CELL, `|` and `\|` are eaten by the GFM table parser
before the math is read — `$|r|<1$` breaks apart and the leftover `<1` becomes
a JSX tag (hard build error), while `\|` is silently downgraded to a single
bar. The fr files use `\lvert x\rvert` and `\lVert f\rVert` in every table
cell. **Copy those spans byte-for-byte**; never "simplify" them back to bars.
Outside tables, `|` and `\|` are correct and must be left alone.
- Decimal commas inside math stay byte-identical (`0{,}368` stays
  `0{,}368`) — the numbers are the same object in every locale.
- Exam and TD disclaimers must keep their meaning exactly: reconstructed
  preparation material, never an official paper.

Acceptance per unit: from `platform/`, `npm run verify:content` (no flags)
passes once BOTH en and es exist, and each translated file covers exactly
the same content as fr — no dropped paragraph, no summarising, no added
commentary. Do NOT run `npm run build`.
