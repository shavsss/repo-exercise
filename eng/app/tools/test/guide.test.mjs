// Unit tests of src/guide.ts (the lesson map): the headings of a lesson, the matching of a heading on the page to
// its entry, and the defensive parsing of the model's answer.
// Run from the app folder: node tools/test/guide.test.mjs
import { build } from "esbuild";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/guide.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const G = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
const { lessonHeadings, headKey, hastKey, sameHead, findSection, parseGuide, asGuide, cleanHead, tagText, guidePrompt } = G;

/* ---- headings of a lesson ---- */
const lesson = [
  "פתיחה לפני כל כותרת.",
  "",
  "## 1. מרחבים **ומבנים**",
  "",
  "מרחב הוא קבוצה עם מבנה. " + "מילה ".repeat(60),
  "",
  "```definition",
  "@title: מרחב",
  "## זו לא כותרת, היא בתוך בלוק",
  "```",
  "",
  "### יציבות לפי ליאפונוב: $\\dot V \\le 0$",
  "",
  "נקודת שיווי משקל יציבה אם...",
  "",
  "#### כותרת רביעית לא נספרת",
  "",
  "## דוגמה: מיקום בלוויין [[GPS | מערכת ניווט לוויינית]]",
  "טקסט.",
].join("\n");
const heads = lessonHeadings(lesson);
assert.equal(heads.length, 3, "h2/h3 outside fences only");
assert.deepEqual(heads.map((h) => h.level), [2, 3, 2]);
assert.equal(heads[0].text, "1. מרחבים ומבנים", "emphasis removed");
assert.equal(heads[1].text, "יציבות לפי ליאפונוב: $\\dot V \\le 0$", "math kept in the text");
assert.equal(heads[0].lead.split(" ").length, 40, "first 40 words");
assert.ok(heads[0].lead.startsWith("מרחב הוא קבוצה"), "lead starts after the heading");
assert.ok(!heads[0].lead.includes("@title"), "block keys left out");
assert.ok(heads[1].lead.includes("כותרת רביעית"), "an h4 stays in its section");

/* ---- keys: Markdown source vs the page (hast) ---- */
assert.equal(headKey("## 1. מרחבים **ומבנים**"), "1 מרחבים ומבנים");
assert.equal(headKey("### יציבות לפי ליאפונוב: $\\dot V \\le 0$"), "יציבות לפי ליאפונוב");
assert.equal(headKey("  Lyapunov   *Stability*  "), "lyapunov stability", "trim, collapse, case");
// the same heading as react-markdown hands it: KaTeX and the [[tag]] pill (inline code) are skipped
const hastLyap = {
  type: "element",
  tagName: "h3",
  children: [
    { type: "text", value: "יציבות לפי ליאפונוב: " },
    { type: "element", tagName: "span", properties: { className: ["katex"] }, children: [{ type: "text", value: "V˙≤0" }] },
  ],
};
assert.equal(hastKey(hastLyap), headKey("### יציבות לפי ליאפונוב: $\\dot V \\le 0$"), "page key = source key (math)");
const hastGps = {
  type: "element",
  tagName: "h2",
  children: [
    { type: "text", value: "דוגמה: מיקום בלוויין " },
    { type: "element", tagName: "code", properties: {}, children: [{ type: "text", value: "§b:GPS | מערכת ניווט לוויינית" }] },
  ],
};
assert.equal(hastKey(hastGps), heads[2].key, "page key = source key (tag)");
const hastBold = { type: "element", tagName: "h2", children: [{ type: "text", value: "1. מרחבים " }, { type: "element", tagName: "strong", children: [{ type: "text", value: "ומבנים" }] }] };
assert.equal(hastKey(hastBold), heads[0].key, "page key = source key (emphasis)");
assert.ok(sameHead("מרחבים ומבנים", "מרחבים ומבנים בהנדסה"), "a lengthened heading still matches");
assert.ok(!sameHead("מרחב", "מרחבים ומבנים"), "a short prefix does not");
assert.ok(!sameHead("", "x"));

/* ---- parsing the answer ---- */
const ids = ["M0.1", "M5.3", "M7.2"];
const answer =
  "הנה המפה:\n```json\n" +
  JSON.stringify({
    sections: [
      { head: "1. מרחבים ומבנים", kind: "core", module: "M5.3", note: "הנושא של השיעור" },
      { head: "יציבות לפי ליאפונוב", kind: "preview", module: "M5.3", note: "מילה ".repeat(20) },
      { head: "דוגמה: מיקום בלוויין", kind: "EXAMPLE", module: "M99" },
      { head: "כותרת שלא קיימת בשיעור", kind: "core" },
      { head: "1. מרחבים ומבנים", kind: "nonsense" },
    ],
    copy: ["הגדרת מרחב", 7, "", "יציבות: הגדרה בלבד"],
  }) +
  "\n```\nזהו.";
const g = parseGuide(answer, heads, ids, "M0.1", 1234);
assert.ok(g, "parsed through a fence and prose");
assert.equal(g.v, 1);
assert.equal(g.at, 1234);
assert.equal(g.sections.length, 3, "unknown headings and kinds dropped");
assert.equal(g.sections[0].module, undefined, "core keeps no module");
assert.equal(g.sections[1].head, heads[1].text, "the lesson's own heading text is stored");
assert.equal(g.sections[1].module, "M5.3");
assert.equal(g.sections[1].note.split(" ").length, 12, "note cut to 12 words");
assert.equal(g.sections[2].kind, "example", "kind case-insensitive");
assert.equal(g.sections[2].module, undefined, "module not in the course dropped");
assert.deepEqual(g.copy, ["הגדרת מרחב", "יציבות: הגדרה בלבד"], "copy: strings only");
assert.equal(parseGuide("I can't help with that.", heads, ids), null, "no JSON: nothing");
assert.equal(parseGuide("{not json}", heads, ids), null, "bad JSON: nothing");
assert.equal(parseGuide('{"sections": []}', heads, ids), null, "empty: nothing");
assert.equal(parseGuide('{"sections": [{"head": "אחר", "kind": "core"}]}', heads, ids), null, "no heading matched: nothing");
assert.equal(parseGuide(JSON.stringify({ sections: [{ head: "יציבות לפי ליאפונוב", kind: "preview", module: "M0.1" }] }), heads, ids, "M0.1").sections[0].module, undefined, "a preview never points at the current module");
assert.equal(parseGuide(null, heads, ids), null);

/* ---- a stored map, and finding a heading's entry ---- */
assert.equal(asGuide(null), null);
assert.equal(asGuide({ sections: [{ head: 1, kind: "core" }] }), null);
const stored = asGuide(JSON.parse(JSON.stringify(g)));
assert.deepEqual(stored, g, "round trip through the db");
assert.equal(findSection(stored, hastKey(hastLyap))?.kind, "preview");
assert.equal(findSection(stored, hastKey(hastGps))?.kind, "example");
assert.equal(findSection(stored, headKey("## כותרת אחרת לגמרי")), null, "no match, no tag");
assert.equal(findSection(null, "x"), null);

/* ---- words ---- */
assert.equal(tagText({ kind: "core" }), "לב השיעור · לסיכום");
assert.equal(tagText({ kind: "preview", module: "M5.3" }), "הכרות · נלמד ב-M5.3");
assert.equal(tagText({ kind: "example" }), "המחשה · לא להעתיק");
assert.equal(tagText({ kind: "example", module: "M7.2" }), "המחשה · לא להעתיק · נלמד ב-M7.2");
assert.equal(cleanHead("## a \\* b"), "a * b", "escapes undone");

/* ---- the prompt carries what the stub and the model need ---- */
const p = guidePrompt({ moduleId: "M0.1", moduleTitle: "מבט כללי", lessonTitle: "שיעור", lessonNo: 4, lessonCount: 6, heads, modules: ids.map((id) => ({ id, title: "x".repeat(200) })) });
assert.ok(p.includes("<lesson_headings>") && p.includes("1. [h2] 1. מרחבים ומבנים"));
assert.ok(p.includes("M5.3 " + "x".repeat(70) + "\n"), "titles trimmed");
assert.ok(!/radar|warfare|weapon|missile/i.test(p), "engineering register");

console.log("guide: all tests passed");
