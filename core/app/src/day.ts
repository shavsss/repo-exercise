import { useEffect, useSyncExternalStore } from "react";
import type { ConvMeta, Runtime, Store } from "./runtime";
import type { ModuleProgress, StoredMessage } from "./types";

// The study day, counted quietly and never shown (docs/research/round5/ux/F2_cognitive_session.md, M1/M5).
// Reading time counts only while the page is visible and something happened in the last 2 minutes (a scroll, a
// key, a touch). It feeds the quiet break line (BreakLine.tsx), closing the day (CloseDay.tsx) and the morning
// card (MorningCard.tsx). Kept in this browser for the running count, and in profile/days/<YYYY-MM-DD> in the db
// (additive: a new collection). Identical in both labs; the lab comes from data-lab on the root.

const lab = () => (document.documentElement.dataset.lab === "eng" ? "eng-lab" : "core-lab");
const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export interface DayStop {
  moduleId: string;
  lesson?: number;
  label: string;
}
export interface RecallQuestion {
  q: string;
  a: string;
  src: string;
}
/** profile/days/<date> */
export interface DayDoc {
  date: string;
  /** seconds of reading with activity, counted quietly, never shown */
  activeSec: number;
  firstAt?: number;
  lastAt?: number;
  /** when breaks were taken */
  breaks?: number[];
  /** break lines answered with "one more part" (N3: after three, silence for the day) */
  declined?: number;
  /** lessons opened today, in order */
  seen?: { moduleId: string; lesson: number; title?: string; at: number }[];
  /** closing the day */
  closedAt?: number;
  next?: string;
  stop?: DayStop;
  recall?: RecallQuestion[];
}

interface Local {
  date: string;
  activeSec: number;
  sinceBreakSec: number;
  lastActivity: number;
  snoozeUntil: number;
  declined: number;
  onBreak: number;
  morningSkipped?: string;
}

const TICK = 15;
const IDLE_MS = 120_000;
/** away this long counts as a break by itself */
const NATURAL_BREAK_MS = 10 * 60_000;

function readLocal(): Local | null {
  try {
    return JSON.parse(localStorage.getItem(`${lab()}:day`) ?? "null");
  } catch {
    return null;
  }
}
const fresh = (date: string): Local => ({ date, activeSec: 0, sinceBreakSec: 0, lastActivity: Date.now(), snoozeUntil: 0, declined: 0, onBreak: 0 });

let local: Local = fresh(dayKey());
let doc: DayDoc = { date: local.date, activeSec: 0 };
let store: Store | null = null;
let loaded = false;
let dirty = false;
let lastSave = 0;
let version = 0;
const listeners = new Set<() => void>();
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};

/** The selection the lab remembered from the last visit, and whether this is the first open of a new day. */
let rememberedSel: { moduleId: string; lesson?: number } | null = null;
let newDay = false;

function boot() {
  const saved = readLocal();
  try {
    rememberedSel = JSON.parse(localStorage.getItem(`${lab()}:sel`) ?? "null");
  } catch {
    rememberedSel = null;
  }
  const today = dayKey();
  newDay = !!saved && saved.date !== today && Date.now() - (saved.lastActivity ?? 0) > 6 * 3600_000;
  local = saved && saved.date === today ? { ...fresh(today), ...saved } : fresh(today);
  doc = { date: today, activeSec: local.activeSec };
}

function writeLocal() {
  try {
    localStorage.setItem(`${lab()}:day`, JSON.stringify(local));
  } catch {
    // counted for this visit only
  }
}

async function save(force = false) {
  if (!store || !loaded || (!dirty && !force)) return;
  dirty = false;
  lastSave = Date.now();
  doc.activeSec = Math.max(doc.activeSec, local.activeSec);
  try {
    await store.saveDay(doc.date, { ...doc });
  } catch {
    dirty = true;
  }
}

function rollover() {
  const today = dayKey();
  if (local.date === today) return;
  void save(true);
  local = { ...fresh(today), morningSkipped: local.morningSkipped };
  doc = { date: today, activeSec: 0 };
  loaded = false;
  void load();
}

async function load() {
  if (!store) return;
  const date = doc.date;
  try {
    const d = (await store.loadDay(date)) as Partial<DayDoc> | null;
    if (doc.date !== date) return;
    if (d) {
      doc = { ...d, ...doc, date, activeSec: Math.max(d.activeSec ?? 0, local.activeSec), seen: mergeSeen(d.seen, doc.seen), breaks: [...(d.breaks ?? []), ...(doc.breaks ?? [])] } as DayDoc;
      for (const k of ["closedAt", "next", "stop", "recall", "declined", "firstAt"] as const) if (d[k] !== undefined && doc[k] === undefined) (doc as unknown as Record<string, unknown>)[k] = d[k];
      local.activeSec = doc.activeSec;
    }
  } catch {
    // counted in this browser only, until the next load
  }
  loaded = true;
  emit();
}

function mergeSeen(a: DayDoc["seen"] = [], b: DayDoc["seen"] = []) {
  const out = [...a];
  for (const s of b) if (!out.some((x) => x.moduleId === s.moduleId && x.lesson === s.lesson)) out.push(s);
  return out.slice(-30);
}

let started = false;
function startClock() {
  if (started) return;
  started = true;
  const touch = () => {
    const now = Date.now();
    if (now - local.lastActivity > NATURAL_BREAK_MS) local.sinceBreakSec = 0;
    local.lastActivity = now;
  };
  for (const ev of ["scroll", "keydown", "pointerdown", "wheel", "touchmove"]) document.addEventListener(ev, touch, { capture: true, passive: true });
  window.setInterval(() => {
    rollover();
    const now = Date.now();
    if (document.visibilityState === "visible" && !local.onBreak && now - local.lastActivity < IDLE_MS) {
      local.activeSec += TICK;
      local.sinceBreakSec += TICK;
      doc.activeSec = Math.max(doc.activeSec, local.activeSec);
      doc.firstAt ??= now;
      doc.lastAt = now;
      dirty = true;
      writeLocal();
      emit();
    }
    if (now - lastSave > 120_000) void save();
  }, TICK * 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      writeLocal();
      void save();
    }
  });
}

/** boots on first use, after the lab has marked the root (data-lab) */
let booted = false;
const B = () => {
  if (!booted) {
    booted = true;
    boot();
  }
};

/** Starts the quiet clock once the runtime is known, and records the lesson that is open. */
export function useDayClock(rt: Runtime | null, lesson: { moduleId: string; lesson: number; title?: string } | null) {
  B();
  useEffect(() => {
    startClock();
    if (!rt?.store || store === rt.store) return;
    store = rt.store;
    void load();
  }, [rt]);
  const key = lesson ? `${lesson.moduleId}:${lesson.lesson}` : "";
  useEffect(() => {
    if (!lesson) return;
    doc.seen = mergeSeen(doc.seen, [{ ...lesson, at: Date.now() }]);
    dirty = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export function useDay() {
  B();
  useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => version,
  );
  return { local, doc, loaded };
}

/** first open after a night away: the lab opens on the home screen, where the morning card is */
export const isNewDay = () => (B(), newDay);
export const rememberedSelection = () => (B(), rememberedSel);

/* ---- breaks (N2, N3, N4, N8): only at a boundary, once, then quiet ---- */
export function breakDue(afterMin: number) {
  B();
  return local.sinceBreakSec >= afterMin * 60 && Date.now() >= local.snoozeUntil && local.declined < 3 && !local.onBreak;
}
export const minutesSinceBreak = () => (B(), Math.round(local.sinceBreakSec / 60));
export function declineBreak() {
  B();
  local.declined += 1;
  local.snoozeUntil = Date.now() + 30 * 60_000;
  doc.declined = (doc.declined ?? 0) + 1;
  dirty = true;
  writeLocal();
  emit();
}
/** a line passed by without an answer: quiet for 30 minutes, not counted as declined */
export function snoozeBreak() {
  B();
  local.snoozeUntil = Date.now() + 30 * 60_000;
  writeLocal();
}
export function takeBreak() {
  B();
  local.onBreak = Date.now();
  doc.breaks = [...(doc.breaks ?? []), Date.now()].slice(-40);
  dirty = true;
  writeLocal();
  emit();
  void save();
}
export function endBreak() {
  B();
  local.onBreak = 0;
  local.sinceBreakSec = 0;
  local.lastActivity = Date.now();
  writeLocal();
  emit();
}

/* ---- the morning card ---- */
export function skipMorning() {
  B();
  local.morningSkipped = dayKey();
  writeLocal();
  emit();
}
export const morningSkipped = () => (B(), local.morningSkipped === dayKey());

/** The day to open with: the last closed day (today's too), or else the last day before today. */
export async function lastDay(s: Store): Promise<DayDoc | null> {
  const days = (await s.recentDays(7)) as unknown as DayDoc[];
  return days.find((d) => d.closedAt) ?? days.find((d) => d.date < dayKey()) ?? null;
}

/**
 * Closing the day: the step he wrote (optional), where he stopped, and two questions for the morning, saved at once.
 * Returns true the first time today (the stamp plays in full once a day).
 */
export async function closeDay(o: { next: string; stop: DayStop | null; recall: RecallQuestion[] }) {
  B();
  const first = !doc.closedAt;
  doc.closedAt = Date.now();
  if (o.next.trim()) doc.next = o.next.trim();
  if (o.stop) doc.stop = o.stop;
  if (o.recall.length) doc.recall = o.recall;
  dirty = true;
  local.morningSkipped = undefined;
  writeLocal();
  if (!loaded && store) await load();
  await save(true);
  emit();
  return first;
}

/* ---- questions from his recent lessons: think blocks first, then keep lines ---- */
const strip = (s: string) => s.replace(/\s+$/g, "").trim();
export function recallFrom(text: string, src: string): { think: RecallQuestion[]; keep: RecallQuestion[] } {
  const think: RecallQuestion[] = [];
  const keep: RecallQuestion[] = [];
  for (const m of text.matchAll(/```think[^\n]*\n([\s\S]*?)```/g)) {
    const [q, ...rest] = m[1].split(/^\s*---\s*$/m);
    const a = rest.join("\n");
    if (q.trim() && a.trim() && q.length < 1200) think.push({ q: strip(q), a: strip(a), src });
  }
  for (const m of text.matchAll(/```keep[^\n]*\n([\s\S]*?)```/g))
    for (const line of m[1].split("\n")) {
      const l = line.replace(/^\s*[-*]\s+/, "").trim();
      const cut = l.search(/[:：—]/);
      if (cut < 3 || cut > 80) continue;
      const name = l.slice(0, cut).replace(/[*_]/g, "").trim();
      const rest = l.slice(cut + 1).trim();
      if (name && rest) keep.push({ q: `בעל פה: «${name}». מה הנוסחה או ההגדרה, ומתי היא תקפה?`, a: rest, src });
    }
  return { think, keep };
}

function convsOnce(s: Store): Promise<ConvMeta[]> {
  return new Promise((resolve) => {
    let done = false;
    let unsub: (() => void) | null = null;
    unsub = s.watchConversations((list) => {
      if (done) return;
      done = true;
      resolve(list);
      queueMicrotask(() => unsub?.());
    });
    window.setTimeout(() => !done && ((done = true), resolve([])), 8000);
  });
}

/** Two questions from the latest lessons: one from the last lesson and one from the lesson before it when there is one. */
export async function gatherRecall(s: Store, mods: Record<string, ModuleProgress>): Promise<RecallQuestion[]> {
  const convs = (await convsOnce(s)).filter((c) => c.lesson >= 0).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  const pools: { think: RecallQuestion[]; keep: RecallQuestion[] }[] = [];
  for (const c of convs) {
    if (pools.length >= 3) break;
    let msgs: (StoredMessage & { prefetched?: boolean; prefetchSeen?: number })[] = [];
    try {
      msgs = await s.loadMessages(c.id);
    } catch {
      continue;
    }
    // a lesson written ahead that he has not opened yet is not his to be asked about
    if (msgs.some((m) => m.prefetched && !m.prefetchSeen)) continue;
    const text = msgs.filter((m) => m.role === "assistant" && m.text).map((m) => m.text).join("\n\n");
    const title = mods[c.moduleId]?.lessons?.[c.lesson]?.title;
    pools.push(recallFrom(text, `${c.moduleId} · שיעור ${c.lesson + 1}${title ? `: ${title}` : ""}`));
  }
  const out: RecallQuestion[] = [];
  const take = (q?: RecallQuestion) => q && out.length < 2 && !out.includes(q) && out.push(q);
  // the last think of the latest lesson (fresh), then one from the lesson before (spaced), then fill
  take(pools[0]?.think.at(-1));
  take(pools[1]?.think.at(-1));
  for (const p of pools) p.think.forEach((q) => take(q));
  for (const p of pools) p.keep.forEach((q) => take(q));
  return out;
}

/** "M0.1 · שיעור 2: title" for a selection */
export function stopOf(sel: { moduleId: string; lesson?: number } | null, modules: { id: string; title: string }[], mods: Record<string, ModuleProgress>): DayStop | null {
  const m = sel && modules.find((x) => x.id === sel.moduleId);
  if (!m || !sel) return null;
  const l = sel.lesson;
  const title = l !== undefined && l >= 0 ? mods[m.id]?.lessons?.[l]?.title : undefined;
  const label = l === undefined ? `${m.id} · ${m.title}` : l < 0 ? `${m.id} · מבחן מסכם` : `${m.id} · שיעור ${l + 1}${title ? `: ${title}` : ""}`;
  return { moduleId: m.id, ...(l !== undefined ? { lesson: l } : {}), label };
}

/** "יום שישי · 30.10" */
export function dayTitle(date = new Date()) {
  return `${date.toLocaleDateString("he-IL", { weekday: "long" })} · ${date.getDate()}.${date.getMonth() + 1}`;
}
