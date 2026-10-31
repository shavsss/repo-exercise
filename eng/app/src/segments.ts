import type { Activity, Mode, StoredMessage } from "./types";
import { applyErrata } from "./errata";

export type Segment = { t: "text"; text: string } | { t: "activity"; a: Activity };

export type Item =
  | { kind: "user"; key: string; text: string; mode: Mode; images: number; ts: number }
  | {
      kind: "assistant";
      key: string;
      segments: Segment[];
      mode: Mode;
      model?: string;
      truncated?: boolean;
      interrupted?: boolean;
      status?: string;
    };

export function toItems(messages: StoredMessage[]): Item[] {
  // an empty draft left in the middle of a conversation (a later answer followed it) shows as nothing, not as an
  // empty interrupted turn; only what is shown changes, the stored message stays
  const shown = messages.flatMap((m, i) => (m.role === "assistant" && m.draft && !m.text?.trim() && i < messages.length - 1 ? [] : [{ m, i }]));
  return shown.map(({ m, i }) =>
    m.role === "user"
      ? { kind: "user", key: `u${i}`, text: m.text, mode: m.mode, images: m.images ?? 0, ts: m.ts }
      : {
          kind: "assistant",
          key: `a${i}`,
          mode: m.mode,
          model: m.model,
          truncated: m.truncated,
          interrupted: m.interrupted || m.draft,
          status: m.status,
          // corrections to lessons already written are shown in place (errata.ts)
          segments: [...(m.activity ?? []).map((a): Segment => ({ t: "activity", a })), ...(m.text ? [{ t: "text" as const, text: applyErrata(m.text) }] : [])],
        },
  );
}

const textOf = (segments: Segment[]) =>
  segments
    .filter((s): s is Extract<Segment, { t: "text" }> => s.t === "text")
    .map((s) => s.text)
    .join("\n");

/** Plain-text words of an answer (no JSON, SVG or math) — for the depth bar. */
export function countWords(segments: Segment[]) {
  const text = textOf(segments)
    .replace(/```(chart|table|interactive|svg|mermaid|sim|anim|figure|scene3d|notebook)[\s\S]*?```/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/^@\w+:.*$/gm, " ")
    .replace(/\[\[[^\]]*\]\]/g, " ");
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}'"׳״-]*/gu) ?? []).length;
}

export interface BarCheck {
  key: string;
  label: string;
  ok: boolean;
  detail?: string;
}

/**
 * The depth units of a lesson written under the depth rules: the distinct <!--U7--> markers, and
 * the sums of the "written/planned" counts of its hidden audit lines. A lesson with neither is an
 * older lesson, checked by the old bar.
 */
export function unitCounts(text: string) {
  const marked = new Set([...text.matchAll(/<!--\s*(U\d+[a-zא-ת]?)\s*-->/g)].map((m) => m[1])).size;
  let written = 0;
  let planned = 0;
  for (const m of text.matchAll(/<!--\s*audit:[^>]*?units[^|>]*?(\d+)\s*\/\s*(\d+)/g)) {
    written += Number(m[1]);
    planned += Number(m[2]);
  }
  return { marked, written, planned };
}

/** Phrases of the closed padding list (the density rule) that a reader can spot in the text. */
const PADDING = ["בחלק הבא", "כפי שנראה בהמשך", "בשיעור הזה נלמד", "סיכום החלק", "אפשר לסכם את הדרך", "חשוב לציין ש", "כדאי לשים לב ש", "מעניין לראות ש", "באופן כללי", "הספר אומר", "המחבר כותב", "מרתק", "אלגנטי"];
export function paddingHits(text: string) {
  return PADDING.reduce((n, p) => n + text.split(p).length - 1, 0);
}

/** The seven level-2.5 tags used in a text ([[2.5: מבנה]] ...). */
export function l25Tags(text: string) {
  return new Set([...text.matchAll(/\[\[2\.5\s*:\s*([^\]]+)\]\]/g)].map((m) => m[1].trim()));
}

/** Automatic check of the depth bar for a lesson. `full` is false for a reference-tier lesson. */
export function depthBar(segments: Segment[], full = true): BarCheck[] {
  const text = textOf(segments);
  const count = (lang: string) => (text.match(new RegExp("```" + lang + "\\b", "g")) ?? []).length;
  const words = countWords(segments);
  const units = unitCounts(text);
  // a lesson under the depth rules is measured by its units, not by a word count
  const v3 = units.marked > 0 || units.planned > 0;
  const planned = Math.max(units.planned, units.marked);
  const pad = paddingHits(text);
  const firstBlock = /```(\w+)/.exec(text)?.[1];
  const graphics = count("chart") + count("svg") + count("mermaid") + count("interactive") + count("table") + count("sim") + count("anim") + count("scene3d");
  const computed = segments.some((s) => s.t === "activity" && s.a.t === "compute") || count("chart") + count("table") + count("sim") > 0;
  const tags = (text.match(/\[\[[A-Za-z]\d+[a-z]?(?:\.\d+)?:\d+\]\]/g) ?? []).length;
  const l25 = l25Tags(text);
  const SEVEN = ["מבנה", "מקור", "גבולות", "סדר גודל", "פשרה", "מבנה משותף", "ביקורת"];
  const missing25 = SEVEN.filter((k) => ![...l25].some((t) => t.startsWith(k)));
  const checks: BarCheck[] = [
    ...(v3
      ? [
          { key: "units", label: "יחידות עומק שתוכננו", ok: units.marked >= planned, detail: `${units.marked}/${planned}` },
          { key: "density", label: "צפיפות", ok: pad === 0, detail: `${Math.round(words / Math.max(1, units.marked))} מילים ליחידה${pad ? ` · ריפוד ${pad}` : ""}` },
        ]
      : [{ key: "words", label: full ? "4000+ מילים" : "אורך", ok: !full || words >= 4000, detail: words.toLocaleString("he-IL") }]),
    { key: "story", label: "פתיחה במצב אמיתי", ok: count("story") > 0 && !["mermaid", "svg", "chart", "figure", "scene3d"].includes(firstBlock ?? "") },
    { key: "l25", label: "שבעת סעיפי 2.5", ok: missing25.length === 0, detail: missing25.length ? `חסר: ${missing25.join(", ")}` : "7/7" },
    { key: "think", label: "שאלות עצירה", ok: count("think") > 0, detail: String(count("think")) },
    { key: "case", label: "מקרה הנדסי", ok: count("casestudy") > 0 },
    { key: "domains", label: "חיבורים לתחומים", ok: count("domain") >= 2, detail: String(count("domain")) },
    { key: "today", label: "העולם של היום", ok: count("today") > 0 },
    { key: "figures", label: "איורים מהמקור", ok: count("figure") > 0, detail: String(count("figure")) },
    { key: "graphics", label: "גרפיקה ותלת-ממד", ok: graphics > 0, detail: String(graphics) },
    { key: "tags", label: "תגיות עמוד", ok: tags > 0, detail: String(tags) },
    { key: "code", label: "מספרים מחישוב", ok: computed },
    { key: "coverage", label: "בדיקת כיסוי", ok: count("coverage") > 0 },
    { key: "exercises", label: "תרגילים", ok: count("exercise") >= 2, detail: String(count("exercise")) },
    ...(v3
      ? [
          { key: "predict", label: "תחזיות לפני חישוב", ok: count("predict") >= 2, detail: String(count("predict")) },
          { key: "lab", label: "משימה מובלת", ok: count("lab") > 0 },
          { key: "verify", label: "אימות", ok: count("verify") > 0 },
        ]
      : []),
  ];
  return full ? checks : checks.filter((c) => ["words", "units", "density", "l25", "think", "figures", "tags", "coverage", "exercises"].includes(c.key));
}
