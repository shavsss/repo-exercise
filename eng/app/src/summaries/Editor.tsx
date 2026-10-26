import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Block, BoxKind, ListItem, MarkColor } from "./model";
import { BOX_LABEL, MARK_LABEL, emptyBlock, itemNumbers, numbering, textOf, uid } from "./model";
import { applyMark, applyStyle, caret, caretOnEdgeLine, cleanHtml, placeCaret, splitAtCaret } from "./rich";
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
  make?: () => Block;
}
const INSERT: InsertItem[] = [
  { id: "p", label: "פסקה", hint: "טקסט רגיל", keys: "p פסקה טקסט", make: () => emptyBlock("p") },
  { id: "h1", label: "כותרת פרק", hint: "1, 2, 3", keys: "h1 כותרת פרק", make: () => ({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), level: 1 }) },
  { id: "h2", label: "כותרת סעיף", hint: "1.1, 1.2", keys: "h2 סעיף כותרת", make: () => ({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), level: 2 }) },
  { id: "h3", label: "תת-סעיף", hint: "1.1.1", keys: "h3 תת סעיף", make: () => ({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), level: 3 }) },
  { id: "ul", label: "רשימת תבליטים", hint: "- ורווח", keys: "ul רשימה תבליטים", make: () => emptyBlock("list") },
  { id: "ol", label: "רשימה ממוספרת", hint: "1. ורווח", keys: "ol רשימה ממוספרת מספרים", make: () => ({ ...(emptyBlock("list") as Extract<Block, { t: "list" }>), ordered: true }) },
  ...(Object.keys(BOX_LABEL) as BoxKind[]).map((k) => ({ id: `box-${k}`, label: BOX_LABEL[k], hint: "תיבה", keys: `תיבה box ${BOX_LABEL[k]}`, make: () => ({ ...(emptyBlock("box") as Extract<Block, { t: "box" }>), kind: k, ...(k === "eq" ? { latex: "" } : {}) }) })),
  { id: "math", label: "משוואה", hint: "ממוספרת", keys: "math משוואה נוסחה $$", make: () => emptyBlock("math") },
  { id: "img", label: "תמונה מהמחשב", hint: "או הדבק Ctrl+V", keys: "img תמונה צילום" },
  { id: "fig", label: "איור מהספר", hint: "מספרי הספרייה", keys: "fig איור ספר" },
  { id: "hr", label: "קו מפריד", hint: "", keys: "hr קו מפריד", make: () => emptyBlock("hr") },
];
const MARKS: MarkColor[] = ["y", "r", "b", "g"];

/* ---------------- one editable ---------------- */
function Rich({ fkey, html, onChange, onKeyDown, placeholder, className }: { fkey: string; html: string; onChange: (h: string) => void; onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void; placeholder?: string; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const e = el.current!;
    if (document.activeElement !== e && cleanHtml(e.innerHTML) !== html) e.innerHTML = html;
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
        const h = cleanHtml(e.innerHTML);
        if (!h && e.innerHTML) e.innerHTML = "";
        onChange(h);
      }}
      onKeyDown={onKeyDown}
      onPaste={(e) => {
        if (e.clipboardData.files.length) return; // pictures: the editor takes them
        e.preventDefault();
        document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
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
  /** the contents of the ribbon's third tab (view, export, status) */
  viewTab: ReactNode;
}) {
  const focusReq = useRef<{ key: string; where: Where; at: number } | null>(null);
  const [editingMath, setEditingMath] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ id: string; filter: string; sel: number } | null>(null);
  const [tab, setTab] = useState<"insert" | "edit" | "view">("insert");
  const [drag, setDrag] = useState<{ id: string; over: string | null; after: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileAfter = useRef<string | null>(null);
  const { heads, eqs } = useMemo(() => numbering(blocks), [blocks]);

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
    if (e.altKey && /^[0-4]$/.test(e.key)) {
      e.preventDefault();
      applyMark(e.key === "0" ? null : `hl-${MARKS[Number(e.key) - 1]}`);
      return;
    }
    const c = caret(el);
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (b.t === "box") {
        // inside a box Enter is a new line; Enter on an empty last line leaves the box
        if (c && c.before === c.total && /(<br>|\n)\s*$/.test(el.innerHTML)) {
          const h = cleanHtml(el.innerHTML.replace(/(<br>|\n|\s)+$/, ""));
          el.innerHTML = h;
          patch(b.id, { html: h });
          const nb = emptyBlock("p");
          insertAfter(b.id, nb);
          focus(nb.id, "start");
        } else document.execCommand("insertLineBreak");
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
      [/^[-*•]\s/, () => ({ id: b.id, t: "list", ordered: false, items: [{ html: "", level: 0 }] })],
      [/^1[.)]\s/, () => ({ id: b.id, t: "list", ordered: true, items: [{ html: "", level: 0 }] })],
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
    if (e.altKey && /^[0-4]$/.test(e.key)) {
      e.preventDefault();
      applyMark(e.key === "0" ? null : `hl-${MARKS[Number(e.key) - 1]}`);
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
    const html = cur.t === "p" || cur.t === "h" || cur.t === "box" ? cur.html : cur.t === "list" ? cur.items.map((x) => x.html).join("<br>") : "";
    let nb: Block | null = null;
    if (to === "p") nb = { id: cur.id, t: "p", html };
    else if (/^h[123]$/.test(to)) nb = { id: cur.id, t: "h", level: Number(to[1]) as 1 | 2 | 3, html };
    else if (to === "ul" || to === "ol") nb = { id: cur.id, t: "list", ordered: to === "ol", items: html.split(/<br>/).map((h) => ({ html: h, level: 0 })) };
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
        return (
          <div className={`sm-h sm-h${b.level}`}>
            {n && <span className="sm-num" contentEditable={false}>{n}</span>}
            <Rich fkey={b.id} html={b.html} placeholder={b.level === 1 ? "כותרת פרק" : b.level === 2 ? "כותרת סעיף" : "תת-סעיף"} onChange={(h) => patch(b.id, { html: h })} onKeyDown={textKeys(b)} />
          </div>
        );
      }
      case "p":
        return (
          <div className="sm-p">
            <Rich fkey={b.id} html={b.html} placeholder="כתוב, או / לתפריט" onChange={(h) => paraInput(b, h)} onKeyDown={textKeys(b)} />
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
                <Rich fkey={`${b.id}:${i}`} html={it.html} placeholder={i === 0 ? "פריט" : ""} onChange={(h) => patch(b.id, { items: b.items.map((x, j) => (j === i ? { ...x, html: h } : x)) } as Partial<Block>)} onKeyDown={listKeys(b, i)} />
              </div>
            ))}
          </div>
        );
      }
      case "box":
        return (
          <div className={`sm-box box-${b.kind}`}>
            <div className="sm-box-head" contentEditable={false}>
              <select value={b.kind} aria-label="סוג התיבה" onChange={(e) => patch(b.id, { kind: e.target.value as BoxKind, ...(e.target.value === "eq" && b.latex === undefined ? { latex: "" } : {}) } as Partial<Block>, "struct")}>
                {(Object.keys(BOX_LABEL) as BoxKind[]).map((k) => (
                  <option key={k} value={k}>
                    {BOX_LABEL[k]}
                  </option>
                ))}
              </select>
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
            <Rich fkey={b.id} html={b.html} placeholder={b.kind === "eq" ? "מה כל סימן, ומתי היא נכונה" : "כתוב כאן"} onChange={(h) => patch(b.id, { html: h })} onKeyDown={textKeys(b)} />
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
        <div className="sm-ribbon-tabs" role="tablist">
          {(
            [
              ["insert", "הוספה"],
              ["edit", "עריכה"],
              ["view", "תצוגה וייצוא"],
            ] as const
          ).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
              {l}
            </button>
          ))}
          <span className="sm-ribbon-sp" />
          <button className="sm-tbtn" disabled={!canUndo} onClick={onUndo} title="בטל (מבנה)">
            ↶ בטל
          </button>
          <button className="sm-tbtn" disabled={!canRedo} onClick={onRedo} title="בצע שוב">
            ↷ שוב
          </button>
        </div>
        <div className="sm-ribbon-body">
          {tab === "insert" && (
            <>
              <div className="sm-group">
                {INSERT.slice(0, 6).map((it) => (
                  <button key={it.id} className="sm-tbtn" onClick={() => doInsert(it, current)} title={it.hint}>
                    {it.label}
                  </button>
                ))}
              </div>
              <div className="sm-group">
                {INSERT.filter((x) => x.id.startsWith("box-")).map((it) => (
                  <button key={it.id} className={`sm-tbtn box-chip ${it.id}`} onClick={() => doInsert(it, current)}>
                    {it.label}
                  </button>
                ))}
              </div>
              <div className="sm-group">
                {INSERT.filter((x) => ["math", "img", "fig", "hr"].includes(x.id)).map((it) => (
                  <button key={it.id} className="sm-tbtn" onClick={() => doInsert(it, current)} title={it.hint}>
                    {it.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {tab === "edit" && (
            <>
              <div className="sm-group">
                <button className="sm-tbtn" onClick={() => applyStyle("bold")} title="Ctrl+B">
                  <b>מודגש</b>
                </button>
                <button className="sm-tbtn" onClick={() => applyStyle("italic")} title="Ctrl+I">
                  <i>נטוי</i>
                </button>
              </div>
              <div className="sm-group">
                {MARKS.map((m, i) => (
                  <button key={m} className={`sm-tbtn mark-btn hl-${m}`} onClick={() => applyMark(`hl-${m}`)} title={`Alt+${i + 1}`}>
                    {MARK_LABEL[m]}
                  </button>
                ))}
                <button className="sm-tbtn" onClick={() => applyMark(null)} title="Alt+0">
                  נקה סימון
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
                {cur?.t === "h" && (
                  <button className="sm-tbtn" aria-pressed={!!cur.plain} onClick={() => patch(cur.id, { plain: !cur.plain } as Partial<Block>, "struct")}>
                    בלי מספר
                  </button>
                )}
                {cur?.t === "math" && (
                  <button className="sm-tbtn" aria-pressed={!!cur.plain} onClick={() => patch(cur.id, { plain: !cur.plain } as Partial<Block>, "struct")}>
                    בלי מספר
                  </button>
                )}
                {cur?.t === "list" && (
                  <button className="sm-tbtn" onClick={() => patch(cur.id, { ordered: !cur.ordered } as Partial<Block>, "struct")}>
                    {cur.ordered ? "לתבליטים" : "למספור"}
                  </button>
                )}
              </div>
              <div className="sm-group">
                <button className="sm-tbtn" disabled={!cur} onClick={() => cur && move(cur.id, -1)}>
                  ↑ הזז למעלה
                </button>
                <button className="sm-tbtn" disabled={!cur} onClick={() => cur && move(cur.id, 1)}>
                  ↓ הזז למטה
                </button>
                <button className="sm-tbtn" disabled={!cur} onClick={() => cur && insertAfter(cur.id, { ...JSON.parse(JSON.stringify(cur)), id: uid() })}>
                  שכפל
                </button>
                <button className="sm-tbtn danger" disabled={!cur} onClick={() => cur && remove(cur.id)}>
                  מחק בלוק
                </button>
              </div>
            </>
          )}
          {tab === "view" && viewTab}
        </div>
      </div>

      <div className="sm-page">
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
