# Work order — Rewrite the FMV maths lessons as a true cours

Read `AGENTS.md` and `platform/CLAUDE.md` first; every rule there applies.
This order is executed one LESSON at a time — do ONLY the lesson named in
your prompt (`L00` … `L10`), nothing else.

**Writable file: exactly one** — the named lesson's
`platform/app/[locale]/math/fonctions-plusieurs-variables/<slug>/content.fr.mdx`.
NEVER touch: `page.tsx` wrappers, `lib/content/*.ts`, components, styles,
other lessons, TDs, exams, `content.en.mdx` / `content.es.mdx` (they will be
regenerated later from your fr).

## Why this rewrite (the defects to eliminate)

Learner feedback on the current lessons, verbatim in spirit:

1. « L'information est jetée sur moi — il n'y a aucune raison donnée pour ce
   qu'on introduit. » → every object must be introduced by the problem it
   solves, BEFORE its definition.
2. « La mission est dure à comprendre ; je ne sais pas quel est son but. »
   → the mission must be restatable by the learner in one sentence, without
   le vocabulaire du chapitre.
3. « L'intuition est mauvaise : je ne sais pas ce qu'est IGN, "cuvette",
   "col"… plein de mots qui ne veulent rien dire pour moi. » → zero jargon
   before definition; no franco-French cultural references without gloss.
4. « L'exemple calculé introduit plein de choses sans raison. OK c'est
   symétrique — mais pourquoi tu me dis ça ? » → every worked-example step
   carries its explicit purpose.
5. « Le lien avec la chimie n'est pas ce qui motive le cours, c'est juste
   une section à la fin. » → chemistry drives the chapter from line 1.
6. « La visualisation est superbe mais inutile seule — utilisez-la pour
   expliquer un exemple réel. » → the widget is scripted on the chapter's
   running example.

What the learner explicitly LIKED — keep these blocks and their spirit:
`<KeyResults title="Les formules à garder visibles">`, `<MissionSolved>`
(« la question du départ, résolue »), the `## Résumé de la leçon`, the
`<RelatedExercises>` block, the widgets themselves.

## The model: a real French cours, upgraded

Structure and register follow real L1/L2 polycopiés (Exo7 « Fonctions de
plusieurs variables », Poitiers, Toulouse III): numbered **Définition /
Exemple / Remarque / Méthode / Proposition** blocks, terms never used before
their definition, Mini-exercices closing sections. Upgrades over the genre
(evidence-based): motivation at BLOCK granularity not just chapter top,
per-step purpose annotations in worked examples, one chemistry fil rouge
revisited throughout, scripted use of the interactive widget.

## Lesson skeleton (exact order — components must all survive)

```mdx
# <Titre orienté but>                      ← goal-phrased, never a bare noun
<LessonMeta id="…" />                      ← id UNCHANGED
<Toc />

<Accroche>…</Accroche>                     ← 1 sentence, intuitive

<Mission fil="…">                          ← the 4-part mission (below)
…
</Mission>

*Tu te sens à l'aise ? [Attaque directement le TD](../td-N/)…*   ← keep

## Le plan de bataille                     ← advance organizer, 3-5 lines:
                                             "Pour résoudre ça, il nous faut
                                             N outils : 1… 2… 3…" Each tool
                                             = one section below.

## <Section 1 — titre but>                 ← one section per outil
   (motivation → Définition → exemples → remarque → mini-exercices)

## Exemple calculé — <ce qu'on va en tirer>
   (the fully-annotated worked example, per-step Pourquoi)

## Visualisation guidée                    ← scripted on the fil rouge
   … <XxxWidget />                         ← SAME widget tag, unchanged

## Pièges classiques                       ← <Pitfall> blocks, keep/adapt

## Vérification rapide                     ← <Quiz> mini-check, keep/adapt

<MissionSolved>                            ← SOLVES the mission's numbers
…
</MissionSolved>

## Résumé de la leçon
<KeyResults title="L'essentiel">…</KeyResults>

<RelatedExercises id="…" />                ← id UNCHANGED
<LessonStateSelector id="…" />             ← id UNCHANGED
```

`<Collapsible>` blocks hold the fully rigorous layer (démonstrations,
conditions fines) — RIGOR IS NEVER DELETED, only folded. Everything
mathematically substantive in the current file must survive somewhere in
the new one (moved, folded, rewritten — never dropped).

## The 12 writing rules (all mandatory)

1. **Mission = 4 parts, ≤ 8 lines, concrete numbers.**
   (i) *Situation* : one quantitative chemistry scenario using the chapter's
   fil rouge system. (ii) *Question précise* : answerable, a number or
   decision at stake. (iii) *Obstacle nommé* : one sentence on why the L1
   toolbox fails — this is what makes the chapter's tools feel needed.
   (iv) *Contrat* : « Dans ce chapitre : N outils (…). À la fin, on résout
   ce problème, chiffres à l'appui. » TEST: the mission must be
   understandable using ZERO vocabulary defined in this chapter.
2. **Plan de bataille** right after the mission: the N tools, one line each,
   phrased as capabilities (« mesurer l'effet d'une variable à la fois »).
   Open each section by naming which tool it delivers.
3. **No cold definitions.** Immediately before every Définition block, one
   sentence: « Problème : … Il nous faut donc un mot/outil pour … ».
4. **Numbered blocks, Exo7 style.** Bold labels in prose:
   `**Définition 1 (ligne de niveau).**`, `**Exemple 2.**`,
   `**Remarque.**` (unnumbered), `**Méthode (classer un point critique).**`
   Per-type counters, per lesson. Cite blocks by number later
   (« d'après la Définition 1 »).
5. **Définition → exemple immédiat → contre-exemple ou Remarque.** Every
   Définition is followed within a few lines by at least one concrete
   instance; where confusion is classic, a non-instance.
6. **Define-before-use + `<Def>`/`<Terme>`.** Each glossary term assigned to
   this lesson (table below) is wrapped at ITS definition site, exactly
   once: `<Def id="ligne-de-niveau">**ligne de niveau**</Def>` — inside the
   Définition sentence, NEVER inside a `#`/`##` heading. Include the
   informal gloss in parentheses right there: « le **gradient** (la
   direction de plus forte montée) ». Any term defined in ANOTHER lesson is
   linked at its first use: `<Terme id="point-selle">col</Terme>`. Never a
   raw technical term before its Def/Terme.
7. **Worked example: action + Pourquoi, every step.** Format:
   `**Étape 2 — <action>.** <calcul>` followed by
   `*Pourquoi ?* <but poursuivi ou bloc cité>`. The Pourquoi names a GOAL or
   cites a numbered block — it never paraphrases the action. (« On teste la
   symétrie parce qu'elle divise le travail par deux : tout résultat en
   x > 0 se recopie en x < 0. » — never « on regarde si c'est symétrique ».)
   End the example with ONE self-explanation prompt in a
   `<Collapsible title="Question de compréhension — réponse">`.
8. **Fading.** After the fully-annotated Exemple calculé, the next example
   (in a section or mini-exercices) leaves its last steps « À toi » ; the
   Vérification rapide then asks without scaffolding.
9. **Fil rouge chemistry system** (table below): it appears in the Mission,
   in ≥ 1 `**Exemple (chimie) n.**` per major section, in the Visualisation
   guidée, and in `<MissionSolved>`. Same symbols throughout the lesson.
   Chemistry notation Remarques are mandatory where relevant (e.g. « en
   thermo tu écriras (∂G/∂T)_P — même objet, autre habit »).
10. **Visualisation guidée, not visualisation posée.** 2-3 cycles maximum,
    each: *Prédis* (question before touching) → *Agis* (one manipulation,
    phrased on the CONTENT: « amène le niveau c juste au-dessus de 1 »,
    never « clique le bouton bleu ») → *Observe* (open question) → *Relie*
    (one line citing the numbered block just illustrated). Then one line
    inviting free play. The widget shows the fil rouge system whenever its
    presets allow (e.g. preset « Double puits »).
11. **Mini-exercices** close each tool section: 2-4 items ≤ 2 min each, the
    first reusing the fil rouge. Use `<Quiz>`/`<QItem>`/`<QNumeric>` where
    the answer is checkable, plain `<Collapsible title="Réponse">` prose
    otherwise.
12. **MissionSolved solves THE mission.** Same numbers, full chain, each
    step citing its tool by block number — the learner must see the
    contract honoured. The Résumé then restates the plan de bataille as
    « ce que tu sais faire maintenant ».

Tone: the existing warm « tu », encouraging, never judgmental. No cultural
references without gloss (« carte topographique (carte de randonnée) », not
« carte IGN »). Target length 300–500 lines; density over bloat.

## Per-lesson assignments

| Lesson | Fil rouge system | `<Def>` ids to place (exactly these) | Widget |
| --- | --- | --- | --- |
| L00 `00-remise-a-niveau` | mini-rappels ancrés chimie (pas de Mission — garder le format pont diagnostique) | `developpement-limite` | — |
| L01 `01-geometrie-coordonnees` | géométrie de la molécule d'eau (positions, distances, angle HOH) ; orbitales → sphériques | `coordonnees-polaires` `coordonnees-cylindriques` `coordonnees-spheriques` | — |
| L02 `02-surfaces-lignes-de-niveau` | surface d'énergie potentielle d'isomérisation E(q₁,q₂)=(q₁²−1)²+q₂² : deux vallées (isomères), un passage | `champ-scalaire` `graphe` `ligne-de-niveau` `ensemble-de-niveau` `fonction-partielle` | `SurfaceLevelWidget` (preset « Double puits ») |
| L03 `03-limites-continuite` | robustesse d'un modèle près d'un point singulier (propriété d'un mélange binaire au coin de composition) | `limite` `continuite` | — |
| L04 `04-derivees-partielles-gradient` | enthalpie libre G(T,P) au labo : T monte de 2 K PENDANT que P chute de 0,1 bar — de combien varie G ? | `derivee-partielle` `gradient` `plan-tangent` `differentielle-totale` `regle-de-la-chaine` `derivee-directionnelle` `differentiabilite` | `GradientWidget` |
| L05 `05-propagation-incertitudes` | masse volumique ρ = m/V mesurée en TP : donner ρ ± u(ρ) proprement | `incertitude-type` `propagation-des-incertitudes` `covariance` | — |
| L06 `06-points-critiques-extrema` | la même SEP qu'en L02 : localiser réactifs, produits (minima) et état de transition (col) par le calcul | `point-critique` `point-selle` `extremum-local` `hessienne` | `CriticalPointsWidget` |
| L07 `07-systemes-differentiels-portraits-de-phase` | cinétique oscillante (réaction autocatalytique proie-prédateur) : concentrations qui tournent au lieu de s'éteindre | `systeme-differentiel` `portrait-de-phase` `trajectoire` `point-d-equilibre` `isocline` `stabilite` `linearisation` `jacobienne` | `PhasePortraitWidget` |
| L08 `08-systemes-conservatifs-hamiltoniens` | vibration d'une liaison diatomique sans frottement : osciller au fond du puits ou dissocier — la séparatrice est le seuil | `systeme-conservatif` `hamiltonien` `separatrice` | `PhasePortraitWidget` |
| L09 `09-systemes-lineaires-similitude` | cinétique A→B→C : deux constantes de vitesse, deux échelles de temps — lesquelles gouvernent ? | `valeur-propre` `vecteur-propre` `plan-trace-determinant` `polynome-caracteristique` `noeud` `foyer` | `TraceDetWidget` |
| L10 `10-oscillateur-harmonique-modes-normaux` | spectroscopie IR de CO₂ : pourquoi deux bandes ? modes symétrique et antisymétrique | `oscillateur-harmonique` `pulsation-propre` `amortissement` `mode-normal` | `OscillatorWidget` |

The glossary entries (labels + one-line glosses) live in
`platform/lib/content/glossaire-fmv.ts` — read it; your Définition wording
must agree with the `short` gloss. If a term you need is missing from the
glossary, DO NOT invent an id: write the definition without `<Def>` and
report the missing term at the end of your run.

Read for continuity before writing: the current version of the target
lesson (its academic content is your raw material), the target lesson's
entry in `platform/lib/content/math-fmv.ts` (objectives, relatedExercises —
the worked examples should feed those TD exercises), and the previously
rewritten lesson if any (voice continuity).

## Model mission (L02) — the register to hit

```mdx
<Mission fil="La vie d'une réaction sur sa surface d'énergie — lire le paysage E(q₁,q₂)">
Une molécule peut exister sous deux formes (deux isomères). Son énergie
dépend de deux angles internes : $E(q_1, q_2) = (q_1^2-1)^2 + q_2^2$, en
électron-volts. **Question :** combien ce paysage a-t-il de vallées, où
sont-elles, et quelle énergie faut-il fournir pour passer de l'une à
l'autre ? **L'obstacle :** en L1 tu savais tracer $f(x)$ — mais ici il y a
deux variables, et un « graphe » serait une surface en 3D qu'on ne sait ni
dessiner ni lire directement. **Le contrat :** ce chapitre te donne 3 outils
(les lignes de niveau, les fonctions partielles, la lecture de carte) ; à la
fin, tu répondras à cette question par le calcul, chiffres à l'appui.
</Mission>
```

## MDX safety rules (build breaks otherwise)

- Inline `$…$` NEVER spans a line break; long math goes in `$$` blocks with
  blank lines around them.
- Blank line after every opening and before every closing component tag;
  blank line between the prompt and the first `<QOption>` of a `<QItem>`.
- Inside `<QItem>` only `<QOption>/<QFeedback>/<QExplain>`; inside
  `<HintLadder>` only `<Hint>`. Every `<QItem>` has ≥ 1 `correct` option.
- No dollar signs or KaTeX in any component STRING prop (`title="…"`,
  `fil="…"`): plain text there (unicode q₁, ∂, ± are fine).
- No raw `{`, `}`, `<`, `>` in prose outside math.
- `<Def>`/`<Terme>` ids come from `glossaire-fmv.ts` only; `<Def>` never
  inside a heading.

## Acceptance checklist (self-verify before finishing)

- [ ] All component `id="…"` props identical to the previous version
      (LessonMeta, RelatedExercises, LessonStateSelector).
- [ ] The lesson's widget tag is present, unchanged, in Visualisation guidée.
- [ ] Every assigned `<Def>` id present exactly once; no others.
- [ ] Mission has the 4 parts and survives the no-chapter-vocabulary test.
- [ ] Every worked-example step has its *Pourquoi ?* line.
- [ ] Chemistry appears in the 5 slots (mission, exemples chimie, notation
      remarque, visualisation, MissionSolved).
- [ ] No technical term used before its Def/Terme.
- [ ] Nothing mathematically substantive from the old file was dropped.
- [ ] From `platform/`: `VERIFY_SKIP_PARITY=1 npm run verify:content` passes.
- [ ] From `platform/`: `NODE_OPTIONS=--max-old-space-size=8192 npm run build`
      passes (run it if feasible; otherwise say you could not).

Finish your run by reporting: assigned Defs placed, terms you wished existed
in the glossary, and any content you had to fold rather than keep inline.
