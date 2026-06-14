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
      { label: "retorno", value: status, changing: status !== "—" && status !== "?" && status !== "" },
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
    "/** @param[in] n un entero ≥ 0.  @return n! **/",
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
  question: "¿Cómo evoluciona la pila durante factorielle(4)?",
  stages: ["Descenso", "Caso base", "Ascenso"],
};

const stageRoadmap = (stage) => {
  if (stage <= 4) return { ...ROADMAP, current: 0 };
  if (stage === 5) return { ...ROADMAP, current: 1 };
  return { ...ROADMAP, current: 2 };
};

export const factoriellePresentation = {
  chapters: [
    {
      label: "Factorial recursivo",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "main llama a factorielle(4)",
          stage: 1,
          note: `Antes de la llamada: solo <code>main</code> está en la pila. Su variable <code>r</code> aún no está inicializada.`,
          roadmap: stageRoadmap(1),
        },
        {
          title: "factorielle(4) — apilamiento",
          stage: 2,
          note: `Se apila un registro de activación para <code>factorielle</code> con <code>n = 4</code>. La prueba <code>n ≤ 1</code> es falsa, así que el cuerpo evalúa <code>4 * factorielle(3)</code>: hay que <strong>llamar a factorielle(3)</strong> antes de poder multiplicar.`,
          roadmap: stageRoadmap(2),
        },
        {
          title: "factorielle(3) — apilamiento",
          stage: 3,
          note: `Nuevo registro de activación. <code>n = 3</code>. Sigue <code>n > 1</code>, así que se llama a <code>factorielle(2)</code>. La pila crece.`,
          roadmap: stageRoadmap(3),
        },
        {
          title: "factorielle(2) — apilamiento",
          stage: 4,
          note: `<code>n = 2</code>, todavía por encima del caso base. Llamada a <code>factorielle(1)</code>.`,
          roadmap: stageRoadmap(4),
        },
        {
          title: "factorielle(1) — caso base",
          stage: 5,
          note: `<code>n = 1</code>: la prueba <code>n ≤ 1</code> es verdadera, se <strong>retorna 1 inmediatamente</strong>. Ninguna nueva llamada. Esto es lo que permite que la recursión termine.`,
          roadmap: stageRoadmap(5),
          whyStep: {
            summary: "Sin caso base, la pila se desbordaría",
            body: `Si se olvidara el caso base, <code>factorielle</code> se llamaría a sí misma indefinidamente y la pila crecería hasta el <em>desbordamiento de pila</em>. El caso base es lo que detiene el descenso.`,
          },
        },
        {
          title: "Ascenso: factorielle(2) calcula 2 * 1",
          stage: 6,
          note: `<code>factorielle(1)</code> devolvió 1 y su registro de activación se desapila. <code>factorielle(2)</code> ya puede terminar su expresión: <code>2 * 1 = 2</code>, y retornar.`,
          roadmap: stageRoadmap(6),
        },
        {
          title: "factorielle(3) calcula 3 * 2",
          stage: 7,
          note: `Igual: <code>factorielle(2)</code> devolvió 2. <code>factorielle(3)</code> calcula <code>3 * 2 = 6</code> y retorna.`,
          roadmap: stageRoadmap(7),
        },
        {
          title: "factorielle(4) calcula 4 * 6",
          stage: 8,
          note: `<code>factorielle(4)</code> recibe 6 y termina: <code>4 * 6 = 24</code>.`,
          roadmap: stageRoadmap(8),
        },
        {
          title: "Retorno final en main",
          stage: 9,
          note: `Todo se ha desapilado. <code>main</code> recibe <strong>r = 24</strong>. La pila ha vuelto a su estado inicial.`,
          roadmap: stageRoadmap(9),
        },
      ],
    },
  ],
};
