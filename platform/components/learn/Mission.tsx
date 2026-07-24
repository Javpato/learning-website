"use client";

import type { ReactNode } from "react";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

/**
 * "La mission" — the chemistry problem that opens a lesson and creates the
 * need for the tool (headache before aspirin). `fil` situates the lesson on
 * the subject's fil rouge in one line; children state the concrete question
 * the learner should attempt before any theory.
 */
export function Mission({ fil, children }: { fil?: string; children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <aside className="mission">
      {fil && <div className="mission-fil">{fil}</div>}
      <div className="mission-title">{t.missionTitle}</div>
      <div>{children}</div>
    </aside>
  );
}

/**
 * "Mission résolue" — closes the loop at the end of the lesson: the opening
 * question, now answered with the tool that was just built.
 */
export function MissionSolved({ children }: { children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <aside className="mission mission-solved">
      <div className="mission-title">{t.missionSolvedTitle}</div>
      <div>{children}</div>
    </aside>
  );
}
