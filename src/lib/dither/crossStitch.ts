import { clamp, shuffleIndices } from "./bayer";
import { sampleBlueNoiseTile } from "./blueNoiseTile";
import {
  CROSS_STITCH_CELL,
  CROSS_STITCH_DRIFT_FALL,
  CROSS_STITCH_DRIFT_SPREAD,
  CROSS_STITCH_PILE_BAND,
  CROSS_STITCH_INSET,
  CROSS_STITCH_NOISE_AMP,
  CROSS_STITCH_NOISE_DROPOUT,
  CROSS_STITCH_THREAD,
} from "./constants";
import { canvasToLocal, sampleSourceRgb } from "./imageSample";

export type StitchPixel = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
};

export type StitchCell = {
  pixels: StitchPixel[];
};

export type StitchNoiseConfig = {
  timeMs: number;
  amplitude?: number;
  dropout?: number;
};

export type CrossStitchRenderOptions = {
  backgroundRgb?: [number, number, number];
  /** 0→1 — stitches drift up and dissolve (use during sharp fade-in). */
  drift?: number;
  noise?: StitchNoiseConfig;
  /** Wind-like cell motion while a settled sand pile remains in place. */
  ambientMotion?: boolean;
  /** Sand pile at bottom — intro only; cards use quick fall. */
  enablePile?: boolean;
  /** Share of canvas height used for the sand heap (intro pile). */
  pileBand?: number;
};

export type CrossStitchBuildConfig = {
  width: number;
  height: number;
  source: ImageData;
  offsetX?: number;
  offsetY?: number;
  drawWidth?: number;
  drawHeight?: number;
  cellSize?: number;
  inset?: number;
  threadWidth?: number;
  shuffleSeed?: number;
};

function jitterStitchRgb(
  r: number,
  g: number,
  b: number,
  x: number,
  y: number,
  noise: StitchNoiseConfig,
): [number, number, number] | null {
  const t = noise.timeMs * 0.0011;
  const amp = noise.amplitude ?? CROSS_STITCH_NOISE_AMP;
  const dropout = noise.dropout ?? CROSS_STITCH_NOISE_DROPOUT;
  const n = sampleBlueNoiseTile(x * 0.85 + t * 19, y * 0.85 - t * 13);
  const flicker = sampleBlueNoiseTile(x * 0.42 - t * 7, y * 0.42 + t * 23);

  if (flicker < dropout) return null;

  const d = (n - 0.5) * amp;
  return [
    clamp(Math.round(r + d), 0, 255),
    clamp(Math.round(g + d), 0, 255),
    clamp(Math.round(b + d), 0, 255),
  ];
}

function distanceToSegment(
  px: number,
  py: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): number {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x0, py - y0);
  let t = ((px - x0) * dx + (py - y0) * dy) / len2;
  t = clamp(t, 0, 1);
  const qx = x0 + t * dx;
  const qy = y0 + t * dy;
  return Math.hypot(px - qx, py - qy);
}

function isOnStitchThread(
  px: number,
  py: number,
  cellX: number,
  cellY: number,
  size: number,
  inset: number,
  thread: number,
): boolean {
  const x0 = cellX + inset;
  const y0 = cellY + inset;
  const x1 = cellX + size - 1 - inset;
  const y1 = cellY + size - 1 - inset;
  const cx = px + 0.5;
  const cy = py + 0.5;
  const half = thread * 0.5;

  if (distanceToSegment(cx, cy, x0, y0, x1, y1) <= half) return true;
  if (distanceToSegment(cx, cy, x1, y0, x0, y1) <= half) return true;
  return false;
}

function collectCellThreadPixels(
  cellX: number,
  cellY: number,
  xEnd: number,
  yEnd: number,
  size: number,
  inset: number,
  threadWidth: number,
  src: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  offsetX: number,
  offsetY: number,
  drawWidth: number,
  drawHeight: number,
): StitchPixel[] {
  const pixels: StitchPixel[] = [];

  for (let py = cellY; py < yEnd; py += 1) {
    for (let px = cellX; px < xEnd; px += 1) {
      if (!isOnStitchThread(px, py, cellX, cellY, size, inset, threadWidth)) {
        continue;
      }

      const { localX, localY } = canvasToLocal(px, py, offsetX, offsetY);
      const [sr, sg, sb, sa] = sampleSourceRgb(
        src,
        srcW,
        srcH,
        localX,
        localY,
        drawWidth,
        drawHeight,
      );

      if (sa < 8) continue;

      pixels.push({ x: px, y: py, r: sr, g: sg, b: sb });
    }
  }

  return pixels;
}

/** Thread pixels only — shuffled per pixel (project cards). */
export function buildStitchPixels(config: CrossStitchBuildConfig): StitchPixel[] {
  const cells = buildStitchCells(config);
  const pixels: StitchPixel[] = [];
  for (const cell of cells) {
    pixels.push(...cell.pixels);
  }
  const order = shuffleIndices(pixels.length, config.shuffleSeed ?? 17);
  return order.map((i) => pixels[i]!);
}

/** One X per cell — shuffled for intro reveal. */
export function buildStitchCells(config: CrossStitchBuildConfig): StitchCell[] {
  const {
    width,
    height,
    source,
    offsetX = 0,
    offsetY = 0,
    drawWidth = width,
    drawHeight = height,
    cellSize = CROSS_STITCH_CELL,
    inset = CROSS_STITCH_INSET,
    threadWidth = CROSS_STITCH_THREAD,
    shuffleSeed = 17,
  } = config;

  const src = source.data;
  const srcW = source.width;
  const srcH = source.height;
  const size = Math.max(3, cellSize);
  const cells: StitchCell[] = [];

  for (let cellY = 0; cellY < height; cellY += size) {
    for (let cellX = 0; cellX < width; cellX += size) {
      const pixels = collectCellThreadPixels(
        cellX,
        cellY,
        Math.min(cellX + size, width),
        Math.min(cellY + size, height),
        size,
        inset,
        threadWidth,
        src,
        srcW,
        srcH,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

      if (pixels.length > 0) {
        cells.push({ pixels });
      }
    }
  }

  const order = shuffleIndices(cells.length, shuffleSeed);
  return order.map((i) => cells[i]!);
}

/** @deprecated Alias for buildStitchPixels */
export function buildStitchMesh(config: CrossStitchBuildConfig): {
  stitches: StitchPixel[];
} {
  return { stitches: buildStitchPixels(config) };
}

function blendRgb(
  bgR: number,
  bgG: number,
  bgB: number,
  fgR: number,
  fgG: number,
  fgB: number,
  alpha: number,
): [number, number, number] {
  const inv = 1 - alpha;
  return [
    Math.round(fgR * alpha + bgR * inv),
    Math.round(fgG * alpha + bgG * inv),
    Math.round(fgB * alpha + bgB * inv),
  ];
}

function writeStitchPixel(
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  alpha: number,
  bgR: number,
  bgG: number,
  bgB: number,
): void {
  if (x < 0 || y < 0 || x >= width || y >= height || alpha <= 0.02) return;

  const di = (y * width + x) * 4;
  const [br, bg, bb] = blendRgb(bgR, bgG, bgB, r, g, b, alpha);
  dst[di] = br;
  dst[di + 1] = bg;
  dst[di + 2] = bb;
  dst[di + 3] = 255;
}

function computeSandMotion(
  stitch: StitchPixel,
  drift: number,
  timeMs: number,
): {
  grain: number;
  tumble: number;
  x: number;
  y: number;
  fall: number;
} {
  const grain = sampleBlueNoiseTile(
    stitch.x * 0.63 + stitch.y * 0.17,
    stitch.y * 0.71 - stitch.x * 0.09,
  );
  const tumble = sampleBlueNoiseTile(
    stitch.x * 0.31 + timeMs * 0.0022,
    stitch.y * 0.47 + grain * 3.1,
  );
  const gravity = Math.pow(drift, 1.28);
  const spread = CROSS_STITCH_DRIFT_SPREAD * drift;
  const fall =
    CROSS_STITCH_DRIFT_FALL * gravity +
    tumble * drift * 8 +
    grain * drift * 4.5 +
    timeMs * 0.0075 * drift;

  const x = Math.round(
    stitch.x + (grain - 0.5) * spread * 1.8 + (tumble - 0.5) * drift * 2.5,
  );
  const y = Math.round(stitch.y + fall);

  return { grain, tumble, x, y, fall };
}

/** Pile mode — t² gravity; every cell falls into the heap (incl. bottom rows). */
function computePileSandMotion(
  anchor: StitchPixel,
  cellDrift: number,
  timeMs: number,
  floorStart: number,
  height: number,
  pileMaxDepth: number,
): ReturnType<typeof computeSandMotion> {
  const grain = sampleBlueNoiseTile(
    anchor.x * 0.63 + anchor.y * 0.17,
    anchor.y * 0.71 - anchor.x * 0.09,
  );
  const tumble = sampleBlueNoiseTile(
    anchor.x * 0.31 + timeMs * 0.0022,
    anchor.y * 0.47 + grain * 3.1,
  );
  const t = cellDrift;
  const landY = floorStart + grain * pileMaxDepth * 0.92;
  let fallSpan = landY - anchor.y;
  if (fallSpan < 10) {
    fallSpan = 10 + grain * 14 + Math.max(0, height - 1 - anchor.y) * 0.4;
  }

  const gravityFall = fallSpan * t * t;
  const flutter = tumble * t * 4 + grain * t * 2.5;
  const fall = gravityFall + flutter;
  const y = Math.round(anchor.y + fall);

  const spread = CROSS_STITCH_DRIFT_SPREAD * t * (1.15 + grain * 0.35);
  const x = Math.round(
    anchor.x +
      (grain - 0.5) * spread * 1.7 +
      (tumble - 0.5) * t * 3.2,
  );

  return { grain, tumble, x, y, fall };
}

function shouldSettleSandGrain(
  stitch: StitchPixel,
  drift: number,
  grain: number,
  fall: number,
  y: number,
  floorStart: number,
  height: number,
): boolean {
  if (y >= floorStart) return true;
  const settleGate = 0.04 + (stitch.y / Math.max(height, 1)) * 0.22 + grain * 0.1;
  return drift >= settleGate && stitch.y + fall >= floorStart - 2;
}

/** Shared sand clock — tiny grain jitter only (no row stagger). */
function cellDriftScale(anchor: StitchPixel, drift: number): number {
  const grain = sampleBlueNoiseTile(anchor.x * 0.41, anchor.y * 0.53);
  const release = grain * 0.07;
  return clamp((drift - release) / Math.max(1 - release, 0.08), 0, 1);
}

function cellAnchor(pixels: readonly StitchPixel[]): StitchPixel {
  let xSum = 0;
  let ySum = 0;
  for (const pixel of pixels) {
    xSum += pixel.x;
    ySum += pixel.y;
  }
  const count = pixels.length;
  const center = pixels[Math.floor(count / 2)] ?? pixels[0]!;
  return {
    x: Math.round(xSum / count),
    y: Math.round(ySum / count),
    r: center.r,
    g: center.g,
    b: center.b,
  };
}

function paintCellPixels(
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  pixels: readonly StitchPixel[],
  offsetX: number,
  offsetY: number,
  alpha: number,
  bgR: number,
  bgG: number,
  bgB: number,
  noise?: StitchNoiseConfig,
): void {
  for (const pixel of pixels) {
    let r = pixel.r;
    let g = pixel.g;
    let b = pixel.b;
    const x = pixel.x + offsetX;
    const y = pixel.y + offsetY;

    if (noise) {
      const jittered = jitterStitchRgb(r, g, b, x, y, noise);
      if (!jittered) continue;
      [r, g, b] = jittered;
    }

    writeStitchPixel(dst, width, height, x, y, r, g, b, alpha, bgR, bgG, bgB);
  }
}

function depositSandCell(
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  pileHeights: Int16Array,
  floorStart: number,
  cell: StitchCell,
  landX: number,
  bgR: number,
  bgG: number,
  bgB: number,
): void {
  if (cell.pixels.length === 0) return;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const pixel of cell.pixels) {
    minX = Math.min(minX, pixel.x);
    maxX = Math.max(maxX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxY = Math.max(maxY, pixel.y);
  }

  const anchorX = Math.round((minX + maxX) / 2);
  const landCol = clamp(Math.round(landX), 0, width - 1);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const col = clamp(
      landCol + (attempt === 0 ? 0 : attempt === 1 ? -1 : attempt === 2 ? 1 : attempt === 3 ? -2 : 2),
      0,
      width - 1,
    );
    const stack = pileHeights[col] ?? 0;
    const pileBottomY = height - 1 - stack;
    const offsetY = pileBottomY - maxY;
    const offsetX = col - anchorX;

    if (minY + offsetY < floorStart && pileBottomY < height - 2) continue;

    const depth = (height - 1 - pileBottomY) / Math.max(height - floorStart, 1);
    const shade = 1 - depth * 0.12;

    for (const pixel of cell.pixels) {
      const r = Math.round(pixel.r * shade);
      const g = Math.round(pixel.g * shade);
      const b = Math.round(pixel.b * shade);
      writeStitchPixel(
        dst,
        width,
        height,
        pixel.x + offsetX,
        pixel.y + offsetY,
        r,
        g,
        b,
        1,
        bgR,
        bgG,
        bgB,
      );
    }

    pileHeights[col] = stack + 2;
    return;
  }
}

function paintSandCells(
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  cells: readonly StitchCell[],
  bgR: number,
  bgG: number,
  bgB: number,
  options: Pick<
    CrossStitchRenderOptions,
    "drift" | "noise" | "enablePile" | "pileBand" | "ambientMotion"
  >,
): void {
  const drift = clamp(options.drift ?? 0, 0, 1);
  const noise = options.noise;
  const enablePile = options.enablePile !== false;
  const timeMs = noise?.timeMs ?? 0;
  const pileFlush = drift >= 0.98;

  const pileBandRatio = options.pileBand ?? CROSS_STITCH_PILE_BAND;
  const pileMaxDepth = enablePile
    ? Math.max(
        8,
        Math.round(height * pileBandRatio * (0.55 + drift * 0.45)),
      )
    : 0;
  const floorStart = height - pileMaxDepth;
  const pileHeights = enablePile ? new Int16Array(width) : null;

  type CellJob = {
    cell: StitchCell;
    anchor: StitchPixel;
    motion: ReturnType<typeof computeSandMotion>;
    cellDrift: number;
  };

  const jobs: CellJob[] = cells.map((cell) => {
    const anchor = cellAnchor(cell.pixels);
    const cellDrift = cellDriftScale(anchor, drift);
    const motion =
      enablePile && pileHeights
        ? computePileSandMotion(
            anchor,
            cellDrift,
            timeMs,
            floorStart,
            height,
            pileMaxDepth,
          )
        : computeSandMotion(anchor, cellDrift, timeMs);
    return {
      cell,
      anchor,
      motion,
      cellDrift,
    };
  });

  if (enablePile && pileHeights) {
    jobs.sort((a, b) => b.motion.y - a.motion.y);
  }

  for (const job of jobs) {
    if (drift <= 0.001) {
      const windTime = (noise?.timeMs ?? 0) * 0.001;
      const scatterSeed = sampleBlueNoiseTile(
        job.anchor.x * 0.37,
        job.anchor.y * 0.29,
      );
      const isLooseGrain = options.ambientMotion && scatterSeed > 0.74;
      const scatterPhase =
        (windTime * (0.16 + scatterSeed * 0.12) + scatterSeed * 5.7) % 1;
      const scatterArc = isLooseGrain
        ? Math.sin(scatterPhase * Math.PI)
        : 0;
      const wind = options.ambientMotion
        ? sampleBlueNoiseTile(
            job.anchor.x * 0.17 + windTime * 6.5,
            job.anchor.y * 0.21 - windTime * 3.8,
          )
        : 0.5;
      const lift = options.ambientMotion
        ? sampleBlueNoiseTile(
            job.anchor.x * 0.09 - windTime * 2.8,
            job.anchor.y * 0.15 + windTime * 5.2,
          )
        : 0.5;
      paintCellPixels(
        dst,
        width,
        height,
        job.cell.pixels,
        Math.round(
          (wind - 0.5) * 4 +
            scatterArc * (7 + scatterSeed * 18) *
              (scatterSeed > 0.87 ? -1 : 1),
        ),
        Math.round(
          (lift - 0.5) * 3 - scatterArc * (12 + scatterSeed * 36),
        ),
        1,
        bgR,
        bgG,
        bgB,
        noise,
      );
      continue;
    }

    const { grain, x, y, fall } = job.motion;
    const offsetX = x - job.anchor.x;
    const offsetY = y - job.anchor.y;

    if (enablePile && pileHeights) {
      const shouldSettle =
        pileFlush ||
        y >= floorStart ||
        job.cellDrift >= 0.92 ||
        shouldSettleSandGrain(
          job.anchor,
          job.cellDrift,
          grain,
          fall,
          y,
          floorStart,
          height,
        );

      if (shouldSettle) {
        depositSandCell(
          dst,
          width,
          height,
          pileHeights,
          floorStart,
          job.cell,
          x,
          bgR,
          bgG,
          bgB,
        );
        continue;
      }
    }

    const alpha = enablePile
      ? clamp(1 - job.cellDrift * 0.12, 0.55, 1)
      : clamp(1 - job.cellDrift * 1.15, 0, 1);

    if (alpha <= 0.02) continue;

    paintCellPixels(
      dst,
      width,
      height,
      job.cell.pixels,
      offsetX,
      offsetY,
      alpha,
      bgR,
      bgG,
      bgB,
    );
  }
}

function paintStitchPixels(
  dst: Uint8ClampedArray,
  width: number,
  height: number,
  pixels: readonly StitchPixel[],
  bgR: number,
  bgG: number,
  bgB: number,
  options: Pick<CrossStitchRenderOptions, "noise"> = {},
): void {
  const noise = options.noise;

  for (const stitch of pixels) {
    let r = stitch.r;
    let g = stitch.g;
    let b = stitch.b;

    if (noise) {
      const jittered = jitterStitchRgb(r, g, b, stitch.x, stitch.y, noise);
      if (!jittered) continue;
      [r, g, b] = jittered;
    }

    writeStitchPixel(
      dst,
      width,
      height,
      stitch.x,
      stitch.y,
      r,
      g,
      b,
      1,
      bgR,
      bgG,
      bgB,
    );
  }
}

/** Scatter reveal — one pixel at a time. */
export function renderCrossStitchScatter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stitches: readonly StitchPixel[],
  progress: number,
  options: CrossStitchRenderOptions = {},
): void {
  if (width <= 0 || height <= 0) return;

  const { backgroundRgb = [255, 255, 255], noise, drift, enablePile } = options;
  const out = ctx.createImageData(width, height);
  const dst = out.data;
  const [bgR, bgG, bgB] = backgroundRgb;

  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = bgR;
    dst[i + 1] = bgG;
    dst[i + 2] = bgB;
    dst[i + 3] = 255;
  }

  const t = clamp(progress, 0, 1);
  const visible =
    t >= 1
      ? stitches.length
      : Math.min(stitches.length, Math.round(t * stitches.length));

  paintStitchPixels(dst, width, height, stitches.slice(0, visible), bgR, bgG, bgB, {
    noise,
  });

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(out, 0, 0);
}

/** Scatter reveal — one full X (cell) at a time. */
export function renderCrossStitchCellScatter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cells: readonly StitchCell[],
  progress: number,
  options: CrossStitchRenderOptions = {},
): void {
  if (width <= 0 || height <= 0) return;

  const {
    backgroundRgb = [255, 255, 255],
    noise,
    drift,
    enablePile,
    pileBand,
  } = options;
  const out = ctx.createImageData(width, height);
  const dst = out.data;
  const [bgR, bgG, bgB] = backgroundRgb;

  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = bgR;
    dst[i + 1] = bgG;
    dst[i + 2] = bgB;
    dst[i + 3] = 255;
  }

  const t = clamp(progress, 0, 1);
  const visibleCells =
    t >= 1 ? cells.length : Math.min(cells.length, Math.round(t * cells.length));

  const visible = cells.slice(0, visibleCells);
  const driftVal = clamp(drift ?? 0, 0, 1);

  if (driftVal > 0) {
    paintSandCells(dst, width, height, visible, bgR, bgG, bgB, {
      drift: driftVal,
      noise,
      enablePile,
      pileBand,
    });
  } else {
    const pixels: StitchPixel[] = [];
    for (const cell of visible) {
      pixels.push(...cell.pixels);
    }
    paintStitchPixels(dst, width, height, pixels, bgR, bgG, bgB, { noise });
  }

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(out, 0, 0);
}
