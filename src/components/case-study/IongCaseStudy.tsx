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
import { IONG_CASE_STUDY } from "@/lib/case-studies/iong";

export function IongCaseStudy() {
  const {
    meta,
    summary,
    hero,
    demoUrl,
    world,
    research,
    process,
    system,
    experience,
    reflection,
  } = IONG_CASE_STUDY;

  return (
    <div className="editorial-case-study">
      <CaseStudyProgressBar />
      <CaseStudyBackToTop />

      <div className="page-shell mx-auto w-full max-w-[1440px]">
        <CaseStudyNav />

        <div className="case-study-glass editorial-case-glass">
          <div className="editorial-case-shell">
            <aside className="editorial-case-aside" aria-label="Table of contents">
              <CaseStudyToc items={IONG_CASE_STUDY.toc} />
            </aside>

            <main className="editorial-case-main">
              <header className="editorial-hero">
                <p className="editorial-kicker">{IONG_CASE_STUDY.kicker}</p>
                <h1>{IONG_CASE_STUDY.title}</h1>

                <dl className="editorial-meta">
                  {meta.map(({ label, value }) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                <aside className="editorial-summary">
                  <h2>Long Story Short</h2>
                  {summary.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                  <p>
                    <Link href={demoUrl} className="site-cta" target="_blank" rel="noreferrer">
                      Try the live onboarding demo →
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

              <section id="world" className="editorial-section">
                <p className="editorial-section-label">World</p>
                <h2>{world.headline}</h2>
                <p className="editorial-section-lead">{world.body}</p>
                <p className="editorial-section-lead">{world.context}</p>

                <p className="editorial-section-label editorial-subsection-label">Design question</p>
                <p className="editorial-section-lead editorial-design-question">{world.designQuestion}</p>

                <CaseStudyFigure
                  className="editorial-design-media-figure"
                  src={world.image.src}
                  alt={world.image.alt}
                />

                <p className="editorial-section-label editorial-subsection-label">Design goals</p>
                <ul className="gt-signal-grid">
                  {world.goals.map((goal) => (
                    <li key={goal.title}>
                      <h3>{goal.title}</h3>
                      <p>{goal.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="experience" className="editorial-section gt-insight-section">
                <p className="editorial-section-label">Experience</p>
                <h2>{experience.headline}</h2>
                <p className="editorial-section-lead">{experience.intro}</p>
                <GtScrollSteps
                  steps={experience.steps}
                  mediaFrame="plain"
                  mode="explore"
                  railLabel="Departments available during employee onboarding"
                />
                <p className="editorial-section-lead editorial-section-bridge">{experience.outro}</p>
              </section>

              <section id="process" className="editorial-section">
                <p className="editorial-section-label">Process</p>
                <h2>{process.headline}</h2>
                <p className="editorial-section-lead">{process.intro}</p>

                <ol className="editorial-design-points">
                  {process.points.map(([index, title, body]) => (
                    <li key={index}>
                      <span>{index}</span>
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {process.images.map((image) => (
                  <CaseStudyFigure
                    key={image.src}
                    className="editorial-design-media-figure"
                    src={image.src}
                    alt={image.alt}
                    caption={image.caption}
                  />
                ))}
              </section>

              <section id="research" className="editorial-section">
                <p className="editorial-section-label">Research</p>
                <h2>{research.headline}</h2>
                <p className="editorial-section-lead">{research.intro}</p>

                <ul className="gt-signal-grid gt-signal-grid--quad">
                  {research.pillars.map((pillar) => (
                    <li key={pillar.title}>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.body}</p>
                    </li>
                  ))}
                </ul>

                <p className="editorial-section-label editorial-subsection-label">Literature review</p>
                <ul className="gt-signal-grid">
                  {research.literature.map((item) => (
                    <li key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </li>
                  ))}
                </ul>

                <p className="editorial-section-label editorial-subsection-label">Weak signals</p>
                <ul className="gt-signal-grid">
                  {research.signals.map((signal) => (
                    <li key={signal.title}>
                      <h3>{signal.title}</h3>
                      <p>{signal.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="system" className="editorial-section">
                <p className="editorial-section-label">System</p>
                <h2>{system.headline}</h2>
                <p className="editorial-section-lead">{system.intro}</p>

                <p className="editorial-section-label editorial-subsection-label">{system.inDemo.label}</p>
                <p className="editorial-section-lead">{system.inDemo.lead}</p>

                <CaseStudyFigure
                  className="editorial-design-media-figure"
                  src={system.departmentMap.src}
                  alt={system.departmentMap.alt}
                />

                <ul className="gt-signal-grid">
                  {system.departments
                    .filter((department) => department.accessible)
                    .map((department) => (
                      <li key={department.name}>
                        <h3>{department.name}</h3>
                        <p>
                          {department.tagline}. {department.body}
                        </p>
                      </li>
                    ))}
                </ul>

                {system.interfaces.map((screen) => (
                  <section
                    key={`${screen.label}-${screen.headline}`}
                    className="editorial-section editorial-design-section"
                  >
                    <p className="editorial-section-label">{screen.label}</p>
                    <h2>{screen.headline}</h2>
                    <p className="editorial-section-lead">{screen.body}</p>
                    <CaseStudyFigure
                      className="editorial-design-media-figure"
                      src={screen.image.src}
                      alt={screen.image.alt}
                    />
                  </section>
                ))}

                <p className="editorial-section-label editorial-subsection-label">{system.beyondDemo.label}</p>
                <p className="editorial-section-lead">{system.beyondDemo.lead}</p>

                <ul className="gt-signal-grid">
                  {system.departments
                    .filter((department) => !department.accessible)
                    .map((department) => (
                      <li key={department.name}>
                        <h3>{department.name}</h3>
                        <p>
                          {department.tagline}. {department.body}
                        </p>
                      </li>
                    ))}
                </ul>

                <div className="editorial-design-chapter">
                  {system.substrates.map((substrate) => (
                    <section
                      key={substrate.name}
                      className="editorial-section editorial-design-section"
                    >
                      <p className="editorial-section-label">{substrate.macro}</p>
                      <h2>{substrate.name}</h2>
                      <p className="editorial-section-lead">{substrate.body}</p>
                      <CaseStudyFigure
                        className="editorial-design-media-figure"
                        src={substrate.image.src}
                        alt={substrate.image.alt}
                      />
                    </section>
                  ))}

                  <section className="editorial-section editorial-design-section">
                    <p className="editorial-section-label">Delivery</p>
                    <h2>{system.delivery.headline}</h2>
                    <p className="editorial-section-lead">{system.delivery.body}</p>
                    <CaseStudyFigure
                      className="editorial-design-media-figure"
                      src={system.delivery.image.src}
                      alt={system.delivery.image.alt}
                    />
                  </section>

                  <section className="editorial-section editorial-design-section">
                    <p className="editorial-section-label">Petizen</p>
                    <h2>{system.petizen.headline}</h2>
                    <p className="editorial-section-lead">{system.petizen.body}</p>
                    <CaseStudyFigure
                      className="editorial-design-media-figure"
                      src={system.petizen.image.src}
                      alt={system.petizen.image.alt}
                    />
                  </section>
                </div>
              </section>

              <section id="reflection" className="editorial-section editorial-conclusion">
                <p className="editorial-section-label">Reflection</p>
                <h2>{reflection.headline}</h2>
                <div className="editorial-conclusion-copy">
                  {reflection.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                  <p>
                    <Link href={demoUrl} className="site-cta" target="_blank" rel="noreferrer">
                      Try the live onboarding demo →
                    </Link>
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <CaseStudyMoreProjects currentProject="iong" />
      <CaseStudyFooter />
    </div>
  );
}
