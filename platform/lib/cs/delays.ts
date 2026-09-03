// Chronogram engine for the "délais et débits" widget: one sender A, one
// store-and-forward router R, one receiver B. Times in milliseconds, sizes in
// bits, rates in bit/s. Pure functions — the widget only draws.

export type ChronoInput = {
  /** packet sizes in bits, sent back-to-back by A in this order */
  sizesBits: number[];
  /** rate of link A→R and R→B, in bit/s */
  rate1: number;
  rate2: number;
  /** one-way propagation delay of each link, in ms */
  prop1Ms: number;
  prop2Ms: number;
};

export type PacketTimeline = {
  /** index in the input */
  i: number;
  sizeBits: number;
  /** A starts / finishes pushing the packet onto link 1 (ms) */
  tx1Start: number;
  tx1End: number;
  /** last bit fully received by R (ms) */
  atRouter: number;
  /** R starts / finishes pushing onto link 2 (ms) — store-and-forward + FIFO */
  tx2Start: number;
  tx2End: number;
  /** last bit fully received by B (ms) */
  atDest: number;
};

export type Chronogram = {
  packets: PacketTimeline[];
  /** arrival of the very last bit at B (ms) */
  totalMs: number;
  /** total useful bits / total time, in bit/s */
  effectiveRate: number;
};

export function chronogram(input: ChronoInput): Chronogram {
  const { sizesBits, rate1, rate2, prop1Ms, prop2Ms } = input;
  const packets: PacketTimeline[] = [];
  let link1Free = 0;
  let link2Free = 0;
  for (let i = 0; i < sizesBits.length; i++) {
    const s = sizesBits[i];
    const tt1 = (s / rate1) * 1000;
    const tt2 = (s / rate2) * 1000;
    const tx1Start = link1Free;
    const tx1End = tx1Start + tt1;
    link1Free = tx1End;
    const atRouter = tx1End + prop1Ms;
    const tx2Start = Math.max(atRouter, link2Free);
    const tx2End = tx2Start + tt2;
    link2Free = tx2End;
    const atDest = tx2End + prop2Ms;
    packets.push({ i, sizeBits: s, tx1Start, tx1End, atRouter, tx2Start, tx2End, atDest });
  }
  const totalMs = packets.length ? packets[packets.length - 1].atDest : 0;
  const totalBits = sizesBits.reduce((a, b) => a + b, 0);
  return {
    packets,
    totalMs,
    effectiveRate: totalMs > 0 ? totalBits / (totalMs / 1000) : 0,
  };
}

/** Split `totalBits` into n equal packets (last one takes the remainder). */
export function splitPackets(totalBits: number, n: number): number[] {
  const base = Math.floor(totalBits / n);
  const out = Array(n).fill(base);
  out[n - 1] += totalBits - base * n;
  return out;
}
