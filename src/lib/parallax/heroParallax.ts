import { clamp, lerpKeyframes } from "@/lib/parallax/interpolate";

/**
 * Full scroll track progress 0→1
 * 0.00 to 0.10  title peek (minimal scroll)
 * 0.10 to 0.32  brief hold before ball detach
 * 0.32 to 1.00  ball drops out of the "O" toward Work
 */
export const PARALLAX_PHASE = {
  riseEnd: 0,
  fallEnd: 0.1,
  morphEnd: 0.32,
  landEnd: 1,
} as const;

export const HERO_PARALLAX = {
  splitOpacity: { 0: 0, 1: 0 },
  rowGapEm: { 0: 0.2, 1: 0.2 },
  titleScale: { 0: 1, 1: 1 },
  titleYOffset: { 0: 0, 1: 0 },
} as const;

export type HeroParallaxValues = {
  splitOpacity: number;
  rowGapEm: number;
  titleScale: number;
  titleYOffset: number;
  /** 0 → ball rests in the "O"; >0 → ball detaches and falls toward card 1. */
  fallPhase: number;
};

export function getHeroParallaxValues(progress: number): HeroParallaxValues {
  const p = clamp(progress, 0, 1);

  return {
    splitOpacity: lerpKeyframes(HERO_PARALLAX.splitOpacity, p),
    rowGapEm: lerpKeyframes(HERO_PARALLAX.rowGapEm, p),
    titleScale: lerpKeyframes(HERO_PARALLAX.titleScale, p),
    titleYOffset: lerpKeyframes(HERO_PARALLAX.titleYOffset, p),
    fallPhase: clamp(
      (p - PARALLAX_PHASE.morphEnd) /
        (PARALLAX_PHASE.landEnd - PARALLAX_PHASE.morphEnd),
      0,
      1,
    ),
  };
}
