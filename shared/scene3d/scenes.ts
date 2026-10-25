// The library of checked scenes. Each one is computed from the physics or mathematics of
// its module (Coulomb, Biot-Savart, Euler's equations, finite differences, array factors),
// with parameters the learner can move, a corner readout where numbers matter, and an
// explanation on every part that can be clicked. The tutor calls them by id.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Builder, Param, TourStop } from "./engine";

export interface SceneDef {
  id: string;
  title: string;
  /** modules where the scene belongs (both labs), for the tutor's catalog */
  modules: string;
  about: string;
  params: (Param & { options?: string[] })[];
  /** rebuild the whole scene when a parameter changes (geometry depends on it) */
  rebuild?: boolean;
  cam: [number, number, number];
  target?: [number, number, number];
  spin?: number;
  tone?: "aces" | "none";
  caption: string;
  tour?: TourStop[];
  build: Builder;
}

const D2R = Math.PI / 180;

/* ---------- two-source interference ---------- */
const wave: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -1.2 });
  const N = h.lite ? 90 : 150;
  const S = 10;
  const geo = new THREE.PlaneGeometry(S, S, N, N);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const k = 3.4;
  const w = 3.2;
  const lam = (2 * Math.PI) / k;
  const X = new Float32Array(pos.count);
  const Z = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    X[i] = pos.getX(i);
    Z[i] = pos.getZ(i);
  }
  const src = () => {
    const d = (v.params.sep ?? 1.6) * lam;
    return [[-d / 2, 0], [d / 2, 0]];
  };
  sc.add(
    h.info(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.22, metalness: 0, envMapIntensity: 0.3, side: THREE.DoubleSide })), (hit: any) => {
      const [a, b] = src();
      const dl = Math.abs(Math.hypot(hit.point.x - a[0], hit.point.z) - Math.hypot(hit.point.x - b[0], hit.point.z)) / lam + (v.params.phase ?? 0) / 360;
      const fr = Math.abs(dl - Math.round(dl));
      return { t: "משטח הגובה", x: `הפרש הדרכים לשני המקורות כאן, כולל הפרש המופע: ${dl.toFixed(2)} אורכי גל. ${fr < 0.15 ? "קרוב לשלם: התאבכות בונה." : fr > 0.35 ? "קרוב לחצי: התאבכות הורסת." : "בין לבין."}` };
    }),
  );
  const posts = [0, 1].map(() => {
    const p = h.info(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 16), h.std(0xffc857, { emissive: 0xffc857, emissiveIntensity: 0.8 })), "מקור גל", "מקור נקודתי שמתנודד בתדר קבוע. המרחק בין המקורות והפרש המופע ביניהם הם הפרמטרים.");
    sc.add(p);
    return p;
  });
  return {
    update(t) {
      const s = src();
      posts.forEach((p: any, i: number) => p.position.set(s[i][0], 0.2, s[i][1]));
      const ph = ((v.params.phase ?? 0) * Math.PI) / 180;
      for (let i = 0; i < pos.count; i++) {
        let y = 0;
        for (let j = 0; j < 2; j++) {
          const r = Math.hypot(X[i] - s[j][0], Z[i] - s[j][1]);
          y += Math.sin(k * r - w * t + (j ? ph : 0)) / Math.sqrt(1 + 1.2 * r);
        }
        y *= 0.34;
        pos.setY(i, y);
        col.set(h.cmap(h.CM.ocean, 0.5 + y * 1.05), 3 * i);
      }
      pos.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      geo.computeVertexNormals();
    },
  };
};

/* ---------- field lines of two point charges ---------- */
const dipole: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -2.6 });
  const q2 = v.params.q2 ?? -1;
  const q: [number, any][] = [[1, h.V3(-1.3, 0, 0)], [q2, h.V3(1.3, 0, 0)]];
  const Ef = (p: any) => {
    const e = h.V3(0, 0, 0);
    for (const [s, c] of q) {
      const d = p.clone().sub(c);
      const r = d.length();
      e.addScaledVector(d, s / (r * r * r));
    }
    return e;
  };
  const charge = (s: number, p: any) => {
    const col = s > 0 ? 0xe5484d : 0x3e8ef7;
    const g = h.glow(0.12 + 0.08 * Math.min(1, Math.abs(s)), col, 1.4);
    g.position.copy(p);
    sc.add(h.info(g, s > 0 ? `מטען חיובי ${s === 1 ? "+q" : `${s.toFixed(1)}q`}` : `מטען שלילי ${s.toFixed(1)}q`, s > 0 ? "קווי השדה יוצאים ממנו." : "קווי השדה נכנסים אליו."));
    const l = new THREE.PointLight(col, 1.2, 3);
    l.position.copy(p);
    sc.add(l);
  };
  q.forEach(([s, p]) => Math.abs(s) > 0.01 && charge(s, p));
  const movers: [any, number][] = [];
  const n = h.lite ? 24 : 34;
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const yv = 1 - ((i + 0.5) * 2) / n;
    const rr = Math.sqrt(1 - yv * yv);
    const th = ga * i;
    let p = q[0][1].clone().add(h.V3(Math.cos(th) * rr, yv, Math.sin(th) * rr).multiplyScalar(0.24));
    const pts = [p.clone()];
    const vals: number[] = [];
    for (let s = 0; s < 900; s++) {
      const a = Ef(p).normalize();
      const mid = p.clone().addScaledVector(a, 0.015);
      const b = Ef(mid).normalize();
      p = p.clone().addScaledVector(b, 0.03);
      if (s % 3 === 0) {
        pts.push(p.clone());
        vals.push(Math.log(Ef(p).length()));
      }
      if ((q2 < 0 && p.distanceTo(q[1][1]) < 0.22) || p.length() > 7.5) break;
    }
    if (pts.length < 6) continue;
    vals.unshift(vals[0]);
    const tube = h.colorTube(pts, vals, -3.5, 2.5, 0.013, h.CM.viridis, 0.18);
    sc.add(h.info(tube, "קו שדה", "משיק לכיוון E בכל נקודה. הצבע הוא log|E|: צהוב ליד המטענים, סגול רחוק."));
    for (let k = 0; k < 2; k++) movers.push([tube.userData.curve, (i * 0.137 + k * 0.5) % 1]);
  }
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 12, 8), h.std(0xffe9a8, { emissive: 0xffe9a8, emissiveIntensity: 1 }), Math.max(1, movers.length));
  sc.add(dots);
  // the plane y = 0, colored by log|E|, with equipotential lines drawn where V is a multiple of 1/2
  const T = h.lite ? 160 : 256;
  const ext = 5;
  const data = new Uint8Array(T * T * 4);
  const pal = [[0.05, 0.05, 0.2], [0.15, 0.25, 0.55], [0.2, 0.55, 0.6], [0.9, 0.85, 0.4]].map((c) => c.map((x) => Math.pow(x, 2.2)));
  const g8 = (x: number) => Math.round(255 * Math.pow(Math.min(1, x), 1 / 2.2));
  for (let j = 0; j < T; j++)
    for (let i = 0; i < T; i++) {
      const x = -ext + (2 * ext * i) / (T - 1);
      const z = -ext + (2 * ext * j) / (T - 1);
      const p = h.V3(x, 0, z);
      let V = 0;
      for (const [s, c] of q) V += s / Math.max(0.05, p.distanceTo(c));
      const E = Ef(p).length();
      const c = h.cmap(pal, (Math.log(E + 1e-6) + 3.5) / 6.5);
      const Vk = V * 2;
      const line = Math.abs(Vk - Math.round(Vk)) / (2 * E + 1e-9) < 0.025 ? 1 : 0;
      const k = 4 * (j * T + i);
      data[k] = g8(c[0] + line * 0.5);
      data[k + 1] = g8(c[1] + line * 0.5);
      data[k + 2] = g8(c[2] + line * 0.5);
      data[k + 3] = Math.round(255 * Math.min(1, 0.55 + line * 0.45) * Math.min(1, (ext - Math.max(Math.abs(x), Math.abs(z))) * 1.2));
    }
  const tex = new THREE.DataTexture(data, T, T, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.encoding = THREE.sRGBEncoding;
  const slice = new THREE.Mesh(new THREE.PlaneGeometry(2 * ext, 2 * ext), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false }));
  slice.rotation.x = -Math.PI / 2;
  sc.add(h.info(slice, "מישור חתך", "הצבע הוא עוצמת השדה, והקווים הבהירים הם קווי שווי פוטנציאל. הם תמיד ניצבים לקווי השדה."));
  const M = new THREE.Matrix4();
  return {
    update(t) {
      movers.forEach(([c, off], i) => {
        M.setPosition(c.getPointAt((off + t * 0.06) % 1));
        dots.setMatrixAt(i, M);
      });
      dots.instanceMatrix.needsUpdate = true;
    },
  };
};

/* ---------- finite wing: horseshoe vortex streamlines ---------- */
function wingMesh(THREE: any, C: number, s: number, alphaDeg: number) {
  const m = 0.02;
  const pp = 0.4;
  const th = 0.12;
  const yc = (x: number) => (x < pp ? (m / (pp * pp)) * (2 * pp * x - x * x) : (m / ((1 - pp) * (1 - pp))) * (1 - 2 * pp + 2 * pp * x - x * x));
  const yt = (x: number) => 5 * th * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1015 * x ** 4);
  const shape = new THREE.Shape();
  const M = 70;
  for (let i = 0; i <= M; i++) {
    const x = 0.5 * (1 - Math.cos((Math.PI * i) / M));
    const pt = [x * C, (yc(x) + yt(x)) * C];
    if (i) shape.lineTo(pt[0], pt[1]);
    else shape.moveTo(pt[0], pt[1]);
  }
  for (let i = M - 1; i >= 1; i--) {
    const x = 0.5 * (1 - Math.cos((Math.PI * i) / M));
    shape.lineTo(x * C, (yc(x) - yt(x)) * C);
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth: 2 * s, bevelEnabled: false, curveSegments: 32 });
  g.translate(-C / 4, 0, -s);
  g.rotateZ(-alphaDeg * D2R);
  g.computeVertexNormals();
  return g;
}
const wing: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { shadow: 9, floor: -2.2 });
  const alpha = v.params.alpha ?? 6;
  const C = 1.6;
  const s = 3.4;
  const bh = (s * Math.PI) / 4;
  // circulation grows with the lift coefficient, about 2π per radian below stall
  const G = 0.38 * Math.max(0.2, alpha + 2);
  const rc = 0.14;
  const segs = [[h.V3(40, 0, -bh), h.V3(0, 0, -bh)], [h.V3(0, 0, -bh), h.V3(0, 0, bh)], [h.V3(0, 0, bh), h.V3(40, 0, bh)]];
  const vel0 = (p: any, sign: number) => {
    const u = h.V3(1, 0, 0);
    for (const [A, B] of segs) {
      const r0 = B.clone().sub(A);
      const r1 = p.clone().sub(A);
      const r2 = p.clone().sub(B);
      const cr = r1.clone().cross(r2);
      const d = cr.lengthSq() + (rc * r0.length()) ** 2;
      const k = ((sign * G) / (4 * Math.PI)) * r0.dot(r1.clone().divideScalar(r1.length()).sub(r2.clone().divideScalar(r2.length()))) / d;
      u.addScaledVector(cr, k);
    }
    return u;
  };
  const sign = vel0(h.V3(4, 0, 0), 1).y < 0 ? 1 : -1;
  const vel = (p: any) => vel0(p, sign);
  const wingM = new THREE.Mesh(wingMesh(THREE, C, s, alpha), h.std(v.look === "light" ? 0xbfc8d0 : 0xc9d2da, { metalness: 0.6, roughness: 0.3 }));
  wingM.castShadow = true;
  sc.add(h.info(wingM, "כנף NACA 2412", `מיתר 1.6, מוטה 6.8 (AR ≈ 4.3), זווית התקפה ${alpha}°. במודל היא מוחלפת במערבולת קשורה אחת ברבע המיתר.`));
  const seeds: any[] = [];
  for (const side of [-1, 1])
    for (const r of [0.28, 0.55])
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + (r > 0.4 ? Math.PI / 8 : 0);
        seeds.push(h.V3(-3, r * Math.sin(a), side * bh + r * Math.cos(a)));
      }
  for (const z of [-1.9, -0.95, 0, 0.95, 1.9]) for (const y of [0.5, -0.5]) seeds.push(h.V3(-3, y, z));
  const lines: any[] = [];
  for (const s0 of seeds) {
    let p = s0.clone();
    const pts = [p.clone()];
    const sp = [vel(p).length()];
    const st = 0.05;
    for (let i = 0; i < 300 && p.x < 10; i++) {
      const a = vel(p).normalize();
      const mid = p.clone().addScaledVector(a, st / 2);
      const b = vel(mid);
      p = p.clone().addScaledVector(b.clone().normalize(), st);
      pts.push(p.clone());
      sp.push(b.length());
    }
    const tube = h.colorTube(pts, sp, 0.55, 1.6, 0.012, h.CM.viridis, 0.15);
    sc.add(h.info(tube, "קו זרם", "מחושב מחוק ביו-סבר לשלושת קטעי המערבולת ועוד הזרם החופשי. הצבע הוא המהירות: צהוב מהיר, סגול איטי."));
    lines.push(tube.userData.curve);
  }
  const dash = new THREE.LineDashedMaterial({ color: 0xffc857, dashSize: 0.15, gapSize: 0.12, transparent: true, opacity: 0.6 });
  for (const [a, b, t, x] of [
    [h.V3(0, 0, -bh), h.V3(10, 0, -bh), "מערבולת נגררת", "נמשכת מקצה הכנף לאחור. במרחק b' = πb/4 מהמרכז, לפי פיזור עילוי אליפטי."],
    [h.V3(0, 0, bh), h.V3(10, 0, bh), "מערבולת נגררת", "נמשכת מקצה הכנף לאחור. במרחק b' = πb/4 מהמרכז, לפי פיזור עילוי אליפטי."],
    [h.V3(0, 0, -bh), h.V3(0, 0, bh), "מערבולת קשורה", "מחליפה את הכנף במודל. לפי קוטה-ז'וקובסקי, העילוי ליחידת מוטה הוא ρV∞Γ."],
  ] as [any, any, string, string][]) {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), dash);
    l.computeLineDistances();
    sc.add(h.info(l, t, x));
  }
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 10, 8), h.std(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), lines.length * 2);
  sc.add(dots);
  const M = new THREE.Matrix4();
  return {
    update(t) {
      lines.forEach((c, i) => {
        for (let k = 0; k < 2; k++) {
          M.setPosition(c.getPointAt((i * 0.31 + k * 0.5 + t * 0.06) % 1));
          dots.setMatrixAt(2 * i + k, M);
        }
      });
      dots.instanceMatrix.needsUpdate = true;
    },
  };
};

/* ---------- gradient descent with and without momentum ---------- */
const descent: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -2.2, shadow: 6 });
  const f = (x: number, y: number) =>
    0.09 * (x * x + y * y) - 1.5 * Math.exp(-((x - 1.4) ** 2 + (y - 1.1) ** 2) / 0.9) - 1.0 * Math.exp(-((x + 1.3) ** 2 + (y + 1.5) ** 2) / 0.6) + 0.18 * Math.sin(1.6 * x) * Math.cos(1.4 * y);
  const N = h.lite ? 100 : 160;
  const S = 8;
  const geo = new THREE.PlaneGeometry(S, S, N, N);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const val = f(pos.getX(i), pos.getZ(i));
    lo = Math.min(lo, val);
    hi = Math.max(hi, val);
    pos.setY(i, val);
  }
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getY(i) - lo) / (hi - lo);
    const band = Math.abs(((u * 14) % 1) - 0.5) > 0.46 ? 0.45 : 1;
    col.set(h.cmap(h.CM.viridis, u).map((x: number) => x * band), 3 * i);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const surf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0, envMapIntensity: 0.25, side: THREE.DoubleSide }));
  surf.receiveShadow = true;
  sc.add(h.info(surf, (hit: any) => ({ t: "משטח ההפסד", x: `f(${hit.point.x.toFixed(2)}, ${hit.point.z.toFixed(2)}) = ${f(hit.point.x, hit.point.z).toFixed(3)}. הקווים הכהים הם קווי גובה.` })));
  const lr = v.params.lr ?? 0.04;
  const beta = v.params.beta ?? 0.9;
  const run = (b: number, eta: number) => {
    let x = -3.2;
    let y = 3.0;
    let vx = 0;
    let vy = 0;
    const path: any[] = [];
    for (let s = 0; s < 500; s++) {
      const e = 1e-3;
      const gx = (f(x + e, y) - f(x - e, y)) / (2 * e);
      const gy = (f(x, y + e) - f(x, y - e)) / (2 * e);
      vx = b * vx - eta * gx;
      vy = b * vy - eta * gy;
      x += vx;
      y += vy;
      if (!Number.isFinite(x) || Math.abs(x) > 6 || Math.abs(y) > 6) break;
      path.push(h.V3(x, f(x, y) + 0.05, y));
    }
    return { curve: new THREE.CatmullRomCurve3(path.length > 1 ? path : [h.V3(-3.2, f(-3.2, 3), 3), h.V3(-3.2, f(-3.2, 3) + 0.01, 3)]), end: [x, y] };
  };
  const runs: [ReturnType<typeof run>, number, string][] = [
    [run(0, lr * 1.6), 0xffffff, `ירידה בגרדיאנט רגילה, η = ${(lr * 1.6).toFixed(3)}`],
    [run(beta, lr), 0xff7a45, `עם תנע, η = ${lr.toFixed(3)}, β = ${beta.toFixed(2)}`],
  ];
  const balls = runs.map(([r, color, t]) => {
    const x = `נקודת הסיום (${r.end[0].toFixed(2)}, ${r.end[1].toFixed(2)}), f = ${f(r.end[0], r.end[1]).toFixed(3)}.`;
    sc.add(h.info(new THREE.Mesh(new THREE.TubeGeometry(r.curve, 500, 0.022, 6, false), h.std(color, { emissive: color, emissiveIntensity: 0.5, roughness: 0.3 })), t, x));
    const b = h.glow(0.12, color, 0.5);
    b.castShadow = true;
    sc.add(h.info(b, t, x));
    return [r.curve, b];
  });
  return {
    update(t) {
      const u = Math.min(1, (t * 0.1) % 1.3);
      balls.forEach(([c, b]: any) => b.position.copy(c.getPointAt(u)).add(h.V3(0, 0.1, 0)));
    },
  };
};

/* ---------- crystal lattices ---------- */
const LATTICES = ["יהלום (Si, Ge)", "FCC (Al, Cu)", "BCC (Fe-α, W)", "קובית פשוטה"];
const crystal: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -3, shadow: 6 });
  const kind = Math.round(v.params.lattice ?? 0);
  const basis = [
    [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0], [0.25, 0.25, 0.25], [0.25, 0.75, 0.75], [0.75, 0.25, 0.75], [0.75, 0.75, 0.25]],
    [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]],
    [[0, 0, 0], [0.5, 0.5, 0.5]],
    [[0, 0, 0]],
  ][kind];
  const nn = [Math.sqrt(3) / 4, Math.SQRT2 / 2, Math.sqrt(3) / 2, 1][kind];
  const coord = [4, 12, 8, 6][kind];
  const a = 1.7;
  const n = 2;
  const atoms: any[] = [];
  for (let i = -1; i <= n; i++)
    for (let j = -1; j <= n; j++)
      for (let k = -1; k <= n; k++)
        for (const b of basis) {
          const p = [i + b[0], j + b[1], k + b[2]];
          if (p.every((x) => x >= -1e-6 && x <= n + 1e-6)) atoms.push(h.V3(p[0], p[1], p[2]));
        }
  const P = atoms.map((p) => p.clone().sub(h.V3(n / 2, n / 2, n / 2)).multiplyScalar(a));
  const centre = P.reduce((best: number, p: any, i: number) => (p.length() < P[best].length() ? i : best), 0);
  const am = new THREE.InstancedMesh(new THREE.SphereGeometry(kind === 0 ? 0.17 : 0.22, h.lite ? 20 : 32, h.lite ? 14 : 20), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.3, clearcoat: 0.5, envMapIntensity: 0.5 }), P.length);
  const M = new THREE.Matrix4();
  const cA = new THREE.Color(v.look === "light" ? 0x4f6a86 : 0x6f8fb0);
  const cS = new THREE.Color(0xff8a3d);
  P.forEach((p: any, i: number) => {
    M.makeTranslation(p.x, p.y, p.z);
    am.setMatrixAt(i, M);
    am.setColorAt(i, i === centre ? cS : cA);
  });
  am.castShadow = true;
  sc.add(h.info(am, (hit: any) => (hit.instanceId === centre ? { t: "אטום ושכניו הקרובים", x: `${coord} שכנים במרחק ${(nn).toFixed(3)}a. במבנה הזה מספר הקואורדינציה הוא ${coord}.` } : { t: "אטום", x: `${LATTICES[kind]}. בתא היחידה ${basis.length} אטומים.` })));
  const bonds: [number, number][] = [];
  const dmax = a * nn * 1.05;
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) if (P[i].distanceTo(P[j]) < dmax) bonds.push([i, j]);
  const bm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.3, envMapIntensity: 0.4 }), Math.max(1, bonds.length));
  const up = h.V3(0, 1, 0);
  const Q = new THREE.Quaternion();
  const Sc = h.V3(1, 1, 1);
  const cB = new THREE.Color(v.look === "light" ? 0x8795a3 : 0x4a5866);
  bonds.forEach(([i, j], k) => {
    const d = P[j].clone().sub(P[i]);
    Sc.set(1, d.length(), 1);
    Q.setFromUnitVectors(up, d.normalize());
    M.compose(P[i].clone().add(P[j]).multiplyScalar(0.5), Q, Sc);
    bm.setMatrixAt(k, M);
    bm.setColorAt(k, i === centre || j === centre ? cS : cB);
  });
  sc.add(h.info(bm, "קשר לשכן קרוב", `מרחק ${nn.toFixed(3)}a בין מרכזי האטומים.`));
  const cell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(a, a, a)), new THREE.LineBasicMaterial({ color: 0xffc857 }));
  cell.position.set(-a / 2, -a / 2, -a / 2);
  sc.add(h.info(cell, "תא יחידה קובי", `צלע a. ${LATTICES[kind]}.`));
  return {};
};

/* ---------- cantilever I-beam ---------- */
const beam: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -2.4, shadow: 7 });
  const L = 6;
  const c = 0.45;
  const parts = [[L, 0.12, 0.8, c - 0.06], [L, 0.12, 0.8, -c + 0.06], [L, 0.9 - 0.24, 0.08, 0]].map(([lx, ly, lz, y0]) => {
    const g = new THREE.BoxGeometry(lx, ly, lz, h.lite ? 60 : 120, 2, 2);
    g.translate(lx / 2, y0, 0);
    g.userData.o = Float32Array.from(g.attributes.position.array);
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3));
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.1, envMapIntensity: 0.3 }));
    m.castShadow = true;
    sc.add(
      h.info(m, (hit: any) => {
        const xi = Math.min(1, Math.max(0, hit.point.x / L));
        return { t: "קורת I", x: `x/L = ${xi.toFixed(2)}. המומנט כאן ${(100 * (1 - xi)).toFixed(0)}% מהמומנט בריתום, והמאמץ σ = M·y/I גדל ליניארית עם המרחק מהציר הניטרלי.` };
      }),
    );
    return g;
  });
  const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(L, 0.9, 0.8)), new THREE.LineBasicMaterial({ color: v.look === "light" ? 0x55606a : 0x8fa3b5, transparent: true, opacity: 0.5 }));
  ghost.position.set(L / 2, 0, 0);
  sc.add(ghost);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.4, 2.2), h.std(v.look === "light" ? 0x9aa4ac : 0x3a434b, { roughness: 0.9 }));
  wall.position.set(-0.25, -0.5, 0);
  wall.receiveShadow = true;
  sc.add(h.info(wall, "ריתום", "שקיעה אפס ושיפוע אפס. כאן מומנט הכפיפה מקסימלי, PL."));
  const ar = h.arrow(0xffc857, 0.04, 0.12, 0.3);
  sc.add(h.info(ar, "עומס P בקצה", "שקיעת הקצה δ = PL³/(3EI): כפל באורך הקורה נותן פי 8 בשקיעה."));
  let P = 0;
  return {
    update(t) {
      const target = v.params.load ?? 0.7;
      P = v.params.animate ? target * (0.55 + 0.45 * Math.sin(t * 0.9)) : target;
      const tip = 1.1 * P;
      for (const g of parts) {
        const p = g.attributes.position;
        const o = g.userData.o;
        const col = g.attributes.color.array;
        for (let i = 0; i < p.count; i++) {
          const x = o[3 * i];
          const y = o[3 * i + 1];
          const xi = x / L;
          const vd = (-tip * xi * xi * (3 - xi)) / 2;
          const th = ((-tip * 3) / (2 * L)) * xi * (2 - xi);
          p.setXYZ(i, x - y * Math.sin(th), vd + y * Math.cos(th), o[3 * i + 2]);
          col.set(h.cmap(h.CM.diverge, 0.5 + 0.5 * (1 - xi) * (y / c) * P), 3 * i);
        }
        p.needsUpdate = true;
        g.attributes.color.needsUpdate = true;
        g.computeVertexNormals();
      }
      ar.position.set(L, -tip + c + 1.2 * P + 0.05, 0);
      ar.set(h.V3(0, -1, 0), Math.max(0.05, 1.2 * P));
    },
    hud: () => `P/Pmax = ${P.toFixed(2)}\nδ_tip = PL³/3EI  ∝ P\nσ_max at wall, top: +, bottom: −`,
  };
};

/* ---------- transient heat conduction, explicit finite differences ---------- */
const heat: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -0.2, shadow: 6, gridSize: 16 });
  const N = h.lite ? 64 : 96;
  const S = 6;
  let T = new Float32Array(N * N);
  let Tn = new Float32Array(N * N);
  const q0 = new Float32Array(N * N);
  const q1 = new Float32Array(N * N);
  const f = N / 96;
  const blob = (arr: Float32Array, ci: number, cj: number, r: number, p: number) => {
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const d2 = (i - ci * f) ** 2 + (j - cj * f) ** 2;
        if (d2 < r * r * f * f * 4) arr[j * N + i] += p * Math.exp(-d2 / (r * r * f * f));
      }
  };
  blob(q0, 30, 32, 5, 1.0);
  blob(q0, 60, 62, 6, 0.7);
  blob(q1, 68, 28, 4, 1.4);
  let on = 1;
  let r = 0.22;
  let blown = false;
  const step = () => {
    const pw = v.params.power ?? 1;
    for (let j = 1; j < N - 1; j++)
      for (let i = 1; i < N - 1; i++) {
        const k = j * N + i;
        Tn[k] = T[k] + r * (T[k - 1] + T[k + 1] + T[k - N] + T[k + N] - 4 * T[k]) + 0.012 * pw * (q0[k] + on * q1[k]) * (f * f);
      }
    const s = T;
    T = Tn;
    Tn = s;
  };
  for (let i = 0; i < 2600 * f * f; i++) step();
  let Tmax = 0;
  for (let i = 0; i < T.length; i++) Tmax = Math.max(Tmax, T[i]);
  Tmax *= 1.15;
  const geo = new THREE.PlaneGeometry(S, S, N - 1, N - 1);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const plate = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0, envMapIntensity: 0.25, side: THREE.DoubleSide }));
  plate.castShadow = true;
  sc.add(
    h.info(plate, (hit: any) => {
      const i = Math.round((hit.point.x / S + 0.5) * (N - 1));
      const j = Math.round((hit.point.z / S + 0.5) * (N - 1));
      const k = Math.min(N * N - 1, Math.max(0, j * N + i));
      return { t: "הלוח", x: `טמפרטורה ${((100 * T[k]) / Tmax).toFixed(0)}% מהסקאלה. השפות מוחזקות ב-0, והקווים הם איזותרמות.` };
    }),
  );
  const base = new THREE.Mesh(new THREE.BoxGeometry(S + 0.3, 0.14, S + 0.3), h.std(0x4a5560, { metalness: 0.7, roughness: 0.35 }));
  base.position.y = -0.09;
  base.receiveShadow = true;
  sc.add(h.info(base, "גוף קירור", "מחזיק את שפות הלוח בטמפרטורה קבועה (תנאי שפה של דיריכלה)."));
  const draw = () => {
    for (let i = 0; i < pos.count; i++) {
      const u = Math.max(-0.2, Math.min(1.4, T[i] / Tmax));
      pos.setY(i, Math.max(-0.3, Math.min(2.6, u * 1.8)) + 0.002);
      const band = Math.abs(((u * 12) % 1) - 0.5) > 0.47 && u > 0.02 ? 0.55 : 1;
      const c = h.cmap(h.CM.inferno, 0.08 + 0.92 * u);
      col[3 * i] = c[0] * band;
      col[3 * i + 1] = c[1] * band;
      col[3 * i + 2] = c[2] * band;
    }
    pos.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    geo.computeVertexNormals();
  };
  draw();
  return {
    update(t, dt) {
      r = v.params.r ?? 0.22;
      if (!dt) return draw();
      on = t % 9 < 4.5 ? 1 : 0;
      for (let i = 0; i < 10; i++) step();
      let m = 0;
      for (let i = 0; i < T.length; i++) m = Math.max(m, Math.abs(T[i]));
      if (m > Tmax * 50 || !Number.isFinite(m)) {
        blown = true;
        T.fill(0);
        Tn.fill(0);
      } else if (r <= 0.25) blown = false;
      draw();
    },
    hud: () => `r = αΔt/Δx² = ${r.toFixed(3)}  ${r > 0.25 ? "> 1/4: UNSTABLE" : "≤ 1/4: stable"}${blown ? "\n(blew up: reset)" : ""}\nright source ${on ? "ON" : "OFF"}`,
  };
};

/* ---------- induction motor: the rotating field ---------- */
export function motorGroup(THREE: any, h: any) {
  const grp = new THREE.Group();
  const depth = 1.6;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 2.0, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  const K = 360;
  for (let i = 0; i <= K; i++) {
    const a = (2 * Math.PI * i) / K;
    const rel = Math.abs(((((a * 180) / Math.PI) % 60) + 60) % 60 - 30);
    const r = rel > 20 ? 1.05 : 1.6;
    if (i) hole.lineTo(r * Math.cos(a), r * Math.sin(a));
    else hole.moveTo(r * Math.cos(a), r * Math.sin(a));
  }
  shape.holes.push(hole);
  const stator = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 64 }), h.std(0x3d4248, { metalness: 0.55, roughness: 0.45 }));
  stator.geometry.translate(0, 0, -depth / 2);
  stator.userData.role = "dark";
  grp.add(h.info(stator, "סטטור", "פחי פלדה מבודדים, עם שישה שיניים. הסלילים כרוכים סביב השיניים."));
  const coils: any[] = [];
  const PH = [[0, 1], [2, -1], [1, 1], [0, -1], [2, 1], [1, -1]];
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    const pts: any[] = [];
    for (let i = 0; i < 64; i++) {
      const th = (2 * Math.PI * i) / 64;
      const cx = Math.cos(th);
      const sy = Math.sin(th);
      pts.push(h.V3(0, 0.36 * Math.sign(cx) * Math.abs(cx) ** 0.35, 1.0 * Math.sign(sy) * Math.abs(sy) ** 0.35));
    }
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 128, 0.085, 10, true), h.std(0xb87333, { metalness: 0.9, roughness: 0.35 }));
    tube.position.set(1.32 * Math.cos(a), 1.32 * Math.sin(a), 0);
    tube.rotation.z = a;
    tube.userData.role = "accent";
    grp.add(h.info(tube, `סליל ${"ABC"[PH[k][0]]}${PH[k][1] < 0 ? "−" : "+"}`, "סליל של פאזה אחת. הזוהר הוא הזרם: אדום בכיוון אחד, כחול בשני."));
    coils.push(tube);
  }
  const rotor = new THREE.Group();
  grp.add(rotor);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.96, 1.7, 64), h.std(0x9aa3aa));
  core.rotation.x = Math.PI / 2;
  core.userData.role = "body";
  rotor.add(h.info(core, "רוטור כלוב סנאי", "המוטות מקוצרים בטבעות בקצוות. השדה המסתובב משרה בהם זרם, והזרם יוצר מומנט."));
  for (let i = 0; i < 18; i++) {
    const a = (2 * Math.PI * i) / 18;
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 1.9), h.std(0xc0c6cc));
    b.position.set(0.9 * Math.cos(a), 0.9 * Math.sin(a), 0);
    b.rotation.z = a;
    b.userData.role = "accent2";
    rotor.add(b);
  }
  for (const z of [-0.95, 0.95]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.07, 12, 64), h.std(0xc0c6cc));
    ring.position.z = z;
    ring.userData.role = "accent2";
    rotor.add(ring);
  }
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.4, 32), h.std(0xd0d5da));
  shaft.rotation.x = Math.PI / 2;
  shaft.userData.role = "body";
  rotor.add(shaft);
  return { grp, coils, rotor, PH };
}
const motor: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -2.4, shadow: 6 });
  const m = motorGroup(THREE, h);
  sc.add(m.grp);
  m.coils.forEach((c: any) => (c.material = h.std(0xb87333, { metalness: 0.85, roughness: 0.35, emissive: 0x000000 })));
  const front = new THREE.Group();
  front.position.z = 1.3;
  sc.add(front);
  const COL = [0xe5484d, 0x30a46c, 0x3e8ef7];
  const pa = [0, 1, 2].map((i) => {
    const a = h.arrow(COL[i], 0.035, 0.09, 0.22);
    front.add(h.info(a, `השדה של פאזה ${"ABC"[i]}`, "פועם לאורך ציר קבוע, i = cos(ωt − 120°·k). לבד הוא לא מסתובב."));
    return a;
  });
  const res = h.arrow(0xffc857, 0.06, 0.15, 0.32);
  res.position.z = 0.04;
  front.add(h.info(res, "השדה השקול", "סכום שלושת החצים הצבעוניים. אורכו קבוע, פי 1.5 מהשיא של פאזה אחת, והוא מסתובב בתדר הסינכרוני."));
  let th = 0;
  let rot = 0;
  return {
    update(_t, dt) {
      const w = v.params.w ?? 1.4;
      const slip = v.params.slip ?? 0.1;
      th += w * dt;
      rot += (1 - slip) * w * dt;
      const cur = [0, 1, 2].map((i) => Math.cos(th - (i * 2 * Math.PI) / 3));
      m.coils.forEach((c: any, k: number) => {
        const [ph, sg] = m.PH[k];
        const ik = cur[ph] * sg;
        c.material.emissive.setHex(ik > 0 ? 0xff3b2f : 0x2f6bff);
        c.material.emissiveIntensity = Math.abs(ik) * 0.9;
      });
      let bx = 0;
      let by = 0;
      cur.forEach((ik, i) => {
        const a = (i * 2 * Math.PI) / 3;
        const len = 0.82 * ik;
        bx += len * Math.cos(a);
        by += len * Math.sin(a);
        const s = Math.sign(len || 1);
        pa[i].set(h.V3(Math.cos(a) * s, Math.sin(a) * s, 0), Math.abs(len));
      });
      res.set(h.V3(bx, by, 0), Math.hypot(bx, by));
      m.rotor.rotation.z = rot;
    },
    hud: () => `ω_s = ${(v.params.w ?? 1.4).toFixed(2)} rad/s (שדה)\nω_r = ${((1 - (v.params.slip ?? 0.1)) * (v.params.w ?? 1.4)).toFixed(2)} rad/s (רוטור)\nslip s = ${(v.params.slip ?? 0.1).toFixed(2)}`,
  };
};

/* ---------- torque-free rigid body (Euler's equations) ---------- */
const rigid: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -2.6, shadow: 5 });
  const dims = [2.4, 1.2, 0.35];
  const I = [dims[1] ** 2 + dims[2] ** 2, dims[0] ** 2 + dims[2] ** 2, dims[0] ** 2 + dims[1] ** 2].map((x) => x / 12);
  const body = new THREE.Group();
  sc.add(body);
  const box = new THREE.Mesh(h.rbox(dims[0], dims[1], dims[2], 0.05), h.std(0xc9d2da, { metalness: 0.6, roughness: 0.3 }));
  box.castShadow = true;
  body.add(h.info(box, "גוף קשיח", `תיבה ${dims.join(" × ")}. מומנטי ההתמד הראשיים: I₁ < I₂ < I₃. הסיבוב יציב סביב הציר הקצר והארוך, ולא סביב האמצעי.`));
  for (const s of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.18, dims[1] + 0.02, dims[2] + 0.02), h.std(0x1f6f8b, { metalness: 0.4, roughness: 0.35 }));
    cap.position.x = s * (dims[0] / 2 - 0.09);
    body.add(cap);
  }
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, dims[2] + 0.02), h.std(0xff8a3d, { metalness: 0.3, roughness: 0.4 }));
  stripe.position.y = dims[1] / 2 - 0.05;
  body.add(stripe);
  const Larr = h.arrow(0xffc857, 0.04, 0.11, 0.28);
  sc.add(h.info(Larr, "התנע הזוויתי L", "קבוע במרחב, כי אין מומנט חיצוני. בגוף עצמו הוא נע, ומשם ההיפוך."));
  const Warr = h.arrow(0x5fd0ff, 0.03, 0.09, 0.22);
  sc.add(h.info(Warr, "מהירות הזווית ω", "לא מקבילה ל-L כשהגוף לא מסתובב סביב ציר ראשי. הקצה שלה משרטט את המסלול התכלת."));
  const NT = 360;
  const tbuf = new Float32Array(NT * 3);
  const tg = new THREE.BufferGeometry();
  tg.setAttribute("position", new THREE.BufferAttribute(tbuf, 3));
  sc.add(h.info(new THREE.Line(tg, new THREE.LineBasicMaterial({ color: 0x5fd0ff, transparent: true, opacity: 0.55 })), "מסלול קצה ω", "מהירות הזווית לאורך הזמן, במערכת המעבדה."));
  const axis = Math.round(v.params.axis ?? 1);
  const w0 = v.params.w0 ?? 2.6;
  let w = [0.015, 0.015, 0.015];
  w[axis] = w0;
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.55, 0, 0.35));
  let filled = 0;
  const f = (w: number[]) => [((I[1] - I[2]) * w[1] * w[2]) / I[0], ((I[2] - I[0]) * w[2] * w[0]) / I[1], ((I[0] - I[1]) * w[0] * w[1]) / I[2]];
  const rk4 = (w: number[], dt: number) => {
    const k1 = f(w);
    const k2 = f(w.map((x, i) => x + (dt / 2) * k1[i]));
    const k3 = f(w.map((x, i) => x + (dt / 2) * k2[i]));
    const k4 = f(w.map((x, i) => x + dt * k3[i]));
    return w.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  };
  const Lm = (w: number[]) => Math.hypot(...w.map((x, i) => I[i] * x));
  const En = (w: number[]) => 0.5 * w.reduce((s, x, i) => s + I[i] * x * x, 0);
  const L0 = Lm(w);
  const E0 = En(w);
  const dq = new THREE.Quaternion();
  const ax = h.V3(0, 0, 0);
  const show = () => {
    const Lb = h.V3(I[0] * w[0], I[1] * w[1], I[2] * w[2]).applyQuaternion(q);
    const Wb = h.V3(w[0], w[1], w[2]).applyQuaternion(q);
    body.quaternion.copy(q);
    Larr.set(Lb, 1.9);
    Warr.set(Wb, Wb.length() * 0.5);
    const tip = Wb.clone().multiplyScalar(0.5);
    if (filled < NT) filled++;
    tbuf.copyWithin(3, 0, (NT - 1) * 3);
    tbuf[0] = tip.x;
    tbuf[1] = tip.y;
    tbuf[2] = tip.z;
    tg.setDrawRange(0, filled);
    tg.attributes.position.needsUpdate = true;
  };
  show();
  return {
    update(_t, dt) {
      if (!dt) return;
      const st = 0.002;
      const n = Math.max(1, Math.round(dt / st));
      for (let i = 0; i < n; i++) {
        w = rk4(w, st);
        const m = Math.hypot(...w);
        ax.set(w[0] / m, w[1] / m, w[2] / m);
        dq.setFromAxisAngle(ax, m * st);
        q.multiply(dq);
      }
      q.normalize();
      show();
    },
    hud: () => `I = ${I.map((x) => x.toFixed(3)).join(" < ")}\n|L| = ${Lm(w).toFixed(5)}  (Δ ${((Lm(w) / L0 - 1) * 100).toExponential(1)}%)\nE   = ${En(w).toFixed(5)}  (Δ ${((En(w) / E0 - 1) * 100).toExponential(1)}%)`,
  };
};

/* ---------- 3-joint arm, forward kinematics ---------- */
export function armGroup(THREE: any, h: any) {
  const g = new THREE.Group();
  const tag = (m: any, role: string) => ((m.userData.role = role), m);
  const base = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.3, 48), h.std(0)), "dark");
  base.position.y = 0.15;
  g.add(h.info(base, "בסיס", "מערכת הצירים {s} של הבסיס, שממנה נמדד מיקום הקצה."));
  const j1 = new THREE.Group();
  j1.position.y = 0.3;
  g.add(j1);
  const tur = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.55, 0.45, 48), h.std(0)), "body");
  tur.position.y = 0.22;
  j1.add(h.info(tur, "מפרק 0: סבסוב", "מסתובב סביב הציר האנכי."));
  const sh = new THREE.Group();
  sh.position.y = 0.7;
  j1.add(sh);
  const jg = (r: number) => {
    const c = new THREE.CylinderGeometry(r, r, 0.52, 40);
    c.rotateX(Math.PI / 2);
    return c;
  };
  sh.add(h.info(tag(new THREE.Mesh(jg(0.3), h.std(0)), "accent"), "מפרק 1: כתף (θ₁)", "מפרק סיבובי. הציר שלו ניצב למישור הזרוע."));
  const l1 = tag(new THREE.Mesh(h.rbox(0.34, 1.7, 0.34, 0.07), h.std(0)), "body");
  l1.position.y = 0.85;
  sh.add(h.info(l1, "חוליה 1", "אורך 1.7."));
  const el = new THREE.Group();
  el.position.y = 1.7;
  sh.add(el);
  el.add(h.info(tag(new THREE.Mesh(jg(0.25), h.std(0)), "accent"), "מפרק 2: מרפק (θ₂)", "מפרק סיבובי."));
  const l2 = tag(new THREE.Mesh(h.rbox(0.28, 1.35, 0.28, 0.06), h.std(0)), "body");
  l2.position.y = 0.675;
  el.add(h.info(l2, "חוליה 2", "אורך 1.35."));
  const wr = new THREE.Group();
  wr.position.y = 1.35;
  el.add(wr);
  wr.add(h.info(tag(new THREE.Mesh(jg(0.19), h.std(0)), "accent"), "מפרק 3: פרק כף היד (θ₃)", "מפרק סיבובי."));
  const l3 = tag(new THREE.Mesh(h.rbox(0.22, 0.55, 0.22, 0.05), h.std(0)), "body");
  l3.position.y = 0.28;
  wr.add(l3);
  const tool = new THREE.Group();
  tool.position.y = 0.62;
  wr.add(tool);
  tool.add(tag(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 32), h.std(0)), "dark"));
  for (const s of [-1, 1]) {
    const f = tag(new THREE.Mesh(h.rbox(0.05, 0.26, 0.14, 0.02), h.std(0)), "dark");
    f.position.set(s * 0.1, 0.14, 0);
    tool.add(f);
  }
  const axes = new THREE.Group();
  axes.position.y = 0.05;
  tool.add(h.info(axes, "מערכת הצירים {b} של הקצה", "x אדום, y ירוק, z כחול. המיקום והכיוון שלה הם T_sb(θ) מהקינמטיקה הישירה."));
  [[h.V3(1, 0, 0), 0xd8433b], [h.V3(0, 1, 0), 0x2f9e44], [h.V3(0, 0, 1), 0x1c64c8]].forEach(([d, c]: any) => {
    const a = h.arrow(c, 0.015, 0.045, 0.12);
    a.set(d, 0.5);
    a.traverse((o: any) => (o.userData.keep = true));
    axes.add(a);
  });
  return { g, j1, sh, el, wr, tool };
}
const arm: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: 0, shadow: 5, fog: false });
  const a = armGroup(THREE, h);
  h.cad(a.g, v.look);
  sc.add(a.g);
  const trail: any[] = [];
  const tl = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffc857 }));
  sc.add(h.info(tl, "מסלול הקצה", "הנקודות שהקצה עבר בהן כשהמפרקים זזו."));
  const p = h.V3(0, 0, 0);
  return {
    update() {
      a.j1.rotation.y = (v.params.yaw ?? 30) * D2R;
      a.sh.rotation.z = -(v.params.th1 ?? 35) * D2R;
      a.el.rotation.z = -(v.params.th2 ?? -20) * D2R;
      a.wr.rotation.z = -(v.params.th3 ?? 70) * D2R;
      a.g.updateMatrixWorld(true);
      a.tool.getWorldPosition(p);
      if (!trail.length || trail[trail.length - 1].distanceTo(p) > 0.02) {
        trail.push(p.clone());
        if (trail.length > 400) trail.shift();
        tl.geometry.dispose();
        tl.geometry = new THREE.BufferGeometry().setFromPoints(trail);
      }
    },
    hud: () => `p = (${p.x.toFixed(2)}, ${(-p.z).toFixed(2)}, ${p.y.toFixed(2)})`,
  };
};

/* ---------- |G(s)| over the s-plane ---------- */
const splane: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -0.05, fog: false });
  const wn = v.params.wn ?? 1.2;
  const z = v.params.zeta ?? 0.25;
  const sx = [-2.2, 0.6];
  const wy = [-2.2, 2.2];
  const N = h.lite ? 90 : 140;
  const S = 4;
  const mag = (s: number, w: number) => {
    const ar = s * s - w * w + 2 * z * wn * s + wn * wn;
    const ai = 2 * s * w + 2 * z * wn * w;
    return (wn * wn) / Math.hypot(ar, ai);
  };
  const hgt = (m: number) => Math.min(2.2, Math.max(0, (Math.log10(m) + 1.2) * 0.9));
  const geo = new THREE.PlaneGeometry(S, S, N, N);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const toS = (x: number) => sx[0] + (x / S + 0.5) * (sx[1] - sx[0]);
  const toW = (zz: number) => -(wy[0] + (zz / S + 0.5) * (wy[1] - wy[0]));
  for (let i = 0; i < pos.count; i++) {
    const hh = hgt(mag(toS(pos.getX(i)), toW(pos.getZ(i))));
    pos.setY(i, hh);
    col.set(h.cmap(h.CM.viridis, hh / 2.2).map((c: number) => c * (Math.abs(((hh * 5) % 1) - 0.5) > 0.46 ? 0.5 : 1)), 3 * i);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  sc.add(
    h.info(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0, envMapIntensity: 0.3, side: THREE.DoubleSide })), (hit: any) => {
      const s = toS(hit.point.x);
      const w = toW(hit.point.z);
      return { t: "|G(s)|", x: `s = ${s.toFixed(2)} ${w >= 0 ? "+" : "−"} ${Math.abs(w).toFixed(2)}j, |G| = ${mag(s, w).toPrecision(3)} (${(20 * Math.log10(mag(s, w))).toFixed(1)} dB)` };
    }),
  );
  const x0 = ((0 - sx[0]) / (sx[1] - sx[0])) * S - S / 2;
  const pts: any[] = [];
  for (let k = 0; k <= 300; k++) {
    const w = wy[0] + ((wy[1] - wy[0]) * k) / 300;
    pts.push(h.V3(x0, hgt(mag(0, w)) + 0.02, -(k / 300 - 0.5) * S));
  }
  sc.add(h.info(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, 0.025, 6), h.std(0xff4d3d, { emissive: 0xff4d3d, emissiveIntensity: 0.6 })), "תגובת התדר |G(jω)|", "החתך של המשטח לאורך הציר המדומה. זו בדיוק עקומת הגובה של דיאגרמת בודה."));
  const sp = -z * wn;
  const wd = wn * Math.sqrt(Math.max(0, 1 - z * z));
  for (const sg of [1, -1]) {
    const pole = h.glow(0.05, 0xffc857, 1.2);
    pole.position.set(((sp - sx[0]) / (sx[1] - sx[0])) * S - S / 2, 2.25, -((sg * wd - wy[0]) / (wy[1] - wy[0]) - 0.5) * S);
    sc.add(h.info(pole, "קוטב", `s = ${sp.toFixed(2)} ${sg > 0 ? "+" : "−"} ${wd.toFixed(2)}j. כאן |G| → ∞. ככל שהוא קרוב לציר המדומה, השיא בבודה חד יותר.`));
  }
  return {};
};

/* ---------- core lab: planar phased array ---------- */
const array: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -0.06, gridSize: 12, fog: false });
  const N = Math.round(v.params.N ?? 8);
  const d = v.params.d ?? 0.5;
  const R = 2.4;
  const floorDB = -40;
  const pitch = Math.min(0.32, 2.6 / N);
  const AF = (x: number) => {
    const a = Math.PI * d * x;
    const s1 = Math.sin(a);
    return Math.abs(s1) < 1e-7 ? 1 : Math.abs(Math.sin(N * a) / (N * s1));
  };
  const back = new THREE.Mesh(new THREE.BoxGeometry(N * pitch + 0.2, 0.06, N * pitch + 0.2), h.std(0x2a3036, { metalness: 0.5, roughness: 0.5 }));
  back.position.y = -0.03;
  sc.add(h.info(back, "מישור הארקה", "מחזיר את הקרינה קדימה, ולכן יש רק חצי מרחב מול המערך."));
  const els = new THREE.InstancedMesh(new THREE.BoxGeometry(pitch * 0.62, 0.03, pitch * 0.62), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.35, envMapIntensity: 0.5 }), N * N);
  const M = new THREE.Matrix4();
  const C = new THREE.Color();
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      M.makeTranslation((i - (N - 1) / 2) * pitch, 0.015, (j - (N - 1) / 2) * pitch);
      els.setMatrixAt(i * N + j, M);
      els.setColorAt(i * N + j, C.setHSL(0, 0, 0.8));
    }
  let u0 = 0;
  let th0 = 0;
  sc.add(
    h.info(els, (hit: any) => {
      const i = Math.floor(hit.instanceId / N);
      const j = hit.instanceId % N;
      const ph = (((-360 * d * i * u0) % 360) + 360) % 360;
      return { t: `אלמנט (${i + 1}, ${j + 1})`, x: `מופע ${ph.toFixed(0)}° יחסית לאלמנט (1, 1). הפרש מופע קבוע בין שכנים, 360°·d·sinθ₀/λ, הוא מה שמסיט את האלומה. הצבע הוא המופע.` };
    }),
  );
  const geo = new THREE.SphereGeometry(1, h.lite ? 120 : 180, h.lite ? 60 : 90, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = geo.attributes.position;
  const dir = Float32Array.from(pos.array);
  const col = new Float32Array(pos.count * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const gainDB = (dx: number, dy: number, dz: number) => 20 * Math.log10(AF(dx - u0) * AF(dz) * Math.sqrt(Math.max(dy, 0)) + 1e-9);
  sc.add(
    h.info(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0, envMapIntensity: 0.3, side: THREE.DoubleSide })), (hit: any) => {
      const p = hit.point.clone().normalize();
      const g = gainDB(p.x, p.y, p.z);
      return { t: g > -3 ? "אלומה ראשית" : g > -16 ? "אונת צד" : "אונה רחוקה", x: `${g.toFixed(1)} dB יחסית לשיא, ${(Math.asin(Math.max(-1, Math.min(1, p.x))) / D2R).toFixed(0)}° במישור הסריקה. באילוף אחיד אונת הצד הראשונה היא −13.3 dB.${d > 0.5 + 1e-6 ? " עם d > λ/2 ובהיגוי רחב מופיעות אונות סבכה (grating lobes)." : ""}` };
    }),
  );
  const ax = h.arrow(0xffc857, 0.025, 0.07, 0.18);
  sc.add(h.info(ax, "כיוון ההיגוי θ₀", "כאן כל האלמנטים מגיעים באותו מופע, והשדות מתחברים."));
  return {
    update(t) {
      const scanMax = v.params.scan ?? 40;
      th0 = v.params.sweep ? scanMax * Math.sin(t * 0.35) * D2R : scanMax * D2R;
      u0 = Math.sin(th0);
      for (let k = 0; k < pos.count; k++) {
        const dx = dir[3 * k];
        const dy = dir[3 * k + 1];
        const dz = dir[3 * k + 2];
        const g = gainDB(dx, dy, dz);
        const r = R * Math.max(0.004, (g - floorDB) / -floorDB);
        pos.setXYZ(k, dx * r, dy * r + 0.01, dz * r);
        col.set(h.cmap(h.CM.viridis, (g - floorDB) / -floorDB), 3 * k);
      }
      pos.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      geo.computeVertexNormals();
      for (let i = 0; i < N; i++) {
        C.setHSL((((-d * i * u0) % 1) + 1) % 1, 0.75, 0.55);
        for (let j = 0; j < N; j++) els.setColorAt(i * N + j, C);
      }
      els.instanceColor.needsUpdate = true;
      ax.set(h.V3(u0, Math.cos(th0), 0), R + 0.35);
    },
    hud: () => `θ0 = ${(th0 / D2R).toFixed(1).padStart(5)}°\nbeamwidth ≈ ${(0.886 / (N * d * Math.cos(th0)) / D2R).toFixed(1)}°\nD ≈ ${(10 * Math.log10(4 * Math.PI * (N * d) ** 2 * Math.cos(th0))).toFixed(1)} dBi`,
  };
};

/* ---------- core lab: GPS constellation, live DOP ---------- */
const gnss: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { fog: false });
  const RS = 26560 / 6371;
  const inc = 55 * D2R;
  const lat = (v.params.lat ?? 32.08) * D2R;
  const lon = 34.78 * D2R;
  const map = (a: number[]) => h.V3(a[0], a[2], -a[1]);
  const up = map([Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)]);
  const east = map([-Math.sin(lon), Math.cos(lon), 0]);
  const north = map([-Math.sin(lat) * Math.cos(lon), -Math.sin(lat) * Math.sin(lon), Math.cos(lat)]);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), h.std(v.look === "light" ? 0x2a5d96 : 0x113a6e, { roughness: 0.9, metalness: 0, envMapIntensity: 0.15 }));
  sc.add(h.info(earth, "כדור הארץ", "רדיוס 6,371 ק\"מ. קנה המידה של המסלולים אמיתי: הלוויינים במרחק פי 4.2 מהמרכז."));
  const grat: any[] = [];
  const at = (a: number, b: number) => map([Math.cos(a * D2R) * Math.cos(b * D2R), Math.cos(a * D2R) * Math.sin(b * D2R), Math.sin(a * D2R)]).multiplyScalar(1.002);
  for (let la = -60; la <= 60; la += 30) for (let lo = 0; lo < 360; lo += 4) grat.push(at(la, lo), at(la, lo + 4));
  for (let lo = 0; lo < 360; lo += 30) for (let la = -88; la < 88; la += 4) grat.push(at(la, lo), at(la + 4, lo));
  sc.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grat), new THREE.LineBasicMaterial({ color: 0x8cc4ee, transparent: true, opacity: 0.3 })));
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(1.04, 64, 48), new THREE.MeshBasicMaterial({ color: 0x5fb7d6, transparent: true, opacity: 0.1, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })));
  const user = h.glow(0.03, 0xffc857, 1.5);
  user.position.copy(up);
  sc.add(h.info(user, "המשתמש", `קו רוחב ${(lat / D2R).toFixed(1)}°. מסכת ההגבהה קובעת אילו לוויינים נספרים.`));
  const horizon = new THREE.Mesh(new THREE.CircleGeometry(0.55, 64), new THREE.MeshBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }));
  horizon.position.copy(up.clone().multiplyScalar(1.004));
  horizon.quaternion.setFromUnitVectors(h.V3(0, 0, 1), up);
  sc.add(h.info(horizon, "האופק המקומי", "מה שמעל המישור הזה, ועוד זווית המסכה, נראה למקלט."));
  const eci = new THREE.Group();
  sc.add(eci);
  const eciPos = (O: number, u: number, r = RS) => h.V3(r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(inc)), r * Math.sin(u) * Math.sin(inc), -r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(inc)));
  const PCOL = [0xe5484d, 0xf59e0b, 0x30a46c, 0x3e8ef7, 0x8e4ec6, 0xe54d9e];
  const rings = [0, 1, 2, 3, 4, 5].map((p) => {
    const pts: any[] = [];
    for (let k = 0; k <= 180; k++) pts.push(eciPos(p * 60 * D2R, (2 * Math.PI * k) / 180));
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: PCOL[p], transparent: true, opacity: 0.22 }));
    eci.add(l);
    return l;
  });
  const bodyG = new THREE.BoxGeometry(0.07, 0.07, 0.07);
  const panelG = new THREE.BoxGeometry(0.24, 0.004, 0.07);
  const sats: { g: any; p: number; k: number; u0: number; el: number; az: number; vis: boolean }[] = [];
  for (let p = 0; p < 6; p++)
    for (let k = 0; k < 4; k++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(bodyG, h.std(0xd8b45a, { metalness: 0.8, roughness: 0.3, emissive: PCOL[p], emissiveIntensity: 0.35 })));
      for (const s of [-1, 1]) {
        const pn = new THREE.Mesh(panelG, h.std(0x24427a, { metalness: 0.6, roughness: 0.3, emissive: 0x1a3a7a, emissiveIntensity: 0.4 }));
        pn.position.x = s * 0.16;
        g.add(pn);
      }
      const sat = { g, p, k, u0: (k * Math.PI) / 2 + p * 15 * D2R, el: 0, az: 0, vis: false };
      eci.add(h.info(g, () => ({ t: `לוויין GPS, מישור ${"ABCDEF"[p]}, חריץ ${k + 1}`, x: `גובה 20,190 ק"מ, מחזור 11:58 שעות. הגבהה ${sat.el.toFixed(0)}°, אזימוט ${sat.az.toFixed(0)}°, ${sat.vis ? "נראה למקלט" : "לא נראה (מתחת לאופק או למסכה)"}. המסלול שלו מודגש.` })));
      sats.push(sat);
    }
  const losBuf = new Float32Array(24 * 6);
  const losCol = new Float32Array(24 * 6);
  const losG = new THREE.BufferGeometry();
  losG.setAttribute("position", new THREE.BufferAttribute(losBuf, 3));
  losG.setAttribute("color", new THREE.BufferAttribute(losCol, 3));
  sc.add(h.info(new THREE.LineSegments(losG, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 })), "קו ראייה", "מהמשתמש ללוויין נראה. הצבע הוא ההגבהה: צהוב גבוה, סגול נמוך."));
  const wp = h.V3(0, 0, 0);
  const inv4 = (A: number[][]) => {
    const n = 4;
    const m = A.map((r, i) => [...r, ...[0, 1, 2, 3].map((j) => +(i === j))]);
    for (let c = 0; c < n; c++) {
      let piv = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
      [m[c], m[piv]] = [m[piv], m[c]];
      const dd = m[c][c];
      if (Math.abs(dd) < 1e-12) return null;
      for (let j = 0; j < 2 * n; j++) m[c][j] /= dd;
      for (let r = 0; r < n; r++)
        if (r !== c) {
          const f = m[r][c];
          for (let j = 0; j < 2 * n; j++) m[r][j] -= f * m[c][j];
        }
    }
    return m.map((r) => r.slice(n));
  };
  let sel = -1;
  let T = 0;
  let hudText = "";
  return {
    onPick(o) {
      sel = o ? sats.find((s) => s.g === o)?.p ?? -1 : -1;
      rings.forEach((r, p) => (r.material.opacity = sel === -1 ? 0.22 : p === sel ? 1 : 0.08));
    },
    update(_t, dt) {
      T += dt * (v.params.speed ?? 0.2) + (T === 0 ? 0.4 : 0);
      const th = (2 * Math.PI * T) / 23.934;
      eci.rotation.y = -th;
      eci.updateMatrixWorld(true);
      const mask = v.params.mask ?? 5;
      const rows: number[][] = [];
      let n = 0;
      for (const s of sats) {
        s.g.position.copy(eciPos(s.p * 60 * D2R, s.u0 + (2 * Math.PI * T) / 11.967));
        s.g.lookAt(0, 0, 0);
        s.g.updateMatrixWorld(true);
        s.g.getWorldPosition(wp);
        const los = wp.clone().sub(up).normalize();
        const e = los.dot(east);
        const nn = los.dot(north);
        const uu = los.dot(up);
        s.el = Math.asin(uu) / D2R;
        s.az = ((Math.atan2(e, nn) / D2R) + 360) % 360;
        s.vis = s.el > mask;
        if (s.vis) {
          rows.push([-e, -nn, -uu, 1]);
          losBuf.set([up.x, up.y, up.z, wp.x, wp.y, wp.z], 6 * n);
          const c = h.cmap(h.CM.viridis, s.el / 90);
          losCol.set([...c, ...c], 6 * n);
          n++;
        }
      }
      losG.setDrawRange(0, 2 * n);
      losG.attributes.position.needsUpdate = true;
      losG.attributes.color.needsUpdate = true;
      let dop = "DOP: fewer than 4 satellites";
      if (rows.length >= 4) {
        const H = [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => rows.reduce((a, r) => a + r[i] * r[j], 0)));
        const Q = inv4(H);
        if (Q) dop = `GDOP ${Math.sqrt(Q[0][0] + Q[1][1] + Q[2][2] + Q[3][3]).toFixed(2)}  PDOP ${Math.sqrt(Q[0][0] + Q[1][1] + Q[2][2]).toFixed(2)}\nHDOP ${Math.sqrt(Q[0][0] + Q[1][1]).toFixed(2)}  VDOP ${Math.sqrt(Q[2][2]).toFixed(2)}`;
      }
      const hh = Math.floor(T % 24);
      const mm = Math.floor((T * 60) % 60);
      hudText = `t = +${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}  visible ${rows.length}/24\n${dop}`;
    },
    hud: () => hudText,
  };
};

const p = (id: string, label: string, min: number, max: number, value: number, step?: number, unit?: string) => ({ id, label, min, max, value, ...(step ? { step } : {}), ...(unit ? { unit } : {}) });

export const SCENES: SceneDef[] = [
  { id: "wave_interference", title: "התאבכות של שני מקורות גל", modules: "ENG M9.1, M9.13; CORE antennas", about: "two in-phase point sources on a water-like surface; constructive and destructive fringes", params: [p("sep", "מרחק בין המקורות", 0.5, 4, 1.6, 0.1, "λ"), p("phase", "הפרש מופע", 0, 360, 0, 5, "°")], cam: [7, 5.2, 7.5], target: [0, -0.3, 0], caption: "סכום של שני גלים מעגליים, מחושב בכל נקודה. הצבע והגובה הם ההעתק; הרצועות השקטות הן התאבכות הורסת.", build: wave },
  { id: "dipole_field", title: "קווי שדה של שני מטענים", modules: "ENG M9.2, M9.4", about: "field lines from Coulomb's law in 3D and a slice coloured by |E| with equipotentials", params: [p("q2", "המטען השני (ביחס ל-q)", -2, 2, -1, 0.1, "q")], rebuild: true, cam: [5.5, 3.6, 6.2], spin: 0.4, caption: "הקווים מחושבים מחוק קולון. המישור צבוע לפי |E|, והקווים הבהירים עליו הם קווי שווי פוטנציאל.", build: dipole },
  {
    id: "wing_vortex",
    title: "מערבולות קצה בכנף סופית",
    modules: "ENG M15.8, M15.9",
    about: "horseshoe vortex model of a NACA 2412 wing; streamlines from Biot-Savart, coloured by speed; tip vortex roll-up and downwash",
    params: [p("alpha", "זווית התקפה", 0, 12, 6, 0.5, "°")],
    rebuild: true,
    cam: [6.5, 3.6, 8.5],
    target: [2, 0, 0],
    caption: "מודל פרסת המערבולות. קווי הזרם מחושבים מחוק ביו-סבר, והצבע הוא המהירות. ההסטה כלפי מטה מאחורי הכנף היא המקור לגרר המושרה.",
    tour: [
      { cam: [6.5, 3.6, 8.5], target: [2, 0, 0], text: "מבט כללי: כל קו הוא קו זרם, והצבע הוא המהירות." },
      { cam: [9.5, 0.4, 4.2], target: [3, 0, 2.6], text: "מאחורי הקצה, נגד הזרם: האוויר עוקף את הקצה מלמטה למעלה ומתגלגל סביב המערבולת הנגררת." },
      { cam: [3.5, 10, 0.01], target: [3, 0, 0], text: "מלמעלה: בין שתי המערבולות כל הזרם נדחף כלפי מטה. זו ההסטה כלפי מטה." },
      { cam: [2.5, 0.3, 11], target: [2.5, 0, 0], text: "מהצד: הקווים יורדים אחרי הכנף. α_i ≈ C_L/(π e AR), ולכן C_Di = C_L α_i." },
    ],
    build: wing,
  },
  { id: "gradient_descent", title: "ירידה בגרדיאנט, עם תנע ובלי", modules: "ENG M8.21, M8.22, M17.4", about: "a loss surface with two minima; plain gradient descent stops in the near local minimum, momentum carries over the ridge", params: [p("lr", "קצב למידה η", 0.01, 0.1, 0.035, 0.005), p("beta", "תנע β", 0, 0.98, 0.9, 0.01)], rebuild: true, cam: [6.5, 5.2, 6.5], target: [0, -0.4, 0], spin: 0.3, caption: "שני מסלולים מאותה נקודת התחלה: לבן בלי תנע, כתום עם תנע. הקווים הכהים על המשטח הם קווי גובה.", build: descent },
  { id: "crystal_lattice", title: "סריגי גביש", modules: "ENG M24.8, M24.13, M25.1; M16.10", about: "diamond (Si), FCC, BCC and simple cubic lattices; nearest neighbours and the unit cell", params: [{ ...p("lattice", "סריג", 0, 3, 0, 1), options: LATTICES }], rebuild: true, cam: [5, 3.4, 5.6], spin: 0.6, caption: "שני תאי יחידה בכל כיוון. האטום הכתום מסומן עם השכנים הקרובים שלו; המסגרת הצהובה היא תא היחידה.", build: crystal },
  { id: "cantilever_beam", title: "קורה זיזית בכפיפה", modules: "ENG M16.4, M16.6", about: "I-beam cantilever with a tip load; Euler-Bernoulli deflection, plane sections, bending stress colour (tension red, compression blue)", params: [p("load", "עומס (חלק מהמרבי)", 0, 1, 0.7, 0.05), { ...p("animate", "עומס משתנה", 0, 1, 1, 1), options: ["קבוע", "משתנה"] }], cam: [7.2, 2.2, 6.2], target: [2.8, -0.5, 0], caption: "השקיעה לפי אוילר-ברנולי, והחתכים נשארים מישוריים. הצבע הוא מאמץ הכפיפה: מתיחה באדום ולחיצה בכחול.", build: beam },
  { id: "heat_plate", title: "הולכת חום בלוח, בהפרשים סופיים", modules: "ENG M10.6, M14.5", about: "2D explicit finite differences of the heat equation, three sources, cooled edges; the diffusion number r = αΔt/Δx² and the stability limit 1/4", params: [p("r", "מספר הדיפוזיה r", 0.05, 0.3, 0.22, 0.01), p("power", "הספק המקורות", 0.2, 2, 1, 0.1)], cam: [5.4, 4.6, 6.2], target: [0, 0.3, 0], caption: "הגובה והצבע הם הטמפרטורה, והקווים הם איזותרמות. המקור הימני נדלק ונכבה. העלה את r מעל 1/4 כדי לראות את השיטה המפורשת מתפוצצת.", build: heat },
  { id: "induction_motor", title: "השדה המסתובב במנוע השראה", modules: "ENG M12.3, M12.6", about: "three phase coils 120° apart; each phase field pulses, their sum rotates at constant magnitude; the rotor lags by the slip", params: [p("w", "תדר השדה ω_s", 0.3, 3, 1.4, 0.1, "rad/s"), p("slip", "החלקה s", 0, 0.5, 0.1, 0.01)], cam: [2.4, 1.9, 6.4], target: [0, 0, 0.4], caption: "כל פאזה יוצרת שדה פועם לאורך ציר קבוע (החצים הצבעוניים). הסכום (החץ הזהוב) קבוע בגודלו ומסתובב, והרוטור מפגר אחריו בהחלקה.", build: motor },
  { id: "rigid_body", title: "גוף קשיח חופשי: הציר האמצעי", modules: "ENG M2.5; CORE M13.13 (ADCS)", about: "torque-free Euler equations integrated with RK4; spin about the intermediate axis flips (Dzhanibekov); |L| and E are conserved", params: [{ ...p("axis", "ציר הסיבוב", 0, 2, 1, 1), options: ["הציר הקטן (I₁)", "האמצעי (I₂)", "הגדול (I₃)"] }, p("w0", "מהירות זוויתית", 1, 4, 2.6, 0.1, "rad/s")], rebuild: true, cam: [5.6, 3.0, 6.6], target: [0, 0.3, 0], caption: "משוואות אוילר לגוף קשיח, באינטגרציה של RK4. סיבוב סביב הציר האמצעי לא יציב והגוף מתהפך; סביב שני האחרים הוא יציב. המספרים בפינה מוודאים שהתנע והאנרגיה נשמרים.", build: rigid },
  { id: "robot_arm", title: "זרוע בשלושה מפרקים: קינמטיקה ישירה", modules: "ENG M19.2, M19.3, M19.4", about: "a 3R planar arm on a yaw base; joint sliders move it; the end-effector frame and its position p from forward kinematics", params: [p("yaw", "סבסוב", -180, 180, 30, 1, "°"), p("th1", "θ₁", -150, 150, 35, 1, "°"), p("th2", "θ₂", -150, 150, -20, 1, "°"), p("th3", "θ₃", -150, 150, 70, 1, "°")], cam: [6.6, 4.8, 7.6], target: [0, 1.8, 0], tone: "none", caption: "הזז את המפרקים. מערכת הצירים בקצה ומיקומה p הם הקינמטיקה הישירה T_sb(θ); המסלול הצהוב הוא הדרך שהקצה עבר.", build: arm },
  { id: "s_plane", title: "|G(s)| מעל מישור s", modules: "ENG M4.9, M5.7, M5.8", about: "magnitude of a second-order transfer function over the complex plane; poles as peaks; the jω-axis slice is the Bode magnitude", params: [p("zeta", "ריסון ζ", 0.05, 1.2, 0.25, 0.01), p("wn", "תדר טבעי ω_n", 0.5, 2, 1.2, 0.05)], rebuild: true, cam: [4.2, 3.6, 4.4], target: [0, 0.5, 0], spin: 0.5, caption: "המשטח הוא log|G(s)|. הקטבים הם הפסגות, והחתך האדום לאורך הציר המדומה הוא בדיוק דיאגרמת בודה.", build: splane },
  { id: "phased_array", title: "מערך מופע ודיאגרמת הקרינה", modules: "CORE M1.1, M1.2, M2.23; ENG M9.13, M23.x", about: "N×N planar array, element spacing d, uniform taper; 3D pattern in dB from the array factor; steering by a linear phase gradient; grating lobes for d > λ/2", params: [p("N", "אלמנטים בכל שורה", 2, 16, 8, 1), p("d", "מרווח d", 0.25, 1, 0.5, 0.05, "λ"), p("scan", "זווית היגוי", 0, 60, 40, 1, "°"), { ...p("sweep", "סריקה", 0, 1, 1, 1), options: ["קבוע", "סורק"] }], rebuild: true, cam: [4.6, 3.4, 4.8], target: [0, 1, 0], caption: "גובה המשטח הוא ההגבר בכל כיוון, עד −40 dB. צבע האלמנטים הוא המופע שלהם; ההפרש הקבוע ביניהם מסיט את האלומה.", build: array },
  { id: "gnss_geometry", title: "גאומטריית GPS מעל המשתמש", modules: "CORE M5.1, M5.6; ENG M2.x orbits", about: "24 GPS satellites in six 55° planes at true scale over a user; lines of sight above the elevation mask; GDOP/PDOP/HDOP/VDOP computed live from the geometry", params: [p("mask", "מסכת הגבהה", 0, 30, 5, 1, "°"), p("lat", "קו רוחב המשתמש", -80, 80, 32.1, 0.5, "°"), p("speed", "מהירות הזמן", 0, 1, 0.2, 0.05, "h/s")], rebuild: false, cam: [8.3, 5.8, -2.3], target: [1.1, 0.85, -0.77], caption: "לחץ על לוויין כדי להדגיש את המסלול שלו. ה-DOP בפינה מחושב בכל רגע מהגאומטריה: (GᵀG)⁻¹.", build: gnss },
];
export const SCENE_BY_ID: Record<string, SceneDef> = Object.fromEntries(SCENES.map((s) => [s.id, s]));

/** The catalog for the tutor's instructions. */
export function sceneCatalog(filter?: (s: SceneDef) => boolean) {
  return SCENES.filter(filter ?? (() => true))
    .map((s) => `- ${s.id} — ${s.title} (${s.modules}): ${s.about}. params: ${s.params.map((x) => `${x.id} [${x.min}..${x.max}, default ${x.value}${x.unit ? " " + x.unit : ""}]${x.options ? ` (${x.options.map((o, i) => `${i}=${o}`).join(", ")})` : ""}`).join("; ") || "none"}${s.tour ? "; has a built-in tour" : ""}`)
    .join("\n");
}
