"use client";

import { useRef } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrambleText } from "@/hooks/useScrambleText";

const HEADING = "IDEAS";
const QUESTION = "?";

export function LabScrambleHeading() {
  const { ui } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chars = useScrambleText(HEADING, headingRef, { reducedMotion });
  const questionChars = useScrambleText(QUESTION, headingRef, { reducedMotion });

  return (
    <h2
      ref={headingRef}
      className="section-bigword lab-section-word lab-scramble-heading"
      aria-label={ui.lab.headingAria}
    >
      <span className="lab-heading-lead">
        {chars.map((char, index) => (
          <span
            key={index}
            className="lab-scramble-heading__char"
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </span>
      <span className="lab-heading-arrow" aria-hidden="true">
        →
      </span>
      <span className="lab-heading-q" aria-hidden="true">
        {questionChars[0] ?? QUESTION}
      </span>
    </h2>
  );
}
