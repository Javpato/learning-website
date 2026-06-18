"use client";

import { useMemo, useState } from "react";
import { Mafs, Coordinates, Polygon, Line, Vector, Point, Text, Theme } from "mafs";
import {
  type Mat,
  matMul,
  matVec,
  rankNullityVerdict,
  nullSpaceBasis,
  columnSpaceBasis,
} from "@/lib/math/linalg";

type Preset = { label: string; note: string; M: Mat };

// Three regimes, chosen so the chains behave differently and visibly:
const PRESETS: Preset[] = [
  {
    label: "Inversible",
    note: "rang 2 — stabilisé d'emblée",
    M: [
      [1, 0.5],
      [-0.4, 1],
    ],
  },
  {
    label: "Projection",
    note: "rang 1 — stabilisé (f² = f)",
    M: [
      [1, 0],
      [0, 0],
    ],
  },
  {
    label: "Nilpotente",
    note: "f² = 0 — NON stabilisé",
    M: [
      [0, 1],
      [0, 0],
    ],
  },
];

const S = 4; // half-length for drawing lines through the origin
const fmt = (x: number) => (Math.abs(x) < 1e-9 ? 0 : Math.round(x * 100) / 100);

/** Image of the unit square corners under M — visualises im(M) as a shape. */
function mappedSquare(M: Mat): [number, number][] {
  const corners: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  return corners.map((c) => {
    const [x, y] = matVec(M, c);
    return [x, y] as [number, number];
  });
}

/** A single plane showing how M acts: its image (square/line/point) + kernel. */
function Panel({ M, title }: { M: Mat; title: string }) {
  const dimIm = useMemo(() => columnSpaceBasis(M).length, [M]);
  const dimKer = 2 - dimIm;
  const kerBasis = useMemo(() => nullSpaceBasis(M), [M]);
  const imBasis = useMemo(() => columnSpaceBasis(M), [M]);

  const square = mappedSquare(M);
  const col1: [number, number] = [M[0][0], M[1][0]];
  const col2: [number, number] = [M[0][1], M[1][1]];

  return (
    <div>
      <div className="mb-1 text-center text-sm text-fg-muted">{title}</div>
      <Mafs viewBox={{ x: [-S, S], y: [-S, S] }} height={300}>
        <Coordinates.Cartesian
          subdivisions={false}
          xAxis={{ labels: false }}
          yAxis={{ labels: false }}
        />

        {/* KERNEL — what collapses to 0 (red) */}
        {dimKer === 2 && (
          <Polygon
            points={[
              [-S, -S],
              [S, -S],
              [S, S],
              [-S, S],
            ]}
            color={Theme.red}
            fillOpacity={0.12}
            strokeOpacity={0}
          />
        )}
        {dimKer === 1 && kerBasis[0] && (
          <Line.Segment
            point1={[-S * kerBasis[0][0], -S * kerBasis[0][1]]}
            point2={[S * kerBasis[0][0], S * kerBasis[0][1]]}
            color={Theme.red}
          />
        )}

        {/* IMAGE — where everything lands (blue) */}
        {dimIm === 2 && (
          <Polygon points={square} color={Theme.blue} fillOpacity={0.22} />
        )}
        {dimIm === 1 && imBasis[0] && (
          <Line.Segment
            point1={[-S * imBasis[0][0], -S * imBasis[0][1]]}
            point2={[S * imBasis[0][0], S * imBasis[0][1]]}
            color={Theme.blue}
          />
        )}

        {/* the columns Me₁, Me₂ — f acting on the basis; their span is im f */}
        <Vector tip={col1} color={Theme.blue} />
        <Vector tip={col2} color={Theme.blue} />
        <Point x={0} y={0} color={Theme.foreground} />

        <Text x={0} y={-S + 0.5} attach="n" size={13} color={Theme.red}>
          ker (dim {dimKer})
        </Text>
        <Text x={0} y={S - 0.2} attach="s" size={13} color={Theme.blue}>
          im (dim {dimIm})
        </Text>
      </Mafs>
    </div>
  );
}

export function FittingWidget() {
  const [entries, setEntries] = useState<Mat>([
    [0, 1],
    [0, 0],
  ]);

  const M = entries;
  const M2 = useMemo(() => matMul(M, M), [M]);
  const v = useMemo(() => rankNullityVerdict(M), [M]);

  function setCell(i: number, j: number, value: number) {
    setEntries((prev) => {
      const next = prev.map((row) => row.slice());
      next[i][j] = value;
      return next;
    });
  }

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      {/* matrix editor + presets */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-fg-muted">f =</span>
          <div className="grid grid-cols-2 gap-1">
            {[0, 1].map((i) =>
              [0, 1].map((j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  step={1}
                  value={entries[i][j]}
                  onChange={(e) => setCell(i, j, Number(e.target.value) || 0)}
                  className="w-14 rounded border border-border bg-bg-elevated-2 px-2 py-1 text-center font-mono text-sm text-fg"
                />
              )),
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setEntries(p.M.map((r) => r.slice()))}
              className="btn text-left"
              title={p.note}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* the two planes: f and f² side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel M={M} title="f — image (bleu) & noyau (rouge)" />
        <Panel M={M2} title="f² — image (bleu) & noyau (rouge)" />
      </div>

      {/* live verdict — the equivalence, measured */}
      <div className="mt-4 rounded border border-border bg-bg-elevated-2 px-4 py-3 font-mono text-sm">
        <div className="grid gap-1 sm:grid-cols-2">
          <div className="text-fg-muted">
            rang f = <span className="text-fg">{v.rank1}</span> &nbsp; dim ker f ={" "}
            <span className="text-fg">{v.dimKer1}</span> &nbsp; dim im f ={" "}
            <span className="text-fg">{v.dimIm1}</span>
          </div>
          <div className="text-fg-muted">
            rang f² = <span className="text-fg">{v.rank2}</span> &nbsp; dim ker f² ={" "}
            <span className="text-fg">{v.dimKer2}</span> &nbsp; dim im f² ={" "}
            <span className="text-fg">{v.dimIm2}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          <span>
            ker f = ker f² ?{" "}
            <span className={v.kerEqual ? "text-success" : "text-danger"}>
              {v.kerEqual ? "OUI ✓" : "NON ✗"}
            </span>
          </span>
          <span>
            im f = im f² ?{" "}
            <span className={v.imEqual ? "text-success" : "text-danger"}>
              {v.imEqual ? "OUI ✓" : "NON ✗"}
            </span>
          </span>
        </div>
        <div className="mt-2 text-xs text-fg-dim">
          {v.stabilised
            ? "Les deux égalités tombent ensemble : rang f = rang f²."
            : "Les deux échouent ensemble : rang f ≠ rang f² (le noyau grandit, l'image rétrécit)."}
        </div>
      </div>
    </div>
  );
}
