// SVG circuit & phasor diagram builders for Exercice 4 animations.
// Pure DOM construction; no external deps.

const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}, children = []) {
  const e = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    e.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    if (typeof c === "string") e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  }
  return e;
}

// ----- Component builders (horizontal H or vertical V) -----

// Horizontal resistor (zigzag), length 56, at (x, y).
function resistorH(x, y, label = "R", { highlight = false } = {}) {
  const cls = "circ-resistor" + (highlight ? " highlight" : "");
  const path = `M${x} ${y} l6 0 l4 -8 l8 16 l8 -16 l8 16 l8 -16 l4 8 l4 0 l6 0`;
  return el("g", { class: cls }, [
    el("path", { d: path, fill: "none", "stroke-width": "2" }),
    el("text", { x: x + 28, y: y - 14, "text-anchor": "middle", class: "circ-label" }, label),
  ]);
}

// Vertical resistor at (x, y), length 56 going downward.
function resistorV(x, y, label = "R", { highlight = false } = {}) {
  const cls = "circ-resistor" + (highlight ? " highlight" : "");
  const path = `M${x} ${y} l0 6 l-8 4 l16 8 l-16 8 l16 8 l-16 8 l8 4 l0 6 l0 6`;
  return el("g", { class: cls }, [
    el("path", { d: path, fill: "none", "stroke-width": "2" }),
    el("text", { x: x + 18, y: y + 32, class: "circ-label" }, label),
  ]);
}

// Vertical inductor at (x, y), total height 56, 4 half-loops bulging right.
function inductorV(x, y, label = "L", { highlight = false } = {}) {
  const cls = "circ-inductor" + (highlight ? " highlight" : "");
  const arcs = [];
  for (let i = 0; i < 4; i++) {
    // Each arc starts at (x, y + i*14) and ends at (x, y + (i+1)*14), bulging right.
    arcs.push(`M ${x} ${y + i * 14} a 7 7 0 0 1 0 14`);
  }
  return el("g", { class: cls }, [
    el("path", { d: arcs.join(" "), fill: "none", "stroke-width": "2" }),
    el("text", { x: x + 16, y: y + 32, class: "circ-label" }, label),
  ]);
}

// Vertical capacitor at (x, y), length 30 going downward.
function capacitorV(x, y, label = "C", { highlight = false } = {}) {
  const cls = "circ-capacitor" + (highlight ? " highlight" : "");
  return el("g", { class: cls }, [
    el("line", { x1: x, y1: y, x2: x, y2: y + 12, "stroke-width": "2" }),
    el("line", { x1: x - 12, y1: y + 12, x2: x + 12, y2: y + 12, "stroke-width": "2" }),
    el("line", { x1: x - 12, y1: y + 18, x2: x + 12, y2: y + 18, "stroke-width": "2" }),
    el("line", { x1: x, y1: y + 18, x2: x, y2: y + 30, "stroke-width": "2" }),
    el("text", { x: x + 18, y: y + 18, class: "circ-label" }, label),
  ]);
}

// AC source (circle with sine wave) at (cx, cy), radius 18.
function acSource(cx, cy, label = "u") {
  return el("g", { class: "circ-source" }, [
    el("circle", { cx, cy, r: 18, fill: "none", "stroke-width": "2" }),
    el("path", { d: `M${cx - 9} ${cy} q4 -7 9 0 t9 0`, fill: "none", "stroke-width": "1.6" }),
    el("text", { x: cx - 26, y: cy + 5, "text-anchor": "end", class: "circ-label-strong" }, label),
  ]);
}

function wire(x1, y1, x2, y2, { highlight = false } = {}) {
  return el("line", {
    x1, y1, x2, y2,
    class: "circ-wire" + (highlight ? " highlight" : ""),
    "stroke-width": "2",
  });
}

// Vertical current arrow (pointing down) at (x, y) with label to the right.
function currentArrowDown(x, y, label, { highlight = false } = {}) {
  const cls = "circ-current" + (highlight ? " highlight" : "");
  return el("g", { class: cls }, [
    el("line", { x1: x, y1: y, x2: x, y2: y + 22, "stroke-width": "1.8" }),
    el("polygon", {
      points: `${x},${y + 24} ${x - 4},${y + 17} ${x + 4},${y + 17}`,
    }),
    el("text", { x: x + 10, y: y + 16, class: "circ-label-strong" }, label),
  ]);
}

// Horizontal current arrow (right) at (x, y).
function currentArrowRight(x, y, label, { highlight = false } = {}) {
  const cls = "circ-current" + (highlight ? " highlight" : "");
  return el("g", { class: cls }, [
    el("line", { x1: x, y1: y, x2: x + 22, y2: y, "stroke-width": "1.8" }),
    el("polygon", { points: `${x + 24},${y} ${x + 17},${y - 4} ${x + 17},${y + 4}` }),
    el("text", { x: x + 12, y: y - 8, "text-anchor": "middle", class: "circ-label-strong" }, label),
  ]);
}

// ============================================================================
// 4a — two parallel branches
// scenario: "original" | "noR" | "twoCaps"
// ============================================================================
export function ex4aCircuit({ scenario = "original", emphasis = null, showCurrents = true } = {}) {
  const svg = el("svg", {
    class: "circ-svg",
    viewBox: "0 0 520 360",
    role: "img",
    "aria-label": "Circuit deux branches RL en parallèle, l'une avec un condensateur série",
  });

  const includeC1 = scenario === "twoCaps";
  const includeC2 = scenario === "original" || scenario === "noR" || scenario === "twoCaps";
  const includeR  = scenario !== "noR";

  // Layout constants
  const TOP_Y = 60;
  const BOT_Y = 320;
  const SRC_X = 60;
  const SRC_Y = (TOP_Y + BOT_Y) / 2; // 190
  const B1_X = 240;
  const B2_X = 400;

  // Source + outer rails
  svg.appendChild(acSource(SRC_X, SRC_Y, "u"));
  svg.appendChild(wire(SRC_X + 18, SRC_Y, 100, SRC_Y));   // bridge from source
  svg.appendChild(wire(100, SRC_Y, 100, TOP_Y));           // up
  svg.appendChild(wire(100, TOP_Y, 480, TOP_Y));           // top rail
  svg.appendChild(wire(100, SRC_Y, 100, BOT_Y));           // down
  svg.appendChild(wire(100, BOT_Y, 480, BOT_Y));           // bottom rail

  // ---- Branch 1 ----
  const b1 = el("g", { class: "circ-branch branch1" + (emphasis === "branch1" ? " emphasis" : "") });
  let cursor = TOP_Y;
  // Optional capacitor C1
  if (includeC1) {
    b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 14)); cursor += 14;
    b1.appendChild(capacitorV(B1_X, cursor, "C₁")); cursor += 30;
    b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 14)); cursor += 14;
  } else {
    b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 30)); cursor += 30;
  }
  // Resistor R
  if (includeR) {
    b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 12)); cursor += 12;
    b1.appendChild(resistorV(B1_X, cursor, "R")); cursor += 64;
    b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 12)); cursor += 12;
  } else {
    b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 30)); cursor += 30;
  }
  // Inductor L
  b1.appendChild(wire(B1_X, cursor, B1_X, cursor + 8)); cursor += 8;
  b1.appendChild(inductorV(B1_X, cursor, "L")); cursor += 57;
  b1.appendChild(wire(B1_X, cursor, B1_X, BOT_Y));
  // Current label
  if (showCurrents) {
    b1.appendChild(currentArrowDown(B1_X, TOP_Y + 4, "i₁", { highlight: emphasis === "branch1" }));
  }
  svg.appendChild(b1);

  // ---- Branch 2 ----
  const b2 = el("g", { class: "circ-branch branch2" + (emphasis === "branch2" ? " emphasis" : "") });
  cursor = TOP_Y;
  if (includeC2) {
    b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 14)); cursor += 14;
    b2.appendChild(capacitorV(B2_X, cursor, scenario === "twoCaps" ? "C₂" : "C")); cursor += 30;
    b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 14)); cursor += 14;
  } else {
    b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 30)); cursor += 30;
  }
  if (includeR) {
    b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 12)); cursor += 12;
    b2.appendChild(resistorV(B2_X, cursor, "R")); cursor += 64;
    b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 12)); cursor += 12;
  } else {
    b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 30)); cursor += 30;
  }
  b2.appendChild(wire(B2_X, cursor, B2_X, cursor + 8)); cursor += 8;
  b2.appendChild(inductorV(B2_X, cursor, "L")); cursor += 57;
  b2.appendChild(wire(B2_X, cursor, B2_X, BOT_Y));
  if (showCurrents) {
    b2.appendChild(currentArrowDown(B2_X, TOP_Y + 4, "i₂", { highlight: emphasis === "branch2" }));
  }
  svg.appendChild(b2);

  return svg;
}

// ============================================================================
// 4b — Source + line (R + L) + receiver Z2
// ============================================================================
export function ex4bCircuit({ emphasis = null } = {}) {
  const svg = el("svg", {
    class: "circ-svg",
    viewBox: "0 0 540 240",
    role: "img",
    "aria-label": "Source en série avec ligne R+L puis charge Z₂",
  });

  const TOP = 50, BOT = 200, SRC_X = 50, SRC_Y = 125;

  svg.appendChild(acSource(SRC_X, SRC_Y, "u"));
  svg.appendChild(wire(SRC_X + 18, SRC_Y, 90, SRC_Y));
  svg.appendChild(wire(90, SRC_Y, 90, TOP));
  // Top rail with R then L
  svg.appendChild(wire(90, TOP, 150, TOP));
  svg.appendChild(resistorH(150, TOP, "R", { highlight: emphasis === "line" }));
  svg.appendChild(wire(206, TOP, 244, TOP));
  // Horizontal inductor: 4 half-loops bulging up, total span 56 (x = 244 → 300).
  const indArcs = [];
  for (let i = 0; i < 4; i++) {
    indArcs.push(`M ${244 + i * 14} ${TOP} a 7 7 0 0 1 14 0`);
  }
  svg.appendChild(el("g", { class: "circ-inductor" + (emphasis === "line" ? " highlight" : "") }, [
    el("path", { d: indArcs.join(" "), fill: "none", "stroke-width": "2" }),
    el("text", { x: 272, y: TOP - 12, "text-anchor": "middle", class: "circ-label" }, "L"),
  ]));
  svg.appendChild(wire(300, TOP, 460, TOP));
  // Receiver Z2 on the right vertical
  svg.appendChild(wire(460, TOP, 460, 90));
  const z2cls = "circ-z2" + (emphasis === "Z2" ? " emphasis" : "");
  svg.appendChild(el("g", { class: z2cls }, [
    el("rect", { x: 442, y: 90, width: 36, height: 70, fill: "none", "stroke-width": "2" }),
    el("text", { x: 460, y: 130, "text-anchor": "middle", class: "circ-label-strong" }, "Z₂"),
  ]));
  svg.appendChild(wire(460, 160, 460, BOT));
  // Bottom rail
  svg.appendChild(wire(460, BOT, 90, BOT));
  svg.appendChild(wire(90, BOT, 90, SRC_Y));
  // Current arrow
  svg.appendChild(currentArrowRight(110, TOP, "i"));

  return svg;
}

// ============================================================================
// Phasor diagram — vectors in the complex plane.
// vectors: [{ label, mag, deg, color? }]
// ============================================================================
export function phasorDiagram({ vectors = [], size = 320, scale = 1, title = "" } = {}) {
  const cx = size / 2, cy = size / 2;
  const svg = el("svg", {
    class: "phasor-svg",
    viewBox: `0 0 ${size} ${size}`,
    role: "img",
    "aria-label": title || "Diagramme de Fresnel",
  });

  svg.appendChild(el("line", { x1: 10, y1: cy, x2: size - 10, y2: cy, class: "phasor-axis" }));
  svg.appendChild(el("line", { x1: cx, y1: 10, x2: cx, y2: size - 10, class: "phasor-axis" }));
  svg.appendChild(el("text", { x: size - 8, y: cy - 6, "text-anchor": "end", class: "phasor-axis-label" }, "Ré"));
  svg.appendChild(el("text", { x: cx + 8, y: 16, class: "phasor-axis-label" }, "Im"));

  vectors.forEach((v, i) => {
    const rad = (v.deg * Math.PI) / 180;
    const len = v.mag * scale;
    const x2 = cx + Math.cos(rad) * len;
    const y2 = cy - Math.sin(rad) * len;
    const col = v.color || `var(--phasor-${(i % 4) + 1})`;
    const g = el("g", { class: "phasor-vec" });
    g.appendChild(el("line", { x1: cx, y1: cy, x2, y2, stroke: col, "stroke-width": "2.5" }));
    const ang = Math.atan2(y2 - cy, x2 - cx);
    const ax1 = x2 - Math.cos(ang - 0.4) * 9;
    const ay1 = y2 - Math.sin(ang - 0.4) * 9;
    const ax2 = x2 - Math.cos(ang + 0.4) * 9;
    const ay2 = y2 - Math.sin(ang + 0.4) * 9;
    g.appendChild(el("polygon", { points: `${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`, fill: col }));
    const lx = cx + Math.cos(rad) * (len + 16);
    const ly = cy - Math.sin(rad) * (len + 16);
    g.appendChild(el("text", { x: lx, y: ly, "text-anchor": "middle", fill: col, class: "phasor-label" }, v.label));
    svg.appendChild(g);
  });

  if (title) {
    svg.appendChild(el("text", { x: size / 2, y: size - 8, "text-anchor": "middle", class: "phasor-title" }, title));
  }
  return svg;
}
