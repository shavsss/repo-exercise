import { useEffect, useState } from "react";
import { docMeta, docText, figure, pageImage, type Figure, type PageText } from "../library";
import { Icon } from "./Icon";

/** Side panel with one source page: its text, the figures on it, and the page image when it was OCR'd. */
export function SourceViewer({ doc, page, onPage, onClose, onCollapse }: { doc: string; page: number; onPage: (p: number) => void; onClose: () => void; onCollapse?: () => void }) {
  const meta = docMeta(doc);
  const [text, setText] = useState<Record<string, PageText> | null>(null);
  const [figs, setFigs] = useState<(Figure | null)[]>([]);
  const [img, setImg] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    let alive = true;
    setError("");
    docText(doc)
      .then((t) => alive && setText(t))
      .catch((e) => alive && setError((e as Error).message));
    return () => {
      alive = false;
    };
  }, [doc]);

  useEffect(() => {
    let alive = true;
    setFigs([]);
    setImg(null);
    const caps = meta?.figs[String(page)] ?? [];
    Promise.all(caps.map((_c, j) => figure(doc, `${page}-${j}`).catch(() => null))).then((f) => alive && setFigs(f));
    pageImage(doc, page)
      .then((d) => alive && setImg(d))
      .catch(() => alive && setImg(null));
    return () => {
      alive = false;
    };
  }, [doc, page, meta]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pg = text?.[String(page)];
  const total = meta?.pages ?? page;
  const label = meta?.kind !== "article" && pg?.l ? pg.l : null;

  return (
    <aside className="viewer" aria-label="מציג המקורות">
      <header className="viewer-head">
        <div className="viewer-title">
          <span className="viewer-doc">{meta?.short ?? doc}</span>
          <span className="viewer-full" dir="ltr">
            {meta?.title}
          </span>
        </div>
        {onCollapse && (
          <button className="icon-btn" onClick={onCollapse} aria-label="קפל את המציג לצד" title="קפל לצד">
            <Icon name="next" />
          </button>
        )}
        <button className="icon-btn" onClick={onClose} aria-label="סגור את המציג" title="סגור (Esc)">
          <Icon name="close" />
        </button>
      </header>
      <div className="viewer-nav">
        <button className="btn small" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}>
          <Icon name="prev" size={14} />
          הקודם
        </button>
        <span className="viewer-page">
          {label ? (
            <>
              עמ' <b>{label}</b> · PDF {page}/{total}
            </>
          ) : (
            <>
              עמ' <b>{page}</b>/{total}
            </>
          )}
          {pg?.o && <span className="tag-ocr">OCR</span>}
        </span>
        <button className="btn small" onClick={() => onPage(Math.min(total, page + 1))} disabled={page >= total}>
          הבא
          <Icon name="next" size={14} />
        </button>
      </div>
      <div className="viewer-body">
        {error && <div className="banner banner-error">{error}</div>}
        {img && (
          <figure className="viewer-pageimg">
            <img src={img} alt={`עמוד ${page}`} />
            <figcaption>תמונת העמוד: הטקסט שלו חולץ ב-OCR, והנוסחאות בו נכונות רק בתמונה.</figcaption>
          </figure>
        )}
        {figs.map(
          (f, j) =>
            f && (
              <figure key={j} className="sheet sheet-mini">
                <div className="sheet-body">
                  <img src={f.d} width={f.w} height={f.h} alt={f.c} loading="lazy" />
                </div>
                <figcaption className="titleblock">
                  <span className="tb-title" dir="ltr">
                    {f.c}
                  </span>
                </figcaption>
              </figure>
            ),
        )}
        {pg && (
          <section className="viewer-text-wrap">
            <button className="link" onClick={() => setShowText((v) => !v)}>
              {showText ? "הסתר את טקסט העמוד" : "הצג את טקסט העמוד"}
            </button>
            {showText && (
              <pre className="viewer-text" dir="ltr">
                {pg.t || "(אין טקסט בעמוד הזה)"}
              </pre>
            )}
          </section>
        )}
        {!pg && !error && <div className="block-pending">{text ? "העמוד הזה לא נמצא בספרייה." : "טוען…"}</div>}
      </div>
    </aside>
  );
}
