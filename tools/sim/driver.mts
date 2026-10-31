// Runs an app's own lesson writer (composeLesson in <app>/app/src/tutor.ts) outside the browser,
// with a runtime whose "sample" writes each request to <out>/req-<n>.json and waits for
// <out>/res-<n>.txt (written by a model session that answers it). Used when the bench tabs in the
// learner's browser cannot be reached: the requests are byte-for-byte the app's own.
// Usage: npx tsx tools/sim/driver.mts <core|eng> <module> <lessonIdx> <rules> <features,comma> <out> <libDir> <backupDir>
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [app, moduleId, lessonArg, rules, feats, out, libDir, backupDir] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
globalThis.fetch = (async (url: string) => {
  const rel = String(url).replace(/^.*?lib\//, "");
  const p = join(libDir, rel.split("?")[0]);
  if (!existsSync(p)) return { ok: false, status: 404, json: async () => ({}) } as Response;
  const body = readFileSync(p, "utf8");
  return { ok: true, status: 200, json: async () => JSON.parse(body), text: async () => body } as Response;
}) as typeof fetch;

const tutor = await import(`../../${app}/app/src/tutor.ts`);
const lib = await import(`../../${app}/app/src/library.ts`);
const index = await lib.loadIndex();
const m = index.modules.find((x: { id: string }) => x.id === moduleId);
const prof = JSON.parse(readFileSync(join(backupDir, "data/users/me/profile.json"), "utf8"));
const memory = (prof.data ?? prof).memory ?? "";
const done = (prof.data ?? prof).done ?? [];
const mod = JSON.parse(readFileSync(join(backupDir, `data/users/me/profile/modules/${moduleId}.json`), "utf8"));
const lessons = (mod.data ?? mod).lessons;
const idx = Number(lessonArg);

let n = 0;
const wait = async (k: number) => {
  const f = join(out, `res-${k}.txt`);
  while (!existsSync(f)) await new Promise((r) => setTimeout(r, 2000));
  await new Promise((r) => setTimeout(r, 500));
  return readFileSync(f, "utf8");
};
const ask = async (msgs: { role: string; content: unknown }[], json: boolean) => {
  const k = ++n;
  writeFileSync(join(out, `req-${k}.json`), JSON.stringify({ json, messages: msgs }, null, 1));
  writeFileSync(join(out, "pending"), String(k));
  return wait(k);
};
const sample = Object.assign(
  async (msgs: { role: string; content: unknown }[], o: { onText?: (x: { text: string }) => void }) => {
    const text = await ask(msgs, false);
    o?.onText?.({ text });
    return { text, truncated: false, modelApplied: "sim" };
  },
  {
    json: async (msgs: { role: string; content: unknown }[]) => {
      const t = await ask(msgs, true);
      const s = t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1);
      return JSON.parse(s);
    },
  },
);
tutor.setLessonRules(rules);
tutor.setLessonFeatures(feats ? feats.split(",").filter(Boolean) : []);
const t0 = Date.now();
const res = await tutor.composeLesson({
  rt: { sample, canSendImages: false, canUseTools: false, store: null },
  history: [], effort: "high", module: m, lessons, lessonIdx: idx, memory, done,
  signal: new AbortController().signal,
  text: `כתוב את שיעור ${idx + 1} במודול ${moduleId}: ${lessons[idx].title}.`,
  cb: { onText: () => {}, onActivity: () => {}, onStatus: (s: string) => writeFileSync(join(out, "status"), s), onCheckpoint: () => {} },
});
writeFileSync(join(out, "lesson.md"), res.text);
writeFileSync(join(out, "plan.json"), JSON.stringify(res.plan, null, 1));
writeFileSync(join(out, "pending"), "done");
console.log("done", (res.text.match(/[^\s]+/g) ?? []).length, "words", Math.round((Date.now() - t0) / 60000), "min");
