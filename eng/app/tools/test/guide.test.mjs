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
assert.deepEqual(stored, { ...g, partial: false, heads: g.sections.length }, "round trip through the db");
assert.equal(asGuide({ ...g, partial: true, heads: 3 }).partial, true, "a map of a draft lesson stays partial");
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

/* ---- definitions and formulas (2.11): each block is marked on its own ---- */
{
  const { lessonBlocks, blockKeyOf, findBlock } = G;
  const md = [
    "## יסודות", "טקסט.",
    "```definition", "@title: יציבות", "מערכת יציבה אם...", "```",
    "```scene3d", "```definition", "{}", "```",
    "## ליאפונוב", "```formula", "$$\\lambda^2+a\\lambda+b=0$$", "```",
  ].join("\n");
  const bl = lessonBlocks(md);
  assert.equal(bl.length, 2, "two blocks, the fence inside another block ignored");
  assert.deepEqual(bl.map((b) => [b.id, b.type, b.section]), [["B1", "definition", "יסודות"], ["B2", "formula", "ליאפונוב"]]);
  assert.equal(blockKeyOf("@title: יציבות\nמערכת").text, "יציבות");
  const g2 = parseGuide(JSON.stringify({ sections: [], blocks: [{ id: "B1", kind: "core" }, { id: "B2", kind: "preview", module: "M5.3" }, { id: "B9", kind: "core" }] }), [], ["M5.3"], "M0.1", 1, bl);
  assert.equal(g2.blocks.length, 2, "unknown block ids dropped");
  assert.equal(findBlock(g2, "@title: יציבות\nמערכת יציבה אם...")?.kind, "core");
  assert.equal(findBlock(g2, "$$\\lambda^2+a\\lambda+b=0$$")?.module, "M5.3");
  assert.equal(asGuide(JSON.parse(JSON.stringify(g2))).blocks.length, 2, "blocks survive the db");
  assert.ok(guidePrompt({ moduleId: "M0.1", moduleTitle: "t", lessonTitle: "l", lessonNo: 1, heads: [], blocks: bl, modules: [] }).includes("B2. [formula]"));
}
console.log("guide blocks ok");

/* ---- questions and keep lines checked against the lesson (3.11) ---- */
{
  const { lessonQuestions, lessonKeep, findQuestion, findKeep, questionKeyOf } = G;
  const md = [
    "## טמפרטורה",
    "```predict",
    "@title: מהירות מולקולת אוויר",
    "@value: 508",
    "מה המהירות הטיפוסית $v_{rms}$ של מולקולה?",
    "---",
    "מ-(2): 508 מ'/ש'.",
    "~~~python",
    "print(1)",
    "~~~",
    "```",
    "```think",
    "קרח נמס: המרחק בין המולקולות גדל או קטן?",
    "---",
    "קטן.",
    "```",
    "```keep",
    "- טמפרטורה קינטית: $\\langle\\tfrac12mv^2\\rangle=\\tfrac32k_BT$",
    "- מהירות rms: $v=\\sqrt{3kT/m}$",
    "```",
  ].join("\n");
  const qs = lessonQuestions(md);
  assert.equal(qs.length, 2);
  assert.equal(qs[0].type, "predict");
  assert.ok(qs[0].text.startsWith("מהירות מולקולת אוויר."), qs[0].text);
  assert.equal(qs[1].section, "טמפרטורה");
  const keep = lessonKeep(md);
  assert.equal(keep.length, 2);
  const raw = JSON.stringify({
    sections: [{ head: "טמפרטורה", kind: "core" }],
    questions: [{ id: "Q1", fit: "preview", module: "M13.1" }, { id: "Q2", fit: "taught" }, { id: "Q9", fit: "beyond" }],
    keep: [{ id: "K1", kind: "core" }, { id: "K2", kind: "preview", module: "M13.1" }],
  });
  const g = parseGuide(raw, lessonHeadings(md), ["M0.2", "M13.1"], "M0.2", 1, [], qs, keep);
  assert.equal(g.questions.length, 2);
  // the page matches a block by its own source, headers and answer included
  const predictSrc = md.split("```predict\n")[1].split("\n```")[0];
  assert.equal(findQuestion(g, predictSrc)?.fit, "preview");
  assert.equal(findQuestion(g, predictSrc)?.module, "M13.1");
  assert.equal(findQuestion(g, "קרח נמס: המרחק בין המולקולות גדל או קטן?\n---\nקטן.")?.fit, "taught");
  assert.equal(findKeep(g, "מהירות rms: v = √(3kT/m)")?.kind, "preview");
  assert.equal(findKeep(g, "טמפרטורה קינטית: …")?.kind, "core");
  // a stored map keeps them, and an old one without them reads as "not checked yet"
  const back = asGuide(JSON.parse(JSON.stringify(g)));
  assert.equal(back.questions.length, 2);
  assert.equal(back.keep.length, 2);
  assert.equal(asGuide({ sections: [{ head: "x", kind: "core" }] }).questions, undefined);
  assert.ok(questionKeyOf("@title: x\nשאלה\n---\nתשובה") === questionKeyOf("שאלה"));
  console.log("questions and keep: ok");
}
