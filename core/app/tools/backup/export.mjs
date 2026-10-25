// Turns a dump of the Study Lab artifact database into Markdown notes and a raw
// JSON snapshot inside the repository.
//
//   node app/tools/backup/export.mjs <dump-dir> <repo-root>
//
// <dump-dir> holds the documents as ArtifactData `out_dir` writes them:
//   <dump>/data/users/<id>/profile.json
//   <dump>/data/users/<id>/profile/convs/<cid>.json
//   <dump>/data/users/<id>/profile/convs/<cid>/msgs/<mid>.json
// Output (overwritten on every run, so unchanged data gives no git diff):
//   notes/MEMORY.md, notes/PROGRESS.md, notes/README.md,
//   notes/lessons/<date>-<title>.md (one file per conversation),
//   backup/db/... (the documents as JSON, for a full restore).
import fs from "node:fs";
import path from "node:path";

const [dump, root] = process.argv.slice(2);
if (!dump || !root) {
  console.error("usage: export.mjs <dump-dir> <repo-root>");
  process.exit(1);
}

const BOOKS = {
  math1: "מתמטיקה: תוכנה, שיטותיה ומשמעותה — כרך א׳",
  math2: "מתמטיקה: תוכנה, שיטותיה ומשמעותה — כרך ב׳",
  math3: "מתמטיקה: תוכנה, שיטותיה ומשמעותה — כרך ג׳",
  feyn1: "הרצאות פיינמן בפיזיקה — כרך I",
  feyn2: "הרצאות פיינמן בפיזיקה — כרך II",
  feyn3: "הרצאות פיינמן בפיזיקה — כרך III",
};
const MODE = { lesson: "שיעור על סעיף", clarify: "שאלת הבהרה", free: "חופשי" };

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
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "שיחה";

let profile = null;
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
  } else if (/\/profile\.json$/.test(rel)) {
    profile = read(f);
  }
}

const notes = path.join(root, "notes");
const lessonsDir = path.join(notes, "lessons");
fs.mkdirSync(lessonsDir, { recursive: true });

// memory and progress
if (profile?.memory) fs.writeFileSync(path.join(notes, "MEMORY.md"), profile.memory.trim() + "\n");
const progress = profile?.progress ?? {};
const progressRows = Object.entries(BOOKS).map(([id, name]) => {
  const p = progress[id];
  return `| ${name} | ${p?.page ?? "—"} | ${p?.section ?? ""} | ${p?.lessons ?? 0} | ${date(p?.updatedAt)} |`;
});
fs.writeFileSync(
  path.join(notes, "PROGRESS.md"),
  `# התקדמות בספרים\n\n| ספר | עמוד | סעיף אחרון | שיעורים | עודכן |\n|---|---|---|---|---|\n${progressRows.join("\n")}\n`,
);

// one Markdown file per conversation
const written = new Set();
const index = [];
for (const c of [...convs.values()].sort((a, b) => (a.meta.createdAt ?? 0) - (b.meta.createdAt ?? 0))) {
  if (!c.msgs.length) continue;
  c.msgs.sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));
  const name = `${date(c.meta.createdAt ?? c.msgs[0].ts)}-${slug(c.meta.title)}-${c.id.slice(0, 6)}.md`;
  const body = c.msgs
    .map((m) =>
      m.role === "user"
        ? `## 🧑 ${MODE[m.mode] ?? ""} · ${date(m.ts)}\n\n${m.text}`
        : `## 📘 המורה${m.model ? ` · ${m.model}` : ""}${m.truncated || m.interrupted ? " · (נקטע)" : ""}\n\n${m.text}`,
    )
    .join("\n\n---\n\n");
  fs.writeFileSync(path.join(lessonsDir, name), `# ${c.meta.title ?? "שיחה"}\n\n${c.meta.bookId ? `ספר: ${BOOKS[c.meta.bookId] ?? c.meta.bookId}\n\n` : ""}${body}\n`);
  written.add(name);
  index.push(`- [${c.meta.title ?? name}](lessons/${encodeURI(name)}) · ${date(c.meta.updatedAt)} · ${c.msgs.length} הודעות`);
}
// conversations deleted in the app are removed here too (git history keeps them)
for (const f of fs.readdirSync(lessonsDir)) if (f.endsWith(".md") && !written.has(f)) fs.rmSync(path.join(lessonsDir, f));

fs.writeFileSync(
  path.join(notes, "README.md"),
  `# מחברת הלמידה\n\nגיבוי אוטומטי של [מעבדת הלמידה](https://claude.ai/artifact/GQEfh2pKMGTUE5ARKh5rPb): נוצר מתוך מסד הנתונים של ה-Artifact.\n\n- [זיכרון הקורס](MEMORY.md)\n- [התקדמות בספרים](PROGRESS.md)\n\n## שיחות\n\n${index.length ? index.join("\n") : "עדיין אין שיחות."}\n`,
);

// raw snapshot for a full restore
const snap = path.join(root, "backup", "db");
fs.rmSync(snap, { recursive: true, force: true });
for (const f of walk(dump).filter((f) => f.endsWith(".json"))) {
  const rel = path.relative(dump, f).replace(/data[\\/]users[\\/][^\\/]+/, "data/users/me");
  fs.mkdirSync(path.dirname(path.join(snap, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(snap, rel));
}

console.log(`profile: ${profile ? "yes" : "no"}, conversations: ${index.length}, files under notes/ and backup/db/`);
