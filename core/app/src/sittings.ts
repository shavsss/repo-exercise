// A lesson read in sittings (24.11, the learner's choice): in the scrolling column (the book off) a long lesson is
// shown one sub-topic at a time. A sitting is a subsection (### N.k) with what comes before it in its chapter: the
// chapter's heading and opening go with its first subsection, and a sliver too short to sit with (a lone heading)
// joins the next one. The text is cut by the book's own parser (book/chunks.ts), so a sitting is exactly the
// source of its blocks, and its figures keep their numbers. Here: the cut, the place kept per lesson, and the
// flag the page below the lesson reads (the next lesson's button waits for the last sitting). Identical in both labs.
import { chunkText } from "./book/chunks";

export interface Sitting {
  /** Markdown source of the sitting */
  text: string;
  /** figures numbered before it in the lesson */
  figBase: number;
  /** its subsection's heading (or the chapter's, for a chapter with no subsections) */
  title: string;
  /** the chapter it belongs to */
  chapter?: string;
  /** it starts with its chapter's heading */
  opensChapter: boolean;
  words: number;
}

/** A sitting shorter than this (a heading alone, a one-line bridge) is read with the next one. */
const MIN_WORDS = 120;
/** A chapter's opening longer than this is a sitting of its own, before its first subsection. */
const MAX_OPENING = 400;
/** Fewer sittings than this: the lesson is shown whole. */
export const MIN_SITTINGS = 3;
/** reading pace of dense technical text, words a minute (as in ReadingAids) */
export const PACE = 150;

export const wordsOf = (md: string) =>
  (
    md
      .replace(/```(chart|table|interactive|svg|mermaid|sim|anim|figure|scene3d|notebook)[\s\S]*?```/g, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/\$\$[\s\S]*?\$\$/g, " ")
      .replace(/\$[^$\n]*\$/g, " ")
      .match(/[\p{L}\p{N}][\p{L}\p{N}'"׳״-]*/gu) ?? []
  ).length;

export const minutesOf = (words: number) => Math.max(1, Math.round(words / PACE));

interface Draft {
  parts: string[];
  figBase: number;
  title: string;
  chapter?: string;
  opensChapter: boolean;
  hasSub: boolean;
}

/** The sittings of a lesson's Markdown, in order. */
export function splitSittings(md: string): Sitting[] {
  const drafts: Draft[] = [];
  let chapter: string | undefined;
  let cur: Draft | null = null;
  const open = (d: Omit<Draft, "parts">) => drafts.push((cur = { ...d, parts: [] }));
  for (const c of chunkText(md, 0)) {
    if (c.kind === "h2") {
      chapter = c.head;
      open({ figBase: c.figBase, title: c.head ?? "", chapter, opensChapter: true, hasSub: false });
    } else if (c.kind === "h3") {
      const d = cur as Draft | null;
      // the chapter's heading and a short opening go with its first subsection
      if (d && d.opensChapter && !d.hasSub && wordsOf(d.parts.join("\n\n")) <= MAX_OPENING) {
        d.hasSub = true;
        d.title = c.head ?? d.title;
      } else open({ figBase: c.figBase, title: c.head ?? "", chapter, opensChapter: false, hasSub: true });
    } else if (!cur) open({ figBase: c.figBase, title: "פתיחה", chapter, opensChapter: false, hasSub: false });
    cur!.parts.push(c.text);
  }
  const out: Sitting[] = drafts.map((d) => {
    const text = d.parts.join("\n\n");
    return { text, figBase: d.figBase, title: d.title, chapter: d.chapter, opensChapter: d.opensChapter, words: wordsOf(text) };
  });
  // a sliver joins the sitting after it (the last one joins the one before)
  for (let i = 0; i < out.length && out.length > 1; i++) {
    if (out[i].words >= MIN_WORDS) continue;
    if (i < out.length - 1) {
      const [s, n] = [out[i], out[i + 1]];
      out.splice(i, 2, { ...n, text: `${s.text}\n\n${n.text}`, figBase: s.figBase, opensChapter: s.opensChapter || n.opensChapter, words: s.words + n.words });
    } else {
      const [p, s] = [out[i - 1], out[i]];
      out.splice(i - 1, 2, { ...p, text: `${p.text}\n\n${s.text}`, words: p.words + s.words });
    }
    i--;
  }
  return out;
}

/* ---- the place in a lesson's sittings, per lesson, in this browser ---- */

export interface SittingPlace {
  cur: number;
  /** sittings read to their end */
  read: number[];
}
const placeKey = () => `${document.documentElement.dataset.lab ?? "lab"}:sittings`;

function allPlaces(): Record<string, SittingPlace> {
  try {
    return JSON.parse(localStorage.getItem(placeKey()) ?? "{}");
  } catch {
    return {};
  }
}

export function loadPlace(key: string): SittingPlace {
  const p = allPlaces()[key];
  return p && typeof p.cur === "number" ? { cur: p.cur, read: Array.isArray(p.read) ? p.read : [] } : { cur: 0, read: [] };
}

export function savePlace(key: string, p: SittingPlace) {
  const all = allPlaces();
  delete all[key];
  all[key] = p;
  const keys = Object.keys(all);
  if (keys.length > 300) delete all[keys[0]];
  try {
    localStorage.setItem(placeKey(), JSON.stringify(all));
  } catch {
    // kept for this visit only
  }
}

/* ---- whether the sitting on screen is not the lesson's last: what follows the lesson waits ---- */

let mid = false;
const subs = new Set<() => void>();
export function setSittingMid(v: boolean) {
  if (mid === v) return;
  mid = v;
  subs.forEach((f) => f());
}
export const subscribeMid = (f: () => void) => (subs.add(f), () => void subs.delete(f));
export const sittingMid = () => mid;

/** Shows the sitting that holds an element (a heading the contents jump to), before it is scrolled to. */
export function revealSitting(el: Element | null) {
  const s = el?.closest<HTMLElement>("[data-sitting]");
  if (s?.hidden) s.dispatchEvent(new CustomEvent("sitting:show", { bubbles: true, detail: Number(s.dataset.sitting) }));
}
