// Unit tests of small display and scheduling fixes: texfix.ts (small matrices for KaTeX), segments.ts toItems (an
// empty draft in the middle of a conversation), shelf.ts fitsLesson, prefetch.ts nextToPrefetch (shelf skip).
// Run from the app folder: node tools/test/fixes.test.mjs
import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

async function load(rel) {
  const src = fileURLToPath(new URL(`../../src/${rel}`, import.meta.url));
  // react and the tutor are not needed by the functions tested here
  const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "node", external: ["react", "react-dom", "katex"], logLevel: "silent" });
  // written next to the app (not a data: URL) so the external packages resolve from its node_modules, then removed
  const file = fileURLToPath(new URL(`./.fixes-${rel.replace(/\W/g, "_")}.mjs`, import.meta.url));
  fs.writeFileSync(file, out.outputFiles[0].text);
  try {
    return await import(file);
  } finally {
    fs.unlinkSync(file);
  }
}

const { fixTex } = await load("texfix.ts");
assert.equal(fixTex("$\\begin{psmallmatrix}a&b\\\\c&d\\end{psmallmatrix}$"), "$\\left(\\begin{smallmatrix}a&b\\\\c&d\\end{smallmatrix}\\right)$");
assert.equal(fixTex("\\begin{bsmallmatrix}1\\end{bsmallmatrix}"), "\\left[\\begin{smallmatrix}1\\end{smallmatrix}\\right]");
assert.equal(fixTex("\\begin{Bsmallmatrix}1\\end{Bsmallmatrix}"), "\\left\\{\\begin{smallmatrix}1\\end{smallmatrix}\\right\\}");
assert.equal(fixTex("\\begin{vsmallmatrix}1\\end{vsmallmatrix}"), "\\left|\\begin{smallmatrix}1\\end{smallmatrix}\\right|");
assert.equal(fixTex("\\begin{Vsmallmatrix}1\\end{Vsmallmatrix}"), "\\left\\|\\begin{smallmatrix}1\\end{smallmatrix}\\right\\|");
assert.equal(fixTex("\\begin{smallmatrix}1\\end{smallmatrix}"), "\\begin{smallmatrix}1\\end{smallmatrix}", "plain smallmatrix unchanged");

const { toItems } = await load("segments.ts");
const msgs = [
  { role: "user", text: "שאלה", mode: "lesson", ts: 1 },
  { role: "assistant", text: "", mode: "lesson", ts: 2, draft: true },
  { role: "user", text: "שוב", mode: "lesson", ts: 3 },
  { role: "assistant", text: "", mode: "lesson", ts: 4, draft: true },
];
const items = toItems(msgs);
assert.deepEqual(items.map((x) => x.key), ["u0", "u2", "a3"], "middle empty draft hidden, last one kept, keys keep their index");
assert.equal(items[2].interrupted, true);
assert.equal(toItems([msgs[0], { ...msgs[1], text: "חלק" }, msgs[2]]).length, 3, "a draft with text stays");

const { fitsLesson } = await load("shelf.ts");
assert.equal(fitsLesson({ text: "x" }, { title: "א", sources: [] }), false, "no title on either side: no throw");
assert.equal(fitsLesson({ text: "x", title: " א " }, { title: "א", sources: [] }), true);

const { nextToPrefetch } = await load("prefetch.ts");
const prog = { lessons: [{ title: "0" }, { title: "1" }, { title: "2" }, { title: "3" }], done: [0], convs: { 0: "c0" } };
assert.equal(nextToPrefetch(prog, 0), 1);
assert.equal(nextToPrefetch(prog, 0, (i) => i === 1), 2, "a lesson on the shelf is passed over");
assert.equal(nextToPrefetch(prog, undefined, (i) => i === 1 || i === 2), 3);
assert.equal(nextToPrefetch(prog, 0, () => true), null);

console.log("fixes: all passed");
