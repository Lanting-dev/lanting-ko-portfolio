export type BallHandoffPose = {
  x: number;
  y: number;
  scale: { sx: number; sy: number };
  rotation: number;
};

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/** Blend from the project rider pose into the about entry pose at handoff. */
export function blendHandoffPose(
  handoff: BallHandoffPose,
  target: BallHandoffPose,
  entrySegmentT: number,
  blendEnd = 0.04,
): BallHandoffPose {
  if (entrySegmentT >= blendEnd) return target;

  const u = smoothstep(entrySegmentT / blendEnd);

  return {
    x: handoff.x + (target.x - handoff.x) * u,
    y: handoff.y + (target.y - handoff.y) * u,
    scale: {
      sx: handoff.scale.sx + (target.scale.sx - handoff.scale.sx) * u,
      sy: handoff.scale.sy + (target.scale.sy - handoff.scale.sy) * u,
    },
    rotation: handoff.rotation + (target.rotation - handoff.rotation) * u,
  };
}
