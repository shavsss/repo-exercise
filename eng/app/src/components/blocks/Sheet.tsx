import type { ReactNode } from "react";

/** A drawing sheet: the content in a frame, with a title block of name, number, source and page. */
export function Sheet({ title, no, source, page, kind, children }: { title: string; no?: string; source?: string; page?: ReactNode; kind?: string; children: ReactNode }) {
  return (
    <figure className="sheet">
      <div className="sheet-body">{children}</div>
      <figcaption className="titleblock">
        <span className="tb-title">{title}</span>
        {kind && <span className="tb-cell">{kind}</span>}
        {no && <span className="tb-cell">{no}</span>}
        {source && <span className="tb-cell">{source}</span>}
        {page && <span className="tb-cell">{page}</span>}
      </figcaption>
    </figure>
  );
}
