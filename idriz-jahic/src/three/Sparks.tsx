import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  /** Izvor isker (spremenljiv objekt, da se lahko premika brez ponovnega renderja). */
  origin: THREE.Vector3;
  /** Število novih isker na sekundo (0 = ustavljeno). */
  rate: React.RefObject<number>;
  max?: number;
  gravity?: number;
  speed?: number;
  /** Smer glavnega curka isker. */
  direction?: THREE.Vector3;
  spread?: number;
};

/**
 * Varilne iskre kot kratke žareče sledi (LineSegments z aditivnim mešanjem).
 * Barva se s časom spreminja iz belo-modre v oranžno in ugasne.
 */
export function Sparks({ origin, rate, max = 600, gravity = 9.8, speed = 3.2, direction = new THREE.Vector3(0, 1, 0.4), spread = 1.1 }: Props) {
  const ref = useRef<THREE.LineSegments>(null);
  const state = useMemo(() => {
    const pos = new Float32Array(max * 6);
    const col = new Float32Array(max * 6);
    const vel = new Float32Array(max * 3);
    const life = new Float32Array(max);
    const ttl = new Float32Array(max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);
    return { pos, col, vel, life, ttl, geo, cursor: 0, carry: 0 };
  }, [max]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => direction.clone().normalize(), [direction]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const s = state;
    // nove iskre
    s.carry += (rate.current ?? 0) * dt;
    while (s.carry >= 1) {
      s.carry -= 1;
      const i = s.cursor;
      s.cursor = (s.cursor + 1) % max;
      tmp.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2).multiplyScalar(spread).add(dir).normalize();
      const v = speed * (0.35 + Math.random() * 0.9);
      s.vel[i * 3] = tmp.x * v;
      s.vel[i * 3 + 1] = tmp.y * v;
      s.vel[i * 3 + 2] = tmp.z * v;
      s.pos[i * 6] = s.pos[i * 6 + 3] = origin.x;
      s.pos[i * 6 + 1] = s.pos[i * 6 + 4] = origin.y;
      s.pos[i * 6 + 2] = s.pos[i * 6 + 5] = origin.z;
      s.ttl[i] = 0.25 + Math.random() * 0.75;
      s.life[i] = s.ttl[i];
    }
    // posodobitev
    for (let i = 0; i < max; i++) {
      if (s.life[i] <= 0) {
        s.col.fill(0, i * 6, i * 6 + 6);
        continue;
      }
      s.life[i] -= dt;
      s.vel[i * 3 + 1] -= gravity * dt;
      const vx = s.vel[i * 3], vy = s.vel[i * 3 + 1], vz = s.vel[i * 3 + 2];
      const hx = s.pos[i * 6] + vx * dt, hy = s.pos[i * 6 + 1] + vy * dt, hz = s.pos[i * 6 + 2] + vz * dt;
      // rep sledi je za glavo v smeri hitrosti
      const tail = 0.022;
      s.pos[i * 6] = hx; s.pos[i * 6 + 1] = hy; s.pos[i * 6 + 2] = hz;
      s.pos[i * 6 + 3] = hx - vx * tail; s.pos[i * 6 + 4] = hy - vy * tail; s.pos[i * 6 + 5] = hz - vz * tail;
      const t = Math.max(s.life[i] / s.ttl[i], 0); // 1 → 0
      // vroče belo → oranžno → temno
      const r = Math.min(1, 0.6 + t * 1.2) * t * 1.6;
      const g = (0.25 + t * 0.85) * t * 1.4;
      const b = t * t * 1.5;
      s.col[i * 6] = r; s.col[i * 6 + 1] = g; s.col[i * 6 + 2] = b;
      s.col[i * 6 + 3] = r * 0.25; s.col[i * 6 + 4] = g * 0.2; s.col[i * 6 + 5] = b * 0.1;
    }
    s.geo.attributes.position.needsUpdate = true;
    s.geo.attributes.color.needsUpdate = true;
  });

  return <lineSegments ref={ref} geometry={state.geo} material={material} frustumCulled={false} />;
}
