import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Runtime } from "./runtime";
import type { LibraryIndex, Module } from "./library";
import { composeLesson, updateMemory, type PartPlan } from "./tutor";
import type { Activity, Effort, LessonNote, ModuleProgress, NoteKind, StoredMessage } from "./types";

// The next lesson is written while the learner is away: at a break and at "close the day"
// (docs/research/round5/ux, r5-prefetch). It is the same lesson the "כתוב את שיעור" button writes, in the same
// conversation, saved the same way as a draft (draft: true with plan and partsDone, after the plan, after every
// part and every 8 s of text), so a closed tab leaves a draft that "המשך" continues in place (resumeLast).
// Only a lesson with no conversation yet is written; anything already there is left alone. When it is done the
// message carries `prefetched: true`; the lesson is marked learned and the course memory updated only when the
// learner opens it (useSettlePrefetched), not while he is away. All fields are additive. Identical in both labs.

export type PrefetchedMessage = StoredMessage & {
  /** written ahead, at a break or at the close of the day */
  prefetched?: boolean;
  /** when the learner first opened it (the lesson was then marked learned) */
  prefetchSeen?: number;
};

interface PrefetchState {
  running: boolean;
  /** `${moduleId}:${lesson}` being written */
  key: string;
  convId?: string;
  /** the answer as it is written, for following it live when the learner opens that lesson */
  live: PrefetchedMessage | null;
  /** bumped when a prefetch ends; doneConv is its conversation */
  seq: number;
  doneConv?: string;
}

let state: PrefetchState = { running: false, key: "", live: null, seq: 0 };
const listeners = new Set<() => void>();
const set = (patch: Partial<PrefetchState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
let ctl: AbortController | null = null;

export function usePrefetch() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => state,
  );
}

const SAVE_EVERY = 8000;
export const lessonRequest = (m: Module, idx: number, title: string) => `כתוב את שיעור ${idx + 1} במודול ${m.id}: ${title}.`;

/** The lesson to write ahead: the one after the open lesson (or the open one, if it is not started), never one already started. */
export function nextToPrefetch(prog: ModuleProgress | undefined, idx: number | undefined): number | null {
  const lessons = prog?.lessons;
  if (!lessons?.length) return null;
  const done = new Set(prog?.done ?? []);
  const started = (i: number) => done.has(i) || !!prog?.convs?.[String(i)];
  let i: number;
  if (idx === undefined || idx < 0) {
    i = 0;
    while (i < lessons.length && started(i)) i++;
  } else i = started(idx) ? idx + 1 : idx;
  return i < lessons.length && !started(i) ? i : null;
}

interface Job {
  rt: Runtime;
  m: Module;
  idx: number;
  memory: string;
  effort: Effort;
  done: string[];
  notes: LessonNote[];
  getProg: () => ModuleProgress | undefined;
  saveModule: (id: string, patch: Partial<ModuleProgress>) => Promise<void>;
  onNote: (kind: NoteKind, text: string, addTo?: string) => Promise<void> | void;
}

async function run(j: Job) {
  const { rt, m, idx } = j;
  const store = rt.store;
  const prog = j.getProg();
  const spec = prog?.lessons?.[idx];
  if (state.running || !rt.sample || !store || !spec) return;
  const key = `${m.id}:${idx}`;
  ctl = new AbortController();
  const signal = ctl.signal;
  const activity: Activity[] = [];
  let answer: PrefetchedMessage = { role: "assistant", text: "", mode: "lesson", ts: Date.now(), activity, draft: true, prefetched: true, status: "מתכנן את השיעור הבא" };
  set({ running: true, key, convId: undefined, live: answer });
  let cid = prog?.convs?.[String(idx)];
  let msgId = "";
  let chain: Promise<void> = Promise.resolve();
  let lastSave = 0;
  let checkpointText = "";
  const save = (patch: Partial<PrefetchedMessage>, force = false) => {
    answer = { ...answer, ...patch };
    set({ live: { ...answer, activity: [...activity] } });
    if (!cid || !msgId || (!force && Date.now() - lastSave < SAVE_EVERY)) return;
    lastSave = Date.now();
    const snapshot = { ...answer, activity: [...activity] };
    const at = cid;
    chain = chain.then(() => store.saveMessage(at, msgId, snapshot).catch(() => {}));
  };
  try {
    if (cid) {
      // something is already there: it belongs to the learner (and to resumeLast)
      if ((await store.loadMessages(cid)).length) return;
    } else {
      const created = await store.createConversation(`${m.id} · שיעור ${idx + 1}: ${spec.title}`.slice(0, 90), m.id, idx);
      // the learner may have started this lesson meanwhile
      if (j.getProg()?.convs?.[String(idx)]) return;
      cid = created.id;
      await j.saveModule(m.id, { convs: { ...(j.getProg()?.convs ?? {}), [String(idx)]: cid } });
    }
    set({ convId: cid });
    const userMsg: StoredMessage = { role: "user", text: lessonRequest(m, idx, spec.title), mode: "lesson", ts: Date.now() };
    await store.saveMessage(cid, store.newMessageId(cid), userMsg);
    msgId = store.newMessageId(cid);
    answer = { ...answer, ts: Date.now(), id: msgId };
    save({}, true);
    const res = await composeLesson({
      rt,
      history: [],
      effort: j.effort,
      module: m,
      lessons: j.getProg()?.lessons,
      lessonIdx: idx,
      memory: j.memory,
      notes: j.notes.filter((n) => n.moduleId === m.id && n.lesson === idx),
      allNotes: j.notes.filter((n) => !(n.moduleId === m.id && n.lesson === idx)),
      done: j.done,
      signal,
      text: userMsg.text,
      cb: {
        onText: (t) => save({ text: t }),
        onActivity: (a) => {
          activity.push(a);
          set({ live: { ...answer, activity: [...activity] } });
        },
        onStatus: (status) => save({ status }),
        onCheckpoint: (plan: PartPlan, partsDone: number, text: string) => {
          checkpointText = text;
          save({ plan, partsDone, text }, true);
        },
        onNote: j.onNote,
      },
    });
    answer = { ...answer, text: res.text, model: res.model, draft: undefined, plan: undefined, partsDone: undefined, status: undefined, activity };
  } catch (err) {
    const e = err as { code?: string };
    // keep plan and partsDone, and only the text of the finished parts, so "המשך" goes on from the last part
    answer = { ...answer, text: e.code === "refused" ? "" : checkpointText, interrupted: true, draft: undefined, status: undefined, activity };
  } finally {
    await chain;
    if (cid && msgId) {
      try {
        if (answer.text || answer.plan) await store.saveMessage(cid, msgId, answer);
        await store.touch(cid, 2);
      } catch {
        // the draft saved on the way stays
      }
    }
    ctl = null;
    set({ running: false, live: null, seq: state.seq + 1, doneConv: cid });
  }
}

/** Stops a running prefetch (its draft stays, and continues with "המשך"). */
export function stopPrefetch() {
  ctl?.abort();
}

/**
 * Asks for the next lesson to be written ahead. The request waits until no answer and no memory update is running,
 * so the lesson is written with the memory of the lesson just finished.
 */
export function usePrefetchDriver(o: {
  rt: Runtime | null;
  index: LibraryIndex | null;
  mods: { current: Record<string, ModuleProgress> };
  notes: { current: LessonNote[] };
  selection: { moduleId: string; lesson?: number } | null;
  fallback: () => { moduleId: string; lesson?: number } | null;
  memory: string;
  memoryBusy: boolean;
  busy: boolean;
  effort: Effort;
  done: string[];
  saveModule: (id: string, patch: Partial<ModuleProgress>) => Promise<void>;
  onNote: (m: Module, idx: number) => (kind: NoteKind, text: string, addTo?: string) => Promise<void> | void;
}) {
  const [want, setWant] = useState<{ moduleId: string; lesson?: number } | null>(null);
  const live = useRef(o);
  live.current = o;
  useEffect(() => {
    const c = live.current;
    if (!want || c.busy || c.memoryBusy || !c.rt?.store || !c.index) return;
    setWant(null);
    const m = c.index.modules.find((x) => x.id === want.moduleId);
    const idx = m ? nextToPrefetch(c.mods.current[m.id], want.lesson) : null;
    if (!m || idx === null) return;
    void run({
      rt: c.rt,
      m,
      idx,
      memory: c.memory,
      effort: c.effort,
      done: c.done,
      notes: c.notes.current,
      getProg: () => live.current.mods.current[m.id],
      saveModule: c.saveModule,
      onNote: c.onNote(m, idx),
    });
  }, [want, o.busy, o.memoryBusy, o.rt, o.index]);
  /** what will be written, for the line that says so (null when nothing would be) */
  const target = useCallback(() => {
    const c = live.current;
    const sel = c.selection ?? c.fallback();
    const m = sel && c.index?.modules.find((x) => x.id === sel.moduleId);
    const idx = m ? nextToPrefetch(c.mods.current[m.id], sel?.lesson) : null;
    return m && idx !== null && c.rt?.sample && c.rt.store ? { m, idx, title: c.mods.current[m.id]?.lessons?.[idx]?.title ?? "" } : null;
  }, []);
  const request = useCallback(() => {
    const c = live.current;
    const sel = c.selection ?? c.fallback();
    if (sel && target()) setWant({ ...sel });
  }, [target]);
  return { request, target };
}

/**
 * A lesson written ahead becomes the learner's when he opens it: it is marked learned and the course memory is
 * updated then, once (prefetchSeen), as after a lesson written in front of him.
 */
export function useSettlePrefetched(o: {
  rt: Runtime | null;
  convId: string | null;
  messages: StoredMessage[];
  busy: boolean;
  module: Module | undefined;
  idx: number | undefined;
  prog: ModuleProgress | undefined;
  memory: string;
  finish: (m: Module, idx: number) => Promise<void>;
  onMemory: (next: string) => Promise<void>;
  setMemoryBusy: (b: boolean) => void;
}) {
  const seen = useRef(new Set<string>());
  useEffect(() => {
    const { rt, convId, messages, busy, module: m, idx, prog } = o;
    const last = messages[messages.length - 1] as PrefetchedMessage | undefined;
    const user = messages[messages.length - 2];
    if (!rt?.store || !convId || busy || !m || idx === undefined || idx < 0 || !last?.id) return;
    if (!last.prefetched || last.prefetchSeen || last.draft || last.interrupted || !last.text || last.role !== "assistant") return;
    if (state.running && state.convId === convId) return;
    if (seen.current.has(last.id)) return;
    seen.current.add(last.id);
    const store = rt.store;
    void (async () => {
      try {
        await store.saveMessage(convId, last.id!, { ...last, prefetchSeen: Date.now() } as StoredMessage);
      } catch {
        // marked again next time
      }
      if ((prog?.done ?? []).includes(idx)) return;
      await o.finish(m, idx);
      o.setMemoryBusy(true);
      try {
        const where = `${m.id} «${m.title}», שיעור ${idx + 1} מתוך ${prog?.lessons?.length ?? "?"}`;
        const next = await updateMemory(rt, o.memory, last, user?.text ?? "", where);
        if (next) await o.onMemory(next);
      } catch {
        // the memory can be updated by hand from its panel
      } finally {
        o.setMemoryBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.messages, o.busy, o.convId]);
}
