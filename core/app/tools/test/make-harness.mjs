// Builds a local test page that runs the artifact with a fake claude.ai runtime
// (tools/test/stub.js: in-memory db kept in localStorage, a fixed user, a scripted
// `sample`). Run after `npm run build` and tools/pack.py, then serve the folder:
//
//   node tools/test/make-harness.mjs /tmp/harness && (cd /tmp/harness && python3 -m http.server 5190)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "../..");
const out = path.resolve(process.argv[2] ?? "/tmp/core-lab-harness");
fs.mkdirSync(out, { recursive: true });

for (const f of ["app.js", "app.css"]) fs.copyFileSync(path.join(app, "dist", f), path.join(out, f));
fs.copyFileSync(path.join(here, "stub.js"), path.join(out, "stub.js"));
const lib = path.join(out, "lib");
fs.rmSync(lib, { recursive: true, force: true });
fs.symlinkSync(path.join(app, "artifact", "lib"), lib);
// bundles kept in the artifact's asset store (pack.py ASSET_DOCS) are served from here; stub.js maps their URLs
const assets = path.join(out, "assets");
fs.rmSync(assets, { recursive: true, force: true });
if (fs.existsSync(path.join(app, "artifact", "assets"))) fs.symlinkSync(path.join(app, "artifact", "assets"), assets);

// The first module, and a figure from its main source, for the scripted lesson.
const index = JSON.parse(fs.readFileSync(path.join(app, "artifact", "lib", "index.json"), "utf8"));
const mod = index.modules.find((m) => !m.prereq?.length && index.docs[m.sources[0].doc]);
const src = mod.sources[0];
const doc = src.doc;
const figPage = Object.keys(index.docs[doc].figs).map(Number).find((p) => p >= src.pages[0] && p <= src.pages[1]) ?? Number(Object.keys(index.docs[doc].figs)[0]);
const lessons = [
  { title: "שיעור ראשון לבדיקה", covers: mod.sections.slice(0, 2).map((s) => s.title), sources: [{ doc, pages: [src.pages[0], Math.min(src.pages[1], src.pages[0] + 6)] }], focus: "מה השיעור מלמד." },
  { title: "שיעור שני לבדיקה", covers: mod.sections.slice(2).map((s) => s.title), sources: [{ doc, pages: [Math.min(src.pages[1], src.pages[0] + 7), src.pages[1]] }], focus: "ההמשך." },
];

// What the scripted tutor "writes" for part 1 of a lesson: one of each block.
const answer = `\`\`\`plan
1. שיעור ראשון (כאן)
2. שיעור שני
\`\`\`

\`\`\`story
@title: סיפור לבדיקה
טקסט הסיפור. [[ודאות: גבוהה]]
\`\`\`

## חלק 1

[[${doc}:${src.pages[0]}]] פסקה עם תגית עמוד, ומשוואה ממוספרת:

$$P_r = \\frac{P_t G^2 \\lambda^2 \\sigma}{(4\\pi)^3 R^4} \\tag{1}$$

\`\`\`figure
${doc}:${figPage}:0
\`\`\`

\`\`\`think
שאלה לבדיקה?
---
תשובה.
\`\`\`

\`\`\`sim
{"id": "radar_range", "title": "טווח גילוי", "params": {"rcs": 0.1}}
\`\`\`

\`\`\`anim
{"title": "מטרה מתקרבת", "duration": 6, "view": {"x": [-10, 10], "y": [-6, 6]}, "shapes": [{"type": "circle", "x": "-8 + 2*t", "y": "0", "r": "0.4", "label": "מטרה", "accent": true}, {"type": "text", "x": "0", "y": "5", "text": "R = {round(10 - t, 1)} km"}]}
\`\`\`

\`\`\`domain
@field: ew
@title: אותה משוואה מצד המשבש
פסקת חיבור.
\`\`\`

\`\`\`fieldsystems
@title: מערכות בשטח
- רוסיה: ... [[ודאות: בינונית]]
\`\`\`

\`\`\`chart
{"title":"בדיקת גרף","x":{"from":1,"to":100,"step":1,"label":"R (km)"},"series":[{"name":"SNR","expr":"40 - 40*log10(x)"}]}
\`\`\`

\`\`\`exercise
@title: תרגיל לבדיקה
@source: ${doc}:${src.pages[0]}
@level: 2
מה הטווח?
---hint---
רמז.
---solution---
פתרון.
\`\`\`
`;

const page = fs.readFileSync(path.join(app, "artifact", "index.html"), "utf8");
fs.writeFileSync(
  path.join(out, "test.html"),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>` +
    `<script src="stub.js"></script><script>window.__answer=${JSON.stringify(answer)};window.__lessons=${JSON.stringify(lessons)};window.__doc=${JSON.stringify(doc)};window.__module=${JSON.stringify(mod.id)}</script>${page}</body></html>`,
);
console.log(`harness written to ${out}/test.html (module ${mod.id}, figure ${doc}:${figPage}:0)`);
