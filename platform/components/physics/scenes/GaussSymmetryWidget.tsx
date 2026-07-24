"use client";

// Gauss's-theorem explorer (lesson: théorème de Gauss). Left: cross-section
// of the source with an adjustable Gaussian surface (circle/pillbox trace).
// Right: the resulting |E|(r) profile with the current radius marked. The
// three canonical geometries — uniform sphere, infinite line, infinite
// plane — in normalized units (radius or reference length = 1).

import { useState } from "react";
import { Mafs, Coordinates, Circle, Plot, Point, Polyline, Text, Theme } from "mafs";
import { gaussE, type GaussGeometry } from "@/lib/physics/electrostatics";

const HALF = 2.4;

const GEOMS: { key: GaussGeometry; label: string; formulaIn: string; formulaOut: string }[] = [
  { key: "sphere", label: "Sphère uniforme", formulaIn: "E ∝ r (intérieur)", formulaOut: "E ∝ 1/r² (extérieur)" },
  { key: "ligne", label: "Fil infini", formulaIn: "E = λ/(2πε₀r)", formulaOut: "E ∝ 1/r" },
  { key: "plan", label: "Plan infini", formulaIn: "E = σ/(2ε₀)", formulaOut: "E constant" },
];

export function GaussSymmetryWidget() {
  const [gi, setGi] = useState(0);
  const [r, setR] = useState(1.5);
  const geom = GEOMS[gi];

  const E = gaussE(geom.key, r);

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Explorateur du théorème de Gauss : coupe de la source avec surface de Gauss ajustable, et profil du champ E en fonction de r"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={300} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          {geom.key === "sphere" && (
            <>
              <Circle center={[0, 0]} radius={1} color={Theme.red} fillOpacity={0.18} />
              <Circle center={[0, 0]} radius={r} color={Theme.green} fillOpacity={0} strokeStyle="dashed" />
              <Text x={0} y={-1.25} size={12} color={Theme.red}>
                ρ uniforme, R = 1
              </Text>
            </>
          )}
          {geom.key === "ligne" && (
            <>
              <Point x={0} y={0} color={Theme.red} />
              <Text x={0.15} y={0.2} size={12} color={Theme.red}>
                λ (fil ⟂ à l&apos;écran)
              </Text>
              <Circle center={[0, 0]} radius={Math.max(r, 0.05)} color={Theme.green} fillOpacity={0} strokeStyle="dashed" />
            </>
          )}
          {geom.key === "plan" && (
            <>
              <Polyline points={[[0, -HALF], [0, HALF]]} color={Theme.red} weight={3} />
              <Text x={0.15} y={2} size={12} color={Theme.red}>
                σ (plan ⟂ à l&apos;écran)
              </Text>
              <Polyline
                points={[[-r, -0.7], [r, -0.7], [r, 0.7], [-r, 0.7], [-r, -0.7]]}
                color={Theme.green}
                weight={1.6}
              />
            </>
          )}
        </Mafs>
        <Mafs viewBox={{ x: [0, HALF], y: [0, 1.6] }} height={300} preserveAspectRatio={false}>
          <Coordinates.Cartesian subdivisions={2} />
          <Plot.OfX y={(x) => (x > 0.03 ? Math.min(gaussE(geom.key, x), 1.55) : 0)} color={Theme.blue} weight={2.2} />
          <Point x={r} y={Math.min(E, 1.55)} color={Theme.green} />
          <Text x={r} y={Math.min(E, 1.55)} attach="ne" size={12} color={Theme.green}>
            r = {r.toFixed(2)}
          </Text>
        </Mafs>
      </div>

      <div className="widget-controls">
        {GEOMS.map((g, i) => (
          <button key={g.key} type="button" className={i === gi ? "btn btn-accent" : "btn"} onClick={() => setGi(i)}>
            {g.label}
          </button>
        ))}
        <label>
          <span>rayon de Gauss r = {r.toFixed(2)}</span>
          <input
            type="range"
            min={0.05}
            max={2.3}
            step={0.01}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            aria-label="Rayon de la surface de Gauss"
          />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setGi(0);
            setR(1.5);
          }}
        >
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          |E|(r) = {E.toFixed(3)} (unités normalisées) · {r <= 1 || geom.key !== "sphere" ? geom.formulaIn : geom.formulaOut}
        </span>
      </div>
      <p className="widget-hint">
        Avant de bouger le curseur : pour la sphère, où le champ est-il
        maximal ? Fais traverser r = 1 (la surface de la sphère) et observe le
        raccordement continu entre E ∝ r et E ∝ 1/r². Pourquoi le plan
        donne-t-il un champ indépendant de la distance ? (Regarde ce qui
        entre dans le flux… et ce qui n&apos;y entre pas.)
      </p>
    </div>
  );
}
