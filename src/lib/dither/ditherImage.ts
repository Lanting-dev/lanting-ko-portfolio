import { clamp } from "./bayer";
import {
  DITHER_BLUE_BLEND,
  DITHER_COLOR_NUM,
  DITHER_THRESHOLD_MODE,
} from "./constants";
import {
  multiScaleRevealMask,
  type BlockScale,
} from "./blockReveal";
import {
  heckelPixelCoord,
  heckelQuantizeRgb,
  type HeckelThresholdMode,
} from "./heckelDither";
import { sampleSourceRgb } from "./imageSample";

export { sampleSourceRgb };

export type HeckelImageRenderConfig = {
  width: number;
  height: number;
  source: ImageData;
  offsetX?: number;
  offsetY?: number;
  drawWidth?: number;
  drawHeight?: number;
  pixelSize?: number;
  colorNum?: number;
  thresholdMode?: HeckelThresholdMode;
  blueBlend?: number;
  /** 0 = full Heckel dither, 1 = sharp source pixels */
  reveal?: number;
  /** Stagger reveal by block , intro only. */
  blockReveal?: boolean;
  blockRevealSeed?: number;
  macroScale?: BlockScale;
  mesoScale?: BlockScale;
  /** Canvas fill outside image bounds , default white. */
  backgroundRgb?: [number, number, number];
};

/**
 * Heckel post-process , pixel snap, sample image, RGB quantize + Bayer dither.
 * @see https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/
 */
export function renderHeckelImageDither(
  ctx: CanvasRenderingContext2D,
  config: HeckelImageRenderConfig,
): void {
  const {
    width,
    height,
    source,
    offsetX = 0,
    offsetY = 0,
    drawWidth = width,
    drawHeight = height,
    pixelSize = 1,
    colorNum = DITHER_COLOR_NUM,
    thresholdMode = DITHER_THRESHOLD_MODE,
    blueBlend = DITHER_BLUE_BLEND,
    reveal = 0,
    blockReveal = false,
    blockRevealSeed = 0,
    macroScale,
    mesoScale,
    backgroundRgb = [255, 255, 255],
  } = config;

  if (width <= 0 || height <= 0) return;

  const out = ctx.createImageData(width, height);
  const dst = out.data;
  const [bgR, bgG, bgB] = backgroundRgb;

  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = bgR;
    dst[i + 1] = bgG;
    dst[i + 2] = bgB;
    dst[i + 3] = 255;
  }
  const src = source.data;
  const srcW = source.width;
  const srcH = source.height;

  const globalReveal = clamp(reveal, 0, 1);
  const useBlockReveal = blockReveal && macroScale && mesoScale;

  for (let py = 0; py < height; py += pixelSize) {
    for (let px = 0; px < width; px += pixelSize) {
      const snapped = heckelPixelCoord(px, py, pixelSize);
      const blockW = Math.min(pixelSize, width - px);
      const blockH = Math.min(pixelSize, height - py);
      const localX = snapped.x - offsetX;
      const localY = snapped.y - offsetY;

      let r = bgR;
      let g = bgG;
      let b = bgB;
      let a = 255;

      const [sr, sg, sb, sa] = sampleSourceRgb(
        src,
        srcW,
        srcH,
        localX,
        localY,
        drawWidth,
        drawHeight,
      );

      if (sa > 0) {
        const [dr, dg, db] = heckelQuantizeRgb(
          sr,
          sg,
          sb,
          snapped.x,
          snapped.y,
          colorNum,
          thresholdMode,
          blueBlend,
        );

        const mix = useBlockReveal
          ? multiScaleRevealMask(
              snapped.x,
              snapped.y,
              blockRevealSeed,
              globalReveal,
              1,
              macroScale,
              mesoScale,
            )
          : globalReveal;
        const ditherMix = 1 - mix;

        r = Math.round(sr * mix + dr * ditherMix);
        g = Math.round(sg * mix + dg * ditherMix);
        b = Math.round(sb * mix + db * ditherMix);
        a = sa;
      }

      for (let dy = 0; dy < blockH; dy += 1) {
        for (let dx = 0; dx < blockW; dx += 1) {
          const di = ((py + dy) * width + (px + dx)) * 4;
          dst[di] = r;
          dst[di + 1] = g;
          dst[di + 2] = b;
          dst[di + 3] = a;
        }
      }
    }
  }

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(out, 0, 0);
}
