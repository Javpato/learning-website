// Content metadata for the physics track "Électromagnétisme et interactions"
// (official Paris-Saclay L2 Chimie UEs: statique S3 + dynamique S4, 2.5 ECTS
// each). The track is split into four theme modules surfaced as cards on the
// legacy physics hub — not a separate top-level subject.
// Prose lives in the content.fr.mdx files; this file is metadata only.

import type { ExamMetaData, L10nString, LessonMetaData, TdMetaData } from "./types";

export type PhysicsTheme = {
  slug: string;
  title: L10nString;
  glyph: string;
  description: L10nString; // card text
};

export const PHYS_THEMES: PhysicsTheme[] = [
  {
    slug: "electrostatique",
    title: { fr: "Électrostatique", en: "Electrostatics", es: "Electrostática" },
    glyph: "⚡",
    description: {
      fr: "Pourquoi l'eau dissout-elle le sel ? Loi de Coulomb, théorème de Gauss, potentiel et dipôle électrique donnent la réponse.",
      en: "Why does water dissolve salt? Coulomb's law, Gauss's theorem, potential, and the electric dipole provide the answer.",
      es: "¿Por qué el agua disuelve la sal? La ley de Coulomb, el teorema de Gauss, el potencial y el dipolo eléctrico dan la respuesta.",
    },
  },
  {
    slug: "magnetostatique",
    title: { fr: "Magnétostatique", en: "Magnetostatics", es: "Magnetostática" },
    glyph: "🧲",
    description: {
      fr: "Le magnétisme qui prépare la RMN. Biot–Savart, théorème d'Ampère, potentiel vecteur et dipôle magnétique décrivent les champs des courants.",
      en: "The magnetism that prepares you for NMR. Biot–Savart, Ampère's theorem, the vector potential, and the magnetic dipole describe the fields created by currents.",
      es: "El magnetismo que te prepara para la RMN. Biot–Savart, el teorema de Ampère, el potencial vector y el dipolo magnético describen los campos creados por corrientes.",
    },
  },
  {
    slug: "multipoles-interactions",
    title: {
      fr: "Multipôles & interactions moléculaires",
      en: "Multipoles & molecular interactions",
      es: "Multipolos e interacciones moleculares",
    },
    glyph: "💧",
    description: {
      fr: "D'où vient la liaison hydrogène ? Développement multipolaire, énergies d'interaction, dipôles induits et polarisabilité relient physique et chimie.",
      en: "Where does the hydrogen bond come from? The multipole expansion, interaction energies, induced dipoles, and polarizability connect physics and chemistry.",
      es: "¿De dónde viene el enlace de hidrógeno? El desarrollo multipolar, las energías de interacción, los dipolos inducidos y la polarizabilidad conectan la física y la química.",
    },
  },
  {
    slug: "particules-chargees",
    title: { fr: "Particules chargées", en: "Charged particles", es: "Partículas cargadas" },
    glyph: "🌀",
    description: {
      fr: "Comment marche un spectromètre de masse ? Force de Lorentz et mouvement cyclotron l'expliquent, avec un pont optionnel vers l'induction et Maxwell.",
      en: "How does a mass spectrometer work? The Lorentz force and cyclotron motion explain it, with an optional bridge to induction and Maxwell.",
      es: "¿Cómo funciona un espectrómetro de masas? La fuerza de Lorentz y el movimiento ciclotrón lo explican, con un puente opcional hacia la inducción y Maxwell.",
    },
  },
];

export const PHYS_LESSONS: LessonMetaData[] = [
  // --- Électrostatique -----------------------------------------------------
  {
    id: "phys-em-c00",
    slug: "00-outils-mathematiques",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "Boîte à outils mathématique pour les champs",
      en: "Mathematical toolbox for fields",
      es: "Caja de herramientas matemáticas para los campos",
    },
    provenance: "officiel",
    difficulty: 2,
    timeMinutes: 60,
    objectives: [
      {
        fr: "Manipuler produit scalaire et produit vectoriel",
        en: "Work with dot products and cross products",
        es: "Manejar el producto escalar y el producto vectorial",
      },
      {
        fr: "Distinguer champs scalaires (V) et champs vectoriels (E, B, A)",
        en: "Distinguish scalar fields (V) from vector fields (E, B, A)",
        es: "Distinguir los campos escalares (V) de los campos vectoriales (E, B, A)",
      },
      {
        fr: "Écrire gradient, divergence et rotationnel en cartésiennes",
        en: "Write the gradient, divergence, and curl in Cartesian coordinates",
        es: "Escribir el gradiente, la divergencia y el rotacional en coordenadas cartesianas",
      },
      {
        fr: "Appliquer le protocole de symétrie avant tout calcul intégral",
        en: "Apply the symmetry protocol before any integral calculation",
        es: "Aplicar el protocolo de simetría antes de cualquier cálculo integral",
      },
    ],
    relatedExercises: [],
  },
  {
    id: "phys-em-c01",
    slug: "01-coulomb-superposition",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "Distributions de charges, loi de Coulomb et superposition",
      en: "Charge distributions, Coulomb's law, and superposition",
      es: "Distribuciones de carga, ley de Coulomb y superposición",
    },
    provenance: "officiel",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Écrire le champ d'un ensemble de charges ponctuelles par superposition",
        en: "Write the field of a set of point charges using superposition",
        es: "Escribir el campo de un conjunto de cargas puntuales mediante superposición",
      },
      {
        fr: "Passer aux distributions continues : dq = λ dℓ, σ dS, ρ dV",
        en: "Move to continuous distributions: dq = λ dℓ, σ dS, ρ dV",
        es: "Pasar a distribuciones continuas: dq = λ dℓ, σ dS, ρ dV",
      },
      {
        fr: "Suivre la stratégie de superposition en 7 étapes (source, observation, symétrie…)",
        en: "Follow the 7-step superposition strategy (source, observation, symmetry…)",
        es: "Seguir la estrategia de superposición en 7 pasos (fuente, observación, simetría…)",
      },
      {
        fr: "Dériver le champ axial d'un anneau chargé et vérifier ses limites",
        en: "Derive the axial field of a charged ring and check its limits",
        es: "Obtener el campo axial de un anillo cargado y comprobar sus límites",
      },
      {
        fr: "Relier charges partielles atomiques et champ moléculaire lointain",
        en: "Connect atomic partial charges to the far molecular field",
        es: "Relacionar las cargas parciales atómicas con el campo molecular lejano",
      },
    ],
    prerequisites: ["phys-em-c00"],
    relatedExercises: ["phys-em-td1-01", "phys-em-td1-02", "phys-em-td1-03", "phys-em-td1-04"],
  },
  {
    id: "phys-em-c02",
    slug: "02-theoreme-de-gauss",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "Théorème de Gauss et symétrie électrostatique",
      en: "Gauss's theorem and electrostatic symmetry",
      es: "Teorema de Gauss y simetría electrostática",
    },
    provenance: "officiel",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Définir le flux électrique et énoncer le théorème de Gauss",
        en: "Define electric flux and state Gauss's theorem",
        es: "Definir el flujo eléctrico y enunciar el teorema de Gauss",
      },
      {
        fr: "Comprendre quand Gauss calcule vraiment E (symétrie suffisante)",
        en: "Understand when Gauss's theorem truly calculates E (sufficient symmetry)",
        es: "Comprender cuándo el teorema de Gauss permite calcular realmente E (simetría suficiente)",
      },
      {
        fr: "Retrouver les trois géométries canoniques : sphère, fil infini, plan infini",
        en: "Derive the three canonical geometries: sphere, infinite wire, and infinite plane",
        es: "Obtener las tres geometrías canónicas: esfera, hilo infinito y plano infinito",
      },
      {
        fr: "Éviter les pièges : charge intérieure vs totale, oubli des faces",
        en: "Avoid the traps: enclosed vs total charge and omitted faces",
        es: "Evitar las trampas: carga encerrada frente a carga total y olvido de caras",
      },
    ],
    prerequisites: ["phys-em-c01"],
    relatedExercises: ["phys-em-td2-01", "phys-em-td2-02", "phys-em-td2-03"],
  },
  {
    id: "phys-em-c03",
    slug: "03-potentiel-energie",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "Potentiel électrostatique et énergie",
      en: "Electrostatic potential and energy",
      es: "Potencial electrostático y energía",
    },
    provenance: "officiel",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Relier champ et potentiel : V(B) − V(A) = −∫ E·dℓ et E = −∇V",
        en: "Connect field and potential: V(B) − V(A) = −∫ E·dℓ and E = −∇V",
        es: "Relacionar campo y potencial: V(B) − V(A) = −∫ E·dℓ y E = −∇V",
      },
      {
        fr: "Calculer V pour des distributions discrètes et continues",
        en: "Calculate V for discrete and continuous distributions",
        es: "Calcular V para distribuciones discretas y continuas",
      },
      {
        fr: "Utiliser U = qV et l'énergie d'assemblage d'un système de charges",
        en: "Use U = qV and the assembly energy of a system of charges",
        es: "Utilizar U = qV y la energía de ensamblaje de un sistema de cargas",
      },
      {
        fr: "Lire équipotentielles et lignes de champ (orthogonalité)",
        en: "Read equipotentials and field lines (orthogonality)",
        es: "Leer las equipotenciales y las líneas de campo (ortogonalidad)",
      },
      {
        fr: "Interpréter les cartes de potentiel électrostatique moléculaire avec prudence",
        en: "Interpret molecular electrostatic potential maps with care",
        es: "Interpretar con prudencia los mapas de potencial electrostático molecular",
      },
    ],
    prerequisites: ["phys-em-c02"],
    relatedExercises: ["phys-em-td2-02", "phys-em-td2-04"],
  },
  {
    id: "phys-em-c04",
    slug: "04-dipole-electrique",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "Le dipôle électrique",
      en: "The electric dipole",
      es: "El dipolo eléctrico",
    },
    provenance: "officiel",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Définir p = qd et le moment dipolaire d'une distribution neutre",
        en: "Define p = qd and the dipole moment of a neutral distribution",
        es: "Definir p = qd y el momento dipolar de una distribución neutra",
      },
      {
        fr: "Établir potentiel et champ lointains du dipôle (décroissance en 1/r², 1/r³)",
        en: "Derive the dipole's far-field potential and field (decay as 1/r², 1/r³)",
        es: "Obtener el potencial y el campo lejanos del dipolo (decaimiento en 1/r², 1/r³)",
      },
      {
        fr: "Calculer couple τ = p × E et énergie U = −p·E dans un champ extérieur",
        en: "Calculate torque τ = p × E and energy U = −p·E in an external field",
        es: "Calcular el par τ = p × E y la energía U = −p·E en un campo exterior",
      },
      {
        fr: "Relier géométrie moléculaire et polarité (l'eau, annulations par symétrie)",
        en: "Connect molecular geometry to polarity (water, cancellations by symmetry)",
        es: "Relacionar la geometría molecular con la polaridad (el agua, cancelaciones por simetría)",
      },
    ],
    prerequisites: ["phys-em-c03"],
    relatedExercises: ["phys-em-td3-01", "phys-em-td3-02", "phys-em-td3-03", "phys-em-td3-04"],
  },
  // --- Magnétostatique -----------------------------------------------------
  {
    id: "phys-em-c05",
    slug: "01-biot-savart",
    moduleSlug: "magnetostatique",
    subject: "physics",
    title: {
      fr: "Distributions de courant et loi de Biot–Savart",
      en: "Current distributions and the Biot–Savart law",
      es: "Distribuciones de corriente y ley de Biot–Savart",
    },
    provenance: "officiel",
    difficulty: 4,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Écrire dB = (μ₀/4π) I dℓ' × R̂ / R²",
        en: "Write dB = (μ₀/4π) I dℓ' × R̂ / R²",
        es: "Escribir dB = (μ₀/4π) I dℓ' × R̂ / R²",
      },
      {
        fr: "Retrouver le fil infini, le centre et l'axe d'une spire",
        en: "Derive the infinite wire and the center and axis of a current loop",
        es: "Obtener el hilo infinito y el centro y el eje de una espira",
      },
      {
        fr: "Traiter la symétrie des courants (le courant est orienté !)",
        en: "Handle the symmetry of currents (current has a direction!)",
        es: "Tratar la simetría de las corrientes (¡la corriente tiene orientación!)",
      },
      {
        fr: "Décider quand intégrer Biot–Savart plutôt qu'utiliser Ampère",
        en: "Decide when to integrate Biot–Savart rather than use Ampère's theorem",
        es: "Decidir cuándo integrar Biot–Savart en lugar de utilizar el teorema de Ampère",
      },
    ],
    prerequisites: ["phys-em-c00"],
    relatedExercises: ["phys-em-td4-01", "phys-em-td4-02"],
  },
  {
    id: "phys-em-c06",
    slug: "02-theoreme-d-ampere",
    moduleSlug: "magnetostatique",
    subject: "physics",
    title: {
      fr: "Théorème d'Ampère",
      en: "Ampère's theorem",
      es: "Teorema de Ampère",
    },
    provenance: "officiel",
    difficulty: 3,
    timeMinutes: 60,
    objectives: [
      {
        fr: "Énoncer ∮ B·dℓ = μ₀ I_enc et ses conditions d'usage",
        en: "State ∮ B·dℓ = μ₀ I_enc and its conditions of use",
        es: "Enunciar ∮ B·dℓ = μ₀ I_enc y sus condiciones de uso",
      },
      {
        fr: "Retrouver fil infini, solénoïde long et tore",
        en: "Derive the infinite wire, long solenoid, and toroid",
        es: "Obtener el hilo infinito, el solenoide largo y el toroide",
      },
      {
        fr: "Choisir entre Biot–Savart et Ampère selon la symétrie",
        en: "Choose between Biot–Savart and Ampère's theorem according to the symmetry",
        es: "Elegir entre Biot–Savart y el teorema de Ampère según la simetría",
      },
    ],
    prerequisites: ["phys-em-c05"],
    relatedExercises: ["phys-em-td4-03"],
  },
  {
    id: "phys-em-c07",
    slug: "03-potentiel-vecteur-dipole-magnetique",
    moduleSlug: "magnetostatique",
    subject: "physics",
    title: {
      fr: "Potentiel vecteur et dipôle magnétique",
      en: "Vector potential and magnetic dipole",
      es: "Potencial vector y dipolo magnético",
    },
    provenance: "officiel",
    difficulty: 4,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Justifier B = ∇ × A à partir de ∇·B = 0 et la liberté de jauge",
        en: "Justify B = ∇ × A from ∇·B = 0 and gauge freedom",
        es: "Justificar B = ∇ × A a partir de ∇·B = 0 y la libertad de gauge",
      },
      {
        fr: "Définir le moment magnétique m = IS n d'une boucle plane",
        en: "Define the magnetic moment m = IS n of a planar loop",
        es: "Definir el momento magnético m = IS n de una espira plana",
      },
      {
        fr: "Écrire couple, énergie et champ lointain du dipôle magnétique",
        en: "Write the torque, energy, and far field of the magnetic dipole",
        es: "Escribir el par, la energía y el campo lejano del dipolo magnético",
      },
      {
        fr: "Construire l'analogie électrique/magnétique et repérer où elle casse",
        en: "Build the electric/magnetic analogy and identify where it breaks down",
        es: "Construir la analogía eléctrica/magnética e identificar dónde deja de funcionar",
      },
    ],
    prerequisites: ["phys-em-c06"],
    relatedExercises: ["phys-em-td4-02", "phys-em-td4-04"],
  },
  // --- Multipôles & interactions moléculaires ------------------------------
  {
    id: "phys-em-c08",
    slug: "01-developpement-multipolaire",
    moduleSlug: "multipoles-interactions",
    subject: "physics",
    title: {
      fr: "Développement multipolaire électrique",
      en: "Electric multipole expansion",
      es: "Desarrollo multipolar eléctrico",
    },
    provenance: "reconstruction",
    difficulty: 4,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Développer 1/|r − r'| pour r ≫ a et identifier monopôle, dipôle, quadrupôle",
        en: "Expand 1/|r − r'| for r ≫ a and identify the monopole, dipole, and quadrupole",
        es: "Desarrollar 1/|r − r'| para r ≫ a e identificar el monopolo, el dipolo y el cuadrupolo",
      },
      {
        fr: "Calculer Q, p et Q_ij pour une distribution donnée",
        en: "Calculate Q, p, and Q_ij for a given distribution",
        es: "Calcular Q, p y Q_ij para una distribución dada",
      },
      {
        fr: "Maîtriser la dépendance à l'origine des moments",
        en: "Master the dependence of the moments on the choice of origin",
        es: "Dominar la dependencia de los momentos respecto del origen",
      },
      {
        fr: "Déduire les moments nuls d'une symétrie (inversion, symétrie sphérique)",
        en: "Infer vanishing moments from a symmetry (inversion, spherical symmetry)",
        es: "Deducir los momentos nulos a partir de una simetría (inversión, simetría esférica)",
      },
      {
        fr: "Classer les molécules : ion monopolaire, molécule polaire dipolaire, molécule quadrupolaire",
        en: "Classify molecules: monopolar ion, polar dipolar molecule, quadrupolar molecule",
        es: "Clasificar las moléculas: ion monopolar, molécula polar dipolar, molécula cuadrupolar",
      },
    ],
    prerequisites: ["phys-em-c04"],
    relatedExercises: ["phys-em-td5-01", "phys-em-td5-02", "phys-em-td5-03", "phys-em-td5-04"],
  },
  {
    id: "phys-em-c09",
    slug: "02-energies-interaction-forces-moleculaires",
    moduleSlug: "multipoles-interactions",
    subject: "physics",
    title: {
      fr: "Énergies d'interaction multipolaires et forces moléculaires",
      en: "Multipole interaction energies and molecular forces",
      es: "Energías de interacción multipolar y fuerzas moleculares",
    },
    provenance: "reconstruction",
    difficulty: 4,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Écrire les énergies charge–dipôle et dipôle–dipôle",
        en: "Write the charge–dipole and dipole–dipole energies",
        es: "Escribir las energías carga–dipolo y dipolo–dipolo",
      },
      {
        fr: "Retenir les lois d'échelle : r⁻¹, r⁻², r⁻³",
        en: "Remember the scaling laws: r⁻¹, r⁻², r⁻³",
        es: "Recordar las leyes de escala: r⁻¹, r⁻², r⁻³",
      },
      {
        fr: "Calculer force et couple pour orientation fixée",
        en: "Calculate force and torque for a fixed orientation",
        es: "Calcular la fuerza y el par para una orientación fija",
      },
      {
        fr: "Situer la frontière du modèle : le long-range classique n'est pas la chimie quantique",
        en: "Locate the model's boundary: classical long-range physics is not quantum chemistry",
        es: "Situar la frontera del modelo: la física clásica de largo alcance no es química cuántica",
      },
    ],
    prerequisites: ["phys-em-c08"],
    relatedExercises: ["phys-em-td6-01", "phys-em-td6-02"],
  },
  {
    id: "phys-em-c10",
    slug: "03-dipoles-induits-polarisabilite",
    moduleSlug: "multipoles-interactions",
    subject: "physics",
    title: {
      fr: "Dipôles induits et polarisabilité",
      en: "Induced dipoles and polarizability",
      es: "Dipolos inducidos y polarizabilidad",
    },
    provenance: "probable",
    difficulty: 4,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Écrire p_ind = αE (et le tenseur α pour l'anisotropie)",
        en: "Write p_ind = αE (and the tensor α for anisotropy)",
        es: "Escribir p_ind = αE (y el tensor α para la anisotropía)",
      },
      {
        fr: "Justifier le facteur ½ dans U_ind = −½αE²",
        en: "Justify the factor ½ in U_ind = −½αE²",
        es: "Justificar el factor ½ en U_ind = −½αE²",
      },
      {
        fr: "Retenir les échelles : charge–dipôle induit en r⁻⁴, dipôle–dipôle induit en r⁻⁶",
        en: "Remember the scaling laws: charge–induced dipole as r⁻⁴, induced dipole–induced dipole as r⁻⁶",
        es: "Recordar las escalas: carga–dipolo inducido en r⁻⁴, dipolo inducido–dipolo inducido en r⁻⁶",
      },
      {
        fr: "Distinguer induction classique et dispersion de London (origine quantique)",
        en: "Distinguish classical induction from London dispersion (quantum origin)",
        es: "Distinguir la inducción clásica de la dispersión de London (origen cuántico)",
      },
    ],
    prerequisites: ["phys-em-c09"],
    relatedExercises: ["phys-em-td6-03", "phys-em-td6-04"],
  },
  // --- Particules chargées -------------------------------------------------
  {
    id: "phys-em-c11",
    slug: "01-dynamique-particules-chargees",
    moduleSlug: "particules-chargees",
    subject: "physics",
    title: {
      fr: "Dynamique des particules chargées",
      en: "Dynamics of charged particles",
      es: "Dinámica de partículas cargadas",
    },
    provenance: "probable",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Appliquer la force de Lorentz F = q(E + v × B)",
        en: "Apply the Lorentz force F = q(E + v × B)",
        es: "Aplicar la fuerza de Lorentz F = q(E + v × B)",
      },
      {
        fr: "Établir rayon et fréquence cyclotron, mouvement hélicoïdal",
        en: "Derive the cyclotron radius and frequency and helical motion",
        es: "Obtener el radio y la frecuencia ciclotrón y el movimiento helicoidal",
      },
      {
        fr: "Montrer que la force magnétique ne travaille pas",
        en: "Show that the magnetic force does no work",
        es: "Demostrar que la fuerza magnética no realiza trabajo",
      },
      {
        fr: "Modéliser un sélecteur de vitesse et la spectrométrie de masse",
        en: "Model a velocity selector and mass spectrometry",
        es: "Modelizar un selector de velocidades y la espectrometría de masas",
      },
    ],
    prerequisites: ["phys-em-c05"],
    relatedExercises: ["phys-em-td7-01", "phys-em-td7-02", "phys-em-td7-03", "phys-em-td7-04"],
  },
  {
    id: "phys-em-c12",
    slug: "02-induction-pont-maxwell",
    moduleSlug: "particules-chargees",
    subject: "physics",
    title: {
      fr: "Induction et pont vers Maxwell (enrichissement)",
      en: "Induction and bridge to Maxwell (enrichment)",
      es: "Inducción y puente hacia Maxwell (ampliación)",
    },
    provenance: "extension",
    difficulty: 4,
    timeMinutes: 60,
    objectives: [
      {
        fr: "Énoncer la loi de Faraday ℰ = −dΦ_B/dt",
        en: "State Faraday's law ℰ = −dΦ_B/dt",
        es: "Enunciar la ley de Faraday ℰ = −dΦ_B/dt",
      },
      {
        fr: "Lire les quatre équations de Maxwell",
        en: "Read the four Maxwell equations",
        es: "Leer las cuatro ecuaciones de Maxwell",
      },
      {
        fr: "Voir émerger l'équation d'onde et c = (μ₀ε₀)^(−1/2)",
        en: "See the wave equation and c = (μ₀ε₀)^(−1/2) emerge",
        es: "Ver emerger la ecuación de ondas y c = (μ₀ε₀)^(−1/2)",
      },
      {
        fr: "Situer ce contenu : voisin du L2 Physique, non confirmé au cœur de L2 Chimie",
        en: "Place this content: close to L2 Physics, not confirmed as part of the L2 Chimie core",
        es: "Situar este contenido: próximo a L2 Física, no confirmado como parte del núcleo de L2 Chimie",
      },
    ],
    prerequisites: ["phys-em-c11"],
    relatedExercises: [],
  },
];

export const PHYS_TDS: TdMetaData[] = [
  {
    id: "phys-em-td1",
    slug: "td-1",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "TD P1 — Symétries et champs électriques",
      en: "TD P1 — Symmetries and electric fields",
      es: "TD P1 — Simetrías y campos eléctricos",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td1-01", tdId: "phys-em-td1", title: { fr: "Deux charges égales", en: "Two equal charges", es: "Dos cargas iguales" }, difficulty: 2, lessonIds: ["phys-em-c01"] },
      { id: "phys-em-td1-02", tdId: "phys-em-td1", title: { fr: "Demi-cercle chargé", en: "Charged semicircle", es: "Semicírculo cargado" }, difficulty: 4, lessonIds: ["phys-em-c01"] },
      { id: "phys-em-td1-03", tdId: "phys-em-td1", title: { fr: "Le piège du modèle", en: "The model trap", es: "La trampa del modelo" }, difficulty: 4, lessonIds: ["phys-em-c01", "phys-em-c03"] },
      { id: "phys-em-td1-04", tdId: "phys-em-td1", title: { fr: "Disque chargé", en: "Charged disk", es: "Disco cargado" }, difficulty: 5, lessonIds: ["phys-em-c01"] },
    ],
  },
  {
    id: "phys-em-td2",
    slug: "td-2",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "TD P2 — Gauss, potentiel et énergie",
      en: "TD P2 — Gauss, potential, and energy",
      es: "TD P2 — Gauss, potencial y energía",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td2-01", tdId: "phys-em-td2", title: { fr: "Sphère non uniforme", en: "Nonuniform sphere", es: "Esfera no uniforme" }, difficulty: 4, lessonIds: ["phys-em-c02"] },
      { id: "phys-em-td2-02", tdId: "phys-em-td2", title: { fr: "Potentiel de la sphère", en: "Potential of the sphere", es: "Potencial de la esfera" }, difficulty: 4, lessonIds: ["phys-em-c02", "phys-em-c03"] },
      { id: "phys-em-td2-03", tdId: "phys-em-td2", title: { fr: "Géométrie coaxiale", en: "Coaxial geometry", es: "Geometría coaxial" }, difficulty: 4, lessonIds: ["phys-em-c02", "phys-em-c03"] },
      { id: "phys-em-td2-04", tdId: "phys-em-td2", title: { fr: "Énergie d'un assemblage carré", en: "Energy of a square arrangement", es: "Energía de una configuración cuadrada" }, difficulty: 4, lessonIds: ["phys-em-c03"] },
    ],
  },
  {
    id: "phys-em-td3",
    slug: "td-3",
    moduleSlug: "electrostatique",
    subject: "physics",
    title: {
      fr: "TD P3 — Dipôles électriques et polarité moléculaire",
      en: "TD P3 — Electric dipoles and molecular polarity",
      es: "TD P3 — Dipolos eléctricos y polaridad molecular",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td3-01", tdId: "phys-em-td3", title: { fr: "Potentiel exact vs dipolaire", en: "Exact vs dipole potential", es: "Potencial exacto frente al dipolar" }, difficulty: 4, lessonIds: ["phys-em-c04"] },
      { id: "phys-em-td3-02", tdId: "phys-em-td3", title: { fr: "Modèle de l'eau à charges ponctuelles", en: "Point-charge model of water", es: "Modelo del agua con cargas puntuales" }, difficulty: 4, lessonIds: ["phys-em-c04"] },
      { id: "phys-em-td3-03", tdId: "phys-em-td3", title: { fr: "Oscillation de rotation", en: "Rotational oscillation", es: "Oscilación rotacional" }, difficulty: 4, lessonIds: ["phys-em-c04"] },
      { id: "phys-em-td3-04", tdId: "phys-em-td3", title: { fr: "Dipôle dans le champ d'une charge", en: "Dipole in the field of a charge", es: "Dipolo en el campo de una carga" }, difficulty: 5, lessonIds: ["phys-em-c04"] },
    ],
  },
  {
    id: "phys-em-td4",
    slug: "td-4",
    moduleSlug: "magnetostatique",
    subject: "physics",
    title: {
      fr: "TD P4 — Magnétostatique et dipôles magnétiques",
      en: "TD P4 — Magnetostatics and magnetic dipoles",
      es: "TD P4 — Magnetostática y dipolos magnéticos",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td4-01", tdId: "phys-em-td4", title: { fr: "Fil fini", en: "Finite wire", es: "Hilo finito" }, difficulty: 4, lessonIds: ["phys-em-c05"] },
      { id: "phys-em-td4-02", tdId: "phys-em-td4", title: { fr: "Axe de spire et champ lointain", en: "Current-loop axis and far field", es: "Eje de una espira y campo lejano" }, difficulty: 4, lessonIds: ["phys-em-c05", "phys-em-c07"] },
      { id: "phys-em-td4-03", tdId: "phys-em-td4", title: { fr: "Cylindre de courant non uniforme", en: "Nonuniform current cylinder", es: "Cilindro de corriente no uniforme" }, difficulty: 4, lessonIds: ["phys-em-c06"] },
      { id: "phys-em-td4-04", tdId: "phys-em-td4", title: { fr: "Force sur un dipôle magnétique", en: "Force on a magnetic dipole", es: "Fuerza sobre un dipolo magnético" }, difficulty: 4, lessonIds: ["phys-em-c07"] },
    ],
  },
  {
    id: "phys-em-td5",
    slug: "td-5",
    moduleSlug: "multipoles-interactions",
    subject: "physics",
    title: {
      fr: "TD P5 — Multipôles électriques",
      en: "TD P5 — Electric multipoles",
      es: "TD P5 — Multipolos eléctricos",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td5-01", tdId: "phys-em-td5", title: { fr: "Premier moment non nul", en: "First nonzero moment", es: "Primer momento no nulo" }, difficulty: 3, lessonIds: ["phys-em-c08"] },
      { id: "phys-em-td5-02", tdId: "phys-em-td5", title: { fr: "Quadrupôle linéaire", en: "Linear quadrupole", es: "Cuadrupolo lineal" }, difficulty: 4, lessonIds: ["phys-em-c08"] },
      { id: "phys-em-td5-03", tdId: "phys-em-td5", title: { fr: "Changement d'origine", en: "Change of origin", es: "Cambio de origen" }, difficulty: 4, lessonIds: ["phys-em-c08"] },
      { id: "phys-em-td5-04", tdId: "phys-em-td5", title: { fr: "Symétrie du tenseur", en: "Tensor symmetry", es: "Simetría del tensor" }, difficulty: 5, lessonIds: ["phys-em-c08"] },
    ],
  },
  {
    id: "phys-em-td6",
    slug: "td-6",
    moduleSlug: "multipoles-interactions",
    subject: "physics",
    title: {
      fr: "TD P6 — Forces d'interaction moléculaires",
      en: "TD P6 — Molecular interaction forces",
      es: "TD P6 — Fuerzas de interacción molecular",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td6-01", tdId: "phys-em-td6", title: { fr: "Orientations de deux dipôles", en: "Orientations of two dipoles", es: "Orientaciones de dos dipolos" }, difficulty: 4, lessonIds: ["phys-em-c09"] },
      { id: "phys-em-td6-02", tdId: "phys-em-td6", title: { fr: "Équilibre de rotation", en: "Rotational equilibrium", es: "Equilibrio rotacional" }, difficulty: 5, lessonIds: ["phys-em-c09"] },
      { id: "phys-em-td6-03", tdId: "phys-em-td6", title: { fr: "Dipôle induit par une charge", en: "Charge-induced dipole", es: "Dipolo inducido por una carga" }, difficulty: 4, lessonIds: ["phys-em-c10"] },
      { id: "phys-em-td6-04", tdId: "phys-em-td6", title: { fr: "Polarisabilité anisotrope", en: "Anisotropic polarizability", es: "Polarizabilidad anisótropa" }, difficulty: 5, lessonIds: ["phys-em-c10"] },
    ],
  },
  {
    id: "phys-em-td7",
    slug: "td-7",
    moduleSlug: "particules-chargees",
    subject: "physics",
    title: {
      fr: "TD P7 — Particules chargées et spectrométrie de masse",
      en: "TD P7 — Charged particles and mass spectrometry",
      es: "TD P7 — Partículas cargadas y espectrometría de masas",
    },
    provenance: "reconstruction",
    exercises: [
      { id: "phys-em-td7-01", tdId: "phys-em-td7", title: { fr: "Mouvement hélicoïdal", en: "Helical motion", es: "Movimiento helicoidal" }, difficulty: 4, lessonIds: ["phys-em-c11"] },
      { id: "phys-em-td7-02", tdId: "phys-em-td7", title: { fr: "Sélecteur de Bainbridge", en: "Bainbridge selector", es: "Selector de Bainbridge" }, difficulty: 4, lessonIds: ["phys-em-c11"] },
      { id: "phys-em-td7-03", tdId: "phys-em-td7", title: { fr: "Théorème de l'énergie cinétique", en: "Kinetic energy theorem", es: "Teorema de la energía cinética" }, difficulty: 3, lessonIds: ["phys-em-c11"] },
      { id: "phys-em-td7-04", tdId: "phys-em-td7", title: { fr: "Temps de vol", en: "Time of flight", es: "Tiempo de vuelo" }, difficulty: 4, lessonIds: ["phys-em-c11"] },
    ],
  },
];

export const PHYS_EXAMS: ExamMetaData[] = [
  {
    id: "phys-em-exam-cc",
    slug: "cc-electrostatique",
    moduleSlug: "examens",
    subject: "physics",
    kind: "cc",
    title: {
      fr: "CC Électromagnétisme statique — reconstruction",
      en: "CC (contrôle continu; continuous assessment) in static electromagnetism — reconstruction",
      es: "CC (contrôle continu; evaluación continua) de electromagnetismo estático — reconstrucción",
    },
    durationMinutes: 60,
    totalPoints: 20,
    topics: ["phys-em-c01", "phys-em-c02", "phys-em-c03", "phys-em-c06"],
    provenance: "reconstruction",
  },
  {
    id: "phys-em-exam-partiel",
    slug: "partiel-multipoles",
    moduleSlug: "examens",
    subject: "physics",
    kind: "partiel",
    title: {
      fr: "Partiel Dynamique / multipôles — reconstruction",
      en: "Partiel (midterm exam): Dynamics / multipoles — reconstruction",
      es: "Partiel (parcial): Dinámica / multipolos — reconstrucción",
    },
    durationMinutes: 90,
    totalPoints: 20,
    topics: ["phys-em-c08", "phys-em-c09", "phys-em-c10"],
    provenance: "reconstruction",
  },
  {
    id: "phys-em-exam-final",
    slug: "final",
    moduleSlug: "examens",
    subject: "physics",
    kind: "final",
    title: {
      fr: "Examen final complet — reconstruction",
      en: "Comprehensive final exam — reconstruction",
      es: "Examen final completo — reconstrucción",
    },
    durationMinutes: 120,
    totalPoints: 40,
    topics: [
      "phys-em-c02",
      "phys-em-c05",
      "phys-em-c07",
      "phys-em-c08",
      "phys-em-c10",
    ],
    provenance: "reconstruction",
  },
];
