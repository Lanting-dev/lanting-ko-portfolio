"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
type TocItem = {
  id: string;
  label: string;
};

type CaseStudyTocProps = {
  items: readonly TocItem[];
};

export function CaseStudyToc({ items }: CaseStudyTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "problem");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0];
        if (top?.target.id) {
          setActiveId(top.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    for (const section of sections) {
      observerRef.current.observe(section);
    }

    return () => observerRef.current?.disconnect();
  }, [items]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;

      setActiveId(id);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  return (
    <nav
      className="case-study-toc"
      aria-label="Case study sections"
    >
      <p className="type-nav mb-4 text-black/45">Sections</p>
      <ol className="case-study-toc-list">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`case-study-toc-link type-nav ${
                  isActive ? "is-active" : ""
                }`.trim()}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => handleClick(event, id)}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
