"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { VISIBLE_PROJECTS } from "@/lib/projects";

type CaseStudyMoreProjectsProps = {
  currentProject?: string;
};

export function CaseStudyMoreProjects({
  currentProject = "nga",
}: CaseStudyMoreProjectsProps) {
  const projects = VISIBLE_PROJECTS.filter(
    (project) => project.id !== currentProject,
  ).slice(0, 3);
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef(0);
  const scrollDistanceRef = useRef(0);
  const frameRef = useRef(0);
  const [sectionHeight, setSectionHeight] = useState("auto");

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || reducedMotion) return;

    const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const scrollDistance = Math.max(travel * 1.35, window.innerHeight * 0.9);
    travelRef.current = travel;
    scrollDistanceRef.current = scrollDistance;
    setSectionHeight(`${window.innerHeight + scrollDistance}px`);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const render = () => {
      frameRef.current = 0;
      const rect = section.getBoundingClientRect();
      const distance = scrollDistanceRef.current || 1;
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      track.style.transform = `translate3d(${-travelRef.current * progress}px, 0, 0)`;
    };

    const requestRender = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(render);
    };

    measure();
    render();
    const observer = new ResizeObserver(() => {
      measure();
      requestRender();
    });
    observer.observe(viewport);
    observer.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", requestRender, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", requestRender);
      cancelAnimationFrame(frameRef.current);
    };
  }, [measure, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={`case-study-more-scroll ${reducedMotion ? "is-static" : ""}`.trim()}
      style={{ height: sectionHeight }}
      aria-labelledby="more-projects-title"
    >
      <div className="case-study-more-sticky page-shell">
        <div className="case-study-more-header">
          <p className="type-nav text-black/45">Continue exploring</p>
          <h2 id="more-projects-title" className="case-study-more-title">
            See More Projects
          </h2>
        </div>

        <div ref={viewportRef} className="case-study-more-viewport">
          <div ref={trackRef} className="case-study-more-track">
            {projects.map((project) => {
              const image = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.src}
                  alt={project.alt}
                  className="case-study-more-image"
                  loading="lazy"
                  draggable={false}
                />
              );

              return (
                <article key={project.id} className="case-study-more-card">
                  {project.href ? (
                    <Link href={project.href} aria-label={project.alt}>
                      {image}
                      <div className="case-study-more-card-body">
                        {project.title ? (
                          <p className="case-study-more-card-title">{project.title}</p>
                        ) : null}
                        <span className="site-cta">View case study →</span>
                      </div>
                    </Link>
                  ) : (
                    image
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
