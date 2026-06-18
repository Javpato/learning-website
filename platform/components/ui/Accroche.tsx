import type { ReactNode } from "react";

/** "Accroche" — the intuitive one-line tagline that opens every concept page. */
export function Accroche({ children }: { children: ReactNode }) {
  return <p className="accroche">{children}</p>;
}
