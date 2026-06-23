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
  pinballHopBallScale,
  pinballHopPose,
  pinballHopRotation,
} from "@/lib/animation/pinballBounce";
import { clamp } from "@/lib/dither/bayer";
import { BallPathTrail } from "@/components/parallax/BallPathTrail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BALL_ASSET } from "@/lib/assets";
import {
  readProfileTopCenter,
  type BallAnchorPoint,
} from "@/lib/layout/ballAnchors";
import { readViewportSize } from "@/lib/layout/ballViewport";
import {
  readBallSize,
  ballNotchTransform,
  BALL_NOTCH_ORIGIN,
} from "@/lib/layout/ballSize";
import {
  readFooterSandEntry,
} from "@/lib/footer/footerBallAnchors";
import { FOOTER_BALL_HANDOFF } from "@/lib/footer/footerScroll";

import type { BallHandoffPose } from "@/lib/layout/ballHandoff";

type BallPose = {
  x: number;
  y: number;
  scale: { sx: number; sy: number };
  rotation: number;
  inFlight: boolean;
};

type AboutBallRiderProps = {
  lastBallSlotRef?: RefObject<HTMLElement | null>;
  profileBallSlotRef: RefObject<HTMLElement | null>;
  handoffPoseRef?: RefObject<BallHandoffPose | null>;
  aboutProgress: number;
  profileImpactComplete?: boolean;
  projectExitT?: number;
  visible: boolean;
  sandEntryRef?: RefObject<HTMLElement | null>;
  sandImpactRef?: RefObject<HTMLElement | null>;
  footerProgress?: number;
};

function resolveCubeTop(
  profileBallSlotRef: RefObject<HTMLElement | null>,
  ballSize: number,
): BallAnchorPoint {
  const cube = readProfileTopCenter(profileBallSlotRef);
  if (cube) return cube;
  const viewport = readViewportSize();
  return {
    x: (viewport?.width ?? 1024) / 2,
    y: (viewport?.height ?? 768) * 0.46 - ballSize,
  };
}

export function AboutBallRider({
  profileBallSlotRef,
  aboutProgress,
  visible,
  sandEntryRef,
  sandImpactRef,
  footerProgress = 0,
}: AboutBallRiderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [ballSize, setBallSize] = useState(() => readBallSize());
  const lastPoseRef = useRef<BallPose | null>(null);

  const measure = useCallback(() => {
    setBallSize(readBallSize());
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Option A: the project ball already landed on the cube. On contact the ball
  // bounces off in a natural ballistic arc (like the project-card hops) — pops
  // up, peaks, then falls away off-screen down-and-right while the cube spins.
  const hopT = clamp(aboutProgress / 0.32, 0, 1);
  const hopOptions = useMemo(() => ({ peakBiasX: 0.5, arcScale: 1.15 }), []);

  // Bounce off a FIXED contact point (the cube is still rising; tracking its live
  // top would drag the ball up with it and look stuck). 0.72vh matches the ball's
  // fall rest height in computeAboutEntryBallPose.
  const bounce = useMemo(() => {
    const cubeTop = resolveCubeTop(profileBallSlotRef, ballSize);
    const vh = readViewportSize()?.height ?? 900;
    const sandEntry = sandEntryRef
      ? readFooterSandEntry(sandEntryRef, sandImpactRef ?? { current: null }, ballSize)
      : null;

    return {
      impact: { x: cubeTop.x, y: vh * 0.72 },
      target: sandEntry ?? {
        x: cubeTop.x + ballSize * 0.6,
        y: vh * 0.88,
      },
    };
    // aboutProgress / footerProgress are recompute triggers, not values used
    // inside: the sand entry rect moves with scroll, so the ball's landing
    // target must stay live to line up with FooterBallRider at the handoff.
  }, [
    ballSize,
    profileBallSlotRef,
    sandEntryRef,
    sandImpactRef,
    aboutProgress,
    footerProgress,
  ]);

  const pose = useMemo<BallPose | null>(() => {
    if (!visible) return null;
    const { impact, target } = bounce;
    const point = pinballHopPose(impact, target, hopT, ballSize, hopOptions);

    return {
      x: point.x,
      y: point.y,
      scale: pinballHopBallScale(hopT, impact, target, ballSize, hopOptions),
      rotation: pinballHopRotation(impact, target, hopT, ballSize, hopOptions),
      inFlight: hopT > 0.02 && hopT < 0.98,
    };
  }, [ballSize, bounce, hopOptions, hopT, visible]);

  if (pose) {
    lastPoseRef.current = pose;
  }

  const trailPoints = useMemo(() => {
    if (reducedMotion || !visible || hopT <= 0.02) return [];
    const { impact, target } = bounce;
    const count = 40;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= count; i += 1) {
      const tt = (i / count) * hopT;
      const p = pinballHopPose(impact, target, tt, ballSize, hopOptions);
      points.push({ x: p.x, y: p.y - ballSize * 0.5 });
    }
    return points;
  }, [ballSize, bounce, hopOptions, hopT, reducedMotion, visible]);

  const displayPose =
    visible && footerProgress < FOOTER_BALL_HANDOFF
      ? (pose ?? lastPoseRef.current)
      : null;
  if (!displayPose) return null;

  return (
    <>
      {trailPoints.length > 1 ? (
        <BallPathTrail points={trailPoints} className="z-[55]" maxOpacity={0.24} />
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
