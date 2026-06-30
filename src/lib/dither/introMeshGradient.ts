import { clamp } from "./bayer";
import {
  lumToGray,
  sampleIntroHeckelLuminance,
} from "./introProceduralField";

/** Animated floating luminance , alias for intro gradient field. */
export function sampleIntroMeshLuminance(
  u: number,
  v: number,
  timeMs = 0,
): number {
  return sampleIntroHeckelLuminance(u, v, u * 400, v * 400, timeMs);
}

export function introMeshGray(lum: number): number {
  return lumToGray(lum);
}

export type IntroMeshGradientConfig = {
  width: number;
  height: number;
  timeMs?: number;
  step?: number;
  reuseImageData?: ImageData;
};

/** Smooth dynamic B/W gradient only (no dither / lego). */
export function renderIntroMeshGradient(
  ctx: CanvasRenderingContext2D,
  config: IntroMeshGradientConfig,
): void {
  const { width, height, timeMs = 0, step = 1, reuseImageData } = config;
  if (width <= 0 || height <= 0) return;

  const imageData =
    reuseImageData &&
    reuseImageData.width === width &&
    reuseImageData.height === height
      ? reuseImageData
      : ctx.createImageData(width, height);
  const data = imageData.data;

  for (let py = 0; py < height; py += step) {
    for (let px = 0; px < width; px += step) {
      const u = (px + step * 0.5) / width;
      const v = (py + step * 0.5) / height;
      const lum = sampleIntroMeshLuminance(u, v, timeMs);
      const gray = lumToGray(lum);

      const w = Math.min(step, width - px);
      const h = Math.min(step, height - py);

      for (let dy = 0; dy < h; dy += 1) {
        for (let dx = 0; dx < w; dx += 1) {
          const i = ((py + dy) * width + (px + dx)) * 4;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
          data[i + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
