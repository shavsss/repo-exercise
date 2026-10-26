// Text editing inside one block: the HTML each editable keeps, the caret, marks, and
// splitting a block at the caret. Same file in both labs.
import DOMPurify from "dompurify";
import katex from "katex";

/**
 * The only markup a block keeps: bold, italic, the four marks, line breaks, sub/superscript,
 * and equations inside a line, kept as <span class="im" data-tex="…"></span> (drawn by
 * hydrateMath; what is drawn is not kept).
 */
export function cleanHtml(html: string) {
  const box = document.createElement("div");
  box.innerHTML = html.replace(/\n/g, "<br>");
  box.querySelectorAll("span.im").forEach((s) => {
    const n = document.createElement("span");
    n.className = "im";
    n.setAttribute("data-tex", s.getAttribute("data-tex") ?? "");
    s.replaceWith(n);
  });
  const out = DOMPurify.sanitize(box.innerHTML, { ALLOWED_TAGS: ["b", "strong", "i", "em", "mark", "br", "sub", "sup", "span"], ALLOWED_ATTR: ["class", "data-tex"] });
  box.innerHTML = out;
  // other spans the browser adds while typing are unwrapped
  box.querySelectorAll("span:not(.im)").forEach((s) => s.replaceWith(...Array.from(s.childNodes)));
  const res = box.innerHTML;
  return res === "<br>" ? "" : res.replace(/<mark(?! class="hl-[yrbg]")[^>]*>/g, "<mark>");
}

/** Draws the equations inside a line (KaTeX) where they are not drawn yet. */
export function hydrateMath(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("span.im").forEach((s) => {
    const tex = s.getAttribute("data-tex") ?? "";
    if (s.dataset.done === tex && s.childNodes.length) return;
    try {
      katex.render(tex || "\\square", s, { throwOnError: false, strict: "ignore" });
    } catch {
      s.textContent = tex;
    }
    s.contentEditable = "false";
    s.dataset.done = tex;
    s.title = "לחץ לעריכת המשוואה";
  });
}

function mathSpan(tex: string) {
  const s = document.createElement("span");
  s.className = "im";
  s.setAttribute("data-tex", tex);
  return s;
}

/** "$…$" typed in the text becomes an equation inside the line; true when one was made. */
export function convertDollars(el: HTMLElement) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node = walk.nextNode() as Text | null;
  while (node) {
    const m = /\$([^$\n]+)\$/.exec(node.data);
    if (m && !node.parentElement?.closest("span.im")) {
      const after = node.splitText(m.index);
      const rest = after.splitText(m[0].length);
      const span = mathSpan(m[1].trim());
      after.replaceWith(span);
      const space = document.createTextNode(rest.data.startsWith(" ") ? "" : "\u00a0");
      span.after(space);
      hydrateMath(el);
      const r = document.createRange();
      r.setStartAfter(space);
      r.collapse(true);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
      return true;
    }
    node = walk.nextNode() as Text | null;
  }
  return false;
}

/** Puts an equation into the text at a saved position. */
export function insertMathAt(range: Range, tex: string) {
  const span = mathSpan(tex);
  range.deleteContents();
  range.insertNode(span);
  const space = document.createTextNode("\u00a0");
  span.after(space);
  const host = span.closest<HTMLElement>("[data-edit]");
  if (host) {
    hydrateMath(host);
    placeAfter(space);
    host.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function placeAfter(n: Node) {
  const r = document.createRange();
  r.setStartAfter(n);
  r.collapse(true);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(r);
}

/**
 * What is pasted from a lesson keeps its equations: KaTeX output carries its LaTeX in an
 * annotation, which becomes an equation inside the line; the rest becomes plain text with
 * bold, italic and line breaks.
 */
export function pastedHtml(html: string) {
  // an inert document: nothing in it runs or loads; what is kept goes through cleanHtml
  const box = new DOMParser().parseFromString(html, "text/html").body;
  box.querySelectorAll(".katex-display, .katex, math").forEach((k) => {
    if (!k.isConnected) return;
    const tex = k.querySelector('annotation[encoding="application/x-tex"]')?.textContent?.trim();
    if (tex) k.replaceWith(mathSpan(tex));
  });
  box.querySelectorAll("script, style, button, svg, .katex-mathml").forEach((x) => x.remove());
  box.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, tr, blockquote").forEach((b) => b.after(document.createElement("br")));
  const out = cleanHtml(box.innerHTML).replace(/(<br>\s*){3,}/g, "<br><br>").replace(/^(<br>)+|(<br>)+$/g, "");
  return out;
}

function selRange(el: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;
  const r = sel.getRangeAt(0);
  return el.contains(r.startContainer) ? r : null;
}

/** Characters before the caret, and in all, in an editable. */
export function caret(el: HTMLElement) {
  const r = selRange(el);
  if (!r) return null;
  const pre = document.createRange();
  pre.selectNodeContents(el);
  pre.setEnd(r.startContainer, r.startOffset);
  return { before: pre.toString().length, total: (el.textContent ?? "").length, collapsed: r.collapsed };
}

/** Whether the caret sits on the first (or last) visual line of an editable. */
export function caretOnEdgeLine(el: HTMLElement, edge: "first" | "last") {
  const r = selRange(el);
  if (!r) return false;
  const rects = r.getClientRects();
  const box = el.getBoundingClientRect();
  const rect = rects.length ? rects[0] : null;
  if (!rect || (rect.top === 0 && rect.bottom === 0)) {
    const c = caret(el);
    return !!c && (edge === "first" ? c.before === 0 : c.before === c.total);
  }
  const lh = parseFloat(getComputedStyle(el).lineHeight) || 24;
  return edge === "first" ? rect.top - box.top < lh * 0.9 : box.bottom - rect.bottom < lh * 0.9;
}

/** Splits an editable at the caret: what stays, and the HTML that moves to a new block. */
export function splitAtCaret(el: HTMLElement) {
  const r = selRange(el);
  if (!r) return { head: el.innerHTML, tail: "" };
  r.deleteContents();
  const tail = document.createRange();
  tail.setStart(r.startContainer, r.startOffset);
  tail.setEnd(el, el.childNodes.length);
  const box = document.createElement("div");
  box.appendChild(tail.extractContents());
  return { head: cleanHtml(el.innerHTML), tail: cleanHtml(box.innerHTML) };
}

/** Puts the caret at the start, the end, or a character offset of an editable. */
export function placeCaret(el: HTMLElement, where: "start" | "end" | number) {
  el.focus({ preventScroll: true });
  const sel = window.getSelection();
  if (!sel) return;
  const r = document.createRange();
  if (typeof where === "number") {
    let left = where;
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walk.nextNode() as Text | null;
    while (node) {
      if (left <= node.length) {
        r.setStart(node, left);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
        return;
      }
      left -= node.length;
      node = walk.nextNode() as Text | null;
    }
    where = "end";
  }
  r.selectNodeContents(el);
  r.collapse(where === "start");
  sel.removeAllRanges();
  sel.addRange(r);
}

/** The editable that holds the selection, if it is one of ours. */
export function activeEditable(): HTMLElement | null {
  const sel = window.getSelection();
  const n = sel?.anchorNode;
  const e = n ? (n.nodeType === 1 ? (n as Element) : n.parentElement)?.closest<HTMLElement>("[data-edit]") : null;
  return e ?? null;
}

/** Wraps the selection in a mark of one colour (or removes marks from it, with null). */
export function applyMark(cls: string | null) {
  const el = activeEditable();
  const sel = window.getSelection();
  if (!el || !sel || !sel.rangeCount || sel.isCollapsed) return false;
  const r = sel.getRangeAt(0);
  const frag = r.extractContents();
  frag.querySelectorAll("mark").forEach((m) => m.replaceWith(...Array.from(m.childNodes)));
  if (cls) {
    const m = document.createElement("mark");
    m.className = cls;
    m.appendChild(frag);
    r.insertNode(m);
    sel.removeAllRanges();
    const after = document.createRange();
    after.selectNodeContents(m);
    sel.addRange(after);
  } else {
    const first = frag.firstChild;
    const last = frag.lastChild;
    r.insertNode(frag);
    if (first && last) {
      const back = document.createRange();
      back.setStartBefore(first);
      back.setEndAfter(last);
      sel.removeAllRanges();
      sel.addRange(back);
    }
  }
  // empty marks left behind at the edges of the selection
  el.querySelectorAll("mark").forEach((m) => !m.textContent && m.remove());
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

/** Bold or italic on the selection, through the browser's own command (it keeps undo). */
export function applyStyle(cmd: "bold" | "italic") {
  if (!activeEditable()) return false;
  document.execCommand(cmd);
  return true;
}
