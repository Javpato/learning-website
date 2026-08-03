# Handoff — refonte française de l’Arc 1 « Analyse & convergence »

Ce document explique à une autre IA **pourquoi** l’Arc 1 a été reconstruit de
cette manière, et non seulement quels fichiers ont été modifiés. Il constitue
le contexte de continuation du travail.

## 1. Demande de départ

La demande utilisateur était de refaire le cours d’analyse et convergence du
site parce que :

- la lecture était difficile et la gestion des notions peu naturelle ;
- les introductions étaient trop artificielles et trop liées à la chimie ;
- les preuves manquaient ou étaient traitées comme des détails ;
- les séries absolues et alternées arrivaient trop tard par rapport à leur
  utilisation ;
- des expressions comme `O(1/n²)` étaient utilisées sans expliquer pourquoi la
  série correspondante converge ;
- « somme bornée » n’était pas défini avant d’être employé ;
- certaines questions et réponses, notamment une C2 de la leçon 3, étaient
  incohérentes.

L’utilisateur aimait cependant conserver :

- un sommaire au début ;
- une phrase d’ouverture mémorable ;
- les visualisations guidées ;
- les pièges classiques ;
- les mini-exercices ;
- les vérifications rapides ;
- les résumés ;
- les exercices liés.

La décision de périmètre a été : **réécrire seulement l’Arc 1, en français,
en gardant les quatre URL existantes L01–L04**. L00 reste une boîte à outils
séparée ; les versions anglaises et espagnoles ne sont pas réécrites dans cette
phase.

## 2. Logique pédagogique générale

Le cours devait devenir un cours de mathématiques, pas une suite de scénarios
de chimie ou de physique décoratifs. Le fil conducteur choisi est donc une
question mathématique propre à chaque leçon.

La structure récurrente est :

1. titre formulé comme une capacité ou une question ;
2. épigraphe courte et sourcée ;
3. sommaire limité aux grands titres ;
4. question directrice compréhensible avant le vocabulaire du chapitre ;
5. besoin intuitif ;
6. définition formelle ;
7. exemple immédiat ;
8. théorème et hypothèses ;
9. démonstration visible et commentée ;
10. cas non concluant ou contre-exemple ;
11. mini-exercices ;
12. exemple de synthèse avec un « Pourquoi ? » à chaque étape ;
13. visualisation guidée ou tableau numérique ;
14. pièges classiques ;
15. vérification rapide ;
16. réponse finale à la question directrice ;
17. résumé sous forme de décision et d’idées de preuve.

Cette séquence répond directement aux erreurs observées : on ne donne pas une
définition froide, on ne cite pas un critère sans ses hypothèses, et on ne
présente pas une intuition graphique comme une preuve.

## 3. Pourquoi les preuves sont visibles

Le choix n’a pas été de cacher les preuves dans des accordéons. Les résultats
propres aux séries sont précisément les outils que l’étudiant doit savoir
réutiliser :

- écrire une série avec ses sommes partielles ;
- produire une comparaison géométrique ;
- contrôler toute une queue ;
- transformer une limite de quotient en inégalité ;
- transformer un grand O en majoration ;
- séparer les sommes paires et impaires ;
- faire une sommation par parties.

Chaque preuve visible suit trois gestes :

1. **Idée de preuve** — quelle difficulté est supprimée ?
2. **Calcul justifié** — pourquoi chaque transformation est-elle autorisée ?
3. **Ce que la preuve apprend** — quel patron peut être réutilisé ailleurs ?

Les faits fondamentaux sur les suites réelles, comme la complétude de
`\mathbb R` ou le théorème des suites monotones, sont rappelés et nommés mais
ne sont pas redémontrés depuis les axiomes. Sinon l’Arc 1 deviendrait un cours
sur les fondements de l’analyse au lieu d’un cours sur les séries.

## 4. Choix des nouveaux composants

Les composants ont été ajoutés dans `platform/components/learn/` et enregistrés
dans `platform/mdx-components.tsx`.

### `Epigraph`

Remplace le simple slogan générique par une courte citation avec auteur, œuvre,
lien source et indication de traduction. Les citations sont statiques et
visibles ; elles ne sont pas injectées dynamiquement.

Épigraphe choisie par leçon :

- L01 : Hilbert, sur la nécessité de clarifier l’infini ;
- L02 : Cauchy, sur la rigueur des méthodes ;
- L03 : Pólya, sur la réduction à un problème apparenté plus accessible ;
- L04 : Abel, sur le danger des séries divergentes.

### `GuidingQuestion` et `GuidingAnswer`

Ces composants remplacent la structure `<Mission>` héritée du cours FMV. Une
mission fonctionne bien pour un scénario appliqué, mais ici elle imposait un
fil rouge physique qui détournait l’attention. La question directrice donne
un problème mathématique précis et la réponse finale referme explicitement la
boucle.

### `Proof`

`Proof` est un bloc visible par défaut. Il sert à rendre la démonstration
lisible sans la transformer en contenu optionnel. Les `<Collapsible>` restent
utilisés pour les réponses d’exercices, les variantes longues et les questions
de compréhension.

### `Toc depth={2}`

Le composant `Toc` accepte maintenant une profondeur. Les leçons de l’Arc 1
utilisent uniquement les `h2`, car inclure chaque sous-titre de mini-exercice
produisait un sommaire trop bruyant.

## 5. Dépendances mathématiques des quatre leçons

### L01 — `01-series-numeriques`

Question : comment donner un sens à une addition qui ne se termine jamais ?

Ordre choisi :

1. série numérique ;
2. somme partielle ;
3. convergence comme limite des sommes partielles ;
4. condition nécessaire `u_n → 0` ;
5. critère de Cauchy pour une série ;
6. série géométrique ;
7. série télescopique ;
8. divergence harmonique ;
9. reste et erreur d’arrêt.

Pourquoi cet ordre : le mot « somme » ne doit jamais être manipulé avant que
la suite finie `S_N` ait été construite. La géométrique et le télescope sont
ensuite des motifs exacts. L’harmonique réfute explicitement la fausse règle
« `u_n → 0` suffit ».

Démonstrations incluses :

- `u_N = S_N - S_{N-1}` ;
- critère de Cauchy traduit pour les queues ;
- formule géométrique par décalage et soustraction ;
- télescopage ;
- divergence harmonique par blocs dyadiques.

Widget conservé : `SeriesConvergenceWidget preset="geo"`.

### L02 — `02-series-positives`

Question : comment comparer des accumulations sans calculer leurs sommes ?

Ordre choisi :

1. suites majorées et bornées ;
2. séries à termes positifs ;
3. sommes partielles croissantes et majorées ;
4. comparaison directe ;
5. comparaison par équivalent positif ;
6. comparaison série–intégrale ;
7. classification de Riemann ;
8. série de Bertrand ;
9. arbre de décision.

La notion de borne est définie avant Abel, au lieu d’apparaître dans une
réponse ou une phrase de transition. Le critère intégral est démontré avec
les rectangles ; Riemann est ensuite un cas particulier avec `f(t)=t^{-α}`.

Widget conservé : `SeriesConvergenceWidget preset="riemann"`.

### L03 — `03-dalembert-cauchy`

Question : une vitesse multiplicative locale décide-t-elle la série entière ?

Ordre choisi :

1. règle de d’Alembert ;
2. règle de Cauchy ;
3. preuves par domination géométrique ;
4. cas frontière `L=1` ;
5. deux contre-exemples de natures opposées ;
6. grand O comme inégalité éventuelle ;
7. sommabilité de `O(1/n^p)` pour `p>1`.

Le point important est de traiter `L=1` comme une absence de conclusion, pas
comme une réponse. L03 prépare directement L04 en démontrant pourquoi un reste
`O(1/n²)` est sommable. Il explique aussi pourquoi `O(1/n)` ou `O(n)` ne
permettent pas la même conclusion.

La visualisation est numérique, car aucun widget existant n’était nécessaire :
le tableau compare `u_(n+1)/u_n` pour `a<e`, `a=e` et `a>e`.

### L04 — `04-alternees-abel`

Question : comment les signes créent-ils une convergence, et quand cette
compensation casse-t-elle ?

Ordre choisi :

1. convergence absolue ;
2. preuve par contrôle des queues et critère de Cauchy ;
3. séries alternées ;
4. critère de Leibniz ;
5. estimation du reste ;
6. semi-convergence ;
7. perturbation non linéaire ;
8. développement avec reste `O(1/n²)` ;
9. transformation d’Abel ;
10. critère d’Abel–Dirichlet.

La perturbation des annales est décomposée exactement :

$$
\frac{(-1)^n}{n+(-1)^n\sqrt n}
=\frac{(-1)^n}{n}-\frac1{n^{3/2}}+O\!\left(\frac1{n^2}\right).
$$

Chaque morceau est ensuite classé séparément. Cela corrige l’erreur consistant
à dire seulement « le reste converge ».

Leibniz reste dans le cœur du cours. Abel est conservé mais séparé dans une
section avancée clairement annoncée, car il généralise l’idée de compensation
sans être nécessaire pour comprendre la première série alternée.

Widget conservé : `SeriesConvergenceWidget preset="alternee"`.

## 6. Glossaire et compatibilité

Les identifiants de glossaire n’ont pas été inventés ni déplacés. Les ensembles
`<Def>` et `<Terme>` de chaque leçon ont été conservés pour maintenir la parité
avec les contenus EN/ES existants et la résolution des liens.

Les identifiants importants sont :

- L01 : `serie-numerique`, `somme-partielle`, `serie-convergente`,
  `reste-d-une-serie`, `serie-geometrique`, `serie-harmonique`,
  `serie-telescopique` ;
- L02 : `serie-a-termes-positifs`, `critere-de-comparaison`,
  `serie-de-riemann`, `comparaison-serie-integrale` ;
- L03 : `regle-de-d-alembert`, `regle-de-cauchy`, `cas-douteux` ;
- L04 : `convergence-absolue`, `semi-convergence`, `serie-alternee`,
  `critere-de-leibniz`, `transformation-d-abel`.

Les notions supplémentaires comme « suite majorée », « critère de Cauchy » et
« grand O » sont expliquées directement dans les leçons sans ajouter de
nouveaux identifiants de registre.

## 7. Vérifications effectuées

Depuis `platform/` :

```sh
npm run verify:content
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=14336 npm run build
```

Résultats obtenus :

- vérification de contenu : 216 fichiers MDX, succès ;
- TypeScript : succès ;
- export statique : 442 pages générées ;
- canaries HTML : chaque leçon contient son épigraphe, ses preuves, ses quiz
  et son sélecteur d’état ;
- `git diff --check` : succès.

## 8. Déploiement

Le workflow `.github/workflows/deploy-pages.yml` publie uniquement sur `main`.
Le commit de la refonte a été poussé sur `main`, puis le workflow GitHub Pages
a terminé avec succès.

URL publique :

`https://javpato.github.io/learning-website/platform/fr/math/analyse-convergence/`

Première leçon de l’Arc 1 :

`https://javpato.github.io/learning-website/platform/fr/math/analyse-convergence/01-series-numeriques/`

## 9. Règles pour continuer avec une autre IA

Une IA qui poursuit le travail doit :

1. lire `AGENTS.md`, `platform/CLAUDE.md`, `COURSE_PLAYBOOK.md`,
   `RESOURCES-analyse.md` et ce document ;
2. ne pas remettre une mission physique ou chimique dans cette piste ;
3. conserver la question directrice mathématique ;
4. démontrer chaque théorème propre aux séries ;
5. définir un terme avant son emploi dans une preuve ;
6. traiter explicitement chaque cas non concluant ;
7. expliquer les grands O par des inégalités ;
8. conserver les IDs de registre, les widgets et le dernier
   `<LessonStateSelector>` ;
9. ne pas traduire EN/ES avant une demande explicite ;
10. lancer `npm run verify:content`, `npx tsc --noEmit` et le build avant de
    considérer une nouvelle leçon terminée.

Le but n’est pas de rendre chaque page plus longue. Le but est que chaque ligne
serve soit à comprendre une définition, soit à justifier un théorème, soit à
reconnaître une méthode dans un exercice.

---

# Suite — Arcs 2 et 3, boîte à outils, formulaire (3 août 2026)

## Ce qui est fait

Le modèle de l’Arc 1 a été étendu à **toute la piste**, en français.

- **Arc 2** — L05 (pilote, écrit à la main), L06 (Codex sous work order, relu et
  corrigé), L07.
- **Arc 3** — L08 à L12.
- **L00 boîte à outils** — devient la page d’armes de la piste : cinq gestes de
  limite, suites monotones et adjacentes, majorations, sommes finies, réflexes
  d’intégration, maniement des ε et des quantificateurs, et une section
  « intuitions à avoir ». Sa Proposition 1 (domination géométrique) est le
  mécanisme unique derrière d’Alembert, Cauchy, le lemme d’Abel et la
  convergence normale.
- **formulaire** — devient un instrument de décision : triage en 60 s, arbre de
  décision, bestiaire de contre-exemples, modèles de rédaction, erreurs qui
  coûtent des points, correspondance énoncé d’examen → phrase à écrire.
- **plan de travail** — supprimé dans les trois langues, carte du hub retirée.
- **glossaire** — six identifiants ajoutés pour L00 (`croissances-comparees`,
  `theoreme-des-suites-monotones`, `suites-adjacentes`,
  `decomposition-en-elements-simples`, `integrale-impropre`,
  `formule-de-stirling`).

Chaque leçon a été vérifiée par un audit structurel : aucun résidu de l’ancien
gabarit, cycles guidés ≤ 2, `Étape` = `Pourquoi ?`, dernière ligne
`<LessonStateSelector>`, épigraphes toutes distinctes et sourcées.

## Deux défauts de plateforme corrigés en chemin

1. **`remark-gfm` manquait** dans `next.config.mjs`. Aucun tableau markdown du
   site ne s’affichait comme tableau — fiches de décision, formulaire,
   passeports d’hypothèses sortaient en `| a | b |` littéral, derrière un build
   vert, alors que le style `.prose-page table` existait depuis toujours.
2. En l’activant, **55 lignes de tableau** se sont révélées cassées : dans une
   cellule, GFM découpe sur `|` avant que les maths soient lues, donc `$|r|<1$`
   éclate et le `<1` restant devient une balise JSX (erreur de build), tandis
   que `\|` est silencieusement ramené à une barre simple. Toutes corrigées en
   `\lvert`/`\rvert` et `\lVert`/`\rVert`. Règle consignée dans le skill
   `mdx-safety` et dans `codex-analyse-translate.md`.

## Traduction EN/ES — état

**Fait.** Les dix unités réécrites ont désormais leurs siblings en/es régénérés
depuis le français courant : L00, L05, L06, L07, L08, L09, L10, L11, L12 et le
formulaire. Les jeux `<Def>`/`<Terme>` sont identiques dans les trois locales.

**La fenêtre FR-first est donc close.** `npm run verify:content` passe **sans
indicateur**, parité des locales comprise, et `VERIFY_STRICT_GLOSSARY=1` passe
aussi. Ne plus utiliser `VERIFY_SKIP_PARITY=1`.

## Ce qui reste

**L01 à L04 en anglais et en espagnol.** Ces quatre unités n’ont jamais été
traduites depuis la refonte de l’Arc 1 : leurs siblings contiennent encore la
leçon d’avant. Elles ne cassent pas la vérification — Codex avait conservé les
jeux d’identifiants — mais un lecteur anglophone ou hispanophone lit toujours le
cours que cette refonte devait remplacer. C’est une péremption de contenu, pas
une panne structurelle, et c’est le dernier écart réel de la piste.

Le work order `codex-analyse-translate.md` couvre cette phase (vocabulaire
`Epigraph` / `GuidingQuestion` / `Proof`, règle des barres en cellule de tableau,
liste des unités périmées). Codex a épuisé son quota le 3 août ; il redevient
disponible le 7.

**La passe de liens `<Terme>`** par insertion seule pour les six nouveaux
identifiants de L00, à travers les leçons, les TD, les examens et le formulaire.

## Le build local ne passe pas sur cette machine

`GITHUB_PAGES=true npm run build` est tué par le système pendant la
**compilation webpack** — avant « Compiled successfully », donc avant toute
génération de page. Essais successifs : 6144 et 10240 Mo donnent une erreur OOM
de V8 (code 134), 12288 et 14336 Mo se font tuer par l’OS (code 137) sur une
machine de 23 Go dont ~17 sont libres. Le nombre de workers d’export n’y change
rien puisque l’échec précède leur création.

La compilation de 213 fichiers MDX chargés en KaTeX est ce qui consomme la
mémoire ; le playbook avait déjà dû relever le plafond une fois. Les autres
portes passent (`verify:content` sans indicateur, `tsc --noEmit`, rendu vérifié
page par page en serveur de développement), et c’est la CI qui produit l’export
publié. À reprendre sur une machine plus large, ou en découpant la compilation.
