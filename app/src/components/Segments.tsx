import { useState } from "react";
import type { Activity } from "../types";
import { BOOKS } from "../books";

const BOOK_SHORT: Record<string, string> = {
  math1: "מתמטיקה א׳",
  math2: "מתמטיקה ב׳",
  math3: "מתמטיקה ג׳",
  feyn1: "פיינמן I",
  feyn2: "פיינמן II",
  feyn3: "פיינמן III",
};

export function ActivitySeg({ a, onOpenBook }: { a: Activity; onOpenBook: (bookId: string, page: string, by: "label" | "pdf") => void }) {
  const [open, setOpen] = useState(false);
  const color = "book" in a ? (BOOKS.find((b) => b.id === a.book)?.color ?? "var(--orange)") : "var(--orange)";
  const book = "book" in a ? (BOOK_SHORT[a.book] ?? a.book) : "";

  if (a.t === "compute")
    return (
      <div className={`seg-code ${a.ok ? "" : "is-error"}`}>
        <button className="seg-code-head" onClick={() => setOpen(!open)}>
          <span className="term-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="seg-code-title">{a.ok ? "חישוב שרץ (math.js): המספרים מכאן" : "בחישוב הייתה שגיאה"}</span>
          <span className="seg-caret">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <div className="seg-code-body" dir="ltr">
            <pre className="code-out">{a.output}</pre>
          </div>
        )}
      </div>
    );

  let icon = "📖";
  let label = "";
  if (a.t === "read") label = `קרא ב${book}: עמ' ${a.from}${a.to !== a.from ? `–${a.to}` : ""}${a.by === "pdf" ? " (PDF)" : ""}${a.ok ? "" : " — נכשל"}`;
  if (a.t === "search") {
    icon = "🔍";
    label = `חיפש ב${book}: “${a.query}” · ${a.hits} תוצאות`;
  }
  if (a.t === "progress") {
    icon = "📌";
    label = `נשמרה התקדמות: ${book}, עמ' ${a.page}${a.section ? ` — ${a.section}` : ""}`;
  }
  return (
    <div className={`seg-tool ${a.t === "read" && !a.ok ? "is-error" : ""}`} style={{ ["--accent" as string]: color }}>
      <span className="seg-tool-chip">
        <span>{icon}</span>
        <span className="seg-tool-label">{label}</span>
      </span>
      {a.t === "read" && a.ok && (
        <button className="mini-link" onClick={() => onOpenBook(a.book, a.from, a.by === "pdf" ? "pdf" : "label")}>
          פתח בספר ↗
        </button>
      )}
      {a.t === "read" && a.note && <span className="seg-note">{a.note}</span>}
    </div>
  );
}
