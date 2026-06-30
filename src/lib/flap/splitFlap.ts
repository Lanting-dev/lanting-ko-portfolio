/** Glyphs the flaps tumble through before settling — letters + digits. */
export const SPLIT_FLAP_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const SPLIT_FLAP_TICK_MS = 70;
export const SPLIT_FLAP_STAGGER_TICKS = 4;
export const SPLIT_FLAP_BASE_TICKS = 8;

export function splitFlapTargetChars(target: string): string[] {
  return target.split("");
}

/** ms from scramble start until the last glyph locks (matches useScrambleText). */
export function scrambleDurationMs(target: string, delayTicks = 0): number {
  const chars = splitFlapTargetChars(target);
  const lastIndex = chars.reduce(
    (last, glyph, index) => (glyph !== " " ? index : last),
    0,
  );
  return (delayTicks + lockTickFor(lastIndex) + 1) * SPLIT_FLAP_TICK_MS;
}

export function initialSplitFlapChars(target: string): string[] {
  return splitFlapTargetChars(target).map((c, i) =>
    c === " " ? " " : SPLIT_FLAP_CHARSET[(i * 7 + 5) % SPLIT_FLAP_CHARSET.length]!,
  );
}

export function randomSplitFlapGlyph(): string {
  return SPLIT_FLAP_CHARSET[
    Math.floor(Math.random() * SPLIT_FLAP_CHARSET.length)
  ]!;
}

export function lockTickFor(index: number): number {
  return SPLIT_FLAP_BASE_TICKS + index * SPLIT_FLAP_STAGGER_TICKS;
}

export function lastLockTickForTarget(targetChars: readonly string[]): number {
  let lastIndex = 0;
  targetChars.forEach((glyph, index) => {
    if (glyph !== " ") lastIndex = index;
  });
  return lockTickFor(lastIndex);
}
