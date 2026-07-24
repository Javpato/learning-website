"use client";

// Surface ↔ level-curves explorer (lesson: surfaces & lignes de niveau).
// Left: rotatable 3D surface z = f(x, y). Right: the 2D contour map of the
// SAME function — the learner connects the two representations. Presets
// cover the lesson's prototypes; a level slider highlights one contour on
// both panes (drawn as a curve in 2D and a cutting plane in 3D).

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Mafs, Coordinates, Polyline, Theme } from "mafs";
import { contourFamily, contourLines } from "@/lib/math/contours";

type Preset = {
  label: string;
  f: (x: number, y: number) => number;
  levels: number[];
  range: [number, number]; // level slider range
};

const HALF = 2.2;

const PRESETS: Preset[] = [
  {
    label: "Paraboloïde x²+y²",
    f: (x, y) => x * x + y * y,
    levels: [0.5, 1.5, 3, 5, 7.5],
    range: [0.2, 8],
  },
  {
    label: "Selle x²−y²",
    f: (x, y) => x * x - y * y,
    levels: [-4, -2, -0.8, 0, 0.8, 2, 4],
    range: [-4, 4],
  },
  {
    label: "Colline gaussienne",
    f: (x, y) => 2.5 * Math.exp(-(x * x + y * y)),
    levels: [0.2, 0.6, 1.2, 1.8, 2.3],
    range: [0.1, 2.4],
  },
  {
    label: "Double puits",
    f: (x, y) => 0.5 * (x * x - 1) * (x * x - 1) + y * y,
    levels: [0.1, 0.3, 0.5, 1, 2, 3.5],
    range: [0.05, 4],
  },
];

const RES = 56;

function SurfaceMesh({ f, zScale }: { f: (x: number, y: number) => number; zScale: number }) {
  const { geometry } = useMemo(() => {
    const n = RES + 1;
    const pos = new Float32Array(n * n * 3);
    const colors = new Float32Array(n * n * 3);
    let zMin = Infinity;
    let zMax = -Infinity;
    const zs = new Float64Array(n * n);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const x = -HALF + (2 * HALF * i) / RES;
        const y = -HALF + (2 * HALF * j) / RES;
        const z = f(x, y);
        zs[j * n + i] = z;
        if (z < zMin) zMin = z;
        if (z > zMax) zMax = z;
      }
    }
    const span = zMax - zMin || 1;
    const cold = new THREE.Color("#2f5f9e");
    const hot = new THREE.Color("#f5b942");
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const k = j * n + i;
        const x = -HALF + (2 * HALF * i) / RES;
        const y = -HALF + (2 * HALF * j) / RES;
        const z = zs[k];
        // three: x right, z depth, y up
        pos[k * 3] = x;
        pos[k * 3 + 1] = z * zScale;
        pos[k * 3 + 2] = y;
        const c = cold.clone().lerp(hot, (z - zMin) / span);
        colors[k * 3] = c.r;
        colors[k * 3 + 1] = c.g;
        colors[k * 3 + 2] = c.b;
      }
    }
    const idx: number[] = [];
    for (let j = 0; j < RES; j++) {
      for (let i = 0; i < RES; i++) {
        const k = j * n + i;
        idx.push(k, k + 1, k + n, k + 1, k + n + 1, k + n);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setIndex(idx);
    geometry.computeVertexNormals();
    return { geometry };
  }, [f, zScale]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} metalness={0.1} roughness={0.75} />
    </mesh>
  );
}

/** The highlighted level, drawn as 3D curves lifted onto the surface height. */
function LevelCurve3D({
  f,
  level,
  zScale,
}: {
  f: (x: number, y: number) => number;
  level: number;
  zScale: number;
}) {
  const lines = useMemo(
    () => contourLines(f, level, [-HALF, HALF], [-HALF, HALF], 72),
    [f, level],
  );
  return (
    <>
      {lines.map((line, i) => {
        const pts = line.map(([x, y]) => new THREE.Vector3(x, level * zScale + 0.01, y));
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={i}
            object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#6ee7b7" }))}
          />
        );
      })}
    </>
  );
}

export function SurfaceLevelWidget() {
  const [pi, setPi] = useState(0);
  const preset = PRESETS[pi];
  const [level, setLevel] = useState(() => (PRESETS[0].range[0] + PRESETS[0].range[1]) / 2);

  const zScale = pi === 0 ? 0.35 : pi === 1 ? 0.35 : pi === 2 ? 0.8 : 0.5;

  const contours = useMemo(
    () => contourFamily(preset.f, preset.levels, [-HALF, HALF], [-HALF, HALF], 72),
    [preset],
  );
  const highlighted = useMemo(
    () => contourLines(preset.f, level, [-HALF, HALF], [-HALF, HALF], 72),
    [preset, level],
  );

  const selectPreset = (i: number) => {
    setPi(i);
    setLevel((PRESETS[i].range[0] + PRESETS[i].range[1]) / 2);
  };

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Explorateur surface / lignes de niveau : une surface 3D orientable et sa carte de niveaux 2D, avec un niveau c ajustable mis en évidence sur les deux vues"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <div style={{ height: 320 }}>
          <Canvas camera={{ position: [3.4, 2.6, 3.4], fov: 42 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 6, 3]} intensity={0.9} />
            <SurfaceMesh f={preset.f} zScale={zScale} />
            <LevelCurve3D f={preset.f} level={level} zScale={zScale} />
            <gridHelper args={[2 * HALF, 8, "#39404d", "#242a33"]} position={[0, -0.001, 0]} />
            <OrbitControls enablePan={false} />
          </Canvas>
        </div>
        <Mafs viewBox={{ x: [-HALF, HALF], y: [-HALF, HALF] }} height={320} preserveAspectRatio="contain">
          <Coordinates.Cartesian subdivisions={2} />
          {contours.map(({ level: c, lines }) =>
            lines.map((line, i) => (
              <Polyline key={`${c}-${i}`} points={line} color={Theme.blue} svgPolylineProps={{ opacity: 0.4 }} weight={1.2} />
            )),
          )}
          {highlighted.map((line, i) => (
            <Polyline key={`h-${i}`} points={line} color={Theme.green} weight={2.5} />
          ))}
        </Mafs>
      </div>

      <div className="widget-controls">
        {PRESETS.map((p, i) => (
          <button key={p.label} type="button" className={i === pi ? "btn btn-accent" : "btn"} onClick={() => selectPreset(i)}>
            {p.label}
          </button>
        ))}
        <label>
          <span>
            niveau c = <span className="widget-readout">{level.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={preset.range[0]}
            max={preset.range[1]}
            step={(preset.range[1] - preset.range[0]) / 100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            aria-label="Niveau c de la ligne de niveau mise en évidence"
          />
        </label>
        <button type="button" className="btn" onClick={() => selectPreset(pi)}>
          Réinitialiser
        </button>
      </div>
      <p className="widget-hint">
        Prédis d&apos;abord : à quoi ressemblent les lignes de niveau de la
        selle près de c = 0 ? Fais glisser le niveau et regarde la courbe
        verte se déplacer sur la surface 3D. Pour le double puits, trouve la
        valeur de c où la ligne de niveau change de topologie (deux boucles →
        une seule) — c&apos;est le col.
      </p>
    </div>
  );
}
