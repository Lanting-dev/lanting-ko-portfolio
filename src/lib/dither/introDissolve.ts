import { clamp } from "./bayer";
import { sampleBlueNoiseTile } from "./blueNoiseTile";

export type IntroDissolveConfig = {
  width: number;
  height: number;
  progress: number;
  pixelSize?: number;
  reuseImageData?: ImageData;
};

/**
 * Black veil dissolves via blue-noise — reveals mesh gradient underneath.
 * No block squares, no white stipple on top of the gradient.
 */
export function renderIntroDissolve(
  ctx: CanvasRenderingContext2D,
  config: IntroDissolveConfig,
): void {
  const { width, height, progress, pixelSize = 2, reuseImageData } = config;
  if (width <= 0 || height <= 0) return;

  const reveal = clamp(progress, 0, 1);
  const imageData =
    reuseImageData &&
    reuseImageData.width === width &&
    reuseImageData.height === height
      ? reuseImageData
      : ctx.createImageData(width, height);
  const data = imageData.data;
  data.fill(0);

  for (let py = 0; py < height; py += pixelSize) {
    for (let px = 0; px < width; px += pixelSize) {
      const gx = Math.floor(px / pixelSize);
      const gy = Math.floor(py / pixelSize);
      const order = sampleBlueNoiseTile(gx, gy);
      const cleared = clamp((reveal - order * 0.93) / 0.13, 0, 1);

      if (cleared >= 0.995) continue;

      const alpha = Math.round(255 * (1 - cleared));
      if (alpha <= 2) continue;

      const w = Math.min(pixelSize, width - px);
      const h = Math.min(pixelSize, height - py);

      for (let dy = 0; dy < h; dy += 1) {
        for (let dx = 0; dx < w; dx += 1) {
          const i = ((py + dy) * width + (px + dx)) * 4;
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = alpha;
        }
      }
    }
  }

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(imageData, 0, 0);
}
