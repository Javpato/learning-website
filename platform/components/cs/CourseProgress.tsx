"use client";

// Course-wide progress bar shown on the Python hub. Reads completed units from
// localStorage (lib/progress) and stays in sync as the learner completes levels.

import { useEffect, useState } from "react";
import { UNITS } from "@/lib/python/course";
import { getCompleted, subscribe } from "@/lib/progress";

export function CourseProgress() {
  const total = UNITS.length;
  const [done, setDone] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const c = getCompleted();
      setDone(UNITS.filter((u) => c.has(u.slug)).length);
    };
    update();
    return subscribe(update);
  }, []);

  // Avoid SSR/client mismatch: render a stable 0-state until mounted.
  const count = mounted ? done : 0;
  const pct = Math.round((count / total) * 100);

  return (
    <div className="course-progress" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={total}>
      <div className="course-progress-head">
        <span className="pokeball" aria-hidden="true" />
        <strong>Medallas conseguidas</strong>
        <span className="course-progress-count">
          {count} / {total}
        </span>
      </div>
      <div className="course-progress-track">
        <div className="course-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
