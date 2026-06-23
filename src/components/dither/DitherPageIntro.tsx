"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { IntroCrossStitchCanvas } from "./IntroCrossStitchCanvas";

const INTRO_MS = 3500;
/** Full stitch visible at 100% before overlay exit begins. */
const HOLD_AT_100_MS = 900;
/** Sand fall + pile on white overlay before fade-out. */
const PILE_MS = 1650;
const OVERLAY_FADE_MS = 750;

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

type DitherPageIntroProps = {
  captureRef: RefObject<HTMLElement | null>;
  /** Sand pile finished — hero reveal + overlay fade begin together. */
  onExitStart?: () => void;
  onComplete: () => void;
};

export function DitherPageIntro({
  captureRef,
  onExitStart,
  onComplete,
}: DitherPageIntroProps) {
  const progressRef = useRef(0);
  const exitDriftRef = useRef(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [percentVisible, setPercentVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [captureReady, setCaptureReady] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const exitStartedRef = useRef(false);

  const handleCaptureReady = useCallback(() => {
    setCaptureReady(true);
  }, []);

  useEffect(() => {
    if (!captureReady) return;
    const id = requestAnimationFrame(() => setPercentVisible(true));
    return () => cancelAnimationFrame(id);
  }, [captureReady]);

  useEffect(() => {
    if (!captureReady) return;

    let raf = 0;
    let holdTimeout = 0;
    let completeTimeout = 0;
    let driftFrame = 0;

    const finishPile = () => {
      exitDriftRef.current = 1;
      onExitStart?.();
      setIsExiting(true);
      completeTimeout = window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }, OVERLAY_FADE_MS);
    };

    const startExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;

      let frame = 0;
      const driftStart = performance.now();

      const driftTick = (now: number) => {
        const linear = Math.min(1, (now - driftStart) / PILE_MS);
        exitDriftRef.current = smoothstep(linear);

        if (linear < 1) {
          frame = requestAnimationFrame(driftTick);
          driftFrame = frame;
          return;
        }

        finishPile();
      };

      frame = requestAnimationFrame(driftTick);
      driftFrame = frame;
    };

    const tick = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / INTRO_MS);
      progressRef.current = t;
      setDisplayPercent(Math.round(t * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!exitStartedRef.current) {
        holdTimeout = window.setTimeout(startExit, HOLD_AT_100_MS);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(driftFrame);
      window.clearTimeout(holdTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [captureReady, onComplete, onExitStart]);

  return (
    <div
      className={`intro-overlay-panel fixed inset-0 z-[100] flex flex-col bg-white ${
        isExiting ? "is-exiting" : ""
      }`}
      aria-hidden={isExiting}
    >
      <div className="intro-overlay-canvas absolute inset-0">
        <IntroCrossStitchCanvas
          captureRef={captureRef}
          progressRef={progressRef}
          driftRef={exitDriftRef}
          onCaptureReady={handleCaptureReady}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-10 md:pb-14"
        aria-live="polite"
      >
        <span
          className={`intro-percent tabular-nums ${percentVisible ? "is-visible" : ""}`}
        >
          {displayPercent}%
        </span>
      </div>
    </div>
  );
}
