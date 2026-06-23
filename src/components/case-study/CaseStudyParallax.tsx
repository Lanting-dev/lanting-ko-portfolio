"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CaseStudyParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Total distance travelled while the scene crosses the viewport. */
  strength?: number;
  /** Resting position bias. Positive values place the layer lower. */
  offset?: number;
  variant?: "image" | "phones";
};

type ParallaxStyle = CSSProperties & {
  "--cs-parallax-progress": number;
  "--cs-parallax-y": string;
  "--cs-parallax-y-mid": string;
  "--cs-parallax-y-back": string;
};

/**
 * A reversible, scroll-scrubbed parallax scene. Progress is derived from the
 * scene's actual viewport position: 0 as it enters, 1 as it leaves.
 */
export function CaseStudyParallax({
  children,
  className = "",
  strength = 96,
  offset: restingOffset = 0,
  variant = "image",
}: CaseStudyParallaxProps) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = ref.current;
    if (!scene || reducedMotion) return;

    let frame = 0;

    const render = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + rect.height)),
      );
      scene.style.setProperty("--cs-parallax-progress", progress.toFixed(4));
      const travel = (progress - 0.5) * strength;
      scene.style.setProperty(
        "--cs-parallax-y",
        `${(-travel + restingOffset).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--cs-parallax-y-mid",
        `${(travel * 0.72 + restingOffset).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--cs-parallax-y-back",
        `${(-travel * 0.42 + restingOffset).toFixed(2)}px`,
      );
    };

    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, restingOffset, strength]);

  const style: ParallaxStyle = {
    "--cs-parallax-progress": 0.5,
    "--cs-parallax-y": `${restingOffset}px`,
    "--cs-parallax-y-mid": `${restingOffset}px`,
    "--cs-parallax-y-back": `${restingOffset}px`,
  };

  return (
    <div
      ref={ref}
      className={`cs-parallax cs-parallax--${variant} ${className}`.trim()}
      style={style}
    >
      <div className="cs-parallax-layer">{children}</div>
    </div>
  );
}
