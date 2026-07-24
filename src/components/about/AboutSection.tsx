"use client";

import { type RefObject } from "react";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ScrambleWord } from "@/components/ScrambleWord";
import { smoothstep } from "@/lib/parallax/interpolate";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { ABOUT_HAND_ASCII } from "@/lib/ascii/handAscii";
import { AboutCopy } from "./AboutCopy";

type AboutSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  /** Static stack for reduced-motion , no scroll pin. */
  staticLayout?: boolean;
};

/** Entry → hold → exit envelope for the "hand pushes the copy" motion.
 *  The pointing hand slides in from the left, dwells long enough to read, then
 *  pushes the copy off to the right. */
function pushStops(progress: number) {
  const entry = smoothstep(0, 1, progress / 0.3);
  const exit = smoothstep(0, 1, (progress - 0.62) / 0.3);
  return {
    // Hand: off-screen left → rest at bottom-left → shoved off to the right.
    handX: (1 - entry) * -50 + exit * 70,
    handScale: 0.62 + entry * 0.38,
    // Copy enters from the left just ahead of the finger; on exit it shares the
    // hand's travel (same +70) so the fingertip stays in contact — a real push.
    copyX: (1 - entry) * -26 + exit * 70,
    copyOpacity: entry,
  };
}

export function AboutSection({ trackRef, staticLayout = false }: AboutSectionProps) {
  // Drives the big word, the pushing hand, and the copy. Re-renders only while
  // the about track is scrubbing (aboutProgress is pinned at 1 through footer).
  const aboutProgress = useParallaxValue((s) => s.aboutProgress);
  const projectProgress = useParallaxValue((s) => s.projectProgress);
  const isMobile = useIsMobile();
  const aboutTrackVh = useScrollTrackVh("about");
  // Static / mobile hold at the readable rest pose (entry done, exit not started).
  const pushProgress = staticLayout || isMobile ? 0.42 : aboutProgress;
  const { handX, handScale, copyX, copyOpacity } = pushStops(pushProgress);
  const workIncomplete = !staticLayout && projectProgress < 0.995;

  const layout = (
    <div
      className={`about-layout${staticLayout ? " about-layout--static" : ""}`}
    >
      <ScrambleWord text="About" className="about-bigword" />

      <div className="about-stage">
        <div
          className="about-hand"
          aria-hidden="true"
          style={{
            transform: `translateX(${handX}vw) scale(${handScale})`,
          }}
        >
          <pre className="hand-ascii about-hand-ascii">{ABOUT_HAND_ASCII}</pre>
        </div>

        <AboutCopy pushX={copyX} opacity={copyOpacity} />
      </div>
    </div>
  );

  if (staticLayout) {
    return (
      <section
        id="about"
        className="about-static page-shell py-14 md:py-20"
        aria-label="About Lan-Ting Ko"
      >
        {layout}
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      id="about"
      className="about-scroll-pin relative w-full bg-white"
      style={{ height: `${aboutTrackVh}vh` }}
      data-work-incomplete={workIncomplete ? "true" : undefined}
      aria-label="About Lan-Ting Ko"
      aria-hidden={workIncomplete}
    >
      <div className="about-scroll-sticky page-shell relative z-[1]">
        {layout}
      </div>
    </section>
  );
}
