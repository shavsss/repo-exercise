// The 3D engine shared by the Engineering Lab and the Core Lab. It has no React and no
// npm dependencies: three.js (r128, UMD) is loaded from the CDN the first time a scene
// appears, so a lesson without 3D never downloads it. Every scene on the page is drawn by
// one WebGL renderer and copied to the scene's own 2D canvas, which keeps the page under
// the browser's limit of about 16 WebGL contexts.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    THREE?: any;
  }
}

const SCRIPTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
  "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/environments/RoomEnvironment.js",
];

let loading: Promise<any> | null = null;

function addScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`לא הצלחתי לטעון את ${src}`));
    document.head.appendChild(s);
  });
}

/** Loads three.js once; resolves with the THREE namespace. */
export function loadThree(): Promise<any> {
  if (window.THREE?.OrbitControls) return Promise.resolve(window.THREE);
  if (!loading)
    loading = (async () => {
      if (!window.THREE) await addScript(SCRIPTS[0]);
      await Promise.all([addScript(SCRIPTS[1]), addScript(SCRIPTS[2])]);
      return window.THREE;
    })().catch((e) => {
      loading = null;
      throw e;
    });
  return loading;
}

export const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
/** Phones and small screens: lower resolution, smaller shadow maps, coarser meshes. */
export const lite = typeof window !== "undefined" && (coarse || window.matchMedia("(max-width: 700px)").matches);

export type Look = "dark" | "light";
export interface Info {
  t: string;
  x?: string;
}
export interface Param {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  unit?: string;
}
export interface TourStop {
  cam: [number, number, number];
  target: [number, number, number];
  text: string;
}
/** What a scene builder returns. */
export interface SceneApi {
  update?(t: number, dt: number): void;
  tick?(dt: number): void;
  onPick?(obj: any, hit: any): void;
  /** text for the corner readout, refreshed every frame */
  hud?(): string;
}
export interface View {
  el: HTMLElement;
  look: Look;
  params: Record<string, number>;
  camera: any;
  controls: any;
  scene: any;
  api: SceneApi;
  t: number;
  rebuild(): void;
  setLook(look: Look): void;
  setParams(p: Record<string, number>): void;
  flyTo(stop: { cam: number[]; target: number[] }): void;
  dispose(): void;
}
export type Builder = (THREE: any, sc: any, v: View, h: Helpers) => SceneApi | void;
export interface ViewOptions {
  cam: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  minD?: number;
  maxD?: number;
  spin?: number;
  tone?: "aces" | "none";
  look?: Look;
  params?: Record<string, number>;
  /** called with the picked object's info (or null), for the host's own tooltip */
  onInfo?: (info: Info | null, x: number, y: number) => void;
  onHud?: (text: string) => void;
}

/* ---------------- the shared renderer ---------------- */
const E: { r: any; env: any; views: (View & Internal)[]; paused: boolean; raf: number; last: number } = { r: null, env: null, views: [], paused: false, raf: 0, last: 0 };
interface Internal {
  cv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pw: number;
  ph: number;
  visible: boolean;
  drawn: boolean;
  o: ViewOptions;
  tween: { u: number; p0: any; p1: any; t0: any; t1: any } | null;
  ro: ResizeObserver;
  io: IntersectionObserver;
  hudLast: number;
}

function renderer(THREE: any) {
  if (E.r) return E.r;
  const r = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  r.setPixelRatio(1);
  r.outputEncoding = THREE.sRGBEncoding;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  const pm = new THREE.PMREMGenerator(r);
  E.env = THREE.RoomEnvironment ? pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture : null;
  E.r = r;
  return r;
}

export function setPaused(p: boolean) {
  E.paused = p;
}

function frame(now: number) {
  E.raf = requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - E.last) / 1000);
  E.last = now;
  const vis = E.views.filter((v) => v.visible && v.pw > 0 && v.ph > 0);
  if (!vis.length) return;
  const THREE = window.THREE;
  const r = E.r;
  const gc = r.domElement as HTMLCanvasElement;
  let W = gc.width;
  let H = gc.height;
  for (const v of vis) {
    W = Math.max(W, v.pw);
    H = Math.max(H, v.ph);
  }
  if (W !== gc.width || H !== gc.height) r.setSize(W, H, false);
  const anim = !E.paused && !reduceMotion;
  for (const v of vis) {
    try {
      if (v.tween) {
        const tw = v.tween;
        tw.u = Math.min(1, tw.u + dt / 1.4);
        const e = tw.u < 0.5 ? 2 * tw.u * tw.u : 1 - (-2 * tw.u + 2) ** 2 / 2;
        v.camera.position.lerpVectors(tw.p0, tw.p1, e);
        v.controls.target.lerpVectors(tw.t0, tw.t1, e);
        if (tw.u >= 1) v.tween = null;
      }
      v.api.tick?.(dt);
      v.controls.update();
      if (anim || !v.drawn) {
        if (anim) v.t += dt;
        v.api.update?.(v.t + 2, anim ? dt : 0);
      }
      if (v.api.hud && v.o.onHud && now - v.hudLast > 120) {
        v.hudLast = now;
        v.o.onHud(v.api.hud());
      }
      r.toneMapping = v.o.tone === "none" ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = 1;
      r.setViewport(0, 0, v.pw, v.ph);
      r.setScissor(0, 0, v.pw, v.ph);
      r.setScissorTest(true);
      r.render(v.scene, v.camera);
      v.ctx.drawImage(gc, 0, gc.height - v.ph, v.pw, v.ph, 0, 0, v.pw, v.ph);
      v.drawn = true;
    } catch (e) {
      console.error(e);
      v.visible = false;
    }
  }
}

function disposeScene(sc: any) {
  if (!sc) return;
  sc.traverse((o: any) => {
    o.geometry?.dispose?.();
    const m = o.material;
    if (m) (Array.isArray(m) ? m : [m]).forEach((x: any) => (x.map?.dispose?.(), x.dispose?.()));
  });
}

/** Mounts a scene into an element (which should have a size); returns the view. */
export async function mount(el: HTMLElement, build: Builder, o: ViewOptions): Promise<View> {
  const THREE = await loadThree();
  const r = renderer(THREE);
  const cv = document.createElement("canvas");
  cv.className = "s3d-canvas";
  el.prepend(cv);
  const v = {
    el,
    cv,
    ctx: cv.getContext("2d")!,
    look: o.look ?? "dark",
    params: { ...(o.params ?? {}) },
    o,
    pw: 0,
    ph: 0,
    t: 0,
    visible: false,
    drawn: false,
    tween: null,
    hudLast: 0,
  } as unknown as View & Internal;
  const helpers = makeHelpers(THREE);
  v.camera = new THREE.PerspectiveCamera(o.fov ?? 36, 1.6, 0.02, 400);
  v.camera.position.set(...o.cam);
  const c = (v.controls = new THREE.OrbitControls(v.camera, cv));
  c.target.set(...(o.target ?? [0, 0, 0]));
  c.enableDamping = true;
  c.dampingFactor = 0.08;
  c.enablePan = false;
  c.enableZoom = false;
  c.minDistance = o.minD ?? 1;
  c.maxDistance = o.maxD ?? 60;
  c.autoRotate = !!o.spin && !reduceMotion;
  c.autoRotateSpeed = o.spin ?? 0.5;
  // zoom only after the scene is clicked, so the page still scrolls over it
  let down: [number, number] | null = null;
  cv.addEventListener("pointerdown", (e) => {
    c.enableZoom = true;
    c.autoRotate = false;
    v.tween = null;
    down = [e.clientX, e.clientY];
  });
  cv.addEventListener("pointerup", (e) => {
    if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) pick(THREE, v, e);
    down = null;
  });
  el.addEventListener("pointerleave", () => (c.enableZoom = false));
  if (coarse) {
    // on touch screens the scene takes the finger only after a tap, so the page scrolls
    c.enabled = false;
    el.dataset.locked = "1";
    cv.addEventListener("click", () => {
      c.enabled = !c.enabled;
      c.enableZoom = c.enabled;
      el.dataset.locked = c.enabled ? "0" : "1";
    });
  }
  v.rebuild = () => {
    disposeScene(v.scene);
    v.scene = new THREE.Scene();
    v.api = build(THREE, v.scene, v, helpers) || {};
    v.drawn = false;
  };
  v.setLook = (look) => {
    if (look === v.look) return;
    v.look = look;
    v.rebuild();
  };
  v.setParams = (p) => {
    v.params = { ...v.params, ...p };
    v.drawn = false;
  };
  v.flyTo = (s) => {
    c.autoRotate = false;
    const tw = { u: 0, p0: v.camera.position.clone(), p1: new THREE.Vector3(...s.cam), t0: c.target.clone(), t1: new THREE.Vector3(...s.target) };
    if (reduceMotion) tw.u = 0.999;
    v.tween = tw;
  };
  v.dispose = () => {
    v.ro.disconnect();
    v.io.disconnect();
    c.dispose();
    disposeScene(v.scene);
    cv.remove();
    E.views = E.views.filter((x) => x !== v);
    if (!E.views.length && E.raf) {
      cancelAnimationFrame(E.raf);
      E.raf = 0;
    }
  };
  v.rebuild();
  const size = () => {
    const dpr = Math.min(lite ? 1.5 : 2, window.devicePixelRatio || 1);
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    v.pw = Math.round(w * dpr);
    v.ph = Math.round(h * dpr);
    cv.width = v.pw;
    cv.height = v.ph;
    v.camera.aspect = w / h;
    v.camera.updateProjectionMatrix();
    v.drawn = false;
  };
  v.ro = new ResizeObserver(size);
  v.ro.observe(el);
  size();
  v.io = new IntersectionObserver(([en]) => (v.visible = en.isIntersecting), { rootMargin: "120px" });
  v.io.observe(el);
  E.views.push(v);
  if (!E.raf) {
    E.last = performance.now();
    E.raf = requestAnimationFrame(frame);
  }
  void r;
  return v;
}

let ray: any = null;
function pick(THREE: any, v: View & Internal, e: PointerEvent) {
  ray ??= new THREE.Raycaster();
  ray.params.Line.threshold = 0.04;
  const r = v.cv.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), v.camera);
  let found: [any, any] | null = null;
  for (const h of ray.intersectObjects(v.scene.children, true)) {
    let o = h.object;
    while (o && !o.userData.info) o = o.parent;
    if (o && o.visible !== false) {
      found = [o, h];
      break;
    }
  }
  v.api.onPick?.(found?.[0] ?? null, found?.[1] ?? null);
  if (!found) return v.o.onInfo?.(null, 0, 0);
  const inf = found[0].userData.info;
  v.o.onInfo?.(typeof inf === "function" ? inf(found[1]) : inf, e.clientX - r.left, e.clientY - r.top);
}

/* ---------------- helpers given to every scene builder ---------------- */
const sRGB = (c: number[]) => c.map((x) => Math.pow(x, 2.2));
export const CM: Record<string, number[][]> = {
  viridis: [[0.267, 0.005, 0.329], [0.229, 0.322, 0.546], [0.128, 0.567, 0.551], [0.369, 0.789, 0.383], [0.993, 0.906, 0.144]].map(sRGB),
  diverge: [[0.17, 0.33, 0.8], [0.55, 0.7, 0.95], [0.93, 0.93, 0.93], [0.96, 0.6, 0.48], [0.78, 0.07, 0.12]].map(sRGB),
  ocean: [[0.02, 0.07, 0.2], [0.04, 0.25, 0.45], [0.1, 0.5, 0.62], [0.45, 0.78, 0.82], [0.92, 0.97, 0.98]].map(sRGB),
  inferno: [[0.001, 0, 0.014], [0.258, 0.039, 0.406], [0.578, 0.148, 0.404], [0.865, 0.317, 0.226], [0.988, 0.645, 0.04], [0.988, 1.0, 0.645]].map(sRGB),
};
export function cmap(stops: number[][], t: number) {
  t = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(t));
  const f = t - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

const LOOK = {
  dark: { bg: 0x0e1418, g1: 0x2c3b47, g2: 0x18232b, sky: 0xcfe0f0, ground: 0x141a1f, hemi: 0.12, key: 1.05, rim: 0.4, shadow: 0.5 },
  light: { bg: 0xe8edf0, g1: 0x9fb0bb, g2: 0xcfd8de, sky: 0xffffff, ground: 0x8a959c, hemi: 0.2, key: 0.9, rim: 0.25, shadow: 0.22 },
};

export type Helpers = ReturnType<typeof makeHelpers>;
function makeHelpers(THREE: any) {
  const V3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const std = (color: number, o: Record<string, unknown> = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.1, envMapIntensity: 0.45, ...o });
  const info = (o: any, t: string | ((h: any) => Info), x?: string) => {
    o.userData.info = typeof t === "function" ? t : { t, x };
    return o;
  };
  const glow = (r: number, color: number, i = 1.2) => new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), std(color, { emissive: color, emissiveIntensity: i, roughness: 0.3 }));
  function studio(sc: any, look: Look, o: { shadow?: number; floor?: number; gridSize?: number; fog?: boolean; env?: boolean } = {}) {
    const L = LOOK[look] ?? LOOK.dark;
    sc.background = new THREE.Color(L.bg);
    if (E.env && o.env !== false) sc.environment = E.env;
    if (o.fog !== false) sc.fog = new THREE.Fog(L.bg, 16, 44);
    sc.add(new THREE.HemisphereLight(L.sky, L.ground, L.hemi));
    const key = new THREE.DirectionalLight(0xffffff, L.key);
    key.position.set(6, 10, 6);
    if (o.shadow) {
      key.castShadow = true;
      key.shadow.mapSize.set(lite ? 1024 : 2048, lite ? 1024 : 2048);
      Object.assign(key.shadow.camera, { left: -o.shadow, right: o.shadow, top: o.shadow, bottom: -o.shadow, near: 1, far: 40 });
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
    }
    sc.add(key);
    const rim = new THREE.DirectionalLight(0x8fb8ff, L.rim);
    rim.position.set(-8, 4, -6);
    sc.add(rim);
    if (o.floor !== undefined) {
      const n = o.gridSize ?? 24;
      const grid = new THREE.GridHelper(n, n * 2, L.g1, L.g2);
      grid.position.y = o.floor;
      sc.add(grid);
      if (o.shadow) {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: L.shadow }));
        s.rotation.x = -Math.PI / 2;
        s.position.y = o.floor + 0.002;
        s.receiveShadow = true;
        sc.add(s);
      }
    }
    return key;
  }
  function arrow(color: number, shaft = 0.035, head = 0.1, headLen = 0.26) {
    const g = new THREE.Group();
    const m = std(color, { emissive: color, emissiveIntensity: 0.35, roughness: 0.35 });
    const s = new THREE.Mesh(new THREE.CylinderGeometry(shaft, shaft, 1, 16), m);
    s.position.y = 0.5;
    const sp = new THREE.Group();
    sp.add(s);
    g.add(sp);
    const h = new THREE.Mesh(new THREE.ConeGeometry(head, headLen, 24), m);
    g.add(h);
    const up = V3(0, 1, 0);
    g.set = (dir: any, len: number) => {
      const L = Math.max(0.001, len);
      const hl = Math.min(headLen, L * 0.45);
      sp.scale.set(1, Math.max(0.001, L - hl), 1);
      h.scale.set(1, hl / headLen, 1);
      h.position.y = L - hl / 2;
      if (dir.lengthSq() > 1e-12) g.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    };
    return g;
  }
  function rbox(w: number, h: number, d: number, r = 0.05) {
    const s = new THREE.Shape();
    const a = w / 2 - r;
    const b = h / 2 - r;
    s.moveTo(-a, -b);
    s.lineTo(a, -b);
    s.lineTo(a, b);
    s.lineTo(-a, b);
    s.lineTo(-a, -b);
    const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 4, curveSegments: 4 });
    g.translate(0, 0, -(d - 2 * r) / 2);
    g.computeVertexNormals();
    return g;
  }
  function colorTube(points: any[], values: number[], lo: number, hi: number, radius: number, stops: number[][], emissive = 0.12) {
    const curve = new THREE.CatmullRomCurve3(points);
    const seg = Math.min(600, points.length * 2);
    const rad = 6;
    const g = new THREE.TubeGeometry(curve, seg, radius, rad, false);
    const col = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i <= seg; i++) {
      const s = values[Math.min(values.length - 1, Math.round((i / seg) * (values.length - 1)))];
      const c = cmap(stops, (s - lo) / (hi - lo));
      for (let j = 0; j <= rad; j++) col.set(c, 3 * (i * (rad + 1) + j));
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0, envMapIntensity: 0.3, emissive: 0xffffff, emissiveIntensity: emissive * 0.5 }));
    m.userData.curve = curve;
    return m;
  }
  /** Inverted-hull silhouette, for the CAD look. */
  function outline(mesh: any, color: number, w: number) {
    const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
    m.onBeforeCompile = (sh: any) => {
      sh.vertexShader = sh.vertexShader.replace("#include <begin_vertex>", `vec3 transformed = vec3(position) + normalize(normal) * ${w.toFixed(4)};`);
    };
    const h = new THREE.Mesh(mesh.geometry, m);
    h.userData.keep = true;
    mesh.add(h);
  }
  /** Clean CAD materials by role (body, dark, accent, accent2), with edges and silhouettes. */
  function cad(root: any, look: Look) {
    const edge = look === "dark" ? 0x0b1116 : 0x26313a;
    const colors: Record<string, number> = look === "dark" ? { body: 0xc9d1d7, dark: 0x4b5660, accent: 0x3a9cc0, accent2: 0xa8b2ba } : { body: 0xdfe4e8, dark: 0x5b6670, accent: 0x1f6f8b, accent2: 0xb9c2c9 };
    const meshes: any[] = [];
    root.traverse((o: any) => o.isMesh && !o.userData.keep && meshes.push(o));
    for (const o of meshes) {
      o.material = new THREE.MeshStandardMaterial({ color: colors[o.userData.role ?? "body"] ?? colors.body, roughness: 0.6, metalness: 0.05, envMapIntensity: 0.4, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
      o.castShadow = o.receiveShadow = true;
      o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 40), new THREE.LineBasicMaterial({ color: edge })));
      outline(o, edge, 0.012);
    }
  }
  return { V3, std, info, glow, studio, arrow, rbox, colorTube, outline, cad, cmap, CM, lite };
}
