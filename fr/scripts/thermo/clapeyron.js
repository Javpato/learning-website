// Clapeyron (P-V) diagram builder.
// Pure SVG, vanilla DOM, no external libraries. Mirrors the style of
// scripts/electro/circuits.js: tiny composable helpers that mutate an SVG
// root. Build a base axes element with `clapeyronAxes(...)`, then plot
// points, curves, shaded areas and labels onto it.
//
// Coordinate convention:
//   - data space:  V (volume) increases to the right, P (pressure) increases up
//   - svg space:   x increases right, y increases DOWN
// Helpers internally map (V, P) -> (x, y). Callers pass data-space values.

const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    node.setAttribute(k, v);
  }
  return node;
}

// ----------------------------------------------------------------------
// Base diagram
// ----------------------------------------------------------------------

export function clapeyronAxes({
  vMin = 0,
  vMax = 4,
  pMin = 0,
  pMax = 4,
  width = 520,
  height = 380,
  padLeft = 48,
  padRight = 28,
  padTop = 24,
  padBottom = 44,
  vTicks = null,
  pTicks = null,
  vLabel = "V",
  pLabel = "P",
  showGrid = true,
} = {}) {
  const svg = el("svg", {
    class: "clap-svg",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
  });

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const ctx = {
    width, height, padLeft, padRight, padTop, padBottom,
    plotW, plotH,
    vMin, vMax, pMin, pMax,
    toX: (v) => padLeft + ((v - vMin) / (vMax - vMin)) * plotW,
    toY: (p) => height - padBottom - ((p - pMin) / (pMax - pMin)) * plotH,
  };
  svg._clap = ctx;

  // Grid
  if (showGrid) {
    const gridG = el("g", { class: "clap-grid" });
    const vTickPositions = vTicks || autoTicks(vMin, vMax);
    const pTickPositions = pTicks || autoTicks(pMin, pMax);
    for (const v of vTickPositions) {
      gridG.appendChild(el("line", {
        x1: ctx.toX(v), x2: ctx.toX(v),
        y1: ctx.toY(pMin), y2: ctx.toY(pMax),
      }));
    }
    for (const p of pTickPositions) {
      gridG.appendChild(el("line", {
        x1: ctx.toX(vMin), x2: ctx.toX(vMax),
        y1: ctx.toY(p), y2: ctx.toY(p),
      }));
    }
    svg.appendChild(gridG);
  }

  // Axes
  const axesG = el("g", { class: "clap-axes" });
  // x-axis (V)
  axesG.appendChild(el("line", {
    x1: ctx.toX(vMin), y1: ctx.toY(pMin),
    x2: ctx.toX(vMax), y2: ctx.toY(pMin),
    class: "clap-axis",
  }));
  // y-axis (P)
  axesG.appendChild(el("line", {
    x1: ctx.toX(vMin), y1: ctx.toY(pMin),
    x2: ctx.toX(vMin), y2: ctx.toY(pMax),
    class: "clap-axis",
  }));
  // arrow tips
  axesG.appendChild(el("polygon", {
    points: `${ctx.toX(vMax)+10},${ctx.toY(pMin)} ${ctx.toX(vMax)-2},${ctx.toY(pMin)-5} ${ctx.toX(vMax)-2},${ctx.toY(pMin)+5}`,
    class: "clap-axis-tip",
  }));
  axesG.appendChild(el("polygon", {
    points: `${ctx.toX(vMin)},${ctx.toY(pMax)-10} ${ctx.toX(vMin)-5},${ctx.toY(pMax)+2} ${ctx.toX(vMin)+5},${ctx.toY(pMax)+2}`,
    class: "clap-axis-tip",
  }));
  // labels
  const xLabel = el("text", {
    x: ctx.toX(vMax) + 14,
    y: ctx.toY(pMin) + 5,
    class: "clap-axis-label",
  });
  xLabel.textContent = vLabel;
  axesG.appendChild(xLabel);
  const yLabel = el("text", {
    x: ctx.toX(vMin) - 4,
    y: ctx.toY(pMax) - 14,
    class: "clap-axis-label",
    "text-anchor": "end",
  });
  yLabel.textContent = pLabel;
  axesG.appendChild(yLabel);
  svg.appendChild(axesG);

  return svg;
}

function autoTicks(min, max) {
  const n = 4;
  const step = (max - min) / n;
  const arr = [];
  for (let i = 1; i <= n; i++) arr.push(min + i * step);
  return arr;
}

// ----------------------------------------------------------------------
// Points
// ----------------------------------------------------------------------

export function plotPoint(svg, {
  v, p, label, color = null,
  projections = [],          // any of "v", "p"
  labelDx = 8, labelDy = -10,
  labelAnchor = "start",
  vTickLabel = null,         // text under the axis (e.g. "V_A")
  pTickLabel = null,         // text on the y-axis (e.g. "P_A")
  vTickAnchor = "middle",
  pTickAnchor = "end",
}) {
  const ctx = svg._clap;
  const x = ctx.toX(v);
  const y = ctx.toY(p);
  const g = el("g", { class: "clap-point" });

  if (projections.includes("v")) {
    g.appendChild(el("line", {
      x1: x, y1: y,
      x2: x, y2: ctx.toY(ctx.pMin),
      class: "clap-projection",
    }));
  }
  if (projections.includes("p")) {
    g.appendChild(el("line", {
      x1: x, y1: y,
      x2: ctx.toX(ctx.vMin), y2: y,
      class: "clap-projection",
    }));
  }

  const dot = el("circle", {
    cx: x, cy: y, r: 4.5,
    class: "clap-dot",
  });
  if (color) dot.setAttribute("style", `fill:${color};stroke:${color};`);
  g.appendChild(dot);

  if (label) {
    const text = el("text", {
      x: x + labelDx, y: y + labelDy,
      class: "clap-point-label",
      "text-anchor": labelAnchor,
    });
    text.textContent = label;
    if (color) text.setAttribute("style", `fill:${color};`);
    g.appendChild(text);
  }

  if (vTickLabel) {
    const t = el("text", {
      x: x, y: ctx.toY(ctx.pMin) + 18,
      class: "clap-tick-label",
      "text-anchor": vTickAnchor,
    });
    t.textContent = vTickLabel;
    g.appendChild(t);
  }
  if (pTickLabel) {
    const t = el("text", {
      x: ctx.toX(ctx.vMin) - 8, y: y + 4,
      class: "clap-tick-label",
      "text-anchor": pTickAnchor,
    });
    t.textContent = pTickLabel;
    g.appendChild(t);
  }

  svg.appendChild(g);
  return g;
}

// ----------------------------------------------------------------------
// Curve sampling (return arrays of (V, P) samples)
// ----------------------------------------------------------------------

function sampleIsotherm(K, vFrom, vTo, n = 60) {
  const arr = [];
  for (let i = 0; i <= n; i++) {
    const v = vFrom + (vTo - vFrom) * (i / n);
    arr.push([v, K / v]);
  }
  return arr;
}

function sampleAdiabatic(K, gamma, vFrom, vTo, n = 60) {
  const arr = [];
  for (let i = 0; i <= n; i++) {
    const v = vFrom + (vTo - vFrom) * (i / n);
    arr.push([v, K / Math.pow(v, gamma)]);
  }
  return arr;
}

function samplesToPath(svg, samples) {
  const ctx = svg._clap;
  return samples.map(([v, p], i) => {
    const cmd = i === 0 ? "M" : "L";
    return `${cmd}${ctx.toX(v).toFixed(2)},${ctx.toY(p).toFixed(2)}`;
  }).join(" ");
}

// ----------------------------------------------------------------------
// Curves
// ----------------------------------------------------------------------

export function plotIsotherm(svg, {
  v0, p0,           // a point on the isotherm (defines K = p0*v0)
  vFrom, vTo,
  color = null,
  dashed = false,
  klass = "clap-curve clap-isotherm",
  width = 2,
}) {
  const K = p0 * v0;
  const samples = sampleIsotherm(K, vFrom, vTo);
  const path = el("path", {
    d: samplesToPath(svg, samples),
    class: klass,
    fill: "none",
    "stroke-width": width,
    "stroke-dasharray": dashed ? "5 5" : null,
  });
  if (color) path.setAttribute("style", `stroke:${color};`);
  svg.appendChild(path);
  return path;
}

export function plotAdiabatic(svg, {
  v0, p0, gamma,
  vFrom, vTo,
  color = null,
  dashed = false,
  klass = "clap-curve clap-adiabatic",
  width = 2,
}) {
  const K = p0 * Math.pow(v0, gamma);
  const samples = sampleAdiabatic(K, gamma, vFrom, vTo);
  const path = el("path", {
    d: samplesToPath(svg, samples),
    class: klass,
    fill: "none",
    "stroke-width": width,
    "stroke-dasharray": dashed ? "5 5" : null,
  });
  if (color) path.setAttribute("style", `stroke:${color};`);
  svg.appendChild(path);
  return path;
}

export function plotIsobar(svg, { p, vFrom, vTo, color = null, dashed = false, width = 2, klass = "clap-curve clap-isobar" }) {
  return plotLine(svg, { v0: vFrom, p0: p, v1: vTo, p1: p, color, dashed, width, klass });
}

export function plotIsochor(svg, { v, pFrom, pTo, color = null, dashed = false, width = 2, klass = "clap-curve clap-isochor" }) {
  return plotLine(svg, { v0: v, p0: pFrom, v1: v, p1: pTo, color, dashed, width, klass });
}

export function plotLine(svg, {
  v0, p0, v1, p1,
  color = null,
  dashed = false,
  width = 2,
  klass = "clap-curve clap-line",
}) {
  const ctx = svg._clap;
  const path = el("line", {
    x1: ctx.toX(v0), y1: ctx.toY(p0),
    x2: ctx.toX(v1), y2: ctx.toY(p1),
    class: klass,
    fill: "none",
    "stroke-width": width,
    "stroke-dasharray": dashed ? "5 5" : null,
  });
  if (color) path.setAttribute("style", `stroke:${color};`);
  svg.appendChild(path);
  return path;
}

// ----------------------------------------------------------------------
// Shaded areas (under a curve down to the V-axis)
// ----------------------------------------------------------------------

function polyFromSamples(svg, samples) {
  const ctx = svg._clap;
  const yBase = ctx.toY(ctx.pMin);
  const head = `M${ctx.toX(samples[0][0]).toFixed(2)},${yBase.toFixed(2)}`;
  const top = samples.map(([v, p], i) =>
    `${i === 0 ? "L" : "L"}${ctx.toX(v).toFixed(2)},${ctx.toY(p).toFixed(2)}`
  ).join(" ");
  const tail = `L${ctx.toX(samples[samples.length - 1][0]).toFixed(2)},${yBase.toFixed(2)} Z`;
  return `${head} ${top} ${tail}`;
}

export function shadeUnderIsotherm(svg, { v0, p0, vFrom, vTo, color, opacity = 0.18 }) {
  const K = p0 * v0;
  const samples = sampleIsotherm(K, vFrom, vTo);
  const poly = el("path", {
    d: polyFromSamples(svg, samples),
    class: "clap-shade",
    fill: color,
    "fill-opacity": opacity,
    stroke: "none",
  });
  svg.insertBefore(poly, svg.firstChild ? svg.firstChild.nextSibling : null);
  return poly;
}

export function shadeUnderLine(svg, { v0, p0, v1, p1, color, opacity = 0.18 }) {
  const samples = [[v0, p0], [v1, p1]];
  const poly = el("path", {
    d: polyFromSamples(svg, samples),
    class: "clap-shade",
    fill: color,
    "fill-opacity": opacity,
    stroke: "none",
  });
  svg.insertBefore(poly, svg.firstChild ? svg.firstChild.nextSibling : null);
  return poly;
}

export function shadeRectangle(svg, { vFrom, vTo, pFrom, pTo, color, opacity = 0.18 }) {
  const ctx = svg._clap;
  const x1 = ctx.toX(vFrom), x2 = ctx.toX(vTo);
  const y1 = ctx.toY(pFrom), y2 = ctx.toY(pTo);
  const rect = el("rect", {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
    class: "clap-shade",
    fill: color,
    "fill-opacity": opacity,
    stroke: "none",
  });
  svg.insertBefore(rect, svg.firstChild ? svg.firstChild.nextSibling : null);
  return rect;
}

export function shadeUnderAdiabatic(svg, { v0, p0, gamma, vFrom, vTo, color, opacity = 0.18 }) {
  const K = p0 * Math.pow(v0, gamma);
  const samples = sampleAdiabatic(K, gamma, vFrom, vTo);
  const poly = el("path", {
    d: polyFromSamples(svg, samples),
    class: "clap-shade",
    fill: color,
    "fill-opacity": opacity,
    stroke: "none",
  });
  svg.insertBefore(poly, svg.firstChild ? svg.firstChild.nextSibling : null);
  return poly;
}

// Polygon shade between an arbitrary list of (V, P) points (no axis closure).
// Useful for shading the "ABCDE polygon" minus the direct AE line.
export function shadePolygon(svg, { points, color, opacity = 0.18 }) {
  const ctx = svg._clap;
  const d = points.map(([v, p], i) => {
    const cmd = i === 0 ? "M" : "L";
    return `${cmd}${ctx.toX(v).toFixed(2)},${ctx.toY(p).toFixed(2)}`;
  }).join(" ") + " Z";
  const poly = el("path", {
    d, class: "clap-shade",
    fill: color,
    "fill-opacity": opacity,
    stroke: "none",
  });
  svg.insertBefore(poly, svg.firstChild ? svg.firstChild.nextSibling : null);
  return poly;
}

// ----------------------------------------------------------------------
// Arrows and labels
// ----------------------------------------------------------------------

export function addArrow(svg, { vFrom, pFrom, vTo, pTo, color = null }) {
  const ctx = svg._clap;
  const x1 = ctx.toX(vFrom), y1 = ctx.toY(pFrom);
  const x2 = ctx.toX(vTo),   y2 = ctx.toY(pTo);
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const head = 8;
  const px = -uy, py = ux;

  const g = el("g", { class: "clap-arrow" });
  const line = el("line", {
    x1, y1, x2: x2 - ux * head * 0.6, y2: y2 - uy * head * 0.6,
  });
  const tip = el("polygon", {
    points: `${x2},${y2} ${x2 - ux*head + px*head*0.55},${y2 - uy*head + py*head*0.55} ${x2 - ux*head - px*head*0.55},${y2 - uy*head - py*head*0.55}`,
  });
  if (color) {
    line.setAttribute("style", `stroke:${color};`);
    tip.setAttribute("style", `fill:${color};stroke:${color};`);
  }
  g.appendChild(line);
  g.appendChild(tip);
  svg.appendChild(g);
  return g;
}

export function addLabel(svg, { v, p, text, color = null, dx = 0, dy = 0, anchor = "start", klass = "clap-label" }) {
  const ctx = svg._clap;
  const t = el("text", {
    x: ctx.toX(v) + dx,
    y: ctx.toY(p) + dy,
    class: klass,
    "text-anchor": anchor,
  });
  t.textContent = text;
  if (color) t.setAttribute("style", `fill:${color};`);
  svg.appendChild(t);
  return t;
}

// Place a label tangent to a curve at a given V (using slope-aware positioning).
// `samples` is an array of (V, P) along the curve.
export function addCurveLabel(svg, { samples, atFraction = 0.5, text, color = null, offset = 14 }) {
  const idx = Math.max(0, Math.min(samples.length - 1, Math.round(samples.length * atFraction)));
  const [v, p] = samples[idx];
  return addLabel(svg, { v, p, text, color, dy: -offset, anchor: "middle" });
}

// ----------------------------------------------------------------------
// Ready-made path drawers (full segment + arrow), commonly called from scenes
// ----------------------------------------------------------------------

export function drawTransition(svg, kind, params) {
  switch (kind) {
    case "isotherm": {
      const { v0, p0, vFrom, vTo, color, withArrow = true, dashed = false } = params;
      const path = plotIsotherm(svg, { v0, p0, vFrom, vTo, color, dashed });
      if (withArrow) {
        const K = p0 * v0;
        const vMid = (vFrom + vTo) / 2;
        const vNext = vMid + (vTo - vFrom) * 0.05;
        addArrow(svg, { vFrom: vMid, pFrom: K/vMid, vTo: vNext, pTo: K/vNext, color });
      }
      return path;
    }
    case "adiabatic": {
      const { v0, p0, gamma, vFrom, vTo, color, withArrow = true, dashed = false } = params;
      const path = plotAdiabatic(svg, { v0, p0, gamma, vFrom, vTo, color, dashed });
      if (withArrow) {
        const K = p0 * Math.pow(v0, gamma);
        const vMid = (vFrom + vTo) / 2;
        const vNext = vMid + (vTo - vFrom) * 0.05;
        addArrow(svg, { vFrom: vMid, pFrom: K/Math.pow(vMid, gamma), vTo: vNext, pTo: K/Math.pow(vNext, gamma), color });
      }
      return path;
    }
    case "isobar": {
      const { p, vFrom, vTo, color, withArrow = true, dashed = false } = params;
      const path = plotIsobar(svg, { p, vFrom, vTo, color, dashed });
      if (withArrow) {
        const vMid = (vFrom + vTo) / 2;
        const vNext = vMid + (vTo - vFrom) * 0.06;
        addArrow(svg, { vFrom: vMid, pFrom: p, vTo: vNext, pTo: p, color });
      }
      return path;
    }
    case "isochor": {
      const { v, pFrom, pTo, color, withArrow = true, dashed = false } = params;
      const path = plotIsochor(svg, { v, pFrom, pTo, color, dashed });
      if (withArrow) {
        const pMid = (pFrom + pTo) / 2;
        const pNext = pMid + (pTo - pFrom) * 0.06;
        addArrow(svg, { vFrom: v, pFrom: pMid, vTo: v, pTo: pNext, color });
      }
      return path;
    }
    case "line": {
      const { v0, p0, v1, p1, color, withArrow = true, dashed = false } = params;
      const path = plotLine(svg, { v0, p0, v1, p1, color, dashed });
      if (withArrow) {
        const vMid = (v0 + v1) / 2, pMid = (p0 + p1) / 2;
        const vNext = vMid + (v1 - v0) * 0.06, pNext = pMid + (p1 - p0) * 0.06;
        addArrow(svg, { vFrom: vMid, pFrom: pMid, vTo: vNext, pTo: pNext, color });
      }
      return path;
    }
  }
  throw new Error("drawTransition: unknown kind " + kind);
}
