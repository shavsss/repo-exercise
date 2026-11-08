import { useEffect, useMemo, useRef, useState } from "react";
import { Painter, palette } from "../sims/draw";
import { SIM_BY_ID } from "../sims/catalog";
import type { P, ParamDef } from "../sims/types";
import { Sheet } from "./Sheet";

/** Keeps a canvas sized to its box at the device pixel ratio, and redraws on change. */
export function useCanvas(height: number, draw: (g: Painter) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(260, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const h = width < 520 ? Math.round(height * 0.85) : height;
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = width * dpr;
    cv.height = h * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const c = palette(cv);
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, width, h);
    try {
      draw(new Painter(ctx, width, h, c));
    } catch (e) {
      ctx.fillStyle = c.accent;
      ctx.fillText(String(e), 12, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, h, ...deps]);
  return { ref, width, height: h };
}

/** The current light/dark theme, so canvases redraw when it changes. */
export function useThemeKey() {
  const [k, setK] = useState(0);
  useEffect(() => {
    const bump = () => setK((v) => v + 1);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", bump);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", bump);
    };
  }, []);
  return k;
}

/** A looping clock in seconds while playing. */
export function useClock(duration: number | undefined, playing: boolean) {
  const [t, setT] = useState(0);
  const start = useRef<number | null>(null);
  const base = useRef(0);
  useEffect(() => {
    if (!duration || !playing) return;
    let raf = 0;
    start.current = null;
    const step = (now: number) => {
      if (start.current === null) start.current = now - base.current * 1000;
      const s = ((now - start.current) / 1000) % duration;
      base.current = s;
      setT(s);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [duration, playing]);
  const reset = () => {
    base.current = 0;
    start.current = null;
    setT(0);
  };
  return { t, reset };
}

export function Slider({ def, value, onChange }: { def: ParamDef; value: number; onChange: (v: number) => void }) {
  if (def.options)
    return (
      <label className="param">
        <span className="param-label">{def.label}</span>
        <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
          {def.options.map((o, i) => (
            <option key={i} value={i}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  const toPos = (v: number) => (def.log ? ((Math.log10(v) - Math.log10(def.min)) / (Math.log10(def.max) - Math.log10(def.min))) * 1000 : v);
  const fromPos = (x: number) => {
    if (!def.log) return x;
    const v = 10 ** (Math.log10(def.min) + (x / 1000) * (Math.log10(def.max) - Math.log10(def.min)));
    return Number(v.toPrecision(3));
  };
  const shown = Math.abs(value) >= 1e5 || (Math.abs(value) < 1e-2 && value !== 0) ? value.toExponential(1) : Number(value.toPrecision(4)).toString();
  return (
    <label className="param">
      <span className="param-label">{def.label}</span>
      <input
        type="range"
        min={def.log ? 0 : def.min}
        max={def.log ? 1000 : def.max}
        step={def.log ? 1 : def.step}
        value={toPos(value)}
        onChange={(e) => onChange(fromPos(Number(e.target.value)))}
      />
      <span className="param-value" dir="ltr">
        {shown}
        {def.unit ? ` ${def.unit}` : ""}
      </span>
    </label>
  );
}

interface Spec {
  id: string;
  title?: string;
  params?: Record<string, number>;
}

export function SimBlock({ source, live }: { source: string; live: boolean }) {
  const spec = useMemo<Spec | null>(() => {
    try {
      return JSON.parse(source);
    } catch {
      return null;
    }
  }, [source]);
  if (!spec) return live ? <div className="block-pending">סימולטור בכתיבה…</div> : <div className="block-error">הגדרת הסימולטור אינה JSON תקין</div>;
  const def = SIM_BY_ID[spec.id];
  if (!def) return <div className="block-error">סימולטור לא מוכר: {spec.id}</div>;
  return <SimView key={source} spec={spec} />;
}

function SimView({ spec }: { spec: Spec }) {
  const def = SIM_BY_ID[spec.id];
  const initial = useMemo(() => {
    const p: P = {};
    for (const d of def.params) {
      const v = spec.params?.[d.id];
      p[d.id] = typeof v === "number" && Number.isFinite(v) ? Math.min(d.max, Math.max(d.min, v)) : d.value;
    }
    return p;
  }, [def, spec]);
  const [p, setP] = useState<P>(initial);
  const [playing, setPlaying] = useState(true);
  const { t, reset } = useClock(def.duration, playing);
  const theme = useThemeKey();
  const { ref } = useCanvas(def.height ?? 340, (g) => def.draw(g, p, t), [p, t, theme]);
  const readouts = def.readouts?.(p, t) ?? [];
  return (
    <Sheet title={spec.title || def.title} kind="סימולטור" no={def.id}>
      <div className="sim">
        <div className="sim-canvas">
          <canvas ref={ref} aria-label={def.title} />
        </div>
        {readouts.length > 0 && (
          <dl className="readouts">
            {readouts.map((r) => (
              <div key={r.label} className={r.alert ? "readout alert" : "readout"}>
                <dt>{r.label}</dt>
                <dd dir="ltr">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="params">
          {def.params.map((d) => (
            <Slider key={d.id} def={d} value={p[d.id]} onChange={(v) => setP((q) => ({ ...q, [d.id]: v }))} />
          ))}
        </div>
        <div className="sim-foot">
          <code className="sim-model" dir="ltr">
            {def.model}
          </code>
          <div className="sim-actions">
            {def.duration && (
              <>
                <button className="btn small" onClick={() => setPlaying((v) => !v)}>
                  {playing ? "השהה" : "הפעל"}
                </button>
                <button className="btn small" onClick={reset}>
                  מההתחלה
                </button>
              </>
            )}
            <button className="btn small" onClick={() => setP(initial)}>
              ערכים התחלתיים
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
