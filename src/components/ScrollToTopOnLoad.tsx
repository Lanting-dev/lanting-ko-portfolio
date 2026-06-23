"use client";

import { useLayoutEffect } from "react";

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Reset scroll on full page load / reload (disable browser scroll restoration). */
export function ScrollToTopOnLoad() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    scrollToTop();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) scrollToTop();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
