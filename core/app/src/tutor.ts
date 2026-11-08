// The tutor's calls to Claude through `sample`. Every call is memoryless, so each one
// carries the instructions turn, the course memory, as much recent history as fits,
// and the new turn with the module, the lesson plan and the source pages.
// Entering a module: one call splits it into lessons that together cover every
// section of its sources (checked by the app). A lesson: one planning call, then one
// call per part, so its length never depends on one long answer.
import { create, all } from "mathjs";
import { docMeta, getIndex, readPages, searchLibrary, type Module } from "./library";
import { curriculumBlock } from "./curriculum";
import { auditLong, namedModules, type AuditMark, applyRepair } from "./lessonAudit";
import { decideLine, decideSlot } from "./lessonGate";
import { LEGACY_RULES, SYSTEM_PROMPT, libraryList } from "./prompt";
import type { Runtime, SampleTool } from "./runtime";
import { BOOK_PART, BOOK_PLAN, LESSON_WORDS, OUTLINE_FIX, lessonWords, normalizeOutline, orderProblems, outlineCheckPrompt, parseOutlineReview, partSections, tightenPrompt, validOutline, wordCount, type BookOutline } from "./bookRules";
import { NOTE_KIND_LABEL, type Activity, type Effort, type LessonNote, type LessonSpec, type Mode, type NoteKind, type StoredMessage } from "./types";

const math = create(all, {});
const MODEL = "claude-opus-5-5";
const enc = new TextEncoder();
const bytes = (s: string) => enc.encode(s).length;
/** Leave room under the 256 KiB input cap for the tool rounds of this answer. */
const INPUT_BUDGET = 190_000;
/** Source text sent with a lesson turn (the tutor reads more with tools). */
const LESSON_PAGES_CHARS = 95_000;

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

/** Evaluates one expression with constants; used by chart, table and animation blocks. */
export function evalExpr(expr: string, scope: Record<string, unknown>) {
  return math.evaluate(expr, { ...scope });
}
export function compileExpr(expr: string) {
  return math.compile(expr);
}

/** Which parts of the standing instructions a call carries. */
export interface PromptOpts {
  /** the module has analysis references (role ref): include section ח and the reference books */
  refs?: boolean;
  /** planning only: the book and the library, without the goal and the teaching rules */
  lean?: boolean;
  /** diagnostics: drop the goal and sections ט–י (level 2.5, gradualness) */
  no25?: boolean;
  /** diagnostics: drop one section of the teaching rules (its Hebrew letter), or keep only that one */
  drop?: string;
  only?: string;
}

/** Splits the teaching rules into their lettered sections (א. … ב. …). */
function ruleSections(p: string) {
  const body = /<teaching_rules>\n([\s\S]*?)<\/teaching_rules>/.exec(p)?.[1] ?? "";
  const parts = body.split(/\n(?=[א-ת]\. )/);
  return { head: parts[0].match(/^[א-ת]\. /) ? "" : parts.shift() ?? "", sections: parts };
}

/** Documents used only as analysis references (B14–B17), listed only for modules that use them. */
function refDocs() {
  const mods = getIndex()?.modules ?? [];
  const used = new Map<string, boolean>();
  for (const m of mods) for (const s of m.sources) used.set(s.doc, (used.get(s.doc) ?? true) && s.role === "ref");
  return new Set([...used].filter(([, onlyRef]) => onlyRef).map(([d]) => d));
}

export function hasRefs(m: Module) {
  return m.sources.some((s) => s.role === "ref");
}

const promptCache = new Map<string, string>();
export function systemPrompt(o: PromptOpts = {}) {
  const key = JSON.stringify([!!o.refs, !!o.lean, !!o.no25, o.drop ?? "", o.only ?? ""]);
  const hit = promptCache.get(key);
  if (hit) return liteSystem(hit);
  const refs = refDocs();
  const docs = Object.fromEntries(Object.entries(getIndex()?.docs ?? {}).filter(([id]) => o.refs || !refs.has(id)));
  let p = SYSTEM_PROMPT.replace("${LIBRARY}", libraryList(docs));
  // section ח (rules 33–37) only matters where the module has analysis references
  if (!o.refs) p = p.replace(/\n*ח\. מהביצועים לתוצאה[\s\S]*?(?=\n+ט\. רמה 2\.5)/, "");
  if (o.no25 || o.lean) p = p.replace(/<goal>[\s\S]*?<\/goal>\n*/, "").replace(/\n*ט\. רמה 2\.5[\s\S]*?(?=<\/teaching_rules>)/, "\n");
  if (o.drop || o.only) {
    const { head, sections } = ruleSections(p);
    const kept = sections.filter((s) => (o.only ? s.startsWith(o.only + ". ") : !s.startsWith(o.drop + ". ")));
    p = p.replace(/<teaching_rules>\n[\s\S]*?<\/teaching_rules>/, `<teaching_rules>\n${head}\n${kept.join("\n")}\n</teaching_rules>`);
  }
  if (o.lean) p = p.replace(/<teaching_rules>[\s\S]*?<\/teaching_rules>\n*/, "");
  promptCache.set(key, p);
  return liteSystem(p);
}

/** The system prompt holds the rules of 1.11; the bench's "current" rules put back the older wording (LEGACY_RULES). */
function liteSystem(p: string) {
  if (LESSON_RULES === "lite") return p;
  return LEGACY_RULES.reduce((q, [now, old]) => q.replace(now, old), p);
}


export interface TurnCallbacks {
  onText: (text: string) => void;
  onActivity: (a: Activity) => void;
  onStatus?: (status: string) => void;
  /** a safe point to save: the part plan exists and `partsDone` parts are written */
  onCheckpoint?: (plan: PartPlan, partsDone: number, text: string) => void;
  /** the tutor saved a point to the lesson's shared notebook */
  onNote?: (kind: NoteKind, text: string, addTo?: string) => Promise<void> | void;
  /** a refused call was diagnosed (see onRefusal) */
  onDiag?: (d: Record<string, unknown>) => Promise<void> | void;
}

interface Base {
  rt: Runtime;
  history: StoredMessage[];
  effort: Effort;
  module: Module;
  lessons: LessonSpec[] | undefined;
  lessonIdx: number;
  memory: string;
  /** this lesson's shared notebook so far */
  notes?: LessonNote[];
  /** the rest of the notebook (other lessons and modules), so the tutor can relate to it */
  allNotes?: LessonNote[];
  /** modules the learner finished, for <reader_stage> */
  done?: string[];
  signal: AbortSignal;
  cb: TurnCallbacks;
}

type Turn = { role: "user" | "assistant"; content: string };

const TIER_TEXT = { core: "ליבה", adv: "מתקדם", ref: "עיון" };

/** "Answers to Selected Problems" appendices (PDF pages); they are not taught, only used to check exercises. */
const ANSWER_KEYS: Record<string, [number, number]> = { B02: [936, 941], B02a: [848, 853] };

function moduleBlock(m: Module) {
  const srcs = m.sources
    .map((s) => {
      const d = docMeta(s.doc);
      const role = s.role === "main" ? "main source" : s.role === "supp" ? "supplement" : s.role === "ref" ? "analysis reference (not lesson material; read with read_source_pages for the from-performance-to-outcome section and the analysis-design exercise)" : "article";
      return `- ${role}: ${s.doc} (${d?.short ?? s.doc}), PDF pages ${s.pages[0]}–${s.pages[1]}${s.note ? `: ${s.note}` : ""}`;
    })
    .join("\n");
  const secs = m.sections.map((s) => `- ${s.doc}:${s.page} ${s.title}`).join("\n");
  const keys = moduleDocs(m)
    .filter((d) => ANSWER_KEYS[d])
    .map((d) => `${d} PDF pages ${ANSWER_KEYS[d].join("–")}`)
    .join("; ");
  return `Module ${m.id} «${m.title}» (${m.en}), tier: ${m.tier} (${TIER_TEXT[m.tier]})${m.prereq?.length ? `, after: ${m.prereq.join(", ")}` : ""}
Sources:
${srcs}
${secs ? `Section headings in these pages (DOC:PAGE title):\n${secs}` : "No section headings were detected; use the pages themselves."}${keys ? `\nAnswer keys of the books' end-of-chapter problems (check your solutions of book exercises against them): ${keys}` : ""}${LESSON_RULES === "lite" && FEATURES.has("curriculum") ? curriculumBlock(m) : ""}`;
}

function planBlock(lessons: LessonSpec[] | undefined, idx: number) {
  if (!lessons?.length) return "";
  return `Lesson plan of this module:\n${lessons
    // the focus is sent only for this lesson: the other lessons' notes are not needed to write it
    .map((l, i) => `${i + 1}. ${l.title}${i === idx ? "  ← THIS LESSON" : ""}\n   covers: ${l.covers.join("; ")}\n   pages: ${l.sources.map((s) => `${s.doc} ${s.pages[0]}–${s.pages[1]}`).join(", ")}${i === idx ? `\n   focus: ${l.focus}` : ""}`)
    .join("\n")}`;
}

async function lessonPages(lesson: LessonSpec | undefined, m: Module) {
  const ranges = lesson?.sources?.length ? lesson.sources : m.sources.filter((s) => s.role !== "article" && s.role !== "ref").map((s) => ({ doc: s.doc, pages: s.pages }));
  const total = ranges.reduce((s, r) => s + (r.pages[1] - r.pages[0] + 1), 0) || 1;
  const parts: string[] = [];
  for (const r of ranges) {
    const share = Math.max(12000, Math.floor((LESSON_PAGES_CHARS * (r.pages[1] - r.pages[0] + 1)) / total));
    try {
      const { text } = await readPages(r.doc, r.pages[0], r.pages[1], share);
      parts.push(text);
    } catch (e) {
      parts.push(`[${r.doc} ${r.pages[0]}–${r.pages[1]} could not be loaded: ${(e as Error).message}]`);
    }
  }
  return parts.join("\n\n");
}

/** The learner's stage (rules 41–45): what is familiar, so examples, terms and connections are gradual. */
function readerStage(m: Module, done: string[] = []) {
  const n = Number(/\d+/.exec(m.part)?.[0] ?? 0);
  const gate = n === 0;
  const idx = getIndex();
  const mods = idx?.modules ?? [];
  const finished = done.filter((id) => mods.some((x) => x.id === id));
  const parts = [...new Set(finished.map((id) => mods.find((x) => x.id === id)?.part).filter(Boolean))].map((p) => `${p} · ${idx?.parts.find((x) => x.id === p)?.title ?? ""}`);
  return `<reader_stage>
${gate ? "שלב השער (P0): עוד אף תחום ליבה לא נלמד; ההסבר הטכני, המונחים ומפת התחומים לפי כללים 41–45." : "הרמה המלאה (מ-P1): מנגנונים מכל תחום וחיבורים מלאים, כולל הפיזיקה של התחום השני; מנגנון שעוד לא נלמד מקבל משפט הקדמה."} המודול הנוכחי: ${m.id}, בחלק ${m.part}.
מודולים שהלומד סיים: ${finished.length ? finished.slice(-40).join(", ") : "עוד אף אחד"}.
חלקים שהלומד למד בהם: ${parts.length ? parts.join("; ") : "עוד אף אחד"}.
</reader_stage>`;
}

function studyContext(o: { mode: Mode; module: Module; lessons?: LessonSpec[]; lessonIdx: number; memory: string; pages?: string; notes?: LessonNote[]; allNotes?: LessonNote[]; done?: string[] }) {
  const mem = o.memory.trim() ? `\n<course_memory>\n${o.memory.trim()}\n</course_memory>` : "";
  const nb = o.notes?.length
    ? `\n<lesson_notebook>\nThe shared notebook of this lesson. "written by the learner" is his own thought (he brings one to the chat when he wants to discuss it); "saved by you" was saved by the tutor at his request and is not his own writing:\n${o.notes
        .slice(0, 60)
        .map((n) => `- (id ${n.id ?? "?"}) [${NOTE_KIND_LABEL[n.kind]}, ${n.who === "tutor" ? "saved by you" : "written by the learner"}] ${n.text.replace(/\s+/g, " ").slice(0, 600)}`)
        .join("\n")}\n</lesson_notebook>`
    : "";
  const rest = o.allNotes?.length
    ? `\n<notebook>\nThe rest of the shared notebook, from other lessons (articles in full, other items shortened). When something in this lesson connects to an item here, say so in the lesson ("this is close to point 3 of the article idea about …"):\n${o.allNotes
        .slice(0, 50)
        .map((n) => `- (id ${n.id ?? "?"}) [${NOTE_KIND_LABEL[n.kind]}, ${n.moduleId}, ${n.who === "tutor" ? "saved by you" : "written by the learner"}] ${n.kind === "article" ? n.text.slice(0, 1500) : n.text.replace(/\s+/g, " ").slice(0, 220)}`)
        .join("\n")}\n</notebook>`
    : "";
  const plan = planBlock(o.lessons, o.lessonIdx);
  return `<study_context>
Date: ${new Date().toISOString().slice(0, 10)}
Requested message type: ${o.mode}
${moduleBlock(o.module)}
${readerStage(o.module, o.done)}
${plan}${mem}${nb}${rest}${o.pages ? `\n\nSource pages for this lesson:\n${o.pages}` : ""}
</study_context>`;
}

/** Newest history first, until the budget is used. `keepLast` always sends the last turn. */
function fitHistory(history: StoredMessage[], fixed: number, keepLast = false, p: PromptOpts = {}) {
  let used = fixed + bytes(systemPrompt(p));
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
  const intro = systemPrompt(p) + (dropped ? `\n\n[${dropped} earlier turns of this conversation were omitted to fit the input limit; <course_memory> summarizes the course so far.]` : "");
  return [{ role: "user", content: intro } as Turn, ...kept];
}

function buildTools(cb: TurnCallbacks, docs: string[]): SampleTool[] {
  const all = Object.keys(getIndex()?.docs ?? {});
  return [
    {
      name: "read_source_pages",
      description: "Read the text of a range of PDF pages (inclusive, up to about 15) of one library document. Pages come with their [[DOC:PAGE]] tags, printed page numbers and the figures on them.",
      inputSchema: {
        type: "object",
        properties: { doc: { type: "string", enum: all }, from: { type: "number" }, to: { type: "number" } },
        required: ["doc", "from", "to"],
      },
      async execute(input) {
        const doc = String(input.doc);
        const from = Number(input.from);
        const to = Math.min(Number(input.to), from + 16);
        const a: Activity = { t: "read", doc, from, to, ok: true };
        try {
          const r = await readPages(doc, from, to, 50000);
          cb.onActivity(a);
          return r.text;
        } catch (e) {
          cb.onActivity({ ...a, ok: false, note: (e as Error).message });
          throw e;
        }
      },
    },
    {
      name: "search_library",
      description: "Search the library for a term, system, equation or figure. By default searches this module's sources; pass docs to search other documents (ids from the library list). Returns pages with tags and snippets.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string" }, docs: { type: "array", items: { type: "string", enum: all } } },
        required: ["query"],
      },
      async execute(input) {
        const q = String(input.query);
        const list = Array.isArray(input.docs) && input.docs.length ? (input.docs as string[]) : docs;
        const hits = await searchLibrary(q, list);
        cb.onActivity({ t: "search", query: q, hits: hits.length });
        return hits.length ? hits.map((h) => ({ tag: `[[${h.doc}:${h.page}]]`, printed: h.label, snippet: h.snippet })) : "No matches.";
      },
    },
    ...(cb.onNote
      ? [
          {
            name: "save_lesson_note",
            description:
              "Save a point to the lesson's shared notebook (the learner's and yours): an article idea, a question for an expert interview, a point to study more deeply, or a short note. Hebrew, self-contained (read later, outside the lesson). Only with his agreement: when he asks («שמור את זה», «תוסיף למחברת»), or after you offered it in one line at the end of an answer in a discussion and he said yes. Never on your own initiative, and never while writing a lesson. No duplicates (see <lesson_notebook> and <notebook>). To add a point to an existing item, pass its id as add_to. When he asks to add something, add exactly that.",
            inputSchema: {
              type: "object" as const,
              properties: { kind: { type: "string", enum: ["article", "interview", "deepen", "note"] }, text: { type: "string" }, add_to: { type: "string", description: "id of an existing notebook item to append this point to" } },
              required: ["kind", "text"],
            },
            async execute(input: Record<string, unknown>) {
              const kind = (["article", "interview", "deepen", "note"].includes(String(input.kind)) ? input.kind : "note") as NoteKind;
              const t = String(input.text ?? "").trim();
              if (!t) return "Empty note, nothing saved.";
              const addTo = input.add_to ? String(input.add_to) : undefined;
              await cb.onNote!(kind, t, addTo);
              cb.onActivity({ t: "note", kind: NOTE_KIND_LABEL[kind], text: t });
              return addTo ? `Added as a new point to notebook item ${addTo}.` : `Saved to the lesson notebook as ${NOTE_KIND_LABEL[kind]}.`;
            },
          } satisfies SampleTool,
        ]
      : []),
    {
      name: "compute",
      description: "Evaluate a math.js script, one statement per line, variables persisting between lines (complex numbers, matrices, det, inv, eigs, derivative, simplify, units like 10 GHz to Hz, log10, bignumber). Returns every line with its value. Batch all the numbers you need into one call.",
      inputSchema: { type: "object", properties: { script: { type: "string" } }, required: ["script"] },
      execute(input) {
        const script = String(input.script ?? "");
        const r = runCompute(script);
        cb.onActivity({ t: "compute", script, output: r.output, ok: r.ok });
        return r.output || "(no output)";
      },
    },
  ];
}

const moduleDocs = (m: Module) => [...new Set(m.sources.map((s) => s.doc))];

/* ---------------- module plan: lessons that cover every section ---------------- */

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}.]+/gu, " ").trim();

/** Sections of the module that no lesson lists in `covers`. */
export function uncoveredSections(m: Module, lessons: LessonSpec[]) {
  const covered = lessons.flatMap((l) => l.covers.map(norm));
  return m.sections.filter((s) => !covered.some((c) => c.includes(norm(s.title)) || norm(s.title).includes(c))).map((s) => s.title);
}

/** Page runs of the module's books (main sources and supplements) that no lesson's pages include. */
export function uncoveredPages(m: Module, lessons: LessonSpec[]) {
  const out: { doc: string; pages: [number, number] }[] = [];
  for (const src of m.sources) {
    if (src.role === "article" || src.role === "ref") continue;
    const inLesson = (p: number) => lessons.some((l) => l.sources.some((s) => s.doc === src.doc && s.pages[0] <= p && p <= s.pages[1]));
    let start = 0;
    for (let p = src.pages[0]; p <= src.pages[1] + 1; p++) {
      const missing = p <= src.pages[1] && !inLesson(p);
      if (missing && !start) start = p;
      if (!missing && start) {
        out.push({ doc: src.doc, pages: [start, p - 1] });
        start = 0;
      }
    }
  }
  return out;
}

/** Adds a page run to the lesson whose pages of the same document are nearest; returns that lesson. */
function attachPages(lessons: LessonSpec[], doc: string, [a, b]: [number, number]) {
  let best = lessons[lessons.length - 1];
  let bd = Infinity;
  for (const l of lessons)
    for (const s of l.sources)
      if (s.doc === doc) {
        const d = b < s.pages[0] ? s.pages[0] - b : a > s.pages[1] ? a - s.pages[1] : 0;
        if (d < bd) [best, bd] = [l, d];
      }
  const src = best.sources.find((s) => s.doc === doc);
  // extend a range only across a small gap; otherwise list the run as its own range
  if (src && bd <= 3) src.pages = [Math.min(src.pages[0], a), Math.max(src.pages[1], b)];
  else best.sources.push({ doc, pages: [a, b] });
  return best;
}

export async function planModule(o: { rt: Runtime; module: Module; memory: string; effort: Effort; signal: AbortSignal; cb: TurnCallbacks }): Promise<{ lessons: LessonSpec[]; uncovered: string[]; uncoveredPages: { doc: string; pages: [number, number] }[] }> {
  const { rt, module: m, memory, effort, signal, cb } = o;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  cb.onStatus?.("קורא את מקורות המודול ומחלק אותו לשיעורים");
  // the opening of every source range, so the plan sees what each part is about
  const peek: string[] = [];
  for (const s of m.sources.filter((x) => x.role !== "ref")) {
    try {
      const { text } = await readPages(s.doc, s.pages[0], Math.min(s.pages[1], s.pages[0] + 1), 3500);
      peek.push(text);
    } catch {
      // not loaded; the section list still guides the plan
    }
  }
  const ask = (feedback = "") => `${studyContext({ mode: "lesson", module: m, lessonIdx: -1, memory })}

The opening pages of each source, for orientation:
${peek.join("\n\n")}

MODULE PLANNING STEP. Split this module into lessons. Do not teach yet.
1. Every section heading listed above must be covered by exactly one lesson, fully, and every page of every main source and supplement must fall inside the "sources" pages of some lesson (the app checks both). If no headings were detected for a source, read its pages and split it by the topics you find there. Supplements and articles are folded into the lesson whose topic they extend (articles: only what they add beyond the books). Analysis references are not lesson material: leave them out of the lessons' "sources".
2. Where two sources treat the same topic, put them in the same lesson and say in "focus" how they are combined, so nothing is taught twice and nothing is left out.
3. Each lesson must hold enough for the depth bar (${LESSON_RULES === "lite" ? "one or two central results at full depth, with no word target" : "about 4000 Hebrew words for a core or advanced module"}) without being cramped: as a rule of thumb 10–20 dense book pages per lesson. Keep the order of the main source unless the logic of prerequisites says otherwise.
4. Write every "title" and "focus" in plain engineering language: the physics, the signals, the receivers and links, and published system parameters. Name each topic by its engineering content (interference, signal-to-interference ratio, detection range) rather than by what it is used against.
5. Reply with ONLY a JSON array: [{"title": "Hebrew lesson title", "covers": ["exact section headings as listed"], "sources": [{"doc": "B02", "pages": [96, 110]}], "focus": "what the lesson teaches, which examples and figures, how sources are combined"}]${feedback}`;
  let lessons: LessonSpec[] = [];
  let uncovered: string[] = [];
  let gaps: { doc: string; pages: [number, number] }[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const missed = [
      ...(uncovered.length ? [`these sections are not in any lesson's "covers": ${uncovered.join("; ")}`] : []),
      ...(gaps.length ? [`these pages are not in any lesson's "sources": ${gaps.map((g) => `${g.doc} ${g.pages[0]}–${g.pages[1]}`).join(", ")}`] : []),
    ];
    const turn = ask(attempt ? `\n\nYour previous plan left gaps: ${missed.join("; and ")}. Return the full plan again with everything covered.` : "");
    const call = (lean: boolean) =>
      rt.sample!.json<LessonSpec[]>([...fitHistory([], bytes(turn), false, { lean, refs: hasRefs(m) }), { role: "user", content: turn }], {
        model: MODEL,
        modelTier: "complex",
        effort,
        signal,
        ...(rt.canUseTools ? { tools: buildTools(cb, moduleDocs(m)) } : { cache: false }),
      });
    // a refused plan is retried once with the book and library only, without the teaching rules
    const res = await call(false).catch((e) => {
      if ((e as { code?: string })?.code !== "refused") throw e;
      cb.onStatus?.("מנסה שוב את החלוקה בהנחיות מקוצרות");
      return call(true);
    });
    lessons = (Array.isArray(res) ? res : [])
      .filter((l) => l && typeof l.title === "string")
      .map((l) => ({
        title: l.title,
        covers: Array.isArray(l.covers) ? l.covers.map(String) : [],
        sources: (Array.isArray(l.sources) ? l.sources : []).filter((s) => s && docMeta(s.doc) && Array.isArray(s.pages)).map((s) => ({ doc: s.doc, pages: [Number(s.pages[0]), Number(s.pages[1] ?? s.pages[0])] as [number, number] })),
        focus: String(l.focus ?? ""),
      }));
    if (!lessons.length) throw { code: "invalid_json", message: "no lessons" };
    uncovered = uncoveredSections(m, lessons);
    gaps = uncoveredPages(m, lessons);
    if (!uncovered.length && !gaps.length) break;
  }
  // anything still missing goes to the lesson whose pages are nearest, so nothing is dropped
  for (const title of uncovered) {
    const sec = m.sections.find((s) => s.title === title)!;
    attachPages(lessons, sec.doc, [sec.page, sec.page]).covers.push(title);
  }
  // pages still outside every lesson (after the sections were placed) join the nearest lesson too
  const pageGaps = uncoveredPages(m, lessons);
  for (const g of pageGaps) attachPages(lessons, g.doc, g.pages);
  return { lessons, uncovered, uncoveredPages: pageGaps };
}

/* ---------------- one answer (clarify / free / quiz / continuation) ---------------- */

export async function askTutor(opts: Base & { mode: Mode; text: string; images: File[]; continuing?: boolean; maps?: string }) {
  const { rt, history, text, mode, effort, images, module: m, lessons, lessonIdx, memory, notes, allNotes, done, signal, cb, continuing = false, maps } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const extra = mode === "quiz" && !continuing ? `\n\n${maps ? `<lesson_maps>\nWhat each lesson of the module taught in full (core) and what it only introduced (preview of a later module, or an illustration from a field):\n${maps}\n</lesson_maps>\n\n` : ""}${QUIZ_INSTRUCTIONS}` : "";
  const last = `${studyContext({ mode, module: m, lessons, lessonIdx, memory, notes, allNotes, done })}\n\n${text || "(ראו את התמונה המצורפת)"}${images.length ? `\n\n[${images.length} תמונות מצורפות מהלומד]` : ""}${extra}`;
  const turns = fitHistory(history, bytes(last), continuing, { refs: hasRefs(m) });
  return rt.sample([...turns, { role: "user", content: last }], {
    model: MODEL,
    modelTier: "complex",
    effort,
    signal,
    ...(rt.canUseTools ? { tools: buildTools(cb, moduleDocs(m)) } : { cache: false }),
    ...(images.length && rt.canSendImages ? { images } : {}),
    onText: ({ text }) => cb.onText(text),
  });
}

const QUIZ_INSTRUCTIONS = `MODULE QUIZ. If the learner has not answered yet: write a quiz of 6–8 questions on the whole module (all its lessons, per the plan and <course_memory>): about half are engineering calculations with real numbers (verify your own solutions with compute first), the rest are reasoning and analyst questions about real systems. Ask only about what the module taught in full: calculations, derivations and formula questions only on the core material (the "core" items of <lesson_maps> when given). A topic a lesson only introduced (a first look at a later module, or an illustration from a field) is asked about, if at all, only at the level of its idea in words (what it says, why it matters), never by computing or solving with its formula. Formats: mix them, about a third each. (1) Multiple choice: four options labeled א, ב, ג, ד, exactly one correct, the wrong ones built from real mistakes; (2) short answers: true or false with a one-line reason, a number with its units, or an explanation in two sentences; (3) one or two worked problems, only on core material. Before you write, check every question against <lesson_maps>: if it needs a formula, a derivation or a number from an item listed under preview or example, or in <idea_only>, rewrite it as an idea question or drop it. Do not reveal answers.
Layout (the page turns it into a form with an answer box under each question): first two or three sentences in Hebrew (what the quiz covers and how long it should take), then ALL the questions inside ONE fenced block whose language is quiz, and nothing after the block. Inside the block, each question opens with its own header line "## <number> | <type>", type mc for (1), short for (2), problem for (3); under it the question text (Markdown and $math$ allowed, several lines if needed). An mc question then lists exactly four options, one per line, as "- א) …", "- ב) …", "- ג) …", "- ד) …". No answer lines, hints or solutions inside the block. Example:
\`\`\`quiz
## 1 | mc
<question>
- א) <option>
- ב) <option>
- ג) <option>
- ד) <option>
## 2 | short
<question>
## 3 | problem
<question>
\`\`\`
The learner answers in the form and sends all the answers in one message.
If the learner has answered: grade every answer (correct / partly / wrong), explain each mistake step by step with the worked solution, give a score out of 100 as "[[ציון: N/100]]", and say which lessons to revisit.`;

/* ---------------- a lesson, written in planned parts ---------------- */

export interface PartPlan {
  title: string;
  parts: { title: string; covers: string; blocks?: string[]; l25?: string[]; words?: number; units?: number; sections?: string[] }[];
  /** the lesson as chapters of a book (bookRules.ts): the outline the parts are written from */
  outline?: BookOutline;
  results?: string[];
  figures?: string[];
  facts?: string[];
  next?: string;
}

const PART_PLAN_INSTRUCTIONS = `
LESSON PLANNING STEP. Do not write the text yet. The app will write the lesson in parts, one call per part, from your plan.
1. Read the source pages in <study_context> for THIS LESSON (use read_source_pages for anything cut off). Find every section it must cover, every derivation, worked example, figure, table and story in them, and where the sources overlap.
2. Run compute (batched, one or two calls) for every number the lesson will state: worked examples, verifications of the sources' results, the case study's numbers. Note any error you find.
3. Reply with ONLY one JSON object:
{"title": "Hebrew lesson title",
 "parts": [{"title": "…", "covers": "which sections/pages, which derivations, which figures and examples, which simulator", "blocks": ["story", "think", "history", "figure", "sim"], "l25": ["מבנה", "מקור"], "words": 1200}],
 "figures": ["B02:115:0", "…every figure of these pages, each assigned to a part"],
 "facts": ["SNR = 13.2 dB at R = 50 km for σ = 1 m² (computed)", "…"],
 "next": "what the next lesson covers"}
Write the plan (titles, "covers", "facts", "next") in plain engineering language: physics, signals, receivers, links, and published system parameters. Name every topic by its engineering content (interference and the signal-to-interference ratio, detection range, link margin), the case study as an engineering design question, and the exercises as engineering calculations; do not frame anything as attacking, defeating or targeting.
Rules for the plan: 3 to 5 parts; for a core or advanced module the words add up to at least 4200 Hebrew words unless the assigned material is genuinely short (then say so in the first part); part 1 opens with the plan block and the story, then the problem/why-hard/idea paragraphs; every derivation is planned step by step; the parts are organized by topic, not by page order: the book is the basis, not something to retell page by page (rule 9ב); every assigned section and every figure is assigned to exactly one part; every new concept is planned within one part in the order of rule 6א (the context, its general definition in a definition block, how it is built, and only then a separate example); formula blocks only for general results the course returns to (rule 6ב); all seven level-2.5 sections ("l25") are assigned to parts for the lesson's central results; the case study, history block(s), the connections by <reader_stage> (a fieldmap block for every new central formula, at least four full domain blocks in every lesson, in the gateway stage P0, for a field not yet learned, at the level of what the system does, with the mechanism left to its module; from P1 on, full, including the mechanism; technical explanations only from familiar ground, rules 41–45), think questions (about six in the lesson, at real decision points), refresh blocks, simulators and figures are assigned to parts; the last part holds the coverage block, the keep block (rule 6ד), the exercises, the fieldsystems block (if a real connection exists) and the sentence about the next lesson.`.trim();

function partInstructions(plan: PartPlan, k: number, writtenSoFar: string) {
  if (plan.outline && LESSON_RULES === "lite") return bookPartInstructions(plan, k, writtenSoFar);
  const p = plan.parts[k];
  const n = plan.parts.length;
  const last = k === n - 1;
  const prior = writtenSoFar.length > 60000 ? `[…start omitted…]\n${writtenSoFar.slice(-60000)}` : writtenSoFar;
  return `WRITING STEP: part ${k + 1} of ${n} of this lesson. Write as the authors (see <voice>).
Lesson plan (yours, from the planning step): «${plan.title}», ${n} parts:
${plan.parts.map((x, i) => `${i + 1}. ${x.title}${i === k ? "  ← THIS PART" : ""}`).join("\n")}
${plan.results?.length ? `Central results: ${plan.results.join("; ")}\n` : ""}Figures of the lesson: ${(plan.figures ?? []).join(", ") || "none"}.
Computed facts: ${(plan.facts ?? []).map((f) => `\n- ${f}`).join("")}
${last && plan.next ? `Next lesson: ${plan.next}` : ""}

${prior ? `The lesson text written so far (parts 1–${k}), which the learner is reading right now:\n<<<\n${prior}\n>>>\n` : ""}
Now write ONLY part ${k + 1}: «${p.title}». It covers: ${p.covers}.${p.blocks?.length ? ` Blocks for this part: ${p.blocks.join(", ")}.` : ""}${p.l25?.length ? ` Level-2.5 sections for this part: ${p.l25.join(", ")}.` : ""}
${LESSON_RULES === "lite" ? (p.units ? `Depth units in this part: about ${p.units}. That is about ${p.units * 30} counted words of running text (orientation, not a target); past about ${Math.round(p.units * 45)} counted words the part holds padding, and only the padding is cut. Uncounted: think questions, level-3 and decide blocks, keep, exercises, today, coverage, figures and scene JSON.` : "Depth units in this part: as planned.") : `Length: about ${p.words ?? 1100} Hebrew words of real teaching (more is fine, less is not).`}
${k === 0 ? "Start the lesson (no preamble about the plan or the parts)." : "Continue seamlessly from the last sentence above: no greeting, no recap, no repeated heading; open with the explicit transition from where the text stopped. Continue the equation numbering from the last \\tag above."}
Do not write material that belongs to later parts. Teach step by step: every step of a derivation on its own line with its reason in words. Put [[DOC:PAGE]] at the paragraph where the source page changes. Show each original figure assigned to this part with a figure block, then explain it. State computed values exactly as in "facts" (run compute for anything new).
${LESSON_RULES === "lite" ? "Tag the level-2.5 sections of the central results that this part covers ([[2.5: …]], each tag once per central result in the whole lesson) at the start of their paragraph; anchor claims get no tag." : "Tag every level-2.5 section this part covers ([[2.5: …]]) at the start of its paragraph."}
${last ? "This is the last part: write the coverage block, the exercises, the fieldsystems block if a real connection exists, and the sentence about the next lesson." : "Do not end the lesson and do not write exercises yet."}${LESSON_RULES === "lite" ? `\n${LITE_PART}${last ? "\nThe keep block: at most six lines, only the definitions and formulas of the central results, each \"name: …\" and standing on its own. Each verify block holds at least three independent checks; each predict asks for a value with a range or the direction of a dependence." : ""}${featurePart(p)}` : ""}`;
}

/** A part of a lesson written as chapters of a book (bookRules.ts, docs/LESSON_BOOK_SPEC.md). */
function bookPartInstructions(plan: PartPlan, k: number, writtenSoFar: string) {
  const o = plan.outline!;
  const p = plan.parts[k];
  const n = plan.parts.length;
  const last = k === n - 1;
  const mine = partSections(o, plan.parts, k);
  const prior = writtenSoFar.length > 60000 ? `[…start omitted…]\n${writtenSoFar.slice(-60000)}` : writtenSoFar;
  return `WRITING STEP: part ${k + 1} of ${n} of this lesson. Write as the authors (see <voice>).
Lesson «${plan.title}».${plan.results?.length ? ` Central results: ${plan.results.join("; ")}.` : ""}
Figures of the lesson: ${(plan.figures ?? []).join(", ") || "none"}.
Computed facts: ${(plan.facts ?? []).map((f) => `\n- ${f}`).join("")}
${last && plan.next ? `Next lesson: ${plan.next}` : ""}
${prior ? `The lesson text written so far, which the learner is reading right now:\n<<<\n${prior}\n>>>\n` : ""}
Now write ONLY part ${k + 1}: subsections ${mine.join(", ") || p.title}. It covers: ${p.covers}.${p.blocks?.length ? ` Blocks for this part: ${p.blocks.join(", ")}.` : ""}${p.l25?.length ? ` Level-2.5 sections for this part: ${p.l25.join(", ")}.` : ""}
Do not write material that belongs to later parts. Teach step by step: every step of a full derivation on its own line with its reason in words. Put [[DOC:PAGE]] at the paragraph where the source page changes. Show each original figure assigned to this part with a figure block, then explain it. State computed values exactly as in "facts" (run compute for anything new).
Tag the level-2.5 sections of the central results that this part covers ([[2.5: …]], each tag once per central result in the whole lesson) at the start of their paragraph; anchor claims get no tag.
${k === 0 ? "Start the lesson with the first chapter heading (no preamble about the plan or the parts)." : "Continue the equation numbering from the last \\tag above."}
${LITE_PART}${featurePart(p)}
${BOOK_PART(o, mine, k === 0, last)}`;
}

/** Checks the outline's order before any text is written, and has the planner fix it (at most two rounds). */
async function checkOutline(o: { rt: Runtime; plan: PartPlan; planTurn: string; title: string; effort: Effort; signal: AbortSignal; cb: TurnCallbacks }): Promise<PartPlan> {
  let plan = o.plan;
  const ask = (content: string) =>
    o.rt.sample!.json<PartPlan>(
      [
        { role: "user", content: o.planTurn },
        { role: "assistant", content: JSON.stringify(plan) },
        { role: "user", content },
      ],
      { model: MODEL, modelTier: "complex", effort: o.effort, signal: o.signal, cache: false },
    ).catch(() => null);
  if (!validOutline(plan.outline)) {
    o.cb.onStatus?.("מבקש את תוכן העניינים של השיעור");
    const again = await ask('The plan has no valid "outline" (chapters, each with its numbered subsections, as specified). Reply with ONLY the whole plan JSON again, with the outline and each part\'s "sections".');
    if (!again || !Array.isArray(again.parts) || !again.parts.length || !validOutline(again.outline)) {
      delete plan.outline;
      return plan;
    }
    plan = again;
  }
  plan.outline = normalizeOutline(plan.outline!);
  for (let round = 0; round < 2; round++) {
    o.cb.onStatus?.(round ? "בודק שוב את סדר תוכן העניינים" : "בודק את סדר תוכן העניינים: כל מושג מוגדר לפני שמשתמשים בו");
    const review = parseOutlineReview(await o.rt.sample!.json<unknown>(outlineCheckPrompt(plan.outline!, o.title), { model: MODEL, modelTier: "complex", effort: "medium", signal: o.signal, cache: false }).catch(() => null));
    const problems = [...orderProblems(plan.outline!), ...(review?.problems ?? [])];
    if (!problems.length) break;
    o.cb.onStatus?.(`מתקן את תוכן העניינים (${problems.length} בעיות סדר)`);
    const fixed = await ask(OUTLINE_FIX({ problems, verdict: "fix" }));
    if (!fixed || !Array.isArray(fixed.parts) || !fixed.parts.length || !validOutline(fixed.outline)) break;
    plan = { ...fixed, outline: normalizeOutline(fixed.outline) };
  }
  return plan;
}

/**
 * The lesson rules in use. "lite" is the compact rules of 1.11 (RULES_v3 §5: depth units, density band,
 * padding list, split only by rule 5.4), checked with the real tutor on the test bench; "current" is the
 * 30.10 wording, kept only so the bench can compare.
 */
/** The rules the app writes lessons with (the bench switches them per step and puts these back). */
export const DEFAULT_RULES: "current" | "lite" = "lite";
let LESSON_RULES: "current" | "lite" = DEFAULT_RULES;
export function setLessonRules(r: "current" | "lite") {
  LESSON_RULES = r;
}
const JSON_AGAIN = "The previous reply to this request held no JSON. Reply now with ONLY the JSON object of the plan, small as specified, with no text before or after it.";
const isEmptyPlan = (e: unknown) => ["invalid_json", "empty_completion"].includes(String((e as { code?: string })?.code ?? ""));
const LITE_PLAN = `
LESSON RULES (they replace the length rule and the 4200-word floor above). There is no word target and no floor: the length follows from the depth units. Nothing of the assigned material is dropped and nothing is taught below its level.
- Central results: one or two per lesson. A central result is a formula, theorem, method or model the course returns to as a working tool, or that carries an engineering decision. Each one gets all seven level-2.5 sections, woven into the argument where it raises them, plus its authority layer: a hidden assumption with a real break (in the step where it enters), a quantitative reading (a bound or error growth, with a computed number), the decisive real case with computed numbers against published ones, a professional error and the check that catches it, a second structure ("what it really rests on"), and a strong mapping to another field.
- Anchor claims: an idea of the pages that fixes a law, a count, a computation or an impossibility but is not central, AND that a named later module of the course teaches in full (say which in the text). It gets the claim, one assumption or structure, and one number or case, in one or two paragraphs. The theory of a later topic enters only in its one-step form; the rest is a fieldmap line. An idea of the assigned pages that no later module teaches is not an anchor: it is taught in full here, however short the pages make it. When unsure whether a later module teaches it, teach it here.
- Completeness comes before everything else: every idea, result, definition, mechanism and worked number of the assigned pages, and every K or S topic item, is taught at full depth. When something has to give, drop a second example, an exercise or a story, or make the lesson longer; never thin or skip material. The lesson is checked against its pages before the learner reads it, and anything missing is sent back.
- A depth unit is one idea with its own level-2.5 exam question. Plan the number of units per part, counted honestly: two ideas answered by the same answer are one unit, and splitting a sentence makes no unit. About 30 counted words per unit, for orientation only: one central result usually takes 80 to 120 units, two take 130 to 180.
- Split only when the plan holds more than two central results, or more than 180 units: cut at a boundary between central results, each result moving with its units, anchors and case study, and add "split": {"title": "Hebrew title of the continuation lesson", "covers": "the results and pages that move to it"}. Never split because a lesson is long, and never thin or drop anything to avoid a split: every extra lesson lengthens the course.
- Every idea of the assigned pages goes to a unit (a background half-sentence only for what the learner already knows from an earlier lesson), or to the split lesson. Before replying, check the list of section headings above: each one is in some part's "covers" or in "split".
- Name the central results R1 (and R2) in "results". Only they get the seven [[2.5: …]] tags (each tag once per result), a ## section of their own, formula blocks and domain blocks. An anchor claim takes at most about six lines, with no formula block, no 2.5 tag and no domain block.
- Connections: per central result one fieldmap block and one or two domain blocks, each saying exactly what maps and where the analogy breaks. A connection is made once, in one place, never repeated in prose or in another block.
- The casestudy is a real system or event with computed numbers set against a published figure; any calculation the story promises is carried out in the lesson.
- The keep block has at most six lines, each "name: …" and standing on its own, and holds only what this lesson teaches in full (its central results and the definitions it builds): never an anchor claim, a first look at a later module's topic, or a field's illustration.
- Questions: plan the think and predict questions only on the central results and on definitions taught in full in this lesson, each answerable from what the lesson has written by the place it stands (the numbers it needs are given in the lesson or the question). In an overview lesson most results are anchors: then ask about the ideas in words, not computations with formulas the lesson only shows.
- Keep the JSON small: "results": ["R1: one line", "R2: one line"], and per part only "title", "covers" (one or two lines: headings, pages, results, the case study), "units" (a number), "blocks", "l25". No free-text reasoning and no unit list in the JSON.`;
const LITE_PART = `LESSON RULES FOR THIS PART. Write every depth unit this part covers, each at its minimum: a definition = its context, the general definition block, how it is built, then a separate example; a result = the formula, every symbol, where it holds; an assumption = the assumption, the step where it enters, the case where it broke, what fell and what stayed; a quantitative reading = the bound or growth law, its reason in a line or two, one computed number; a limit = the condition, what happens beyond it, what replaces it; a trade-off = the gain, the cost, how much; a mapping = what maps to what, what carries over, where it breaks; a critique = the claim, the check, the correct statement; a case = the system, its numbers, against the model. Never write a unit below its minimum, and never above it without a new unit.
Density: about 20 to 45 counted words per unit. Delete padding and only padding: talk about the lesson itself ("in the next part", "we begin with"); interim summaries (the keep block is the only summary); retelling the book ("the author shows"); historical color that teaches no idea; a second example that adds no unit; a story already told; the same mapping or number said twice; filler openers ("it is important to note"); lists of applications without a mechanism or a number; the theory of a later topic; rhetorical questions answered at once; empty adjectives ("deep", "elegant", "surprising").
Only the central results named in the plan get [[2.5: …]] tags, formula blocks, think questions on them, and domain blocks; everything else in this part is an anchor claim or a supporting idea: all its material stays, in the short form (claim, one assumption or structure, one number or case), with none of those. A number, example, case or connection already in the text above is not told again: refer back to it in half a sentence. Each symbol keeps one meaning for the whole lesson. The casestudy of a central result is a real system or measurement whose published number was obtained independently of the formula it tests. Never write about the writing process (parts, the plan, lists prepared in advance, what the next part will do): the reader sees one continuous lesson. No sentences about the lesson or the book; at most one forward reference per section; certainty labels at the end of a sentence. Each central result has its own casestudy: a real system or measurement whose number was obtained independently (a published figure computed from the same formula is not a test). A fieldmap line names only fields that no domain block of this lesson covers, and neither repeats what a domain block or a paragraph already says. Every number restated as a ratio, fraction or "times" is checked with compute before it is written. Questions follow what is taught: a think question, exercise, predict, verify or errorhunt may ask the learner to compute or derive only with material this lesson teaches in full, and must be answerable from what the lesson has written above it (every number and constant it needs is in the lesson or in the question). A topic shown only as a first look at a later module, or an illustration from a field, gets at most a question about its idea in words, never a calculation with its formula, and never a line in the keep block. Before writing a question, check: could a careful reader of this lesson alone answer it? If not, change the question, not the lesson.`;

/**
 * Parts of the lesson rules that the bench can switch on one at a time (after the 31.10 rollback
 * each one comes back only once the real tutor has written lessons with it in both apps).
 */
export type LessonFeature = "curriculum" | "level3" | "decide" | "style" | "book";
export const DEFAULT_FEATURES: LessonFeature[] = ["curriculum", "level3", "decide", "style", "book"];
let FEATURES = new Set<LessonFeature>(DEFAULT_FEATURES);
export function setLessonFeatures(f: LessonFeature[]) {
  FEATURES = new Set(f);
}
const LEVEL3_PLAN = `
LEVEL 3 (led work): the AI computes and runs tools, the reader holds the understanding, the decisions, the verification and the judgment. Plan, in "blocks":
- predict (2 to 4 per lesson): before a central number, simulation or result the lesson is about to compute, where the estimate teaches.
- verify: after every computed or AI result the lesson draws a conclusion from.
- errorhunt (in about every second lesson, at irregular intervals): an AI output with possibly one planted error; in about a third of them there is none.
- lab (at the end of every core or advanced lesson, in the last part): a real build-or-analysis task the AI performs and the reader leads, in a professional open-source tool.`;
const LEVEL3_PART = `LEVEL-3 BLOCKS (only those planned for this part):
- \`\`\`predict, headers @title, @unit, @value (the computed number, plain digits, when there is one). Body: the question and what to estimate (a value with a 90% range, or the direction of a dependence: "what happens when X doubles"), a line "---", then the computed answer and the reasoning of the estimate.
- \`\`\`verify, headers @title, @result. Body: a Markdown list of at least three independent checks, one per line, each with what we expect to see: dimensions and units; a limiting case with a known answer; conservation or symmetry; an analytic solution or a table from the sources (with its page tag); a change of resolution or step; the prediction; a second independent solver; public real data.
- \`\`\`errorhunt, header @title. Body: an AI output (code, numbers, a derivation or a conclusion) that may hold one planted error (units; a factor 2 or 2π; dB against linear; power against amplitude; a sign; an assumption broken in the parameter range; windowing and aliasing; off-by-one; mean of a ratio against ratio of means; a simulation that did not converge), a line "---", then the solution: where the error is (or that there is none), how to catch it, and the check that would have caught it. The planted error lives only in this block.
- \`\`\`lab, headers @title, @tools (open-source tools, e.g. NumPy and SciPy, python-control, scikit-rf, ngspice, OpenModelica, OpenFOAM, CalculiX, FEniCS, PyTorch), @time (e.g. "60–90 דקות"), @product (optional). Body: the engineering question; the spec the reader writes (question, inputs and their source, assumptions, success measure, acceptance tests, prediction; in the gateway stage a draft spec the reader completes); what the AI does; the 5 to 15 heart lines the reader writes himself; the verification (at least two independent checks); the explanation after (3 to 6 sentences in his words); one extension for a project.
Code or output inside these blocks goes in a ~~~ fence (e.g. ~~~python), never in a backtick fence. In a lab block the heart lines are left for the reader: give what each must do and its inputs and outputs, not the code. At least half of the predict blocks ask for the direction of a dependence.`;
const DECIDE_PART = `- \`\`\`decide, headers @kind (trade / architecture / review / agents), @title. Body: the brief and what the reader submits in writing, a line "---", then the reference analysis with its numbers, what was decisive, and the common mistakes.`;
const STYLE_PART = `STYLE (it changes how a unit is written, never whether it is there; the definition rules of section א win):
1. Open each section with the concrete problem it solves, then follow the definition order.
2. Before each derivation, formula or computation, one sentence states the real question it answers.
3. A paragraph's first sentence states its claim or question, never a topic or lesson logistics.
4. Where a result appears, say what it lets the reader compute, predict or decide here.
5. Describe an idea in familiar words before naming it. At most one new term per sentence and three per paragraph; a list of terms gets a sentence that unites them.
6. Link sentences with explicit logic (כי, לכן, אבל, כלומר). Never state a claim whose reason comes sections later.
7. Plain Hebrew: one idea per sentence, 12 to 25 words, the verb early; verbs, not nominalizations (לחשב, not לבצע חישוב); chains of at most two nouns in smichut; no calques; active voice.
8. Show any step a reader cannot check in about 30 seconds; never "simple algebra gives". A deferred step is named, with where it comes.
9. Reasoning goes in prose; lists only for parallel items.
10. A paragraph of numbers first says what is computed and how the pieces combine; one quantity per sentence, with its unit; it ends with the answer.
11. After the general result, apply it back to the opening problem.
12. Certainty labels at the end of a sentence, never mid-clause (page tags and 2.5 tags stay where the rules put them). Bold only for a defined term, or one warning per section.
13. The prose never uses course machinery words (צומת, גשר, פריפריה, "רמה 2.5"); at most one forward reference per section.
14. One Hebrew name per concept, one meaning per symbol.`;
function featurePlan(lessons: number, idx: number, modulesDone: number) {
  if (LESSON_RULES !== "lite") return "";
  return `${FEATURES.has("level3") ? LEVEL3_PLAN : ""}${FEATURES.has("decide") ? decideLine(decideSlot(lessons, idx, modulesDone)) : ""}`;
}
function featurePart(p: { blocks?: string[] }) {
  if (LESSON_RULES !== "lite") return "";
  const b = (p.blocks ?? []).join(" ");
  const out: string[] = [];
  if (FEATURES.has("level3") && /predict|verify|errorhunt|lab/.test(b)) out.push(LEVEL3_PART);
  if (FEATURES.has("decide") && /decide/.test(b)) out.push(`LEAD-AND-DECIDE BLOCK:\n${DECIDE_PART}`);
  if (FEATURES.has("style")) out.push(STYLE_PART);
  return out.length ? `\n${out.join("\n")}` : "";
}


export async function composeLesson(opts: Base & { text: string; resume?: { plan: PartPlan; partsDone: number; text: string }; planOnly?: boolean }) {
  // the lesson as chapters of a book (bookRules.ts): chapters are numbered across the module
  const book = LESSON_RULES === "lite" && FEATURES.has("book");
  const chapterStart = 1 + (opts.lessons ?? []).slice(0, Math.max(0, opts.lessonIdx)).reduce((s, l) => s + Math.max(1, (l as { chapters?: number }).chapters ?? 1), 0);
  const { rt, history, text, effort, module: m, lessons, lessonIdx, memory, notes, allNotes, signal, cb, resume } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  cb.onStatus?.("טוען את עמודי המקור של השיעור");
  const pages = await lessonPages(lessons?.[lessonIdx], m);
  const ctx = studyContext({ mode: "lesson", module: m, lessons, lessonIdx, memory, pages, notes, allNotes, done: opts.done });
  const tools = rt.canUseTools ? buildTools(cb, moduleDocs(m)) : null;

  let plan = resume?.plan;
  if (!plan) {
    cb.onStatus?.("מתכנן את השיעור: קורא את המקורות ומחשב את המספרים");
    const planTurn = `${ctx}\n\n${text}\n\n${LESSON_RULES === "lite" ? PART_PLAN_INSTRUCTIONS.replace("for a core or advanced module the words add up to at least 4200 Hebrew words unless the assigned material is genuinely short (then say so in the first part); ", "").replace(', "words": 1200}', ', "units": 40}') + LITE_PLAN : PART_PLAN_INSTRUCTIONS}${featurePlan(lessons?.length ?? 0, lessonIdx, opts.done?.length ?? 0)}${book ? BOOK_PLAN(chapterStart) : ""}`;
    plan = await retryRefused(
      (h) => {
        const once = (again: boolean) =>
          rt.sample!.json<PartPlan>([...fitHistory(h, bytes(planTurn), false, { refs: hasRefs(m) }), { role: "user", content: again ? `${planTurn}\n\n${JSON_AGAIN}` : planTurn }], {
            model: MODEL,
            modelTier: "complex",
            effort,
            signal,
            ...(tools && !again ? { tools } : { cache: false }),
          });
        // an empty or non-JSON plan is asked once more, without tools (the new rules only)
        return LESSON_RULES === "lite" ? once(false).catch((e) => (isEmptyPlan(e) ? once(true) : Promise.reject(e))) : once(false);
      },
      history,
      cb,
    ).catch((e) => onRefusal(e, rt, m, history, planTurn, cb));
    if (!plan || !Array.isArray(plan.parts) || !plan.parts.length) throw { code: "invalid_json", message: "no plan" };
    if (book) plan = await checkOutline({ rt, plan, planTurn, title: lessons?.[lessonIdx]?.title ?? m.title, effort, signal, cb });
    cb.onCheckpoint?.(plan, 0, "");
    if (opts.planOnly) return { text: "", plan, model: undefined };
  }

  let written = resume?.text.trim() ?? "";
  let model = "";
  for (let k = resume?.partsDone ?? 0; k < plan.parts.length; k++) {
    cb.onStatus?.(`כותב חלק ${k + 1} מתוך ${plan.parts.length}: ${plan.parts[k].title}`);
    const before = written ? written + "\n\n" : "";
    let partText = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      // a part cut off at the length limit gets one continuation
      const turn = `${ctx}\n\n${text}\n\n${partInstructions(plan, k, (before + partText).trim())}${attempt ? "\n\nThe previous attempt of this part was cut off at the length limit; continue it exactly from where the text above stops." : ""}`;
      const res = await retryRefused(
        (h) =>
          rt.sample!([...fitHistory(h, bytes(turn), false, { refs: hasRefs(m) }), { role: "user", content: turn }], {
            model: MODEL,
            modelTier: "complex",
            effort,
            signal,
            ...(tools ? { tools } : { cache: false }),
            onText: ({ text: t }) => cb.onText(before + partText + t),
          }),
        history,
        cb,
      ).catch((e) => onRefusal(e, rt, m, history, turn, cb));
      partText += res.text;
      model = res.modelApplied ?? `רמת מודל: ${res.modelTierApplied}`;
      if (!res.truncated) break;
    }
    written = (before + partText).trim();
    cb.onText(written);
    cb.onCheckpoint?.(plan, k + 1, written);
  }
  // a book lesson over its budget is tightened once, padding only, before the checks (bookRules.ts)
  if (book && plan.outline && !opts.planOnly && written) {
    // the cap counts every word he reads (the practice questions too); the plan's budgets count the prose
    const budget = Math.min(LESSON_WORDS, (lessonWords(plan.outline) || LESSON_WORDS) + 2500);
    const words = wordCount(written);
    if (words > budget * 1.1) {
      cb.onStatus?.(`מהדק את השיעור: ${words.toLocaleString()} מילים, התקציב ${budget.toLocaleString()}`);
      const raw = await rt.sample!([{ role: "user", content: tightenPrompt(written, words, budget) }], { model: MODEL, modelTier: "complex", effort, signal, cache: false })
        .then((r) => r.text)
        .catch(() => "");
      const t = raw ? applyRepair(written, raw, "inplace") : null;
      if (t?.applied && wordCount(t.text) < words) {
        written = t.text;
        cb.onText(written);
      }
    }
  }
  // every lesson is checked against its pages before it is read, and repaired where it falls short (lessonAudit.ts)
  let audit: AuditMark | undefined;
  if (!opts.planOnly && written) {
    const a = await auditLesson({ rt, module: m, lessons, lessonIdx, text: written, mode: "inplace", pages, known: plan.outline?.known, signal, cb }).catch(() => null);
    if (a) {
      written = a.text;
      audit = a.mark;
      cb.onText(written);
    }
  }
  return { text: written, plan, model, audit };
}

/**
 * The check of one lesson (lessonAudit.ts): "inplace" for a lesson not read yet, "supplement" for one already
 * read (the additions come after it). Returns null when the check could not run.
 */
export async function auditLesson(o: { rt: Runtime; module: Module; lessons?: LessonSpec[]; lessonIdx: number; text: string; mode: "inplace" | "supplement"; pages?: string; known?: string[]; signal?: AbortSignal; cb: TurnCallbacks }) {
  const { rt, module: m, lessons, lessonIdx } = o;
  if (!rt.sample) return null;
  const spec = lessons?.[lessonIdx];
  const pages = o.pages ?? (await lessonPages(spec, m));
  const index = getIndex();
  const modules = namedModules(o.text)
    .filter((id) => id !== m.id)
    .map((id) => index?.modules.find((x) => x.id === id))
    .filter((x): x is Module => !!x)
    .map((x) => ({ id: x.id, title: x.title, sections: x.sections.map((s) => s.title) }));
  const tools = rt.canUseTools ? buildTools(o.cb, moduleDocs(m)) : null;
  return auditLong(
    {
      lessonTitle: spec?.title ?? m.title,
      moduleId: m.id,
      moduleTitle: m.title,
      covers: spec?.covers ?? m.sections.map((s) => s.title),
      focus: (spec as { focus?: string } | undefined)?.focus,
      otherLessons: (lessons ?? []).filter((_, i) => i !== lessonIdx).map((l) => ({ title: l.title, covers: l.covers ?? [] })),
      curriculum: curriculumBlock(m),
      modules,
      pages,
      text: o.text,
      ...(o.known?.length ? { known: o.known } : {}),
    },
    o.mode,
    {
      onStatus: o.cb.onStatus,
      call: async (prompt, kind) => {
        const res = await rt.sample!([{ role: "user", content: prompt }], {
          model: MODEL,
          modelTier: "complex",
          effort: kind === "audit" ? "high" : "high",
          signal: o.signal,
          ...(kind === "repair" && tools ? { tools } : { cache: false }),
          ...(kind === "repair" ? { onText: ({ text }: { text: string }) => o.cb.onStatus?.(`משלים את השיעור (${Math.round(text.length / 1000)} אלף תווים)`) } : {}),
        });
        return res.text;
      },
    },
  );
}

/* ---------------- course memory ---------------- */

export const INITIAL_MEMORY = `# זיכרון הקורס

## מצב נוכחי
- הקורס מתחיל. עוד לא נלמד אף מודול.

## מה נלמד
(עדיין אין שיעורים.)

## כלים ומושגים שנפגשו

## סימונים ומוסכמות

## מקרי בוחן ומערכות שכבר שימשו

## חיבורים פתוחים

## טעויות שנמצאו במקורות

## קשיים, שאלות פתוחות והעדפות
- מתמטיקה, פיזיקה והנדסה: מתחילים מאפס, כל כלי נבנה כשצריך אותו, גזירות צעד אחר צעד.
`;

export async function updateMemory(rt: Runtime, memory: string, answer: StoredMessage, request: string, where: string) {
  if (!rt.sample) return null;
  const body = answer.text.length > 90000 ? answer.text.slice(0, 90000) + "\n[…]" : answer.text;
  const prompt = `You maintain the running memory of a personal course in which a tutor teaches one learner the physics and engineering of sensing, communication and aerospace systems (radar, EW, EO/IR, navigation, guidance, platforms), in Hebrew, module by module. The tutor reads this memory before every answer, so it is how later lessons refer back to earlier ones.

Current memory:
<<<
${memory || INITIAL_MEMORY}
>>>

Where the learner is now: ${where}

The learner asked: ${request}

The tutor's latest answer (${answer.mode}):
<<<
${body}
>>>

Rewrite the whole memory in Hebrew Markdown with exactly these sections, merging the new answer in and keeping everything still useful:
# זיכרון הקורס
## מצב נוכחי — which module and lesson the learner is at and what comes next.
## מה נלמד — one entry per lesson: module, lesson, the key ideas in one or two lines, key formulas in LaTeX.
## כלים ומושגים שנפגשו — each tool/concept: where it was first met and the number from that first example (the tutor uses this to refresh tools later).
## סימונים ומוסכמות — notation choices to keep consistent across sources.
## מקרי בוחן ומערכות שכבר שימשו — so later lessons do not repeat them.
## חיבורים פתוחים — from the fieldmap blocks: formula → field → the module where it will be taught. Add the new ones; remove an entry once a later lesson closed it with a domain block. The tutor closes these when it reaches that field.
## טעויות שנמצאו במקורות — tag, what is wrong, what is right.
## קשיים, שאלות פתוחות והעדפות — what the learner found hard, asked, or prefers (keep the existing preferences).
Keep it under about 2000 words; compress older entries rather than dropping them; never drop or merge away an entry of ## חיבורים פתוחים until a lesson closed it. Reply with the memory only.`;
  const res = await rt.sample(prompt, { modelTier: "default", effort: "low", cache: false });
  return res.text.trim();
}

/* ---------------- the summaries notebook (only when the learner asks) ---------------- */

const noActivity = { onText: () => {}, onActivity: () => {} } as TurnCallbacks;

/** Checks the learner's summary of a module against its sources: what is wrong, what is missing. */
export async function reviewSummary(o: { rt: Runtime; module: Module; lessons?: LessonSpec[]; summary: string; memory: string; signal: AbortSignal; onText?: (t: string) => void }) {
  const { rt, module: m } = o;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const prompt = `${moduleBlock(m)}
${planBlock(o.lessons, -1)}
${o.memory.trim() ? `\n<course_memory>\n${o.memory.trim()}\n</course_memory>\n` : ""}
The learner's own summary of this module (Markdown, equations in $$…$$):
<<<
${o.summary.slice(0, 120000)}
>>>

Check the summary against the module's sources (read the pages you need with read_source_pages) and against what was taught. Reply in Hebrew, short and concrete, under these headings, as numbered lists, and leave out a heading with nothing under it:
### מה לא מדויק
(quote the line from the summary, then what is right, with a page tag [[DOC:PAGE]])
### מה חסר
(only what is central to the module, not every detail)
### משוואות
(an equation that is wrong, or is missing a condition or the meaning of a symbol)
### הצעה אחת
(the one change that would make this summary most useful for review)
Do not rewrite the summary and do not praise it.`;
  const res = await rt.sample(prompt, {
    model: MODEL,
    modelTier: "complex",
    effort: "medium",
    signal: o.signal,
    cache: false,
    onText: o.onText ? ({ text }) => o.onText!(text) : undefined,
    ...(rt.canUseTools ? { tools: buildTools(noActivity, moduleDocs(m)) } : {}),
  });
  return res.text;
}

export interface SummaryQuestion {
  q: string;
  a: string;
}

/** Review questions built only from what the learner wrote in the summary. */
export async function quizFromSummary(o: { rt: Runtime; module: Module; summary: string; count?: number; signal: AbortSignal }) {
  if (!o.rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const prompt = `The learner's own summary of module ${o.module.id} «${o.module.title}» (Markdown, equations in $$…$$):
<<<
${o.summary.slice(0, 100000)}
>>>

Write ${o.count ?? 6} review questions in Hebrew built only from what this summary says, so that answering them checks whether the learner remembers and understands his own summary: a mix of a definition, an equation and what each term means, a number to estimate, a "why", and a common mistake. Order them from easy to hard. Equations in $…$. Reply with ONLY a JSON array: [{"q": "the question", "a": "the expected answer, short, from the summary"}]`;
  const res = await o.rt.sample.json<SummaryQuestion[]>(prompt, { model: MODEL, modelTier: "default", effort: "low", signal: o.signal, cache: false });
  return (Array.isArray(res) ? res : []).filter((x) => x && typeof x.q === "string").map((x) => ({ q: x.q, a: String(x.a ?? "") }));
}

/** A short check of one answer to a review question. */
export async function checkSummaryAnswer(o: { rt: Runtime; question: SummaryQuestion; answer: string; signal: AbortSignal }) {
  if (!o.rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const prompt = `Review question (Hebrew): ${o.question.q}
Expected answer, from the learner's summary: ${o.question.a}
The learner answered: ${o.answer}

In Hebrew, two to four sentences: is it right, partly right or wrong; what is missing or mistaken; and the one thing to remember. Start with ✓, ◐ or ✗. Equations in $…$.`;
  const res = await o.rt.sample(prompt, { model: MODEL, modelTier: "quick", effort: "low", signal: o.signal, cache: false });
  return res.text.trim();
}

/* ---------------- refusals ---------------- */

/**
 * A refused lesson call is tried once more without the earlier turns of the conversation (the
 * history is the only part of the input that a retry can drop without changing the lesson).
 */
async function retryRefused<T>(call: (history: StoredMessage[]) => Promise<T>, history: StoredMessage[], cb: TurnCallbacks): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await call(i ? [] : history);
    } catch (e) {
      if ((e as { code?: string })?.code !== "refused" || i >= 1) throw e;
      cb.onStatus?.("Claude סירב; מנסה שוב בלי התורות הקודמות");
    }
  }
}

/**
 * When Claude refuses a lesson call, find which part of the input it refuses: the same turn is sent
 * again with one part removed at a time, asking only for "OK" (cheap, no tools). The result is saved
 * (profile/diag) so the cause can be fixed in the instructions, and the refusal is rethrown.
 */
async function onRefusal(e: unknown, rt: Runtime, m: Module, history: StoredMessage[], turn: string, cb: TurnCallbacks): Promise<never> {
  if ((e as { code?: string })?.code !== "refused" || !cb.onDiag) throw e;
  cb.onStatus?.("Claude סירב. בודק איזה חלק מהשיעור גורם לזה (כשתי דקות)");
  const refs = hasRefs(m);
  // Opus refuses even without the rules while Sonnet and Haiku accept the same input (diags of
  // 28.10), so look inside the lesson's own input: the plan text, the memory, each source page
  const pagesAt = turn.indexOf("Source pages for this lesson:");
  const head = pagesAt >= 0 ? turn.slice(0, pagesAt) : turn;
  const pagesText = pagesAt >= 0 ? turn.slice(pagesAt) : "";
  const tail = /\n<\/study_context>[\s\S]*$/.exec(pagesText)?.[0] ?? "";
  const pageChunks = pagesText.replace(tail, "").replace("Source pages for this lesson:\n", "").split(/\n(?==== \[\[)/).filter((x) => x.trim());
  const noPlan = turn.replace(/Lesson plan of this module:[\s\S]*?(?=\n<course_memory>|\n<lesson_notebook>|\n<notebook>|\n\nSource pages|\n<\/study_context>)/, "");
  const noMemory = turn.replace(/\n*<course_memory>[\s\S]*?<\/course_memory>/, "");
  const minimal = `<study_context>\n${moduleBlock(m)}\n`;
  const variants: { name: string; turn: string; p: PromptOpts }[] = [
    { name: "lean-full", turn, p: { refs, lean: true } },
    { name: "lean-no-pages", turn: head + tail, p: { refs, lean: true } },
    { name: "lean-no-plan", turn: noPlan, p: { refs, lean: true } },
    { name: "lean-no-memory", turn: noMemory, p: { refs, lean: true } },
    { name: "full-no-plan", turn: noPlan, p: { refs } },
    { name: "lean-pages-only", turn: `${minimal}${pagesText}`, p: { refs, lean: true } },
    ...pageChunks.slice(0, 16).map((c) => ({ name: `page ${(/\[\[([A-Z]\d+[a-z]?:\d+)\]\]/.exec(c)?.[1] ?? "?")}`, turn: `${minimal}\nSource page:\n${c}\n</study_context>`, p: { refs, lean: true } })),
  ];
  const results: Record<string, string> = {};
  for (const v of variants) {
    const ask = `${v.turn}\n\nDIAGNOSTIC CHECK: do not write the lesson. Reply with the single word OK.`;
    try {
      const res = await rt.sample!([...fitHistory([], bytes(ask), false, v.p), { role: "user", content: ask }], { model: MODEL, modelTier: "complex", effort: "low", cache: false });
      results[v.name] = `ok (${res.modelApplied ?? res.modelTierApplied ?? "?"})`;
    } catch (err) {
      results[v.name] = (err as { code?: string })?.code ?? "error";
      if (results[v.name] === "rate_limited") break;
    }
  }
  await cb.onDiag({ module: m.id, at: Date.now(), results, turnBytes: bytes(turn), systemBytes: bytes(systemPrompt({ refs })) });
  throw e;
}
