// Scenes the tutor writes: a JSON spec with formulas, never code. The app draws it in the
// same style as the checked scenes and marks it as the tutor's. Coordinates are the
// mathematical ones (z up); every coordinate is an expression in t (seconds), the scene's
// parameters, and the sweep variables (x, y for a surface, s for a curve).
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Builder, Param, TourStop } from "./engine";

type Expr = string | number;
type V3e = [Expr, Expr, Expr];
export interface SpecObject {
  type: "surface" | "curve" | "vector" | "point" | "field" | "plane";
  label?: string;
  info?: string;
  color?: string;
  // surface
  z?: Expr;
  x?: [number, number] | Expr;
  y?: [number, number] | Expr;
  n?: number;
  colormap?: "viridis" | "diverge" | "ocean" | "inferno";
  range?: [number, number];
  opacity?: number;
  // curve
  s?: [number, number];
  width?: number;
  // vector / point
  from?: V3e;
  to?: V3e;
  at?: V3e;
  r?: number;
  trail?: number;
  // field
  vx?: Expr;
  vy?: Expr;
  vz?: Expr;
  box?: [[number, number], [number, number], [number, number]];
  scale?: number;
  // plane
  normal?: [number, number, number];
  point?: [number, number, number];
  size?: number;
}
export interface Spec {
  title?: string;
  caption?: string;
  params?: Param[];
  axes?: boolean | { size?: number; labels?: [string, string, string] };
  view?: { cam?: [number, number, number]; target?: [number, number, number] };
  objects: SpecObject[];
  tour?: TourStop[];
}

/* ---------- a small expression compiler: + - * / ^, functions, constants, variables ---------- */
const FN: Record<string, (...a: number[]) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, exp: Math.exp, sqrt: Math.sqrt, abs: Math.abs, log: Math.log,
  log10: Math.log10, ln: Math.log, min: Math.min, max: Math.max, hypot: Math.hypot, floor: Math.floor, sign: Math.sign,
  pow: Math.pow, mod: (a, b) => ((a % b) + b) % b,
};
const CONST: Record<string, number> = { pi: Math.PI, e: Math.E };
export type Fn = (s: Record<string, number>) => number;

export function compile(src: Expr): Fn {
  if (typeof src === "number") return () => src;
  const text = String(src);
  const toks = text.match(/\d*\.?\d+(?:e[+-]?\d+)?|[A-Za-z_]\w*|\*\*|[-+*/^(),]/gi) ?? [];
  if (toks.join("") !== text.replace(/\s+/g, "")) throw new Error(`ביטוי לא תקין: ${text}`);
  let i = 0;
  const peek = () => toks[i];
  const next = () => toks[i++];
  const expr = (): Fn => {
    let a = term();
    while (peek() === "+" || peek() === "-") {
      const o = next();
      const l = a;
      const b = term();
      a = o === "+" ? (s) => l(s) + b(s) : (s) => l(s) - b(s);
    }
    return a;
  };
  const term = (): Fn => {
    let a = unary();
    while (peek() === "*" || peek() === "/") {
      const o = next();
      const l = a;
      const b = unary();
      a = o === "*" ? (s) => l(s) * b(s) : (s) => l(s) / b(s);
    }
    return a;
  };
  const unary = (): Fn => {
    if (peek() === "-") {
      next();
      const a = unary();
      return (s) => -a(s);
    }
    if (peek() === "+") {
      next();
      return unary();
    }
    return power();
  };
  const power = (): Fn => {
    const b = atom();
    if (peek() === "^" || peek() === "**") {
      next();
      const e = unary();
      return (s) => Math.pow(b(s), e(s));
    }
    return b;
  };
  const atom = (): Fn => {
    const t = next();
    if (t === undefined) throw new Error(`ביטוי קטוע: ${text}`);
    if (/^[\d.]/.test(t)) {
      const n = Number(t);
      return () => n;
    }
    if (t === "(") {
      const a = expr();
      if (next() !== ")") throw new Error(`חסר סוגר: ${text}`);
      return a;
    }
    if (FN[t] && peek() === "(") {
      next();
      const args = [expr()];
      while (peek() === ",") {
        next();
        args.push(expr());
      }
      if (next() !== ")") throw new Error(`חסר סוגר: ${text}`);
      const fn = FN[t];
      return (s) => fn(...args.map((g) => g(s)));
    }
    if (t in CONST) {
      const c = CONST[t];
      return () => c;
    }
    if (/^[A-Za-z_]\w*$/.test(t)) return (s) => (t in s ? s[t] : NaN);
    throw new Error(`סימן לא מוכר "${t}" ב: ${text}`);
  };
  const out = expr();
  if (i !== toks.length) throw new Error(`ביטוי לא תקין: ${text}`);
  return out;
}

const hex = (c: string | undefined, fallback: number) => {
  if (!c) return fallback;
  const m = /^#?([0-9a-f]{6})$/i.exec(c.trim());
  return m ? parseInt(m[1], 16) : fallback;
};
const PALETTE = [0xffc857, 0x5fd0ff, 0xff7a45, 0x7bd88f, 0xc792ea, 0xff5d8f];

function labelSprite(THREE: any, text: string, color = "#ffffff") {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  const font = "600 44px 'IBM Plex Sans Hebrew', 'IBM Plex Sans', sans-serif";
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 24;
  c.width = w;
  c.height = 64;
  ctx.font = font;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, w, 64);
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.direction = /[֐-׿]/.test(text) ? "rtl" : "ltr";
  ctx.textAlign = "center";
  ctx.fillText(text, w / 2, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.encoding = THREE.sRGBEncoding;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  s.scale.set((0.17 * w) / 64, 0.17, 1);
  s.renderOrder = 10;
  return s;
}

/** Validates a spec (compiles every expression); throws with a message the learner can read. */
export function checkSpec(spec: Spec) {
  if (!spec || !Array.isArray(spec.objects) || !spec.objects.length) throw new Error("במפרט אין objects");
  if (spec.objects.length > 40) throw new Error("יותר מ-40 אובייקטים");
  for (const o of spec.objects) {
    for (const k of ["z", "vx", "vy", "vz"] as const) if (o[k] !== undefined) compile(o[k] as Expr);
    for (const k of ["x", "y"] as const) if (o[k] !== undefined && !Array.isArray(o[k])) compile(o[k] as Expr);
    for (const k of ["from", "to", "at"] as const) if (o[k]) (o[k] as V3e).forEach(compile);
  }
}

export function specBuilder(spec: Spec): Builder {
  const P = (THREE: any, a: number, b: number, c: number) => new THREE.Vector3(a, c, -b); // math (x, y, z) → three (x, z, −y)
  return (THREE, sc, v, h) => {
    h.studio(sc, v.look, { fog: false });
    const L = v.look === "light";
    const updates: ((sv: Record<string, number>) => void)[] = [];
    let objIndex = 0;
    const tag = (o: any, obj: SpecObject, fallback: string) => {
      if (obj.label || obj.info) h.info(o, obj.label || fallback, obj.info);
      if (obj.label) {
        const s = labelSprite(THREE, obj.label);
        o.userData.labelSprite = s;
        sc.add(s);
      }
      return o;
    };
    if (spec.axes) {
      const size = typeof spec.axes === "object" ? spec.axes.size ?? 2 : 2;
      const names = (typeof spec.axes === "object" && spec.axes.labels) || ["x", "y", "z"];
      [[1, 0, 0, 0xd8433b], [0, 1, 0, 0x2f9e44], [0, 0, 1, 0x1c64c8]].forEach(([x, y, z, c], i) => {
        const a = h.arrow(c, 0.012, 0.04, 0.1);
        a.set(P(THREE, x, y, z), size);
        sc.add(a);
        const s = labelSprite(THREE, names[i]);
        s.position.copy(P(THREE, x, y, z).multiplyScalar(size + 0.18));
        sc.add(s);
      });
      const grid = new THREE.GridHelper(2 * size, 8, L ? 0xa9b6bf : 0x2c3b47, L ? 0xd6dde2 : 0x18232b);
      sc.add(grid);
    }
    for (const obj of spec.objects) {
      const color = hex(obj.color, PALETTE[objIndex++ % PALETTE.length]);
      if (obj.type === "surface") {
        const fz = compile(obj.z ?? 0);
        const [x0, x1] = Array.isArray(obj.x) ? obj.x : [-1, 1];
        const [y0, y1] = Array.isArray(obj.y) ? obj.y : [-1, 1];
        const n = Math.min(h.lite ? 60 : 100, Math.max(8, obj.n ?? 64));
        const geo = new THREE.PlaneGeometry(1, 1, n, n);
        const pos = geo.attributes.position;
        const col = new Float32Array(pos.count * 3);
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const uv = Float32Array.from(pos.array);
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0, envMapIntensity: 0.3, side: THREE.DoubleSide, transparent: (obj.opacity ?? 1) < 1, opacity: obj.opacity ?? 1 }));
        mesh.castShadow = true;
        sc.add(tag(mesh, obj, "משטח"));
        const stops = h.CM[obj.colormap ?? "viridis"] ?? h.CM.viridis;
        let lo = obj.range?.[0];
        let hi = obj.range?.[1];
        updates.push((sv) => {
          const vals = new Float32Array(pos.count);
          let a = Infinity;
          let b = -Infinity;
          for (let i = 0; i < pos.count; i++) {
            sv.x = x0 + (uv[3 * i] + 0.5) * (x1 - x0);
            sv.y = y0 + (uv[3 * i + 1] + 0.5) * (y1 - y0);
            const z = fz(sv);
            vals[i] = Number.isFinite(z) ? z : 0;
            a = Math.min(a, vals[i]);
            b = Math.max(b, vals[i]);
            const p = P(THREE, sv.x, sv.y, vals[i]);
            pos.setXYZ(i, p.x, p.y, p.z);
          }
          if (lo === undefined || hi === undefined) [lo, hi] = [a, b > a ? b : a + 1];
          for (let i = 0; i < pos.count; i++) col.set(h.cmap(stops, (vals[i] - lo!) / (hi! - lo!)), 3 * i);
          pos.needsUpdate = true;
          geo.attributes.color.needsUpdate = true;
          geo.computeVertexNormals();
          const s = mesh.userData.labelSprite;
          if (s) s.position.copy(P(THREE, x1, y1, vals[pos.count - 1] + 0.25));
        });
      } else if (obj.type === "curve") {
        const fx = compile((obj.x as Expr) ?? "s");
        const fy = compile((obj.y as Expr) ?? 0);
        const fz = compile(obj.z ?? 0);
        const [s0, s1] = obj.s ?? [0, 1];
        const n = Math.min(600, Math.max(20, obj.n ?? 240));
        const mat = h.std(color, { emissive: color, emissiveIntensity: 0.35, roughness: 0.35 });
        const holder = new THREE.Group();
        sc.add(tag(holder, obj, "עקומה"));
        let mesh: any = null;
        updates.push((sv) => {
          const pts: any[] = [];
          for (let k = 0; k <= n; k++) {
            sv.s = s0 + ((s1 - s0) * k) / n;
            const x = fx(sv);
            const y = fy(sv);
            const z = fz(sv);
            if ([x, y, z].every(Number.isFinite)) pts.push(P(THREE, x, y, z));
          }
          if (pts.length < 2) return;
          mesh?.geometry.dispose();
          if (!mesh) {
            mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, obj.width ?? 0.02, 6), mat);
            holder.add(mesh);
          } else mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, obj.width ?? 0.02, 6);
          const s = holder.userData.labelSprite;
          if (s) s.position.copy(pts[pts.length - 1]).add(new THREE.Vector3(0, 0.2, 0));
        });
      } else if (obj.type === "vector") {
        const from = (obj.from ?? [0, 0, 0]).map(compile);
        const to = (obj.to ?? [1, 0, 0]).map(compile);
        const a = h.arrow(color, 0.025, 0.07, 0.18);
        sc.add(tag(a, obj, "וקטור"));
        updates.push((sv) => {
          const p0 = P(THREE, from[0](sv), from[1](sv), from[2](sv));
          const p1 = P(THREE, to[0](sv), to[1](sv), to[2](sv));
          const d = p1.clone().sub(p0);
          a.position.copy(p0);
          a.set(d, d.length());
          const s = a.userData.labelSprite;
          if (s) s.position.copy(p1).add(new THREE.Vector3(0, 0.18, 0));
        });
      } else if (obj.type === "point") {
        const at = (obj.at ?? [0, 0, 0]).map(compile);
        const g = h.glow(obj.r ?? 0.06, color, 0.8);
        g.castShadow = true;
        sc.add(tag(g, obj, "נקודה"));
        const N = Math.min(2000, obj.trail ?? 0);
        let buf: Float32Array | null = null;
        let tg: any = null;
        let filled = 0;
        if (N > 1) {
          buf = new Float32Array(N * 3);
          tg = new THREE.BufferGeometry();
          tg.setAttribute("position", new THREE.BufferAttribute(buf, 3));
          sc.add(h.info(new THREE.Line(tg, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })), `מסלול: ${obj.label ?? "נקודה"}`, obj.info));
        }
        updates.push((sv) => {
          const p = P(THREE, at[0](sv), at[1](sv), at[2](sv));
          if (![p.x, p.y, p.z].every(Number.isFinite)) return;
          g.position.copy(p);
          const s = g.userData.labelSprite;
          if (s) s.position.copy(p).add(new THREE.Vector3(0, 0.2, 0));
          if (buf && tg) {
            if (filled < N) filled++;
            buf.copyWithin(3, 0, (N - 1) * 3);
            buf[0] = p.x;
            buf[1] = p.y;
            buf[2] = p.z;
            tg.setDrawRange(0, filled);
            tg.attributes.position.needsUpdate = true;
          }
        });
      } else if (obj.type === "field") {
        const f = [obj.vx ?? 0, obj.vy ?? 0, obj.vz ?? 0].map(compile);
        const box = obj.box ?? [[-1, 1], [-1, 1], [0, 0]];
        const n = Math.min(9, Math.max(2, obj.n ?? 5));
        const grid: number[][] = [];
        const lin = (r: [number, number], k: number) => (r[0] === r[1] ? r[0] : r[0] + ((r[1] - r[0]) * k) / (n - 1));
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < (box[2][0] === box[2][1] ? 1 : n); k++) grid.push([lin(box[0], i), lin(box[1], j), lin(box[2], k)]);
        const arrows = grid.map(() => {
          const a = h.arrow(color, 0.012, 0.035, 0.09);
          sc.add(a);
          return a;
        });
        const holder = new THREE.Group();
        sc.add(tag(holder, obj, "שדה וקטורי"));
        arrows.forEach((a: any) => (a.userData.info = holder.userData.info));
        updates.push((sv) => {
          grid.forEach((g, i) => {
            sv.x = g[0];
            sv.y = g[1];
            sv.z = g[2];
            const d = P(THREE, f[0](sv), f[1](sv), f[2](sv));
            arrows[i].position.copy(P(THREE, g[0], g[1], g[2]));
            const len = d.length() * (obj.scale ?? 0.3);
            arrows[i].visible = Number.isFinite(len) && len > 1e-4;
            if (arrows[i].visible) arrows[i].set(d, Math.min(len, 2));
          });
        });
      } else if (obj.type === "plane") {
        const size = obj.size ?? 3;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color, transparent: true, opacity: obj.opacity ?? 0.2, side: THREE.DoubleSide, depthWrite: false }));
        const nrm = obj.normal ?? [0, 0, 1];
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), P(THREE, nrm[0], nrm[1], nrm[2]).normalize());
        const pt = obj.point ?? [0, 0, 0];
        m.position.copy(P(THREE, pt[0], pt[1], pt[2]));
        sc.add(tag(m, obj, "מישור"));
      }
    }
    return {
      update(t) {
        const sv: Record<string, number> = { ...v.params, t };
        for (const u of updates) u(sv);
      },
    };
  };
}

/** Camera from the spec, in three's axes. */
export function specCamera(spec: Spec): { cam: [number, number, number]; target: [number, number, number] } {
  const c = spec.view?.cam ?? [3.2, -4.2, 2.6];
  const t = spec.view?.target ?? [0, 0, 0];
  return { cam: [c[0], c[2], -c[1]], target: [t[0], t[2], -t[1]] };
}
export function specTour(spec: Spec): TourStop[] | undefined {
  return spec.tour?.map((s) => ({ text: s.text, cam: [s.cam[0], s.cam[2], -s.cam[1]], target: [s.target[0], s.target[2], -s.target[1]] }));
}
