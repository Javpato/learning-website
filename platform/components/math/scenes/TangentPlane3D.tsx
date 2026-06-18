"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { ScalarField2D } from "@/lib/math/calculus";

const RES = 48; // grid subdivisions per axis

/**
 * Surface z = f(x,y) over a fixed window centred on `center`, rendered with
 * three.js axes (x = right, z = depth, y = up). A `flatten` factor in [0,1]
 * morphs every vertex from its true height toward the tangent-plane height at
 * `a`, so toggling it visibly collapses the surface onto its tangent plane.
 */
function Surface({
  field,
  center,
  a,
  half,
  flatten,
}: {
  field: ScalarField2D;
  center: [number, number];
  a: [number, number];
  half: number;
  flatten: number;
}) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const tRef = useRef(0);

  // Build the (RES+1)² grid once per window: domain coords + base/tangent
  // heights, all centred so `center` sits at the world origin.
  const { positions, indices, baseY, count } = useMemo(() => {
    const [cx, cy] = center;
    const f0 = field.value(cx, cy);
    const n = RES + 1;
    const pos = new Float32Array(n * n * 3);
    const base = new Float32Array(n * n);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const mx = cx - half + (2 * half * i) / RES;
        const my = cy - half + (2 * half * j) / RES;
        const k = j * n + i;
        pos[k * 3] = mx - cx;
        pos[k * 3 + 1] = field.value(mx, my) - f0;
        pos[k * 3 + 2] = my - cy;
        base[k] = field.value(mx, my) - f0;
      }
    }
    const idx: number[] = [];
    for (let j = 0; j < RES; j++) {
      for (let i = 0; i < RES; i++) {
        const k = j * n + i;
        idx.push(k, k + 1, k + n, k + 1, k + n + 1, k + n);
      }
    }
    return { positions: pos, indices: idx, baseY: base, count: n * n };
  }, [field, center, half]);

  // Animate the height morph toward the requested flatten target each frame.
  useFrame(() => {
    const geom = geomRef.current;
    if (!geom) return;
    tRef.current += (flatten - tRef.current) * 0.12;
    const t = tRef.current;
    const [cx, cy] = center;
    const f0 = field.value(cx, cy);
    const [gx, gy] = field.gradient(a[0], a[1]);
    const fa = field.value(a[0], a[1]);
    const attr = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let k = 0; k < count; k++) {
      const x = positions[k * 3]; // = mx - cx
      const z = positions[k * 3 + 2]; // = my - cy
      const mx = x + cx;
      const my = z + cy;
      const tan = fa + gx * (mx - a[0]) + gy * (my - a[1]) - f0;
      attr.setY(k, baseY[k] * (1 - t) + tan * t);
    }
    attr.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="index"
          args={[new Uint16Array(indices), 1]}
        />
      </bufferGeometry>
      <meshStandardMaterial
        color="#58a6ff"
        side={THREE.DoubleSide}
        flatShading={false}
        roughness={0.55}
        metalness={0.1}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

/** Translucent tangent plane at `a`, drawn over the same window. */
function TangentPlane({
  field,
  center,
  a,
  half,
}: {
  field: ScalarField2D;
  center: [number, number];
  a: [number, number];
  half: number;
}) {
  const { positions } = useMemo(() => {
    const [cx, cy] = center;
    const f0 = field.value(cx, cy);
    const fa = field.value(a[0], a[1]);
    const [gx, gy] = field.gradient(a[0], a[1]);
    const corners: Array<[number, number]> = [
      [cx - half, cy - half],
      [cx + half, cy - half],
      [cx + half, cy + half],
      [cx - half, cy + half],
    ];
    const pos = new Float32Array(4 * 3);
    corners.forEach(([mx, my], i) => {
      pos[i * 3] = mx - cx;
      pos[i * 3 + 1] = fa + gx * (mx - a[0]) + gy * (my - a[1]) - f0;
      pos[i * 3 + 2] = my - cy;
    });
    return { positions: pos };
  }, [field, center, a, half]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute
          attach="index"
          args={[new Uint16Array([0, 1, 2, 0, 2, 3]), 1]}
        />
      </bufferGeometry>
      <meshBasicMaterial
        color="#f5b942"
        side={THREE.DoubleSide}
        transparent
        opacity={0.32}
      />
    </mesh>
  );
}

/** Scene contents: surface, tangent plane, draggable base point, lights, controls. */
function Scene({
  field,
  center,
  a,
  setA,
  half,
  flatten,
}: {
  field: ScalarField2D;
  center: [number, number];
  a: [number, number];
  setA: (a: [number, number]) => void;
  half: number;
  flatten: number;
}) {
  const [dragging, setDragging] = useState(false);
  const [cx, cy] = center;
  const f0 = field.value(cx, cy);
  const pointPos: [number, number, number] = [
    a[0] - cx,
    field.value(a[0], a[1]) - f0,
    a[1] - cy,
  ];

  function onGroundMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging) return;
    const nx = THREE.MathUtils.clamp(e.point.x + cx, cx - half, cx + half);
    const ny = THREE.MathUtils.clamp(e.point.z + cy, cy - half, cy + half);
    setA([nx, ny]);
  }

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 5]} intensity={1.1} />

      <Surface
        field={field}
        center={center}
        a={a}
        half={half}
        flatten={flatten}
      />
      <TangentPlane field={field} center={center} a={a} half={half} />

      {/* invisible ground plane: raycast target for dragging the base point */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={onGroundMove}
        onPointerUp={() => setDragging(false)}
        visible={false}
      >
        <planeGeometry args={[half * 6, half * 6]} />
        <meshBasicMaterial />
      </mesh>

      {/* draggable base point a */}
      <mesh
        position={pointPos}
        onPointerDown={(e) => {
          e.stopPropagation();
          setDragging(true);
        }}
        onPointerUp={() => setDragging(false)}
      >
        <sphereGeometry args={[half * 0.05, 16, 16]} />
        <meshStandardMaterial color="#e8e6e3" emissive="#58a6ff" emissiveIntensity={0.3} />
      </mesh>

      <OrbitControls enabled={!dragging} enablePan={false} />
    </>
  );
}

export function TangentPlane3D({
  field,
  center,
  a,
  setA,
  flatten,
  half = 1.5,
}: {
  field: ScalarField2D;
  center: [number, number];
  a: [number, number];
  setA: (a: [number, number]) => void;
  flatten: number;
  half?: number;
}) {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border border-border bg-bg-elevated-2">
      <Canvas camera={{ position: [2.6, 2.4, 2.6], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#1d222c"]} />
        <Scene
          field={field}
          center={center}
          a={a}
          setA={setA}
          half={half}
          flatten={flatten}
        />
      </Canvas>
    </div>
  );
}
