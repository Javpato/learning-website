---
name: course-translate
description: Use when translating platform course content from French into English or Spanish (content.en.mdx / content.es.mdx siblings), when mirroring a glossary keyword-link pass across locales, or when a locale-parity check fails. Covers the FR-first rule, the numbered-block label table, terminology agreement with the glossary, Def/Terme id mirroring, and the insertion-only link-pass verification.
---

# Course translation & link passes

Source of truth for the conventions:

- `codex-fmv-translate.md` — the retranslation work order (read in full before a
  translation batch).
- `codex-translate.md` — the base translation rules it builds on.
- `codex-fmv-links.md` — the keyword→definition link pass.
- The `mdx-safety` skill — before touching any `.mdx`.

## The invariant

French is authored first. `content.en.mdx` and `content.es.mdx` are faithful,
**complete** translations of the French sibling — no dropped paragraphs, no
summarising — and structurally identical to it. `verify:content` enforces the
structural half; completeness is on you.

Translate prose and text-valued string props. **Never** change component names
or structure, `id` props, numeric props, math content, numbers, units, or
hrefs. Decimal-comma math stays byte-identical.

## Locale parity is a hard check

`verify-content.cjs` enforces that a translated file references exactly the same
structural ids as its French sibling — same exercises, same lesson/exam anchors,
same `Def:`/`Terme:` sets. Keep every `<Def id>` and `<Terme id>` with an
identical id, placed on the equivalent translated word:

```
<Def id="ligne-de-niveau">**level curve**</Def>
<Def id="ligne-de-niveau">**curva de nivel**</Def>
```

Terminology must agree with the `label` / `short` fields in
`platform/lib/content/glossaire-<track>.ts` — read it before starting. British
English matches the glossary labels.

## Numbered block labels

| FR | EN | ES |
| --- | --- | --- |
| Définition | Definition | Definición |
| Exemple | Example | Ejemplo |
| Exemple (chimie) | Example (chemistry) | Ejemplo (química) |
| Remarque | Remark | Observación |
| Méthode | Method | Método |
| Étape | Step | Paso |
| *Pourquoi ?* | *Why?* | *¿Por qué?* |
| Le plan de bataille | The battle plan | El plan de batalla |
| Prédis / Agis / Observe / Relie | Predict / Act / Observe / Connect | Predice / Actúa / Observa / Relaciona |

Keep block numbers identical to the French. Section titles keep their
goal-phrased shape. French university terms (TD, partiel, colle…) stay in
French with a gloss at first use. Same warm « tu » register throughout.

## Link passes are insertion-only

Per `codex-fmv-links.md`: wrap existing words, never rewrite, add or delete
prose. Verify mechanically — **strip the `<Terme>` tags from the added diff
lines; the result must equal the removed lines as a multiset.** If it does not,
prose was changed and the pass is rejected.

Wrap the first occurrence of each glossary term per `<ExerciseView>`, per
`<ExamProblem>`, or per section in a formulaire. Never wrap inside `$…$`/`$$…$$`,
headings, string props, an existing `<Terme>`/`<Def>`, or "Théorie utile" links.
Only ids that exist in the glossary — report missing terms, never invent ids.

## The machine-translation fast path

`platform/scripts/mt-translate.cjs` does the mechanical 90% of a translation
batch with **no model tokens at all**. Never paste raw MDX into a translation
engine — it strips `\qquad`, translates `id` props and reflows `$$` fences.
The script exists so that cannot happen: it ships the engine *prose only*.

```
cd platform
npm run mt:extract -- "app/[locale]/math/analyse-convergence/07-series-entieres"
# .mt/bundle/001.txt … — paste each into translate.google.com
#   Text tab (chunks are pre-sized to the 5000-char box), or Documents tab
#   (takes a .txt whole). Save results as .mt/out.en/001.txt, 002.txt, …
npm run mt:inject -- --to en
npm run verify:content
```

`node scripts/mt-translate.cjs auto --to en,es` skips the copy-paste entirely
via an unofficial keyless endpoint — convenient for a small batch, but the
bundle files always work and are the fallback if it rate-limits.

What the tool guarantees, and what it does not:

- **Guaranteed.** Component names and nesting, every `id`, all `$…$`/`$$…$$`,
  code fences, hrefs, numbers, units and non-prose props (`expected`,
  `starter`, `of`, `unit`, `provenance`, `work`) come through byte-identical —
  the skeleton holds them and the engine never sees them. Verified by an
  identity round-trip over all 132 French files: extract, re-inject
  untranslated, and the result equals the source. Only `title`, `task`,
  `hint`, `fil` and `label` prop values are translated.
- **Guaranteed.** No silent corruption. Each segment must return with every
  one of its `{{k}}` masks; if the engine drops one — it does, occasionally,
  around `<Terme>` pairs — that segment falls back to **French** and is listed
  in `.mt/report.<loc>.txt`, with a ready-to-paste `.mt/retry.<loc>.txt`
  holding just the stragglers. Re-translate it, drop the result into
  `.mt/out.<loc>/` as a new file, inject again: repeated `[[n]]` markers win.
- **Guaranteed.** Terminology. After translation the glossary `label.fr →
  label.<loc>` map and the numbered-block label table above are forced onto
  the output, and every `<Def id="x">` inner text is pinned to the canonical
  glossary label for `x`.
- **NOT guaranteed: that the prose is good.** MT output is structurally
  perfect and stylistically mediocre — it produced "Infinite thread" for *fil
  infini*, "Center of a turn" for *centre d'une spire*, "Attack the TD" for
  *attaque le TD*, and loses the warm « tu » register. **Treat the injected
  file as a draft skeleton, not a finished translation.** The remaining job is
  an editing pass over prose that is already correctly placed — much cheaper
  than translating from scratch, but it is not optional.

## Gates

During an FR-first window: `VERIFY_SKIP_PARITY=1 npm run verify:content`.
Once both en and es exist: plain `npm run verify:content` must pass.
Final glossary completeness: `VERIFY_STRICT_GLOSSARY=1 npm run verify:content`.
