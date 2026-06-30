import { clamp, easeOutCubic } from "@/lib/dither/bayer";

/** Scroll track after About , homepage: footer holds the contact meta. */
export const FOOTER_SCROLL_VH = 100;

function phase(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  return clamp((t - start) / (end - start), 0, 1);
}

/** 0 → empty, 1 → the homepage word is fully assembled. */
export function footerWordReveal(progress: number): number {
  return easeOutCubic(phase(clamp(progress, 0, 1), 0.06, 0.62));
}

export type FooterScrollValues = {
  progress: number;
  sandProgress: number;
  sandDrift: number;
};

/** Case-study footer sand pile: assemble (0→0.18) then drift/scatter (0.52→0.88). */
export function getFooterScrollValues(progress: number): FooterScrollValues {
  const p = clamp(progress, 0, 1);
  return {
    progress: p,
    sandProgress: easeOutCubic(phase(p, 0, 0.18)),
    sandDrift: easeOutCubic(phase(p, 0.52, 0.88)) * 0.88,
  };
}
