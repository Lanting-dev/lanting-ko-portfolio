"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  isHopInFlight,
  pinballHopBallScale,
  pinballHopPose,
  pinballHopRotation,
  PINBALL_SETTLE_AT,
  resolveHopSegment,
} from "@/lib/animation/pinballBounce";
import { sampleHopTrail } from "@/lib/animation/ballPathTrail";
import { BallPathTrail } from "@/components/parallax/BallPathTrail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BALL_ASSET } from "@/lib/assets";
import {
  captureEntryWaypoints,
  computeAboutEntryBallPose,
  computeAboutEntrySegmentT,
  sampleAboutExitTrail,
  type EntryWaypoints,
} from "@/lib/about/aboutEntryPose";
import {
  isProjectEntryBallActive,
  isProjectExitFallActive,
} from "@/lib/projects/projectScroll";
import { measureProjectCardSlots } from "@/lib/layout/ballAnchors";
import type { BallHandoffPose } from "@/lib/layout/ballHandoff";
import { readBallSize, ballNotchTransform, BALL_NOTCH_ORIGIN } from "@/lib/layout/ballSize";

type OrbPoint = { x: number; y: number };

type BallPose = {
  x: number;
  y: number;
  scale: { sx: number; sy: number };
  rotation: number;
  inFlight: boolean;
};

type ProjectBallRiderProps = {
  slotRefs: RefObject<(HTMLDivElement | null)[]>;
  cardCount: number;
  horizontalProgress: number;
  projectExitT?: number;
  aboutProgress?: number;
  lastBallSlotRef?: RefObject<HTMLElement | null>;
  profileBallSlotRef?: RefObject<HTMLElement | null>;
  handoffPoseRef?: RefObject<BallHandoffPose | null>;
  visible: boolean;
};

function trailFromNotch(
  points: { x: number; y: number }[],
  ballSize: number,
): { x: number; y: number }[] {
  return points.map((point) => ({
    x: point.x,
    y: point.y - ballSize * 0.5,
  }));
}

export function ProjectBallRider({
  slotRefs,
  cardCount,
  horizontalProgress,
  projectExitT = 0,
  aboutProgress = 0,
  lastBallSlotRef,
  profileBallSlotRef,
  handoffPoseRef,
  visible,
}: ProjectBallRiderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [slots, setSlots] = useState<OrbPoint[]>([]);
  const [ballSize, setBallSize] = useState(() => readBallSize());
  const [entryWaypoints, setEntryWaypoints] = useState<EntryWaypoints | null>(
    null,
  );
  const lastPoseRef = useRef<BallPose | null>(null);

  const entryWaypointsRef = useRef<EntryWaypoints | null>(null);

  const entryFallActive = isProjectExitFallActive(projectExitT);
  const entryPhaseActive = isProjectEntryBallActive(projectExitT, aboutProgress);
  const entryProgress = Math.min(projectExitT, 1);

  const hop = useMemo(
    () => resolveHopSegment(horizontalProgress, cardCount),
    [cardCount, horizontalProgress],
  );

  const measure = useCallback(() => {
    const points = measureProjectCardSlots(slotRefs, cardCount);
    if (points.length < cardCount) return;

    setSlots(points);
    setBallSize(readBallSize());
  }, [cardCount, slotRefs]);

  useLayoutEffect(() => {
    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [measure, horizontalProgress, projectExitT, aboutProgress]);

  useLayoutEffect(() => {
    if (!visible) return;
    measure();
  }, [measure, visible]);

  useLayoutEffect(() => {
    if (projectExitT <= 0) {
      entryWaypointsRef.current = null;
      setEntryWaypoints(null);
      return;
    }

    if (entryWaypointsRef.current || !lastBallSlotRef || !profileBallSlotRef) return;

    const captured = captureEntryWaypoints(
      lastBallSlotRef,
      profileBallSlotRef,
      handoffPoseRef?.current,
      ballSize,
    );
    if (captured) {
      entryWaypointsRef.current = captured;
      setEntryWaypoints(captured);
    }
  }, [
    ballSize,
    entryWaypoints,
    handoffPoseRef,
    lastBallSlotRef,
    profileBallSlotRef,
    projectExitT,
  ]);

  const pose = useMemo(() => {
    if (!visible) return null;

    if (entryPhaseActive && lastBallSlotRef && profileBallSlotRef) {
      const locked =
        entryWaypointsRef.current ??
        captureEntryWaypoints(
          lastBallSlotRef,
          profileBallSlotRef,
          handoffPoseRef?.current,
          ballSize,
        );
      if (!locked) return lastPoseRef.current;

      if (!entryWaypointsRef.current) {
        entryWaypointsRef.current = locked;
      }

      return computeAboutEntryBallPose(
        locked,
        profileBallSlotRef,
        lastBallSlotRef,
        entryProgress,
        ballSize,
        handoffPoseRef?.current,
      );
    }

    const resolvedSlots =
      slots.length >= cardCount
        ? slots
        : measureProjectCardSlots(slotRefs, cardCount);

    if (resolvedSlots.length < cardCount) {
      return lastPoseRef.current;
    }

    const from = resolvedSlots[hop.segmentIndex];
    const to = resolvedSlots[Math.min(hop.segmentIndex + 1, cardCount - 1)];

    const settledOnLast =
      hop.segmentIndex >= cardCount - 2 && hop.localT >= PINBALL_SETTLE_AT;
    if (
      settledOnLast &&
      lastPoseRef.current &&
      typeof window !== "undefined" &&
      !entryPhaseActive &&
      (from.y < 0 ||
        from.x < 0 ||
        from.x > window.innerWidth ||
        from.y > window.innerHeight)
    ) {
      return lastPoseRef.current;
    }

    const point = pinballHopPose(from, to, hop.localT, ballSize);
    const scale = pinballHopBallScale(hop.localT, from, to, ballSize);
    const rotation = pinballHopRotation(from, to, hop.localT, ballSize);

    return { ...point, scale, rotation, inFlight: isHopInFlight(hop.localT) };
  }, [
    ballSize,
    cardCount,
    entryProgress,
    entryPhaseActive,
    entryWaypoints,
    hop.localT,
    hop.segmentIndex,
    lastBallSlotRef,
    profileBallSlotRef,
    slotRefs,
    slots,
    visible,
  ]);

  if (pose) {
    lastPoseRef.current = pose;
  }

  useLayoutEffect(() => {
    if (!visible || !handoffPoseRef || !pose) return;

    if (entryPhaseActive) {
      handoffPoseRef.current = {
        x: pose.x,
        y: pose.y,
        scale: { ...pose.scale },
        rotation: pose.rotation,
      };
      return;
    }

    if (hop.segmentIndex < cardCount - 2) return;

    handoffPoseRef.current = {
      x: pose.x,
      y: pose.y,
      scale: { ...pose.scale },
      rotation: pose.rotation,
    };
  }, [
    cardCount,
    entryPhaseActive,
    entryFallActive,
    handoffPoseRef,
    hop.segmentIndex,
    pose,
    visible,
  ]);

  const hopTrailPoints = useMemo(() => {
    if (reducedMotion || !visible || !pose) {
      return [];
    }

    const lockedWaypoints = entryWaypointsRef.current ?? entryWaypoints;

    if (entryPhaseActive && lockedWaypoints && profileBallSlotRef && lastBallSlotRef) {
      const entrySegmentT = computeAboutEntrySegmentT(entryProgress);
      if (entrySegmentT <= 0.01) return [];

      return trailFromNotch(
        sampleAboutExitTrail(
          lockedWaypoints,
          profileBallSlotRef,
          lastBallSlotRef,
          entrySegmentT,
          ballSize,
        ),
        ballSize,
      );
    }

    if (hop.localT <= 0.02) return [];

    const resolvedSlots =
      slots.length >= cardCount
        ? slots
        : measureProjectCardSlots(slotRefs, cardCount);
    if (resolvedSlots.length < cardCount) return [];

    const from = resolvedSlots[hop.segmentIndex];
    const to = resolvedSlots[Math.min(hop.segmentIndex + 1, cardCount - 1)];

    return sampleHopTrail(from, to, hop.localT, ballSize);
  }, [
    ballSize,
    cardCount,
    entryProgress,
    entryPhaseActive,
    entryWaypoints,
    hop.localT,
    hop.segmentIndex,
    pose,
    profileBallSlotRef,
    reducedMotion,
    slotRefs,
    slots,
    visible,
  ]);

  if (!visible) {
    return null;
  }

  const displayPose = pose ?? lastPoseRef.current;
  if (!displayPose) return null;

  return (
    <>
      {hopTrailPoints.length > 1 ? (
        <BallPathTrail points={hopTrailPoints} className="z-[55]" maxOpacity={0.22} />
      ) : null}

      <div
        className="pointer-events-none fixed z-[60]"
        style={{
          left: displayPose.x,
          top: displayPose.y,
          width: ballSize,
          height: ballSize,
          transform: ballNotchTransform(
            displayPose.scale.sx,
            displayPose.scale.sy,
            displayPose.rotation,
          ),
          transformOrigin: BALL_NOTCH_ORIGIN,
          willChange: "transform, left, top",
        }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BALL_ASSET}
          alt=""
          className="parallax-scroll-ball h-full w-full object-contain"
          draggable={false}
        />
      </div>
    </>
  );
}
