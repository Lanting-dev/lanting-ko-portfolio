import { clamp } from "@/lib/dither/bayer";

/** Scroll progress where the big word starts fading in. */
export const BIGWORD_REVEAL_START = 0.06;
/** Scroll span over which the big word completes its reveal. */
export const BIGWORD_REVEAL_SPAN = 0.26;
/** Upward travel (px) while fading in. */
export const BIGWORD_REVEAL_OFFSET_Y = 28;

export function smoothstepEase(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function sectionBigWordReveal(progress: number): number {
  return smoothstepEase((progress - BIGWORD_REVEAL_START) / BIGWORD_REVEAL_SPAN);
}

export function sectionBigWordRevealStyle(progress: number): {
  opacity: number;
  transform: string;
} {
  const reveal = sectionBigWordReveal(progress);
  return {
    opacity: reveal,
    transform: `translateY(${(1 - reveal) * BIGWORD_REVEAL_OFFSET_Y}px)`,
  };
}
