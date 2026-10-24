import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { SYSTEM_PROMPT } from "./prompt.js";
import { catalog, readPages, searchBook } from "./books.js";
import { getProgress, saveConversation, setProgress, type Conversation, type Mode, type StoredMessage } from "./store.js";

export const MODEL = process.env.STUDY_LAB_MODEL ?? "claude-opus-5-5";
export type Effort = "medium" | "high" | "xhigh" | "max";

import type * as Beta from "@anthropic-ai/sdk/resources/beta/messages/messages";
export type ServerEvent =
  | { type: "msg_start" }
  | { type: "block_start"; index: number; block: Beta.BetaContentBlock }
  | { type: "delta"; index: number; kind: "text" | "thinking" | "input"; text: string }
  | { type: "block_done"; index: number; block: Beta.BetaContentBlock }
  | { type: "msg_done"; message: StoredMessage }
  | { type: "tool_results"; message: StoredMessage }
  | { type: "progress"; progress: ReturnType<typeof getProgress> }
  | { type: "notice"; level: "info" | "warn" | "error"; text: string };

const bookIds = catalog.books.map((b) => b.id) as [string, ...string[]];

const ReadInput = z.object({
  book_id: z.enum(bookIds),
  from: z.string().min(1),
  to: z.string().min(1),
  by: z.enum(["label", "pdf"]),
});
const SearchInput = z.object({ book_id: z.enum(bookIds), query: z.string().min(1) });
const ProgressInput = z.object({ book_id: z.enum(bookIds), page: z.string().min(1), section: z.string() });

const tools: Beta.BetaToolUnion[] = [
  {
    name: "read_book_pages",
    description:
      "Read the text of a range of pages (inclusive) from one of the learner's books. Use by=\"label\" with printed page numbers (e.g. \"240\", or \"6-3\" in Feynman) or by=\"pdf\" with PDF page indices. At most 20 pages per call.",
    strict: true,
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        book_id: { type: "string", enum: bookIds },
        from: { type: "string", description: "First page (printed label or PDF index, as a string)" },
        to: { type: "string", description: "Last page, inclusive" },
        by: { type: "string", enum: ["label", "pdf"] },
      },
      required: ["book_id", "from", "to", "by"],
    },
  },
  {
    name: "search_book",
    description:
      "Search one book for a phrase or terms (section headings like \"§13\", figure numbers like \"Fig. 80\", names, terms). Returns matching pages with printed labels and snippets.",
    strict: true,
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: { book_id: { type: "string", enum: bookIds }, query: { type: "string" } },
      required: ["book_id", "query"],
    },
  },
  {
    name: "record_progress",
    description:
      "Record that a section lesson covered the book up to a printed page. Call once at the end of a completed section lesson (or lesson part).",
    strict: true,
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        book_id: { type: "string", enum: bookIds },
        page: { type: "string", description: "Last printed page covered" },
        section: { type: "string", description: "Section name/number, e.g. \"§13 Projective geometry (part 1/2)\"" },
      },
      required: ["book_id", "page", "section"],
    },
  },
  { type: "code_execution_20260521", name: "code_execution" },
  { type: "web_search_20250305", name: "web_search", max_uses: 8 },
];

const MODE_TEXT: Record<Mode, string> = {
  lesson:
    "lesson — a full section lesson (structure, depth bar ≥ ~4000 Hebrew words, story → thread → examples → case study → 4+ domains → exercises → product → next).",
  clarify: "clarify — a clarification answer with full depth, without the mandatory section scaffolding.",
  free: "free — follow the request while keeping the quality rules.",
};

export function studyContext(mode: Mode) {
  const progress = getProgress();
  const lines = catalog.books.map((b) => {
    const p = progress[b.id];
    return p
      ? `- ${b.id}: at printed page ${p.page}${p.section ? `, last section: ${p.section}` : ""}${p.note ? ` (${p.note})` : ""}`
      : `- ${b.id}: not started`;
  });
  const today = new Date().toISOString().slice(0, 10);
  return `<study_context>\nDate: ${today}\nReading positions:\n${lines.join("\n")}\nRequested message type: ${MODE_TEXT[mode]}\n</study_context>`;
}

function runTool(name: string, input: unknown): { content: string; isError?: boolean; progressChanged?: boolean } {
  try {
    switch (name) {
      case "read_book_pages": {
        const i = ReadInput.parse(input);
        return { content: readPages(i.book_id, i.from, i.to, i.by).text };
      }
      case "search_book": {
        const i = SearchInput.parse(input);
        const hits = searchBook(i.book_id, i.query);
        return { content: hits.length ? JSON.stringify(hits, null, 1) : "No matches." };
      }
      case "record_progress": {
        const i = ProgressInput.parse(input);
        const prev = getProgress()[i.book_id];
        setProgress(i.book_id, { page: i.page, section: i.section, lessons: (prev?.lessons ?? 0) + 1 });
        return { content: `Recorded: ${i.book_id} → page ${i.page} (${i.section}).`, progressChanged: true };
      }
      default:
        return { content: `Unknown tool ${name}`, isError: true };
    }
  } catch (err) {
    const msg = err instanceof z.ZodError ? `Invalid input: ${err.message}` : (err as Error).message;
    return { content: msg, isError: true };
  }
}

const MAX_ROUNDS = 40;

export async function runTurn(opts: {
  client: Anthropic;
  conv: Conversation;
  effort: Effort;
  send: (e: ServerEvent) => void;
  signal: AbortSignal;
}) {
  const { client, conv, effort, send, signal } = opts;
  let jsonRetries = 0;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    if (signal.aborted) return;
    const params: Beta.MessageCreateParamsStreaming = {
      model: MODEL,
      max_tokens: 128000,
      stream: true,
      betas: ["server-side-fallback-2026-07-01", "compact-2026-01-12"],
      fallbacks: "default",
      context_management: { edits: [{ type: "compact_20260112" }] },
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort },
      cache_control: { type: "ephemeral" },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      tools,
      messages: conv.messages.filter((m) => !m.demo).map((m) => ({ role: m.role, content: m.content })),
      ...(conv.containerId ? { container: conv.containerId } : {}),
    };

    send({ type: "msg_start" });
    let message: Beta.BetaMessage;
    try {
      const stream = client.beta.messages.stream(params, { signal });
      stream.on("streamEvent", (ev, snapshot) => {
        switch (ev.type) {
          case "content_block_start":
            send({ type: "block_start", index: ev.index, block: ev.content_block });
            break;
          case "content_block_delta": {
            const d = ev.delta;
            if (d.type === "text_delta") send({ type: "delta", index: ev.index, kind: "text", text: d.text });
            else if (d.type === "thinking_delta") send({ type: "delta", index: ev.index, kind: "thinking", text: d.thinking });
            else if (d.type === "input_json_delta") send({ type: "delta", index: ev.index, kind: "input", text: d.partial_json });
            break;
          }
          case "content_block_stop": {
            const block = snapshot.content[ev.index];
            if (block) send({ type: "block_done", index: ev.index, block });
            break;
          }
        }
      });
      message = await stream.finalMessage();
      jsonRetries = 0;
    } catch (err) {
      if (signal.aborted) return;
      if (err instanceof Anthropic.BadRequestError && conv.containerId && /container/i.test(err.message)) {
        // The code-execution container expired; start a fresh one.
        conv.containerId = undefined;
        send({ type: "notice", level: "info", text: "סביבת הקוד הקודמת פגה — נפתחת סביבה חדשה." });
        continue;
      }
      if (!(err instanceof Anthropic.APIError) && jsonRetries++ < 2) {
        // A streamed tool input that could not be parsed: re-issue the turn.
        continue;
      }
      throw err;
    }

    const stored: StoredMessage = {
      role: "assistant",
      content: echoableContent(message.content),
      info: { model: message.model, stop: message.stop_reason, usage: message.usage, ts: Date.now() },
    };
    conv.messages.push(stored);
    if (message.container?.id) conv.containerId = message.container.id;
    saveConversation(conv);
    send({ type: "msg_done", message: stored });

    switch (message.stop_reason) {
      case "pause_turn":
        continue; // server tool loop hit its limit; resend to resume
      case "refusal":
        send({ type: "notice", level: "warn", text: "המודל סירב להמשיך את התשובה הזו." });
        return;
      case "max_tokens":
        send({ type: "notice", level: "warn", text: "התשובה נקטעה באורך המרבי. אפשר לבקש \"המשך\"." });
        if (message.content.some((b) => b.type === "tool_use")) {
          // never run a truncated tool call; close it so the history stays valid
          closeDanglingToolUses(conv, "Interrupted: output limit reached before the tool input was complete.");
        }
        return;
      case "tool_use": {
        const uses = message.content.filter((b): b is Beta.BetaToolUseBlock => b.type === "tool_use");
        const results: Beta.BetaToolResultBlockParam[] = [];
        let progressChanged = false;
        for (const u of uses) {
          const r = runTool(u.name, u.input);
          progressChanged ||= !!r.progressChanged;
          results.push({ type: "tool_result", tool_use_id: u.id, content: r.content, ...(r.isError ? { is_error: true } : {}) });
        }
        const toolMsg: StoredMessage = { role: "user", content: results };
        conv.messages.push(toolMsg);
        saveConversation(conv);
        send({ type: "tool_results", message: toolMsg });
        if (progressChanged) send({ type: "progress", progress: getProgress() });
        continue;
      }
      default:
        return; // end_turn, stop_sequence, compaction...
    }
  }
  send({ type: "notice", level: "warn", text: "הגעתי למספר הסבבים המרבי בתור אחד." });
}

/**
 * After a mid-output fallback, blocks of the declined attempt that the API must not
 * see again (thinking, tool calls, unpaired server-tool calls) are dropped from
 * before the last `fallback` marker; everything after it is kept as is.
 */
function echoableContent(content: Beta.BetaContentBlock[]): Beta.BetaContentBlockParam[] {
  const boundary = content.map((b) => b.type).lastIndexOf("fallback");
  if (boundary < 0) return content as Beta.BetaContentBlockParam[];
  const resultIds = new Set(content.map((b) => (b as { tool_use_id?: string }).tool_use_id).filter(Boolean));
  return content.filter((b, i) => {
    if (i >= boundary) return true;
    if (b.type === "thinking" || b.type === "redacted_thinking" || b.type === "tool_use") return false;
    if (b.type === "server_tool_use") return resultIds.has(b.id);
    return true;
  }) as Beta.BetaContentBlockParam[];
}

/** After an interruption, answer any tool_use left without a result so the next request is valid. */
export function closeDanglingToolUses(conv: Conversation, reason = "Interrupted by the learner.") {
  const last = conv.messages[conv.messages.length - 1];
  if (!last || last.role !== "assistant") return;
  const uses = last.content.filter((b): b is Beta.BetaToolUseBlockParam => b.type === "tool_use");
  if (!uses.length) return;
  conv.messages.push({
    role: "user",
    content: uses.map((u) => ({ type: "tool_result", tool_use_id: u.id, content: reason, is_error: true })),
  });
  saveConversation(conv);
}
