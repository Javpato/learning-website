"use client";

// Multipole far-field explorer (lesson: développement multipolaire).
// Log-log plot of |V(z)| on the axis: exact potential vs the truncated
// expansions (monopole, +dipole, +quadrupole). The slope of the line reads
// the decay law directly: −1 (monopôle), −2 (dipôle), −3 (quadrupôle).

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Text, Theme } from "mafs";
import { AXIAL_CONFIGS, exactV, truncatedV, moments } from "@/lib/physics/multipole";

// axes: X = log10(z), Y = log10|V|
const X_MIN = 0; // z = 1
const X_MAX = 1.6; // z ≈ 40
const Y_MIN = -6;
const Y_MAX = 1;

export function MultipoleFarFieldWidget() {
  const [ci, setCi] = useState(2);
  const [order, setOrder] = useState<0 | 1 | 2>(0);
  const cfg = AXIAL_CONFIGS[ci];
  const m = useMemo(() => moments(cfg), [cfg]);

  const logExact = (X: number) => {
    const z = Math.pow(10, X);
    const v = Math.abs(exactV(cfg, z));
    return v > 0 ? Math.max(Math.log10(v), Y_MIN) : Y_MIN;
  };
  const logTrunc = (X: number) => {
    const z = Math.pow(10, X);
    const v = Math.abs(truncatedV(cfg, z, order));
    return v > 1e-12 ? Math.max(Math.log10(v), Y_MIN) : Y_MIN;
  };

  const orderLabel = ["monopôle seul", "monopôle + dipôle", "jusqu'au quadrupôle"][order];

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Champ lointain multipolaire : potentiel exact sur l'axe contre développements tronqués, en échelle log-log où la pente lit la loi de décroissance"
    >
      <Mafs viewBox={{ x: [X_MIN, X_MAX], y: [Y_MIN, Y_MAX] }} height={340} preserveAspectRatio={false}>
        <Coordinates.Cartesian
          xAxis={{ labels: (x) => (Number.isInteger(x) ? `10^${x}` : "") }}
          yAxis={{ labels: (y) => (Number.isInteger(y) && y % 2 === 0 ? `10^${y}` : "") }}
        />
        <Plot.OfX y={logExact} color={Theme.foreground} weight={2.4} />
        <Plot.OfX y={logTrunc} color={Theme.orange} weight={2} style="dashed" />
        <Text x={0.35} y={Y_MAX - 0.5} size={13} color={Theme.foreground}>
          |V| exact (trait plein)
        </Text>
        <Text x={0.35} y={Y_MAX - 1.2} size={13} color={Theme.orange}>
          tronqué : {orderLabel}
        </Text>
      </Mafs>

      <div className="widget-controls">
        {AXIAL_CONFIGS.map((c, i) => (
          <button key={c.label} type="button" className={i === ci ? "btn btn-accent" : "btn"} onClick={() => setCi(i)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="widget-controls">
        {(["monopôle", "+ dipôle", "+ quadrupôle"] as const).map((lbl, i) => (
          <button key={lbl} type="button" className={order === i ? "btn btn-accent" : "btn"} onClick={() => setOrder(i as 0 | 1 | 2)}>
            {lbl}
          </button>
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => {
            setCi(2);
            setOrder(0);
          }}
        >
          Réinitialiser
        </button>
        <span className="widget-readout">
          Q = {m.Q} · p_z = {m.p.toFixed(2)} · terme dominant : {cfg.leading}
        </span>
      </div>
      <p className="widget-hint">
        Lis la pente de la droite exacte à grand z : −1 pour un ion, −2 pour
        un dipôle, −3 pour le quadrupôle linéaire — chaque moment nul fait
        chuter le potentiel d&apos;une puissance de plus. Ajoute les termes du
        développement un à un et regarde la courbe pointillée « recoller »
        à l&apos;exacte de plus en plus tôt.
      </p>
    </div>
  );
}
