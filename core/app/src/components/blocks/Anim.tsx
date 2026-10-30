import { useMemo, useState } from "react";
import { compile, type EvalFunction } from "mathjs";
import type { Painter } from "../sims/draw";
import type { ParamDef } from "../sims/types";
import { Sheet } from "./Sheet";
import { Slider, useCanvas, useClock, useThemeKey } from "./Sim";

type Expr = string | number;
interface Shape {
  type: "circle" | "line" | "path" | "arrow" | "text";
  x?: Expr;
  y?: Expr;
  r?: Expr;
  x1?: Expr;
  y1?: Expr;
  x2?: Expr;
  y2?: Expr;
  s?: [number, number];
  text?: string;
  label?: string;
  dash?: boolean;
  accent?: boolean;
  fill?: boolean;
}
interface Spec {
  title?: string;
  caption?: string;
  duration?: number;
  view?: { x?: [number, number]; y?: [number, number]; xlabel?: string; ylabel?: string; equal?: boolean };
  params?: (Partial<ParamDef> & { id: string })[];
  shapes?: Shape[];
}

const cache = new Map<string, EvalFunction | null>();
function fnOf(e: Expr | undefined): EvalFunction | null {
  if (e === undefined) return null;
  const src = String(e);
  if (!cache.has(src)) {
    try {
      cache.set(src, compile(src));
    } catch {
      cache.set(src, null);
    }
  }
  return cache.get(src)!;
}
function ev(e: Expr | undefined, scope: Record<string, number>): number {
  if (typeof e === "number") return e;
  const f = fnOf(e);
  if (!f) return NaN;
  try {
    const v = f.evaluate({ ...scope });
    return typeof v === "number" ? v : typeof v?.re === "number" ? v.re : Number(v);
  } catch {
    return NaN;
  }
}
function interp(text: string, scope: Record<string, number>) {
  return text.replace(/\{([^}]+)\}/g, (_m, e) => {
    const v = ev(e, scope);
    return Number.isFinite(v) ? String(Number(v.toPrecision(4))) : "?";
  });
}

function drawShapes(g: Painter, spec: Spec, scope: Record<string, number>) {
  const c = g.c;
  let x: [number, number] = spec.view?.x ?? [-10, 10];
  let y: [number, number] = spec.view?.y ?? [-6, 6];
  if (spec.view?.equal !== false) ({ x, y } = g.equal(x, y));
  g.axes({ x, y, xlabel: spec.view?.xlabel, ylabel: spec.view?.ylabel });
  const series = [c.ink, c.blue, c.ok, c.warn, c.muted];
  (spec.shapes ?? []).forEach((s, i) => {
    const col = s.accent ? c.accent : series[i % series.length];
    const dash = s.dash ? [6, 4] : undefined;
    if (s.type === "circle") {
      const cx = ev(s.x, scope);
      const cy = ev(s.y, scope);
      const r = ev(s.r ?? 0.3, scope);
      const pr = Math.abs(g.X(cx + r) - g.X(cx));
      g.circle(g.X(cx), g.Y(cy), Math.max(2, pr), col, s.fill !== false);
      if (s.label) g.label(interp(s.label, scope), g.X(cx), g.Y(cy) - pr - 6, col);
    } else if (s.type === "line" || s.type === "arrow") {
      const a = [ev(s.x1, scope), ev(s.y1, scope), ev(s.x2, scope), ev(s.y2, scope)];
      if (!a.every(Number.isFinite)) return;
      if (s.type === "arrow") g.arrow(g.X(a[0]), g.Y(a[1]), g.X(a[2]), g.Y(a[3]), col);
      else g.seg(g.X(a[0]), g.Y(a[1]), g.X(a[2]), g.Y(a[3]), col, 1.8, dash);
      if (s.label) g.label(interp(s.label, scope), g.X((a[0] + a[2]) / 2), g.Y((a[1] + a[3]) / 2) - 6, col);
    } else if (s.type === "path") {
      const [s0, s1] = s.s ?? x;
      const pts: [number, number][] = [];
      for (let k = 0; k <= 300; k++) {
        const sv = s0 + (k / 300) * (s1 - s0);
        pts.push([ev(s.x ?? "s", { ...scope, s: sv }), ev(s.y, { ...scope, s: sv })]);
      }
      g.curve(pts, col, 2, dash);
    } else if (s.type === "text") {
      g.note(interp(s.text ?? "", scope), ev(s.x, scope), ev(s.y, scope), col);
    }
  });
}

export function AnimBlock({ source, live }: { source: string; live: boolean }) {
  const spec = useMemo<Spec | null>(() => {
    try {
      return JSON.parse(source);
    } catch {
      return null;
    }
  }, [source]);
  if (!spec) return live ? <div className="block-pending">אנימציה בכתיבה…</div> : <div className="block-error">הגדרת האנימציה אינה JSON תקין</div>;
  return <AnimView key={source} spec={spec} />;
}

function AnimView({ spec }: { spec: Spec }) {
  const defs: ParamDef[] = (spec.params ?? []).map((d) => {
    const min = Number(d.min ?? 0);
    const max = Number(d.max ?? 1);
    return { id: d.id, label: d.label ?? d.id, min, max, step: Number(d.step ?? (max - min) / 100), value: Number(d.value ?? min), unit: d.unit, log: d.log };
  });
  const [p, setP] = useState<Record<string, number>>(() => Object.fromEntries(defs.map((d) => [d.id, d.value])));
  const [playing, setPlaying] = useState(true);
  const duration = spec.duration && spec.duration > 0 ? spec.duration : undefined;
  const { t, reset } = useClock(duration, playing);
  const theme = useThemeKey();
  const { ref } = useCanvas(340, (g) => drawShapes(g, spec, { ...p, t, pi: Math.PI, e: Math.E }), [p, t, theme]);
  return (
    <Sheet title={spec.title || "אנימציה"} kind="שרטוט של המורה">
      <div className="sim">
        <div className="sim-canvas">
          <canvas ref={ref} aria-label={spec.title} />
        </div>
        {spec.caption && <p className="sim-caption">{spec.caption}</p>}
        {defs.length > 0 && (
          <div className="params">
            {defs.map((d) => (
              <Slider key={d.id} def={d} value={p[d.id]} onChange={(v) => setP((q) => ({ ...q, [d.id]: v }))} />
            ))}
          </div>
        )}
        {duration && (
          <div className="sim-foot">
            <span />
            <div className="sim-actions">
              <button className="btn small" onClick={() => setPlaying((v) => !v)}>
                {playing ? "השהה" : "הפעל"}
              </button>
              <button className="btn small" onClick={reset}>
                מההתחלה
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
