// The learner's own record, next to the lessons: an append-only events log, the calibration of the
// think questions (how sure he was before the answer, and whether he was right), and the
// consultation cards of each lesson. Everything lives in new collections under the profile, so the
// older documents are never touched:
//   profile/events/<YYYY-MM-DD>           { day, entries: [...] }, the day's events (newest 500)
//   profile/calib/<module>__<lesson>      { lessonKey, items: { <question id>: record } }
//   profile/consults/<module>__<lesson>   { lessonKey, count, updatedAt }, with cards/pack-<n> below,
//                                         each { pack: true, cards: [...] } up to PACK_BYTES
// A db holds at most 25,000 documents, so each collection grows by days or lessons, not by clicks
// (docs/BUILD_GUIDE.md, "תקציב המסמכים"). The first format (profile/events/<ts-rand>, one event
// each; profile/calib/<question id>; consults/<key>/cards/<card id>, one card each) is still read.
// Reaches the store through the runtime directly (db and user), so the components that use it need
// no wiring; with no store (a preview, or no write access) it keeps everything in this view only.
// Same file in both labs.
import { createContext } from "react";

/* ---- a minimal shape of the db namespace (the full one is in runtime.ts) ---- */
interface Snap {
  id: string;
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}
interface Col {
  doc(id?: string): Doc;
  get(): Promise<{ docs: Snap[] }>;
  limit(n: number): Col;
}
interface Doc {
  id: string;
  get(): Promise<Snap>;
  set(d: Record<string, unknown>): Promise<void>;
  collection(p: string): Col;
}

/** UTF-8 size of a value as stored (a db document holds at most 256 KiB). */
export const jsonBytes = (v: unknown) => new TextEncoder().encode(JSON.stringify(v)).length;

let profileP: Promise<Doc | null> | null = null;
/** The learner's profile document, or null when this view has no store. */
function profile(): Promise<Doc | null> {
  profileP ??= (async () => {
    try {
      const use = window.claude?.use;
      if (!use) return null;
      const [db, user] = await Promise.all([use("db").catch(() => null), use("user").catch(() => null)]);
      const uid = db && user ? await user.id() : null;
      return db && uid ? (db.doc(`data/users/${uid}/profile`) as Doc) : null;
    } catch {
      return null;
    }
  })();
  return profileP;
}

const clean = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;
/** kept in this view when there is no store */
const local = new Map<string, Record<string, unknown>>();

async function put(path: [string, string] | [string, string, string, string], data: Record<string, unknown>) {
  const key = path.join("/");
  local.set(key, data);
  const p = await profile();
  if (!p) return;
  let ref = p.collection(path[0]).doc(path[1]);
  if (path.length === 4) ref = ref.collection(path[2]).doc(path[3]);
  await ref.set(clean(data));
}
async function get(path: [string, string]): Promise<Record<string, unknown> | null> {
  const p = await profile();
  if (!p) return local.get(path.join("/")) ?? null;
  const s = await p.collection(path[0]).doc(path[1]).get();
  return s.exists ? (s.data() ?? null) : null;
}
/** Read-modify-write of one document, one at a time per path in this view. */
const chains = new Map<string, Promise<unknown>>();
function modify(path: [string, string], f: (old: Record<string, unknown> | null) => Record<string, unknown>) {
  const key = path.join("/");
  const run = (chains.get(key) ?? Promise.resolve()).catch(() => {}).then(async () => put(path, f(await get(path))));
  chains.set(key, run);
  return run;
}

/** A short stable id for a text (FNV-1a, base 36). */
export function hashId(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}

/** Where the learner is: given to the lesson's blocks, so a think question knows its lesson. */
export interface LessonPlace {
  moduleId: string;
  lesson: number;
  title: string;
}
export const LessonPlaceCtx = createContext<LessonPlace | null>(null);

/* ---------------- the events log ---------------- */
export type EventType = "think.commit" | "think.grade" | "think.skip" | "think.reset" | "consult.ask" | "consult.more";

const EVENTS_PER_DAY = 500;
const dayOf = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
let pendingEvents: Record<string, unknown>[] = [];
let eventsTimer: ReturnType<typeof setTimeout> | null = null;
/** Writes the waiting events into their day's document (a few seconds after the first one). */
function flushEvents() {
  eventsTimer = null;
  const byDay = new Map<string, Record<string, unknown>[]>();
  for (const e of pendingEvents) byDay.set(dayOf(e.ts as number), [...(byDay.get(dayOf(e.ts as number)) ?? []), e]);
  pendingEvents = [];
  for (const [day, list] of byDay)
    modify(["events", day], (old) => {
      const prev = Array.isArray(old?.entries) ? (old!.entries as Record<string, unknown>[]) : [];
      const seen = new Set(prev.map((e) => e.id));
      return { day, entries: [...prev, ...list.filter((e) => !seen.has(e.id))].slice(-EVENTS_PER_DAY), updatedAt: Date.now() };
    }).catch(() => {});
}
if (typeof window !== "undefined") window.addEventListener("pagehide", () => eventsTimer && (clearTimeout(eventsTimer), flushEvents()));

/** Appends one event. Never awaited by the caller and never throws: the log must not slow the lesson. */
export function logEvent(type: EventType, place: LessonPlace | null, data: Record<string, unknown> = {}) {
  const ts = Date.now();
  const id = `${ts}-${Math.random().toString(36).slice(2, 7)}`;
  pendingEvents.push({ id, type, ts, moduleId: place?.moduleId ?? null, lesson: place?.lesson ?? null, ...data });
  eventsTimer ??= setTimeout(flushEvents, 3000);
}

/* ---------------- calibration of the think questions ---------------- */
/** 1 = guessing, 2 = fairly sure, 3 = sure */
export type Conf = 1 | 2 | 3;
export type Grade = "right" | "partial" | "wrong";
export const CONF_LABEL: Record<Conf, string> = { 1: "מנחש", 2: "די בטוח", 3: "בטוח" };
export const GRADE_LABEL: Record<Grade, string> = { right: "צדקתי", partial: "בחלקו", wrong: "טעיתי" };

export interface CalibRecord {
  id: string;
  moduleId: string;
  lesson: number;
  lessonTitle?: string;
  /** the question, short */
  q: string;
  /** what the learner wrote before the answer, if anything */
  answer?: string;
  conf: Conf;
  grade?: Grade;
  ts: number;
  gradedAt?: number;
}

export function thinkId(place: LessonPlace | null, question: string) {
  return `${place ? `${place.moduleId}__${place.lesson}__` : ""}${hashId(question.replace(/\s+/g, " ").trim())}`.replace(/\//g, "_");
}

/** The lesson document a question id is kept in: `<module>__<lesson>` (its prefix), or "misc". */
export const calibDocOf = (id: string) => /^(.+__-?\d+)__[^_]+$/.exec(id)?.[1] ?? "misc";

export async function loadCalib(id: string): Promise<CalibRecord | null> {
  try {
    const doc = await get(["calib", calibDocOf(id)]);
    const rec = (doc?.items as Record<string, CalibRecord> | undefined)?.[id];
    // the first format: one document per question
    return rec ?? ((await get(["calib", id])) as CalibRecord | null);
  } catch {
    return null;
  }
}

export async function saveCalib(rec: CalibRecord) {
  const key = calibDocOf(rec.id);
  await modify(["calib", key], (old) => ({ lessonKey: key, items: { ...((old?.items as object) ?? {}), [rec.id]: rec }, updatedAt: Date.now() }));
  window.dispatchEvent(new Event("calib:changed"));
}

/** The records of calib documents in either format, the newest answer per question. */
export function flattenCalib(docs: Record<string, unknown>[]): CalibRecord[] {
  const out = new Map<string, CalibRecord>();
  for (const d of docs) {
    const list = d.items && typeof d.items === "object" ? (Object.values(d.items) as CalibRecord[]) : d.conf ? [d as unknown as CalibRecord] : [];
    for (const r of list) if (!out.has(r.id) || (out.get(r.id)!.ts ?? 0) < (r.ts ?? 0)) out.set(r.id, r);
  }
  return [...out.values()];
}

export async function allCalib(): Promise<CalibRecord[]> {
  const p = await profile();
  if (!p) return flattenCalib([...local.entries()].filter(([k]) => k.startsWith("calib/")).map(([, v]) => v));
  const s = await p.collection("calib").limit(5000).get();
  return flattenCalib(s.docs.map((d) => d.data() ?? {}));
}

export type CalibTable = Record<Conf, Record<Grade | "open", number>>;
export function calibTable(list: CalibRecord[]): CalibTable {
  const t = { 1: { right: 0, partial: 0, wrong: 0, open: 0 }, 2: { right: 0, partial: 0, wrong: 0, open: 0 }, 3: { right: 0, partial: 0, wrong: 0, open: 0 } } as CalibTable;
  for (const r of list) if (t[r.conf]) t[r.conf][r.grade ?? "open"]++;
  return t;
}

/** One short paragraph for a tutor: where the learner was sure and wrong (the best places to look again). */
export function calibNote(list: CalibRecord[], moduleId?: string) {
  const hot = list.filter((r) => r.conf === 3 && r.grade === "wrong" && (!moduleId || r.moduleId === moduleId)).sort((a, b) => b.ts - a.ts);
  if (!hot.length) return "";
  return `שאלות think שבהן הלומד היה בטוח וטעה (מהחדשה):\n${hot
    .slice(0, 6)
    .map((r) => `- ${r.moduleId} שיעור ${r.lesson + 1}: ${r.q.slice(0, 140)}${r.answer ? ` (ענה: ${r.answer.slice(0, 100)})` : ""}`)
    .join("\n")}`;
}

/* ---------------- consultation cards ---------------- */
export type ConsultLevel = 0 | 1 | 2 | 3;
export type ConsultKind = "explain" | "why" | "example" | "check" | "ask";
export interface ConsultTurn {
  q: string;
  a: string;
  level: ConsultLevel;
  /** asked in the discussion mode */
  discuss?: boolean;
  model?: string;
  /** stopped at the level's length, and can be continued */
  cut?: boolean;
  ts: number;
}
export interface ConsultCard {
  id: string;
  /** a quote from the paragraph the card sits under */
  anchor: string;
  /** the marked text the question is about, if any */
  quote?: string;
  kind: ConsultKind;
  turns: ConsultTurn[];
  ts: number;
  updatedAt: number;
  /** put away by the learner: kept in the store, not shown */
  hidden?: boolean;
}

/** bytes of one card, and of one pack of cards (a document holds at most 256 KiB) */
const CARD_BYTES = 150_000;
const PACK_BYTES = 180_000;

/** Where each card of a lesson is kept: its pack (`pack-<n>`), or its own document (first format). */
interface CardPlace {
  doc: string;
  own: boolean;
}
const places = new Map<string, Map<string, CardPlace>>();
const packs = new Map<string, Map<string, ConsultCard[]>>();
const consultChains = new Map<string, Promise<unknown>>();

export async function loadConsults(lessonKey: string): Promise<ConsultCard[]> {
  const p = await profile();
  const prefix = `consults/${lessonKey}/cards/`;
  const docs = p
    ? (await p.collection("consults").doc(lessonKey).collection("cards").limit(500).get()).docs.map((d) => ({ id: d.id, data: d.data() ?? {} }))
    : [...local.entries()].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ id: k.slice(prefix.length), data: v }));
  const where = new Map<string, CardPlace>();
  const byPack = new Map<string, ConsultCard[]>();
  const out: ConsultCard[] = [];
  for (const d of docs) {
    if (Array.isArray(d.data.cards)) {
      const list = d.data.cards as ConsultCard[];
      byPack.set(d.id, list);
      for (const c of list) {
        where.set(c.id, { doc: d.id, own: false });
        out.push(c);
      }
    } else {
      where.set(d.id, { doc: d.id, own: true });
      out.push({ ...(d.data as unknown as ConsultCard), id: d.id });
    }
  }
  places.set(lessonKey, where);
  packs.set(lessonKey, byPack);
  return out.sort((a, b) => a.ts - b.ts);
}

/** Saves one card (writes of a lesson go one at a time, since a pack holds several cards). */
export function saveConsult(lessonKey: string, card: ConsultCard, count: number) {
  const run = (consultChains.get(lessonKey) ?? Promise.resolve()).catch(() => {}).then(() => writeConsult(lessonKey, card, count));
  consultChains.set(lessonKey, run);
  return run;
}

async function writeConsult(lessonKey: string, card: ConsultCard, count: number) {
  const c = clean(card);
  // a document holds at most 256 KiB: the oldest answers of a long thread are shortened first
  for (let i = 0; jsonBytes(c) > CARD_BYTES && i < c.turns.length - 1; i++) c.turns[i].a = c.turns[i].a.slice(0, 600) + "\n…";
  if (!places.has(lessonKey)) await loadConsults(lessonKey);
  const where = places.get(lessonKey)!;
  const byPack = packs.get(lessonKey)!;
  const at = where.get(c.id);
  const writePack = (id: string, list: ConsultCard[]) => {
    byPack.set(id, list);
    return put(["consults", lessonKey, "cards", id], { pack: true, cards: list, updatedAt: Date.now() });
  };
  if (at?.own) {
    // a card of the first format stays in its own document
    await put(["consults", lessonKey, "cards", c.id], c as unknown as Record<string, unknown>);
  } else {
    const inPack = at ? (byPack.get(at.doc) ?? []).map((x) => (x.id === c.id ? c : x)) : null;
    if (at && inPack && jsonBytes(inPack) <= PACK_BYTES) await writePack(at.doc, inPack);
    else {
      // a new card, or one that outgrew its pack: the first pack with room, or a new one
      const ids = [...byPack.keys()].filter((k) => /^pack-\d+$/.test(k)).sort((a, b) => +a.slice(5) - +b.slice(5));
      const room = ids.find((k) => k !== at?.doc && jsonBytes([...(byPack.get(k) ?? []), c]) <= PACK_BYTES);
      const target = room ?? `pack-${(ids.length ? +ids[ids.length - 1].slice(5) : 0) + 1}`;
      await writePack(target, [...(byPack.get(target) ?? []), c]);
      where.set(c.id, { doc: target, own: false });
      if (at) await writePack(at.doc, (byPack.get(at.doc) ?? []).filter((x) => x.id !== c.id));
    }
  }
  await put(["consults", lessonKey], { lessonKey, count, updatedAt: Date.now() });
}

/** Opens a consultation card from anywhere in the lesson (a think question, for example). */
export interface ConsultRequest {
  /** text inside the paragraph or block the card goes under */
  anchor: string;
  kind: ConsultKind;
  q: string;
  quote?: string;
  level?: ConsultLevel;
  /** the element the request comes from: the card goes under its block */
  el?: Element | null;
}
export function requestConsult(r: ConsultRequest) {
  window.dispatchEvent(new CustomEvent<ConsultRequest>("consult:open", { detail: r }));
}
