import { clamp, lerpKeyframes } from "@/lib/parallax/interpolate";
import { FIGMA_BALL_SIZE_FALLBACK } from "@/lib/layout/ballSize";

/** Flower diameter at scale 1 → ball diameter */
export const BALL_TO_FLOWER_RATIO = FIGMA_BALL_SIZE_FALLBACK / 400.59;

/**
 * Full scroll track progress 0→1
 * 0.00–0.48  dither 花定點不動（不再上升 / 漂移）
 * 0.48–0.56  花原地縮小直接變球
 * 0.56–0.68  球從標題斜線移到 bio 正上方
 * 0.68–1.00  球落下打 bio → 彈起 → 墜落至 project section
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

  /** Flower position on LANTING row (em) — held still, morphs in place. */
  orbLeftEm: { 0: 2.28 },
  orbTopEm: { 0: 0.34 },
  orbFlowerScale: {
    0: 1,
    0.48: 1,
    0.56: BALL_TO_FLOWER_RATIO,
    1: BALL_TO_FLOWER_RATIO,
  },

  /** 0 = flower, 1 = ball — crossfade in place */
  ballMix: { 0: 0, 0.48: 0, 0.56: 1, 1: 1 },

  /** 0 = anchored to title, 1 = parked directly above the bio (fall start) */
  orbFixedMix: { 0: 0, 0.56: 0, 0.68: 1, 1: 1 },
  orbFixedTopRatio: { 0.68: 0.86, 0.82: 0.86, 1: 0.86 },

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
  orbLeftEm: number;
  orbTopEm: number;
  orbFlowerScale: number;
  ballMix: number;
  orbFixedMix: number;
  orbFixedTopRatio: number;
  bioOpacity: number;
  bioTranslateY: number;
  bioReveal: number;
  fallPhase: number;
};

export function getHeroParallaxValues(progress: number): HeroParallaxValues {
  const p = clamp(progress, 0, 1);

  return {
    splitOpacity: lerpKeyframes(HERO_PARALLAX.splitOpacity, p),
    rowGapEm: lerpKeyframes(HERO_PARALLAX.rowGapEm, p),
    titleScale: lerpKeyframes(HERO_PARALLAX.titleScale, p),
    titleYOffset: lerpKeyframes(HERO_PARALLAX.titleYOffset, p),
    orbLeftEm: lerpKeyframes(HERO_PARALLAX.orbLeftEm, p),
    orbTopEm: lerpKeyframes(HERO_PARALLAX.orbTopEm, p),
    orbFlowerScale: lerpKeyframes(HERO_PARALLAX.orbFlowerScale, p),
    ballMix: lerpKeyframes(HERO_PARALLAX.ballMix, p),
    orbFixedMix: lerpKeyframes(HERO_PARALLAX.orbFixedMix, p),
    orbFixedTopRatio: lerpKeyframes(HERO_PARALLAX.orbFixedTopRatio, p),
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
