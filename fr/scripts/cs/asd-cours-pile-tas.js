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
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Pile (mémoire)", kind: "pile" }));

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
        : { label: "int a (copie)", value: stage === 4 ? "1" : "0", changing: stage === 4 },
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
    "  // a vaut toujours 0",
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
  label: "Chap. 1 — La pile d'appels",
  defaultFigure: (step) => chapter1Diagram({ stage: step.stage }),
  steps: [
    {
      title: "Le tableau d'activation",
      stage: 1,
      note: `Chaque appel de fonction crée un <strong>tableau d'activation</strong> sur la pile. Ici, le programme commence : <code>main()</code> a son emplacement réservé, mais ses variables ne sont pas encore initialisées.`,
      roadmap: {
        question: "Comment se déroule un appel de fonction ?",
        stages: ["Empilement", "Initialisation", "Exécution", "Dépliement"],
        current: 0,
      },
    },
    {
      title: "Initialisation des variables locales",
      stage: 2,
      note: `<code>int a = 0; int b = 0;</code> — deux emplacements sont alloués dans le tableau d'activation de <code>main</code> et initialisés. Ces variables vivent <strong>sur la pile</strong>, leur durée de vie est celle de la fonction.`,
      roadmap: {
        question: "Comment se déroule un appel de fonction ?",
        stages: ["Empilement", "Initialisation", "Exécution", "Dépliement"],
        current: 1,
      },
    },
    {
      title: "Appel de P(a) — passage par valeur",
      stage: 3,
      note: `À l'appel <code>P(a)</code>, un <strong>nouveau tableau d'activation</strong> est empilé. La valeur de <code>a</code> est <em>recopiée</em> dans le paramètre formel : c'est le passage par valeur.`,
      roadmap: {
        question: "Comment se déroule un appel de fonction ?",
        stages: ["Empilement", "Initialisation", "Exécution", "Dépliement"],
        current: 0,
      },
    },
    {
      title: "Exécution dans P — modification de la copie",
      stage: 4,
      note: `<code>a = a + 1;</code> modifie le <strong>paramètre formel</strong> dans le tableau de <code>P</code>. Le <code>a</code> du <code>main</code> n'est pas touché : ils occupent deux emplacements distincts.`,
      roadmap: {
        question: "Comment se déroule un appel de fonction ?",
        stages: ["Empilement", "Initialisation", "Exécution", "Dépliement"],
        current: 2,
      },
    },
    {
      title: "Retour — dépliement du bloc",
      stage: 5,
      note: `À la fin de <code>P</code>, son tableau d'activation est <strong>déplié</strong>. On revient à l'environnement de <code>main</code>. Avec un passage par valeur, le <code>a</code> du <code>main</code> vaut toujours 0.`,
      roadmap: {
        question: "Comment se déroule un appel de fonction ?",
        stages: ["Empilement", "Initialisation", "Exécution", "Dépliement"],
        current: 3,
      },
    },
    {
      title: "Et avec une référence ?",
      stage: 6,
      note: `Si <code>P</code> reçoit <code>int &a</code>, le paramètre formel <strong>ne reçoit pas une copie</strong> — il devient un <em>alias</em> de la variable du <code>main</code>. La flèche traverse les tableaux d'activation : modifier <code>a</code> dans <code>P</code> modifie le <code>a</code> de <code>main</code>.`,
      whyStep: {
        summary: "Rappel — pourquoi c'est utile ?",
        body: `Les références permettent à une fonction de modifier des variables de l'appelant <em>sans copier de grandes structures</em>. C'est l'équivalent C++ moderne du passage par pointeur (qu'on verra à l'exo 2).`,
      },
    },
  ],
};

// ----- Chapter 2 — Le tas (allocation dynamique) ----------------------

function chapter2Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Pile", kind: "pile" }));
  svg.appendChild(regionLabel({ x: 320, y: 210, w: 220, label: "Tas", kind: "tas" }));

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
  label: "Chap. 2 — Le tas",
  defaultFigure: (step) => chapter2Diagram({ stage: step.stage }),
  steps: [
    {
      title: "Pile vs tas",
      stage: 1,
      note: `Deux régions distinctes : la <strong>pile</strong> contient les tableaux d'activation (durée de vie = portée). Le <strong>tas</strong> sert aux allocations dynamiques (durée de vie explicite, gérée par <code>new</code> / <code>delete</code>).`,
    },
    {
      title: "Allocation : new int(42)",
      stage: 2,
      note: `<code>p = new int(42);</code> — une cellule entière contenant 42 est allouée sur le <strong>tas</strong>. L'adresse de cette cellule est rangée dans <code>p</code>, qui vit sur la pile.`,
    },
    {
      title: "Plusieurs allocations",
      stage: 3,
      note: `Chaque appel à <code>new</code> peut placer la cellule n'importe où dans le tas — les emplacements ne sont <strong>pas contigus</strong>. C'est la grande différence avec un tableau, qui est lui contigu.`,
    },
    {
      title: "delete p — libération",
      stage: 4,
      note: `<code>delete p;</code> libère la cellule pointée. <strong>Le pointeur n'est pas modifié</strong> : il pointe désormais vers une zone invalide (<em>dangling pointer</em>). Le déréférencer après <code>delete</code> a un effet imprévisible.`,
      whyStep: {
        summary: "Pourquoi c'est dangereux",
        body: `Tant qu'on n'a pas mis le pointeur à <code>nullptr</code>, on ne peut pas distinguer un pointeur valide d'un pointeur libéré. C'est une source classique de bugs (use-after-free).`,
      },
    },
    {
      title: "p = nullptr — réinitialisation défensive",
      stage: 5,
      note: `<code>p = nullptr;</code> rend le pointeur explicitement invalide. On peut désormais tester <code>if (p == nullptr)</code> avant de l'utiliser, et l'effacement est sans ambiguïté.`,
    },
  ],
};

// ----- Chapter 3 — Tableaux et adresses (cm05 p. 50) ------------------

function chapter3Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Pile", kind: "pile" }));

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
    "  // t reçoit l'adresse de T[0]",
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
  label: "Chap. 3 — Tableaux",
  defaultFigure: (step) => chapter3Diagram({ stage: step.stage }),
  steps: [
    {
      title: "Tableau en mémoire contigüe",
      stage: 1,
      note: `Pour stocker un tableau <code>int T[5]</code>, le compilateur réserve <strong>5 emplacements consécutifs</strong> dans la pile (à l'intérieur du tableau d'activation de la fonction).`,
    },
    {
      title: "Calcul d'adresse",
      stage: 2,
      note: `L'accès <code>T[i]</code> est instantané : <code>Adresse(T[i]) = Adresse(T[0]) + i × sizeof(int)</code>. Pas besoin de parcourir le tableau — un simple calcul d'adresse.`,
      math: ["\\text{Adresse}(T[i]) = \\text{Adresse}(T[0]) + i \\cdot \\texttt{sizeof(int)}"],
    },
    {
      title: "Décroissance en pointeur (decay)",
      stage: 3,
      note: `Quand on passe <code>T</code> à une fonction, le tableau <strong>se transforme en pointeur</strong> vers son premier élément. La fonction ne reçoit donc pas une copie — elle peut modifier les éléments du tableau de l'appelant.`,
      whyStep: {
        summary: "Conséquence pratique",
        body: `<code>sizeof(t)</code> dans <code>affichTab</code> ne donne <strong>pas</strong> la taille du tableau original, mais celle d'un pointeur. C'est pourquoi on passe presque toujours la taille en second argument.`,
      },
    },
  ],
};

export const coursPileTas = {
  chapters: [chapter1, chapter2, chapter3],
};
