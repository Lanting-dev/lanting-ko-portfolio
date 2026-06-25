"use client";

import { useEffect, useState } from "react";

/** Scroll rhythm HUD — enable with `?scroll-debug=1` or `localStorage.scrollDebug = "1"`. */
export function useScrollDebugEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scroll-debug") === "1") {
      localStorage.setItem("scrollDebug", "1");
    }
    if (params.get("scroll-debug") === "0") {
      localStorage.removeItem("scrollDebug");
    }

    setEnabled(
      params.get("scroll-debug") === "1" ||
        localStorage.getItem("scrollDebug") === "1",
    );
  }, []);

  return enabled;
}
