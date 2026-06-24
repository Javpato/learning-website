import { defaultLocale, type Locale } from "./config";

// UI shell strings. French is the source of truth; missing keys in es/en fall
// back to the French value via `getDictionary`.
type Dictionary = {
  brand: string;
  navThemes: string;
  navMath: string;
  home: string;
  math: string;
  cs: string;
  navCs: string;
  tagline: string;
  mathHubTitle: string;
  mathHubSub: string;
  csHubTitle: string;
  csHubSub: string;
};

const fr: Dictionary = {
  brand: "Learning",
  navThemes: "Thèmes",
  navMath: "Mathématiques",
  home: "Accueil",
  math: "Mathématiques",
  cs: "Informatique",
  navCs: "Informatique",
  tagline:
    "Des formules qui prennent vie — sans rien céder sur la rigueur. Définitions, théorèmes et démonstrations, rendus manipulables.",
  mathHubTitle: "Mathématiques",
  mathHubSub:
    "Voir pourquoi les idées sont vraies : définitions formelles, exemples calculés, visualisations interactives et démonstrations complètes.",
  csHubTitle: "Informatique",
  csHubSub:
    "Apprendre en pratiquant : exécutez du vrai SQL dans votre navigateur, voyez les résultats immédiatement, et construisez un projet à la fin de chaque chapitre.",
};

const es: Partial<Dictionary> = {
  brand: "Aprender",
  navThemes: "Temas",
  navMath: "Matemáticas",
  home: "Inicio",
  math: "Matemáticas",
  cs: "Informática",
  navCs: "Informática",
  csHubTitle: "Informática",
  csHubSub:
    "Aprende practicando: ejecuta SQL real en tu navegador, ve los resultados al instante y construye un proyecto al final de cada capítulo.",
};

const en: Partial<Dictionary> = {
  brand: "Learning",
  navThemes: "Themes",
  navMath: "Mathematics",
  home: "Home",
  math: "Mathematics",
  cs: "Computer Science",
  navCs: "Computer Science",
  csHubTitle: "Computer Science",
  csHubSub:
    "Learn by doing: run real SQL in your browser, see results instantly, and build a project at the end of every chapter.",
};

const overrides: Record<Locale, Partial<Dictionary>> = { fr, es, en };

export function getDictionary(locale: Locale): Dictionary {
  // Shallow-merge over the French base so any untranslated key falls back to fr.
  return { ...fr, ...overrides[locale] } as Dictionary;
}

export { defaultLocale };
export type { Dictionary };
