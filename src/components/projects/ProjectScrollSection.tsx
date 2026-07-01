"use client";

import { useCallback, useRef, type RefObject, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import { projectStackLayout } from "@/lib/projects/projectStack";
import { ScrambleWord } from "@/components/ScrambleWord";
import { useLocalizedProjects } from "@/hooks/useLocalizedProject";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { ProjectStackCard } from "./ProjectStackCard";

type ProjectScrollSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
};

function stackRoomStyle(layout: ReturnType<typeof projectStackLayout>): CSSProperties {
  return {
    height: `${layout.scrollRoom}vh`,
    ["--project-stack-card-body-vh" as string]: `${layout.cardBody}vh`,
    ["--project-stack-card-step-vh" as string]: `${layout.cardStep}vh`,
  };
}

export function ProjectScrollSection({
  trackRef,
}: ProjectScrollSectionProps) {
  const projects = useLocalizedProjects(VISIBLE_PROJECTS);
  const isMobile = useIsMobile();
  const stackLayout = projectStackLayout(isMobile, projects.length);
  const reducedMotion = usePrefersReducedMotion();
  const workImpactRef = useRef<HTMLDivElement>(null);
  const projectProgress = useParallaxValue((s) => s.projectProgress);
  const headingPinned = projectProgress > 0.01 && projectProgress < 0.995;

  const setPinTrackRef = useCallback(
    (node: HTMLElement | null) => {
      if (trackRef) trackRef.current = node;
    },
    [trackRef],
  );

  if (reducedMotion) {
    return (
      <section id="work" className="project-stack-static page-shell py-14 md:py-20">
        <ScrambleWord text="Work" className="project-stack-static-word" />
        <ul className="project-stack-static-list">
          {projects.map((project, index) => (
            <li key={project.id}>
              <ProjectStackCard project={project} index={index} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      ref={setPinTrackRef}
      id="work"
      className="project-stack-pin relative w-full"
      style={{ height: `${stackLayout.section}vh` }}
      data-work-impact
    >
      <div
        className={`project-stack-heading page-shell${headingPinned ? " is-pinned" : ""}`}
        aria-hidden={!headingPinned}
      >
        <ScrambleWord text="Work" className="project-stack-word" />
      </div>

      <div
        className="project-stack-intro-spacer"
        style={{ height: `${stackLayout.intro}vh` }}
        aria-hidden="true"
      />

      <div
        className="project-stack-scroll-room page-shell"
        style={stackRoomStyle(stackLayout)}
      >
        {projects.map((project, index) => (
          <ProjectStackCard
            key={project.id}
            project={project}
            index={index}
            impactRef={index === 0 ? workImpactRef : undefined}
            stackOffsetVh={index > 0 ? stackLayout.cardStep : 0}
          />
        ))}
      </div>

      <div
        className="project-stack-exit-segment"
        style={{ height: `${stackLayout.exit}vh` }}
        aria-hidden="true"
      />
    </section>
  );
}
