// Exact axial potentials vs multipole truncations (k = 1) for the far-field
// widget. Configurations are axial charge sets so V(z) has a clean closed
// form on the axis.

export type AxialConfig = {
  label: string;
  charges: Array<{ z: number; q: number }>;
  /** leading multipole label for the caption */
  leading: "monopôle" | "dipôle" | "quadrupôle";
};

export const AXIAL_CONFIGS: AxialConfig[] = [
  {
    label: "Ion (monopôle)",
    charges: [{ z: 0, q: 1 }],
    leading: "monopôle",
  },
  {
    label: "Dipôle ±q en z = ±a",
    charges: [
      { z: 0.5, q: 1 },
      { z: -0.5, q: -1 },
    ],
    leading: "dipôle",
  },
  {
    label: "Quadrupôle linéaire (+q, −2q, +q)",
    charges: [
      { z: 0.5, q: 1 },
      { z: 0, q: -2 },
      { z: -0.5, q: 1 },
    ],
    leading: "quadrupôle",
  },
];

/** Exact V(z) on the axis (z beyond every charge). */
export function exactV(cfg: AxialConfig, z: number): number {
  let v = 0;
  for (const c of cfg.charges) {
    v += c.q / Math.abs(z - c.z);
  }
  return v;
}

/** Multipole moments about the origin for an axial set. */
export function moments(cfg: AxialConfig): { Q: number; p: number; Qzz: number } {
  let Q = 0;
  let p = 0;
  let Qzz = 0;
  for (const c of cfg.charges) {
    Q += c.q;
    p += c.q * c.z;
    Qzz += c.q * (3 * c.z * c.z - c.z * c.z); // = 2 q z² on the axis convention
  }
  return { Q, p, Qzz };
}

/** Truncated V(z): monopole, +dipole, +quadrupole terms on the axis. */
export function truncatedV(
  cfg: AxialConfig,
  z: number,
  order: 0 | 1 | 2,
): number {
  const { Q, p, Qzz } = moments(cfg);
  let v = Q / z;
  if (order >= 1) v += p / (z * z);
  if (order >= 2) v += Qzz / (2 * z * z * z);
  return v;
}
