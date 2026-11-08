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
