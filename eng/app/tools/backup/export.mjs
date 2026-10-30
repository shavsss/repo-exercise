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
const notebook = [];
const summaries = [];
const scratch = [];
const more = new Map();
for (const f of walk(dump).filter((f) => f.endsWith(".json"))) {
  const rel = path.relative(dump, f).split(path.sep).join("/");
  let m;
  if ((m = /convs\/([^/]+)\/msgs\/([^/]+)\/more\/(\d+)\.json$/.exec(rel))) {
    // the rest of a long message's text (Store.saveMessage), joined below
    more.set(`${m[1]}/${m[2]}/${m[3]}`, String(read(f).text ?? ""));
  } else if ((m = /convs\/([^/]+)\/msgs\/([^/]+)\.json$/.exec(rel))) {
    const c = convs.get(m[1]) ?? { id: m[1], meta: {}, msgs: [] };
    c.msgs.push({ ...read(f), _id: m[2] });
    convs.set(m[1], c);
  } else if ((m = /convs\/([^/]+)\.json$/.exec(rel))) {
    const c = convs.get(m[1]) ?? { id: m[1], meta: {}, msgs: [] };
    c.meta = read(f);
    convs.set(m[1], c);
  } else if ((m = /profile\/scratch\/([^/]+)\.json$/.exec(rel))) {
    scratch.push({ key: m[1], ...read(f) });
  } else if (/profile\/summaries\/[^/]+\.json$/.test(rel)) {
    summaries.push(read(f));
  } else if (/profile\/summaryMeta\/[^/]+\.json$/.test(rel)) {
    // the tree's status, also inside each summary
  } else if (/profile\/notes\/[^/]+\.json$/.test(rel)) {
    notebook.push(read(f));
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
  for (const msg of c.msgs) for (let i = 1; i <= (msg.textParts ?? 0); i++) msg.text += more.get(`${c.id}/${msg._id}/${i}`) ?? "";
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

// the lessons' shared notebook: article ideas, interview questions, points to deepen
const KIND = { article: "רעיון למאמר", interview: "שאלה לראיון", deepen: "להעמקה", note: "הערה" };
const byLesson = new Map();
for (const n of notebook.sort((a, b) => (a.moduleId ?? "").localeCompare(b.moduleId ?? "") || (a.lesson ?? 0) - (b.lesson ?? 0) || (a.ts ?? 0) - (b.ts ?? 0))) {
  const k = `${n.moduleId} · ${n.lesson === -1 ? "מבחן מסכם" : `שיעור ${(n.lesson ?? 0) + 1}${n.lessonTitle ? `: ${n.lessonTitle}` : ""}`}`;
  byLesson.set(k, [...(byLesson.get(k) ?? []), n]);
}
fs.writeFileSync(
  path.join(notes, "NOTEBOOK.md"),
  `# מחברת השיעורים\n\nמה שהלומד והמורה שמרו בשיעורים: רעיונות למאמרים, שאלות לראיונות ונקודות להעמקה.\n\n${
    [...byLesson].map(([k, list]) => `## ${k}\n\n${list.map((n) => { const [head, ...pts] = String(n.text).split("\n"); return `- **${KIND[n.kind] ?? n.kind}** (${n.who === "tutor" ? "המורה" : "הלומד"}, ${date(n.ts)}): ${head}${pts.filter((x) => x.trim()).map((x) => `\n   - ${x.replace(/^\s*[-•]\s*/, "")}`).join("")}`; }).join("\n")}`).join("\n\n") || "עדיין אין פריטים."
  }\n`,
);

fs.writeFileSync(
  path.join(notes, "README.md"),
  `# מחברת ההנדסה\n\nגיבוי אוטומטי של מעבדת ההנדסה: נוצר מתוך מסד הנתונים של ה-Artifact.\n\n- [זיכרון הקורס](MEMORY.md)\n- [התקדמות במודולים](PROGRESS.md)\n- [מחברת השיעורים](NOTEBOOK.md)\n- [הסיכומים](SUMMARIES.md)\n- [מחברת השרטוטים והפתרונות](SCRATCH.md)\n\n## שיחות\n\n${index.length ? index.join("\n") : "עדיין אין שיחות."}\n`,
);

// the summaries notebook (#summary): one Markdown file with every module's summary
const BOX = { def: "📘 הגדרה", eq: "🧮 נוסחה מרכזית", ex: "🔢 דוגמה מספרית", err: "⚠️ טעות נפוצה", q: "❓ שאלה פתוחה", con: "✅ מסקנה" };
const MARK = { y: "חשוב", r: "טעות", b: "הגדרה", g: "תובנה", p: "משתנה", o: "הנחת יסוד" };
const PROOF = { def: "הגדרה", hyp: "הנחה", giv: "נתון", dev: "פיתוח", con: "מסקנה" };
/** Lists inside a block, as lines with their numbers (1., 1.1) or bullets; as flatLists in the app. */
function flatLists(html) {
  if (!/<(ol|ul)[ >]/.test(html)) return html;
  const stack = [];
  let out = "";
  for (const part of html.split(/(<\/?(?:ol|ul|li)(?: [a-z-]+="[^"]*")*>)/)) {
    const m = /^<(\/?)(ol|ul|li)((?: [a-z-]+="[^"]*")*)>$/.exec(part);
    if (!m) {
      out += stack.length ? part.replace(/<br>$/, "") : part;
      continue;
    }
    const [, close, tag] = m;
    if (tag !== "li") {
      if (close) stack.pop();
      else stack.push({ ordered: tag === "ol", n: Number(/start="(\d+)"/.exec(m[3])?.[1] ?? 1) - 1, proof: /class="[^"]*\bproof\b/.test(m[3]) ? {} : null });
      out += "\u0004";
    } else if (close) out += "\u0004";
    else if (stack.length) {
      const top = stack[stack.length - 1];
      top.n++;
      if (top.proof) {
        const k = /k-(\w+)/.exec(m[3])?.[1] ?? "def";
        top.proof[k] = (top.proof[k] ?? 0) + 1;
        out += `\u0004${"   ".repeat(stack.length - 1)}**${PROOF[k] ?? k} ${top.proof[k]}:** `;
        continue;
      }
      const nums = stack.filter((x) => x.ordered).map((x) => x.n);
      out += `\u0004${"   ".repeat(stack.length - 1)}${top.ordered ? (nums.length === 1 ? `${nums[0]}.` : nums.join(".")) : "-"} `;
    }
  }
  return out.replace(/(<br>)?\u0004(<br>)?/g, "\u0004").replace(/\u0004+/g, "<br>").replace(/^<br>|<br>$/g, "");
}
const plain = (h) =>
  flatLists(String(h ?? ""))
    .replace(/<span[^>]*data-tex="([^"]*)"[^>]*>.*?<\/span>/g, (_, t) => `$${t.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")}$`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(b|strong)>/gi, "**")
    .replace(/<\/?(i|em)>/gi, "*")
    .replace(/<mark class="hl-(\w)">/gi, (_, c) => `<mark title="${MARK[c] ?? ""}">`)
    .replace(/<(?!\/?mark)[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
function summaryMd(s) {
  const c = [0, 0, 0];
  let eq = 0;
  const out = [];
  for (const b of s.blocks ?? []) {
    if (b.t === "h" && b.cont) {
      if (plain(b.html).trim()) out.push(plain(b.html));
    } else if (b.t === "h") {
      let n = "";
      if (!b.plain) {
        c[b.level - 1]++;
        for (let j = b.level; j < 3; j++) c[j] = 0;
        n = c.slice(0, b.level).map((x) => x || 1).join(".") + " ";
      }
      // a list written under the heading's text goes below the heading line
      const html = String(b.html ?? "");
      const i = html.search(/<(ol|ul)[ >]/);
      out.push(`${"#".repeat(Math.min(6, b.level + 2))} ${b.emoji ? b.emoji + " " : ""}${n}${plain(i < 0 ? html : html.slice(0, i))}`);
      if (i >= 0) out.push(plain(html.slice(i)));
    } else if (b.t === "p") {
      if (plain(b.html).trim()) out.push(plain(b.html));
    } else if (b.t === "list") {
      const k = [0, 0, 0];
      out.push(
        (b.items ?? [])
          .map((it) => {
            const l = Math.min(2, it.level ?? 0);
            k[l]++;
            for (let j = l + 1; j < 3; j++) k[j] = 0;
            return `${"   ".repeat(l)}${b.ordered ? `${k[l]}.` : "-"} ${plain(it.html)}`;
          })
          .join("\n"),
      );
    } else if (b.t === "box") {
      const m = b.latex?.trim() ? `$$${b.latex}$$${b.kind === "eq" ? ` (${++eq})` : ""}` : "";
      out.push(`> **${BOX[b.kind] ?? b.kind}${b.title?.trim() ? ` · ${b.title.trim()}` : ""}:** ${[m, plain(b.html)].filter((x) => x.trim()).join("\n> ")}`);
    } else if (b.t === "math") {
      if (b.latex?.trim()) out.push(`$$${b.latex}$$${b.plain ? "" : ` (${++eq})`}`);
    } else if (b.t === "img") out.push(`[תמונה${b.caption ? `: ${b.caption}` : ""}]${String(b.src).startsWith("data:") ? "" : ` (${b.src})`}`);
    else if (b.t === "fig") out.push(`[איור מהספר ${b.doc}, עמ' PDF ${String(b.key).split("-")[0]}${b.caption ? `: ${b.caption}` : ""}]`);
    else if (b.t === "hr") out.push("---");
  }
  return out.join("\n\n");
}
const STATUS = { none: "לא התחיל", draft: "טיוטה", done: "מוכן" };
const sums = [...summaries].filter((s) => (s.blocks ?? []).length).sort((a, b) => String(a.moduleId).localeCompare(String(b.moduleId), "en", { numeric: true }));
fs.writeFileSync(
  path.join(notes, "SUMMARIES.md"),
  `# הסיכומים\n\nהסיכומים שכתבתי, מודול אחר מודול (מתוך מחברת הסיכומים, #summary). תמונות מופיעות כקישור.\n\n${
    sums.map((s) => `## ${s.moduleId} · ${syllabus.modules.find((m) => m.id === s.moduleId)?.title ?? ""} (${STATUS[s.status] ?? ""}, ${date(s.updatedAt)})\n\n${summaryMd(s)}`).join("\n\n---\n\n") || "עדיין אין סיכומים."
  }\n`,
);

// the lesson notebook (drawings and worked solutions): SCRATCH.md, each drawing an SVG beside it
const scratchDir = path.join(notes, "scratch");
fs.rmSync(scratchDir, { recursive: true, force: true });
const strokePath = (s) => {
  const p = s.pts ?? [];
  if (p.length < 4) return "";
  if (s.k) {
    let d = `M${p[0]} ${p[1]} L${p[p.length - 2]} ${p[p.length - 1]}`;
    if (s.k === "arrow") {
      const [x1, y1, x2, y2] = [p[0], p[1], p[p.length - 2], p[p.length - 1]];
      const a = Math.atan2(y2 - y1, x2 - x1);
      const L = 10 + (s.w ?? 2) * 3;
      d += ` M${x2} ${y2} L${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} M${x2} ${y2} L${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)}`;
    }
    return d;
  }
  let d = `M${p[0]} ${p[1]}`;
  for (let i = 2; i < p.length - 2; i += 2) d += ` Q${p[i]} ${p[i + 1]} ${(p[i] + p[i + 2]) / 2} ${(p[i + 1] + p[i + 3]) / 2}`;
  return d + ` L${p[p.length - 2]} ${p[p.length - 1]}`;
};
const drawingSvg = (b) => {
  const W = 1000;
  const h = b.h ?? 400;
  const grid = [];
  if (b.bg !== "plain") {
    for (let x = 25; x < W; x += 25) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`);
    for (let y = 25; y < h; y += 25) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
  }
  const axes = b.bg === "axes" ? `<g stroke="#888" stroke-width="1.4" fill="none"><line x1="40" y1="${h / 2}" x2="${W - 20}" y2="${h / 2}"/><line x1="${W / 2}" y1="${h - 20}" x2="${W / 2}" y2="20"/></g>` : "";
  const strokes = (b.strokes ?? []).map((s) => `<path d="${strokePath(s)}" stroke="${s.c}" stroke-width="${s.w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}"><rect width="${W}" height="${h}" fill="#fffdf7"/><g stroke="#e6e2d6" stroke-width="0.8">${grid.join("")}</g>${axes}${strokes}</svg>\n`;
};
const scratchMd = [];
for (const sc of [...scratch].sort((a, b) => String(a.key).localeCompare(String(b.key), "en", { numeric: true }))) {
  const [mod, lesson] = String(sc.key).split("__");
  const pages = (sc.pages ?? []).filter((pg) => (pg.blocks ?? []).some((b) => (b.t === "draw" && b.strokes?.length) || (b.t === "text" && b.text?.trim()) || (b.t === "math" && b.latex?.trim())));
  if (!pages.length) continue;
  const part = [`## ${mod} · שיעור ${Number(lesson) + 1} · ${syllabus.modules.find((m) => m.id === mod)?.title ?? ""} (${date(sc.updatedAt)})`];
  pages.forEach((pg, pi) => {
    part.push(`### ${pg.title || `דף ${pi + 1}`}`);
    let n = 0;
    for (const b of pg.blocks ?? []) {
      if (b.t === "text" && b.text?.trim()) part.push(b.text.trim());
      else if (b.t === "math" && b.latex?.trim()) part.push(`$$${b.latex}$$`);
      else if (b.t === "draw" && b.strokes?.length) {
        const file = `${slug(sc.key)}-${pi + 1}-${++n}.svg`;
        fs.mkdirSync(scratchDir, { recursive: true });
        fs.writeFileSync(path.join(scratchDir, file), drawingSvg(b));
        part.push(`![שרטוט ${n}](scratch/${file})`);
      }
    }
    if (pg.check?.trim()) part.push(`> **בדיקת הפתרון:** ${pg.check.trim().replace(/\n/g, "\n> ")}`);
  });
  scratchMd.push(part.join("\n\n"));
}
fs.writeFileSync(
  path.join(notes, "SCRATCH.md"),
  `# מחברת השרטוטים והפתרונות\n\nמה שכתבתי ושרטטתי במחברת שליד השיעורים, שיעור אחר שיעור. השרטוטים בתיקייה scratch/.\n\n${scratchMd.join("\n\n---\n\n") || "עדיין אין כלום במחברת."}\n`,
);

// raw snapshot for a full restore
const snap = path.join(root, "eng", "backup", "db");
fs.rmSync(snap, { recursive: true, force: true });
for (const f of walk(dump).filter((f) => f.endsWith(".json"))) {
  const rel = path.relative(dump, f).replace(/data[\\/]users[\\/][^\\/]+/, "data/users/me");
  fs.mkdirSync(path.dirname(path.join(snap, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(snap, rel));
}

console.log(`profile: ${profile ? "yes" : "no"}, modules: ${Object.keys(modules).length}, conversations: ${index.length}, notebook items: ${notebook.length}, summaries: ${sums.length}, scratch: ${scratchMd.length}`);
