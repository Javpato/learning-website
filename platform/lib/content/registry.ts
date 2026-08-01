// Merged lookup over both subjects' content metadata + href builders.
// MDX components reference content only by id; this registry resolves them.

import type {
  ExamMetaData,
  ExerciseMetaData,
  LessonMetaData,
  TdMetaData,
} from "./types";
import { MATH_EXAMS, MATH_LESSONS, MATH_TDS } from "./math-fmv";
import { ANALYSE_EXAMS, ANALYSE_LESSONS, ANALYSE_TDS } from "./math-analyse";
import { PHYS_EXAMS, PHYS_LESSONS, PHYS_TDS } from "./physics-em";
import { MATH_TERMES, type TermeEntry } from "./glossaire-fmv";
import { ANALYSE_TERMES } from "./glossaire-analyse";

export const ALL_LESSONS: LessonMetaData[] = [
  ...MATH_LESSONS,
  ...ANALYSE_LESSONS,
  ...PHYS_LESSONS,
];
export const ALL_TDS: TdMetaData[] = [...MATH_TDS, ...ANALYSE_TDS, ...PHYS_TDS];
export const ALL_EXAMS: ExamMetaData[] = [
  ...MATH_EXAMS,
  ...ANALYSE_EXAMS,
  ...PHYS_EXAMS,
];

const lessonById = new Map(ALL_LESSONS.map((l) => [l.id, l]));
const tdById = new Map(ALL_TDS.map((t) => [t.id, t]));
const examById = new Map(ALL_EXAMS.map((e) => [e.id, e]));
const exerciseById = new Map<string, ExerciseMetaData>();
const tdOfExercise = new Map<string, TdMetaData>();
for (const td of ALL_TDS) {
  for (const ex of td.exercises) {
    exerciseById.set(ex.id, ex);
    tdOfExercise.set(ex.id, td);
  }
}

export function getLesson(id: string): LessonMetaData | undefined {
  return lessonById.get(id);
}
export function getTd(id: string): TdMetaData | undefined {
  return tdById.get(id);
}
export function getExam(id: string): ExamMetaData | undefined {
  return examById.get(id);
}
export function getExercise(id: string): ExerciseMetaData | undefined {
  return exerciseById.get(id);
}
export function getTdOfExercise(exerciseId: string): TdMetaData | undefined {
  return tdOfExercise.get(exerciseId);
}

const ALL_TERMES: TermeEntry[] = [...MATH_TERMES, ...ANALYSE_TERMES];
const termeById = new Map(ALL_TERMES.map((t) => [t.id, t]));

export function getTerme(id: string): TermeEntry | undefined {
  return termeById.get(id);
}

// ---------------------------------------------------------------------------
// Hrefs (locale-relative, i.e. "/<locale>/…"; Next adds the basePath itself)
// ---------------------------------------------------------------------------

/**
 * Base route of a module: math modules live under /math/<moduleSlug>
 * (fonctions-plusieurs-variables, analyse-convergence, …), physics theme
 * modules under /physics/<moduleSlug>.
 */
function moduleBase(locale: string, subject: "math" | "physics", moduleSlug: string): string {
  return `/${locale}/${subject === "math" ? "math" : "physics"}/${moduleSlug}`;
}

/** Route of a lesson page, e.g. /fr/math/fonctions-plusieurs-variables/04-… */
export function lessonHref(locale: string, lesson: LessonMetaData): string {
  return `${moduleBase(locale, lesson.subject, lesson.moduleSlug)}/${lesson.slug}`;
}

/** Route of a TD page. */
export function tdHref(locale: string, td: TdMetaData): string {
  return `${moduleBase(locale, td.subject, td.moduleSlug)}/${td.slug}`;
}

/** Route of the TD page containing an exercise (anchor on its id). */
export function exerciseHref(locale: string, exerciseId: string): string | undefined {
  const td = tdOfExercise.get(exerciseId);
  if (!td) return undefined;
  return `${tdHref(locale, td)}#${exerciseId}`;
}

/** Route of a term's definition site: lesson page + #def-<id> anchor. */
export function termeHref(locale: string, termeId: string): string | undefined {
  const t = termeById.get(termeId);
  const lesson = t && lessonById.get(t.lessonId);
  if (!lesson) return undefined;
  return `${lessonHref(locale, lesson)}#def-${t.id}`;
}

/** Route of an exam page. */
export function examHref(locale: string, exam: ExamMetaData): string {
  // Physics exams are shared across the theme modules (no module level);
  // math exams live inside their own module.
  return exam.subject === "math"
    ? `${moduleBase(locale, "math", exam.moduleSlug)}/examens/${exam.slug}`
    : `/${locale}/physics/examens/${exam.slug}`;
}
