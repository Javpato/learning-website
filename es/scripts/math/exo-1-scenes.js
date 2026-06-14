// Scènes de la correction animée de l'Exercice 1 — Trace et déterminant
// de la transposition φ(M) = Mᵀ sur Mₙ(ℝ).
//
// Quatre chapitres : Mise en place, Décomposition Sym ⊕ Skew,
// Valeurs propres, Trace & déterminant. Les figures sont des matrices HTML
// (matrix-grid.js) reconstruites à chaque rendu — aucun état partagé.

import { matrixGrid } from "./matrix-grid.js";

const M0 = [[1, 2], [3, 4]];
const M0T = [[1, 3], [2, 4]];
const S0 = [[1, 2.5], [2.5, 4]];
const K0 = [[0, -0.5], [0.5, 0]];

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

function grid(values, caption, cellClass = null) {
  return matrixGrid({ values, caption, cellClass }).root;
}

const offDiag = (i, j) => (i !== j ? "la-cell-diag" : "");
const symTint = () => "la-cell-sym";
const skewTint = () => "la-cell-skew";

function roadmap(current, completedNote) {
  const rm = {
    question: "¿Cómo calcular tr(φ) y det(φ)?",
    stages: [
      "Comprender el operador φ",
      "Descomponer Mₙ(ℝ) en Sym ⊕ Skew",
      "Leer los valores propios ±1",
      "Traza = suma, determinante = producto",
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
      title: "El objeto del ejercicio",
      note: "<p>Se estudia la transposición no como una operación sobre una matriz, sino como un <strong>operador sobre el espacio de las matrices</strong>: φ toma una matriz y devuelve su transpuesta. El espacio de partida es M<sub>n</sub>(ℝ), de dimensión n².</p>",
      math: ["\\varphi \\colon M_n(\\mathbb{R}) \\to M_n(\\mathbb{R}), \\qquad \\varphi(M) = M^{T}"],
      roadmap: roadmap(0),
      figure: () => fig(grid(M0, "M"), opSign("⟼"), grid(M0T, "φ(M) = Mᵀ")),
    },
    {
      title: "Transponer = reflejar respecto a la diagonal",
      note: "<p>Coeficiente por coeficiente, la transposición intercambia fila y columna: el coeficiente en la posición (i, j) pasa a ser el de la posición (j, i). La <strong>diagonal no se mueve</strong>; todo lo demás se refleja.</p>",
      math: ["(M^{T})_{ij} = M_{ji}"],
      figure: () =>
        fig(grid(M0, "M — fuera de la diagonal en amarillo", offDiag), opSign("⟼"), grid(M0T, "Mᵀ — el 2 y el 3 se han intercambiado", offDiag)),
    },
    {
      title: "φ es lineal",
      note: "<p>La transposición respeta sumas y múltiplos escalares, ya que solo <em>desplaza</em> los coeficientes sin combinarlos. Es por tanto un endomorfismo de M<sub>n</sub>(ℝ).</p>",
      math: [
        "\\big((aM + bN)^{T}\\big)_{ij} = (aM + bN)_{ji}",
        "= a\\,M_{ji} + b\\,N_{ji} = a\\,(M^{T})_{ij} + b\\,(N^{T})_{ij}",
        "\\varphi(aM + bN) = a\\,\\varphi(M) + b\\,\\varphi(N)",
      ],
      highlightLine: 2,
      whyStep: {
        summary: "¿Por qué verificar la linealidad primero?",
        body: "<p>Todo el ejercicio (valores propios, traza, determinante) solo tiene sentido para una <strong>aplicación lineal</strong>. Es el billete de entrada: sin linealidad, no hay espectro.</p>",
      },
    },
    {
      title: "φ es una involución: φ² = id",
      note: "<p>Transponer dos veces devuelve la matriz de partida. Aplicar φ dos veces es no hacer nada.</p>",
      math: ["(M^{T})^{T} = M", "\\varphi^2 = \\mathrm{id}"],
      highlightLine: 1,
      figure: () => fig(grid(M0, "M"), opSign("⟼"), grid(M0T, "Mᵀ"), opSign("⟼"), grid(M0, "(Mᵀ)ᵀ = M")),
    },
    {
      title: "Consecuencia: los valores propios viven en {−1, 1}",
      note: "<p>φ² = id significa que el polinomio X² − 1 <strong>anula</strong> a φ. Ahora bien, todo valor propio es raíz de cualquier polinomio anulador. El espectro está entonces contenido en {−1, 1} — y como X² − 1 se descompone en factores con raíces simples, ya sabemos que φ será diagonalizable.</p>",
      math: ["X^2 - 1 = (X-1)(X+1) \\;\\text{anula a}\\; \\varphi", "\\operatorname{Sp}(\\varphi) \\subseteq \\{-1, 1\\}"],
      highlightLine: 1,
      whyStep: {
        summary: "Recordatorio — valores propios y polinomio anulador",
        body: "<p>Si φ(v) = λv con v ≠ 0 y si P(φ) = 0, entonces P(λ)v = P(φ)(v) = 0, por lo que P(λ) = 0: λ es raíz de P.</p>",
        math: ["P(\\varphi) = 0 \\;\\Longrightarrow\\; \\forall \\lambda \\in \\operatorname{Sp}(\\varphi),\\; P(\\lambda) = 0"],
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 2 — Décomposition Sym ⊕ Skew
// ---------------------------------------------------------------------

const chapter2 = {
  label: "Descomposición Sym ⊕ Skew",
  steps: [
    {
      title: "La idea: partir cada matriz en dos trozos",
      note: "<p>Para comprender cómo actúa φ, buscamos las matrices sobre las que su acción es <em>simple</em>: las que φ fija (simétricas) y las que φ invierte (antisimétricas). La apuesta: toda matriz es la suma de un trozo de cada tipo.</p>",
      math: ["M = S + K, \\qquad S^{T} = S, \\quad K^{T} = -K\\;?"],
      roadmap: roadmap(1),
    },
    {
      title: "Las fórmulas de la descomposición",
      note: "<p>Los dos trozos se construyen explícitamente a partir de M y de su transpuesta — la media para la parte simétrica, la semidiferencia para la parte antisimétrica.</p>",
      math: ["S = \\tfrac{1}{2}(M + M^{T}), \\qquad K = \\tfrac{1}{2}(M - M^{T})", "S + K = M"],
      highlightLine: 0,
      figure: () => fig(grid(M0, "M"), opSign("="), grid(S0, "S (simétrica)", symTint), opSign("+"), grid(K0, "K (antisimétrica)", skewTint)),
    },
    {
      title: "Verificación: S es simétrica, K es antisimétrica",
      note: "<p>Se transpone cada trozo. La transpuesta de una suma es la suma de las transpuestas, y (Mᵀ)ᵀ = M.</p>",
      math: [
        "S^{T} = \\tfrac{1}{2}(M^{T} + M) = S",
        "K^{T} = \\tfrac{1}{2}(M^{T} - M) = -K",
      ],
      figure: () => fig(grid(S0, "S — la reflexión no cambia nada", symTint), grid(K0, "K — la reflexión cambia el signo", skewTint)),
    },
    {
      title: "La suma es directa: Sym ∩ Skew = {0}",
      note: "<p>Queda por verificar que una matriz no puede ser de ambos tipos a la vez (salvo la matriz nula). Esto es lo que hace que la descomposición sea <strong>única</strong>.</p>",
      math: ["\\mathrm{Sym}(n) \\cap \\mathrm{Skew}(n) = \\{0\\}"],
      subSteps: [
        {
          text: "<p>Sea M a la vez simétrica y antisimétrica. Entonces M = Mᵀ y Mᵀ = −M, por lo que M = −M.</p>",
          math: ["M = M^{T} = -M \\;\\Longrightarrow\\; 2M = 0 \\;\\Longrightarrow\\; M = 0"],
        },
      ],
    },
    {
      title: "Contar las dimensiones (n = 2 primero)",
      note: "<p>Una matriz simétrica 2×2 queda determinada por 3 coeficientes (dos diagonales, uno fuera de la diagonal); una antisimétrica por 1 solo. Se recupera bien 3 + 1 = 4 = dim M₂(ℝ).</p>",
      math: ["\\dim \\mathrm{Sym}(n) = \\frac{n(n+1)}{2}, \\qquad \\dim \\mathrm{Skew}(n) = \\frac{n(n-1)}{2}"],
      figure: () =>
        fig(
          grid([[1, 0], [0, 0]], "E₁", symTint),
          grid([[0, 0], [0, 1]], "E₂", symTint),
          grid([[0, 1], [1, 0]], "E₃", symTint),
          opSign("⊕"),
          grid([[0, 1], [-1, 0]], "F₁", skewTint)
        ),
      subSteps: [
        {
          text: "<p>Caso general: una simétrica es libre sobre y por encima de la diagonal (n + n(n−1)/2 coeficientes); una antisimétrica tiene una diagonal nula y es libre estrictamente por encima (n(n−1)/2 coeficientes).</p>",
          math: ["n + \\frac{n(n-1)}{2} = \\frac{n(n+1)}{2}"],
        },
      ],
    },
    {
      title: "Conclusión del capítulo",
      note: "<p>Existencia (las fórmulas) + unicidad (la intersección nula) + el conteo de las dimensiones: el espacio de las matrices se descompone exactamente en dos bloques.</p>",
      math: [
        "M_n(\\mathbb{R}) = \\mathrm{Sym}(n) \\oplus \\mathrm{Skew}(n)",
        "\\frac{n(n+1)}{2} + \\frac{n(n-1)}{2} = n^2 \\;\\checkmark",
      ],
      highlightLine: 0,
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 3 — Valeurs propres
// ---------------------------------------------------------------------

const chapter3 = {
  label: "Valores propios",
  steps: [
    {
      title: "Sobre Sym(n), φ actúa como +1",
      note: "<p>Una matriz simétrica es <strong>fijada</strong> por la transposición: cada matriz simétrica es un vector propio para el valor propio +1.</p>",
      math: ["S \\in \\mathrm{Sym}(n) \\;\\Longrightarrow\\; \\varphi(S) = S^{T} = S = (+1)\\,S"],
      roadmap: roadmap(2),
      figure: () => fig(grid(S0, "S", symTint), opSign("⟼"), grid(S0, "φ(S) = S", symTint)),
    },
    {
      title: "Sobre Skew(n), φ actúa como −1",
      note: "<p>Una matriz antisimétrica es <strong>invertida</strong> por la transposición: es un vector propio para el valor propio −1.</p>",
      math: ["K \\in \\mathrm{Skew}(n) \\;\\Longrightarrow\\; \\varphi(K) = K^{T} = -K = (-1)\\,K"],
      figure: () => fig(grid(K0, "K", skewTint), opSign("⟼"), grid([[0, 0.5], [-0.5, 0]], "φ(K) = −K", skewTint)),
    },
    {
      title: "Los subespacios propios son exactamente Sym y Skew",
      note: "<p>Acabamos de ver las inclusiones Sym ⊆ E₁ y Skew ⊆ E₋₁. Como Sym ⊕ Skew ya llena todo el espacio y los subespacios propios distintos están siempre en suma directa, no hay sitio para más: las inclusiones son igualdades.</p>",
      math: ["E_{1}(\\varphi) = \\mathrm{Sym}(n), \\qquad E_{-1}(\\varphi) = \\mathrm{Skew}(n)"],
    },
    {
      title: "Una base propia, por tanto φ es diagonalizable",
      note: "<p>Se concatena una base de Sym(n) y una base de Skew(n): se obtienen n² vectores propios linealmente independientes — una base propia de M<sub>n</sub>(ℝ).</p>",
      math: ["E_{1} \\oplus E_{-1} = M_n(\\mathbb{R}) \\;\\Longrightarrow\\; \\varphi \\text{ diagonalizable}"],
    },
    {
      title: "La matriz de φ en esta base (n = 2)",
      note: "<p>En la base (E₁, E₂, E₃, F₁) — tres simétricas y luego una antisimétrica — la matriz de φ es diagonal: tres +1, un −1. Todo el cálculo de la traza y del determinante se leerá en esta diagonal.</p>",
      math: ["\\operatorname{Mat}(\\varphi) = \\operatorname{diag}(1,\\, 1,\\, 1,\\, -1)"],
      figure: () =>
        fig(
          grid(
            [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
            "φ en la base propia (n = 2)",
            (i, j, v) => (i === j ? (v === 1 ? "la-cell-sym" : "la-cell-skew") : "la-cell-dim")
          )
        ),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 4 — Trace & déterminant
// ---------------------------------------------------------------------

const chapter4 = {
  label: "Traza & determinante",
  steps: [
    {
      title: "Todo se lee en la base propia",
      note: "<p>La traza y el determinante no dependen de la base. Se calculan por tanto en la base propia, donde la matriz de φ es diagonal: <span style=\"color:var(--accent)\">n(n+1)/2 coeficientes +1</span> y luego <span style=\"color:var(--danger)\">n(n−1)/2 coeficientes −1</span>.</p>",
      math: ["\\operatorname{Mat}(\\varphi) = \\operatorname{diag}(\\underbrace{1, \\dots, 1}_{n(n+1)/2},\\; \\underbrace{-1, \\dots, -1}_{n(n-1)/2})"],
      roadmap: roadmap(3),
    },
    {
      title: "Traza = suma de los valores propios",
      note: "<p>Se suma la diagonal: los +1 cuentan positivamente, los −1 negativamente. El resultado es notablemente simple.</p>",
      math: [
        "\\operatorname{tr}(\\varphi) = \\frac{n(n+1)}{2} - \\frac{n(n-1)}{2}",
        "= \\frac{n\\big[(n+1) - (n-1)\\big]}{2} = \\frac{2n}{2}",
        "\\operatorname{tr}(\\varphi) = n",
      ],
      highlightLine: 2,
      subSteps: [
        {
          text: "<p>El factor n se pone en evidencia, y el paréntesis vale 2: todo se telescopa.</p>",
          math: ["(n+1) - (n-1) = 2"],
        },
      ],
    },
    {
      title: "Determinante = producto de los valores propios",
      note: "<p>Se multiplica la diagonal: los +1 no cambian nada, y cada −1 aporta un signo. Solo cuenta entonces la <strong>paridad del número de −1</strong>, es decir de dim Skew(n).</p>",
      math: [
        "\\det(\\varphi) = 1^{\\,n(n+1)/2} \\cdot (-1)^{\\,n(n-1)/2}",
        "\\det(\\varphi) = (-1)^{\\,n(n-1)/2}",
      ],
      highlightLine: 1,
    },
    {
      title: "Verificación: el caso n = 2",
      note: "<p>Tres valores propios +1, un valor propio −1: la traza vale 3 − 1 = 2 = n, y el determinante vale −1 = (−1)¹. Las fórmulas generales quedan confirmadas.</p>",
      math: [
        "\\operatorname{tr}(\\varphi) = 3 - 1 = 2 = n \\;\\checkmark",
        "\\det(\\varphi) = 1^{3} \\cdot (-1)^{1} = -1 = (-1)^{2 \\cdot 1/2} \\;\\checkmark",
      ],
      figure: () =>
        fig(
          grid(
            [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
            "tr = suma de la diagonal; det = producto",
            (i, j, v) => (i === j ? (v === 1 ? "la-cell-sym" : "la-cell-skew") : "la-cell-dim")
          )
        ),
    },
    {
      title: "Resumen",
      note: "<p>La estrategia a recordar: para un operador definido sobre un espacio de matrices, se busca una <strong>descomposición en subespacios donde la acción es simple</strong>, y tanto la traza como el determinante se leen entonces directamente en los valores propios.</p>",
      math: [
        "M_n(\\mathbb{R}) = \\mathrm{Sym}(n) \\oplus \\mathrm{Skew}(n)",
        "\\operatorname{tr}(\\varphi) = n, \\qquad \\det(\\varphi) = (-1)^{\\,n(n-1)/2}",
      ],
      highlightLine: 1,
      roadmap: roadmap(4, "<p>Las cuatro etapas están completas: operador comprendido, espacio descompuesto, valores propios leídos, traza y determinante calculados.</p>"),
    },
  ],
};

export const exercice1Presentation = {
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
