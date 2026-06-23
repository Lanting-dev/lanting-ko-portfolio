import { clamp } from "@/lib/dither/bayer";

import { isAboutRicochetScrollActive } from "@/lib/projects/projectScroll";

/** Ball drop → profile ricochet → right wall → cube spin */
export const ABOUT_SCROLL_VH = 380;

/** @deprecated Entry fall is driven by project exit scroll; kept for scene fallbacks. */
export const ABOUT_DROP_END = 0.26;
/** Scroll progress: ball hits right wall after ricochet */
export const ABOUT_RICOCHET_END = 0.4;
/** Scroll progress: cube finishes isometric spin */
export const ABOUT_SPIN_END_PROGRESS = 0.76;

/** About rider handoff — after entry fall impacts profile (mirrors Hero→Project settle). */
export const ABOUT_BALL_HANDOFF = ABOUT_DROP_END;

/** @deprecated use ABOUT_BALL_HANDOFF */
export const ABOUT_BALL_START = ABOUT_BALL_HANDOFF;

export type AboutSceneValues = {
  ballDrop: number;
  ballRicochet: number;
  cubeSpin: number;
  wobble: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  cubeScale: number;
  hasImpacted: boolean;
  hasWallHit: boolean;
  impactPulse: number;
};

function easeOutCubic(t: number): number {
  const x = clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Scroll-driven tumble: accelerates through `turns` revolutions then coasts to 0 by t=1. */
function tumbleRevolutions(t: number, turns: number, spinEnd = 0.5): number {
  const x = clamp(t, 0, 1);
  const accel = 1 - Math.pow(1 - clamp(x / spinEnd, 0, 1), 2.65);
  const fadeStart = spinEnd * 0.66;
  const fade = Math.pow(
    1 - clamp((x - fadeStart) / Math.max(1 - fadeStart, 0.001), 0, 1),
    2.35,
  );
  return turns * 360 * accel * fade;
}

const ISO_X = -52;
const ISO_Y = -22;
const ISO_Z = -10;

/** Ball impact → multi-turn tumble → settle into isometric pose. */
function computeCubeImpactRotation(
  cubeSpinRaw: number,
  ballRicochet: number,
  hasImpacted: boolean,
): Pick<
  AboutSceneValues,
  "rotateX" | "rotateY" | "rotateZ" | "cubeScale" | "wobble" | "impactPulse"
> {
  if (!hasImpacted || cubeSpinRaw <= 0) {
    return {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      cubeScale: 0.992,
      wobble: 0,
      impactPulse: 0,
    };
  }

  const t = cubeSpinRaw;

  // Main yaw from glancing hit; backward pitch + roll wobble for a knocked-over feel.
  const tumbleY = tumbleRevolutions(t, 3.75, 0.46);
  const tumbleX = tumbleRevolutions(t, 1.35, 0.5);
  const tumbleZ = tumbleRevolutions(t, 0.95, 0.54);

  const hitWindow = ballRicochet < 0.14;
  const hitPhase = hitWindow ? ballRicochet / 0.14 : 0;
  const hitKick = hitWindow ? Math.sin(hitPhase * Math.PI) : 0;
  const hitSnap = hitKick * 34 * (1 - t * 0.35);
  const wobble = hitWindow
    ? Math.sin(hitPhase * Math.PI * 3.2) * 11 * (1 - hitPhase * 0.55)
    : Math.sin(t * Math.PI * 5.5) * 2.2 * Math.pow(1 - t, 2.4);

  const settle = easeOutCubic(clamp((t - 0.36) / 0.64, 0, 1));
  const impactPulse = hitKick * (1 - clamp(ballRicochet / 0.1, 0, 1));

  return {
    rotateX: lerp(tumbleX + hitSnap, ISO_X, settle),
    rotateY: lerp(tumbleY, ISO_Y, settle),
    rotateZ: lerp(tumbleZ + wobble * 0.45, ISO_Z, settle),
    cubeScale: lerp(0.992, 1, settle) + impactPulse * 0.034,
    wobble,
    impactPulse,
  };
}

export function getAboutSceneValues(
  progress: number,
  profileImpactComplete = false,
): AboutSceneValues {
  const p = clamp(progress, 0, 1);

  // Option A: the ball already landed on the cube during the project exit, so the
  // moment the about scroll starts the ball bounces off and the cube spins.
  void profileImpactComplete;
  const ballDrop = 1;
  const hasImpacted = true;

  const ballRicochet = clamp(p / ABOUT_RICOCHET_END, 0, 1);
  const hasWallHit = ballRicochet >= 1;

  const cubeSpinRaw = clamp(p / ABOUT_SPIN_END_PROGRESS, 0, 1);

  const cubeSpin = cubeSpinRaw;

  const impactRotation = computeCubeImpactRotation(
    cubeSpinRaw,
    ballRicochet,
    hasImpacted,
  );

  return {
    ballDrop,
    ballRicochet,
    cubeSpin,
    wobble: impactRotation.wobble,
    hasImpacted,
    hasWallHit,
    impactPulse: impactRotation.impactPulse,
    rotateX: impactRotation.rotateX,
    rotateY: impactRotation.rotateY,
    rotateZ: impactRotation.rotateZ,
    cubeScale: impactRotation.cubeScale,
  };
}

/** @deprecated use isProjectExitFallActive from projectScroll */
export function isAboutEntryFallActive(aboutProgress: number): boolean {
  return aboutProgress > 0 && aboutProgress < ABOUT_DROP_END;
}

/** About rider takes over when about scroll starts after profile impact. */
export function isAboutBallRiderActive(
  profileImpactComplete: boolean,
  aboutProgress: number,
): boolean {
  return profileImpactComplete && isAboutRicochetScrollActive(aboutProgress);
}

export function shouldHideProjectBallRider(profileImpactComplete: boolean): boolean {
  return profileImpactComplete;
}

export function shouldShowProjectBallRider(
  ballRiderActive: boolean,
  profileImpactComplete: boolean,
): boolean {
  return ballRiderActive && !profileImpactComplete;
}
