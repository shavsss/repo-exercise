// Electronic warfare simulators: self-screening jamming and burn-through,
// range gate pull-off, cross-eye, communications jamming and TDOA location.
import { C, db, undb } from "./draw";
import { bisect, memo, num, type P, type SimDef } from "./types";

/* ---------------- self-screening jammer and burn-through ---------------- */
function sj(p: P, rKm: number) {
  const lam = C / (p.f * 1e9);
  const R = rKm * 1e3;
  const gt = undb(p.gt);
  const bw = Math.min(1, p.br / p.bj);
  const S = (p.pt * 1e3 * gt * gt * lam * lam * p.rcs) / ((4 * Math.PI) ** 3 * R ** 4);
  const J = (p.pj * undb(p.gj) * gt * lam * lam * bw) / ((4 * Math.PI) ** 2 * R ** 2);
  return { S, J };
}
const dbm = (w: number) => db(w) + 30;
function burn(p: P) {
  const bw = Math.min(1, p.br / p.bj);
  return Math.sqrt((p.pt * 1e3 * undb(p.gt) * p.rcs) / (4 * Math.PI * p.pj * undb(p.gj) * bw * undb(p.sjreq))) / 1e3;
}
const burnthrough: SimDef = {
  id: "jamming_burnthrough",
  title: "מגן עצמי (SSJ) וטווח פריצה",
  caption: "Received echo power (∝ R⁻⁴) and self-screening noise jamming power (∝ R⁻²) at the radar versus range, and the burn-through range where S/J reaches the radar's requirement.",
  model: "S/J = P_t G_t σ / (4π R² P_j G_j) · (B_j/B_r);  R_bt = √(P_t G_t σ B_j / (4π P_j G_j B_r (S/J)_req))",
  duration: 10,
  params: [
    { id: "pt", label: "הספק מכ\"ם P_t", min: 1, max: 1000, step: 0.1, value: 100, unit: "kW", log: true },
    { id: "gt", label: "שבח אנטנת מכ\"ם", min: 20, max: 45, step: 0.5, value: 35, unit: "dB" },
    { id: "f", label: "תדר", min: 2, max: 18, step: 0.1, value: 10, unit: "GHz" },
    { id: "rcs", label: "RCS", min: 0.01, max: 100, step: 0.01, value: 5, unit: "m²", log: true },
    { id: "pj", label: "הספק משבש P_j", min: 1, max: 1000, step: 0.1, value: 100, unit: "W", log: true },
    { id: "gj", label: "שבח אנטנת משבש", min: 0, max: 20, step: 0.5, value: 10, unit: "dB" },
    { id: "bj", label: "רוחב סרט שיבוש B_j", min: 1, max: 1000, step: 1, value: 100, unit: "MHz", log: true },
    { id: "br", label: "רוחב סרט מקלט B_r", min: 0.5, max: 10, step: 0.1, value: 2, unit: "MHz" },
    { id: "sjreq", label: "S/J נדרש לגילוי", min: 0, max: 20, step: 0.5, value: 10, unit: "dB" },
  ],
  readouts(p, t) {
    const r = 300 * Math.pow(1 / 600, t / 10);
    const { S, J } = sj(p, r);
    const rb = burn(p);
    return [
      { label: "טווח פריצה", value: rb >= 1 ? `${num(rb)} km` : `${num(rb * 1e3)} m` },
      { label: "טווח המטרה", value: `${num(r)} km` },
      { label: "S/J", value: `${num(db(S / J))} dB`, alert: db(S / J) >= p.sjreq },
      { label: "גורם רוחב סרט B_r/B_j", value: `${num(db(Math.min(1, p.br / p.bj)))} dB` },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const lo = 0.5;
    const hi = 300;
    const sLo = dbm(sj(p, hi).S);
    const sHi = dbm(sj(p, lo).S);
    const jLo = dbm(sj(p, hi).J);
    const jHi = dbm(sj(p, lo).J);
    const y0 = Math.floor(Math.min(sLo, jLo) / 10) * 10;
    const y1 = Math.ceil(Math.max(sHi, jHi) / 10) * 10;
    g.axes({ x: [lo, hi], y: [y0, y1], logx: true, xlabel: "R (km)", ylabel: "הספק במקלט (dBm)" });
    g.fn((r) => dbm(sj(p, r).S), c.ink, 2.2);
    g.fn((r) => dbm(sj(p, r).J), c.blue, 2.2, [6, 4]);
    g.fn((r) => dbm(sj(p, r).J) + p.sjreq, c.warn, 1.2, [2, 3]);
    const rb = burn(p);
    g.vline(rb, c.accent, "פריצה");
    const r = 300 * Math.pow(1 / 600, t / 10);
    g.dot(r, dbm(sj(p, r).S), c.accent, 5);
    g.dot(r, dbm(sj(p, r).J), c.blue, 5);
    g.note("S ∝ R⁻⁴", 2, dbm(sj(p, 2).S) + 3, c.ink, "left");
    g.note("J ∝ R⁻²", 60, dbm(sj(p, 60).J) + 3, c.blue, "left");
  },
};

/* ---------------- range gate pull-off ---------------- */
const RGPO_T = 12;
const rgpoRun = memo((p: P) => {
  const dt = 0.01;
  const W = p.gate;
  const steps = Math.round(RGPO_T / dt);
  const gate: number[] = [];
  const fake: number[] = [];
  let gc = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const walkEnd = p.hold + p.walkT;
    const on = t < walkEnd;
    const off = t < p.hold ? 0 : p.walk * (Math.min(t, walkEnd) - p.hold);
    fake.push(on ? off : NaN);
    // power-weighted centroid of the echoes inside the gate (the true echo has unit power)
    let sw = 0;
    let sx = 0;
    if (Math.abs(0 - gc) <= W / 2) {
      sw += 1;
      sx += 0;
    }
    if (on && Math.abs(off - gc) <= W / 2) {
      sw += undb(p.js);
      sx += undb(p.js) * off;
    }
    if (sw > 0) gc += (sx / sw - gc) * Math.min(1, 10 * dt);
    gate.push(gc);
  }
  return { gate, fake, dt };
});
const rgpo: SimDef = {
  id: "rgpo",
  title: "RGPO: משיכת שער הטווח",
  caption: "A range tracker follows the power-weighted centroid of echoes in its gate; a stronger repeater echo captures the gate, walks it off the target, then switches off, leaving the gate empty.",
  model: "Phases: capture (dwell) → walk-off at v_pull → jammer off. Gate update ġ = k (centroid − g), centroid weighted by power inside the gate.",
  duration: RGPO_T,
  height: 360,
  params: [
    { id: "js", label: "J/S של ההד המזויף", min: 0, max: 30, step: 0.5, value: 12, unit: "dB" },
    { id: "walk", label: "קצב משיכה", min: 20, max: 1000, step: 5, value: 150, unit: "m/s" },
    { id: "gate", label: "רוחב שער הטווח", min: 30, max: 600, step: 5, value: 150, unit: "m" },
    { id: "hold", label: "זמן לכידה", min: 0.5, max: 4, step: 0.1, value: 1.5, unit: "s" },
    { id: "walkT", label: "משך המשיכה", min: 1, max: 8, step: 0.1, value: 5, unit: "s" },
  ],
  readouts(p, t) {
    const r = rgpoRun(p);
    const i = Math.min(r.gate.length - 1, Math.round(t / r.dt));
    const gc = r.gate[i];
    const phase = t < p.hold ? "לכידה" : t < p.hold + p.walkT ? "משיכה" : "ניתוק";
    const lost = Math.abs(gc) > p.gate / 2;
    return [
      { label: "שלב", value: phase },
      { label: "מרכז השער ביחס למטרה", value: `${num(gc)} m` },
      { label: "מצב עקיבה", value: lost ? "המטרה מחוץ לשער: עקיבה אבדה" : "המטרה בשער", alert: lost },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const r = rgpoRun(p);
    const i = Math.min(r.gate.length - 1, Math.round(t / r.dt));
    const maxOff = p.walk * p.walkT + p.gate;
    const x0 = -p.gate * 1.2;
    const x1 = Math.max(maxOff, p.gate * 2);
    // top strip: the echoes and the gate at this instant
    g.axes({ x: [x0, x1], y: [0, 40], ylabel: "dB", box: [0, 0, 1, 0.5], grid: false });
    const pulse = (x0_: number, h: number, color: string) => {
      const w = p.gate / 4;
      g.curve(
        [
          [x0_ - w, 0],
          [x0_, h],
          [x0_ + w, 0],
        ],
        color,
        2.4,
      );
    };
    pulse(0, 13, c.ink);
    const f = r.fake[i];
    if (Number.isFinite(f)) pulse(f, 13 + p.js, c.blue);
    const gc = r.gate[i];
    const fr = g.frame();
    g.rectPx(g.X(gc - p.gate / 2), fr.y0, g.X(gc + p.gate / 2) - g.X(gc - p.gate / 2), fr.y1 - fr.y0, c.accent, 0.12);
    g.rectPx(g.X(gc - p.gate / 2), fr.y0, g.X(gc + p.gate / 2) - g.X(gc - p.gate / 2), fr.y1 - fr.y0, c.accent, 1, true);
    g.note("מטרה", 0, 16, c.ink);
    if (Number.isFinite(f)) g.note("הד מזויף", f, 16 + p.js, c.blue);
    // bottom: history of gate and false echo offset
    g.axes({ x: [0, RGPO_T], y: [x0, x1], xlabel: "זמן (s)", ylabel: "היסט טווח (m)", box: [0, 0.5, 1, 1] });
    g.curve(
      r.gate.slice(0, i + 1).map((v, k) => [k * r.dt, v]),
      c.accent,
      2.2,
    );
    g.curve(
      r.fake.slice(0, i + 1).map((v, k) => [k * r.dt, v]),
      c.blue,
      1.6,
      [5, 4],
    );
    g.hline(0, c.ink, "מטרה");
  },
};

/* ---------------- cross-eye ---------------- */
const ceRatio = (a: number, phi: number) => (1 - a * a) / (1 + a * a + 2 * a * Math.cos(phi));
const crossEye: SimDef = {
  id: "cross_eye",
  title: "Cross-eye: הטעיית זווית בשני מקורות קוהרנטיים",
  caption: "Two coherent repeaters separated by L with amplitude ratio a and relative phase φ shift the radar's apparent angle; near φ = 180° and a → 1 the error exceeds the platform's own span.",
  model: "Δθ = (L/2R)·(1 − a²)/(1 + a² + 2a cos φ);  lateral error = (L/2)·(1 − a²)/(1 + a² + 2a cos φ)",
  params: [
    { id: "L", label: "מרחק בין האנטנות L", min: 2, max: 30, step: 0.5, value: 10, unit: "m" },
    { id: "R", label: "טווח למכ\"ם", min: 1, max: 50, step: 0.5, value: 10, unit: "km" },
    { id: "a", label: "יחס משרעות a", min: 0.5, max: 0.995, step: 0.005, value: 0.95 },
    { id: "phi", label: "הפרש מופע φ", min: 0, max: 360, step: 1, value: 180, unit: "°" },
  ],
  readouts(p) {
    const k = ceRatio(p.a, (p.phi * Math.PI) / 180);
    const lat = (p.L / 2) * k;
    return [
      { label: "שגיאה ביחס לחצי המוטה", value: `${num(k)}×`, alert: Math.abs(k) > 1 },
      { label: "שגיאה רוחבית", value: `${num(lat)} m` },
      { label: "שגיאה זוויתית", value: `${num((lat / (p.R * 1e3)) * 1e3)} mrad` },
      { label: "השגיאה בחלקי אלומה של 2°", value: num(((lat / (p.R * 1e3)) * 180) / Math.PI / 2) },
    ];
  },
  draw(g, p) {
    const c = g.c;
    const cap = 40;
    g.axes({ x: [0, 360], y: [-cap, cap], xlabel: "φ (°)", ylabel: "שגיאה / (L/2)", ticks: { x: [0, 90, 180, 270, 360] } });
    for (const [a, col, w] of [
      [0.8, c.grid, 1.2],
      [0.9, c.muted, 1.2],
      [p.a, c.ink, 2.2],
    ] as [number, string, number][])
      g.fn((ph) => ceRatio(a, (ph * Math.PI) / 180), col, w, undefined, 1440);
    g.hline(1, c.warn, "קצה הפלטפורמה");
    g.hline(-1, c.warn);
    const k = ceRatio(p.a, (p.phi * Math.PI) / 180);
    g.dot(p.phi, Math.max(-cap, Math.min(cap, k)), c.accent, 6);
  },
};

/* ---------------- communications jamming (Adamy) ---------------- */
function loss(fMHz: number, dKm: number, h1: number, h2: number) {
  const fz = (h1 * h2 * fMHz) / 24000;
  const los = 32.44 + 20 * Math.log10(fMHz) + 20 * Math.log10(dKm);
  if (dKm <= fz) return { L: los, kind: "קו ראייה" };
  return { L: Math.max(los, 120 + 40 * Math.log10(dKm) - 20 * Math.log10(h1) - 20 * Math.log10(h2)), kind: "שתי קרניים" };
}
function commJS(p: P, dj: number) {
  const ls = loss(p.f, p.ds, p.h, p.h);
  const lj = loss(p.f, dj, p.hj, p.h);
  return { js: p.erpj - p.erps - lj.L + ls.L + p.grj - p.gr, ls, lj };
}
const commJam: SimDef = {
  id: "link_budget_jam",
  title: "שיבוש תקשורת: J/S במקלט",
  caption: "Jamming-to-signal ratio at a communications receiver versus jammer distance, with line-of-sight or two-ray propagation chosen by the Fresnel-zone distance.",
  model: "J/S = ERP_j − ERP_s − L_j + L_s + G_rj − G_r;  L_LOS = 32.44 + 20log f(MHz) + 20log d(km);  L_2ray = 120 + 40log d − 20log h_t − 20log h_r;  FZ = h_t h_r f / 24000",
  params: [
    { id: "erps", label: "ERP משדר התקשורת", min: 10, max: 60, step: 1, value: 40, unit: "dBm" },
    { id: "erpj", label: "ERP המשבש", min: 30, max: 90, step: 1, value: 60, unit: "dBm" },
    { id: "ds", label: "מרחק משדר-מקלט", min: 1, max: 50, step: 0.5, value: 10, unit: "km" },
    { id: "dj", label: "מרחק משבש-מקלט", min: 1, max: 200, step: 0.5, value: 40, unit: "km", log: true },
    { id: "f", label: "תדר", min: 30, max: 3000, step: 1, value: 150, unit: "MHz", log: true },
    { id: "h", label: "גובה אנטנות הרשת", min: 1, max: 50, step: 0.5, value: 2, unit: "m" },
    { id: "hj", label: "גובה אנטנת המשבש", min: 2, max: 3000, step: 1, value: 30, unit: "m", log: true },
    { id: "gr", label: "שבח המקלט לכיוון המשדר", min: -10, max: 10, step: 0.5, value: 0, unit: "dBi" },
    { id: "grj", label: "שבח המקלט לכיוון המשבש", min: -20, max: 10, step: 0.5, value: 0, unit: "dBi" },
    { id: "req", label: "J/S נדרש", min: -5, max: 20, step: 0.5, value: 0, unit: "dB" },
  ],
  readouts(p) {
    const r = commJS(p, p.dj);
    const dmax = bisect((d) => commJS(p, d).js - p.req, 0.1, 5000, true);
    return [
      { label: "L_s", value: `${num(r.ls.L)} dB (${r.ls.kind})` },
      { label: "L_j", value: `${num(r.lj.L)} dB (${r.lj.kind})` },
      { label: "J/S", value: `${num(r.js)} dB`, alert: r.js >= p.req },
      { label: "מרחק שיבוש אפקטיבי מרבי", value: Number.isFinite(dmax) ? `${num(dmax)} km` : commJS(p, 5000).js >= p.req ? "> 5000 km" : "< 0.1 km" },
    ];
  },
  draw(g, p) {
    const c = g.c;
    const ys = [1, 300].map((d) => commJS(p, d).js);
    g.axes({ x: [1, 300], y: [Math.floor(Math.min(...ys, p.req - 10) / 10) * 10, Math.ceil(Math.max(...ys, p.req + 10) / 10) * 10], logx: true, xlabel: "מרחק משבש-מקלט (km)", ylabel: "J/S (dB)" });
    g.fn((d) => commJS(p, d).js, c.ink, 2.2);
    g.hline(p.req, c.warn, "נדרש");
    const fz = (p.hj * p.h * p.f) / 24000;
    g.vline(fz, c.muted, "FZ");
    g.dot(p.dj, commJS(p, p.dj).js, c.accent, 6);
  },
};

/* ---------------- TDOA ---------------- */
function rx(b: number): [number, number][] {
  return [
    [-b / 2, 0],
    [b / 2, 0],
    [0, b * 0.866],
  ];
}
const dist = (a: [number, number], x: number, y: number) => Math.hypot(x - a[0], y - a[1]);
function tdoaErr(p: P) {
  // position covariance from the range-difference Jacobian, equal independent errors c·σ√2 per difference
  const r = rx(p.base);
  const u = r.map((q) => {
    const d = dist(q, p.ex, p.ey);
    return [(p.ex - q[0]) / d, (p.ey - q[1]) / d];
  });
  const J = [
    [u[0][0] - u[1][0], u[0][1] - u[1][1]],
    [u[0][0] - u[2][0], u[0][1] - u[2][1]],
  ];
  const s = C * p.sigma * 1e-9 * Math.SQRT2;
  const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  if (Math.abs(det) < 1e-9) return { sx: Infinity, sy: Infinity, cep: Infinity };
  const inv = [
    [J[1][1] / det, -J[0][1] / det],
    [-J[1][0] / det, J[0][0] / det],
  ];
  const sx = s * Math.hypot(inv[0][0], inv[0][1]);
  const sy = s * Math.hypot(inv[1][0], inv[1][1]);
  return { sx, sy, cep: 0.59 * (sx + sy) };
}
const tdoa: SimDef = {
  id: "tdoa",
  title: "איכון משדר ב-TDOA: היפרבולות",
  caption: "Three receivers measure time differences of arrival; each difference puts the emitter on a hyperbola, and their crossing is the fix. Error grows with range and poor geometry.",
  model: "|r − r₁| − |r − r₂| = c·Δt₁₂;  position error ≈ c·σ_t · (geometry factor)",
  params: [
    { id: "base", label: "קו בסיס", min: 5, max: 100, step: 1, value: 30, unit: "km" },
    { id: "ex", label: "משדר x", min: -100, max: 100, step: 1, value: 20, unit: "km" },
    { id: "ey", label: "משדר y", min: -60, max: 150, step: 1, value: 60, unit: "km" },
    { id: "sigma", label: "שגיאת זמן σ_t", min: 1, max: 500, step: 1, value: 50, unit: "ns", log: true },
  ],
  readouts(p) {
    const r = rx(p.base);
    const d12 = dist(r[0], p.ex, p.ey) - dist(r[1], p.ex, p.ey);
    const d13 = dist(r[0], p.ex, p.ey) - dist(r[2], p.ex, p.ey);
    const e = tdoaErr(p);
    return [
      { label: "Δt₁₂", value: `${num(((d12 * 1e3) / C) * 1e6)} μs` },
      { label: "Δt₁₃", value: `${num(((d13 * 1e3) / C) * 1e6)} μs` },
      { label: "c·σ_t", value: `${num(C * p.sigma * 1e-9)} m` },
      { label: "CEP משוער", value: e.cep > 1e4 ? `${num(e.cep / 1e3)} km` : `${num(e.cep)} m`, alert: e.cep > 2000 },
    ];
  },
  draw(g, p) {
    const c = g.c;
    const r = rx(p.base);
    const pad = 15;
    const xs = [...r.map((q) => q[0]), p.ex];
    const ys = [...r.map((q) => q[1]), p.ey];
    const v = g.equal([Math.min(...xs) - pad, Math.max(...xs) + pad], [Math.min(...ys) - pad, Math.max(...ys) + pad]);
    g.axes({ x: v.x, y: v.y, xlabel: "x (km)", ylabel: "y (km)" });
    const d12 = dist(r[0], p.ex, p.ey) - dist(r[1], p.ex, p.ey);
    const d13 = dist(r[0], p.ex, p.ey) - dist(r[2], p.ex, p.ey);
    g.contour((x, y) => dist(r[0], x, y) - dist(r[1], x, y) - d12, c.blue, 1.8);
    g.contour((x, y) => dist(r[0], x, y) - dist(r[2], x, y) - d13, c.ok, 1.8);
    r.forEach((q, i) => {
      g.dot(q[0], q[1], c.ink, 5);
      g.note(`R${i + 1}`, q[0], q[1] - (v.y[1] - v.y[0]) * 0.05, c.ink);
    });
    g.dot(p.ex, p.ey, c.accent, 6);
  },
};

export const EW_SIMS = [burnthrough, rgpo, crossEye, commJam, tdoa];
