"use client";

import { useState } from "react";
import { Mafs, Coordinates, Circle, Text, Theme, useMovablePoint } from "mafs";
import { dist, maxFittingRadius, ballInsideDisk, type Pt } from "@/lib/math/topology";

const CENTER: Pt = [0, 0];
const R0 = 2; // O = open disk of radius R0

/**
 * THE definition made visible: O ouvert ⟺ ∀x∈O, ∃r>0, B(x,r) ⊆ O.
 * O is the open disk (dashed). Drag x and tune r: the ball B(x,r) is GREEN when
 * it sits entirely inside O, RED when it spills over the boundary. Near the
 * centre a big ball fits; as x approaches the edge the largest fitting radius
 * shrinks to 0 — but stays > 0 for every interior point. That is openness.
 */
export function OpenSetWidget() {
  const [r, setR] = useState(0.6);
  const x = useMovablePoint([0.4, 0.3]);

  const xp: Pt = [x.point[0], x.point[1]];
  const d = dist(xp, CENTER);
  const inside = d < R0;
  const maxR = maxFittingRadius(xp, CENTER, R0); // largest r that fits (≤0 outside)
  const fits = inside && ballInsideDisk(xp, r, CENTER, R0);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>r = {r.toFixed(2)}</span>
          <input
            type="range"
            min={0.05}
            max={2.2}
            step={0.05}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => setR(Math.max(0.05, maxR * 0.9))}
          disabled={!inside}
          title="règle r juste en dessous du rayon maximal qui tient"
        >
          ajuster r au max
        </button>
        <span className="font-mono text-sm text-fg-muted">
          rayon max qui tient ={" "}
          <span className={maxR > 0 ? "text-success" : "text-danger"}>
            {maxR > 0 ? maxR.toFixed(2) : "0"}
          </span>
        </span>
      </div>

      <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} height={360}>
        <Coordinates.Cartesian subdivisions={2} />
        {/* O = open disk (dashed boundary: the edge is NOT part of O) */}
        <Circle center={CENTER} radius={R0} color={Theme.blue} fillOpacity={0.1} strokeStyle="dashed" />
        {/* the test ball B(x, r) */}
        <Circle center={xp} radius={r} color={fits ? Theme.green : Theme.red} fillOpacity={0.18} />
        {x.element}
        <Text x={xp[0]} y={xp[1]} attach="ne" size={14} color={Theme.foreground}>
          x
        </Text>
      </Mafs>

      <div className="mt-2 font-mono text-sm">
        <span className="text-fg-muted">x ∈ O ? </span>
        <span className={inside ? "text-success" : "text-danger"}>{inside ? "oui" : "non"}</span>
        <span className="text-fg-muted"> · B(x, r) ⊆ O ? </span>
        <span className={fits ? "text-success" : "text-danger"}>{fits ? "oui ✓" : "non ✗ (déborde)"}</span>
      </div>
      <div className="mt-1 text-xs text-fg-dim">
        {inside
          ? "x est intérieur : il existe r > 0 (jusqu'au rayon max ci-dessus) tel que B(x,r) ⊆ O. C'est la définition d'« ouvert »."
          : "x est sur le bord ou dehors : aucune boule autour de x ne tient dans O."}
      </div>
    </div>
  );
}
