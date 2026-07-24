// Discretized Biot–Savart (μ0/4π = 1) for the 3D widget: current loops and
// straight segments, dB of one element, and the summed field.

export type V3 = [number, number, number];

export function sub(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
export function cross(a: V3, b: V3): V3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
export function norm(a: V3): number {
  return Math.hypot(a[0], a[1], a[2]);
}
export function scale(a: V3, s: number): V3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}
export function add(a: V3, b: V3): V3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export type Wire = { points: V3[] }; // polyline carrying unit current

/** Circular loop of radius R in the z=0 plane, n segments. */
export function loopWire(R: number, n = 64): Wire {
  const pts: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n;
    pts.push([R * Math.cos(t), R * Math.sin(t), 0]);
  }
  return { points: pts };
}

/** Straight wire along z from −L to L, n segments. */
export function straightWire(L: number, n = 64): Wire {
  const pts: V3[] = [];
  for (let i = 0; i <= n; i++) {
    pts.push([0, 0, -L + (2 * L * i) / n]);
  }
  return { points: pts };
}

/** dB contribution of segment i of the wire at observation point r. */
export function dB(wire: Wire, i: number, r: V3): { mid: V3; dl: V3; R: V3; dB: V3 } {
  const a = wire.points[i];
  const b = wire.points[i + 1];
  const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const dl = sub(b, a);
  const R = sub(r, mid);
  const d = Math.max(norm(R), 1e-6);
  return { mid, dl, R, dB: scale(cross(dl, R), 1 / (d * d * d)) };
}

/** Total B at r by summing all elements. */
export function totalB(wire: Wire, r: V3): V3 {
  let B: V3 = [0, 0, 0];
  for (let i = 0; i < wire.points.length - 1; i++) {
    B = add(B, dB(wire, i, r).dB);
  }
  return B;
}
