"use client";

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Line, Polygon, Text, Theme } from "mafs";
import { sampleFunction, functionNorms, type Pt } from "@/lib/math/topology";

type Lang = "fr" | "es" | "en";

const FNS: { f: (x: number) => number }[] = [
  { f: (x) => x },
  { f: (x) => Math.sin(Math.PI * x) },
  { f: (x) => 4 * x * (1 - x) },
  { f: (x) => Math.exp(-((x - 0.5) ** 2) / 0.0015) },
];

const L: Record<Lang, { labels: string[]; caption: string }> = {
  fr: {
    labels: ["f(x) = x", "f(x) = sin(πx)", "bosse 4x(1−x)", "pic étroit"],
    caption:
      "Le « pic étroit » : ‖f‖∞ est grand alors que ‖f‖₁ (l'aire) reste petit — preuve visuelle qu'en dimension infinie ces normes ne sont pas équivalentes.",
  },
  es: {
    labels: ["f(x) = x", "f(x) = sin(πx)", "joroba 4x(1−x)", "pico estrecho"],
    caption:
      "El « pico estrecho »: ‖f‖∞ es grande mientras ‖f‖₁ (el área) sigue siendo pequeña — prueba visual de que en dimensión infinita estas normas no son equivalentes.",
  },
  en: {
    labels: ["f(x) = x", "f(x) = sin(πx)", "bump 4x(1−x)", "narrow spike"],
    caption:
      "The 'narrow spike': ‖f‖∞ is large while ‖f‖₁ (the area) stays small — visual proof that in infinite dimension these norms are not equivalent.",
  },
};

const N = 240;

/**
 * The three norms of a function f ∈ C([0,1]) made visible: ‖f‖₁ = ∫₀¹|f| is the
 * shaded area, ‖f‖∞ = max|f| the dashed ceiling, ‖f‖₂ the quadratic mean.
 */
export function FunctionNormWidget({ lang = "fr" }: { lang?: Lang }) {
  const t = L[lang] ?? L.fr;
  const [idx, setIdx] = useState(2);
  const f = FNS[idx].f;

  const { area, norms } = useMemo(() => {
    const { ys } = sampleFunction(f, N);
    const dx = 1 / N;
    const poly: Pt[] = [[0, 0]];
    for (let i = 0; i <= N; i++) poly.push([i / N, Math.abs(f(i / N))]);
    poly.push([1, 0]);
    return { area: poly, norms: functionNorms(ys, dx) };
  }, [f]);

  const yMax = Math.max(1.05, norms.linf * 1.1);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {t.labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setIdx(i)}
            className={i === idx ? "btn btn-accent" : "btn"}
          >
            {label}
          </button>
        ))}
      </div>

      <Mafs viewBox={{ x: [-0.1, 1.1], y: [-0.2, yMax] }} preserveAspectRatio={false} height={300}>
        <Coordinates.Cartesian subdivisions={2} />
        <Polygon points={area} color={Theme.blue} fillOpacity={0.18} strokeOpacity={0} />
        <Plot.OfX y={f} color={Theme.blue} />
        <Line.Segment point1={[0, norms.linf]} point2={[1, norms.linf]} color={Theme.yellow} style="dashed" />
        <Text x={1.02} y={norms.linf} attach="e" size={13} color={Theme.yellow}>
          ‖f‖∞
        </Text>
      </Mafs>

      <div className="mt-3 grid gap-1 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm sm:grid-cols-3">
        <div>‖f‖₁ = ∫₀¹|f| = <span className="text-accent">{norms.l1.toFixed(3)}</span></div>
        <div>‖f‖₂ = <span className="text-accent">{norms.l2.toFixed(3)}</span></div>
        <div>‖f‖∞ = max|f| = <span className="text-accent-warm">{norms.linf.toFixed(3)}</span></div>
      </div>
      <div className="mt-2 text-xs text-fg-dim">{t.caption}</div>
    </div>
  );
}
