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
    "/** @param[in/out] a, b two integer variables. **/",
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
  question: "Q — How does a swap by reference unfold?",
  stages: ["Init", "Call", "t = a", "a = b", "b = t", "Return"],
};

export const echangeReferencesPresentation = {
  chapters: [
    {
      label: "Swap by reference",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "Initial state in main",
          stage: 1,
          note: `<code>main</code> has two local variables on its stack: <code>x = 3</code> and <code>y = 7</code>. The goal: swap them to get <code>x = 7, y = 3</code>.`,
          roadmap: { ...ROADMAP, current: 0 },
        },
        {
          title: "Calling echange(x, y)",
          stage: 2,
          note: `A new activation record is pushed for <code>echange</code>. The parameters <code>a</code> and <code>b</code> are <strong>references</strong>: they become aliases of <code>x</code> and <code>y</code>. The arrows cross the frames.`,
          roadmap: { ...ROADMAP, current: 1 },
        },
        {
          title: "int t = a;",
          stage: 3,
          note: `<code>t</code> is an ordinary local variable of the activation record of <code>echange</code>. It receives the <em>value</em> referred to by <code>a</code>, that is, 3.`,
          roadmap: { ...ROADMAP, current: 2 },
        },
        {
          title: "a = b;",
          stage: 4,
          note: `Through the reference <code>a</code>, we write into <code>main</code>'s <code>x</code> the value of <code>b</code> (which is 7 by aliasing <code>y</code>). <strong><code>x</code> becomes 7</strong>.`,
          roadmap: { ...ROADMAP, current: 3 },
        },
        {
          title: "b = t;",
          stage: 5,
          note: `Symmetrically, we write into <code>main</code>'s <code>y</code> the value saved in <code>t</code> (which is 3). <strong><code>y</code> becomes 3</strong>.`,
          roadmap: { ...ROADMAP, current: 4 },
        },
        {
          title: "Return to main",
          stage: 6,
          note: `The activation record of <code>echange</code> is popped. <code>main</code> gets its environment back and observes: <strong>x = 7, y = 3</strong>. The values persisted thanks to the references.`,
          roadmap: { ...ROADMAP, current: 5 },
          whyStep: {
            summary: "Why the reference is essential here",
            body: `With pass by value, <code>a</code> and <code>b</code> would be isolated copies. The modifications inside <code>echange</code> would never leave its frame. The reference is what makes the effect visible in <code>main</code>.`,
          },
        },
      ],
    },
  ],
};
