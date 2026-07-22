// Démo interactive — diagonalisabilité.
// Deux vues simultanées du même opérateur :
//   à gauche, la grille du repère canonique déformée par la matrice ;
//   à droite, la grille construite sur la base propre, où l'action devient
//   « axe par axe » : (x₁, x₂) ↦ (λ₁x₁, λ₂x₂).
// Aucune résolution spectrale en JS : chaque préréglage embarque ses données
// propres en dur (matrice, vecteurs propres, valeurs propres).

import { renderKatex } from "../shared/katex-loader.js";
import {
  plane2d,
  drawGrid,
  drawGridInBasis,
  drawVector,
  drawPolygon,
  drawSegmentLine,
  applyMat,
} from "./svg-utils.js";

const PRESETS = [
  {
    key: "sym",
    label: "Symétrique",
    matrix: [[2, 1], [1, 2]],
    tex: "A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}",
    eigvecs: [[1, 1], [1, -1]],
    eigvals: [3, 1],
    diagonalizable: true,
  },
  {
    key: "diag",
    label: "Diagonale",
    matrix: [[2, 0], [0, 0.5]],
    tex: "A = \\begin{pmatrix} 2 & 0 \\\\ 0 & 0{,}5 \\end{pmatrix}",
    eigvecs: [[1, 0], [0, 1]],
    eigvals: [2, 0.5],
    diagonalizable: true,
  },
  {
    key: "shear",
    label: "Cisaillement",
    matrix: [[1, 1], [0, 1]],
    tex: "A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}",
    eigvecs: [[1, 0]],
    eigvals: [1],
    diagonalizable: false,
  },
];

export function mountEigenDemo(rootEl) {
  rootEl.classList.add("la-demo");
  let current = PRESETS[0];

  const controls = document.createElement("div");
  controls.className = "la-demo-controls";
  controls.style.justifyContent = "center";
  rootEl.appendChild(controls);

  const buttons = PRESETS.map((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.textContent = preset.label;
    btn.addEventListener("click", () => {
      current = preset;
      render();
    });
    controls.appendChild(btn);
    return btn;
  });

  const matrixFormula = document.createElement("div");
  matrixFormula.className = "la-formula";
  rootEl.appendChild(matrixFormula);

  const panels = document.createElement("div");
  panels.className = "la-demo-panels";
  rootEl.appendChild(panels);

  function makePanel(title) {
    const panel = document.createElement("div");
    panel.className = "la-panel";
    const cap = document.createElement("div");
    cap.className = "la-panel-caption";
    cap.innerHTML = `<strong>${title}</strong>`;
    const figHost = document.createElement("div");
    figHost.style.width = "100%";
    const sub = document.createElement("div");
    sub.className = "la-panel-caption";
    panel.appendChild(cap);
    panel.appendChild(figHost);
    panel.appendChild(sub);
    panels.appendChild(panel);
    return { figHost, sub };
  }

  const left = makePanel("Base canonique");
  const right = makePanel("Base propre");

  function renderLeft() {
    left.figHost.innerHTML = "";
    const p = plane2d({ range: 3 });

    drawGrid(p, { matrix: current.matrix });
    drawPolygon(p, [[0, 0], [1, 0], [1, 1], [0, 1]], "la-unit-square");
    drawPolygon(
      p,
      [[0, 0], [1, 0], [1, 1], [0, 1]].map((pt) => applyMat(current.matrix, pt)),
      "la-image-poly"
    );

    current.eigvecs.forEach((v, i) => {
      drawVector(p, { x: v[0], y: v[1], cls: "la-vec", label: `v${i + 1}`, labelCls: "warm" });
      const img = applyMat(current.matrix, v);
      drawVector(p, { x: img[0], y: img[1], cls: "la-vec-image", label: `Av${i + 1}`, labelCls: "success" });
    });
    if (!current.diagonalizable) {
      // montre qu'une direction non propre est mélangée : e₂ bascule
      drawVector(p, { x: 0, y: 1, cls: "la-vec-basis", label: "e₂", labelCls: "accent" });
      const img = applyMat(current.matrix, [0, 1]);
      drawVector(p, { x: img[0], y: img[1], cls: "la-vec-image", label: "Ae₂", labelCls: "success" });
    }

    left.figHost.appendChild(p.svg);
    left.sub.textContent = current.diagonalizable
      ? "La grille se déforme, mais les directions propres restent sur elles-mêmes."
      : "La direction e₁ est conservée ; toutes les autres sont mélangées.";
  }

  function renderRight() {
    right.figHost.innerHTML = "";
    const p = plane2d({ range: 3 });

    if (current.diagonalizable) {
      drawGridInBasis(p, { basis: current.eigvecs, scales: [1, 1], cls: "la-grid-eigen" });
      drawGridInBasis(p, { basis: current.eigvecs, scales: current.eigvals, cls: "la-grid-eigen-image" });
      current.eigvecs.forEach((v, i) => {
        drawVector(p, { x: v[0], y: v[1], cls: "la-vec", label: `v${i + 1}`, labelCls: "warm" });
      });
      right.figHost.appendChild(p.svg);
      right.sub.innerHTML = "";
      const k = document.createElement("span");
      right.sub.appendChild(k);
      const [l1, l2] = current.eigvals;
      renderKatex(
        `P^{-1}AP = \\begin{pmatrix} ${String(l1).replace(".", "{,}")} & 0 \\\\ 0 & ${String(l2).replace(".", "{,}")} \\end{pmatrix}`,
        k,
        false
      );
    } else {
      drawSegmentLine(p, { dir: [1, 0], cls: "la-image-line", label: "seule direction propre", labelCls: "success" });
      drawSegmentLine(p, { dir: [0, 1], cls: "la-vec-danger", label: "?", labelCls: "danger" });
      drawVector(p, { x: 1, y: 0, cls: "la-vec", label: "v1", labelCls: "warm" });
      right.figHost.appendChild(p.svg);
      right.sub.innerHTML = "";
      const warn = document.createElement("div");
      warn.className = "la-warn-msg";
      warn.textContent = "Une seule direction propre : pas de base propre — non diagonalisable.";
      right.sub.appendChild(warn);
    }
  }

  function render() {
    buttons.forEach((btn, i) => btn.classList.toggle("active", PRESETS[i] === current));
    renderKatex(current.tex, matrixFormula, true);
    renderLeft();
    renderRight();
  }

  render();
}
