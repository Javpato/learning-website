# Work order — « Analyse & convergence », cours mathématique guidé par les preuves

Read `AGENTS.md`, `platform/CLAUDE.md`, `RESOURCES-analyse.md` and
`COURSE_PLAYBOOK.md` before editing. Work on one named lesson only unless the
prompt explicitly requests a whole arc.

The audience is a second-year physics student who knows elementary sequences,
limits, derivatives and integrals. The course is nevertheless organised by
the **mathematics**, not by a chemistry or physics story. Applications may
illustrate a theorem, but they never provide the page's narrative spine.

French is the authoring language. During a French-first pass, leave
`content.en.mdx` and `content.es.mdx` untouched; preserve the registry and
glossary token sets so `npm run verify:content` can still pass.

## Pedagogical promise

Every lesson must let the learner answer four questions:

1. What mathematical problem forces this definition?
2. What does the theorem really say, including its hypotheses and blind case?
3. Why is it true, step by step?
4. How do I recognise and write its use in an exercise?

Proofs are not optional enrichment. Every result specific to this series
course is proved. Foundational facts about real sequences (completeness,
monotone convergence) may be recalled and named without rebuilding the real
numbers, but the proof must say exactly where they enter.

## Canonical lesson structure

```mdx
# <Titre formulé comme une capacité ou une question>

<LessonMeta id="math-an-cNN" />

<Epigraph author="…" work="…" href="…" translated>
« Citation courte et vérifiée. »
</Epigraph>

<Toc depth={2} />

<GuidingQuestion>
Une question mathématique précise, compréhensible avant le vocabulaire du chapitre.
</GuidingQuestion>

## 1. <Première dépendance mathématique>
intuition → besoin → définition → exemple immédiat → théorème → preuve → cas non concluant

### Mini-exercices

## 2. <Outil suivant>
…

## Exemple calculé — <mécanisme transférable>
Étapes accompagnées d'un « Pourquoi ? »

## Visualisation guidée
widget existant ou table numérique ; Prédis → Agis → Observe → Relie

## Pièges classiques

## Vérification rapide

<GuidingAnswer>
Réponse nette à la question du départ.
</GuidingAnswer>

## Résumé — <fonction du résumé>
<KeyResults title="…">table de décision + idées de preuve</KeyResults>

<RelatedExercises id="math-an-cNN" />
<LessonStateSelector id="math-an-cNN" />
```

L00 remains a diagnostic bridge and does not need a guiding question.

## Rules for exposition

1. **One verified epigraph per lesson.** Use a primary source or academic
   edition. Give author, work and a stable source link. Mark a translation as
   such; never silently modernise or invent a quotation.
2. **The guiding question is mathematical.** It may be a paradox, a contrast
   or a precise classification problem. It returns in `<GuidingAnswer>`.
3. **No cold definitions.** State the problem that requires the word before
   introducing it.
4. **Define before use.** Assigned glossary terms receive their unique `<Def>`
   at the definition site. Terms from earlier lessons use `<Terme>` at their
   first important occurrence. Define non-glossary prerequisites in prose
   before relying on them.
5. **Number definitions and results.** Cite those numbers later so the learner
   can see the dependency chain.
6. **Core proofs stay open.** Use `<Proof title="…">`. Begin with the proof
   idea, motivate each major step, and end with **Ce que la preuve apprend**.
   `<Collapsible>` is reserved for optional variants, long computations and
   exercise answers.
7. **A proof cannot import an unnamed tool.** If it uses completeness, the
   Cauchy criterion, bounded partial sums, a Taylor remainder or a comparison,
   name and explain that fact first.
8. **Every criterion has a blind-case paragraph.** Say what failure of an
   hypothesis permits and does not permit. Never present a one-way criterion
   as an equivalence.
9. **Every counterexample identifies the failed implication.** Verify the
   proposed hypothesis, then show explicitly why the conclusion fails.
10. **Worked examples explain decisions.** Each `Étape` has one `Pourquoi ?`
    that names a goal, a hypothesis or a previous result.
11. **Use fading.** Fully annotated example → short guided attempt → bare quiz.
12. **Visualisations are evidence for intuition, not proofs.** Use at most two
    guided cycles and connect each observation to the relevant theorem.
13. **Mini-exercises close each conceptual section.** Keep them under two
    minutes and include answers immediately behind a collapsible or quiz.
14. **The summary is not a formula dump.** It answers the guiding question,
    gives a compact decision table, lists hypotheses/blind cases, and names
    the proof ideas the learner should reconstruct.
15. **Tone:** warm French `tu`, precise and non-judgmental. Density over
    repetition; remove duplicated explanations and ornamental scenarios.

## Arc 1 dependency contract

| Lesson | Mathematical spine | Proofs that must be visible | Assigned `<Def>` ids | Visualisation |
| --- | --- | --- | --- | --- |
| L01 | finite partial sums → convergence → Cauchy tails → exact motifs → remainder | necessary term condition; series Cauchy criterion; geometric sum; telescoping; harmonic divergence | `serie-numerique`, `somme-partielle`, `serie-convergente`, `reste-d-une-serie`, `serie-geometrique`, `serie-harmonique`, `serie-telescopique` | `SeriesConvergenceWidget preset="geo"` |
| L02 | positive terms → bounded partial sums → comparison → equivalents → integral test | positive-series criterion; direct comparison; equivalent comparison; rectangle bounds; Riemann classification | `serie-a-termes-positifs`, `critere-de-comparaison`, `serie-de-riemann`, `comparaison-serie-integrale` | `SeriesConvergenceWidget preset="riemann"` |
| L03 | ratio/root as geometric domination → boundary → controlled remainders | d'Alembert; Cauchy root; why `L=1` fails; `O(1/n^p)` summability for `p>1` | `regle-de-d-alembert`, `regle-de-cauchy`, `cas-douteux` | numerical quotient table |
| L04 | absolute convergence → Leibniz → controlled perturbation → Abel–Dirichlet | absolute convergence via Cauchy tails; Leibniz and remainder; Abel identity; bounded-tail criterion | `convergence-absolue`, `semi-convergence`, `serie-alternee`, `critere-de-leibniz`, `transformation-d-abel` | `SeriesConvergenceWidget preset="alternee"` |

Later arcs must follow the same proof-led structure, but their detailed
dependency tables should be revised only when those arcs are explicitly in
scope.

## Mathematical quality checks

- Every symbol is defined before its first proof-level use.
- Every theorem's hypotheses are checked in worked examples.
- Every strict boundary is illustrated by examples on both sides.
- `r_n=O(v_n)` is expanded into an eventual inequality before a series of
  remainders is classified.
- Finite identities are proved before limits are taken.
- No numerical graph or finite table is described as proof of convergence.
- Related TD exercises are genuinely prepared by the lesson.

## MDX and verification

- Preserve `LessonMeta`, `RelatedExercises`, `LessonStateSelector` ids and the
  exact assigned widget preset.
- Preserve the assigned `<Def>` set; never invent glossary ids.
- Inline math never spans a line break. Multi-line display fences are bare
  `$$` lines with blank lines around the block.
- No KaTeX in string props. Keep blank lines inside compound components.
- Every `<QItem>` contains a correct option.
- `<LessonStateSelector>` is the final line.
- Run from `platform/`:

```sh
npm run verify:content
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=14336 npm run build
```
