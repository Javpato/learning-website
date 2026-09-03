// TCP engines: (1) SEQ/ACK arithmetic of an exchange — the byte-numbering
// machine of the course (ACK = next byte expected, cumulative; Go-Back-N
// retransmission on timeout, as in TD6 exercise 7); (2) the congestion-window
// trace (slow start / congestion avoidance / Tahoe / Reno).

// ── SEQ/ACK exchange ──────────────────────────────────────────────────────

export type TcpSend = {
  from: "A" | "B";
  /** data bytes (0 for a pure control segment) */
  len: number;
  flags?: ("SYN" | "ACK" | "FIN" | "PSH")[];
  /** lost on first transmission? */
  lost?: boolean;
};

export type TcpSegment = {
  from: "A" | "B";
  seq: number;
  len: number;
  ack: number | null;
  flags: string[];
  lost: boolean;
  /** is this a retransmission? */
  retrans: boolean;
  note?: "retransmission-timeout" | "cumulative-ack-complete";
};

/**
 * Play a scripted exchange. Each side keeps: nextSeq (its own numbering) and
 * expected (peer bytes). SYN and FIN consume one sequence number. A lost data
 * segment is retransmitted after the script ends (timer), Go-Back-N style:
 * every byte from the lost one onward is resent in ONE segment, like the TD6
 * correction. Receivers acknowledge cumulatively; out-of-order data is kept
 * but not acknowledged (duplicate ACKs of the hole).
 */
export function playTcp(
  isnA: number,
  isnB: number,
  script: TcpSend[],
): TcpSegment[] {
  const out: TcpSegment[] = [];
  const st = {
    A: { next: isnA, expected: 0, hasPeerIsn: false, sent: [] as { seq: number; len: number }[] },
    B: { next: isnB, expected: 0, hasPeerIsn: false, sent: [] as { seq: number; len: number }[] },
  };
  let lostFrom: "A" | "B" | null = null;
  let lostSeq = 0;
  let maxSentAfterLoss = 0;

  for (const s of script) {
    const me = st[s.from];
    const peer = st[s.from === "A" ? "B" : "A"];
    const flags = s.flags ?? (s.len > 0 ? ["ACK", "PSH"] : ["ACK"]);
    const seq = me.next;
    const consumes = s.len + (flags.includes("SYN") ? 1 : 0) + (flags.includes("FIN") ? 1 : 0);
    // the ACK carried is "everything received in order so far from the peer"
    const seg: TcpSegment = {
      from: s.from,
      seq,
      len: s.len,
      ack: flags.includes("ACK") ? computeExpected(st, s.from) : null,
      flags,
      lost: Boolean(s.lost),
      retrans: false,
    };
    out.push(seg);
    void peer;
    me.next = seq + consumes;
    if (s.lost && s.len > 0 && lostFrom === null) {
      lostFrom = s.from;
      lostSeq = seq;
    }
    if (!s.lost) {
      // delivered: record for the peer's cumulative expectation
      st[s.from].sent.push({ seq, len: consumes });
    } else {
      st[s.from].sent.push({ seq: -1, len: 0 }); // hole
    }
    if (lostFrom === s.from && !s.lost) maxSentAfterLoss = me.next;
  }

  // timer fires: Go-Back-N — one segment resending every byte from the hole
  if (lostFrom !== null) {
    const me = st[lostFrom];
    const resendLen = me.next - lostSeq;
    out.push({
      from: lostFrom,
      seq: lostSeq,
      len: resendLen,
      ack: computeExpected(st, lostFrom),
      flags: ["ACK", "PSH"],
      lost: false,
      retrans: true,
      note: "retransmission-timeout",
    });
    st[lostFrom].sent = st[lostFrom].sent.map((x) => (x.seq === -1 ? { seq: lostSeq, len: resendLen } : x));
    // final cumulative ACK from the peer
    const peerName = lostFrom === "A" ? "B" : "A";
    out.push({
      from: peerName,
      seq: st[peerName].next,
      len: 0,
      ack: lostSeq + resendLen,
      flags: ["ACK"],
      lost: false,
      retrans: false,
      note: "cumulative-ack-complete",
    });
  }
  return out;
}

/** next in-order byte expected from the peer of `who` (cumulative). */
function computeExpected(
  st: Record<"A" | "B", { sent: { seq: number; len: number }[] }>,
  who: "A" | "B",
): number {
  const peer = st[who === "A" ? "B" : "A"];
  const delivered = peer.sent.filter((x) => x.seq >= 0).sort((a, b) => a.seq - b.seq);
  if (delivered.length === 0) return 0;
  let exp = delivered[0].seq;
  for (const d of delivered) {
    if (d.seq === exp) exp += d.len;
    else if (d.seq < exp) exp = Math.max(exp, d.seq + d.len);
    else break; // hole
  }
  return exp;
}

// ── Congestion window trace ───────────────────────────────────────────────

export type CongestionEvent = { round: number; kind: "timeout" | "3dup" };

export type CongestionPoint = {
  round: number;
  /** cwnd at the START of the round, in MSS units */
  cwnd: number;
  ssthresh: number;
  phase: "slow-start" | "avoidance" | "loss";
  event?: "timeout" | "3dup";
};

/**
 * cwnd round by round. Slow start doubles cwnd each RTT (capped at ssthresh,
 * where congestion avoidance takes over, +1 MSS per RTT). On timeout:
 * ssthresh = max(cwnd/2, 2), cwnd = 1 (both variants). On 3 duplicate ACKs:
 * Tahoe does the same; Reno sets cwnd = ssthresh = max(cwnd/2, 2)
 * (fast retransmit + fast recovery, as summarized in the course).
 */
export function congestionTrace(
  rounds: number,
  ssthresh0: number,
  events: CongestionEvent[],
  variant: "tahoe" | "reno",
): CongestionPoint[] {
  const evByRound = new Map(events.map((e) => [e.round, e.kind]));
  const pts: CongestionPoint[] = [];
  let cwnd = 1;
  let ssthresh = ssthresh0;
  for (let r = 0; r < rounds; r++) {
    const ev = evByRound.get(r);
    const phase: CongestionPoint["phase"] = ev ? "loss" : cwnd < ssthresh ? "slow-start" : "avoidance";
    pts.push({ round: r, cwnd, ssthresh, phase, event: ev });
    if (ev === "timeout") {
      ssthresh = Math.max(Math.floor(cwnd / 2), 2);
      cwnd = 1;
    } else if (ev === "3dup") {
      ssthresh = Math.max(Math.floor(cwnd / 2), 2);
      cwnd = variant === "reno" ? ssthresh : 1;
    } else if (cwnd < ssthresh) {
      cwnd = Math.min(cwnd * 2, ssthresh);
    } else {
      cwnd = cwnd + 1;
    }
  }
  return pts;
}

/** RTTs of pure slow start needed to first reach `target` MSS: ceil(log2). */
export function slowStartRtts(target: number): number {
  return Math.max(0, Math.ceil(Math.log2(Math.max(1, target))));
}
