// The tutor's calls to Claude through `sample`. Every call is memoryless, so each one
// carries the instructions turn, the course memory, as much recent history as fits,
// and the new turn with the module, the lesson plan and the source pages.
// Entering a module: one call splits it into lessons that together cover every
// section of its sources (checked by the app). A lesson: one planning call, then one
// call per part, so its length never depends on one long answer.
import { create, all } from "mathjs";
import { docMeta, getIndex, readPages, searchLibrary, type Module } from "./library";
import { SYSTEM_PROMPT, libraryList } from "./prompt";
import type { Runtime, SampleTool } from "./runtime";
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

let promptCache = "";
export function systemPrompt() {
  if (!promptCache) promptCache = SYSTEM_PROMPT.replace("${LIBRARY}", libraryList(getIndex()?.docs ?? {}));
  return promptCache;
}

export interface TurnCallbacks {
  onText: (text: string) => void;
  onActivity: (a: Activity) => void;
  onStatus?: (status: string) => void;
  /** a safe point to save: the part plan exists and `partsDone` parts are written */
  onCheckpoint?: (plan: PartPlan, partsDone: number, text: string) => void;
  /** the tutor saved a point to the lesson's shared notebook */
  onNote?: (kind: NoteKind, text: string, addTo?: string) => Promise<void> | void;
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
  /** the modules the learner has finished, for <reader_stage> */
  done?: string[];
  signal: AbortSignal;
  cb: TurnCallbacks;
}

type Turn = { role: "user" | "assistant"; content: string };

const TIER_TEXT = { core: "ליבה", adv: "מתקדם", ref: "עיון" };

/** "Answers to Problems" appendices (PDF pages); they are not taught, only used to check exercises. */
const ANSWER_KEYS: Record<string, [number, number]> = { E13: [941, 956] };

function moduleBlock(m: Module) {
  const srcs = m.sources
    .map((s) => {
      const d = docMeta(s.doc);
      const role = s.role === "main" ? "main source" : s.role === "supp" ? "supplement (teach only what is new)" : s.role === "ex" ? "exercises (problems for practice and checking, not lesson material)" : "article";
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
${secs ? `Section headings in these pages (DOC:PAGE title):\n${secs}` : "No section headings were detected; use the pages themselves."}${keys ? `\nAnswer keys of the books' end-of-chapter problems (check your solutions of book exercises against them): ${keys}` : ""}`;
}

function planBlock(lessons: LessonSpec[] | undefined, idx: number) {
  if (!lessons?.length) return "";
  return `Lesson plan of this module:\n${lessons
    .map((l, i) => `${i + 1}. ${l.title}${i === idx ? "  ← THIS LESSON" : ""}\n   covers: ${l.covers.join("; ")}\n   pages: ${l.sources.map((s) => `${s.doc} ${s.pages[0]}–${s.pages[1]}`).join(", ")}\n   focus: ${l.focus}`)
    .join("\n")}`;
}

async function lessonPages(lesson: LessonSpec | undefined, m: Module) {
  const ranges = lesson?.sources?.length ? lesson.sources : m.sources.filter((s) => s.role !== "article" && s.role !== "ex").map((s) => ({ doc: s.doc, pages: s.pages }));
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

/**
 * What the reader already knows, for the gradualness rules (ז): the stage by the module's part
 * (א: P0–P3, ב: P4–P10, ג: P11 on) and the modules and parts the learner has finished.
 */
function readerStage(m: Module, done: string[] = []) {
  const n = Number(/\d+/.exec(m.part)?.[0] ?? 0);
  const gate = n <= 3;
  const idx = getIndex();
  const mods = idx?.modules ?? [];
  const finished = done.filter((id) => mods.some((x) => x.id === id));
  const parts = [...new Set(finished.map((id) => mods.find((x) => x.id === id)?.part).filter(Boolean))].map((p) => `${p} · ${idx?.parts.find((x) => x.id === p)?.title ?? ""}`);
  return `<reader_stage>
${gate ? "שלב השער (P0–P3): כמעט שום תחום הנדסי עוד לא נלמד; דוגמאות, מונחים ומפת התחומים לפי כללים 23–27." : "הרמה המלאה (מ-P4): דוגמאות מכל תחום הנדסי וחיבורים מלאים לכל תחום; תחום שעוד לא נלמד מקבל משפט הקדמה."} המודול הנוכחי: ${m.id}, בחלק ${m.part}.
מודולים שהלומד סיים: ${finished.length ? finished.slice(-40).join(", ") : "עוד אף אחד"}.
חלקים שהלומד למד בהם: ${parts.length ? parts.join("; ") : "עוד אף אחד"}.
</reader_stage>`;
}

function studyContext(o: { mode: Mode; module: Module; lessons?: LessonSpec[]; lessonIdx: number; memory: string; pages?: string; notes?: LessonNote[]; allNotes?: LessonNote[]; done?: string[] }) {
  const mem = o.memory.trim() ? `\n<course_memory>\n${o.memory.trim()}\n</course_memory>` : "";
  const nb = o.notes?.length
    ? `\n<lesson_notebook>\nThe shared notebook of this lesson (the learner's and yours):\n${o.notes
        .slice(0, 60)
        .map((n) => `- (id ${n.id ?? "?"}) [${NOTE_KIND_LABEL[n.kind]}, ${n.who === "tutor" ? "tutor" : "learner"}] ${n.text.replace(/\s+/g, " ").slice(0, 600)}`)
        .join("\n")}\n</lesson_notebook>`
    : "";
  const rest = o.allNotes?.length
    ? `\n<notebook>\nThe rest of the shared notebook, from other lessons (articles in full, other items shortened). When something in this lesson connects to an item here, say so in the lesson ("this is close to point 3 of the article idea about …"):\n${o.allNotes
        .slice(0, 50)
        .map((n) => `- (id ${n.id ?? "?"}) [${NOTE_KIND_LABEL[n.kind]}, ${n.moduleId}] ${n.kind === "article" ? n.text.slice(0, 1500) : n.text.replace(/\s+/g, " ").slice(0, 220)}`)
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
function fitHistory(history: StoredMessage[], fixed: number, keepLast = false) {
  let used = fixed + bytes(systemPrompt());
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
  const intro = systemPrompt() + (dropped ? `\n\n[${dropped} earlier turns of this conversation were omitted to fit the input limit; <course_memory> summarizes the course so far.]` : "");
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
              "Save a point to the shared notebook of this lesson, which the learner and you both keep: an idea for an article the learner may write, a question worth asking an expert in an interview, a point to study more deeply later, or a short note. Write it in Hebrew, self-contained (it is read later, outside the lesson). Save only what is worth keeping, a few per lesson at most, and never the same point twice (see <lesson_notebook> and <notebook>). To add a point to an item that already exists (a new point for an article idea, for example), pass its id as add_to: the text is appended to it as a new point. When the learner asks you to add something, add exactly that.",
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
    if (src.role === "article" || src.role === "ex") continue;
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
  for (const s of m.sources.filter((x) => x.role !== "ex")) {
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
1. Every section heading listed above (of main sources and supplements) must be covered by exactly one lesson, fully, and every page of every main source and supplement must fall inside the "sources" pages of some lesson (the app checks both). If no headings were detected for a source, read its pages and split it by the topics you find there. Supplements are folded into the lesson whose topic they extend (only what they add beyond the main source). Exercise pages are not lesson material: do not put them in "sources"; the lessons draw exercises from them.
2. Where two sources treat the same topic, put them in the same lesson and say in "focus" how they are combined, so nothing is taught twice and nothing is left out.
3. Each lesson must hold enough for the depth bar (about 4000 Hebrew words for a core or advanced module, with the seven level-2.5 sections for its central results) without being cramped: as a rule of thumb 10–20 dense book pages per lesson. Keep the order of the main source unless the logic of prerequisites says otherwise.
4. Reply with ONLY a JSON array: [{"title": "Hebrew lesson title", "covers": ["exact section headings as listed"], "sources": [{"doc": "E03", "pages": [96, 110]}], "focus": "what the lesson teaches, which examples and figures, how sources are combined"}]${feedback}`;
  let lessons: LessonSpec[] = [];
  let uncovered: string[] = [];
  let gaps: { doc: string; pages: [number, number] }[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const missed = [
      ...(uncovered.length ? [`these sections are not in any lesson's "covers": ${uncovered.join("; ")}`] : []),
      ...(gaps.length ? [`these pages are not in any lesson's "sources": ${gaps.map((g) => `${g.doc} ${g.pages[0]}–${g.pages[1]}`).join(", ")}`] : []),
    ];
    const turn = ask(attempt ? `\n\nYour previous plan left gaps: ${missed.join("; and ")}. Return the full plan again with everything covered.` : "");
    const res = await rt.sample.json<LessonSpec[]>([...fitHistory([], bytes(turn)), { role: "user", content: turn }], {
      model: MODEL,
      modelTier: "complex",
      effort,
      signal,
      ...(rt.canUseTools ? { tools: buildTools(cb, moduleDocs(m)) } : { cache: false }),
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

export async function askTutor(opts: Base & { mode: Mode; text: string; images: File[]; continuing?: boolean }) {
  const { rt, history, text, mode, effort, images, module: m, lessons, lessonIdx, memory, notes, allNotes, done, signal, cb, continuing = false } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const extra = mode === "quiz" && !continuing ? `\n\n${QUIZ_INSTRUCTIONS}` : "";
  const last = `${studyContext({ mode, module: m, lessons, lessonIdx, memory, notes, allNotes, done })}\n\n${text || "(ראו את התמונה המצורפת)"}${images.length ? `\n\n[${images.length} תמונות מצורפות מהלומד]` : ""}${extra}`;
  const turns = fitHistory(history, bytes(last), continuing);
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

const QUIZ_INSTRUCTIONS = `MODULE QUIZ. If the learner has not answered yet: write a quiz of 6–8 questions on the whole module (all its lessons, per the plan and <course_memory>), at level 2.5: estimates to be done in the head first (then checked), trade-off decisions with a justification, finding the error in a wrong claim or derivation, recognizing a shared structure in another field, and one or two engineering calculations with real numbers (verify your own solutions with compute first). No proof reproduction. Number the questions; do not reveal answers. End by asking the learner to answer in one message.
If the learner has answered: grade every answer (correct / partly / wrong), explain each mistake step by step with the worked solution, give a score out of 100 as "[[ציון: N/100]]", and say which lessons to revisit.`;

/* ---------------- a lesson, written in planned parts ---------------- */

export interface PartPlan {
  title: string;
  parts: { title: string; covers: string; blocks?: string[]; l25?: string[]; words?: number }[];
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
 "parts": [{"title": "…", "covers": "which sections/pages, which derivations (full or skeleton), which figures and examples, which scene3d", "blocks": ["story", "think", "figure", "scene3d"], "l25": ["מבנה", "מקור"], "words": 1200}],
 "figures": ["E03:115:0", "…every figure of these pages, each assigned to a part"],
 "facts": ["induced drag share at cruise C_L = 0.5, AR = 9, e = 0.8: C_Di = 0.0111 (computed)", "…"],
 "next": "what the next lesson covers"}
Rules for the plan: 3 to 5 parts; for a core or advanced module the words add up to at least 4200 Hebrew words unless the assigned material is genuinely short (then say so in the first part); part 1 opens with the plan block and the story, then the problem/why-hard/idea paragraphs; every derivation is planned (full, or a skeleton with the assumptions, per <reader>); every assigned section and every figure is assigned to exactly one part; every new concept is planned within one part in the order of rule 5א (the context, its general definition in a definition block, how it is built, and only then a separate example); formula blocks only for general results the course returns to (rule 5ב); all seven level-2.5 sections ("l25") are assigned to parts for the lesson's central results; the case study, the connections by <reader_stage> (a fieldmap block for every new central formula, at least two full domain blocks in every lesson (in the gateway stage P0–P3 to familiar fields, plus a fieldmap line for foreign ones; from P4 on to any field, at the full level); examples from familiar ground, rules 23–27), think questions, refresh blocks, scenes (scene3d) where the third dimension helps, and figures are assigned to parts; in a hub module (P4–P10) the last lesson of the module, or a lesson where an experiment teaches best, has a notebook block; the last part holds the coverage block, the keep block (rule 5ד), the exercises (estimates, trade-offs, finding errors), the today block and the sentence about the next lesson.`.trim();

function partInstructions(plan: PartPlan, k: number, writtenSoFar: string) {
  const p = plan.parts[k];
  const n = plan.parts.length;
  const last = k === n - 1;
  const prior = writtenSoFar.length > 60000 ? `[…start omitted…]\n${writtenSoFar.slice(-60000)}` : writtenSoFar;
  return `WRITING STEP: part ${k + 1} of ${n} of this lesson. Write as the authors (see <voice>).
Lesson plan (yours, from the planning step):
${JSON.stringify(plan, null, 1)}

${prior ? `The lesson text written so far (parts 1–${k}), which the learner is reading right now:\n<<<\n${prior}\n>>>\n` : ""}
Now write ONLY part ${k + 1}: «${p.title}». It covers: ${p.covers}.${p.blocks?.length ? ` Blocks for this part: ${p.blocks.join(", ")}.` : ""}${p.l25?.length ? ` Level-2.5 sections for this part: ${p.l25.join(", ")}.` : ""}
Length: about ${p.words ?? 1100} Hebrew words of real teaching (more is fine, less is not).
${k === 0 ? "Start the lesson (no preamble about the plan or the parts)." : "Continue seamlessly from the last sentence above: no greeting, no recap, no repeated heading; open with the explicit transition from where the text stopped. Continue the equation numbering from the last \\tag above."}
Do not write material that belongs to later parts. Teach step by step: every step of a full derivation on its own line with its reason in words; a skeleton derivation names the starting point, the key step and where each assumption enters. Put [[DOC:PAGE]] at the paragraph where the source page changes. Show each original figure assigned to this part with a figure block, then explain it. State computed values exactly as in "facts" (run compute for anything new).
Tag every level-2.5 section this part covers ([[2.5: …]]) at the start of its paragraph.
${last ? "This is the last part: write the coverage block, the exercises, the today block, and the sentence about the next lesson." : "Do not end the lesson and do not write exercises yet."}`;
}

export async function composeLesson(opts: Base & { text: string; resume?: { plan: PartPlan; partsDone: number; text: string } }) {
  const { rt, history, text, effort, module: m, lessons, lessonIdx, memory, notes, allNotes, signal, cb, resume } = opts;
  if (!rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  cb.onStatus?.("טוען את עמודי המקור של השיעור");
  const pages = await lessonPages(lessons?.[lessonIdx], m);
  const ctx = studyContext({ mode: "lesson", module: m, lessons, lessonIdx, memory, pages, notes, allNotes, done: opts.done });
  const tools = rt.canUseTools ? buildTools(cb, moduleDocs(m)) : null;

  let plan = resume?.plan;
  if (!plan) {
    cb.onStatus?.("מתכנן את השיעור: קורא את המקורות ומחשב את המספרים");
    const planTurn = `${ctx}\n\n${text}\n\n${PART_PLAN_INSTRUCTIONS}`;
    plan = await rt.sample.json<PartPlan>([...fitHistory(history, bytes(planTurn)), { role: "user", content: planTurn }], {
      model: MODEL,
      modelTier: "complex",
      effort,
      signal,
      ...(tools ? { tools } : { cache: false }),
    });
    if (!plan || !Array.isArray(plan.parts) || !plan.parts.length) throw { code: "invalid_json", message: "no plan" };
    cb.onCheckpoint?.(plan, 0, "");
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
      const res = await rt.sample([...fitHistory(history, bytes(turn)), { role: "user", content: turn }], {
        model: MODEL,
        modelTier: "complex",
        effort,
        signal,
        ...(tools ? { tools } : { cache: false }),
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
- הקורס מתחיל. עוד לא נלמד אף מודול.

## מה נלמד
(עדיין אין שיעורים.)

## כלים ומושגים שנפגשו

## מבנים משותפים שזוהו

## חיבורים פתוחים

## סימונים ומוסכמות

## מקרים הנדסיים שכבר שימשו

## טעויות שנמצאו במקורות

## קשיים, שאלות פתוחות והעדפות
- היעד: רמה 2.5. לכל תוצאה מרכזית: מבנה, מקור, גבולות, סדר גודל, פשרה, מבנה משותף וביקורת.
- גזירות: מה שחוזר נגזר במלואו; מה שספציפי מקבל שלד עם ההנחות. גזירה מלאה רק כשמבקש.
- תרגילים: הערכות, פשרות ומציאת טעויות, לא שחזור הוכחות.
- חשוב לו "העולם של היום" עם רמת ודאות לכל טענה, ותלת-ממד איכותי בכל מקום שהוא מוסיף הבנה.
`;

export async function updateMemory(rt: Runtime, memory: string, answer: StoredMessage, request: string, where: string) {
  if (!rt.sample) return null;
  const body = answer.text.length > 90000 ? answer.text.slice(0, 90000) + "\n[…]" : answer.text;
  const prompt = `You maintain the running memory of a personal course in which a tutor teaches one learner engineering at the level of an elite technology unit (mathematics and physics spine, signals, control, probability, optimization, fields, and bridges to electronics, energy, aero, structures, AI and robotics), in Hebrew, module by module. The tutor reads this memory before every answer, so it is how later lessons refer back to earlier ones.

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
## כלים ומושגים שנפגשו — each tool/concept: where it was first met, the number from that first example, and the order-of-magnitude to remember (the tutor uses this to refresh tools later).
## סימונים ומוסכמות — notation choices to keep consistent across sources.
## מבנים משותפים שזוהו — the same equation or structure recognized across fields (where each was seen).
## חיבורים פתוחים — from the fieldmap blocks: formula → field → the module where it will be taught. Add the new ones; remove an entry once a later lesson closed it with a domain block. The tutor closes these when it reaches that field.
## מקרים הנדסיים שכבר שימשו — so later lessons do not repeat them.
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
