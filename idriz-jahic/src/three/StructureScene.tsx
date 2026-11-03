import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { steelMaterial } from "./materials";
import { StudioEnvironment } from "./Environment";
import { boxTubeGeometry, iBeamGeometry } from "./profiles";
import { PARTS, type PartId } from "../data/structureParts";

/*
 * Jeklena hala (portalni okvir) v merilu 1 enota = 1 m:
 * razpon 6 m, višina stebrov 4 m, dva okvirja na razdalji 4 m.
 */
const SPAN = 6;
const H = 4;
const BAY = 4;
const COL = { h: 0.2, b: 0.2, tw: 0.009, tf: 0.015 }; // HEB 200
const RAF = { h: 0.3, b: 0.15, tw: 0.0071, tf: 0.0107 }; // IPE 300
const PUR = { h: 0.16, b: 0.082, tw: 0.005, tf: 0.0074 }; // IPE 160
const COL_LEN = H + 0.22; // steber sega do vrha prečke

type Mats = Record<PartId, THREE.MeshPhysicalMaterial>;

function useMaterials(selected: PartId | null): Mats {
  const mats = useMemo(() => {
    const m = {} as Mats;
    for (const p of PARTS) {
      m[p.id] = steelMaterial({ color: p.id === "anchor" ? "#a7adb6" : "#8d96a3", roughness: 0.4, clearcoat: 0.1, emissive: "#087BFF", emissiveIntensity: 0 });
    }
    m.weld.color.set("#c2a27a");
    m.weld.roughness = 0.55;
    return m;
  }, []);
  // označen del zasveti modro
  useFrame(({ clock }) => {
    for (const p of PARTS) {
      const target = p.id === selected ? 0.55 + Math.sin(clock.elapsedTime * 4) * 0.2 : 0;
      const mat = mats[p.id];
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.15;
    }
  });
  return mats;
}

function Bolt({ position, rotation, mat, len = 0.08, r = 0.01 }: { position: [number, number, number]; rotation?: [number, number, number]; mat: THREE.Material; len?: number; r?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh material={mat} position={[0, 0, 0]}>
        <cylinderGeometry args={[r * 1.7, r * 1.7, r * 1.2, 6]} />
      </mesh>
      <mesh material={mat} position={[0, -len / 2, 0]}>
        <cylinderGeometry args={[r, r, len, 10]} />
      </mesh>
    </group>
  );
}

/** En portalni okvir: stebra, prečka, čelni spoji, vute, sidrne plošče in zvari. */
function Frame({ z, mats, onPick }: { z: number; mats: Mats; onPick: (id: PartId) => void }) {
  const col = useMemo(() => iBeamGeometry(COL_LEN, COL.h, COL.b, COL.tw, COL.tf), []);
  const raf = useMemo(() => iBeamGeometry(SPAN - COL.h - 0.04, RAF.h, RAF.b, RAF.tw, RAF.tf), []);
  const haunch = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.7, 0);
    s.lineTo(0, -0.55);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
    g.translate(0, 0, -0.006);
    return g;
  }, []);
  const pick = (id: PartId) => (e: { stopPropagation: () => void }) => { e.stopPropagation(); onPick(id); };

  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((side) => {
        const x = (side * SPAN) / 2;
        return (
          <group key={side}>
            {/* steber */}
            <mesh geometry={col} material={mats.column} position={[x, COL_LEN / 2 + 0.03, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} onClick={pick("column")} castShadow />
            {/* sidrna plošča z vijaki */}
            <group onClick={pick("anchor")}>
              <mesh material={mats.anchor} position={[x, 0.015, 0]} castShadow>
                <boxGeometry args={[0.4, 0.03, 0.4]} />
              </mesh>
              {[[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].map(([dx, dz], k) => (
                <Bolt key={k} position={[x + dx, 0.04, dz]} mat={mats.anchor} len={0.06} r={0.012} />
              ))}
            </group>
            {/* kotni zvar ob vznožju stebra */}
            <group onClick={pick("weld")} position={[x, 0.034, 0]}>
              {[-1, 1].map((f) => (
                <mesh key={f} material={mats.weld} position={[f * (COL.h / 2 + 0.004), 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <capsuleGeometry args={[0.008, COL.b, 4, 8]} />
                </mesh>
              ))}
              <mesh material={mats.weld} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.007, COL.h - COL.tf * 2, 4, 8]} />
              </mesh>
            </group>
            {/* čelna pločevina in vijaki na vrhu stebra */}
            <group onClick={pick("endplate")}>
              <mesh material={mats.endplate} position={[x - side * (COL.h / 2 + 0.01), H + 0.05, 0]} castShadow>
                <boxGeometry args={[0.02, 0.5, 0.22]} />
              </mesh>
              {[-0.18, -0.06, 0.06, 0.18].flatMap((dy) =>
                [-0.06, 0.06].map((dz) => (
                  <Bolt key={`${dy}${dz}`} position={[x - side * (COL.h / 2 + 0.03), H + 0.05 + dy, dz]} rotation={[0, 0, (side * Math.PI) / 2]} mat={mats.endplate} />
                )),
              )}
            </group>
            {/* vuta (ojačitev vogala) */}
            <mesh geometry={haunch} material={mats.haunch} position={[x - side * (COL.h / 2 + 0.02), H - 0.05, 0]} scale={[-side, 1, 1]} onClick={pick("haunch")} castShadow />
          </group>
        );
      })}
      {/* prečka */}
      <mesh geometry={raf} material={mats.rafter} position={[0, H + 0.05 + RAF.h / 2 - 0.1, 0]} rotation={[0, Math.PI / 2, 0]} onClick={pick("rafter")} castShadow />
    </group>
  );
}

function Bracing({ mats, onPick }: { mats: Mats; onPick: (id: PartId) => void }) {
  const len = Math.hypot(BAY, H - 0.4);
  const angle = Math.atan2(H - 0.4, BAY);
  const tube = useMemo(() => boxTubeGeometry(len, 0.05, 0.004), [len]);
  const x = -SPAN / 2 - 0.02;
  return (
    <group onClick={(e) => { e.stopPropagation(); onPick("bracing"); }}>
      {[1, -1].map((s) => (
        <mesh key={s} geometry={tube} material={mats.bracing} position={[x, H / 2 + 0.05, 0]} rotation={[s * angle, 0, 0]} castShadow />
      ))}
      <mesh material={mats.bracing} position={[x, H / 2 + 0.05, 0]}>
        <boxGeometry args={[0.012, 0.25, 0.25]} />
      </mesh>
    </group>
  );
}

function Purlins({ mats, onPick }: { mats: Mats; onPick: (id: PartId) => void }) {
  const geo = useMemo(() => iBeamGeometry(BAY + 0.4, PUR.h, PUR.b, PUR.tw, PUR.tf), []);
  const y = H + 0.05 + RAF.h - 0.1 + PUR.h / 2;
  return (
    <group onClick={(e) => { e.stopPropagation(); onPick("purlin"); }}>
      {[-2.8, -1.4, 0, 1.4, 2.8].map((x) => (
        <mesh key={x} geometry={geo} material={mats.purlin} position={[x, y, 0]} castShadow />
      ))}
    </group>
  );
}

export default function StructureScene({ selected, onSelect, resetKey }: { selected: PartId | null; onSelect: (id: PartId | null) => void; resetKey: number }) {
  const mats = useMaterials(selected);
  const controls = useRef<OrbitControlsImpl>(null);
  const anim = useRef<{ target: THREE.Vector3; cam: THREE.Vector3 } | null>(null);
  const HOME = useMemo(() => ({ target: new THREE.Vector3(0, 2, 0), cam: new THREE.Vector3(8.5, 5.5, 9.5) }), []);

  // fokus kamere na izbran del ali ponastavitev pogleda
  useEffect(() => {
    if (!selected) {
      anim.current = { target: HOME.target.clone(), cam: HOME.cam.clone() };
      return;
    }
    const part = PARTS.find((p) => p.id === selected)!;
    const target = new THREE.Vector3(...part.focus);
    const dir = new THREE.Vector3(...part.view).normalize();
    anim.current = { target, cam: target.clone().add(dir.multiplyScalar(part.distance)) };
  }, [selected, resetKey, HOME]);

  useFrame(({ camera }) => {
    const a = anim.current;
    const c = controls.current;
    if (!a || !c) return;
    c.target.lerp(a.target, 0.08);
    camera.position.lerp(a.cam, 0.08);
    c.update();
    if (camera.position.distanceTo(a.cam) < 0.02 && c.target.distanceTo(a.target) < 0.02) anim.current = null;
  });

  return (
    <>
      <color attach="background" args={["#070a10"]} />
      <fog attach="fog" args={["#070a10", 16, 34]} />
      <StudioEnvironment intensity={0.45} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[6, 10, 6]} intensity={1.2} color="#e8f1ff" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-8, 4, -6]} intensity={60} color="#087BFF" distance={20} />
      <pointLight position={[8, 2, -4]} intensity={30} color="#4aa3ff" distance={18} />

      <group onPointerMissed={() => onSelect(null)}>
        <Frame z={-BAY / 2} mats={mats} onPick={onSelect} />
        <Frame z={BAY / 2} mats={mats} onPick={onSelect} />
        <Bracing mats={mats} onPick={onSelect} />
        <Purlins mats={mats} onPick={onSelect} />

        {/* betonski temelji */}
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[(sx * SPAN) / 2, -0.2, (sz * BAY) / 2]} receiveShadow>
              <boxGeometry args={[0.8, 0.4, 0.8]} />
              <meshStandardMaterial color="#3a3f47" roughness={0.95} />
            </mesh>
          )),
        )}
      </group>

      <gridHelper args={[30, 30, "#0f3f80", "#121a28"]} position={[0, -0.399, 0]} />
      <ContactShadows position={[0, -0.39, 0]} opacity={0.55} scale={18} blur={2.4} far={6} resolution={512} />

      {/* oznake delov */}
      {PARTS.map((p, idx) => (
        <Html key={p.id} position={p.hotspot} center zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={() => onSelect(selected === p.id ? null : p.id)}
            aria-label={`${idx + 1}. ${p.name}`}
            aria-pressed={selected === p.id}
            className={`grid h-8 w-8 place-items-center rounded-full border font-display text-sm font-bold transition-all duration-300 ${
              selected === p.id
                ? "scale-110 border-white bg-volt text-white shadow-[0_0_24px_rgba(8,123,255,0.9)]"
                : "border-volt-2/70 bg-ink/80 text-volt-2 backdrop-blur hover:scale-110 hover:bg-volt hover:text-white"
            }`}
          >
            {idx + 1}
          </button>
        </Html>
      ))}

      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 2, 0]}
        onStart={() => { anim.current = null; }}
      />
    </>
  );
}
