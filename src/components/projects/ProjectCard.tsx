"use client";

import Link from "next/link";
import { memo, useCallback, useRef, useState } from "react";
import { ProjectCubeScene } from "@/components/projects/ProjectCubeScene";
import type { ProjectItem } from "@/lib/projects";

type ProjectCardProps = {
  project: ProjectItem;
  cardIndex?: number;
  ballSlotRef?: (node: HTMLDivElement | null) => void;
  cardImpactRef?: React.RefObject<HTMLDivElement | null>;
  cardNudgeY?: number;
  revealed?: boolean;
  /** Scroll-centred card — same read mode as hover (color, caption, lift). */
  focused?: boolean;
};

export const ProjectCard = memo(function ProjectCard({
  project,
  cardIndex = 0,
  ballSlotRef,
  cardImpactRef,
  cardNudgeY = 0,
  revealed = false,
  focused = false,
}: ProjectCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const setFrameRef = useCallback(
    (node: HTMLDivElement | null) => {
      frameRef.current = node;
      if (cardImpactRef) {
        cardImpactRef.current = node;
      }
    },
    [cardImpactRef],
  );

  const cardBody = (
    <div
      className="project-card-body relative"
      style={{
        transform:
          cardNudgeY !== 0 ? `translateY(${cardNudgeY}px)` : undefined,
      }}
    >
      <div
        ref={ballSlotRef}
        className="project-ball-anchor pointer-events-none absolute left-1/2 top-0 h-px w-px opacity-0"
        aria-hidden="true"
      />

      <div
        ref={setFrameRef}
        className="project-card-frame relative z-10 overflow-visible rounded-[20px]"
      >
        <ProjectCubeScene
          greySrc={project.src}
          colorSrc={project.colorSrc ?? project.src}
          seed={cardIndex * 53}
          hovered={hovered}
          focused={focused}
        />

        {(project.title ||
          project.meta ||
          project.description ||
          project.href) && (
          <div className="project-card-caption">
            {project.title ? (
              <p className="project-card-title">{project.title}</p>
            ) : null}
            {project.meta ? (
              <p className="project-card-meta">{project.meta}</p>
            ) : null}
            {project.description ? (
              <p className="project-card-desc">{project.description}</p>
            ) : null}
            {project.href ? (
              <span className="site-cta project-card-cta">View case study →</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <article
      className="project-card relative shrink-0 overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hovered={hovered ? "true" : undefined}
      data-focused={focused ? "true" : undefined}
      data-revealed={revealed ? "true" : undefined}
    >
      {project.href ? (
        <Link href={project.href} className="block" aria-label={project.alt}>
          {cardBody}
        </Link>
      ) : (
        cardBody
      )}
    </article>
  );
});
