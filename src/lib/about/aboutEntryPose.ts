import type { RefObject } from "react";
import {
  ABOUT_ROLL_END,
  pinballAboutEntryBallScale,
  pinballAboutEntryRollProgress,
} from "@/lib/animation/pinballBounce";
import { clamp } from "@/lib/dither/bayer";
import {
  readEstimatedCardRollEdge,
  readEstimatedProfileTopCenter,
  readProfileTopCenter,
  readProjectCardRollEdge,
  readProjectCardTopCenter,
} from "@/lib/layout/ballAnchors";
import { readViewportSize } from "@/lib/layout/ballViewport";
import type { BallHandoffPose } from "@/lib/layout/ballHandoff";
export type OrbPoint = { x: number; y: number };

export type EntryWaypoints = {
  from: OrbPoint;
  edge: OrbPoint;
  impact: OrbPoint;
};

export type EntryBallPose = BallHandoffPose & {
  inFlight: boolean;
};

export function resolveLiveImpact(
  profileBallSlotRef: RefObject<HTMLElement | null>,
  from: OrbPoint,
): OrbPoint {
  return (
    readProfileTopCenter(profileBallSlotRef) ??
    readEstimatedProfileTopCenter(from)
  );
}

export function resolveLiveEdge(
  lastBallSlotRef: RefObject<HTMLElement | null>,
  from: OrbPoint,
  ballSize: number,
): OrbPoint {
  return (
    readProjectCardRollEdge(lastBallSlotRef.current, ballSize) ??
    readEstimatedCardRollEdge(from, ballSize)
  );
}

export function computeAboutEntrySegmentT(entryProgress: number): number {
  return clamp(entryProgress, 0, 1);
}

export function buildEntryTargetsUsed(
  locked: EntryWaypoints,
  liveEdge: OrbPoint,
  liveImpact: OrbPoint,
  entrySegmentT: number,
): { edge: OrbPoint; impact: OrbPoint } {
  const rollBlend = clamp(entrySegmentT / ABOUT_ROLL_END, 0, 1);
  const fallBlend = Math.min(entrySegmentT * 1.12, 1);
  const onRoll = entrySegmentT <= ABOUT_ROLL_END;

  return {
    edge: {
      x: locked.edge.x + (liveEdge.x - locked.edge.x) * rollBlend * 0.65,
      y: onRoll ? liveEdge.y : locked.edge.y + (liveEdge.y - locked.edge.y) * rollBlend * 0.5,
    },
    impact: {
      x: locked.impact.x + (liveImpact.x - locked.impact.x) * fallBlend,
      y: locked.impact.y + (liveImpact.y - locked.impact.y) * fallBlend,
    },
  };
}

export function captureEntryWaypoints(
  lastBallSlotRef: RefObject<HTMLElement | null>,
  profileBallSlotRef: RefObject<HTMLElement | null>,
  handoff?: BallHandoffPose | null,
  ballSize = 53,
): EntryWaypoints | null {
  const from = handoff
    ? { x: handoff.x, y: handoff.y }
    : readProjectCardTopCenter(lastBallSlotRef.current);
  if (!from) return null;

  const edge =
    readProjectCardRollEdge(lastBallSlotRef.current, ballSize) ??
    readEstimatedCardRollEdge(from, ballSize);

  return {
    from: { ...from },
    edge: { ...edge },
    impact: { ...resolveLiveImpact(profileBallSlotRef, from) },
  };
}

export function computeAboutEntryBallPose(
  locked: EntryWaypoints,
  profileBallSlotRef: RefObject<HTMLElement | null>,
  lastBallSlotRef: RefObject<HTMLElement | null>,
  entryProgress: number,
  ballSize: number,
  rollFrom?: OrbPoint | null,
): EntryBallPose {
  const t = computeAboutEntrySegmentT(entryProgress);
  const viewport = readViewportSize();
  const vh = viewport?.height ?? 900;
  const liveEdge = resolveLiveEdge(lastBallSlotRef, locked.from, ballSize);

  const liveCardTop = readProjectCardTopCenter(lastBallSlotRef.current);
  const surfaceY = liveCardTop?.y ?? locked.from.y;
  // Roll origin must be a STABLE card position, not the live handoff ref
  // (handoffPoseRef is overwritten with our own pose each frame → feedback loop).
  const startX = liveCardTop?.x ?? locked.from.x;
  const edgeX = liveEdge.x;
  // Option A: the ball NEVER leaves the screen. It rolls off the card edge then
  // falls, and lands on the About cube top as the cube rises into view from
  // below. The fall is clamped on-screen so there is never an empty frame.
  const cube = resolveLiveImpact(profileBallSlotRef, locked.from);

  let x: number;
  let y: number;
  let rolledDist: number;

  if (t <= ABOUT_ROLL_END) {
    const u = t / ABOUT_ROLL_END;
    const roll = pinballAboutEntryRollProgress(u);
    x = startX + (edgeX - startX) * roll;
    y = surfaceY;
    rolledDist = x - startX;
  } else {
    const u = (t - ABOUT_ROLL_END) / (1 - ABOUT_ROLL_END);
    const drop = u * u; // gravity ease-in
    // Fall to the height where the rising cube first meets the ball. The About
    // lead is tuned so the bounce/spin trigger exactly at this contact point.
    const fallY = surfaceY + (vh * 0.72 - surfaceY) * drop;
    const landedY = Math.min(fallY, cube.y);
    y = clamp(landedY, surfaceY, vh * 0.8);
    const s = u * u * (3 - 2 * u);
    x = edgeX + (cube.x - edgeX) * s; // drift toward the cube centre as it lands
    rolledDist = edgeX - startX;
  }

  const rotation = (rolledDist / (Math.PI * ballSize)) * 360;
  const start: OrbPoint = { x: startX, y: surfaceY };
  const rollEdge: OrbPoint = { x: edgeX, y: surfaceY };

  return {
    x,
    y,
    scale: pinballAboutEntryBallScale(t, ballSize, start, rollEdge),
    rotation,
    inFlight: t > 0.005 && t < 0.995,
  };
}

/** Trail points that exactly follow the project-exit roll-and-drop path. */
export function sampleAboutExitTrail(
  locked: EntryWaypoints,
  profileBallSlotRef: RefObject<HTMLElement | null>,
  lastBallSlotRef: RefObject<HTMLElement | null>,
  entryProgress: number,
  ballSize: number,
  count = 32,
): OrbPoint[] {
  const points: OrbPoint[] = [];
  for (let i = 0; i <= count; i += 1) {
    const tt = (i / count) * entryProgress;
    const p = computeAboutEntryBallPose(
      locked,
      profileBallSlotRef,
      lastBallSlotRef,
      tt,
      ballSize,
    );
    points.push({ x: p.x, y: p.y });
  }
  return points;
}
