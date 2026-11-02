// Unit tests of src/quiz.ts (the module quiz as a form): the ```quiz markup parser and the composed answer message.
// Run from the app folder: node --test tools/test/quiz.test.mjs
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/quiz.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const Q = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
const { parseQuiz, composeAnswers, parseAnswers, answeredCount } = Q;

const BLOCK = [
  "## 1 | mc",
  "מכ\"ם עם הספק $P_t$ מכפיל את ההספק. פי כמה גדל הטווח המרבי?",
  "- א) פי 2",
  "- ב) פי $\\sqrt{2}$",
  "- ג) פי $2^{1/4} \\approx 1.19$",
  "- ד) הטווח לא משתנה",
  "## 2 | short",
  "נכון או לא נכון, עם נימוק בשורה: הנחתה באטמוספרה תלויה בתדר.",
  "## 3 | problem",
  "נתון מכ\"ם עם $G = 30\\,\\text{dB}$ ו-$\\lambda = 3\\,\\text{cm}$.",
  "",
  "$$R_{max} = \\left(\\frac{P_t G^2 \\lambda^2 \\sigma}{(4\\pi)^3 S_{min}}\\right)^{1/4}$$",
  "",
  "חשבו את הטווח המרבי עבור $\\sigma = 1\\,\\text{m}^2$.",
].join("\n");

test("mc with four options, short, problem with multi-line text and math", () => {
  const qs = parseQuiz(BLOCK);
  assert.equal(qs.length, 3);
  assert.deepEqual(qs.map((q) => [q.n, q.kind]), [[1, "mc"], [2, "short"], [3, "problem"]]);
  assert.deepEqual(qs[0].options.map((o) => o.letter), ["א", "ב", "ג", "ד"]);
  assert.equal(qs[0].options[2].text, "פי $2^{1/4} \\approx 1.19$");
  assert.match(qs[0].text, /\$P_t\$/);
  assert.equal(qs[1].options.length, 0);
  assert.match(qs[2].text, /^נתון/);
  assert.match(qs[2].text, /\\left\(\\frac\{P_t G\^2/);
  assert.match(qs[2].text, /חשבו את הטווח המרבי/);
  assert.equal(qs[2].text.split("\n").length, 5);
});

test("malformed: an mc question without options is a short one; text before the first header is ignored", () => {
  const qs = parseQuiz("פתיחה שלא אמורה להיות כאן\n## 1 | mc\nשאלה בלי אפשרויות\n## 2\nשאלה בלי סוג\n- א) רק\n- ב) שתיים\n## 3 | weird\nסוג לא מוכר");
  assert.equal(qs.length, 3);
  assert.equal(qs[0].kind, "short");
  assert.equal(qs[0].text, "שאלה בלי אפשרויות");
  assert.equal(qs[1].kind, "mc", "no type but options: mc");
  assert.equal(qs[1].options.length, 2);
  assert.equal(qs[2].kind, "short");
  assert.deepEqual(parseQuiz("no headers at all\n- א) x"), []);
});

test("an mc question with one option keeps that line in its text", () => {
  const [q] = parseQuiz("## 4 | mc\nשאלה\n- א) רק אחת");
  assert.equal(q.kind, "short");
  assert.match(q.text, /- א\) רק אחת/);
});

test("options under a short question stay in its text; a wrapped option line continues the option", () => {
  const [a, b] = parseQuiz("## 1 | short\nבחרו:\n- א) כן\n- ב) לא\n## 2 | mc\nשאלה\n- א) אפשרות ארוכה\n  שממשיכה בשורה\n- ב) ב\n- ג) ג\n- ד) ד");
  assert.equal(a.kind, "short");
  assert.match(a.text, /בחרו:\n- א\) כן\n- ב\) לא/);
  assert.equal(b.options[0].text, "אפשרות ארוכה שממשיכה בשורה");
});

test("tolerant header and CRLF", () => {
  const qs = parseQuiz("### 1. | MC\r\nשאלה\r\n- א. אחת\r\n- ב. שתיים\r\n- ג. שלוש\r\n- ד. ארבע\r\n");
  assert.equal(qs[0].kind, "mc");
  assert.equal(qs[0].options[3].text, "ארבע");
});

test("the composed submit message, and reading it back", () => {
  const qs = parseQuiz(BLOCK);
  const ans = { 1: "ג", 2: "נכון: מעל 10 GHz הנחתה גדלה", 3: "R = 120 km\nכי השורש הרביעי" };
  assert.equal(answeredCount(qs, ans), 3);
  const msg = composeAnswers(qs, ans);
  assert.equal(
    msg,
    "התשובות שלי למבחן:\n1. ג) פי $2^{1/4} \\approx 1.19$\n2. נכון: מעל 10 GHz הנחתה גדלה\n3. R = 120 km\n   כי השורש הרביעי",
  );
  assert.deepEqual(parseAnswers(msg, qs), { 1: "ג", 2: "נכון: מעל 10 GHz הנחתה גדלה", 3: "R = 120 km\nכי השורש הרביעי" });
  const partial = composeAnswers(qs, { 2: "  " });
  assert.equal(partial, "התשובות שלי למבחן:\n1. (לא עניתי)\n2. (לא עניתי)\n3. (לא עניתי)");
  assert.equal(answeredCount(qs, { 2: "  " }), 0);
  assert.deepEqual(parseAnswers(partial, qs), { 1: "", 2: "", 3: "" });
});
