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
  noise: "off" | "brown" | "pink" | "rain";
  noiseKind: "brown" | "pink" | "rain";
  /** how loud the background noise is, 0–100, apart from the sounds */
  noiseVolume: number;
  /** the lab's own pointer, or the system one */
  cursor: "lab" | "system";
}
export const DEFAULT_READING: Reading = { font: "plex", size: "l", space: "airy", width: "medium", surface: "theme", focus: "off", sound: "soft", volume: 60, noise: "off", noiseKind: "brown", noiseVolume: 35, cursor: "lab" };

const KEY = "core-lab:reading";
const listeners = new Set<() => void>();
/** Settings saved before the defaults changed (round 5: 18.5px text) keep every value the reader
 *  picked; a value still at the old default moves to the new one. `touched` lists the keys the
 *  reader set from now on, so a later change of defaults can tell the two apart. */
type Saved = Partial<Reading> & { v?: number; touched?: (keyof Reading)[] };
const OLD_DEFAULTS: Partial<Reading> = { size: "m" };
let touched: (keyof Reading)[] = [];
let current: Reading = (() => {
  try {
    const saved: Saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    touched = Array.isArray(saved.touched) ? saved.touched : [];
    const { v, touched: _t, ...picked } = saved;
    if (!v)
      for (const k of Object.keys(OLD_DEFAULTS) as (keyof Reading)[])
        if (picked[k] === OLD_DEFAULTS[k] && !touched.includes(k)) delete picked[k];
    return { ...DEFAULT_READING, ...picked };
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
}
apply();

export function setReading(patch: Partial<Reading>) {
  current = { ...current, ...patch };
  for (const k of Object.keys(patch) as (keyof Reading)[]) if (!touched.includes(k)) touched.push(k);
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...current, v: 2, touched }));
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
