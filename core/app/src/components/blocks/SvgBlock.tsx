import DOMPurify from "dompurify";
import { useMemo } from "react";
import { parseHeaders } from "./Callout";
import { Markdown } from "../Markdown";

export function SvgBlock({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const clean = useMemo(
    () => DOMPurify.sanitize(body, { USE_PROFILES: { svg: true, svgFilters: true }, ADD_TAGS: ["use"] }),
    [body],
  );
  const fromBook = headers.source && !headers.source.includes("תוספת");
  return (
    <figure className="viz viz-svg" data-block="svg">
      <div className="viz-bar">
        <span className="viz-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="viz-title">{fromBook ? "שחזור איור" : "איור"}</span>
        {headers.source && <span className="viz-prov">{headers.source}</span>}
      </div>
      <div className="viz-body svg-body" dir="ltr">
        {clean.includes("<svg") ? <div dangerouslySetInnerHTML={{ __html: clean }} /> : <div className="viz-pending is-live">ממתין להשלמת האיור…</div>}
      </div>
      {headers.caption && (
        <figcaption>
          <Markdown text={headers.caption} />
        </figcaption>
      )}
    </figure>
  );
}
