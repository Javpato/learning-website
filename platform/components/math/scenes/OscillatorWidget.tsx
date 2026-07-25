"use client";

// Damped harmonic oscillator explorer (lesson: oscillateur harmonique).
// Sliders m, k, γ; the x(t) curve, the phase portrait (x, v) and the damping
// ratio ζ update live, with the regime named. A resonance tab (extension)
// plots the forced steady-state amplitude A(ω).

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Polyline, Theme } from "mafs";
import { timeSeries, throughPoint } from "@/lib/math/odes";
import { useLocale } from "@/components/learn/useLocale";
import { learnUi } from "@/lib/learn/ui";
import type { Locale } from "@/lib/i18n/config";

const T_MAX = 12;

const T: Record<
  Locale,
  {
    groupLabel: string;
    phaseTab: string;
    resonanceTab: string;
    massAria: string;
    stiffnessAria: string;
    dampingAria: string;
    regimeLabel: string;
    regimes: { conservative: string; under: string; critical: string; over: string };
    hintA: string;
    hintB: string;
  }
> = {
  fr: {
    groupLabel:
      "Oscillateur harmonique amorti : réglages m, k, γ ; courbe x(t), portrait de phase et courbe de résonance",
    phaseTab: "Portrait (x, v)",
    resonanceTab: "Résonance A(ω)",
    massAria: "Masse m",
    stiffnessAria: "Raideur k",
    dampingAria: "Coefficient d'amortissement gamma",
    regimeLabel: "régime :",
    regimes: {
      conservative: "conservatif (γ = 0)",
      under: "sous-amorti (ζ < 1)",
      critical: "critique (ζ = 1)",
      over: "sur-amorti (ζ > 1)",
    },
    hintA:
      "Défi : règle γ pour atteindre exactement le régime critique (ζ = 1, soit γ = 2√(mk) = ",
    hintB:
      " ici) — c'est le retour à l'équilibre le plus rapide sans oscillation. Sur l'onglet résonance, que devient le pic quand γ diminue ? Et où se place-t-il par rapport à ω₀ = √(k/m) ?",
  },
  en: {
    groupLabel:
      "Damped harmonic oscillator: controls m, k, γ; x(t) curve, phase portrait and resonance curve",
    phaseTab: "Portrait (x, v)",
    resonanceTab: "Resonance A(ω)",
    massAria: "Mass m",
    stiffnessAria: "Stiffness k",
    dampingAria: "Damping coefficient gamma",
    regimeLabel: "regime:",
    regimes: {
      conservative: "conservative (γ = 0)",
      under: "underdamped (ζ < 1)",
      critical: "critical (ζ = 1)",
      over: "overdamped (ζ > 1)",
    },
    hintA:
      "Challenge: tune γ to reach exactly the critical regime (ζ = 1, i.e. γ = 2√(mk) = ",
    hintB:
      " here) — this is the fastest return to equilibrium without oscillation. On the resonance tab, what happens to the peak as γ decreases? And where does it sit relative to ω₀ = √(k/m)?",
  },
  es: {
    groupLabel:
      "Oscilador armónico amortiguado: controles m, k, γ; curva x(t), retrato de fase y curva de resonancia",
    phaseTab: "Retrato (x, v)",
    resonanceTab: "Resonancia A(ω)",
    massAria: "Masa m",
    stiffnessAria: "Rigidez k",
    dampingAria: "Coeficiente de amortiguamiento gamma",
    regimeLabel: "régimen:",
    regimes: {
      conservative: "conservativo (γ = 0)",
      under: "subamortiguado (ζ < 1)",
      critical: "crítico (ζ = 1)",
      over: "sobreamortiguado (ζ > 1)",
    },
    hintA:
      "Desafío: ajusta γ para alcanzar exactamente el régimen crítico (ζ = 1, es decir γ = 2√(mk) = ",
    hintB:
      " aquí) — es el retorno al equilibrio más rápido sin oscilación. En la pestaña de resonancia, ¿qué le pasa al pico cuando γ disminuye? ¿Y dónde se sitúa respecto a ω₀ = √(k/m)?",
  },
};

export function OscillatorWidget() {
  const locale = useLocale();
  const t = T[locale];
  const ui = learnUi(locale);
  const [m, setM] = useState(1);
  const [k, setK] = useState(4);
  const [gamma, setGamma] = useState(0.6);
  const [tab, setTab] = useState<"temps" | "phase" | "resonance">("temps");

  const omega0 = Math.sqrt(k / m);
  const zeta = gamma / (2 * Math.sqrt(m * k));
  const regime =
    gamma === 0
      ? t.regimes.conservative
      : zeta < 0.999
        ? t.regimes.under
        : zeta <= 1.001
          ? t.regimes.critical
          : t.regimes.over;

  const xt = useMemo(
    () => timeSeries((x, v) => (-k * x - gamma * v) / m, 1.5, 0, { h: 0.01, steps: 1400 }),
    [m, k, gamma],
  );

  const phase = useMemo(
    () =>
      throughPoint(
        (x, v) => [v, (-k * x - gamma * v) / m],
        1.5,
        0,
        { h: 0.01, steps: 1600, bound: 20 },
      ),
    [m, k, gamma],
  );

  const resonance = useMemo(() => {
    const F0 = 1;
    return (w: number) =>
      F0 / Math.sqrt((k - m * w * w) * (k - m * w * w) + gamma * gamma * w * w);
  }, [m, k, gamma]);

  return (
    <div className="widget-frame" role="group" aria-label={t.groupLabel}>
      {tab === "temps" && (
        <Mafs viewBox={{ x: [0, T_MAX], y: [-2, 2] }} height={300} preserveAspectRatio={false}>
          <Coordinates.Cartesian subdivisions={2} xAxis={{ labels: (x) => (x % 2 === 0 ? x : "") }} />
          <Polyline points={xt.filter(([tt]) => tt <= T_MAX)} color={Theme.blue} weight={2} />
        </Mafs>
      )}
      {tab === "phase" && (
        <Mafs viewBox={{ x: [-2.5, 2.5], y: [-4, 4] }} height={300} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          <Polyline points={phase} color={Theme.green} weight={2} />
        </Mafs>
      )}
      {tab === "resonance" && (
        <Mafs viewBox={{ x: [0, 5], y: [0, 3] }} height={300} preserveAspectRatio={false}>
          <Coordinates.Cartesian subdivisions={2} />
          <Plot.OfX y={(w) => (w >= 0 ? Math.min(resonance(w), 5) : 0)} color={Theme.orange} weight={2} />
        </Mafs>
      )}

      <div className="widget-controls">
        <button type="button" className={tab === "temps" ? "btn btn-accent" : "btn"} onClick={() => setTab("temps")}>
          x(t)
        </button>
        <button type="button" className={tab === "phase" ? "btn btn-accent" : "btn"} onClick={() => setTab("phase")}>
          {t.phaseTab}
        </button>
        <button type="button" className={tab === "resonance" ? "btn btn-accent" : "btn"} onClick={() => setTab("resonance")}>
          {t.resonanceTab}
        </button>
      </div>
      <div className="widget-controls">
        <label>
          <span>m = {m.toFixed(1)}</span>
          <input type="range" min={0.5} max={3} step={0.1} value={m} onChange={(e) => setM(Number(e.target.value))} aria-label={t.massAria} />
        </label>
        <label>
          <span>k = {k.toFixed(1)}</span>
          <input type="range" min={0.5} max={9} step={0.1} value={k} onChange={(e) => setK(Number(e.target.value))} aria-label={t.stiffnessAria} />
        </label>
        <label>
          <span>γ = {gamma.toFixed(2)}</span>
          <input type="range" min={0} max={6} step={0.05} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} aria-label={t.dampingAria} />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setM(1);
            setK(4);
            setGamma(0.6);
            setTab("temps");
          }}
        >
          {ui.reset}
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          ω₀ = {omega0.toFixed(2)} · ζ = γ/(2√(mk)) = {zeta.toFixed(2)} · {t.regimeLabel} <strong>{regime}</strong>
        </span>
      </div>
      <p className="widget-hint">
        {t.hintA}
        {(2 * Math.sqrt(m * k)).toFixed(2)}
        {t.hintB}
      </p>
    </div>
  );
}
