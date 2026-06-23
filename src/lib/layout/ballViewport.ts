import { clamp } from "@/lib/dither/bayer";

export type ViewportSize = { width: number; height: number };

export function readViewportSize(): ViewportSize | null {
  if (typeof window === "undefined") return null;
  return { width: window.innerWidth, height: window.innerHeight };
}

/** Keep the ball notch inside the visible viewport (fixed-position rider). */
export function clampBallToViewport(
  point: { x: number; y: number },
  ballSize: number,
  viewport?: ViewportSize | null,
): { x: number; y: number } {
  if (!viewport) return point;

  const padX = ballSize * 0.55;
  const padTop = ballSize * 0.85;
  const padBottom = ballSize * 0.2;

  return {
    x: clamp(point.x, padX, viewport.width - padX),
    y: clamp(point.y, padTop, viewport.height - padBottom),
  };
}

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function lerpPoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  const u = smoothstep(t);
  return {
    x: a.x + (b.x - a.x) * u,
    y: a.y + (b.y - a.y) * u,
  };
}
