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
import { BallPathTrail } from "@/components/parallax/BallPathTrail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BALL_ASSET } from "@/lib/assets";
import {
  readFooterSandEntry,
  readFooterSandImpact,
} from "@/lib/footer/footerBallAnchors";
import { getFooterScrollValues } from "@/lib/footer/footerScroll";
import {
  readBallSize,
  ballNotchTransform,
  BALL_NOTCH_ORIGIN,
} from "@/lib/layout/ballSize";

type FooterBallRiderProps = {
  footerProgress: number;
  sandEntryRef: RefObject<HTMLElement | null>;
  sandImpactRef: RefObject<HTMLElement | null>;
  visible: boolean;
};

export function FooterBallRider({
  footerProgress,
  sandEntryRef,
  sandImpactRef,
  visible,
}: FooterBallRiderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [ballSize, setBallSize] = useState(() => readBallSize());
  const lastPoseRef = useRef<{
    x: number;
    y: number;
    sx: number;
    sy: number;
    rotation: number;
  } | null>(null);

  const values = useMemo(
    () => getFooterScrollValues(footerProgress),
    [footerProgress],
  );

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

  const hopOptions = useMemo(() => ({ peakBiasX: 0.48, arcScale: 0.82 }), []);

  const pose = useMemo(() => {
    if (!visible) return null;

    const entry = readFooterSandEntry(sandEntryRef, sandImpactRef, ballSize);
    const impact = readFooterSandImpact(sandImpactRef);
    if (!entry || !impact) return null;

    const fallT = values.ballFall;
    const point = pinballHopPose(entry, impact, fallT, ballSize, hopOptions);
    const scale = pinballHopBallScale(fallT, entry, impact, ballSize, hopOptions);
    const rotation = pinballHopRotation(
      entry,
      impact,
      fallT,
      ballSize,
      hopOptions,
    );

    const squashY = 1 - values.ballSquash;
    const squashX = 1 + values.ballSquash * 0.65;

    return {
      x: point.x,
      y: point.y + values.ballBouncePx,
      sx: scale.sx * squashX,
      sy: scale.sy * squashY,
      rotation,
      inFlight: fallT > 0.02 && fallT < 0.98,
    };
  }, [
    ballSize,
    hopOptions,
    sandEntryRef,
    sandImpactRef,
    values.ballBouncePx,
    values.ballFall,
    values.ballSquash,
    visible,
  ]);

  if (pose) {
    lastPoseRef.current = pose;
  }

  const trailPoints = useMemo(() => {
    if (reducedMotion || !visible || values.ballFall <= 0.02) return [];

    const entry = readFooterSandEntry(sandEntryRef, sandImpactRef, ballSize);
    const impact = readFooterSandImpact(sandImpactRef);
    if (!entry || !impact) return [];

    const count = 36;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= count; i += 1) {
      const tt = (i / count) * values.ballFall;
      const p = pinballHopPose(entry, impact, tt, ballSize, hopOptions);
      points.push({ x: p.x, y: p.y - ballSize * 0.5 });
    }
    return points;
  }, [
    ballSize,
    footerProgress,
    hopOptions,
    reducedMotion,
    sandEntryRef,
    sandImpactRef,
    values.ballFall,
    visible,
  ]);

  const displayPose = visible ? (pose ?? lastPoseRef.current) : null;
  if (!visible || !displayPose) return null;

  return (
    <>
      {trailPoints.length > 1 ? (
        <BallPathTrail points={trailPoints} className="z-[62]" maxOpacity={0.22} />
      ) : null}

      <div
        className="pointer-events-none fixed z-[63]"
        style={{
          left: displayPose.x,
          top: displayPose.y,
          width: ballSize,
          height: ballSize,
          transform: ballNotchTransform(
            displayPose.sx,
            displayPose.sy,
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
