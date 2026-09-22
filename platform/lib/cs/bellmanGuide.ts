/** Event-driven distance vector, without a cache of old neighbor announcements.
 * Source: docs/reseaux-refonte/GUIDE-BELLMAN-FORD.md, §§2,12. */
export const NODES = ["A", "B", "C", "D", "E"];
export const LINKS: [string, string][] = [
  ["A", "B"],
  ["A", "D"],
  ["B", "C"],
  ["B", "E"],
  ["C", "E"],
  ["D", "E"],
];
export type Entry = { cost: number; next: string | null };
export type Tables = Record<string, Record<string, Entry>>;
export type Message = {
  sender: string;
  receiver: string;
  vector: Record<string, number>;
};
export type Change = {
  receiver: string;
  sender: string;
  dest: string;
  old: Entry;
  candidate: number;
  entry: Entry;
  reason: string;
  changed: boolean;
};
export type Snapshot = {
  id: string;
  title: string;
  tables: Tables;
  links: [string, string][];
  messages: Message[];
  changes: Change[];
};
export type Event = {
  id: string;
  title: string;
  deliveries: [string, string][];
  breakLink?: [string, string];
};
const send = (sender: string, receivers: string[]): [string, string][] =>
  receivers.map((r) => [sender, r]);
export const EVENTS: Event[] = [
  { id: "S1", title: "B et D reçoivent VA", deliveries: send("A", ["B", "D"]) },
  {
    id: "S2",
    title: "A, C et E reçoivent VB",
    deliveries: send("B", ["A", "C", "E"]),
  },
  { id: "S3", title: "A et E reçoivent VD", deliveries: send("D", ["A", "E"]) },
  {
    id: "S4",
    title: "B et D reçoivent VA, puis VE",
    deliveries: [...send("A", ["B", "D"]), ...send("E", ["B", "D"])],
  },
  { id: "S5", title: "B et E reçoivent VC", deliveries: send("C", ["B", "E"]) },
  { id: "S6", title: "A reçoit VB", deliveries: send("B", ["A"]) },
  { id: "S7", title: "C et D reçoivent VE", deliveries: send("E", ["C", "D"]) },
  {
    id: "F1",
    title: "A et B détectent la rupture AB",
    deliveries: [],
    breakLink: ["A", "B"],
  },
  {
    id: "F2",
    title: "D reçoit VA ; C et E reçoivent VB",
    deliveries: [...send("A", ["D"]), ...send("B", ["C", "E"])],
  },
  { id: "F3", title: "E reçoit VD", deliveries: send("D", ["E"]) },
  {
    id: "F4",
    title: "B, C et D reçoivent VE",
    deliveries: send("E", ["B", "C", "D"]),
  },
  { id: "F5", title: "A reçoit VD", deliveries: send("D", ["A"]) },
];
export const neighbors = (links: [string, string][], n: string) =>
  links.flatMap(([a, b]) => (a === n ? [b] : b === n ? [a] : []));
export function initial(links: [string, string][] = LINKS): Snapshot {
  return {
    id: "Initial",
    title: "Connaissance locale uniquement",
    links: links.map((e) => [...e]),
    messages: [],
    changes: [],
    tables: Object.fromEntries(
      NODES.map((a) => [
        a,
        Object.fromEntries(
          NODES.map((b) => [
            b,
            {
              cost:
                a === b ? 0 : neighbors(links, a).includes(b) ? 1 : Infinity,
              next: a !== b && neighbors(links, a).includes(b) ? b : null,
            },
          ]),
        ),
      ]),
    ),
  };
}
export function update(
  old: Entry,
  sender: string,
  advertised: number,
): { entry: Entry; candidate: number; reason: string } {
  const candidate = 1 + advertised;
  const replace = old.next === sender || candidate < old.cost;
  return {
    candidate,
    entry: replace
      ? { cost: candidate, next: Number.isFinite(candidate) ? sender : null }
      : { ...old },
    reason:
      old.next === sender
        ? "Même prochain saut : mise à jour obligatoire"
        : candidate < old.cost
          ? "Plus court"
          : candidate === old.cost
            ? "Égalité : conservation"
            : "Moins bon depuis un autre voisin",
  };
}
export function step(previous: Snapshot, event: Event): Snapshot {
  const tables: Tables = Object.fromEntries(
    NODES.map((a) => [
      a,
      Object.fromEntries(NODES.map((b) => [b, { ...previous.tables[a][b] }])),
    ]),
  );
  let links = previous.links.map((e) => [...e] as [string, string]);
  const changes: Change[] = [];
  if (event.breakLink) {
    const [x, y] = event.breakLink;
    links = links.filter(
      ([a, b]) => !((a === x && b === y) || (a === y && b === x)),
    );
    for (const [a, b] of [
      [x, y],
      [y, x],
    ])
      for (const z of NODES)
        if (tables[a][z].next === b) {
          const old = { ...tables[a][z] };
          tables[a][z] = { cost: Infinity, next: null };
          changes.push({
            receiver: a,
            sender: b,
            dest: z,
            old,
            candidate: Infinity,
            entry: { ...tables[a][z] },
            reason: "Liaison rompue : route dépendante invalidée",
            changed: true,
          });
        }
  }
  // Freeze all messages before any delivery in this event.
  const messages = event.deliveries.map(([sender, receiver]) => ({
    sender,
    receiver,
    vector: Object.fromEntries(
      NODES.map((z) => [z, previous.tables[sender][z].cost]),
    ),
  }));
  for (const m of messages) {
    if (!neighbors(links, m.receiver).includes(m.sender))
      throw new Error("Annonce sur une liaison inactive");
    for (const z of NODES) {
      if (z === m.receiver) continue;
      const old = { ...tables[m.receiver][z] };
      const result = update(old, m.sender, m.vector[z]);
      tables[m.receiver][z] = result.entry;
      changes.push({
        ...result,
        old,
        receiver: m.receiver,
        sender: m.sender,
        dest: z,
        changed:
          old.cost !== result.entry.cost || old.next !== result.entry.next,
      });
    }
  }
  return { id: event.id, title: event.title, tables, links, messages, changes };
}
export function history() {
  const result = [initial()];
  for (const event of EVENTS)
    result.push(step(result[result.length - 1], event));
  return result;
}
export function trace(s: Snapshot, source: string, dest: string) {
  const path = [source];
  let status = "Destination atteinte";
  while (path[path.length - 1] !== dest) {
    const n = path[path.length - 1],
      entry = s.tables[n][dest];
    if (!Number.isFinite(entry.cost) || !entry.next) {
      status = `Aucune route connue ici (${n})`;
      break;
    }
    if (!neighbors(s.links, n).includes(entry.next)) {
      status = "Entrée invalide : prochain saut non voisin";
      break;
    }
    path.push(entry.next);
    if (path.slice(0, -1).includes(entry.next)) {
      status = "Boucle détectée par le vérificateur pédagogique";
      break;
    }
  }
  return { path, status, reached: path[path.length - 1] === dest };
}
/** Independent topology oracle; never used to update the routing tables. */
export function bfs(links: [string, string][], source: string) {
  const d: Record<string, number> = Object.fromEntries(
    NODES.map((n) => [n, Infinity]),
  );
  d[source] = 0;
  const queue = [source];
  for (let i = 0; i < queue.length; i++)
    for (const n of neighbors(links, queue[i]))
      if (!Number.isFinite(d[n])) {
        d[n] = d[queue[i]] + 1;
        queue.push(n);
      }
  return d;
}
export function broadcast(s: Snapshot) {
  return step(s, {
    id: "Vérification",
    title: "Tous les vecteurs, une fois",
    deliveries: s.links.flatMap(
      ([a, b]) =>
        [
          [a, b],
          [b, a],
        ] as [string, string][],
    ),
  });
}
export const display = (n: number) => (Number.isFinite(n) ? String(n) : "∞");
export const cell = (e: Entry) => `${e.next || "—"} / ${display(e.cost)}`;
