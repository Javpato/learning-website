"use client";

// Critical-points explorer (lesson: points critiques & extrema). Contour map
// with a movable probe: live gradient and Hessian readout, discriminant
// classification at the probe. The α slider deforms the transition-state
// landscape V = x⁴ − 2x² + y² + αxy (the TD 4 exercise M4.5) so the learner
// sees when critical points move and how the saddle persists.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Point, Polyline, Theme, useMovablePoint } from "mafs";
import { Field2WithHessian, classify, type CriticalKind } from "@/lib/math/extrema";
import { contourFamily } from "@/lib/math/contours";
import { useLocale } from "@/components/learn/useLocale";
import { learnUi } from "@/lib/learn/ui";
import type { Locale } from "@/lib/i18n/config";

const HALF = 2.2;

type Preset = { expr: (alpha: number) => string; usesAlpha: boolean; levels: number[] };

const PRESETS: Preset[] = [
  {
    expr: () => "x^3 - 3*x + y^2",
    usesAlpha: false,
    levels: [-2, -1, 0, 1, 2, 3.5, 5],
  },
  {
    expr: () => "x^2 - y^2",
    usesAlpha: false,
    levels: [-3, -1.5, -0.5, 0, 0.5, 1.5, 3],
  },
  {
    expr: (a) => `x^4 - 2*x^2 + y^2 + ${a.toFixed(2)}*x*y`,
    usesAlpha: true,
    levels: [-0.9, -0.5, -0.2, 0, 0.4, 1, 2, 3.5],
  },
];

// NOTE: CriticalKind values come from lib/math/extrema.ts and are French
// string literals ("selle", "dégénéré") — used here only as lookup keys.
const T: Record<
  Locale,
  {
    presets: [string, string, string];
    groupLabel: string;
    alphaAria: string;
    moveProbe: string;
    kinds: Record<CriticalKind, string>;
    hintA: string;
    hintColon: string;
    hintWith: string;
    hintMin: string;
    hintSaddle: string;
    hintB: string;
  }
> = {
  fr: {
    presets: ["x³ − 3x + y²", "Selle x² − y²", "État de transition x⁴−2x²+y²+αxy"],
    groupLabel:
      "Explorateur de points critiques : carte de niveaux, sonde déplaçable avec gradient et hessienne en direct, et classification par le discriminant",
    alphaAria: "Paramètre de couplage alpha",
    moveProbe: "(déplace la sonde vers ∇f ≈ 0 pour classifier)",
    kinds: { minimum: "minimum", maximum: "maximum", selle: "selle", "dégénéré": "dégénéré" },
    hintA:
      "Les points verts sont les points critiques exacts. Amène la sonde jaune sur chacun et lis le discriminant",
    hintColon: " :",
    hintWith: "avec",
    hintMin: "minimum ;",
    hintSaddle: "col.",
    hintB:
      "Sur le paysage d'état de transition, fais varier α : l'origine reste-t-elle toujours un col ? (Indice : D(0,0) = −8 − α².)",
  },
  en: {
    presets: ["x³ − 3x + y²", "Saddle x² − y²", "Transition state x⁴−2x²+y²+αxy"],
    groupLabel:
      "Critical-points explorer: contour map, movable probe with live gradient and Hessian, and classification by the discriminant",
    alphaAria: "Coupling parameter alpha",
    moveProbe: "(move the probe toward ∇f ≈ 0 to classify)",
    kinds: { minimum: "minimum", maximum: "maximum", selle: "saddle", "dégénéré": "degenerate" },
    hintA:
      "The green dots are the exact critical points. Bring the yellow probe onto each one and read the discriminant",
    hintColon: ":",
    hintWith: "with",
    hintMin: "minimum;",
    hintSaddle: "saddle.",
    hintB:
      "On the transition-state landscape, vary α: does the origin always remain a saddle? (Hint: D(0,0) = −8 − α².)",
  },
  es: {
    presets: ["x³ − 3x + y²", "Silla x² − y²", "Estado de transición x⁴−2x²+y²+αxy"],
    groupLabel:
      "Explorador de puntos críticos: mapa de niveles, sonda desplazable con gradiente y hessiana en directo, y clasificación por el discriminante",
    alphaAria: "Parámetro de acoplamiento alfa",
    moveProbe: "(desplaza la sonda hacia ∇f ≈ 0 para clasificar)",
    kinds: { minimum: "mínimo", maximum: "máximo", selle: "silla", "dégénéré": "degenerado" },
    hintA:
      "Los puntos verdes son los puntos críticos exactos. Lleva la sonda amarilla sobre cada uno y lee el discriminante",
    hintColon: ":",
    hintWith: "con",
    hintMin: "mínimo;",
    hintSaddle: "silla.",
    hintB:
      "En el paisaje de estado de transición, varía α: ¿sigue siendo el origen siempre un punto de silla? (Pista: D(0,0) = −8 − α².)",
  },
};

export function CriticalPointsWidget() {
  const locale = useLocale();
  const t = T[locale];
  const ui = learnUi(locale);
  const [pi, setPi] = useState(2);
  const [alpha, setAlpha] = useState(0.6);
  const probe = useMovablePoint([0.6, 0.4], { color: Theme.yellow });

  const preset = PRESETS[pi];
  const field = useMemo(
    () => new Field2WithHessian(preset.expr(alpha)),
    [preset, alpha],
  );
  const contours = useMemo(
    () => contourFamily((x, y) => field.value(x, y), preset.levels, [-HALF, HALF], [-HALF, HALF], 72),
    [field, preset],
  );

  // Critical points of the transition-state preset (closed form): y = -αx/2,
  // x (4x² − 4 − α²/2) = 0.
  const criticalPoints: Array<[number, number]> = useMemo(() => {
    if (pi !== 2) {
      if (pi === 0) return [[1, 0], [-1, 0]];
      return [[0, 0]];
    }
    const pts: Array<[number, number]> = [[0, 0]];
    const x2 = 1 + (alpha * alpha) / 8;
    const x = Math.sqrt(x2);
    pts.push([x, (-alpha * x) / 2], [-x, (alpha * x) / 2]);
    return pts;
  }, [pi, alpha]);

  const [px, py] = [probe.point[0], probe.point[1]];
  const [gx, gy] = field.gradient(px, py);
  const H = field.hessian(px, py);
  const { D, kind } = classify(H.fxx, H.fxy, H.fyy);
  const gnorm = Math.hypot(gx, gy);
  const atCritical = gnorm < 0.08;

  return (
    <div className="widget-frame" role="group" aria-label={t.groupLabel}>
      <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={360} preserveAspectRatio="contain">
        <Coordinates.Cartesian subdivisions={2} />
        {contours.map(({ level, lines }) =>
          lines.map((line, i) => (
            <Polyline key={`${level}-${i}`} points={line} color={Theme.blue} svgPolylineProps={{ opacity: 0.45 }} weight={1.3} />
          )),
        )}
        {criticalPoints.map(([cx, cy], i) => (
          <Point key={i} x={cx} y={cy} color={Theme.green} />
        ))}
        {probe.element}
      </Mafs>

      <div className="widget-controls">
        {PRESETS.map((p, i) => (
          <button key={i} type="button" className={i === pi ? "btn btn-accent" : "btn"} onClick={() => setPi(i)}>
            {t.presets[i]}
          </button>
        ))}
        {preset.usesAlpha && (
          <label>
            <span>α = {alpha.toFixed(2)}</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.05}
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              aria-label={t.alphaAria}
            />
          </label>
        )}
        <button
          type="button"
          className="btn"
          onClick={() => {
            probe.setPoint([0.6, 0.4]);
            setAlpha(0.6);
          }}
        >
          {ui.reset}
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          ∇f = ({gx.toFixed(2)}, {gy.toFixed(2)}) · H = [{H.fxx.toFixed(2)}, {H.fxy.toFixed(2)}; {H.fxy.toFixed(2)}, {H.fyy.toFixed(2)}] · D = {D.toFixed(2)}
          {atCritical ? ` → ${t.kinds[kind]}` : ` ${t.moveProbe}`}
        </span>
      </div>
      <p className="widget-hint">
        {t.hintA} D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub>²{t.hintColon} D &gt; 0 {t.hintWith} f<sub>xx</sub> &gt; 0 → {t.hintMin} D &lt; 0 → {t.hintSaddle} {t.hintB}
      </p>
    </div>
  );
}
