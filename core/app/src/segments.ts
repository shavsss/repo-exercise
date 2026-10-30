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
  return messages.map((m, i) =>
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
    .replace(/```(chart|table|interactive|svg|mermaid|sim|anim|figure|scene3d)[\s\S]*?```/g, " ")
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

/** The seven level-2.5 tags used in a text ([[2.5: מבנה]] ...). */
export function l25Tags(text: string) {
  return new Set([...text.matchAll(/\[\[2\.5\s*:\s*([^\]]+)\]\]/g)].map((m) => m[1].trim()));
}

/** Automatic check of the depth bar for a lesson (rule 32). `full` is false for a reference-tier lesson. */
export function depthBar(segments: Segment[], full = true): BarCheck[] {
  const text = textOf(segments);
  const count = (lang: string) => (text.match(new RegExp("```" + lang + "\\b", "g")) ?? []).length;
  const words = countWords(segments);
  const firstBlock = /```(\w+)/.exec(text)?.[1];
  const graphics = count("chart") + count("svg") + count("mermaid") + count("interactive") + count("table") + count("sim") + count("anim") + count("scene3d");
  const computed = segments.some((s) => s.t === "activity" && s.a.t === "compute") || count("chart") + count("table") + count("sim") > 0;
  const tags = (text.match(/\[\[[A-Za-z]\d+[a-z]?(?:\.\d+)?:\d+\]\]/g) ?? []).length;
  const l25 = l25Tags(text);
  const SEVEN = ["מבנה", "מקור", "גבולות", "סדר גודל", "פשרה", "משמעות מבצעית", "ביקורת"];
  const missing25 = SEVEN.filter((k) => ![...l25].some((t) => t.startsWith(k)));
  const links = count("domain");
  const checks: BarCheck[] = [
    { key: "words", label: full ? "4000+ מילים" : "אורך", ok: !full || words >= 4000, detail: words.toLocaleString("he-IL") },
    { key: "story", label: "פתיחה בסיפור", ok: count("story") > 0 && !["mermaid", "svg", "chart", "figure"].includes(firstBlock ?? "") },
    { key: "l25", label: "שבעת סעיפי 2.5", ok: missing25.length === 0, detail: missing25.length ? `חסר: ${missing25.join(", ")}` : "7/7" },
    { key: "think", label: "שאלות עצירה", ok: count("think") > 0, detail: String(count("think")) },
    { key: "history", label: "רקע למודל", ok: count("history") > 0 },
    { key: "case", label: "מקרה בוחן", ok: count("casestudy") > 0 },
    { key: "domains", label: "4 חיבורים לליבה", ok: links >= 4, detail: String(links) },
    { key: "figures", label: "איורים מהמקור", ok: count("figure") > 0, detail: String(count("figure")) },
    { key: "graphics", label: "גרפיקה וסימולציה", ok: graphics > 0, detail: String(graphics) },
    { key: "tags", label: "תגיות עמוד", ok: tags > 0, detail: String(tags) },
    { key: "code", label: "מספרים מחישוב", ok: computed },
    { key: "coverage", label: "בדיקת כיסוי", ok: count("coverage") > 0 },
    { key: "exercises", label: "תרגילים", ok: count("exercise") >= 2, detail: String(count("exercise")) },
  ];
  return full ? checks : checks.filter((c) => ["words", "l25", "think", "figures", "tags", "coverage", "exercises"].includes(c.key));
}
