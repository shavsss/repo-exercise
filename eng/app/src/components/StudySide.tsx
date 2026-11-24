// The side column of the scrolling lesson (24.11, the learner's choice): beside the text, never over it, the
// consultation, the glossary (Glossary.tsx) and the notebook, one at a time under three tabs. On a wide screen a question about a paragraph
// opens its card here (the consultation's bridge, book/context.ts, the same one the book's facing page uses),
// the paragraph that has cards is marked in the text, and the column lists every card of the lesson; a click on
// one brings its paragraph (and its sitting) into view. On a narrow screen the cards stay under their
// paragraphs and the notebook opens over the page, as before. The lesson's contents stay a drawer. Folded, the
// column is a narrow rail. Identical in both labs.
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { Icon } from "./Icon";
import { LessonToc } from "./ReadingAids";
import { blockAtTop, findBlock } from "./Consult";
import { revealSitting } from "../sittings";
import type { BookBridge, BookCard } from "../book/context";
import "../side.css";

export type SideTab = "" | "toc" | "pad" | "consult" | "gloss";

/** True while the window is at least `px` wide. */
export function useWide(px: number) {
  const q = `(min-width: ${px}px)`;
  return useSyncExternalStore(
    (f) => {
      const m = window.matchMedia(q);
      m.addEventListener("change", f);
      return () => m.removeEventListener("change", f);
    },
    () => window.matchMedia(q).matches,
  );
}

/** Below this width the column would squeeze the text: the cards stay under their paragraphs. */
export const SIDE_MIN = 1100;

export function StudySide({
  tab,
  setTab,
  bridge,
  scrollRef,
  version,
  pad,
  glossary,
}: {
  tab: SideTab;
  setTab: (t: SideTab) => void;
  /** the consultation's bridge; null on a narrow screen, where the cards stay in the text */
  bridge: BookBridge | null;
  scrollRef: RefObject<HTMLDivElement | null>;
  /** changes with the lesson's text, so the marks find their paragraphs again */
  version: unknown;
  /** the notebook, drawn bare: the column gives it its tab and its close */
  pad: (close: () => void) => ReactNode;
  /** the glossary's list */
  glossary: ReactNode;
}) {
  const [cards, setCards] = useState<BookCard[]>([]);
  useSyncExternalStore(bridge?.subscribe ?? noSub, bridge?.version ?? zero);
  const host = useRef<HTMLDivElement>(null);
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const setTabRef = useRef(setTab);
  setTabRef.current = setTab;

  // the bridge: the whole lesson is in the page, and the open card is drawn in this column
  useEffect(() => {
    if (!bridge) return;
    bridge.galley = () => scrollRef.current;
    bridge.twin = (el) => el;
    bridge.blockAtTop = () => (scrollRef.current ? blockAtTop(scrollRef.current) : null);
    bridge.setCards = setCards;
    bridge.openCard = (id) => {
      bridge.active = id;
      if (id && tabRef.current !== "consult") setTabRef.current("consult");
      bridge.emit();
    };
    return () => {
      bridge.active = null;
      bridge.host = null;
    };
  }, [bridge, scrollRef]);
  useLayoutEffect(() => {
    if (!bridge) return;
    const h = tab === "consult" ? host.current : null;
    if (bridge.host !== h) {
      bridge.host = h;
      bridge.emit();
    }
  });

  // the paragraphs that have cards, marked in the text; the open card's paragraph more
  const active = bridge?.active ?? null;
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !bridge) return;
    const marked: HTMLElement[] = [];
    for (const c of cards) {
      const b = findBlock(root, c.anchor);
      if (!b) continue;
      b.classList.add("has-consult");
      if (c.id === active) b.classList.add("is-consulting");
      marked.push(b);
    }
    return () => marked.forEach((b) => b.classList.remove("has-consult", "is-consulting"));
  }, [cards, active, bridge, scrollRef, version]);

  const show = (c: BookCard) => {
    if (!bridge) return;
    bridge.active = c.id;
    bridge.emit();
    const b = scrollRef.current && findBlock(scrollRef.current, c.anchor);
    if (b) {
      revealSitting(b);
      b.scrollIntoView({ block: "center" });
    }
  };

  if (tab === "toc") return <LessonToc scrollRef={scrollRef} version={version} open setOpen={(o) => !o && setTab("")} />;

  if (tab === "pad" || tab === "gloss" || (tab === "consult" && bridge))
    return (
      <aside className="study-side" aria-label="לצד השיעור">
        <header className="side-tabs" role="tablist">
          {bridge && (
            <button role="tab" aria-selected={tab === "consult"} className="side-tab" onClick={() => setTab("consult")}>
              <Icon name="think" size={15} />
              התייעצות
              {cards.length > 0 && <b className="side-n">{cards.length}</b>}
            </button>
          )}
          <button role="tab" aria-selected={tab === "gloss"} className="side-tab" onClick={() => setTab("gloss")}>
            <Icon name="book" size={15} />
            מילון
          </button>
          <button role="tab" aria-selected={tab === "pad"} className="side-tab" onClick={() => setTab("pad")}>
            <Icon name="exercise" size={15} />
            מחברת
          </button>
          <button className="icon-btn side-x" onClick={() => setTab("")} aria-label="סגור את העמודה" title="סגור">
            <Icon name="close" size={14} />
          </button>
        </header>
        {tab === "pad" ? (
          pad(() => setTab(""))
        ) : tab === "gloss" ? (
          glossary
        ) : (
          <div className="side-consult">
            <div ref={host} className="side-card" />
            {!active && (
              <div className="side-empty">
                <button className="btn side-ask" onClick={() => bridge?.askTop()}>
                  <Icon name="think" size={15} /> שאלה על הפסקה שבראש המסך
                </button>
                <p>או סמן מילים בשיעור ובחר "הסבר פשוט", "למה?", "דוגמה" או "בדוק אותי".</p>
              </div>
            )}
            {cards.length > 0 && (
              <nav className="side-list" aria-label="השאלות בשיעור הזה">
                <div className="side-list-head">השאלות בשיעור הזה</div>
                <ol>
                  {cards.map((c) => (
                    <li key={c.id}>
                      <button className={c.id === active ? "is-on" : ""} aria-current={c.id === active ? "true" : undefined} onClick={() => show(c)}>
                        <span className="side-kind">{c.label}</span>
                        <span className="side-title">{c.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        )}
      </aside>
    );

  return (
    <div className="left-rail" role="tablist" aria-label="לוחות משמאל לשיעור">
      <button className="left-rail-btn is-toc" onClick={() => setTab("toc")} title="תוכן השיעור">
        <Icon name="coverage" size={16} />
        <span>תוכן השיעור</span>
      </button>
      {bridge && (
        <button className="left-rail-btn" onClick={() => setTab("consult")} title="התייעצות: שאלות על פסקאות בשיעור">
          <Icon name="think" size={16} />
          <span>התייעצות{cards.length ? ` · ${cards.length}` : ""}</span>
        </button>
      )}
      <button className="left-rail-btn" onClick={() => setTab("gloss")} title="מילון: המונחים שהוגדרו בשיעורים">
        <Icon name="book" size={16} />
        <span>מילון</span>
      </button>
      <button className="left-rail-btn" onClick={() => setTab("pad")} title="מחברת: שרטוטים ופתרונות לשיעור הזה">
        <Icon name="exercise" size={16} />
        <span>מחברת</span>
      </button>
    </div>
  );
}

const noSub = () => () => {};
const zero = () => 0;
