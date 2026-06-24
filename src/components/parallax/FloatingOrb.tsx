"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { BallPathTrail } from "@/components/parallax/BallPathTrail";
import {
  heroBallFallOpacity,
  heroBallFallPose,
  heroBallFallScale,
  readLiveImpactCenter,
  sampleHeroFallTrail,
  type FallWaypoints,
} from "@/lib/animation/heroBallFall";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BALL_ASSET } from "@/lib/assets";
import {
  readBallSize,
  ballNotchTransform,
  ballCenterToNotchBottom,
  readKoBallCenter,
  BALL_NOTCH_ORIGIN,
} from "@/lib/layout/ballSize";
import { useParallaxValue } from "./ParallaxEngineProvider";

type FloatingOrbProps = {
  anchorRef: RefObject<HTMLSpanElement | null>;
  workImpactRef: RefObject<HTMLDivElement | null>;
};

export function FloatingOrb({ anchorRef, workImpactRef }: FloatingOrbProps) {
  const ballJourney = useParallaxValue((s) => s.ballJourneyProgress);
  const projectProgress = useParallaxValue((s) => s.projectProgress);
  const reducedMotion = usePrefersReducedMotion();
  const [ballSize, setBallSize] = useState(() => readBallSize());
  const [waypoints, setWaypoints] = useState<FallWaypoints | null>(null);
  const startRef = useRef<FallWaypoints["start"] | null>(null);
  const impactFrozenRef = useRef<FallWaypoints["impact"] | null>(null);
  const lastWaypointsRef = useRef<FallWaypoints | null>(null);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor || ballJourney <= 0) return;

    const size = readBallSize();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    if (!startRef.current) {
      const koRect = anchor.getBoundingClientRect();
      if (koRect.bottom < 0 || koRect.top > vh || koRect.top > vh * 0.62) return;
      startRef.current = ballCenterToNotchBottom(readKoBallCenter(koRect), size);
    }

    const impactCenter = readLiveImpactCenter(
      workImpactRef.current,
      projectProgress,
      vw,
      vh,
    );
    const impactPoint = ballCenterToNotchBottom(impactCenter, size);

    if (
      projectProgress >= 0.04 &&
      ballJourney >= 0.45 &&
      !impactFrozenRef.current
    ) {
      impactFrozenRef.current = impactPoint;
    }

    const next: FallWaypoints = {
      start: startRef.current,
      impact: impactFrozenRef.current ?? impactPoint,
    };

    lastWaypointsRef.current = next;
    setBallSize(size);
    setWaypoints(next);
  }, [anchorRef, ballJourney, projectProgress, workImpactRef]);

  useLayoutEffect(() => {
    measure();
  }, [measure, ballJourney, projectProgress]);

  useLayoutEffect(() => {
    const onResize = () => {
      startRef.current = null;
      impactFrozenRef.current = null;
      measure();
    };

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  useLayoutEffect(() => {
    if (ballJourney <= 0) {
      startRef.current = null;
      impactFrozenRef.current = null;
    }
  }, [ballJourney]);

  const points = waypoints ?? lastWaypointsRef.current;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;

  const pose = useMemo(() => {
    if (!points) return null;
    return heroBallFallPose(ballJourney, points, projectProgress, vh, vw);
  }, [ballJourney, points, projectProgress, vh, vw]);

  const ballScale = useMemo(
    () => heroBallFallScale(ballJourney),
    [ballJourney],
  );

  const ballOpacity = useMemo(
    () => heroBallFallOpacity(ballJourney),
    [ballJourney],
  );

  const trailPoints = useMemo(() => {
    if (reducedMotion || !points || ballJourney <= 0) return [];
    return sampleHeroFallTrail(
      ballJourney,
      points,
      projectProgress,
      vh,
      vw,
      ballSize,
      14,
    );
  }, [ballJourney, ballSize, points, projectProgress, reducedMotion, vh, vw]);

  if (!pose || ballOpacity < 0.02) return null;

  return (
    <>
      {trailPoints.length > 1 ? (
        <BallPathTrail
          points={trailPoints}
          className="z-[38]"
          maxOpacity={0.22 * ballOpacity}
        />
      ) : null}

      <div
        className="pointer-events-none fixed z-40"
        style={{
          left: pose.x,
          top: pose.y,
          width: ballSize,
          height: ballSize,
          opacity: ballOpacity,
          transform: ballNotchTransform(ballScale.sx, ballScale.sy, 0),
          transformOrigin: BALL_NOTCH_ORIGIN,
          willChange: "transform, left, top, opacity",
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
