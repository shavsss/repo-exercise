// The case work of the open lesson (caseDoc.ts), kept in profile/cases/<module>__<lesson>: one document per lesson,
// saved a moment after each change (like level3.ts), with a copy in the browser for a view without a store. The app
// sets the scope of the open lesson; the card in the lesson and the room read the same copy. Same file in both apps.
import { useSyncExternalStore } from "react";
import { emptyDoc, fitCase, type CaseDoc } from "./caseDoc";

interface CaseStoreApi {
  loadCase(key: string): Promise<Record<string, unknown> | null>;
  saveCase(key: string, data: Record<string, unknown>): Promise<void>;
}

let store: CaseStoreApi | null = null;
let scopeKey = "";
let doc: CaseDoc | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let pending: (() => void) | undefined;
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

function readLocal(key: string): CaseDoc | null {
  try {
    return JSON.parse(localStorage.getItem(`case:${key}`) ?? "null");
  } catch {
    return null;
  }
}

/** The open lesson ("<module>__<lesson>", or "" for none) and the db store, set by the app. */
export function setCaseScope(s: CaseStoreApi | null, key: string) {
  if (key === scopeKey && s === store) return;
  if (timer && key !== scopeKey) {
    clearTimeout(timer);
    pending?.();
  }
  store = s;
  scopeKey = key;
  doc = key ? readLocal(key) : null;
  notify();
  if (!s || !key) return;
  s.loadCase(key)
    .then((d) => {
      if (key !== scopeKey || !d?.stages) return;
      // the newer of the two copies wins
      if (!doc || Number(d.updatedAt ?? 0) >= doc.updatedAt) {
        doc = d as unknown as CaseDoc;
        notify();
      }
    })
    .catch(() => {});
}

/** Changes the open lesson's case work; `base` names the case when nothing is kept yet. */
export function updateCase(base: Pick<CaseDoc, "caseId" | "title">, f: (d: CaseDoc) => CaseDoc) {
  const cur = doc && doc.caseId === base.caseId ? doc : emptyDoc({ id: base.caseId, title: base.title });
  doc = { ...f(cur), updatedAt: Date.now() };
  notify();
  const key = scopeKey;
  if (!key) return;
  const snap = fitCase(doc);
  try {
    localStorage.setItem(`case:${key}`, JSON.stringify(snap));
  } catch {
    /* the db copy is the one that counts */
  }
  clearTimeout(timer);
  const s = store;
  if (!s) return;
  pending = () => {
    timer = undefined;
    pending = undefined;
    s.saveCase(key, snap as unknown as Record<string, unknown>).catch(() => {});
  };
  timer = setTimeout(pending, 800);
}

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

/** The work as it is now, between renders (a turn that follows a change reads it here). */
export function peekCase(caseId: string): CaseDoc | null {
  return doc && doc.caseId === caseId ? doc : null;
}

/** The open lesson's case work for one case (null when none is kept). */
export function useCaseDoc(caseId: string): CaseDoc | null {
  const d = useSyncExternalStore(subscribe, () => doc);
  return d && d.caseId === caseId ? d : null;
}
