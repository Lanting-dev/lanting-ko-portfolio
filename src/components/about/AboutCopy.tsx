"use client";

import { smoothstepEase } from "@/lib/animation/sectionBigWordReveal";

type AboutCopyProps = {
  aboutProgress: number;
};

/** About bio copy — right column on desktop, below cube on mobile. */
export function AboutCopy({ aboutProgress }: AboutCopyProps) {
  const copyIn = smoothstepEase((aboutProgress - 0.2) / 0.3);

  return (
    <div
      className="about-copy"
      style={{
        opacity: copyIn,
        transform: `translateY(${(1 - copyIn) * 24}px)`,
      }}
    >
      <p className="about-copy-lead">
        Lanting Ko is a product designer shaping how things are structured,
        function, and look.
      </p>
      <div className="about-copy-body">
        <p>
          She was born and raised in Taiwan and now lives in New York,
          surrounded by bagels and unpredictable subway performances.
        </p>
        <p>
          Working with her is like brainstorming with someone who interrupts to
          ask &ldquo;wait, who is this actually for?&rdquo;
        </p>
        <p>
          When she&rsquo;s not designing or doing research, you can find her
          watching movies, going to Broadway shows, or getting some vitamin D
          outdoors.
        </p>
      </div>
    </div>
  );
}
