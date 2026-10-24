import { useEffect, useState } from "react";
import { api, type Book } from "../api";

export function BookViewer({ book, start, by, onClose }: { book: Book; start: string; by: "label" | "pdf"; onClose: () => void }) {
  const [pdf, setPdf] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [label, setLabel] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"text" | "pdf">("text");
  const isPdf = book.file.endsWith(".pdf");

  useEffect(() => {
    setError("");
    api
      .pages(book.id, start, by)
      .then((r) => setPdf(r.range.fromPdf))
      .catch((e) => {
        setError(e.message);
        setPdf(1);
      });
  }, [book.id, start, by]);

  useEffect(() => {
    if (pdf === null) return;
    api
      .pages(book.id, String(pdf), "pdf")
      .then((r) => {
        setText(r.text.replace(/^=====.*=====\n/, ""));
        setLabel(r.range.fromLabel);
      })
      .catch((e) => setError(e.message));
  }, [book.id, pdf]);

  const go = (d: number) => setPdf((p) => Math.max(1, Math.min(book.pageCount, (p ?? 1) + d)));

  return (
    <div className="viewer-backdrop" onClick={onClose}>
      <div className="viewer window" style={{ ["--accent" as string]: book.color }} onClick={(e) => e.stopPropagation()}>
        <div className="window-bar">
          <span className="window-stripes" aria-hidden />
          <span className="window-title">{book.titleHe}</span>
          <span className="window-stripes" aria-hidden />
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </div>
        <div className="viewer-tools">
          <button className="btn btn-small" onClick={() => go(-1)}>
            → הקודם
          </button>
          <span className="viewer-page">
            עמ' מודפס <b>{label ?? "?"}</b> · PDF {pdf ?? "…"}/{book.pageCount}
          </span>
          <button className="btn btn-small" onClick={() => go(1)}>
            הבא ←
          </button>
          {isPdf && (
            <div className="tabs">
              <button className={tab === "text" ? "is-on" : ""} onClick={() => setTab("text")}>
                טקסט
              </button>
              <button className={tab === "pdf" ? "is-on" : ""} onClick={() => setTab("pdf")}>
                PDF
              </button>
            </div>
          )}
        </div>
        {error && <div className="seg-note">⚠️ {error}</div>}
        {tab === "pdf" && isPdf && pdf ? (
          <iframe key={pdf} className="viewer-pdf" src={`/api/books/${book.id}/file#page=${pdf}`} title="PDF" />
        ) : (
          <pre className="viewer-text" dir="ltr">
            {text}
          </pre>
        )}
      </div>
    </div>
  );
}
