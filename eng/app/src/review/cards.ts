// The review cards: made locally from what he has already read, with no model call (NIGHT_PLAN P2-A).
//   - every line of a keep ("לסיכום") block that opens with a name ("שם: …"), and the rest of the block as one card;
//   - every definition and formula block with a title;
//   - think questions he got wrong, partly, or answered while guessing (from the calibration records);
//   - his own margin notes of the kinds "הערה" and "להעמקה", asked from the quote they sit beside.
// And the day's queue: due cards first (lowest predicted recall first), new cards only while the daily time
// budget lasts. Pure, so it is unit tested with the scheduler (tools/test/fsrs.test.mjs). Same file in both labs.
import { addDays, dayStart, newMem, recallNow, type Mem } from "./fsrs";

export type CardKind = "keep" | "keepAll" | "def" | "formula" | "think" | "note";

export interface Card extends Mem {
  id: string;
  kind: CardKind;
  front: string;
  back: string;
  /** "M0.1 · שיעור 2: title" */
  src: string;
  moduleId: string;
  lesson: number;
  /** the conversation it was read from (rescanned when the lesson changes) */
  conv?: string;
  added: number;
  /** measured seconds per review (moving average) */
  sec?: number;
  /** a question the quick model wrote for it ("נסח לי שאלה"), shown instead of the front */
  ask?: string;
  /** taken out of the review by him */
  off?: boolean;
}

/** Seconds a review of each kind is expected to take (P §1.3: C 0.5 min, S 1.3 min), before it is measured. */
export const EST_SEC: Record<CardKind, number> = { def: 30, keep: 30, keepAll: 75, formula: 45, think: 75, note: 40 };
/** the daily budget: about 25 minutes */
export const DAILY_SEC = 25 * 60;
/** new cards a day at most, so a long lesson day does not turn into a long review week */
export const NEW_PER_DAY = 15;

const FRONT_MAX = 600;
const BACK_MAX = 1500;

export function hashId(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

function headers(src: string) {
  const h: Record<string, string> = {};
  const lines = src.split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^@(\w+):\s*(.*)$/.exec(lines[i].trim());
    if (!m) break;
    h[m[1]] = m[2];
  }
  return { h, body: lines.slice(i).join("\n").trim() };
}

/** "**שם**: …", "שם: …", "שם — …": the name, and the rest; null when the line has no short name in front */
export function splitNamed(line: string): { name: string; rest: string } | null {
  const l = line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "").trim();
  const bold = /^\*\*(.{2,80}?)\*\*\s*[:：—–-]?\s*(.+)$/.exec(l);
  if (bold) return { name: bold[1].replace(/[:：]$/, "").trim(), rest: bold[2].trim() };
  // the separator must come before any math, so "$a:b$" is never cut
  const at = l.search(/[:：]|\s[—–]\s/);
  const math = l.indexOf("$");
  if (at < 2 || at > 80 || (math >= 0 && math < at)) return null;
  const name = l.slice(0, at).replace(/[*_]/g, "").trim();
  const rest = l.slice(at + 1).replace(/^[—–\s]+/, "").trim();
  return name && rest ? { name, rest } : null;
}

export interface Seed {
  id: string;
  kind: CardKind;
  front: string;
  back: string;
}

/** The cards one lesson's text gives, without the think questions (those need the calibration records). */
export function seedsFromLesson(text: string, place: { moduleId: string; lesson: number; title?: string }): Seed[] {
  const out: Seed[] = [];
  const key = `${place.moduleId}|${place.lesson}|`;
  const add = (kind: CardKind, front: string, back: string) => {
    const f = cut(front.trim(), FRONT_MAX);
    const b = cut(back.trim(), BACK_MAX);
    if (!f || !b) return;
    const id = `${kind}-${hashId(key + norm(f) + "|" + norm(b).slice(0, 120))}`;
    if (!out.some((s) => s.id === id)) out.push({ id, kind, front: f, back: b });
  };
  for (const m of text.matchAll(/```(keep|definition|formula)[^\n]*\n([\s\S]*?)```/g)) {
    const [, lang, raw] = m;
    if (lang === "keep") {
      const lines = raw.split("\n").filter((l) => l.trim());
      const loose: string[] = [];
      for (const line of lines) {
        const nm = splitNamed(line);
        if (nm) add("keep", `«${nm.name}»: מה הנוסחה או ההגדרה, ומתי היא תקפה?`, nm.rest);
        else loose.push(line);
      }
      // what is left (a line without a name, a bare formula) is rebuilt together, as one card for the block
      if (loose.length) add("keepAll", `${place.title ? `מהשיעור «${place.title}»` : "מהשיעור"}: מה כדאי לזכור? נסה לשחזר ${lines.length > 1 ? `את ${lines.length} הנקודות` : "את הנקודה"} לפני שמציגים.`, raw.trim());
      continue;
    }
    const { h, body } = headers(raw);
    const title = (h.title ?? "").trim();
    if (!title || !body) continue;
    if (lang === "definition") add("def", `הגדרה: «${title}». מה ההגדרה, ובאילו תנאים?`, body);
    else add("formula", `«${title}»: כתוב את הנוסחה, מה כל סימן, ומתי היא תקפה.`, body);
  }
  return out;
}

/** The think blocks of a lesson's text: question and answer, as the lesson shows them (Think.tsx). */
export function thinksFromLesson(text: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  for (const m of text.matchAll(/```think[^\n]*\n([\s\S]*?)```/g)) {
    const [question, ...rest] = m[1].split(/^\s*---\s*$/m);
    const a = rest.join("\n").trim();
    const q = question.trim();
    if (q && a) out.push({ q, a });
  }
  return out;
}

export function thinkSeed(q: string, a: string, calibId: string): Seed {
  return { id: `think-${calibId}`.replace(/\//g, "_"), kind: "think", front: cut(q, FRONT_MAX), back: cut(a, BACK_MAX) };
}

export function noteSeed(note: { id: string; text: string; anchor?: string }): Seed | null {
  const text = note.text.trim();
  const anchor = (note.anchor ?? "").trim();
  if (text.length < 12 || anchor.length < 12) return null;
  return { id: `note-${note.id}`, kind: "note", front: `על הקטע «${cut(norm(anchor), 220)}»: מה רשמת לעצמך שם?`, back: cut(text, BACK_MAX) };
}

export function makeCard(seed: Seed, o: { src: string; moduleId: string; lesson: number; conv?: string; learnedAt: number }): Card {
  return { ...seed, src: o.src, moduleId: o.moduleId, lesson: o.lesson, ...(o.conv ? { conv: o.conv } : {}), added: o.learnedAt, ...newMem(o.learnedAt) };
}

export const estSec = (c: Card) => Math.round(c.sec ?? EST_SEC[c.kind] ?? 40);

/** the moving average of the time one review took, clipped so a card left open does not count */
export function measured(c: Card, sec: number) {
  const s = Math.min(240, Math.max(4, sec));
  return Math.round(c.sec ? c.sec * 0.7 + s * 0.3 : s);
}

/** The day's counters: profile/review/_state. */
export interface DayCount {
  day: string;
  /** seconds of review today */
  sec: number;
  /** cards reviewed today */
  done: number;
  /** new cards first shown today */
  fresh: number;
  /** "עוד כמה בכל זאת": extra minutes he asked for after the budget (N8: never a lock) */
  extra?: number;
}

export interface Queue {
  cards: Card[];
  /** estimated seconds of the queue */
  sec: number;
  /** the budget is used up today, and cards were left for the coming days */
  rested: boolean;
}

/** interleave so two cards of the same module do not come one after the other when it can be avoided */
function interleave(list: Card[]) {
  const out: Card[] = [];
  const rest = [...list];
  while (rest.length) {
    const prev = out.at(-1)?.moduleId;
    const i = rest.findIndex((c) => c.moduleId !== prev);
    out.push(rest.splice(i < 0 ? 0 : i, 1)[0]);
  }
  return out;
}

/**
 * Today's queue. Due cards (and ones forgotten earlier today) by lowest predicted recall, then new cards, all
 * within what is left of the daily budget. What does not fit simply waits (FSRS tolerates a few days late, P §5),
 * and the number left is never shown (F2 anti-nag N1, N5).
 */
export function buildQueue(cards: Card[], count: DayCount, now: number, budget = DAILY_SEC): Queue {
  const end = addDays(now, 1);
  let left = budget + (count.extra ?? 0) - count.sec;
  const live = cards.filter((c) => !c.off);
  const due = live.filter((c) => c.reps > 0 && c.due < end).sort((a, b) => recallNow(a, now) - recallNow(b, now) || a.due - b.due);
  const fresh = live.filter((c) => c.reps === 0 && c.due <= now).sort((a, b) => a.added - b.added || a.id.localeCompare(b.id));
  const out: Card[] = [];
  let sec = 0;
  let rested = false;
  for (const c of due) {
    const e = estSec(c);
    if (left - e < 0) {
      rested = true;
      break;
    }
    out.push(c);
    left -= e;
    sec += e;
  }
  let newLeft = Math.max(0, NEW_PER_DAY - count.fresh);
  const takenNew: Card[] = [];
  if (!rested)
    for (const c of fresh) {
      if (!newLeft) break;
      const e = estSec(c);
      if (left - e < 0) {
        rested = true;
        break;
      }
      takenNew.push(c);
      newLeft--;
      left -= e;
      sec += e;
    }
  // new cards spread among the due ones: one new after every two due
  const mixed: Card[] = [];
  const d = interleave(out);
  const n = interleave(takenNew);
  while (d.length || n.length) {
    mixed.push(...d.splice(0, 2));
    if (n.length) mixed.push(n.shift()!);
  }
  return { cards: mixed, sec, rested: rested || (budget + (count.extra ?? 0) - count.sec <= 0 && (due.length > 0 || fresh.length > 0)) };
}

/** a short, calm estimate: "כ-8 דקות" */
export function minutesLabel(sec: number) {
  const m = Math.max(1, Math.round(sec / 60));
  return m === 1 ? "כדקה" : m === 2 ? "כשתי דקות" : `כ-${m} דקות`;
}

export const todayKey = (now: number) => {
  const d = new Date(dayStart(now));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
