#!/usr/bin/env bash
# Render a manim scene into learning-website/media/clips/.
#
# Usage:
#   ./manim-sources/render.sh manim-sources/physics/electrocinetique/quadrature.py QuadratureIntro
#   ./manim-sources/render.sh manim-sources/physics/electrocinetique/quadrature.py QuadratureIntro --hd
#
# Output: media/clips/<SceneName>.mp4 (custom_config.yml controls this path).
# A poster image is also generated alongside the mp4.

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIM_VENV="${SITE_ROOT}/../manim/.venv/bin/manimgl"

if [[ ! -x "${MANIM_VENV}" ]]; then
  echo "ERROR: manimgl not found at ${MANIM_VENV}" >&2
  echo "Run: cd ../manim && python3.11 -m venv .venv && .venv/bin/pip install -e ." >&2
  exit 1
fi

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <path/to/scene.py> <SceneClassName> [extra manimgl flags]" >&2
  exit 1
fi

SCENE_FILE="$1"
SCENE_NAME="$2"
shift 2

cd "${SITE_ROOT}"

echo "▶ Rendering ${SCENE_NAME} from ${SCENE_FILE}..."
"${MANIM_VENV}" "${SCENE_FILE}" "${SCENE_NAME}" -w "$@"

echo "▶ Generating poster for ${SCENE_NAME}..."
"${MANIM_VENV}" "${SCENE_FILE}" "${SCENE_NAME}" -so "$@" || true

echo "✓ Done. Look in media/clips/${SCENE_NAME}.{mp4,png}"
