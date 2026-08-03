import type { ReactNode } from "react";

/** A central proof that remains visible in the lesson's reading flow. */
export function Proof({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="proof-block">
      <div className="proof-title">Démonstration — {title}</div>
      <div className="proof-body">{children}</div>
    </section>
  );
}
