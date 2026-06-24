"use client";

import Link from "next/link";
import type { ProjectItem } from "@/lib/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedProject } from "@/hooks/useLocalizedProject";

type ProjectDetailStageProps = {
  project: ProjectItem;
  visible: boolean;
};

export function ProjectDetailStage({ project, visible }: ProjectDetailStageProps) {
  const { ui } = useLocale();
  const localized = useLocalizedProject(project);
  const imageSrc = localized.colorSrc ?? localized.src;

  return (
    <div
      className="project-detail-stage"
      data-visible={visible ? "true" : "false"}
      aria-hidden={!visible}
    >
      <div className="project-detail-panel">
        <div className="project-detail-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={localized.alt}
            className="project-detail-image"
            draggable={false}
          />
        </div>

        <div className="project-detail-copy">
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
