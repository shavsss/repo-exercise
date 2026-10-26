// Text editing inside one block: the HTML each editable keeps, the caret, marks, and
// splitting a block at the caret. Same file in both labs.
import DOMPurify from "dompurify";

/** The only markup a block keeps: bold, italic, the four marks, line breaks, sub/superscript. */
export function cleanHtml(html: string) {
  const out = DOMPurify.sanitize(html.replace(/\n/g, "<br>"), { ALLOWED_TAGS: ["b", "strong", "i", "em", "mark", "br", "sub", "sup"], ALLOWED_ATTR: ["class"] });
  return out === "<br>" ? "" : out.replace(/<mark(?! class="hl-[yrbg]")[^>]*>/g, "<mark>");
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
