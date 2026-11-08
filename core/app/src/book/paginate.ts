// Pagination for the lesson as a book: a greedy fill, page after page, as print has always done it (TeX and
// every commercial system fill greedily). Pure: it takes the measured blocks and returns where each piece sits.
//
// The rules (docs/research/round6/book/research/B1, B3, R4):
// - a paragraph, a list or a quiet frame may be cut between lines, never inside one; at least two lines on each
//   side (three at the head of a quiet frame, so its label never sits alone; two for a definition or formula,
//   whose label is a line of its own);
// - an equation, a picture, a plate and a block the learner works in are never cut; one taller than a page gets
//   a page of its own whose inside scrolls, with a mark, so nothing is ever cut without a sign;
// - a frame that holds one thing to remember (a definition, a formula) moves whole while the page it leaves stays
//   at least FULL full; only when moving it would leave a bigger hole is it cut, between its lines (never inside
//   an equation), with a mark on both sides;
// - a heading keeps the start of what follows, and a section (h2) does not start in the last lines of a page;
// - a picture, a plate, a chart or a table that does not fit floats: it waits for the top of the next page while
//   the text after it fills the hole, and the page says so at its foot (as print has always done); within a
//   spread it never leaves the words that point to it, and from a left page it goes only one page on;
// - a block the learner works in keeps its place right after the text it tests: when it does not fit, the page
//   ends before it, and that (with a section's end) is the only break that may leave a page less than FULL full;
// - what the reader has seen does not move: pages already shown are passed in as `frozen` and kept as they are.
//   The last of them may only grow at its end (a lesson still being written fills the page under the reader's
//   eyes, below what is there); nothing already on it moves or disappears.
// Identical in both labs.

export interface Box {
  /** height in px; a block's height is already rounded up to the line grid */
  h: number;
  /** y offsets (0 < c < h) between lines, where the block may be cut */
  cuts: number[];
  /** space above it, unless it starts a page */
  gap: number;
  /** may be cut between lines */
  split: boolean;
  /** lines that must stay together at the start when it is cut */
  minHead: number;
  /** a heading: never the last thing on a page */
  keepNext?: boolean;
  /** a section heading: needs this much room under its top, else it starts a new page */
  sticky?: number;
  /** starts on a new page (a new answer) */
  newPage?: boolean;
  /** a picture that may wait for the next page of the same spread */
  float?: boolean;
  /** text that may fill the room a waiting picture leaves */
  filler?: boolean;
  /** takes a whole page of its own (the back matter); its inside scrolls */
  fixed?: boolean;
  /** a block the learner works in (think, predict…): never cut, never moved past the text after it */
  anchor?: boolean;
  /** may be cut between lines, but only to keep the page it would leave at least FULL full */
  late?: boolean;
}

export interface Frag {
  /** index of the box */
  i: number;
  /** the window of the block shown here, in its own px */
  from: number;
  to: number;
  /** where the window sits on the page */
  top: number;
  /** height of the window on the page (to - from, or what is left of the page when it scrolls) */
  h: number;
  /** the block ends on this page */
  end: boolean;
  /** taller than the page: its inside scrolls */
  over?: boolean;
}

export interface Cursor {
  i: number;
  off: number;
  /** pictures waiting for the next page */
  held: number[];
}

export interface Page {
  frags: Frag[];
  next: Cursor;
}

const TOL = 0.5;
/** the fill a page keeps, except at a section's end and before a block the learner works in */
export const FULL = 0.8;
/** a page this full lets a picture that does not fit move whole instead of floating */
const FLOAT_AT = 0.9;

/** The best place to cut box `b` between `off` and `limit`. Strict: keep the lines-together rules. */
export function pickCut(b: Box, off: number, limit: number, strict: boolean, minCut = -Infinity, lu = 0): number | null {
  const inside = b.cuts.filter((c) => c > off + 1 && c < b.h - 1);
  let best: number | null = null;
  for (const c of inside) {
    if (c > limit + TOL) break;
    if (c < minCut - lu * 0.6) continue;
    if (strict) {
      const head = inside.filter((x) => x < c).length + 1;
      const tail = inside.filter((x) => x > c).length + 1;
      if (head < (off === 0 ? b.minHead : 2) || tail < 2) continue;
    }
    best = c;
  }
  return best;
}

function clonePage(p: Page): Page {
  return { frags: p.frags.map((f) => ({ ...f })), next: { ...p.next, held: [...p.next.held] } };
}

/** Where to go on after a page that is kept: its own next, unless its last block has grown since. */
function after(p: Page, boxes: Box[]): Cursor {
  const last = p.frags[p.frags.length - 1];
  if (last && last.end && !last.over && boxes[last.i] && boxes[last.i].h > last.to + 1) return { i: last.i, off: last.to, held: [...p.next.held] };
  return { ...p.next, held: [...p.next.held] };
}

/**
 * Lays the boxes out on pages of `cap` px. `frozen` are pages the reader has seen, kept as they are; with
 * `openLast`, the last of them may still take more at its end.
 */
export function paginate(boxes: Box[], cap: number, lu: number, frozen: Page[] = [], openLast = false): Page[] {
  const pages: Page[] = frozen.map(clonePage);
  let cur: Cursor = { i: 0, off: 0, held: [] };
  let frags: Frag[] = [];
  let y = 0;
  /** the open page's last block is placed again from where it was: same top, no gap, and never shorter */
  let reopen: { i: number; minCut: number } | null = null;

  if (pages.length) {
    const last = pages[pages.length - 1];
    const lf = last.frags[last.frags.length - 1];
    if (openLast && lf && lf.end && !lf.over && boxes[lf.i]) {
      pages.pop();
      frags = last.frags.slice(0, -1);
      y = lf.top;
      cur = { i: lf.i, off: lf.from, held: [...last.next.held] };
      reopen = { i: lf.i, minCut: lf.to };
    } else cur = after(last, boxes);
  }

  const startPage = () => {
    pages.push({ frags, next: { ...cur, held: [...cur.held] } });
    frags = [];
    y = 0;
    placeHeld();
  };
  // pictures that waited go to the top of the new page, in order, as many as fit; the rest wait for the next
  const placeHeld = () => {
    const rest: number[] = [];
    for (const k of cur.held) {
      const b = boxes[k];
      const h = Math.min(b.h, cap);
      const top = y ? y + b.gap : 0;
      if (rest.length || (y > 0 && top + h > cap + TOL)) {
        rest.push(k);
        continue;
      }
      frags.push({ i: k, from: 0, to: b.h, top, h, end: true, over: b.h > cap + TOL || undefined });
      y = top + h;
    }
    cur.held = rest;
  };
  // after the pages already seen, the first new page starts with the pictures the last of them sent on
  if (pages.length && !reopen && cur.held.length) placeHeld();
  /** the room the pictures waiting for the next page take there */
  const heldH = (held: number[]) => held.reduce((s, k, n) => s + boxes[k].h + (n ? boxes[k].gap : 0), 0);
  /** what may pass a waiting picture: text, and a frame of text that fits whole (never a block the learner works
   * in, which keeps its place after the text and the picture it tests, nor a heading) */
  const passes = (b: Box | undefined) => !!b && (b.filler || (b.split && !b.anchor && !b.keepNext));

  let guard = 0;
  while (cur.i < boxes.length) {
    if (++guard > 20000) break;
    const i = cur.i;
    const b = boxes[i];
    const isReopen = reopen !== null && reopen.i === i;
    if (!(b.h > 0)) {
      cur = { i: i + 1, off: 0, held: cur.held };
      continue;
    }
    const empty = frags.length === 0 && y === 0;
    // while a picture waits for the next page, only text passes it (and a frame of text, whole); a later
    // picture waits with it, in order, while they fill at most two pages (they never drift further from their text)
    if (cur.held.length && cur.off === 0 && !b.filler) {
      const fitsWhole = passes(b) && y + b.gap + b.h <= cap + TOL;
      if (b.float && b.h <= cap && heldH(cur.held) + b.gap + b.h <= 2 * cap + TOL) {
        cur = { i: i + 1, off: 0, held: [...cur.held, i] };
        continue;
      }
      // a frame too tall for the hole is cut there only to keep the page FULL; its rest follows the picture
      if (!fitsWhole && !(passes(b) && y < FULL * cap - TOL)) {
        startPage();
        continue;
      }
    }
    if (b.newPage && cur.off === 0 && !empty && !isReopen) {
      startPage();
      continue;
    }
    if (b.fixed) {
      if (!empty) {
        startPage();
        continue;
      }
      frags.push({ i, from: 0, to: b.h, top: 0, h: cap, end: true, over: b.h > cap + TOL || undefined });
      y = cap;
      cur = { i: i + 1, off: 0, held: cur.held };
      startPage();
      continue;
    }
    const gap = empty || cur.off > 0 || isReopen ? 0 : b.gap;
    const rest = b.h - cur.off;
    if (cur.off === 0 && !empty && !isReopen) {
      if (b.sticky && y + gap + b.sticky > cap + TOL) {
        startPage();
        continue;
      }
      if (b.keepNext) {
        const nx = boxes.slice(i + 1).find((x) => x.h > 0);
        const need = gap + b.h + (nx ? nx.gap + Math.min(nx.h, nx.split ? 2 * lu : nx.h) : 0);
        if (y + need > cap + TOL) {
          startPage();
          continue;
        }
      }
    }
    if (y + gap + rest <= cap + TOL) {
      frags.push({ i, from: cur.off, to: b.h, top: y + gap, h: rest, end: true });
      y += gap + rest;
      cur = { i: i + 1, off: 0, held: cur.held };
      if (isReopen) reopen = null;
      continue;
    }
    const avail = cap - y - gap;
    // a frame to remember is cut only when moving it whole would leave the page under FULL
    const tightFits = b.late && cur.off === 0 && !isReopen && !empty && gap > 0 && y + Math.round(gap * 0.3) + rest <= cap + TOL;
    const lateOk = !b.late || cur.off > 0 || isReopen || (y < FULL * cap - TOL && !tightFits);
    if (b.split && lateOk) {
      const c = isReopen ? pickCut(b, cur.off, cur.off + avail, false, reopen!.minCut, lu) : pickCut(b, cur.off, cur.off + avail, true);
      if (c !== null) {
        frags.push({ i, from: cur.off, to: c, top: y + gap, h: c - cur.off, end: false });
        cur = { i, off: c, held: cur.held };
        reopen = null;
        startPage();
        continue;
      }
    }
    if (isReopen) {
      // it no longer fits from where it was: keep exactly what was shown, and go on below it on the next page
      const to = Math.min(reopen!.minCut, b.h);
      frags.push({ i, from: cur.off, to, top: y, h: to - cur.off, end: to >= b.h - 1 });
      cur = to >= b.h - 1 ? { i: i + 1, off: 0, held: cur.held } : { i, off: to, held: cur.held };
      reopen = null;
      startPage();
      continue;
    }
    if (!empty) {
      // a whole block that misses the page by little more than its space above: it closes the page with a
      // tighter space instead of leaving a hole of its own height (nothing follows it on this page, so the
      // line grid below it does not matter)
      const tight = Math.round(gap * 0.3);
      if ((!b.split || b.late) && cur.off === 0 && !isReopen && gap > tight && y + tight + rest <= cap + TOL) {
        frags.push({ i, from: 0, to: b.h, top: y + tight, h: rest, end: true });
        y += tight + rest;
        cur = { i: i + 1, off: 0, held: cur.held };
        continue;
      }
      const nx = boxes[i + 1];
      if (b.float && cur.off === 0 && !cur.held.length && y < FLOAT_AT * cap && (passes(nx) || nx?.float) && b.h <= cap) {
        cur = { i: i + 1, off: 0, held: [i] };
        continue;
      }
      startPage();
      continue;
    }
    // the top of an empty page, and still too tall
    if (b.split) {
      const c = pickCut(b, cur.off, cur.off + cap, false);
      if (c !== null) {
        frags.push({ i, from: cur.off, to: c, top: 0, h: c - cur.off, end: false });
        cur = { i, off: c, held: cur.held };
        startPage();
        continue;
      }
    }
    frags.push({ i, from: cur.off, to: b.h, top: 0, h: cap, end: true, over: true });
    y = cap;
    cur = { i: i + 1, off: 0, held: cur.held };
    startPage();
  }
  if (cur.held.length) startPage();
  if (frags.length) pages.push({ frags, next: { ...cur, held: [] } });
  if (!pages.length) pages.push({ frags: [], next: { i: boxes.length, off: 0, held: [] } });
  return pages;
}

/** The page that shows a place in a block (`off` px into box `i`). */
export function pageOf(pages: Page[], i: number, off = 0): number {
  let best = -1;
  for (let p = 0; p < pages.length; p++)
    for (const f of pages[p].frags) {
      if (f.i !== i) continue;
      if (off >= f.from - 1 && (off < f.to || f.end)) return p;
      if (best < 0) best = p;
    }
  if (best >= 0) return best;
  // the block is not on any page (empty): the page of the nearest block before it
  for (let p = pages.length - 1; p >= 0; p--) if (pages[p].frags.some((f) => f.i < i)) return p;
  return 0;
}

/** How much of a page its blocks take, in px (the bottom of the lowest window). */
export function pageFill(p: Page): number {
  let y = 0;
  for (const f of p.frags) y = Math.max(y, f.top + f.h);
  return y;
}

/**
 * Why page `k` ends where it does, for the fill report: "last" (the book ends), "section" (the next page starts a
 * section or an answer), "think" (the next page starts with a block the learner works in, which keeps its place),
 * or "flow" (any other break, which should leave the page full).
 */
export function pageEnd(pages: Page[], k: number, boxes: Box[]): "last" | "section" | "think" | "flow" {
  const nx = pages[k + 1];
  if (!nx || !nx.frags.length) return "last";
  const held = new Set(pages[k].next.held);
  const f = nx.frags.find((x) => !held.has(x.i)) ?? nx.frags[0];
  const b = boxes[f.i];
  if (!b) return "flow";
  if (f.from === 0 && (b.newPage || b.fixed || b.sticky)) return "section";
  // the pictures that close a section, too tall for the hole, start the next page and the section after them
  const lead = nx.frags.findIndex((x) => !boxes[x.i]?.float);
  if (f.from === 0 && b.float && lead > 0 && nx.frags[lead].from === 0 && boxes[nx.frags[lead].i]?.sticky) return "section";
  // a heading, or a picture the question is about, goes with the question that follows it
  let j = f.i;
  if (f.from === 0) while (boxes[j] && (boxes[j].keepNext || boxes[j].float || !(boxes[j].h > 0)) && j < f.i + 4) j++;
  if (f.from === 0 && boxes[j]?.anchor) return "think";
  return "flow";
}
