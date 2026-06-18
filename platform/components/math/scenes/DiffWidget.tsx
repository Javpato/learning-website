"use client";

import { useMemo, useState } from "react";
import { TangentLine2D } from "./TangentLine2D";
import { TangentPlane3D } from "./TangentPlane3D";
import {
  ScalarField2D,
  EXAMPLE_FIELD,
  residualRatio,
  norm2,
} from "@/lib/math/calculus";

/**
 * Owns the single source of truth — { field, a, h, zoom, flatten } — and feeds
 * it to both the 2D Mafs cross-section and the 3D r3f surface. Moving the base
 * point (3D drag) or the sliders updates both views and the residual readout at
 * once: the "alive" link between manipulation, picture, and number.
 */
export function DiffWidget({ expr }: { expr?: string }) {
  const field = useMemo<ScalarField2D>(
    () => (expr ? new ScalarField2D(expr, expr) : EXAMPLE_FIELD),
    [expr],
  );

  // center stays fixed (the 3D window); `a` is the live base point.
  const center: [number, number] = [1, 1];
  const [a, setA] = useState<[number, number]>([1, 1]);
  const [h, setH] = useState(0.8);
  const [zoom, setZoom] = useState(1);
  const [flatten, setFlatten] = useState(false);

  const hVec: [number, number] = [h, 0];
  const ratio = residualRatio(field, a, hVec);
  const nh = norm2(hVec);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-fg-dim">
            Coupe 2D — y = a₂ fixé
          </div>
          <TangentLine2D field={field} a={a} h={h} zoom={zoom} />
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-fg-dim">
            Surface 3D — z = f(x, y)
          </div>
          <TangentPlane3D
            field={field}
            center={center}
            a={a}
            setA={setA}
            flatten={flatten ? 1 : 0}
          />
        </div>
      </div>

      {/* shared controls */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>Zoom (coupe 2D) : ×{zoom.toFixed(0)}</span>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>‖h‖ = {nh.toFixed(3)}</span>
          <input
            type="range"
            min={0.02}
            max={1.4}
            step={0.02}
            value={h}
            onChange={(e) => setH(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        <label className="flex cursor-pointer flex-col gap-1 text-sm text-fg-muted">
          <span>Zoom infini (3D)</span>
          <button
            type="button"
            onClick={() => setFlatten((v) => !v)}
            className={
              flatten
                ? "btn btn-accent text-left"
                : "btn text-left"
            }
          >
            {flatten ? "surface → plan (activé)" : "aplatir sur le plan tangent"}
          </button>
        </label>
      </div>

      {/* live numeric link: the o(‖h‖) statement, measured */}
      <div className="mt-4 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm">
        <div className="text-fg-muted">
          a = ({a[0].toFixed(2)}, {a[1].toFixed(2)})
          <span className="ml-3">glisse le point dans la vue 3D</span>
        </div>
        <div className="mt-1 text-fg">
          |r(h)| / ‖h‖ ={" "}
          <span className="text-accent-warm">{ratio.toFixed(4)}</span>
          <span className="ml-2 text-fg-dim">→ 0 quand ‖h‖ → 0</span>
        </div>
      </div>
    </div>
  );
}
