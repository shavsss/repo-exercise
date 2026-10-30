// Turns a dump of the Core Lab artifact database into Markdown notes and a raw
// JSON snapshot inside the repository.
//
//   node core/app/tools/backup/export.mjs <dump-dir> <repo-root>
//
// <dump-dir> holds the documents as ArtifactData `out_dir` writes them:
//   <dump>/data/users/<id>/profile.json
//   <dump>/data/users/<id>/profile/modules/<module id>.json
//   <dump>/data/users/<id>/profile/convs/<cid>.json
//   <dump>/data/users/<id>/profile/convs/<cid>/msgs/<mid>.json
//   <dump>/data/users/<id>/profile/convs/<cid>/msgs/<mid>/more/<n>.json
//   <dump>/data/users/<id>/profile/<collection>/<doc>.json for the other collections (docs/BACKUP.md),
//   and <dump>/data/users/<id>/profile/consults/<module>__<lesson>/cards/<card>.json
// Output (overwritten on every run, so unchanged data gives no git diff):
//   core/notes/MEMORY.md, core/notes/PROGRESS.md, core/notes/README.md,
//   core/notes/lessons/<module>-<lesson>-<title>.md (one file per conversation),
//   core/backup/db/... (the documents as JSON, for a full restore).
import fs from "node:fs";
import path from "node:path";

const [dump, root] = process.argv.slice(2);
if (!dump || !root) {
  console.error("usage: export.mjs <dump-dir> <repo-root>");
  process.exit(1);
}

const syllabus = JSON.parse(fs.readFileSync(path.join(root, "library/military/syllabus/syllabus.json"), "utf8"));
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
const memlog = [];
const calib = [];
const consultCards = [];
const level3 = [];
const products = [];
const reviews = [];
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
  } else if ((m = /profile\/consults\/([^/]+)\/cards\/([^/]+)\.json$/.exec(rel))) {
    consultCards.push({ ...read(f), id: m[2], lessonKey: m[1] });
  } else if (/profile\/(consults|events|usage|diag|news|newsfb|dict)\/[^/]+\.json$/.test(rel)) {
    // kept only in the raw snapshot below
  } else if (/profile\/memlog\/[^/]+\.json$/.test(rel)) {
    memlog.push(read(f));
  } else if ((m = /profile\/calib\/([^/]+)\.json$/.exec(rel))) {
    calib.push({ id: m[1], ...read(f) });
  } else if ((m = /profile\/level3\/([^/]+)\.json$/.exec(rel))) {
    level3.push({ ...read(f), key: m[1] });
  } else if ((m = /profile\/products\/([^/]+)\.json$/.exec(rel))) {
    products.push({ ...read(f), month: m[1] });
  } else if ((m = /profile\/reviews\/([^/]+)\.json$/.exec(rel))) {
    reviews.push({ ...read(f), id: m[1] });
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

const notes = path.join(root, "core", "notes");
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
  `# התקדמות בליבה\n\nנלמדו ${done.size} מתוך ${syllabus.modules.length} מודולים.${profile?.current ? ` המודול האחרון שנפתח: ${profile.current}.` : ""}\n${rows.join("\n")}\n`,
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
  `# מחברת הליבה\n\nגיבוי אוטומטי של מעבדת הליבה: נוצר מתוך מסד הנתונים של ה-Artifact.\n\n- [זיכרון הקורס](MEMORY.md)\n- [התקדמות במודולים](PROGRESS.md)\n- [מחברת השיעורים](NOTEBOOK.md)\n- [הסיכומים](SUMMARIES.md)\n- [מחברת השרטוטים והפתרונות](SCRATCH.md)\n- [כרטיסי ההתייעצות](CONSULTS.md)\n- [כיול: שאלות think](CALIBRATION.md)\n- [תשובות רמה 3](LEVEL3.md)\n- [מוצר החודש](PRODUCTS.md)\n- [הסקירות השבועיות](REVIEWS.md)\n- [גרסאות של זיכרון הקורס](MEMORY_LOG.md)\n\n## שיחות\n\n${index.length ? index.join("\n") : "עדיין אין שיחות."}\n`,
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

// ---- the collections added on 31.10: memory versions, calibration, consultation cards,
// level-3 answers, the month's product and the weekly reviews. Each file is written even when
// its collection is absent (an older dump), so the README links always open.
const when = (ms) => (ms ? new Date(ms).toISOString().slice(0, 16).replace("T", " ") : "");
const modTitle = (id) => syllabus.modules.find((m) => m.id === id)?.title ?? "";
const lessonLabel = (key) => {
  const [mod, l] = String(key).split("__");
  const n = Number(l);
  return `${mod} · ${n === -1 ? "מבחן מסכם" : l !== undefined && Number.isFinite(n) ? `שיעור ${n + 1}` : l ?? ""}${modTitle(mod) ? ` · ${modTitle(mod)}` : ""}`;
};
const byKey = (a, b) => String(a).localeCompare(String(b), "en", { numeric: true });
const quote = (s) => String(s ?? "").trim().replace(/\n/g, "\n> ");
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();

// course memory versions (profile/memlog), newest first
fs.writeFileSync(
  path.join(notes, "MEMORY_LOG.md"),
  `# גרסאות של זיכרון הקורס\n\nכל נוסח קודם של זיכרון הקורס, לפני שהוחלף (מהחדש לישן). הנוסח הנוכחי ב-[MEMORY.md](MEMORY.md).\n\n${
    [...memlog].sort((a, b) => (b.at ?? 0) - (a.at ?? 0)).map((v) => `## ${when(v.at)}${v.reason ? ` · ${v.reason}` : ""}\n\n<details><summary>הנוסח (${String(v.memory ?? "").length} תווים)</summary>\n\n${String(v.memory ?? "").trim()}\n\n</details>`).join("\n\n") || "עדיין אין גרסאות קודמות."
  }\n`,
);

// calibration of the think questions (profile/calib)
const CONF = { 1: "מנחש", 2: "די בטוח", 3: "בטוח" };
const GRADE = { right: "צדקתי", partial: "בחלקו", wrong: "טעיתי" };
const ctab = { 1: {}, 2: {}, 3: {} };
for (const r of calib) if (ctab[r.conf]) ctab[r.conf][r.grade ?? "open"] = (ctab[r.conf][r.grade ?? "open"] ?? 0) + 1;
const calibByLesson = new Map();
for (const r of [...calib].sort((a, b) => byKey(a.moduleId, b.moduleId) || (a.lesson ?? 0) - (b.lesson ?? 0) || (a.ts ?? 0) - (b.ts ?? 0))) {
  const k = `${r.moduleId}__${r.lesson}`;
  calibByLesson.set(k, [...(calibByLesson.get(k) ?? []), r]);
}
fs.writeFileSync(
  path.join(notes, "CALIBRATION.md"),
  `# כיול: שאלות think\n\nכמה הייתי בטוח לפני התשובה, ואם צדקתי.\n\n${
    calib.length
      ? `| ביטחון | צדקתי | בחלקו | טעיתי | בלי בדיקה |\n|---|---|---|---|---|\n${[1, 2, 3].map((c) => `| ${CONF[c]} | ${ctab[c].right ?? 0} | ${ctab[c].partial ?? 0} | ${ctab[c].wrong ?? 0} | ${ctab[c].open ?? 0} |`).join("\n")}\n\n${[...calibByLesson]
          .map(([k, list]) => `## ${lessonLabel(k)}\n\n${list.map((r) => `- **${CONF[r.conf] ?? r.conf} → ${GRADE[r.grade] ?? "בלי בדיקה"}**${r.conf === 3 && r.grade === "wrong" ? " ⚠️" : ""} (${date(r.ts)}): ${cell(r.q)}${String(r.answer ?? "").trim() ? `\n   - עניתי: ${cell(r.answer)}` : ""}`).join("\n")}`)
          .join("\n\n")}`
      : "עדיין אין תשובות."
  }\n`,
);

// consultation cards (profile/consults/<module>__<lesson>/cards)
const CKIND = { explain: "הסבר פשוט", why: "למה?", example: "דוגמה", check: "בדוק אותי", ask: "שאלה" };
const cardsByLesson = new Map();
for (const c of consultCards) cardsByLesson.set(c.lessonKey, [...(cardsByLesson.get(c.lessonKey) ?? []), c]);
fs.writeFileSync(
  path.join(notes, "CONSULTS.md"),
  `# כרטיסי ההתייעצות\n\nהשאלות ששאלתי בתוך השיעורים, ליד הפסקה שעליה שאלתי, עם התשובות.\n\n${
    [...cardsByLesson]
      .sort(([a], [b]) => byKey(a, b))
      .map(([k, list]) => `## ${lessonLabel(k)}\n\n${list
        .sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0))
        .map((c) => `### ${CKIND[c.kind] ?? c.kind ?? "שאלה"} · ${date(c.ts)}${c.hidden ? " · (הוסר מהשיעור)" : ""}\n\n${c.anchor ? `ליד: "${cell(c.anchor).slice(0, 160)}"\n\n` : ""}${c.quote ? `> ${quote(c.quote)}\n\n` : ""}${(c.turns ?? []).map((t) => `**שאלה${t.discuss ? " (דיון)" : ""}:** ${String(t.q ?? "").trim()}\n\n**תשובה${t.model ? ` · ${t.model}` : ""}${t.cut ? " · (נקטע)" : ""}:**\n\n${String(t.a ?? "").trim()}`).join("\n\n")}`)
        .join("\n\n")}`)
      .join("\n\n---\n\n") || "עדיין אין כרטיסים."
  }\n`,
);

// level-3 answers (profile/level3/<module>__<lesson>)
const L3KIND = { predict: "תחזית", errorhunt: "ציד שגיאות", verify: "אימות", lab: "משימת מעבדה", decide: "החלטה" };
fs.writeFileSync(
  path.join(notes, "LEVEL3.md"),
  `# תשובות רמה 3\n\nמה שכתבתי בבלוקים של רמה 3: תחזיות, ציד שגיאות, אימות, משימות מעבדה והחלטות.\n\n${
    [...level3]
      .filter((d) => d.items && typeof d.items === "object" && Object.keys(d.items).length)
      .sort((a, b) => byKey(a.key, b.key))
      .map((d) => `## ${lessonLabel(d.key)} (${date(d.updatedAt)})\n\n${Object.values(d.items)
        .filter(Boolean)
        .sort((a, b) => (a.at ?? 0) - (b.at ?? 0))
        .map((a) => {
          const bits = [String(a.text ?? "").trim() ? cell(a.text) : "", a.low || a.high ? `טווח 90%: ${a.low ?? "?"}–${a.high ?? "?"}` : "", a.checked?.length ? `סומנו ${a.checked.length} בדיקות` : "", a.done ? "בוצע" : "", a.noError ? "לדעתי אין שגיאה" : "", a.revealed ? "(נפתחה תשובת הייחוס)" : ""].filter(Boolean);
          return `- **${L3KIND[a.kind] ?? a.kind}:** ${bits.join(" · ") || "—"}`;
        })
        .join("\n")}`)
      .join("\n\n") || "עדיין אין תשובות."
  }\n`,
);

// the month's product (profile/products/<YYYY-MM>)
const STAGE = { idea: "רעיון", legal: "בדיקת חוקיות", spec: "מפרט ושוק", design: "תכן ותחזיות", verify: "תוכנית אימות", package: "אריזה", retro: "סיכום" };
const LEGAL = { na: "לא נוגע", ok: "בסדר כמו שהוא", adjust: "בסדר עם התאמה", ask: "לברר קודם" };
const NEXT = { users: "למשתמשים", v2: "גרסה 2", sale: "מכירה", close: "סגירה" };
const field = (label, v) => (String(v ?? "").trim() ? `**${label}:** ${String(v).trim()}` : "");
const productMd = (p) => {
  const out = [`## ${p.month}${p.title ? ` · ${p.title}` : ""} (${date(p.updatedAt)})`];
  const sec = (id, lines) => {
    const l = lines.filter(Boolean);
    if (l.length) out.push(`### ${STAGE[id]}\n\n${l.join("\n\n")}`);
  };
  sec("idea", [field("השאלה", p.idea?.question), field("למי", p.idea?.forWhom), field("במה זה טוב יותר", p.idea?.better), field("מהשיעורים", p.idea?.fromLessons)]);
  const ans = Object.entries(p.legal?.answers ?? {}).filter(([, v]) => v);
  sec("legal", [ans.length ? ans.map(([k, v]) => `- ${k}: ${LEGAL[v] ?? v}${String(p.legal?.notes?.[k] ?? "").trim() ? ` (${cell(p.legal.notes[k])})` : ""}`).join("\n") : "", field("התאמות", p.legal?.adjustments), p.legal?.doneAt ? `נחתם ב-${date(p.legal.doneAt)}` : ""]);
  const comps = (p.spec?.competitors ?? []).filter((c) => String(c?.name ?? "").trim());
  sec("spec", [field("מפרט", p.spec?.spec), comps.length ? `**מתחרים:**\n${comps.map((c) => `- ${c.name}${c.url ? ` (${c.url})` : ""}${c.note ? `: ${cell(c.note)}` : ""}`).join("\n")}` : "", field("בנצ'מרק", p.spec?.benchmark), field("מחיר", p.spec?.price)]);
  const preds = (p.design?.predictions ?? []).filter((x) => String(x?.quantity ?? "").trim());
  sec("design", [field("החלטות", p.design?.decisions), field("פשרות", p.design?.tradeoffs), preds.length ? `| גודל | תחזית | בסיס | בפועל |\n|---|---|---|---|\n${preds.map((x) => `| ${cell(x.quantity)} | ${cell(x.value)} | ${cell(x.basis)} | ${cell(x.actual)} |`).join("\n")}` : ""]);
  const checks = (p.verify?.checks ?? []).filter((c) => String(c?.result ?? "").trim());
  sec("verify", [checks.length ? `| תוצאה | סוג | איך | מתי עובר | מצב |\n|---|---|---|---|---|\n${checks.map((c) => `| ${cell(c.result)} | ${cell(c.kind)} | ${cell(c.how)} | ${cell(c.pass)} | ${cell(c.status)} |`).join("\n")}` : "", field("baseline", p.verify?.baseline)]);
  const ticked = Object.values(p.package?.checklist ?? {}).filter(Boolean).length;
  sec("package", [ticked ? `סומנו ${ticked} פריטים ברשימת הבדיקה` : "", field("מאגר", p.package?.repo), (p.package?.comparables ?? []).filter((c) => String(c?.name ?? "").trim()).map((c) => `- ${c.name}${c.url ? ` (${c.url})` : ""}`).join("\n")]);
  sec("retro", [field("מה עבד", p.retro?.worked), field("מה נכשל", p.retro?.failed), field("מה למדתי", p.retro?.learned), p.retro?.next ? `**הלאה:** ${NEXT[p.retro.next] ?? p.retro.next}` : ""]);
  const crit = Object.entries(p.critiques ?? {}).filter(([, c]) => String(c?.text ?? "").trim());
  if (crit.length) out.push(`### ביקורת המורה\n\n${crit.map(([k, c]) => `**${STAGE[k] ?? k}** (${date(c.at)}):\n\n${c.text.trim()}`).join("\n\n")}`);
  return out.join("\n\n");
};
fs.writeFileSync(
  path.join(notes, "PRODUCTS.md"),
  `# מוצר החודש\n\nסביבת העבודה של המוצר החודשי, חודש אחר חודש.\n\n${[...products].sort((a, b) => byKey(b.month, a.month)).map(productMd).join("\n\n---\n\n") || "עדיין אין מוצרים."}\n`,
);

// the weekly reviews (profile/reviews/<YYYY-Www>), newest first
const reviewMd = (r) => {
  const out = [`## ${r.id}${r.week?.from ? ` (${r.week.from} – ${r.week.to})` : ""}${r.example ? " · דוגמה" : ""}`];
  if (r.summary) out.push(String(r.summary).trim());
  const doms = (Array.isArray(r.domains) ? r.domains : []).filter(Boolean);
  if (doms.length) out.push(`| תחום | עכשיו | יעד | שינוי | ראיות | הצעד הבא |\n|---|---|---|---|---|---|\n${doms.map((d) => `| ${cell(d.name ?? d.id)} | ${d.score ?? ""} | ${d.targetScore ?? ""} | ${d.delta ?? ""} | ${cell(d.evidence)} | ${cell(d.next)} |`).join("\n")}`);
  for (const v of (Array.isArray(r.reviewers) ? r.reviewers : []).filter(Boolean)) out.push(`### ${v.title ?? v.persona ?? "סוקר"}\n\n${[v.focus ? `*${v.focus}*` : "", String(v.notes ?? "").trim(), v.verdict ? `**שורה תחתונה:** ${v.verdict}` : ""].filter(Boolean).join("\n\n")}`);
  if (r.calibration) out.push(`**כיול:** ${r.calibration.predictions ?? 0} תחזיות${r.calibration.brier !== undefined ? `, Brier ${r.calibration.brier}` : ""}, ${r.calibration.confidentWrong ?? 0} בטוח-וטעה. ${r.calibration.note ?? ""}`);
  if (r.product) out.push(`**מוצר החודש:** ${r.product.title ?? r.product.month} · ${r.product.stage} · ${r.product.score}. ${r.product.notes ?? ""}`);
  if (r.leadDecide) out.push(`**מוביל ומחליט:** ${r.leadDecide.score}. ${r.leadDecide.note ?? ""}${(r.leadDecide.items ?? []).map((i) => `\n- ${i.title} (${i.score}): ${cell(i.note)}`).join("")}`);
  if (r.actions?.length) out.push(`**לשבוע הבא:**\n${r.actions.map((a) => `- ${a.text}${a.domain ? ` (${a.domain})` : ""}`).join("\n")}`);
  return out.join("\n\n");
};
fs.writeFileSync(
  path.join(notes, "REVIEWS.md"),
  `# הסקירות השבועיות\n\nהסקירה החיצונית של כל שבוע (מהחדשה לישנה).\n\n${[...reviews].sort((a, b) => byKey(b.id, a.id)).map(reviewMd).join("\n\n---\n\n") || "עדיין אין סקירות."}\n`,
);

// raw snapshot for a full restore
const snap = path.join(root, "core", "backup", "db");
fs.rmSync(snap, { recursive: true, force: true });
for (const f of walk(dump).filter((f) => f.endsWith(".json"))) {
  const rel = path.relative(dump, f).replace(/data[\\/]users[\\/][^\\/]+/, "data/users/me");
  fs.mkdirSync(path.dirname(path.join(snap, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(snap, rel));
}

console.log(`profile: ${profile ? "yes" : "no"}, modules: ${Object.keys(modules).length}, conversations: ${index.length}, notebook items: ${notebook.length}, summaries: ${sums.length}, scratch: ${scratchMd.length}, memory versions: ${memlog.length}, calibration: ${calib.length}, consultation cards: ${consultCards.length}, level-3 lessons: ${level3.length}, products: ${products.length}, reviews: ${reviews.length}`);
