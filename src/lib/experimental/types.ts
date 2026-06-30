export type ExperimentalSlug =
  | "suma"
  | "resonant"
  | "travel-pal"
  | "boojie"
  | "doorbear";

export type ExperimentalMedia =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | {
      type: "video";
      src: string;
      alt: string;
      poster?: string;
      width?: number;
      height?: number;
    };

export type ExperimentalItem = {
  slug: ExperimentalSlug;
  title: string;
  tag: string;
  year: string;
  heroSrc: string;
  heroType: "image" | "video";
  posterSrc?: string;
  accent: string;
};

export type ExperimentalSlide = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ExperimentalShowcase = {
  slug: ExperimentalSlug;
  title: string;
  tag: string;
  year: string;
  lede: string;
  summary?: readonly {
    label: string;
    text: string;
  }[];
  role?: readonly string[];
  stack?: readonly string[];
  with?: string;
  /** Deck slides shown in a sticky, horizontally-scrolling section. */
  slides?: readonly ExperimentalSlide[];
  blocks: readonly ExperimentalMedia[];
};
