import { clamp } from "./bayer";
import { blockCoords, blockRevealGate, type BlockScale } from "./blockReveal";
import {
  CROSS_HALFTONE_ARM_WIDTH,
  CROSS_HALFTONE_CELL,
} from "./constants";
import { heckelLuminance } from "./heckelDither";
import { canvasToLocal, sampleSourceRgb } from "./imageSample";

export type CrossHalftoneConfig = {
  width: number;
  height: number;
  source: ImageData;
  offsetX?: number;
  offsetY?: number;
  drawWidth?: number;
  drawHeight?: number;
  cellSize?: number;
  armWidth?: number;
  /** 0 = full cross halftone, 1 = sharp source */
  reveal?: number;
  blockReveal?: boolean;
  blockRevealSeed?: number;
  macroScale?: BlockScale;
  mesoScale?: BlockScale;
  backgroundRgb?: [number, number, number];
  inkBlack?: boolean;
};

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function isOnCross(
  localX: number,
  localY: number,
  armLen: number,
  armWidth: number,
): boolean {
  if (armLen <= 0) return false;
  const ax = Math.abs(localX);
  const ay = Math.abs(localY);
  return (ax <= armLen && ay <= armWidth) || (ay <= armLen && ax <= armWidth);
}

function pixelRevealMix(
  px: number,
  py: number,
  rawReveal: number,
  easedReveal: number,
  useBlockReveal: boolean,
  blockRevealSeed: number,
  macroScale: BlockScale | undefined,
  mesoScale: BlockScale | undefined,
): number {
  if (!useBlockReveal || !macroScale) return easedReveal;

  const macroC = blockCoords(px, py, macroScale.blockPx);
  let gate = blockRevealGate(
    macroC.bx,
    macroC.by,
    blockRevealSeed,
    rawReveal,
    macroScale,
  );

  if (mesoScale) {
    const mesoC = blockCoords(px, py, mesoScale.blockPx);
    gate *= blockRevealGate(
      mesoC.bx,
      mesoC.by,
      blockRevealSeed + 41,
      rawReveal,
      mesoScale,
    );
  }

  return smoothstep(gate);
}

/**
 * Cross (+) halftone , cell-center darkness drives arm length (stable +/star shape).
 */
export function renderCrossHalftone(
  ctx: CanvasRenderingContext2D,
  config: CrossHalftoneConfig,
): void {
  const {
    width,
    height,
    source,
    offsetX = 0,
    offsetY = 0,
    drawWidth = width,
    drawHeight = height,
    cellSize = CROSS_HALFTONE_CELL,
    armWidth = CROSS_HALFTONE_ARM_WIDTH,
    reveal = 0,
    blockReveal = false,
    blockRevealSeed = 0,
    macroScale,
    mesoScale,
    backgroundRgb = [255, 255, 255],
    inkBlack = true,
  } = config;

  if (width <= 0 || height <= 0) return;

  const out = ctx.createImageData(width, height);
  const dst = out.data;
  const [bgR, bgG, bgB] = backgroundRgb;
  const src = source.data;
  const srcW = source.width;
  const srcH = source.height;
  const rawReveal = clamp(reveal, 0, 1);
  const easedReveal = smoothstep(rawReveal);
  const useBlockReveal = blockReveal && macroScale;
  const size = Math.max(2, cellSize);
  const maxArm = size * 0.5;

  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = bgR;
    dst[i + 1] = bgG;
    dst[i + 2] = bgB;
    dst[i + 3] = 255;
  }

  for (let cellY = 0; cellY < height; cellY += size) {
    for (let cellX = 0; cellX < width; cellX += size) {
      const centerX = cellX + size * 0.5;
      const centerY = cellY + size * 0.5;
      const { localX: sampleX, localY: sampleY } = canvasToLocal(
        centerX,
        centerY,
        offsetX,
        offsetY,
      );
      const [cr, cg, cb, ca] = sampleSourceRgb(
        src,
        srcW,
        srcH,
        sampleX,
        sampleY,
        drawWidth,
        drawHeight,
      );

      const cellDarkness = ca > 0 ? 1 - heckelLuminance(cr, cg, cb) : 0;
      const armLen = cellDarkness * maxArm;

      const yEnd = Math.min(cellY + size, height);
      const xEnd = Math.min(cellX + size, width);

      for (let py = cellY; py < yEnd; py += 1) {
        for (let px = cellX; px < xEnd; px += 1) {
          const { localX, localY } = canvasToLocal(px, py, offsetX, offsetY);
          const [sr, sg, sb, sa] = sampleSourceRgb(
            src,
            srcW,
            srcH,
            localX,
            localY,
            drawWidth,
            drawHeight,
          );

          let hr: number;
          let hg: number;
          let hb: number;

          const lx = px - centerX + 0.5;
          const ly = py - centerY + 0.5;

          if (sa > 0 && isOnCross(lx, ly, armLen, armWidth)) {
            if (inkBlack) {
              hr = 0;
              hg = 0;
              hb = 0;
            } else {
              hr = sr;
              hg = sg;
              hb = sb;
            }
          } else {
            hr = bgR;
            hg = bgG;
            hb = bgB;
          }

          const mix = pixelRevealMix(
            px,
            py,
            rawReveal,
            easedReveal,
            Boolean(useBlockReveal),
            blockRevealSeed,
            macroScale,
            mesoScale,
          );

          const di = (py * width + px) * 4;
          dst[di] = Math.round(sr * mix + hr * (1 - mix));
          dst[di + 1] = Math.round(sg * mix + hg * (1 - mix));
          dst[di + 2] = Math.round(sb * mix + hb * (1 - mix));
          dst[di + 3] = 255;
        }
      }
    }
  }

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(out, 0, 0);
}
