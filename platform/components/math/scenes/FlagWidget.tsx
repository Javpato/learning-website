"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type V3 = [number, number, number];

const STAGES = ["{0}", "D₁ (droite)", "D₂ (plan)", "ℝ³"];

/** A colored basis vector e_i from the origin (thin line + sphere tip). */
function BasisVector({ dir, color, visible }: { dir: V3; color: string; visible: boolean }) {
  if (!visible) return null;
  const positions = new Float32Array([0, 0, 0, ...dir]);
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </lineSegments>
      <mesh position={dir}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Scene({ level }: { level: number }) {
  // D₁ along x (red), D₂ = xy-plane (blue), ℝ³ ambient (box). e₁,e₂,e₃ adapted basis.
  const lineD1 = new Float32Array([-1.6, 0, 0, 1.6, 0, 0]);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={0.6} />

      {/* ℝ³ ambient cube (level 3) */}
      {level >= 3 && (
        <mesh>
          <boxGeometry args={[3, 3, 3]} />
          <meshBasicMaterial color="#6ee7b7" wireframe transparent opacity={0.18} />
        </mesh>
      )}

      {/* D₂ = plane (level 2) */}
      {level >= 2 && (
        <mesh>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial color="#58a6ff" transparent opacity={level === 2 ? 0.32 : 0.16} side={2} />
        </mesh>
      )}

      {/* D₁ = line (level 1) */}
      {level >= 1 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lineD1, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#f87171" linewidth={2} />
        </lineSegments>
      )}

      {/* origin {0} — always shown */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#e8e6e3" />
      </mesh>

      {/* adapted basis e₁∈D₁, e₂∈D₂, e₃ out of the plane */}
      <BasisVector dir={[1.2, 0, 0]} color="#f87171" visible={level >= 1} />
      <BasisVector dir={[0, 1.2, 0]} color="#58a6ff" visible={level >= 2} />
      <BasisVector dir={[0, 0, 1.2]} color="#6ee7b7" visible={level >= 3} />

      <OrbitControls enablePan={false} />
    </>
  );
}

/**
 * The complete flag {0} ⊂ D₁ ⊂ D₂ ⊂ ℝ³ built one dimension at a time: a line
 * inside a plane inside space, with the adapted basis e₁,e₂,e₃. Step through the
 * tower and rotate it to see the strict nesting.
 */
export function FlagWidget() {
  const [level, setLevel] = useState(2);

  return (
    <div className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {STAGES.map((s, i) => (
          <button key={s} type="button" onClick={() => setLevel(i)} className={i === level ? "btn btn-accent" : "btn"}>
            {s}
          </button>
        ))}
      </div>

      <div className="h-[380px] w-full overflow-hidden rounded-lg border border-border bg-bg-elevated-2">
        <Canvas camera={{ position: [3, 2.4, 3.4], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#1d222c"]} />
          <Scene level={level} />
        </Canvas>
      </div>

      <div className="mt-2 font-mono text-sm text-fg-muted">
        dim = <span className="text-fg">{level}</span> ·{" "}
        <span className="text-danger">e₁ ∈ D₁</span> ⊂{" "}
        <span className="text-accent">D₂ = Vect(e₁, e₂)</span> ⊂{" "}
        <span className="text-success">ℝ³</span>
      </div>
      <div className="mt-1 text-xs text-fg-dim">
        Chaque cran ajoute exactement une dimension : c&apos;est un <em>drapeau complet</em>.
        Un endomorphisme qui stabilise cette tour est triangulaire supérieur dans la base (e₁,e₂,e₃).
      </div>
    </div>
  );
}
