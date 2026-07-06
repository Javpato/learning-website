// Single source of truth for the Python course structure — used by the hub
// (cs/python/page.tsx) and the per-unit footer (components/cs/UnitFooter). Each
// unit is tagged with a Pokémon sprite: chapters get first-stage evolutions,
// projects get final-stage evolutions, and the capstone gets legendaries. The
// sprite files are self-hosted animated GIFs in public/pokemon/ (no CDN — see
// platform/CLAUDE.md › Security). Keep the flat order in sync with the modules.
//
// The course is authored in Spanish, but the module/unit labels shown on the hub
// cards are localized: `title`/`desc` carry one string per locale (es/en/fr).
// Resolve them with `pick(l10n, locale)` (falls back to Spanish). The chapter
// *content* pages are still Spanish-only for every locale.

import type { Locale } from "@/lib/i18n/config";

/** A short string available in every locale (es is the authored source). */
export type L10n = Record<Locale, string>;

/** Resolve a localized string, falling back to the Spanish source. */
export function pick(l10n: L10n, locale: Locale): string {
  return l10n[locale] ?? l10n.es;
}

export type Unit = {
  slug: string;
  kind: "chapter" | "project";
  title: L10n;
  desc: L10n;
  /** Sprite basename in public/pokemon/ (without .gif). */
  pokemon: string;
};
export type Module = { title: L10n; units: Unit[] };

export const MODULES: Module[] = [
  {
    title: { es: "Módulo 0 · Preparación", en: "Module 0 · Setup", fr: "Module 0 · Préparation" },
    units: [
      {
        slug: "setup",
        kind: "chapter",
        pokemon: "pikachu",
        title: { es: "Setup para proyectos", en: "Project setup", fr: "Configuration pour tes projets" },
        desc: {
          es: "Instala Git, Python y VS Code, y aprende qué es GitHub — paso a paso para Linux y Windows.",
          en: "Install Git, Python and VS Code, and learn what GitHub is — step by step for Linux and Windows.",
          fr: "Installe Git, Python et VS Code, et découvre ce qu'est GitHub — pas à pas pour Linux et Windows.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 1 · Fundamentos", en: "Module 1 · Fundamentals", fr: "Module 1 · Fondamentaux" },
    units: [
      {
        slug: "01-fundamentos",
        kind: "chapter",
        pokemon: "bulbasaur",
        title: { es: "Fundamentos", en: "Fundamentals", fr: "Fondamentaux" },
        desc: {
          es: "print, variables, input, condicionales, bucles while y random.",
          en: "print, variables, input, conditionals, while loops and random.",
          fr: "print, variables, input, conditions, boucles while et random.",
        },
      },
      {
        slug: "project-1-adivina-el-numero",
        kind: "project",
        pokemon: "venusaur",
        title: { es: "Proyecto 1 · Adivina el número", en: "Project 1 · Guess the Number", fr: "Projet 1 · Devine le nombre" },
        desc: {
          es: "Tu primer juego en la terminal, subido a GitHub.",
          en: "Your first terminal game, pushed to GitHub.",
          fr: "Ton premier jeu en terminal, publié sur GitHub.",
        },
      },
      {
        slug: "02-listas-y-bucles",
        kind: "chapter",
        pokemon: "charmander",
        title: { es: "Listas y bucles", en: "Lists and Loops", fr: "Listes et boucles" },
        desc: {
          es: "Listas, indexación, slicing, for y range.",
          en: "Lists, indexing, slicing, for and range.",
          fr: "Listes, indexation, slicing, for et range.",
        },
      },
      {
        slug: "03-cadenas",
        kind: "chapter",
        pokemon: "squirtle",
        title: { es: "Cadenas de texto", en: "Strings", fr: "Chaînes de caractères" },
        desc: {
          es: "Métodos de texto, f-strings, split y join.",
          en: "String methods, f-strings, split and join.",
          fr: "Méthodes de texte, f-strings, split et join.",
        },
      },
      {
        slug: "04-funciones",
        kind: "chapter",
        pokemon: "caterpie",
        title: { es: "Funciones", en: "Functions", fr: "Fonctions" },
        desc: {
          es: "def, return, parámetros y alcance.",
          en: "def, return, parameters and scope.",
          fr: "def, return, paramètres et portée.",
        },
      },
      {
        slug: "project-2-piedra-papel-tijera",
        kind: "project",
        pokemon: "charizard",
        title: { es: "Proyecto 2 · Piedra, papel o tijera", en: "Project 2 · Rock, Paper, Scissors", fr: "Projet 2 · Pierre, papier, ciseaux" },
        desc: {
          es: "Un juego con funciones, random y marcador.",
          en: "A game with functions, random and a scoreboard.",
          fr: "Un jeu avec fonctions, random et un tableau des scores.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 2 · Estructuras de datos", en: "Module 2 · Data Structures", fr: "Module 2 · Structures de données" },
    units: [
      {
        slug: "05-diccionarios-y-conjuntos",
        kind: "chapter",
        pokemon: "weedle",
        title: { es: "Diccionarios y conjuntos", en: "Dictionaries and Sets", fr: "Dictionnaires et ensembles" },
        desc: {
          es: "dict, set, get y el patrón de conteo.",
          en: "dict, set, get and the counting pattern.",
          fr: "dict, set, get et le motif de comptage.",
        },
      },
      {
        slug: "06-comprensiones",
        kind: "chapter",
        pokemon: "pidgey",
        title: { es: "Comprensiones", en: "Comprehensions", fr: "Compréhensions" },
        desc: {
          es: "Crear listas, dicts y sets en una sola línea.",
          en: "Build lists, dicts and sets in a single line.",
          fr: "Créer des listes, dicts et sets en une seule ligne.",
        },
      },
      {
        slug: "07-tuplas-e-iteracion",
        kind: "chapter",
        pokemon: "rattata",
        title: { es: "Tuplas e iteración", en: "Tuples and Iteration", fr: "Tuples et itération" },
        desc: {
          es: "Tuplas, desempaquetado, enumerate y zip.",
          en: "Tuples, unpacking, enumerate and zip.",
          fr: "Tuples, dépaquetage, enumerate et zip.",
        },
      },
      {
        slug: "project-3-quiz",
        kind: "project",
        pokemon: "blastoise",
        title: { es: "Proyecto 3 · Quiz", en: "Project 3 · Quiz", fr: "Projet 3 · Quiz" },
        desc: {
          es: "Cuestionario con puntuación y porcentaje.",
          en: "A quiz with scoring and a percentage.",
          fr: "Un questionnaire avec score et pourcentage.",
        },
      },
      {
        slug: "project-4-lista-de-tareas",
        kind: "project",
        pokemon: "butterfree",
        title: { es: "Proyecto 4 · Lista de tareas", en: "Project 4 · To-Do List", fr: "Projet 4 · Liste de tâches" },
        desc: {
          es: "Una app de tareas con menú.",
          en: "A to-do app with a menu.",
          fr: "Une application de tâches avec menu.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 3 · Código robusto", en: "Module 3 · Robust Code", fr: "Module 3 · Code robuste" },
    units: [
      {
        slug: "08-errores-y-excepciones",
        kind: "chapter",
        pokemon: "spearow",
        title: { es: "Errores y excepciones", en: "Errors and Exceptions", fr: "Erreurs et exceptions" },
        desc: {
          es: "try/except, raise y validación de entradas.",
          en: "try/except, raise and input validation.",
          fr: "try/except, raise et validation des entrées.",
        },
      },
      {
        slug: "09-archivos-y-json",
        kind: "chapter",
        pokemon: "ekans",
        title: { es: "Archivos y JSON", en: "Files and JSON", fr: "Fichiers et JSON" },
        desc: {
          es: "Leer y escribir archivos; guardar datos en JSON.",
          en: "Read and write files; save data as JSON.",
          fr: "Lire et écrire des fichiers ; sauvegarder des données en JSON.",
        },
      },
      {
        slug: "10-modulos-y-biblioteca-estandar",
        kind: "chapter",
        pokemon: "sandshrew",
        title: { es: "Módulos y biblioteca estándar", en: "Modules and the Standard Library", fr: "Modules et bibliothèque standard" },
        desc: {
          es: "import, math, datetime, collections, itertools.",
          en: "import, math, datetime, collections, itertools.",
          fr: "import, math, datetime, collections, itertools.",
        },
      },
      {
        slug: "project-5-registro-de-gastos",
        kind: "project",
        pokemon: "beedrill",
        title: { es: "Proyecto 5 · Registro de gastos", en: "Project 5 · Expense Tracker", fr: "Projet 5 · Suivi des dépenses" },
        desc: {
          es: "Gastos por categoría, guardados en JSON.",
          en: "Expenses by category, saved as JSON.",
          fr: "Dépenses par catégorie, sauvegardées en JSON.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 4 · Orientación a objetos", en: "Module 4 · Object-Oriented Programming", fr: "Module 4 · Programmation orientée objet" },
    units: [
      {
        slug: "11-clases-y-objetos",
        kind: "chapter",
        pokemon: "vulpix",
        title: { es: "Clases y objetos", en: "Classes and Objects", fr: "Classes et objets" },
        desc: {
          es: "class, __init__, self y métodos.",
          en: "class, __init__, self and methods.",
          fr: "class, __init__, self et méthodes.",
        },
      },
      {
        slug: "12-herencia-y-metodos-especiales",
        kind: "chapter",
        pokemon: "zubat",
        title: { es: "Herencia y métodos especiales", en: "Inheritance and Special Methods", fr: "Héritage et méthodes spéciales" },
        desc: {
          es: "super(), polimorfismo y métodos dunder.",
          en: "super(), polymorphism and dunder methods.",
          fr: "super(), polymorphisme et méthodes dunder.",
        },
      },
      {
        slug: "13-diseno-con-clases",
        kind: "chapter",
        pokemon: "oddish",
        title: { es: "Diseño con clases", en: "Designing with Classes", fr: "Conception avec des classes" },
        desc: {
          es: "Composición, @property y dataclasses.",
          en: "Composition, @property and dataclasses.",
          fr: "Composition, @property et dataclasses.",
        },
      },
      {
        slug: "project-6-ahorcado",
        kind: "project",
        pokemon: "pidgeot",
        title: { es: "Proyecto 6 · El ahorcado", en: "Project 6 · Hangman", fr: "Projet 6 · Le pendu" },
        desc: {
          es: "Adivina la palabra con conjuntos y estado.",
          en: "Guess the word using sets and state.",
          fr: "Devine le mot avec des ensembles et de l'état.",
        },
      },
      {
        slug: "project-7-tres-en-raya",
        kind: "project",
        pokemon: "alakazam",
        title: { es: "Proyecto 7 · Tres en raya", en: "Project 7 · Tic-Tac-Toe", fr: "Projet 7 · Morpion" },
        desc: {
          es: "Tablero, turnos y condiciones de victoria.",
          en: "Board, turns and win conditions.",
          fr: "Plateau, tours et conditions de victoire.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 5 · Python avanzado", en: "Module 5 · Advanced Python", fr: "Module 5 · Python avancé" },
    units: [
      {
        slug: "14-iteradores-y-generadores",
        kind: "chapter",
        pokemon: "poliwag",
        title: { es: "Iteradores y generadores", en: "Iterators and Generators", fr: "Itérateurs et générateurs" },
        desc: {
          es: "yield, next y evaluación perezosa.",
          en: "yield, next and lazy evaluation.",
          fr: "yield, next et évaluation paresseuse.",
        },
      },
      {
        slug: "15-decoradores",
        kind: "chapter",
        pokemon: "abra",
        title: { es: "Decoradores", en: "Decorators", fr: "Décorateurs" },
        desc: {
          es: "Funciones que envuelven a otras funciones.",
          en: "Functions that wrap other functions.",
          fr: "Des fonctions qui enveloppent d'autres fonctions.",
        },
      },
      {
        slug: "16-context-managers-y-tipado",
        kind: "chapter",
        pokemon: "machop",
        title: { es: "Context managers y tipado", en: "Context Managers and Typing", fr: "Context managers et typage" },
        desc: {
          es: "with propio y anotaciones de tipo.",
          en: "Your own with, and type annotations.",
          fr: "Ton propre with et les annotations de type.",
        },
      },
      {
        slug: "17-pruebas",
        kind: "chapter",
        pokemon: "bellsprout",
        title: { es: "Pruebas", en: "Testing", fr: "Tests" },
        desc: {
          es: "assert y unittest para programar con confianza.",
          en: "assert and unittest to code with confidence.",
          fr: "assert et unittest pour coder en confiance.",
        },
      },
      {
        slug: "project-8-aventura-de-texto",
        kind: "project",
        pokemon: "machamp",
        title: { es: "Proyecto 8 · Aventura de texto", en: "Project 8 · Text Adventure", fr: "Projet 8 · Aventure textuelle" },
        desc: {
          es: "Un mundo explorable con clases y comandos.",
          en: "An explorable world with classes and commands.",
          fr: "Un monde explorable avec des classes et des commandes.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 6 · Mundo real", en: "Module 6 · Real World", fr: "Module 6 · Monde réel" },
    units: [
      {
        slug: "project-9-mini-base-de-datos",
        kind: "project",
        pokemon: "golem",
        title: { es: "Proyecto 9 · Mini base de datos", en: "Project 9 · Mini Database", fr: "Projet 9 · Mini base de données" },
        desc: {
          es: "CRUD desde cero con persistencia en JSON.",
          en: "CRUD from scratch with JSON persistence.",
          fr: "CRUD à partir de zéro avec persistance en JSON.",
        },
      },
    ],
  },
  {
    title: { es: "Módulo 7 · Videojuegos con Pygame", en: "Module 7 · Games with Pygame", fr: "Module 7 · Jeux vidéo avec Pygame" },
    units: [
      {
        slug: "pygame-1-ventana-y-bucle",
        kind: "chapter",
        pokemon: "gastly",
        title: { es: "Ventana y bucle de juego", en: "Window and Game Loop", fr: "Fenêtre et boucle de jeu" },
        desc: {
          es: "init, pantalla, el bucle de eventos y los FPS.",
          en: "init, the screen, the event loop and FPS.",
          fr: "init, l'écran, la boucle d'événements et les FPS.",
        },
      },
      {
        slug: "pygame-2-dibujar",
        kind: "chapter",
        pokemon: "dratini",
        title: { es: "Dibujar en pantalla", en: "Drawing on Screen", fr: "Dessiner à l'écran" },
        desc: {
          es: "Rectángulos, colores, coordenadas y superficies.",
          en: "Rectangles, colors, coordinates and surfaces.",
          fr: "Rectangles, couleurs, coordonnées et surfaces.",
        },
      },
      {
        slug: "pygame-3-movimiento",
        kind: "chapter",
        pokemon: "growlithe",
        title: { es: "Movimiento y teclado", en: "Movement and Keyboard", fr: "Mouvement et clavier" },
        desc: {
          es: "Velocidad, vectores y control con las flechas.",
          en: "Speed, vectors and arrow-key control.",
          fr: "Vitesse, vecteurs et contrôle aux flèches.",
        },
      },
      {
        slug: "pygame-4-colisiones",
        kind: "chapter",
        pokemon: "ponyta",
        title: { es: "Colisiones", en: "Collisions", fr: "Collisions" },
        desc: {
          es: "Rect, colliderect y la matemática del solapamiento.",
          en: "Rect, colliderect and the math of overlap.",
          fr: "Rect, colliderect et les maths du chevauchement.",
        },
      },
      {
        slug: "pygame-5-sprites-y-sonido",
        kind: "chapter",
        pokemon: "magikarp",
        title: { es: "Sprites, animación y sonido", en: "Sprites, Animation and Sound", fr: "Sprites, animation et son" },
        desc: {
          es: "Imágenes, fotogramas de animación y efectos.",
          en: "Images, animation frames and effects.",
          fr: "Images, images d'animation et effets.",
        },
      },
      {
        slug: "project-10-snake",
        kind: "project",
        pokemon: "gengar",
        title: { es: "Proyecto 10 · Snake (Pygame)", en: "Project 10 · Snake (Pygame)", fr: "Projet 10 · Snake (Pygame)" },
        desc: {
          es: "Tu primer juego con gráficos.",
          en: "Your first game with graphics.",
          fr: "Ton premier jeu avec des graphismes.",
        },
      },
    ],
  },
  {
    title: { es: "Proyecto final", en: "Final Project", fr: "Projet final" },
    units: [
      {
        slug: "18-prepara-tu-proyecto",
        kind: "chapter",
        pokemon: "geodude",
        title: { es: "Prepara tu proyecto", en: "Prepare Your Project", fr: "Prépare ton projet" },
        desc: {
          es: "Estructura, entorno y la física del movimiento.",
          en: "Structure, environment and the physics of movement.",
          fr: "Structure, environnement et la physique du mouvement.",
        },
      },
      {
        slug: "project-capstone-plataformas",
        kind: "project",
        pokemon: "mewtwo",
        title: { es: "Capstone · Plataformas", en: "Capstone · Platformer", fr: "Capstone · Plateformes" },
        desc: {
          es: "Tu propio mini-Mario: el proyecto final.",
          en: "Your own mini-Mario: the final project.",
          fr: "Ton propre mini-Mario : le projet final.",
        },
      },
    ],
  },
];

/** Legendaries shown on the capstone card / completion (the final boss). */
export const LEGENDARIES = ["articuno", "zapdos", "moltres", "mewtwo", "mew"];

/** Flat ordered list of every unit, for progress totals and next-unit links. */
export const UNITS: Unit[] = MODULES.flatMap((m) => m.units);

export function unitBySlug(slug: string): Unit | undefined {
  return UNITS.find((u) => u.slug === slug);
}

/** The unit that follows `slug` in course order (undefined if it's the last). */
export function nextUnit(slug: string): Unit | undefined {
  const i = UNITS.findIndex((u) => u.slug === slug);
  return i >= 0 && i < UNITS.length - 1 ? UNITS[i + 1] : undefined;
}

/** The unit before `slug` in course order (undefined if it's the first). */
export function prevUnit(slug: string): Unit | undefined {
  const i = UNITS.findIndex((u) => u.slug === slug);
  return i > 0 ? UNITS[i - 1] : undefined;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** URL of a self-hosted sprite (public/pokemon/<name>.gif). */
export function spriteUrl(pokemon: string): string {
  return `${BASE}/pokemon/${pokemon}.gif`;
}
