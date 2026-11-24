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

test("the word budget: planned words, a word count, and no tightening or splitting", () => {
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
  // a long topic is never split for its length, and the case study is depth (21.11, the learner's decisions)
  assert.match(B.BOOK_PLAN(2), /a long lesson is never split for its length/);
  assert.match(B.BOOK_PLAN(2), /The case study is depth/);
  assert.doesNotMatch(B.BOOK_PLAN(2), /two lessons|at most about 900 words/);
  assert.doesNotMatch(B.BOOK_PART(o, ["2.1"], true, false), /900 words/);
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

test("the plan the parts write (21.11): every subsection is in a part, the words survive the fix, and one ledger for the lesson", () => {
  const o = B.normalizeOutline(saved.outline);
  // as planned, chapters 5 and 6 were in no part: they would never be written, and the budget counted only chapter 4
  assert.deepEqual(B.coverProblems(o, saved.parts).map((p) => p.where), ["5.1", "5.2", "5.3", "6.1", "6.2"]);
  assert.equal(B.partWords(o, B.writtenSections(o, saved.parts)), 2700);
  const parts = B.coverParts(o, saved.parts);
  assert.deepEqual(parts.map((p) => p.sections), [["4.1", "4.2", "4.4"], ["5.1", "5.2", "5.3"], ["6.1", "6.2"]]);
  assert.match(parts[1].title, /^פרק 5/);
  assert.deepEqual(B.coverProblems(o, parts), []);
  assert.equal(B.partWords(o, B.writtenSections(o, parts)), 6100);
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
  // the ledger: every part sees what the parts before wrote against their plan (2700 for chapter 4), so overruns never add up
  assert.match(B.ledger(o, ["5.1"], 3400), /about 3400 words written, against 2700 planned[^.]*\. That is 700 over: write this part tighter/);
  assert.match(B.ledger(o, ["5.1"], 2800), /That is on plan/);
  assert.match(B.ledger(o, ["5.1"], 2000), /under the plan: give the core subsections their full planned depth/);
  assert.match(B.ledger(o, ["4.1"], 0), /The whole lesson is planned at about 6100 words/);
  assert.match(B.BOOK_PART(o, ["5.1"], false, false, false, 3400), /700 over/);
  // roles and keys: the writer of a later part sees the weight of every subsection and the key of the earlier ones
  const r = B.normalizeOutline({ known: [], chapters: [{ n: 1, title: "t", question: "q", sections: [
    { n: "1.1", title: "a", question: "q1", from_prev: "", needs: [], defines: [], words: 1500, role: "core", key: ["$L_s=(4\\pi d/\\lambda)^2$"] },
    { n: "1.2", title: "b", question: "q2", from_prev: "", needs: [], defines: [], words: 600, role: "support: 1.3", key: ["x = 3"] },
    { n: "1.3", title: "c", question: "q3", from_prev: "", needs: [], defines: [], words: 900, role: "background: 1.4", key: 7 },
  ] }] });
  const txt = B.outlineText(r, ["1.2"]);
  assert.match(txt, /1\.1 a — q1 \[core, ≈1500\] \| key: \$L_s/);
  assert.match(txt, /role: support: 1\.3\n    words: about 600\n    key: x = 3/);
  assert.match(txt, /1\.3 c — q3 \[background: 1\.4, ≈900\]$/m);
  assert.deepEqual(r.chapters[0].sections[2].key, []);
  assert.match(B.BOOK_PART(r, ["1.2"], false, false), /never derive or tell again what they established/);
});

test("a plan whose JSON broke on LaTeX backslashes is read (22.11: the raw plan was shown as the lesson)", () => {
  // what the model wrote: single backslashes in LaTeX, next to a valid escaped backslash, quote and \u escape
  const raw = String.raw`{"parts": [{"title": "חלק 1", "sections": ["1.1"]}], "outline": {"key": ["$R = c\Delta T/2$", "$\lambda f = c$", "$\frac{1}{2}$", "a\\b", "\"q\"", "א"]}}`;
  assert.throws(() => JSON.parse(raw));
  const p = B.planFromText({ code: "invalid_json", text: `Here is the plan:\n${raw}\n` });
  assert.deepEqual(p.outline.key, ["$R = c\\Delta T/2$", "$\\lambda f = c$", "$\\frac{1}{2}$", "a\\b", '"q"', "א"]);
  assert.equal(B.planFromText({ text: "no json here" }), null);
  assert.equal(B.planFromText({ text: '{"outline": {}}' }), null);
  // the example in the plan's instructions reaches the model with doubled backslashes
  assert.match(B.BOOK_PLAN(1), /"\$L_s = \(4\\\\pi d\/\\\\lambda\)\^2\$"/);
});

// 24.11: Gilua M0.2 lesson 3 (Feynman ch. 3, ten survey pages) was written as 31,000 words, every stop developed in full.
test("scope: an overview develops only its central ideas; the other stops stay short", () => {
  const sec = (n, role, words, mark = "a") => ({ n, title: n, question: "q", from_prev: "", needs: [], defines: [{ term: `t${n}`, mark }], role, words });
  const real = (scope) =>
    B.normalizeOutline({
      known: [],
      scope,
      chapters: [
        { n: 6, title: "", question: "", sections: [sec("6.1", "core", 1420, "s"), sec("6.2", "core", 1947, "s"), sec("6.3", "core", 3531, "s"), sec("6.4", "core", 2442, "s"), sec("6.5", "core", 1797, "s"), sec("6.6", "core", 1053)] },
        { n: 7, title: "", question: "", sections: [sec("7.1", "support: 7.8", 2324, "s"), sec("7.5", "background: 7.8", 1898), sec("7.9", "anchor: M15.1", 1400)] },
      ],
    });
  assert.deepEqual(B.scopeProblems(real(undefined)).map((x) => x.kind), ["scope"]);
  const over = { kind: "overview", central: ["לדעת את החוקים מול לחזות את התוצאה"] };
  const p = B.scopeProblems(real(over)).map((x) => `${x.where}:${x.problem.slice(0, 12)}`);
  assert.ok(p.some((x) => x.startsWith("outline:6 core")), p.join(" | "));
  assert.ok(p.some((x) => x.startsWith("7.1:a stop")), "an s definition in a stop");
  assert.ok(p.some((x) => x.startsWith("7.1:2324")) && p.some((x) => x.startsWith("7.5:1898")), "a stop over a supporting idea's words");
  assert.deepEqual(B.scopeProblems(real({ kind: "development", central: ["x"] })), []);
  const a = B.anchorProblems(real(over), ["M15.1"]);
  assert.deepEqual(a.map((x) => x.where), ["7.9"]);
  assert.match(a[0].problem, /1400 words for an anchor/);
  assert.equal(B.anchorProblems(real(over), []).length, 2, "an anchor that names no later module");
});
