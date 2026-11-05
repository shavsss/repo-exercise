// The practice questions (components/blocks/Practice.tsx) without React: parsing the three blocks, grading
// a numeric answer, and the gate that keeps the lesson below an unanswered question closed until the learner
// answers or skips it (5.11, his decision). Tested in tools/test/practice.test.mjs. Same file in both labs.
//
// ```mcq                                   ```numeric                          ```explain
// @title: …(optional)                      @answer: 189.7                      @title: …
// the question                             @unit: ק"מ                          the question
// - [ ] an option :: why it is wrong       @tol: 2%   (or an absolute 0.5)     ---
// - [x] the right one :: why it is right   the question                        - a key idea
// ```                                      ---                                 - another key idea
//                                          the worked solution                 ===
//                                          - wrong: 1897 :: you forgot …       the model answer
//                                          ```                                 ```

const headerLines = (src: string) => {
  const h: Record<string, string> = {};
  const lines = src.split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^@(\w+):\s*(.*)$/.exec(lines[i].trim());
    if (!m) break;
    h[m[1]] = m[2].trim();
  }
  return { h, body: lines.slice(i).join("\n").trim() };
};

export interface Mcq {
  title?: string;
  question: string;
  options: { text: string; correct: boolean; why: string }[];
}
export function parseMcq(src: string): Mcq {
  const { h, body } = headerLines(src);
  const q: string[] = [];
  const options: Mcq["options"] = [];
  for (const line of body.split("\n")) {
    const m = /^\s*[-*]\s*\[( |x|X|v|✓)\]\s*(.+)$/.exec(line);
    if (m) {
      const [text, ...why] = m[2].split("::");
      options.push({ text: text.trim(), correct: m[1] !== " ", why: why.join("::").trim() });
    } else if (options.length && line.trim() && options[options.length - 1]) {
      // an explanation that runs on to the next line
      options[options.length - 1].why = `${options[options.length - 1].why} ${line.trim()}`.trim();
    } else q.push(line);
  }
  return { title: h.title, question: q.join("\n").trim(), options };
}

export interface Numeric {
  title?: string;
  question: string;
  answer: number;
  answerText: string;
  unit: string;
  /** relative (0.02 for "2%") or absolute */
  tol: { rel?: number; abs?: number };
  solution: string;
  wrongs: { value: number; why: string }[];
}

/** "1,234.5", "1.2e3", "1.2×10^3", "1.2·10³", "−3", "4,17" */
export function parseNumber(s: string): number | null {
  let t = s.trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
  if (!t) return null;
  const sup: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => "^" + [...m].map((c) => sup[c]).join(""));
  t = t.replace(/[×x·*]10\^?\{?(-?\d+)\}?/i, "e$1");
  // a comma between digits: thousands when three digits follow, else a decimal comma
  t = t.replace(/(\d),(\d{3})(?!\d)/g, "$1$2").replace(/(\d),(\d)/g, "$1.$2");
  if (!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

function parseTol(s?: string): Numeric["tol"] {
  if (!s) return { rel: 0.02 };
  const pct = /^([\d.]+)\s*%$/.exec(s.trim());
  if (pct) return { rel: Number(pct[1]) / 100 };
  const v = parseNumber(s);
  return v !== null ? { abs: Math.abs(v) } : { rel: 0.02 };
}

export function parseNumeric(src: string): Numeric {
  const { h, body } = headerLines(src);
  const [question, ...rest] = body.split(/^\s*---\s*$/m);
  const after = rest.join("\n");
  const wrongs: Numeric["wrongs"] = [];
  const sol: string[] = [];
  for (const line of after.split("\n")) {
    const m = /^\s*[-*]\s*wrong:\s*([^:]+?)\s*::\s*(.+)$/i.exec(line);
    const v = m ? parseNumber(m[1]) : null;
    if (m && v !== null) wrongs.push({ value: v, why: m[2].trim() });
    else sol.push(line);
  }
  const answer = parseNumber(h.answer ?? "") ?? NaN;
  return { title: h.title, question: question.trim(), answer, answerText: h.answer ?? "", unit: h.unit ?? "", tol: parseTol(h.tol), solution: sol.join("\n").trim(), wrongs };
}

const near = (v: number, target: number, tol: Numeric["tol"]) => (tol.abs !== undefined ? Math.abs(v - target) <= tol.abs : Math.abs(v - target) <= Math.abs(target) * (tol.rel ?? 0.02));

/** right within the tolerance; "partial" within five times it; a known wrong value gets its diagnosis. Null when the input is not a number. */
export function gradeNumeric(n: Numeric, input: string): { grade: "right" | "partial" | "wrong"; feedback: string } | null {
  const v = parseNumber(input);
  if (v === null || !Number.isFinite(n.answer)) return null;
  if (near(v, n.answer, n.tol)) return { grade: "right", feedback: "" };
  const known = n.wrongs.find((w) => near(v, w.value, n.tol));
  if (known) return { grade: "wrong", feedback: known.why };
  const wide = n.tol.abs !== undefined ? { abs: n.tol.abs * 5 } : { rel: (n.tol.rel ?? 0.02) * 5 };
  if (near(v, n.answer, wide)) return { grade: "partial", feedback: "קרוב, אבל מחוץ לטווח הדיוק: בדוק עיגול או קבוע באמצע החישוב." };
  const ratio = v / n.answer;
  const pow = Math.log10(Math.abs(ratio));
  if (ratio > 0 && Math.abs(pow - Math.round(pow)) < 0.02 && Math.round(pow) !== 0) return { grade: "wrong", feedback: `התשובה שלך רחוקה פי $10^{${Math.round(pow)}}$: כנראה טעות ביחידות או בקידומת (מילי, קילו, מגה).` };
  if (ratio < 0 && near(-v, n.answer, n.tol)) return { grade: "wrong", feedback: "הגודל נכון והסימן הפוך." };
  return { grade: "wrong", feedback: "" };
}

export interface Explain {
  title?: string;
  question: string;
  ideas: string[];
  model: string;
}
export function parseExplain(src: string): Explain {
  const { h, body } = headerLines(src);
  const [question, ...rest] = body.split(/^\s*---\s*$/m);
  const [ideasPart, ...modelPart] = rest.join("\n").split(/^\s*===\s*$/m);
  const ideas = (ideasPart ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean);
  return { title: h.title, question: question.trim(), ideas, model: modelPart.join("\n").trim() };
}

/** The text the question id is built from (thinkId): the question itself, the same for every kind. */
export function practiceQuestion(kind: "mcq" | "numeric" | "explain", src: string): string {
  return kind === "mcq" ? parseMcq(src).question : kind === "numeric" ? parseNumeric(src).question : parseExplain(src).question;
}

export const PRACTICE_KINDS = ["mcq", "numeric", "explain"] as const;

/** The practice blocks of a lesson's Markdown, in order, with where each one ends. */
export function practiceBlocks(md: string): { kind: (typeof PRACTICE_KINDS)[number]; source: string; end: number }[] {
  const out: { kind: (typeof PRACTICE_KINDS)[number]; source: string; end: number }[] = [];
  const re = /^```(mcq|numeric|explain)[^\n]*\n([\s\S]*?)^```[ \t]*$/gm;
  for (const m of md.matchAll(re)) out.push({ kind: m[1] as "mcq", source: m[2], end: (m.index ?? 0) + m[0].length });
  return out;
}

/**
 * The gate: the lesson's text up to and including its first practice question that is not answered or
 * skipped (`done` holds the question texts that are), and whether it was cut there.
 */
export function gateText(md: string, done: (question: string) => boolean): { text: string; gated: boolean } {
  for (const b of practiceBlocks(md)) if (!done(practiceQuestion(b.kind, b.source))) return { text: md.slice(0, b.end), gated: b.end < md.trimEnd().length };
  return { text: md, gated: false };
}
