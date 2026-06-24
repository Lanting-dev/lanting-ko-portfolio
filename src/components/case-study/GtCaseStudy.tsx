"use client";

import { CaseStudyBackToTop } from "@/components/case-study/CaseStudyBackToTop";
import { CaseStudyFigure } from "@/components/case-study/CaseStudySection";
import { CaseStudyFooter } from "@/components/case-study/CaseStudyFooter";
import { CaseStudyMoreProjects } from "@/components/case-study/CaseStudyMoreProjects";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import { CaseStudyProgressBar } from "@/components/case-study/CaseStudyProgressBar";
import { CaseStudyToc } from "@/components/case-study/CaseStudyToc";
import { GtScrollSteps } from "@/components/case-study/GtScrollSteps";
import { useCaseStudy } from "@/hooks/useCaseStudy";
import { caseStudySectionLabel } from "@/lib/i18n/caseStudySection";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function GtCaseStudy() {
  const { ui } = useLocale();
  const study = useCaseStudy("gt");
  const { meta, summary, problem, research, insight, design, impact, conclusion } =
    study;

  return (
    <div className="editorial-case-study gt-case-study">
      <CaseStudyProgressBar />
      <CaseStudyBackToTop />

      <div className="page-shell mx-auto w-full max-w-[1440px]">
        <CaseStudyNav />

        <div className="case-study-glass editorial-case-glass">
          <div className="editorial-case-shell">
            <aside className="editorial-case-aside" aria-label={ui.caseStudy.sections}>
              <CaseStudyToc items={study.toc} />
            </aside>

            <main className="editorial-case-main">
            <header className="editorial-hero">
              <p className="editorial-kicker">Course Builder AI</p>
              <h1>{study.title}</h1>

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

              <CaseStudyFigure
                className="editorial-hero-figure"
                src="/work/gt/hero.png"
                alt="Course Builder AI shown on a laptop"
              />
            </header>

            <section id="problem" className="editorial-section">
              <p className="editorial-section-label">{caseStudySectionLabel("problem", ui)}</p>
              <h2>{problem.headline}</h2>
              <p className="editorial-section-lead">{problem.body}</p>
              <ul className="gt-signal-grid">
                {problem.signals.map((signal) => (
                  <li key={signal.title}>
                    <h3>{signal.title}</h3>
                    <p>{signal.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="research" className="editorial-section">
              <p className="editorial-section-label">{caseStudySectionLabel("research", ui)}</p>
              <h2>{research.headline}</h2>
              <div className="gt-research-grid">
                <figure className="gt-dark-media gt-research-media">
                  <div className="gt-browser-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="gt-browser-bar" src="/work/gt/toolbar.png" alt="" aria-hidden="true" />
                    <video
                      src="/work/gt/research-cover.mp4"
                      aria-label="Course Builder eye-tracking research session"
                      poster="/work/gt/research-screen.jpg"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </figure>
                <ol className="gt-research-methods">
                  {research.methods.map((method) => (
                    <li key={method.title}>
                      <h3>{method.title}</h3>
                      <p>{method.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="editorial-section gt-insight-section">
              <p className="editorial-section-label">{ui.caseStudy.sectionsMap.coreInsight}</p>
              <h2>{insight.headline}</h2>
              <p className="editorial-section-lead">{insight.body}</p>
              <GtScrollSteps steps={insight.steps} />
            </section>

            <div id="design" className="editorial-design-chapter">
              {design.map((decision) => (
                <section key={decision.id} id={decision.id} className="editorial-section editorial-design-section">
                  <p className="editorial-section-label">{decision.label}</p>
                  <h2>{decision.headline}</h2>
                  <div className="editorial-design-copy">
                    {decision.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                    ))}
                  </div>

                  <CaseStudyFigure
                    className="editorial-design-media-figure"
                    src={decision.image}
                    alt={decision.alt}
                  />

                  <ol className="editorial-design-points">
                    {decision.points.map(([index, title, body]) => (
                      <li key={index}>
                        <span>{index}</span>
                        <div>
                          <h3>{title}</h3>
                          <p>{body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>

            <section className="gt-impact" aria-label={caseStudySectionLabel("impact", ui)}>
              <p className="editorial-section-label">{caseStudySectionLabel("impact", ui)}</p>
              <blockquote>
                <p>&ldquo;{impact.quote}&rdquo;</p>
                <footer>· {impact.attribution}</footer>
              </blockquote>
            </section>

            <section id="conclusion" className="editorial-section editorial-conclusion">
              <p className="editorial-section-label">{caseStudySectionLabel("conclusion", ui)}</p>
              <h2>{conclusion.headline}</h2>
              <div className="editorial-conclusion-copy">
                {conclusion.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                ))}
              </div>
            </section>
            </main>
          </div>
        </div>
      </div>

      <CaseStudyMoreProjects currentProject="gt" />
      <CaseStudyFooter />
    </div>
  );
}
