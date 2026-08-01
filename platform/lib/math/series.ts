// Numerics for the "Analyse & convergence" widgets: partial sums, remainders
// and sup-norms. Pure functions, no React — the scenes only draw what these
// return (same split as lib/math/{contours,odes,extrema}.ts).

export type TermFn = (n: number) => number;

/** S_1 … S_N of ∑ u_n, starting the summation at index `from` (default 1). */
export function partialSums(term: TermFn, N: number, from = 1): number[] {
  const out: number[] = [];
  let s = 0;
  for (let n = from; n < from + N; n++) {
    s += term(n);
    out.push(s);
  }
  return out;
}

/**
 * Largest |g| on [a, b], found on a uniform grid, together with the point
 * where it is attained. Used both for the uniform norm ‖f_n − f‖∞ and for the
 * "witness point" x_n that disproves uniform convergence.
 */
export function supNormOn(
  g: (x: number) => number,
  a: number,
  b: number,
  samples = 600,
): { sup: number; arg: number } {
  let sup = -Infinity;
  let arg = a;
  for (let i = 0; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples;
    const v = Math.abs(g(x));
    if (Number.isFinite(v) && v > sup) {
      sup = v;
      arg = x;
    }
  }
  return { sup: sup === -Infinity ? 0 : sup, arg };
}

/** ∫_a^b g, by the trapezoidal rule — the "area" column of a bump table. */
export function integrateOn(
  g: (x: number) => number,
  a: number,
  b: number,
  samples = 800,
): number {
  const h = (b - a) / samples;
  let s = 0;
  for (let i = 0; i <= samples; i++) {
    const v = g(a + i * h);
    s += (i === 0 || i === samples ? 0.5 : 1) * (Number.isFinite(v) ? v : 0);
  }
  return s * h;
}

/** Partial sum of a series of functions, x ↦ ∑_{k=from}^{N} u_k(x). */
export function functionPartialSum(
  term: (k: number, x: number) => number,
  N: number,
  from = 1,
): (x: number) => number {
  return (x: number) => {
    let s = 0;
    for (let k = from; k <= N; k++) s += term(k, x);
    return s;
  };
}
