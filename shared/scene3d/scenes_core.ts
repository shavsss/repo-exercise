// Scenes for the core (defense) lab: radar coverage over terrain, a proportional-navigation
// intercept, an artillery trajectory with drag, satellite coverage, the RCS of a plate and
// the infrared signature of an aircraft. Each is computed from the model of its module.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Builder } from "./engine";

const D2R = Math.PI / 180;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/* ---------- radar horizon and terrain masking ---------- */
// 80 km × 80 km around a radar; 1 unit = 8 km across, heights ×10. The Earth bulge uses the
// effective radius kR (k = 4/3 for the standard atmosphere): a point at range d sits
// d²/(2kR) below the radar's horizontal plane.
const HILLS = [
  [14, 6, 0.55, 5],
  [-10, 18, 0.7, 7],
  [22, -16, 0.45, 6],
  [-24, -12, 0.6, 8],
  [6, -26, 0.35, 5],
  [-30, 10, 0.5, 6],
  [30, 26, 0.6, 9],
  [-6, 30, 0.4, 5],
];
function terrainKm(x: number, y: number) {
  let h = 0.04 + 0.025 * Math.sin(x * 0.21 + 1) * Math.cos(y * 0.17);
  for (const [cx, cy, a, s] of HILLS) h += a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));
  // a ridge across the north-east
  h += 0.32 * Math.exp(-(((x + y) * 0.7071 - 20) ** 2) / 18);
  return h;
}
export const radarHorizon: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { fog: false });
  const HR = (v.params.hr ?? 20) / 1000;
  const HT = (v.params.ht ?? 100) / 1000;
  const kR = (v.params.k ? 4 / 3 : 1) * 6371;
  const S = 8; // km per unit
  const Z = 10; // vertical exaggeration
  const N = h.lite ? 90 : 140;
  const half = 40;
  const drop = (d: number) => (d * d) / (2 * kR);
  const H = new Float32Array((N + 1) * (N + 1));
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) H[j * (N + 1) + i] = terrainKm(-half + (2 * half * i) / N, -half + (2 * half * j) / N);
  const hAt = (x: number, y: number) => {
    const fi = ((x + half) / (2 * half)) * N;
    const fj = ((y + half) / (2 * half)) * N;
    const i = clamp(Math.floor(fi), 0, N - 1);
    const j = clamp(Math.floor(fj), 0, N - 1);
    const a = fi - i;
    const b = fj - j;
    const g = (ii: number, jj: number) => H[jj * (N + 1) + ii];
    return (g(i, j) * (1 - a) + g(i + 1, j) * a) * (1 - b) + (g(i, j + 1) * (1 - a) + g(i + 1, j + 1) * a) * b;
  };
  const r0 = hAt(0, 0) + HR;
  // visible: the straight ray from the antenna to a target HT above the ground clears every
  // terrain point between, all heights taken relative to the curved Earth
  const visible = (x: number, y: number) => {
    const d = Math.hypot(x, y);
    if (d < 0.5) return true;
    const ht = hAt(x, y) + HT - drop(d);
    const n = Math.ceil(d / 0.6);
    for (let k = 1; k < n; k++) {
      const f = k / n;
      const ray = r0 + (ht - r0) * f;
      if (hAt(x * f, y * f) - drop(d * f) > ray) return false;
    }
    return true;
  };
  const geo = new THREE.PlaneGeometry(2 * half / S, 2 * half / S, N, N);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const land = [[0.05, 0.1, 0.05], [0.12, 0.2, 0.08], [0.28, 0.24, 0.12], [0.5, 0.46, 0.4]];
  let seen = 0;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k) * S;
    const y = -pos.getZ(k) * S;
    const hh = hAt(x, y);
    const d = Math.hypot(x, y);
    pos.setY(k, ((hh - drop(d)) * Z) / S);
    const c = h.cmap(land, hh / 0.9);
    const vis = d <= half && visible(x, y);
    if (vis) seen++;
    const t = vis ? [0.05, 0.55, 0.75] : [0.5, 0.06, 0.06];
    const w = vis ? 0.5 : 0.55;
    col.set([c[0] * (1 - w) + t[0] * w, c[1] * (1 - w) + t[1] * w, c[2] * (1 - w) + t[2] * w], 3 * k);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, envMapIntensity: 0.2 }));
  sc.add(
    h.info(ground, (hit: any) => {
      const x = hit.point.x * S;
      const y = -hit.point.z * S;
      const vis = visible(x, y);
      return { t: vis ? "מכוסה" : "מוסתר", x: `טווח ${Math.hypot(x, y).toFixed(1)} ק"מ, גובה הקרקע ${(hAt(x, y) * 1000).toFixed(0)} מ'. מטרה ${(HT * 1000).toFixed(0)} מ' מעל הקרקע כאן ${vis ? "נראית למכ\"ם" : "מוסתרת: קו הראייה נחסם בשטח או בעקמומיות כדור הארץ"}.` };
    }),
  );
  // radar horizon over smooth Earth, as a ring
  const dH = Math.sqrt(2 * kR * HR) + Math.sqrt(2 * kR * HT);
  if (dH < half * 1.4) {
    const pts: any[] = [];
    for (let k = 0; k <= 128; k++) {
      const a = (2 * Math.PI * k) / 128;
      const x = dH * Math.cos(a);
      const y = dH * Math.sin(a);
      const inside = Math.abs(x) <= half && Math.abs(y) <= half;
      pts.push(h.V3(x / S, inside ? ((hAt(x, y) - drop(dH)) * Z) / S + 0.03 : (-drop(dH) * Z) / S, -y / S));
    }
    sc.add(h.info(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0xffc857, dashSize: 0.12, gapSize: 0.08 })).computeLineDistances(), "אופק המכ\"ם (כדור חלק)", `d = √(2kR·h_r) + √(2kR·h_t) = ${dH.toFixed(1)} ק"מ. מעבר לו גם שטח שטוח לא יעזור; לפניו, השטח קובע.`));
  }
  // the radar: mast and a rotating fan
  const mastH = Math.max(0.12, (HR * Z) / S);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, mastH, 12), h.std(0xffc857, { emissive: 0xffc857, emissiveIntensity: 0.5 }));
  mast.position.set(0, (hAt(0, 0) * Z) / S + mastH / 2, 0);
  sc.add(h.info(mast, "המכ\"ם", `אנטנה בגובה ${(HR * 1000).toFixed(0)} מ' מעל הקרקע (התורן מוגדל לתצוגה).`));
  const top = (r0 * Z) / S;
  const fan = new THREE.Mesh(new THREE.CircleGeometry(dH / S, 48, -0.06, 0.12), new THREE.MeshBasicMaterial({ color: 0x5fd0e6, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
  fan.rotation.x = -Math.PI / 2;
  const fanG = new THREE.Group();
  fanG.position.y = top + 0.01;
  fanG.add(fan);
  sc.add(fanG);
  // a target flying a circle
  const tgt = h.glow(0.07, 0x30a46c, 0.7);
  sc.add(h.info(tgt, () => ({ t: "מטרה", x: `${(HT * 1000).toFixed(0)} מ' מעל הקרקע. ירוקה כשהמכ"ם רואה אותה, אדומה כשהיא מוסתרת.` })));
  const losG = new THREE.BufferGeometry().setFromPoints([h.V3(0, top, 0), h.V3(0, top, 0)]);
  const los = new THREE.Line(losG, new THREE.LineBasicMaterial({ color: 0x30a46c, transparent: true, opacity: 0.8 }));
  sc.add(los);
  let tVis = true;
  return {
    update(t) {
      fanG.rotation.y = -t * 1.2;
      const a = t * 0.12;
      const R = 26 + 8 * Math.sin(t * 0.07);
      const x = R * Math.cos(a);
      const y = R * Math.sin(a) * 0.9;
      const hh = hAt(x, y) + HT - drop(Math.hypot(x, y));
      tgt.position.set(x / S, (hh * Z) / S, -y / S);
      tVis = visible(x, y);
      const c = tVis ? 0x30a46c : 0xe5484d;
      tgt.material.color.setHex(c);
      tgt.material.emissive.setHex(c);
      los.material.color.setHex(c);
      los.material.opacity = tVis ? 0.85 : 0.25;
      losG.attributes.position.setXYZ(1, tgt.position.x, tgt.position.y, tgt.position.z);
      losG.attributes.position.needsUpdate = true;
    },
    hud: () => `radar horizon (smooth) ${dH.toFixed(1)} km\n= 4.12(√h_r + √h_t) for k = 4/3\narea covered ${((100 * seen) / pos.count).toFixed(0)}%   target ${tVis ? "SEEN" : "MASKED"}`,
  };
};

/* ---------- 3D proportional navigation ---------- */
// Pure 3D PN: a = N·Vc·(ω × û), ω = (R × V)/|R|², limited to the missile's g and kept
// normal to its velocity, flown through a first-order autopilot lag τ. 1 unit = 1 km.
export const pnEngagement: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: 0, gridSize: 20, fog: false });
  const N = v.params.N ?? 4;
  const tg = (v.params.tg ?? 5) * 9.81;
  const man = Math.round(v.params.man ?? 2);
  const amax = (v.params.amax ?? 30) * 9.81;
  const tau = v.params.tau ?? 0.3;
  const V = (x = 0, y = 0, z = 0) => h.V3(x, y, z);
  const pm = V(-5000, 50, 2500);
  const vm = V(250, 950, -150);
  const pt = V(4000, 4500, -3500);
  const vt = V(-150, 0, 260);
  const dt = 0.01;
  const act = V();
  const tr: { t: number; pm: any; pt: any; a: number; r: number; vc: number }[] = [];
  let miss = Infinity;
  let tEnd = 0;
  let aPeak = 0;
  for (let k = 0; k < 8000; k++) {
    const t = k * dt;
    const R = pt.clone().sub(pm);
    const Vr = vt.clone().sub(vm);
    const r = R.length();
    const vc = -R.dot(Vr) / r;
    const w = R.clone().cross(Vr).divideScalar(r * r);
    const u = R.clone().divideScalar(r);
    const a = w.clone().cross(u).multiplyScalar(N * vc);
    if (a.length() > amax) a.setLength(amax);
    // the airframe follows the command through a first-order lag τ
    act.add(a.sub(act).multiplyScalar(dt / tau));
    const vh = vm.clone().normalize();
    act.sub(vh.clone().multiplyScalar(act.dot(vh)));
    a.copy(act);
    aPeak = Math.max(aPeak, a.length());
    if (k % 4 === 0) tr.push({ t, pm: pm.clone(), pt: pt.clone(), a: a.length() / 9.81, r, vc });
    // closest approach inside this step, with the relative motion taken as straight
    const tc = clamp(-R.dot(Vr) / Vr.lengthSq(), 0, dt);
    if (tc < dt) {
      miss = R.clone().add(Vr.clone().multiplyScalar(tc)).length();
      tEnd = t;
      tr.push({ t, pm: pm.clone(), pt: pt.clone(), a: a.length() / 9.81, r, vc });
      break;
    }
    // target maneuver: none, a steady turn, or a weave, normal to its velocity
    if (man > 0) {
      const side = vt.clone().cross(V(0, 1, 0)).normalize();
      const s = man === 1 ? 1 : Math.sign(Math.sin(t * 0.9)) || 1;
      vt.add(side.multiplyScalar(tg * s * dt));
      vt.setLength(300);
    }
    vm.add(a.multiplyScalar(dt));
    vm.setLength(1000);
    pm.add(vm.clone().multiplyScalar(dt));
    pt.add(vt.clone().multiplyScalar(dt));
    tEnd = t;
  }
  const km = (p: any) => h.V3(p.x / 1000, p.y / 1000, p.z / 1000);
  sc.add(
    h.info(h.colorTube(tr.map((s) => km(s.pm)), tr.map((s) => s.a), 0, amax / 9.81, 0.035, h.CM.inferno, 0.3), (hit: any) => {
      const near = tr.reduce((b, s) => (km(s.pm).distanceTo(hit.point) < km(b.pm).distanceTo(hit.point) ? s : b), tr[0]);
      return { t: "מסלול המיירט", x: `t = ${near.t.toFixed(1)} שנ', תאוצה ${near.a.toFixed(1)}g (הצבע). טווח ${(near.r / 1000).toFixed(2)} ק"מ, מהירות סגירה ${near.vc.toFixed(0)} מ'/שנ'.` };
    }),
  );
  sc.add(h.info(h.colorTube(tr.map((s) => km(s.pt)), tr.map(() => 0.2), 0, 1, 0.025, [[0.25, 0.6, 0.95], [0.25, 0.6, 0.95]], 0.3), "מסלול המטרה", ["בלי תמרון", "פנייה קבועה", "תמרון זיגזג"][man] + `, ${(tg / 9.81).toFixed(0)}g.`));
  // lines of sight every second: in PN they stay nearly parallel (constant bearing)
  const seg: any[] = [];
  const step = Math.max(1, Math.round(1 / (4 * dt)));
  for (let i = 0; i < tr.length; i += step) seg.push(km(tr[i].pm), km(tr[i].pt));
  sc.add(h.info(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), new THREE.LineBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.35 })), "קווי ראייה, כל שנייה", "ב-PN הם נשארים כמעט מקבילים: כיוון קו הראייה קבוע, וזה תנאי מסלול התנגשות."));
  // drop lines to the floor for depth
  const drops: any[] = [];
  for (let i = 0; i < tr.length; i += step * 2) for (const p of [tr[i].pm, tr[i].pt]) drops.push(km(p), km({ x: p.x, y: 0, z: p.z }));
  sc.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(drops), new THREE.LineBasicMaterial({ color: 0x8a959c, transparent: true, opacity: 0.25 })));
  const m = h.glow(0.07, 0xff8a5b, 1.6);
  const tt = h.glow(0.07, 0x3e8ef7, 1.6);
  sc.add(h.info(m, "המיירט", `1000 מ'/שנ', N = ${N}, מגבלת תאוצה ${(amax / 9.81).toFixed(0)}g, קבוע זמן של הטייס האוטומטי ${tau} שנ'. בלי השהיה PN רציף פוגע כמעט תמיד; ההשהיה והמגבלה הן שיוצרות מרחק החטאה.`), h.info(tt, "המטרה", "300 מ'/שנ'."));
  const lg = new THREE.BufferGeometry().setFromPoints([V(), V()]);
  sc.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xffc857 })));
  let cur = tr[0];
  const dur = tEnd + 2;
  return {
    update(t) {
      const tt0 = (t * 0.6) % dur;
      cur = tr.find((s) => s.t >= tt0) ?? tr[tr.length - 1];
      m.position.copy(km(cur.pm));
      tt.position.copy(km(cur.pt));
      lg.attributes.position.setXYZ(0, m.position.x, m.position.y, m.position.z);
      lg.attributes.position.setXYZ(1, tt.position.x, tt.position.y, tt.position.z);
      lg.attributes.position.needsUpdate = true;
    },
    hud: () => `t ${cur.t.toFixed(1)} s   R ${(cur.r / 1000).toFixed(2)} km   Vc ${cur.vc.toFixed(0)} m/s\na_m ${cur.a.toFixed(1)} g   peak ${(aPeak / 9.81).toFixed(1)} g\nmiss distance ${miss < 10 ? miss.toFixed(1) : miss.toFixed(0)} m   t_go total ${tEnd.toFixed(1)} s`,
  };
};

/* ---------- artillery trajectory with drag and wind ---------- */
// Point mass, drag decel ρ(h)·v²·C_D(M)/(2·m/A), exponential atmosphere, crosswind.
// The vacuum parabola beside it. 155 mm: m/A ≈ 2275 kg/m².
const CD = [[0, 0.12], [0.8, 0.12], [0.95, 0.2], [1.05, 0.38], [1.2, 0.4], [1.5, 0.36], [2, 0.3], [3, 0.25], [5, 0.22]];
const cdOf = (M: number) => {
  for (let i = 1; i < CD.length; i++) if (M <= CD[i][0]) return CD[i - 1][1] + ((CD[i][1] - CD[i - 1][1]) * (M - CD[i - 1][0])) / (CD[i][0] - CD[i - 1][0]);
  return CD[CD.length - 1][1];
};
export const ballistic: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { fog: false });
  const v0 = v.params.v0 ?? 827;
  const el = (v.params.el ?? 45) * D2R;
  const mA = v.params.mA ?? 2275;
  const wind = v.params.wind ?? 10;
  const g = 9.81;
  type S = { t: number; x: number; y: number; z: number; M: number; v: number };
  const run = (drag: boolean) => {
    const p = [0, 0, 0];
    const u = [v0 * Math.cos(el), v0 * Math.sin(el), 0];
    const out: S[] = [];
    const dt = 0.05;
    for (let k = 0; k < 40000; k++) {
      const t = k * dt;
      const sp = Math.hypot(u[0], u[1], u[2]);
      const a = Math.max(295, 340 - 0.004 * p[1]);
      if (k % 10 === 0) out.push({ t, x: p[0], y: p[1], z: p[2], M: sp / a, v: sp });
      if (p[1] < 0 && k > 0) {
        out.push({ t, x: p[0], y: 0, z: p[2], M: sp / a, v: sp });
        break;
      }
      let ax = 0;
      let ay = -g;
      let az = 0;
      if (drag) {
        const rx = u[0];
        const ry = u[1];
        const rz = u[2] - wind;
        const vr = Math.hypot(rx, ry, rz);
        const k2 = (1.225 * Math.exp(-p[1] / 8500) * vr * cdOf(vr / a)) / (2 * mA);
        ax -= k2 * rx;
        ay -= k2 * ry;
        az -= k2 * rz;
      }
      u[0] += ax * dt;
      u[1] += ay * dt;
      u[2] += az * dt;
      p[0] += u[0] * dt;
      p[1] += u[1] * dt;
      p[2] += u[2] * dt;
    }
    return out;
  };
  const dr = run(true);
  const vac = run(false);
  const last = (s: S[]) => s[s.length - 1];
  const R = Math.max(last(vac).x, last(dr).x);
  const sc0 = 10 / R; // the longer trajectory spans 10 units
  const P = (s: { x: number; y: number; z: number }) => h.V3(s.x * sc0 - 5, s.y * sc0, -s.z * sc0);
  // ground with 5 km ticks
  const L = v.look === "dark" ? { g: 0x1d2a24, t: 0x8a959c } : { g: 0xc9d6c6, t: 0x5b6670 };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(13, 4), h.std(L.g, { roughness: 1, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0.5, -0.003, 0);
  sc.add(ground);
  const ticks: any[] = [];
  const stepKm = R > 60000 ? 10 : 5;
  for (let x = 0; x <= R * 1.15; x += stepKm * 1000) ticks.push(P({ x, y: 0, z: 0 }).add(h.V3(0, 0, 0.12)), P({ x, y: 0, z: 0 }).add(h.V3(0, 0, -0.12)));
  sc.add(h.info(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks), new THREE.LineBasicMaterial({ color: L.t })), "סרגל טווח", `שנתות כל ${stepKm} ק"מ.`));
  const tube = h.colorTube(dr.map(P), dr.map((s) => s.M), 0.5, 2.6, 0.04, h.CM.inferno, 0.35);
  sc.add(
    h.info(tube, (hit: any) => {
      const near = dr.reduce((b, s) => (P(s).distanceTo(hit.point) < P(b).distanceTo(hit.point) ? s : b), dr[0]);
      return { t: "המסלול עם גרר", x: `t = ${near.t.toFixed(1)} שנ', גובה ${(near.y / 1000).toFixed(1)} ק"מ, מהירות ${near.v.toFixed(0)} מ'/שנ' (מאך ${near.M.toFixed(2)}, הצבע). C_D = ${cdOf(near.M).toFixed(2)}: השיא שלו סביב מאך 1.` };
    }),
  );
  const vline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vac.map(P)), new THREE.LineDashedMaterial({ color: v.look === "dark" ? 0xcfe0f0 : 0x26313a, dashSize: 0.1, gapSize: 0.07 }));
  vline.computeLineDistances();
  sc.add(h.info(vline, "הפרבולה בוואקום", `טווח v₀²·sin2θ/g = ${(last(vac).x / 1000).toFixed(1)} ק"מ, בלי אוויר.`));
  const apex = dr.reduce((b, s) => (s.y > b.y ? s : b), dr[0]);
  const mk = (s: S, c: number, t: string, x: string) => {
    const o = h.glow(0.06, c, 1.2);
    o.position.copy(P(s));
    sc.add(h.info(o, t, x));
  };
  mk(apex, 0xffc857, "שיא המסלול", `${(apex.y / 1000).toFixed(1)} ק"מ אחרי ${apex.t.toFixed(0)} שנ'. עם גרר הירידה תלולה מהעלייה: המסלול לא סימטרי.`);
  const imp = last(dr);
  mk(imp, 0xe5484d, "פגיעה", `${(imp.x / 1000).toFixed(1)} ק"מ, סטייה צידית ${imp.z.toFixed(0)} מ' מהרוח, מהירות פגיעה ${imp.v.toFixed(0)} מ'/שנ'.`);
  const shell = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.14, 16), h.std(0xc9b26a, { metalness: 0.7, roughness: 0.3 }));
  sc.add(shell);
  const up = h.V3(0, 1, 0);
  const dur = imp.t + 3;
  let cur = dr[0];
  return {
    update(t) {
      const tt = (t * Math.max(4, imp.t / 8)) % dur;
      const i = dr.findIndex((s) => s.t >= tt);
      cur = dr[i < 0 ? dr.length - 1 : i];
      const nx = dr[Math.min(dr.length - 1, (i < 0 ? dr.length - 1 : i) + 1)];
      shell.position.copy(P(cur));
      const d = P(nx).sub(P(cur));
      if (d.lengthSq() > 1e-10) shell.quaternion.setFromUnitVectors(up, d.normalize());
    },
    hud: () => `range ${(imp.x / 1000).toFixed(1)} km (vacuum ${(last(vac).x / 1000).toFixed(1)})\napex ${(apex.y / 1000).toFixed(1)} km   flight ${imp.t.toFixed(0)} s   drift ${imp.z.toFixed(0)} m\nnow ${cur.t.toFixed(0)} s  M ${cur.M.toFixed(2)}  impact ${imp.v.toFixed(0)} m/s`,
  };
};

/* ---------- satellite ground coverage ---------- */
// Footprint from the elevation mask ε: sin ρ = R/(R+h), sin η = sin ρ·cos ε, λ = 90° − ε − η.
const ALTS = [400, 700, 1200, 8062, 20200, 35786];
export const ALT_NAMES = ["400 ק\"מ (ISS)", "700 ק\"מ (צילום)", "1,200 ק\"מ", "8,062 ק\"מ (MEO)", "20,200 ק\"מ (GPS)", "35,786 ק\"מ (GEO)"];
export const satCoverage: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { fog: false });
  const Re = 6371;
  const alt = ALTS[Math.round(v.params.alt ?? 1)];
  const inc = (v.params.inc ?? 51.6) * D2R;
  const eps = (v.params.mask ?? 10) * D2R;
  const a = (Re + alt) / Re;
  const rho = Math.asin(1 / a);
  const eta = Math.asin(Math.sin(rho) * Math.cos(eps));
  const lam = Math.PI / 2 - eps - eta;
  const period = 2 * Math.PI * Math.sqrt(((Re + alt) * 1000) ** 3 / 3.986e14);
  const slant = Re * (Math.sin(lam) / Math.sin(eta));
  // keep the whole orbit in view when the altitude changes a lot
  const want = Math.max(4, a * 2.6);
  const now = v.camera.position.distanceTo(v.controls.target);
  if (Math.abs(now - want) / want > 0.35) v.flyTo({ cam: v.camera.position.clone().sub(v.controls.target).setLength(want).toArray(), target: [0, 0, 0] });
  const earthG = new THREE.Group();
  sc.add(earthG);
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), h.std(v.look === "light" ? 0x2a5d96 : 0x113a6e, { roughness: 0.9, metalness: 0, envMapIntensity: 0.15 }));
  earthG.add(h.info(earth, "כדור הארץ", "מסתובב פעם ב-23:56 שעות; מסלול הקרקע זז מערבה בכל הקפה."));
  const map = (la: number, lo: number, r = 1.002) => h.V3(r * Math.cos(la) * Math.cos(lo), r * Math.sin(la), -r * Math.cos(la) * Math.sin(lo));
  const grat: any[] = [];
  for (let la = -60; la <= 60; la += 30) for (let lo = 0; lo < 360; lo += 4) grat.push(map(la * D2R, lo * D2R), map(la * D2R, (lo + 4) * D2R));
  for (let lo = 0; lo < 360; lo += 30) for (let la = -88; la < 88; la += 4) grat.push(map(la * D2R, lo * D2R), map((la + 4) * D2R, lo * D2R));
  earthG.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grat), new THREE.LineBasicMaterial({ color: 0x8cc4ee, transparent: true, opacity: 0.3 })));
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(1.03, 64, 48), new THREE.MeshBasicMaterial({ color: 0x5fb7d6, transparent: true, opacity: 0.1, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })));
  // orbit (inertial)
  const orb = (u: number) => h.V3(a * Math.cos(u), a * Math.sin(u) * Math.sin(inc), -a * Math.sin(u) * Math.cos(inc));
  const op: any[] = [];
  for (let k = 0; k <= 200; k++) op.push(orb((2 * Math.PI * k) / 200));
  sc.add(h.info(new THREE.Line(new THREE.BufferGeometry().setFromPoints(op), new THREE.LineBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.6 })), "המסלול", `גובה ${alt.toLocaleString()} ק"מ, נטייה ${(inc / D2R).toFixed(1)}°, מחזור ${(period / 60).toFixed(0)} דקות.`));
  const sat = new THREE.Group();
  sat.add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), h.std(0xd8b45a, { metalness: 0.8, roughness: 0.3 })));
  const pn = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.004, 0.06), h.std(0x24427a, { metalness: 0.6, emissive: 0x1a3a7a, emissiveIntensity: 0.4 }));
  sat.add(pn);
  sc.add(h.info(sat, "הלוויין", `זווית חצי-אלומה לאופק, η = ${(eta / D2R).toFixed(1)}°: מעבר לה הוא רואה רק נקודות מתחת למסכה.`));
  // footprint: a cap of half-angle λ around the sub-satellite point, and the cone to it
  const cap = new THREE.Mesh(new THREE.SphereGeometry(1.006, 64, 16, 0, Math.PI * 2, 0, lam), new THREE.MeshBasicMaterial({ color: 0x5fd0e6, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }));
  sc.add(h.info(cap, "טביעת הרגל", `חצי זווית מרכזית λ = ${(lam / D2R).toFixed(1)}°, רדיוס ${(Re * lam).toFixed(0)} ק"מ על הקרקע, ${(50 * (1 - Math.cos(lam))).toFixed(1)}% משטח כדור הארץ. כל נקודה בתוכה רואה את הלוויין מעל ${(eps / D2R).toFixed(0)}°.`));
  const cone = new THREE.Mesh(new THREE.ConeGeometry(Math.sin(lam), a - Math.cos(lam), 48, 1, true), new THREE.MeshBasicMaterial({ color: 0x5fd0e6, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }));
  sc.add(cone);
  const trackN = 600;
  const trackBuf = new Float32Array(trackN * 3);
  const trackG = new THREE.BufferGeometry();
  trackG.setAttribute("position", new THREE.BufferAttribute(trackBuf, 3));
  earthG.add(h.info(new THREE.Line(trackG, new THREE.LineBasicMaterial({ color: 0xff8a5b })), "מסלול הקרקע", "הנקודה שמתחת ללוויין, על כדור ארץ מסתובב. ההזזה מערבה בכל הקפה היא סיבוב כדור הארץ בזמן מחזור אחד."));
  const yAx = h.V3(0, 1, 0);
  const wE = (2 * Math.PI) / 86164;
  let n = 0;
  let T = 0;
  let last = -1;
  return {
    update(_t, dt) {
      T += dt * (period / 14); // one orbit ≈ 14 s
      const u = (2 * Math.PI * T) / period;
      const p = orb(u);
      sat.position.copy(p);
      sat.lookAt(0, 0, 0);
      const dir = p.clone().normalize();
      cap.quaternion.setFromUnitVectors(yAx, dir);
      cone.quaternion.setFromUnitVectors(yAx, dir);
      cone.position.copy(dir.clone().multiplyScalar((a + Math.cos(lam)) / 2));
      earthG.rotation.y = wE * T;
      // sub-satellite point in the Earth's frame
      const q = dir.clone().applyAxisAngle(yAx, -wE * T).multiplyScalar(1.004);
      if (T - last > period / 200) {
        last = T;
        if (n < trackN) n++;
        else trackBuf.copyWithin(0, 3);
        trackBuf.set([q.x, q.y, q.z], 3 * (n - 1));
        trackG.setDrawRange(0, n);
        trackG.attributes.position.needsUpdate = true;
        trackG.computeBoundingSphere();
      }
    },
    hud: () => `h ${alt.toLocaleString()} km   P ${(period / 60).toFixed(0)} min\nλ ${(lam / D2R).toFixed(1)}°  footprint r ${(Re * lam).toFixed(0)} km  ${(50 * (1 - Math.cos(lam))).toFixed(1)}% of Earth\nmax slant range ${slant.toFixed(0)} km`,
  };
};

/* ---------- RCS of a flat plate ---------- */
// Physical optics, monostatic: σ = 4π(ab)²/λ² · cos²θ · sinc²(k a u) · sinc²(k b v),
// u = sinθ cosφ, v = sinθ sinφ in the plate's frame.
const BANDS = [
  ["S", 0.1],
  ["X", 0.03],
  ["Ku", 0.02],
] as const;
export const BAND_NAMES = ["S (10 ס\"מ)", "X (3 ס\"מ)", "Ku (2 ס\"מ)"];
export const rcsPlate: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { floor: -2.6, gridSize: 12, fog: false });
  const L = v.params.L ?? 5;
  const lam = BANDS[Math.round(v.params.band ?? 1)][1];
  const side = L * lam;
  const peak = 10 * Math.log10((4 * Math.PI * side ** 4) / lam ** 2);
  const floorDB = -40;
  const R = 2.2;
  const sinc = (x: number) => (Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x);
  const k = 2 * Math.PI; // in wavelengths
  // pattern in the plate's frame: normal along +y
  const rel = (x: number, y: number, z: number) => {
    const c = Math.abs(y);
    const val = c * c * sinc(k * L * x) ** 2 * sinc(k * L * z) ** 2;
    return 10 * Math.log10(val + 1e-12);
  };
  const plateG = new THREE.Group();
  sc.add(plateG);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.9), h.std(0xa8b2ba, { metalness: 0.9, roughness: 0.25 }));
  plateG.add(h.info(plate, "הלוח", `${side.toFixed(2)} × ${side.toFixed(2)} מ' (${L} אורכי גל). שיא ה-RCS בניצב: 4πA²/λ² = ${peak.toFixed(1)} dBsm.`));
  const geo = new THREE.SphereGeometry(1, h.lite ? 160 : 240, h.lite ? 80 : 120);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const g = Math.max(floorDB, rel(x, y, z));
    const r = R * Math.max(0.01, (g - floorDB) / -floorDB);
    pos.setXYZ(i, x * r, y * r, z * r);
    col.set(h.cmap(h.CM.viridis, (g - floorDB) / -floorDB), 3 * i);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  plateG.add(
    h.info(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0, envMapIntensity: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.92 })), (hit: any) => {
      const p = plateG.worldToLocal(hit.point.clone()).normalize();
      const g = rel(p.x, p.y, p.z);
      return { t: Math.abs(p.y) > 0.98 ? "האונה הספקולרית" : "אונת צד", x: `${(peak + g).toFixed(1)} dBsm (${g.toFixed(1)} dB מהשיא), ${(Math.acos(Math.min(1, Math.abs(p.y))) / D2R).toFixed(0)}° מהניצב. ככל שהלוח גדול באורכי גל, האונה צרה יותר והשיא גבוה יותר.` };
    }),
  );
  // the radar looks along −x from +x, horizontally
  const rd = h.arrow(0xff8a5b, 0.03, 0.09, 0.22);
  rd.position.set(3.4, 0, 0);
  rd.set(h.V3(-1, 0, 0), 1.0);
  sc.add(h.info(rd, "כיוון המכ\"ם", "המכ\"ם מסתכל לאורך החץ. הטיית הלוח מסיטה את האונה הספקולרית ממנו: זה עיקרון העיצוב החמקני."));
  let toward = 0;
  return {
    update(t) {
      const tilt = (v.params.tilt ?? 30) * D2R;
      const yaw = v.params.spin ? t * 0.3 : 0;
      plateG.rotation.set(0, yaw, -Math.PI / 2 + tilt);
      plateG.updateMatrixWorld(true);
      const d = plateG.worldToLocal(h.V3(1, 0, 0).add(plateG.position)).normalize();
      toward = peak + rel(d.x, d.y, d.z);
    },
    hud: () => `peak σ = 4πA²/λ² = ${peak.toFixed(1)} dBsm\nσ toward the radar ${toward.toFixed(1)} dBsm\nλ ${(lam * 100).toFixed(0)} cm   plate ${side.toFixed(2)} m`,
  };
};

/* ---------- infrared signature of an aircraft ---------- */
// Planck radiance in the band, for skin (recovery temperature), hot nozzle metal and plume.
// Areas and emissivities are representative, not of a specific aircraft.
const BANDS_IR = [
  [3, 5],
  [8, 12],
];
export const IR_BANDS = ["MWIR 3–5 µm", "LWIR 8–12 µm"];
function bandRadiance(T: number, l1: number, l2: number) {
  const c1 = 1.191042e8; // 2hc², W·µm⁴/(m²·sr)
  const c2 = 14387.77; // hc/k, µm·K
  let s = 0;
  const n = 60;
  const dl = (l2 - l1) / n;
  for (let i = 0; i < n; i++) {
    const l = l1 + (i + 0.5) * dl;
    s += (c1 / l ** 5 / (Math.exp(c2 / (l * T)) - 1)) * dl;
  }
  return s; // W/(m²·sr)
}
export const irSignature: Builder = (THREE, sc, v, h) => {
  h.studio(sc, v.look, { fog: false, floor: -1.2, gridSize: 12 });
  const M = v.params.M ?? 0.9;
  const ab = Math.round(v.params.ab ?? 0);
  const [l1, l2] = BANDS_IR[Math.round(v.params.band ?? 0)];
  const Tamb = 223; // 11 km
  const Tskin = Tamb * (1 + 0.85 * 0.2 * M * M);
  const Tnoz = ab ? 1000 : 800;
  const Tplume = ab ? 1700 : 650;
  const parts = [
    { id: "skin", name: "המעטפת", T: Tskin, eps: 0.85, A: 30 },
    { id: "noz", name: "הנחיר", T: Tnoz, eps: 0.9, A: 0.8 },
    { id: "plume", name: "הסילון", T: Tplume, eps: ab ? 0.3 : 0.12, A: ab ? 12 : 6 },
  ].map((p) => ({ ...p, L: p.eps * bandRadiance(p.T, l1, l2), I: 0 }));
  for (const p of parts) p.I = p.L * p.A;
  const Lsky = 0.5 * bandRadiance(Tamb, l1, l2);
  const lo = Math.log10(Lsky);
  const hi = Math.log10(Math.max(...parts.map((p) => p.L)) * 1.2);
  const colOf = (Lp: number) => {
    const c = h.cmap(h.CM.inferno, 0.08 + (0.92 * (Math.log10(Lp) - lo)) / (hi - lo));
    return new THREE.Color(c[0], c[1], c[2]);
  };
  // emissive in its in-band colour, with a little light for shape
  const mat = (Lp: number, o: Record<string, unknown> = {}) => new THREE.MeshStandardMaterial({ color: 0x181818, emissive: colOf(Lp), emissiveIntensity: 1, roughness: 0.55, metalness: 0, envMapIntensity: 0.25, ...o });
  const desc = (p: (typeof parts)[number]) => ({ t: p.name, x: `${p.T.toFixed(0)} K, שיא וין ב-${(2898 / p.T).toFixed(1)} µm. קרינות בפס ${(p.L).toPrecision(3)} W/(m²·sr), עוצמה ${(p.I).toPrecision(3)} W/sr (שטח ${p.A} מ"ר, פליטות ${p.eps}).` });
  const [skin, noz, plume] = parts;
  const ac = new THREE.Group();
  sc.add(ac);
  const skinInfo = () => ({ ...desc(skin), x: desc(skin).x + ` חימום אווירודינמי: T = T∞(1 + r·0.2·M²) = ${skin.T.toFixed(0)} K במאך ${M.toFixed(1)}.` });
  // fuselage: a lathe along x, nose forward
  const prof = [[0, 2.45], [0.09, 2.2], [0.2, 1.75], [0.27, 1.2], [0.29, 0.4], [0.29, -1.3], [0.25, -1.62]].map(([r, y]) => new THREE.Vector2(r, y));
  const fusG = new THREE.LatheGeometry(prof, 40);
  fusG.rotateZ(-Math.PI / 2);
  ac.add(h.info(new THREE.Mesh(fusG, mat(skin.L)), skinInfo));
  const flat = (pts: number[][], depth: number) => {
    const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  };
  const wingG = flat([[0.9, 0], [-0.95, 1.8], [-1.25, 1.8], [-1.35, 0], [-1.25, -1.8], [-0.95, -1.8]], 0.05);
  wingG.rotateX(Math.PI / 2);
  ac.add(h.info(new THREE.Mesh(wingG, mat(skin.L)), skinInfo));
  const stabG = flat([[-1.15, 0], [-1.7, 0.8], [-1.92, 0.8], [-1.9, 0], [-1.92, -0.8], [-1.7, -0.8]], 0.04);
  stabG.rotateX(Math.PI / 2);
  ac.add(h.info(new THREE.Mesh(stabG, mat(skin.L)), skinInfo));
  const finG = flat([[-0.85, 0.2], [-1.5, 1.15], [-1.78, 1.15], [-1.72, 0.2]], 0.04);
  ac.add(h.info(new THREE.Mesh(finG, mat(skin.L)), skinInfo));
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ color: 0x0b0f14, roughness: 0.1, metalness: 0.2, envMapIntensity: 0.8 }));
  canopy.scale.set(0.5, 0.17, 0.16);
  canopy.position.set(1.45, 0.22, 0);
  ac.add(canopy);
  const nz = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.3, 32, 1, true), mat(noz.L, { side: THREE.DoubleSide }));
  nz.rotation.z = Math.PI / 2;
  nz.position.x = -1.76;
  ac.add(h.info(nz, () => desc(noz)));
  const pl = new THREE.Mesh(new THREE.ConeGeometry(ab ? 0.3 : 0.2, ab ? 3.2 : 2.2, 32, 8, true), new THREE.MeshBasicMaterial({ color: colOf(plume.L), transparent: true, opacity: ab ? 0.75 : 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  pl.rotation.z = Math.PI / 2;
  pl.position.x = -1.95 - (ab ? 1.6 : 1.1);
  ac.add(h.info(pl, () => ({ ...desc(plume), x: desc(plume).x + " גז חם פולט בפסים (CO₂ סביב 4.3 µm, H₂O), ולכן הוא בולט ב-MWIR ונחלש ב-LWIR." })));
  const total = parts.reduce((s, p) => s + p.I, 0);
  return {
    update(t) {
      ac.rotation.y = 0.5 + 0.35 * Math.sin(t * 0.25);
      pl.scale.set(1, 1 + 0.03 * Math.sin(t * 13), 1);
    },
    hud: () => `band ${l1}–${l2} µm   M ${M.toFixed(1)}${ab ? "  afterburner" : ""}\nT skin ${skin.T.toFixed(0)} K  nozzle ${noz.T} K  plume ${plume.T} K\nshare of in-band intensity: skin ${((100 * skin.I) / total).toFixed(0)}%  nozzle ${((100 * noz.I) / total).toFixed(0)}%  plume ${((100 * plume.I) / total).toFixed(0)}%`,
  };
};
