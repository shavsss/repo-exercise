import { useEffect, useRef, useState } from "react";
import { figure } from "../library";
import type { Block, ImgSize, Shape, ShapeColor } from "./model";
import { MARK_LABEL } from "./model";
import { SHAPE_HEX } from "./markStyle";
import { SIZE_STEPS, TextBox, textBoxStyle, useWidth } from "./picText";
import { ArrowDefs, MarkSvg, NumBadge, handlesOf, isSvgMark, moveMark, pullHandle, worthKeeping, type Handle } from "./marks";

type Pic = Extract<Block, { t: "img" } | { t: "fig" }>;
/** "select" picks, moves and resizes marks; every other tool makes one mark and goes back to it (24.11) */
type Tool = "select" | Shape["t"];

const TOOLS: { id: Tool; label: string; glyph: string }[] = [
  { id: "select", label: "בחירה", glyph: "M6 3l12 8-5.5 1.5L10 18z" },
  { id: "arrow", label: "חץ", glyph: "M5 19L19 5M10 5h9v9" },
  { id: "darrow", label: "חץ כפול", glyph: "M5 19L19 5M5 13v6h6M13 5h6v6" },
  { id: "line", label: "קו", glyph: "M5 19L19 5" },
  { id: "rect", label: "מלבן", glyph: "M4 6h16v12H4z" },
  { id: "ellipse", label: "עיגול", glyph: "M12 5c4.4 0 8 3.1 8 7s-3.6 7-8 7-8-3.1-8-7 3.6-7 8-7z" },
  { id: "hl", label: "מרקר", glyph: "M4 10h16v6H4zM8 10V7h8v3" },
  { id: "pen", label: "עט", glyph: "M3 18c2.5-1 3.5-6 6-6s2.5 5 5 5 3.5-6 7-9" },
  { id: "num", label: "מספר", glyph: "M12 3a9 9 0 1 0 0.01 0zM10.5 8.5L12.5 7.5v9" },
  { id: "text", label: "טקסט", glyph: "M5 6V4h14v2M12 4v16M9 20h6" },
];
const COLORS: ShapeColor[] = ["r", "y", "b", "g", "k"];
const SIZES: { id: ImgSize; label: string }[] = [
  { id: "s", label: "קטן" },
  { id: "m", label: "בינוני" },
  { id: "l", label: "רוחב מלא" },
];
const SIZE_GLYPH: Record<ImgSize, string> = { s: "M9 9h6v6H9z", m: "M6 7h12v10H6z", l: "M3 5h18v14H3z" };
const HINT: Record<Tool, string> = {
  select: "לחץ על סימון כדי לבחור אותו · גרור כדי להזיז, ואת הנקודות כדי לשנות גודל · Delete מוחק",
  arrow: "גרור על התמונה כדי למתוח חץ",
  darrow: "גרור כדי למתוח חץ כפול",
  line: "גרור כדי למתוח קו",
  rect: "גרור כדי לסמן מלבן",
  ellipse: "גרור כדי לסמן עיגול",
  hl: "גרור על אזור כדי להדגיש אותו",
  pen: "צייר ביד חופשית",
  num: "לחץ במקום הרצוי כדי לשים מספר (הבא בתור)",
  text: "לחץ במקום הרצוי כדי לכתוב; Enter מסיים",
};
/** a new text box's width, and the narrowest one (0–1000 of the picture) */
const BOX_W = 300;
const BOX_MIN = 60;
/** kinds that take a size (א/א) */
const SIZED = new Set<Shape["t"]>(["text", "num"]);

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

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** the toolbar's small line drawings (24 by 24) */
function Glyph({ d }: { d: string }) {
  return (
    <svg className="pt-glyph" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

type Drag = { i: number; how: "move" | Handle; from: { x: number; y: number }; orig: Shape; now: Shape };

/** A picture block: the picture, the marks drawn on it, a caption, and its tools when it is selected. */
export function Picture({ b, selected, onChange, onRemove }: { b: Pic; selected: boolean; onChange: (patch: Partial<Pic>) => void; onRemove: () => void }) {
  const src = useFigureSrc(b);
  /** null: not marking */
  const [mode, setMode] = useState<Tool | null>(null);
  /** a tool double-clicked stays on after a mark (else it goes back to selecting) */
  const [sticky, setSticky] = useState(false);
  const [color, setColor] = useState<ShapeColor>("r");
  const [draft, setDraft] = useState<Shape | null>(null);
  /** the mark picked (its index in marks), and a text box's text while it is typed */
  const [active, setActive] = useState<number | null>(null);
  const [typing, setTyping] = useState<string | null>(null);
  /** a mark being moved or pulled by a handle: as it is now, committed on release */
  const [drag, setDrag] = useState<Drag | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLElement>(null);
  const areaW = useWidth(area);
  useEffect(() => {
    if (!selected) {
      setMode(null);
      setActive(null);
      setTyping(null);
    }
  }, [selected]);

  const marks = b.marks;
  const marking = !!mode;
  const setMark = (i: number, s: Shape) => onChange({ marks: marks.map((m, j) => (j === i ? s : m)) });
  const removeMark = (i: number) => {
    onChange({ marks: marks.filter((_, j) => j !== i) });
    setActive(null);
    setTyping(null);
  };
  const cur = active !== null ? marks[active] : null;
  const pick = (t: Tool, keep = false) => {
    setMode(t);
    setSticky(keep);
    if (t !== "select") setActive(null);
    setTyping(null);
  };
  /** after one mark: back to selecting, with the new mark picked */
  const made = (i: number) => {
    setActive(i);
    fig.current?.focus({ preventScroll: true });
    if (!sticky) setMode("select");
  };

  const at = (e: { clientX: number; clientY: number }) => {
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
    if (!mode || e.button > 0) return;
    e.preventDefault();
    const p = at(e);
    if (typing !== null) return commitText();
    if (mode === "select") return setActive(null);
    if (mode === "text") {
      // a new box, its top-right corner near the click, and straight into typing
      const x1 = clamp(p.x + BOX_W / 2, BOX_MIN, 1000);
      const s: Shape = { t: "text", x1, y1: clamp(p.y - 20, 0, 960), x2: clamp(x1 - BOX_W, 0, x1 - BOX_MIN), y2: p.y, color, text: "", size: 1 };
      onChange({ marks: [...marks, s] });
      made(marks.length);
      setTyping("");
      return;
    }
    if (mode === "num") {
      const n = Math.max(0, ...marks.filter((m) => m.t === "num").map((m) => Number(m.text) || 0)) + 1;
      onChange({ marks: [...marks, { t: "num", x1: p.x, y1: p.y, x2: p.x, y2: p.y, color, text: String(n), size: 1 }] });
      made(marks.length);
      return;
    }
    area.current?.setPointerCapture?.(e.pointerId);
    setDraft({ t: mode, x1: p.x, y1: p.y, x2: p.x, y2: p.y, color, ...(mode === "pen" ? { pts: [p.x, p.y] } : {}) });
  };
  const move = (e: React.PointerEvent) => {
    if (drag) {
      const p = at(e);
      const o = drag.orig;
      const now = drag.how === "move" ? moveMark(o, p.x - drag.from.x, p.y - drag.from.y) : drag.how === "w" ? pullHandle(o, "w", o.x2 + (p.x - drag.from.x), 0, BOX_MIN) : pullHandle(o, drag.how, p.x, p.y);
      setDrag({ ...drag, now });
      return;
    }
    if (!draft) return;
    const p = at(e);
    if (draft.t === "pen") {
      const pts = draft.pts ?? [];
      if (Math.hypot(p.x - pts[pts.length - 2], p.y - pts[pts.length - 1]) >= 4) setDraft({ ...draft, pts: [...pts, p.x, p.y], x2: p.x, y2: p.y });
      return;
    }
    setDraft({ ...draft, x2: p.x, y2: p.y });
  };
  const up = () => {
    if (drag) {
      if (drag.now !== drag.orig) setMark(drag.i, drag.now);
      setDrag(null);
      return;
    }
    if (!draft) return;
    if (worthKeeping(draft)) {
      onChange({ marks: [...marks, draft] });
      made(marks.length);
    }
    setDraft(null);
  };
  /** press on a mark (or one of its handles): pick it, and move it or pull the handle */
  const grab = (i: number, how: "move" | Handle) => (e: React.PointerEvent) => {
    if (!mode || e.button > 0) return;
    e.stopPropagation();
    if (typing !== null && active === i) return;
    if (typing !== null) commitText();
    // another tool in hand: a press on a mark picks it (and drops the tool), as in any drawing program
    if (mode !== "select") setMode("select");
    e.preventDefault();
    area.current?.setPointerCapture?.(e.pointerId);
    let s = marks[i];
    // an old one-line text box gets its width when it is first resized
    if (how === "w" && s.x2 >= s.x1) {
      const el = (e.currentTarget as HTMLElement).closest(".sm-pic-text") as HTMLElement | null;
      const r = area.current!.getBoundingClientRect();
      s = { ...s, x2: clamp(s.x1 - Math.round(((el?.offsetWidth ?? 120) / r.width) * 1000), 0, s.x1 - BOX_MIN) };
    }
    setActive(i);
    // the keys (Delete, Escape) reach the picture, not the page
    fig.current?.focus({ preventScroll: true });
    setDrag({ i, how, from: at(e), orig: s, now: s });
  };
  const resize = (dir: 1 | -1) => {
    if (active === null || !cur) return;
    const k = SIZE_STEPS.findIndex((v) => v >= (cur.size ?? 1) - 1e-6);
    const next = SIZE_STEPS[clamp((k < 0 ? 2 : k) + dir, 0, SIZE_STEPS.length - 1)];
    setMark(active, { ...cur, size: next });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!marking || active === null || typing !== null) return;
    if ((e.target as HTMLElement).closest("input, textarea, [contenteditable='true']")) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      removeMark(active);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setActive(null);
    }
  };

  const shown = (i: number) => (drag?.i === i ? drag.now : marks[i]);
  const editing = mode === "select";

  return (
    <figure ref={fig} className={`sm-pic size-${b.size} ${b.side ? "is-side" : ""}`} tabIndex={-1} onKeyDownCapture={onKey}>
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
            <button className={`pt-btn pt-main ${marking ? "is-on" : ""}`} aria-pressed={marking} onClick={() => (marking ? (setMode(null), setActive(null), setTyping(null)) : pick("select"))} title={marking ? "סיום" : "סימון"}>
              <Glyph d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3" />
              <span className="pt-label">{marking ? "סיום" : "סימון"}</span>
            </button>
            <span className="pt-grow" />
            <button className="pt-btn pt-danger" onClick={onRemove} title="מחק את התמונה" aria-label="מחק את התמונה">
              <Glyph d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
            </button>
          </div>
          {marking && (
            <div className="pt-bar pt-draw" role="toolbar" aria-label="סימון על התמונה">
              <span className="pt-group pt-tools" role="group" aria-label="כלי">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    className={`pt-btn ${mode === t.id && sticky ? "is-sticky" : ""}`}
                    aria-pressed={mode === t.id}
                    onClick={() => pick(t.id)}
                    onDoubleClick={() => t.id !== "select" && pick(t.id, true)}
                    title={t.id === "select" ? t.label : `${t.label} (לחיצה כפולה: נשאר פעיל)`}
                    aria-label={t.label}
                  >
                    <Glyph d={t.glyph} />
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
              {cur && (
                <>
                  <span className="pt-sep" />
                  {SIZED.has(cur.t) && (
                    <span className="pt-group" role="group" aria-label="גודל">
                      <button className="pt-btn pt-sq" onClick={() => resize(-1)} disabled={(cur.size ?? 1) <= SIZE_STEPS[0]} title="קטן יותר" aria-label="קטן יותר">
                        <span className="pt-a is-small">א</span>
                      </button>
                      <button className="pt-btn pt-sq" onClick={() => resize(1)} disabled={(cur.size ?? 1) >= SIZE_STEPS[SIZE_STEPS.length - 1]} title="גדול יותר" aria-label="גדול יותר">
                        <span className="pt-a">א</span>
                      </button>
                    </span>
                  )}
                  {cur.t === "text" && typing === null && (
                    <button className="pt-btn pt-sq" onClick={() => setTyping(cur.text ?? "")} title="ערוך את הטקסט" aria-label="ערוך את הטקסט">
                      <Glyph d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4" />
                    </button>
                  )}
                  <button className="pt-btn pt-sq pt-danger" onClick={() => active !== null && removeMark(active)} title="מחק את הסימון (Delete)" aria-label="מחק את הסימון">
                    <Glyph d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                  </button>
                </>
              )}
            </div>
          )}
          {marking && <div className="pt-hint">{HINT[mode!]}{mode !== "select" && !sticky ? " · אחרי סימון אחד חוזרים לבחירה" : ""}</div>}
        </div>
      )}
      <div ref={area} className={`sm-pic-area ${marking ? `drawing tool-${mode}` : ""}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {src ? <img src={src} alt={b.caption} draggable={false} /> : <div className="sm-pic-missing">{b.t === "fig" ? "טוען את האיור מהספר…" : "אין תמונה"}</div>}
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden>
          <ArrowDefs prefix="ah" colors={COLORS} />
          {marks.map((_, i) => {
            const s = shown(i);
            return isSvgMark(s) ? <MarkSvg key={i} s={s} prefix="ah" onDown={marking ? grab(i, "move") : undefined} active={marking && active === i} /> : null;
          })}
          {draft && <MarkSvg s={draft} prefix="ah" />}
        </svg>
        {marks.map((_, i) => {
          const s = shown(i);
          const on = active === i;
          if (s.t === "num")
            return <NumBadge key={i} s={s} areaW={areaW} className={`${marking ? "is-editable" : ""} ${on && marking ? "is-active" : ""}`} onPointerDown={marking ? grab(i, "move") : undefined} />;
          if (s.t !== "text") return null;
          if (on && typing !== null)
            return (
              <div key={i} className="sm-pic-text is-active is-typing" style={{ ...textBoxStyle(s, areaW), whiteSpace: undefined, ...(s.x2 < s.x1 ? { width: `${(s.x1 - s.x2) / 10}%`, maxWidth: undefined } : { minWidth: "8em" }) }} onPointerDown={(e) => e.stopPropagation()}>
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
          return (
            <TextBox
              key={i}
              s={s}
              areaW={areaW}
              className={`${marking ? "is-editable" : ""} ${on && marking ? "is-active" : ""}`}
              onPointerDown={marking ? grab(i, "move") : undefined}
              onDoubleClick={marking ? () => (setMode("select"), setActive(i), setTyping(s.text ?? "")) : undefined}
            >
              {marking && on && <span className="sm-pic-grip" onPointerDown={grab(i, "w")} title="גרור כדי לשנות רוחב" aria-hidden />}
            </TextBox>
          );
        })}
        {editing && cur && active !== null && typing === null &&
          handlesOf(shown(active)).map((hd) => (
            <span key={hd.h} className="mk-handle" style={{ left: `${hd.x / 10}%`, top: `${hd.y / 10}%`, ["--tb" as string]: SHAPE_HEX[cur.color] }} onPointerDown={grab(active, hd.h)} aria-hidden />
          ))}
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
