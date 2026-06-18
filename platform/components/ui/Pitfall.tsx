import type { ReactNode } from "react";

/** "Piège classique" callout — a common mistake or counterexample. */
export function Pitfall({ children }: { children: ReactNode }) {
  return <div className="pitfall">{children}</div>;
}
