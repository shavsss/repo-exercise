// The learner's own answers to the level-3 blocks (predict, errorhunt, verify, lab, decide), kept
// per lesson in profile/level3/<module>__<lesson> as { items: { <block key>: L3Answer }, updatedAt }.
// Additive: nothing else reads or changes these documents. The app sets the scope of the open
// lesson; a copy in the browser keeps the answers when there is no store. Identical in both apps.
import { useCallback, useSyncExternalStore } from "react";

export interface L3Answer {
  kind: string;
  /** the learner's prediction, finding or decision, in their words */
  text?: string;
  /** a predict block's 90% range */
  low?: string;
  high?: string;
  /** a verify block's ticked checks (indices) */
  checked?: number[];
  /** a lab task marked as done */
  done?: boolean;
  /** an errorhunt answer: the learner said there is no error */
  noError?: boolean;
  /** the reference answer was revealed */
  revealed?: boolean;
  at: number;
}

interface L3Store {
  loadLevel3(key: string): Promise<Record<string, unknown> | null>;
  saveLevel3(key: string, data: Record<string, unknown>): Promise<void>;
}

let store: L3Store | null = null;
let scopeKey = "";
let items: Record<string, L3Answer> = {};
let timer: ReturnType<typeof setTimeout> | undefined;
let pending: (() => void) | undefined;
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

function readLocal(key: string): Record<string, L3Answer> {
  try {
    return JSON.parse(localStorage.getItem(`l3:${key}`) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

/** The open lesson ("<module>__<lesson>", or "" for none) and the db store, set by the app. */
export function setLevel3Scope(s: L3Store | null, key: string) {
  if (key === scopeKey && s === store) return;
  if (timer && key !== scopeKey) {
    // a pending save of the lesson being left is written now, not dropped
    clearTimeout(timer);
    pending?.();
  }
  store = s;
  scopeKey = key;
  items = key ? readLocal(key) : {};
  notify();
  if (!s || !key) return;
  s.loadLevel3(key)
    .then((d) => {
      if (key !== scopeKey || !d?.items) return;
      // per block, the newer of the two copies wins
      const db = d.items as Record<string, L3Answer>;
      const merged = { ...items };
      for (const [k, v] of Object.entries(db)) if (!merged[k] || (v?.at ?? 0) >= (merged[k].at ?? 0)) merged[k] = v;
      items = merged;
      notify();
    })
    .catch(() => {});
}

function save(blockKey: string, patch: Partial<L3Answer> & { kind: string }) {
  items = { ...items, [blockKey]: { ...items[blockKey], ...patch, at: Date.now() } };
  notify();
  const key = scopeKey;
  if (!key) return; // no lesson open: kept in this view only
  try {
    localStorage.setItem(`l3:${key}`, JSON.stringify(items));
  } catch {
    /* the db copy below is the one that counts */
  }
  clearTimeout(timer);
  const s = store;
  const snap = items;
  if (!s) return;
  pending = () => {
    timer = undefined;
    pending = undefined;
    s.saveLevel3(key, { items: snap, updatedAt: Date.now() }).catch(() => {});
  };
  timer = setTimeout(pending, 600);
}

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

/** A short stable key for a block, from its kind and body. */
export function blockKey(kind: string, body: string) {
  let h = 5381;
  const s = `${kind}\n${body.trim()}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return `${kind}-${(h >>> 0).toString(36)}`;
}

/** The stored answer of one block, and a setter that merges into it. */
export function useL3(kind: string, key: string) {
  const answer = useSyncExternalStore(subscribe, () => items[key]);
  const set = useCallback((patch: Partial<L3Answer>) => save(key, { ...patch, kind }), [key, kind]);
  return { answer, set };
}
