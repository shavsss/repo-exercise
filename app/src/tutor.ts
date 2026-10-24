// The tutor's calls to Claude through `sample`. Every call is memoryless, so each one
// carries the instructions turn, the course memory, as much recent history as fits,
// and the new turn with study context and book pages. A section lesson is written
// in planned parts (one call per part) so its length never depends on one long answer.
import { create, all } from "mathjs";
import { BOOKS, getBook, readPages, searchBook, sectionsAround } from "./books";
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

/** Evaluates one expression with constants; used by chart and table blocks. */
export function evalExpr(expr: string, scope: Record<string, unknown>) {
  return math.evaluate(expr, { ...scope });
}

export interface TurnCallbacks {
  onText: (text: string) => void;
  onActivity: (a: Activity) => void;
  onProgress: (bookId: string, page: string, section: string) => Promise<void>;
  onStatus?: (status: string) => void;
  /** a safe point to save: the plan exists and `partsDone` parts are written */
  onCheckpoint?: (plan: LessonPlan, partsDone: number, text: string) => void;
}

interface Base {
  rt: Runtime;
  history: StoredMessage[];
  mode: Mode;
  effort: Effort;
  progress: Progress;
  activeBook: string;
  memory: string;
  signal: AbortSignal;
  cb: TurnCallbacks;
}

type Turn = { role: "user" | "assistant"; content: string };

function studyContext(mode: Mode, progress: Progress, activeBook: string, memory: string, withPages: boolean) {
  const lines = BOOKS.map((b) => {
    const p = progress[b.id];
    const loaded = getBook(b.id) ? "loaded" : "not loaded";
    return `- ${b.id} (${loaded}): ${p ? `at printed page ${p.page}${p.section ? `, last section: ${p.section}` : ""}` : "not started"}`;
  });
  let pages = "";
  const book = getBook(activeBook);
  const at = progress[activeBook]?.page;
  if (book && withPages && mode !== "free") {
    try {
      const start = at ?? book.pages.find((p) => p.label)?.label ?? "1";
      const by = at || book.pages.some((p) => p.label === start) ? "label" : "pdf";
      const idx = Math.max(0, book.pages.findIndex((p) => (by === "label" ? p.label === start : p.pdf === Number(start))));
      // one page of lead-in, then forward from the learner's position
      const from = book.pages[Math.max(0, idx - 1)];
      const to = book.pages[Math.min(book.pages.length - 1, idx + (mode === "lesson" ? 7 : 2))];
      const r = readPages(activeBook, String(from.pdf), String(to.pdf), "pdf", mode === "lesson" ? 26000 : 12000);
      pages = `\nPages of ${activeBook} around the learner's position (printed ${r.fromLabel ?? "?"}–${r.toLabel ?? "?"}):\n${r.text}`;
    } catch {
      // position not found in this book's labels; the tutor can search
    }
  }
  const mem = memory.trim() ? `\n<course_memory>\n${memory.trim()}\n</course_memory>` : "";
  const sections = at ? sectionsAround(activeBook, at) : "";
  if (sections) pages = `\nSection map of ${activeBook} around the reader's position (start pages; a section ends where the next one starts):\n${sections}` + pages;
  return `<study_context>\nDate: ${new Date().toISOString().slice(0, 10)}\nActive book: ${activeBook}\nReading positions:\n${lines.join("\n")}\nRequested message type: ${MODE_TEXT[mode]}${mem}${pages}\n</study_context>`;
}

/** Newest history first, until the budget is used. `keepLast` always sends the last turn. */
function fitHistory(history: StoredMessage[], fixed: number, keepLast = false) {
  let used = fixed;
  const kept: Turn[] = [];
  let dropped = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i];
    if (!m.text.trim()) continue;
    const b = bytes(m.text);
    if (!(keepLast && i === history.length - 1) && used + b > INPUT_BUDGET) {
      dropped = i + 1;
      break;
    }
    used += b;
    kept.unshift({ role: m.role, content: m.text });
  }
  while (kept.length && kept[0].role === "assistant") kept.shift();
  const intro = SYSTEM_PROMPT + (dropped ? `\n\n[${dropped} earlier turns of this conversation were omitted to fit the input limit; <course_memory> summarizes the course so far.]` : "");
  return [{ role: "user", content: intro } as Turn, ...kept];
}

function buildTools(cb: TurnCallbacks, withProgress: boolean): SampleTool[] {
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
  ];
  if (withProgress)
    tools.push({
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
    });
  return tools;
}

async function canUseTools(rt: Runtime) {
  return !!(await rt.sample!.limits().catch(() => null))?.tools;
}

/** One answer (clarify / free / a continuation), with the page's tools. */
export async function askTutor(opts: Base & { text: string; images: File[]; continuing?: boolean }) {
  const { rt, history, text, mode, effort, images, progress, activeBook, memory, signal, cb, continuing = false } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const last = `${studyContext(mode, progress, activeBook, memory, !continuing)}\n\n${text || "(ראו את התמונה המצורפת)"}${images.length ? `\n\n[${images.length} תמונות מצורפות מהלומד]` : ""}`;
  const turns = fitHistory(history, bytes(SYSTEM_PROMPT) + bytes(last), continuing);
  const tools = (await canUseTools(rt)) ? buildTools(cb, true) : null;
  return rt.sample([...turns, { role: "user", content: last }], {
    model: MODEL,
    modelTier: "complex",
    effort,
    signal,
    ...(tools ? { tools } : { cache: false }),
    ...(images.length && rt.canSendImages ? { images } : {}),
    onText: ({ text }) => cb.onText(text),
  });
}

/* ---------------- section lessons, written in planned parts ---------------- */

export interface LessonPlan {
  section: string;
  pages: string;
  split?: { part: number; of: number };
  parts: { title: string; covers: string; blocks?: string[]; words?: number }[];
  facts?: string[];
  next?: string;
}

const PLAN_INSTRUCTIONS = `
PLANNING STEP. Do not write the text yet. The app will write it in parts, one call per part, from your plan.
1. Using the section map and pages in <study_context> (and read_book_pages / search_book), find the section that starts at or contains the reader's position, where it ends, and whether it opens a new chapter. Cover only this section (or this part of it, if it must be split across messages); never run into the next section. Find every example, figure, formula, claim and story in it.
2. Run compute (batched, one or two calls) for every number the lesson will state: worked examples, verifications of the book's results, the case study's numbers. Note any error you find in the book.
3. Reply with ONLY one JSON object:
{"chapter": "III Analytic geometry", "newChapter": false, "section": "§12 Theory of invariants", "pages": "238–241", "split": {"part": 1, "of": 1},
 "parts": [{"title": "…", "covers": "what this part teaches, which book examples and figures, which derivations", "blocks": ["story", "think", "history"], "words": 1200}],
 "facts": ["I1 = A + C = 6 for x^2-6xy+5y^2-2x+4y+3 (computed)", "…"],
 "next": "what the next message will cover"}
Rules for the plan: everything is written in the authors' voice (see <voice>), so describe the parts as sections of the expanded edition, not as commentary on the book; 3 to 5 parts; the words add up to at least 4200 Hebrew words; part 1 opens with the chapter opening if "newChapter" is true, then the section heading as in the book, then the story (the section's own story if it tells one) and the plan block when the section is split across messages, followed by the problem/why-hard/idea paragraphs; every derivation is planned step by step with no unexplained jumps; every example and figure of the section is assigned to exactly one part; the case study, the history block(s), at least four domain blocks, think questions, refresh blocks and figure reconstructions are assigned to parts; the last part holds the exercises (book + new), the product(s) if one truly fits, and the sentence about the next message. "facts" lists the computed values with what they mean, so later parts state them exactly.`.trim();

function partInstructions(plan: LessonPlan, k: number, writtenSoFar: string) {
  const p = plan.parts[k];
  const n = plan.parts.length;
  const last = k === n - 1;
  const prior = writtenSoFar.length > 60000 ? `[…start omitted…]\n${writtenSoFar.slice(-60000)}` : writtenSoFar;
  return `WRITING STEP: part ${k + 1} of ${n} of this section of the expanded edition. Write as the authors (see <voice>): never "the book says", "the authors write" or "in the text".
Lesson plan (yours, from the planning step):
${JSON.stringify(plan, null, 1)}

${prior ? `The lesson text written so far (parts 1–${k}), which the learner is reading right now:\n<<<\n${prior}\n>>>\n` : ""}
Now write ONLY part ${k + 1}: «${p.title}». It covers: ${p.covers}.${p.blocks?.length ? ` Blocks for this part: ${p.blocks.join(", ")}.` : ""}
Length: about ${p.words ?? 1100} Hebrew words of real teaching (more is fine, less is not).
${k === 0 ? "Start the lesson (no preamble about the plan or the parts)." : "Continue seamlessly from the last sentence above: no greeting, no recap, no repeated heading; open with the explicit transition from where the text stopped."}
Do not write material that belongs to later parts. Teach step by step: every step of a derivation on its own line with its reason in words. Put [[עמ' N]] at the paragraph where the printed page changes. State computed values exactly as in "facts" (run compute for anything new).
${last ? "This is the last part: finish with the exercises, the product block(s) if one truly fits, and the sentence about the next message. Then call record_progress (with \"(חלק k/n)\" in the section name if the section continues in another message)." : "Do not end the lesson and do not write exercises yet."}`;
}

export async function composeLesson(opts: Base & { text: string; resume?: { plan: LessonPlan; partsDone: number; text: string } }) {
  const { rt, history, text, effort, progress, activeBook, memory, signal, cb, resume } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const tools = await canUseTools(rt);
  const ctx = studyContext("lesson", progress, activeBook, memory, true);

  // 1) plan (kept from the saved draft when resuming)
  let plan = resume?.plan;
  if (!plan) {
    cb.onStatus?.("מתכנן את השיעור: קורא את הסעיף ומחשב את המספרים");
    const planTurn = `${ctx}\n\n${text}\n\n${PLAN_INSTRUCTIONS}`;
    plan = await rt.sample.json<LessonPlan>([...fitHistory(history, bytes(SYSTEM_PROMPT) + bytes(planTurn)), { role: "user", content: planTurn }], {
      model: MODEL,
      modelTier: "complex",
      effort,
      signal,
      ...(tools ? { tools: buildTools(cb, false) } : { cache: false }),
    });
    if (!plan || !Array.isArray(plan.parts) || !plan.parts.length) throw { code: "invalid_json", message: "no plan" };
    cb.onCheckpoint?.(plan, 0, "");
  }

  // 2) parts (from the first unwritten one)
  let written = resume?.text.trim() ?? "";
  let model = "";
  for (let k = resume?.partsDone ?? 0; k < plan.parts.length; k++) {
    cb.onStatus?.(`כותב חלק ${k + 1} מתוך ${plan.parts.length}: ${plan.parts[k].title}`);
    const before = written ? written + "\n\n" : "";
    let partText = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      // a part cut off at the length limit gets one continuation
      const turn = `${ctx}\n\n${text}\n\n${partInstructions(plan, k, (before + partText).trim())}${attempt ? "\n\nThe previous attempt of this part was cut off at the length limit; continue it exactly from where the text above stops." : ""}`;
      const res = await rt.sample([...fitHistory(history, bytes(SYSTEM_PROMPT) + bytes(turn)), { role: "user", content: turn }], {
        model: MODEL,
        modelTier: "complex",
        effort,
        signal,
        ...(tools ? { tools: buildTools(cb, k === plan.parts.length - 1) } : { cache: false }),
        onText: ({ text: t }) => cb.onText(before + partText + t),
      });
      partText += res.text;
      model = res.modelApplied ?? `רמת מודל: ${res.modelTierApplied}`;
      if (!res.truncated) break;
    }
    written = (before + partText).trim();
    cb.onText(written);
    cb.onCheckpoint?.(plan, k + 1, written);
  }
  return { text: written, plan, model };
}

/* ---------------- course memory ---------------- */

export const INITIAL_MEMORY = `# זיכרון הקורס

## מצב נוכחי
- מתמטיקה, כרך א': הלומד בעמ' 240, באמצע פרק III (גאומטריה אנליטית), §12 תורת האינווריאנטים.
- פיזיקה (פיינמן): טרם התחיל.

## מה נלמד
(עדיין אין שיעורים באפליקציה. עד עמ' 240 הלומד קרא לבד.)

## כלים ומושגים שנפגשו
- דטרמיננטה כיחס שטחים בטרנספורמציה אפינית (§11, נוסחה 21).

## סימונים ומוסכמות

## מקרי בוחן ותחומים שכבר שימשו

## טעויות שנמצאו בספר

## קשיים, שאלות פתוחות והעדפות
- רוצה עומק מלא, גזירות צעד אחר צעד, ולא מניח ידע מתקדם במתמטיקה ובפיזיקה.
`;

export async function updateMemory(rt: Runtime, memory: string, lesson: StoredMessage, request: string, progress: Progress) {
  if (!rt.sample) return null;
  const body = lesson.text.length > 90000 ? lesson.text.slice(0, 90000) + "\n[…]" : lesson.text;
  const prompt = `You maintain the running memory of a personal course in which a tutor teaches one learner from books, in Hebrew. The tutor reads this memory before every answer, so it is how later lessons refer back to earlier ones.

Current memory:
<<<
${memory || INITIAL_MEMORY}
>>>

Reading positions now: ${JSON.stringify(progress)}

The learner asked: ${request}

The tutor's latest answer (${lesson.mode}):
<<<
${body}
>>>

Rewrite the whole memory in Hebrew Markdown with exactly these sections, merging the new answer in and keeping everything still useful:
# זיכרון הקורס
## מצב נוכחי — where the learner is in each book and what comes next.
## מה נלמד — one entry per section taught: book, pages, the key ideas in one or two lines, key formulas in LaTeX.
## כלים ומושגים שנפגשו — each tool/concept: where it was first met and the number from that first example (the tutor uses this to refresh tools later).
## סימונים ומוסכמות — notation choices to keep consistent.
## מקרי בוחן ותחומים שכבר שימשו — so later lessons do not repeat them.
## טעויות שנמצאו בספר — page, what is wrong, what is right.
## קשיים, שאלות פתוחות והעדפות — what the learner found hard, asked, or prefers.
Keep it under about 1800 words; compress older entries rather than dropping them. Reply with the memory only.`;
  const res = await rt.sample(prompt, { modelTier: "default", effort: "low", cache: false });
  return res.text.trim();
}
