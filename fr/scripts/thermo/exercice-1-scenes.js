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
  label: "Mise en place",
  steps: [
    {
      title: "Le diagramme de Clapeyron",
      note: `On représente l'évolution d'un gaz parfait dans un plan où le <strong>volume V</strong> figure en abscisse et la <strong>pression P</strong> en ordonnée. Chaque <em>état</em> du gaz est un point ; chaque <em>transformation</em> est une courbe reliant deux points.`,
      math: [
        "PV = nRT \\quad (\\text{équation des gaz parfaits})",
        "n = 2 \\Rightarrow PV = 2RT",
      ],
      figure: () => figureRow(emptyDiagram(), pistonOf({
        volumeFrac: 0.6, heat: "none", T: 1, label: "gaz parfait",
      })),
    },
    {
      title: "État initial A",
      note: `On place l'état initial <strong>A</strong> : volume <em>V<sub>A</sub></em>, pression <em>P<sub>A</sub></em>. La température en A est <em>T<sub>A</sub> = 300 K</em>. Les pointillés marquent les coordonnées sur les axes.`,
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
          volumeFrac: 0.7, heat: "none", T: 1, label: "état A",
        }));
      },
    },
    {
      title: "Position de B  —  T_B = T_A donc PV = cst",
      note: `Comme <em>T<sub>B</sub> = T<sub>A</sub></em>, le produit <em>PV</em> est conservé entre A et B (gaz parfait : PV ∝ T). On en tire <strong>V<sub>B</sub> = V<sub>A</sub>/3</strong>. A et B se trouvent donc sur la <strong>même isotherme</strong> (en pointillés).`,
      math: [
        "P_A V_A = P_B V_B = 2RT_A",
        "P_B = 3P_A \\;\\Rightarrow\\; V_B = \\dfrac{V_A}{3}",
        "B = \\left(\\dfrac{V_A}{3},\\; 3P_A\\right)",
      ],
      figure: () => figureRow(baseDiagram({ lightIsotherm: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "none", T: 1,
        label: "B (même T qu'en A)",
      })),
      whyStep: {
        summary: "Pourquoi A et B partagent-ils la même isotherme ?",
        body: `Pour un gaz parfait, l'équation d'état <em>PV = nRT</em> impose qu'à <em>T</em> fixée, le produit <em>PV</em> soit constant. Donc le lieu des points (V, P) à température T est une <em>hyperbole équilatère</em> dans le plan (V, P). Comme T<sub>B</sub> = T<sub>A</sub>, A et B sont sur la même hyperbole.`,
        math: ["P\\,V = nRT \\Rightarrow P = \\dfrac{nRT}{V}"],
      },
    },
    {
      title: "Position de C  —  isochore puis isobare",
      note: `Le chemin <strong>ACB</strong> impose : d'abord une <em>isochore</em> (V constant), puis une <em>isobare</em> (P constante). Le point d'angle <strong>C</strong> a donc le volume de A et la pression de B.`,
      math: [
        "C = (V_A,\\; 3P_A)",
      ],
      figure: () => figureRow(baseDiagram({ withC: true, lightIsotherm: true }), pistonOf({
        volumeFrac: 0.7, pressureLevel: 3, heat: "in", T: 3,
        label: "C : V_A, 3P_A",
      })),
    },
    {
      title: "Convention : travail et chaleur reçus",
      note: `On adopte la convention <strong>physicienne</strong> : W et Q sont les quantités <em>reçues</em> par le gaz. Pour une transformation réversible, le travail élémentaire est <em>δW = −P dV</em>. Une <strong>compression</strong> (dV &lt; 0) donne donc <em>W &gt; 0</em>, une <strong>détente</strong> (dV &gt; 0) donne <em>W &lt; 0</em>.`,
      math: [
        "\\Delta U = W + Q",
        "\\delta W = -P\\,dV \\;\\Rightarrow\\; W = -\\!\\int_{V_i}^{V_f}\\! P\\,dV",
      ],
      whyStep: {
        summary: "Pourquoi ΔU = 0 pour les trois chemins ?",
        body: `L'énergie interne d'un gaz parfait <strong>ne dépend que de la température</strong>. Or T<sub>A</sub> = T<sub>B</sub>, donc ΔU = 0 quel que soit le chemin suivi. C'est une <em>fonction d'état</em>. Conséquence : pour chaque chemin, <em>Q = −W</em>.`,
        math: ["\\Delta U = nC_V(T_B - T_A) = 0", "\\Rightarrow Q = -W"],
        openByDefault: true,
      },
      figure: () => figureRow(baseDiagram({ withC: true, lightIsotherm: true }), pistonOf({
        volumeFrac: 0.5, pressureLevel: 2, heat: "none", T: 1,
        label: "convention reçus",
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
  label: "Chemin AMB (isotherme)",
  steps: [
    {
      title: "Le chemin isotherme — l'hyperbole",
      note: `Le long de <strong>AMB</strong>, la température reste constante à <em>T<sub>A</sub></em>. L'équation d'état impose <em>PV = 2RT<sub>A</sub></em> : on parcourt une <strong>hyperbole équilatère</strong>. M est un point intermédiaire quelconque sur cette courbe.`,
      math: [
        "T = T_A \\Rightarrow PV = 2RT_A",
        "P(V) = \\dfrac{2RT_A}{V}",
      ],
      figure: () => figureRow(diagramAMB(), pistonOf({
        volumeFrac: 0.55, pressureLevel: 2, heat: "out", T: 1,
        label: "compression isotherme",
      })),
    },
    {
      title: "Calcul du travail reçu — l'aire sous la courbe",
      note: `Le travail reçu est <em>W = −∫P dV</em>. L'<strong>aire colorée</strong> sous l'hyperbole, entre V<sub>B</sub> et V<sub>A</sub>, représente |W| ; comme on va de A vers B (compression, V décroît), W est <strong>positif</strong>.`,
      math: [
        "W_{AMB} = -\\!\\int_{V_A}^{V_B}\\! \\dfrac{2RT_A}{V}\\,dV",
        "W_{AMB} = -2RT_A\\,\\ln\\!\\dfrac{V_B}{V_A} = -2RT_A\\,\\ln\\!\\dfrac{1}{3}",
        "\\boxed{\\,W_{AMB} = 2RT_A\\,\\ln 3 \\approx 5{,}49\\ \\text{kJ}\\,}",
      ],
      highlightLine: 2,
      figure: () => figureRow(diagramAMB({ shaded: true }), pistonOf({
        volumeFrac: 0.4, pressureLevel: 3, heat: "out", T: 1,
        label: "aire sous courbe = |W|",
      })),
      whyStep: {
        summary: "Pourquoi −∫₁ⁿ dV/V = −ln(V_f / V_i) ?",
        body: `Pour intégrer 1/V, on utilise la primitive <em>ln V</em>. La règle générale : <em>∫(dV/V) = ln|V|</em>. Avec la borne inférieure V<sub>A</sub> et supérieure V<sub>B</sub> &lt; V<sub>A</sub> :`,
        math: [
          "\\int_{V_A}^{V_B}\\dfrac{dV}{V} = \\ln V_B - \\ln V_A = \\ln\\!\\dfrac{V_B}{V_A}",
          "\\ln\\!\\dfrac{1}{3} = -\\ln 3",
        ],
      },
    },
    {
      title: "Chaleur reçue — Q = −W",
      note: `Comme ΔU = 0 (gaz parfait, T constante), le premier principe impose <strong>Q = −W</strong>. Le gaz reçoit du <em>travail</em> (compression) et <strong>cède la même énergie sous forme de chaleur</strong> au thermostat. Sur le piston, les flèches Q sortent.`,
      math: [
        "\\Delta U = 0 \\;\\Rightarrow\\; Q_{AMB} = -W_{AMB}",
        "\\boxed{\\,Q_{AMB} = -2RT_A\\,\\ln 3 \\approx -5{,}49\\ \\text{kJ}\\,}",
      ],
      highlightLine: 1,
      figure: () => figureRow(diagramAMB({ shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "out", T: 1,
        label: "chaleur cédée",
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
  label: "Chemin ACB (isochore + isobare)",
  steps: [
    {
      title: "Étape A → C — isochore (V constant)",
      note: `Le volume ne change pas : <em>dV = 0</em>, donc <strong>W<sub>AC</sub> = 0</strong>. Le gaz est chauffé à volume constant : pression et température montent ensemble. Le piston ne bouge pas, mais la chaleur entre.`,
      math: [
        "V = V_A \\Rightarrow dV = 0",
        "W_{AC} = -\\!\\int P\\,dV = 0",
        "Q_{AC} > 0 \\quad (T : T_A \\to 3T_A)",
      ],
      figure: () => figureRow(diagramACB({ stage: "AC" }), pistonOf({
        volumeFrac: 0.7, pressureLevel: 3, heat: "in", T: 3,
        label: "A → C : V cst, T monte",
      })),
    },
    {
      title: "Étape C → B — isobare (P constant)",
      note: `À <em>P = 3P<sub>A</sub></em>, le gaz se comprime de V<sub>A</sub> à V<sub>A</sub>/3. Le travail reçu est l'aire du <strong>rectangle</strong> sous l'isobare. Comme dV &lt; 0, W est positif et grand : la pression de compression est élevée.`,
      math: [
        "W_{CB} = -P_B\\,(V_B - V_C) = -3P_A\\!\\left(\\!\\dfrac{V_A}{3}-V_A\\!\\right)",
        "W_{CB} = 2 P_A V_A = 4 R T_A",
      ],
      highlightLine: 1,
      figure: () => figureRow(diagramACB({ stage: "CB", shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 4, heat: "out", T: 1,
        label: "C → B : P cst, compression",
      })),
      whyStep: {
        summary: "Pourquoi cette aire est-elle si grande ?",
        body: `Sur le chemin ACB, la compression se fait à <em>la pression la plus haute possible</em> entre A et B (P = 3P<sub>A</sub>). Or l'aire sous la courbe est le travail. Plus la courbe « monte haut », plus le rectangle est large : ACB <strong>maximise</strong> le travail reçu parmi les trois chemins.`,
      },
    },
    {
      title: "Bilan ACB",
      note: `On somme : <em>W<sub>ACB</sub> = W<sub>AC</sub> + W<sub>CB</sub></em>. Et comme ΔU = 0 sur l'ensemble du chemin (T<sub>A</sub> = T<sub>B</sub>), <strong>Q<sub>ACB</sub> = −W<sub>ACB</sub></strong>.`,
      math: [
        "\\boxed{\\,W_{ACB} = 4RT_A \\approx 9{,}98\\ \\text{kJ}\\,}",
        "\\boxed{\\,Q_{ACB} = -4RT_A \\approx -9{,}98\\ \\text{kJ}\\,}",
      ],
      figure: () => figureRow(diagramACB({ stage: "full", shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 4, heat: "out", T: 1,
        label: "bilan ACB",
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
  label: "Chemin ANB (droite)",
  steps: [
    {
      title: "Une droite dans le plan (V, P)  —  aire d'un trapèze",
      note: `Sur le chemin <strong>ANB</strong>, la pression varie linéairement avec V. L'aire sous la courbe est un <strong>trapèze</strong> : moyenne des hauteurs (P<sub>A</sub> + P<sub>B</sub>)/2 multipliée par la largeur |V<sub>B</sub> − V<sub>A</sub>|.`,
      math: [
        "\\int_{V_A}^{V_B} P\\,dV = \\dfrac{P_A + P_B}{2}\\,(V_B - V_A)",
        "W_{ANB} = -\\dfrac{P_A + 3P_A}{2}\\!\\left(\\dfrac{V_A}{3} - V_A\\right)",
      ],
      figure: () => figureRow(diagramANB({ shaded: true }), pistonOf({
        volumeFrac: 0.5, pressureLevel: 3, heat: "out", T: 1,
        label: "compression linéaire",
      })),
    },
    {
      title: "Bilan ANB",
      note: `Le résultat se situe <strong>entre</strong> celui de l'isotherme et celui d'ACB : on s'y attend, car l'aire du trapèze est intermédiaire.`,
      math: [
        "\\boxed{\\,W_{ANB} = \\dfrac{8}{3}RT_A \\approx 6{,}66\\ \\text{kJ}\\,}",
        "\\boxed{\\,Q_{ANB} = -\\dfrac{8}{3}RT_A \\approx -6{,}66\\ \\text{kJ}\\,}",
      ],
      figure: () => figureRow(diagramANB({ shaded: true }), pistonOf({
        volumeFrac: 0.35, pressureLevel: 3, heat: "out", T: 1,
        label: "bilan ANB",
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
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-amb"></span>AMB — isotherme</span>
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-anb"></span>ANB — droite</span>
    <span class="thermo-legend-item"><span class="thermo-legend-swatch thermo-legend-acb"></span>ACB — isochore + isobare</span>
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
  label: "Comparaison",
  steps: [
    {
      title: "Les trois chemins superposés",
      note: `On superpose les trois aires sur un seul diagramme. L'œil lit immédiatement : l'aire <strong>ACB</strong> englobe l'aire <strong>ANB</strong>, qui englobe l'aire <strong>AMB</strong>. Plus une compression se fait à pression élevée, plus le travail reçu par le gaz est grand.`,
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
      title: "Récapitulatif numérique  —  T_A = 300 K, R = 8,32",
      note: `Pour chaque chemin, <em>Q = −W</em> (car ΔU = 0). Donc l'ordre des chaleurs est l'<strong>opposé</strong> de l'ordre des travaux : la transformation qui reçoit le plus de travail est aussi celle qui cède le plus de chaleur.`,
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
        summary: "Pourquoi W et Q dépendent du chemin, mais pas ΔU ?",
        body: `<em>U</em> est une <strong>fonction d'état</strong> : sa variation entre A et B ne dépend que des deux états initial et final, pas du chemin. <em>W</em> et <em>Q</em>, eux, sont des <strong>échanges</strong> entre le gaz et le milieu extérieur ; ils dépendent du déroulé exact de la transformation. Cette distinction est centrale : elle fonde la notion de <em>fonction d'état</em> en thermodynamique.`,
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
