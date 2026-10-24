import type { Block, Mode, StoredMessage } from "./api";

export type Segment =
  | { t: "text"; text: string }
  | { t: "thinking"; text: string; live?: boolean }
  | { t: "tool"; id: string; name: string; input: any; result?: string; isError?: boolean; pending?: boolean }
  | { t: "code"; id: string; kind: "bash" | "file"; code: string; path?: string; stdout?: string; stderr?: string; code_rc?: number; pending?: boolean }
  | { t: "search"; id: string; query: string; results?: { title: string; url: string }[]; error?: string; pending?: boolean }
  | { t: "note"; text: string };

export type Item =
  | { kind: "user"; key: string; text: string; mode: Mode; images: number; ts: number }
  | { kind: "assistant"; key: string; segments: Segment[]; mode: Mode; models: string[]; demo: boolean; stop?: string | null; usage: { input: number; output: number; cacheRead: number } };

function resultText(content: any): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((c) => (c.type === "text" ? c.text : "")).join("\n");
  return "";
}

/** Group stored messages into chat items: each learner message, then one assistant item spanning tool rounds. */
export function toItems(messages: StoredMessage[]): Item[] {
  const items: Item[] = [];
  let current: Extract<Item, { kind: "assistant" }> | null = null;
  let lastMode: Mode = "free";
  const byId = new Map<string, Segment>();

  const ensure = (key: string) => {
    if (!current) {
      current = { kind: "assistant", key, segments: [], mode: lastMode, models: [], demo: false, usage: { input: 0, output: 0, cacheRead: 0 } };
      items.push(current);
    }
    return current;
  };

  messages.forEach((m, mi) => {
    if (m.role === "user" && m.meta) {
      current = null;
      lastMode = m.meta.mode;
      items.push({ kind: "user", key: `u${mi}`, text: m.meta.display, mode: m.meta.mode, images: m.meta.images ?? 0, ts: m.meta.ts });
      return;
    }
    const turn = ensure(`a${mi}`);
    if (m.demo) turn.demo = true;
    if (m.role === "assistant" && m.info) {
      if (m.info.model && !turn.models.includes(m.info.model)) turn.models.push(m.info.model);
      turn.stop = m.info.stop;
      const u = m.info.usage;
      if (u) {
        turn.usage.input += (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
        turn.usage.output += u.output_tokens ?? 0;
        turn.usage.cacheRead += u.cache_read_input_tokens ?? 0;
      }
    }
    for (const b of m.content as Block[]) addBlock(turn.segments, b, byId);
  });
  return items;
}

function addBlock(segs: Segment[], b: Block, byId: Map<string, Segment>) {
  const last = segs[segs.length - 1];
  switch (b.type) {
    case "text":
      if (!b.text && !b._live) return;
      if (last?.t === "text") last.text += "\n\n" + b.text;
      else segs.push({ t: "text", text: b.text });
      return;
    case "thinking":
      if (!b.thinking && !b._live) return;
      if (last?.t === "thinking") last.text += "\n\n" + (b.thinking ?? "");
      else segs.push({ t: "thinking", text: b.thinking ?? "", live: !!b._live });
      return;
    case "redacted_thinking":
      return;
    case "tool_use": {
      const s: Segment = { t: "tool", id: b.id, name: b.name, input: b.input ?? {}, pending: true };
      byId.set(b.id, s);
      segs.push(s);
      return;
    }
    case "tool_result": {
      const s = byId.get(b.tool_use_id);
      if (s?.t === "tool") {
        s.result = resultText(b.content);
        s.isError = !!b.is_error;
        s.pending = false;
      }
      return;
    }
    case "server_tool_use": {
      let s: Segment;
      if (b.name === "web_search") s = { t: "search", id: b.id, query: b.input?.query ?? "", pending: true };
      else if (b.name === "text_editor_code_execution")
        s = { t: "code", id: b.id, kind: "file", code: b.input?.file_text ?? b.input?.new_str ?? "", path: b.input?.path, pending: true };
      else s = { t: "code", id: b.id, kind: "bash", code: b.input?.command ?? b.input?.code ?? b._partial ?? "", pending: true };
      byId.set(b.id, s);
      segs.push(s);
      return;
    }
    case "bash_code_execution_tool_result":
    case "code_execution_tool_result":
    case "text_editor_code_execution_tool_result": {
      const s = byId.get(b.tool_use_id);
      if (s?.t === "code") {
        const c = b.content ?? {};
        s.stdout = c.stdout ?? (c.type?.includes("error") ? `error: ${c.error_code}` : "");
        s.stderr = c.stderr ?? "";
        s.code_rc = c.return_code;
        s.pending = false;
      }
      return;
    }
    case "web_search_tool_result": {
      const s = byId.get(b.tool_use_id);
      if (s?.t === "search") {
        if (Array.isArray(b.content)) s.results = b.content.map((r: any) => ({ title: r.title, url: r.url }));
        else s.error = b.content?.error_code ?? "error";
        s.pending = false;
      }
      return;
    }
    case "compaction":
      segs.push({ t: "note", text: "החלק המוקדם של השיחה סוכם אוטומטית כדי לפנות מקום בהקשר." });
      return;
    case "fallback":
      segs.push({ t: "note", text: `התשובה הועברה למודל ${b.to?.model ?? "חלופי"}.` });
      return;
    default:
      return;
  }
}

/** Data printed by code with the @@chart:/@@table: protocol, across the whole conversation. */
export function dataRegistry(messages: StoredMessage[]) {
  const reg = new Map<string, any>();
  for (const m of messages)
    for (const b of m.content) {
      const out: string | undefined = b.content?.stdout;
      if (typeof out !== "string" || !out.includes("@@")) continue;
      for (const line of out.split("\n")) {
        const mm = /^@@(chart|table):([\w.-]+)\s+(.*)$/.exec(line.trim());
        if (!mm) continue;
        try {
          reg.set(`${mm[1]}:${mm[2]}`, JSON.parse(mm[3]));
        } catch {
          reg.set(`${mm[1]}:${mm[2]}`, { error: "JSON שהודפס בקוד אינו תקין" });
        }
      }
    }
  return reg;
}

/** Plain-text words of a turn (no code, JSON, SVG or math) — for the depth bar. */
export function countWords(segments: Segment[]) {
  const text = segments
    .filter((s): s is Extract<Segment, { t: "text" }> => s.t === "text")
    .map((s) => s.text)
    .join("\n")
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
  const text = segments.filter((s) => s.t === "text").map((s) => (s as any).text as string).join("\n");
  const count = (lang: string) => (text.match(new RegExp("```" + lang + "\\b", "g")) ?? []).length;
  const words = countWords(segments);
  const firstBlock = /```(\w+)/.exec(text)?.[1];
  const graphics = count("chart") + count("svg") + count("mermaid") + count("interactive") + count("table");
  const ranCode = segments.some((s) => s.t === "code" && !s.pending);
  return [
    { key: "words", label: "4000+ מילים", ok: words >= 4000, detail: words.toLocaleString("he-IL") },
    { key: "story", label: "פתיחה בסיפור", ok: count("story") > 0 && firstBlock !== "mermaid" && firstBlock !== "svg" && firstBlock !== "chart" },
    { key: "think", label: "שאלות עצירה", ok: count("think") > 0, detail: String(count("think")) },
    { key: "history", label: "רקע למודל", ok: count("history") > 0 },
    { key: "case", label: "מקרה בוחן", ok: count("casestudy") > 0 },
    { key: "domains", label: "4 תחומים", ok: count("domain") >= 4, detail: String(count("domain")) },
    { key: "graphics", label: "גרפיקה", ok: graphics > 0, detail: String(graphics) },
    { key: "code", label: "מספרים מקוד", ok: ranCode },
    { key: "exercises", label: "תרגילים", ok: count("exercise") >= 2, detail: String(count("exercise")) },
  ];
}
