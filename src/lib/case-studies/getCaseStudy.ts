import type { Locale } from "@/lib/i18n/locale";
import { COPPER_CASE_STUDY } from "@/lib/case-studies/copper";
import { FORU_CASE_STUDY } from "@/lib/case-studies/foru";
import { GT_CASE_STUDY } from "@/lib/case-studies/gt";
import { IONG_CASE_STUDY } from "@/lib/case-studies/iong";
import { NGA_CASE_STUDY } from "@/lib/case-studies/nga";
import { COPPER_CASE_STUDY_ZH } from "@/lib/case-studies/zh-TW/copper";
import { FORU_CASE_STUDY_ZH } from "@/lib/case-studies/zh-TW/foru";
import { GT_CASE_STUDY_ZH } from "@/lib/case-studies/zh-TW/gt";
import { IONG_CASE_STUDY_ZH } from "@/lib/case-studies/zh-TW/iong";
import { NGA_CASE_STUDY_ZH } from "@/lib/case-studies/zh-TW/nga";

export type CaseStudySlug = "nga" | "gt" | "foru" | "copper" | "iong";

const CASE_STUDIES = {
  nga: { en: NGA_CASE_STUDY, "zh-TW": NGA_CASE_STUDY_ZH },
  gt: { en: GT_CASE_STUDY, "zh-TW": GT_CASE_STUDY_ZH },
  foru: { en: FORU_CASE_STUDY, "zh-TW": FORU_CASE_STUDY_ZH },
  copper: { en: COPPER_CASE_STUDY, "zh-TW": COPPER_CASE_STUDY_ZH },
  iong: { en: IONG_CASE_STUDY, "zh-TW": IONG_CASE_STUDY_ZH },
} as const;

type CaseStudyMap = typeof CASE_STUDIES;

export function getCaseStudy<S extends CaseStudySlug>(
  slug: S,
  locale: Locale,
): CaseStudyMap[S]["en"] {
  const study = CASE_STUDIES[slug];
  return (study[locale] ?? study.en) as CaseStudyMap[S]["en"];
}
