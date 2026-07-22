// Scenes for the animated correction of Exercise 2 — Nilpotency of
// differentiation D(p) = p′ on ℝₙ[X].
//
// Four chapters: Setting up, Matrix of D, Nilpotency,
// Non-diagonalizability. Figures: monomial row with shift arrows,
// superdiagonal matrix, staircase of subspaces — all rebuilt on
// every render.

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

// Matrix of D for n = 3, superdiagonal (1, 2, 3) highlighted.
// colsShown limits the emphasis to the first columns (progressive build-up).
function matrixOfD(colsShown = 4) {
  const values = [
    [0, 1, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 3],
    [0, 0, 0, 0],
  ];
  return matrixGrid({
    values,
    caption: "Mat(D) in (1, X, X², X³)",
    cellClass: (i, j, v) => {
      if (j >= colsShown) return "la-cell-dim";
      if (j === i + 1 && v !== 0) return "la-cell-diag";
      return v === 0 ? "la-cell-dim" : "";
    },
  }).root;
}

function roadmap(current, completedNote) {
  const rm = {
    question: "Why is D nilpotent and not diagonalizable?",
    stages: [
      "Understand the action of D on the basis",
      "Write the matrix of D",
      "Show Dⁿ⁺¹ = 0, of exact order n+1",
      "Conclude: not diagonalizable",
    ],
    current,
  };
  if (completedNote) rm.completedNote = completedNote;
  return rm;
}

// ---------------------------------------------------------------------
// Chapter 1 — Setting up
// ---------------------------------------------------------------------

const chapter1 = {
  label: "Setting up",
  steps: [
    {
      title: "The space and the operator",
      note: "<p>We work in ℝ<sub>n</sub>[X], the space of polynomials of degree at most n, equipped with the canonical basis (1, X, X², …, Xⁿ). It is a space of dimension <strong>n + 1</strong>. The operator under study is differentiation.</p>",
      math: ["D \\colon \\mathbb{R}_n[X] \\to \\mathbb{R}_n[X], \\qquad D(p) = p'"],
      roadmap: roadmap(0),
    },
    {
      title: "D is linear",
      note: "<p>The derivative of a linear combination is the linear combination of the derivatives — and differentiating lowers the degree, so the image stays in ℝ<sub>n</sub>[X]. D is indeed an endomorphism.</p>",
      math: ["D(ap + bq) = a\\,p' + b\\,q' = a\\,D(p) + b\\,D(q)"],
    },
    {
      title: "The action of D on the monomials",
      note: "<p>Everything can be read off the basis: each monomial moves down one step, multiplied by its exponent. The constant 1 is sent to 0 — that is the exit of the staircase.</p>",
      math: ["D(1) = 0, \\qquad D(X^k) = k\\,X^{k-1} \\quad (k \\ge 1)"],
      figure: () => monomialShiftRow({ n: 3, active: -1 }),
    },
    {
      title: "The degree drops by 1 at each step",
      note: "<p>This is the central observation of the exercise: applying D does not mix directions, it <strong>pushes everything downward</strong>. A polynomial of degree d becomes one of degree d − 1 (or 0). Nothing can survive indefinitely.</p>",
      math: ["\\deg(D(p)) \\le \\deg(p) - 1"],
      figure: () => monomialShiftRow({ n: 3, active: 3 }),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 2 — Matrix of D
// ---------------------------------------------------------------------

const chapter2 = {
  label: "Matrix of D",
  steps: [
    {
      title: "The method: one column per basis vector",
      note: "<p>Column k of the matrix contains the coordinates of the image of the k-th basis vector. We take n = 3 to write everything out: the basis is (1, X, X², X³) and the space has dimension 4.</p>",
      math: ["\\text{column } k = \\text{coordinates of } D(\\text{vector } k)"],
      roadmap: roadmap(1),
    },
    {
      title: "The first two columns",
      note: "<p>D(1) = 0: the first column is zero. D(X) = 1: the second column has a 1 in first position. The \"upward shift\" pattern starts to appear.</p>",
      math: ["D(1) = 0 \\;\\Rightarrow\\; C_1 = 0, \\qquad D(X) = 1 \\;\\Rightarrow\\; C_2 = (1, 0, 0, 0)^{T}"],
      figure: () => matrixOfD(2),
    },
    {
      title: "The complete matrix (n = 3)",
      note: "<p>D(X²) = 2X and D(X³) = 3X² fill in the next columns. The entries 1, 2, 3 line up on the <strong>superdiagonal</strong>; everything else is zero.</p>",
      math: [
        "\\operatorname{Mat}(D) = \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & 3 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}",
      ],
      figure: () => matrixOfD(4),
    },
    {
      title: "A strictly triangular structure",
      note: "<p>The matrix is <em>strictly</em> upper triangular: not only is everything above the diagonal, but the diagonal itself is entirely zero. This shape is the matrix signature of nilpotency.</p>",
      math: ["\\operatorname{Mat}(D) \\text{ strictly upper triangular}"],
      figure: () => matrixOfD(4),
    },
    {
      title: "Immediate spectral reading",
      note: "<p>The eigenvalues of a triangular matrix can be read off the diagonal. Here, the diagonal is zero: the only possible eigenvalue is 0. We will come back to this in chapter 4.</p>",
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
            caption: "The diagonal (in red) is entirely zero",
            cellClass: (i, j, v) => (i === j ? "la-cell-skew" : v === 0 ? "la-cell-dim" : "la-cell-diag"),
          }).root
        ),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 3 — Nilpotency
// ---------------------------------------------------------------------

const chapter3 = {
  label: "Nilpotency",
  defaultFigure: (s) => subspaceStaircase({ n: 4, active: typeof s.stage === "number" ? s.stage : 4 }),
  steps: [
    {
      title: "The staircase of subspaces",
      note: "<p>Since the degree drops at each application, D moves polynomials down a chain of nested subspaces (illustrated here for n = 4). Each step is strictly smaller than the previous one.</p>",
      math: ["\\mathbb{R}_n[X] \\supset \\mathbb{R}_{n-1}[X] \\supset \\cdots \\supset \\mathbb{R}_0[X] \\supset \\{0\\}"],
      stage: 4,
      roadmap: roadmap(2),
    },
    {
      title: "Down one step, then another…",
      note: "<p>After one application of D, every polynomial lives in ℝ<sub>n−1</sub>[X]. After two, in ℝ<sub>n−2</sub>[X]. The staircase never goes back up: destroyed information is lost forever.</p>",
      math: ["D^k\\big(\\mathbb{R}_n[X]\\big) \\subseteq \\mathbb{R}_{n-k}[X]"],
      stage: 2,
    },
    {
      title: "The exact computation on the leading monomial",
      note: "<p>To measure how many applications are needed, we track the highest monomial, Xⁿ. Each differentiation multiplies by the current exponent and moves down one step.</p>",
      math: ["D^k(X^n) = n(n-1)\\cdots(n-k+1)\\,X^{n-k}"],
      stage: 1,
    },
    {
      title: "Dⁿ does not kill everything: Dⁿ(Xⁿ) = n!",
      note: "<p>After n differentiations, the leading monomial is not dead: the constant n! remains, nonzero. So Dⁿ ≠ 0 — the staircase is not yet empty.</p>",
      math: ["D^n(X^n) = n! \\neq 0 \\;\\Longrightarrow\\; D^n \\neq 0"],
      stage: 0,
      whyStep: {
        summary: "Why track Xⁿ in particular?",
        body: "<p>To show that a power of D is not zero, it suffices to exhibit <em>one</em> vector that survives. The monomial of highest degree is the one that takes longest to die: it is the ideal witness.</p>",
      },
    },
    {
      title: "Dⁿ⁺¹ = 0: everything dies at the next step",
      note: "<p>The (n+1)-th derivative of every basis monomial is zero (even Xⁿ, now the constant n!, dies with one more hit). A linear map that vanishes on a basis vanishes everywhere.</p>",
      math: ["D^{n+1}(X^k) = 0 \\;\\text{for all } k \\le n \\;\\Longrightarrow\\; D^{n+1} = 0"],
      stage: -1,
    },
    {
      title: "Summary: nilpotent of order exactly n + 1",
      note: "<p>Dⁿ ≠ 0 and Dⁿ⁺¹ = 0: the index of nilpotency is exactly n + 1 — which is precisely the dimension of the space, the maximum possible bound. On the coefficients, each hit of D is the shift (a₀, …, aₙ) ↦ (a₁, 2a₂, …, naₙ, 0).</p>",
      math: ["D^n \\neq 0, \\quad D^{n+1} = 0 \\qquad \\Longrightarrow \\qquad \\text{order} = n + 1"],
      stage: -1,
      figure: () =>
        fig(
          matrixGrid({ values: [[2, 1, -3, 0, 1]], caption: "p — coefficients (a₀, …, a₄)" }).root,
          opSign("⟼"),
          matrixGrid({ values: [[1, -6, 0, 4, 0]], caption: "D p" }).root,
          opSign("⟼ ⋯ ⟼"),
          matrixGrid({ values: [[0, 0, 0, 0, 0]], caption: "D⁵ p = 0", cellClass: () => "la-cell-dim" }).root
        ),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 4 — Non-diagonalizability
// ---------------------------------------------------------------------

const chapter4 = {
  label: "Non-diagonalizability",
  steps: [
    {
      title: "The spectrum of D is reduced to {0}",
      note: "<p>Two ways to see it: the matrix of D is triangular with zero diagonal; or directly, if D(p) = λp with λ ≠ 0 and p ≠ 0, the degrees of the two sides cannot match since differentiating strictly lowers the degree. And 0 is indeed an eigenvalue: D(c) = 0 for constants.</p>",
      math: ["\\operatorname{Sp}(D) = \\{0\\}"],
      roadmap: roadmap(3),
    },
    {
      title: "By contradiction: suppose D is diagonalizable",
      note: "<p>If an eigenbasis existed, the matrix of D in that basis would be diagonal, with its eigenvalues on the diagonal — that is, only 0s. D would then be similar to the zero matrix.</p>",
      math: ["D = P \\cdot \\operatorname{diag}(0, \\dots, 0) \\cdot P^{-1} = 0"],
    },
    {
      title: "But D is not the zero map",
      note: "<p>As soon as n ≥ 1, the polynomial X belongs to the space and its derivative is 1: D does something. This is the contradiction we were after.</p>",
      math: ["D(X) = 1 \\neq 0"],
    },
    {
      title: "Conclusion",
      note: "<p>D is nilpotent of order n + 1 and is not diagonalizable. This illustrates the general principle: <strong>a nonzero nilpotent map is never diagonalizable</strong> — its only candidate eigenvalue is 0, and \"diagonal with 0s everywhere\" would mean \"zero\". See the <em>Nilpotency</em> concept page for the big picture.</p>",
      math: ["D^{n+1} = 0, \\qquad \\operatorname{Sp}(D) = \\{0\\}, \\qquad D \\text{ not diagonalizable}"],
      roadmap: roadmap(4, "<p>All four stages are complete: action understood, matrix written, nilpotency proved with exact order, non-diagonalizability concluded by contradiction.</p>"),
    },
  ],
};

export const exercice2Presentation = {
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
