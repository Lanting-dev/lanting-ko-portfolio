import { isMobileViewport } from "@/lib/browser/isMobile";
import { isSafari } from "@/lib/browser/isSafari";
import type { BlockScale } from "./blockReveal";
import { DITHER_MACRO_SCALE, DITHER_MESO_SCALE } from "./blockReveal";

/** Safari + narrow viewports , lower canvas res and frame rate. */
function isLowPowerCanvas(): boolean {
  if (typeof window === "undefined") return false;
  return isSafari() || isMobileViewport();
}

/** CSS-pixel defaults , scaled by devicePixelRatio at render time. */
export const DITHER_PIXEL_SIZE = 2;
/** Heckel `colorNum` , 4 = smooth gradients; 2 = harsh B/W print. */
export const DITHER_COLOR_NUM = 4;
/** Bayer + blue noise blend , structured pattern with softer organic breakup. */
export const DITHER_THRESHOLD_MODE = "blend" as const;
export const DITHER_BLUE_BLEND = 0.35;

/** Cross (+) halftone cell size in buffer pixels , visible star arms. */
export const CROSS_HALFTONE_CELL = 4;
export const CROSS_HALFTONE_ARM_WIDTH = 1;

/** Intro pixel-grid cross stitch. */
export const CROSS_STITCH_CELL = 6;
export const CROSS_STITCH_INSET = 1;
export const CROSS_STITCH_THREAD = 1;

/** Project cards , coarser 4×4 X for visible stitch texture. */
export const CROSS_STITCH_CELL_CARD = 4;
export const CROSS_STITCH_INSET_CARD = 0;
export const CROSS_STITCH_THREAD_CARD = 1;

/** Live grain on stitch threads , used during drift dissolve. */
export const CROSS_STITCH_NOISE_AMP = 14;
export const CROSS_STITCH_NOISE_DROPOUT = 0.04;
/** Horizontal sand scatter at drift=1 (buffer px). */
export const CROSS_STITCH_DRIFT_SPREAD = 11;
/** Downward fall distance at drift=1 , applied with gravity ease. */
export const CROSS_STITCH_DRIFT_FALL = 36;
/** Max sand pile height as fraction of canvas (at drift=1). */
export const CROSS_STITCH_PILE_BAND = 0.14;
/** Intro exit , taller heap so sand reads flush with viewport bottom. */
export const CROSS_STITCH_INTRO_PILE_BAND = 0.32;
/** Footer sand garden , pile within the dome, not a thin strip. */
export const CROSS_STITCH_FOOTER_PILE_BAND = 0.48;

export type DitherRenderMode = "heckel" | "cross";
export const DITHER_RENDER_MODE: DitherRenderMode = "cross";

export function ditherDeviceScale(): number {
  if (typeof window === "undefined") return 1;
  if (isLowPowerCanvas()) return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

/** Internal canvas scale , low-power targets render smaller and upscale via CSS. */
export function ditherRenderScale(): number {
  return isLowPowerCanvas() ? 0.5 : 1;
}

export function ditherEffectivePixelSize(base = DITHER_PIXEL_SIZE): number {
  return isLowPowerCanvas() ? Math.max(2, base) : base;
}

/** 0 = every rAF tick; low-power caps to ~20fps. */
export function ditherFrameIntervalMs(): number {
  return isLowPowerCanvas() ? 50 : 0;
}

export function ditherMacroScale(): BlockScale {
  return isLowPowerCanvas()
    ? { blockPx: 24, lag: 0, spread: 0.18 }
    : DITHER_MACRO_SCALE;
}

export function ditherIntroMacroScale(): BlockScale {
  return { blockPx: 40, lag: 0.15, spread: 0.4 };
}

export function ditherMesoScale(): BlockScale {
  return isLowPowerCanvas()
    ? { blockPx: 10, lag: 0.08, spread: 0.15 }
    : DITHER_MESO_SCALE;
}

export function ditherColorNumForBrowser(): number {
  return DITHER_COLOR_NUM;
}

export function ditherThresholdModeForBrowser():
  | "bayer"
  | "blue"
  | "white"
  | "blend" {
  return DITHER_THRESHOLD_MODE;
}

export type DitherBufferLayout = {
  bufferW: number;
  bufferH: number;
  pixelSize: number;
};

export function ditherBufferLayout(
  cssW: number,
  cssH: number,
  basePixelSize = DITHER_PIXEL_SIZE,
): DitherBufferLayout {
  const dpr = ditherDeviceScale();
  const scale = ditherRenderScale();
  let bufferW = Math.max(1, Math.round(cssW * dpr * scale));
  let bufferH = Math.max(1, Math.round(cssH * dpr * scale));

  if (isLowPowerCanvas()) {
    const maxPixels = 400_000;
    const pixels = bufferW * bufferH;
    if (pixels > maxPixels) {
      const shrink = Math.sqrt(maxPixels / pixels);
      bufferW = Math.max(1, Math.round(bufferW * shrink));
      bufferH = Math.max(1, Math.round(bufferH * shrink));
    }
  }

  const pixelSize = Math.max(
    1,
    Math.round(ditherEffectivePixelSize(basePixelSize) * dpr * scale),
  );

  return { bufferW, bufferH, pixelSize };
}

/** Full-screen intro , lower internal res, capped pixels (all browsers). */
export function introBufferLayout(
  cssW: number,
  cssH: number,
): DitherBufferLayout {
  const scale = isLowPowerCanvas() ? 0.45 : 0.55;
  let bufferW = Math.max(1, Math.round(cssW * scale));
  let bufferH = Math.max(1, Math.round(cssH * scale));

  const maxPixels = isLowPowerCanvas() ? 320_000 : 480_000;
  const pixels = bufferW * bufferH;
  if (pixels > maxPixels) {
    const shrink = Math.sqrt(maxPixels / pixels);
    bufferW = Math.max(1, Math.round(bufferW * shrink));
    bufferH = Math.max(1, Math.round(bufferH * shrink));
  }

  const pixelSize = DITHER_PIXEL_SIZE;

  return { bufferW, bufferH, pixelSize };
}

/** Project card stitch , lower internal res so X reads like intro. */
export function cardStitchBufferLayout(
  cssW: number,
  cssH: number,
): DitherBufferLayout {
  const scale = isLowPowerCanvas() ? 0.42 : 0.48;
  let bufferW = Math.max(1, Math.round(cssW * scale));
  let bufferH = Math.max(1, Math.round(cssH * scale));

  const maxPixels = isLowPowerCanvas() ? 180_000 : 280_000;
  const pixels = bufferW * bufferH;
  if (pixels > maxPixels) {
    const shrink = Math.sqrt(maxPixels / pixels);
    bufferW = Math.max(1, Math.round(bufferW * shrink));
    bufferH = Math.max(1, Math.round(bufferH * shrink));
  }

  return { bufferW, bufferH, pixelSize: DITHER_PIXEL_SIZE };
}

/** Intro canvas target ~30fps , steadier than uneven heavy frames. */
export function introFrameIntervalMs(): number {
  return isLowPowerCanvas() ? 50 : 33;
}
