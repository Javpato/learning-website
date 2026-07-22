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
    "// Branch A:",
    "*p = *q;   // a = 3",
    "",
    "// Branch B:",
    "p = q;     // p aliases b",
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
      label: "Alias vs copy",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "Initial state",
          stage: 1,
          note: `Two integers <code>a = 1</code>, <code>b = 3</code> and two pointers <code>p</code>, <code>q</code> pointing to them respectively. Trick question: what happens if we write <code>*p = *q</code> or <code>p = q</code>?`,
        },
        {
          title: "Branch A — *p = *q",
          stage: 2,
          note: `<code>*p = *q;</code> means: <em>copy the value pointed to by q (which is 3) into the variable pointed to by p (which is <code>a</code>)</em>. Result: <strong>a becomes 3, but p keeps pointing to a.</strong>`,
          subSteps: [
            {
              text: "We dereference on both sides:",
              math: [
                "(\\text{value pointed to by } p) \\leftarrow (\\text{value pointed to by } q)",
              ],
            },
            { text: "The pointer arrangements do not move." },
          ],
        },
        {
          title: "Branch B — p = q",
          stage: 3,
          note: `<code>p = q;</code> copies the <strong>address</strong>, not the value. From now on <code>p</code> points to <code>b</code> (just like <code>q</code>). <code>a</code> has not changed.`,
          subSteps: [
            {
              text: "No dereferencing:",
              math: ["p \\leftarrow q"],
            },
            {
              text: "<em>p</em> and <em>q</em> have become aliases of each other. Modifying <code>*p</code> will now modify <code>b</code>, no longer <code>a</code>.",
            },
          ],
          whyStep: {
            summary: "Remember — the subtlety that trips everyone up",
            body: `<code>*p = *q</code> acts on <strong>values</strong>, <code>p = q</code> acts on <strong>addresses</strong>. One star makes all the difference.`,
          },
        },
      ],
    },
  ],
};
