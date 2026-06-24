"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroClient } from "@/components/HeroClient";
import { ProjectSection } from "@/components/ProjectSection";
import { AboutSection } from "@/components/about/AboutSection";
import { FooterSection } from "@/components/footer/FooterSection";
import { DitherPageIntro } from "@/components/dither/DitherPageIntro";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { HeroParallaxScene } from "./HeroParallaxScene";
import { ParallaxEngineProvider } from "./ParallaxEngineProvider";

/** ~300vh — title morph and bio reveal before Work. */
const SCROLL_TRACK_VH = 300;

type StageRefs = {
  projectTrackRef: RefObject<HTMLElement | null>;
  aboutTrackRef: RefObject<HTMLElement | null>;
  footerTrackRef: RefObject<HTMLElement | null>;
};

/** Renders everything downstream of the hero. */
function ParallaxStage({ refs }: { refs: StageRefs }) {
  return (
    <>
      <ProjectSection trackRef={refs.projectTrackRef} />

      <AboutSection trackRef={refs.aboutTrackRef} />

      <FooterSection trackRef={refs.footerTrackRef} />
    </>
  );
}

export function ParallaxLandingClient() {
  const heroTrackRef = useRef<HTMLElement>(null);
  const projectTrackRef = useRef<HTMLElement>(null);
  const aboutTrackRef = useRef<HTMLElement>(null);
  const footerTrackRef = useRef<HTMLElement>(null);
  const heroCaptureRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const { home } = useLocale();
  const [introComplete, setIntroComplete] = useState(false);
  const [heroEnter, setHeroEnter] = useState(false);

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    setIntroComplete(true);
    setHeroEnter(true);
  }, [reducedMotion]);

  // Play the loading intro only once per tab session. Navigating within the
  // same tab skips it; opening the site in a new tab plays it again.
  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (sessionStorage.getItem("intro-seen") !== "1") return;
    setIntroComplete(true);
    setHeroEnter(true);
  }, [reducedMotion]);

  const handleIntroExitStart = useCallback(() => {
    setHeroEnter(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("intro-seen", "1");
    setIntroComplete(true);
  }, []);

  if (reducedMotion) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col page-shell">
        <Navigation />
        <HeroClient />
        <p className="type-body mb-10 ml-auto max-w-[500px] text-right text-black md:mb-12">
          {home.heroBio}
        </p>
        <ProjectSection />
        <AboutSection staticLayout />
        <FooterSection staticLayout />
      </div>
    );
  }

  return (
    <>
      {!introComplete ? (
        <DitherPageIntro
          captureRef={heroCaptureRef}
          onExitStart={handleIntroExitStart}
          onComplete={handleIntroComplete}
        />
      ) : null}

      <div className="mx-auto w-full max-w-[1440px] page-shell">
        <Navigation />
      </div>

      <section
        ref={heroTrackRef}
        className="relative"
        style={{ height: `${SCROLL_TRACK_VH}vh` }}
      >
        <div className="hero-sticky sticky top-0 flex h-dvh w-full flex-col page-shell">
          <div
            ref={heroCaptureRef}
            className={`hero-intro-enter intro-capture-target flex min-h-0 flex-1 flex-col ${
              heroEnter ? "is-active" : ""
            }`}
          >
            <div className="hero-stage-wrap relative flex min-h-0 flex-1 flex-col">
              <HeroParallaxScene />
            </div>
          </div>
        </div>
      </section>

      <ParallaxEngineProvider
        heroTrackRef={heroTrackRef}
        projectTrackRef={projectTrackRef}
        aboutTrackRef={aboutTrackRef}
        footerTrackRef={footerTrackRef}
      >
        <ParallaxStage
          refs={{ projectTrackRef, aboutTrackRef, footerTrackRef }}
        />
      </ParallaxEngineProvider>
    </>
  );
}
