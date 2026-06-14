// Scene data for the animated correction of Exercice 1 — Trois chemins entre A et B.
// Two moles d'un gaz parfait, T_B = T_A, P_B = 3 P_A.
//
// Five chapters: Mise en place, Chemin AMB (isotherme), Chemin ACB
// (isochore + isobare), Chemin ANB (droite), Comparaison finale.

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
// Chapter 1 — Mise en place
// ---------------------------------------------------------------------

const chapterSetup = {
  label: "Planteamiento",
  steps: [
    {
      title: "El diagrama de Clapeyron",
      note: `Se representa la evolución de un gas ideal en un plano donde el <strong>volumen V</strong> figura en abscisas y la <strong>presión P</strong> en ordenadas. Cada <em>estado</em> del gas es un punto; cada <em>transformación</em> es una curva que une dos puntos.`,
      math: [
        "PV = nRT \\quad (\\text{ecuación de los gases ideales})",
        "n = 2 \\Rightarrow PV = 2RT",
      ],
      figure: () => figureRow(emptyDiagram(), pistonOf({
        volumeFrac: 0.6, heat: "none", T: 1, label: "gas ideal",
      })),
    },
    {
      title: "Estado inicial A",
      note: `Se coloca el estado inicial <strong>A</strong>: volumen <em>V<sub>A</sub></em>, presión <em>P<sub>A</sub></em>. La temperatura en A es <em>T<sub>A</sub> = 300 K</em>. Las líneas de puntos marcan las coordenadas en los ejes.`,
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
          volumeFrac: 0.7, heat: "none", T: 1, label: "estado A",
        }));
      },
    },
    {
      title: "Posición de B  —  T_B = T_A entonces PV = cst",
      note: `Como <em>T<sub>B</sub> = T<sub>A</sub></em>, el producto <em>PV</em> se conserva entre A y B (gas ideal: PV ∝ T). De ello se deduce <strong>V<sub>B</sub> = V<sub>A</sub>/3</strong>. A y B se encuentran por tanto en la <strong>misma isoterma</strong> (en línea de puntos).`,
      math: [
        "P_A V_A = P_B V_B = 2RT_A",
        "P_B = 3P_A \\;\\Rightarrow\\; V_B = \\dfrac{V_A}{3}",
        "B = \\left(\\dfrac{V_A}{3},\\; 3P_A\\right)",
      ],
      figure: () => figureRow(baseDiagram({ lightIsotherm: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "none", T: 1,
        label: "B (misma T que en A)",
      })),
      whyStep: {
        summary: "¿Por qué A y B comparten la misma isoterma?",
        body: `Para un gas ideal, la ecuación de estado <em>PV = nRT</em> impone que, a <em>T</em> fija, el producto <em>PV</em> sea constante. Por tanto, el lugar de los puntos (V, P) a temperatura T es una <em>hipérbola equilátera</em> en el plano (V, P). Como T<sub>B</sub> = T<sub>A</sub>, A y B están en la misma hipérbola.`,
        math: ["P\\,V = nRT \\Rightarrow P = \\dfrac{nRT}{V}"],
      },
    },
    {
      title: "Posición de C  —  isócora y luego isóbara",
      note: `El camino <strong>ACB</strong> impone: primero una <em>isócora</em> (V constante), luego una <em>isóbara</em> (P constante). El punto de esquina <strong>C</strong> tiene por tanto el volumen de A y la presión de B.`,
      math: [
        "C = (V_A,\\; 3P_A)",
      ],
      figure: () => figureRow(baseDiagram({ withC: true, lightIsotherm: true }), pistonOf({
        volumeFrac: 0.7, pressureLevel: 3, heat: "in", T: 3,
        label: "C : V_A, 3P_A",
      })),
    },
    {
      title: "Convenio: trabajo y calor recibidos",
      note: `Se adopta el convenio <strong>del físico</strong>: W y Q son las cantidades <em>recibidas</em> por el gas. Para una transformación reversible, el trabajo elemental es <em>δW = −P dV</em>. Una <strong>compresión</strong> (dV &lt; 0) da por tanto <em>W &gt; 0</em>, una <strong>expansión</strong> (dV &gt; 0) da <em>W &lt; 0</em>.`,
      math: [
        "\\Delta U = W + Q",
        "\\delta W = -P\\,dV \\;\\Rightarrow\\; W = -\\!\\int_{V_i}^{V_f}\\! P\\,dV",
      ],
      whyStep: {
        summary: "¿Por qué ΔU = 0 para los tres caminos?",
        body: `La energía interna de un gas ideal <strong>solo depende de la temperatura</strong>. Ahora bien, T<sub>A</sub> = T<sub>B</sub>, por lo que ΔU = 0 sea cual sea el camino seguido. Es una <em>función de estado</em>. Consecuencia: para cada camino, <em>Q = −W</em>.`,
        math: ["\\Delta U = nC_V(T_B - T_A) = 0", "\\Rightarrow Q = -W"],
        openByDefault: true,
      },
      figure: () => figureRow(baseDiagram({ withC: true, lightIsotherm: true }), pistonOf({
        volumeFrac: 0.5, pressureLevel: 2, heat: "none", T: 1,
        label: "convenio recibidos",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 2 — Chemin AMB (isotherme)
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
  label: "Camino AMB (isoterma)",
  steps: [
    {
      title: "El camino isotermo — la hipérbola",
      note: `A lo largo de <strong>AMB</strong>, la temperatura permanece constante en <em>T<sub>A</sub></em>. La ecuación de estado impone <em>PV = 2RT<sub>A</sub></em>: se recorre una <strong>hipérbola equilátera</strong>. M es un punto intermedio cualquiera sobre esta curva.`,
      math: [
        "T = T_A \\Rightarrow PV = 2RT_A",
        "P(V) = \\dfrac{2RT_A}{V}",
      ],
      figure: () => figureRow(diagramAMB(), pistonOf({
        volumeFrac: 0.55, pressureLevel: 2, heat: "out", T: 1,
        label: "compresión isoterma",
      })),
    },
    {
      title: "Cálculo del trabajo recibido — el área bajo la curva",
      note: `El trabajo recibido es <em>W = −∫P dV</em>. El <strong>área coloreada</strong> bajo la hipérbola, entre V<sub>B</sub> y V<sub>A</sub>, representa |W|; como se va de A hacia B (compresión, V decrece), W es <strong>positivo</strong>.`,
      math: [
        "W_{AMB} = -\\!\\int_{V_A}^{V_B}\\! \\dfrac{2RT_A}{V}\\,dV",
        "W_{AMB} = -2RT_A\\,\\ln\\!\\dfrac{V_B}{V_A} = -2RT_A\\,\\ln\\!\\dfrac{1}{3}",
        "\\boxed{\\,W_{AMB} = 2RT_A\\,\\ln 3 \\approx 5{,}49\\ \\text{kJ}\\,}",
      ],
      highlightLine: 2,
      figure: () => figureRow(diagramAMB({ shaded: true }), pistonOf({
        volumeFrac: 0.4, pressureLevel: 3, heat: "out", T: 1,
        label: "área bajo curva = |W|",
      })),
      whyStep: {
        summary: "¿Por qué −∫₁ⁿ dV/V = −ln(V_f / V_i)?",
        body: `Para integrar 1/V, se usa la primitiva <em>ln V</em>. La regla general: <em>∫(dV/V) = ln|V|</em>. Con el límite inferior V<sub>A</sub> y superior V<sub>B</sub> &lt; V<sub>A</sub>:`,
        math: [
          "\\int_{V_A}^{V_B}\\dfrac{dV}{V} = \\ln V_B - \\ln V_A = \\ln\\!\\dfrac{V_B}{V_A}",
          "\\ln\\!\\dfrac{1}{3} = -\\ln 3",
        ],
      },
    },
    {
      title: "Calor recibido — Q = −W",
      note: `Como ΔU = 0 (gas ideal, T constante), el primer principio impone <strong>Q = −W</strong>. El gas recibe <em>trabajo</em> (compresión) y <strong>cede la misma energía en forma de calor</strong> al termostato. En el pistón, las flechas Q salen.`,
      math: [
        "\\Delta U = 0 \\;\\Rightarrow\\; Q_{AMB} = -W_{AMB}",
        "\\boxed{\\,Q_{AMB} = -2RT_A\\,\\ln 3 \\approx -5{,}49\\ \\text{kJ}\\,}",
      ],
      highlightLine: 1,
      figure: () => figureRow(diagramAMB({ shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "out", T: 1,
        label: "calor cedido",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 3 — Chemin ACB (isochore + isobare)
// ---------------------------------------------------------------------

function diagramACB({ stage = "full", shaded = false } = {}) {
  const svg = baseDiagram({ withC: true });
  if (shaded && (stage === "full" || stage === "CB")) {
    // Aire sous le segment CB (isobare à P = 3P_A entre V_B et V_A)
    shadeRectangle(svg, {
      vFrom: VB, vTo: VA,
      pFrom: 0, pTo: PB,
      color: COLOR_ACB,
      opacity: 0.22,
    });
  }
  // A → C  (vertical, isochore)
  if (stage === "AC" || stage === "full" || stage === "CB") {
    drawTransition(svg, "isochor", {
      v: VA, pFrom: PA, pTo: PB,
      color: COLOR_ACB,
      withArrow: stage !== "CB",
    });
  }
  // C → B  (horizontal, isobare)
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
  label: "Camino ACB (isócora + isóbara)",
  steps: [
    {
      title: "Etapa A → C — isócora (V constante)",
      note: `El volumen no cambia: <em>dV = 0</em>, por lo que <strong>W<sub>AC</sub> = 0</strong>. El gas se calienta a volumen constante: presión y temperatura suben juntas. El pistón no se mueve, pero el calor entra.`,
      math: [
        "V = V_A \\Rightarrow dV = 0",
        "W_{AC} = -\\!\\int P\\,dV = 0",
        "Q_{AC} > 0 \\quad (T : T_A \\to 3T_A)",
      ],
      figure: () => figureRow(diagramACB({ stage: "AC" }), pistonOf({
        volumeFrac: 0.7, pressureLevel: 3, heat: "in", T: 3,
        label: "A → C : V cst, T sube",
      })),
    },
    {
      title: "Etapa C → B — isóbara (P constante)",
      note: `A <em>P = 3P<sub>A</sub></em>, el gas se comprime de V<sub>A</sub> a V<sub>A</sub>/3. El trabajo recibido es el área del <strong>rectángulo</strong> bajo la isóbara. Como dV &lt; 0, W es positivo y grande: la presión de compresión es elevada.`,
      math: [
        "W_{CB} = -P_B\\,(V_B - V_C) = -3P_A\\!\\left(\\!\\dfrac{V_A}{3}-V_A\\!\\right)",
        "W_{CB} = 2 P_A V_A = 4 R T_A",
      ],
      highlightLine: 1,
      figure: () => figureRow(diagramACB({ stage: "CB", shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 4, heat: "out", T: 1,
        label: "C → B : P cst, compresión",
      })),
      whyStep: {
        summary: "¿Por qué es tan grande esta área?",
        body: `En el camino ACB, la compresión se realiza a <em>la presión más alta posible</em> entre A y B (P = 3P<sub>A</sub>). Ahora bien, el área bajo la curva es el trabajo. Cuanto más «alto sube» la curva, más ancho es el rectángulo: ACB <strong>maximiza</strong> el trabajo recibido entre los tres caminos.`,
      },
    },
    {
      title: "Balance ACB",
      note: `Se suma: <em>W<sub>ACB</sub> = W<sub>AC</sub> + W<sub>CB</sub></em>. Y como ΔU = 0 sobre la totalidad del camino (T<sub>A</sub> = T<sub>B</sub>), <strong>Q<sub>ACB</sub> = −W<sub>ACB</sub></strong>.`,
      math: [
        "\\boxed{\\,W_{ACB} = 4RT_A \\approx 9{,}98\\ \\text{kJ}\\,}",
        "\\boxed{\\,Q_{ACB} = -4RT_A \\approx -9{,}98\\ \\text{kJ}\\,}",
      ],
      figure: () => figureRow(diagramACB({ stage: "full", shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 4, heat: "out", T: 1,
        label: "balance ACB",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 4 — Chemin ANB (droite)
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
  label: "Camino ANB (recta)",
  steps: [
    {
      title: "Una recta en el plano (V, P)  —  área de un trapecio",
      note: `En el camino <strong>ANB</strong>, la presión varía linealmente con V. El área bajo la curva es un <strong>trapecio</strong>: media de las alturas (P<sub>A</sub> + P<sub>B</sub>)/2 multiplicada por la anchura |V<sub>B</sub> − V<sub>A</sub>|.`,
      math: [
        "\\int_{V_A}^{V_B} P\\,dV = \\dfrac{P_A + P_B}{2}\\,(V_B - V_A)",
        "W_{ANB} = -\\dfrac{P_A + 3P_A}{2}\\!\\left(\\dfrac{V_A}{3} - V_A\\right)",
      ],
      figure: () => figureRow(diagramANB({ shaded: true }), pistonOf({
        volumeFrac: 0.5, pressureLevel: 3, heat: "out", T: 1,
        label: "compresión lineal",
      })),
    },
    {
      title: "Balance ANB",
      note: `El resultado se sitúa <strong>entre</strong> el de la isoterma y el de ACB: es lo esperable, ya que el área del trapecio es intermedia.`,
      math: [
        "\\boxed{\\,W_{ANB} = \\dfrac{8}{3}RT_A \\approx 6{,}66\\ \\text{kJ}\\,}",
        "\\boxed{\\,Q_{ANB} = -\\dfrac{8}{3}RT_A \\approx -6{,}66\\ \\text{kJ}\\,}",
      ],
      figure: () => figureRow(diagramANB({ shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "out", T: 1,
        label: "balance ANB",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 5 — Comparaison finale
// ---------------------------------------------------------------------

function buildLegend() {
  const legend = document.createElement("div");
  legend.className = "thermo-legend";
  legend.innerHTML = `
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-amb"></span>AMB — isoterma</span>
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-anb"></span>ANB — recta</span>
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-acb"></span>ACB — isócora + isóbara</span>
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
  label: "Comparación",
  steps: [
    {
      title: "Los tres caminos superpuestos",
      note: `Se superponen las tres áreas en un solo diagrama. El ojo lee de inmediato: el área <strong>ACB</strong> engloba al área <strong>ANB</strong>, que engloba al área <strong>AMB</strong>. Cuanto más se realiza una compresión a presión elevada, mayor es el trabajo recibido por el gas.`,
      math: [
        "W_{AMB} < W_{ANB} < W_{ACB}",
        "2\\ln 3 \\approx 2{,}20 \\;<\\; \\dfrac{8}{3} \\approx 2{,}67 \\;<\\; 4",
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
      title: "Resumen numérico  —  T_A = 300 K, R = 8,32",
      note: `Para cada camino, <em>Q = −W</em> (porque ΔU = 0). Por tanto, el orden de los calores es el <strong>opuesto</strong> del orden de los trabajos: la transformación que recibe más trabajo es también la que cede más calor.`,
      math: [
        "W_{AMB} \\approx 5{,}49\\ \\text{kJ},\\quad Q_{AMB} \\approx -5{,}49\\ \\text{kJ}",
        "W_{ANB} \\approx 6{,}66\\ \\text{kJ},\\quad Q_{ANB} \\approx -6{,}66\\ \\text{kJ}",
        "W_{ACB} \\approx 9{,}98\\ \\text{kJ},\\quad Q_{ACB} \\approx -9{,}98\\ \\text{kJ}",
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
        summary: "¿Por qué W y Q dependen del camino, pero no ΔU?",
        body: `<em>U</em> es una <strong>función de estado</strong>: su variación entre A y B solo depende de los dos estados inicial y final, no del camino. <em>W</em> y <em>Q</em>, en cambio, son <strong>intercambios</strong> entre el gas y el medio exterior; dependen del desarrollo exacto de la transformación. Esta distinción es central: fundamenta la noción de <em>función de estado</em> en termodinámica.`,
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
