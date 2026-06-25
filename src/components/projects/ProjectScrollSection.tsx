"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { clamp } from "@/lib/parallax/interpolate";
import {
  PROJECT_DETAIL_START,
} from "@/lib/projects/projectScroll";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import {
  computeScatterProgress,
  getHopDetailMediaOpacity,
  getHopInPanelImageBlend,
  getHopMorphT,
  getProjectFocusIndexStable,
  getScatterCardLayout,
  HOP_DETAIL_EXIT_END,
  isProjectHop,
} from "@/lib/projects/projectScatter";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedProjects } from "@/hooks/useLocalizedProject";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ProjectCard } from "./ProjectCard";
import type { PointerTiltRef } from "./ProjectCubeScene";
import { ProjectDetailStage } from "./ProjectDetailStage";

type ProjectScrollSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
};

export function ProjectScrollSection({
  trackRef,
}: ProjectScrollSectionProps) {
  const { ui } = useLocale();
  const projects = useLocalizedProjects(VISIBLE_PROJECTS);
  const progress = useParallaxValue((s) => s.projectProgress);
  const projectTrackVh = useScrollTrackVh("project");
  const focusIndexRef = useRef(-1);
  const wasDetailSettledRef = useRef(false);
  const settledProjectIndexRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const pointerTiltRef = useRef({ x: 0, y: 0 }) as PointerTiltRef;
  const [pointerEngaged, setPointerEngaged] = useState(false);

  const scatterT = computeScatterProgress(progress);
  const focusIndex = getProjectFocusIndexStable(progress, focusIndexRef.current);
  focusIndexRef.current = focusIndex;
  const inDetail = focusIndex >= 0;
  const hopMorphT = getHopMorphT(progress, focusIndex);
  const hopMorphComplete = reducedMotion || hopMorphT >= 1;
  const scatterHold = scatterT >= 0.98 && progress < PROJECT_DETAIL_START;

  if (hopMorphComplete && focusIndex >= 0) {
    wasDetailSettledRef.current = true;
    settledProjectIndexRef.current = focusIndex;
  }

  if (!inDetail) {
    wasDetailSettledRef.current = false;
  }

  const carryFromSettled =
    wasDetailSettledRef.current &&
    inDetail &&
    hopMorphT < HOP_DETAIL_EXIT_END &&
    focusIndex !== settledProjectIndexRef.current;

  const hoppingInPanel = isProjectHop(
    inDetail,
    hopMorphT,
    focusIndex,
    settledProjectIndexRef.current,
    wasDetailSettledRef.current,
  );

  const hopImageBlend = hoppingInPanel ? getHopInPanelImageBlend(hopMorphT) : 1;

  const detailMediaOpacity = reducedMotion
    ? inDetail
      ? 1
      : 0
    : hoppingInPanel
      ? 1
      : getHopDetailMediaOpacity(
          hopMorphT,
          inDetail,
          carryFromSettled,
          false,
        );

  const entryCopyOpacity =
    inDetail && !hoppingInPanel && !hopMorphComplete
      ? reducedMotion
        ? 1
        : clamp((hopMorphT - 0.25) / 0.35, 0, 1)
      : 1;

  const detailProject = projects[focusIndex >= 0 ? focusIndex : 0] ?? projects[0];
  const fromDetailProject =
    settledProjectIndexRef.current >= 0
      ? projects[settledProjectIndexRef.current]
      : detailProject;

  useEffect(() => {
    if (inDetail) {
      pointerTiltRef.current = { x: 0, y: 0 };
    }
  }, [inDetail, pointerTiltRef]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (inDetail || reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      pointerTiltRef.current = {
        x: clamp(((e.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        y: clamp(((e.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      };
      setPointerEngaged(true);
    },
    [inDetail, reducedMotion, pointerTiltRef],
  );

  const handlePointerLeave = useCallback(() => {
    pointerTiltRef.current = { x: 0, y: 0 };
    setPointerEngaged(false);
  }, [pointerTiltRef]);

  const sectionEnter = clamp(progress / 0.08, 0, 1);
  const preDetailFade = clamp(
    (progress - (PROJECT_DETAIL_START - 0.06)) / 0.06,
    0,
    1,
  );

  const introOpacity = inDetail
    ? 0
    : progress < PROJECT_DETAIL_START
      ? sectionEnter * (1 - preDetailFade)
      : clamp(1 - (progress - PROJECT_DETAIL_START) / 0.08, 0, 1);

  const introHidden = inDetail || introOpacity < 0.02;

  const scatterTForCards = scatterT >= 0.98 ? 1 : scatterT;
  const scatterBackdrop = scatterT >= 0.98;

  const setPinTrackRef = useCallback(
    (node: HTMLElement | null) => {
      if (trackRef) trackRef.current = node;
    },
    [trackRef],
  );

  return (
    <section
      ref={setPinTrackRef}
      id="work"
      className="project-scroll-pin relative w-full"
      style={{ height: `${projectTrackVh}vh` }}
    >
      <div
        className="project-scatter-sticky sticky top-0 mx-auto flex h-dvh w-full max-w-[1440px] flex-col items-center justify-center page-shell"
        data-detail-active={inDetail ? "true" : "false"}
        data-scatter-phase={
          scatterT < 0.04
            ? "cluster"
            : scatterT < 0.98
              ? "scatter"
              : scatterHold
                ? "hold"
                : "detail"
        }
        onPointerMove={!inDetail && !reducedMotion ? handlePointerMove : undefined}
        onPointerLeave={!inDetail ? handlePointerLeave : undefined}
      >
        <div
          className="project-scatter-center"
          style={{
            opacity: introOpacity,
            visibility: introHidden ? "hidden" : "visible",
            transform: `translateY(${(1 - sectionEnter) * 18}px)`,
          }}
        >
          <h2 className="section-bigword project-scatter-word">Work</h2>
          <p className="project-scatter-intro">{ui.work.subheading}</p>
        </div>

        {projects.map((project, i) => {
          const layout = getScatterCardLayout(
            i,
            scatterTForCards,
            progress,
            scatterBackdrop,
          );
          const isFocused = inDetail && i === focusIndex;
          const cardOpacity = scatterT >= 0.98 ? 1 : layout.opacity;

          return (
            <div
              key={project.id}
              className={`project-scatter-card${isFocused ? " is-focused" : ""}${scatterT < 0.98 ? " is-clustered" : ""}`}
              style={{
                left: layout.left,
                top: layout.top,
                opacity: cardOpacity,
                transform: layout.transform,
                zIndex: layout.zIndex,
              }}
            >
              <ProjectCard
                project={project}
                cardIndex={i}
                backdrop
                focused={false}
                scatterInteractive={!inDetail}
                pointerTiltRef={pointerTiltRef}
                pointerEngaged={pointerEngaged}
              />
            </div>
          );
        })}

        <div
          className="project-detail-wrap"
          aria-hidden={!inDetail}
          style={{
            opacity: inDetail ? 1 : 0,
            visibility: inDetail ? "visible" : "hidden",
            pointerEvents: inDetail ? "auto" : "none",
          }}
        >
          <ProjectDetailStage
            project={detailProject}
            fromProject={fromDetailProject}
            imageBlend={hopImageBlend}
            visible={inDetail}
            mediaOpacity={detailMediaOpacity}
            entryCopyOpacity={entryCopyOpacity}
          />
        </div>
      </div>
    </section>
  );
}
