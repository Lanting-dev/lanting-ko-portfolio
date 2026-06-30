"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export type RibbonProgressRef = MutableRefObject<number>;

const HeroRibbonCanvas = dynamic(() => import("./HeroRibbonCanvas"), {
  ssr: false,
});

type HeroRibbonSceneProps = {
  text: string;
  progressRef: RibbonProgressRef;
};

export function HeroRibbonScene({ text, progressRef }: HeroRibbonSceneProps) {
  const isMobile = useIsMobile();
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width > 0 && height > 0) {
        setSize((prev) =>
          prev.width === width && prev.height === height ? prev : { width, height },
        );
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="hero-ribbon-canvas-host absolute inset-0"
      data-canvas-size={`${size.width}x${size.height}`}
    >
      {size.width > 0 && size.height > 0 ? (
        <HeroRibbonCanvas
          text={text}
          mobile={isMobile}
          progressRef={progressRef}
          width={size.width}
          height={size.height}
        />
      ) : null}
    </div>
  );
}
