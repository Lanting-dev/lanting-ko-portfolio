import { clamp } from "@/lib/parallax/interpolate";
import { PARALLAX_PHASE } from "@/lib/parallax/heroParallax";

/** Project scroll progress where the ball finishes at Work and fades out. */
export const BALL_JOURNEY_PROJECT_END = 0.24;

/** Hero contributes this much of the 0→1 journey; the rest is project scroll. */
export const HERO_JOURNEY_WEIGHT = 0.52;

/** Journey progress where the ball reaches the cluster impact point. */
export const BALL_ARRIVE_AT = 0.92;

/** Scatter animation runs from impact through this journey span. */
export const BALL_SCATTER_SPAN = 0.08;

export type FallPoint = { x: number; y: number };

export type FallWaypoints = {
  /** Notch-bottom anchor at detach , frozen once. */
  start: FallPoint;
  /** Notch-bottom anchor at card cluster , live while Work is pinned. */
  impact: FallPoint;
};

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function easeInQuad(t: number): number {
  return t * t;
}

/** 0→1 from ball detach through hero fall + early project scroll to Work. */
export function computeBallJourneyProgress(
  heroProgress: number,
  projectProgress: number,
): number {
  if (heroProgress < PARALLAX_PHASE.morphEnd) return 0;

  const heroSpan = 1 - PARALLAX_PHASE.morphEnd;
  const heroT = clamp((heroProgress - PARALLAX_PHASE.morphEnd) / heroSpan, 0, 1);
  const heroPart = heroT * HERO_JOURNEY_WEIGHT;

  if (projectProgress <= 0) return heroPart;

  const projectT = clamp(
    projectProgress / BALL_JOURNEY_PROJECT_END,
    0,
    1,
  );
  return clamp(
    HERO_JOURNEY_WEIGHT + projectT * (1 - HERO_JOURNEY_WEIGHT),
    0,
    1,
  );
}

/** Estimated cluster centre before Work pins (viewport ratios). */
export function readEstimatedImpactCenter(vw: number, vh: number): FallPoint {
  return { x: vw * 0.5, y: vh * 0.56 };
}

/** Read live impact only when Work sticky is pinned on screen. */
export function readLiveImpactCenter(
  impactEl: HTMLElement | null,
  projectProgress: number,
  vw: number,
  vh: number,
): FallPoint {
  const fallback = readEstimatedImpactCenter(vw, vh);
  if (!impactEl || projectProgress < 0.02) return fallback;

  const rect = impactEl.getBoundingClientRect();
  const pinned =
    rect.top >= vh * 0.18 &&
    rect.top <= vh * 0.72 &&
    rect.bottom > vh * 0.22 &&
    rect.bottom < vh * 0.92;

  if (!pinned) return fallback;

  return {
    x: rect.left + rect.width / 2,
    y: clamp(rect.top + rect.height / 2, vh * 0.2, vh * 0.78),
  };
}

/**
 * Two-segment fall:
 * 1) Hero , drop straight down from O (no off-screen targets).
 * 2) Project , glide from hero exit into the pinned cluster impact.
 */
export function heroBallFallPose(
  journey: number,
  waypoints: FallWaypoints,
  projectProgress: number,
  vh: number,
  vw: number,
): FallPoint {
  const { start, impact } = waypoints;

  const heroExit: FallPoint = {
    x: start.x + (vw * 0.5 - start.x) * 0.15,
    y: Math.min(start.y + vh * 0.12, vh * 0.52),
  };

  const impactY = Math.max(impact.y, heroExit.y + 8);

  const inProjectFall =
    projectProgress >= 0.04 && journey >= HERO_JOURNEY_WEIGHT * 0.88;

  if (!inProjectFall) {
    const t = clamp(journey / HERO_JOURNEY_WEIGHT, 0, 1);
    const e = easeInQuad(t);
    return {
      x: start.x + (heroExit.x - start.x) * e,
      y: start.y + (heroExit.y - start.y) * e,
    };
  }

  const localT = clamp(
    (journey - HERO_JOURNEY_WEIGHT * 0.85) /
      (1 - HERO_JOURNEY_WEIGHT * 0.85),
    0,
    1,
  );
  const e = smoothstep(localT);

  return {
    x: heroExit.x + (impact.x - heroExit.x) * e,
    y: heroExit.y + (impactY - heroExit.y) * e,
  };
}

export function heroBallFallScale(journey: number): { sx: number; sy: number } {
  const t = clamp(journey, 0, 1);

  if (t > 0.08 && t < BALL_ARRIVE_AT - 0.02) {
    return { sx: 1, sy: 1 };
  }

  if (t <= 0.08) {
    const stretch = (t / 0.08) * 0.04;
    return { sx: 1 - stretch * 0.3, sy: 1 + stretch };
  }

  const post = clamp((t - (BALL_ARRIVE_AT - 0.02)) / 0.06, 0, 1);
  const squash = Math.sin(post * Math.PI) * 0.18;
  return { sx: 1 + squash * 0.55, sy: 1 - squash };
}

export function heroBallFallOpacity(journey: number): number {
  if (journey <= 0.95) return 1;
  return 1 - clamp((journey - 0.95) / 0.05, 0, 1);
}

/** Cards scatter only after the ball hits , driven purely by ball journey. */
export function computeBallScatterProgress(ballJourney: number): number {
  if (ballJourney < BALL_ARRIVE_AT - 0.01) return 0;
  return smoothstep(
    clamp((ballJourney - (BALL_ARRIVE_AT - 0.01)) / BALL_SCATTER_SPAN, 0, 1),
  );
}

export type TrailPoint = { x: number; y: number };

export function sampleHeroFallTrail(
  journey: number,
  waypoints: FallWaypoints,
  projectProgress: number,
  vh: number,
  vw: number,
  ballSize: number,
  steps = 14,
): TrailPoint[] {
  if (journey <= 0) return [];

  const count = Math.max(2, Math.round(steps * journey) + 1);
  const points: TrailPoint[] = [];

  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : (i / (count - 1)) * journey;
    const pose = heroBallFallPose(t, waypoints, projectProgress, vh, vw);
    points.push({
      x: pose.x,
      y: pose.y - ballSize * 0.5,
    });
  }

  return points;
}

export function isBallJourneyActive(journey: number): boolean {
  return journey > 0 && journey < 0.999;
}
