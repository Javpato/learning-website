# Work order — Retranslate the rewritten FMV lessons to English and Spanish

Read `AGENTS.md` first. This order is executed per LESSON BATCH — do ONLY
the lessons named in your prompt (e.g. « L02 L04 L06 »).

The 11 lesson `content.fr.mdx` files under
`platform/app/[locale]/math/fonctions-plusieurs-variables/` have been
rewritten (new pedagogical template). For each named lesson, regenerate its
`content.en.mdx` and `content.es.mdx` as faithful translations of the NEW
fr file. Writable files: only those `content.en.mdx` / `content.es.mdx`.

All rules of `codex-translate.md` apply (they were used for the first
translation pass): translate all prose and text-valued string props; never
change component names/structure, `id` props, numeric props, math content,
numbers, units, hrefs; keep French university terms (TD, partiel…) with a
first-use gloss; same warm « tu » register; MDX safety (inline math on one
line, blank lines around `$$` and component tags, no dollar signs in string
props).

Additional rules for the new template:

- `<Def id="…">` and `<Terme id="…">` wrappers: KEEP every one, identical
  ids, placed on the equivalent translated word —
  `<Def id="ligne-de-niveau">**level curve**</Def>` /
  `<Def id="ligne-de-niveau">**curva de nivel**</Def>`. The verifier
  enforces identical Def/Terme id sets vs fr per directory.
- Numbered block labels translate as: Définition → Definition/Definición ·
  Exemple → Example/Ejemplo · Exemple (chimie) → Example (chemistry) /
  Ejemplo (química) · Remarque → Remark/Observación · Méthode →
  Method/Método · Étape → Step/Paso · *Pourquoi ?* → *Why?* / *¿Por qué?*
  Keep the numbers identical to fr.
- Terminology must agree with the en/es `label`/`short` fields in
  `platform/lib/content/glossaire-fmv.ts` — read it first.
- Section titles keep their goal-phrased shape (« Le plan de bataille » →
  “The battle plan” / «El plan de batalla»).

Acceptance per lesson: `npm run verify:content` (no flags) passes from
`platform/` once BOTH en and es exist; en and es cover exactly the same
content as fr (no dropped paragraphs, no summarising — full translation).
