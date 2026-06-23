import Link from "next/link";

export function CaseStudyNav() {
  return (
    <header className="site-nav type-nav sticky top-0 z-40 shrink-0">
      <div className="site-nav-pill grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
        <Link
          href="/#work"
          className="min-w-0 truncate text-black/45 transition-opacity hover:opacity-60"
        >
          ← Back to Work
        </Link>

        <Link
          href="/"
          className="whitespace-nowrap transition-opacity hover:opacity-60 md:justify-self-center"
        >
          Lanting • Design
        </Link>

        <nav className="hidden justify-self-end md:flex md:gap-10">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>
    </header>
  );
}
