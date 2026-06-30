"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroClient } from "@/components/HeroClient";
import { ProjectSection } from "@/components/ProjectSection";
import { ExperimentalSection } from "@/components/experimental/ExperimentalSection";
import { AboutSection } from "@/components/about/AboutSection";
import { FooterSection } from "@/components/footer/FooterSection";
import { DitherPageIntro } from "@/components/dither/DitherPageIntro";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import { ScrollRhythmHUD } from "@/components/scroll/ScrollRhythmHUD";
import { HeroParallaxScene } from "./HeroParallaxScene";
import { HeroRibbonSection } from "./HeroRibbonSection";
import { ParallaxEngineProvider } from "./ParallaxEngineProvider";

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

      <ExperimentalSection />

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
  const heroTrackVh = useScrollTrackVh("hero");
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
        <HeroRibbonSection />
        <p className="type-body mb-10 ml-auto max-w-[500px] text-right text-black md:mb-12">
          {home.heroBio}
        </p>
        <ProjectSection />
        <AboutSection staticLayout />
        <ExperimentalSection />
        <FooterSection staticLayout />
      </div>
    );
  }

  return (
    <>
      {!introComplete ? (
        <DitherPageIntro
          onExitStart={handleIntroExitStart}
          onComplete={handleIntroComplete}
        />
      ) : null}

      <section
        ref={heroTrackRef}
        className="relative"
        style={{ height: `${heroTrackVh}vh` }}
      >
        <div className="hero-nav-overlay pointer-events-none absolute inset-x-0 top-0 z-[5] mx-auto w-full max-w-[1440px] page-shell">
          <div className="pointer-events-auto">
            <Navigation />
          </div>
        </div>
        <div className="hero-sticky relative z-[2] sticky top-0 flex w-full flex-col page-shell">
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

      <HeroRibbonSection />

      <ParallaxEngineProvider
        heroTrackRef={heroTrackRef}
        projectTrackRef={projectTrackRef}
        aboutTrackRef={aboutTrackRef}
        footerTrackRef={footerTrackRef}
      >
        <ParallaxStage
          refs={{ projectTrackRef, aboutTrackRef, footerTrackRef }}
        />
        <ScrollRhythmHUD />
      </ParallaxEngineProvider>
    </>
  );
}
