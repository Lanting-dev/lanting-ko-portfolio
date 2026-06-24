"use client";

import { type RefObject } from "react";
import { ABOUT_SCROLL_VH } from "@/lib/about/aboutScroll";
import { SectionBigWord } from "@/components/SectionBigWord";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { AboutCopy } from "./AboutCopy";
import { AboutCubeScene } from "./AboutCubeScene";

type AboutSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  /** Static stack for reduced-motion — no scroll pin. */
  staticLayout?: boolean;
};

export function AboutSection({ trackRef, staticLayout = false }: AboutSectionProps) {
  // Drives the big word, cube spin, and copy. Re-renders only while the about
  // track is scrubbing (aboutProgress is pinned at 1 through the footer).
  const aboutProgress = useParallaxValue((s) => s.aboutProgress);
  const revealProgress = staticLayout ? 1 : aboutProgress;

  const layout = (
    <div
      className={`about-layout${staticLayout ? " about-layout--static" : ""}`}
    >
      <SectionBigWord progress={revealProgress} className="about-bigword">
        About
      </SectionBigWord>

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
      style={{ height: `${ABOUT_SCROLL_VH}vh` }}
      aria-label="About Lan-Ting Ko"
    >
      <div className="about-scroll-sticky page-shell relative z-[1]">
        {layout}
      </div>
    </section>
  );
}
