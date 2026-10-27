import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Block, BoxKind, ListItem, MarkColor } from "./model";
import { BOX_EMOJI, BOX_LABEL, HEAD_EMOJI, MARK_LABEL, emptyBlock, flatLists, itemNumbers, numbering, textOf, uid } from "./model";
import { activeEditable, applyMark, applyStyle, atLiStart, caret, caretLi, caretMark, caretOnEdgeLine, dedupeMath, dropEmptyMarks, tidyTex, retagList, cleanHtml, convertDollars, hydrateMath, indentLi, insertMathAt, leaveMark, linePrefix, listEndsBlock, liText, outdentLi, pastedHtml, placeCaret, splitAtCaret, swapListKind } from "./rich";
import { MathEditor, MathView } from "./MathEdit";
import { Picture } from "./Picture";
import { storeImage } from "./media";

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
/**
 * The list at the caret becomes this kind, or (with no list there) a list of this kind starts on
 * the caret's line; in a heading, on a new line under its text. Proof steps: the step's kind.
 */
function applyListKind(tag: "ol" | "ul", cls: string, step?: string) {
  const el = activeEditable();
  if (!el) return;
  let li = caretLi(el);
  const fresh = !li;
  if (!li) {
    if (el.closest(".sm-h") && !onLaterLine(el)) {
      placeCaret(el, "end");
      document.execCommand("insertLineBreak");
    }
    document.execCommand(tag === "ol" ? "insertOrderedList" : "insertUnorderedList");
    // in an empty block the browser leaves the caret beside the new item, not in it
    li = caretLi(el) ?? (Array.from(el.querySelectorAll("li")).find((x) => !liText(x).replace(/\u200b/g, "").trim()) as HTMLLIElement | undefined) ?? null;
    if (li) placeCaretIn(li);
  }
  const old = li?.parentElement;
  if (!li || !old) return;
  const changed = () => el.dispatchEvent(new Event("input", { bubbles: true }));
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
  // a list just started here, or the same family (another bullet, another numbering): the list at
  // the caret becomes this kind
  if (fresh || (old.tagName.toLowerCase() === tag && isProof === (cls === "proof"))) {
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
        if (dedupeMath(el.current!) || a) onChange(cleanHtml(el.current!.innerHTML));
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
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPickFigure,
  viewTab,
  zoom = 1,
}: {
  blocks: Block[];
  update: Upd;
  current: string | null;
  setCurrent: (id: string | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** opens the figure picker; the chosen figure is inserted after the given block */
  onPickFigure: (after: string | null) => void;
  /** the contents of the ribbon's third row (view, export, status) */
  viewTab: ReactNode;
  zoom?: number;
}) {
  const focusReq = useRef<{ key: string; where: Where; at: number } | null>(null);
  const [editingMath, setEditingMath] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ id: string; filter: string; sel: number } | null>(null);
  const [showView, setShowView] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [emojiFor, setEmojiFor] = useState<string | null>(null);
  /** what is on at the caret, so the ribbon shows it while writing */
  const [fmt, setFmt] = useState<Fmt>(NO_FMT);
  const [pop, setPop] = useState<"list" | "proof" | null>(null);
  const refreshFmt = () => {
    // a mark turned on and left empty goes when the caret moves away from it
    const ed = activeEditable();
    if (ed) dropEmptyMarks(ed, caretMark());
    setFmtNow();
  };
  const setFmtNow = () =>
    setFmt((old) => {
      const n = readFmt();
      return JSON.stringify(n) === JSON.stringify(old) ? old : n;
    });
  useEffect(() => {
    document.addEventListener("selectionchange", refreshFmt);
    return () => document.removeEventListener("selectionchange", refreshFmt);
  }, []);
  /** a ribbon action, then the ribbon shows the new state */
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
        if (tb.t === "h" && !caretLi(el) && !onLaterLine(el)) {
          placeCaret(el, "end");
          document.execCommand("insertLineBreak");
        }
        document.execCommand(item.id === "ol" ? "insertOrderedList" : "insertUnorderedList");
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
        document.execCommand("insertOrderedList");
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
          document.execCommand(kind === "ol" ? "insertOrderedList" : "insertUnorderedList");
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
        document.execCommand("insertParagraph"); // the next item
        leaveMark();
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
    else if (to.startsWith("box-")) nb = { id: cur.id, t: "box", kind: to.slice(4) as BoxKind, html, ...(cur.t === "box" && cur.latex ? { latex: cur.latex } : {}) };
    if (nb) {
      update((bs) => bs.map((b) => (b.id === cur.id ? nb! : b)), "struct");
      focus(keyOf(nb, false)!, "end");
    }
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
              <span className="sm-box-emoji" aria-hidden>
                {BOX_EMOJI[b.kind]}
              </span>
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
            <Rich fkey={b.id} html={b.html} placeholder={b.kind === "eq" ? "מה כל סימן, ומתי היא נכונה" : "כתוב כאן"} onChange={(h) => patch(b.id, { html: h })} onKeyDown={textKeys(b)} onMath={openInline} />
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
      <div className="sm-ribbon" onMouseDown={(e) => (e.target as HTMLElement).tagName !== "SELECT" && e.preventDefault()}>
        <div className="sm-row sm-row-insert">
          <span className="sm-row-label">הוספה</span>
          <div className="sm-group">
            {INSERT.slice(0, 6).map((it) => (
              <button key={it.id} className="sm-tbtn" aria-pressed={it.id === "ul" || it.id === "ol" ? fmt.list === it.id : undefined} onClick={act(() => doInsert(it, current))} title={`${it.label}${it.hint ? ` · ${it.hint}` : ""}`}>
                {it.short ?? it.label}
              </button>
            ))}
            <span className="sm-bullets-wrap">
              <button className="sm-tbtn" aria-expanded={pop === "list"} aria-pressed={!!fmt.kind && fmt.kind !== "ol:proof"} title="עוד סוגי רשימה: תבליטים ומספור" onClick={() => setPop(pop === "list" ? null : "list")}>
                {LIST_KINDS.find((x) => `${x[0]}:${x[1]}` === fmt.kind)?.[2] ?? "◦"} רשימה ▾
              </button>
              {pop === "list" && (
                <span className="sm-bullets-pop" role="listbox">
                  {LIST_KINDS.map(([tag, cls, sign, name]) => (
                    <button key={tag + cls} aria-pressed={fmt.kind === `${tag}:${cls}`} title={name} onClick={act(() => (applyListKind(tag, cls), setPop(null)))}>
                      {sign}
                    </button>
                  ))}
                </span>
              )}
            </span>
            <span className="sm-bullets-wrap">
              <button className="sm-tbtn" aria-expanded={pop === "proof"} aria-pressed={fmt.kind === "ol:proof"} title="רשימת הוכחה: הגדרה 1, הנחה 1, נתון 1, פיתוח 1, מסקנה 1. כל סוג ממוספר לבד; Enter ממשיך באותו סוג" onClick={() => setPop(pop === "proof" ? null : "proof")}>
                ∴ הוכחה ▾
              </button>
              {pop === "proof" && (
                <span className="sm-bullets-pop sm-proof-pop" role="listbox">
                  {PROOF_STEPS.map(([k, name]) => (
                    <button key={k} className={`k-${k}`} aria-pressed={fmt.step === k} onClick={act(() => (applyListKind("ol", "proof", k), setPop(null)))}>
                      {name}
                    </button>
                  ))}
                </span>
              )}
            </span>
          </div>
          <div className="sm-group">
            {INSERT.filter((x) => x.id.startsWith("box-")).map((it) => (
              <button key={it.id} className={`sm-tbtn box-chip ${it.id}`} onClick={() => doInsert(it, current)}>
                {BOX_EMOJI[it.id.slice(4) as BoxKind]} {it.label}
              </button>
            ))}
          </div>
          <div className="sm-group">
            {INSERT.filter((x) => ["math", "img", "fig", "hr"].includes(x.id)).map((it) => (
              <button key={it.id} className="sm-tbtn" onClick={() => doInsert(it, current)} title={`${it.label}${it.hint ? ` · ${it.hint}` : ""}`}>
                {it.short ?? it.label}
              </button>
            ))}
          </div>
          <span className="sm-ribbon-sp" />
          <button className="sm-tbtn" aria-pressed={showView} onClick={() => setShowView(!showView)}>
            תצוגה וייצוא {showView ? "▴" : "▾"}
          </button>
        </div>
        <div className="sm-row sm-row-edit">
          <span className="sm-row-label">עריכה</span>
          <div className="sm-group">
            <button className="sm-tbtn" aria-pressed={fmt.b} onClick={act(() => applyStyle("bold"))} title="מודגש (Ctrl+B). לחיצה נוספת מכבה">
              <b>B</b>
            </button>
            <button className="sm-tbtn" aria-pressed={fmt.i} onClick={act(() => applyStyle("italic"))} title="נטוי (Ctrl+I). לחיצה נוספת מכבה">
              <i>I</i>
            </button>
            <button className="sm-tbtn" aria-pressed={fmt.sup} onClick={act(() => activeEditable() && document.execCommand("superscript"))} title="כתב עילי">
              x²
            </button>
            <button className="sm-tbtn" aria-pressed={fmt.sub} onClick={act(() => activeEditable() && document.execCommand("subscript"))} title="כתב תחתי">
              x₂
            </button>
          </div>
          <div className="sm-group">
            {MARKS.map((m, i) => (
              <button key={m} className={`sm-tbtn mark-btn hl-${m}`} aria-pressed={fmt.mark === `hl-${m}`} onClick={act(() => applyMark(`hl-${m}`))} title={`${MARK_LABEL[m]} (Alt+${i + 1}). בלי בחירה: מדליק או מכבה לטקסט הבא`}>
                {MARK_LABEL[m].split(" ")[0]}
              </button>
            ))}
            <button className="sm-tbtn" onClick={act(() => applyMark(null))} title="Alt+0">
              נקה
            </button>
          </div>
          <div className="sm-group">
            <button className="sm-tbtn" onClick={() => openInline()} title="משוואה קטנה בתוך המשפט (Ctrl+M, או $…$ בטקסט)">
              ∑ בשורה
            </button>
            <button className="sm-tbtn" aria-pressed={showSymbols} onClick={() => setShowSymbols(!showSymbols)} title="אותיות יווניות וסימנים">
              Ω סימנים
            </button>
          </div>
          <div className="sm-group">
            <select className="sm-select" value="" aria-label="המר את הבלוק" disabled={!cur || !["p", "h", "list", "box"].includes(cur.t)} onChange={(e) => convert(e.target.value)}>
              <option value="">המר ל…</option>
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
            {/* always there, so the ribbon keeps its height when the selected block changes */}
            <button className="sm-tbtn" disabled={!(cur?.t === "h" || cur?.t === "math")} aria-pressed={cur?.t === "h" || cur?.t === "math" ? !!cur.plain : false} onClick={() => (cur?.t === "h" || cur?.t === "math") && patch(cur.id, { plain: !cur.plain } as Partial<Block>, "struct")}>
              בלי מספר
            </button>
            <button
              className="sm-tbtn"
              disabled={!(cur?.t === "list" || cur?.t === "p" || cur?.t === "box")}
              title="הרשימה שבה הסמן: מספרים או תבליטים"
              onClick={() => {
                if (cur?.t === "list") return patch(cur.id, { ordered: !cur.ordered } as Partial<Block>, "struct");
                const el = activeEditable();
                if (el) swapListKind(el);
              }}
            >
              1. ⇄ •
            </button>
          </div>
          <div className="sm-group">
            <button className="sm-tbtn" disabled={!cur} onClick={() => cur && move(cur.id, -1)} title="הזז למעלה">
              ↑
            </button>
            <button className="sm-tbtn" disabled={!cur} onClick={() => cur && move(cur.id, 1)} title="הזז למטה">
              ↓
            </button>
            <button className="sm-tbtn" disabled={!cur} onClick={() => cur && insertAfter(cur.id, { ...JSON.parse(JSON.stringify(cur)), id: uid() })}>
              שכפל
            </button>
            <button className="sm-tbtn danger" disabled={!cur} onClick={() => cur && remove(cur.id)}>
              מחק בלוק
            </button>
          </div>
          <span className="sm-ribbon-sp" />
          <button className="sm-tbtn" disabled={!canUndo} onClick={onUndo} title="בטל (מבנה)">
            ↶
          </button>
          <button className="sm-tbtn" disabled={!canRedo} onClick={onRedo} title="בצע שוב">
            ↷
          </button>
        </div>
        {showSymbols && (
          <div className="sm-row sm-symbols" aria-label="סימנים">
            {SYMBOLS.map((g) => (
              <div key={g.title} className="sm-group">
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
        {showView && <div className="sm-row sm-row-view">{viewTab}</div>}
      </div>

      {inline && (
        <div className="sm-inline-pop" style={{ top: inline.top, left: inline.left }} onMouseDown={(e) => e.stopPropagation()}>
          <MathEditor latex={inline.tex} onChange={(v) => (inlineTex.current = v)} onDone={closeInline} />
          <small>Enter לסיום · Esc לביטול · ריק מוחק</small>
        </div>
      )}

      <div className="sm-page" style={{ zoom }}>
        {blocks.map((b) => (
          <div
            key={b.id}
            data-bid={b.id}
            className={`sm-block t-${b.t} ${current === b.id ? "is-current" : ""} ${drag?.over === b.id ? (drag.after ? "drop-after" : "drop-before") : ""}`}
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
              title="גרור כדי להזיז"
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", b.id);
                setDrag({ id: b.id, over: null, after: false });
              }}
              onDragEnd={() => setDrag(null)}
            >
              ⋮⋮
            </span>
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
