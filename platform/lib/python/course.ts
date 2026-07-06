// Single source of truth for the Python course structure — used by the hub
// (cs/python/page.tsx) and the per-unit footer (components/cs/UnitFooter). Each
// unit is tagged with a Pokémon sprite: chapters get first-stage evolutions,
// projects get final-stage evolutions, and the capstone gets legendaries. The
// sprite files are self-hosted animated GIFs in public/pokemon/ (no CDN — see
// platform/CLAUDE.md › Security). Keep the flat order in sync with the modules.

export type Unit = {
  slug: string;
  kind: "chapter" | "project";
  title: string;
  desc: string;
  /** Sprite basename in public/pokemon/ (without .gif). */
  pokemon: string;
};
export type Module = { title: string; units: Unit[] };

export const MODULES: Module[] = [
  {
    title: "Módulo 1 · Fundamentos",
    units: [
      { slug: "01-fundamentos", kind: "chapter", pokemon: "bulbasaur", title: "Fundamentos", desc: "print, variables, input, condicionales, bucles while y random." },
      { slug: "project-1-adivina-el-numero", kind: "project", pokemon: "venusaur", title: "Proyecto 1 · Adivina el número", desc: "Tu primer juego en la terminal, subido a GitHub." },
      { slug: "02-listas-y-bucles", kind: "chapter", pokemon: "charmander", title: "Listas y bucles", desc: "Listas, indexación, slicing, for y range." },
      { slug: "03-cadenas", kind: "chapter", pokemon: "squirtle", title: "Cadenas de texto", desc: "Métodos de texto, f-strings, split y join." },
      { slug: "04-funciones", kind: "chapter", pokemon: "caterpie", title: "Funciones", desc: "def, return, parámetros y alcance." },
      { slug: "project-2-piedra-papel-tijera", kind: "project", pokemon: "charizard", title: "Proyecto 2 · Piedra, papel o tijera", desc: "Un juego con funciones, random y marcador." },
    ],
  },
  {
    title: "Módulo 2 · Estructuras de datos",
    units: [
      { slug: "05-diccionarios-y-conjuntos", kind: "chapter", pokemon: "weedle", title: "Diccionarios y conjuntos", desc: "dict, set, get y el patrón de conteo." },
      { slug: "06-comprensiones", kind: "chapter", pokemon: "pidgey", title: "Comprensiones", desc: "Crear listas, dicts y sets en una sola línea." },
      { slug: "07-tuplas-e-iteracion", kind: "chapter", pokemon: "rattata", title: "Tuplas e iteración", desc: "Tuplas, desempaquetado, enumerate y zip." },
      { slug: "project-3-quiz", kind: "project", pokemon: "blastoise", title: "Proyecto 3 · Quiz", desc: "Cuestionario con puntuación y porcentaje." },
      { slug: "project-4-lista-de-tareas", kind: "project", pokemon: "butterfree", title: "Proyecto 4 · Lista de tareas", desc: "Una app de tareas con menú." },
    ],
  },
  {
    title: "Módulo 3 · Código robusto",
    units: [
      { slug: "08-errores-y-excepciones", kind: "chapter", pokemon: "spearow", title: "Errores y excepciones", desc: "try/except, raise y validación de entradas." },
      { slug: "09-archivos-y-json", kind: "chapter", pokemon: "ekans", title: "Archivos y JSON", desc: "Leer y escribir archivos; guardar datos en JSON." },
      { slug: "10-modulos-y-biblioteca-estandar", kind: "chapter", pokemon: "sandshrew", title: "Módulos y biblioteca estándar", desc: "import, math, datetime, collections, itertools." },
      { slug: "project-5-registro-de-gastos", kind: "project", pokemon: "beedrill", title: "Proyecto 5 · Registro de gastos", desc: "Gastos por categoría, guardados en JSON." },
    ],
  },
  {
    title: "Módulo 4 · Orientación a objetos",
    units: [
      { slug: "11-clases-y-objetos", kind: "chapter", pokemon: "vulpix", title: "Clases y objetos", desc: "class, __init__, self y métodos." },
      { slug: "12-herencia-y-metodos-especiales", kind: "chapter", pokemon: "zubat", title: "Herencia y métodos especiales", desc: "super(), polimorfismo y métodos dunder." },
      { slug: "13-diseno-con-clases", kind: "chapter", pokemon: "oddish", title: "Diseño con clases", desc: "Composición, @property y dataclasses." },
      { slug: "project-6-ahorcado", kind: "project", pokemon: "pidgeot", title: "Proyecto 6 · El ahorcado", desc: "Adivina la palabra con conjuntos y estado." },
      { slug: "project-7-tres-en-raya", kind: "project", pokemon: "alakazam", title: "Proyecto 7 · Tres en raya", desc: "Tablero, turnos y condiciones de victoria." },
    ],
  },
  {
    title: "Módulo 5 · Python avanzado",
    units: [
      { slug: "14-iteradores-y-generadores", kind: "chapter", pokemon: "poliwag", title: "Iteradores y generadores", desc: "yield, next y evaluación perezosa." },
      { slug: "15-decoradores", kind: "chapter", pokemon: "abra", title: "Decoradores", desc: "Funciones que envuelven a otras funciones." },
      { slug: "16-context-managers-y-tipado", kind: "chapter", pokemon: "machop", title: "Context managers y tipado", desc: "with propio y anotaciones de tipo." },
      { slug: "17-pruebas", kind: "chapter", pokemon: "bellsprout", title: "Pruebas", desc: "assert y unittest para programar con confianza." },
      { slug: "project-8-aventura-de-texto", kind: "project", pokemon: "machamp", title: "Proyecto 8 · Aventura de texto", desc: "Un mundo explorable con clases y comandos." },
    ],
  },
  {
    title: "Módulo 6 · Mundo real",
    units: [
      { slug: "project-9-mini-base-de-datos", kind: "project", pokemon: "golem", title: "Proyecto 9 · Mini base de datos", desc: "CRUD desde cero con persistencia en JSON." },
    ],
  },
  {
    title: "Módulo 7 · Videojuegos con Pygame",
    units: [
      { slug: "pygame-1-ventana-y-bucle", kind: "chapter", pokemon: "gastly", title: "Ventana y bucle de juego", desc: "init, pantalla, el bucle de eventos y los FPS." },
      { slug: "pygame-2-dibujar", kind: "chapter", pokemon: "dratini", title: "Dibujar en pantalla", desc: "Rectángulos, colores, coordenadas y superficies." },
      { slug: "pygame-3-movimiento", kind: "chapter", pokemon: "growlithe", title: "Movimiento y teclado", desc: "Velocidad, vectores y control con las flechas." },
      { slug: "pygame-4-colisiones", kind: "chapter", pokemon: "ponyta", title: "Colisiones", desc: "Rect, colliderect y la matemática del solapamiento." },
      { slug: "pygame-5-sprites-y-sonido", kind: "chapter", pokemon: "magikarp", title: "Sprites, animación y sonido", desc: "Imágenes, fotogramas de animación y efectos." },
      { slug: "project-10-snake", kind: "project", pokemon: "gengar", title: "Proyecto 10 · Snake (Pygame)", desc: "Tu primer juego con gráficos." },
    ],
  },
  {
    title: "Proyecto final",
    units: [
      { slug: "18-prepara-tu-proyecto", kind: "chapter", pokemon: "geodude", title: "Prepara tu proyecto", desc: "Estructura, entorno y la física del movimiento." },
      { slug: "project-capstone-plataformas", kind: "project", pokemon: "mewtwo", title: "Capstone · Plataformas", desc: "Tu propio mini-Mario: el proyecto final." },
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
