import { clamp } from "@/lib/dither/bayer";

/** Vertical scroll track height for sticky horizontal project scrub */
export const PROJECT_SCROLL_VH = 450;

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

/** Left inset before the first card — flush with the padded content edge. */
export function getProjectScrollStartPad(
  _viewportWidth: number,
  _cardWidth: number,
): number {
  return 0;
}

/** End spacer so the last card can scroll fully into view (left-aligned like the first). */
export function getProjectScrollEndPad(
  viewportWidth: number,
  cardWidth: number,
): number {
  return Math.max(48, viewportWidth - cardWidth);
}

export function getProjectTrackMetrics(
  cardCount: number,
  cardWidth: number,
  gap: number,
  viewportWidth: number,
  progress: number,
) {
  const startPad = getProjectScrollStartPad(viewportWidth, cardWidth);
  const endPad = getProjectScrollEndPad(viewportWidth, cardWidth);
  const totalWidth =
    startPad +
    cardCount * cardWidth +
    Math.max(0, cardCount - 1) * gap +
    endPad;
  const maxOffset = Math.max(0, totalWidth - viewportWidth);

  return {
    startPad,
    endPad,
    offset: progress * maxOffset,
  };
}
