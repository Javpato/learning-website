"use client";

// Trace–determinant plane explorer (lesson: systèmes linéaires & similitude).
// Drag the (τ, Δ) point: the classification, the eigenvalues, and a live
// mini phase portrait of a matrix realizing those invariants all update.
// The dashed parabola Δ = τ²/4 separates nodes from spirals.

import { useMemo } from "react";
import { Mafs, Coordinates, Plot, Polyline, Text, Theme, useMovablePoint } from "mafs";
import { classifyTraceDet, eigen2x2, matrixFromTraceDet, type PortraitKind } from "@/lib/math/linearSystems";
import { throughPoint } from "@/lib/math/odes";
import { useLocale } from "@/components/learn/useLocale";
import { learnUi } from "@/lib/learn/ui";
import type { Locale } from "@/lib/i18n/config";

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

// NOTE: PortraitKind values come from lib/math/linearSystems.ts and are French
// string literals ("selle", "nœud stable", …) — used here only as lookup keys.
const T: Record<
  Locale,
  {
    groupLabel: string;
    saddleRegion: string;
    kinds: Record<PortraitKind, string>;
    hint: string;
  }
> = {
  fr: {
    groupLabel:
      "Plan trace–déterminant : point (τ, Δ) déplaçable, classification du portrait de phase, valeurs propres et mini-portrait en direct",
    saddleRegion: "Δ < 0 : selles",
    kinds: {
      selle: "selle",
      "nœud stable": "nœud stable",
      "nœud instable": "nœud instable",
      "spirale stable": "spirale stable",
      "spirale instable": "spirale instable",
      centre: "centre",
      "dégénéré": "dégénéré",
    },
    hint:
      "Prédis avant de bouger : que se passe-t-il en traversant l'axe Δ = 0 ? Et en traversant la parabole pointillée ? Trouve la zone des centres (τ = 0, Δ > 0), puis vérifie avec les valeurs propres : stables si Re λ < 0, tournoyantes si λ est complexe.",
  },
  en: {
    groupLabel:
      "Trace–determinant plane: movable (τ, Δ) point, phase-portrait classification, eigenvalues and live mini portrait",
    saddleRegion: "Δ < 0: saddles",
    kinds: {
      selle: "saddle",
      "nœud stable": "stable node",
      "nœud instable": "unstable node",
      "spirale stable": "stable spiral",
      "spirale instable": "unstable spiral",
      centre: "center",
      "dégénéré": "degenerate",
    },
    hint:
      "Predict before moving: what happens when you cross the axis Δ = 0? And when you cross the dashed parabola? Find the region of centers (τ = 0, Δ > 0), then check with the eigenvalues: stable if Re λ < 0, spiraling if λ is complex.",
  },
  es: {
    groupLabel:
      "Plano traza–determinante: punto (τ, Δ) desplazable, clasificación del retrato de fase, valores propios y mini-retrato en directo",
    saddleRegion: "Δ < 0: sillas",
    kinds: {
      selle: "silla",
      "nœud stable": "nodo estable",
      "nœud instable": "nodo inestable",
      "spirale stable": "espiral estable",
      "spirale instable": "espiral inestable",
      centre: "centro",
      "dégénéré": "degenerado",
    },
    hint:
      "Predice antes de mover: ¿qué ocurre al cruzar el eje Δ = 0? ¿Y al cruzar la parábola punteada? Encuentra la zona de los centros (τ = 0, Δ > 0), y comprueba con los valores propios: estables si Re λ < 0, giratorias si λ es complejo.",
  },
};

export function TraceDetWidget() {
  const locale = useLocale();
  const t = T[locale];
  const ui = learnUi(locale);
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
    <div className="widget-frame" role="group" aria-label={t.groupLabel}>
      <div className="grid gap-2 md:grid-cols-2">
        <Mafs viewBox={{ x: [-T_HALF, T_HALF], y: [-D_HALF, D_HALF] }} height={320} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          <Plot.OfX y={(t2) => (t2 * t2) / 4} color={Theme.orange} style="dashed" />
          <Text x={2.4} y={3.4} size={12} color={Theme.orange}>
            Δ = τ²/4
          </Text>
          <Text x={2.8} y={-3.2} size={12} color={Theme.red}>
            {t.saddleRegion}
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
          τ = {tau.toFixed(2)} · Δ = {det.toFixed(2)} · {eigStr} · <strong>{t.kinds[kind]}</strong>
        </span>
        <button type="button" className="btn" onClick={() => td.setPoint([-1, 2])}>
          {ui.reset}
        </button>
      </div>
      <p className="widget-hint">{t.hint}</p>
    </div>
  );
}
