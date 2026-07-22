// Scene data for the animated correction of Exercise 4 — Dividers.
// Each chapter is a sequence of steps; each step is rendered by animator.js.

import { ex4aCircuit, ex4bCircuit, phasorDiagram } from "./circuits.js";

// Helpers used throughout.
const fig = (builder, args) => () => builder(args);

// --------------------------------------------------------------
// Chapter 1 — 4a) Original: RL // (RL in series with C)
// --------------------------------------------------------------

// Roadmap shared across all steps of chapter 1 — three questions, each with stages.
const Q1_STAGES = [
  "Write Z₁ and Z₂ for the two branches",
  "Simplify 1/(jωC) to −j/(ωC)",
  "Put Z₂ in the form R + jX₂",
  "Compute I₁/I₂ = Z₂/Z₁",
  "Read the lead / lag from the −j factor",
];
const Q2_STAGES = [
  "Convert Z₂/Z₁ to Cartesian form (×conjugate)",
  "Expand the numerator (FOIL)",
  "Set the real part to zero → constraint on X₂",
  "Substitute X₂ = ωL − 1/(ωC) and isolate",
  "Put over a common denominator",
  "Invert to obtain C",
];
const Q3_STAGES = [
  "Read the remaining imaginary part",
  "Substitute X₂ and read k",
];

const Q1 = (current, completedNote) => ({
  question: "Q1 — I₁/I₂ = −jk: lead or lag?",
  stages: Q1_STAGES,
  current,
  completedNote,
});
const Q2 = (current, completedNote) => ({
  question: "Q2 — Find the capacitance C",
  stages: Q2_STAGES,
  current,
  completedNote,
});
const Q3 = (current, completedNote) => ({
  question: "Q3 — Computing the factor k",
  stages: Q3_STAGES,
  current,
  completedNote,
});

const chapter4aOriginal = {
  label: "4a) Original case",
  defaultFigure: () => ex4aCircuit({ scenario: "original" }),
  steps: [

    {
      title: "The circuit and the physical idea",
      note: `Two identical windings, modeled as <strong>series RL</strong> circuits, are placed in parallel and driven by the same sinusoidal voltage <em>u</em>. In the right-hand branch, we add a capacitor <em>C</em> in series. <br /><br />Goal: drive currents through the two windings <strong>in quadrature</strong>, i.e. exactly <em>90°</em> out of phase. It is this quadrature that allows a single-phase motor to start (rotating field).`,
      roadmap: Q1(0),
      math: [
        "\\underline{Z_1} = R + j\\omega L",
        "\\underline{Z_2} = R + j\\omega L + \\dfrac{1}{j\\omega C}",
      ],
      figure: fig(ex4aCircuit, { scenario: "original" }),
    },

    {
      title: "Simplifying 1/(jωC)",
      note: `We want to write the capacitor's impedance in the Cartesian form <em>a + jb</em>. The key rule: <strong>1/j = −j</strong>.<br /><br />The sub-explanation below re-derives why.`,
      roadmap: Q1(1),
      math: [
        "\\dfrac{1}{j\\omega C} \\;=\\; \\dfrac{1}{j}\\cdot\\dfrac{1}{\\omega C} \\;=\\; -\\dfrac{j}{\\omega C}",
      ],
      subSteps: [
        {
          text: "Why is 1/j = −j? We multiply by j/j (which equals 1):",
          math: [
            "\\dfrac{1}{j} \\;=\\; \\dfrac{1}{j}\\cdot\\dfrac{j}{j} \\;=\\; \\dfrac{j}{j^2} \\;=\\; \\dfrac{j}{-1} \\;=\\; -j",
          ],
        },
        {
          text: "Remember: multiplying by 1/j rotates by −90°, exactly like −j.",
        },
      ],
      figure: fig(ex4aCircuit, { scenario: "original", emphasis: "branch2" }),
    },

    {
      title: "Cartesian form of Z₂",
      note: `We factor out <em>j</em> in the imaginary part to bring out the <strong>total reactance</strong> of branch 2.`,
      roadmap: Q1(2, "We now have Z₂ in clean form: R + j·X₂ with X₂ = ωL − 1/(ωC)."),
      math: [
        "\\underline{Z_2} = R + j\\omega L - \\dfrac{j}{\\omega C}",
        "\\underline{Z_2} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)",
      ],
      subSteps: [
        {
          text: "Justifying the factoring: all the imaginary terms share the factor j. We pull it out, exactly as we would factor x out of (3x − 5x).",
          math: ["j\\omega L - \\dfrac{j}{\\omega C} = j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)"],
        },
      ],
    },

    {
      title: "Ratio of the currents — current divider",
      note: `The two branches see the <strong>same voltage</strong> (they are in parallel). So <em>I₁ = U/Z₁</em> and <em>I₂ = U/Z₂</em>. The ratio eliminates <em>U</em>.`,
      roadmap: Q1(3),
      math: [
        "\\underline{I_1} = \\dfrac{\\underline{U}}{\\underline{Z_1}}, \\qquad \\underline{I_2} = \\dfrac{\\underline{U}}{\\underline{Z_2}}",
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} \\;=\\; \\dfrac{\\underline{U}/\\underline{Z_1}}{\\underline{U}/\\underline{Z_2}} \\;=\\; \\dfrac{\\underline{Z_2}}{\\underline{Z_1}}",
      ],
      subSteps: [
        {
          text: "Algebraic trick: dividing two fractions amounts to multiplying by the reciprocal:",
          math: ["\\dfrac{a/b}{a/c} = \\dfrac{a}{b}\\cdot\\dfrac{c}{a} = \\dfrac{c}{b}"],
        },
      ],
    },

    {
      title: "Lead or lag? We want −jk",
      note: `We aim to impose <strong>I₁/I₂ = −jk</strong> with <em>k > 0</em>. Geometrically, multiplying by <em>−j</em> rotates a quarter turn clockwise (−90°). So <em>I₁</em> <strong>lags</strong> <em>I₂</em> by 90°; in other words, <em>I₂</em> <strong>leads</strong> <em>I₁</em> by 90°.<br /><br />That is consistent: branch 2, more capacitive (because of the capacitor), makes its current <em>lead</em>.`,
      roadmap: Q1(4, "Q1 answered: I₂ leads I₁. It remains to choose C so that it is exactly 90° (Q2)."),
      math: [
        "-jk \\;\\Longleftrightarrow\\; \\text{magnitude } k,\\ \\text{argument } -90^\\circ",
      ],
      figure: () => phasorDiagram({
        title: "I₁ lags I₂ by 90°",
        size: 280, scale: 1,
        vectors: [
          { label: "I₂", mag: 100, deg: 0,   color: "var(--phasor-1)" },
          { label: "I₁", mag: 80,  deg: -90, color: "var(--phasor-2)" },
        ],
      }),
    },

    {
      title: "Computing Z₂/Z₁ — multiply by the conjugate",
      note: `To make the denominator real and easily read the real/imaginary parts, we multiply numerator and denominator by <strong>the conjugate of Z₁</strong>, that is <em>R − jωL</em>. This is the standard technique for dividing two complex numbers in Cartesian form.`,
      roadmap: Q2(0),
      math: [
        "\\dfrac{\\underline{Z_2}}{\\underline{Z_1}} \\;=\\; \\dfrac{\\underline{Z_2}\\,(R-j\\omega L)}{(R+j\\omega L)(R-j\\omega L)}",
        "(R+j\\omega L)(R-j\\omega L) \\;=\\; R^2 + (\\omega L)^2",
      ],
      subSteps: [
        {
          text: "Well-known identity: (a+b)(a−b) = a² − b². With b = jωL, we get b² = j²(ωL)² = −(ωL)², hence the + in the result.",
          math: [
            "(R+j\\omega L)(R-j\\omega L) = R^2 - (j\\omega L)^2 = R^2 + (\\omega L)^2",
          ],
        },
      ],
    },

    {
      title: "Expanding the numerator",
      note: `We write <em>X₂ = ωL − 1/(ωC)</em> to lighten the notation. We expand (R + jX₂)(R − jωL) term by term.`,
      roadmap: Q2(1, "Z₂/Z₁ = (R² + X₂·ωL)/(R²+(ωL)²) + j·R(X₂−ωL)/(R²+(ωL)²). We now have two levers: the real part (which we will set to zero for Q2) and the imaginary part (which we will read for Q3)."),
      math: [
        "(R+jX_2)(R-j\\omega L) = R^2 - jR\\omega L + jR X_2 - j^2 X_2 \\omega L",
        "= \\bigl(R^2 + X_2 \\omega L\\bigr) + j\\bigl(R X_2 - R\\omega L\\bigr)",
      ],
      subSteps: [
        {
          text: "We expand by double distributivity (FOIL):",
          math: ["(a+b)(c+d) = ac + ad + bc + bd"],
        },
        {
          text: "The term −j²X₂ωL becomes +X₂ωL because j² = −1.",
        },
      ],
    },

    {
      title: "Imposing a zero real part",
      note: `We now have the ratio in Cartesian form: <strong>Z₂/Z₁ = a + j·b</strong>. For it to have the form <strong>−jk</strong> required by the statement (purely imaginary), we need <em>a = 0</em>. That is exactly the <strong>quadrature condition</strong>, translated into algebra.<br /><br />This equation does not contain C directly — it first gives us a constraint on <em>X₂</em>. C is hidden inside <em>X₂</em> and will appear in the next step.`,
      roadmap: Q2(2, "We have already obtained: R² + X₂·ωL = 0 ⟹ X₂ = −R²/(ωL). This is the constraint used to find C."),
      whyStep: {
        summary: "Reminder — why do we set the real part to zero?",
        openByDefault: true,
        body: `<p>The goal of the whole exercise (Q2) is: <strong>which value of C gives I₁/I₂ = −jk</strong>?</p>
<p>Now <em>−jk</em> is a <strong>purely imaginary</strong> number: its real part is zero. Since we wrote Z₂/Z₁ in the form <em>a + j·b</em>, it suffices to impose <em>a = 0</em>.</p>
<p>This equation <em>a = 0</em> involves only the real part of the numerator (namely <em>R² + X₂·ωL</em>). It relates <em>X₂</em> to <em>R</em> and <em>ωL</em>. The coefficient of <em>j</em> (the imaginary part) will be used <strong>later</strong>, in Q3, to read off the value of <em>k</em>.</p>`,
        math: [
          "a + jb \\text{ purely imaginary } \\;\\Longleftrightarrow\\; a = 0",
        ],
      },
      math: [
        "\\dfrac{\\underline{Z_2}}{\\underline{Z_1}} = \\underbrace{\\dfrac{R^2 + X_2\\,\\omega L}{R^2+(\\omega L)^2}}_{a\\ =\\ \\Re} + j\\underbrace{\\dfrac{R(X_2 - \\omega L)}{R^2+(\\omega L)^2}}_{b\\ =\\ \\Im}",
        "\\text{Condition} : \\quad a = 0 \\;\\Longleftrightarrow\\; R^2 + X_2\\,\\omega L = 0",
        "\\Longleftrightarrow\\; \\boxed{\\,X_2 = -\\dfrac{R^2}{\\omega L}\\,}",
      ],
      subSteps: [
        {
          text: "Visually: a complex number a + jb is represented by a point/vector in the complex plane. “Purely imaginary” means the point lies on the vertical (Im) axis — its horizontal (Re) coordinate is zero.",
        },
        {
          text: "The denominator R² + (ωL)² is strictly positive (a sum of squares). So it can never vanish — only the numerator matters for the “real part = 0” condition.",
        },
      ],
      figure: () => phasorDiagram({
        title: "We want to bring Z₂/Z₁ onto the Im⁻ axis (= -jk)",
        size: 280, scale: 1,
        vectors: [
          { label: "Z₂/Z₁ before", mag: 90, deg: -30, color: "var(--phasor-3)" },
          { label: "Target (-jk)", mag: 90, deg: -90, color: "var(--accent-warm)" },
        ],
      }),
    },

    {
      title: "We replace X₂ by its definition",
      note: `The previous step <strong>extracted</strong> from the big formula the only constraint that solves Q2: <em>X₂ = −R²/(ωL)</em>. The imaginary part is set aside for Q3.<br /><br />Now, we go back to <em>X₂ = ωL − 1/(ωC)</em>: <em>C</em> is hidden in there. We substitute, and all that remains is to isolate the capacitive term.`,
      roadmap: Q2(3),
      whyStep: {
        summary: "Reminder — why don't we use the big formula anymore?",
        openByDefault: true,
        body: `<p>In step 7, we had written Z₂/Z₁ as a sum of two big pieces:</p>
<ul>
  <li>a <strong>real part</strong> <em>(R² + X₂·ωL) / (R² + (ωL)²)</em>;</li>
  <li>an <strong>imaginary part</strong> <em>R(X₂ − ωL) / (R² + (ωL)²)</em> multiplied by <em>j</em>.</li>
</ul>
<p>Step 8 used <strong>the real part</strong> to answer Q2: "real part = 0" immediately gives the equation <em>X₂ = −R²/(ωL)</em>. That is all we need to compute C.</p>
<p>The imaginary part is <strong>not lost</strong> — it will be used in step 12 to read <em>k</em> (Q3). For Q2, it is simply set aside.</p>
<p>So in this step, we work only with <em>X₂ = −R²/(ωL)</em>, because it is the only equation containing C that we have to solve.</p>`,
      },
      math: [
        "\\text{Definition reminder: }\\; X_2 = \\omega L - \\dfrac{1}{\\omega C}",
        "\\text{Constraint from step 8: }\\; X_2 = -\\dfrac{R^2}{\\omega L}",
        "\\Longrightarrow\\; \\omega L - \\dfrac{1}{\\omega C} = -\\dfrac{R^2}{\\omega L}",
        "\\Longrightarrow\\; \\dfrac{1}{\\omega C} = \\omega L + \\dfrac{R^2}{\\omega L}",
      ],
      subSteps: [
        {
          text: "We simply moved ωL to the right (by adding ωL to both sides) and flipped the sign of the second term. It is a linear manipulation.",
        },
        {
          text: "Quick recap of the “division of labor” between the two parts of Z₂/Z₁:",
          math: [
            "\\underbrace{R^2 + X_2\\,\\omega L = 0}_{\\text{used for Q2 → C}} \\quad ; \\quad \\underbrace{R(X_2 - \\omega L)}_{\\text{will be used for Q3 → k}}",
          ],
        },
      ],
    },

    {
      title: "Putting over a common denominator",
      note: `We combine the sum on the right into a single fraction. This step illustrates a classic manipulation: <em>a + a/b = (ab + a)/b</em>, which relies on the identity <em>a = a·b/b</em> since <em>b/b = 1</em>.`,
      roadmap: Q2(4),
      math: [
        "\\dfrac{1}{\\omega C} = \\dfrac{(\\omega L)^2 + R^2}{\\omega L}",
      ],
      subSteps: [
        {
          text: "Detail of the manipulation a + b/c = (ac + b)/c. We write a in the form a·c/c, then add the two fractions, which now have the same denominator.",
          math: [
            "\\omega L = \\dfrac{\\omega L \\cdot \\omega L}{\\omega L} = \\dfrac{(\\omega L)^2}{\\omega L}",
            "\\omega L + \\dfrac{R^2}{\\omega L} = \\dfrac{(\\omega L)^2}{\\omega L} + \\dfrac{R^2}{\\omega L} = \\dfrac{(\\omega L)^2 + R^2}{\\omega L}",
          ],
        },
        {
          text: "Why is ωL/ωL = 1? Any nonzero number divided by itself equals 1. This trick lets us write a number as a fraction with any denominator we like.",
        },
      ],
    },

    {
      title: "Inverting and final result for C",
      note: `It remains to invert to obtain <em>ωC</em>, then divide by <em>ω</em>.`,
      roadmap: Q2(5, "Q2 answered: C = L / (R² + (ωL)²). It remains to compute k (Q3)."),
      math: [
        "\\omega C = \\dfrac{\\omega L}{R^2 + (\\omega L)^2}",
        "\\boxed{\\,C = \\dfrac{L}{R^2 + (\\omega L)^2}\\,}",
      ],
      subSteps: [
        {
          text: "Inverting a fraction = taking the reciprocal. (a/b)⁻¹ = b/a.",
          math: ["\\left(\\dfrac{1}{\\omega C}\\right)^{-1} = \\omega C"],
        },
      ],
    },

    {
      title: "Computing the factor k",
      note: `Since the real part is zero, the ratio is purely imaginary. We then read <em>k</em> off the coefficient of <em>j</em>. We start from the imaginary part <em>R(X₂ − ωL)/[R² + (ωL)²]</em> (set aside in step 8), then substitute <em>X₂ = −R²/(ωL)</em>.`,
      roadmap: Q3(1, "Q3 answered: k = R/(ωL). All of part a) is complete."),
      whyStep: {
        summary: "Reminder — where does this imaginary part come from?",
        body: `<p>In step 7, we had written Z₂/Z₁ = <em>a + j·b</em>, with <em>b = R(X₂ − ωL)/(R² + (ωL)²)</em>.</p>
<p>Step 8 set <em>a</em> to zero to make the ratio purely imaginary. Once that is done, what remains is <em>j·b</em>. Identifying <em>j·b = −jk</em> gives <em>k = −b</em>.</p>
<p>Now we use the constraint <em>X₂ = −R²/(ωL)</em> found in step 8 to compute <em>b</em>, and hence <em>k</em>.</p>`,
      },
      math: [
        "X_2 - \\omega L = -\\dfrac{R^2}{\\omega L} - \\omega L = -\\dfrac{R^2 + (\\omega L)^2}{\\omega L}",
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = j\\cdot\\dfrac{R\\bigl(X_2 - \\omega L\\bigr)}{R^2 + (\\omega L)^2} = -j\\cdot\\dfrac{R}{\\omega L}",
        "\\boxed{\\,k = \\dfrac{R}{\\omega L}\\,}",
      ],
      figure: () => phasorDiagram({
        title: "Quadrature achieved: I₂ ⟂ I₁",
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
// Chapter 2 — Scenario 1: R = 0
// --------------------------------------------------------------
const chapter4aNoR = {
  label: "Scenario 1: R = 0",
  defaultFigure: () => ex4aCircuit({ scenario: "noR" }),
  steps: [

    {
      title: "Assumption: ideal windings",
      note: `We assume the windings are pure inductances, so <em>R = 0</em>. What becomes of the quadrature condition?`,
      math: [
        "\\underline{Z_1} = j\\omega L",
        "\\underline{Z_2} = j\\omega L + \\dfrac{1}{j\\omega C} = j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)",
      ],
    },

    {
      title: "The ratio becomes real",
      note: `Since both impedances share a common factor <em>j</em>, it cancels out. The ratio <em>I₁/I₂ = Z₂/Z₁</em> becomes <strong>purely real</strong>.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = \\dfrac{j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)}{j\\,\\omega L} = \\dfrac{\\omega L - \\dfrac{1}{\\omega C}}{\\omega L} = 1 - \\dfrac{1}{\\omega^2 L C}",
      ],
      subSteps: [
        {
          text: "The j on top and bottom cancel: j/j = 1. Then we divide the fraction term by term.",
          math: [
            "\\dfrac{\\omega L}{\\omega L} - \\dfrac{1/(\\omega C)}{\\omega L} = 1 - \\dfrac{1}{\\omega^2 L C}",
          ],
        },
      ],
    },

    {
      title: "Conclusion: no exact quadrature",
      note: `A <strong>real</strong> number can never be written <em>−jk</em> (purely imaginary) unless it is zero. Exact quadrature is <strong>impossible</strong> in this circuit without resistance.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = 1 - \\dfrac{1}{\\omega^2 LC} \\in \\mathbb{R}",
        "\\boxed{\\,R=0 \\;\\Longrightarrow\\; \\text{no exact quadrature.}\\,}",
      ],
      figure: () => phasorDiagram({
        title: "Inductive case: I₁ and I₂ in phase; capacitive case: opposition",
        size: 280, scale: 1,
        vectors: [
          { label: "I₁", mag: 90, deg: -90, color: "var(--phasor-2)" },
          { label: "I₂ (inductive)", mag: 60, deg: -90, color: "var(--phasor-1)" },
          { label: "I₂ (capacitive)", mag: 60, deg: 90, color: "var(--phasor-3)" },
        ],
      }),
    },

    {
      title: "Worse still: at resonance",
      note: `If we reuse the formula <em>C = L/(R² + (ωL)²)</em> with <em>R = 0</em>, we get <em>C = 1/(ω²L)</em>, which exactly cancels the reactance of branch 2 — this is <strong>series LC resonance</strong>. The branch becomes a short circuit (zero impedance) and the current would blow up in the ideal model.`,
      math: [
        "C = \\dfrac{L}{(\\omega L)^2} = \\dfrac{1}{\\omega^2 L}",
        "\\dfrac{1}{\\omega C} = \\omega L \\;\\Longrightarrow\\; \\omega L - \\dfrac{1}{\\omega C} = 0 \\;\\Longrightarrow\\; \\underline{Z_2} = 0",
      ],
      subSteps: [
        {
          text: "Moral: the resistance R is not a detail — it is essential for exact quadrature to exist. It also limits the current at resonance.",
        },
      ],
    },

  ],
};

// --------------------------------------------------------------
// Chapter 3 — Scenario 2: a capacitor in each branch
// --------------------------------------------------------------
const chapter4aTwoCaps = {
  label: "Scenario 2: two capacitors",
  defaultFigure: () => ex4aCircuit({ scenario: "twoCaps" }),
  steps: [

    {
      title: "New configuration",
      note: `We add a capacitor <em>C₁</em> in series with branch 1 (in addition to branch 2's <em>C₂</em>). We write the total reactances as <em>X₁</em> and <em>X₂</em>.`,
      math: [
        "\\underline{Z_1} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C_1}\\right) = R + jX_1",
        "\\underline{Z_2} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C_2}\\right) = R + jX_2",
      ],
    },

    {
      title: "Ratio of the currents",
      note: `Still <em>I₁/I₂ = Z₂/Z₁</em>. We multiply by the conjugate <em>R − jX₁</em> of the denominator.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = \\dfrac{R + jX_2}{R + jX_1} = \\dfrac{(R+jX_2)(R-jX_1)}{R^2 + X_1^2}",
      ],
    },

    {
      title: "Expanding the numerator",
      note: `We use <em>j(−j) = 1</em> for the product of the imaginary terms.`,
      math: [
        "(R+jX_2)(R-jX_1) = R^2 - jRX_1 + jRX_2 + X_1 X_2",
        "= \\bigl(R^2 + X_1 X_2\\bigr) + jR\\bigl(X_2 - X_1\\bigr)",
      ],
      subSteps: [
        {
          text: "The product (jX₂)(−jX₁) = −j²X₁X₂ = −(−1)X₁X₂ = +X₁X₂. The j² = −1 flips the sign.",
        },
      ],
    },

    {
      title: "Quadrature condition",
      note: `To have <em>I₁/I₂ = −jk</em>, we set the real part to zero.`,
      math: [
        "R^2 + X_1 X_2 = 0",
        "\\boxed{\\,X_1 X_2 = -R^2\\,}",
        "\\Longleftrightarrow\\; \\left(\\omega L - \\dfrac{1}{\\omega C_1}\\right)\\!\\left(\\omega L - \\dfrac{1}{\\omega C_2}\\right) = -R^2",
      ],
    },

    {
      title: "Sign condition — to get k > 0",
      note: `Once the real part is set to zero, what remains is <em>I₁/I₂ = j·R(X₂ − X₁)/(R² + X₁²)</em>. We want the form <strong>−jk</strong> with <em>k > 0</em>, so the coefficient of <em>j</em> must be <strong>negative</strong>. This imposes <em>X₂ − X₁ < 0</em>, that is <strong>X₂ &lt; X₁</strong>.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = j\\cdot\\dfrac{R(X_2 - X_1)}{R^2 + X_1^2} = -j\\cdot\\dfrac{R(X_1 - X_2)}{R^2 + X_1^2}",
        "\\boxed{\\,k = \\dfrac{R(X_1 - X_2)}{R^2 + X_1^2}\\,}",
        "\\boxed{\\,X_2 < X_1\\,}",
      ],
      subSteps: [
        {
          text: "We simply factored out a minus sign to bring out the expected −jk form. If we did not impose X₂ < X₁, we would get k < 0, hence the opposite phase shift: I₁ leading I₂ instead of lagging. The physical roles of the two branches would be swapped.",
        },
        {
          text: "Concretely, since X₁X₂ = −R² < 0, one reactance is positive and the other negative. The convention X₂ < X₁ amounts to choosing branch 2 as the more capacitive (the less inductive) one.",
        },
      ],
    },

    {
      title: "Physical interpretation",
      note: `The product <em>X₁X₂ = −R²</em> is <strong>negative</strong>. So <em>X₁</em> and <em>X₂</em> have <strong>opposite signs</strong>: one branch is overall inductive (<em>X > 0</em>), the other overall capacitive (<em>X < 0</em>). That is physically how a 90° phase shift between the two currents is obtained.`,
      math: [
        "X_1 X_2 < 0 \\;\\Longleftrightarrow\\; \\text{one branch inductive, the other capacitive}",
      ],
      figure: () => phasorDiagram({
        title: "One branch inductive, the other capacitive",
        size: 280,
        vectors: [
          { label: "U", mag: 100, deg: 0, color: "var(--phasor-4)" },
          { label: "I₁", mag: 80, deg: -45, color: "var(--phasor-2)" },
          { label: "I₂", mag: 80, deg: 45, color: "var(--phasor-1)" },
        ],
      }),
    },

    {
      title: "C₂ as a function of C₁ (if C₁ is fixed)",
      note: `Suppose <em>C₁</em> is imposed. We seek the <em>C₂</em> that satisfies the condition <em>X₁X₂ = −R²</em>. If <em>X₁ ≠ 0</em>, we isolate <em>X₂</em> and then work back to <em>C₂</em>.`,
      math: [
        "X_2 = -\\dfrac{R^2}{X_1} \\;\\Longleftrightarrow\\; \\omega L - \\dfrac{1}{\\omega C_2} = -\\dfrac{R^2}{X_1}",
        "\\dfrac{1}{\\omega C_2} = \\omega L + \\dfrac{R^2}{X_1}",
        "\\boxed{\\,C_2 = \\dfrac{1}{\\omega\\!\\left(\\omega L + \\dfrac{R^2}{\\,\\omega L - \\dfrac{1}{\\omega C_1}\\,}\\right)}\\,}",
      ],
      subSteps: [
        {
          text: "We replaced X₁ by its definition ωL − 1/(ωC₁) in the last line. This formula is valid only if X₁ ≠ 0, i.e. if branch 1 is not at LC₁ resonance (where ωL = 1/(ωC₁)).",
          math: ["X_1 = \\omega L - \\dfrac{1}{\\omega C_1}"],
        },
        {
          text: "Limiting case: if C₁ → ∞ (no capacitor in branch 1), then 1/(ωC₁) → 0 and X₁ → ωL. We fall back exactly onto the original case — as the next step shows.",
        },
      ],
    },

    {
      title: "Special case: we recover the original exercise",
      note: `If branch 1 has no capacitor, then <em>C₁ → ∞</em>, so <em>1/(ωC₁) = 0</em> and <em>X₁ = ωL</em>. The condition <em>X₁X₂ = −R²</em> gives back exactly the formula of the original case.`,
      math: [
        "\\omega L \\cdot X_2 = -R^2 \\;\\Longrightarrow\\; X_2 = -\\dfrac{R^2}{\\omega L}",
        "\\dfrac{1}{\\omega C_2} = \\omega L + \\dfrac{R^2}{\\omega L} = \\dfrac{R^2 + (\\omega L)^2}{\\omega L}",
        "\\boxed{\\,C_2 = \\dfrac{L}{R^2 + (\\omega L)^2}\\,}",
      ],
    },

  ],
};

// --------------------------------------------------------------
// Chapter 4 — 4b) Voltage divider
// --------------------------------------------------------------
const chapter4b = {
  label: "4b) Voltage divider",
  defaultFigure: () => ex4bCircuit(),
  steps: [

    {
      title: "Equivalent circuit",
      note: `A source <em>u</em> supplies, through a <strong>line</strong> (resistance <em>R = 1 Ω</em>, reactance <em>X<sub>L</sub> = 0.5 Ω</em>), a load of impedance <em>Z₂ = 25·e^{jπ/3} Ω</em>. The voltage we seek, <em>u₂</em>, is across the load.`,
      math: [
        "\\underline{Z}_\\text{line} = R + jX_L = 1 + j\\,0.5\\ \\Omega",
        "\\underline{Z_2} = 25\\,e^{j\\pi/3}\\ \\Omega",
      ],
      figure: () => ex4bCircuit({ emphasis: "line" }),
    },

    {
      title: "Voltage divider",
      note: `Since <em>Z<sub>line</sub></em> and <em>Z₂</em> are in series, carrying the same current, the voltage splits in proportion to the impedances.`,
      math: [
        "\\underline{U_2} = \\underline{U}\\cdot\\dfrac{\\underline{Z_2}}{\\underline{Z}_\\text{line}+\\underline{Z_2}}",
      ],
    },

    {
      title: "Z₂ in Cartesian form",
      note: `We convert <em>Z₂</em> from polar to Cartesian form so we can add it to <em>Z<sub>line</sub></em>.`,
      math: [
        "\\underline{Z_2} = 25\\bigl(\\cos 60^\\circ + j\\sin 60^\\circ\\bigr)",
        "= 25\\,(0.5 + j\\,0.8660) = 12.5 + j\\,21.65\\ \\Omega",
      ],
      subSteps: [
        {
          text: "Euler's formula: e^{jθ} = cos θ + j sin θ. With θ = π/3 = 60°, cos(60°) = 1/2, sin(60°) = √3/2 ≈ 0.8660.",
        },
      ],
    },

    {
      title: "Sum Z_line + Z₂",
      note: `Cartesian addition: we add real parts on one side, imaginary parts on the other.`,
      math: [
        "\\underline{Z}_\\text{line} + \\underline{Z_2} = (1 + 12.5) + j(0.5 + 21.65) = 13.5 + j\\,22.15\\ \\Omega",
      ],
    },

    {
      title: "Magnitudes",
      note: `For the RMS value, we take the magnitudes. <em>U₂ = U · |Z₂| / |Z<sub>line</sub>+Z₂|</em>.`,
      math: [
        "|\\underline{Z_2}| = 25\\ \\Omega",
        "|\\underline{Z}_\\text{line}+\\underline{Z_2}| = \\sqrt{13.5^2 + 22.15^2} = \\sqrt{182.25 + 490.62} \\approx \\sqrt{672.87} \\approx 25.94\\ \\Omega",
      ],
      subSteps: [
        {
          text: "Magnitude of a complex number a + jb: |a + jb| = √(a² + b²). It is the Pythagorean theorem applied in the complex plane.",
        },
      ],
    },

    {
      title: "RMS value U₂",
      note: `We apply the magnitude of the divider. With <em>U = 240 V</em>.`,
      math: [
        "U_2 = U\\cdot\\dfrac{|\\underline{Z_2}|}{|\\underline{Z}_\\text{line}+\\underline{Z_2}|} = 240\\cdot\\dfrac{25}{25.94}",
        "\\boxed{\\,U_2 \\approx 231.3\\ \\text{V}\\,}",
      ],
    },

    {
      title: "Phase shift of u relative to u₂",
      note: `The phase shift <em>φ</em> is the argument of the ratio <em>U/U₂ = (Z<sub>line</sub>+Z₂)/Z₂</em>.`,
      math: [
        "\\varphi_{u/u_2} = \\arg(\\underline{Z}_\\text{line}+\\underline{Z_2}) - \\arg(\\underline{Z_2})",
        "\\arg(\\underline{Z}_\\text{line}+\\underline{Z_2}) = \\arctan\\!\\dfrac{22.15}{13.5} \\approx 58.65^\\circ",
        "\\arg(\\underline{Z_2}) = \\dfrac{\\pi}{3} = 60^\\circ",
        "\\boxed{\\,\\varphi_{u/u_2} \\approx -1.35^\\circ\\,}",
      ],
      subSteps: [
        {
          text: "Argument of a complex number a + jb: arg = arctan(b/a) (with quadrant correction). It is the angle at which the vector points relative to the positive real axis.",
        },
        {
          text: "The phase shift is very small: the line adds little impedance compared with the load. Typical of a “short” line.",
        },
      ],
      figure: () => phasorDiagram({
        title: "u slightly lagging u₂",
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
  title: "Exercise 4 — Dividers",
  chapters: [
    chapter4aOriginal,
    chapter4aNoR,
    chapter4aTwoCaps,
    chapter4b,
  ],
};
