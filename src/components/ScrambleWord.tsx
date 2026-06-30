"use client";

import { useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrambleText } from "@/hooks/useScrambleText";
import { useScrollHoldOnce } from "@/hooks/useScrollHoldOnce";
import { scrambleDurationMs } from "@/lib/flap/splitFlap";

type ScrambleWordProps = {
  text: string;
  className?: string;
  /** Accessible label; defaults to the resolved text. */
  ariaLabel?: string;
  style?: CSSProperties;
  /** Freeze page scroll until the scramble finishes the first time it appears. */
  holdScrollUntilDone?: boolean;
};

/** Section title that scrambles, then locks left→right on scroll-in ,
 *  the same departures-board entrance as the lab "IDEAS" heading. */
export function ScrambleWord({
  text,
  className = "",
  ariaLabel,
  style,
  holdScrollUntilDone = false,
}: ScrambleWordProps) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const chars = useScrambleText(text, ref, { reducedMotion });

  useScrollHoldOnce(ref, {
    durationMs: scrambleDurationMs(text) + 250,
    enabled: holdScrollUntilDone && !reducedMotion,
  });

  return (
    <h2
      ref={ref}
      className={`section-bigword scramble-word ${className}`.trim()}
      style={style}
      role="img"
      aria-label={ariaLabel ?? text}
    >
      {chars.map((char, index) =>
        char === " " ? (
          <span key={index} className="scramble-word__gap" aria-hidden="true" />
        ) : (
          <span key={index} aria-hidden="true">
            {char}
          </span>
        ),
      )}
    </h2>
  );
}
