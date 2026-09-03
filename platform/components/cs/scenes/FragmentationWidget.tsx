"use client";

// Fragmentation calculator: a datagram's data crosses a chain of networks
// with shrinking MTUs; every stage's fragment table (Total Length, MF,
// Fragment Offset) is recomputed live with the multiple-of-8 rule visible.
// Presets: the final exam's cascade (annale) and TD5's 4096 → 1024 → 512.

import { useMemo, useState } from "react";
import { fragmentChain } from "@/lib/cs/ipv4";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    preset: "scénario",
    annale: "annale — 2048 octets, MTU 1010 puis 504",
    td5: "TD 5 — 2000 octets, MTU 4096, 1024, 512",
    libre: "libre",
    data: "données du datagramme",
    mtus: "MTU des réseaux traversés (datagramme maxi)",
    stage: "réseau",
    original: "au départ",
    frag: "fragment",
    len: "Longueur totale",
    mf: "MF",
    off: "Décalage",
    dataCol: "données",
    hint: "La règle qui décide tout : les données d'un fragment doivent être un multiple de 8 octets (le décalage se code en unités de 8), sauf pour le morceau qui TERMINE un fragment — lui garde le reste, et hérite du drapeau MF de son parent.",
    octets: "octets",
    aria: "fragmentation IP",
  },
  en: {
    preset: "scenario",
    annale: "past paper — 2048 bytes, MTU 1010 then 504",
    td5: "TD 5 — 2000 bytes, MTU 4096, 1024, 512",
    libre: "free play",
    data: "datagram data",
    mtus: "MTUs of the crossed networks (max datagram)",
    stage: "network",
    original: "at the start",
    frag: "fragment",
    len: "Total Length",
    mf: "MF",
    off: "Offset",
    dataCol: "data",
    hint: "The rule that decides everything: a fragment's data must be a multiple of 8 bytes (the offset is coded in 8-byte units) — except the piece that ENDS a fragment, which keeps the remainder and inherits its parent's MF flag.",
    octets: "bytes",
    aria: "IP fragmentation",
  },
  es: {
    preset: "escenario",
    annale: "examen — 2048 octetos, MTU 1010 y 504",
    td5: "TD 5 — 2000 octetos, MTU 4096, 1024, 512",
    libre: "libre",
    data: "datos del datagrama",
    mtus: "MTU de las redes atravesadas (datagrama máximo)",
    stage: "red",
    original: "al inicio",
    frag: "fragmento",
    len: "Longitud total",
    mf: "MF",
    off: "Desplazamiento",
    dataCol: "datos",
    hint: "La regla que lo decide todo: los datos de un fragmento deben ser múltiplo de 8 octetos (el desplazamiento se codifica en unidades de 8), salvo el trozo que TERMINA un fragmento: conserva el resto y hereda la bandera MF de su padre.",
    octets: "octetos",
    aria: "fragmentación IP",
  },
};

const PRESETS: Record<string, { data: number; mtus: number[] }> = {
  annale: { data: 2048, mtus: [1010, 504] },
  td5: { data: 2000, mtus: [4096, 1024, 512] },
  libre: { data: 1400, mtus: [1500, 620] },
};

const COLORS = ["var(--accent)", "var(--success)", "var(--accent-warm)", "var(--danger)"];

export function FragmentationWidget({ preset = "annale" }: { preset?: "annale" | "td5" | "libre" }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [key, setKey] = useState<string>(preset);
  const [data, setData] = useState(PRESETS[preset].data);
  const [mtusText, setMtusText] = useState(PRESETS[preset].mtus.join(", "));

  const selectPreset = (k: string) => {
    setKey(k);
    setData(PRESETS[k].data);
    setMtusText(PRESETS[k].mtus.join(", "));
  };

  const mtus = useMemo(
    () =>
      mtusText
        .split(/[,\s]+/)
        .map(Number)
        .filter((x) => Number.isFinite(x) && x >= 68)
        .slice(0, 4),
    [mtusText],
  );
  const stages = useMemo(() => fragmentChain(data, mtus), [data, mtus]);

  const W = 560;
  const barH = 22;
  const scale = (W - 40) / (data + 20);

  return (
    <div className="widget-frame">
      <svg
        viewBox={`0 0 ${W} ${stages.length * (barH + 26) + 10}`}
        role="img"
        aria-label={t.aria}
        style={{ width: "100%", display: "block" }}
      >
        {stages.map((frags, s) => {
          let x = 20;
          const yTop = 8 + s * (barH + 26);
          return (
            <g key={s}>
              <text x={20} y={yTop + 10} fill="var(--fg-dim)" fontSize={10}>
                {s === 0 ? t.original : `${t.stage} ${s} — MTU ${mtus[s - 1]}`}
              </text>
              {frags.map((f, i) => {
                const wH = 20 * scale;
                const wD = f.dataLength * scale;
                const g = (
                  <g key={i}>
                    <rect x={x} y={yTop + 12} width={wH} height={barH - 8} fill="var(--fg-dim)" opacity={0.8} />
                    <rect
                      x={x + wH}
                      y={yTop + 12}
                      width={Math.max(wD, 2)}
                      height={barH - 8}
                      fill={COLORS[i % COLORS.length]}
                      opacity={0.55}
                      stroke="var(--border-strong)"
                    />
                    {wD > 40 && (
                      <text
                        x={x + wH + wD / 2}
                        y={yTop + 12 + (barH - 8) / 2 + 3.5}
                        textAnchor="middle"
                        fill="var(--fg)"
                        fontSize={9.5}
                        fontFamily="var(--font-mono, monospace)"
                      >
                        {f.dataLength}
                      </text>
                    )}
                  </g>
                );
                x += wH + Math.max(wD, 2) + 4;
                return g;
              })}
            </g>
          );
        })}
      </svg>
      <div style={{ padding: "0 1rem", overflowX: "auto" }}>
        <table style={{ fontSize: "0.8rem", width: "100%" }}>
          <thead>
            <tr>
              <th>{t.frag}</th>
              <th>{t.len}</th>
              <th>{t.dataCol}</th>
              <th>{t.mf}</th>
              <th>{t.off} (×8 {t.octets})</th>
            </tr>
          </thead>
          <tbody>
            {stages[stages.length - 1].map((f, i) => (
              <tr key={i}>
                <td className="widget-readout">{i + 1}</td>
                <td className="widget-readout">{f.totalLength}</td>
                <td className="widget-readout">{f.dataLength}</td>
                <td className="widget-readout">{f.mf}</td>
                <td className="widget-readout">
                  {f.offsetUnits} (= {f.offsetUnits * 8} {t.octets})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="widget-controls">
        <label>
          {t.preset}
          <select value={key} onChange={(e) => selectPreset(e.target.value)}>
            <option value="annale">{t.annale}</option>
            <option value="td5">{t.td5}</option>
            <option value="libre">{t.libre}</option>
          </select>
        </label>
        <label>
          {t.data}
          <input
            type="number"
            min={8}
            max={4000}
            value={data}
            onChange={(e) => {
              setKey("libre");
              setData(Math.max(8, Number(e.target.value) || 8));
            }}
            style={{ width: "5rem" }}
          />
        </label>
        <label>
          {t.mtus}
          <input
            value={mtusText}
            onChange={(e) => {
              setKey("libre");
              setMtusText(e.target.value);
            }}
            size={14}
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          />
        </label>
      </div>
      <div className="widget-hint">{t.hint}</div>
    </div>
  );
}
