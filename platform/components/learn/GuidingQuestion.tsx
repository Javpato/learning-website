import type { ReactNode } from "react";

export function GuidingQuestion({
  title = "Question directrice",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="guiding-question">
      <div className="guiding-question-title">{title}</div>
      <div>{children}</div>
    </aside>
  );
}

export function GuidingAnswer({
  title = "La question directrice, résolue",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="guiding-question guiding-answer">
      <div className="guiding-question-title">{title}</div>
      <div>{children}</div>
    </aside>
  );
}
