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
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Pila (memoria)", kind: "pile" }));

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
        : { label: "int a (copia)", value: stage === 4 ? "1" : "0", changing: stage === 4 },
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
    "  // a sigue valiendo 0",
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
  label: "Cap. 1 — La pila de llamadas",
  defaultFigure: (step) => chapter1Diagram({ stage: step.stage }),
  steps: [
    {
      title: "El registro de activación",
      stage: 1,
      note: `Cada llamada a función crea un <strong>registro de activación</strong> en la pila. Aquí el programa comienza: <code>main()</code> tiene su espacio reservado, pero sus variables aún no están inicializadas.`,
      roadmap: {
        question: "¿Cómo transcurre una llamada a función?",
        stages: ["Apilamiento", "Inicialización", "Ejecución", "Desapilamiento"],
        current: 0,
      },
    },
    {
      title: "Inicialización de las variables locales",
      stage: 2,
      note: `<code>int a = 0; int b = 0;</code> — se reservan dos espacios en el registro de activación de <code>main</code> y se inicializan. Estas variables viven <strong>en la pila</strong>; su tiempo de vida es el de la función.`,
      roadmap: {
        question: "¿Cómo transcurre una llamada a función?",
        stages: ["Apilamiento", "Inicialización", "Ejecución", "Desapilamiento"],
        current: 1,
      },
    },
    {
      title: "Llamada a P(a) — paso por valor",
      stage: 3,
      note: `En la llamada <code>P(a)</code>, se apila un <strong>nuevo registro de activación</strong>. El valor de <code>a</code> se <em>copia</em> en el parámetro formal: es el paso por valor.`,
      roadmap: {
        question: "¿Cómo transcurre una llamada a función?",
        stages: ["Apilamiento", "Inicialización", "Ejecución", "Desapilamiento"],
        current: 0,
      },
    },
    {
      title: "Ejecución en P — modificación de la copia",
      stage: 4,
      note: `<code>a = a + 1;</code> modifica el <strong>parámetro formal</strong> en el registro de <code>P</code>. La <code>a</code> de <code>main</code> no se ve afectada: ocupan dos espacios distintos.`,
      roadmap: {
        question: "¿Cómo transcurre una llamada a función?",
        stages: ["Apilamiento", "Inicialización", "Ejecución", "Desapilamiento"],
        current: 2,
      },
    },
    {
      title: "Retorno — desapilamiento del bloque",
      stage: 5,
      note: `Al final de <code>P</code>, su registro de activación se <strong>desapila</strong>. Se vuelve al entorno de <code>main</code>. Con un paso por valor, la <code>a</code> de <code>main</code> sigue valiendo 0.`,
      roadmap: {
        question: "¿Cómo transcurre una llamada a función?",
        stages: ["Apilamiento", "Inicialización", "Ejecución", "Desapilamiento"],
        current: 3,
      },
    },
    {
      title: "¿Y con una referencia?",
      stage: 6,
      note: `Si <code>P</code> recibe <code>int &a</code>, el parámetro formal <strong>no recibe una copia</strong>: se convierte en un <em>alias</em> de la variable de <code>main</code>. La flecha atraviesa los registros de activación: modificar <code>a</code> en <code>P</code> modifica la <code>a</code> de <code>main</code>.`,
      whyStep: {
        summary: "Recordatorio — ¿por qué es útil?",
        body: `Las referencias permiten que una función modifique variables de quien la llama <em>sin copiar grandes estructuras</em>. Es el equivalente moderno en C++ del paso por puntero (que veremos en el ejercicio 2).`,
      },
    },
  ],
};

// ----- Chapter 2 — Le tas (allocation dynamique) ----------------------

function chapter2Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Pila", kind: "pile" }));
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
  label: "Cap. 2 — El heap",
  defaultFigure: (step) => chapter2Diagram({ stage: step.stage }),
  steps: [
    {
      title: "Pila vs heap",
      stage: 1,
      note: `Dos regiones distintas: la <strong>pila</strong> contiene los registros de activación (tiempo de vida = ámbito). El <strong>heap</strong> sirve para las asignaciones dinámicas (tiempo de vida explícito, gestionado con <code>new</code> / <code>delete</code>).`,
    },
    {
      title: "Asignación: new int(42)",
      stage: 2,
      note: `<code>p = new int(42);</code> — se asigna en el <strong>heap</strong> una celda entera que contiene 42. La dirección de esa celda se guarda en <code>p</code>, que vive en la pila.`,
    },
    {
      title: "Varias asignaciones",
      stage: 3,
      note: `Cada llamada a <code>new</code> puede colocar la celda en cualquier parte del heap: los espacios <strong>no son contiguos</strong>. Esa es la gran diferencia con un arreglo, que sí es contiguo.`,
    },
    {
      title: "delete p — liberación",
      stage: 4,
      note: `<code>delete p;</code> libera la celda apuntada. <strong>El puntero no se modifica</strong>: ahora apunta a una zona inválida (<em>puntero colgante</em>). Desreferenciarlo después de <code>delete</code> tiene un efecto impredecible.`,
      whyStep: {
        summary: "Por qué es peligroso",
        body: `Mientras no se ponga el puntero a <code>nullptr</code>, no se puede distinguir un puntero válido de uno liberado. Es una fuente clásica de errores (uso tras liberación).`,
      },
    },
    {
      title: "p = nullptr — reinicialización defensiva",
      stage: 5,
      note: `<code>p = nullptr;</code> deja el puntero explícitamente inválido. Ahora se puede comprobar <code>if (p == nullptr)</code> antes de usarlo, y la situación queda sin ambigüedad.`,
    },
  ],
};

// ----- Chapter 3 — Tableaux et adresses (cm05 p. 50) ------------------

function chapter3Diagram({ stage }) {
  const svg = memorySvg({ width: 560, height: 380 });
  svg.appendChild(regionLabel({ x: 320, y: 8, w: 220, label: "Pila", kind: "pile" }));

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
    "  // t recibe la dirección de T[0]",
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
  label: "Cap. 3 — Arreglos",
  defaultFigure: (step) => chapter3Diagram({ stage: step.stage }),
  steps: [
    {
      title: "Arreglo en memoria contigua",
      stage: 1,
      note: `Para almacenar un arreglo <code>int T[5]</code>, el compilador reserva <strong>5 espacios consecutivos</strong> en la pila (dentro del registro de activación de la función).`,
    },
    {
      title: "Cálculo de dirección",
      stage: 2,
      note: `El acceso <code>T[i]</code> es instantáneo: <code>Dirección(T[i]) = Dirección(T[0]) + i × sizeof(int)</code>. No hace falta recorrer el arreglo: basta un simple cálculo de dirección.`,
      math: ["\\text{Direcci\\'on}(T[i]) = \\text{Direcci\\'on}(T[0]) + i \\cdot \\texttt{sizeof(int)}"],
    },
    {
      title: "Decrecimiento en puntero (decay)",
      stage: 3,
      note: `Cuando se pasa <code>T</code> a una función, el arreglo <strong>se transforma en un puntero</strong> a su primer elemento. La función no recibe, pues, una copia: puede modificar los elementos del arreglo de quien la llama.`,
      whyStep: {
        summary: "Consecuencia práctica",
        body: `<code>sizeof(t)</code> dentro de <code>affichTab</code> <strong>no</strong> da el tamaño del arreglo original, sino el de un puntero. Por eso casi siempre se pasa el tamaño como segundo argumento.`,
      },
    },
  ],
};

export const coursPileTas = {
  chapters: [chapter1, chapter2, chapter3],
};
