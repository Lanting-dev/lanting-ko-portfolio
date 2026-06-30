import * as THREE from "three";

/** Closed 3D loop — thick single band wrapping through space (PANTER / AE). */
export function createPanterLoopCurve(mobile = false): THREE.CatmullRomCurve3 {
  const count = mobile ? 48 : 64;
  const scale = mobile ? 0.82 : 1;
  const rx = 3.55 * scale;
  const ry = 1.18 * scale;
  const tiltX = 0.95;
  const tiltY = -0.28;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < count; i += 1) {
    const theta = (i / count) * Math.PI * 2;
    let x = Math.cos(theta + 0.22) * rx;
    let y = Math.sin(theta) * ry + Math.sin(theta * 3) * 0.16 * scale;
    let z = Math.sin(theta + 0.22) * (ry * 0.52) + Math.cos(theta * 2) * 0.38 * scale;

    const cy = y * Math.cos(tiltX) - z * Math.sin(tiltX);
    const cz = y * Math.sin(tiltX) + z * Math.cos(tiltX);
    y = cy - 0.38 * scale;
    z = cz;

    const cx = x * Math.cos(tiltY) + z * Math.sin(tiltY);
    const cz2 = -x * Math.sin(tiltY) + z * Math.cos(tiltY);

    points.push(new THREE.Vector3(cx, y, cz2));
  }

  return new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.4);
}

export const PANTER_LOOP_WIDTH = {
  desktop: 2.35,
  mobile: 1.65,
} as const;

export const PANTER_LOOP_SEGMENTS = {
  desktop: 168,
  mobile: 128,
} as const;
