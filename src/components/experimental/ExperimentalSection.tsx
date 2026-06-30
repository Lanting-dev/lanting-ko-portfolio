"use client";

import { ExperimentalList } from "./ExperimentalList";
import { LabScrambleHeading } from "./LabScrambleHeading";

export function ExperimentalSection() {
  return (
    <section id="lab" className="lab-section page-shell">
      <header className="lab-section-header">
        <div className="lab-section-heading">
          <LabScrambleHeading />
        </div>
      </header>

      <ExperimentalList />
    </section>
  );
}
