"use client";

import { Mafs, Coordinates, Plot, Point, Line, Text, Theme } from "mafs";
import type { ScalarField2D } from "@/lib/math/calculus";

/**
 * 2D cross-section view. Fixes y = a_y and plots the curve g(x) = f(x, a_y),
 * its tangent at a_x, and the vertical "error bar" r(h) = g(a_x+h) − tangent —
 * which visibly shrinks faster than h as the zoom tightens around the point.
 */
export function TangentLine2D({
  field,
  a,
  h,
  zoom,
}: {
  field: ScalarField2D;
  a: [number, number];
  h: number;
  zoom: number;
}) {
  const [ax, ay] = a;
  const g = (x: number) => field.value(x, ay);
  const [gx] = field.gradient(ax, ay); // ∂f/∂x at a
  const gAtA = g(ax);
  const tangent = (x: number) => gAtA + gx * (x - ax);

  // Window half-width shrinks with zoom; the curve and its tangent become
  // indistinguishable as you zoom in — the geometric meaning of o(‖h‖).
  const halfX = 2 / zoom;
  const halfY = 2 / zoom;

  const probeX = ax + h;
  const curveY = g(probeX);
  const tanY = tangent(probeX);

  return (
    <Mafs
      viewBox={{ x: [ax - halfX, ax + halfX], y: [gAtA - halfY, gAtA + halfY] }}
      preserveAspectRatio={false}
      height={320}
    >
      <Coordinates.Cartesian
        subdivisions={4}
        xAxis={{ labels: false }}
        yAxis={{ labels: false }}
      />

      {/* the curve g(x) = f(x, a_y) */}
      <Plot.OfX y={g} color={Theme.blue} />

      {/* tangent line at a */}
      <Plot.OfX y={tangent} color={Theme.yellow} style="dashed" />

      {/* base point a */}
      <Point x={ax} y={gAtA} color={Theme.foreground} />

      {/* error bar r(h) = g(a+h) − tangent(a+h) */}
      <Line.Segment
        point1={[probeX, tanY]}
        point2={[probeX, curveY]}
        color={Theme.red}
      />
      <Point x={probeX} y={curveY} color={Theme.blue} />

      <Text x={ax} y={gAtA} attach="sw" size={14} color={Theme.foreground}>
        a
      </Text>
      <Text
        x={probeX}
        y={(tanY + curveY) / 2}
        attach="e"
        size={13}
        color={Theme.red}
      >
        r(h)
      </Text>
    </Mafs>
  );
}
