// Shared ODE integration engine for the interactive scenes (phase portraits,
// trace–determinant explorer, damped oscillator, cyclotron motion).
// Classic fixed-step RK4 — plenty for visualization purposes.

export type VectorField2 = (x: number, y: number) => [number, number];

/** One RK4 step of x' = F(x). */
export function rk4Step(F: VectorField2, x: number, y: number, h: number): [number, number] {
  const [k1x, k1y] = F(x, y);
  const [k2x, k2y] = F(x + (h / 2) * k1x, y + (h / 2) * k1y);
  const [k3x, k3y] = F(x + (h / 2) * k2x, y + (h / 2) * k2y);
  const [k4x, k4y] = F(x + h * k3x, y + h * k3y);
  return [
    x + (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    y + (h / 6) * (k1y + 2 * k2y + 2 * k3y + k4y),
  ];
}

export type Trajectory = Array<[number, number]>;

/**
 * Integrate a trajectory from (x0, y0), forward (and optionally backward) in
 * time. Stops early if the point escapes `bound` (keeps polylines sane).
 */
export function trajectory(
  F: VectorField2,
  x0: number,
  y0: number,
  {
    h = 0.02,
    steps = 600,
    bound = 50,
    backward = false,
  }: { h?: number; steps?: number; bound?: number; backward?: boolean } = {},
): Trajectory {
  const pts: Trajectory = [[x0, y0]];
  let [x, y] = [x0, y0];
  const step = backward ? -h : h;
  for (let i = 0; i < steps; i++) {
    [x, y] = rk4Step(F, x, y, step);
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.hypot(x, y) > bound) break;
    pts.push([x, y]);
  }
  return pts;
}

/** Forward + backward trajectory through a seed point (nicer phase portraits). */
export function throughPoint(
  F: VectorField2,
  x0: number,
  y0: number,
  opts: { h?: number; steps?: number; bound?: number } = {},
): Trajectory {
  const back = trajectory(F, x0, y0, { ...opts, backward: true }).reverse();
  const fwd = trajectory(F, x0, y0, opts);
  return [...back, ...fwd.slice(1)];
}

/** Sample x(t) of a scalar second-order ODE x'' = f(x, x', t) reduced to 2D. */
export function timeSeries(
  accel: (x: number, v: number, t: number) => number,
  x0: number,
  v0: number,
  { h = 0.01, steps = 2000 }: { h?: number; steps?: number } = {},
): Array<[number, number]> {
  // time-dependent RK4 on (x, v)
  let x = x0;
  let v = v0;
  let t = 0;
  const out: Array<[number, number]> = [[0, x0]];
  for (let i = 0; i < steps; i++) {
    const k1x = v;
    const k1v = accel(x, v, t);
    const k2x = v + (h / 2) * k1v;
    const k2v = accel(x + (h / 2) * k1x, v + (h / 2) * k1v, t + h / 2);
    const k3x = v + (h / 2) * k2v;
    const k3v = accel(x + (h / 2) * k2x, v + (h / 2) * k2v, t + h / 2);
    const k4x = v + h * k3v;
    const k4v = accel(x + h * k3x, v + h * k3v, t + h);
    x += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    t += h;
    if (!Number.isFinite(x) || !Number.isFinite(v)) break;
    out.push([t, x]);
  }
  return out;
}

/** Eigenvalues of a real 2×2 matrix [[a, b], [c, d]]. */
export function eigen2x2(
  a: number,
  b: number,
  c: number,
  d: number,
): { re1: number; im1: number; re2: number; im2: number } {
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  if (disc >= 0) {
    const s = Math.sqrt(disc);
    return { re1: (tr + s) / 2, im1: 0, re2: (tr - s) / 2, im2: 0 };
  }
  const s = Math.sqrt(-disc);
  return { re1: tr / 2, im1: s / 2, re2: tr / 2, im2: -s / 2 };
}
