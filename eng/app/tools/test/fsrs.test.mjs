// Unit tests of the review queue: src/review/fsrs.ts (the FSRS-4.5 scheduler) and src/review/cards.ts (the cards
// made from a lesson, and the day's queue within the time budget).
// Run from the app folder: node tools/test/fsrs.test.mjs
// The TypeScript modules are bundled on the fly with the esbuild that Vite already installs.
import { build } from "esbuild";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

async function load(rel) {
  const src = fileURLToPath(new URL(rel, import.meta.url));
  const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
}
const F = await load("../../src/review/fsrs.ts");
const C = await load("../../src/review/cards.ts");

let n = 0;
const t = (name, fn) => {
  fn();
  n++;
  console.log("ok", name);
};
const DAY = F.DAY;
const T0 = new Date(2026, 9, 30, 21, 0).getTime(); // an evening lesson
const days = (a, b) => Math.round((F.dayStart(b) - F.dayStart(a)) / DAY);

/* ---- the memory model ---- */
t("recall at t = S is 0.9", () => assert.ok(Math.abs(F.retrievability(10, 10) - 0.9) < 1e-9));
t("recall at t = 0 is 1", () => assert.equal(F.retrievability(0, 5), 1));
t("recall falls with time", () => assert.ok(F.retrievability(30, 10) < F.retrievability(10, 10)));
t("interval at 0.9 equals S", () => assert.equal(F.intervalDays(12.4), 12));
t("interval is at least one day", () => assert.equal(F.intervalDays(0.2), 1));
t("higher retention, shorter interval", () => assert.ok(F.intervalDays(20, 0.95) < F.intervalDays(20, 0.9)));

/* ---- a new card ---- */
t("a new card waits one night", () => {
  const m = F.newMem(T0);
  assert.equal(m.reps, 0);
  assert.equal(days(T0, m.due), 1);
  assert.equal(m.due, F.dayStart(m.due));
});
t("first grades: initial stabilities in order", () => {
  const now = T0 + DAY;
  const s = [1, 2, 3, 4].map((g) => F.review(F.newMem(T0), g, now, "x").s);
  assert.deepEqual(s, F.W.slice(0, 4));
});
t("first 'good' comes back in about 4 days", () => {
  const now = T0 + DAY;
  const m = F.review(F.newMem(T0), 3, now, "x");
  assert.equal(days(now, m.due), 4);
  assert.ok(!m.relearn);
});
t("first 'forgot' comes back in the same session", () => {
  const now = T0 + DAY;
  const m = F.review(F.newMem(T0), 1, now, "x");
  assert.ok(m.relearn);
  assert.equal(m.due, now + F.RELEARN_MS);
});
t("difficulty: easy < good < hard < again", () => {
  const now = T0 + DAY;
  const d = [4, 3, 2, 1].map((g) => F.review(F.newMem(T0), g, now, "x").d);
  assert.ok(d[0] < d[1] && d[1] < d[2] && d[2] < d[3]);
  d.forEach((x) => assert.ok(x >= 1 && x <= 10));
});

/* ---- reviews ---- */
t("good on time grows stability", () => {
  let m = F.review(F.newMem(T0), 3, T0 + DAY, "x");
  const s1 = m.s;
  m = F.review(m, 3, m.due + 3600_000, "x");
  assert.ok(m.s > s1 * 2, `s ${s1} -> ${m.s}`);
  assert.equal(m.reps, 2);
});
t("easy grows more than good, hard less", () => {
  const m = F.review(F.newMem(T0), 3, T0 + DAY, "x");
  const at = m.due + 3600_000;
  const [h, g, e] = [2, 3, 4].map((r) => F.review(m, r, at, "x").s);
  assert.ok(h < g && g < e);
});
t("a lapse cuts stability, counts, and relearns", () => {
  let m = F.review(F.newMem(T0), 3, T0 + DAY, "x");
  m = F.review(m, 3, m.due, "x");
  const s = m.s;
  const l = F.review(m, 1, m.due, "x");
  assert.ok(l.s < s);
  assert.equal(l.lapses, 1);
  assert.ok(l.relearn);
});
t("relearn: good the same day clears it without a second lapse", () => {
  let m = F.review(F.newMem(T0), 3, T0 + DAY, "x");
  m = F.review(m, 1, m.due, "x");
  const again = F.review(m, 1, m.due, "x");
  assert.equal(again.lapses, 1);
  assert.equal(again.s, m.s);
  const ok = F.review(m, 3, m.due, "x");
  assert.ok(!ok.relearn);
  assert.equal(ok.lapses, 1);
  assert.ok(days(m.due, ok.due) >= 1);
});
t("a second 'good' the same day does not inflate stability", () => {
  const m = F.review(F.newMem(T0), 3, T0 + DAY, "x");
  const same = F.review(m, 3, T0 + DAY + 600_000, "x");
  assert.equal(same.s, m.s);
});
t("late review of a well-known card gains more (spacing)", () => {
  let m = F.review(F.newMem(T0), 3, T0 + DAY, "x");
  m = F.review(m, 3, m.due, "x");
  const onTime = F.review(m, 3, m.due, "x").s;
  const late = F.review(m, 3, m.due + 10 * DAY, "x").s;
  assert.ok(late > onTime);
});
t("fuzz is deterministic and within ±5%", () => {
  let m = F.review(F.newMem(T0), 4, T0 + DAY, "a");
  m = F.review(m, 4, m.due, "a");
  const base = F.intervalDays(m.s);
  const due1 = F.review(m, 3, m.due, "card-1").due;
  assert.equal(F.review(m, 3, m.due, "card-1").due, due1);
  const s2 = F.review(m, 3, m.due, "card-1").s;
  const ivl = days(m.due, due1);
  assert.ok(Math.abs(ivl - F.intervalDays(s2)) <= Math.ceil(F.intervalDays(s2) * 0.05) + 0, `${ivl} vs ${F.intervalDays(s2)} (base ${base})`);
});
t("a year of 'good' stays under the cap and grows", () => {
  let m = F.review(F.newMem(T0), 3, T0 + DAY, "y");
  let prev = 0;
  for (let i = 0; i < 8; i++) {
    const ivl = days(m.last, m.due);
    assert.ok(ivl >= prev, `interval shrank ${prev} -> ${ivl}`);
    prev = ivl;
    m = F.review(m, 3, m.due, "y");
  }
  assert.ok(days(m.last, m.due) <= F.MAX_DAYS);
  assert.ok(prev > 60);
});
t("preview matches review", () => {
  const m = F.review(F.newMem(T0), 3, T0 + DAY, "z");
  const p = F.preview(m, m.due, "z");
  for (const g of [1, 2, 3, 4]) assert.equal(p[g], F.review(m, g, m.due, "z").due);
});
t("labels", () => {
  const now = new Date(2026, 9, 30, 10).getTime();
  assert.equal(F.whenLabel(now + F.RELEARN_MS, now), "בעוד 5 דק'");
  assert.equal(F.whenLabel(F.addDays(now, 1), now), "מחר");
  assert.equal(F.whenLabel(F.addDays(now, 4), now), "בעוד 4 ימים");
  assert.equal(F.whenLabel(F.addDays(now, 15), now), "בעוד שבועיים");
  assert.equal(F.whenLabel(F.addDays(now, 61), now), "בעוד חודשיים");
});
t("addDays crosses a clock change by calendar days", () => {
  const before = new Date(2026, 2, 26, 12).getTime(); // around the spring change in Israel
  for (let k = 1; k < 5; k++) assert.equal(new Date(F.addDays(before, k)).getHours(), 0);
});

/* ---- cards from a lesson ---- */
const LESSON = `## חלק

\`\`\`definition
@title: הספק קליטה
ההספק $P_r$ הוא האנרגיה ליחידת זמן שמגיעה למקלט.
\`\`\`

\`\`\`formula
@title: משוואת המכ"ם
$$R_{max} = \\left(\\frac{P_t G^2 \\lambda^2 \\sigma}{(4\\pi)^3 P_{min}}\\right)^{1/4}$$
\`\`\`

\`\`\`definition
בלי כותרת אין שאלה.
\`\`\`

\`\`\`think
שאלה לבדיקה?
---
תשובה.
\`\`\`

\`\`\`keep
- **משוואת המכ"ם**: $R \\propto P_t^{1/4}$, כשהמטרה רחוקה והאנטנה מכוונת.
- יחס אות לרעש: $SNR = P_r / (kTB)$, ברוחב הסרט של המקלט.
- הטווח גדל כשורש רביעי של ההספק.
- $P_r \\propto R^{-4}$
\`\`\`
`;
const place = { moduleId: "M0.1", lesson: 0, title: "שיעור בדיקה" };
t("seeds: titled definition and formula, named keep lines, the rest as one card", () => {
  const s = C.seedsFromLesson(LESSON, place);
  const kinds = s.map((x) => x.kind).sort();
  assert.deepEqual(kinds, ["def", "formula", "keep", "keep", "keepAll"]);
  const keep = s.filter((x) => x.kind === "keep");
  assert.match(keep[0].front, /«משוואת המכ"ם»/);
  assert.match(keep[0].back, /P_t\^\{1\/4\}/);
  assert.match(keep[1].front, /«יחס אות לרעש»/);
  const all = s.find((x) => x.kind === "keepAll");
  assert.match(all.front, /שיעור בדיקה/);
  assert.match(all.front, /4 הנקודות/);
});
t("seeds: ids are stable and differ between lessons", () => {
  const a = C.seedsFromLesson(LESSON, place).map((x) => x.id);
  assert.deepEqual(C.seedsFromLesson(LESSON, place).map((x) => x.id), a);
  const b = C.seedsFromLesson(LESSON, { ...place, lesson: 1 }).map((x) => x.id);
  assert.ok(a.every((id) => !b.includes(id)));
});
t("named line: math before the colon is not a name", () => {
  assert.equal(C.splitNamed("- $a:b$ יחס"), null);
  assert.deepEqual(C.splitNamed("- שטח עיגול: $\\pi r^2$"), { name: "שטח עיגול", rest: "$\\pi r^2$" });
  assert.deepEqual(C.splitNamed("1. חוק אוהם — $V = IR$"), { name: "חוק אוהם", rest: "$V = IR$" });
});
t("thinks: question and answer", () => assert.deepEqual(C.thinksFromLesson(LESSON), [{ q: "שאלה לבדיקה?", a: "תשובה." }]));
t("note seed needs a quote and some text", () => {
  assert.equal(C.noteSeed({ id: "n1", text: "קצר", anchor: "ציטוט ארוך מספיק מהפסקה" }), null);
  const s = C.noteSeed({ id: "n1", text: "לבדוק למה השורש הרביעי", anchor: "הטווח גדל כשורש רביעי של ההספק" });
  assert.equal(s.id, "note-n1");
  assert.match(s.front, /הטווח גדל/);
});
t("long texts are cut", () => {
  const s = C.seedsFromLesson("```definition\n@title: א\n" + "מילה ".repeat(1000) + "\n```", place);
  assert.ok(s[0].back.length <= 1500);
});

/* ---- the day's queue ---- */
function deck(nNew, nDue, now) {
  const out = [];
  for (let i = 0; i < nNew; i++) out.push(C.makeCard({ id: `n${i}`, kind: "def", front: "f", back: "b" }, { src: "s", moduleId: `M${i % 3}`, lesson: 0, learnedAt: now - 3 * DAY + i }));
  for (let i = 0; i < nDue; i++) {
    const c = C.makeCard({ id: `d${i}`, kind: "formula", front: "f", back: "b" }, { src: "s", moduleId: `M${i % 2}`, lesson: 0, learnedAt: now - 30 * DAY });
    Object.assign(c, F.review(c, 3, now - (10 + i) * DAY, c.id));
    out.push(c);
  }
  return out;
}
const NOW = new Date(2026, 10, 2, 9).getTime();
const zero = { day: C.todayKey(NOW), sec: 0, done: 0, fresh: 0 };
t("queue: within the budget", () => {
  const q = C.buildQueue(deck(10, 200, NOW), zero, NOW);
  assert.ok(q.sec <= C.DAILY_SEC);
  assert.ok(q.rested);
  assert.ok(q.cards.length > 10);
});
t("queue: due before new; the least recalled first", () => {
  const q = C.buildQueue(deck(10, 200, NOW), zero, NOW);
  assert.ok(q.cards.every((c) => c.reps > 0), "no new card when the due ones fill the budget");
  const r = q.cards.map((c) => F.recallNow(c, NOW));
  // interleaving may swap neighbours of different modules, but the first is among the lowest
  assert.ok(r[0] <= Math.min(...r) + 0.02);
});
t("queue: new cards capped per day and spread", () => {
  const q = C.buildQueue(deck(40, 4, NOW), zero, NOW);
  const fresh = q.cards.filter((c) => c.reps === 0);
  assert.equal(fresh.length, C.NEW_PER_DAY);
  assert.ok(q.cards.slice(0, 3).some((c) => c.reps > 0));
  assert.ok(!q.rested);
});
t("queue: new cards of today wait for tomorrow", () => {
  const c = C.makeCard({ id: "t", kind: "def", front: "f", back: "b" }, { src: "s", moduleId: "M", lesson: 0, learnedAt: NOW });
  assert.equal(C.buildQueue([c], zero, NOW).cards.length, 0);
  assert.equal(C.buildQueue([c], zero, F.addDays(NOW, 1) + 3600_000).cards.length, 1);
});
t("queue: budget used up rests, extra minutes reopen it", () => {
  const spent = { ...zero, sec: C.DAILY_SEC };
  const d = deck(0, 20, NOW);
  const q = C.buildQueue(d, spent, NOW);
  assert.equal(q.cards.length, 0);
  assert.ok(q.rested);
  const more = C.buildQueue(d, { ...spent, extra: 300 }, NOW);
  assert.ok(more.cards.length > 0 && more.sec <= 300);
});
t("queue: cards taken out never come", () => {
  const d = deck(3, 0, NOW).map((c) => ({ ...c, off: true }));
  assert.equal(C.buildQueue(d, zero, NOW).cards.length, 0);
});
t("measured time: moving average, clipped", () => {
  const c = { kind: "def" };
  assert.equal(C.measured(c, 1000), 240);
  assert.equal(C.measured({ ...c, sec: 30 }, 60), 39);
});

console.log(`\n${n} tests passed`);
