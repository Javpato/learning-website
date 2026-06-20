"use client";

import { useState } from "react";
import { Mafs, Coordinates, Polygon, Theme, useMovablePoint } from "mafs";
import { pNorm, unitBallPolygon } from "@/lib/math/topology";

type Lang = "fr" | "es" | "en";

const L: Record<Lang, { sup: string; caption: string }> = {
  fr: {
    sup: "p = ∞ (norme sup)",
    caption:
      "Les contours gris : la boule p=1 (losange) et p=∞ (carré). Entre les deux, toutes les boules unités p sont emboîtées. Déplace v et observe ‖v‖p.",
  },
  es: {
    sup: "p = ∞ (norma sup)",
    caption:
      "Los contornos grises: la bola p=1 (rombo) y p=∞ (cuadrado). Entre ambas, todas las bolas unidad p están encajadas. Mueve v y observa ‖v‖p.",
  },
  en: {
    sup: "p = ∞ (sup norm)",
    caption:
      "Grey outlines: the p=1 ball (diamond) and the p=∞ ball (square). Between them, all unit p-balls are nested. Drag v and watch ‖v‖p.",
  },
};

/**
 * The unit ball {‖v‖_p ≤ 1} in ℝ², with p adjustable from 1 (diamond) through
 * 2 (disk) to ∞ (square). Faint reference outlines for p=1 and p=∞ frame the
 * current shape; a draggable vector shows its own ‖v‖_p shrinking/growing.
 */
export function NormBallWidget({ lang = "fr" }: { lang?: Lang }) {
  const t = L[lang] ?? L.fr;
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
          {t.sup}
        </button>
        <div className="font-mono text-sm text-fg-muted">
          ‖v‖<sub>p</sub> = <span className="text-accent-warm">{nv.toFixed(3)}</span>
        </div>
      </div>

      <Mafs viewBox={{ x: [-1.6, 1.6], y: [-1.6, 1.6] }} height={340}>
        <Coordinates.Cartesian subdivisions={2} />
        <Polygon points={ref1} color={Theme.foreground} fillOpacity={0} strokeOpacity={0.25} />
        <Polygon points={refInf} color={Theme.foreground} fillOpacity={0} strokeOpacity={0.25} />
        <Polygon points={ball} color={Theme.blue} fillOpacity={0.18} />
        {v.element}
      </Mafs>

      <div className="mt-2 text-xs text-fg-dim">{t.caption}</div>
    </div>
  );
}
