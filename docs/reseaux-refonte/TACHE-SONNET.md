# Fiche de délégation à Sonnet 5 — à remplir par Codex

Copier dans un fichier de tâche distinct. Remplir les rubriques avant l'appel ;
ne pas transmettre ce modèle vide. Codex conserve pédagogie, architecture,
implémentation et validation. Sonnet fournit une lecture ciblée, sans écrire.

## Objectif unique

Question factuelle à résoudre : …
Exemples : repérer les sous-questions d'un exercice, résumer deux pages,
inventorier les props d'un composant, relever une contradiction précise.

## Sources autorisées

- Chemins absolus et plages de lignes/pages précises : …
- Extraits déjà disponibles à utiliser en priorité : …
- Convention de référence : page PDF et diapositive distinctes, exercice et
  sous-question ; pour le code, fichier et ligne.

Ne lire que les sources nécessaires listées. Ne pas refaire l'extraction,
explorer tout le dépôt, chercher sur Internet ou lire tout le brief. Si une
figure manque, signaler la page à inspecter ; ne pas inventer ses données.

## Réponse attendue

- Maximum par défaut : 400 mots, sans recopier de longs extraits.
- Tableau ou liste : constat | référence exacte | incertitude éventuelle.
- Distinguer fait lu, déduction et information absente.
- Ne pas décider de la pédagogie ni proposer une refonte non demandée.
- Aucune modification, commande shell, délégation, traduction ou publication.

## Critères de fin

Question traitée avec références, ou manque clairement identifié. Ne pas
élargir le périmètre pour combler une absence. Codex contrôle les éléments
déterminants et poursuit seul si Sonnet est indisponible.

## Invocation

```bash
bash docs/reseaux-refonte/start-claude.sh /chemin/absolu/tache-remplie.md
```

Le lanceur exige un fichier non vide, sélectionne `claude-sonnet-5`, utilise
un effort faible, autorise uniquement Read/Grep/Glob et rend la réponse sur
stdout. Pas d'appel imbriqué à Codex. Les paramètres globaux restent inchangés.
