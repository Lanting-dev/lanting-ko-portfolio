"use client";

import { smoothstepEase } from "@/lib/animation/sectionBigWordReveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type AboutCopyProps = {
  aboutProgress: number;
};

/** About bio copy , right column on desktop, below cube on mobile. */
export function AboutCopy({ aboutProgress }: AboutCopyProps) {
  const { home } = useLocale();
  const copyIn = smoothstepEase((aboutProgress - 0.2) / 0.3);

  return (
    <div
      className="about-copy"
      style={{
        opacity: copyIn,
        transform: `translateY(${(1 - copyIn) * 24}px)`,
      }}
    >
      <p className="about-copy-lead">{home.aboutLead}</p>
      <div className="about-copy-body">
        {home.aboutBody.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
