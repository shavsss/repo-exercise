// One answer from the tutor: builds the input for `sample` (instructions turn, as much
// recent history as fits, and the new turn with study context and book pages) and
// gives Claude the page's tools.
import { create, all } from "mathjs";
import { BOOKS, getBook, readPages, searchBook } from "./books";
import { SYSTEM_PROMPT } from "./prompt";
import type { Progress, Runtime, SampleTool } from "./runtime";
import type { Activity, Effort, Mode, StoredMessage } from "./types";

const math = create(all, {});
const MODEL = "claude-opus-5-5";
const enc = new TextEncoder();
const bytes = (s: string) => enc.encode(s).length;
/** Leave room under the 256 KiB input cap for the tool rounds of this answer. */
const INPUT_BUDGET = 170_000;

const MODE_TEXT: Record<Mode, string> = {
  lesson: "lesson — a full section lesson (structure, depth bar ≥ ~4000 Hebrew words, story → thread → examples → case study → 4+ domains → exercises → product → next).",
  clarify: "clarify — a clarification answer with full depth, without the mandatory section scaffolding.",
  free: "free — follow the request while keeping the quality rules.",
};

function formatValue(v: unknown): string {
  try {
    if (v === undefined) return "";
    if (typeof v === "function") return "[function]";
    return math.format(v as any, { precision: 12 });
  } catch {
    return String(v);
  }
}

/** Evaluates a math.js script line by line; returns each line with its value. */
export function runCompute(script: string) {
  const scope = new Map<string, unknown>();
  const out: string[] = [];
  let ok = true;
  for (const raw of script.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    try {
      const v = math.evaluate(line, scope);
      const s = formatValue(v);
      out.push(s ? `${line}  →  ${s}` : line);
    } catch (e) {
      ok = false;
      out.push(`${line}  →  ERROR: ${(e as Error).message}`);
    }
  }
  const text = out.join("\n");
  return { ok, output: text.length > 12000 ? text.slice(0, 12000) + "\n…" : text };
}

/** Evaluates one expression with constants; used by chart and table blocks. */
export function evalExpr(expr: string, scope: Record<string, unknown>) {
  return math.evaluate(expr, { ...scope });
}

function studyContext(mode: Mode, progress: Progress, activeBook: string, withPages: boolean) {
  const lines = BOOKS.map((b) => {
    const p = progress[b.id];
    const loaded = getBook(b.id) ? "loaded" : "NOT loaded in this browser";
    return `- ${b.id} (${loaded}): ${p ? `at printed page ${p.page}${p.section ? `, last section: ${p.section}` : ""}` : "not started"}`;
  });
  let pages = "";
  const book = getBook(activeBook);
  const at = progress[activeBook]?.page;
  if (book && withPages && mode !== "free") {
    try {
      const start = at ?? book.pages.find((p) => p.label)?.label ?? "1";
      const by = at || book.pages.some((p) => p.label === start) ? "label" : "pdf";
      const idx = book.pages.findIndex((p) => (by === "label" ? p.label === start : p.pdf === Number(start)));
      // one page of lead-in, then forward from the learner's position
      const from = book.pages[Math.max(0, idx - 1)];
      const to = book.pages[Math.min(book.pages.length - 1, idx + (mode === "lesson" ? 7 : 2))];
      const r = readPages(activeBook, String(from.pdf), String(to.pdf), "pdf", mode === "lesson" ? 26000 : 12000);
      pages = `\nPages of ${activeBook} around the learner's position (printed ${r.fromLabel ?? "?"}–${r.toLabel ?? "?"}):\n${r.text}`;
    } catch {
      // position not found in this book's labels; the tutor can search
    }
  }
  return `<study_context>\nDate: ${new Date().toISOString().slice(0, 10)}\nActive book: ${activeBook}\nReading positions:\n${lines.join("\n")}\nRequested message type: ${MODE_TEXT[mode]}${pages}\n</study_context>`;
}

export interface TurnCallbacks {
  onText: (text: string) => void;
  onActivity: (a: Activity) => void;
  onProgress: (bookId: string, page: string, section: string) => Promise<void>;
}

export async function askTutor(opts: {
  rt: Runtime;
  history: StoredMessage[];
  text: string;
  mode: Mode;
  effort: Effort;
  images: File[];
  progress: Progress;
  activeBook: string;
  signal: AbortSignal;
  cb: TurnCallbacks;
  /** A continuation of an answer that hit the length limit: no new pages, no images. */
  continuing?: boolean;
}) {
  const { rt, history, text, mode, effort, images, progress, activeBook, signal, cb, continuing = false } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };

  const last = `${studyContext(mode, progress, activeBook, !continuing)}\n\n${text || "(ראו את התמונה המצורפת)"}${images.length ? `\n\n[${images.length} תמונות מצורפות מהלומד]` : ""}`;
  // newest history first, until the budget is used
  let used = bytes(SYSTEM_PROMPT) + bytes(last);
  const kept: { role: "user" | "assistant"; content: string }[] = [];
  let dropped = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i];
    if (!m.text.trim()) continue;
    const b = bytes(m.text);
    // the answer being continued must always be sent, even if long
    if (continuing && i === history.length - 1) {
      used += b;
      kept.unshift({ role: m.role, content: m.text });
      continue;
    }
    if (used + b > INPUT_BUDGET) {
      dropped = i + 1;
      break;
    }
    used += b;
    kept.unshift({ role: m.role, content: m.text });
  }
  while (kept.length && kept[0].role === "assistant") kept.shift();
  const intro = SYSTEM_PROMPT + (dropped ? `\n\n[${dropped} earlier turns of this conversation were omitted to fit the input limit.]` : "");

  const tools: SampleTool[] = [
    {
      name: "read_book_pages",
      description: "Read the text of a range of pages (inclusive) from one of the learner's books; about 8 pages per call. by=\"label\" uses printed page numbers (\"240\", or \"6-3\" in Feynman); by=\"pdf\" uses PDF indices.",
      inputSchema: {
        type: "object",
        properties: {
          book_id: { type: "string", enum: BOOKS.map((b) => b.id) },
          from: { type: "string" },
          to: { type: "string" },
          by: { type: "string", enum: ["label", "pdf"] },
        },
        required: ["book_id", "from", "to", "by"],
      },
      execute(input) {
        const a: Activity = { t: "read", book: String(input.book_id), from: String(input.from), to: String(input.to), by: String(input.by ?? "label"), ok: true };
        try {
          const r = readPages(a.book, a.from, a.to, a.by === "pdf" ? "pdf" : "label");
          cb.onActivity(a);
          return r.text;
        } catch (e) {
          cb.onActivity({ ...a, ok: false, note: (e as Error).message });
          throw e;
        }
      },
    },
    {
      name: "search_book",
      description: "Search one book for a phrase or terms (section headings like \"§13\", figures like \"Fig. 80\", names). Returns matching pages with printed labels and short snippets.",
      inputSchema: {
        type: "object",
        properties: { book_id: { type: "string", enum: BOOKS.map((b) => b.id) }, query: { type: "string" } },
        required: ["book_id", "query"],
      },
      execute(input) {
        const hits = searchBook(String(input.book_id), String(input.query));
        cb.onActivity({ t: "search", book: String(input.book_id), query: String(input.query), hits: hits.length });
        return hits.length ? hits : "No matches.";
      },
    },
    {
      name: "compute",
      description: "Evaluate a math.js script, one statement per line, variables persisting between lines (matrices, det, inv, eigs, derivative, simplify, trig with deg, units, fraction, bignumber). Returns every line with its value. Batch all the numbers you need into one call.",
      inputSchema: { type: "object", properties: { script: { type: "string" } }, required: ["script"] },
      execute(input) {
        const script = String(input.script ?? "");
        const r = runCompute(script);
        cb.onActivity({ t: "compute", script, output: r.output, ok: r.ok });
        return r.output || "(no output)";
      },
    },
    {
      name: "record_progress",
      description: "Record that a completed section lesson (or lesson part) covered the book up to a printed page. Call once, at the end.",
      inputSchema: {
        type: "object",
        properties: { book_id: { type: "string", enum: BOOKS.map((b) => b.id) }, page: { type: "string" }, section: { type: "string" } },
        required: ["book_id", "page", "section"],
      },
      async execute(input) {
        const [book, page, section] = [String(input.book_id), String(input.page), String(input.section ?? "")];
        await cb.onProgress(book, page, section);
        cb.onActivity({ t: "progress", book, page, section });
        return `Recorded ${book} → page ${page}.`;
      },
    },
  ];

  const canTools = !!(await rt.sample.limits().catch(() => null))?.tools;
  return rt.sample([{ role: "user", content: intro }, ...kept, { role: "user", content: last }], {
    model: MODEL,
    modelTier: "complex",
    effort,
    signal,
    ...(canTools ? { tools } : { cache: false }),
    ...(images.length && rt.canSendImages ? { images } : {}),
    onText: ({ text }) => cb.onText(text),
  });
}
