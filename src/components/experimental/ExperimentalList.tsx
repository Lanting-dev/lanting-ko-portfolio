"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  EXPERIMENTAL_PROJECTS,
  getExperimentalPreviewMedia,
} from "@/lib/experimental/projects";
import type { ExperimentalPreviewMedia } from "@/lib/experimental/projects";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Collapse a full tag ("VR mindfulness · spatial UX") to just its focus. */
function shortTag(tag: string): string {
  if (/iot/i.test(tag)) return "IoT";
  if (/\bvr\b/i.test(tag)) return "VR";
  return tag.split("·")[0]?.trim() ?? tag;
}

type LabEntry = {
  key: string;
  title: string;
  tag: string;
  href: string;
  preview: ExperimentalPreviewMedia;
};

/** The lab list = the experiment showcases plus IONG, a speculative case study. */
const LAB_ENTRIES: LabEntry[] = [
  ...EXPERIMENTAL_PROJECTS.map((project) => ({
    key: project.slug,
    title: project.title,
    tag: shortTag(project.tag),
    href: `/idea/${project.slug}`,
    preview: getExperimentalPreviewMedia(project.slug),
  })),
  {
    key: "iong",
    title: "IONG",
    tag: "Interactive website",
    href: "/idea/iong",
    preview: {
      type: "video",
      src: "/work/iong/intro.mp4",
      poster: "/work/iong/welcome-onboard.png",
    },
  },
];

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

function MobileCardMedia({ media }: { media: ExperimentalPreviewMedia }) {
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
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="lab-hover-list"
      onMouseLeave={() => setActive(null)}
    >
      <ol className="lab-hover-list-names">
        {LAB_ENTRIES.map((entry) => {
          const isActive = entry.key === active;
          return (
            <li key={entry.key}>
              <Link
                href={entry.href}
                className={`lab-hover-list-row${isActive ? " is-active" : ""}`}
                onMouseEnter={() => setActive(entry.key)}
                onFocus={() => setActive(entry.key)}
              >
                <span className="lab-hover-list-title">{entry.title}</span>
                <span className="lab-hover-list-meta">{entry.tag}</span>
                <span className="lab-hover-list-arrow" aria-hidden>
                  ↗
                </span>
                <span className="lab-hover-list-float-preview" aria-hidden>
                  <PreviewLayer
                    media={entry.preview}
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
      {LAB_ENTRIES.map((entry) => (
        <Link
          key={entry.key}
          href={entry.href}
          className="lab-mobile-card"
        >
          <div className="lab-mobile-card-media">
            <MobileCardMedia media={entry.preview} />
          </div>
          <div className="lab-mobile-card-copy">
            <span className="lab-mobile-card-tag">{entry.tag}</span>
            <span className="lab-mobile-card-title">{entry.title}</span>
          </div>
          <span className="lab-mobile-card-cta">{ui.lab.viewProject}</span>
        </Link>
      ))}
    </div>
  );
}

function WallTile({
  entry,
  reducedMotion,
}: {
  entry: LabEntry;
  reducedMotion: boolean;
}) {
  const media = entry.preview;
  const isVideo = media.type === "video" && !reducedMotion;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    void video.play().catch(() => {});
  }, [isVideo]);

  return (
    <Link href={entry.href} className="lab-wall-tile">
      <div className="lab-wall-media">
        {isVideo ? (
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            width={media.width}
            height={media.height}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            draggable={false}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={media.type === "video" ? media.poster ?? media.src : media.src}
            alt=""
            width={media.width}
            height={media.height}
            draggable={false}
          />
        )}
      </div>
      <div className="lab-wall-info">
        <span className="lab-wall-title">{entry.title}</span>
        <span className="lab-wall-tag">{entry.tag}</span>
      </div>
      <span className="lab-wall-arrow" aria-hidden>
        ↗
      </span>
    </Link>
  );
}

export function ExperimentalWall() {
  const { ui } = useLocale();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="lab-wall">
      {LAB_ENTRIES.map((entry) => (
        <WallTile key={entry.key} entry={entry} reducedMotion={reducedMotion} />
      ))}
      <p className="sr-only">{ui.lab.viewProject}</p>
    </div>
  );
}

export function ExperimentalList() {
  return <ExperimentalWall />;
}
