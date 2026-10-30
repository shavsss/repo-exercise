import { useSyncExternalStore } from "react";

// Reading preferences for long lessons: typeface, text size, line spacing, column width
// and the reading surface. Kept in this browser and applied as data-attributes on the
// root, which the stylesheet reads. A per-browser convenience only.
export interface Reading {
  font: "plex" | "frank" | "assistant";
  size: "s" | "m" | "l" | "xl";
  space: "normal" | "airy";
  width: "narrow" | "medium" | "wide";
  surface: "theme" | "paper" | "warm" | "soft";
  /** focus: the map, the source rail and the composer's extras step aside */
  focus: "off" | "on";
  /** quiet interface sounds (sound.ts) */
  sound: "soft" | "off";
  /** how loud the sounds are, 0–100 */
  volume: number;
  /** background noise while reading, and the kind the dock button turns on */
  noise: "off" | "library" | "brown" | "pink" | "rain";
  noiseKind: "library" | "brown" | "pink" | "rain";
  /** how loud the background noise is, 0–100, apart from the sounds */
  noiseVolume: number;
  /** the lab's own pointer, or the system one */
  cursor: "lab" | "system";
  /** the room eases 3 dB down after 25 minutes of reading without typing (sound.ts) */
  focusNoise: "off" | "on";
  /** a quiet line at a part boundary after `breakAfter` minutes of reading (BreakLine.tsx) */
  breaks: "on" | "off";
  breakAfter: "45" | "60" | "75" | "90" | "120";
  /** settings version, for one-time migrations of old defaults */
  rv?: number;
}
export const DEFAULT_READING: Reading = { font: "plex", size: "m", space: "airy", width: "medium", surface: "theme", focus: "off", sound: "soft", volume: 94, noise: "library", noiseKind: "library", noiseVolume: 35, cursor: "lab", focusNoise: "off", breaks: "on", breakAfter: "75", rv: 2 };

const KEY = "core-lab:reading";
// which lab this is, for the code both labs share (the chimes' material in sound.ts, the day's keys in day.ts)
document.documentElement.dataset.lab = KEY.startsWith("eng") ? "eng" : "core";
const listeners = new Set<() => void>();
/** Round 5 (sound v2): what was still an old default becomes the learner's choice (volume 94, the library room). */
function migrate(saved: Partial<Reading>): Partial<Reading> {
  if ((saved.rv ?? 1) >= 2 || !Object.keys(saved).length) return saved;
  const next = { ...saved, rv: 2 };
  if (saved.volume === 60) next.volume = 94;
  if (saved.noiseKind === undefined || saved.noiseKind === "brown") next.noiseKind = "library";
  if (saved.noise === undefined || saved.noise === "off" || saved.noise === "brown") next.noise = "library";
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...DEFAULT_READING, ...next }));
  } catch {
    // migrated for this visit only
  }
  return next;
}
let current: Reading = (() => {
  try {
    return { ...DEFAULT_READING, ...migrate(JSON.parse(localStorage.getItem(KEY) ?? "{}")) };
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
  r.dataset.focus = current.focus;
  r.dataset.sound = current.sound;
  r.dataset.volume = String(current.volume);
  r.dataset.noise = current.noise;
  r.dataset.noiseVolume = String(current.noiseVolume);
  r.dataset.cursor = current.cursor;
  r.dataset.focusNoise = current.focusNoise;
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
