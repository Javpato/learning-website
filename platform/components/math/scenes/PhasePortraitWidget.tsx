"use client";

// Phase-portrait explorer (lessons: systèmes différentiels & hamiltoniens).
// Vector field + nullclines + a movable seed whose trajectory (RK4, forward
// and backward) is drawn live; "Épingler" keeps the current trajectory so a
// full portrait can be built by hand. Presets follow the course and TD 5.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Polyline, Theme, useMovablePoint } from "mafs";
import { throughPoint, type VectorField2 } from "@/lib/math/odes";
import { contourLines } from "@/lib/math/contours";

const HALF = 2.6;

type Preset = {
  label: string;
  F: VectorField2;
  description: string;
};

const PRESETS: Preset[] = [
  {
    label: "Compétition (TD 5.1)",
    F: (x, y) => [x * (1 - x - y), y * (2 - x - 2 * y)],
    description: "x' = x(1−x−y), y' = y(2−x−2y)",
  },
  {
    label: "Conservatif x'' = −x − x³",
    F: (x, y) => [y, -x - x * x * x],
    description: "x' = y, y' = −x−x³ — H conservée, orbites fermées",
  },
  {
    label: "Flot de gradient (double puits)",
    F: (x, y) => [-(x * (x * x - 1)), -y],
    description: "X' = −∇V, V = (x²−1)²/4 + y²/2",
  },
  {
    label: "Spirale stable (linéaire)",
    F: (x, y) => [-2 * x + y, -5 * x - 2 * y],
    description: "X' = AX, valeurs propres −2 ± i√5",
  },
];

export function PhasePortraitWidget() {
  const [pi, setPi] = useState(0);
  const [showNullclines, setShowNullclines] = useState(true);
  const [pinned, setPinned] = useState<Array<Array<[number, number]>>>([]);
  const seed = useMovablePoint([0.9, 0.9], { color: Theme.yellow });

  const preset = PRESETS[pi];
  const F = preset.F;

  const live = useMemo(
    () => throughPoint(F, seed.point[0], seed.point[1], { h: 0.015, steps: 900, bound: 12 }),
    [F, seed.point],
  );

  const nullclines = useMemo(() => {
    if (!showNullclines) return { fx: [], fy: [] };
    return {
      fx: contourLines((x, y) => F(x, y)[0], 0, [-HALF, HALF], [-HALF, HALF], 64),
      fy: contourLines((x, y) => F(x, y)[1], 0, [-HALF, HALF], [-HALF, HALF], 64),
    };
  }, [F, showNullclines]);

  const selectPreset = (i: number) => {
    setPi(i);
    setPinned([]);
  };

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Explorateur de portrait de phase : champ de vecteurs, isoclines, et trajectoires intégrées passant par un point déplaçable"
    >
      <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={380} preserveAspectRatio="contain">
        <Coordinates.Cartesian subdivisions={2} />
        <Plot.VectorField
          xy={(p) => F(p[0], p[1])}
          step={0.42}
          xyOpacity={(p) => {
            const [u, v] = F(p[0], p[1]);
            return Math.min(0.8, 0.25 + Math.hypot(u, v) / 6);
          }}
          color="var(--mafs-fg, #9aa0a6)"
        />
        {nullclines.fx.map((line, i) => (
          <Polyline key={`nx-${i}`} points={line} color={Theme.orange} svgPolylineProps={{ opacity: 0.7 }} weight={1.4} />
        ))}
        {nullclines.fy.map((line, i) => (
          <Polyline key={`ny-${i}`} points={line} color={Theme.violet} svgPolylineProps={{ opacity: 0.7 }} weight={1.4} />
        ))}
        {pinned.map((line, i) => (
          <Polyline key={`p-${i}`} points={line} color={Theme.blue} svgPolylineProps={{ opacity: 0.8 }} weight={1.6} />
        ))}
        <Polyline points={live} color={Theme.green} weight={2.2} />
        {seed.element}
      </Mafs>

      <div className="widget-controls">
        {PRESETS.map((p, i) => (
          <button key={p.label} type="button" className={i === pi ? "btn btn-accent" : "btn"} onClick={() => selectPreset(i)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="widget-controls">
        <button type="button" className="btn" onClick={() => setPinned((ps) => [...ps, live])}>
          Épingler la trajectoire
        </button>
        <button type="button" className={showNullclines ? "btn btn-accent" : "btn"} onClick={() => setShowNullclines((v) => !v)}>
          Isoclines {showNullclines ? "affichées" : "masquées"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setPinned([]);
            seed.setPoint([0.9, 0.9]);
          }}
        >
          Réinitialiser
        </button>
        <span className="widget-readout">{preset.description}</span>
      </div>
      <p className="widget-hint">
        Orange : isocline x&apos; = 0 (flux vertical) ; violette : y&apos; = 0
        (flux horizontal) ; leurs intersections sont les équilibres. Déplace
        le point jaune, épingle quelques trajectoires et construis le portrait
        complet. Sur le système conservatif, vérifie que les orbites se
        referment ; sur le flot de gradient, vers quels équilibres tout
        converge-t-il ?
      </p>
    </div>
  );
}
