"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  getProjectCardNudgeY,
  isProjectCardRevealActive,
  resolveHopSegment,
} from "@/lib/animation/pinballBounce";
import {
  getProjectTrackMetrics,
  mapProjectHopProgress,
  PROJECT_SCROLL_VH,
  computeProjectExitT,
} from "@/lib/projects/projectScroll";
import { PROJECTS } from "@/lib/projects";
import { sectionBigWordRevealStyle } from "@/lib/animation/sectionBigWordReveal";
import { ProjectBallRider } from "./ProjectBallRider";
import { ProjectCard } from "./ProjectCard";
import type { BallHandoffPose } from "@/lib/layout/ballHandoff";

type ProjectScrollSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  orbTargetRef?: RefObject<HTMLDivElement | null>;
  cardImpactRef?: RefObject<HTMLDivElement | null>;
  lastBallSlotRef?: RefObject<HTMLDivElement | null>;
  handoffPoseRef?: RefObject<BallHandoffPose | null>;
  profileBallSlotRef?: RefObject<HTMLDivElement | null>;
  projectExitT?: number;
  aboutProgress?: number;
  horizontalProgress?: number;
  fallPhase?: number;
  showLandedOrb?: boolean;
  hideProjectBall?: boolean;
};

export function ProjectScrollSection({
  trackRef,
  orbTargetRef,
  cardImpactRef,
  lastBallSlotRef,
  handoffPoseRef,
  profileBallSlotRef,
  projectExitT: projectExitTProp,
  aboutProgress = 0,
  horizontalProgress = 0,
  fallPhase = 0,
  showLandedOrb = false,
  hideProjectBall = false,
}: ProjectScrollSectionProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const bleedRef = useRef<HTMLDivElement>(null);
  const innerTrackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [trackOffset, setTrackOffset] = useState(0);
  const [startPad, setStartPad] = useState(48);
  const [endPad, setEndPad] = useState(48);
  const cardCount = PROJECTS.length;
  const hopProgress = mapProjectHopProgress(horizontalProgress);
  const projectExitT = projectExitTProp ?? computeProjectExitT(horizontalProgress);

  const hop = useMemo(
    () => resolveHopSegment(hopProgress, cardCount),
    [cardCount, hopProgress],
  );

  const measureOffset = useCallback(() => {
    const inner = innerTrackRef.current;
    const bleed = bleedRef.current;
    if (!inner || !bleed) return;

    const viewport = bleed.clientWidth;
    const firstCard = inner.querySelector<HTMLElement>(".project-card");
    const cardWidth = firstCard?.offsetWidth ?? 0;
    const gap = parseFloat(getComputedStyle(inner).columnGap || "0") || 0;
    const { startPad: lead, endPad: pad, offset } = getProjectTrackMetrics(
      cardCount,
      cardWidth,
      gap,
      viewport,
      hopProgress,
    );

    setStartPad(lead);
    setEndPad(pad);
    setTrackOffset(offset);
  }, [cardCount, hopProgress]);

  useLayoutEffect(() => {
    measureOffset();

    const inner = innerTrackRef.current;
    const bleed = bleedRef.current;
    if (!inner || !bleed) return;

    const ro = new ResizeObserver(measureOffset);
    ro.observe(bleed);
    ro.observe(inner);
    for (const card of inner.querySelectorAll(".project-card")) {
      ro.observe(card);
    }

    window.addEventListener("resize", measureOffset);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureOffset);
    };
  }, [measureOffset]);

  const setBallSlotRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      slotRefs.current[index] = node;

      if (index === 0 && orbTargetRef) {
        orbTargetRef.current = node;
      }

      if (index === cardCount - 1 && lastBallSlotRef) {
        lastBallSlotRef.current = node;
      }
    },
    [cardCount, lastBallSlotRef, orbTargetRef],
  );

  const setPinTrackRef = useCallback(
    (node: HTMLElement | null) => {
      if (trackRef) {
        trackRef.current = node;
      }
    },
    [trackRef],
  );

  return (
    <section
      ref={setPinTrackRef}
      id="work"
      className="project-scroll-pin relative w-full"
      style={{ height: `${PROJECT_SCROLL_VH}vh` }}
    >
      <div
        ref={stickyRef}
        className="project-scroll-sticky relative mx-auto flex h-dvh w-full max-w-[1440px] flex-col page-shell pb-6 pt-16 md:pb-8 md:pt-20"
      >
        <div
          className="project-bigword-wrap"
          style={sectionBigWordRevealStyle(horizontalProgress)}
          aria-hidden="true"
        >
          <h2 className="section-bigword project-bigword">Work</h2>
        </div>

        <div ref={bleedRef} className="project-scroll-bleed relative z-[1] min-h-0 flex-1">
          <div
            ref={innerTrackRef}
            className="project-scroll-track"
            style={{ transform: `translate3d(-${trackOffset}px, 0, 0)` }}
            role="list"
            aria-label="Selected projects"
          >
            <div
              className="project-scroll-start shrink-0"
              style={{ width: startPad, flexBasis: startPad }}
              aria-hidden="true"
            />
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                cardIndex={index}
                ballSlotRef={setBallSlotRef(index)}
                cardImpactRef={index === 0 ? cardImpactRef : undefined}
                cardNudgeY={getProjectCardNudgeY(
                  index,
                  fallPhase,
                  showLandedOrb,
                  hopProgress,
                  cardCount,
                  projectExitT,
                )}
                revealed={isProjectCardRevealActive(
                  index,
                  fallPhase,
                  showLandedOrb,
                  hopProgress,
                  cardCount,
                )}
              />
            ))}
            <div
              className="project-scroll-end shrink-0"
              style={{ width: endPad, flexBasis: endPad }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <ProjectBallRider
        slotRefs={slotRefs}
        cardCount={cardCount}
        horizontalProgress={hopProgress}
        projectExitT={projectExitT}
        aboutProgress={aboutProgress}
        lastBallSlotRef={lastBallSlotRef}
        profileBallSlotRef={profileBallSlotRef}
        handoffPoseRef={handoffPoseRef}
        visible={showLandedOrb && !hideProjectBall}
      />
    </section>
  );
}
