"use client";

import { useMemo, useState } from "react";

type Mode = "nilpotence" | "diagonalisation" | "trace" | "rang";

const language = {
  fr: {
    apply: "Appliquer D",
    reset: "Recommencer",
    degree: "degré",
    eigen: "Directions propres",
    transpose: "Transposée",
    symmetric: "Partie symétrique",
    skew: "Partie antisymétrique",
    rank: "rang",
  },
  es: {
    apply: "Aplicar D",
    reset: "Reiniciar",
    degree: "grado",
    eigen: "Direcciones propias",
    transpose: "Transpuesta",
    symmetric: "Parte simétrica",
    skew: "Parte antisimétrica",
    rank: "rango",
  },
  en: {
    apply: "Apply D",
    reset: "Reset",
    degree: "degree",
    eigen: "Eigen-directions",
    transpose: "Transpose",
    symmetric: "Symmetric part",
    skew: "Skew-symmetric part",
    rank: "rank",
  },
} as const;

function currentLanguage() {
  if (typeof document === "undefined") return language.fr;
  const locale = document.documentElement.lang;
  return language[locale as keyof typeof language] ?? language.fr;
}

function Matrix({ values }: { values: number[][] }) {
  return (
    <span className="inline-grid grid-cols-2 gap-x-3 rounded border border-border px-3 py-1 font-mono text-sm">
      {values.flat().map((value, index) => (
        <span key={index}>{Number.isInteger(value) ? value : value.toFixed(1)}</span>
      ))}
    </span>
  );
}

function NilpotenceDemo() {
  const t = currentLanguage();
  const [step, setStep] = useState(0);
  const derivatives = [
    [1, 2, 1],
    [2, 2, 0],
    [2, 0, 0],
    [0, 0, 0],
  ];
  const labels = ["1 + 2X + X²", "2 + 2X", "2", "0"];
  const coefficients = derivatives[step];

  return (
    <div className="widget-frame">
      <div className="p-5">
        <div className="mb-3 font-mono text-lg">D<sup>{step}</sup>p = {labels[step]}</div>
        <div className="grid grid-cols-3 gap-2">
          {coefficients.map((value, index) => (
            <div
              key={index}
              className={`rounded border p-3 text-center font-mono ${
                value === 0 ? "border-border text-fg-dim" : "border-accent text-accent"
              }`}
            >
              {value}X<sup>{index}</sup>
            </div>
          ))}
        </div>
      </div>
      <div className="widget-controls">
        <button className="btn btn-accent" onClick={() => setStep((value) => Math.min(3, value + 1))}>
          {t.apply}
        </button>
        <button className="btn btn-ghost" onClick={() => setStep(0)}>{t.reset}</button>
        <span className="widget-readout">{t.degree}: {step === 3 ? "−∞" : 2 - step}</span>
      </div>
    </div>
  );
}

function DiagonalisationDemo() {
  const t = currentLanguage();
  const [lambda1, setLambda1] = useState(2);
  const [lambda2, setLambda2] = useState(-1);
  const scale = 32;

  return (
    <div className="widget-frame">
      <svg viewBox="-170 -120 340 240" className="block w-full bg-bg-elevated" role="img" aria-label={t.eigen}>
        <line x1="-160" y1="0" x2="160" y2="0" stroke="var(--border-strong)" />
        <line x1="0" y1="-110" x2="0" y2="110" stroke="var(--border-strong)" />
        <line x1={-3 * scale} y1={0} x2={3 * scale} y2={0} stroke="var(--accent)" strokeWidth="3" />
        <line x1={0} y1={-3 * scale} x2={0} y2={3 * scale} stroke="var(--accent-warm)" strokeWidth="3" />
        <path d={`M0 0 L${lambda1 * scale} 0`} stroke="var(--accent)" strokeWidth="7" />
        <path d={`M0 0 L0 ${-lambda2 * scale}`} stroke="var(--accent-warm)" strokeWidth="7" />
        <text x="8" y="-92" fill="var(--fg-muted)">λ₂e₂</text>
        <text x="92" y="-8" fill="var(--fg-muted)">λ₁e₁</text>
      </svg>
      <div className="widget-controls">
        <label>λ₁ <input type="range" min="-3" max="3" step="0.5" value={lambda1} onChange={(event) => setLambda1(Number(event.target.value))} /></label>
        <label>λ₂ <input type="range" min="-3" max="3" step="0.5" value={lambda2} onChange={(event) => setLambda2(Number(event.target.value))} /></label>
        <span className="widget-readout">diag({lambda1}, {lambda2})</span>
      </div>
    </div>
  );
}

function TraceDemo() {
  const t = currentLanguage();
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(-1);
  const [d, setD] = useState(3);
  const matrix = [[a, b], [c, d]];
  const transpose = [[a, c], [b, d]];
  const symmetric = [[a, (b + c) / 2], [(b + c) / 2, d]];
  const skew = [[0, (b - c) / 2], [(c - b) / 2, 0]];

  return (
    <div className="widget-frame">
      <div className="grid gap-5 p-5 md:grid-cols-3">
        <div><div className="mb-2 text-sm text-fg-muted">M</div><Matrix values={matrix} /></div>
        <div><div className="mb-2 text-sm text-fg-muted">{t.symmetric}</div><Matrix values={symmetric} /></div>
        <div><div className="mb-2 text-sm text-fg-muted">{t.skew}</div><Matrix values={skew} /></div>
      </div>
      <div className="widget-controls">
        {[a, b, c, d].map((value, index) => (
          <label key={index}>
            {["a", "b", "c", "d"][index]}
            <input
              className="quiz-input !min-h-0 !w-16"
              type="number"
              value={value}
              onChange={(event) => [setA, setB, setC, setD][index](Number(event.target.value))}
            />
          </label>
        ))}
        <span className="widget-readout">tr(M) = {a + d} · det(M) = {a * d - b * c}</span>
      </div>
      <div className="widget-hint">{t.transpose}: [{transpose.flat().join(", ")}] · M = S + K</div>
    </div>
  );
}

function RankDemo() {
  const t = currentLanguage();
  const [parameter, setParameter] = useState(0.5);
  const determinant = useMemo(() => 2 * parameter - 1, [parameter]);
  const rank = Math.abs(determinant) < 0.001 ? 1 : 2;
  const origin = { x: 150, y: 115 };

  return (
    <div className="widget-frame">
      <svg viewBox="0 0 300 230" className="block w-full bg-bg-elevated" role="img" aria-label={`${t.rank} ${rank}`}>
        <line x1="10" y1={origin.y} x2="290" y2={origin.y} stroke="var(--border-strong)" />
        <line x1={origin.x} y1="10" x2={origin.x} y2="220" stroke="var(--border-strong)" />
        <line x1={origin.x} y1={origin.y} x2={origin.x + 80} y2={origin.y - 40} stroke="var(--accent)" strokeWidth="5" />
        <line x1={origin.x} y1={origin.y} x2={origin.x + 40} y2={origin.y - 40 * parameter} stroke="var(--accent-warm)" strokeWidth="5" />
        <text x="220" y="68" fill="var(--accent)">u = (2, 1)</text>
        <text x="170" y="145" fill="var(--accent-warm)">v = (1, t)</text>
      </svg>
      <div className="widget-controls">
        <label>t <input type="range" min="-2" max="2" step="0.1" value={parameter} onChange={(event) => setParameter(Number(event.target.value))} /></label>
        <span className="widget-readout">det(u,v) = {determinant.toFixed(1)} · {t.rank} = {rank}</span>
      </div>
    </div>
  );
}

export function LinearAlgebraWidget({ mode }: { mode: Mode }) {
  if (mode === "nilpotence") return <NilpotenceDemo />;
  if (mode === "diagonalisation") return <DiagonalisationDemo />;
  if (mode === "trace") return <TraceDemo />;
  return <RankDemo />;
}
