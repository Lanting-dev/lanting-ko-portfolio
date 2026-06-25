"use client";

import Link from "next/link";
import { memo, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  ProjectCubeScene,
  type PointerTiltRef,
} from "@/components/projects/ProjectCubeScene";
import type { ProjectItem } from "@/lib/projects";

type ProjectCardProps = {
  project: ProjectItem;
  cardIndex?: number;
  /** Scroll-driven highlight for scatter backdrop mode. */
  focused?: boolean;
  /** Non-interactive scatter cube — no hover, no side caption. */
  backdrop?: boolean;
  /** Scatter phase: hover color, link, pointer parallax. */
  scatterInteractive?: boolean;
  /** Scroll morph — flat color art instead of WebGL cube. */
  morphFlat?: boolean;
  pointerTiltRef?: PointerTiltRef;
  pointerEngaged?: boolean;
  /** Entrance: stacked over card 0 until the ball lands, then springs apart. */
  stacked?: boolean;
  stackShiftPx?: number;
  stackDelayMs?: number;
};

export const ProjectCard = memo(function ProjectCard({
  project,
  cardIndex = 0,
  focused = false,
  backdrop = false,
  scatterInteractive = false,
  morphFlat = false,
  pointerTiltRef,
  pointerEngaged = false,
  stacked = false,
  stackShiftPx = 0,
  stackDelayMs = 0,
}: ProjectCardProps) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const cubeHovered = scatterInteractive && hovered;
  const useFlatArt = morphFlat || (isMobile && backdrop);
  const artSrc = project.colorSrc ?? project.src;

  const cardMedia = useFlatArt ? (
    <div className="project-card-art" aria-hidden={backdrop}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artSrc}
        alt={backdrop ? "" : project.alt}
        className="project-card-art-img"
        draggable={false}
      />
    </div>
  ) : (
    <ProjectCubeScene
      greySrc={project.src}
      colorSrc={artSrc}
      seed={cardIndex * 53}
      hovered={cubeHovered}
      focused={focused}
      pointerTiltRef={scatterInteractive ? pointerTiltRef : undefined}
      pointerParallax={scatterInteractive}
      pointerEngaged={pointerEngaged}
    />
  );

  const cardBody = (
    <div
      className="project-card-body relative"
      style={{
        transform: stacked
          ? `translateX(${-stackShiftPx}px) scale(0.92)`
          : undefined,
        opacity: stacked && cardIndex !== 0 ? 0 : 1,
        transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${stackDelayMs}ms, opacity 0.5s ease ${stackDelayMs}ms`,
      }}
      onMouseEnter={scatterInteractive ? () => setHovered(true) : undefined}
      onMouseLeave={scatterInteractive ? () => setHovered(false) : undefined}
    >
      <div className="project-card-frame relative z-10 overflow-visible rounded-[20px]">
        {cardMedia}
      </div>
    </div>
  );

  const linkedBody =
    scatterInteractive && project.href ? (
      <Link href={project.href} className="block" aria-label={project.alt}>
        {cardBody}
      </Link>
    ) : (
      cardBody
    );

  return (
    <article
      className="project-card relative shrink-0 overflow-visible"
      data-focused={focused ? "true" : undefined}
      data-backdrop={backdrop ? "true" : undefined}
      data-scatter-interactive={scatterInteractive ? "true" : undefined}
      data-morph-flat={morphFlat ? "true" : undefined}
      data-hovered={cubeHovered ? "true" : undefined}
    >
      {backdrop && !scatterInteractive ? cardBody : linkedBody}
    </article>
  );
});
