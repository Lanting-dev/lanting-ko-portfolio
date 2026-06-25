"use client";

import { useParallaxFrame } from "@/components/parallax/ParallaxEngineProvider";
import { useScrollDebugEnabled } from "@/hooks/useScrollDebugEnabled";
import {
  diagnoseRhythm,
  formatScrollPhase,
  getScrollPhase,
  SCROLL_TRACKS,
  type ScrollSection,
} from "@/lib/scroll/rhythmSpec";
import { useState } from "react";

const FLAGS = diagnoseRhythm();

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function Bar({
  label,
  value,
  active,
}: {
  label: string;
  value: number;
  active: boolean;
}) {
  return (
    <div className="scroll-rhythm-bar">
      <span className={active ? "is-active" : undefined}>{label}</span>
      <div className="scroll-rhythm-bar-track">
        <div
          className="scroll-rhythm-bar-fill"
          style={{ transform: `scaleX(${Math.min(1, Math.max(0, value))})` }}
        />
      </div>
      <span className="scroll-rhythm-bar-pct">{pct(value)}</span>
    </div>
  );
}

export function ScrollRhythmHUD() {
  const enabled = useScrollDebugEnabled();
  const [phaseLabel, setPhaseLabel] = useState("hero.hold");
  const [activeSection, setActiveSection] = useState<ScrollSection>("hero");
  const [progress, setProgress] = useState({
    hero: 0,
    project: 0,
    about: 0,
    footer: 0,
  });

  useParallaxFrame((snapshot) => {
    const phase = getScrollPhase(snapshot);
    setPhaseLabel(formatScrollPhase(phase));
    setActiveSection(phase.section);
    setProgress({
      hero: snapshot.heroProgress,
      project: snapshot.projectProgress,
      about: snapshot.aboutProgress,
      footer: snapshot.footerProgress,
    });
  });

  if (!enabled) return null;

  return (
    <aside className="scroll-rhythm-hud" aria-hidden="true">
      <p className="scroll-rhythm-phase">{phaseLabel}</p>
      <Bar label="hero" value={progress.hero} active={activeSection === "hero"} />
      <Bar
        label="work"
        value={progress.project}
        active={activeSection === "project"}
      />
      <Bar
        label="about"
        value={progress.about}
        active={activeSection === "about"}
      />
      <Bar
        label="foot"
        value={progress.footer}
        active={activeSection === "footer"}
      />
      <ul className="scroll-rhythm-flags">
        {FLAGS.map((flag) => (
          <li key={flag.message} data-severity={flag.severity}>
            {flag.message}
          </li>
        ))}
      </ul>
      <p className="scroll-rhythm-meta">
        tracks: {SCROLL_TRACKS.hero}/{SCROLL_TRACKS.project}/
        {SCROLL_TRACKS.about}/{SCROLL_TRACKS.footer}vh · ?scroll-debug=0 to hide
      </p>
    </aside>
  );
}
