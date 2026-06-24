"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CaseStudyBackToTop } from "@/components/case-study/CaseStudyBackToTop";
import { CaseStudyFigure } from "@/components/case-study/CaseStudySection";
import { CaseStudyFooter } from "@/components/case-study/CaseStudyFooter";
import { CaseStudyMoreProjects } from "@/components/case-study/CaseStudyMoreProjects";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import { CaseStudyParallax } from "@/components/case-study/CaseStudyParallax";
import { CaseStudyProgressBar } from "@/components/case-study/CaseStudyProgressBar";
import { CaseStudyToc } from "@/components/case-study/CaseStudyToc";
import {
  type CopperMapping,
  type CopperMedia,
} from "@/lib/case-studies/copper";
import { useCaseStudy } from "@/hooks/useCaseStudy";
import { caseStudySectionLabel } from "@/lib/i18n/caseStudySection";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function MappingCard({
  item,
  index,
  total,
  visualLabel,
  soundLabel,
}: {
  item: CopperMapping["items"][number];
  index: number;
  total: number;
  visualLabel: string;
  soundLabel: string;
}) {
  return (
    <li className="copper-card">
      <div className="copper-card-top">
        <span className="copper-card-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="copper-card-count" aria-hidden="true">
          / {String(total).padStart(2, "0")}
        </span>
        <svg className="copper-card-wave" viewBox="0 0 64 24" aria-hidden="true">
          <path d="M1 12 Q5 12 7 6 T13 12 T19 4 T25 12 T31 8 T37 12 T43 3 T49 12 T55 9 T63 12" />
        </svg>
      </div>

      <p className="copper-card-eyebrow">{visualLabel}</p>
      <p className="copper-card-from">{item.from}</p>

      <span className="copper-card-arrow" aria-hidden="true" />

      <p className="copper-card-eyebrow copper-card-eyebrow--sound">{soundLabel}</p>
      <p className="copper-card-to">{item.to}</p>

      <p className="copper-card-desc">{item.body}</p>

      {item.sub ? (
        <ul className="copper-map-chips">
          {item.sub.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function SonicMapping({
  mapping,
  visualLabel,
  soundLabel,
}: {
  mapping: CopperMapping;
  visualLabel: string;
  soundLabel: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const travelRef = useRef(0);
  const distanceRef = useRef(0);
  const frameRef = useRef(0);
  const [sectionHeight, setSectionHeight] = useState<string>("auto");

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || reducedMotion) {
      setSectionHeight("auto");
      return;
    }
    const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
    travelRef.current = travel;
    if (travel <= 0) {
      distanceRef.current = 0;
      setSectionHeight("auto");
      return;
    }
    const distance = Math.max(travel * 1.1, window.innerHeight * 0.55);
    distanceRef.current = distance;
    setSectionHeight(`${window.innerHeight + distance}px`);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const render = () => {
      frameRef.current = 0;
      const distance = distanceRef.current;
      if (distance <= 0) {
        track.style.transform = "";
        return;
      }
      const rect = section.getBoundingClientRect();
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
    <div className="copper-mapping">
      <h3>{mapping.heading}</h3>
      <p className="copper-mapping-intro">{mapping.intro}</p>

      <div
        ref={sectionRef}
        className={`copper-scroll ${reducedMotion ? "is-static" : ""}`.trim()}
        style={{ height: sectionHeight }}
      >
        <div className="copper-scroll-sticky">
          <div
            ref={viewportRef}
            className="copper-scroll-viewport"
            role="region"
            aria-label="Visual to sound mapping cards, horizontally scrollable"
            tabIndex={0}
          >
            <ol
              ref={trackRef}
              className="copper-cards"
              aria-label="Visual to sound mappings"
            >
              {mapping.items.map((item, i) => (
                <MappingCard
                  key={item.from}
                  item={item}
                  index={i}
                  total={mapping.items.length}
                  visualLabel={visualLabel}
                  soundLabel={soundLabel}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionMedia({ media }: { media: CopperMedia }) {
  if (media.type === "video" && media.sound) {
    // Audible video: native controls so users can play/pause/adjust volume.
    // Kept out of the scaling parallax frame so the control bar isn't clipped.
    return (
      <figure className="copper-sound-figure">
        <p className="copper-sound-note">
          <span aria-hidden="true">🔊</span> This video has sound. Press play to listen.
        </p>
        <div className="editorial-design-media">
          <video
            className="copper-sound-video"
            src={media.src}
            poster={media.poster}
            aria-label={media.alt}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </figure>
    );
  }

  if (media.type === "video") {
    return (
      <figure className="case-study-figure editorial-design-media-figure">
        <CaseStudyParallax className="case-study-figure-frame" strength={110} offset={64}>
          <video
            className="case-study-figure-img"
            src={media.src}
            poster={media.poster}
            aria-label={media.alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </CaseStudyParallax>
      </figure>
    );
  }

  return (
    <CaseStudyFigure
      className="editorial-design-media-figure"
      src={media.src}
      alt={media.alt}
    />
  );
}

export function CopperCaseStudy() {
  const { ui } = useLocale();
  const study = useCaseStudy("copper");
  const { kicker, title, meta, summary, hero, problem, designDecisions, outcomes, outcomeDemo, conclusion } =
    study;

  return (
    <div className="editorial-case-study copper-case-study">
      <CaseStudyProgressBar />
      <CaseStudyBackToTop />

      <div className="page-shell mx-auto w-full max-w-[1440px]">
        <CaseStudyNav />

        <div className="case-study-glass editorial-case-glass">
          <div className="editorial-case-shell">
            <aside className="editorial-case-aside" aria-label="Table of contents">
              <CaseStudyToc items={study.toc} />
            </aside>

            <main className="editorial-case-main">
              <header className="editorial-hero">
                <p className="editorial-kicker">{kicker}</p>
                <h1>{title}</h1>

                <dl className="editorial-meta">
                  {meta.map(({ label, value }) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                <aside className="editorial-summary">
                  <h2>{ui.caseStudy.longStoryShort}</h2>
                  {summary.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                </aside>

                <CaseStudyFigure className="editorial-hero-figure" src={hero.src} alt={hero.alt} />
              </header>

              <section id="problem" className="editorial-section">
                <p className="editorial-section-label">{caseStudySectionLabel("problem", ui)}</p>
                <h2>{problem.headline}</h2>
                <p className="editorial-section-lead">{problem.body}</p>
              </section>

              <div id="design" className="editorial-design-chapter">
                {designDecisions.map((decision) => (
                  <section
                    key={decision.id}
                    id={decision.id}
                    className="editorial-section editorial-design-section"
                  >
                    <p className="editorial-section-label">{decision.label}</p>
                    <h2>{decision.headline}</h2>
                    <div className="editorial-design-copy">
                      <p>{decision.body}</p>
                    </div>
                    <DecisionMedia media={decision.media} />
                    {"mapping" in decision && decision.mapping ? (
                      <SonicMapping
                        mapping={decision.mapping}
                        visualLabel={ui.caseStudy.visual}
                        soundLabel={ui.caseStudy.sound}
                      />
                    ) : null}
                  </section>
                ))}
              </div>

              <section id="outcome" className="editorial-section">
                <p className="editorial-section-label">{caseStudySectionLabel("outcome", ui)}</p>
                <DecisionMedia media={outcomeDemo} />
                <ul className="copper-outcome-grid">
                  {outcomes.map((outcome) => (
                    <li key={outcome.title}>
                      <h3>{outcome.title}</h3>
                      <p>{outcome.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="conclusion" className="editorial-section editorial-conclusion">
                <p className="editorial-section-label">{caseStudySectionLabel("conclusion", ui)}</p>
                <h2>{conclusion.headline}</h2>
                <div className="editorial-conclusion-copy">
                  {conclusion.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                </div>

                <ol className="copper-steps">
                  {conclusion.futureSteps.map((step) => (
                    <li key={step.index}>
                      <span>{step.index}</span>
                      <p>
                        <strong>{step.title}</strong> {step.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </main>
          </div>
        </div>
      </div>

      <CaseStudyMoreProjects currentProject="copper" />
      <CaseStudyFooter />
    </div>
  );
}
