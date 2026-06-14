// Exo 3 — Alias vs copie (cm06 pp. 7–8, verbatim).
//
//   int a = 1, b = 3;
//   int *p = &a, *q = &b;
//   // Branche A : *p = *q;   (copie de la valeur pointée)
//   // Branche B : p = q;     (alias — p désigne la même variable que q)

import { memorySvg, frame, arrow, codeBlock } from "./memory.js";

function diagram({ stage }) {
  const svg = memorySvg({ width: 700, height: 360 });

  // Per-stage state:
  //   1 : initial
  //   2 : after *p = *q (branche A) — a becomes 3, p still points to a
  //   3 : after p = q   (branche B) — a still 1, p now points to b
  let aVal = 1, bVal = 3;
  let pTarget = "a", qTarget = "b";
  let aChanging = false;
  let pChanging = false;

  if (stage === 2) {
    aVal = 3;
    aChanging = true;
  }
  if (stage === 3) {
    pTarget = "b";
    pChanging = true;
  }

  // main frame
  const mainSlots = [
    { label: "int a", value: String(aVal), changing: aChanging },
    { label: "int b", value: String(bVal) },
    { label: "int *p", value: `&${pTarget}`, changing: pChanging },
    { label: "int *q", value: "&b" },
  ];
  const mainFrame = frame({
    x: 360, y: 40, w: 250, title: "main()", slots: mainSlots,
  });
  svg.appendChild(mainFrame);

  // arrows p -> a (or b) and q -> b
  const aPos = mainFrame._slotPositions[0];
  const bPos = mainFrame._slotPositions[1];
  const pPos = mainFrame._slotPositions[2];
  const qPos = mainFrame._slotPositions[3];

  const pTo = pTarget === "a" ? aPos : bPos;
  svg.appendChild(arrow({
    from: { x: pPos.leftX, y: pPos.cy },
    to:   { x: pTo.leftX, y: pTo.cy },
    curve: -65,
  }));
  svg.appendChild(arrow({
    from: { x: qPos.leftX, y: qPos.cy },
    to:   { x: bPos.leftX, y: bPos.cy },
    curve: -50,
  }));

  const codeLines = [
    "int a = 1, b = 3;",
    "int *p = &a, *q = &b;",
    "",
    "// Rama A :",
    "*p = *q;   // a = 3",
    "",
    "// Rama B :",
    "p = q;     // p alias de b",
  ];
  const lineMap = { 1: 1, 2: 4, 3: 7 };
  svg.appendChild(codeBlock({
    x: 20, y: 30, w: 320, h: 320,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

export const aliasPointeursPresentation = {
  chapters: [
    {
      label: "Alias vs copia",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "Estado inicial",
          stage: 1,
          note: `Dos enteros <code>a = 1</code>, <code>b = 3</code> y dos punteros <code>p</code>, <code>q</code> que apuntan respectivamente a ellos. Pregunta trampa: ¿qué ocurre si escribimos <code>*p = *q</code> o <code>p = q</code>?`,
        },
        {
          title: "Rama A — *p = *q",
          stage: 2,
          note: `<code>*p = *q;</code> significa: <em>copia el valor apuntado por q (que vale 3) en la variable apuntada por p (que es <code>a</code>)</em>. Resultado: <strong>a pasa a 3, pero p sigue apuntando a a.</strong>`,
          subSteps: [
            {
              text: "Se desreferencia en ambos lados:",
              math: [
                "(\\text{valor apuntado por } p) \\leftarrow (\\text{valor apuntado por } q)",
              ],
            },
            { text: "Las disposiciones de los punteros no se mueven." },
          ],
        },
        {
          title: "Rama B — p = q",
          stage: 3,
          note: `<code>p = q;</code> copia la <strong>dirección</strong>, no el valor. A partir de ahora <code>p</code> apunta a <code>b</code> (igual que <code>q</code>). <code>a</code> no ha cambiado.`,
          subSteps: [
            {
              text: "Sin desreferenciación:",
              math: ["p \\leftarrow q"],
            },
            {
              text: "<em>p</em> y <em>q</em> se han convertido en alias el uno del otro. Modificar <code>*p</code> modificará ahora <code>b</code>, ya no <code>a</code>.",
            },
          ],
          whyStep: {
            summary: "Recordar — el matiz que engaña a todo el mundo",
            body: `<code>*p = *q</code> actúa sobre los <strong>valores</strong>, <code>p = q</code> actúa sobre las <strong>direcciones</strong>. Un asterisco marca toda la diferencia.`,
          },
        },
      ],
    },
  ],
};
