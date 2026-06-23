export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smoothstep between edge0 and edge1. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function lerpKeyframes(
  keyframes: Record<number, number>,
  progress: number,
): number {
  const stops = Object.keys(keyframes)
    .map(Number)
    .sort((a, b) => a - b);

  if (progress <= stops[0]) return keyframes[stops[0]];
  if (progress >= stops[stops.length - 1]) {
    return keyframes[stops[stops.length - 1]];
  }

  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const b = stops[i + 1];
    if (progress >= a && progress <= b) {
      const t = (progress - a) / (b - a);
      return lerp(keyframes[a], keyframes[b], t);
    }
  }

  return keyframes[stops[stops.length - 1]];
}
