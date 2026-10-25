// Turns a dump of the Engineering Lab artifact database into Markdown notes and a raw
// JSON snapshot inside the repository.
//
//   node eng/app/tools/backup/export.mjs <dump-dir> <repo-root>
//
// <dump-dir> holds the documents as ArtifactData `out_dir` writes them:
//   <dump>/data/users/<id>/profile.json
//   <dump>/data/users/<id>/profile/modules/<module id>.json
//   <dump>/data/users/<id>/profile/convs/<cid>.json
//   <dump>/data/users/<id>/profile/convs/<cid>/msgs/<mid>.json
// Output (overwritten on every run, so unchanged data gives no git diff):
//   eng/notes/MEMORY.md, eng/notes/PROGRESS.md, eng/notes/README.md,
//   eng/notes/lessons/<module>-<lesson>-<title>.md (one file per conversation),
//   eng/backup/db/... (the documents as JSON, for a full restore).
import fs from "node:fs";
import path from "node:path";

const [dump, root] = process.argv.slice(2);
if (!dump || !root) {
  console.error("usage: export.mjs <dump-dir> <repo-root>");
  process.exit(1);
}

const syllabus = JSON.parse(fs.readFileSync(path.join(root, "library/engineering/syllabus/syllabus.json"), "utf8"));
const MODE = { lesson: "שיעור", clarify: "שאלת הבהרה", free: "חופשי", quiz: "מבחן מסכם" };
const TIER = { core: "ליבה", adv: "מתקדם", ref: "עיון" };

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
const read = (f) => {
  const o = JSON.parse(fs.readFileSync(f, "utf8"));
  // accept both a bare body and an {id, data, version} envelope
  return o && typeof o.data === "object" && "version" in o ? o.data : o;
};
const date = (ms) => (ms ? new Date(ms).toISOString().slice(0, 10) : "");
const slug = (s) =>
  String(s)
    .replace(/[^\p{L}\p{N}.]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "שיחה";

let profile = null;
const modules = {};
const convs = new Map();
for (const f of walk(dump).filter((f) => f.endsWith(".json"))) {
  const rel = path.relative(dump, f).split(path.sep).join("/");
  let m;
  if ((m = /convs\/([^/]+)\/msgs\/([^/]+)\.json$/.exec(rel))) {
    const c = convs.get(m[1]) ?? { id: m[1], meta: {}, msgs: [] };
    c.msgs.push(read(f));
    convs.set(m[1], c);
  } else if ((m = /convs\/([^/]+)\.json$/.exec(rel))) {
    const c = convs.get(m[1]) ?? { id: m[1], meta: {}, msgs: [] };
    c.meta = read(f);
    convs.set(m[1], c);
  } else if ((m = /modules\/([^/]+)\.json$/.exec(rel))) {
    modules[m[1]] = read(f);
  } else if (/\/profile\.json$/.test(rel)) {
    profile = read(f);
  }
}

const notes = path.join(root, "eng", "notes");
const lessonsDir = path.join(notes, "lessons");
fs.mkdirSync(lessonsDir, { recursive: true });

// memory and progress
if (profile?.memory) fs.writeFileSync(path.join(notes, "MEMORY.md"), profile.memory.trim() + "\n");
const done = new Set(profile?.done ?? []);
const rows = [];
for (const part of syllabus.parts) {
  const mods = syllabus.modules.filter((m) => m.part === part.id);
  const learned = mods.filter((m) => done.has(m.id)).length;
  rows.push(`\n## ${part.id} ${part.title} (${learned}/${mods.length})\n\n| מודול | דרגה | מצב | שיעורים | מבחן |\n|---|---|---|---|---|`);
  for (const m of mods) {
    const p = modules[m.id];
    const state = done.has(m.id) ? "נלמד" : (m.prereq ?? []).every((x) => done.has(x)) ? "זמין" : "נעול";
    const lessons = p?.lessons?.length ? `${p.done?.length ?? 0}/${p.lessons.length}` : "—";
    rows.push(`| ${m.id} ${m.title} | ${TIER[m.tier]} | ${state} | ${lessons} | ${p?.quizScore ?? ""} |`);
  }
}
fs.writeFileSync(
  path.join(notes, "PROGRESS.md"),
  `# התקדמות בהנדסה\n\nנלמדו ${done.size} מתוך ${syllabus.modules.length} מודולים.${profile?.current ? ` המודול האחרון שנפתח: ${profile.current}.` : ""}\n${rows.join("\n")}\n`,
);

// one Markdown file per conversation
const written = new Set();
const index = [];
for (const c of [...convs.values()].sort((a, b) => String(a.meta.moduleId).localeCompare(String(b.meta.moduleId), "en", { numeric: true }) || (a.meta.lesson ?? 0) - (b.meta.lesson ?? 0))) {
  if (!c.msgs.length) continue;
  c.msgs.sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));
  const lesson = c.meta.lesson === -1 ? "quiz" : String((c.meta.lesson ?? 0) + 1).padStart(2, "0");
  const name = `${slug(c.meta.moduleId ?? "M")}-${lesson}-${slug(c.meta.title)}-${c.id.slice(0, 6)}.md`;
  const plan = modules[c.meta.moduleId]?.lessons?.[c.meta.lesson];
  const body = c.msgs
    .map((m) =>
      m.role === "user"
        ? `## הלומד · ${MODE[m.mode] ?? ""} · ${date(m.ts)}\n\n${m.text}`
        : `## המורה${m.model ? ` · ${m.model}` : ""}${m.truncated || m.interrupted || m.draft ? " · (נקטע)" : ""}\n\n${m.text}`,
    )
    .join("\n\n---\n\n");
  const head = plan ? `מכסה: ${plan.covers.join(" · ")}\n\n` : "";
  fs.writeFileSync(path.join(lessonsDir, name), `# ${c.meta.title ?? "שיחה"}\n\n${head}${body}\n`);
  written.add(name);
  index.push(`- [${c.meta.title ?? name}](lessons/${encodeURI(name)}) · ${date(c.meta.updatedAt)} · ${c.msgs.length} הודעות`);
}
// conversations deleted in the app are removed here too (git history keeps them)
for (const f of fs.readdirSync(lessonsDir)) if (f.endsWith(".md") && !written.has(f)) fs.rmSync(path.join(lessonsDir, f));

fs.writeFileSync(
  path.join(notes, "README.md"),
  `# מחברת ההנדסה\n\nגיבוי אוטומטי של מעבדת ההנדסה: נוצר מתוך מסד הנתונים של ה-Artifact.\n\n- [זיכרון הקורס](MEMORY.md)\n- [התקדמות במודולים](PROGRESS.md)\n\n## שיחות\n\n${index.length ? index.join("\n") : "עדיין אין שיחות."}\n`,
);

// raw snapshot for a full restore
const snap = path.join(root, "eng", "backup", "db");
fs.rmSync(snap, { recursive: true, force: true });
for (const f of walk(dump).filter((f) => f.endsWith(".json"))) {
  const rel = path.relative(dump, f).replace(/data[\\/]users[\\/][^\\/]+/, "data/users/me");
  fs.mkdirSync(path.dirname(path.join(snap, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(snap, rel));
}

console.log(`profile: ${profile ? "yes" : "no"}, modules: ${Object.keys(modules).length}, conversations: ${index.length}`);
