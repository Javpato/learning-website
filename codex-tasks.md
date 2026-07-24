# Work order — Pedagogical redesign of the L2 Chimie tracks

Read `AGENTS.md` (repo root) and `platform/CLAUDE.md` first. All rules there
apply. This work order restructures EXISTING content — do not delete any
academic content, exercise, solution, or derivation; move and fold instead.

**Audience (drives every choice):** a student arriving from L1 SPA
(Gustave Eiffel) into L2 Chimie Paris-Saclay. Strong in math/physics but does
NOT enjoy them; is here for chemistry; these UEs are obligatory. Two research
principles govern the redesign: (1) utility-value — relevance to chemistry
must open every page, not close it; (2) expertise reversal — a competent
learner is annoyed by front-loaded scaffolding; explanations are what you
reach for when stuck, not what stands between you and the problem.

## New components already available in MDX (globally registered)

- `<Mission fil="…">` — chemistry problem that OPENS a lesson. `fil` is the
  one-line fil-rouge position. Children = the concrete question, phrased so
  the learner can attempt/predict something before any theory.
- `<MissionSolved>` — closes the loop near the end of the lesson: the opening
  question, now answered in 3–6 lines using the tool that was just built.
- `<Rappel title="…">` — folded just-in-time prerequisite reminder placed at
  the EXACT point of use (never at the top of a page). One idea, few lines.

## The two fils rouges (use these exact storylines)

**Math — « La vie d'une réaction sur sa surface d'énergie »**
- 01 géométrie/coordonnées → décrire la géométrie d'une molécule
- 02 surfaces/lignes de niveau → l'énergie E(q₁,q₂) est un paysage
- 03 limites/continuité → un modèle robuste = une surface sans déchirure
- 04 gradient → le chemin de réaction suit la plus grande pente
- 05 incertitudes → mesurer le paysage avec des barres d'erreur
- 06 extrema → réactifs, produits, état de transition (col)
- 07 systèmes différentiels → la cinétique est un flot sur le paysage
- 08 hamiltoniens → énergie conservée vs dissipée
- 09 systèmes linéaires → les échelles de temps d'une cinétique A→B→C
- 10 oscillateur → le fond du puits vibre : c'est la spectroscopie IR
- (00 remise à niveau = boîte à outils de référence, hors récit)

**Physique — « D'une charge isolée à la liaison hydrogène »**
- électro 00 outils → le langage des champs
- électro 01 Coulomb → la brique : une charge, puis plusieurs
- électro 02 Gauss → la symétrie fait le travail
- électro 03 potentiel → l'énergie du paysage électrique
- électro 04 dipôle → l'eau est un dipôle
- magnéto 01–03 → les courants, l'autre moitié de l'électromagnétisme
- multipôles 01 → comprimer une molécule en quelques moments
- multipôles 02 → les forces entre molécules (liaison hydrogène !)
- multipôles 03 → molécules déformables : induction et van der Waals
- particules 01 → la spectrométrie de masse, l'outil du chimiste
- particules 02 → (extension, hors récit principal)

## Task 1 — Restructure every lesson MDX (24 files)

Files: all `content.fr.mdx` under
`platform/app/[locale]/math/fonctions-plusieurs-variables/NN-*/` and
`platform/app/[locale]/physics/*/NN-*/`.

For EACH lesson, apply this template (keep all existing content, re-ordered):

1. H1 unchanged, then `<LessonMeta id="…" />` (keep), then `<Toc />` (keep).
2. REPLACE the "## Pourquoi c'est important" section with a `<Mission fil="…">`
   block right after the Accroche (keep the Accroche). The Mission states a
   concrete chemistry question from that lesson's fil-rouge line above, and
   invites an attempt ("Essaie d'abord : …"). Reuse the best sentences of the
   old "Pourquoi" section inside the Mission — do not just copy the section
   under a new name; it must be a QUESTION the learner can try, not a speech.
3. Immediately after the Mission add the TD-first door, one line:
   `*Tu te sens à l'aise ? [Attaque directement le TD](../td-N/) — la théorie reste là quand tu bloques.*`
   (link to the TD that `RelatedExercises` points to for this lesson; check
   `platform/lib/content/*.ts` for the mapping).
4. Keep "## Intuition" as-is (tighten wording where it repeats).
5. Wrap the fully formal material in a `<Collapsible title="La version rigoureuse — définitions et conditions">`
   … BUT keep the 2–4 headline formulas visible OUTSIDE it, inside the
   existing `<KeyResults>` blocks. Rule of thumb: the default page shows the
   formula and what it means; the epsilon-delta / conditions / edge cases fold.
   Existing `<Collapsible title="Démonstration — …">` blocks stay as they are.
6. Insert `<Rappel>` blocks at point of use for prerequisites the old
   "prerequisites" line used to announce (e.g. a 3-line eigenvalue reminder
   right where the Jacobian is diagonalized in lesson 07/09; a derivative
   rules reminder at the first ∂/∂x computation in lesson 04; a vector product
   reminder where Biot–Savart uses ×). 1–3 Rappels per lesson, no more.
7. Keep the widget sections, quizzes, Pièges, KeyResults summary unchanged.
8. Before "## Résumé de la leçon", add `<MissionSolved>` answering the
   opening question explicitly, with numbers/conclusions where possible.
9. Keep `<RelatedExercises>` and `<LessonStateSelector>` at the bottom.

Math lesson 00 (remise à niveau): do NOT add a Mission. Instead open with one
line: it is a reference toolbox to dip into when a Rappel isn't enough —
never a required first step.

## Task 2 — Hubs: purpose lines, TD-first door, demote lesson 00

1. `platform/app/[locale]/math/fonctions-plusieurs-variables/page.tsx`:
   - Under the H1, add the fil-rouge framing sentence: this module follows
     « la vie d'une réaction sur sa surface d'énergie », from molecular
     geometry to IR spectroscopy.
   - Each arc heading gets a one-line promise (« À la fin de cet arc, tu sais
     lire une surface d'énergie potentielle », etc.).
   - Move the 00-remise-a-niveau card OUT of Arc 1 into a small
     « Boîte à outils » section at the bottom (with formulaire and plan).
   - Add a visible TD-first strip after the intro:
     « Tu préfères apprendre en résolvant ? Commence par les TD — chaque
     exercice relie vers la théorie utile. » linking to the TD section anchor.
2. `platform/components/learn/PhysicsThemeHub.tsx`: add the same TD-first
   sentence between the Cours and TD sections, and accept a new optional
   `filLine` prop rendered under the intro; pass a fil-rouge line from each
   theme page (electrostatique/magnetostatique/multipoles/particules pages).
3. Keep ALL cards clickable; nothing greyed out; no new cards.

## Task 3 — Relabel the entry cards "pour la chimie" (no new cards)

1. Platform math hub `platform/app/[locale]/math/page.tsx`: on the
   "Fonctions de plusieurs variables" card, change the description's first
   words to « Les mathématiques pour la chimie — … » (keep the rest).
2. Platform physics hub `platform/app/[locale]/physics/page.tsx`: H1/subtitle
   already say the track is for L2 Chimie — just ensure the four theme card
   descriptions each name their chemistry payoff in the first sentence.
3. Legacy cards (EDIT TEXT ONLY, keep hrefs and structure):
   - `math/index.html`: h3 → "Mathematics for chemistry · in French", first
     sentence of the p mentions it is the math backbone of L2 Chimie.
   - `fr/math/index.html`: h3 → "Mathématiques pour la chimie".
   - `es/math/index.html`: h3 → "Matemáticas para la química · en francés".
   - `physics/index.html`, `fr/physics/index.html`, `es/physics/index.html`:
     prefix each of the four EM theme descriptions with its chemistry payoff
     (e.g. Électrostatique → « Pourquoi l'eau dissout le sel » ; Multipôles →
     « D'où vient la liaison hydrogène » ; Particules chargées → « Comment
     marche un spectromètre de masse » ; Magnétostatique → « Le magnétisme
     qui prépare la RMN »). Keep language per tree (EN/FR/ES).

## Task 4 — TD pages: purpose line per exercise

In each TD `content.fr.mdx` (11 files), after the intro sentence add one line:
« Chaque exercice indique la théorie utile — tu peux commencer ici et ouvrir
le cours seulement quand tu en as besoin. »
Do not change the exercises themselves.

## Verify (mandatory before finishing)

From `platform/`:
```
npm run verify:content
npx tsc --noEmit
npm run build
```
All three must pass. Also confirm none of the "do not revert" items in
AGENTS.md changed. Report: files touched, per-task completion, anything
skipped and why.
