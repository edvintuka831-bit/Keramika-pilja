import { Canvas } from "@react-three/fiber";
import StructureScene from "./StructureScene";
import type { PartId } from "../data/structureParts";

type Props = { active: boolean; selected: PartId | null; onSelect: (id: PartId | null) => void; resetKey: number };

export default function StructureCanvas({ active, ...scene }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 40, position: [8.5, 5.5, 9.5], near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <StructureScene {...scene} />
    </Canvas>
  );
}
