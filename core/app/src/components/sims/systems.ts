// Tracking, guidance, navigation, EO/IR, sonar and ballistics simulators.
import { rng } from "./draw";
import { G0, memo, num, type P, type SimDef } from "./types";

/* ---------------- Kalman filter tracking a maneuvering target ---------------- */
const KF_SPAN = 60;
const KF_LOOP = 12;
const kfRun = memo((p: P) => {
  const r = rng(7 + p.seed);
  const T = p.T;
  const n = Math.floor(KF_SPAN / T);
  const out: { t: number; zErr: number; eErr: number; sd: number; k0: number; k1: number }[] = [];
  let x = 0;
  let v = 250;
  let xe = 0;
  let ve = 250;
  let P00 = p.sigma ** 2;
  let P01 = 0;
  let P11 = 50 ** 2;
  const R = p.sigma ** 2;
  const q = p.q;
  for (let i = 0; i <= n; i++) {
    const t = i * T;
    if (i > 0) {
      // truth: constant velocity, with a lateral-turn acceleration between 24 s and 36 s
      const a = t > 24 && t <= 36 ? p.man * G0 : 0;
      x += v * T + 0.5 * a * T * T;
      v += a * T;
      // predict with the constant-velocity model
      xe += ve * T;
      const n00 = P00 + 2 * T * P01 + T * T * P11 + (q * T ** 3) / 3;
      const n01 = P01 + T * P11 + (q * T * T) / 2;
      const n11 = P11 + q * T;
      P00 = n00;
      P01 = n01;
      P11 = n11;
    }
    const z = x + p.sigma * r.gauss();
    const S = P00 + R;
    const k0 = P00 / S;
    const k1 = P01 / S;
    const innov = z - xe;
    if (i === 0) xe = z;
    else {
      xe += k0 * innov;
      ve += k1 * innov;
    }
    const a00 = (1 - k0) * P00;
    const a01 = (1 - k0) * P01;
    const a11 = P11 - k1 * P01;
    P00 = a00;
    P01 = a01;
    P11 = a11;
    out.push({ t, zErr: z - x, eErr: xe - x, sd: Math.sqrt(P00), k0, k1 });
  }
  const steady = out.filter((o) => o.t > 10 && o.t <= 24);
  const rms = Math.sqrt(steady.reduce((s, o) => s + o.eErr ** 2, 0) / Math.max(1, steady.length));
  const lag = Math.max(...out.filter((o) => o.t > 24).map((o) => Math.abs(o.eErr)));
  return { out, rms, lag };
});
const kalman: SimDef = {
  id: "kalman_track",
  title: "מסנן קלמן: עקיבה אחרי מטרה מתמרנת",
  caption: "A constant-velocity Kalman filter tracks a target that maneuvers between 24 s and 36 s: measurement errors, estimate error and its ±2σ band; the process noise q trades noise smoothing against maneuver lag.",
  model: "x = [pos, vel];  F = [[1,T],[0,1]];  Q = q[[T³/3, T²/2],[T²/2, T]];  K = P Hᵀ (H P Hᵀ + σ²)⁻¹",
  duration: KF_LOOP,
  params: [
    { id: "sigma", label: "שגיאת מדידה σ", min: 5, max: 200, step: 1, value: 50, unit: "m" },
    { id: "q", label: "רעש תהליך q", min: 0.01, max: 2000, step: 0.01, value: 5, unit: "m²/s³", log: true },
    { id: "T", label: "זמן עדכון T", min: 0.1, max: 2, step: 0.05, value: 0.5, unit: "s" },
    { id: "man", label: "תאוצת התמרון", min: 0, max: 8, step: 0.1, value: 3, unit: "g" },
    { id: "seed", label: "מימוש רעש", min: 1, max: 20, step: 1, value: 1 },
  ],
  readouts(p, t) {
    const r = kfRun(p);
    const now = (t / KF_LOOP) * KF_SPAN;
    const o = r.out[Math.min(r.out.length - 1, Math.floor(now / p.T))];
    return [
      { label: "שגיאת RMS במצב יציב", value: `${num(r.rms)} m (${num(r.rms / p.sigma)}σ)` },
      { label: "שגיאה מרבית בתמרון", value: `${num(r.lag)} m`, alert: r.lag > 3 * p.sigma },
      { label: "שבח α / β", value: `${num(o.k0)} / ${num(o.k1 * p.T)}` },
      { label: "זמן", value: `${num(now)} s${now > 24 && now <= 36 ? " (תמרון)" : ""}` },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const r = kfRun(p);
    const now = (t / KF_LOOP) * KF_SPAN;
    const ylim = Math.max(4 * p.sigma, 1.15 * r.lag);
    g.axes({ x: [0, KF_SPAN], y: [-ylim, ylim], xlabel: "זמן (s)", ylabel: "שגיאה (m)" });
    const f = g.frame();
    g.rectPx(g.X(24), f.y0, g.X(36) - g.X(24), f.y1 - f.y0, c.warn, 0.08);
    const shown = r.out.filter((o) => o.t <= now);
    g.fill([...shown.map((o) => [o.t, 2 * o.sd] as [number, number]), ...shown.map((o) => [o.t, -2 * o.sd] as [number, number]).reverse()], c.blue, 0.14);
    for (const o of shown) g.dot(o.t, o.zErr, c.muted, 2);
    g.curve(
      shown.map((o) => [o.t, o.eErr]),
      c.accent,
      2.2,
    );
    g.hline(0, c.ink);
  },
};
export const SYSTEM_SIMS = [kalman];
