// Trace–determinant plane machinery for the linear-systems widget.

import { eigen2x2 } from "./odes";

export type PortraitKind =
  | "selle"
  | "nœud stable"
  | "nœud instable"
  | "spirale stable"
  | "spirale instable"
  | "centre"
  | "dégénéré";

/** Classification of X' = AX from the (τ, Δ) invariants. */
export function classifyTraceDet(tau: number, det: number): PortraitKind {
  const disc = tau * tau - 4 * det;
  const eps = 1e-9;
  if (det < -eps) return "selle";
  if (Math.abs(det) <= eps || Math.abs(disc) <= eps) return "dégénéré";
  if (disc > 0) return tau < 0 ? "nœud stable" : "nœud instable";
  if (Math.abs(tau) <= eps) return "centre";
  return tau < 0 ? "spirale stable" : "spirale instable";
}

/**
 * A concrete matrix realizing given trace and determinant:
 * companion-style A = [[τ/2, 1], [τ²/4 − Δ, τ/2]] (trace τ, det Δ).
 */
export function matrixFromTraceDet(tau: number, det: number): [[number, number], [number, number]] {
  return [
    [tau / 2, 1],
    [(tau * tau) / 4 - det, tau / 2],
  ];
}

export { eigen2x2 };
