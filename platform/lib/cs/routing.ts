// Routing engines for the RoutingWidget: a distance-vector simulator (the
// update rule of the partiel corrections) and a step-by-step Dijkstra with
// provisional/permanent labels (the Préparation's own 6-step recipe).

export type Graph = {
  nodes: string[];
  /** undirected edges [a, b, cost] */
  edges: [string, string, number][];
};

export const INFINITY_COST = Infinity;

function neighbors(g: Graph, n: string): { peer: string; cost: number }[] {
  const out: { peer: string; cost: number }[] = [];
  for (const [a, b, c] of g.edges) {
    if (a === n) out.push({ peer: b, cost: c });
    else if (b === n) out.push({ peer: a, cost: c });
  }
  return out;
}

// ── Distance vector ───────────────────────────────────────────────────────

export type DvEntry = { next: string; dist: number };
/** node -> destination -> entry */
export type DvTables = Record<string, Record<string, DvEntry>>;

export function dvInit(g: Graph): DvTables {
  const t: DvTables = {};
  for (const n of g.nodes) {
    t[n] = { [n]: { next: "—", dist: 0 } };
    for (const { peer, cost } of neighbors(g, n)) {
      t[n][peer] = { next: peer, dist: cost };
    }
  }
  return t;
}

export type DvExchange = {
  from: string;
  to: string[];
  /** the vector actually sent on each link (after split horizon, if on) */
  vectors: Record<string, Record<string, number>>;
  /** tables after the exchange */
  tables: DvTables;
  /** human-readable changes "D: route vers B = 2 via A" */
  changes: string[];
};

function cloneTables(t: DvTables): DvTables {
  const out: DvTables = {};
  for (const n of Object.keys(t)) {
    out[n] = {};
    for (const d of Object.keys(t[n])) out[n][d] = { ...t[n][d] };
  }
  return out;
}

/**
 * One DV exchange: `from` sends its vector to every live neighbour, each
 * neighbour applies the course's update rule: candidate = advertised + link
 * cost; adopt if strictly better, or if the current route already goes
 * through the sender (its advertised change is authoritative, even upward).
 * `splitHorizon`: "none" sends everything; "poison" advertises routes whose
 * next hop is the receiver at infinite cost (horizon partagé avec antidote).
 */
export function dvExchange(
  g: Graph,
  tables: DvTables,
  from: string,
  splitHorizon: "none" | "poison" = "none",
): DvExchange {
  const t = cloneTables(tables);
  const ns = neighbors(g, from).filter((x) => Number.isFinite(x.cost));
  const vectors: Record<string, Record<string, number>> = {};
  const changes: string[] = [];
  for (const { peer, cost } of ns) {
    const vec: Record<string, number> = {};
    for (const d of Object.keys(t[from])) {
      if (d === peer) continue; // a node never advertises the destination to itself
      const entry = t[from][d];
      vec[d] =
        splitHorizon === "poison" && entry.next === peer && d !== from
          ? INFINITY_COST
          : entry.dist;
    }
    vectors[peer] = vec;
    for (const d of Object.keys(vec)) {
      if (d === peer) continue;
      const candidate = vec[d] + cost;
      const cur = t[peer][d];
      if (!cur || candidate < cur.dist) {
        t[peer][d] = { next: from, dist: candidate };
        changes.push(`${peer} : ${d} = ${fmt(candidate)} via ${from}`);
      } else if (cur.next === from && candidate !== cur.dist) {
        t[peer][d] = { next: from, dist: candidate };
        changes.push(`${peer} : ${d} = ${fmt(candidate)} via ${from}`);
      }
    }
  }
  return { from, to: ns.map((x) => x.peer), vectors, tables: t, changes };
}

/** Cut a link: both endpoints route through it at infinite cost. */
export function dvCutLink(g: Graph, tables: DvTables, a: string, b: string): { graph: Graph; tables: DvTables } {
  const graph: Graph = {
    nodes: g.nodes,
    edges: g.edges.filter(([x, y]) => !((x === a && y === b) || (x === b && y === a))),
  };
  const t = cloneTables(tables);
  for (const [n, peer] of [
    [a, b],
    [b, a],
  ] as [string, string][]) {
    for (const d of Object.keys(t[n])) {
      if (t[n][d].next === peer) t[n][d] = { next: peer, dist: INFINITY_COST };
    }
  }
  return { graph, tables: t };
}

export function fmt(x: number): string {
  return Number.isFinite(x) ? String(x) : "∞";
}

// ── Dijkstra ──────────────────────────────────────────────────────────────

export type DijkstraLabel = { cost: number; via: string | null; permanent: boolean };
export type DijkstraStep = {
  /** the node made permanent at this step */
  active: string;
  labels: Record<string, DijkstraLabel>;
};

/** Full run from `source`; step 0 is the source made permanent. */
export function dijkstraSteps(g: Graph, source: string): DijkstraStep[] {
  const labels: Record<string, DijkstraLabel> = {};
  for (const n of g.nodes) labels[n] = { cost: Infinity, via: null, permanent: false };
  labels[source] = { cost: 0, via: null, permanent: false };
  const steps: DijkstraStep[] = [];
  for (;;) {
    let active: string | null = null;
    for (const n of g.nodes) {
      if (labels[n].permanent) continue;
      if (!Number.isFinite(labels[n].cost)) continue;
      if (active === null || labels[n].cost < labels[active].cost) active = n;
    }
    if (active === null) break;
    labels[active] = { ...labels[active], permanent: true };
    for (const { peer, cost } of neighbors(g, active)) {
      if (labels[peer].permanent) continue;
      const candidate = labels[active].cost + cost;
      if (candidate < labels[peer].cost) {
        labels[peer] = { cost: candidate, via: active, permanent: false };
      }
    }
    steps.push({
      active,
      labels: Object.fromEntries(Object.entries(labels).map(([k, v]) => [k, { ...v }])),
    });
  }
  return steps;
}

/** Routing table of `source`: destination → (next hop, cost), from the run. */
export function dijkstraTable(
  g: Graph,
  source: string,
): { dest: string; next: string; cost: number }[] {
  const steps = dijkstraSteps(g, source);
  const final = steps[steps.length - 1].labels;
  const nextHop = (d: string): string => {
    let n = d;
    while (final[n].via !== null && final[n].via !== source) n = final[n].via as string;
    return final[n].via === source ? n : n; // n is the first hop after source
  };
  return g.nodes
    .filter((d) => d !== source && Number.isFinite(final[d].cost))
    .map((d) => ({ dest: d, next: nextHop(d), cost: final[d].cost }));
}

// ── The course's graphs ───────────────────────────────────────────────────

/** Partiel 2021 — 5 routers, every link of cost 1. */
export const GRAPH_PARTIEL_DV: Graph = {
  nodes: ["A", "B", "C", "D", "E"],
  edges: [
    ["A", "B", 1],
    ["A", "D", 1],
    ["B", "C", 1],
    ["B", "E", 1],
    ["C", "E", 1],
    ["D", "E", 1],
  ],
};

/** Préparation partiel — 7 routers, Dijkstra from D. */
export const GRAPH_PREPA_DIJKSTRA: Graph = {
  nodes: ["A", "B", "C", "D", "E", "F", "G"],
  edges: [
    ["G", "A", 1],
    ["G", "C", 2],
    ["A", "C", 1],
    ["A", "B", 3],
    ["A", "D", 5],
    ["C", "B", 1],
    ["B", "D", 2],
    ["B", "E", 2],
    ["B", "F", 1],
    ["D", "F", 3],
    ["E", "F", 1],
  ],
};
