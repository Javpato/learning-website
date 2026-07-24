"use client";

// Interactive gradient explorer (lesson: dérivées partielles & gradient).
// Level curves of a chosen field, a draggable point a, the gradient ∇f(a),
// and a rotatable unit vector u with the live directional derivative D_u f(a).
// Invitations to explore: find where ∇f vanishes, find the direction where
// D_u f = 0 (tangent to the level curve).

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Polyline, Text, Theme, Vector, useMovablePoint } from "mafs";
import { ScalarField2D } from "@/lib/math/calculus";
import { contourFamily } from "@/lib/math/contours";

const FIELDS: { label: string; expr: string; levels: number[] }[] = [
  {
    label: "x² + y²",
    expr: "x^2 + y^2",
    levels: [0.5, 1, 2, 3.5, 5.5],
  },
  {
    label: "x² − y²",
    expr: "x^2 - y^2",
    levels: [-4, -2, -1, 0, 1, 2, 4],
  },
  {
    label: "x·e^(−x²−y²)",
    expr: "x * exp(-(x^2 + y^2))",
    levels: [-0.35, -0.2, -0.08, 0.08, 0.2, 0.35],
  },
];

const HALF = 2.8;

export function GradientWidget() {
  const [fieldIdx, setFieldIdx] = useState(2);
  const [angleDeg, setAngleDeg] = useState(30);
  const [showU, setShowU] = useState(true);
  const a = useMovablePoint([0.8, 0.5], { color: Theme.yellow });

  const field = useMemo(() => new ScalarField2D(FIELDS[fieldIdx].expr, FIELDS[fieldIdx].label), [fieldIdx]);
  const contours = useMemo(
    () =>
      contourFamily(
        (x, y) => field.value(x, y),
        FIELDS[fieldIdx].levels,
        [-HALF, HALF],
        [-HALF, HALF],
        72,
      ),
    [field, fieldIdx],
  );

  const [ax, ay] = [a.point[0], a.point[1]];
  const [gx, gy] = field.gradient(ax, ay);
  const gnorm = Math.hypot(gx, gy);
  const theta = (angleDeg * Math.PI) / 180;
  const u: [number, number] = [Math.cos(theta), Math.sin(theta)];
  const duf = gx * u[0] + gy * u[1];

  // display scaling so arrows stay readable
  const gScale = gnorm > 0 ? Math.min(1.2, 1.2 / gnorm) * gnorm : 0;
  const gDisp: [number, number] = gnorm > 0 ? [(gx / gnorm) * Math.min(1.6, gnorm), (gy / gnorm) * Math.min(1.6, gnorm)] : [0, 0];

  const reset = () => {
    setFieldIdx(2);
    setAngleDeg(30);
    setShowU(true);
    a.setPoint([0.8, 0.5]);
  };

  return (
    <div className="widget-frame" role="group" aria-label="Explorateur interactif du gradient : lignes de niveau, point déplaçable, vecteur gradient et dérivée directionnelle">
      <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={380} preserveAspectRatio="contain">
        <Coordinates.Cartesian subdivisions={2} />
        {contours.map(({ level, lines }) =>
          lines.map((line, i) => (
            <Polyline key={`${level}-${i}`} points={line} color={Theme.blue} svgPolylineProps={{ opacity: 0.5 }} weight={1.5} />
          )),
        )}
        {gnorm > 1e-9 && (
          <>
            <Vector tail={[ax, ay]} tip={[ax + gDisp[0], ay + gDisp[1]]} color={Theme.green} />
            <Text x={ax + gDisp[0]} y={ay + gDisp[1]} attach="ne" size={14} color={Theme.green}>
              ∇f
            </Text>
          </>
        )}
        {showU && (
          <>
            <Vector tail={[ax, ay]} tip={[ax + u[0], ay + u[1]]} color={Theme.orange} />
            <Text x={ax + u[0]} y={ay + u[1]} attach="se" size={14} color={Theme.orange}>
              u
            </Text>
          </>
        )}
        {a.element}
      </Mafs>

      <div className="widget-controls">
        {FIELDS.map((f, i) => (
          <button key={f.expr} type="button" className={i === fieldIdx ? "btn btn-accent" : "btn"} onClick={() => setFieldIdx(i)}>
            {f.label}
          </button>
        ))}
        <label>
          <span>direction u : {angleDeg}°</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            aria-label="Angle de la direction u en degrés"
          />
        </label>
        <button type="button" className={showU ? "btn btn-accent" : "btn"} onClick={() => setShowU((v) => !v)}>
          {showU ? "u affiché" : "u masqué"}
        </button>
        <button type="button" className="btn" onClick={reset}>
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          a = ({ax.toFixed(2)}, {ay.toFixed(2)}) · ∇f(a) = ({gx.toFixed(2)}, {gy.toFixed(2)}) · ‖∇f‖ = {gnorm.toFixed(2)} · D<sub>u</sub>f = {duf.toFixed(3)}
        </span>
      </div>
      <p className="widget-hint">
        À toi de jouer : déplace le point jaune jusqu&apos;à un endroit où ∇f
        s&apos;annule. Puis tourne u jusqu&apos;à obtenir D<sub>u</sub>f = 0 —
        que remarques-tu par rapport à la ligne de niveau ? Le gradient est-il
        toujours perpendiculaire aux courbes bleues ?
      </p>
    </div>
  );
}
