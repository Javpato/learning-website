"use client";

// Dipole-in-a-uniform-field explorer (lesson: dipôle électrique). Left: the
// dipole arrow at angle θ inside uniform E field lines, with the torque
// indicated. Right: the energy curve U(θ) = −pE cos θ with the current angle
// marked. Stable/unstable equilibria become obvious.

import { useState } from "react";
import { Mafs, Coordinates, Plot, Point, Polyline, Text, Theme, Vector } from "mafs";
import { energy, torque } from "@/lib/physics/dipole";

const HALF = 1.6;

export function DipoleTorqueWidget() {
  const [thetaDeg, setThetaDeg] = useState(60);
  const [pE, setPE] = useState(1);

  const th = (thetaDeg * Math.PI) / 180;
  const U = energy(1, pE, th);
  const tq = torque(1, pE, th);

  const tip: [number, number] = [0.9 * Math.cos(th), 0.9 * Math.sin(th)];

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Dipôle dans un champ uniforme : orientation réglable, couple affiché, et courbe d'énergie U(θ) avec l'angle courant marqué"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={300} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          {[-1.2, -0.6, 0, 0.6, 1.2].map((y) => (
            <Vector key={y} tail={[-1.5, y]} tip={[1.5, y]} color={Theme.blue} opacity={0.35} />
          ))}
          <Text x={1.35} y={1.35} size={13} color={Theme.blue}>
            E
          </Text>
          <Vector tail={[-tip[0], -tip[1]]} tip={tip} color={Theme.orange} weight={3} />
          <Point x={tip[0]} y={tip[1]} color={Theme.red} />
          <Point x={-tip[0]} y={-tip[1]} color={Theme.blue} />
          <Text x={tip[0]} y={tip[1]} attach="ne" size={13} color={Theme.red}>
            +q
          </Text>
          <Text x={-tip[0]} y={-tip[1]} attach="sw" size={13} color={Theme.blue}>
            −q
          </Text>
        </Mafs>
        <Mafs viewBox={{ x: [0, 2 * Math.PI], y: [-1.4 * pE - 0.2, 1.4 * pE + 0.2] }} height={300} preserveAspectRatio={false}>
          <Coordinates.Cartesian
            subdivisions={2}
            xAxis={{ labels: () => "" }}
          />
          <Plot.OfX y={(t) => energy(1, pE, t)} color={Theme.green} weight={2} />
          <Point x={((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)} y={U} color={Theme.yellow} />
          <Text x={Math.PI} y={1.15 * pE} size={12} color={Theme.foreground}>
            U(θ) = −pE cos θ · max en θ = π
          </Text>
        </Mafs>
      </div>

      <div className="widget-controls">
        <label>
          <span>θ = {thetaDeg}°</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={thetaDeg}
            onChange={(e) => setThetaDeg(Number(e.target.value))}
            aria-label="Angle du dipôle par rapport au champ, en degrés"
          />
        </label>
        <label>
          <span>pE = {pE.toFixed(1)}</span>
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.1}
            value={pE}
            onChange={(e) => setPE(Number(e.target.value))}
            aria-label="Produit pE, intensité du couplage"
          />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setThetaDeg(60);
            setPE(1);
          }}
        >
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          U = −pE cos θ = {U.toFixed(3)} · τ_z = −pE sin θ = {tq.toFixed(3)}
          {Math.abs(Math.sin(th)) < 0.03
            ? Math.cos(th) > 0
              ? " · équilibre STABLE (θ = 0)"
              : " · équilibre INSTABLE (θ = π)"
            : ""}
        </span>
      </div>
      <p className="widget-hint">
        Prédis d&apos;abord : vers où le couple fait-il tourner le dipôle
        quand θ = 90° ? Amène θ en 0 puis en 180° : les deux sont des
        équilibres (τ = 0), mais l&apos;énergie dit lequel est stable.
        Compare la courbure de U(θ) autour de chacun — c&apos;est elle qui
        donne la fréquence des petites oscillations ω = √(pE/I).
      </p>
    </div>
  );
}
