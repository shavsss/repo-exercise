// Exercises the learner marked as solved: a per-browser convenience, so storage
// failures (private mode, blocked storage) just mean nothing is remembered.
const KEY = "study-lab:solved";
const listeners = new Set<() => void>();

function read(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function isSolved(id: string) {
  return !!read()[id];
}

export function setSolved(id: string, on: boolean) {
  const all = read();
  if (on) all[id] = Date.now();
  else delete all[id];
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // not persisted
  }
  listeners.forEach((l) => l());
}

export function solvedCount() {
  return Object.keys(read()).length;
}

export function onSolvedChange(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}
