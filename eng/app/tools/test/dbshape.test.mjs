// Unit tests of the bounded db shapes (docs/BUILD_GUIDE.md 11.6) and of the plan repair patch:
// events by day, calib by lesson, consult cards in packs, usage by day, the byte-aware split of a
// long message, and lessonGate's planSkeleton/applyPlanRepair.
// Run from the app folder: node tools/test/dbshape.test.mjs
import { build } from "esbuild";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const src = fileURLToPath(new URL(`../../src/${rel}`, import.meta.url));
  const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral", external: ["react"] });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text.replace(/from\s*"react"/g, 'from "data:text/javascript,export const createContext=()=>({})"')).toString("base64"));
};

/* ---- an in-memory db with the runtime's shape ---- */
const store = new Map();
const docRef = (path) => ({
  id: path.split("/").pop(),
  async get() {
    const d = store.get(path);
    return { id: path.split("/").pop(), exists: !!d, data: () => (d ? structuredClone(d) : undefined) };
  },
  async set(d) {
    const size = new TextEncoder().encode(JSON.stringify(d)).length;
    assert.ok(size < 256 * 1024, `${path}: ${size} bytes`);
    store.set(path, structuredClone(d));
  },
  async delete() {
    store.delete(path);
  },
  collection: (c) => colRef(`${path}/${c}`),
});
const colRef = (path, n = 1e9, order = null) => ({
  doc: (id = Math.random().toString(36).slice(2)) => docRef(`${path}/${id}`),
  limit: (k) => colRef(path, k, order),
  orderBy: (field, dir = "asc") => colRef(path, n, { field, dir }),
  async get() {
    let keys = [...store.keys()].filter((k) => k.startsWith(path + "/") && !k.slice(path.length + 1).includes("/"));
    if (order) keys = keys.filter((k) => store.get(k)[order.field] !== undefined).sort((a, b) => (store.get(a)[order.field] > store.get(b)[order.field] ? 1 : -1) * (order.dir === "desc" ? -1 : 1));
    const docs = keys.slice(0, n).map((k) => ({ id: k.split("/").pop(), exists: true, data: () => structuredClone(store.get(k)) }));
    return { docs };
  },
});
globalThis.window = {
  addEventListener() {},
  dispatchEvent() {},
  claude: { use: async (n) => (n === "db" ? { doc: docRef } : { id: async () => "u1" }) },
};
globalThis.Event = class {
  constructor(t) {
    this.type = t;
  }
};

let n = 0;
const t = async (name, fn) => {
  await fn();
  n++;
  console.log("ok", name);
};
const P = "data/users/u1/profile";
const docsUnder = (p) => [...store.keys()].filter((k) => k.startsWith(p + "/") && !k.slice(p.length + 1).includes("/"));

const ev = await load("events.ts");

await t("events: one document per day, capped", async () => {
  for (let i = 0; i < 620; i++) ev.logEvent("think.commit", { moduleId: "M1", lesson: 0, title: "" }, { q: `q${i}` });
  await new Promise((r) => setTimeout(r, 3300));
  const days = docsUnder(`${P}/events`);
  assert.equal(days.length, 1);
  const d = store.get(days[0]);
  assert.equal(d.entries.length, 500);
  assert.equal(d.entries.at(-1).q, "q619");
});

await t("calib: one document per lesson, old format still read", async () => {
  const id = ev.thinkId({ moduleId: "M0.1", lesson: 2, title: "" }, "מה היחס?");
  assert.equal(ev.calibDocOf(id), "M0.1__2");
  await ev.saveCalib({ id, moduleId: "M0.1", lesson: 2, q: "מה היחס?", conf: 3, ts: 1 });
  await ev.saveCalib({ id: id + "x", moduleId: "M0.1", lesson: 2, q: "שאלה אחרת", conf: 1, ts: 2 });
  assert.deepEqual(docsUnder(`${P}/calib`), [`${P}/calib/M0.1__2`]);
  assert.equal((await ev.loadCalib(id)).conf, 3);
  store.set(`${P}/calib/M0.1__1__old`, { id: "M0.1__1__old", moduleId: "M0.1", lesson: 1, q: "ישנה", conf: 2, ts: 0 });
  assert.equal((await ev.loadCalib("M0.1__1__old")).q, "ישנה");
  assert.equal((await ev.allCalib()).length, 3);
});

await t("consults: cards packed under 180KB, old single cards kept", async () => {
  const key = "M1__0";
  store.set(`${P}/consults/${key}/cards/cold`, { id: "cold", anchor: "", kind: "ask", turns: [{ q: "q", a: "a", level: 1, ts: 0 }], ts: 0, updatedAt: 0 });
  await ev.loadConsults(key);
  const big = "א".repeat(30_000); // 60 KB in UTF-8
  for (let i = 0; i < 8; i++) await ev.saveConsult(key, { id: `c${i}`, anchor: "x", kind: "ask", turns: [{ q: "q", a: big, level: 1, ts: i }], ts: i + 1, updatedAt: i }, i + 1);
  // a card grows: it moves to a pack with room
  await ev.saveConsult(key, { id: "c0", anchor: "x", kind: "ask", turns: [{ q: "q", a: big, level: 1, ts: 0 }, { q: "q2", a: big, level: 1, ts: 9 }], ts: 1, updatedAt: 9 }, 8);
  await ev.saveConsult(key, { id: "cold", anchor: "", kind: "ask", turns: [{ q: "q", a: "b", level: 1, ts: 0 }], ts: 0, updatedAt: 1 }, 9);
  const docs = docsUnder(`${P}/consults/${key}/cards`);
  assert.ok(docs.length <= 6, `docs: ${docs.length}`);
  const list = await ev.loadConsults(key);
  assert.deepEqual(list.map((c) => c.id).sort(), ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "cold"]);
  assert.equal(list.find((c) => c.id === "c0").turns.length, 2);
  assert.equal(list.find((c) => c.id === "cold").turns[0].a, "b");
  assert.equal(store.get(`${P}/consults/${key}/cards/cold`).turns[0].a, "b");
});

const us = await load("usage.ts");
await t("usage: sessions folded into one day document", () => {
  let d = null;
  for (let i = 0; i < 45; i++) d = us.mergeUsageDay(d, { day: "2026-10-30", session: `s${i}`, calls: { a: 1 }, ms: {}, chars: {}, errors: {}, lessons: 1, lessonWords: 10, lessonMs: 5, updatedAt: i });
  assert.equal(Object.keys(d.sessions).length, 41);
  const sum = us.summarize(Object.values(d.sessions), 100000);
  assert.equal(sum.calls.a, 45);
  assert.equal(sum.lessons, 45);
});

const rt = await load("runtime.ts");
await t("splitUtf8: Hebrew text cut by bytes, joins back", () => {
  const text = ("שלום עולם \\frac{a}{b}\n" + "😀").repeat(9000);
  const parts = rt.splitUtf8(text, 150_000, 199_900);
  assert.equal(parts.join(""), text);
  assert.ok(parts.length > 1);
  assert.ok(new TextEncoder().encode(JSON.stringify(parts[0])).length <= 150_002);
  for (const p of parts) assert.ok(new TextEncoder().encode(JSON.stringify(p)).length <= 199_902);
  assert.deepEqual(rt.splitUtf8("קצר", 100, 100), ["קצר"]);
  assert.deepEqual(rt.splitUtf8("", 100, 100), [""]);
  assert.deepEqual(rt.splitUtf8("אב", -5, 100), ["", "אב"]);
});

await t("saveMessage: a long Hebrew draft with a plan stays under 256 KiB per document", async () => {
  const s = new rt.Store({ doc: docRef }, "u2");
  const text = "פסקה בעברית עם $x^2$ ומשוואה.\n\n".repeat(12_000);
  await s.saveMessage("c1", "m1", { role: "assistant", text, mode: "lesson", ts: 1, draft: true, plan: { parts: [{ title: "ת".repeat(30_000) }] }, activity: [] });
  const back = await s.loadMessages("c1");
  assert.equal(back[0].text, text);
});

await t("memlog: versions older than 30 days folded into month documents", async () => {
  const s = new rt.Store({ doc: docRef }, "u3");
  const day = 86_400_000;
  const now = Date.now();
  for (let i = 0; i < 30; i++) store.set(`data/users/u3/profile/memlog/v${i}`, { memory: "ז".repeat(20_000), reason: "r", at: now - (90 - i) * day - (i % 3) * 1000 });
  await s.logMemory({ memory: "חדש", reason: "now" });
  const left = docsUnder("data/users/u3/profile/memlog");
  assert.ok(left.length < 10, left.join());
  for (const k of left) assert.ok(new TextEncoder().encode(JSON.stringify(store.get(k))).length < 256 * 1024);
  const log = await s.loadMemoryLog(100);
  assert.equal(log[0].reason, "now");
  // 30 versions of one month at 40 KB each: the month document keeps the newest that fit (4)
  assert.equal(log.length, 5, `${log.length} ${left.join()}`);
});

const gate = await load("lessonGate.ts");
await t("plan repair: skeleton has no free text, patch adds and never deletes", () => {
  const plan = { results: [{ id: "R1", text: "תוצאה", thread: "שאלה" }], units: [{ id: "U1", r: "R1", type: "DEF", part: 1, text: "טקסט חופשי", q: "" }], parts: [{ title: "כותרת", units: ["U1"], blocks: ["think:U1 some words"], l25: ["מבנה"] }] };
  const turn = gate.planRepairTurn(plan, ["units without an exam question q: U1."]);
  assert.ok(!turn.includes("טקסט חופשי") && !turn.includes("כותרת") && !turn.includes("תוצאה") && !turn.includes("some words"));
  const fixed = gate.applyPlanRepair(plan, { units: [{ id: "U1", q: "מה?" }, { id: "U2", r: "R1", type: "QNT", part: 1, text: "חדש", q: "כמה?" }], parts: [{ part: 1, units: ["U1", "U2"] }, { part: 7, units: [] }] });
  assert.equal(fixed.units.length, 2);
  assert.equal(fixed.units[0].text, "טקסט חופשי");
  assert.equal(fixed.units[0].q, "מה?");
  assert.deepEqual(fixed.parts[0].units, ["U1", "U2"]);
  assert.equal(fixed.parts[0].title, "כותרת");
  assert.equal(plan.units.length, 1, "the original plan is not changed");
  assert.equal(gate.applyPlanRepair(plan, null), plan);
});

console.log(`${n} tests passed`);
