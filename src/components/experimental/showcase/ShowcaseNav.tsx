"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ShowcaseNav() {
  const { ui } = useLocale();

  return (
    <header className="site-nav type-nav sticky top-0 z-40 shrink-0">
      <div className="site-nav-pill site-nav-pill--case-study grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4">
        <Link
          href="/#lab"
          className="site-nav-case-back min-w-0 truncate text-black/45 transition-opacity hover:opacity-60"
        >
          {ui.lab.backToLab}
        </Link>

        <Link
          href="/"
          className="site-nav-case-brand whitespace-nowrap transition-opacity hover:opacity-60"
        >
          {ui.nav.brand}
        </Link>

        <LanguageToggle className="site-nav-case-lang justify-self-end" />
      </div>
    </header>
  );
}
