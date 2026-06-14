// Exo 2 — Échange par pointeurs (cm06 p. 11, verbatim).
//
//   void echange(int *x, int *y) {
//     int t;
//     t = *x;
//     *x = *y;
//     *y = t;
//   }
//   int a, b;
//   echange(&a, &b);

import { memorySvg, frame, arrow, codeBlock } from "./memory.js";

function diagram({ stage }) {
  const svg = memorySvg({ width: 600, height: 380 });

  let aVal = 3, bVal = 7;
  if (stage >= 5) aVal = 7;   // *x = *y  =>  a becomes 7
  if (stage >= 6) bVal = 3;   // *y = t   =>  b becomes 3
  const aChanging = stage === 5;
  const bChanging = stage === 6;

  const mainSlots = [
    { label: "int a", value: String(aVal), changing: aChanging, highlight: stage === 1 },
    { label: "int b", value: String(bVal), changing: bChanging, highlight: stage === 1 },
  ];
  const mainFrame = frame({
    x: 350, y: 220, w: 230, title: "main()", slots: mainSlots,
    highlight: stage === 1 || stage === 7,
  });
  svg.appendChild(mainFrame);

  if (stage >= 2 && stage <= 6) {
    const tValue = stage >= 4 ? "3" : "?";
    const tChanging = stage === 4;
    const fnSlots = [
      { label: "int *x", value: "&a", highlight: true },
      { label: "int *y", value: "&b", highlight: true },
      { label: "int t",  value: tValue, changing: tChanging },
    ];
    const fnFrame = frame({
      x: 350, y: 25, w: 230, title: "echange(int *x, int *y)",
      slots: fnSlots, highlight: true,
    });
    svg.appendChild(fnFrame);

    const xPtr = fnFrame._slotPositions[0];
    const yPtr = fnFrame._slotPositions[1];
    const aPos = mainFrame._slotPositions[0];
    const bPos = mainFrame._slotPositions[1];
    // pointer arrows: from the pointer slot to the pointed cell
    svg.appendChild(arrow({
      from: { x: xPtr.leftX, y: xPtr.cy },
      to:   { x: aPos.leftX, y: aPos.cy },
      curve: -40,
    }));
    svg.appendChild(arrow({
      from: { x: yPtr.leftX, y: yPtr.cy },
      to:   { x: bPos.leftX, y: bPos.cy },
      curve: -55,
    }));
  }

  const codeLines = [
    "/** @param[in/out] x, y dos punteros a enteros. **/",
    "void echange(int *x, int *y) {",
    "  int t;",
    "  t = *x;",
    "  *x = *y;",
    "  *y = t;",
    "}",
    "",
    "int main() {",
    "  int a = 3, b = 7;",
    "  echange(&a, &b);",
    "}",
  ];
  const lineMap = { 1: 9, 2: 10, 3: 2, 4: 3, 5: 4, 6: 5, 7: 10 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 320, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "P — El intercambio por punteros en C",
  stages: ["Init", "Llamada", "Declarar t", "t = *x", "*x = *y", "*y = t", "Retorno"],
};

export const echangePointeursPresentation = {
  chapters: [
    {
      label: "Intercambio por punteros (C)",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "Estado inicial",
          stage: 1,
          note: `<code>main</code> tiene dos enteros: <code>a = 3</code>, <code>b = 7</code>. Queremos intercambiarlos sin usar una referencia (imposible en C puro), así que pasamos sus <strong>direcciones</strong>.`,
          roadmap: { ...ROADMAP, current: 0 },
        },
        {
          title: "Llamada a echange(&a, &b)",
          stage: 2,
          note: `<code>&a</code> y <code>&b</code> son las <strong>direcciones</strong> de <code>a</code> y <code>b</code>. Se almacenan en los punteros <code>x</code> e <code>y</code> del registro de activación de <code>echange</code>. Las flechas representan ese <em>hacia dónde apunto</em>.`,
          roadmap: { ...ROADMAP, current: 1 },
        },
        {
          title: "Declaración de t",
          stage: 3,
          note: `<code>int t;</code> reserva una variable local en el registro de activación de <code>echange</code>. Todavía sin valor.`,
          roadmap: { ...ROADMAP, current: 2 },
        },
        {
          title: "t = *x;",
          stage: 4,
          note: `<code>*x</code> significa <em>el valor de la variable apuntada por x</em>, es decir, <code>a</code>, que vale 3. Se copia 3 en <code>t</code>.`,
          roadmap: { ...ROADMAP, current: 3 },
        },
        {
          title: "*x = *y;",
          stage: 5,
          note: `Se escribe en <em>la variable apuntada por x</em> (es decir, <code>a</code> en <code>main</code>) el valor de <em>la variable apuntada por y</em> (es decir, 7). <strong><code>a</code> pasa a ser 7</strong>.`,
          roadmap: { ...ROADMAP, current: 4 },
        },
        {
          title: "*y = t;",
          stage: 6,
          note: `Se escribe 3 (guardado en <code>t</code>) en la variable apuntada por <code>y</code>, es decir, <code>b</code>. <strong><code>b</code> pasa a ser 3</strong>.`,
          roadmap: { ...ROADMAP, current: 5 },
        },
        {
          title: "Retorno a main",
          stage: 7,
          note: `El registro de activación de <code>echange</code> se desapila. <strong>main comprueba: a = 7, b = 3.</strong> Sin el paso por dirección, la función no habría tenido ningún efecto observable desde <code>main</code>.`,
          roadmap: { ...ROADMAP, current: 6 },
          whyStep: {
            summary: "¿Referencia (C++) o puntero (C)?",
            body: `En C++, una referencia es exactamente <em>un puntero cuya dirección se inicializa en la creación y que no puede ser NULL</em>. Es un atajo sintáctico: sin <code>*</code> ni <code>&</code> en la llamada. Todo ocurre como en este ejercicio, pero de forma más legible.`,
          },
        },
      ],
    },
  ],
};
