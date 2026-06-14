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
  "Escribir Z₁ y Z₂ para las dos ramas",
  "Simplificar 1/(jωC) en −j/(ωC)",
  "Poner Z₂ en la forma R + jX₂",
  "Calcular I₁/I₂ = Z₂/Z₁",
  "Leer el adelanto / el retraso a partir del factor −j",
];
const Q2_STAGES = [
  "Cartesianizar Z₂/Z₁ (×conjugado)",
  "Desarrollar el numerador (FOIL)",
  "Anular la parte real → restricción sobre X₂",
  "Sustituir X₂ = ωL − 1/(ωC) y despejar",
  "Poner al mismo denominador",
  "Invertir para obtener C",
];
const Q3_STAGES = [
  "Leer la parte imaginaria restante",
  "Sustituir X₂ y leer k",
];

const Q1 = (current, completedNote) => ({
  question: "Q1 — I₁/I₂ = −jk : ¿adelanto o retraso?",
  stages: Q1_STAGES,
  current,
  completedNote,
});
const Q2 = (current, completedNote) => ({
  question: "Q2 — Encontrar la capacidad C",
  stages: Q2_STAGES,
  current,
  completedNote,
});
const Q3 = (current, completedNote) => ({
  question: "Q3 — Cálculo del factor k",
  stages: Q3_STAGES,
  current,
  completedNote,
});

const chapter4aOriginal = {
  label: "4a) Caso original",
  defaultFigure: () => ex4aCircuit({ scenario: "original" }),
  steps: [

    {
      title: "El circuito y la idea física",
      note: `Dos bobinados idénticos, modelados como <strong>RL en serie</strong>, se colocan en paralelo y se alimentan por la misma tensión sinusoidal <em>u</em>. En la rama de la derecha, se añade un condensador <em>C</em> en serie. <br /><br />Objetivo: hacer pasar por los dos bobinados corrientes <strong>en cuadratura</strong>, es decir desfasadas exactamente <em>90°</em>. Es esta cuadratura la que permite a un motor monofásico arrancar (campo giratorio).`,
      roadmap: Q1(0),
      math: [
        "\\underline{Z_1} = R + j\\omega L",
        "\\underline{Z_2} = R + j\\omega L + \\dfrac{1}{j\\omega C}",
      ],
      figure: fig(ex4aCircuit, { scenario: "original" }),
    },

    {
      title: "Simplificación de 1/(jωC)",
      note: `Se quiere escribir la impedancia del condensador en forma cartesiana <em>a + jb</em>. La regla clave: <strong>1/j = −j</strong>.<br /><br />La subexplicación de abajo vuelve a demostrar por qué.`,
      roadmap: Q1(1),
      math: [
        "\\dfrac{1}{j\\omega C} \\;=\\; \\dfrac{1}{j}\\cdot\\dfrac{1}{\\omega C} \\;=\\; -\\dfrac{j}{\\omega C}",
      ],
      subSteps: [
        {
          text: "¿Por qué 1/j = −j? Se multiplica por j/j (que vale 1):",
          math: [
            "\\dfrac{1}{j} \\;=\\; \\dfrac{1}{j}\\cdot\\dfrac{j}{j} \\;=\\; \\dfrac{j}{j^2} \\;=\\; \\dfrac{j}{-1} \\;=\\; -j",
          ],
        },
        {
          text: "Se retiene: multiplicar por 1/j hace girar −90°, exactamente como −j.",
        },
      ],
      figure: fig(ex4aCircuit, { scenario: "original", emphasis: "branch2" }),
    },

    {
      title: "Forma cartesiana de Z₂",
      note: `Se factoriza por <em>j</em> en la parte imaginaria para hacer aparecer la <strong>reactancia total</strong> de la rama 2.`,
      roadmap: Q1(2, "Ahora tenemos Z₂ limpia: R + j·X₂ con X₂ = ωL − 1/(ωC)."),
      math: [
        "\\underline{Z_2} = R + j\\omega L - \\dfrac{j}{\\omega C}",
        "\\underline{Z_2} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)",
      ],
      subSteps: [
        {
          text: "Justificación de la factorización: todos los términos imaginarios comparten el factor j. Se saca como factor común, exactamente como se factorizaría por x en (3x − 5x).",
          math: ["j\\omega L - \\dfrac{j}{\\omega C} = j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)"],
        },
      ],
    },

    {
      title: "Cociente de las corrientes — divisor de corriente",
      note: `Las dos ramas ven la <strong>misma tensión</strong> (están en paralelo). Por tanto <em>I₁ = U/Z₁</em> e <em>I₂ = U/Z₂</em>. El cociente elimina <em>U</em>.`,
      roadmap: Q1(3),
      math: [
        "\\underline{I_1} = \\dfrac{\\underline{U}}{\\underline{Z_1}}, \\qquad \\underline{I_2} = \\dfrac{\\underline{U}}{\\underline{Z_2}}",
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} \\;=\\; \\dfrac{\\underline{U}/\\underline{Z_1}}{\\underline{U}/\\underline{Z_2}} \\;=\\; \\dfrac{\\underline{Z_2}}{\\underline{Z_1}}",
      ],
      subSteps: [
        {
          text: "Truco algebraico: dividir dos fracciones equivale a multiplicar por la inversa:",
          math: ["\\dfrac{a/b}{a/c} = \\dfrac{a}{b}\\cdot\\dfrac{c}{a} = \\dfrac{c}{b}"],
        },
      ],
    },

    {
      title: "¿Adelanto o retraso? Queremos −jk",
      note: `Se busca imponer <strong>I₁/I₂ = −jk</strong> con <em>k > 0</em>. Geométricamente, multiplicar por <em>−j</em> hace girar un cuarto de vuelta en sentido horario (−90°). Por tanto <em>I₁</em> está en <strong>retraso de 90°</strong> respecto a <em>I₂</em>, dicho de otro modo <em>I₂</em> está en <strong>adelanto de 90°</strong> respecto a <em>I₁</em>.<br /><br />Es coherente: la rama 2, más capacitiva (a causa del condensador), <em>adelanta</em> su corriente.`,
      roadmap: Q1(4, "Q1 respondida: I₂ adelanta a I₁. Falta elegir C para que sea exactamente 90° (Q2)."),
      math: [
        "-jk \\;\\Longleftrightarrow\\; \\text{módulo } k,\\ \\text{argumento } -90^\\circ",
      ],
      figure: () => phasorDiagram({
        title: "I₁ en retraso de 90° respecto a I₂",
        size: 280, scale: 1,
        vectors: [
          { label: "I₂", mag: 100, deg: 0,   color: "var(--phasor-1)" },
          { label: "I₁", mag: 80,  deg: -90, color: "var(--phasor-2)" },
        ],
      }),
    },

    {
      title: "Cálculo de Z₂/Z₁ — multiplicar por el conjugado",
      note: `Para hacer real el denominador y leer fácilmente las partes real/imaginaria, se multiplica numerador y denominador por <strong>el conjugado de Z₁</strong>, es decir <em>R − jωL</em>. Es la técnica estándar para dividir dos complejos en cartesiano.`,
      roadmap: Q2(0),
      math: [
        "\\dfrac{\\underline{Z_2}}{\\underline{Z_1}} \\;=\\; \\dfrac{\\underline{Z_2}\\,(R-j\\omega L)}{(R+j\\omega L)(R-j\\omega L)}",
        "(R+j\\omega L)(R-j\\omega L) \\;=\\; R^2 + (\\omega L)^2",
      ],
      subSteps: [
        {
          text: "Identidad notable: (a+b)(a−b) = a² − b². Con b = jωL, se tiene b² = j²(ωL)² = −(ωL)², de donde el + en el resultado.",
          math: [
            "(R+j\\omega L)(R-j\\omega L) = R^2 - (j\\omega L)^2 = R^2 + (\\omega L)^2",
          ],
        },
      ],
    },

    {
      title: "Desarrollo del numerador",
      note: `Se denota <em>X₂ = ωL − 1/(ωC)</em> para simplificar. Se desarrolla (R + jX₂)(R − jωL) término a término.`,
      roadmap: Q2(1, "Z₂/Z₁ = (R² + X₂·ωL)/(R²+(ωL)²) + j·R(X₂−ωL)/(R²+(ωL)²). Ahora tenemos dos palancas: la parte real (que anularemos para Q2) y la parte imaginaria (que leeremos para Q3)."),
      math: [
        "(R+jX_2)(R-j\\omega L) = R^2 - jR\\omega L + jR X_2 - j^2 X_2 \\omega L",
        "= \\bigl(R^2 + X_2 \\omega L\\bigr) + j\\bigl(R X_2 - R\\omega L\\bigr)",
      ],
      subSteps: [
        {
          text: "Se desarrolla por doble distributividad (FOIL):",
          math: ["(a+b)(c+d) = ac + ad + bc + bd"],
        },
        {
          text: "El término −j²X₂ωL pasa a ser +X₂ωL porque j² = −1.",
        },
      ],
    },

    {
      title: "Imponer una parte real nula",
      note: `Ahora tenemos el cociente en forma cartesiana: <strong>Z₂/Z₁ = a + j·b</strong>. Para que tenga la forma <strong>−jk</strong> exigida por el enunciado (puramente imaginaria), hace falta que <em>a = 0</em>. Es exactamente la <strong>condición de cuadratura</strong>, traducida al álgebra.<br /><br />Esta ecuación no contiene C directamente — nos da primero una restricción sobre <em>X₂</em>. C está escondido en <em>X₂</em> y aparecerá en la etapa siguiente.`,
      roadmap: Q2(2, "Ya hemos obtenido: R² + X₂·ωL = 0 ⟹ X₂ = −R²/(ωL). Es la restricción que sirve para encontrar C."),
      whyStep: {
        summary: "Recordatorio — ¿por qué se anula la parte real?",
        openByDefault: true,
        body: `<p>El objetivo de todo el ejercicio (Q2) es: <strong>¿qué valor de C da I₁/I₂ = −jk</strong>?</p>
<p>Ahora bien, <em>−jk</em> es un número <strong>puramente imaginario</strong>: su parte real vale cero. Como hemos escrito Z₂/Z₁ en la forma <em>a + j·b</em>, basta por tanto con imponer <em>a = 0</em>.</p>
<p>Esta ecuación <em>a = 0</em> solo contiene la parte real del numerador (a saber <em>R² + X₂·ωL</em>). Relaciona <em>X₂</em> con <em>R</em> y <em>ωL</em>. El coeficiente delante de <em>j</em> (la parte imaginaria) se usará <strong>más tarde</strong>, en Q3, para leer el valor de <em>k</em>.</p>`,
        math: [
          "a + jb \\text{ puramente imaginario } \\;\\Longleftrightarrow\\; a = 0",
        ],
      },
      math: [
        "\\dfrac{\\underline{Z_2}}{\\underline{Z_1}} = \\underbrace{\\dfrac{R^2 + X_2\\,\\omega L}{R^2+(\\omega L)^2}}_{a\\ =\\ \\Re} + j\\underbrace{\\dfrac{R(X_2 - \\omega L)}{R^2+(\\omega L)^2}}_{b\\ =\\ \\Im}",
        "\\text{Condición} : \\quad a = 0 \\;\\Longleftrightarrow\\; R^2 + X_2\\,\\omega L = 0",
        "\\Longleftrightarrow\\; \\boxed{\\,X_2 = -\\dfrac{R^2}{\\omega L}\\,}",
      ],
      subSteps: [
        {
          text: "Visualmente: un número complejo a + jb se representa por un punto/vector en el plano complejo. «Puramente imaginario» significa que el punto está sobre el eje vertical (Im) — su coordenada horizontal (Re) es nula.",
        },
        {
          text: "El denominador R² + (ωL)² es estrictamente positivo (suma de cuadrados). Por tanto, nunca puede anularse — solo el numerador cuenta para la condición «parte real = 0».",
        },
      ],
      figure: () => phasorDiagram({
        title: "Queremos llevar Z₂/Z₁ al eje Im⁻ (= -jk)",
        size: 280, scale: 1,
        vectors: [
          { label: "Z₂/Z₁ antes", mag: 90, deg: -30, color: "var(--phasor-3)" },
          { label: "Objetivo (-jk)", mag: 90, deg: -90, color: "var(--accent-warm)" },
        ],
      }),
    },

    {
      title: "Se sustituye X₂ por su definición",
      note: `La etapa anterior <strong>extrajo</strong> de la fórmula grande la única restricción que resuelve Q2: <em>X₂ = −R²/(ωL)</em>. La parte imaginaria se reserva para Q3.<br /><br />Ahora se vuelve a <em>X₂ = ωL − 1/(ωC)</em>: <em>C</em> está escondido ahí dentro. Se sustituye, y solo queda despejar el término capacitivo.`,
      roadmap: Q2(3),
      whyStep: {
        summary: "Recordatorio — ¿por qué ya no se usa la fórmula grande?",
        openByDefault: true,
        body: `<p>En la etapa 7, habíamos escrito Z₂/Z₁ como una suma de dos grandes trozos:</p>
<ul>
  <li>una <strong>parte real</strong> <em>(R² + X₂·ωL) / (R² + (ωL)²)</em>;</li>
  <li>una <strong>parte imaginaria</strong> <em>R(X₂ − ωL) / (R² + (ωL)²)</em> multiplicada por <em>j</em>.</li>
</ul>
<p>La etapa 8 usó <strong>la parte real</strong> para responder a Q2: «parte real = 0» da de inmediato la ecuación <em>X₂ = −R²/(ωL)</em>. Es todo lo que necesitamos para calcular C.</p>
<p>La parte imaginaria <strong>no se pierde</strong> — servirá en la etapa 12 para leer <em>k</em> (Q3). Para Q2, simplemente se reserva.</p>
<p>Por tanto, en esta etapa se trabaja únicamente con <em>X₂ = −R²/(ωL)</em>, porque es la única ecuación que contiene C que debemos resolver.</p>`,
      },
      math: [
        "\\text{Recordatorio definición: }\\; X_2 = \\omega L - \\dfrac{1}{\\omega C}",
        "\\text{Restricción de la etapa 8: }\\; X_2 = -\\dfrac{R^2}{\\omega L}",
        "\\Longrightarrow\\; \\omega L - \\dfrac{1}{\\omega C} = -\\dfrac{R^2}{\\omega L}",
        "\\Longrightarrow\\; \\dfrac{1}{\\omega C} = \\omega L + \\dfrac{R^2}{\\omega L}",
      ],
      subSteps: [
        {
          text: "Solo se ha pasado ωL a la derecha (sumando ωL a ambos lados) e invertido el signo del segundo término. Es una manipulación lineal.",
        },
        {
          text: "Repaso rápido del «reparto del trabajo» entre las dos partes de Z₂/Z₁:",
          math: [
            "\\underbrace{R^2 + X_2\\,\\omega L = 0}_{\\text{sirve para Q2 → C}} \\quad ; \\quad \\underbrace{R(X_2 - \\omega L)}_{\\text{servirá para Q3 → k}}",
          ],
        },
      ],
    },

    {
      title: "Poner al mismo denominador",
      note: `Se combina la suma de la derecha en una sola fracción. Esta etapa ilustra una manipulación clásica: <em>a + a/b = (ab + a)/b</em>, que se basa en la identidad <em>a = a·b/b</em> porque <em>b/b = 1</em>.`,
      roadmap: Q2(4),
      math: [
        "\\dfrac{1}{\\omega C} = \\dfrac{(\\omega L)^2 + R^2}{\\omega L}",
      ],
      subSteps: [
        {
          text: "Detalle de la manipulación a + b/c = (ac + b)/c. Se escribe a en la forma a·c/c, luego se suman las dos fracciones que ahora tienen el mismo denominador.",
          math: [
            "\\omega L = \\dfrac{\\omega L \\cdot \\omega L}{\\omega L} = \\dfrac{(\\omega L)^2}{\\omega L}",
            "\\omega L + \\dfrac{R^2}{\\omega L} = \\dfrac{(\\omega L)^2}{\\omega L} + \\dfrac{R^2}{\\omega L} = \\dfrac{(\\omega L)^2 + R^2}{\\omega L}",
          ],
        },
        {
          text: "¿Por qué ωL/ωL = 1? Todo número no nulo dividido por sí mismo vale 1. Es este truco el que permite escribir un número como una fracción de denominador cualquiera.",
        },
      ],
    },

    {
      title: "Inversión y resultado final para C",
      note: `Queda invertir para obtener <em>ωC</em>, y luego dividir por <em>ω</em>.`,
      roadmap: Q2(5, "Q2 respondida: C = L / (R² + (ωL)²). Falta calcular k (Q3)."),
      math: [
        "\\omega C = \\dfrac{\\omega L}{R^2 + (\\omega L)^2}",
        "\\boxed{\\,C = \\dfrac{L}{R^2 + (\\omega L)^2}\\,}",
      ],
      subSteps: [
        {
          text: "Invertir una fracción = pasar al recíproco. (a/b)⁻¹ = b/a.",
          math: ["\\left(\\dfrac{1}{\\omega C}\\right)^{-1} = \\omega C"],
        },
      ],
    },

    {
      title: "Cálculo del factor k",
      note: `Como la parte real es nula, el cociente es puramente imaginario. Se lee entonces <em>k</em> en el coeficiente de <em>j</em>. Se parte de la parte imaginaria <em>R(X₂ − ωL)/[R² + (ωL)²]</em> (reservada en la etapa 8), y luego se sustituye <em>X₂ = −R²/(ωL)</em>.`,
      roadmap: Q3(1, "Q3 respondida: k = R/(ωL). Toda la parte a) está terminada."),
      whyStep: {
        summary: "Recordatorio — ¿de dónde sale esta parte imaginaria?",
        body: `<p>En la etapa 7, habíamos escrito Z₂/Z₁ = <em>a + j·b</em>, con <em>b = R(X₂ − ωL)/(R² + (ωL)²)</em>.</p>
<p>La etapa 8 anuló <em>a</em> para hacer el cociente puramente imaginario. Hecho esto, lo que queda es <em>j·b</em>. Identificar <em>j·b = −jk</em> da <em>k = −b</em>.</p>
<p>Ahora se usa la restricción <em>X₂ = −R²/(ωL)</em> hallada en la etapa 8 para calcular <em>b</em>, y por tanto <em>k</em>.</p>`,
      },
      math: [
        "X_2 - \\omega L = -\\dfrac{R^2}{\\omega L} - \\omega L = -\\dfrac{R^2 + (\\omega L)^2}{\\omega L}",
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = j\\cdot\\dfrac{R\\bigl(X_2 - \\omega L\\bigr)}{R^2 + (\\omega L)^2} = -j\\cdot\\dfrac{R}{\\omega L}",
        "\\boxed{\\,k = \\dfrac{R}{\\omega L}\\,}",
      ],
      figure: () => phasorDiagram({
        title: "Cuadratura obtenida: I₂ ⟂ I₁",
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
  label: "Escenario 1: R = 0",
  defaultFigure: () => ex4aCircuit({ scenario: "noR" }),
  steps: [

    {
      title: "Hipótesis: bobinados ideales",
      note: `Se supone que los bobinados son inductancias puras, por lo que <em>R = 0</em>. ¿Qué ocurre con la condición de cuadratura?`,
      math: [
        "\\underline{Z_1} = j\\omega L",
        "\\underline{Z_2} = j\\omega L + \\dfrac{1}{j\\omega C} = j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)",
      ],
    },

    {
      title: "El cociente pasa a ser real",
      note: `Como las dos impedancias tienen un factor <em>j</em> común, este se elimina. El cociente <em>I₁/I₂ = Z₂/Z₁</em> pasa a ser <strong>puramente real</strong>.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = \\dfrac{j\\!\\left(\\omega L - \\dfrac{1}{\\omega C}\\right)}{j\\,\\omega L} = \\dfrac{\\omega L - \\dfrac{1}{\\omega C}}{\\omega L} = 1 - \\dfrac{1}{\\omega^2 L C}",
      ],
      subSteps: [
        {
          text: "La j de arriba y la de abajo se simplifican: j/j = 1. Luego se divide término a término la fracción.",
          math: [
            "\\dfrac{\\omega L}{\\omega L} - \\dfrac{1/(\\omega C)}{\\omega L} = 1 - \\dfrac{1}{\\omega^2 L C}",
          ],
        },
      ],
    },

    {
      title: "Conclusión: no hay cuadratura exacta",
      note: `Un número <strong>real</strong> nunca puede escribirse como <em>−jk</em> (puramente imaginario) salvo si es nulo. La cuadratura exacta es <strong>imposible</strong> en este circuito sin resistencia.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = 1 - \\dfrac{1}{\\omega^2 LC} \\in \\mathbb{R}",
        "\\boxed{\\,R=0 \\;\\Longrightarrow\\; \\text{no hay cuadratura exacta.}\\,}",
      ],
      figure: () => phasorDiagram({
        title: "Caso inductivo: I₁ e I₂ en fase; caso capacitivo: oposición",
        size: 280, scale: 1,
        vectors: [
          { label: "I₁", mag: 90, deg: -90, color: "var(--phasor-2)" },
          { label: "I₂ (inductivo)", mag: 60, deg: -90, color: "var(--phasor-1)" },
          { label: "I₂ (capacitivo)", mag: 60, deg: 90, color: "var(--phasor-3)" },
        ],
      }),
    },

    {
      title: "Peor aún: en la resonancia",
      note: `Si se reutiliza la fórmula <em>C = L/(R² + (ωL)²)</em> con <em>R = 0</em>, se llega a <em>C = 1/(ω²L)</em>, lo que anula exactamente la reactancia de la rama 2 — es la <strong>resonancia serie LC</strong>. La rama se convierte en un cortocircuito (impedancia nula) y la corriente se dispararía en el modelo ideal.`,
      math: [
        "C = \\dfrac{L}{(\\omega L)^2} = \\dfrac{1}{\\omega^2 L}",
        "\\dfrac{1}{\\omega C} = \\omega L \\;\\Longrightarrow\\; \\omega L - \\dfrac{1}{\\omega C} = 0 \\;\\Longrightarrow\\; \\underline{Z_2} = 0",
      ],
      subSteps: [
        {
          text: "Moraleja: la resistencia R no es un detalle — es esencial para que la cuadratura exacta exista. Además limita la corriente en la resonancia.",
        },
      ],
    },

  ],
};

// --------------------------------------------------------------
// Chapter 3 — Scénario 2 : un condensateur dans chaque branche
// --------------------------------------------------------------
const chapter4aTwoCaps = {
  label: "Escenario 2: dos condensadores",
  defaultFigure: () => ex4aCircuit({ scenario: "twoCaps" }),
  steps: [

    {
      title: "Nueva configuración",
      note: `Se añade un condensador <em>C₁</em> en serie con la rama 1 (además del <em>C₂</em> de la rama 2). Se denotan las reactancias totales <em>X₁</em> y <em>X₂</em>.`,
      math: [
        "\\underline{Z_1} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C_1}\\right) = R + jX_1",
        "\\underline{Z_2} = R + j\\!\\left(\\omega L - \\dfrac{1}{\\omega C_2}\\right) = R + jX_2",
      ],
    },

    {
      title: "Cociente de las corrientes",
      note: `Sigue siendo <em>I₁/I₂ = Z₂/Z₁</em>. Se multiplica por el conjugado <em>R − jX₁</em> del denominador.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = \\dfrac{R + jX_2}{R + jX_1} = \\dfrac{(R+jX_2)(R-jX_1)}{R^2 + X_1^2}",
      ],
    },

    {
      title: "Desarrollo del numerador",
      note: `Se usa <em>j(−j) = 1</em> para el producto de los términos imaginarios.`,
      math: [
        "(R+jX_2)(R-jX_1) = R^2 - jRX_1 + jRX_2 + X_1 X_2",
        "= \\bigl(R^2 + X_1 X_2\\bigr) + jR\\bigl(X_2 - X_1\\bigr)",
      ],
      subSteps: [
        {
          text: "El producto (jX₂)(−jX₁) = −j²X₁X₂ = −(−1)X₁X₂ = +X₁X₂. El j² = −1 hace cambiar el signo.",
        },
      ],
    },

    {
      title: "Condición de cuadratura",
      note: `Para tener <em>I₁/I₂ = −jk</em>, se anula la parte real.`,
      math: [
        "R^2 + X_1 X_2 = 0",
        "\\boxed{\\,X_1 X_2 = -R^2\\,}",
        "\\Longleftrightarrow\\; \\left(\\omega L - \\dfrac{1}{\\omega C_1}\\right)\\!\\left(\\omega L - \\dfrac{1}{\\omega C_2}\\right) = -R^2",
      ],
    },

    {
      title: "Condición de signo — para tener k > 0",
      note: `Una vez anulada la parte real, queda <em>I₁/I₂ = j·R(X₂ − X₁)/(R² + X₁²)</em>. Se quiere la forma <strong>−jk</strong> con <em>k > 0</em>, por lo que el coeficiente delante de <em>j</em> debe ser <strong>negativo</strong>. Esto impone <em>X₂ − X₁ < 0</em>, es decir <strong>X₂ &lt; X₁</strong>.`,
      math: [
        "\\dfrac{\\underline{I_1}}{\\underline{I_2}} = j\\cdot\\dfrac{R(X_2 - X_1)}{R^2 + X_1^2} = -j\\cdot\\dfrac{R(X_1 - X_2)}{R^2 + X_1^2}",
        "\\boxed{\\,k = \\dfrac{R(X_1 - X_2)}{R^2 + X_1^2}\\,}",
        "\\boxed{\\,X_2 < X_1\\,}",
      ],
      subSteps: [
        {
          text: "Solo se ha factorizado un signo menos para hacer aparecer la forma −jk esperada. Si no se impusiera X₂ < X₁, se obtendría k < 0, es decir un desfase opuesto: I₁ en adelanto respecto a I₂ en lugar de en retraso. El papel físico de las dos ramas quedaría invertido.",
        },
        {
          text: "Concretamente, como X₁X₂ = −R² < 0, una de las reactancias es positiva y la otra negativa. El convenio X₂ < X₁ equivale a elegir que es la rama 2 la más capacitiva (la menos inductiva).",
        },
      ],
    },

    {
      title: "Interpretación física",
      note: `El producto <em>X₁X₂ = −R²</em> es <strong>negativo</strong>. Por tanto <em>X₁</em> y <em>X₂</em> son de <strong>signos opuestos</strong>: una rama es globalmente inductiva (<em>X > 0</em>), la otra globalmente capacitiva (<em>X < 0</em>). Físicamente es así como se obtiene un desfase de 90° entre las dos corrientes.`,
      math: [
        "X_1 X_2 < 0 \\;\\Longleftrightarrow\\; \\text{una rama inductiva, la otra capacitiva}",
      ],
      figure: () => phasorDiagram({
        title: "Una rama inductiva, la otra capacitiva",
        size: 280,
        vectors: [
          { label: "U", mag: 100, deg: 0, color: "var(--phasor-4)" },
          { label: "I₁", mag: 80, deg: -45, color: "var(--phasor-2)" },
          { label: "I₂", mag: 80, deg: 45, color: "var(--phasor-1)" },
        ],
      }),
    },

    {
      title: "C₂ en función de C₁ (si C₁ está fijado)",
      note: `Supongamos que <em>C₁</em> está impuesto. Se busca <em>C₂</em> que satisfaga la condición <em>X₁X₂ = −R²</em>. Si <em>X₁ ≠ 0</em>, se despeja <em>X₂</em> y luego se remonta a <em>C₂</em>.`,
      math: [
        "X_2 = -\\dfrac{R^2}{X_1} \\;\\Longleftrightarrow\\; \\omega L - \\dfrac{1}{\\omega C_2} = -\\dfrac{R^2}{X_1}",
        "\\dfrac{1}{\\omega C_2} = \\omega L + \\dfrac{R^2}{X_1}",
        "\\boxed{\\,C_2 = \\dfrac{1}{\\omega\\!\\left(\\omega L + \\dfrac{R^2}{\\,\\omega L - \\dfrac{1}{\\omega C_1}\\,}\\right)}\\,}",
      ],
      subSteps: [
        {
          text: "Se ha reemplazado X₁ por su definición ωL − 1/(ωC₁) en la última línea. Esta fórmula solo es válida si X₁ ≠ 0, es decir si la rama 1 no está en resonancia LC₁ (donde ωL = 1/(ωC₁)).",
          math: ["X_1 = \\omega L - \\dfrac{1}{\\omega C_1}"],
        },
        {
          text: "Caso límite: si C₁ → ∞ (sin condensador en la rama 1), entonces 1/(ωC₁) → 0 y X₁ → ωL. Se vuelve exactamente al caso original — es lo que muestra la etapa siguiente.",
        },
      ],
    },

    {
      title: "Caso particular: se recupera el ejercicio original",
      note: `Si la rama 1 no tiene condensador, entonces <em>C₁ → ∞</em>, por lo que <em>1/(ωC₁) = 0</em> y <em>X₁ = ωL</em>. La condición <em>X₁X₂ = −R²</em> vuelve a dar exactamente la fórmula del caso original.`,
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
  label: "4b) Divisor de tensión",
  defaultFigure: () => ex4bCircuit(),
  steps: [

    {
      title: "Esquema equivalente",
      note: `Una fuente <em>u</em> alimenta, a través de una <strong>línea</strong> (resistencia <em>R = 1 Ω</em>, reactancia <em>X<sub>L</sub> = 0,5 Ω</em>), un receptor de impedancia <em>Z₂ = 25·e^{jπ/3} Ω</em>. La tensión buscada <em>u₂</em> está en bornes del receptor.`,
      math: [
        "\\underline{Z}_\\text{ligne} = R + jX_L = 1 + j\\,0{,}5\\ \\Omega",
        "\\underline{Z_2} = 25\\,e^{j\\pi/3}\\ \\Omega",
      ],
      figure: () => ex4bCircuit({ emphasis: "line" }),
    },

    {
      title: "Divisor de tensión",
      note: `Como <em>Z<sub>línea</sub></em> y <em>Z₂</em> están en serie, recorridas por la misma corriente, la tensión se reparte proporcionalmente a las impedancias.`,
      math: [
        "\\underline{U_2} = \\underline{U}\\cdot\\dfrac{\\underline{Z_2}}{\\underline{Z}_\\text{ligne}+\\underline{Z_2}}",
      ],
    },

    {
      title: "Z₂ en cartesiano",
      note: `Se convierte <em>Z₂</em> de polar a cartesiano para poder sumarlo con <em>Z<sub>línea</sub></em>.`,
      math: [
        "\\underline{Z_2} = 25\\bigl(\\cos 60^\\circ + j\\sin 60^\\circ\\bigr)",
        "= 25\\,(0{,}5 + j\\,0{,}8660) = 12{,}5 + j\\,21{,}65\\ \\Omega",
      ],
      subSteps: [
        {
          text: "Fórmula de Euler: e^{jθ} = cos θ + j sin θ. Con θ = π/3 = 60°, cos(60°) = 1/2, sin(60°) = √3/2 ≈ 0,8660.",
        },
      ],
    },

    {
      title: "Suma Z_línea + Z₂",
      note: `Suma cartesiana: se suman las partes reales por un lado, y las partes imaginarias por el otro.`,
      math: [
        "\\underline{Z}_\\text{ligne} + \\underline{Z_2} = (1 + 12{,}5) + j(0{,}5 + 21{,}65) = 13{,}5 + j\\,22{,}15\\ \\Omega",
      ],
    },

    {
      title: "Módulos",
      note: `Para el valor eficaz, se toman los módulos. <em>U₂ = U · |Z₂| / |Z<sub>línea</sub>+Z₂|</em>.`,
      math: [
        "|\\underline{Z_2}| = 25\\ \\Omega",
        "|\\underline{Z}_\\text{ligne}+\\underline{Z_2}| = \\sqrt{13{,}5^2 + 22{,}15^2} = \\sqrt{182{,}25 + 490{,}62} \\approx \\sqrt{672{,}87} \\approx 25{,}94\\ \\Omega",
      ],
      subSteps: [
        {
          text: "Módulo de un complejo a + jb: |a + jb| = √(a² + b²). Es el teorema de Pitágoras aplicado en el plano complejo.",
        },
      ],
    },

    {
      title: "Valor eficaz U₂",
      note: `Se aplica el módulo del divisor. Con <em>U = 240 V</em>.`,
      math: [
        "U_2 = U\\cdot\\dfrac{|\\underline{Z_2}|}{|\\underline{Z}_\\text{ligne}+\\underline{Z_2}|} = 240\\cdot\\dfrac{25}{25{,}94}",
        "\\boxed{\\,U_2 \\approx 231{,}3\\ \\text{V}\\,}",
      ],
    },

    {
      title: "Desfase de u respecto a u₂",
      note: `El desfase <em>φ</em> es el argumento del cociente <em>U/U₂ = (Z<sub>línea</sub>+Z₂)/Z₂</em>.`,
      math: [
        "\\varphi_{u/u_2} = \\arg(\\underline{Z}_\\text{ligne}+\\underline{Z_2}) - \\arg(\\underline{Z_2})",
        "\\arg(\\underline{Z}_\\text{ligne}+\\underline{Z_2}) = \\arctan\\!\\dfrac{22{,}15}{13{,}5} \\approx 58{,}65^\\circ",
        "\\arg(\\underline{Z_2}) = \\dfrac{\\pi}{3} = 60^\\circ",
        "\\boxed{\\,\\varphi_{u/u_2} \\approx -1{,}35^\\circ\\,}",
      ],
      subSteps: [
        {
          text: "Argumento de un complejo a + jb: arg = arctan(b/a) (con corrección de cuadrante). Se lee el ángulo con el que apunta el vector respecto al eje real positivo.",
        },
        {
          text: "El desfase es muy pequeño: la línea añade poca impedancia respecto al receptor. Es típico de una línea «corta».",
        },
      ],
      figure: () => phasorDiagram({
        title: "u ligeramente en retraso respecto a u₂",
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
  title: "Ejercicio 4 — Divisores",
  chapters: [
    chapter4aOriginal,
    chapter4aNoR,
    chapter4aTwoCaps,
    chapter4b,
  ],
};
