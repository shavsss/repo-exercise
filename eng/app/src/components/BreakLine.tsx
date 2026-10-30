import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useReading } from "../reading";
import { holdNoise } from "../sound";
import { breakDue, declineBreak, endBreak, minutesSinceBreak, snoozeBreak, takeBreak } from "../day";
import "../flow.css";

// A break, offered quietly (docs/research/round5/ux/F2_cognitive_session.md, M2/M3 and the anti-nag rules N1–N8):
// never by a timer in the middle of a paragraph, only at a boundary (the reader enters a new section of the lesson,
// or reaches the end of the text), and only after `breakAfter` minutes of reading (default 75, in the Aa settings,
// where it can also be turned off). One line, no sound, no pop-up: "הפסקה" or "עוד חלק אחד". After "one more part":
// quiet until the next boundary and at least 30 minutes; after three, quiet for the rest of the day. The break itself
// is a calm screen whose clock counts up; the background room fades out and comes back on "חזרתי" (the day sound).
// Identical in both labs.

function since(min: number) {
  if (min < 60) return `${min} דקות`;
  if (min < 90) return "יותר משעה";
  if (min < 120) return "כשעה וחצי";
  return `${Math.floor(min / 60)} שעות`;
}
const clean = (s: string) => s.replace(/[*_`$#]/g, "").trim();

interface Boundary {
  label: string;
  next?: string;
}

export function BreakLine({
  scrollRef,
  busy,
  nextTitle,
  onBreak,
  prefetching,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  busy: boolean;
  nextTitle?: string;
  onBreak: () => void;
  prefetching?: string;
}) {
  const r = useReading();
  const [line, setLine] = useState<Boundary | null>(null);
  const [onBreakAt, setOnBreakAt] = useState(0);
  const [waiting, setWaiting] = useState<string | undefined>();
  const [held, setHeld] = useState(false);
  const section = useRef(-1);
  const shownAt = useRef(0);
  const settings = useRef(r);
  settings.current = r;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let t = 0;
    const check = () => {
      t = 0;
      const heads = [...el.querySelectorAll<HTMLElement>(".msg-assistant .prose h2")];
      const top = el.getBoundingClientRect().top + el.clientHeight * 0.3;
      let idx = -1;
      heads.forEach((h, i) => h.getBoundingClientRect().top < top && (idx = i));
      const entered = idx > section.current && section.current >= 0;
      const prev = section.current;
      section.current = idx;
      const atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      // a shown line steps aside quietly once the reader has gone on well past it
      if (shownAt.current && Math.abs(el.scrollTop - shownAt.current) > el.clientHeight * 1.5) {
        shownAt.current = 0;
        snoozeBreak();
        setLine(null);
      }
      if (settings.current.breaks === "off" || !breakDue(Number(settings.current.breakAfter) || 75)) return;
      let b: Boundary | null = null;
      if (entered) b = { label: `סוף הסעיף «${clean(heads[prev]?.textContent ?? "")}»`, next: `«${clean(heads[idx].textContent ?? "")}»` };
      else if (atEnd && !busy && el.scrollHeight > el.clientHeight * 1.5) b = { label: "סוף השיעור", next: nextTitle };
      if (!b) return;
      setLine((cur) => {
        if (cur) return cur;
        shownAt.current = el.scrollTop || 1;
        return b;
      });
    };
    const onScroll = () => {
      if (!t) t = window.setTimeout(check, 250);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, [scrollRef, busy, nextTitle]);

  // the break's clock counts up, once a minute
  const [, tick] = useState(0);
  useEffect(() => {
    if (!onBreakAt) return;
    const i = window.setInterval(() => tick((n) => n + 1), 30_000);
    return () => window.clearInterval(i);
  }, [onBreakAt]);
  // leaving the lesson ends a break that is still open
  useEffect(() => () => void (onBreakAt && (endBreak(), holdNoise(false))), [onBreakAt]);

  const startBreak = () => {
    setWaiting(line?.next);
    setLine(null);
    shownAt.current = 0;
    takeBreak();
    holdNoise(true);
    setOnBreakAt(Date.now());
    onBreak();
  };
  const back = () => {
    endBreak();
    holdNoise(false);
    setOnBreakAt(0);
  };

  if (onBreakAt) {
    const min = Math.floor((Date.now() - onBreakAt) / 60_000);
    return createPortal(
      <div className="flow-break" role="dialog" aria-label="הפסקה">
        <div className="flow-break-in">
          <div className="flow-break-clock">
            הפסקה · {min < 1 ? "התחילה עכשיו" : min === 1 ? "דקה אחת" : `${min} דקות`}
            {waiting ? ` · ${waiting} מחכה` : ""}
          </div>
          <p className="flow-break-main">לקום, להסתכל רחוק, מים.</p>
          <p className="flow-break-sub">חמש הדקות הראשונות בלי טלפון. אחר כך מה שתרצה.</p>
          {prefetching && <p className="flow-break-sub">בינתיים נכתב {prefetching}.</p>}
          <button className="btn primary" onClick={back} autoFocus>
            חזרתי
          </button>
        </div>
      </div>,
      document.body,
    );
  }
  if (held)
    return (
      <div className="flow-line is-quiet" role="status">
        לא אציע שוב לפני הגבול הבא.
      </div>
    );
  if (!line) return null;
  const min = minutesSinceBreak();
  return (
    <div className="flow-line" role="status">
      <div className="flow-line-text">
        <b>{line.label}</b>
        <span className="flow-sep">·</span>
        <span title={`${min} דקות`}>{since(min)} מההפסקה האחרונה</span>
        {line.next && (
          <>
            <span className="flow-sep">·</span>
            <span>אחרי ההפסקה: {line.next}</span>
          </>
        )}
      </div>
      <div className="flow-line-actions">
        <button className="btn small" onClick={startBreak}>
          הפסקה
        </button>
        <button
          className="btn small quiet"
          onClick={() => {
            declineBreak();
            setLine(null);
            shownAt.current = 0;
            setHeld(true);
            window.setTimeout(() => setHeld(false), 4000);
          }}
        >
          עוד חלק אחד
        </button>
      </div>
    </div>
  );
}
