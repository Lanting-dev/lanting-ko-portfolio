/** Figma ball diameter on 1440px frame (ball.png display size) */
export const FIGMA_BALL_SIZE_FALLBACK = 53;

export function readBallSize(): number {
  if (typeof window === "undefined") return FIGMA_BALL_SIZE_FALLBACK;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--figma-ball-size")
    .trim();
  const parsed = parseFloat(raw);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  return Math.min(
    FIGMA_BALL_SIZE_FALLBACK,
    window.innerWidth * (FIGMA_BALL_SIZE_FALLBACK / 1440),
  );
}

/** Ball bottom rests on card frame top — sits in bleed padding above the card. */
export function ballNotchTransform(sx = 1, sy = 1, rotateDeg = 0): string {
  if (Math.abs(rotateDeg) < 0.05) {
    return `translate(-50%, -100%) scale(${sx}, ${sy})`;
  }
  return `translate(-50%, -100%) rotate(${rotateDeg.toFixed(2)}deg) scale(${sx}, ${sy})`;
}

/** Notch anchor — scale squash/stretch from the landing point, not the ball center. */
export const BALL_NOTCH_ORIGIN = "50% 100%";

/** Ball bottom rests on the shelf / copy boundary — never past the paragraph top. */
export function readBioBallRestPoint(
  shelfRect: DOMRect,
  textRect: DOMRect,
): { x: number; y: number } {
  return {
    x: textRect.left + textRect.width / 2,
    y: Math.min(textRect.top, shelfRect.bottom),
  };
}
