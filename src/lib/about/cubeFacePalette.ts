/** Cross-stitch thread + canvas background per cube face (simulated light from top-left). */
export type CubeFaceTone = {
  thread: [number, number, number];
  background: [number, number, number];
};

export type CubeFaceId = "top" | "right" | "left" | "back" | "bottom";

export const CUBE_FACE_PALETTE: Record<CubeFaceId, CubeFaceTone> = {
  top: {
    background: [246, 246, 246],
    thread: [214, 214, 214],
  },
  right: {
    background: [236, 236, 236],
    thread: [202, 202, 202],
  },
  left: {
    background: [228, 228, 228],
    thread: [192, 192, 192],
  },
  back: {
    background: [218, 218, 218],
    thread: [178, 178, 178],
  },
  bottom: {
    background: [208, 208, 208],
    thread: [164, 164, 164],
  },
};

/** CSS rgb() string for a cube face's flat fill colour. */
export function cubeFaceColor(id: CubeFaceId): string {
  const [r, g, b] = CUBE_FACE_PALETTE[id].background;
  return `rgb(${r},${g},${b})`;
}
