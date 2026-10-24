export type Mode = "lesson" | "clarify" | "free";
export type Effort = "medium" | "high" | "xhigh" | "max";

// Content blocks as stored by the server (API content blocks; kept loose on purpose).
export interface Block {
  type: string;
  [key: string]: any;
}

export interface StoredMessage {
  role: "user" | "assistant";
  content: Block[];
  meta?: { display: string; mode: Mode; ts: number; images?: number };
  info?: { model?: string; stop?: string | null; usage?: any; ts: number };
  demo?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  bookId?: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  bookId?: string;
  updatedAt: number;
  count: number;
}

export interface Book {
  id: string;
  series: "math" | "physics";
  title: string;
  titleHe: string;
  authors: string;
  file: string;
  color: string;
  pageCount: number;
  lastLabel: string | null;
}

export type Progress = Record<string, { page: string; section?: string; note?: string; updatedAt?: number; lessons?: number }>;

export interface AppState {
  books: Book[];
  progress: Progress;
  conversations: ConversationSummary[];
  hasKey: boolean;
  model: string;
}

export type ServerEvent =
  | { type: "user_saved"; message: StoredMessage }
  | { type: "msg_start" }
  | { type: "block_start"; index: number; block: Block }
  | { type: "delta"; index: number; kind: "text" | "thinking" | "input"; text: string }
  | { type: "block_done"; index: number; block: Block }
  | { type: "msg_done"; message: StoredMessage }
  | { type: "tool_results"; message: StoredMessage }
  | { type: "progress"; progress: Progress }
  | { type: "notice"; level: "info" | "warn" | "error"; text: string }
  | { type: "done" };

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? res.statusText);
  return res.json();
}

export const api = {
  state: () => fetch("/api/state").then((r) => json<AppState>(r)),
  conversation: (id: string) => fetch(`/api/conversations/${id}`).then((r) => json<Conversation>(r)),
  create: (title?: string, bookId?: string) =>
    fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, bookId }),
    }).then((r) => json<Conversation>(r)),
  rename: (id: string, title: string) =>
    fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }),
  remove: (id: string) => fetch(`/api/conversations/${id}`, { method: "DELETE" }),
  setProgress: (bookId: string, page: string) =>
    fetch(`/api/progress/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page }),
    }).then((r) => json<Progress>(r)),
  pages: (bookId: string, from: string, by: "label" | "pdf") =>
    fetch(`/api/books/${bookId}/pages?from=${encodeURIComponent(from)}&by=${by}`).then((r) =>
      json<{ text: string; range: { fromPdf: number; toPdf: number; fromLabel: string | null; toLabel: string | null } }>(r),
    ),
  stop: (id: string) => fetch(`/api/conversations/${id}/stop`, { method: "POST" }),

  /** Sends a message and streams server events until the turn ends. */
  async send(
    id: string,
    body: { text: string; mode: Mode; effort: Effort; images: { media_type: string; data: string }[]; title?: string },
    onEvent: (e: ServerEvent) => void,
  ) {
    const res = await fetch(`/api/conversations/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok || !res.body) throw new Error((await res.json().catch(() => null))?.error ?? res.statusText);
    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      let cut: number;
      while ((cut = buf.indexOf("\n\n")) >= 0) {
        const frame = buf.slice(0, cut);
        buf = buf.slice(cut + 2);
        if (frame.startsWith("data: ")) onEvent(JSON.parse(frame.slice(6)));
      }
    }
  },
};
