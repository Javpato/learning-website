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

## Arc 2 dependency contract

| Lesson | Mathematical spine | Proofs that must be visible | Assigned `<Def>` ids | Visualisation |
| --- | --- | --- | --- | --- |
| L05 | quantifier order → pointwise limit → discontinuous limit of continuous functions → need for one rank valid everywhere → uniform convergence → uniform norm → sup criterion → witness sequence → restricting the domain → sliding bump | uniform convergence ⟺ `‖f_n−f‖_∞→0`; refutation by witness (the sup is minorised); ε/3 continuity of a uniform limit; uniform Cauchy criterion (names completeness) | `convergence-simple`, `convergence-uniforme`, `norme-uniforme`, `suite-temoin`, `bosse-glissante` | `UniformConvergenceWidget preset="pic"` |
| L06 | a series of functions is the sequence of its partial sums → uniform convergence through `sup|R_N|` → uniform Cauchy → normal convergence → Weierstrass → the chain normale ⟹ uniforme ⟹ simple with a counterexample for each arrow → where normality actually holds → remainder estimate | normale ⟹ uniforme by the tail of a convergent numerical series; uniforme ⇏ normale on `∑(−1)^n/(n+x²)`; the `sup|R_N|→0` criterion | `serie-de-fonctions`, `convergence-normale`, `critere-de-weierstrass` | `UniformConvergenceWidget preset="serie"` |
| L07 | swapping two limit processes is the general problem → continuity of a uniform limit (cite L05) → `|∫f_n−∫f| ≤ (b−a)‖f_n−f‖_∞` → why the segment is not decoration → term-by-term integration → term-by-term differentiation controls `∑u_n'`, not `∑u_n` → behaviour at the endpoint → hypothesis passport | the `(b−a)‖·‖_∞` bound; term-by-term differentiation via the fundamental theorem plus the integral exchange; the area-one bump counterexample; `√(x²+1/n²)` as a uniform limit that is not differentiable | `interversion-limite-integrale`, `integration-terme-a-terme`, `derivation-terme-a-terme` | `UniformConvergenceWidget preset="aire"` |

## Arc 3 dependency contract

| Lesson | Mathematical spine | Proofs that must be visible | Assigned `<Def>` ids | Visualisation |
| --- | --- | --- | --- | --- |
| L08 | power series → Abel's lemma (bounded at one point ⟹ absolute convergence strictly inside, by geometric domination — the L03 mechanism again) → `R` is well defined → trichotomy inside / outside / on the circle → computing `R` by ratio or root (cite L03) and the lacunary case where neither applies → normal convergence on every `[−r,r]` with `r<R` → the boundary is studied point by point | Abel's lemma; `R` well defined as a supremum; normal convergence on `[−r,r]`; gross divergence for `|x|>R` | `serie-entiere`, `lemme-d-abel`, `rayon-de-convergence`, `intervalle-ouvert-de-convergence` | `PowerSeriesWidget preset="geo"` |
| L09 | expandable function → uniqueness of the coefficients → being `C^∞` is not enough (`e^{−1/x²}`) → the Taylor–Lagrange remainder as the working criterion → the library generated by the geometric series through derivation, integration and substitution → complex exponential and Euler's formula → two payoffs: summing a numerical series, solving a linear ODE by series | uniqueness of the coefficients; expansion of `e^x` by the Taylor–Lagrange remainder; `−ln(1−x)` by term-by-term integration (cites L07 and L08); the `e^{−1/x²}` counterexample | `developpement-en-serie-entiere`, `serie-de-taylor`, `exponentielle-complexe` | `PowerSeriesWidget preset="exp"` |
| L10 | existence at fixed `x` → continuity by domination, with dominated convergence named and its entry point stated → counterexample when domination fails (mass escaping to infinity) → differentiation under the integral sign → the segment case where domination is automatic on a compact → hypothesis passport for the write-up | continuity through sequences plus domination; differentiation through the difference quotient, the mean value theorem and domination; the no-domination counterexample | `integrale-a-parametre`, `hypothese-de-domination`, `derivation-sous-le-signe-integral` | numerical table (no widget exists) |
| L11 | build a parameter so that `F(x₀)` is the wanted integral → justify `F'` → integrate in the parameter → fix the constant by a convenient limit → canonical examples → asymptotics: locate the dominant zone, integrate by parts, **bound the remainder** → `∑1/n = ln N + γ + o(1)` (cites L02) → Stirling | one Feynman example justified end to end, domination included; the integration by parts producing the leading term **and** the remainder bound; `ln N + γ` | `methode-de-feynman`, `developpement-asymptotique` | numerical table |
| L12 | double integral → describing the domain by slices before writing any bound → Fubini–Tonelli for positive functions versus Fubini for integrable ones → counterexample when neither hypothesis holds → change of variables and the Jacobian as a local area factor → polar coordinates → payoffs: the Gaussian integral, the area of an ellipse, a computation done only by swapping the order | Fubini on a rectangle for a continuous function; the Gaussian integral by polar coordinates; the Jacobian as an area factor, proved for a linear map; the order-swap counterexample | `integrale-double`, `theoreme-de-fubini`, `changement-de-variables`, `jacobien` | annotated domain description plus table |

## What must disappear from Arc 2 and Arc 3

These lessons were written against the older FMV fil-rouge template. Rewriting
them means removing, not merely renaming:

- `<Accroche>` — replaced by `<Epigraph>`;
- `<Mission fil="…">` and `<MissionSolved>` — replaced by `<GuidingQuestion>`
  and `<GuidingAnswer>`;
- `## Le plan de bataille` — the numbered sections already announce their tool;
- the line `*Tu te sens à l'aise ? [Attaque directement le TD](…)*`;
- the label `**Exemple (physique) n.**` — becomes `**Exemple n.**`.

Physics and chemistry may still **illustrate** a numbered `**Exemple**`. They may
never be the page's narrative spine, and no lesson may be organised around a
scenario. A worked example that only exists to keep a story alive is deleted.

Preserve unchanged: every `LessonMeta`, `RelatedExercises` and
`LessonStateSelector` id; the assigned `<Def>` id set; the exact widget tag and
its `preset`.

## Mathematical quality checks

- Every symbol is defined before its first proof-level use.
- Every theorem's hypotheses are checked in worked examples.
- Every strict boundary is illustrated by examples on both sides.
- `r_n=O(v_n)` is expanded into an eventual inequality before a series of
  remainders is classified.
- Finite identities are proved before limits are taken.
- No numerical graph or finite table is described as proof of convergence.
- Related TD exercises are genuinely prepared by the lesson.

## The two non-lesson pages

### `00-boite-a-outils` — the exam toolbox

L00 is not an arc lesson: it has no `<GuidingQuestion>` and no
`<RelatedExercises>`. It is the track's weapons page — the tricks, the formulas
and the intuitions a learner needs *before* and *during* an exam — while keeping
its non-blocking diagnostic framing (nothing here gates anything).

Ten sections, each built as: reflex → the trick → why it works → two
mini-exercises.

1. Limits: five gestures — simplify, factor the dominant power, conjugate
   quantity, `u_n^{1/n}=e^{(1/n)\ln u_n}`, comparative growth. Places
   `<Def id="croissances-comparees">` **with the ratio argument that proves the
   ladder**, not just the ladder.
2. Equivalents and negligible terms — keeps `equivalent` and `negligeable`.
3. Taylor–Young — keeps `formule-de-taylor-young`; adds how the cancellations
   choose the order.
4. Bounding — the classical inequalities, and the rule that decides all of
   Arc 2: *a useful bound no longer contains the variable*.
5. Monotone and recurrent sequences — `<Def id="theoreme-des-suites-monotones">`,
   `<Def id="suites-adjacentes">`, and the `u_{n+1}=f(u_n)` method.
6. Finite sums — telescoping,
   `<Def id="decomposition-en-elements-simples">`, index shift, splitting even
   and odd, `<Def id="formule-de-stirling">`.
7. Integration reflexes — `<Def id="integrale-impropre">` and the two reference
   scales. Load-bearing for L02, L07, L10, L11 and L12.
8. Handling ε and quantifiers — what "from some rank on" licenses, ε/2 and ε/3,
   negating a statement, why swapping `∀x` and `∃N` changes the mathematics.
9. The intuitions worth having — one short boxed paragraph each, every one
   naming the lesson that proves it.
10. Self-diagnosis grid — *if this blocked you → this section → this lesson*.

`<LessonStateSelector id="math-an-c00" />` stays the final line.

### `formulaire` — a decision instrument, not a formula dump

The formula sheet is what a learner holds during a TD. It must let them **decide**,
not merely look things up. Every criterion carries its blind case; every
non-implication carries its counterexample; every theorem carries the sentence
that invokes it correctly. It ends with the mistakes that cost marks and a map
from exam question type to tool to the sentence to write.

The formulaire carries no `<Def>` — only `<Terme>` links, and only to ids that
already exist in `glossaire-analyse.ts`.

## MDX and verification

- Preserve `LessonMeta`, `RelatedExercises`, `LessonStateSelector` ids and the
  exact assigned widget preset.
- Preserve the assigned `<Def>` set; never invent glossary ids.
- **`$$` fences must sit on their own lines.** micromark closes a multi-line
  math block ONLY on a bare `$$` line. `$$content…\n…content$$` silently swallows
  the rest of the page — lesson 05 lost 90% of its content with a green build.
  Single-line `$$…$$` is fine. Now enforced by `verify-content.cjs`.
- Inline math never spans a line break. When wrapping words in `<Terme>` or
  reflowing a paragraph, keep every `$…$` span intact on one line.
- No KaTeX in string props. Keep blank lines inside compound components.
- Every `<QItem>` contains a correct option.
- `<LessonStateSelector>` is the final line.
- Run from `platform/`:

```sh
npm run verify:content
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=14336 npm run build
```
