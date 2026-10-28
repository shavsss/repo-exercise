// The lesson notebook's points as sticky notes in the empty margin beside the lesson, each at the
// height of the paragraph it came from (its `anchor` quote, or the paragraph that shares most of its
// words). All notes keep one small size; a click opens the full note. Where the margin is too narrow,
// a small numbered marker at the paragraph's edge opens it instead. Identical in both labs.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { NOTE_KIND_LABEL, type LessonNote } from "../types";

const NOTE_W = 184;
const GAP = 24;

type Placed = { key: string; note: LessonNote; top: number; num: number; range: Range | null };

const wordsOf = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

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

/** The paragraph a note belongs to: its anchor verbatim, else the paragraph sharing most of its words. */
function locate(root: HTMLElement, note: LessonNote): { el: HTMLElement; range: Range | null } | null {
  const paras = [...root.querySelectorAll<HTMLElement>(".prose p, .prose li")];
  const anchor = note.anchor?.trim();
  if (anchor) {
    for (const p of paras) {
      const r = rangeOf(p, anchor);
      if (r) return { el: p, range: r };
    }
  }
  const want = new Set(wordsOf(anchor || note.text));
  if (want.size < 3) return null;
  let best: HTMLElement | null = null;
  let score = 0;
  for (const p of paras) {
    const have = new Set(wordsOf(p.textContent ?? ""));
    let hit = 0;
    want.forEach((w) => have.has(w) && hit++);
    const s = hit / want.size;
    if (s > score) [best, score] = [p, s];
  }
  return best && score >= (anchor ? 0.5 : 0.35) ? { el: best, range: null } : null;
}

export function MarginNotes({ root, notes, version }: { root: RefObject<HTMLElement | null>; notes: LessonNote[]; version: unknown }) {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [wide, setWide] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const layer = useRef<HTMLDivElement>(null);

  const layout = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const scroller = el.closest(".scroll")?.getBoundingClientRect();
    setWide(!!scroller && box.left - scroller.left >= NOTE_W + GAP + 10);
    const found = notes
      .map((note, i) => ({ note, i, at: locate(el, note) }))
      .filter((x) => x.at)
      .map((x) => ({ key: x.note.id ?? `n${x.i}`, note: x.note, range: x.at!.range, y: x.at!.el.getBoundingClientRect().top - box.top }))
      .sort((a, b) => a.y - b.y);
    setPlaced(found.map((x, k) => ({ key: x.key, note: x.note, range: x.range, top: x.y, num: k + 1 })));
  }, [root, notes]);

  useLayoutEffect(layout, [layout, version]);
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

  // the quoted text is lit with the CSS Custom Highlight API, without touching the lesson's DOM
  useEffect(() => {
    const reg = (globalThis as { CSS?: { highlights?: Map<string, unknown> } }).CSS?.highlights;
    const H = (globalThis as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    if (!reg || !H) return;
    const all = placed.flatMap((p) => (p.range ? [p.range] : []));
    reg.set("mn-anchor", new H(...all));
    const lit = placed.find((p) => p.key === (hot ?? open))?.range;
    if (lit) reg.set("mn-on", new H(lit));
    else reg.delete("mn-on");
    return () => {
      reg.delete("mn-anchor");
      reg.delete("mn-on");
    };
  }, [placed, hot, open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !(e.target as HTMLElement).closest?.(".mn-note")) setOpen(null);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, [open]);

  if (!placed.length) return null;
  return (
    <div className={`mn-layer ${wide ? "is-wide" : "is-narrow"}`} ref={layer} aria-label="פתקים מהמחברת">
      {placed.map((p) => {
        const isOpen = open === p.key;
        return (
          <div
            key={p.key}
            className={`mn-note k-${p.note.kind} ${p.note.who === "learner" ? "by-me" : ""} ${isOpen ? "is-open" : ""}`}
            data-top={p.top}
            onPointerEnter={() => setHot(p.key)}
            onPointerLeave={() => setHot(null)}
          >
            <button
              className="mn-face"
              onClick={() => setOpen(isOpen ? null : p.key)}
              aria-expanded={isOpen}
              title={wide ? "לחיצה פותחת את הפתק" : NOTE_KIND_LABEL[p.note.kind]}
            >
              <span className="mn-kind">
                {NOTE_KIND_LABEL[p.note.kind]} <b>{p.num}</b>
              </span>
              {(wide || isOpen) && <span className="mn-text">{p.note.text}</span>}
            </button>
          </div>
        );
      })}
    </div>
  );
}
