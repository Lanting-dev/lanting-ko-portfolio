"use client";

import Link from "next/link";
import type { ProjectItem } from "@/lib/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedProject } from "@/hooks/useLocalizedProject";

type ProjectDetailStageProps = {
  project: ProjectItem;
  fromProject: ProjectItem;
  imageBlend?: number;
  visible: boolean;
  mediaOpacity?: number;
  /** Fade-in for first corner morph entry only (not hop crossfade). */
  entryCopyOpacity?: number;
};

function ProjectDetailCopy({
  project,
  opacity = 1,
}: {
  project: ProjectItem;
  opacity?: number;
}) {
  const { ui } = useLocale();
  const localized = useLocalizedProject(project);

  return (
    <div
      className="project-detail-copy"
      style={{ opacity }}
      aria-hidden={opacity < 0.05}
    >
      {localized.title ? (
        <h3 className="project-detail-title">{localized.title}</h3>
      ) : null}
      {localized.meta ? (
        <p className="project-detail-meta">{localized.meta}</p>
      ) : null}
      {localized.description ? (
        <p className="project-detail-desc">{localized.description}</p>
      ) : null}
      {localized.href ? (
        <Link href={localized.href} className="site-cta project-detail-cta">
          {ui.work.viewCaseStudy}
        </Link>
      ) : null}
    </div>
  );
}

export function ProjectDetailStage({
  project,
  fromProject,
  imageBlend = 1,
  visible,
  mediaOpacity = 1,
  entryCopyOpacity = 1,
}: ProjectDetailStageProps) {
  const localized = useLocalizedProject(project);
  const fromLocalized = useLocalizedProject(fromProject);
  const imageSrc = localized.colorSrc ?? localized.src;
  const fromImageSrc = fromLocalized.colorSrc ?? fromLocalized.src;
  const hopping = fromProject.id !== project.id;
  const fromImageOpacity = hopping ? 1 - imageBlend : 0;
  const toImageOpacity = hopping ? imageBlend : 1;
  const fromCopyOpacity = hopping ? 1 - imageBlend : 0;
  const toCopyOpacity = hopping ? imageBlend : entryCopyOpacity;

  return (
    <div
      className="project-detail-stage"
      data-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
    >
      <div className="project-detail-panel">
        <div
          className="project-detail-media"
          style={{ opacity: mediaOpacity }}
          aria-hidden={mediaOpacity < 0.05}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fromImageSrc}
            alt=""
            className="project-detail-image project-detail-image--from"
            style={{ opacity: fromImageOpacity }}
            draggable={false}
            aria-hidden={!hopping || fromImageOpacity < 0.05}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={localized.alt}
            className="project-detail-image project-detail-image--to"
            style={{ opacity: toImageOpacity }}
            draggable={false}
            aria-hidden={hopping && toImageOpacity < 0.05}
          />
        </div>

        <div className="project-detail-copy-stack">
          <ProjectDetailCopy project={fromProject} opacity={fromCopyOpacity} />
          <ProjectDetailCopy project={project} opacity={toCopyOpacity} />
        </div>
      </div>
    </div>
  );
}
