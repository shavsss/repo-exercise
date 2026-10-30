// The claude.ai artifact runtime: Claude (`sample`), the per-user store (`db`)
// and the viewer's id (`user`). Every capability may be absent (null): the app
// then runs without that feature instead of failing.
import type { LessonNote, Mode, ModuleProgress, StoredMessage } from "./types";
import type { Summary, SummaryMeta } from "./summaries/model";
import { withUsage } from "./usage";

/* ---- minimal shapes of the runtime namespaces this page uses ---- */
export interface SampleTool {
  name: string;
  description: string;
  inputSchema?: { type: "object"; properties?: Record<string, unknown>; required?: string[] };
  execute(input: Record<string, unknown>, ctx: { signal: AbortSignal }): unknown;
}
export interface SampleError {
  code: string;
  message: string;
  text?: string;
}
export type SampleOptions = {
  onText?: (u: { text: string; delta: string }) => void;
  signal?: AbortSignal;
  tools?: SampleTool[];
  images?: Blob[];
  modelTier?: "default" | "complex" | "quick";
  model?: string;
  effort?: "low" | "medium" | "high";
  cache?: boolean;
};
type Turns = string | { role: "user" | "assistant"; content: string }[];
export type SampleFn = ((
  input: Turns,
  options?: SampleOptions,
) => Promise<{ text: string; truncated: boolean; modelTierApplied: string; modelApplied?: string }>) & {
  limits(): Promise<{ maxPromptBytes: number; images?: { maxCount: number }; tools?: { maxCount: number } }>;
  json<T = unknown>(input: Turns, options?: SampleOptions): Promise<T>;
};
interface DocSnap {
  id: string;
  exists: boolean;
  data(): Record<string, any> | undefined;
}
interface QuerySnap {
  docs: DocSnap[];
}
interface Query {
  orderBy(field: string, dir?: "asc" | "desc"): Query;
  limit(n: number): Query;
  get(): Promise<QuerySnap>;
  onSnapshot(next: (s: QuerySnap) => void, err?: (e: { code: string }) => void): () => void;
}
interface CollRef extends Query {
  doc(id?: string): DocRef;
}
interface DocRef {
  id: string;
  get(): Promise<DocSnap>;
  set(d: Record<string, unknown>): Promise<void>;
  update(d: Record<string, unknown>): Promise<void>;
  delete(): Promise<void>;
  onSnapshot(next: (s: DocSnap) => void, err?: (e: { code: string }) => void): () => void;
  collection(p: string): CollRef;
}
interface DB {
  doc(p: string): DocRef;
}
interface User {
  id(): Promise<string | null>;
}
declare global {
  interface Window {
    claude?: { use(name: string): Promise<any> };
  }
}

export interface Runtime {
  sample: SampleFn | null;
  canSendImages: boolean;
  canUseTools: boolean;
  store: Store | null;
}

export async function connect(): Promise<Runtime> {
  const use = (name: string) => window.claude?.use(name).catch(() => null) ?? Promise.resolve(null);
  const [sample, db, user, downloads] = (await Promise.all([use("sample"), use("db"), use("user"), use("downloads")])) as [SampleFn | null, DB | null, User | null, Window["__downloads"]];
  window.__downloads = downloads ?? null;
  window.__assets = (await use("assets")) ?? null;
  const limits = sample ? await sample.limits().catch(() => null) : null;
  const uid = user ? await user.id() : null;
  // every call is counted (usage.ts)
  return withUsage({ sample, canSendImages: !!limits?.images, canUseTools: !!limits?.tools, store: db && uid ? new Store(db, uid) : null });
}

/* ---- per-user data under data/users/<id>/:
   profile                      { memory, done: [module ids], current }
   profile/modules/<module id>  ModuleProgress
   profile/convs/<conv id>      ConvMeta, with msgs/<msg id> below ---- */
export interface Profile {
  memory: string;
  done: string[];
  current: string | null;
}
export interface ConvMeta {
  id: string;
  title: string;
  moduleId: string;
  /** lesson index, or -1 for the module quiz, -2 for a free conversation */
  lesson: number;
  createdAt: number;
  updatedAt: number;
  count: number;
}

const clean = <T,>(v: T) => JSON.parse(JSON.stringify(v)) as T;
/**
 * Bytes of one stored document, all fields together (the db allows 256 KiB). Measured in UTF-8 as
 * stored: Hebrew takes two bytes a character, and a newline or a backslash in JSON two.
 */
const DOC_BYTES = 200_000;
/** memory versions younger than this stay in their own documents (see Store.logMemory) */
const MEMLOG_DAYS = 30;
export const utf8Bytes = (s: string) => new TextEncoder().encode(s).length;

/** Cuts a text into pieces of at most `first` bytes (the first) and `max` bytes (the others), as JSON strings. */
export function splitUtf8(s: string, first: number, max: number): string[] {
  const out: string[] = [];
  let budget = first;
  for (let i = 0; i < s.length || !out.length; ) {
    let j = i;
    let b = 0;
    while (j < s.length) {
      const c = s.codePointAt(j)!;
      const n = c === 0x22 || c === 0x5c ? 2 : c < 0x20 ? (c === 10 || c === 9 || c === 13 ? 2 : 6) : c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
      if (b + n > budget) break;
      b += n;
      j += c > 0xffff ? 2 : 1;
    }
    if (j === i && budget >= max) j = i + (s.codePointAt(i)! > 0xffff ? 2 : 1);
    out.push(s.slice(i, j));
    i = j;
    budget = max;
  }
  return out;
}

export class Store {
  private profile: DocRef;
  constructor(db: DB, uid: string) {
    this.profile = db.doc(`data/users/${uid}/profile`);
  }

  async ensureProfile(memory: string) {
    const snap = await this.profile.get();
    if (!snap.exists) await this.profile.set({ memory, done: [], current: null, createdAt: Date.now() });
  }

  watchProfile(fn: (p: Profile) => void) {
    return this.profile.onSnapshot((s) => {
      const d = s.data() ?? {};
      fn({ memory: String(d.memory ?? ""), done: Array.isArray(d.done) ? d.done : [], current: d.current ?? null });
    });
  }

  async setMemory(memory: string) {
    await this.profile.update({ memory, memoryUpdatedAt: Date.now() });
  }

  async setDone(done: string[]) {
    await this.profile.update({ done, updatedAt: Date.now() });
  }

  async setCurrent(current: string) {
    await this.profile.update({ current });
  }

  watchModules(fn: (m: Record<string, ModuleProgress>) => void) {
    return this.profile
      .collection("modules")
      .limit(500)
      .onSnapshot((s) => fn(Object.fromEntries(s.docs.map((d) => [d.id, d.data() as ModuleProgress]))));
  }

  async saveModule(id: string, p: ModuleProgress) {
    await this.profile.collection("modules").doc(id).set(clean({ ...p, updatedAt: Date.now() }) as Record<string, unknown>);
  }

  private convs() {
    return this.profile.collection("convs");
  }

  watchConversations(fn: (list: ConvMeta[]) => void) {
    return this.convs()
      .orderBy("updatedAt", "desc")
      .limit(500)
      .onSnapshot((s) => fn(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConvMeta, "id">) }))));
  }

  async createConversation(title: string, moduleId: string, lesson: number): Promise<ConvMeta> {
    const ref = this.convs().doc();
    const meta = { title, moduleId, lesson, createdAt: Date.now(), updatedAt: Date.now(), count: 0 };
    await ref.set(meta);
    return { id: ref.id, ...meta };
  }

  async loadMessages(convId: string): Promise<StoredMessage[]> {
    const s = await this.convs().doc(convId).collection("msgs").orderBy("ts").get();
    const msgs = s.docs.map((d) => ({ ...(d.data() as StoredMessage), id: d.id }));
    // a text longer than one document continues in msgs/<id>/more/<n> (see saveMessage)
    for (const m of msgs) {
      const n = (m as { textParts?: number }).textParts ?? 0;
      if (!n) continue;
      const more = this.convs().doc(convId).collection("msgs").doc(m.id!).collection("more");
      const parts = await Promise.all(Array.from({ length: n }, (_, i) => more.doc(String(i + 1)).get().catch(() => null)));
      m.text += parts.map((p) => String(p?.data()?.text ?? "")).join("");
      delete (m as { textParts?: number }).textParts;
    }
    return msgs;
  }

  newMessageId(convId: string) {
    return this.convs().doc(convId).collection("msgs").doc().id;
  }

  /** Writes one message under a known id (drafts are saved repeatedly under the same id). */
  async saveMessage(convId: string, id: string, msg: StoredMessage) {
    const { status: _status, id: _id, ...rest } = msg;
    const body = clean(rest) as StoredMessage;
    // a document holds at most 256 KiB: the text beyond what fits in DOC_BYTES, next to the other
    // fields (the plan, the activity), goes to msgs/<id>/more/<n>
    // (written first, so the message never points at parts that are not there yet)
    const ref = this.convs().doc(convId).collection("msgs").doc(id);
    if (body.activity && utf8Bytes(JSON.stringify(body.activity)) > 40_000) body.activity = body.activity.slice(-20);
    const others = utf8Bytes(JSON.stringify({ ...body, text: "", textParts: 999 }));
    const pieces = splitUtf8(body.text, DOC_BYTES - others, DOC_BYTES - 100);
    if (pieces.length > 1) {
      body.text = pieces[0];
      const chunks = pieces.slice(1);
      for (let i = 0; i < chunks.length; i++) await ref.collection("more").doc(String(i + 1)).set({ text: chunks[i] });
      (body as { textParts?: number }).textParts = chunks.length;
    }
    await ref.set(body as unknown as Record<string, unknown>);
  }

  async touch(convId: string, count: number) {
    await this.convs().doc(convId).update({ updatedAt: Date.now(), count });
  }

  /* ---- the shared notebook of the lessons: profile/notes/<id> ---- */
  watchNotes(fn: (list: LessonNote[]) => void) {
    return this.profile
      .collection("notes")
      .orderBy("ts", "desc")
      .limit(1000)
      .onSnapshot((s) => fn(s.docs.map((d) => ({ ...(d.data() as LessonNote), id: d.id }))));
  }

  async addNote(note: LessonNote) {
    const ref = this.profile.collection("notes").doc();
    const { id: _id, ...body } = note;
    await ref.set(clean({ ...body, text: body.text.slice(0, 20000) }) as unknown as Record<string, unknown>);
    return ref.id;
  }

  async updateNote(id: string, patch: Partial<LessonNote>) {
    await this.profile.collection("notes").doc(id).update(clean(patch) as Record<string, unknown>);
  }

  async deleteNote(id: string) {
    await this.profile.collection("notes").doc(id).delete();
  }

  /* ---- the summaries notebook: profile/summaries/<module id>, with a small
     profile/summaryMeta/<module id> beside it for the tree ---- */
  watchSummaryMeta(fn: (m: Record<string, SummaryMeta>) => void) {
    return this.profile.collection("summaryMeta").onSnapshot((s) => fn(Object.fromEntries(s.docs.map((d) => [d.id, d.data() as SummaryMeta]))));
  }

  async loadSummary(moduleId: string): Promise<Summary | null> {
    const s = await this.profile.collection("summaries").doc(moduleId).get();
    return s.exists ? (s.data() as Summary) : null;
  }

  async saveSummary(sum: Summary, meta: SummaryMeta) {
    await this.profile.collection("summaries").doc(sum.moduleId).set(clean(sum) as unknown as Record<string, unknown>);
    await this.profile.collection("summaryMeta").doc(sum.moduleId).set(clean(meta) as unknown as Record<string, unknown>);
  }

  /* ---- the lesson notebook (drawings and worked solutions): profile/scratch/<module>__<lesson> ---- */
  async loadScratch(key: string): Promise<Record<string, unknown> | null> {
    const s = await this.profile.collection("scratch").doc(key).get();
    return s.exists ? (s.data() as Record<string, unknown>) : null;
  }

  async saveDiag(data: Record<string, unknown>) {
    await this.profile.collection("diag").doc(String(Date.now())).set(clean(data));
  }

  async saveScratch(key: string, data: Record<string, unknown>) {
    await this.profile.collection("scratch").doc(key).set(clean(data));
  }

  /* ---- the learner's answers to the level-3 blocks (predict, errorhunt, verify, lab, decide): profile/level3/<module>__<lesson> ---- */
  async loadLevel3(key: string): Promise<Record<string, unknown> | null> {
    const s = await this.profile.collection("level3").doc(key).get();
    return s.exists ? (s.data() as Record<string, unknown>) : null;
  }

  async saveLevel3(key: string, data: Record<string, unknown>) {
    await this.profile.collection("level3").doc(key).set(clean(data));
  }

  /* ---- the learner's own dictionary for the summaries' spelling: profile/dict/mine ---- */
  async loadWords(): Promise<string[]> {
    const s = await this.profile.collection("dict").doc("mine").get();
    return s.exists ? ((s.data() as { words?: string[] }).words ?? []) : [];
  }

  async saveWords(words: string[]) {
    await this.profile.collection("dict").doc("mine").set({ words });
  }

  /** A collection under the profile, for the tabs that keep their own documents
      (news, newsfb, products, reviews: see docs/NEWS_SCHEMA.md and docs/REVIEW_SCHEMA.md). */
  sub(name: string) {
    return this.profile.collection(name);
  }

  /* ---- the study day, counted quietly (day.ts): profile/days/<YYYY-MM-DD> ---- */
  async loadDay(date: string): Promise<Record<string, unknown> | null> {
    const s = await this.profile.collection("days").doc(date).get();
    return s.exists ? (s.data() ?? null) : null;
  }

  async saveDay(date: string, data: Record<string, unknown>) {
    await this.profile.collection("days").doc(date).set(clean(data));
  }

  async recentDays(n: number): Promise<Record<string, unknown>[]> {
    const s = await this.profile.collection("days").orderBy("date", "desc").limit(n).get();
    return s.docs.map((d) => ({ ...d.data(), date: d.id }));
  }

  async allSummaries(): Promise<Summary[]> {
    const s = await this.profile.collection("summaries").get();
    return s.docs.map((d) => d.data() as Summary);
  }

  /* ---- course memory: the latest text, and every earlier version in profile/memlog/<ts> ---- */
  async getMemory(): Promise<string | null> {
    const s = await this.profile.get();
    return s.exists ? String(s.data()?.memory ?? "") : null;
  }

  /**
   * Keeps a version of the memory before it is replaced. A version stays in its own document for
   * MEMLOG_DAYS; older ones are folded into memlog/m-<YYYY-MM> (the last version of each day, as
   * many as fit in one document), so the log grows by months and not by lessons. The full history
   * is also in the nightly backup (notes/MEMORY_LOG.md in git).
   */
  async logMemory(v: { memory: string; reason: string; replacedBy?: string }) {
    await this.profile.collection("memlog").doc(`${Date.now()}_${Math.random().toString(36).slice(2, 6)}`).set(clean({ ...v, at: Date.now() }));
    await this.foldMemoryLog().catch(() => {});
  }

  private async foldMemoryLog() {
    const col = this.profile.collection("memlog");
    const cutoff = Date.now() - MEMLOG_DAYS * 86_400_000;
    const old = (await col.orderBy("at", "asc").limit(40).get()).docs.filter((d) => !Array.isArray(d.data()?.versions) && Number(d.data()?.at ?? 0) < cutoff);
    const byMonth = new Map<string, DocSnap[]>();
    for (const d of old) {
      const m = `m-${new Date(Number(d.data()?.at)).toISOString().slice(0, 7)}`;
      byMonth.set(m, [...(byMonth.get(m) ?? []), d]);
    }
    for (const [m, list] of byMonth) {
      const ref = col.doc(m);
      const prev = await ref.get();
      const versions = [...((prev.exists && (prev.data()?.versions as Record<string, unknown>[])) || []), ...list.map((d) => ({ ...d.data(), id: d.id }) as Record<string, unknown>)];
      // the last version of each day, and the newest ones when even those do not fit
      const byDay = new Map<string, Record<string, unknown>>();
      for (const x of versions.sort((a, b) => Number(a.at) - Number(b.at))) byDay.set(new Date(Number(x.at)).toISOString().slice(0, 10), x);
      let keep = [...byDay.values()];
      while (keep.length > 1 && utf8Bytes(JSON.stringify(keep)) > 190_000) keep = keep.slice(1);
      await ref.set(clean({ month: m.slice(2), versions: keep, at: Number(keep[keep.length - 1]?.at ?? 0) }));
      for (const d of list) await col.doc(d.id).delete();
    }
  }

  async loadMemoryLog(limit = 60): Promise<{ id: string; memory: string; reason: string; at: number }[]> {
    const s = await this.profile.collection("memlog").orderBy("at", "desc").limit(limit).get();
    // a month document (see foldMemoryLog) holds several versions
    const all = s.docs.flatMap((d) => (Array.isArray(d.data()?.versions) ? (d.data()!.versions as Record<string, unknown>[]).map((x) => ({ ...x, id: String(x.id ?? d.id) })) : [{ ...d.data(), id: d.id } as Record<string, unknown>]));
    return all
      .map((x) => ({ id: String(x.id), memory: String(x.memory ?? ""), reason: String(x.reason ?? ""), at: Number(x.at ?? 0) }))
      .sort((a, b) => b.at - a.at)
      .slice(0, limit);
  }

  /* ---- usage counter: profile/usage/<day>, { day, sessions: { <session>: counts } } (first format:
     one document per page session and day, <day>__<session>; still read) ---- */
  async saveUsage(day: string, merge: (old: Record<string, unknown> | null) => Record<string, unknown>) {
    const ref = this.profile.collection("usage").doc(day);
    const old = await ref.get();
    await ref.set(clean(merge(old.exists ? (old.data() ?? null) : null)));
  }

  async loadUsage(limit = 400): Promise<Record<string, unknown>[]> {
    const s = await this.profile.collection("usage").orderBy("day", "desc").limit(limit).get();
    return s.docs.flatMap((d) => {
      const sessions = d.data()?.sessions as Record<string, Record<string, unknown>> | undefined;
      return sessions ? Object.entries(sessions).map(([k, v]) => ({ ...v, id: `${d.id}__${k}` })) : [{ ...d.data(), id: d.id }];
    });
  }

  async deleteConversation(convId: string) {
    const msgs = await this.convs().doc(convId).collection("msgs").get();
    for (const d of msgs.docs) {
      const n = Number(d.data()?.textParts ?? 0);
      for (let i = 1; i <= n; i++) await this.convs().doc(convId).collection("msgs").doc(d.id).collection("more").doc(String(i)).delete();
      await this.convs().doc(convId).collection("msgs").doc(d.id).delete();
    }
    await this.convs().doc(convId).delete();
  }
}

export const MODE_LABEL: Record<Mode, string> = { lesson: "שיעור", clarify: "שאלת הבהרה", free: "חופשי", quiz: "מבחן מסכם" };
