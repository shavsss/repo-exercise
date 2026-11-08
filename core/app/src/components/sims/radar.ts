// Radar simulators: the range equation, detection statistics, ambiguities,
// MTI, arrays, monopulse, pulse compression, CFAR and the radar horizon.
import { C, K_BOLTZ, db, undb, rng, type Painter } from "./draw";
import { bisect, deg, memo, num, type P, type SimDef } from "./types";

const T0 = 290;

/* ---------------- radar range equation ---------------- */
function snrAt(p: P, rKm: number) {
  const lam = C / (p.f * 1e9);
  const g = undb(p.g);
  const num_ = p.pt * 1e3 * g * g * lam * lam * p.rcs * p.n;
  const den = (4 * Math.PI) ** 3 * K_BOLTZ * T0 * undb(p.nf) * p.b * 1e6 * undb(p.loss) * (rKm * 1e3) ** 4;
  return num_ / den;
}
function rDet(p: P) {
  return (snrAt(p, 1) / undb(p.snr)) ** 0.25;
}

const radarRange: SimDef = {
  id: "radar_range",
  title: "משוואת המכ\"ם: SNR מול טווח",
  caption: "SNR of a monostatic radar versus range from the radar equation, with the detection threshold and the detection range; a target closes in.",
  model: "SNR = P_t G² λ² σ n / ((4π)³ k T₀ F B L R⁴),  R_det = (… / SNR_min)^{1/4}",
  duration: 10,
  params: [
    { id: "pt", label: "הספק שיא P_t", min: 1, max: 5000, step: 0.01, value: 100, unit: "kW", log: true },
    { id: "g", label: "שבח אנטנה G", min: 15, max: 45, step: 0.5, value: 33, unit: "dB" },
    { id: "f", label: "תדר", min: 0.3, max: 35, step: 0.01, value: 3, unit: "GHz", log: true },
    { id: "rcs", label: "RCS σ", min: 0.001, max: 100, step: 0.001, value: 1, unit: "m²", log: true },
    { id: "nf", label: "נתון רעש F", min: 1, max: 10, step: 0.1, value: 4, unit: "dB" },
    { id: "b", label: "רוחב סרט B", min: 0.1, max: 20, step: 0.01, value: 1, unit: "MHz", log: true },
    { id: "loss", label: "הפסדים L", min: 0, max: 15, step: 0.5, value: 6, unit: "dB" },
    { id: "n", label: "פולסים באינטגרציה קוהרנטית n", min: 1, max: 256, step: 1, value: 1, log: true },
    { id: "snr", label: "סף SNR נדרש", min: 3, max: 20, step: 0.5, value: 13, unit: "dB" },
    { id: "rmax", label: "טווח התצוגה", min: 10, max: 1000, step: 1, value: 200, unit: "km", log: true },
  ],
  readouts(p, t) {
    const r = p.rmax * (1 - 0.92 * (t / 10));
    const s = db(snrAt(p, r));
    return [
      { label: "λ", value: `${num((C / (p.f * 1e9)) * 100)} cm` },
      { label: "טווח גילוי", value: `${num(rDet(p))} km` },
      { label: "מטרה", value: `${num(r)} km` },
      { label: "SNR במטרה", value: `${num(s)} dB`, alert: s >= p.snr },
    ];
  },
  draw(g: Painter, p, t) {
    const c = g.c;
    const x0 = p.rmax / 40;
    const lo = Math.min(db(snrAt(p, p.rmax)), p.snr) - 10;
    const hi = Math.max(db(snrAt(p, x0)), p.snr + 10);
    g.axes({ x: [x0, p.rmax], y: [Math.floor(lo / 10) * 10, Math.ceil(Math.min(hi, lo + 90) / 10) * 10], xlabel: "R (km)", ylabel: "SNR (dB)" });
    const rd = rDet(p);
    g.fn((r) => db(snrAt(p, r)), c.ink, 2.2);
    g.hline(p.snr, c.warn, `סף ${p.snr} dB`);
    g.vline(rd, c.accent, `R_det ${num(rd)} km`);
    const r = p.rmax * (1 - 0.92 * (t / 10));
    g.dot(r, db(snrAt(p, r)), r <= rd ? c.accent : c.muted, 6);
  },
};

/* ---------------- probability of detection ---------------- */
function i0e(x: number) {
  const a = Math.abs(x);
  if (a <= 3.75) {
    const t = (a / 3.75) ** 2;
    const i0 = 1 + t * (3.5156229 + t * (3.0899424 + t * (1.2067492 + t * (0.2659732 + t * (0.0360768 + t * 0.0045813)))));
    return i0 * Math.exp(-a);
  }
  const t = 3.75 / a;
  return (
    (0.39894228 + t * (0.01328592 + t * (0.00225319 + t * (-0.00157565 + t * (0.00916281 + t * (-0.02057706 + t * (0.02635537 + t * (-0.01647633 + t * 0.00392377)))))))) /
    Math.sqrt(a)
  );
}
/** Marcum Q1(a, b) by integrating the Rician density (noise variance 1 per quadrature). */
function marcumQ(a: number, b: number) {
  const hi = Math.max(a, b) + 12;
  const n = 800;
  const h = (hi - b) / n;
  const f = (x: number) => x * Math.exp(-((x - a) ** 2) / 2) * i0e(a * x);
  let s = f(b) + f(hi);
  for (let i = 1; i < n; i++) s += f(b + i * h) * (i % 2 ? 4 : 2);
  return Math.min(1, (s * h) / 3);
}
const pdSteady = (snrDb: number, pfa: number) => marcumQ(Math.sqrt(2 * undb(snrDb)), Math.sqrt(-2 * Math.log(pfa)));
const pdSw1 = (snrDb: number, pfa: number) => pfa ** (1 / (1 + undb(snrDb)));
const needed = (pd: (s: number, f: number) => number, pfa: number, target: number) => bisect((s) => pd(s, pfa) - target, -10, 40);

const pdRoc: SimDef = {
  id: "pd_roc",
  title: "הסתברות גילוי מול SNR",
  caption: "Single-pulse probability of detection versus SNR for a steady target (Marcum Q) and a Swerling 1 target, at a chosen false-alarm probability.",
  model: "Steady: P_d = Q₁(√(2·SNR), √(−2 ln P_fa)).  Swerling 1: P_d = P_fa^{1/(1+SNR)}",
  params: [
    { id: "snr", label: "SNR", min: -5, max: 30, step: 0.1, value: 13, unit: "dB" },
    { id: "pfa", label: "P_fa", min: 1e-10, max: 1e-2, step: 1e-10, value: 1e-6, log: true },
  ],
  readouts(p) {
    return [
      { label: "P_d מטרה יציבה", value: num(pdSteady(p.snr, p.pfa)) },
      { label: "P_d Swerling 1", value: num(pdSw1(p.snr, p.pfa)) },
      { label: "SNR ל-P_d=0.9 (יציבה)", value: `${num(needed(pdSteady, p.pfa, 0.9))} dB` },
      { label: "SNR ל-P_d=0.9 (SW1)", value: `${num(needed(pdSw1, p.pfa, 0.9))} dB` },
    ];
  },
  draw(g, p) {
    const c = g.c;
    g.axes({ x: [-5, 30], y: [0, 1], xlabel: "SNR (dB)", ylabel: "P_d" });
    g.fn((s) => pdSteady(s, p.pfa), c.ink, 2.2, undefined, 180);
    g.fn((s) => pdSw1(s, p.pfa), c.blue, 2.2, [6, 4], 180);
    g.hline(0.9, c.grid, "0.9");
    g.vline(p.snr, c.accent);
    g.dot(p.snr, pdSteady(p.snr, p.pfa), c.accent, 5);
    g.dot(p.snr, pdSw1(p.snr, p.pfa), c.accent, 5);
    g.note("Steady (SW0)", 24, 0.97, c.ink);
    g.note("Swerling 1", 26, 0.72, c.blue);
  },
};

/* ---------------- PRF ambiguities ---------------- */
function amb(p: P) {
  const prf = p.prf * 1e3;
  const lam = C / (p.f * 1e9);
  const rua = C / (2 * prf) / 1e3;
  const fd = (2 * p.v) / lam;
  const fdA = ((((fd + prf / 2) % prf) + prf) % prf) - prf / 2;
  return { prf, lam, rua, fd, fdA, rA: p.r % rua, k: Math.floor(p.r / rua), vua: (lam * prf) / 4 };
}
const prfAmbiguity: SimDef = {
  id: "prf_ambiguity",
  title: "עמימות טווח ודופלר לפי PRF",
  caption: "Pulse train and echo timing (range folding) and the Doppler spectrum with PRF replicas (velocity folding) for a chosen PRF.",
  model: "R_ua = c/(2·PRF),  f_d = 2v/λ,  v_ua = ±λ·PRF/4;  apparent R = R mod R_ua",
  duration: 8,
  height: 420,
  params: [
    { id: "prf", label: "PRF", min: 0.2, max: 300, step: 0.01, value: 1, unit: "kHz", log: true },
    { id: "r", label: "טווח אמיתי", min: 1, max: 500, step: 1, value: 200, unit: "km" },
    { id: "f", label: "תדר", min: 1, max: 18, step: 0.1, value: 10, unit: "GHz" },
    { id: "v", label: "מהירות רדיאלית", min: -1000, max: 1000, step: 5, value: 300, unit: "m/s" },
  ],
  readouts(p) {
    const a = amb(p);
    return [
      { label: "R_ua", value: `${num(a.rua)} km` },
      { label: "טווח נראה", value: `${num(a.rA)} km`, alert: a.k > 0 },
      { label: "מקטע עמימות", value: String(a.k) },
      { label: "f_d אמיתי / נראה", value: `${num(a.fd / 1e3)} / ${num(a.fdA / 1e3)} kHz`, alert: Math.abs(a.fd - a.fdA) > 1 },
      { label: "v_ua", value: `±${num(a.vua)} m/s` },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const a = amb(p);
    // top: transmitted pulses and echoes on a range-equivalent time axis
    const span = Math.max(p.r * 1.15, a.rua * 3);
    g.axes({ x: [0, span], y: [0, 1.2], xlabel: "זמן מאז השידור, ביחידות טווח c·t/2 (km)", box: [0, 0, 1, 0.5], grid: false, ticks: { y: [] } });
    const now = (t / 8) * span;
    for (let k = 0; k * a.rua <= span; k++) {
      const x = k * a.rua;
      g.seg(g.X(x), g.Y(0), g.X(x), g.Y(1), x <= now ? c.ink : c.grid, 2.4);
      const e = x + p.r;
      if (e <= span) g.seg(g.X(e), g.Y(0), g.X(e), g.Y(0.55), e <= now ? c.accent : c.grid, 2.4);
      if (k < 6 && x <= span) g.note(`P${k + 1}`, x, 1.08, c.muted);
    }
    g.vline(now, c.blue, undefined, [2, 3]);
    g.note(`הד מ-P1 מגיע אחרי ${a.k} פולסים נוספים: נראה ב-${num(a.rA)} km`, span / 2, 0.85, c.accent);
    // bottom: Doppler spectrum with replicas
    const fspan = Math.max(1.6 * a.prf, Math.abs(a.fd) * 1.2) / 1e3;
    g.axes({ x: [-fspan, fspan], y: [0, 1.2], xlabel: "תדר דופלר (kHz)", box: [0, 0.5, 1, 1], ticks: { y: [] } });
    g.fill(
      [
        [-a.prf / 2e3, 0],
        [-a.prf / 2e3, 1.2],
        [a.prf / 2e3, 1.2],
        [a.prf / 2e3, 0],
      ],
      c.blue,
      0.08,
    );
    for (let k = -6; k <= 6; k++) {
      const x = (a.fdA + k * a.prf) / 1e3;
      if (Math.abs(x) <= fspan) g.seg(g.X(x), g.Y(0), g.X(x), g.Y(0.8), k === 0 ? c.accent : c.muted, k === 0 ? 2.6 : 1.4);
    }
    g.vline(a.fd / 1e3, c.ink, "f_d אמיתי");
  },
};

/* ---------------- MTI canceller response ---------------- */
function binom(n: number, k: number) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}
function mtiGain(p: P, v: number) {
  const lam = C / (p.f * 1e9);
  const fd = (2 * v) / lam;
  const n = p.stages;
  const h = (prf: number) => (2 * Math.abs(Math.sin((Math.PI * fd) / prf))) ** (2 * n) / binom(2 * n, n);
  const prf1 = p.prf * 1e3;
  if (p.stagger <= 1.0001) return h(prf1);
  return 0.5 * (h(prf1) + h(prf1 / p.stagger));
}
const mtiBlind: SimDef = {
  id: "mti_blind",
  title: "MTI: תגובת מבטל ומהירויות עיוורות",
  caption: "Power response of an n-stage delay-line canceller versus radial velocity, with blind speeds, and the effect of staggering two PRFs.",
  model: "|H(f_d)|² = |2 sin(π f_d / PRF)|^{2n} / C(2n, n),  v_blind = k·λ·PRF/2",
  duration: 10,
  params: [
    { id: "prf", label: "PRF", min: 0.3, max: 10, step: 0.01, value: 1, unit: "kHz" },
    { id: "f", label: "תדר", min: 0.5, max: 10, step: 0.1, value: 3, unit: "GHz" },
    { id: "stages", label: "שלבי ביטול n", min: 1, max: 3, step: 1, value: 1 },
    { id: "stagger", label: "יחס staggered PRF", min: 1, max: 1.5, step: 0.01, value: 1 },
  ],
  readouts(p, t) {
    const lam = C / (p.f * 1e9);
    const vb = (lam * p.prf * 1e3) / 2;
    const v = (t / 10) * 4.2 * vb;
    const gdb = db(Math.max(mtiGain(p, v), 1e-12));
    return [
      { label: "מהירות עיוורת ראשונה", value: `${num(vb)} m/s (${num(vb * 1.944)} kt)` },
      { label: "מטרה", value: `${num(v)} m/s` },
      { label: "תגובה", value: `${num(gdb)} dB`, alert: gdb < -10 },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const lam = C / (p.f * 1e9);
    const vb = (lam * p.prf * 1e3) / 2;
    const vmax = 4.2 * vb;
    g.axes({ x: [0, vmax], y: [-40, 10], xlabel: "מהירות רדיאלית (m/s)", ylabel: "תגובה (dB)" });
    g.fn((v) => db(Math.max(mtiGain(p, v), 1e-6)), c.ink, 2.2, undefined, 900);
    for (let k = 1; k * vb <= vmax; k++) g.vline(k * vb, c.warn, k === 1 ? "v_b" : `${k}v_b`);
    const v = (t / 10) * vmax;
    g.dot(v, Math.max(-40, db(Math.max(mtiGain(p, v), 1e-6))), c.accent, 6);
  },
};

/* ---------------- linear array factor ---------------- */
function weights(n: number, taper: number) {
  return Array.from({ length: n }, (_, i) => {
    if (n === 1 || taper === 0) return 1;
    const x = i / (n - 1);
    return taper === 1 ? 0.54 - 0.46 * Math.cos(2 * Math.PI * x) : 0.5 - 0.5 * Math.cos(2 * Math.PI * ((i + 1) / (n + 1)));
  });
}
const afPattern = memo((p: P) => {
  const w = weights(p.n, p.taper);
  const sw = w.reduce((a, b) => a + b, 0);
  const s0 = Math.sin(p.steer * deg);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 3600; i++) {
    const th = -90 + i * 0.05;
    const u = Math.sin(th * deg) - s0;
    let re = 0;
    let im = 0;
    for (let k = 0; k < p.n; k++) {
      const ph = 2 * Math.PI * p.d * k * u;
      re += w[k] * Math.cos(ph);
      im += w[k] * Math.sin(ph);
    }
    pts.push([th, 20 * Math.log10(Math.max(Math.hypot(re, im) / sw, 1e-5))]);
  }
  // main lobe: walk out from the steering angle to the -3 dB points and the first nulls
  const i0 = Math.round((p.steer + 90) / 0.05);
  let l = i0;
  let r = i0;
  while (l > 0 && pts[l][1] > -3) l--;
  while (r < 3600 && pts[r][1] > -3) r++;
  let nl = l;
  let nr = r;
  while (nl > 0 && pts[nl - 1][1] < pts[nl][1]) nl--;
  while (nr < 3600 && pts[nr + 1][1] < pts[nr][1]) nr++;
  let psl = -100;
  pts.forEach(([, v], i) => {
    if (i < nl || i > nr) psl = Math.max(psl, v);
  });
  return { pts, bw: (r - l) * 0.05, psl, edgeL: l > 0, edgeR: r < 3600 };
});
const arrayFactor: SimDef = {
  id: "array_factor",
  title: "מערך מופע ליניארי: אלומה, היגוי ועונות סריג",
  caption: "Array factor of an N-element uniform linear array versus angle: beamwidth, sidelobes, electronic steering, grating lobes and amplitude taper.",
  model: "AF(θ) = Σ wₙ e^{j2π(d/λ)n(sinθ − sinθ₀)} / Σ wₙ;  θ₃ ≈ 0.886 λ/(N d cosθ₀);  no grating lobe if d/λ < 1/(1+|sinθ₀|)",
  params: [
    { id: "n", label: "מספר אלמנטים N", min: 2, max: 64, step: 1, value: 16 },
    { id: "d", label: "מרווח d/λ", min: 0.25, max: 1.5, step: 0.01, value: 0.5 },
    { id: "steer", label: "זווית היגוי θ₀", min: -60, max: 60, step: 0.5, value: 0, unit: "°" },
    { id: "taper", label: "טייפר", min: 0, max: 2, step: 1, value: 0, options: ["אחיד", "Hamming", "Hann"] },
  ],
  readouts(p) {
    const a = afPattern(p);
    const gl = p.d >= 1 / (1 + Math.abs(Math.sin(p.steer * deg)));
    return [
      { label: "רוחב אלומה 3dB", value: a.edgeL && a.edgeR ? `${num(a.bw)}°` : "—" },
      { label: "קירוב 0.886λ/(Nd cosθ₀)", value: `${num(0.886 / (p.n * p.d * Math.cos(p.steer * deg)) / deg)}°` },
      { label: "אונת צד מרבית", value: `${num(a.psl)} dB`, alert: a.psl > -6 },
      { label: "אונות סריג", value: gl ? "יש" : "אין", alert: gl },
    ];
  },
  draw(g, p) {
    const c = g.c;
    const a = afPattern(p);
    g.axes({ x: [-90, 90], y: [-50, 0], xlabel: "θ (°)", ylabel: "|AF| (dB)", ticks: { x: [-90, -60, -30, 0, 30, 60, 90] } });
    g.curve(a.pts, c.ink, 1.8);
    g.hline(-3, c.warn, "-3 dB");
    g.vline(p.steer, c.accent, "θ₀");
  },
};

/* ---------------- amplitude monopulse ---------------- */
function mono(p: P, th: number) {
  const s = p.squint * p.bw;
  const v = (x: number) => Math.exp(-2 * Math.LN2 * (x / p.bw) ** 2);
  const a = v(th - s);
  const b = v(th + s);
  return { sum: a + b, diff: a - b };
}
const monopulse: SimDef = {
  id: "monopulse",
  title: "מונופולס משרעת: Σ, Δ והיחס Δ/Σ",
  caption: "Two squinted Gaussian beams form sum and difference patterns; the Δ/Σ ratio gives the angle error of a moving target within the beam.",
  model: "v(θ) = exp(−2 ln2 (θ/θ₃)²);  Σ = v(θ−θ_s) + v(θ+θ_s),  Δ = v(θ−θ_s) − v(θ+θ_s);  θ̂ ≈ (Δ/Σ)/k_m",
  duration: 10,
  height: 420,
  params: [
    { id: "bw", label: "רוחב אלומה θ₃", min: 1, max: 10, step: 0.1, value: 3, unit: "°" },
    { id: "squint", label: "הסטה θ_s / θ₃", min: 0.15, max: 0.8, step: 0.01, value: 0.4 },
    { id: "amp", label: "תנועת המטרה (משרעת)", min: 0, max: 6, step: 0.1, value: 2, unit: "°" },
  ],
  readouts(p, t) {
    const th = p.amp * Math.sin((2 * Math.PI * t) / 10);
    const m = mono(p, th);
    const e = 1e-3;
    const km = (mono(p, e).diff / mono(p, e).sum - mono(p, -e).diff / mono(p, -e).sum) / (2 * e);
    const est = m.diff / m.sum / km;
    return [
      { label: "זווית מטרה", value: `${num(th)}°` },
      { label: "Δ/Σ", value: num(m.diff / m.sum) },
      { label: "שיפוע k_m", value: `${num(km)} 1/°` },
      { label: "הערכה ליניארית", value: `${num(est)}°`, alert: Math.abs(est - th) > 0.1 * p.bw },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const span = Math.max(1.6 * p.bw, p.amp * 1.15);
    const th = p.amp * Math.sin((2 * Math.PI * t) / 10);
    const m0 = mono(p, 0).sum;
    g.axes({ x: [-span, span], y: [-1.1, 1.1], ylabel: "מתח (מנורמל)", box: [0, 0, 1, 0.55] });
    g.fn((x) => mono(p, x).sum / m0, c.ink, 2.2);
    g.fn((x) => mono(p, x).diff / m0, c.blue, 2.2, [6, 4]);
    g.vline(th, c.accent, "מטרה");
    g.note("Σ", -span * 0.1, 1.0, c.ink);
    g.note("Δ", span * 0.55, 0.45, c.blue);
    g.axes({ x: [-span, span], y: [-1.5, 1.5], xlabel: "זווית מציר ההצבעה (°)", ylabel: "Δ/Σ", box: [0, 0.55, 1, 1] });
    g.fn((x) => mono(p, x).diff / mono(p, x).sum, c.ink, 2.2);
    const m = mono(p, th);
    g.dot(th, m.diff / m.sum, c.accent, 6);
  },
};

/* ---------------- LFM pulse compression ---------------- */
function chi(p: P, tau: number) {
  const T = p.T * 1e-6;
  if (Math.abs(tau) >= T) return 0;
  const k = (p.B * 1e6) / T;
  const x = (p.fd * 1e3 + k * tau) * (T - Math.abs(tau));
  const sinc = Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
  return Math.abs((1 - Math.abs(tau) / T) * sinc);
}
const lfm: SimDef = {
  id: "lfm_compression",
  title: "דחיסת פולס LFM (צ'ירפ)",
  caption: "A linear-FM pulse and its matched-filter output: resolution c/2B instead of cT/2, −13.2 dB sidelobes, and the range-Doppler coupling shift.",
  model: "|χ(τ, f_d)| = |(1 − |τ|/T)·sinc[(f_d + (B/T)τ)(T − |τ|)]|;  ΔR = c/2B;  shift τ = −f_d T/B",
  height: 420,
  params: [
    { id: "B", label: "רוחב סרט B", min: 0.5, max: 200, step: 0.1, value: 5, unit: "MHz", log: true },
    { id: "T", label: "משך פולס T", min: 1, max: 100, step: 0.1, value: 10, unit: "μs", log: true },
    { id: "fd", label: "היסט דופלר f_d", min: -500, max: 500, step: 1, value: 0, unit: "kHz" },
  ],
  readouts(p) {
    const T = p.T * 1e-6;
    const B = p.B * 1e6;
    const shift = (-(p.fd * 1e3) * T) / B;
    return [
      { label: "רזולוציה דחוסה c/2B", value: `${num(C / (2 * B))} m` },
      { label: "ללא דחיסה cT/2", value: `${num((C * T) / 2)} m` },
      { label: "יחס דחיסה BT", value: `${num(B * T)} (${num(db(B * T))} dB)` },
      { label: "הזזת שיא מדופלר", value: `${num((C * shift) / 2)} m`, alert: Math.abs(shift) * B > 0.5 },
    ];
  },
  draw(g, p) {
    const c = g.c;
    const T = p.T * 1e-6;
    const B = p.B * 1e6;
    const k = B / T;
    // top: the chirp's real part (its frequency sweeps from −B/2 to +B/2)
    g.axes({ x: [-p.T / 2, p.T / 2], y: [-1.3, 1.3], xlabel: "t (μs)", box: [0, 0, 1, 0.45], ticks: { y: [-1, 0, 1] } });
    const n = Math.min(4000, Math.max(600, Math.round(B * T * 12)));
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const tt = -T / 2 + (i / n) * T;
      pts.push([tt * 1e6, Math.cos(Math.PI * k * tt * tt)]);
    }
    g.curve(pts, c.ink, 1);
    if (B * T > 300) g.note("BT גדול: המחזורים צפופים מכדי להיראות", 0, 1.15, c.muted);
    // bottom: compressed output against range offset
    const shift = (-(p.fd * 1e3) * T) / B;
    const half = Math.max(8 / B, Math.abs(shift) * 1.6);
    const tmax = Math.min(T, half);
    const rm = (C * tmax) / 2;
    g.axes({ x: [-rm, rm], y: [-50, 0], xlabel: "היסט טווח (m)", ylabel: "dB", box: [0, 0.45, 1, 1] });
    g.fn((r) => 20 * Math.log10(Math.max(chi(p, (2 * r) / C), 1e-4)), c.ink, 2, undefined, 1500);
    g.hline(-13.2, c.warn, "-13.2 dB");
    g.vline((C * shift) / 2, c.accent, "שיא");
  },
};

/* ---------------- cell-averaging CFAR ---------------- */
const NCELL = 200;
const cfarData = memo((p: P) => {
  const r = rng(1000 + p.seed);
  const t1 = 70;
  const t2 = t1 + Math.round(p.sep);
  const power: number[] = [];
  for (let i = 0; i < NCELL; i++) {
    const clutter = i >= 140 ? undb(p.edge) : 1;
    let re = r.gauss() * Math.sqrt(clutter / 2);
    let im = r.gauss() * Math.sqrt(clutter / 2);
    if (i === t1) re += Math.sqrt(undb(p.snr1));
    if (i === t2) re += Math.sqrt(undb(p.snr2));
    power.push(re * re + im * im);
  }
  const half = p.n / 2;
  const alpha = p.n * (p.pfa ** (-1 / p.n) - 1);
  const thr: number[] = [];
  for (let i = 0; i < NCELL; i++) {
    let s = 0;
    let m = 0;
    for (let k = p.guard + 1; k <= p.guard + half; k++) {
      if (i - k >= 0) {
        s += power[i - k];
        m++;
      }
      if (i + k < NCELL) {
        s += power[i + k];
        m++;
      }
    }
    thr.push(m ? (alpha * s) / m : Infinity);
  }
  const det = power.map((v, i) => v > thr[i]);
  return { power, thr, det, alpha, t1, t2 };
});
const cfar: SimDef = {
  id: "cfar_ca",
  title: "CA-CFAR: סף מסתגל לאורך תאי טווח",
  caption: "Cell-averaging CFAR along 200 range cells of noise with two targets and an optional clutter edge: the adaptive threshold, detections, target masking and edge false alarms. A new noise look every second.",
  model: "T = α·(1/N)Σ reference cells,  α = N(P_fa^{−1/N} − 1)",
  duration: 10,
  params: [
    { id: "n", label: "תאי ייחוס N", min: 4, max: 64, step: 2, value: 16 },
    { id: "guard", label: "תאי שמירה לכל צד", min: 0, max: 4, step: 1, value: 2 },
    { id: "pfa", label: "P_fa", min: 1e-8, max: 1e-2, step: 1e-8, value: 1e-4, log: true },
    { id: "snr1", label: "SNR מטרה 1", min: 0, max: 30, step: 0.5, value: 16, unit: "dB" },
    { id: "snr2", label: "SNR מטרה 2", min: 0, max: 30, step: 0.5, value: 13, unit: "dB" },
    { id: "sep", label: "מרחק בין המטרות", min: 1, max: 30, step: 1, value: 5, unit: "תאים" },
    { id: "edge", label: "קפיצת קלאטר בתא 140", min: 0, max: 25, step: 0.5, value: 0, unit: "dB" },
  ],
  readouts(p, t) {
    const d = cfarData({ ...p, seed: Math.floor(t) });
    const hits = [d.t1, d.t2].filter((i) => d.det[i]).length;
    const fa = d.det.filter((v, i) => v && i !== d.t1 && i !== d.t2).length;
    return [
      { label: "α", value: `${num(d.alpha)} (${num(db(d.alpha))} dB)` },
      { label: "מטרות שזוהו", value: `${hits} / 2`, alert: hits < 2 },
      { label: "התרעות שווא", value: String(fa), alert: fa > 0 },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const d = cfarData({ ...p, seed: Math.floor(t) });
    g.axes({ x: [0, NCELL - 1], y: [-20, Math.max(30, p.snr1 + 6, p.edge + 15)], xlabel: "תא טווח", ylabel: "הספק (dB)" });
    g.curve(
      d.power.map((v, i) => [i, db(Math.max(v, 1e-3))]),
      c.muted,
      1.1,
    );
    g.curve(
      d.thr.map((v, i) => [i, db(v)]),
      c.warn,
      2,
    );
    d.det.forEach((v, i) => {
      if (v) g.dot(i, db(d.power[i]), i === d.t1 || i === d.t2 ? c.ok : c.accent, 4.5);
    });
    g.vline(d.t1, c.grid, "T1");
    g.vline(d.t2, c.grid, "T2");
  },
};

/* ---------------- radar horizon ---------------- */
const RE = 6371;
const horizon = (k: number, hM: number) => Math.sqrt(2 * k * RE * (hM / 1000));
const radarHorizon: SimDef = {
  id: "radar_horizon",
  title: "אופק מכ\"ם בכדור ארץ אפקטיבי (k=4/3)",
  caption: "Line-of-sight horizon of a radar over a smooth earth with refraction factor k; the shaded zone below the horizon line is masked, and a low-flying target closes in.",
  model: "d = √(2kR_e h_r) + √(2kR_e h_t);  for k = 4/3: d(km) ≈ 4.12(√h_r + √h_t), h in m",
  duration: 10,
  params: [
    { id: "hr", label: "גובה אנטנת המכ\"ם", min: 2, max: 1000, step: 1, value: 20, unit: "m", log: true },
    { id: "ht", label: "גובה המטרה", min: 5, max: 5000, step: 1, value: 50, unit: "m", log: true },
    { id: "k", label: "מקדם שבירה k", min: 1, max: 2, step: 0.01, value: 4 / 3 },
    { id: "rmax", label: "טווח התצוגה", min: 20, max: 500, step: 1, value: 80, unit: "km" },
  ],
  readouts(p, t) {
    const d1 = horizon(p.k, p.hr);
    const d2 = horizon(p.k, p.ht);
    const r = p.rmax * (1 - t / 10);
    return [
      { label: "אופק המכ\"ם", value: `${num(d1)} km` },
      { label: "תוספת מגובה המטרה", value: `${num(d2)} km` },
      { label: "טווח קו ראייה", value: `${num(d1 + d2)} km` },
      { label: "מצב", value: r <= d1 + d2 ? "נראית" : "מוסתרת", alert: r <= d1 + d2 },
    ];
  },
  draw(g, p, t) {
    const c = g.c;
    const d1 = horizon(p.k, p.hr);
    const hmin = (d: number) => (d <= d1 ? 0 : (((d - d1) * (d - d1)) / (2 * p.k * RE)) * 1000);
    const ymax = Math.max(p.ht * 1.6, hmin(p.rmax) * 1.1, p.hr * 1.5, 50);
    g.axes({ x: [0, p.rmax], y: [0, ymax], xlabel: "טווח (km)", ylabel: "גובה (m)" });
    const pts: [number, number][] = [];
    for (let i = 0; i <= 200; i++) {
      const d = (i / 200) * p.rmax;
      pts.push([d, Math.min(hmin(d), ymax * 2)]);
    }
    g.fill([...pts, [p.rmax, 0], [0, 0]], c.muted, 0.22);
    g.curve(pts, c.muted, 1.6);
    g.vline(d1, c.warn, "אופק");
    g.dot(0, p.hr, c.ink, 5);
    const r = p.rmax * (1 - t / 10);
    const seen = r <= d1 + horizon(p.k, p.ht);
    g.hline(p.ht, c.grid);
    g.dot(r, p.ht, seen ? c.accent : c.muted, 6);
  },
};

export const RADAR_SIMS = [radarRange, pdRoc, prfAmbiguity, mtiBlind, arrayFactor, monopulse, lfm, cfar, radarHorizon];
