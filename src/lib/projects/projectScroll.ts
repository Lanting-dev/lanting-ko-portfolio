import { clamp } from "@/lib/dither/bayer";

/** Vertical scroll track height for sticky Work pin (cluster → scatter → detail). */
export const PROJECT_SCROLL_VH = 640;

/** Cards stay clustered until the ball nears Work (~project progress). */
export const PROJECT_SCATTER_START = 0.06;

/** Cards finish flying to corners. */
export const PROJECT_SCATTER_END = 0.28;

/** Sequential centre detail begins after the scatter beat holds. */
export const PROJECT_DETAIL_START = 0.34;

/** Fraction of each project segment used for scatter → detail hero morph. */
export const PROJECT_HOP_MORPH_FRACTION = 0.15;

/** Last portion of project scroll — ball rolls off the final card and falls to profile. */
export const PROJECT_EXIT_SCROLL_FRACTION = 0.24;

/** Map raw project progress to hop-only progress (0→1 across card hops). */
export function mapProjectHopProgress(progress: number): number {
  const hopSpan = 1 - PROJECT_EXIT_SCROLL_FRACTION;
  if (hopSpan <= 0) return 1;
  return clamp(progress / hopSpan, 0, 1);
}

/** 0→1 while the ball rolls off the last card and drops to profile (still in project pin). */
export function computeProjectExitT(progress: number): number {
  const hopSpan = 1 - PROJECT_EXIT_SCROLL_FRACTION;
  if (progress <= hopSpan) return 0;
  return clamp((progress - hopSpan) / PROJECT_EXIT_SCROLL_FRACTION, 0, 1);
}

export function isProjectExitFallActive(exitT: number): boolean {
  return exitT > 0 && exitT < 0.995;
}

export function isProjectExitComplete(exitT: number): boolean {
  return exitT >= 0.995;
}

/** About scroll progress where wall ricochet begins (project rider still holds impact until then). */
export const ABOUT_RICOCHET_SCROLL_START = 0.002;

export function isAboutRicochetScrollActive(aboutProgress: number): boolean {
  return aboutProgress > ABOUT_RICOCHET_SCROLL_START;
}

/** Roll, fall, and hold at profile impact — one continuous project-rider ball. */
export function isProjectEntryBallActive(
  exitT: number,
  _aboutProgress: number,
): boolean {
  return exitT > 0 && exitT < 0.995;
}

/** Left inset before the first card — centers card 1 in the scroll viewport at rest. */
export function getProjectScrollStartPad(
  viewportWidth: number,
  cardWidth: number,
): number {
  return Math.max(0, (viewportWidth - cardWidth) / 2);
}

/** End spacer so the last card can scroll fully into view (left-aligned like the first). */
export function getProjectScrollEndPad(
  viewportWidth: number,
  cardWidth: number,
): number {
  return Math.max(48, viewportWidth - cardWidth);
}

export function getProjectTrackLayout(
  cardCount: number,
  cardWidth: number,
  gap: number,
  viewportWidth: number,
) {
  const startPad = getProjectScrollStartPad(viewportWidth, cardWidth);
  const endPad = getProjectScrollEndPad(viewportWidth, cardWidth);
  const totalWidth =
    startPad +
    cardCount * cardWidth +
    Math.max(0, cardCount - 1) * gap +
    endPad;
  const maxOffset = Math.max(0, totalWidth - viewportWidth);

  return { startPad, endPad, maxOffset };
}

/** Card whose centre is closest to the scroll viewport centre — drives auto-focus. */
export function getFocusedProjectCardIndex(
  hopProgress: number,
  cardCount: number,
  layout: {
    startPad: number;
    maxOffset: number;
    cardWidth: number;
    gap: number;
    viewportWidth: number;
  },
): number {
  const { startPad, maxOffset, cardWidth, gap, viewportWidth } = layout;
  if (cardCount <= 0 || cardWidth <= 0 || viewportWidth <= 0) return 0;

  const offset = clamp(hopProgress, 0, 1) * maxOffset;
  const viewportCenter = viewportWidth / 2;
  let closest = 0;
  let minDist = Infinity;

  for (let i = 0; i < cardCount; i += 1) {
    const cardCenter =
      startPad + i * (cardWidth + gap) + cardWidth / 2 - offset;
    const dist = Math.abs(cardCenter - viewportCenter);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }

  return closest;
}

export function getProjectTrackMetrics(
  cardCount: number,
  cardWidth: number,
  gap: number,
  viewportWidth: number,
  progress: number,
) {
  const { startPad, endPad, maxOffset } = getProjectTrackLayout(
    cardCount,
    cardWidth,
    gap,
    viewportWidth,
  );

  return {
    startPad,
    endPad,
    offset: progress * maxOffset,
  };
}
