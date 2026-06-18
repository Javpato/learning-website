import type { ReactNode } from "react";

/**
 * Collapsible block used for proof steps ("Démonstration") and mini-exercises.
 * Native <details> so it works without client JS.
 */
export function Collapsible({
  title,
  children,
  open = false,
}: {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="collapsible" open={open}>
      <summary>{title}</summary>
      <div className="collapsible-body">{children}</div>
    </details>
  );
}
