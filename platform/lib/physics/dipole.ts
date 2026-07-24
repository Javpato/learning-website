// Dipole-in-a-field mechanics (normalized units) for the torque widget.

/** Torque magnitude (signed, z-component) for p at angle θ to E. */
export function torque(p: number, E: number, thetaRad: number): number {
  return -p * E * Math.sin(thetaRad); // restoring toward θ = 0
}

/** Orientation energy U(θ) = −pE cos θ. */
export function energy(p: number, E: number, thetaRad: number): number {
  return -p * E * Math.cos(thetaRad);
}

/** Small-oscillation angular frequency around stable alignment. */
export function oscillationOmega(p: number, E: number, inertia: number): number {
  return Math.sqrt((p * E) / inertia);
}

/**
 * Dipole–dipole interaction energy (k = 1) for two dipoles separated along x
 * by r, with in-plane orientation angles θ1, θ2 (from the x-axis):
 * U = [p1·p2 − 3 (p1·r̂)(p2·r̂)] / r³.
 */
export function dipoleDipoleEnergy(
  p1: number,
  th1: number,
  p2: number,
  th2: number,
  r: number,
): number {
  const dot = p1 * p2 * Math.cos(th1 - th2);
  const proj = p1 * Math.cos(th1) * p2 * Math.cos(th2);
  return (dot - 3 * proj) / (r * r * r);
}
