/**
 * Canvas port of Maxime Heckel's retro dither / quantize pipeline.
 * @see https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/
 */
import { bayerThreshold, clamp } from "./bayer";
import { BLUE_NOISE_TILE_SIZE, sampleBlueNoiseTile } from "./blueNoiseTile";

export type HeckelThresholdMode = "bayer" | "blue" | "white" | "blend";

/** Rec. 709 luminance — matches article GLSL weights. */
export function heckelLuminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Article: `random(vec2 c)` white-noise threshold. */
export function heckelWhiteNoiseThreshold(x: number, y: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/** Article: `texture2D(uNoise, gl_FragCoord.xy / 128.0).r` */
export function heckelBlueNoiseThreshold(x: number, y: number): number {
  return sampleBlueNoiseTile(x, y);
}

/** 8×8 Bayer — article `bayerMatrix8x8[y * 8 + x]`. */
export function heckelBayerThreshold(x: number, y: number): number {
  return bayerThreshold(x, y);
}

export function heckelThreshold(
  x: number,
  y: number,
  mode: HeckelThresholdMode = "bayer",
  blend = 0.35,
): number {
  if (mode === "white") return heckelWhiteNoiseThreshold(x, y);
  if (mode === "blue") return heckelBlueNoiseThreshold(x, y);
  if (mode === "blend") {
    const ordered = heckelBayerThreshold(x, y);
    const blue = heckelBlueNoiseThreshold(x, y);
    const mix = clamp(blend, 0, 1);
    return ordered * (1 - mix) + blue * mix;
  }
  return heckelBayerThreshold(x, y);
}

/** Article ordered binary: white if lum >= threshold, else black. */
export function heckelOrderedBinary(
  lum: number,
  x: number,
  y: number,
  mode: HeckelThresholdMode = "bayer",
  blend = 0.35,
): boolean {
  const threshold = heckelThreshold(x, y, mode, blend);
  return lum >= threshold;
}

/**
 * Article quantize: `color += threshold` then
 * `floor(color * (colorNum - 1) + 0.5) / (colorNum - 1)`.
 */
export function heckelQuantizeChannel(
  value: number,
  colorNum: number,
  threshold: number,
): number {
  const n = Math.max(2, colorNum);
  let color = clamp(value, 0, 1);
  color += threshold;
  return Math.floor(color * (n - 1) + 0.5) / (n - 1);
}

export function heckelQuantizeScalar(
  value: number,
  x: number,
  y: number,
  colorNum: number,
  mode: HeckelThresholdMode = "bayer",
  blend = 0.35,
): number {
  const threshold = heckelThreshold(x, y, mode, blend);
  return heckelQuantizeChannel(value, colorNum, threshold);
}

/**
 * Lum-driven stipple gray — dot brightness follows local light/shadow.
 * `level` from Heckel quantize; output scales by lum so bright regions read lighter.
 */
export function heckelLumDitherGray(
  lum: number,
  x: number,
  y: number,
  colorNum: number,
  mode: HeckelThresholdMode = "bayer",
  blend = 0.35,
): number {
  const l = clamp(lum, 0, 1);
  const level = heckelQuantizeScalar(l, x, y, colorNum, mode, blend);
  return Math.round(l * level * 255);
}

/** Gap tone between stipple dots — still lum-tinted, darker than dots. */
export function heckelLumDitherGapGray(
  lum: number,
  x: number,
  y: number,
  colorNum: number,
  mode: HeckelThresholdMode = "bayer",
  blend = 0.35,
): number {
  const l = clamp(lum, 0, 1);
  const level = heckelQuantizeScalar(l, x, y, colorNum, mode, blend);
  return Math.round(l * level * 0.38 * 255);
}

/** Article RGB quantize — per channel with shared threshold. */
export function heckelQuantizeRgb(
  r: number,
  g: number,
  b: number,
  x: number,
  y: number,
  colorNum: number,
  mode: HeckelThresholdMode = "bayer",
  blend = 0.35,
): [number, number, number] {
  const threshold = heckelThreshold(x, y, mode, blend);
  return [
    Math.round(heckelQuantizeChannel(r / 255, colorNum, threshold) * 255),
    Math.round(heckelQuantizeChannel(g / 255, colorNum, threshold) * 255),
    Math.round(heckelQuantizeChannel(b / 255, colorNum, threshold) * 255),
  ];
}

/** Article pixelization: snap coords to grid before sampling. */
export function heckelPixelCoord(
  x: number,
  y: number,
  pixelSize: number,
): { x: number; y: number } {
  const size = Math.max(1, pixelSize);
  return {
    x: size * Math.floor(x / size),
    y: size * Math.floor(y / size),
  };
}

export { BLUE_NOISE_TILE_SIZE };
