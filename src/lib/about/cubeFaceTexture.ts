import type { CubeFaceTone } from "./cubeFacePalette";
import {
  CROSS_STITCH_CELL_CARD,
  CROSS_STITCH_INSET_CARD,
  CROSS_STITCH_THREAD_CARD,
  cardStitchBufferLayout,
} from "@/lib/dither/constants";
import {
  buildStitchCells,
  renderCrossStitchCellScatter,
} from "@/lib/dither/crossStitch";
import { createSolidImageData } from "@/lib/dither/solidImageData";

/** Render a solid-color cross-stitch face once (same grid as project cards). */
export function renderCubeFaceStitchDataUrl(
  cssW: number,
  cssH: number,
  tone: CubeFaceTone,
  seed: number,
): string | null {
  if (cssW <= 0 || cssH <= 0 || typeof document === "undefined") return null;

  const { bufferW, bufferH } = cardStitchBufferLayout(cssW, cssH);
  const canvas = document.createElement("canvas");
  canvas.width = bufferW;
  canvas.height = bufferH;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const source = createSolidImageData(...tone.thread);
  const cells = buildStitchCells({
    width: bufferW,
    height: bufferH,
    source,
    offsetX: 0,
    offsetY: 0,
    drawWidth: bufferW,
    drawHeight: bufferH,
    shuffleSeed: seed,
    cellSize: CROSS_STITCH_CELL_CARD,
    inset: CROSS_STITCH_INSET_CARD,
    threadWidth: CROSS_STITCH_THREAD_CARD,
  });

  renderCrossStitchCellScatter(ctx, bufferW, bufferH, cells, 1, {
    backgroundRgb: tone.background,
    enablePile: false,
  });

  return canvas.toDataURL("image/png");
}
