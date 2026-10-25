import { useState } from "react";
import type { Activity } from "../types";
import { docMeta } from "../library";
import { Icon } from "./Icon";

/** One tool call of the tutor: a page read, a search, or a computation. */
export function ActivitySeg({ a, onOpenSource }: { a: Activity; onOpenSource: (doc: string, page: number) => void }) {
  const [open, setOpen] = useState(false);

  if (a.t === "compute")
    return (
      <div className={`act act-compute ${a.ok ? "" : "is-error"}`}>
        <button className="act-head" onClick={() => setOpen(!open)} aria-expanded={open}>
          <Icon name="calc" size={14} />
          <span>{a.ok ? "חישוב שרץ בדף (math.js): המספרים בשיעור מכאן" : "בחישוב הייתה שגיאה"}</span>
          <span className="act-caret">{open ? "הסתר" : "הצג"}</span>
        </button>
        {open && (
          <pre className="act-out" dir="ltr">
            {a.output}
          </pre>
        )}
      </div>
    );

  if (a.t === "search")
    return (
      <div className="act">
        <Icon name="search" size={14} />
        <span>
          חיפוש בספרייה: <bdi dir="ltr">“{a.query}”</bdi> · {a.hits} תוצאות
        </span>
      </div>
    );

  const name = docMeta(a.doc)?.short ?? a.doc;
  return (
    <div className={`act ${a.ok ? "" : "is-error"}`}>
      <Icon name="book" size={14} />
      <span>
        קרא ב-<bdi>{name}</bdi>: עמודי PDF {a.from}
        {a.to !== a.from ? `–${a.to}` : ""}
        {a.ok ? "" : " (נכשל)"}
      </span>
      {a.ok && (
        <button className="link" onClick={() => onOpenSource(a.doc, a.from)}>
          פתח
        </button>
      )}
      {a.note && <span className="act-note">{a.note}</span>}
    </div>
  );
}
