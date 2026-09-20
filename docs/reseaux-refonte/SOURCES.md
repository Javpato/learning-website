# Index ciblé des sources et du site

Racine du dépôt : `/home/javpato/Desktop/todoProgra/learning-website`.
Corpus : `/home/javpato/Desktop/documentos/cours/Réseaux`.
Les chemins PDF ci-dessous sont relatifs au corpus. Les autres chemins sont
relatifs au dépôt. Inventaire vérifié le 19 septembre 2026 ; ce document ne
prétend pas que toutes les pages et tous les corrigés ont été relus.

## Lecture initiale minimale

Lire BRIEF.md et DECISIONS.md, les contrats du dépôt, puis pour le prototype :
TD123 pages PDF 1–2, le widget et le moteur de codage, la page TD1 et ses tests.
L'ancien `RESOURCES-reseaux.md` donne une carte détaillée du corpus ; ses
affirmations historiques « all read » ne remplacent pas ta vérification.

## Corpus inventorié

| Fichier | Pages PDF | Utilité / état de l'extraction |
| --- | ---: | --- |
| `Cours/Intro.pdf` | 18 | 35 diapositives, généralement 2 par page ; texte extractible |
| `Cours/Routage.pdf` | 48 | 1 diapositive par page ; texte extractible |
| `Cours/IP.pdf` | 30 | Hors refonte ; contexte ponctuel seulement |
| `Cours/TCP.pdf` | 40 | Hors refonte |
| `TD/TD123-correction.pdf` | 16 | TD1 p. 1–5 ; TD2 p. 6–12 ; TD3 p. 13–16 |
| `TD/TD456-correction.pdf` | 12 | TD4 routage p. 1–2 ; ensuite IP/transport hors refonte ; ne pas inférer la présence de corrigés du nom seul |
| `TD/TD-routage-correction.pdf` | 5 | Série séparée, 4 exercices ; ne pas la supposer corrigé exact de TD456 |
| `TD/TD_IP-correction.pdf` | 11 | Hors refonte |
| `TD/TD_transport-correction.pdf` | 6 | Hors refonte |
| `TD/TP2v2.pdf` | 9 | TP sockets, à consulter seulement pour un besoin pertinent ; pas de chantier transport |
| `Annales/Partiel/partiel.pdf` | 2 | Sujet 1 h, codage et HDLC ; texte extractible |
| `Annales/Partiel/partiel_corr.pdf` | 4 | Corrigé associé ; figures à voir |
| `Annales/Partiel/partiel-2021.pdf` | 2 | Routage à vecteurs de distances p. 1 ; IP p. 2 |
| `Annales/Partiel/partiel-2021-correction.pdf` | 5 | Tables et corrections ; même sujet que ci-dessus |
| `Annales/Partiel/partiel-L2Info-2023.pdf` | 6 | Scan : extraction texte vide ; lecture visuelle nécessaire |
| `Annales/Partiel/partiel-ldd-2023.pdf` | 6 | Scan : extraction texte vide ; autre variante 2023 |
| `Annales/Partiel/Preparation_Partiel (Selon Lila Boukhatem).pdf` | 3 | Préparation avec Dijkstra ; ne pas compter automatiquement comme session supplémentaire |
| `Annales/2024 - 2025/Partiel - Réseaux - 2024_25.pdf` | 8 | Scan : extraction texte vide |
| `Annales/Exam/Annale_Exam.pdf` | 2 | Presque sans texte extractible (63 caractères) ; voir les images |
| `Annales/Exam/Annale_Exam_Corr.pdf` | 3 | Corrigé extractible ; surtout IP, à filtrer selon le périmètre |

### Candidats pour les trois sujets

Point de départ proposé, à confirmer par lecture : sujet 1 h pour le codage,
2021 pour les vecteurs de distances et 2023 L2Info pour commutation/délais.
2024–25 est un complément ou un remplacement possible pour la panne,
les tables et l'horizon partagé, d'après l'index historique. Choisir en
fonction des compétences, pas uniquement de la facilité d'extraction.
Consigner la sélection finale et sa justification dans DECISIONS.md.
Le final sert à vérifier le transfert pertinent ; ne pas introduire tout IP
dans cette refonte parce qu'il apparaît dans ses exercices.

## Repères du cours

| Source / pages PDF | Sujet | Usage |
| --- | --- | --- |
| Intro p. 1–2 | Organisation, bibliographie, repères historiques | Orientation légère |
| Intro p. 3–5 | Définition, intérêts, acteurs, normalisation | Carte mentale, détails facultatifs |
| Intro p. 6–7 | Classification et topologies | Relier des équipements et comparer |
| Intro p. 8–15 | Décomposition, couches, services, protocoles, unités et encapsulation | Ateliers cohérents ; noter le n° de diapositive lors de la lecture visuelle |
| Intro p. 16–18 | OSI et TCP/IP | Comprendre les rôles sans refaire le cours IP/TCP |
| Routage p. 3 | « Introduction : problématique? » | N équipements, nœuds d'accès/internes, liaisons |
| Routage p. 4–9 | Rôle/services, modes connecté et non connecté | p. 6 : trois phases ; p. 9 : deux points de vue |
| Routage p. 11–14 | Unités, débits, temps | Calculs et chronogrammes |
| Routage p. 15–25 | Circuits, messages, paquets, cellules | p. 23–24 : petite taille / taille fixe ; comparer les compromis |
| Routage p. 27–39 | Adressage conceptuel, acheminement, adaptation, protocoles | Construire l'utilité des tables et des chemins |
| Routage p. 40–43 | Graphes et vecteurs de distances | Coût minimal, échanges locaux, boucles |
| Routage p. 44–48 | États de liens et Dijkstra | Carte du réseau, calcul local, comparaison |

## TD : détails à ne pas perdre

- **TD123 p. 1, TD1 ex. 1 :** `101001001`, horloge puis NRZ, Manchester,
  Manchester différentiel ; alphabet et valence. La figure a été inspectée.
  Manchester : **1 = transition descendante**, **0 = montante**, à mi-bit.
  Le moteur `manchester` a au contraire `oneIsRising=true` par défaut :
  sélectionner explicitement la convention du TD, ne pas changer tous les
  anciens exercices. Vérifier séparément le tracé différentiel et son début.
- **TD123 p. 2, ex. 2 :** 16 symboles de durée T ; R=1/T, V=16,
  D=R log₂(V)=4/T. Ex. 3 ensuite : amplitude/phases et débit.
- **TD123 p. 3–5 :** ex. 4 modulation/MIC, ex. 5 parité, ex. 6 Hamming,
  ex. 7 codes polynomiaux. À traiter après le prototype, avec contrôle des
  unités et recalcul des corrigés ; une formule imprimée n'est pas infaillible.
- **TD456 p. 1 :** TD4 ex. 1, Dijkstra depuis A puis problèmes de mise en
  œuvre distribuée. La table contient notamment C→D de coût 3 et D→C de
  coût 2 : ne pas symétriser automatiquement le graphe.
- **TD456 p. 2 :** ex. 2, graphe A–D, voies explicitement symétriques,
  convergence puis rupture VCD et échanges t1–t4. Intitulé « Ford-Fulkerson » ;
  le contenu décrit un routage par vecteurs de délais. Vérifier les étapes
  sans confondre avec un problème de flot maximal.
- **Corrigé routage séparé :** p. 1 commence par la taille optimale des
  paquets, puis ex. 2 Dijkstra, ex. 3 p. 3 et ex. 4 p. 4. Les numérotations
  diffèrent de TD456 : vérifier graphe et énoncé avant tout rapprochement.

## Carte du code existant

| Chemin | Rôle et lecture ciblée |
| --- | --- |
| `platform/app/[locale]/cs/reseaux/` | Hub, 14 leçons, TD1–7, examens et ressources ; ne pas tout réécrire |
| `platform/app/[locale]/cs/reseaux/td-1/` | Prototype : contenu fr et wrapper important les trois langues |
| `platform/app/[locale]/cs/reseaux/04-transmission-physique/` | Explications du codage existantes |
| `platform/app/[locale]/cs/reseaux/10-routage/` | Base actuelle du routage |
| `platform/components/cs/scenes/LineCodingWidget.tsx` | Simulateur existant, presets `annale` / `libre`, choix de convention |
| `platform/lib/cs/lineCoding.ts` | `nrz`, `manchester`, `manchesterDiff`, NRZ multiniveau |
| `platform/components/cs/scenes/RoutingWidget.tsx` et `platform/lib/cs/routing.ts` | Routage existant à inspecter lors de ce lot |
| `platform/components/cs/scenes/PacketSwitchWidget.tsx` et `platform/lib/cs/delays.ts` | Transmission et commutation |
| `platform/components/cs/scenes/EncapsulationWidget.tsx` | Couches et unités de données |
| `platform/lib/content/cs-reseaux.ts` | Registre des leçons, exercices, examens |
| `platform/lib/content/glossaire-reseaux.ts` | IDs de termes et définitions ; éviter les doublons |
| `platform/mdx-components.tsx` | Enregistrement des composants MDX |
| `platform/components/ui/LocaleSwitch.tsx` | Change actuellement le préfixe de langue en conservant le chemin |
| `platform/lib/nav.ts` | Liens vers le site historique ; l'anglais est à sa racine, fr/es dans leurs répertoires |
| `platform/lib/learn/lessonPage.tsx` | Enveloppe commune et fils d'Ariane |
| `platform/scripts/verify-reseaux.cjs` et `verify-reseaux-assertions.cjs` | Assertions existantes des moteurs ; ne couvrent pas à elles seules la pédagogie ni tous les signaux |
| `platform/scripts/verify-content.cjs` | Intégrité MDX, glossaire et parité en/es/fr |

## Cache privé, réutilisable et paginé

Depuis la racine du dépôt :

```bash
python3 docs/reseaux-refonte/extract-sources.py
```

Sorties dans `docs/reseaux-refonte/.cache/`, ignorées par Git :
`manifest.json` (empreintes, pages, extractibilité), `catalogue.md` et
un `.txt` par PDF avec marqueurs `=== PAGE PDF N ===`.
Le script réutilise les fichiers inchangés ; il n'effectue pas d'OCR.
`RESEAUX_SOURCES_DIR` permet de déplacer le corpus. Ne jamais copier ce cache
dans les assets publics : les copies d'examen peuvent contenir des identifiants.

Pour une image ciblée, utiliser `pdftoppm -f N -l N -scale-to 1600 -png`
sur le PDF voulu avec une sortie dans `.cache/`. Relire le schéma lui-même,
pas seulement son texte extrait. Ne pas convertir les 20 documents en images
si seules deux pages sont nécessaires.
