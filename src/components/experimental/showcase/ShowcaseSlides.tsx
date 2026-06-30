"use client";

import { useEffect, useRef } from "react";
import type { ExperimentalSlide } from "@/lib/experimental/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Scroll-driven horizontal slide deck. While the section is on screen its inner
 * panel is pinned and the track translates horizontally in lock-step with the
 * normal vertical page scroll. The pin uses JS-controlled `position: fixed`
 * rather than `position: sticky`, because this site sets
 * `html, body { overflow-x: clip }`, which breaks sticky in Safari.
 *
 * Reduced motion: a plain vertical stack, always scrollable.
 */
export function ShowcaseSlides({
  slides,
  label = "Slides",
}: {
  slides: readonly ExperimentalSlide[];
  label?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    let raf = 0;
    let maxX = 0;

    const measure = () => {
      maxX = Math.max(track.scrollWidth - pin.clientWidth, 0);
      // Tall enough that one pixel of page scroll ≈ one pixel of slide travel.
      section.style.height = `${window.innerHeight + maxX}px`;
    };

    const apply = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const distance = section.offsetHeight - vh;
      const progress =
        distance > 0 ? Math.min(Math.max(-rect.top / distance, 0), 1) : 0;

      // Pin lifecycle: before → fixed while traversing → after.
      if (rect.top <= 0 && rect.bottom >= vh) {
        pin.style.position = "fixed";
        pin.style.top = "0";
        pin.style.bottom = "auto";
      } else if (rect.top > 0) {
        pin.style.position = "absolute";
        pin.style.top = "0";
        pin.style.bottom = "auto";
      } else {
        pin.style.position = "absolute";
        pin.style.top = "auto";
        pin.style.bottom = "0";
      }

      track.style.transform = `translate3d(${(-progress * maxX).toFixed(2)}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      apply();
    };

    measure();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      section.style.height = "";
      pin.style.position = "";
      pin.style.top = "";
      pin.style.bottom = "";
      track.style.transform = "";
    };
  }, [reducedMotion, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="lab-slides"
      data-mode={reducedMotion ? "stack" : "scroll"}
      aria-label={label}
    >
      <div className="lab-slides-pin" ref={pinRef}>
        <div className="lab-slides-track" ref={trackRef}>
          {slides.map((s) => (
            <figure className="lab-slide" key={s.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                className="lab-slide-img"
                loading="lazy"
                draggable={false}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
