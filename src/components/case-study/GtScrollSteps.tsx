"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { GtStep } from "@/lib/case-studies/gt";

type GtScrollStepsProps = {
  steps: readonly GtStep[];
};

function StepMedia({ media }: { media: GtStep["media"][number] }) {
  if (media.type === "video") {
    return (
      <div className="gt-browser-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gt-browser-bar" src="/work/gt/toolbar.png" alt="" aria-hidden="true" />
        <video
          src={media.src}
          aria-label={media.alt}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={media.src} alt={media.alt} loading="lazy" />
  );
}

export function GtScrollSteps({ steps }: GtScrollStepsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const observers = triggerRefs.current.map((trigger, index) => {
      if (!trigger) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveIndex(index);
        },
        {
          rootMargin: "-34% 0px -52% 0px",
          threshold: 0,
        },
      );

      observer.observe(trigger);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, [reducedMotion, steps.length]);

  if (reducedMotion) {
    return (
      <ol className="gt-steps-static">
        {steps.map((step) => (
          <li key={step.index} className="gt-step-static-card">
            <p className="gt-step-eyebrow">Step {step.index}</p>
            <h3>{step.finding ?? step.title}</h3>
            <p>{step.description}</p>
            <div className={`gt-step-static-media ${step.media.length > 1 ? "is-pair" : ""}`.trim()}>
              {step.media.map((media) => (
                <StepMedia key={media.src} media={media} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const activeStep = steps[activeIndex] ?? steps[0];

  return (
    <div className="gt-step-reveal">
      <div className="gt-step-sticky">
        <ol className="gt-step-rail" aria-label="Course Builder workflow">
          {steps.map((step, index) => (
            <li
              key={step.index}
              className={index <= activeIndex ? "is-revealed" : ""}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <span className="gt-step-dot">{index + 1}</span>
              <span className="gt-step-rail-copy">
                <span>Step {step.index}</span>
                <strong>{step.title}</strong>
              </span>
            </li>
          ))}
        </ol>

        <article key={activeStep.index} className="gt-step-stage" aria-live="polite">
          <div className="gt-step-stage-copy">
            <p className="gt-step-eyebrow">Step {activeStep.index}</p>
            <h3>{activeStep.finding ?? activeStep.title}</h3>
            <p>{activeStep.description}</p>
          </div>
          <div className="gt-step-stage-media">
            <div className={`gt-step-stage-media-grid ${activeStep.media.length > 1 ? "is-pair" : ""}`.trim()}>
              {activeStep.media.map((media) => (
                <StepMedia key={media.src} media={media} />
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="gt-step-triggers" aria-hidden="true">
        {steps.map((step, index) => (
          <div
            key={step.index}
            ref={(node) => {
              triggerRefs.current[index] = node;
            }}
            className="gt-step-trigger"
          />
        ))}
      </div>
    </div>
  );
}
