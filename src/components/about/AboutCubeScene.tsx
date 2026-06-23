"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const AboutCubeCanvas = dynamic(() => import("./AboutCubeCanvas"), {
  ssr: false,
});

type AboutCubeSceneProps = {
  profileBallSlotRef: RefObject<HTMLDivElement | null>;
  aboutProgress: number;
  profileImpactComplete?: boolean;
};

export function AboutCubeScene({
  profileBallSlotRef,
  aboutProgress,
  profileImpactComplete = false,
}: AboutCubeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setDimensions({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || shouldMountCanvas) return;

    if (!("IntersectionObserver" in window)) {
      setShouldMountCanvas(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldMountCanvas(true);
        observer.disconnect();
      },
      { rootMargin: "1200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldMountCanvas]);

  const handleAnchorMove = useCallback(
    (x: number, y: number) => {
      const slot = profileBallSlotRef.current;
      if (!slot) return;
      // `.about-cube-scene` has a `filter`, which makes this position:fixed slot
      // resolve against the scene box (not the viewport). The projector already
      // reports scene-local coords, so apply them directly.
      slot.style.left = `${x}px`;
      slot.style.top = `${y}px`;
    },
    [profileBallSlotRef],
  );

  return (
    <div ref={containerRef} className="about-cube-scene">
      {shouldMountCanvas && dimensions.width > 0 && dimensions.height > 0 ? (
        <AboutCubeCanvas
          width={dimensions.width}
          height={dimensions.height}
          aboutProgress={aboutProgress}
          profileImpactComplete={profileImpactComplete}
          onAnchorMove={handleAnchorMove}
        />
      ) : null}

      <div
        ref={profileBallSlotRef}
        className="about-profile-ball-slot project-ball-anchor pointer-events-none fixed z-[2] h-px w-px opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
