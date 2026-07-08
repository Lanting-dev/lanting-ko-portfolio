import { isMobileViewport } from "@/lib/browser/isMobile";
import { isSafari } from "@/lib/browser/isSafari";

/** Safari + narrow viewports — lower canvas res. */
function isLowPowerCanvas(): boolean {
  if (typeof window === "undefined") return false;
  return isSafari() || isMobileViewport();
}

export const DITHER_PIXEL_SIZE = 2;

export type DitherBufferLayout = {
  bufferW: number;
  bufferH: number;
  pixelSize: number;
};

/** Full-screen intro — lower internal res, capped pixels (all browsers). */
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

  return { bufferW, bufferH, pixelSize: DITHER_PIXEL_SIZE };
}
