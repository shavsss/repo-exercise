// Unit tests of src/bookRules.ts (the lesson as chapters of a book) and the writer's @mark in guide.ts.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const B = await load("../../src/bookRules.ts");

const outline = {
  known: ["לוגריתם", "dB"],
  chapters: [
    {
      n: 3,
      title: "אובדן ההתפשטות",
      question: "כמה מההספק מגיע?",
      sections: [
        { n: "3.1", title: "צפיפות הספק", question: "q", from_prev: "ERP", needs: ["ERP"], defines: [{ term: "צפיפות הספק", mark: "s" }] },
        { n: "3.2", title: "שטח אפקטיבי", question: "q", from_prev: "3.1", needs: ["צפיפות הספק", "אורך גל"], defines: [{ term: "שטח אפקטיבי", mark: "s" }] },
        { n: "3.3", title: "אורך גל", question: "q", from_prev: "3.2", needs: [], defines: [{ term: "אורך גל", mark: "a" }] },
      ],
    },
  ],
};

test("order: a need defined only later is found; a need nothing defines is left to the model", () => {
  const p = B.orderProblems(B.normalizeOutline(outline));
  assert.equal(p.length, 1);
  assert.equal(p[0].where, "3.2");
  assert.match(p[0].problem, /אורך גל/);
});

test("the terms defined before a subsection, and the part's view of the outline", () => {
  const o = B.normalizeOutline(outline);
  assert.deepEqual(B.definedBefore(o, "3.3"), ["לוגריתם", "dB", "צפיפות הספק", "שטח אפקטיבי"]);
  const t = B.outlineText(o, ["3.2"]);
  assert.match(t, /3\.2 שטח אפקטיבי {2}← THIS PART/);
  assert.match(t, /שטח אפקטיבי \[ס\]/);
  assert.ok(!t.includes("3.1 צפיפות הספק  ←"));
  assert.deepEqual(B.partSections(o, [{}], 0), ["3.1", "3.2", "3.3"]);
  assert.deepEqual(B.partSections(o, [{ sections: ["3.2", "3.3"] }], 0), ["3.2", "3.3"]);
});

test("normalize and validate", () => {
  assert.ok(B.validOutline(outline));
  assert.ok(!B.validOutline({ chapters: [] }));
  const o = B.normalizeOutline({ chapters: [{ n: 1, title: "t", question: "q", sections: [{ n: "1.1", title: "t", defines: ["מודל", { term: "הפשטה", mark: "s" }] }] }] });
  assert.deepEqual(o.known, []);
  assert.deepEqual(o.chapters[0].sections[0].defines, [{ term: "מודל", mark: "a" }, { term: "הפשטה", mark: "s" }]);
  assert.deepEqual(o.chapters[0].sections[0].needs, []);
});

test("the part rules open and close chapters where the part does, and end the lesson only in the last part", () => {
  const o = B.normalizeOutline(outline);
  const a = B.BOOK_PART(o, ["3.1"], true, false);
  assert.match(a, /Chapter 3 opens here/);
  assert.ok(!/Chapter 3 closes here/.test(a));
  assert.match(a, /Do not end the lesson/);
  const z = B.BOOK_PART(o, ["3.2", "3.3"], false, true);
  assert.match(z, /No chapter opens in this part/);
  assert.match(z, /Chapter 3 closes here/);
  assert.match(z, /keep block holds exactly the items marked \[ס\]/);
  assert.match(B.BOOK_PLAN(3), /Number the chapters from 3/);
});

test("the outline check's answer: problems mean fix", () => {
  assert.equal(B.parseOutlineReview('{"problems":[],"verdict":"fix"}').verdict, "pass");
  assert.equal(B.parseOutlineReview({ problems: [{ where: "3.2", problem: "x" }] }).verdict, "fix");
  assert.equal(B.parseOutlineReview("nothing"), null);
});

test("the writer's @mark wins in the lesson map", async () => {
  const G = await load("../../src/guide.ts");
  const md = "## פרק 3: א\n\n### 3.1 ב\n\n```definition\n@title: צפיפות הספק\n@mark: summary\nS=P/4πd²\n```\n\n```formula\n@title: עזר\n@mark: aid\nx=1\n```\n";
  const lb = G.lessonBlocks(md);
  assert.equal(lb[0].mark, "summary");
  assert.equal(lb[1].mark, "aid");
  const heads = G.lessonHeads ? G.lessonHeads(md) : [];
  const g = G.parseGuide({ sections: [], blocks: [{ id: "B1", kind: "preview", module: "M1.4" }] }, heads, ["M0.1", "M1.4"], "M0.1", 1, lb);
  assert.ok(g);
  const byText = Object.fromEntries(g.blocks.map((b) => [b.head, b.kind]));
  assert.equal(byText["צפיפות הספק"], "core");
  assert.equal(byText["עזר"], "example");
});

test("the word budget: planned words, a word count, and the tighten step", () => {
  const o = B.normalizeOutline({ known: [], chapters: [{ n: 2, title: "t", question: "q", sections: [
    { n: "2.1", title: "a", question: "q", from_prev: "", needs: [], defines: [], words: 1200, visual: "chart: Ls against d" },
    { n: "2.2", title: "b", question: "q", from_prev: "", needs: [], defines: [], words: 800 },
  ] }] });
  assert.equal(B.lessonWords(o), 2000);
  assert.equal(B.partWords(o, ["2.2"]), 800);
  assert.equal(B.wordCount("אחת שתיים  שלוש\nארבע"), 4);
  assert.match(B.outlineText(o, ["2.1"]), /visual: chart: Ls against d/);
  assert.match(B.BOOK_PART(o, ["2.1"], true, false), /this part about 1200 words/);
  assert.match(B.BOOK_PLAN(2), /at most 15000 words/);
  const t = B.tightenPrompt("x", 20000, 15000);
  assert.match(t, /It has 20000 words; its budget is 15000/);
  assert.match(t, /never remove or thin a definition/);
});
