// Glossary for the math track "Analyse & convergence" — same contract as
// glossaire-fmv.ts: every technical term is DEFINED in exactly one lesson
// (its `lessonId`), at the anchor `#def-<id>` minted by the <Def> component;
// every other mention links to it with <Terme id="…">.
//
// Rules (enforced by scripts/verify-content.cjs):
//  - `id` is stable, ASCII kebab-case (it becomes part of a URL fragment);
//  - `short` is plain text — no dollar-delimited math (it renders inside a
//    title attribute, where KaTeX cannot run); unicode (α, ε, ∑, ⁿ) is fine;
//  - each entry's <Def> lives in the lesson matching `lessonId`, exactly once.

import type { TermeEntry } from "./glossaire-fmv";

export const ANALYSE_TERMES: TermeEntry[] = [
  // ── c00 · Boîte à outils ────────────────────────────────────────────────
  {
    id: "suite-convergente",
    label: { fr: "suite convergente", en: "convergent sequence", es: "sucesión convergente" },
    short: {
      fr: "Suite dont les termes finissent par rester aussi près qu'on veut d'un nombre fixe, sa limite.",
      en: "A sequence whose terms eventually stay as close as you like to one fixed number, its limit.",
      es: "Sucesión cuyos términos acaban por permanecer tan cerca como se quiera de un número fijo, su límite.",
    },
    lessonId: "math-an-c00",
  },
  {
    id: "equivalent",
    label: { fr: "équivalent", en: "asymptotic equivalent", es: "equivalente" },
    short: {
      fr: "Deux suites sont équivalentes quand le quotient de l'une par l'autre tend vers 1.",
      en: "Two sequences are equivalent when the ratio of one to the other tends to 1.",
      es: "Dos sucesiones son equivalentes cuando el cociente de una entre otra tiende a 1.",
    },
    lessonId: "math-an-c00",
  },
  {
    id: "negligeable",
    label: { fr: "négligeable (petit o)", en: "negligible (little o)", es: "despreciable (o pequeña)" },
    short: {
      fr: "Une suite est négligeable devant une autre quand leur quotient tend vers 0.",
      en: "One sequence is negligible compared with another when their ratio tends to 0.",
      es: "Una sucesión es despreciable frente a otra cuando su cociente tiende a 0.",
    },
    lessonId: "math-an-c00",
  },
  {
    id: "formule-de-taylor-young",
    label: { fr: "formule de Taylor-Young", en: "Taylor-Young formula", es: "fórmula de Taylor-Young" },
    short: {
      fr: "Approximation locale d'une fonction par un polynôme, avec un reste négligeable devant le dernier terme gardé.",
      en: "Local approximation of a function by a polynomial, with a remainder negligible against the last term kept.",
      es: "Aproximación local de una función por un polinomio, con un resto despreciable frente al último término conservado.",
    },
    lessonId: "math-an-c00",
  },

  // ── c01 · Séries numériques ─────────────────────────────────────────────
  {
    id: "serie-numerique",
    label: { fr: "série numérique", en: "numerical series", es: "serie numérica" },
    short: {
      fr: "Objet formé d'une suite de termes et de la suite de ses sommes partielles.",
      en: "The object made of a sequence of terms together with the sequence of its partial sums.",
      es: "Objeto formado por una sucesión de términos y la sucesión de sus sumas parciales.",
    },
    lessonId: "math-an-c01",
  },
  {
    id: "somme-partielle",
    label: { fr: "somme partielle", en: "partial sum", es: "suma parcial" },
    short: {
      fr: "Somme des N premiers termes d'une série ; c'est elle, et non la série, qui a une limite.",
      en: "The sum of the first N terms of a series; it is what has a limit, not the series itself.",
      es: "Suma de los N primeros términos de una serie; es ella, y no la serie, la que tiene límite.",
    },
    lessonId: "math-an-c01",
  },
  {
    id: "serie-convergente",
    label: { fr: "série convergente", en: "convergent series", es: "serie convergente" },
    short: {
      fr: "Série dont la suite des sommes partielles converge ; sa limite est la somme de la série.",
      en: "A series whose sequence of partial sums converges; that limit is the sum of the series.",
      es: "Serie cuya sucesión de sumas parciales converge; ese límite es la suma de la serie.",
    },
    lessonId: "math-an-c01",
  },
  {
    id: "reste-d-une-serie",
    label: { fr: "reste d'une série", en: "remainder of a series", es: "resto de una serie" },
    short: {
      fr: "Ce qui manque encore après N termes : la somme totale moins la somme partielle de rang N.",
      en: "What is still missing after N terms: the total sum minus the partial sum of order N.",
      es: "Lo que aún falta tras N términos: la suma total menos la suma parcial de orden N.",
    },
    lessonId: "math-an-c01",
  },
  {
    id: "serie-geometrique",
    label: { fr: "série géométrique", en: "geometric series", es: "serie geométrica" },
    short: {
      fr: "Série dont chaque terme est le précédent multiplié par une raison fixe ; elle converge si cette raison est de valeur absolue plus petite que 1.",
      en: "A series where each term is the previous one times a fixed ratio; it converges when that ratio has absolute value below 1.",
      es: "Serie en la que cada término es el anterior multiplicado por una razón fija; converge si esa razón tiene valor absoluto menor que 1.",
    },
    lessonId: "math-an-c01",
  },
  {
    id: "serie-harmonique",
    label: { fr: "série harmonique", en: "harmonic series", es: "serie armónica" },
    short: {
      fr: "Somme des inverses des entiers : ses termes tendent vers 0 et pourtant elle diverge.",
      en: "The sum of the reciprocals of the integers: its terms tend to 0 and yet it diverges.",
      es: "Suma de los inversos de los enteros: sus términos tienden a 0 y aun así diverge.",
    },
    lessonId: "math-an-c01",
  },
  {
    id: "serie-telescopique",
    label: { fr: "série télescopique", en: "telescoping series", es: "serie telescópica" },
    short: {
      fr: "Série dont le terme général est une différence de deux valeurs consécutives, si bien que la somme partielle se simplifie.",
      en: "A series whose general term is a difference of two consecutive values, so the partial sum collapses.",
      es: "Serie cuyo término general es una diferencia de dos valores consecutivos, de modo que la suma parcial se simplifica.",
    },
    lessonId: "math-an-c01",
  },

  // ── c02 · Séries à termes positifs ──────────────────────────────────────
  {
    id: "serie-a-termes-positifs",
    label: { fr: "série à termes positifs", en: "series with positive terms", es: "serie de términos positivos" },
    short: {
      fr: "Série dont les termes sont positifs à partir d'un certain rang ; ses sommes partielles ne peuvent que croître.",
      en: "A series whose terms are positive from some index on; its partial sums can only increase.",
      es: "Serie cuyos términos son positivos a partir de cierto índice; sus sumas parciales sólo pueden crecer.",
    },
    lessonId: "math-an-c02",
  },
  {
    id: "critere-de-comparaison",
    label: { fr: "critère de comparaison", en: "comparison test", es: "criterio de comparación" },
    short: {
      fr: "Encadrer un terme positif par celui d'une série connue transmet la convergence vers le bas et la divergence vers le haut.",
      en: "Bounding a positive term by that of a known series passes convergence downwards and divergence upwards.",
      es: "Acotar un término positivo por el de una serie conocida transmite la convergencia hacia abajo y la divergencia hacia arriba.",
    },
    lessonId: "math-an-c02",
  },
  {
    id: "serie-de-riemann",
    label: { fr: "série de Riemann", en: "Riemann series", es: "serie de Riemann" },
    short: {
      fr: "Série des inverses des puissances des entiers ; elle converge exactement quand l'exposant dépasse 1.",
      en: "The series of reciprocal powers of the integers; it converges exactly when the exponent exceeds 1.",
      es: "Serie de los inversos de las potencias de los enteros; converge exactamente cuando el exponente supera 1.",
    },
    lessonId: "math-an-c02",
  },
  {
    id: "comparaison-serie-integrale",
    label: { fr: "comparaison série-intégrale", en: "integral test", es: "comparación serie-integral" },
    short: {
      fr: "Encadrer les termes d'une série par des aires sous une fonction décroissante pour transférer sa nature.",
      en: "Bounding the terms of a series by areas under a decreasing function to transfer its behaviour.",
      es: "Acotar los términos de una serie por áreas bajo una función decreciente para transferir su naturaleza.",
    },
    lessonId: "math-an-c02",
  },

  // ── c03 · Règles de d'Alembert et de Cauchy ─────────────────────────────
  {
    id: "regle-de-d-alembert",
    label: { fr: "règle de d'Alembert", en: "ratio test", es: "criterio de d'Alembert" },
    short: {
      fr: "La limite du rapport d'un terme au précédent décide : plus petite que 1 convergence, plus grande divergence.",
      en: "The limit of the ratio of one term to the previous decides: below 1 convergence, above 1 divergence.",
      es: "El límite del cociente de un término entre el anterior decide: menor que 1 convergencia, mayor divergencia.",
    },
    lessonId: "math-an-c03",
  },
  {
    id: "regle-de-cauchy",
    label: { fr: "règle de Cauchy", en: "root test", es: "criterio de Cauchy" },
    short: {
      fr: "La limite de la racine n-ième du terme général décide, comme la règle du rapport.",
      en: "The limit of the n-th root of the general term decides, just like the ratio test.",
      es: "El límite de la raíz n-ésima del término general decide, igual que el criterio del cociente.",
    },
    lessonId: "math-an-c03",
  },
  {
    id: "cas-douteux",
    label: { fr: "cas douteux", en: "inconclusive case", es: "caso dudoso" },
    short: {
      fr: "Situation où le rapport ou la racine tend vers 1 : la règle ne conclut pas et il faut un outil plus fin.",
      en: "The case where the ratio or root tends to 1: the test concludes nothing and a finer tool is needed.",
      es: "Situación en la que el cociente o la raíz tiende a 1: el criterio no concluye y hace falta una herramienta más fina.",
    },
    lessonId: "math-an-c03",
  },

  // ── c04 · Alternées, Abel, perturbations ────────────────────────────────
  {
    id: "convergence-absolue",
    label: { fr: "convergence absolue", en: "absolute convergence", es: "convergencia absoluta" },
    short: {
      fr: "La série des valeurs absolues converge ; c'est plus fort que la convergence ordinaire.",
      en: "The series of absolute values converges; this is stronger than ordinary convergence.",
      es: "La serie de los valores absolutos converge; es más fuerte que la convergencia ordinaria.",
    },
    lessonId: "math-an-c04",
  },
  {
    id: "semi-convergence",
    label: { fr: "semi-convergence", en: "conditional convergence", es: "semiconvergencia" },
    short: {
      fr: "La série converge mais celle des valeurs absolues diverge : la convergence vient des compensations de signe.",
      en: "The series converges but the series of absolute values diverges: convergence comes from sign cancellation.",
      es: "La serie converge pero la de los valores absolutos diverge: la convergencia procede de la compensación de signos.",
    },
    lessonId: "math-an-c04",
  },
  {
    id: "serie-alternee",
    label: { fr: "série alternée", en: "alternating series", es: "serie alternada" },
    short: {
      fr: "Série dont les termes changent de signe à chaque rang.",
      en: "A series whose terms change sign at every index.",
      es: "Serie cuyos términos cambian de signo en cada índice.",
    },
    lessonId: "math-an-c04",
  },
  {
    id: "critere-de-leibniz",
    label: { fr: "critère de Leibniz", en: "Leibniz test", es: "criterio de Leibniz" },
    short: {
      fr: "Une série alternée dont la valeur absolue des termes décroît vers 0 converge, et son reste est majoré par le premier terme négligé.",
      en: "An alternating series whose term sizes decrease to 0 converges, and its remainder is bounded by the first omitted term.",
      es: "Una serie alternada cuyos términos decrecen en valor absoluto hacia 0 converge, y su resto está acotado por el primer término omitido.",
    },
    lessonId: "math-an-c04",
  },
  {
    id: "transformation-d-abel",
    label: { fr: "transformation d'Abel", en: "Abel summation", es: "transformación de Abel" },
    short: {
      fr: "Intégration par parties discrète : on somme un facteur et on fait porter la différence sur l'autre.",
      en: "Discrete integration by parts: one factor is summed and the difference is moved onto the other.",
      es: "Integración por partes discreta: se suma un factor y la diferencia se traslada al otro.",
    },
    lessonId: "math-an-c04",
  },

  // ── c05 · Suites de fonctions ───────────────────────────────────────────
  {
    id: "convergence-simple",
    label: { fr: "convergence simple", en: "pointwise convergence", es: "convergencia simple" },
    short: {
      fr: "En chaque point pris séparément, la suite de nombres converge ; le rang nécessaire peut dépendre du point.",
      en: "At each point taken separately the sequence of numbers converges; the index needed may depend on the point.",
      es: "En cada punto por separado la sucesión de números converge; el índice necesario puede depender del punto.",
    },
    lessonId: "math-an-c05",
  },
  {
    id: "convergence-uniforme",
    label: { fr: "convergence uniforme", en: "uniform convergence", es: "convergencia uniforme" },
    short: {
      fr: "Un même rang convient pour tous les points à la fois : l'erreur maximale sur le domaine tend vers 0.",
      en: "A single index works for every point at once: the maximal error over the domain tends to 0.",
      es: "Un mismo índice sirve para todos los puntos a la vez: el error máximo sobre el dominio tiende a 0.",
    },
    lessonId: "math-an-c05",
  },
  {
    id: "norme-uniforme",
    label: { fr: "norme uniforme", en: "uniform norm", es: "norma uniforme" },
    short: {
      fr: "Plus grand écart possible entre deux fonctions sur un domaine, mesuré par une borne supérieure.",
      en: "The largest possible gap between two functions on a domain, measured by a supremum.",
      es: "La mayor separación posible entre dos funciones en un dominio, medida por un supremo.",
    },
    lessonId: "math-an-c05",
  },
  {
    id: "suite-temoin",
    label: { fr: "suite témoin", en: "witness sequence", es: "sucesión testigo" },
    short: {
      fr: "Points choisis en fonction du rang pour prouver qu'une convergence n'est pas uniforme.",
      en: "Points chosen as a function of the index to prove that a convergence is not uniform.",
      es: "Puntos elegidos en función del índice para probar que una convergencia no es uniforme.",
    },
    lessonId: "math-an-c05",
  },
  {
    id: "bosse-glissante",
    label: { fr: "bosse glissante", en: "travelling bump", es: "joroba móvil" },
    short: {
      fr: "Famille de fonctions dont le pic garde sa hauteur ou son aire tout en se déplaçant ou en se rétrécissant.",
      en: "A family of functions whose peak keeps its height or its area while moving or narrowing.",
      es: "Familia de funciones cuyo pico conserva su altura o su área mientras se desplaza o se estrecha.",
    },
    lessonId: "math-an-c05",
  },

  // ── c06 · Séries de fonctions ───────────────────────────────────────────
  {
    id: "serie-de-fonctions",
    label: { fr: "série de fonctions", en: "series of functions", es: "serie de funciones" },
    short: {
      fr: "Série dont les termes sont des fonctions ; sa somme partielle est elle-même une fonction.",
      en: "A series whose terms are functions; its partial sum is itself a function.",
      es: "Serie cuyos términos son funciones; su suma parcial es a su vez una función.",
    },
    lessonId: "math-an-c06",
  },
  {
    id: "convergence-normale",
    label: { fr: "convergence normale", en: "normal convergence", es: "convergencia normal" },
    short: {
      fr: "La série des normes uniformes des termes converge ; c'est la condition la plus commode, et elle entraîne la convergence uniforme.",
      en: "The series of the terms' uniform norms converges; the handiest condition, and it implies uniform convergence.",
      es: "La serie de las normas uniformes de los términos converge; es la condición más cómoda e implica la convergencia uniforme.",
    },
    lessonId: "math-an-c06",
  },
  {
    id: "critere-de-weierstrass",
    label: { fr: "critère de Weierstrass", en: "Weierstrass M-test", es: "criterio de Weierstrass" },
    short: {
      fr: "Majorer chaque fonction par un nombre indépendant de la variable, puis sommer ces nombres.",
      en: "Bound each function by a number independent of the variable, then sum those numbers.",
      es: "Acotar cada función por un número independiente de la variable y luego sumar esos números.",
    },
    lessonId: "math-an-c06",
  },

  // ── c07 · Théorèmes d'échange ───────────────────────────────────────────
  {
    id: "interversion-limite-integrale",
    label: { fr: "interversion limite-intégrale", en: "swapping limit and integral", es: "intercambio límite-integral" },
    short: {
      fr: "Passer la limite sous le signe intégral ; légitime sous convergence uniforme sur un segment, faux en général.",
      en: "Moving the limit inside the integral sign; legitimate under uniform convergence on a segment, false in general.",
      es: "Pasar el límite bajo el signo integral; legítimo con convergencia uniforme en un segmento, falso en general.",
    },
    lessonId: "math-an-c07",
  },
  {
    id: "integration-terme-a-terme",
    label: { fr: "intégration terme à terme", en: "term-by-term integration", es: "integración término a término" },
    short: {
      fr: "Intégrer une somme infinie en intégrant chaque terme séparément.",
      en: "Integrating an infinite sum by integrating each term separately.",
      es: "Integrar una suma infinita integrando cada término por separado.",
    },
    lessonId: "math-an-c07",
  },
  {
    id: "derivation-terme-a-terme",
    label: { fr: "dérivation terme à terme", en: "term-by-term differentiation", es: "derivación término a término" },
    short: {
      fr: "Dériver une somme infinie terme par terme ; c'est la série des dérivées qui doit converger uniformément.",
      en: "Differentiating an infinite sum term by term; it is the series of derivatives that must converge uniformly.",
      es: "Derivar una suma infinita término a término; es la serie de las derivadas la que debe converger uniformemente.",
    },
    lessonId: "math-an-c07",
  },

  // ── c08 · Séries entières ───────────────────────────────────────────────
  {
    id: "serie-entiere",
    label: { fr: "série entière", en: "power series", es: "serie entera" },
    short: {
      fr: "Somme infinie de monômes à coefficients fixes : un polynôme de degré infini.",
      en: "An infinite sum of monomials with fixed coefficients: a polynomial of infinite degree.",
      es: "Suma infinita de monomios con coeficientes fijos: un polinomio de grado infinito.",
    },
    lessonId: "math-an-c08",
  },
  {
    id: "lemme-d-abel",
    label: { fr: "lemme d'Abel", en: "Abel's lemma", es: "lema de Abel" },
    short: {
      fr: "Si les termes restent bornés en un point, la série converge absolument en tout point strictement plus proche de l'origine.",
      en: "If the terms stay bounded at one point, the series converges absolutely at every point strictly closer to the origin.",
      es: "Si los términos permanecen acotados en un punto, la serie converge absolutamente en todo punto estrictamente más cercano al origen.",
    },
    lessonId: "math-an-c08",
  },
  {
    id: "rayon-de-convergence",
    label: { fr: "rayon de convergence", en: "radius of convergence", es: "radio de convergencia" },
    short: {
      fr: "Distance à l'origine qui sépare la zone de convergence absolue de la zone de divergence.",
      en: "The distance from the origin separating the region of absolute convergence from the region of divergence.",
      es: "Distancia al origen que separa la zona de convergencia absoluta de la zona de divergencia.",
    },
    lessonId: "math-an-c08",
  },
  {
    id: "intervalle-ouvert-de-convergence",
    label: { fr: "intervalle ouvert de convergence", en: "open interval of convergence", es: "intervalo abierto de convergencia" },
    short: {
      fr: "Intervalle des points strictement plus proches de l'origine que le rayon ; les deux extrémités s'étudient à part.",
      en: "The interval of points strictly closer to the origin than the radius; the two endpoints are studied separately.",
      es: "Intervalo de los puntos estrictamente más cercanos al origen que el radio; los dos extremos se estudian aparte.",
    },
    lessonId: "math-an-c08",
  },

  // ── c09 · Développements en série entière ───────────────────────────────
  {
    id: "developpement-en-serie-entiere",
    label: { fr: "développement en série entière", en: "power series expansion", es: "desarrollo en serie entera" },
    short: {
      fr: "Écriture d'une fonction comme somme d'une série entière sur un voisinage de 0.",
      en: "Writing a function as the sum of a power series on a neighbourhood of 0.",
      es: "Escritura de una función como suma de una serie entera en un entorno de 0.",
    },
    lessonId: "math-an-c09",
  },
  {
    id: "serie-de-taylor",
    label: { fr: "série de Taylor", en: "Taylor series", es: "serie de Taylor" },
    short: {
      fr: "Série entière dont les coefficients sont les dérivées successives en 0 divisées par les factorielles.",
      en: "The power series whose coefficients are the successive derivatives at 0 divided by factorials.",
      es: "Serie entera cuyos coeficientes son las derivadas sucesivas en 0 divididas por los factoriales.",
    },
    lessonId: "math-an-c09",
  },
  {
    id: "exponentielle-complexe",
    label: { fr: "exponentielle complexe", en: "complex exponential", es: "exponencial compleja" },
    short: {
      fr: "Prolongement de l'exponentielle aux nombres complexes par sa série, qui relie exponentielle, cosinus et sinus.",
      en: "The extension of the exponential to complex numbers via its series, linking exponential, cosine and sine.",
      es: "Prolongación de la exponencial a los números complejos mediante su serie, que relaciona exponencial, coseno y seno.",
    },
    lessonId: "math-an-c09",
  },

  // ── c10 · Intégrales à paramètre ────────────────────────────────────────
  {
    id: "integrale-a-parametre",
    label: { fr: "intégrale à paramètre", en: "parameter-dependent integral", es: "integral con parámetro" },
    short: {
      fr: "Fonction définie par une intégrale dont l'intégrande dépend d'une variable extérieure.",
      en: "A function defined by an integral whose integrand depends on an outside variable.",
      es: "Función definida por una integral cuyo integrando depende de una variable externa.",
    },
    lessonId: "math-an-c10",
  },
  {
    id: "hypothese-de-domination",
    label: { fr: "hypothèse de domination", en: "domination hypothesis", es: "hipótesis de dominación" },
    short: {
      fr: "Majorer l'intégrande par une fonction intégrable indépendante du paramètre.",
      en: "Bounding the integrand by an integrable function that does not depend on the parameter.",
      es: "Acotar el integrando por una función integrable independiente del parámetro.",
    },
    lessonId: "math-an-c10",
  },
  {
    id: "derivation-sous-le-signe-integral",
    label: { fr: "dérivation sous le signe intégral", en: "differentiating under the integral sign", es: "derivación bajo el signo integral" },
    short: {
      fr: "Dériver une intégrale à paramètre en dérivant seulement l'intégrande, sous condition de domination.",
      en: "Differentiating a parameter-dependent integral by differentiating only the integrand, under a domination condition.",
      es: "Derivar una integral con parámetro derivando sólo el integrando, bajo condición de dominación.",
    },
    lessonId: "math-an-c10",
  },

  // ── c11 · Feynman et asymptotiques ──────────────────────────────────────
  {
    id: "methode-de-feynman",
    label: { fr: "méthode de Feynman", en: "Feynman's trick", es: "método de Feynman" },
    short: {
      fr: "Introduire un paramètre dans une intégrale difficile pour la transformer, en dérivant, en une intégrale simple.",
      en: "Introducing a parameter into a hard integral so that differentiating turns it into an easy one.",
      es: "Introducir un parámetro en una integral difícil para que, al derivar, se convierta en una integral sencilla.",
    },
    lessonId: "math-an-c11",
  },
  {
    id: "developpement-asymptotique",
    label: { fr: "développement asymptotique", en: "asymptotic expansion", es: "desarrollo asintótico" },
    short: {
      fr: "Écriture d'une quantité comme terme principal plus corrections d'ordre décroissant, avec contrôle du reste.",
      en: "Writing a quantity as a leading term plus corrections of decreasing order, with the remainder controlled.",
      es: "Escritura de una cantidad como término principal más correcciones de orden decreciente, con control del resto.",
    },
    lessonId: "math-an-c11",
  },

  // ── c12 · Intégrales doubles ────────────────────────────────────────────
  {
    id: "integrale-double",
    label: { fr: "intégrale double", en: "double integral", es: "integral doble" },
    short: {
      fr: "Intégrale d'une fonction de deux variables sur une partie du plan ; elle mesure un volume algébrique.",
      en: "The integral of a two-variable function over a region of the plane; it measures an algebraic volume.",
      es: "Integral de una función de dos variables sobre una región del plano; mide un volumen algebraico.",
    },
    lessonId: "math-an-c12",
  },
  {
    id: "theoreme-de-fubini",
    label: { fr: "théorème de Fubini", en: "Fubini's theorem", es: "teorema de Fubini" },
    short: {
      fr: "Calculer une intégrale double par deux intégrations successives, dans l'ordre le plus commode.",
      en: "Computing a double integral by two successive integrations, in whichever order is handier.",
      es: "Calcular una integral doble mediante dos integraciones sucesivas, en el orden más cómodo.",
    },
    lessonId: "math-an-c12",
  },
  {
    id: "changement-de-variables",
    label: { fr: "changement de variables", en: "change of variables", es: "cambio de variables" },
    short: {
      fr: "Remplacer les coordonnées par d'autres mieux adaptées au domaine, en corrigeant la déformation des aires.",
      en: "Replacing the coordinates by others better suited to the region, correcting for the distortion of areas.",
      es: "Sustituir las coordenadas por otras mejor adaptadas al dominio, corrigiendo la deformación de las áreas.",
    },
    lessonId: "math-an-c12",
  },
  {
    id: "jacobien",
    label: { fr: "jacobien", en: "Jacobian", es: "jacobiano" },
    short: {
      fr: "Facteur local de dilatation des aires d'un changement de variables ; c'est sa valeur absolue qui entre dans l'intégrale.",
      en: "The local area-stretching factor of a change of variables; it is its absolute value that enters the integral.",
      es: "Factor local de dilatación de áreas de un cambio de variables; es su valor absoluto el que entra en la integral.",
    },
    lessonId: "math-an-c12",
  },
];
