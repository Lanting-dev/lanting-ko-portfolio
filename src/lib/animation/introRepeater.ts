import { clamp, easeInOutCubic, easeOutCubic } from "@/lib/dither/bayer";
import {
  INTRO_NAME_LINES,
  type IntroNameMask,
} from "./introNameMask";
import type { HeroIntroTitleLayout } from "./heroTitleLayout";

const BG = "#000000";
const INK = "#f5f5f5";
const INK_GHOST = "rgba(245, 245, 245, 0.12)";
const DEG = Math.PI / 180;
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const TAU = Math.PI * 2;

export const INTRO_COUNT_END = 0.34;
export const INTRO_SHATTER_END = 0.56;
/** Pieces settled on the floor. */
export const INTRO_FALL_END = 0.72;
/** Name fully formed. */
export const INTRO_FORM_END = 0.86;
/** Hold on name before zoom-out. */
export const INTRO_HOLD_END = 0.93;
/** Overlay fade syncs with canvas zoom-out. */
export const INTRO_EXIT_FADE_START =
  INTRO_HOLD_END + (1 - INTRO_HOLD_END) * 0.45;

function easeInOutSine(t: number): number {
  const x = clamp(t, 0, 1);
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function easeInQuad(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x;
}

function flickerHash(i: number, bucket: number): number {
  return (i * 92837111 + bucket * 2654435761) >>> 0;
}

export type IntroGridCell = {
  x: number;
  y: number;
  seed: number;
  burstX: number;
  burstY: number;
};

export type IntroGridCache = {
  cells: IntroGridCell[];
  fontSize: number;
  cellStep: number;
};

export type IntroRenderCache = {
  grid: IntroGridCache;
  name: IntroNameMask;
  nameToGrid: number[];
  nameRow: number[];
  fadeGrid: boolean[];
  nameFontFamily: string;
  nameFontWeight: string;
  titleLayout: HeroIntroTitleLayout | null;
};

function gridLayout(width: number, height: number) {
  const cellW = Math.max(52, Math.min(76, width / 16));
  const cellH = Math.max(38, Math.min(54, height / 14));
  const diag = Math.hypot(width, height);
  const cols = Math.ceil(diag / cellW) + 6;
  const rows = Math.ceil(diag / cellH) + 6;
  return {
    cellW,
    cellH,
    cols,
    rows,
    fontSize: Math.round(cellH * 0.36),
    cellStep: cellW,
  };
}

function burstVector(seed: number, mag: number): { x: number; y: number } {
  const angle = ((seed * 1597334677) >>> 0) / 0xffffffff * TAU;
  const dist = mag * (0.65 + (((seed * 1103515245) >>> 0) % 1000) / 1000);
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
}

export function buildIntroGridCache(
  width: number,
  height: number,
): IntroGridCache {
  const { cellW, cellH, cols, rows, fontSize, cellStep } = gridLayout(
    width,
    height,
  );
  const originX = -((cols - 1) * cellW) / 2;
  const originY = -((rows - 1) * cellH) / 2;
  const burstMag = Math.max(cellW, cellH) * 7.6;
  const cells: IntroGridCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    const rowOffset = (row % 2) * (cellW * 0.5);
    for (let col = 0; col < cols; col += 1) {
      const seed = (row * 4099 + col * 7919) | 0;
      const burst = burstVector(seed, burstMag);
      cells.push({
        x: originX + col * cellW + rowOffset,
        y: originY + row * cellH,
        seed,
        burstX: burst.x,
        burstY: burst.y,
      });
    }
  }

  return { cells, fontSize, cellStep };
}

/** Resting floor positions (center-relative) after burst + fall. */
export function gridCellFloorPositions(
  cells: ReadonlyArray<IntroGridCell>,
  width: number,
  height: number,
): { x: number; y: number }[] {
  const maxDist = gridMaxDist([...cells]);
  const rest = burstFallMotion(INTRO_FALL_END);
  return cells.map((cell) =>
    cellBurstFallAt(cell, rest.burstT, rest.fallT, maxDist, width, height),
  );
}

function formatPercent(motion: number): string {
  const n = Math.max(0, Math.min(100, Math.round(motion * 100)));
  return `${String(n).padStart(3, "0")}%`;
}

function countMotion(linear: number) {
  const t = clamp(linear / INTRO_COUNT_END, 0, 1);
  const motion = easeInOutSine(t);
  const bloom = easeOutCubic(t);
  return {
    opacity: t < 0.05 ? 0 : easeOutCubic(Math.min((t - 0.05) / 0.14, 1)),
    scale: 0.42 + bloom * 0.58,
    angle: (-10 + motion * 24) * DEG,
    percent: motion,
    /** 0→1: how far from center the grid has grown. */
    fill: easeOutCubic(Math.max(0, (t - 0.08) / 0.92)),
  };
}

/** 0→1 across burst + gravity fall (no opacity dip between phases). */
function burstFallProgress(linear: number): number {
  return clamp(
    (linear - INTRO_COUNT_END) / (INTRO_FALL_END - INTRO_COUNT_END),
    0,
    1,
  );
}

function burstFallMotion(linear: number) {
  const u = burstFallProgress(linear);
  const burstT = easeOutCubic(Math.min(u / 0.4, 1));
  const fallT = easeInQuad(clamp((u - 0.34) / 0.66, 0, 1));
  const end = countMotion(INTRO_COUNT_END);
  const pop = u < 0.06 ? 1 + u * 0.28 : 1.01;

  return {
    burstT,
    fallT,
    angle: end.angle * (1 - burstT) * 0.35,
    scale: end.scale * pop,
  };
}

function formMotion(linear: number) {
  const t = clamp(
    (linear - INTRO_FALL_END) / (INTRO_FORM_END - INTRO_FALL_END),
    0,
    1,
  );
  const run = easeInOutCubic(t);
  return {
    run,
    scale: 0.96 + run * 0.06,
  };
}

type Vec2 = { x: number; y: number };

function gridMaxDist(cells: IntroGridCell[]): number {
  let maxDist = 1;
  for (const cell of cells) {
    maxDist = Math.max(maxDist, Math.hypot(cell.x, cell.y));
  }
  return maxDist;
}

function floorYRel(height: number): number {
  return height * 0.36;
}

function cellShatterAt(
  cell: IntroGridCell,
  burstT: number,
  maxDist: number,
): Vec2 {
  const distNorm = Math.hypot(cell.x, cell.y) / maxDist;
  const localT = clamp((burstT * 1.12 - distNorm * 0.22) / 0.88, 0, 1);
  const localBurst = easeOutCubic(localT);
  const spread = localBurst * (0.9 + (cell.seed % 17) / 26);
  return {
    x: cell.x + cell.burstX * spread,
    y: cell.y + cell.burstY * spread,
  };
}

function cellBurstFallAt(
  cell: IntroGridCell,
  burstT: number,
  fallT: number,
  maxDist: number,
  width: number,
  height: number,
): Vec2 {
  const shatterPos = cellShatterAt(cell, burstT, maxDist);
  const floorPos = cellFloorAt(cell, shatterPos, width, height);
  if (fallT <= 0) return shatterPos;
  return cellFallAt(shatterPos, floorPos, fallT);
}

function cellFloorAt(
  cell: IntroGridCell,
  shatterPos: Vec2,
  width: number,
  height: number,
): Vec2 {
  const floorY = floorYRel(height);
  const jitterX = (((cell.seed * 1103515245) >>> 0) % 1000) / 1000 - 0.5;
  const stack = ((cell.seed * 7919) >>> 0) % 7;
  const restX = clamp(
    shatterPos.x + jitterX * 16,
    -width * 0.42,
    width * 0.42,
  );
  return { x: restX, y: floorY - stack };
}

function cellFallAt(shatterPos: Vec2, floorPos: Vec2, drop: number): Vec2 {
  const y = shatterPos.y + (floorPos.y - shatterPos.y) * easeInQuad(drop);
  const x = shatterPos.x + (floorPos.x - shatterPos.x) * easeOutCubic(drop);
  return { x, y };
}

function exitZoomMotion(linear: number) {
  const t = clamp(
    (linear - INTRO_HOLD_END) / (1 - INTRO_HOLD_END),
    0,
    1,
  );
  const zoom = 1 + easeOutCubic(t) * 0.22;
  const fade = smoothstep((t - 0.5) / 0.5);
  return { zoom, alpha: 1 - fade };
}

const RUN_FRAME_MS = 58;

function cellDigit(cell: IntroGridCell, timeMs: number): string {
  const frame = Math.floor(timeMs / RUN_FRAME_MS);
  return DIGITS[flickerHash(cell.seed, frame) % 10]!;
}

function isNameGridCell(cache: IntroRenderCache, gi: number): boolean {
  return !cache.fadeGrid[gi];
}

function drawNameTypography(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  alpha: number,
) {
  if (alpha <= 0.01) return;

  const { fontSize, lineGap, letterSpacing } = cache.name.layout;
  const layout = cache.titleLayout;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = INK;
  setNameFont(
    ctx,
    fontSize,
    cache.nameFontFamily,
    cache.nameFontWeight,
  );
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
    letterSpacing;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (layout && layout.lineCenters.length >= INTRO_NAME_LINES.length) {
    for (let i = 0; i < INTRO_NAME_LINES.length; i += 1) {
      const center = layout.lineCenters[i]!;
      ctx.fillText(INTRO_NAME_LINES[i]!, center.x, center.y);
    }
    ctx.restore();
    return;
  }

  const blockH =
    fontSize * INTRO_NAME_LINES.length +
    lineGap * (INTRO_NAME_LINES.length - 1);
  let y = height / 2 - blockH / 2 + fontSize / 2;
  for (const line of INTRO_NAME_LINES) {
    ctx.fillText(line, width / 2, y);
    y += fontSize + lineGap;
  }

  ctx.restore();
}

function toCenterRelative(
  x: number,
  y: number,
  width: number,
  height: number,
): { x: number; y: number } {
  return { x: x - width / 2, y: y - height / 2 };
}

function setGridFont(ctx: CanvasRenderingContext2D, fontSize: number) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${fontSize}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`;
}

function setNameFont(
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
}

function drawCountPhase(
  ctx: CanvasRenderingContext2D,
  cache: IntroGridCache,
  width: number,
  height: number,
  linear: number,
) {
  const { opacity, scale, angle, percent, fill } = countMotion(linear);
  if (opacity <= 0.001 || fill <= 0.001) return;

  let maxDist = 1;
  for (const cell of cache.cells) {
    maxDist = Math.max(maxDist, Math.hypot(cell.x, cell.y));
  }

  const label = formatPercent(percent);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  setGridFont(ctx, cache.fontSize);
  ctx.fillStyle = INK;

  for (const cell of cache.cells) {
    const dist = Math.hypot(cell.x, cell.y) / maxDist;
    const appear = smoothstep((fill - dist * 0.92) / 0.22);
    if (appear <= 0.01) continue;

    ctx.globalAlpha = opacity * appear;
    const cellScale = 0.55 + appear * 0.45;
    ctx.save();
    ctx.translate(cell.x, cell.y);
    ctx.scale(cellScale, cellScale);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function drawBurstFallPhase(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  linear: number,
  timeMs: number,
) {
  const { burstT, fallT, angle, scale } = burstFallMotion(linear);
  const { cells } = cache.grid;
  const maxDist = gridMaxDist(cells);
  const u = burstFallProgress(linear);
  const cullExtras = smoothstep((u - 0.2) / 0.22);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  setGridFont(ctx, cache.grid.fontSize);

  for (let gi = 0; gi < cells.length; gi += 1) {
    const cell = cells[gi]!;
    if (!isNameGridCell(cache, gi)) {
      if (cullExtras >= 0.98) continue;
    }

    const pos = cellBurstFallAt(cell, burstT, fallT, maxDist, width, height);
    const glitch = flickerHash(cell.seed, Math.floor(timeMs / 58));
    const distNorm = Math.hypot(cell.x, cell.y) / maxDist;
    const nearCore = distNorm < 0.18;
    const char =
      nearCore && u < 0.12
        ? "100%"
        : cellDigit(cell, timeMs);
    const localBurst = clamp((burstT * 1.12 - distNorm * 0.22) / 0.88, 0, 1);
    const cellScale = 1 - easeOutCubic(localBurst) * 0.12;
    let alpha = 0.92 + ((glitch % 9) / 9) * 0.08;
    if (!isNameGridCell(cache, gi)) {
      alpha *= 1 - cullExtras;
      if (alpha <= 0.02) continue;
    }

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(((glitch % 5) - 2) * 0.03 * localBurst);
    ctx.scale(cellScale, cellScale);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = INK;
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function drawFormGlyphs(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  run: number,
  timeMs: number,
  alpha: number,
) {
  if (alpha <= 0.02) return;

  const { cells } = cache.grid;
  const rest = burstFallMotion(INTRO_FALL_END);
  const maxDist = gridMaxDist(cells);
  const maxRow = Math.max(0, ...cache.nameRow);
  const glyphSize = cache.name.clusterFontSize;

  setGridFont(ctx, glyphSize);

  for (let ni = 0; ni < cache.name.points.length; ni += 1) {
    const gi = cache.nameToGrid[ni];
    if (gi == null || gi < 0) continue;

    const cell = cells[gi]!;
    const row = cache.nameRow[ni] ?? 0;
    const liftRow = maxRow - row;
    const rowT = clamp((run - (liftRow / (maxRow + 1)) * 0.34) / 0.66, 0, 1);
    const floorPos = cellBurstFallAt(
      cell,
      rest.burstT,
      rest.fallT,
      maxDist,
      width,
      height,
    );
    const target = toCenterRelative(
      cache.name.points[ni]!.x,
      cache.name.points[ni]!.y,
      width,
      height,
    );
    const lift = easeInOutCubic(rowT);
    const x = floorPos.x + (target.x - floorPos.x) * lift;
    const y = floorPos.y + (target.y - floorPos.y) * lift;
    const settle = clamp((run - (liftRow / (maxRow + 1)) * 0.28) / 0.72, 0, 1);

    ctx.globalAlpha = alpha * (0.72 + settle * 0.28);
    ctx.fillStyle = INK;
    ctx.fillText(cellDigit(cell, timeMs), x, y);
  }
}

function drawFormPhase(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  linear: number,
  timeMs: number,
) {
  const { run, scale } = formMotion(linear);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);
  drawFormGlyphs(ctx, cache, width, height, run, timeMs, 1);
  ctx.restore();
}

function drawRunningName(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  groupScale: number,
  groupAlpha: number,
) {
  const pivot = cache.titleLayout?.blockCenter ?? { x: width / 2, y: height / 2 };

  ctx.save();
  ctx.translate(pivot.x, pivot.y);
  ctx.scale(groupScale, groupScale);
  ctx.translate(-pivot.x, -pivot.y);
  drawNameTypography(ctx, cache, width, height, groupAlpha);
  ctx.restore();
}

function drawHoldPhase(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  linear: number,
) {
  const holdT = clamp(
    (linear - INTRO_FORM_END) / (INTRO_HOLD_END - INTRO_FORM_END),
    0,
    1,
  );
  const typoAlpha = smoothstep(holdT / 0.55);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  drawFormGlyphs(ctx, cache, width, height, 1, 0, Math.max(0, 1 - typoAlpha * 1.35));
  ctx.restore();

  drawNameTypography(ctx, cache, width, height, typoAlpha);
}

function drawExitZoomPhase(
  ctx: CanvasRenderingContext2D,
  cache: IntroRenderCache,
  width: number,
  height: number,
  linear: number,
) {
  const { zoom, alpha } = exitZoomMotion(linear);
  if (alpha <= 0.01) return;
  drawRunningName(ctx, cache, width, height, zoom, alpha);
}

export function renderIntroRepeater(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  linear: number,
  timeMs: number,
  cache: IntroRenderCache | null,
): void {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, width, height);
  if (!cache) return;

  if (linear < INTRO_COUNT_END) {
    drawCountPhase(ctx, cache.grid, width, height, linear);
    return;
  }

  if (linear < INTRO_FALL_END) {
    drawBurstFallPhase(ctx, cache, width, height, linear, timeMs);
    return;
  }

  if (linear < INTRO_FORM_END) {
    drawFormPhase(ctx, cache, width, height, linear, timeMs);
    return;
  }

  if (linear < INTRO_HOLD_END) {
    drawHoldPhase(ctx, cache, width, height, linear);
    return;
  }

  drawExitZoomPhase(ctx, cache, width, height, linear);
}
