"use client";

// cwnd across the RTTs: slow start's doubling, the ss_thresh ceiling,
// congestion avoidance's +1, and what a timeout or 3 duplicate ACKs cost.
// Click a round to inject (or remove) a loss there; compare Tahoe and Reno.

import { useMemo, useState } from "react";
import { congestionTrace, type CongestionEvent } from "@/lib/cs/tcp";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    variant: "variante",
    thresh: "seuil initial ss_thresh",
    click: "clique une colonne : rien → timeout → 3 ACK dupliqués → rien",
    phaseSs: "démarrage lent",
    phaseAv: "évitement",
    phaseLoss: "perte",
    hint: "Le démarrage lent double cwnd à chaque RTT jusqu'au seuil (ligne pointillée), puis l'évitement ajoute 1 MSS par RTT. Un timeout renvoie cwnd à 1 et divise le seuil par 2 ; avec Reno, 3 ACK dupliqués repartent du nouveau seuil au lieu de 1 — compare les deux variantes sur la même perte.",
    round: "RTT n°",
    mss: "MSS",
    inUnit: "en",
    aria: "fenêtre de congestion",
  },
  en: {
    variant: "variant",
    thresh: "initial ss_thresh",
    click: "click a column: none → timeout → 3 duplicate ACKs → none",
    phaseSs: "slow start",
    phaseAv: "avoidance",
    phaseLoss: "loss",
    hint: "Slow start doubles cwnd every RTT up to the threshold (dashed line), then avoidance adds 1 MSS per RTT. A timeout sends cwnd back to 1 and halves the threshold; with Reno, 3 duplicate ACKs restart from the new threshold instead of 1 — compare both variants on the same loss.",
    round: "RTT #",
    mss: "MSS",
    inUnit: "in",
    aria: "congestion window",
  },
  es: {
    variant: "variante",
    thresh: "umbral inicial ss_thresh",
    click: "haz clic en una columna: nada → timeout → 3 ACK duplicados → nada",
    phaseSs: "arranque lento",
    phaseAv: "evitación",
    phaseLoss: "pérdida",
    hint: "El arranque lento duplica cwnd en cada RTT hasta el umbral (línea punteada); luego la evitación añade 1 MSS por RTT. Un timeout devuelve cwnd a 1 y divide el umbral entre 2; con Reno, 3 ACK duplicados reparten del nuevo umbral en vez de 1 — compara ambas variantes con la misma pérdida.",
    round: "RTT n.º",
    mss: "MSS",
    inUnit: "en",
    aria: "ventana de congestión",
  },
};

const ROUNDS = 26;

export function CongestionWidget({ preset = "cours" }: { preset?: "cours" | "libre" }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [variant, setVariant] = useState<"tahoe" | "reno">("reno");
  const [thresh, setThresh] = useState(16);
  const [events, setEvents] = useState<Map<number, "timeout" | "3dup">>(
    () => new Map(preset === "cours" ? [[9, "timeout" as const]] : []),
  );

  const trace = useMemo(
    () =>
      congestionTrace(
        ROUNDS,
        thresh,
        [...events.entries()].map(([round, kind]): CongestionEvent => ({ round, kind })),
        variant,
      ),
    [thresh, events, variant],
  );

  const cycleEvent = (round: number) => {
    const next = new Map(events);
    const cur = next.get(round);
    if (!cur) next.set(round, "timeout");
    else if (cur === "timeout") next.set(round, "3dup");
    else next.delete(round);
    setEvents(next);
  };

  const W = 600;
  const H = 240;
  const x0 = 40;
  const y0 = H - 34;
  const plotW = W - x0 - 10;
  const maxY = Math.max(...trace.map((p) => Math.max(p.cwnd, p.ssthresh)), 8) + 2;
  const colW = plotW / ROUNDS;
  const Y = (v: number) => y0 - (v / maxY) * (y0 - 18);

  const phaseColor = (p: (typeof trace)[number]) =>
    p.event ? "var(--danger)" : p.phase === "slow-start" ? "var(--accent)" : "var(--success)";

  return (
    <div className="widget-frame">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} style={{ width: "100%", display: "block" }}>
        <line x1={x0} y1={y0} x2={W - 8} y2={y0} stroke="var(--border-strong)" />
        <line x1={x0} y1={y0} x2={x0} y2={12} stroke="var(--border-strong)" />
        {[0, Math.round(maxY / 2), Math.round(maxY)].map((v) => (
          <g key={v}>
            <text x={x0 - 6} y={Y(v) + 3.5} textAnchor="end" fill="var(--fg-dim)" fontSize={10} fontFamily="var(--font-mono, monospace)">
              {v}
            </text>
            <line x1={x0} y1={Y(v)} x2={W - 8} y2={Y(v)} stroke="var(--border)" strokeDasharray="1 5" />
          </g>
        ))}
        {/* ssthresh staircase */}
        <path
          d={trace
            .map((p, i) => `${i === 0 ? "M" : "L"} ${x0 + i * colW} ${Y(p.ssthresh)} L ${x0 + (i + 1) * colW} ${Y(p.ssthresh)}`)
            .join(" ")}
          fill="none"
          stroke="var(--accent-warm)"
          strokeDasharray="5 4"
          strokeWidth={1.4}
        />
        {/* cwnd columns + polyline */}
        {trace.map((p, i) => (
          <g key={i} onClick={() => cycleEvent(i)} style={{ cursor: "pointer" }}>
            <rect x={x0 + i * colW + 1} y={12} width={colW - 2} height={y0 - 12} fill="transparent" />
            <rect
              x={x0 + i * colW + 2}
              y={Y(p.cwnd)}
              width={colW - 4}
              height={y0 - Y(p.cwnd)}
              fill={phaseColor(p)}
              opacity={0.35}
            />
            {p.event && (
              <text x={x0 + (i + 0.5) * colW} y={Y(p.cwnd) - 6} textAnchor="middle" fill="var(--danger)" fontSize={10} fontWeight={700}>
                {p.event === "timeout" ? "T" : "3d"}
              </text>
            )}
          </g>
        ))}
        <path
          d={trace.map((p, i) => `${i === 0 ? "M" : "L"} ${x0 + (i + 0.5) * colW} ${Y(p.cwnd)}`).join(" ")}
          fill="none"
          stroke="var(--fg)"
          strokeWidth={1.6}
        />
        <text x={W - 10} y={Y(trace[trace.length - 1].ssthresh) - 5} textAnchor="end" fill="var(--accent-warm)" fontSize={10}>
          ss_thresh
        </text>
        <text x={(x0 + W) / 2} y={H - 6} textAnchor="middle" fill="var(--fg-dim)" fontSize={10}>
          {t.round} 0 … {ROUNDS - 1} — cwnd {t.inUnit} {t.mss}
        </text>
      </svg>
      <div className="widget-controls">
        <label>
          {t.variant}
          <select value={variant} onChange={(e) => setVariant(e.target.value as "tahoe" | "reno")}>
            <option value="reno">TCP Reno</option>
            <option value="tahoe">TCP Tahoe</option>
          </select>
        </label>
        <label>
          {t.thresh}
          <input type="range" min={2} max={32} step={1} value={thresh} onChange={(e) => setThresh(Number(e.target.value))} />
          <span className="widget-readout">{thresh} {t.mss}</span>
        </label>
        <span className="widget-readout" style={{ color: "var(--accent)" }}>■ {t.phaseSs}</span>
        <span className="widget-readout" style={{ color: "var(--success)" }}>■ {t.phaseAv}</span>
        <span className="widget-readout" style={{ color: "var(--danger)" }}>■ {t.phaseLoss}</span>
      </div>
      <div className="widget-hint">
        {t.click}. {t.hint}
      </div>
    </div>
  );
}
