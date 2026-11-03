// Unit tests of src/lessonAudit.ts: parsing the reviewer's answer and applying the author's repair edits.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/lessonAudit.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const A = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

const lesson = ["## 1. אטומים", "טקסט על אטומים.", "", "### 1.1 לחץ", "הלחץ הוא חבטות.", "", "## 2. אידוי", "אידוי מקרר.", "", "```think", "שאלה?", "---", "תשובה.", "```", "", "```keep", "- אטום: …", "```"].join("\n");

test("parse: a pass with open findings is a fix; garbage is null", () => {
  const r = A.parseAudit('note {"missing":[{"topic":"חום בעיבוי","after":"2. אידוי"}],"keep":{"exists":true,"missing":[]},"verdict":"pass"} end');
  assert.equal(r.verdict, "fix");
  assert.equal(A.problems(r), 1);
  assert.equal(A.parseAudit("no json here"), null);
  const ok = A.parseAudit('{"missing":[],"thin":[],"deferrals":[{"topic":"x","verdict":"ok"}],"questions":[],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[],"verdict":"pass"}');
  assert.equal(ok.verdict, "pass");
});

test("in place: insert at the end of a section, replace a unique passage, set the keep block", () => {
  const raw = [
    "<<<INSERT_AFTER_SECTION: 1. אטומים>>>",
    "### 1.2 יונים",
    "יון הוא אטום עם עודף או חוסר אלקטרונים.",
    "<<<END>>>",
    "<<<INSERT_AFTER_SECTION: 2. אידוי>>>",
    "### 2.1 חום בעיבוי",
    "חזרה של מולקולה משחררת חום.",
    "<<<END>>>",
    "<<<REPLACE>>>",
    "אידוי מקרר.",
    "<<<WITH>>>",
    "אידוי מקרר, ועיבוי מחמם.",
    "<<<END>>>",
    "<<<REPLACE>>>",
    "משפט שלא קיים",
    "<<<WITH>>>",
    "x",
    "<<<END>>>",
    "<<<KEEP>>>",
    "- אטום: …",
    "- יון: עודף או חוסר אלקטרונים",
    "<<<END>>>",
  ].join("\n");
  const r = A.applyRepair(lesson, raw, "inplace");
  assert.equal(r.failed, 1);
  assert.equal(r.applied, 4);
  // 1.2 goes after the whole section 1 (after its subsection 1.1), before section 2
  assert.ok(r.text.indexOf("### 1.2 יונים") > r.text.indexOf("הלחץ הוא חבטות.") && r.text.indexOf("### 1.2 יונים") < r.text.indexOf("## 2. אידוי"));
  // the last section: before its keep block
  assert.ok(r.text.indexOf("### 2.1 חום בעיבוי") < r.text.indexOf("```keep"));
  assert.ok(r.text.includes("ועיבוי מחמם"));
  assert.equal((r.text.match(/```keep/g) || []).length, 1);
  assert.ok(r.text.includes("- יון: עודף"));
});

test("supplement: appended after the lesson, nothing in it changed", () => {
  const raw = "<<<SUPPLEMENT>>>\n## השלמה לשיעור\nמשלים את «אידוי».\n<<<END>>>\n<<<KEEP>>>\n- אטום: …\n- עיבוי: מחמם\n<<<END>>>";
  const r = A.applyRepair(lesson, raw, "supplement");
  assert.ok(r.text.startsWith(lesson.split("```keep")[0]));
  assert.ok(r.text.trimEnd().endsWith("## השלמה לשיעור\nמשלים את «אידוי»."));
  assert.ok(r.text.includes("- עיבוי: מחמם"));
});

test("a lesson without a keep block gets one at the end", () => {
  const r = A.applyRepair("## א\nטקסט", "<<<KEEP>>>\n- א: ב\n<<<END>>>", "inplace");
  assert.ok(r.text.endsWith("```keep\n- א: ב\n```\n"));
});

test("the whole loop: review, repair, review again", async () => {
  const calls = [];
  const res = await A.auditAndRepair(
    { lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: ["1-1"], otherLessons: [], curriculum: "", modules: [], pages: "p", text: lesson },
    "inplace",
    {
      call: async (prompt, kind) => {
        calls.push(kind);
        if (kind === "repair") return "<<<INSERT_AFTER_SECTION: 2. אידוי>>>\nחום בעיבוי.\n<<<END>>>";
        return calls.length === 1
          ? '{"missing":[{"topic":"חום בעיבוי","after":"2. אידוי"}],"keep":{"exists":true},"must_core":["חום בעיבוי"],"verdict":"fix"}'
          : '{"missing":[],"keep":{"exists":true},"must_core":["חום בעיבוי"],"verdict":"pass"}';
      },
    },
  );
  assert.deepEqual(calls, ["audit", "repair", "audit"]);
  assert.equal(res.mark.verdict, "fixed");
  assert.equal(res.mark.counts.missing, 1);
  assert.ok(res.text.includes("חום בעיבוי."));
  assert.deepEqual(res.mark.must_core, ["חום בעיבוי"]);
});

test("named modules", () => {
  assert.deepEqual(A.namedModules("נלמד ב-M13.1 וגם ב-M9.9, ושוב M13.1"), ["M13.1", "M9.9"]);
});
