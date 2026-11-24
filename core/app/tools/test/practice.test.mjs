// Unit tests of src/practice.ts: the three practice blocks, grading a number, and the gate.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (f) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(`../../src/${f}`, import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", mainFields: ["module", "main"], logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const P = { ...(await load("practice.ts")), ...(await load("answerValue.ts")) };

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
  assert.equal(P.parseNumber("3.09e+35"), 3.09e35);
  assert.equal(P.parseNumber("3.09E35"), 3.09e35);
  assert.equal(P.parseNumber("abc"), null);
  const n = P.parseNumeric("@answer: 189.7\n@unit: ק\"מ\n@tol: 1%\nמה הטווח?\n---\nמציבים ב-(27).\n- wrong: 95 :: הכפלת את המרווח ב-6 dB פעמיים");
  assert.equal(n.answer.re, 189.7);
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

test("answers: complex numbers, phasors, expressions and LaTeX", () => {
  const V = (s) => P.parseValue(s);
  const close = (v, re, im = 0) => assert.ok(v && Math.abs(v.re - re) < 1e-9 && Math.abs(v.im - im) < 1e-9, `${JSON.stringify(v)} != ${re}${im ? `+${im}j` : ""}`);
  close(V("3+4j"), 3, 4);
  close(V("3 - j4"), 3, -4);
  close(V("4i"), 0, 4);
  close(V("-j"), 0, -1);
  close(V("5∠90°"), 0, 5);
  close(V("2∠180"), -2, 0);
  close(V("1∠pi/2 rad"), 0, 1);
  close(V("2*pi*50"), 2 * Math.PI * 50);
  close(V("1/0.35*ln(10)"), Math.log(10) / 0.35);
  close(V("log(1000)"), 3);
  close(V("\\ln 10"), Math.log(10));

  close(V("√2/2"), Math.SQRT1_2);
  close(V("1.2×10^3"), 1200);
  close(V("1.2·10³"), 1200);
  close(V("4,17"), 4.17);
  close(V("1,234.5"), 1234.5);
  close(V("$\\frac{\\sqrt{3}}{2}$"), Math.sqrt(3) / 2);
  close(V("\\frac{1}{2}+\\frac{\\sqrt{3}}{2}j"), 0.5, Math.sqrt(3) / 2);
  close(V("2e^{j\\pi/2}"), 0, 2);
  close(V("$\\frac12$"), 0.5);
  close(V("\\frac{3}4+\\sqrt2"), 0.75 + Math.SQRT2);
  close(V("10\\angle 90^{\\circ}"), 0, 10);
  for (const bad of ["", "x", "abc", "2 m", "[1,2]", "a=3", "f(x)=x"]) assert.equal(V(bad), null, bad);
  const z = P.parseNumeric("@answer: 3+4j\n@tol: 1%\nמה העכבה?\n---\nפתרון\n- wrong: 3+4 :: חיברת את החלקים");
  assert.equal(z.answer.im, 4);
  assert.equal(P.gradeNumeric(z, "5∠53.13°").grade, "right");
  assert.equal(P.gradeNumeric(z, "3+j4").grade, "right");
  assert.match(P.gradeNumeric(z, "3-4j").feedback, /הצמוד/);
  assert.match(P.gradeNumeric(z, "5").feedback, /הפאזה/);
  assert.equal(P.gradeNumeric(z, "7").feedback, "חיברת את החלקים");
  assert.match(P.gradeNumeric(z, "300+400j").feedback, /10\^\{2\}/);
  assert.match(P.valueTex(V("3+4j")), /3 \+ 4j .*5\\angle 53\.13/);
});

test("explanation: question, key ideas, model answer", () => {
  const e = P.parseExplain("למה הגבר אינו יצירת הספק?\n---\n- האנטנה פסיבית\n- ריכוז על חשבון כיוונים אחרים\n===\nכי האנטנה רק מפנה את ההספק.");
  assert.equal(e.ideas.length, 2);
  assert.equal(e.model, "כי האנטנה רק מפנה את ההספק.");
  assert.equal(P.practiceQuestion("explain", "למה?\n---\n- א"), "למה?");
});

test("the gate cuts the lesson after the first open question, and opens as questions are answered", () => {
  const md = "### 2.1 א\nטקסט.\n\n```mcq\nשאלה 1?\n- [x] כן :: כי\n```\n\nקטעשני.\n\n```numeric\n@answer: 2\nשאלה 2?\n```\n\nקטעאחרון.";
  const none = P.gateText(md, () => false);
  assert.ok(none.gated);
  assert.match(none.text, /```\n\n\*השיעור ממשיך אחרי השאלה/);
  assert.ok(!none.text.includes("קטעשני."));
  const one = P.gateText(md, (q) => q === "שאלה 1?");
  assert.ok(one.text.includes("קטעשני.") && !one.text.includes("קטעאחרון."));
  const all = P.gateText(md, () => true);
  assert.equal(all.text, md);
  assert.ok(!all.gated);
  assert.equal(P.practiceBlocks(md).length, 2);
});
