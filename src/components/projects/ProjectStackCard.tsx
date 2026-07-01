"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { useLocalizedProject } from "@/hooks/useLocalizedProject";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { ProjectItem } from "@/lib/projects";

type ProjectStackCardProps = {
  project: ProjectItem;
  index: number;
  /** Scroll gap before this card enters (vh). */
  stackOffsetVh?: number;
  /** Ball impact anchor on the first card. */
  impactRef?: RefObject<HTMLDivElement | null>;
};

/** First segment of meta — used for the folder tab label. */
function projectTabLabel(meta?: string): string | null {
  if (!meta) return null;
  const head = meta.split("·")[0]?.trim();
  return head || null;
}

export function ProjectStackCard({
  project,
  index,
  stackOffsetVh = 0,
  impactRef,
}: ProjectStackCardProps) {
  const { ui } = useLocale();
  const localized = useLocalizedProject(project);
  const artSrc = localized.colorSrc ?? localized.src;
  const tabLabel = projectTabLabel(localized.meta);

  return (
    <article
      className="project-stack-card"
      style={{
        zIndex: index + 1,
        marginTop: stackOffsetVh > 0 ? `${stackOffsetVh}vh` : undefined,
        ["--stack-index" as string]: String(index),
      }}
      data-stack-index={index}
    >
      {tabLabel ? (
        <p className="project-stack-card-tab" aria-hidden="true">
          {tabLabel}
        </p>
      ) : null}

      <div
        ref={index === 0 ? impactRef : undefined}
        className="project-stack-card-inner"
      >
        <div className="project-stack-card-copy">
          <p className="project-stack-card-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </p>
          {localized.title ? (
            <h3 className="project-stack-card-title">{localized.title}</h3>
          ) : null}
          {localized.meta ? (
            <p className="project-stack-card-meta">{localized.meta}</p>
          ) : null}
          {localized.description ? (
            <p className="project-stack-card-desc">{localized.description}</p>
          ) : null}
          {localized.href ? (
            <Link href={localized.href} className="site-cta project-stack-card-cta">
              {ui.work.viewCaseStudy}
            </Link>
          ) : null}
        </div>

        <div className="project-stack-card-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artSrc}
            alt={localized.alt}
            className="project-stack-card-art"
            draggable={false}
          />
        </div>
      </div>
    </article>
  );
}
