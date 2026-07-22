// Scene data for the animated correction of Exercise 1 — Three paths between A and B.
// Two moles of an ideal gas, T_B = T_A, P_B = 3 P_A.
//
// Five chapters: Setup, Path AMB (isothermal), Path ACB
// (isochoric + isobaric), Path ANB (straight line), Final comparison.

import {
  clapeyronAxes,
  plotPoint,
  plotIsotherm,
  plotIsobar,
  plotIsochor,
  plotLine,
  shadeUnderIsotherm,
  shadeUnderLine,
  shadeRectangle,
  drawTransition,
  addLabel,
  addArrow,
} from "./clapeyron.js";

import { pistonScene, figureRow } from "./piston.js";

// Normalized data-space coordinates (V_A = 1, P_A = 1).
const VA = 1, PA = 1;
const VB = VA / 3, PB = 3 * PA;
const VC = VA, PC = PB;

// Axis ranges
const VMAX = 1.4, PMAX = 3.6;

// Path colors (match CSS tokens — copy literals to avoid runtime CSS lookup).
const COLOR_AMB = "#58a6ff"; // blue
const COLOR_ACB = "#f5b942"; // warm yellow
const COLOR_ANB = "#6ee7b7"; // green
const COLOR_DASHED = "#9aa0a6";

// ---------------------------------------------------------------------
// Diagram builders
// ---------------------------------------------------------------------

function baseDiagram({ withC = false, lightIsotherm = false } = {}) {
  const svg = clapeyronAxes({
    vMin: 0, vMax: VMAX, pMin: 0, pMax: PMAX,
    width: 520, height: 380,
    vTicks: [VA / 3, VA],
    pTicks: [PA, PB],
  });

  if (lightIsotherm) {
    // pale isotherm passing through A and B (PV = P_A V_A)
    plotIsotherm(svg, {
      v0: VA, p0: PA,
      vFrom: VB * 0.9, vTo: VMAX * 0.97,
      color: COLOR_DASHED,
      dashed: true,
    });
  }

  // Plot A
  plotPoint(svg, {
    v: VA, p: PA, label: "A",
    labelDx: 10, labelDy: 4,
    vTickLabel: "V_A",
    pTickLabel: "P_A",
    projections: ["v", "p"],
  });
  // Plot B
  plotPoint(svg, {
    v: VB, p: PB, label: "B",
    labelDx: -10, labelDy: 4, labelAnchor: "end",
    vTickLabel: "V_A/3",
    pTickLabel: "3P_A",
    projections: ["v", "p"],
  });
  if (withC) {
    plotPoint(svg, {
      v: VC, p: PC, label: "C",
      labelDx: 10, labelDy: -8,
      projections: [],
    });
  }
  return svg;
}

function emptyDiagram() {
  return clapeyronAxes({
    vMin: 0, vMax: VMAX, pMin: 0, pMax: PMAX,
    width: 520, height: 380,
    vTicks: [VA / 3, VA],
    pTicks: [PA, PB],
  });
}

function pistonOf(opts) {
  return pistonScene(opts);
}

// ---------------------------------------------------------------------
// Chapter 1 — Setup
// ---------------------------------------------------------------------

const chapterSetup = {
  label: "Setup",
  steps: [
    {
      title: "The Clapeyron diagram",
      note: `We represent the evolution of an ideal gas in a plane with the <strong>volume V</strong> on the horizontal axis and the <strong>pressure P</strong> on the vertical axis. Each <em>state</em> of the gas is a point; each <em>transformation</em> is a curve joining two points.`,
      math: [
        "PV = nRT \\quad (\\text{ideal gas law})",
        "n = 2 \\Rightarrow PV = 2RT",
      ],
      figure: () => figureRow(emptyDiagram(), pistonOf({
        volumeFrac: 0.6, heat: "none", T: 1, label: "ideal gas",
      })),
    },
    {
      title: "Initial state A",
      note: `We place the initial state <strong>A</strong>: volume <em>V<sub>A</sub></em>, pressure <em>P<sub>A</sub></em>. The temperature at A is <em>T<sub>A</sub> = 300 K</em>. The dashed lines mark the coordinates on the axes.`,
      math: [
        "A = (V_A, P_A), \\quad P_A V_A = 2RT_A",
      ],
      figure: () => {
        const svg = clapeyronAxes({
          vMin: 0, vMax: VMAX, pMin: 0, pMax: PMAX,
          width: 520, height: 380,
          vTicks: [VA], pTicks: [PA],
        });
        plotPoint(svg, {
          v: VA, p: PA, label: "A",
          labelDx: 10, labelDy: 4,
          vTickLabel: "V_A", pTickLabel: "P_A",
          projections: ["v", "p"],
        });
        return figureRow(svg, pistonOf({
          volumeFrac: 0.7, heat: "none", T: 1, label: "state A",
        }));
      },
    },
    {
      title: "Position of B  —  T_B = T_A so PV = const",
      note: `Since <em>T<sub>B</sub> = T<sub>A</sub></em>, the product <em>PV</em> is conserved between A and B (ideal gas: PV ∝ T). We deduce <strong>V<sub>B</sub> = V<sub>A</sub>/3</strong>. A and B therefore lie on the <strong>same isotherm</strong> (dashed).`,
      math: [
        "P_A V_A = P_B V_B = 2RT_A",
        "P_B = 3P_A \\;\\Rightarrow\\; V_B = \\dfrac{V_A}{3}",
        "B = \\left(\\dfrac{V_A}{3},\\; 3P_A\\right)",
      ],
      figure: () => figureRow(baseDiagram({ lightIsotherm: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "none", T: 1,
        label: "B (same T as at A)",
      })),
      whyStep: {
        summary: "Why do A and B share the same isotherm?",
        body: `For an ideal gas, the equation of state <em>PV = nRT</em> requires that at fixed <em>T</em>, the product <em>PV</em> be constant. So the locus of points (V, P) at temperature T is a <em>rectangular hyperbola</em> in the (V, P) plane. Since T<sub>B</sub> = T<sub>A</sub>, A and B lie on the same hyperbola.`,
        math: ["P\\,V = nRT \\Rightarrow P = \\dfrac{nRT}{V}"],
      },
    },
    {
      title: "Position of C  —  isochoric then isobaric",
      note: `The path <strong>ACB</strong> requires: first an <em>isochoric</em> step (constant V), then an <em>isobaric</em> step (constant P). The corner point <strong>C</strong> therefore has the volume of A and the pressure of B.`,
      math: [
        "C = (V_A,\\; 3P_A)",
      ],
      figure: () => figureRow(baseDiagram({ withC: true, lightIsotherm: true }), pistonOf({
        volumeFrac: 0.7, pressureLevel: 3, heat: "in", T: 3,
        label: "C : V_A, 3P_A",
      })),
    },
    {
      title: "Convention: work and heat received",
      note: `We adopt the <strong>physicist's</strong> convention: W and Q are the quantities <em>received</em> by the gas. For a reversible transformation, the elementary work is <em>δW = −P dV</em>. A <strong>compression</strong> (dV &lt; 0) therefore gives <em>W &gt; 0</em>, an <strong>expansion</strong> (dV &gt; 0) gives <em>W &lt; 0</em>.`,
      math: [
        "\\Delta U = W + Q",
        "\\delta W = -P\\,dV \\;\\Rightarrow\\; W = -\\!\\int_{V_i}^{V_f}\\! P\\,dV",
      ],
      whyStep: {
        summary: "Why is ΔU = 0 for all three paths?",
        body: `The internal energy of an ideal gas <strong>depends only on temperature</strong>. Since T<sub>A</sub> = T<sub>B</sub>, ΔU = 0 whatever path is followed. It is a <em>state function</em>. Consequence: for each path, <em>Q = −W</em>.`,
        math: ["\\Delta U = nC_V(T_B - T_A) = 0", "\\Rightarrow Q = -W"],
        openByDefault: true,
      },
      figure: () => figureRow(baseDiagram({ withC: true, lightIsotherm: true }), pistonOf({
        volumeFrac: 0.5, pressureLevel: 2, heat: "none", T: 1,
        label: "received convention",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 2 — Path AMB (isothermal)
// ---------------------------------------------------------------------

function diagramAMB({ shaded = false } = {}) {
  const svg = baseDiagram({});
  if (shaded) {
    shadeUnderIsotherm(svg, {
      v0: VA, p0: PA,
      vFrom: VB, vTo: VA,
      color: COLOR_AMB,
      opacity: 0.22,
    });
  }
  // Solid isotherm A → B (drawn going from A to B, so right-to-left).
  drawTransition(svg, "isotherm", {
    v0: VA, p0: PA,
    vFrom: VA, vTo: VB,
    color: COLOR_AMB,
    withArrow: true,
  });
  // Mid-curve label "M"
  plotPoint(svg, {
    v: 0.6, p: PA * VA / 0.6,
    label: "M", labelDx: 10, labelDy: 0,
    color: COLOR_AMB,
  });
  return svg;
}

const chapterAMB = {
  label: "Path AMB (isothermal)",
  steps: [
    {
      title: "The isothermal path — the hyperbola",
      note: `Along <strong>AMB</strong>, the temperature stays constant at <em>T<sub>A</sub></em>. The equation of state imposes <em>PV = 2RT<sub>A</sub></em>: we travel along a <strong>rectangular hyperbola</strong>. M is an arbitrary intermediate point on this curve.`,
      math: [
        "T = T_A \\Rightarrow PV = 2RT_A",
        "P(V) = \\dfrac{2RT_A}{V}",
      ],
      figure: () => figureRow(diagramAMB(), pistonOf({
        volumeFrac: 0.55, pressureLevel: 2, heat: "out", T: 1,
        label: "isothermal compression",
      })),
    },
    {
      title: "Computing the work received — the area under the curve",
      note: `The work received is <em>W = −∫P dV</em>. The <strong>colored area</strong> under the hyperbola, between V<sub>B</sub> and V<sub>A</sub>, represents |W|; since we go from A to B (compression, V decreases), W is <strong>positive</strong>.`,
      math: [
        "W_{AMB} = -\\!\\int_{V_A}^{V_B}\\! \\dfrac{2RT_A}{V}\\,dV",
        "W_{AMB} = -2RT_A\\,\\ln\\!\\dfrac{V_B}{V_A} = -2RT_A\\,\\ln\\!\\dfrac{1}{3}",
        "\\boxed{\\,W_{AMB} = 2RT_A\\,\\ln 3 \\approx 5.49\\ \\text{kJ}\\,}",
      ],
      highlightLine: 2,
      figure: () => figureRow(diagramAMB({ shaded: true }), pistonOf({
        volumeFrac: 0.4, pressureLevel: 3, heat: "out", T: 1,
        label: "area under curve = |W|",
      })),
      whyStep: {
        summary: "Why −∫₁ⁿ dV/V = −ln(V_f / V_i)?",
        body: `To integrate 1/V, we use the antiderivative <em>ln V</em>. The general rule: <em>∫(dV/V) = ln|V|</em>. With lower bound V<sub>A</sub> and upper bound V<sub>B</sub> &lt; V<sub>A</sub>:`,
        math: [
          "\\int_{V_A}^{V_B}\\dfrac{dV}{V} = \\ln V_B - \\ln V_A = \\ln\\!\\dfrac{V_B}{V_A}",
          "\\ln\\!\\dfrac{1}{3} = -\\ln 3",
        ],
      },
    },
    {
      title: "Heat received — Q = −W",
      note: `Since ΔU = 0 (ideal gas, constant T), the first law imposes <strong>Q = −W</strong>. The gas receives <em>work</em> (compression) and <strong>gives up the same energy as heat</strong> to the thermostat. On the piston, the Q arrows point outward.`,
      math: [
        "\\Delta U = 0 \\;\\Rightarrow\\; Q_{AMB} = -W_{AMB}",
        "\\boxed{\\,Q_{AMB} = -2RT_A\\,\\ln 3 \\approx -5.49\\ \\text{kJ}\\,}",
      ],
      highlightLine: 1,
      figure: () => figureRow(diagramAMB({ shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "out", T: 1,
        label: "heat given up",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 3 — Path ACB (isochoric + isobaric)
// ---------------------------------------------------------------------

function diagramACB({ stage = "full", shaded = false } = {}) {
  const svg = baseDiagram({ withC: true });
  if (shaded && (stage === "full" || stage === "CB")) {
    // Area under segment CB (isobar at P = 3P_A between V_B and V_A)
    shadeRectangle(svg, {
      vFrom: VB, vTo: VA,
      pFrom: 0, pTo: PB,
      color: COLOR_ACB,
      opacity: 0.22,
    });
  }
  // A → C  (vertical, isochoric)
  if (stage === "AC" || stage === "full" || stage === "CB") {
    drawTransition(svg, "isochor", {
      v: VA, pFrom: PA, pTo: PB,
      color: COLOR_ACB,
      withArrow: stage !== "CB",
    });
  }
  // C → B  (horizontal, isobaric)
  if (stage === "CB" || stage === "full") {
    drawTransition(svg, "isobar", {
      p: PB, vFrom: VA, vTo: VB,
      color: COLOR_ACB,
      withArrow: true,
    });
  }
  return svg;
}

const chapterACB = {
  label: "Path ACB (isochoric + isobaric)",
  steps: [
    {
      title: "Step A → C — isochoric (constant V)",
      note: `The volume does not change: <em>dV = 0</em>, so <strong>W<sub>AC</sub> = 0</strong>. The gas is heated at constant volume: pressure and temperature rise together. The piston does not move, but heat flows in.`,
      math: [
        "V = V_A \\Rightarrow dV = 0",
        "W_{AC} = -\\!\\int P\\,dV = 0",
        "Q_{AC} > 0 \\quad (T : T_A \\to 3T_A)",
      ],
      figure: () => figureRow(diagramACB({ stage: "AC" }), pistonOf({
        volumeFrac: 0.7, pressureLevel: 3, heat: "in", T: 3,
        label: "A → C : V const, T rises",
      })),
    },
    {
      title: "Step C → B — isobaric (constant P)",
      note: `At <em>P = 3P<sub>A</sub></em>, the gas is compressed from V<sub>A</sub> to V<sub>A</sub>/3. The work received is the area of the <strong>rectangle</strong> under the isobar. Since dV &lt; 0, W is positive and large: the compression pressure is high.`,
      math: [
        "W_{CB} = -P_B\\,(V_B - V_C) = -3P_A\\!\\left(\\!\\dfrac{V_A}{3}-V_A\\!\\right)",
        "W_{CB} = 2 P_A V_A = 4 R T_A",
      ],
      highlightLine: 1,
      figure: () => figureRow(diagramACB({ stage: "CB", shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 4, heat: "out", T: 1,
        label: "C → B : P const, compression",
      })),
      whyStep: {
        summary: "Why is this area so large?",
        body: `Along the path ACB, the compression happens at <em>the highest possible pressure</em> between A and B (P = 3P<sub>A</sub>). And the area under the curve is the work. The "higher" the curve sits, the wider the rectangle: ACB <strong>maximizes</strong> the work received among the three paths.`,
      },
    },
    {
      title: "Summary for ACB",
      note: `We sum: <em>W<sub>ACB</sub> = W<sub>AC</sub> + W<sub>CB</sub></em>. And since ΔU = 0 over the whole path (T<sub>A</sub> = T<sub>B</sub>), <strong>Q<sub>ACB</sub> = −W<sub>ACB</sub></strong>.`,
      math: [
        "\\boxed{\\,W_{ACB} = 4RT_A \\approx 9.98\\ \\text{kJ}\\,}",
        "\\boxed{\\,Q_{ACB} = -4RT_A \\approx -9.98\\ \\text{kJ}\\,}",
      ],
      figure: () => figureRow(diagramACB({ stage: "full", shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 4, heat: "out", T: 1,
        label: "summary ACB",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 4 — Path ANB (straight line)
// ---------------------------------------------------------------------

function diagramANB({ shaded = false } = {}) {
  const svg = baseDiagram({});
  if (shaded) {
    shadeUnderLine(svg, {
      v0: VA, p0: PA, v1: VB, p1: PB,
      color: COLOR_ANB,
      opacity: 0.22,
    });
  }
  drawTransition(svg, "line", {
    v0: VA, p0: PA, v1: VB, p1: PB,
    color: COLOR_ANB,
    withArrow: true,
  });
  // Plot N as a label-only midpoint marker
  plotPoint(svg, {
    v: (VA + VB)/2, p: (PA + PB)/2,
    label: "N", labelDx: 10, labelDy: -4,
    color: COLOR_ANB,
  });
  return svg;
}

const chapterANB = {
  label: "Path ANB (straight line)",
  steps: [
    {
      title: "A straight line in the (V, P) plane  —  area of a trapezoid",
      note: `Along the path <strong>ANB</strong>, the pressure varies linearly with V. The area under the curve is a <strong>trapezoid</strong>: the mean of the heights (P<sub>A</sub> + P<sub>B</sub>)/2 multiplied by the width |V<sub>B</sub> − V<sub>A</sub>|.`,
      math: [
        "\\int_{V_A}^{V_B} P\\,dV = \\dfrac{P_A + P_B}{2}\\,(V_B - V_A)",
        "W_{ANB} = -\\dfrac{P_A + 3P_A}{2}\\!\\left(\\dfrac{V_A}{3} - V_A\\right)",
      ],
      figure: () => figureRow(diagramANB({ shaded: true }), pistonOf({
        volumeFrac: 0.5, pressureLevel: 3, heat: "out", T: 1,
        label: "linear compression",
      })),
    },
    {
      title: "Summary for ANB",
      note: `The result sits <strong>between</strong> the isotherm's and ACB's: as expected, because the area of the trapezoid is intermediate.`,
      math: [
        "\\boxed{\\,W_{ANB} = \\dfrac{8}{3}RT_A \\approx 6.66\\ \\text{kJ}\\,}",
        "\\boxed{\\,Q_{ANB} = -\\dfrac{8}{3}RT_A \\approx -6.66\\ \\text{kJ}\\,}",
      ],
      figure: () => figureRow(diagramANB({ shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "out", T: 1,
        label: "summary ANB",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 5 — Final comparison
// ---------------------------------------------------------------------

function buildLegend() {
  const legend = document.createElement("div");
  legend.className = "thermo-legend";
  legend.innerHTML = `
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-amb"></span>AMB — isothermal</span>
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-anb"></span>ANB — straight line</span>
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-acb"></span>ACB — isochoric + isobaric</span>
  `;
  return legend;
}

function diagramAllPaths() {
  const svg = baseDiagram({ withC: true });
  // Layered shading: ACB (largest, draw first), ANB, AMB (smallest, on top)
  shadeRectangle(svg, {
    vFrom: VB, vTo: VA,
    pFrom: 0, pTo: PB,
    color: COLOR_ACB,
    opacity: 0.16,
  });
  shadeUnderLine(svg, {
    v0: VA, p0: PA, v1: VB, p1: PB,
    color: COLOR_ANB,
    opacity: 0.22,
  });
  shadeUnderIsotherm(svg, {
    v0: VA, p0: PA,
    vFrom: VB, vTo: VA,
    color: COLOR_AMB,
    opacity: 0.28,
  });

  // Curves on top of shading
  plotIsotherm(svg, {
    v0: VA, p0: PA, vFrom: VB, vTo: VA,
    color: COLOR_AMB,
  });
  plotLine(svg, {
    v0: VA, p0: PA, v1: VB, p1: PB,
    color: COLOR_ANB,
  });
  plotIsochor(svg, { v: VA, pFrom: PA, pTo: PB, color: COLOR_ACB });
  plotIsobar(svg, { p: PB, vFrom: VA, vTo: VB, color: COLOR_ACB });
  return svg;
}

const chapterCompare = {
  label: "Comparison",
  steps: [
    {
      title: "The three paths overlaid",
      note: `We overlay the three areas on a single diagram. The eye reads it immediately: the <strong>ACB</strong> area contains the <strong>ANB</strong> area, which contains the <strong>AMB</strong> area. The higher the pressure at which a compression happens, the larger the work received by the gas.`,
      math: [
        "W_{AMB} < W_{ANB} < W_{ACB}",
        "2\\ln 3 \\approx 2.20 \\;<\\; \\dfrac{8}{3} \\approx 2.67 \\;<\\; 4",
      ],
      highlightLine: 0,
      figure: () => {
        const stack = document.createElement("div");
        stack.className = "thermo-figure-stack";
        stack.appendChild(diagramAllPaths());
        stack.appendChild(buildLegend());
        return stack;
      },
    },
    {
      title: "Numerical recap  —  T_A = 300 K, R = 8.32",
      note: `For each path, <em>Q = −W</em> (because ΔU = 0). So the order of the heats is the <strong>opposite</strong> of the order of the works: the transformation that receives the most work is also the one that gives up the most heat.`,
      math: [
        "W_{AMB} \\approx 5.49\\ \\text{kJ},\\quad Q_{AMB} \\approx -5.49\\ \\text{kJ}",
        "W_{ANB} \\approx 6.66\\ \\text{kJ},\\quad Q_{ANB} \\approx -6.66\\ \\text{kJ}",
        "W_{ACB} \\approx 9.98\\ \\text{kJ},\\quad Q_{ACB} \\approx -9.98\\ \\text{kJ}",
        "Q_{ACB} < Q_{ANB} < Q_{AMB} < 0",
      ],
      highlightLine: 3,
      figure: () => {
        const stack = document.createElement("div");
        stack.className = "thermo-figure-stack";
        stack.appendChild(diagramAllPaths());
        stack.appendChild(buildLegend());
        return stack;
      },
      whyStep: {
        summary: "Why do W and Q depend on the path, but not ΔU?",
        body: `<em>U</em> is a <strong>state function</strong>: its change between A and B depends only on the initial and final states, not on the path. <em>W</em> and <em>Q</em>, by contrast, are <strong>exchanges</strong> between the gas and the surroundings; they depend on the exact course of the transformation. This distinction is central: it underpins the notion of a <em>state function</em> in thermodynamics.`,
        openByDefault: true,
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------

export const exercice1Presentation = {
  chapters: [
    chapterSetup,
    chapterAMB,
    chapterACB,
    chapterANB,
    chapterCompare,
  ],
};
