import { SITE_FOOTER } from "@/lib/footer/siteFooter";

export function FooterMeta() {
  return (
    <div className="site-footer-meta page-shell">
      <p className="site-footer-meta-copy">{SITE_FOOTER.copyright}</p>
      <nav className="site-footer-meta-links" aria-label="Contact">
        <a href={`mailto:${SITE_FOOTER.email}`}>{SITE_FOOTER.emailLabel}</a>
        <span className="site-footer-sep" aria-hidden="true">
          ·
        </span>
        <a
          href={SITE_FOOTER.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
        >
          {SITE_FOOTER.linkedInLabel}
        </a>
      </nav>
    </div>
  );
}
