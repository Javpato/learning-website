// Démo interactive — la transposition φ(M) = Mᵀ comme opérateur sur Mₙ(ℝ).
// La matrice M se réfléchit par rapport à sa diagonale ; en dessous, la
// décomposition M = S + K avec S = ½(M + Mᵀ) (bleu, fixée par φ) et
// K = ½(M − Mᵀ) (rouge, changée de signe par φ). Quand on clique sur
// « Transposer », la partie bleue ne bouge pas et la partie rouge bascule :
// c'est l'histoire des valeurs propres ±1 rendue visible.

import { renderKatex } from "../shared/katex-loader.js";
import { matrixGrid } from "./matrix-grid.js";

const DEFAULTS = {
  2: [[1, 2], [3, 4]],
  3: [[1, 2, 3], [0, 4, 5], [-1, 0, 2]],
};

function transposeOf(M) {
  return M.map((row, i) => row.map((_, j) => M[j][i]));
}

export function mountTransposeDemo(rootEl) {
  rootEl.classList.add("la-demo");
  let n = 2;
  let mGrid = null;
  let sGrid = null;
  let kGrid = null;

  const controls = document.createElement("div");
  controls.className = "la-demo-controls";
  controls.style.justifyContent = "center";
  rootEl.appendChild(controls);

  const sizeButtons = [2, 3].map((size) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.textContent = `n = ${size}`;
    btn.addEventListener("click", () => {
      n = size;
      build();
    });
    controls.appendChild(btn);
    return btn;
  });

  const transposeBtn = document.createElement("button");
  transposeBtn.type = "button";
  transposeBtn.className = "btn btn-accent";
  transposeBtn.textContent = "Transponer";
  controls.appendChild(transposeBtn);

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn btn-ghost";
  resetBtn.textContent = "Reiniciar";
  controls.appendChild(resetBtn);

  const mWrap = document.createElement("div");
  mWrap.style.textAlign = "center";
  rootEl.appendChild(mWrap);

  const panels = document.createElement("div");
  panels.className = "la-demo-panels";
  rootEl.appendChild(panels);

  const formulaEl = document.createElement("div");
  formulaEl.className = "la-formula";
  rootEl.appendChild(formulaEl);

  function updateSK({ flipK = false } = {}) {
    const M = mGrid.get();
    const Mt = transposeOf(M);
    const S = M.map((row, i) => row.map((v, j) => (v + Mt[i][j]) / 2));
    const K = M.map((row, i) => row.map((v, j) => (v - Mt[i][j]) / 2));
    sGrid.set(S);
    kGrid.set(K);
    if (flipK) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i !== j) kGrid.flash(i, j, "la-flip");
        }
      }
    }
  }

  function renderFormula() {
    const dimSym = (n * (n + 1)) / 2;
    const dimSkew = (n * (n - 1)) / 2;
    const det = dimSkew % 2 === 0 ? 1 : -1;
    renderKatex(
      [
        `\\dim \\mathrm{Sym}(${n}) = ${dimSym}, \\quad \\dim \\mathrm{Skew}(${n}) = ${dimSkew}`,
        `\\operatorname{tr}(\\varphi) = ${dimSym} - ${dimSkew} = ${n}, \\quad`,
        `\\det(\\varphi) = 1^{${dimSym}} \\cdot (-1)^{${dimSkew}} = ${det}`,
      ].join(" \\qquad "),
      formulaEl,
      true
    );
  }

  function build() {
    sizeButtons.forEach((btn, i) => btn.classList.toggle("active", [2, 3][i] === n));
    mWrap.innerHTML = "";
    panels.innerHTML = "";

    mGrid = matrixGrid({
      values: DEFAULTS[n].map((r) => [...r]),
      editable: true,
      caption: "M — modifica los coeficientes libremente",
      cellClass: (i, j) => (i === j ? "la-cell-diag" : ""),
      onChange: () => updateSK(),
    });
    mWrap.appendChild(mGrid.root);

    const sPanel = document.createElement("div");
    sPanel.className = "la-panel";
    sGrid = matrixGrid({
      values: DEFAULTS[n],
      caption: "S = ½(M + Mᵀ) — simétrica, φ(S) = S",
      cellClass: () => "la-cell-sym",
    });
    sPanel.appendChild(sGrid.root);
    panels.appendChild(sPanel);

    const kPanel = document.createElement("div");
    kPanel.className = "la-panel";
    kGrid = matrixGrid({
      values: DEFAULTS[n],
      caption: "K = ½(M − Mᵀ) — antisimétrica, φ(K) = −K",
      cellClass: () => "la-cell-skew",
    });
    kPanel.appendChild(kGrid.root);
    panels.appendChild(kPanel);

    updateSK();
    renderFormula();
  }

  transposeBtn.addEventListener("click", () => {
    const M = mGrid.get();
    mGrid.set(transposeOf(M));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) mGrid.flash(i, j);
      }
    }
    // S reste immobile, K change de signe — on ne recalcule que K visuellement
    updateSK({ flipK: true });
  });

  resetBtn.addEventListener("click", build);

  build();
}
