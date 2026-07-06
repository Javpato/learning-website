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
  pyHubTitle: string;
  pyHubIntro: string;
  pyBadges: string;
  pyDone: string;
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
  pyHubTitle: "Python — De zéro à programmeur",
  pyHubIntro:
    "Un parcours interactif façon Codédex, des fondamentaux jusqu'à Python avancé. Chaque chapitre exécute du vrai Python directement dans ton navigateur — rien à installer — et chaque grande étape débloque un projet guidé que tu écris sur ta propre machine et publies sur ton GitHub, jusqu'à un jeu de plateformes final. Termine chaque niveau pour obtenir ton badge. ⚡",
  pyBadges: "Badges obtenus",
  pyDone: "✓ Terminé",
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
  pyHubTitle: "Python — De cero a programador",
  pyHubIntro:
    "Un viaje interactivo al estilo Codédex, de los fundamentos a Python avanzado. Cada capítulo ejecuta Python de verdad en tu navegador — no se instala nada — y cada gran hito desbloquea un proyecto guiado que escribes en tu propia máquina y subes a tu GitHub, hasta un juego de plataformas final. Completa cada nivel para conseguir tu medalla. ⚡",
  pyBadges: "Medallas conseguidas",
  pyDone: "✓ Completado",
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
  pyHubTitle: "Python — From Zero to Coder",
  pyHubIntro:
    "An interactive, Codédex-style journey from the fundamentals to advanced Python. Every chapter runs real Python right in your browser — nothing to install — and every big milestone unlocks a guided project you write on your own machine and push to your GitHub, all the way to a final platformer game. Clear each level to earn your badge. ⚡",
  pyBadges: "Badges earned",
  pyDone: "✓ Completed",
};

const overrides: Record<Locale, Partial<Dictionary>> = { fr, es, en };

export function getDictionary(locale: Locale): Dictionary {
  // Shallow-merge over the French base so any untranslated key falls back to fr.
  return { ...fr, ...overrides[locale] } as Dictionary;
}

export { defaultLocale };
export type { Dictionary };
