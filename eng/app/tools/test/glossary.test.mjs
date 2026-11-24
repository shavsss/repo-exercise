// Unit tests of src/glossary.ts: the terms a lesson defines, and finding them in running Hebrew.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const load = async (rel) => {
  const out = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
};
const G = await load("../../src/glossary.ts");

const md = `### 2.2 הבמה
טקסט.

\`\`\`definition
@title: תנע (momentum)
@mark: summary
לגוף בעל מסה $m$ ומהירות $\\vec v$, התנע הוא $\\vec p=m\\vec v$.
\`\`\`

\`\`\`definition
@title: כוח (החוק השני של ניוטון)
@mark: aid
הכוח הוא קצב השינוי של התנע.
\`\`\`

### 2.3 כבידה
\`\`\`definition
@title: $g$
גודל בלי שם.
\`\`\`
\`\`\`formula
@title: לא הגדרה
x
\`\`\``;

test("terms: the title without its parenthesis; a Latin parenthesis is an alias; math-only titles are left out", () => {
  const t = G.termsOf(md, "M0.2", 1);
  assert.deepEqual(t.map((x) => [x.term, x.aliases, x.mark, x.section]), [
    ["תנע", ["momentum"], "summary", "2.2 הבמה"],
    ["כוח", [], "aid", "2.2 הבמה"],
  ]);
  assert.ok(t[0].body.startsWith("לגוף בעל מסה") && !t[0].body.includes("@mark"));
  assert.equal(t[0].moduleId, "M0.2");
});

test("matcher: whole words with Hebrew prefixes, never inside a longer word", () => {
  const f = G.matcher(G.termsOf(md, "M0.2", 1));
  const hits = (s) => f.find(s).map((h) => s.slice(h.at, h.at + h.len));
  assert.deepEqual(hits("הכוח שווה לשינוי בתנע, וכשהתנע קבוע אין כוח."), ["כוח", "תנע", "תנע", "כוח"]);
  assert.deepEqual(hits("כוחות ותנעים אינם המונח עצמו."), []);
  assert.deepEqual(hits("The Momentum of a body; amomentum"), ["Momentum"]);
});

test("the signature changes with the definitions and only with them", () => {
  const a = G.termsOf(md, "M0.2", 1);
  assert.equal(G.sigOf(a), G.sigOf(G.termsOf(md + "\n\nעוד פסקה.", "M0.2", 1)));
  assert.notEqual(G.sigOf(a), G.sigOf(G.termsOf(md.replace("קצב השינוי", "הנגזרת"), "M0.2", 1)));
});
