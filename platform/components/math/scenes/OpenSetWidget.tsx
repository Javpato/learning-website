"use client";

import { useState } from "react";
import { Mafs, Coordinates, Circle, Text, Theme, useMovablePoint } from "mafs";
import { dist, maxFittingRadius, ballInsideDisk, type Pt } from "@/lib/math/topology";

type Lang = "fr" | "es" | "en";

const CENTER: Pt = [0, 0];
const R0 = 2;

const L: Record<Lang, {
  fitBtn: string; fitTitle: string; maxLabel: string;
  inO: string; yes: string; no: string; ballIn: string; ok: string; bad: string;
  msgIn: string; msgOut: string;
}> = {
  fr: {
    fitBtn: "ajuster r au max",
    fitTitle: "règle r juste en dessous du rayon maximal qui tient",
    maxLabel: "rayon max qui tient =",
    inO: "x ∈ O ?", yes: "oui", no: "non",
    ballIn: "B(x, r) ⊆ O ?", ok: "oui ✓", bad: "non ✗ (déborde)",
    msgIn: "x est intérieur : il existe r > 0 (jusqu'au rayon max ci-dessus) tel que B(x,r) ⊆ O. C'est la définition d'« ouvert ».",
    msgOut: "x est sur le bord ou dehors : aucune boule autour de x ne tient dans O.",
  },
  es: {
    fitBtn: "ajustar r al máximo",
    fitTitle: "fija r justo por debajo del radio máximo que cabe",
    maxLabel: "radio máx que cabe =",
    inO: "x ∈ O ?", yes: "sí", no: "no",
    ballIn: "B(x, r) ⊆ O ?", ok: "sí ✓", bad: "no ✗ (se sale)",
    msgIn: "x es interior: existe r > 0 (hasta el radio máx de arriba) tal que B(x,r) ⊆ O. Es la definición de « abierto ».",
    msgOut: "x está en el borde o fuera: ninguna bola alrededor de x cabe en O.",
  },
  en: {
    fitBtn: "set r to max",
    fitTitle: "set r just below the largest fitting radius",
    maxLabel: "largest fitting radius =",
    inO: "x ∈ O ?", yes: "yes", no: "no",
    ballIn: "B(x, r) ⊆ O ?", ok: "yes ✓", bad: "no ✗ (spills)",
    msgIn: "x is interior: there is r > 0 (up to the max radius above) with B(x,r) ⊆ O. That is the definition of 'open'.",
    msgOut: "x is on the boundary or outside: no ball around x fits inside O.",
  },
};

/** O ouvert ⟺ ∀x∈O, ∃r>0, B(x,r) ⊆ O — made visible on the open disk. */
export function OpenSetWidget({ lang = "fr" }: { lang?: Lang }) {
  const t = L[lang] ?? L.fr;
  const [r, setR] = useState(0.6);
  const x = useMovablePoint([0.4, 0.3]);

  const xp: Pt = [x.point[0], x.point[1]];
  const d = dist(xp, CENTER);
  const inside = d < R0;
  const maxR = maxFittingRadius(xp, CENTER, R0);
  const fits = inside && ballInsideDisk(xp, r, CENTER, R0);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>r = {r.toFixed(2)}</span>
          <input type="range" min={0.05} max={2.2} step={0.05} value={r} onChange={(e) => setR(Number(e.target.value))} className="accent-[color:var(--accent)]" />
        </label>
        <button type="button" className="btn" onClick={() => setR(Math.max(0.05, maxR * 0.9))} disabled={!inside} title={t.fitTitle}>
          {t.fitBtn}
        </button>
        <span className="font-mono text-sm text-fg-muted">
          {t.maxLabel}{" "}
          <span className={maxR > 0 ? "text-success" : "text-danger"}>{maxR > 0 ? maxR.toFixed(2) : "0"}</span>
        </span>
      </div>

      <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} height={360}>
        <Coordinates.Cartesian subdivisions={2} />
        <Circle center={CENTER} radius={R0} color={Theme.blue} fillOpacity={0.1} strokeStyle="dashed" />
        <Circle center={xp} radius={r} color={fits ? Theme.green : Theme.red} fillOpacity={0.18} />
        {x.element}
        <Text x={xp[0]} y={xp[1]} attach="ne" size={14} color={Theme.foreground}>x</Text>
      </Mafs>

      <div className="mt-2 font-mono text-sm">
        <span className="text-fg-muted">{t.inO} </span>
        <span className={inside ? "text-success" : "text-danger"}>{inside ? t.yes : t.no}</span>
        <span className="text-fg-muted"> · {t.ballIn} </span>
        <span className={fits ? "text-success" : "text-danger"}>{fits ? t.ok : t.bad}</span>
      </div>
      <div className="mt-1 text-xs text-fg-dim">{inside ? t.msgIn : t.msgOut}</div>
    </div>
  );
}
