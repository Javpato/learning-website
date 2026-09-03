// Shared content model for the L2 Chimie Paris-Saclay learning tracks
// (math "Fonctions de plusieurs variables" + physics "Électromagnétisme").
//
// Design rules (from the course spec):
//  - Access NEVER depends on score, completion, or state — these types carry
//    metadata only, no gating fields.
//  - Provenance is displayed, not hidden: the source document distinguishes
//    officially-confirmed syllabus items from reconstructions.
//  - IDs are stable and never renumbered (MDX references data by id only).
//
// FR terminology glossary (keep wording consistent across all content):
//   level curves = lignes de niveau · level set = ensemble de niveau ·
//   partial derivative = dérivée partielle · gradient = gradient ·
//   tangent plane = plan tangent · chain rule = règle de la chaîne ·
//   critical point = point critique · saddle = point selle/col ·
//   phase portrait = portrait de phase · nullcline = isocline (nullcline) ·
//   eigenvalue = valeur propre · trace–determinant = trace–déterminant ·
//   damping = amortissement · normal modes = modes normaux ·
//   Gauss's theorem = théorème de Gauss · flux = flux ·
//   dipole moment = moment dipolaire · multipole expansion = développement
//   multipolaire · polarizability = polarisabilité · vector potential =
//   potentiel vecteur · marking scheme = barème · solution = corrigé.

export type Subject = "math" | "physics" | "cs";

/**
 * A string that may carry per-locale variants. Plain strings are treated as
 * French (the authoring language); en/es fall back to fr when missing, so
 * data can be translated incrementally without breaking any consumer.
 */
export type L10nString = string | { fr: string; en?: string; es?: string };

/** Resolve an L10nString for a locale (fr fallback). */
export function l10n(locale: string, s: L10nString): string {
  if (typeof s === "string") return s;
  if (locale === "en" && s.en) return s.en;
  if (locale === "es" && s.es) return s.es;
  return s.fr;
}

/** Provenance of a piece of content, mirroring the source document's tags. */
export type Provenance =
  | "officiel" // [OFFICIAL] — named in the current Paris-Saclay L2 Chimie syllabus
  | "historique" // [HISTORICAL-EXACT] — from the historical exact L2 Chimie course (Math 250)
  | "reconstruction" // [HIGH-CONFIDENCE] — reconstruction supported by close Paris-Saclay material
  | "probable" // [PROBABLE] — plausible treatment, exact current depth not public
  | "polycopie" // [FROM THE COURSE'S OWN POLYCOPIÉ + PAST PAPERS] — analysis track
  | "cours" // [FROM THE COURSE'S OWN SLIDES + CORRECTED TDS + PAST PAPERS] — réseaux track
  | "extension"; // [EXTENSION] — optional enrichment, not claimed compulsory

export const PROVENANCE_LABELS: Record<Provenance, L10nString> = {
  officiel: { fr: "Programme officiel", en: "Official syllabus", es: "Programa oficial" },
  historique: { fr: "Vérifié historiquement", en: "Historically verified", es: "Verificado históricamente" },
  reconstruction: { fr: "Reconstruction fiable", en: "High-confidence reconstruction", es: "Reconstrucción fiable" },
  probable: { fr: "Probable", en: "Probable", es: "Probable" },
  polycopie: { fr: "D'après le polycopié", en: "From the course notes", es: "Según el polycopié" },
  cours: { fr: "D'après le cours et ses annales", en: "From the course and its past papers", es: "Según el curso y sus exámenes" },
  extension: { fr: "Extension", en: "Extension", es: "Extensión" },
};

export const PROVENANCE_HELP: Record<Provenance, L10nString> = {
  officiel: {
    fr: "Sujet explicitement nommé dans le programme officiel actuel de L2 Chimie à l'Université Paris-Saclay.",
    en: "Topic explicitly named in the current official Paris-Saclay L2 Chimie syllabus.",
    es: "Tema nombrado explícitamente en el programa oficial actual de L2 Chimie en la Université Paris-Saclay.",
  },
  historique: {
    fr: "Contenu retrouvé dans un cours historique donné exactement à la L2 Chimie de Paris-Saclay (Math 250).",
    en: "Content found in a historical course taught to the exact Paris-Saclay L2 Chimie cohort (Math 250).",
    es: "Contenido hallado en un curso histórico impartido exactamente a la L2 Chimie de Paris-Saclay (Math 250).",
  },
  reconstruction: {
    fr: "Reconstruction à haute confiance, nécessaire pour relier les sujets officiels et appuyée par du matériel Paris-Saclay proche.",
    en: "High-confidence reconstruction, needed to connect the official topics and supported by closely related Paris-Saclay material.",
    es: "Reconstrucción de alta confianza, necesaria para conectar los temas oficiales y apoyada en material próximo de Paris-Saclay.",
  },
  probable: {
    fr: "Traitement plausible en L2 Chimie ; l'ordre ou la profondeur exacte du cours actuel n'est pas publique.",
    en: "Plausible L2 Chimie treatment; the current course's exact order or depth is not public.",
    es: "Tratamiento plausible en L2 Chimie; el orden o la profundidad exacta del curso actual no es pública.",
  },
  polycopie: {
    fr: "Contenu reconstruit à partir du polycopié du cours d'analyse et de ses annales (partiels et corrigés) — ce n'est pas un document officiel d'une université.",
    en: "Content rebuilt from the analysis course's own lecture notes and past papers (midterms and solutions) — not an official university document.",
    es: "Contenido reconstruido a partir del polycopié del curso de análisis y de sus exámenes anteriores (parciales y correcciones) — no es un documento oficial de una universidad.",
  },
  cours: {
    fr: "Contenu reconstruit à partir des transparents du cours de réseaux, de ses TD corrigés et de ses annales — ce n'est pas un document officiel d'une université.",
    en: "Content rebuilt from the networking course's own slides, corrected tutorial sheets, and past papers — not an official university document.",
    es: "Contenido reconstruido a partir de las transparencias del curso de redes, sus TD corregidos y sus exámenes anteriores — no es un documento oficial de una universidad.",
  },
  extension: {
    fr: "Enrichissement optionnel, utile pour la préparation — jamais présenté comme obligatoire.",
    en: "Optional enrichment, useful for preparation — never presented as compulsory.",
    es: "Enriquecimiento opcional, útil para la preparación — nunca presentado como obligatorio.",
  },
};

/** Difficulty 1–5 with encouraging labels (never judgmental). */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LABELS: Record<Difficulty, L10nString> = {
  1: { fr: "Explorer", en: "Explore", es: "Explorar" },
  2: { fr: "S'entraîner", en: "Practice", es: "Practicar" },
  3: { fr: "Niveau examen", en: "Exam level", es: "Nivel examen" },
  4: { fr: "Difficile", en: "Hard", es: "Difícil" },
  5: { fr: "Défi", en: "Challenge", es: "Desafío" },
};

export type LessonMetaData = {
  id: string; // "math-fmv-c04", "phys-em-c02"
  slug: string; // route segment, e.g. "04-derivees-partielles-gradient"
  moduleSlug: string; // "fonctions-plusieurs-variables" | "electrostatique" | …
  subject: Subject;
  title: L10nString;
  provenance: Provenance;
  difficulty: Difficulty;
  timeMinutes: number; // estimated study time
  objectives: L10nString[];
  prerequisites?: string[]; // lesson ids
  relatedExercises: string[]; // exercise ids → "Exercices liés" block
};

export type ExerciseMetaData = {
  id: string; // "math-fmv-td1-01"
  tdId: string; // "math-fmv-td1"
  title: L10nString;
  difficulty: Difficulty; // source ★=2, ★★=3, ★★★=4, ★★★★=5 (1 reserved for added confidence-builders)
  lessonIds: string[]; // back-links to theory
  provenance?: Provenance; // defaults to the TD's provenance
};

export type TdMetaData = {
  id: string; // "math-fmv-td1"
  slug: string; // "td-1"
  moduleSlug: string;
  subject: Subject;
  title: L10nString; // e.g. "TD 1 — Géométrie et systèmes de coordonnées"
  provenance: Provenance;
  exercises: ExerciseMetaData[];
};

export type ExamMetaData = {
  id: string; // "math-fmv-exam-partiel"
  slug: string; // route segment under examens/
  moduleSlug: string;
  subject: Subject;
  kind: "cc" | "partiel" | "final";
  title: L10nString;
  durationMinutes: number;
  totalPoints: number;
  topics: string[]; // lesson ids covered
  provenance: Provenance; // always "reconstruction" — surfaced prominently
};
