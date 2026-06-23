import { clamp, easeOutCubic } from "@/lib/dither/bayer";

/** Scroll track after About — ball lands in sand, stitch scatters. */
export const FOOTER_SCROLL_VH = 150;

export const FOOTER_IMPACT_PROGRESS = 0.52;

/** Footer ball rider takes over once the scroll track has started scrubbing. */
export const FOOTER_BALL_HANDOFF = 0.08;

export type FooterScrollValues = {
  progress: number;
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

export function getFooterScrollValues(progress: number): FooterScrollValues {
  const p = clamp(progress, 0, 1);
  const sandProgress = easeOutCubic(phase(p, 0, 0.18));
  const ballFall = easeInCubic(phase(p, 0.08, FOOTER_IMPACT_PROGRESS));
  const sandDrift = easeOutCubic(phase(p, FOOTER_IMPACT_PROGRESS, 0.88)) * 0.88;

  const postImpact = phase(p, FOOTER_IMPACT_PROGRESS, 1);
  const ballBouncePx =
    postImpact > 0
      ? Math.sin(postImpact * Math.PI * 2.6) * (1 - postImpact) * 16
      : 0;

  const squashPhase = phase(p, FOOTER_IMPACT_PROGRESS, FOOTER_IMPACT_PROGRESS + 0.1);
  const ballSquash = squashPhase > 0 ? (1 - squashPhase) * 0.2 : 0;

  const copyOpacity = easeOutCubic(phase(p, 0.86, 1));

  return {
    progress: p,
    sandProgress,
    sandDrift,
    ballFall,
    ballBouncePx,
    ballSquash,
    copyOpacity,
  };
}
