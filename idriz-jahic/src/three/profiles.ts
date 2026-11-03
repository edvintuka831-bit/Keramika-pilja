import * as THREE from "three";

/** Prerez I/H profila (h = višina, b = širina pasnice, tw = stojina, tf = pasnica). */
export function iProfileShape(h: number, b: number, tw: number, tf: number) {
  const s = new THREE.Shape();
  const hh = h / 2, hb = b / 2, ht = tw / 2;
  s.moveTo(-hb, -hh);
  s.lineTo(hb, -hh);
  s.lineTo(hb, -hh + tf);
  s.lineTo(ht, -hh + tf);
  s.lineTo(ht, hh - tf);
  s.lineTo(hb, hh - tf);
  s.lineTo(hb, hh);
  s.lineTo(-hb, hh);
  s.lineTo(-hb, hh - tf);
  s.lineTo(-ht, hh - tf);
  s.lineTo(-ht, -hh + tf);
  s.lineTo(-hb, -hh + tf);
  s.closePath();
  return s;
}

/** Jekleni profil dolžine `length` vzdolž osi Z, centriran. */
export function iBeamGeometry(length: number, h: number, b: number, tw: number, tf: number) {
  const geo = new THREE.ExtrudeGeometry(iProfileShape(h, b, tw, tf), {
    depth: length,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 1,
  });
  geo.translate(0, 0, -length / 2);
  return geo;
}

/** Kvadratna cev (votli profil). */
export function boxTubeGeometry(length: number, a: number, t: number) {
  const outer = new THREE.Shape();
  outer.moveTo(-a / 2, -a / 2);
  outer.lineTo(a / 2, -a / 2);
  outer.lineTo(a / 2, a / 2);
  outer.lineTo(-a / 2, a / 2);
  outer.closePath();
  const hole = new THREE.Path();
  const i = a / 2 - t;
  hole.moveTo(-i, -i);
  hole.lineTo(-i, i);
  hole.lineTo(i, i);
  hole.lineTo(i, -i);
  hole.closePath();
  outer.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(outer, { depth: length, bevelEnabled: false });
  geo.translate(0, 0, -length / 2);
  return geo;
}
