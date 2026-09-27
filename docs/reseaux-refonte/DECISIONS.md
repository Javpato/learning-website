# Décisions et reprise — 19 septembre 2026

## Décisions actives validées par l'utilisateur

- **Codex pilote** pédagogie, architecture, code et validation.
- **Sonnet 5 (`claude-sonnet-5`) assiste** sur des tâches bornées de lecture,
  repérage ou synthèse ; Codex vérifie les résultats déterminants.
- Sonnet est facultatif : si indisponible, Codex continue directement.
- Scripts locaux et cache d'abord ; pas de recherches ouvertes ni de travail
  intégralement dupliqué entre les modèles.
- Ateliers reliés au réseau commun ; jeux indépendants seulement si nécessaire,
  en minimisant leur nombre.
- Défi avant explication, puis pratique et transfert sans aide.
- L’utilisateur a autorisé de terminer autonomement tout le périmètre, sans arrêt au prototype.
- Périmètre : introduction, TD1, puis routage. TD456 : routage seulement.
- Français uniquement ; annonce claire, langue d'origine restaurée à la sortie.
- La livraison comprend le parcours fonctionnel et les instructions mises à jour.

## État du travail

Introduction, sept exercices TD1, routage TD4 et mission commune implémentés.
Route `/fr/cs/reseaux/atelier` ; entrées localisées et langue de retour conservée.
Les pages et moteurs historiques sont préservés. Les contrôles et fichiers
sont détaillés dans [LIVRAISON.md](LIVRAISON.md).

## Historique — décisions remplacées, non applicables

Initialement, Claude devait piloter Codex avec Fable 5.1. L'appel à
`claude-fable-5-1` a échoué avec `429 / credits_required` ; aucune inférence
n'a abouti. Le premier lanceur et ses tests visaient cette organisation.

L'utilisateur a ensuite inversé les rôles : Codex dirige, Sonnet 5 assiste.
Un test minimal avec `claude-sonnet-5` a réussi et les métadonnées ont confirmé
ce modèle. Le blocage Fable n'est plus un prérequis à résoudre.

## Vérifications de la mise à jour des rôles

- Liens locaux vérifiés et anciennes instructions de pilotage retirées des
  consignes actives ; l'historique Fable est conservé ci-dessus.
- Syntaxe Bash et invocation simulée vérifiées : Sonnet 5 exact, effort faible,
  mode plan, Read/Grep/Glob seuls, hooks/MCP désactivés, absence de fallback.
- Transmission littérale sur stdin, chemin relatif avec espaces, tâche absente
  ou vide, arguments supplémentaires et corpus absent contrôlés.
- Appel réel via le lanceur réussi : inventaire ciblé des lignes 72–101 de
  LineCodingWidget.tsx. Presets et valeur initiale contrôlés contre le code.
  Nuance apportée par Codex : `oneRising` règle la convention du Manchester
  simple, mais l'initialisation dans le différentiel ; ne pas généraliser
  « 1 = montant » à chaque bit différentiel depuis le seul nom du paramètre.
- Aucun build applicatif lancé : seuls les documents et le lanceur ont changé.

## Décisions scientifiques et réalisation

- Trois partiels : sujet 1 h (codage), 2021 (vecteurs), L2Info 2023
  (commutation). Le final complète la lecture des tables, sans étendre à IP.
- Conventions TD1 isolées du moteur historique : Manchester 1 descendant ;
  différentiel initial haut, transition initiale pour 0, transition centrale constante.
- TD1 : le corrigé Shannon utilise un logarithme incorrect (résultat corrigé
  ~478 427 bit/s) ; la comparaison avec parité explicite les hypothèses de capacité.
- TD4 : graphe Dijkstra orienté, coûts asymétriques ; deuxième algorithme
  identifié comme vecteur de distances/Bellman-Ford, malgré le nom Ford-Fulkerson.
- Routage TD456 limité aux deux premières pages. IP et transport reportés.
- Ateliers communs persistants, contrôles sans verrou, conséquences simulées
  uniquement lorsqu’elles ont un sens technique.
- Sonnet a résumé une portion bornée de l’introduction ; Codex a contrôlé les
  éléments utilisés. Extractions et scripts locaux réutilisés.

## Historique de l’autorisation

Après le plan de répartition, l’utilisateur a demandé : « continue et termine
 tout seul le travail, ne fait pas que le prototype ». Cela remplace l’ancien
arrêt de discussion ; aucun accord sur un rendu final n’est prétendu.

### 2026-09-21 — Révision des ateliers de routage

Révision autorisée : reconstruction et manipulation des algorithmes, définitions
en contexte, cours originaux intégrés, exercices de code fondés sur les TD.
C retenu d’après TP2v2.pdf p. 1 ; aucune attribution du langage aux TD eux-mêmes.
« Mon réseau » masqué en attendant une discussion. Sonnet utilisé uniquement
pour un relevé borné des sources, vérifié ensuite.

### 2026-09-22 — Guide de l’exercice 4 Bellman-Ford

Ajout demandé du guide fourni, conservé dans GUIDE-BELLMAN-FORD.md. Atelier
indépendant après le TD4 : cinq nœuds, six liens unitaires, annonces S1–S7,
rupture et propagation F1–F5. La convention sans cache et la conservation
à égalité ne remplacent pas la variante avec cache du TD4 précédent.
Les 13 tableaux du document deviennent des fixtures indépendantes du moteur.
BFS est seulement un vérificateur, jamais le protocole du scénario.
Ajout du mini-jeu à dix missions, d’une variante sans BE et d’un exercice C
sur la réception d’un vecteur. Aides, correction statique et navigation libres.

## 2026-09-27 — IP, TD et annales : intégration du plan approuvé

Décisions validées dans ce chantier : atelier français ; CM par sections dans
l’ordre des diapositives ; énoncés ET corrigés originaux, avec explications et
errata séparés ; questions IP des annales intégrées ; accueil par thème.
Ces décisions remplacent les anciennes exclusions IP/navigation du 19 septembre.

Implémenté :
- 60 diapositives IP en 18 sections, références aux pages PDF et liens réciproques.
- 13 TD IP, transcription et images des sources, solutions détaillées, activités.
- Neuf activités : en-tête, masques, prochain saut, ARP, fragments, ICMP,
  RIP, OSPF et lecture des champs ARP. Préréglages cours/TD/final et tableau
  de fragments à compléter ; pas de score ni d’accès conditionnel.
- Huit exercices d’annales expliqués et QCM ciblés ; copies annotées séparées
  des corrections recalculées, identifiants illisibles explicitement signalés.
- Accueil par thème, filtres et recherche ; routes et hashes précédents préservés.
- Compléments CM de routage, étiquettes de circuit virtuel et ordre DV/Dijkstra.
- Corrections factuelles limitées des anciennes pages IP, dans les trois langues.

Organisation : trois sous-agents ont contribué. Deux ont atteint leur limite
après enregistrement ; l’orchestrateur a repris l’intégration et les annales.
Claude Sonnet a relu les activités et calculé les cas de sous-adressage scannés ;
les conclusions retenues ont été contrôlées contre les images et les calculs.

Validation intermédiaire : verify:content, tsc et verify:reseaux passent,
y compris 396 assertions de couverture IP et les invariants historiques.
Le premier build global à 14 Go a été tué par le système. Un mode opt-in
LOW_MEMORY_BUILD active le worker webpack et désactive son cache, sans changer
le comportement du site. Le build statique a réussi (523 pages), puis la QA
navigateur a contrôlé les activités, les liens, l’historique et le mobile.
Le 27 septembre, l’utilisateur a explicitement demandé de pousser et fusionner.
La validation pédagogique par l’utilisateur reste distincte de ces contrôles.
