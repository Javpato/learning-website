"use client";

// The SEQ/ACK machine: a TCP exchange drawn as the exam's sequence diagrams.
// Presets: the course's own handshake (ISN 78 / 1005), TD6's exchange at
// MSS 512 (300 + 200 + 12 bytes, first data segment lost, Go-Back-N
// retransmission), and free play where you pick the sizes and the victim.

import { useMemo, useState } from "react";
import { playTcp, type TcpSend } from "@/lib/cs/tcp";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    preset: "scénario",
    handshake: "ouverture en trois temps (cours : ISN 78 et 1005)",
    td6: "TD 6 — 300 + 200 + 12 octets, 1er segment perdu",
    libre: "libre",
    isnA: "ISN de A",
    isnB: "ISN de B",
    sizes: "tailles envoyées par A (octets)",
    lost: "segment perdu",
    none: "aucun",
    number: "n°",
    byteShort: "o",
    aria: "échange TCP",
    hint: "SEQ numérote le PREMIER octet du segment ; ACK annonce le PROCHAIN octet attendu (tout ce qui précède est reçu). SYN et FIN consomment un numéro, voilà pourquoi la réponse à SYN x acquitte x+1.",
    lostNote: "segment perdu — le temporisateur de retransmission arme",
    retransNote: "retransmission après temporisateur",
    cumulativeNote: "tout est enfin acquitté d'un coup (ACK cumulatif)",
  },
  en: {
    preset: "scenario",
    handshake: "three-way handshake (course: ISN 78 and 1005)",
    td6: "TD 6 — 300 + 200 + 12 bytes, first data segment lost",
    libre: "free play",
    isnA: "A's ISN",
    isnB: "B's ISN",
    sizes: "sizes sent by A (bytes)",
    lost: "lost segment",
    none: "none",
    number: "no.",
    byteShort: "B",
    aria: "TCP exchange",
    hint: "SEQ numbers the segment's FIRST byte; ACK announces the NEXT byte expected (everything before it arrived). SYN and FIN consume one number — that is why the reply to SYN x acknowledges x+1.",
    lostNote: "segment lost — the retransmission timer arms",
    retransNote: "retransmission after timeout",
    cumulativeNote: "everything is finally acknowledged at once (cumulative ACK)",
  },
  es: {
    preset: "escenario",
    handshake: "apertura en tres fases (curso: ISN 78 y 1005)",
    td6: "TD 6 — 300 + 200 + 12 octetos, primer segmento perdido",
    libre: "libre",
    isnA: "ISN de A",
    isnB: "ISN de B",
    sizes: "tamaños enviados por A (octetos)",
    lost: "segmento perdido",
    none: "ninguno",
    number: "n.º",
    byteShort: "o",
    aria: "intercambio TCP",
    hint: "SEQ numera el PRIMER octeto del segmento; ACK anuncia el SIGUIENTE octeto esperado (todo lo anterior llegó). SYN y FIN consumen un número: por eso la respuesta a SYN x acusa x+1.",
    lostNote: "segmento perdido — se arma el temporizador de retransmisión",
    retransNote: "retransmisión tras vencer el temporizador",
    cumulativeNote: "por fin se acusa todo de una vez (ACK acumulativo)",
  },
};

type PresetKey = "handshake" | "td6" | "libre";

export function TcpSeqWidget({ preset = "td6" }: { preset?: PresetKey }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [key, setKey] = useState<PresetKey>(preset);
  const [isnA, setIsnA] = useState(preset === "handshake" ? 78 : 1023);
  const [isnB, setIsnB] = useState(preset === "handshake" ? 1005 : 4999);
  const [sizesText, setSizesText] = useState("300, 200, 12");
  const [lostIdx, setLostIdx] = useState<number>(preset === "td6" ? 0 : -1);

  const selectPreset = (k: PresetKey) => {
    setKey(k);
    if (k === "handshake") {
      setIsnA(78);
      setIsnB(1005);
    } else {
      setIsnA(1023);
      setIsnB(4999);
      setSizesText("300, 200, 12");
      setLostIdx(k === "td6" ? 0 : -1);
    }
  };

  const sizes = useMemo(
    () =>
      sizesText
        .split(/[,\s]+/)
        .map(Number)
        .filter((x) => Number.isFinite(x) && x > 0)
        .slice(0, 5),
    [sizesText],
  );

  const segs = useMemo(() => {
    const script: TcpSend[] = [
      { from: "A", len: 0, flags: ["SYN"] },
      { from: "B", len: 0, flags: ["SYN", "ACK"] },
      { from: "A", len: 0, flags: ["ACK"] },
    ];
    if (key !== "handshake") {
      sizes.forEach((len, i) => script.push({ from: "A", len, flags: ["ACK", "PSH"], lost: i === lostIdx }));
    }
    return playTcp(isnA, isnB, script);
  }, [key, isnA, isnB, sizes, lostIdx]);

  const W = 560;
  const rowH = 40;
  const H = segs.length * rowH + 46;
  const xA = 110;
  const xB = 450;

  return (
    <div className="widget-frame">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} style={{ width: "100%", display: "block" }}>
        <text x={xA} y={20} textAnchor="middle" fill="var(--fg)" fontSize={14} fontFamily="var(--font-mono, monospace)">A</text>
        <text x={xB} y={20} textAnchor="middle" fill="var(--fg)" fontSize={14} fontFamily="var(--font-mono, monospace)">B</text>
        <line x1={xA} y1={28} x2={xA} y2={H - 10} stroke="var(--border-strong)" />
        <line x1={xB} y1={28} x2={xB} y2={H - 10} stroke="var(--border-strong)" />
        <defs>
          <marker id="tcpArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--fg-muted)" />
          </marker>
        </defs>
        {segs.map((s, i) => {
          const y0 = 40 + i * rowH;
          const y1 = y0 + rowH - 18;
          const fromA = s.from === "A";
          const color = s.lost ? "var(--danger)" : s.retrans ? "var(--accent-warm)" : "var(--accent)";
          const label = `${s.flags.filter((f) => f !== "PSH").join("+")}${s.flags.includes("PSH") ? "" : ""} SEQ=${s.seq}${s.len ? `(${s.len})` : ""}${s.ack !== null ? ` ACK=${s.ack}` : ""}`;
          const midX = (xA + xB) / 2;
          const endX = s.lost ? midX : fromA ? xB : xA;
          const endY = s.lost ? (y0 + y1) / 2 : y1;
          return (
            <g key={i}>
              <line
                x1={fromA ? xA : xB}
                y1={y0}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth={1.6}
                strokeDasharray={s.lost ? "5 4" : undefined}
                markerEnd={s.lost ? undefined : "url(#tcpArrow)"}
              />
              {s.lost && (
                <text x={midX + 8} y={endY + 4} fill="var(--danger)" fontSize={14}>✕</text>
              )}
              <text
                x={midX}
                y={y0 - 4}
                textAnchor="middle"
                fill={color}
                fontSize={11}
                fontFamily="var(--font-mono, monospace)"
              >
                {label}
              </text>
              {s.note && (
                <text x={midX} y={y0 + 10} textAnchor="middle" fill="var(--fg-dim)" fontSize={9}>
                  {s.note === "retransmission-timeout" ? t.retransNote : t.cumulativeNote}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="widget-controls">
        <label>
          {t.preset}
          <select value={key} onChange={(e) => selectPreset(e.target.value as PresetKey)}>
            <option value="handshake">{t.handshake}</option>
            <option value="td6">{t.td6}</option>
            <option value="libre">{t.libre}</option>
          </select>
        </label>
        <label>
          {t.isnA}
          <input type="number" value={isnA} onChange={(e) => setIsnA(Number(e.target.value) || 0)} style={{ width: "5rem" }} />
        </label>
        <label>
          {t.isnB}
          <input type="number" value={isnB} onChange={(e) => setIsnB(Number(e.target.value) || 0)} style={{ width: "5rem" }} />
        </label>
        {key !== "handshake" && (
          <>
            <label>
              {t.sizes}
              <input
                value={sizesText}
                onChange={(e) => {
                  setKey("libre");
                  setSizesText(e.target.value);
                }}
                size={10}
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              />
            </label>
            <label>
              {t.lost}
              <select
                value={lostIdx}
                onChange={(e) => {
                  setKey("libre");
                  setLostIdx(Number(e.target.value));
                }}
              >
                <option value={-1}>{t.none}</option>
                {sizes.map((sz, i) => (
                  <option key={i} value={i}>
                    {t.number}{i + 1} ({sz} {t.byteShort})
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>
      <div className="widget-hint">{t.hint}</div>
    </div>
  );
}
