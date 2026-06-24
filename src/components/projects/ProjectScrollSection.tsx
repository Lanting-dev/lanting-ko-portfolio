"use client";

import { useCallback, type RefObject } from "react";
import { clamp } from "@/lib/parallax/interpolate";
import {
  PROJECT_DETAIL_START,
  PROJECT_SCROLL_VH,
} from "@/lib/projects/projectScroll";
import {
  computeScatterProgress,
  getProjectFocusIndex,
  getScatterCardLayout,
} from "@/lib/projects/projectScatter";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailStage } from "./ProjectDetailStage";

type ProjectScrollSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
};

export function ProjectScrollSection({
  trackRef,
}: ProjectScrollSectionProps) {
  const progress = useParallaxValue((s) => s.projectProgress);

  const scatterT = computeScatterProgress(progress);
  const focusIndex = getProjectFocusIndex(progress);
  const inDetail = focusIndex >= 0;
  const scatterHold = scatterT >= 0.98 && progress < PROJECT_DETAIL_START;

  const sectionEnter = clamp(progress / 0.08, 0, 1);

  const introOpacity =
    progress < PROJECT_DETAIL_START
      ? sectionEnter
      : clamp(1 - (progress - PROJECT_DETAIL_START) / 0.08, 0, 1);

  const detailOpacity =
    progress < PROJECT_DETAIL_START
      ? 0
      : clamp((progress - PROJECT_DETAIL_START) / 0.07, 0, 1);

  const setPinTrackRef = useCallback(
    (node: HTMLElement | null) => {
      if (trackRef) trackRef.current = node;
    },
    [trackRef],
  );

  const activeProject =
    focusIndex >= 0 ? VISIBLE_PROJECTS[focusIndex] : VISIBLE_PROJECTS[0];

  return (
    <section
      ref={setPinTrackRef}
      id="work"
      className="project-scroll-pin relative w-full"
      style={{ height: `${PROJECT_SCROLL_VH}vh` }}
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
      >
        <div
          className="project-scatter-center"
          style={{
            opacity: introOpacity,
            transform: `translateY(${(1 - sectionEnter) * 18}px)`,
          }}
        >
          <h2 className="section-bigword project-scatter-word">Work</h2>
          <p className="project-scatter-intro">Selected product design work</p>
        </div>

        <div
          className="project-detail-wrap"
          style={{ opacity: detailOpacity }}
          aria-hidden={!inDetail}
        >
          <ProjectDetailStage project={activeProject} visible={inDetail} />
        </div>

        {VISIBLE_PROJECTS.map((project, i) => {
          const layout = getScatterCardLayout(i, scatterT, progress);
          const isFocused = inDetail && i === focusIndex;
          const cardOpacity = inDetail
            ? isFocused
              ? 0
              : 0.22 * layout.opacity
            : layout.opacity;

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
                focused={isFocused}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
