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

/** the toolbar's small line drawings (24 by 24) */
function Glyph({ d }: { d: string }) {
  return (
    <svg className="pt-glyph" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
const SIZE_GLYPH: Record<ImgSize, string> = { s: "M9 9h6v6H9z", m: "M6 7h12v10H6z", l: "M3 5h18v14H3z" };
const TOOL_GLYPH: Record<Tool, string> = {
  arrow: "M5 19L19 5M10 5h9v9",
  rect: "M4 6h16v12H4z",
  ellipse: "M12 5c4.4 0 8 3.1 8 7s-3.6 7-8 7-8-3.1-8-7 3.6-7 8-7z",
  text: "M5 6V4h14v2M12 4v16M9 20h6",
  erase: "M8 20h12M5 15l8-8 6 6-5 5H8z",
};
const HINT: Record<Tool, string> = {
  arrow: "גרור על התמונה כדי למתוח חץ",
  rect: "גרור כדי לסמן מלבן",
  ellipse: "גרור כדי לסמן עיגול",
  text: "לחץ במקום הרצוי כדי לכתוב · גרור תיבה כדי להזיז אותה, ואת הנקודה בפינה כדי לשנות רוחב · לחיצה כפולה עורכת",
  erase: "לחץ על סימון כדי למחוק אותו",
};

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
        <div className="pt" contentEditable={false} onMouseDown={(e) => (e.target as Element).closest("button") && e.preventDefault()}>
          <div className="pt-bar" role="toolbar" aria-label="כלי התמונה">
            <span className="pt-group" role="group" aria-label="גודל התמונה">
              {SIZES.map((z) => (
                <button key={z.id} className="pt-btn" aria-pressed={b.size === z.id} onClick={() => onChange({ size: z.id })} title={z.label}>
                  <Glyph d={SIZE_GLYPH[z.id]} />
                  <span className="pt-label">{z.label}</span>
                </button>
              ))}
            </span>
            <span className="pt-sep" />
            <button className="pt-btn" aria-pressed={!!b.side} onClick={() => onChange({ side: !b.side })} title="התמונה בצד והטקסט זורם לידה">
              <Glyph d="M3 5h8v8H3zM14 6h7M14 10h7M14 14h7M3 18h18" />
              <span className="pt-label">ליד הטקסט</span>
            </button>
            <span className="pt-sep" />
            <button className={`pt-btn pt-main ${mode ? "is-on" : ""}`} aria-pressed={!!mode} onClick={() => setMode(mode ? null : "arrow")} title={mode ? "סיום" : "סימון"}>
              <Glyph d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3" />
              <span className="pt-label">{mode ? "סיום" : "סימון"}</span>
            </button>
            <span className="pt-grow" />
            <button className="pt-btn pt-danger" onClick={onRemove} title="מחק את התמונה" aria-label="מחק את התמונה">
              <Glyph d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
            </button>
          </div>
          {mode && (
            <div className="pt-bar pt-draw" role="toolbar" aria-label="סימון על התמונה">
              <span className="pt-group" role="group" aria-label="כלי">
                {TOOLS.map((t) => (
                  <button key={t.id} className="pt-btn" aria-pressed={mode === t.id} onClick={() => setMode(t.id)} title={t.label}>
                    <Glyph d={TOOL_GLYPH[t.id]} />
                    <span className="pt-label">{t.label}</span>
                  </button>
                ))}
              </span>
              <span className="pt-sep" />
              <span className="pt-colors" role="group" aria-label="צבע">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className="pt-color"
                    style={{ ["--c" as string]: SHAPE_HEX[c] }}
                    aria-pressed={(cur ? cur.color : color) === c}
                    onClick={() => (setColor(c), cur && active !== null && setMark(active, { ...cur, color: c }))}
                    title={c === "k" ? "שחור" : MARK_LABEL[c as Exclude<ShapeColor, "k">]}
                    aria-label={c === "k" ? "שחור" : MARK_LABEL[c as Exclude<ShapeColor, "k">]}
                  />
                ))}
              </span>
              {mode === "text" && cur && (
                <>
                  <span className="pt-sep" />
                  <span className="pt-group" role="group" aria-label="גודל הטקסט">
                    <button className="pt-btn pt-sq" onClick={() => resize(-1)} disabled={(cur.size ?? 1) <= SIZE_STEPS[0]} title="טקסט קטן יותר" aria-label="טקסט קטן יותר">
                      <span className="pt-a is-small">א</span>
                    </button>
                    <button className="pt-btn pt-sq" onClick={() => resize(1)} disabled={(cur.size ?? 1) >= SIZE_STEPS[SIZE_STEPS.length - 1]} title="טקסט גדול יותר" aria-label="טקסט גדול יותר">
                      <span className="pt-a">א</span>
                    </button>
                  </span>
                  {typing === null && (
                    <button className="pt-btn" onClick={() => setTyping(cur.text ?? "")}>
                      <Glyph d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4" />
                      <span className="pt-label">עריכה</span>
                    </button>
                  )}
                  <button className="pt-btn pt-danger" onClick={() => active !== null && removeMark(active)} title="מחק את התיבה" aria-label="מחק את התיבה">
                    <Glyph d="M6 6l12 12M18 6L6 18" />
                  </button>
                </>
              )}
            </div>
          )}
          {mode && <div className="pt-hint">{HINT[mode]}</div>}
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
