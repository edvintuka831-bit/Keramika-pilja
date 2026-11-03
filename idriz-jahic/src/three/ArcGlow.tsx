import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { glowTexture } from "./materials";

/**
 * Varilni oblok: utripajoča točkovna luč in žareč sij,
 * jakost se nastavlja z referenco (0–1).
 */
export function ArcGlow({ position, strength, size = 1.4, light = 18 }: {
  position: THREE.Vector3;
  strength: React.RefObject<number>;
  size?: number;
  light?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const sprite = useRef<THREE.Sprite>(null);
  const core = useRef<THREE.Sprite>(null);
  const mat = useMemo(
    () => new THREE.SpriteMaterial({ map: glowTexture(), color: "#9fd0ff", blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }),
    [],
  );
  const coreMat = useMemo(
    () => new THREE.SpriteMaterial({ map: glowTexture(), color: "#ffffff", blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }),
    [],
  );

  useFrame(({ clock }) => {
    const s = strength.current ?? 0;
    const t = clock.elapsedTime;
    // nepravilno utripanje obloka
    const flicker = 0.65 + 0.35 * Math.sin(t * 61) * Math.sin(t * 23.7) + (Math.random() - 0.5) * 0.45;
    const k = Math.max(0, s * flicker);
    group.current?.position.copy(position);
    if (lightRef.current) lightRef.current.intensity = k * light;
    if (sprite.current) {
      sprite.current.scale.setScalar(size * (0.7 + k * 0.6));
      mat.opacity = Math.min(1, k);
    }
    if (core.current) {
      core.current.scale.setScalar(size * 0.28 * (0.8 + k * 0.4));
      coreMat.opacity = Math.min(1, k * 1.3);
    }
  });

  return (
    <group ref={group}>
      <pointLight ref={lightRef} color="#8ec4ff" distance={9} decay={1.6} />
      <sprite ref={sprite} material={mat} />
      <sprite ref={core} material={coreMat} />
    </group>
  );
}
