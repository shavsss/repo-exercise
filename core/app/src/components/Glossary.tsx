// The glossary in the scrolling lesson (glossary.ts): the terms of every lesson written so far, kept per lesson in
// the database; in the text, the first use of a term in each sitting is underlined with a dotted line, and a click
// opens a small window with its definition, where it was defined, and the way there. The marks are drawn with the
// CSS Custom Highlight API, so the lesson's own DOM is never touched (React keeps owning it, and the consultation
// and the margin notes keep finding their paragraphs); a click is matched to a mark by its caret position. The side
// column lists the terms with a search. A term of this lesson is marked only after its definition, where the
// lesson has already given it. Identical in both labs.
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Markdown } from "./Markdown";
import { Icon } from "./Icon";
import { matcher, sigOf, termsOf, type GlossDoc, type GlossTerm } from "../glossary";
import { revealSitting } from "../sittings";
import type { Store } from "../runtime";
import type { LessonPlace } from "../events";
import "../glossary.css";

/** every lesson's terms, read once a visit per store */
let loaded: { store: Store; docs: Promise<GlossDoc[]> } | null = null;
const loadAll = (store: Store) => {
  if (loaded?.store !== store) loaded = { store, docs: store.loadGlossary().then((l) => l as unknown as GlossDoc[]).catch(() => []) };
  return loaded.docs;
};

/**
 * The terms to show for a lesson: this lesson's own (from its text, written to the glossary when they changed),
 * and every other lesson's. `text` is the lesson's whole Markdown, or "" while it is being written.
 */
export function useGlossary(store: Store | null, place: LessonPlace | null, text: string): GlossTerm[] {
  const [docs, setDocs] = useState<GlossDoc[]>([]);
  useEffect(() => {
    let alive = true;
    if (store) loadAll(store).then((d) => alive && setDocs(d));
    return () => {
      alive = false;
    };
  }, [store]);
  const own = useMemo(() => (place && text ? termsOf(text, place.moduleId, place.lesson) : []), [place, text]);
  // keep this lesson's terms in the glossary
  useEffect(() => {
    if (!store || !place || !own.length) return;
    const sig = sigOf(own);
    loadAll(store).then((all) => {
      const at = all.findIndex((d) => d.moduleId === place.moduleId && d.lesson === place.lesson);
      if (at >= 0 && all[at].sig === sig) return;
      const doc: GlossDoc = { moduleId: place.moduleId, lesson: place.lesson, title: place.title, terms: own, sig, at: Date.now() };
      if (at >= 0) all[at] = doc;
      else all.push(doc);
      store.saveGlossary(`${place.moduleId}__${place.lesson}`, doc as unknown as Record<string, unknown>).catch(() => {});
    });
  }, [store, place, own]);
  return useMemo(() => {
    const other = docs.filter((d) => !(place && d.moduleId === place.moduleId && d.lesson === place.lesson)).flatMap((d) => d.terms ?? []);
    const byTerm = new Map<string, GlossTerm>();
    // a term defined in more than one lesson: the working tool (summary) over the aid, then the later lesson
    for (const t of other.sort((a, b) => a.moduleId.localeCompare(b.moduleId) || a.lesson - b.lesson)) {
      const old = byTerm.get(t.term);
      if (!old || t.mark === "summary" || old.mark !== "summary") byTerm.set(t.term, t);
    }
    for (const t of own) byTerm.set(t.term, t);
    return [...byTerm.values()];
  }, [docs, own, place]);
}

const SKIP = "h1, h2, h3, h4, h5, h6, .katex, code, pre, button, a, input, textarea, svg, .block-definition, .consult-host, .no-copy, .msg-meta";
const isHere = (t: GlossTerm, place: LessonPlace | null) => !!place && t.moduleId === place.moduleId && t.lesson === place.lesson;

/** The definition block of a term in the page, by its title. */
function defBlock(root: HTMLElement, t: GlossTerm) {
  const blocks = [...root.querySelectorAll<HTMLElement>(".msg-assistant .block-definition")];
  const title = (b: HTMLElement) => (b.querySelector(".block-title")?.textContent ?? "").replace(/\s+/g, " ").trim();
  return blocks.find((b) => title(b) === t.title) ?? blocks.find((b) => title(b).startsWith(t.term)) ?? null;
}

/** Scrolls to a term's definition in this lesson, and marks it for a moment. */
export function goToDefinition(root: HTMLElement | null, t: GlossTerm) {
  const b = root && defBlock(root, t);
  if (!b) return false;
  revealSitting(b);
  b.scrollIntoView({ behavior: "smooth", block: "center" });
  b.classList.remove("is-gloss-flash");
  void b.offsetWidth;
  b.classList.add("is-gloss-flash");
  return true;
}

type Mark = { range: Range; term: GlossTerm };

export function GlossaryMarks({
  scrollRef,
  terms,
  place,
  version,
  onOpenLesson,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  terms: GlossTerm[];
  place: LessonPlace | null;
  /** changes with the lesson's text */
  version: unknown;
  onOpenLesson: (moduleId: string, lesson: number) => void;
}) {
  const marks = useRef<Mark[]>([]);
  const [open, setOpen] = useState<{ term: GlossTerm; x: number; y: number; below: boolean } | null>(null);

  // the marks: the first use of each term in each sitting (or answer), after its definition when it is this lesson's
  useEffect(() => {
    const root = scrollRef.current;
    const hl = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    if (!root || !terms.length) return;
    const t0 = setTimeout(() => {
      const find = matcher(terms).find;
      const defs = new Map(terms.filter((t) => isHere(t, place)).map((t) => [t, defBlock(root, t)]));
      const out: Mark[] = [];
      for (const prose of root.querySelectorAll<HTMLElement>(".msg-assistant > .prose")) {
        const used = new Set<GlossTerm>();
        const walk = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
        for (let n = walk.nextNode() as Text | null; n; n = walk.nextNode() as Text | null) {
          for (const h of find(n.data)) {
            if (used.has(h.term)) continue;
            if (isHere(h.term, place)) {
              const d = defs.get(h.term);
              if (!d || !(d.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
            }
            used.add(h.term);
            const r = document.createRange();
            r.setStart(n, h.at);
            r.setEnd(n, h.at + h.len);
            out.push({ range: r, term: h.term });
          }
        }
      }
      marks.current = out;
      const H = (window as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
      if (hl && H) hl.set("gloss", new H(...out.map((m) => m.range)));
    }, 60);
    return () => {
      clearTimeout(t0);
      hl?.delete("gloss");
      marks.current = [];
    };
  }, [scrollRef, terms, place, version]);

  // a click on a mark opens its window; the pointer says where a mark is
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const at = (x: number, y: number): Mark | null => {
      const d = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
      const p = d.caretPositionFromPoint?.(x, y);
      const r = p ? null : document.caretRangeFromPoint?.(x, y);
      const node = p?.offsetNode ?? r?.startContainer;
      const off = p?.offset ?? r?.startOffset ?? 0;
      if (!node) return null;
      return (
        marks.current.find((m) => {
          if (m.range.startContainer !== node || off < m.range.startOffset || off > m.range.endOffset) return false;
          // the caret is at a mark's edge also beside it: check the box
          const b = m.range.getBoundingClientRect();
          return x >= b.left - 1 && x <= b.right + 1 && y >= b.top - 2 && y <= b.bottom + 2;
        }) ?? null
      );
    };
    const click = (e: MouseEvent) => {
      if (e.button !== 0 || !window.getSelection()?.isCollapsed) return;
      const m = at(e.clientX, e.clientY);
      if (!m) return;
      const b = m.range.getBoundingClientRect();
      const below = b.top < window.innerHeight * 0.45;
      setOpen({ term: m.term, x: b.left + b.width / 2, y: below ? b.bottom + 8 : b.top - 8, below });
    };
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => root.classList.toggle("on-term", !!at(e.clientX, e.clientY)));
    };
    root.addEventListener("click", click);
    root.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("click", click);
      root.removeEventListener("mousemove", move);
      root.classList.remove("on-term");
    };
  }, [scrollRef]);

  // the window closes with Escape, a click elsewhere, or reading on
  useEffect(() => {
    if (!open) return;
    const root = scrollRef.current;
    const close = () => setOpen(null);
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    const down = (e: PointerEvent) => !(e.target as HTMLElement).closest?.(".gloss-pop") && close();
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", down, true);
    root?.addEventListener("scroll", close, { passive: true });
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", down, true);
      root?.removeEventListener("scroll", close);
    };
  }, [open, scrollRef]);

  if (!open) return null;
  const w = Math.min(380, window.innerWidth - 24);
  const left = Math.max(12, Math.min(window.innerWidth - w - 12, open.x - w / 2));
  return createPortal(
    <div className="gloss-pop" role="dialog" aria-label={`מילון: ${open.term.term}`} style={{ left, width: w, ...(open.below ? { top: open.y } : { bottom: window.innerHeight - open.y }) }}>
      <TermCard
        term={open.term}
        here={isHere(open.term, place)}
        onGo={() => {
          setOpen(null);
          if (isHere(open.term, place)) goToDefinition(scrollRef.current, open.term);
          else onOpenLesson(open.term.moduleId, open.term.lesson);
        }}
      />
    </div>,
    document.body,
  );
}

/** A term: its title, where it was defined, its definition, and the way to it. */
function TermCard({ term, here, onGo }: { term: GlossTerm; here: boolean; onGo: () => void }) {
  return (
    <>
      <div className="gloss-head">
        <span className="gloss-term">{term.title}</span>
        {term.mark === "summary" && <span className="gloss-tag">לסיכום</span>}
      </div>
      <div className="gloss-from">
        {here ? "הוגדר בשיעור הזה" : `${term.moduleId} · שיעור ${term.lesson + 1}`}
        {term.section ? ` · ${term.section}` : ""}
      </div>
      <div className="prose gloss-body">
        <Markdown text={term.body} />
      </div>
      <button className="link gloss-go" onClick={onGo}>
        {here ? "להגדרה בשיעור" : "לשיעור שבו הוגדר"} <Icon name="next" size={13} />
      </button>
    </>
  );
}

/** The glossary in the side column: every term so far, this lesson's first, with a search. */
export function GlossaryPane({ terms, place, scrollRef, onOpenLesson }: { terms: GlossTerm[]; place: LessonPlace | null; scrollRef: RefObject<HTMLDivElement | null>; onOpenLesson: (moduleId: string, lesson: number) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const hit = (t: GlossTerm) => !s || t.term.toLowerCase().includes(s) || t.title.toLowerCase().includes(s) || t.aliases.some((a) => a.toLowerCase().includes(s));
    const byName = (a: GlossTerm, b: GlossTerm) => a.term.localeCompare(b.term, "he");
    return [
      { label: "מהשיעור הזה", list: terms.filter((t) => isHere(t, place) && hit(t)) },
      { label: "משיעורים אחרים", list: terms.filter((t) => !isHere(t, place) && hit(t)).sort(byName) },
    ].filter((g) => g.list.length);
  }, [terms, place, q]);
  return (
    <div className="gloss-pane">
      <input className="gloss-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש מונח" aria-label="חיפוש מונח" />
      {!terms.length && <p className="gloss-empty">המונחים שהשיעורים מגדירים יופיעו כאן, מכל שיעור שנכתב.</p>}
      {terms.length > 0 && !shown.length && <p className="gloss-empty">אין מונח כזה עדיין.</p>}
      {shown.map((g) => (
        <section key={g.label} className="gloss-group">
          <div className="side-list-head">{g.label}</div>
          <ul>
            {g.list.map((t) => {
              const id = `${t.moduleId}:${t.lesson}:${t.term}`;
              const on = open === id;
              return (
                <li key={id} className={on ? "is-open" : ""}>
                  <button className="gloss-row" aria-expanded={on} onClick={() => setOpen(on ? null : id)}>
                    <span className="gloss-row-term">{t.term}</span>
                    {!isHere(t, place) && <span className="gloss-row-from">{t.moduleId}</span>}
                  </button>
                  {on && (
                    <div className="gloss-entry">
                      <TermCard term={t} here={isHere(t, place)} onGo={() => (isHere(t, place) ? goToDefinition(scrollRef.current, t) : onOpenLesson(t.moduleId, t.lesson))} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
