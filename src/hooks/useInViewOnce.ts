"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

type UseInViewOnceOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

/** Fires once when the element scrolls into the viewport , no eager mount check. */
export function useInViewOnce<T extends Element>(
  options: UseInViewOnceOptions = {},
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const threshold = options.threshold ?? 0.4;
  const rootMargin = options.rootMargin ?? "0px 0px -8% 0px";

  useLayoutEffect(() => {
    if (inView) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, rootMargin, threshold]);

  return { ref, inView };
}
