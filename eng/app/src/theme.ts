import { useSyncExternalStore } from "react";

// The page follows the viewer's theme (data-theme on the root, set by claude.ai, or
// the system preference). The in-app switch overrides it: the choice is kept in this
// browser and written to data-theme, and re-applied if the host changes the attribute.
const KEY = "eng-lab:theme";
const listeners = new Set<() => void>();
const media = window.matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;

function readOverride(): "light" | "dark" | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

let override = readOverride();
/** what the host asked for, before our override */
let hostAttr = root.getAttribute("data-theme");

function compute() {
  const attr = override ?? hostAttr;
  return { dark: attr === "dark" || (attr !== "light" && media.matches), overridden: !!override };
}

let snapshot = compute();
function update() {
  const next = compute();
  if (next.dark === snapshot.dark && next.overridden === snapshot.overridden) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

function apply() {
  if (override && root.getAttribute("data-theme") !== override) root.setAttribute("data-theme", override);
}
apply();

media.addEventListener("change", update);
new MutationObserver(() => {
  const attr = root.getAttribute("data-theme");
  if (attr !== override) {
    hostAttr = attr;
    apply();
  }
  update();
}).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

/** Flips between light and dark, overriding the system and host setting. */
export function toggleTheme() {
  override = snapshot.dark ? "light" : "dark";
  try {
    localStorage.setItem(KEY, override);
  } catch {
    // kept for this visit only
  }
  apply();
  update();
}

/** Back to the host/system theme. */
export function followSystemTheme() {
  override = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing stored
  }
  if (hostAttr) root.setAttribute("data-theme", hostAttr);
  else root.removeAttribute("data-theme");
  update();
}

export function useTheme() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => snapshot,
  );
}
