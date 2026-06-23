import * as THREE from "three";
import type { CubeFaceTone } from "@/lib/about/cubeFacePalette";
import {
  CROSS_STITCH_CELL_CARD,
  CROSS_STITCH_INSET_CARD,
  CROSS_STITCH_THREAD_CARD,
  cardStitchBufferLayout,
} from "@/lib/dither/constants";
import {
  buildStitchCells,
  renderCrossStitchCellScatter,
  type StitchCell,
} from "@/lib/dither/crossStitch";
import { createSolidImageData } from "@/lib/dither/solidImageData";

const TEXTURE_RES = 128;

export class StitchCanvasTexture {
  readonly texture: THREE.CanvasTexture;
  private readonly canvas: HTMLCanvasElement;
  private cells: StitchCell[] = [];

  constructor(
    private readonly tone: CubeFaceTone,
    private readonly seed: number,
  ) {
    this.canvas = document.createElement("canvas");
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.rebuild();
    this.paint(0, false);
  }

  rebuild(): void {
    const { bufferW, bufferH } = cardStitchBufferLayout(
      TEXTURE_RES,
      TEXTURE_RES,
    );
    this.canvas.width = bufferW;
    this.canvas.height = bufferH;

    const source = createSolidImageData(...this.tone.thread);
    this.cells = buildStitchCells({
      width: bufferW,
      height: bufferH,
      source,
      offsetX: 0,
      offsetY: 0,
      drawWidth: bufferW,
      drawHeight: bufferH,
      shuffleSeed: this.seed,
      cellSize: CROSS_STITCH_CELL_CARD,
      inset: CROSS_STITCH_INSET_CARD,
      threadWidth: CROSS_STITCH_THREAD_CARD,
    });
  }

  paint(timeMs: number, animateNoise: boolean): void {
    const ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    renderCrossStitchCellScatter(
      ctx,
      this.canvas.width,
      this.canvas.height,
      this.cells,
      1,
      {
        backgroundRgb: this.tone.background,
        enablePile: false,
        ...(animateNoise ? { noise: { timeMs } } : {}),
      },
    );

    this.texture.needsUpdate = true;
  }

  dispose(): void {
    this.texture.dispose();
  }
}
