"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { clamp } from "@/lib/parallax/interpolate";
import {
  PROJECT_DETAIL_START,
} from "@/lib/projects/projectScroll";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import {
  computeScatterProgress,
  getFocusedMorphLayout,
  getHopMorphT,
  getProjectFocusIndexStable,
  getScatterCardLayout,
  isHopMorphComplete,
} from "@/lib/projects/projectScatter";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedProjects } from "@/hooks/useLocalizedProject";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();
  const focusIndexRef = useRef(-1);
  const reducedMotion = usePrefersReducedMotion();
  const pointerTiltRef = useRef({ x: 0, y: 0 }) as PointerTiltRef;
  const [pointerEngaged, setPointerEngaged] = useState(false);

  const scatterT = computeScatterProgress(progress);
  const focusIndex = getProjectFocusIndexStable(progress, focusIndexRef.current);
  focusIndexRef.current = focusIndex;
  const inDetail = focusIndex >= 0;
  const hopMorphT = getHopMorphT(progress, focusIndex);
  const hopMorphComplete =
    reducedMotion || isHopMorphComplete(progress, focusIndex);
  const scatterHold = scatterT >= 0.98 && progress < PROJECT_DETAIL_START;
  const scatterInteractive = !inDetail;

  useEffect(() => {
    if (!inDetail) return;
    pointerTiltRef.current = { x: 0, y: 0 };
    setPointerEngaged(false);
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

  const introOpacity =
    progress < PROJECT_DETAIL_START
      ? sectionEnter
      : clamp(1 - (progress - PROJECT_DETAIL_START) / 0.08, 0, 1);

  const detailCopyOpacity = inDetail
    ? reducedMotion
      ? 1
      : clamp((hopMorphT - 0.35) / 0.65, 0, 1)
    : 0;

  const setPinTrackRef = useCallback(
    (node: HTMLElement | null) => {
      if (trackRef) trackRef.current = node;
    },
    [trackRef],
  );

  const activeProject =
    focusIndex >= 0 ? projects[focusIndex] : projects[0];

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
        data-hop-morph={inDetail && !hopMorphComplete ? "true" : "false"}
        data-scatter-phase={
          scatterT < 0.04
            ? "cluster"
            : scatterT < 0.98
              ? "scatter"
              : scatterHold
                ? "hold"
                : "detail"
        }
        onPointerMove={scatterInteractive ? handlePointerMove : undefined}
        onPointerLeave={scatterInteractive ? handlePointerLeave : undefined}
      >
        <div
          className="project-scatter-center"
          style={{
            opacity: introOpacity,
            transform: `translateY(${(1 - sectionEnter) * 18}px)`,
          }}
        >
          <h2 className="section-bigword project-scatter-word">Work</h2>
          <p className="project-scatter-intro">{ui.work.subheading}</p>
        </div>

        <div
          className="project-detail-wrap"
          aria-hidden={!inDetail}
        >
          <ProjectDetailStage
            project={activeProject}
            visible={inDetail}
            mediaVisible={hopMorphComplete}
            copyOpacity={detailCopyOpacity}
          />
        </div>

        {projects.map((project, i) => {
          const layout = getScatterCardLayout(i, scatterT, progress);
          const isFocused = inDetail && i === focusIndex;
          const morphLayout =
            isFocused && !hopMorphComplete
              ? getFocusedMorphLayout(
                  i,
                  scatterT,
                  progress,
                  focusIndex,
                  hopMorphT,
                  isMobile,
                )
              : null;
          const activeLayout = morphLayout ?? layout;
          const isMorphing = isFocused && !hopMorphComplete;

          const cardOpacity = inDetail
            ? isFocused
              ? isMorphing
                ? 1
                : 0
              : 0.22 * layout.opacity
            : layout.opacity;

          return (
            <div
              key={project.id}
              className={`project-scatter-card${isFocused ? " is-focused" : ""}${isMorphing ? " is-morphing" : ""}${hopMorphComplete && isFocused ? " is-settled" : ""}${scatterT < 0.98 ? " is-clustered" : ""}`}
              style={{
                left: activeLayout.left,
                top: activeLayout.top,
                opacity: cardOpacity,
                transform: activeLayout.transform,
                zIndex: activeLayout.zIndex,
              }}
            >
              <ProjectCard
                project={project}
                cardIndex={i}
                backdrop
                focused={false}
                morphFlat={isMorphing}
                scatterInteractive={scatterInteractive}
                pointerTiltRef={pointerTiltRef}
                pointerEngaged={pointerEngaged}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
