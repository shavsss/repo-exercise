// Text editing inside one block: the HTML each editable keeps, the caret, marks, and
// splitting a block at the caret. Same file in both labs.
import DOMPurify from "dompurify";
import katex from "katex";

/**
 * The only markup a block keeps: bold, italic, the four marks, line breaks, sub/superscript,
 * lists (ul, ol, li, nested), and equations inside a line, kept as
 * <span class="im" data-tex="…"></span> (drawn by hydrateMath; what is drawn is not kept).
 */
export function cleanHtml(html: string) {
  const box = document.createElement("div");
  box.innerHTML = html.replace(/\n/g, "<br>");
  // lines the browser wraps in div or p become lines with a break
  box.querySelectorAll("div, p").forEach((d) => {
    const prev = d.previousSibling;
    if (prev && !(prev.nodeType === 1 && /^(BR|OL|UL)$/.test((prev as Element).tagName))) d.before(document.createElement("br"));
    d.replaceWith(...Array.from(d.childNodes));
  });
  box.querySelectorAll("span.im").forEach((s) => {
    const n = document.createElement("span");
    n.className = "im";
    n.setAttribute("data-tex", s.getAttribute("data-tex") ?? "");
    s.replaceWith(n);
  });
  const out = DOMPurify.sanitize(box.innerHTML, { ALLOWED_TAGS: ["b", "strong", "i", "em", "mark", "br", "sub", "sup", "span", "ul", "ol", "li"], ALLOWED_ATTR: ["class", "data-tex", "start"] });
  box.innerHTML = out;
  // other spans the browser adds while typing are unwrapped
  box.querySelectorAll("span:not(.im)").forEach((s) => s.replaceWith(...Array.from(s.childNodes)));
  // a list item with nothing in it keeps a break, so the caret can stand in it
  box.querySelectorAll("li").forEach((li) => {
    if (!li.firstChild || /^(OL|UL)$/.test((li.firstChild as Element).tagName ?? "")) li.prepend(document.createElement("br"));
  });
  box.querySelectorAll("ol, ul").forEach((l) => !l.querySelector("li") && l.remove());
  // a mark left with nothing in it (where the caret left a mark) is dropped
  box.querySelectorAll("mark").forEach((m) => !(m.textContent ?? "").replace(/\u200b/g, "") && !m.querySelector("br, span.im") && m.remove());
  const res = box.innerHTML.replace(/\u200b/g, "");
  return res === "<br>" ? "" : res.replace(/<mark(?! class="hl-[yrbg]")[^>]*>/g, "<mark>");
}

/** Draws the equations inside a line (KaTeX) where they are not drawn yet; a numbered list that
 * goes on from an earlier one (after a box) starts at its number. */
export function hydrateMath(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("ol[start]").forEach((o) => (o.style.counterReset = `sm-li ${Number(o.getAttribute("start")) - 1 || 0}`));
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
  const lis = el.querySelectorAll("li");
  const edge = where === "start" ? el.firstChild : el.lastChild;
  // a block that starts (or ends) with a list: the caret goes into its first (or last) item
  if (lis.length && edge && /^(OL|UL)$/.test((edge as Element).tagName ?? "")) {
    const li = where === "start" ? lis[0] : lis[lis.length - 1];
    const own = Array.from(li.childNodes).filter((n) => !/^(OL|UL)$/.test((n as Element).tagName ?? ""));
    const last = own[own.length - 1];
    if (where === "start" || !last || (last as Element).tagName === "BR") r.setStart(li, 0);
    else r.setStartAfter(last);
    r.collapse(true);
  } else {
    r.selectNodeContents(el);
    r.collapse(where === "start");
  }
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

/** The mark the caret stands in, if any. */
export function caretMark() {
  const el = activeEditable();
  const n = window.getSelection()?.anchorNode;
  const m = n ? (n.nodeType === 1 ? (n as Element) : n.parentElement)?.closest("mark") : null;
  return m && el?.contains(m) ? (m as HTMLElement) : null;
}

function caretAfter(n: Node) {
  const sel = window.getSelection();
  const r = document.createRange();
  r.setStart(n, n.nodeType === 3 ? (n as Text).length : n.childNodes.length);
  r.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(r);
}

/**
 * The caret leaves the mark it stands in: what is typed next is not marked. What follows the
 * caret inside the mark stays marked. True when there was a mark to leave.
 */
export function leaveMark() {
  const m = caretMark();
  const sel = window.getSelection();
  if (!m || !sel || !sel.rangeCount) return false;
  const r = sel.getRangeAt(0);
  const tail = document.createRange();
  tail.setStart(r.startContainer, r.startOffset);
  tail.setEnd(m, m.childNodes.length);
  const frag = tail.extractContents();
  const z = document.createTextNode("\u200b");
  m.after(z);
  if ((frag.textContent ?? "").replace(/\u200b/g, "") || frag.querySelector?.("span.im")) {
    const rest = document.createElement("mark");
    rest.className = m.className;
    rest.appendChild(frag);
    z.after(rest);
  } else z.after(frag); // only the break that ends the block: not marked
  if (!(m.textContent ?? "").replace(/\u200b/g, "") && !m.querySelector("br, span.im")) m.remove();
  caretAfter(z);
  return true;
}

/** Wraps the selection in a mark of one colour (or removes marks from it, with null). With no
 * selection it turns the mark on or off for what is typed next. */
export function applyMark(cls: string | null) {
  const el = activeEditable();
  const sel = window.getSelection();
  if (!el || !sel || !sel.rangeCount) return false;
  if (sel.isCollapsed) {
    const was = caretMark();
    if (was) leaveMark();
    if (cls && (!was || !was.classList.contains(cls))) {
      const m = document.createElement("mark");
      m.className = cls;
      const z = document.createTextNode("\u200b");
      m.appendChild(z);
      sel.getRangeAt(0).insertNode(m);
      caretAfter(z);
    }
    return true;
  }
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

/* ---------------- lists inside a block ---------------- */
const isList = (n: Node | null): n is HTMLElement => !!n && n.nodeType === 1 && /^(OL|UL)$/.test((n as Element).tagName);

/** The list item that holds the caret, inside an editable. */
export function caretLi(el: HTMLElement) {
  const r = selRange(el);
  const n = r?.startContainer;
  const li = n ? (n.nodeType === 1 ? (n as Element) : n.parentElement)?.closest("li") : null;
  return li && el.contains(li) ? (li as HTMLLIElement) : null;
}

/** The item's own text, without the items nested under it. */
export function liText(li: HTMLElement) {
  return Array.from(li.childNodes)
    .filter((n) => !isList(n))
    .map((n) => (n.nodeType === 1 && (n as Element).matches("span.im") ? "∑" : n.textContent))
    .join("");
}

/** Whether the caret stands at the very start of a list item. */
export function atLiStart(li: HTMLElement) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !sel.isCollapsed) return false;
  const r = sel.getRangeAt(0);
  const pre = document.createRange();
  pre.setStart(li, 0);
  pre.setEnd(r.startContainer, r.startOffset);
  return !pre.toString().length && !pre.cloneContents().querySelector("span.im");
}

function caretAtStartOf(n: Node) {
  const sel = window.getSelection();
  const r = document.createRange();
  if (n.nodeType === 3) r.setStart(n, 0);
  else if ((n as Element).tagName === "BR") r.setStartBefore(n);
  else r.setStart(n, 0);
  r.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(r);
}

/** Tab: the item goes under the item before it (1.1). False when there is none. */
export function indentLi(li: HTMLElement) {
  const prev = li.previousElementSibling;
  const list = li.parentElement;
  if (!prev || prev.tagName !== "LI" || !list) return false;
  const last = prev.lastElementChild;
  const sub = isList(last) ? last : prev.appendChild(document.createElement(list.tagName.toLowerCase()));
  sub.appendChild(li);
  caretAtStartOf(li.firstChild ?? li);
  return true;
}

/**
 * Shift+Tab, or Enter on an empty nested item: the item goes up one level, and the items
 * after it become its own. At the top level the item leaves the list and becomes a line.
 */
export function outdentLi(li: HTMLElement) {
  const list = li.parentElement!;
  const after: Element[] = [];
  for (let n = li.nextElementSibling; n; n = n.nextElementSibling) after.push(n);
  const parentLi = list.parentElement?.tagName === "LI" ? list.parentElement : null;
  if (parentLi) {
    if (after.length) {
      const last = li.lastElementChild;
      const sub = isList(last) ? last : li.appendChild(document.createElement(list.tagName.toLowerCase()));
      sub.append(...after);
    }
    parentLi.after(li);
    if (!list.children.length) list.remove();
    caretAtStartOf(li.firstChild ?? li);
    return;
  }
  if (after.length) {
    const rest = document.createElement(list.tagName.toLowerCase());
    rest.append(...after);
    list.after(rest);
  }
  const subs = Array.from(li.childNodes).filter(isList);
  subs.forEach((x) => x.remove());
  const line = Array.from(li.childNodes);
  if (!liText(li).trim() && !li.querySelector("span.im")) line.splice(0, line.length, document.createElement("br"));
  const next = list.nextSibling;
  if (next && !isList(next) && line[line.length - 1]?.nodeName !== "BR") line.push(document.createElement("br"));
  list.after(...line, ...subs);
  li.remove();
  if (!list.children.length) list.remove();
  caretAtStartOf(line[0]);
}

/** Whether a list is the last thing in an editable (only breaks or spaces after it). */
export function listEndsBlock(el: HTMLElement, list: HTMLElement) {
  for (let n = list.nextSibling; n; n = n.nextSibling) {
    if (n.nodeType === 3 && !n.textContent!.trim()) continue;
    if (n.nodeName === "BR") continue;
    return false;
  }
  return el.contains(list);
}

/** The text from the start of the caret's line to the caret ("-" or "1." makes a list). */
export function linePrefix(el: HTMLElement) {
  const r = selRange(el);
  if (!r || !r.collapsed) return null;
  const pre = document.createRange();
  pre.selectNodeContents(el);
  pre.setEnd(r.startContainer, r.startOffset);
  const box = document.createElement("div");
  box.appendChild(pre.cloneContents());
  box.querySelectorAll("br, li, ol, ul").forEach((b) => b.before("\n"));
  const t = box.textContent ?? "";
  return t.slice(t.lastIndexOf("\n") + 1);
}

/** A numbered list becomes bullets, or back, for the list that holds the caret. */
export function swapListKind(el: HTMLElement) {
  const li = caretLi(el);
  const list = li?.parentElement;
  if (!li || !list) return false;
  const sel = window.getSelection();
  const r = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
  const nl = document.createElement(list.tagName === "OL" ? "ul" : "ol");
  nl.append(...Array.from(list.childNodes));
  list.replaceWith(nl);
  if (r) {
    sel!.removeAllRanges();
    sel!.addRange(r);
  }
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

/**
 * Copying text with equations (from a lesson, or from the summary). The browser leaves KaTeX's
 * LaTeX (its annotation) out of what it copies, so 2^{128} would arrive as "2128". The copy is
 * written here instead: each equation as an equation inside a line (span.im) in the HTML, and as
 * $…$ in the plain text. A selection that starts or ends inside an equation takes all of it.
 */
export function copyWithMath(e: ClipboardEvent) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || sel.isCollapsed || !e.clipboardData) return;
  const a = document.activeElement;
  if (a && /^(INPUT|TEXTAREA|MATH-FIELD)$/.test(a.tagName)) return;
  const r = sel.getRangeAt(0).cloneRange();
  const whole = (n: Node) => {
    const el = (n.nodeType === 1 ? (n as Element) : n.parentElement)?.closest(".katex-display, .katex, span.im");
    return el ? (el.closest(".katex-display") ?? el.closest("span.im") ?? el) : null;
  };
  const s0 = whole(r.startContainer);
  if (s0) r.setStartBefore(s0);
  const e0 = whole(r.endContainer);
  if (e0) r.setEndAfter(e0);
  const box = document.createElement("div");
  box.appendChild(r.cloneContents());
  if (!box.querySelector(".katex, span.im")) return; // no equations: the browser's own copy
  box.querySelectorAll("span.im").forEach((x) => box.contains(x) && x.replaceWith(mathSpan(x.getAttribute("data-tex") ?? "")));
  box.querySelectorAll(".katex-display, .katex").forEach((k) => {
    if (!box.contains(k)) return;
    const tex = k.querySelector('annotation[encoding="application/x-tex"]')?.textContent?.trim();
    k.replaceWith(tex ? mathSpan(tex) : document.createTextNode(k.querySelector(".katex-html")?.textContent ?? ""));
  });
  box.querySelectorAll("script, style, button, svg").forEach((x) => x.remove());
  const text = box.cloneNode(true) as HTMLElement;
  text.querySelectorAll("span.im").forEach((x) => x.replaceWith(`$${x.getAttribute("data-tex")}$`));
  text.querySelectorAll("br").forEach((x) => x.replaceWith("\n"));
  text.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, tr").forEach((x) => x.append("\n"));
  e.clipboardData.setData("text/html", box.innerHTML);
  e.clipboardData.setData("text/plain", (text.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim());
  e.preventDefault();
}
