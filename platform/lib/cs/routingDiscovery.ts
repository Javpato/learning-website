import type { Label, Network } from "./networkLab";
export function initialLabels(
  graph: Network,
  source: string,
): Record<string, Label> {
  return Object.fromEntries(
    graph.nodes.map((n) => [
      n,
      { cost: n === source ? 0 : Infinity, via: null, fixed: false },
    ]),
  );
}
export function settleMinimum(
  labels: Record<string, Label>,
  node: string,
): Record<string, Label> {
  const min = Math.min(
    ...Object.values(labels)
      .filter((x) => !x.fixed)
      .map((x) => x.cost),
  );
  if (
    !labels[node] ||
    labels[node].fixed ||
    !Number.isFinite(min) ||
    labels[node].cost !== min
  )
    throw new Error("Choisis un sommet provisoire de coût minimal.");
  return { ...labels, [node]: { ...labels[node], fixed: true } };
}
export function relax(
  labels: Record<string, Label>,
  from: string,
  to: string,
  weight: number,
): Record<string, Label> {
  if (weight < 0) throw new Error("Dijkstra exige des coûts non négatifs.");
  const candidate = labels[from].cost + weight;
  return candidate < labels[to].cost && !labels[to].fixed
    ? { ...labels, [to]: { ...labels[to], cost: candidate, via: from } }
    : labels;
}
export function waveProgress(
  graph: Network,
  distances: Record<string, Label>,
  time: number,
) {
  return Object.fromEntries(
    graph.edges.map(([a, b, w]) => [
      `${a}-${b}`,
      w === 0
        ? time >= distances[a].cost
          ? 1
          : 0
        : Math.max(0, Math.min(1, (time - distances[a].cost) / w)),
    ]),
  );
}
