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

function resolve(source: string, registry: Map<string, any>, kind: "chart" | "table") {
  const { spec, error } = parseSpec(source);
  if (!spec) return { error };
  if (spec.ref) {
    const data = registry.get(`${kind}:${spec.ref}`);
    if (!data) return { error: `לא נמצאו נתונים בשם "${spec.ref}" בפלט הקוד`, spec };
    if (data.error) return { error: data.error, spec };
    return { spec, data, fromCode: true };
  }
  return { spec, data: spec, fromCode: false };
}

export function ChartBlock({ source, registry, live }: { source: string; registry: Map<string, any>; live: boolean }) {
  const r = resolve(source, registry, "chart");
  if (!r.data) return <Frame kind="chart" title={r.spec?.title}><Pending live={live} msg={r.error ?? ""} /></Frame>;
  const d = r.data;
  const series: { name: string; points: [number | string, number][] }[] = d.series ?? [];
  const type: string = d.type ?? "line";
  const prov = r.fromCode ? "⚙️ נתונים מפלט הקוד" : "⚠️ נתונים שהוקלדו ידנית";

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

export function TableBlock({ source, registry, live }: { source: string; registry: Map<string, any>; live: boolean }) {
  const r = resolve(source, registry, "table");
  if (!r.data) return <Frame kind="table" title={r.spec?.title}><Pending live={live} msg={r.error ?? ""} /></Frame>;
  const { columns = [], rows = [] } = r.data;
  return (
    <Frame kind="table" title={r.spec.title} caption={r.spec.caption} provenance={r.fromCode ? "⚙️ נתונים מפלט הקוד" : "⚠️ נתונים שהוקלדו ידנית"}>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c: string) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any[], i: number) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td key={j} className={typeof v === "number" ? "num" : ""}>
                    {typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 6 }) : String(v)}
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
