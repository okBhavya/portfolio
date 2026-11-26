"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
let sharedMql: MediaQueryList | null = null;
const listeners = new Set<() => void>();

function getMql(): MediaQueryList | null {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return null;
  }
  if (!sharedMql) {
    sharedMql = window.matchMedia(QUERY);
  }
  return sharedMql;
}

function handleChange() {
  for (const cb of listeners) cb();
}

function subscribe(callback: () => void): () => void {
  const mql = getMql();
  if (!mql) return () => {};
  if (listeners.size === 0) {
    mql.addEventListener("change", handleChange);
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      mql.removeEventListener("change", handleChange);
    }
  };
}

function getSnapshot(): boolean {
  return getMql()?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Tracks user reduced-motion preference with a single shared matchMedia listener. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
