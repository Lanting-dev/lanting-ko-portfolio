"use client";

import dynamic from "next/dynamic";
import { memo, useLayoutEffect, useRef, useState } from "react";

const ProjectCubeCanvas = dynamic(() => import("./ProjectCubeCanvas"), {
  ssr: false,
});

type ProjectCubeSceneProps = {
  greySrc: string;
  colorSrc: string;
  seed: number;
  revealed: boolean;
  hovered: boolean;
};

export const ProjectCubeScene = memo(function ProjectCubeScene({
  greySrc,
  colorSrc,
  seed,
  revealed,
  hovered,
}: ProjectCubeSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldMountCanvas, setShouldMountCanvas] = useState(false);
  const [inView, setInView] = useState(true);

  useLayoutEffect(() => {
    const el = ref.current;
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
    const el = ref.current;
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
    const el = ref.current;
    if (!el || !shouldMountCanvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { root: null, rootMargin: "30% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldMountCanvas]);

  return (
    <div ref={ref} className="project-cube-scene">
      {shouldMountCanvas && dimensions.width > 0 && dimensions.height > 0 ? (
        <ProjectCubeCanvas
          greySrc={greySrc}
          colorSrc={colorSrc}
          width={dimensions.width}
          height={dimensions.height}
          seed={seed}
          revealed={revealed}
          hovered={hovered}
          active={inView}
        />
      ) : null}
    </div>
  );
});
