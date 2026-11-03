import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { createMonogram, WELD_POINT } from "../three/monogram";
import { steelMaterial, voltMaterial } from "../three/materials";
import { StudioEnvironment } from "../three/Environment";
import { Sparks } from "../three/Sparks";
import { ArcGlow } from "../three/ArcGlow";

const ease = (t: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
const window01 = (t: number, a: number, b: number) => THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);

/** Časovnica intra v sekundah. */
const T = { lights: 0.2, reveal: 0.4, sweepStart: 1.3, sweepEnd: 2.5, weldStart: 2.2, weldEnd: 3.4, title: 2.7, exit: 4.2, done: 4.9 };

function IntroScene({ start }: { start: number }) {
  const { i, j } = useMemo(createMonogram, []);
  const matI = useMemo(() => steelMaterial(), []);
  const matJ = useMemo(() => voltMaterial(), []);
  const group = useRef<THREE.Group>(null);
  const rimL = useRef<THREE.PointLight>(null);
  const rimR = useRef<THREE.PointLight>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#087BFF", transparent: true, opacity: 0, toneMapped: false }), []);
  const rate = useRef(0);
  const arc = useRef(0);
  const weldOrigin = useMemo(() => WELD_POINT.clone(), []);

  useFrame(({ camera, scene }) => {
    const t = (performance.now() - start) / 1000;
    const reveal = ease(window01(t, T.reveal, 2.4));

    // kamera se približa logotipu
    const dolly = ease(window01(t, 0, 3.6));
    const far = camera instanceof THREE.PerspectiveCamera && camera.aspect < 0.8 ? 1.9 : 1; // na pokončnem zaslonu dlje
    camera.position.set(Math.sin(t * 0.4) * 0.4 * (1 - dolly) + 0.15 * dolly, 0.5 - 0.3 * dolly, (15 - 5.5 * dolly) * far);
    camera.lookAt(0, -0.45 * far, 0);

    if (group.current) {
      group.current.rotation.y = -0.75 * (1 - reveal) + Math.sin(t * 0.6) * 0.03;
      group.current.rotation.x = 0.12 * (1 - reveal);
      group.current.position.y = -0.5 * (1 - reveal);
    }
    scene.environmentIntensity = 0.55 * ease(window01(t, T.reveal, 2));

    const lights = ease(window01(t, T.lights, 1.4));
    if (rimL.current) rimL.current.intensity = 26 * lights;
    if (rimR.current) rimR.current.intensity = 18 * lights;

    // modri odsev, ki preleti kovino
    const sw = window01(t, T.sweepStart, T.sweepEnd);
    if (sweep.current) {
      sweep.current.position.set(-3.2 + sw * 6.4, 1.2 - sw * 1.4, 1.5);
      sweep.current.intensity = Math.sin(sw * Math.PI) * 55;
    }

    if (ring.current) {
      const r = ease(window01(t, 0.6, 2.2));
      ring.current.scale.setScalar(0.6 + r * 0.4);
      ring.current.rotation.z = t * 0.15;
      ringMat.opacity = r * 0.85;
    }

    // kratek efekt varjenja
    const welding = t > T.weldStart && t < T.weldEnd;
    rate.current = welding ? 900 : 0;
    arc.current = welding ? 1 : Math.max(0, arc.current - 0.08);
  });

  return (
    <>
      <color attach="background" args={["#05070B"]} />
      <StudioEnvironment intensity={0} />
      <ambientLight intensity={0.05} />
      <pointLight ref={rimL} position={[-3, 1.5, -1.5]} color="#087BFF" distance={12} />
      <pointLight ref={rimR} position={[3.2, -1, -1]} color="#4aa3ff" distance={12} />
      <pointLight ref={sweep} color="#cfe6ff" distance={7} decay={1.4} />
      <group ref={group}>
        <mesh geometry={i} material={matI} />
        <mesh geometry={j} material={matJ} />
      </group>
      <mesh ref={ring} position={[0.1, 0, -0.9]} material={ringMat}>
        <torusGeometry args={[2.05, 0.018, 8, 160]} />
      </mesh>
      <Sparks origin={weldOrigin} rate={rate} direction={new THREE.Vector3(0.3, 0.9, 0.6)} speed={3.6} gravity={7} />
      <ArcGlow position={weldOrigin} strength={arc} size={1.1} light={14} />
    </>
  );
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const [start] = useState(() => performance.now());
  const [showTitle, setShowTitle] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), T.title * 1000);
    const t2 = setTimeout(() => setLeaving(true), T.exit * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => doneRef.current(), 650);
    return () => clearTimeout(t);
  }, [leaving]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLeaving(true); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-label="Uvodna animacija"
    >
      <Canvas dpr={[1, 1.75]} camera={{ fov: 32, position: [0, 0.5, 15] }} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <IntroScene start={start} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-[12%] flex flex-col items-center px-4 text-center sm:bottom-[14%]">
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{ opacity: 0, y: 24, letterSpacing: "0.3em", filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.02em", filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-[clamp(2.6rem,9vw,6rem)] font-bold italic uppercase leading-none">
                <span className="text-metal">Idriz Jahić</span>{" "}
                <span className="text-volt-glow text-[0.45em] not-italic">S.P.</span>
              </p>
              <motion.p
                className="mt-3 font-display text-[clamp(0.85rem,2.4vw,1.25rem)] font-semibold uppercase italic tracking-[0.35em] text-volt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                Varjenje in druge storitve
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setLeaving(true)}
        className="absolute right-4 top-4 font-display text-sm font-semibold uppercase tracking-[0.25em] text-steel-2 transition-colors hover:text-white sm:right-8 sm:top-8"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        Preskoči →
      </button>
    </motion.div>
  );
}
