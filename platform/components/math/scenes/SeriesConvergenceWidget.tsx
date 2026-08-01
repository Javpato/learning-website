"use client";

// Partial sums of a numerical series, drawn as the sequence (N, S_N) they
// really are: the series converges exactly when this sequence has a limit.
// The presets are the reference series of the course — geometric, harmonic,
// Riemann, alternating — so the learner sees the *same* pictures that the
// criteria talk about.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Line, Point, Text, Theme } from "mafs";
import { partialSums, type TermFn } from "@/lib/math/series";
import { useLocale } from "@/components/learn/useLocale";

type Preset = {
  key: string;
  label: Record<string, string>;
  /** term u_n, given the current parameter value */
  term: (p: number) => TermFn;
  /** exact sum when it exists, given the parameter */
  sum?: (p: number) => number | undefined;
  param?: { min: number; max: number; step: number; init: number; symbol: string };
};

const PRESETS: Preset[] = [
  {
    key: "geo",
    label: { fr: "géométrique  ∑ rⁿ", en: "geometric  ∑ rⁿ", es: "geométrica  ∑ rⁿ" },
    term: (r) => (n) => Math.pow(r, n),
    sum: (r) => (Math.abs(r) < 1 ? r / (1 - r) : undefined),
    param: { min: -0.95, max: 1.1, step: 0.05, init: 0.5, symbol: "r" },
  },
  {
    key: "riemann",
    label: { fr: "Riemann  ∑ 1/n^α", en: "Riemann  ∑ 1/n^α", es: "Riemann  ∑ 1/n^α" },
    term: (a) => (n) => 1 / Math.pow(n, a),
    param: { min: 0.2, max: 3, step: 0.1, init: 0.5, symbol: "α" },
  },
  {
    key: "harmonique",
    label: { fr: "harmonique  ∑ 1/n", en: "harmonic  ∑ 1/n", es: "armónica  ∑ 1/n" },
    term: () => (n) => 1 / n,
  },
  {
    key: "alternee",
    label: { fr: "alternée  ∑ (−1)ⁿ⁺¹/n", en: "alternating  ∑ (−1)ⁿ⁺¹/n", es: "alternada  ∑ (−1)ⁿ⁺¹/n" },
    term: () => (n) => (n % 2 === 0 ? -1 : 1) / n,
    sum: () => Math.LN2,
  },
];

const L: Record<string, Record<string, string>> = {
  fr: {
    terms: "nombre de termes N",
    partial: "somme partielle S_N",
    term: "dernier terme u_N",
    gap: "écart à la somme",
    unknown: "somme inconnue en forme close",
    caption:
      "Regarde la suite des points (N, S_N), pas les termes : une série converge quand ces points se stabilisent. Les termes peuvent tendre vers 0 sans que les points se stabilisent — essaie l'harmonique.",
    diverge: "les sommes partielles s'échappent",
  },
  en: {
    terms: "number of terms N",
    partial: "partial sum S_N",
    term: "last term u_N",
    gap: "gap to the sum",
    unknown: "no known closed form for the sum",
    caption:
      "Watch the points (N, S_N), not the terms: a series converges when these points settle. Terms can tend to 0 without the points settling — try the harmonic one.",
    diverge: "the partial sums run away",
  },
  es: {
    terms: "número de términos N",
    partial: "suma parcial S_N",
    term: "último término u_N",
    gap: "distancia a la suma",
    unknown: "suma sin forma cerrada conocida",
    caption:
      "Observa los puntos (N, S_N), no los términos: una serie converge cuando esos puntos se estabilizan. Los términos pueden tender a 0 sin que los puntos se estabilicen — prueba la armónica.",
    diverge: "las sumas parciales se escapan",
  },
};

const MAX_TERMS = 60;

export function SeriesConvergenceWidget({ preset = "geo" }: { preset?: string }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const initial = Math.max(0, PRESETS.findIndex((p) => p.key === preset));

  const [idx, setIdx] = useState(initial);
  const [param, setParam] = useState(PRESETS[initial].param?.init ?? 1);
  const [N, setN] = useState(12);

  const p = PRESETS[idx];
  const term = p.term(param);
  const sums = useMemo(() => partialSums(term, MAX_TERMS), [term]);
  const shown = sums.slice(0, N);
  const limit = p.sum?.(param);
  const last = shown[shown.length - 1] ?? 0;
  const uN = term(N);

  const ys = shown.concat(limit !== undefined ? [limit] : []);
  const lo = Math.min(0, ...ys);
  const hi = Math.max(...ys, 0.5);
  const pad = 0.15 * (hi - lo || 1);

  function selectPreset(i: number) {
    setIdx(i);
    setParam(PRESETS[i].param?.init ?? 1);
  }

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((q, i) => (
          <button
            key={q.key}
            type="button"
            onClick={() => selectPreset(i)}
            className={i === idx ? "btn btn-accent" : "btn"}
          >
            {q.label[locale] ?? q.label.fr}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-6">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>
            {t.terms} = {N}
          </span>
          <input
            type="range"
            min={1}
            max={MAX_TERMS}
            step={1}
            value={N}
            onChange={(e) => setN(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        {p.param && (
          <label className="flex flex-col gap-1 text-sm text-fg-muted">
            <span>
              {p.param.symbol} = {param.toFixed(2)}
            </span>
            <input
              type="range"
              min={p.param.min}
              max={p.param.max}
              step={p.param.step}
              value={param}
              onChange={(e) => setParam(Number(e.target.value))}
              className="accent-[color:var(--accent)]"
            />
          </label>
        )}
      </div>

      <Mafs
        viewBox={{ x: [0, MAX_TERMS], y: [lo - pad, hi + pad] }}
        preserveAspectRatio={false}
        height={300}
      >
        <Coordinates.Cartesian subdivisions={2} />
        {limit !== undefined && (
          <>
            <Line.Segment
              point1={[0, limit]}
              point2={[MAX_TERMS, limit]}
              color={Theme.green}
              style="dashed"
            />
            <Text x={MAX_TERMS * 0.98} y={limit} attach="nw" size={13} color={Theme.green}>
              S
            </Text>
          </>
        )}
        {shown.slice(0, -1).map((s, i) => (
          <Line.Segment
            key={`seg${i}`}
            point1={[i + 1, s]}
            point2={[i + 2, shown[i + 1]]}
            color={Theme.foreground}
            opacity={0.2}
          />
        ))}
        {shown.map((s, i) => (
          <Point key={`pt${i}`} x={i + 1} y={s} color={Theme.blue} />
        ))}
        <Point x={N} y={last} color={Theme.yellow} />
      </Mafs>

      <div className="mt-3 grid gap-1 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm sm:grid-cols-3">
        <div>
          {t.partial} = <span className="text-accent">{last.toFixed(4)}</span>
        </div>
        <div>
          {t.term} = <span className="text-fg-muted">{uN.toExponential(2)}</span>
        </div>
        <div>
          {limit === undefined ? (
            <span className="text-fg-dim">{t.unknown}</span>
          ) : (
            <>
              {t.gap} = <span className="text-accent-warm">{Math.abs(limit - last).toExponential(2)}</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-fg-dim">{t.caption}</div>
    </div>
  );
}
