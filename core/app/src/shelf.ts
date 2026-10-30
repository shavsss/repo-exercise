import type { Store } from "./runtime";
import type { Module } from "./library";
import type { LessonSpec, StoredMessage } from "./types";
import { lessonRequest, type PrefetchedMessage } from "./prefetch";

// The ready shelf (docs/SHELF_SCHEMA.md): a nightly session writes the next lessons ahead into
// profile/shelf/<moduleId>__<lessonIdx>. When the learner opens such a lesson and it has no conversation yet,
// the page offers it; taking it creates the lesson's conversation exactly as a lesson written ahead in the page
// (prefetch.ts: a user turn and a finished assistant lesson with `prefetched: true`), so useSettlePrefetched marks
// it learned and updates the course memory, and everything after it (follow-ups, notes, resume) is unchanged.
// The shelf document is then marked adopted, never deleted. Identical in both labs.

export interface ShelfVerify {
  verdict: "pass" | "pass-with-notes";
  /** the depth gate: central results, depth units and the 2.5 sections, as the verifier counted them */
  depth?: { results?: number; units?: number; l25Missing?: string[]; words?: number };
  facts?: { checked?: number; fixed?: number };
  sources?: { checked?: number; unsupported?: number };
  refusalSafe?: boolean;
  /** Hebrew, one line each: what the independent check changed or noted */
  notes?: string[];
}

export interface ShelfDoc {
  v: 1;
  app: "core" | "eng";
  moduleId: string;
  lesson: number;
  /** the lesson plan entry it was written for (profile/modules/<id>.lessons[lesson]); a different plan hides it */
  spec: Pick<LessonSpec, "title" | "sources">;
  title: string;
  /** the lesson Markdown, or its first part when `parts` > 0 */
  text: string;
  /** continuation documents in shelf/<id>/more/1..parts, each { text } */
  parts?: number;
  plan?: unknown;
  words?: number;
  createdAt: number;
  pipeline?: string;
  verify?: ShelfVerify;
  status?: "ready" | "adopted" | "superseded";
  adoptedAt?: number;
  convId?: string;
}

/** What the adopted message carries about where it came from. */
export type ShelfMessage = PrefetchedMessage & { shelf?: { id: string; createdAt: number; verdict?: string } };

export const shelfId = (moduleId: string, idx: number) => `${moduleId}__${idx}`;

const sameSources = (a: LessonSpec["sources"] = [], b: LessonSpec["sources"] = []) =>
  a.length === b.length && a.every((s, i) => s.doc === b[i].doc && s.pages[0] === b[i].pages[0] && s.pages[1] === b[i].pages[1]);

/** A shelf document that can be offered for this lesson: ready, and written for the lesson as it is planned now. */
export function fitsLesson(d: ShelfDoc | null | undefined, spec: LessonSpec | undefined): d is ShelfDoc {
  if (!d || !spec || !d.text || (d.status && d.status !== "ready")) return false;
  return (d.spec?.title ?? d.title).trim() === spec.title.trim() && (!d.spec?.sources || sameSources(d.spec.sources, spec.sources));
}

export async function loadShelf(store: Store, moduleId: string, idx: number): Promise<ShelfDoc | null> {
  try {
    const s = await store.sub("shelf").doc(shelfId(moduleId, idx)).get();
    return s.exists ? (s.data() as ShelfDoc) : null;
  } catch {
    return null;
  }
}

async function fullText(store: Store, id: string, d: ShelfDoc) {
  const n = Number(d.parts ?? 0);
  if (!n) return d.text;
  const more = store.sub("shelf").doc(id).collection("more");
  const parts = await Promise.all(Array.from({ length: n }, (_, i) => more.doc(String(i + 1)).get()));
  if (parts.some((p) => !p.exists)) throw new Error("shelf part missing");
  return d.text + parts.map((p) => String(p.data()?.text ?? "")).join("");
}

/**
 * Turns the shelf lesson into the lesson's conversation: the same two messages a lesson written ahead has.
 * Returns the conversation id and its messages (with ids), for the page to show at once.
 */
export async function adoptShelf(store: Store, m: Module, idx: number, d: ShelfDoc): Promise<{ cid: string; msgs: StoredMessage[] }> {
  const id = shelfId(m.id, idx);
  const text = await fullText(store, id, d);
  const title = d.spec?.title ?? d.title;
  const conv = await store.createConversation(`${m.id} · שיעור ${idx + 1}: ${title}`.slice(0, 90), m.id, idx);
  const now = Date.now();
  const user: StoredMessage = { role: "user", text: lessonRequest(m, idx, title), mode: "lesson", ts: now, id: store.newMessageId(conv.id) };
  const answer: ShelfMessage = {
    role: "assistant",
    text,
    mode: "lesson",
    ts: now + 1,
    id: store.newMessageId(conv.id),
    model: `shelf · ${d.pipeline ?? "factory"}`,
    prefetched: true,
    shelf: { id, createdAt: d.createdAt, verdict: d.verify?.verdict },
  };
  await store.saveMessage(conv.id, user.id!, user);
  await store.saveMessage(conv.id, answer.id!, answer);
  await store.touch(conv.id, 2);
  // the shelf keeps the lesson, marked as taken (the nightly session never writes over an adopted one)
  await store
    .sub("shelf")
    .doc(id)
    .update({ status: "adopted", adoptedAt: Date.now(), convId: conv.id })
    .catch(() => {});
  return { cid: conv.id, msgs: [user, answer] };
}
