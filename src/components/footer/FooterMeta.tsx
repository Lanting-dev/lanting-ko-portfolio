"use client";

import { SITE_FOOTER } from "@/lib/footer/siteFooter";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function FooterMeta() {
  const { ui } = useLocale();

  return (
    <div className="site-footer-meta page-shell">
      <p className="site-footer-meta-copy">
        LANTING KO © {new Date().getFullYear()} {ui.footer.rights}
      </p>
      <nav className="site-footer-meta-links" aria-label={ui.footer.ariaContact}>
        <a href={`mailto:${SITE_FOOTER.email}`}>{ui.footer.email}</a>
        <span className="site-footer-sep" aria-hidden="true">
          ·
        </span>
        <a
          href={SITE_FOOTER.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ui.footer.linkedIn}
        </a>
      </nav>
    </div>
  );
}
