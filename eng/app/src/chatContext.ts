// What a question in a lesson's conversation sends of the lesson (identical in both apps).
// Every call is memoryless, so before this every question re-sent the whole lesson (often 20
// thousand words) with the rules and the course memory, even for a three-line answer. Now a long
// lesson goes out as the list of its chapters plus only the chapters that share the most terms
// with the learner's question; the tutor reads any other chapter with the read_lesson_chapter
// tool. A short lesson goes out whole, as before.
import { compactVisuals } from "./lessonAudit";
import type { StoredMessage } from "./types";

const enc = new TextEncoder();
const bytes = (s: string) => enc.encode(s).length;

/** The most of a lesson a question sends (UTF-8 bytes; Hebrew is two bytes a letter). */
export const LESSON_FOCUS_BYTES = 30_000;
/** The rest of the conversation (questions and answers) a question sends, newest first. */
export const CHAT_HISTORY_BYTES = 60_000;

export interface Chapter {
  head: string;
  text: string;
}

/** A lesson cut at its "## " and "### " headings (outside code fences), so a unit is a sub-section N.k;
 *  what comes before the first heading is "פתיחה". */
export function lessonChapters(text: string): Chapter[] {
  const out: Chapter[] = [];
  let cur: string[] = [];
  let head = "פתיחה";
  let fence = false;
  const push = () => {
    const t = cur.join("\n");
    if (t.trim()) out.push({ head, text: t });
  };
  for (const line of text.split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    if (!fence && /^#{2,3} /.test(line)) {
      push();
      cur = [];
      head = line.replace(/^#+\s*/, "").trim();
    }
    cur.push(line);
  }
  push();
  return out;
}

// Hebrew attaches ו, ה, ב, ל, מ, ש, כ to the word, so a word is also counted without one of them
const PREFIX = /^[והבלמשכ]/;
function terms(s: string): Set<string> {
  const out = new Set<string>();
  for (const w of s.toLowerCase().match(/[\p{L}\p{N}_]{2,}/gu) ?? []) {
    if (w.length < 3 && !/\d/.test(w)) continue;
    out.add(w);
    if (PREFIX.test(w) && w.length >= 4) out.add(w.slice(1));
  }
  return out;
}

/** The chapters ranked by the question: shared terms, each weighted by how few chapters hold it. */
export function rankChapters(chapters: Chapter[], question: string): number[] {
  const q = terms(question);
  const sets = chapters.map((c) => terms(c.text));
  const score = chapters.map((_c, i) => {
    let s = 0;
    for (const t of q) {
      if (!sets[i].has(t)) continue;
      const df = sets.filter((x) => x.has(t)).length;
      s += 1 / df;
    }
    return s;
  });
  return chapters.map((_c, i) => i).filter((i) => score[i] > 0).sort((a, b) => score[b] - score[a] || a - b);
}

/** A long lesson as its table of contents and the chapters closest to the question, up to `budget`. */
export function focusLesson(text: string, question: string, budget = LESSON_FOCUS_BYTES): string {
  const compact = compactVisuals(text);
  if (bytes(compact) <= budget) return compact;
  const chapters = lessonChapters(compact);
  if (chapters.length < 2) return cut(compact, budget);
  const ranked = rankChapters(chapters, question);
  // no shared term: the last section, which holds the keep block (what the lesson says to remember)
  const order = ranked.length ? ranked : [chapters.length - 1];
  const picked = new Set<number>();
  let used = 0;
  for (const i of order) {
    const b = bytes(chapters[i].text);
    if (picked.size && used + b > budget) continue;
    picked.add(i);
    used += b;
  }
  const toc = chapters.map((c, i) => `${i + 1}. ${c.head}${picked.has(i) ? " (included below)" : ""}`).join("\n");
  const body = chapters
    .map((c, i) => (picked.has(i) ? cut(c.text, budget) : `[section ${i + 1} "${c.head}" not included]`))
    .join("\n\n");
  return `[This lesson is long, so only the sections closest to the learner's question are included here. All its sections:
${toc}
To read any other section, call read_lesson_chapter with its number before answering about it.]

${body}`;
}

function cut(t: string, budget: number): string {
  if (bytes(t) <= budget) return t;
  // Hebrew is about two bytes a character; the end is kept too, since a lesson's last chapter ends with its keep block
  const chars = Math.floor(budget / 2);
  const head = Math.floor(chars * 0.7);
  return `${t.slice(0, head)}\n[… the middle of this section was cut; read_lesson_chapter gives it whole …]\n${t.slice(t.length - (chars - head))}`;
}

/** The question a turn answers: the learner's text, or for a continuation the last question asked. */
export function questionOf(history: StoredMessage[], text: string, continuing: boolean): string {
  if (!continuing) return text;
  for (let i = history.length - 1; i >= 0; i--) if (history[i].role === "user" && history[i].mode !== "lesson") return history[i].text;
  return text;
}

/** The history with every long lesson replaced by its focused form, and the chapters of the last one. */
export function focusHistory(history: StoredMessage[], question: string): { history: StoredMessage[]; chapters: Chapter[] } {
  let chapters: Chapter[] = [];
  const out = history.map((m) => {
    if (m.role !== "assistant" || m.mode !== "lesson" || !m.text.trim()) return m;
    chapters = lessonChapters(compactVisuals(m.text));
    return { ...m, text: focusLesson(m.text, question) };
  });
  return { history: out, chapters };
}
