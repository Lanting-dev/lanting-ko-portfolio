import { clamp } from "@/lib/parallax/interpolate";
import {
  getHeroParallaxValues,
  type HeroParallaxValues,
} from "@/lib/parallax/heroParallax";

/** Raw scroll progress for each pinned track. */
export type ParallaxRaw = {
  hero: number;
  project: number;
  about: number;
  footer: number;
};

export type ParallaxSnapshot = {
  heroProgress: number;
  projectProgress: number;
  aboutProgress: number;
  footerProgress: number;
  hero: HeroParallaxValues;
};

export function computeSnapshot(raw: ParallaxRaw): ParallaxSnapshot {
  const heroProgress = clamp(raw.hero, 0, 1);
  const projectProgress = clamp(raw.project, 0, 1);
  const aboutProgress = clamp(raw.about, 0, 1);
  const footerProgress = clamp(raw.footer, 0, 1);

  return {
    heroProgress,
    projectProgress,
    aboutProgress,
    footerProgress,
    hero: getHeroParallaxValues(heroProgress),
  };
}
