"use client";

import { Mafs, Coordinates, Plot, Point, Line, Vector, Text, Theme } from "mafs";

/**
 * Small inline figures that accompany the three proof steps on the
 * differentiability page (uniqueness, continuity, partial derivatives).
 * Static and lightweight — the big interactive scene is DiffWidget.
 */
export function DiffProofFigure({
  which,
}: {
  which: "unicite" | "continue" | "partielles";
}) {
  if (which === "unicite") {
    const g = (x: number) => x * x; // f near a=0, derivative 0
    const trueT = (_x: number) => 0; // correct linear part: slope 0
    const wrongT = (x: number) => 0.6 * x; // a wrong candidate
    return (
      <figure className="my-3">
        <Mafs viewBox={{ x: [-0.6, 0.6], y: [-0.15, 0.4] }} preserveAspectRatio={false} height={170}>
          <Coordinates.Cartesian subdivisions={false} xAxis={{ labels: false }} yAxis={{ labels: false }} />
          <Plot.OfX y={g} color={Theme.blue} />
          <Plot.OfX y={trueT} color={Theme.green} style="dashed" />
          <Plot.OfX y={wrongT} color={Theme.red} style="dashed" />
          <Point x={0} y={0} color={Theme.foreground} />
        </Mafs>
        <figcaption className="mt-1 text-xs text-fg-dim">
          Bleu : <em>f</em>. Vert : la vraie partie linéaire (pente 0), qui colle à la courbe —
          l&apos;erreur est <em>o(‖h‖)</em>. Rouge : un mauvais candidat, dont l&apos;écart croît
          linéairement. Une seule pente convient : la différentielle est unique.
        </figcaption>
      </figure>
    );
  }

  if (which === "continue") {
    const f = (x: number) => 0.6 * x * x + 0.15;
    const a = 0;
    const h = 0.45;
    return (
      <figure className="my-3">
        <Mafs viewBox={{ x: [-0.6, 0.6], y: [-0.05, 0.5] }} preserveAspectRatio={false} height={170}>
          <Coordinates.Cartesian subdivisions={false} xAxis={{ labels: false }} yAxis={{ labels: false }} />
          <Plot.OfX y={f} color={Theme.blue} />
          {/* the gap |f(a+h) − f(a)| shrinks as h → 0 */}
          <Line.Segment point1={[h, f(a)]} point2={[h, f(h)]} color={Theme.red} />
          <Line.Segment point1={[a, f(a)]} point2={[h, f(a)]} color={Theme.foreground} opacity={0.3} />
          <Point x={a} y={f(a)} color={Theme.green} />
          <Point x={h} y={f(h)} color={Theme.blue} />
          <Text x={h} y={(f(a) + f(h)) / 2} attach="e" size={12} color={Theme.red}>
            ‖f(a+h)−f(a)‖
          </Text>
        </Mafs>
        <figcaption className="mt-1 text-xs text-fg-dim">
          Quand <em>h → 0</em>, le point <em>(a+h, f(a+h))</em> rejoint <em>(a, f(a))</em> : l&apos;écart
          rouge tend vers 0. Différentiable entraîne continue.
        </figcaption>
      </figure>
    );
  }

  // partielles
  const a: [number, number] = [0, 0];
  const grad: [number, number] = [1, 0.6];
  return (
    <figure className="my-3">
      <Mafs viewBox={{ x: [-0.4, 1.6], y: [-0.4, 1.3] }} height={190}>
        <Coordinates.Cartesian subdivisions={false} />
        {/* axis directions e1, e2 — they read off the two partial derivatives */}
        <Vector tip={[1, 0]} tail={a} color={Theme.foreground} />
        <Vector tip={[0, 1]} tail={a} color={Theme.foreground} />
        {/* the gradient ∇f(a) = (∂f/∂x, ∂f/∂y) */}
        <Vector tip={grad} tail={a} color={Theme.yellow} />
        <Point x={a[0]} y={a[1]} color={Theme.green} />
        <Text x={1} y={0} attach="s" size={12} color={Theme.foreground}>e₁</Text>
        <Text x={0} y={1} attach="w" size={12} color={Theme.foreground}>e₂</Text>
        <Text x={grad[0]} y={grad[1]} attach="ne" size={12} color={Theme.yellow}>∇f(a)</Text>
      </Mafs>
      <figcaption className="mt-1 text-xs text-fg-dim">
        Le long de <em>e₁</em> et <em>e₂</em>, la différentielle donne les dérivées partielles
        <em> ∂f/∂x</em> et <em>∂f/∂y</em> ; assemblées, elles forment le gradient <em>∇f(a)</em>,
        et <em>df_a(h) = ∇f(a)·h</em>.
      </figcaption>
    </figure>
  );
}
