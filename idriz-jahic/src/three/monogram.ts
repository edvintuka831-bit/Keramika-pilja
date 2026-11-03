import * as THREE from "three";

/*
 * IJ monogram po vzoru logotipa: poševni črki s koničastimi serifi.
 * Koordinate so v enotah 0–100 (višina črke), enake kot v favicon.svg.
 */

function letterI() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(44, 0);
  s.lineTo(44, 4);
  s.lineTo(32, 14);
  s.lineTo(32, 86);
  s.lineTo(44, 96);
  s.lineTo(44, 100);
  s.lineTo(0, 100);
  s.lineTo(0, 96);
  s.lineTo(12, 86);
  s.lineTo(12, 14);
  s.lineTo(0, 4);
  s.closePath();
  return s;
}

function letterJ() {
  const s = new THREE.Shape();
  s.moveTo(50, 100);
  s.lineTo(104, 100);
  s.lineTo(104, 96);
  s.lineTo(88, 86);
  s.lineTo(88, 30);
  s.quadraticCurveTo(88, 0, 62, 0);
  s.quadraticCurveTo(42, 0, 40, 18);
  s.lineTo(39, 32);
  s.lineTo(52, 40);
  s.lineTo(54, 26);
  s.quadraticCurveTo(56, 16, 64, 16);
  s.quadraticCurveTo(68, 16, 68, 26);
  s.lineTo(68, 86);
  s.lineTo(52, 96);
  s.lineTo(50, 96);
  s.closePath();
  return s;
}

const SLANT = Math.tan(THREE.MathUtils.degToRad(12));
const SCALE = 0.026;

function build(shape: THREE.Shape) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 3,
    bevelSize: 2.2,
    bevelSegments: 4,
    curveSegments: 24,
  });
  // poševnost (italic) kot na logotipu
  const shear = new THREE.Matrix4().set(1, SLANT, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  geo.applyMatrix4(shear);
  // središče monograma: širina ~ 0..125 po poševnini, višina 0..100
  geo.translate(-62, -50, -8);
  geo.scale(SCALE, SCALE, SCALE);
  geo.computeVertexNormals();
  return geo;
}

export function createMonogram() {
  return { i: build(letterI()), j: build(letterJ()) };
}

/** Točka na spodnjem robu zavoja črke J (za efekt varjenja), v enotah scene. */
export const WELD_POINT = new THREE.Vector3((55 + SLANT - 62) * SCALE, (1 - 50) * SCALE, 0.3);
