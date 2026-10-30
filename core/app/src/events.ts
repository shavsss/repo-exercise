// The learner's own record, next to the lessons: an append-only events log, the calibration of the
// think questions (how sure he was before the answer, and whether he was right), and the
// consultation cards of each lesson. Everything lives in new collections under the profile, so the
// older documents are never touched:
//   profile/events/<ts-rand>              one event, never rewritten
//   profile/calib/<question id>           the latest answer to one think question
//   profile/consults/<module>__<lesson>   { lessonKey, count, updatedAt }, with cards/<card id> below
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

/** Appends one event. Never awaited by the caller and never throws: the log must not slow the lesson. */
export function logEvent(type: EventType, place: LessonPlace | null, data: Record<string, unknown> = {}) {
  const ts = Date.now();
  const id = `${ts}-${Math.random().toString(36).slice(2, 7)}`;
  put(["events", id], { type, ts, moduleId: place?.moduleId ?? null, lesson: place?.lesson ?? null, ...data }).catch(() => {});
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

export async function loadCalib(id: string): Promise<CalibRecord | null> {
  try {
    return (await get(["calib", id])) as CalibRecord | null;
  } catch {
    return null;
  }
}

export async function saveCalib(rec: CalibRecord) {
  await put(["calib", rec.id], rec as unknown as Record<string, unknown>);
  window.dispatchEvent(new Event("calib:changed"));
}

export async function allCalib(): Promise<CalibRecord[]> {
  const p = await profile();
  if (!p) return [...local.entries()].filter(([k]) => k.startsWith("calib/")).map(([, v]) => v as unknown as CalibRecord);
  const s = await p.collection("calib").limit(5000).get();
  return s.docs.map((d) => d.data() as unknown as CalibRecord);
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

const CARD_BYTES = 180_000;

export async function loadConsults(lessonKey: string): Promise<ConsultCard[]> {
  const p = await profile();
  if (!p) return [...local.entries()].filter(([k]) => k.startsWith(`consults/${lessonKey}/cards/`)).map(([, v]) => v as unknown as ConsultCard);
  const s = await p.collection("consults").doc(lessonKey).collection("cards").limit(500).get();
  return s.docs.map((d) => ({ ...(d.data() as unknown as ConsultCard), id: d.id })).sort((a, b) => a.ts - b.ts);
}

export async function saveConsult(lessonKey: string, card: ConsultCard, count: number) {
  const c = clean(card);
  // a document holds at most 256 KiB: the oldest answers of a long thread are shortened first
  for (let i = 0; JSON.stringify(c).length > CARD_BYTES && i < c.turns.length - 1; i++) c.turns[i].a = c.turns[i].a.slice(0, 600) + "\n…";
  await put(["consults", lessonKey, "cards", card.id], c as unknown as Record<string, unknown>);
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
