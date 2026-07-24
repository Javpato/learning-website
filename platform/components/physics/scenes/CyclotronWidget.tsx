"use client";

// Charged-particle dynamics explorer (lesson: dynamique des particules
// chargées). 3D trajectory in uniform fields (RK4): pure B → circle/helix;
// the velocity-selector preset adds E ⟂ B and shows the undeflected beam
// exactly when v = E/B. Sliders for v⊥, v∥, B and the charge sign.

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { cyclotron, trajectory3, type V3 } from "@/lib/physics/particle";

function TrajectoryLine({ points, color }: { points: V3[]; color: string }) {
  const obj = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[2], p[1])));
    // three axes: x → x, y → up (= physics z), z → physics y
    return new THREE.Line(geom, new THREE.LineBasicMaterial({ color }));
  }, [points, color]);
  return <primitive object={obj} />;
}

export function CyclotronWidget() {
  const [mode, setMode] = useState<"cyclotron" | "selecteur">("cyclotron");
  const [vPerp, setVPerp] = useState(1);
  const [vPar, setVPar] = useState(0.3);
  const [B, setB] = useState(1.5);
  const [sign, setSign] = useState<1 | -1>(1);

  const E: V3 = mode === "selecteur" ? [0, -1.5, 0] : [0, 0, 0]; // E ⟂ B, opposing qv×B for v = E/B
  const traj = useMemo(
    () =>
      trajectory3([vPerp, 0, mode === "cyclotron" ? vPar : 0], E, [0, 0, B], sign, {
        h: 0.008,
        steps: 4000,
      }),
    [vPerp, vPar, B, sign, mode], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { R, omega } = cyclotron(vPerp, B);
  const vSelect = mode === "selecteur" ? Math.abs(E[1]) / B : null;

  return (
    <div
      className="widget-frame"
      role="group"
      aria-label="Trajectoire 3D d'une particule chargée dans des champs uniformes : hélice cyclotron et sélecteur de vitesse, avec vitesse, champ et signe de charge réglables"
    >
      <div style={{ height: 340 }}>
        <Canvas camera={{ position: [3, 2.4, 3], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 3]} intensity={0.7} />
          <TrajectoryLine points={traj} color="#58a6ff" />
          {/* B along +z (up in the scene) */}
          <primitive
            object={new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(2, 0, 2), 1, "#f5b942", 0.18, 0.1)}
          />
          {mode === "selecteur" && (
            <primitive
              object={new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(2, 0.5, 2), 1, "#f87171", 0.18, 0.1)}
            />
          )}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#e8e6e3" />
          </mesh>
          <gridHelper args={[6, 12, "#39404d", "#242a33"]} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>

      <div className="widget-controls">
        <button type="button" className={mode === "cyclotron" ? "btn btn-accent" : "btn"} onClick={() => setMode("cyclotron")}>
          Cyclotron / hélice
        </button>
        <button type="button" className={mode === "selecteur" ? "btn btn-accent" : "btn"} onClick={() => setMode("selecteur")}>
          Sélecteur de vitesse (E ⟂ B)
        </button>
        <button type="button" className="btn" onClick={() => setSign((s) => (s === 1 ? -1 : 1))}>
          charge : {sign === 1 ? "+q" : "−q"}
        </button>
      </div>
      <div className="widget-controls">
        <label>
          <span>v⊥ = {vPerp.toFixed(1)}</span>
          <input type="range" min={0.2} max={2.5} step={0.1} value={vPerp} onChange={(e) => setVPerp(Number(e.target.value))} aria-label="Vitesse perpendiculaire au champ magnétique" />
        </label>
        {mode === "cyclotron" && (
          <label>
            <span>v∥ = {vPar.toFixed(1)}</span>
            <input type="range" min={0} max={1.5} step={0.1} value={vPar} onChange={(e) => setVPar(Number(e.target.value))} aria-label="Vitesse parallèle au champ magnétique" />
          </label>
        )}
        <label>
          <span>B = {B.toFixed(1)}</span>
          <input type="range" min={0.3} max={3} step={0.1} value={B} onChange={(e) => setB(Number(e.target.value))} aria-label="Intensité du champ magnétique" />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setMode("cyclotron");
            setVPerp(1);
            setVPar(0.3);
            setB(1.5);
            setSign(1);
          }}
        >
          Réinitialiser
        </button>
      </div>
      <div className="widget-controls" aria-live="polite">
        <span className="widget-readout">
          R = mv⊥/(|q|B) = {Number.isFinite(R) ? R.toFixed(2) : "∞"} · ω_c = |q|B/m = {omega.toFixed(2)}
          {vSelect !== null ? ` · v sélectionnée = E/B = ${vSelect.toFixed(2)}` : ` · pas d'hélice si v∥ = 0`}
        </span>
      </div>
      <p className="widget-hint">
        Double B : le rayon est divisé par deux mais la fréquence ω_c double —
        c&apos;est l&apos;indépendance du rayon et de la période qui fait
        marcher le cyclotron. En mode sélecteur, ajuste v⊥ jusqu&apos;à
        v = E/B = {mode === "selecteur" ? (1.5 / B).toFixed(2) : "E/B"} : la
        trajectoire devient rectiligne (forces électrique et magnétique
        opposées). Change le signe de la charge : le sens de rotation
        s&apos;inverse.
      </p>
    </div>
  );
}
