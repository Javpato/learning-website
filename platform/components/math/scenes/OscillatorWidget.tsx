"use client";

// Damped harmonic oscillator explorer (lesson: oscillateur harmonique).
// Sliders m, k, γ; the x(t) curve, the phase portrait (x, v) and the damping
// ratio ζ update live, with the regime named. A resonance tab (extension)
// plots the forced steady-state amplitude A(ω).

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Plot, Polyline, Theme } from "mafs";
import { timeSeries, throughPoint } from "@/lib/math/odes";

const T_MAX = 12;

export function OscillatorWidget() {
  const [m, setM] = useState(1);
  const [k, setK] = useState(4);
  const [gamma, setGamma] = useState(0.6);
  const [tab, setTab] = useState<"temps" | "phase" | "resonance">("temps");

  const omega0 = Math.sqrt(k / m);
  const zeta = gamma / (2 * Math.sqrt(m * k));
  const regime =
    gamma === 0
      ? "conservatif (γ = 0)"
      : zeta < 0.999
        ? "sous-amorti (ζ < 1)"
        : zeta <= 1.001
          ? "critique (ζ = 1)"
          : "sur-amorti (ζ > 1)";

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
    <div
      className="widget-frame"
      role="group"
      aria-label="Oscillateur harmonique amorti : réglages m, k, γ ; courbe x(t), portrait de phase et courbe de résonance"
    >
      {tab === "temps" && (
        <Mafs viewBox={{ x: [0, T_MAX], y: [-2, 2] }} height={300} preserveAspectRatio={false}>
          <Coordinates.Cartesian subdivisions={2} xAxis={{ labels: (x) => (x % 2 === 0 ? x : "") }} />
          <Polyline points={xt.filter(([t]) => t <= T_MAX)} color={Theme.blue} weight={2} />
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
          Portrait (x, v)
        </button>
        <button type="button" className={tab === "resonance" ? "btn btn-accent" : "btn"} onClick={() => setTab("resonance")}>
          Résonance A(ω)
        </button>
      </div>
      <div className="widget-controls">
        <label>
          <span>m = {m.toFixed(1)}</span>
          <input type="range" min={0.5} max={3} step={0.1} value={m} onChange={(e) => setM(Number(e.target.value))} aria-label="Masse m" />
        </label>
        <label>
          <span>k = {k.toFixed(1)}</span>
          <input type="range" min={0.5} max={9} step={0.1} value={k} onChange={(e) => setK(Number(e.target.value))} aria-label="Raideur k" />
        </label>
        <label>
          <span>γ = {gamma.toFixed(2)}</span>
          <input type="range" min={0} max={6} step={0.05} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} aria-label="Coefficient d'amortissement gamma" />
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
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          ω₀ = {omega0.toFixed(2)} · ζ = γ/(2√(mk)) = {zeta.toFixed(2)} · régime : <strong>{regime}</strong>
        </span>
      </div>
      <p className="widget-hint">
        Défi : règle γ pour atteindre exactement le régime critique
        (ζ = 1, soit γ = 2√(mk) = {(2 * Math.sqrt(m * k)).toFixed(2)} ici) —
        c&apos;est le retour à l&apos;équilibre le plus rapide sans
        oscillation. Sur l&apos;onglet résonance, que devient le pic quand γ
        diminue ? Et où se place-t-il par rapport à ω₀ = √(k/m) ?
      </p>
    </div>
  );
}
