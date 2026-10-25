import type { BookMeta } from "../books";
import type { Progress } from "../runtime";
import { FlowField } from "./FlowField";

/** The slim bar above the conversation: panel toggles, title, and a few live numbers. */
export function Hud({
  book,
  lastLabel,
  progress,
  words,
  solved,
  status,
  title,
  sideOpen,
  outlineOpen,
  onToggleSide,
  onToggleOutline,
}: {
  book: BookMeta;
  lastLabel: string | null;
  progress: Progress;
  words: number;
  solved: number;
  status: "connecting" | "live" | "off";
  title: string;
  sideOpen: boolean;
  outlineOpen: boolean;
  onToggleSide: () => void;
  onToggleOutline: () => void;
}) {
  const p = progress[book.id];
  const lessons = Object.values(progress).reduce((s, x) => s + (x.lessons ?? 0), 0);
  const last = Number(lastLabel);
  const frac = p && Number.isFinite(last) && last > 0 ? Math.min(1, Number(p.page) / last) : 0;
  return (
    <header className="topbar">
      <FlowField className="topbar-canvas" density={0.5} />
      <div className="topbar-inner">
        <button className={`panel-btn ${sideOpen ? "is-on" : ""}`} onClick={onToggleSide} aria-label={sideOpen ? "סגור את המדף" : "פתח את המדף"} title="מדף ושיחות">
          <span className="panel-icon panel-icon-right" aria-hidden />
        </button>
        <div className="topbar-title">
          <div className="topbar-conv">{title}</div>
          <div className="topbar-book" style={{ color: book.color }}>
            {book.titleHe} · {book.volume}
          </div>
        </div>
        <div className="topbar-stats" aria-label="נתונים">
          <span className="stat" title={`${Math.round(frac * 100)}% מהספר`}>
            <b>עמ'</b> <bdi dir="ltr">{p?.page ?? "—"}</bdi>
            <i className="stat-bar">
              <i style={{ transform: `scaleX(${frac})` }} />
            </i>
          </span>
          <span className="stat">
            <b>שיעורים</b> {lessons}
          </span>
          <span className="stat">
            <b>מילים</b> {words >= 1000 ? `${(words / 1000).toFixed(1)}K` : words}
          </span>
          <span className="stat">
            <b>✓</b> {solved}
          </span>
          <span className={`status-dot ${status}`} title={status === "live" ? "Claude מחובר" : status === "connecting" ? "מתחבר…" : "Claude לא זמין"} />
        </div>
        <button className={`panel-btn ${outlineOpen ? "is-on" : ""}`} onClick={onToggleOutline} aria-label={outlineOpen ? "סגור את מפת השיעור" : "פתח את מפת השיעור"} title="מפת השיעור">
          <span className="panel-icon panel-icon-left" aria-hidden />
        </button>
      </div>
    </header>
  );
}
