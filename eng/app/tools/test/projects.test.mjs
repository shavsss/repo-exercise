// Unit tests of the standards comparison (src/standards.ts), the research proposals (src/projects.ts), the pre-mortem
// count (caseDoc.ts), the ideas that join a project (ideas.ts) and the prompts that carry them (casePrompt.ts,
// bookRules.ts). Same file in both apps.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const S = await load("../../src/standards.ts");
const P = await load("../../src/projects.ts");
const D = await load("../../src/caseDoc.ts");
const I = await load("../../src/ideas.ts");
const CP = await load("../../src/casePrompt.ts");
const B = await load("../../src/bookRules.ts");
const C = await load("../../src/caseBlock.ts");

test("every stage and every close target has a published standard with its source, link and certainty", () => {
  for (const t of [...C.CASE_STAGES, "adr", "doc", "review"]) {
    const list = S.standardsFor(t);
    assert.ok(list.length >= 1, t);
    for (const s of list) {
      assert.ok(s.name && s.source && /^https:\/\//.test(s.url), `${t}: ${s.id}`);
      assert.ok(["גבוהה", "בינונית–גבוהה", "בינונית"].includes(s.certainty), s.id);
      assert.ok(s.items.length >= 2, s.id);
    }
  }
  // the checked findings: Nygard has Status; the PDR criteria are NPR 7123.1 G-6, not the handbook's purpose column
  assert.ok(S.STANDARDS.nygard.items.some((i) => /Status/.test(i.text)));
  assert.match(S.STANDARDS["nasa-pdr"].source, /G-6/);
  assert.ok(S.STANDARDS["nasa-pdr"].items.every((i) => /^G-6 #\d+$/.test(i.ref)));
  assert.match(S.STANDARDS["nasa-pdr"].differs, /עמודת המטרה/);
  assert.match(S.STANDARDS.roofline.differs, /אנלוגיה/);
  assert.ok(S.STANDARDS["nasa-req"].items.some((i) => /Owner/.test(i.text)));
  assert.ok(S.STANDARDS["nasa-req"].items.some((i) => /Verification method/.test(i.text)));
});

test("parseStdChecks reads the reviewer's JSON, in the list's order, and drops a garbled standard", () => {
  const list = S.standardsFor("adr");
  const [ny, ma] = list;
  const raw = `הנה:\n\`\`\`json\n{"checks": [{"id": "madr", "marks": ["yes","part","no","yes","no"], "gap": "אין Confirmation"}, {"id": "nygard", "marks": ["כן","חלקי","לא","no","yes"], "gap": "חסר סטטוס"}]}\n\`\`\``;
  const got = S.parseStdChecks(raw, list, 5);
  assert.equal(got[0].id, ny.id);
  assert.deepEqual(got[0].marks, ["yes", "part", "no", "no", "yes"]);
  assert.equal(got[0].gap, "חסר סטטוס");
  assert.equal(got[0].by, "model");
  assert.equal(got[1].id, ma.id);
  // a wrong number of marks, or an unknown mark, is not a check
  const bad = S.parseStdChecks(`{"checks": [{"id": "nygard", "marks": ["yes"]}, {"id": "madr", "marks": ["yes","maybe","no","yes","no"]}]}`, list);
  assert.deepEqual(bad, [null, null]);
  assert.deepEqual(S.parseStdChecks("no json here", list), [null, null]);
});

test("a check: the learner cycles a mark, the score counts a part as a half, the missing items are named", () => {
  const st = S.STANDARDS.premortem;
  let k = S.selfCheck(st, 1);
  assert.deepEqual(k.marks, ["no", "no", "no", "no"]);
  k = S.cycleMark(k, 0);
  assert.equal(k.marks[0], "part");
  k = S.cycleMark(S.cycleMark(k, 0), 1);
  assert.deepEqual(k.marks.slice(0, 2), ["yes", "part"]);
  assert.equal(k.by, "self");
  const sc = S.stdScore(k);
  assert.deepEqual([sc.met, sc.part, sc.missing], [1, 1, 2]);
  assert.equal(sc.share, 1.5 / 4);
  const miss = S.stdMissing(k, st);
  assert.equal(miss.length, 3);
  assert.match(miss[0], /\(חלקי\)$/);
  assert.match(miss[0], /^Pre-mortem של Klein: /);
});

test("pre-mortem: his own reasons, one per line, counted before the red team joins", () => {
  assert.equal(D.PREMORTEM_MIN, 3);
  const text = `- החזרי קרקע מסתירים רחפן נמוך\n2. ציפורים מציפות את המפעיל בהתרעות\n* קצר\n\nהאנטנה מתחממת בקיץ ומאבדת רווח`;
  assert.deepEqual(D.premortemReasons(text), ["החזרי קרקע מסתירים רחפן נמוך", "ציפורים מציפות את המפעיל בהתרעות", "האנטנה מתחממת בקיץ ומאבדת רווח"]);
});

test("extractSources and debriefPart", () => {
  const s = P.extractSources([
    "הגבול [[B12:57]] ו-[[B12:57]] שוב (מקור: Skolnik, Radar Handbook, 2008)",
    "[[מקור: Roofline | https://example.org/r.pdf]] וגם [[ודאות: גבוהה]] ו-[[E03:120-121]]",
  ]);
  assert.deepEqual(s, ["Skolnik, Radar Handbook, 2008", "עמוד מקור B12:57", "[Roofline](https://example.org/r.pdf)", "עמוד מקור E03:120-121"]);
  const deb = `**מה עבד**\nא.\n\n**ההחלטה החשובה שהוחמצה**\nהבדלה בין רחפן לציפור.\nשורה שנייה.\n\n**מה לוקחים הלאה**\n1. ספר פערים.`;
  assert.equal(P.debriefPart(deb, "ההחלטה החשובה שהוחמצה"), "הבדלה בין רחפן לציפור.\nשורה שנייה.");
  assert.equal(P.debriefPart(deb, "מה לוקחים הלאה"), "1. ספר פערים.");
  assert.equal(P.debriefPart(deb, "אין כזה"), "");
});

const caseBlock = {
  id: "M5.2-3-case",
  title: "מכ\"ם לרחפנים",
  brief: "בסיס קדמי (מקור: דוח הבסיס, 2026).",
  stages: ["1", "6", "7", "8"],
  notes: [{ stage: "1", anchors: ["נתון [[B12:41]]"] }],
};
const doc = {
  caseId: "M5.2-3-case",
  title: "x",
  stages: {
    "1": { phase: "closed", proposal: "", turns: [], commit: { decision: "דרישה של 10 ק\"מ", confidence: 70, at: 1 }, grade: "right", expert: "גזרת מזמן ההתרעה [[B12:41]]", assumptions: [{ text: "מהירות 30 מ'/ש'" }, { text: "נבדקה", closed: true }], std: [{ id: "nasa-req", marks: ["yes", "yes", "no", "part"], gap: "", by: "model", at: 1 }] },
    "6": { phase: "closed", proposal: "", turns: [], commit: { decision: "clutter הוא הכשל המוביל", confidence: 60, at: 2 } },
    "7": { phase: "closed", proposal: "", turns: [], commit: { decision: "ניסוי שדה: התרעות שווא מעל 1 לשעה הורגות", confidence: 70, at: 3 } },
    "8": { phase: "closed", proposal: "", turns: [], commit: { decision: "מכ\"ם פסיבי על סלולר", confidence: 40, at: 4 } },
  },
  adr: { context: "c", decision: "d", alternatives: "a", consequences: "q", reversal: "איום מהיר פי 2", dissent: "הצוות האדום: clutter", at: 5 },
  debrief: "**ההחלטה החשובה שהוחמצה**\nהבדלה מציפורים.\n\n**מה לוקחים הלאה**\nא.",
  updatedAt: 5,
};
const ideas = [
  { id: "i1", text: "מכ\"ם פסיבי על סלולר", moduleId: "M5.2", lesson: 2, caseId: "M5.2-3-case", stage: "8", status: "seed", at: 1 },
  { id: "i2", text: "אחר", moduleId: "M5.1", lesson: 0, caseId: "M5.1-1-case", status: "seed", at: 1 },
];

test("buildProposal: the question, the decisions with confidence, what stayed open, his ideas, the sources, the experiments", () => {
  const p = P.buildProposal(caseBlock, doc, { moduleId: "M5.2", lesson: 2, lessonTitle: "משוואת המכ\"ם", ideas, now: 100 });
  assert.equal(p.id, "p-M5.2-3-case");
  assert.equal(p.status, "proposal");
  assert.match(p.question, /^מכ"ם לרחפנים: דרישה של 10 ק"מ$/);
  assert.deepEqual(p.decisions.map((d) => [d.stage, d.confidence]), [["1", 70], ["6", 60], ["7", 70], ["8", 40]]);
  assert.equal(p.decisions[0].grade, "right");
  assert.ok(p.open.some((x) => x === "מה יהפוך את ההחלטה: איום מהיר פי 2"));
  assert.ok(p.open.some((x) => /^התנגדות שנשארה: /.test(x)));
  assert.ok(p.open.some((x) => x === "ההחלטה שהוחמצה: הבדלה מציפורים."));
  assert.ok(p.open.some((x) => /מהירות 30/.test(x)));
  assert.ok(!p.open.some((x) => /: נבדקה$/.test(x)), "a checked assumption is not open");
  assert.ok(p.open.some((x) => /^מול הסטנדרט: .*Traced from/.test(x)));
  assert.ok(p.open.some((x) => /Verification method.*\(חלקי\)/.test(x)));
  // the stage-8 idea is already in the store: kept once, with its id; another case's idea is not his here
  assert.deepEqual(p.ideas, [{ id: "i1", text: "מכ\"ם פסיבי על סלולר" }]);
  assert.deepEqual(p.experiments, ["ניסוי שדה: התרעות שווא מעל 1 לשעה הורגות"]);
  assert.ok(p.sources.includes("דוח הבסיס, 2026"));
  assert.ok(p.sources.includes("עמוד מקור B12:41"));
  assert.ok(p.sources.some((s) => /^\[NASA .*טבלה 4\.2-2.*\]\(https:\/\/www\.nasa\.gov\//.test(s)), "the standards of the committed stages are sources too, as links");
  assert.ok(p.sources.some((s) => /Nygard/.test(s)));
  assert.equal(p.createdAt, 100);
});

test("buildProposal: the model's sharpening wins; a remake keeps his notes, status and dates", () => {
  const prev = { ...P.buildProposal(caseBlock, doc, { moduleId: "M5.2", lesson: 2, lessonTitle: "", ideas: [], now: 10 }), status: "active", startedAt: 20, notes: [{ at: 30, text: "חשבתי שוב" }] };
  const enrich = P.parseProposalEnrich(`{"question": "האם מכ\\"ם פסיבי מגלה רחפן ב-10 ק\\"מ?", "open": ["כמה clutter בעיר"], "experiments": ["מדידת RCS בפס 1.8 GHz", 5]}`);
  assert.deepEqual(enrich, { question: "האם מכ\"ם פסיבי מגלה רחפן ב-10 ק\"מ?", open: ["כמה clutter בעיר"], experiments: ["מדידת RCS בפס 1.8 GHz"] });
  const p = P.buildProposal(caseBlock, doc, { moduleId: "M5.2", lesson: 2, lessonTitle: "", ideas: [], enrich, prev, now: 40 });
  assert.equal(p.question, enrich.question);
  assert.equal(p.open[0], "כמה clutter בעיר");
  assert.equal(p.experiments[0], "מדידת RCS בפס 1.8 GHz");
  assert.equal(p.experiments.length, 2);
  assert.equal(p.status, "active");
  assert.equal(p.startedAt, 20);
  assert.equal(p.createdAt, 10);
  assert.equal(p.updatedAt, 40);
  assert.deepEqual(p.notes, prev.notes);
  // with no idea in the store, the stage-8 decision is his idea
  assert.deepEqual(p.ideas, [{ id: "", text: "מכ\"ם פסיבי על סלולר" }]);
  assert.equal(P.parseProposalEnrich("not json"), null);
});

test("notes, status, the budget and the planner's list", () => {
  let p = P.buildProposal(caseBlock, doc, { moduleId: "M5.2", lesson: 2, lessonTitle: "", ideas: [], now: 1 });
  p = P.addNote(p, "  מחשבה חדשה  ", 50);
  assert.deepEqual(p.notes, [{ at: 50, text: "מחשבה חדשה" }]);
  const a = P.setStatus(p, "active", 60);
  assert.equal(a.startedAt, 60);
  const c = P.setStatus(a, "closed", 70);
  assert.deepEqual([c.status, c.startedAt, c.closedAt], ["closed", 60, 70]);
  assert.equal(P.setStatus(c, "active", 80).closedAt, undefined);
  assert.equal(P.setStatus(c, "active", 80).startedAt, 60, "a reopened project keeps its first start");
  // over the budget: the oldest notes shorten first, then go
  const big = { ...p, notes: Array.from({ length: 80 }, (_, i) => ({ at: i, text: "א".repeat(3000) })) };
  const fit = P.fitProject(big, 100_000);
  assert.ok(new TextEncoder().encode(JSON.stringify(fit)).length <= 100_000);
  assert.equal(fit.notes.at(-1).at, 79);
  assert.equal(P.fitProject(p), p);
  // the planner sees open proposals and active projects, active first; closed ones not
  const list = P.projectsForPrompt([
    { ...p, id: "a", status: "proposal", updatedAt: 9, question: "שאלה א" },
    { ...p, id: "b", status: "active", updatedAt: 1, question: "שאלה ב" },
    { ...p, id: "c", status: "closed", updatedAt: 10, question: "שאלה ג" },
  ]);
  const lines = list.split("\n");
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^- \[פרויקט פעיל, M5\.2 שיעור 3\] שאלה ב · פתוח: /);
  assert.match(lines[1], /^- \[הצעת מחקר/);
});

test("the store: one document per proposal, loaded newest first; starting it marks its ideas as projects", async () => {
  const docs = {};
  const store = {
    listProjects: async () => Object.values(docs),
    saveProject: async (id, d) => void (docs[id] = d),
    loadIdeas: async () => docs.__ideas ?? null,
    saveIdeas: async (d) => void (docs.__ideas = d),
  };
  const p = P.buildProposal(caseBlock, doc, { moduleId: "M5.2", lesson: 2, lessonTitle: "", ideas, now: 5 });
  await P.saveProject(store, p);
  await P.saveProject(store, { ...p, id: "p-other", caseId: "x", updatedAt: 9 });
  const all = await P.loadProjects({ ...store, listProjects: async () => Object.entries(docs).filter(([k]) => k !== "__ideas").map(([, v]) => v).concat([{ junk: 1 }]) });
  assert.deepEqual(all.map((x) => x.id), ["p-other", "p-M5.2-3-case"]);
  assert.deepEqual(await P.loadProjects(null), []);
  docs.__ideas = { items: ideas };
  const after = await I.markIdeasProject(store, ["i1"], p.id);
  assert.deepEqual(after.map((i) => [i.id, i.status, i.projectId]), [["i1", "project", p.id], ["i2", "seed", undefined]]);
});

test("the prompts: the standard check lists every item with its id; the red team follows his own reasons; the spec says so", () => {
  const list = S.standardsFor("1");
  const sp = CP.standardPrompt({ title: "ת", what: "שלב 1", work: "ההצעה", standards: list });
  for (const s of list) assert.ok(sp.includes(`id="${s.id}"`));
  assert.match(sp, /"checks"/);
  assert.match(CP.reviewPrompt({ title: "t", brief: "b", stageName: "s", role: "צוות אדום", ask: "a", earlier: "", memory: "", thread: "x", anchors: [], focus: CP.STAGE_FOCUS["6"] }), /כבר כתב בעצמו את סיבות הכישלון/);
  assert.match(CP.reviewPrompt({ title: "t", brief: "b", stageName: "s", role: "בעל הדרישה", ask: "a", earlier: "", memory: "", thread: "x", anchors: [], focus: CP.STAGE_FOCUS["1"] }), /<review_focus[^>]*>.*בעלים/);
  const pp = CP.proposalPrompt({ title: "t", brief: "b", decisions: "d", adr: "a", debrief: "", open: ["o"], ideas: [] });
  assert.match(pp, /"question"/);
  assert.match(pp, /<open_so_far>/);
  assert.doesNotMatch(pp, /<his_ideas>/);
  const part = B.CASE_PART("M1-1-case", undefined, "example");
  assert.match(part, /OUR OWN/);
  assert.match(part, /pre-mortem as Klein runs it/);
  assert.match(part, /verification/i);
  assert.match(B.CASE_PLAN(), /<research_proposals>/);
});
