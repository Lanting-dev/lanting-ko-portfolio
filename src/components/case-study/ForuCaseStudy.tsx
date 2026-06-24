"use client";

import Link from "next/link";
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

export function ForuCaseStudy() {
  const { ui } = useLocale();
  const study = useCaseStudy("foru");
  const { meta, summary, hero, prototypeUrl, problem, research, strategy, design, impact, conclusion } =
    study;

  return (
    <div className="editorial-case-study foru-case-study">
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
              <header id="overview" className="editorial-hero">
                <p className="editorial-kicker">{study.kicker}</p>
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
                  <p>
                    <Link href={prototypeUrl} className="site-cta" target="_blank" rel="noreferrer">
                      {ui.caseStudy.explorePrototype}
                    </Link>
                  </p>
                </aside>

                <figure className="editorial-hero-media editorial-hero-figure foru-hero-media">
                  <video
                    src={hero.src}
                    aria-label={hero.alt}
                    poster={hero.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </figure>
              </header>

              <section id="problem" className="editorial-section">
                <p className="editorial-section-label">{caseStudySectionLabel("problem", ui)}</p>
                <h2>{problem.headline}</h2>
                <p className="editorial-section-lead">{problem.body}</p>
                <p className="editorial-section-lead editorial-design-question">
                  {problem.challenge}
                </p>
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
                <p className="editorial-section-lead">{research.intro}</p>

                <div className="foru-persona-grid">
                  {research.personas.map((persona) => (
                    <figure key={persona.name} className="foru-persona-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={persona.image.src} alt={persona.image.alt} loading="lazy" />
                      <figcaption>
                        <p className="foru-persona-type">{persona.type}</p>
                        <p className="foru-persona-quote">&ldquo;{persona.quote}&rdquo;</p>
                        <p className="foru-persona-insight">{persona.insight}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <ul className="gt-signal-grid">
                  {research.findings.map((finding) => (
                    <li key={finding.title}>
                      <h3>{finding.title}</h3>
                      <p>{finding.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="strategy" className="editorial-section">
                <p className="editorial-section-label">{caseStudySectionLabel("strategy", ui)}</p>
                <h2>{strategy.headline}</h2>
                <p className="editorial-section-lead">{strategy.body}</p>

                <ul className="gt-signal-grid">
                  {strategy.principles.map((principle) => (
                    <li key={principle.title}>
                      <h3>{principle.title}</h3>
                      <p>{principle.body}</p>
                    </li>
                  ))}
                </ul>

                <CaseStudyFigure
                  className="editorial-design-media-figure"
                  src={strategy.comparison.src}
                  alt={strategy.comparison.alt}
                  parallax={false}
                />
              </section>

              <div id="design" className="editorial-design-chapter">
                {design.map((pillar) => (
                  <section
                    key={pillar.id}
                    id={pillar.id}
                    className="editorial-section editorial-design-section gt-insight-section"
                  >
                    <p className="editorial-section-label">{pillar.label}</p>
                    <h2>{pillar.headline}</h2>
                    <div className="editorial-design-copy">
                      {pillar.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                      ))}
                    </div>
                    {pillar.figure ? (
                      <CaseStudyFigure
                        className="editorial-design-media-figure foru-wide-figure"
                        src={pillar.figure.src}
                        alt={pillar.figure.alt}
                        parallax={false}
                      />
                    ) : null}
                    {pillar.steps.length > 0 ? (
                      <GtScrollSteps
                        steps={pillar.steps}
                        mediaFrame="plain"
                        mode="explore"
                        railLabel={pillar.headline}
                        wideMedia={pillar.id === "routine"}
                      />
                    ) : null}
                  </section>
                ))}
              </div>

              <section id="impact" className="foru-impact editorial-section" aria-label={caseStudySectionLabel("impact", ui)}>
                <p className="editorial-section-label">{caseStudySectionLabel("impact", ui)}</p>
                <h2>{impact.headline}</h2>
                <p className="editorial-section-lead">{impact.lead}</p>
                <ul className="foru-impact-grid">
                  {impact.quotes.map((item) => (
                    <li key={item.quote.slice(0, 36)}>
                      <blockquote className="foru-impact-card">
                        <p>&ldquo;{item.quote}&rdquo;</p>
                        <footer>{item.attribution}</footer>
                      </blockquote>
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
                  <p>
                    <Link href={prototypeUrl} className="site-cta" target="_blank" rel="noreferrer">
                      {ui.caseStudy.explorePrototype}
                    </Link>
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <CaseStudyMoreProjects currentProject="foru" />
      <CaseStudyFooter />
    </div>
  );
}
