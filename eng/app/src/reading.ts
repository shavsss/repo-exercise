import { useSyncExternalStore } from "react";

// Reading preferences for long lessons: typeface, text size, line spacing, column width
// and the reading surface. Kept in this browser and applied as data-attributes on the
// root, which the stylesheet reads. A per-browser convenience only.
export interface Reading {
  font: "plex" | "frank" | "assistant";
  size: "s" | "m" | "l" | "xl";
  space: "normal" | "airy";
  width: "narrow" | "medium" | "wide";
  surface: "theme" | "paper" | "soft";
}
export const DEFAULT_READING: Reading = { font: "plex", size: "m", space: "airy", width: "medium", surface: "theme" };

const KEY = "eng-lab:reading";
const listeners = new Set<() => void>();
let current: Reading = (() => {
  try {
    return { ...DEFAULT_READING, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULT_READING;
  }
})();

function apply() {
  const r = document.documentElement;
  r.dataset.readFont = current.font;
  r.dataset.readSize = current.size;
  r.dataset.readSpace = current.space;
  r.dataset.readWidth = current.width;
  r.dataset.surface = current.surface;
}
apply();

export function setReading(patch: Partial<Reading>) {
  current = { ...current, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // kept for this visit only
  }
  apply();
  listeners.forEach((l) => l());
}

export function useReading() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => current,
  );
}
