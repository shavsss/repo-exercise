// "מה קראתי": every reading the learner marked as read, newest first, by month: a shelf of colored spines on top,
// then a card per reading with the author's portrait (or a colored badge), and a line of what he took from it.
// Data: profile/reading/log (events.ts). Same file in both apps.
import { useMemo, useState } from "react";
import { setRead, setReadNote, type ReadEntry } from "../events";
import { useReadLog } from "../readlog";
import type { LabTabProps } from "./LabTabs";
import { hueOf, initialsOf, portraitOf } from "./portraits";
import "./readtab.css";

const monthHe = (t: number) => new Date(t).toLocaleDateString("he-IL", { month: "long", year: "numeric" });
const dayHe = (t: number) => new Date(t).toLocaleDateString("he-IL", { day: "numeric", month: "long" });

function Avatar({ author }: { author?: string }) {
  const [broken, setBroken] = useState(false);
  const src = broken ? undefined : portraitOf(author);
  const hue = hueOf(author ?? "?");
  return src ? (
    <img className="rt-avatar" src={src} alt="" loading="lazy" onError={() => setBroken(true)} />
  ) : (
    <span className="rt-avatar rt-initials" style={{ ["--h" as string]: String(hue) }} aria-hidden>
      {initialsOf(author)}
    </span>
  );
}

function Card({ e, onOpenModule }: { e: ReadEntry; onOpenModule: (id: string) => void }) {
  const [note, setNote] = useState(e.note ?? "");
  const [editing, setEditing] = useState(false);
  // each author keeps one color: across months the page reads as many voices, not one module's tint
  const hue = hueOf(e.a || e.t);
  return (
    <li className="rt-card" style={{ ["--h" as string]: String(hue) }}>
      <Avatar author={e.a} />
      <div className="rt-body">
        <div className="rt-top">
          {e.u ? (
            <a className="rt-title" href={e.u} target="_blank" rel="noopener noreferrer" dir="auto">
              {e.t}
            </a>
          ) : (
            <span className="rt-title" dir="auto">
              {e.t}
            </span>
          )}
        </div>
        <div className="rt-meta">
          <span className="rt-author" dir="ltr">
            {[e.a, e.y].filter(Boolean).join(" · ")}
          </span>
          <button className="rt-chip" onClick={() => onOpenModule(e.moduleId)} title="פתח את המודול">
            {e.moduleId}
          </button>
          <span className="rt-day">{dayHe(e.at)}</span>
        </div>
        {editing ? (
          <div className="rt-note-edit">
            <textarea rows={2} value={note} autoFocus placeholder="מה לקחתי מזה, בשורה או שתיים" onChange={(ev) => setNote(ev.target.value)} />
            <div className="rt-note-actions">
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
          <blockquote className="rt-note" dir="auto" onClick={() => setEditing(true)} title="לחץ לעריכה">
            {e.note}
          </blockquote>
        ) : (
          <button className="link rt-add" onClick={() => setEditing(true)}>
            + מה לקחתי מזה
          </button>
        )}
      </div>
      <button className="rt-undo" onClick={() => setRead(e, false).catch(() => {})} title="הסר מהרשימה" aria-label="הסר מהרשימה">
        ×
      </button>
    </li>
  );
}

export function ReadTab({ onOpenModule }: LabTabProps) {
  const log = useReadLog();
  const list = useMemo(() => Object.values(log ?? {}).sort((a, b) => b.at - a.at), [log]);
  const groups = useMemo(() => {
    const out: { month: string; items: ReadEntry[] }[] = [];
    for (const e of list) {
      const mth = monthHe(e.at);
      const g = out[out.length - 1];
      if (g && g.month === mth) g.items.push(e);
      else out.push({ month: mth, items: [e] });
    }
    return out;
  }, [list]);
  const n = list.length;
  const modules = new Set(list.map((e) => e.moduleId)).size;
  const authors = new Set(list.map((e) => (e.a ?? "").split(/,| and |&/)[0].trim()).filter(Boolean)).size;
  const notes = list.filter((e) => e.note).length;
  return (
    <div className="rt">
      <header className="rt-hero">
        <h1>מה קראתי</h1>
        <p>כל מאמר וספר שקראת מרשימות הקריאה, עם מה שלקחת מכל אחד.</p>
        {n > 0 && (
          <div className="rt-stats">
            <span>
              <b>{n}</b> פריטים
            </span>
            <span>
              <b>{authors}</b> כותבים
            </span>
            <span>
              <b>{modules}</b> מודולים
            </span>
            <span>
              <b>{notes}</b> תובנות
            </span>
          </div>
        )}
        {n > 0 && (
          <div className="rt-shelf" aria-hidden>
            {[...list].reverse().map((e) => (
              <span key={e.id} className="rt-spine" style={{ ["--h" as string]: String(hueOf(e.a || e.t)), height: `${34 + (hueOf(e.t) % 22)}px` }} title={e.t} />
            ))}
          </div>
        )}
      </header>
      {log === null ? null : n === 0 ? (
        <p className="muted rt-empty">עוד אין כאן כלום. ברשימת הקריאה של כל מודול יש כפתור "סמן כנקרא", וכל פריט שמסמנים נשמר כאן, עם התאריך.</p>
      ) : (
        groups.map((g) => (
          <section key={g.month} className="rt-month">
            <h2>{g.month}</h2>
            <ul className="rt-list">
              {g.items.map((e) => (
                <Card key={e.id} e={e} onOpenModule={onOpenModule} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
