import { clamp, lerpKeyframes } from "@/lib/parallax/interpolate";

/**
 * Full scroll track progress 0→1
 * 0.00–0.48  title holds
 * 0.48–0.68  title shrinks / splits as the bio rises
 * 0.68–1.00  the ball drops out of the "O" and falls toward Work
 */
export const PARALLAX_PHASE = {
  riseEnd: 0.22,
  fallEnd: 0.48,
  morphEnd: 0.68,
  landEnd: 1,
} as const;

export const HERO_PARALLAX = {
  splitOpacity: { 0: 0, 0.38: 0, 0.48: 1, 1: 1 },
  rowGapEm: { 0: 0.2, 0.38: 0.2, 0.48: 0.48, 0.68: 0.52, 1: 0.52 },
  titleScale: { 0: 1, 0.38: 1, 0.48: 0.84, 0.68: 0.68, 1: 0.68 },
  titleYOffset: { 0: 0, 0.48: 18, 0.68: 48, 1: 48 },

  bioOpacity: { 0: 1, 0.48: 1, 1: 1 },
  bioTranslateY: { 0: 0, 0.48: 0, 0.68: 0, 1: 0 },

  /** 0 = only the peek line shows, 1 = full bio risen into view */
  bioReveal: { 0: 0, 0.32: 1, 1: 1 },
} as const;

export type HeroParallaxValues = {
  splitOpacity: number;
  rowGapEm: number;
  titleScale: number;
  titleYOffset: number;
  bioOpacity: number;
  bioTranslateY: number;
  bioReveal: number;
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
    bioOpacity: lerpKeyframes(HERO_PARALLAX.bioOpacity, p),
    bioTranslateY: lerpKeyframes(HERO_PARALLAX.bioTranslateY, p),
    bioReveal: lerpKeyframes(HERO_PARALLAX.bioReveal, p),
    fallPhase: clamp(
      (p - PARALLAX_PHASE.morphEnd) /
        (PARALLAX_PHASE.landEnd - PARALLAX_PHASE.morphEnd),
      0,
      1,
    ),
  };
}
