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
    question: "Comment calculer tr(φ) et det(φ) ?",
    stages: [
      "Comprendre l'opérateur φ",
      "Décomposer Mₙ(ℝ) en Sym ⊕ Skew",
      "Lire les valeurs propres ±1",
      "Trace = somme, déterminant = produit",
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
  label: "Mise en place",
  steps: [
    {
      title: "L'objet de l'exercice",
      note: "<p>On étudie la transposition non pas comme une opération sur une matrice, mais comme un <strong>opérateur sur l'espace des matrices</strong> : φ prend une matrice et rend sa transposée. L'espace de départ est M<sub>n</sub>(ℝ), de dimension n².</p>",
      math: ["\\varphi \\colon M_n(\\mathbb{R}) \\to M_n(\\mathbb{R}), \\qquad \\varphi(M) = M^{T}"],
      roadmap: roadmap(0),
      figure: () => fig(grid(M0, "M"), opSign("⟼"), grid(M0T, "φ(M) = Mᵀ")),
    },
    {
      title: "Transposer = réfléchir par rapport à la diagonale",
      note: "<p>Coefficient par coefficient, la transposition échange ligne et colonne : le coefficient en position (i, j) devient celui en position (j, i). La <strong>diagonale ne bouge pas</strong> ; tout le reste se réfléchit.</p>",
      math: ["(M^{T})_{ij} = M_{ji}"],
      figure: () =>
        fig(grid(M0, "M — hors-diagonale en jaune", offDiag), opSign("⟼"), grid(M0T, "Mᵀ — les 2 et 3 ont échangé", offDiag)),
    },
    {
      title: "φ est linéaire",
      note: "<p>La transposition respecte sommes et multiples scalaires, car elle ne fait que <em>déplacer</em> les coefficients sans les combiner. C'est donc bien un endomorphisme de M<sub>n</sub>(ℝ).</p>",
      math: [
        "\\big((aM + bN)^{T}\\big)_{ij} = (aM + bN)_{ji}",
        "= a\\,M_{ji} + b\\,N_{ji} = a\\,(M^{T})_{ij} + b\\,(N^{T})_{ij}",
        "\\varphi(aM + bN) = a\\,\\varphi(M) + b\\,\\varphi(N)",
      ],
      highlightLine: 2,
      whyStep: {
        summary: "Pourquoi vérifier la linéarité d'abord ?",
        body: "<p>Tout l'exercice (valeurs propres, trace, déterminant) n'a de sens que pour une <strong>application linéaire</strong>. C'est le ticket d'entrée : sans linéarité, pas de spectre.</p>",
      },
    },
    {
      title: "φ est une involution : φ² = id",
      note: "<p>Transposer deux fois redonne la matrice de départ. Appliquer φ deux fois, c'est ne rien faire.</p>",
      math: ["(M^{T})^{T} = M", "\\varphi^2 = \\mathrm{id}"],
      highlightLine: 1,
      figure: () => fig(grid(M0, "M"), opSign("⟼"), grid(M0T, "Mᵀ"), opSign("⟼"), grid(M0, "(Mᵀ)ᵀ = M")),
    },
    {
      title: "Conséquence : les valeurs propres vivent dans {−1, 1}",
      note: "<p>φ² = id signifie que le polynôme X² − 1 <strong>annule</strong> φ. Or toute valeur propre est racine de tout polynôme annulateur. Le spectre est donc contenu dans {−1, 1} — et comme X² − 1 est scindé à racines simples, on sait déjà que φ sera diagonalisable.</p>",
      math: ["X^2 - 1 = (X-1)(X+1) \\;\\text{annule}\\; \\varphi", "\\operatorname{Sp}(\\varphi) \\subseteq \\{-1, 1\\}"],
      highlightLine: 1,
      whyStep: {
        summary: "Rappel — valeurs propres et polynôme annulateur",
        body: "<p>Si φ(v) = λv avec v ≠ 0 et si P(φ) = 0, alors P(λ)v = P(φ)(v) = 0, donc P(λ) = 0 : λ est racine de P.</p>",
        math: ["P(\\varphi) = 0 \\;\\Longrightarrow\\; \\forall \\lambda \\in \\operatorname{Sp}(\\varphi),\\; P(\\lambda) = 0"],
      },
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 2 — Décomposition Sym ⊕ Skew
// ---------------------------------------------------------------------

const chapter2 = {
  label: "Décomposition Sym ⊕ Skew",
  steps: [
    {
      title: "L'idée : couper chaque matrice en deux morceaux",
      note: "<p>Pour comprendre comment φ agit, on cherche les matrices sur lesquelles son action est <em>simple</em> : celles que φ fixe (symétriques) et celles que φ renverse (antisymétriques). Le pari : toute matrice est la somme d'un morceau de chaque type.</p>",
      math: ["M = S + K, \\qquad S^{T} = S, \\quad K^{T} = -K\\;?"],
      roadmap: roadmap(1),
    },
    {
      title: "Les formules de la décomposition",
      note: "<p>Les deux morceaux se construisent explicitement à partir de M et de sa transposée — moyenne pour la partie symétrique, demi-différence pour la partie antisymétrique.</p>",
      math: ["S = \\tfrac{1}{2}(M + M^{T}), \\qquad K = \\tfrac{1}{2}(M - M^{T})", "S + K = M"],
      highlightLine: 0,
      figure: () => fig(grid(M0, "M"), opSign("="), grid(S0, "S (symétrique)", symTint), opSign("+"), grid(K0, "K (antisymétrique)", skewTint)),
    },
    {
      title: "Vérification : S est symétrique, K est antisymétrique",
      note: "<p>On transpose chaque morceau. La transposée d'une somme est la somme des transposées, et (Mᵀ)ᵀ = M.</p>",
      math: [
        "S^{T} = \\tfrac{1}{2}(M^{T} + M) = S",
        "K^{T} = \\tfrac{1}{2}(M^{T} - M) = -K",
      ],
      figure: () => fig(grid(S0, "S — la réflexion ne change rien", symTint), grid(K0, "K — la réflexion change le signe", skewTint)),
    },
    {
      title: "La somme est directe : Sym ∩ Skew = {0}",
      note: "<p>Il reste à vérifier qu'une matrice ne peut pas être des deux types à la fois (sauf la matrice nulle). C'est ce qui rend la décomposition <strong>unique</strong>.</p>",
      math: ["\\mathrm{Sym}(n) \\cap \\mathrm{Skew}(n) = \\{0\\}"],
      subSteps: [
        {
          text: "<p>Soit M à la fois symétrique et antisymétrique. Alors M = Mᵀ et Mᵀ = −M, donc M = −M.</p>",
          math: ["M = M^{T} = -M \\;\\Longrightarrow\\; 2M = 0 \\;\\Longrightarrow\\; M = 0"],
        },
      ],
    },
    {
      title: "Compter les dimensions (n = 2 d'abord)",
      note: "<p>Une matrice symétrique 2×2 est déterminée par 3 coefficients (deux diagonaux, un hors-diagonale) ; une antisymétrique par 1 seul. On retrouve bien 3 + 1 = 4 = dim M₂(ℝ).</p>",
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
          text: "<p>Cas général : une symétrique est libre sur et au-dessus de la diagonale (n + n(n−1)/2 coefficients) ; une antisymétrique a une diagonale nulle et est libre strictement au-dessus (n(n−1)/2 coefficients).</p>",
          math: ["n + \\frac{n(n-1)}{2} = \\frac{n(n+1)}{2}"],
        },
      ],
    },
    {
      title: "Conclusion du chapitre",
      note: "<p>Existence (les formules) + unicité (l'intersection nulle) + le compte des dimensions : l'espace des matrices se scinde exactement en deux blocs.</p>",
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
  label: "Valeurs propres",
  steps: [
    {
      title: "Sur Sym(n), φ agit comme +1",
      note: "<p>Une matrice symétrique est <strong>fixée</strong> par la transposition : chaque matrice symétrique est un vecteur propre pour la valeur propre +1.</p>",
      math: ["S \\in \\mathrm{Sym}(n) \\;\\Longrightarrow\\; \\varphi(S) = S^{T} = S = (+1)\\,S"],
      roadmap: roadmap(2),
      figure: () => fig(grid(S0, "S", symTint), opSign("⟼"), grid(S0, "φ(S) = S", symTint)),
    },
    {
      title: "Sur Skew(n), φ agit comme −1",
      note: "<p>Une matrice antisymétrique est <strong>renversée</strong> par la transposition : c'est un vecteur propre pour la valeur propre −1.</p>",
      math: ["K \\in \\mathrm{Skew}(n) \\;\\Longrightarrow\\; \\varphi(K) = K^{T} = -K = (-1)\\,K"],
      figure: () => fig(grid(K0, "K", skewTint), opSign("⟼"), grid([[0, 0.5], [-0.5, 0]], "φ(K) = −K", skewTint)),
    },
    {
      title: "Les sous-espaces propres sont exactement Sym et Skew",
      note: "<p>On vient de voir les inclusions Sym ⊆ E₁ et Skew ⊆ E₋₁. Comme Sym ⊕ Skew remplit déjà tout l'espace et que des sous-espaces propres distincts sont toujours en somme directe, il n'y a pas de place pour plus : les inclusions sont des égalités.</p>",
      math: ["E_{1}(\\varphi) = \\mathrm{Sym}(n), \\qquad E_{-1}(\\varphi) = \\mathrm{Skew}(n)"],
    },
    {
      title: "Une base propre, donc φ est diagonalisable",
      note: "<p>On concatène une base de Sym(n) et une base de Skew(n) : on obtient n² vecteurs propres linéairement indépendants — une base propre de M<sub>n</sub>(ℝ).</p>",
      math: ["E_{1} \\oplus E_{-1} = M_n(\\mathbb{R}) \\;\\Longrightarrow\\; \\varphi \\text{ diagonalisable}"],
    },
    {
      title: "La matrice de φ dans cette base (n = 2)",
      note: "<p>Dans la base (E₁, E₂, E₃, F₁) — trois symétriques puis une antisymétrique — la matrice de φ est diagonale : trois +1, un −1. Tout le calcul de la trace et du déterminant se lira sur cette diagonale.</p>",
      math: ["\\operatorname{Mat}(\\varphi) = \\operatorname{diag}(1,\\, 1,\\, 1,\\, -1)"],
      figure: () =>
        fig(
          grid(
            [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
            "φ dans la base propre (n = 2)",
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
  label: "Trace & déterminant",
  steps: [
    {
      title: "Tout se lit dans la base propre",
      note: "<p>La trace et le déterminant ne dépendent pas de la base. On les calcule donc dans la base propre, où la matrice de φ est diagonale : <span style=\"color:var(--accent)\">n(n+1)/2 coefficients +1</span> puis <span style=\"color:var(--danger)\">n(n−1)/2 coefficients −1</span>.</p>",
      math: ["\\operatorname{Mat}(\\varphi) = \\operatorname{diag}(\\underbrace{1, \\dots, 1}_{n(n+1)/2},\\; \\underbrace{-1, \\dots, -1}_{n(n-1)/2})"],
      roadmap: roadmap(3),
    },
    {
      title: "Trace = somme des valeurs propres",
      note: "<p>On additionne la diagonale : les +1 comptent positivement, les −1 négativement. Le résultat est remarquablement simple.</p>",
      math: [
        "\\operatorname{tr}(\\varphi) = \\frac{n(n+1)}{2} - \\frac{n(n-1)}{2}",
        "= \\frac{n\\big[(n+1) - (n-1)\\big]}{2} = \\frac{2n}{2}",
        "\\operatorname{tr}(\\varphi) = n",
      ],
      highlightLine: 2,
      subSteps: [
        {
          text: "<p>Le facteur n se met en évidence, et la parenthèse vaut 2 : tout se télescope.</p>",
          math: ["(n+1) - (n-1) = 2"],
        },
      ],
    },
    {
      title: "Déterminant = produit des valeurs propres",
      note: "<p>On multiplie la diagonale : les +1 ne changent rien, et chaque −1 apporte un signe. Seule compte donc la <strong>parité du nombre de −1</strong>, c'est-à-dire de dim Skew(n).</p>",
      math: [
        "\\det(\\varphi) = 1^{\\,n(n+1)/2} \\cdot (-1)^{\\,n(n-1)/2}",
        "\\det(\\varphi) = (-1)^{\\,n(n-1)/2}",
      ],
      highlightLine: 1,
    },
    {
      title: "Vérification : le cas n = 2",
      note: "<p>Trois valeurs propres +1, une valeur propre −1 : la trace vaut 3 − 1 = 2 = n, et le déterminant vaut −1 = (−1)¹. Les formules générales sont confirmées.</p>",
      math: [
        "\\operatorname{tr}(\\varphi) = 3 - 1 = 2 = n \\;\\checkmark",
        "\\det(\\varphi) = 1^{3} \\cdot (-1)^{1} = -1 = (-1)^{2 \\cdot 1/2} \\;\\checkmark",
      ],
      figure: () =>
        fig(
          grid(
            [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
            "tr = somme de la diagonale ; det = produit",
            (i, j, v) => (i === j ? (v === 1 ? "la-cell-sym" : "la-cell-skew") : "la-cell-dim")
          )
        ),
    },
    {
      title: "Récapitulatif",
      note: "<p>La stratégie à retenir : pour un opérateur défini sur un espace de matrices, on cherche une <strong>décomposition en sous-espaces où l'action est simple</strong>, et la trace comme le déterminant se lisent alors directement sur les valeurs propres.</p>",
      math: [
        "M_n(\\mathbb{R}) = \\mathrm{Sym}(n) \\oplus \\mathrm{Skew}(n)",
        "\\operatorname{tr}(\\varphi) = n, \\qquad \\det(\\varphi) = (-1)^{\\,n(n-1)/2}",
      ],
      highlightLine: 1,
      roadmap: roadmap(4, "<p>Les quatre étapes sont bouclées : opérateur compris, espace décomposé, valeurs propres lues, trace et déterminant calculés.</p>"),
    },
  ],
};

export const exercice1Presentation = {
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
