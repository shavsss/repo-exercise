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
const { paginate, pageOf, pickCut, pageFill, pageEnd, FULL } = await load("../../src/book/paginate.ts");

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
t("paginate: a block that misses the page only by its space above closes the page with a tighter space", () => {
  const boxes = [para(6), { ...block(4), h: 4 * LU - 12 }];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.equal(pages.length, 1, "no hole of four lines");
  assert.ok(pages[0].frags[1].top < 6 * LU + LU, "the space above it shrinks");
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
t("paginate: a picture on a left page floats one page on, and the text after it fills the hole", () => {
  const boxes = [para(10), para(6), block(6, LU, { float: true }), para(6)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.deepEqual(pages[1].frags.map((f) => f.i), [1, 3], "the text fills page 1");
  assert.deepEqual(pages[1].next.held, [2], "page 1 says the picture is on the next page");
  assert.equal(pages[2].frags[0].i, 2);
  assert.equal(pages[2].frags[0].top, 0, "the picture heads page 2");
});
t("paginate: a picture sent on by a page already seen heads the first new page", () => {
  const boxes = [para(6), block(6, LU, { float: true }), para(6), para(8)];
  const p1 = paginate(boxes, CAP, LU);
  assert.deepEqual(p1[0].next.held, [1]);
  const p2 = paginate(boxes, CAP, LU, p1.slice(0, 1));
  shown(p2, boxes);
  assert.deepEqual(p2[0].frags, p1[0].frags);
  assert.equal(p2[1].frags[0].i, 1);
  assert.equal(p2[1].frags[0].top, 0);
});
t("paginate: pictures in a row wait in order, at most two pages, while text fills the hole", () => {
  const boxes = [block(6, LU, { anchor: true }), block(4, LU, { float: true }), block(4, LU, { float: true }), block(4, LU, { float: true }), para(3), para(8)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.deepEqual(pages[0].frags.map((f) => f.i), [0, 4], "the text after the pictures fills the hole");
  assert.deepEqual(pages[1].frags.map((f) => f.i), [1, 2]);
  assert.equal(pages[2].frags[0].i, 3, "the third picture heads the page after");
});
t("paginate: a picture that closes a section and starts the next page counts as the section's end", () => {
  const boxes = [para(8), block(3, LU, { float: true }), { ...block(1), keepNext: true, sticky: 5 * LU }, para(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.equal(pages[1].frags[0].i, 1, "it never floats into the next section");
  assert.equal(pageEnd(pages, 0, boxes), "section");
});
t("paginate: a nearly full page lets a picture move whole instead of floating", () => {
  const boxes = [para(9), block(4, LU, { float: true }), para(6)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.deepEqual(pages[0].frags.map((f) => f.i), [0]);
  assert.deepEqual(pages[1].frags.map((f) => f.i).slice(0, 2), [1, 2], "order kept");
});
const frame = (lines, extra = {}) => ({ ...para(lines, LU), filler: false, minHead: 3, late: true, ...extra });
t("paginate: a definition moves whole while the page it leaves stays full", () => {
  const boxes = [para(8), frame(5), para(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.deepEqual(pages[0].frags.map((f) => f.i), [0]);
  assert.equal(pages[1].frags[0].from, 0);
});
t("paginate: a definition taller than the hole is cut between its lines when the page would be under 80%", () => {
  const boxes = [para(5), frame(8), para(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  const f = pages[0].frags[1];
  assert.equal(f.i, 1);
  assert.ok(!f.end && f.to === 4 * LU, "four lines of it on page 0 (5 + space + 4)");
  assert.ok(pageFill(pages[0]) / CAP >= FULL);
  assert.equal(pages[1].frags[0].from, f.to, "the rest heads page 1");
});
t("paginate: a definition with no line to cut at (one formula) moves whole", () => {
  const boxes = [para(5), { ...frame(6), cuts: [] }, para(4)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.equal(pages[1].frags[0].i, 1);
});
t("paginate: a think question keeps its place right after the text it tests", () => {
  const boxes = [para(6), block(6, LU, { anchor: true }), para(6)];
  const pages = paginate(boxes, CAP, LU);
  shown(pages, boxes);
  assert.deepEqual(pages[0].frags.map((f) => f.i), [0], "the text after it never passes it");
  assert.equal(pageEnd(pages, 0, boxes), "think");
  assert.deepEqual(pages[1].frags.map((f) => f.i), [1, 2]);
});
t("paginate: fill ratio, every page at least 80% full except a section's end and before a think question", () => {
  // a long mixed lesson: paragraphs, definitions, pictures, think questions and sections, in a fixed pseudo-random order
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const boxes = [];
  for (let k = 0; k < 600; k++) {
    const r = rnd();
    if (r < 0.55) boxes.push(para(2 + Math.floor(rnd() * 9), boxes.length && rnd() < 0.5 ? LU : 0));
    else if (r < 0.68) boxes.push(frame(3 + Math.floor(rnd() * 6)));
    else if (r < 0.78) boxes.push(block(3 + Math.floor(rnd() * 5), LU, { float: true }));
    else if (r < 0.86) boxes.push(block(3 + Math.floor(rnd() * 4), LU, { anchor: true }));
    else if (r < 0.9) boxes.push({ ...block(1), keepNext: true, sticky: 5 * LU });
    else boxes.push(para(3));
  }
  // the real page: 20 lines (660 px at 33)
  const cap = 2 * CAP;
  const pages = paginate(boxes, cap, LU);
  const cover = boxes.map(() => 0);
  for (const p of pages)
    for (const f of p.frags) {
      assert.ok(f.top + f.h <= cap + 0.5, "fits the page");
      cover[f.i] += f.to - f.from;
    }
  boxes.forEach((b, i) => assert.equal(cover[i], b.h, `box ${i} shown whole`));
  const fills = pages.map((p, k) => ({ f: pageFill(p) / cap, why: pageEnd(pages, k, boxes), k }));
  const flow = fills.filter((x) => x.why === "flow");
  const bad = flow.filter((x) => x.f < FULL - 1e-9);
  const desc = (i) => { const b = boxes[i]; return `${i}${b.float ? "F" : b.anchor ? "T" : b.late ? "D" : b.keepNext ? "H" : "p"}${b.h / LU}`; };
  assert.equal(bad.length, 0, `pages under 80%: ${bad.map((x) => `${x.k}:${x.f.toFixed(2)} [${pages[x.k].frags.map((f) => desc(f.i)).join(" ")}] held ${pages[x.k].next.held} → [${pages[x.k + 1].frags.map((f) => desc(f.i) + (f.from ? "@" + f.from / LU : "")).join(" ")}]`).join("\n")}`);
  const mean = flow.reduce((s, x) => s + x.f, 0) / flow.length;
  assert.ok(mean > 0.93, `mean fill of the running pages ${mean.toFixed(3)}`);
  // order: no block is shown before one that comes earlier, except a picture that floated past text
  const seen = [];
  for (const p of pages) for (const f of p.frags) if (f.from === 0) seen.push(f.i);
  for (let k = 1; k < seen.length; k++) if (seen[k] < seen[k - 1]) assert.ok(boxes[seen[k]].float, `only a picture comes late (${seen[k]})`);
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
