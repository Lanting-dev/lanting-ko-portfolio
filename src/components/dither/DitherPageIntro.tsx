"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IntroRepeaterCanvas } from "./IntroRepeaterCanvas";

const INTRO_MS = 12000;
const OVERLAY_FADE_MS = 650;

type DitherPageIntroProps = {
  onExitStart?: () => void;
  onComplete: () => void;
};

export function DitherPageIntro({
  onExitStart,
  onComplete,
}: DitherPageIntroProps) {
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const completeTimeoutRef = useRef(0);

  const finishExit = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;
    onExitStart?.();
    setIsExiting(true);
  }, [onExitStart]);

  const scheduleComplete = useCallback(() => {
    window.clearTimeout(completeTimeoutRef.current);
    completeTimeoutRef.current = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, OVERLAY_FADE_MS);
  }, [onComplete]);

  const handleIntroCounted = useCallback(() => {
    if (!exitStartedRef.current) {
      finishExit();
    }
    scheduleComplete();
  }, [finishExit, scheduleComplete]);

  const handleExitBegin = useCallback(() => {
    finishExit();
  }, [finishExit]);

  useEffect(() => {
    const safety = window.setTimeout(() => {
      if (!completedRef.current) {
        finishExit();
        scheduleComplete();
      }
    }, INTRO_MS + OVERLAY_FADE_MS + 1500);

    return () => {
      window.clearTimeout(completeTimeoutRef.current);
      window.clearTimeout(safety);
    };
  }, [finishExit, scheduleComplete]);

  return (
    <div
      className={`intro-overlay-panel intro-overlay-panel--repeater fixed inset-0 z-[100] ${
        isExiting ? "is-exiting" : ""
      }`}
      aria-hidden={isExiting}
      aria-label="Loading"
      aria-live="polite"
    >
      <IntroRepeaterCanvas
        durationMs={INTRO_MS}
        onExitBegin={handleExitBegin}
        onComplete={handleIntroCounted}
        className="h-full w-full"
      />
    </div>
  );
}
