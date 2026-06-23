"use client";

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { FlowerGraphicClient } from "@/components/FlowerGraphicClient";
import {
  pinballFallBallScale,
  pinballFallPose,
  pinballFallRotation,
  type FallPoint,
} from "@/lib/animation/pinballBounce";
import { sampleFallTrail } from "@/lib/animation/ballPathTrail";
import { BallPathTrail } from "@/components/parallax/BallPathTrail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BALL_ASSET } from "@/lib/assets";
import { readBallSize, ballNotchTransform, readBioBallRestPoint, BALL_NOTCH_ORIGIN } from "@/lib/layout/ballSize";
import type { HeroParallaxValues } from "@/lib/parallax/heroParallax";

type FloatingOrbProps = {
  values: HeroParallaxValues;
  anchorRef: RefObject<HTMLSpanElement | null>;
  bioShelfRef: RefObject<HTMLDivElement | null>;
  bioCopyRef: RefObject<HTMLParagraphElement | null>;
  landTargetRef: RefObject<HTMLDivElement | null>;
};

type OrbPoint = { x: number; y: number; size: number };

function readFlowerBaseSize(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--figma-flower-size")
    .trim();
  const parsed = parseFloat(raw);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return Math.min(400.59, window.innerWidth * (400.59 / 1440));
}

export function FloatingOrb({
  values,
  anchorRef,
  bioShelfRef,
  bioCopyRef,
  landTargetRef,
}: FloatingOrbProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [anchorPoint, setAnchorPoint] = useState<OrbPoint | null>(null);
  const [fallWaypoints, setFallWaypoints] = useState<{
    start: FallPoint;
    bio: FallPoint;
    card: FallPoint;
    size: number;
  } | null>(null);

  const measure = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const anchorRect = anchor.getBoundingClientRect();
    const fontSize = parseFloat(getComputedStyle(anchor).fontSize) || 200;
    const flowerFull = readFlowerBaseSize();
    const flowerSize = values.orbFlowerScale * flowerFull;
    const ballSize = readBallSize();

    setAnchorPoint({
      x: anchorRect.left + values.orbLeftEm * fontSize,
      y: anchorRect.top + values.orbTopEm * fontSize,
      size: flowerSize,
    });

    const fixedY = window.innerHeight * values.orbFixedTopRatio;

    const bioShelf = bioShelfRef.current;
    const bioCopy = bioCopyRef.current;
    const land = landTargetRef.current;

    if (!bioShelf || !bioCopy) return;

    const bioPoint = readBioBallRestPoint(
      bioShelf.getBoundingClientRect(),
      bioCopy.getBoundingClientRect(),
    );

    let cardPoint: FallPoint = bioPoint;

    if (land) {
      const card = land.closest(".project-card");
      const frame = card?.querySelector(
        ".project-card-frame",
      ) as HTMLElement | null;
      const landRect =
        frame?.getBoundingClientRect() ?? land.getBoundingClientRect();
      cardPoint = {
        x: landRect.left + landRect.width / 2,
        y: landRect.top,
      };
    }

    setFallWaypoints({
      // Park straight above the bio so the ball drops onto it — no center detour.
      start: { x: bioPoint.x, y: fixedY },
      bio: bioPoint,
      card: cardPoint,
      size: ballSize,
    });
  }, [
    anchorRef,
    bioShelfRef,
    bioCopyRef,
    landTargetRef,
    values.orbFixedTopRatio,
    values.orbFlowerScale,
    values.orbLeftEm,
    values.orbTopEm,
  ]);

  useLayoutEffect(() => {
    measure();
  }, [measure, values.fallPhase, values.orbFixedMix, values.ballMix]);

  useLayoutEffect(() => {
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const style = useMemo(() => {
    if (!anchorPoint) return null;

    // Travel toward the same point the fall starts from (directly above bio).
    const fixedY = fallWaypoints
      ? fallWaypoints.start.y
      : window.innerHeight * values.orbFixedTopRatio;
    const fixedX = fallWaypoints
      ? fallWaypoints.start.x
      : window.innerWidth / 2;
    const fixedSize = readBallSize();
    const ballMix = values.ballMix;
    const morphedSize = anchorPoint.size * (1 - ballMix) + fixedSize * ballMix;

    const t = values.orbFixedMix;
    let x = anchorPoint.x + (fixedX - anchorPoint.x) * t;
    let y = anchorPoint.y + (fixedY - anchorPoint.y) * t;
    let size = anchorPoint.size * (1 - t) + morphedSize * t;

    let ballScale = { sx: 1, sy: 1 };
    let ballRotation = 0;
    const showBall = ballMix > 0.02;
    // ball.png is authored for notch landing — center anchor overlaps bio copy.
    const useNotchAnchor =
      showBall &&
      (values.fallPhase > 0 ||
        values.orbFixedMix > 0.12 ||
        ballMix > 0.55);

    if (values.fallPhase > 0 && fallWaypoints) {
      const pose = pinballFallPose(
        values.fallPhase,
        fallWaypoints,
        fixedSize,
        typeof window !== "undefined" ? window.innerHeight : undefined,
      );
      x = pose.x;
      y = pose.y;
      size = fallWaypoints.size;
      ballScale = pinballFallBallScale(values.fallPhase, fixedSize);
      ballRotation = pinballFallRotation(
        values.fallPhase,
        fallWaypoints,
        fixedSize,
        typeof window !== "undefined" ? window.innerHeight : undefined,
      );
    } else if (ballMix >= 1) {
      size = fixedSize;
    }

    const flowerOpacity = 1 - ballMix;
    const ballOpacity = ballMix;

    return {
      x,
      y,
      size,
      flowerOpacity,
      ballOpacity,
      ballScale,
      ballRotation,
      useNotchAnchor: Boolean(useNotchAnchor),
    };
  }, [anchorPoint, fallWaypoints, values]);

  const fallTrailPoints = useMemo(() => {
    if (reducedMotion || !fallWaypoints || values.fallPhase <= 0) {
      return [];
    }

    const ballSize = fallWaypoints.size;
    const points = sampleFallTrail(
      values.fallPhase,
      fallWaypoints,
      ballSize,
      56,
      typeof window !== "undefined" ? window.innerHeight : undefined,
    );

    // Trail follows ball center (pose y is notch bottom).
    return points.map((point) => ({
      x: point.x,
      y: point.y - ballSize * 0.5,
    }));
  }, [fallWaypoints, reducedMotion, values.fallPhase]);

  if (!style) {
    return null;
  }

  if (style.flowerOpacity < 0.02 && style.ballOpacity < 0.02) {
    return null;
  }

  return (
    <>
      {fallTrailPoints.length > 1 ? (
        <BallPathTrail
          points={fallTrailPoints}
          className="z-[38]"
          maxOpacity={0.26}
        />
      ) : null}

      <div
        className="pointer-events-none fixed z-40"
        style={{
          left: style.x,
          top: style.y,
          width: style.size,
          height: style.size,
          transform: style.useNotchAnchor
            ? ballNotchTransform(
                style.ballScale.sx,
                style.ballScale.sy,
                style.ballRotation,
              )
            : `translate(-50%, -50%) rotate(${style.ballRotation.toFixed(2)}deg)`,
          transformOrigin: style.useNotchAnchor ? BALL_NOTCH_ORIGIN : "50% 50%",
          willChange: "transform, left, top",
        }}
        aria-hidden="true"
      >
      {style.flowerOpacity > 0.02 ? (
        <div className="absolute inset-0" style={{ opacity: style.flowerOpacity }}>
          <FlowerGraphicClient className="h-full w-full" />
        </div>
      ) : null}

      {style.ballOpacity > 0.02 ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: style.ballOpacity,
            transform: style.useNotchAnchor
              ? undefined
              : `scale(${style.ballScale.sx}, ${style.ballScale.sy})`,
            filter: "drop-shadow(0 1px 4px rgb(0 0 0 / 0.1))",
          }}
        >
          <img
            src={BALL_ASSET}
            alt=""
            className="parallax-scroll-ball h-full w-full object-contain"
            draggable={false}
          />
        </div>
      ) : null}
    </div>
    </>
  );
}
