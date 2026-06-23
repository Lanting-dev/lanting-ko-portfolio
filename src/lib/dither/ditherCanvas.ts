import { clamp } from "./bayer";
import {
  DITHER_BLUE_BLEND,
  DITHER_COLOR_NUM,
  DITHER_THRESHOLD_MODE,
} from "./constants";
import {
  heckelPixelCoord,
  heckelQuantizeRgb,
  type HeckelThresholdMode,
} from "./heckelDither";
import {
  sampleImageLuminance,
  type ImageLuminanceSource,
} from "./luminanceField";

export type DitherSurface = "light" | "dark";

export type DitherLumGridConfig = {
  width: number;
  height: number;
  pixelSize?: number;
  imageLuminance?: ImageLuminanceSource;
};

export type DitherRenderConfig = DitherLumGridConfig & {
  progress: number;
  colorNum?: number;
  thresholdMode?: HeckelThresholdMode;
  blueBlend?: number;
  reuseImageData?: ImageData;
};

/**
 * Scatter overlay — same Heckel RGB quantize when image lum source is provided.
 */
export function renderDitherScatter(
  ctx: CanvasRenderingContext2D,
  config: DitherRenderConfig,
): void {
  const {
    width,
    height,
    progress,
    pixelSize = 1,
    colorNum = DITHER_COLOR_NUM,
    thresholdMode = DITHER_THRESHOLD_MODE,
    blueBlend = DITHER_BLUE_BLEND,
    imageLuminance,
    reuseImageData,
  } = config;

  if (width <= 0 || height <= 0 || !imageLuminance) return;

  const mix = clamp(progress, 0, 1);
  const ditherMix = 1 - mix;

  const imageData =
    reuseImageData &&
    reuseImageData.width === width &&
    reuseImageData.height === height
      ? reuseImageData
      : ctx.createImageData(width, height);
  const data = imageData.data;
  data.fill(0);

  const { data: src, offsetX, offsetY, drawWidth, drawHeight } = imageLuminance;
  const srcW = src.width;
  const srcH = src.height;
  const pixels = src.data;

  for (let py = 0; py < height; py += pixelSize) {
    for (let px = 0; px < width; px += pixelSize) {
      const snapped = heckelPixelCoord(px, py, pixelSize);
      const blockW = Math.min(pixelSize, width - px);
      const blockH = Math.min(pixelSize, height - py);
      const localX = snapped.x - offsetX;
      const localY = snapped.y - offsetY;

      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      if (
        localX >= 0 &&
        localY >= 0 &&
        localX < drawWidth &&
        localY < drawHeight
      ) {
        const u = drawWidth > 0 ? localX / drawWidth : 0;
        const v = drawHeight > 0 ? localY / drawHeight : 0;
        const sx = Math.min(srcW - 1, Math.max(0, Math.floor(u * srcW)));
        const sy = Math.min(srcH - 1, Math.max(0, Math.floor(v * srcH)));
        const si = (sy * srcW + sx) * 4;
        const sr = pixels[si] ?? 0;
        const sg = pixels[si + 1] ?? 0;
        const sb = pixels[si + 2] ?? 0;
        const sa = pixels[si + 3] ?? 255;

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
          r = Math.round(sr * mix + dr * ditherMix);
          g = Math.round(sg * mix + dg * ditherMix);
          b = Math.round(sb * mix + db * ditherMix);
          a = sa;
        }
      }

      for (let dy = 0; dy < blockH; dy += 1) {
        for (let dx = 0; dx < blockW; dx += 1) {
          const i = ((py + dy) * width + (px + dx)) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = a;
        }
      }
    }
  }

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(imageData, 0, 0);
}

export function buildDitherStaticLumGrid(config: DitherLumGridConfig): Float32Array {
  const { width, height, pixelSize = 1, imageLuminance } = config;
  const gridW = Math.ceil(width / pixelSize);
  const gridH = Math.ceil(height / pixelSize);
  const grid = new Float32Array(gridW * gridH);

  if (!imageLuminance) return grid;

  for (let gy = 0; gy < gridH; gy += 1) {
    for (let gx = 0; gx < gridW; gx += 1) {
      grid[gy * gridW + gx] = sampleImageLuminance(
        gx,
        gy,
        pixelSize,
        imageLuminance,
      );
    }
  }

  return grid;
}
