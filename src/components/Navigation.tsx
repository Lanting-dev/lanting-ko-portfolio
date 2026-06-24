"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Navigation() {
  const { ui } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#work", label: ui.nav.work },
    { href: "#about", label: ui.nav.about },
  ] as const;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, menuOpen]);

  return (
    <header className="site-nav type-nav sticky top-0 z-40 shrink-0">
      <div
        className={`site-nav-pill grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4 ${
          menuOpen ? "is-open" : ""
        }`.trim()}
      >
        <LanguageToggle className="site-nav-lang-lead hidden md:block" />

        <Link
          href="/"
          onClick={closeMenu}
          className="whitespace-nowrap transition-opacity hover:opacity-60 md:justify-self-center"
        >
          {ui.nav.brand}
        </Link>

        <button
          type="button"
          className="site-nav-menu-btn type-nav justify-self-end text-black md:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? ui.nav.close : ui.nav.menu}
        </button>

        <nav
          id="site-nav"
          className={`col-span-2 flex flex-col gap-4 border-t border-black/10 pt-4 md:col-span-1 md:col-start-3 md:flex-row md:items-center md:justify-end md:gap-10 md:border-0 md:pt-0 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <LanguageToggle className="md:hidden" />
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
