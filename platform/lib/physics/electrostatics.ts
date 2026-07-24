// 2D point-charge electrostatics for the field-map widget, plus the Gauss
// canonical geometries. Units are normalized (k = 1): the widgets teach
// structure — directions, superposition, decay laws — not numerics.

export type Charge = { x: number; y: number; q: number };

const SOFT = 0.03; // softening to avoid the singularity right on a charge

/** Superposed E field of point charges (k = 1). */
export function eField(charges: Charge[], x: number, y: number): [number, number] {
  let ex = 0;
  let ey = 0;
  for (const c of charges) {
    const dx = x - c.x;
    const dy = y - c.y;
    const r2 = dx * dx + dy * dy + SOFT;
    const r = Math.sqrt(r2);
    const f = c.q / (r2 * r);
    ex += f * dx;
    ey += f * dy;
  }
  return [ex, ey];
}

/** Superposed potential V (k = 1). */
export function potential(charges: Charge[], x: number, y: number): number {
  let v = 0;
  for (const c of charges) {
    const dx = x - c.x;
    const dy = y - c.y;
    v += c.q / Math.sqrt(dx * dx + dy * dy + SOFT);
  }
  return v;
}

/** Named charge presets used across the electrostatics lessons. */
export const CHARGE_PRESETS: { label: string; charges: Charge[] }[] = [
  { label: "Charge +q", charges: [{ x: 0, y: 0, q: 1 }] },
  {
    label: "Dipôle ±q",
    charges: [
      { x: -0.7, y: 0, q: -1 },
      { x: 0.7, y: 0, q: 1 },
    ],
  },
  {
    label: "Deux charges +q",
    charges: [
      { x: -0.7, y: 0, q: 1 },
      { x: 0.7, y: 0, q: 1 },
    ],
  },
  {
    label: "Quadrupôle linéaire",
    charges: [
      { x: -1, y: 0, q: 1 },
      { x: 0, y: 0, q: -2 },
      { x: 1, y: 0, q: 1 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Gauss canonical geometries — E(r) profiles (normalized: ε0 = 1)
// ---------------------------------------------------------------------------

export type GaussGeometry = "sphere" | "ligne" | "plan";

/**
 * |E|(r) for the three canonical Gauss cases, normalized so the value at the
 * reference radius R = 1 is 1 for sphere/line (uniform sphere of radius 1,
 * ρ chosen accordingly; infinite line; infinite plane is constant).
 */
export function gaussE(geometry: GaussGeometry, r: number): number {
  switch (geometry) {
    case "sphere":
      // uniform solid sphere radius 1: inside ∝ r, outside ∝ 1/r²
      return r <= 1 ? r : 1 / (r * r);
    case "ligne":
      return r <= 0.02 ? 0 : 1 / r; // ∝ 1/r (clipped at the axis)
    case "plan":
      return 1; // constant on each side
  }
}

/** Enclosed charge fraction for the sphere case (radius 1, total Q = 1). */
export function gaussQenc(geometry: GaussGeometry, r: number): number {
  switch (geometry) {
    case "sphere":
      return r >= 1 ? 1 : r * r * r;
    case "ligne":
      return r; // per unit length ∝ r⁰ (all of λ) — shown as λL, scale with r for display
    case "plan":
      return 1; // σA — independent of the pillbox height
  }
}
