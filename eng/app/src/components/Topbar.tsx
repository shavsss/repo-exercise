import { useState, type ReactNode } from "react";
import { toggleTheme, useTheme } from "../theme";
import { ReadingPanel } from "./ReadingPanel";
import { Icon } from "./Icon";

export interface Crumb {
  label: string;
  onClick?: () => void;
}

/** Light bar with a thin rule under it: path, lesson counter, theme switch and panel toggles. */
export function Topbar({
  crumbs,
  counter,
  status,
  sideOpen,
  viewerOpen,
  memoryBusy,
  onToggleSide,
  onToggleViewer,
  onMemory,
  onNotes,
  notesCount,
  tabs,
}: {
  crumbs: Crumb[];
  counter?: string;
  status: "connecting" | "live" | "off";
  sideOpen: boolean;
  viewerOpen: boolean;
  memoryBusy: boolean;
  onToggleSide: () => void;
  onToggleViewer?: () => void;
  onMemory: () => void;
  onNotes: () => void;
  notesCount: number;
  /** the tabs beside the lessons (src/labtabs/) */
  tabs?: ReactNode;
}) {
  const { dark } = useTheme();
  const [reading, setReading] = useState(false);
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={onToggleSide} aria-pressed={sideOpen} aria-label="מפת המודולים" title="מפת המודולים">
        <Icon name="menu" />
      </button>
      <span className="brand">גילואה</span>
      {tabs}
      <ol className="crumbs" aria-label="נתיב">
        {crumbs.map((c, i) => (
          <li key={i}>
            {c.onClick && i < crumbs.length - 1 ? (
              <button className="crumb" onClick={c.onClick}>
                {c.label}
              </button>
            ) : (
              <span className="crumb is-last">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      {counter && <span className="counter">{counter}</span>}
      <span className="topbar-spacer" />
      <span className={`conn conn-${status}`} title={status === "live" ? "מחובר ל-Claude" : status === "off" ? "אין חיבור ל-Claude" : "מתחבר"}>
        <span className="conn-dot" />
        <span className="conn-label">{status === "live" ? "מחובר" : status === "off" ? "לא מחובר" : "מתחבר"}</span>
      </span>
      <button className={`icon-btn ${memoryBusy ? "is-busy" : ""}`} onClick={onMemory} aria-label="זיכרון הקורס" title={memoryBusy ? "זיכרון הקורס מתעדכן" : "זיכרון הקורס"}>
        <Icon name="memory" />
      </button>
      <a className="icon-btn" href="#summary" aria-label="הסיכומים" title="הסיכומים (כדי לפתוח בחלון נפרד: הקישור של הדף עם #summary בסוף)">
        <Icon name="book" />
      </a>
      <button className="icon-btn notes-btn" onClick={onNotes} aria-label="מחברת השיעור" title="מחברת השיעור: מאמרים, ראיונות ונקודות להעמקה">
        <Icon name="exercise" />
        {notesCount > 0 && <span className="notes-count">{notesCount}</span>}
      </button>
      {onToggleViewer && (
        <button className="icon-btn" onClick={onToggleViewer} aria-pressed={viewerOpen} aria-label="מציג המקורות" title="מציג המקורות">
          <Icon name="side" />
        </button>
      )}
      <button className="icon-btn reading-btn" onClick={() => setReading((v) => !v)} aria-pressed={reading} aria-label="תצוגת קריאה" title="תצוגת קריאה: גופן, גודל, ריווח ורקע">
        Aa
      </button>
      {reading && <ReadingPanel onClose={() => setReading(false)} />}
      <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? "מעבר למצב בהיר" : "מעבר למצב כהה"} title={dark ? "מצב בהיר" : "מצב כהה"}>
        <Icon name={dark ? "sun" : "moon"} />
      </button>
    </header>
  );
}
