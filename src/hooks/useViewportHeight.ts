"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerHeight;
}

function getServerSnapshot() {
  return 900;
}

export function useViewportHeight(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
