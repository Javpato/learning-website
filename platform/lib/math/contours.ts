// Marching-squares contour extraction for the interactive scenes (level
// curves, equipotential lines). Pure math — no rendering here.

export type Polyline = Array<[number, number]>;

type Grid = {
  nx: number;
  ny: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  v: Float64Array; // row-major [j * nx + i]
};

function sampleGrid(
  f: (x: number, y: number) => number,
  xRange: [number, number],
  yRange: [number, number],
  n: number,
): Grid {
  const nx = n;
  const ny = n;
  const dx = (xRange[1] - xRange[0]) / (nx - 1);
  const dy = (yRange[1] - yRange[0]) / (ny - 1);
  const v = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const val = f(xRange[0] + i * dx, yRange[0] + j * dy);
      v[j * nx + i] = Number.isFinite(val) ? val : NaN;
    }
  }
  return { nx, ny, x0: xRange[0], y0: yRange[0], dx, dy, v };
}

// Key an endpoint for chaining (quantized to dodge float noise).
function key(p: [number, number]): string {
  return `${Math.round(p[0] * 1e6)},${Math.round(p[1] * 1e6)}`;
}

/** Chain raw segments into polylines to keep the SVG element count low. */
function chainSegments(segments: Array<[[number, number], [number, number]]>): Polyline[] {
  const byEnd = new Map<string, number[]>(); // endpoint key -> segment indices
  segments.forEach((s, i) => {
    for (const p of s) {
      const k = key(p);
      const arr = byEnd.get(k);
      if (arr) arr.push(i);
      else byEnd.set(k, [i]);
    }
  });

  const used = new Array(segments.length).fill(false);
  const lines: Polyline[] = [];

  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const line: Polyline = [segments[i][0], segments[i][1]];

    // extend forward then backward
    for (const dir of [1, -1] as const) {
      let cur = dir === 1 ? line[line.length - 1] : line[0];
      for (;;) {
        const candidates = byEnd.get(key(cur)) ?? [];
        const nextIdx = candidates.find((c) => !used[c]);
        if (nextIdx === undefined) break;
        used[nextIdx] = true;
        const [a, b] = segments[nextIdx];
        const next = key(a) === key(cur) ? b : a;
        if (dir === 1) line.push(next);
        else line.unshift(next);
        cur = next;
      }
    }
    lines.push(line);
  }
  return lines;
}

/**
 * Contour polylines of f at the given level over the rectangle
 * xRange × yRange. `n` is the sampling resolution per axis.
 */
export function contourLines(
  f: (x: number, y: number) => number,
  level: number,
  xRange: [number, number],
  yRange: [number, number],
  n = 64,
): Polyline[] {
  const g = sampleGrid(f, xRange, yRange, n);
  const segs: Array<[[number, number], [number, number]]> = [];

  const lerp = (
    xa: number,
    ya: number,
    va: number,
    xb: number,
    yb: number,
    vb: number,
  ): [number, number] => {
    const t = vb === va ? 0.5 : (level - va) / (vb - va);
    return [xa + t * (xb - xa), ya + t * (yb - ya)];
  };

  for (let j = 0; j < g.ny - 1; j++) {
    for (let i = 0; i < g.nx - 1; i++) {
      const x = g.x0 + i * g.dx;
      const y = g.y0 + j * g.dy;
      const v00 = g.v[j * g.nx + i];
      const v10 = g.v[j * g.nx + i + 1];
      const v01 = g.v[(j + 1) * g.nx + i];
      const v11 = g.v[(j + 1) * g.nx + i + 1];
      if ([v00, v10, v01, v11].some((v) => Number.isNaN(v))) continue;

      let idx = 0;
      if (v00 > level) idx |= 1;
      if (v10 > level) idx |= 2;
      if (v11 > level) idx |= 4;
      if (v01 > level) idx |= 8;
      if (idx === 0 || idx === 15) continue;

      // edge interpolation points
      const bottom = () => lerp(x, y, v00, x + g.dx, y, v10);
      const right = () => lerp(x + g.dx, y, v10, x + g.dx, y + g.dy, v11);
      const top = () => lerp(x, y + g.dy, v01, x + g.dx, y + g.dy, v11);
      const left = () => lerp(x, y, v00, x, y + g.dy, v01);

      const push = (a: [number, number], b: [number, number]) => segs.push([a, b]);

      switch (idx) {
        case 1:
        case 14:
          push(left(), bottom());
          break;
        case 2:
        case 13:
          push(bottom(), right());
          break;
        case 3:
        case 12:
          push(left(), right());
          break;
        case 4:
        case 11:
          push(right(), top());
          break;
        case 5: {
          // ambiguous saddle — resolve with the cell-centre value
          const centre = (v00 + v10 + v01 + v11) / 4;
          if (centre > level) {
            push(left(), top());
            push(bottom(), right());
          } else {
            push(left(), bottom());
            push(right(), top());
          }
          break;
        }
        case 10: {
          const centre = (v00 + v10 + v01 + v11) / 4;
          if (centre > level) {
            push(left(), bottom());
            push(right(), top());
          } else {
            push(left(), top());
            push(bottom(), right());
          }
          break;
        }
        case 6:
        case 9:
          push(bottom(), top());
          break;
        case 7:
        case 8:
          push(left(), top());
          break;
      }
    }
  }

  return chainSegments(segs);
}

/** Contours at several levels: returns { level, lines } for each level. */
export function contourFamily(
  f: (x: number, y: number) => number,
  levels: number[],
  xRange: [number, number],
  yRange: [number, number],
  n = 64,
): Array<{ level: number; lines: Polyline[] }> {
  return levels.map((level) => ({ level, lines: contourLines(f, level, xRange, yRange, n) }));
}
