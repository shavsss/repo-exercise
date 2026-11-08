import { useContext, useEffect, useState } from "react";
import { docMeta, docText } from "../../library";
import { MdContext } from "../Markdown";
import { Icon } from "../Icon";

const labels = new Map<string, Record<string, string | null>>();

/** The printed page label of a PDF page, once the document's text is loaded. */
export function usePageLabel(doc: string, page: number) {
  const [label, setLabel] = useState<string | null | undefined>(() => labels.get(doc)?.[String(page)]);
  useEffect(() => {
    let alive = true;
    const known = labels.get(doc);
    if (known) {
      setLabel(known[String(page)] ?? null);
      return;
    }
    docText(doc)
      .then((t) => {
        const map = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v.l]));
        labels.set(doc, map);
        if (alive) setLabel(map[String(page)] ?? null);
      })
      .catch(() => alive && setLabel(null));
    return () => {
      alive = false;
    };
  }, [doc, page]);
  return label;
}

export function PageLabel({ doc, page }: { doc: string; page: number }) {
  const label = usePageLabel(doc, page);
  const article = docMeta(doc)?.kind === "article";
  return (
    <bdi>
      עמ' {article || !label ? page : label}
    </bdi>
  );
}

/** [[DOC:PAGE]]: the short source name and the printed page; clicking opens the page. */
export function SourceTag({ doc, page }: { doc: string; page: number }) {
  const ctx = useContext(MdContext);
  const meta = docMeta(doc);
  return (
    <button className="srctag" onClick={() => ctx.openSource(doc, page)} title={`${meta?.title ?? doc}, עמוד PDF ${page}`}>
      <Icon name="book" size={13} />
      <bdi>{meta?.short ?? doc}</bdi>
      <span className="srctag-sep">·</span>
      <PageLabel doc={doc} page={page} />
    </button>
  );
}
