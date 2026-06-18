"use client";

import { useState } from "react";
import { Mafs, Coordinates, Polygon, Theme, useMovablePoint } from "mafs";
import { pNorm, unitBallPolygon } from "@/lib/math/topology";

/**
 * The unit ball {‖v‖_p ≤ 1} in ℝ², with p adjustable from 1 (diamond) through
 * 2 (disk) to ∞ (square). Faint reference outlines for p=1 and p=∞ frame the
 * current shape; a draggable vector shows its own ‖v‖_p shrinking/growing.
 */
export function NormBallWidget() {
  const [p, setP] = useState(2);
  const [inf, setInf] = useState(false);
  const v = useMovablePoint([0.7, 0.5]);

  const effP = inf ? Infinity : p;
  const ball = unitBallPolygon(effP, 160);
  const ref1 = unitBallPolygon(1, 4);
  const refInf = unitBallPolygon(Infinity, 4);
  const nv = pNorm([v.point[0], v.point[1]], effP);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>
            p = <span className="text-fg">{inf ? "∞" : p.toFixed(1)}</span>
          </span>
          <input
            type="range"
            min={1}
            max={6}
            step={0.1}
            value={p}
            disabled={inf}
            onChange={(e) => setP(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        <button
          type="button"
          onClick={() => setInf((x) => !x)}
          className={inf ? "btn btn-accent" : "btn"}
        >
          p = ∞ (norme sup)
        </button>
        <div className="font-mono text-sm text-fg-muted">
          ‖v‖<sub>p</sub> = <span className="text-accent-warm">{nv.toFixed(3)}</span>
        </div>
      </div>

      <Mafs viewBox={{ x: [-1.6, 1.6], y: [-1.6, 1.6] }} height={340}>
        <Coordinates.Cartesian subdivisions={2} />
        {/* reference outlines: the p=1 diamond and p=∞ square */}
        <Polygon points={ref1} color={Theme.foreground} fillOpacity={0} strokeOpacity={0.25} />
        <Polygon points={refInf} color={Theme.foreground} fillOpacity={0} strokeOpacity={0.25} />
        {/* the current unit ball */}
        <Polygon points={ball} color={Theme.blue} fillOpacity={0.18} />
        {v.element}
      </Mafs>

      <div className="mt-2 text-xs text-fg-dim">
        Les contours gris : la boule p=1 (losange) et p=∞ (carré). Entre les deux,
        toutes les boules unités p sont emboîtées. Déplace v et observe ‖v‖<sub>p</sub>.
      </div>
    </div>
  );
}
