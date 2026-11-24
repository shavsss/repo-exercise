// The lesson in sittings (sittings.ts): in the scrolling column, one sub-topic at a time. Above it, the strip of
// the lesson's sittings (read, here, ahead, and the part still closed behind a practice question), whose segments
// open a sitting; below it, the way on. Every sitting stays in the page, hidden, so the contents, the margin notes,
// the consultation cards and a search find their paragraphs; a jump to a hidden one shows it first
// (revealSitting). Each sitting is its own `.prose` right under the lesson's <article>, where the consultation
// looks for paragraphs. Identical in both labs.
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { flushSync } from "react-dom";
import { Markdown } from "./Markdown";
import "../sittings.css";
import { Icon } from "./Icon";
import { loadPlace, minutesOf, savePlace, setSittingMid, sittingMid, subscribeMid, type Sitting, type SittingPlace } from "../sittings";

/** True while the sitting on screen is not the lesson's last: what follows the lesson waits for the end. */
export const useSittingMid = () => useSyncExternalStore(subscribeMid, sittingMid);

/** a heading as plain text (no Markdown or TeX marks) */
const clean = (t = "") => t.replace(/[*_`$\\]/g, "");

export function LessonSittings({
  sittings,
  closed,
  storeKey,
  article,
  lead,
  onPlace,
}: {
  sittings: Sitting[];
  /** the sittings still closed behind a practice question, shown locked */
  closed: Sitting[];
  /** where the place in this lesson is kept */
  storeKey: string;
  article: RefObject<HTMLElement | null>;
  /** drawn at the top of the first sitting (the writer's activity) */
  lead?: ReactNode;
  /** the sitting on screen, for what is laid out around it (the margin notes) */
  onPlace?: (cur: number) => void;
}) {
  const n = sittings.length;
  const [place, setPlace] = useState<SittingPlace>(() => loadPlace(storeKey));
  const cur = Math.min(place.cur, n - 1);
  const read = new Set(place.read);
  const s = sittings[cur];
  const gated = closed.length > 0;
  const all = n + closed.length;
  const strip = useRef<HTMLElement>(null);
  const end = useRef<HTMLDivElement>(null);

  // another lesson in the same turn component: its own place
  const keyRef = useRef(storeKey);
  if (keyRef.current !== storeKey) {
    keyRef.current = storeKey;
    setPlace(loadPlace(storeKey));
  }
  const update = (f: (p: SittingPlace) => SittingPlace) =>
    setPlace((p) => {
      const next = f(p);
      savePlace(storeKey, next);
      return next;
    });

  useEffect(() => {
    setSittingMid(cur < n - 1 || gated);
    onPlace?.(cur);
  }, [cur, n, gated, onPlace]);
  useEffect(() => () => setSittingMid(false), []);

  // a jump to a heading or paragraph in a hidden sitting (the contents, the section dots)
  useEffect(() => {
    const el = article.current;
    if (!el) return;
    const on = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (Number.isInteger(i)) flushSync(() => update((p) => ({ ...p, cur: i })));
    };
    el.addEventListener("sitting:show", on);
    return () => el.removeEventListener("sitting:show", on);
  });

  // reaching the end of a sitting is reading it
  useEffect(() => {
    const el = end.current;
    if (!el || read.has(cur)) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((x) => x.isIntersecting)) update((p) => (p.read.includes(cur) ? p : { ...p, read: [...p.read, cur].sort((a, b) => a - b) }));
    });
    io.observe(el);
    return () => io.disconnect();
  });

  // a new sitting starts at its top
  const moved = useRef(false);
  useLayoutEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    strip.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [cur]);
  const go = (i: number) => {
    if (i < 0 || i >= n || i === cur) return;
    moved.current = true;
    update((p) => ({ cur: i, read: i > p.cur && !p.read.includes(p.cur) ? [...p.read, p.cur].sort((a, b) => a - b) : p.read }));
  };

  const leftWords = sittings.reduce((a, x, i) => a + (read.has(i) ? 0 : x.words), 0) + closed.reduce((a, x) => a + x.words, 0);
  const next = sittings[cur + 1];
  const prev = sittings[cur - 1];

  return (
    <>
      <nav className="sit-strip no-copy" ref={strip} aria-label="הישיבות של השיעור">
        <div className="sit-now">
          <span className="sit-count" aria-label={`ישיבה ${cur + 1} מתוך ${all}`}>
            ישיבה <b>{cur + 1}</b> / {all}
          </span>
          <span className="sit-title">{clean(s.title)}</span>
          <span className="sit-min">כ-{minutesOf(s.words)} דק'</span>
        </div>
        <ol className="sit-bar">
          {sittings.map((x, i) => (
            <li key={i} style={{ flexGrow: Math.max(1, x.words) }} className={`${x.opensChapter && i ? "opens" : ""}`}>
              <button
                className={`sit-seg ${i === cur ? "is-here" : read.has(i) ? "is-read" : ""}`}
                aria-current={i === cur ? "step" : undefined}
                aria-label={`ישיבה ${i + 1}: ${clean(x.title)}, כ-${minutesOf(x.words)} דקות${read.has(i) ? ", נקראה" : ""}`}
                title={`${clean(x.title)} · כ-${minutesOf(x.words)} דק'${read.has(i) ? " · נקראה" : ""}`}
                onClick={() => go(i)}
              />
            </li>
          ))}
          {closed.map((x, i) => (
            <li key={`c${i}`} style={{ flexGrow: Math.max(1, x.words) }} className={x.opensChapter ? "opens" : ""}>
              <span className="sit-seg is-closed" title={`${clean(x.title)} · נפתח אחרי שאלת התרגול`} />
            </li>
          ))}
        </ol>
        <div className="sit-sum">
          {read.size ? `נקראו ${read.size} מתוך ${all}` : `${all} ישיבות`}
          {leftWords > 0 ? ` · עוד כ-${minutesOf(leftWords)} דקות` : ""}
          {gated && <span className="sit-lock"> · <Icon name="lock" size={11} /> {closed.length} נפתחות אחרי שאלות התרגול</span>}
        </div>
      </nav>

      {!s.opensChapter && s.chapter && <div className="sit-kicker">{clean(s.chapter)}</div>}

      {sittings.map((x, i) => (
        <div key={i} className="prose" data-sitting={i} data-words={x.words} hidden={i !== cur}>
          {i === 0 && lead}
          <Markdown text={x.text} figBase={x.figBase} />
        </div>
      ))}

      <div className="sit-end no-copy" ref={end}>
        {next ? (
          <>
            <div className="sit-end-label">
              <Icon name="check" size={14} /> סוף הישיבה: {clean(s.title)}
            </div>
            <button className="sit-next" onClick={() => go(cur + 1)}>
              <span className="sit-next-k">{next.opensChapter && next.chapter ? clean(next.chapter) : "הישיבה הבאה"}</span>
              <span className="sit-next-t">{clean(next.title)}</span>
              <span className="sit-next-m">כ-{minutesOf(next.words)} דק'</span>
              <Icon name="next" size={18} />
            </button>
          </>
        ) : (
          // a closed rest is announced by the lesson's own line under its practice question
          !gated && (
            <div className="sit-end-label">
              <Icon name="check" size={14} /> סוף השיעור
            </div>
          )
        )}
        {prev && (
          <button className="link sit-prev" onClick={() => go(cur - 1)}>
            <Icon name="prev" size={14} /> חזרה ל{clean(prev.title)}
          </button>
        )}
      </div>
    </>
  );
}
