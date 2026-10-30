import { useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "./Icon";
import { setReading, useReading } from "../reading";

// Aids for reading a long lesson: a progress line, the place where reading stopped
// (kept per conversation in this browser), and a floating table of contents with the
// current section marked.

const POS_KEY = "reading-pos";

function readPositions(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(POS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Thin line under the top bar: how much of the page has been read. */
export function ReadingProgress({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const on = () => {
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 40 ? Math.min(1, el.scrollTop / max) : 0);
    };
    on();
    el.addEventListener("scroll", on, { passive: true });
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", on);
      ro.disconnect();
    };
  }, [scrollRef]);
  return (
    <div className="read-progress" aria-hidden>
      <i style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

/**
 * Remembers where reading stopped in a conversation, and returns there when it is
 * opened again. `key` names the lesson; `ready` is true once its messages are on screen.
 */
export function useResumePosition(scrollRef: RefObject<HTMLDivElement | null>, key: string | null, ready: boolean, writing: boolean) {
  const [resumed, setResumed] = useState(false);
  const restored = useRef<string | null>(null);
  // a lesson being written here and now is read from where it is; nothing to return to
  if (writing && key) restored.current = key;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !key || !ready || restored.current === key) return;
    restored.current = key;
    const at = readPositions()[key];
    if (at && at > 300) {
      // wait a frame for the lesson to lay out
      requestAnimationFrame(() => requestAnimationFrame(() => el.scrollTo({ top: at })));
      setResumed(true);
    } else setResumed(false);
  }, [scrollRef, key, ready]);
  useEffect(() => {
    if (!resumed) return;
    const t = setTimeout(() => setResumed(false), 7000);
    return () => clearTimeout(t);
  }, [resumed]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !key) return;
    let t = 0;
    const on = () => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        const all = readPositions();
        all[key] = Math.round(el.scrollTop);
        const keys = Object.keys(all);
        if (keys.length > 300) delete all[keys[0]];
        try {
          localStorage.setItem(POS_KEY, JSON.stringify(all));
        } catch {
          // not remembered
        }
      }, 400);
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", on);
    };
  }, [scrollRef, key]);
  return {
    resumed,
    dismiss: () => setResumed(false),
    toTop: () => (
      scrollRef.current?.scrollTo({ top: 0, behavior: glide() }),
      setResumed(false)
    ),
  };
}

/** Minutes of reading left below the current position, at a calm pace for dense text. */
function minutesLeft(el: HTMLElement) {
  const words = (el.querySelector(".col")?.textContent ?? "").split(
    /\s+/,
  ).length;
  const max = el.scrollHeight - el.clientHeight;
  const left = max > 0 ? 1 - el.scrollTop / max : 0;
  return Math.round((words * left) / 150);
}

type Head = { id: string; text: string; level: number };
const clean = (t: string) => t.replace(/[*_`$]/g, "");
/** a glide, unless the viewer asked the system for less motion */
export const glide = (): ScrollBehavior => (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
export const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: glide(), block: "start" });

/** The lesson's headings, the one being read, and the reading time left below it. */
export function useHeadings(scrollRef: RefObject<HTMLDivElement | null>, version: unknown) {
  const [heads, setHeads] = useState<Head[]>([]);
  const [current, setCurrent] = useState("");
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setHeads(
      [...el.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]")].map((h) => ({ id: h.id, text: clean(h.textContent ?? ""), level: h.tagName === "H2" ? 2 : 3 })),
    );
  }, [scrollRef, version]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // at the end of the page the last headings cannot reach the top; take what is in view
        const atEnd = el.scrollHeight - el.clientHeight - el.scrollTop < 4;
        const top = atEnd ? el.getBoundingClientRect().bottom - 60 : el.getBoundingClientRect().top + 90;
        let cur = "";
        for (const h of heads) {
          const n = document.getElementById(h.id);
          if (n && n.getBoundingClientRect().top <= top) cur = h.id;
        }
        setCurrent(cur);
        setLeft(minutesLeft(el));
      });
    };
    on();
    el.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", on);
    };
  }, [scrollRef, heads, version]);
  return { heads, current, left };
}

const TOC_KEY = "lesson-toc";
/** Whether the lesson-contents panel is open; kept in this browser. */
export function useTocPanel() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(TOC_KEY) !== "closed";
    } catch {
      return true;
    }
  });
  const set = (o: boolean) => {
    setOpen(o);
    try {
      localStorage.setItem(TOC_KEY, o ? "open" : "closed");
    } catch {
      // for this visit only
    }
  };
  return [open, set] as const;
}

/**
 * The lesson's contents in a drawer over the left of the page, so the text stays centred and the
 * margin notes keep their place: every heading, the one being read marked, and the reading time
 * left. Escape or a click outside closes it. Folds to a narrow rail.
 */
export function LessonToc({ scrollRef, version, open, setOpen }: { scrollRef: RefObject<HTMLDivElement | null>; version: unknown; open: boolean; setOpen: (o: boolean) => void }) {
  const { heads, current, left } = useHeadings(scrollRef, version);
  const close = useRef(setOpen);
  close.current = setOpen;
  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !(e.target as HTMLElement).closest?.(".lesson-toc, .left-rail")) close.current(false);
    };
    document.addEventListener("keydown", away);
    document.addEventListener("pointerdown", away);
    return () => {
      document.removeEventListener("keydown", away);
      document.removeEventListener("pointerdown", away);
    };
  }, [open]);
  if (!open)
    return (
      <button className="toc-rail" onClick={() => setOpen(true)} aria-label="פתח את תוכן השיעור" title="פתח את תוכן השיעור">
        <Icon name="coverage" size={16} />
        <span>תוכן השיעור</span>
      </button>
    );
  return (
    <aside className="lesson-toc" aria-label="תוכן השיעור">
      <header className="lesson-toc-head">
        <span>תוכן השיעור</span>
        <button className="icon-btn" onClick={() => setOpen(false)} aria-label="סגור את תוכן השיעור" title="סגור">
          <Icon name="close" size={15} />
        </button>
      </header>
      {heads.length ? (
        <nav className="lesson-toc-list">
          {heads.map((h) => (
            <button key={h.id} className={`lvl-${h.level} ${h.id === current ? "is-current" : ""}`} aria-current={h.id === current ? "location" : undefined} onClick={() => goTo(h.id)}>
              {h.text}
            </button>
          ))}
        </nav>
      ) : (
        <p className="lesson-toc-empty">הכותרות של השיעור יופיעו כאן כשייכתב.</p>
      )}
      {left > 1 && <footer className="lesson-toc-foot">עוד כ-{left} דקות קריאה</footer>}
    </aside>
  );
}

/**
 * Floating aids at the bottom corner of a lesson: the focus switch, and on narrow screens
 * (or with the contents panel closed) the headings with the one being read marked.
 */
export function ReadingDock({ scrollRef, version, onPad, onNotebook }: { scrollRef: RefObject<HTMLDivElement | null>; version: unknown; onPad?: () => void; onNotebook?: () => void }) {
  const r = useReading();
  const [open, setOpen] = useState(false);
  const { heads, current, left } = useHeadings(scrollRef, version);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  const now = heads.find((h) => h.id === current);
  const focus = r.focus === "on";
  return (
    <div className="reading-dock">
      <div className="dock-inner">
        {open && heads.length > 1 && (
          <nav className="mini-toc-list" aria-label="תוכן השיעור">
            {heads.map((h) => (
              <button
                key={h.id}
                className={`lvl-${h.level} ${h.id === current ? "is-current" : ""}`}
                onClick={() => {
                  goTo(h.id);
                  setOpen(false);
                }}
              >
                {clean(h.text)}
              </button>
            ))}
          </nav>
        )}
        <div className="dock-row">
          {heads.length > 1 && (
            <button
              className="mini-toc-btn"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              title="תוכן השיעור"
            >
              <Icon name="coverage" size={15} />
              <span className="mini-toc-now">
                {now ? clean(now.text) : "תוכן השיעור"}
              </span>
              {left > 1 && (
                <span className="mini-toc-left">· עוד כ-{left} דק'</span>
              )}
            </button>
          )}
          {onPad && (
            <button className="dock-pad" onPointerDown={(e) => e.preventDefault()} onClick={onPad} title="שלוף פתק לשוליים, ליד הטקסט המסומן או הפסקה שבראש המסך">
              <span className="dock-pad-stack" aria-hidden="true" />
              <span>פתק</span>
            </button>
          )}
          {onNotebook && (
            <button className="dock-notebook" onClick={onNotebook} title="מחברת: שרטוטים ופתרונות לשיעור הזה">
              <Icon name="exercise" size={15} />
              <span>מחברת</span>
            </button>
          )}
          <button
            className={`dock-noise ${r.noise !== "off" ? "is-on" : ""}`}
            onClick={() => setReading({ noise: r.noise === "off" ? r.noiseKind : "off" })}
            aria-pressed={r.noise !== "off"}
            title={r.noise === "off" ? "רעש רקע לריכוז (הסוג והעוצמה בהגדרות Aa)" : "כיבוי רעש הרקע"}
          >
            <span className="dock-noise-wave" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>רעש רקע</span>
          </button>
          <button
            className={`dock-focus ${focus ? "is-on" : ""}`}
            onClick={() => setReading({ focus: focus ? "off" : "on" })}
            aria-pressed={focus}
            title={focus ? "יציאה ממצב ריכוז" : "מצב ריכוז: רק הטקסט"}
          >
            <Icon name={focus ? "close" : "expand"} size={15} />
            <span>{focus ? "יציאה מריכוז" : "ריכוז"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
