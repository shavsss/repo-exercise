// Unit tests of src/practice.ts: the three practice blocks, grading a number, and the gate.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const out = await build({ entryPoints: [fileURLToPath(new URL("../../src/practice.ts", import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
const P = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

test("multiple choice: options, the right one, each explanation", () => {
  const m = P.parseMcq("@title: אובדן\nמה קורה ל-$L_s$ כשמכפילים את המרחק?\n- [ ] עולה ב-3 dB :: זה הכפלת הספק, לא מרחק\n- [x] עולה ב-6 dB :: $20\\log 2$\n- [ ] לא משתנה :: הוא תלוי במרחק\n  בריבוע");
  assert.equal(m.title, "אובדן");
  assert.match(m.question, /מכפילים את המרחק/);
  assert.equal(m.options.length, 3);
  assert.deepEqual(m.options.map((o) => o.correct), [false, true, false]);
  assert.equal(m.options[2].why, "הוא תלוי במרחק בריבוע");
});

test("numbers: forms, tolerance, known wrong values, units off by a power of ten", () => {
  assert.equal(P.parseNumber("1,234.5"), 1234.5);
  assert.equal(P.parseNumber("4,17"), 4.17);
  assert.equal(P.parseNumber("4.17×10^42"), 4.17e42);
  assert.equal(P.parseNumber("1.2·10³"), 1200);
  assert.equal(P.parseNumber("−3"), -3);
  assert.equal(P.parseNumber("abc"), null);
  const n = P.parseNumeric("@answer: 189.7\n@unit: ק\"מ\n@tol: 1%\nמה הטווח?\n---\nמציבים ב-(27).\n- wrong: 95 :: הכפלת את המרווח ב-6 dB פעמיים");
  assert.equal(n.answer, 189.7);
  assert.equal(n.unit, 'ק"מ');
  assert.equal(n.solution, "מציבים ב-(27).");
  assert.equal(P.gradeNumeric(n, "189").grade, "right");
  assert.equal(P.gradeNumeric(n, "95").feedback, "הכפלת את המרווח ב-6 dB פעמיים");
  assert.equal(P.gradeNumeric(n, "195").grade, "partial");
  assert.match(P.gradeNumeric(n, "189700").feedback, /10\^\{3\}/);
  assert.equal(P.gradeNumeric(n, "x"), null);
  const abs = P.parseNumeric("@answer: -59\n@tol: 0.5\nכמה dBm?");
  assert.equal(P.gradeNumeric(abs, "-59.4").grade, "right");
  assert.equal(P.gradeNumeric(abs, "59").feedback, "הגודל נכון והסימן הפוך.");
});

test("explanation: question, key ideas, model answer", () => {
  const e = P.parseExplain("למה הגבר אינו יצירת הספק?\n---\n- האנטנה פסיבית\n- ריכוז על חשבון כיוונים אחרים\n===\nכי האנטנה רק מפנה את ההספק.");
  assert.equal(e.ideas.length, 2);
  assert.equal(e.model, "כי האנטנה רק מפנה את ההספק.");
  assert.equal(P.practiceQuestion("explain", "למה?\n---\n- א"), "למה?");
});

test("the gate cuts the lesson after the first open question, and opens as questions are answered", () => {
  const md = "### 2.1 א\nטקסט.\n\n```mcq\nשאלה 1?\n- [x] כן :: כי\n```\n\nהמשך.\n\n```numeric\n@answer: 2\nשאלה 2?\n```\n\nסוף.";
  const none = P.gateText(md, () => false);
  assert.ok(none.gated);
  assert.ok(none.text.endsWith("```"));
  assert.ok(!none.text.includes("המשך."));
  const one = P.gateText(md, (q) => q === "שאלה 1?");
  assert.ok(one.text.includes("המשך.") && !one.text.includes("סוף."));
  const all = P.gateText(md, () => true);
  assert.equal(all.text, md);
  assert.ok(!all.gated);
  assert.equal(P.practiceBlocks(md).length, 2);
});
