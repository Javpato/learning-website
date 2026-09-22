# Exercice 4 — Routage à vecteur de distance : correction et guide de création pédagogique

Ce document contient une correction détaillée et un cahier des charges directement exploitable par une IA pour construire une explication visuelle interactive et un mini-jeu. Public : L2 informatique. Langue de l’interface et des explications : français.

## 1. Énoncé et périmètre

Réseau de cinq nœuds A, B, C, D, E. Six liaisons bidirectionnelles : AB, AD, BC, BE, CE, DE. Chaque liaison coûte 1. Le protocole utilise un algorithme de routage à vecteur de distance de type Bellman-Ford.

1. Au démarrage, chaque nœud connaît uniquement ses voisins. Donner les tables initiales.
2. Traiter successivement les échanges :
   - S1 : B et D reçoivent VA.
   - S2 : A, C et E reçoivent VB.
   - S3 : A et E reçoivent VD.
   - S4 : B et D reçoivent VA et VE.
   - S5 : B et E reçoivent VC.
   - S6 : A reçoit VB.
   - S7 : C et D reçoivent VE.
   Donner les tables convergées.
3. AB est rompue. Traiter :
   - F1 : A et B détectent la rupture de AB.
   - F2 : D reçoit VA ; C et E reçoivent VB.
   - F3 : E reçoit VD.
   - F4 : B, C et D reçoivent VE.
   - F5 : A reçoit VD.
   Donner les mises à jour et commenter le résultat.

Les préfixes S et F distinguent ici les deux séries T1, T2… de l’énoncé. Ils n’ajoutent aucun échange.

La photographie du tableau fournit les tables convergées avant rupture. La page nette fournit les trois questions ci-dessus. La photographie floue n’est pas utilisée pour inventer un complément d’énoncé.

## 2. Conventions indispensables

L’énoncé ne précise pas entièrement la gestion des égalités ni le stockage des annonces anciennes. Pour rendre les étapes reproductibles, cette correction adopte les conventions suivantes.

- Chaque nœud conserve sa meilleure route courante : destination, prochain saut, distance.
- Les vecteurs transmis ne contiennent que les distances courantes, dans l’ordre A, B, C, D, E.
- Une annonce est traitée à sa réception. On ne recalcule pas immédiatement des routes de secours à partir d’un cache de tous les anciens vecteurs.
- À coût égal, on conserve le prochain saut déjà choisi.
- Si le voisin qui annonce est le prochain saut actuel, on actualise la distance même si elle augmente ou devient infinie.
- En cas de rupture, on invalide toutes les routes dont le prochain saut emprunte la liaison rompue, pas seulement la route vers le voisin.
- À l’intérieur d’une même étape, les messages sont des copies des vecteurs au début de cette étape. À S4, traiter VA avant VE ; cela expose une amélioration intermédiaire pour D vers C, mais ne change pas l’état à la fin de S4.
- Pas de split horizon, de poisoned reverse, de temporisateur, de messages supplémentaires automatiques ni de valeur numérique arbitraire pour l’infini dans le scénario principal.

Il existe aussi une implémentation qui mémorise le dernier vecteur de chaque voisin et recalcule un minimum sur ces annonces. Elle peut produire d’autres états transitoires après panne. Il faut la présenter comme une variante explicitement séparée ; ne pas mélanger ses règles avec les tables de ce document. Les distances des plus courts chemins finaux sont indépendantes de ce choix.

## 3. Les objets à comprendre

### 3.1 Graphe

On modélise le réseau par un graphe non orienté pondéré G = (V, L), avec V = {A,B,C,D,E}, L = {{A,B},{A,D},{B,C},{B,E},{C,E},{D,E}}, et un poids 1 pour chaque arête.

Voisinages :

| Nœud | Voisins initiaux |
|---|---|
| A | B, D |
| B | A, C, E |
| C | B, E |
| D | A, E |
| E | B, C, D |

### 3.2 Table et vecteur : ne pas les confondre

Une entrée de la table de X vers Z est (Z, prochain saut, distance). Le prochain saut est uniquement le voisin auquel X transmet le paquet. Il n’est ni la destination finale en général, ni le chemin complet.

Exemple : chez A, l’entrée (C, B, 2) signifie « pour atteindre C, transmettre à B ; le coût actuellement estimé est 2 ». B consultera ensuite sa propre table.

Le vecteur VX contient les distances de X vers toutes les destinations, sans le prochain saut : VX = (dX(A),dX(B),dX(C),dX(D),dX(E)).

Le symbole ∞ signifie « aucune route actuellement connue ». Il ne prouve pas que la destination est réellement déconnectée. Au démarrage, A affiche ∞ vers C, alors que le chemin A–B–C existe déjà.

### 3.3 Distance et nombre de sauts

Chaque arête coûte 1 : le coût d’un chemin est donc son nombre d’arêtes. A–B–C comporte trois nœuds mais deux sauts, donc coûte 2. La distance de X vers lui-même est toujours 0 et son prochain saut est absent.

## 4. Méthodes utilisées et justification

### 4.1 Initialisation par connaissance locale

Pour chaque X : dX(X) = 0 ; dX(Z) = 1 si Z est voisin de X ; dX(Z) = ∞ sinon. Une route directe prend Z pour prochain saut. Aucune connaissance globale ne doit être utilisée pour remplir les autres cases.

### 4.2 Décomposition d’un plus court chemin : Bellman-Ford

Pour une destination Z différente de X, tout chemin partant de X commence par un voisin Y. Son coût est le coût X–Y plus le coût de la suite du chemin depuis Y. À l’optimum :

    δ(X,Z) = min sur Y voisin de X de [c(X,Y) + δ(Y,Z)].

Justification : choisir un voisin Y puis un plus court chemin de Y à Z donne une marche de coût c(X,Y)+δ(Y,Z), donc la distance optimale depuis X ne dépasse pas ce coût. Réciproquement, un plus court chemin de X à Z commence par un voisin Y et sa partie restante ne peut coûter moins que δ(Y,Z). Les deux inégalités donnent l’égalité. Ici les coûts sont positifs ; on peut toujours éliminer les cycles d’un chemin optimal.

En cours d’exécution, les routeurs ne possèdent pas les distances optimales δ. Ils échangent leurs estimations. Si X reçoit VY, le candidat vers Z est :

    candidat = 1 + VY[Z].

C’est l’opération de relaxation : essayer une route passant par Y et comparer son coût à la route courante. Le « +1 » paie X–Y, absent du coût annoncé par Y.

### 4.3 La règle dynamique complète

Pour chaque destination Z ≠ X, à réception de VY par X :

1. Lire l’ancienne distance et l’ancien prochain saut.
2. Calculer q = 1 + VY[Z], avec 1 + ∞ = ∞.
3. Si le prochain saut actuel est Y, remplacer la distance par q, même si q est plus grand.
4. Sinon, remplacer la route seulement si q est strictement inférieur à l’ancienne distance.
5. En cas de remplacement avec q fini, le nouveau prochain saut est Y.
6. Si q est infini et que la route doit être invalidée, la distance devient ∞ et le prochain saut absent.
7. À égalité avec une annonce d’un autre voisin, conserver la route existante.

Une simple instruction « prendre min(ancien, candidat) » suffit à découvrir des améliorations dans un réseau fixe démarrant avec des surestimations ; elle ne suffit pas à traiter les dégradations après rupture. Sinon une ancienne distance finie ne pourrait jamais devenir infinie.

Cette règle d’actualisation à partir du prochain saut actuel est décrite dans la présentation du vecteur de distance du RFC 1058, §2 : https://www.rfc-editor.org/rfc/rfc1058.html#section-2 . Nous utilisons ici un modèle pédagogique de nœuds, pas une simulation complète de RIP.

### 4.4 Simulation d’événements asynchrones

S1, S2… sont des événements de livraison imposés. Tous les routeurs ne reçoivent pas toutes les informations à chaque étape. Un nœud ne modifie pas sa table simplement parce qu’une liaison distante a changé ou qu’un autre nœud a appris une route.

Important : le vecteur envoyé à S2 est celui de B après S1, et non son vecteur initial. De même, VD à F5 est celui de D après F4.

### 4.5 Vérification indépendante

Le parcours en largeur (BFS) est utilisé uniquement pour vérifier la correction : depuis une source, il explore successivement les nœuds à 0, 1, 2… sauts. Comme tous les poids valent 1, il calcule les distances optimales. Il ne représente pas ce que les routeurs exécutent ici.

La simulation des annonces a été comparée à BFS avant et après rupture. Les chemins obtenus en suivant les prochains sauts ont aussi été vérifiés : arêtes existantes, absence de boucle et longueur optimale. Enfin, une diffusion supplémentaire de tous les vecteurs ne modifie pas les tables finales.

## 5. Question 1 — Tables initiales

Notation des tableaux : chaque cellule contient « prochain saut / distance ». « — / 0 » désigne soi-même ; « — / ∞ » une route inconnue. Les colonnes sont les destinations, les lignes les routeurs.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | — / ∞ | D / 1 | — / ∞ |
| B | A / 1 | — / 0 | C / 1 | — / ∞ | E / 1 |
| C | — / ∞ | B / 1 | — / 0 | — / ∞ | E / 1 |
| D | A / 1 | — / ∞ | — / ∞ | — / 0 | E / 1 |
| E | — / ∞ | B / 1 | C / 1 | D / 1 | — / 0 |

Chez A : soi-même coûte 0 ; B et D sont voisins et coûtent 1 ; C et E sont inconnus. Appliquer exactement le même raisonnement aux quatre autres lignes.

## 6. Question 2 — Chaque échange avant rupture

### S1

VA = (0,1,∞,1,∞). B découvre D via A : 1+1=2. D découvre B via A : 1+1=2. Les autres candidats ne sont pas meilleurs.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | — / ∞ | D / 1 | — / ∞ |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | — / ∞ | B / 1 | — / 0 | — / ∞ | E / 1 |
| D | A / 1 | A / 2 | — / ∞ | — / 0 | E / 1 |
| E | — / ∞ | B / 1 | C / 1 | D / 1 | — / 0 |

### S2

VB = (1,0,1,2,1), car B a appris D à S1. A découvre C et E via B, coût 2. C découvre A via B, coût 2, et D via B, coût 3 (1+2). E découvre A via B, coût 2. C ne connaît pas encore le meilleur chemin C–E–D : il n’a pas reçu VE.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | B / 2 | D / 1 | B / 2 |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | B / 2 | B / 1 | — / 0 | B / 3 | E / 1 |
| D | A / 1 | A / 2 | — / ∞ | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### S3

VD = (1,2,∞,0,1). A peut atteindre E via D au coût 2, égal au coût via B : il conserve B. E peut atteindre A via D au coût 2 : il conserve B. Aucun changement.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | B / 2 | D / 1 | B / 2 |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | B / 2 | B / 1 | — / 0 | B / 3 | E / 1 |
| D | A / 1 | A / 2 | — / ∞ | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### S4

VA = (0,1,2,1,2) et VE = (2,1,1,1,0). D découvre d’abord C via A au coût 1+2=3, puis améliore cette route via E au coût 1+1=2. D conserve B via A : le coût proposé via E vaut également 2. B conserve D via A pour la même raison. Seule la route D→C diffère à la fin de l’étape.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | B / 2 | D / 1 | B / 2 |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | B / 2 | B / 1 | — / 0 | B / 3 | E / 1 |
| D | A / 1 | A / 2 | E / 2 | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### S5

VC = (2,1,0,3,1). Aucune proposition à B ou E n’améliore leur table. En particulier, le coût de D via C vaut 4 ; cela n’est pas compétitif.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | B / 2 | D / 1 | B / 2 |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | B / 2 | B / 1 | — / 0 | B / 3 | E / 1 |
| D | A / 1 | A / 2 | E / 2 | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### S6

VB = (1,0,1,2,1). A ne change aucune entrée. Ses routes actuelles via B reçoivent des annonces cohérentes avec les coûts déjà présents.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | B / 2 | D / 1 | B / 2 |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | B / 2 | B / 1 | — / 0 | B / 3 | E / 1 |
| D | A / 1 | A / 2 | E / 2 | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### S7

VE = (2,1,1,1,0). C améliore D : ancienne distance 3 via B, nouveau candidat 1+1=2 via E. D ne change rien. Les tables ont maintenant convergé.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | B / 1 | B / 2 | D / 1 | B / 2 |
| B | A / 1 | — / 0 | C / 1 | A / 2 | E / 1 |
| C | B / 2 | B / 1 | — / 0 | E / 2 | E / 1 |
| D | A / 1 | A / 2 | E / 2 | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### Vérifier les routes non directes finales

| Routeur | Routes indirectes retenues |
|---|---|
| A | C : A–B–C, 2 ; E : A–B–E, 2 |
| B | D : B–A–D, 2 |
| C | A : C–B–A, 2 ; D : C–E–D, 2 |
| D | B : D–A–B, 2 ; C : D–E–C, 2 |
| E | A : E–B–A, 2 |

Ces choix correspondent à la photo du tableau. Plusieurs chemins peuvent avoir le même coût, mais la règle de conservation à égalité explique le choix précis du prochain saut.

## 7. Question 3 — Rupture de AB

### F1

A perd toutes les routes dont le prochain saut est B : destinations B, C, E. B perd toutes les routes dont le prochain saut est A : destinations A, D. C, D et E n’ont encore rien reçu et conservent leurs anciennes tables. Le graphe réel reste connecté ; les valeurs ∞ décrivent une perte de connaissance locale.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | — / ∞ | — / ∞ | D / 1 | — / ∞ |
| B | — / ∞ | — / 0 | C / 1 | — / ∞ | E / 1 |
| C | B / 2 | B / 1 | — / 0 | E / 2 | E / 1 |
| D | A / 1 | A / 2 | E / 2 | — / 0 | E / 1 |
| E | B / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### F2

VA = (0,∞,∞,1,∞), VB = (∞,0,1,∞,1). D invalide B, car sa route vers B dépendait de A et A annonce ∞. D conserve C via E, même si A annonce ∞ vers C. C et E invalident A, car leurs routes vers A dépendaient de B. C conserve D via E. C’est précisément ici qu’il faut autoriser une augmentation de distance.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | — / ∞ | — / ∞ | D / 1 | — / ∞ |
| B | — / ∞ | — / 0 | C / 1 | — / ∞ | E / 1 |
| C | — / ∞ | B / 1 | — / 0 | E / 2 | E / 1 |
| D | A / 1 | — / ∞ | E / 2 | — / 0 | E / 1 |
| E | — / ∞ | B / 1 | C / 1 | D / 1 | — / 0 |

### F3

VD = (1,∞,2,0,1). E découvre A via D : 1+1=2. E connaît toujours B directement au coût 1 : le fait que D annonce ∞ vers B ne doit pas effacer la route directe de E.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | — / ∞ | — / ∞ | D / 1 | — / ∞ |
| B | — / ∞ | — / 0 | C / 1 | — / ∞ | E / 1 |
| C | — / ∞ | B / 1 | — / 0 | E / 2 | E / 1 |
| D | A / 1 | — / ∞ | E / 2 | — / 0 | E / 1 |
| E | D / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### F4

VE = (2,1,1,1,0). B découvre A via E au coût 3 et D via E au coût 2. C découvre A via E au coût 3. D redécouvre B via E au coût 2. Les autres entrées sont conservées.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | — / ∞ | — / ∞ | D / 1 | — / ∞ |
| B | E / 3 | — / 0 | C / 1 | E / 2 | E / 1 |
| C | E / 3 | B / 1 | — / 0 | E / 2 | E / 1 |
| D | A / 1 | E / 2 | E / 2 | — / 0 | E / 1 |
| E | D / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### F5

VD = (1,2,2,0,1). A découvre B via D au coût 3, C via D au coût 3 et E via D au coût 2. Les tables ont convergé pour le réseau privé de AB.

| Routeur \ Destination | A | B | C | D | E |
|---|---|---|---|---|---|
| A | — / 0 | D / 3 | D / 3 | D / 1 | D / 2 |
| B | E / 3 | — / 0 | C / 1 | E / 2 | E / 1 |
| C | E / 3 | B / 1 | — / 0 | E / 2 | E / 1 |
| D | A / 1 | E / 2 | E / 2 | — / 0 | E / 1 |
| E | D / 2 | B / 1 | C / 1 | D / 1 | — / 0 |

### Observations à formuler dans une copie

- La rupture est locale, mais elle affecte aussi des routes vers des destinations qui ne sont pas les extrémités de AB.
- La connaissance de la panne se propage par annonces ; elle n’est pas instantanée.
- Le réseau reste connecté. Par exemple, A rejoint B par A–D–E–B et C par A–D–E–C, au coût 3.
- Certaines distances augmentent : A–B de 1 à 3, A–C de 2 à 3. D’autres restent identiques mais le prochain saut change : B vers D reste à 2, désormais via E ; E vers A reste à 2, désormais via D.
- Des tables transitoires ne décrivent pas forcément des chemins utilisables : après F1, D croit encore atteindre B via A, alors que A n’a plus de route vers B.
- À F5, toutes les distances correspondent aux plus courts chemins et toutes les routes sont utilisables. La séquence principale ne produit ni boucle de transfert ni comptage à l’infini avec les conventions indiquées. Il serait incorrect de prétendre observer nécessairement ce phénomène parce que l’algorithme s’appelle Bellman-Ford.

### Variante : pourquoi la convention de stockage compte

Si, avant la panne, B a en cache un vecteur convergé de C annonçant A à distance 2, B peut essayer de rejoindre A via C au coût 3 immédiatement après rupture. Pourtant C pouvait lui-même rejoindre A via B. Tant que C n’est pas mis à jour, les prochains sauts vers A peuvent former B→C→B.

C’est un exemple conditionnel, pas un état du scénario principal. Il exige de préciser le contenu du cache, la sélection des routes de secours et l’ordre des messages. Le démarrage fourni ne garantit pas à lui seul que chaque voisin a reçu tous les vecteurs convergés avant la panne.

Une boucle temporaire n’est pas à elle seule un comptage à l’infini. Ce dernier désigne des estimations qui augmentent au fil d’annonces circulaires. Une destination encore accessible par un autre chemin peut permettre de sortir de cette situation. Les techniques split horizon et poisoned reverse peuvent être présentées en prolongement ; ne pas les activer silencieusement dans la correction.

## 8. Guide de production pour l’IA : objectif et structure

### Instruction principale à donner à l’IA

Construis un module pédagogique interactif en français à partir de cette correction. L’élève doit apprendre à calculer et justifier les tables lui-même. Respecte exactement le graphe, les coûts, les séquences de messages, les conventions et les résultats de référence. Explique chaque modification par une information reçue ; n’utilise jamais la connaissance globale du graphe pour modifier automatiquement les routes du scénario Bellman-Ford. Utilise cette connaissance globale seulement dans un panneau de vérification explicitement identifié.

Produis quatre parties accessibles dans cet ordre :

1. Comprendre les objets : voisins, destination, prochain saut, distance, vecteur.
2. Apprendre la règle de mise à jour sur une seule entrée.
3. Rejouer les deux séquences complètes, avec prédiction avant révélation.
4. Jouer à « Répare le réseau », puis transférer la méthode à une petite variante.

Le guide décrit le module à créer ; il ne prétend pas qu’un site ou un jeu a déjà été implémenté.

### Objectifs observables

À la fin, l’élève sait :

- initialiser une table avec uniquement les voisins ;
- lire une annonce dans le bon sens ;
- calculer le coût via un voisin et expliquer le +1 ;
- choisir le bon prochain saut ;
- conserver une route à égalité ;
- accepter une dégradation provenant du prochain saut courant ;
- invalider toutes les routes dépendant d’une liaison rompue ;
- distinguer graphe réel et connaissance locale ;
- vérifier un chemin en suivant les tables successives ;
- expliquer pourquoi la convergence est progressive.

## 9. Système visuel

### Disposition

Sur grand écran : graphe à gauche, table du routeur sélectionné à droite, événement et calcul détaillé en dessous. Sur mobile : événement, graphe, calcul, puis table. Aucun tableau essentiel ne doit être réduit au point d’être illisible.

Coordonnées logiques conseillées : A=(100,80), B=(280,80), C=(460,80), D=(100,260), E=(280,260). Les liaisons sont exactement AB, AD, BC, BE, CE, DE. Les six étiquettes de coût affichent 1. Ce placement reproduit la structure du sujet.

Utiliser SVG pour le graphe et les animations exactes ; HTML pour les tables ; rendu mathématique pour les formules. Ne pas produire les tables ou les chiffres sous forme d’images générées : ils doivent rester fiables, sélectionnables et accessibles.

### Grammaire visuelle

- Une liaison physique : trait neutre avec coût.
- Un message de routage : enveloppe ou carte « VY », avec flèche Y→X.
- Un paquet de données : symbole distinct, par exemple un disque, avec destination visible.
- Une route retenue : chemin accentué et libellé « prochain saut ».
- Une liaison rompue : trait interrompu et croix, avec texte « rompue ».
- Une entrée qui change : surbrillance temporaire et différence textuelle ancienne→nouvelle.
- ∞ : conserver le symbole et ajouter au survol « aucune route connue actuellement ».

Ne pas utiliser seulement les couleurs. Ajouter des icônes, libellés et motifs. Prévoir navigation au clavier, focus visible, bouton pause et réduction des animations.

### Deux points de vue complémentaires

« Vue du réseau » montre la topologie réelle pour enseigner. « Ce que sait X » distingue ses voisins directs des routes apprises et des destinations inconnues. Expliquer que l’élève voit le graphe entier mais que X ne calcule pas à partir de cette vue globale.

Une annonce Y→X et un acheminement X→Y ont des directions opposées. Les représenter séparément évite l’erreur « le prochain saut est X parce que la flèche du message arrive en X ».

## 10. Storyboard détaillé

### Scène 1 — Lire le réseau

Afficher les cinq nœuds et les six arêtes. Demander de cliquer les voisins de A. Réponse attendue : B et D. Si C est choisi, expliquer « A peut atteindre C par un chemin, mais A et C ne sont pas directement reliés ».

Puis faire compter les sauts de A–B–C : illuminer AB, puis BC, afficher 1+1=2. Ne pas compter trois nœuds comme trois sauts.

### Scène 2 — Remplir la table initiale de A

Révéler les cinq lignes une par une : A à 0 ; B via B à 1 ; C inconnu ; D via D à 1 ; E inconnu. Pour chaque ligne, demander « est-ce moi, un voisin ou une destination non encore apprise ? » avant de montrer la valeur.

Replier ensuite le tableau vers le vecteur VA=(0,1,∞,1,∞), en montrant que seule la colonne des distances est copiée. Le prochain saut reste dans la table locale.

### Scène 3 — Première relaxation : B apprend D à S1

1. Sélectionner B et la destination D ; ancienne case : —/∞.
2. Montrer A qui envoie VA vers B.
3. Mettre en évidence VA[D]=1 dans le message.
4. Mettre en évidence BA de coût 1.
5. Animer deux cartes : « B→A : 1 » et « distance annoncée A→D : 1 ».
6. Combiner : q=1+1=2.
7. Comparer 2<∞.
8. Demander le prochain saut ; réponse A.
9. Remplacer la case par A/2.
10. Faire voyager un paquet B→A→D et compter deux liens.

Texte : « A sait atteindre D en 1 saut. B doit d’abord atteindre A : il ajoute donc 1. »

### Scène 4 — Une route connue peut être provisoirement trop longue

À S2, sélectionner C vers D. Afficher VB[D]=2, donc q=1+2=3. C apprend B/3. Montrer C–B–A–D comme chemin correspondant aux tables à cette étape.

Faire repérer sur le graphe le chemin C–E–D de coût 2, puis expliquer pourquoi C ne le choisit pas encore : C n’a pas reçu VE. Bouton « Que manque-t-il ? » : « l’annonce de E ».

### Scène 5 — Égalité à S3

Chez A vers E : route actuelle via B de coût 2 ; annonce de D donnant 1+1=2. Afficher deux chemins A–B–E et A–D–E. Demander « meilleur, égal ou moins bon ? ». Réponse : égal ; prochain saut conservé B.

Préciser que d’autres conventions peuvent sélectionner l’autre chemin, mais que le scénario applique celle annoncée.

### Scène 6 — Deux annonces à S4

Chez D vers C, montrer deux micro-étapes : réception de VA, candidat 3 via A ; réception de VE, candidat 2 via E. Conserver une étiquette « même étape S4 » pour ne pas créer un faux S supplémentaire.

À la fin, la route est E/2. Le journal peut afficher les deux transitions —/∞→A/3→E/2.

### Scène 7 — Un événement sans modification compte aussi

À S5 et S6, proposer un bouton « comparer toutes les destinations ». Montrer les candidats et la raison de conservation. Ne pas annoncer « rien ne se passe » : un message est traité, mais aucune meilleure route ni dégradation pertinente n’apparaît.

### Scène 8 — Dernière amélioration et convergence

À S7, C vers D passe de B/3 à E/2. Afficher les cinq tables finales et comparer les distances au vérificateur BFS. Offrir « envoyer tous les vecteurs une fois de plus » : aucun changement. Expliquer que cette vérification porte sur toutes les annonces, pas seulement sur une étape sans modification.

### Scène 9 — Casser AB

Rompre uniquement AB. Demander de surligner toutes les entrées dépendantes chez A et B avant validation : chez A, B/C/E ; chez B, A/D.

Faire distinguer « la route via ce voisin est perdue » et « la destination est définitivement déconnectée ». Montrer D et E toujours reliés au reste du graphe.

### Scène 10 — Accepter une mauvaise nouvelle à F2

Sélectionner D vers B : ancien A/2. D reçoit VA[B]=∞. Afficher « L’ancien prochain saut est-il A ? Oui ». Donc la route est invalidée, malgré le fait que ∞ soit plus grand que 2.

Puis sélectionner D vers C : ancien E/2. A annonce également ∞ vers C. Cette fois, A n’est pas le prochain saut actuel et n’offre pas mieux ; la route reste E/2. Montrer les deux cas côte à côte.

### Scène 11 — Reconstruire les routes de F3 à F5

À F3, E apprend A via D ; à F4, E transmet les nouvelles possibilités à B/C/D ; à F5, D permet à A de rejoindre B/C/E. Chaque calcul doit afficher la valeur réellement annoncée à cette étape, et non une ancienne copie.

Terminer en faisant voyager un paquet A→D→E→B, puis C→E→D→A. Afficher 3 sauts pour chacun.

### Scène 12 — Expliquer le résultat

Demander trois courtes explications : pourquoi ∞ n’impliquait pas une déconnexion réelle ; pourquoi B vers D change de prochain saut sans changer de coût ; pourquoi « toujours garder le minimum avec l’ancienne distance » est faux après une panne.

Un encadré facultatif présente les boucles avec cache comme prolongement séparé et conditionnel. Ne pas réécrire le scénario principal pour forcer un comptage à l’infini.

## 11. Mini-jeu : « Répare le réseau »

### Principe

L’élève joue le rôle des routeurs et traite une file d’annonces. Son objectif est de rétablir des routes valides. Le jeu évalue le raisonnement, pas la vitesse des clics.

Chaque défi affiche : routeur récepteur, voisin émetteur, destination, ancienne entrée et valeur annoncée. L’élève choisit : coût candidat ; décision ; prochain saut ; justification parmi « plus court », « même prochain saut donc mise à jour obligatoire », « égalité donc conservation », « proposition moins bonne d’un autre voisin ».

### Missions principales avec réponses

| Mission | Situation | Réponse attendue | Notion |
|---|---|---|---|
| 1 | Initialiser A vers C | —/∞ | Connaissance locale |
| 2 | S1, B reçoit VA, destination D | candidat 2 ; adopter A/2 | Ajouter le coût du premier lien |
| 3 | S2, C reçoit VB, destination D | candidat 3 ; adopter B/3 | Vecteur mis à jour et route provisoire |
| 4 | S3, A reçoit VD, destination E | candidat 2 ; conserver B/2 | Égalité |
| 5 | S7, C reçoit VE, destination D | candidat 2 ; remplacer B/3 par E/2 | Amélioration |
| 6 | F1, rupture AB | A : B,C,E ; B : A,D | Dépendance au prochain saut |
| 7 | F2, D reçoit VA, destination B | candidat ∞ ; invalider A/2 | Mauvaise nouvelle du prochain saut |
| 8 | F2, D reçoit VA, destination C | candidat ∞ ; conserver E/2 | Mauvaise nouvelle d’un autre voisin |
| 9 | F3, E reçoit VD, destination A | candidat 2 ; adopter D/2 | Redécouverte |
| 10 | F5, A reçoit VD, destination B | candidat 3 ; adopter D/3 | Propagation finale |

Le moteur avance avec l’état de référence validé pour qu’une erreur ne corrompe pas toutes les missions suivantes. Dans le mode d’exploration séparé, les erreurs peuvent au contraire être conservées pour observer leurs conséquences.

### Retour sur erreur

- Réponse 1 au lieu de 2 : « Tu as repris la distance annoncée. Quel lien faut-il encore traverser pour rejoindre ce voisin ? »
- Prochain saut D chez B pour rejoindre D à S1 : « B et D ne sont pas voisins. À qui B peut-il réellement transmettre le premier paquet ? »
- Changement vers D à égalité dans S3 : « Le coût convient, mais notre convention conserve la route déjà choisie à coût égal. »
- Conservation de 2 à F2 : « Cette distance dépendait de A. A vient de retirer cette route ; l’ancienne valeur n’est plus justifiée. »
- Suppression de C chez D à F2 : « La route actuelle passe par E. Une annonce moins bonne de A ne retire pas l’information fournie par E. »

### Score et aides

Pour chaque mission : 1 point pour le coût, 1 pour la décision ou les entrées à invalider, 1 pour le prochain saut lorsqu’il s’applique, 1 pour la justification. Adapter le maximum aux champs réellement demandés. Afficher les réussites par notion, pas uniquement un total.

Aides progressives : surligner la valeur annoncée ; surligner le premier lien ; afficher la formule ; révéler la résolution. Ne pas ajouter de chronomètre par défaut.

### Défi final de transfert

Créer une petite variante indépendante en renommant les nœuds ou en changeant une liaison. Générer la correction avec le même moteur et vérifier le résultat par BFS. Conserver tous les coûts à 1 pour ce niveau. Si des poids différents sont proposés en extension, utiliser Dijkstra comme vérificateur pour des poids non négatifs, et expliquer ce changement.

Dans une extension « cache et boucles », afficher explicitement les annonces stockées et leurs dates. Une boucle détectée par le simulateur pédagogique ne doit pas être présentée comme une capacité de détection du protocole de base.

## 12. Spécification du moteur pour l’IA développeuse

### Modèle de données

- nodes : les cinq identifiants.
- links : source, target, cost=1, active.
- tables[router][destination] : distance, nextHop.
- events : identifiant, liste des livraisons ou détection locale de panne.
- messages : sender, receiver, vector copié au début de l’étape.
- history : instantanés complets pour précédent/suivant/recommencer.
- changes : destinataire, destination, ancienne entrée, candidat, nouvelle entrée, justification.

En mémoire, utiliser Infinity pour les routes inconnues. Pour une sérialisation JSON, utiliser la chaîne "INF" puis la reconvertir explicitement à la lecture ; Infinity n’est pas une valeur JSON standard. nextHop absent est null. Ne pas confondre distance 0 et valeur manquante.

### Pseudocode

```text
initialiser(X):
    pour chaque destination Z:
        si Z == X: table[X][Z] = (0, aucun)
        sinon si liaison active X-Z: table[X][Z] = (1, Z)
        sinon: table[X][Z] = (infini, aucun)

recevoir(X, Y, VY):
    exiger que X-Y soit active
    pour chaque destination Z différente de X:
        (ancienCout, ancienSaut) = table[X][Z]
        candidat = 1 + VY[Z]
        si ancienSaut == Y OU candidat < ancienCout:
            si candidat est infini:
                table[X][Z] = (infini, aucun)
            sinon:
                table[X][Z] = (candidat, Y)
        sinon:
            conserver l'entrée

rompre(X, Y):
    désactiver la liaison X-Y
    pour (routeur, voisinPerdu) dans [(X,Y), (Y,X)]:
        pour chaque destination Z:
            si table[routeur][Z].nextHop == voisinPerdu:
                table[routeur][Z] = (infini, aucun)

effectuerEtape(livraisons):
    copier les vecteurs de tous les émetteurs AVANT les réceptions
    pour chaque livraison, dans l'ordre indiqué:
        recevoir(récepteur, émetteur, copieDuVecteur)
    sauvegarder un instantané complet
```

L’affichage graphique lit l’état du moteur ; il ne contient pas un deuxième calcul de routage. Les corrections ne doivent pas être codées dans les composants visuels. Conserver les tableaux de ce document comme résultats de référence indépendants des animations.

### Parcours d’un paquet

Le paquet porte source, destination, routeur courant et historique. À chaque saut, consulter table[routeurCourant][destination]. Si le coût vaut ∞, arrêter avec « aucune route connue ici ». Si le prochain saut n’est pas un voisin actif, signaler une entrée invalide. Si un routeur déjà visité réapparaît pour cette destination et cet instantané fixe, signaler une boucle. À destination, compter les liens parcourus. Ce parcours n’influence pas les tables.

### Contrôles fonctionnels

- Précédent, suivant, lecture/pause, recommencer la phase.
- Choix de routeur et de destination.
- Affichage « toutes les comparaisons » ou « seulement les changements ».
- Prédiction avant révélation, désactivable.
- Panneau des cinq vecteurs avec ordre A,B,C,D,E toujours visible.
- Journal explicitant chaque opération « 1 + annonce = candidat ».
- Pour S4 : sous-étapes VA puis VE sans changer la numérotation.
- Mode correction à convention fixe ; mode variantes visuellement distinct.

## 13. Critères de validation

1. Le graphe a exactement cinq nœuds et six liaisons symétriques de coût 1.
2. Les cinq tables initiales correspondent à la section 5.
3. Chaque instantané S1–S7 et F1–F5 correspond aux tableaux de référence, distances ET prochains sauts.
4. À S2, C vers D vaut 3 via B, pas 2.
5. À S3, A vers E reste via B ; E vers A reste via B.
6. À S4, D vers C termine à 2 via E.
7. À S7, C vers D passe à 2 via E.
8. À F1, toutes les routes dépendantes de AB sont invalidées.
9. À F2, D perd B mais conserve C ; C et E perdent A.
10. À F3, E redécouvre A via D à 2.
11. À F4, B vers A vaut 3 via E ; B vers D vaut 2 via E ; C vers A vaut 3 via E ; D vers B vaut 2 via E.
12. À F5, A vers B et C vaut 3 via D ; A vers E vaut 2 via D.
13. À chaque étape, dX(X)=0 ; tout prochain saut fini pour une autre destination est un voisin actif.
14. Aux états convergés, BFS donne toutes les mêmes distances ; les chemins des prochains sauts atteignent la destination sans boucle et avec cette longueur.
15. Après F5, une nouvelle diffusion de tous les vecteurs ne change rien.
16. Le bouton précédent restaure aussi les prochains sauts, la topologie et les messages, pas seulement les distances.
17. Le contenu reste lisible sur mobile, sans animation, au clavier et sans dépendre des couleurs.
18. Aucun texte ne prétend que Dijkstra ou BFS est le protocole exécuté par les routeurs de cet exercice.
19. Aucun texte n’affirme que l’algorithme connaît le chemin complet à partir du seul vecteur reçu.
20. Aucun texte n’impose le comptage à l’infini dans la séquence principale.

## 14. Format de livraison conseillé à l’IA

Livrer le module fonctionnel avec les deux séquences, le mini-jeu, une courte explication des conventions, le moteur de calcul séparé des vues et des vérifications correspondant aux points précédents. Fournir un mode « lecture seule » contenant les explications et les tableaux afin que l’apprentissage reste possible si les animations sont désactivées.

Avant de déclarer le module terminé, rejouer au moins S2, S3, S4, S7 et F1–F5, vérifier les chemins finaux et lire l’interface sur écran étroit. Ne pas ajouter de fonctionnalités qui changent le protocole sans les isoler dans une extension.
