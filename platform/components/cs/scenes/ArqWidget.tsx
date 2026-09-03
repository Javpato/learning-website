"use client";

// HDLC chronogram machine. The "annale" presets replay the past paper's exact
// scenario (A sends 4 I frames, frame n°2 corrupted, B sends 2; every frame
// takes 3T; REJ or SREJ recovery) — verified against the corrigé. Free mode
// is a one-way link where you choose the mode and break a frame yourself.
// The time slider hides the future: predict, then reveal.

import { useMemo, useState } from "react";
import { annaleScenario, simulateArq, type ArqInput, type ArqMode } from "@/lib/cs/arq";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    preset: "scénario",
    annaleRej: "annale — rejet simple (REJ)",
    annaleSrej: "annale — rejet sélectif (SREJ)",
    libre: "libre (A vers B)",
    mode: "mode",
    sw: "stop-and-wait",
    rej: "rejet simple",
    srej: "rejet sélectif",
    frames: "trames de A",
    broken: "trame abîmée",
    none: "aucune",
    reveal: "montrer jusqu'à t =",
    hint: "Étiquettes des trames I : « Ixy » = N(S)=x (numéro de la trame), N(R)=y (prochaine trame attendue de l'autre — l'acquittement voyage en passager). Une trame rouge est arrivée abîmée : le récepteur ne peut même pas lire son numéro.",
    count: "trames émises au total",
    aria: "chronogramme ARQ",
  },
  en: {
    preset: "scenario",
    annaleRej: "past paper — go-back-N (REJ)",
    annaleSrej: "past paper — selective reject (SREJ)",
    libre: "free play (A to B)",
    mode: "mode",
    sw: "stop-and-wait",
    rej: "go-back-N",
    srej: "selective reject",
    frames: "frames from A",
    broken: "corrupted frame",
    none: "none",
    reveal: "reveal up to t =",
    hint: "I-frame labels: “Ixy” = N(S)=x (this frame's number), N(R)=y (next frame expected from the peer — the acknowledgement rides along). A red frame arrived corrupted: the receiver cannot even read its number.",
    count: "total frames sent",
    aria: "ARQ timing diagram",
  },
  es: {
    preset: "escenario",
    annaleRej: "examen — rechazo simple (REJ)",
    annaleSrej: "examen — rechazo selectivo (SREJ)",
    libre: "libre (A hacia B)",
    mode: "modo",
    sw: "stop-and-wait",
    rej: "rechazo simple",
    srej: "rechazo selectivo",
    frames: "tramas de A",
    broken: "trama dañada",
    none: "ninguna",
    reveal: "mostrar hasta t =",
    hint: "Etiquetas de las tramas I: «Ixy» = N(S)=x (número de la trama), N(R)=y (siguiente trama esperada del otro — el acuse viaja de pasajero). Una trama roja llegó dañada: el receptor ni siquiera puede leer su número.",
    count: "tramas emitidas en total",
    aria: "cronograma ARQ",
  },
};

type PresetKey = "annale-rej" | "annale-srej" | "libre";

export function ArqWidget({ preset = "annale-rej" }: { preset?: PresetKey }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [key, setKey] = useState<PresetKey>(preset);
  const [mode, setMode] = useState<ArqMode>("rej");
  const [nA, setNA] = useState(4);
  const [broken, setBroken] = useState<number>(1);
  const [reveal, setReveal] = useState(100);

  const input: ArqInput = useMemo(() => {
    if (key === "annale-rej") return annaleScenario("rej");
    if (key === "annale-srej") return annaleScenario("srej");
    return {
      mode,
      nA,
      nB: 0,
      startA: 0,
      startB: 0,
      txTime: 2,
      prop: 1,
      corrupted: broken >= 0 ? [{ from: "A", ns: broken }] : [],
      timeout: 5,
    };
  }, [key, mode, nA, broken]);

  const frames = useMemo(() => simulateArq(input), [input]);
  const tEnd = frames.reduce((m, f) => Math.max(m, f.tArr, f.t1), 1);
  const tShow = (reveal / 100) * tEnd;

  const W = 620;
  const H = 190;
  const x0 = 46;
  const plotW = W - x0 - 14;
  const yA = 46;
  const yB = 150;
  const X = (time: number) => x0 + (time / tEnd) * plotW;

  return (
    <div className="widget-frame">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} style={{ width: "100%", display: "block" }}>
        <text x={14} y={yA + 4} fill="var(--fg)" fontSize={14} fontFamily="var(--font-mono, monospace)">A</text>
        <text x={14} y={yB + 4} fill="var(--fg)" fontSize={14} fontFamily="var(--font-mono, monospace)">B</text>
        <line x1={x0} y1={yA} x2={W - 10} y2={yA} stroke="var(--border-strong)" />
        <line x1={x0} y1={yB} x2={W - 10} y2={yB} stroke="var(--border-strong)" />
        {Array.from({ length: Math.floor(tEnd) + 1 }, (_, i) => (
          <g key={i}>
            <line x1={X(i)} y1={yA - 6} x2={X(i)} y2={yB + 6} stroke="var(--border)" strokeDasharray="1 5" />
            {i % 3 === 0 && (
              <text x={X(i)} y={H - 4} textAnchor="middle" fill="var(--fg-dim)" fontSize={9} fontFamily="var(--font-mono, monospace)">
                {i}
              </text>
            )}
          </g>
        ))}
        {frames
          .filter((f) => f.t0 <= tShow)
          .map((f, i) => {
            const fromA = f.from === "A";
            const yFrom = fromA ? yA : yB;
            const yTo = fromA ? yB : yA;
            const isI = f.kind === "I";
            const color = f.corrupted ? "var(--danger)" : isI ? "var(--accent)" : "var(--accent-warm)";
            const label = isI ? `I${f.ns}${f.nr}` : `${f.kind}${f.ns}`;
            return (
              <g key={i}>
                {/* emission band on the sender's line */}
                <line x1={X(f.t0)} y1={yFrom} x2={X(f.t1)} y2={yFrom} stroke={color} strokeWidth={5} strokeLinecap="round" />
                {/* the frame travelling (last bit) */}
                <line
                  x1={X(f.t1)}
                  y1={yFrom + (fromA ? 3 : -3)}
                  x2={X(f.tArr)}
                  y2={yTo + (fromA ? -3 : 3)}
                  stroke={color}
                  strokeWidth={1.4}
                  strokeDasharray={f.corrupted ? "4 3" : undefined}
                  markerEnd="url(#arqArrow)"
                />
                <text
                  x={(X(f.t0) + X(f.t1)) / 2}
                  y={yFrom + (fromA ? -8 : 16)}
                  textAnchor="middle"
                  fill={color}
                  fontSize={11}
                  fontFamily="var(--font-mono, monospace)"
                >
                  {label}
                </text>
                {f.corrupted && (
                  <text x={X((f.t1 + f.tArr) / 2)} y={(yA + yB) / 2 + 4} textAnchor="middle" fill="var(--danger)" fontSize={13}>
                    ✕
                  </text>
                )}
              </g>
            );
          })}
        <defs>
          <marker id="arqArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--fg-muted)" />
          </marker>
        </defs>
      </svg>
      <div className="widget-controls">
        <label>
          {t.preset}
          <select value={key} onChange={(e) => setKey(e.target.value as PresetKey)}>
            <option value="annale-rej">{t.annaleRej}</option>
            <option value="annale-srej">{t.annaleSrej}</option>
            <option value="libre">{t.libre}</option>
          </select>
        </label>
        {key === "libre" && (
          <>
            <label>
              {t.mode}
              <select value={mode} onChange={(e) => setMode(e.target.value as ArqMode)}>
                <option value="sw">{t.sw}</option>
                <option value="rej">{t.rej}</option>
                <option value="srej">{t.srej}</option>
              </select>
            </label>
            <label>
              {t.frames}
              <input type="range" min={1} max={6} step={1} value={nA} onChange={(e) => setNA(Number(e.target.value))} />
              <span className="widget-readout">{nA}</span>
            </label>
            <label>
              {t.broken}
              <select value={broken} onChange={(e) => setBroken(Number(e.target.value))}>
                <option value={-1}>{t.none}</option>
                {Array.from({ length: nA }, (_, i) => (
                  <option key={i} value={i}>{`I${i}`}</option>
                ))}
              </select>
            </label>
          </>
        )}
        <label>
          {t.reveal}
          <input type="range" min={5} max={100} step={1} value={reveal} onChange={(e) => setReveal(Number(e.target.value))} />
          <span className="widget-readout">{tShow.toFixed(0)} T</span>
        </label>
        <span className="widget-readout">
          {t.count} : {frames.length}
        </span>
      </div>
      <div className="widget-hint">{t.hint}</div>
    </div>
  );
}
