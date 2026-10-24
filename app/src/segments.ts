import type { Activity, Mode, StoredMessage } from "./types";

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
          interrupted: m.interrupted,
          segments: [...(m.activity ?? []).map((a): Segment => ({ t: "activity", a })), ...(m.text ? [{ t: "text" as const, text: m.text }] : [])],
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
    .replace(/```(chart|table|interactive|svg|mermaid)[\s\S]*?```/g, " ")
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

/** Automatic check of the learner's depth bar for a section lesson (rule 36). */
export function depthBar(segments: Segment[]): BarCheck[] {
  const text = textOf(segments);
  const count = (lang: string) => (text.match(new RegExp("```" + lang + "\\b", "g")) ?? []).length;
  const words = countWords(segments);
  const firstBlock = /```(\w+)/.exec(text)?.[1];
  const graphics = count("chart") + count("svg") + count("mermaid") + count("interactive") + count("table");
  const computed = segments.some((s) => s.t === "activity" && s.a.t === "compute") || count("chart") + count("table") > 0;
  return [
    { key: "words", label: "4000+ מילים", ok: words >= 4000, detail: words.toLocaleString("he-IL") },
    { key: "story", label: "פתיחה בסיפור", ok: count("story") > 0 && !["mermaid", "svg", "chart"].includes(firstBlock ?? "") },
    { key: "think", label: "שאלות עצירה", ok: count("think") > 0, detail: String(count("think")) },
    { key: "history", label: "רקע למודל", ok: count("history") > 0 },
    { key: "case", label: "מקרה בוחן", ok: count("casestudy") > 0 },
    { key: "domains", label: "4 תחומים", ok: count("domain") >= 4, detail: String(count("domain")) },
    { key: "graphics", label: "גרפיקה", ok: graphics > 0, detail: String(graphics) },
    { key: "code", label: "מספרים מחישוב", ok: computed },
    { key: "exercises", label: "תרגילים", ok: count("exercise") >= 2, detail: String(count("exercise")) },
  ];
}
