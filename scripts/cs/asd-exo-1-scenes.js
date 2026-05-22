// Exo 1 — Échange par référence (cm03 p. 11, verbatim).
//
//   void échange(int &a, int &b) {
//     int t = a;
//     a = b;
//     b = t;
//   }
//   int x = 3, y = 7;
//   échange(x, y);

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

  // échange frame on stages 2..5
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
      title: "échange(int &a, int &b)",
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
    "void échange(int &a, int &b) {",
    "  int t = a;",
    "  a = b;",
    "  b = t;",
    "}",
    "",
    "int main() {",
    "  int x = 3, y = 7;",
    "  échange(x, y);",
    "}",
  ];
  const lineMap = { 1: 7, 2: 8, 3: 1, 4: 2, 5: 3, 6: 8 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 320, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "Q — Comment se déroule un échange par référence ?",
  stages: ["Init", "Appel", "t = a", "a = b", "b = t", "Retour"],
};

export const echangeReferencesPresentation = {
  chapters: [
    {
      label: "Échange par référence",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "État initial dans main",
          stage: 1,
          note: `<code>main</code> a deux variables locales sur sa pile : <code>x = 3</code> et <code>y = 7</code>. Le but : les échanger pour obtenir <code>x = 7, y = 3</code>.`,
          roadmap: { ...ROADMAP, current: 0 },
        },
        {
          title: "Appel de échange(x, y)",
          stage: 2,
          note: `Un nouveau tableau d'activation est empilé pour <code>échange</code>. Les paramètres <code>a</code> et <code>b</code> sont des <strong>références</strong> : ils deviennent des alias de <code>x</code> et <code>y</code>. Les flèches traversent les frames.`,
          roadmap: { ...ROADMAP, current: 1 },
        },
        {
          title: "int t = a;",
          stage: 3,
          note: `<code>t</code> est une variable locale ordinaire du tableau d'activation de <code>échange</code>. Elle reçoit la <em>valeur</em> pointée par <code>a</code>, c'est-à-dire 3.`,
          roadmap: { ...ROADMAP, current: 2 },
        },
        {
          title: "a = b;",
          stage: 4,
          note: `À travers la référence <code>a</code>, on écrit dans le <code>x</code> de <code>main</code> la valeur de <code>b</code> (qui est 7 par alias de <code>y</code>). <strong><code>x</code> devient 7</strong>.`,
          roadmap: { ...ROADMAP, current: 3 },
        },
        {
          title: "b = t;",
          stage: 5,
          note: `Symétriquement, on écrit dans le <code>y</code> de <code>main</code> la valeur sauvegardée dans <code>t</code> (qui est 3). <strong><code>y</code> devient 3</strong>.`,
          roadmap: { ...ROADMAP, current: 4 },
        },
        {
          title: "Retour à main",
          stage: 6,
          note: `Le tableau d'activation de <code>échange</code> est déplié. <code>main</code> retrouve son environnement, et constate : <strong>x = 7, y = 3</strong>. Les valeurs ont été persistées grâce aux références.`,
          roadmap: { ...ROADMAP, current: 5 },
          whyStep: {
            summary: "Pourquoi la référence est indispensable ici",
            body: `Avec un passage par valeur, <code>a</code> et <code>b</code> seraient des copies isolées. Les modifications dans <code>échange</code> ne sortiraient jamais de sa frame. La référence est ce qui rend l'effet visible dans <code>main</code>.`,
          },
        },
      ],
    },
  ],
};
