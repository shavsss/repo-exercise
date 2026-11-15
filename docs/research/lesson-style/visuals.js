// Draws the lesson's ```chart and ```anim blocks in the sample pages (same JSON as the apps), with math.js.
// md2html.py inlines this file; renderVisual(kind, spec) returns a DOM element.
const NS = "http://www.w3.org/2000/svg";
const COLORS = ["var(--acc)", "#c0632b", "#5b8a3a", "#8a5bb0"];
const el = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
};
const fmt = (v) => (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0) ? v.toExponential(1) : +v.toPrecision(3)).toString();

function frame(W, H, pad) {
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "viz" });
  return { svg, plot: { x0: pad.l, x1: W - pad.r, y0: H - pad.b, y1: pad.t } };
}

function axes(svg, p, xr, yr, xl, yl) {
  const X = (x) => p.x0 + ((x - xr[0]) / (xr[1] - xr[0])) * (p.x1 - p.x0);
  const Y = (y) => p.y0 - ((y - yr[0]) / (yr[1] - yr[0])) * (p.y0 - p.y1);
  el("rect", { x: p.x0, y: p.y1, width: p.x1 - p.x0, height: p.y0 - p.y1, fill: "none", stroke: "var(--line)" }, svg);
  for (let i = 0; i <= 4; i++) {
    const xv = xr[0] + ((xr[1] - xr[0]) * i) / 4, yv = yr[0] + ((yr[1] - yr[0]) * i) / 4;
    el("text", { x: X(xv), y: p.y0 + 16, "text-anchor": "middle", class: "tick" }, svg).textContent = fmt(xv);
    el("text", { x: p.x0 - 6, y: Y(yv) + 4, "text-anchor": "end", class: "tick" }, svg).textContent = fmt(yv);
  }
  if (yr[0] < 0 && yr[1] > 0) el("line", { x1: p.x0, x2: p.x1, y1: Y(0), y2: Y(0), stroke: "var(--line)", "stroke-dasharray": "3 3" }, svg);
  el("text", { x: (p.x0 + p.x1) / 2, y: p.y0 + 34, "text-anchor": "middle", class: "lbl" }, svg).textContent = xl || "";
  el("text", { x: 14, y: (p.y0 + p.y1) / 2, "text-anchor": "middle", class: "lbl", transform: `rotate(-90 14 ${(p.y0 + p.y1) / 2})` }, svg).textContent = yl || "";
  return { X, Y };
}

function chart(spec) {
  const { svg, plot } = frame(640, 340, { l: 64, r: 16, t: 14, b: 44 });
  const xs = [];
  for (let x = spec.x.from; x <= spec.x.to + 1e-12; x += spec.x.step) xs.push(x);
  const series = spec.series.map((s) => {
    const f = math.compile(s.expr);
    return { name: s.name, pts: xs.map((x) => [x, f.evaluate({ ...spec.scope, x })]).filter(([, y]) => Number.isFinite(y)) };
  });
  const ys = series.flatMap((s) => s.pts.map((p) => p[1]));
  let lo = spec.y?.from ?? Math.min(...ys), hi = spec.y?.to ?? Math.max(...ys);
  if (spec.y?.from === undefined) { const q = (hi - lo) * 0.05; lo -= q; hi += q; }
  const { X, Y } = axes(svg, plot, [spec.x.from, spec.x.to], [lo, hi], spec.x.label, spec.yLabel);
  const clip = (y) => Math.max(lo, Math.min(hi, y));
  series.forEach((s, i) => {
    el("polyline", { points: s.pts.map(([x, y]) => `${X(x)},${Y(clip(y))}`).join(" "), fill: "none", stroke: COLORS[i % 4], "stroke-width": 2.2 }, svg);
  });
  return wrap(svg, spec, series.map((s, i) => [s.name, COLORS[i % 4]]));
}

function anim(spec) {
  const [xa, xb] = spec.view.x, [ya, yb] = spec.view.y;
  const W = 640, H = spec.view.equal === false ? 380 : Math.round((640 * (yb - ya)) / (xb - xa));
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "viz" });
  const X = (x) => ((x - xa) / (xb - xa)) * W, Y = (y) => H - ((y - ya) / (yb - ya)) * H;
  const vals = Object.fromEntries((spec.params || []).map((p) => [p.id, p.value]));
  const ev = (e, s) => math.evaluate(String(e), s);
  const t0 = performance.now();
  function draw() {
    const t = (((performance.now() - t0) / 1000) % (spec.duration || 6));
    const s = { ...vals, t, pi: Math.PI };
    svg.replaceChildren();
    for (const sh of spec.shapes) {
      const st = { stroke: sh.accent ? COLORS[1] : "currentColor", fill: "none", "stroke-width": sh.accent ? 2.6 : 1.6 };
      try {
        if (sh.type === "circle") el("circle", { cx: X(ev(sh.x, s)), cy: Y(ev(sh.y, s)), r: Math.max(1, (ev(sh.r, s) / (xb - xa)) * W), ...st, fill: sh.fill ? st.stroke : "none" }, svg);
        else if (sh.type === "line" || sh.type === "arrow") el("line", { x1: X(ev(sh.x1, s)), y1: Y(ev(sh.y1, s)), x2: X(ev(sh.x2, s)), y2: Y(ev(sh.y2, s)), ...st, "stroke-dasharray": sh.dash ? "5 4" : "", "marker-end": sh.type === "arrow" ? "url(#ah)" : "" }, svg);
        else if (sh.type === "path") {
          const [a, b] = sh.s, n = 240, pts = [];
          for (let i = 0; i <= n; i++) { const sv = a + ((b - a) * i) / n; const y = ev(sh.y, { ...s, s: sv }); if (Number.isFinite(y) && y > ya - 50 && y < yb + 50) pts.push(`${X(ev(sh.x, { ...s, s: sv }))},${Y(Math.max(ya, Math.min(yb, y)))}`); }
          el("polyline", { points: pts.join(" "), ...st }, svg);
        } else if (sh.type === "text") {
          const txt = String(sh.text).replace(/\{([^}]+)\}/g, (_, e) => fmt(ev(e, s)));
          el("text", { x: X(ev(sh.x, s)), y: Y(ev(sh.y, s)), "text-anchor": "middle", class: "lbl", fill: "currentColor" }, svg).textContent = txt;
        }
      } catch (e) { /* a shape that cannot be evaluated at this t is skipped */ }
    }
    const d = el("defs", {}, svg), m = el("marker", { id: "ah", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" }, d);
    el("path", { d: "M0,0 L10,5 L0,10 z", fill: "currentColor" }, m);
    requestAnimationFrame(draw);
  }
  draw();
  const box = wrap(svg, spec, []);
  for (const p of spec.params || []) {
    const row = document.createElement("label");
    row.className = "param";
    const out = document.createElement("span");
    const inp = Object.assign(document.createElement("input"), { type: "range", min: p.min, max: p.max, step: p.step ?? (p.max - p.min) / 100, value: p.value });
    inp.oninput = () => { vals[p.id] = +inp.value; out.textContent = fmt(+inp.value); };
    out.textContent = fmt(p.value);
    row.append(p.label + " ", inp, out);
    box.insertBefore(row, box.lastChild);
  }
  return box;
}

function wrap(svg, spec, legend) {
  const f = document.createElement("figure");
  f.className = "vizbox";
  if (spec.title) f.append(Object.assign(document.createElement("div"), { className: "vt", textContent: spec.title }));
  f.append(svg);
  if (legend.length) {
    const l = document.createElement("div");
    l.className = "legend";
    for (const [n, c] of legend) l.insertAdjacentHTML("beforeend", `<span><i style="background:${c}"></i>${n}</span>`);
    f.append(l);
  }
  const cap = document.createElement("figcaption");
  cap.innerHTML = typeof md === "function" ? md(spec.caption || "") : spec.caption || "";
  f.append(cap);
  return f;
}

function renderVisual(kind, spec) {
  try { return kind === "chart" ? chart(spec) : anim(spec); }
  catch (e) { const d = document.createElement("div"); d.className = "note"; d.textContent = `[${kind}: ${spec.title || ""}: ${e.message}]`; return d; }
}
