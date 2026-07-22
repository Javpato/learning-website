// Primitives SVG pour le module Algèbre linéaire.
// Construction DOM pure, sans dépendance — même style que scripts/cs/memory.js.
//
// Le plan 2D (plane2d) renvoie un "handle" { svg, layer, toPx, arrowId } que
// toutes les fonctions de dessin acceptent. Les lignes d'une grille sont
// envoyées sur des lignes par toute application linéaire : il suffit donc de
// transformer les deux extrémités de chaque ligne par la matrice.
//
// Stylage via styles/algebre-lineaire.css (classes .la-*).

const SVG_NS = "http://www.w3.org/2000/svg";

export function el(name, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  }
  return node;
}

export function applyMat(M, [x, y]) {
  return [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
}

let uid = 0;

// ---------------------------------------------------------------------
// Plan 2D : axes, grille de fond, zone de contenu rognée
// ---------------------------------------------------------------------

export function plane2d({ width = 360, height = 360, range = 3 } = {}) {
  uid += 1;
  const clipId = `la-clip-${uid}`;
  const arrowId = `la-arrow-${uid}`;

  const svg = el("svg", {
    class: "la-svg",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
    width: "100%",
  });

  const pad = 6;
  const scale = (Math.min(width, height) - 2 * pad) / (2 * range);
  const toPx = (x, y) => [width / 2 + x * scale, height / 2 - y * scale];

  const defs = el("defs");
  defs.appendChild(
    el("clipPath", { id: clipId }, [
      el("rect", { x: pad, y: pad, width: width - 2 * pad, height: height - 2 * pad }),
    ])
  );
  defs.appendChild(
    el("marker", {
      id: arrowId,
      viewBox: "0 0 10 10",
      refX: "8", refY: "5",
      markerWidth: "6", markerHeight: "6",
      orient: "auto-start-reverse",
    }, [el("path", { d: "M0 0 L10 5 L0 10 z", class: "la-arrowhead" })])
  );
  svg.appendChild(defs);

  // Grille de fond (repère identité, très discrète) + axes
  const bg = el("g");
  for (let k = -range; k <= range; k++) {
    if (k === 0) continue;
    const [x1, y1] = toPx(k, -range);
    const [x2, y2] = toPx(k, range);
    bg.appendChild(el("line", { x1, y1, x2, y2, class: "la-grid-base" }));
    const [hx1, hy1] = toPx(-range, k);
    const [hx2, hy2] = toPx(range, k);
    bg.appendChild(el("line", { x1: hx1, y1: hy1, x2: hx2, y2: hy2, class: "la-grid-base" }));
  }
  {
    const [x1, y1] = toPx(-range, 0);
    const [x2, y2] = toPx(range, 0);
    bg.appendChild(el("line", { x1, y1, x2, y2, class: "la-axis" }));
    const [vx1, vy1] = toPx(0, -range);
    const [vx2, vy2] = toPx(0, range);
    bg.appendChild(el("line", { x1: vx1, y1: vy1, x2: vx2, y2: vy2, class: "la-axis" }));
  }
  svg.appendChild(bg);

  const layer = el("g", { "clip-path": `url(#${clipId})` });
  svg.appendChild(layer);

  return { svg, layer, toPx, arrowId, range, width, height };
}

// ---------------------------------------------------------------------
// Grilles transformées
// ---------------------------------------------------------------------

export function drawGrid(p, { matrix = [[1, 0], [0, 1]], range = p.range, step = 1, cls = "la-grid-image" } = {}) {
  const g = el("g");
  for (let k = -range; k <= range; k += step) {
    // ligne verticale x = k et ligne horizontale y = k, images par la matrice
    const segs = [
      [[k, -range], [k, range]],
      [[-range, k], [range, k]],
    ];
    for (const [a, b] of segs) {
      const [ax, ay] = p.toPx(...applyMat(matrix, a));
      const [bx, by] = p.toPx(...applyMat(matrix, b));
      g.appendChild(el("line", { x1: ax, y1: ay, x2: bx, y2: by, class: cls }));
    }
  }
  p.layer.appendChild(g);
  return g;
}

// Grille engendrée par une base (v1, v2), chaque direction multipliée par
// scales = [s1, s2]. scales = [1, 1] dessine la grille propre d'origine ;
// scales = [λ1, λ2] dessine son image "axe par axe".
export function drawGridInBasis(p, { basis, scales = [1, 1], range = p.range, cls = "la-grid-eigen" } = {}) {
  const [v1, v2] = basis;
  const [s1, s2] = scales;
  const pt = (u, t) => [
    u * s1 * v1[0] + t * s2 * v2[0],
    u * s1 * v1[1] + t * s2 * v2[1],
  ];
  const g = el("g");
  for (let k = -range; k <= range; k++) {
    const [ax, ay] = p.toPx(...pt(k, -range));
    const [bx, by] = p.toPx(...pt(k, range));
    g.appendChild(el("line", { x1: ax, y1: ay, x2: bx, y2: by, class: cls }));
    const [cx, cy] = p.toPx(...pt(-range, k));
    const [dx, dy] = p.toPx(...pt(range, k));
    g.appendChild(el("line", { x1: cx, y1: cy, x2: dx, y2: dy, class: cls }));
  }
  p.layer.appendChild(g);
  return g;
}

// ---------------------------------------------------------------------
// Vecteurs, polygones, droites, étiquettes
// ---------------------------------------------------------------------

export function drawVector(p, { x, y, cls = "la-vec", label = "", labelCls = "" } = {}) {
  const g = el("g");
  const [ox, oy] = p.toPx(0, 0);
  const [tx, ty] = p.toPx(x, y);
  g.appendChild(el("line", {
    x1: ox, y1: oy, x2: tx, y2: ty,
    class: cls,
    "marker-end": `url(#${p.arrowId})`,
  }));
  if (label) {
    const norm = Math.hypot(tx - ox, ty - oy) || 1;
    const lx = tx + ((tx - ox) / norm) * 12;
    const ly = ty + ((ty - oy) / norm) * 12;
    g.appendChild(el("text", {
      x: lx, y: ly + 4,
      "text-anchor": "middle",
      class: `la-svg-label ${labelCls}`.trim(),
    }, label));
  }
  p.layer.appendChild(g);
  return g;
}

export function drawPolygon(p, points, cls = "la-unit-square") {
  const pts = points.map(([x, y]) => p.toPx(x, y).join(",")).join(" ");
  const node = el("polygon", { points: pts, class: cls });
  p.layer.appendChild(node);
  return node;
}

// Droite complète passant par l'origine, dirigée par dir.
export function drawSegmentLine(p, { dir, cls = "la-image-line", label = "", labelCls = "" } = {}) {
  const [dx, dy] = dir;
  const norm = Math.hypot(dx, dy);
  if (norm < 1e-9) return null;
  const f = (p.range * 1.5) / norm;
  const [ax, ay] = p.toPx(-dx * f, -dy * f);
  const [bx, by] = p.toPx(dx * f, dy * f);
  const g = el("g");
  g.appendChild(el("line", { x1: ax, y1: ay, x2: bx, y2: by, class: cls }));
  if (label) {
    const [lx, ly] = p.toPx(dx * 0.7 * p.range / norm, dy * 0.7 * p.range / norm);
    g.appendChild(el("text", {
      x: lx + 8, y: ly - 8,
      class: `la-svg-label ${labelCls}`.trim(),
    }, label));
  }
  p.layer.appendChild(g);
  return g;
}

export function svgLabel(p, { x, y, text, cls = "" } = {}) {
  const [px, py] = p.toPx(x, y);
  const node = el("text", {
    x: px, y: py,
    "text-anchor": "middle",
    class: `la-svg-label ${cls}`.trim(),
  }, text);
  p.layer.appendChild(node);
  return node;
}

// ---------------------------------------------------------------------
// Escalier de sous-espaces  P_n ⊃ P_{n-1} ⊃ … ⊃ P_0 ⊃ {0}
// active : degré du sous-espace courant (n … 0), ou -1 pour {0}.
// ---------------------------------------------------------------------

export function subspaceStaircase({ n = 4, active = n, width = 520, height = 180 } = {}) {
  const svg = el("svg", {
    class: "la-svg la-staircase",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
    width: "100%",
  });

  const count = n + 2; // P_n … P_0 puis {0}
  const gap = 26;
  const boxW = (width - 32 - gap * (count - 1)) / count;
  const stepDrop = (height - 70) / (count - 1);

  for (let i = 0; i < count; i++) {
    const deg = n - i;            // deg ≥ 0 → P_deg ; deg = -1 → {0}
    const isZero = deg < 0;
    const x = 16 + i * (boxW + gap);
    const y = 16 + i * stepDrop;
    const h = 40;
    const isActive = deg === active || (isZero && active < 0);

    svg.appendChild(el("rect", {
      x, y, width: boxW, height: h, rx: 6,
      class: "la-stair-box" + (isActive ? " active" : "") + (isZero ? " zero" : ""),
    }));
    const label = isZero ? "{0}" : (deg === 0 ? "P₀" : `P${String(deg).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d])}`);
    svg.appendChild(el("text", {
      x: x + boxW / 2, y: y + h / 2 + 6,
      class: "la-stair-label" + (isActive ? " active" : ""),
    }, label));

    if (i < count - 1) {
      svg.appendChild(el("text", {
        x: x + boxW + gap / 2, y: y + h / 2 + stepDrop / 2 + 5,
        class: "la-stair-incl",
      }, "⊃"));
    }
  }

  return svg;
}

// ---------------------------------------------------------------------
// Rangée de monômes 1, X, …, Xⁿ avec flèches de décalage D(Xᵏ) = kXᵏ⁻¹.
// active : indice du monôme mis en avant (-1 = aucun).
// ---------------------------------------------------------------------

export function monomialShiftRow({ n = 3, active = -1, width = 520, height = 150 } = {}) {
  uid += 1;
  const arrowId = `la-arrow-${uid}`;
  const svg = el("svg", {
    class: "la-svg",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
    width: "100%",
  });
  const defs = el("defs");
  defs.appendChild(
    el("marker", {
      id: arrowId,
      viewBox: "0 0 10 10",
      refX: "8", refY: "5",
      markerWidth: "6", markerHeight: "6",
      orient: "auto-start-reverse",
    }, [el("path", { d: "M0 0 L10 5 L0 10 z", class: "la-arrowhead" })])
  );
  svg.appendChild(defs);

  const count = n + 2; // 0, 1, X, …, Xⁿ (la case "0" reçoit D(1))
  const gap = 18;
  const boxW = (width - 32 - gap * (count - 1)) / count;
  const boxY = height / 2 - 20;
  const labels = ["0"];
  for (let k = 0; k <= n; k++) labels.push(k === 0 ? "1" : k === 1 ? "X" : `X${String(k).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d])}`);

  const centers = [];
  labels.forEach((label, i) => {
    const x = 16 + i * (boxW + gap);
    const isActive = i - 1 === active;
    svg.appendChild(el("rect", {
      x, y: boxY, width: boxW, height: 40, rx: 6,
      class: "la-mono-box" + (isActive ? " active" : ""),
    }));
    svg.appendChild(el("text", {
      x: x + boxW / 2, y: boxY + 26,
      class: "la-mono-label",
    }, label));
    centers.push(x + boxW / 2);
  });

  // Flèches D : chaque monôme Xᵏ (k ≥ 1) vers Xᵏ⁻¹, et 1 vers 0.
  for (let i = 1; i < count; i++) {
    const fromX = centers[i] - boxW / 2 + 4;
    const toX = centers[i - 1] + boxW / 2 - 4;
    const midY = boxY - 18;
    svg.appendChild(el("path", {
      d: `M ${fromX} ${boxY} C ${fromX - 10} ${midY}, ${toX + 10} ${midY}, ${toX} ${boxY}`,
      class: "la-shift-arrow",
      "marker-end": `url(#${arrowId})`,
    }));
    const coef = i - 1; // D(Xᵏ) = k Xᵏ⁻¹
    if (coef > 1) {
      svg.appendChild(el("text", {
        x: (fromX + toX) / 2, y: midY - 2,
        "text-anchor": "middle",
        class: "la-svg-label warm",
      }, `×${coef}`));
    }
  }

  svg.appendChild(el("text", {
    x: width / 2, y: height - 10,
    "text-anchor": "middle",
    class: "la-svg-label",
  }, "D moves each monomial down one step"));

  return svg;
}
