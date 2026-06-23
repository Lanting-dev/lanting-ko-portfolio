import { clamp } from "@/lib/dither/bayer";

/** fallPhase 0→1 — card-segment local impact (after bio + wall) */
export const PINBALL_IMPACT_AT = 0.62;

/** fallPhase where bounce settles (hand off to card anchor) */
export const PINBALL_SETTLE_AT = 0.992;

/** Slight overlap so FloatingOrb → ProjectBallRider never blinks */
export const PINBALL_RIDER_HANDOFF_AT = PINBALL_SETTLE_AT - 0.025;

/** fallPhase segment boundaries: drop → bio → ricochet arc → card */
export const FALL_BIO_END = 0.32;
export const FALL_APEX_END = 0.58;

/** @deprecated use FALL_APEX_END */
export const FALL_WALL_END = FALL_APEX_END;

/** hop localT 0→1 — ball lands on next card notch */
export const PINBALL_HOP_IMPACT_AT = 0.86;

function pinballCardNudgeAt(t: number, impactAt: number): number {
  if (t < impactAt) return 0;
  const post = (t - impactAt) / (1 - impactAt);
  const damp = Math.exp(-3.5 * post);
  return Math.sin(post * Math.PI * 2.85) * damp * 5;
}

function pinballBallScaleAt(
  t: number,
  impactAt: number,
): { sx: number; sy: number } {
  const x = clamp(t, 0, 1);

  if (x <= impactAt) {
    const u = x / impactAt;
    const stretch = u * u * u * 0.05;
    return { sx: 1 - stretch * 0.35, sy: 1 + stretch };
  }

  const post = (x - impactAt) / (1 - impactAt);
  const damp = Math.exp(-2.8 * post);
  const hit = Math.abs(Math.sin(post * Math.PI * 2.85));
  const squash = hit * damp * 0.2;

  return { sx: 1 + squash * 0.65, sy: 1 - squash };
}

/**
 * Scroll-scrubbed drop 0→1.
 * Before impact: gravity ease-in. After: damped bounces (scrub back = reverse).
 */
export function pinballFallProgress(t: number): number {
  const x = clamp(t, 0, 1);
  const impact = PINBALL_IMPACT_AT;

  if (x <= impact) {
    const u = x / impact;
    return u * u * u * impact;
  }

  const post = (x - impact) / (1 - impact);
  const base = impact + post * (1 - impact);
  const amp = (1 - impact) * 0.58;
  const damp = Math.exp(-3.6 * post);
  const lift = Math.abs(Math.sin(post * Math.PI * 2.85)) * damp * amp;

  return clamp(base - lift, 0, 1);
}

/** Horizontal drift toward card — smooth, no bounce */
export function pinballDriftProgress(t: number): number {
  const x = clamp(t, 0, 1);
  const driftEnd = PINBALL_IMPACT_AT + 0.1;
  if (x >= driftEnd) return 1;
  const u = x / driftEnd;
  return u * u * (2 - u);
}

/** Squash / stretch synced to scroll bounces */
export function pinballBallScale(t: number): { sx: number; sy: number } {
  return pinballBallScaleAt(t, PINBALL_IMPACT_AT);
}

/** Card nudge on impact (px), scroll-scrubbed */
export function pinballCardNudge(t: number): number {
  return pinballCardNudgeAt(t, PINBALL_IMPACT_AT);
}

export type FallSegment = 0 | 1 | 2;

export type FallPoint = { x: number; y: number };

export function resolveFallSegment(fallPhase: number): {
  segment: FallSegment;
  localT: number;
} {
  const t = clamp(fallPhase, 0, 1);

  if (t <= FALL_BIO_END) {
    return { segment: 0, localT: t / FALL_BIO_END };
  }

  if (t <= FALL_WALL_END) {
    return {
      segment: 1,
      localT: (t - FALL_BIO_END) / (FALL_WALL_END - FALL_BIO_END),
    };
  }

  return {
    segment: 2,
    localT: (t - FALL_WALL_END) / (1 - FALL_WALL_END),
  };
}

function cardSegmentLocal(fallPhase: number): number {
  if (fallPhase <= FALL_APEX_END) return 0;
  return (fallPhase - FALL_APEX_END) / (1 - FALL_APEX_END);
}

/** Content inset aligned with hero / project horizontal padding. */
export function readContentInsetX(): number {
  if (typeof window === "undefined") return 32;

  const vw = window.innerWidth;
  const frameInset = Math.max(0, (vw - Math.min(1440, vw)) / 2);
  const pad = vw >= 1024 ? 64 : vw >= 768 ? 48 : 32;

  return frameInset + pad;
}

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function easeInQuad(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x;
}

function quadBezier(
  p0: FallPoint,
  p1: FallPoint,
  p2: FallPoint,
  t: number,
): FallPoint {
  const u = clamp(t, 0, 1);
  const v = 1 - u;
  return {
    x: v * v * p0.x + 2 * v * u * p1.x + u * u * p2.x,
    y: v * v * p0.y + 2 * v * u * p1.y + u * u * p2.y,
  };
}

/** About entry — roll on last card, then fall from the edge. */
export const ABOUT_ROLL_END = 0.52;

/** Scroll-scrubbed roll: brief traction slip, then 1:1 travel (no glide easing). */
export function pinballAboutEntryRollProgress(u: number): number {
  const x = clamp(u, 0, 1);
  const TRACTION = 0.07;
  if (x <= TRACTION) {
    const t = x / TRACTION;
    return t * t * TRACTION * 0.35;
  }
  const roll = (x - TRACTION) / (1 - TRACTION);
  const base = TRACTION * 0.35;
  return base + roll * (1 - base);
}

function pinballAboutEntryRollDistance(
  from: HopPoint,
  edge: HopPoint,
  rollU: number,
): number {
  return (edge.x - from.x) * pinballAboutEntryRollProgress(rollU);
}

/** @deprecated use ABOUT_ROLL_END */
export const ABOUT_CARD_BOUNCE_END = ABOUT_ROLL_END;
/** @deprecated */
export const ABOUT_LAUNCH_END = ABOUT_ROLL_END;
/** @deprecated */
export const ABOUT_GLIDE_END = 0.72;
/** @deprecated use ABOUT_ROLL_END */
export const ABOUT_ENTRY_APEX_END = ABOUT_ROLL_END;

/** Full entry arc from card center → edge roll → profile impact. */
export function mapAboutEntryPoseT(entrySegmentT: number): number {
  return clamp(entrySegmentT, 0, 1);
}

/** @deprecated use mapAboutEntryPoseT */
export function mapAboutHandoffPoseT(entrySegmentT: number): number {
  return mapAboutEntryPoseT(entrySegmentT);
}

/** Card nudge when the ball impacts profile after falling off the edge. */
export function pinballAboutEntryCardNudge(entryPoseT: number): number {
  if (entryPoseT <= ABOUT_ROLL_END) return 0;

  const u = (entryPoseT - ABOUT_ROLL_END) / (1 - ABOUT_ROLL_END);
  if (u < PINBALL_HOP_IMPACT_AT) return 0;

  const post = (u - PINBALL_HOP_IMPACT_AT) / (1 - PINBALL_HOP_IMPACT_AT);
  const damp = Math.exp(-3.4 * post);
  return Math.sin(post * Math.PI * 2.1) * damp * 5;
}

/** Horizontal travel onto cube top — lands with the vertical hop impact. */
function pinballAboutEntryDriftProgress(u: number): number {
  const x = clamp(u, 0, 1);
  const impact = PINBALL_HOP_IMPACT_AT;
  if (x >= impact) return 1;
  const t = x / impact;
  return t * t * (3 - 2 * t);
}

/**
 * Last project card → profile:
 * 1) roll along card top toward the right edge
 * 2) fall off the edge into profile
 */
export function pinballAboutEntryPose(
  from: HopPoint,
  edge: HopPoint,
  impact: HopPoint,
  t: number,
  ballSize = 53,
  viewport?: { width: number; height: number },
): HopPoint {
  const x = clamp(t, 0, 1);

  if (x <= ABOUT_ROLL_END) {
    const u = x / ABOUT_ROLL_END;
    const roll = pinballAboutEntryRollProgress(u);
    const surfaceY = from.y;
    return {
      x: from.x + (edge.x - from.x) * roll,
      y: surfaceY,
    };
  }

  const u = (x - ABOUT_ROLL_END) / (1 - ABOUT_ROLL_END);
  const fall = pinballFallProgress(u);
  const drift = pinballAboutEntryDriftProgress(u);
  const px = edge.x + (impact.x - edge.x) * drift;

  const dropSpan = impact.y - edge.y;
  const arcLift =
    Math.sin(clamp(u, 0, 1) * Math.PI) *
    Math.max(ballSize * 0.62, Math.abs(dropSpan) * 0.1);
  let py = edge.y + dropSpan * fall - arcLift;

  if (u < PINBALL_HOP_IMPACT_AT) {
    py = Math.min(py, impact.y - ballSize * 0.06);
  } else {
    py = impact.y;
  }

  if (u >= PINBALL_HOP_IMPACT_AT) {
    const post = (u - PINBALL_HOP_IMPACT_AT) / (1 - PINBALL_HOP_IMPACT_AT);
    const damp = Math.exp(-3.6 * post);
    py -=
      Math.abs(Math.sin(post * Math.PI * 2.35)) * damp * ballSize * 0.14;
    py = Math.min(py, impact.y);
  }

  return { x: px, y: py };
}

export function pinballAboutEntryBallScale(
  t: number,
  ballSize = 53,
  from?: HopPoint,
  edge?: HopPoint,
): { sx: number; sy: number } {
  const x = clamp(t, 0, 1);

  if (x <= ABOUT_ROLL_END) {
    const u = x / ABOUT_ROLL_END;
    const dist =
      from && edge
        ? Math.abs(pinballAboutEntryRollDistance(from, edge, u))
        : pinballAboutEntryRollProgress(u) * ballSize * 4;
    const phase = (dist / ballSize) * Math.PI * 2;
    const squash = (1 - Math.cos(phase)) * 0.5;
    return {
      sx: 1 + squash * 0.024,
      sy: 1 - squash * 0.042,
    };
  }

  const u = (x - ABOUT_ROLL_END) / (1 - ABOUT_ROLL_END);
  return pinballBallScaleAt(u, PINBALL_HOP_IMPACT_AT);
}

export function pinballAboutEntryRotation(
  from: HopPoint,
  edge: HopPoint,
  impact: HopPoint,
  t: number,
  ballSize = 53,
  viewport?: { width: number; height: number },
): number {
  const x = clamp(t, 0, 1);

  if (x <= ABOUT_ROLL_END) {
    const u = x / ABOUT_ROLL_END;
    const dist = pinballAboutEntryRollDistance(from, edge, u);
    return (dist / (Math.PI * ballSize)) * 360;
  }

  const rollDist = edge.x - from.x;
  const baseRoll = (rollDist / (Math.PI * ballSize)) * 360;
  const dt = 0.016;
  const u = (x - ABOUT_ROLL_END) / (1 - ABOUT_ROLL_END);
  const t0 = clamp(ABOUT_ROLL_END + u * (1 - ABOUT_ROLL_END) - dt, ABOUT_ROLL_END, 1);
  const t1 = clamp(ABOUT_ROLL_END + u * (1 - ABOUT_ROLL_END) + dt, ABOUT_ROLL_END, 1);
  const p0 = pinballAboutEntryPose(from, edge, impact, t0, ballSize, viewport);
  const p1 = pinballAboutEntryPose(from, edge, impact, t1, ballSize, viewport);

  return clamp(baseRoll + (p1.x - p0.x) * 0.12 + (p1.y - p0.y) * 0.08, -720, 720);
}

/** Profile top → right wall: vertical pop, then arced hop (no flat horizontal skim). */
export function pinballAboutWallRicochetPose(
  impact: HopPoint,
  wall: HopPoint,
  t: number,
  ballSize = 53,
): HopPoint {
  const x = clamp(t, 0, 1);
  const POP_END = 0.24;

  if (x <= POP_END) {
    const u = x / POP_END;
    const lift = Math.sin(u * Math.PI) * ballSize * 0.38;
    return { x: impact.x, y: impact.y - lift };
  }

  const u = (x - POP_END) / (1 - POP_END);
  const ease = smoothstep(u);
  const launch: HopPoint = { x: impact.x, y: impact.y - ballSize * 0.06 };
  const control: HopPoint = {
    x: impact.x + (wall.x - impact.x) * 0.42,
    y: Math.min(impact.y, wall.y) - ballSize * 1.25,
  };

  return quadBezier(launch, control, wall, ease);
}

/** Peak of the post-bio ricochet — reflected off the bio shelf, arcs left. */
export function computeFallApex(
  start: FallPoint,
  bio: FallPoint,
  ballSize: number,
): FallPoint {
  const inset = readContentInsetX();
  const drop = Math.max(0, start.y - bio.y);
  const leftReach = Math.max(ballSize * 2, bio.x - inset);

  const incomingVy = Math.max(drop * 0.014, 3.5);
  const restitution = 0.58;
  const outgoingVy = incomingVy * restitution;
  const apexHeight =
    ballSize * (1.85 + Math.min(outgoingVy * 0.09, 1.35)) +
    Math.min(drop * 0.085, 52);

  const leftBias = clamp(0.36 + outgoingVy * 0.012, 0.32, 0.48);

  return {
    x: bio.x - leftReach * (leftBias + Math.min(0.12, drop / 900)),
    y: bio.y - apexHeight,
  };
}

/**
 * Scroll-scrubbed fall: start → bio → natural left arc → card.
 * Continuous bezier + gravity — no forced wall waypoint.
 */
export function pinballFallPose(
  fallPhase: number,
  waypoints: {
    start: FallPoint;
    bio: FallPoint;
    card: FallPoint;
  },
  ballSize = 53,
  viewportHeight?: number,
): FallPoint {
  const t = clamp(fallPhase, 0, 1);
  const { start, bio, card } = waypoints;
  const apex = computeFallApex(start, bio, ballSize);

  if (t <= FALL_BIO_END) {
    const u = t / FALL_BIO_END;
    const x = start.x + (bio.x - start.x) * smoothstep(clamp(u / 0.58, 0, 1));
    let y: number;

    if (start.y <= bio.y) {
      const hoverY = bio.y - ballSize * 1.45;
      const cruiseU = smoothstep(Math.min(u * 1.25, 1));
      const dropU = smoothstep(clamp((u - 0.42) / 0.58, 0, 1));
      y = start.y + (hoverY - start.y) * cruiseU;
      y = y + (bio.y - y) * dropU;
    } else {
      y = start.y + (bio.y - start.y) * smoothstep(clamp(u / 0.78, 0, 1));
    }

    if (u > 0.86) {
      const post = (u - 0.86) / 0.14;
      y -= Math.sin(post * Math.PI) * ballSize * 0.22;
    }

    return { x, y: Math.min(y, bio.y) };
  }

  if (t <= FALL_APEX_END) {
    const u = (t - FALL_BIO_END) / (FALL_APEX_END - FALL_BIO_END);
    const ease = smoothstep(u);
    const control: FallPoint = {
      x: bio.x - (bio.x - apex.x) * 0.22,
      y: bio.y - ballSize * 1.6,
    };

    return quadBezier(bio, control, apex, ease);
  }

  const u = (t - FALL_APEX_END) / (1 - FALL_APEX_END);
  const drift = smoothstep(Math.min(1, u * 1.06));
  const fall = pinballFallProgress(u);
  const x = apex.x + (card.x - apex.x) * drift;
  let y = apex.y + (card.y - apex.y) * fall;
  y = Math.min(y, card.y);

  // Card lives in the project section below the hero — keep ball on-screen until it scrolls in.
  if (viewportHeight && card.y > viewportHeight * 0.78) {
    y = Math.min(y, viewportHeight * 0.76);
  }

  return { x, y };
}

export function pinballFallBallScale(
  fallPhase: number,
  ballSize = 53,
): { sx: number; sy: number } {
  const t = clamp(fallPhase, 0, 1);

  if (t <= FALL_BIO_END) {
    return pinballBallScaleAt(t / FALL_BIO_END, 0.9);
  }

  if (t <= FALL_APEX_END) {
    const u = (t - FALL_BIO_END) / (FALL_APEX_END - FALL_BIO_END);
    const stretch = Math.sin(u * Math.PI) * 0.04;
    return { sx: 1 - stretch * 0.3, sy: 1 + stretch };
  }

  const u = (t - FALL_APEX_END) / (1 - FALL_APEX_END);
  return pinballBallScaleAt(u, PINBALL_IMPACT_AT);
}

/** Bio paragraph nudge when ball hits the copy block. */
export function pinballBioNudge(fallPhase: number): number {
  const { segment, localT } = resolveFallSegment(fallPhase);
  if (segment !== 0) return 0;
  return pinballCardNudgeAt(localT, 0.88);
}

/** First project card nudge — only during final fall segment. */
export function pinballCardFallNudge(fallPhase: number): number {
  const cardLocal = cardSegmentLocal(fallPhase);
  if (cardLocal <= 0) return 0;
  return pinballCardNudgeAt(cardLocal, PINBALL_IMPACT_AT);
}

export function hasPinballImpacted(fallPhase: number): boolean {
  return cardSegmentLocal(fallPhase) >= PINBALL_IMPACT_AT;
}

/** Noise → colour reveal after the ball finishes landing on each card. */
export function isProjectCardRevealActive(
  cardIndex: number,
  fallPhase: number,
  showLandedOrb: boolean,
  horizontalProgress: number,
  cardCount: number,
): boolean {
  if (!showLandedOrb) {
    return false;
  }

  if (cardIndex === 0) {
    return isPinballFallComplete(fallPhase);
  }

  const { segmentIndex, localT } = resolveHopSegment(
    horizontalProgress,
    cardCount,
  );

  if (segmentIndex >= cardIndex) {
    return true;
  }

  return segmentIndex === cardIndex - 1 && !isHopInFlight(localT);
}

export function isPinballFallComplete(fallPhase: number): boolean {
  return fallPhase >= PINBALL_SETTLE_AT;
}

export function isBallRiderActive(fallPhase: number): boolean {
  return fallPhase >= PINBALL_RIDER_HANDOFF_AT;
}

/** Hand off once fall is far enough along AND card 0 is entering the viewport. */
export function isBallRiderReady(
  fallPhase: number,
  cardFrameTop: number | null,
  viewportHeight: number,
): boolean {
  if (fallPhase < PINBALL_RIDER_HANDOFF_AT) {
    return false;
  }

  if (cardFrameTop === null) {
    return fallPhase >= PINBALL_SETTLE_AT;
  }

  return cardFrameTop < viewportHeight * 0.92;
}

/** Map horizontal scroll 0→1 to card hop segment + local progress. */
export function resolveHopSegment(
  horizontalProgress: number,
  cardCount: number,
): { segmentIndex: number; localT: number; travel: number } {
  const segments = Math.max(cardCount - 1, 1);
  const travel = clamp(horizontalProgress * segments, 0, segments);
  const segmentIndex = Math.min(Math.floor(travel), Math.max(cardCount - 2, 0));
  const localT = clamp(travel - segmentIndex, 0, 1);

  return { segmentIndex, localT, travel };
}

/** Scroll-scrubbed hop between two card notches. */
export function pinballHopProgress(t: number): number {
  const x = clamp(t, 0, 1);
  const impact = PINBALL_HOP_IMPACT_AT;

  if (x <= impact) {
    const u = x / impact;
    return u * u * (3 - 2 * u) * impact;
  }

  const post = (x - impact) / (1 - impact);
  const base = impact + post * (1 - impact);
  const damp = Math.exp(-4.2 * post);
  const bounce =
    Math.abs(Math.sin(post * Math.PI * 2.2)) * damp * (1 - impact) * 0.42;

  return clamp(base - bounce, 0, 1);
}

export type HopPoint = { x: number; y: number };

export type HopPoseOptions = {
  /** Bezier control bias along the hop (0 = start, 1 = end). */
  peakBiasX?: number;
  /** Multiplier on distance-based arc height. */
  arcScale?: number;
  /** Precomputed impact speed for landing squash (px per progress unit). */
  impactSpeed?: number;
};

function reflectVelocity(
  vx: number,
  vy: number,
  nx: number,
  ny: number,
  restitution = 0.68,
): { vx: number; vy: number } {
  const dot = vx * nx + vy * ny;
  return {
    vx: (vx - 2 * dot * nx) * restitution,
    vy: (vy - 2 * dot * ny) * restitution,
  };
}

/** Arc height scales with hop distance — farther hops rise higher. */
export function computeHopArcHeight(
  from: HopPoint,
  to: HopPoint,
  ballSize: number,
): number {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const dist = Math.hypot(dx, dy);
  const minLift = ballSize * 0.55;
  const base = ballSize * (1.05 + 0.48 * Math.sqrt(dist / 200));
  const verticalBonus = dy > 8 ? ballSize * 0.32 * Math.sqrt(dy / 120) : 0;

  return Math.max(minLift, base + verticalBonus);
}

function estimateHopImpactSpeed(
  from: HopPoint,
  to: HopPoint,
  ballSize: number,
  options: HopPoseOptions = {},
): number {
  const dt = 0.022;
  const t0 = PINBALL_HOP_IMPACT_AT - dt;
  const t1 = PINBALL_HOP_IMPACT_AT + dt;
  const p0 = pinballHopPose(from, to, t0, ballSize, options);
  const p1 = pinballHopPose(from, to, t1, ballSize, options);

  return Math.hypot(p1.x - p0.x, p1.y - p0.y) / (2 * dt);
}

/** Upward arc while hopping (px) — distance-aware parabolic lift. */
export function pinballHopArcLift(
  t: number,
  ballSize = 53,
  from?: HopPoint,
  to?: HopPoint,
): number {
  const x = clamp(t, 0, 1);
  const arcHeight =
    from && to
      ? computeHopArcHeight(from, to, ballSize)
      : ballSize * 3.6 * 0.55;

  return 4 * arcHeight * x * (1 - x);
}

export function isHopInFlight(localT: number): boolean {
  return localT > 0.035 && localT < 0.965;
}

/** Card index where the ball rests between hops (null = mid-air). */
export function getSettledCardIndex(
  horizontalProgress: number,
  cardCount: number,
): number | null {
  const { segmentIndex, localT } = resolveHopSegment(
    horizontalProgress,
    cardCount,
  );

  if (isHopInFlight(localT)) return null;
  if (localT < 0.04) return segmentIndex;
  return Math.min(segmentIndex + 1, cardCount - 1);
}

/**
 * Horizontal hop pose — ballistic Bezier arc, distance-scaled height;
 * only rests on the notch when settled at segment start/end.
 */
export function pinballHopPose(
  from: HopPoint,
  to: HopPoint,
  localT: number,
  ballSize = 53,
  options: HopPoseOptions = {},
): HopPoint {
  const hop = pinballHopProgress(localT);
  const dx = to.x - from.x;
  const x = from.x + dx * hop;
  const restBottom = from.y + (to.y - from.y) * hop;
  const arcHeight = computeHopArcHeight(from, to, ballSize) * (options.arcScale ?? 1);
  const peakBiasX = clamp(options.peakBiasX ?? 0.5, 0.15, 0.85);
  const control: HopPoint = {
    x: from.x + dx * peakBiasX,
    y: Math.min(from.y, to.y) - arcHeight,
  };

  if (!isHopInFlight(localT)) {
    let y = restBottom;

    if (localT >= PINBALL_HOP_IMPACT_AT) {
      const post = (localT - PINBALL_HOP_IMPACT_AT) / (1 - PINBALL_HOP_IMPACT_AT);
      const damp = Math.exp(-3.2 * post);
      const speedFactor = clamp(
        (options.impactSpeed ??
          estimateHopImpactSpeed(from, to, ballSize, options)) /
          (ballSize * 7),
        0.55,
        1.9,
      );
      const landBounce =
        Math.abs(Math.sin(post * Math.PI * 2.4)) *
        damp *
        ballSize *
        0.22 *
        speedFactor;
      y = restBottom - landBounce;
    }

    return { x, y: Math.min(y, restBottom) };
  }

  const arcT = clamp(localT / PINBALL_HOP_IMPACT_AT, 0, 1);
  const arcPoint = quadBezier(from, control, to, arcT);

  return { x, y: arcPoint.y };
}

/**
 * Ricochet hop — reflects incoming momentum off a surface, then arcs to target.
 * Used for profile-top → right-wall and similar bounces.
 */
export function pinballRicochetHopPose(
  impact: HopPoint,
  to: HopPoint,
  incomingFrom: HopPoint,
  localT: number,
  ballSize = 53,
  surfaceNormal = { nx: 0, ny: -1 },
): HopPoint {
  const incomingVx = (impact.x - incomingFrom.x) * 0.014;
  const incomingVy = Math.max((impact.y - incomingFrom.y) * 0.018, 2.2);
  const reflected = reflectVelocity(
    incomingVx,
    incomingVy,
    surfaceNormal.nx,
    surfaceNormal.ny,
    0.66,
  );

  const toDx = to.x - impact.x;
  const towardTarget = toDx >= 0 ? 1 : -1;
  const momentumBias = clamp(
    0.5 - reflected.vx * 0.04 * towardTarget,
    0.18,
    0.82,
  );
  const peakBiasX =
    toDx >= 0
      ? clamp(momentumBias - 0.12, 0.22, 0.44)
      : clamp(momentumBias + 0.12, 0.56, 0.78);

  const arcScale =
    Math.abs(toDx) < ballSize * 2.5
      ? 0.72
      : Math.abs(toDx) > ballSize * 8
        ? 1.05
        : 0.9;

  return pinballHopPose(impact, to, localT, ballSize, {
    peakBiasX,
    arcScale,
  });
}

export function pinballHopBallScale(
  t: number,
  from?: HopPoint,
  to?: HopPoint,
  ballSize = 53,
  options: HopPoseOptions = {},
): { sx: number; sy: number } {
  const x = clamp(t, 0, 1);

  if (x < PINBALL_HOP_IMPACT_AT) {
    const u = x / PINBALL_HOP_IMPACT_AT;
    const stretch = u * u * 0.042;
    return { sx: 1 - stretch * 0.28, sy: 1 + stretch * 0.65 };
  }

  const post = (x - PINBALL_HOP_IMPACT_AT) / (1 - PINBALL_HOP_IMPACT_AT);
  const damp = Math.exp(-3 * post);
  const hit = Math.abs(Math.sin(post * Math.PI * 2.2));
  let squash = hit * damp * 0.1;

  if (from && to) {
    const speed = estimateHopImpactSpeed(from, to, ballSize, options);
    squash *= clamp(speed / (ballSize * 8), 0.6, 1.85);
  }

  return { sx: 1 + squash * 0.65, sy: 1 - squash };
}

/** Rolling rotation (deg) derived from hop velocity and travel. */
export function pinballHopRotation(
  from: HopPoint,
  to: HopPoint,
  localT: number,
  ballSize = 53,
  options: HopPoseOptions = {},
): number {
  const dt = 0.018;
  const t0 = clamp(localT - dt, 0, 1);
  const t1 = clamp(localT + dt, 0, 1);
  const p0 = pinballHopPose(from, to, t0, ballSize, options);
  const p1 = pinballHopPose(from, to, t1, ballSize, options);
  const vx = p1.x - p0.x;
  const hop = pinballHopProgress(localT);
  const dist = Math.abs(to.x - from.x);
  const rollFromTravel = ((hop * dist) / (Math.PI * ballSize)) * 360 * 0.32;

  return clamp(rollFromTravel + vx * 0.14, -48, 48);
}

/** Rolling rotation during hero fall. */
export function pinballFallRotation(
  fallPhase: number,
  waypoints: { start: FallPoint; bio: FallPoint; card: FallPoint },
  ballSize = 53,
  viewportHeight?: number,
): number {
  const dt = 0.008;
  const t0 = clamp(fallPhase - dt, 0, 1);
  const t1 = clamp(fallPhase + dt, 0, 1);
  const p0 = pinballFallPose(t0, waypoints, ballSize, viewportHeight);
  const p1 = pinballFallPose(t1, waypoints, ballSize, viewportHeight);

  return clamp((p1.x - p0.x) * 0.16, -32, 32);
}

/** Destination card nudge during a horizontal hop. */
export function pinballHopCardNudge(
  cardIndex: number,
  horizontalProgress: number,
  cardCount: number,
): number {
  const { segmentIndex, localT } = resolveHopSegment(
    horizontalProgress,
    cardCount,
  );
  const destIndex = segmentIndex + 1;

  if (cardIndex !== destIndex) return 0;
  return pinballCardNudgeAt(localT, PINBALL_HOP_IMPACT_AT);
}

export function getProjectCardNudgeY(
  cardIndex: number,
  fallPhase: number,
  showLandedOrb: boolean,
  horizontalProgress: number,
  cardCount: number,
  projectExitT = 0,
): number {
  if (cardIndex === cardCount - 1 && projectExitT > 0 && projectExitT < 0.995) {
    const entryPoseT = mapAboutEntryPoseT(projectExitT);
    const nudge = pinballAboutEntryCardNudge(entryPoseT);
    if (nudge !== 0) return nudge;
  }
  if (cardIndex === 0 && !showLandedOrb) {
    return pinballCardFallNudge(fallPhase);
  }

  if (showLandedOrb) {
    return pinballHopCardNudge(cardIndex, horizontalProgress, cardCount);
  }

  return 0;
}
