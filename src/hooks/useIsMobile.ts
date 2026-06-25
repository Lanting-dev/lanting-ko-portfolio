"use client";

import { useSyncExternalStore } from "react";
import { isMobileViewport } from "@/lib/browser/isMobile";

const QUERY = "(max-width: 768px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobileViewport(): boolean {
  return useIsMobile();
}

/** Imperative check (event handlers, canvas layout). */
export { isMobileViewport };
