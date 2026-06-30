import * as THREE from "three";

export type RibbonPlacement = {
  id: string;
  textKey: "label" | "tagline";
  variant: "dark" | "light";
  /** Control points for a flowing 3D sweep (AE ribbon path). */
  points: [number, number, number][];
  width: number;
  segments: number;
  renderOrder: number;
  drift: number;
  textureRepeat: number;
  rotation: [number, number, number];
  position: [number, number, number];
};

export function ribbonCurveFromPoints(
  points: [number, number, number][],
): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "catmullrom",
    0.48,
  );
}

/** Two bold crossing bands — readable, off-center cross. */
export const RIBBON_PLACEMENTS: RibbonPlacement[] = [
  {
    id: "primary",
    textKey: "label",
    variant: "dark",
    width: 1.15,
    segments: 96,
    renderOrder: 2,
    drift: 1,
    textureRepeat: 1.8,
    rotation: [0.18, -0.38, -0.08],
    position: [-0.25, 0.05, 0.2],
    points: [
      [-4.2, 1.05, 1.85],
      [-2.2, 0.35, 2.45],
      [-0.15, -0.05, 2.05],
      [1.85, -0.35, 1.05],
      [3.65, -0.75, -0.35],
      [4.35, -1.05, -1.65],
    ],
  },
  {
    id: "secondary",
    textKey: "tagline",
    variant: "light",
    width: 1.05,
    segments: 96,
    renderOrder: 3,
    drift: -1,
    textureRepeat: 1.6,
    rotation: [-0.12, 0.42, 0.06],
    position: [0.35, -0.08, 0.35],
    points: [
      [4.1, 0.85, 1.55],
      [2.05, 0.22, 2.25],
      [0.05, -0.12, 1.75],
      [-1.95, -0.38, 0.95],
      [-3.55, -0.72, -0.15],
      [-4.25, -0.95, -1.45],
    ],
  },
];
