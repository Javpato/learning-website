"use client";

// The routing machine, two presets:
//  - "dv": distance vectors on the 2021 midterm's five-router graph (all
//    costs 1), stepped exchange by exchange — plus a failure scenario on the
//    TD's triangle (A—B 3, B—C 2, A—C 8) where cutting A—B triggers the
//    bouncing effect, and split horizon (poisoned reverse) fixes it.
//  - "dijkstra": the Préparation's seven-router graph, label by label from D.
// Engines in lib/cs/routing.ts, verified against both corrigés.

import { useMemo, useState } from "react";
import {
  dijkstraSteps,
  dijkstraTable,
  dvCutLink,
  dvExchange,
  dvInit,
  fmt,
  GRAPH_PARTIEL_DV,
  GRAPH_PREPA_DIJKSTRA,
  type DvTables,
  type Graph,
} from "@/lib/cs/routing";
import { useLocale } from "@/components/learn/useLocale";

const GRAPH_PANNE: Graph = {
  nodes: ["A", "B", "C"],
  edges: [
    ["A", "B", 3],
    ["B", "C", 2],
    ["A", "C", 8],
  ],
};

const POS: Record<string, Record<string, [number, number]>> = {
  partiel: { A: [45, 112], B: [185, 42], C: [330, 42], D: [185, 182], E: [330, 182] },
  panne: { A: [70, 60], B: [300, 50], C: [185, 185] },
  prepa: { G: [50, 78], A: [175, 38], C: [160, 135], B: [285, 108], D: [400, 48], E: [285, 205], F: [405, 175] },
};

const L: Record<string, Record<string, string>> = {
  fr: {
    mode: "algorithme",
    dv: "vecteurs de distances",
    dij: "état de liens (Dijkstra depuis D)",
    net: "réseau",
    netPartiel: "partiel — 5 routeurs, coûts 1",
    netPanne: "panne — triangle A, B, C",
    step: "échange suivant",
    stepDij: "étape suivante",
    reset: "recommencer",
    cut: "couper le lien A—B",
    horizon: "horizon partagé (antidote)",
    sends: "envoie son vecteur",
    dest: "dest",
    next: "via",
    dist: "coût",
    permanent: "permanent",
    provisional: "provisoire",
    tableD: "table de routage de D",
    hintDv: "À chaque échange, un routeur annonce ses distances à ses voisins ; chacun compare « distance annoncée + coût du lien » à sa table. Les cases dorées viennent de changer. Coupe le lien puis continue : regarde le coût vers A enfler d'échange en échange — c'est l'effet rebond.",
    hintDij: "Chaque étape rend permanente l'étiquette provisoire la plus petite (nœud plein), puis réexamine ses voisins : « coût du nœud actif + lien » remplace toute étiquette plus grande. L'étiquette lit (coût, via).",
    noChange: "aucun changement",
    cutStatus: "lien A—B coupé",
    graphAria: "graphe de routeurs",
    tableAria: "table de routage de",
  },
  en: {
    mode: "algorithm",
    dv: "distance vectors",
    dij: "link state (Dijkstra from D)",
    net: "network",
    netPartiel: "midterm — 5 routers, costs 1",
    netPanne: "failure — triangle A, B, C",
    step: "next exchange",
    stepDij: "next step",
    reset: "reset",
    cut: "cut link A—B",
    horizon: "split horizon (poisoned reverse)",
    sends: "sends its vector",
    dest: "dest",
    next: "via",
    dist: "cost",
    permanent: "permanent",
    provisional: "provisional",
    tableD: "routing table of D",
    hintDv: "At every exchange one router announces its distances to its neighbours; each compares “advertised + link cost” with its table. Golden cells just changed. Cut the link and keep going: watch the cost toward A inflate exchange after exchange — the bouncing effect.",
    hintDij: "Each step makes the smallest provisional label permanent (filled node), then re-examines its neighbours: “active node's cost + link” replaces any larger label. A label reads (cost, via).",
    noChange: "no change",
    cutStatus: "link A—B cut",
    graphAria: "router graph",
    tableAria: "routing table for",
  },
  es: {
    mode: "algoritmo",
    dv: "vectores de distancias",
    dij: "estado de enlaces (Dijkstra desde D)",
    net: "red",
    netPartiel: "parcial — 5 routers, costes 1",
    netPanne: "avería — triángulo A, B, C",
    step: "siguiente intercambio",
    stepDij: "siguiente paso",
    reset: "reiniciar",
    cut: "cortar el enlace A—B",
    horizon: "horizonte dividido (antídoto)",
    sends: "envía su vector",
    dest: "dest",
    next: "vía",
    dist: "coste",
    permanent: "permanente",
    provisional: "provisional",
    tableD: "tabla de enrutamiento de D",
    hintDv: "En cada intercambio un router anuncia sus distancias a sus vecinos; cada uno compara «distancia anunciada + coste del enlace» con su tabla. Las celdas doradas acaban de cambiar. Corta el enlace y sigue: mira cómo el coste hacia A se infla intercambio a intercambio — el efecto rebote.",
    hintDij: "Cada paso vuelve permanente la etiqueta provisional más pequeña (nodo relleno) y reexamina a sus vecinos: «coste del nodo activo + enlace» sustituye cualquier etiqueta mayor. Una etiqueta se lee (coste, vía).",
    noChange: "sin cambios",
    cutStatus: "enlace A—B cortado",
    graphAria: "grafo de routers",
    tableAria: "tabla de enrutamiento de",
  },
};

function GraphSvg({
  graph,
  pos,
  labels,
  permanent,
  active,
  ariaLabel,
}: {
  graph: Graph;
  pos: Record<string, [number, number]>;
  labels?: Record<string, string>;
  permanent?: Set<string>;
  active?: string | null;
  ariaLabel: string;
}) {
  return (
    <svg viewBox="0 0 470 235" role="img" aria-label={ariaLabel} style={{ width: "100%", display: "block" }}>
      {graph.edges.map(([a, b, c], i) => {
        const [xa, ya] = pos[a];
        const [xb, yb] = pos[b];
        return (
          <g key={i}>
            <line x1={xa} y1={ya} x2={xb} y2={yb} stroke="var(--border-strong)" strokeWidth={1.5} />
            <text x={(xa + xb) / 2 + 6} y={(ya + yb) / 2 - 4} fill="var(--fg-muted)" fontSize={11} fontFamily="var(--font-mono, monospace)">
              {c}
            </text>
          </g>
        );
      })}
      {graph.nodes.map((n) => {
        const [x, y] = pos[n];
        const isPerm = permanent?.has(n);
        const isActive = active === n;
        return (
          <g key={n}>
            <circle
              cx={x}
              cy={y}
              r={15}
              fill={isPerm ? "var(--accent)" : "var(--bg-elevated)"}
              stroke={isActive ? "var(--accent-warm)" : "var(--border-strong)"}
              strokeWidth={isActive ? 3 : 1.5}
            />
            <text x={x} y={y + 4.5} textAnchor="middle" fill={isPerm ? "var(--bg)" : "var(--fg)"} fontSize={13} fontWeight={700}>
              {n}
            </text>
            {labels?.[n] && (
              <text x={x} y={y - 21} textAnchor="middle" fill="var(--accent-warm)" fontSize={10.5} fontFamily="var(--font-mono, monospace)">
                {labels[n]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function RoutingWidget({ preset = "dv" }: { preset?: "dv" | "dijkstra" }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [mode, setMode] = useState<"dv" | "dijkstra">(preset);
  const [net, setNet] = useState<"partiel" | "panne">("partiel");
  const [poison, setPoison] = useState(false);
  const [dvState, setDvState] = useState<{ graph: Graph; tables: DvTables; sender: number; last: string[] }>(() => ({
    graph: GRAPH_PARTIEL_DV,
    tables: dvInit(GRAPH_PARTIEL_DV),
    sender: 0,
    last: [],
  }));
  const [dijStep, setDijStep] = useState(0);
  const [prevTables, setPrevTables] = useState<DvTables | null>(null);

  const baseGraph = net === "partiel" ? GRAPH_PARTIEL_DV : GRAPH_PANNE;
  const pos = POS[mode === "dijkstra" ? "prepa" : net];

  const resetDv = (which: "partiel" | "panne") => {
    const g = which === "partiel" ? GRAPH_PARTIEL_DV : GRAPH_PANNE;
    setNet(which);
    setDvState({ graph: g, tables: dvInit(g), sender: 0, last: [] });
    setPrevTables(null);
  };

  const stepDv = () => {
    const order = dvState.graph.nodes;
    const from = order[dvState.sender % order.length];
    const ex = dvExchange(dvState.graph, dvState.tables, from, poison ? "poison" : "none");
    setPrevTables(dvState.tables);
    setDvState({ graph: dvState.graph, tables: ex.tables, sender: dvState.sender + 1, last: [`${from} ${t.sends} : ${ex.changes.length ? ex.changes.join(" · ") : t.noChange}`] });
  };

  const cutAB = () => {
    const { graph, tables } = dvCutLink(dvState.graph, dvState.tables, "A", "B");
    setPrevTables(dvState.tables);
    setDvState({ graph, tables, sender: dvState.sender, last: [t.cutStatus] });
  };

  const dijAll = useMemo(() => dijkstraSteps(GRAPH_PREPA_DIJKSTRA, "D"), []);
  const dijTable = useMemo(() => dijkstraTable(GRAPH_PREPA_DIJKSTRA, "D"), []);
  const dijCur = dijAll[Math.min(dijStep, dijAll.length - 1)];
  const dijLabels: Record<string, string> = {};
  const dijPerm = new Set<string>();
  for (const [n, lab] of Object.entries(dijCur.labels)) {
    if (Number.isFinite(lab.cost)) dijLabels[n] = `(${lab.cost}${lab.via ? ", " + lab.via : ""})`;
    if (lab.permanent) dijPerm.add(n);
  }

  return (
    <div className="widget-frame">
      {mode === "dv" ? (
        <GraphSvg graph={dvState.graph} pos={pos} active={dvState.sender > 0 ? dvState.graph.nodes[(dvState.sender - 1) % dvState.graph.nodes.length] : null} ariaLabel={t.graphAria} />
      ) : (
        <GraphSvg graph={GRAPH_PREPA_DIJKSTRA} pos={pos} labels={dijLabels} permanent={dijPerm} active={dijCur.active} ariaLabel={t.graphAria} />
      )}

      {mode === "dv" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", padding: "0.4rem 1rem", overflowX: "auto" }}>
          {dvState.graph.nodes.map((n) => (
            <table key={n} style={{ fontSize: "0.72rem" }} aria-label={`${t.tableAria} ${n}`}>
              <thead>
                <tr>
                  <th colSpan={3} style={{ color: "var(--accent)" }}>{n}</th>
                </tr>
                <tr>
                  <th>{t.dest}</th>
                  <th>{t.next}</th>
                  <th>{t.dist}</th>
                </tr>
              </thead>
              <tbody>
                {dvState.graph.nodes
                  .filter((d) => d !== n)
                  .map((d) => {
                    const e = dvState.tables[n][d];
                    const old = prevTables?.[n]?.[d];
                    const changed = e && (!old || old.dist !== e.dist || old.next !== e.next);
                    return (
                      <tr key={d} style={changed ? { color: "var(--accent-warm)", fontWeight: 600 } : undefined}>
                        <td>{d}</td>
                        <td className="widget-readout">{e ? e.next : "?"}</td>
                        <td className="widget-readout">{e ? fmt(e.dist) : "—"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ))}
        </div>
      )}

      {mode === "dijkstra" && (
        <div style={{ padding: "0.4rem 1rem", overflowX: "auto" }}>
          <table style={{ fontSize: "0.78rem", width: "100%" }}>
            <thead>
              <tr>
                <th>{t.tableD}</th>
                {dijTable.map((r) => (
                  <th key={r.dest} className="widget-readout">{r.dest}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t.next}</td>
                {dijTable.map((r) => (
                  <td key={r.dest} className="widget-readout">{dijStep >= dijAll.length - 1 ? r.next : "…"}</td>
                ))}
              </tr>
              <tr>
                <td>{t.dist}</td>
                {dijTable.map((r) => (
                  <td key={r.dest} className="widget-readout">{dijStep >= dijAll.length - 1 ? r.cost : "…"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="widget-controls">
        <label>
          {t.mode}
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as "dv" | "dijkstra";
              setMode(m);
              if (m === "dv") resetDv(net);
              else setDijStep(0);
            }}
          >
            <option value="dv">{t.dv}</option>
            <option value="dijkstra">{t.dij}</option>
          </select>
        </label>
        {mode === "dv" ? (
          <>
            <label>
              {t.net}
              <select value={net} onChange={(e) => resetDv(e.target.value as "partiel" | "panne")}>
                <option value="partiel">{t.netPartiel}</option>
                <option value="panne">{t.netPanne}</option>
              </select>
            </label>
            <button type="button" className="btn" onClick={stepDv}>
              {t.step}
            </button>
            {net === "panne" && (
              <>
                <button type="button" className="btn" onClick={cutAB} disabled={dvState.graph.edges.length < GRAPH_PANNE.edges.length}>
                  {t.cut}
                </button>
                <label>
                  <input type="checkbox" checked={poison} onChange={(e) => setPoison(e.target.checked)} />
                  {t.horizon}
                </label>
              </>
            )}
            <button type="button" className="btn" onClick={() => resetDv(net)}>
              {t.reset}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn" onClick={() => setDijStep((s) => Math.min(s + 1, dijAll.length - 1))}>
              {t.stepDij}
            </button>
            <button type="button" className="btn" onClick={() => setDijStep(0)}>
              {t.reset}
            </button>
            <span className="widget-readout">
              {dijStep + 1} / {dijAll.length} · {t.permanent} : {[...dijPerm].join(" ")}
            </span>
          </>
        )}
      </div>
      <div className="widget-hint">
        {mode === "dv" ? (
          <>
            {dvState.last.length > 0 && <div className="widget-readout" style={{ marginBottom: 4 }}>{dvState.last[0]}</div>}
            {t.hintDv}
          </>
        ) : (
          t.hintDij
        )}
      </div>
    </div>
  );
}
