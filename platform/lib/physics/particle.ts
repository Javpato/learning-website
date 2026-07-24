// Charged-particle trajectories in uniform E and B fields (normalized units)
// for the cyclotron widget. B is along +z; E can be along −y (selector mode).

export type V3 = [number, number, number];

/** Cyclotron radius and angular frequency (q = m = 1). */
export function cyclotron(vPerp: number, B: number): { R: number; omega: number } {
  const omega = Math.abs(B);
  return { R: omega < 1e-9 ? Infinity : vPerp / omega, omega };
}

/** Sampled trajectory with optional E field (RK4, q = m = 1). */
export function trajectory3(
  v0: V3,
  E: V3,
  B: V3,
  s: 1 | -1,
  { h = 0.01, steps = 3000 }: { h?: number; steps?: number } = {},
): V3[] {
  const q = s;
  const acc = (v: V3): V3 => [
    q * (E[0] + v[1] * B[2] - v[2] * B[1]),
    q * (E[1] + v[2] * B[0] - v[0] * B[2]),
    q * (E[2] + v[0] * B[1] - v[1] * B[0]),
  ];
  let r: V3 = [0, 0, 0];
  let v: V3 = [...v0] as V3;
  const out: V3[] = [[0, 0, 0]];
  for (let i = 0; i < steps; i++) {
    // RK4 on (r, v)
    const a1 = acc(v);
    const v1 = v;
    const v2: V3 = [v[0] + (h / 2) * a1[0], v[1] + (h / 2) * a1[1], v[2] + (h / 2) * a1[2]];
    const a2 = acc(v2);
    const v3: V3 = [v[0] + (h / 2) * a2[0], v[1] + (h / 2) * a2[1], v[2] + (h / 2) * a2[2]];
    const a3 = acc(v3);
    const v4: V3 = [v[0] + h * a3[0], v[1] + h * a3[1], v[2] + h * a3[2]];
    const a4 = acc(v4);
    r = [
      r[0] + (h / 6) * (v1[0] + 2 * v2[0] + 2 * v3[0] + v4[0]),
      r[1] + (h / 6) * (v1[1] + 2 * v2[1] + 2 * v3[1] + v4[1]),
      r[2] + (h / 6) * (v1[2] + 2 * v2[2] + 2 * v3[2] + v4[2]),
    ];
    v = [
      v[0] + (h / 6) * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]),
      v[1] + (h / 6) * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]),
      v[2] + (h / 6) * (a1[2] + 2 * a2[2] + 2 * a3[2] + a4[2]),
    ];
    out.push(r);
  }
  return out;
}
