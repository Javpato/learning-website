// Scene data for the animated correction of Exercice 2 — cycle ABCDE.
// Une mole de gaz parfait, chaleurs molaires Cp et Cv constantes.
//
// A → B  : isochore quasistatique           P_B = 2P_A
// B → C  : isobare  quasistatique           V_C = 2V_A
// C → D  : isotherme quasistatique          V_D = 3V_A
// D → E  : adiabatique réversible           V_E = (4/3)^(1/γ) V_D
//
// On montre P_E = P_A et on compare ABCDE au chemin direct AE.

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
const C_DIRECT = "#f87171";     // red — chemin direct AE

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
// Chapter 1 — Mise en place et états successifs
// ---------------------------------------------------------------------

const chapterSetup = {
  label: "Planteamiento",
  steps: [
    {
      title: "El sistema — un mol de gas ideal",
      note: `Se considera <strong>un mol</strong> de gas ideal con C<sub>p</sub> y C<sub>v</sub> constantes. Cuatro transformaciones cuasiestáticas se suceden: <em>isócora</em>, <em>isóbara</em>, <em>isoterma</em>, <em>adiabática reversible</em>. Se va a recorrer A → B → C → D → E.`,
      math: [
        "PV = RT \\quad (n = 1)",
        "C_p - C_v = R, \\quad \\gamma = \\dfrac{C_p}{C_v}, \\quad C_v = \\dfrac{R}{\\gamma - 1}",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.3, pressureLevel: 1, heat: "none", T: 1,
          label: "estado A : (V_A, P_A, T_A)",
        }));
      },
    },
    {
      title: "Estado B  —  isócora: P se duplica",
      note: `<strong>A → B</strong> es una isócora: V<sub>B</sub> = V<sub>A</sub>. La presión se duplica: <em>P<sub>B</sub> = 2P<sub>A</sub></em>. Como PV = RT, la temperatura también se duplica: <em>T<sub>B</sub> = 2T<sub>A</sub></em>.`,
      math: [
        "V_B = V_A, \\quad P_B = 2P_A",
        "T_B = \\dfrac{P_B V_B}{R} = 2T_A",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.3, pressureLevel: 3, heat: "in", T: 2,
          label: "B : V cst, T = 2T_A",
        }));
      },
    },
    {
      title: "Estado C  —  isóbara: V se duplica",
      note: `<strong>B → C</strong> es una isóbara: P<sub>C</sub> = P<sub>B</sub> = 2P<sub>A</sub>. El volumen se duplica: V<sub>C</sub> = 2V<sub>A</sub>. La temperatura en C es por tanto <em>T<sub>C</sub> = 4T<sub>A</sub></em>.`,
      math: [
        "P_C = 2P_A, \\quad V_C = 2V_A",
        "T_C = \\dfrac{P_C V_C}{R} = 4T_A",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B", "C"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.55, pressureLevel: 3, heat: "in", T: 4,
          label: "C : P cst, T = 4T_A",
        }));
      },
    },
    {
      title: "Estado D  —  isoterma: V pasa a 3V_A",
      note: `<strong>C → D</strong> es isoterma: T<sub>D</sub> = T<sub>C</sub> = 4T<sub>A</sub>. A T fija, PV = cst, por lo que <em>P<sub>D</sub> = (4/3) P<sub>A</sub></em>.`,
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
      title: "Estado E  —  el truco algebraico: P_E = P_A",
      note: `<strong>D → E</strong> es adiabática reversible: <em>PV<sup>γ</sup></em> se conserva. El enunciado fija V<sub>E</sub> = (4/3)<sup>1/γ</sup> V<sub>D</sub>. Al sustituir, se llega a <strong>P<sub>E</sub> = P<sub>A</sub></strong>: sorprendente, ¡es una coincidencia notable de la elección de los datos!`,
      math: [
        "P_E V_E^{\\gamma} = P_D V_D^{\\gamma}",
        "P_E = P_D \\!\\left(\\dfrac{V_D}{V_E}\\right)^{\\!\\gamma} = \\dfrac{4}{3}P_A \\cdot \\dfrac{3}{4}",
        "\\boxed{\\,P_E = P_A\\,}",
      ],
      highlightLine: 2,
      whyStep: {
        summary: "¿Por qué (V_D/V_E)^γ = 3/4?",
        body: `Se tiene V<sub>E</sub> = (4/3)<sup>1/γ</sup> V<sub>D</sub>. Por tanto V<sub>D</sub>/V<sub>E</sub> = (4/3)<sup>−1/γ</sup>. Al elevar a la potencia γ, el exponente pasa a ser −1, por lo que (V<sub>D</sub>/V<sub>E</sub>)<sup>γ</sup> = (4/3)<sup>−1</sup> = 3/4.`,
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
// Chapter 2 — A → B isochore
// ---------------------------------------------------------------------

function diagramAB({ shaded = false } = {}) {
  const svg = baseAxes();
  placePoints(svg, ["A", "B"]);
  pathAB(svg);
  // No shaded area for isochore (W = 0)
  return svg;
}

const chapterAB = {
  label: "A→B isócora",
  steps: [
    {
      title: "A → B  —  isócora: ningún trabajo mecánico",
      note: `El pistón está <em>bloqueado</em>: V no cambia, por lo que dV = 0 y <strong>W<sub>AB</sub> = 0</strong>. Toda la energía recibida por el gas es calor, que calienta el gas y hace subir su presión.`,
      math: [
        "W_{AB} = -\\!\\int P\\,dV = 0",
        "\\Delta U_{AB} = C_v(T_B - T_A) = C_v T_A",
        "Q_{AB} = \\Delta U_{AB} - W_{AB} = C_v T_A",
      ],
      figure: () => figureRow(diagramAB(), pistonScene({
        volumeFrac: 0.3, pressureLevel: 3, heat: "in", T: 2,
        label: "V cst — Q calienta",
      })),
      whyStep: {
        summary: "¿Por qué Q = ΔU aquí?",
        body: `Cuando W = 0, el primer principio se reduce a <em>Q = ΔU</em>. A volumen constante, todo el calor recibido aumenta la energía interna, y por tanto la temperatura.`,
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 3 — B → C isobare (détente)
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
  label: "B→C isóbara (expansión)",
  steps: [
    {
      title: "B → C  —  isóbara, el gas se dilata",
      note: `A presión constante <em>P = 2P<sub>A</sub></em>, el volumen pasa de V<sub>A</sub> a 2V<sub>A</sub>. Es una <strong>expansión</strong>: dV &gt; 0, por lo que el trabajo recibido por el gas es <em>negativo</em> (el gas suministra trabajo al pistón).`,
      math: [
        "W_{BC} = -P_B(V_C - V_B) = -2P_A V_A = -2RT_A",
        "\\Delta U_{BC} = C_v(T_C - T_B) = 2C_v T_A",
        "Q_{BC} = \\Delta U_{BC} - W_{BC} = 2(C_v + R)T_A = 2C_p T_A",
      ],
      highlightLine: 2,
      figure: () => figureRow(diagramBC({ shaded: true }), pistonScene({
        volumeFrac: 0.55, pressureLevel: 3, heat: "in", T: 4,
        label: "P cst — expansión",
      })),
      whyStep: {
        summary: "¿Por qué Q_{BC} = 2 C_p T_A?",
        body: `En isóbara, se tiene la fórmula clásica <em>Q = nC<sub>p</sub>ΔT</em>. Aquí, ΔT = T<sub>C</sub> − T<sub>B</sub> = 4T<sub>A</sub> − 2T<sub>A</sub> = 2T<sub>A</sub>. Con n = 1 mol: Q<sub>BC</sub> = 2C<sub>p</sub>T<sub>A</sub>. El resultado corresponde también a C<sub>v</sub> + R = C<sub>p</sub> (relación de Mayer).`,
        math: ["C_p = C_v + R \\quad (\\text{Mayer})"],
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 4 — C → D isotherme (détente)
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
  label: "C→D isoterma",
  steps: [
    {
      title: "C → D  —  expansión isoterma",
      note: `A temperatura constante T = 4T<sub>A</sub>, el volumen pasa de 2V<sub>A</sub> a 3V<sub>A</sub>. <strong>Expansión isoterma</strong>: ΔU = 0, y la energía interna permanece constante. El gas suministra trabajo (W &lt; 0) <em>absorbiendo exactamente la misma cantidad</em> en forma de calor (Q = −W &gt; 0).`,
      math: [
        "W_{CD} = -\\!\\int_{V_C}^{V_D}\\!\\dfrac{4RT_A}{V}\\,dV = -4RT_A\\,\\ln\\!\\dfrac{3}{2}",
        "\\Delta U_{CD} = 0",
        "Q_{CD} = -W_{CD} = 4RT_A\\,\\ln\\!\\dfrac{3}{2}",
      ],
      figure: () => figureRow(diagramCD({ shaded: true }), pistonScene({
        volumeFrac: 0.8, pressureLevel: 2, heat: "in", T: 4,
        label: "T cst — expansión",
      })),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 5 — D → E adiabatique
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
  label: "D→E adiabática",
  steps: [
    {
      title: "D → E  —  expansión adiabática reversible",
      note: `Sin intercambio de calor: <strong>Q<sub>DE</sub> = 0</strong>. El pistón está aislado térmicamente. Toda la expansión se realiza <em>a costa de la energía interna</em> del gas, que se enfría. El primer principio da directamente W = ΔU.`,
      math: [
        "Q_{DE} = 0",
        "\\Delta U_{DE} = W_{DE} = C_v(T_E - T_D)",
        "T_E = 3\\!\\left(\\dfrac{4}{3}\\right)^{\\!1/\\gamma}\\!T_A < 4T_A",
      ],
      figure: () => figureRow(diagramDE({ shaded: true }), pistonScene({
        volumeFrac: 0.95, pressureLevel: 1, heat: "none", T: 3.7,
        insulated: true,
        label: "Q = 0 — el gas se enfría",
      })),
      whyStep: {
        summary: "¿Por qué la adiabática baja más rápido que la isoterma?",
        body: `En una adiabática, P V<sup>γ</sup> = cst con γ &gt; 1. La presión cae más rápidamente con V que en una isoterma (P V = cst). Geométricamente, la adiabática es <strong>más pronunciada</strong>. Por eso, a la salida de D, la curva morada desciende rápido y llega a la misma horizontal que A.`,
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 6 — Bilan ABCDE
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
  label: "Balance ABCDE",
  steps: [
    {
      title: "Variación total de energía interna",
      note: `<em>U</em> es una función de estado: ΔU<sub>ABCDE</sub> solo depende de T<sub>A</sub> y T<sub>E</sub>. Se recupera este resultado sumando los ΔU etapa por etapa.`,
      math: [
        "\\Delta U_{ABCDE} = C_v(T_E - T_A)",
        "= C_v T_A\\!\\left[\\,3\\!\\left(\\dfrac{4}{3}\\right)^{\\!1/\\gamma} - 1\\,\\right]",
      ],
      figure: () => diagramFullPath(),
    },
    {
      title: "Trabajo y calor totales",
      note: `El trabajo total es negativo: globalmente, el gas <em>se expande</em> y suministra trabajo al medio exterior (la expansión CD + expansión DE pesan ampliamente más que la compresión inicial, que de hecho no existe — todas las etapas salvo AB aumentan o conservan V).`,
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
// Chapter 7 — Comparaison directe AE
// ---------------------------------------------------------------------

const chapterCompare = {
  label: "Comparación directa AE",
  steps: [
    {
      title: "El camino directo A → E es isóbaro",
      note: `Como P<sub>E</sub> = P<sub>A</sub>, el camino directo AE es una <em>isóbara horizontal</em> (en rojo) a la presión P<sub>A</sub>. Una simple expansión a presión baja, mucho más corta que el rodeo ABCDE.`,
      math: [
        "W_{AE} = -P_A(V_E - V_A) = -R(T_E - T_A)",
        "\\Delta U_{AE} = C_v(T_E - T_A)",
        "Q_{AE} = C_p(T_E - T_A)",
      ],
      figure: () => diagramFullPath({ direct: true }),
    },
    {
      title: "Comparar sin calcular  —  el área entre los dos caminos",
      note: `En el diagrama, el camino <strong>ABCDE</strong> pasa por encima del camino <strong>AE</strong>. El área <em>entre ambos</em> representa la diferencia de trabajo. ABCDE engloba una <em>área mayor</em> bajo la curva, por lo que el gas suministra <strong>más</strong> trabajo. En convenio recibido: <em>W<sub>ABCDE</sub> &lt; W<sub>AE</sub> &lt; 0</em>.`,
      math: [
        "W_{ABCDE} < W_{AE} < 0",
        "\\Delta U_{ABCDE} = \\Delta U_{AE} \\quad (\\text{función de estado})",
      ],
      highlightLine: 1,
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A", "B", "C", "D", "E"]);
        // Shade the polygon enclosed between ABCDE and AE
        // Sample the curved parts (CD isotherme, DE adiabatique)
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
        summary: "¿Por qué ΔU es el mismo?",
        body: `<em>U</em> es una función de estado. Su variación entre dos estados no depende del camino. Los caminos ABCDE y AE unen el <strong>mismo punto inicial</strong> A con el <strong>mismo punto final</strong> E — por lo que ΔU<sub>ABCDE</sub> = ΔU<sub>AE</sub>. Es la firma misma de una función de estado, en contraposición a <em>W</em> y <em>Q</em>, que dependen del camino.`,
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
