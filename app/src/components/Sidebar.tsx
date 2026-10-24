import { useRef, useState } from "react";
import { BOOKS, type BookMeta } from "../books";
import type { ConvMeta, Progress } from "../runtime";

type Loaded = Record<string, { pages: number; fileName: string; lastLabel: string | null }>;

function Cartridge({
  book,
  progress,
  loaded,
  importing,
  active,
  onSelect,
  onOpen,
  onSetPage,
  onPickFile,
}: {
  book: BookMeta;
  progress?: Progress[string];
  loaded?: Loaded[string];
  importing: { done: number; total: number } | null;
  active: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onSetPage: (page: string) => void;
  onPickFile: (f: File) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(progress?.page ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const last = Number(loaded?.lastLabel);
  const frac = progress && Number.isFinite(last) && last > 0 ? Math.min(1, Number(progress.page) / last) : 0;
  const segs = 12;
  return (
    <div className={`cartridge ${active ? "is-active" : ""} ${loaded ? "" : "is-unloaded"}`} style={{ ["--accent" as string]: book.color }} onClick={onSelect}>
      <div className="cart-top">
        <span className="cart-series">{book.series === "math" ? "MATH" : "PHYS"}</span>
        <span className="cart-vol">{book.id.slice(-1)}</span>
      </div>
      <div className="cart-name">{book.series === "math" ? "מתמטיקה" : "פיינמן"}</div>
      <div className="cart-title">{book.volume}</div>
      <div className="cart-bar" aria-label={`התקדמות ${Math.round(frac * 100)}%`}>
        {Array.from({ length: segs }, (_, i) => (
          <i key={i} className={i < Math.round(frac * segs) ? "on" : ""} />
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
            <input id={`page-${book.id}`} autoFocus className="page-input" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => setEditing(false)} dir="ltr" aria-label="עמוד נוכחי" />
          </form>
        ) : (
          <button className="cart-page" onClick={() => (setDraft(progress?.page ?? ""), setEditing(true))} title="עדכון העמוד הנוכחי">
            {progress ? (
              <>
                עמ' <bdi dir="ltr">{progress.page}</bdi>
                {loaded?.lastLabel && (
                  <span className="cart-of">
                    {" / "}
                    <bdi dir="ltr">{loaded.lastLabel}</bdi>
                  </span>
                )}
              </>
            ) : (
              "טרם התחלתי"
            )}{" "}
            ✎
          </button>
        )}
        {loaded ? (
          <button className="cart-open" onClick={onOpen} title="פתח את הספר">
            📖
          </button>
        ) : (
          <button className="cart-open cart-load" onClick={() => fileRef.current?.click()} title="טען את קובץ הספר מהמחשב">
            ⬆
          </button>
        )}
        <input
          ref={fileRef}
          id={`file-${book.id}`}
          type="file"
          accept=".pdf,.txt"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPickFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {importing && (
        <div className="cart-import">
          {importing.total ? `קורא עמודים ${importing.done}/${importing.total}` : "פותח את הקובץ…"}
          <span className="cart-import-bar" style={{ transform: `scaleX(${importing.total ? importing.done / importing.total : 0.05})` }} />
        </div>
      )}
      {!importing && !loaded && <div className="cart-section">לא נטען</div>}
      {!importing && loaded && progress?.section && <div className="cart-section">אחרון: {progress.section}</div>}
    </div>
  );
}

export function Sidebar({
  progress,
  loaded,
  importing,
  activeBook,
  setActiveBook,
  onOpenBook,
  onSetPage,
  onPickFiles,
  conversations,
  currentId,
  onPick,
  onNew,
  onDelete,
  canSave,
  onOpenMemory,
  memoryBusy,
  open,
  onClose,
  collapsed,
  onExpand,
}: {
  progress: Progress;
  loaded: Loaded;
  importing: { bookId: string; done: number; total: number } | null;
  activeBook: string;
  setActiveBook: (id: string) => void;
  onOpenBook: (id: string) => void;
  onSetPage: (id: string, page: string) => void;
  onPickFiles: (files: File[], forBook?: string) => void;
  conversations: ConvMeta[];
  currentId?: string;
  onPick: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  canSave: boolean;
  onOpenMemory: () => void;
  memoryBusy: boolean;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onExpand: () => void;
}) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const multiRef = useRef<HTMLInputElement>(null);
  const missing = BOOKS.filter((b) => !loaded[b.id]).length;
  if (collapsed && !open)
    return (
      <aside className="sidebar sidebar-rail">
        <button className="logo-chip rail-logo" onClick={onExpand} aria-label="פתח את המדף" title="פתח את המדף">
          <span className="logo-glyph">∫</span>
        </button>
        <button className="rail-btn" onClick={onNew} title="שיחה חדשה" aria-label="שיחה חדשה">
          ＋
        </button>
        <button className="rail-btn" onClick={onOpenMemory} title="זיכרון הקורס" aria-label="זיכרון הקורס">
          🧠
        </button>
        <div className="rail-books">
          {BOOKS.map((b) => (
            <button
              key={b.id}
              className={`rail-book ${b.id === activeBook ? "is-active" : ""}`}
              style={{ ["--accent" as string]: b.color }}
              onClick={() => setActiveBook(b.id)}
              title={`${b.titleHe} · ${b.volume}`}
            >
              {b.series === "math" ? "M" : "F"}
              {b.id.slice(-1)}
            </button>
          ))}
        </div>
      </aside>
    );
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

      <div className="side-section">
        <div className="side-label">
          <span className="pill pill-label">המדף</span>
          {missing > 0 && (
            <button className="btn btn-small" onClick={() => multiRef.current?.click()}>
              ⬆ טען ספרים
            </button>
          )}
          <input
            ref={multiRef}
            id="file-many"
            type="file"
            accept=".pdf,.txt"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files?.length) onPickFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
        </div>
        <div className="shelf">
          {BOOKS.map((b) => (
            <Cartridge
              key={b.id}
              book={b}
              progress={progress[b.id]}
              loaded={loaded[b.id]}
              importing={importing?.bookId === b.id ? importing : null}
              active={b.id === activeBook}
              onSelect={() => setActiveBook(b.id)}
              onOpen={() => onOpenBook(b.id)}
              onSetPage={(p) => onSetPage(b.id, p)}
              onPickFile={(f) => onPickFiles([f], b.id)}
            />
          ))}
        </div>
        {missing > 0 && <p className="side-hint">ספר שלא נטען אפשר לטעון מהקובץ שבמחשב שלך.</p>}
      </div>

      <button className="memory-btn" onClick={onOpenMemory}>
        <span className="memory-icon">🧠</span>
        <span>
          <b>זיכרון הקורס</b>
          <small>{memoryBusy ? "מתעדכן אחרי השיעור…" : "מה נלמד, כלים, סימונים וקשיים"}</small>
        </span>
        {memoryBusy && <span className="spinner" />}
      </button>

      <div className="side-section side-convs">
        <div className="side-label">
          <span className="pill pill-label">שיחות</span>
          <button className="btn btn-small" onClick={onNew}>
            + שיחה חדשה
          </button>
        </div>
        <ul className="conv-list">
          {conversations.map((c) => {
            const b = BOOKS.find((x) => x.id === c.bookId);
            return (
              <li key={c.id} className={c.id === currentId ? "is-current" : ""}>
                <button className="conv-item" onClick={() => onPick(c.id)} style={{ ["--accent" as string]: b?.color ?? "var(--ink-soft)" }}>
                  <span className="conv-dot" />
                  <span className="conv-title">{c.title}</span>
                  <span className="conv-count">{c.count}</span>
                </button>
                {confirming === c.id ? (
                  <span className="conv-confirm">
                    <button className="conv-yes" onClick={() => (onDelete(c.id), setConfirming(null))}>
                      מחק
                    </button>
                    <button className="conv-no" onClick={() => setConfirming(null)}>
                      ביטול
                    </button>
                  </span>
                ) : (
                  <button className="conv-del" title="מחק שיחה" onClick={() => setConfirming(c.id)}>
                    🗑
                  </button>
                )}
              </li>
            );
          })}
          {conversations.length === 0 && <li className="conv-empty">{canSave ? "עוד אין שיחות. התחילו שיעור ראשון ✨" : "השיחות יופיעו כאן כשהדף מחובר ל-claude.ai."}</li>}
        </ul>
      </div>
    </aside>
  );
}
