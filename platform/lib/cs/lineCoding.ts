// Line-coding engine: turn a bit string into drawable waveform steps for
// NRZ, Manchester, differential Manchester, and multi-level NRZ.
//
// Conventions are explicit because exams fix their own: the booleans below
// mirror the sentence the statement uses (« le premier bit est considéré
// comme bit d'initialisation, dans le sens montant »).

export type WaveStep = {
  /** start/end of the step, in bit-time units (one bit = 1.0) */
  x0: number;
  x1: number;
  /** level in [-1, 1] (multi-level uses the real voltage scaled) */
  y: number;
};

export function parseBits(s: string): number[] {
  return s
    .split("")
    .filter((c) => c === "0" || c === "1")
    .map((c) => (c === "1" ? 1 : 0));
}

/** NRZ: 1 → high, 0 → low (invert to flip). */
export function nrz(bits: number[], invert = false): WaveStep[] {
  return bits.map((b, i) => ({
    x0: i,
    x1: i + 1,
    y: (b === 1) !== invert ? 1 : -1,
  }));
}

/**
 * Manchester: a transition in the middle of every bit.
 * With `oneIsRising` (default), a 1 is low-then-high (rising mid-bit edge)
 * and a 0 is high-then-low — flip the flag for the other textbook convention.
 */
export function manchester(bits: number[], oneIsRising = true): WaveStep[] {
  const steps: WaveStep[] = [];
  bits.forEach((b, i) => {
    const rising = (b === 1) === oneIsRising;
    steps.push({ x0: i, x1: i + 0.5, y: rising ? -1 : 1 });
    steps.push({ x0: i + 0.5, x1: i + 1, y: rising ? 1 : -1 });
  });
  return steps;
}

/**
 * Differential Manchester: always a mid-bit transition (the clock); a 0 adds
 * a transition at the START of the interval, a 1 does not. `initRising`
 * fixes the very first mid-bit transition direction (the annale says
 * « sens montant » for the initialization bit).
 */
export function manchesterDiff(bits: number[], initRising = true): WaveStep[] {
  const steps: WaveStep[] = [];
  // level entering the current bit interval
  let level = initRising ? -1 : 1;
  bits.forEach((b, i) => {
    if (i > 0 && b === 0) level = -level; // transition at interval start
    steps.push({ x0: i, x1: i + 0.5, y: level });
    level = -level; // the guaranteed mid-bit (clock) transition
    steps.push({ x0: i + 0.5, x1: i + 1, y: level });
  });
  return steps;
}

/**
 * Multi-level NRZ with valence V = 2^bitsPerSymbol. Levels follow the course
 * table for V=8 (000→−8 V … 111→+8 V); other valences use a symmetric ladder.
 * Returns steps whose y is scaled to [-1, 1], plus the symbol labels.
 */
export function nrzMultiLevel(
  bits: number[],
  bitsPerSymbol: number,
): { steps: WaveStep[]; symbols: { label: string; volts: number }[]; levels: number[] } {
  const V = 2 ** bitsPerSymbol;
  const levels =
    V === 8
      ? [-8, -5, -3, -1, 1, 3, 5, 8] // the course's own table
      : Array.from({ length: V }, (_, k) => 2 * k - (V - 1)); // symmetric ladder
  const maxAbs = Math.max(...levels.map(Math.abs));
  const steps: WaveStep[] = [];
  const symbols: { label: string; volts: number }[] = [];
  for (let i = 0; i + bitsPerSymbol <= bits.length; i += bitsPerSymbol) {
    const group = bits.slice(i, i + bitsPerSymbol);
    const idx = group.reduce((acc, b) => acc * 2 + b, 0);
    const volts = levels[idx];
    symbols.push({ label: group.join(""), volts });
    const s = i / bitsPerSymbol;
    steps.push({ x0: s, x1: s + 1, y: volts / maxAbs });
  }
  return { steps, symbols, levels };
}
