import type { Book, Progress } from "../api";
import { FlowField } from "./FlowField";

export function Hud({
  book,
  progress,
  words,
  solved,
  hasKey,
  model,
  title,
  onMenu,
}: {
  book?: Book;
  progress: Progress;
  words: number;
  solved: number;
  hasKey: boolean;
  model: string;
  title: string;
  onMenu: () => void;
}) {
  const p = book ? progress[book.id] : undefined;
  const lessons = Object.values(progress).reduce((s, x) => s + (x.lessons ?? 0), 0);
  const last = Number(book?.lastLabel);
  const frac = p && Number.isFinite(last) && last > 0 ? Math.min(1, Number(p.page) / last) : 0;
  const colors = ["#8ac926", "#ffbe0b", "#ff9a3d", "#ff6b35", "#ff3d7f", "#b04dff", "#3a86ff", "#2ec4b6"];
  return (
    <header className="hud">
      <FlowField className="hud-canvas" density={0.9} />
      <div className="hud-inner">
        <button className="icon-btn hud-menu" onClick={onMenu} aria-label="תפריט">
          ☰
        </button>
        <div className="hud-title">
          <div className="hud-conv">{title}</div>
          <div className="hud-book" style={{ color: book?.color }}>
            {book ? book.titleHe : ""}
          </div>
        </div>
        <div className="hud-tiles">
          <div className="tile">
            <span className="tile-k">PAGE</span>
            <span className="tile-v">{p?.page ?? "—"}</span>
          </div>
          <div className="tile">
            <span className="tile-k">LESSONS</span>
            <span className="tile-v">{lessons}</span>
          </div>
          <div className="tile">
            <span className="tile-k">WORDS</span>
            <span className="tile-v">{words >= 1000 ? `${(words / 1000).toFixed(1)}K` : words}</span>
          </div>
          <div className="tile">
            <span className="tile-k">SOLVED</span>
            <span className="tile-v">{solved}</span>
          </div>
        </div>
        <div className="hud-meter" title={`${Math.round(frac * 100)}% מהספר`}>
          <div className="meter-track">
            {colors.map((c, i) => (
              <i key={i} style={{ background: c, opacity: (i + 1) / colors.length <= frac + 0.001 ? 1 : 0.18 }} />
            ))}
            <span className="meter-knob" style={{ insetInlineStart: `${frac * 100}%` }} />
          </div>
          <span className={`hud-status ${hasKey ? "live" : "demo"}`}>{hasKey ? `● ${model}` : "● מצב הדגמה"}</span>
        </div>
      </div>
    </header>
  );
}
