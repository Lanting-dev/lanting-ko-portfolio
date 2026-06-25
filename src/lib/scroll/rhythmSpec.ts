import { ABOUT_RICOCHET_END, ABOUT_SCROLL_VH, ABOUT_SPIN_END_PROGRESS } from "@/lib/about/aboutScroll";
import { FOOTER_SCROLL_VH } from "@/lib/footer/footerScroll";
import { PARALLAX_PHASE } from "@/lib/parallax/heroParallax";
import type { ParallaxSnapshot } from "@/lib/parallax/parallaxSnapshot";
import {
  PROJECT_DETAIL_START,
  PROJECT_EXIT_SCROLL_FRACTION,
  PROJECT_SCATTER_END,
  PROJECT_SCATTER_START,
  PROJECT_SCROLL_VH,
} from "@/lib/projects/projectScroll";
import { VISIBLE_PROJECTS } from "@/lib/projects";

/** Hero pin track — title morph and bio reveal before Work. */
export const HERO_SCROLL_VH = 300;

export const SCROLL_TRACKS = {
  hero: HERO_SCROLL_VH,
  project: PROJECT_SCROLL_VH,
  about: ABOUT_SCROLL_VH,
  footer: FOOTER_SCROLL_VH,
} as const;

export type ScrollSection = keyof typeof SCROLL_TRACKS;

/** Mobile pin track height multipliers (narrow viewport). */
export const MOBILE_TRACK_MULTIPLIER: Record<ScrollSection, number> = {
  hero: 0.85,
  project: 0.7,
  about: 0.8,
  footer: 1.25,
};

export function trackVhForViewport(
  section: ScrollSection,
  mobile: boolean,
): number {
  const base = SCROLL_TRACKS[section];
  if (!mobile) return base;
  return Math.round(base * MOBILE_TRACK_MULTIPLIER[section]);
}

export function mobileScrollableVh(): number {
  return (Object.keys(SCROLL_TRACKS) as ScrollSection[]).reduce(
    (sum, section) =>
      sum + scrollableVh(trackVhForViewport(section, true)),
    0,
  );
}

export type ScrollPhase =
  | { section: "hero"; phase: "bio_reveal" | "hold" | "morph" | "ball_fall" }
  | {
      section: "project";
      phase: "enter" | "scatter" | "hold" | "detail" | "exit";
      cardIndex?: number;
    }
  | { section: "about"; phase: "ricochet" | "cube_spin" | "settle" }
  | { section: "footer"; phase: "sand_assemble" | "sand_drift" | "done" };

export type RhythmFlag = {
  type: "dead_zone" | "rush" | "disconnect";
  section: ScrollSection;
  range: [number, number];
  vhApprox: number;
  severity: "low" | "medium" | "high";
  message: string;
};

/** Scrollable distance inside a pin track (track height minus one viewport). */
export function scrollableVh(trackVh: number): number {
  return Math.max(0, trackVh - 100);
}

/** Approximate vh consumed by a progress span within a section track. */
export function progressSpanVh(
  section: ScrollSection,
  start: number,
  end: number,
): number {
  return scrollableVh(SCROLL_TRACKS[section]) * Math.max(0, end - start);
}

export function getActiveSection(snapshot: ParallaxSnapshot): ScrollSection {
  if (snapshot.footerProgress > 0 && snapshot.footerProgress < 1) return "footer";
  if (snapshot.aboutProgress > 0 && snapshot.aboutProgress < 1) return "about";
  if (snapshot.projectProgress > 0 && snapshot.projectProgress < 1) return "project";
  if (snapshot.heroProgress < 1) return "hero";
  if (snapshot.footerProgress < 1) return "footer";
  return "footer";
}

export function getScrollPhase(snapshot: ParallaxSnapshot): ScrollPhase {
  const { heroProgress, projectProgress, aboutProgress, footerProgress } =
    snapshot;

  if (heroProgress < 1 && projectProgress <= 0) {
    if (heroProgress < PARALLAX_PHASE.riseEnd) {
      return { section: "hero", phase: "bio_reveal" };
    }
    if (heroProgress < PARALLAX_PHASE.morphEnd) {
      return heroProgress < PARALLAX_PHASE.fallEnd
        ? { section: "hero", phase: "hold" }
        : { section: "hero", phase: "morph" };
    }
    return { section: "hero", phase: "ball_fall" };
  }

  if (projectProgress > 0 && projectProgress < 1) {
    if (projectProgress < PROJECT_SCATTER_START) {
      return { section: "project", phase: "enter" };
    }
    if (projectProgress < PROJECT_SCATTER_END) {
      return { section: "project", phase: "scatter" };
    }
    if (projectProgress < PROJECT_DETAIL_START) {
      return { section: "project", phase: "hold" };
    }

    const exitStart = 1 - PROJECT_EXIT_SCROLL_FRACTION;
    if (projectProgress >= exitStart) {
      return { section: "project", phase: "exit" };
    }

    const count = VISIBLE_PROJECTS.length;
    const seg = count > 0 ? (exitStart - PROJECT_DETAIL_START) / count : 1;
    const cardIndex = Math.min(
      count - 1,
      Math.max(0, Math.floor((projectProgress - PROJECT_DETAIL_START) / seg)),
    );
    return { section: "project", phase: "detail", cardIndex };
  }

  if (aboutProgress > 0 && aboutProgress < 1) {
    if (aboutProgress < ABOUT_RICOCHET_END) {
      return { section: "about", phase: "ricochet" };
    }
    if (aboutProgress < ABOUT_SPIN_END_PROGRESS) {
      return { section: "about", phase: "cube_spin" };
    }
    return { section: "about", phase: "settle" };
  }

  if (footerProgress < 1) {
    if (footerProgress < 0.18) {
      return { section: "footer", phase: "sand_assemble" };
    }
    if (footerProgress < 0.88) {
      return { section: "footer", phase: "sand_drift" };
    }
    return { section: "footer", phase: "done" };
  }

  return { section: "footer", phase: "done" };
}

export function formatScrollPhase(phase: ScrollPhase): string {
  const section = phase.section === "project" ? "work" : phase.section;
  if (phase.section === "project" && phase.phase === "detail") {
    return `${section}.detail[${phase.cardIndex ?? 0}]`;
  }
  return `${section}.${phase.phase}`;
}

export const RHYTHM_MILESTONES = [
  { id: "hero.ball_detach", section: "hero" as const, at: PARALLAX_PHASE.morphEnd },
  { id: "work.scatter_start", section: "project" as const, at: PROJECT_SCATTER_START },
  { id: "work.scatter_done", section: "project" as const, at: PROJECT_SCATTER_END },
  { id: "work.detail_start", section: "project" as const, at: PROJECT_DETAIL_START },
  {
    id: "work.exit_start",
    section: "project" as const,
    at: 1 - PROJECT_EXIT_SCROLL_FRACTION,
  },
  { id: "about.ricochet_done", section: "about" as const, at: ABOUT_RICOCHET_END },
  { id: "about.cube_done", section: "about" as const, at: ABOUT_SPIN_END_PROGRESS },
  { id: "footer.sand_done", section: "footer" as const, at: 0.18 },
] as const;

export function diagnoseRhythm(): RhythmFlag[] {
  const flags: RhythmFlag[] = [];

  const holdVh = progressSpanVh(
    "project",
    PROJECT_SCATTER_END,
    PROJECT_DETAIL_START,
  );
  if (holdVh > 45) {
    flags.push({
      type: "dead_zone",
      section: "project",
      range: [PROJECT_SCATTER_END, PROJECT_DETAIL_START],
      vhApprox: holdVh,
      severity: holdVh > 60 ? "high" : "medium",
      message: `Work hold gap ${(PROJECT_SCATTER_END * 100).toFixed(0)}–${(PROJECT_DETAIL_START * 100).toFixed(0)}% (~${holdVh.toFixed(0)}vh)`,
    });
  }

  const heroHoldVh = progressSpanVh("hero", PARALLAX_PHASE.riseEnd, PARALLAX_PHASE.fallEnd);
  if (heroHoldVh > 55) {
    flags.push({
      type: "dead_zone",
      section: "hero",
      range: [PARALLAX_PHASE.riseEnd, PARALLAX_PHASE.fallEnd],
      vhApprox: heroHoldVh,
      severity: "medium",
      message: `Hero title hold ~${heroHoldVh.toFixed(0)}vh before morph`,
    });
  }

  const projectShare =
    scrollableVh(PROJECT_SCROLL_VH) /
    Object.values(SCROLL_TRACKS).reduce((sum, vh) => sum + scrollableVh(vh), 0);
  if (projectShare > 0.55) {
    flags.push({
      type: "rush",
      section: "project",
      range: [0, 1],
      vhApprox: scrollableVh(PROJECT_SCROLL_VH),
      severity: projectShare > 0.6 ? "high" : "medium",
      message: `Work is ${(projectShare * 100).toFixed(0)}% of total scroll journey`,
    });
  }

  return flags;
}

/** No high/medium rhythm flags — loop may auto-stop. */
export function isRhythmConverged(): boolean {
  return !diagnoseRhythm().some(
    (f) => f.severity === "high" || f.severity === "medium",
  );
}
