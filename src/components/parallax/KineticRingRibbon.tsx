"use client";

import { useId } from "react";

type KineticRingRibbonProps = {
  text: string;
  kinetic: number;
  reducedMotion: boolean;
};

const REPEAT_COUNT = 6;
const MARQUEE_SECONDS = 32;

/** Elliptical loop — thick single band (PANTER-style surround). */
const RING_PATH =
  "M 72,368 A 428,198 0 1,1 928,368 A 428,198 0 1,1 72,368";

export function KineticRingRibbon({
  text,
  kinetic,
  reducedMotion,
}: KineticRingRibbonProps) {
  const pathId = useId().replace(/:/g, "");
  const line = text.repeat(REPEAT_COUNT);
  const animate = kinetic > 0.04 && !reducedMotion;

  return (
    <div className="kinetic-ring" data-kinetic={animate ? "active" : "idle"}>
      <svg
        className="kinetic-ring__svg"
        viewBox="0 0 1000 700"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <path id={pathId} d={RING_PATH} />
        </defs>

        <use
          href={`#${pathId}`}
          className="kinetic-ring__outline"
          fill="none"
        />
        <use
          href={`#${pathId}`}
          className="kinetic-ring__shadow"
          fill="none"
        />
        <use href={`#${pathId}`} className="kinetic-ring__band" fill="none" />

        <text className="kinetic-ring__text" dominantBaseline="middle">
          <textPath href={`#${pathId}`} startOffset="0%" spacing="auto">
            {line}
            {animate ? (
              <animate
                attributeName="startOffset"
                from="0%"
                to="100%"
                dur={`${MARQUEE_SECONDS}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
