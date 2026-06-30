import { clamp } from "@/lib/dither/bayer";

/** Scroll progress where the big word starts fading in. */
export const BIGWORD_REVEAL_START = 0.06;
/** Scroll span over which the big word completes its reveal. */
export const BIGWORD_REVEAL_SPAN = 0.26;
/** Upward travel (px) while fading in. */
export const BIGWORD_REVEAL_OFFSET_Y = 28;
/** Perspective applied to the 3D prism (px). Smaller = more dramatic foreshortening. */
export const BIGWORD_PERSPECTIVE = 1100;

export function smoothstepEase(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function sectionBigWordReveal(progress: number): number {
  return smoothstepEase((progress - BIGWORD_REVEAL_START) / BIGWORD_REVEAL_SPAN);
}

/** Cross-stitch big-word entrance phases (aino-style, stitch material). */
export const BIGWORD_PHASE_RULES_END = 0.25;
export const BIGWORD_PHASE_STITCH_END = 0.55;
export const BIGWORD_PHASE_SCRAMBLE_END = 0.78;

export function morphProgressForReveal(reveal: number): number {
  const r = clamp(reveal, 0, 1);
  if (r <= BIGWORD_PHASE_RULES_END) {
    return (r / BIGWORD_PHASE_RULES_END) * 0.32;
  }
  if (r <= BIGWORD_PHASE_STITCH_END) {
    const t =
      (r - BIGWORD_PHASE_RULES_END) /
      (BIGWORD_PHASE_STITCH_END - BIGWORD_PHASE_RULES_END);
    return 0.32 + smoothstepEase(t) * 0.68;
  }
  return 1;
}

export function cellRevealProgressForReveal(reveal: number): number {
  const r = clamp(reveal, 0, 1);
  if (r < 0.12) return 0;
  if (r <= BIGWORD_PHASE_STITCH_END) {
    return smoothstepEase(
      (r - 0.12) / (BIGWORD_PHASE_STITCH_END - 0.12),
    );
  }
  return 1;
}

export function scrambleProgressForReveal(reveal: number): number {
  const r = clamp(reveal, 0, 1);
  if (r <= BIGWORD_PHASE_STITCH_END) return 0;
  if (r <= BIGWORD_PHASE_SCRAMBLE_END) {
    return smoothstepEase(
      (r - BIGWORD_PHASE_STITCH_END) /
        (BIGWORD_PHASE_SCRAMBLE_END - BIGWORD_PHASE_STITCH_END),
    );
  }
  return 1;
}

/** Scroll reveal where cross-stitch hands off to final Sora type. */
export const BIGWORD_STITCH_HANDOFF_START = BIGWORD_PHASE_SCRAMBLE_END;

export function bigWordStitchOpacity(reveal: number): number {
  if (reveal >= 1) return 0;
  if (reveal <= BIGWORD_STITCH_HANDOFF_START) return 1;
  return (
    1 -
    smoothstepEase(
      (reveal - BIGWORD_STITCH_HANDOFF_START) /
        (1 - BIGWORD_STITCH_HANDOFF_START),
    )
  );
}

export function bigWordFinalOpacity(reveal: number): number {
  if (reveal >= 1) return 1;
  if (reveal <= BIGWORD_STITCH_HANDOFF_START) return 0;
  return smoothstepEase(
    (reveal - BIGWORD_STITCH_HANDOFF_START) /
      (1 - BIGWORD_STITCH_HANDOFF_START),
  );
}
