"use client";

import { LOCALE_LABELS } from "@/lib/i18n/locale";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { locale, toggleLocale, ui } = useLocale();

  return (
    <button
      type="button"
      className={`site-nav-lang type-nav inline-flex items-center gap-2 min-w-0 truncate text-left transition-opacity hover:opacity-60 ${className}`.trim()}
      onClick={toggleLocale}
      aria-label={`${ui.nav.switchLanguage} ${
        locale === "en" ? LOCALE_LABELS["zh-TW"] : LOCALE_LABELS.en
      }`}
    >
      <span className="shrink-0 text-black/45">{ui.nav.language}</span>
      <span className="shrink-0 font-semibold text-black">{LOCALE_LABELS[locale]}</span>
    </button>
  );
}
