"use client";

import Link from "next/link";
import { CaseStudyBackToTop } from "@/components/case-study/CaseStudyBackToTop";
import { CaseStudyFigure } from "@/components/case-study/CaseStudySection";
import { CaseStudyFooter } from "@/components/case-study/CaseStudyFooter";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import { CaseStudyProgressBar } from "@/components/case-study/CaseStudyProgressBar";
import { CaseStudyToc } from "@/components/case-study/CaseStudyToc";
import { GtScrollSteps } from "@/components/case-study/GtScrollSteps";
import { useCaseStudy } from "@/hooks/useCaseStudy";
import { caseStudySectionLabel } from "@/lib/i18n/caseStudySection";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function IongCaseStudy() {
  const { locale, ui } = useLocale();
  const study = useCaseStudy("iong");
  const {
    meta,
    summary,
    hero,
    demoUrl,
    world,
    experience,
    reflection,
  } = study;

  return (
    <div className="editorial-case-study iong-case-study">
      <CaseStudyProgressBar />
      <CaseStudyBackToTop />

      <div className="page-shell mx-auto w-full max-w-[1440px]">
        <CaseStudyNav backHref="/#idea" backLabel={ui.lab.backToLab} />

        <div className="case-study-glass editorial-case-glass">
          <div className="editorial-case-shell">
            <aside className="editorial-case-aside" aria-label="Table of contents">
              <CaseStudyToc items={study.toc} />
            </aside>

            <main className="editorial-case-main">
              <header className="editorial-hero">
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
                    <Link href={demoUrl} className="site-cta" target="_blank" rel="noreferrer">
                      {ui.caseStudy.tryLiveDemo}
                    </Link>
                  </p>
                </aside>

                <figure className="editorial-hero-media gt-dark-media">
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

              <section id="concept" className="editorial-section">
                <p className="editorial-section-label">
                  {locale === "zh-TW" ? "概念" : "Concept"}
                </p>
                <h2>{world.conceptHeadline}</h2>
                <p className="editorial-section-lead">{world.premiseContext}</p>
                <p className="editorial-section-lead editorial-design-question">{world.designQuestion}</p>

                <p className="editorial-section-label editorial-subsection-label">{ui.caseStudy.designGoals}</p>
                <ul className="gt-signal-grid">
                  {world.goals.map((goal) => (
                    <li key={goal.title}>
                      <h3>{goal.title}</h3>
                      <p>{goal.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="world" className="editorial-section">
                <p className="editorial-section-label">{caseStudySectionLabel("world", ui)}</p>
                <h2>{world.headline}</h2>
                <p className="editorial-section-lead">{world.body}</p>
                <p className="editorial-section-lead">{world.context}</p>

                <CaseStudyFigure
                  className="editorial-design-media-figure"
                  src={world.image.src}
                  alt={world.image.alt}
                  parallax={false}
                />
              </section>

              <section id="experience" className="editorial-section gt-insight-section iong-experience-section">
                <p className="editorial-section-label">{caseStudySectionLabel("experience", ui)}</p>
                <h2>{experience.headline}</h2>
                <p className="editorial-section-lead">{experience.intro}</p>
                <GtScrollSteps
                  steps={experience.steps}
                  mediaFrame="plain"
                  mode="explore"
                  railLabel="Departments available during employee onboarding"
                />
              </section>

              <section id="reflection" className="editorial-section editorial-conclusion">
                <p className="editorial-section-label">{caseStudySectionLabel("reflection", ui)}</p>
                <h2>{reflection.headline}</h2>
                <div className="editorial-conclusion-copy">
                  {reflection.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                  <p>
                    <Link href={demoUrl} className="site-cta" target="_blank" rel="noreferrer">
                      {ui.caseStudy.tryLiveDemo}
                    </Link>
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <CaseStudyFooter />
    </div>
  );
}
