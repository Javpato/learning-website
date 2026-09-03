// Assertions validating the cs/reseaux engines against the professor's own
// corrected numbers (fragment tables, DV iterations, Dijkstra labels,
// REJ/SREJ chronograms, SEQ/ACK, congestion). Run via verify-reseaux.cjs.
const assert = require("assert");
const { chronogram, splitPackets } = require(process.env.RESEAUX_BUILD + "/delays");
const { fragmentChain, parseIp, formatIp, subnetInfo, maskFromPrefix, classOf } = require(process.env.RESEAUX_BUILD + "/ipv4");
const { dvInit, dvExchange, dvCutLink, dijkstraSteps, dijkstraTable, GRAPH_PARTIEL_DV, GRAPH_PREPA_DIJKSTRA } = require(process.env.RESEAUX_BUILD + "/routing");
const { simulateArq, annaleScenario } = require(process.env.RESEAUX_BUILD + "/arq");
const { congestionTrace, slowStartRtts, playTcp } = require(process.env.RESEAUX_BUILD + "/tcp");
const { manchesterDiff, nrzMultiLevel, parseBits } = require(process.env.RESEAUX_BUILD + "/lineCoding");

let n = 0;
const ok = (name, cond) => { n++; if (!cond) { console.error("FAIL:", name); process.exitCode = 1; } };

// ── 1. Partiel 2023 Ex1 — chronogram ──────────────────────────────────────
// 30 KB file as p1=10KB + p2=20KB, 10 Mbit/s then 5 Mbit/s, 6600 km links
// (v = 300 000 km/s → prop 22 ms each). Student sheet: ttAR(p1)=8 ms? No —
// corrected values: tt A→R p1 = 8e4/1e7 = 8 ms, p2 = 16 ms; R→B p1 = 16 ms,
// p2 = 32 ms. Let's check the machine-computed schedule.
{
  const c = chronogram({ sizesBits: [80000, 160000], rate1: 1e7, rate2: 5e6, prop1Ms: 22, prop2Ms: 22 });
  const [p1, p2] = c.packets;
  ok("p1 tx1 8ms", Math.abs(p1.tx1End - 8) < 1e-9);
  ok("p1 at router 30ms", Math.abs(p1.atRouter - 30) < 1e-9);
  ok("p1 tx2 30→46", Math.abs(p1.tx2End - 46) < 1e-9);
  ok("p1 at B 68ms", Math.abs(p1.atDest - 68) < 1e-9);
  ok("p2 tx1 8→24", Math.abs(p2.tx1End - 24) < 1e-9);
  ok("p2 at router 46", Math.abs(p2.atRouter - 46) < 1e-9);
  // router still busy until 46 → starts at 46, 32 ms → 78, +22 = 100
  ok("p2 at B 100ms", Math.abs(p2.atDest - 100) < 1e-9);
  ok("effective rate 2.4 Mbit/s", Math.abs(c.effectiveRate - 240000 / 0.1) < 1);
}

// ── 2. Annale exam Ex2 — cascade fragmentation ────────────────────────────
// 2048 bytes of TCP data; hop 1 accepts datagrams ≤ 1010 (990 data), hop 2
// ≤ 504 (484 data). Expected at B: 500/500/44 | 500/500/44 | 100 with
// offsets 0,60,120,123,183,243,246 and MF 1,1,1,1,1,1,0.
{
  const stages = fragmentChain(2048, [1010, 504]);
  const final = stages[2];
  const got = final.map((f) => [f.totalLength, f.mf, f.offsetUnits].join(","));
  const want = ["500,1,0", "500,1,60", "44,1,120", "500,1,123", "500,1,183", "44,1,243", "100,0,246"];
  ok("annale fragments", JSON.stringify(got) === JSON.stringify(want));
  // intermediate stage: 984+20, 984+20, 80+20
  const mid = stages[1].map((f) => [f.totalLength, f.mf, f.offsetUnits].join(","));
  ok("annale mid-stage", JSON.stringify(mid) === JSON.stringify(["1004,1,0", "1004,1,123", "100,0,246"]));
}

// ── 3. TD5 Ex9 — 2000 bytes through MTU 4096 → 1024 → 512 ────────────────
// Correction: after B: two 1020-byte datagrams (offsets 0, 125); after C:
// 508/508/44/508/508/44 with offsets 0,61,122,125,186,247 and MF 1,1,1,1,1,0.
{
  const stages = fragmentChain(2000, [4096, 1024, 512]);
  ok("td5 no frag at 4096", stages[1].length === 1 && stages[1][0].totalLength === 2020);
  const b = stages[2].map((f) => [f.totalLength, f.mf, f.offsetUnits].join(","));
  ok("td5 network B", JSON.stringify(b) === JSON.stringify(["1020,1,0", "1020,0,125"]));
  const c2 = stages[3].map((f) => [f.totalLength, f.mf, f.offsetUnits].join(","));
  const want = ["508,1,0", "508,1,61", "44,1,122", "508,1,125", "508,1,186", "44,0,247"];
  ok("td5 network C", JSON.stringify(c2) === JSON.stringify(want));
}

// ── 4. TD5 Ex4 — 129 bytes through MTU 128 (frames), header 20 ───────────
// Correction: fragments of 124 (104 data) and 25 (5 data).
{
  const stages = fragmentChain(109, [128]);
  const got = stages[1].map((f) => [f.totalLength, f.dataLength, f.mf, f.offsetUnits].join(","));
  ok("td5 ex4", JSON.stringify(got) === JSON.stringify(["124,104,1,0", "25,5,0,13"]));
}

// ── 5. Subnetting — partiel 2021 numbers ─────────────────────────────────
{
  const ip = parseIp("132.174.0.0");
  ok("class B", classOf(ip) === "B");
  // /23, subnet 55 → address 132.174.110.0, broadcast 132.174.111.255, 510 hosts
  const subnetIp = parseIp("132.174.110.0");
  const info = subnetInfo(subnetIp, 23);
  ok("subnet55 network", formatIp(info.network) === "132.174.110.0");
  ok("subnet55 broadcast", formatIp(info.broadcast) === "132.174.111.255");
  ok("subnet55 hosts", info.hostCount === 510);
  ok("subnet55 range", formatIp(info.firstHost) === "132.174.110.1" && formatIp(info.lastHost) === "132.174.111.254");
  ok("mask /23", formatIp(maskFromPrefix(23)) === "255.255.254.0");
  // préparation: 132.174 with 45 subnets → /22; subnet 34 → 132.174.136.0,
  // broadcast 132.174.139.255, 1022 hosts, host 357 → 132.174.137.101
  const i34 = subnetInfo(parseIp("132.174.136.0"), 22);
  ok("prepa broadcast", formatIp(i34.broadcast) === "132.174.139.255");
  ok("prepa hosts", i34.hostCount === 1022);
  ok("prepa host357", formatIp((i34.network + 357) >>> 0) === "132.174.137.101");
}

// ── 6. DV — partiel 2021 T1/T2 ───────────────────────────────────────────
{
  let tables = dvInit(GRAPH_PARTIEL_DV);
  ok("T0 A", tables.A.B.dist === 1 && tables.A.D.dist === 1 && !tables.A.C);
  // T1: A sends → B learns D via A at 2; D learns B via A at 2
  let x = dvExchange(GRAPH_PARTIEL_DV, tables, "A");
  tables = x.tables;
  ok("T1 B.D=2viaA", tables.B.D.dist === 2 && tables.B.D.next === "A");
  ok("T1 D.B=2viaA", tables.D.B.dist === 2 && tables.D.B.next === "A");
  // T2: B sends → A learns C=2 via B, E=2 via B; C learns A=2 via B, D=3 via B; E learns A=2 via B
  x = dvExchange(GRAPH_PARTIEL_DV, tables, "B");
  tables = x.tables;
  ok("T2 A.C=2viaB", tables.A.C.dist === 2 && tables.A.C.next === "B");
  ok("T2 A.E=2viaB", tables.A.E.dist === 2 && tables.A.E.next === "B");
  ok("T2 C.D=3viaB", tables.C.D.dist === 3 && tables.C.D.next === "B");
  ok("T2 A.D still 1", tables.A.D.dist === 1);
  // T4 (after D then E exchanges): D.C should become 2 via E
  x = dvExchange(GRAPH_PARTIEL_DV, tables, "D"); tables = x.tables;
  x = dvExchange(GRAPH_PARTIEL_DV, tables, "E"); tables = x.tables;
  ok("D.C=2viaE", tables.D.C.dist === 2 && tables.D.C.next === "E");
}

// ── 7. Dijkstra — préparation graph from D ───────────────────────────────
{
  const steps = dijkstraSteps(GRAPH_PREPA_DIJKSTRA, "D");
  ok("step0 = D", steps[0].active === "D");
  ok("step1 = B (cost 2)", steps[1].active === "B" && steps[1].labels.B.cost === 2);
  const table = dijkstraTable(GRAPH_PREPA_DIJKSTRA, "D");
  const by = Object.fromEntries(table.map((r) => [r.dest, r]));
  ok("D→A cost4 via B", by.A.cost === 4 && by.A.next === "B");
  ok("D→C cost3 via B", by.C.cost === 3 && by.C.next === "B");
  ok("D→E cost4 via B", by.E.cost === 4 && by.E.next === "B");
  ok("D→F cost3 via F", by.F.cost === 3 && by.F.next === "F");
  ok("D→G cost5 via B", by.G.cost === 5 && by.G.next === "B");
}

// ── 8. DV count-to-infinity after a cut ──────────────────────────────────
{
  // small triangle-ish net: A-B cost 8? Use the TD's square: A-B 2, B-C 2, A-C 3, B-D 3, C-D 3, A-D? TD graph: A,B,C,D with VAB=2, VBC=2, VAC=3, VBD=3, VCD=3
  const g = { nodes: ["A", "B", "C", "D"], edges: [["A","B",2],["B","C",2],["A","C",3],["B","D",3],["C","D",3]] };
  let tables = dvInit(g);
  // converge: a few full rounds
  for (const r of ["A","B","C","D","A","B","C","D"]) tables = dvExchange(g, tables, r).tables;
  ok("converged A.D=5viaB", tables.A.D.dist === 5 && (tables.A.D.next === "B" || tables.A.D.next === "C"));
  // cut C-D; C loses its route via D... TD scenario cuts Vcd: D reachable via B only
  const cut = dvCutLink(g, tables, "C", "D");
  ok("C.D=inf after cut", !isFinite(cut.tables.C.D.dist));
  // B still fine via its direct link
  ok("B.D=3 direct", cut.tables.B.D.dist === 3);
}

// ── 9. ARQ — the annale chronograms ──────────────────────────────────────
{
  const fr = simulateArq(annaleScenario("rej"));
  const asStr = fr.map((f) => `${f.from}:${f.kind}${f.kind === "I" ? String(f.ns) + String(f.nr) : f.ns}@${f.t0}-${f.t1}${f.corrupted ? "X" : ""}`);
  // corrigé: A: I00@0, I10@3, I20@6 (corrupted), I31@9, I22@15, I32@18
  //          B: I01@4, I12@7, REJ2@12
  const want = [
    "A:I00@0-3", "B:I01@4-7", "A:I10@3-6", "A:I20@6-9X", "B:I12@7-10", "A:I31@9-12",
    "B:REJ2@12-15", "A:I22@15-18", "A:I32@18-21",
  ].sort();
  ok("annale REJ", JSON.stringify([...asStr].sort()) === JSON.stringify(want));
  const fr2 = simulateArq(annaleScenario("srej"));
  const s2 = fr2.map((f) => `${f.from}:${f.kind}${f.kind === "I" ? String(f.ns) + String(f.nr) : f.ns}@${f.t0}-${f.t1}${f.corrupted ? "X" : ""}`);
  const want2 = [
    "A:I00@0-3", "B:I01@4-7", "A:I10@3-6", "A:I20@6-9X", "B:I12@7-10", "A:I31@9-12",
    "B:SREJ2@12-15", "A:I22@15-18",
  ].sort();
  ok("annale SREJ", JSON.stringify([...s2].sort()) === JSON.stringify(want2));
}

// ── 10. Congestion + slow start ──────────────────────────────────────────
{
  ok("log2 2000 = 11 RTT", slowStartRtts(2000) === 11);
  const tr = congestionTrace(12, 16, [{ round: 8, kind: "timeout" }], "tahoe");
  ok("ss doubles: 1,2,4,8,16", tr[0].cwnd === 1 && tr[1].cwnd === 2 && tr[4].cwnd === 16);
  ok("avoidance +1", tr[5].cwnd === 17 && tr[6].cwnd === 18);
  ok("timeout at 8: cwnd 20→1, thresh 10", tr[8].cwnd === 20 && tr[9].cwnd === 1 && tr[9].ssthresh === 10);
  const rn = congestionTrace(6, 16, [{ round: 3, kind: "3dup" }], "reno");
  ok("reno 3dup: cwnd 8 → 4", rn[3].cwnd === 8 && rn[4].cwnd === 4 && rn[4].ssthresh === 4);
}

// ── 11. TCP seq/ack — TD6 Ex7 shape ──────────────────────────────────────
{
  const segs = playTcp(1023, 4999, [
    { from: "A", len: 0, flags: ["SYN"] },
    { from: "B", len: 0, flags: ["SYN", "ACK"] },
    { from: "A", len: 0, flags: ["ACK"] },
    { from: "A", len: 300, flags: ["ACK", "PSH"], lost: true },
    { from: "A", len: 200, flags: ["ACK", "PSH"] },
    { from: "A", len: 12, flags: ["ACK", "PSH"] },
  ]);
  ok("handshake acks", segs[1].ack === 1024 && segs[2].ack === 5000);
  ok("seq 1024/1324/1524", segs[3].seq === 1024 && segs[4].seq === 1324 && segs[5].seq === 1524);
  const rt = segs.find((s) => s.retrans);
  ok("GBN retrans 1024(512)", rt.seq === 1024 && rt.len === 512);
  ok("final cumulative ack 1536", segs[segs.length - 1].ack === 1536);
}

// ── 12. Line coding sanity ───────────────────────────────────────────────
{
  const bits = parseBits("011110011001100");
  ok("15 bits", bits.length === 15);
  const ml = nrzMultiLevel(bits, 3);
  // corrigé grouping: 011|110|011|001|100 → −1, +5, −1, −5, +1
  const volts = ml.symbols.map((s) => s.volts);
  ok("valence8 levels", JSON.stringify(volts) === JSON.stringify([-1, 5, -1, -5, 1]));
  const md = manchesterDiff(bits, true);
  ok("manchester diff 30 halves", md.length === 30);
}

console.log(process.exitCode ? `${n} checks — FAILURES above` : `all ${n} checks passed`);
