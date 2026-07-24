"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

type AboutCopyProps = {
  /** Horizontal push in vw , negative = entering from the left, positive = pushed out to the right. */
  pushX: number;
  opacity: number;
};

/** About bio copy , right column on desktop. The hand pushes it in on entry and
 *  out to the right on exit, so it only travels horizontally here. */
export function AboutCopy({ pushX, opacity }: AboutCopyProps) {
  const { home } = useLocale();

  return (
    <div
      className="about-copy"
      style={{
        opacity,
        transform: `translateX(${pushX}vw)`,
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
