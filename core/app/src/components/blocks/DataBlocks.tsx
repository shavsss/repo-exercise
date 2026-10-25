import { evalExpr } from "../../tutor";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const SERIES_COLORS = ["#ff6b35", "#3a86ff", "#ff3d7f", "#2ec4b6", "#8b5cf6", "#ffbe0b", "#8ac926", "#f15bb5"];

function parseSpec(source: string): { spec?: any; error?: string } {
  try {
    return { spec: JSON.parse(source) };
  } catch {
    return { error: "JSON לא תקין" };
  }
}

function Frame({ kind, title, caption, children, provenance }: { kind: string; title?: string; caption?: string; children: React.ReactNode; provenance?: string }) {
  return (
    <figure className={`viz viz-${kind}`} data-block={kind}>
      <div className="viz-bar">
        <span className="viz-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="viz-title">{title ?? (kind === "chart" ? "גרף" : "טבלה")}</span>
        {provenance && <span className="viz-prov">{provenance}</span>}
      </div>
      <div className="viz-body">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Pending({ live, msg }: { live: boolean; msg: string }) {
  return <div className={`viz-pending ${live ? "is-live" : "is-error"}`}>{live ? "⏳ ממתין להשלמת הבלוק…" : `⚠️ ${msg}`}</div>;
}

function toNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof (v as any)?.toNumber === "function" ? (v as any).toNumber() : typeof (v as any)?.valueOf === "function" ? Number((v as any).valueOf()) : NaN;
  return Number.isFinite(n) ? +n.toPrecision(10) : null;
}

/** Computes chart data from the block's expressions (math.js), so every value comes from a calculation. */
function computeChart(spec: any): { series: { name: string; points: [number | string, number | null][] }[]; error?: string } {
  const scope = spec.scope ?? {};
  try {
    if (spec.points?.categories) {
      const cats: string[] = spec.points.categories;
      return {
        series: (spec.points.series ?? []).map((s: any) => ({
          name: String(s.name),
          points: cats.map((c, i) => [c, toNumber(evalExpr(String(s.exprs?.[i] ?? "NaN"), scope))] as [string, number | null]),
        })),
      };
    }
    const { from = 0, to = 1, step } = spec.x ?? {};
    const st = step && step > 0 ? step : (to - from) / 200;
    const n = Math.min(2000, Math.floor((to - from) / st + 1e-9) + 1);
    return {
      series: (spec.series ?? []).map((s: any) => ({
        name: String(s.name),
        points: Array.from({ length: n }, (_, k) => {
          const x = +(from + k * st).toPrecision(12);
          let y: number | null = null;
          try {
            y = toNumber(evalExpr(String(s.expr), { ...scope, x }));
          } catch {
            y = null;
          }
          return [x, y] as [number, number | null];
        }),
      })),
    };
  } catch (e) {
    return { series: [], error: (e as Error).message };
  }
}

export function ChartBlock({ source, live }: { source: string; live: boolean }) {
  const { spec, error } = parseSpec(source);
  if (!spec) return <Frame kind="chart"><Pending live={live} msg={error ?? ""} /></Frame>;
  const d = { ...spec, xLabel: spec.x?.label ?? spec.xLabel };
  const computed = computeChart(spec);
  if (computed.error || !computed.series.length) return <Frame kind="chart" title={spec.title}><Pending live={live} msg={computed.error ?? "אין סדרות לחישוב"} /></Frame>;
  const series = computed.series;
  const type: string = d.type ?? "line";
  const prov = "⚙️ מחושב בדף (math.js)";
  const r = { spec };

  const axisProps = { stroke: "var(--ink-soft)", tick: { fill: "var(--ink-soft)", fontSize: 12 }, tickLine: false };
  const xAxis = (
    <XAxis
      dataKey="x"
      type={type === "bar" ? "category" : "number"}
      domain={["dataMin", "dataMax"]}
      label={{ value: d.xLabel, position: "insideBottom", offset: -4, fill: "var(--ink-soft)", fontSize: 12 }}
      {...axisProps}
    />
  );
  const yAxis = (
    <YAxis
      width={56}
      label={{ value: d.yLabel, angle: -90, position: "insideLeft", fill: "var(--ink-soft)", fontSize: 12 }}
      {...axisProps}
    />
  );
  const common = (
    <>
      <CartesianGrid stroke="var(--grid)" strokeDasharray="3 4" />
      {xAxis}
      {yAxis}
      <Tooltip contentStyle={{ background: "var(--paper)", border: "2px solid var(--ink)", borderRadius: 10, direction: "ltr" }} />
      <Legend wrapperStyle={{ paddingTop: 8 }} />
    </>
  );

  let chart: React.ReactElement;
  if (type === "scatter") {
    chart = (
      <ScatterChart margin={{ top: 10, right: 16, bottom: 18, left: 4 }}>
        {common}
        {series.map((s, i) => (
          <Scatter key={s.name} name={s.name} data={s.points.map(([x, y]) => ({ x, y }))} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
        ))}
      </ScatterChart>
    );
  } else {
    const xs = new Map<string, any>();
    for (const s of series)
      for (const [x, y] of s.points) {
        const row = xs.get(String(x)) ?? { x };
        row[s.name] = y;
        xs.set(String(x), row);
      }
    const rows = [...xs.values()];
    if (type !== "bar") rows.sort((a, b) => a.x - b.x);
    const margin = { top: 10, right: 16, bottom: 18, left: 4 };
    if (type === "bar")
      chart = (
        <BarChart data={rows} margin={margin}>
          {common}
          {series.map((s, i) => (
            <Bar key={s.name} dataKey={s.name} fill={SERIES_COLORS[i % SERIES_COLORS.length]} stroke="var(--ink)" strokeWidth={1.5} radius={[6, 6, 0, 0]} />
          ))}
        </BarChart>
      );
    else if (type === "area")
      chart = (
        <AreaChart data={rows} margin={margin}>
          {common}
          {series.map((s, i) => (
            <Area key={s.name} dataKey={s.name} type="monotone" stroke={SERIES_COLORS[i % SERIES_COLORS.length]} fill={SERIES_COLORS[i % SERIES_COLORS.length]} fillOpacity={0.25} strokeWidth={2.5} />
          ))}
        </AreaChart>
      );
    else
      chart = (
        <LineChart data={rows} margin={margin}>
          {common}
          {series.map((s, i) => (
            <Line key={s.name} dataKey={s.name} type="monotone" stroke={SERIES_COLORS[i % SERIES_COLORS.length]} strokeWidth={2.75} dot={false} connectNulls />
          ))}
        </LineChart>
      );
  }
  return (
    <Frame kind="chart" title={r.spec.title} caption={r.spec.caption} provenance={prov}>
      <div className="chart-box" dir="ltr">
        <ResponsiveContainer width="100%" height={320}>
          {chart}
        </ResponsiveContainer>
      </div>
    </Frame>
  );
}

function cell(v: unknown) {
  if (typeof v === "string") return v;
  const n = toNumber(v);
  if (n !== null) return n;
  try {
    return String((v as any)?.toString?.() ?? v);
  } catch {
    return String(v);
  }
}

export function TableBlock({ source, live }: { source: string; live: boolean }) {
  const { spec, error } = parseSpec(source);
  if (!spec) return <Frame kind="table"><Pending live={live} msg={error ?? ""} /></Frame>;
  const columns: string[] = spec.columns ?? [];
  const scope = spec.scope ?? {};
  const rows: unknown[][] = (spec.rows ?? []).map((row: unknown[]) =>
    row.map((c) => {
      if (typeof c === "number") return c;
      try {
        return cell(evalExpr(String(c), scope));
      } catch {
        return { raw: String(c) };
      }
    }),
  );
  return (
    <Frame kind="table" title={spec.title} caption={spec.caption} provenance="⚙️ מחושב בדף (math.js)">
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td key={j} className={typeof v === "number" ? "num" : ""}>
                    {typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 6 }) : typeof v === "object" && v ? <em title="הביטוי לא חושב">⚠ {(v as { raw: string }).raw}</em> : String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}
