import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type Anthropic from "@anthropic-ai/sdk";
import { USER_DIR } from "./paths.js";
import { catalog } from "./books.js";

export type Mode = "lesson" | "clarify" | "free";

export interface StoredMessage {
  role: "user" | "assistant";
  content: Anthropic.Beta.BetaContentBlockParam[];
  /** Present on messages the learner typed (not on tool-result turns). */
  meta?: { display: string; mode: Mode; ts: number; images?: number };
  /** Present on assistant messages. */
  info?: { model?: string; stop?: string | null; usage?: unknown; ts: number };
  /** Demo-mode messages are shown but never sent to the API. */
  demo?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  bookId?: string;
  createdAt: number;
  updatedAt: number;
  containerId?: string;
  messages: StoredMessage[];
}

export interface Progress {
  [bookId: string]: { page: string; section?: string; note?: string; updatedAt?: number; lessons?: number };
}

const convDir = path.join(USER_DIR, "conversations");
const progressFile = path.join(USER_DIR, "progress.json");
fs.mkdirSync(convDir, { recursive: true });

function writeJson(file: string, data: unknown) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 1));
  fs.renameSync(tmp, file);
}

const safeId = (id: string) => /^[a-z0-9-]{8,64}$/i.test(id);

export function listConversations() {
  return fs
    .readdirSync(convDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const c = JSON.parse(fs.readFileSync(path.join(convDir, f), "utf8")) as Conversation;
      return { id: c.id, title: c.title, bookId: c.bookId, updatedAt: c.updatedAt, count: c.messages.filter((m) => m.meta).length };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getConversation(id: string): Conversation | null {
  if (!safeId(id)) return null;
  const file = path.join(convDir, `${id}.json`);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as Conversation) : null;
}

export function createConversation(title: string, bookId?: string): Conversation {
  const now = Date.now();
  const c: Conversation = { id: randomUUID(), title, bookId, createdAt: now, updatedAt: now, messages: [] };
  saveConversation(c);
  return c;
}

export function saveConversation(c: Conversation) {
  c.updatedAt = Date.now();
  writeJson(path.join(convDir, `${c.id}.json`), c);
}

export function deleteConversation(id: string) {
  if (!safeId(id)) return;
  fs.rmSync(path.join(convDir, `${id}.json`), { force: true });
}

export function getProgress(): Progress {
  if (fs.existsSync(progressFile)) return JSON.parse(fs.readFileSync(progressFile, "utf8"));
  return structuredClone(catalog.initialProgress) as Progress;
}

export function setProgress(bookId: string, patch: Partial<Progress[string]>) {
  const p = getProgress();
  p[bookId] = { ...(p[bookId] ?? { page: "1" }), ...patch, updatedAt: Date.now() };
  writeJson(progressFile, p);
  return p;
}
