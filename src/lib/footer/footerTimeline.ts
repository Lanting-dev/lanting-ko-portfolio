import { clamp, easeOutCubic } from "@/lib/dither/bayer";

export const FOOTER_ANIM_MS = 4800;
export const FOOTER_IMPACT_T = 0.52;

export type FooterTimelineValues = {
  t: number;
  sandProgress: number;
  sandDrift: number;
  ballFall: number;
  ballBouncePx: number;
  ballSquash: number;
  copyOpacity: number;
};

function phase(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp((t - start) / (end - start), 0, 1);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

/** Scroll-triggered footer — sand forms → ball drops → impact scatter → copy. */
export function getFooterTimelineValues(t: number): FooterTimelineValues {
  const clamped = clamp(t, 0, 1);
  const sandProgress = easeOutCubic(phase(clamped, 0, 0.22));
  const ballFall = easeInCubic(phase(clamped, 0.24, FOOTER_IMPACT_T));
  const sandDrift = easeOutCubic(phase(clamped, FOOTER_IMPACT_T, 0.92)) * 0.88;

  const postImpact = phase(clamped, FOOTER_IMPACT_T, 1);
  const ballBouncePx =
    postImpact > 0
      ? Math.sin(postImpact * Math.PI * 2.6) * (1 - postImpact) * 18
      : 0;

  const squashPhase = phase(clamped, FOOTER_IMPACT_T, FOOTER_IMPACT_T + 0.1);
  const ballSquash = squashPhase > 0 ? (1 - squashPhase) * 0.2 : 0;

  const copyOpacity = easeOutCubic(phase(clamped, 0.9, 1));

  return {
    t: clamped,
    sandProgress,
    sandDrift,
    ballFall,
    ballBouncePx,
    ballSquash,
    copyOpacity,
  };
}

export function footerBallOffsetY(
  values: FooterTimelineValues,
  gardenHeightPx: number,
): number {
  const dropSpan = Math.max(gardenHeightPx * 0.62, 120);
  const fallOffset = (1 - values.ballFall) * -dropSpan;
  return fallOffset + values.ballBouncePx;
}
