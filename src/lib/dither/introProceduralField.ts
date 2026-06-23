import { clamp } from "./bayer";
import { heckelWhiteNoiseThreshold } from "./heckelDither";

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 + 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash01(x: number, y: number): number {
  return heckelWhiteNoiseThreshold(x * 127.1 + 311.7, y * 269.5 + 183.3);
}

/** Bilinear smooth value noise — low-frequency, Perlin-like. */
function smoothValueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const n00 = hash01(ix, iy);
  const n10 = hash01(ix + 1, iy);
  const n01 = hash01(ix, iy + 1);
  const n11 = hash01(ix + 1, iy + 1);

  const nx0 = n00 + (n10 - n00) * ux;
  const nx1 = n01 + (n11 - n01) * ux;
  return nx0 + (nx1 - nx0) * uy;
}

function warpUV(u: number, v: number, t: number): [number, number] {
  const s = 0.09;
  return [
    u +
      s *
        Math.sin(v * 4.2 + u * 2.8 + t * 1.3) *
        Math.cos(u * 2.4 - t * 0.85),
    v +
      s *
        Math.cos(u * 3.8 - v * 3.1 + t * 1.1) *
        Math.sin(v * 2.2 + t * 0.7),
  ];
}

function fbm(x: number, y: number, t: number): number {
  let value = 0;
  let amp = 0.52;
  let freq = 1;

  for (let i = 0; i < 4; i += 1) {
    value += amp * (smoothValueNoise(x * freq + t * 0.55, y * freq - t * 0.42) - 0.5);
    freq *= 2.05;
    amp *= 0.5;
  }

  return value;
}

/**
 * Dynamic B/W luminance — smooth floating light/shadow (reference).
 * Dither + jitter read this map; field stays grain-free.
 */
export function sampleIntroHeckelLuminance(
  u: number,
  v: number,
  _gx: number,
  _gy: number,
  timeMs = 0,
): number {
  const t = timeMs * 0.00008;
  const [wu, wv] = warpUV(u, v, t);

  const light = 0.2 + 0.8 * clamp(1 - wu * 0.5 - wv * 0.4, 0, 1);

  const wx = wu * 2.4 + Math.sin(t * 0.9) * 0.05;
  const wy = wv * 2.1 + Math.cos(t * 0.75) * 0.045;
  const n1 = fbm(wx, wy, t);
  const n2 = fbm(wx * 1.5 + 1.9, wy * 1.3 - 0.8, t * 1.05);
  const n3 = fbm(wx * 0.68 - 1.2, wy * 0.62 + 1.4, t * 0.78);
  const marble = n1 * 0.42 + n2 * 0.3 + n3 * 0.18;

  const cx = wu - 0.46 + Math.sin(t * 1.0) * 0.04;
  const cy = wv - 0.42 + Math.cos(t * 0.85) * 0.035;
  const blobA = Math.exp(-(cx * cx * 1.6 + cy * cy * 1.9)) * 0.45;
  const blobB = Math.exp(
    -((wu - 0.7) ** 2 * 2.2 + (wv - 0.55) ** 2 * 1.5),
  ) * 0.3;
  const blobC = Math.exp(
    -((wu - 0.2) ** 2 * 2.0 + (wv - 0.75) ** 2 * 1.8),
  ) * 0.24;

  const vignette = 1 - Math.hypot(wu - 0.5, wv - 0.44) * 0.28;
  const raw = (light + marble + blobA + blobB + blobC) * vignette;
  const shaped = smoothstep(0.06, 0.88, raw * 0.52 + 0.48);

  return clamp(Math.pow(shaped, 0.98), 0.03, 1);
}

/** Grayscale tone from luminance — dither/jitter follow this. */
export function lumToGray(lum: number): number {
  return Math.round(clamp(lum, 0, 1) * 255);
}
