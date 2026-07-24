"use client";

import type { ReactNode } from "react";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

/**
 * "À retenir" aside — the key results / formula box of a lesson. Also the
 * building block of the formulaire (revision sheet) pages. Pass `title` to
 * override the localized default.
 */
export function KeyResults({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const t = learnUi(useLocale());
  return (
    <aside className="key-results">
      <div className="key-results-title">{title ?? t.keyResultsDefault}</div>
      <div>{children}</div>
    </aside>
  );
}
