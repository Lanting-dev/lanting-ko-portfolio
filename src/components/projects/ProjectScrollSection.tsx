"use client";

import { useCallback, useRef, type RefObject, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import { projectStackLayout } from "@/lib/projects/projectStack";
import { ScrambleWord } from "@/components/ScrambleWord";
import { useLocalizedProjects } from "@/hooks/useLocalizedProject";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  useParallaxValue,
  useParallaxFrame,
} from "@/components/parallax/ParallaxEngineProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { WORK_LEFT_ASCII, WORK_RIGHT_ASCII } from "@/lib/ascii/handAscii";
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
  const viewportHeight = useViewportHeight();
  const stackLayout = projectStackLayout(isMobile, projects.length, viewportHeight);
  const reducedMotion = usePrefersReducedMotion();
  const { ui } = useLocale();
  const workImpactRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const projectProgress = useParallaxValue((s) => s.projectProgress);
  const headingPinned = projectProgress > 0.01 && projectProgress < 0.995;

  // Scroll-driven "camera zoom": while the section pins over its intro band the
  // card grows from small to full and the two framing hands spread out from the
  // centre to the corners. It reaches 1 exactly as the intro ends, so the card
  // stack only starts peeling once the zoom has finished.
  const span = Math.max(1, stackLayout.section - 100);
  const zoomEnd = stackLayout.intro / span;
  const exitStart = 1 - stackLayout.exit / span;
  useParallaxFrame((snapshot) => {
    const el = sectionRef.current;
    if (!el) return;
    const p = snapshot.projectProgress;
    const zoom = Math.min(1, Math.max(0, p / zoomEnd));
    const exit = Math.min(1, Math.max(0, (p - exitStart) / (1 - exitStart)));
    el.style.setProperty("--work-zoom", zoom.toFixed(4));
    el.style.setProperty("--work-exit", exit.toFixed(4));
  });

  const setPinTrackRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      if (trackRef) trackRef.current = node;
    },
    [trackRef],
  );

  if (reducedMotion) {
    return (
      <section id="work" className="project-stack-static page-shell pt-2 pb-14 md:pt-2 md:pb-20">
        <div className="project-stack-static-heading">
          <ScrambleWord text={ui.work.heading} className="project-stack-static-word" />
        </div>
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
        className={`project-stack-heading${headingPinned ? " is-pinned" : ""}`}
        aria-hidden={!headingPinned}
      >
        <div className="project-stack-hand project-stack-hand--top" aria-hidden="true">
          <pre className="hand-ascii project-stack-hand-ascii">{WORK_RIGHT_ASCII}</pre>
        </div>
        <div className="project-stack-hand project-stack-hand--bottom" aria-hidden="true">
          <pre className="hand-ascii project-stack-hand-ascii">{WORK_LEFT_ASCII}</pre>
        </div>
        <div className="project-stack-heading-inner page-shell">
          <ScrambleWord text={ui.work.heading} className="project-stack-word" />
        </div>
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
