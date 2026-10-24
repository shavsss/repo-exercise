import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { APP_DIR } from "./paths.js";
import { bookSummaries, catalog, readPages } from "./books.js";
import {
  createConversation,
  deleteConversation,
  getConversation,
  getProgress,
  listConversations,
  saveConversation,
  setProgress,
  type Mode,
} from "./store.js";
import { closeDanglingToolUses, MODEL, runTurn, studyContext, type Effort, type ServerEvent } from "./chat.js";
import { streamDemo } from "./demo.js";

const PORT = Number(process.env.PORT ?? 5174);
const hasKey = !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const client = hasKey ? new Anthropic() : null;

const app = express();
app.use(express.json({ limit: "40mb" }));

app.get("/api/state", (_req, res) => {
  res.json({ books: bookSummaries(), progress: getProgress(), conversations: listConversations(), hasKey, model: MODEL });
});

app.get("/api/conversations/:id", (req, res) => {
  const c = getConversation(req.params.id);
  if (!c) return res.status(404).json({ error: "not found" });
  res.json(c);
});

app.post("/api/conversations", (req, res) => {
  res.json(createConversation(String(req.body?.title ?? "שיחה חדשה"), req.body?.bookId));
});

app.patch("/api/conversations/:id", (req, res) => {
  const c = getConversation(req.params.id);
  if (!c) return res.status(404).json({ error: "not found" });
  if (typeof req.body?.title === "string") c.title = req.body.title.slice(0, 120);
  saveConversation(c);
  res.json({ ok: true });
});

app.delete("/api/conversations/:id", (req, res) => {
  deleteConversation(req.params.id);
  res.json({ ok: true });
});

app.put("/api/progress/:bookId", (req, res) => {
  if (!catalog.books.some((b) => b.id === req.params.bookId)) return res.status(404).json({ error: "unknown book" });
  const { page, note } = req.body ?? {};
  res.json(setProgress(req.params.bookId, { page: String(page), ...(note !== undefined ? { note: String(note) } : {}) }));
});

app.get("/api/books/:id/pages", (req, res) => {
  try {
    const by = req.query.by === "pdf" ? "pdf" : "label";
    const from = String(req.query.from);
    res.json(readPages(req.params.id, from, String(req.query.to ?? from), by));
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// The original book file, for the in-app PDF viewer.
app.get("/api/books/:id/file", (req, res) => {
  const b = catalog.books.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).end();
  res.sendFile(path.resolve(APP_DIR, "..", b.file));
});

const running = new Map<string, AbortController>();

app.post("/api/conversations/:id/messages", async (req, res) => {
  const conv = getConversation(req.params.id);
  if (!conv) return res.status(404).json({ error: "not found" });
  if (running.has(conv.id)) return res.status(409).json({ error: "a reply is already being generated" });

  const text = String(req.body?.text ?? "").trim();
  const mode: Mode = ["lesson", "clarify", "free"].includes(req.body?.mode) ? req.body.mode : "free";
  const effort: Effort = ["medium", "high", "xhigh", "max"].includes(req.body?.effort) ? req.body.effort : "high";
  const images: { media_type: string; data: string }[] = Array.isArray(req.body?.images) ? req.body.images : [];
  if (!text && !images.length) return res.status(400).json({ error: "empty message" });

  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  const send = (e: ServerEvent | { type: "done" } | { type: "user_saved"; message: unknown }) =>
    res.write(`data: ${JSON.stringify(e)}\n\n`);

  const ctrl = new AbortController();
  running.set(conv.id, ctrl);
  res.on("close", () => ctrl.abort());

  closeDanglingToolUses(conv);
  if (!conv.messages.some((m) => m.meta))
    conv.title = String(req.body?.title || text || "תמונה").replace(/\s+/g, " ").slice(0, 60);
  const userMsg = {
    role: "user" as const,
    content: [
      { type: "text" as const, text: studyContext(mode) },
      ...images.map((im) => ({
        type: "image" as const,
        source: { type: "base64" as const, media_type: im.media_type as "image/png", data: im.data },
      })),
      ...(text ? [{ type: "text" as const, text }] : []),
    ],
    meta: { display: text, mode, ts: Date.now(), images: images.length },
  };
  conv.messages.push(userMsg);
  saveConversation(conv);
  send({ type: "user_saved", message: userMsg });

  try {
    if (client) await runTurn({ client, conv, effort, send, signal: ctrl.signal });
    else await streamDemo({ conv, send, signal: ctrl.signal });
  } catch (err) {
    const message =
      err instanceof Anthropic.AuthenticationError
        ? "מפתח ה-API אינו תקף (ANTHROPIC_API_KEY)."
        : err instanceof Anthropic.RateLimitError
          ? "חריגה ממגבלת הקצב של ה-API — נסו שוב בעוד רגע."
          : err instanceof Anthropic.APIError
            ? `שגיאת API ${err.status ?? ""}: ${err.message}`
            : `שגיאה: ${(err as Error).message}`;
    send({ type: "notice", level: "error", text: message });
  } finally {
    if (ctrl.signal.aborted) closeDanglingToolUses(conv);
    running.delete(conv.id);
    send({ type: "done" });
    res.end();
  }
});

app.post("/api/conversations/:id/stop", (req, res) => {
  running.get(req.params.id)?.abort();
  res.json({ ok: true });
});

const dist = path.join(APP_DIR, "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`Study Lab server on http://localhost:${PORT}  (model: ${MODEL}${hasKey ? "" : ", DEMO mode — no API key"})`);
});
