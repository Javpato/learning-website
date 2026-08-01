"use client";

// Pointwise vs uniform convergence, made visible: f_n, the limit f, and the
// tube of half-width ε around f. Uniform convergence = "from some index on,
// the whole curve fits inside the tube"; the widget also reports the exact
// sup-norm and the point where it is attained (the witness point x_n).
//
// The `a` slider cuts the domain away from the guilty point — the standard
// exam move "uniform on [a, +∞) but not on [0, +∞)".

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Point, Text, Theme } from "mafs";
import { functionPartialSum, integrateOn, supNormOn } from "@/lib/math/series";
import { useLocale } from "@/components/learn/useLocale";

type Preset = {
  key: string;
  label: Record<string, string>;
  fn: (n: number) => (x: number) => number;
  limit: (x: number) => number;
  domain: [number, number];
  yRange: [number, number];
  /** where the trouble sits, drawn as a vertical marker */
  trouble?: number;
  note: Record<string, string>;
};

const tri = (x: number, n: number) => Math.max(0, 1 - Math.abs(n * x - 1));

const PRESETS: Preset[] = [
  {
    key: "xn",
    label: { fr: "xⁿ sur [0,1]", en: "xⁿ on [0,1]", es: "xⁿ en [0,1]" },
    fn: (n) => (x) => Math.pow(x, n),
    limit: (x) => (x >= 1 ? 1 : 0),
    domain: [0, 1],
    yRange: [-0.15, 1.25],
    trouble: 1,
    note: {
      fr: "La limite fait un saut en 1 : des fonctions continues ne peuvent pas converger uniformément vers elle.",
      en: "The limit jumps at 1: continuous functions cannot converge uniformly to it.",
      es: "El límite salta en 1: unas funciones continuas no pueden converger uniformemente hacia él.",
    },
  },
  {
    key: "pic",
    label: { fr: "n x e^(−n x)", en: "n x e^(−n x)", es: "n x e^(−n x)" },
    fn: (n) => (x) => n * x * Math.exp(-n * x),
    limit: () => 0,
    domain: [0, 2],
    yRange: [-0.1, 0.55],
    trouble: 0,
    note: {
      fr: "Le pic garde la hauteur 1/e mais glisse vers 0 : chaque point voit passer la bosse, le maximum ne baisse jamais.",
      en: "The peak keeps height 1/e but slides towards 0: every point sees the bump go by, the maximum never drops.",
      es: "El pico conserva la altura 1/e pero se desliza hacia 0: cada punto ve pasar la joroba, el máximo nunca baja.",
    },
  },
  {
    key: "racine",
    label: { fr: "√(x² + 1/n²)", en: "√(x² + 1/n²)", es: "√(x² + 1/n²)" },
    fn: (n) => (x) => Math.sqrt(x * x + 1 / (n * n)),
    limit: (x) => Math.abs(x),
    domain: [-1, 1],
    yRange: [-0.15, 1.2],
    trouble: 0,
    note: {
      fr: "Ici l'écart maximal vaut 1/n : la convergence est uniforme, et pourtant la limite |x| n'est pas dérivable en 0.",
      en: "Here the largest gap is 1/n: convergence is uniform, and yet the limit |x| is not differentiable at 0.",
      es: "Aquí la diferencia máxima vale 1/n: la convergencia es uniforme y sin embargo el límite |x| no es derivable en 0.",
    },
  },
  {
    key: "bosse",
    label: { fr: "bosse glissante (hauteur 1)", en: "travelling bump (height 1)", es: "joroba móvil (altura 1)" },
    fn: (n) => (x) => tri(x, n),
    limit: () => 0,
    domain: [0, 1],
    yRange: [-0.15, 1.25],
    trouble: 0,
    note: {
      fr: "Hauteur constante, aire 1/n : la convergence simple tient, l'uniforme non, et les intégrales tendent quand même vers 0.",
      en: "Constant height, area 1/n: pointwise convergence holds, uniform does not, and the integrals still tend to 0.",
      es: "Altura constante, área 1/n: la convergencia simple se cumple, la uniforme no, y las integrales tienden aun así a 0.",
    },
  },
  {
    key: "aire",
    label: { fr: "bosse d'aire 1", en: "bump of area 1", es: "joroba de área 1" },
    fn: (n) => (x) => n * tri(x, n),
    limit: () => 0,
    domain: [0, 1],
    yRange: [-0.5, 6],
    trouble: 0,
    note: {
      fr: "Aire constante égale à 1 alors que la limite est nulle : l'intégrale de la limite n'est pas la limite des intégrales.",
      en: "Constant area equal to 1 while the limit is zero: the integral of the limit is not the limit of the integrals.",
      es: "Área constante igual a 1 mientras el límite es nulo: la integral del límite no es el límite de las integrales.",
    },
  },
];

// Partial sums of ∑ e^(−k x)/k² — the running example of the series chapters.
// The "limit" is the sum, approximated by a far partial sum.
const serieTerm = (k: number, x: number) => Math.exp(-k * x) / (k * k);
const serieSum = functionPartialSum(serieTerm, 200);

PRESETS.push({
  key: "serie",
  label: {
    fr: "sommes partielles de ∑ e^(−n x)/n²",
    en: "partial sums of ∑ e^(−n x)/n²",
    es: "sumas parciales de ∑ e^(−n x)/n²",
  },
  fn: (n) => functionPartialSum(serieTerm, n),
  limit: (x) => serieSum(x),
  domain: [0, 2],
  yRange: [-0.2, 2],
  trouble: 0,
  note: {
    fr: "Ici chaque terme est majoré par 1/n², indépendamment de x : la somme des majorants converge, donc la convergence est normale, donc uniforme sur tout le domaine.",
    en: "Here each term is bounded by 1/n², independently of x: the sum of the bounds converges, so convergence is normal, hence uniform on the whole domain.",
    es: "Aquí cada término está acotado por 1/n², independientemente de x: la suma de las cotas converge, así que la convergencia es normal y por tanto uniforme en todo el dominio.",
  },
});

const L: Record<string, Record<string, string>> = {
  fr: {
    rank: "rang n",
    band: "demi-largeur du tube ε",
    cut: "on retire [0, a] : a =",
    sup: "écart maximal sur le domaine étudié",
    at: "atteint en x =",
    area: "aire sous f_n",
    inside: "toute la courbe est dans le tube",
    outside: "la courbe sort du tube",
    caption:
      "Convergence simple : chaque point finit par entrer dans le tube. Convergence uniforme : la courbe entière y entre, d'un seul coup, à partir d'un même rang.",
  },
  en: {
    rank: "index n",
    band: "half-width of the tube ε",
    cut: "remove [0, a]: a =",
    sup: "largest gap on the studied domain",
    at: "attained at x =",
    area: "area under f_n",
    inside: "the whole curve is inside the tube",
    outside: "the curve leaves the tube",
    caption:
      "Pointwise convergence: each point eventually enters the tube. Uniform convergence: the entire curve enters it at once, from one common index on.",
  },
  es: {
    rank: "índice n",
    band: "semianchura del tubo ε",
    cut: "se quita [0, a]: a =",
    sup: "diferencia máxima en el dominio estudiado",
    at: "alcanzada en x =",
    area: "área bajo f_n",
    inside: "toda la curva está dentro del tubo",
    outside: "la curva sale del tubo",
    caption:
      "Convergencia simple: cada punto acaba entrando en el tubo. Convergencia uniforme: la curva entera entra de golpe, a partir de un mismo índice.",
  },
};

export function UniformConvergenceWidget({ preset = "xn" }: { preset?: string }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const initial = Math.max(0, PRESETS.findIndex((p) => p.key === preset));

  const [idx, setIdx] = useState(initial);
  const [n, setN] = useState(4);
  const [eps, setEps] = useState(0.25);
  const [a, setA] = useState(0);

  const p = PRESETS[idx];
  const fn = p.fn(n);
  const [d0, d1] = p.domain;
  // cutting away [0, a] only makes sense when the trouble sits at an endpoint
  const lo = p.trouble === 0 ? d0 + a : d0;
  const hi = p.trouble === 1 ? d1 - a : d1;

  const { sup, arg, area } = useMemo(() => {
    const s = supNormOn((x) => fn(x) - p.limit(x), lo, hi);
    return { ...s, area: integrateOn(fn, d0, d1) };
  }, [fn, p, lo, hi, d0, d1]);

  const uniform = sup < eps;

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((q, i) => (
          <button
            key={q.key}
            type="button"
            onClick={() => {
              setIdx(i);
              setA(0);
            }}
            className={i === idx ? "btn btn-accent" : "btn"}
          >
            {q.label[locale] ?? q.label.fr}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-6">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>
            {t.rank} = {n}
          </span>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>
            {t.band} = {eps.toFixed(2)}
          </span>
          <input
            type="range"
            min={0.02}
            max={1}
            step={0.02}
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>
            {t.cut} {a.toFixed(2)}
          </span>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="accent-[color:var(--accent)]"
          />
        </label>
      </div>

      <Mafs
        viewBox={{ x: [d0 - 0.1, d1 + 0.1], y: p.yRange }}
        preserveAspectRatio={false}
        height={320}
      >
        <Coordinates.Cartesian subdivisions={2} />
        <Plot.Parametric
          xy={(x) => [x, p.limit(x) + eps]}
          t={[lo, hi]}
          color={Theme.green}
          style="dashed"
          opacity={0.7}
        />
        <Plot.Parametric
          xy={(x) => [x, p.limit(x) - eps]}
          t={[lo, hi]}
          color={Theme.green}
          style="dashed"
          opacity={0.7}
        />
        <Plot.Parametric xy={(x) => [x, p.limit(x)]} t={[d0, d1]} color={Theme.green} weight={2} />
        <Plot.Parametric xy={(x) => [x, fn(x)]} t={[d0, d1]} color={Theme.blue} weight={2} />
        <Point x={arg} y={fn(arg)} color={Theme.yellow} />
        <Text x={arg} y={fn(arg)} attach="ne" size={13} color={Theme.yellow}>
          x{n === 1 ? "₁" : "ₙ"}
        </Text>
      </Mafs>

      <div className="mt-3 grid gap-1 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm sm:grid-cols-3">
        <div>
          {t.sup} = <span className="text-accent-warm">{sup.toFixed(4)}</span>
        </div>
        <div>
          {t.at} <span className="text-accent">{arg.toFixed(3)}</span>
        </div>
        <div>
          {t.area} = <span className="text-accent">{area.toFixed(3)}</span>
        </div>
      </div>
      <div className={`mt-2 text-sm ${uniform ? "text-success" : "text-danger"}`}>
        {uniform ? "✓ " : "✗ "}
        {uniform ? t.inside : t.outside}
      </div>
      <div className="mt-1 text-xs text-fg-dim">{p.note[locale] ?? p.note.fr}</div>
      <div className="mt-1 text-xs text-fg-dim">{t.caption}</div>
    </div>
  );
}
