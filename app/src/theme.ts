import { useSyncExternalStore } from "react";

// The page follows the viewer's theme: an explicit choice arrives as data-theme on
// the root element; otherwise the system preference decides.
const listeners = new Set<() => void>();
const media = window.matchMedia("(prefers-color-scheme: dark)");

function compute() {
  const attr = document.documentElement.getAttribute("data-theme");
  return { dark: attr === "dark" || (attr !== "light" && media.matches) };
}

let snapshot = compute();
function update() {
  const next = compute();
  if (next.dark === snapshot.dark) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

media.addEventListener("change", update);
new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

export function useTheme() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => snapshot,
  );
}
