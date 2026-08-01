# Work order — TD, sujets d'entraînement, formulaire et plan de travail (Analyse & convergence)

Companion to `codex-analyse-rewrite.md` (lessons). Read `AGENTS.md`,
`platform/CLAUDE.md` and `RESOURCES-analyse.md` first. Execute **one unit per
run** — the TD, exam or page named in your prompt, nothing else.

Writable file per run: exactly
`platform/app/[locale]/math/analyse-convergence/<unit>/content.fr.mdx`
(each currently holds a placeholder stub; replace it entirely). Never touch
`page.tsx`, `lib/content/*.ts`, components, other units, or the `en`/`es`
siblings.

## Hard rules

- **Nothing is ever locked.** Corrigés, hints and final answers are open by
  construction — no score, no gating, no penalty language. Hints are help,
  not a cost.
- **Provenance stays visible.** These are reconstructions from the course's
  polycopié and its annales, never official papers. Every TD opens with
  `<ProvenanceBadge provenance="polycopie" />`; every exam page opens with the
  disclaimer paragraph (model below) before `<MockExamView>`.
- **Ids are law.** Exercise ids come from `platform/lib/content/math-analyse.ts`
  and must appear exactly once each, in the TD they belong to.
- MDX safety rules are the ones in `codex-analyse-rewrite.md` — the `$$`
  fence rule especially (each `$$` alone on its own line).
- Link vocabulary with `<Terme id="…">` at its first use in each exercise
  (ids from `platform/lib/content/glossaire-analyse.ts`). Never `<Def>` in a
  TD or an exam: definitions live in lessons only.

## TD skeleton

```mdx
# TD n — <titre>

<ProvenanceBadge provenance="polycopie" />

<phrase d'accueil : on peut commencer par le TD, la théorie est liée dans
chaque exercice ; les corrigés sont ouverts>

<Toc />

<ExerciseView id="math-an-tdN-0K">
<Statement>…</Statement>
<HintLadder>
<Hint>… (une piste, pas la solution)</Hint>
<Hint>… (le pas technique décisif)</Hint>
</HintLadder>
<FinalAnswer>… (une ligne)</FinalAnswer>
<Solution>
… rédaction complète, dans la forme attendue à l'examen :
structure → calcul → référence (série de référence ou théorème) → conclusion
</Solution>
<CommonErrors>
- … (l'erreur, puis ce qu'il fallait faire)
- …
</CommonErrors>
</ExerciseView>
```

Rules for the prose:
- The `<Solution>` is a **model answer**, written the way it must be handed
  in — the report's rubric: structure, calcul, référence nommée, conclusion.
  Name the reference series or the theorem out loud every time.
- Every interchange (limite/somme/intégrale/dérivée) is written with the
  four-line passeport (hypotheses listed, checked, theorem named, conclusion).
- `<CommonErrors>` lists 2-3 *diagnosed* errors, not generic advice.
- `<HintLadder>` has 2-3 hints, strictly increasing in strength.

## TD contents (mathematics is fixed here — do not substitute)

### TD 1 — `td-1`, ids `math-an-td1-01` … `math-an-td1-06`

1. **`-01` Sommes partielles exactes.** (a) Calculer la somme de la série
   géométrique de raison 1/3 à partir du rang 2. (b) Montrer que
   `∑ 1/(n(n+1))` est télescopique, calculer S_N puis la somme.
   (c) En déduire le reste R_N et le rang à partir duquel il est sous 10⁻³.
2. **`-02` Comparaison directe.** Nature de `∑ (2 + cos n)/n²`,
   `∑ 1/(n + √n)`, `∑ (ln n)/n²` — chacune par encadrement, sans équivalent.
3. **`-03` Six natures par équivalent.** `∑ ln(1 + 1/n^{3/2})`,
   `∑ (e^{1/n} − 1)/√n`, `∑ sin(1/n²)`, `∑ (1 − cos(1/n))`,
   `∑ (n+1)^{1/3} − n^{1/3}`, `∑ n/(n²+1)`. Exiger à chaque fois : positivité
   éventuelle, équivalent, série de référence nommée, conclusion.
4. **`-04` Comparaison série-intégrale.** (a) Retrouver la nature de
   `∑ 1/n^α` par comparaison à l'intégrale. (b) Nature de `∑ 1/(n ln n)` et
   `∑ 1/(n (ln n)²)` (Bertrand). (c) Encadrer la somme partielle de la série
   harmonique entre ln N et 1 + ln N.
5. **`-05` Combien de termes ?** Pour `∑ (−1)^{n+1}/n²` et pour
   `∑ 1/n²`, majorer le reste et donner le nombre de termes assurant 10⁻⁴
   (l'un par le critère de Leibniz, l'autre par comparaison intégrale).
6. **`-06` Vrai ou faux.** (a) `u_n → 0` implique la convergence. (b) Si
   `∑ u_n` converge alors `∑ u_n²` converge. (c) Si `u_n ≥ 0` et `∑ u_n`
   converge alors `∑ √(u_n)/n` converge. (d) Si `∑ u_n` converge et `(v_n)`
   est bornée alors `∑ u_n v_n` converge. Chaque réponse suit le format de la
   Règle 15 (hypothèse vérifiée, conclusion qui échoue).

### TD 2 — `td-2`, ids `math-an-td2-01` … `math-an-td2-06`

1. **`-01` Rapport.** `∑ n!/n^n`, `∑ (n!)²/(2n)!`, `∑ 2^n n!/n^n`.
2. **`-02` Racine.** `∑ (n/(n+1))^{n²}`, `∑ (ln n / n)^n`,
   `∑ (1 − 1/n)^{n²}`.
3. **`-03` Cas douteux.** `∑ n!·e^n/n^{n+a}` selon a (Stirling admis en
   `<Collapsible>`), et `∑ (1 − a/n)^n` : montrer que le rapport tend vers 1
   et conclure par logarithme + développement limité.
4. **`-04` Alternées et reste.** `∑ (−1)^n/√n`, `∑ (−1)^n ln n/n`,
   `∑ (−1)^n/(n + (−1)^n)` — la troisième n'est PAS de Leibniz (la
   décroissance échoue) : la traiter par développement.
5. **`-05` La perturbation.** Avec `u_n = (−1)^n/√n` : nature de `∑ u_n`, de
   `∑ |u_n|`, puis de `∑ u_n/(1+u_n)` via
   `u_n/(1+u_n) = u_n − u_n²/(1+u_n)` et `u_n²/(1+u_n) ∼ 1/n`.
6. **`-06` Abel.** `∑ sin(nθ)/n` pour θ non multiple de 2π : sommes
   trigonométriques bornées, transformation d'Abel, conclusion ; puis
   comparaison avec `∑ |sin(nθ)|/n`.

### TD 3 — `td-3`, ids `math-an-td3-01` … `math-an-td3-05`

1. **`-01`** `f_n(x) = x^n` sur [0,1] puis sur [0,b], b < 1 : limite simple,
   norme uniforme, suite témoin, localisation.
2. **`-02`** `f_n(x) = n x e^{−n x}` sur [0,+∞) puis [a,+∞) : reprend le fil
   rouge de la leçon L05 — même système, question nouvelle (intégrales).
3. **`-03`** `g_n(x) = √(x² + 1/n²)` : convergence uniforme vers |x| ;
   `g_n′` converge simplement vers la fonction signe, pas uniformément sur ℝ,
   mais uniformément hors de [−a,a]. C'est le cœur du partiel 2020.
4. **`-04`** Bosses : `h_n = n^α x e^{−n x}` selon α, tableau
   hauteur / aire / valeur en un point fixé, et conclusion sur les trois
   convergences.
5. **`-05` Vrai ou faux** sur ce que la convergence uniforme donne
   (continuité) et ne donne pas (dérivabilité de la limite, convergence des
   dérivées, interversion avec une intégrale sur un intervalle non borné).

### TD 4 — `td-4`, ids `math-an-td4-01` … `math-an-td4-05`

1. **`-01`** `∑ e^{−n x}/n²` sur [0,+∞) : convergence normale ; puis la série
   des dérivées `∑ −e^{−n x}/n` : normale sur [a,+∞), pas sur (0,+∞).
2. **`-02`** `∑ (−1)^n/(n + x²)` sur ℝ : uniforme par le critère de Leibniz
   appliqué au reste, mais pas normale — le contre-exemple qui sépare les
   deux notions.
3. **`-03`** Continuité et dérivabilité de la somme précédente ; rédaction
   complète avec le passeport.
4. **`-04`** Intégration terme à terme : montrer
   `∫₀¹ ∑ x^n/n² dx = ∑ 1/(n²(n+1))`, en justifiant l'échange, puis
   calculer la somme par décomposition en éléments simples.
5. **`-05`** Au bord : `S(x) = ∑ x^n/n²` sur [0,1] — S est continue en 1,
   mais S′ n'est pas bornée quand x → 1⁻. Traiter l'intérieur et le bord
   séparément (le mécanisme du partiel 2023).

### TD 5 — `td-5`, ids `math-an-td5-01` … `math-an-td5-06`

1. **`-01`** Rayons de `∑ n! x^n`, `∑ x^n/n!`, `∑ n^α x^n`,
   `∑ (2^n/n) x^n`, `∑ (1 + 1/n)^{n²} x^n`.
2. **`-02`** Lacunaires : `∑ x^{2n}/3^n`, `∑ x^{n²}` — pourquoi la règle du
   rapport sur les coefficients ne s'applique pas telle quelle.
3. **`-03`** Bord : pour `∑ x^n/n`, `∑ x^n/n²`, `∑ x^n/√n`, étudier x = R et
   x = −R séparément.
4. **`-04`** `S(x) = ∑ x^n/(n(n+1))` : rayon, décomposition
   `1/(n(n+1)) = 1/n − 1/(n+1)`, expression close, limites en 0 et en 1.
5. **`-05`** `(1 − x) y′ = 2 y`, `y(0) = 1` : résolution par série entière,
   récurrence sur les coefficients, rayon, reconnaissance de
   `y = 1/(1−x)²`, et vérification directe.
6. **`-06`** Fonction auxiliaire : avec `S(x) = ∑ x^n/n²`, montrer que
   `S(x) + S(1−x) + ln x · ln(1−x)` est constante sur (0,1) en dérivant, puis
   l'évaluer en x = 1/2 ; en déduire une relation entre `S(1/2)` et
   `S(1) = π²/6` (valeur admise, référencée).

### TD 6 — `td-6`, ids `math-an-td6-01` … `math-an-td6-05`

1. **`-01`** `F(x) = ∫₀¹ e^{x t}/(1+t) dt` : classe C¹ sur ℝ, croissance,
   développement de premier ordre en 0.
2. **`-02`** `G(x) = ∫₀^{+∞} e^{−t} cos(x t) dt` : existence par domination
   (`|e^{−t} cos(x t)| ≤ e^{−t}`), dérivation sous l'intégrale justifiée par
   la dominante `t e^{−t}`, puis double intégration par parties donnant
   `(1 + x²) G(x) = 1`, donc `G(x) = 1/(1+x²)`. Vérifier enfin que la dérivée
   obtenue par le théorème coïncide avec celle de `1/(1+x²)`.
3. **`-03`** `H(x) = ∫₀¹ (t^x − 1)/ln t dt` : bien définie (étudier les deux
   singularités t → 0 et t → 1), `H′(x) = 1/(x+1)`, donc
   `H(x) = ln(1+x)`.
4. **`-04`** Choisir son paramètre : pour `∫₀^{+∞} (e^{−t} − e^{−2t})/t dt`,
   comparer trois paramétrages proposés et n'en garder qu'un ; conclure
   `= ln 2`.
5. **`-05`** Asymptotique : pour `E(x) = ∫_x^{+∞} e^{−t}/t dt`, obtenir
   `E(x) ∼ e^{−x}/x` quand x → +∞ par intégration par parties, en majorant
   explicitement le reste.

### TD 7 — `td-7`, ids `math-an-td7-01` … `math-an-td7-04`

1. **`-01`** `∬_D x y dx dy` sur le triangle de sommets (0,0), (1,0), (0,1) :
   décrire le domaine par tranches, intégrer.
2. **`-02`** `∫₀¹ ∫_y^1 e^{x²} dx dy` : inverser l'ordre pour rendre le
   calcul possible.
3. **`-03`** `∬_D (x² + y²) dx dy` sur le quart de disque unité (x, y ≥ 0),
   en polaires, jacobien explicite.
4. **`-04`** Aire de l'ellipse `x²/a² + y²/b² ≤ 1` par le changement
   `(u,v) ↦ (a u, b v)` : domaine image, jacobien, valeur `π a b`, et
   vérification du cas a = b.

## Exams

Structure of an exam page:

```mdx
# <Titre> — sujet d'entraînement reconstruit

<paragraphe d'avertissement : outil de préparation, pas une épreuve
officielle ; reconstruit d'après le polycopié et les annales du cours ; les
corrigés sont ouverts en permanence, le chronomètre est optionnel>

<MockExamView id="math-an-exam-…">

<ExamProblem title="Exercice 1 — …" points={…}>

… énoncé numéroté …

<Collapsible title="Corrigé et barème indicatif">
… corrigé complet, points par question …
</Collapsible>

</ExamProblem>

…

</MockExamView>
```

Points must add up to the `totalPoints` of the registry entry (20 each).

### `examens/cc` — 45 min, 20 points, séries numériques

- Ex. 1 (8 pts) Quatre natures à trancher (un équivalent, un rapport, une
  racine, une alternée), justification complète exigée.
- Ex. 2 (6 pts) Un reste à majorer et un nombre de termes à donner.
- Ex. 3 (6 pts) Deux vrai/faux avec preuve ou contre-exemple.

### `examens/partiel` — 2 h, 20 points

This is the validation paper designed in `deep-research-report.md`
(section « Examen nuevo de validación ») — reuse its four problems and its
solutions, which are already written there:

- Ex. 1 (5 pts) Vrai/faux : (i) `∑ u_n` convergente et `(v_n)` bornée
  ⟹ `∑ u_n v_n` convergente ; (ii) `a_n > 0` et `a_{n+1}/a_n → 1`
  ⟹ divergence ; (iii) `f_n → f` uniformément, `f_n` dérivables ⟹ `f`
  dérivable. Les trois sont fausses ; contre-exemples dans le rapport.
- Ex. 2 (5 pts) `∑ (e^{1/n} − 1)/√n` ; puis avec `u_n = (−1)^n/√n` :
  `∑ u_n`, `∑ |u_n|`, `∑ u_n/(1+u_n)`.
- Ex. 3 (5 pts) `f_n(x) = √(x² + 1/n²)` : simple et uniforme sur ℝ ; `f_n′`
  sur ℝ puis hors de [−a,a] ; dérivabilité de la limite.
- Ex. 4 (5 pts) `S(x) = ∑ x^n/(n(n+1))` : rayon, expression close, limite en
  0 ; et `F(x) = ∫₀¹ e^{x t}/(1+t) dt` : classe C¹, croissance, premier ordre.

### `examens/final` — 2 h, 20 points, synthèse

- Ex. 1 (4 pts) Question de cours : énoncer précisément le théorème de
  dérivation sous le signe intégral, puis l'appliquer.
- Ex. 2 (5 pts) Série entière : rayon d'une série lacunaire, comportement au
  bord, expression close par dérivation/intégration terme à terme.
- Ex. 3 (5 pts) Intégrale à paramètre : existence, continuité, dérivation,
  monotonie, équivalent en +∞ par intégration par parties.
- Ex. 4 (3 pts) Fonctions de deux variables : continuité en (0,0) d'une
  fonction définie par morceaux (chemins pour réfuter, majoration pour
  prouver) — renvoyer par `<Terme>` aux définitions de la piste FMV.
- Ex. 5 (3 pts) Intégrale double avec changement de variables.

## `formulaire`

One page, no exercises. Sections, in this order:
1. Séries de référence (géométrique, Riemann, Bertrand) avec leur domaine de
   convergence.
2. Critères, en tableau : nom · hypothèses · conclusion · **cas non
   concluant**.
3. Développements limités usuels en 0 et équivalents usuels.
4. Les trois convergences (simple / uniforme / normale) : tableau des
   implications ET des non-implications, chaque non-implication accompagnée
   de son contre-exemple canonique.
5. Théorèmes d'échange : continuité, intégration, dérivation, avec le
   passeport d'hypothèses en quatre lignes pour chacun.
6. Séries entières : rayon, opérations, bibliothèque des développements
   engendrés par la série géométrique.
7. Intégrales à paramètre : continuité, dérivation, domination.
8. Modèles de rédaction (nature d'une série ; contre-exemple ; échange) —
   les trois phrases-types du rapport.
9. Intégrales doubles : Fubini, polaires, jacobien.

Every entry links its term with `<Terme id="…">` at first use.

## `plan-de-travail`

14 weeks, indicative only, explicitly non-binding (`AGENTS.md`: nothing
gates anything). Per week: le thème, la leçon, le TD, et un mini-test de
rappel espacé portant sur une semaine antérieure. Ends with a short
« comment réviser » section: récupération active, contre-exemples à
reconstituer de mémoire, et la grille d'auto-diagnostic par type d'erreur
(concept / hypothèse / méthode / algèbre / logique / rédaction / temps).

## Acceptance checklist

- [ ] Every exercise id of the unit present exactly once, none invented.
- [ ] Every `<Solution>` names its reference series or its theorem.
- [ ] Every interchange written with the passeport.
- [ ] Exam points sum to 20.
- [ ] No `<Def>` anywhere; `<Terme>` ids all resolve.
- [ ] From `platform/`: `VERIFY_SKIP_PARITY=1 npm run verify:content` passes.
- [ ] Do NOT run `npm run build`.
