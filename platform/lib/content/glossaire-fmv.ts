// Glossary for the math FMV track: every technical term is DEFINED in exactly
// one lesson (its `lessonId`), at an anchor derived by convention from the id
// (`#def-<id>`, minted by the <Def> component). Exercises, exams and later
// lessons link to that definition with <Terme id="…">, which also shows the
// one-line `short` gloss on hover.
//
// Rules (enforced by scripts/verify-content.cjs):
//  - `id` is stable, ASCII kebab-case (it becomes part of a URL fragment);
//  - `short` is plain text — no dollar-delimited math (it renders inside a
//    title attribute, where KaTeX cannot run);
//  - each entry's <Def> lives in the lesson matching `lessonId`, exactly once.

import type { L10nString } from "./types";

export type TermeEntry = {
  id: string;
  label: L10nString; // canonical display form of the term
  short: L10nString; // one-sentence hover definition, plain text
  lessonId: string; // lesson whose <Def id> is the definition site
};

export const MATH_TERMES: TermeEntry[] = [
  // ── c00 · Remise à niveau ────────────────────────────────────────────────
  {
    id: "developpement-limite",
    label: { fr: "développement limité", en: "Taylor expansion", es: "desarrollo limitado" },
    short: {
      fr: "Approximation d'une fonction près d'un point par un polynôme (ordre 1 : la tangente).",
      en: "Approximation of a function near a point by a polynomial (order 1: the tangent line).",
      es: "Aproximación de una función cerca de un punto por un polinomio (orden 1: la tangente).",
    },
    lessonId: "math-fmv-c00",
  },

  // ── c01 · Géométrie et coordonnées ───────────────────────────────────────
  {
    id: "coordonnees-polaires",
    label: { fr: "coordonnées polaires", en: "polar coordinates", es: "coordenadas polares" },
    short: {
      fr: "Repérage d'un point du plan par sa distance à l'origine r et son angle θ.",
      en: "Locating a point in the plane by its distance to the origin r and its angle θ.",
      es: "Localización de un punto del plano por su distancia al origen r y su ángulo θ.",
    },
    lessonId: "math-fmv-c01",
  },
  {
    id: "coordonnees-cylindriques",
    label: { fr: "coordonnées cylindriques", en: "cylindrical coordinates", es: "coordenadas cilíndricas" },
    short: {
      fr: "Coordonnées polaires du plan complétées par la hauteur z — adaptées aux symétries d'axe.",
      en: "Plane polar coordinates plus the height z — suited to axial symmetry.",
      es: "Coordenadas polares del plano más la altura z — adaptadas a las simetrías de eje.",
    },
    lessonId: "math-fmv-c01",
  },
  {
    id: "coordonnees-spheriques",
    label: { fr: "coordonnées sphériques", en: "spherical coordinates", es: "coordenadas esféricas" },
    short: {
      fr: "Repérage par la distance au centre r et deux angles — adaptées aux symétries de centre (atomes, orbitales).",
      en: "Locating by the distance to the centre r and two angles — suited to central symmetry (atoms, orbitals).",
      es: "Localización por la distancia al centro r y dos ángulos — adaptadas a la simetría central (átomos, orbitales).",
    },
    lessonId: "math-fmv-c01",
  },

  // ── c02 · Surfaces et lignes de niveau ───────────────────────────────────
  {
    id: "champ-scalaire",
    label: { fr: "champ scalaire", en: "scalar field", es: "campo escalar" },
    short: {
      fr: "Fonction qui attache un nombre à chaque point de l'espace, comme une énergie ou une concentration.",
      en: "Function attaching a number to every point of space, like an energy or a concentration.",
      es: "Función que asigna un número a cada punto del espacio, como una energía o una concentración.",
    },
    lessonId: "math-fmv-c02",
  },
  {
    id: "graphe",
    label: { fr: "graphe (surface)", en: "graph (surface)", es: "gráfica (superficie)" },
    short: {
      fr: "Surface z = f(x, y) dessinée au-dessus du plan : l'altitude au point (x, y) vaut f(x, y).",
      en: "Surface z = f(x, y) drawn above the plane: the altitude over the point (x, y) is f(x, y).",
      es: "Superficie z = f(x, y) dibujada sobre el plano: la altitud sobre el punto (x, y) vale f(x, y).",
    },
    lessonId: "math-fmv-c02",
  },
  {
    id: "ligne-de-niveau",
    label: { fr: "ligne de niveau", en: "level curve", es: "línea de nivel" },
    short: {
      fr: "Ensemble des points où f vaut une même valeur c — la courbe d'altitude c d'une carte topographique.",
      en: "Set of points where f takes one same value c — the altitude-c curve of a topographic map.",
      es: "Conjunto de puntos donde f toma un mismo valor c — la curva de altitud c de un mapa topográfico.",
    },
    lessonId: "math-fmv-c02",
  },
  {
    id: "ensemble-de-niveau",
    label: { fr: "ensemble de niveau", en: "level set", es: "conjunto de nivel" },
    short: {
      fr: "Généralisation de la ligne de niveau à n variables (surface de niveau en dimension 3).",
      en: "Generalisation of the level curve to n variables (level surface in dimension 3).",
      es: "Generalización de la línea de nivel a n variables (superficie de nivel en dimensión 3).",
    },
    lessonId: "math-fmv-c02",
  },
  {
    id: "fonction-partielle",
    label: { fr: "fonction partielle", en: "partial function", es: "función parcial" },
    short: {
      fr: "Fonction d'une seule variable obtenue en gelant les autres — une tranche verticale de la surface.",
      en: "One-variable function obtained by freezing the others — a vertical slice of the surface.",
      es: "Función de una sola variable obtenida congelando las demás — un corte vertical de la superficie.",
    },
    lessonId: "math-fmv-c02",
  },

  // ── c03 · Limites et continuité ──────────────────────────────────────────
  {
    id: "limite",
    label: { fr: "limite (en deux variables)", en: "limit (in two variables)", es: "límite (en dos variables)" },
    short: {
      fr: "Valeur dont f s'approche quel que soit le chemin d'arrivée vers le point — tous les chemins doivent donner la même.",
      en: "Value f approaches no matter the path of approach to the point — every path must give the same one.",
      es: "Valor al que se acerca f sea cual sea el camino de llegada al punto — todos los caminos deben dar el mismo.",
    },
    lessonId: "math-fmv-c03",
  },
  {
    id: "continuite",
    label: { fr: "continuité", en: "continuity", es: "continuidad" },
    short: {
      fr: "f est continue en un point si sa limite y existe et vaut f(point) : pas de saut, pas de trou.",
      en: "f is continuous at a point if its limit there exists and equals f(point): no jump, no hole.",
      es: "f es continua en un punto si su límite allí existe y vale f(punto): sin salto ni agujero.",
    },
    lessonId: "math-fmv-c03",
  },

  // ── c04 · Dérivées partielles et gradient ────────────────────────────────
  {
    id: "derivee-partielle",
    label: { fr: "dérivée partielle", en: "partial derivative", es: "derivada parcial" },
    short: {
      fr: "Vitesse de variation de f quand UNE variable bouge et que les autres sont gelées.",
      en: "Rate of change of f when ONE variable moves while the others are frozen.",
      es: "Velocidad de variación de f cuando UNA variable se mueve y las demás quedan congeladas.",
    },
    lessonId: "math-fmv-c04",
  },
  {
    id: "gradient",
    label: { fr: "gradient", en: "gradient", es: "gradiente" },
    short: {
      fr: "Vecteur des dérivées partielles : il pointe vers la plus forte montée, perpendiculairement aux lignes de niveau.",
      en: "Vector of the partial derivatives: it points toward steepest ascent, perpendicular to level curves.",
      es: "Vector de las derivadas parciales: apunta hacia la subida más fuerte, perpendicular a las líneas de nivel.",
    },
    lessonId: "math-fmv-c04",
  },
  {
    id: "plan-tangent",
    label: { fr: "plan tangent", en: "tangent plane", es: "plano tangente" },
    short: {
      fr: "Le plan qui épouse la surface en un point — la meilleure approximation linéaire de f autour de ce point.",
      en: "The plane hugging the surface at a point — the best linear approximation of f around that point.",
      es: "El plano que se ajusta a la superficie en un punto — la mejor aproximación lineal de f alrededor de ese punto.",
    },
    lessonId: "math-fmv-c04",
  },
  {
    id: "differentielle-totale",
    label: { fr: "différentielle totale", en: "total differential", es: "diferencial total" },
    short: {
      fr: "Variation de f au premier ordre quand toutes les variables bougent en même temps — l'outil central de la thermo.",
      en: "First-order change of f when all variables move at once — the central tool of thermodynamics.",
      es: "Variación de f a primer orden cuando todas las variables se mueven a la vez — la herramienta central de la termodinámica.",
    },
    lessonId: "math-fmv-c04",
  },
  {
    id: "regle-de-la-chaine",
    label: { fr: "règle de la chaîne", en: "chain rule", es: "regla de la cadena" },
    short: {
      fr: "Formule pour dériver une fonction composée : les contributions de chaque variable intermédiaire s'additionnent.",
      en: "Rule for differentiating a composition: the contributions of each intermediate variable add up.",
      es: "Fórmula para derivar una función compuesta: las contribuciones de cada variable intermedia se suman.",
    },
    lessonId: "math-fmv-c04",
  },
  {
    id: "derivee-directionnelle",
    label: { fr: "dérivée directionnelle", en: "directional derivative", es: "derivada direccional" },
    short: {
      fr: "Pente de la surface quand on part d'un point dans une direction choisie — un produit scalaire avec le gradient.",
      en: "Slope of the surface when leaving a point in a chosen direction — a dot product with the gradient.",
      es: "Pendiente de la superficie al salir de un punto en una dirección elegida — un producto escalar con el gradiente.",
    },
    lessonId: "math-fmv-c04",
  },

  // ── c05 · Propagation des incertitudes ───────────────────────────────────
  {
    id: "incertitude-type",
    label: { fr: "incertitude-type", en: "standard uncertainty", es: "incertidumbre típica" },
    short: {
      fr: "Écart-type attaché à un résultat de mesure : la demi-largeur typique de sa zone de doute.",
      en: "Standard deviation attached to a measurement result: the typical half-width of its doubt zone.",
      es: "Desviación típica asociada a un resultado de medida: la semianchura típica de su zona de duda.",
    },
    lessonId: "math-fmv-c05",
  },
  {
    id: "propagation-des-incertitudes",
    label: { fr: "propagation des incertitudes", en: "propagation of uncertainty", es: "propagación de incertidumbres" },
    short: {
      fr: "Calcul de l'incertitude d'une grandeur déduite : les contributions de chaque mesure, pondérées par les dérivées partielles, s'ajoutent en quadrature.",
      en: "Computing the uncertainty of a derived quantity: each measurement's contribution, weighted by partial derivatives, adds in quadrature.",
      es: "Cálculo de la incertidumbre de una magnitud deducida: las contribuciones de cada medida, ponderadas por las derivadas parciales, se suman en cuadratura.",
    },
    lessonId: "math-fmv-c05",
  },

  // ── c06 · Points critiques et extrema ────────────────────────────────────
  {
    id: "point-critique",
    label: { fr: "point critique", en: "critical point", es: "punto crítico" },
    short: {
      fr: "Point où le gradient s'annule : le terrain y est localement plat — candidat minimum, maximum ou col.",
      en: "Point where the gradient vanishes: the terrain is locally flat there — candidate minimum, maximum or saddle.",
      es: "Punto donde el gradiente se anula: el terreno es localmente plano — candidato a mínimo, máximo o silla.",
    },
    lessonId: "math-fmv-c06",
  },
  {
    id: "point-selle",
    label: { fr: "point selle (col)", en: "saddle point", es: "punto de silla (collado)" },
    short: {
      fr: "Point critique qui monte dans une direction et descend dans une autre — le col entre deux vallées ; en chimie, l'état de transition.",
      en: "Critical point rising in one direction and falling in another — the mountain pass between two valleys; in chemistry, the transition state.",
      es: "Punto crítico que sube en una dirección y baja en otra — el collado entre dos valles; en química, el estado de transición.",
    },
    lessonId: "math-fmv-c06",
  },
  {
    id: "extremum-local",
    label: { fr: "extremum local", en: "local extremum", es: "extremo local" },
    short: {
      fr: "Minimum ou maximum par rapport à un voisinage : le fond d'une cuvette ou le sommet d'une bosse.",
      en: "Minimum or maximum relative to a neighbourhood: the bottom of a basin or the top of a bump.",
      es: "Mínimo o máximo respecto a un entorno: el fondo de una cubeta o la cima de una loma.",
    },
    lessonId: "math-fmv-c06",
  },
  {
    id: "hessienne",
    label: { fr: "matrice hessienne", en: "Hessian matrix", es: "matriz hessiana" },
    short: {
      fr: "Matrice des dérivées secondes : elle mesure la courbure et classe les points critiques (min, max, col).",
      en: "Matrix of second derivatives: it measures curvature and classifies critical points (min, max, saddle).",
      es: "Matriz de las derivadas segundas: mide la curvatura y clasifica los puntos críticos (mín, máx, silla).",
    },
    lessonId: "math-fmv-c06",
  },

  // ── c07 · Systèmes différentiels et portraits de phase ───────────────────
  {
    id: "systeme-differentiel",
    label: { fr: "système différentiel", en: "system of ODEs", es: "sistema diferencial" },
    short: {
      fr: "Plusieurs équations différentielles couplées : la vitesse de chaque variable dépend de toutes les autres.",
      en: "Several coupled differential equations: each variable's rate depends on all the others.",
      es: "Varias ecuaciones diferenciales acopladas: la velocidad de cada variable depende de todas las demás.",
    },
    lessonId: "math-fmv-c07",
  },
  {
    id: "portrait-de-phase",
    label: { fr: "portrait de phase", en: "phase portrait", es: "retrato de fase" },
    short: {
      fr: "Carte de toutes les trajectoires possibles d'un système dans le plan de ses variables — son avenir d'un seul regard.",
      en: "Map of all possible trajectories of a system in the plane of its variables — its future at a glance.",
      es: "Mapa de todas las trayectorias posibles de un sistema en el plano de sus variables — su futuro de un vistazo.",
    },
    lessonId: "math-fmv-c07",
  },
  {
    id: "trajectoire",
    label: { fr: "trajectoire", en: "trajectory", es: "trayectoria" },
    short: {
      fr: "Chemin suivi par l'état du système au cours du temps dans le plan de phase.",
      en: "Path followed by the system's state over time in the phase plane.",
      es: "Camino seguido por el estado del sistema a lo largo del tiempo en el plano de fase.",
    },
    lessonId: "math-fmv-c07",
  },
  {
    id: "point-d-equilibre",
    label: { fr: "point d'équilibre", en: "equilibrium point", es: "punto de equilibrio" },
    short: {
      fr: "État où toutes les vitesses s'annulent : le système, posé là, n'en bouge plus.",
      en: "State where all rates vanish: placed there, the system no longer moves.",
      es: "Estado donde todas las velocidades se anulan: colocado allí, el sistema ya no se mueve.",
    },
    lessonId: "math-fmv-c07",
  },
  {
    id: "isocline",
    label: { fr: "isocline (nullcline)", en: "nullcline", es: "isoclina (nulclina)" },
    short: {
      fr: "Courbe où l'une des vitesses s'annule : le flux la traverse verticalement ou horizontalement.",
      en: "Curve where one of the rates vanishes: the flow crosses it vertically or horizontally.",
      es: "Curva donde una de las velocidades se anula: el flujo la cruza vertical u horizontalmente.",
    },
    lessonId: "math-fmv-c07",
  },

  // ── c08 · Systèmes conservatifs et hamiltoniens ──────────────────────────
  {
    id: "systeme-conservatif",
    label: { fr: "système conservatif", en: "conservative system", es: "sistema conservativo" },
    short: {
      fr: "Système dont une quantité (l'énergie) reste constante le long de chaque trajectoire.",
      en: "System in which one quantity (the energy) stays constant along every trajectory.",
      es: "Sistema en el que una cantidad (la energía) permanece constante a lo largo de cada trayectoria.",
    },
    lessonId: "math-fmv-c08",
  },
  {
    id: "hamiltonien",
    label: { fr: "hamiltonien", en: "Hamiltonian", es: "hamiltoniano" },
    short: {
      fr: "Fonction énergie H dont les lignes de niveau SONT les trajectoires du système conservatif.",
      en: "Energy function H whose level curves ARE the trajectories of the conservative system.",
      es: "Función energía H cuyas líneas de nivel SON las trayectorias del sistema conservativo.",
    },
    lessonId: "math-fmv-c08",
  },
  {
    id: "separatrice",
    label: { fr: "séparatrice", en: "separatrix", es: "separatriz" },
    short: {
      fr: "Trajectoire frontière passant par un col : elle sépare les comportements qualitativement différents (osciller ou s'échapper).",
      en: "Boundary trajectory through a saddle: it separates qualitatively different behaviours (oscillate or escape).",
      es: "Trayectoria frontera que pasa por una silla: separa comportamientos cualitativamente distintos (oscilar o escapar).",
    },
    lessonId: "math-fmv-c08",
  },

  // ── c09 · Systèmes linéaires et similitude ───────────────────────────────
  {
    id: "valeur-propre",
    label: { fr: "valeur propre", en: "eigenvalue", es: "valor propio" },
    short: {
      fr: "Facteur λ par lequel la matrice étire son vecteur propre : le signe de sa partie réelle décide croissance ou décroissance.",
      en: "Factor λ by which the matrix stretches its eigenvector: the sign of its real part decides growth or decay.",
      es: "Factor λ por el que la matriz estira su vector propio: el signo de su parte real decide crecimiento o decaimiento.",
    },
    lessonId: "math-fmv-c09",
  },
  {
    id: "vecteur-propre",
    label: { fr: "vecteur propre", en: "eigenvector", es: "vector propio" },
    short: {
      fr: "Direction que la matrice ne fait qu'étirer sans la tourner — les axes naturels du système.",
      en: "Direction the matrix only stretches without rotating — the system's natural axes.",
      es: "Dirección que la matriz solo estira sin girarla — los ejes naturales del sistema.",
    },
    lessonId: "math-fmv-c09",
  },
  {
    id: "plan-trace-determinant",
    label: { fr: "plan trace–déterminant", en: "trace–determinant plane", es: "plano traza–determinante" },
    short: {
      fr: "Carte (tr A, det A) qui classe d'un coup d'œil tous les portraits de phase linéaires : nœud, selle, foyer, centre.",
      en: "The (tr A, det A) map classifying every linear phase portrait at a glance: node, saddle, focus, centre.",
      es: "Mapa (tr A, det A) que clasifica de un vistazo todos los retratos de fase lineales: nodo, silla, foco, centro.",
    },
    lessonId: "math-fmv-c09",
  },

  // ── c10 · Oscillateur harmonique et modes normaux ────────────────────────
  {
    id: "oscillateur-harmonique",
    label: { fr: "oscillateur harmonique", en: "harmonic oscillator", es: "oscilador armónico" },
    short: {
      fr: "Système rappelé vers l'équilibre par une force proportionnelle à l'écart — le modèle de toute vibration de liaison.",
      en: "System pulled back to equilibrium by a force proportional to the displacement — the model of every bond vibration.",
      es: "Sistema devuelto al equilibrio por una fuerza proporcional a la desviación — el modelo de toda vibración de enlace.",
    },
    lessonId: "math-fmv-c10",
  },
  {
    id: "pulsation-propre",
    label: { fr: "pulsation propre", en: "natural angular frequency", es: "pulsación propia" },
    short: {
      fr: "Rythme d'oscillation naturel du système, fixé par la raideur et la masse — en spectroscopie, la position de la bande.",
      en: "The system's natural oscillation rate, set by stiffness and mass — in spectroscopy, the band position.",
      es: "Ritmo natural de oscilación del sistema, fijado por la rigidez y la masa — en espectroscopía, la posición de la banda.",
    },
    lessonId: "math-fmv-c10",
  },
  {
    id: "amortissement",
    label: { fr: "amortissement", en: "damping", es: "amortiguamiento" },
    short: {
      fr: "Perte d'énergie qui fait décroître les oscillations ; selon sa force, le retour à l'équilibre oscille ou non.",
      en: "Energy loss making oscillations decay; depending on its strength, the return to equilibrium oscillates or not.",
      es: "Pérdida de energía que hace decrecer las oscilaciones; según su fuerza, el retorno al equilibrio oscila o no.",
    },
    lessonId: "math-fmv-c10",
  },
  {
    id: "mode-normal",
    label: { fr: "mode normal", en: "normal mode", es: "modo normal" },
    short: {
      fr: "Mouvement collectif où tout oscille à une même fréquence — les vibrations symétrique et antisymétrique d'une molécule.",
      en: "Collective motion where everything oscillates at one same frequency — a molecule's symmetric and antisymmetric vibrations.",
      es: "Movimiento colectivo donde todo oscila a una misma frecuencia — las vibraciones simétrica y antisimétrica de una molécula.",
    },
    lessonId: "math-fmv-c10",
  },
];
