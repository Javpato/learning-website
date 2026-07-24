"use client";

// Structured exercise block for TD pages. The prose (statement, hints,
// solution…) lives in MDX children so KaTeX flows through the build-time
// pipeline; this shell adds the header (id, title, difficulty, theory links)
// and anchors the exercise for deep links (#<exercise-id>).
//
// Open-access rules: the final answer, full solution and common errors are
// plain <details> blocks — always available, freely re-hideable to retry.
// Chrome strings are localized via the URL locale.

import Link from "next/link";
import type { ReactNode } from "react";
import { getExercise, getLesson, lessonHref } from "@/lib/content/registry";
import { DIFFICULTY_LABELS, l10n } from "@/lib/content/types";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

export function ExerciseView({ id, children }: { id: string; children: ReactNode }) {
  const locale = useLocale();
  const t = learnUi(locale);
  const ex = getExercise(id);
  const lessons = (ex?.lessonIds ?? [])
    .map((l) => getLesson(l))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <section className="exercise-view" id={id} aria-label={ex ? l10n(locale, ex.title) : "Exercice"}>
      <header className="exercise-head">
        <div className="exercise-head-row">
          <code className="exercise-id">{id}</code>
          {ex && (
            <span className="lesson-meta-chip" title={t.difficultyHint}>
              {l10n(locale, DIFFICULTY_LABELS[ex.difficulty])}
            </span>
          )}
        </div>
        {ex && <h3 className="exercise-title">{l10n(locale, ex.title)}</h3>}
        {lessons.length > 0 && (
          <p className="exercise-theory-links">
            {t.theoryUseful}{" "}
            {lessons.map((l, i) => (
              <span key={l.id}>
                {i > 0 && " · "}
                <Link href={lessonHref(locale, l)}>{l10n(locale, l.title)}</Link>
              </span>
            ))}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

/** Problem statement (énoncé). */
export function Statement({ children }: { children: ReactNode }) {
  return <div className="exercise-statement">{children}</div>;
}

/** Final answer only — for a quick check without reading the full solution. */
export function FinalAnswer({ children }: { children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <details className="collapsible exercise-answer">
      <summary>{t.finalAnswer}</summary>
      <div className="collapsible-body">{children}</div>
    </details>
  );
}

/** Detailed solution (corrigé). Always accessible; close it again to retry. */
export function Solution({ children }: { children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <details className="collapsible exercise-solution">
      <summary>{t.solution}</summary>
      <div className="collapsible-body">{children}</div>
    </details>
  );
}

/** Common wrong turns (erreurs fréquentes) — mistakes as useful information. */
export function CommonErrors({ children }: { children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <details className="collapsible exercise-errors">
      <summary>{t.commonErrors}</summary>
      <div className="collapsible-body">{children}</div>
    </details>
  );
}
