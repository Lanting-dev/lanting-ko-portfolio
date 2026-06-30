"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  EXPERIMENTAL_PROJECTS,
  getExperimentalPreviewMedia,
} from "@/lib/experimental/projects";
import type { ExperimentalPreviewMedia } from "@/lib/experimental/projects";
import type { ExperimentalSlug } from "@/lib/experimental/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function PreviewLayer({
  media,
  visible,
  reducedMotion,
}: {
  media: ExperimentalPreviewMedia;
  visible: boolean;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const className = "lab-hover-list-float-media";
  const showVideo = media.type === "video" && !reducedMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;
    if (visible) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, showVideo]);

  if (showVideo) {
    return (
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        draggable={false}
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={media.type === "video" ? media.poster ?? media.src : media.src}
      alt=""
      width={media.width}
      height={media.height}
      className={className}
      draggable={false}
    />
  );
}

function MobileCardMedia({ slug }: { slug: ExperimentalSlug }) {
  const media = getExperimentalPreviewMedia(slug);
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const showVideo = media.type === "video" && !reducedMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;
    void video.play().catch(() => {});
  }, [showVideo]);

  if (showVideo) {
    return (
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        className="lab-mobile-card-media-el"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        draggable={false}
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={media.type === "video" ? media.poster ?? media.src : media.src}
      alt=""
      width={media.width}
      height={media.height}
      className="lab-mobile-card-media-el"
      draggable={false}
    />
  );
}

export function ExperimentalHoverList() {
  const { ui } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState<ExperimentalSlug | null>(null);

  return (
    <div
      className="lab-hover-list"
      onMouseLeave={() => setActive(null)}
    >
      <ol className="lab-hover-list-names">
        {EXPERIMENTAL_PROJECTS.map((project) => {
          const isActive = project.slug === active;
          const previewMedia = getExperimentalPreviewMedia(project.slug);
          return (
            <li key={project.slug}>
              <Link
                href={`/lab/${project.slug}`}
                className={`lab-hover-list-row${isActive ? " is-active" : ""}`}
                onMouseEnter={() => setActive(project.slug)}
                onFocus={() => setActive(project.slug)}
              >
                <span className="lab-hover-list-title">{project.title}</span>
                <span className="lab-hover-list-meta">
                  {project.tag}
                </span>
                <span className="lab-hover-list-arrow" aria-hidden>
                  ↗
                </span>
                <span className="lab-hover-list-float-preview" aria-hidden>
                  <PreviewLayer
                    media={previewMedia}
                    visible={isActive}
                    reducedMotion={reducedMotion}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="sr-only">{ui.lab.viewProject}</p>
    </div>
  );
}

export function ExperimentalMobileCards() {
  const { ui } = useLocale();

  return (
    <div className="lab-mobile-cards">
      {EXPERIMENTAL_PROJECTS.map((project) => (
        <Link
          key={project.slug}
          href={`/lab/${project.slug}`}
          className="lab-mobile-card"
        >
          <div className="lab-mobile-card-media">
            <MobileCardMedia slug={project.slug} />
          </div>
          <div className="lab-mobile-card-copy">
            <span className="lab-mobile-card-tag">{project.tag}</span>
            <span className="lab-mobile-card-title">{project.title}</span>
          </div>
          <span className="lab-mobile-card-cta">{ui.lab.viewProject}</span>
        </Link>
      ))}
    </div>
  );
}

export function ExperimentalList() {
  const isMobile = useIsMobile();
  return isMobile ? <ExperimentalMobileCards /> : <ExperimentalHoverList />;
}
