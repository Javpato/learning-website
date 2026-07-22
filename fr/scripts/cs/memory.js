// SVG memory-diagram primitives for the ASD theme.
// Pure DOM construction; no external deps. Mirrors the style of
// scripts/electro/circuits.js: tiny composable helpers that build SVG nodes.
//
// A diagram is built from:
//   - frames (stack frames or "tableaux d'activation")
//   - slots  (variables inside a frame, with optional value)
//   - heap blocks (cells living on the tas)
//   - arrows (pointers and references)
//   - the special nullDot for NULL / nullptr
//
// All coordinates are in user-space inside an <svg viewBox>. Themes
// style the result via styles/cs.css.

const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}, children = []) {
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

// ---------------------------------------------------------------------
// Base SVG with arrow markers and shared label styles
// ---------------------------------------------------------------------

export function memorySvg({ width = 560, height = 380 } = {}) {
  const svg = el("svg", {
    class: "mem-svg",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
    width: "100%",
  });
  const defs = el("defs");
  defs.appendChild(
    el("marker", {
      id: "mem-arrowhead",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerWidth: "7",
      markerHeight: "7",
      orient: "auto-start-reverse",
    }, [el("path", { d: "M0 0 L10 5 L0 10 z", class: "mem-arrowhead" })])
  );
  defs.appendChild(
    el("marker", {
      id: "mem-arrowhead-dim",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerWidth: "7",
      markerHeight: "7",
      orient: "auto-start-reverse",
    }, [el("path", { d: "M0 0 L10 5 L0 10 z", class: "mem-arrowhead dim" })])
  );
  svg.appendChild(defs);
  return svg;
}

// ---------------------------------------------------------------------
// Single labeled cell — a "slot" inside a stack frame or a heap block
// ---------------------------------------------------------------------

export function slot({
  x, y, w = 110, h = 30,
  label = "",
  value = "",
  highlight = false,
  fading = false,
  changing = false,
}) {
  let cls = "mem-slot";
  if (highlight) cls += " highlight";
  if (fading)    cls += " fading";
  if (changing)  cls += " changing";

  const g = el("g", { class: cls });
  // Box
  g.appendChild(el("rect", { x, y, width: w, height: h, rx: 4, ry: 4, class: "mem-slot-box" }));
  // Value text (centered)
  g.appendChild(el("text", {
    x: x + w / 2, y: y + h / 2 + 5,
    "text-anchor": "middle",
    class: "mem-slot-value",
  }, String(value)));
  // Label text (to the left of the box)
  if (label) {
    g.appendChild(el("text", {
      x: x - 6, y: y + h / 2 + 5,
      "text-anchor": "end",
      class: "mem-slot-label",
    }, label));
  }
  return g;
}

// ---------------------------------------------------------------------
// Stack frame — header + a stack of slots arranged vertically
// ---------------------------------------------------------------------

export function frame({
  x, y, w = 200,
  title = "main",
  slots: slotList = [],
  highlight = false,
  fading = false,
}) {
  const headerH = 26;
  const rowH    = 36;
  const slotW   = w - 90; // leave room for labels on the left
  const slotX   = x + 80;
  const totalH  = headerH + Math.max(1, slotList.length) * rowH + 10;

  let cls = "mem-frame";
  if (highlight) cls += " highlight";
  if (fading)    cls += " fading";

  const g = el("g", { class: cls });
  g.appendChild(el("rect", { x, y, width: w, height: totalH, rx: 6, ry: 6, class: "mem-frame-box" }));
  g.appendChild(el("rect", { x, y, width: w, height: headerH, rx: 6, ry: 6, class: "mem-frame-header" }));
  g.appendChild(el("text", {
    x: x + 10, y: y + headerH - 8,
    class: "mem-frame-title",
  }, title));

  slotList.forEach((s, i) => {
    const sy = y + headerH + 6 + i * rowH;
    g.appendChild(slot({
      x: slotX, y: sy,
      w: slotW, h: rowH - 8,
      label: s.label,
      value: s.value,
      highlight: s.highlight,
      fading: s.fading,
      changing: s.changing,
    }));
    // expose the geometry so callers can target arrows
    s._x = slotX;
    s._y = sy;
    s._w = slotW;
    s._h = rowH - 8;
  });

  // Hand back the computed slot positions for arrow targeting
  g._slotPositions = slotList.map((s) => ({
    label: s.label,
    cx: s._x + s._w / 2,
    cy: s._y + s._h / 2,
    leftX: s._x,
    rightX: s._x + s._w,
    topY: s._y,
    bottomY: s._y + s._h,
  }));
  g._frameBox = { x, y, w, h: totalH };
  return g;
}

// ---------------------------------------------------------------------
// Heap block — a free-floating allocated cell
// ---------------------------------------------------------------------

export function heapBlock({
  x, y, w = 80, h = 30,
  value = "",
  addr = "",
  highlight = false,
  fading = false,
}) {
  let cls = "mem-heap";
  if (highlight) cls += " highlight";
  if (fading)    cls += " fading";

  const g = el("g", { class: cls });
  g.appendChild(el("rect", { x, y, width: w, height: h, rx: 4, ry: 4, class: "mem-heap-box" }));
  g.appendChild(el("text", {
    x: x + w / 2, y: y + h / 2 + 5,
    "text-anchor": "middle",
    class: "mem-heap-value",
  }, String(value)));
  if (addr) {
    g.appendChild(el("text", {
      x: x + w / 2, y: y - 6,
      "text-anchor": "middle",
      class: "mem-heap-addr",
    }, addr));
  }
  g._cx = x + w / 2;
  g._cy = y + h / 2;
  g._leftX = x;
  g._rightX = x + w;
  return g;
}

// ---------------------------------------------------------------------
// Arrows between (fromX, fromY) and (toX, toY)
// ---------------------------------------------------------------------

export function arrow({
  from, to,
  dashed = false,
  dim = false,
  curve = 0,    // sideways curve offset; 0 = straight
}) {
  let cls = "mem-arrow";
  if (dashed) cls += " dashed";
  if (dim)    cls += " dim";

  let d;
  if (curve === 0) {
    d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else {
    const mx = (from.x + to.x) / 2 + curve;
    const my = (from.y + to.y) / 2;
    d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
  }
  return el("path", {
    d, fill: "none", class: cls,
    "marker-end": dim ? "url(#mem-arrowhead-dim)" : "url(#mem-arrowhead)",
  });
}

// ---------------------------------------------------------------------
// NULL / nullptr marker — small diagonal slash drawn inside a slot
// ---------------------------------------------------------------------

export function nullMark({ x, y, w = 30, h = 18 }) {
  const g = el("g", { class: "mem-null" });
  g.appendChild(el("rect", { x, y, width: w, height: h, class: "mem-null-box" }));
  g.appendChild(el("line", {
    x1: x, y1: y + h, x2: x + w, y2: y,
    class: "mem-null-slash",
  }));
  return g;
}

// ---------------------------------------------------------------------
// Region label — "Pile" or "Tas" header
// ---------------------------------------------------------------------

export function regionLabel({ x, y, w, label, kind = "pile" }) {
  const cls = `mem-region mem-region-${kind}`;
  const g = el("g", { class: cls });
  g.appendChild(el("rect", { x, y, width: w, height: 22, class: "mem-region-box" }));
  g.appendChild(el("text", {
    x: x + 10, y: y + 16,
    class: "mem-region-label",
  }, label));
  return g;
}

// ---------------------------------------------------------------------
// Code listing — a small <foreignObject> with monospace text
// rendered alongside the diagram (used by some scenes to mirror the
// PDF's "code on left, memory on right" layout).
// ---------------------------------------------------------------------

export function codeBlock({ x, y, w, h, lines = [], highlight = -1 }) {
  const fo = el("foreignObject", { x, y, width: w, height: h });
  const div = document.createElement("div");
  div.className = "mem-code";
  const pre = document.createElement("pre");
  lines.forEach((line, i) => {
    const span = document.createElement("span");
    span.className = "mem-code-line" + (i === highlight ? " current" : "");
    span.textContent = line;
    pre.appendChild(span);
    pre.appendChild(document.createTextNode("\n"));
  });
  div.appendChild(pre);
  fo.appendChild(div);
  return fo;
}
