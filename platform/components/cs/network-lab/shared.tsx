"use client";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { RESEAUX_TERMES } from "@/lib/content/glossaire-reseaux";
import { TD1_BITS, type Coding, type Network } from "@/lib/cs/networkLab";

export type LabState = {
  links: string[];
  coding: Coding;
  bits: string;
  symbolMs: number;
  valence: number;
  protection: boolean;
};
export const INITIAL_LAB: LabState = {
  links: [],
  coding: "nrz",
  bits: TD1_BITS,
  symbolMs: 5,
  valence: 16,
  protection: false,
};
const KEY = "reseaux-lab-v1";
export const LINKS: [string, string, number][] = [
  ["A", "N1", 2],
  ["A", "N2", 5],
  ["N1", "N2", 1],
  ["N1", "B", 6],
  ["N2", "B", 2],
];
const LabContext = createContext<{
  state: LabState;
  setState: (f: (s: LabState) => LabState) => void;
  saved: boolean;
}>({ state: INITIAL_LAB, setState: () => {}, saved: false });
export const useLab = () => useContext(LabContext);
export function LabProvider({ children }: { children: ReactNode }) {
  const [state, update] = useState<LabState>(INITIAL_LAB);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && Array.isArray(raw.links))
        update({
          links: raw.links.filter(
            (x: unknown) =>
              typeof x === "string" &&
              LINKS.some(([a, b]) => `${a}-${b}` === x),
          ),
          coding: ["nrz", "manchester", "differential"].includes(raw.coding)
            ? raw.coding
            : "nrz",
          bits:
            typeof raw.bits === "string" && /^[01]{1,16}$/.test(raw.bits)
              ? raw.bits
              : TD1_BITS,
          symbolMs:
            typeof raw.symbolMs === "number" &&
            raw.symbolMs >= 1 &&
            raw.symbolMs <= 20
              ? raw.symbolMs
              : 5,
          valence: [2, 4, 8, 16, 64].includes(raw.valence) ? raw.valence : 16,
          protection: raw.protection === true,
        });
    } catch {
      setSaved(false);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {
        setSaved(false);
      }
  }, [state, ready]);
  return (
    <LabContext.Provider value={{ state, setState: update, saved }}>
      {children}
    </LabContext.Provider>
  );
}
export function Source({ children }: { children: ReactNode }) {
  return (
    <p className="nl-source">
      Source : {children}. Adaptation pédagogique, non officielle.
    </p>
  );
}
export function Lesson({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="nl-lesson">
      <p className="nl-eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
export function Explain({
  title = "Comprendre et vérifier",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <details className="nl-explain">
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
export function Choice({
  question,
  options,
  answer,
  why,
}: {
  question: string;
  options: string[];
  answer: number;
  why: string;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <fieldset className="nl-question">
      <legend>{question}</legend>
      <div className="nl-options">
        {options.map((x, i) => (
          <button
            type="button"
            key={x}
            aria-pressed={pick === i}
            onClick={() => setPick(i)}
          >
            {x}
          </button>
        ))}
      </div>
      {pick !== null && (
        <p
          role="status"
          className={pick === answer ? "nl-good" : "nl-feedback"}
        >
          {pick === answer ? "Oui. " : "Réessaie. "}
          {why}
        </p>
      )}
      <Explain title="Indice / solution">
        <p>
          {options[answer]}. {why}
        </p>
      </Explain>
    </fieldset>
  );
}
export function Numeric({
  question,
  answer,
  unit = "",
  why,
  tolerance = 0.001,
}: {
  question: string;
  answer: number;
  unit?: string;
  why: string;
  tolerance?: number;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  return (
    <form
      className="nl-question"
      onSubmit={(e) => {
        e.preventDefault();
        const v = Number(value.trim().replace(",", "."));
        setResult(
          value.trim() !== "" &&
            Number.isFinite(v) &&
            Math.abs(v - answer) <= tolerance,
        );
      }}
    >
      <label htmlFor={id}>{question}</label>
      <div className="nl-inline">
        <input
          id={id}
          value={value}
          inputMode="decimal"
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
        />
        <span>{unit}</span>
        <button>Vérifier</button>
      </div>
      {result !== null && (
        <p role="status" className={result ? "nl-good" : "nl-feedback"}>
          {result ? "Exact. " : "Pas encore. "}
          {why}
        </p>
      )}
      <Explain title="Indice / solution">
        <p>
          {why} Résultat :{" "}
          {answer.toLocaleString("fr-FR", { maximumFractionDigits: 5 })} {unit}.
        </p>
      </Explain>
    </form>
  );
}
const french = (value: string | { fr?: string } | undefined) =>
  typeof value === "string" ? value : value?.fr;
export function TermMap({ goal, terms }: { goal: string; terms: string[] }) {
  const [selected, setSelected] = useState(terms[0]);
  const term = RESEAUX_TERMES.find((t) => t.id === selected);
  const id = useId();
  return (
    <div className="nl-mindmap">
      <aside id={id} aria-live="polite">
        <span className="nl-eyebrow">Le mot utile</span>
        <h3>{french(term?.label)}</h3>
        <p>{french(term?.short)}</p>
        <p className="nl-source">Sélectionne un terme pour en voir le sens.</p>
      </aside>
      <div className="nl-map-main">
        <div className="nl-goal">
          <span>Notre objectif</span>
          <strong>{goal}</strong>
        </div>
        <div className="nl-terms">
          {terms.map((t) => {
            const item = RESEAUX_TERMES.find((x) => x.id === t);
            return (
              item && (
                <button
                  key={t}
                  aria-controls={id}
                  aria-pressed={selected === t}
                  onClick={() => setSelected(t)}
                >
                  {french(item.label)} <span aria-hidden>↗</span>
                </button>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}
export function GraphView({
  graph,
  path = [],
  active,
  directed = false,
}: {
  graph: Network;
  path?: string[];
  active?: string | null;
  directed?: boolean;
}) {
  const marker = useId().replace(/:/g, "");
  const coords: Record<string, [number, number]> = Object.fromEntries(
    graph.nodes.map((n, i) => [
      n,
      [
        230 + 175 * Math.cos(-Math.PI + (2 * Math.PI * i) / graph.nodes.length),
        145 + 105 * Math.sin(-Math.PI + (2 * Math.PI * i) / graph.nodes.length),
      ],
    ]),
  );
  return (
    <svg
      className="nl-graph"
      viewBox="0 0 460 290"
      role="img"
      aria-label={`Réseau : ${graph.edges.map(([a, b, c]) => `${a} vers ${b}, coût ${c}`).join(" ; ")}`}
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--fg-muted)" />
        </marker>
      </defs>
      {graph.edges
        .filter(([a, b]) => directed || a < b)
        .map(([a, b, c]) => {
          const [x, y] = coords[a],
            [xx, yy] = coords[b];
          const dx = xx - x,
            dy = yy - y,
            len = Math.hypot(dx, dy);
          const bend =
            directed && graph.edges.some(([p, q]) => p === b && q === a)
              ? 18
              : 0;
          const mx = (x + xx) / 2 - (dy / len) * bend,
            my = (y + yy) / 2 + (dx / len) * bend;
          const chosen = path.some(
            (p, i) =>
              (p === a && path[i + 1] === b) ||
              (!directed && p === b && path[i + 1] === a),
          );
          return (
            <g key={`${a}-${b}`}>
              <path
                d={`M ${x + (dx / len) * 23} ${y + (dy / len) * 23} Q ${mx} ${my} ${xx - (dx / len) * 25} ${yy - (dy / len) * 25}`}
                fill="none"
                stroke={chosen ? "var(--success)" : "var(--fg-dim)"}
                strokeWidth={chosen ? 4 : 1.5}
                markerEnd={directed ? `url(#${marker})` : undefined}
              />
              <text
                x={mx}
                y={my - 5}
                textAnchor="middle"
                className="nl-edge-label"
              >
                {c}
              </text>
            </g>
          );
        })}
      {graph.nodes.map((n) => (
        <g key={n}>
          <circle
            cx={coords[n][0]}
            cy={coords[n][1]}
            r="22"
            fill={active === n ? "var(--accent-soft)" : "var(--bg-elevated-2)"}
            stroke={path.includes(n) ? "var(--success)" : "var(--accent)"}
          />
          <text
            x={coords[n][0]}
            y={coords[n][1] + 5}
            textAnchor="middle"
            fill="var(--fg)"
          >
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}
export function Signal({
  levels,
  label,
  halves = false,
}: {
  levels: number[];
  label: string;
  halves?: boolean;
}) {
  const width = 600,
    step = levels.length ? 540 / levels.length : 540;
  const y = (v: number) => (v === 1 ? 25 : 65);
  const d = levels
    .map(
      (v, i) =>
        `${i ? "L" : "M"} ${35 + i * step} ${y(v)} L ${35 + (i + 1) * step} ${y(v)}`,
    )
    .join(" ");
  return (
    <svg
      className="nl-signal"
      viewBox={`0 0 ${width} 95`}
      role="img"
      aria-label={`${label} : ${levels.map((v) => (v === 1 ? "haut" : "bas")).join(", ")}`}
    >
      <text x="0" y="26" fill="var(--fg-muted)" fontSize="12">
        +a
      </text>
      <text x="0" y="69" fill="var(--fg-muted)" fontSize="12">
        −a
      </text>
      {levels.map(
        (_, i) =>
          (!halves || i % 2 === 0) && (
            <line
              key={i}
              x1={35 + i * step}
              x2={35 + i * step}
              y1="10"
              y2="75"
              stroke="var(--border-strong)"
            />
          ),
      )}
      <path d={d} stroke="var(--accent)" strokeWidth="2.5" fill="none" />
      <text x="35" y="91" fill="var(--fg-muted)" fontSize="12">
        {label} → temps
      </text>
    </svg>
  );
}
