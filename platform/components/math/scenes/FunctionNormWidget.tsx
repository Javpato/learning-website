"use client";

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Line, Polygon, Text, Theme } from "mafs";
import { sampleFunction, functionNorms, type Pt } from "@/lib/math/topology";

type Preset = { label: string; tex: string; f: (x: number) => number };

const PRESETS: Preset[] = [
  { label: "f(x) = x", tex: "x", f: (x) => x },
  { label: "f(x) = sin(πx)", tex: "\\sin(\\pi x)", f: (x) => Math.sin(Math.PI * x) },
  { label: "bosse 4x(1−x)", tex: "4x(1-x)", f: (x) => 4 * x * (1 - x) },
  {
    label: "pic étroit",
    tex: "\\text{pic}",
    // tall thin spike: large ‖·‖∞, small ‖·‖₁ — shows norms are NOT interchangeable
    f: (x) => Math.exp(-((x - 0.5) ** 2) / 0.0015),
  },
];

const N = 240;

/**
 * The three norms of a function f ∈ C([0,1]) made visible: ‖f‖₁ = ∫₀¹|f| is the
 * shaded area, ‖f‖∞ = max|f| is the dashed ceiling, ‖f‖₂ the quadratic mean.
 * The "narrow spike" preset has a big ‖·‖∞ but a small ‖·‖₁ — the point of why,
 * in infinite dimension, these norms are not equivalent.
 */
export function FunctionNormWidget() {
  const [idx, setIdx] = useState(2);
  const preset = PRESETS[idx];

  const { area, norms } = useMemo(() => {
    const { ys } = sampleFunction(preset.f, N);
    const dx = 1 / N;
    // polygon of the region under |f| over [0,1] for the L¹ area
    const poly: Pt[] = [[0, 0]];
    for (let i = 0; i <= N; i++) poly.push([i / N, Math.abs(preset.f(i / N))]);
    poly.push([1, 0]);
    return { area: poly, norms: functionNorms(ys, dx) };
  }, [preset]);

  const yMax = Math.max(1.05, norms.linf * 1.1);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setIdx(i)}
            className={i === idx ? "btn btn-accent" : "btn"}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Mafs viewBox={{ x: [-0.1, 1.1], y: [-0.2, yMax] }} preserveAspectRatio={false} height={300}>
        <Coordinates.Cartesian subdivisions={2} />
        {/* ‖f‖₁ = ∫|f| as a shaded area */}
        <Polygon points={area} color={Theme.blue} fillOpacity={0.18} strokeOpacity={0} />
        {/* the curve f */}
        <Plot.OfX y={preset.f} color={Theme.blue} />
        {/* ‖f‖∞ = max|f| as a dashed ceiling */}
        <Line.Segment point1={[0, norms.linf]} point2={[1, norms.linf]} color={Theme.yellow} style="dashed" />
        <Text x={1.02} y={norms.linf} attach="e" size={13} color={Theme.yellow}>
          ‖f‖∞
        </Text>
      </Mafs>

      <div className="mt-3 grid gap-1 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm sm:grid-cols-3">
        <div>
          ‖f‖₁ = ∫₀¹|f| = <span className="text-accent">{norms.l1.toFixed(3)}</span>
        </div>
        <div>
          ‖f‖₂ = <span className="text-accent">{norms.l2.toFixed(3)}</span>
        </div>
        <div>
          ‖f‖∞ = max|f| = <span className="text-accent-warm">{norms.linf.toFixed(3)}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-fg-dim">
        Le « pic étroit » : ‖f‖∞ est grand alors que ‖f‖₁ (l&apos;aire) reste petit — preuve
        visuelle qu&apos;en dimension infinie ces normes ne sont pas équivalentes.
      </div>
    </div>
  );
}
