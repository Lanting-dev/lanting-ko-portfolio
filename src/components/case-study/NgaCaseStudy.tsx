"use client";

import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import { CaseStudyMethodTag } from "@/components/case-study/CaseStudyBlocks";
import {
  CaseStudyFigure,
  CaseStudyFigureGrid,
  CaseStudySection,
} from "@/components/case-study/CaseStudySection";
import { CaseStudyReveal } from "@/components/case-study/CaseStudyReveal";
import { CaseStudyProgressBar } from "@/components/case-study/CaseStudyProgressBar";
import { CaseStudyBackToTop } from "@/components/case-study/CaseStudyBackToTop";
import { CaseStudyToc } from "@/components/case-study/CaseStudyToc";
import { CaseStudyParallax } from "@/components/case-study/CaseStudyParallax";
import { CaseStudyFooter } from "@/components/case-study/CaseStudyFooter";
import { CaseStudyMoreProjects } from "@/components/case-study/CaseStudyMoreProjects";
import { CaseStudyJourney } from "@/components/case-study/CaseStudyJourney";
import {
  getSectionBody,
  getSectionImage,
  getSectionImages,
  hasImpactPoints,
  hasJourney,
} from "@/lib/case-studies/nga";
import { useCaseStudy } from "@/hooks/useCaseStudy";

/** Reference crop for NGA mockups , viewport window, full PNG revealed on scroll. */
const NGA_MOCKUP_REVEAL_ASPECT: Partial<Record<string, number>> = {
  "drawing-assist": 1024 / 606,
  reactions: 1024 / 619,
  "theme-shuffle": 1024 / 568,
};

export function NgaCaseStudy() {
  const study = useCaseStudy("nga");
  const { meta, summary, problem, research, designSections, conclusion } =
    study;

  return (
    <div className="case-study-page nga-case-study">
      <CaseStudyProgressBar />
      <CaseStudyBackToTop />
      <div className="page-shell mx-auto w-full max-w-[1440px]">
        <CaseStudyNav />

        <div className="case-study-glass">
          <div className="nga-case-shell">
          <aside className="nga-case-aside" aria-label="Table of contents">
            <CaseStudyToc items={study.toc} />
          </aside>

          <div className="nga-case-main">
            <header className="case-study-hero">
              <CaseStudyReveal motion="scale">
                <h1 className="case-study-title">{study.title}</h1>
              </CaseStudyReveal>

              <CaseStudyReveal className="case-study-hero-meta" delay={0.04}>
                <dl className="case-study-meta">
                  {meta.map(({ label, value }) => (
                    <div key={label} className="case-study-meta-item">
                      <dt className="type-nav text-black/45">{label}</dt>
                      <dd className="type-body mt-1 text-black/75">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CaseStudyReveal>

              <div className="case-study-hero-feature">
                <CaseStudyReveal className="case-study-hero-summary" delay={0.06}>
                  <aside className="case-study-summary">
                    <h2 className="case-study-summary-title">{summary.title}</h2>
                    <div className="case-study-summary-body">
                      {summary.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 32)} className="type-body text-black/65">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </aside>
                </CaseStudyReveal>

                <CaseStudyReveal className="case-study-hero-screens">
                  <CaseStudyParallax
                    className="case-study-hero-parallax"
                    strength={120}
                    offset={36}
                    variant="phones"
                  >
                    <div className="case-study-screens-frame">
                      {study.heroImages.map((image) => {
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={image.src}
                            src={image.src}
                            alt={image.alt}
                            className="case-study-screens-img"
                            loading="eager"
                            draggable={false}
                          />
                        );
                      })}
                    </div>
                  </CaseStudyParallax>
                </CaseStudyReveal>
              </div>
            </header>

            <CaseStudySection
              id="problem"
              label={problem.label}
              headline={problem.headline}
              body={problem.intro}
            >
              <div className="case-study-pair case-study-pair--problem">
                <CaseStudyReveal delay={0.06}>
                  <h3 className="case-study-subhead">{problem.insightsTitle}</h3>
                </CaseStudyReveal>

                <CaseStudyReveal delay={0.08}>
                  <ul className="case-study-insights case-study-insights--cards">
                    {problem.insights.map((insight) => (
                      <li key={insight.title} className="case-study-insight">
                        <h4 className="case-study-insight-title">{insight.title}</h4>
                        <p className="type-body mt-2 text-black/60">{insight.body}</p>
                      </li>
                    ))}
                  </ul>
                </CaseStudyReveal>
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="research"
              label={research.label}
              headline={research.headline}
              body={research.intro}
            >
              <div className="case-study-pair">
                <CaseStudyFigure
                  src={research.image.src}
                  alt={research.image.alt}
                  delay={0.06}
                />

                <ul className="case-study-findings">
                  {research.findings.map((finding) => (
                    <li key={finding.text} className="case-study-finding">
                      <CaseStudyReveal>
                        <p className="case-study-finding-text">{finding.text}</p>
                        <div className="case-study-method-tags">
                          {finding.methods.map((method) => (
                            <CaseStudyMethodTag key={method} label={method} />
                          ))}
                        </div>
                      </CaseStudyReveal>
                    </li>
                  ))}
                </ul>
              </div>
            </CaseStudySection>

            <div id="design">
              {designSections.map((section, index) => (
                <CaseStudySection
                  key={section.id}
                  id={section.id}
                  label={section.label}
                  headline={section.headline}
                  body={getSectionBody(section)}
                  className="case-study-section--design"
                >
                  {hasJourney(section) ? (
                    <CaseStudyReveal delay={0.06}>
                      <CaseStudyJourney steps={section.journey} />
                    </CaseStudyReveal>
                  ) : null}

                  {getSectionImages(section) ? (
                    <CaseStudyFigureGrid
                      images={[...getSectionImages(section)!]}
                      delay={0.06 + index * 0.02}
                    />
                  ) : getSectionImage(section) ? (
                    hasImpactPoints(section) ? (
                      <div className="case-study-pair">
                        <CaseStudyFigure
                          src={getSectionImage(section)!.src}
                          alt={getSectionImage(section)!.alt}
                          revealAspect={NGA_MOCKUP_REVEAL_ASPECT[section.id]}
                          delay={0.06 + index * 0.02}
                        />
                        <CaseStudyReveal delay={0.1}>
                          <ol className="case-study-impact-list">
                            {section.points.map((point) => (
                              <li key={point.index} className="case-study-impact-item">
                                <span className="case-study-impact-index type-nav">
                                  {point.index}
                                </span>
                                <p className="case-study-impact-text">{point.text}</p>
                              </li>
                            ))}
                          </ol>
                        </CaseStudyReveal>
                      </div>
                    ) : (
                      <CaseStudyFigure
                        src={getSectionImage(section)!.src}
                        alt={getSectionImage(section)!.alt}
                        revealAspect={NGA_MOCKUP_REVEAL_ASPECT[section.id]}
                        delay={0.06 + index * 0.02}
                      />
                    )
                  ) : null}
                </CaseStudySection>
              ))}
            </div>

            <CaseStudyReveal className="case-study-pull-quote">
              <blockquote className="case-study-quote">
                <p>&ldquo;{conclusion.quote}&rdquo;</p>
                <footer className="type-nav mt-5 text-black/45">
                  · {conclusion.quoteAttribution}
                </footer>
              </blockquote>
            </CaseStudyReveal>

            <CaseStudySection
              id="conclusion"
              label={conclusion.label}
              headline={conclusion.headline}
              body={conclusion.body}
            />
          </div>
          </div>
        </div>
      </div>
      <CaseStudyMoreProjects />
      <CaseStudyFooter />
    </div>
  );
}
