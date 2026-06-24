import type { UiMessages } from "@/lib/i18n/messages/ui";

export function caseStudySectionLabel(
  id: string,
  ui: UiMessages,
): string {
  const map = ui.caseStudy.sectionsMap;
  if (id in map) {
    return map[id as keyof typeof map];
  }
  return id;
}
