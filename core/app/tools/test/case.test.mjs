// Unit tests of the engineering case block (src/caseBlock.ts), its spec (bookRules.ts), its audit hooks
// (lessonAudit.ts) and the idea store's prompt list (ideas.ts). Same file in both apps.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const C = await load("../../src/caseBlock.ts");
const B = await load("../../src/bookRules.ts");
const A = await load("../../src/lessonAudit.ts");
const I = await load("../../src/ideas.ts");

const stage = (n, extra = "") => `@@ stage ${n}
ask: מה הייתם בוחרים בשלב ${n}?
anchors:
- נתון מחושב: 13.2 dB ${extra}
expert:
צוותים מובילים מתחילים מהגבול הפיזיקלי [[B02:115]] ולא מהגרסה הקודמת [[ודאות: בינונית]].
rubric:
- [!] ההחלטה המכריעה
- [ ] בדיקה של כן או לא`;

const good = `@title: קישור לרחפן בטווח 50 ק"מ
@id: M3.2-4-case
@stages: 1,5,8
@roles: 1=הלקוח; *=מהנדס בכיר
רחפן צריך קישור וידאו בטווח 50 ק"מ. ההספק 1 W, הרעש $-100$ dBm.
---
${stage(1)}
${stage(5, "[[ודאות: גבוהה]]")}
${stage(8)}
@@ debrief
decisions:
- מחיקת הדרישה לרזולוציה מלאה
- בחירת התדר`;

test("parse: headers, brief, stages, roles, rubric and debrief", () => {
  const c = C.parseCase(good);
  assert.equal(c.title, 'קישור לרחפן בטווח 50 ק"מ');
  assert.equal(c.id, "M3.2-4-case");
  assert.deepEqual(c.stages, ["1", "5", "8"]);
  assert.match(c.brief, /^רחפן/);
  assert.equal(c.notes.length, 3);
  assert.equal(c.notes[0].ask, "מה הייתם בוחרים בשלב 1?");
  assert.deepEqual(c.notes[0].rubric.map((r) => r.decisive), [true, false]);
  assert.equal(c.decisions.length, 2);
  assert.equal(C.stageRole(c, "1"), "הלקוח");
  assert.equal(C.stageRole(c, "5"), "מהנדס בחברה שבחרה אחרת");
  assert.equal(C.stageRole(c, "8"), "מהנדס בכיר");
  assert.deepEqual(C.caseProblems(c, "M3.2-4-case"), []);
  assert.equal(C.caseId("M3.2", 3), "M3.2-4-case");
});

test("problems: order, missing sections, decisive item, sources, certainty in stage 5", () => {
  const bad = good
    .replace("@stages: 1,5,8", "@stages: 5,1,8,9")
    .replace("- [!] ההחלטה המכריעה", "- [ ] לא מכריעה")
    .replace(/\[\[ודאות: גבוהה\]\]/, "")
    .replace(/@@ stage 8[\s\S]*?(?=@@ debrief)/, "");
  const p = C.caseProblems(C.parseCase(bad), "M3.2-4-case").join("\n");
  assert.match(p, /unknown stages: 9/);
  assert.match(p, /fixed order/);
  assert.match(p, /stage 8 is in @stages but has no/);
  assert.match(p, /stage 1: the rubric must mark exactly one decisive/);
  assert.match(p, /stage 5: 1 anchor claim/);
  const unsourced = C.caseProblems(C.parseCase(good.replaceAll("[[B02:115]]", "").replaceAll("[[ודאות: בינונית]]", ""))).join("\n");
  assert.match(unsourced, /no source tag or certainty label/);
  assert.match(C.caseProblems(C.parseCase("@title: x\nbrief only")).join("\n"), /no "---" line/);
  assert.deepEqual(C.parseCase("@stages: fault,6,7,8\nx\n---").stages, ["fault", "6", "7", "8"]);
});

const lesson = ["## פרק 1: קישור", "טקסט.", "", "```keep", "- רווח: …", "```", "", "בשיעור הבא: אנטנות.", "", "```case", good, "```", ""].join("\n");

test("hide the notes from the reader; the audit finds format problems", () => {
  const h = C.hideCaseNotes(lesson);
  assert.ok(h.includes("רחפן צריך קישור"));
  assert.ok(!h.includes("ההחלטה המכריעה"));
  assert.match(h, /hidden notes of 3 stages/);
  assert.deepEqual(A.caseFindings(lesson), []);
  const f = A.caseFindings(lesson.replace("@id: M3.2-4-case\n", ""));
  assert.equal(f.length, 1);
  assert.match(f[0].problem, /no @id/);
  assert.equal(f[0].quote, '@title: קישור לרחפן בטווח 50 ק"מ');
});

test("repairs keep the case last: a new keep block and an insert at the last section go before it", () => {
  const noKeep = lesson.replace("```keep\n- רווח: …\n```\n", "");
  const r = A.applyRepair(noKeep, "<<<KEEP>>>\n- רווח: …\n<<<END>>>\n<<<INSERT_AFTER_SECTION: פרק 1: קישור>>>\nתוספת.\n<<<END>>>", "inplace");
  assert.equal(r.applied, 2);
  assert.ok(r.text.indexOf("```keep") < r.text.indexOf("```case"));
  assert.ok(r.text.indexOf("תוספת.") < r.text.indexOf("```case"));
});

test("spec: the case is outside the word budget, and the last part writes it", () => {
  assert.equal(B.wordCount("```case\n" + good + "\n```"), 0);
  const o = { known: [], chapters: [{ n: 1, title: "t", question: "q", sections: [{ n: "1.1", title: "s", question: "q", from_prev: "", needs: [], defines: [] }] }] };
  assert.match(B.BOOK_PART(o, ["1.1"], true, true, true), /then the engineering case block/);
  assert.doesNotMatch(B.BOOK_PART(o, ["1.1"], true, true), /engineering case block/);
  const part = B.CASE_PART("M3.2-4-case", { stages: "1,2,3" });
  assert.match(part, /@id: M3\.2-4-case/);
  assert.match(part, /"stages":"1,2,3"/);
  assert.match(B.CASE_PLAN(), /"case" last in the last part's "blocks"/);
});

const worked = (n, ex = true) => `${stage(n)}
guide:
- כמת את הגבול לפני שבוחרים
- שקול לפחות שתי חלופות
- אמור מה יהפוך את ההחלטה${ex ? `
example:
הייתי מתחיל מהגבול: 13.2 dB מרווח, ולכן…
ביטחון: 70%` : ""}`;
const workedCase = good.replace(stage(1), worked(1)).replace(stage(5, "[[ודאות: גבוהה]]"), worked(5).replace("13.2 dB ", "13.2 dB [[ודאות: גבוהה]]")).replace(stage(8), worked(8));

test("worked case: guide and example parse; old blocks still parse; the aid follows the lesson's place", () => {
  const c = C.parseCase(workedCase);
  assert.deepEqual(c.notes[0].guide, ["כמת את הגבול לפני שבוחרים", "שקול לפחות שתי חלופות", "אמור מה יהפוך את ההחלטה"]);
  assert.match(c.notes[0].example, /^הייתי מתחיל[\s\S]*ביטחון: 70%$/);
  assert.equal(c.notes[0].rubric.length, 2);
  assert.ok(C.hasExamples(c));
  assert.deepEqual(C.caseProblems(c, "M3.2-4-case", "example"), []);
  const old = C.parseCase(good);
  assert.deepEqual(old.notes[0].guide, []);
  assert.equal(old.notes[0].example, "");
  assert.ok(!C.hasExamples(old));
  assert.deepEqual(C.caseProblems(old), []);
  assert.deepEqual([0, 1, 2, 5].map(C.caseAid), ["example", "guide", null, null]);
});

test("worked case: missing or malformed aids are format problems", () => {
  const p = (src, aid) => C.caseProblems(C.parseCase(src), undefined, aid).join("\n");
  assert.match(p(good, "example"), /stage 1: "guide:" needs 3 to 5 lines \(it has 0\)/);
  assert.match(p(good, "example"), /stage 1: no "example:"/);
  assert.doesNotMatch(p(good, "guide"), /example/);
  assert.match(p(good, "guide"), /stage 8: "guide:" needs 3 to 5 lines/);
  // an example in one stage asks for it in every stage, and each with a confidence in %
  const one = good.replace(stage(1), worked(1));
  assert.match(p(one), /stage 5: no "example:"/);
  assert.match(p(workedCase.replace("ביטחון: 70%", "ביטחון גבוה")), /stage 1: the example has no confidence in %/);
  // the audit reads the lesson's place from the case's id: lesson 1 of the module is a worked case
  const first = ["```case", good.replace("@id: M3.2-4-case", "@id: M3.2-1-case"), "```"].join("\n");
  assert.ok(A.caseFindings(first).some((f) => /no "example:"/.test(f.problem)));
  assert.deepEqual(A.caseFindings(["```case", workedCase.replace("@id: M3.2-4-case", "@id: M3.2-1-case"), "```"].join("\n")), []);
});

test("worked case: the spec asks for the aids only in the module's first lessons", () => {
  assert.match(B.CASE_PART("M3.2-1-case", undefined, "example"), /WORKED one[\s\S]*guide:[\s\S]*example:/);
  assert.match(B.CASE_PART("M3.2-2-case", undefined, "guide"), /GUIDED one[\s\S]*No example: section/);
  assert.doesNotMatch(B.CASE_PART("M3.2-3-case"), /WORKED|GUIDED/);
  assert.match(B.CASE_PLAN("example"), /first lesson of its module/);
  assert.doesNotMatch(B.CASE_PLAN(), /first lesson of its module/);
});

test("ideas: the prompt list puts projects first and stays short", () => {
  const ideas = [
    { id: "a", text: "זרע ישן", moduleId: "M1.1", lesson: 0, caseId: "M1.1-1-case", status: "seed", at: 1 },
    { id: "b", text: "פרויקט", moduleId: "M2.1", lesson: 2, caseId: "M2.1-3-case", stage: "8", status: "project", at: 0 },
  ];
  const t = I.ideasForPrompt(ideas).split("\n");
  assert.equal(t.length, 2);
  assert.match(t[0], /^- \[פרויקט, M2\.1 שיעור 3, שלב 8\] פרויקט$/);
  assert.equal(I.ideasForPrompt(ideas, 1).split("\n").length, 1);
});

test("ideas: save adds or replaces by id in the one document", async () => {
  let doc = null;
  const store = { loadIdeas: async () => doc, saveIdeas: async (d) => void (doc = d) };
  await I.saveIdea(store, { id: "a", text: "x", moduleId: "M1.1", lesson: 0, caseId: "c", status: "seed", at: 1 });
  await I.saveIdea(store, { id: "a", text: "y", moduleId: "M1.1", lesson: 0, caseId: "c", status: "growing", at: 2 });
  const all = await I.loadIdeas(store);
  assert.equal(all.length, 1);
  assert.equal(all[0].status, "growing");
  assert.deepEqual(await I.loadIdeas(null), []);
});
