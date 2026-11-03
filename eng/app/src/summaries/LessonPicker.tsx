// Choosing a chart or a picture from the lesson open in the other window: asks it over the lesson channel
// ("visuals?"), shows what came back (src/lessonVisuals.ts drew each one as PNG), and hands the chosen one to the
// summary as a picture, with its title as the caption. Same file in both apps.
import { useEffect, useState } from "react";
import type { LessonVisual } from "../lessonVisuals";
import { lessonChannel } from "./SummaryApp";

type Answer = { moduleId: string; lesson?: number; items: LessonVisual[] };

export function LessonPicker({ lab, onPick, onClose }: { lab: string; onPick: (v: LessonVisual) => void; onClose: () => void }) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [state, setState] = useState<"ask" | "none" | "ok">("ask");
  const [busy, setBusy] = useState(false);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return setState("none");
    const req = Math.random().toString(36).slice(2);
    const ch = new BroadcastChannel(lessonChannel(lab));
    let got = false;
    ch.onmessage = (e) => {
      const d = e.data as { type?: string; req?: string } & Answer;
      if (d?.type !== "visuals" || d.req !== req) return;
      // more than one lesson window: the one with the most pictures
      setAnswer((cur) => (!cur || d.items.length > cur.items.length ? { moduleId: d.moduleId, lesson: d.lesson, items: d.items } : cur));
      got = true;
      setState("ok");
    };
    setState("ask");
    ch.postMessage({ type: "visuals?", req });
    const t = setTimeout(() => !got && setState("none"), 4000);
    return () => {
      clearTimeout(t);
      ch.close();
    };
  }, [lab, tries]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="sm-modal" role="dialog" aria-label="גרף או איור מהשיעור" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sm-modal-box sm-lespick">
        <header>
          <b>גרף או איור מהשיעור</b>
          {answer && (
            <span className="muted" dir="auto">
              {answer.moduleId}
              {typeof answer.lesson === "number" && answer.lesson >= 0 ? ` · שיעור ${answer.lesson + 1}` : ""}
            </span>
          )}
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </header>
        {state === "ask" && <p className="sm-lespick-msg">מבקש מהשיעור הפתוח בחלון השני…</p>}
        {state === "none" && (
          <div className="sm-lespick-msg">
            <p>לא נמצא שיעור פתוח. פתח את השיעור בחלון או בלשונית אחרת של אותו דפדפן, ונסה שוב.</p>
            <button className="btn" onClick={() => setTries((x) => x + 1)}>
              נסה שוב
            </button>
          </div>
        )}
        {state === "ok" && answer && !answer.items.length && <p className="sm-lespick-msg">בשיעור הפתוח אין עדיין גרפים או איורים. סימולציה או אנימציה נכנסות לכאן אחרי שפותחים אותן בשיעור; סצנת תלת-ממד: צילום מסך והדבקה (Ctrl+V).</p>}
        {state === "ok" && !!answer?.items.length && <p className="sm-lespick-hint">לחיצה מוסיפה לסיכום כתמונה, עם הכותרת שלה. סימולציה או אנימציה מופיעות כאן כשהן פתוחות בשיעור.</p>}
        {state === "ok" && !!answer?.items.length && (
          <ul className="sm-lespick-grid">
            {answer.items.map((v, i) => (
              <li key={i}>
                <button
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await onPick(v);
                    } finally {
                      setBusy(false);
                    }
                  }}
                  title="הוסף לסיכום"
                >
                  <img src={v.url} alt="" />
                  <span dir="auto">{v.title || v.caption || `איור ${i + 1}`}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
