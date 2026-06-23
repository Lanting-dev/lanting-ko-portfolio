"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
] as const;

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="site-nav type-nav relative z-40 shrink-0">
      <div
        className={`site-nav-pill grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4 ${
          menuOpen ? "is-open" : ""
        }`.trim()}
      >
        <div className="hidden min-w-0 truncate md:block">
          <span className="text-black/45">Language </span>
          <span className="font-semibold text-black">EN</span>
        </div>

        <Link
          href="/"
          onClick={closeMenu}
          className="whitespace-nowrap transition-opacity hover:opacity-60 md:justify-self-center"
        >
          Lanting • Design
        </Link>

        <button
          type="button"
          className="type-nav justify-self-end text-black md:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="site-nav"
          className={`col-span-2 flex flex-col gap-4 border-t border-black/10 pt-4 md:col-span-1 md:col-start-3 md:flex-row md:items-center md:justify-end md:gap-10 md:border-0 md:pt-0 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
