"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroClient } from "@/components/HeroClient";
import { ProjectSection } from "@/components/ProjectSection";
import { AboutSection } from "@/components/about/AboutSection";
import { FooterSection } from "@/components/footer/FooterSection";
import { FooterBallRider } from "@/components/footer/FooterBallRider";
import { DitherPageIntro } from "@/components/dither/DitherPageIntro";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { FOOTER_BALL_HANDOFF } from "@/lib/footer/footerScroll";
import { isAboutBallRiderActive } from "@/lib/about/aboutScroll";
import {
  computeProjectExitT,
  isProjectExitComplete,
} from "@/lib/projects/projectScroll";
import { isBallRiderReady, PINBALL_SETTLE_AT } from "@/lib/animation/pinballBounce";
import { getHeroParallaxValues } from "@/lib/parallax/heroParallax";
import type { BallHandoffPose } from "@/lib/layout/ballHandoff";
import { FloatingOrb } from "./FloatingOrb";
import { HeroParallaxScene } from "./HeroParallaxScene";

/** ~600vh — hero morph + scroll-scrubbed ball fall */
const SCROLL_TRACK_VH = 600;

export function ParallaxLandingClient() {
  const heroTrackRef = useRef<HTMLElement>(null);
  const projectTrackRef = useRef<HTMLElement>(null);
  const aboutTrackRef = useRef<HTMLElement>(null);
  const footerTrackRef = useRef<HTMLElement>(null);
  const footerSandImpactRef = useRef<HTMLDivElement>(null);
  const footerSandEntryRef = useRef<HTMLDivElement>(null);
  const lastBallSlotRef = useRef<HTMLDivElement>(null);
  const profileBallSlotRef = useRef<HTMLDivElement>(null);
  const projectHandoffPoseRef = useRef<BallHandoffPose | null>(null);
  const orbLandTargetRef = useRef<HTMLDivElement>(null);
  const cardImpactRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const bioShelfRef = useRef<HTMLDivElement>(null);
  const bioCopyRef = useRef<HTMLParagraphElement>(null);
  const heroCaptureRef = useRef<HTMLDivElement>(null);
  const [aboutLead, setAboutLead] = useState(0);
  useLayoutEffect(() => {
    // The ball falls to ~0.72vh and the rising cube reaches it when the section
    // top is ~0.46vh below the viewport top, so lead the About progress by that
    // much: the bounce + spin then trigger exactly when the ball hits the cube.
    const read = () => setAboutLead(window.innerHeight * 0.46);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const heroProgress = useScrollProgress(heroTrackRef);
  const projectProgress = useScrollProgress(projectTrackRef);
  const aboutProgress = useScrollProgress(aboutTrackRef, aboutLead);
  const footerProgress = useScrollProgress(footerTrackRef);
  const projectExitT = computeProjectExitT(projectProgress);
  const profileImpactComplete = isProjectExitComplete(projectExitT);
  const reducedMotion = usePrefersReducedMotion();
  const [introComplete, setIntroComplete] = useState(false);
  const [heroReveal, setHeroReveal] = useState(false);
  const [heroEnter, setHeroEnter] = useState(false);
  const [cardFrameTop, setCardFrameTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    setIntroComplete(true);
    setHeroReveal(true);
    setHeroEnter(true);
  }, [reducedMotion]);

  // Play the loading intro only once per tab session. Navigating within the
  // same tab skips it; opening the site in a new tab plays it again.
  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (sessionStorage.getItem("intro-seen") !== "1") return;
    setIntroComplete(true);
    setHeroReveal(true);
    setHeroEnter(true);
  }, [reducedMotion]);

  const parallaxValues = useMemo(
    () => getHeroParallaxValues(heroProgress),
    [heroProgress],
  );

  const { fallPhase } = parallaxValues;

  const handleIntroExitStart = useCallback(() => {
    setHeroEnter(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("intro-seen", "1");
    setIntroComplete(true);
    setHeroReveal(true);
  }, []);

  useLayoutEffect(() => {
    const measureCard = () => {
      const frame = cardImpactRef.current;
      setCardFrameTop(frame ? frame.getBoundingClientRect().top : null);
    };

    measureCard();
    window.addEventListener("scroll", measureCard, { passive: true });
    window.addEventListener("resize", measureCard);

    return () => {
      window.removeEventListener("scroll", measureCard);
      window.removeEventListener("resize", measureCard);
    };
  }, [fallPhase, heroProgress]);

  const ballRiderActive = useMemo(
    () =>
      isBallRiderReady(
        fallPhase,
        cardFrameTop,
        typeof window !== "undefined" ? window.innerHeight : 900,
      ),
    [cardFrameTop, fallPhase],
  );

  const showAboutBall = isAboutBallRiderActive(profileImpactComplete, aboutProgress);
  const showProjectBall = ballRiderActive && !showAboutBall;
  const aboutBallActive = showAboutBall;
  const hideProjectBall = !showProjectBall && profileImpactComplete;

  const showFooterBall =
    profileImpactComplete && footerProgress >= FOOTER_BALL_HANDOFF;

  const showFloatingOrb =
    heroReveal &&
    !showAboutBall &&
    !showFooterBall &&
    (!showProjectBall || fallPhase < PINBALL_SETTLE_AT);

  if (reducedMotion) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col page-shell">
        <Navigation />
        <HeroClient />
        <p className="type-body mb-10 ml-auto max-w-[500px] text-right text-black md:mb-12">
          Lan-Ting is a product designer who shapes how things are structured,
          function, and look. She creates digital experiences that are clear,
          structured, and human-centered.
        </p>
        <ProjectSection />
        <AboutSection staticLayout />
        <FooterSection staticLayout sandImpactRef={footerSandImpactRef} sandEntryRef={footerSandEntryRef} />
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

      <section
        ref={heroTrackRef}
        className="relative"
        style={{ height: `${SCROLL_TRACK_VH}vh` }}
      >
        <div className="sticky top-0 mx-auto flex h-dvh w-full max-w-[1440px] flex-col page-shell">
          <div
            ref={heroCaptureRef}
            className={`hero-intro-enter intro-capture-target flex min-h-0 flex-1 flex-col ${
              heroEnter ? "is-active" : ""
            }`}
          >
            <Navigation />
            <div className="hero-stage-wrap relative flex min-h-0 flex-1 flex-col">
              <HeroParallaxScene
                progress={introComplete ? heroProgress : 0}
                anchorRef={anchorRef}
                bioShelfRef={bioShelfRef}
                bioCopyRef={bioCopyRef}
                hideInlineFlower={heroReveal && !ballRiderActive}
              />
            </div>
          </div>
        </div>
      </section>

      <ProjectSection
        trackRef={projectTrackRef}
        horizontalProgress={projectProgress}
        orbTargetRef={orbLandTargetRef}
        cardImpactRef={cardImpactRef}
        lastBallSlotRef={lastBallSlotRef}
        handoffPoseRef={projectHandoffPoseRef}
        profileBallSlotRef={profileBallSlotRef}
        projectExitT={projectExitT}
        aboutProgress={aboutProgress}
        fallPhase={fallPhase}
        showLandedOrb={showProjectBall}
        hideProjectBall={hideProjectBall}
      />

      <AboutSection
        trackRef={aboutTrackRef}
        profileBallSlotRef={profileBallSlotRef}
        lastBallSlotRef={lastBallSlotRef}
        handoffPoseRef={projectHandoffPoseRef}
        aboutProgress={aboutProgress}
        profileImpactComplete={profileImpactComplete}
        projectExitT={projectExitT}
        aboutBallActive={aboutBallActive}
        sandEntryRef={footerSandEntryRef}
        sandImpactRef={footerSandImpactRef}
        footerProgress={footerProgress}
      />

      <FooterSection
        trackRef={footerTrackRef}
        footerProgress={footerProgress}
        sandImpactRef={footerSandImpactRef}
        sandEntryRef={footerSandEntryRef}
      />

      {profileImpactComplete ? (
        <FooterBallRider
          footerProgress={footerProgress}
          sandEntryRef={footerSandEntryRef}
          sandImpactRef={footerSandImpactRef}
          visible={footerProgress >= FOOTER_BALL_HANDOFF}
        />
      ) : null}

      {showFloatingOrb ? (
        <FloatingOrb
          values={parallaxValues}
          anchorRef={anchorRef}
          bioShelfRef={bioShelfRef}
          bioCopyRef={bioCopyRef}
          landTargetRef={orbLandTargetRef}
        />
      ) : null}
    </>
  );
}
