"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { GtStep } from "@/lib/case-studies/gt";

type GtScrollStepsProps = {
  steps: readonly GtStep[];
  mediaFrame?: "browser" | "plain";
  railLabel?: string;
  mode?: "sequential" | "explore";
  wideMedia?: boolean;
};

function StepMedia({
  media,
  mediaFrame = "browser",
  wide = false,
}: {
  media: GtStep["media"][number];
  mediaFrame?: "browser" | "plain";
  wide?: boolean;
}) {
  if (media.type === "video") {
    if (mediaFrame === "plain") {
      return (
        <figure className="gt-dark-media">
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
        </figure>
      );
    }

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
    mediaFrame === "plain" ? (
      <figure className={`gt-dark-media${wide ? " is-wide" : ""}`.trim()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.src} alt={media.alt} loading="lazy" draggable={false} />
      </figure>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.src} alt={media.alt} loading="lazy" />
    )
  );
}

export function GtScrollSteps({
  steps,
  mediaFrame = "browser",
  railLabel = "Workflow steps",
  mode = "sequential",
  wideMedia = false,
}: GtScrollStepsProps) {
  const isExplore = mode === "explore";
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
      <ol className={`gt-steps-static${isExplore ? " gt-steps-static--explore" : ""}`}>
        {steps.map((step) => (
          <li key={step.index} className="gt-step-static-card">
            {isExplore ? (
              <p className="gt-step-eyebrow">{step.title}</p>
            ) : (
              <p className="gt-step-eyebrow">Step {step.index}</p>
            )}
            <h3>{step.finding ?? step.title}</h3>
            <p>{step.description}</p>
            <div className={`gt-step-static-media ${step.media.length > 1 ? "is-pair" : ""}`.trim()}>
              {step.media.map((media) => (
                <StepMedia
                  key={media.src}
                  media={media}
                  mediaFrame={mediaFrame}
                  wide={wideMedia}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const activeStep = steps[activeIndex] ?? steps[0];

  return (
    <div className={`gt-step-reveal${isExplore ? " gt-step-reveal--explore" : ""}`}>
      <div className="gt-step-sticky">
        <ol className="gt-step-rail" aria-label={railLabel}>
          {steps.map((step, index) => (
            <li
              key={step.index}
              className={index <= activeIndex ? "is-revealed" : ""}
              aria-current={index === activeIndex ? (isExplore ? "location" : "step") : undefined}
            >
              <span className="gt-step-dot" aria-hidden="true">
                {!isExplore ? index + 1 : null}
              </span>
              <span className="gt-step-rail-copy">
                {!isExplore ? <span>Step {step.index}</span> : null}
                <strong>{step.title}</strong>
              </span>
            </li>
          ))}
        </ol>

        <article key={activeStep.index} className="gt-step-stage" aria-live="polite">
          <div className="gt-step-stage-copy">
            {isExplore ? (
              <p className="gt-step-eyebrow">{activeStep.title}</p>
            ) : (
              <p className="gt-step-eyebrow">Step {activeStep.index}</p>
            )}
            <h3>{activeStep.finding ?? activeStep.title}</h3>
            <p>{activeStep.description}</p>
          </div>
          <div className="gt-step-stage-media">
            <div className={`gt-step-stage-media-grid ${activeStep.media.length > 1 ? "is-pair" : ""}`.trim()}>
              {activeStep.media.map((media) => (
                <StepMedia
                  key={media.src}
                  media={media}
                  mediaFrame={mediaFrame}
                  wide={wideMedia}
                />
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
