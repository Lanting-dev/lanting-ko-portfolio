"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { getLocalizedProjectFields } from "@/lib/i18n/messages/projects";
import type { ProjectItem } from "@/lib/projects";

export function useLocalizedProject(project: ProjectItem): ProjectItem {
  const { locale } = useLocale();

  return useMemo(() => {
    const localized = getLocalizedProjectFields(project.id, locale);
    if (!localized) return project;
    return { ...project, ...localized };
  }, [locale, project]);
}

export function useLocalizedProjects(projects: readonly ProjectItem[]): ProjectItem[] {
  const { locale } = useLocale();

  return useMemo(
    () =>
      projects.map((project) => {
        const localized = getLocalizedProjectFields(project.id, locale);
        return localized ? { ...project, ...localized } : project;
      }),
    [locale, projects],
  );
}
