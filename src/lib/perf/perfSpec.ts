import { VISIBLE_PROJECTS } from "@/lib/projects";
import {
  mobileScrollableVh,
  SCROLL_TRACKS,
  scrollableVh,
} from "@/lib/scroll/rhythmSpec";

/** Scatter backdrop cards mount WebGL cubes on mobile (perf killer). */
export const SCATTER_BACKDROP_WEBGL_ON_MOBILE = false;

/** `dither/constants.ts` applies mobile caps beyond Safari-only paths. */
export const MOBILE_DITHER_CAP_ENABLED = true;

/** About profile cube runs `frameloop="always"` while pinned. */
export const ABOUT_CUBE_ALWAYS_LOOP = false;

export const PERF_BUDGET = {
  maxWebGLContextsMobile: 1,
  maxMobileScrollableVh: 900,
} as const;

export type PerfFlag = {
  id: string;
  severity: "high" | "medium" | "low";
  message: string;
  webglCount?: number;
  mobileScrollableVh?: number;
};

const SEVERITY_RANK = { high: 0, medium: 1, low: 2 } as const;

/** Total scrollable vh across pinned homepage tracks on mobile. */
export function estimatedMobileScrollableVh(): number {
  return mobileScrollableVh();
}

/**
 * Worst-case simultaneous WebGL contexts on mobile during homepage scroll.
 * Scatter phase dominates when backdrop cubes are mounted.
 */
export function estimateMobileWebglCount(): number {
  let count = 0;

  if (SCATTER_BACKDROP_WEBGL_ON_MOBILE) {
    count += VISIBLE_PROJECTS.length;
  }

  if (ABOUT_CUBE_ALWAYS_LOOP) {
    count += 1;
  }

  return count;
}

export function diagnosePerf(): PerfFlag[] {
  const flags: PerfFlag[] = [];
  const mobileVh = estimatedMobileScrollableVh();
  const webgl = estimateMobileWebglCount();

  if (SCATTER_BACKDROP_WEBGL_ON_MOBILE) {
    flags.push({
      id: "scatter.multi_webgl",
      severity: "high",
      webglCount: VISIBLE_PROJECTS.length,
      mobileScrollableVh: mobileVh,
      message: `Work scatter mounts ${VISIBLE_PROJECTS.length} WebGL cubes on mobile`,
    });
  }

  if (!MOBILE_DITHER_CAP_ENABLED) {
    flags.push({
      id: "dither.no_mobile_cap",
      severity: "high",
      webglCount: webgl,
      mobileScrollableVh: mobileVh,
      message: "Canvas dither caps are Safari-only; Chrome Android runs full res",
    });
  }

  if (mobileVh > PERF_BUDGET.maxMobileScrollableVh) {
    flags.push({
      id: "scroll.mobile_vh_high",
      severity: "medium",
      webglCount: webgl,
      mobileScrollableVh: mobileVh,
      message: `Mobile scroll journey ~${Math.round(mobileVh)}vh (budget ${PERF_BUDGET.maxMobileScrollableVh}vh)`,
    });
  }

  if (ABOUT_CUBE_ALWAYS_LOOP) {
    flags.push({
      id: "webgl.about_always_loop",
      severity: "medium",
      webglCount: webgl,
      mobileScrollableVh: mobileVh,
      message: "About cube WebGL runs continuous frameloop while pinned",
    });
  }

  return flags.sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  );
}

/** No high/medium perf flags , loop may auto-stop. */
export function isPerfConverged(): boolean {
  return !diagnosePerf().some(
    (f) => f.severity === "high" || f.severity === "medium",
  );
}
