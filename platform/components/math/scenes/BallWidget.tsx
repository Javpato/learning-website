"use client";

import { useState } from "react";
import { Mafs, Coordinates, Polygon, Text, Theme, useMovablePoint } from "mafs";
import { pNorm, unitBallPolygon, type Pt } from "@/lib/math/topology";

type Lang = "fr" | "es" | "en";

const PS: { label: string; p: number }[] = [
  { label: "‖·‖₁", p: 1 },
  { label: "‖·‖₂", p: 2 },
  { label: "‖·‖∞", p: Infinity },
];

const L: Record<Lang, { open: string; closed: string; inMsg: string; outMsg: string; caption: string }> = {
  fr: {
    open: "ouverte (<)",
    closed: "fermée (≤)",
    inMsg: "oui — y est dans la boule",
    outMsg: "non — y est hors de la boule",
    caption:
      "Frontière en pointillés = boule ouverte (le bord n'en fait pas partie) ; trait plein = boule fermée. Change la norme : la forme change, pas l'idée.",
  },
  es: {
    open: "abierta (<)",
    closed: "cerrada (≤)",
    inMsg: "sí — y está en la bola",
    outMsg: "no — y está fuera de la bola",
    caption:
      "Frontera punteada = bola abierta (el borde no le pertenece); trazo continuo = bola cerrada. Cambia la norma: cambia la forma, no la idea.",
  },
  en: {
    open: "open (<)",
    closed: "closed (≤)",
    inMsg: "yes — y is in the ball",
    outMsg: "no — y is outside the ball",
    caption:
      "Dashed boundary = open ball (the edge is not included); solid line = closed ball. Change the norm: the shape changes, not the idea.",
  },
};

/** B(0, r) for a chosen norm, open or closed, with a zoom slider and a test point. */
export function BallWidget({ lang = "fr" }: { lang?: Lang }) {
  const t = L[lang] ?? L.fr;
  const [pi, setPi] = useState(1);
  const [r, setR] = useState(1.5);
  const [open, setOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const y = useMovablePoint([1, 0.6]);

  const p = PS[pi].p;
  const ball: Pt[] = unitBallPolygon(p, 160).map(([x, yy]) => [x * r, yy * r]);
  const half = 2.6 / zoom;
  const ny = pNorm([y.point[0], y.point[1]], p);
  const inside = open ? ny < r : ny <= r;

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {PS.map((s, i) => (
            <button key={s.label} type="button" onClick={() => setPi(i)} className={i === pi ? "btn btn-accent" : "btn"}>
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} className={open ? "btn btn-accent" : "btn"}>
          {open ? t.open : t.closed}
        </button>
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>r = {r.toFixed(2)}</span>
          <input type="range" min={0.3} max={2.4} step={0.05} value={r} onChange={(e) => setR(Number(e.target.value))} className="accent-[color:var(--accent)]" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-fg-muted">
          <span>zoom ×{zoom.toFixed(0)}</span>
          <input type="range" min={1} max={16} step={1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="accent-[color:var(--accent)]" />
        </label>
      </div>

      <Mafs viewBox={{ x: [-half, half], y: [-half, half] }} height={340}>
        <Coordinates.Cartesian subdivisions={2} />
        <Polygon points={ball} color={Theme.blue} fillOpacity={0.16} strokeStyle={open ? "dashed" : "solid"} />
        {y.element}
        <Text x={y.point[0]} y={y.point[1]} attach="ne" size={13} color={inside ? Theme.green : Theme.red}>
          {inside ? "∈ B" : "∉ B"}
        </Text>
      </Mafs>

      <div className="mt-2 font-mono text-sm text-fg-muted">
        ‖y‖ = <span className="text-fg">{ny.toFixed(3)}</span> {open ? "< r ?" : "≤ r ?"}{" "}
        <span className={inside ? "text-success" : "text-danger"}>{inside ? t.inMsg : t.outMsg}</span>
      </div>
      <div className="mt-1 text-xs text-fg-dim">{t.caption}</div>
    </div>
  );
}
