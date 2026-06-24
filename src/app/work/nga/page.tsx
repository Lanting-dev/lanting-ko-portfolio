import type { Metadata } from "next";
import { NgaCaseStudy } from "@/components/case-study/NgaCaseStudy";
import { NGA_CASE_STUDY } from "@/lib/case-studies/nga";

export const metadata: Metadata = {
  title: `${NGA_CASE_STUDY.title} · Lanting Ko`,
  description: NGA_CASE_STUDY.summary.paragraphs[0],
};

export default function NgaCaseStudyPage() {
  return (
    <main className="relative w-full">
      <NgaCaseStudy />
    </main>
  );
}
