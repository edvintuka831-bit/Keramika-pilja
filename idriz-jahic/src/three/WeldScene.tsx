import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { glowTexture, steelMaterial } from "./materials";
import { StudioEnvironment } from "./Environment";
import { Sparks } from "./Sparks";
import { ArcGlow } from "./ArcGlow";
import { iBeamGeometry } from "./profiles";

const SEAM_START = -1.75;
const SEAM_END = 1.75;
const SPEED = 0.24; // m/s v sceni
const STEP = 0.016; // razmik med "luskami" zvara
const BEADS = Math.ceil((SEAM_END - SEAM_START) / STEP) + 2;
const PLATE_T = 0.12;

const COOL = new THREE.Color(0.42, 0.44, 0.48);
const HOT = new THREE.Color(5.0, 2.0, 0.55);
const WARM = new THREE.Color(1.4, 0.45, 0.15);

/** Zvar: zaporedje sploščenih "lusk", ki se ohlajajo iz rumeno-oranžne v jekleno sivo. */
function WeldBead({ progress }: { progress: React.RefObject<number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const born = useMemo(() => new Float32Array(BEADS).fill(-1), []);
  const placed = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 14, 10), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.55, roughness: 0.38 }), []);

  useEffect(() => {
    const m = ref.current!;
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = 0; i < BEADS; i++) {
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, COOL);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const now = clock.elapsedTime;
    const p = progress.current ?? 0;
    const x = SEAM_START + p * (SEAM_END - SEAM_START);
    const target = Math.max(0, Math.floor((x - SEAM_START) / STEP));

    if (target < placed.current) {
      // nov prehod: počisti zvar
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      for (let i = 0; i < BEADS; i++) { m.setMatrixAt(i, dummy.matrix); born[i] = -1; }
      placed.current = 0;
      m.instanceMatrix.needsUpdate = true;
    }
    while (placed.current < Math.min(target, BEADS)) {
      const i = placed.current++;
      dummy.position.set(SEAM_START + i * STEP, PLATE_T / 2 + 0.008, (Math.random() - 0.5) * 0.004);
      dummy.rotation.set(0, (Math.random() - 0.5) * 0.25, 0);
      const w = 0.052 + Math.random() * 0.006;
      dummy.scale.set(0.03, 0.022 + Math.random() * 0.003, w);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      born[i] = now;
      m.instanceMatrix.needsUpdate = true;
    }
    // ohlajanje: barva glede na starost luske
    let dirty = false;
    for (let i = Math.max(0, placed.current - 140); i < placed.current; i++) {
      const age = now - born[i];
      if (age < 0) continue;
      if (age < 0.6) color.copy(HOT).lerp(WARM, age / 0.6);
      else if (age < 4) color.copy(WARM).lerp(COOL, (age - 0.6) / 3.4);
      else color.copy(COOL);
      m.setColorAt(i, color);
      dirty = true;
    }
    if (dirty && m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, BEADS]} frustumCulled={false} />;
}

/** Varilni gorilnik MIG/MAG (šoba, kontaktna konica, ročaj). */
function Torch() {
  const copper = useMemo(() => new THREE.MeshStandardMaterial({ color: "#b87333", metalness: 1, roughness: 0.35 }), []);
  const nozzle = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9aa1aa", metalness: 1, roughness: 0.25 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#14171c", metalness: 0.2, roughness: 0.6 }), []);
  const blue = useMemo(() => new THREE.MeshStandardMaterial({ color: "#087BFF", metalness: 0.4, roughness: 0.4, emissive: "#0a3a80", emissiveIntensity: 0.4 }), []);
  return (
    <group>
      {/* kontaktna konica */}
      <mesh material={copper} position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 12]} />
      </mesh>
      {/* šoba */}
      <mesh material={nozzle} position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.036, 0.2, 28, 1, true]} />
      </mesh>
      <mesh material={nozzle} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.052, 0.05, 0.02, 28]} />
      </mesh>
      {/* vrat */}
      <mesh material={nozzle} position={[0, 0.42, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.026, 0.22, 16]} />
      </mesh>
      {/* ročaj */}
      <mesh material={dark} position={[0.02, 0.78, 0]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.055, 0.045, 0.5, 20]} />
      </mesh>
      <mesh material={blue} position={[0.035, 0.62, 0]} rotation={[0, 0, -0.08]}>
        <torusGeometry args={[0.052, 0.008, 8, 24]} />
      </mesh>
      {/* kabel */}
      <mesh material={dark} position={[0.08, 1.4, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
      </mesh>
    </group>
  );
}

/** Lebdeči žareči delci v zraku. */
function Embers({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 5 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
      const blue = Math.random() > 0.35;
      col.set(blue ? [0.1, 0.45, 1] : [1, 0.5, 0.15], i * 3);
      speeds[i] = 0.05 + Math.random() * 0.18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { geo, speeds };
  }, [count]);
  const mat = useMemo(
    () => new THREE.PointsMaterial({ size: 0.05, map: glowTexture(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, opacity: 0.8 }),
    [],
  );
  useFrame((_, dt) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * dt;
      if (y > 4) y = -1;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(y * 2 + i) * 0.002);
    }
    pos.needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

export default function WeldScene() {
  const { size, camera } = useThree();
  const portrait = size.width / size.height < 0.9;

  // Prizor premaknemo v prosti del zaslona: desno od besedila (namizje) oziroma nad njim (mobilno).
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width, h = size.height;
    if (portrait) cam.setViewOffset(w, h, 0, h * 0.16, w, h);
    else cam.setViewOffset(w, h, -w * 0.2, h * 0.02, w, h);
    cam.updateProjectionMatrix();
    return () => { cam.clearViewOffset(); };
  }, [camera, size.width, size.height, portrait]);
  const plate = useMemo(() => steelMaterial({ color: "#9aa2ad", roughness: 0.42, clearcoat: 0 }), []);
  const beamMat = useMemo(() => steelMaterial({ color: "#59616d", roughness: 0.5, clearcoat: 0 }), []);
  const benchMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0b0e13", metalness: 0.6, roughness: 0.55 }), []);
  const column = useMemo(() => iBeamGeometry(7, 0.36, 0.3, 0.02, 0.034), []);
  const girder = useMemo(() => iBeamGeometry(12, 0.5, 0.26, 0.022, 0.034), []);
  const benchBeam = useMemo(() => iBeamGeometry(6, 0.3, 0.18, 0.012, 0.02), []);

  const torch = useRef<THREE.Group>(null);
  const tip = useMemo(() => new THREE.Vector3(SEAM_START, PLATE_T / 2 + 0.02, 0), []);
  const progress = useRef(0);
  const rate = useRef(0);
  const arc = useRef(0);
  const mouse = useRef(new THREE.Vector2());
  const phase = useRef({ t: 0, pause: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, clock }, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const ph = phase.current;
    if (ph.pause > 0) {
      ph.pause -= dt;
      rate.current = 0;
      arc.current = 0;
      if (ph.pause <= 0) { ph.t = 0; progress.current = 0; }
    } else {
      ph.t += dt;
      progress.current = Math.min(1, (ph.t * SPEED) / (SEAM_END - SEAM_START));
      // oblok ne gori povsem enakomerno
      arc.current = 0.85 + Math.random() * 0.15;
      rate.current = 520 + Math.random() * 260;
      if (progress.current >= 1) ph.pause = 1.6;
    }

    const x = SEAM_START + progress.current * (SEAM_END - SEAM_START);
    tip.set(x, PLATE_T / 2 + 0.03, 0);
    if (torch.current) {
      // gorilnik nagnjen v smeri varjenja, z rahlim tresljajem roke
      const wob = Math.sin(clock.elapsedTime * 9) * 0.003;
      torch.current.position.set(x + 0.006, PLATE_T / 2 + 0.035 + wob, wob);
      torch.current.rotation.set(0.12, 0, 0.32);
    }

    // kamera: rahla paralaksa z miško
    const base = portrait ? new THREE.Vector3(5.4, 3.8, 4.6) : new THREE.Vector3(2.5, 1.9, 4.3);
    const tx = base.x + mouse.current.x * 0.35;
    const ty = base.y - mouse.current.y * 0.2;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.position.z += (base.z - camera.position.z) * 0.04;
    camera.lookAt(portrait ? -0.7 : 0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#05070B"]} />
      <fog attach="fog" args={["#05070B", 4.5, 13]} />
      <StudioEnvironment intensity={0.28} />
      <ambientLight intensity={0.06} />
      <directionalLight position={[-3, 4, 2]} intensity={0.35} color="#9cc8ff" />
      <pointLight position={[-4, 2.5, -3]} intensity={40} color="#087BFF" distance={14} />
      <pointLight position={[4, 1.5, -2.5]} intensity={22} color="#2b6fff" distance={12} />
      <spotLight position={[0, 5, 1]} angle={0.5} penumbra={0.8} intensity={14} color="#cfe3ff" distance={10} />

      {/* jekleni pločevini z režo za zvar */}
      <mesh material={plate} position={[0, 0, -0.62]}>
        <boxGeometry args={[4.2, PLATE_T, 1.2]} />
      </mesh>
      <mesh material={plate} position={[0, 0, 0.62]}>
        <boxGeometry args={[4.2, PLATE_T, 1.2]} />
      </mesh>
      <WeldBead progress={progress} />

      {/* delovna miza */}
      <mesh material={benchMat} position={[0, -PLATE_T / 2 - 0.08, 0]}>
        <boxGeometry args={[6, 0.16, 3.4]} />
      </mesh>
      <mesh geometry={benchBeam} material={beamMat} position={[0, -0.32, 1.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* jeklena konstrukcija v ozadju */}
      {[-4.5, -1.5, 1.5, 4.5].map((x) => (
        <mesh key={x} geometry={column} material={beamMat} position={[x, 2, -4]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
      <mesh geometry={girder} material={beamMat} position={[0, 4.2, -4]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={girder} material={beamMat} position={[0, 2.6, -4.1]} rotation={[0, Math.PI / 2, 0]} scale={[1, 0.7, 1]} />

      <group ref={torch}>
        <Torch />
      </group>
      <Sparks origin={tip} rate={rate} direction={new THREE.Vector3(-0.4, 0.8, 0.5)} spread={1.4} speed={3} gravity={8} max={700} />
      <ArcGlow position={tip} strength={arc} size={0.8} light={10} />
      <Embers />
    </>
  );
}
