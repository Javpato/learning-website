# Livraison du parcours Réseaux

## Périmètre réalisé

- Introduction : carte de définitions, construction de topologie, histoire
  facultative, couches et encapsulation manipulables.
- TD1 : construction/décodage NRZ, Manchester et Manchester différentiel ;
  alphabet à 16 symboles et débits ; constellation/QPSK ; Shannon ; parité,
  distances de Hamming et multiplication/division polynomiale. Les sept
  exercices sont couverts avec explications, essais et questions de transfert.
- Routage : services, commutation et tailles des paquets, chronogramme du
  partiel 2023, Dijkstra orienté, vecteurs de distances et panne C–D du TD4.
- Mission commune : liaisons, message, codage et parité conservés localement,
  chemin calculé et acheminement par prochain saut. Aucun score ne bloque rien.
- Français uniquement : entrées EN/ES explicites, langue de retour conservée
  en session avec paramètre d’entrée ; accès sans historique en français.

Le périmètre ne comprend pas une nouvelle version d’IP et du transport.
Les anciens cours, exercices et annales restent accessibles depuis le portail.
Les TD, annales et leurs extractions restent privés. Depuis la révision du
21 septembre, les quatre supports de cours originaux sont publiés à la demande
de l’utilisateur, avec leurs 136 pages rendues et leur texte sélectionnable.

## Organisation du code

- `platform/components/cs/network-lab/` : interface, ateliers et état commun.
- `platform/lib/cs/networkLab.ts` : calculs purs, conventions du TD, graphes.
- `platform/lib/cs/networkLanguage.ts` : sélection de langue, sans dépendance UI.
- `platform/app/[locale]/cs/reseaux/atelier/page.tsx` : nouvelle entrée.
- `platform/scripts/verify-network-lab.cjs` : assertions sur fixtures des sources.

La route conserve les anciens liens et registres. Les conventions historiques
ne sont pas changées globalement pour imposer celles du TD1.

## Vérifications

- `npm run verify:content` : 291 fichiers MDX, 51 leçons, 145 exercices,
  12 examens ; contrôle complet, sans désactivation de parité.
- `npm run verify:reseaux` : 55 contrôles historiques + 1 594 assertions du
  laboratoire (signaux exhaustifs courts, corrigés, graphes, panne, délais,
  choix de langue).
- TypeScript sans erreur.
- Navigateur : signal Manchester invalide puis corrigé, réponse erronée puis
  correcte à la valence, parité à une/deux inversions, mauvais choix Dijkstra
  puis solution, panne C–D, transmission finale A–N1–N2–B.
- Les allers-retours EN → FR → EN et ES → FR → ES aboutissent aux portails
  attendus ; la langue d’entrée survit au rechargement.
- Vue mobile 390 × 844 : mission utilisable, sans débordement horizontal.
  Pas d’erreur de console pendant les interactions contrôlées.

Les conséquences et chiffres ont été vérifiés ; l’efficacité pédagogique
auprès d’étudiants reste à évaluer à l’usage. Les simulations sont des modèles
explicitement simplifiés, pas des émulateurs de protocoles complets.

- Export de production `GITHUB_PAGES=true npm run build` réussi sur GitHub
  Actions le 20 septembre 2026 : run 35504228861, job build 106061193469.
  La publication depuis la branche de travail est refusée par la protection
  normale de l’environnement Pages ; la fusion sur `main` déclenche sa publication.

## Révision du 21 septembre 2026

Dijkstra : reconstruction de la règle, fixation du minimum, relaxation manuelle,
retour arrière, propagation animée d’un budget de coût et preuve par frontière.
Vecteurs : annonces déplaçables entre voisins, calcul des coûts, tables construites,
solution libre et explication des limites après panne. Les sommets se déplacent
à la souris, au toucher et au clavier ; leur position ne change pas les coûts.

Définitions intégrées aux phrases ; lecteur de Intro/Routage/IP/TCP avec liens
par page ; aides associées aux exercices TD1 et TD4. « Mon réseau » est masqué.
Trois fonctions C à compléter (parité, Dijkstra, vecteurs), téléchargeables avec
assertions, solutions compilées et exécutées par verify:reseaux. L’éditeur conserve
le brouillon localement ; la compilation du code étudiant se fait dans un terminal.
Le langage vient de TP2v2.pdf p. 1, confirmé par Sonnet puis vérifié dans la source.

Les descriptions de mission et contrôles de la section initiale ci-dessus
concernent la première livraison. Le rendu des pages se régénère avec
`python3 docs/reseaux-refonte/render-course-pages.py`, en réutilisant les textes cachés.

## Exercice 4 Bellman-Ford — 22 septembre 2026

Entrée `#routage/bellman-guide`, après l’atelier TD4. Moteur pur
`bellmanGuide.ts`, interface `BellmanGuide.tsx`, source `GUIDE-BELLMAN-FORD.md`.
Les fixtures `fixtures/bellmanGuide.json` ont été extraites des tableaux du guide,
sans calcul de routage. `verify-bellman-guide.cjs` compare tous les coûts et
prochains sauts, les copies des messages, les invalidations, les chemins finaux,
BFS et l’absence de modification après diffusion complète aux états convergés.

Le rejeu conserve les snapshots complets ; S4 conserve dans son journal les
deux changements vers C chez D. Mini-jeu : dix missions avec justification,
aides progressives et retour ciblé. Un mode lecture expose tous les tableaux
sans animation. Le quatrième exercice C vérifie une invalidation, la conservation
à égalité et une augmentation finie annoncée par le prochain saut courant.
