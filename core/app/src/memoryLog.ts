// Course memory writes that never lose a version (identical in both apps). Every replacement of
// profile.memory first keeps the text it replaces in profile/memlog/<ts>, and the update after a
// lesson re-reads the memory from the db before it starts and again before it writes, so an edit
// made meanwhile (by hand, or in another tab) is never overwritten by an update built on an older text.
import type { Runtime, Store } from "./runtime";
import type { StoredMessage } from "./types";

type Update = (rt: Runtime, memory: string, answer: StoredMessage, request: string, where: string) => Promise<string | null>;

/** Replaces the memory with `next`, keeping `prev` in the version log first (no log, no write). */
export async function saveMemoryVersion(store: Store, prev: string, next: string, reason: string) {
  if (prev === next) return;
  if (prev.trim()) await store.logMemory({ memory: prev, reason });
  await store.setMemory(next);
}

/**
 * The memory update after a lesson or a graded quiz. `fallback` is the memory the page holds,
 * used only when the db cannot be read. Returns the memory now stored, or null when the update
 * produced nothing.
 */
export async function updateMemorySafely(o: { rt: Runtime; update: Update; fallback: string; answer: StoredMessage; request: string; where: string }) {
  const { rt, update } = o;
  const store = rt.store;
  const read = async () => (store ? await store.getMemory().catch(() => null) : null) ?? o.fallback;
  let base = await read();
  let next: string | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    next = await update(rt, base, o.answer, o.request, o.where);
    if (!next) return null;
    if (!store) return next;
    const now = await read();
    if (now === base) {
      await saveMemoryVersion(store, base, next, `לפני העדכון אחרי ${o.where}`);
      return next;
    }
    // the memory changed while the update was written: write the update again on the new text
    base = now;
  }
  // it changed again: the stored text stays, and the proposed update is kept in the log
  if (next) await store!.logMemory({ memory: next, reason: `עדכון שלא הוחל כי הזיכרון השתנה בזמן הכתיבה (${o.where})` });
  return base;
}
