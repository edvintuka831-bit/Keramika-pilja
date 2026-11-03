import * as THREE from "three";

/** Postopkovna tekstura brušene kovine (brez prenosa slik). */
let brushed: THREE.CanvasTexture | null = null;
export function brushedTexture(): THREE.CanvasTexture {
  if (brushed) return brushed;
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = "#8a8a8a";
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * size;
    const shade = 110 + Math.random() * 60;
    g.strokeStyle = `rgba(${shade},${shade},${shade},${0.08 + Math.random() * 0.18})`;
    g.lineWidth = Math.random() * 1.4;
    g.beginPath();
    const x = Math.random() * size;
    g.moveTo(x - 200, y);
    g.lineTo(x + 200 + Math.random() * 200, y + (Math.random() - 0.5) * 2);
    g.stroke();
  }
  // nekaj drobnih prask
  for (let i = 0; i < 90; i++) {
    g.strokeStyle = `rgba(200,200,200,${0.1 + Math.random() * 0.2})`;
    g.lineWidth = 0.6;
    g.beginPath();
    const x = Math.random() * size, y = Math.random() * size;
    g.moveTo(x, y);
    g.lineTo(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60);
    g.stroke();
  }
  brushed = new THREE.CanvasTexture(c);
  brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping;
  brushed.anisotropy = 4;
  return brushed;
}

/** Mehka okrogla točka za sij oblok in iskre. */
let glow: THREE.CanvasTexture | null = null;
export function glowTexture(): THREE.CanvasTexture {
  if (glow) return glow;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(200,225,255,0.9)");
  grad.addColorStop(0.45, "rgba(60,140,255,0.35)");
  grad.addColorStop(1, "rgba(8,123,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glow = new THREE.CanvasTexture(c);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
}

export function steelMaterial(opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  const tex = brushedTexture();
  return new THREE.MeshPhysicalMaterial({
    color: "#c3c9d1",
    metalness: 1,
    roughness: 0.32,
    roughnessMap: tex,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35,
    ...opts,
  });
}

export function voltMaterial(opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: "#0a6dff",
    metalness: 0.9,
    roughness: 0.26,
    roughnessMap: brushedTexture(),
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    ...opts,
  });
}
