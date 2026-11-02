// The lesson map: which sections of a lesson are its own subject (learn now, copy to the summary), which are a
// first look at a topic a later module teaches in full, and which are an illustration from an application field.
// Made once per lesson by one separate call (components/LessonGuide.tsx) and kept in
// profile/guides/<module>__<lesson>. This file holds the pure parts: the headings of a lesson, the prompt, the
// defensive parsing of the answer, and the matching of a heading on the page to its entry. Identical in both labs.

export type GuideKind = "core" | "preview" | "example";
export interface GuideSection {
  /** the heading's text, as in the lesson (Markdown emphasis removed, math kept) */
  head: string;
  kind: GuideKind;
  /** preview: the module that teaches the topic in full; example: the module that teaches the field, if any */
  module?: string;
  /** a short reason, in Hebrew */
  note?: string;
  /** blocks only: the block's match key (its title or first line, or the math itself) */
  key?: string;
}
/** a definition or formula block of the lesson, marked like a heading (what to copy is decided per block) */
export interface LessonBlock {
  id: string;
  type: "definition" | "formula";
  /** the block's title (@title) or its first line, clean */
  text: string;
  key: string;
  /** the heading of the section it sits in */
  section: string;
  lead: string;
}

export interface LessonGuide {
  v: 1;
  at: number;
  sections: GuideSection[];
  /** short items worth copying to the summary */
  copy: string[];
  /** the definition and formula blocks, each marked (head = the block's title or first line) */
  blocks?: GuideSection[];
  /** made from a lesson that was not finished yet (a draft): made again once it has more headings */
  partial?: boolean;
  /** how many headings the lesson had when the map was made */
  heads?: number;
}

const KINDS: GuideKind[] = ["core", "preview", "example"];

/** The heading text as it is shown: no leading #, no emphasis or escapes; math and tags kept. */
export function cleanHead(src: string): string {
  return src
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/\s+#+\s*$/, "")
    .split(/(\$[^$\n]*\$)/g)
    .map((p, i) => (i % 2 ? p : p.replace(/(?<!\\)[*_~]+/g, "").replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** Letters and digits only, lower case, single spaces: what two spellings of one heading share. */
export function normHead(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/[֑-ׇ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * The key of a heading written in Markdown: math, inline code and [[tags]] left out (on the page they are drawn
 * by KaTeX and by pills, whose text is skipped the same way by hastKey), then normalized.
 */
export function headKey(src: string): string {
  return normHead(
    cleanHead(src)
      .replace(/\$\$[\s\S]*?\$\$/g, " ")
      .replace(/\\\(([\s\S]*?)\\\)/g, " ")
      .replace(/\$[^$\n]*\$/g, " ")
      .replace(/\[\[[^\]\n]*\]\]/g, " ")
      .replace(/`[^`\n]*`/g, " "),
  );
}

interface HastLike {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: { className?: unknown };
  children?: HastLike[];
}
/** The key of a heading as react-markdown hands it to the renderer (its hast node): KaTeX and code skipped. */
export function hastKey(node: HastLike | undefined): string {
  const walk = (n: HastLike | undefined): string => {
    if (!n) return "";
    if (n.type === "text") return n.value ?? "";
    const cls = n.properties?.className;
    const list = Array.isArray(cls) ? cls.map(String) : typeof cls === "string" ? cls.split(/\s+/) : [];
    if (n.tagName === "code" || list.some((c) => c === "katex" || c === "katex-display" || c.startsWith("language-math") || c === "math-inline" || c === "math-display")) return " ";
    return (n.children ?? []).map(walk).join("");
  };
  return normHead(walk(node));
}

/** Two keys name the same heading: equal, or one starts the other (a heading the model shortened or lengthened). */
export function sameHead(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  return s.length >= 6 && (l.startsWith(s + " ") || l.startsWith(s));
}

/** The entry of the map for a heading key; null when the map does not name it. */
/** The map's entry for a definition or formula block, by its source (title or first line). */
export function findBlock(guide: LessonGuide | null | undefined, code: string): GuideSection | null {
  if (!guide?.blocks?.length) return null;
  const { key } = blockKeyOf(code);
  if (!key) return null;
  const kOf = (b: GuideSection) => b.key || headKey(b.head);
  return guide.blocks.find((b) => kOf(b) === key) ?? guide.blocks.find((b) => !!kOf(b) && sameHead(kOf(b), key)) ?? null;
}

export function findSection(guide: LessonGuide | null | undefined, key: string): GuideSection | null {
  if (!guide || !key) return null;
  const exact = guide.sections.find((s) => headKey(s.head) === key);
  if (exact) return exact;
  return guide.sections.find((s) => sameHead(headKey(s.head), key)) ?? null;
}

export interface LessonHead {
  level: 2 | 3;
  /** clean text (cleanHead) */
  text: string;
  key: string;
  /** the first words of the section */
  lead: string;
}

/** The h2/h3 headings of a lesson's Markdown (outside fenced blocks), each with the first `words` words after it. */
export function lessonHeadings(md: string, words = 40): LessonHead[] {
  const out: (LessonHead & { body: string[] })[] = [];
  let fence: string | null = null;
  for (const line of md.split("\n")) {
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    const h = fence ? null : /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (h) {
      const text = cleanHead(h[2]);
      const key = headKey(h[2]);
      if (key) out.push({ level: h[1].length as 2 | 3, text, key, lead: "", body: [] });
      continue;
    }
    const cur = out[out.length - 1];
    if (!cur) continue;
    if (/^\s*@\w+:/.test(line)) continue;
    cur.body.push(line);
  }
  return out.map(({ body, ...h }) => ({
    ...h,
    lead: body
      .join(" ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/\[\[([^\]|\n]*)(?:\|[^\]\n]*)?\]\]/g, "$1")
      .replace(/[*_#>`]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, words)
      .join(" "),
  }));
}

/** The key of a definition or formula block, from its source (headers and body): its @title, else its first line. */
export function blockKeyOf(code: string): { text: string; key: string } {
  const lines = code.split("\n");
  let title = "";
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^@(\w+):\s*(.*)$/.exec(lines[i].trim());
    if (!m) break;
    if (m[1] === "title") title = m[2];
  }
  const first = lines.slice(i).map((l) => l.trim()).find((l) => l && !/^\$\$?$/.test(l)) ?? "";
  const text = cleanHead(title || first).slice(0, 120);
  // a formula block is often only math, which headKey leaves out: its key is then the math itself, without spaces
  return { text, key: headKey(text) || text.replace(/\s+/g, "").slice(0, 80) };
}

/** The definition and formula blocks of a lesson's Markdown, with the section each sits in. */
export function lessonBlocks(md: string, words = 30): LessonBlock[] {
  const out: LessonBlock[] = [];
  let section = "";
  let open: { type: LessonBlock["type"]; fence: string; lines: string[] } | null = null;
  let other: string | null = null;
  for (const line of md.split("\n")) {
    if (open) {
      if (new RegExp(`^\\s*${open.fence}\\s*$`).test(line)) {
        const code = open.lines.join("\n");
        const { text, key } = blockKeyOf(code);
        if (key) {
          const body = code.replace(/^\s*@\w+:.*$/gm, "").replace(/[$*_#>`]/g, "").replace(/\s+/g, " ").trim();
          out.push({ id: `B${out.length + 1}`, type: open.type, text, key, section, lead: body.split(" ").slice(0, words).join(" ") });
        }
        open = null;
      } else open.lines.push(line);
      continue;
    }
    const f = /^\s*(`{3,}|~{3,})\s*([\w-]*)/.exec(line);
    if (f) {
      if (other) {
        // only a bare fence closes a block (a fence with a language opens one)
        if (f[1][0] === other && !f[2]) other = null;
        continue;
      }
      if (f[2] === "definition" || f[2] === "formula") open = { type: f[2], fence: f[1].replace(/`/g, "\\`"), lines: [] };
      else other = f[1][0];
      continue;
    }
    if (other) continue;
    const h = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (h) section = cleanHead(h[2]);
  }
  return out;
}

export interface GuideInput {
  moduleId: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonNo: number;
  lessonCount?: number;
  heads: LessonHead[];
  blocks?: LessonBlock[];
  modules: { id: string; title: string }[];
}

/** The one call that makes the map. The marker <lesson_headings> also tells the test stub which call this is. */
export function guidePrompt(o: GuideInput): string {
  const mods = o.modules.map((m) => `${m.id} ${m.title.replace(/\s+/g, " ").trim().slice(0, 70)}`).join("\n");
  const heads = o.heads.map((h, i) => `${i + 1}. [h${h.level}] ${h.text}\n   first words: ${h.lead || "(none)"}`).join("\n");
  const blocks = (o.blocks ?? []).map((b) => `${b.id}. [${b.type}] ${b.text}\n   in section: ${b.section || "(top)"}\n   first words: ${b.lead || "(none)"}`).join("\n");
  return `A learner studies an engineering, physics and mathematics course on his own, one lesson at a time, and keeps a summary notebook. Below are the headings of one lesson he has received (each with its first words), and the list of the course's modules. Mark each heading so he knows what to learn and copy now and what only to understand.

Kinds:
- "core": the lesson's own subject, the material of module ${o.moduleId} that this lesson teaches. Learn it now and copy it to the summary. Opening, recap and "what to remember" sections are core.
- "preview": a topic introduced here only as a first look, which a LATER module of the list teaches in full. Put that module's id in "module". Use it only when a module of the list clearly teaches this topic.
- "example": an illustration from an application field (navigation, sensing, communications, a device or a system), used to show the idea and not to be learned for itself. Put in "module" the module of the list that teaches that field, only if there is one.
When unsure, choose "core".

<lesson module="${o.moduleId}" lesson="${o.lessonNo}${o.lessonCount ? ` of ${o.lessonCount}` : ""}">
Module: ${o.moduleId} ${o.moduleTitle}
Lesson title: ${o.lessonTitle}
</lesson>

<lesson_headings>
${heads}
</lesson_headings>

<lesson_blocks>
${blocks || "(none)"}
</lesson_blocks>

<course_modules>
${mods}
</course_modules>

Answer with one JSON object and nothing else (no prose, no code fence):
{"sections":[{"head":"<the heading text exactly as given>","kind":"core|preview|example","module":"<a module id from the list, or omit>","note":"<why, in Hebrew, at most 12 words>"}],"blocks":[{"id":"<B1, B2… as given>","kind":"core|preview|example","module":"<a module id from the list, or omit>","note":"<in Hebrew, at most 12 words>"}],"copy":["<what is worth copying to the summary, in Hebrew: 2 to 6 short items, the definitions, results and formulas of the core sections>"]}
One entry per heading, in the same order, and one entry per block of <lesson_blocks>. Mark each definition and formula on its own: "core" when the learner should copy it to his summary now (it is part of what this lesson teaches), "preview" when it belongs to a topic a later module teaches in full (he only needs the idea now), "example" when it is a field's formula used as an illustration. A block in a preview or example section can still be core, and the reverse.`;
}

const words = (s: string, n: number) => s.replace(/\s+/g, " ").trim().split(" ").slice(0, n).join(" ");

/** The JSON object in a model's answer (a code fence or words around it are tolerated). */
function jsonOf(raw: string): unknown {
  const t = raw.replace(/```(?:json)?/gi, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch {
    return null;
  }
}

/**
 * The map from a model's answer, or null when it is not usable. Every entry is tied to a heading of the lesson
 * (its text is replaced by the lesson's own), module ids not in the course are dropped, notes are cut to 12 words.
 */
export function parseGuide(raw: unknown, heads: LessonHead[], moduleIds: Iterable<string>, current?: string, at = Date.now(), lblocks: LessonBlock[] = []): LessonGuide | null {
  const obj = (typeof raw === "string" ? jsonOf(raw) : raw) as { sections?: unknown; copy?: unknown; blocks?: unknown } | null;
  if (!obj || typeof obj !== "object" || !Array.isArray(obj.sections)) return null;
  const ids = new Set(moduleIds);
  const used = new Set<number>();
  const sections: GuideSection[] = [];
  for (const s of obj.sections as Record<string, unknown>[]) {
    if (!s || typeof s !== "object" || typeof s.head !== "string") continue;
    const kind = String(s.kind ?? "").trim().toLowerCase() as GuideKind;
    if (!KINDS.includes(kind)) continue;
    const key = headKey(s.head);
    let at = heads.findIndex((h, i) => !used.has(i) && h.key === key);
    if (at < 0) at = heads.findIndex((h, i) => !used.has(i) && sameHead(h.key, key));
    if (at < 0) continue;
    used.add(at);
    const sec: GuideSection = { head: heads[at].text, kind };
    const mod = typeof s.module === "string" ? s.module.trim() : "";
    if (mod && kind !== "core" && ids.has(mod) && mod !== current) sec.module = mod;
    const note = typeof s.note === "string" ? words(s.note, 12) : "";
    if (note) sec.note = note;
    sections.push(sec);
  }
  const blocks: GuideSection[] = [];
  if (Array.isArray(obj.blocks))
    for (const b of obj.blocks as Record<string, unknown>[]) {
      if (!b || typeof b !== "object") continue;
      const kind = String(b.kind ?? "").trim().toLowerCase() as GuideKind;
      const lb = lblocks.find((x) => x.id === String(b.id ?? "").trim());
      if (!lb || !KINDS.includes(kind) || blocks.some((x) => x.head === lb.text)) continue;
      const sec: GuideSection = { head: lb.text, kind, key: lb.key };
      const mod = typeof b.module === "string" ? b.module.trim() : "";
      if (mod && kind !== "core" && ids.has(mod) && mod !== current) sec.module = mod;
      const note = typeof b.note === "string" ? words(b.note, 12) : "";
      if (note) sec.note = note;
      blocks.push(sec);
    }
  if (!sections.length && !blocks.length) return null;
  const copy = Array.isArray(obj.copy)
    ? (obj.copy as unknown[])
        .filter((x): x is string => typeof x === "string" && !!x.trim())
        .map((x) => x.replace(/\s+/g, " ").trim().slice(0, 160))
        .slice(0, 8)
    : [];
  return { v: 1, at, sections, copy, blocks };
}

/** A stored map, checked the same way (a document written by an older or other client is never trusted blindly). */
export function asGuide(doc: unknown): LessonGuide | null {
  const d = doc as Partial<LessonGuide> | null;
  if (!d || typeof d !== "object" || !Array.isArray(d.sections)) return null;
  const sections = d.sections.filter((s): s is GuideSection => !!s && typeof s.head === "string" && KINDS.includes(s.kind as GuideKind));
  const blocks = Array.isArray(d.blocks) ? d.blocks.filter((s): s is GuideSection => !!s && typeof s.head === "string" && KINDS.includes(s.kind as GuideKind)) : undefined;
  if (!sections.length && !blocks?.length) return null;
  return { v: 1, at: Number(d.at) || 0, sections, copy: Array.isArray(d.copy) ? d.copy.filter((x): x is string => typeof x === "string") : [], partial: d.partial === true, heads: Number(d.heads) || sections.length, blocks };
}

/** The words of a heading's tag. */
export function tagLabel(s: Pick<GuideSection, "kind" | "module">): { kind: string; rest: string; module?: string } {
  if (s.kind === "core") return { kind: "לב השיעור", rest: "לסיכום" };
  if (s.kind === "preview") return { kind: "הכרות", rest: "", module: s.module };
  return { kind: "המחשה", rest: "לא להעתיק", module: s.module };
}

/** The tag as one line of text (for titles and screen readers). */
export function tagText(s: Pick<GuideSection, "kind" | "module">): string {
  const t = tagLabel(s);
  return [t.kind, t.rest, t.module ? `נלמד ב-${t.module}` : ""].filter(Boolean).join(" · ");
}
