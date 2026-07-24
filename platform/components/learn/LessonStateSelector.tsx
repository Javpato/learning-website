"use client";

// Self-marked lesson state (Pas exploré / En cours / Compris / À revoir /
// Favori). The learner chooses freely; nothing is automatic, nothing is
// judged, and no state ever restricts access. Stored per-browser only.

import { useEffect, useState } from "react";
import {
  LESSON_STATES,
  getState,
  setState,
  subscribe,
  type LessonState,
} from "@/lib/learn/lessonState";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

export function LessonStateSelector({ id }: { id: string }) {
  const t = learnUi(useLocale());
  const [state, setLocal] = useState<LessonState>("not-explored");

  useEffect(() => {
    setLocal(getState(id));
    return subscribe(() => setLocal(getState(id)));
  }, [id]);

  return (
    <div className="lesson-state" role="group" aria-label={t.stateGroupLabel}>
      <span className="lesson-state-label">{t.stateLabel}</span>
      {LESSON_STATES.map((s, i) => (
        <button
          key={s}
          type="button"
          className={`lesson-state-btn${state === s ? " active" : ""}`}
          aria-pressed={state === s}
          onClick={() => {
            setState(id, s);
            setLocal(s);
          }}
        >
          {t.states[i]}
        </button>
      ))}
    </div>
  );
}
