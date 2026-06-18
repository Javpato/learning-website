/**
 * Minimal dense real-matrix linear algebra for the kernel/image stabilisation
 * demo. Everything the "ker f = ker f² ⟺ im f = im f²" page needs comes from a
 * single reduced row-echelon form: rank, the kernel (null space) basis, and the
 * image (column space) basis. Matrices are row-major `number[][]`.
 */

export type Mat = number[][];
export type Vec = number[];

const EPS = 1e-9;

export function identity(n: number): Mat {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
}

export function matMul(A: Mat, B: Mat): Mat {
  const n = A.length;
  const m = B[0].length;
  const p = B.length;
  const out: Mat = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < p; k++) {
      const aik = A[i][k];
      if (aik === 0) continue;
      for (let j = 0; j < m; j++) out[i][j] += aik * B[k][j];
    }
  }
  return out;
}

export function matVec(A: Mat, v: Vec): Vec {
  return A.map((row) => row.reduce((s, a, j) => s + a * v[j], 0));
}

/** Aᵏ for a square matrix A and integer k ≥ 0 (A⁰ = I). */
export function matPow(A: Mat, k: number): Mat {
  let out = identity(A.length);
  for (let i = 0; i < k; i++) out = matMul(out, A);
  return out;
}

/**
 * Reduced row-echelon form via Gauss–Jordan with partial pivoting.
 * Returns the reduced matrix and the list of pivot column indices.
 */
export function rref(M: Mat): { R: Mat; pivots: number[] } {
  const R = M.map((row) => row.slice());
  const rows = R.length;
  const cols = R[0]?.length ?? 0;
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    // Choose the row with the largest magnitude entry in this column as pivot.
    let piv = -1;
    let best = EPS;
    for (let i = r; i < rows; i++) {
      const v = Math.abs(R[i][c]);
      if (v > best) {
        best = v;
        piv = i;
      }
    }
    if (piv === -1) continue; // no pivot in this column
    [R[r], R[piv]] = [R[piv], R[r]];
    const pv = R[r][c];
    for (let j = 0; j < cols; j++) R[r][j] /= pv;
    for (let i = 0; i < rows; i++) {
      if (i === r) continue;
      const f = R[i][c];
      if (Math.abs(f) > EPS) {
        for (let j = 0; j < cols; j++) R[i][j] -= f * R[r][j];
      }
    }
    pivots.push(c);
    r++;
  }
  return { R, pivots };
}

export function rank(M: Mat): number {
  return rref(M).pivots.length;
}

/** dim ker M = (#columns) − rank M. */
export function nullity(M: Mat): number {
  const cols = M[0]?.length ?? 0;
  return cols - rank(M);
}

/**
 * A basis of ker M (the null space). Free columns each yield one basis vector,
 * read off the reduced row-echelon form.
 */
export function nullSpaceBasis(M: Mat): Vec[] {
  const { R, pivots } = rref(M);
  const cols = M[0]?.length ?? 0;
  const pivotSet = new Set(pivots);
  const basis: Vec[] = [];
  for (let fc = 0; fc < cols; fc++) {
    if (pivotSet.has(fc)) continue;
    const v = new Array(cols).fill(0);
    v[fc] = 1;
    pivots.forEach((pc, i) => {
      v[pc] = -R[i][fc];
    });
    basis.push(v);
  }
  return basis;
}

/** A basis of im M (the column space): the pivot columns of the original M. */
export function columnSpaceBasis(M: Mat): Vec[] {
  const { pivots } = rref(M);
  return pivots.map((c) => M.map((row) => row[c]));
}

/**
 * Whether two subspaces of the SAME chain coincide. For an endomorphism f we
 * always have ker f ⊆ ker f² and im f ⊇ im f², so equality is decided purely by
 * dimension — and, by rank–nullity, both reduce to rank f = rank f². This helper
 * just exposes that fact for the UI.
 */
export function rankNullityVerdict(M: Mat): {
  n: number;
  rank1: number;
  rank2: number;
  dimKer1: number;
  dimKer2: number;
  dimIm1: number;
  dimIm2: number;
  kerEqual: boolean;
  imEqual: boolean;
  stabilised: boolean;
} {
  const n = M.length;
  const M2 = matMul(M, M);
  const rank1 = rank(M);
  const rank2 = rank(M2);
  return {
    n,
    rank1,
    rank2,
    dimKer1: n - rank1,
    dimKer2: n - rank2,
    dimIm1: rank1,
    dimIm2: rank2,
    kerEqual: rank1 === rank2,
    imEqual: rank1 === rank2,
    stabilised: rank1 === rank2,
  };
}
