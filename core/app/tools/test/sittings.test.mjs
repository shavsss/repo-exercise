// Unit tests of src/sittings.ts: a lesson cut into sittings by sub-topic (the scrolling column).
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const S = await load("../../src/sittings.ts");

const para = (n, w = "מילה") => Array.from({ length: n }, () => w).join(" ");
const lesson = [
  "פתיחה קצרה של השיעור.",
  "## פרק 2: הכוחות",
  para(60),
  "### 2.1 הבנה",
  para(300),
  "```figure\n@doc: X\n```",
  "### 2.2 הבמה",
  para(500),
  "## פרק 3: השדה",
  para(500, "פתיחה"),
  "### 3.1 שדה חשמלי",
  para(300),
  "```figure\n@doc: Y\n```",
  "### 3.2 קצר",
  para(30),
].join("\n\n");

test("a sitting per subsection; a chapter's short opening goes with its first subsection", () => {
  const s = S.splitSittings(lesson);
  assert.deepEqual(s.map((x) => x.title), ["2.1 הבנה", "2.2 הבמה", "פרק 3: השדה", "3.1 שדה חשמלי"]);
  // the lesson's first line and the chapter heading are read with 2.1
  assert.ok(s[0].text.startsWith("פתיחה קצרה") && s[0].text.includes("## פרק 2") && s[0].opensChapter);
  assert.equal(s[1].chapter, "פרק 2: הכוחות");
  assert.ok(!s[1].opensChapter);
});

test("a long chapter opening is its own sitting; a sliver at the end joins the one before", () => {
  const s = S.splitSittings(lesson);
  assert.ok(s[2].opensChapter && s[2].words >= 500);
  assert.ok(s[3].text.includes("### 3.2 קצר"));
});

test("figures keep their numbers: figBase counts the figures before the sitting", () => {
  const s = S.splitSittings(lesson);
  assert.deepEqual(s.map((x) => x.figBase), [0, 1, 1, 1]);
});

test("the whole text is kept, block by block", () => {
  const s = S.splitSittings(lesson);
  const norm = (t) => t.replace(/\s+/g, " ").trim();
  assert.equal(norm(s.map((x) => x.text).join("\n\n")), norm(lesson));
});
