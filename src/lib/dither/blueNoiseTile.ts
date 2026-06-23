/** 128×128 blue-noise-like threshold tile (Heckel: `gl_FragCoord.xy / 128.0`). */
export const BLUE_NOISE_TILE_SIZE = 128;

const TILE = BLUE_NOISE_TILE_SIZE;

const blueNoiseTile: Float32Array = (() => {
  const data = new Float32Array(TILE * TILE);
  for (let y = 0; y < TILE; y += 1) {
    for (let x = 0; x < TILE; x += 1) {
      const v = x * 0.06711056 + y * 0.00583715;
      const f = v - Math.floor(v);
      const gradient = (f * 52.9829189) % 1;
      const s =
        Math.sin(x * 12.9898 + y * 78.233 + 91.173) * 43758.5453;
      const hash = s - Math.floor(s);
      data[y * TILE + x] = gradient * 0.44 + hash * 0.56;
    }
  }
  return data;
})();

export function sampleBlueNoiseTile(x: number, y: number): number {
  const tx = ((Math.floor(x) % TILE) + TILE) % TILE;
  const ty = ((Math.floor(y) % TILE) + TILE) % TILE;
  return blueNoiseTile[ty * TILE + tx] ?? 0.5;
}
