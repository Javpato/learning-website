# Work order — Write the « Analyse & convergence » lessons as a true cours

Read `AGENTS.md` and `platform/CLAUDE.md` first; every rule there applies.
Read `RESOURCES-analyse.md` (what the source polycopié and its annales
actually demand) and `COURSE_PLAYBOOK.md` §1 before writing a line.
This order is executed one LESSON at a time — do ONLY the lesson named in
your prompt (`L00` … `L12`), nothing else.

**Writable file: exactly one** — the named lesson's
`platform/app/[locale]/math/analyse-convergence/<slug>/content.fr.mdx`
(it currently holds a placeholder stub; replace it entirely).
NEVER touch: `page.tsx` wrappers, `lib/content/*.ts`, components, styles,
other lessons, TDs, exams, `content.en.mdx` / `content.es.mdx` (they are
regenerated later from your fr).

## Who this is for, and what goes wrong without these rules

The learner is a second-year physics student who can differentiate and
integrate but has never met an infinite sum that needs a licence. The
defects to eliminate are the ones the report `deep-research-report.md`
found in the source material, phrased as the learner would:

1. « On m'a donné cinq critères, mais personne ne m'a dit lequel choisir. »
   → every criterion arrives with the *signal* that calls for it, and every
   theorem block carries its **cas non concluant** line.
2. « Le corrigé sort un équivalent de nulle part. » → every worked-example
   step carries its explicit purpose (Rule 7).
3. « Je confonds convergence simple et uniforme. » → quantifier order is
   taught in words, in pictures and in a witness sequence, never once.
4. « J'ai appliqué le théorème et j'ai eu zéro. » → the **passeport
   d'hypothèses**: hypotheses listed, checked, then the theorem named.
5. « Je sais que c'est faux mais je n'arrive pas à le prouver. » → a
   counterexample bank organised by *which hypothesis fails*.
6. « À l'examen je perds les points sur la rédaction. » → each lesson's
   MissionSolved is a model answer, written the way it must be handed in.

## Lesson skeleton (exact order — components must all survive)

```mdx
# <Titre orienté but>                      ← goal-phrased, never a bare noun
<LessonMeta id="math-an-cNN" />            ← id UNCHANGED (see the table)
<Toc />

<Accroche>…</Accroche>                     ← 1 sentence, intuitive

<Mission fil="…">                          ← the 4-part mission (Rule 1)
…
</Mission>

*Tu te sens à l'aise ? [Attaque directement le TD](../td-N/)…*   ← keep

## Le plan de bataille                     ← advance organizer, 3-5 lines

## <Section 1 — titre but>                 ← one section per outil
   (motivation → Définition → exemples → remarque → mini-exercices)

## Exemple calculé — <ce qu'on va en tirer>
   (fully-annotated worked example, per-step Pourquoi)

## Visualisation guidée                    ← scripted on the fil rouge
   … <XxxWidget preset="…" />              ← EXACT tag from the table

## Pièges classiques                       ← <Pitfall> blocks

## Vérification rapide                     ← <Quiz> mini-check

<MissionSolved>                            ← SOLVES the mission's numbers
…
</MissionSolved>

## Résumé de la leçon
<KeyResults title="L'essentiel">…</KeyResults>

<RelatedExercises id="math-an-cNN" />      ← only if the lesson has exercises
<LessonStateSelector id="math-an-cNN" />   ← id UNCHANGED, LAST line
```

`<Collapsible>` blocks hold the fully rigorous layer (démonstrations, cas
limites) — RIGOR IS NEVER DELETED, only folded.

## The 12 writing rules (all mandatory)

1. **Mission = 4 parts, ≤ 8 lines, concrete numbers.** (i) *Situation*: one
   quantitative physics scenario using the lesson's fil rouge system.
   (ii) *Question précise*: a number or a decision at stake. (iii) *Obstacle
   nommé*: one sentence on why the previous toolbox fails. (iv) *Contrat*:
   « Dans ce chapitre : N outils (…). À la fin, on résout ce problème,
   chiffres à l'appui. » TEST: the mission must be understandable using ZERO
   vocabulary defined in this chapter — no « converge », no « uniforme », no
   « rayon » in the Situation or the Question.
2. **Plan de bataille** right after: the N tools, one line each, phrased as
   capabilities (« majorer l'erreur partout à la fois »). Each section opens
   by naming the tool it delivers.
3. **No cold definitions.** Immediately before every Définition, one
   sentence: « Problème : … Il nous faut donc un mot/outil pour … ».
4. **Numbered blocks, Exo7 style.** `**Définition 1 (série convergente).**`,
   `**Exemple 2.**`, `**Théorème 1 (critère de Leibniz).**`,
   `**Méthode (choisir un critère).**`, `**Remarque.**` (unnumbered).
   Per-type counters, per lesson. Cite later by number (« d'après le
   Théorème 1 »).
5. **Définition → exemple immédiat → contre-exemple ou Remarque**, within a
   few lines.
6. **Define-before-use + `<Def>`/`<Terme>`.** Each glossary term assigned to
   this lesson (table below) is wrapped at ITS definition site, exactly
   once: `<Def id="convergence-uniforme">**convergence uniforme**</Def>` —
   inside the Définition sentence, NEVER inside a heading. Include the
   informal gloss in parentheses right there. Terms defined in ANOTHER
   lesson are linked at first use with `<Terme id="…">`. Ids come from
   `platform/lib/content/glossaire-analyse.ts` (and `glossaire-fmv.ts` for
   the multivariable terms) — never invent one; report a missing term
   instead.
7. **Worked example: action + Pourquoi, every step.**
   `**Étape 2 — <action>.** <calcul>` then `*Pourquoi ?* <but ou bloc cité>`.
   The Pourquoi names a GOAL or cites a numbered block; it never paraphrases
   the action. (« On passe à la valeur absolue pour pouvoir utiliser le
   Théorème 1, qui ne parle que de termes positifs. » — never « on met des
   valeurs absolues ».) End with ONE self-explanation prompt in a
   `<Collapsible title="Question de compréhension — réponse">`.
8. **Fading.** Fully annotated example → next example leaves its last steps
   « À toi » → Vérification rapide asks with no scaffolding.
9. **One fil rouge physics system per lesson** (table below), present in five
   slots: Mission, ≥ 1 `**Exemple (physique) n.**` per major section, one
   notation Remarque (« en TP tu noteras plutôt … — même objet, autre
   habit »), the Visualisation guidée, and MissionSolved. Same symbols
   throughout. The signal `u_n = e^(−n/τ)` arc chains L01 → L03 → L06 → L09.
10. **Visualisation guidée, not posée.** 2-3 cycles max, each *Prédis* →
    *Agis* (phrased on the content: « amène n à 20 et regarde le maximum »,
    never « clique le curseur ») → *Observe* → *Relie* (one line citing the
    numbered block illustrated). Then one line inviting free play. When the
    table assigns no widget, the visualisation is NUMERIC: a small table of
    values the learner computes, same Prédis/Agis/Observe/Relie shape (see
    the FMV lesson `03-limites-continuite` for the model).
11. **Mini-exercices close each tool section**: 2-4 items ≤ 2 min, the first
    on the fil rouge. `<Quiz>`/`<QNumeric>` when checkable, otherwise
    `<Collapsible title="Réponse">`.
12. **MissionSolved solves THE mission** — same numbers, full chain, each
    step citing its tool by block number. The Résumé restates the plan de
    bataille as « ce que tu sais faire maintenant ».

### Three rules specific to this track (they are what the exams grade)

13. **Every criterion block ends with its « cas non concluant » line**:
    what the criterion does NOT allow you to conclude, and what to reach for
    instead. A criterion presented as a bi-conditional is a defect.
14. **Every interchange (limite/somme/intégrale/dérivée) is written with the
    passeport**: hypotheses listed one per line, checked on the spot, THEN
    the theorem named, THEN the conclusion. Four lines, always the same
    shape — that is the rédaction the annales reward.
15. **Each counterexample states which hypothesis it kills.** Format:
    « L'énoncé est faux. Prenons […]. L'hypothèse […] est bien vérifiée
    parce que […]. Pourtant la conclusion […] échoue parce que […]. »

Tone: warm « tu », encouraging, never judgmental. No cultural reference
without a gloss. Target length 350–500 lines; density over bloat.

## Per-lesson assignments

| Lesson | Fil rouge physics system | `<Def>` ids to place (exactly these) | Widget |
| --- | --- | --- | --- |
| L00 `00-boite-a-outils` | mini-rappels ancrés sur un signal échantillonné (PAS de Mission — garder le format pont diagnostique de FMV L00) | `suite-convergente` `equivalent` `negligeable` `formule-de-taylor-young` | — |
| L01 `01-series-numeriques` | un détecteur enregistre à chaque seconde l'énergie d'une bouffée, u_n = e^(−n/τ) avec τ = 3 s : l'énergie totale a-t-elle un sens, et combien vaut-elle ? | `serie-numerique` `somme-partielle` `serie-convergente` `reste-d-une-serie` `serie-geometrique` `serie-harmonique` `serie-telescopique` | `SeriesConvergenceWidget` (`preset="geo"`) |
| L02 `02-series-positives` | une corde vibrante rayonne une puissance P/n^α sur son n-ième harmonique : la puissance totale est-elle finie ? | `serie-a-termes-positifs` `critere-de-comparaison` `serie-de-riemann` `comparaison-serie-integrale` | `SeriesConvergenceWidget` (`preset="riemann"`) |
| L03 `03-dalembert-cauchy` | photon dans une cavité : intensité après n diffusions, u_n = a^n·n!/n^n — à partir de quel a la somme reste-t-elle finie ? (reprend le signal de L01) | `regle-de-d-alembert` `regle-de-cauchy` `cas-douteux` | — (visualisation numérique du rapport u_(n+1)/u_n) |
| L04 `04-alternees-abel` | deux voies d'un interféromètre en opposition de phase, u_n = (−1)^n/√n ; puis un détecteur à réponse saturante qui mesure u_n/(1+u_n) | `convergence-absolue` `semi-convergence` `serie-alternee` `critere-de-leibniz` `transformation-d-abel` | `SeriesConvergenceWidget` (`preset="alternee"`) |
| L05 `05-suites-de-fonctions` | profil d'une bouffée de chaleur mesurée au rang n : f_n(x) = n·x·e^(−n x) sur [0, +∞) — peut-on garantir un écart < 0,01 partout ? | `convergence-simple` `convergence-uniforme` `norme-uniforme` `suite-temoin` `bosse-glissante` | `UniformConvergenceWidget` (`preset="pic"`) |
| L06 `06-series-de-fonctions` | spectre d'un corps chaud : S(x) = ∑ e^(−n x)/n², x étant l'inverse de la température réduite — S est-elle continue en x = 0,05 ? | `serie-de-fonctions` `convergence-normale` `critere-de-weierstrass` | `UniformConvergenceWidget` (`preset="serie"`) |
| L07 `07-theoremes-d-echange` | énergie totale rayonnée = intégrale de la somme des modes : a-t-on le droit de sommer les intégrales, et que se passe-t-il pour une bosse d'aire 1 ? | `interversion-limite-integrale` `integration-terme-a-terme` `derivation-terme-a-terme` | `UniformConvergenceWidget` (`preset="aire"`) |
| L08 `08-series-entieres-rayon` | développement perturbatif d'une réponse en puissances d'un petit paramètre λ : jusqu'où le développement est-il valable ? | `serie-entiere` `lemme-d-abel` `rayon-de-convergence` `intervalle-ouvert-de-convergence` | `PowerSeriesWidget` (`preset="geo"`) |
| L09 `09-developpements-en-serie-entiere` | oscillateur : résoudre son équation par série entière, puis retrouver les phaseurs par l'exponentielle complexe (reprend le signal de L01) | `developpement-en-serie-entiere` `serie-de-taylor` `exponentielle-complexe` | `PowerSeriesWidget` (`preset="exp"`) |
| L10 `10-integrales-a-parametre` | réponse en fréquence d'un filtre RC : G(x) = ∫₀^∞ e^(−t)·cos(x t) dt — existe-t-elle, est-elle dérivable, et que vaut-elle ? | `integrale-a-parametre` `hypothese-de-domination` `derivation-sous-le-signe-integral` | — (visualisation numérique : G(x) tabulée contre 1/(1+x²)) |
| L11 `11-feynman-asymptotiques` | figure de diffraction : calculer ∫₀^∞ sin(t)/t dt en glissant un paramètre d'amortissement e^(−x t) | `methode-de-feynman` `developpement-asymptotique` | — (visualisation numérique du paramètre glissé) |
| L12 `12-integrales-doubles` | masse et moment d'inertie d'une plaque non homogène ; section elliptique d'un faisceau | `integrale-double` `theoreme-de-fubini` `changement-de-variables` `jacobien` | — (visualisation numérique : tranches verticales vs horizontales) |

Terms defined in the FMV track may be linked (never redefined) with
`<Terme id="…">`: `limite`, `continuite`, `differentiabilite`,
`derivee-partielle`, `coordonnees-polaires`, `developpement-limite`.

`relatedExercises` per lesson are listed in
`platform/lib/content/math-analyse.ts` — read your lesson's entry and make
sure the worked examples actually prepare those TD exercises (cite them:
« c'est le mécanisme de l'exercice math-an-td3-02 »).

## MDX safety rules (build breaks otherwise)

- Multi-line `$$` blocks: each `$$` **alone on its own line**, blank lines
  around the block. `$$content…\n…content$$` silently swallows the rest of
  the page (a lesson once lost 90 % of its content behind a green build).
  Single-line `$$…$$` is fine.
- Inline `$…$` NEVER spans a line break.
- Blank line after every opening and before every closing component tag;
  blank line between the prompt and the first `<QOption>` of a `<QItem>`.
- Inside `<QItem>` only `<QOption>/<QFeedback>/<QExplain>`; inside
  `<HintLadder>` only `<Hint>`. Every `<QItem>` has ≥ 1 `correct` option.
- No dollar signs or KaTeX in any component STRING prop (`title="…"`,
  `fil="…"`): plain text there (unicode ∑, ε, α, ⁿ, ₙ are fine).
- No raw `{`, `}`, `<`, `>` in prose outside math.
- `<Def>` never inside a heading; `<LessonStateSelector>` is the LAST line.

## What the pilot (L05) settled — copy these habits

The accepted pilot is
`platform/app/[locale]/math/analyse-convergence/05-suites-de-fonctions/content.fr.mdx`.
**Read it before writing**; it fixes the voice and these conventions:

- Sections are numbered `## 1.`, `## 2.`, `## 3.` and each opens with
  `**Outil n — <verbe>.**` followed by the `Problème : … Il nous faut donc …`
  sentence before each Définition.
- Physics examples are labelled `**Exemple (physique) n.**` and share the
  numbering with the plain `**Exemple n.**` blocks (one counter for both).
- The « cas non concluant » of Rule 13 is written as a
  `**Remarque (cas non concluant).**` block right after the tool it limits.
- Comparison tables (« grandeur / ce qu'elle décide / valeur ici ») are
  markdown tables, never lists — they are what the learner photographs.
- Mini-exercices are a numbered list; a `<QNumeric>` inside item *n* must be
  indented by 3 spaces with a blank line before and after, otherwise MDX
  nests it wrongly.
- The last worked example is the faded one (`**Exemple n — à toi, avec moins
  d'aide.**` + `**À toi :**` + `<Collapsible title="Réponse">`), and the
  self-explanation prompt comes after it, as its own `<Collapsible>`.
- Cross-chapter references are made by NAME, not by lesson number
  (« le chapitre sur les théorèmes d'échange »), so lessons can be reordered.
- MissionSolved numbers every step (**1.**, **2.**, **3.**), cites the block
  it uses, and ends on a sentence that answers the mission's question in
  words, not just in symbols.

## Acceptance checklist (self-verify before finishing)

- [ ] `<LessonMeta>`, `<RelatedExercises>`, `<LessonStateSelector>` ids
      exactly as in the table; nothing else references a registry id.
- [ ] The assigned widget tag with its `preset` is present in Visualisation
      guidée (or the numeric visualisation is there when none is assigned).
- [ ] Every assigned `<Def>` id present exactly once; no others.
- [ ] Mission has the 4 parts and survives the no-chapter-vocabulary test.
- [ ] Every worked-example step has its *Pourquoi ?* line (counts match).
- [ ] Every criterion block has its « cas non concluant » line (Rule 13).
- [ ] Every interchange is written with the passeport (Rule 14).
- [ ] Physics fil rouge present in the five slots (Rule 9).
- [ ] No technical term used before its Def/Terme.
- [ ] From `platform/`: `VERIFY_SKIP_PARITY=1 npm run verify:content` passes.
- [ ] Do NOT run `npm run build` (the orchestrator runs builds; parallel
      runs collide in `.next`).

Finish your run by reporting: assigned Defs placed, terms you wished existed
in the glossary, and anything you had to fold into a `<Collapsible>` rather
than keep inline.
