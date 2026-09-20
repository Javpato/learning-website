/** Pure, deterministic models for the French network workshop. */
import { nrz, manchester } from "./lineCoding";
export type Coding = "nrz" | "manchester" | "differential";
export const TD1_BITS = "101001001";
export function encodeSignal(bits: string, coding: Coding): number[] {
  const values = bits.split("").map(Number);
  if (coding === "nrz") return nrz(values).map((s) => s.y);
  // TD1 figure: first mid-bit edge descends. Keep annale defaults untouched.
  if (coding === "manchester") return manchester(values, false).map((s) => s.y);
  let level = 1;
  return values.flatMap((bit) => {
    if (bit === 0) level = -level;
    const first = level;
    level = -level;
    return [first, level];
  });
}
export function decodeSignal(levels: number[], coding: Coding): string {
  if (coding === "nrz") return levels.map((v) => (v > 0 ? "1" : "0")).join("");
  let previous = 1;
  let out = "";
  for (let i = 0; i < levels.length; i += 2) {
    const a = levels[i],
      b = levels[i + 1];
    out +=
      a === b || b === undefined
        ? "?"
        : coding === "manchester"
          ? a > b
            ? "1"
            : "0"
          : a === previous
            ? "1"
            : "0";
    previous = b;
  }
  return out;
}
export function parity(bits: string): number {
  return bits.split("").reduce((s, b) => s + Number(b), 0) % 2;
}
export function hamming(a: string, b: string): number {
  return a.split("").filter((v, i) => v !== b[i]).length;
}
export const HAMMING_WORDS = [
  "0000000000",
  "0000011111",
  "1111100000",
  "1111111111",
];
export function polynomialProduct(a: number, b: number): number {
  let result = 0;
  while (b) {
    if (b & 1) result ^= a;
    a <<= 1;
    b >>>= 1;
  }
  return result;
}
export function polynomialDivision(
  value: number,
  generator: number,
): { remainder: number; steps: number[] } {
  if (generator < 2)
    throw new Error("Le générateur doit être de degré positif.");
  const steps = [value],
    degree = Math.floor(Math.log2(generator));
  while (value && Math.floor(Math.log2(value)) >= degree) {
    value ^= generator << (Math.floor(Math.log2(value)) - degree);
    steps.push(value);
  }
  return { remainder: value, steps };
}
export function shannon(bandwidth: number, snrDb: number): number {
  return bandwidth * Math.log2(1 + 10 ** (snrDb / 10));
}
export function parityResidual(p: number): number {
  const choose = [1, 8, 28, 56, 70, 56, 28, 8, 1];
  return [2, 4, 6, 8].reduce(
    (s, k) => s + choose[k] * p ** k * (1 - p) ** (8 - k),
    0,
  );
}
export type Edge = [string, string, number];
export type Network = { nodes: string[]; edges: Edge[] };
export const TD4_DIRECTED: Network = {
  nodes: ["A", "B", "C", "D", "E", "F"],
  edges: [
    ["A", "B", 10],
    ["A", "E", 5],
    ["B", "C", 2],
    ["B", "D", 3],
    ["C", "D", 3],
    ["C", "F", 1],
    ["D", "C", 2],
    ["D", "F", 1],
    ["E", "B", 2],
    ["E", "C", 4],
    ["F", "D", 1],
  ],
};
export function symmetric(nodes: string[], edges: Edge[]): Network {
  return {
    nodes,
    edges: edges.flatMap(([a, b, c]): Edge[] => [
      [a, b, c],
      [b, a, c],
    ]),
  };
}
export const TD4_DV = symmetric(
  ["A", "B", "C", "D"],
  [
    ["A", "B", 2],
    ["A", "C", 3],
    ["B", "C", 2],
    ["B", "D", 3],
    ["C", "D", 3],
  ],
);
export type Label = { cost: number; via: string | null; fixed: boolean };
export type RoutingStep = {
  active: string | null;
  labels: Record<string, Label>;
};
export function shortestSteps(graph: Network, source: string): RoutingStep[] {
  if (!graph.nodes.includes(source) || graph.edges.some((e) => e[2] < 0))
    throw new Error("Source ou coût invalide");
  const labels: Record<string, Label> = Object.fromEntries(
    graph.nodes.map((n) => [
      n,
      { cost: n === source ? 0 : Infinity, via: null, fixed: false },
    ]),
  );
  const snapshot = (active: string | null): RoutingStep => ({
    active,
    labels: Object.fromEntries(
      Object.entries(labels).map(([k, v]) => [k, { ...v }]),
    ),
  });
  const steps = [snapshot(null)];
  for (;;) {
    const node = graph.nodes
      .filter((n) => !labels[n].fixed && Number.isFinite(labels[n].cost))
      .sort((a, b) => labels[a].cost - labels[b].cost || a.localeCompare(b))[0];
    if (!node) return steps;
    labels[node].fixed = true;
    for (const [a, b, cost] of graph.edges)
      if (
        a === node &&
        !labels[b].fixed &&
        labels[node].cost + cost < labels[b].cost
      ) {
        labels[b].cost = labels[node].cost + cost;
        labels[b].via = node;
      }
    steps.push(snapshot(node));
  }
}
export function pathTo(
  labels: Record<string, Label>,
  source: string,
  target: string,
): string[] {
  if (!Number.isFinite(labels[target]?.cost)) return [];
  const path = [target];
  while (path[0] !== source) {
    const prev = labels[path[0]].via;
    if (prev === null || path.includes(prev)) return [];
    path.unshift(prev);
  }
  return path;
}
export type Route = { cost: number; next: string };
export type Tables = Record<string, Record<string, Route>>;
export function initialTables(graph: Network, converged = false): Tables {
  return Object.fromEntries(
    graph.nodes.map((source) => {
      const labels = shortestSteps(graph, source).slice(-1)[0].labels;
      return [
        source,
        Object.fromEntries(
          graph.nodes.map((dest) => {
            const direct = graph.edges.find(
              ([a, b]) => a === source && b === dest,
            );
            const path = pathTo(labels, source, dest);
            return [
              dest,
              {
                cost: converged
                  ? labels[dest].cost
                  : source === dest
                    ? 0
                    : (direct?.[2] ?? Infinity),
                next:
                  source === dest
                    ? "—"
                    : converged
                      ? (path[1] ?? "—")
                      : direct
                        ? dest
                        : "—",
              },
            ];
          }),
        ),
      ];
    }),
  );
}
const copyTables = (t: Tables): Tables =>
  Object.fromEntries(
    Object.entries(t).map(([n, rows]) => [
      n,
      Object.fromEntries(Object.entries(rows).map(([d, r]) => [d, { ...r }])),
    ]),
  );
export type DvState = {
  graph: Network;
  tables: Tables;
  known: Record<string, Tables>;
};
export function dvState(graph: Network, converged = false): DvState {
  const tables = initialTables(graph, converged);
  return {
    graph,
    tables,
    known: Object.fromEntries(
      graph.nodes.map((n) => [n, converged ? copyTables(tables) : {}]),
    ),
  };
}
/** Receive specified vectors as a simultaneous snapshot, then recompute the receiver's table. */
export function receiveVectors(
  state: DvState,
  receiver: string,
  senders: string[],
): DvState {
  const tables = copyTables(state.tables);
  const known = {
    ...state.known,
    [receiver]: copyTables(state.known[receiver]),
  };
  const links = state.graph.edges.filter(([a]) => a === receiver);
  for (const sender of senders)
    if (links.some(([, b]) => b === sender))
      known[receiver][sender] = { ...state.tables[sender] };
  for (const dest of state.graph.nodes) {
    if (dest === receiver) {
      tables[receiver][dest] = { cost: 0, next: "—" };
      continue;
    }
    const candidates = links.map(([, peer, cost]) => ({
      next: peer,
      cost:
        cost +
        (dest === peer ? 0 : (known[receiver][peer]?.[dest]?.cost ?? Infinity)),
    }));
    // Stable ties: retain the previous next hop when still optimal.
    candidates.sort(
      (a, b) =>
        a.cost - b.cost ||
        (a.next === state.tables[receiver][dest].next
          ? -1
          : b.next === state.tables[receiver][dest].next
            ? 1
            : a.next.localeCompare(b.next)),
    );
    const best = candidates[0];
    tables[receiver][dest] =
      best && Number.isFinite(best.cost) ? best : { cost: Infinity, next: "—" };
  }
  return { ...state, tables, known };
}
export function cutDv(state: DvState, a: string, b: string): DvState {
  const graph = {
    ...state.graph,
    edges: state.graph.edges.filter(
      ([x, y]) => !((x === a && y === b) || (x === b && y === a)),
    ),
  };
  const tables = copyTables(state.tables);
  for (const [node, peer] of [
    [a, b],
    [b, a],
  ])
    for (const dest of graph.nodes)
      if (tables[node][dest].next === peer)
        tables[node][dest] = { cost: Infinity, next: "—" };
  return { ...state, graph, tables };
}
export const TD4_EVENTS: [string, string[]][] = [
  ["D", ["B"]],
  ["B", ["A", "C", "D"]],
  ["C", ["A", "B"]],
  ["A", ["B", "C"]],
];
export function td4FailureSteps(): DvState[] {
  const states = [dvState(TD4_DV, true)];
  states.push(cutDv(states[0], "C", "D"));
  for (const [receiver, senders] of TD4_EVENTS)
    states.push(receiveVectors(states[states.length - 1], receiver, senders));
  return states;
}
/** Equal packet pipeline. bits and bit/s; propagation per link in seconds. */
export function switchingTime(
  payload: number,
  packetPayload: number,
  header: number,
  links: number,
  rate: number,
  propagation = 0,
  fixed = false,
) {
  const sizes = Array.from(
    { length: Math.ceil(payload / packetPayload) },
    (_, i) =>
      (fixed
        ? packetPayload
        : Math.min(packetPayload, payload - i * packetPayload)) + header,
  );
  const finishes: number[][] = [];
  for (let l = 0; l < links; l++) {
    finishes[l] = [];
    for (let p = 0; p < sizes.length; p++) {
      const arrival = l === 0 ? 0 : finishes[l - 1][p] + propagation;
      finishes[l][p] =
        Math.max(arrival, p ? finishes[l][p - 1] : 0) + sizes[p] / rate;
    }
  }
  return {
    total: finishes[links - 1][sizes.length - 1] + propagation,
    count: sizes.length,
    overhead: sizes.reduce((s, x) => s + x, 0) - payload,
    first: finishes[links - 1][0] + propagation,
  };
}
