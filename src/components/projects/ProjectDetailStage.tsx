"use client";

import Link from "next/link";
import type { ProjectItem } from "@/lib/projects";

type ProjectDetailStageProps = {
  project: ProjectItem;
  visible: boolean;
};

export function ProjectDetailStage({ project, visible }: ProjectDetailStageProps) {
  const imageSrc = project.colorSrc ?? project.src;

  return (
    <div
      className="project-detail-stage"
      data-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
    >
      <div key={project.id} className="project-detail-panel">
        <div className="project-detail-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={project.alt}
            className="project-detail-image"
            draggable={false}
          />
        </div>

        <div className="project-detail-copy">
          {project.title ? (
            <h3 className="project-detail-title">{project.title}</h3>
          ) : null}
          {project.meta ? (
            <p className="project-detail-meta">{project.meta}</p>
          ) : null}
          {project.description ? (
            <p className="project-detail-desc">{project.description}</p>
          ) : null}
          {project.href ? (
            <Link href={project.href} className="site-cta project-detail-cta">
              View case study →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
