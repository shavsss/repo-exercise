import { useEffect, useMemo, useState } from "react";
import { figure, getIndex, type Figure } from "../library";

/** Choosing a figure from the books of the library: a book, a page, then the figure. */
export function FigurePicker({ docs, onPick, onClose }: { docs: string[]; onPick: (doc: string, key: string, caption: string) => void; onClose: () => void }) {
  const index = getIndex();
  const withFigs = useMemo(() => {
    const all = Object.entries(index?.docs ?? {}).filter(([, d]) => Object.keys(d.figs ?? {}).length);
    const first = all.filter(([k]) => docs.includes(k));
    const rest = all.filter(([k]) => !docs.includes(k));
    return { first, rest };
  }, [index, docs]);
  const [doc, setDoc] = useState(withFigs.first[0]?.[0] ?? withFigs.rest[0]?.[0] ?? "");
  const [page, setPage] = useState<string | null>(null);
  const [figs, setFigs] = useState<{ key: string; f: Figure | null }[]>([]);
  const pages = useMemo(() => Object.entries(index?.docs[doc]?.figs ?? {}).sort((a, b) => Number(a[0]) - Number(b[0])), [index, doc]);
  useEffect(() => {
    if (!page) return setFigs([]);
    const caps = index?.docs[doc]?.figs[page] ?? [];
    let live = true;
    Promise.all(caps.map((_, j) => figure(doc, `${page}-${j}`).catch(() => null))).then((list) => live && setFigs(list.map((f, j) => ({ key: `${page}-${j}`, f }))));
    return () => {
      live = false;
    };
  }, [doc, page, index]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="sm-modal" role="dialog" aria-label="איור מהספר" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sm-modal-box sm-figpick">
        <header>
          <b>איור מהספר</b>
          <select value={doc} onChange={(e) => (setDoc(e.target.value), setPage(null))} aria-label="ספר">
            {withFigs.first.length > 0 && (
              <optgroup label="מקורות המודול">
                {withFigs.first.map(([k, d]) => (
                  <option key={k} value={k}>
                    {d.short} · {d.title}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="כל הספרייה">
              {withFigs.rest.map(([k, d]) => (
                <option key={k} value={k}>
                  {d.short} · {d.title}
                </option>
              ))}
            </optgroup>
          </select>
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </header>
        <div className="sm-figpick-body">
          <ol className="sm-figpick-pages">
            {pages.map(([p, caps]) => (
              <li key={p}>
                <button aria-pressed={page === p} onClick={() => setPage(p)}>
                  <b>עמ' {p}</b> {caps[0]?.slice(0, 70)}
                </button>
              </li>
            ))}
          </ol>
          <div className="sm-figpick-figs">
            {!page && <p className="muted">בחר עמוד מהרשימה.</p>}
            {figs.map(({ key, f }) =>
              f ? (
                <button key={key} className="sm-figpick-fig" onClick={() => onPick(doc, key, f.c)}>
                  <img src={f.d} alt="" />
                  <span>{f.c.slice(0, 140)}</span>
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
