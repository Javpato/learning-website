// Scene data for the animated correction of Exercice 4 — Diviseurs.
// Each chapter is a sequence of steps; each step is rendered by animator.js.

import { ex4aCircuit, ex4bCircuit, phasorDiagram } from "./circuits.js";

// Helpers used throughout.
const fig = (builder, args) => () => builder(args);

// --------------------------------------------------------------
// Chapter 1 — 4a) Original : RL // (RL en série avec C)
// --------------------------------------------------------------

// Roadmap shared across all steps of chapter 1 — three questions, each with stages.
const Q1_STAGES = [
  "Écrire Z₁ et Z₂ pour les deux branches",
  "Simplifier 1/(jωC) en −j/(ωC)",
  "Mettre Z₂ sous la forme R + jX₂",
  "Calculer I₁/I₂ = Z₂/Z₁",
  "Lire l'avance / le retard depuis le facteur −j",
];
const Q2_STAGES = [
  "Cartésianiser Z₂/Z₁ (×conjugué)",
  "Développer le numérateur (FOIL)",
  "Annuler la partie réelle → contrainte sur X₂",
  "Substituer X₂ = ωL − 1/(ωC) et isoler",
  "Mettre au même dénominateur",
  "Inverser pour obtenir C",
];
const Q3_STAGES = [
  "Lire la partie imaginaire restante",
  "Substituer X₂ et lire k",
];

const Q1 = (current, completedNote) => ({
  question: "Q1 — I₁/I₂ = −jk : avance ou retard ?",
  stages: Q1_STAGES,
  current,
  completedNote,
});
const Q2 = (current, completedNote) => ({
  question: "Q2 — Trouver la capacité C",
  stages: Q2_STAGES,
  current,
  completedNote,
});
const Q3 = (current, completedNote) => ({
  question: "Q3 — Calcul du facteur k",
  stages: Q3_STAGES,
  current,
  completedNote,
});

const chapter4aOriginal = {
  label: "4a) Cas original",
  defaultFigure: () => ex4aCircuit({ scenario: "original" }),
  steps: [

    {
      title: "Le circuit et l'idée physique",
      note: `Deux bobinages identiques, modélisés en <strong>RL série</strong>, sont placés en parallèle et alimentés par la même tension sinusoïdale <em>u</em>. Sur la branche de droite, on ajoute un condensateur <em>C</em> en série. <br /><br />But : faire passer dans les deux bobinages des courants <strong>en quadrature</strong>, c'est-à-dire déphasés de exactement <em>90°</em>. C'est cette quadrature qui permet à un moteur monophasé de démarrer (champ tournant).`,
      roadmap: Q1(0),
      math: [
        "\\underline{Z_1} = R + j\\omega L",
        "\\underline{Z_2} = R + j\\omega L + \\dfrac{1}{j\\omega C}",
      ],
      figure: fig(ex4aCircuit, { scenario: "original" }),
    },

    {
      title: "Simplification de 1/(jωC)",
      note: `On veut écrire l'impédance du condensateur sous une forme cartésienne <em>a + jb</em>. La règle clé : <strong>1/j = −j</strong>.<br /><br />La sous-explication ci-dessous redémontre pourquoi.`,
      roadmap: Q1(1),
      math: [
        "\\dfrac{1}{j\\omega C} \\;=\\; \\dfrac{1}{j}\\cdot\\dfrac{1}{\\omega C} \\;=\\; -\\dfrac{j}{\\omega C}",
      ],
      subSteps: [
        {
          text: "Pourquoi 1/j = −j ? On multiplie par j/j (ce qui vaut 1) :",
          math: [
            "\\dfrac{1}{j} \\;=\\; \\dfrac{1}{j}\\cdot\\dfrac{j}{j} \\;=\\; \\dfrac{j}{j^2} \\;=\\; \\dfrac{j}{-1} \\;=\\; -j",
          ],
        },
        {
          text: "On retient : multiplier par 1/j fait tourner de −90°, exactement comme −j.",
        },
      ],
      figure: fig(ex4aCircuit, { scenario: "original", emphasis: "branch2" }),
    },

    {
      title: "Forme cartésienne de Z₂",
      note: `On factorise par <em>j</em> dans la partie imaginaire pour faire apparaître la <strong>réactance totale</strong> de la branche 2.`,
      roadmap: Q1(2, "On a maintenant Z₂ propre : R + j·X₂ avec X₂ = ωL − 1/(ωC)."),
      math: [
        "\\underline{Z_2} = R + j\\omega L - \\dfrac{j}{\\omega C}",
        "\\underline{Z_2} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)",
      ],
      subSteps: [
        {
          text: "Justification de la factorisation : tous les termes imaginaires partagent le facteur j. On le met en facteur, exactement comme on factoriserait par x dans (3x − 5x).",
          math: ["j\\omega L - \\dfrac{j}{\\omega C} = j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)"],
        },
      ],
    },

    {
      title: "Rapport des courants — diviseur de courant",
      note: `Les deux branches voient la <strong>même tension</strong> (elles sont en parallèle). Donc <em>I₁ = U/Z₁</em> et <em>I₂ = U/Z₂</em>. Le rapport élimine <em>U</em>.`,
      roadmap: Q1(3),
      math: [
        "\\underline{I_1} = \\dfrac{\\underline{U}}{\\underline{Z_1}}, \\qquad \\underline{I_2} = \\dfrac{\\underline{U}}{\\underline{Z_2}}",
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} \\;=\\; \\dfrac{\\underline{U}/\\underline{Z_1}}{\\underline{U}/\\underline{Z_2}} \\;=\\; \\dfrac{\\underline{Z_2}}{\\underline{Z_1}}",
      ],
      subSteps: [
        {
          text: "Astuce algébrique : diviser deux fractions revient à multiplier par l'inverse :",
          math: ["\\dfrac{a/b}{a/c} = \\dfrac{a}{b}\\cdot\\dfrac{c}{a} = \\dfrac{c}{b}"],
        },
      ],
    },

    {
      title: "Avance ou retard ? On veut −jk",
      note: `On cherche à imposer <strong>I₁/I₂ = −jk</strong> avec <em>k > 0</em>. Géométriquement, multiplier par <em>−j</em> tourne d'un quart de tour dans le sens horaire (−90°). Donc <em>I₁</em> est en <strong>retard de 90°</strong> sur <em>I₂</em>, autrement dit <em>I₂</em> est en <strong>avance de 90°</strong> sur <em>I₁</em>.<br /><br />C'est cohérent : la branche 2, plus capacitive (à cause du condensateur), <em>avance</em> son courant.`,
      roadmap: Q1(4, "Q1 répondue : I₂ avance sur I₁. Reste à choisir C pour que ce soit exactement 90° (Q2)."),
      math: [
        "-jk \\;\\Longleftrightarrow\\; \\text{module } k,\\ \\text{argument } -90^\\circ",
      ],
      figure: () => phasorDiagram({
        title: "I₁ en retard de 90° sur I₂",
        size: 280, scale: 1,
        vectors: [
          { label: "I₂", mag: 100, deg: 0,   color: "var(--phasor-1)" },
          { label: "I₁", mag: 80,  deg: -90, color: "var(--phasor-2)" },
        ],
      }),
    },

    {
      title: "Calcul de Z₂/Z₁ — multiplier par le conjugué",
      note: `Pour rendre le dénominateur réel et lire facilement parties réelle/imaginaire, on multiplie haut et bas par <strong>le conjugué de Z₁</strong>, c'est-à-dire <em>R − jωL</em>. C'est la technique standard pour diviser deux complexes en cartésien.`,
      roadmap: Q2(0),
      math: [
        "\\dfrac{\\underline{Z_2}}{\\underline{Z_1}} \\;=\\; \\dfrac{\\underline{Z_2}\\,(R-j\\omega L)}{(R+j\\omega L)(R-j\\omega L)}",
        "(R+j\\omega L)(R-j\\omega L) \\;=\\; R^2 + (\\omega L)^2",
      ],
      subSteps: [
        {
          text: "Identité remarquable : (a+b)(a−b) = a² − b². Avec b = jωL, on a b² = j²(ωL)² = −(ωL)², d'où le + dans le résultat.",
          math: [
            "(R+j\\omega L)(R-j\\omega L) = R^2 - (j\\omega L)^2 = R^2 + (\\omega L)^2",
          ],
        },
      ],
    },

    {
      title: "Développement du numérateur",
      note: `On note <em>X₂ = ωL − 1/(ωC)</em> pour alléger. On développe (R + jX₂)(R − jωL) terme à terme.`,
      roadmap: Q2(1, "Z₂/Z₁ = (R² + X₂·ωL)/(R²+(ωL)²) + j·R(X₂−ωL)/(R²+(ωL)²). Maintenant on a deux leviers : la partie réelle (qu'on annulera pour Q2) et la partie imaginaire (qu'on lira pour Q3)."),
      math: [
        "(R+jX_2)(R-j\\omega L) = R^2 - jR\\omega L + jR X_2 - j^2 X_2 \\omega L",
        "= \\bigl(R^2 + X_2 \\omega L\\bigr) + j\\bigl(R X_2 - R\\omega L\\bigr)",
      ],
      subSteps: [
        {
          text: "On développe par double distributivité (FOIL) :",
          math: ["(a+b)(c+d) = ac + ad + bc + bd"],
        },
        {
          text: "Le terme −j²X₂ωL devient +X₂ωL car j² = −1.",
        },
      ],
    },

    {
      title: "Imposer une partie réelle nulle",
      note: `On a maintenant le rapport sous forme cartésienne : <strong>Z₂/Z₁ = a + j·b</strong>. Pour qu'il ait la forme <strong>−jk</strong> demandée par l'énoncé (purement imaginaire), il faut que <em>a = 0</em>. C'est exactement la <strong>condition de quadrature</strong>, traduite en algèbre.<br /><br />Cette équation ne contient pas C directement — elle nous donne d'abord une contrainte sur <em>X₂</em>. C est caché dans <em>X₂</em> et apparaîtra à l'étape suivante.`,
      roadmap: Q2(2, "On a déjà obtenu : R² + X₂·ωL = 0 ⟹ X₂ = −R²/(ωL). C'est la contrainte qui sert à trouver C."),
      whyStep: {
        summary: "Rappel — pourquoi annule-t-on la partie réelle ?",
        openByDefault: true,
        body: `<p>Le but de tout l'exercice (Q2) est : <strong>quelle valeur de C donne I₁/I₂ = −jk</strong> ?</p>
<p>Or <em>−jk</em> est un nombre <strong>purement imaginaire</strong> : sa partie réelle vaut zéro. Comme on a écrit Z₂/Z₁ sous la forme <em>a + j·b</em>, il suffit donc d'imposer <em>a = 0</em>.</p>
<p>Cette équation <em>a = 0</em> ne contient que la partie réelle du numérateur (à savoir <em>R² + X₂·ωL</em>). Elle relie <em>X₂</em> à <em>R</em> et <em>ωL</em>. Le coefficient devant <em>j</em> (la partie imaginaire) sera utilisé <strong>plus tard</strong>, en Q3, pour lire la valeur de <em>k</em>.</p>`,
        math: [
          "a + jb \\text{ purement imaginaire } \\;\\Longleftrightarrow\\; a = 0",
        ],
      },
      math: [
        "\\dfrac{\\underline{Z_2}}{\\underline{Z_1}} = \\underbrace{\\dfrac{R^2 + X_2\\,\\omega L}{R^2+(\\omega L)^2}}_{a\\ =\\ \\Re} + j\\underbrace{\\dfrac{R(X_2 - \\omega L)}{R^2+(\\omega L)^2}}_{b\\ =\\ \\Im}",
        "\\text{Condition} : \\quad a = 0 \\;\\Longleftrightarrow\\; R^2 + X_2\\,\\omega L = 0",
        "\\Longleftrightarrow\\; \\boxed{\\,X_2 = -\\dfrac{R^2}{\\omega L}\\,}",
      ],
      subSteps: [
        {
          text: "Visuellement : un nombre complexe a + jb est représenté par un point/vecteur dans le plan complexe. « Purement imaginaire » signifie que le point est sur l'axe vertical (Im) — sa coordonnée horizontale (Ré) est nulle.",
        },
        {
          text: "Le dénominateur R² + (ωL)² est strictement positif (somme de carrés). Donc il ne peut jamais s'annuler — seul le numérateur compte pour la condition « partie réelle = 0 ».",
        },
      ],
      figure: () => phasorDiagram({
        title: "On veut amener Z₂/Z₁ sur l'axe Im⁻ (= -jk)",
        size: 280, scale: 1,
        vectors: [
          { label: "Z₂/Z₁ avant", mag: 90, deg: -30, color: "var(--phasor-3)" },
          { label: "Cible (-jk)", mag: 90, deg: -90, color: "var(--accent-warm)" },
        ],
      }),
    },

    {
      title: "On remplace X₂ par sa définition",
      note: `L'étape précédente a <strong>extrait</strong> de la grosse formule la seule contrainte qui résout Q2 : <em>X₂ = −R²/(ωL)</em>. La partie imaginaire est mise de côté pour Q3.<br /><br />Maintenant, on revient à <em>X₂ = ωL − 1/(ωC)</em> : <em>C</em> est caché là-dedans. On remplace, et il ne reste qu'à isoler le terme capacitif.`,
      roadmap: Q2(3),
      whyStep: {
        summary: "Rappel — pourquoi on n'utilise plus la grosse formule ?",
        openByDefault: true,
        body: `<p>À l'étape 7, on avait écrit Z₂/Z₁ comme une somme de deux gros morceaux :</p>
<ul>
  <li>une <strong>partie réelle</strong> <em>(R² + X₂·ωL) / (R² + (ωL)²)</em> ;</li>
  <li>une <strong>partie imaginaire</strong> <em>R(X₂ − ωL) / (R² + (ωL)²)</em> multipliée par <em>j</em>.</li>
</ul>
<p>L'étape 8 a utilisé <strong>la partie réelle</strong> pour répondre à Q2 : « partie réelle = 0 » donne tout de suite l'équation <em>X₂ = −R²/(ωL)</em>. C'est tout ce qu'on a besoin pour calculer C.</p>
<p>La partie imaginaire n'est <strong>pas perdue</strong> — elle servira à l'étape 12 pour lire <em>k</em> (Q3). Pour Q2, elle est juste mise de côté.</p>
<p>Donc dans cette étape, on travaille uniquement avec <em>X₂ = −R²/(ωL)</em>, parce que c'est la seule équation contenant C qu'on doit résoudre.</p>`,
      },
      math: [
        "\\text{Définition rappel : }\\; X_2 = \\omega L - \\dfrac{1}{\\omega C}",
        "\\text{Contrainte de l'étape 8 : }\\; X_2 = -\\dfrac{R^2}{\\omega L}",
        "\\Longrightarrow\\; \\omega L - \\dfrac{1}{\\omega C} = -\\dfrac{R^2}{\\omega L}",
        "\\Longrightarrow\\; \\dfrac{1}{\\omega C} = \\omega L + \\dfrac{R^2}{\\omega L}",
      ],
      subSteps: [
        {
          text: "On a juste passé ωL à droite (en additionnant ωL des deux côtés) et inversé le signe du second terme. C'est une manipulation linéaire.",
        },
        {
          text: "Récap rapide du « partage du travail » entre les deux parties de Z₂/Z₁ :",
          math: [
            "\\underbrace{R^2 + X_2\\,\\omega L = 0}_{\\text{sert pour Q2 → C}} \\quad ; \\quad \\underbrace{R(X_2 - \\omega L)}_{\\text{servira pour Q3 → k}}",
          ],
        },
      ],
    },

    {
      title: "Mise au même dénominateur",
      note: `On combine la somme à droite en une seule fraction. Cette étape illustre une manipulation classique : <em>a + a/b = (ab + a)/b</em>, qui repose sur l'identité <em>a = a·b/b</em> car <em>b/b = 1</em>.`,
      roadmap: Q2(4),
      math: [
        "\\dfrac{1}{\\omega C} = \\dfrac{(\\omega L)^2 + R^2}{\\omega L}",
      ],
      subSteps: [
        {
          text: "Détail de la manipulation a + b/c = (ac + b)/c. On écrit a sous la forme a·c/c, puis on additionne les deux fractions qui ont maintenant le même dénominateur.",
          math: [
            "\\omega L = \\dfrac{\\omega L \\cdot \\omega L}{\\omega L} = \\dfrac{(\\omega L)^2}{\\omega L}",
            "\\omega L + \\dfrac{R^2}{\\omega L} = \\dfrac{(\\omega L)^2}{\\omega L} + \\dfrac{R^2}{\\omega L} = \\dfrac{(\\omega L)^2 + R^2}{\\omega L}",
          ],
        },
        {
          text: "Pourquoi ωL/ωL = 1 ? Tout nombre non nul divisé par lui-même vaut 1. C'est cet astuce qui permet d'écrire un nombre comme une fraction de dénominateur quelconque.",
        },
      ],
    },

    {
      title: "Inversion et résultat final pour C",
      note: `Il reste à inverser pour obtenir <em>ωC</em>, puis à diviser par <em>ω</em>.`,
      roadmap: Q2(5, "Q2 répondue : C = L / (R² + (ωL)²). Reste à calculer k (Q3)."),
      math: [
        "\\omega C = \\dfrac{\\omega L}{R^2 + (\\omega L)^2}",
        "\\boxed{\\,C = \\dfrac{L}{R^2 + (\\omega L)^2}\\,}",
      ],
      subSteps: [
        {
          text: "Inverser une fraction = passer au reciproque. (a/b)⁻¹ = b/a.",
          math: ["\\left(\\dfrac{1}{\\omega C}\\right)^{-1} = \\omega C"],
        },
      ],
    },

    {
      title: "Calcul du facteur k",
      note: `Comme la partie réelle est nulle, le rapport est purement imaginaire. On lit alors <em>k</em> sur le coefficient de <em>j</em>. On part de la partie imaginaire <em>R(X₂ − ωL)/[R² + (ωL)²]</em> (mise de côté à l'étape 8), puis on remplace <em>X₂ = −R²/(ωL)</em>.`,
      roadmap: Q3(1, "Q3 répondue : k = R/(ωL). Toute la partie a) est terminée."),
      whyStep: {
        summary: "Rappel — d'où sort cette partie imaginaire ?",
        body: `<p>À l'étape 7, on avait écrit Z₂/Z₁ = <em>a + j·b</em>, avec <em>b = R(X₂ − ωL)/(R² + (ωL)²)</em>.</p>
<p>L'étape 8 a annulé <em>a</em> pour rendre le rapport purement imaginaire. Une fois cela fait, ce qui reste est <em>j·b</em>. Identifier <em>j·b = −jk</em> donne <em>k = −b</em>.</p>
<p>Maintenant on utilise la contrainte <em>X₂ = −R²/(ωL)</em> trouvée à l'étape 8 pour calculer <em>b</em>, et donc <em>k</em>.</p>`,
      },
      math: [
        "X_2 - \\omega L = -\\dfrac{R^2}{\\omega L} - \\omega L = -\\dfrac{R^2 + (\\omega L)^2}{\\omega L}",
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = j\\cdot\\dfrac{R\\bigl(X_2 - \\omega L\\bigr)}{R^2 + (\\omega L)^2} = -j\\cdot\\dfrac{R}{\\omega L}",
        "\\boxed{\\,k = \\dfrac{R}{\\omega L}\\,}",
      ],
      figure: () => phasorDiagram({
        title: "Quadrature obtenue : I₂ ⟂ I₁",
        size: 280, scale: 1,
        vectors: [
          { label: "I₂", mag: 100, deg: 0,   color: "var(--phasor-1)" },
          { label: "I₁", mag: 80,  deg: -90, color: "var(--phasor-2)" },
        ],
      }),
    },

  ],
};

// --------------------------------------------------------------
// Chapter 2 — Scénario 1 : R = 0
// --------------------------------------------------------------
const chapter4aNoR = {
  label: "Scénario 1 : R = 0",
  defaultFigure: () => ex4aCircuit({ scenario: "noR" }),
  steps: [

    {
      title: "Hypothèse : bobinages idéaux",
      note: `On suppose que les bobinages sont des inductances pures, donc <em>R = 0</em>. Que devient la condition de quadrature ?`,
      math: [
        "\\underline{Z_1} = j\\omega L",
        "\\underline{Z_2} = j\\omega L + \\dfrac{1}{j\\omega C} = j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)",
      ],
    },

    {
      title: "Le rapport devient réel",
      note: `Comme les deux impédances ont un facteur <em>j</em> commun, il s'élimine. Le rapport <em>I₁/I₂ = Z₂/Z₁</em> devient <strong>purement réel</strong>.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = \\dfrac{j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)}{j\\,\\omega L} = \\dfrac{\\omega L - \\dfrac{1}{\\omega C}}{\\omega L} = 1 - \\dfrac{1}{\\omega^2 L C}",
      ],
      subSteps: [
        {
          text: "Le j en haut et en bas se simplifient : j/j = 1. Ensuite, on divise terme à terme la fraction.",
          math: [
            "\\dfrac{\\omega L}{\\omega L} - \\dfrac{1/(\\omega C)}{\\omega L} = 1 - \\dfrac{1}{\\omega^2 L C}",
          ],
        },
      ],
    },

    {
      title: "Conclusion : pas de quadrature exacte",
      note: `Un nombre <strong>réel</strong> ne peut jamais s'écrire <em>−jk</em> (purement imaginaire) sauf s'il est nul. La quadrature exacte est <strong>impossible</strong> dans ce circuit sans résistance.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = 1 - \\dfrac{1}{\\omega^2 LC} \\in \\mathbb{R}",
        "\\boxed{\\,R=0 \\;\\Longrightarrow\\; \\text{pas de quadrature exacte.}\\,}",
      ],
      figure: () => phasorDiagram({
        title: "Cas inductif : I₁ et I₂ en phase ; cas capacitif : opposition",
        size: 280, scale: 1,
        vectors: [
          { label: "I₁", mag: 90, deg: -90, color: "var(--phasor-2)" },
          { label: "I₂ (inductif)", mag: 60, deg: -90, color: "var(--phasor-1)" },
          { label: "I₂ (capacitif)", mag: 60, deg: 90, color: "var(--phasor-3)" },
        ],
      }),
    },

    {
      title: "Pire encore : à la résonance",
      note: `Si on réutilise la formule <em>C = L/(R² + (ωL)²)</em> avec <em>R = 0</em>, on tombe sur <em>C = 1/(ω²L)</em>, ce qui annule exactement la réactance de la branche 2 — c'est la <strong>résonance série LC</strong>. La branche devient un court-circuit (impédance nulle) et le courant exploserait dans le modèle idéal.`,
      math: [
        "C = \\dfrac{L}{(\\omega L)^2} = \\dfrac{1}{\\omega^2 L}",
        "\\dfrac{1}{\\omega C} = \\omega L \\;\\Longrightarrow\\; \\omega L - \\dfrac{1}{\\omega C} = 0 \\;\\Longrightarrow\\; \\underline{Z_2} = 0",
      ],
      subSteps: [
        {
          text: "Moralité : la résistance R n'est pas un détail — elle est essentielle pour que la quadrature exacte existe. Elle limite aussi le courant à la résonance.",
        },
      ],
    },

  ],
};

// --------------------------------------------------------------
// Chapter 3 — Scénario 2 : un condensateur dans chaque branche
// --------------------------------------------------------------
const chapter4aTwoCaps = {
  label: "Scénario 2 : deux condensateurs",
  defaultFigure: () => ex4aCircuit({ scenario: "twoCaps" }),
  steps: [

    {
      title: "Nouvelle configuration",
      note: `On ajoute un condensateur <em>C₁</em> en série avec la branche 1 (en plus du <em>C₂</em> de la branche 2). On note les réactances totales <em>X₁</em> et <em>X₂</em>.`,
      math: [
        "\\underline{Z_1} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C_1}\\right) = R + jX_1",
        "\\underline{Z_2} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C_2}\\right) = R + jX_2",
      ],
    },

    {
      title: "Rapport des courants",
      note: `Toujours <em>I₁/I₂ = Z₂/Z₁</em>. On multiplie par le conjugué <em>R − jX₁</em> du dénominateur.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = \\dfrac{R + jX_2}{R + jX_1} = \\dfrac{(R+jX_2)(R-jX_1)}{R^2 + X_1^2}",
      ],
    },

    {
      title: "Développement du numérateur",
      note: `On utilise <em>j(−j) = 1</em> pour le produit des termes imaginaires.`,
      math: [
        "(R+jX_2)(R-jX_1) = R^2 - jRX_1 + jRX_2 + X_1 X_2",
        "= \\bigl(R^2 + X_1 X_2\\bigr) + jR\\bigl(X_2 - X_1\\bigr)",
      ],
      subSteps: [
        {
          text: "Le produit (jX₂)(−jX₁) = −j²X₁X₂ = −(−1)X₁X₂ = +X₁X₂. Le j² = −1 fait basculer le signe.",
        },
      ],
    },

    {
      title: "Condition de quadrature",
      note: `Pour avoir <em>I₁/I₂ = −jk</em>, on annule la partie réelle.`,
      math: [
        "R^2 + X_1 X_2 = 0",
        "\\boxed{\\,X_1 X_2 = -R^2\\,}",
        "\\Longleftrightarrow\\; \\left(\\omega L - \\dfrac{1}{\\omega C_1}\\right)\\!\\left(\\omega L - \\dfrac{1}{\\omega C_2}\\right) = -R^2",
      ],
    },

    {
      title: "Condition de signe — pour avoir k > 0",
      note: `Une fois la partie réelle annulée, il reste <em>I₁/I₂ = j·R(X₂ − X₁)/(R² + X₁²)</em>. On veut la forme <strong>−jk</strong> avec <em>k > 0</em>, donc le coefficient devant <em>j</em> doit être <strong>négatif</strong>. Cela impose <em>X₂ − X₁ < 0</em>, soit <strong>X₂ &lt; X₁</strong>.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = j\\cdot\\dfrac{R(X_2 - X_1)}{R^2 + X_1^2} = -j\\cdot\\dfrac{R(X_1 - X_2)}{R^2 + X_1^2}",
        "\\boxed{\\,k = \\dfrac{R(X_1 - X_2)}{R^2 + X_1^2}\\,}",
        "\\boxed{\\,X_2 < X_1\\,}",
      ],
      subSteps: [
        {
          text: "On a juste factorisé un signe moins pour faire apparaître la forme −jk attendue. Si on n'imposait pas X₂ < X₁, on obtiendrait k < 0, donc un déphasage opposé : I₁ en avance sur I₂ au lieu d'en retard. Le rôle physique des deux branches serait inversé.",
        },
        {
          text: "Concrètement, comme X₁X₂ = −R² < 0, l'une des réactances est positive et l'autre négative. La convention X₂ < X₁ revient à choisir que c'est la branche 2 qui est la plus capacitive (la moins inductive).",
        },
      ],
    },

    {
      title: "Interprétation physique",
      note: `Le produit <em>X₁X₂ = −R²</em> est <strong>négatif</strong>. Donc <em>X₁</em> et <em>X₂</em> sont de <strong>signes opposés</strong> : une branche est globalement inductive (<em>X > 0</em>), l'autre globalement capacitive (<em>X < 0</em>). C'est physiquement comme cela qu'on obtient un déphasage de 90° entre les deux courants.`,
      math: [
        "X_1 X_2 < 0 \\;\\Longleftrightarrow\\; \\text{une branche inductive, l'autre capacitive}",
      ],
      figure: () => phasorDiagram({
        title: "Une branche inductive, l'autre capacitive",
        size: 280,
        vectors: [
          { label: "U", mag: 100, deg: 0, color: "var(--phasor-4)" },
          { label: "I₁", mag: 80, deg: -45, color: "var(--phasor-2)" },
          { label: "I₂", mag: 80, deg: 45, color: "var(--phasor-1)" },
        ],
      }),
    },

    {
      title: "C₂ en fonction de C₁ (si C₁ est fixé)",
      note: `Supposons que <em>C₁</em> est imposé. On cherche <em>C₂</em> qui satisfait la condition <em>X₁X₂ = −R²</em>. Si <em>X₁ ≠ 0</em>, on isole <em>X₂</em> puis on remonte à <em>C₂</em>.`,
      math: [
        "X_2 = -\\dfrac{R^2}{X_1} \\;\\Longleftrightarrow\\; \\omega L - \\dfrac{1}{\\omega C_2} = -\\dfrac{R^2}{X_1}",
        "\\dfrac{1}{\\omega C_2} = \\omega L + \\dfrac{R^2}{X_1}",
        "\\boxed{\\,C_2 = \\dfrac{1}{\\omega\\!\\left(\\omega L + \\dfrac{R^2}{\\,\\omega L - \\dfrac{1}{\\omega C_1}\\,}\\right)}\\,}",
      ],
      subSteps: [
        {
          text: "On a remplacé X₁ par sa définition ωL − 1/(ωC₁) à la dernière ligne. Cette formule n'est valable que si X₁ ≠ 0, c'est-à-dire si la branche 1 n'est pas à la résonance LC₁ (où ωL = 1/(ωC₁)).",
          math: ["X_1 = \\omega L - \\dfrac{1}{\\omega C_1}"],
        },
        {
          text: "Cas limite : si C₁ → ∞ (pas de condensateur dans la branche 1), alors 1/(ωC₁) → 0 et X₁ → ωL. On retombe exactement sur le cas original — c'est ce que montre l'étape suivante.",
        },
      ],
    },

    {
      title: "Cas particulier : on retrouve l'exercice original",
      note: `Si la branche 1 n'a pas de condensateur, alors <em>C₁ → ∞</em>, donc <em>1/(ωC₁) = 0</em> et <em>X₁ = ωL</em>. La condition <em>X₁X₂ = −R²</em> redonne exactement la formule du cas original.`,
      math: [
        "\\omega L \\cdot X_2 = -R^2 \\;\\Longrightarrow\\; X_2 = -\\dfrac{R^2}{\\omega L}",
        "\\dfrac{1}{\\omega C_2} = \\omega L + \\dfrac{R^2}{\\omega L} = \\dfrac{R^2 + (\\omega L)^2}{\\omega L}",
        "\\boxed{\\,C_2 = \\dfrac{L}{R^2 + (\\omega L)^2}\\,}",
      ],
    },

  ],
};

// --------------------------------------------------------------
// Chapter 4 — 4b) Diviseur de tension
// --------------------------------------------------------------
const chapter4b = {
  label: "4b) Diviseur de tension",
  defaultFigure: () => ex4bCircuit(),
  steps: [

    {
      title: "Schéma équivalent",
      note: `Une source <em>u</em> alimente, par une <strong>ligne</strong> (résistance <em>R = 1 Ω</em>, réactance <em>X<sub>L</sub> = 0,5 Ω</em>), un récepteur d'impédance <em>Z₂ = 25·e^{jπ/3} Ω</em>. La tension cherchée <em>u₂</em> est aux bornes du récepteur.`,
      math: [
        "\\underline{Z}_\\text{ligne} = R + jX_L = 1 + j\\,0{,}5\\ \\Omega",
        "\\underline{Z_2} = 25\\,e^{j\\pi/3}\\ \\Omega",
      ],
      figure: () => ex4bCircuit({ emphasis: "line" }),
    },

    {
      title: "Diviseur de tension",
      note: `Comme <em>Z<sub>ligne</sub></em> et <em>Z₂</em> sont en série, traversées par le même courant, la tension se répartit proportionnellement aux impédances.`,
      math: [
        "\\underline{U_2} = \\underline{U}\\cdot\\dfrac{\\underline{Z_2}}{\\underline{Z}_\\text{ligne}+\\underline{Z_2}}",
      ],
    },

    {
      title: "Z₂ en cartésien",
      note: `On convertit <em>Z₂</em> du polaire au cartésien pour pouvoir l'additionner avec <em>Z<sub>ligne</sub></em>.`,
      math: [
        "\\underline{Z_2} = 25\\bigl(\\cos 60^\\circ + j\\sin 60^\\circ\\bigr)",
        "= 25\\,(0{,}5 + j\\,0{,}8660) = 12{,}5 + j\\,21{,}65\\ \\Omega",
      ],
      subSteps: [
        {
          text: "Formule d'Euler : e^{jθ} = cos θ + j sin θ. Avec θ = π/3 = 60°, cos(60°) = 1/2, sin(60°) = √3/2 ≈ 0,8660.",
        },
      ],
    },

    {
      title: "Somme Z_ligne + Z₂",
      note: `Addition cartésienne : on additionne parties réelles d'un côté, parties imaginaires de l'autre.`,
      math: [
        "\\underline{Z}_\\text{ligne} + \\underline{Z_2} = (1 + 12{,}5) + j(0{,}5 + 21{,}65) = 13{,}5 + j\\,22{,}15\\ \\Omega",
      ],
    },

    {
      title: "Modules",
      note: `Pour la valeur efficace, on prend les modules. <em>U₂ = U · |Z₂| / |Z<sub>ligne</sub>+Z₂|</em>.`,
      math: [
        "|\\underline{Z_2}| = 25\\ \\Omega",
        "|\\underline{Z}_\\text{ligne}+\\underline{Z_2}| = \\sqrt{13{,}5^2 + 22{,}15^2} = \\sqrt{182{,}25 + 490{,}62} \\approx \\sqrt{672{,}87} \\approx 25{,}94\\ \\Omega",
      ],
      subSteps: [
        {
          text: "Module d'un complexe a + jb : |a + jb| = √(a² + b²). C'est le théorème de Pythagore appliqué dans le plan complexe.",
        },
      ],
    },

    {
      title: "Valeur efficace U₂",
      note: `On applique le module du diviseur. Avec <em>U = 240 V</em>.`,
      math: [
        "U_2 = U\\cdot\\dfrac{|\\underline{Z_2}|}{|\\underline{Z}_\\text{ligne}+\\underline{Z_2}|} = 240\\cdot\\dfrac{25}{25{,}94}",
        "\\boxed{\\,U_2 \\approx 231{,}3\\ \\text{V}\\,}",
      ],
    },

    {
      title: "Déphasage de u par rapport à u₂",
      note: `Le déphasage <em>φ</em> est l'argument du rapport <em>U/U₂ = (Z<sub>ligne</sub>+Z₂)/Z₂</em>.`,
      math: [
        "\\varphi_{u/u_2} = \\arg(\\underline{Z}_\\text{ligne}+\\underline{Z_2}) - \\arg(\\underline{Z_2})",
        "\\arg(\\underline{Z}_\\text{ligne}+\\underline{Z_2}) = \\arctan\\!\\dfrac{22{,}15}{13{,}5} \\approx 58{,}65^\\circ",
        "\\arg(\\underline{Z_2}) = \\dfrac{\\pi}{3} = 60^\\circ",
        "\\boxed{\\,\\varphi_{u/u_2} \\approx -1{,}35^\\circ\\,}",
      ],
      subSteps: [
        {
          text: "Argument d'un complexe a + jb : arg = arctan(b/a) (avec correction de quadrant). On lit l'angle avec lequel le vecteur pointe par rapport à l'axe réel positif.",
        },
        {
          text: "Le déphasage est très petit : la ligne ajoute peu d'impédance par rapport au récepteur. C'est typique d'une ligne « courte ».",
        },
      ],
      figure: () => phasorDiagram({
        title: "u légèrement en retard sur u₂",
        size: 320,
        vectors: [
          { label: "U₂", mag: 95, deg: 60, color: "var(--phasor-1)" },
          { label: "U",  mag: 110, deg: 58.65, color: "var(--phasor-4)" },
        ],
      }),
    },

  ],
};

// --------------------------------------------------------------
// Final presentation export
// --------------------------------------------------------------
export const exercice4Presentation = {
  title: "Exercice 4 — Diviseurs",
  chapters: [
    chapter4aOriginal,
    chapter4aNoR,
    chapter4aTwoCaps,
    chapter4b,
  ],
};
