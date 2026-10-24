import { useState } from "react";
import type { Book, ConversationSummary, Progress } from "../api";
import { setTheme, useTheme, type ThemePref } from "../theme";

function pct(book: Book, page?: string) {
  const p = Number(page);
  const last = Number(book.lastLabel);
  if (!Number.isFinite(p) || !Number.isFinite(last) || last <= 0) return 0;
  return Math.max(0, Math.min(1, p / last));
}

export function Cartridge({
  book,
  progress,
  active,
  onSelect,
  onOpen,
  onSetPage,
}: {
  book: Book;
  progress?: Progress[string];
  active: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onSetPage: (page: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(progress?.page ?? "");
  const p = pct(book, progress?.page);
  const segs = 12;
  return (
    <div className={`cartridge ${active ? "is-active" : ""}`} style={{ ["--accent" as string]: book.color }} onClick={onSelect}>
      <div className="cart-top">
        <span className="cart-series">{book.series === "math" ? "MATH" : "PHYS"}</span>
        <span className="cart-vol">{book.id.slice(-1)}</span>
      </div>
      <div className="cart-name">{book.series === "math" ? "מתמטיקה" : "פיינמן"}</div>
      <div className="cart-title">{book.titleHe.split("—")[1]?.trim() ?? book.titleHe}</div>
      <div className="cart-sub" dir="ltr">{book.series === "math" ? "Aleksandrov · Kolmogorov" : "Feynman · Leighton · Sands"}</div>
      <div className="cart-bar" aria-label={`התקדמות ${Math.round(p * 100)}%`}>
        {Array.from({ length: segs }, (_, i) => (
          <i key={i} className={i < Math.round(p * segs) ? "on" : ""} />
        ))}
      </div>
      <div className="cart-foot" onClick={(e) => e.stopPropagation()}>
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) onSetPage(draft.trim());
              setEditing(false);
            }}
          >
            <input autoFocus className="page-input" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => setEditing(false)} dir="ltr" />
          </form>
        ) : (
          <button className="cart-page" onClick={() => (setDraft(progress?.page ?? ""), setEditing(true))} title="עדכון העמוד הנוכחי">
            {progress ? (
              <>
                עמ' <bdi dir="ltr">{progress.page}</bdi>
                <span className="cart-of">
                  {" / "}
                  <bdi dir="ltr">{book.lastLabel ?? book.pageCount}</bdi>
                </span>
              </>
            ) : (
              "טרם התחלתי"
            )}{" "}
            ✎
          </button>
        )}
        <button className="cart-open" onClick={onOpen} title="פתח את הספר">
          📖
        </button>
      </div>
      {progress?.section && <div className="cart-section">אחרון: {progress.section}</div>}
    </div>
  );
}

export function Sidebar({
  books,
  progress,
  activeBook,
  setActiveBook,
  onOpenBook,
  onSetPage,
  conversations,
  currentId,
  onPick,
  onNew,
  onDelete,
  open,
  onClose,
}: {
  books: Book[];
  progress: Progress;
  activeBook: string;
  setActiveBook: (id: string) => void;
  onOpenBook: (id: string) => void;
  onSetPage: (id: string, page: string) => void;
  conversations: ConversationSummary[];
  currentId?: string;
  onPick: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const { pref } = useTheme();
  const themes: [ThemePref, string][] = [
    ["light", "☀️"],
    ["system", "🖥️"],
    ["dark", "🌙"],
  ];
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="side-brand">
        <div className="logo-chip">
          <span className="logo-glyph">∫</span>
        </div>
        <div>
          <div className="brand-he">מעבדת הלמידה</div>
          <div className="brand-en">STUDY·LAB</div>
        </div>
        <button className="icon-btn side-close" onClick={onClose} aria-label="סגור">
          ✕
        </button>
      </div>

      <div className="theme-switch" role="radiogroup" aria-label="ערכת צבעים">
        {themes.map(([t, icon]) => (
          <button key={t} role="radio" aria-checked={pref === t} className={pref === t ? "is-on" : ""} onClick={() => setTheme(t)}>
            {icon}
          </button>
        ))}
      </div>

      <div className="side-section">
        <div className="side-label">
          <span className="pill pill-label">המדף</span>
        </div>
        <div className="shelf">
          {books.map((b) => (
            <Cartridge
              key={b.id}
              book={b}
              progress={progress[b.id]}
              active={b.id === activeBook}
              onSelect={() => setActiveBook(b.id)}
              onOpen={() => onOpenBook(b.id)}
              onSetPage={(p) => onSetPage(b.id, p)}
            />
          ))}
        </div>
      </div>

      <div className="side-section side-convs">
        <div className="side-label">
          <span className="pill pill-label">שיחות</span>
          <button className="btn btn-small" onClick={onNew}>
            + שיחה חדשה
          </button>
        </div>
        <ul className="conv-list">
          {conversations.map((c) => {
            const b = books.find((x) => x.id === c.bookId);
            return (
              <li key={c.id} className={c.id === currentId ? "is-current" : ""}>
                <button className="conv-item" onClick={() => onPick(c.id)} style={{ ["--accent" as string]: b?.color ?? "var(--ink-soft)" }}>
                  <span className="conv-dot" />
                  <span className="conv-title">{c.title}</span>
                  <span className="conv-count">{c.count}</span>
                </button>
                <button
                  className="conv-del"
                  title="מחק שיחה"
                  onClick={() => {
                    if (confirm(`למחוק את השיחה "${c.title}"?`)) onDelete(c.id);
                  }}
                >
                  🗑
                </button>
              </li>
            );
          })}
          {conversations.length === 0 && <li className="conv-empty">עוד אין שיחות. התחילו שיעור ראשון ✨</li>}
        </ul>
      </div>
    </aside>
  );
}
