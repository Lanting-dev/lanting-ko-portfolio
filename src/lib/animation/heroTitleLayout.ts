/** Shared hero / intro title spec — keep in sync for seamless handoff. */
export const HERO_INTRO_TITLE_LINES = ["LAN TING", "KO"] as const;
export const HERO_TITLE_LETTER_SPACING = "-0.04em";
export const HERO_TITLE_ROW_GAP_EM = 0.2;
export const HERO_TITLE_FIT_TEXT = "LAN TING";
export const HERO_TITLE_FIT_RATIO = 0.9;

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
