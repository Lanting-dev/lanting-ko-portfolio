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
  /** 0→1 crossfade from cube to flat art during morph. */
  morphFlatBlend?: number;
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
  morphFlatBlend = 0,
  pointerTiltRef,
  pointerEngaged = false,
  stacked = false,
  stackShiftPx = 0,
  stackDelayMs = 0,
}: ProjectCardProps) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const cubeHovered = scatterInteractive && hovered;
  const flatBlend = Math.max(morphFlat ? 1 : 0, morphFlatBlend);
  const useFlatOnly = flatBlend >= 0.999 || (isMobile && backdrop);
  const artSrc = project.colorSrc ?? project.src;

  const flatArt = (
    <div className="project-card-art" aria-hidden={backdrop}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artSrc}
        alt={backdrop ? "" : project.alt}
        className="project-card-art-img"
        draggable={false}
      />
    </div>
  );

  const cardMedia =
    useFlatOnly ? (
      flatArt
    ) : flatBlend > 0 ? (
      <div className="project-card-art-blend relative h-full w-full">
        <div
          className="absolute inset-0"
          style={{ opacity: 1 - flatBlend }}
          aria-hidden={flatBlend > 0.5}
        >
          <ProjectCubeScene
            greySrc={project.src}
            colorSrc={artSrc}
            seed={cardIndex * 53}
            hovered={cubeHovered}
            focused={focused}
            pointerTiltRef={pointerTiltRef}
            pointerParallax={scatterInteractive}
            pointerEngaged={scatterInteractive && pointerEngaged}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ opacity: flatBlend }}
          aria-hidden={flatBlend < 0.5}
        >
          {flatArt}
        </div>
      </div>
    ) : (
      <ProjectCubeScene
        greySrc={project.src}
        colorSrc={artSrc}
        seed={cardIndex * 53}
        hovered={cubeHovered}
        focused={focused}
        pointerTiltRef={pointerTiltRef}
        pointerParallax={scatterInteractive}
        pointerEngaged={scatterInteractive && pointerEngaged}
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

  const cardInner = project.href ? (
    <Link
      href={project.href}
      className="block"
      aria-label={project.alt}
      tabIndex={scatterInteractive ? 0 : -1}
      aria-hidden={!scatterInteractive}
      style={{ pointerEvents: scatterInteractive ? "auto" : "none" }}
    >
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
      {cardInner}
    </article>
  );
});
