"use client";

// Chronogram of a transfer A → R → B through a store-and-forward router,
// drawn exactly like the exam diagrams (time flows downward). The "partiel"
// preset is the 2023 midterm: 30 KB as 10 KB + 20 KB over 10 then 5 Mbit/s,
// 6600 km per link. Free mode splits the same file into n equal packets to
// show the pipeline effect.

import { useMemo, useState } from "react";
import { chronogram, splitPackets } from "@/lib/cs/delays";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    preset: "scénario",
    partiel: "partiel : p1 = 10 KB, p2 = 20 KB",
    equal: "n paquets égaux",
    packets: "paquets",
    total: "dernier bit chez B",
    rate: "débit effectif",
    legend: "bande = émission d'un paquet sur le lien ; pente = propagation (22 ms)",
    hint: "Le routeur attend le dernier bit d'un paquet avant de le réémettre (store-and-forward), et il ne sert qu'un paquet à la fois : regarde où les bandes s'empilent.",
    linkA: "lien A→R : 10 Mbit/s",
    linkB: "lien R→B : 5 Mbit/s",
    wait: "attente",
    aria: "chronogramme de commutation de paquets",
  },
  en: {
    preset: "scenario",
    partiel: "midterm: p1 = 10 KB, p2 = 20 KB",
    equal: "n equal packets",
    packets: "packets",
    total: "last bit at B",
    rate: "effective throughput",
    legend: "band = a packet being pushed onto a link; slant = propagation (22 ms)",
    hint: "The router waits for a packet's last bit before re-sending it (store-and-forward), and serves one packet at a time: watch where the bands pile up.",
    linkA: "link A→R: 10 Mbit/s",
    linkB: "link R→B: 5 Mbit/s",
    wait: "waiting",
    aria: "packet-switching timing diagram",
  },
  es: {
    preset: "escenario",
    partiel: "parcial: p1 = 10 KB, p2 = 20 KB",
    equal: "n paquetes iguales",
    packets: "paquetes",
    total: "último bit en B",
    rate: "caudal efectivo",
    legend: "banda = emisión de un paquete en un enlace; pendiente = propagación (22 ms)",
    hint: "El router espera el último bit de un paquete antes de reenviarlo (store-and-forward) y sirve un paquete a la vez: mira dónde se apilan las bandas.",
    linkA: "enlace A→R: 10 Mbit/s",
    linkB: "enlace R→B: 5 Mbit/s",
    wait: "espera",
    aria: "cronograma de conmutación de paquetes",
  },
};

const TOTAL_BITS = 240000; // 30 KB × 8
const COLORS = ["var(--accent)", "var(--accent-warm)", "var(--success)", "var(--danger)"];

export function PacketSwitchWidget({ preset = "partiel" }: { preset?: "partiel" | "pipeline" }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [mode, setMode] = useState<"partiel" | "equal">(preset === "pipeline" ? "equal" : "partiel");
  const [n, setN] = useState(preset === "pipeline" ? 3 : 2);

  const sizes = mode === "partiel" ? [80000, 160000] : splitPackets(TOTAL_BITS, n);
  const chrono = useMemo(
    () => chronogram({ sizesBits: sizes, rate1: 1e7, rate2: 5e6, prop1Ms: 22, prop2Ms: 22 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, n],
  );

  // geometry: time ↓, three lifelines A, R, B
  const W = 560;
  const H = 340;
  const xA = 90;
  const xR = 280;
  const xB = 470;
  const top = 34;
  const tMax = Math.max(chrono.totalMs, 1);
  const y = (ms: number) => top + (ms / tMax) * (H - top - 16);

  return (
    <div className="widget-frame">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} style={{ width: "100%", display: "block" }}>
        {[
          { x: xA, label: "A" },
          { x: xR, label: "R" },
          { x: xB, label: "B" },
        ].map((c) => (
          <g key={c.label}>
            <line x1={c.x} y1={top - 8} x2={c.x} y2={H - 8} stroke="var(--border-strong)" strokeWidth={1} />
            <text x={c.x} y={top - 16} textAnchor="middle" fill="var(--fg)" fontSize={14} fontFamily="var(--font-mono, monospace)">
              {c.label}
            </text>
          </g>
        ))}
        {chrono.packets.map((p) => {
          const col = COLORS[p.i % COLORS.length];
          return (
            <g key={p.i} opacity={0.9}>
              {/* link 1 band */}
              <polygon
                points={`${xA},${y(p.tx1Start)} ${xA},${y(p.tx1End)} ${xR},${y(p.atRouter)} ${xR},${y(p.tx1Start + 22)}`}
                fill={col}
                opacity={0.35}
              />
              <line x1={xA} y1={y(p.tx1Start)} x2={xR} y2={y(p.tx1Start + 22)} stroke={col} strokeWidth={1.5} />
              <line x1={xA} y1={y(p.tx1End)} x2={xR} y2={y(p.atRouter)} stroke={col} strokeWidth={1.5} />
              {/* waiting at router (FIFO) */}
              {p.tx2Start > p.atRouter + 1e-9 && (
                <line x1={xR} y1={y(p.atRouter)} x2={xR} y2={y(p.tx2Start)} stroke={col} strokeWidth={4} strokeDasharray="3 3" opacity={0.8} />
              )}
              {/* link 2 band */}
              <polygon
                points={`${xR},${y(p.tx2Start)} ${xR},${y(p.tx2End)} ${xB},${y(p.tx2End + 22)} ${xB},${y(p.tx2Start + 22)}`}
                fill={col}
                opacity={0.35}
              />
              <line x1={xR} y1={y(p.tx2Start)} x2={xB} y2={y(p.tx2Start + 22)} stroke={col} strokeWidth={1.5} />
              <line x1={xR} y1={y(p.tx2End)} x2={xB} y2={y(p.atDest)} stroke={col} strokeWidth={1.5} />
              <text x={xB + 8} y={y(p.atDest) + 4} fill={col} fontSize={11} fontFamily="var(--font-mono, monospace)">
                {`p${p.i + 1} : ${p.atDest.toFixed(0)} ms`}
              </text>
            </g>
          );
        })}
        <text x={xA} y={H - 2} fill="var(--fg-dim)" fontSize={10}>{t.linkA}</text>
        <text x={xR} y={H - 2} fill="var(--fg-dim)" fontSize={10}>{t.linkB}</text>
      </svg>
      <div className="widget-controls">
        <label>
          {t.preset}
          <select value={mode} onChange={(e) => setMode(e.target.value as "partiel" | "equal")}>
            <option value="partiel">{t.partiel}</option>
            <option value="equal">{t.equal}</option>
          </select>
        </label>
        {mode === "equal" && (
          <label>
            {t.packets}
            <input type="range" min={1} max={8} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} />
            <span className="widget-readout">{n}</span>
          </label>
        )}
        <span className="widget-readout">
          {t.total} = {chrono.totalMs.toFixed(1)} ms · {t.rate} ={" "}
          {(chrono.effectiveRate / 1e6).toFixed(2)} Mbit/s
        </span>
      </div>
      <div className="widget-hint">
        {t.legend}. {t.hint}
      </div>
    </div>
  );
}
