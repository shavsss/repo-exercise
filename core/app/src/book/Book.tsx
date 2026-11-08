// The lesson as a book (round 6, option A: docs/research/round6/book/). An open book on the desk: two pages and a
// spine, stacks of leaves on both sides whose thickness is what was read and what is left, and leaves that turn in
// 3D. The text is the same lesson, drawn by the same block renderers as the scrolling column; the book only lays
// those blocks out on pages.
//
// How it works:
// - a hidden galley draws every block of the conversation once, at the width of a page column, and measures it
//   (its height, and where it may be cut between lines); paginate.ts fills pages greedily from those numbers;
// - only the pages in view and their neighbours are in the DOM; each block on a page is a window onto the block
//   (a paragraph cut between two pages is drawn on both, each showing its own lines);
// - a turn is a rigid leaf animated on the compositor (turn.ts); input during a turn is never thrown away: the
//   same direction finishes the leaf fast and turns the next one, the other direction takes the leaf back.
//
// The three rules that hold the book (README):
// 1. an action of the learner never changes the height of the text: a think question keeps room for its answer
//    (the hidden copy is measured in its largest state), a consultation, the notebook and a live scene open on the
//    facing page, and margin notes sit in the margin;
// 2. a page the learner has seen does not change: seen pages are frozen; a lesson still being written only adds
//    below what is on the last page; only a new font size or window size lays the book out again, and then the
//    reading place is kept by block, not by page number;
// 3. the facing page is one place that shows one thing at a time: text, a consultation, the notebook or a scene.
//
// Identical in both labs.
import { memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Markdown, MdContext, type MdContextValue } from "../components/Markdown";
import { GuideCard, GuideCtx, GuideDot, sectionOfSource } from "../components/LessonGuide";
import { Icon } from "../components/Icon";
import { MarginNotes } from "../components/MarginNotes";
import { setReading, useReading } from "../reading";
import { riffleSound, turnSound } from "../sound";
import type { Item, Segment } from "../segments";
import type { LessonNote } from "../types";
import { BookCtx, type BookBridge, type BookCard, type BookCtxValue } from "./context";
import { FIGURES, INTERACTIVE, PLATES, WHOLE, chunkText, uniqueIds, type Chunk } from "./chunks";
import { charWidth, heightOf, lineCuts } from "./measure";
import { pageEnd, pageFill, pageOf, paginate, type Box, type Frag, type Page } from "./paginate";
import { EASE, FADE_MS, FAST_MS, OPEN_MS, PEEL_MS, TURN_MS, makeOpen, makeTurn, reducedMotion, type TurnStyle } from "./turn";
import "./book.css";

/* ------------------------------------------------------------------ geometry ------------------------------------------------------------------ */

interface Geom {
  w: number;
  h: number;
  fs: number;
  /** the line grid: every line and every space is a whole number of it (B1 §4.4) */
  lu: number;
  /** the text column */
  W: number;
  inner: number;
  outer: number;
  pw: number;
  ph: number;
  head: number;
  cap: number;
  spread: boolean;
  phone: boolean;
  /** free desk beside the book, on each side */
  side: number;
}

const BAR = 48;
const PHONE_BAR = 56;

function computeGeom(w: number, h: number, fs: number, charW: number): Geom {
  const phone = w <= 700;
  const lu = Math.round(fs * 1.784);
  let W: number, inner: number, outer: number, pw: number, ph: number;
  if (phone) {
    pw = w;
    inner = 16;
    outer = 16;
    W = pw - inner - outer;
    ph = h - PHONE_BAR;
  } else {
    inner = 36;
    outer = 60;
    // 66 characters of running Hebrew in the book's face (B1: 495 px in Frank Ruhl Libre at 18.5 px)
    W = Math.round(66 * (charW || fs * 0.405));
    pw = W + inner + outer;
    if (pw + 48 > w) {
      pw = Math.max(320, w - 48);
      outer = 36;
      W = pw - inner - outer;
    }
    ph = Math.min(h - BAR - 22, Math.round(pw * 1.55));
  }
  const head = phone ? Math.round(lu * 1.25) : Math.round(lu * 1.9);
  const foot = phone ? Math.round(lu * 1.25) : Math.round(lu * 1.9);
  const cap = Math.max(lu * 4, Math.floor((ph - head - foot) / lu) * lu);
  const lines = cap / lu;
  const chars = W / (charW || fs * 0.405);
  // two pages only when each holds at least 58 characters and 13 lines; otherwise one page of the same width (R4 §1.4)
  const spread = !phone && w >= 2 * pw + 64 && lines >= 13 && chars >= 58;
  const side = Math.max(0, (w - (spread ? 2 * pw : pw)) / 2);
  return { w, h, fs, lu, W, inner, outer, pw, ph, head, cap, spread, phone, side };
}

function useGeom(ref: RefObject<HTMLDivElement | null>, size: string): { g: Geom | null; settled: boolean } {
  const [g, setG] = useState<Geom | null>(null);
  // the first sizes of a page that is still being laid out are not shown: the book waits until its size holds
  const [settled, setSettled] = useState(false);
  const [fontsOk, setFontsOk] = useState(false);
  useEffect(() => {
    let alive = true;
    const f = document.fonts;
    if (!f) return setFontsOk(true);
    Promise.race([Promise.all([f.load('400 18px "Frank Ruhl Libre"'), f.load('700 18px "Frank Ruhl Libre"')]).then(() => f.ready), new Promise((r) => setTimeout(r, 2500))]).then(() => alive && setFontsOk(true));
    return () => {
      alive = false;
    };
  }, []);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !fontsOk) return;
    const on = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 50 || r.height < 50) return;
      const fs = parseFloat(getComputedStyle(el).getPropertyValue("--bk-fs")) || 18.5;
      const next = computeGeom(Math.floor(r.width), Math.floor(r.height), fs, charWidth(`400 ${fs}px "Frank Ruhl Libre"`));
      setG((old) => (old && JSON.stringify(old) === JSON.stringify(next) ? old : next));
      window.clearTimeout(st);
      st = window.setTimeout(() => setSettled(true), 160);
    };
    let st = 0;
    on();
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(on, 120);
    });
    ro.observe(el);
    return () => {
      clearTimeout(t);
      clearTimeout(st);
      ro.disconnect();
    };
  }, [ref, size, fontsOk]);
  return { g: settled ? g : null, settled };
}

/* ------------------------------------------------------------------ chunks ------------------------------------------------------------------ */

const textOfItem = (segments: Segment[]) => segments.filter((s): s is Extract<Segment, { t: "text" }> => s.t === "text").map((s) => s.text).join("\n");

function useChunks(items: Item[], liveKey: string | null, hasTitle: boolean, hasEnd: boolean) {
  const cache = useRef(new Map<string, { text: string; open: boolean; chunks: Chunk[] }>());
  return useMemo(() => {
    const out: Chunk[] = [];
    if (hasTitle) out.push({ key: "title", id: "title", kind: "title", text: "", figBase: 0, item: -1 });
    let seenAnswer = false;
    items.forEach((it, idx) => {
      if (it.kind === "user") {
        // the request that wrote the lesson is not part of the book; a later question opens its answer's page
        if (!seenAnswer || it.mode === "lesson") return;
        out.push({ key: `q${idx}`, id: `q-${idx}`, kind: "question", text: it.text, figBase: 0, item: idx, first: true });
        return;
      }
      const text = textOfItem(it.segments);
      const open = it.key === liveKey;
      let c = cache.current.get(it.key);
      if (!c || c.text !== text || c.open !== open) {
        c = { text, open, chunks: chunkText(text, idx, open) };
        cache.current.set(it.key, c);
      }
      const prevQuestion = out[out.length - 1]?.kind === "question";
      c.chunks.forEach((ch, k) => out.push({ ...ch, first: k === 0 && seenAnswer && !prevQuestion }));
      if ((it.truncated || it.interrupted) && !open && text.trim()) out.push({ key: `cut${idx}`, id: `cut-${idx}`, kind: "cut", text: "", figBase: 0, item: idx });
      if (text.trim()) seenAnswer = true;
    });
    if (hasEnd && !liveKey) out.push({ key: "end", id: "end", kind: "end", text: "", figBase: 0, item: -1 });
    return uniqueIds(out);
  }, [items, liveKey, hasTitle, hasEnd]);
}

const words = (s: string) => (s.replace(/```\w*|[#*_`$\\]/g, " ").match(/[\p{L}\p{N}]+/gu) ?? []).length;

/* ------------------------------------------------------------------ blocks ------------------------------------------------------------------ */

export interface BookHeader {
  code: string;
  title: string;
  sub?: string;
}

function BookTitle({ header }: { header: BookHeader }) {
  return (
    <header className="bk-title">
      <div className="bk-title-code" dir="ltr">
        {header.code}
      </div>
      <h1 className="bk-title-h">{header.title}</h1>
      {header.sub && <div className="bk-title-sub">{header.sub}</div>}
      <div className="bk-title-rule" aria-hidden />
      {/* the lesson map: one row under the title; open, it lies over the page (LessonGuide.tsx) */}
      <GuideCard floating />
    </header>
  );
}

interface BodyProps {
  c: Chunk;
  header?: BookHeader;
  onContinue?: () => void;
  end?: ReactNode;
  measuring?: boolean;
}

/** One block of the lesson: the same renderers as the scrolling column. */
const ChunkBody = memo(function ChunkBody({ c, header, onContinue, end, measuring }: BodyProps) {
  if (c.kind === "title") return header ? <BookTitle header={header} /> : null;
  if (c.kind === "question")
    return (
      <div className="bk-question">
        <span className="bk-question-label">השאלה שלי</span>
        <p>{c.text}</p>
      </div>
    );
  if (c.kind === "cut")
    return (
      <div className="bk-cut">
        <span>התשובה נקטעה לפני סופה. מה שנכתב נשמר.</span>
        {onContinue && (
          <button className="btn small primary" onClick={onContinue} disabled={measuring}>
            המשך מהמקום שנעצר
          </button>
        )}
      </div>
    );
  if (c.kind === "end") return <div className="bk-end">{end}</div>;
  return <Markdown text={c.text} figBase={c.figBase} />;
});

/** the class of a block's window: its kind, its fence, and whether a paragraph's first line is indented */
function chunkClass(c: Chunk, prev?: Chunk) {
  const k = [`k-${c.kind}`];
  if (c.lang) k.push(`f-${c.lang}`);
  if (c.kind === "p" && prev?.kind === "p" && prev.item === c.item) k.push("is-indent");
  return k.join(" ");
}

/** what a picture that floated to the next page is called in the pointer at the foot of the page it left */
function floatName(c: Chunk | undefined) {
  const l = c?.kind === "table" ? "table" : c?.lang ?? "";
  if (l === "table") return "טבלה";
  if (l === "chart") return "תרשים";
  if (PLATES.has(l)) return "לוח";
  return "איור";
}

/* ------------------------------------------------------------------ the boxes ------------------------------------------------------------------ */

interface Measured {
  sig: string;
  h: number;
  cuts: number[];
}

function boxOf(c: Chunk, m: Measured | undefined, prev: Chunk | undefined, g: Geom): Box {
  const lu = g.lu;
  const h0 = m?.h ?? 0;
  const text = c.kind === "p" || c.kind === "list" || c.kind === "quote";
  const fence = c.kind === "fence" ? c.lang ?? "" : "";
  const atomic = c.kind === "math" || c.kind === "table" || c.kind === "title" || c.kind === "question" || c.kind === "cut" || c.kind === "hr" || INTERACTIVE.has(fence) || PLATES.has(fence) || FIGURES.has(fence) || WHOLE.has(fence) || c.kind === "h4";
  // blocks round up to the grid, so the text after them stays on it
  const h = atomic && h0 ? Math.ceil(h0 / lu) * lu : h0;
  const prevText = prev && (prev.kind === "p" || prev.kind === "list" || prev.kind === "quote");
  const prevHead = prev && (prev.kind === "h2" || prev.kind === "h3" || prev.kind === "h4" || prev.kind === "title" || prev.kind === "question");
  let gap = lu;
  if (text && (prevText || prevHead)) gap = 0;
  else if (c.kind === "math" && prevText) gap = 0;
  else if (prevHead && c.kind !== "h2") gap = 0;
  const box: Box = { h, cuts: m?.cuts ?? [], gap, split: false, minHead: 2 };
  if (text) Object.assign(box, { split: true, filler: true });
  else if (c.kind === "fence" && !atomic) Object.assign(box, { split: true, minHead: 3 });
  else if (WHOLE.has(fence) && box.cuts.length) Object.assign(box, { split: true, late: true, minHead: 2 });
  if (c.kind === "h2") Object.assign(box, { keepNext: true, sticky: h + 4 * lu });
  if (c.kind === "h3" || c.kind === "h4") box.keepNext = true;
  if (FIGURES.has(fence) || PLATES.has(fence) || c.kind === "table") box.float = true;
  if (INTERACTIVE.has(fence)) box.anchor = true;
  if (c.first || c.kind === "question") box.newPage = true;
  if (c.kind === "end") Object.assign(box, { fixed: true, h: Math.max(h, g.cap), newPage: true });
  return box;
}

/* ------------------------------------------------------------------ the saved place ------------------------------------------------------------------ */

const POS_KEY = `${document.documentElement.dataset.lab === "eng" ? "eng" : "core"}-lab:book-pos`;
type Place = { id: string; frac: number };
function loadPlace(key: string): Place | null {
  try {
    return (JSON.parse(localStorage.getItem(POS_KEY) ?? "{}") as Record<string, Place>)[key] ?? null;
  } catch {
    return null;
  }
}
function savePlace(key: string, p: Place) {
  try {
    const all = JSON.parse(localStorage.getItem(POS_KEY) ?? "{}") as Record<string, Place>;
    all[key] = p;
    const keys = Object.keys(all);
    if (keys.length > 300) delete all[keys[0]];
    localStorage.setItem(POS_KEY, JSON.stringify(all));
  } catch {
    // a per-browser convenience only
  }
}
/** lessons whose book was opened in this visit: the cover opens once */
const opened = new Set<string>();

/* ------------------------------------------------------------------ roles ------------------------------------------------------------------ */

type Side = "r" | "l" | "s";
interface Role {
  side: Side;
  show: boolean;
  z?: number;
  turn?: "a" | "b";
  /** the edge it turns about */
  origin?: "r" | "l";
  fade?: boolean;
}

interface Anim {
  style: TurnStyle;
  dir: 1 | -1;
  from: number;
  to: number;
  ms: number;
  drag?: boolean;
  opening?: boolean;
}

type Facing = { kind: "consult" } | { kind: "pad" } | { kind: "ask" } | { kind: "scene"; lang: string; code: string };

/* ------------------------------------------------------------------ the page ------------------------------------------------------------------ */

interface PageProps {
  p: number;
  page: Page | undefined;
  role: Role;
  chunks: Chunk[];
  header?: BookHeader;
  runhead: string;
  folio: number;
  g: Geom;
  live: boolean;
  tail: boolean;
  mdCtx: MdContextValue;
  liveCtx: MdContextValue;
  onContinue?: () => void;
  end?: ReactNode;
  setEl: (p: number, el: HTMLDivElement | null) => void;
  notes?: LessonNote[];
  onNoteSave?: (id: string, patch: Partial<LessonNote>) => void;
  onNoteDelete?: (id: string) => void;
  numberOf: (id: string) => number;
  cardsHere: { card: BookCard; top: number }[];
  onCard: (id: string) => void;
  onPageSwipe: (e: React.PointerEvent, p: number) => void;
}

const PageView = memo(function PageView(pp: PageProps) {
  const { p, page, role, chunks, g, mdCtx, liveCtx } = pp;
  const body = useRef<HTMLDivElement>(null);
  const setRef = useCallback((el: HTMLDivElement | null) => pp.setEl(p, el), [pp.setEl, p]); // eslint-disable-line react-hooks/exhaustive-deps
  const cls = ["bk-page", `side-${role.side}`, role.show ? "is-shown" : "is-hidden"];
  if (role.turn) cls.push(`is-turn-${role.turn}`, `origin-${role.origin}`);
  if (role.fade) cls.push("is-fading");
  if (p === 0) cls.push("is-opening");
  if (p % 2 === 0) cls.push("is-even");
  else cls.push("is-odd");
  const last = page?.frags[page.frags.length - 1];
  return (
    <div className={cls.join(" ")} ref={setRef} data-p={p} style={{ zIndex: role.z ?? 1 }} onPointerDown={(e) => pp.onPageSwipe(e, p)}>
      {p > 0 && pp.runhead && <div className="bk-runhead">{pp.runhead}</div>}
      <div className="bk-body" ref={body} style={{ top: g.head, height: g.cap }}>
        {page?.frags.map((f) => (
          <FragView key={`${f.i}:${f.from}`} f={f} c={chunks[f.i]} prev={chunks[f.i - 1]} header={pp.header} ctx={chunks[f.i]?.open && pp.live ? liveCtx : mdCtx} onContinue={pp.onContinue} end={pp.end} />
        ))}
        {pp.tail && pp.live && last && <div className="bk-pen" style={{ top: last.top + last.h + 4 }} aria-hidden />}
        {page && page.next.held.length > 0 && (
          <div className="bk-cont is-float" style={{ top: g.cap + 2 }}>
            ↓ {floatName(chunks[page.next.held[0]])} בעמוד הבא
          </div>
        )}
        {role.show && pp.notes && pp.notes.length > 0 && pp.onNoteSave && pp.onNoteDelete && (
          <MarginNotes root={body} notes={pp.notes} version={page} onSave={pp.onNoteSave} onDelete={pp.onNoteDelete} clipped room={g.phone ? 0 : g.side - 24} numberOf={pp.numberOf} />
        )}
        {role.show &&
          pp.cardsHere.map(({ card, top }, k) => (
            <button key={card.id} className="bk-card-tab" style={{ top: top + k * 2 }} onClick={() => pp.onCard(card.id)} title={`${card.label}: ${card.title}`} data-silent>
              <Icon name="think" size={12} />
              <span>{card.label}</span>
            </button>
          ))}
      </div>
      {p > 0 && <div className="bk-folio">{pp.folio}</div>}
      <div className="bk-shade" aria-hidden />
    </div>
  );
});

function FragView({ f, c, prev, header, ctx, onContinue, end }: { f: Frag; c: Chunk | undefined; prev?: Chunk; header?: BookHeader; ctx: MdContextValue; onContinue?: () => void; end?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(!!f.over);
  const [atEnd, setAtEnd] = useState(false);
  // room the block may take when it grew: down to the next block or the end of the page
  const [room, setRoom] = useState<number | null>(null);
  // a block that grew after its page was laid out (a picture that loaded late, a think question's amber card)
  // is never cut silently: its window scrolls, with a mark
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el || !f.end) return;
    const check = () => {
      const need = el.scrollHeight - f.from;
      let h = f.h;
      const b = box.current;
      if (b && !f.over && need > f.h + 2) {
        // a think question opened, or a picture loaded: take the free space before scrolling inside a sliver
        let limit = (b.parentElement?.clientHeight ?? f.top + f.h) - f.top;
        for (let n = b.nextElementSibling as HTMLElement | null; n; n = n.nextElementSibling as HTMLElement | null) {
          if (n.classList.contains("bk-frag")) {
            limit = n.offsetTop - f.top - 6;
            break;
          }
        }
        h = Math.max(f.h, Math.min(need, limit));
      }
      setRoom(h > f.h ? h : null);
      setOver(!!f.over || need > h + 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [f]);
  if (!c) return null;
  const cls = ["bk-frag", chunkClass(c, prev)];
  if (!f.end) cls.push("is-head");
  if (f.from > 0) cls.push("is-tail");
  if (over) cls.push("is-over");
  if (atEnd) cls.push("at-end");
  const contHead = !f.end && c.kind === "fence";
  const contTail = f.from > 0 && c.kind === "fence";
  return (
    <>
      <div
        className={cls.join(" ")}
        ref={box}
        data-chunk={c.key}
        style={{ top: f.top, height: room ?? f.h }}
        onScroll={over ? (e) => setAtEnd(e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - 4) : undefined}
      >
        <MdContext.Provider value={ctx}>
          <div className="prose bk-text" ref={inner} style={over ? undefined : { marginTop: -f.from }}>
            <ChunkBody c={c} header={header} onContinue={onContinue} end={end} />
          </div>
        </MdContext.Provider>
      </div>
      {over && !atEnd && (
        <div className="bk-more" style={{ top: f.top + (room ?? f.h) - 26 }} aria-hidden>
          <span>הבלוק ממשיך · גללו בתוכו</span>
        </div>
      )}
      {contHead && <div className="bk-cont is-next" style={{ top: f.top + f.h + 2 }}>ההמשך בעמוד הבא ←</div>}
      {contTail && <div className="bk-cont is-prev" style={{ top: f.top - 18 }}>המשך</div>}
    </>
  );
}

/* ------------------------------------------------------------------ the book ------------------------------------------------------------------ */

export interface BookProps {
  items: Item[];
  /** the assistant item still being written, if any */
  liveKey: string | null;
  /** the chat after the lesson, shown on the facing page of "שאל את המורה" above the composer */
  thread?: ReactNode;
  header?: BookHeader;
  /** `<module>:<lesson>`: where the reading place is kept */
  posKey: string;
  onOpenSource: (doc: string, page: number) => void;
  onContinue?: () => void;
  notes?: LessonNote[];
  onNoteSave?: (id: string, patch: Partial<LessonNote>) => void;
  onNoteDelete?: (id: string) => void;
  /** pull an empty note into the margin at this quote */
  onAddNote?: (anchor: string) => void;
  bridge: BookBridge;
  rootRef: RefObject<HTMLDivElement | null>;
  /** the back of the book: the next lesson, the close of the day */
  end?: ReactNode;
  /** shown on the first left page while nothing is written yet */
  wait?: ReactNode;
  /** the notebook, drawn on the facing page */
  notebook?: (close: () => void) => ReactNode;
  /** the composer, folded under the book until asked for */
  composer?: ReactNode;
  writing?: boolean;
  onStop?: () => void;
  notices?: ReactNode;
}

const MEASURE_CTX: BookCtxValue = { mode: "measure" };

export function BookView(props: BookProps) {
  const { items, liveKey, header, posKey, bridge, rootRef } = props;
  const r = useReading();
  const { g } = useGeom(rootRef, r.size);
  const reduce = reducedMotion();
  const chunks = useChunks(items, liveKey, !!header, !!props.end);
  const live = !!liveKey;
  // the lesson map: a change of it (a tag beside a heading) is measured again like any other change
  const { guide } = useContext(GuideCtx);

  /* ---- the galley and its measures ---- */
  const galley = useRef<HTMLDivElement>(null);
  const altGalley = useRef<HTMLDivElement>(null);
  const measures = useRef(new Map<string, Measured>());
  const [mtick, setMtick] = useState(0);
  const W = g?.W ?? 0;
  const fs = g?.fs ?? 0;
  useLayoutEffect(() => {
    const root = galley.current;
    if (!root || !W) return;
    const els = root.querySelectorAll<HTMLElement>(":scope > .bk-gc");
    const alts = new Map<string, HTMLElement>();
    altGalley.current?.querySelectorAll<HTMLElement>(":scope > .bk-gc-alt").forEach((el) => alts.set(el.dataset.key!, el));
    let changed = false;
    els.forEach((el) => {
      const c = chunks[Number(el.dataset.i)];
      if (!c || c.kind === "end") return;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const alt = alts.get(c.key)?.firstElementChild as HTMLElement | null | undefined;
      const h = Math.max(heightOf(inner), alt ? heightOf(alt) : 0);
      const sig = `${c.text.length}:${c.text.slice(-24)}:${W}:${fs}:${h}`;
      const old = measures.current.get(c.key);
      if (old?.sig === sig) return;
      const splittable = c.kind === "p" || c.kind === "list" || c.kind === "quote" || (c.kind === "fence" && ![INTERACTIVE, PLATES, FIGURES].some((set) => set.has(c.lang ?? "")));
      measures.current.set(c.key, { sig, h, cuts: splittable ? lineCuts(inner) : [] });
      changed = true;
    });
    if (changed) setMtick((n) => n + 1);
  });
  // late changes of a block's height (a picture that loads, a chart that draws): measured again, at most every 250 ms
  useEffect(() => {
    const root = galley.current;
    if (!root) return;
    let t = 0;
    const ro = new ResizeObserver(() => {
      if (t) return;
      t = window.setTimeout(() => {
        t = 0;
        setMtick((n) => n + 1);
      }, 250);
    });
    root.querySelectorAll(":scope > .bk-gc > .prose").forEach((el) => ro.observe(el));
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [chunks, W]);

  /* ---- pages ---- */
  const frozen = useRef<{ sig: string; pages: Page[] }>({ sig: "", pages: [] });
  const sig = g ? `${g.W}|${g.cap}|${g.fs}|${posKey}` : "";
  const sigChanged = frozen.current.sig !== sig;
  if (sigChanged) frozen.current = { sig, pages: [] };
  const boxes = useMemo(() => (g ? chunks.map((c, i) => boxOf(c, measures.current.get(c.key), chunks[i - 1], g)) : []), [chunks, g, mtick]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = !!g && chunks.every((c) => c.kind === "end" || measures.current.has(c.key));
  const pages = useMemo(() => (g && ready ? paginate(boxes, g.cap, g.lu, frozen.current.pages, true) : []), [boxes, g, ready, sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const n = pages.length;
  // the fill of every page, for the test page only (core/tools/test-check/book.mjs sets window.__bookFill to null
  // and reports what is left there); nothing reads it in the app
  useEffect(() => {
    const w = window as unknown as { __bookFill?: unknown };
    if (!g || !pages.length || !("__bookFill" in w)) return;
    const detail = (f: Frag) => ({ i: f.i, from: f.from, to: f.to, top: f.top, h: f.h, bh: boxes[f.i]?.h, cuts: boxes[f.i]?.cuts.length, gap: boxes[f.i]?.gap });
    const kind = (f: Frag) => `${chunks[f.i]?.kind}${chunks[f.i]?.lang ? ":" + chunks[f.i]?.lang : ""}`;
    w.__bookFill = {
      cap: g.cap,
      lu: g.lu,
      boxes,
      pages: pages.map((pg, k) => ({ fill: Math.round((pageFill(pg) / g.cap) * 1000) / 1000, why: pageEnd(pages, k, boxes), frags: pg.frags.map(kind), detail: pg.frags.map(detail) })),
    };
  }, [pages, g, chunks, boxes]);

  /* ---- where we are ---- */
  const [cur, setCurState] = useState(0);
  const curRef = useRef(0);
  const setCur = (p: number) => {
    curRef.current = p;
    setCurState(p);
  };
  const [facing, setFacing] = useState<Facing | null>(null);
  const [slotSide, setSlotSide] = useState<"r" | "l">("l");
  const [scene, setScene] = useState<{ lang: string; code: string; big: boolean } | null>(null);
  const slot = !!facing;
  const spread = !!g?.spread;
  const phone = !!g?.phone;
  /** one page at a time: a phone, a narrow window, or the facing page taken by something else */
  const single = !spread || slot;
  const first = (p: number) => (single ? Math.max(0, Math.min(p, n - 1)) : Math.max(0, Math.min(p - (p % 2), n - 1 - ((n - 1) % 2))));
  const visible = useMemo(() => (single ? [cur] : [cur, cur + 1].filter((p) => p < n)), [single, cur, n]);

  // the reading place: the first block of the page being read, by id, kept in this browser
  const anchor = useRef<{ i: number; off: number } | null>(null);
  const placeLoaded = useRef("");
  const [resumed, setResumed] = useState(false);
  useLayoutEffect(() => {
    if (!n || !g) return;
    if (placeLoaded.current !== posKey) {
      placeLoaded.current = posKey;
      const saved = loadPlace(posKey);
      const i = saved ? chunks.findIndex((c) => c.id === saved.id) : -1;
      if (i > 0 && !live) {
        const off = Math.round((saved!.frac || 0) * boxes[i].h);
        const p = first(pageOf(pages, i, off));
        if (p > 0) {
          setCur(p);
          setResumed(true);
          anchor.current = { i, off };
          return;
        }
      }
      setCur(0);
      return;
    }
    // a new page size: back to the page that holds the block being read
    if (sigChanged || (anchor.current && !pages[cur]?.frags.some((f) => f.i === anchor.current!.i))) {
      if (anchor.current) setCur(first(pageOf(pages, anchor.current.i, anchor.current.off)));
    }
  }, [pages, posKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const p = pages[cur];
    const f = p?.frags.find((x) => chunks[x.i]?.kind !== "title") ?? p?.frags[0];
    if (!f) return;
    anchor.current = { i: f.i, off: f.from };
    const t = setTimeout(() => savePlace(posKey, { id: chunks[f.i].id, frac: boxes[f.i]?.h ? f.from / boxes[f.i].h : 0 }), 400);
    return () => clearTimeout(t);
  }, [cur, pages, posKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!resumed) return;
    const t = setTimeout(() => setResumed(false), 7000);
    return () => clearTimeout(t);
  }, [resumed]);
  // a change between one page and two keeps the page being read
  useEffect(() => {
    if (n) setCur(first(curRef.current));
  }, [single, n]); // eslint-disable-line react-hooks/exhaustive-deps

  // rule 2: what was shown is frozen (after a short settling of the first lay-out: fonts, pictures)
  const bornAt = useRef(performance.now());
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => {
    if (!n) return;
    const last = Math.max(...visible);
    setMaxSeen((m) => Math.max(m, last));
    const freeze = () => {
      if (frozen.current.sig !== sig) return;
      if (last + 1 > frozen.current.pages.length) frozen.current.pages = pages.slice(0, last + 1);
    };
    const wait = 1500 - (performance.now() - bornAt.current);
    if (wait > 0) {
      const t = setTimeout(freeze, wait);
      return () => clearTimeout(t);
    }
    freeze();
  }, [visible, pages, sig, n]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- turning ---- */
  const [peek, setPeek] = useState<number | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [anim, setAnim] = useState<Anim | null>(null);
  const animRef = useRef<Anim | null>(null);
  animRef.current = anim;
  const running = useRef<{ list: Animation[]; anim: Anim; commit: boolean; done?: boolean } | null>(null);
  const stale = useRef<Animation[]>([]);
  const queue = useRef<(1 | -1)[]>([]);
  const els = useRef(new Map<number, HTMLDivElement>());
  const ghosts = useRef<(HTMLDivElement | null)[]>([]);
  const setEl = useCallback((p: number, el: HTMLDivElement | null) => {
    if (el) els.current.set(p, el);
    else els.current.delete(p);
  }, []);
  const back = useRef<number[]>([]);
  const [backPill, setBackPill] = useState<{ to: number; ahead: number } | null>(null);

  const styleFor = useCallback(
    (far: boolean): TurnStyle => {
      const pick = r.turn;
      if (pick === "none") return "none";
      if (pick === "fade" || (pick === "auto" && reduce)) return "fade";
      if (single) return "peel";
      if (pick === "slide") return "peel";
      return far ? "riffle" : "3d";
    },
    [r.turn, reduce, single],
  );
  const step = single ? 1 : 2;

  const start = useCallback(
    (dir: 1 | -1, o: { fast?: boolean; to?: number } = {}) => {
      const from = curRef.current;
      const to = o.to ?? from + dir * step;
      if (to < 0 || to > n - 1 || to === from) return false;
      const far = Math.abs(to - from) > step;
      let style = styleFor(far);
      if (far && style !== "riffle" && style !== "none") style = "fade";
      if (single && style === "peel" && far) style = "fade";
      const ms = style === "3d" ? (o.fast ? FAST_MS : TURN_MS) : style === "peel" ? (o.fast ? 180 : PEEL_MS) : style === "riffle" ? 420 : style === "fade" ? FADE_MS : 0;
      if (style === "none") {
        turnSound(dir, 0, { soft: true });
        setCur(to);
        return true;
      }
      if (style === "riffle") riffleSound(dir, ms);
      else if (style === "fade") turnSound(dir, 0, { soft: true });
      else turnSound(dir, ms);
      setAnim({ style, dir, from, to, ms });
      return true;
    },
    [n, step, styleFor, single],
  );

  /** Any input of the reader: never lost, never waiting for an animation (B2 §2.4). */
  const request = useCallback(
    (dir: 1 | -1, o: { fast?: boolean } = {}) => {
      const run = running.current;
      if (run && !run.done) {
        if (run.anim.opening) {
          run.list.forEach((a) => a.finish());
          queue.current.push(dir);
          return;
        }
        if (run.anim.drag) return;
        if (dir === run.anim.dir) {
          // the same way: this leaf finishes fast, and the next one follows at once
          run.list.forEach((a) => a.updatePlaybackRate(3));
          if (queue.current.length < 3) queue.current.push(dir);
        } else if (run.commit) {
          // the other way: the leaf goes back from where it is
          run.commit = false;
          queue.current = [];
          run.list.forEach((a) => a.reverse());
        }
        return;
      }
      if (start(dir, o) && backPill && dir === 1) setBackPill((b) => (b ? (b.ahead >= 1 ? null : { ...b, ahead: b.ahead + 1 }) : b));
    },
    [start, backPill],
  );

  const jump = useCallback(
    (to: number, remember = true) => {
      const t = first(to);
      const from = curRef.current;
      if (t === from || running.current) return;
      if (remember) {
        back.current.push(from);
        setBackPill({ to: from, ahead: 0 });
      }
      start(t > from ? 1 : -1, { to: t });
    },
    [start, first], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // "לדון עם המורה" on a margin note: once its question is in the book, turn to it (the back pill returns to the page)
  const followNote = useRef<number | null>(null);
  useEffect(() => {
    const on = () => (followNote.current = chunks.filter((c) => c.kind === "question").length);
    window.addEventListener("note:discuss", on);
    return () => window.removeEventListener("note:discuss", on);
  }, [chunks]);
  useEffect(() => {
    const had = followNote.current;
    if (had === null) return;
    const qs = chunks.map((c, i) => [c, i] as const).filter(([c]) => c.kind === "question");
    if (qs.length <= had) return;
    const qi = qs[qs.length - 1][1];
    const p = pages.findIndex((pg) => pg.frags.some((f) => f.i === qi));
    if (p < 0) return;
    followNote.current = null;
    jump(p);
  }, [pages, chunks, jump]);
  const goBack = useCallback(() => {
    const to = back.current.pop();
    if (to === undefined) return;
    setBackPill(null);
    start(to > curRef.current ? 1 : -1, { to: first(to) });
  }, [start]); // eslint-disable-line react-hooks/exhaustive-deps

  // the opening of the book: once a lesson in this visit, from its first spread, unless motion is reduced
  const [opening, setOpening] = useState(false);
  // before the first paint, so the open book never shows for a frame before its cover
  useLayoutEffect(() => {
    if (!n || !g || opened.has(posKey)) return;
    opened.add(posKey);
    if (placeLoaded.current !== posKey || reduce || r.turn === "none" || r.turn === "fade" || curRef.current !== 0 || !spread || slot) return;
    setOpening(true);
    turnSound(1, OPEN_MS);
    setAnim({ style: "3d", dir: 1, from: -2, to: 0, ms: OPEN_MS, opening: true });
  }, [n, g, posKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // the roles of the pages in this frame
  const roles = useMemo(() => {
    const m = new Map<number, Role>();
    const set = (p: number, role: Role) => {
      if (p >= -1 && p < n) m.set(p, role);
    };
    const textSide: Side = slot && spread ? (slotSide === "l" ? "r" : "l") : "s";
    const a = anim;
    if (a && (a.style === "3d" || a.style === "peel")) {
      if (a.style === "3d") {
        if (a.dir === 1) {
          set(a.from, { side: "r", show: true, z: 1 });
          set(a.from + 3, { side: "l", show: true, z: 1 });
          set(a.from + 1, { side: "l", show: true, z: 4, turn: "a", origin: "r" });
          set(a.from + 2, { side: "r", show: true, z: 4, turn: "b", origin: "l" });
        } else {
          set(a.from + 1, { side: "l", show: true, z: 1 });
          set(a.from - 2, { side: "r", show: true, z: 1 });
          set(a.from, { side: "r", show: true, z: 4, turn: "a", origin: "l" });
          set(a.from - 1, { side: "l", show: true, z: 4, turn: "b", origin: "r" });
        }
      } else if (a.dir === 1) {
        set(a.from, { side: textSide, show: true, z: 4, turn: "a", origin: "r" });
        set(a.to, { side: textSide, show: true, z: 1 });
      } else {
        set(a.to, { side: textSide, show: true, z: 4, turn: "a", origin: "r" });
        set(a.from, { side: textSide, show: true, z: 1 });
      }
    } else {
      const at = a ? a.to : peek !== null ? peek : cur;
      if (single) set(at, { side: textSide, show: true, z: 2 });
      else {
        set(at, { side: "r", show: true, z: 2 });
        set(at + 1, { side: "l", show: true, z: 2 });
      }
      if (a && a.style === "fade") {
        if (single) set(a.from, { side: textSide, show: true, z: 5, fade: true });
        else {
          set(a.from, { side: "r", show: true, z: 5, fade: true });
          set(a.from + 1, { side: "l", show: true, z: 5, fade: true });
        }
      }
    }
    // neighbours stay drawn (hidden), so the next turn has its pages ready
    const around = single ? [cur - 1, cur + 1] : [cur - 2, cur - 1, cur + 2, cur + 3];
    for (const p of around) if (!m.has(p) && p >= 0 && p < n) m.set(p, { side: single ? textSide : p % 2 ? "l" : "r", show: false });
    return m;
  }, [anim, cur, n, single, slot, spread, slotSide, peek]); // eslint-disable-line react-hooks/exhaustive-deps

  // start the animations of a turn before the frame is painted
  useLayoutEffect(() => {
    // the previous turn's animations are let go only now, when the pages already stand in their new places
    stale.current.forEach((x) => x.cancel());
    stale.current = [];
    if (!anim) return;
    const get = (p: number) => (p === -1 ? cover.current : els.current.get(p) ?? null);
    let list: Animation[];
    const easing = anim.drag ? "linear" : EASE;
    if (anim.style === "3d") {
      const a = anim.dir === 1 ? { a: get(anim.from + 1), b: get(anim.from + 2), under: get(anim.from + 3), base: get(anim.from) } : { a: get(anim.from), b: get(anim.from - 1), under: get(anim.from - 2), base: get(anim.from + 1) };
      list = anim.opening ? makeOpen(a) : makeTurn("3d", anim.dir, a, anim.ms, easing);
    } else if (anim.style === "peel") {
      list = makeTurn("peel", anim.dir, anim.dir === 1 ? { a: get(anim.from), under: get(anim.to) } : { a: get(anim.to), under: get(anim.from) }, anim.ms, anim.drag ? "linear" : "cubic-bezier(.2,.8,.3,1)");
    } else if (anim.style === "fade") {
      list = makeTurn("fade", anim.dir, { out: single ? [get(anim.from)] : [get(anim.from), get(anim.from + 1)] }, anim.ms);
    } else {
      list = makeTurn("riffle", anim.dir, { ghosts: ghosts.current }, anim.ms);
    }
    const run = { list, anim, commit: true, done: false };
    running.current = run;
    if (anim.drag) list.forEach((x) => x.pause());
    if (!list.length) {
      finish(run);
      return;
    }
    Promise.all(list.map((x) => x.finished)).then(
      () => finish(run),
      () => {},
    );
  }, [anim]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = (run: { list: Animation[]; anim: Anim; commit: boolean; done?: boolean }) => {
    if (run.done || running.current !== run) return;
    run.done = true;
    stale.current = run.list;
    running.current = null;
    if (run.anim.opening) setOpening(false);
    if (run.commit) setCur(run.anim.to);
    setAnim(null);
  };
  // after a turn: the next one in the queue
  useEffect(() => {
    if (anim || !queue.current.length) return;
    const dir = queue.current.shift()!;
    start(dir, { fast: queue.current.length > 0 });
  }, [anim, start]);

  /* ---- drag: the stack's edge, a corner, a swipe, or two fingers on a trackpad (B2 §2.5–2.6) ---- */
  const drag = useRef<{ dir: 1 | -1; x0: number; t0: number; lastX: number; lastT: number; v: number; started: boolean; spine: number; w: number; touch: boolean; id: number } | null>(null);
  const progressOf = (d: NonNullable<typeof drag.current>, x: number) => {
    if (!d.touch && !single) {
      // the leaf's outer edge stays under the finger: θ = acos((spine − x) / W)
      const q = d.dir === 1 ? (d.spine - x) / d.w : (x - d.spine) / d.w;
      return Math.acos(Math.max(-1, Math.min(1, q))) / Math.PI;
    }
    return Math.max(0, Math.min(1, ((x - d.x0) * d.dir) / d.w));
  };
  const beginDrag = (dir: 1 | -1, x: number, touch: boolean, id: number) => {
    const run = running.current;
    if (run && !run.done) run.list.forEach((a) => a.finish());
    const from = curRef.current;
    const to = from + dir * step;
    if (to < 0 || to > n - 1) return false;
    const style = styleFor(false);
    if (style !== "3d" && style !== "peel") return false;
    const book = rootRef.current?.querySelector<HTMLElement>(".bk-spread")?.getBoundingClientRect();
    if (!book) return false;
    const spine = single ? (dir === 1 ? book.left : book.right) : book.left + book.width / 2;
    drag.current = { dir, x0: x, t0: performance.now(), lastX: x, lastT: performance.now(), v: 0, started: true, spine, w: single ? book.width : book.width / 2, touch, id };
    setAnim({ style, dir, from, to, ms: style === "3d" ? TURN_MS : PEEL_MS, drag: true });
    return true;
  };
  const moveDrag = (x: number) => {
    const d = drag.current;
    const run = running.current;
    if (!d || !run || !run.anim.drag) return;
    const now = performance.now();
    d.v = (x - d.lastX) / Math.max(1, now - d.lastT);
    d.lastX = x;
    d.lastT = now;
    const p = progressOf(d, x);
    for (const a of run.list) {
      const dur = Number(a.effect?.getTiming().duration) || TURN_MS;
      a.currentTime = p * dur;
    }
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    const run = running.current;
    if (!d || !run || !run.anim.drag) return;
    const p = progressOf(d, d.lastX);
    const fling = d.v * d.dir > 0.45;
    const back = d.v * d.dir < -0.45;
    const go = !back && (p > 0.5 || fling);
    run.commit = go;
    const left = go ? 1 - p : p;
    const ms = Math.max(120, Math.min(300, left * TURN_MS));
    for (const a of run.list) {
      const dur = Number(a.effect?.getTiming().duration) || TURN_MS;
      const rate = (left * dur) / ms || 1;
      a.updatePlaybackRate(go ? rate : -rate);
      a.play();
    }
    if (go) turnSound(d.dir, ms);
    else turnSound(d.dir, 0, { soft: true });
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (d && e.pointerId === d.id) moveDrag(e.clientX);
      const t = touch.current;
      if (t && e.pointerId === t.id && !drag.current) {
        const dx = e.clientX - t.x;
        const dy = e.clientY - t.y;
        if (Math.abs(dx) > 12 && Math.abs(dx) > 1.5 * Math.abs(dy) && performance.now() - t.t < 450) {
          touch.current = null;
          // forward is a swipe to the right: the finger pulls the page over toward the spine
          beginDrag(dx > 0 ? 1 : -1, t.x, true, e.pointerId);
          moveDrag(e.clientX);
        } else if (Math.abs(dy) > 16) touch.current = null;
      }
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (d && e.pointerId === d.id) endDrag();
      if (touch.current?.id === e.pointerId) touch.current = null;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  });
  const touch = useRef<{ x: number; y: number; t: number; id: number } | null>(null);
  const onPageSwipe = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "touch" || (e.target as HTMLElement).closest("button, input, textarea, a, .s3d, .bk-frag.is-over, math-field")) return;
    touch.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
  }, []);
  const edgeDown = (dir: 1 | -1) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const x = e.clientX;
    const id = e.pointerId;
    const moved = { v: false };
    const mv = (ev: PointerEvent) => {
      if (ev.pointerId !== id || moved.v) return;
      if (Math.abs(ev.clientX - x) > 5) {
        moved.v = true;
        beginDrag(dir, x, false, id);
        moveDrag(ev.clientX);
      }
    };
    const upOnce = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", upOnce);
      if (!moved.v) request(dir);
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", upOnce);
  };
  // two fingers sideways on a trackpad turn like a drag; the page never navigates away (Safari needs the handler)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let acc = 0;
    let t = 0;
    let dir: 1 | -1 | 0 = 0;
    const on = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 1) return;
      if ((e.target as HTMLElement).closest(".bk-frag.is-over, .bk-facing, .table-wrap")) return;
      e.preventDefault();
      acc += -e.deltaX;
      if (!dir && Math.abs(acc) > 8) {
        dir = acc > 0 ? 1 : -1;
        const book = el.querySelector<HTMLElement>(".bk-spread")?.getBoundingClientRect();
        const x0 = book ? (single ? book.left : dir === 1 ? book.left : book.right) : 0;
        if (beginDrag(dir, x0, true, -7)) drag.current!.x0 = x0;
        else dir = 0;
      }
      const d = drag.current;
      if (d && d.id === -7) {
        d.lastX = d.x0 + acc;
        moveDrag(d.x0 + acc);
      }
      clearTimeout(t);
      t = window.setTimeout(() => {
        if (drag.current?.id === -7) endDrag();
        acc = 0;
        dir = 0;
      }, 120);
    };
    el.addEventListener("wheel", on, { passive: false });
    return () => {
      el.removeEventListener("wheel", on);
      clearTimeout(t);
    };
  });

  /* ---- keys (B2 §2.6): ← forward, → back, as in a Hebrew book; never while typing ---- */
  useEffect(() => {
    const typing = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el?.closest?.("input, textarea, select, [contenteditable='true'], [contenteditable=''], math-field, .reading-pop, .composer-wrap");
    };
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
      const onButton = !!(e.target as HTMLElement)?.closest?.("button, a, summary");
      const k = e.key;
      if (k === "ArrowRight" && e.shiftKey) {
        if (!e.repeat && !single && curRef.current >= 2) setPeek(curRef.current - 2);
        e.preventDefault();
        return;
      }
      if (k === "ArrowLeft" || k === "PageDown" || (k === " " && !e.shiftKey && !onButton)) {
        e.preventDefault();
        request(1, { fast: e.repeat });
      } else if (k === "ArrowRight" || k === "PageUp" || (k === " " && e.shiftKey && !onButton)) {
        e.preventDefault();
        request(-1, { fast: e.repeat });
      } else if (k === "Home") {
        e.preventDefault();
        jump(0);
      } else if (k === "End") {
        e.preventDefault();
        jump(n - 1);
      } else if (k === "Backspace" && back.current.length) {
        e.preventDefault();
        goBack();
      } else if (k === "Escape" && (tocOpen || facing)) {
        if (tocOpen) setTocOpen(false);
        else closeFacing();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key === "ArrowRight") setPeek(null);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  });

  /* ---- the facing page (rule 3: one thing at a time) ---- */
  const facingHost = useRef<HTMLDivElement>(null);
  const consultHost = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<BookCard[]>([]);
  const openFacing = useCallback(
    (f: Facing, atPage?: number) => {
      const p = atPage ?? curRef.current;
      if (g?.spread) {
        // the facing page of the paragraph: the other page of its spread; the text stays where it was
        setSlotSide(p % 2 === 0 ? "l" : "r");
      }
      setFacing(f);
      setCur(Math.max(0, Math.min(p, n - 1)));
    },
    [g, n],
  );
  const closeFacing = useCallback(() => {
    setFacing(null);
    setScene(null);
    if (bridge.active) {
      bridge.active = null;
      bridge.host = null;
      bridge.emit();
    }
  }, [bridge]);
  // the bridge to the consultation cards
  useEffect(() => {
    bridge.galley = () => galley.current;
    bridge.twin = (el) => {
      const frag = el.closest<HTMLElement>(".bk-frag");
      if (!frag) return el.closest(".bk-gc") ? el : null;
      const key = frag.dataset.chunk;
      const prose = frag.querySelector(":scope > .prose");
      if (!prose || !key) return null;
      let top: Element | null = el;
      while (top && top.parentElement !== prose) top = top.parentElement;
      const k = top ? [...prose.children].indexOf(top) : 0;
      const gc = galley.current?.querySelector<HTMLElement>(`:scope > .bk-gc[data-key="${CSS.escape(key)}"] > .prose`);
      return (gc?.children[Math.max(0, k)] as HTMLElement | undefined) ?? null;
    };
    bridge.blockAtTop = () => {
      const p = pages[visibleRef.current[0]];
      const f = p?.frags.find((x) => chunks[x.i] && chunks[x.i].kind !== "title" && chunks[x.i].kind !== "h2" && chunks[x.i].kind !== "h3");
      if (!f) return null;
      const gc = galley.current?.querySelector<HTMLElement>(`:scope > .bk-gc[data-key="${CSS.escape(chunks[f.i].key)}"] > .prose`);
      if (!gc) return null;
      // the block of the chunk that shows at the top of this window
      for (const el of gc.children) if ((el as HTMLElement).offsetTop + (el as HTMLElement).offsetHeight > f.from) return el as HTMLElement;
      return (gc.firstElementChild as HTMLElement) ?? null;
    };
    bridge.setCards = setCards;
    bridge.openCard = (id, block) => {
      if (!id) {
        if (facingRef.current?.kind === "consult") closeFacing();
        return;
      }
      const gc = block?.closest<HTMLElement>(".bk-gc");
      const i = gc ? Number(gc.dataset.i) : -1;
      let p = curRef.current;
      if (i >= 0) {
        const off = block ? block.offsetTop : 0;
        const at = pageOf(pagesRef.current, i, off);
        // the facing page of a paragraph in view; one out of view brings its page
        p = visibleRef.current.includes(at) ? at : at;
      }
      bridge.active = id;
      openFacing({ kind: "consult" }, p);
      bridge.emit();
    };
  });
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const facingRef = useRef(facing);
  facingRef.current = facing;
  // the card's host is the facing page's body, once it is drawn
  useLayoutEffect(() => {
    const host = facing?.kind === "consult" ? consultHost.current : null;
    if (bridge.host !== host) {
      bridge.host = host;
      bridge.emit();
    }
  });

  const lift = useCallback((lang: string, code: string) => {
    setScene({ lang, code, big: false });
    openFacing({ kind: "scene", lang, code });
  }, [openFacing]);
  const pageCtx = useMemo<BookCtxValue>(() => ({ mode: "page", lift }), [lift]);

  // A live block (scene, simulator, animation) opens by itself when its page is read, on the facing page or
  // large (Aa: plateAuto), and closes by itself when the page is turned away. Never on a phone (the facing page
  // would cover the text), never over a consultation or the notebook, and not again once the reader closed it.
  const autoPlate = useRef<string | null>(null);
  const dismissedPlates = useRef(new Set<string>());
  useEffect(() => {
    if (r.plateAuto === "off" || !g || phone || !spread) return;
    // the spread being read: both its pages count as "in view", also while the facing page shows only one of them
    const s0 = cur - (cur % 2);
    const inSpread = [s0, s0 + 1].filter((p) => p < n);
    const onView = inSpread.flatMap((p) => (pages[p]?.frags ?? []).map((f) => ({ p, c: chunks[f.i] }))).filter((x) => x.c && x.c.kind === "fence" && PLATES.has(x.c.lang ?? ""));
    const mine = autoPlate.current;
    if (mine && !onView.some((x) => x.c.key === mine)) {
      autoPlate.current = null;
      if (facingRef.current?.kind === "scene") {
        setFacing(null);
        setScene(null);
      }
      return;
    }
    if (facingRef.current) return;
    if (mine) {
      // opened by us, then closed by the reader while its spread is still read: not again
      dismissedPlates.current.add(mine);
      autoPlate.current = null;
      return;
    }
    const next = onView.find((x) => !dismissedPlates.current.has(x.c.key));
    if (!next || next.c.open) return;
    // only once the reader stays on the spread (not while riffling through pages)
    const t = setTimeout(() => {
      if (facingRef.current) return;
      const code = next.c.text.replace(/^\s*```[^\n]*\n/, "").replace(/\n?```\s*$/, "");
      autoPlate.current = next.c.key;
      setScene({ lang: next.c.lang!, code, big: r.plateAuto === "big" });
      // the text keeps the spread's first page, so nothing before the scene is skipped; the next turn shows its second page
      openFacing({ kind: "scene", lang: next.c.lang!, code }, s0);
    }, 700);
    return () => clearTimeout(t);
  }, [cur, pages, chunks, facing, r.plateAuto, g, phone, spread, n, openFacing]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- what each page shows around its text ---- */
  const heads = useMemo(() => {
    const out: { level: 2 | 3; text: string; page: number; i: number; kind?: string; module?: string }[] = [];
    chunks.forEach((c, i) => {
      if ((c.kind === "h2" || c.kind === "h3") && c.head) {
        const g = sectionOfSource(guide, c.text);
        out.push({ level: c.kind === "h2" ? 2 : 3, text: c.head, page: pageOf(pages, i), i, kind: g?.kind, module: g?.module });
      }
    });
    return out;
  }, [chunks, pages, guide]);
  const sectionAt = (p: number) => {
    let t = "";
    for (const h of heads) if (h.level === 2 && h.page <= p) t = h.text;
    return t;
  };
  const runheadOf = (p: number) => (p % 2 === 0 ? (header ? `${header.code.split("·")[0].trim()} · ${header.title}` : "") : sectionAt(p) || header?.title || "");
  const wordsLeft = useMemo(() => {
    const per = chunks.map((c) => words(c.text));
    return (p: number) => {
      const lastShown = Math.max(p, p + (single ? 0 : 1));
      let w = 0;
      for (let q = lastShown + 1; q < pages.length; q++) for (const f of pages[q].frags) if (boxes[f.i]?.h) w += per[f.i] * ((f.to - f.from) / boxes[f.i].h);
      return Math.round(w);
    };
  }, [chunks, pages, boxes, single]);
  const minutesLeft = Math.round(wordsLeft(cur) / 150);

  // margin notes: each page draws the notes whose quote it shows; numbered through the lesson
  const notes = props.notes;
  const noteOrder = useMemo(() => {
    const order = new Map<string, number>();
    if (!notes?.length) return order;
    const pos = notes
      .filter((x) => x.id && x.anchor)
      .map((x) => {
        const i = chunks.findIndex((c) => c.text.includes(x.anchor!.slice(0, 40)));
        return { id: x.id!, i: i < 0 ? 1e9 : i, ts: x.ts };
      })
      .sort((a, b) => a.i - b.i || a.ts - b.ts);
    pos.forEach((x, k) => order.set(x.id, k + 1));
    return order;
  }, [notes, chunks]);
  const numberOf = useCallback((id: string) => noteOrder.get(id) ?? 0, [noteOrder]);

  // the closed tabs of consultation cards, at the height of their paragraph
  const cardPlaces = useMemo(() => {
    const out = new Map<number, { card: BookCard; top: number }[]>();
    const gal = galley.current;
    if (!gal || !cards.length) return out;
    for (const card of cards) {
      if (card.id === bridge.active && facing?.kind === "consult") continue;
      let found: { i: number; off: number } | null = null;
      for (const gc of gal.querySelectorAll<HTMLElement>(":scope > .bk-gc")) {
        const prose = gc.firstElementChild;
        if (!prose) continue;
        for (const el of prose.children) {
          if ((el.textContent ?? "").replace(/\s+/g, " ").includes(card.anchor.slice(0, 50))) {
            found = { i: Number(gc.dataset.i), off: (el as HTMLElement).offsetTop };
            break;
          }
        }
        if (found) break;
      }
      if (!found) continue;
      const p = pageOf(pages, found.i, found.off);
      const f = pages[p]?.frags.find((x) => x.i === found!.i);
      const top = f ? Math.max(0, Math.min(f.top + Math.max(0, found.off - f.from), (g?.cap ?? 600) - 30)) : 0;
      const list = out.get(p) ?? [];
      list.push({ card, top: top + list.length * 30 });
      out.set(p, list);
    }
    return out;
  }, [cards, pages, facing, mtick]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- context for the blocks on pages ---- */
  const mdCtx = useMemo<MdContextValue>(() => ({ live: false, idPrefix: "bk", openSource: props.onOpenSource }), [props.onOpenSource]);
  const liveCtx = useMemo<MdContextValue>(() => ({ live: true, idPrefix: "bk", openSource: props.onOpenSource }), [props.onOpenSource]);
  const galleyCtx = useMemo<MdContextValue>(() => ({ live: false, idPrefix: "bkg", openSource: () => {} }), []);
  const galleyLiveCtx = useMemo<MdContextValue>(() => ({ live: true, idPrefix: "bkg", openSource: () => {} }), []);
  const cover = useRef<HTMLDivElement>(null);

  /* ---- the stacks ---- */
  const total = Math.max(1, n);
  const shownLast = Math.max(...visible, 0);
  const leftLeaves = n ? Math.round(9 * Math.max(0, total - 1 - shownLast) / total) : 0;
  const rightLeaves = n ? Math.round(9 * Math.max(0, cur) / total) : 0;
  const edge = (k: number, sideSign: number) => Array.from({ length: k }, (_, j) => `${sideSign * (j + 1)}px ${j + 1}px 0 -0.5px var(--bk-edge-${j % 2 ? "b" : "a"})`).join(", ") || "none";
  const white = live ? 3 : 0;
  const markPage = maxSeen;
  const sections = heads.filter((h) => h.level === 2);

  const writing = props.writing;
  const focus = r.focus === "on";
  if (!g) return <div className="bk-root" ref={rootRef} style={{ ["--bk-fs" as string]: undefined }} />;

  const pageNodes: ReactNode[] = [];
  for (const [p, role] of [...roles.entries()].sort((a, b) => a[0] - b[0])) {
    if (p === -1) continue;
    pageNodes.push(
      <PageView
        key={p}
        p={p}
        page={pages[p]}
        role={role}
        chunks={chunks}
        header={header}
        runhead={runheadOf(p)}
        folio={p + 2}
        g={g}
        live={live}
        tail={p === n - 1}
        mdCtx={mdCtx}
        liveCtx={liveCtx}
        onContinue={props.onContinue}
        end={props.end}
        setEl={setEl}
        notes={notes}
        onNoteSave={props.onNoteSave}
        onNoteDelete={props.onNoteDelete}
        numberOf={numberOf}
        cardsHere={cardPlaces.get(p) ?? []}
        onCard={(id) => {
          bridge.active = id;
          openFacing({ kind: "consult" }, p);
          bridge.emit();
        }}
        onPageSwipe={onPageSwipe}
      />,
    );
  }
  const bookW = single && !(slot && spread) ? g.pw : g.pw * 2;
  const folioText = n ? (single ? `${cur + 2}` : `${cur + 2}–${Math.min(cur + 3, n + 1)}`) : "";

  return (
    <div
      className={`bk-root ${phone ? "is-phone" : ""} ${single ? "is-single" : "is-spread"} ${slot ? `has-facing facing-${slotSide}` : ""} ${focus ? "is-focus" : ""} ${opening ? "is-opening" : ""}`}
      ref={rootRef}
      style={{ ["--bk-pw" as string]: `${g.pw}px`, ["--bk-ph" as string]: `${g.ph}px`, ["--bk-lu" as string]: `${g.lu}px`, ["--bk-W" as string]: `${g.W}px`, ["--bk-in" as string]: `${g.inner}px`, ["--bk-out" as string]: `${g.outer}px`, ["--bk-head" as string]: `${g.head}px`, ["--bk-cap" as string]: `${g.cap}px` }}
    >
      {props.notices && <div className="bk-notices">{props.notices}</div>}
      <div className="bk-desk">
        <div className="bk-stage" style={{ width: bookW, height: g.ph, perspective: `${Math.round(bookW * 2.2)}px` }}>
          <div className="bk-cover-edge" aria-hidden />
          {!opening && (
            <>
              <div className="bk-stack is-l" style={{ boxShadow: edge(leftLeaves + white, -1) }} aria-hidden data-white={white || undefined} />
              {!(single && !slot) && <div className="bk-stack is-r" style={{ boxShadow: edge(rightLeaves, 1) }} aria-hidden />}
            </>
          )}
          <div className="bk-spread" style={{ width: bookW, height: g.ph }}>
            <BookCtx.Provider value={pageCtx}>{pageNodes}</BookCtx.Provider>
            {anim?.opening && (
              <div className="bk-page bk-cover side-l is-shown is-turn-a origin-r" ref={cover} style={{ zIndex: 6 }}>
                <div className="bk-cover-face">
                  <span className="bk-cover-lab">{document.documentElement.dataset.lab === "eng" ? "גילואה" : "לנצ'סטר"}</span>
                  <span className="bk-cover-title">{header?.title}</span>
                  <span className="bk-cover-code" dir="ltr">
                    {header?.code}
                  </span>
                </div>
                <div className="bk-shade" aria-hidden />
              </div>
            )}
            {anim?.style === "riffle" &&
              [0, 1, 2, 3].map((k) => (
                <div key={k} className={`bk-ghost ${anim.dir === 1 ? "side-l origin-r" : "side-r origin-l"}`} ref={(el) => void (ghosts.current[k] = el)} aria-hidden />
              ))}
            {slot && (
              <section className={`bk-facing side-${phone ? "sheet" : spread ? slotSide : "s"}`} ref={facingHost} aria-label="העמוד שמול">
                <header className="bk-facing-head">
                  <span className="bk-facing-kind">{facing?.kind === "consult" ? "התייעצות" : facing?.kind === "pad" ? "מחברת" : facing?.kind === "ask" ? "שאל את המורה" : "בעמוד שמול"}</span>
                  {spread && (
                    <button className="bk-facing-btn" onClick={() => setSlotSide(slotSide === "l" ? "r" : "l")} title="החלף צד: הטקסט יעבור לעמוד השני" data-silent>
                      <Icon name="side" size={14} />
                      <span>החלף צד</span>
                    </button>
                  )}
                  {facing?.kind === "scene" && spread && (
                    <button className="bk-facing-btn" onClick={() => setScene((s) => (s ? { ...s, big: !s.big } : s))} data-silent>
                      <Icon name="expand" size={14} />
                      <span>{scene?.big ? "חזרה לעמוד" : "הגדל לפריסה"}</span>
                    </button>
                  )}
                  <button className="icon-btn bk-facing-x" onClick={closeFacing} aria-label="סגור את העמוד שמול" title="סגור (Esc)">
                    <Icon name="close" size={15} />
                  </button>
                </header>
                <div className="bk-facing-body">
                  {facing?.kind === "consult" && <div className="bk-consult-host" ref={consultHost} />}
                  {facing?.kind === "pad" && props.notebook?.(closeFacing)}
                  {facing?.kind === "ask" && props.composer && (
                    <div className="bk-ask-facing">
                      {props.thread && <AskThread live={props.writing}>{props.thread}</AskThread>}
                      {props.composer}
                    </div>
                  )}
                  {facing?.kind === "scene" && (
                    <MdContext.Provider value={mdCtx}>
                      <div className="prose bk-scene">
                        <Markdown text={"```" + facing.lang + "\n" + facing.code + "\n```"} />
                      </div>
                    </MdContext.Provider>
                  )}
                </div>
              </section>
            )}
            {scene?.big && facing?.kind === "scene" && (
              <div className="bk-scene-big">
                <MdContext.Provider value={mdCtx}>
                  <div className="prose bk-scene">
                    <Markdown text={"```" + scene.lang + "\n" + scene.code + "\n```"} />
                  </div>
                </MdContext.Provider>
                <button className="btn small bk-scene-back" onClick={() => setScene({ ...scene, big: false })}>
                  חזרה לעמוד
                </button>
              </div>
            )}
            {!chunks.some((c) => c.kind !== "title" && c.kind !== "end") && props.wait && !slot && (
              <div className={`bk-wait ${single ? "side-s" : "side-l"}`}>{props.wait}</div>
            )}
            <div className="bk-spine" aria-hidden />
          </div>
          {/* the stack's edges: grab them to turn (or click); the corner too */}
          {!phone && !opening && (
            <>
              <div className="bk-edge is-l" onPointerDown={edgeDown(1)} title="הדף הבא (←)" aria-hidden />
              {(!single || slot) && <div className="bk-edge is-r" onPointerDown={edgeDown(-1)} title="הדף הקודם (→)" aria-hidden />}
            </>
          )}
          {/* thumb tabs: a tab for every section on the fore-edge; read ones on the right stack, the rest on the left */}
          {!focus && !phone && sections.length > 1 && !opening && (
            <nav className="bk-tabs" aria-label="סעיפי השיעור">
              {sections.map((s, k) => {
                const read = s.page <= cur + (single ? 0 : 1) && !(s.page > cur);
                const here = sectionAt(Math.max(...visible)) === s.text;
                return (
                  <button
                    key={s.i}
                    className={`bk-tab ${read && s.page < cur ? "on-r" : "on-l"} ${here ? "is-here" : ""}`}
                    style={{ top: 92 + k * Math.min(36, (g.ph - 130) / sections.length) }}
                    onClick={() => jump(s.page)}
                    title={`${k + 1}. ${s.text} · עמ' ${s.page + 2}`}
                    data-silent
                  >
                    {k + 1}
                  </button>
                );
              })}
            </nav>
          )}
          {/* the ribbon: where reading got to; out of view, it hangs from the stack and brings you back */}
          {!opening && n > 0 && (
            <button
              className={`bk-ribbon ${markPage > Math.max(...visible) ? "is-ahead" : markPage < cur ? "is-behind" : "is-here"}`}
              onClick={() => (markPage > Math.max(...visible) || markPage < cur ? jump(markPage) : setTocOpen((o) => !o))}
              title={markPage > Math.max(...visible) || markPage < cur ? `חזרה למקום שאליו הגעת (עמ' ${markPage + 2})` : "תוכן השיעור"}
              aria-label="סימנייה"
              data-silent
            />
          )}
        </div>
        {resumed && (
          <div className="bk-chip" role="status">
            <span>חזרנו למקום שבו הפסקת לקרוא</span>
            <button className="link" onClick={() => (jump(0, false), setResumed(false))}>
              לראש השיעור
            </button>
            <button className="icon-btn" onClick={() => setResumed(false)} aria-label="סגור">
              <Icon name="close" size={13} />
            </button>
          </div>
        )}
        {backPill && !resumed && (
          <button className="bk-chip bk-back" onClick={goBack} title="חזרה למקום שלפני הקפיצה (Backspace)">
            ↩ חזרה לעמ' {backPill.to + 2}
          </button>
        )}
      </div>

      {/* the bar on the desk, under the book */}
      <div className="bk-bar" role="toolbar" aria-label="הספר">
        <div className="bk-bar-start">
          <button className={`bk-btn bk-toc-btn ${tocOpen ? "is-on" : ""}`} onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen} title="תוכן השיעור" data-silent>
            <Icon name="coverage" size={15} />
            <span className="bk-toc-now">{sectionAt(cur) || "תוכן השיעור"}</span>
            {minutesLeft > 1 && !phone && <span className="bk-toc-left">· עוד כ-{minutesLeft} דק'</span>}
          </button>
        </div>
        <div className="bk-bar-mid">
          <button className="bk-btn bk-nav" onClick={() => request(-1)} disabled={cur <= 0} aria-label="הדף הקודם" title="הדף הקודם (→)" data-silent>
            <Icon name="prev" size={16} />
          </button>
          <button className="bk-btn bk-folio-btn" onClick={() => setTocOpen((o) => !o)} title="מעבר לעמוד" data-silent>
            <span dir="ltr">{folioText}</span>
            <span className="bk-of"> / {n + 1}</span>
          </button>
          <button className="bk-btn bk-nav" onClick={() => request(1)} disabled={cur >= n - (single ? 1 : 2) || !n} aria-label="הדף הבא" title="הדף הבא (←)" data-silent>
            <Icon name="next" size={16} />
          </button>
        </div>
        <div className="bk-bar-end">
          {writing && (
            <span className="bk-writing">
              <span className="bk-writing-dot" aria-hidden />
              {phone ? "נכתב" : "השיעור נכתב"}
              {props.onStop && (
                <button className="link" onClick={props.onStop}>
                  עצור
                </button>
              )}
            </span>
          )}
          {props.onAddNote && (
            <button className="bk-btn" onPointerDown={(e) => e.preventDefault()} onClick={() => props.onAddNote!(anchorHere())} title="שלוף פתק לשוליים, ליד הטקסט המסומן או הפסקה שבראש העמוד">
              <span className="dock-pad-stack" aria-hidden="true" />
              {!phone && <span>פתק</span>}
            </button>
          )}
          <button className="bk-btn" onClick={() => bridge.askTop()} title="שאלה על הפסקה שבראש העמוד. אפשר גם לסמן טקסט בשיעור.">
            <Icon name="think" size={15} />
            {!phone && <span>שאלה</span>}
          </button>
          {props.notebook && (
            <button className={`bk-btn ${facing?.kind === "pad" ? "is-on" : ""}`} onClick={() => (facing?.kind === "pad" ? closeFacing() : openFacing({ kind: "pad" }))} title="מחברת: שרטוטים ופתרונות לשיעור הזה, בעמוד שמול">
              <Icon name="exercise" size={15} />
              {!phone && <span>מחברת</span>}
            </button>
          )}
          {!phone && (
            <button className={`bk-btn ${r.noise !== "off" ? "is-on" : ""}`} onClick={() => setReading({ noise: r.noise === "off" ? r.noiseKind : "off" })} aria-pressed={r.noise !== "off"} title="רעש רקע לריכוז">
              <span className="dock-noise-wave" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          )}
          <button className={`bk-btn ${focus ? "is-on" : ""}`} onClick={() => setReading({ focus: focus ? "off" : "on" })} aria-pressed={focus} title={focus ? "יציאה ממצב ריכוז" : "מצב ריכוז: רק הספר"}>
            <Icon name={focus ? "close" : "expand"} size={15} />
          </button>
          {props.composer && (
            <button
              className={`bk-btn bk-ask-btn ${askOpen || facing?.kind === "ask" ? "is-on" : ""}`}
              onClick={() => {
                // on a spread the box opens on the facing page, beside the text it answers (a quiz's questions stay in view);
                // on a phone or a narrow window it rises from the bottom
                if (spread && !phone) return facing?.kind === "ask" ? closeFacing() : openFacing({ kind: "ask" });
                setAskOpen((o) => !o);
              }}
              aria-expanded={askOpen || facing?.kind === "ask"}
            >
              <Icon name="send" size={14} />
              {!phone && <span>שאל את המורה</span>}
            </button>
          )}
        </div>
      </div>

      {tocOpen && (
        <Toc
          heads={heads}
          cur={cur}
          visible={visible}
          n={n}
          minutes={minutesLeft}
          onGo={(p) => {
            setTocOpen(false);
            jump(p);
          }}
          onClose={() => setTocOpen(false)}
        />
      )}
      {props.composer && askOpen && <div className="bk-ask">{props.composer}</div>}

      {/* the galley: every block drawn once at the column's width, measured, never seen */}
      <div className="bk-galley" ref={galley} style={{ width: g.W }} aria-hidden inert>
        <BookCtx.Provider value={MEASURE_CTX}>
          {chunks.map((c, i) =>
            c.kind === "end" ? null : (
              <div key={c.key} className={`bk-gc ${chunkClass(c, chunks[i - 1])}`} data-i={i} data-key={c.key}>
                <MdContext.Provider value={c.open && live ? galleyLiveCtx : galleyCtx}>
                  <div className="prose bk-text">
                    <ChunkBody c={c} header={header} measuring />
                  </div>
                </MdContext.Provider>
              </div>
            ),
          )}
        </BookCtx.Provider>
      </div>
      <div className="bk-galley" ref={altGalley} style={{ width: g.W }} aria-hidden inert>
        <BookCtx.Provider value={pageCtx}>
          {chunks.map((c, i) =>
            c.kind === "fence" && INTERACTIVE.has(c.lang ?? "") ? (
              <div key={c.key} className={`bk-gc-alt ${chunkClass(c, chunks[i - 1])}`} data-key={c.key}>
                <MdContext.Provider value={c.open && live ? galleyLiveCtx : galleyCtx}>
                  <div className="prose bk-text">
                    <ChunkBody c={c} measuring />
                  </div>
                </MdContext.Provider>
              </div>
            ) : null,
          )}
        </BookCtx.Provider>
      </div>
    </div>
  );

  function anchorHere(): string {
    const root = rootRef.current;
    const sel = window.getSelection();
    const picked = sel && !sel.isCollapsed && sel.anchorNode && root?.querySelector(".bk-spread")?.contains(sel.anchorNode) ? sel.toString() : "";
    if (picked.trim() && !picked.includes("\n")) return picked.trim().slice(0, 160);
    // the first paragraph of the page being read
    for (const p of visible) {
      const el = els.current.get(p);
      if (!el) continue;
      const body = el.querySelector(".bk-body")!.getBoundingClientRect();
      for (const para of el.querySelectorAll<HTMLElement>(".bk-frag .prose p, .bk-frag .prose li")) {
        const rr = para.getBoundingClientRect();
        const t = (para.textContent ?? "").trim();
        if (rr.top >= body.top - 2 && rr.top < body.bottom - 20 && t.length > 20) return t.slice(0, 80);
      }
    }
    return "";
  }
}

/* ------------------------------------------------------------------ contents ------------------------------------------------------------------ */

function Toc({ heads, cur, visible, n, minutes, onGo, onClose }: { heads: { level: 2 | 3; text: string; page: number; kind?: string; module?: string }[]; cur: number; visible: number[]; n: number; minutes: number; onGo: (p: number) => void; onClose: () => void }) {
  const [page, setPage] = useState("");
  useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest?.(".bk-toc, .bk-toc-btn, .bk-folio-btn, .bk-ribbon")) onClose();
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [onClose]);
  const last = Math.max(...visible);
  let here = -1;
  heads.forEach((h, k) => {
    if (h.page <= last) here = k;
  });
  return (
    <aside className="bk-toc" aria-label="תוכן השיעור">
      <header className="bk-toc-head">
        <span>תוכן השיעור</span>
        <button className="icon-btn" onClick={onClose} aria-label="סגור">
          <Icon name="close" size={14} />
        </button>
      </header>
      {heads.length ? (
        <ol className="bk-toc-list">
          {heads.map((h, k) => (
            <li key={k} className={`lvl-${h.level}`}>
              <button className={k === here ? "is-here" : ""} aria-current={k === here ? "location" : undefined} onClick={() => onGo(h.page)}>
                <span className="bk-toc-t">
                  <GuideDot kind={h.kind} module={h.module} />
                  {h.text}
                </span>
                <span className="bk-toc-p">{h.page + 2}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="bk-toc-empty">הכותרות יופיעו כאן כשייכתבו.</p>
      )}
      <form
        className="bk-toc-go"
        onSubmit={(e) => {
          e.preventDefault();
          const p = Number(page) - 2;
          if (Number.isFinite(p)) onGo(Math.max(0, Math.min(n - 1, p)));
        }}
      >
        <label>
          מעבר לעמוד
          <input inputMode="numeric" dir="ltr" value={page} onChange={(e) => setPage(e.target.value.replace(/\D/g, ""))} placeholder={String(cur + 2)} aria-label="מספר עמוד" />
        </label>
        <button className="btn small">עבור</button>
        {minutes > 1 && <span className="bk-toc-min">עוד כ-{minutes} דקות קריאה</span>}
      </form>
    </aside>
  );
}

/** The chat on the facing page: opens at the last question, so its answer reads from the top; a new question
 *  scrolls into view, and the answer being written is followed only while the reader stays at the bottom. */
function AskThread({ children, live }: { children: ReactNode; live?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(false);
  const asked = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const qs = el.querySelectorAll<HTMLElement>(".msg-user");
    if (qs.length !== asked.current) {
      asked.current = qs.length;
      const q = qs[qs.length - 1];
      if (q) el.scrollTop = q.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 8;
      return;
    }
    if (stick.current) el.scrollTop = el.scrollHeight;
  });
  return (
    <div
      className={`bk-ask-thread ${live ? "is-live" : ""}`}
      ref={ref}
      onScroll={() => {
        const el = ref.current!;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
    >
      {children}
    </div>
  );
}
