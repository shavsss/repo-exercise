// Drawing helpers shared by the simulators: a canvas painter that maps plot
// coordinates to pixels, with the theme's colors.

export interface Palette {
  ink: string;
  muted: string;
  grid: string;
  accent: string;
  ok: string;
  warn: string;
  blue: string;
  bg: string;
}

export function palette(el: Element): Palette {
  const css = getComputedStyle(el);
  const v = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
  return {
    ink: v("--ink", "#102a43"),
    muted: v("--muted", "#52708a"),
    grid: v("--grid-line", "#b8cbd9"),
    accent: v("--accent", "#d24a1e"),
    ok: v("--ok", "#2a7f6f"),
    warn: v("--warn", "#b9770e"),
    blue: v("--blue", "#2f6fae"),
    bg: v("--sheet", "#ffffff"),
  };
}

export interface Axes {
  x: [number, number];
  y: [number, number];
  xlabel?: string;
  ylabel?: string;
  /** "x" or "y" draw that axis in log10 */
  logx?: boolean;
  grid?: boolean;
  /** fraction of the canvas this plot uses: [x0, y0, x1, y1] in 0..1 */
  box?: [number, number, number, number];
  ticks?: { x?: number[]; y?: number[] };
}

export class Painter {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  c: Palette;
  private a: Axes | null = null;
  private px0 = 0;
  private py0 = 0;
  private px1 = 0;
  private py1 = 0;
  constructor(ctx: CanvasRenderingContext2D, w: number, h: number, c: Palette) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.c = c;
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  /** Sets the plot frame and draws axes, grid and labels. */
  axes(a: Axes) {
    this.a = a;
    const [bx0, by0, bx1, by1] = a.box ?? [0, 0, 1, 1];
    this.px0 = bx0 * this.w + 46;
    this.px1 = bx1 * this.w - 12;
    this.py0 = by0 * this.h + 10;
    this.py1 = by1 * this.h - 30;
    const { ctx, c } = this;
    const xt = a.ticks?.x ?? niceTicks(a.x[0], a.x[1], a.logx);
    const yt = a.ticks?.y ?? niceTicks(a.y[0], a.y[1]);
    ctx.save();
    ctx.lineWidth = 1;
    ctx.fillStyle = c.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const t of xt) {
      const x = this.X(t);
      if (a.grid !== false) this.seg(x, this.py0, x, this.py1, c.grid, 0.6);
      ctx.fillText(fmt(t), x, this.py1 + 4);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (const t of yt) {
      const y = this.Y(t);
      if (a.grid !== false) this.seg(this.px0, y, this.px1, y, c.grid, 0.6);
      ctx.fillText(fmt(t), this.px0 - 5, y);
    }
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(this.px0, this.py0, this.px1 - this.px0, this.py1 - this.py0);
    ctx.fillStyle = c.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    if (a.xlabel) ctx.fillText(a.xlabel, (this.px0 + this.px1) / 2, this.py1 + 26);
    if (a.ylabel) {
      ctx.save();
      ctx.translate(this.px0 - 36, (this.py0 + this.py1) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(a.ylabel, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  X(x: number) {
    const a = this.a!;
    const [lo, hi] = a.logx ? [Math.log10(a.x[0]), Math.log10(a.x[1])] : a.x;
    const v = a.logx ? Math.log10(Math.max(x, 1e-30)) : x;
    return this.px0 + ((v - lo) / (hi - lo)) * (this.px1 - this.px0);
  }
  Y(y: number) {
    const a = this.a!;
    return this.py1 - ((y - a.y[0]) / (a.y[1] - a.y[0])) * (this.py1 - this.py0);
  }
  clip() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(this.px0, this.py0, this.px1 - this.px0, this.py1 - this.py0);
    this.ctx.clip();
  }
  unclip() {
    this.ctx.restore();
  }

  seg(x0: number, y0: number, x1: number, y1: number, color: string, width = 1, dash?: number[]) {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.restore();
  }

  /** A curve in plot coordinates; NaN breaks the line. */
  curve(pts: [number, number][], color: string, width = 2, dash?: number[]) {
    const { ctx } = this;
    this.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    let pen = false;
    for (const [x, y] of pts) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        pen = false;
        continue;
      }
      const X = this.X(x);
      const Y = this.Y(y);
      if (pen) ctx.lineTo(X, Y);
      else ctx.moveTo(X, Y);
      pen = true;
    }
    ctx.stroke();
    this.unclip();
  }

  fn(f: (x: number) => number, color: string, width = 2, dash?: number[], n = 400) {
    const a = this.a!;
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const x = a.logx ? 10 ** (Math.log10(a.x[0]) + (i / n) * (Math.log10(a.x[1]) - Math.log10(a.x[0]))) : a.x[0] + (i / n) * (a.x[1] - a.x[0]);
      pts.push([x, f(x)]);
    }
    this.curve(pts, color, width, dash);
  }

  hline(y: number, color: string, label?: string, dash: number[] = [5, 4]) {
    this.seg(this.px0, this.Y(y), this.px1, this.Y(y), color, 1.3, dash);
    if (label) this.label(label, this.px1 - 4, this.Y(y) - 4, color, "right");
  }
  vline(x: number, color: string, label?: string, dash: number[] = [5, 4]) {
    if (x < Math.min(...this.a!.x) || x > Math.max(...this.a!.x)) return;
    this.seg(this.X(x), this.py0, this.X(x), this.py1, color, 1.3, dash);
    if (label) this.label(label, this.X(x) + 4, this.py0 + 12, color, "left");
  }

  dot(x: number, y: number, color: string, r = 5) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.X(x), this.Y(y), r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  label(text: string, x: number, y: number, color: string, align: CanvasTextAlign = "center") {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  /** label at plot coordinates */
  note(text: string, x: number, y: number, color: string, align: CanvasTextAlign = "center") {
    this.label(text, this.X(x), this.Y(y), color, align);
  }

  /** A filled polygon in plot coordinates (a band: upper curve then the lower one reversed). */
  fill(pts: [number, number][], color: string, alpha = 0.18) {
    const { ctx } = this;
    const ok = pts.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    if (ok.length < 3) return;
    this.clip();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ok.forEach(([x, y], i) => (i ? ctx.lineTo(this.X(x), this.Y(y)) : ctx.moveTo(this.X(x), this.Y(y))));
    ctx.closePath();
    ctx.fill();
    this.unclip();
  }

  /** The zero contour of f over the plot area (marching squares on an n-column grid). */
  contour(f: (x: number, y: number) => number, color: string, width = 1.6, dash?: number[], n = 140) {
    const a = this.a!;
    const m = Math.max(8, Math.round((n * (this.py1 - this.py0)) / Math.max(1, this.px1 - this.px0)));
    const xs = (i: number) => a.x[0] + (i / n) * (a.x[1] - a.x[0]);
    const ys = (j: number) => a.y[0] + (j / m) * (a.y[1] - a.y[0]);
    const v: number[][] = [];
    for (let i = 0; i <= n; i++) {
      v.push([]);
      for (let j = 0; j <= m; j++) v[i].push(f(xs(i), ys(j)));
    }
    const { ctx } = this;
    this.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    const lerp = (x0: number, y0: number, f0: number, x1: number, y1: number, f1: number): [number, number] => {
      const k = f0 / (f0 - f1);
      return [x0 + k * (x1 - x0), y0 + k * (y1 - y0)];
    };
    for (let i = 0; i < n; i++)
      for (let j = 0; j < m; j++) {
        const c = [
          [xs(i), ys(j), v[i][j]],
          [xs(i + 1), ys(j), v[i + 1][j]],
          [xs(i + 1), ys(j + 1), v[i + 1][j + 1]],
          [xs(i), ys(j + 1), v[i][j + 1]],
        ];
        const pts: [number, number][] = [];
        for (let e = 0; e < 4; e++) {
          const [x0, y0, f0] = c[e];
          const [x1, y1, f1] = c[(e + 1) % 4];
          if (!Number.isFinite(f0) || !Number.isFinite(f1)) continue;
          if (f0 > 0 !== f1 > 0) pts.push(lerp(x0, y0, f0, x1, y1, f1));
        }
        for (let k = 0; k + 1 < pts.length; k += 2) {
          ctx.moveTo(this.X(pts[k][0]), this.Y(pts[k][1]));
          ctx.lineTo(this.X(pts[k + 1][0]), this.Y(pts[k + 1][1]));
        }
      }
    ctx.stroke();
    this.unclip();
  }

  /** Expands one of the ranges so that a unit is the same length on both axes. */
  equal(x: [number, number], y: [number, number], box: [number, number, number, number] = [0, 0, 1, 1]): { x: [number, number]; y: [number, number] } {
    const pw = (box[2] - box[0]) * this.w - 58;
    const ph = (box[3] - box[1]) * this.h - 40;
    const sx = (x[1] - x[0]) / pw;
    const sy = (y[1] - y[0]) / ph;
    if (sx > sy) {
      const c = (y[0] + y[1]) / 2;
      const half = (sx * ph) / 2;
      return { x, y: [c - half, c + half] };
    }
    const c = (x[0] + x[1]) / 2;
    const half = (sy * pw) / 2;
    return { x: [c - half, c + half], y };
  }

  /** The plot frame in pixels. */
  frame() {
    return { x0: this.px0, y0: this.py0, x1: this.px1, y1: this.py1 };
  }

  rectPx(x: number, y: number, w: number, h: number, color: string, alpha = 1, stroke = false) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (stroke) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  /** Pixel-space shapes for scene drawings. */
  circle(x: number, y: number, r: number, color: string, fill = true, width = 1.5) {
    const { ctx } = this;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (fill) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }
    ctx.restore();
  }
  arrow(x0: number, y0: number, x1: number, y1: number, color: string, width = 1.6) {
    const { ctx } = this;
    this.seg(x0, y0, x1, y1, color, width);
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4));
    ctx.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export function niceTicks(lo: number, hi: number, log = false): number[] {
  if (log) {
    const out: number[] = [];
    for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) if (10 ** e >= lo * 0.999 && 10 ** e <= hi * 1.001) out.push(10 ** e);
    return out;
  }
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / 6;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return out;
}

export function fmt(v: number) {
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e5 || a < 1e-3) return v.toExponential(0);
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(Number.isInteger(v) ? 0 : 1);
  return Number(v.toPrecision(3)).toString();
}

/** Deterministic random numbers, so a simulator shows the same run for the same parameters. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  const next = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
  const gauss = () => {
    const u = Math.max(next(), 1e-12);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * next());
  };
  return { next, gauss };
}

export const C = 299_792_458;
export const K_BOLTZ = 1.380649e-23;
export const db = (x: number) => 10 * Math.log10(x);
export const undb = (x: number) => 10 ** (x / 10);
