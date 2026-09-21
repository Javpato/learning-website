# Mandat pour Codex — Réseaux : apprendre en construisant

## 1. Ton rôle et le résultat attendu

Tu es Codex, responsable de la conception pédagogique, de la cohérence
scientifique, de l'architecture, du code et de la validation.
Le lecteur est un étudiant de L2 informatique qui découvre les réseaux et
doit ensuite résoudre les exercices écrits du module sans l'aide du jeu.

Tu peux utiliser **Claude Sonnet 5 (`claude-sonnet-5`)** pour des tâches bornées
de repérage, synthèse ciblée ou inventaire. Vérifie les éléments déterminants
de ses réponses. Sonnet ne pilote pas le projet et ne délègue pas à son tour.
S'il est indisponible, poursuis directement avec les outils locaux ; son accès
n'est pas une condition de progression. Conserve le modèle Codex actuel.

L'utilisateur a approuvé la direction puis demandé de terminer tout le
chantier de façon autonome, sans arrêt après le prototype. Inspecte l'existant
et résous les choix pédagogiques dans ce cadre. Ne demande pas où se trouve
une information que tu peux lire dans le dépôt ; ne redemande pas les décisions
inscrites dans DECISIONS.md. Les choix techniques courants restent de ton ressort.

## 2. Autorité et limites du chantier

Lis les règles générales : `AGENTS.md`, `platform/CLAUDE.md`,
`COURSE_PLAYBOOK.md`. Consulte `RESOURCES-reseaux.md` comme index historique
et `codex-reseaux-rewrite.md` comme description de l'ancien parcours.
Ces documents ne sont pas une preuve que le code actuel ou chaque corrigé
est exact : vérifie la portion utilisée.

Les décisions utilisateur suivantes remplacent, **pour ce chantier seulement**,
les anciennes prescriptions incompatibles :

| Ancienne prescription | Décision actuelle |
| --- | --- |
| Refonte de tout Réseaux, puis traductions en/es | Introduction + TD1 + Routage seulement, en français uniquement |
| Organisation actuelle en 14 leçons | Organisation pédagogique alignée sur les parties des PDF du cours ; préserver les liens existants ou prévoir leur correspondance |
| Ordre rigide des blocs, longueur uniforme des leçons | Défi → essai → explication → nouvel essai → transfert sans aide ; introduction plus légère, rigueur conservée |
| Recherche de plusieurs polycopiés externes avant rédaction | Corpus local d'abord ; recherche externe seulement pour une lacune précise |
| Annale comme mission imposée du chapitre physique | Prototype fidèle aux exercices 1 et 2 du TD1 |

Les protections générales continuent de s'appliquer : aucun verrou par score,
indices sans pénalité, provenance visible, design tokens, thème sombre,
accessibilité, sécurité et préservation des autres cours.
Ne pas lancer de traductions, de refonte IP/TCP, de déploiement ou de chantier
global de navigation. Ne pas supprimer les anciens contenus hors périmètre.

## 3. Sources et efficacité

- **Annales : ce qu'il faut savoir faire.** Sélectionne trois sujets distincts,
  justifie la couverture et consulte le final pour repérer les compétences
  utiles. Un sujet et son corrigé ne comptent qu'une fois. Les annales donnent
  des priorités, sans supprimer les prérequis absents des trois sujets.
- **TD/TP : comment s'entraîner.** Préserve données, hypothèses, questions et
  forme de réponse attendue. Les variantes libres sont identifiées comme telles.
- **Cours : contenu et structure.** Conserve l'ordre des grandes parties et
  rattache les ateliers TD aux notions utiles ; ne prétends pas que le codage
  est développé dans Intro.pdf s'il provient du TD.

Pars de SOURCES.md. Cache l'extraction une seule fois par version de PDF,
avec repères de pages et empreinte du fichier. Un texte vide signifie souvent
un scan, pas un document sans contenu. Inspecte les images des pages pertinentes
pour les graphes, flèches, signaux, tableaux et annotations. OCR ciblé seulement
si nécessaire ; contrôle visuellement ses chiffres.

Ne charge pas tout le corpus et tout le code à chaque tâche. Constitue une
petite matrice : compétence → fichier/page/question → activité → preuve de
maîtrise. Conserve les calculs vérifiés et les incertitudes. Signale une
contradiction, explique la résolution proposée et n'invente pas de corrigé
officiel. Ne reproduis pas les noms des étudiants figurant sur les copies.

Internet est réservé à un manque identifié ou à la vérification d'un lien
d'approfondissement. Formule la question avant de chercher, privilégie une
source primaire, garde la référence et cesse la recherche quand elle est résolue.

## 4. Pédagogie et réseau commun

Faire comprendre une utilité avant d'introduire son vocabulaire :
**besoin concret → essai/prédiction → définition et explication → nouvel
essai guidé → exercice sans aide**. Le premier défi doit être compréhensible
sans vocabulaire inconnu ; les termes techniques sont expliqués à leur apparition.

Construire progressivement un réseau commun : d'abord une liaison qui transporte
un message, puis plusieurs nœuds et l'acheminement. Chaque atelier ajoute une
capacité compréhensible à ce réseau. Minimiser les jeux indépendants, mais
les accepter si les rattacher crée une analogie fausse ou une interface confuse.
La progression est indicative : tous les ateliers, solutions et états de
démonstration restent accessibles directement, même après un échec.

Chaque activité doit préciser : objectif, prérequis, situation, actions de
l'élève, état observable, explication, erreurs typiques, indices et exercice
de transfert. Une animation ou un QCM décoratif ne constitue pas un jeu utile.

Si une mauvaise action possède une conséquence physique/protocolaire modélisable,
la montrer puis l'expliquer. Une mauvaise réponse de calcul ne change pas
magiquement le débit réel : comparer prédiction et résultat. Sinon fournir
une explication ciblée et un nouvel essai, sans simple « faux » ni humiliation.

## 5. Contenu à construire après le prototype

### Introduction et TD1

Introduction très interactive mais proportionnée à son importance. Respecter
les 18 pages PDF (35 diapositives) sans imposer un jeu par page.
Carte mentale : objectif dans un bloc central ; mots importants cliquables,
accent rouge avec token de thème approprié et autre signe d'interactivité ;
définitions à gauche sur grand écran, panneau adapté sur mobile. Navigation
clavier, focus visible et information non dépendante de la couleur.

Pour chaque ensemble cohérent de notions, un petit atelier utile au réseau
commun. Histoire et normalisation : résumé fidèle, détails dépliables et
quelques liens facultatifs vérifiés ; pas de longues recherches ou de jeu forcé.

TD1 : donner l'utilité du codage, comparer la même suite en NRZ, Manchester
et Manchester différentiel ; adapter le TD, y compris modulation et contrôle
d'erreurs dans le périmètre autorisé. Ne pas confondre les 5 pages du TD1
avec les TD2/TD3 contenus dans le même fichier.

### Routage — Communication dans un réseau

Suivre les groupes de notions du cours. Partir de la problématique page 3 :
comment relier plusieurs équipements, à quoi servent les nœuds et les liaisons ?
Faire comparer coûts, connectivité et chemins ; il n'existe pas un nombre de
nœuds universellement « meilleur » sans contraintes explicites.

Utiliser aussi les pages 6 (connexion, transfert, libération) et 9 (points de
vue usager/réseau et entre nœuds). Distinguer mode connecté/non connecté des
choix de commutation. Faire comparer circuits, messages, paquets et cellules,
notamment petite taille et taille fixe, avec métriques et compromis visibles.

Introduire la théorie des graphes au service du problème : nœuds, arêtes,
coûts, chemin, prochain saut. Reconstruire Dijkstra puis le routage à vecteurs
de distances par étapes motivées, avant les exercices. Le TD appelle le second
« Ford-Fulkerson » : vérifier son mécanisme et expliquer le vocabulaire local ;
ne pas implémenter un algorithme de flot maximal à cause de ce nom.

Adapter les deux exercices de routage de TD456, toutes leurs sous-questions
pertinentes, y compris celles de mise en œuvre et de panne. Distinguer arêtes
orientées, coûts asymétriques et hypothèses de symétrie selon l'exercice.
Reporter TD5/IP et TD6/transport.

## 6. Premier lot : scénario TD1 retenu

Construis ce parcours court, puis étends-le au périmètre complet autorisé :

1. Besoin : transmettre un message entre deux machines reliées.
2. Exercice 1 : suite exacte `101001001`, horloge et trois codages ; observer
   les mêmes bits sous différentes représentations. Respecter les conventions
   du TD et rendre l'état initial du Manchester différentiel explicite.
3. Exercice 2 : alphabet de **16 symboles**, chaque symbole dure **T**.
   Attendus : valence 16, 4 bits/symbole, R = 1/T bauds, D = 4/T bit/s
   lorsque T est en secondes. Conserver la réponse symbolique ; un curseur
   numérique est une illustration complémentaire, pas un nouvel énoncé.
4. Montrer comment cette liaison contribue au réseau commun.
5. Terminer par une résolution sans aide et une courte explication personnelle.

Réutilise ou adapte le moteur et les composants existants quand ils conviennent.
Le code actuel ne fait pas foi contre le TD : voir le piège Manchester dans
SOURCES.md. Écris des assertions de signaux par demi-bit conformes
à la figure, pas seulement une vérification du nombre de points.

Après implémentation, vérifie les interactions puis poursuis l'introduction
complète et le routage. L'utilisateur a explicitement levé l'arrêt au prototype.
La validation technique ne remplace pas son futur retour pédagogique.

## 7. Français uniquement et retour à la langue d'origine

Afficher clairement « Ce parcours est disponible en français », avec une
transition visuelle cohérente. L'annonce sur les entrées anglaise/espagnole
doit être compréhensible dans la langue de départ ; cela ne constitue pas
une traduction du cours.

Mémoriser la langue d'origine avant l'entrée dans le parcours français.
La navigation interne française ne doit pas écraser cette préférence.
Les sorties vers le reste du site rétablissent la langue d'origine, y compris
les liens vers le site historique. Sans langue connue, utiliser le français.
Le choix ultérieur explicite d'une langue par l'utilisateur reste prioritaire.

Inspecter le sélecteur global, les fils d'Ariane, les routes en/es existantes
et le basePath avant de choisir le mécanisme. Ne pas laisser croire qu'une
nouvelle leçon française possède une traduction à jour. Ne pas détruire les
anciennes traductions ou modifier le comportement des autres modules.
Documenter la correspondance des routes et tester liens directs, rechargement,
retour navigateur et stockage indisponible. Le prototype reste utilisable
même si la mémorisation échoue.

## 8. Collaboration et validation

Codex décide, implémente et vérifie. Avant une délégation utile, remplir
TACHE-SONNET.md avec un objectif unique, les seuls extraits/fichiers nécessaires,
un format de réponse concis et des références exactes attendues. Le lanceur
Sonnet est en lecture seule : pas de modifications, de shell ou de recherche
Internet ouverte. Une recherche externe nécessaire reste ciblée et pilotée
par Codex. Ne pas envoyer tout le dossier pour une petite tâche.

Réutiliser le cache des PDF et l'index. Préférer les scripts locaux pour les
opérations mécaniques ; ne pas déléguer une commande simple ni faire relire
les mêmes pages à deux modèles. Vérifier les conclusions utiles de Sonnet
contre les sources, sans refaire systématiquement tout son inventaire.
Inspecter le diff et exécuter les contrôles avant de déclarer le lot terminé.
Si Sonnet échoue, noter l'erreur et continuer directement, sans boucle de
reprises ni changement automatique de modèle.

Critères : fidélité des données, conventions et calculs ; erreurs utiles ;
absence de verrou ; exercice sans aide ; clavier/mobile ; retours en→fr→en,
es→fr→es et entrée directe fr ; liens et contenu hors périmètre préservés.

Depuis `platform/`, pour les futurs changements du site :

```bash
npm run verify:reseaux
npm run verify:content
npx tsc --noEmit
npm run build
```

Le parcours français utilise une route TSX et une entrée explicite depuis les
versions anglaise et espagnole. Les anciens contenus MDX conservent leur parité ;
`verify:content` reste intégral, sans dérogation ni traductions fictives.

Ne pas lancer de builds simultanés. Pour l'export statique, consulter les
paramètres actuels du dépôt ; le playbook contient deux budgets mémoire
contradictoires (8192/14336). Diagnostiquer selon l'environnement, sans
nettoyage massif ni changement d'infrastructure pour ce chantier.

À chaque arrêt, mettre à jour DECISIONS.md : réalisé et vérifié, décisions,
questions restantes et prochaine action exacte. Distinguer « prévu »,
« implémenté », « testé » et « validé par l'utilisateur ».

## Compléments demandés le 21 septembre 2026

- Reconstruire les algorithmes par manipulation et calcul avant la solution. Expliquer l’invariant de Dijkstra, les coûts non négatifs et les limites de la convergence entre voisins.
- Proposer systématiquement des exercices de programmation adaptés des TD lorsque pertinents. Le C est attesté dans TP2v2.pdf p. PDF 1 (client_udp.c, serveur_udp.c) ; les TD ne prescrivent pas eux-mêmes ce langage.
- Définitions cliquables dans les phrases, panneau à droite fermé par X, Échap ou clic extérieur.
- Masquer « Mon réseau » jusqu’à une discussion sur sa conception.
- Intégrer les supports de cours originaux et relier chaque exercice adapté aux explications utiles, sans inventer de correspondance absente des sources.
