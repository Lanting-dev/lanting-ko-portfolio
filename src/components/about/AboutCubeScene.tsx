"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, useState } from "react";

const AboutCubeCanvas = dynamic(() => import("./AboutCubeCanvas"), {
  ssr: false,
});

type AboutCubeSceneProps = {
  aboutProgress: number;
};

export function AboutCubeScene({ aboutProgress }: AboutCubeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false);
  // Once mounted the canvas is never unmounted; gate its render loop on actual
  // visibility so it stops driving the GPU while scrolled into hero/footer.
  const [inView, setInView] = useState(false);

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

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="about-cube-scene">
      {shouldMountCanvas && dimensions.width > 0 && dimensions.height > 0 ? (
        <AboutCubeCanvas
          width={dimensions.width}
          height={dimensions.height}
          aboutProgress={aboutProgress}
          active={inView}
        />
      ) : null}
    </div>
  );
}
