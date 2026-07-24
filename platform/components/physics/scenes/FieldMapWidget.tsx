"use client";

// Electric field-map explorer (lessons: Coulomb, potentiel, multipôles).
// Preset charge configurations, the superposed E field as a vector field, a
// movable probe reading E and V, and optional equipotential lines to see the
// orthogonality field ⟂ équipotentielles. k = 1 units — the point is the
// structure, not the numbers.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Point, Polyline, Text, Theme, useMovablePoint } from "mafs";
import { CHARGE_PRESETS, eField, potential } from "@/lib/physics/electrostatics";
import { contourFamily } from "@/lib/math/contours";

const HALF = 2.4;
const V_LEVELS = [-3, -1.8, -1, -0.5, -0.2, 0.2, 0.5, 1, 1.8, 3];

export function FieldMapWidget({ preset = 1, showEquipotentials = false }: { preset?: number; showEquipotentials?: boolean }) {
  const [pi, setPi] = useState(preset);
  const [equi, setEqui] = useState(showEquipotentials);
  const probe = useMovablePoint([1.2, 0.8], { color: Theme.yellow });

  const charges = CHARGE_PRESETS[pi].charges;

  const equipotentials = useMemo(() => {
    if (!equi) return [];
    return contourFamily((x, y) => potential(charges, x, y), V_LEVELS, [-HALF, HALF], [-HALF, HALF], 72);
  }, [charges, equi]);

  const [px, py] = [probe.point[0], probe.point[1]];
  const [ex, ey] = eField(charges, px, py);
  const eNorm = Math.hypot(ex, ey);
  const v = potential(charges, px, py);
  const eDisp: [number, number] =
    eNorm > 1e-9 ? [(ex / eNorm) * Math.min(1.1, eNorm), (ey / eNorm) * Math.min(1.1, eNorm)] : [0, 0];

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Carte de champ électrique : configurations de charges prédéfinies, champ de vecteurs E, sonde déplaçable lisant E et V, équipotentielles optionnelles"
    >
      <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={380} preserveAspectRatio="contain">
        <Coordinates.Cartesian subdivisions={2} />
        <Plot.VectorField
          xy={(p) => {
            const [Ex, Ey] = eField(charges, p[0], p[1]);
            const n = Math.hypot(Ex, Ey);
            if (n < 1e-9) return [0, 0];
            // log-compressed length so near-charge arrows don't explode
            const s = Math.min(0.9, 0.28 * Math.log10(1 + 12 * n));
            return [(Ex / n) * s, (Ey / n) * s];
          }}
          step={0.4}
          xyOpacity={(p) => {
            const [Ex, Ey] = eField(charges, p[0], p[1]);
            return Math.min(0.85, 0.3 + Math.hypot(Ex, Ey) / 4);
          }}
          color="var(--mafs-fg, #9aa0a6)"
        />
        {equipotentials.map(({ level, lines }) =>
          lines.map((line, i) => (
            <Polyline
              key={`${level}-${i}`}
              points={line}
              color={level > 0 ? Theme.orange : Theme.violet}
              svgPolylineProps={{ opacity: 0.65 }}
              weight={1.3}
            />
          )),
        )}
        {charges.map((c, i) => (
          <Point key={`c-${i}`} x={c.x} y={c.y} color={c.q > 0 ? Theme.red : Theme.blue} />
        ))}
        {charges.map((c, i) => (
          <Text key={`t-${i}`} x={c.x} y={c.y} attach="n" size={13} color={c.q > 0 ? Theme.red : Theme.blue}>
            {c.q > 0 ? (c.q > 1 ? `+${c.q}q` : "+q") : c.q < -1 ? `${c.q}q` : "−q"}
          </Text>
        ))}
        {eNorm > 1e-9 && (
          <>
            <Polyline points={[[px, py], [px + eDisp[0], py + eDisp[1]]]} color={Theme.green} weight={2.4} />
            <Text x={px + eDisp[0]} y={py + eDisp[1]} attach="ne" size={13} color={Theme.green}>
              E
            </Text>
          </>
        )}
        {probe.element}
      </Mafs>

      <div className="widget-controls">
        {CHARGE_PRESETS.map((p, i) => (
          <button key={p.label} type="button" className={i === pi ? "btn btn-accent" : "btn"} onClick={() => setPi(i)}>
            {p.label}
          </button>
        ))}
        <button type="button" className={equi ? "btn btn-accent" : "btn"} onClick={() => setEqui((v2) => !v2)}>
          Équipotentielles {equi ? "✓" : ""}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setPi(preset);
            setEqui(showEquipotentials);
            probe.setPoint([1.2, 0.8]);
          }}
        >
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          sonde ({px.toFixed(2)}, {py.toFixed(2)}) · ‖E‖ = {eNorm.toFixed(2)} · V = {v.toFixed(2)} (k = 1)
        </span>
      </div>
      <p className="widget-hint">
        Prédis avant d&apos;afficher les équipotentielles : à quoi
        ressemblent-elles pour le dipôle ? Vérifie ensuite qu&apos;elles
        coupent toujours le champ à angle droit, et que E pointe des
        potentiels hauts (orange) vers les bas (violet). Sur le quadrupôle,
        éloigne la sonde : à quelle vitesse ‖E‖ décroît-il comparé au dipôle ?
      </p>
    </div>
  );
}
