"use client";

import type { ReactNode } from "react";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

/**
 * "Rappel express" — a just-in-time prerequisite reminder, folded by default,
 * placed at the exact point where the prerequisite is used (never at the top
 * of a lesson). Compact by design: one idea, a few lines, no ceremony.
 */
export function Rappel({ title, children }: { title: string; children: ReactNode }) {
  const t = learnUi(useLocale());
  return (
    <details className="rappel">
      <summary>
        {t.rappelPrefix} {title}
      </summary>
      <div className="rappel-body">{children}</div>
    </details>
  );
}
