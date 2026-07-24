"use client";

// Lesson header block (under the H1): difficulty, estimated time, provenance,
// folded objectives. The footer variant renders the "Exercices liés" cards.
// Deliberately minimal: no prerequisite list (just-in-time <Rappel> blocks
// inside the lesson replace it) — the lesson's Mission, not a bullet list,
// carries the purpose. Fully localized via the URL locale.

import Link from "next/link";
import { getLesson, exerciseHref, getExercise, getTdOfExercise } from "@/lib/content/registry";
import { DIFFICULTY_LABELS, l10n } from "@/lib/content/types";
import { learnUi } from "@/lib/learn/ui";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { useLocale } from "./useLocale";

export function LessonMeta({ id }: { id: string }) {
  const locale = useLocale();
  const t = learnUi(locale);
  const lesson = getLesson(id);
  if (!lesson) return null;

  return (
    <div className="lesson-meta">
      <div className="lesson-meta-row">
        <span className="lesson-meta-chip" title={t.difficultyHint}>
          {l10n(locale, DIFFICULTY_LABELS[lesson.difficulty])}
        </span>
        <span className="lesson-meta-chip">
          ⏱ ~{lesson.timeMinutes} {t.minutesSuffix}
        </span>
        <ProvenanceBadge provenance={lesson.provenance} />
      </div>
      {lesson.objectives.length > 0 && (
        <details className="lesson-meta-objectives">
          <summary>{t.objectivesSummary}</summary>
          <ul>
            {lesson.objectives.map((o, i) => (
              <li key={i}>{l10n(locale, o)}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

/**
 * "Exercices liés" block for the end of a lesson — suggestion cards linking
 * into the TD pages. Suggestions, never restrictions.
 */
export function RelatedExercises({ id }: { id: string }) {
  const locale = useLocale();
  const t = learnUi(locale);
  const lesson = getLesson(id);
  if (!lesson || lesson.relatedExercises.length === 0) return null;

  return (
    <div className="related-exercises">
      <h2 id={`${id}-exercices-lies`}>{t.relatedTitle}</h2>
      <p className="related-exercises-hint">{t.relatedHint}</p>
      <ul>
        {lesson.relatedExercises.map((exId) => {
          const ex = getExercise(exId);
          const td = getTdOfExercise(exId);
          const href = exerciseHref(locale, exId);
          if (!ex || !td || !href) return null;
          return (
            <li key={exId}>
              <Link href={href}>{l10n(locale, ex.title)}</Link>{" "}
              <span className="related-exercises-meta">
                — {l10n(locale, td.title).split("—")[0].trim()} ·{" "}
                {l10n(locale, DIFFICULTY_LABELS[ex.difficulty])}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
