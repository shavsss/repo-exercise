// The claude.ai artifact runtime: Claude (`sample`), the per-user store (`db`)
// and the viewer's id (`user`). Every capability may be absent (null): the app
// then runs without that feature instead of failing.
import type { Mode, StoredMessage } from "./types";

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
type SampleFn = ((
  input: string | { role: "user" | "assistant"; content: string }[],
  options?: {
    onText?: (u: { text: string; delta: string }) => void;
    signal?: AbortSignal;
    tools?: SampleTool[];
    images?: Blob[];
    modelTier?: "default" | "complex" | "quick";
    model?: string;
    effort?: "low" | "medium" | "high";
    cache?: boolean;
  },
) => Promise<{ text: string; truncated: boolean; modelTierApplied: string; modelApplied?: string }>) & {
  limits(): Promise<{ maxPromptBytes: number; images?: { maxCount: number }; tools?: { maxCount: number } }>;
  json<T = unknown>(input: string | { role: "user" | "assistant"; content: string }[], options?: Record<string, unknown>): Promise<T>;
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
  store: Store | null;
}

export async function connect(): Promise<Runtime> {
  const use = (name: string) => window.claude?.use(name).catch(() => null) ?? Promise.resolve(null);
  const [sample, db, user] = (await Promise.all([use("sample"), use("db"), use("user")])) as [SampleFn | null, DB | null, User | null];
  let canSendImages = false;
  if (sample) canSendImages = !!(await sample.limits().catch(() => null))?.images;
  const uid = user ? await user.id() : null;
  return { sample, canSendImages, store: db && uid ? new Store(db, uid) : null };
}

/* ---- per-user data: data/users/<id>/profile, …/convs/<cid>, …/convs/<cid>/msgs/<mid> ---- */
export type Progress = Record<string, { page: string; section?: string; lessons?: number; updatedAt?: number }>;
export interface ConvMeta {
  id: string;
  title: string;
  bookId?: string;
  createdAt: number;
  updatedAt: number;
  count: number;
}

export class Store {
  private profile: DocRef;
  constructor(db: DB, uid: string) {
    this.profile = db.doc(`data/users/${uid}/profile`);
  }

  private convs() {
    return this.profile.collection("convs");
  }

  async ensureProfile(initial: Progress, memory: string) {
    const snap = await this.profile.get();
    if (!snap.exists) await this.profile.set({ progress: initial, memory, createdAt: Date.now() });
  }

  watchProfile(fn: (p: { progress: Progress; memory: string }) => void) {
    return this.profile.onSnapshot((s) => fn({ progress: (s.data()?.progress as Progress) ?? {}, memory: String(s.data()?.memory ?? "") }));
  }

  async setMemory(memory: string) {
    await this.profile.update({ memory, memoryUpdatedAt: Date.now() });
  }

  async setProgress(bookId: string, patch: Partial<Progress[string]>, current: Progress) {
    const next = { ...current, [bookId]: { ...(current[bookId] ?? { page: "1" }), ...patch, updatedAt: Date.now() } };
    await this.profile.update({ progress: next });
    return next;
  }

  watchConversations(fn: (list: ConvMeta[]) => void) {
    return this.convs()
      .orderBy("updatedAt", "desc")
      .limit(200)
      .onSnapshot((s) => fn(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConvMeta, "id">) }))));
  }

  async createConversation(title: string, bookId: string | undefined): Promise<ConvMeta> {
    const ref = this.convs().doc();
    const meta = { title, bookId: bookId ?? null, createdAt: Date.now(), updatedAt: Date.now(), count: 0 };
    await ref.set(meta);
    return { id: ref.id, ...meta, bookId };
  }

  async loadMessages(convId: string): Promise<StoredMessage[]> {
    const s = await this.convs().doc(convId).collection("msgs").orderBy("ts").get();
    return s.docs.map((d) => ({ ...(d.data() as StoredMessage), id: d.id }));
  }

  async addMessage(convId: string, msg: StoredMessage, count: number) {
    // a single message never approaches the 256 KiB document limit; trim defensively
    const body = JSON.parse(JSON.stringify(msg)) as StoredMessage;
    if (body.text.length > 120_000) body.text = body.text.slice(0, 120_000) + "\n\n…";
    await this.convs().doc(convId).collection("msgs").doc().set(body as unknown as Record<string, unknown>);
    await this.convs().doc(convId).update({ updatedAt: Date.now(), count });
  }

  newMessageId(convId: string) {
    return this.convs().doc(convId).collection("msgs").doc().id;
  }

  /** Writes one message under a known id (used for drafts that are saved repeatedly). */
  async saveMessage(convId: string, id: string, msg: StoredMessage) {
    const { status: _status, id: _id, ...rest } = msg;
    const body = JSON.parse(JSON.stringify(rest)) as StoredMessage;
    if (body.text.length > 120_000) body.text = body.text.slice(0, 120_000) + "\n\n…";
    await this.convs().doc(convId).collection("msgs").doc(id).set(body as unknown as Record<string, unknown>);
  }

  async touch(convId: string, count: number) {
    await this.convs().doc(convId).update({ updatedAt: Date.now(), count });
  }

  async rename(convId: string, title: string) {
    await this.convs().doc(convId).update({ title });
  }

  async deleteConversation(convId: string) {
    const msgs = await this.convs().doc(convId).collection("msgs").get();
    for (const d of msgs.docs) await this.convs().doc(convId).collection("msgs").doc(d.id).delete();
    await this.convs().doc(convId).delete();
  }
}

export const MODE_LABEL: Record<Mode, string> = { lesson: "שיעור על סעיף", clarify: "שאלת הבהרה", free: "חופשי" };
