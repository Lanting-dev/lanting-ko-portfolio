"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProjectItem } from "@/lib/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedProject } from "@/hooks/useLocalizedProject";

type ProjectDetailStageProps = {
  project: ProjectItem;
  visible: boolean;
  mediaVisible?: boolean;
  copyOpacity?: number;
};

export function ProjectDetailStage({
  project,
  visible,
  mediaVisible = true,
  copyOpacity = 1,
}: ProjectDetailStageProps) {
  const { ui } = useLocale();
  const localized = useLocalizedProject(project);
  const imageSrc = localized.colorSrc ?? localized.src;
  const [displayProject, setDisplayProject] = useState(project);
  const [contentFade, setContentFade] = useState(1);
  const prevIdRef = useRef(project.id);

  useEffect(() => {
    if (project.id === prevIdRef.current) return;
    prevIdRef.current = project.id;
    setContentFade(0);
    const swap = window.setTimeout(() => {
      setDisplayProject(project);
      setContentFade(1);
    }, 140);
    return () => window.clearTimeout(swap);
  }, [project]);

  const displayLocalized = useLocalizedProject(displayProject);
  const displayImageSrc = displayLocalized.colorSrc ?? displayLocalized.src;

  return (
    <div
      className="project-detail-stage"
      data-visible={visible ? "true" : "false"}
      data-media-visible={mediaVisible ? "true" : "false"}
      aria-hidden={!visible}
      style={{ opacity: contentFade }}
    >
      <div className="project-detail-panel">
        <div
          className="project-detail-media"
          style={{ opacity: mediaVisible ? 1 : 0 }}
          aria-hidden={!mediaVisible}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImageSrc}
            alt={displayLocalized.alt}
            className="project-detail-image"
            draggable={false}
          />
        </div>

        <div
          className="project-detail-copy"
          style={{ opacity: copyOpacity }}
        >
          {displayLocalized.title ? (
            <h3 className="project-detail-title">{displayLocalized.title}</h3>
          ) : null}
          {displayLocalized.meta ? (
            <p className="project-detail-meta">{displayLocalized.meta}</p>
          ) : null}
          {displayLocalized.description ? (
            <p className="project-detail-desc">{displayLocalized.description}</p>
          ) : null}
          {displayLocalized.href ? (
            <Link href={displayLocalized.href} className="site-cta project-detail-cta">
              {ui.work.viewCaseStudy}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
