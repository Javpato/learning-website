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
    "// Branche A :",
    "*p = *q;   // a = 3",
    "",
    "// Branche B :",
    "p = q;     // p alias de b",
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
      label: "Alias vs copie",
      defaultFigure: (step) => diagram({ stage: step.stage }),
      steps: [
        {
          title: "État initial",
          stage: 1,
          note: `Deux entiers <code>a = 1</code>, <code>b = 3</code> et deux pointeurs <code>p</code>, <code>q</code> qui pointent respectivement sur eux. Question piège : que se passe-t-il si on écrit <code>*p = *q</code> ou <code>p = q</code> ?`,
        },
        {
          title: "Branche A — *p = *q",
          stage: 2,
          note: `<code>*p = *q;</code> signifie : <em>copie la valeur pointée par q (qui vaut 3) dans la variable pointée par p (qui est <code>a</code>)</em>. Résultat : <strong>a passe à 3, mais p continue de pointer sur a.</strong>`,
          subSteps: [
            {
              text: "On déréférence des deux côtés :",
              math: [
                "(\\text{valeur pointée par } p) \\leftarrow (\\text{valeur pointée par } q)",
              ],
            },
            { text: "Les arrangements de pointeurs ne bougent pas." },
          ],
        },
        {
          title: "Branche B — p = q",
          stage: 3,
          note: `<code>p = q;</code> recopie l'<strong>adresse</strong>, pas la valeur. Désormais <code>p</code> pointe sur <code>b</code> (au même titre que <code>q</code>). <code>a</code> n'a pas changé.`,
          subSteps: [
            {
              text: "Pas de déréférencement :",
              math: ["p \\leftarrow q"],
            },
            {
              text: "<em>p</em> et <em>q</em> sont devenus alias l'un de l'autre. Modifier <code>*p</code> modifiera maintenant <code>b</code>, plus <code>a</code>.",
            },
          ],
          whyStep: {
            summary: "Retenir — la nuance qui piège tout le monde",
            body: `<code>*p = *q</code> agit sur les <strong>valeurs</strong>, <code>p = q</code> agit sur les <strong>adresses</strong>. Une étoile fait toute la différence.`,
          },
        },
      ],
    },
  ],
};
