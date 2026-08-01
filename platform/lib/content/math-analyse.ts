// Content metadata for the math module "Analyse & convergence" — the analysis
// UE rebuilt from the course's own polycopié and its past papers (see
// ../../../RESOURCES-analyse.md). Single source of truth consumed by the hub,
// LessonMeta, ExerciseView and the mock exams; prose lives in content.fr.mdx.
//
// Provenance is "polycopie" throughout (never "officiel"): this track does not
// reconstruct the Paris-Saclay L2 Chimie UE, and nothing here may be presented
// as an official university document. "extension" marks the complements the
// polycopié itself appends after its five announced chapters.

import type { ExamMetaData, LessonMetaData, TdMetaData } from "./types";

export const ANALYSE_MODULE_SLUG = "analyse-convergence";
const M = ANALYSE_MODULE_SLUG;

export const ANALYSE_LESSONS: LessonMetaData[] = [
  {
    id: "math-an-c00",
    slug: "00-boite-a-outils",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Boîte à outils — suites, équivalents et développements limités",
      en: "Toolbox — sequences, equivalents, and Taylor expansions",
      es: "Caja de herramientas — sucesiones, equivalentes y desarrollos limitados",
    },
    provenance: "polycopie",
    difficulty: 1,
    timeMinutes: 50,
    objectives: [
      {
        fr: "Calculer une limite de suite et reconnaître les croissances comparées",
        en: "Compute the limit of a sequence and recognize the standard growth comparisons",
        es: "Calcular el límite de una sucesión y reconocer las comparaciones de crecimiento",
      },
      {
        fr: "Manipuler équivalents et petits o sans commettre les erreurs classiques (somme, exponentielle)",
        en: "Handle equivalents and little-o without the classic mistakes (sums, exponentials)",
        es: "Manejar equivalentes y o pequeñas sin cometer los errores clásicos (sumas, exponenciales)",
      },
      {
        fr: "Écrire les six développements limités usuels en 0 et s'en servir pour trouver un équivalent",
        en: "Write the six standard Taylor expansions at 0 and use them to find an equivalent",
        es: "Escribir los seis desarrollos limitados usuales en 0 y usarlos para hallar un equivalente",
      },
    ],
    relatedExercises: [],
  },
  {
    id: "math-an-c01",
    slug: "01-series-numeriques",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Donner un sens à une somme infinie",
      en: "Making sense of an infinite sum",
      es: "Dar sentido a una suma infinita",
    },
    provenance: "polycopie",
    difficulty: 2,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Définir la nature d'une série par la limite de ses sommes partielles",
        en: "Define the behaviour of a series through the limit of its partial sums",
        es: "Definir la naturaleza de una serie mediante el límite de sus sumas parciales",
      },
      {
        fr: "Calculer exactement une somme géométrique et une somme télescopique",
        en: "Compute a geometric and a telescoping sum exactly",
        es: "Calcular exactamente una suma geométrica y una suma telescópica",
      },
      {
        fr: "Utiliser la condition nécessaire de convergence sans la confondre avec une condition suffisante",
        en: "Use the necessary condition for convergence without mistaking it for a sufficient one",
        es: "Usar la condición necesaria de convergencia sin confundirla con una condición suficiente",
      },
      {
        fr: "Interpréter le reste d'une série comme l'erreur commise en s'arrêtant au rang N",
        en: "Read the remainder of a series as the error made by stopping at index N",
        es: "Interpretar el resto de una serie como el error cometido al detenerse en el índice N",
      },
    ],
    prerequisites: ["math-an-c00"],
    relatedExercises: ["math-an-td1-01", "math-an-td1-05", "math-an-td1-06"],
  },
  {
    id: "math-an-c02",
    slug: "02-series-positives",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Séries à termes positifs — comparer pour conclure",
      en: "Series with positive terms — compare to conclude",
      es: "Series de términos positivos — comparar para concluir",
    },
    provenance: "polycopie",
    difficulty: 2,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Comparer un terme général à une série de référence et conclure dans le bon sens",
        en: "Compare a general term with a reference series and conclude in the right direction",
        es: "Comparar un término general con una serie de referencia y concluir en el sentido correcto",
      },
      {
        fr: "Utiliser un équivalent pour ramener une expression à une série de Riemann",
        en: "Use an equivalent to reduce an expression to a Riemann series",
        es: "Usar un equivalente para reducir una expresión a una serie de Riemann",
      },
      {
        fr: "Appliquer la comparaison série-intégrale, y compris aux séries de Bertrand",
        en: "Apply the integral test, including to Bertrand series",
        es: "Aplicar la comparación serie-integral, incluso a las series de Bertrand",
      },
      {
        fr: "Rédiger une conclusion complète : positivité, équivalent, référence, verdict",
        en: "Write a complete conclusion: positivity, equivalent, reference, verdict",
        es: "Redactar una conclusión completa: positividad, equivalente, referencia, veredicto",
      },
    ],
    prerequisites: ["math-an-c01"],
    relatedExercises: ["math-an-td1-02", "math-an-td1-03", "math-an-td1-04"],
  },
  {
    id: "math-an-c03",
    slug: "03-dalembert-cauchy",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Rapport et racine — décider vite, et savoir quand on ne peut pas",
      en: "Ratio and root — deciding fast, and knowing when you cannot",
      es: "Cociente y raíz — decidir rápido, y saber cuándo no se puede",
    },
    provenance: "polycopie",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Choisir entre la règle du rapport et celle de la racine selon la forme du terme général",
        en: "Choose between the ratio and the root test according to the shape of the general term",
        es: "Elegir entre el criterio del cociente y el de la raíz según la forma del término general",
      },
      {
        fr: "Reconnaître le cas douteux et refuser d'y conclure",
        en: "Recognize the inconclusive case and refuse to conclude there",
        es: "Reconocer el caso dudoso y negarse a concluir en él",
      },
      {
        fr: "Débloquer un cas douteux par logarithme, développement limité ou équivalent",
        en: "Unblock an inconclusive case with logarithms, Taylor expansions, or equivalents",
        es: "Desbloquear un caso dudoso con logaritmos, desarrollos limitados o equivalentes",
      },
    ],
    prerequisites: ["math-an-c02"],
    relatedExercises: ["math-an-td2-01", "math-an-td2-02", "math-an-td2-03"],
  },
  {
    id: "math-an-c04",
    slug: "04-alternees-abel",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Quand les signes se compensent — alternées, Abel et perturbations",
      en: "When signs cancel — alternating series, Abel, and perturbations",
      es: "Cuando los signos se compensan — alternadas, Abel y perturbaciones",
    },
    provenance: "polycopie",
    difficulty: 3,
    timeMinutes: 110,
    objectives: [
      {
        fr: "Distinguer convergence absolue et semi-convergence, avec un exemple de chaque",
        en: "Distinguish absolute from conditional convergence, with an example of each",
        es: "Distinguir convergencia absoluta y semiconvergencia, con un ejemplo de cada una",
      },
      {
        fr: "Vérifier les trois hypothèses du critère de Leibniz et majorer le reste",
        en: "Check the three hypotheses of the Leibniz test and bound the remainder",
        es: "Verificar las tres hipótesis del criterio de Leibniz y acotar el resto",
      },
      {
        fr: "Traiter une perturbation non linéaire en séparant terme principal et terme quadratique",
        en: "Handle a nonlinear perturbation by separating leading and quadratic terms",
        es: "Tratar una perturbación no lineal separando término principal y término cuadrático",
      },
      {
        fr: "Utiliser la transformation d'Abel quand l'alternance n'est plus régulière",
        en: "Use Abel summation when the alternation is no longer regular",
        es: "Usar la transformación de Abel cuando la alternancia deja de ser regular",
      },
    ],
    prerequisites: ["math-an-c03"],
    relatedExercises: ["math-an-td2-04", "math-an-td2-05", "math-an-td2-06"],
  },
  {
    id: "math-an-c05",
    slug: "05-suites-de-fonctions",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Suites de fonctions — un même rang pour tous les points",
      en: "Sequences of functions — one index for every point",
      es: "Sucesiones de funciones — un mismo índice para todos los puntos",
    },
    provenance: "polycopie",
    difficulty: 3,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Écrire la fonction limite point par point et repérer les points exceptionnels",
        en: "Write the pointwise limit function and spot the exceptional points",
        es: "Escribir la función límite punto por punto y localizar los puntos excepcionales",
      },
      {
        fr: "Calculer une norme uniforme par étude de la fonction écart",
        en: "Compute a uniform norm by studying the error function",
        es: "Calcular una norma uniforme estudiando la función error",
      },
      {
        fr: "Réfuter l'uniformité par une suite témoin, et la restaurer en s'éloignant du point coupable",
        en: "Disprove uniformity with a witness sequence, and restore it away from the guilty point",
        es: "Refutar la uniformidad con una sucesión testigo y restaurarla lejos del punto culpable",
      },
      {
        fr: "Séparer hauteur, largeur et aire d'une bosse glissante",
        en: "Separate the height, width, and area of a travelling bump",
        es: "Separar altura, anchura y área de una joroba móvil",
      },
    ],
    prerequisites: ["math-an-c01"],
    relatedExercises: ["math-an-td3-01", "math-an-td3-02", "math-an-td3-03", "math-an-td3-04"],
  },
  {
    id: "math-an-c06",
    slug: "06-series-de-fonctions",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Séries de fonctions — la convergence normale, l'outil du praticien",
      en: "Series of functions — normal convergence, the working tool",
      es: "Series de funciones — la convergencia normal, la herramienta práctica",
    },
    provenance: "polycopie",
    difficulty: 3,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Majorer chaque terme par un nombre et appliquer le critère de Weierstrass",
        en: "Bound each term by a number and apply the Weierstrass M-test",
        es: "Acotar cada término por un número y aplicar el criterio de Weierstrass",
      },
      {
        fr: "Placer correctement les implications entre convergences simple, uniforme et normale",
        en: "Place the implications between pointwise, uniform, and normal convergence correctly",
        es: "Situar correctamente las implicaciones entre convergencia simple, uniforme y normal",
      },
      {
        fr: "Trouver le bon sous-domaine quand la convergence normale échoue au bord",
        en: "Find the right subdomain when normal convergence fails at the boundary",
        es: "Encontrar el subdominio adecuado cuando la convergencia normal falla en el borde",
      },
    ],
    prerequisites: ["math-an-c05"],
    relatedExercises: ["math-an-td4-01", "math-an-td4-02"],
  },
  {
    id: "math-an-c07",
    slug: "07-theoremes-d-echange",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Échanger limite, intégrale et dérivée — le passeport d'hypothèses",
      en: "Swapping limit, integral and derivative — the hypothesis passport",
      es: "Intercambiar límite, integral y derivada — el pasaporte de hipótesis",
    },
    provenance: "polycopie",
    difficulty: 4,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Justifier la continuité d'une somme de série de fonctions",
        en: "Justify the continuity of the sum of a series of functions",
        es: "Justificar la continuidad de la suma de una serie de funciones",
      },
      {
        fr: "Intervertir limite et intégrale sur un segment, et savoir pourquoi cela peut échouer",
        en: "Swap limit and integral on a segment, and know why it can fail",
        es: "Intercambiar límite e integral en un segmento, y saber por qué puede fallar",
      },
      {
        fr: "Dériver terme à terme en contrôlant la série des dérivées, pas celle des fonctions",
        en: "Differentiate term by term by controlling the series of derivatives, not of the functions",
        es: "Derivar término a término controlando la serie de las derivadas, no la de las funciones",
      },
      {
        fr: "Traiter l'intérieur d'un intervalle et son extrémité séparément",
        en: "Treat the interior of an interval and its endpoint separately",
        es: "Tratar el interior de un intervalo y su extremo por separado",
      },
    ],
    prerequisites: ["math-an-c06"],
    relatedExercises: ["math-an-td4-03", "math-an-td4-04", "math-an-td4-05"],
  },
  {
    id: "math-an-c08",
    slug: "08-series-entieres-rayon",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Séries entières — trouver le rayon, puis regarder le bord",
      en: "Power series — find the radius, then look at the boundary",
      es: "Series enteras — hallar el radio y luego mirar el borde",
    },
    provenance: "polycopie",
    difficulty: 3,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Calculer un rayon de convergence par le rapport, la racine ou directement",
        en: "Compute a radius of convergence by ratio, root, or directly",
        es: "Calcular un radio de convergencia por cociente, raíz o directamente",
      },
      {
        fr: "Traiter une série lacunaire sans appliquer aveuglément la règle du rapport",
        en: "Handle a lacunary series without blindly applying the ratio test",
        es: "Tratar una serie lagunar sin aplicar ciegamente el criterio del cociente",
      },
      {
        fr: "Étudier séparément les deux extrémités de l'intervalle de convergence",
        en: "Study the two endpoints of the interval of convergence separately",
        es: "Estudiar por separado los dos extremos del intervalo de convergencia",
      },
      {
        fr: "Justifier la convergence normale sur tout segment intérieur",
        en: "Justify normal convergence on every interior segment",
        es: "Justificar la convergencia normal en todo segmento interior",
      },
    ],
    prerequisites: ["math-an-c06"],
    relatedExercises: ["math-an-td5-01", "math-an-td5-02", "math-an-td5-03"],
  },
  {
    id: "math-an-c09",
    slug: "09-developpements-en-serie-entiere",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Fabriquer des identités — développer, dériver, intégrer, résoudre",
      en: "Manufacturing identities — expand, differentiate, integrate, solve",
      es: "Fabricar identidades — desarrollar, derivar, integrar, resolver",
    },
    provenance: "polycopie",
    difficulty: 4,
    timeMinutes: 110,
    objectives: [
      {
        fr: "Reconstruire les développements usuels à partir de la série géométrique",
        en: "Rebuild the standard expansions starting from the geometric series",
        es: "Reconstruir los desarrollos usuales a partir de la serie geométrica",
      },
      {
        fr: "Gérer les changements d'indice sans perdre ni dupliquer le terme constant",
        en: "Handle index shifts without losing or duplicating the constant term",
        es: "Gestionar los cambios de índice sin perder ni duplicar el término constante",
      },
      {
        fr: "Résoudre une équation différentielle par série entière et reconnaître la fonction obtenue",
        en: "Solve a differential equation by power series and recognize the resulting function",
        es: "Resolver una ecuación diferencial por serie entera y reconocer la función obtenida",
      },
      {
        fr: "Construire une fonction auxiliaire à dérivée nulle pour établir une identité",
        en: "Build an auxiliary function with zero derivative to establish an identity",
        es: "Construir una función auxiliar con derivada nula para establecer una identidad",
      },
    ],
    prerequisites: ["math-an-c08"],
    relatedExercises: ["math-an-td5-04", "math-an-td5-05", "math-an-td5-06"],
  },
  {
    id: "math-an-c10",
    slug: "10-integrales-a-parametre",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Intégrales à paramètre — exister, être continue, se dériver",
      en: "Parameter-dependent integrals — existing, being continuous, differentiating",
      es: "Integrales con parámetro — existir, ser continua, derivarse",
    },
    provenance: "polycopie",
    difficulty: 4,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Prouver qu'une intégrale à paramètre est bien définie avant toute autre question",
        en: "Prove that a parameter-dependent integral is well defined before anything else",
        es: "Probar que una integral con parámetro está bien definida antes de cualquier otra cuestión",
      },
      {
        fr: "Exhiber une fonction dominante indépendante du paramètre",
        en: "Exhibit a dominating function independent of the parameter",
        es: "Exhibir una función dominante independiente del parámetro",
      },
      {
        fr: "Énoncer le théorème de dérivation sous le signe intégral avant de l'appliquer",
        en: "State the theorem on differentiating under the integral sign before applying it",
        es: "Enunciar el teorema de derivación bajo el signo integral antes de aplicarlo",
      },
      {
        fr: "Déduire monotonie et développement de premier ordre à partir de la dérivée",
        en: "Deduce monotonicity and a first-order expansion from the derivative",
        es: "Deducir monotonía y desarrollo de primer orden a partir de la derivada",
      },
    ],
    prerequisites: ["math-an-c07"],
    relatedExercises: ["math-an-td6-01", "math-an-td6-02", "math-an-td6-03"],
  },
  {
    id: "math-an-c11",
    slug: "11-feynman-asymptotiques",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Méthode de Feynman et asymptotiques — fabriquer le bon paramètre",
      en: "Feynman's trick and asymptotics — manufacturing the right parameter",
      es: "Método de Feynman y asintóticos — fabricar el parámetro adecuado",
    },
    provenance: "extension",
    difficulty: 5,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Choisir un paramètre dont la dérivation simplifie l'intégrande",
        en: "Choose a parameter whose differentiation simplifies the integrand",
        es: "Elegir un parámetro cuya derivación simplifique el integrando",
      },
      {
        fr: "Déterminer la constante d'intégration par une valeur ou une limite commode",
        en: "Determine the integration constant from a convenient value or limit",
        es: "Determinar la constante de integración mediante un valor o un límite cómodo",
      },
      {
        fr: "Obtenir un équivalent par intégration par parties en contrôlant le reste",
        en: "Obtain an equivalent by integration by parts while controlling the remainder",
        es: "Obtener un equivalente por integración por partes controlando el resto",
      },
    ],
    prerequisites: ["math-an-c10"],
    relatedExercises: ["math-an-td6-04", "math-an-td6-05"],
  },
  {
    id: "math-an-c12",
    slug: "12-integrales-doubles",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "Intégrales doubles — décrire le domaine avant de calculer",
      en: "Double integrals — describe the region before computing",
      es: "Integrales dobles — describir el dominio antes de calcular",
    },
    provenance: "polycopie",
    difficulty: 3,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Décrire un domaine plan par tranches verticales puis horizontales",
        en: "Describe a plane region by vertical slices, then horizontal ones",
        es: "Describir un dominio plano por rebanadas verticales y luego horizontales",
      },
      {
        fr: "Appliquer le théorème de Fubini et choisir l'ordre d'intégration le plus simple",
        en: "Apply Fubini's theorem and choose the simplest order of integration",
        es: "Aplicar el teorema de Fubini y elegir el orden de integración más simple",
      },
      {
        fr: "Effectuer un changement de variables en n'oubliant ni le domaine image ni la valeur absolue du jacobien",
        en: "Carry out a change of variables forgetting neither the image region nor the absolute value of the Jacobian",
        es: "Efectuar un cambio de variables sin olvidar el dominio imagen ni el valor absoluto del jacobiano",
      },
    ],
    prerequisites: ["math-an-c00"],
    relatedExercises: ["math-an-td7-01", "math-an-td7-02", "math-an-td7-03", "math-an-td7-04"],
  },
];

export const ANALYSE_TDS: TdMetaData[] = [
  {
    id: "math-an-td1",
    slug: "td-1",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 1 — Nature d'une série : sommes partielles, comparaison, équivalents",
      en: "TD 1 (tutorial sheet) — Behaviour of a series: partial sums, comparison, equivalents",
      es: "TD 1 (trabajo dirigido) — Naturaleza de una serie: sumas parciales, comparación, equivalentes",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td1-01",
        tdId: "math-an-td1",
        title: {
          fr: "Sommes partielles exactes : géométrique et télescopique",
          en: "Exact partial sums: geometric and telescoping",
          es: "Sumas parciales exactas: geométrica y telescópica",
        },
        difficulty: 2,
        lessonIds: ["math-an-c01"],
      },
      {
        id: "math-an-td1-02",
        tdId: "math-an-td1",
        title: {
          fr: "Comparaison directe de termes positifs",
          en: "Direct comparison of positive terms",
          es: "Comparación directa de términos positivos",
        },
        difficulty: 2,
        lessonIds: ["math-an-c02"],
      },
      {
        id: "math-an-td1-03",
        tdId: "math-an-td1",
        title: {
          fr: "Six natures à trancher par équivalent",
          en: "Six series to settle by equivalents",
          es: "Seis naturalezas que decidir por equivalentes",
        },
        difficulty: 3,
        lessonIds: ["math-an-c02"],
      },
      {
        id: "math-an-td1-04",
        tdId: "math-an-td1",
        title: {
          fr: "Comparaison série-intégrale et séries de Bertrand",
          en: "Integral test and Bertrand series",
          es: "Comparación serie-integral y series de Bertrand",
        },
        difficulty: 3,
        lessonIds: ["math-an-c02"],
      },
      {
        id: "math-an-td1-05",
        tdId: "math-an-td1",
        title: {
          fr: "Combien de termes pour une précision donnée ?",
          en: "How many terms for a given accuracy?",
          es: "¿Cuántos términos para una precisión dada?",
        },
        difficulty: 3,
        lessonIds: ["math-an-c01"],
      },
      {
        id: "math-an-td1-06",
        tdId: "math-an-td1",
        title: {
          fr: "Vrai ou faux : la condition nécessaire et ses pièges",
          en: "True or false: the necessary condition and its traps",
          es: "Verdadero o falso: la condición necesaria y sus trampas",
        },
        difficulty: 3,
        lessonIds: ["math-an-c01"],
      },
    ],
  },
  {
    id: "math-an-td2",
    slug: "td-2",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 2 — Rapport, racine, alternance et perturbations",
      en: "TD 2 (tutorial sheet) — Ratio, root, alternation, and perturbations",
      es: "TD 2 (trabajo dirigido) — Cociente, raíz, alternancia y perturbaciones",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td2-01",
        tdId: "math-an-td2",
        title: {
          fr: "Factorielles et puissances : la règle du rapport",
          en: "Factorials and powers: the ratio test",
          es: "Factoriales y potencias: el criterio del cociente",
        },
        difficulty: 2,
        lessonIds: ["math-an-c03"],
      },
      {
        id: "math-an-td2-02",
        tdId: "math-an-td2",
        title: {
          fr: "Puissances n-ièmes : la règle de la racine",
          en: "n-th powers: the root test",
          es: "Potencias n-ésimas: el criterio de la raíz",
        },
        difficulty: 2,
        lessonIds: ["math-an-c03"],
      },
      {
        id: "math-an-td2-03",
        tdId: "math-an-td2",
        title: {
          fr: "Cas douteux : trancher par logarithme et développement limité",
          en: "Inconclusive cases: settling them with logarithms and Taylor expansions",
          es: "Casos dudosos: decidir con logaritmos y desarrollos limitados",
        },
        difficulty: 4,
        lessonIds: ["math-an-c03"],
      },
      {
        id: "math-an-td2-04",
        tdId: "math-an-td2",
        title: {
          fr: "Séries alternées : convergence et majoration du reste",
          en: "Alternating series: convergence and bounding the remainder",
          es: "Series alternadas: convergencia y acotación del resto",
        },
        difficulty: 3,
        lessonIds: ["math-an-c04"],
      },
      {
        id: "math-an-td2-05",
        tdId: "math-an-td2",
        title: {
          fr: "La perturbation qui casse tout : somme de u_n sur 1 plus u_n",
          en: "The perturbation that breaks everything: the sum of u_n over 1 plus u_n",
          es: "La perturbación que lo rompe todo: la suma de u_n sobre 1 más u_n",
        },
        difficulty: 4,
        lessonIds: ["math-an-c04"],
      },
      {
        id: "math-an-td2-06",
        tdId: "math-an-td2",
        title: {
          fr: "Transformation d'Abel : sommes trigonométriques",
          en: "Abel summation: trigonometric sums",
          es: "Transformación de Abel: sumas trigonométricas",
        },
        difficulty: 5,
        lessonIds: ["math-an-c04"],
      },
    ],
  },
  {
    id: "math-an-td3",
    slug: "td-3",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 3 — Suites de fonctions : simple, uniforme, témoins et bosses",
      en: "TD 3 (tutorial sheet) — Sequences of functions: pointwise, uniform, witnesses, and bumps",
      es: "TD 3 (trabajo dirigido) — Sucesiones de funciones: simple, uniforme, testigos y jorobas",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td3-01",
        tdId: "math-an-td3",
        title: {
          fr: "Le contre-exemple fondateur : x puissance n sur le segment unité",
          en: "The founding counterexample: x to the n on the unit segment",
          es: "El contraejemplo fundacional: x elevado a n en el segmento unidad",
        },
        difficulty: 2,
        lessonIds: ["math-an-c05"],
      },
      {
        id: "math-an-td3-02",
        tdId: "math-an-td3",
        title: {
          fr: "Un pic qui ne s'écrase pas : n x exponentielle de moins n x",
          en: "A peak that never flattens: n x times the exponential of minus n x",
          es: "Un pico que no se aplasta: n x por la exponencial de menos n x",
        },
        difficulty: 3,
        lessonIds: ["math-an-c05"],
      },
      {
        id: "math-an-td3-03",
        tdId: "math-an-td3",
        title: {
          fr: "Racine de x carré plus 1 sur n carré : la fonction et ses dérivées",
          en: "Square root of x squared plus 1 over n squared: the function and its derivatives",
          es: "Raíz de x cuadrado más 1 sobre n cuadrado: la función y sus derivadas",
        },
        difficulty: 3,
        lessonIds: ["math-an-c05"],
      },
      {
        id: "math-an-td3-04",
        tdId: "math-an-td3",
        title: {
          fr: "Bosses glissantes : hauteur, largeur, aire",
          en: "Travelling bumps: height, width, area",
          es: "Jorobas móviles: altura, anchura, área",
        },
        difficulty: 4,
        lessonIds: ["math-an-c05"],
      },
      {
        id: "math-an-td3-05",
        tdId: "math-an-td3",
        title: {
          fr: "Vrai ou faux : ce que la convergence uniforme ne donne pas",
          en: "True or false: what uniform convergence does not give you",
          es: "Verdadero o falso: lo que la convergencia uniforme no da",
        },
        difficulty: 3,
        lessonIds: ["math-an-c05", "math-an-c07"],
      },
    ],
  },
  {
    id: "math-an-td4",
    slug: "td-4",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 4 — Séries de fonctions et théorèmes d'échange",
      en: "TD 4 (tutorial sheet) — Series of functions and interchange theorems",
      es: "TD 4 (trabajo dirigido) — Series de funciones y teoremas de intercambio",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td4-01",
        tdId: "math-an-td4",
        title: {
          fr: "Convergence normale d'une série d'exponentielles amorties",
          en: "Normal convergence of a series of damped exponentials",
          es: "Convergencia normal de una serie de exponenciales amortiguadas",
        },
        difficulty: 2,
        lessonIds: ["math-an-c06"],
      },
      {
        id: "math-an-td4-02",
        tdId: "math-an-td4",
        title: {
          fr: "Uniforme sans être normale : une alternée à paramètre",
          en: "Uniform without being normal: an alternating series with a parameter",
          es: "Uniforme sin ser normal: una alternada con parámetro",
        },
        difficulty: 4,
        lessonIds: ["math-an-c06"],
      },
      {
        id: "math-an-td4-03",
        tdId: "math-an-td4",
        title: {
          fr: "Continuité et dérivabilité de la somme",
          en: "Continuity and differentiability of the sum",
          es: "Continuidad y derivabilidad de la suma",
        },
        difficulty: 3,
        lessonIds: ["math-an-c07"],
      },
      {
        id: "math-an-td4-04",
        tdId: "math-an-td4",
        title: {
          fr: "Intégration terme à terme : une identité à démontrer",
          en: "Term-by-term integration: an identity to prove",
          es: "Integración término a término: una identidad que demostrar",
        },
        difficulty: 4,
        lessonIds: ["math-an-c07"],
      },
      {
        id: "math-an-td4-05",
        tdId: "math-an-td4",
        title: {
          fr: "Au bord du domaine : une dérivée qui explose",
          en: "At the edge of the domain: a derivative that blows up",
          es: "En el borde del dominio: una derivada que explota",
        },
        difficulty: 5,
        lessonIds: ["math-an-c07"],
      },
    ],
  },
  {
    id: "math-an-td5",
    slug: "td-5",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 5 — Séries entières : rayon, bord, identités, équations différentielles",
      en: "TD 5 (tutorial sheet) — Power series: radius, boundary, identities, differential equations",
      es: "TD 5 (trabajo dirigido) — Series enteras: radio, borde, identidades, ecuaciones diferenciales",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td5-01",
        tdId: "math-an-td5",
        title: {
          fr: "Cinq rayons de convergence",
          en: "Five radii of convergence",
          es: "Cinco radios de convergencia",
        },
        difficulty: 2,
        lessonIds: ["math-an-c08"],
      },
      {
        id: "math-an-td5-02",
        tdId: "math-an-td5",
        title: {
          fr: "Séries lacunaires : quand la règle du rapport ne s'applique pas",
          en: "Lacunary series: when the ratio test does not apply",
          es: "Series lagunares: cuando el criterio del cociente no se aplica",
        },
        difficulty: 3,
        lessonIds: ["math-an-c08"],
      },
      {
        id: "math-an-td5-03",
        tdId: "math-an-td5",
        title: {
          fr: "Le bord, cas par cas",
          en: "The boundary, case by case",
          es: "El borde, caso por caso",
        },
        difficulty: 3,
        lessonIds: ["math-an-c08"],
      },
      {
        id: "math-an-td5-04",
        tdId: "math-an-td5",
        title: {
          fr: "Expression close d'une série à coefficients fractionnaires",
          en: "Closed form of a series with fractional coefficients",
          es: "Expresión cerrada de una serie con coeficientes fraccionarios",
        },
        difficulty: 3,
        lessonIds: ["math-an-c09"],
      },
      {
        id: "math-an-td5-05",
        tdId: "math-an-td5",
        title: {
          fr: "Résoudre une équation différentielle par série entière",
          en: "Solving a differential equation by power series",
          es: "Resolver una ecuación diferencial por serie entera",
        },
        difficulty: 4,
        lessonIds: ["math-an-c09"],
      },
      {
        id: "math-an-td5-06",
        tdId: "math-an-td5",
        title: {
          fr: "Fonction auxiliaire à dérivée nulle : une identité d'Euler en version guidée",
          en: "Auxiliary function with zero derivative: a guided Euler identity",
          es: "Función auxiliar con derivada nula: una identidad de Euler guiada",
        },
        difficulty: 5,
        lessonIds: ["math-an-c09"],
      },
    ],
  },
  {
    id: "math-an-td6",
    slug: "td-6",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 6 — Intégrales à paramètre, Feynman et asymptotiques",
      en: "TD 6 (tutorial sheet) — Parameter-dependent integrals, Feynman, and asymptotics",
      es: "TD 6 (trabajo dirigido) — Integrales con parámetro, Feynman y asintóticos",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td6-01",
        tdId: "math-an-td6",
        title: {
          fr: "Classe C1, monotonie et premier ordre",
          en: "Class C1, monotonicity, and first order",
          es: "Clase C1, monotonía y primer orden",
        },
        difficulty: 3,
        lessonIds: ["math-an-c10"],
      },
      {
        id: "math-an-td6-02",
        tdId: "math-an-td6",
        title: {
          fr: "Une intégrale impropre : dominer avant de dériver",
          en: "An improper integral: dominate before differentiating",
          es: "Una integral impropia: dominar antes de derivar",
        },
        difficulty: 3,
        lessonIds: ["math-an-c10"],
      },
      {
        id: "math-an-td6-03",
        tdId: "math-an-td6",
        title: {
          fr: "Singularité logarithmique : bien définie, puis calculée",
          en: "Logarithmic singularity: well defined, then computed",
          es: "Singularidad logarítmica: bien definida y luego calculada",
        },
        difficulty: 4,
        lessonIds: ["math-an-c10"],
      },
      {
        id: "math-an-td6-04",
        tdId: "math-an-td6",
        title: {
          fr: "Choisir son paramètre : trois candidats, un seul utile",
          en: "Choosing your parameter: three candidates, only one useful",
          es: "Elegir el parámetro: tres candidatos, sólo uno útil",
        },
        difficulty: 4,
        lessonIds: ["math-an-c11"],
      },
      {
        id: "math-an-td6-05",
        tdId: "math-an-td6",
        title: {
          fr: "Équivalent d'une intégrale par intégration par parties",
          en: "Equivalent of an integral by integration by parts",
          es: "Equivalente de una integral por integración por partes",
        },
        difficulty: 5,
        lessonIds: ["math-an-c11"],
      },
    ],
  },
  {
    id: "math-an-td7",
    slug: "td-7",
    moduleSlug: M,
    subject: "math",
    title: {
      fr: "TD 7 — Intégrales doubles : domaines, Fubini, changements de variables",
      en: "TD 7 (tutorial sheet) — Double integrals: regions, Fubini, changes of variables",
      es: "TD 7 (trabajo dirigido) — Integrales dobles: dominios, Fubini, cambios de variables",
    },
    provenance: "polycopie",
    exercises: [
      {
        id: "math-an-td7-01",
        tdId: "math-an-td7",
        title: {
          fr: "Décrire un domaine, puis intégrer",
          en: "Describe a region, then integrate",
          es: "Describir un dominio y luego integrar",
        },
        difficulty: 2,
        lessonIds: ["math-an-c12"],
      },
      {
        id: "math-an-td7-02",
        tdId: "math-an-td7",
        title: {
          fr: "Inverser l'ordre d'intégration pour rendre le calcul possible",
          en: "Reversing the order of integration to make the computation possible",
          es: "Invertir el orden de integración para hacer posible el cálculo",
        },
        difficulty: 3,
        lessonIds: ["math-an-c12"],
      },
      {
        id: "math-an-td7-03",
        tdId: "math-an-td7",
        title: {
          fr: "Passer en polaires sur un quart de disque",
          en: "Switching to polar coordinates on a quarter disc",
          es: "Pasar a polares en un cuarto de disco",
        },
        difficulty: 3,
        lessonIds: ["math-an-c12"],
      },
      {
        id: "math-an-td7-04",
        tdId: "math-an-td7",
        title: {
          fr: "Aire d'une ellipse par changement de variables",
          en: "Area of an ellipse by change of variables",
          es: "Área de una elipse por cambio de variables",
        },
        difficulty: 3,
        lessonIds: ["math-an-c12"],
      },
    ],
  },
];

export const ANALYSE_EXAMS: ExamMetaData[] = [
  {
    id: "math-an-exam-cc",
    slug: "cc",
    moduleSlug: M,
    subject: "math",
    kind: "cc",
    title: {
      fr: "Contrôle continu — nature des séries numériques",
      en: "Continuous assessment — behaviour of numerical series",
      es: "Control continuo — naturaleza de las series numéricas",
    },
    durationMinutes: 45,
    totalPoints: 20,
    topics: ["math-an-c01", "math-an-c02", "math-an-c03", "math-an-c04"],
    provenance: "polycopie",
  },
  {
    id: "math-an-exam-partiel",
    slug: "partiel",
    moduleSlug: M,
    subject: "math",
    kind: "partiel",
    title: {
      fr: "Partiel — séries numériques et convergence de fonctions",
      en: "Midterm — numerical series and convergence of functions",
      es: "Parcial — series numéricas y convergencia de funciones",
    },
    durationMinutes: 120,
    totalPoints: 20,
    topics: [
      "math-an-c01",
      "math-an-c02",
      "math-an-c03",
      "math-an-c04",
      "math-an-c05",
      "math-an-c06",
      "math-an-c07",
    ],
    provenance: "polycopie",
  },
  {
    id: "math-an-exam-final",
    slug: "final",
    moduleSlug: M,
    subject: "math",
    kind: "final",
    title: {
      fr: "Examen final — séries entières, intégrales à paramètre, synthèse",
      en: "Final exam — power series, parameter-dependent integrals, synthesis",
      es: "Examen final — series enteras, integrales con parámetro, síntesis",
    },
    durationMinutes: 120,
    totalPoints: 20,
    topics: [
      "math-an-c08",
      "math-an-c09",
      "math-an-c10",
      "math-an-c11",
      "math-an-c12",
    ],
    provenance: "polycopie",
  },
];
