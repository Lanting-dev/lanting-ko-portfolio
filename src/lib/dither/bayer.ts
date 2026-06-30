/** 8×8 Bayer matrix for ordered dither , retro print / CRT feel */
export const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
] as const;

export function bayerThreshold(x: number, y: number): number {
  return BAYER_8[y & 7][x & 7] / 64;
}

export function ditherChannel(value: number, x: number, y: number, levels: number): number {
  const normalized = value / 255;
  const threshold = bayerThreshold(x, y);
  const quantized = Math.floor(normalized * levels + threshold) / levels;
  return Math.round(Math.min(1, quantized) * 255);
}

export function shuffleIndices(count: number, seed = 0): number[] {
  const indices = Array.from({ length: count }, (_, i) => i);
  let state = seed || 0x6d2b79f5;

  const random = () => {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };

  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
