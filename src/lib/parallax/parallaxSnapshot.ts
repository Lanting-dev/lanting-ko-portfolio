import { clamp } from "@/lib/parallax/interpolate";
import {
  computeBallJourneyProgress,
  isBallJourneyActive,
} from "@/lib/animation/heroBallFall";
import {
  getHeroParallaxValues,
  type HeroParallaxValues,
} from "@/lib/parallax/heroParallax";
import { mapProjectHopProgress } from "@/lib/projects/projectScroll";

/** Raw scroll progress for each pinned track. */
export type ParallaxRaw = {
  hero: number;
  project: number;
  about: number;
  footer: number;
};

/** Mount/visibility gates. Flip a handful of times across a full scroll, so
 *  they (and only they) drive React re-renders. */
export type ParallaxGates = {
  /** Hero→work ball is mid-fall (detached from the "O", not yet faded at Work). */
  showFloatingOrb: boolean;
};

export type ParallaxSnapshot = {
  heroProgress: number;
  projectProgress: number;
  aboutProgress: number;
  footerProgress: number;
  hero: HeroParallaxValues;
  hopProgress: number;
  fallPhase: number;
  ballJourneyProgress: number;
  gates: ParallaxGates;
};

export const DEFAULT_GATES: ParallaxGates = {
  showFloatingOrb: false,
};

export function computeSnapshot(raw: ParallaxRaw): ParallaxSnapshot {
  const heroProgress = clamp(raw.hero, 0, 1);
  const projectProgress = clamp(raw.project, 0, 1);
  const aboutProgress = clamp(raw.about, 0, 1);
  const footerProgress = clamp(raw.footer, 0, 1);

  const hero = getHeroParallaxValues(heroProgress);
  const { fallPhase } = hero;
  const hopProgress = mapProjectHopProgress(projectProgress);
  const ballJourneyProgress = computeBallJourneyProgress(
    heroProgress,
    projectProgress,
  );

  return {
    heroProgress,
    projectProgress,
    aboutProgress,
    footerProgress,
    hero,
    hopProgress,
    fallPhase,
    ballJourneyProgress,
    gates: {
      showFloatingOrb: isBallJourneyActive(ballJourneyProgress),
    },
  };
}

export function gatesEqual(a: ParallaxGates, b: ParallaxGates): boolean {
  return a.showFloatingOrb === b.showFloatingOrb;
}
