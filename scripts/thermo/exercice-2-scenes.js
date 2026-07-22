// Scene data for the animated correction of Exercise 2 — cycle ABCDE.
// One mole of ideal gas, constant molar heat capacities Cp and Cv.
//
// A → B  : quasi-static isochoric           P_B = 2P_A
// B → C  : quasi-static isobaric            V_C = 2V_A
// C → D  : quasi-static isothermal          V_D = 3V_A
// D → E  : reversible adiabatic             V_E = (4/3)^(1/γ) V_D
//
// We show P_E = P_A and compare ABCDE with the direct path AE.

import {
  clapeyronAxes,
  plotPoint,
  plotIsotherm,
  plotIsobar,
  plotIsochor,
  plotAdiabatic,
  plotLine,
  shadeUnderIsotherm,
  shadeUnderAdiabatic,
  shadeRectangle,
  shadePolygon,
  drawTransition,
  addLabel,
} from "./clapeyron.js";

import { pistonScene, figureRow } from "./piston.js";

// Normalized data-space coordinates
const VA = 1, PA = 1;
const VB = VA, PB = 2 * PA;
const VC = 2 * VA, PC = PB;
const VD = 3 * VA, PD = (4 / 3) * PA;
const GAMMA = 1.4;
const VE = VD * Math.pow(4 / 3, 1 / GAMMA);
const PE = PA;

const VMAX = 4.2;
const PMAX = 2.5;

// Curve colors
const C_ISOCHOR = "#6ee7b7";    // green
const C_ISOBAR = "#f5b942";     // warm yellow
const C_ISOTHERM = "#58a6ff";   // blue
const C_ADIABATIC = "#d8b4fe";  // purple
const C_DIRECT = "#f87171";     // red — direct path AE

// ---------------------------------------------------------------------
// Helper: base diagram with optional set of points already placed
// ---------------------------------------------------------------------

function baseAxes() {
  return clapeyronAxes({
    vMin: 0, vMax: VMAX, pMin: 0, pMax: PMAX,
    width: 540, height: 380,
    vTicks: [VA, 2 * VA, 3 * VA],
    pTicks: [PA, 2 * PA],
  });
}

const POINTS = {
  A: { v: VA, p: PA, label: "A", labelDx: -10, labelDy: 14, labelAnchor: "end" },
  B: { v: VB, p: PB, label: "B", labelDx: -10, labelDy: 4,  labelAnchor: "end" },
  C: { v: VC, p: PC, label: "C", labelDx: 0,   labelDy: -10, labelAnchor: "middle" },
  D: { v: VD, p: PD, label: "D", labelDx: 0,   labelDy: -10, labelAnchor: "middle" },
  E: { v: VE, p: PE, label: "E", labelDx: 8,   labelDy: 14 },
};

function placePoints(svg, names) {
  for (const n of names) {
    const opts = POINTS[n];
    plotPoint(svg, opts);
  }
}

// ---------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------

function pathAB(svg, withArrow = true) {
  drawTransition(svg, "isochor", {
    v: VA, pFrom: PA, pTo: PB,
    color: C_ISOCHOR, withArrow,
  });
}
function pathBC(svg, withArrow = true) {
  drawTransition(svg, "isobar", {
    p: PB, vFrom: VB, vTo: VC,
    color: C_ISOBAR, withArrow,
  });
}
function pathCD(svg, withArrow = true) {
  drawTransition(svg, "isotherm", {
    v0: VC, p0: PC,
    vFrom: VC, vTo: VD,
    color: C_ISOTHERM, withArrow,
  });
}
function pathDE(svg, withArrow = true) {
  drawTransition(svg, "adiabatic", {
    v0: VD, p0: PD, gamma: GAMMA,
    vFrom: VD, vTo: VE,
    color: C_ADIABATIC, withArrow,
  });
}
function pathAE(svg, withArrow = true) {
  drawTransition(svg, "isobar", {
    p: PA, vFrom: VA, vTo: VE,
    color: C_DIRECT, withArrow,
    dashed: false,
  });
}

// ---------------------------------------------------------------------
// Chapter 1 — Setup and successive states
// ---------------------------------------------------------------------

const chapterSetup = {
  label: "Setup",
  steps: [
    {
      title: "The system — one mole of ideal gas",
      note: `Consider <strong>one mole</strong> of ideal gas with constant C<sub>p</sub> and C<sub>v</sub>. Four quasi-static transformations follow one another: <em>isochoric</em>, <em>isobaric</em>, <em>isothermal</em>, <em>reversible adiabatic</em>. We will travel A → B → C → D → E.`,
      math: [
        "PV = RT \\quad (n = 1)",
        "C_p - C_v = R, \\quad \\gamma = \\dfrac{C_p}{C_v}, \\quad C_v = \\dfrac{R}{\\gamma - 1}",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.3, pressureLevel: 1, heat: "none", T: 1,
          label: "state A : (V_A, P_A, T_A)",
        }));
      },
    },
    {
      title: "State B  —  isochoric: P doubles",
      note: `<strong>A → B</strong> is isochoric: V<sub>B</sub> = V<sub>A</sub>. The pressure doubles: <em>P<sub>B</sub> = 2P<sub>A</sub></em>. Since PV = RT, the temperature also doubles: <em>T<sub>B</sub> = 2T<sub>A</sub></em>.`,
      math: [
        "V_B = V_A, \\quad P_B = 2P_A",
        "T_B = \\dfrac{P_B V_B}{R} = 2T_A",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.3, pressureLevel: 3, heat: "in", T: 2,
          label: "B : V const, T = 2T_A",
        }));
      },
    },
    {
      title: "State C  —  isobaric: V doubles",
      note: `<strong>B → C</strong> is isobaric: P<sub>C</sub> = P<sub>B</sub> = 2P<sub>A</sub>. The volume doubles: V<sub>C</sub> = 2V<sub>A</sub>. The temperature at C is therefore <em>T<sub>C</sub> = 4T<sub>A</sub></em>.`,
      math: [
        "P_C = 2P_A, \\quad V_C = 2V_A",
        "T_C = \\dfrac{P_C V_C}{R} = 4T_A",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B", "C"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.55, pressureLevel: 3, heat: "in", T: 4,
          label: "C : P const, T = 4T_A",
        }));
      },
    },
    {
      title: "State D  —  isothermal: V goes to 3V_A",
      note: `<strong>C → D</strong> is isothermal: T<sub>D</sub> = T<sub>C</sub> = 4T<sub>A</sub>. At fixed T, PV = const, so <em>P<sub>D</sub> = (4/3) P<sub>A</sub></em>.`,
      math: [
        "T_D = 4T_A, \\quad V_D = 3V_A",
        "P_D V_D = R T_D = 4R T_A \\Rightarrow P_D = \\dfrac{4}{3}P_A",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B", "C", "D"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.8, pressureLevel: 2, heat: "in", T: 4,
          label: "D : T = 4T_A, P = 4P_A/3",
        }));
      },
    },
    {
      title: "State E  —  the algebraic trick: P_E = P_A",
      note: `<strong>D → E</strong> is a reversible adiabatic: <em>PV<sup>γ</sup></em> is conserved. The statement sets V<sub>E</sub> = (4/3)<sup>1/γ</sup> V<sub>D</sub>. Substituting, we land on <strong>P<sub>E</sub> = P<sub>A</sub></strong>: surprising — a remarkable coincidence in the choice of data!`,
      math: [
        "P_E V_E^{\\gamma} = P_D V_D^{\\gamma}",
        "P_E = P_D \\!\\left(\\dfrac{V_D}{V_E}\\right)^{\\!\\gamma} = \\dfrac{4}{3}P_A \\cdot \\dfrac{3}{4}",
        "\\boxed{\\,P_E = P_A\\,}",
      ],
      highlightLine: 2,
      whyStep: {
        summary: "Why is (V_D/V_E)^γ = 3/4?",
        body: `We have V<sub>E</sub> = (4/3)<sup>1/γ</sup> V<sub>D</sub>. So V<sub>D</sub>/V<sub>E</sub> = (4/3)<sup>−1/γ</sup>. Raising to the power γ, the exponent becomes −1, so (V<sub>D</sub>/V<sub>E</sub>)<sup>γ</sup> = (4/3)<sup>−1</sup> = 3/4.`,
        math: [
          "\\left(\\dfrac{V_D}{V_E}\\right)^{\\!\\gamma} = \\left[\\!\\left(\\dfrac{4}{3}\\right)^{\\!-1/\\gamma}\\right]^{\\!\\gamma} = \\dfrac{3}{4}",
        ],
      },
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B", "C", "D", "E"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.95, pressureLevel: 1, heat: "none", T: 3.7,
          insulated: true,
          label: "E : P_E = P_A",
        }));
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 2 — A → B isochoric
// ---------------------------------------------------------------------

function diagramAB({ shaded = false } = {}) {
  const svg = baseAxes();
  placePoints(svg, ["A", "B"]);
  pathAB(svg);
  // No shaded area for isochoric (W = 0)
  return svg;
}

const chapterAB = {
  label: "A→B isochoric",
  steps: [
    {
      title: "A → B  —  isochoric: no mechanical work",
      note: `The piston is <em>locked</em>: V does not change, so dV = 0 and <strong>W<sub>AB</sub> = 0</strong>. All the energy received by the gas is heat, which warms the gas and raises its pressure.`,
      math: [
        "W_{AB} = -\\!\\int P\\,dV = 0",
        "\\Delta U_{AB} = C_v(T_B - T_A) = C_v T_A",
        "Q_{AB} = \\Delta U_{AB} - W_{AB} = C_v T_A",
      ],
      figure: () => figureRow(diagramAB(), pistonScene({
        volumeFrac: 0.3, pressureLevel: 3, heat: "in", T: 2,
        label: "V const — Q heats",
      })),
      whyStep: {
        summary: "Why is Q = ΔU here?",
        body: `When W = 0, the first law reduces to <em>Q = ΔU</em>. At constant volume, all the heat received increases the internal energy, hence the temperature.`,
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 3 — B → C isobaric (expansion)
// ---------------------------------------------------------------------

function diagramBC({ shaded = false } = {}) {
  const svg = baseAxes();
  placePoints(svg, ["A", "B", "C"]);
  pathAB(svg, false);
  if (shaded) {
    shadeRectangle(svg, {
      vFrom: VB, vTo: VC,
      pFrom: 0, pTo: PB,
      color: C_ISOBAR,
      opacity: 0.22,
    });
  }
  pathBC(svg);
  return svg;
}

const chapterBC = {
  label: "B→C isobaric (expansion)",
  steps: [
    {
      title: "B → C  —  isobaric, the gas expands",
      note: `At constant pressure <em>P = 2P<sub>A</sub></em>, the volume goes from V<sub>A</sub> to 2V<sub>A</sub>. This is an <strong>expansion</strong>: dV &gt; 0, so the work received by the gas is <em>negative</em> (the gas delivers work to the piston).`,
      math: [
        "W_{BC} = -P_B(V_C - V_B) = -2P_A V_A = -2RT_A",
        "\\Delta U_{BC} = C_v(T_C - T_B) = 2C_v T_A",
        "Q_{BC} = \\Delta U_{BC} - W_{BC} = 2(C_v + R)T_A = 2C_p T_A",
      ],
      highlightLine: 2,
      figure: () => figureRow(diagramBC({ shaded: true }), pistonScene({
        volumeFrac: 0.55, pressureLevel: 3, heat: "in", T: 4,
        label: "P const — expansion",
      })),
      whyStep: {
        summary: "Why is Q_{BC} = 2 C_p T_A?",
        body: `In an isobaric transformation, we have the classic formula <em>Q = nC<sub>p</sub>ΔT</em>. Here, ΔT = T<sub>C</sub> − T<sub>B</sub> = 4T<sub>A</sub> − 2T<sub>A</sub> = 2T<sub>A</sub>. With n = 1 mole: Q<sub>BC</sub> = 2C<sub>p</sub>T<sub>A</sub>. The result also matches C<sub>v</sub> + R = C<sub>p</sub> (Mayer's relation).`,
        math: ["C_p = C_v + R \\quad (\\text{Mayer})"],
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 4 — C → D isothermal (expansion)
// ---------------------------------------------------------------------

function diagramCD({ shaded = false } = {}) {
  const svg = baseAxes();
  placePoints(svg, ["A", "B", "C", "D"]);
  pathAB(svg, false);
  pathBC(svg, false);
  if (shaded) {
    shadeUnderIsotherm(svg, {
      v0: VC, p0: PC,
      vFrom: VC, vTo: VD,
      color: C_ISOTHERM,
      opacity: 0.22,
    });
  }
  pathCD(svg);
  return svg;
}

const chapterCD = {
  label: "C→D isothermal",
  steps: [
    {
      title: "C → D  —  isothermal expansion",
      note: `At constant temperature T = 4T<sub>A</sub>, the volume goes from 2V<sub>A</sub> to 3V<sub>A</sub>. <strong>Isothermal expansion</strong>: ΔU = 0, and the internal energy stays constant. The gas delivers work (W &lt; 0) <em>while absorbing exactly the same amount</em> as heat (Q = −W &gt; 0).`,
      math: [
        "W_{CD} = -\\!\\int_{V_C}^{V_D}\\!\\dfrac{4RT_A}{V}\\,dV = -4RT_A\\,\\ln\\!\\dfrac{3}{2}",
        "\\Delta U_{CD} = 0",
        "Q_{CD} = -W_{CD} = 4RT_A\\,\\ln\\!\\dfrac{3}{2}",
      ],
      figure: () => figureRow(diagramCD({ shaded: true }), pistonScene({
        volumeFrac: 0.8, pressureLevel: 2, heat: "in", T: 4,
        label: "T const — expansion",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 5 — D → E adiabatic
// ---------------------------------------------------------------------

function diagramDE({ shaded = false } = {}) {
  const svg = baseAxes();
  placePoints(svg, ["A", "B", "C", "D", "E"]);
  pathAB(svg, false);
  pathBC(svg, false);
  pathCD(svg, false);
  if (shaded) {
    shadeUnderAdiabatic(svg, {
      v0: VD, p0: PD, gamma: GAMMA,
      vFrom: VD, vTo: VE,
      color: C_ADIABATIC,
      opacity: 0.22,
    });
  }
  pathDE(svg);
  return svg;
}

const chapterDE = {
  label: "D→E adiabatic",
  steps: [
    {
      title: "D → E  —  reversible adiabatic expansion",
      note: `No heat exchange: <strong>Q<sub>DE</sub> = 0</strong>. The piston is thermally insulated. The whole expansion happens <em>at the expense of the internal energy</em> of the gas, which cools down. The first law directly gives W = ΔU.`,
      math: [
        "Q_{DE} = 0",
        "\\Delta U_{DE} = W_{DE} = C_v(T_E - T_D)",
        "T_E = 3\\!\\left(\\dfrac{4}{3}\\right)^{\\!1/\\gamma}\\!T_A < 4T_A",
      ],
      figure: () => figureRow(diagramDE({ shaded: true }), pistonScene({
        volumeFrac: 0.95, pressureLevel: 1, heat: "none", T: 3.7,
        insulated: true,
        label: "Q = 0 — gas cools",
      })),
      whyStep: {
        summary: "Why does the adiabat fall faster than the isotherm?",
        body: `Along an adiabat, P V<sup>γ</sup> = const with γ &gt; 1. The pressure drops more rapidly with V than along an isotherm (P V = const). Geometrically, the adiabat is <strong>steeper</strong>. That is why, leaving D, the purple curve dives quickly and lands on the same horizontal line as A.`,
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 6 — Summary ABCDE
// ---------------------------------------------------------------------

function diagramFullPath({ direct = false } = {}) {
  const svg = baseAxes();
  placePoints(svg, ["A", "B", "C", "D", "E"]);
  pathAB(svg, false);
  pathBC(svg, false);
  pathCD(svg, false);
  pathDE(svg, false);
  if (direct) {
    pathAE(svg, true);
  }
  return svg;
}

const chapterBilan = {
  label: "Summary ABCDE",
  steps: [
    {
      title: "Total change in internal energy",
      note: `<em>U</em> is a state function: ΔU<sub>ABCDE</sub> depends only on T<sub>A</sub> and T<sub>E</sub>. We recover this result by summing the ΔU step by step.`,
      math: [
        "\\Delta U_{ABCDE} = C_v(T_E - T_A)",
        "= C_v T_A\\!\\left[\\,3\\!\\left(\\dfrac{4}{3}\\right)^{\\!1/\\gamma} - 1\\,\\right]",
      ],
      figure: () => diagramFullPath(),
    },
    {
      title: "Total work and heat",
      note: `The total work is negative: overall, the gas <em>expands</em> and delivers work to the surroundings (the expansion CD + expansion DE far outweigh the initial compression, which in fact does not exist — every step except AB increases or preserves V).`,
      math: [
        "W_{ABCDE} = W_{AB} + W_{BC} + W_{CD} + W_{DE}",
        "= -2RT_A - 4RT_A\\,\\ln\\!\\dfrac{3}{2} + C_v(T_E - 4T_A)",
        "Q_{ABCDE} = C_v T_A + 2C_p T_A + 4RT_A\\ln\\!\\dfrac{3}{2}",
      ],
      figure: () => diagramFullPath(),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 7 — Direct comparison AE
// ---------------------------------------------------------------------

const chapterCompare = {
  label: "Direct comparison AE",
  steps: [
    {
      title: "The direct path A → E is isobaric",
      note: `Since P<sub>E</sub> = P<sub>A</sub>, the direct path AE is a <em>horizontal isobar</em> (in red) at pressure P<sub>A</sub>. A simple expansion at low pressure, much shorter than the detour ABCDE.`,
      math: [
        "W_{AE} = -P_A(V_E - V_A) = -R(T_E - T_A)",
        "\\Delta U_{AE} = C_v(T_E - T_A)",
        "Q_{AE} = C_p(T_E - T_A)",
      ],
      figure: () => diagramFullPath({ direct: true }),
    },
    {
      title: "Comparing without computation  —  the area between the two paths",
      note: `On the diagram, the path <strong>ABCDE</strong> runs above the path <strong>AE</strong>. The area <em>between the two</em> represents the difference in work. ABCDE encloses a <em>larger area</em> under the curve, so the gas delivers <strong>more</strong> work along it. In the received convention: <em>W<sub>ABCDE</sub> &lt; W<sub>AE</sub> &lt; 0</em>.`,
      math: [
        "W_{ABCDE} < W_{AE} < 0",
        "\\Delta U_{ABCDE} = \\Delta U_{AE} \\quad (\\text{state function})",
      ],
      highlightLine: 1,
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B", "C", "D", "E"]);
        // Shade the polygon enclosed between ABCDE and AE
        // Sample the curved parts (CD isothermal, DE adiabatic)
        const cdSamples = [];
        const KCD = PC * VC;
        const nCD = 30;
        for (let i = 0; i <= nCD; i++) {
          const v = VC + (VD - VC) * (i / nCD);
          cdSamples.push([v, KCD / v]);
        }
        const deSamples = [];
        const KDE = PD * Math.pow(VD, GAMMA);
        const nDE = 30;
        for (let i = 0; i <= nDE; i++) {
          const v = VD + (VE - VD) * (i / nDE);
          deSamples.push([v, KDE / Math.pow(v, GAMMA)]);
        }
        const polygon = [
          [VA, PA],
          [VB, PB],
          [VC, PC],
          ...cdSamples.slice(1),
          ...deSamples.slice(1),
          [VE, PA],
        ];
        shadePolygon(svg, {
          points: polygon,
          color: C_ADIABATIC,
          opacity: 0.18,
        });
        pathAB(svg, false);
        pathBC(svg, false);
        pathCD(svg, false);
        pathDE(svg, false);
        pathAE(svg, true);
        return svg;
      },
      whyStep: {
        summary: "Why is ΔU the same?",
        body: `<em>U</em> is a state function. Its change between two states does not depend on the path. The paths ABCDE and AE join the <strong>same initial point</strong> A to the <strong>same final point</strong> E — so ΔU<sub>ABCDE</sub> = ΔU<sub>AE</sub>. That is the very signature of a state function, as opposed to <em>W</em> and <em>Q</em>, which depend on the path.`,
        openByDefault: true,
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------

export const exercice2Presentation = {
  chapters: [
    chapterSetup,
    chapterAB,
    chapterBC,
    chapterCD,
    chapterDE,
    chapterBilan,
    chapterCompare,
  ],
};
