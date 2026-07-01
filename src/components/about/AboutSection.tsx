"use client";

import { type RefObject } from "react";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import { ScrambleWord } from "@/components/ScrambleWord";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { AboutCopy } from "./AboutCopy";
import { AboutCubeScene } from "./AboutCubeScene";

type AboutSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  /** Static stack for reduced-motion , no scroll pin. */
  staticLayout?: boolean;
};

export function AboutSection({ trackRef, staticLayout = false }: AboutSectionProps) {
  // Drives the big word, cube spin, and copy. Re-renders only while the about
  // track is scrubbing (aboutProgress is pinned at 1 through the footer).
  const aboutProgress = useParallaxValue((s) => s.aboutProgress);
  const projectProgress = useParallaxValue((s) => s.projectProgress);
  const aboutTrackVh = useScrollTrackVh("about");
  const revealProgress = staticLayout ? 1 : aboutProgress;
  const workIncomplete = !staticLayout && projectProgress < 0.995;

  const layout = (
    <div
      className={`about-layout${staticLayout ? " about-layout--static" : ""}`}
    >
      <ScrambleWord text="About" className="about-bigword" />

      <div className="about-cube-wrap">
        <AboutCubeScene aboutProgress={revealProgress} />
      </div>

      <AboutCopy aboutProgress={revealProgress} />
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
