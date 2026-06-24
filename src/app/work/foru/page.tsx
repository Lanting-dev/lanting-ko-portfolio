import type { Metadata } from "next";
import { ForuCaseStudy } from "@/components/case-study/ForuCaseStudy";
import { FORU_CASE_STUDY } from "@/lib/case-studies/foru";

export const metadata: Metadata = {
  title: `${FORU_CASE_STUDY.title} · Lanting Ko`,
  description: FORU_CASE_STUDY.summary[0],
};

export default function ForuCaseStudyPage() {
  return <ForuCaseStudy />;
}
