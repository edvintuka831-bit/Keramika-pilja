import { Canvas } from "@react-three/fiber";
import WeldScene from "./WeldScene";

export default function HeroCanvas({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, position: [2.4, 1.45, 3.3], near: 0.05, far: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <WeldScene />
    </Canvas>
  );
}
