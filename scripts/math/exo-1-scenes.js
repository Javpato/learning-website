// Scenes for the animated correction of Exercise 1 — Trace and determinant
// of the transposition φ(M) = Mᵀ on Mₙ(ℝ).
//
// Four chapters: Setting up, Sym ⊕ Skew decomposition,
// Eigenvalues, Trace & determinant. The figures are HTML matrices
// (matrix-grid.js) rebuilt on every render — no shared state.

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
    question: "How do we compute tr(φ) and det(φ)?",
    stages: [
      "Understand the operator φ",
      "Decompose Mₙ(ℝ) into Sym ⊕ Skew",
      "Read off the eigenvalues ±1",
      "Trace = sum, determinant = product",
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
      title: "The object of the exercise",
      note: "<p>We study transposition not as an operation on a matrix, but as an <strong>operator on the space of matrices</strong>: φ takes a matrix and returns its transpose. The domain is M<sub>n</sub>(ℝ), of dimension n².</p>",
      math: ["\\varphi \\colon M_n(\\mathbb{R}) \\to M_n(\\mathbb{R}), \\qquad \\varphi(M) = M^{T}"],
      roadmap: roadmap(0),
      figure: () => fig(grid(M0, "M"), opSign("⟼"), grid(M0T, "φ(M) = Mᵀ")),
    },
    {
      title: "Transposing = reflecting across the diagonal",
      note: "<p>Entry by entry, transposition swaps row and column: the entry in position (i, j) becomes the one in position (j, i). The <strong>diagonal does not move</strong>; everything else reflects.</p>",
      math: ["(M^{T})_{ij} = M_{ji}"],
      figure: () =>
        fig(grid(M0, "M — off-diagonal in yellow", offDiag), opSign("⟼"), grid(M0T, "Mᵀ — the 2 and 3 have swapped", offDiag)),
    },
    {
      title: "φ is linear",
      note: "<p>Transposition respects sums and scalar multiples, because it only <em>moves</em> the entries without combining them. So it is indeed an endomorphism of M<sub>n</sub>(ℝ).</p>",
      math: [
        "\\big((aM + bN)^{T}\\big)_{ij} = (aM + bN)_{ji}",
        "= a\\,M_{ji} + b\\,N_{ji} = a\\,(M^{T})_{ij} + b\\,(N^{T})_{ij}",
        "\\varphi(aM + bN) = a\\,\\varphi(M) + b\\,\\varphi(N)",
      ],
      highlightLine: 2,
      whyStep: {
        summary: "Why check linearity first?",
        body: "<p>The whole exercise (eigenvalues, trace, determinant) only makes sense for a <strong>linear map</strong>. It is the entry ticket: without linearity, no spectrum.</p>",
      },
    },
    {
      title: "φ is an involution: φ² = id",
      note: "<p>Transposing twice gives back the original matrix. Applying φ twice is doing nothing.</p>",
      math: ["(M^{T})^{T} = M", "\\varphi^2 = \\mathrm{id}"],
      highlightLine: 1,
      figure: () => fig(grid(M0, "M"), opSign("⟼"), grid(M0T, "Mᵀ"), opSign("⟼"), grid(M0, "(Mᵀ)ᵀ = M")),
    },
    {
      title: "Consequence: the eigenvalues live in {−1, 1}",
      note: "<p>φ² = id means that the polynomial X² − 1 <strong>annihilates</strong> φ. But every eigenvalue is a root of every annihilating polynomial. The spectrum is therefore contained in {−1, 1} — and since X² − 1 splits with simple roots, we already know φ will be diagonalizable.</p>",
      math: ["X^2 - 1 = (X-1)(X+1) \\;\\text{annihilates}\\; \\varphi", "\\operatorname{Sp}(\\varphi) \\subseteq \\{-1, 1\\}"],
      highlightLine: 1,
      whyStep: {
        summary: "Reminder — eigenvalues and annihilating polynomials",
        body: "<p>If φ(v) = λv with v ≠ 0 and P(φ) = 0, then P(λ)v = P(φ)(v) = 0, so P(λ) = 0: λ is a root of P.</p>",
        math: ["P(\\varphi) = 0 \\;\\Longrightarrow\\; \\forall \\lambda \\in \\operatorname{Sp}(\\varphi),\\; P(\\lambda) = 0"],
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 2 — Sym ⊕ Skew decomposition
// ---------------------------------------------------------------------

const chapter2 = {
  label: "Sym ⊕ Skew decomposition",
  steps: [
    {
      title: "The idea: cut each matrix into two pieces",
      note: "<p>To understand how φ acts, we look for the matrices on which its action is <em>simple</em>: those that φ fixes (symmetric) and those that φ flips (skew-symmetric). The bet: every matrix is the sum of one piece of each type.</p>",
      math: ["M = S + K, \\qquad S^{T} = S, \\quad K^{T} = -K\\;?"],
      roadmap: roadmap(1),
    },
    {
      title: "The decomposition formulas",
      note: "<p>The two pieces are built explicitly from M and its transpose — the average for the symmetric part, the half-difference for the skew-symmetric part.</p>",
      math: ["S = \\tfrac{1}{2}(M + M^{T}), \\qquad K = \\tfrac{1}{2}(M - M^{T})", "S + K = M"],
      highlightLine: 0,
      figure: () => fig(grid(M0, "M"), opSign("="), grid(S0, "S (symmetric)", symTint), opSign("+"), grid(K0, "K (skew-symmetric)", skewTint)),
    },
    {
      title: "Check: S is symmetric, K is skew-symmetric",
      note: "<p>We transpose each piece. The transpose of a sum is the sum of the transposes, and (Mᵀ)ᵀ = M.</p>",
      math: [
        "S^{T} = \\tfrac{1}{2}(M^{T} + M) = S",
        "K^{T} = \\tfrac{1}{2}(M^{T} - M) = -K",
      ],
      figure: () => fig(grid(S0, "S — the reflection changes nothing", symTint), grid(K0, "K — the reflection changes the sign", skewTint)),
    },
    {
      title: "The sum is direct: Sym ∩ Skew = {0}",
      note: "<p>It remains to check that a matrix cannot be of both types at once (except the zero matrix). This is what makes the decomposition <strong>unique</strong>.</p>",
      math: ["\\mathrm{Sym}(n) \\cap \\mathrm{Skew}(n) = \\{0\\}"],
      subSteps: [
        {
          text: "<p>Let M be both symmetric and skew-symmetric. Then M = Mᵀ and Mᵀ = −M, so M = −M.</p>",
          math: ["M = M^{T} = -M \\;\\Longrightarrow\\; 2M = 0 \\;\\Longrightarrow\\; M = 0"],
        },
      ],
    },
    {
      title: "Counting dimensions (n = 2 first)",
      note: "<p>A symmetric 2×2 matrix is determined by 3 entries (two diagonal, one off-diagonal); a skew-symmetric one by just 1. We indeed recover 3 + 1 = 4 = dim M₂(ℝ).</p>",
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
          text: "<p>General case: a symmetric matrix is free on and above the diagonal (n + n(n−1)/2 entries); a skew-symmetric one has a zero diagonal and is free strictly above it (n(n−1)/2 entries).</p>",
          math: ["n + \\frac{n(n-1)}{2} = \\frac{n(n+1)}{2}"],
        },
      ],
    },
    {
      title: "Chapter conclusion",
      note: "<p>Existence (the formulas) + uniqueness (the zero intersection) + the dimension count: the space of matrices splits exactly into two blocks.</p>",
      math: [
        "M_n(\\mathbb{R}) = \\mathrm{Sym}(n) \\oplus \\mathrm{Skew}(n)",
        "\\frac{n(n+1)}{2} + \\frac{n(n-1)}{2} = n^2 \\;\\checkmark",
      ],
      highlightLine: 0,
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 3 — Eigenvalues
// ---------------------------------------------------------------------

const chapter3 = {
  label: "Eigenvalues",
  steps: [
    {
      title: "On Sym(n), φ acts as +1",
      note: "<p>A symmetric matrix is <strong>fixed</strong> by transposition: every symmetric matrix is an eigenvector for the eigenvalue +1.</p>",
      math: ["S \\in \\mathrm{Sym}(n) \\;\\Longrightarrow\\; \\varphi(S) = S^{T} = S = (+1)\\,S"],
      roadmap: roadmap(2),
      figure: () => fig(grid(S0, "S", symTint), opSign("⟼"), grid(S0, "φ(S) = S", symTint)),
    },
    {
      title: "On Skew(n), φ acts as −1",
      note: "<p>A skew-symmetric matrix is <strong>flipped</strong> by transposition: it is an eigenvector for the eigenvalue −1.</p>",
      math: ["K \\in \\mathrm{Skew}(n) \\;\\Longrightarrow\\; \\varphi(K) = K^{T} = -K = (-1)\\,K"],
      figure: () => fig(grid(K0, "K", skewTint), opSign("⟼"), grid([[0, 0.5], [-0.5, 0]], "φ(K) = −K", skewTint)),
    },
    {
      title: "The eigenspaces are exactly Sym and Skew",
      note: "<p>We just saw the inclusions Sym ⊆ E₁ and Skew ⊆ E₋₁. Since Sym ⊕ Skew already fills the whole space and distinct eigenspaces are always in direct sum, there is no room for more: the inclusions are equalities.</p>",
      math: ["E_{1}(\\varphi) = \\mathrm{Sym}(n), \\qquad E_{-1}(\\varphi) = \\mathrm{Skew}(n)"],
    },
    {
      title: "An eigenbasis, so φ is diagonalizable",
      note: "<p>We concatenate a basis of Sym(n) and a basis of Skew(n): we get n² linearly independent eigenvectors — an eigenbasis of M<sub>n</sub>(ℝ).</p>",
      math: ["E_{1} \\oplus E_{-1} = M_n(\\mathbb{R}) \\;\\Longrightarrow\\; \\varphi \\text{ diagonalizable}"],
    },
    {
      title: "The matrix of φ in this basis (n = 2)",
      note: "<p>In the basis (E₁, E₂, E₃, F₁) — three symmetric then one skew-symmetric — the matrix of φ is diagonal: three +1, one −1. The whole computation of the trace and determinant can be read off this diagonal.</p>",
      math: ["\\operatorname{Mat}(\\varphi) = \\operatorname{diag}(1,\\, 1,\\, 1,\\, -1)"],
      figure: () =>
        fig(
          grid(
            [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
            "φ in the eigenbasis (n = 2)",
            (i, j, v) => (i === j ? (v === 1 ? "la-cell-sym" : "la-cell-skew") : "la-cell-dim")
          )
        ),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapter 4 — Trace & determinant
// ---------------------------------------------------------------------

const chapter4 = {
  label: "Trace & determinant",
  steps: [
    {
      title: "Everything can be read in the eigenbasis",
      note: "<p>The trace and the determinant do not depend on the basis. So we compute them in the eigenbasis, where the matrix of φ is diagonal: <span style=\"color:var(--accent)\">n(n+1)/2 entries +1</span> then <span style=\"color:var(--danger)\">n(n−1)/2 entries −1</span>.</p>",
      math: ["\\operatorname{Mat}(\\varphi) = \\operatorname{diag}(\\underbrace{1, \\dots, 1}_{n(n+1)/2},\\; \\underbrace{-1, \\dots, -1}_{n(n-1)/2})"],
      roadmap: roadmap(3),
    },
    {
      title: "Trace = sum of the eigenvalues",
      note: "<p>We add up the diagonal: the +1s count positively, the −1s negatively. The result is remarkably simple.</p>",
      math: [
        "\\operatorname{tr}(\\varphi) = \\frac{n(n+1)}{2} - \\frac{n(n-1)}{2}",
        "= \\frac{n\\big[(n+1) - (n-1)\\big]}{2} = \\frac{2n}{2}",
        "\\operatorname{tr}(\\varphi) = n",
      ],
      highlightLine: 2,
      subSteps: [
        {
          text: "<p>The factor n comes out, and the bracket equals 2: everything telescopes.</p>",
          math: ["(n+1) - (n-1) = 2"],
        },
      ],
    },
    {
      title: "Determinant = product of the eigenvalues",
      note: "<p>We multiply the diagonal: the +1s change nothing, and each −1 contributes a sign. So all that matters is the <strong>parity of the number of −1s</strong>, that is, of dim Skew(n).</p>",
      math: [
        "\\det(\\varphi) = 1^{\\,n(n+1)/2} \\cdot (-1)^{\\,n(n-1)/2}",
        "\\det(\\varphi) = (-1)^{\\,n(n-1)/2}",
      ],
      highlightLine: 1,
    },
    {
      title: "Check: the case n = 2",
      note: "<p>Three eigenvalues +1, one eigenvalue −1: the trace is 3 − 1 = 2 = n, and the determinant is −1 = (−1)¹. The general formulas are confirmed.</p>",
      math: [
        "\\operatorname{tr}(\\varphi) = 3 - 1 = 2 = n \\;\\checkmark",
        "\\det(\\varphi) = 1^{3} \\cdot (-1)^{1} = -1 = (-1)^{2 \\cdot 1/2} \\;\\checkmark",
      ],
      figure: () =>
        fig(
          grid(
            [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
            "tr = sum of the diagonal; det = product",
            (i, j, v) => (i === j ? (v === 1 ? "la-cell-sym" : "la-cell-skew") : "la-cell-dim")
          )
        ),
    },
    {
      title: "Summary",
      note: "<p>The strategy to remember: for an operator defined on a space of matrices, look for a <strong>decomposition into subspaces where the action is simple</strong>, and then both the trace and the determinant can be read directly off the eigenvalues.</p>",
      math: [
        "M_n(\\mathbb{R}) = \\mathrm{Sym}(n) \\oplus \\mathrm{Skew}(n)",
        "\\operatorname{tr}(\\varphi) = n, \\qquad \\det(\\varphi) = (-1)^{\\,n(n-1)/2}",
      ],
      highlightLine: 1,
      roadmap: roadmap(4, "<p>All four stages are complete: operator understood, space decomposed, eigenvalues read off, trace and determinant computed.</p>"),
    },
  ],
};

export const exercice1Presentation = {
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
