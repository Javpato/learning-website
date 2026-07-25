"use client";

// Phase-portrait explorer (lessons: systèmes différentiels & hamiltoniens).
// Vector field + nullclines + a movable seed whose trajectory (RK4, forward
// and backward) is drawn live; "Épingler" keeps the current trajectory so a
// full portrait can be built by hand. Presets follow the course and TD 5.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Polyline, Theme, useMovablePoint } from "mafs";
import { throughPoint, type VectorField2 } from "@/lib/math/odes";
import { contourLines } from "@/lib/math/contours";
import { useLocale } from "@/components/learn/useLocale";
import { learnUi } from "@/lib/learn/ui";
import type { Locale } from "@/lib/i18n/config";

const HALF = 2.6;

type Preset = {
  F: VectorField2;
};

const PRESETS: Preset[] = [
  {
    F: (x, y) => [x * (1 - x - y), y * (2 - x - 2 * y)],
  },
  {
    F: (x, y) => [y, -x - x * x * x],
  },
  {
    F: (x, y) => [-(x * (x * x - 1)), -y],
  },
  {
    F: (x, y) => [-2 * x + y, -5 * x - 2 * y],
  },
];

const T: Record<
  Locale,
  {
    presets: [string, string, string, string];
    descriptions: [string, string, string, string];
    groupLabel: string;
    pin: string;
    nullclinesShown: string;
    nullclinesHidden: string;
    hint: string;
  }
> = {
  fr: {
    presets: [
      "Compétition (TD 5.1)",
      "Conservatif x'' = −x − x³",
      "Flot de gradient (double puits)",
      "Spirale stable (linéaire)",
    ],
    descriptions: [
      "x' = x(1−x−y), y' = y(2−x−2y)",
      "x' = y, y' = −x−x³ — H conservée, orbites fermées",
      "X' = −∇V, V = (x²−1)²/4 + y²/2",
      "X' = AX, valeurs propres −2 ± i√5",
    ],
    groupLabel:
      "Explorateur de portrait de phase : champ de vecteurs, isoclines, et trajectoires intégrées passant par un point déplaçable",
    pin: "Épingler la trajectoire",
    nullclinesShown: "Isoclines affichées",
    nullclinesHidden: "Isoclines masquées",
    hint:
      "Orange : isocline x' = 0 (flux vertical) ; violette : y' = 0 (flux horizontal) ; leurs intersections sont les équilibres. Déplace le point jaune, épingle quelques trajectoires et construis le portrait complet. Sur le système conservatif, vérifie que les orbites se referment ; sur le flot de gradient, vers quels équilibres tout converge-t-il ?",
  },
  en: {
    presets: [
      "Competition (TD 5.1)",
      "Conservative x'' = −x − x³",
      "Gradient flow (double well)",
      "Stable spiral (linear)",
    ],
    descriptions: [
      "x' = x(1−x−y), y' = y(2−x−2y)",
      "x' = y, y' = −x−x³ — H conserved, closed orbits",
      "X' = −∇V, V = (x²−1)²/4 + y²/2",
      "X' = AX, eigenvalues −2 ± i√5",
    ],
    groupLabel:
      "Phase-portrait explorer: vector field, nullclines, and integrated trajectories through a movable point",
    pin: "Pin trajectory",
    nullclinesShown: "Nullclines shown",
    nullclinesHidden: "Nullclines hidden",
    hint:
      "Orange: nullcline x' = 0 (vertical flow); violet: y' = 0 (horizontal flow); their intersections are the equilibria. Drag the yellow point, pin a few trajectories and build the full portrait. On the conservative system, check that the orbits close up; on the gradient flow, toward which equilibria does everything converge?",
  },
  es: {
    presets: [
      "Competencia (TD 5.1)",
      "Conservativo x'' = −x − x³",
      "Flujo de gradiente (doble pozo)",
      "Espiral estable (lineal)",
    ],
    descriptions: [
      "x' = x(1−x−y), y' = y(2−x−2y)",
      "x' = y, y' = −x−x³ — H conservada, órbitas cerradas",
      "X' = −∇V, V = (x²−1)²/4 + y²/2",
      "X' = AX, valores propios −2 ± i√5",
    ],
    groupLabel:
      "Explorador de retrato de fase: campo de vectores, isoclinas y trayectorias integradas que pasan por un punto desplazable",
    pin: "Fijar la trayectoria",
    nullclinesShown: "Isoclinas visibles",
    nullclinesHidden: "Isoclinas ocultas",
    hint:
      "Naranja: isoclina x' = 0 (flujo vertical); violeta: y' = 0 (flujo horizontal); sus intersecciones son los equilibrios. Desplaza el punto amarillo, fija algunas trayectorias y construye el retrato completo. En el sistema conservativo, comprueba que las órbitas se cierran; en el flujo de gradiente, ¿hacia qué equilibrios converge todo?",
  },
};

export function PhasePortraitWidget() {
  const locale = useLocale();
  const t = T[locale];
  const ui = learnUi(locale);
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
    <div className="widget-frame" role="group" aria-label={t.groupLabel}>
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
          <button key={i} type="button" className={i === pi ? "btn btn-accent" : "btn"} onClick={() => selectPreset(i)}>
            {t.presets[i]}
          </button>
        ))}
      </div>
      <div className="widget-controls">
        <button type="button" className="btn" onClick={() => setPinned((ps) => [...ps, live])}>
          {t.pin}
        </button>
        <button type="button" className={showNullclines ? "btn btn-accent" : "btn"} onClick={() => setShowNullclines((v) => !v)}>
          {showNullclines ? t.nullclinesShown : t.nullclinesHidden}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setPinned([]);
            seed.setPoint([0.9, 0.9]);
          }}
        >
          {ui.reset}
        </button>
        <span className="widget-readout">{t.descriptions[pi]}</span>
      </div>
      <p className="widget-hint">{t.hint}</p>
    </div>
  );
}
