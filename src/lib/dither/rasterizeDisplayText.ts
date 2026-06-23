import { introBufferLayout } from "./constants";

export type RasterizeDisplayTextOptions = {
  lines: readonly string[];
  cssW: number;
  cssH: number;
  fontSizePx: number;
  fontFamily: string;
  letterSpacing: string;
  lineGapPx: number;
};

/** Rasterize display lines into buffer pixels — same grid density as intro capture. */
export async function rasterizeDisplayText(
  options: RasterizeDisplayTextOptions,
): Promise<ImageData | null> {
  if (typeof document === "undefined") return null;

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const { lines, cssW, cssH, fontSizePx, fontFamily, letterSpacing, lineGapPx } =
    options;

  const { bufferW, bufferH } = introBufferLayout(cssW, cssH);
  if (bufferW < 1 || bufferH < 1) return null;

  const off = document.createElement("canvas");
  off.width = bufferW;
  off.height = bufferH;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const scaleX = bufferW / cssW;
  const scaleY = bufferH / cssH;
  ctx.scale(scaleX, scaleY);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cssW, cssH);

  ctx.fillStyle = "#000000";
  ctx.font = `400 ${fontSizePx}px ${fontFamily}`;
  ctx.textBaseline = "top";
  ctx.letterSpacing = letterSpacing;

  let y = 0;
  for (const line of lines) {
    ctx.fillText(line.toUpperCase(), 0, y);
    y += fontSizePx + lineGapPx;
  }

  return ctx.getImageData(0, 0, bufferW, bufferH);
}
