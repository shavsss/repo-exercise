import { useSyncExternalStore } from "react";

export type ThemePref = "system" | "light" | "dark";
const KEY = "study-lab:theme";
const listeners = new Set<() => void>();
const media = window.matchMedia("(prefers-color-scheme: dark)");

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

let pref: ThemePref = readPref();
let snapshot = compute();

function compute() {
  return { pref, dark: pref === "dark" || (pref === "system" && media.matches) };
}

function apply() {
  snapshot = compute();
  const root = document.documentElement;
  if (pref === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", pref);
  listeners.forEach((l) => l());
}

media.addEventListener("change", apply);
apply();

export function setTheme(next: ThemePref) {
  pref = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // not persisted
  }
  apply();
}

export function useTheme() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => snapshot,
  );
}
