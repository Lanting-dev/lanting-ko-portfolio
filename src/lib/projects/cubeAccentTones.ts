import type { CubeFaceId, CubeFaceTone } from "@/lib/about/cubeFacePalette";

type RGB = [number, number, number];

const WHITE: RGB = [255, 255, 255];
const SHADOW: RGB = [22, 22, 22];

/** How much each face background is washed toward white (light from top-left). */
const FACE_BG_WHITE: Record<CubeFaceId, number> = {
  top: 0.82,
  right: 0.72,
  left: 0.62,
  back: 0.52,
  bottom: 0.42,
};

/** How much each face thread is deepened toward shadow. */
const FACE_THREAD_SHADOW: Record<CubeFaceId, number> = {
  top: 0.1,
  right: 0.2,
  left: 0.3,
  back: 0.4,
  bottom: 0.5,
};

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function mix(color: RGB, target: RGB, t: number): RGB {
  return [
    mixChannel(color[0], target[0], t),
    mixChannel(color[1], target[1], t),
    mixChannel(color[2], target[2], t),
  ];
}

/** Build per-face cross-stitch tones tinted with a project's accent colour. */
export function cubeAccentTones(
  accentHex: string,
): Record<CubeFaceId, CubeFaceTone> {
  const accent = hexToRgb(accentHex);
  const faces: CubeFaceId[] = ["top", "right", "left", "back", "bottom"];
  const tones = {} as Record<CubeFaceId, CubeFaceTone>;

  for (const face of faces) {
    tones[face] = {
      background: mix(accent, WHITE, FACE_BG_WHITE[face]),
      thread: mix(accent, SHADOW, FACE_THREAD_SHADOW[face]),
    };
  }

  return tones;
}
