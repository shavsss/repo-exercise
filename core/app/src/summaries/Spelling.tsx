// Spelling and word completion on the summaries page, in place of the browser's own checker (which
// marks every name and technical term in red). Unknown words get a soft wavy underline through the CSS
// Custom Highlight API, so the page's DOM is never touched; a click on one opens corrections, "add to
// dictionary" (kept in the profile, for every device) and "ignore". While typing, the likeliest ending
// of the word shows faintly after the caret, and Tab takes it. Identical in both labs.
import { useEffect, useRef, useState } from "react";
import { HEB_WORD, Speller, loadDict, normalize } from "./speller";

type Ghost = { left: number; top: number; h: number; font: string; rest: string; options: string[]; typed: string };
type Pop = { left: number; top: number; word: string; range: Range; options: string[] };

const SCOPE = ".sm-page .sm-rich";
const SKIP = "span.im, [contenteditable='false'], code";

function editableOf(n: Node | null) {
  const el = n ? (n.nodeType === 1 ? (n as Element) : n.parentElement) : null;
  return el?.closest<HTMLElement>(SCOPE) ?? null;
}

/** The Hebrew word that ends at the caret, when the caret sits at the end of a word. */
function wordAtCaret(): { node: Text; start: number; end: number; word: string } | null {
  const sel = window.getSelection();
  if (!sel || !sel.isCollapsed || !sel.anchorNode || sel.anchorNode.nodeType !== 3) return null;
  const node = sel.anchorNode as Text;
  if (!editableOf(node) || node.parentElement?.closest(SKIP)) return null;
  const text = node.data;
  const end = sel.anchorOffset;
  if (/[א-ת]/.test(text[end] ?? "")) return null;
  const m = /[א-ת]+(?:["'׳״][א-ת]*)?$/.exec(text.slice(0, end));
  return m ? { node, start: end - m[0].length, end, word: m[0] } : null;
}

function caretRect(): DOMRect | null {
  const sel = window.getSelection();
  if (!sel?.rangeCount) return null;
  const r = sel.getRangeAt(0).cloneRange();
  const rects = r.getClientRects();
  if (rects.length) return rects[0];
  // at the end of a text node a collapsed range has no box: measure the letter before it
  if (r.startContainer.nodeType === 3 && r.startOffset > 0) {
    r.setStart(r.startContainer, r.startOffset - 1);
    const b = r.getClientRects();
    if (b.length) {
      const last = b[b.length - 1];
      return new DOMRect(last.left, last.top, 0, last.height);
    }
  }
  return null;
}

/** Puts `text` in place of `range`, through the editor's own input path (undo and saving work as for typing). */
function replace(range: Range, text: string) {
  const host = editableOf(range.startContainer);
  host?.focus();
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  document.execCommand("insertText", false, text);
}

export function Spelling({ load, save }: { load: () => Promise<string[]>; save: (words: string[]) => void }) {
  const [sp, setSp] = useState<Speller | null>(null);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [pop, setPop] = useState<Pop | null>(null);
  const flagged = useRef<Range[]>([]);
  const seen = useRef(new Map<string, number>());
  const ignored = useRef(new Set<string>());
  const lastInput = useRef(0);
  const ghostRef = useRef<Ghost | null>(null);
  ghostRef.current = ghost;

  useEffect(() => {
    let live = true;
    Promise.all([loadDict(), load().catch(() => [])]).then(([d, mine]) => {
      if (live && d) setSp(new Speller(d, new Set(mine)));
    });
    return () => {
      live = false;
    };
  }, [load]);

  /* ---- underlining the unknown words ---- */
  useEffect(() => {
    if (!sp) return;
    const reg = (globalThis as { CSS?: { highlights?: Map<string, unknown> } }).CSS?.highlights;
    const H = (globalThis as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    let timer = 0;
    const check = () => {
      const typing = Date.now() - lastInput.current < 1500 ? wordAtCaret() : null;
      const ranges: Range[] = [];
      const counts = new Map<string, number>();
      for (const root of document.querySelectorAll<HTMLElement>(SCOPE)) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
          if (n.parentElement?.closest(SKIP)) continue;
          for (const m of n.data.matchAll(HEB_WORD)) {
            const w = normalize(m[0]);
            counts.set(w, (counts.get(w) ?? 0) + 1);
            if (sp.known(w) || ignored.current.has(w)) continue;
            const at = m.index!;
            if (typing && typing.node === n && typing.start === at) continue; // still being written
            const r = document.createRange();
            r.setStart(n, at);
            r.setEnd(n, at + m[0].length);
            ranges.push(r);
          }
        }
      }
      seen.current = counts;
      flagged.current = ranges;
      if (reg && H) {
        if (ranges.length) reg.set("sm-spell", new H(...ranges));
        else reg.delete("sm-spell");
      }
    };
    const soon = () => {
      clearTimeout(timer);
      timer = window.setTimeout(check, 400);
    };
    const mo = new MutationObserver(soon);
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    document.addEventListener("selectionchange", soon);
    check();
    return () => {
      mo.disconnect();
      document.removeEventListener("selectionchange", soon);
      clearTimeout(timer);
      reg?.delete("sm-spell");
    };
  }, [sp]);

  /* ---- completion while typing, Tab to take it ---- */
  useEffect(() => {
    if (!sp) return;
    const onInput = (e: Event) => {
      if (!editableOf(e.target as Node)) return;
      lastInput.current = Date.now();
      setPop(null);
      const at = wordAtCaret();
      const options = at ? sp.complete(at.word, seen.current) : [];
      const rect = options.length ? caretRect() : null;
      if (!at || !rect) return setGhost(null);
      const cs = getComputedStyle(at.node.parentElement!);
      // the page may be zoomed (CSS zoom): the boxes are in screen pixels, the font size is not
      const page = at.node.parentElement!.closest<HTMLElement>(".sm-page");
      const zoom = parseFloat(page ? getComputedStyle(page).zoom : "1") || 1;
      setGhost({
        left: rect.left,
        top: rect.top,
        h: rect.height,
        font: `${cs.fontWeight} ${parseFloat(cs.fontSize) * zoom}px ${cs.fontFamily}`,
        rest: options[0].slice(normalize(at.word).length),
        options,
        typed: at.word,
      });
    };
    const take = (word: string) => {
      const at = wordAtCaret();
      if (!at) return setGhost(null);
      const r = document.createRange();
      r.setStart(at.node, at.start);
      r.setEnd(at.node, at.end);
      replace(r, word);
      setGhost(null);
    };
    const onKey = (e: KeyboardEvent) => {
      const g = ghostRef.current;
      if (!g) return;
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        take(g.options[0]);
      } else if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setGhost(null);
      }
    };
    const onSel = () => {
      const g = ghostRef.current;
      if (g && wordAtCaret()?.word !== g.typed) setGhost(null);
    };
    (window as unknown as { __smTake?: (w: string) => void }).__smTake = take;
    document.addEventListener("input", onInput, true);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("selectionchange", onSel);
    window.addEventListener("scroll", onSel, true);
    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("selectionchange", onSel);
      window.removeEventListener("scroll", onSel, true);
    };
  }, [sp]);

  /* ---- a click on an underlined word: corrections ---- */
  useEffect(() => {
    if (!sp) return;
    const open = (e: MouseEvent) => {
      if (!editableOf(e.target as Node)) return false;
      const doc = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null };
      const at = doc.caretRangeFromPoint?.(e.clientX, e.clientY);
      if (!at) return false;
      const hit = flagged.current.find((r) => r.isPointInRange(at.startContainer, at.startOffset) && r.toString());
      if (!hit) return false;
      const box = hit.getBoundingClientRect();
      const word = normalize(hit.toString());
      setGhost(null);
      setPop({ left: box.left + box.width / 2, top: box.bottom + 4, word, range: hit, options: sp.suggest(word) });
      return true;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.(".sm-spell-pop")) return;
      if (!open(e)) setPop(null);
    };
    const onMenu = (e: MouseEvent) => {
      if (open(e)) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPop(null);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onMenu, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("contextmenu", onMenu, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [sp]);

  const recheck = () => document.dispatchEvent(new Event("selectionchange"));

  return (
    <>
      {ghost && (
        <div className="sm-ghost" style={{ right: window.innerWidth - ghost.left, top: ghost.top, height: ghost.h, lineHeight: `${ghost.h}px`, font: ghost.font }} aria-hidden>
          <span className="sm-ghost-rest">{ghost.rest}</span>
          <span className="sm-ghost-tab">Tab</span>
          {ghost.options.length > 1 && (
            <span className="sm-ghost-more">
              {ghost.options.slice(1).map((o) => (
                <button
                  key={o}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    (window as unknown as { __smTake?: (w: string) => void }).__smTake?.(o);
                  }}
                >
                  {o}
                </button>
              ))}
            </span>
          )}
        </div>
      )}
      {pop && (
        <div className="sm-spell-pop" style={{ left: pop.left, top: pop.top }} onMouseDown={(e) => e.preventDefault()} role="menu" aria-label={`תיקון: ${pop.word}`}>
          {pop.options.length ? (
            pop.options.map((o) => (
              <button
                key={o}
                className="sm-spell-opt"
                onClick={() => {
                  replace(pop.range, o);
                  setPop(null);
                }}
              >
                {o}
              </button>
            ))
          ) : (
            <span className="sm-spell-none">אין הצעות</span>
          )}
          <div className="sm-spell-acts">
            <button
              onClick={() => {
                if (sp) {
                  sp.mine.add(pop.word);
                  save([...sp.mine]);
                }
                setPop(null);
                recheck();
              }}
            >
              הוסף למילון
            </button>
            <button
              onClick={() => {
                ignored.current.add(pop.word);
                setPop(null);
                recheck();
              }}
            >
              התעלם
            </button>
          </div>
        </div>
      )}
    </>
  );
}
