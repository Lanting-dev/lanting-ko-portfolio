"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const hasTrackedInitialPageView = useRef(false);

  useEffect(() => {
    if (!pathname) return;

    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      return;
    }

    const queryString = window.location.search.replace(/^\?/, "");
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    sendGAEvent("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
    });
  }, [pathname]);

  return null;
}
