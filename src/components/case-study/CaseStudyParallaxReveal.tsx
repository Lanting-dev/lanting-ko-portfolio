"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { clamp } from "@/lib/parallax/interpolate";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CaseStudyParallaxRevealProps = {
  children: ReactNode;
  className?: string;
  /** Visible window width / height (matches reference crop). */
  viewportAspect: number;
};

type RevealFrameStyle = CSSProperties & {
  "--cs-reveal-aspect"?: number;
};

/**
 * Clips a tall image inside a fixed-aspect viewport and scrolls the image
 * vertically so content above and below the default view is revealed.
 */
export function CaseStudyParallaxReveal({
  children,
  className = "",
  viewportAspect,
}: CaseStudyParallaxRevealProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const update = useCallback(() => {
    const viewport = viewportRef.current;
    const layer = layerRef.current;
    if (!viewport || !layer) return;

    const img = layer.querySelector("img");
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const innerH = viewport.clientHeight;
    const imgH = img.getBoundingClientRect().height;
    const excess = Math.max(0, imgH - innerH);

    if (reducedMotion) {
      layer.style.transform = `translate3d(0, ${(-excess / 2).toFixed(1)}px, 0)`;
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
    const strength = excess;
    const offset = -excess / 2;
    const travel = (progress - 0.5) * strength;
    const y = -travel + offset;
    layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  }, [reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const layer = layerRef.current;
    if (!viewport || !layer) return;

    const img = layer.querySelector("img");
    let raf = 0;

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    if (img) {
      img.addEventListener("load", schedule);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const ro = new ResizeObserver(schedule);
    ro.observe(viewport);
    if (img) ro.observe(img);

    return () => {
      if (img) img.removeEventListener("load", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [update]);

  const frameStyle: RevealFrameStyle = {
    "--cs-reveal-aspect": viewportAspect,
  };

  return (
    <div
      className={`case-study-reveal-frame ${className}`.trim()}
      style={frameStyle}
    >
      <div
        ref={viewportRef}
        className="case-study-reveal-viewport"
        style={{ aspectRatio: viewportAspect }}
      >
        <div ref={layerRef} className="case-study-reveal-layer">
          {children}
        </div>
      </div>
    </div>
  );
}
