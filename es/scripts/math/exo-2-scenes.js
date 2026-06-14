// Scènes de la correction animée de l'Exercice 2 — Nilpotence de la
// dérivation D(p) = p′ sur ℝₙ[X].
//
// Quatre chapitres : Mise en place, Matrice de D, Nilpotence,
// Non-diagonalisabilité. Figures : rangée de monômes avec flèches de
// décalage, matrice surdiagonale, escalier de sous-espaces — toutes
// reconstruites à chaque rendu.

import { matrixGrid } from "./matrix-grid.js";
import { subspaceStaircase, monomialShiftRow } from "./svg-utils.js";

function fig(...nodes) {
  const div = document.createElement("div");
  div.className = "la-fig";
  nodes.forEach((n) => div.appendChild(n));
  return div;
}

function opSign(text) {
  const span = document.createElement("span");
  span.className = "la-fig-op";
  span.textContent = text;
  return span;
}

// Matrice de D pour n = 3, surdiagonale (1, 2, 3) mise en avant.
// colsShown limite l'accent aux premières colonnes (construction progressive).
function matrixOfD(colsShown = 4) {
  const values = [
    [0, 1, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 3],
    [0, 0, 0, 0],
  ];
  return matrixGrid({
    values,
    caption: "Mat(D) en (1, X, X², X³)",
    cellClass: (i, j, v) => {
      if (j >= colsShown) return "la-cell-dim";
      if (j === i + 1 && v !== 0) return "la-cell-diag";
      return v === 0 ? "la-cell-dim" : "";
    },
  }).root;
}

function roadmap(current, completedNote) {
  const rm = {
    question: "¿Por qué D es nilpotente y no diagonalizable?",
    stages: [
      "Comprender la acción de D sobre la base",
      "Escribir la matriz de D",
      "Mostrar Dⁿ⁺¹ = 0, de orden exacto n+1",
      "Concluir: no diagonalizable",
    ],
    current,
  };
  if (completedNote) rm.completedNote = completedNote;
  return rm;
}

// ---------------------------------------------------------------------
// Chapitre 1 — Mise en place
// ---------------------------------------------------------------------

const chapter1 = {
  label: "Preparación",
  steps: [
    {
      title: "El espacio y el operador",
      note: "<p>Trabajamos en ℝ<sub>n</sub>[X], el espacio de los polinomios de grado a lo sumo n, dotado de la base canónica (1, X, X², …, Xⁿ). Es un espacio de dimensión <strong>n + 1</strong>. El operador estudiado es la derivación.</p>",
      math: ["D \\colon \\mathbb{R}_n[X] \\to \\mathbb{R}_n[X], \\qquad D(p) = p'"],
      roadmap: roadmap(0),
    },
    {
      title: "D es lineal",
      note: "<p>La derivada de una combinación lineal es la combinación lineal de las derivadas — y derivar hace bajar el grado, por lo que la imagen permanece en ℝ<sub>n</sub>[X]. D es ciertamente un endomorfismo.</p>",
      math: ["D(ap + bq) = a\\,p' + b\\,q' = a\\,D(p) + b\\,D(q)"],
    },
    {
      title: "La acción de D sobre los monomios",
      note: "<p>Todo se lee en la base: cada monomio desciende un escalón, multiplicado por su exponente. La constante 1 se envía a 0 — es la salida de la escalera.</p>",
      math: ["D(1) = 0, \\qquad D(X^k) = k\\,X^{k-1} \\quad (k \\ge 1)"],
      figure: () => monomialShiftRow({ n: 3, active: -1 }),
    },
    {
      title: "El grado cae en 1 en cada paso",
      note: "<p>Es la observación central del ejercicio: aplicar D no mezcla las direcciones, sino que <strong>empuja todo hacia abajo</strong>. Un polinomio de grado d pasa a ser de grado d − 1 (o 0). Nada puede sobrevivir indefinidamente.</p>",
      math: ["\\deg(D(p)) \\le \\deg(p) - 1"],
      figure: () => monomialShiftRow({ n: 3, active: 3 }),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 2 — Matrice de D
// ---------------------------------------------------------------------

const chapter2 = {
  label: "Matriz de D",
  steps: [
    {
      title: "El método: una columna por vector de la base",
      note: "<p>La columna k de la matriz contiene las coordenadas de la imagen del k-ésimo vector de la base. Tomamos n = 3 para escribirlo todo: la base es (1, X, X², X³) y el espacio tiene dimensión 4.</p>",
      math: ["\\text{columna } k = \\text{coordenadas de } D(\\text{vector } k)"],
      roadmap: roadmap(1),
    },
    {
      title: "Las dos primeras columnas",
      note: "<p>D(1) = 0: la primera columna es nula. D(X) = 1: la segunda columna tiene un 1 en la primera posición. El patrón del «desplazamiento hacia arriba» empieza a aparecer.</p>",
      math: ["D(1) = 0 \\;\\Rightarrow\\; C_1 = 0, \\qquad D(X) = 1 \\;\\Rightarrow\\; C_2 = (1, 0, 0, 0)^{T}"],
      figure: () => matrixOfD(2),
    },
    {
      title: "La matriz completa (n = 3)",
      note: "<p>D(X²) = 2X y D(X³) = 3X² rellenan las columnas siguientes. Los coeficientes 1, 2, 3 se alinean en la <strong>superdiagonal</strong>; todo lo demás es nulo.</p>",
      math: [
        "\\operatorname{Mat}(D) = \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & 3 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}",
      ],
      figure: () => matrixOfD(4),
    },
    {
      title: "Una estructura triangular estricta",
      note: "<p>La matriz es triangular superior <em>estricta</em>: no solo todo está por encima de la diagonal, sino que la propia diagonal es enteramente nula. Esta forma es la firma matricial de la nilpotencia.</p>",
      math: ["\\operatorname{Mat}(D) \\text{ triangular superior estricta}"],
      figure: () => matrixOfD(4),
    },
    {
      title: "Lectura espectral inmediata",
      note: "<p>Los valores propios de una matriz triangular se leen en la diagonal. Aquí, la diagonal es nula: el único valor propio posible es 0. Volveremos sobre ello en el capítulo 4.</p>",
      math: ["\\operatorname{Sp}(D) = \\{\\text{diagonal}\\} = \\{0\\}"],
      figure: () =>
        fig(
          matrixGrid({
            values: [
              [0, 1, 0, 0],
              [0, 0, 2, 0],
              [0, 0, 0, 3],
              [0, 0, 0, 0],
            ],
            caption: "La diagonal (en rojo) es enteramente nula",
            cellClass: (i, j, v) => (i === j ? "la-cell-skew" : v === 0 ? "la-cell-dim" : "la-cell-diag"),
          }).root
        ),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 3 — Nilpotence
// ---------------------------------------------------------------------

const chapter3 = {
  label: "Nilpotencia",
  defaultFigure: (s) => subspaceStaircase({ n: 4, active: typeof s.stage === "number" ? s.stage : 4 }),
  steps: [
    {
      title: "La escalera de subespacios",
      note: "<p>Como el grado cae en cada aplicación, D hace descender los polinomios a lo largo de una cadena de subespacios encajados (ilustrada aquí para n = 4). Cada escalón es estrictamente más pequeño que el anterior.</p>",
      math: ["\\mathbb{R}_n[X] \\supset \\mathbb{R}_{n-1}[X] \\supset \\cdots \\supset \\mathbb{R}_0[X] \\supset \\{0\\}"],
      stage: 4,
      roadmap: roadmap(2),
    },
    {
      title: "Bajar un escalón, luego otro…",
      note: "<p>Tras una aplicación de D, todo polinomio vive en ℝ<sub>n−1</sub>[X]. Tras dos, en ℝ<sub>n−2</sub>[X]. La escalera nunca sube: la información destruida se pierde para siempre.</p>",
      math: ["D^k\\big(\\mathbb{R}_n[X]\\big) \\subseteq \\mathbb{R}_{n-k}[X]"],
      stage: 2,
    },
    {
      title: "El cálculo exacto sobre el monomio dominante",
      note: "<p>Para medir cuántas aplicaciones son necesarias, seguimos el monomio más alto, Xⁿ. Cada derivación multiplica por el exponente actual y desciende un escalón.</p>",
      math: ["D^k(X^n) = n(n-1)\\cdots(n-k+1)\\,X^{n-k}"],
      stage: 1,
    },
    {
      title: "Dⁿ no lo mata todo: Dⁿ(Xⁿ) = n!",
      note: "<p>Tras n derivaciones, el monomio dominante no ha muerto: queda la constante n!, no nula. Por tanto Dⁿ ≠ 0 — la escalera aún no se ha vaciado.</p>",
      math: ["D^n(X^n) = n! \\neq 0 \\;\\Longrightarrow\\; D^n \\neq 0"],
      stage: 0,
      whyStep: {
        summary: "¿Por qué seguir Xⁿ en particular?",
        body: "<p>Para mostrar que una potencia de D no es nula, basta con exhibir <em>un</em> vector que sobreviva. El monomio de mayor grado es el que más tarda en morir: es el testigo ideal.</p>",
      },
    },
    {
      title: "Dⁿ⁺¹ = 0: todo muere en el escalón siguiente",
      note: "<p>La (n+1)-ésima derivada de cada monomio de la base es nula (incluso Xⁿ, convertido en la constante n!, muere con un paso más). Una aplicación lineal nula sobre una base es nula en todas partes.</p>",
      math: ["D^{n+1}(X^k) = 0 \\;\\text{para todo } k \\le n \\;\\Longrightarrow\\; D^{n+1} = 0"],
      stage: -1,
    },
    {
      title: "Balance: nilpotente de orden exactamente n + 1",
      note: "<p>Dⁿ ≠ 0 y Dⁿ⁺¹ = 0: el índice de nilpotencia vale exactamente n + 1 — que es precisamente la dimensión del espacio, la cota máxima posible. Sobre los coeficientes, cada paso de D es el desplazamiento (a₀, …, aₙ) ↦ (a₁, 2a₂, …, naₙ, 0).</p>",
      math: ["D^n \\neq 0, \\quad D^{n+1} = 0 \\qquad \\Longrightarrow \\qquad \\text{orden} = n + 1"],
      stage: -1,
      figure: () =>
        fig(
          matrixGrid({ values: [[2, 1, -3, 0, 1]], caption: "p — coeficientes (a₀, …, a₄)" }).root,
          opSign("⟼"),
          matrixGrid({ values: [[1, -6, 0, 4, 0]], caption: "D p" }).root,
          opSign("⟼ ⋯ ⟼"),
          matrixGrid({ values: [[0, 0, 0, 0, 0]], caption: "D⁵ p = 0", cellClass: () => "la-cell-dim" }).root
        ),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 4 — Non-diagonalisabilité
// ---------------------------------------------------------------------

const chapter4 = {
  label: "No-diagonalizabilidad",
  steps: [
    {
      title: "El espectro de D se reduce a {0}",
      note: "<p>Dos formas de verlo: la matriz de D es triangular con diagonal nula; o directamente, si D(p) = λp con λ ≠ 0 y p ≠ 0, los grados de ambos miembros no pueden coincidir puesto que derivar hace caer estrictamente el grado. Y 0 sí es un valor propio: D(c) = 0 para las constantes.</p>",
      math: ["\\operatorname{Sp}(D) = \\{0\\}"],
      roadmap: roadmap(3),
    },
    {
      title: "Por reducción al absurdo: supongamos D diagonalizable",
      note: "<p>Si existiera una base propia, la matriz de D en esa base sería diagonal, con sus valores propios en la diagonal — es decir, únicamente 0. D sería entonces semejante a la matriz nula.</p>",
      math: ["D = P \\cdot \\operatorname{diag}(0, \\dots, 0) \\cdot P^{-1} = 0"],
    },
    {
      title: "Ahora bien, D no es la aplicación nula",
      note: "<p>En cuanto n ≥ 1, el polinomio X pertenece al espacio y su derivada vale 1: D hace algo. Es la contradicción buscada.</p>",
      math: ["D(X) = 1 \\neq 0"],
    },
    {
      title: "Conclusión",
      note: "<p>D es nilpotente de orden n + 1 y no es diagonalizable. Es la ilustración del principio general: <strong>un nilpotente no nulo nunca es diagonalizable</strong> — su único candidato a valor propio es 0, y «diagonal con 0 en todas partes» significaría «nula». Véase la página concepto <em>Nilpotencia</em> para la visión de conjunto.</p>",
      math: ["D^{n+1} = 0, \\qquad \\operatorname{Sp}(D) = \\{0\\}, \\qquad D \\text{ no diagonalizable}"],
      roadmap: roadmap(4, "<p>Las cuatro etapas están completas: acción comprendida, matriz escrita, nilpotencia probada con orden exacto, no-diagonalizabilidad concluida por reducción al absurdo.</p>"),
    },
  ],
};

export const exercice2Presentation = {
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
