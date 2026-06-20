import { defaultLocale, type Locale } from "./config";

// UI shell strings. French is the source of truth; missing keys in es/en fall
// back to the French value via `getDictionary`.
type Dictionary = {
  brand: string;
  navThemes: string;
  navMath: string;
  home: string;
  math: string;
  tagline: string;
  mathHubTitle: string;
  mathHubSub: string;
};

const fr: Dictionary = {
  brand: "Learning",
  navThemes: "Thèmes",
  navMath: "Mathématiques",
  home: "Accueil",
  math: "Mathématiques",
  tagline:
    "Des formules qui prennent vie — sans rien céder sur la rigueur. Définitions, théorèmes et démonstrations, rendus manipulables.",
  mathHubTitle: "Mathématiques",
  mathHubSub:
    "Voir pourquoi les idées sont vraies : définitions formelles, exemples calculés, visualisations interactives et démonstrations complètes.",
};

const es: Partial<Dictionary> = {
  brand: "Aprender",
  navThemes: "Temas",
  navMath: "Matemáticas",
  home: "Inicio",
  math: "Matemáticas",
};

const en: Partial<Dictionary> = {
  brand: "Learning",
  navThemes: "Themes",
  navMath: "Mathematics",
  home: "Home",
  math: "Mathematics",
};

const overrides: Record<Locale, Partial<Dictionary>> = { fr, es, en };

export function getDictionary(locale: Locale): Dictionary {
  // Shallow-merge over the French base so any untranslated key falls back to fr.
  return { ...fr, ...overrides[locale] } as Dictionary;
}

export { defaultLocale };
export type { Dictionary };
