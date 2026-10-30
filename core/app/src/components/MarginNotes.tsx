// Notes the learner pulls from the pad ("פתק" in the reading dock) into the empty margin beside
// the lesson, each at the height of the paragraph it was pulled at (its `anchor` quote). A lesson starts
// with none. Each is a quiet index card with a numbered tab toward the text (style B, round 5); all keep
// one small size, and a click opens the full note, where it is edited, given a kind, or deleted. Where
// the margin is too narrow, a small numbered tab at the paragraph's edge opens it instead. Identical in
// both labs.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { NOTE_KIND_LABEL, type LessonNote, type NoteKind } from "../types";

const NOTE_W = 200;
const GAP = 28;
const KINDS: NoteKind[] = ["note", "deepen", "interview", "article"];
/** a small mark per kind; the two that lead outward (an expert, an article) take the lab's accent */
const SYM: Record<NoteKind, string> = { note: "·", deepen: "↓", interview: "?", article: "¶" };
const OUT: NoteKind[] = ["interview", "article"];
/** the margin a note needs beside the text: the card, the gap with its tab, and a little air */
const NEED = NOTE_W + GAP + 10;

/** Each lesson turn has its own notes layer; the column moves aside while any of them asks. */
const shifting = new Map<object, HTMLElement>();
function shiftColumn(who: object, col: HTMLElement | null) {
  const was = shifting.get(who);
  if (col) shifting.set(who, col);
  else shifting.delete(who);
  const on = new Set(shifting.values());
  for (const c of [was, col]) if (c) c.classList.toggle("mn-shift", on.has(c));
}

type Placed = { key: string; note: LessonNote; top: number; num: number; range: Range | null };

/** A range over `needle` inside `el`, walking its text nodes; null when the text is not there verbatim. */
function rangeOf(el: HTMLElement, needle: string): Range | null {
  const text = el.textContent ?? "";
  const at = text.indexOf(needle);
  if (at < 0 || !needle) return null;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let pos = 0;
  let started = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = n.nodeValue?.length ?? 0;
    if (!started && at < pos + len) {
      range.setStart(n, at - pos);
      started = true;
    }
    if (started && at + needle.length <= pos + len) {
      range.setEnd(n, at + needle.length - pos);
      return range;
    }
    pos += len;
  }
  return null;
}

const BLOCKS = ".prose p, .prose li, .prose h2, .prose h3, .prose h4, .prose td";

function locate(root: HTMLElement, anchor: string): { el: HTMLElement; range: Range | null } | null {
  for (const p of root.querySelectorAll<HTMLElement>(BLOCKS)) {
    const r = rangeOf(p, anchor);
    if (r) return { el: p, range: r };
  }
  return null;
}

/** Where a new note goes: the selected text inside the lesson, else the first paragraph at the top of the view. */
export function noteAnchorHere(scroller: HTMLElement | null): string | null {
  if (!scroller) return null;
  const sel = window.getSelection();
  const picked = sel && !sel.isCollapsed && sel.anchorNode && scroller.contains(sel.anchorNode) ? sel.toString() : "";
  // a selection inside one paragraph is kept as is; the text nodes of a paragraph hold it verbatim
  if (picked.trim() && !picked.includes("\n")) return picked.trim().slice(0, 160);
  const top = scroller.getBoundingClientRect().top;
  for (const p of scroller.querySelectorAll<HTMLElement>(".msg-assistant .prose p, .msg-assistant .prose li")) {
    const r = p.getBoundingClientRect();
    const t = (p.textContent ?? "").trim();
    if (r.bottom > top + 40 && t.length > 20) return t.slice(0, 80);
  }
  return null;
}

export function MarginNotes({
  root,
  notes,
  version,
  onSave,
  onDelete,
}: {
  root: RefObject<HTMLElement | null>;
  notes: LessonNote[];
  version: unknown;
  onSave: (id: string, patch: Partial<LessonNote>) => void;
  onDelete: (id: string) => void;
}) {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [wide, setWide] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const layer = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const me = useRef({});

  const layout = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const scroller = el.closest(".scroll")?.getBoundingClientRect();
    // the column stays centred while the margin holds the notes; when it does not, but the page
    // does, the column moves aside to make room (the "mn-shift" class on .col), else small tabs
    const room = scroller ? scroller.width - box.width - 32 : 0;
    const centred = room / 2 >= NEED;
    const found = notes
      .filter((n) => n.id && n.anchor)
      .map((note) => ({ note, at: locate(el, note.anchor!) }))
      .filter((x) => x.at)
      .map((x) => ({ key: x.note.id!, note: x.note, range: x.at!.range, y: x.at!.el.getBoundingClientRect().top - box.top }))
      .sort((a, b) => a.y - b.y || a.note.ts - b.note.ts);
    const shift = !centred && room >= NEED + 16 && found.length > 0;
    setWide(centred || shift);
    shiftColumn(me.current, shift ? el.closest<HTMLElement>(".col") : null);
    setPlaced(found.map((x, k) => ({ key: x.key, note: x.note, range: x.range, top: x.y, num: k + 1 })));
  }, [root, notes]);

  useLayoutEffect(layout, [layout, version]);
  useEffect(() => () => shiftColumn(me.current, null), []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(() => layout());
    ro.observe(el);
    const sc = el.closest(".scroll");
    if (sc) ro.observe(sc);
    document.fonts?.ready.then(layout);
    return () => ro.disconnect();
  }, [root, layout]);

  // a note just pulled from the pad (still empty) opens for writing
  useEffect(() => {
    for (const p of placed) {
      if (seen.current.has(p.key)) continue;
      seen.current.add(p.key);
      if (!p.note.text.trim()) {
        setOpen(p.key);
        setDraft("");
      }
    }
  }, [placed]);

  // notes that would overlap are pushed down, in order
  useLayoutEffect(() => {
    const items = [...(layer.current?.querySelectorAll<HTMLElement>(".mn-note") ?? [])];
    let floor = -Infinity;
    for (const it of items) {
      const want = Number(it.dataset.top);
      const y = wide ? Math.max(want, floor) : want;
      it.style.top = `${y}px`;
      floor = y + it.offsetHeight + 14;
    }
  });

  // the quoted text is lit with the CSS Custom Highlight API while its note is hovered or open
  useEffect(() => {
    const reg = (globalThis as { CSS?: { highlights?: Map<string, unknown> } }).CSS?.highlights;
    const H = (globalThis as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    if (!reg || !H) return;
    const lit = placed.find((p) => p.key === (hot ?? open))?.range;
    if (lit) reg.set("mn-on", new H(lit));
    else reg.delete("mn-on");
    return () => {
      reg.delete("mn-on");
    };
  }, [placed, hot, open]);

  const close = useCallback(() => {
    setOpen((id) => {
      if (!id) return null;
      const n = notes.find((x) => x.id === id);
      const text = draft.trim();
      if (n && !text) onDelete(id);
      else if (n && text !== n.text.trim()) onSave(id, { text });
      return null;
    });
  }, [notes, draft, onSave, onDelete]);

  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !(e.target as HTMLElement).closest?.(".mn-note.is-open")) close();
    };
    document.addEventListener("keydown", away);
    document.addEventListener("pointerdown", away);
    return () => {
      document.removeEventListener("keydown", away);
      document.removeEventListener("pointerdown", away);
    };
  }, [open, close]);

  if (!placed.length) return null;
  return (
    <div className={`mn-layer ${wide ? "is-wide" : "is-narrow"}`} ref={layer} aria-label="פתקים">
      {placed.map((p) => {
        const isOpen = open === p.key;
        return (
          <div
            key={p.key}
            className={`mn-note k-${p.note.kind} ${OUT.includes(p.note.kind) ? "is-out" : ""} ${isOpen ? "is-open" : ""}`}
            data-top={p.top}
            data-n={p.num}
            onPointerEnter={() => setHot(p.key)}
            onPointerLeave={() => setHot(null)}
          >
            {isOpen ? (
              <div className="mn-face">
                <div className="mn-kinds" role="group" aria-label="סוג הפתק">
                  {KINDS.map((k) => (
                    <button key={k} className={`mn-k k-${k} ${p.note.kind === k ? "is-on" : ""}`} onClick={() => onSave(p.key, { kind: k })} aria-pressed={p.note.kind === k}>
                      {NOTE_KIND_LABEL[k]}
                    </button>
                  ))}
                </div>
                <textarea className="mn-edit" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="מה לזכור כאן?" autoFocus rows={5} dir="auto" />
                <div className="mn-actions">
                  <button
                    className="mn-del"
                    onClick={() => {
                      onDelete(p.key);
                      setOpen(null);
                    }}
                  >
                    מחק
                  </button>
                  <button className="mn-done" onClick={close}>
                    סגור
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="mn-face"
                onClick={() => {
                  setDraft(p.note.text);
                  setOpen(p.key);
                }}
                title={wide ? "לחיצה פותחת את הפתק" : NOTE_KIND_LABEL[p.note.kind]}
              >
                <span className="mn-kind">
                  <i className="mn-sym" aria-hidden="true">
                    {SYM[p.note.kind]}
                  </i>
                  <span className="mn-label">{NOTE_KIND_LABEL[p.note.kind]}</span> <b>{p.num}</b>
                </span>
                {wide && <span className="mn-text">{p.note.text}</span>}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
