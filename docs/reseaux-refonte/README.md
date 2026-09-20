# Réseaux — Codex pilote, Sonnet 5 assiste

Codex dirige la pédagogie, l'architecture, le code et la validation. Sonnet 5
peut effectuer des lectures et synthèses bornées. L'utilisateur a autorisé la
réalisation autonome de tout le périmètre : introduction, TD1 et routage.
Le parcours est implémenté dans `platform/`, à la route `/fr/cs/reseaux/atelier`.
Voir [LIVRAISON.md](LIVRAISON.md) pour les fichiers et vérifications.

## Lecture progressive pour Codex

1. [BRIEF.md](BRIEF.md) : mandat, pédagogie, périmètre et critères.
2. [DECISIONS.md](DECISIONS.md) : décisions acquises et prochaine étape.
3. [SOURCES.md](SOURCES.md) : accès ciblé aux documents et au code existant.
4. [PROTOTYPE-TD1.md](PROTOTYPE-TD1.md) : scénario initial désormais implémenté.
5. [TACHE-SONNET.md](TACHE-SONNET.md) : modèle pour une délégation utile.

Les règles générales restent dans [AGENTS.md](../../AGENTS.md),
[platform/CLAUDE.md](../../platform/CLAUDE.md) et
[COURSE_PLAYBOOK.md](../../COURSE_PLAYBOOK.md). Le brief expose les exceptions
validées pour cette refonte ; ne pas lancer l'ancien chantier complet.

## Déléguer une tâche précise

Préparer un fichier de tâche à partir du modèle, puis :

```bash
bash /home/javpato/Desktop/todoProgra/learning-website/docs/reseaux-refonte/start-claude.sh /chemin/tache-remplie.md
```

Le nom du script est conservé pour les liens existants, mais il n'ouvre plus
une session de pilotage. Il exécute **une tâche fournie**, avec
**`claude-sonnet-5`**, effort faible et sortie texte. Il fonctionne depuis
n'importe quel dossier ; le chemin relatif du fichier de tâche est résolu
depuis le dossier d'appel. Le contenu est transmis sur stdin.

Outils disponibles : Read, Grep et Glob seulement, en mode plan ; hooks,
commandes de skills et serveurs MCP désactivés pour cet appel. Pas de shell,
d'écriture, de recherche web ou de sous-agent. Aucune configuration globale
n'est modifiée. Les recherches externes nécessaires restent pilotées par Codex.

Un test minimal avec `claude-sonnet-5` a réussi le 19 septembre 2026.
Cela ne garantit pas un quota futur : si l'appel échoue, Codex poursuit
directement. Pas de changement automatique de modèle ou de reprises en boucle.
Le test Fable précédent est conservé uniquement dans l'historique des décisions.

## Économiser les ressources

Réutiliser les 20 extractions dans `.cache/` et leur index. Les scripts locaux
traitent les opérations mécaniques ; Sonnet intervient pour une synthèse utile,
avec quelques sources et une réponse courte. Vérifier ses faits déterminants
sans refaire son travail intégral. Ne pas lui envoyer systématiquement ce
dossier ou l'ensemble des PDF.

Références : [bonnes pratiques Claude Code](https://code.claude.com/docs/en/best-practices)
et [gestion du contexte](https://code.claude.com/docs/en/memory).
Les options du lanceur sont fondées sur l'aide CLI locale.
