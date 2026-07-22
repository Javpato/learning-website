// Exo 4 — Factorielle récursive.
// Visualizes the call stack growing then unwinding.
//
//   int factorielle(int n) {
//     if (n <= 1) return 1;
//     return n * factorielle(n - 1);
//   }
//   factorielle(4);

import { memorySvg, frame, codeBlock } from "./memory.js";

// Layout: code on the left, stack growing downward on the right.
// Frames are drawn top-to-bottom in call order.

function diagram({ stage }) {
  const svg = memorySvg({ width: 680, height: 460 });

  // stage 1: main only
  // stage 2: main + fact(4)              n=4, awaiting
  // stage 3: + fact(3)                   n=3
  // stage 4: + fact(2)                   n=2
  // stage 5: + fact(1)                   n=1, returns 1
  // stage 6: fact(1) popped, fact(2) returns 2
  // stage 7: fact(2) popped, fact(3) returns 6
  // stage 8: fact(3) popped, fact(4) returns 24
  // stage 9: fact(4) popped, main has 24

  const layout = [
    { x: 360, w: 280 }, // main
    { x: 360, w: 280 }, // fact(4)
    { x: 360, w: 280 }, // fact(3)
    { x: 360, w: 280 }, // fact(2)
    { x: 360, w: 280 }, // fact(1)
  ];

  // Helper: build a fact frame at row r with given n and return-status
  function factFrame(rowY, n, status) {
    const slots = [
      { label: "int n", value: String(n) },
      { label: "return", value: status, changing: status !== "—" && status !== "?" && status !== "" },
    ];
    return frame({
      x: 360, y: rowY, w: 280,
      title: `factorielle(n=${n})`,
      slots,
      highlight: true,
    });
  }

  const mainY = 30;
  const baseGap = 78;

  // main frame
  const mainReturn = stage >= 9 ? "24" : "?";
  const mainFrame = frame({
    x: 360, y: mainY, w: 280,
    title: "main()",
    slots: [
      { label: "int r", value: mainReturn, changing: stage === 9 },
    ],
    highlight: stage === 1 || stage === 9,
  });
  svg.appendChild(mainFrame);

  // Stack of factorielle frames
  // For stages 2..8, render which frames are still on the stack:
  // Active depth = how deep we currently are. The deepest is the most recent call.
  const onStack = []; // list of {n, status} bottom (oldest) to top (newest)
  if (stage >= 2) onStack.push({ n: 4, status: stage >= 8 ? "= 4 * 6 → 24" : "= 4 * fact(3)" });
  if (stage >= 3) onStack.push({ n: 3, status: stage >= 7 ? "= 3 * 2 → 6" : "= 3 * fact(2)" });
  if (stage >= 4) onStack.push({ n: 2, status: stage >= 6 ? "= 2 * 1 → 2" : "= 2 * fact(1)" });
  if (stage >= 5) onStack.push({ n: 1, status: stage >= 5 ? "= 1" : "?" });

  // On unwinding stages, pop accordingly
  if (stage === 6) onStack.pop();                              // fact(1) gone
  if (stage === 7) { onStack.pop(); onStack.pop(); }            // fact(1), fact(2) gone
  if (stage === 8) { onStack.pop(); onStack.pop(); onStack.pop(); } // only fact(4)
  if (stage >= 9) onStack.length = 0;

  onStack.forEach((f, i) => {
    svg.appendChild(factFrame(mainY + 90 + i * baseGap, f.n, f.status));
  });

  const codeLines = [
    "/** @param[in] n an integer ≥ 0.  @return n! **/",
    "int factorielle(int n) {",
    "  if (n <= 1) return 1;",
    "  return n * factorielle(n - 1);",
    "}",
    "",
    "int r = factorielle(4);",
  ];
  // Which line is "active" for the deepest current frame
  const lineMap = {
    1: 6, 2: 3, 3: 3, 4: 3, 5: 2, 6: 3, 7: 3, 8: 3, 9: 6,
  };
  svg.appendChild(codeBlock({
    x: 20, y: 30, w: 320, h: 420,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "How does the stack evolve during factorielle(4)?",
  stages: ["Winding down", "Base case", "Unwinding"],
};

const stageRoadmap = (stage) => {
  if (stage <= 4) return { ...ROADMAP, current: 0 };
  if (stage === 5) return { ...ROADMAP, current: 1 };
  return { ...ROADMAP, current: 2 };
};

export const factoriellePresentation = {
  chapters: [
    {
      label: "Recursive factorial",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "main calls factorielle(4)",
          stage: 1,
          note: `Before the call: only <code>main</code> is on the stack. Its variable <code>r</code> is not yet initialized.`,
          roadmap: stageRoadmap(1),
        },
        {
          title: "factorielle(4) — pushed",
          stage: 2,
          note: `An activation record for <code>factorielle</code> is pushed with <code>n = 4</code>. The test <code>n ≤ 1</code> is false, so the body evaluates <code>4 * factorielle(3)</code> — we must <strong>call factorielle(3)</strong> before we can multiply.`,
          roadmap: stageRoadmap(2),
        },
        {
          title: "factorielle(3) — pushed",
          stage: 3,
          note: `A new activation record. <code>n = 3</code>. Still <code>n > 1</code>, so we call <code>factorielle(2)</code>. The stack grows.`,
          roadmap: stageRoadmap(3),
        },
        {
          title: "factorielle(2) — pushed",
          stage: 4,
          note: `<code>n = 2</code>, still above the base case. Call to <code>factorielle(1)</code>.`,
          roadmap: stageRoadmap(4),
        },
        {
          title: "factorielle(1) — base case",
          stage: 5,
          note: `<code>n = 1</code>: the test <code>n ≤ 1</code> is true, we <strong>return 1 immediately</strong>. No new call. This is what allows the recursion to terminate.`,
          roadmap: stageRoadmap(5),
          whyStep: {
            summary: "Without a base case, the stack would overflow",
            body: `If the base case were forgotten, <code>factorielle</code> would call itself indefinitely and the stack would grow until a <em>stack overflow</em>. The base case is what stops the descent.`,
          },
        },
        {
          title: "Unwinding: factorielle(2) computes 2 * 1",
          stage: 6,
          note: `<code>factorielle(1)</code> returned 1 and its activation record is popped. <code>factorielle(2)</code> can now finish its expression: <code>2 * 1 = 2</code>, and return.`,
          roadmap: stageRoadmap(6),
        },
        {
          title: "factorielle(3) computes 3 * 2",
          stage: 7,
          note: `Same again: <code>factorielle(2)</code> returned 2. <code>factorielle(3)</code> computes <code>3 * 2 = 6</code> and returns.`,
          roadmap: stageRoadmap(7),
        },
        {
          title: "factorielle(4) computes 4 * 6",
          stage: 8,
          note: `<code>factorielle(4)</code> receives 6 and finishes: <code>4 * 6 = 24</code>.`,
          roadmap: stageRoadmap(8),
        },
        {
          title: "Final return to main",
          stage: 9,
          note: `Everything has been popped. <code>main</code> receives <strong>r = 24</strong>. The stack is back to its initial state.`,
          roadmap: stageRoadmap(9),
        },
      ],
    },
  ],
};
