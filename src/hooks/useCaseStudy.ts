"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  getCaseStudy,
  type CaseStudySlug,
} from "@/lib/case-studies/getCaseStudy";

export function useCaseStudy<S extends CaseStudySlug>(slug: S) {
  const { locale } = useLocale();
  return useMemo(() => getCaseStudy(slug, locale), [slug, locale]);
}
