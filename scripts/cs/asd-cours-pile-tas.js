// Cours animé — Pile, Tas et Pointeurs.
// Three chapters following cm03 (références), cm05 (tableaux), cm06 (pointeurs).
// Each chapter is a list of steps consumed by scripts/shared/animator.js.

import {
  memorySvg, frame, heapBlock, arrow, regionLabel, codeBlock, nullMark,
} from "./memory.js";

// Helper: assemble a complete diagram and return an SVG node.
const diagram = (builder) => () => builder();

// ----- Chapter 1 — La pile d'appels -----------------------------------

function chapter1Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Stack (memory)", kind: "pile" }));

  // main frame — always present in this chapter
  const mainSlots = [
    { label: "int a", value: stage >= 2 ? "0" : "" },
    { label: "int b", value: stage >= 2 ? "0" : "" },
  ];
  // Step 4 modifies main's a via the reference; step 5+ keeps the change.
  if (stage === 4 || stage === 5) {
    mainSlots[0].value = "7";
    mainSlots[0].changing = true;
  } else if (stage >= 6) {
    mainSlots[0].value = "7";
  }
  const mainFrame = frame({
    x: 320, y: 200, w: 220,
    title: "main()",
    slots: mainSlots,
    highlight: stage === 1 || stage === 5,
  });
  svg.appendChild(mainFrame);

  // P frame appears on stages 3, 4 — and as a reference variant on 6
  if (stage === 3 || stage === 4 || stage === 6) {
    const isRef = stage === 6;
    const pSlots = [
      isRef
        ? { label: "int &a", value: "→ main::a", highlight: true }
        : { label: "int a (copy)", value: stage === 4 ? "1" : "0", changing: stage === 4 },
    ];
    const pFrame = frame({
      x: 320, y: 110, w: 220,
      title: isRef ? "P(int &a)" : "P(int a)",
      slots: pSlots,
      highlight: true,
    });
    svg.appendChild(pFrame);

    // For the reference case, draw an alias arrow back to main::a
    if (isRef) {
      const aPos = mainFrame._slotPositions[0];
      const refPos = pFrame._slotPositions[0];
      svg.appendChild(arrow({
        from: { x: refPos.leftX, y: refPos.cy },
        to:   { x: aPos.leftX, y: aPos.cy },
        curve: -40,
      }));
    }
  }

  // Code listing on the left
  const codeLines = [
    "void P(int a) {",
    "  a = a + 1;",
    "}",
    "",
    "int main() {",
    "  int a = 0, b = 0;",
    "  P(a);",
    "  // a is still 0",
    "}",
  ];
  // Highlight: which line is currently executing
  const lineMap = { 1: -1, 2: 5, 3: 6, 4: 1, 5: 7, 6: 6 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 290, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));

  return svg;
}

const chapter1 = {
  label: "Ch. 1 — The call stack",
  defaultFigure: (step) => chapter1Diagram({ stage: step.stage }),
  steps: [
    {
      title: "The activation record",
      stage: 1,
      note: `Each function call creates an <strong>activation record</strong> on the stack. Here, the program starts: <code>main()</code> has its slot reserved, but its variables are not yet initialized.`,
      roadmap: {
        question: "How does a function call unfold?",
        stages: ["Push", "Initialization", "Execution", "Pop"],
        current: 0,
      },
    },
    {
      title: "Initializing the local variables",
      stage: 2,
      note: `<code>int a = 0; int b = 0;</code> — two slots are allocated in the activation record of <code>main</code> and initialized. These variables live <strong>on the stack</strong>; their lifetime is that of the function.`,
      roadmap: {
        question: "How does a function call unfold?",
        stages: ["Push", "Initialization", "Execution", "Pop"],
        current: 1,
      },
    },
    {
      title: "Calling P(a) — pass by value",
      stage: 3,
      note: `On the call <code>P(a)</code>, a <strong>new activation record</strong> is pushed. The value of <code>a</code> is <em>copied</em> into the formal parameter: this is pass by value.`,
      roadmap: {
        question: "How does a function call unfold?",
        stages: ["Push", "Initialization", "Execution", "Pop"],
        current: 0,
      },
    },
    {
      title: "Execution in P — modifying the copy",
      stage: 4,
      note: `<code>a = a + 1;</code> modifies the <strong>formal parameter</strong> in <code>P</code>'s record. <code>main</code>'s <code>a</code> is untouched: they occupy two distinct slots.`,
      roadmap: {
        question: "How does a function call unfold?",
        stages: ["Push", "Initialization", "Execution", "Pop"],
        current: 2,
      },
    },
    {
      title: "Return — popping the block",
      stage: 5,
      note: `At the end of <code>P</code>, its activation record is <strong>popped</strong>. We come back to the environment of <code>main</code>. With pass by value, <code>main</code>'s <code>a</code> is still 0.`,
      roadmap: {
        question: "How does a function call unfold?",
        stages: ["Push", "Initialization", "Execution", "Pop"],
        current: 3,
      },
    },
    {
      title: "And with a reference?",
      stage: 6,
      note: `If <code>P</code> receives <code>int &a</code>, the formal parameter <strong>does not receive a copy</strong> — it becomes an <em>alias</em> of the variable in <code>main</code>. The arrow crosses the activation records: modifying <code>a</code> in <code>P</code> modifies <code>main</code>'s <code>a</code>.`,
      whyStep: {
        summary: "Refresher — why is this useful?",
        body: `References let a function modify the caller's variables <em>without copying large structures</em>. It is the modern C++ equivalent of passing by pointer (which we will see in exercise 2).`,
      },
    },
  ],
};

// ----- Chapter 2 — Le tas (allocation dynamique) ----------------------

function chapter2Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Stack", kind: "pile" }));
  svg.appendChild(regionLabel({ x: 320, y: 210, w: 220, label: "Heap", kind: "tas" }));

  // Pointer slot on the pile (in main)
  const pPointing = stage >= 2 && stage <= 4;
  const pNull     = stage === 5;
  const pSlots = [
    { label: "int *p", value: pPointing ? "0x7f.." : (pNull ? "nullptr" : "?") },
  ];
  const mainFrame = frame({ x: 320, y: 35, w: 220, title: "main()", slots: pSlots });
  svg.appendChild(mainFrame);

  // Heap blocks
  if (stage >= 2 && stage !== 4 && stage !== 5) {
    const cell = heapBlock({ x: 360, y: 250, value: "42", addr: "0x7f.." });
    svg.appendChild(cell);
    svg.appendChild(arrow({
      from: { x: mainFrame._slotPositions[0].rightX, y: mainFrame._slotPositions[0].cy },
      to:   { x: cell._leftX, y: cell._cy },
      curve: 0,
    }));
  }
  if (stage === 3) {
    // Multiple new calls — show a couple of extra unrelated blocks
    svg.appendChild(heapBlock({ x: 460, y: 250, value: "17", addr: "0x9a.." }));
    svg.appendChild(heapBlock({ x: 360, y: 295, value: "3.14", addr: "0xa1.." }));
  }
  if (stage === 4) {
    // Dangling pointer — block freed, arrow into nothing
    svg.appendChild(arrow({
      from: { x: mainFrame._slotPositions[0].rightX, y: mainFrame._slotPositions[0].cy },
      to:   { x: 400, y: 265 },
      dashed: true, dim: true,
    }));
    svg.appendChild(nullMark({ x: 380, y: 252 }));
  }

  const codeLines = [
    "int *p;",
    "p = new int(42);",
    "// new int(17);",
    "// new double(3.14);",
    "delete p;",
    "p = nullptr;",
  ];
  const lineMap = { 1: 0, 2: 1, 3: 3, 4: 4, 5: 5 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 290, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const chapter2 = {
  label: "Ch. 2 — The heap",
  defaultFigure: (step) => chapter2Diagram({ stage: step.stage }),
  steps: [
    {
      title: "Stack vs heap",
      stage: 1,
      note: `Two distinct regions: the <strong>stack</strong> holds the activation records (lifetime = scope). The <strong>heap</strong> is for dynamic allocations (explicit lifetime, managed with <code>new</code> / <code>delete</code>).`,
    },
    {
      title: "Allocation: new int(42)",
      stage: 2,
      note: `<code>p = new int(42);</code> — an integer cell containing 42 is allocated on the <strong>heap</strong>. The address of that cell is stored in <code>p</code>, which lives on the stack.`,
    },
    {
      title: "Several allocations",
      stage: 3,
      note: `Each call to <code>new</code> may place the cell anywhere in the heap — the locations are <strong>not contiguous</strong>. That is the big difference with an array, which is contiguous.`,
    },
    {
      title: "delete p — deallocation",
      stage: 4,
      note: `<code>delete p;</code> frees the pointed-to cell. <strong>The pointer is not modified</strong>: it now points to an invalid area (<em>dangling pointer</em>). Dereferencing it after <code>delete</code> has unpredictable effects.`,
      whyStep: {
        summary: "Why this is dangerous",
        body: `As long as the pointer has not been set to <code>nullptr</code>, there is no way to tell a valid pointer from a freed one. It is a classic source of bugs (use-after-free).`,
      },
    },
    {
      title: "p = nullptr — defensive reset",
      stage: 5,
      note: `<code>p = nullptr;</code> makes the pointer explicitly invalid. We can now test <code>if (p == nullptr)</code> before using it, and the clearing is unambiguous.`,
    },
  ],
};

// ----- Chapter 3 — Tableaux et adresses (cm05 p. 50) ------------------

function chapter3Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Stack", kind: "pile" }));

  // Array T[5] in main
  const tSlots = [];
  for (let i = 0; i < 5; i++) {
    tSlots.push({
      label: `T[${i}]`,
      value: stage >= 2 ? String([3, 7, 1, 9, 4][i]) : "?",
      highlight: stage === 2 && i === 2,
    });
  }
  const mainFrame = frame({
    x: 320, y: 35, w: 220,
    title: "main()",
    slots: tSlots,
  });
  svg.appendChild(mainFrame);

  if (stage === 2) {
    // Show address arithmetic note as a small overlay arrow
    const t0 = mainFrame._slotPositions[0];
    const t2 = mainFrame._slotPositions[2];
    svg.appendChild(arrow({
      from: { x: t0.leftX - 12, y: t0.cy },
      to:   { x: t2.leftX - 12, y: t2.cy },
      curve: -20, dashed: true,
    }));
  }

  if (stage === 3) {
    // affichTab frame above main — parameter is a pointer to T[0]
    const fnSlots = [
      { label: "int *t", value: "→ T[0]", highlight: true },
    ];
    const fnFrame = frame({
      x: 320, y: -10, w: 220,
      title: "affichTab(int t[])",
      slots: fnSlots,
      highlight: true,
    });
    // shift down so it doesn't overlap main; redo without negative y
    fnFrame.setAttribute("transform", "translate(0, 0)");
    // Instead, put it at y=240 (below main)
    svg.appendChild(frame({
      x: 320, y: 240, w: 220,
      title: "affichTab(int t[])",
      slots: fnSlots, highlight: true,
    }));
    // Arrow from t to T[0]
    const t0Pos = mainFrame._slotPositions[0];
    svg.appendChild(arrow({
      from: { x: 405, y: 280 },
      to:   { x: t0Pos.leftX, y: t0Pos.cy },
      curve: -60,
    }));
  }

  const codeLines = [
    "int T[5] = {3, 7, 1, 9, 4};",
    "// &T[i] = &T[0] + i * sizeof(int)",
    "",
    "void affichTab(int t[]) {",
    "  // t receives the address of T[0]",
    "}",
    "affichTab(T);",
  ];
  const lineMap = { 1: 0, 2: 1, 3: 6 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 290, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const chapter3 = {
  label: "Ch. 3 — Arrays",
  defaultFigure: (step) => chapter3Diagram({ stage: step.stage }),
  steps: [
    {
      title: "An array in contiguous memory",
      stage: 1,
      note: `To store an array <code>int T[5]</code>, the compiler reserves <strong>5 consecutive slots</strong> on the stack (inside the function's activation record).`,
    },
    {
      title: "Address computation",
      stage: 2,
      note: `Accessing <code>T[i]</code> is instantaneous: <code>Address(T[i]) = Address(T[0]) + i × sizeof(int)</code>. No need to walk through the array — just a simple address computation.`,
      math: ["\\text{Address}(T[i]) = \\text{Address}(T[0]) + i \\cdot \\texttt{sizeof(int)}"],
    },
    {
      title: "Pointer decay",
      stage: 3,
      note: `When we pass <code>T</code> to a function, the array <strong>turns into a pointer</strong> to its first element. So the function does not receive a copy — it can modify the elements of the caller's array.`,
      whyStep: {
        summary: "Practical consequence",
        body: `<code>sizeof(t)</code> inside <code>affichTab</code> does <strong>not</strong> give the size of the original array, but that of a pointer. That is why the size is almost always passed as a second argument.`,
      },
    },
  ],
};

export const coursPileTas = {
  chapters: [chapter1, chapter2, chapter3],
};
