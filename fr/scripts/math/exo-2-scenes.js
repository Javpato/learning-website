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
    caption: "Mat(D) dans (1, X, X², X³)",
    cellClass: (i, j, v) => {
      if (j >= colsShown) return "la-cell-dim";
      if (j === i + 1 && v !== 0) return "la-cell-diag";
      return v === 0 ? "la-cell-dim" : "";
    },
  }).root;
}

function roadmap(current, completedNote) {
  const rm = {
    question: "Pourquoi D est-il nilpotent et non diagonalisable ?",
    stages: [
      "Comprendre l'action de D sur la base",
      "Écrire la matrice de D",
      "Montrer Dⁿ⁺¹ = 0, d'ordre exact n+1",
      "Conclure : non diagonalisable",
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
      title: "L'espace et l'opérateur",
      note: "<p>On travaille dans ℝ<sub>n</sub>[X], l'espace des polynômes de degré au plus n, muni de la base canonique (1, X, X², …, Xⁿ). C'est un espace de dimension <strong>n + 1</strong>. L'opérateur étudié est la dérivation.</p>",
      math: ["D \\colon \\mathbb{R}_n[X] \\to \\mathbb{R}_n[X], \\qquad D(p) = p'"],
      roadmap: roadmap(0),
    },
    {
      title: "D est linéaire",
      note: "<p>La dérivée d'une combinaison linéaire est la combinaison linéaire des dérivées — et dériver fait baisser le degré, donc l'image reste dans ℝ<sub>n</sub>[X]. D est bien un endomorphisme.</p>",
      math: ["D(ap + bq) = a\\,p' + b\\,q' = a\\,D(p) + b\\,D(q)"],
    },
    {
      title: "L'action de D sur les monômes",
      note: "<p>Tout se lit sur la base : chaque monôme descend d'un cran, multiplié par son exposant. La constante 1 est envoyée sur 0 — c'est la sortie de l'escalier.</p>",
      math: ["D(1) = 0, \\qquad D(X^k) = k\\,X^{k-1} \\quad (k \\ge 1)"],
      figure: () => monomialShiftRow({ n: 3, active: -1 }),
    },
    {
      title: "Le degré chute de 1 à chaque coup",
      note: "<p>C'est l'observation centrale de l'exercice : appliquer D ne mélange pas les directions, il <strong>pousse tout vers le bas</strong>. Un polynôme de degré d devient de degré d − 1 (ou 0). Rien ne peut survivre indéfiniment.</p>",
      math: ["\\deg(D(p)) \\le \\deg(p) - 1"],
      figure: () => monomialShiftRow({ n: 3, active: 3 }),
    },
  ],
};

// ---------------------------------------------------------------------
// Chapitre 2 — Matrice de D
// ---------------------------------------------------------------------

const chapter2 = {
  label: "Matrice de D",
  steps: [
    {
      title: "La méthode : une colonne par vecteur de base",
      note: "<p>La colonne k de la matrice contient les coordonnées de l'image du k-ième vecteur de base. On prend n = 3 pour tout écrire : la base est (1, X, X², X³) et l'espace a dimension 4.</p>",
      math: ["\\text{colonne } k = \\text{coordonnées de } D(\\text{vecteur } k)"],
      roadmap: roadmap(1),
    },
    {
      title: "Les deux premières colonnes",
      note: "<p>D(1) = 0 : la première colonne est nulle. D(X) = 1 : la deuxième colonne a un 1 en première position. Le motif du « décalage vers le haut » commence à apparaître.</p>",
      math: ["D(1) = 0 \\;\\Rightarrow\\; C_1 = 0, \\qquad D(X) = 1 \\;\\Rightarrow\\; C_2 = (1, 0, 0, 0)^{T}"],
      figure: () => matrixOfD(2),
    },
    {
      title: "La matrice complète (n = 3)",
      note: "<p>D(X²) = 2X et D(X³) = 3X² remplissent les colonnes suivantes. Les coefficients 1, 2, 3 s'alignent sur la <strong>surdiagonale</strong> ; tout le reste est nul.</p>",
      math: [
        "\\operatorname{Mat}(D) = \\begin{pmatrix} 0 & 1 & 0 & 0 \\\\ 0 & 0 & 2 & 0 \\\\ 0 & 0 & 0 & 3 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}",
      ],
      figure: () => matrixOfD(4),
    },
    {
      title: "Une structure triangulaire stricte",
      note: "<p>La matrice est triangulaire supérieure <em>stricte</em> : non seulement tout est au-dessus de la diagonale, mais la diagonale elle-même est entièrement nulle. Cette forme est la signature matricielle de la nilpotence.</p>",
      math: ["\\operatorname{Mat}(D) \\text{ triangulaire supérieure stricte}"],
      figure: () => matrixOfD(4),
    },
    {
      title: "Lecture spectrale immédiate",
      note: "<p>Les valeurs propres d'une matrice triangulaire se lisent sur la diagonale. Ici, la diagonale est nulle : la seule valeur propre possible est 0. On y reviendra au chapitre 4.</p>",
      math: ["\\operatorname{Sp}(D) = \\{\\text{diagonale}\\} = \\{0\\}"],
      figure: () =>
        fig(
          matrixGrid({
            values: [
              [0, 1, 0, 0],
              [0, 0, 2, 0],
              [0, 0, 0, 3],
              [0, 0, 0, 0],
            ],
            caption: "La diagonale (en rouge) est entièrement nulle",
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
  label: "Nilpotence",
  defaultFigure: (s) => subspaceStaircase({ n: 4, active: typeof s.stage === "number" ? s.stage : 4 }),
  steps: [
    {
      title: "L'escalier de sous-espaces",
      note: "<p>Comme le degré chute à chaque application, D fait descendre les polynômes le long d'une chaîne de sous-espaces emboîtés (illustrée ici pour n = 4). Chaque marche est strictement plus petite que la précédente.</p>",
      math: ["\\mathbb{R}_n[X] \\supset \\mathbb{R}_{n-1}[X] \\supset \\cdots \\supset \\mathbb{R}_0[X] \\supset \\{0\\}"],
      stage: 4,
      roadmap: roadmap(2),
    },
    {
      title: "Descendre une marche, puis une autre…",
      note: "<p>Après une application de D, tout polynôme vit dans ℝ<sub>n−1</sub>[X]. Après deux, dans ℝ<sub>n−2</sub>[X]. L'escalier ne remonte jamais : l'information détruite est perdue pour toujours.</p>",
      math: ["D^k\\big(\\mathbb{R}_n[X]\\big) \\subseteq \\mathbb{R}_{n-k}[X]"],
      stage: 2,
    },
    {
      title: "Le calcul exact sur le monôme dominant",
      note: "<p>Pour mesurer combien d'applications sont nécessaires, on suit le monôme le plus haut, Xⁿ. Chaque dérivation multiplie par l'exposant courant et descend d'un cran.</p>",
      math: ["D^k(X^n) = n(n-1)\\cdots(n-k+1)\\,X^{n-k}"],
      stage: 1,
    },
    {
      title: "Dⁿ ne tue pas tout : Dⁿ(Xⁿ) = n!",
      note: "<p>Après n dérivations, le monôme dominant n'est pas mort : il reste la constante n!, non nulle. Donc Dⁿ ≠ 0 — l'escalier n'est pas encore vidé.</p>",
      math: ["D^n(X^n) = n! \\neq 0 \\;\\Longrightarrow\\; D^n \\neq 0"],
      stage: 0,
      whyStep: {
        summary: "Pourquoi suivre Xⁿ en particulier ?",
        body: "<p>Pour montrer qu'une puissance de D n'est pas nulle, il suffit d'exhiber <em>un</em> vecteur qui survit. Le monôme de plus haut degré est celui qui met le plus de temps à mourir : c'est le témoin idéal.</p>",
      },
    },
    {
      title: "Dⁿ⁺¹ = 0 : tout meurt au cran suivant",
      note: "<p>La (n+1)-ième dérivée de chaque monôme de la base est nulle (même Xⁿ, devenu la constante n!, meurt d'un coup de plus). Une application linéaire nulle sur une base est nulle partout.</p>",
      math: ["D^{n+1}(X^k) = 0 \\;\\text{pour tout } k \\le n \\;\\Longrightarrow\\; D^{n+1} = 0"],
      stage: -1,
    },
    {
      title: "Bilan : nilpotent d'ordre exactement n + 1",
      note: "<p>Dⁿ ≠ 0 et Dⁿ⁺¹ = 0 : l'indice de nilpotence vaut exactement n + 1 — qui est bien la dimension de l'espace, la borne maximale possible. Sur les coefficients, chaque coup de D est le décalage (a₀, …, aₙ) ↦ (a₁, 2a₂, …, naₙ, 0).</p>",
      math: ["D^n \\neq 0, \\quad D^{n+1} = 0 \\qquad \\Longrightarrow \\qquad \\text{ordre} = n + 1"],
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
// Chapitre 4 — Non-diagonalisabilité
// ---------------------------------------------------------------------

const chapter4 = {
  label: "Non-diagonalisabilité",
  steps: [
    {
      title: "Le spectre de D est réduit à {0}",
      note: "<p>Deux façons de le voir : la matrice de D est triangulaire à diagonale nulle ; ou directement, si D(p) = λp avec λ ≠ 0 et p ≠ 0, les degrés des deux membres ne peuvent pas coïncider puisque dériver fait strictement chuter le degré. Et 0 est bien valeur propre : D(c) = 0 pour les constantes.</p>",
      math: ["\\operatorname{Sp}(D) = \\{0\\}"],
      roadmap: roadmap(3),
    },
    {
      title: "Par l'absurde : supposons D diagonalisable",
      note: "<p>S'il existait une base propre, la matrice de D dans cette base serait diagonale, avec sur la diagonale ses valeurs propres — c'est-à-dire uniquement des 0. D serait alors semblable à la matrice nulle.</p>",
      math: ["D = P \\cdot \\operatorname{diag}(0, \\dots, 0) \\cdot P^{-1} = 0"],
    },
    {
      title: "Or D n'est pas l'application nulle",
      note: "<p>Dès que n ≥ 1, le polynôme X appartient à l'espace et sa dérivée vaut 1 : D fait quelque chose. C'est la contradiction recherchée.</p>",
      math: ["D(X) = 1 \\neq 0"],
    },
    {
      title: "Conclusion",
      note: "<p>D est nilpotent d'ordre n + 1 et n'est pas diagonalisable. C'est l'illustration du principe général : <strong>un nilpotent non nul n'est jamais diagonalisable</strong> — son seul candidat de valeur propre est 0, et « diagonal avec des 0 partout » voudrait dire « nul ». Voir la page concept <em>Nilpotence</em> pour la vue d'ensemble.</p>",
      math: ["D^{n+1} = 0, \\qquad \\operatorname{Sp}(D) = \\{0\\}, \\qquad D \\text{ non diagonalisable}"],
      roadmap: roadmap(4, "<p>Les quatre étapes sont bouclées : action comprise, matrice écrite, nilpotence prouvée avec ordre exact, non-diagonalisabilité conclue par l'absurde.</p>"),
    },
  ],
};

export const exercice2Presentation = {
  chapters: [chapter1, chapter2, chapter3, chapter4],
};
