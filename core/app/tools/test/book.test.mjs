// Unit tests of the lesson as a book: src/book/chunks.ts (the cut into blocks) and src/book/paginate.ts (the
// greedy fill and its rules). Run from the app folder: node tools/test/book.test.mjs
// The TypeScript modules are bundled on the fly with the esbuild that Vite already installs.
import { build } from "esbuild";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

async function load(rel) {
  const src = fileURLToPath(new URL(rel, import.meta.url));
  const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "node" });
  return import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
}
const { chunkText, uniqueIds } = await load("../../src/book/chunks.ts");
const { paginate, pageOf, pickCut } = await load("../../src/book/paginate.ts");

let n = 0;
const t = (name, fn) => {
  fn();
  n++;
  console.log("ok", name);
};

/* ---- chunks ---- */
const md = `\`\`\`plan
1. a
\`\`\`

## פרק ראשון

פסקה ראשונה עם $x^2$ בתוכה.
שורה שנייה של אותה פסקה.

- פריט
- פריט שני

$$E = mc^2$$

\`\`\`figure
B01:33:0
\`\`\`

<!--U1-->

\`\`\`think
שאלה?
---
תשובה.
\`\`\`

### תת-סעיף

\`\`\`figure
B01:34:0
\`\`\`
`;
t("chunks: one per top-level block, comments dropped", () => {
  const c = chunkText(md, 0);
  assert.deepEqual(
    c.map((x) => x.kind + (x.lang ? ":" + x.lang : "")),
    ["fence:plan", "h2", "p", "list", "math", "fence:figure", "fence:think", "h3", "fence:figure"],
  );
});
t("chunks: the source of each block, exactly", () => {
  const c = chunkText(md, 0);
  assert.equal(c[2].text, "פסקה ראשונה עם $x^2$ בתוכה.\nשורה שנייה של אותה פסקה.");
  assert.ok(c[6].text.startsWith("```think") && c[6].text.endsWith("```"));
  assert.equal(c[1].head, "פרק ראשון");
});
t("chunks: figures keep their numbers", () => {
  const c = chunkText(md, 0);
  assert.equal(c[5].figBase, 0);
  assert.equal(c[8].figBase, 1);
});
t("chunks: keys stay put while the text grows", () => {
  const a = chunkText("## א\n\nפסקה", 2, true);
  const b = chunkText("## א\n\nפסקה שגדלה\n\nועוד אחת", 2, true);
  assert.equal(a[1].key, b[1].key);
  assert.ok(a[1].open && !b[1].open && b[2].open);
});
t("chunks: an open fence at the end is one block", () => {
  const c = chunkText("פתיחה\n\n```definition\n@title: x\nשורה", 0, true);
  assert.equal(c.length, 2);
  assert.equal(c[1].lang, "definition");
});
t("chunks: a one-line $$ paragraph is display math", () => {
  assert.equal(chunkText("$$a=b$$", 0)[0].kind, "math");
});
t("chunks: repeated text gets distinct ids", () => {
  const c = uniqueIds([...chunkText("שורה\n\nשורה", 0)]);
  assert.notEqual(c[0].id, c[1].id);
});

/* ---- paginate ---- */
const LU = 33;
const CAP = 10 * LU;
const para = (lines, gap = 0) => ({ h: lines * LU, cuts: Array.from({ length: lines - 1 }, (_, k) => (k + 1) * LU), gap, split: true, minHead: 2, filler: true });
const block = (lines, gap = LU, extra = {}) => ({ h: lines * LU, cuts: [], gap, split: false, minHead: 2, ...extra });
const shown = (pages, boxes) => {
  // every px of every box is shown exactly once, and nothing overflows a page
  const cover = boxes.map(() => 0);
  for (const p of pages)
    for (const f of p.frags) {
      assert.ok(f.top + f.h <= CAP + 0.5, `fits the page (${f.top}+${f.h})`);
      cover[f.i] += f.over ? f.to - f.from : f.to - f.from;
    }
  boxes.forEach((b, i) => assert.equal(cover[i], b.h, `box ${i} shown whole`));
};

t("paginate: text flows and is cut between lines", () => {
  const boxes = [para(6), para(8), para(5)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.equal(pages.length, 2);
  // page 1: 6 lines + 4 lines of the second paragraph
  assert.deepEqual(pages[0].frags.map((f) => [f.i, f.from, f.to]), [[0, 0, 198], [1, 0, 132]]);
});
t("paginate: two lines at least on each side of a cut", () => {
  // 9 lines used, a 4-line paragraph would leave 1 line: it moves whole
  const boxes = [para(9), para(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.deepEqual(pages[1].frags.map((f) => [f.i, f.from]), [[1, 0]]);
  // 7 used, a 4-line paragraph: 3 fit, but that leaves 1 → cut after 2
  const p2 = paginate([para(7), para(4)], CAP, LU);
  assert.deepEqual(p2[0].frags[1].to, 2 * LU);
});
t("paginate: a block is never cut, it moves to the next page", () => {
  const boxes = [para(7), block(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.equal(pages[1].frags[0].i, 1);
  assert.equal(pages[1].frags[0].top, 0, "no gap at the top of a page");
});
t("paginate: a block taller than a page gets its own page and scrolls inside", () => {
  const boxes = [para(3), block(14), para(3)];
  const pages = paginate(boxes, CAP, LU);
  const f = pages[1].frags[0];
  assert.equal(f.i, 1);
  assert.ok(f.over);
  assert.equal(f.h, CAP);
  assert.equal(pages[2].frags[0].i, 2);
});
t("paginate: a heading is never the last line of a page", () => {
  const boxes = [para(8), { ...block(1), keepNext: true }, para(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.equal(pages[1].frags[0].i, 1);
});
t("paginate: a section does not start in the last lines", () => {
  const boxes = [para(7), { ...block(1), keepNext: true, sticky: 5 * LU }, para(2)];
  const pages = paginate(boxes, CAP, LU);
  assert.equal(pages[1].frags[0].i, 1);
});
t("paginate: a picture waits for the facing page while text fills the hole", () => {
  const boxes = [para(6), block(6, LU, { float: true }), para(6), block(2)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  // page 0 (right): para 0 and the start of para 2; page 1 (left): the picture first
  assert.deepEqual(pages[0].frags.map((f) => f.i), [0, 2]);
  assert.equal(pages[1].frags[0].i, 1);
});
t("paginate: a picture on a left page does not leave its spread", () => {
  const boxes = [para(10), para(6), block(6, LU, { float: true }), para(6)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  // page 1 is a left page: the picture goes whole to page 2, the text after it follows it
  assert.deepEqual(pages[2].frags.map((f) => f.i).slice(0, 1), [2]);
});
t("paginate: a new answer starts on a new page", () => {
  const boxes = [para(2), { ...para(2), newPage: true }];
  assert.equal(paginate(boxes, CAP, LU).length, 2);
});
t("paginate: the back matter takes a page of its own", () => {
  const boxes = [para(2), { ...block(20), fixed: true }];
  const pages = paginate(boxes, CAP, LU);
  assert.equal(pages.length, 2);
  assert.ok(pages[1].frags[0].over);
});
t("paginate: seen pages do not move while the text grows", () => {
  const before = [para(6), para(3)];
  const p1 = paginate(before, CAP, LU);
  // the reader saw page 0; the last paragraph grows to 9 lines and a new one comes
  const grown = [para(6), para(9), para(4)];
  const p2 = paginate(grown, CAP, LU, p1.slice(0, 1), true);
  assert.deepEqual(p2[0].frags.slice(0, 1), p1[0].frags.slice(0, 1));
  // what was shown of the paragraph is still shown; it only gained lines at the end
  assert.equal(p2[0].frags[1].from, 0);
  assert.ok(p2[0].frags[1].to >= p1[0].frags[1].to);
  shown(p2, grown);
});
t("paginate: the open page never loses a line to the widow rule", () => {
  // 7 lines used + a 3-line paragraph fills the page; it grows by one line → the widow rule would move a line
  const p1 = paginate([para(7), para(3)], CAP, LU);
  const grown = [para(7), para(4)];
  const p2 = paginate(grown, CAP, LU, p1, true);
  assert.equal(p2[0].frags[1].to, 3 * LU, "the three shown lines stay");
  shown(p2, grown);
});
t("paginate: a page seen earlier keeps its window even when a later block on it grows", () => {
  const p1 = paginate([para(4), block(3), para(2)], CAP, LU);
  const grown = [para(4), block(5), para(2)];
  const p2 = paginate(grown, CAP, LU, p1, false);
  assert.deepEqual(p2[0].frags, p1[0].frags);
});
t("paginate: pageOf finds the page that shows a place", () => {
  const boxes = [para(6), para(8), para(5)];
  const pages = paginate(boxes, CAP, LU);
  assert.equal(pageOf(pages, 1, 0), 0);
  assert.equal(pageOf(pages, 1, 5 * LU), 1);
  assert.equal(pageOf(pages, 2, 0), 1);
});
t("pickCut: never inside the first two lines or the last two", () => {
  const b = para(5);
  assert.equal(pickCut(b, 0, 1 * LU, true), null);
  assert.equal(pickCut(b, 0, 4 * LU, true), 3 * LU);
  assert.equal(pickCut(b, 0, 4 * LU, false), 4 * LU);
});

console.log(`\n${n} tests passed`);
