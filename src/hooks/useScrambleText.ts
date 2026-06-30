"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  initialSplitFlapChars,
  lockTickFor,
  randomSplitFlapGlyph,
  SPLIT_FLAP_TICK_MS,
  splitFlapTargetChars,
} from "@/lib/flap/splitFlap";

type UseScrambleTextOptions = {
  reducedMotion: boolean;
  playOnView?: boolean;
  delayTicks?: number;
};

/** Departures-board style: glyphs scramble, then lock left→right. */
export function useScrambleText(
  target: string,
  containerRef: RefObject<HTMLElement | null>,
  { reducedMotion, playOnView = true, delayTicks = 0 }: UseScrambleTextOptions,
): string[] {
  const targetChars = useMemo(() => splitFlapTargetChars(target), [target]);
  const initialChars = useMemo(() => initialSplitFlapChars(target), [target]);
  const [chars, setChars] = useState<string[]>(
    reducedMotion ? targetChars : initialChars,
  );

  useEffect(() => {
    if (reducedMotion) {
      setChars(targetChars);
      return;
    }

    if (!playOnView) return;

    const node = containerRef.current;
    if (!node) return;

    let running = false;
    let tickTimer = 0;
    let armed = true;

    const start = () => {
      if (running) return;
      running = true;
      setChars(initialChars);
      let tick = -delayTicks;

      const step = () => {
        if (tick < 0) {
          tick += 1;
          tickTimer = window.setTimeout(step, SPLIT_FLAP_TICK_MS);
          return;
        }

        const next = targetChars.map((glyph, i) => {
          if (glyph === " ") return " ";
          return tick >= lockTickFor(i) ? glyph : randomSplitFlapGlyph();
        });
        setChars(next);

        const lastIndex = targetChars.reduce(
          (last, glyph, index) => (glyph !== " " ? index : last),
          0,
        );
        if (tick >= lockTickFor(lastIndex)) {
          running = false;
          return;
        }
        tick += 1;
        tickTimer = window.setTimeout(step, SPLIT_FLAP_TICK_MS);
      };

      step();
    };

    const stop = () => {
      running = false;
      window.clearTimeout(tickTimer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && armed) {
          armed = false;
          start();
        } else if (!entry.isIntersecting) {
          armed = true;
          stop();
          setChars(initialChars);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      stop();
      observer.disconnect();
    };
  }, [
    containerRef,
    delayTicks,
    initialChars,
    playOnView,
    reducedMotion,
    targetChars,
  ]);

  return chars;
}
