"use client";

import Link from "next/link";
import type { ProjectItem } from "@/lib/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedProject } from "@/hooks/useLocalizedProject";

type ProjectDetailStageProps = {
  project: ProjectItem;
  fromProject?: ProjectItem;
  imageBlend?: number;
  visible: boolean;
  mediaOpacity?: number;
  copyOpacity?: number;
};

export function ProjectDetailStage({
  project,
  fromProject,
  imageBlend = 1,
  visible,
  mediaOpacity = 1,
  copyOpacity = 1,
}: ProjectDetailStageProps) {
  const { ui } = useLocale();
  const localized = useLocalizedProject(project);
  const fromLocalized = useLocalizedProject(fromProject ?? project);
  const imageSrc = localized.colorSrc ?? localized.src;
  const fromImageSrc = fromLocalized.colorSrc ?? fromLocalized.src;
  const hopping = fromProject != null && fromProject.id !== project.id;

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
          {hopping ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fromImageSrc}
                alt=""
                className="project-detail-image project-detail-image--from"
                style={{ opacity: 1 - imageBlend }}
                draggable={false}
                aria-hidden
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={localized.alt}
                className="project-detail-image project-detail-image--to"
                style={{ opacity: imageBlend }}
                draggable={false}
              />
            </>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt={localized.alt}
              className="project-detail-image"
              draggable={false}
            />
          )}
        </div>

        <div
          className="project-detail-copy"
          style={{ opacity: copyOpacity }}
          aria-hidden={copyOpacity < 0.05}
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
      </div>
    </div>
  );
}
