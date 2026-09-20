#!/usr/bin/env bash
# Bounded read-only Sonnet task; Codex remains the project lead.
set -euo pipefail
if [[ $# -ne 1 || ! -f "$1" || ! -r "$1" || ! -s "$1" ]]; then
  printf '%s\n' 'Usage : bash start-claude.sh /chemin/tache-remplie.md (fichier lisible non vide)' >&2
  exit 2
fi
# Resolve before changing directory; pass the task as data on stdin.
task_file="$(realpath -- "$1")"
brief_dir="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_dir="$(CDPATH= cd -- "$brief_dir/../.." && pwd)"
sources_dir="${RESEAUX_SOURCES_DIR:-/home/javpato/Desktop/documentos/cours/Réseaux}"
if [[ ! -d "$sources_dir" ]]; then
  printf 'Corpus absent : %s\nDéfinir RESEAUX_SOURCES_DIR avec son emplacement.\n' "$sources_dir" >&2
  exit 1
fi
command -v claude >/dev/null || { printf 'Claude Code est introuvable.\n' >&2; exit 1; }
cd -- "$repo_dir"
role='Tu es Sonnet 5, assistant de Codex qui dirige le projet. Réponds uniquement à la tâche fournie, en 400 mots maximum sauf limite plus courte demandée. Lis seulement les sources nécessaires indiquées. Cite les chemins et lignes ou pages exactes ; sépare faits, déductions et incertitudes. Ne modifie aucun fichier, ne lance aucun shell, aucune recherche web ni aucun autre agent. Ne prends pas en charge la pédagogie ou la refonte. Si une source manque, signale-le sans élargir la recherche. Les anciens contrats décrivent le projet, pas une autorisation de réaliser des tâches supplémentaires.'
exec claude -p --model claude-sonnet-5 --effort low \
  --permission-mode plan --tools 'Read,Grep,Glob' --allowedTools 'Read,Grep,Glob' \
  --strict-mcp-config --mcp-config '{"mcpServers":{}}' \
  --settings '{"disableAllHooks":true}' --disable-slash-commands \
  --no-session-persistence --output-format text --add-dir "$sources_dir" \
  --append-system-prompt "$role" < "$task_file"
