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
  const lineMap = { 1: 8, 2: 9, 3: 1, 4: 2, 5: 3, 6: 4, 7: 9 };
  svg.appendChild(codeBlock({
    x: 10, y: 30, w: 320, h: 340,
    lines: codeLines, highlight: lineMap[stage] ?? -1,
  }));
  return svg;
}

const ROADMAP = {
  question: "Q — L'échange par pointeurs en C",
  stages: ["Init", "Appel", "Déclarer t", "t = *x", "*x = *y", "*y = t", "Retour"],
};

export const echangePointeursPresentation = {
  chapters: [
    {
      label: "Échange par pointeurs (C)",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "État initial",
          stage: 1,
          note: `<code>main</code> a deux entiers : <code>a = 3</code>, <code>b = 7</code>. On veut les échanger sans utiliser de référence (impossible en C pur), donc on passe leurs <strong>adresses</strong>.`,
          roadmap: { ...ROADMAP, current: 0 },
        },
        {
          title: "Appel de echange(&a, &b)",
          stage: 2,
          note: `<code>&a</code> et <code>&b</code> sont les <strong>adresses</strong> de <code>a</code> et <code>b</code>. Elles sont stockées dans les pointeurs <code>x</code> et <code>y</code> du tableau d'activation de <code>echange</code>. Les flèches représentent ce <em>vers où je pointe</em>.`,
          roadmap: { ...ROADMAP, current: 1 },
        },
        {
          title: "Déclaration de t",
          stage: 3,
          note: `<code>int t;</code> alloue une variable locale dans le tableau d'activation de <code>echange</code>. Pas encore de valeur.`,
          roadmap: { ...ROADMAP, current: 2 },
        },
        {
          title: "t = *x;",
          stage: 4,
          note: `<code>*x</code> signifie <em>la valeur de la variable pointée par x</em>, c'est-à-dire <code>a</code>, qui vaut 3. On copie 3 dans <code>t</code>.`,
          roadmap: { ...ROADMAP, current: 3 },
        },
        {
          title: "*x = *y;",
          stage: 5,
          note: `On écrit dans <em>la variable pointée par x</em> (donc <code>a</code> dans <code>main</code>) la valeur de <em>la variable pointée par y</em> (donc 7). <strong><code>a</code> devient 7</strong>.`,
          roadmap: { ...ROADMAP, current: 4 },
        },
        {
          title: "*y = t;",
          stage: 6,
          note: `On écrit 3 (sauvegardé dans <code>t</code>) dans la variable pointée par <code>y</code>, donc <code>b</code>. <strong><code>b</code> devient 3</strong>.`,
          roadmap: { ...ROADMAP, current: 5 },
        },
        {
          title: "Retour à main",
          stage: 7,
          note: `Le tableau d'activation de <code>echange</code> est déplié. <strong>main constate : a = 7, b = 3.</strong> Sans le passage par adresse, la fonction n'aurait eu aucun effet observable depuis <code>main</code>.`,
          roadmap: { ...ROADMAP, current: 6 },
          whyStep: {
            summary: "Référence (C++) ou pointeur (C) ?",
            body: `En C++, une référence est exactement <em>un pointeur dont on a initialisé l'adresse à la création, et qui ne peut pas être NULL</em>. C'est un raccourci syntaxique : pas de <code>*</code> ni de <code>&</code> à l'appel. Tout se passe comme dans cet exo, mais en plus lisible.`,
          },
        },
      ],
    },
  ],
};
