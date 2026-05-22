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
      { label: "retour", value: status, changing: status !== "—" && status !== "?" && status !== "" },
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
    "int factorielle(int n) {",
    "  if (n <= 1) return 1;",
    "  return n * factorielle(n - 1);",
    "}",
    "",
    "int r = factorielle(4);",
  ];
  // Which line is "active" for the deepest current frame
  const lineMap = {
    1: 5, 2: 2, 3: 2, 4: 2, 5: 1, 6: 2, 7: 2, 8: 2, 9: 5,
  };
  svg.appendChild(codeBlock({
    x: 20, y: 30, w: 320, h: 420,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "Comment évolue la pile pendant factorielle(4) ?",
  stages: ["Descente", "Cas de base", "Remontée"],
};

const stageRoadmap = (stage) => {
  if (stage <= 4) return { ...ROADMAP, current: 0 };
  if (stage === 5) return { ...ROADMAP, current: 1 };
  return { ...ROADMAP, current: 2 };
};

export const factoriellePresentation = {
  chapters: [
    {
      label: "Factorielle récursive",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "main appelle factorielle(4)",
          stage: 1,
          note: `Avant l'appel : seul <code>main</code> est sur la pile. Sa variable <code>r</code> n'est pas encore initialisée.`,
          roadmap: stageRoadmap(1),
        },
        {
          title: "factorielle(4) — empilement",
          stage: 2,
          note: `Un tableau d'activation pour <code>factorielle</code> est empilé avec <code>n = 4</code>. Le test <code>n ≤ 1</code> est faux, donc le corps évalue <code>4 * factorielle(3)</code> — il faut <strong>appeler factorielle(3)</strong> avant de pouvoir multiplier.`,
          roadmap: stageRoadmap(2),
        },
        {
          title: "factorielle(3) — empilement",
          stage: 3,
          note: `Nouveau tableau d'activation. <code>n = 3</code>. Encore <code>n > 1</code>, donc on appelle <code>factorielle(2)</code>. La pile grandit.`,
          roadmap: stageRoadmap(3),
        },
        {
          title: "factorielle(2) — empilement",
          stage: 4,
          note: `<code>n = 2</code>, encore au-dessus du cas de base. Appel de <code>factorielle(1)</code>.`,
          roadmap: stageRoadmap(4),
        },
        {
          title: "factorielle(1) — cas de base",
          stage: 5,
          note: `<code>n = 1</code> : le test <code>n ≤ 1</code> est vrai, on <strong>retourne 1 immédiatement</strong>. Aucun nouvel appel. C'est ce qui permet à la récursion de se terminer.`,
          roadmap: stageRoadmap(5),
          whyStep: {
            summary: "Sans cas de base, la pile déborderait",
            body: `Si le cas de base était oublié, <code>factorielle</code> s'appellerait elle-même indéfiniment et la pile grandirait jusqu'au <em>stack overflow</em>. Le cas de base est ce qui stoppe la descente.`,
          },
        },
        {
          title: "Remontée : factorielle(2) calcule 2 * 1",
          stage: 6,
          note: `<code>factorielle(1)</code> a rendu 1 et son tableau d'activation est déplié. <code>factorielle(2)</code> peut maintenant finir son expression : <code>2 * 1 = 2</code>, et retourner.`,
          roadmap: stageRoadmap(6),
        },
        {
          title: "factorielle(3) calcule 3 * 2",
          stage: 7,
          note: `Idem : <code>factorielle(2)</code> a rendu 2. <code>factorielle(3)</code> calcule <code>3 * 2 = 6</code> et retourne.`,
          roadmap: stageRoadmap(7),
        },
        {
          title: "factorielle(4) calcule 4 * 6",
          stage: 8,
          note: `<code>factorielle(4)</code> reçoit 6 et finit : <code>4 * 6 = 24</code>.`,
          roadmap: stageRoadmap(8),
        },
        {
          title: "Retour final dans main",
          stage: 9,
          note: `Tout est déplié. <code>main</code> reçoit <strong>r = 24</strong>. La pile est revenue à son état initial.`,
          roadmap: stageRoadmap(9),
        },
      ],
    },
  ],
};
