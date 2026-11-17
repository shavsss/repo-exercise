// Unit tests of the case room's pure logic: the work document (src/caseDoc.ts), the prompts (src/casePrompt.ts)
// and the model call with its fallback (src/sampleRun.ts). Same file in both apps.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, format: "esm", write: false, platform: "node", logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const D = await load("../../src/caseDoc.ts");
const P = await load("../../src/casePrompt.ts");
const S = await load("../../src/sampleRun.ts");

const rubric = [
  { text: "decisive", decisive: true },
  { text: "a", decisive: false },
  { text: "b", decisive: false },
  { text: "c", decisive: false },
];

test("confidence in % as the three calibration levels", () => {
  assert.equal(D.confLevel(0), 1);
  assert.equal(D.confLevel(49), 1);
  assert.equal(D.confLevel(50), 2);
  assert.equal(D.confLevel(79), 2);
  assert.equal(D.confLevel(80), 3);
  assert.equal(D.confLevel(100), 3);
});

test("rubric grade: the decisive item weighs most", () => {
  assert.equal(D.rubricGrade(rubric, [true, true, true, false]), "right");
  assert.equal(D.rubricGrade(rubric, [true, false, false, false]), "partial");
  assert.equal(D.rubricGrade(rubric, [false, true, true, false]), "partial");
  assert.equal(D.rubricGrade(rubric, [false, true, false, false]), "wrong");
  assert.equal(D.rubricGrade([{ text: "only", decisive: true }], [true]), "right");
});

test("expert text: the verdict line is parsed and removed", () => {
  const p = D.parseExpert("נימוק.\n\nעוד.\n<<מחוון: כן, לא, 3=כן, לא>>", 4);
  assert.equal(p.body, "נימוק.\n\nעוד.");
  assert.deepEqual(p.met, [true, false, true, false]);
  const none = D.parseExpert("נימוק בלי שורה\n<<מחוו", 2);
  assert.equal(none.met, null);
  assert.equal(none.body, "נימוק בלי שורה");
});

test("rubric follow-up: the verdict line is found wherever it stands; none → null", () => {
  assert.deepEqual(D.parseVerdicts("<<מחוון: כן, לא, כן, כן>>", 4), [true, false, true, true]);
  assert.deepEqual(D.parseVerdicts("הנה:\n<<מחוון: 1. כן; 2. לא>>\nזהו.", 3), [true, false, false]);
  assert.deepEqual(D.parseVerdicts("<<מחוון: לא>> ואחר כך <<מחוון: כן, כן>>", 2), [true, true]);
  assert.equal(D.parseVerdicts("כן, לא, כן", 3), null);
  // the expert text without its line: the body stays whole and the verdicts are null, so the room asks again
  const e = D.parseExpert("נימוק המומחה בלי שורת מחוון.", 3);
  assert.equal(e.met, null);
  assert.equal(e.body, "נימוק המומחה בלי שורת מחוון.");
  const v = P.verdictPrompt({ thread: "הצעה", commit: "החלטה (ביטחון 70%)", expert: "נימוק", rubric });
  assert.match(v, /<rubric>\n1\. \[מכריע\] decisive/);
  assert.match(v, /4 ערכים/);
  assert.match(v, /בלי שום טקסט נוסף/);
});

test("review text: number and assumption tags go to the ledger", () => {
  const r = D.parseReview("הערה.\n<<מספר: R = 16.8 km (גבול)>>\n<<הנחה: RCS קבוע>>\n<<מספר: L = 6 dB>>\n<<הנחה: חלק");
  assert.equal(r.body, "הערה.");
  assert.deepEqual(r.numbers, ["R = 16.8 km (גבול)", "L = 6 dB"]);
  assert.deepEqual(r.assumptions, ["RCS קבוע"]);
});

test("stages: current, section status, doc status", () => {
  const c = { stages: ["1", "2", "3"] };
  const d = { caseId: "x", title: "", stages: {}, updatedAt: 0 };
  assert.equal(D.currentStage(c, d), "1");
  assert.equal(D.docStatus(c, d), "draft");
  d.stages["1"] = { phase: "closed", proposal: "", turns: [] };
  d.stages["2"] = { phase: "expert", proposal: "", turns: [] };
  assert.equal(D.currentStage(c, d), "2");
  assert.equal(D.sectionStatus(d.stages["2"]), "review");
  assert.equal(D.sectionStatus(undefined), "open");
  assert.equal(D.docStatus(c, d), "review");
  assert.equal(D.closedCount(c, d), 1);
  d.stages["2"].phase = "closed";
  d.stages["3"] = { phase: "closed", proposal: "", turns: [] };
  assert.equal(D.currentStage(c, d), null);
  assert.equal(D.docStatus(c, d), "review");
  d.adr = { context: "", decision: "", alternatives: "", consequences: "", reversal: "", at: 1 };
  assert.equal(D.docStatus(c, d), "approved");
});

test("numbers of the doc and the ADR", () => {
  assert.equal(D.docNumber("M5.2-3-case"), "DD-M5.2-3");
  assert.equal(D.adrNumber("M5.2-3-case"), "ADR-M5.2-003");
  assert.equal(D.adrNumber("odd"), "ADR-odd");
});

test("a compute cell's last value, rounded, for the ledger", () => {
  assert.equal(D.cellResult("N = 16  →  16\ngap_dB = 40 * log10(40 km / R16)  →  3.04952156685"), "gap_dB = 3.05");
  assert.equal(D.cellResult("R16 = R1 * N^(1/4)  →  33.56 km"), "R16 = 33.56 km");
  assert.equal(D.cellResult("x = 1/0  →  ERROR: bad"), "");
});

test("fitCase keeps a document under the budget, oldest turns first", () => {
  const big = "א".repeat(5000);
  const turns = Array.from({ length: 60 }, (_, i) => ({ id: `t${i}`, who: "reviewer", text: big, ts: i }));
  const d = { caseId: "x", title: "", stages: { 1: { phase: "review", proposal: "p", turns } }, updatedAt: 0 };
  const out = D.fitCase(d, 200_000);
  const bytes = new TextEncoder().encode(JSON.stringify(out)).length;
  assert.ok(bytes <= 200_000, `${bytes}`);
  assert.equal(out.stages[1].turns.at(-1).text, big, "the newest turn keeps its text");
  assert.equal(d.stages[1].turns[0].text, big, "the input is not changed");
  assert.equal(D.fitCase({ caseId: "x", title: "", stages: {}, updatedAt: 0 }).caseId, "x");
});

const ctx = { title: "t", brief: "brief", stageName: "§1 הבעיה", role: "צוות אדום", ask: "ask?", earlier: "", memory: "mem", thread: "thread" };

test("prompts: role, hidden notes, rubric line, debrief parts", () => {
  const r = P.reviewPrompt({ ...ctx, anchors: ["anchor one"] });
  assert.match(r, /הצוות האדום/);
  assert.match(r, /- anchor one/);
  assert.match(r, /<<מספר:/);
  assert.match(P.reviewPrompt({ ...ctx, role: "מהנדס בכיר", anchors: [] }), /מהנדס בכיר שסוקר/);
  const e = P.expertPrompt({ ...ctx, expert: "EXP", rubric, commit: "C", next: "§2 הגבול" });
  assert.match(e, /1\. \[מכריע\] decisive/);
  assert.match(e, /<<מחוון:/);
  assert.match(e, /השלב הבא \(§2 הגבול\)/);
  assert.match(P.computePrompt({ ...ctx, request: "R?" }), /<request>\nR\?/);
  const d = P.debriefPrompt({ title: "t", brief: "b", memory: "", stages: "s", adr: "a", decisions: ["k1"] });
  for (const h of ["**מה עבד**", "**איפה סטית**", "**ההחלטה החשובה שהוחמצה**", "**מה לוקחים הלאה**"]) assert.ok(d.includes(h), h);
  assert.ok(!d.includes("<course_memory"), "no empty memory");
});

test("sampleWithFallback: main, then the fallback on an error or an empty answer", async () => {
  const calls = [];
  const rt = (fail) => ({
    sample: async (_p, o) => {
      calls.push(o.model);
      if (fail(o.model)) throw new Error("x");
      return { text: o.model === "main" && fail.empty ? "" : `from ${o.model}`, truncated: false, modelApplied: o.model };
    },
  });
  assert.equal((await S.sampleWithFallback(rt(() => false), "p", "main", "fb", {})).text, "from main");
  assert.equal((await S.sampleWithFallback(rt((m) => m === "main"), "p", "main", "fb", {})).model, "fb");
  const empty = () => false;
  empty.empty = true;
  assert.equal((await S.sampleWithFallback(rt(empty), "p", "main", "fb", {})).text, "from fb");
  const a = new AbortController();
  a.abort();
  await assert.rejects(S.sampleWithFallback(rt((m) => m === "main"), "p", "main", "fb", { signal: a.signal }));
  const ran = [];
  const tool = S.computeTool((s, o, ok) => ran.push([s, ok]));
  assert.match(String(tool.execute({ script: "x = 2 * 3" }, {})), /6/);
  assert.deepEqual(ran, [["x = 2 * 3", true]]);
});
