// Démo interactive — le rang comme dimension de l'image.
// Mode « Explorer » : on saisit une matrice 2×2 et on voit la grille et le
// carré unité s'écraser ; à droite, rang, nullité et forme canonique visée.
// Mode « Comparer » : deux matrices de même rang (1) mais d'images
// différentes — même niveau de compression, pas la même transformation.

import { renderKatex } from "../shared/katex-loader.js";
import { matrixGrid, canonicalForm } from "./matrix-grid.js";
import {
  el,
  plane2d,
  drawGrid,
  drawPolygon,
  drawSegmentLine,
  applyMat,
} from "./svg-utils.js";

const EPS = 1e-9;

const PRESETS = [
  { label: "Rank 2", values: [[2, 1], [1, 1]] },
  { label: "Rank 1", values: [[1, 1], [2, 2]] },
  { label: "Rank 0", values: [[0, 0], [0, 0]] },
];

function rankOf(M) {
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  if (Math.abs(det) > EPS) return 2;
  if (M.flat().every((v) => Math.abs(v) < EPS)) return 0;
  return 1;
}

// Direction de l'image d'une matrice de rang 1 : première colonne non nulle.
function imageDirection(M) {
  const col1 = [M[0][0], M[1][0]];
  const col2 = [M[0][1], M[1][1]];
  return Math.hypot(...col1) > EPS ? col1 : col2;
}

function drawTransformedPlane(host, M, { lineCls = "la-image-line", lineLabel = "Im" } = {}) {
  const p = plane2d({ range: 3 });
  const r = rankOf(M);
  if (r > 0) drawGrid(p, { matrix: M });
  drawPolygon(p, [[0, 0], [1, 0], [1, 1], [0, 1]], "la-unit-square");
  if (r === 1) {
    drawSegmentLine(p, { dir: imageDirection(M), cls: lineCls, label: lineLabel, labelCls: "success" });
  }
  if (r > 0) {
    drawPolygon(p, [[0, 0], [1, 0], [1, 1], [0, 1]].map((pt) => applyMat(M, pt)), "la-image-poly");
  } else {
    const [cx, cy] = p.toPx(0, 0);
    p.layer.appendChild(el("circle", { cx, cy, r: 5, class: "la-image-poly" }));
  }
  host.appendChild(p.svg);
}

export function mountRankDemo(rootEl) {
  rootEl.classList.add("la-demo");
  let mode = "explore";
  let matrix = PRESETS[0].values.map((r) => [...r]);

  const modeRow = document.createElement("div");
  modeRow.className = "la-demo-controls";
  modeRow.style.justifyContent = "center";
  rootEl.appendChild(modeRow);

  const modeButtons = [
    { key: "explore", label: "Explore" },
    { key: "compare", label: "Compare two matrices of the same rank" },
  ].map(({ key, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      mode = key;
      render();
    });
    modeRow.appendChild(btn);
    return btn;
  });

  const body = document.createElement("div");
  rootEl.appendChild(body);

  function renderExplore() {
    const controls = document.createElement("div");
    controls.className = "la-demo-controls";
    controls.style.justifyContent = "center";
    body.appendChild(controls);

    PRESETS.forEach((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.textContent = preset.label;
      btn.addEventListener("click", () => {
        matrix = preset.values.map((r) => [...r]);
        render();
      });
      controls.appendChild(btn);
    });

    const gridWrap = document.createElement("div");
    gridWrap.style.textAlign = "center";
    body.appendChild(gridWrap);
    const grid = matrixGrid({
      values: matrix.map((r) => [...r]),
      editable: true,
      caption: "A — enter a 2×2 matrix",
      onChange: (vals) => {
        matrix = vals;
        render();
      },
    });
    gridWrap.appendChild(grid.root);

    const panels = document.createElement("div");
    panels.className = "la-demo-panels";
    body.appendChild(panels);

    const figPanel = document.createElement("div");
    figPanel.className = "la-panel";
    const figHost = document.createElement("div");
    figHost.style.width = "100%";
    figPanel.appendChild(figHost);
    const figCap = document.createElement("div");
    figCap.className = "la-panel-caption";
    figPanel.appendChild(figCap);
    panels.appendChild(figPanel);

    const r = rankOf(matrix);
    drawTransformedPlane(figHost, matrix);
    figCap.textContent =
      r === 2 ? "Rank 2: the image keeps a whole surface."
      : r === 1 ? "Rank 1: the surface is flattened onto a line."
      : "Rank 0: everything is crushed to the point 0.";

    const infoPanel = document.createElement("div");
    infoPanel.className = "la-panel";
    const card = document.createElement("div");
    card.className = "la-info-card";
    card.innerHTML = `
      <div class="la-info-line"><span>Rank (dimension of the image)</span><strong>${r}</strong></div>
      <div class="la-info-line"><span>Nullity (dimension of the kernel)</span><strong>${2 - r}</strong></div>
    `;
    const rkLine = document.createElement("div");
    rkLine.className = "la-formula";
    renderKatex(`\\operatorname{rank}(A) + \\dim \\ker(A) = ${r} + ${2 - r} = 2`, rkLine, false);
    card.appendChild(rkLine);
    infoPanel.appendChild(card);

    const canonWrap = document.createElement("div");
    canonWrap.style.textAlign = "center";
    canonWrap.appendChild(canonicalForm(r, 2, "Target canonical form").root);
    infoPanel.appendChild(canonWrap);
    panels.appendChild(infoPanel);
  }

  function renderCompare() {
    const panels = document.createElement("div");
    panels.className = "la-demo-panels";
    body.appendChild(panels);

    const cases = [
      {
        values: [[1, 0], [0, 0]],
        caption: "A — image = x-axis",
        lineCls: "la-image-line",
        tex: "A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}",
      },
      {
        values: [[0, 0], [0, 1]],
        caption: "B — image = y-axis",
        lineCls: "la-image-line-b",
        tex: "B = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}",
      },
    ];

    cases.forEach(({ values, caption, lineCls, tex }) => {
      const panel = document.createElement("div");
      panel.className = "la-panel";
      const texHost = document.createElement("div");
      texHost.className = "la-formula";
      renderKatex(tex, texHost, false);
      panel.appendChild(texHost);
      const figHost = document.createElement("div");
      figHost.style.width = "100%";
      panel.appendChild(figHost);
      drawTransformedPlane(figHost, values, { lineCls, lineLabel: "Im" });
      const cap = document.createElement("div");
      cap.className = "la-panel-caption";
      cap.textContent = caption;
      panel.appendChild(cap);
      panels.appendChild(panel);
    });

    const status = document.createElement("div");
    status.className = "la-demo-status";
    status.innerHTML =
      "<strong>Same rank (1), same nullity, same canonical form</strong> — but different images. The same \"compression level\", not the same transformation.";
    body.appendChild(status);
  }

  function render() {
    modeButtons.forEach((btn, i) =>
      btn.classList.toggle("active", ["explore", "compare"][i] === mode)
    );
    body.innerHTML = "";
    if (mode === "explore") renderExplore();
    else renderCompare();
  }

  render();
}
