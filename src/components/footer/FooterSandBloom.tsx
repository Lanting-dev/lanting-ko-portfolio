"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function ease(value: number) {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
}

/** Slight overshoot so each flower pops as it opens. */
function easeBack(value: number) {
  const t = clamp(value);
  const s = 1.7;
  const x = t - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
}

/** Deterministic RNG so the field of flowers is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stitch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.18);
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y - size / 2);
  ctx.lineTo(x + size / 2, y + size / 2);
  ctx.moveTo(x + size / 2, y - size / 2);
  ctx.lineTo(x - size / 2, y + size / 2);
  ctx.stroke();
  ctx.restore();
}

type Pt = { x: number; y: number };

/** Stitch a poly-line up to `progress` (0→1). */
function stitchedPath(
  ctx: CanvasRenderingContext2D,
  points: Pt[],
  progress: number,
  cell: number,
  color: string,
  alpha = 1,
) {
  const segments = Math.max(1, points.length - 1);
  const visible = progress * segments;
  for (let i = 0; i < segments; i += 1) {
    const amount = clamp(visible - i);
    if (amount <= 0) break;
    const a = points[i]!;
    const b = points[i + 1]!;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    const count = Math.max(1, Math.ceil(length / cell));
    for (let step = 0; step <= count * amount; step += 1) {
      const t = step / count;
      stitch(ctx, a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, cell * 0.76, color, alpha);
    }
  }
}

type Flower = {
  x: number; // root x, fraction of width
  rootY: number; // root y, fraction of height (deep in the sand)
  stemLen: number; // fraction of height
  lean: number; // top horizontal drift, fraction of width
  bend: number; // stem bow, fraction of width
  size: number; // head diameter, fraction of width
  delay: number; // ms before this one starts opening
  swayPhase: number;
};

const BLOOM_MS = 2000; // one flower's open duration
const STEM_COLOR = "#5d6b58";

function buildFlowers(): Flower[] {
  const rnd = mulberry32(0x9e3779b1);
  const count = 7;
  const flowers: Flower[] = [];
  for (let i = 0; i < count; i += 1) {
    const slot = (i + 0.5) / count;
    const stemLen = 0.22 + rnd() * 0.13;
    flowers.push({
      x: clamp(slot + (rnd() - 0.5) * 0.07),
      rootY: 0.94 + (rnd() - 0.5) * 0.04, // start down inside the sand
      stemLen,
      lean: (rnd() - 0.5) * 0.1,
      bend: (rnd() - 0.5) * 0.05, // slight stem curve, kept close to straight
      size: 0.06 + rnd() * 0.045,
      delay: rnd() * 2400 + i * 90, // each opens at a different time
      swayPhase: rnd() * Math.PI * 2,
    });
  }
  return flowers;
}

export function FooterSandBloom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let timer = 0;
    let start = 0;
    let active = reducedMotion;
    // The sand is already settled; preserve the original flower timing.
    const BLOOM_DELAY_MS = 1000;
    const flowers = buildFlowers();
    const lastStart = flowers.reduce((m, f) => Math.max(m, f.delay), 0);

    // Sample the flower into a small grid so each head renders as cross-stitches
    // (same pattern as the sand) instead of a smooth image.
    const FG = 48;
    let flowerData: ImageData | null = null;
    const img = new Image();
    img.onload = () => {
      const oc = document.createElement("canvas");
      oc.width = FG;
      oc.height = FG;
      const octx = oc.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, FG, FG);
      try {
        flowerData = octx.getImageData(0, 0, FG, FG);
      } catch {
        flowerData = null;
      }
    };
    img.src = "/flower.png";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      const cell = Math.max(5, Math.min(8, width / 120));
      const elapsed = reducedMotion ? lastStart + BLOOM_MS : Math.max(0, now - start);

      for (const f of flowers) {
        const p = clamp((elapsed - f.delay) / BLOOM_MS);
        if (p <= 0) continue;
        const stemP = ease(p / 0.55);
        const headP = clamp((p - 0.62) / 0.38);

        const rootX = f.x * width;
        const rootY = f.rootY * height;
        const sway =
          p >= 1 && !reducedMotion ? Math.sin(now * 0.0011 + f.swayPhase) * 2.4 : 0;
        const topX = rootX + f.lean * width + sway;
        const topY = rootY - f.stemLen * height;

        // Curved stem: quadratic bezier bowed perpendicular to its direction.
        const dx = topX - rootX;
        const dy = topY - rootY;
        const len = Math.hypot(dx, dy) || 1;
        const bow = f.bend * width;
        const cpX = (rootX + topX) / 2 + (-dy / len) * bow;
        const cpY = (rootY + topY) / 2 + (dx / len) * bow;
        const bez = (t: number): Pt => {
          const mt = 1 - t;
          return {
            x: mt * mt * rootX + 2 * mt * t * cpX + t * t * topX,
            y: mt * mt * rootY + 2 * mt * t * cpY + t * t * topY,
          };
        };
        const stemPts: Pt[] = [];
        const SEG = 18;
        for (let i = 0; i <= SEG; i += 1) stemPts.push(bez(i / SEG));
        stitchedPath(ctx, stemPts, stemP, cell, STEM_COLOR);

        // Flower head as cross-stitches sampled from the flower image — same
        // pattern as the sand, just denser so it reads clearly.
        if (headP > 0 && flowerData) {
          const grow = easeBack(headP);
          const d = f.size * width * (0.6 + 0.4 * grow);
          const across = Math.max(12, Math.round(d / (cell * 0.8)));
          const step = d / across;
          const x0 = topX - d / 2;
          const y0 = topY - d / 2;
          const data = flowerData.data;
          const a = clamp(headP * 1.3);
          for (let gy = 0; gy < across; gy += 1) {
            for (let gx = 0; gx < across; gx += 1) {
              const sx = Math.min(FG - 1, Math.floor((gx / across) * FG));
              const sy = Math.min(FG - 1, Math.floor((gy / across) * FG));
              const idx = (sy * FG + sx) * 4;
              if (data[idx + 3]! < 70) continue; // transparent background
              const lum = (data[idx]! + data[idx + 1]! + data[idx + 2]!) / 3;
              const shade = Math.round(Math.min(205, lum * 0.8));
              stitch(
                ctx,
                x0 + (gx + 0.5) * step,
                y0 + (gy + 0.5) * step,
                step * 0.95,
                `rgb(${shade},${shade},${shade})`,
                a,
              );
            }
          }
        }
      }

      // Keep animating for the gentle post-bloom sway.
      if (active && !reducedMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry || reducedMotion) return;
        if (entry.isIntersecting) {
          // Re-arm and replay the bloom every time the footer scrolls into view.
          if (active) return;
          active = true;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (!active) return;
            start = performance.now();
            frame = requestAnimationFrame(draw);
          }, BLOOM_DELAY_MS);
        } else if (active) {
          active = false;
          window.clearTimeout(timer);
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0.25 },
    );
    intersectionObserver.observe(canvas);

    if (reducedMotion) {
      // Draw once flowers are fully open; retry until the image is ready.
      const tryDraw = () => {
        if (flowerData) draw(performance.now());
        else timer = window.setTimeout(tryDraw, 60);
      };
      tryDraw();
    }

    return () => {
      active = false;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div className="footer-sand-bloom-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="footer-sand-bloom" />
    </div>
  );
}
