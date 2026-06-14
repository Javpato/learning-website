// Exo 1 — Échange par référence (cm03 p. 11, verbatim).
//
//   void echange(int &a, int &b) {
//     int t = a;
//     a = b;
//     b = t;
//   }
//   int x = 3, y = 7;
//   echange(x, y);

import { memorySvg, frame, arrow, codeBlock } from "./memory.js";

function diagram({ stage }) {
  const svg = memorySvg({ width: 600, height: 380 });

  // Initial values; reflect what each stage has done so far.
  let xVal = 3, yVal = 7;
  if (stage >= 4) xVal = 7;          // a = b  =>  x becomes 7
  if (stage >= 5) yVal = 3;          // b = t  =>  y becomes 3
  const xChanging = stage === 4;
  const yChanging = stage === 5;

  // main frame — always present
  const mainSlots = [
    { label: "int x", value: String(xVal), changing: xChanging,
      highlight: stage === 1 },
    { label: "int y", value: String(yVal), changing: yChanging,
      highlight: stage === 1 },
  ];
  const mainFrame = frame({
    x: 350, y: 220, w: 230,
    title: "main()",
    slots: mainSlots,
    highlight: stage === 1 || stage === 6,
  });
  svg.appendChild(mainFrame);

  // echange frame on stages 2..5
  if (stage >= 2 && stage <= 5) {
    const tValue = stage >= 3 ? "3" : "?";
    const tChanging = stage === 3;
    const fnSlots = [
      { label: "int &a", value: "→ x", highlight: true },
      { label: "int &b", value: "→ y", highlight: true },
      { label: "int t",  value: tValue, changing: tChanging },
    ];
    const fnFrame = frame({
      x: 350, y: 30, w: 230,
      title: "echange(int &a, int &b)",
      slots: fnSlots, highlight: true,
    });
    svg.appendChild(fnFrame);

    // alias arrows from a → x and b → y
    const aPos = fnFrame._slotPositions[0];
    const bPos = fnFrame._slotPositions[1];
    const xPos = mainFrame._slotPositions[0];
    const yPos = mainFrame._slotPositions[1];
    svg.appendChild(arrow({
      from: { x: aPos.leftX, y: aPos.cy },
      to:   { x: xPos.leftX, y: xPos.cy },
      curve: -40,
    }));
    svg.appendChild(arrow({
      from: { x: bPos.leftX, y: bPos.cy },
      to:   { x: yPos.leftX, y: yPos.cy },
      curve: -55,
    }));
  }

  const codeLines = [
    "/** @param[in/out] a, b dos variables enteras. **/",
    "void echange(int &a, int &b) {",
    "  int t = a;",
    "  a = b;",
    "  b = t;",
    "}",
    "",
    "int main() {",
    "  int x = 3, y = 7;",
    "  echange(x, y);",
    "}",
  ];
  const lineMap = { 1: 8, 2: 9, 3: 2, 4: 3, 5: 4, 6: 9 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 320, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "P — ¿Cómo transcurre un intercambio por referencia?",
  stages: ["Init", "Llamada", "t = a", "a = b", "b = t", "Retorno"],
};

export const echangeReferencesPresentation = {
  chapters: [
    {
      label: "Intercambio por referencia",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "Estado inicial en main",
          stage: 1,
          note: `<code>main</code> tiene dos variables locales en su pila: <code>x = 3</code> e <code>y = 7</code>. El objetivo: intercambiarlas para obtener <code>x = 7, y = 3</code>.`,
          roadmap: { ...ROADMAP, current: 0 },
        },
        {
          title: "Llamada a echange(x, y)",
          stage: 2,
          note: `Se apila un nuevo registro de activación para <code>echange</code>. Los parámetros <code>a</code> y <code>b</code> son <strong>referencias</strong>: se convierten en alias de <code>x</code> e <code>y</code>. Las flechas atraviesan los frames.`,
          roadmap: { ...ROADMAP, current: 1 },
        },
        {
          title: "int t = a;",
          stage: 3,
          note: `<code>t</code> es una variable local ordinaria del registro de activación de <code>echange</code>. Recibe el <em>valor</em> apuntado por <code>a</code>, es decir, 3.`,
          roadmap: { ...ROADMAP, current: 2 },
        },
        {
          title: "a = b;",
          stage: 4,
          note: `A través de la referencia <code>a</code>, se escribe en la <code>x</code> de <code>main</code> el valor de <code>b</code> (que es 7 por alias de <code>y</code>). <strong><code>x</code> pasa a ser 7</strong>.`,
          roadmap: { ...ROADMAP, current: 3 },
        },
        {
          title: "b = t;",
          stage: 5,
          note: `Simétricamente, se escribe en la <code>y</code> de <code>main</code> el valor guardado en <code>t</code> (que es 3). <strong><code>y</code> pasa a ser 3</strong>.`,
          roadmap: { ...ROADMAP, current: 4 },
        },
        {
          title: "Retorno a main",
          stage: 6,
          note: `El registro de activación de <code>echange</code> se desapila. <code>main</code> recupera su entorno y comprueba: <strong>x = 7, y = 3</strong>. Los valores se han conservado gracias a las referencias.`,
          roadmap: { ...ROADMAP, current: 5 },
          whyStep: {
            summary: "Por qué la referencia es indispensable aquí",
            body: `Con un paso por valor, <code>a</code> y <code>b</code> serían copias aisladas. Las modificaciones dentro de <code>echange</code> nunca saldrían de su frame. La referencia es lo que hace visible el efecto en <code>main</code>.`,
          },
        },
      ],
    },
  ],
};
