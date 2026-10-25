import { useId, useMemo, useState } from "react";
import { compile, type EvalFunction } from "mathjs";
import { SERIES_COLORS } from "./DataBlocks";

interface Param {
  id: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  value?: number;
}
interface Curve {
  label?: string;
  expr?: string;
  x?: string;
  y?: string;
  t?: [number, number];
  implicit?: string;
  color?: string;
}
interface Spec {
  title?: string;
  caption?: string;
  params?: Param[];
  x?: { min: number; max: number; label?: string };
  y?: { min: number; max: number; label?: string };
  curves?: Curve[];
  points?: { label?: string; x: string; y: string }[];
  readouts?: { label: string; expr: string }[];
}

const W = 640;
const H = 420;
const PAD = 34;

function safeCompile(src: string | undefined): EvalFunction | null {
  if (!src) return null;
  try {
    return compile(src);
  } catch {
    return null;
  }
}

function num(f: EvalFunction | null, scope: Record<string, number>): number {
  if (!f) return NaN;
  try {
    const v = f.evaluate({ ...scope });
    return typeof v === "number" ? v : typeof v?.re === "number" && Math.abs(v.im) < 1e-12 ? v.re : NaN;
  } catch {
    return NaN;
  }
}

/** Marching squares: line segments of the zero set of f(x, y) over the view. */
function implicitSegments(f: EvalFunction, scope: Record<string, number>, xr: [number, number], yr: [number, number]) {
  const nx = 150;
  const ny = 110;
  const v: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    v.push([]);
    const y = yr[0] + ((yr[1] - yr[0]) * j) / ny;
    for (let i = 0; i <= nx; i++) v[j].push(num(f, { ...scope, x: xr[0] + ((xr[1] - xr[0]) * i) / nx, y }));
  }
  const segs: [number, number, number, number][] = [];
  const X = (i: number) => xr[0] + ((xr[1] - xr[0]) * i) / nx;
  const Y = (j: number) => yr[0] + ((yr[1] - yr[0]) * j) / ny;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const a = v[j][i], b = v[j][i + 1], c = v[j + 1][i + 1], d = v[j + 1][i];
      if (![a, b, c, d].every(Number.isFinite)) continue;
      const pts: [number, number][] = [];
      const edge = (p: number, q: number, x1: number, y1: number, x2: number, y2: number) => {
        if ((p < 0) !== (q < 0)) {
          const s = p / (p - q);
          pts.push([x1 + (x2 - x1) * s, y1 + (y2 - y1) * s]);
        }
      };
      edge(a, b, X(i), Y(j), X(i + 1), Y(j));
      edge(b, c, X(i + 1), Y(j), X(i + 1), Y(j + 1));
      edge(c, d, X(i + 1), Y(j + 1), X(i), Y(j + 1));
      edge(d, a, X(i), Y(j + 1), X(i), Y(j));
      if (pts.length === 2) segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
      else if (pts.length === 4) {
        segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
        segs.push([pts[2][0], pts[2][1], pts[3][0], pts[3][1]]);
      }
    }
  return segs;
}

function niceTicks(min: number, max: number, count = 8) {
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= step0) ?? step0;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) ticks.push(Math.round(t / step) * step);
  return ticks;
}

export function Interactive({ source, live }: { source: string; live: boolean }) {
  const parsed = useMemo(() => {
    try {
      return JSON.parse(source) as Spec;
    } catch {
      return null;
    }
  }, [source]);
  const [values, setValues] = useState<Record<string, number>>({});
  const clipId = "clip" + useId().replace(/[^a-zA-Z0-9]/g, "");

  const compiled = useMemo(() => {
    if (!parsed) return null;
    return {
      curves: (parsed.curves ?? []).map((c) => ({
        c,
        expr: safeCompile(c.expr),
        px: safeCompile(c.x),
        py: safeCompile(c.y),
        imp: safeCompile(c.implicit),
      })),
      points: (parsed.points ?? []).map((p) => ({ p, x: safeCompile(p.x), y: safeCompile(p.y) })),
      readouts: (parsed.readouts ?? []).map((r) => ({ r, f: safeCompile(r.expr) })),
    };
  }, [parsed]);

  if (!parsed || !compiled)
    return <div className={`viz-pending ${live ? "is-live" : "is-error"}`}>{live ? "ממתין להשלמת הכלי האינטראקטיבי…" : "הגדרת הכלי האינטראקטיבי אינה JSON תקין"}</div>;

  const params = parsed.params ?? [];
  const scope: Record<string, number> = {};
  for (const p of params) scope[p.id] = values[p.id] ?? p.value ?? p.min;
  const xr: [number, number] = [parsed.x?.min ?? -5, parsed.x?.max ?? 5];
  const yr: [number, number] = [parsed.y?.min ?? -5, parsed.y?.max ?? 5];
  const sx = (x: number) => PAD + ((x - xr[0]) / (xr[1] - xr[0])) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - yr[0]) / (yr[1] - yr[0])) * (H - 2 * PAD);

  const paths = compiled.curves.map(({ c, expr, px, py, imp }, i) => {
    const color = c.color ?? SERIES_COLORS[i % SERIES_COLORS.length];
    if (imp) {
      const segs = implicitSegments(imp, scope, xr, yr);
      const d = segs.map(([x1, y1, x2, y2]) => `M${sx(x1).toFixed(1)},${sy(y1).toFixed(1)}L${sx(x2).toFixed(1)},${sy(y2).toFixed(1)}`).join("");
      return { d, color, label: c.label };
    }
    const pts: [number, number][] = [];
    if (px && py) {
      const [t0, t1] = c.t ?? [0, 2 * Math.PI];
      for (let k = 0; k <= 600; k++) {
        const t = t0 + ((t1 - t0) * k) / 600;
        pts.push([num(px, { ...scope, t }), num(py, { ...scope, t })]);
      }
    } else if (expr) {
      for (let k = 0; k <= 500; k++) {
        const x = xr[0] + ((xr[1] - xr[0]) * k) / 500;
        pts.push([x, num(expr, { ...scope, x })]);
      }
    }
    let d = "";
    let pen = false;
    const span = yr[1] - yr[0];
    for (let k = 0; k < pts.length; k++) {
      const [x, y] = pts[k];
      const ok = Number.isFinite(x) && Number.isFinite(y) && Math.abs(y - (yr[0] + yr[1]) / 2) < span * 4;
      const jump = pen && k > 0 && Math.abs(y - pts[k - 1][1]) > span * 1.5;
      if (!ok || jump) {
        pen = false;
        if (!ok) continue;
      }
      d += `${pen ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
      pen = true;
    }
    return { d, color, label: c.label };
  });

  const xt = niceTicks(xr[0], xr[1]);
  const yt = niceTicks(yr[0], yr[1], 6);
  const fmt = (v: number) => (Number.isFinite(v) ? (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(3) : +v.toFixed(4)).toString() : "—");

  return (
    <figure className="viz viz-interactive" data-block="interactive">
      <div className="viz-bar">
        <span className="viz-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="viz-title">{parsed.title ?? "כלי אינטראקטיבי"}</span>
        <span className="viz-prov">חישוב חי (mathjs)</span>
      </div>
      <div className="viz-body interactive-body">
        <div className="ia-controls">
          {params.map((p) => (
            <label key={p.id} className="ia-param">
              <span className="ia-name" dir="ltr">
                {p.label ?? p.id} = <b>{fmt(scope[p.id])}</b>
              </span>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step ?? (p.max - p.min) / 200}
                value={scope[p.id]}
                onChange={(e) => setValues((v) => ({ ...v, [p.id]: Number(e.target.value) }))}
                dir="ltr"
              />
            </label>
          ))}
          {compiled.readouts.length > 0 && (
            <div className="ia-readouts">
              {compiled.readouts.map(({ r, f }) => {
                const v = num(f, scope);
                return (
                  <div key={r.label} className={`ia-readout ${v > 0 ? "pos" : v < 0 ? "neg" : "zero"}`}>
                    <span>{r.label}</span>
                    <b dir="ltr">{fmt(v)}</b>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <svg className="ia-plot" viewBox={`0 0 ${W} ${H}`}>
          <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} className="ia-bg" />
          {xt.map((t) => (
            <g key={`x${t}`}>
              <line x1={sx(t)} x2={sx(t)} y1={PAD} y2={H - PAD} className="ia-grid" />
              <text x={sx(t)} y={H - PAD + 16} className="ia-tick" textAnchor="middle">{+t.toFixed(6)}</text>
            </g>
          ))}
          {yt.map((t) => (
            <g key={`y${t}`}>
              <line x1={PAD} x2={W - PAD} y1={sy(t)} y2={sy(t)} className="ia-grid" />
              <text x={PAD - 6} y={sy(t) + 4} className="ia-tick" textAnchor="end">{+t.toFixed(6)}</text>
            </g>
          ))}
          {xr[0] < 0 && xr[1] > 0 && <line x1={sx(0)} x2={sx(0)} y1={PAD} y2={H - PAD} className="ia-axis" />}
          {yr[0] < 0 && yr[1] > 0 && <line x1={PAD} x2={W - PAD} y1={sy(0)} y2={sy(0)} className="ia-axis" />}
          <clipPath id={clipId}>
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} />
          </clipPath>
          <g clipPath={`url(#${clipId})`}>
            {paths.map((p, i) => (
              <path key={i} d={p.d} stroke={p.color} className="ia-curve" />
            ))}
            {compiled.points.map(({ p, x, y }, i) => {
              const X = num(x, scope);
              const Y = num(y, scope);
              if (!Number.isFinite(X) || !Number.isFinite(Y)) return null;
              return (
                <g key={i}>
                  <circle cx={sx(X)} cy={sy(Y)} r={6} className="ia-point" />
                  {p.label && <text x={sx(X) + 9} y={sy(Y) - 9} className="ia-plabel">{p.label}</text>}
                </g>
              );
            })}
          </g>
          {parsed.x?.label && <text x={W - PAD} y={H - 6} className="ia-alabel" textAnchor="end">{parsed.x.label}</text>}
          {parsed.y?.label && <text x={8} y={PAD - 12} className="ia-alabel">{parsed.y.label}</text>}
        </svg>
        <div className="ia-legend">
          {paths.map((p, i) => (
            <span key={i}>
              <i style={{ background: p.color }} />
              {p.label ?? `עקום ${i + 1}`}
              {!p.d && <em> (אין נקודות ממשיות בתחום)</em>}
            </span>
          ))}
        </div>
      </div>
      {parsed.caption && <figcaption>{parsed.caption}</figcaption>}
    </figure>
  );
}
