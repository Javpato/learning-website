"use client";

// Line coding explorer: type a bit sequence, see it as NRZ, Manchester,
// differential Manchester, or multi-level NRZ (valence 8, the course's own
// voltage table). The readout keeps R (bauds) and D (bit/s) visible so the
// learner always connects the drawing to D = R · log2 V.

import { useMemo, useState } from "react";
import {
  manchester,
  manchesterDiff,
  nrz,
  nrzMultiLevel,
  parseBits,
  type WaveStep,
} from "@/lib/cs/lineCoding";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    bits: "bits",
    scheme: "codage",
    nrz: "NRZ (2 niveaux)",
    man: "Manchester",
    mandiff: "Manchester différentiel",
    v8: "NRZ à 8 niveaux (valence 8)",
    duration: "durée d'un symbole",
    conv: "convention : 1 = front montant",
    convDiff: "bit d'initialisation montant",
    baud: "rapidité",
    debit: "débit",
    hint: "La rapidité de modulation compte les symboles par seconde ; le débit compte les bits. Ils ne coïncident que si chaque symbole porte exactement 1 bit — passe en valence 8 pour voir 3 bits voyager par symbole.",
    invalid: "saisis uniquement des 0 et des 1 (max 24 bits)",
    aria: "codage en ligne",
  },
  en: {
    bits: "bits",
    scheme: "coding",
    nrz: "NRZ (2 levels)",
    man: "Manchester",
    mandiff: "Differential Manchester",
    v8: "8-level NRZ (valence 8)",
    duration: "symbol duration",
    conv: "convention: 1 = rising edge",
    convDiff: "rising initialization bit",
    baud: "modulation rate",
    debit: "bit rate",
    hint: "The modulation rate counts symbols per second; the bit rate counts bits. They only match when each symbol carries exactly 1 bit — switch to valence 8 to watch 3 bits ride one symbol.",
    invalid: "enter only 0s and 1s (max 24 bits)",
    aria: "line coding",
  },
  es: {
    bits: "bits",
    scheme: "codificación",
    nrz: "NRZ (2 niveles)",
    man: "Manchester",
    mandiff: "Manchester diferencial",
    v8: "NRZ de 8 niveles (valencia 8)",
    duration: "duración de un símbolo",
    conv: "convención: 1 = flanco de subida",
    convDiff: "bit de inicialización de subida",
    baud: "rapidez",
    debit: "caudal",
    hint: "La rapidez de modulación cuenta símbolos por segundo; el caudal cuenta bits. Solo coinciden si cada símbolo lleva exactamente 1 bit: pasa a valencia 8 para ver 3 bits viajar en un símbolo.",
    invalid: "escribe solo 0 y 1 (máx. 24 bits)",
    aria: "codificación de línea",
  },
};

type Scheme = "nrz" | "man" | "mandiff" | "v8";

export function LineCodingWidget({ preset = "annale" }: { preset?: "annale" | "libre" }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [text, setText] = useState(preset === "annale" ? "011110011001100" : "10110010");
  const [scheme, setScheme] = useState<Scheme>("mandiff");
  const [durationMs, setDurationMs] = useState(5);
  const [oneRising, setOneRising] = useState(true);

  const bits = useMemo(() => parseBits(text).slice(0, 24), [text]);

  const { steps, labels, bitsPerSymbol, symbolCount } = useMemo(() => {
    if (scheme === "v8") {
      const ml = nrzMultiLevel(bits, 3);
      return {
        steps: ml.steps,
        labels: ml.symbols.map((s) => `${s.label}→${s.volts > 0 ? "+" : ""}${s.volts}V`),
        bitsPerSymbol: 3,
        symbolCount: ml.symbols.length,
      };
    }
    const s: WaveStep[] =
      scheme === "nrz" ? nrz(bits) : scheme === "man" ? manchester(bits, oneRising) : manchesterDiff(bits, oneRising);
    return { steps: s, labels: bits.map(String), bitsPerSymbol: 1, symbolCount: bits.length };
  }, [bits, scheme, oneRising]);

  const R = 1000 / durationMs; // bauds
  const D = R * bitsPerSymbol;

  const W = 560;
  const H = 170;
  const x0 = 24;
  const plotW = W - x0 - 12;
  const unit = symbolCount > 0 ? plotW / symbolCount : plotW;
  const yMid = 92;
  const amp = 52;
  const X = (u: number) => x0 + u * unit * (scheme === "v8" ? 1 : 1);

  // build the polyline (with vertical joins between steps)
  const path = steps
    .map((s, i) => {
      const y = yMid - s.y * amp;
      const start = `${i === 0 ? "M" : "L"} ${X(s.x0)} ${y}`;
      return `${start} L ${X(s.x1)} ${y}`;
    })
    .join(" ");

  return (
    <div className="widget-frame">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria} style={{ width: "100%", display: "block" }}>
        <line x1={x0} y1={yMid} x2={W - 12} y2={yMid} stroke="var(--border)" strokeWidth={1} />
        {Array.from({ length: symbolCount + 1 }, (_, i) => (
          <line key={i} x1={X(i)} y1={20} x2={X(i)} y2={H - 26} stroke="var(--border)" strokeDasharray="2 4" />
        ))}
        {(scheme === "man" || scheme === "mandiff") &&
          Array.from({ length: symbolCount }, (_, i) => (
            <line key={`m${i}`} x1={X(i + 0.5)} y1={yMid - 6} x2={X(i + 0.5)} y2={yMid + 6} stroke="var(--fg-dim)" strokeWidth={1} />
          ))}
        {labels.map((lab, i) => (
          <text
            key={i}
            x={X(i + 0.5)}
            y={14}
            textAnchor="middle"
            fill="var(--fg-muted)"
            fontSize={scheme === "v8" ? 8.5 : 11}
            fontFamily="var(--font-mono, monospace)"
          >
            {lab}
          </text>
        ))}
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} />
        <text x={x0} y={H - 8} fill="var(--fg-dim)" fontSize={10} fontFamily="var(--font-mono, monospace)">
          Δ = {durationMs} ms
        </text>
      </svg>
      <div className="widget-controls">
        <label>
          {t.bits}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            size={18}
            style={{ fontFamily: "var(--font-mono, monospace)" }}
            aria-invalid={parseBits(text).length === 0}
          />
        </label>
        <label>
          {t.scheme}
          <select value={scheme} onChange={(e) => setScheme(e.target.value as Scheme)}>
            <option value="nrz">{t.nrz}</option>
            <option value="man">{t.man}</option>
            <option value="mandiff">{t.mandiff}</option>
            <option value="v8">{t.v8}</option>
          </select>
        </label>
        {(scheme === "man" || scheme === "mandiff") && (
          <label>
            <input type="checkbox" checked={oneRising} onChange={(e) => setOneRising(e.target.checked)} />
            {scheme === "man" ? t.conv : t.convDiff}
          </label>
        )}
        <label>
          {t.duration}
          <input type="range" min={1} max={10} step={1} value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
          <span className="widget-readout">{durationMs} ms</span>
        </label>
        <span className="widget-readout">
          {t.baud} R = {R.toFixed(0)} Bd · {t.debit} D = {D.toFixed(0)} bit/s
        </span>
      </div>
      <div className="widget-hint">{parseBits(text).length === 0 ? t.invalid : t.hint}</div>
    </div>
  );
}
