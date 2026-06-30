import { getMediaSize } from "./dimensions";
import { EXPERIMENTAL_SHOWCASES, EXPERIMENTAL_SLUGS } from "./showcases";
import type { ExperimentalItem, ExperimentalSlug } from "./types";

const base = "/experimental";

const PREVIEW_STILL: Record<ExperimentalSlug, string> = {
  suma: `${base}/suma/hero.png`,
  resonant: `${base}/resonant/hero.png`,
  "travel-pal": `${base}/travel-pal/hero.png`,
  boojie: `${base}/boojie/01.jpg`,
  doorbear: `${base}/doorbear/hero.jpg`,
};

const ACCENTS: Record<ExperimentalSlug, string> = {
  suma: "#8B7EC8",
  resonant: "#E85D4C",
  "travel-pal": "#25C4AD",
  boojie: "#F85525",
  doorbear: "#FAA968",
};

export const EXPERIMENTAL_PROJECTS: ExperimentalItem[] = EXPERIMENTAL_SLUGS.map(
  (slug) => {
    const s = EXPERIMENTAL_SHOWCASES[slug];
    const heroBlock = s.blocks[0];
    const isVideo = heroBlock?.type === "video";
    return {
      slug,
      title: s.title,
      tag: s.tag,
      year: s.year,
      heroSrc: isVideo ? heroBlock.src : PREVIEW_STILL[slug],
      heroType: isVideo ? "video" : "image",
      posterSrc: isVideo ? PREVIEW_STILL[slug] : undefined,
      accent: ACCENTS[slug],
    };
  },
);

export function getExperimentalPreviewSrc(slug: ExperimentalSlug): string {
  const project = EXPERIMENTAL_PROJECTS.find((p) => p.slug === slug);
  return project?.posterSrc ?? project?.heroSrc ?? PREVIEW_STILL[slug];
}

export type ExperimentalPreviewMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  width?: number;
  height?: number;
};

export function getExperimentalPreviewMedia(
  slug: ExperimentalSlug,
): ExperimentalPreviewMedia {
  const project = EXPERIMENTAL_PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    const still = PREVIEW_STILL[slug];
    return { type: "image", src: still, ...getMediaSize(still) };
  }
  if (project.heroType === "video") {
    return {
      type: "video",
      src: project.heroSrc,
      poster: project.posterSrc,
      // Video has no measurable size here; reserve space from the poster still.
      ...(project.posterSrc ? getMediaSize(project.posterSrc) : undefined),
    };
  }
  return { type: "image", src: project.heroSrc, ...getMediaSize(project.heroSrc) };
}
