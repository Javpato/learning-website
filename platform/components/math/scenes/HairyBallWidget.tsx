"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Field = "meridiens" | "tourbillon";
type V3 = [number, number, number];

const AXIS: V3 = [0, 1, 0]; // comb axis (three.js up); both fields vanish at ±AXIS

function fibSphere(n: number): V3[] {
  const pts: V3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

function tangent(p: V3, field: Field): V3 {
  const [ax, ay, az] = AXIS;
  if (field === "tourbillon") {
    // a × p  (swirl around the axis)
    return [ay * p[2] - az * p[1], az * p[0] - ax * p[2], ax * p[1] - ay * p[0]];
  }
  // a − (a·p) p  (comb along meridians)
  const dot = ax * p[0] + ay * p[1] + az * p[2];
  return [ax - dot * p[0], ay - dot * p[1], az - dot * p[2]];
}

/** All the "hairs" as one lineSegments buffer (base on sphere → tip along tangent). */
function Hairs({ field }: { field: Field }) {
  const positions = useMemo(() => {
    const pts = fibSphere(500);
    const arr: number[] = [];
    const len = 0.16;
    for (const p of pts) {
      const t = tangent(p, field);
      const m = Math.hypot(t[0], t[1], t[2]);
      if (m < 1e-3) continue; // near a zero: no hair to draw
      const s = len / m;
      arr.push(p[0], p[1], p[2], p[0] + t[0] * s, p[1] + t[1] * s, p[2] + t[2] * s);
    }
    return new Float32Array(arr);
  }, [field]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#58a6ff" />
    </lineSegments>
  );
}

function Scene({ field }: { field: Field }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={0.7} />
      {/* the ball */}
      <mesh>
        <sphereGeometry args={[0.99, 48, 48]} />
        <meshStandardMaterial color="#1d222c" roughness={0.8} metalness={0.05} />
      </mesh>
      <Hairs field={field} />
      {/* the two unavoidable zeros (cowlicks) at the poles ±AXIS */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[AXIS[0] * s, AXIS[1] * s, AXIS[2] * s]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#f87171" emissive="#f87171" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <OrbitControls enablePan={false} />
    </>
  );
}

type Lang = "fr" | "es" | "en";

const L: Record<Lang, { meridiens: string; tourbillon: string; capA: string; red: string; capB: string }> = {
  fr: {
    meridiens: "coiffage : méridiens",
    tourbillon: "coiffage : tourbillon",
    capA: "Les deux points ",
    red: "rouges",
    capB: " sont les épis : le champ tangent s'y annule. Quelle que soit la façon de coiffer, il en reste au moins un — c'est le théorème. Fais tourner la sphère à la souris.",
  },
  es: {
    meridiens: "peinado: meridianos",
    tourbillon: "peinado: remolino",
    capA: "Los dos puntos ",
    red: "rojos",
    capB: " son los remolinos: el campo tangente se anula ahí. Sea cual sea la forma de peinar, queda al menos uno — es el teorema. Gira la esfera con el ratón.",
  },
  en: {
    meridiens: "combing: meridians",
    tourbillon: "combing: swirl",
    capA: "The two ",
    red: "red",
    capB: " points are the cowlicks: the tangent field vanishes there. However you comb, at least one remains — that's the theorem. Rotate the sphere with the mouse.",
  },
};

/**
 * The hairy ball theorem made visible: two attempts to "comb" S² (along
 * meridians, or as a swirl). Each leaves a bald cowlick — a zero of the field —
 * marked in red. No continuous tangent field on S² avoids them all.
 */
export function HairyBallWidget({ lang = "fr" }: { lang?: Lang }) {
  const t = L[lang] ?? L.fr;
  const [field, setField] = useState<Field>("meridiens");

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setField("meridiens")} className={field === "meridiens" ? "btn btn-accent" : "btn"}>
          {t.meridiens}
        </button>
        <button type="button" onClick={() => setField("tourbillon")} className={field === "tourbillon" ? "btn btn-accent" : "btn"}>
          {t.tourbillon}
        </button>
      </div>

      <div className="h-[380px] w-full overflow-hidden rounded-lg border border-border bg-bg-elevated-2">
        <Canvas camera={{ position: [2.4, 1.4, 2.4], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#1d222c"]} />
          <Scene field={field} />
        </Canvas>
      </div>

      <div className="mt-2 text-xs text-fg-dim">
        {t.capA}
        <span className="text-danger">{t.red}</span>
        {t.capB}
      </div>
    </div>
  );
}
