// "מה קראתי": every reading the learner marked as read, newest first, by month, with a line of what he took from
// it. Data: profile/reading/log (events.ts). Same file in both apps.
import { useMemo, useState } from "react";
import { setRead, setReadNote, type ReadEntry } from "../events";
import { useReadLog } from "../readlog";
import type { LabTabProps } from "./LabTabs";

const monthHe = (t: number) => new Date(t).toLocaleDateString("he-IL", { month: "long", year: "numeric" });
const dayHe = (t: number) => new Date(t).toLocaleDateString("he-IL", { day: "numeric", month: "numeric" });

function Entry({ e, onOpenModule }: { e: ReadEntry; onOpenModule: (id: string) => void }) {
  const [note, setNote] = useState(e.note ?? "");
  const [editing, setEditing] = useState(false);
  return (
    <li className="rd-item">
      <div className="rd-head">
        {e.u ? (
          <a className="rd-title" href={e.u} target="_blank" rel="noopener noreferrer" dir="auto">
            {e.t}
          </a>
        ) : (
          <span className="rd-title" dir="auto">
            {e.t}
          </span>
        )}
        <span className="rd-day">{dayHe(e.at)}</span>
      </div>
      <div className="rd-meta">
        <span dir="ltr">{[e.a, e.y].filter(Boolean).join(" · ")}</span>
        <button className="link rd-mod" onClick={() => onOpenModule(e.moduleId)}>
          {e.moduleId}
        </button>
      </div>
      {editing ? (
        <div className="rd-note-edit">
          <textarea rows={2} value={note} autoFocus placeholder="מה לקחתי מזה, בשורה או שתיים" onChange={(ev) => setNote(ev.target.value)} />
          <div className="rd-note-actions">
            <button
              className="btn small"
              onClick={() => {
                setReadNote(e.id, note).catch(() => {});
                setEditing(false);
              }}
            >
              שמור
            </button>
            <button className="link" onClick={() => setEditing(false)}>
              ביטול
            </button>
          </div>
        </div>
      ) : e.note ? (
        <p className="rd-note" dir="auto" onClick={() => setEditing(true)} title="לחץ לעריכה">
          {e.note}
        </p>
      ) : (
        <button className="link rd-add" onClick={() => setEditing(true)}>
          + מה לקחתי מזה
        </button>
      )}
      <button className="link rd-undo" onClick={() => setRead(e, false).catch(() => {})} title="הסר מהרשימה">
        הסר
      </button>
    </li>
  );
}

export function ReadTab({ onOpenModule }: LabTabProps) {
  const log = useReadLog();
  const groups = useMemo(() => {
    const list = Object.values(log ?? {}).sort((a, b) => b.at - a.at);
    const out: { month: string; items: ReadEntry[] }[] = [];
    for (const e of list) {
      const mth = monthHe(e.at);
      const g = out[out.length - 1];
      if (g && g.month === mth) g.items.push(e);
      else out.push({ month: mth, items: [e] });
    }
    return out;
  }, [log]);
  const n = Object.keys(log ?? {}).length;
  const modules = new Set(Object.values(log ?? {}).map((e) => e.moduleId)).size;
  return (
    <div className="rd">
      <header className="rd-top">
        <h1>מה קראתי</h1>
        {n > 0 && (
          <p className="rd-sum">
            {n} מאמרים וספרים, מ-{modules} מודולים
          </p>
        )}
      </header>
      {log === null ? null : n === 0 ? (
        <p className="muted rd-empty">עוד אין כאן כלום. ברשימת הקריאה של כל מודול יש כפתור "סמן כנקרא", וכל פריט שמסמנים נשמר כאן, עם התאריך.</p>
      ) : (
        groups.map((g) => (
          <section key={g.month} className="rd-month">
            <h2>{g.month}</h2>
            <ul className="rd-list">
              {g.items.map((e) => (
                <Entry key={e.id} e={e} onOpenModule={onOpenModule} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
