"use client";

import { useRef, type RefObject } from "react";
import { ABOUT_SCROLL_VH } from "@/lib/about/aboutScroll";
import { SectionBigWord } from "@/components/SectionBigWord";
import { AboutBallRider } from "./AboutBallRider";
import { AboutCopy } from "./AboutCopy";
import { AboutCubeScene } from "./AboutCubeScene";
import type { BallHandoffPose } from "@/lib/layout/ballHandoff";

type AboutSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  profileBallSlotRef?: RefObject<HTMLDivElement | null>;
  lastBallSlotRef?: RefObject<HTMLElement | null>;
  handoffPoseRef?: RefObject<BallHandoffPose | null>;
  aboutProgress?: number;
  profileImpactComplete?: boolean;
  projectExitT?: number;
  aboutBallActive?: boolean;
  sandEntryRef?: RefObject<HTMLElement | null>;
  sandImpactRef?: RefObject<HTMLElement | null>;
  footerProgress?: number;
  /** Static stack for reduced-motion — no scroll pin or ball rider. */
  staticLayout?: boolean;
};

export function AboutSection({
  trackRef,
  profileBallSlotRef: profileBallSlotRefProp,
  lastBallSlotRef,
  handoffPoseRef,
  aboutProgress = 0,
  profileImpactComplete = false,
  projectExitT = 1,
  aboutBallActive = false,
  sandEntryRef,
  sandImpactRef,
  footerProgress = 0,
  staticLayout = false,
}: AboutSectionProps) {
  const localBallSlotRef = useRef<HTMLDivElement>(null);
  const localProfileBallSlotRef = useRef<HTMLDivElement>(null);
  const profileBallSlotRef = profileBallSlotRefProp ?? localProfileBallSlotRef;
  const revealProgress = staticLayout ? 1 : aboutProgress;

  const layout = (
    <div
      className={`about-layout${staticLayout ? " about-layout--static" : ""}`}
    >
      <SectionBigWord progress={revealProgress} className="about-bigword">
        About
      </SectionBigWord>

      <div className="about-cube-wrap">
        <AboutCubeScene
          profileBallSlotRef={profileBallSlotRef}
          aboutProgress={revealProgress}
          profileImpactComplete={staticLayout || profileImpactComplete}
        />
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

      <AboutBallRider
        lastBallSlotRef={lastBallSlotRef ?? localBallSlotRef}
        profileBallSlotRef={profileBallSlotRef}
        handoffPoseRef={handoffPoseRef}
        aboutProgress={aboutProgress}
        profileImpactComplete={profileImpactComplete}
        projectExitT={projectExitT}
        visible={aboutBallActive}
        sandEntryRef={sandEntryRef}
        sandImpactRef={sandImpactRef}
        footerProgress={footerProgress}
      />
    </section>
  );
}
