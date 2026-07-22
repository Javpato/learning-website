// Démo interactive — nilpotence de la dérivation sur ℝ₄[X].
// Le polynôme est affiché comme vecteur de coefficients (a₀, …, a₄) ;
// chaque clic sur « Appliquer D » applique la règle
//   (a₀, a₁, a₂, a₃, a₄) ↦ (a₁, 2a₂, 3a₃, 4a₄, 0)
// et l'escalier de sous-espaces P₄ ⊃ P₃ ⊃ … ⊃ {0} suit le degré courant.

import { renderKatex } from "../shared/katex-loader.js";
import { matrixGrid } from "./matrix-grid.js";
import { subspaceStaircase } from "./svg-utils.js";

const N = 4;
const DEFAULT_COEFFS = [2, 1, -3, 0, 1]; // p(x) = 2 + x − 3x² + x⁴

function degree(coeffs) {
  for (let k = coeffs.length - 1; k >= 0; k--) {
    if (Math.abs(coeffs[k]) > 1e-9) return k;
  }
  return -1;
}

function texNumber(v) {
  return String(Math.round(v * 100) / 100).replace("-", "-").replace(".", "{,}");
}

function polyTex(coeffs) {
  const terms = [];
  coeffs.forEach((a, k) => {
    if (Math.abs(a) < 1e-9) return;
    const av = Math.abs(a);
    const coefStr = av === 1 && k > 0 ? "" : texNumber(av);
    const xPart = k === 0 ? "" : k === 1 ? "x" : `x^{${k}}`;
    const sign = a < 0 ? (terms.length ? " - " : "-") : terms.length ? " + " : "";
    terms.push(sign + coefStr + xPart);
  });
  return terms.length ? terms.join("") : "0";
}

export function mountDerivativeDemo(rootEl) {
  let coeffs = [...DEFAULT_COEFFS];
  let applyCount = 0;

  rootEl.classList.add("la-demo");

  const formulaEl = document.createElement("div");
  formulaEl.className = "la-formula";
  rootEl.appendChild(formulaEl);

  const gridWrap = document.createElement("div");
  gridWrap.style.textAlign = "center";
  rootEl.appendChild(gridWrap);

  const grid = matrixGrid({
    values: [coeffs],
    editable: true,
    caption: "Coefficients (a₀, a₁, a₂, a₃, a₄)",
    onChange: (vals) => {
      coeffs = vals[0];
      applyCount = 0;
      render();
    },
  });
  gridWrap.appendChild(grid.root);

  const stairWrap = document.createElement("div");
  stairWrap.style.margin = "1rem 0";
  rootEl.appendChild(stairWrap);

  const controls = document.createElement("div");
  controls.className = "la-demo-controls";
  controls.style.justifyContent = "center";
  rootEl.appendChild(controls);

  const applyBtn = document.createElement("button");
  applyBtn.type = "button";
  applyBtn.className = "btn btn-accent";
  applyBtn.textContent = "Appliquer D";
  controls.appendChild(applyBtn);

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn btn-ghost";
  resetBtn.textContent = "Réinitialiser";
  controls.appendChild(resetBtn);

  const randomBtn = document.createElement("button");
  randomBtn.type = "button";
  randomBtn.className = "btn btn-ghost";
  randomBtn.textContent = "Aléatoire";
  controls.appendChild(randomBtn);

  const statusEl = document.createElement("div");
  statusEl.className = "la-demo-status";
  rootEl.appendChild(statusEl);

  const bannerEl = document.createElement("div");
  rootEl.appendChild(bannerEl);

  function render({ flash = false } = {}) {
    const deg = degree(coeffs);
    const label = applyCount === 0 ? "p(x)" : `D^{${applyCount}}p(x)`;
    renderKatex(`${label} = ${polyTex(coeffs)}`, formulaEl, true);

    grid.set([coeffs]);
    if (flash) coeffs.forEach((_, j) => grid.flash(0, j));

    stairWrap.innerHTML = "";
    stairWrap.appendChild(subspaceStaircase({ n: N, active: deg }));

    const dead = deg < 0;
    applyBtn.disabled = dead;
    statusEl.textContent = dead
      ? ""
      : `Degré courant : ${deg} — le polynôme vit dans P${"₀₁₂₃₄"[deg]}.`;

    bannerEl.innerHTML = "";
    if (dead && applyCount > 0) {
      const b = document.createElement("div");
      b.className = "la-banner";
      b.textContent = `D appliqué ${applyCount} fois a tout effacé — et D⁵ annule n'importe quel polynôme de degré ≤ 4 : D est nilpotent d'ordre 5.`;
      bannerEl.appendChild(b);
    }
  }

  applyBtn.addEventListener("click", () => {
    const next = [];
    for (let k = 1; k <= N; k++) next.push(k * coeffs[k]);
    next.push(0);
    coeffs = next;
    applyCount += 1;
    render({ flash: true });
  });

  resetBtn.addEventListener("click", () => {
    coeffs = [...DEFAULT_COEFFS];
    applyCount = 0;
    render();
  });

  randomBtn.addEventListener("click", () => {
    coeffs = Array.from({ length: N + 1 }, () => Math.floor(Math.random() * 9) - 4);
    if (degree(coeffs) < 0) coeffs[N] = 1;
    applyCount = 0;
    render();
  });

  render();
}
