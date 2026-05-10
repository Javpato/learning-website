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
  label: "Mise en place",
  steps: [
    {
      title: "Le système — une mole de gaz parfait",
      note: `On considère <strong>une mole</strong> de gaz parfait avec C<sub>p</sub> et C<sub>v</sub> constants. Quatre transformations quasistatiques se succèdent : <em>isochore</em>, <em>isobare</em>, <em>isotherme</em>, <em>adiabatique réversible</em>. On va parcourir A → B → C → D → E.`,
      math: [
        "PV = RT \\quad (n = 1)",
        "C_p - C_v = R, \\quad \\gamma = \\dfrac{C_p}{C_v}, \\quad C_v = \\dfrac{R}{\\gamma - 1}",
      ],
      figure: () => {
        const svg = baseAxes();
        placePoints(svg, ["A"]);
        return figureRow(svg, pistonScene({
          volumeFrac: 0.3, pressureLevel: 1, heat: "none", T: 1,
          label: "état A : (V_A, P_A, T_A)",
        }));
      },
    },
    {
      title: "État B  —  isochore : P double",
      note: `<strong>A → B</strong> est une isochore : V<sub>B</sub> = V<sub>A</sub>. La pression double : <em>P<sub>B</sub> = 2P<sub>A</sub></em>. Comme PV = RT, la température double aussi : <em>T<sub>B</sub> = 2T<sub>A</sub></em>.`,
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
      title: "État C  —  isobare : V double",
      note: `<strong>B → C</strong> est une isobare : P<sub>C</sub> = P<sub>B</sub> = 2P<sub>A</sub>. Le volume double : V<sub>C</sub> = 2V<sub>A</sub>. La température en C est donc <em>T<sub>C</sub> = 4T<sub>A</sub></em>.`,
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
      title: "État D  —  isotherme : V passe à 3V_A",
      note: `<strong>C → D</strong> est isotherme : T<sub>D</sub> = T<sub>C</sub> = 4T<sub>A</sub>. À T fixée, PV = cst, donc <em>P<sub>D</sub> = (4/3) P<sub>A</sub></em>.`,
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
      title: "État E  —  l'astuce algébrique : P_E = P_A",
      note: `<strong>D → E</strong> est adiabatique réversible : <em>PV<sup>γ</sup></em> est conservé. L'énoncé fixe V<sub>E</sub> = (4/3)<sup>1/γ</sup> V<sub>D</sub>. En remplaçant, on tombe sur <strong>P<sub>E</sub> = P<sub>A</sub></strong> : surprenant, c'est une coïncidence remarquable du choix des données !`,
      math: [
        "P_E V_E^{\\gamma} = P_D V_D^{\\gamma}",
        "P_E = P_D \\!\\left(\\dfrac{V_D}{V_E}\\right)^{\\!\\gamma} = \\dfrac{4}{3}P_A \\cdot \\dfrac{3}{4}",
        "\\boxed{\\,P_E = P_A\\,}",
      ],
      highlightLine: 2,
      whyStep: {
        summary: "Pourquoi (V_D/V_E)^γ = 3/4 ?",
        body: `On a V<sub>E</sub> = (4/3)<sup>1/γ</sup> V<sub>D</sub>. Donc V<sub>D</sub>/V<sub>E</sub> = (4/3)<sup>−1/γ</sup>. En élevant à la puissance γ, l'exposant devient −1, donc (V<sub>D</sub>/V<sub>E</sub>)<sup>γ</sup> = (4/3)<sup>−1</sup> = 3/4.`,
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
  label: "A→B isochore",
  steps: [
    {
      title: "A → B  —  isochore : aucun travail mécanique",
      note: `Le piston est <em>bloqué</em> : V ne change pas, donc dV = 0 et <strong>W<sub>AB</sub> = 0</strong>. Toute l'énergie reçue par le gaz est de la chaleur, qui chauffe le gaz et fait monter sa pression.`,
      math: [
        "W_{AB} = -\\!\\int P\\,dV = 0",
        "\\Delta U_{AB} = C_v(T_B - T_A) = C_v T_A",
        "Q_{AB} = \\Delta U_{AB} - W_{AB} = C_v T_A",
      ],
      figure: () => figureRow(diagramAB(), pistonScene({
        volumeFrac: 0.3, pressureLevel: 3, heat: "in", T: 2,
        label: "V cst — Q chauffe",
      })),
      whyStep: {
        summary: "Pourquoi Q = ΔU ici ?",
        body: `Quand W = 0, le premier principe se réduit à <em>Q = ΔU</em>. À volume constant, toute la chaleur reçue augmente l'énergie interne, donc la température.`,
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
  label: "B→C isobare (détente)",
  steps: [
    {
      title: "B → C  —  isobare, le gaz se dilate",
      note: `À pression constante <em>P = 2P<sub>A</sub></em>, le volume passe de V<sub>A</sub> à 2V<sub>A</sub>. C'est une <strong>détente</strong> : dV &gt; 0, donc le travail reçu par le gaz est <em>négatif</em> (le gaz fournit du travail au piston).`,
      math: [
        "W_{BC} = -P_B(V_C - V_B) = -2P_A V_A = -2RT_A",
        "\\Delta U_{BC} = C_v(T_C - T_B) = 2C_v T_A",
        "Q_{BC} = \\Delta U_{BC} - W_{BC} = 2(C_v + R)T_A = 2C_p T_A",
      ],
      highlightLine: 2,
      figure: () => figureRow(diagramBC({ shaded: true }), pistonScene({
        volumeFrac: 0.55, pressureLevel: 3, heat: "in", T: 4,
        label: "P cst — détente",
      })),
      whyStep: {
        summary: "Pourquoi Q_{BC} = 2 C_p T_A ?",
        body: `En isobare, on a la formule classique <em>Q = nC<sub>p</sub>ΔT</em>. Ici, ΔT = T<sub>C</sub> − T<sub>B</sub> = 4T<sub>A</sub> − 2T<sub>A</sub> = 2T<sub>A</sub>. Avec n = 1 mole : Q<sub>BC</sub> = 2C<sub>p</sub>T<sub>A</sub>. Le résultat correspond aussi à C<sub>v</sub> + R = C<sub>p</sub> (relation de Mayer).`,
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
  label: "C→D isotherme",
  steps: [
    {
      title: "C → D  —  détente isotherme",
      note: `À température constante T = 4T<sub>A</sub>, le volume passe de 2V<sub>A</sub> à 3V<sub>A</sub>. <strong>Détente isotherme</strong> : ΔU = 0, et l'énergie interne reste constante. Le gaz fournit du travail (W &lt; 0) <em>en absorbant exactement la même quantité</em> sous forme de chaleur (Q = −W &gt; 0).`,
      math: [
        "W_{CD} = -\\!\\int_{V_C}^{V_D}\\!\\dfrac{4RT_A}{V}\\,dV = -4RT_A\\,\\ln\\!\\dfrac{3}{2}",
        "\\Delta U_{CD} = 0",
        "Q_{CD} = -W_{CD} = 4RT_A\\,\\ln\\!\\dfrac{3}{2}",
      ],
      figure: () => figureRow(diagramCD({ shaded: true }), pistonScene({
        volumeFrac: 0.8, pressureLevel: 2, heat: "in", T: 4,
        label: "T cst — détente",
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
  label: "D→E adiabatique",
  steps: [
    {
      title: "D → E  —  détente adiabatique réversible",
      note: `Pas d'échange de chaleur : <strong>Q<sub>DE</sub> = 0</strong>. Le piston est isolé thermiquement. Toute la détente se fait <em>au prix de l'énergie interne</em> du gaz, qui se refroidit. Le premier principe donne directement W = ΔU.`,
      math: [
        "Q_{DE} = 0",
        "\\Delta U_{DE} = W_{DE} = C_v(T_E - T_D)",
        "T_E = 3\\!\\left(\\dfrac{4}{3}\\right)^{\\!1/\\gamma}\\!T_A < 4T_A",
      ],
      figure: () => figureRow(diagramDE({ shaded: true }), pistonScene({
        volumeFrac: 0.95, pressureLevel: 1, heat: "none", T: 3.7,
        insulated: true,
        label: "Q = 0 — gaz refroidit",
      })),
      whyStep: {
        summary: "Pourquoi l'adiabatique descend plus vite que l'isotherme ?",
        body: `Sur une adiabatique, P V<sup>γ</sup> = cst avec γ &gt; 1. La pression chute plus rapidement avec V que sur une isotherme (P V = cst). Géométriquement, l'adiabatique est <strong>plus pentue</strong>. C'est pour cela qu'à la sortie de D, la courbe pourpre s'enfonce vite et arrive sur la même horizontale que A.`,
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
  label: "Bilan ABCDE",
  steps: [
    {
      title: "Variation totale d'énergie interne",
      note: `<em>U</em> est une fonction d'état : ΔU<sub>ABCDE</sub> ne dépend que de T<sub>A</sub> et T<sub>E</sub>. On retrouve ce résultat en sommant les ΔU étape par étape.`,
      math: [
        "\\Delta U_{ABCDE} = C_v(T_E - T_A)",
        "= C_v T_A\\!\\left[\\,3\\!\\left(\\dfrac{4}{3}\\right)^{\\!1/\\gamma} - 1\\,\\right]",
      ],
      figure: () => diagramFullPath(),
    },
    {
      title: "Travail et chaleur totaux",
      note: `Le travail total est négatif : globalement, le gaz <em>se détend</em> et fournit du travail au milieu extérieur (la détente CD + détente DE l'emportent largement sur la compression initiale, qui n'existe d'ailleurs pas — toutes les étapes sauf AB augmentent ou conservent V).`,
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
  label: "Comparaison directe AE",
  steps: [
    {
      title: "Le chemin direct A → E est isobare",
      note: `Comme P<sub>E</sub> = P<sub>A</sub>, le chemin direct AE est une <em>isobare horizontale</em> (en rouge) à la pression P<sub>A</sub>. Une simple détente à pression basse, beaucoup plus courte que le détour ABCDE.`,
      math: [
        "W_{AE} = -P_A(V_E - V_A) = -R(T_E - T_A)",
        "\\Delta U_{AE} = C_v(T_E - T_A)",
        "Q_{AE} = C_p(T_E - T_A)",
      ],
      figure: () => diagramFullPath({ direct: true }),
    },
    {
      title: "Comparer sans calcul  —  l'aire entre les deux chemins",
      note: `Sur le diagramme, le chemin <strong>ABCDE</strong> passe au-dessus du chemin <strong>AE</strong>. L'aire <em>entre les deux</em> représente l'écart de travail. ABCDE englobe une <em>plus grande aire</em> sous la courbe, donc le gaz y fournit <strong>plus</strong> de travail. En convention reçue : <em>W<sub>ABCDE</sub> &lt; W<sub>AE</sub> &lt; 0</em>.`,
      math: [
        "W_{ABCDE} < W_{AE} < 0",
        "\\Delta U_{ABCDE} = \\Delta U_{AE} \\quad (\\text{fonction d'état})",
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
        summary: "Pourquoi ΔU est-il le même ?",
        body: `<em>U</em> est une fonction d'état. Sa variation entre deux états ne dépend pas du chemin. Les chemins ABCDE et AE relient le <strong>même point initial</strong> A au <strong>même point final</strong> E — donc ΔU<sub>ABCDE</sub> = ΔU<sub>AE</sub>. C'est la signature même d'une fonction d'état, par opposition à <em>W</em> et <em>Q</em>, qui dépendent du chemin.`,
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
