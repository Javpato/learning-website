"use client";

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Circle, Point, Line, Text, Theme } from "mafs";
import { spiralSequence, dist, rankForEps, type Pt } from "@/lib/math/topology";

const ELL: Pt = [0, 0];
const TERMS = 36;

/**
 * A sequence u_n → ℓ as a damped spiral. The ε-ball around ℓ is drawn; points
 * inside it are green, outside red. The readout gives the rank N(ε): from N on,
 * every term sits inside B(ℓ, ε) — the precise meaning of ‖u_n − ℓ‖ → 0.
 */
export function ConvergenceWidget() {
  const [eps, setEps] = useState(0.6);
  const [hi, setHi] = useState(4);

  const seq = useMemo(() => spiralSequence(TERMS, ELL), []);
  const N = rankForEps(seq, ELL, eps);
  const dHi = dist(seq[hi], ELL);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>ε = {eps.toFixed(2)}</span>
          <input type="range" min={0.05} max={2.5} step={0.05} value={eps} onChange={(e) => setEps(Number(e.target.value))} className="accent-[color:var(--accent)]" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>terme n = {hi}</span>
          <input type="range" min={0} max={TERMS} step={1} value={hi} onChange={(e) => setHi(Number(e.target.value))} className="accent-[color:var(--accent)]" />
        </label>
      </div>

      <Mafs viewBox={{ x: [-3.2, 3.2], y: [-3.2, 3.2] }} height={360}>
        <Coordinates.Cartesian subdivisions={2} />
        {/* ε-ball around the limit ℓ */}
        <Circle center={ELL} radius={eps} color={Theme.green} fillOpacity={0.08} strokeStyle="dashed" />
        {/* spiral path */}
        {seq.slice(0, -1).map((u, i) => (
          <Line.Segment key={`s${i}`} point1={u} point2={seq[i + 1]} color={Theme.foreground} opacity={0.18} />
        ))}
        {/* terms: green if within ε of ℓ, blue otherwise */}
        {seq.map((u, i) => (
          <Point key={`p${i}`} x={u[0]} y={u[1]} color={dist(u, ELL) < eps ? Theme.green : Theme.blue} />
        ))}
        {/* the highlighted term and the limit */}
        <Point x={seq[hi][0]} y={seq[hi][1]} color={Theme.yellow} />
        <Point x={ELL[0]} y={ELL[1]} color={Theme.red} />
        <Text x={ELL[0]} y={ELL[1]} attach="sw" size={14} color={Theme.red}>ℓ</Text>
        <Text x={seq[hi][0]} y={seq[hi][1]} attach="ne" size={13} color={Theme.yellow}>u{hi}</Text>
      </Mafs>

      <div className="mt-2 font-mono text-sm text-fg-muted">
        ‖u<sub>{hi}</sub> − ℓ‖ = <span className="text-fg">{dHi.toFixed(3)}</span>{" "}
        {dHi < eps ? <span className="text-success">&lt; ε</span> : <span className="text-danger">≥ ε</span>}
        <span className="ml-4">
          rang N(ε) ={" "}
          <span className="text-accent-warm">{N >= 0 ? N : "—"}</span>
          {N >= 0 && <span className="text-fg-dim"> : pour n ≥ {N}, tous les uₙ sont dans B(ℓ, ε)</span>}
        </span>
      </div>
      <div className="mt-1 text-xs text-fg-dim">
        Diminue ε : la boule rétrécit et le rang N augmente — mais il existe toujours.
        C&apos;est « ∀ε&gt;0, ∃N, ∀n≥N, ‖uₙ−ℓ‖&lt;ε ».
      </div>
    </div>
  );
}
