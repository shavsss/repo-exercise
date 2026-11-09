import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Block, BoxAlign, BoxKind, ListItem, MarkColor } from "./model";
import { BOX_LABEL, HEAD_EMOJI, MARK_LABEL, emptyBlock, flatLists, itemNumbers, numbering, textOf, uid } from "./model";
import { activeEditable, applyMark, applyStyle, atLiStart, caret, caretLi, caretMark, caretOnEdgeLine, dedupeMath, dropEmptyMarks, lineToList, normalizeInline, splitLi, tidyAround, tidyLists, tidyTex, retagList, cleanHtml, convertDollars, hydrateMath, indentLi, insertMathAt, leaveMark, linePrefix, listEndsBlock, liText, outdentLi, pastedHtml, placeCaret, splitAtCaret, swapListKind } from "./rich";
import { EqStepsEditor, MathEditor, MathView } from "./MathEdit";
import { Picture } from "./Picture";
import { storeImage } from "./media";
import { Icon } from "../components/Icon";

export type Change = "text" | "struct";
type Upd = (fn: (bs: Block[]) => Block[], kind: Change) => void;
type Where = "start" | "end" | number;

/* ---------------- what can be inserted ---------------- */
interface InsertItem {
  id: string;
  label: string;
  hint: string;
  keys: string;
  /** a shorter name for the ribbon */
  short?: string;
  make?: () => Block;
}
const INSERT: InsertItem[] = [
  { id: "p", label: "פסקה", short: "פסקה", hint: "טקסט רגיל", keys: "p פסקה טקסט", make: () => emptyBlock("p") },
  { id: "h1", label: "כותרת פרק", short: "פרק", hint: "1, 2, 3", keys: "h1 כותרת פרק", make: () => ({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), level: 1 }) },
  { id: "h2", label: "כותרת סעיף", short: "סעיף", hint: "1.1, 1.2", keys: "h2 סעיף כותרת", make: () => ({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), level: 2 }) },
  { id: "h3", label: "תת-סעיף", short: "תת-סעיף", hint: "1.1.1", keys: "h3 תת סעיף", make: () => ({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), level: 3 }) },
  // a list lives inside a paragraph or a box: in the block being written, or in a new paragraph
  { id: "ul", label: "רשימת תבליטים", short: "• רשימה", hint: "- ורווח", keys: "ul רשימה תבליטים", make: () => ({ ...(emptyBlock("p") as Extract<Block, { t: "p" }>), html: "<ul><li><br></li></ul>" }) },
  { id: "ol", label: "רשימה ממוספרת", short: "1. רשימה", hint: "1. ורווח", keys: "ol רשימה ממוספרת מספרים", make: () => ({ ...(emptyBlock("p") as Extract<Block, { t: "p" }>), html: "<ol><li><br></li></ol>" }) },
  ...(Object.keys(BOX_LABEL) as BoxKind[]).map((k) => ({ id: `box-${k}`, label: BOX_LABEL[k], hint: "תיבה", keys: `תיבה box ${BOX_LABEL[k]}`, make: () => ({ ...(emptyBlock("box") as Extract<Block, { t: "box" }>), kind: k, ...(k === "eq" ? { latex: "" } : {}) }) })),
  { id: "math", label: "משוואה", short: "∑ משוואה", hint: "ממוספרת", keys: "math משוואה נוסחה $$", make: () => emptyBlock("math") },
  { id: "img", label: "תמונה מהמחשב", short: "🖼 תמונה", hint: "או הדבק Ctrl+V", keys: "img תמונה צילום" },
  { id: "fig", label: "איור מהספר", short: "📖 איור מהספר", hint: "מספרי הספרייה", keys: "fig איור ספר" },
  { id: "lesson", label: "גרף או איור מהשיעור", short: "📈 מהשיעור", hint: "מהשיעור הפתוח בחלון השני", keys: "lesson שיעור גרף איור תמונה" },
  { id: "hr", label: "קו מפריד", short: "― קו", hint: "", keys: "hr קו מפריד", make: () => emptyBlock("hr") },
];
const MARKS: MarkColor[] = ["y", "r", "b", "g", "p", "o"];

/** Symbols that are not on the keyboard: the character for text, and its LaTeX for an equation. */
const SYMBOLS: { title: string; items: [string, string][] }[] = [
  { title: "יווניות", items: "α\\alpha β\\beta γ\\gamma δ\\delta ε\\varepsilon ζ\\zeta η\\eta θ\\theta κ\\kappa λ\\lambda μ\\mu ν\\nu ξ\\xi π\\pi ρ\\rho σ\\sigma τ\\tau φ\\varphi χ\\chi ψ\\psi ω\\omega".split(" ").map((x) => [x[0], x.slice(1)] as [string, string]) },
  { title: "יווניות גדולות", items: "Γ\\Gamma Δ\\Delta Θ\\Theta Λ\\Lambda Ξ\\Xi Π\\Pi Σ\\Sigma Φ\\Phi Ψ\\Psi Ω\\Omega".split(" ").map((x) => [x[0], x.slice(1)] as [string, string]) },
  { title: "יחסים", items: [["≈", "\\approx"], ["≠", "\\ne"], ["≡", "\\equiv"], ["≤", "\\le"], ["≥", "\\ge"], ["≪", "\\ll"], ["≫", "\\gg"], ["∝", "\\propto"], ["∼", "\\sim"], ["≅", "\\cong"]] },
  { title: "פעולות", items: [["±", "\\pm"], ["∓", "\\mp"], ["×", "\\times"], ["·", "\\cdot"], ["÷", "\\div"], ["√", "\\sqrt{}"], ["∞", "\\infty"], ["∂", "\\partial"], ["∇", "\\nabla"], ["∑", "\\sum"], ["∏", "\\prod"], ["∫", "\\int"], ["∮", "\\oint"]] },
  { title: "חצים", items: [["→", "\\to"], ["←", "\\leftarrow"], ["↔", "\\leftrightarrow"], ["⇒", "\\Rightarrow"], ["⇐", "\\Leftarrow"], ["⇔", "\\Leftrightarrow"], ["↑", "\\uparrow"], ["↓", "\\downarrow"]] },
  { title: "עוד", items: [["°", "^\\circ"], ["′", "'"], ["∈", "\\in"], ["∉", "\\notin"], ["⊂", "\\subset"], ["∪", "\\cup"], ["∩", "\\cap"], ["∀", "\\forall"], ["∃", "\\exists"], ["∠", "\\angle"], ["⊥", "\\perp"], ["∥", "\\parallel"], ["ℏ", "\\hbar"], ["Å", "\\text{Å}"], ["‰", "\\text{‰}"], ["²", "^2"], ["³", "^3"], ["⁻¹", "^{-1}"], ["½", "\\frac12"]] },
];

/** Puts a symbol where the writing is: an open equation field, or the text. */
function insertSymbol(ch: string, tex: string) {
  const a = document.activeElement as (HTMLElement & { insert?: (s: string) => void }) | null;
  if (a && a.tagName === "MATH-FIELD" && a.insert) return a.insert(tex);
  if (activeEditable()) document.execCommand("insertText", false, ch);
}

/** What is on where the caret is: bold, italic, sub/superscript, a mark, a list. */
interface Fmt {
  b: boolean;
  i: boolean;
  sup: boolean;
  sub: boolean;
  mark: string | null;
  list: "ol" | "ul" | null;
  /** the bullet of the bulleted list at the caret ("" for the plain dot) */
  bullet: string;
  /** the list at the caret, as "ul:b-dash", "ol:n-heb", "ol:proof" */
  kind: string;
  /** in a proof list, the kind of the step at the caret */
  step: string;
}
const NO_FMT: Fmt = { b: false, i: false, sup: false, sub: false, mark: null, list: null, bullet: "", kind: "", step: "" };
/** the four alignments of a box's text, with their icons (lines of the right lengths) */
const alignIcon = (lines: [number, number][]) => (
  <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden>
    {lines.map(([x, w], i) => (
      <rect key={i} x={x} y={1 + i * 4} width={w} height="1.6" rx="0.8" fill="currentColor" />
    ))}
  </svg>
);
const ALIGNS: [BoxAlign, string, ReactNode][] = [
  ["start", "יישור לימין", alignIcon([[0, 16], [6, 10], [0, 16], [4, 12]])],
  ["center", "מרכז", alignIcon([[0, 16], [3, 10], [0, 16], [2, 12]])],
  ["end", "יישור לשמאל", alignIcon([[0, 16], [0, 10], [0, 16], [0, 12]])],
  ["justify", "יישור לשני הצדדים", alignIcon([[0, 16], [0, 16], [0, 16], [0, 16]])],
];
/** the kinds of list the ribbon offers: tag, class, sign, name */
const LIST_KINDS: ["ol" | "ul", string, string, string][] = [
  ["ul", "", "•", "עיגול"],
  ["ul", "b-circle", "◦", "עיגול ריק"],
  ["ul", "b-square", "▪", "ריבוע"],
  ["ul", "b-dash", "–", "קו"],
  ["ul", "b-arrow", "←", "חץ"],
  ["ul", "b-check", "✓", "וי"],
  ["ul", "b-star", "★", "כוכב"],
  ["ul", "b-diamond", "◆", "יהלום"],
  ["ol", "", "1.", "מספרים (1.1)"],
  ["ol", "n-heb", "א.", "אותיות"],
  ["ol", "n-alpha", "a.", "אותיות לטיניות"],
  ["ol", "n-roman", "i.", "ספרות רומיות"],
];
/** the steps of a proof list, each numbered on its own */
const PROOF_STEPS: [string, string][] = [
  ["def", "הגדרה"],
  ["hyp", "הנחה"],
  ["giv", "נתון"],
  ["dev", "פיתוח"],
  ["con", "מסקנה"],
];
/** the icon of each kind of box (the rail, the flyout and the box's own head) */
export const BOX_ICON: Record<BoxKind, string> = { con: "boxcon", def: "boxdef", ex: "boxex", eq: "sigma", q: "think", err: "erratum" };
/** the rail: the three boxes in use most (by the learner's own summary), the rest in a flyout */
const RAIL_BOXES: [BoxKind, string][] = [
  ["con", "מסקנה"],
  ["def", "הגדרה"],
  ["ex", "דוגמה"],
];
const MORE_BOXES: BoxKind[] = ["eq", "q", "err"];
/** the markers in the bubble, in the order of use */
const BUBBLE_MARKS: MarkColor[] = ["y", "b", "g", "p", "o", "r"];
type Fly = "boxes" | "insert" | "proof" | "list";

/**
 * The first sentence of a block's text, as a range: up to the first ".", ":", "?" or "!" that
 * ends a word, or to the end of the first line. Equations inside the line count as words.
 */
function firstSentence(el: HTMLElement): Range | null {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n.nodeType === 1 && (n as Element).matches("span.im") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  let start: Text | null = null;
  let startOff = 0;
  let last: Text | null = null;
  let lastEnd = 0;
  const range = (end: Text, off: number) => {
    const r = document.createRange();
    r.setStart(start!, startOff);
    r.setEnd(end, off);
    return r;
  };
  let n: Node | null;
  while ((n = w.nextNode())) {
    if (n.nodeType === 1) {
      const t = (n as Element).tagName;
      // the end of the first line (Shift+Enter, or a list under it)
      if (t === "BR" || t === "OL" || t === "UL") {
        if (start && last) return range(last, lastEnd);
        if (t !== "BR") return null;
      }
      continue;
    }
    const s = (n as Text).data;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (!start) {
        if (/[\s\u200b]/.test(ch)) continue;
        start = n as Text;
        startOff = i;
      }
      if (!/[\s\u200b]/.test(ch)) {
        last = n as Text;
        lastEnd = i + 1;
      }
      if (/[.:?!]/.test(ch) && (i + 1 === s.length || /\s/.test(s[i + 1]))) return range(n as Text, i + 1);
    }
  }
  return null;
}
/**
 * The list at the caret becomes this kind, or (with no list there) a list of this kind starts on
 * the caret's line; in a heading, on a new line under its text. Proof steps: the step's kind.
 */
function applyListKind(tag: "ol" | "ul", cls: string, step?: string) {
  const el = activeEditable();
  if (!el) return;
  const changed = () => el.dispatchEvent(new Event("input", { bubbles: true }));
  tidyAround(el, normalizeInline);
  const li = caretLi(el);
  if (!li) {
    // no list here: the caret's line becomes a new list of this kind (in a heading, a new line under its text)
    if (el.closest(".sm-h") && !onLaterLine(el)) {
      placeCaret(el, "end");
      document.execCommand("insertLineBreak");
    }
    if (lineToList(el, tag, cls, step ? `k-${step}` : "", true)) changed();
    return;
  }
  const old = li.parentElement;
  if (!old) return;
  const isProof = old.classList.contains("proof");
  if (step && isProof) {
    // on an empty step, or at the very start of one: that step becomes this kind
    if (!liText(li).replace(/\u200b/g, "").trim() || atLiStart(li)) {
      li.className = `k-${step}`;
      return changed();
    }
    // on a step with text: the next step, of this kind (נתון 1 → הנחה 1 → הנחה 2 → מסקנה 1)
    const next = document.createElement("li");
    next.className = `k-${step}`;
    next.appendChild(document.createElement("br"));
    li.after(next);
    const r = document.createRange();
    r.setStart(next, 0);
    r.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(r);
    return changed();
  }
  // the same family (another bullet, another numbering): the list at the caret becomes this kind
  if (old.tagName.toLowerCase() === tag && isProof === (cls === "proof")) {
    const list = retagList(old, tag);
    if (cls) list.className = cls;
    else list.removeAttribute("class");
    if (step) li.className = `k-${step}`;
    return changed();
  }
  // another family (bullets or a proof inside a numbered list, …): a list inside the list, as a
  // sub-section under the item at the caret; an empty item becomes its first item
  const sub = document.createElement(tag);
  if (cls) sub.className = cls;
  let item: HTMLElement;
  if (!liText(li).replace(/\u200b/g, "").trim() && li.previousElementSibling?.tagName === "LI") {
    item = li;
    li.previousElementSibling.appendChild(sub);
  } else {
    item = document.createElement("li");
    item.appendChild(document.createElement("br"));
    li.appendChild(sub);
  }
  sub.appendChild(item);
  if (step) item.className = `k-${step}`;
  else item.removeAttribute("class");
  const r = document.createRange();
  r.setStart(item, 0);
  r.collapse(true);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(r);
  changed();
}
function placeCaretIn(li: HTMLElement) {
  const r = document.createRange();
  r.setStart(li, 0);
  r.collapse(true);
  window.getSelection()?.removeAllRanges();
  window.getSelection()?.addRange(r);
}
/** whether the caret is on a line below the first line of an editable */
function onLaterLine(el: HTMLElement) {
  const c = caret(el);
  const pre = linePrefix(el) ?? "";
  return !!c && !!(el.textContent ?? "").slice(0, Math.max(0, c.before - pre.length)).replace(/\u200b/g, "").trim();
}
function readFmt(): Fmt {
  const el = activeEditable();
  if (!el) return NO_FMT;
  const q = (c: string) => {
    try {
      return document.queryCommandState(c);
    } catch {
      return false;
    }
  };
  const li = caretLi(el);
  const list = li?.parentElement;
  return {
    b: q("bold"),
    i: q("italic"),
    sup: q("superscript"),
    sub: q("subscript"),
    mark: caretMark()?.className.match(/hl-[yrbgpo]/)?.[0] ?? null,
    list: list ? (list.tagName === "OL" ? "ol" : "ul") : null,
    bullet: list?.className.match(/b-(\w+)/)?.[1] ?? "",
    kind: list ? `${list.tagName.toLowerCase()}:${list.className.match(/(?:b|n)-\w+|proof/)?.[0] ?? ""}` : "",
    step: list?.classList.contains("proof") ? (li!.className.match(/k-(\w+)/)?.[1] ?? "def") : "",
  };
}

/** an empty paragraph (a leftover of Enter): drawn a few pixels high unless the caret is in it */
function isEmptyPara(b: Block) {
  return b.t === "p" && !/<(img|span|ol|ul|hr)\b/i.test(b.html) && !textOf(b.html).replace(/[\s\u200b]/g, "");
}

/* ---------------- one editable ---------------- */
function Rich({ fkey, html, onChange, onKeyDown, placeholder, className, onMath }: { fkey: string; html: string; onChange: (h: string) => void; onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void; placeholder?: string; className?: string; onMath?: (span: HTMLElement) => void }) {
  const el = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const e = el.current!;
    if (document.activeElement !== e && cleanHtml(e.innerHTML) !== html) e.innerHTML = html;
    if (document.activeElement !== e) {
      // left in summaries saved before
      dropEmptyMarks(e);
      dedupeMath(e);
      normalizeInline(e);
      // (not a block just made with an empty list in it, where the caret is about to go)
      if ((e.textContent ?? "").replace(/[\u200b\s]/g, "")) tidyLists(e);
      hydrateMath(e);
    }
    hydrateMath(e);
  }, [html]);
  return (
    <div
      ref={el}
      data-edit={fkey}
      className={`sm-rich ${className ?? ""}`}
      contentEditable
      suppressContentEditableWarning
      data-ph={placeholder}
      onInput={() => {
        const e = el.current!;
        dropEmptyMarks(e, caretMark());
        dedupeMath(e);
        convertDollars(e);
        hydrateMath(e);
        const h = cleanHtml(e.innerHTML);
        if (!h && e.innerHTML) e.innerHTML = "";
        onChange(h);
      }}
      onKeyDown={onKeyDown}
      onBlur={() => {
        // leaving the block: no empty mark stays behind
        const a = dropEmptyMarks(el.current!);
        const n = normalizeInline(el.current!);
        const l = tidyLists(el.current!) || n;
        if (dedupeMath(el.current!) || a || l) onChange(cleanHtml(el.current!.innerHTML));
      }}
      onClick={(e) => {
        const span = (e.target as HTMLElement).closest<HTMLElement>("span.im");
        if (span && onMath) onMath(span);
      }}
      onPaste={(e) => {
        if (e.clipboardData.files.length) return; // pictures: the editor takes them
        e.preventDefault();
        const html = e.clipboardData.getData("text/html");
        // from a lesson: its equations stay equations
        if (html) document.execCommand("insertHTML", false, pastedHtml(html));
        else document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
      }}
    />
  );
}

/* ---------------- the editor ---------------- */
export function Editor({
  blocks,
  update,
  current,
  setCurrent,
  onPickFigure,
  onPickLesson,
  zoom = 1,
}: {
  blocks: Block[];
  update: Upd;
  current: string | null;
  setCurrent: (id: string | null) => void;
  /** opens the figure picker; the chosen figure is inserted after the given block */
  onPickFigure: (after: string | null) => void;
  /** a chart or a picture from the lesson open in the other window */
  onPickLesson: (after: string | null) => void;
  zoom?: number;
}) {
  const focusReq = useRef<{ key: string; where: Where; at: number } | null>(null);
  const [editingMath, setEditingMath] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ id: string; filter: string; sel: number } | null>(null);
  /** the symbols panel, where it was opened from */
  const [symbols, setSymbols] = useState<{ x: number; y: number } | null>(null);
  const [emojiFor, setEmojiFor] = useState<string | null>(null);
  /** what is on at the caret, so the rail and the bubble show it while writing */
  const [fmt, setFmt] = useState<Fmt>(NO_FMT);
  /** a flyout of the rail (more boxes, insert, proof steps, list kinds), at the button that opened it */
  const [fly, setFly] = useState<{ id: Fly; x: number; y: number; up: boolean } | null>(null);
  /** the bubble over a selection of text: where it points */
  const [bubble, setBubble] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const pressing = useRef(false);
  /** the block whose menu (beside its handle) is open, and the caret in it when the handle was pressed */
  const [blockMenu, setBlockMenu] = useState<string | null>(null);
  const menuRange = useRef<Range | null>(null);
  const refreshFmt = () => {
    // a mark turned on and left empty goes when the caret moves away from it
    const ed = activeEditable();
    if (ed) dropEmptyMarks(ed, caretMark());
    setFmtNow();
    placeBubble();
  };
  /** the bubble shows over a selection inside the page's text, once the pointer is up */
  const placeBubble = () => {
    const sel = window.getSelection();
    const el = activeEditable();
    if (pressing.current || !sel || sel.isCollapsed || !sel.rangeCount || !el || !pageRef.current?.contains(el) || !el.contains(sel.focusNode)) return setBubble(null);
    const r = sel.getRangeAt(0).getBoundingClientRect();
    if (!r.width && !r.height) return setBubble(null);
    // on a phone the system's own menu is above the selection: the bubble goes below it
    const below = window.innerWidth <= 640 || r.top < 120;
    const nb = { x: Math.round(r.left + r.width / 2), y: Math.round(below ? r.bottom + 8 : r.top - 8), below };
    setBubble((old) => (old && old.x === nb.x && old.y === nb.y && old.below === nb.below ? old : nb));
  };
  useEffect(() => {
    const down = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.(".sm-bubble, .sm-symbols-pop, .sm-inline-pop")) return;
      if (pageRef.current?.contains(t)) {
        pressing.current = true;
        setBubble(null);
      }
      if (!t.closest?.(".sm-fly, [data-fly]")) setFly(null);
      if (!t.closest?.(".sm-bmenu, .sm-handle")) setBlockMenu(null);
    };
    const up = () => {
      if (!pressing.current) return;
      pressing.current = false;
      requestAnimationFrame(placeBubble);
    };
    const moved = () => requestAnimationFrame(placeBubble);
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setFly(null);
      setBlockMenu(null);
      setSymbols(null);
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("scroll", moved, true);
    window.addEventListener("resize", moved);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("scroll", moved, true);
      window.removeEventListener("resize", moved);
      document.removeEventListener("keydown", esc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // the bubble stays inside the window
  useLayoutEffect(() => {
    const b = bubbleRef.current;
    if (!b || !bubble) return;
    const w = b.offsetWidth;
    b.style.left = `${Math.max(8, Math.min(bubble.x - w / 2, window.innerWidth - w - 8))}px`;
  }, [bubble]);
  const setFmtNow = () =>
    setFmt((old) => {
      const n = readFmt();
      return JSON.stringify(n) === JSON.stringify(old) ? old : n;
    });
  useEffect(() => {
    document.addEventListener("selectionchange", refreshFmt);
    return () => document.removeEventListener("selectionchange", refreshFmt);
  }, []);
  /** a rail or bubble action, then they show the new state */
  const act = (fn: () => unknown) => () => {
    fn();
    refreshFmt();
  };
  /** the small equation editor for an equation inside a line: a new one at a place in the text, or one already there */
  const [inline, setInline] = useState<{ top: number; left: number; tex: string; span?: HTMLElement; range?: Range; host: HTMLElement } | null>(null);
  const inlineTex = useRef("");
  const openInline = (span?: HTMLElement) => {
    const host = span ? span.closest<HTMLElement>("[data-edit]") : activeEditable();
    if (!host) return;
    const sel = window.getSelection();
    const range = !span && sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : undefined;
    const r = span ? span.getBoundingClientRect() : (range?.getClientRects()[0] ?? host.getBoundingClientRect());
    const tex = span?.getAttribute("data-tex") ?? (range && !range.collapsed ? range.toString() : "");
    inlineTex.current = tex;
    setInline({ top: Math.min(r.bottom + 6, window.innerHeight - 140), left: Math.max(12, Math.min(r.left - 40, window.innerWidth - 580)), tex, span, range, host });
  };
  const closeInline = (how: "enter" | "escape" | "blur") => {
    const st = inline;
    setInline(null);
    if (!st) return;
    const tex = inlineTex.current.trim();
    if (st.span) {
      if (how !== "escape") {
        if (!tex) st.span.remove();
        else {
          st.span.setAttribute("data-tex", tidyTex(tex));
          delete st.span.dataset.done;
          hydrateMath(st.host);
        }
        st.host.dispatchEvent(new Event("input", { bubbles: true }));
      }
      placeCaret(st.host, "end");
    } else if (st.range && tex && how !== "escape") insertMathAt(st.range, tex);
    else placeCaret(st.host, "end");
  };
  const [drag, setDrag] = useState<{ id: string; over: string | null; after: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileAfter = useRef<string | null>(null);
  const { heads, eqs, conts } = useMemo(() => numbering(blocks), [blocks]);

  useLayoutEffect(() => {
    const r = focusReq.current;
    if (!r) return;
    // a request whose block never appeared is dropped, so it cannot take the focus later
    if (Date.now() - r.at > 800) {
      focusReq.current = null;
      return;
    }
    const el = document.querySelector<HTMLElement>(`[data-edit="${CSS.escape(r.key)}"]`);
    if (el) {
      placeCaret(el, r.where);
      focusReq.current = null;
    }
  });
  const focus = (key: string, where: Where) => (focusReq.current = { key, where, at: Date.now() });

  /* ---- block operations ---- */
  const idx = (bs: Block[], id: string) => bs.findIndex((b) => b.id === id);
  const patch = (id: string, p: Partial<Block>, kind: Change = "text") => update((bs) => bs.map((b) => (b.id === id ? ({ ...b, ...p } as Block) : b)), kind);
  const insertAfter = (id: string | null, nb: Block | Block[]) => {
    const list = Array.isArray(nb) ? nb : [nb];
    update((bs) => {
      const i = id ? idx(bs, id) : bs.length - 1;
      return [...bs.slice(0, i + 1), ...list, ...bs.slice(i + 1)];
    }, "struct");
  };
  const remove = (id: string) => update((bs) => (bs.length > 1 ? bs.filter((b) => b.id !== id) : [emptyBlock("p")]), "struct");
  const move = (id: string, d: -1 | 1) =>
    update((bs) => {
      const i = idx(bs, id);
      const j = i + d;
      if (i < 0 || j < 0 || j >= bs.length) return bs;
      const c = [...bs];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    }, "struct");
  const keyOf = (b: Block, end: boolean): string | null =>
    b.t === "p" || b.t === "h" || b.t === "box" ? b.id : b.t === "list" ? `${b.id}:${end ? b.items.length - 1 : 0}` : null;
  /** focus the nearest text block before (-1) or after (1) a block */
  const step = (id: string, d: -1 | 1, where: Where) => {
    let i = idx(blocks, id) + d;
    while (i >= 0 && i < blocks.length) {
      const k = keyOf(blocks[i], d < 0);
      if (k) {
        const el = document.querySelector<HTMLElement>(`[data-edit="${CSS.escape(k)}"]`);
        if (el) placeCaret(el, where);
        return true;
      }
      i += d;
    }
    return false;
  };

  /* ---- insert from the menu or the ribbon ---- */
  const doInsert = (item: InsertItem, at: string | null) => {
    setMenu(null);
    const cur = at ? blocks.find((b) => b.id === at) : null;
    const replace = cur && cur.t === "p" && !textOf(cur.html).trim().replace(/^\/\S*/, "").trim();
    if ((item.id === "ul" || item.id === "ol") && !replace) {
      // the list goes into the block being written, at the caret; in a heading (a section written
      // in its heading) on a new line under its text
      const el = activeEditable();
      const tb = el ? blocks.find((x) => x.id === el.dataset.edit) : null;
      if (el && tb && (tb.t === "p" || tb.t === "box" || tb.t === "h")) {
        applyListKind(item.id, "");
        return;
      }
    }
    const anchor = replace ? (idx(blocks, cur!.id) > 0 ? blocks[idx(blocks, cur!.id) - 1].id : null) : at;
    if (replace) update((bs) => bs.filter((b) => b.id !== cur!.id), "struct");
    if (item.id === "img") {
      fileAfter.current = anchor ?? (replace ? null : at);
      fileRef.current?.click();
      return;
    }
    if (item.id === "fig") {
      onPickFigure(anchor ?? (replace ? null : at));
      return;
    }
    if (item.id === "lesson") {
      onPickLesson(anchor ?? (replace ? null : at));
      return;
    }
    const nb = item.make!();
    const extra: Block[] = nb.t === "hr" || nb.t === "math" ? [emptyBlock("p")] : [];
    if (anchor === null && replace) update((bs) => [nb, ...extra, ...bs], "struct");
    else insertAfter(anchor ?? at, [nb, ...extra]);
    if (nb.t === "math") setEditingMath(nb.id);
    else if (nb.t === "box" && nb.kind === "eq") setEditingMath(nb.id);
    else if (nb.t === "hr") focus(extra[0].id, "start");
    else focus(keyOf(nb, false)!, "start");
    setCurrent(nb.id);
  };

  const addFiles = async (files: File[], after: string | null) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    let anchor = after;
    for (const f of imgs) {
      const nb = { ...(emptyBlock("img") as Extract<Block, { t: "img" }>) };
      insertAfter(anchor, nb);
      anchor = nb.id;
      setCurrent(nb.id);
      try {
        const r = await storeImage(f);
        update((bs) => bs.map((b) => (b.id === nb.id ? ({ ...b, ...r } as Block) : b)), "struct");
      } catch {
        update((bs) => bs.filter((b) => b.id !== nb.id), "struct");
        alertBox("התמונה לא נשמרה. נסה שוב, או תמונה קטנה יותר.");
      }
    }
  };

  /* ---- keys inside text blocks ---- */
  const textKeys = (b: Extract<Block, { t: "p" | "h" | "box" }>) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (menu && menu.id === b.id) {
      const items = filtered(menu.filter);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setMenu({ ...menu, sel: (menu.sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(1, items.length) });
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (items[menu.sel]) doInsert(items[menu.sel], b.id);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMenu(null);
        return;
      }
    }
    if (e.altKey && /^[0-6]$/.test(e.key)) {
      e.preventDefault();
      applyMark(e.key === "0" ? null : `hl-${MARKS[Number(e.key) - 1]}`);
      refreshFmt();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "m" || e.key === "M" || e.code === "KeyM")) {
      e.preventDefault();
      openInline();
      return;
    }
    if (listKeysIn(b, el, e)) return;
    if (e.key === "Enter" && e.shiftKey && !e.nativeEvent.isComposing) {
      // a new line in the same block; a mark does not go on to it
      e.preventDefault();
      document.execCommand("insertLineBreak");
      leaveMark();
      return;
    }
    const c = caret(el);
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (b.t === "box") {
        // Enter at the end leaves the box, into the paragraph after it; inside the text it is
        // a new line (Shift+Enter is a new line anywhere)
        if (c && c.before === c.total) {
          const h = cleanHtml(cleanHtml(el.innerHTML).replace(/(<br>|\n|\s)+$/, "").replace(/<br>(<\/mark>)$/, "$1"));
          el.innerHTML = h;
          patch(b.id, { html: h });
          leaveBox(b.id);
        } else {
          document.execCommand("insertLineBreak");
          leaveMark();
        }
        return;
      }
      if (b.t === "h") {
        // a heading: Enter opens the next heading of the same level (1.2.4 → 1.2.5); Enter on
        // an empty heading makes it a plain paragraph
        if (!textOf(cleanHtml(el.innerHTML)).replace(/\u200b/g, "").trim()) {
          update((bs) => bs.map((x) => (x.id === b.id ? ({ id: b.id, t: "p", html: "" } as Block) : x)), "struct");
          focus(b.id, "start");
          return;
        }
        const { head, tail } = splitAtCaret(el);
        const nh: Block = { id: uid(), t: "h", level: b.level, html: tail };
        update((bs) => {
          const i = idx(bs, b.id);
          const c2 = bs.map((x) => (x.id === b.id ? ({ ...x, html: head } as Block) : x));
          return [...c2.slice(0, i + 1), nh, ...c2.slice(i + 1)];
        }, "struct");
        focus(nh.id, "start");
        return;
      }
      // in a paragraph, Enter after a line with text opens a numbered item under it
      // (Shift+Enter is a plain line; Enter on the empty item leaves, into a new block)
      if ((linePrefix(el) ?? "").replace(/\u200b/g, "").trim()) {
        document.execCommand("insertLineBreak");
        leaveMark();
        if (lineToList(el, "ol")) el.dispatchEvent(new Event("input", { bubbles: true }));
        return;
      }
      const { head, tail } = splitAtCaret(el);
      const nb = { ...(emptyBlock("p") as Extract<Block, { t: "p" }>), html: tail };
      update((bs) => {
        const i = idx(bs, b.id);
        const c2 = bs.map((x) => (x.id === b.id ? ({ ...x, html: head } as Block) : x));
        return [...c2.slice(0, i + 1), nb, ...c2.slice(i + 1)];
      }, "struct");
      focus(nb.id, "start");
      return;
    }
    if (e.key === "Backspace" && c && c.collapsed && c.before === 0) {
      if (b.t !== "p") {
        e.preventDefault();
        update((bs) => bs.map((x) => (x.id === b.id ? ({ id: b.id, t: "p", html: b.html } as Block) : x)), "struct");
        focus(b.id, "start");
        return;
      }
      const i = idx(blocks, b.id);
      const prev = blocks[i - 1];
      if (!prev) return;
      e.preventDefault();
      if (prev.t === "p" || prev.t === "h" || prev.t === "box") {
        const at = textOf(prev.html).length;
        update((bs) => bs.filter((x) => x.id !== b.id).map((x) => (x.id === prev.id ? ({ ...x, html: cleanHtml(prev.html + b.html) } as Block) : x)), "struct");
        focus(prev.id, at);
      } else if (!c.total) {
        remove(b.id);
        step(b.id, -1, "end");
      } else setCurrent(prev.id);
      return;
    }
    if (e.key === "Delete" && c && c.collapsed && c.before === c.total) {
      const next = blocks[idx(blocks, b.id) + 1];
      if (next && next.t === "p") {
        e.preventDefault();
        update((bs) => bs.filter((x) => x.id !== next.id).map((x) => (x.id === b.id ? ({ ...x, html: cleanHtml(b.html + next.html) } as Block) : x)), "struct");
        focus(b.id, c.before);
      }
      return;
    }
    if (e.key === "ArrowUp" && caretOnEdgeLine(el, "first")) {
      if (step(b.id, -1, "end")) e.preventDefault();
    } else if (e.key === "ArrowDown" && caretOnEdgeLine(el, "last")) {
      if (step(b.id, 1, "start")) e.preventDefault();
    }
  };

  /**
   * A list inside a paragraph or a box. Enter: a new item (the browser makes it); Shift+Enter:
   * a new line in the same item; Enter on an empty item: up one level, and at the top level out
   * of the list (at the end of the block, into a new paragraph block); Tab and Shift+Tab: nesting
   * (1.1, 1.2); "- " or "1. " at the start of a line opens a list. True when the key was taken.
   */
  const listKeysIn = (b: Extract<Block, { t: "p" | "box" | "h" }>, el: HTMLElement, e: React.KeyboardEvent<HTMLDivElement>) => {
    const changed = () => el.dispatchEvent(new Event("input", { bubbles: true }));
    // a key that works on lists: first, no bold or mark may hold a line break or a list
    if (e.key === "Enter" || e.key === "Tab" || e.key === "Backspace" || e.key === " ") tidyAround(el, normalizeInline);
    const li = caretLi(el);
    const space = e.key === " " && !e.ctrlKey && !e.altKey && !e.metaKey;
    if (li && space) {
      // "- " or "1. " at the start of an empty item: a list inside the list, of that kind, under the item before
      const pre = (linePrefix(el) ?? "").replace(/\u200b/g, "");
      const kind = /^[-*•]$/.test(pre) ? "UL" : /^1[.)]$/.test(pre) ? "OL" : null;
      if (kind && liText(li).replace(/\u200b/g, "").trim() === pre) {
        e.preventDefault();
        for (let k = 0; k < pre.length; k++) document.execCommand("delete");
        indentLi(li);
        const list = li.parentElement!;
        if (list.tagName !== kind) {
          const nl = document.createElement(kind.toLowerCase());
          nl.append(...Array.from(list.childNodes));
          list.replaceWith(nl);
          placeCaret(el, 0);
          const r = document.createRange();
          r.setStart(li, 0);
          r.collapse(true);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(r);
        }
        changed();
        return true;
      }
    }
    if (!li) {
      // in a heading, a list starts only on a line below its text (after Shift+Enter)
      if (space && (b.t !== "h" || onLaterLine(el))) {
        const pre = linePrefix(el);
        const kind = pre && /^[-*•]$/.test(pre) ? "ul" : pre && /^1[.)]$/.test(pre) ? "ol" : null;
        if (kind) {
          e.preventDefault();
          for (let k = 0; k < pre!.length; k++) document.execCommand("delete");
          if (lineToList(el, kind)) changed();
          return true;
        }
      }
      return false;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) outdentLi(li);
      else if (!indentLi(li)) return true;
      changed();
      return true;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      if (liText(li).replace(/\u200b/g, "").trim() || li.querySelector("span.im")) {
        e.preventDefault();
        splitLi(li); // the next item
        changed();
        return true;
      }
      e.preventDefault();
      const list = li.parentElement!;
      const nested = list.parentElement?.tagName === "LI";
      if (!nested && !li.nextElementSibling && !li.querySelector("ol, ul") && listEndsBlock(el, list)) {
        // the second Enter: out of the list, into a new block
        li.remove();
        if (!list.querySelector("li")) list.remove();
        const h = cleanHtml(el.innerHTML.replace(/(<br>|\s)+$/, ""));
        el.innerHTML = h;
        patch(b.id, { html: h });
        if (b.t === "box") leaveBox(b.id);
        else if (!h && b.t === "p") placeCaret(el, "start"); // the list was all there was: the paragraph stays, plain
        else {
          const nb = emptyBlock("p");
          insertAfter(b.id, nb);
          focus(nb.id, "start");
        }
        return true;
      }
      outdentLi(li);
      changed();
      return true;
    }
    if (e.key === "Backspace" && atLiStart(li)) {
      e.preventDefault();
      outdentLi(li);
      changed();
      return true;
    }
    return false;
  };

  /** Out of a box at its end: into the empty paragraph after it if there is one, else a new one. */
  const leaveBox = (id: string) => {
    const i = idx(blocks, id);
    // a box in the middle of a list: the list goes on after it, with the next number
    const prev = blocks[i - 1];
    let html = "";
    if (prev && (prev.t === "p" || prev.t === "box")) {
      const body = new DOMParser().parseFromString(prev.html, "text/html").body;
      let last = body.lastChild;
      while (last && (last.nodeName === "BR" || (last.nodeType === 3 && !last.textContent!.trim()))) last = last.previousSibling;
      if (last && (last.nodeName === "OL" || last.nodeName === "UL") && !(last as Element).classList.contains("proof")) {
        const n = (Number((last as Element).getAttribute("start")) || 1) + (last as Element).querySelectorAll(":scope > li").length;
        html = last.nodeName === "OL" ? `<ol start="${n}"><li><br></li></ol>` : "<ul><li><br></li></ul>";
      }
    }
    // a box inside a section written in its heading: the text after it goes on in that section
    let k = i - 1;
    while (k >= 0 && (blocks[k].t === "box" || (blocks[k].t === "p" && !textOf((blocks[k] as Extract<Block, { t: "p" }>).html).trim()))) k--;
    const sec = blocks[k];
    if (!html && sec?.t === "h" && (!sec.plain || sec.cont)) {
      const nc: Block = { id: uid(), t: "h", level: sec.level, html: "", cont: true };
      insertAfter(id, nc);
      focus(nc.id, "start");
      return;
    }
    const next = blocks[i + 1];
    if (next && next.t === "p" && !textOf(next.html).trim()) {
      if (html) patch(next.id, { html }, "struct");
      if (html) return focus(next.id, "start");
      return focusNow(next.id, "start");
    }
    const nb = { ...(emptyBlock("p") as Extract<Block, { t: "p" }>), html };
    insertAfter(id, nb);
    focus(nb.id, "start");
  };

  /** Markdown-like shortcuts at the start of a paragraph, and the "/" menu. */
  const paraInput = (b: Extract<Block, { t: "p" }>, h: string) => {
    const t = textOf(h);
    // the menu opens for "/" alone or "/" and one word, in an otherwise empty paragraph
    if (/^\/[^\s/]{0,24}$/.test(t.trim())) setMenu({ id: b.id, filter: t.trim().slice(1), sel: 0 });
    else if (menu?.id === b.id) setMenu(null);
    const rules: [RegExp, () => Block][] = [
      [/^###\s/, () => ({ id: b.id, t: "h", level: 3, html: "" })],
      [/^##\s/, () => ({ id: b.id, t: "h", level: 2, html: "" })],
      [/^#\s/, () => ({ id: b.id, t: "h", level: 1, html: "" })],
      [/^>\s/, () => ({ id: b.id, t: "box", kind: "def", html: "" })],
      [/^\$\$$/, () => ({ id: b.id, t: "math", latex: "" })],
    ];
    for (const [re, make] of rules) {
      if (re.test(t) && t.length <= 4) {
        const nb = make();
        update((bs) => {
          const i = idx(bs, b.id);
          const out = bs.map((x) => (x.id === b.id ? nb : x));
          return nb.t === "math" ? [...out.slice(0, i + 1), emptyBlock("p"), ...out.slice(i + 1)] : out;
        }, "struct");
        if (nb.t === "math") setEditingMath(nb.id);
        else focus(keyOf(nb, false)!, "start");
        return;
      }
    }
    patch(b.id, { html: h });
  };

  /* ---- lists ---- */
  const listKeys = (b: Extract<Block, { t: "list" }>, i: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const it = b.items[i];
    const setItems = (items: ListItem[], kind: Change = "struct") => patch(b.id, { items } as Partial<Block>, kind);
    if (e.altKey && /^[0-6]$/.test(e.key)) {
      e.preventDefault();
      applyMark(e.key === "0" ? null : `hl-${MARKS[Number(e.key) - 1]}`);
      refreshFmt();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "m" || e.key === "M" || e.code === "KeyM")) {
      e.preventDefault();
      openInline();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const level = Math.max(0, Math.min(2, it.level + (e.shiftKey ? -1 : 1)));
      setItems(b.items.map((x, j) => (j === i ? { ...x, level } : x)));
      focus(`${b.id}:${i}`, caret(el)?.before ?? "end");
      return;
    }
    const c = caret(el);
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!textOf(it.html).trim()) {
        if (it.level > 0) {
          setItems(b.items.map((x, j) => (j === i ? { ...x, level: x.level - 1 } : x)));
          focus(`${b.id}:${i}`, "start");
          return;
        }
        // an empty item at the top level leaves the list
        const before = b.items.slice(0, i);
        const after = b.items.slice(i + 1);
        const np = emptyBlock("p");
        update((bs) => {
          const k = idx(bs, b.id);
          const rest: Block[] = after.length ? [{ ...b, id: uid(), items: after }] : [];
          const head: Block[] = before.length ? [{ ...b, items: before }] : [];
          return [...bs.slice(0, k), ...head, np, ...rest, ...bs.slice(k + 1)];
        }, "struct");
        focus(np.id, "start");
        return;
      }
      const { head, tail } = splitAtCaret(el);
      const items = [...b.items];
      items[i] = { ...it, html: head };
      items.splice(i + 1, 0, { html: tail, level: it.level });
      setItems(items);
      focus(`${b.id}:${i + 1}`, "start");
      return;
    }
    if (e.key === "Backspace" && c && c.collapsed && c.before === 0) {
      e.preventDefault();
      if (it.level > 0) {
        setItems(b.items.map((x, j) => (j === i ? { ...x, level: x.level - 1 } : x)));
        focus(`${b.id}:${i}`, "start");
      } else if (i === 0) {
        const np = { ...(emptyBlock("p") as Extract<Block, { t: "p" }>), html: it.html };
        update((bs) => {
          const k = idx(bs, b.id);
          const rest: Block[] = b.items.length > 1 ? [{ ...b, items: b.items.slice(1) }] : [];
          return [...bs.slice(0, k), np, ...rest, ...bs.slice(k + 1)];
        }, "struct");
        focus(np.id, "start");
      } else {
        const prev = b.items[i - 1];
        const at = textOf(prev.html).length;
        const items = b.items.filter((_, j) => j !== i);
        items[i - 1] = { ...prev, html: cleanHtml(prev.html + it.html) };
        setItems(items);
        focus(`${b.id}:${i - 1}`, at);
      }
      return;
    }
    if (e.key === "ArrowUp" && caretOnEdgeLine(el, "first")) {
      e.preventDefault();
      if (i > 0) focusNow(`${b.id}:${i - 1}`, "end");
      else step(b.id, -1, "end");
    } else if (e.key === "ArrowDown" && caretOnEdgeLine(el, "last")) {
      e.preventDefault();
      if (i < b.items.length - 1) focusNow(`${b.id}:${i + 1}`, "start");
      else step(b.id, 1, "start");
    }
  };
  const focusNow = (key: string, where: Where) => {
    const el = document.querySelector<HTMLElement>(`[data-edit="${CSS.escape(key)}"]`);
    if (el) placeCaret(el, where);
  };

  const filtered = (f: string) => (f ? INSERT.filter((x) => x.keys.includes(f) || x.label.includes(f)) : INSERT);

  /* ---- ribbon actions on the current block ---- */
  const cur = blocks.find((b) => b.id === current) ?? null;
  const convert = (to: string) => {
    if (!cur) return;
    const html = cur.t === "p" || cur.t === "h" || cur.t === "box" ? cur.html : cur.t === "list" ? itemsHtml(cur.items, cur.ordered) : "";
    let nb: Block | null = null;
    if (to === "p") nb = { id: cur.id, t: "p", html };
    else if (/^h[123]$/.test(to)) nb = { id: cur.id, t: "h", level: Number(to[1]) as 1 | 2 | 3, html: cleanHtml(flatLists(html, () => "")) };
    else if (to === "ul" || to === "ol") {
      // the lines of the block become the items of a list inside it
      const tag = to;
      const lines = cleanHtml(flatLists(html, () => "").replace(/(^|<br>)(•|\d+(\.\d+)*\.?) /g, "$1")).split(/<br>/);
      const list = `<${tag}>${lines.map((l) => `<li>${l || "<br>"}</li>`).join("")}</${tag}>`;
      nb = cur.t === "box" ? { ...cur, html: list } : { id: cur.id, t: "p", html: list };
    }
    else if (to.startsWith("box-")) nb = { id: cur.id, t: "box", kind: to.slice(4) as BoxKind, html, ...(cur.t === "box" && cur.latex ? { latex: cur.latex } : {}), ...(cur.t === "box" && cur.steps?.length ? { steps: cur.steps } : {}) };
    if (nb) {
      update((bs) => bs.map((b) => (b.id === cur.id ? nb! : b)), "struct");
      focus(keyOf(nb, false)!, "end");
    }
  };

  /* ---- the key line: the first sentence of a numbered point, bold (again: plain) ---- */
  const isText = !!cur && (cur.t === "h" || cur.t === "p" || cur.t === "box");
  const keyOn = !!cur && (cur.t === "h" || cur.t === "p" || cur.t === "box") && /^(\s|&nbsp;|\u200b)*<(b|strong)>/.test(cur.html);
  const keyLine = () => {
    if (!cur || !isText) return;
    let el = activeEditable();
    if (!el || el.dataset.edit !== cur.id) el = document.querySelector<HTMLElement>(`[data-edit="${CSS.escape(cur.id)}"]`);
    if (!el) return;
    const r = firstSentence(el);
    if (!r) return alertBox("אין כאן משפט ראשון: שורת המפתח נגמרת בנקודה, בנקודתיים, בסימן שאלה או בסוף השורה.");
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(r);
    document.execCommand("bold");
    sel.collapseToEnd();
    refreshFmt();
  };

  /* ---- the rail's flyouts, beside the button (above it, in the bar at the bottom of a phone) ---- */
  const openFly = (id: Fly) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fly?.id === id) return setFly(null);
    const r = e.currentTarget.getBoundingClientRect();
    const up = window.innerWidth <= 640;
    setFly({ id, up, x: up ? Math.max(8, Math.min(r.left, window.innerWidth - 268)) : Math.min(r.right + 6, window.innerWidth - 268), y: up ? window.innerHeight - r.top + 6 : Math.min(r.top, window.innerHeight - 330) });
  };
  const openSymbols = (e: React.MouseEvent<HTMLElement>) => {
    if (symbols) return setSymbols(null);
    const r = e.currentTarget.getBoundingClientRect();
    setSymbols({ x: Math.max(8, Math.min(r.left, window.innerWidth - 528)), y: Math.min(r.bottom + 6, window.innerHeight - 260) });
  };
  const insertBox = (k: BoxKind) => {
    const it = INSERT.find((x) => x.id === `box-${k}`);
    if (it) doInsert(it, current);
  };
  const insertItem = (id: string) => {
    const it = INSERT.find((x) => x.id === id);
    if (it) doInsert(it, current);
  };
  /** a button of the rail: icon and a short label (the label hides when the window is narrow) */
  const railBtn = (key: string, icon: string, label: string, title: string, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void, extra: { pressed?: boolean; tick?: BoxKind; fly?: Fly; disabled?: boolean; cls?: string } = {}) => (
    <button
      key={key}
      className={`sm-rail-btn ${extra.tick ? `tick tick-${extra.tick}` : ""} ${extra.cls ?? ""}`}
      title={title}
      aria-label={label}
      aria-pressed={extra.pressed}
      aria-expanded={extra.fly ? fly?.id === extra.fly : undefined}
      data-fly={extra.fly}
      disabled={extra.disabled}
      onClick={onClick}
    >
      <Icon name={icon} size={18} />
      <span className="sm-rail-lbl">{label}</span>
      {extra.fly && <span className="sm-rail-more" aria-hidden />}
    </button>
  );

  /* ---- the menu beside the handle of the current block ---- */
  const blockActions = (b: Block) => {
    const close = () => setBlockMenu(null);
    const numbered = b.t === "h" || b.t === "math";
    const listy = b.t === "list" || b.t === "p" || b.t === "box";
    return (
      <div className="sm-bmenu" role="menu" aria-label="פעולות על הבלוק" contentEditable={false}>
        <div className="sm-bmenu-row">
          <button role="menuitem" title="הזז למעלה" aria-label="הזז למעלה" onClick={() => move(b.id, -1)}>
            <Icon name="up" size={16} />
          </button>
          <button role="menuitem" title="הזז למטה" aria-label="הזז למטה" onClick={() => move(b.id, 1)}>
            <Icon name="down" size={16} />
          </button>
          <button role="menuitem" title="שכפל" aria-label="שכפל" onClick={() => (insertAfter(b.id, { ...JSON.parse(JSON.stringify(b)), id: uid() }), close())}>
            <Icon name="copy" size={16} />
          </button>
          <button role="menuitem" className="danger" title="מחק בלוק" aria-label="מחק בלוק" onClick={() => (remove(b.id), close())}>
            <Icon name="trash" size={16} />
          </button>
        </div>
        {["p", "h", "list", "box"].includes(b.t) && (
          <label className="sm-bmenu-line">
            <span>המר ל</span>
            <select className="sm-select" value="" aria-label="המר את הבלוק" onChange={(e) => (convert(e.target.value), close())}>
              <option value="">בחר…</option>
              <option value="p">פסקה</option>
              <option value="h1">כותרת פרק</option>
              <option value="h2">כותרת סעיף</option>
              <option value="h3">תת-סעיף</option>
              <option value="ul">רשימת תבליטים</option>
              <option value="ol">רשימה ממוספרת</option>
              {(Object.keys(BOX_LABEL) as BoxKind[]).map((k) => (
                <option key={k} value={`box-${k}`}>
                  תיבה: {BOX_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        )}
        {b.t === "box" && (
          <div className="sm-bmenu-row" role="group" aria-label="יישור הטקסט בתיבה">
            {ALIGNS.map(([a, name, icon]) => (
              <button key={a} role="menuitemradio" aria-checked={(b.align ?? "start") === a} aria-pressed={(b.align ?? "start") === a} title={name} aria-label={name} onClick={() => patch(b.id, { align: a === "start" ? undefined : a } as Partial<Block>, "struct")}>
                {icon}
              </button>
            ))}
          </div>
        )}
        {numbered && (
          <button role="menuitemcheckbox" className="sm-bmenu-line" aria-checked={!!b.plain} aria-pressed={!!b.plain} onClick={() => patch(b.id, { plain: !b.plain } as Partial<Block>, "struct")}>
            בלי מספר
          </button>
        )}
        {listy && (
          <button
            role="menuitem"
            className="sm-bmenu-line"
            title="הרשימה שבה הסמן: מספרים או תבליטים"
            onClick={() => {
              if (b.t === "list") return patch(b.id, { ordered: !b.ordered } as Partial<Block>, "struct");
              const el = document.querySelector<HTMLElement>(`[data-edit="${CSS.escape(b.id)}"]`);
              const r = menuRange.current;
              if (!el || !r || !el.contains(r.startContainer)) return alertBox("שים את הסמן ברשימה, ואז 1. ⇄ •");
              el.focus();
              window.getSelection()?.removeAllRanges();
              window.getSelection()?.addRange(r);
              swapListKind(el);
              close();
            }}
          >
            1. ⇄ • מספרים או תבליטים
          </button>
        )}
      </div>
    );
  };

  /* ---- drag to reorder, and files dropped from outside ---- */
  const dragOver = (e: React.DragEvent, id: string) => {
    if (!drag && !e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const after = e.clientY > r.top + r.height / 2;
    if (drag) setDrag({ ...drag, over: id, after });
  };
  const drop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      void addFiles(Array.from(e.dataTransfer.files), id);
      return;
    }
    if (!drag || drag.id === id) return setDrag(null);
    const { id: from, after } = { id: drag.id, after: drag.after };
    update((bs) => {
      const moving = bs.find((b) => b.id === from)!;
      const rest = bs.filter((b) => b.id !== from);
      const k = rest.findIndex((b) => b.id === id) + (after ? 1 : 0);
      return [...rest.slice(0, k), moving, ...rest.slice(k)];
    }, "struct");
    setDrag(null);
  };

  /* ---------------- rendering ---------------- */
  const renderBlock = (b: Block) => {
    switch (b.t) {
      case "h": {
        const n = heads.get(b.id);
        if (b.cont)
          return (
            <div className={`sm-h sm-h${b.level} is-cont`}>
              <span className="sm-emoji-wrap sm-cont-pad" contentEditable={false} aria-hidden>
                <button className="sm-emoji-btn" tabIndex={-1}>
                  ☺
                </button>
              </span>
              {conts.get(b.id) && (
                <span className="sm-num sm-cont-pad" contentEditable={false} aria-hidden>
                  {conts.get(b.id)}
                </span>
              )}
              <Rich fkey={b.id} html={b.html} placeholder="המשך הסעיף" onChange={(h) => patch(b.id, { html: h })} onKeyDown={textKeys(b)} onMath={openInline} />
            </div>
          );
        return (
          <div className={`sm-h sm-h${b.level}`}>
            <span className="sm-emoji-wrap" contentEditable={false}>
              <button className={`sm-emoji-btn ${b.emoji ? "has" : ""}`} onClick={() => setEmojiFor(emojiFor === b.id ? null : b.id)} title="אימוג'י לכותרת" aria-label="אימוג'י לכותרת">
                {b.emoji || "☺"}
              </button>
              {emojiFor === b.id && (
                <span className="sm-emoji-pop" role="listbox" onMouseDown={(e) => e.preventDefault()}>
                  {HEAD_EMOJI.map((x) => (
                    <button key={x} onClick={() => (patch(b.id, { emoji: x } as Partial<Block>, "struct"), setEmojiFor(null))}>
                      {x}
                    </button>
                  ))}
                  <button className="sm-emoji-none" onClick={() => (patch(b.id, { emoji: undefined } as Partial<Block>, "struct"), setEmojiFor(null))}>
                    בלי
                  </button>
                </span>
              )}
            </span>
            {n && <span className="sm-num" contentEditable={false}>{n}</span>}
            <Rich fkey={b.id} html={b.html} placeholder={b.level === 1 ? "כותרת פרק" : b.level === 2 ? "כותרת סעיף" : "תת-סעיף"} onChange={(h) => patch(b.id, { html: h })} onKeyDown={textKeys(b)} onMath={openInline} />
          </div>
        );
      }
      case "p":
        return (
          <div className="sm-p">
            <Rich fkey={b.id} html={b.html} placeholder="כתוב, או / לתפריט" onChange={(h) => paraInput(b, h)} onKeyDown={textKeys(b)} onMath={openInline} />
            {menu?.id === b.id && <SlashMenu items={filtered(menu.filter)} sel={menu.sel} onPick={(it) => doInsert(it, b.id)} />}
          </div>
        );
      case "list": {
        const nums = itemNumbers(b.items);
        return (
          <div className={`sm-list ${b.ordered ? "ordered" : ""}`}>
            {b.items.map((it, i) => (
              <div key={i} className={`sm-li lvl-${it.level}`}>
                <span className="sm-bullet" contentEditable={false}>
                  {b.ordered ? nums[i] : ["•", "◦", "▪"][it.level] ?? "•"}
                </span>
                <Rich fkey={`${b.id}:${i}`} html={it.html} placeholder={i === 0 ? "פריט" : ""} onChange={(h) => patch(b.id, { items: b.items.map((x, j) => (j === i ? { ...x, html: h } : x)) } as Partial<Block>)} onKeyDown={listKeys(b, i)} onMath={openInline} />
              </div>
            ))}
          </div>
        );
      }
      case "box":
        return (
          <div className={`sm-box box-${b.kind}`}>
            <div className="sm-box-head" contentEditable={false}>
              <Icon name={BOX_ICON[b.kind]} size={15} className="sm-box-ic" />
              <select value={b.kind} aria-label="סוג התיבה" onChange={(e) => patch(b.id, { kind: e.target.value as BoxKind, ...(e.target.value === "eq" && b.latex === undefined ? { latex: "" } : {}) } as Partial<Block>, "struct")}>
                {(Object.keys(BOX_LABEL) as BoxKind[]).map((k) => (
                  <option key={k} value={k}>
                    {BOX_LABEL[k]}
                  </option>
                ))}
              </select>
              <input
                className="sm-box-title"
                value={b.title ?? ""}
                placeholder="כותרת קצרה"
                aria-label="כותרת התיבה"
                onChange={(e) => patch(b.id, { title: e.target.value } as Partial<Block>)}
                onKeyDown={(e) => {
                  // Enter or ↓: into the box's text
                  if (e.key === "Enter" || e.key === "ArrowDown") {
                    e.preventDefault();
                    focusNow(b.id, "start");
                  }
                }}
              />
            </div>
            {b.kind === "eq" && (
              <div className="sm-box-math">
                {editingMath === b.id ? (
                  <MathEditor latex={b.latex ?? ""} onChange={(v) => patch(b.id, { latex: v } as Partial<Block>)} onDone={(how) => (setEditingMath(null), how !== "blur" && focus(b.id, "start"))} />
                ) : (
                  <button className="sm-math-btn" onClick={() => setEditingMath(b.id)} title="לחץ לעריכה">
                    {b.latex?.trim() ? <MathView latex={b.latex} /> : <span className="sm-ph">לחץ כדי לכתוב את הנוסחה</span>}
                    {eqs.get(b.id) && <span className="sm-eqn">({eqs.get(b.id)})</span>}
                  </button>
                )}
              </div>
            )}
            {b.kind === "eq" && <EqStepsEditor steps={b.steps ?? []} onChange={(steps) => patch(b.id, { steps } as Partial<Block>)} />}
            <Rich fkey={b.id} className={b.align && b.align !== "start" ? `al-${b.align}` : ""} html={b.html} placeholder={b.kind === "eq" ? "מה כל סימן, ומתי היא נכונה" : "כתוב כאן"} onChange={(h) => patch(b.id, { html: h })} onKeyDown={textKeys(b)} onMath={openInline} />
          </div>
        );
      case "math":
        return (
          <div className="sm-mathblock">
            {editingMath === b.id ? (
              <MathEditor
                latex={b.latex}
                onChange={(v) => patch(b.id, { latex: v } as Partial<Block>)}
                onDone={(how) => {
                  setEditingMath(null);
                  if (how === "enter") step(b.id, 1, "start") || (insertAfter(b.id, emptyBlock("p")), undefined);
                }}
              />
            ) : (
              <button className="sm-math-btn" onClick={() => setEditingMath(b.id)} title="לחץ לעריכה">
                {b.latex.trim() ? <MathView latex={b.latex} /> : <span className="sm-ph">לחץ כדי לכתוב משוואה</span>}
              </button>
            )}
            {eqs.get(b.id) && <span className="sm-eqn">({eqs.get(b.id)})</span>}
          </div>
        );
      case "img":
      case "fig":
        return b.t === "img" && !b.src ? (
          <div className="sm-uploading">מעלה תמונה…</div>
        ) : (
          <Picture b={b} selected={current === b.id} onChange={(p) => patch(b.id, p as Partial<Block>, "struct")} onRemove={() => remove(b.id)} />
        );
      case "hr":
        return <hr className="sm-hr" />;
    }
  };

  return (
    <div
      className="sm-editor"
      onFocusCapture={(e) => {
        const id = (e.target as HTMLElement).closest<HTMLElement>("[data-bid]")?.dataset.bid;
        if (id && id !== current) setCurrent(id);
      }}
      onPaste={(e) => {
        const files = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return;
        e.preventDefault();
        void addFiles(files, current);
      }}
    >
      <div className="sm-desk">
      <div className="sm-page" ref={pageRef} style={{ zoom }} spellCheck={false}>
        {blocks.map((b) => (
          <div
            key={b.id}
            data-bid={b.id}
            className={`sm-block t-${b.t} ${current === b.id ? "is-current" : ""} ${isEmptyPara(b) ? "is-empty" : ""} ${blockMenu === b.id ? "has-menu" : ""} ${drag?.over === b.id ? (drag.after ? "drop-after" : "drop-before") : ""}`}
            onDragOver={(e) => dragOver(e, b.id)}
            onDrop={(e) => drop(e, b.id)}
            onPointerDownCapture={() => {
              if (current !== b.id) setCurrent(b.id);
              // a picture, an equation or a rule takes the selection away from the text
              if (b.t === "img" || b.t === "fig" || b.t === "hr") {
                focusReq.current = null;
                (document.activeElement as HTMLElement | null)?.blur?.();
              }
            }}
          >
            <span
              className="sm-handle"
              draggable
              contentEditable={false}
              role="button"
              aria-label="פעולות על הבלוק"
              aria-expanded={blockMenu === b.id}
              title="לחיצה: פעולות על הבלוק · גרירה: הזזה"
              onPointerDown={() => {
                // the caret in the block, for the actions that work on the list at the caret
                const sel = window.getSelection();
                const el = activeEditable();
                menuRange.current = sel?.rangeCount && el && el.closest("[data-bid]") === document.querySelector(`[data-bid="${CSS.escape(b.id)}"]`) ? sel.getRangeAt(0).cloneRange() : null;
              }}
              onClick={() => setBlockMenu(blockMenu === b.id ? null : b.id)}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", b.id);
                setBlockMenu(null);
                setDrag({ id: b.id, over: null, after: false });
              }}
              onDragEnd={() => setDrag(null)}
            >
              <Icon name="grip" size={16} />
            </span>
            {blockMenu === b.id && blockActions(b)}
            <div className="sm-block-body">{renderBlock(b)}</div>
          </div>
        ))}
        <button
          className="sm-add-end"
          onClick={() => {
            const last = blocks[blocks.length - 1];
            if (last && last.t === "p" && !textOf(last.html).trim()) return focusNow(last.id, "start");
            const nb = emptyBlock("p");
            insertAfter(last?.id ?? null, nb);
            focus(nb.id, "start");
          }}
        >
          + פסקה חדשה בסוף
        </button>
      </div>

      {/* the tools, at the outer side of the page; on a phone, a bar at the bottom */}
      <nav className="sm-rail" aria-label="כלי כתיבה" onMouseDown={(e) => e.preventDefault()}>
        <div className="sm-rail-g" role="group" aria-label="מבנה">
          {railBtn("h1", "head1", "פרק", "כותרת פרק · 1, 2, 3 (# ורווח)", act(() => insertItem("h1")))}
          {railBtn("h2", "head2", "סעיף", "כותרת סעיף · 1.1, 1.2 (## ורווח)", act(() => insertItem("h2")))}
          {railBtn("h3", "head3", "תת-סעיף", "תת-סעיף · 1.1.1 (### ורווח)", act(() => insertItem("h3")))}
          {railBtn("key", "keyline", "שורת מפתח", "שורת מפתח: המשפט הראשון של הסעיף שבו הסמן במודגש. לחיצה נוספת מחזירה לרגיל", act(keyLine), { pressed: keyOn, disabled: !isText, cls: "sub" })}
          {railBtn("p", "para", "פסקה", "פסקה · טקסט רגיל", act(() => insertItem("p")))}
        </div>
        <div className="sm-rail-g" role="group" aria-label="תיבות">
          {RAIL_BOXES.map(([k, short]) => railBtn(`box-${k}`, BOX_ICON[k], short, `תיבה: ${BOX_LABEL[k]}`, () => insertBox(k), { tick: k }))}
          {railBtn("boxes", "boxes", "עוד תיבות", "נוסחה מרכזית, שאלה פתוחה, טעות נפוצה", openFly("boxes"), { fly: "boxes" })}
        </div>
        <div className="sm-rail-g" role="group" aria-label="רשימות">
          {railBtn("proof", "proof", "הוכחה", "רשימת הוכחה: הגדרה 1, הנחה 1, נתון 1, פיתוח 1, מסקנה 1. כל סוג ממוספר לבד; Enter ממשיך באותו סוג", openFly("proof"), { fly: "proof", pressed: fmt.kind === "ol:proof" })}
          {railBtn("ol", "olist", "ממוספרת", "רשימה ממוספרת · 1. ורווח", act(() => insertItem("ol")), { pressed: fmt.list === "ol" && fmt.kind !== "ol:proof" })}
          {railBtn("ul", "ulist", "תבליטים", "רשימת תבליטים · - ורווח", act(() => insertItem("ul")), { pressed: fmt.list === "ul" })}
          {railBtn("list", "liststyle", "סגנון", "סוג הרשימה שבה הסמן: תבליטים ומספור באותיות", openFly("list"), { fly: "list" })}
        </div>
        <div className="sm-rail-g" role="group" aria-label="הוספה">
          {railBtn("insert", "plus", "הוספה", "משוואה, סימנים, תמונה, איור מהספר, קו", openFly("insert"), { fly: "insert" })}
        </div>
      </nav>
      </div>

      {fly && (
        <div className={`sm-fly ${fly.up ? "up" : ""}`} style={fly.up ? { left: fly.x, bottom: fly.y } : { left: fly.x, top: fly.y }} role="menu" onMouseDown={(e) => e.preventDefault()}>
          {fly.id === "boxes" &&
            MORE_BOXES.map((k) => (
              <button key={k} role="menuitem" className={`sm-fly-item tick tick-${k}`} onClick={() => (setFly(null), insertBox(k))}>
                <Icon name={BOX_ICON[k]} size={17} />
                <span>{BOX_LABEL[k]}</span>
              </button>
            ))}
          {fly.id === "insert" && (
            <>
              <button role="menuitem" className="sm-fly-item" onClick={() => (setFly(null), insertItem("math"))}>
                <Icon name="sigma" size={17} />
                <span>משוואה</span>
                <small>ממוספרת, $$</small>
              </button>
              <button role="menuitem" className="sm-fly-item" onClick={() => (setFly(null), openInline())}>
                <span className="sm-fly-glyph">∑</span>
                <span>משוואה בשורה</span>
                <small dir="ltr">Ctrl+M, $…$</small>
              </button>
              <button role="menuitem" className="sm-fly-item" onClick={(e) => (openSymbols(e), setFly(null))}>
                <span className="sm-fly-glyph">Ω</span>
                <span>סימנים</span>
                <small>יווניות, חצים</small>
              </button>
              <button role="menuitem" className="sm-fly-item" onClick={() => (setFly(null), insertItem("img"))}>
                <Icon name="image" size={17} />
                <span>תמונה</span>
                <small>או Ctrl+V</small>
              </button>
              <button role="menuitem" className="sm-fly-item" onClick={() => (setFly(null), insertItem("fig"))}>
                <Icon name="figure" size={17} />
                <span>איור מהספר</span>
              </button>
              <button role="menuitem" className="sm-fly-item" onClick={() => (setFly(null), insertItem("lesson"))}>
                <Icon name="image" size={17} />
                <span>גרף או איור מהשיעור</span>
                <small>מהחלון של השיעור</small>
              </button>
              <button role="menuitem" className="sm-fly-item" onClick={() => (setFly(null), insertItem("hr"))}>
                <Icon name="hr" size={17} />
                <span>קו מפריד</span>
              </button>
            </>
          )}
          {fly.id === "proof" && (
            <div className="sm-fly-steps">
              {PROOF_STEPS.map(([k, name]) => (
                <button key={k} role="menuitem" className={`k-${k}`} aria-pressed={fmt.step === k} onClick={act(() => (applyListKind("ol", "proof", k), setFly(null)))}>
                  {name}
                </button>
              ))}
            </div>
          )}
          {fly.id === "list" && (
            <div className="sm-fly-kinds">
              {LIST_KINDS.map(([tag, cls, sign, name]) => (
                <button key={tag + cls} role="menuitem" aria-pressed={fmt.kind === `${tag}:${cls}`} title={name} aria-label={name} onClick={act(() => (applyListKind(tag, cls), setFly(null)))}>
                  {sign}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {bubble && !inline && (
        <div ref={bubbleRef} className={`sm-bubble ${bubble.below ? "below" : ""}`} style={{ top: bubble.y }} role="toolbar" aria-label="עיצוב הטקסט המסומן" onMouseDown={(e) => e.preventDefault()}>
          <div className="sm-bubble-row">
            <button className="sm-bb" aria-pressed={fmt.b} onClick={act(() => applyStyle("bold"))} title="מודגש (Ctrl+B). לחיצה נוספת מכבה">
              <b>B</b>
            </button>
            <button className="sm-bb" aria-pressed={fmt.i} onClick={act(() => applyStyle("italic"))} title="נטוי (Ctrl+I)">
              <i>I</i>
            </button>
            <button className="sm-bb" aria-pressed={fmt.sup} onClick={act(() => activeEditable() && document.execCommand("superscript"))} title="כתב עילי">
              x²
            </button>
            <button className="sm-bb" aria-pressed={fmt.sub} onClick={act(() => activeEditable() && document.execCommand("subscript"))} title="כתב תחתי">
              x₂
            </button>
            <span className="sm-bubble-sep" />
            <button className="sm-bb wide" onClick={() => openInline()} title="משוואה קטנה בתוך המשפט (Ctrl+M, או $…$ בטקסט)">
              ∑ בשורה
            </button>
            <button className="sm-bb wide" aria-pressed={!!symbols} onClick={openSymbols} title="אותיות יווניות וסימנים">
              Ω סימנים
            </button>
          </div>
          <div className="sm-bubble-row">
            {BUBBLE_MARKS.map((m) => (
              <button key={m} className={`sm-bb mark hl-${m}`} aria-pressed={fmt.mark === `hl-${m}`} onClick={act(() => applyMark(`hl-${m}`))} title={`${MARK_LABEL[m]} (Alt+${MARKS.indexOf(m) + 1})`}>
                <span className="sw" aria-hidden />
                {MARK_LABEL[m].split(" ")[0]}
              </button>
            ))}
            <button className="sm-bb" onClick={act(() => applyMark(null))} title="בלי מרקר (Alt+0)">
              נקה
            </button>
          </div>
        </div>
      )}

      {symbols && (
        <div className="sm-symbols-pop" style={{ left: symbols.x, top: symbols.y }} aria-label="סימנים" onMouseDown={(e) => e.preventDefault()}>
          <header>
            <b>סימנים</b>
            <button className="icon-btn" onClick={() => setSymbols(null)} aria-label="סגור">
              <Icon name="close" size={14} />
            </button>
          </header>
          {SYMBOLS.map((g) => (
            <div key={g.title} className="sm-sym-group">
              <span className="sm-sym-title">{g.title}</span>
              {g.items.map(([ch, tex]) => (
                <button key={ch} className="sm-sym" onClick={() => insertSymbol(ch, tex)} title={tex}>
                  {ch}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {inline && (
        <div className="sm-inline-pop" style={{ top: inline.top, left: inline.left }} onMouseDown={(e) => e.stopPropagation()}>
          <MathEditor latex={inline.tex} onChange={(v) => (inlineTex.current = v)} onDone={closeInline} />
          <small>Enter לסיום · Esc לביטול · ריק מוחק</small>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          void addFiles(files, fileAfter.current);
        }}
      />
    </div>
  );
}

/** The items of an old list block, as a list inside a paragraph (levels become nesting). */
function itemsHtml(items: ListItem[], ordered: boolean) {
  const tag = ordered ? "ol" : "ul";
  let out = "";
  let depth = -1;
  for (const it of items) {
    const l = Math.min(it.level, depth + 1);
    if (l > depth) out += `<${tag}><li>`;
    else {
      out += "</li>";
      for (; depth > l; depth--) out += `</${tag}></li>`;
      out += "<li>";
    }
    depth = l;
    out += it.html || "<br>";
  }
  for (; depth >= 0; depth--) out += `</li></${tag}>`;
  return out;
}

function SlashMenu({ items, sel, onPick }: { items: InsertItem[]; sel: number; onPick: (it: InsertItem) => void }) {
  if (!items.length) return <div className="sm-slash empty">אין התאמה</div>;
  return (
    <div className="sm-slash" role="listbox" contentEditable={false} onMouseDown={(e) => e.preventDefault()}>
      {items.map((it, i) => (
        <button key={it.id} role="option" aria-selected={i === sel} onClick={() => onPick(it)}>
          <span>{it.label}</span>
          <small>{it.hint}</small>
        </button>
      ))}
    </div>
  );
}

/** A short message at the bottom of the screen (the frame shows no alert dialogs). */
export function alertBox(text: string) {
  const d = document.createElement("div");
  d.className = "sm-toast";
  d.textContent = text;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 4200);
}

export { INSERT };
