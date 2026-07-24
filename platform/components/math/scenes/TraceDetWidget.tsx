"use client";

// Trace–determinant plane explorer (lesson: systèmes linéaires & similitude).
// Drag the (τ, Δ) point: the classification, the eigenvalues, and a live
// mini phase portrait of a matrix realizing those invariants all update.
// The dashed parabola Δ = τ²/4 separates nodes from spirals.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Polyline, Text, Theme, useMovablePoint } from "mafs";
import { classifyTraceDet, eigen2x2, matrixFromTraceDet } from "@/lib/math/linearSystems";
import { throughPoint } from "@/lib/math/odes";

const T_HALF = 4;
const D_HALF = 4;
const MINI = 2.2;

const SEEDS: Array<[number, number]> = [
  [1.4, 0.4],
  [-1.2, 0.9],
  [0.5, -1.5],
  [-0.4, -0.8],
  [1.8, 1.8],
  [-1.9, -1.6],
];

export function TraceDetWidget() {
  const td = useMovablePoint([-1, 2], { color: Theme.yellow });
  const [tau, det] = [td.point[0], td.point[1]];

  const kind = classifyTraceDet(tau, det);
  const A = useMemo(() => matrixFromTraceDet(tau, det), [tau, det]);
  const eig = eigen2x2(A[0][0], A[0][1], A[1][0], A[1][1]);

  const trajectories = useMemo(() => {
    const F = (x: number, y: number): [number, number] => [
      A[0][0] * x + A[0][1] * y,
      A[1][0] * x + A[1][1] * y,
    ];
    return SEEDS.map((s) => throughPoint(F, s[0], s[1], { h: 0.02, steps: 400, bound: 10 }));
  }, [A]);

  const eigStr =
    eig.im1 === 0
      ? `λ = ${eig.re1.toFixed(2)}, ${eig.re2.toFixed(2)}`
      : `λ = ${eig.re1.toFixed(2)} ± ${Math.abs(eig.im1).toFixed(2)}i`;

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Plan trace–déterminant : point (τ, Δ) déplaçable, classification du portrait de phase, valeurs propres et mini-portrait en direct"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Mafs viewBox={{ x: [-T_HALF, T_HALF], y: [-D_HALF, D_HALF] }} height={320} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          <Plot.OfX y={(t) => (t * t) / 4} color={Theme.orange} style="dashed" />
          <Text x={2.4} y={3.4} size={12} color={Theme.orange}>
            Δ = τ²/4
          </Text>
          <Text x={2.8} y={-3.2} size={12} color={Theme.red}>
            Δ &lt; 0 : selles
          </Text>
          {td.element}
        </Mafs>
        <Mafs viewBox={{ x: [-MINI, MINI], y: [-MINI, MINI] }} height={320} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          {trajectories.map((line, i) => (
            <Polyline key={i} points={line} color={Theme.blue} svgPolylineProps={{ opacity: 0.8 }} weight={1.6} />
          ))}
        </Mafs>
      </div>

      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          τ = {tau.toFixed(2)} · Δ = {det.toFixed(2)} · {eigStr} · <strong>{kind}</strong>
        </span>
        <button type="button" className="btn" onClick={() => td.setPoint([-1, 2])}>
          Réinitialiser
        </button>
      </div>
      <p className="widget-hint">
        Prédis avant de bouger : que se passe-t-il en traversant l&apos;axe
        Δ = 0 ? Et en traversant la parabole pointillée ? Trouve la zone des
        centres (τ = 0, Δ &gt; 0), puis vérifie avec les valeurs propres :
        stables si Re λ &lt; 0, tournoyantes si λ est complexe.
      </p>
    </div>
  );
}
