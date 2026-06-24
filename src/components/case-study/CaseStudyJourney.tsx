"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { CaseStudyJourneyStep } from "@/lib/case-studies/nga";

type CaseStudyJourneyProps = {
  steps: readonly CaseStudyJourneyStep[];
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function CaseStudyJourney({ steps }: CaseStudyJourneyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const path = root.querySelector<SVGPathElement>("path");
    const emojis = Array.from(root.querySelectorAll<HTMLElement>(".case-study-journey-emojis span"));
    const labels = Array.from(root.querySelectorAll<HTMLElement>(".case-study-journey-step"));
    if (!path) return;

    let frame = 0;
    const render = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = reducedMotion
        ? 1
        : clamp((viewport * 0.86 - rect.top) / (viewport * 0.68));

      path.style.strokeDashoffset = String(1 - progress);
      emojis.forEach((emoji, index) => {
        const local = clamp((progress - index * 0.14) / 0.2);
        emoji.style.opacity = String(local);
        emoji.style.transform = `translate(-50%, -50%) scale(${0.65 + local * 0.35})`;
      });
      labels.forEach((label, index) => {
        const local = clamp((progress - (index * 0.14 + 0.04)) / 0.2);
        label.style.opacity = String(local);
        label.style.transform = `translate3d(0, ${(1 - local) * 18}px, 0)`;
      });
    };

    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="case-study-journey-scroll"
      role="region"
      aria-label="User journey, horizontally scrollable"
      tabIndex={0}
    >
      <div className="case-study-journey-map">
        <div className="case-study-journey-curve" aria-hidden="true">
          <svg viewBox="0 0 1000 260" preserveAspectRatio="none">
            <path
              pathLength="1"
              d="M55 170 C150 170 205 205 280 190 C375 171 425 112 505 88 C610 57 690 27 770 42 C855 58 900 111 950 126"
            />
          </svg>
          <div className="case-study-journey-emojis">
            {steps.map((step) => (
              <span key={step.title}>{step.emoji}</span>
            ))}
          </div>
        </div>

        <ol className="case-study-journey" aria-label="User journey">
          {steps.map((step, stepIndex) => (
            <li key={step.title} className="case-study-journey-step">
              <span className="case-study-journey-index type-nav">
                {String(stepIndex + 1).padStart(2, "0")}
              </span>
              <h3 className="case-study-journey-title">{step.title}</h3>
              <p className="type-body text-black/55">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
