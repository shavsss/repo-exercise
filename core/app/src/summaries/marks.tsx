// The marks drawn on a picture in the summaries (24.11, the learner: every mark can be picked, moved and
// resized, and more kinds of marks). One place for what a mark looks like, so the editor (Picture.tsx), the
// reading view (View.tsx) and the export (media.ts, on a canvas) draw the same thing; and for moving a mark
// and pulling its handles. Coordinates are 0–1000 over the picture, so marks follow its size.
// Text boxes are in picText.tsx. Same file in both labs.
import type { CSSProperties, PointerEvent as RPointerEvent } from "react";
import type { Shape, ShapeColor } from "./model";
import { SHAPE_HEX, fontPx } from "./markStyle";

export type MarkKind = Shape["t"];

/** kinds drawn in the SVG layer; text and num are HTML over it */
export const isSvgMark = (s: Shape) => s.t !== "text" && s.t !== "num";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The arrow heads, one per colour (a prefix keeps the editor's and the view's ids apart). */
export function ArrowDefs({ prefix, colors }: { prefix: string; colors: ShapeColor[] }) {
  return (
    <defs>
      {colors.map((c) => (
        <marker key={c} id={`${prefix}-${c}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={SHAPE_HEX[c]} />
        </marker>
      ))}
    </defs>
  );
}

const penPath = (pts: number[]) => {
  let d = "";
  for (let i = 0; i + 1 < pts.length; i += 2) d += `${i ? "L" : "M"}${pts[i]} ${pts[i + 1]}`;
  return d;
};

/**
 * One mark in the SVG layer. With `onDown`, a wide invisible stroke over it catches the pointer, so a thin
 * line is easy to pick; `active` draws it with a soft halo.
 */
export function MarkSvg({ s, prefix, onDown, active }: { s: Shape; prefix: string; onDown?: (e: RPointerEvent) => void; active?: boolean }) {
  const c = SHAPE_HEX[s.color];
  const ns = "non-scaling-stroke" as const;
  const line = { stroke: c, strokeWidth: 3, fill: "none", vectorEffect: ns, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const x = Math.min(s.x1, s.x2);
  const y = Math.min(s.y1, s.y2);
  const w = Math.abs(s.x2 - s.x1);
  const h = Math.abs(s.y2 - s.y1);
  let shape: React.ReactElement | null = null;
  let hit: React.ReactElement | null = null;
  const hitProps = onDown ? { stroke: "transparent", strokeWidth: 16, vectorEffect: ns, onPointerDown: onDown, style: { cursor: "move", pointerEvents: "stroke" as const } } : null;
  if (s.t === "arrow" || s.t === "line" || s.t === "darrow") {
    shape = <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} {...line} markerEnd={s.t !== "line" ? `url(#${prefix}-${s.color})` : undefined} markerStart={s.t === "darrow" ? `url(#${prefix}-${s.color})` : undefined} />;
    if (hitProps) hit = <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} {...hitProps} />;
  } else if (s.t === "rect") {
    shape = <rect x={x} y={y} width={w} height={h} {...line} />;
    if (hitProps) hit = <rect x={x} y={y} width={w} height={h} fill="none" {...hitProps} />;
  } else if (s.t === "ellipse") {
    shape = <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} {...line} />;
    if (hitProps) hit = <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="none" {...hitProps} />;
  } else if (s.t === "hl") {
    // a highlighter: the colour laid over the picture, which still shows through
    shape = <rect x={x} y={y} width={w} height={h} fill={c} fillOpacity={0.28} style={{ mixBlendMode: "multiply" }} onPointerDown={onDown} {...(onDown ? { cursor: "move", pointerEvents: "all" } : {})} />;
  } else if (s.t === "pen" && s.pts?.length) {
    const d = penPath(s.pts);
    shape = <path d={d} {...line} />;
    if (hitProps) hit = <path d={d} fill="none" {...hitProps} />;
  }
  if (!shape) return null;
  return (
    <g className={active ? "mk-active" : undefined} style={active ? { filter: `drop-shadow(0 0 3px ${c})` } : undefined}>
      {shape}
      {hit}
    </g>
  );
}

/** A numbered badge: a filled circle, centred on (x1, y1), its size with the picture. */
export function numStyle(s: Shape, areaW: number): CSSProperties {
  const d = fontPx(areaW, s.size) * 1.9;
  return { left: `${s.x1 / 10}%`, top: `${s.y1 / 10}%`, width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2, fontSize: d * 0.55, ["--tb" as string]: SHAPE_HEX[s.color] };
}

export function NumBadge({ s, areaW, className = "", children, ...rest }: { s: Shape; areaW: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`sm-pic-num ${className}`} style={numStyle(s, areaW)} {...rest}>
      {s.text}
      {children}
    </div>
  );
}

/** the corners and ends a mark can be pulled by */
export type Handle = "x1y1" | "x2y2" | "x1y2" | "x2y1" | "w";
export function handlesOf(s: Shape): { h: Handle; x: number; y: number }[] {
  if (s.t === "arrow" || s.t === "line" || s.t === "darrow")
    return [
      { h: "x1y1", x: s.x1, y: s.y1 },
      { h: "x2y2", x: s.x2, y: s.y2 },
    ];
  if (s.t === "rect" || s.t === "ellipse" || s.t === "hl")
    return [
      { h: "x1y1", x: s.x1, y: s.y1 },
      { h: "x2y2", x: s.x2, y: s.y2 },
      { h: "x1y2", x: s.x1, y: s.y2 },
      { h: "x2y1", x: s.x2, y: s.y1 },
    ];
  return [];
}

/** the box a mark covers */
function bounds(s: Shape) {
  if (s.t === "pen" && s.pts?.length) {
    const xs = s.pts.filter((_, i) => i % 2 === 0);
    const ys = s.pts.filter((_, i) => i % 2 === 1);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  }
  if (s.t === "num") return { x0: s.x1, x1: s.x1, y0: s.y1, y1: s.y1 };
  if (s.t === "text") return { x0: Math.min(s.x1, s.x2), x1: s.x1, y0: s.y1, y1: s.y1 };
  return { x0: Math.min(s.x1, s.x2), x1: Math.max(s.x1, s.x2), y0: Math.min(s.y1, s.y2), y1: Math.max(s.y1, s.y2) };
}

/** The mark moved by (dx, dy), kept inside the picture. */
export function moveMark(s: Shape, dx: number, dy: number): Shape {
  const b = bounds(s);
  const mx = clamp(dx, -b.x0, 1000 - b.x1);
  const my = clamp(dy, -b.y0, (s.t === "text" ? 980 : 1000) - b.y1);
  return { ...s, x1: s.x1 + mx, x2: s.x2 + mx, y1: s.y1 + my, y2: s.y2 + my, ...(s.pts ? { pts: s.pts.map((v, i) => v + (i % 2 ? my : mx)) } : {}) };
}

/** The mark with one handle pulled to (x, y). */
export function pullHandle(s: Shape, h: Handle, x: number, y: number, minTextW = 60): Shape {
  x = clamp(x, 0, 1000);
  y = clamp(y, 0, 1000);
  if (h === "w") return { ...s, x2: clamp(x, 0, s.x1 - minTextW) };
  if (h === "x1y1") return { ...s, x1: x, y1: y };
  if (h === "x2y2") return { ...s, x2: x, y2: y };
  if (h === "x1y2") return { ...s, x1: x, y2: y };
  return { ...s, x2: x, y1: y };
}

/** Is a just-drawn mark big enough to keep (a slip of the hand is not a mark)? */
export function worthKeeping(s: Shape) {
  if (s.t === "pen") return (s.pts?.length ?? 0) >= 6;
  return Math.hypot(s.x2 - s.x1, s.y2 - s.y1) > 12;
}

/* ---------------- the same marks on a canvas, for the export ---------------- */
function head(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, size: number) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - size * Math.cos(a - 0.45), y2 - size * Math.sin(a - 0.45));
  g.lineTo(x2 - size * Math.cos(a + 0.45), y2 - size * Math.sin(a + 0.45));
  g.closePath();
  g.fill();
}

/** One mark (not a text box) on a canvas of the picture's size. */
export function drawMark(g: CanvasRenderingContext2D, s: Shape, w: number, h: number) {
  const X = (v: number) => (v / 1000) * w;
  const Y = (v: number) => (v / 1000) * h;
  const lw = Math.max(2, Math.round(Math.max(w, h) / 260));
  const c = SHAPE_HEX[s.color];
  g.save();
  g.strokeStyle = g.fillStyle = c;
  g.lineWidth = lw;
  g.lineCap = g.lineJoin = "round";
  const [x1, y1, x2, y2] = [X(s.x1), Y(s.y1), X(s.x2), Y(s.y2)];
  if (s.t === "arrow" || s.t === "line" || s.t === "darrow") {
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
    if (s.t !== "line") head(g, x1, y1, x2, y2, lw * 5);
    if (s.t === "darrow") head(g, x2, y2, x1, y1, lw * 5);
  } else if (s.t === "rect") g.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
  else if (s.t === "ellipse") {
    g.beginPath();
    g.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2, 0, 0, Math.PI * 2);
    g.stroke();
  } else if (s.t === "hl") {
    g.globalAlpha = 0.28;
    g.globalCompositeOperation = "multiply";
    g.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
  } else if (s.t === "pen" && s.pts?.length) {
    g.beginPath();
    for (let i = 0; i + 1 < s.pts.length; i += 2) (i ? g.lineTo : g.moveTo).call(g, X(s.pts[i]), Y(s.pts[i + 1]));
    g.stroke();
  } else if (s.t === "num") {
    const d = fontPx(w, s.size) * 1.9;
    g.beginPath();
    g.arc(x1, y1, d / 2, 0, Math.PI * 2);
    g.fill();
    g.lineWidth = Math.max(1.5, d / 14);
    g.strokeStyle = "#fff";
    g.stroke();
    g.fillStyle = "#fff";
    g.font = `700 ${d * 0.55}px "IBM Plex Sans Hebrew", Arial, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(s.text ?? "", x1, y1 + d * 0.03);
  }
  g.restore();
}
