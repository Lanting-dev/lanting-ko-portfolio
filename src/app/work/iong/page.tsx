import type { Metadata } from "next";
import { IongCaseStudy } from "@/components/case-study/IongCaseStudy";
import { IONG_CASE_STUDY } from "@/lib/case-studies/iong";

export const metadata: Metadata = {
  title: `${IONG_CASE_STUDY.title} · Lanting Ko`,
  description: IONG_CASE_STUDY.summary[0],
};

export default function IongCaseStudyPage() {
  return <IongCaseStudy />;
}
