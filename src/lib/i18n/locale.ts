export type Locale = "en" | "zh-TW";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "lanting-ko-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  "zh-TW": "繁中",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "zh-TW";
}

export function getNextLocale(locale: Locale): Locale {
  return locale === "en" ? "zh-TW" : "en";
}
