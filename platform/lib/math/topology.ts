/**
 * Geometry & numerics for the topology pages: p-norms and their unit balls,
 * function-space norms (L¹, L², L∞) on C([0,1]), the ball-containment test that
 * powers the "open set" visualisation, and convergent-sequence generators.
 */

export type Pt = [number, number];

// ---------------------------------------------------------------------------
// p-norms on ℝⁿ
// ---------------------------------------------------------------------------

/** ‖v‖_p, with p = Infinity giving the max (sup) norm. */
export function pNorm(v: number[], p: number): number {
  if (!isFinite(p)) return Math.max(...v.map((x) => Math.abs(x)));
  const s = v.reduce((acc, x) => acc + Math.abs(x) ** p, 0);
  return s ** (1 / p);
}

/**
 * Points around the unit "circle" {‖(x,y)‖_p = 1} for drawing.
 * Uses the superellipse parametrisation |cos t|^{2/p}·sign, |sin t|^{2/p}·sign,
 * which satisfies |x|^p + |y|^p = 1. p = Infinity → the square [-1,1]².
 */
export function unitBallPolygon(p: number, samples = 128): Pt[] {
  if (!isFinite(p)) {
    return [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
  }
  const pts: Pt[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (2 * Math.PI * i) / samples;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = Math.sign(c) * Math.abs(c) ** (2 / p);
    const y = Math.sign(s) * Math.abs(s) ** (2 / p);
    pts.push([x, y]);
  }
  return pts;
}

// ---------------------------------------------------------------------------
// Function-space norms on C([0,1])
// ---------------------------------------------------------------------------

/** Sample f on [0,1] at n+1 equally spaced nodes; returns {xs, ys}. */
export function sampleFunction(
  f: (x: number) => number,
  n = 200,
): { xs: number[]; ys: number[] } {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    xs.push(x);
    ys.push(f(x));
  }
  return { xs, ys };
}

/**
 * (‖f‖₁, ‖f‖₂, ‖f‖∞) from samples ys on a uniform grid of step dx, via the
 * trapezoidal rule for the integrals. ‖f‖₁ = ∫₀¹|f|, ‖f‖₂ = (∫₀¹ f²)^{1/2},
 * ‖f‖∞ = max|f|.
 */
export function functionNorms(ys: number[], dx: number): {
  l1: number;
  l2: number;
  linf: number;
} {
  const trap = (vals: number[]) => {
    let s = 0;
    for (let i = 0; i < vals.length - 1; i++) s += (vals[i] + vals[i + 1]) / 2;
    return s * dx;
  };
  const l1 = trap(ys.map((y) => Math.abs(y)));
  const l2 = Math.sqrt(trap(ys.map((y) => y * y)));
  const linf = Math.max(...ys.map((y) => Math.abs(y)));
  return { l1, l2, linf };
}

// ---------------------------------------------------------------------------
// Open-set definition: does B(x, r) ⊆ O ?  (O = open disk of radius R0)
// ---------------------------------------------------------------------------

/** Euclidean distance. */
export function dist(a: Pt, b: Pt): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/**
 * For the open disk O = B(center, R0): the open ball B(x, r) is contained in O
 * iff dist(x, center) + r ≤ R0. The largest radius that still fits at x is
 * R0 − dist(x, center) (negative ⟺ x is outside O).
 */
export function maxFittingRadius(x: Pt, center: Pt, R0: number): number {
  return R0 - dist(x, center);
}

export function ballInsideDisk(
  x: Pt,
  r: number,
  center: Pt,
  R0: number,
): boolean {
  return dist(x, center) + r <= R0 + 1e-12;
}

// ---------------------------------------------------------------------------
// Convergent sequences in ℝ² (for the convergence visualisation)
// ---------------------------------------------------------------------------

/**
 * A damped spiral u_n = ℓ + decay^n · (cos nω, sin nω)·scale, n = 0..N.
 * Converges to ℓ since ‖u_n − ℓ‖ = scale·decay^n → 0.
 */
export function spiralSequence(
  N: number,
  ell: Pt,
  decay = 0.78,
  omega = 0.9,
  scale = 3,
): Pt[] {
  const pts: Pt[] = [];
  for (let n = 0; n <= N; n++) {
    const rad = scale * decay ** n;
    pts.push([ell[0] + rad * Math.cos(n * omega), ell[1] + rad * Math.sin(n * omega)]);
  }
  return pts;
}

/** Distances ‖u_n − ℓ‖ for a sequence — the quantity that must tend to 0. */
export function distancesTo(seq: Pt[], ell: Pt): number[] {
  return seq.map((u) => dist(u, ell));
}

/** Smallest index N such that ‖u_n − ℓ‖ < eps for all n ≥ N (−1 if none). */
export function rankForEps(seq: Pt[], ell: Pt, eps: number): number {
  const d = distancesTo(seq, ell);
  for (let N = 0; N < d.length; N++) {
    if (d.slice(N).every((x) => x < eps)) return N;
  }
  return -1;
}
