import { useState } from "react";
import type { Segment } from "../segments";
import type { Book } from "../api";

const BOOK_SHORT: Record<string, string> = {
  math1: "מתמטיקה א׳",
  math2: "מתמטיקה ב׳",
  math3: "מתמטיקה ג׳",
  feyn1: "פיינמן I",
  feyn2: "פיינמן II",
  feyn3: "פיינמן III",
};

export function ThinkingSeg({ seg }: { seg: Extract<Segment, { t: "thinking" }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`seg-thinking ${seg.live ? "is-live" : ""}`}>
      <button className="seg-toggle" onClick={() => setOpen(!open)}>
        <span className="think-orb" aria-hidden />
        {seg.live ? "חושב…" : "מחשבות המורה"} <span className="seg-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="seg-thinking-text">{seg.text || "…"}</div>}
    </div>
  );
}

export function ToolSeg({ seg, books, onOpenBook }: { seg: Extract<Segment, { t: "tool" }>; books: Book[]; onOpenBook: (bookId: string, page: string, by: "label" | "pdf") => void }) {
  const [open, setOpen] = useState(false);
  const i = seg.input ?? {};
  const book = BOOK_SHORT[i.book_id] ?? i.book_id;
  const color = books.find((b) => b.id === i.book_id)?.color ?? "var(--orange)";
  let label = seg.name;
  let icon = "🔧";
  if (seg.name === "read_book_pages") {
    icon = "📖";
    label = `קורא ב${book}: עמ' ${i.from ?? "…"}${i.to && i.to !== i.from ? `–${i.to}` : ""}${i.by === "pdf" ? " (PDF)" : ""}`;
  } else if (seg.name === "search_book") {
    icon = "🔍";
    label = `מחפש ב${book}: “${i.query ?? "…"}”`;
  } else if (seg.name === "record_progress") {
    icon = "📌";
    label = `נשמרה התקדמות: ${book}, עמ' ${i.page ?? ""}${i.section ? ` — ${i.section}` : ""}`;
  }
  return (
    <div className={`seg-tool ${seg.pending ? "is-pending" : ""} ${seg.isError ? "is-error" : ""}`} style={{ ["--accent" as string]: color }}>
      <button className="seg-tool-chip" onClick={() => setOpen(!open)}>
        <span>{icon}</span>
        <span className="seg-tool-label">{label}</span>
        {seg.pending && <span className="spinner" />}
      </button>
      {seg.name === "read_book_pages" && i.book_id && (
        <button className="mini-link" onClick={() => onOpenBook(i.book_id, String(i.from), i.by ?? "label")}>
          פתח בספר ↗
        </button>
      )}
      {open && seg.result && <pre className="seg-tool-result" dir="ltr">{seg.result.slice(0, 6000)}{seg.result.length > 6000 ? "\n…" : ""}</pre>}
    </div>
  );
}

export function CodeSeg({ seg }: { seg: Extract<Segment, { t: "code" }> }) {
  const [open, setOpen] = useState(false);
  const out = seg.stdout ?? "";
  const dataLines = out.split("\n").filter((l) => /^@@(chart|table):/.test(l.trim()));
  const plain = out
    .split("\n")
    .map((l) => (/^@@(chart|table):/.test(l.trim()) ? `${l.trim().split(" ")[0]}  [נתונים לתצוגה]` : l))
    .join("\n")
    .trim();
  const failed = (seg.code_rc ?? 0) !== 0;
  return (
    <div className={`seg-code ${seg.pending ? "is-pending" : ""} ${failed ? "is-error" : ""}`}>
      <button className="seg-code-head" onClick={() => setOpen(!open)}>
        <span className="term-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="seg-code-title">
          {seg.pending ? "מריץ קוד…" : failed ? "הרצת קוד נכשלה" : seg.kind === "file" ? `נכתב קובץ ${seg.path ?? ""}` : "קוד שרץ — המספרים מכאן"}
        </span>
        {dataLines.length > 0 && <span className="pill pill-mini">📊 {dataLines.length} סדרות נתונים</span>}
        {seg.pending ? <span className="spinner" /> : <span className="seg-caret">{open ? "▲" : "▼"}</span>}
      </button>
      {open && (
        <div className="seg-code-body" dir="ltr">
          <pre className="code-src">{seg.code}</pre>
          {plain && <pre className="code-out">{plain}</pre>}
          {seg.stderr && <pre className="code-err">{seg.stderr}</pre>}
        </div>
      )}
    </div>
  );
}

export function SearchSeg({ seg }: { seg: Extract<Segment, { t: "search" }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`seg-tool seg-search ${seg.pending ? "is-pending" : ""}`}>
      <button className="seg-tool-chip" onClick={() => setOpen(!open)}>
        <span>🌐</span>
        <span className="seg-tool-label">חיפוש ברשת: “{seg.query}”</span>
        {seg.pending ? <span className="spinner" /> : seg.results && <span className="pill pill-mini">{seg.results.length} מקורות</span>}
      </button>
      {open && seg.results && (
        <ul className="search-results">
          {seg.results.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.title}
              </a>
              <span dir="ltr">{new URL(r.url).hostname}</span>
            </li>
          ))}
        </ul>
      )}
      {seg.error && <div className="seg-note">החיפוש נכשל: {seg.error}</div>}
    </div>
  );
}
