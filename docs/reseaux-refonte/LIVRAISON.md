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
Les noms de fichiers/pages sont affichés comme références ; les PDF et les
extractions contenant potentiellement des données d’étudiants ne sont pas publiés.

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
