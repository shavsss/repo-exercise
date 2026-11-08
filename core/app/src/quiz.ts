/**
 * The module quiz as a form (components/QuizForm.tsx): the tutor writes every question inside one
 * ```quiz block, in a small line markup that survives Hebrew and LaTeX better than JSON:
 *
 *   ## 1 | mc
 *   question text (Markdown, $math$, several lines)
 *   - א) option
 *   - ב) option
 *   - ג) option
 *   - ד) option
 *   ## 2 | short
 *   question text
 *   ## 3 | problem
 *   question text
 *
 * The parser is forgiving: a missing or unknown type is read from the options, an mc question
 * without (enough) options is a short one, and text before the first header is ignored.
 */

export type QuizKind = "mc" | "short" | "problem";
export interface QuizOption {
  letter: string;
  text: string;
}
export interface QuizQuestion {
  n: number;
  kind: QuizKind;
  text: string;
  options: QuizOption[];
}

export const MC_LETTERS = ["א", "ב", "ג", "ד"];

const HEAD = /^\s{0,3}#{2,4}\s*(?:שאלה\s*)?(\d{1,2})[.)]?\s*(?:\|\s*([A-Za-z֐-׿]+)\s*)?$/;
const OPTION = /^\s*(?:[-*•]\s*)?\(?([אבגד])[).]\s*(.*)$/;
const KINDS: Record<string, QuizKind> = {
  mc: "mc",
  choice: "mc",
  multiple: "mc",
  short: "short",
  open: "short",
  tf: "short",
  number: "short",
  problem: "problem",
  worked: "problem",
  calc: "problem",
};

function finish(q: { n: number; kind: string; lines: string[]; options: QuizOption[] }): QuizQuestion {
  const text = q.lines.join("\n").replace(/^\s*\n+|\n+\s*$/g, "").trim();
  const declared = KINDS[q.kind.toLowerCase()];
  let kind: QuizKind = declared ?? (q.options.length >= 2 ? "mc" : "short");
  let options = q.options;
  // an mc question needs its options; with fewer than two it is answered in words
  if (kind === "mc" && options.length < 2) {
    kind = "short";
  }
  if (kind !== "mc" && options.length) {
    // options under a short/problem question stay part of its text, as written
    const extra = options.map((o) => `- ${o.letter}) ${o.text}`).join("\n");
    options = [];
    return { n: q.n, kind, text: text ? `${text}\n${extra}` : extra, options };
  }
  return { n: q.n, kind, text, options };
}

/** Reads the body of a ```quiz block. Returns [] when there is no question header at all. */
export function parseQuiz(src: string): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  let cur: { n: number; kind: string; lines: string[]; options: QuizOption[] } | null = null;
  for (const line of src.replace(/\r\n?/g, "\n").split("\n")) {
    const h = HEAD.exec(line);
    if (h) {
      if (cur) out.push(finish(cur));
      cur = { n: Number(h[1]), kind: h[2] ?? "", lines: [], options: [] };
      continue;
    }
    if (!cur) continue;
    const o = OPTION.exec(line);
    // an option line: only once the question has text (a line opening with "א." in the text is rare)
    if (o && (cur.lines.some((l) => l.trim()) || cur.options.length)) {
      cur.options.push({ letter: o[1], text: o[2].trim() });
      continue;
    }
    if (cur.options.length) {
      // a line after the options continues the last option (or is a blank between them)
      if (line.trim()) {
        const last = cur.options[cur.options.length - 1];
        last.text = `${last.text} ${line.trim()}`.trim();
      }
      continue;
    }
    cur.lines.push(line);
  }
  if (cur) out.push(finish(cur));
  return out;
}

/** The learner's answers, as one message to the tutor: "1. ב) …\n2. …". */
export function composeAnswers(questions: QuizQuestion[], answers: Record<string, string>): string {
  const lines = questions.map((q) => {
    const a = (answers[String(q.n)] ?? "").trim();
    if (!a) return `${q.n}. (לא עניתי)`;
    if (q.kind === "mc") {
      const opt = q.options.find((o) => o.letter === a);
      return `${q.n}. ${opt ? `${opt.letter}) ${opt.text}` : a}`;
    }
    // a multi-line answer keeps its lines, indented under its number
    return `${q.n}. ${a.split("\n").map((l, i) => (i ? `   ${l}` : l)).join("\n")}`;
  });
  return `התשובות שלי למבחן:\n${lines.join("\n")}`;
}

export function answeredCount(questions: QuizQuestion[], answers: Record<string, string>) {
  return questions.filter((q) => (answers[String(q.n)] ?? "").trim()).length;
}

/** The answers from a submitted message (composeAnswers), for showing a locked form. */
export function parseAnswers(msg: string, questions: QuizQuestion[]): Record<string, string> {
  const out: Record<string, string> = {};
  let n = "";
  for (const line of msg.split("\n")) {
    const m = /^(\d{1,2})\.\s?(.*)$/.exec(line);
    if (m && questions.some((q) => String(q.n) === m[1])) {
      n = m[1];
      out[n] = m[2] === "(לא עניתי)" ? "" : m[2];
    } else if (n) out[n] += `\n${line.replace(/^ {3}/, "")}`;
  }
  for (const q of questions) {
    if (q.kind !== "mc" || !out[String(q.n)]) continue;
    const l = /^([אבגד])\)/.exec(out[String(q.n)]);
    if (l) out[String(q.n)] = l[1];
  }
  return out;
}
