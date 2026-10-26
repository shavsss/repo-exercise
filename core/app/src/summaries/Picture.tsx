import { useEffect, useRef, useState } from "react";
import { figure } from "../library";
import type { Block, ImgSize, Shape, ShapeColor } from "./model";
import { MARK_LABEL } from "./model";
import { SHAPE_HEX } from "./media";

type Pic = Extract<Block, { t: "img" } | { t: "fig" }>;
type Tool = Shape["t"] | "erase";

const TOOLS: { id: Tool; label: string }[] = [
  { id: "arrow", label: "חץ" },
  { id: "rect", label: "מלבן" },
  { id: "ellipse", label: "עיגול" },
  { id: "text", label: "טקסט" },
  { id: "erase", label: "מחק סימון" },
];
const COLORS: ShapeColor[] = ["r", "y", "b", "g", "k"];
const SIZES: { id: ImgSize; label: string }[] = [
  { id: "s", label: "קטן" },
  { id: "m", label: "בינוני" },
  { id: "l", label: "רוחב מלא" },
];

/** A figure from one of the library's books, by its key ("page-index"). */
export function useFigureSrc(b: Pic) {
  const [src, setSrc] = useState(b.t === "img" ? b.src : "");
  useEffect(() => {
    if (b.t === "img") {
      setSrc(b.src);
      return;
    }
    let live = true;
    figure(b.doc, b.key)
      .then((f) => live && setSrc(f?.d ?? ""))
      .catch(() => live && setSrc(""));
    return () => {
      live = false;
    };
  }, [b]);
  return src;
}

function ShapeSvg({ s, onErase }: { s: Shape; onErase?: () => void }) {
  const c = SHAPE_HEX[s.color];
  const common = { stroke: c, strokeWidth: 3, fill: "none", vectorEffect: "non-scaling-stroke" as const, onPointerDown: onErase ? (e: React.PointerEvent) => (e.stopPropagation(), onErase()) : undefined, style: onErase ? { cursor: "pointer", pointerEvents: "stroke" as const } : undefined };
  if (s.t === "arrow") return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} {...common} markerEnd={`url(#ah-${s.color})`} />;
  if (s.t === "rect") return <rect x={Math.min(s.x1, s.x2)} y={Math.min(s.y1, s.y2)} width={Math.abs(s.x2 - s.x1)} height={Math.abs(s.y2 - s.y1)} {...common} />;
  if (s.t === "ellipse") return <ellipse cx={(s.x1 + s.x2) / 2} cy={(s.y1 + s.y2) / 2} rx={Math.abs(s.x2 - s.x1) / 2} ry={Math.abs(s.y2 - s.y1) / 2} {...common} />;
  return null;
}

/** A picture block: the picture, the marks drawn on it, a caption, and its tools when it is selected. */
export function Picture({ b, selected, onChange, onRemove }: { b: Pic; selected: boolean; onChange: (patch: Partial<Pic>) => void; onRemove: () => void }) {
  const src = useFigureSrc(b);
  const [mode, setMode] = useState<Tool | null>(null);
  const [color, setColor] = useState<ShapeColor>("r");
  const [draft, setDraft] = useState<Shape | null>(null);
  const [typing, setTyping] = useState<{ x: number; y: number; text: string } | null>(null);
  const area = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected) {
      setMode(null);
      setTyping(null);
    }
  }, [selected]);

  const at = (e: React.PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    return { x: Math.round(((e.clientX - r.left) / r.width) * 1000), y: Math.round(((e.clientY - r.top) / r.height) * 1000) };
  };
  const down = (e: React.PointerEvent) => {
    if (!mode || mode === "erase") return;
    e.preventDefault();
    const p = at(e);
    if (mode === "text") {
      setTyping({ x: p.x, y: p.y, text: "" });
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDraft({ t: mode, x1: p.x, y1: p.y, x2: p.x, y2: p.y, color });
  };
  const move = (e: React.PointerEvent) => {
    if (!draft) return;
    const p = at(e);
    setDraft({ ...draft, x2: p.x, y2: p.y });
  };
  const up = () => {
    if (!draft) return;
    if (Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1) > 12) onChange({ marks: [...b.marks, draft] });
    setDraft(null);
  };
  const commitText = () => {
    if (typing?.text.trim()) onChange({ marks: [...b.marks, { t: "text", x1: typing.x, y1: typing.y, x2: typing.x, y2: typing.y, color, text: typing.text.trim() }] });
    setTyping(null);
  };

  return (
    <figure className={`sm-pic size-${b.size} ${b.side ? "is-side" : ""}`} tabIndex={-1}>
      {selected && (
        <div className="sm-pic-tools" contentEditable={false}>
          <div className="seg" role="group" aria-label="גודל">
            {SIZES.map((s) => (
              <button key={s.id} aria-pressed={b.size === s.id} onClick={() => onChange({ size: s.id })}>
                {s.label}
              </button>
            ))}
          </div>
          <button className="sm-tbtn" aria-pressed={!!b.side} onClick={() => onChange({ side: !b.side })} title="התמונה בצד והטקסט זורם לידה">
            ליד הטקסט
          </button>
          <button className="sm-tbtn" aria-pressed={!!mode} onClick={() => setMode(mode ? null : "arrow")}>
            {mode ? "סיים סימון" : "סמן על התמונה"}
          </button>
          <button className="sm-tbtn danger" onClick={onRemove}>
            מחק תמונה
          </button>
          {mode && (
            <div className="sm-pic-draw">
              <div className="seg" role="group" aria-label="כלי">
                {TOOLS.map((t) => (
                  <button key={t.id} aria-pressed={mode === t.id} onClick={() => setMode(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="sm-colors" role="group" aria-label="צבע">
                {COLORS.map((c) => (
                  <button key={c} className="sm-color" style={{ background: SHAPE_HEX[c] }} aria-pressed={color === c} onClick={() => setColor(c)} title={c === "k" ? "שחור" : MARK_LABEL[c as Exclude<ShapeColor, "k">]} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div ref={area} className={`sm-pic-area ${mode ? `drawing tool-${mode}` : ""}`} onPointerDown={down} onPointerMove={move} onPointerUp={up}>
        {src ? <img src={src} alt={b.caption} draggable={false} /> : <div className="sm-pic-missing">{b.t === "fig" ? "טוען את האיור מהספר…" : "אין תמונה"}</div>}
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden={mode !== "erase"}>
          <defs>
            {COLORS.map((c) => (
              <marker key={c} id={`ah-${c}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill={SHAPE_HEX[c]} />
              </marker>
            ))}
          </defs>
          {b.marks.map((s, i) => (
            <ShapeSvg key={i} s={s} onErase={mode === "erase" ? () => onChange({ marks: b.marks.filter((_, j) => j !== i) }) : undefined} />
          ))}
          {draft && <ShapeSvg s={draft} />}
        </svg>
        {b.marks.map((s, i) =>
          s.t === "text" ? (
            <span
              key={i}
              className="sm-pic-text"
              style={{ right: `${100 - s.x1 / 10}%`, top: `${s.y1 / 10}%`, color: SHAPE_HEX[s.color], cursor: mode === "erase" ? "pointer" : undefined }}
              onPointerDown={mode === "erase" ? (e) => (e.stopPropagation(), onChange({ marks: b.marks.filter((_, j) => j !== i) })) : undefined}
            >
              {s.text}
            </span>
          ) : null,
        )}
        {typing && (
          <input
            className="sm-pic-input"
            style={{ right: `${100 - typing.x / 10}%`, top: `${typing.y / 10}%`, color: SHAPE_HEX[color] }}
            autoFocus
            value={typing.text}
            placeholder="כתוב ואז Enter"
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setTyping({ ...typing, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitText();
              if (e.key === "Escape") setTyping(null);
            }}
            onBlur={commitText}
          />
        )}
      </div>
      <figcaption>
        <input className="sm-caption" value={b.caption} placeholder={b.t === "fig" ? "כיתוב (מהספר)" : "כיתוב לתמונה"} onChange={(e) => onChange({ caption: e.target.value })} />
        {b.t === "fig" && <span className="sm-fig-src">{b.doc} · עמ' PDF {b.key.split("-")[0]}</span>}
      </figcaption>
    </figure>
  );
}
