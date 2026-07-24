"use client";

// Biot–Savart explorer (lesson: loi de Biot–Savart). 3D scene: a current
// loop or straight wire; a slider walks one current element dℓ along the
// wire, showing dℓ (orange), the vector R toward the observation point, and
// the elementary contribution dB = dℓ × R̂ / R² (green) — the right-hand
// rule made visible. A toggle sums every element to show the total B.

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { dB, loopWire, norm, scale, straightWire, totalB, type V3 } from "@/lib/physics/magnetostatics";

function Arrow({ from, vec, color, scale: s = 1 }: { from: V3; vec: V3; color: string; scale?: number }) {
  const obj = useMemo(() => {
    const dir = new THREE.Vector3(...vec);
    const len = dir.length() * s;
    if (len < 1e-6) return null;
    dir.normalize();
    const helper = new THREE.ArrowHelper(dir, new THREE.Vector3(...from), len, color, Math.min(0.16, 0.3 * len), Math.min(0.09, 0.18 * len));
    return helper;
  }, [from, vec, color, s]);
  if (!obj) return null;
  return <primitive object={obj} />;
}

function WireLine({ points }: { points: V3[] }) {
  const obj = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#f5b942" }));
  }, [points]);
  return <primitive object={obj} />;
}

export function BiotSavartWidget() {
  const [shape, setShape] = useState<"boucle" | "fil">("boucle");
  const [si, setSi] = useState(10); // element index
  const [zObs, setZObs] = useState(1.2);
  const [showSum, setShowSum] = useState(false);

  const wire = useMemo(() => (shape === "boucle" ? loopWire(1, 48) : straightWire(2, 48)), [shape]);
  const rObs: V3 = shape === "boucle" ? [0, 0, zObs] : [1, 0, zObs * 0.5];

  const i = Math.min(si, wire.points.length - 2);
  const el = useMemo(() => dB(wire, i, rObs), [wire, i, rObs]);
  const B = useMemo(() => totalB(wire, rObs), [wire, rObs]);

  const dBnorm = norm(el.dB);
  const Bnorm = norm(B);

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Explorateur Biot–Savart en 3D : élément de courant réglable le long d'un fil ou d'une boucle, vecteurs dl, R et dB, et champ total sommé"
    >
      <div style={{ height: 340 }}>
        <Canvas camera={{ position: [2.8, 2.2, 2.8], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 3]} intensity={0.7} />
          <WireLine points={wire.points} />
          {/* current element */}
          <Arrow from={el.mid} vec={scale(el.dl, 4)} color="#f97316" />
          {/* R vector from element to observation point */}
          <Arrow from={el.mid} vec={el.R} color="#9aa0a6" />
          {/* dB contribution at the observation point */}
          <Arrow from={rObs} vec={scale(el.dB, 2.5 / Math.max(dBnorm, 1e-6))} color="#6ee7b7" scale={Math.min(1, dBnorm * 3) || 0.2} />
          {showSum && <Arrow from={rObs} vec={scale(B, 1 / Math.max(Bnorm, 1e-6))} color="#58a6ff" />}
          <mesh position={rObs}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#e8e6e3" />
          </mesh>
          <gridHelper args={[4, 8, "#39404d", "#242a33"]} position={[0, -1.4, 0]} />
          <axesHelper args={[1.2]} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>

      <div className="widget-controls">
        <button type="button" className={shape === "boucle" ? "btn btn-accent" : "btn"} onClick={() => setShape("boucle")}>
          Spire circulaire
        </button>
        <button type="button" className={shape === "fil" ? "btn btn-accent" : "btn"} onClick={() => setShape("fil")}>
          Fil rectiligne
        </button>
        <label>
          <span>élément dℓ n° {i + 1}</span>
          <input
            type="range"
            min={0}
            max={46}
            step={1}
            value={si}
            onChange={(e) => setSi(Number(e.target.value))}
            aria-label="Position de l'élément de courant le long du circuit"
          />
        </label>
        <label>
          <span>point d&apos;observation z = {zObs.toFixed(1)}</span>
          <input
            type="range"
            min={0.3}
            max={2.5}
            step={0.1}
            value={zObs}
            onChange={(e) => setZObs(Number(e.target.value))}
            aria-label="Hauteur du point d'observation sur l'axe"
          />
        </label>
        <button type="button" className={showSum ? "btn btn-accent" : "btn"} onClick={() => setShowSum((v) => !v)}>
          Somme totale B {showSum ? "✓" : ""}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setShape("boucle");
            setSi(10);
            setZObs(1.2);
            setShowSum(false);
          }}
        >
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          |dB| ∝ {dBnorm.toFixed(3)} · |B| total ∝ {Bnorm.toFixed(3)} (μ₀I/4π = 1)
        </span>
      </div>
      <p className="widget-hint">
        Vérifie la règle de la main droite : dB (vert) est perpendiculaire à
        la fois à dℓ (orange) et à R (gris). Fais tourner l&apos;élément le
        long de la spire : chaque dB penche différemment, mais leurs
        composantes hors-axe se compensent — active « Somme totale » pour
        voir B (bleu) aligné avec l&apos;axe. Éloigne ensuite le point
        d&apos;observation : le champ décroît comme 1/z³, celui d&apos;un
        dipôle magnétique.
      </p>
    </div>
  );
}
