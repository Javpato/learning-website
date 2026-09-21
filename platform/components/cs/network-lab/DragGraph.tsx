"use client";
import { useId, useRef, useState, type PointerEvent } from "react";
import type { Network } from "@/lib/cs/networkLab";
export function DragGraph({
  graph,
  labels = {},
  active,
  selected = [],
  onNode,
  edgeProgress = {},
  directed = true,
  travelling,
}: {
  graph: Network;
  labels?: Record<string, string>;
  active?: string | null;
  selected?: string[];
  onNode?: (n: string) => void;
  edgeProgress?: Record<string, number>;
  directed?: boolean;
  travelling?: string | null;
}) {
  const id = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  const layout: Record<string, { x: number; y: number }> =
    graph.nodes.length === 6
      ? {
          A: { x: 55, y: 180 },
          B: { x: 210, y: 65 },
          E: { x: 210, y: 290 },
          C: { x: 335, y: 180 },
          D: { x: 465, y: 65 },
          F: { x: 465, y: 290 },
        }
      : {
          A: { x: 55, y: 180 },
          B: { x: 260, y: 65 },
          C: { x: 260, y: 290 },
          D: { x: 465, y: 180 },
        };
  const initial = Object.fromEntries(
    graph.nodes.map((n, i) => [n, layout[n] || { x: 60 + i * 70, y: 180 }]),
  );
  const [positions, setPositions] = useState(initial);
  const drag = useRef<{
    node: string;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  function point(e: PointerEvent) {
    const r = svg.current!.getBoundingClientRect();
    return {
      x: Math.max(32, Math.min(488, ((e.clientX - r.left) * 520) / r.width)),
      y: Math.max(32, Math.min(328, ((e.clientY - r.top) * 360) / r.height)),
    };
  }
  return (
    <div className="nl-drag-graph">
      <svg
        ref={svg}
        viewBox="0 0 520 360"
        aria-label="Graphe manipulable : déplacer les sommets ne change pas les coûts"
      >
        <defs>
          <marker
            id={id}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10z" fill="var(--fg-muted)" />
          </marker>
        </defs>
        {graph.edges
          .filter(([a, b]) => directed || a < b)
          .map(([a, b, w]) => {
            const p = positions[a] || initial[a],
              q = positions[b] || initial[b],
              dx = q.x - p.x,
              dy = q.y - p.y,
              len = Math.hypot(dx, dy) || 1;
            const reverse =
              directed && graph.edges.some(([u, v]) => u === b && v === a);
            const bend = reverse ? 22 : 0;
            const mx = (p.x + q.x) / 2 - (dy / len) * bend,
              my = (p.y + q.y) / 2 + (dx / len) * bend;
            const d = `M${p.x + (dx / len) * 23},${p.y + (dy / len) * 23} Q${mx},${my} ${q.x - (dx / len) * 26},${q.y - (dy / len) * 26}`;
            const progress = edgeProgress[`${a}-${b}`] || 0;
            return (
              <g key={`${a}-${b}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth="2"
                  markerEnd={directed ? `url(#${id})` : undefined}
                />
                <path
                  d={d}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="4"
                  pathLength="1"
                  strokeDasharray={`${progress} 1`}
                  className="nl-wave-edge"
                />
                {(travelling === `${a}-${b}` ||
                  (!directed && travelling === `${b}-${a}`)) && (
                  <circle
                    key={travelling}
                    className="nl-packet"
                    r="7"
                    fill="var(--accent-warm)"
                  >
                    <animateMotion
                      dur="1.2s"
                      path={d}
                      keyPoints={travelling === `${a}-${b}` ? "0;1" : "1;0"}
                      keyTimes="0;1"
                      calcMode="linear"
                      fill="freeze"
                    />
                  </circle>
                )}
                <rect
                  x={mx - 13}
                  y={my - 12}
                  width="26"
                  height="23"
                  rx="6"
                  fill="var(--bg)"
                />
                <text
                  x={mx}
                  y={my + 4}
                  textAnchor="middle"
                  fill="var(--accent-warm)"
                  fontSize="14"
                >
                  {w}
                </text>
              </g>
            );
          })}
        {graph.nodes.map((n) => {
          const p = positions[n] || initial[n];
          return (
            <g
              key={n}
              transform={`translate(${p.x} ${p.y})`}
              className="nl-drag-node"
              role="button"
              tabIndex={0}
              aria-label={`Sommet ${n}${labels[n] ? `, distance ${labels[n]}` : ""}. Flèches pour déplacer, Entrée pour sélectionner.`}
              onKeyDown={(e) => {
                const delta: Record<string, [number, number]> = {
                  ArrowLeft: [-10, 0],
                  ArrowRight: [10, 0],
                  ArrowUp: [0, -10],
                  ArrowDown: [0, 10],
                };
                if (delta[e.key]) {
                  e.preventDefault();
                  const [dX, dY] = delta[e.key];
                  setPositions((s) => ({
                    ...s,
                    [n]: {
                      x: Math.max(30, Math.min(490, p.x + dX)),
                      y: Math.max(30, Math.min(330, p.y + dY)),
                    },
                  }));
                } else if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNode?.(n);
                }
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag.current = {
                  node: n,
                  x: e.clientX,
                  y: e.clientY,
                  moved: false,
                };
              }}
              onPointerMove={(e) => {
                if (drag.current?.node !== n) return;
                if (
                  Math.hypot(
                    e.clientX - drag.current.x,
                    e.clientY - drag.current.y,
                  ) > 4
                )
                  drag.current.moved = true;
                if (drag.current.moved) {
                  const p = point(e);
                  setPositions((s) => ({ ...s, [n]: p }));
                }
              }}
              onPointerUp={(e) => {
                if (drag.current && !drag.current.moved) onNode?.(n);
                drag.current = null;
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
            >
              <circle
                r="23"
                fill={
                  selected.includes(n)
                    ? "var(--accent-soft)"
                    : "var(--bg-elevated)"
                }
                stroke={
                  active === n
                    ? "var(--accent-warm)"
                    : selected.includes(n)
                      ? "var(--accent)"
                      : "var(--fg-muted)"
                }
                strokeWidth="3"
              />
              <text textAnchor="middle" y="5" fill="var(--fg)" fontSize="16">
                {n}
              </text>
              {labels[n] && (
                <text
                  textAnchor="middle"
                  y="-31"
                  fill="var(--fg)"
                  fontSize="14"
                >
                  {labels[n]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <button onClick={() => setPositions(initial)}>
        Rétablir la disposition du graphe
      </button>
      <p className="nl-source">
        Glisse les sommets avec la souris ou le doigt. Au clavier : Tab,
        flèches, Entrée. La longueur dessinée n’est pas le coût : lis les poids
        sur les arcs.
      </p>
    </div>
  );
}
