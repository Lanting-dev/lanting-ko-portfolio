import { rasterizeDisplayText } from "@/lib/dither/rasterizeDisplayText";
import {
  alignPointsToCenter,
  HERO_INTRO_TITLE_LINES,
  HERO_TITLE_LETTER_SPACING,
  type HeroIntroTitleLayout,
} from "./heroTitleLayout";

export const INTRO_NAME_LINES = HERO_INTRO_TITLE_LINES;

const INK_LUM = 232;
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export type IntroNamePoint = {
  x: number;
  y: number;
  glyph: string;
};

export type IntroNameLayout = {
  fontSize: number;
  lineGap: number;
  letterSpacing: string;
};

export type IntroNameMask = {
  points: IntroNamePoint[];
  layout: IntroNameLayout;
  clusterFontSize: number;
};

type CharRegion = {
  glyph: string;
  lineIndex: number;
  cx: number;
  cy: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

function lineIndexForY(
  y: number,
  lineCenters?: ReadonlyArray<{ x: number; y: number }>,
  fallbackSplitY?: number,
): number {
  if (lineCenters && lineCenters.length >= 2) {
    const splitY = (lineCenters[0]!.y + lineCenters[1]!.y) / 2;
    return y >= splitY ? 1 : 0;
  }
  if (fallbackSplitY != null) return y >= fallbackSplitY ? 1 : 0;
  return 0;
}

function subsamplePoints(
  points: IntroNamePoint[],
  maxCount: number,
): IntroNamePoint[] {
  if (points.length <= maxCount) return points;
  const out: IntroNamePoint[] = [];
  const stride = points.length / maxCount;
  for (let i = 0; i < maxCount; i += 1) {
    out.push(points[Math.floor(i * stride)]!);
  }
  return out;
}

function parseLetterSpacingPx(letterSpacing: string, fontSize: number): number {
  const trimmed = letterSpacing.trim();
  if (trimmed.endsWith("em")) {
    return parseFloat(trimmed) * fontSize;
  }
  if (trimmed.endsWith("px")) {
    return parseFloat(trimmed);
  }
  return 0;
}

function snapNamePointsToHeroLines(
  points: IntroNamePoint[],
  heroLayout: HeroIntroTitleLayout,
): IntroNamePoint[] {
  const { lineCenters } = heroLayout;
  if (lineCenters.length < 2 || points.length === 0) return points;

  const splitY = (lineCenters[0]!.y + lineCenters[1]!.y) / 2;
  const groups: IntroNamePoint[][] = [[], []];
  for (const p of points) {
    groups[p.y < splitY ? 0 : 1]!.push(p);
  }

  const shifts = groups.map((group, li) => {
    if (group.length === 0) return { dx: 0, dy: 0 };
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const g of group) {
      minX = Math.min(minX, g.x);
      maxX = Math.max(maxX, g.x);
      minY = Math.min(minY, g.y);
      maxY = Math.max(maxY, g.y);
    }
    const target = lineCenters[li]!;
    return {
      dx: target.x - (minX + maxX) / 2,
      dy: target.y - (minY + maxY) / 2,
    };
  });

  return points.map((p) => {
    const li = p.y < splitY ? 0 : 1;
    const { dx, dy } = shifts[li]!;
    return { ...p, x: p.x + dx, y: p.y + dy };
  });
}

function centerNamePoints(
  points: IntroNamePoint[],
  width: number,
  height: number,
  anchor?: { x: number; y: number },
): IntroNamePoint[] {
  if (points.length === 0) return points;

  const cx = anchor?.x ?? width / 2;
  const cy = anchor?.y ?? height / 2;
  const shifted = alignPointsToCenter(points, cx, cy);

  return points.map((p, i) => ({
    ...p,
    x: shifted[i]!.x,
    y: shifted[i]!.y,
  }));
}

function bucketPoints(
  points: IntroNamePoint[],
  cellPx: number,
  maxKeep: number,
): IntroNamePoint[] {
  const buckets = new Map<string, IntroNamePoint>();
  for (const p of points) {
    const key = `${Math.floor(p.x / cellPx)},${Math.floor(p.y / cellPx)}`;
    if (!buckets.has(key)) buckets.set(key, p);
  }
  const deduped = [...buckets.values()];
  if (deduped.length <= maxKeep) return deduped;
  return subsamplePoints(deduped, maxKeep);
}

function buildCharRegions(
  lines: readonly string[],
  cssW: number,
  fontSize: number,
  lineGap: number,
  fontFamily: string,
  fontWeight: string,
  letterSpacing: string,
  padY: number,
  offsetX: number,
  offsetY: number,
  lineCenters?: ReadonlyArray<{ x: number; y: number }>,
): CharRegion[] {
  if (typeof document === "undefined") return [];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const charGap = parseLetterSpacingPx(letterSpacing, fontSize);

  const regions: CharRegion[] = [];
  let y = padY;

  for (let li = 0; li < lines.length; li += 1) {
    const line = lines[li]!;
    const upper = line.toUpperCase();
    const chars = [...upper].filter((ch) => ch !== " ");
    const lineWidth = chars.reduce((sum, ch, i) => {
      const w = ctx.measureText(ch).width;
      return sum + w + (i < chars.length - 1 ? charGap : 0);
    }, 0);
    const lineCenterX = lineCenters?.[li]?.x ?? offsetX + cssW / 2;
    const lineCenterY =
      lineCenters?.[li]?.y ?? offsetY + y + fontSize * 0.52;
    let x = lineCenterX - lineWidth / 2;

    for (const ch of chars) {
      const w = ctx.measureText(ch).width;
      const left = x;
      const right = x + w;
      const top = lineCenterY - fontSize * 0.48;
      const bottom = lineCenterY + fontSize * 0.48;
      regions.push({
        glyph: ch,
        lineIndex: li,
        cx: x + w / 2,
        cy: lineCenterY,
        left,
        right,
        top,
        bottom,
      });
      x += w + charGap;
    }

    y += fontSize + lineGap;
  }

  return regions;
}

function glyphForPoint(
  x: number,
  y: number,
  regions: CharRegion[],
  lineCenters?: ReadonlyArray<{ x: number; y: number }>,
): string {
  const li = lineIndexForY(y, lineCenters);
  const onLine = regions.filter((region) => region.lineIndex === li);
  if (onLine.length === 0) return "0";

  for (const region of onLine) {
    if (
      x >= region.left &&
      x <= region.right &&
      y >= region.top &&
      y <= region.bottom
    ) {
      return region.glyph;
    }
  }

  let best = onLine[0]!.glyph;
  let bestD = Infinity;
  for (const region of onLine) {
    const d = Math.hypot(x - region.cx, y - region.cy);
    if (d < bestD) {
      bestD = d;
      best = region.glyph;
    }
  }
  return best;
}

function reassignPointGlyphs(
  points: IntroNamePoint[],
  regions: CharRegion[],
  heroLayout: HeroIntroTitleLayout,
): IntroNamePoint[] {
  return points.map((p) => ({
    ...p,
    glyph: glyphForPoint(p.x, p.y, regions, heroLayout.lineCenters),
  }));
}

/** Rasterize display name → viewport points with correct per-letter glyphs. */
export async function buildIntroNameMask(
  width: number,
  height: number,
  fontFamily: string,
  fontWeight: string,
  maxPoints: number,
  cellStep: number,
  heroLayout?: HeroIntroTitleLayout | null,
): Promise<IntroNameMask | null> {
  if (width < 32 || height < 32) return null;

  const letterSpacing = heroLayout?.letterSpacing ?? HERO_TITLE_LETTER_SPACING;
  const maxKeep = Math.min(maxPoints, 380);
  const heroFont = heroLayout?.fontSize ?? Math.round(Math.min(width * 0.2, height * 0.3));
  const maskCellPx = Math.max(
    7,
    Math.round(heroFont * (heroLayout ? 0.062 : cellStep * 0.18)),
  );
  let sampleStep = 3;
  let fontSize = heroFont;
  const lineGap = heroLayout?.lineGap ?? Math.round(maskCellPx * 2.4);
  const cssW = Math.round(heroLayout?.blockRect.width ?? width * 0.9);
  const anchor = heroLayout?.blockCenter;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const cssH = Math.round(
      heroLayout?.blockRect.height ??
        fontSize * INTRO_NAME_LINES.length +
          lineGap * (INTRO_NAME_LINES.length - 1) +
          sampleStep * 2,
    );
    const pad = Math.max(2, Math.round(sampleStep));
    const offsetX = heroLayout?.blockRect.x ?? (width - cssW) / 2;
    const offsetY = heroLayout?.blockRect.y ?? (height - cssH) / 2;

    const data = await rasterizeDisplayText({
      lines: [...INTRO_NAME_LINES],
      cssW,
      cssH,
      fontSizePx: fontSize,
      fontFamily,
      letterSpacing,
      lineGapPx: lineGap,
      fontWeight,
      padX: pad,
      padY: pad,
      textAlign: "center",
    });

    if (!data) return null;

    const regions = buildCharRegions(
      INTRO_NAME_LINES,
      cssW,
      fontSize,
      lineGap,
      fontFamily,
      fontWeight,
      letterSpacing,
      pad,
      offsetX,
      offsetY,
      heroLayout?.lineCenters,
    );
    if (regions.length === 0) return null;

    const { width: bufferW, height: bufferH, data: px } = data;
    const points: IntroNamePoint[] = [];

    for (let y = 0; y < bufferH; y += sampleStep) {
      for (let x = 0; x < bufferW; x += sampleStep) {
        const i = (y * bufferW + x) * 4;
        const lum = (px[i]! + px[i + 1]! + px[i + 2]!) / 3;
        if (lum >= INK_LUM) continue;

        const vx = offsetX + (x / bufferW) * cssW;
        const vy = offsetY + (y / bufferH) * cssH;
        points.push({
          x: vx,
          y: vy,
          glyph: glyphForPoint(vx, vy, regions, heroLayout?.lineCenters),
        });
      }
    }

    if (points.length > 40) {
      const dense = bucketPoints(points, maskCellPx, maxKeep);
      if (dense.length >= 80) {
        let aligned = centerNamePoints(dense, width, height, anchor);
        if (heroLayout) {
          aligned = snapNamePointsToHeroLines(aligned, heroLayout);
          aligned = reassignPointGlyphs(aligned, regions, heroLayout);
        }
        return {
          points: aligned,
          layout: { fontSize, lineGap, letterSpacing },
          clusterFontSize: Math.max(
            8,
            Math.round(maskCellPx * (heroLayout ? 0.92 : 0.82)),
          ),
        };
      }
    }

    sampleStep = Math.max(3, sampleStep - 1);
    fontSize = Math.round(fontSize * 1.04);
  }

  return null;
}

/** Greedy nearest-neighbor: each name point flies from one unique grid cell. */
export function pairNameToGrid(
  gridPositions: ReadonlyArray<{ x: number; y: number }>,
  namePoints: ReadonlyArray<IntroNamePoint>,
  width: number,
  height: number,
  lineCenters?: ReadonlyArray<{ x: number; y: number }>,
): { nameToGrid: number[]; fadeGrid: boolean[] } {
  const cx = width / 2;
  const cy = height / 2;
  const usedGrid = new Set<number>();
  const nameToGrid = new Array<number>(namePoints.length).fill(-1);

  let splitY: number | undefined;
  if (!lineCenters || lineCenters.length < 2) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of namePoints) {
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    splitY = (minY + maxY) / 2;
  }

  const order = namePoints
    .map((p, i) => ({
      i,
      y: p.y,
      x: p.x,
      li: lineIndexForY(p.y, lineCenters, splitY),
    }))
    .sort((a, b) => a.li - b.li || a.y - b.y || a.x - b.x)
    .map((entry) => entry.i);

  for (const ni of order) {
    const target = namePoints[ni]!;
    const tx = target.x - cx;
    const ty = target.y - cy;
    let best = -1;
    let bestScore = Infinity;

    for (let gi = 0; gi < gridPositions.length; gi += 1) {
      if (usedGrid.has(gi)) continue;
      const g = gridPositions[gi]!;
      const score = Math.hypot(g.x - tx, g.y - ty);
      if (score < bestScore) {
        bestScore = score;
        best = gi;
      }
    }

    if (best >= 0) {
      usedGrid.add(best);
      nameToGrid[ni] = best;
    }
  }

  const fadeGrid = gridPositions.map((_, i) => !usedGrid.has(i));
  return { nameToGrid, fadeGrid };
}

/** Top→bottom row index for aino-style run-in. */
export function buildNameRowOrder(
  namePoints: ReadonlyArray<IntroNamePoint>,
  height: number,
): number[] {
  if (namePoints.length === 0) return [];

  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of namePoints) {
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const span = Math.max(1, maxY - minY);
  const bands = Math.max(8, Math.round(height / 64));

  return namePoints.map((p) =>
    Math.min(bands - 1, Math.floor(((p.y - minY) / span) * bands)),
  );
}

export const INTRO_SORA_WEIGHT = "800";
export const INTRO_NAME_FONT_FAMILY = "Sora, system-ui, sans-serif";

/** Always Sora ExtraBold for intro lettering (not locale display font). */
export async function readIntroSoraFont(): Promise<{
  fontFamily: string;
  fontWeight: string;
}> {
  const fontFamily = INTRO_NAME_FONT_FAMILY;
  const fontWeight = INTRO_SORA_WEIGHT;

  if (typeof document !== "undefined" && document.fonts?.load) {
    try {
      await document.fonts.load(`${fontWeight} 72px ${fontFamily}`);
    } catch {
      // Sora may already be ready via next/font.
    }
  }

  return { fontFamily, fontWeight };
}
