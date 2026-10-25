import { useEffect, useState } from "react";
import { BOOKS, getBook } from "../books";

export function BookViewer({ bookId, start, by, onClose }: { bookId: string; start: string; by: "label" | "pdf"; onClose: () => void }) {
  const meta = BOOKS.find((b) => b.id === bookId)!;
  const book = getBook(bookId);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!book) return;
    const i = by === "pdf" ? Number(start) - 1 : book.pages.findIndex((p) => p.label === start);
    setIdx(Math.max(0, Math.min(book.pages.length - 1, Number.isFinite(i) && i >= 0 ? i : 0)));
  }, [book, start, by]);

  const page = book?.pages[idx];
  return (
    <div className="viewer-backdrop" onClick={onClose}>
      <div className="viewer window" style={{ ["--accent" as string]: meta.color }} onClick={(e) => e.stopPropagation()}>
        <div className="window-bar">
          <span className="window-stripes" aria-hidden />
          <span className="window-title">
            {meta.titleHe} · {meta.volume}
          </span>
          <span className="window-stripes" aria-hidden />
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </div>
        {book ? (
          <>
            <div className="viewer-tools">
              <button className="btn btn-small" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
                → הקודם
              </button>
              <span className="viewer-page">
                עמ' מודפס <b>{page?.label ?? "?"}</b> · PDF {idx + 1}/{book.pages.length}
              </span>
              <button className="btn btn-small" onClick={() => setIdx((i) => Math.min(book.pages.length - 1, i + 1))}>
                הבא ←
              </button>
            </div>
            <pre className="viewer-text" dir="ltr">
              {page?.text || "(אין טקסט בעמוד הזה)"}
            </pre>
          </>
        ) : (
          <div className="viewer-text">הספר לא נטען בדפדפן הזה.</div>
        )}
      </div>
    </div>
  );
}
