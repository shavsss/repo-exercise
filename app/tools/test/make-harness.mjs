// Builds a local test page that runs the artifact with a fake claude.ai runtime
// (tools/test/stub.js: in-memory db kept in localStorage, a fixed user, a scripted
// `sample`). Run after `npm run build`, then serve the folder and open test.html:
//
//   node tools/test/make-harness.mjs /tmp/harness && (cd /tmp/harness && python3 -m http.server 5190)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "../..");
const out = path.resolve(process.argv[2] ?? "/tmp/study-lab-harness");
fs.mkdirSync(path.join(out, "books"), { recursive: true });

for (const f of ["app.js", "app.css"]) fs.copyFileSync(path.join(app, "dist", f), path.join(out, f));
for (const f of fs.readdirSync(path.join(app, "artifact", "books"))) fs.copyFileSync(path.join(app, "artifact", "books", f), path.join(out, "books", f));
fs.copyFileSync(path.join(here, "stub.js"), path.join(out, "stub.js"));

// What the scripted tutor "writes" for part 1 of a lesson: one of each computed block.
const answer = `\`\`\`story
@title: סיפור לבדיקה
טקסט הסיפור. [[ודאות: גבוהה]]
\`\`\`

## חלק 1

נקרא: %READ%

\`\`\`chart
{"title":"בדיקת גרף","x":{"from":0,"to":180,"step":5,"label":"θ"},"scope":{"A":1,"B":-3,"C":5},"series":[{"name":"A'","expr":"A*cos(x deg)^2 + 2*B*sin(x deg)*cos(x deg) + C*sin(x deg)^2"},{"name":"I1","expr":"A + C"}]}
\`\`\`
`;

const page = fs.readFileSync(path.join(app, "artifact", "index.html"), "utf8");
fs.writeFileSync(
  path.join(out, "test.html"),
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>` +
    `<script src="stub.js"></script><script>window.__answer=${JSON.stringify(answer)}</script>${page}</body></html>`,
);
console.log(`harness written to ${out}/test.html`);
