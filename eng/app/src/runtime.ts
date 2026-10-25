// The claude.ai artifact runtime: Claude (`sample`), the per-user store (`db`)
// and the viewer's id (`user`). Every capability may be absent (null): the app
// then runs without that feature instead of failing.
import type { LessonNote, Mode, ModuleProgress, StoredMessage } from "./types";

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
  const limits = sample ? await sample.limits().catch(() => null) : null;
  const uid = user ? await user.id() : null;
  return { sample, canSendImages: !!limits?.images, canUseTools: !!limits?.tools, store: db && uid ? new Store(db, uid) : null };
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
    return s.docs.map((d) => ({ ...(d.data() as StoredMessage), id: d.id }));
  }

  newMessageId(convId: string) {
    return this.convs().doc(convId).collection("msgs").doc().id;
  }

  /** Writes one message under a known id (drafts are saved repeatedly under the same id). */
  async saveMessage(convId: string, id: string, msg: StoredMessage) {
    const { status: _status, id: _id, ...rest } = msg;
    const body = clean(rest) as StoredMessage;
    // a document holds at most 256 KiB
    if (body.text.length > 110_000) body.text = body.text.slice(0, 110_000) + "\n\n…";
    if (body.activity && JSON.stringify(body.activity).length > 40_000) body.activity = body.activity.slice(-20);
    await this.convs().doc(convId).collection("msgs").doc(id).set(body as unknown as Record<string, unknown>);
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

  async deleteConversation(convId: string) {
    const msgs = await this.convs().doc(convId).collection("msgs").get();
    for (const d of msgs.docs) await this.convs().doc(convId).collection("msgs").doc(d.id).delete();
    await this.convs().doc(convId).delete();
  }
}

export const MODE_LABEL: Record<Mode, string> = { lesson: "שיעור", clarify: "שאלת הבהרה", free: "חופשי", quiz: "מבחן מסכם" };
