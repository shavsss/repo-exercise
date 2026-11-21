// Unit tests of src/bookRules.ts (the lesson as chapters of a book) and the writer's @mark in guide.ts.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
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
  assert.equal(B.partWords(o, ['2.1', '2.2']), 2000);
  assert.equal(B.partWords(o, ["2.2"]), 800);
  assert.equal(B.wordCount("אחת שתיים  שלוש\nארבע"), 4);
  assert.equal(B.wordCount("מילה\n```svg\n<svg viewBox=\"0 0 1 1\"><text>א ב ג</text></svg>\n```\nעוד"), 2);
  assert.match(B.outlineText(o, ["2.1"]), /visuals: chart: Ls against d/);
  assert.match(B.BOOK_PART(o, ["2.1"], true, false), /2\.1 ≈1200; this part about 1200 words in all/);
  assert.match(B.BOOK_PLAN(2), /Length follows depth/);
  assert.match(B.BOOK_PLAN(2), /breadth never adds words/);
  // the budget is the planned depth of what the parts write plus room for the questions, with no fixed cap (21.11)
  assert.equal(B.lessonBudget(o, [{ sections: ["2.1", "2.2"] }]), 4500);
  const deep = B.normalizeOutline({ known: [], chapters: [{ n: 1, title: "t", question: "q", sections: Array.from({ length: 10 }, (_, i) => ({ n: `1.${i + 1}`, title: "a", question: "q", from_prev: "", needs: [], defines: [], words: 2000 })) }] });
  assert.equal(B.lessonBudget(deep, [{}]), 22500);
  const t = B.tightenPrompt("x", 20000, 15000);
  assert.match(t, /It has 20000 words; its budget is 15000/);
  assert.match(t, /never remove or thin a definition/);
  assert.match(t, /Cut, in this order: side topics that describe or survey without a mechanism, a number or a decision/);
  assert.match(t, /background the reader needs to follow is not a side topic/);
  assert.match(B.BOOK_PLAN(2), /Background the reader needs to follow the argument[^.]*is depth/);
  assert.match(B.outlineCheckPrompt(o, "L"), /10\. Depth/);
});

test("form (10.11): a chapter with no thread, a dense subsection and a subsection with no visual are found", () => {
  const o = B.normalizeOutline({
    known: [],
    chapters: [
      {
        n: 4,
        title: "השדה באתר",
        question: "q",
        sections: [
          { n: "4.1", title: "a", question: "q", from_prev: "", needs: [], visuals: ["svg: גל"], defines: [{ term: "שדה מגנטי", mark: "s" }, { term: "פאזה", mark: "s" }, { term: "ערך אפקטיבי", mark: "s" }] },
          { n: "4.2", title: "b", question: "q", from_prev: "4.1", needs: [], visual: "chart: S מול E", defines: ["a", "b", "c", "d", "e"] },
          { n: "4.3", title: "c", question: "q", from_prev: "4.2", needs: [], defines: [] },
        ],
      },
    ],
  });
  const p = B.formProblems(o);
  assert.deepEqual(p.map((x) => `${x.where}:${x.kind}`), ["4:thread", "4.1:density", "4.1:depth", "4.1:depth", "4.2:density", "4.2:depth", "4.2:depth", "4.3:visual", "4.3:depth", "4.3:depth"]);
  // a plan written before 10.11 (a single "visual") still counts as one visual, once
  assert.deepEqual(o.chapters[0].sections[1].visuals, ["chart: S מול E"]);
  assert.match(B.outlineText(o, ["4.2"]), /visuals: chart: S מול E/);
  const good = B.normalizeOutline({ known: [], chapters: [{ n: 1, title: "t", question: "q", thread: "מבעיה ליכולת", sections: [{ n: "1.1", title: "a", question: "q", from_prev: "", needs: [], visuals: ["svg: x"], depth: "לגזור את f ולחשב את הערך שלה", words: 1800, defines: [{ term: "x", mark: "s" }, { term: "f(x)", mark: "s" }] }] }] });
  assert.deepEqual(B.formProblems(good), []);
});

test("depth (21.11): words beyond what a subsection's depth needs are found", () => {
  const o = B.normalizeOutline({ known: [], chapters: [{ n: 1, title: "t", question: "q", thread: "מבעיה ליכולת", sections: [
    { n: "1.1", title: "a", question: "q", from_prev: "", needs: [], visuals: ["svg: x"], depth: "לגזור את f מתוך g", words: 2600, defines: [{ term: "x", mark: "s" }] },
    { n: "1.2", title: "b", question: "q", from_prev: "1.1", needs: [], visuals: ["svg: y"], depth: "להשוות שתי חלופות במספרים", words: 1400, defines: [] },
    { n: "1.3", title: "c", question: "q", from_prev: "1.2", needs: [], visuals: ["svg: z"], depth: "לחשב את f בנקודה אחת", words: 900, defines: [] },
  ] }] });
  assert.deepEqual(B.formProblems(o).map((x) => `${x.where}:${x.kind}`), ["1.1:depth", "1.2:depth"]);
  assert.equal(o.chapters[0].sections[1].depth, "להשוות שתי חלופות במספרים");
});

test("ledger: an iou counts as defined for order; an assumption or iou not settled later is reported", () => {
  const o = B.normalizeOutline({
    known: [],
    chapters: [{ n: 4, title: "t", question: "q", anchor: "מיקרוסקופ", sections: [
      { n: "4.1", title: "a", question: "q", from_prev: "", needs: ["זמן הקריסה"], defines: [], iou: [{ result: "זמן הקריסה", derived_in: "4.2" }], assumptions: [{ text: "v≪c", settled_in: "4.2" }] },
      { n: "4.2", title: "b", question: "q", from_prev: "4.1", needs: ["זמן הקריסה"], defines: [{ term: "eV", mark: "s" }], assumptions: [{ text: "מסלול מעגלי", settled_in: "4.1" }], iou: [{ result: "E(r)", derived_in: "" }] },
    ] }],
  });
  const p = B.orderProblems(o);
  assert.deepEqual(p.filter((x) => x.kind === "order"), []);
  assert.deepEqual(p.filter((x) => x.kind === "ledger").map((x) => x.where), ["4.2", "4.2"]);
  assert.match(B.outlineText(o, ["4.1"]), /anchor: מיקרוסקופ[\s\S]*assumptions: v≪c → 4\.2[\s\S]*iou: זמן הקריסה → 4\.2/);
});

// 21.11, the depth check: the saved plans of the bench (profile/bench, *-plan-lite), shortened
const saved = JSON.parse(readFileSync(new URL("./samples/plan-depth-2111.json", import.meta.url), "utf8"));

test("tighten (21.11): one pass cuts at most 20%; a lesson still over 1.3 times its budget is a split candidate", () => {
  // the full Lanchester lesson: 22,899 words against 8,900 was sent to 8,900 in one pass
  assert.equal(B.tightenTarget(22899, 8900), 18320);
  assert.equal(B.tightenTarget(10000, 9000), 9000);
  assert.equal(B.tightenFloor(22899), 17174);
  assert.ok(B.splitCandidate(18320, 8900));
  assert.ok(!B.splitCandidate(11000, 8900));
  assert.ok(!B.splitCandidate(5000, 0));
});

test("depth (21.11): a verb of the closed list and its product, or background that names the step it enables", () => {
  const o = B.normalizeOutline(saved.outline);
  const flagged = B.formProblems(o).filter((p) => p.kind === "depth" && /"depth"/.test(p.problem)).map((p) => p.where);
  // "תקציב קשר מקצה לקצה" names no verb; "לחשב λ", "חסם", "MeV" are too short to name a product
  assert.deepEqual(flagged, ["4.4", "5.2", "5.3", "6.1", "6.2"]);
  for (const d of ["לגזור את L_s = (4πd/λ)² משטח אפקטיבי", "להחליט בין הספק לאנטנה לפי 6 dB = פי 2", "מחשב EIRP ורמת קליטה בתקציב", "לעקוב אחרי המנגנון של הדעיכה 1/r²", "to derive the far-field condition 2D²/λ", "רקע ל-2.4: מה זה שדה, כדי לחשב בו את הכוח"])
    assert.equal(B.depthProblem(d), "", d);
  for (const d of ["נכתב", "", "להבין מהו גל ואיך הוא נראה", "סקירה של תחומי המדע"]) assert.notEqual(B.depthProblem(d), "", d);
  // a plan that writes only the missing part of a lesson marked its written subsections "נכתב" (Lanchester M0.2 lesson 1)
  const w = B.normalizeOutline({ known: [], chapters: [{ n: 1, title: "t", question: "q", thread: "t", sections: [{ n: "1.1", title: "a (נכתב)", question: "q", from_prev: "", needs: [], defines: [], depth: "נכתב", visuals: ["svg"] }] }] });
  const kinds = B.formProblems(w).map((p) => p.problem);
  assert.ok(kinds.some((p) => /names no verb/.test(p)));
  assert.ok(kinds.some((p) => /no "words"/.test(p)));
  assert.match(B.BOOK_PLAN(1), /one verb of the closed list/);
  assert.match(B.BOOK_PLAN(1), /even when the course memory or the lesson's focus says part of it was written before/);
  assert.match(B.outlineCheckPrompt(o, "t"), /names a verb of the closed list|does not name a verb of the closed list/);
});

test("budget from the checked plan (21.11): every subsection is in a part, and the budget is what the parts write", () => {
  const o = B.normalizeOutline(saved.outline);
  // as planned, chapters 5 and 6 were in no part: they would never be written, and the budget counted only chapter 4
  assert.deepEqual(B.coverProblems(o, saved.parts).map((p) => p.where), ["5.1", "5.2", "5.3", "6.1", "6.2"]);
  assert.equal(B.lessonBudget(o, saved.parts), 2700 + 2500);
  const parts = B.coverParts(o, saved.parts);
  assert.deepEqual(parts.map((p) => p.sections), [["4.1", "4.2", "4.4"], ["5.1", "5.2", "5.3"], ["6.1", "6.2"]]);
  assert.match(parts[1].title, /^פרק 5/);
  assert.deepEqual(B.coverProblems(o, parts), []);
  assert.equal(B.lessonBudget(o, parts), 6100 + 2500);
  // a subsection left out inside a covered chapter goes to the part of the one before it, in order
  assert.deepEqual(B.coverParts(o, [{ title: "a", covers: "", sections: ["4.1", "4.4", "5.1", "5.2", "5.3", "6.1", "6.2"] }]).map((p) => p.sections), [["4.1", "4.2", "4.4", "5.1", "5.2", "5.3", "6.1", "6.2"]]);
  // the fix round keeps the checked words where the fixed outline left them out; "1,200" and "1200–1500" are read as numbers
  const fixed = B.normalizeOutline({ ...saved.outline, chapters: saved.outline.chapters.map((c) => ({ ...c, sections: c.sections.map((s) => ({ ...s, words: s.n === "4.1" ? undefined : s.n === "4.2" ? "1,200" : s.words })) })) });
  const kept = B.keepWords(o, fixed);
  assert.equal(B.partWords(kept, ["4.1", "4.2"]), 900 + 1200);
  assert.equal(B.wordsOf("1200–1500"), 1200);
  assert.equal(B.wordsOf("~900"), 900);
  assert.equal(B.wordsOf(NaN), 0);
  // the writer gets each subsection's words
  assert.match(B.BOOK_PART(o, ["5.1", "5.2"], false, false), /5\.1 ≈800, 5\.2 ≈700; this part about 1500 words in all/);
});
