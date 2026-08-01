# Sources — track « Analyse & convergence »

Research record for the analysis track, written before the spec
(`COURSE_PLAYBOOK.md` §2 step 1). FMV's sources were never written down; this
file exists so the next agent does not have to re-derive them.

## 1. Primary evidence

| Source | What it is | Where it lives | Confidence |
| --- | --- | --- | --- |
| Polycopié du cours | Séries numériques → suites/séries de fonctions → séries entières → fonctions de plusieurs variables & intégrales doubles → intégrales à paramètre, plus des compléments (exponentielle complexe, Bâle, produits infinis, méthode de Feynman) | **not in this repo** — analysed second-hand | high (analysis is detailed and quotes the material) |
| Partiel 2020 + corrigé | 4 problèmes : équivalents, d'Alembert, alternées, perturbation `u_n/(1+u_n)`, norme uniforme de `√(x²+1/n)` | idem | high |
| Partiel 2022 | Vrai/faux avec preuve ou contre-exemple, estimation de restes, cas frontière, dérivation terme à terme | idem | high |
| Partiel + final 2023 | Développements asymptotiques, bosses glissantes, comportement au bord, fonction auxiliaire à dérivée nulle (Euler/Bâle), dérivation sous l'intégrale, IPP pour un équivalent | idem | high |
| `deep-research-report.md` (racine du dépôt) | L'analyse pédagogique complète de tout ce qui précède : diagnostic, patrons de raisonnement, brèches cours↔examen, banc d'exercices, examen de validation avec corrigé | ce dépôt | — |

**Honest gap.** The PDFs themselves (polycopié, sujets, corrigés) are *not* in
the repository. Everything below is derived from `deep-research-report.md`,
which quotes and analyses them. If the PDFs are ever added, re-check: the
official weekly schedule, the official marking rubric, the exact weight of
double integrals, and the corrigé of the 2023 final — the report flags all four
as **non spécifiés**.

Institutional framing recorded by the report: L2 Physique, 5 ECTS, 24 h CM +
24 h TD, official description insisting on *critères de convergence,
convergences simple / uniforme / normale, propriétés des sommes de séries de
fonctions, séries entières, intégrales à paramètre*. This is **not** the
Paris-Saclay L2 Chimie UE that the FMV and EM tracks reconstruct — so the
`officiel` / `reconstruction` provenance wordings of those tracks (which name
Paris-Saclay L2 Chimie explicitly) must not be reused here. The track uses the
`polycopie` provenance introduced for it: *reconstruit à partir du polycopié du
cours et de ses annales*, never presented as an official document.

## 2. Genre conventions kept

The chapter rhythm is the one `COURSE_PLAYBOOK.md` §1 already extracted from
the French polycopié corpus (Exo7 « Suites et séries », Poitiers, Toulouse III),
confirmed by the report's own description of this polycopié:

> définition → propriété/théorème → démonstration → exemple, chapitre par
> chapitre, avec des exemples canoniques réutilisables.

Conventions worth keeping verbatim, because the exams reward them:

- **Séries de référence nommées à voix haute** — `∑1/n^α`, `∑r^n`,
  `∑1/(n(ln n)^α)`. A solution that does not name its reference series is not
  a solution.
- **Contre-exemples canoniques** — harmonique, harmonique alternée, `x^n` sur
  `[0,1]`, `nxe^{-nx}`, `√(x²+1/n²)`, bosses glissantes. The exams reuse this
  exact small library.
- **Démonstrations constructives** — the estimate is shown to *come from*
  somewhere; that is what makes the technique transferable.

## 3. The genre's defects this track fixes

Straight from the report's diagnostic table (§ *Brechas entre el curso y los
exámenes*), reordered by how much each costs a student in an exam:

| Gap in the source polycopié | Fix in this track |
| --- | --- |
| No decision tree for choosing a criterion | Fiche de reconnaissance + « Méthode » blocks; and exercises where the *first* criterion fails |
| Criteria read as bi-conditionals | Every théorème block carries an explicit **cas non concluant** line |
| Counterexamples scattered in the theory | A per-lesson bank, organised by *which hypothesis fails* |
| Simple vs uniforme vs normale defined but not operationalised | Table of implications **and non-implications**, each non-implication carrying its counterexample |
| Interchange theorems proved but not templated | « Passeport d'hypothèses » — a 4-line writing template repeated until automatic |
| Sup computation shown by example only | A general routine: dérivée → point critique → valeur; sinon majoration; sinon suite témoin `x_n` |
| Boundary/singularity handling improvised | Protocol: intérieur d'abord, extrémité ensuite, séparément |
| Auxiliary-function design shown as magic | Reverse-engineering exercises: the wanted cancellation is given, the function is to be found |
| « Justifier précisément » never decomposed | Rédaction rubric: structure / calcul / référence / conclusion |
| Index does not match the appended complements | Explicit **noyau évalué / structurel / approfondissement** tagging (`provenance`) |

## 4. What the exams actually test (drives every Mission)

Eight cognitive operations, from the report's table — the track's lessons are
built so that each one is trained somewhere explicit:

| Operation | Signal in the statement | Trained in |
| --- | --- | --- |
| Classer | « étudier la nature » | L01–L04 |
| Réduire | expression compliquée | L02, L03 |
| Vérifier | « appliquer le théorème du cours » | L07, L10 |
| Réfuter | « vrai ou faux » | L04, L05, L06 |
| Quantifier | « calculer la norme », « majorer le reste » | L04, L05 |
| Localiser | « uniformément sur … » | L05, L06, L07 |
| Synthétiser | fonction auxiliaire, intégrale à paramètre | L09, L10, L11 |
| Rédiger | « justifier précisément » | every MissionSolved + the formulaire's rédaction templates |

Six recurring reasoning patterns to keep alive across the track (report §
*Patrones recurrentes*): réduction asymptotique · décomposition d'une
perturbation (`u_n/(1+u_n) = u_n − u_n²/(1+u_n)`) · point-par-point vs global ·
bosses glissantes (support / hauteur / aire) · passeport d'hypothèses ·
fonction auxiliaire à dérivée nulle.

## 5. Fil rouge policy

FMV runs a chemistry fil rouge because it serves L2 Chimie. This UE is a
physics analysis course, so the fils rouges are **physical**: a decaying signal
sampled term by term, an RC discharge, a vibrating string's Fourier-like
superposition, black-body-style sums, the diffusion kernel, Feynman's parameter
trick on a real integral. Rule 9 still applies unchanged — one system per
lesson, present in the five fixed slots, same symbols throughout — and the
lesson-to-lesson chaining permitted by Rule 9 is used for the *signal*
`u_n = e^{-n/τ}` arc (L01 → L03 → L06 → L09).

## 6. Non-goals

- Not a replacement for the FMV track's multivariable chapters: continuity and
  differentiability in `ℝ²` stay there and are cross-linked, not re-taught. This
  track adds only what the polycopié adds on top — Fubini, changement de
  variables, jacobien (L12).
- No content gating, ever (`AGENTS.md`). Exams and corrigés stay open.
