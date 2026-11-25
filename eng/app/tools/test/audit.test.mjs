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

test("level: a lesson that stops above the mechanism is a fix, and the gap is shown as open", () => {
  const r = A.parseAudit('{"missing":[],"thin":[],"level":[{"topic":"בקרת עומס ב-TCP","heading":"2. אידוי","gap":"mechanism, cost","add":"מכונת המצבים slow start ו-AIMD, ותפוקה מול RTT ואובדן"}],"deferrals":[],"questions":[],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[],"verdict":"pass"}');
  assert.equal(r.verdict, "fix");
  assert.equal(A.problems(r), 1);
  assert.match(A.openItems(r)[0], /^רמה הנדסית: בקרת עומס ב-TCP \(mechanism, cost\)/);
  assert.match(A.auditPrompt({ lessonTitle: "t", moduleId: "M1.1", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], pages: "", text: lesson }), /7\. Engineering level/);
  // a reviewer that does not report the field (an older answer) still parses
  assert.deepEqual(A.parseAudit('{"verdict":"pass"}').level, []);
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
      reader: false,
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

const FIX = '{"missing":[],"thin":[],"deferrals":[],"questions":[],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[{"quote":"אידוי מקרר","fix":"אידוי מקרר את הנוזל"}],"verdict":"fix"}';
const PASS = '{"missing":[],"thin":[],"deferrals":[],"questions":[],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[],"verdict":"pass"}';
const input = { lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], pages: "", text: lesson };

test("the loop goes on until a review passes, and always ends on a review", async () => {
  const reviews = [FIX, FIX, PASS];
  const calls = [];
  const res = await A.auditAndRepair(input, "inplace", {
    reader: false,
    call: async (p, kind) => {
      calls.push(kind);
      if (kind === "audit") return reviews.shift();
      return calls.filter((k) => k === "repair").length === 1
        ? "<<<REPLACE>>>\nאידוי מקרר.\n<<<WITH>>>\nאידוי מקרר את הנוזל.\n<<<END>>>"
        : "<<<INSERT_AFTER_SECTION: 2. אידוי>>>\nעוד משפט.\n<<<END>>>";
    },
  });
  assert.deepEqual(calls, ["audit", "repair", "audit", "repair", "audit"]);
  assert.equal(res.mark.verdict, "fixed");
  assert.equal(res.mark.rounds, 3);
  assert.equal(res.mark.v, 2);
  assert.equal(res.mark.open, undefined);
});

test("a check that never passes stops after four reviews and stores what is open", async () => {
  let n = 0;
  const res = await A.auditAndRepair(input, "inplace", {
    reader: false,
    call: async (p, kind) => (kind === "audit" ? FIX : `<<<INSERT_AFTER_SECTION: 2. אידוי>>>\nמשפט ${++n}.\n<<<END>>>`),
  });
  assert.equal(res.mark.rounds, 4);
  assert.equal(res.mark.verdict, "partly");
  assert.ok(res.mark.open[0].startsWith("טעות:"));
});

test("a supplement that exists is edited inside, the read part never changes", async () => {
  const read = lesson;
  const text = `${read}\n\n## השלמה לשיעור\n\nפתיחה.\n\n### חום בעיבוי\nמשפט עם טעות.\n`;
  const raw = "<<<REPLACE>>>\nאידוי מקרר.\n<<<WITH>>>\nשונה!\n<<<END>>>\n<<<REPLACE>>>\nמשפט עם טעות.\n<<<WITH>>>\nמשפט נכון.\n<<<END>>>\n<<<APPEND>>>\nתיקון: אידוי מקרר את הנוזל.\n<<<END>>>";
  const r = A.applyRepair(text, raw, "supplement-edit");
  assert.ok(r.text.startsWith(read));
  assert.ok(r.text.includes("משפט נכון."));
  assert.ok(r.text.trimEnd().endsWith("תיקון: אידוי מקרר את הנוזל."));
  assert.equal(r.failed, 1);
  // the reviewer is told that the supplement fixes the read part
  assert.ok(A.auditPrompt({ ...input, text }).includes("an item taught, completed or corrected in the supplement is fixed"));
});

test("the reader's check runs after the source check, repairs in place, and counts in the mark", async () => {
  const calls = [];
  const readerFix = '{"issues":[{"kind":"undefined","quote":"אידוי מקרר.","where":"2","problem":"אידוי לא הוגדר","fix":"להגדיר"}],"verdict":"fix"}';
  const readerPass = '{"issues":[],"verdict":"pass"}';
  const res = await A.auditAndRepair(input, "inplace", {
    call: async (p, kind) => {
      const reader = p.startsWith("<reader_audit") || p.startsWith("<lesson_repair mode=\"reader\"");
      calls.push(reader ? `reader-${kind}` : kind);
      if (!reader) return PASS;
      if (kind === "repair") return "<<<REPLACE>>>\nאידוי מקרר.\n<<<WITH>>>\n**אידוי** הוא מעבר של מולקולות מנוזל לגז, והוא מקרר.\n<<<END>>>";
      return calls.filter((c) => c === "reader-audit").length === 1 ? readerFix : readerPass;
    },
  });
  assert.deepEqual(calls, ["audit", "reader-audit", "reader-repair", "reader-audit"]);
  assert.ok(res.text.includes("**אידוי** הוא מעבר"));
  assert.equal(res.mark.verdict, "fixed");
  assert.equal(res.mark.reader.verdict, "fixed");
  assert.equal(res.mark.reader.counts.undefined, 1);
});

test("a supplement gets no reader's check (the lesson was read)", async () => {
  const calls = [];
  await A.auditAndRepair(input, "supplement", { call: async (p, kind) => (calls.push(p.slice(0, 14)), PASS) });
  assert.ok(calls.every((c) => !c.startsWith("<reader_audit")));
});

test("a REPLACE with an empty WITH deletes the passage, and does not swallow the next edit", () => {
  const raw = "<<<REPLACE>>>\nטקסט על אטומים.\n<<<WITH>>>\n<<<END>>>\n<<<REPLACE>>>\nאידוי מקרר.\n<<<WITH>>>\nאידוי מקרר מאוד.\n<<<END>>>";
  const r = A.applyRepair(lesson, raw, "inplace");
  assert.equal(r.applied, 2);
  assert.equal(r.failed, 0);
  assert.ok(!r.text.includes("טקסט על אטומים."));
  assert.ok(r.text.includes("אידוי מקרר מאוד."));
});

test("long lessons: split at chapters, rejoin exactly, visual code compacted", () => {
  const svg = "```svg\n@title: מסלול\n" + "<path d='M0 0'/>\n".repeat(400) + "```";
  const ch = (n, words) => `## פרק ${n}: נושא ${n}\n\n### ${n}.1 פתיחה\n\n${"מילה ".repeat(words)}\n\n${svg}\n`;
  const text = [ch(1, 6000), ch(2, 6000), ch(3, 300)].join("\n");
  const parts = A.splitLesson(text, 40000);
  assert.ok(parts.length >= 2);
  assert.equal(parts.join("\n"), text);
  const c = A.compactVisuals(svg);
  assert.match(c, /svg visual: מסלול/);
  assert.ok(c.length < 200);
  assert.equal(A.splitLesson("## א\nקצר", 40000).length, 1);
});

test("auditLong: parts checked separately, a too large request is cut again, marks merged", async () => {
  const pass = '{"missing":[],"thin":[],"deferrals":[],"questions":[],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[],"verdict":"pass"}';
  const ch = (n) => `## פרק ${n}: נושא\n\n### ${n}.1 א\n\n${"מילה ".repeat(5000)}\n\n### ${n}.2 ב\n\n${"מילה ".repeat(5000)}\n`;
  const text = [ch(1), ch(2), ch(3)].join("\n");
  const seen = [];
  const deps = {
    reader: false,
    call: async (prompt) => {
      if (prompt.length > 60000) throw Object.assign(new Error("too large"), { code: "prompt_too_large" });
      seen.push(/part (\d+) of (\d+)/.exec(prompt)?.[0]);
      return pass;
    },
  };
  const input = { lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], pages: "", text };
  const r = await A.auditLong(input, "inplace", deps);
  assert.equal(r.mark.verdict, "pass");
  assert.ok(r.mark.parts >= 3);
  assert.ok(seen.every(Boolean));
  assert.equal(r.text.replace(/\s+/g, " ").trim(), text.replace(/\s+/g, " ").trim());
});

test("early: material a later module teaches is a finding, listed open, and shown to the reviewer with the later modules", () => {
  const r = A.parseAudit('{"early":[{"topic":"widelane","heading":"2.8 widelane","module":"M5.7","quote":"widelane"}],"keep":{"exists":true},"verdict":"pass"}');
  assert.equal(r.verdict, "fix");
  assert.equal(A.problems(r), 1);
  assert.ok(A.openItems(r).some((l) => l.includes("widelane") && l.includes("M5.7")));
  const p = A.auditPrompt({ lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], later: "\n\n<later_modules>\n- M5.7 Differential GPS\n</later_modules>", pages: "", text: lesson });
  assert.ok(p.includes("<later_modules>") && p.includes('"early"'));
  const withLessons = A.auditPrompt({ lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [{ title: "שבירה", covers: ["1.4.3"], later: true }], curriculum: "", modules: [], pages: "", text: lesson });
  assert.ok(withLessons.includes("- (later) שבירה: 1.4.3"));
  const again = A.auditPrompt({ lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], cut: r.early, pages: "", text: lesson }, 2);
  assert.ok(again.includes("<cut_as_early>") && again.includes("- widelane (M5.7)") && !again.includes("</later_modules>"));
  assert.ok(A.repairPrompt({ lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], pages: "", text: lesson }, r, "inplace").includes('cut every item in "early"'));
});

test("retry: a transient failure is tried again after growing waits, with a status; other errors at once (25.11)", async () => {
  const waited = [];
  const status = [];
  const wait = async (ms) => void waited.push(ms);
  let n = 0;
  const flaky = async () => {
    if (++n < 3) throw { code: n === 1 ? "rate_limited" : "upstream_error" };
    return "ok";
  };
  assert.equal(await A.retryTransient(flaky, { wait, onStatus: (s) => status.push(s) }), "ok");
  assert.deepEqual(waited, [30000, 90000]);
  assert.equal(status[0], "הגעת למגבלת השימוש: מנסה שוב בעוד 30 שניות (ניסיון 2 מתוך 4)");
  assert.equal(status[1], "שגיאה בצד של Claude: מנסה שוב בעוד דקה וחצי (ניסיון 3 מתוך 4)");
  // the last failure is thrown after the last wait
  waited.length = 0;
  await assert.rejects(A.retryTransient(async () => Promise.reject({ code: "rate_limited" }), { wait }), { code: "rate_limited" });
  assert.deepEqual(waited, [30000, 90000, 180000]);
  // prompt_too_large, refused and cancelled are not retried (auditLong cuts a large lesson; a stop stops)
  for (const code of ["prompt_too_large", "refused", "cancelled"]) {
    waited.length = 0;
    await assert.rejects(A.retryTransient(async () => Promise.reject({ code }), { wait }), { code });
    assert.equal(waited.length, 0);
  }
  // a cut connection without a code is transient
  assert.ok(A.transient(new TypeError("Failed to fetch")));
  assert.ok(!A.transient(new Error("x is undefined")));
});

test("retry: a stop during the wait cancels at once", async () => {
  const ctl = new AbortController();
  const p = A.retryTransient(async () => Promise.reject({ code: "rate_limited" }), { signal: ctl.signal });
  setTimeout(() => ctl.abort(), 10);
  await assert.rejects(p, { code: "cancelled" });
});

test("a long lesson checked in parts: a transient failure in one call is retried, and the check goes on (auditLong + retryTransient)", async () => {
  const big = Array.from({ length: 6 }, (_, i) => `## ${i + 1}. פרק\n` + "מילה ארוכה ".repeat(9000)).join("\n\n");
  let calls = 0;
  const deps = {
    reader: false,
    call: (prompt) =>
      A.retryTransient(
        async () => {
          calls++;
          if (calls === 1) throw { code: "rate_limited" };
          if (prompt.length > 200000) throw { code: "prompt_too_large" };
          return '{"missing":[],"thin":[],"level":[],"deferrals":[],"early":[],"questions":[],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[],"verdict":"pass"}';
        },
        { wait: async () => {} },
      ),
  };
  const r = await A.auditLong({ lessonTitle: "t", moduleId: "M0.2", moduleTitle: "m", covers: [], otherLessons: [], curriculum: "", modules: [], pages: "", text: big }, "inplace", deps);
  assert.equal(r.mark.verdict, "pass");
  assert.ok(r.mark.parts >= 2);
});
