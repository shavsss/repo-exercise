// The usage counter (identical in both apps): every call to Claude made by this page is counted
// by the model it ran on, with its time and output size, and every lesson by its words. The
// runtime gives no quota reading, so this is how the real load is measured (calls a day per model,
// words per lesson, generation minutes). Each page session keeps its own entry in the day's
// document, profile/usage/<day> { day, sessions: { <session>: counts } }, so two open tabs never
// overwrite each other's counts (a tab rewrites only its own entry; the first format, one document
// per <day>__<session>, is still read by Store.loadUsage).
import type { Runtime, SampleFn, SampleOptions, Store } from "./runtime";

export interface UsageDoc {
  day: string;
  session: string;
  /** calls by the model (or tier) they ran on; "json:" calls are counted by what was asked */
  calls: Record<string, number>;
  /** generation time in ms, and characters written, by the same keys */
  ms: Record<string, number>;
  chars: Record<string, number>;
  /** failed calls by error code (refused, rate_limited, …) */
  errors: Record<string, number>;
  lessons: number;
  lessonWords: number;
  lessonMs: number;
  updatedAt: number;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const session = Math.random().toString(36).slice(2, 8);
const blank = (day: string): UsageDoc => ({ day, session, calls: {}, ms: {}, chars: {}, errors: {}, lessons: 0, lessonWords: 0, lessonMs: 0, updatedAt: 0 });

let store: Store | null = null;
let doc = blank(today());
let timer: ReturnType<typeof setTimeout> | null = null;
let chain: Promise<unknown> = Promise.resolve();
/** sessions kept by name in one day's document; the older ones are summed into "_older" */
const SESSIONS_PER_DAY = 40;

/** The day's document with this session's counts in it (exported for the tests). */
export function mergeUsageDay(old: Record<string, unknown> | null, mine: UsageDoc) {
  const sessions: Record<string, UsageDoc> = { ...((old?.sessions as Record<string, UsageDoc>) ?? {}), [mine.session]: mine };
  const named = Object.values(sessions).filter((x) => x.session !== "_older").sort((a, b) => b.updatedAt - a.updatedAt);
  if (named.length > SESSIONS_PER_DAY) {
    const older = sessions._older ?? blank(mine.day);
    older.session = "_older";
    for (const x of named.slice(SESSIONS_PER_DAY)) {
      for (const k of ["calls", "ms", "chars", "errors"] as const) for (const [key, v] of Object.entries(x[k] ?? {})) add(older[k], key, v);
      older.lessons += x.lessons ?? 0;
      older.lessonWords += x.lessonWords ?? 0;
      older.lessonMs += x.lessonMs ?? 0;
      older.updatedAt = Math.max(older.updatedAt, x.updatedAt ?? 0);
      delete sessions[x.session];
    }
    sessions._older = older;
  }
  return { day: mine.day, sessions, updatedAt: Date.now() };
}

function flush() {
  timer = null;
  if (!store) return;
  doc.updatedAt = Date.now();
  const mine = JSON.parse(JSON.stringify(doc)) as UsageDoc;
  const s = store;
  chain = chain.catch(() => {}).then(() => s.saveUsage(mine.day, (old) => mergeUsageDay(old, mine) as unknown as Record<string, unknown>)).catch(() => {});
}
function touch() {
  // a new day starts a new document (the old one was already written)
  const day = today();
  if (doc.day !== day) {
    if (timer) flush();
    doc = blank(day);
  }
  if (!timer) timer = setTimeout(flush, 4000);
}
const add = (r: Record<string, number>, k: string, v = 1) => (r[k] = (r[k] ?? 0) + v);

function count(key: string, ms: number, chars: number) {
  touch();
  add(doc.calls, key);
  add(doc.ms, key, Math.round(ms));
  add(doc.chars, key, chars);
}
function fail(e: unknown) {
  touch();
  add(doc.errors, String((e as { code?: string })?.code ?? "error"));
}

/** Counts a finished lesson: its words and the time it took to write. */
export function countLesson(text: string, ms: number) {
  touch();
  doc.lessons += 1;
  doc.lessonWords += (text.match(/[\p{L}\p{N}][\p{L}\p{N}'"׳״-]*/gu) ?? []).length;
  doc.lessonMs += Math.round(ms);
}

/** The runtime, with every `sample` and `sample.json` call counted. */
export function withUsage(rt: Runtime): Runtime {
  store = rt.store;
  const s = rt.sample;
  if (!s) return rt;
  const wrapped = (async (input: Parameters<SampleFn>[0], options?: SampleOptions) => {
    const t0 = performance.now();
    try {
      const res = await s(input, options);
      count(res.modelApplied ?? `tier:${res.modelTierApplied}`, performance.now() - t0, res.text?.length ?? 0);
      return res;
    } catch (e) {
      if ((e as { code?: string })?.code !== "cancelled") fail(e);
      throw e;
    }
  }) as SampleFn;
  wrapped.limits = () => s.limits();
  wrapped.json = (async (input: Parameters<SampleFn>[0], options?: SampleOptions) => {
    const t0 = performance.now();
    try {
      const res = await s.json(input, options);
      count(`json:${options?.model ?? `tier:${options?.modelTier ?? "default"}`}`, performance.now() - t0, JSON.stringify(res ?? "").length);
      return res;
    } catch (e) {
      if ((e as { code?: string })?.code !== "cancelled") fail(e);
      throw e;
    }
  }) as SampleFn["json"];
  if (typeof window !== "undefined") window.addEventListener("pagehide", () => timer && (clearTimeout(timer), flush()));
  return { ...rt, sample: wrapped };
}

export interface UsageSummary {
  days: number;
  calls: Record<string, number>;
  minutes: number;
  lessons: number;
  wordsPerLesson: number;
  lessonMinutes: number;
  errors: Record<string, number>;
}

/** Sums the usage documents of the last `days` days (1 = today). */
export function summarize(docs: Partial<UsageDoc>[], days: number): UsageSummary {
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  const min = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`;
  const out: UsageSummary = { days, calls: {}, minutes: 0, lessons: 0, wordsPerLesson: 0, lessonMinutes: 0, errors: {} };
  let words = 0;
  let lessonMs = 0;
  for (const d of docs) {
    if (!d.day || d.day < min) continue;
    for (const [k, v] of Object.entries(d.calls ?? {})) add(out.calls, k.replace(/^json:/, ""), v);
    for (const v of Object.values(d.ms ?? {})) out.minutes += v / 60000;
    for (const [k, v] of Object.entries(d.errors ?? {})) add(out.errors, k, v);
    out.lessons += d.lessons ?? 0;
    words += d.lessonWords ?? 0;
    lessonMs += d.lessonMs ?? 0;
  }
  out.wordsPerLesson = out.lessons ? Math.round(words / out.lessons) : 0;
  out.lessonMinutes = out.lessons ? Math.round(lessonMs / out.lessons / 60000) : 0;
  out.minutes = Math.round(out.minutes);
  return out;
}

/** This session's counts so far (they reach the db a few seconds after each call). */
export const liveUsage = () => doc;
