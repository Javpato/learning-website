"use client";

// Mock-exam shell. Presents a reconstructed exam paper as a preparation tool,
// never a judgment: prominent "sujet reconstruit" banner, topics covered,
// barème, suggested duration, and a strictly OPTIONAL pausable timer (off by
// default, purely informative). Corrections live in the MDX children as
// <Collapsible> blocks — always accessible, no recording of any score.

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getExam, getLesson, lessonHref } from "@/lib/content/registry";
import { l10n, PROVENANCE_HELP } from "@/lib/content/types";
import { learnUi } from "@/lib/learn/ui";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { useLocale } from "./useLocale";

function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MockExamView({ id, children }: { id: string; children: ReactNode }) {
  const locale = useLocale();
  const t = learnUi(locale);
  const exam = getExam(id);

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
      interval.current = null;
    };
  }, [running]);

  const topics = (exam?.topics ?? [])
    .map((t) => getLesson(t))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="exam" id={id}>
      {exam && (
        <header className="exam-head">
          <div className="lesson-meta-row">
            <ProvenanceBadge provenance={exam.provenance} />
            <span className="lesson-meta-chip">⏱ {exam.durationMinutes} {t.suggestedMinutes}</span>
            <span className="lesson-meta-chip">{exam.totalPoints} {t.points}</span>
          </div>
          <p className="exam-disclaimer">
            {t.examDisclaimer}{" "}
            <span title={l10n(locale, PROVENANCE_HELP[exam.provenance])}>ⓘ</span>
          </p>
          {topics.length > 0 && (
            <p className="exam-topics">
              {t.topicsCovered}{" "}
              {topics.map((t2, i) => (
                <span key={t2.id}>
                  {i > 0 && " · "}
                  <Link href={lessonHref(locale, t2)}>{l10n(locale, t2.title)}</Link>
                </span>
              ))}
            </p>
          )}
          <div className="exam-timer" role="group" aria-label={`${t.timerLabel} ${t.timerOptional}`}>
            <span className="exam-timer-label">
              {t.timerLabel} <em>{t.timerOptional}</em> :
            </span>
            <span className="exam-timer-value" aria-live="off">
              {fmt(seconds)}
            </span>
            <button type="button" className="btn" onClick={() => setRunning((r) => !r)}>
              {running ? t.pause : seconds > 0 ? t.resume : t.start}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setRunning(false);
                setSeconds(0);
              }}
            >
              {t.reset}
            </button>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}

/** One exam problem/exercise with its barème. */
export function ExamProblem({
  title,
  points,
  children,
}: {
  title: string;
  points?: number;
  children: ReactNode;
}) {
  return (
    <section className="exam-problem">
      <h2>
        {title}
        {typeof points === "number" && <span className="exam-points"> ({points} pts)</span>}
      </h2>
      {children}
    </section>
  );
}
