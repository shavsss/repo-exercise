// The topic-based curriculum attached to each module of lib/index.json by
// tools/curriculum (from F_curriculum, the fixed reading lists and the P2-H sources):
// lesson items beyond the pages, test-out and brief sections, and the reading list.
// All fields are optional: an index without them behaves as before. Same file in both apps.
import type { Module } from "./library";

export interface TopicItem {
  id: string;
  /** name */
  n: string;
  /** K = must master, S = should know, C = a mention */
  imp: string;
  /** new: no page teaches it; deepen: the pages treat it partly; delta: taught in full in `primary`; mention */
  k: "new" | "deepen" | "delta" | "mention";
  /** what to add */
  teach?: string;
  /** app:module that teaches it in full (delta items) */
  primary?: string;
  /** a test-out candidate */
  to?: 1;
}
export interface SectionRef {
  /** title */
  t: string;
  d?: string;
  p?: [number, number] | null;
  why?: string;
  /** a subtopic (no page range), with its importance */
  sub?: 1;
  imp?: string;
}
export interface ReadingItem {
  id: string;
  t: string;
  a: string;
  o: string;
  y: number | string;
  u: string;
  core: boolean;
  why: string;
  focus: string;
  /** hours of focused reading */
  h: number;
  kind?: string;
  /** link check: ok | doi | blocked (opens in a browser) | timeout | rough */
  st: string;
  /** P2-H: the topic of the module it serves */
  topic?: string;
  p2h?: 1;
  pay?: 1;
  /** an open copy of a paywalled item */
  alt?: string;
}
export interface CurriculumFields {
  items?: TopicItem[];
  testout?: SectionRef[];
  brief?: SectionRef[];
  reading?: ReadingItem[];
}

/** No library pages to teach from: the tutor teaches the module from its topic items and reading list. */
export function sourceless(m: Module) {
  return !m.sources.some((s) => s.role === "main" || s.role === "supp");
}

const where = (s: SectionRef) => (s.d && s.p ? ` [${s.d}:${s.p[0]}${s.p[1] > s.p[0] ? `–${s.p[1]}` : ""}]` : "");

/** The curriculum part of the module block in <study_context>; empty when the module has none. */
export function curriculumBlock(m: Module & CurriculumFields) {
  const out: string[] = [];
  if (sourceless(m) && m.items?.length)
    out.push(
      `This module has no pages in the library: it is taught from its topic items below, from your own knowledge at the full depth bar, and from its reading list. When splitting it into lessons, give every lesson its topic items in "covers" (their exact names) and leave "sources" empty; state where each number comes from (a published source, with a certainty label).`,
    );
  if (m.items?.length)
    out.push(
      `Topic items of the curriculum for this module (rule on topic items; same technical-engineering register as the rest of the lesson). K = must master, S = should know, C = a mention. new = no library page teaches it, teach it in full; deepen = the pages treat it partly, add what is listed; delta = taught in full in the module named, give the short delta and point there; mention = one or two sentences. When splitting the module into lessons, each item goes to the lesson whose topic it extends (name it in that lesson's "covers"):\n` +
        m.items.map((x) => `- [${x.imp} ${x.k}${x.to ? ", test-out" : ""}] ${x.n}${x.teach ? `: ${x.teach}` : ""}${x.primary ? ` (full lesson in ${x.primary})` : ""}`).join("\n"),
    );
  if (m.testout?.length)
    out.push(
      `Test-out (never skipped): open each of these with a short diagnostic of two or three questions in one think block; a correct answer gets a condensed treatment with the page tag to the full text and a deepen note in the notebook for a later recheck, otherwise the full lesson:\n` +
        m.testout.slice(0, 40).map((s) => `- ${s.t}${where(s)}${s.sub ? " (subtopic)" : ""}`).join("\n") +
        (m.testout.length > 40 ? `\n- … and ${m.testout.length - 40} more sections of the same kind` : ""),
    );
  if (m.brief?.length)
    out.push(
      `Brief overview (taught in a paragraph or two with the page tag to the full text, never dropped):\n` +
        m.brief.slice(0, 30).map((s) => `- ${s.t}${where(s)}`).join("\n") +
        (m.brief.length > 30 ? `\n- … and ${m.brief.length - 30} more` : ""),
    );
  if (m.reading?.length)
    out.push(
      `Reading list of this module (rule on the reading list: propose an item when it answers a question the lesson raised; core items in the lesson that teaches their topic, optional ones only when the question comes up; give the id, why this one, and which part to read; p2h = a stronger source for a domain the books cover thinly, lean on it for numbers):\n` +
        m.reading
          .map((r) => `- ${r.id} [${r.core ? "core" : "optional"}${r.p2h ? ", p2h" : ""}, ${r.h} h] ${r.t}. ${r.a}${r.o ? `, ${r.o}` : ""}, ${r.y}.${r.topic ? ` Topic: ${r.topic}.` : ""} Why: ${r.why} Focus: ${r.focus}`)
          .join("\n"),
    );
  return out.length ? `\n${out.join("\n")}` : "";
}

/**
 * The modules after this one in the course order, each with the main sections of its pages (depth 0-1) and the K/S topic
 * items it adds (24.11, the learner: a lesson of M14 developed Navier-Stokes at length, though M15.1 teaches it; 25.11: M0.2
 * lesson 1 developed GPS ionosphere correction, widelane and cycle slips, which M5 teaches from its pages, while the list
 * showed only titles and added items). Given to the module planner, the lesson planner and the lesson's reviewer.
 * `omit`: modules whose title matches, and items whose name matches, are left out of the list (Lanchester: the combat
 * topics, after 16 refusals on 25.11 on lessons written before without one).
 */
export function laterModules(m: Module, mods: Module[], omit?: RegExp) {
  const at = mods.findIndex((x) => x.id === m.id);
  if (at < 0) return [];
  return mods.slice(at + 1).filter((x) => !omit?.test(x.en));
}

/** The most characters of <later_modules> (25.11: the 256 KiB cap is in bytes, and the plan's turn with a 68,000-character list
 * and the notebook passed it; the caller gives less when the turn has less room). */
export const LATER_CHARS = 25000;
/** Headings that name no topic (references, exercises…): left out of the list. */
const NOT_A_TOPIC = /^(references?|bibliography|exercises|problems|questions|software|index|summary|introduction|preface|notes|guide to the references|further reading|acronyms|glossary)\b/i;

/** A section number before a heading ("19.1 ", "A.2 ", "12 "); 25.11: `[\dA-Z.:]*` also took the first letter of "References". */
const SECTION_NUMBER = /^(?:\d+|[A-Z])(?:[.:]\d+)*\.?\s+/;

export function laterModulesBlock(m: Module, mods: Module[], omit?: RegExp, max = LATER_CHARS) {
  const later = laterModules(m, mods, omit);
  if (!later.length || max <= 0) return "";
  const sectionsOf = (x: Module) =>
    (x.sections ?? [])
      .filter((t) => t.depth <= 1 && !omit?.test(t.title))
      .map((t) => t.title.replace(/\s+\d+\s*$/, "").trim())
      .filter((t) => !NOT_A_TOPIC.test(t.replace(SECTION_NUMBER, "")));
  const lines = later.map((x) => {
    const items = (x.items ?? []).filter((t) => (t.k === "new" || t.k === "deepen") && t.imp !== "C" && !omit?.test(t.n)).map((t) => t.n);
    const s = sectionsOf(x);
    return { head: `- ${x.id} ${x.en}`, items: items.length ? `. Added topics: ${items.join("; ")}` : "", sections: s.length ? `. Sections: ${s.join("; ")}` : "", use: { items: false, sections: false } };
  });
  // within `max`: the title of every module it can hold, nearest first; then, nearest first, the topic items each adds and
  // the main sections of its pages (25.11: Gilua's 464 modules with their sections came to 640,000 characters)
  const intro = "\n\n<later_modules>\nThe modules that come after this one in the course, in order, with the topic items each adds beyond its pages and, for the nearer ones, the main sections of its pages: each teaches its subject in full. A topic one of them teaches is not developed here (rule on anchor claims):\n";
  let size = intro.length + 60;
  let n = 0;
  while (n < lines.length && size + lines[n].head.length + 1 <= max) size += lines[n++].head.length + 1;
  for (const k of ["items", "sections"] as const)
    for (let i = 0; i < n; i++) {
      if (!lines[i][k]) continue;
      if (size + lines[i][k].length > max) break;
      lines[i].use[k] = true;
      size += lines[i][k].length;
    }
  if (!n) return "";
  const body = lines.slice(0, n).map((l) => l.head + (l.use.sections ? l.sections : "") + (l.use.items ? l.items : "")).join("\n");
  return `${intro}${body}${n < lines.length ? `\n(and ${lines.length - n} more modules after these)` : ""}\n</later_modules>`;
}
