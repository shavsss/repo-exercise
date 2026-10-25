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
const out = path.resolve(process.argv[2] ?? "/tmp/eng-lab-harness");
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
const mod = index.modules.find((m) => !m.prereq?.length && index.docs[m.sources[0].doc] && Object.keys(index.docs[m.sources[0].doc].figs).length);
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
מצב הנדסי אמיתי. [[ודאות: גבוהה]]
\`\`\`

## חלק 1

[[${doc}:${src.pages[0]}]] [[2.5: מבנה]] פסקה עם תגית עמוד ותגית רמה 2.5, ומשוואה ממוספרת:

$$C_{D,i} = \\frac{C_L^2}{\\pi e \\, AR} \\tag{1}$$

[[2.5: מקור]] שלד הגזירה. [[2.5: גבולות]] מתי זה נשבר. [[2.5: סדר גודל]] כמה זה. [[2.5: פשרה]] מה משלמים. [[2.5: מבנה משותף]] איפה עוד. [[2.5: ביקורת]] איך תופסים טעות.

\`\`\`figure
${doc}:${figPage}:0
\`\`\`

\`\`\`think
שאלה לבדיקה?
---
תשובה.
\`\`\`

\`\`\`scene3d
{"id": "wing_vortex", "title": "מערבולות קצה", "caption": "הסתכלו על הקצה.", "params": {"alpha": 8}, "tour": true}
\`\`\`

\`\`\`scene3d
{"title": "אופן (2,1) של ממברנה", "caption": "סצנה של המורה לבדיקה.", "axes": true, "params": [{"id": "w", "label": "ω", "min": 0.5, "max": 4, "value": 2}], "objects": [{"type": "surface", "z": "0.5*sin(2*pi*x)*sin(pi*y)*cos(w*t)", "x": [0, 1], "y": [0, 1], "colormap": "diverge", "label": "ממברנה", "info": "העתק הממברנה"}, {"type": "point", "at": ["0.5+0.4*cos(t)", "0.5+0.4*sin(t)", "0.6"], "trail": 200, "label": "נקודה"}]}
\`\`\`

\`\`\`anim
{"title": "מטרה מתקרבת", "duration": 6, "view": {"x": [-10, 10], "y": [-6, 6]}, "shapes": [{"type": "circle", "x": "-8 + 2*t", "y": "0", "r": "0.4", "label": "גוף", "accent": true}]}
\`\`\`

\`\`\`domain
@field: control
@title: אותה משוואה בבקרה
פסקת חיבור.
\`\`\`

\`\`\`casestudy
@title: מקרה הנדסי
מודל ומספרים.
\`\`\`

\`\`\`notebook
{"title": "ניסוי קטן", "file": "test-notebook", "goal": "מה עושים במחברת.", "cells": [{"md": "## הסבר"}, {"code": "import numpy as np\\nprint(np.pi)"}, {"md": "**משימה:** לשנות את הפרמטר."}]}
\`\`\`

\`\`\`chart
{"title":"בדיקת גרף","x":{"from":1,"to":100,"step":1,"label":"AR"},"series":[{"name":"C_Di","expr":"0.25/(pi*0.8*x)"}]}
\`\`\`

\`\`\`exercise
@title: תרגיל לבדיקה
@source: ${doc}:${src.pages[0]}
@level: 2
@kind: הערכה
מה הסדר גודל?
---hint---
רמז.
---solution---
פתרון.
\`\`\`

\`\`\`today
@title: העולם של היום
@asof: אמצע 2026
- טענה על המצב היום. [[ודאות: בינונית]]
\`\`\`
`;

const page = fs.readFileSync(path.join(app, "artifact", "index.html"), "utf8");
fs.writeFileSync(
  path.join(out, "test.html"),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>` +
    `<script src="stub.js"></script><script>window.__answer=${JSON.stringify(answer)};window.__lessons=${JSON.stringify(lessons)};window.__doc=${JSON.stringify(doc)};window.__module=${JSON.stringify(mod.id)}</script>${page}</body></html>`,
);
// A second page whose lesson shows every checked 3D scene, for a quick check of the whole library.
const ids = [...fs.readFileSync(path.resolve(app, "../../shared/scene3d/scenes.ts"), "utf8").matchAll(/\bid: "([a-z_0-9]+)",\s+title:/g)].map((m) => m[1]);
const scenes = ids.map((id) => "## " + id + "\n\n```scene3d\n" + JSON.stringify({ id, tour: true }) + "\n```\n").join("\n");
fs.writeFileSync(
  path.join(out, "scenes.html"),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>` +
    `<script src="stub.js"></script><script>window.__answer=${JSON.stringify(scenes)};window.__lessons=${JSON.stringify(lessons)};window.__doc=${JSON.stringify(doc)};window.__module=${JSON.stringify(mod.id)};window.__fast=1</script>${page}</body></html>`,
);
console.log(`harness written to ${out}/test.html (module ${mod.id}, figure ${doc}:${figPage}:0)`);
