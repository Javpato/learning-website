"use client";

// Progressive hint ladder for exercises. The learner reveals hints one by one
// ("Indice 1", "Indice 2", …) — but nothing is ever locked: every hint can be
// opened directly and the full solution (a sibling <Solution> block) is always
// available. Opening hints is free: no penalty, no score impact, re-hideable.

import {
  Children,
  Fragment,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

type HintProps = { title?: string; children: ReactNode };

export function Hint({ children }: HintProps) {
  return <>{children}</>;
}

export function HintLadder({ children }: { children: ReactNode }) {
  const t = learnUi(useLocale());
  // Across the RSC boundary <Hint> arrives as a lazy client reference, so
  // `c.type === Hint` can never match. Only <Hint> children are allowed here,
  // so any non-host (non-string-typed) element is a hint. Recurse through
  // host elements in case a <Hint> got nested inside a paragraph by MDX.
  const hints: ReactElement<HintProps>[] = [];
  const collect = (nodes: ReactNode) => {
    Children.forEach(nodes, (c) => {
      if (!isValidElement(c)) return;
      if (typeof c.type !== "string" && c.type !== Fragment) {
        hints.push(c as ReactElement<HintProps>);
      } else {
        collect((c.props as { children?: ReactNode }).children);
      }
    });
  };
  collect(children);
  const [revealed, setRevealed] = useState<boolean[]>(() => hints.map(() => false));

  if (hints.length === 0) return null;

  const toggle = (i: number) =>
    setRevealed((r) => r.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="hint-ladder">
      <p className="hint-ladder-intro">{t.hintsIntro}</p>
      {hints.map((h, i) => (
        <div key={i} className="hint-item">
          <button
            type="button"
            className="hint-toggle"
            aria-expanded={revealed[i]}
            onClick={() => toggle(i)}
          >
            {revealed[i] ? "▾" : "▸"} {h.props.title ?? `${t.hintLabel} ${i + 1}`}
          </button>
          {revealed[i] && <div className="hint-body">{h.props.children}</div>}
        </div>
      ))}
    </div>
  );
}
