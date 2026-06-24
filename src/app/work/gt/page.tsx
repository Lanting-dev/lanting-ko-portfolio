import type { Metadata } from "next";
import { GtCaseStudy } from "@/components/case-study/GtCaseStudy";
import { GT_CASE_STUDY } from "@/lib/case-studies/gt";

export const metadata: Metadata = {
  title: `${GT_CASE_STUDY.title} · Lanting Ko`,
  description: GT_CASE_STUDY.summary[0],
};

export default function GtCaseStudyPage() {
  return <GtCaseStudy />;
}

