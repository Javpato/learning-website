// Merged lookup over both subjects' content metadata + href builders.
// MDX components reference content only by id; this registry resolves them.

import type {
  ExamMetaData,
  ExerciseMetaData,
  LessonMetaData,
  TdMetaData,
} from "./types";
import { MATH_EXAMS, MATH_LESSONS, MATH_MODULE_SLUG, MATH_TDS } from "./math-fmv";
import { PHYS_EXAMS, PHYS_LESSONS, PHYS_TDS } from "./physics-em";

export const ALL_LESSONS: LessonMetaData[] = [...MATH_LESSONS, ...PHYS_LESSONS];
export const ALL_TDS: TdMetaData[] = [...MATH_TDS, ...PHYS_TDS];
export const ALL_EXAMS: ExamMetaData[] = [...MATH_EXAMS, ...PHYS_EXAMS];

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

// ---------------------------------------------------------------------------
// Hrefs (locale-relative, i.e. "/<locale>/…"; Next adds the basePath itself)
// ---------------------------------------------------------------------------

function subjectBase(subject: "math" | "physics"): string {
  return subject === "math" ? `/math/${MATH_MODULE_SLUG}` : "/physics";
}

/** Route of a lesson page, e.g. /fr/math/fonctions-plusieurs-variables/04-… */
export function lessonHref(locale: string, lesson: LessonMetaData): string {
  return lesson.subject === "math"
    ? `/${locale}${subjectBase("math")}/${lesson.slug}`
    : `/${locale}/physics/${lesson.moduleSlug}/${lesson.slug}`;
}

/** Route of a TD page. */
export function tdHref(locale: string, td: TdMetaData): string {
  return td.subject === "math"
    ? `/${locale}${subjectBase("math")}/${td.slug}`
    : `/${locale}/physics/${td.moduleSlug}/${td.slug}`;
}

/** Route of the TD page containing an exercise (anchor on its id). */
export function exerciseHref(locale: string, exerciseId: string): string | undefined {
  const td = tdOfExercise.get(exerciseId);
  if (!td) return undefined;
  return `${tdHref(locale, td)}#${exerciseId}`;
}

/** Route of an exam page. */
export function examHref(locale: string, exam: ExamMetaData): string {
  return exam.subject === "math"
    ? `/${locale}${subjectBase("math")}/examens/${exam.slug}`
    : `/${locale}/physics/examens/${exam.slug}`;
}
