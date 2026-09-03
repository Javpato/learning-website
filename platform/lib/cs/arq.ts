// ARQ engine: a small discrete-event simulation of an HDLC-style link,
// faithful to the exam conventions of the annale (transmission time 3T for
// every frame, negligible propagation, acknowledgements carried by the N(R)
// of I frames — no spontaneous RR in REJ/SREJ mode, exactly like the
// corrigé's chronograms). Stop-and-wait mode adds explicit RR frames and a
// retransmission timer instead.

export type ArqMode = "sw" | "rej" | "srej";

export type ArqFrame = {
  from: "A" | "B";
  kind: "I" | "RR" | "REJ" | "SREJ";
  /** N(S) for I frames; the requested/expected N for RR/REJ/SREJ */
  ns: number;
  /** N(R) piggybacked on I frames (next expected from the peer) */
  nr: number;
  t0: number;
  t1: number;
  tArr: number;
  corrupted: boolean;
};

export type ArqInput = {
  mode: ArqMode;
  /** number of I frames each side wants to send */
  nA: number;
  nB: number;
  /** emission start time of each side */
  startA: number;
  startB: number;
  /** transmission time of any frame (I or S), in T units */
  txTime: number;
  /** one-way propagation, in T units */
  prop: number;
  /** frames corrupted on their FIRST transmission, e.g. [{from:"A", ns:2}] */
  corrupted: { from: "A" | "B"; ns: number }[];
  /** stop-and-wait timeout (from end of emission), in T units */
  timeout: number;
};

type Station = {
  name: "A" | "B";
  /** I-frame numbers still to send, in order */
  pending: number[];
  /** control frames waiting for the line */
  controls: { kind: "RR" | "REJ" | "SREJ"; ns: number }[];
  sentOnce: Set<number>;
  maxSent: number;
  expected: number; // next N(S) expected from the peer
  buffered: Set<number>; // srej only
  rejOutstanding: boolean;
  srejAsked: Set<number>;
  busyUntil: number;
  start: number;
  /** stop-and-wait: waiting for RR of this frame (or null) */
  waitingAck: number | null;
  timerAt: number | null;
};

export function simulateArq(input: ArqInput): ArqFrame[] {
  const frames: ArqFrame[] = [];
  const mk = (name: "A" | "B", n: number, start: number): Station => ({
    name,
    pending: Array.from({ length: n }, (_, i) => i),
    controls: [],
    sentOnce: new Set(),
    maxSent: -1,
    expected: 0,
    buffered: new Set(),
    rejOutstanding: false,
    srejAsked: new Set(),
    busyUntil: 0,
    start,
    waitingAck: null,
    timerAt: null,
  });
  const A = mk("A", input.nA, input.startA);
  const B = mk("B", input.nB, input.startB);
  const peerOf = (s: Station) => (s.name === "A" ? B : A);
  const corrupt = new Set(input.corrupted.map((c) => `${c.from}${c.ns}`));

  type Arrival = { at: number; frame: ArqFrame };
  const inFlight: Arrival[] = [];

  const canSend = (s: Station, now: number): boolean => {
    if (now < s.start || now < s.busyUntil) return false;
    if (s.controls.length > 0) return true;
    if (s.pending.length === 0) return false;
    if (input.mode === "sw" && s.waitingAck !== null) return false;
    return true;
  };

  const emit = (s: Station, now: number) => {
    let frame: ArqFrame;
    if (s.controls.length > 0) {
      const c = s.controls.shift()!;
      frame = {
        from: s.name,
        kind: c.kind,
        ns: c.ns,
        nr: s.expected,
        t0: now,
        t1: now + input.txTime,
        tArr: now + input.txTime + input.prop,
        corrupted: false,
      };
    } else {
      const ns = s.pending.shift()!;
      const isFirst = !s.sentOnce.has(ns);
      s.sentOnce.add(ns);
      s.maxSent = Math.max(s.maxSent, ns);
      const corrupted = isFirst && corrupt.has(`${s.name}${ns}`);
      frame = {
        from: s.name,
        kind: "I",
        ns,
        nr: s.expected,
        t0: now,
        t1: now + input.txTime,
        tArr: now + input.txTime + input.prop,
        corrupted,
      };
      if (input.mode === "sw") {
        s.waitingAck = ns;
        s.timerAt = frame.t1 + input.timeout;
      }
    }
    s.busyUntil = frame.t1;
    frames.push(frame);
    inFlight.push({ at: frame.tArr, frame });
  };

  const receive = (s: Station, f: ArqFrame) => {
    if (f.corrupted) return; // unreadable — the receiver cannot even name it
    if (f.kind === "I") {
      if (f.ns === s.expected) {
        s.expected++;
        if (input.mode === "srej") {
          while (s.buffered.has(s.expected)) {
            s.buffered.delete(s.expected);
            s.expected++;
          }
        }
        if (input.mode === "rej") s.rejOutstanding = false;
        if (input.mode === "sw") s.controls.push({ kind: "RR", ns: s.expected });
      } else if (f.ns > s.expected) {
        if (input.mode === "rej") {
          if (!s.rejOutstanding) {
            s.controls.push({ kind: "REJ", ns: s.expected });
            s.rejOutstanding = true;
          }
        } else if (input.mode === "srej") {
          s.buffered.add(f.ns);
          for (let m = s.expected; m < f.ns; m++) {
            if (!s.srejAsked.has(m) && !s.buffered.has(m)) {
              s.srejAsked.add(m);
              s.controls.push({ kind: "SREJ", ns: m });
            }
          }
        } else if (input.mode === "sw") {
          // cannot happen with window 1
        }
      }
      // duplicates (ns < expected) are discarded silently
    }
    // RR / REJ / SREJ act on the station that RECEIVES them (it must resend)
    if (f.kind === "RR" && input.mode === "sw") {
      if (s.waitingAck !== null && f.ns > s.waitingAck) {
        s.waitingAck = null;
        s.timerAt = null;
      }
    }
    if (f.kind === "REJ") {
      // resend every frame from ns to maxSent, then whatever was unsent
      const resend: number[] = [];
      for (let m = f.ns; m <= s.maxSent; m++) resend.push(m);
      s.pending = [...resend, ...s.pending.filter((x) => x > s.maxSent)];
    }
    if (f.kind === "SREJ") {
      s.pending = [f.ns, ...s.pending.filter((x) => x !== f.ns)];
    }
  };

  let guard = 0;
  for (;;) {
    if (guard++ > 400) break;
    const now = (() => {
      const candidates: number[] = [];
      for (const s of [A, B]) {
        if (canSend(s, Math.max(s.start, s.busyUntil))) {
          candidates.push(Math.max(s.start, s.busyUntil));
        }
        if (s.timerAt !== null) candidates.push(s.timerAt);
      }
      for (const a of inFlight) candidates.push(a.at);
      return candidates.length ? Math.min(...candidates) : null;
    })();
    if (now === null) break;

    // 1. deliver arrivals due now (before anyone transmits at the same instant)
    const due = inFlight.filter((a) => a.at <= now).sort((a, b) => a.at - b.at);
    for (const a of due) {
      inFlight.splice(inFlight.indexOf(a), 1);
      receive(a.frame.from === "A" ? B : A, a.frame);
    }
    // 2. stop-and-wait timers
    for (const s of [A, B]) {
      if (s.timerAt !== null && s.timerAt <= now && s.waitingAck !== null) {
        s.pending = [s.waitingAck, ...s.pending];
        s.waitingAck = null;
        s.timerAt = null;
      }
    }
    // 3. let each free station transmit
    let sent = false;
    for (const s of [A, B]) {
      if (canSend(s, now) && Math.max(s.start, s.busyUntil) <= now) {
        emit(s, now);
        sent = true;
      }
    }
    if (!sent && due.length === 0) {
      // nothing happened at `now` (e.g. a timer that was already cleared):
      // avoid an infinite loop by dropping stale timers
      for (const s of [A, B]) if (s.timerAt !== null && s.timerAt <= now) s.timerAt = null;
      if (inFlight.length === 0) {
        const anySendable = [A, B].some((s) => canSend(s, now + 1e-9));
        if (!anySendable) break;
      }
    }
  }
  return frames.sort((a, b) => a.t0 - b.t0);
}

/** The annale's exact scenario: A sends 4 frames (n°2 corrupted), B sends 2. */
export function annaleScenario(mode: "rej" | "srej"): ArqInput {
  return {
    mode,
    nA: 4,
    nB: 2,
    startA: 0,
    startB: 4,
    txTime: 3,
    prop: 0,
    corrupted: [{ from: "A", ns: 2 }],
    timeout: 6,
  };
}
