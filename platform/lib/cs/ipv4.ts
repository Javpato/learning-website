// IPv4 arithmetic: addresses, masks, subnets, and the fragmentation
// algorithm — the exact rules the TD corrections apply (offsets in 8-byte
// units, every fragment's data a multiple of 8 except the last).

export function parseIp(s: string): number | null {
  const m = s.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  if (parts.some((p) => p > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function formatIp(x: number): string {
  return [x >>> 24, (x >>> 16) & 255, (x >>> 8) & 255, x & 255].join(".");
}

/** 32-bit binary string, dot every 8 bits. */
export function toBinary(x: number): string {
  const b = (x >>> 0).toString(2).padStart(32, "0");
  return [b.slice(0, 8), b.slice(8, 16), b.slice(16, 24), b.slice(24)].join(".");
}

export function maskFromPrefix(n: number): number {
  return n === 0 ? 0 : (0xffffffff << (32 - n)) >>> 0;
}

/** Historical class of an address: "A" | "B" | "C" | "D" | "E". */
export function classOf(ip: number): string {
  const top = ip >>> 28;
  if ((ip >>> 31) === 0) return "A";
  if ((ip >>> 30) === 0b10) return "B";
  if ((ip >>> 29) === 0b110) return "C";
  if (top === 0b1110) return "D";
  return "E";
}

export function defaultPrefix(ip: number): number | null {
  const c = classOf(ip);
  return c === "A" ? 8 : c === "B" ? 16 : c === "C" ? 24 : null;
}

export type SubnetInfo = {
  network: number;
  broadcast: number;
  firstHost: number;
  lastHost: number;
  hostBits: number;
  hostCount: number; // 2^h − 2 (0 when h < 2)
};

export function subnetInfo(ip: number, prefix: number): SubnetInfo {
  const mask = maskFromPrefix(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hostBits = 32 - prefix;
  const hostCount = hostBits >= 2 ? 2 ** hostBits - 2 : 0;
  return {
    network,
    broadcast,
    firstHost: hostCount ? network + 1 : network,
    lastHost: hostCount ? broadcast - 1 : broadcast,
    hostBits,
    hostCount,
  };
}

/** Bits needed to number at least n subnets: ceil(log2 n). */
export function bitsFor(n: number): number {
  return Math.max(0, Math.ceil(Math.log2(Math.max(1, n))));
}

// ── Fragmentation ─────────────────────────────────────────────────────────

export type Fragment = {
  /** total length of the fragment (header + data), bytes */
  totalLength: number;
  /** data bytes carried */
  dataLength: number;
  /** More Fragments flag */
  mf: 0 | 1;
  /** offset of the first data byte, in 8-byte units */
  offsetUnits: number;
};

/**
 * Fragment one datagram's data through a chain of hops. `maxDatagram[k]` is
 * the largest IP datagram (header + data) hop k accepts. Every fragment's
 * data size is rounded DOWN to a multiple of 8 — except a piece that ends the
 * original fragment, which keeps the remainder and inherits its MF flag.
 * Returns the fragment list after each hop (index 0 = before any hop).
 */
export function fragmentChain(
  dataBytes: number,
  maxDatagram: number[],
  headerBytes = 20,
): Fragment[][] {
  let current: Fragment[] = [
    { totalLength: dataBytes + headerBytes, dataLength: dataBytes, mf: 0, offsetUnits: 0 },
  ];
  const stages: Fragment[][] = [current];
  for (const mtu of maxDatagram) {
    const next: Fragment[] = [];
    for (const frag of current) {
      if (frag.totalLength <= mtu) {
        next.push(frag);
        continue;
      }
      const maxData = 8 * Math.floor((mtu - headerBytes) / 8);
      let remaining = frag.dataLength;
      let offset = frag.offsetUnits;
      while (remaining > 0) {
        const take = remaining > maxData ? maxData : remaining;
        const last = take === remaining;
        next.push({
          totalLength: take + headerBytes,
          dataLength: take,
          mf: last ? frag.mf : 1,
          offsetUnits: offset,
        });
        offset += take / 8; // take is a multiple of 8 except for the last piece
        remaining -= take;
      }
    }
    current = next;
    stages.push(current);
  }
  return stages;
}
