"use client";

import { useMemo } from "react";
import { clamp } from "@/lib/dither/bayer";
import {
  CROSS_STITCH_CELL_CARD,
  CROSS_STITCH_THREAD_CARD,
} from "@/lib/dither/constants";
import type { TrailPoint } from "@/lib/animation/heroBallFall";

type BallPathTrailProps = {
  points: TrailPoint[];
  className?: string;
  maxOpacity?: number;
};

const PIXEL = 2;
const SPACING = 11;
const THREAD = "128, 128, 128";

function distanceToSegment(
  px: number,
  py: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): number {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - x0, py - y0);
  const t = clamp(((px - x0) * dx + (py - y0) * dy) / len2, 0, 1);
  return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
}

const X_OFFSETS: Array<[number, number]> = (() => {
  const size = Math.max(3, CROSS_STITCH_CELL_CARD);
  const half = CROSS_STITCH_THREAD_CARD * 0.5;
  const x0 = 0;
  const y0 = 0;
  const x1 = size - 1;
  const y1 = size - 1;
  const center = (size - 1) / 2;
  const out: Array<[number, number]> = [];

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      const cx = px + 0.5;
      const cy = py + 0.5;
      const onThread =
        distanceToSegment(cx, cy, x0, y0, x1, y1) <= half ||
        distanceToSegment(cx, cy, x1, y0, x0, y1) <= half;
      if (onThread) out.push([px - center, py - center]);
    }
  }
  return out;
})();

type Cross = { x: number; y: number; f: number };

function buildStitches(points: TrailPoint[]): Cross[] {
  if (points.length < 2) return [];

  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
  }
  if (total < SPACING) return [];

  const out: Cross[] = [];
  let dist = 0;
  let next = SPACING * 0.5;

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    while (seg > 0 && dist + seg >= next) {
      const tt = (next - dist) / seg;
      out.push({
        x: a.x + (b.x - a.x) * tt,
        y: a.y + (b.y - a.y) * tt,
        f: next / total,
      });
      next += SPACING;
    }
    dist += seg;
  }
  return out;
}

export function BallPathTrail({
  points,
  className = "z-[35]",
  maxOpacity = 0.2,
}: BallPathTrailProps) {
  const stitches = useMemo(() => buildStitches(points), [points]);

  if (stitches.length === 0) return null;

  return (
    <svg
      className={`pointer-events-none fixed inset-0 h-full w-full ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {stitches.map((c, i) => {
        const op = clamp(maxOpacity * (0.6 + 1.6 * c.f), 0, 0.7);
        const fill = `rgba(${THREAD}, ${op.toFixed(3)})`;
        return (
          <g key={i} fill={fill}>
            {X_OFFSETS.map(([dx, dy], j) => (
              <rect
                key={j}
                x={c.x + dx * PIXEL - PIXEL / 2}
                y={c.y + dy * PIXEL - PIXEL / 2}
                width={PIXEL}
                height={PIXEL}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
