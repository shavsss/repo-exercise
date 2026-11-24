import { useEffect, useRef, useState } from "react";
import { figure } from "../library";
import type { Block, ImgSize, Shape, ShapeColor } from "./model";
import { MARK_LABEL } from "./model";
import { SHAPE_HEX } from "./media";
import { SIZE_STEPS, TextBox, textBoxStyle, useWidth } from "./picText";

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
/** a new text box's width, and the narrowest one (0–1000 of the picture) */
const BOX_W = 300;
const BOX_MIN = 60;

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

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** A picture block: the picture, the marks drawn on it, a caption, and its tools when it is selected. */
export function Picture({ b, selected, onChange, onRemove }: { b: Pic; selected: boolean; onChange: (patch: Partial<Pic>) => void; onRemove: () => void }) {
  const src = useFigureSrc(b);
  const [mode, setMode] = useState<Tool | null>(null);
  const [color, setColor] = useState<ShapeColor>("r");
  const [draft, setDraft] = useState<Shape | null>(null);
  /** the text box being worked on (its index in marks), and whether its text is open for typing */
  const [active, setActive] = useState<number | null>(null);
  const [typing, setTyping] = useState<string | null>(null);
  /** a box being moved or resized: the shape as it is now, committed on release */
  const [drag, setDrag] = useState<{ i: number; how: "move" | "size"; from: { x: number; y: number }; orig: Shape; now: Shape } | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const areaW = useWidth(area);
  useEffect(() => {
    if (!selected) {
      setMode(null);
      setActive(null);
      setTyping(null);
    }
  }, [selected]);
  useEffect(() => {
    if (mode !== "text") {
      setActive(null);
      setTyping(null);
    }
  }, [mode]);

  const marks = b.marks;
  const setMark = (i: number, s: Shape) => onChange({ marks: marks.map((m, j) => (j === i ? s : m)) });
  const removeMark = (i: number) => {
    onChange({ marks: marks.filter((_, j) => j !== i) });
    setActive(null);
    setTyping(null);
  };
  const cur = active !== null ? marks[active] : null;

  const at = (e: React.PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    return { x: Math.round(((e.clientX - r.left) / r.width) * 1000), y: Math.round(((e.clientY - r.top) / r.height) * 1000) };
  };
  /** the text being typed goes into its box; an empty new box goes away */
  const commitText = () => {
    if (active === null || typing === null) return;
    const s = marks[active];
    if (!typing.trim()) removeMark(active);
    else if (s && typing !== s.text) setMark(active, { ...s, text: typing.replace(/\s+$/, "") });
    setTyping(null);
  };
  const down = (e: React.PointerEvent) => {
    if (!mode || mode === "erase") return;
    e.preventDefault();
    const p = at(e);
    if (mode === "text") {
      if (typing !== null) return commitText();
      // a click beside the picked box lets it go
      if (active !== null) return setActive(null);
      // a new box, its top-right corner where he clicked, and straight into typing
      const x1 = clamp(p.x + BOX_W / 2, BOX_MIN, 1000);
      const s: Shape = { t: "text", x1, y1: clamp(p.y - 20, 0, 960), x2: clamp(x1 - BOX_W, 0, x1 - BOX_MIN), y2: p.y, color, text: "", size: 1 };
      onChange({ marks: [...marks, s] });
      setActive(marks.length);
      setTyping("");
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDraft({ t: mode, x1: p.x, y1: p.y, x2: p.x, y2: p.y, color });
  };
  const move = (e: React.PointerEvent) => {
    if (drag) {
      const p = at(e);
      const dx = p.x - drag.from.x;
      const dy = p.y - drag.from.y;
      const o = drag.orig;
      const w = o.x1 - o.x2;
      const now =
        drag.how === "move"
          ? { ...o, x1: clamp(o.x1 + dx, Math.max(w, 20), 1000), x2: clamp(o.x1 + dx, Math.max(w, 20), 1000) - w, y1: clamp(o.y1 + dy, 0, 980) }
          : { ...o, x2: clamp(o.x2 + dx, 0, o.x1 - BOX_MIN) };
      setDrag({ ...drag, now });
      return;
    }
    if (!draft) return;
    const p = at(e);
    setDraft({ ...draft, x2: p.x, y2: p.y });
  };
  const up = () => {
    if (drag) {
      if (drag.now !== drag.orig) setMark(drag.i, drag.now);
      setDrag(null);
      return;
    }
    if (!draft) return;
    if (Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1) > 12) onChange({ marks: [...marks, draft] });
    setDraft(null);
  };
  /** press on a box (or its corner) in the text tool: pick it, and move or resize it */
  const grab = (i: number, how: "move" | "size") => (e: React.PointerEvent) => {
    e.stopPropagation();
    if (mode === "erase") return removeMark(i);
    if (mode !== "text" || typing !== null) return;
    e.preventDefault();
    area.current?.setPointerCapture?.(e.pointerId);
    let s = marks[i];
    // an old one-line box gets its width when it is first resized
    if (how === "size" && s.x2 >= s.x1) {
      const el = (e.currentTarget as HTMLElement).closest(".sm-pic-text") as HTMLElement | null;
      const r = area.current!.getBoundingClientRect();
      s = { ...s, x2: clamp(s.x1 - Math.round(((el?.offsetWidth ?? 120) / r.width) * 1000), 0, s.x1 - BOX_MIN) };
    }
    setActive(i);
    setDrag({ i, how, from: at(e), orig: s, now: s });
  };
  const resize = (dir: 1 | -1) => {
    if (active === null || !cur) return;
    const k = SIZE_STEPS.findIndex((v) => v >= (cur.size ?? 1) - 1e-6);
    const next = SIZE_STEPS[clamp((k < 0 ? 2 : k) + dir, 0, SIZE_STEPS.length - 1)];
    setMark(active, { ...cur, size: next });
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
                  <button
                    key={c}
                    className="sm-color"
                    style={{ background: SHAPE_HEX[c] }}
                    aria-pressed={(cur ? cur.color : color) === c}
                    onClick={() => (setColor(c), cur && active !== null && setMark(active, { ...cur, color: c }))}
                    title={c === "k" ? "שחור" : MARK_LABEL[c as Exclude<ShapeColor, "k">]}
                  />
                ))}
              </div>
              {mode === "text" && (
                <div className="sm-pic-textbar" onMouseDown={(e) => e.preventDefault()}>
                  {cur ? (
                    <>
                      <span className="seg" role="group" aria-label="גודל הטקסט">
                        <button onClick={() => resize(-1)} disabled={(cur.size ?? 1) <= SIZE_STEPS[0]} title="טקסט קטן יותר" aria-label="טקסט קטן יותר">
                          א−
                        </button>
                        <button onClick={() => resize(1)} disabled={(cur.size ?? 1) >= SIZE_STEPS[SIZE_STEPS.length - 1]} title="טקסט גדול יותר" aria-label="טקסט גדול יותר">
                          א+
                        </button>
                      </span>
                      {typing === null && (
                        <button className="sm-tbtn" onClick={() => setTyping(cur.text ?? "")}>
                          ערוך טקסט
                        </button>
                      )}
                      <button className="sm-tbtn danger" onClick={() => active !== null && removeMark(active)}>
                        מחק תיבה
                      </button>
                    </>
                  ) : (
                    <span className="sm-pic-hint">לחץ על התמונה כדי להוסיף תיבת טקסט. גרור תיבה כדי להזיז, ואת הפינה כדי לשנות רוחב; לחיצה כפולה עורכת.</span>
                  )}
                </div>
              )}
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
          {marks.map((s, i) => (
            <ShapeSvg key={i} s={s} onErase={mode === "erase" ? () => removeMark(i) : undefined} />
          ))}
          {draft && <ShapeSvg s={draft} />}
        </svg>
        {marks.map((m, i) => {
          if (m.t !== "text") return null;
          const s = drag?.i === i ? drag.now : m;
          const on = active === i;
          if (on && typing !== null)
            return (
              <div key={i} className="sm-pic-text is-active is-typing" style={{ ...textBoxStyle(s, areaW), whiteSpace: undefined, minWidth: s.x2 < s.x1 ? undefined : "8em" }} onPointerDown={(e) => e.stopPropagation()}>
                <textarea
                  className="sm-pic-input"
                  dir="auto"
                  autoFocus
                  rows={Math.max(1, typing.split("\n").length)}
                  value={typing}
                  placeholder="כתוב כאן"
                  onChange={(e) => setTyping(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      commitText();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      if (!s.text) removeMark(i);
                      setTyping(null);
                    }
                  }}
                  onBlur={commitText}
                />
              </div>
            );
          const editable = mode === "text";
          return (
            <TextBox
              key={i}
              s={s}
              areaW={areaW}
              className={`${editable ? "is-editable" : ""} ${on ? "is-active" : ""} ${mode === "erase" ? "is-erase" : ""}`}
              onPointerDown={mode === "text" || mode === "erase" ? grab(i, "move") : undefined}
              onDoubleClick={editable ? () => (setActive(i), setTyping(m.text ?? "")) : undefined}
            >
              {editable && <span className="sm-pic-grip" onPointerDown={grab(i, "size")} title="גרור כדי לשנות רוחב" aria-hidden />}
            </TextBox>
          );
        })}
      </div>
      <figcaption>
        <textarea
          className="sm-caption"
          rows={1}
          dir="auto"
          value={b.caption}
          placeholder={b.t === "fig" ? "כיתוב (מהספר)" : "כיתוב לתמונה"}
          ref={(el) => {
            if (!el) return;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          onChange={(e) => onChange({ caption: e.target.value.replace(/\n/g, " ") })}
        />
        {b.t === "fig" && <span className="sm-fig-src">{b.doc} · עמ' PDF {b.key.split("-")[0]}</span>}
      </figcaption>
    </figure>
  );
}
