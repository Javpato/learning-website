// Piston / cylinder schematic. Small SVG that visually mirrors what is
// happening physically during a transformation: piston position encodes
// volume, heat arrows encode the sign of Q, an optional thermometer encodes
// temperature, hatching on the cylinder wall encodes adiabatic insulation.

const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    node.setAttribute(k, v);
  }
  return node;
}

export function pistonScene({
  volumeFrac = 0.6,        // 0..1, fraction of cylinder filled with gas
  heat = "none",           // "in" | "out" | "none"
  T = null,                // optional, in T_A units
  Tmax = 4.5,              // scale for thermometer
  insulated = false,       // draw hatching on the walls
  label = "",              // caption below
  width = 220,
  height = 320,
  pressureLevel = 1,       // 0..n — number of pressure tick-arrows on the gas
} = {}) {
  const svg = el("svg", {
    class: "piston-svg",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
  });

  // Patterns: hatching for insulation. Build via DOM so SVG namespace is correct.
  const patternId = "ins-hatch-" + Math.random().toString(36).slice(2, 9);
  if (insulated) {
    const defs = el("defs");
    const pat = el("pattern", {
      id: patternId,
      width: 6, height: 6,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(45)",
    });
    pat.appendChild(el("line", {
      x1: 0, y1: 0, x2: 0, y2: 6,
      class: "piston-insulation",
    }));
    defs.appendChild(pat);
    svg.appendChild(defs);
  }

  // Layout
  const cylX = 60;
  const cylW = 120;
  const cylTop = 20;
  const cylBottom = height - 56;
  const cylH = cylBottom - cylTop;

  const pistonH = 12;
  // gas fills from cylBottom up to (cylBottom - volumeFrac * (cylH - pistonH))
  const gasTopY = cylBottom - volumeFrac * (cylH - pistonH);

  // Insulation overlay (drawn behind walls so walls show on top)
  if (insulated) {
    svg.appendChild(el("rect", {
      x: cylX - 8, y: cylTop - 8,
      width: cylW + 16, height: cylH + 16,
      fill: `url(#${patternId})`,
    }));
  }

  // Cylinder walls (left + right + bottom). Top is open (piston).
  const walls = el("g", { class: "piston-walls" });
  walls.appendChild(el("line", {
    x1: cylX, y1: cylTop, x2: cylX, y2: cylBottom,
  }));
  walls.appendChild(el("line", {
    x1: cylX + cylW, y1: cylTop, x2: cylX + cylW, y2: cylBottom,
  }));
  walls.appendChild(el("line", {
    x1: cylX - 4, y1: cylBottom, x2: cylX + cylW + 4, y2: cylBottom,
  }));
  svg.appendChild(walls);

  // Gas
  const gas = el("rect", {
    x: cylX + 1.5, y: gasTopY,
    width: cylW - 3, height: cylBottom - gasTopY,
    class: "piston-gas",
  });
  svg.appendChild(gas);

  // Pressure ticks inside the gas (tiny arrows pointing outward)
  if (pressureLevel > 0) {
    const arrowsG = el("g", { class: "piston-pressure" });
    const n = Math.max(1, Math.min(4, pressureLevel));
    const cy = (gasTopY + cylBottom) / 2;
    for (let i = 0; i < n; i++) {
      const offset = (i - (n - 1) / 2) * 18;
      const y = cy + offset;
      // small arrow pointing left to wall
      arrowsG.appendChild(el("line", {
        x1: cylX + cylW * 0.35, y1: y,
        x2: cylX + 8, y2: y,
      }));
      arrowsG.appendChild(el("polygon", {
        points: `${cylX + 4},${y} ${cylX + 11},${y - 3} ${cylX + 11},${y + 3}`,
      }));
      // small arrow pointing right to wall
      arrowsG.appendChild(el("line", {
        x1: cylX + cylW - cylW * 0.35, y1: y,
        x2: cylX + cylW - 8, y2: y,
      }));
      arrowsG.appendChild(el("polygon", {
        points: `${cylX + cylW - 4},${y} ${cylX + cylW - 11},${y - 3} ${cylX + cylW - 11},${y + 3}`,
      }));
    }
    svg.appendChild(arrowsG);
  }

  // Piston (top of gas)
  const piston = el("rect", {
    x: cylX - 6, y: gasTopY - pistonH,
    width: cylW + 12, height: pistonH,
    class: "piston-block",
    rx: 2,
  });
  svg.appendChild(piston);

  // Piston rod going up
  svg.appendChild(el("line", {
    x1: cylX + cylW / 2, y1: gasTopY - pistonH,
    x2: cylX + cylW / 2, y2: cylTop - 4,
    class: "piston-rod",
  }));

  // Heat arrows
  if (heat === "in" || heat === "out") {
    const heatG = el("g", { class: heat === "in" ? "piston-heat-in" : "piston-heat-out" });
    // Two arrows, one on each side of the cylinder, near the bottom
    const positions = [
      { x: cylX - 18, y: cylBottom - 22, side: "left" },
      { x: cylX + cylW + 18, y: cylBottom - 22, side: "right" },
    ];
    for (const pos of positions) {
      const dirIn = heat === "in";
      // for left side: in = pointing right (toward gas); out = pointing left
      // for right side: in = pointing left (toward gas); out = pointing right
      const towardGas = pos.side === "left" ? 1 : -1; // sign of dx for "in"
      const dxSign = dirIn ? towardGas : -towardGas;
      const x1 = pos.x;
      const x2 = pos.x + dxSign * 22;
      heatG.appendChild(el("line", {
        x1, y1: pos.y, x2, y2: pos.y,
      }));
      heatG.appendChild(el("polygon", {
        points: `${x2},${pos.y} ${x2 - dxSign*7},${pos.y - 4} ${x2 - dxSign*7},${pos.y + 4}`,
      }));
      // "Q" label near the tail
      const qLabel = el("text", {
        x: x1, y: pos.y - 8,
        class: "piston-heat-label",
        "text-anchor": "middle",
      });
      qLabel.textContent = "Q";
      heatG.appendChild(qLabel);
    }
    svg.appendChild(heatG);
  }

  // Thermometer (right of the cylinder)
  if (T != null) {
    const thX = cylX + cylW + 32;
    const thTop = cylTop + 8;
    const thBot = cylBottom - 8;
    const thW = 8;
    const bulbR = 10;

    const thG = el("g", { class: "piston-thermo" });
    // outline tube
    thG.appendChild(el("rect", {
      x: thX, y: thTop, width: thW, height: thBot - thTop,
      class: "piston-thermo-tube",
    }));
    // bulb
    thG.appendChild(el("circle", {
      cx: thX + thW / 2, cy: thBot + bulbR - 2, r: bulbR,
      class: "piston-thermo-bulb",
    }));
    // fill (proportional to T / Tmax)
    const fillFrac = Math.max(0.05, Math.min(1, T / Tmax));
    const fillH = (thBot - thTop) * fillFrac;
    thG.appendChild(el("rect", {
      x: thX + 1.5, y: thBot - fillH, width: thW - 3, height: fillH,
      class: "piston-thermo-fill",
    }));
    thG.appendChild(el("circle", {
      cx: thX + thW / 2, cy: thBot + bulbR - 2, r: bulbR - 2.5,
      class: "piston-thermo-fill",
    }));
    // T label
    const tt = el("text", {
      x: thX + thW / 2, y: thTop - 6,
      class: "piston-thermo-label",
      "text-anchor": "middle",
    });
    tt.textContent = "T";
    thG.appendChild(tt);
    svg.appendChild(thG);
  }

  // Insulation hint label
  if (insulated) {
    const t = el("text", {
      x: width / 2, y: cylTop - 6,
      class: "piston-adia-label",
      "text-anchor": "middle",
    });
    t.textContent = "adiabática";
    svg.appendChild(t);
  }

  // Caption below
  if (label) {
    const cap = el("text", {
      x: width / 2, y: height - 18,
      class: "piston-caption",
      "text-anchor": "middle",
    });
    cap.textContent = label;
    svg.appendChild(cap);
  }

  return svg;
}

// Convenience: a side-by-side row containing a Clapeyron SVG and a piston SVG.
// Returns a plain HTML <div> ready to insert into the .pres-figure container.
export function figureRow(clapeyronSvg, pistonSvg) {
  const div = document.createElement("div");
  div.className = "thermo-figure-row";
  if (clapeyronSvg) div.appendChild(clapeyronSvg);
  if (pistonSvg) div.appendChild(pistonSvg);
  return div;
}
