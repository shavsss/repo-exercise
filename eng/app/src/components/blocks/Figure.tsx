import { useContext, useEffect, useState } from "react";
import { docMeta, figure, type Figure } from "../../library";
import { MdContext } from "../Markdown";
import { Markdown } from "../Markdown";
import { Sheet } from "./Sheet";
import { PageLabel } from "./SourceTag";

/** An original figure from the sources, cropped and large; clicking opens its page. */
export function FigureBlock({ source }: { source: string }) {
  const ctx = useContext(MdContext);
  const lines = source.split("\n").map((l) => l.trim());
  const no = /^@no:\s*(\d+)/.exec(lines[0] ?? "")?.[1];
  const rest = no ? lines.slice(1) : lines;
  const ref = /^\[?\[?([A-Za-z]\d+[a-z]?(?:\.\d+)?):(\d+):(\d+)\]?\]?$/.exec(rest[0] ?? "");
  const caption = rest.slice(1).join("\n").trim();
  const [fig, setFig] = useState<Figure | null | undefined>(undefined);
  useEffect(() => {
    if (!ref) return;
    let alive = true;
    figure(ref[1], `${ref[2]}-${ref[3]}`)
      .then((f) => alive && setFig(f))
      .catch(() => alive && setFig(null));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest[0]]);
  if (!ref) return ctx.live ? <div className="block-pending">איור בטעינה…</div> : <div className="block-error">הפניה לאיור לא תקינה: {rest[0]}</div>;
  const [, doc, pageStr] = ref;
  const page = Number(pageStr);
  const meta = docMeta(doc);
  const title = caption || fig?.c || "איור מהמקור";
  return (
    <Sheet
      title={title.length > 160 ? title.slice(0, 157) + "…" : title}
      kind="איור מקורי"
      no={no ? `איור ${no}` : undefined}
      source={meta?.short ?? doc}
      page={<PageLabel doc={doc} page={page} />}
    >
      <button className="figure-img" onClick={() => ctx.openSource(doc, page)} title="פתח את העמוד המלא">
        {fig ? <img src={fig.d} width={fig.w} height={fig.h} alt={fig.c} loading="lazy" /> : <span className="block-pending">{fig === null ? "האיור לא נמצא בספרייה" : "טוען איור…"}</span>}
      </button>
      {caption && fig?.c && caption !== fig.c && (
        <div className="figure-orig" dir="ltr">
          <Markdown text={fig.c} inline />
        </div>
      )}
    </Sheet>
  );
}
