import type { RefObject } from "react";

export type FooterBallPoint = { x: number; y: number };

export function readFooterSandImpact(
  impactRef: RefObject<HTMLElement | null>,
): FooterBallPoint | null {
  const el = impactRef.current;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top,
  };
}

export function readFooterSandEntry(
  entryRef: RefObject<HTMLElement | null>,
  impactRef: RefObject<HTMLElement | null>,
  ballSize: number,
): FooterBallPoint | null {
  const entryEl = entryRef.current;
  if (entryEl) {
    const rect = entryEl.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.bottom,
    };
  }

  const impact = readFooterSandImpact(impactRef);
  if (!impact) return null;

  return {
    x: impact.x,
    y: impact.y - Math.max(ballSize * 2.8, 96),
  };
}
