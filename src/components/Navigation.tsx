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
        className={`site-nav-pill${menuOpen ? " is-open" : ""}`}
      >
        <div className="site-nav-bar">
          <LanguageToggle className="site-nav-lang-lead" />

          <Link
            href="/"
            onClick={closeMenu}
            className="site-nav-brand transition-opacity hover:opacity-60"
          >
            {ui.nav.brand}
          </Link>

          <nav
            id="site-nav"
            className="site-nav-desktop"
            aria-label="Primary"
          >
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="site-nav-menu-btn type-nav"
            aria-expanded={menuOpen}
            aria-controls="site-nav-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? ui.nav.close : ui.nav.menu}
          </button>
        </div>

        <nav
          id="site-nav-mobile"
          className={`site-nav-drawer${menuOpen ? " is-open" : ""}`}
          aria-label="Primary"
          aria-hidden={!menuOpen}
        >
          <div className="site-nav-drawer-links">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} onClick={closeMenu}>
                {label}
              </a>
            ))}
          </div>
          <div className="site-nav-drawer-footer">
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
