import { clamp } from "./bayer";
import { sampleBlueNoiseTile } from "./blueNoiseTile";
import { heckelWhiteNoiseThreshold } from "./heckelDither";

export type BlockScale = {
  blockPx: number;
  lag: number;
  spread: number;
};

export const DITHER_MACRO_SCALE: BlockScale = {
  blockPx: 28,
  lag: 0,
  spread: 0.16,
};

export const DITHER_MESO_SCALE: BlockScale = {
  blockPx: 8,
  lag: 0.1,
  spread: 0.13,
};

export function blockCoords(
  px: number,
  py: number,
  blockPx: number,
): { bx: number; by: number } {
  const size = Math.max(1, blockPx);
  return { bx: Math.floor(px / size), by: Math.floor(py / size) };
}

export function blockRevealGate(
  bx: number,
  by: number,
  seed: number,
  reveal: number,
  scale: BlockScale,
): number {
  const order = sampleBlueNoiseTile(
    bx * 1.37 + seed * 0.19,
    by * 1.91 + seed * 0.23,
  );
  const phase = clamp((reveal - scale.lag) / (1 - scale.lag + 0.001), 0, 1);
  return clamp((phase - order * 0.91) / scale.spread, 0, 1);
}

export function multiScaleRevealMask(
  px: number,
  py: number,
  seed: number,
  reveal: number,
  fineGate: number,
  macro: BlockScale,
  meso: BlockScale,
): number {
  const macroC = blockCoords(px, py, macro.blockPx);
  const mesoC = blockCoords(px, py, meso.blockPx);
  const macroG = blockRevealGate(macroC.bx, macroC.by, seed, reveal, macro);
  const mesoG = blockRevealGate(mesoC.bx, mesoC.by, seed + 41, reveal, meso);
  return macroG * mesoG * fineGate;
}

export function blockSnapStrength(mesoGate: number, macroGate: number): number {
  return clamp(1 - Math.min(macroGate, mesoGate), 0, 1);
}

export function buildBlockLumGrid(
  fineLum: Float32Array,
  gridW: number,
  gridH: number,
  blockPx: number,
  pixelSize: number,
): { grid: Float32Array; blockW: number; blockH: number } {
  const cells = Math.max(1, Math.round(blockPx / pixelSize));
  const blockW = Math.ceil(gridW / cells);
  const blockH = Math.ceil(gridH / cells);
  const grid = new Float32Array(blockW * blockH);

  for (let by = 0; by < blockH; by += 1) {
    for (let bx = 0; bx < blockW; bx += 1) {
      let sum = 0;
      let count = 0;
      const x0 = bx * cells;
      const y0 = by * cells;
      const x1 = Math.min(gridW, x0 + cells);
      const y1 = Math.min(gridH, y0 + cells);

      for (let gy = y0; gy < y1; gy += 1) {
        for (let gx = x0; gx < x1; gx += 1) {
          sum += fineLum[gy * gridW + gx] ?? 0;
          count += 1;
        }
      }

      grid[by * blockW + bx] = count > 0 ? sum / count : 0;
    }
  }

  return { grid, blockW, blockH };
}

export function sampleBlockLum(
  blockGrid: Float32Array,
  blockW: number,
  px: number,
  py: number,
  blockPx: number,
): number {
  const { bx, by } = blockCoords(px, py, blockPx);
  const blockH = blockGrid.length / blockW;
  if (bx < 0 || by < 0 || bx >= blockW || by >= blockH) return 0;
  return blockGrid[by * blockW + bx] ?? 0;
}
