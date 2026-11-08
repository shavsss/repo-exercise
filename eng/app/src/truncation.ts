// Finding text that was cut off in the middle, by its content (identical in both apps).
// A call can end without `truncated` and still stop mid-sentence or inside a block (a lesson
// part that ran out of time, a stream that closed early). `looksCut` finds those endings,
// and `joinContinuation` joins the continuation to the text without repeating its end.

export interface CutCheck {
  cut: boolean;
  /** why it looks cut: "fence" (an unclosed ``` block), "math" ($$ left open), "tag" ([[ left open), "heading" (ends on a heading), "sentence" (ends mid-sentence) */
  reason?: "fence" | "math" | "tag" | "heading" | "sentence";
}

/** Lines that open or close a fenced block: ``` at the start of a line. */
const FENCE = /^\s*```/;

/** Text outside the fenced blocks, and whether the last fence is still open. */
function outsideFences(text: string) {
  const out: string[] = [];
  let open = false;
  for (const line of text.split("\n")) {
    if (FENCE.test(line)) {
      open = !open;
      continue;
    }
    if (!open) out.push(line);
  }
  return { text: out.join("\n"), open };
}

/** Characters a finished paragraph may end with (a colon announces more, so it is not one of them). */
const END_CHARS = /[.!?;)\]}"'”’»|*_`>$\u05c3\u200e\u200f]$/u;

/**
 * Whether a text (a lesson part or a whole answer) looks cut off: an open fenced block, an odd
 * number of $$, an unclosed [[tag, a heading as its last line, or a last paragraph that stops
 * mid-sentence (it ends on a letter, a digit, a comma or a dash). Lists, tables, closed blocks,
 * display math and sentences that end with punctuation count as finished.
 */
export function looksCut(raw: string): CutCheck {
  const text = raw.replace(/\s+$/, "");
  if (!text) return { cut: false };
  const { text: prose, open } = outsideFences(text);
  if (open) return { cut: true, reason: "fence" };
  const dollars = (prose.match(/\$\$/g) ?? []).length;
  if (dollars % 2) return { cut: true, reason: "math" };
  const opens = (prose.match(/\[\[/g) ?? []).length;
  const closes = (prose.match(/\]\]/g) ?? []).length;
  if (opens > closes) return { cut: true, reason: "tag" };
  // the text ends with a closed fenced block: finished
  const lastLine = text.split("\n").pop()!.trim();
  if (FENCE.test(lastLine)) return { cut: false };
  if (/^#{1,6}\s/.test(lastLine)) return { cut: true, reason: "heading" };
  // a table row, a list item or a quote line may end without punctuation
  if (/^\|/.test(lastLine)) return { cut: false };
  if (/^([-*+]|\d+[.)])\s/.test(lastLine) && !/[,،\-–—]$/.test(lastLine)) return { cut: false };
  if (/^>/.test(lastLine)) return { cut: false };
  // "…" at the very end is how a writer marks a cut (lesson G3 of 30.10 ended so)
  const bare = lastLine.replace(/(\.\.\.|…)+$/, "").trim();
  if (bare !== lastLine) return END_CHARS.test(bare) || !bare ? { cut: false } : { cut: true, reason: "sentence" };
  if (END_CHARS.test(lastLine)) return { cut: false };
  // an emoji, a check mark or similar symbol at the end is a finished line
  if (/[\p{So}\p{Sk}]$/u.test(lastLine)) return { cut: false };
  return { cut: true, reason: "sentence" };
}

/**
 * Appends a continuation to a cut text. The model often starts its continuation by repeating
 * the last words (or the whole last line) it saw; that repeated overlap is dropped. A line that
 * stopped mid-word or mid-sentence is joined without a new line, so the sentence reads on.
 */
export function joinContinuation(prev: string, next: string) {
  if (!next.trim()) return prev;
  if (!prev.trim()) return next;
  const endWs = /\s*$/.exec(prev)?.[0] ?? "";
  let head = prev.replace(/\s+$/, "");
  let tail = next;
  const body = tail.replace(/^\s+/, "");
  // the longest suffix of prev (12 to 600 characters) that the continuation starts with
  for (let n = Math.min(600, head.length, body.length); n >= 12; n--) {
    if (body.startsWith(head.slice(-n))) {
      tail = body.slice(n);
      break;
    }
  }
  // or the continuation restarted the last (cut) line from its beginning
  const lastLine = (head.split("\n").pop() ?? "").trim();
  if (tail === next && lastLine.length >= 12 && body.startsWith(lastLine)) tail = body.slice(lastLine.length);
  const lead = /^\s*/.exec(tail)?.[0] ?? "";
  tail = tail.slice(lead.length);
  if (!tail) return head;
  const reason = looksCut(head).reason;
  // the model chose to start on a new line: keep its line breaks
  if (lead.includes("\n")) return head + lead + tail;
  // inside a block (code, JSON, math): continue exactly where it stopped
  if (reason === "fence" || reason === "math" || reason === "tag") return head + (endWs.includes("\n") ? "\n" : endWs || lead) + tail;
  if (reason === "sentence") {
    // a cut marked with "…" loses the mark; the sentence reads on, one space unless punctuation follows
    head = head.replace(/(\.\.\.|…)+$/, "").replace(/\s+$/, "");
    return head + (/^[,.;:!?)\]]/.test(tail) ? "" : " ") + tail;
  }
  // the text was finished: the continuation is a new paragraph
  return head + "\n\n" + tail;
}
