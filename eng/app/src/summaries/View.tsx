import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Block, BoxKind, Summary } from "./model";
import { BOX_EMOJI, BOX_LABEL, itemNumbers, numbering, textOf } from "./model";
import { hydrateMath } from "./rich";
import { MathView } from "./MathEdit";
import { useFigureSrc } from "./Picture";
import { SHAPE_HEX } from "./media";

/** Block HTML, read-only, with its equations inside lines drawn. */
function Ro({ html, className }: { html: string; className?: string }) {
  const r = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (r.current) hydrateMath(r.current);
  }, [html]);
  return <span ref={r} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** One block, read-only. */
export function BlockView({ b, n, eq }: { b: Block; n?: string; eq?: number }) {
  switch (b.t) {
    case "h": {
      const H = (`h${Math.min(6, b.level + 1)}` as "h2" | "h3" | "h4");
      return (
        <H className={`sm-h sm-h${b.level}`}>
          {b.emoji && <span className="sm-emoji-ro">{b.emoji}</span>}
          {n && <span className="sm-num">{n}</span>}
          <Ro html={b.html} />
        </H>
      );
    }
    case "p":
      return (
        <p className="sm-p sm-ro">
          <Ro html={b.html} />
        </p>
      );
    case "list": {
      const nums = itemNumbers(b.items);
      return (
        <div className={`sm-list ${b.ordered ? "ordered" : ""}`}>
          {b.items.map((it, i) => (
            <div key={i} className={`sm-li lvl-${it.level}`}>
              <span className="sm-bullet">{b.ordered ? nums[i] : ["•", "◦", "▪"][it.level] ?? "•"}</span>
              <Ro className="sm-ro" html={it.html} />
            </div>
          ))}
        </div>
      );
    }
    case "box":
      return (
        <div className={`sm-box box-${b.kind}`}>
          <div className="sm-box-head">
            <span className="sm-box-emoji">{BOX_EMOJI[b.kind]}</span>
            <span className="sm-box-label">{BOX_LABEL[b.kind]}</span>
          </div>
          {b.latex?.trim() && (
            <div className="sm-box-math">
              <MathView latex={b.latex} />
              {eq && <span className="sm-eqn">({eq})</span>}
            </div>
          )}
          {textOf(b.html).trim() && (
            <div className="sm-ro">
              <Ro html={b.html} />
            </div>
          )}
        </div>
      );
    case "math":
      return b.latex.trim() ? (
        <div className="sm-mathblock">
          <MathView latex={b.latex} />
          {eq && <span className="sm-eqn">({eq})</span>}
        </div>
      ) : null;
    case "img":
    case "fig":
      return <PicView b={b} />;
    case "hr":
      return <hr className="sm-hr" />;
  }
}

function PicView({ b }: { b: Extract<Block, { t: "img" } | { t: "fig" }> }) {
  const src = useFigureSrc(b);
  return (
    <figure className={`sm-pic size-${b.size} ${b.side ? "is-side" : ""}`}>
      <div className="sm-pic-area">
        {src && <img src={src} alt={b.caption} />}
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden>
          {b.marks.map((s, i) =>
            s.t === "arrow" ? (
              <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={SHAPE_HEX[s.color]} strokeWidth={3} vectorEffect="non-scaling-stroke" />
            ) : s.t === "rect" ? (
              <rect key={i} x={Math.min(s.x1, s.x2)} y={Math.min(s.y1, s.y2)} width={Math.abs(s.x2 - s.x1)} height={Math.abs(s.y2 - s.y1)} stroke={SHAPE_HEX[s.color]} strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke" />
            ) : s.t === "ellipse" ? (
              <ellipse key={i} cx={(s.x1 + s.x2) / 2} cy={(s.y1 + s.y2) / 2} rx={Math.abs(s.x2 - s.x1) / 2} ry={Math.abs(s.y2 - s.y1) / 2} stroke={SHAPE_HEX[s.color]} strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke" />
            ) : null,
          )}
        </svg>
        {b.marks.map((s, i) =>
          s.t === "text" ? (
            <span key={i} className="sm-pic-text" style={{ right: `${100 - s.x1 / 10}%`, top: `${s.y1 / 10}%`, color: SHAPE_HEX[s.color] }}>
              {s.text}
            </span>
          ) : null,
        )}
      </div>
      {b.caption && <figcaption>{b.caption}</figcaption>}
    </figure>
  );
}

/**
 * Review mode: the summary folded to its headings and boxes. A heading opens its section in
 * full; "open all" shows everything.
 */
export function ReviewView({ blocks }: { blocks: Block[] }) {
  const { heads, eqs } = useMemo(() => numbering(blocks), [blocks]);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const sections = useMemo(() => {
    const out: { head: Block | null; body: Block[] }[] = [{ head: null, body: [] }];
    for (const b of blocks) {
      if (b.t === "h" && b.level <= 2) out.push({ head: b, body: [] });
      else out[out.length - 1].body.push(b);
    }
    return out.filter((s) => s.head || s.body.length);
  }, [blocks]);
  const all = open.size === sections.length;
  return (
    <div className="sm-page sm-review">
      <div className="sm-review-bar">
        <span>מצב חזרה: כותרות ותיבות. לחיצה על כותרת פותחת את הסעיף.</span>
        <button className="sm-tbtn" onClick={() => setOpen(all ? new Set() : new Set(sections.map((s, i) => s.head?.id ?? `s${i}`)))}>
          {all ? "קפל הכל" : "פתח הכל"}
        </button>
      </div>
      {sections.map((s, i) => {
        const key = s.head?.id ?? `s${i}`;
        const isOpen = open.has(key);
        const shown = isOpen ? s.body : s.body.filter((b) => b.t === "box" || b.t === "h" || (b.t === "math" && b.latex.trim()));
        return (
          <section key={key} className={`sm-sec ${isOpen ? "is-open" : ""}`}>
            {s.head && (
              <button className="sm-sec-head" aria-expanded={isOpen} onClick={() => setOpen((o) => (o.has(key) ? new Set([...o].filter((x) => x !== key)) : new Set([...o, key])))}>
                <span className="sm-sec-caret">{isOpen ? "▾" : "▸"}</span>
                <BlockView b={s.head} n={heads.get(s.head.id)} />
              </button>
            )}
            {shown.map((b) => (
              <div key={b.id} className="sm-block">
                <BlockView b={b} n={heads.get(b.id)} eq={eqs.get(b.id)} />
              </div>
            ))}
            {!isOpen && s.body.length > shown.length && <div className="sm-sec-more">{s.body.length - shown.length} פסקאות נוספות</div>}
          </section>
        );
      })}
    </div>
  );
}

export type FilterKind = BoxKind | "math";
/** One kind of box (or every equation) from all the summaries of the lab, by module. */
export function FilterView({ kind, summaries, titles, onOpen }: { kind: FilterKind; summaries: Summary[]; titles: Record<string, string>; onOpen: (moduleId: string) => void }) {
  const groups = summaries
    .map((s) => {
      const { eqs } = numbering(s.blocks);
      const items = s.blocks.filter((b) => (kind === "math" ? (b.t === "math" && b.latex.trim()) || (b.t === "box" && b.kind === "eq") : b.t === "box" && b.kind === kind));
      return { s, items, eqs };
    })
    .filter((g) => g.items.length)
    .sort((a, b) => a.s.moduleId.localeCompare(b.s.moduleId, "en", { numeric: true }));
  return (
    <div className="sm-page sm-filter">
      <h2 className="sm-filter-title">{kind === "math" ? "כל המשוואות" : `כל התיבות: ${BOX_LABEL[kind]}`}</h2>
      {!groups.length && <p className="muted">עוד אין כאלה בסיכומים.</p>}
      {groups.map((g) => (
        <section key={g.s.moduleId} className="sm-filter-group">
          <button className="sm-filter-mod" onClick={() => onOpen(g.s.moduleId)}>
            {g.s.moduleId} · {titles[g.s.moduleId] ?? ""}
          </button>
          {g.items.map((b) => (
            <div key={b.id} className="sm-block">
              <BlockView b={b} eq={g.eqs.get(b.id)} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
