import type { Metadata } from "next";
import { CopperCaseStudy } from "@/components/case-study/CopperCaseStudy";
import { COPPER_CASE_STUDY } from "@/lib/case-studies/copper";

export const metadata: Metadata = {
  title: `${COPPER_CASE_STUDY.title} · Lanting Ko`,
  description: COPPER_CASE_STUDY.summary[0],
};

export default function CopperCaseStudyPage() {
  return <CopperCaseStudy />;
}
