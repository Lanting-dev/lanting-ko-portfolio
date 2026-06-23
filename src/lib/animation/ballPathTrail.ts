import {
  pinballFallPose,
  pinballHopPose,
  pinballAboutEntryPose,
  pinballAboutWallRicochetPose,
  ABOUT_ROLL_END,
  type FallPoint,
} from "@/lib/animation/pinballBounce";

export type TrailPoint = { x: number; y: number };

export function buildTrailPath(points: TrailPoint[]): string {
  if (points.length < 2) return "";

  const [first, ...rest] = points;
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;

  for (const point of rest) {
    d += ` L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }

  return d;
}

function sampleProgressive(
  maxT: number,
  evaluate: (t: number) => TrailPoint,
  steps: number,
): TrailPoint[] {
  if (maxT <= 0) return [];

  const count = Math.max(2, Math.round(steps * maxT) + 1);
  const points: TrailPoint[] = [];

  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : (i / (count - 1)) * maxT;
    points.push(evaluate(t));
  }

  return points;
}

/** Scroll-scrubbed trail for hero fall (start → bio → arc → card). */
export function sampleFallTrail(
  fallPhase: number,
  waypoints: { start: FallPoint; bio: FallPoint; card: FallPoint },
  ballSize: number,
  steps = 52,
  viewportHeight?: number,
): TrailPoint[] {
  return sampleProgressive(
    fallPhase,
    (t) => pinballFallPose(t, waypoints, ballSize, viewportHeight),
    steps,
  );
}

/** Scroll-scrubbed trail for the about-section gravity drop. */
export function sampleDropTrail(
  from: TrailPoint,
  to: TrailPoint,
  drop: number,
  steps = 40,
): TrailPoint[] {
  return sampleProgressive(
    drop,
    (t) => {
      const gravity = t * t;
      return {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * gravity,
      };
    },
    steps,
  );
}

/** Scroll-scrubbed trail for about entry (card → edge roll → profile). */
export function sampleAboutEntryTrail(
  from: TrailPoint,
  edge: TrailPoint,
  impact: TrailPoint,
  drop: number,
  ballSize: number,
  steps = 44,
  viewport?: { width: number; height: number },
): TrailPoint[] {
  return sampleProgressive(
    drop,
    (t) => pinballAboutEntryPose(from, edge, impact, t, ballSize, viewport),
    steps,
  );
}

/** Fall-only segment: edge roll-off → profile top (no horizontal card roll). */
export function sampleAboutEntryFallTrail(
  from: TrailPoint,
  edge: TrailPoint,
  impact: TrailPoint,
  fallProgress: number,
  ballSize: number,
  steps = 40,
  viewport?: { width: number; height: number },
): TrailPoint[] {
  const rollEnd = ABOUT_ROLL_END;
  const fallSpan = 1 - rollEnd;
  if (fallSpan <= 0) return [];

  return sampleProgressive(
    fallProgress,
    (t) =>
      pinballAboutEntryPose(
        from,
        edge,
        impact,
        rollEnd + t * fallSpan,
        ballSize,
        viewport,
      ),
    steps,
  );
}

/** Scroll-scrubbed trail for profile → right wall ricochet. */
export function sampleAboutWallRicochetTrail(
  impact: TrailPoint,
  wall: TrailPoint,
  localT: number,
  ballSize: number,
  steps = 32,
): TrailPoint[] {
  return sampleProgressive(
    localT,
    (t) => pinballAboutWallRicochetPose(impact, wall, t, ballSize),
    steps,
  );
}

/** Scroll-scrubbed trail for a horizontal card hop. */
export function sampleHopTrail(
  from: TrailPoint,
  to: TrailPoint,
  localT: number,
  ballSize: number,
  steps = 36,
): TrailPoint[] {
  return sampleProgressive(
    localT,
    (t) => pinballHopPose(from, to, t, ballSize),
    steps,
  );
}
