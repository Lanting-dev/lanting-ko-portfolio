/** Shared hero / intro title spec , keep in sync for seamless handoff. */
export const HERO_INTRO_TITLE_LINES = ["LAN TING", "KO"] as const;
export const HERO_TITLE_LETTER_SPACING = "0";
export const HERO_TITLE_ROW_GAP_EM = 0.2;
export const HERO_TITLE_FIT_TEXT = "LAN TING";
/** > 1 so "LAN TING" runs past both edges and the L and G are cut by them. */
export const HERO_TITLE_FIT_RATIO = 0.995;

/**
 * Safety valve, not a layout knob. The fit is width-driven, so on an extreme
 * aspect the name would grow taller than the screen it is meant to sit in.
 * Keep it loose , the full-bleed name is the composition's spine, and capping
 * it tight enough to buy room below just leaves it stranded mid-width with the
 * edges no longer cut. Room comes out of `--hero-band` instead.
 */
export const HERO_TITLE_MAX_HEIGHT_RATIO = 0.42;

export type HeroTitleMetrics = {
  /** Baseline to ink top , the real cap height, not a guessed em fraction. */
  capHeight: number;
  /** Line box top to ink top, including the negative half-leading. */
  inkTopInset: number;
  /** Baseline to line box bottom. */
  baselineToBoxBottom: number;
};

/**
 * Real metrics for the resolved title font. Every em-fraction estimate of these
 * has been wrong by enough to shear the caps or float "KO" off the fold, so
 * measure rather than assume.
 */
export function measureHeroTitleMetrics(
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  lineHeight: number,
): HeroTitleMetrics | null {
  if (typeof document === "undefined" || !(fontSize > 0)) return null;

  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const m = ctx.measureText(HERO_TITLE_FIT_TEXT);
  const ascent = m.fontBoundingBoxAscent;
  const descent = m.fontBoundingBoxDescent;
  const capHeight = m.actualBoundingBoxAscent;
  if (!Number.isFinite(ascent) || !Number.isFinite(capHeight)) return null;

  // Half-leading is negative whenever line-height < the font's natural extent,
  // which is exactly the case here (0.78), so the ink overruns the box.
  const halfLeading = (fontSize * lineHeight - (ascent + descent)) / 2;

  return {
    capHeight,
    inkTopInset: halfLeading + ascent - capHeight,
    baselineToBoxBottom: halfLeading + descent,
  };
}

export type HeroIntroTitleLayout = {
  lines: readonly string[];
  fontSize: number;
  lineGap: number;
  letterSpacing: string;
  /** Viewport coordinates (canvas space). */
  lineCenters: { x: number; y: number }[];
  blockCenter: { x: number; y: number };
  blockRect: { x: number; y: number; width: number; height: number };
};


/** Measure live hero title in the DOM (viewport coords). */
export function readHeroIntroTitleLayout(): HeroIntroTitleLayout | null {
  if (typeof document === "undefined") return null;

  const h1 = document.querySelector<HTMLElement>(
    "[data-hero-intro-title] h1",
  );
  if (!h1) return null;

  const lineEls = h1.querySelectorAll<HTMLElement>("[data-hero-intro-line]");
  if (lineEls.length < HERO_INTRO_TITLE_LINES.length) return null;

  const computed = getComputedStyle(h1);
  const fontSize = parseFloat(computed.fontSize);
  if (!Number.isFinite(fontSize) || fontSize < 12) return null;

  const lineCenters: { x: number; y: number }[] = [];
  const lineRects: DOMRect[] = [];
  for (const lineEl of lineEls) {
    const rect = lineEl.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;
    lineRects.push(rect);
    lineCenters.push({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  const blockRect = h1.getBoundingClientRect();
  if (blockRect.width < 1 || blockRect.height < 1) return null;

  const lineGap =
    lineRects.length >= 2
      ? Math.max(0, lineRects[1]!.top - lineRects[0]!.bottom)
      : HERO_TITLE_ROW_GAP_EM * fontSize;

  return {
    lines: HERO_INTRO_TITLE_LINES,
    fontSize,
    lineGap,
    letterSpacing: HERO_TITLE_LETTER_SPACING,
    lineCenters,
    blockCenter: {
      x: blockRect.left + blockRect.width / 2,
      y: blockRect.top + blockRect.height / 2,
    },
    blockRect: {
      x: blockRect.left,
      y: blockRect.top,
      width: blockRect.width,
      height: blockRect.height,
    },
  };
}

export function alignPointsToCenter(
  points: { x: number; y: number }[],
  cx: number,
  cy: number,
): { x: number; y: number }[] {
  if (points.length === 0) return points;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const shiftX = cx - (minX + maxX) / 2;
  const shiftY = cy - (minY + maxY) / 2;

  return points.map((p) => ({
    x: p.x + shiftX,
    y: p.y + shiftY,
  }));
}
