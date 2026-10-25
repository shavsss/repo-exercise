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
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
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

/**
 * Floating aids at the bottom corner of a lesson: the lesson's headings with the one being
 * read marked, the reading time left, and the focus switch.
 */
export function ReadingDock({
  scrollRef,
  version,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  version: unknown;
}) {
  const r = useReading();
  const [open, setOpen] = useState(false);
  const [heads, setHeads] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [current, setCurrent] = useState("");
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const list = [
      ...el.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]"),
    ].map((h) => ({
      id: h.id,
      text: h.textContent ?? "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setHeads(list);
  }, [scrollRef, version, open]);
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
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  const clean = (t: string) => t.replace(/[*_`$]/g, "");
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
                  document
                    .getElementById(h.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
