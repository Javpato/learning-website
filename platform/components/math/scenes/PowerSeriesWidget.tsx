"use client";

// A power series as a function: partial sums S_N(x) creeping towards the sum
// inside the disc of convergence, and diverging visibly outside it. The two
// vertical markers are ±R — the whole point of the chapter is that they are
// where the behaviour changes, and that the endpoints themselves are a
// separate question.

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Line, Plot, Text, Theme } from "mafs";
import { functionPartialSum } from "@/lib/math/series";
import { useLocale } from "@/components/learn/useLocale";

type Preset = {
  key: string;
  label: Record<string, string>;
  term: (k: number, x: number) => number;
  from: number;
  closed?: (x: number) => number;
  R: number;
  yRange: [number, number];
  boundary: Record<string, string>;
};

const PRESETS: Preset[] = [
  {
    key: "geo",
    label: { fr: "∑ xⁿ", en: "∑ xⁿ", es: "∑ xⁿ" },
    term: (k, x) => Math.pow(x, k),
    from: 0,
    closed: (x) => 1 / (1 - x),
    R: 1,
    yRange: [-3, 6],
    boundary: {
      fr: "En x = 1 et x = −1 les termes ne tendent pas vers 0 : divergence des deux côtés.",
      en: "At x = 1 and x = −1 the terms do not tend to 0: divergence on both sides.",
      es: "En x = 1 y x = −1 los términos no tienden a 0: divergencia por ambos lados.",
    },
  },
  {
    key: "log",
    label: { fr: "∑ xⁿ/n", en: "∑ xⁿ/n", es: "∑ xⁿ/n" },
    term: (k, x) => Math.pow(x, k) / k,
    from: 1,
    closed: (x) => -Math.log(1 - x),
    R: 1,
    yRange: [-3, 4],
    boundary: {
      fr: "Même rayon, deux comportements au bord : divergence en 1 (harmonique), convergence en −1 (alternée).",
      en: "Same radius, two boundary behaviours: divergence at 1 (harmonic), convergence at −1 (alternating).",
      es: "Mismo radio, dos comportamientos en el borde: divergencia en 1 (armónica), convergencia en −1 (alternada).",
    },
  },
  {
    key: "exp",
    label: { fr: "∑ xⁿ/n!", en: "∑ xⁿ/n!", es: "∑ xⁿ/n!" },
    term: (k, x) => {
      let f = 1;
      for (let i = 2; i <= k; i++) f *= i;
      return Math.pow(x, k) / f;
    },
    from: 0,
    closed: (x) => Math.exp(x),
    R: Infinity,
    yRange: [-2, 12],
    boundary: {
      fr: "Rayon infini : aucun bord à étudier, la série représente la fonction sur tout l'axe réel.",
      en: "Infinite radius: no boundary to study, the series represents the function on the whole real line.",
      es: "Radio infinito: no hay borde que estudiar, la serie representa la función en toda la recta real.",
    },
  },
  {
    key: "nn1",
    label: { fr: "∑ xⁿ/(n(n+1))", en: "∑ xⁿ/(n(n+1))", es: "∑ xⁿ/(n(n+1))" },
    term: (k, x) => Math.pow(x, k) / (k * (k + 1)),
    from: 1,
    R: 1,
    yRange: [-1, 1.5],
    boundary: {
      fr: "Les coefficients sont sommables : la série converge encore en x = 1 et x = −1.",
      en: "The coefficients are summable: the series still converges at x = 1 and x = −1.",
      es: "Los coeficientes son sumables: la serie aún converge en x = 1 y x = −1.",
    },
  },
];

const L: Record<string, Record<string, string>> = {
  fr: {
    order: "ordre N de la somme partielle",
    radius: "rayon de convergence R",
    infinite: "infini",
    caption:
      "Augmente N : à l'intérieur du rayon la somme partielle colle à la fonction, à l'extérieur elle s'envole. Le rayon n'est pas un réglage, c'est une frontière imposée par les coefficients.",
    partial: "somme partielle",
    sum: "somme (forme close)",
  },
  en: {
    order: "order N of the partial sum",
    radius: "radius of convergence R",
    infinite: "infinite",
    caption:
      "Increase N: inside the radius the partial sum hugs the function, outside it flies off. The radius is not a setting, it is a boundary imposed by the coefficients.",
    partial: "partial sum",
    sum: "sum (closed form)",
  },
  es: {
    order: "orden N de la suma parcial",
    radius: "radio de convergencia R",
    infinite: "infinito",
    caption:
      "Aumenta N: dentro del radio la suma parcial se pega a la función, fuera se dispara. El radio no es un ajuste, es una frontera impuesta por los coeficientes.",
    partial: "suma parcial",
    sum: "suma (forma cerrada)",
  },
};

export function PowerSeriesWidget({ preset = "geo" }: { preset?: string }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const initial = Math.max(0, PRESETS.findIndex((p) => p.key === preset));

  const [idx, setIdx] = useState(initial);
  const [N, setN] = useState(4);

  const p = PRESETS[idx];
  const S = useMemo(() => functionPartialSum(p.term, N, p.from), [p, N]);
  const xMax = p.R === Infinity ? 2.5 : 1.6;

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((q, i) => (
          <button
            key={q.key}
            type="button"
            onClick={() => setIdx(i)}
            className={i === idx ? "btn btn-accent" : "btn"}
          >
            {q.label[locale] ?? q.label.fr}
          </button>
        ))}
      </div>

      <label className="mb-3 flex max-w-xs flex-col gap-1 text-sm text-fg-muted">
        <span>
          {t.order} = {N}
        </span>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={N}
          onChange={(e) => setN(Number(e.target.value))}
          className="accent-[color:var(--accent)]"
        />
      </label>

      <Mafs
        viewBox={{ x: [-xMax, xMax], y: p.yRange }}
        preserveAspectRatio={false}
        height={320}
      >
        <Coordinates.Cartesian subdivisions={2} />
        {p.R !== Infinity && (
          <>
            <Line.Segment
              point1={[p.R, p.yRange[0]]}
              point2={[p.R, p.yRange[1]]}
              color={Theme.yellow}
              style="dashed"
            />
            <Line.Segment
              point1={[-p.R, p.yRange[0]]}
              point2={[-p.R, p.yRange[1]]}
              color={Theme.yellow}
              style="dashed"
            />
            <Text x={p.R} y={p.yRange[1] * 0.85} attach="w" size={13} color={Theme.yellow}>
              R
            </Text>
          </>
        )}
        {p.closed && (
          <Plot.Parametric
            xy={(x) => [x, p.closed ? p.closed(x) : 0]}
            t={[-xMax, p.R === Infinity ? xMax : p.R - 0.02]}
            color={Theme.green}
            weight={2}
          />
        )}
        <Plot.Parametric xy={(x) => [x, S(x)]} t={[-xMax, xMax]} color={Theme.blue} weight={2} />
      </Mafs>

      <div className="mt-3 grid gap-1 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm sm:grid-cols-2">
        <div>
          <span className="text-accent">■</span> {t.partial} S_{N}
        </div>
        <div>
          {t.radius} = <span className="text-accent-warm">{p.R === Infinity ? t.infinite : p.R}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-fg-dim">{p.boundary[locale] ?? p.boundary.fr}</div>
      <div className="mt-1 text-xs text-fg-dim">{t.caption}</div>
    </div>
  );
}
