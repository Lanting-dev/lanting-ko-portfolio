import { clamp } from "@/lib/parallax/interpolate";
import { VISIBLE_PROJECTS } from "@/lib/projects";
import {
  PROJECT_DETAIL_START,
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

export function getScatterCardLayout(
  index: number,
  scatterT: number,
  projectProgress: number,
): {
  left: string;
  top: string;
  opacity: number;
  transform: string;
  zIndex: number;
} {
  const target = SCATTER_TARGETS[index % SCATTER_TARGETS.length];
  const stack = SCATTER_STACK[index % SCATTER_STACK.length];
  const ease = smoothstep(scatterT);

  const x = SCATTER_CLUSTER.x + (target.x - SCATTER_CLUSTER.x) * ease;
  const y = SCATTER_CLUSTER.y + (target.y - SCATTER_CLUSTER.y) * ease;

  const stackX = stack.dx * (1 - ease);
  const stackY = stack.dy * (1 - ease);
  const driftY = ease > 0.92 ? (projectProgress - 0.5) * target.drift : 0;
  const scale = 0.84 + ease * 0.16;

  const enter = clamp(projectProgress / 0.08, 0, 1);

  return {
    left: `${x}%`,
    top: `${y}%`,
    opacity: 0.15 + enter * 0.85,
    transform: `translate(calc(-50% + ${stackX.toFixed(1)}px), calc(-50% + ${stackY.toFixed(1)}px)) translateY(${driftY.toFixed(1)}px) scale(${scale.toFixed(3)})`,
    zIndex: index + 1 + Math.round((1 - ease) * 4),
  };
}
