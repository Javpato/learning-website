// Exo 5 — Somme récursive d'un tableau.
//
//   int somme(int t[], int n) {
//     if (n == 0) return 0;
//     return t[n - 1] + somme(t, n - 1);
//   }
//   int T[4] = {5, 2, 7, 3};
//   int s = somme(T, 4);
//
// Visualizes:
//   - The array T living in main's frame
//   - Each recursive call shares the SAME array (pointer decay)
//   - Stack grows then unwinds, summing 3 + 7 + 2 + 5 = 17

import { memorySvg, frame, arrow, codeBlock } from "./memory.js";

const VALUES = [5, 2, 7, 3];

function diagram({ stage }) {
  const svg = memorySvg({ width: 700, height: 460 });

  // The array T in main's frame, drawn horizontally for clarity.
  // We render main first (top), with T as 4 inline slots.
  const mainY = 30;
  const mainW = 320;
  const mainX = 360;

  // Build a custom main frame with horizontal array layout
  // (using regular frame() expects vertical slots — so we hand-build).
  const mainSReturn = stage >= 10 ? "17" : "?";

  const mainFrame = frame({
    x: mainX, y: mainY, w: mainW,
    title: "main()  —  int T[4] = {5,2,7,3}",
    slots: [
      { label: "int s", value: mainSReturn, changing: stage === 10 },
    ],
    highlight: stage === 1 || stage === 10,
  });
  svg.appendChild(mainFrame);

  // Determine which array indices are "in play" for the current top frame.
  // At stage 2 (somme(T,4)): looking at index 3 (t[n-1] = t[3] = 3)
  // At stage 3 (somme(T,3)): index 2 → 7
  // At stage 4 (somme(T,2)): index 1 → 2
  // At stage 5 (somme(T,1)): index 0 → 5
  // At stage 6 (somme(T,0)): base case — no index
  // Stages 7+ are unwinding
  let activeIdx = -1;
  if (stage >= 2 && stage <= 5) activeIdx = 5 - stage; // 3,2,1,0
  // Build the array row
  const slotW = 60;
  const arrayY = mainY + 80;
  VALUES.forEach((v, i) => {
    const sx = mainX + 20 + i * (slotW + 4);
    const isActive = i === activeIdx;
    const g = svg.ownerDocument
      ? svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g")
      : null;
    // Use frame's slot rendering by hand
    const cellG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const cls = "mem-slot" + (isActive ? " highlight" : "");
    cellG.setAttribute("class", cls);
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", sx);
    rect.setAttribute("y", arrayY);
    rect.setAttribute("width", slotW);
    rect.setAttribute("height", 28);
    rect.setAttribute("rx", 4);
    rect.setAttribute("ry", 4);
    rect.setAttribute("class", "mem-slot-box");
    cellG.appendChild(rect);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", sx + slotW / 2);
    text.setAttribute("y", arrayY + 19);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "mem-slot-value");
    text.textContent = String(v);
    cellG.appendChild(text);
    const idxText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    idxText.setAttribute("x", sx + slotW / 2);
    idxText.setAttribute("y", arrayY - 5);
    idxText.setAttribute("text-anchor", "middle");
    idxText.setAttribute("class", "mem-slot-label");
    idxText.textContent = `T[${i}]`;
    cellG.appendChild(idxText);
    svg.appendChild(cellG);
  });

  // Stack of somme frames below main
  // We track frame returns:
  //  stage 6: somme(T,0) returns 0
  //  stage 7: somme(T,1) returns 5 + 0 = 5
  //  stage 8: somme(T,2) returns 2 + 5 = 7
  //  stage 9: somme(T,3) returns 7 + 7 = 14
  //  stage 10: somme(T,4) returns 3 + 14 = 17
  const callDepth = {
    1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
    7: 4, 8: 3, 9: 2, 10: 1,
  };
  const returnsByN = { 0: "0", 1: "5", 2: "7", 3: "14", 4: "17" };

  const stackTop = arrayY + 50;
  const frameH = 62;
  const onStack = []; // list of {n, status}
  if (stage >= 2 && stage <= 6) {
    // Descent: push frames 4,3,2,1,(0)
    const ns = [4, 3, 2, 1, 0];
    const count = callDepth[stage]; // 1..5
    for (let i = 0; i < count; i++) {
      const n = ns[i];
      let status;
      if (i === count - 1 && stage <= 5) {
        // top frame, descent
        status = n === 0 ? "= 0 (base case)" : `= t[${n - 1}] + somme(t, ${n - 1})`;
      } else if (stage === 6 && i === 4) {
        status = "= 0 (base case)";
      } else {
        status = `waiting`;
      }
      onStack.push({ n, status });
    }
  } else if (stage >= 7 && stage <= 9) {
    // Unwinding: stack is shrinking
    // stage 7: depths 4..1, top is n=1 returning 5
    // stage 8: depths 4..2, top is n=2 returning 7
    // stage 9: depths 4..3, top is n=3 returning 14
    const topN = stage - 6; // 1,2,3
    const ns = [4, 3, 2, 1].filter((n) => n >= topN);
    ns.forEach((n) => {
      let status;
      if (n === topN) {
        const prev = topN - 1;
        status = `= t[${topN - 1}] + ${returnsByN[prev]} → ${returnsByN[n]}`;
      } else {
        status = "waiting";
      }
      onStack.push({ n, status });
    });
  } else if (stage === 10) {
    // Top-most fold-up
    onStack.push({ n: 4, status: `= t[3] + ${returnsByN[3]} → ${returnsByN[4]}` });
  }

  onStack.forEach((f, i) => {
    const fY = stackTop + i * frameH;
    const fr = frame({
      x: mainX, y: fY, w: mainW,
      title: `somme(t, n=${f.n})`,
      slots: [{ label: "return", value: f.status, changing: f.status.includes("→") }],
      highlight: i === onStack.length - 1,
    });
    svg.appendChild(fr);

    // Pointer arrow from this frame's `t` (implicit) to T[0] in main —
    // drawn as a small dashed arrow from the frame header to the array start.
    if (i === onStack.length - 1) {
      svg.appendChild(arrow({
        from: { x: mainX, y: fY + 12 },
        to:   { x: mainX + 20, y: arrayY + 14 },
        dashed: true, dim: true,
      }));
    }
  });

  const codeLines = [
    "/** @param[in] t array of integers.",
    " *  @param[in] n number of elements to sum. **/",
    "int somme(int t[], int n) {",
    "  if (n == 0) return 0;",
    "  return t[n-1] + somme(t, n-1);",
    "}",
    "",
    "int T[4] = {5, 2, 7, 3};",
    "int s = somme(T, 4);",
  ];
  const lineMap = {
    1: 8, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3,
    7: 4, 8: 4, 9: 4, 10: 8,
  };
  svg.appendChild(codeBlock({
    x: 20, y: 30, w: 320, h: 420,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "Recursive sum: winding down, then unwinding",
  stages: ["Winding down", "Base case", "Unwinding"],
};
const rm = (stage) => {
  if (stage <= 5) return { ...ROADMAP, current: 0 };
  if (stage === 6) return { ...ROADMAP, current: 1 };
  return { ...ROADMAP, current: 2 };
};

export const sommePresentation = {
  chapters: [
    {
      label: "Recursive sum of an array",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "main: the array T",
          stage: 1,
          note: `The array <code>T = {5, 2, 7, 3}</code> lives on the stack in the activation record of <code>main</code>. <code>s</code> is not yet initialized.`,
          roadmap: rm(1),
        },
        {
          title: "somme(T, 4) — pushed",
          stage: 2,
          note: `The array <code>T</code> is passed by <strong>pointer decay</strong>: the function receives the address of <code>T[0]</code>, not a copy. The test <code>n == 0</code> is false, so we evaluate <code>t[3] + somme(t, 3)</code>.`,
          roadmap: rm(2),
        },
        {
          title: "somme(t, 3)",
          stage: 3,
          note: `A new frame, <code>n = 3</code>. The pointer <code>t</code> still refers to the same array in <code>main</code> — there is no copy of the array for each call.`,
          roadmap: rm(3),
        },
        {
          title: "somme(t, 2)",
          stage: 4,
          note: `Still above the base case. The stack keeps growing.`,
          roadmap: rm(4),
        },
        {
          title: "somme(t, 1)",
          stage: 5,
          note: `<code>n = 1</code>, so we evaluate <code>t[0] + somme(t, 0)</code>. <code>t[0]</code> is 5 — the value in <code>main</code>'s array, seen through the pointer.`,
          roadmap: rm(5),
        },
        {
          title: "somme(t, 0) — base case",
          stage: 6,
          note: `<code>n == 0</code>: we return <strong>0</strong>. The descent stops.`,
          roadmap: rm(6),
        },
        {
          title: "Unwinding: somme(t, 1) = 5 + 0",
          stage: 7,
          note: `<code>somme(t, 1)</code> resumes its computation: <code>t[0] + 0 = 5 + 0 = 5</code> and returns.`,
          roadmap: rm(7),
        },
        {
          title: "somme(t, 2) = 2 + 5 = 7",
          stage: 8,
          note: `Receives 5 from the previous call, adds <code>t[1] = 2</code>. Total: 7.`,
          roadmap: rm(8),
        },
        {
          title: "somme(t, 3) = 7 + 7 = 14",
          stage: 9,
          note: `Receives 7, adds <code>t[2] = 7</code>. Total: 14.`,
          roadmap: rm(9),
        },
        {
          title: "Final return: s = 3 + 14 = 17",
          stage: 10,
          note: `<code>somme(t, 4)</code> adds <code>t[3] = 3</code> to 14. The stack is fully unwound, <strong>main receives s = 17</strong>.`,
          roadmap: rm(10),
          whyStep: {
            summary: "Why the array is not copied on each call",
            body: `In C, passing an array to a function <em>decays</em> into passing a pointer. All the frames share the same array in <code>main</code> — hence the dashed arrow to <code>T[0]</code>.`,
          },
        },
      ],
    },
  ],
};
