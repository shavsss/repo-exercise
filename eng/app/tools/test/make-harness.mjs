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

## הגדרות ונוסחה מרכזית

פסקה ארוכה לבדיקת אורך השורה: כלל שנלמד מניסיון נכון רק בתנאים שבהם נוסה, ושום דבר בכלל עצמו לא מזהיר מתי ההנחה שלא נאמרה נשברת. כך גם בגרר המושרה: הנוסחה נכונה לכנף ארוכה ודקה, בזרימה צמודה, ורחוק מהקרקע.

\`\`\`definition
@title: מקדם גרר מושרה
המקדם $C_{D,i}$ הוא החלק בגרר שנובע מיצירת העילוי.
\`\`\`

\`\`\`formula
@title: הגרר המושרה
$$C_{D,i} = \\frac{C_L^2}{\\pi e \\, AR}$$
\`\`\`

\`\`\`derivation
@title: מאיפה זה בא
שלושה צעדים מהמערבולות אל הגרר.
\`\`\`

פסקה נוספת אחרי הנוסחה: הכפלת המוטה מקטינה את הגרר המושרה פי ארבעה כשהשטח קבוע. זו התוצאה שחוזרים אליה בכל תכנון של כנף.

\`\`\`figure
${doc}:${figPage}:0
\`\`\`

\`\`\`think
שאלה לבדיקה?
---
תשובה.
\`\`\`

[[2.5: סדר גודל]] פסקה עם יחידות עומק מסומנות.<!--U1--> הנחה נסתרת ושבירתה.<!--U2--> מקרה מהשטח עם מספרים.<!--U3--> וטענה שגויה ותיקונה.<!--U4-->

\`\`\`predict
@title: מכפילים את המרחק
@unit: dB
@value: 12
כשהמרחק גדל פי 2 והאות יורד כ-$R^{-4}$, בכמה dB יורד היחס? תנו אומדן וטווח של 90%.
---
**12 dB.** $40\\log_{10}2 = 12.04$: כל הכפלה של המרחק עולה בכ-12 dB.
\`\`\`

\`\`\`verify
@title: לפני שמסיקים מהחישוב
@result: ירידה של 12 dB
- ממדים: היחס חסר ממדים, וה-dB הוא $10\\log_{10}$ של הספק.
- מקרה גבול: באותו מרחק הירידה היא 0 dB.
- השוואה לתחזית: האומדן בראש היה בטווח.
- פותר שני: אותו חישוב בטבלה נותן 12.04.
\`\`\`

\`\`\`errorhunt
@title: תקציב שכתב AI
~~~python
loss_db = 20 * log10(2) ** 2   # power falls as R^-4
~~~
המסקנה של ה-AI: "כל הכפלה של המרחק עולה 36 dB".
---
**יש טעות.** הריבוע נכנס בתוך הלוגריתם ולא מחוצה לו: $10\\log_{10}(2^4) = 40\\log_{10}2 = 12$ dB. בדיקת סדר גודל הייתה תופסת: 36 dB הם פי 4,000 בהספק.
\`\`\`

\`\`\`lab
@title: עקומת הירידה מול מרחק
@tools: NumPy, Matplotlib
@time: 45–60 דקות
**השאלה:** באיזה מרחק היחס יורד מתחת לסף?
**המפרט שלכם:** קלטים, הנחות, מדד הצלחה ובדיקות קבלה.
**שורות הלב:** הפונקציה שמחשבת את היחס ב-dB.
\`\`\`

\`\`\`decide
@kind: trade
@title: אנטנה גדולה או הספק גבוה
שתי חלופות להכפלת הטווח. כתבו החלטה, מספרים לכל תחום ורגישות.
---
**ניתוח הרפרנס:** הגדלת האנטנה מחזירה 12 dB בשבר מההספק.
\`\`\`
<!--audit: units U1–U4 4/4 (auth 4/4) | w/u 30 | think 1 | padding 0-->

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

\`\`\`fieldmap
@formula: $N = f\\cdot t$
- **אותות** (נלמד): קצב דגימה כפול זמן.
- **תקשורת** (M3.2): מספר הסמלים במנה.
\`\`\`

פסקה עם [[מונח: קבל | רכיב חשמלי ששומר מטען, כמו דלי קטן של חשמל]] באמצע.

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

עם גרר הזווית האופטימלית **זזה**. באוויר צפוף היא יורדת מתחת ל-45°, כדי לקצר את הדרך שהפגז עובר באוויר.

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

## מה לזכור

\`\`\`keep
- הגרר המושרה יורד כמו אחד חלקי המוטה בריבוע.
- **גרר מושרה**: $C_{D,i} = C_L^2 / (\\pi e \\, AR)$, לכנף ארוכה בזרימה צמודה.
- $C_{D,i} \\propto C_L^2$
\`\`\`
`;

const page = fs.readFileSync(path.join(app, "artifact", "index.html"), "utf8");
// Sample documents for the newspaper, product and review tabs; stub.js adds them when the address has ?seed.
const sample = (f) => JSON.parse(fs.readFileSync(path.join(here, "samples", f), "utf8"));
const seedDocs = { "news/2026-W44": sample("news.json"), "reviews/2026-W44": sample("review.json"), "products/__MONTH__": sample("product.json") };
// ?review in the address: a lesson he read two days ago, a think question he missed and a margin note, so the
// review queue (src/review/) and the morning card have due cards. "__AGO<n>__" is n days before now (stub.js).
const fnv = (s) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
};
const reviewDocs = {
  [`modules/${mod.id}`]: { lessons, convs: { 0: "rvseed" }, done: [0] },
  "convs/rvseed": { title: lessons[0].title, moduleId: mod.id, lesson: 0, createdAt: "__AGO2__", updatedAt: "__AGO2__", count: 1 },
  "convs/rvseed/msgs/a1": { role: "assistant", text: answer, mode: "lesson", ts: "__AGO2__" },
  [`calib/${mod.id}__0__${fnv("שאלה לבדיקה?")}`]: { id: `${mod.id}__0__${fnv("שאלה לבדיקה?")}`, moduleId: mod.id, lesson: 0, q: "שאלה לבדיקה?", conf: 2, grade: "wrong", ts: "__AGO2__", gradedAt: "__AGO2__" },
  "notes/rvnote": { who: "learner", kind: "note", text: "לבדוק למה השורש הרביעי ולא הריבועי.", moduleId: mod.id, lesson: 0, margin: true, anchor: "פסקה נוספת אחרי הנוסחה", ts: "__AGO2__" },
};
fs.writeFileSync(
  path.join(out, "test.html"),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>` +
    `<script src="stub.js"></script><script>window.__answer=${JSON.stringify(answer)};window.__lessons=${JSON.stringify(lessons)};window.__doc=${JSON.stringify(doc)};window.__module=${JSON.stringify(mod.id)};window.__seed=${JSON.stringify(seedDocs)};window.__seedReview=${JSON.stringify(reviewDocs)}</script>${page}</body></html>`,
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
