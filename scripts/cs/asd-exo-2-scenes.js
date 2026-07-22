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
    "/** @param[in/out] x, y two pointers to integers. **/",
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
  question: "Q — The swap by pointers in C",
  stages: ["Init", "Call", "Declare t", "t = *x", "*x = *y", "*y = t", "Return"],
};

export const echangePointeursPresentation = {
  chapters: [
    {
      label: "Swap by pointers (C)",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "Initial state",
          stage: 1,
          note: `<code>main</code> has two integers: <code>a = 3</code>, <code>b = 7</code>. We want to swap them without using a reference (impossible in pure C), so we pass their <strong>addresses</strong>.`,
          roadmap: { ...ROADMAP, current: 0 },
        },
        {
          title: "Calling echange(&a, &b)",
          stage: 2,
          note: `<code>&a</code> and <code>&b</code> are the <strong>addresses</strong> of <code>a</code> and <code>b</code>. They are stored in the pointers <code>x</code> and <code>y</code> of the activation record of <code>echange</code>. The arrows represent <em>where I point to</em>.`,
          roadmap: { ...ROADMAP, current: 1 },
        },
        {
          title: "Declaring t",
          stage: 3,
          note: `<code>int t;</code> allocates a local variable in the activation record of <code>echange</code>. No value yet.`,
          roadmap: { ...ROADMAP, current: 2 },
        },
        {
          title: "t = *x;",
          stage: 4,
          note: `<code>*x</code> means <em>the value of the variable pointed to by x</em>, that is, <code>a</code>, which is 3. We copy 3 into <code>t</code>.`,
          roadmap: { ...ROADMAP, current: 3 },
        },
        {
          title: "*x = *y;",
          stage: 5,
          note: `We write into <em>the variable pointed to by x</em> (so <code>a</code> in <code>main</code>) the value of <em>the variable pointed to by y</em> (so 7). <strong><code>a</code> becomes 7</strong>.`,
          roadmap: { ...ROADMAP, current: 4 },
        },
        {
          title: "*y = t;",
          stage: 6,
          note: `We write 3 (saved in <code>t</code>) into the variable pointed to by <code>y</code>, so <code>b</code>. <strong><code>b</code> becomes 3</strong>.`,
          roadmap: { ...ROADMAP, current: 5 },
        },
        {
          title: "Return to main",
          stage: 7,
          note: `The activation record of <code>echange</code> is popped. <strong>main observes: a = 7, b = 3.</strong> Without passing by address, the function would have had no observable effect from <code>main</code>.`,
          roadmap: { ...ROADMAP, current: 6 },
          whyStep: {
            summary: "Reference (C++) or pointer (C)?",
            body: `In C++, a reference is exactly <em>a pointer whose address was initialized at creation, and which cannot be NULL</em>. It is a syntactic shortcut: no <code>*</code> or <code>&</code> at the call site. Everything works as in this exercise, just more readable.`,
          },
        },
      ],
    },
  ],
};
