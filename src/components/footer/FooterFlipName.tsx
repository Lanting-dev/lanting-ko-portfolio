"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrambleText } from "@/hooks/useScrambleText";

const TARGET = "LANTING KO";

export function FooterFlipName() {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const chars = useScrambleText(TARGET, ref, { reducedMotion });

  return (
    <div ref={ref} className="footer-flip-name" role="img" aria-label={TARGET}>
      {chars.map((char, index) =>
        char === " " ? (
          <span
            key={index}
            className="footer-flip-name__gap"
            aria-hidden="true"
          />
        ) : (
          <span
            key={index}
            className="footer-flip-name__char"
            aria-hidden="true"
          >
            {char}
          </span>
        ),
      )}
    </div>
  );
}
