import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Runtime } from "../runtime";
import type { ModuleProgress } from "../types";
import { closeDay, dayTitle, gatherRecall, useDay, type DayStop } from "../day";
import { holdNoise, play } from "../sound";
import "../flow.css";

// "סגור את היום" (docs/research/round5/ux, r5-close, r5-stamp; proto_day.html#close, proto_reading.html §3): a button
// the app never suggests. On press he may write tomorrow's first step (optional, nothing pre-filled), and the day
// is saved: where he stopped and two questions for the morning card. Then the stamp, the signature moment, plays
// in full once a day (Lanchester: a stamp on the day's sheet; Gilua: the drawing's dashed frame turns solid and the
// title block is signed), with a soft thud and the falling chord while the room fades. The next lesson starts
// being written meanwhile (prefetch). The day's clock is never shown. Identical in both labs.

type Phase = "idle" | "form" | "saving" | "stamped";

function Stamp({ lab, animate, date }: { lab: "core" | "eng"; animate: boolean; date: string }) {
  if (lab === "eng")
    return (
      <>
        <svg className={`flow-stamp-svg eng frame ${animate ? "go" : "still"}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect className="bp" x="1" y="1" width="98" height="98" fill="none" vectorEffect="non-scaling-stroke" />
          <rect className="bp-fill" x="1" y="1" width="98" height="98" fill="none" pathLength={300} vectorEffect="non-scaling-stroke" />
        </svg>
        <svg className={`flow-stamp-svg eng tb ${animate ? "go" : "still"}`} viewBox="0 0 120 32" aria-hidden="true">
          <rect x="1" y="1" width="118" height="30" fill="none" />
          <line x1="1" y1="16" x2="119" y2="16" />
          <line x1="60" y1="1" x2="60" y2="31" />
          <text x="90" y="12">
            תאריך
          </text>
          <text x="30" y="12">
            נבדק
          </text>
          <text className="ini" x="90" y="27">
            {date}
          </text>
          <text className="ini" x="30" y="27">
            ✓
          </text>
        </svg>
      </>
    );
  return (
    <svg className={`flow-stamp-svg core ${animate ? "go" : "still"}`} viewBox="0 0 120 120" aria-hidden="true">
      <g className="stamp">
        <circle cx="60" cy="60" r="44" fill="none" strokeWidth="3" />
        <circle cx="60" cy="60" r="36" fill="none" strokeWidth="1.2" />
        <text x="60" y="60" className="st-main">
          נסגר
        </text>
        <text x="60" y="80" className="st-date">
          {date}
        </text>
      </g>
      <circle className="ink" cx="60" cy="60" r="50" fill="none" strokeWidth="6" />
    </svg>
  );
}

export function CloseDay({
  rt,
  mods,
  stop,
  ahead,
  onClosed,
  variant,
}: {
  rt: Runtime | null;
  mods: Record<string, ModuleProgress>;
  stop: DayStop | null;
  /** the lesson that would be written ahead, for one line that says so */
  ahead: () => { idx: number; title: string } | null;
  onClosed: () => void;
  variant: "home" | "lesson";
}) {
  const { doc } = useDay();
  const [phase, setPhase] = useState<Phase>("idle");
  const [next, setNext] = useState("");
  const [full, setFull] = useState(false);
  const [writing, setWriting] = useState<{ idx: number; title: string } | null>(null);
  const lab = document.documentElement.dataset.lab === "eng" ? "eng" : "core";
  const now = new Date();
  const date = `${now.getDate()}.${now.getMonth() + 1}`;

  useEffect(() => {
    if (phase === "idle") return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && phase !== "saving" && finish();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finish = () => {
    if (phase === "stamped") holdNoise(false);
    setPhase("idle");
  };

  const submit = async () => {
    setPhase("saving");
    const recall = rt?.store ? await Promise.race([gatherRecall(rt.store, mods).catch(() => []), new Promise<[]>((r) => setTimeout(() => r([]), 6000))]) : [];
    const first = await closeDay({ next, stop, recall }).catch(() => true);
    setFull(first);
    setWriting(ahead());
    setPhase("stamped");
    if (first) window.setTimeout(() => play("stamp"), 600);
    else play("close");
    holdNoise(true);
    onClosed();
  };

  const seen = (doc.seen ?? []).slice(-6);
  return (
    <>
      <button className={`btn small quiet flow-close-btn is-${variant}`} onClick={() => setPhase("form")}>
        סגור את היום
      </button>
      {phase !== "idle" &&
        createPortal(
          <div className="flow-overlay" onClick={(e) => e.target === e.currentTarget && phase !== "saving" && finish()}>
            <div className="flow-close" role="dialog" aria-label="סגירת היום">
              <div className="flow-close-sheet">
                {phase === "stamped" && <Stamp lab={lab} animate={full} date={date} />}
                <span className="flow-kicker">{dayTitle(now)}</span>
                <h2 className="flow-close-title">היום</h2>
                {seen.length > 0 && (
                  <ul className="flow-facts">
                    {seen.map((s) => (
                      <li key={`${s.moduleId}:${s.lesson}`}>
                        <span className="flow-tag">נלמד</span>
                        <span>
                          {s.moduleId} · {s.lesson < 0 ? "מבחן מסכם" : `שיעור ${s.lesson + 1}`}
                          {s.title ? `: ${s.title}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {stop && (
                  <p className="flow-close-stop">
                    <span className="flow-tag">עצרת ב-</span>
                    <span>{stop.label}</span>
                  </p>
                )}
                {phase === "stamped" ? (
                  <div className="flow-close-done" role="status">
                    {next.trim() ? <q>{next.trim()}</q> : null}
                    <p>{next.trim() ? "נשמר. מחר: שתי שאלות, ואז הצעד הזה." : "נשמר. מחר: איפה עצרת, ושתי שאלות."}</p>
                    {writing && (
                      <p className="flow-hint">
                        שיעור {writing.idx + 1}
                        {writing.title ? `, «${writing.title}»,` : ""} נכתב עכשיו, כל עוד הלשונית פתוחה.
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flow-field">
                    <span>הצעד הראשון של מחר</span>
                    <input
                      type="text"
                      value={next}
                      onChange={(e) => setNext(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && phase === "form" && submit()}
                      placeholder="משפט אחד: מה ואיפה (אפשר להשאיר ריק)"
                      autoFocus
                      maxLength={300}
                    />
                  </label>
                )}
              </div>
              <div className="flow-close-actions">
                {phase === "stamped" ? (
                  <button className="btn primary" onClick={finish} autoFocus>
                    סגור
                  </button>
                ) : (
                  <>
                    <button className="btn primary" onClick={submit} disabled={phase === "saving"}>
                      סגור את היום
                    </button>
                    <button className="btn quiet" onClick={finish} disabled={phase === "saving"}>
                      ביטול
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
