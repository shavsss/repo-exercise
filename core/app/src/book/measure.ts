// Measuring the hidden copy of the lesson: each block's height, and the places between its lines where it may be
// cut. A line is found from the boxes of its text (Range.getClientRects) and of everything that must never be cut
// (an equation, a picture, a button row); boxes that overlap vertically are one line. A cut sits just under the
// upper of two lines (in the middle of the gap when the gap is small), so nothing of the lower line's ink shows at
// the foot of the page, and the next page starts with the space above its first line. Identical in both labs.

/** Things a cut must never pass through. */
const ATOMS =
  ".katex-display, .katex .base, .katex .vlist-t, .katex, img, svg, canvas, video, iframe, tr, pre, button, input, textarea, select, hr, .mermaid, .figure, .commit, .b3-form, .block-head, .s3d, .bk-plate, .table-wrap, .chart, mjx-container";

/** The y offsets (from the top of `el`) between its lines. */
export function lineCuts(el: HTMLElement): number[] {
  const box = el.getBoundingClientRect();
  const top = box.top;
  const spans: [number, number][] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    const parent = n.parentElement;
    // the text inside an atom is covered by the atom's own box
    if (parent?.closest(".katex, svg, .mermaid")) continue;
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.height > 0 && r.width > 0) spans.push([r.top - top, r.bottom - top]);
  }
  for (const a of el.querySelectorAll<HTMLElement>(ATOMS)) {
    const r = a.getBoundingClientRect();
    if (r.height > 0) spans.push([r.top - top, r.bottom - top]);
  }
  spans.sort((a, b) => a[0] - b[0]);
  const lines: [number, number][] = [];
  for (const s of spans) {
    const last = lines[lines.length - 1];
    if (last && s[0] < last[1] - 1) last[1] = Math.max(last[1], s[1]);
    else lines.push([s[0], s[1]]);
  }
  const cuts: number[] = [];
  for (let k = 1; k < lines.length; k++) {
    // in the middle of the gap, but never more than 2px below the line above: a tall equation's ink (a big
    // bracket, a superscript) may reach a little above its own box, and must not peek into the page before
    const c = Math.round(Math.min((lines[k - 1][1] + lines[k][0]) / 2, lines[k - 1][1] + 2));
    if (c > 0 && c < box.height) cuts.push(c);
  }
  return cuts;
}

/** The height of a chunk's content (its own box, margins of the first and last child included). */
export function heightOf(el: HTMLElement) {
  return Math.ceil(el.getBoundingClientRect().height);
}

/** Average width of a character of running Hebrew text in a font, for a column of N characters. */
let canvas: HTMLCanvasElement | null = null;
const SAMPLE =
  "כשמכפילים את המוטה ומשאירים את העילוי קבוע, הגרר המושרה יורד פי ארבעה, כי הוא הפוך לריבוע המוטה. הטווח גדל רק כשורש רביעי של ההספק, ולכן הכפלת ההספק פי 16 מכפילה את הטווח בלבד.";
export function charWidth(font: string): number {
  canvas ??= document.createElement("canvas");
  const c = canvas.getContext("2d");
  if (!c) return 0;
  c.font = font;
  return c.measureText(SAMPLE).width / SAMPLE.length;
}
