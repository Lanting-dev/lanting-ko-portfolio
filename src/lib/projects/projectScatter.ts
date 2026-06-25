import { clamp } from "@/lib/parallax/interpolate";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import {
  PROJECT_DETAIL_START,
  PROJECT_HOP_MORPH_FRACTION,
  PROJECT_SCATTER_END,
  PROJECT_SCATTER_START,
} from "@/lib/projects/projectScroll";

/** Centre-anchored scatter positions (% of sticky area). */
export type ScatterCenter = {
  x: number;
  y: number;
  drift: number;
};

export const SCATTER_CLUSTER = { x: 50, y: 56 } as const;

export const SCATTER_TARGETS: ScatterCenter[] = [
  { x: 11, y: 22, drift: -54 },
  { x: 89, y: 20, drift: 62 },
  { x: 13, y: 64, drift: 50 },
  { x: 87, y: 66, drift: -58 },
  { x: 50, y: 78, drift: 36 },
];

/** Stack offsets while cards sit in the centre (px). */
export const SCATTER_STACK = [
  { dx: -22, dy: -30 },
  { dx: 18, dy: -20 },
  { dx: -16, dy: 18 },
  { dx: 20, dy: 26 },
  { dx: 0, dy: 34 },
] as const;

function smoothstep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/** 0 = clustered in centre, 1 = at corner targets. Driven by Work scroll. */
export function computeScatterProgress(projectProgress: number): number {
  return smoothstep(
    clamp(
      (projectProgress - PROJECT_SCATTER_START) /
        (PROJECT_SCATTER_END - PROJECT_SCATTER_START),
      0,
      1,
    ),
  );
}

export function getProjectFocusIndex(projectProgress: number): number {
  const count = VISIBLE_PROJECTS.length;
  if (projectProgress < PROJECT_DETAIL_START || count === 0) return -1;

  const seg = (1 - PROJECT_DETAIL_START) / count;
  return clamp(
    Math.floor((projectProgress - PROJECT_DETAIL_START) / seg),
    0,
    count - 1,
  );
}

/** Sticky focus with segment hysteresis so scroll jitter does not flip cards. */
export function getProjectFocusIndexStable(
  projectProgress: number,
  prevIndex: number,
): number {
  const count = VISIBLE_PROJECTS.length;
  if (projectProgress < PROJECT_DETAIL_START || count === 0) return -1;

  const seg = (1 - PROJECT_DETAIL_START) / count;
  const raw = (projectProgress - PROJECT_DETAIL_START) / seg;
  const hysteresis = 0.1;

  if (prevIndex < 0) {
    return clamp(Math.floor(raw), 0, count - 1);
  }

  let index = prevIndex;
  if (raw > prevIndex + 1 - hysteresis && prevIndex < count - 1) {
    index = prevIndex + 1;
  } else if (raw < prevIndex + hysteresis && prevIndex > 0) {
    index = prevIndex - 1;
  }

  return index;
}

/** Detail hero slot — left of centre, aligned with `.project-detail-media`. */
const DETAIL_HERO_TARGET = {
  leftPct: 33,
  topPct: 50,
  stackX: 0,
  stackY: 0,
  driftY: 0,
  scale: 1.36,
} as const;

const DETAIL_HERO_TARGET_MOBILE = {
  leftPct: 50,
  topPct: 44,
  stackX: 0,
  stackY: 0,
  driftY: 0,
  scale: 1.05,
} as const;

export type ScatterCardLayout = {
  left: string;
  top: string;
  opacity: number;
  transform: string;
  zIndex: number;
};

type ScatterLayoutNumeric = {
  leftPct: number;
  topPct: number;
  stackX: number;
  stackY: number;
  driftY: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

function layoutNumericToStyle(layout: ScatterLayoutNumeric): ScatterCardLayout {
  return {
    left: `${layout.leftPct}%`,
    top: `${layout.topPct}%`,
    opacity: layout.opacity,
    transform: `translate(calc(-50% + ${layout.stackX.toFixed(1)}px), calc(-50% + ${layout.stackY.toFixed(1)}px)) translateY(${layout.driftY.toFixed(1)}px) scale(${layout.scale.toFixed(3)})`,
    zIndex: layout.zIndex,
  };
}

function lerpScatterLayout(
  start: ScatterLayoutNumeric,
  end: ScatterLayoutNumeric,
  t: number,
): ScatterLayoutNumeric {
  return {
    leftPct: start.leftPct + (end.leftPct - start.leftPct) * t,
    topPct: start.topPct + (end.topPct - start.topPct) * t,
    stackX: start.stackX + (end.stackX - start.stackX) * t,
    stackY: start.stackY + (end.stackY - start.stackY) * t,
    driftY: start.driftY * (1 - t) + end.driftY * t,
    scale: start.scale + (end.scale - start.scale) * t,
    opacity: start.opacity + (end.opacity - start.opacity) * t,
    zIndex: Math.max(start.zIndex, 30),
  };
}

function getScatterCardLayoutNumeric(
  index: number,
  scatterT: number,
  projectProgress: number,
): ScatterLayoutNumeric {
  const target = SCATTER_TARGETS[index % SCATTER_TARGETS.length];
  const stack = SCATTER_STACK[index % SCATTER_STACK.length];
  const ease = smoothstep(scatterT);

  const leftPct = SCATTER_CLUSTER.x + (target.x - SCATTER_CLUSTER.x) * ease;
  const topPct = SCATTER_CLUSTER.y + (target.y - SCATTER_CLUSTER.y) * ease;
  const stackX = stack.dx * (1 - ease);
  const stackY = stack.dy * (1 - ease);
  const driftY = ease > 0.92 ? (projectProgress - 0.5) * target.drift : 0;
  const scale = 0.84 + ease * 0.16;
  const enter = clamp(projectProgress / 0.08, 0, 1);

  return {
    leftPct,
    topPct,
    stackX,
    stackY,
    driftY,
    scale,
    opacity: 0.15 + enter * 0.85,
    zIndex: index + 1 + Math.round((1 - ease) * 4),
  };
}

/** 0→1 at the start of each detail segment — drives scatter → hero morph. */
export function getHopMorphT(
  projectProgress: number,
  focusIndex: number,
): number {
  if (focusIndex < 0) return 0;

  const count = VISIBLE_PROJECTS.length;
  const seg = (1 - PROJECT_DETAIL_START) / count;
  const segStart = PROJECT_DETAIL_START + focusIndex * seg;
  const local = clamp((projectProgress - segStart) / seg, 0, 1);

  return smoothstep(clamp(local / PROJECT_HOP_MORPH_FRACTION, 0, 1));
}

export function isHopMorphComplete(
  projectProgress: number,
  focusIndex: number,
): boolean {
  return getHopMorphT(projectProgress, focusIndex) >= 1;
}

export function getScatterCardLayout(
  index: number,
  scatterT: number,
  projectProgress: number,
): ScatterCardLayout {
  return layoutNumericToStyle(
    getScatterCardLayoutNumeric(index, scatterT, projectProgress),
  );
}

/** Focused card morph from scatter corner toward the detail hero slot. */
export function getFocusedMorphLayout(
  index: number,
  scatterT: number,
  projectProgress: number,
  focusIndex: number,
  morphT: number,
  mobile = false,
): ScatterCardLayout | null {
  if (focusIndex < 0 || index !== focusIndex || morphT <= 0) return null;

  const start = getScatterCardLayoutNumeric(index, scatterT, projectProgress);
  const endTarget = mobile ? DETAIL_HERO_TARGET_MOBILE : DETAIL_HERO_TARGET;
  const end: ScatterLayoutNumeric = {
    ...endTarget,
    opacity: 1,
    zIndex: 30,
  };

  return layoutNumericToStyle(lerpScatterLayout(start, end, morphT));
}
