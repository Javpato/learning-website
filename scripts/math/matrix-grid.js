// Rendu HTML de matrices pour le module Algèbre linéaire.
// Une matrice est une grille CSS avec crochets dessinés en pseudo-éléments
// (styles/algebre-lineaire.css, .la-matrix). Utilisée par les démos
// interactives et comme figure dans les corrections animées (l'animateur
// accepte n'importe quel nœud DOM).

function formatNumber(v) {
  if (typeof v === "string") return v;
  if (!Number.isFinite(v)) return "0";
  return String(Math.round(v * 100) / 100);
}

function clampNumber(v) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(-9, Math.min(9, v));
}

// values   : tableau 2D (lignes de cellules, nombres ou chaînes type "a₁₂")
// editable : cellules <input> numériques (clampées à ±9)
// cellClass: (i, j, value) => classe supplémentaire ("la-cell-sym", …)
// onChange : appelé avec la matrice numérique après chaque édition
export function matrixGrid({
  values,
  editable = false,
  cls = "",
  caption = "",
  cellClass = null,
  onChange = null,
} = {}) {
  const rows = values.length;
  const cols = values[0].length;

  const root = document.createElement("div");
  root.className = "la-matrix-wrap";

  const grid = document.createElement("div");
  grid.className = `la-matrix ${cls}`.trim();
  grid.style.setProperty("--cols", cols);
  root.appendChild(grid);

  const cells = [];
  for (let i = 0; i < rows; i++) {
    cells.push([]);
    for (let j = 0; j < cols; j++) {
      let cell;
      if (editable) {
        cell = document.createElement("input");
        cell.type = "number";
        cell.step = "any";
        cell.value = formatNumber(values[i][j]);
        cell.addEventListener("change", () => {
          const v = clampNumber(parseFloat(cell.value));
          cell.value = formatNumber(v);
          if (onChange) onChange(api.get());
        });
      } else {
        cell = document.createElement("span");
        cell.textContent = formatNumber(values[i][j]);
      }
      cell.className = "la-cell";
      if (cellClass) {
        const extra = cellClass(i, j, values[i][j]);
        if (extra) cell.className += ` ${extra}`;
      }
      grid.appendChild(cell);
      cells[i].push(cell);
    }
  }

  let captionEl = null;
  if (caption) {
    captionEl = document.createElement("div");
    captionEl.className = "la-matrix-caption";
    captionEl.textContent = caption;
    root.appendChild(captionEl);
  }

  const api = {
    root,
    cell(i, j) {
      return cells[i][j];
    },
    get() {
      return cells.map((row) =>
        row.map((c) => clampNumber(parseFloat(editable ? c.value : c.textContent)))
      );
    },
    set(next) {
      next.forEach((row, i) =>
        row.forEach((v, j) => {
          const c = cells[i][j];
          if (editable) c.value = formatNumber(v);
          else c.textContent = formatNumber(v);
          if (cellClass) {
            c.className = "la-cell";
            const extra = cellClass(i, j, v);
            if (extra) c.className += ` ${extra}`;
          }
        })
      );
    },
    flash(i, j, animCls = "la-flash") {
      const c = cells[i][j];
      c.classList.remove("la-flash", "la-flip");
      void c.offsetWidth; // relance l'animation
      c.classList.add(animCls);
    },
    setCaption(text) {
      if (!captionEl) {
        captionEl = document.createElement("div");
        captionEl.className = "la-matrix-caption";
        root.appendChild(captionEl);
      }
      captionEl.textContent = text;
    },
  };
  return api;
}

// Forme canonique de rang r en taille n×n :  ( I_r  0 / 0  0 ),
// bloc identité teinté.
export function canonicalForm(r, n = 2, caption = "") {
  const values = [];
  for (let i = 0; i < n; i++) {
    values.push([]);
    for (let j = 0; j < n; j++) values[i].push(i === j && i < r ? 1 : 0);
  }
  return matrixGrid({
    values,
    caption,
    cellClass: (i, j, v) => (i === j && i < r ? "la-cell-diag" : v === 0 ? "la-cell-dim" : ""),
  });
}
