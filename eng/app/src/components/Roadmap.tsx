import { useEffect, useMemo, useRef, useState } from "react";
import { moduleState, type LibraryIndex, type Module, type ModuleState } from "../library";
import type { ModuleProgress } from "../types";
import { STATE_LABEL, TIER_LABEL, type Selection } from "./ModuleMap";
import "./roadmap.css";

/**
 * The course as layers. A module's layer is the length of its longest chain of
 * prerequisites, so two modules on the same layer never depend on each other and
 * can be learned side by side. Two views of the same graph: a tower in 3D
 * (layers go up, each part has its own direction around the axis) and a flat
 * grid of parts by layers. The side panel lists what is open now, or the chain of
 * the module in focus: what it needs and what it opens.
 */
interface Graph {
  byId: Record<string, Module>;
  layer: Record<string, number>;
  layers: number;
  next: Record<string, string[]>;
  parts: { id: string; title: string }[];
}

function buildGraph(index: LibraryIndex): Graph {
  const byId = Object.fromEntries(index.modules.map((m) => [m.id, m]));
  const layer: Record<string, number> = {};
  const next: Record<string, string[]> = {};
  const depth = (id: string, seen: Set<string>): number => {
    if (layer[id] !== undefined) return layer[id];
    if (seen.has(id)) return 0; // a cycle would be a syllabus bug; do not loop on it
    seen.add(id);
    const pre = (byId[id].prereq ?? []).filter((p) => byId[p]);
    return (layer[id] = pre.length ? 1 + Math.max(...pre.map((p) => depth(p, seen))) : 0);
  };
  for (const m of index.modules) {
    depth(m.id, new Set());
    for (const p of m.prereq ?? []) if (byId[p]) (next[p] ??= []).push(m.id);
  }
  const used = new Set(index.modules.map((m) => m.part));
  return { byId, layer, layers: 1 + Math.max(0, ...Object.values(layer)), next, parts: index.parts.filter((p) => used.has(p.id)) };
}

/** Everything reachable from id along edges (not including id). */
function reach(id: string, edges: (id: string) => string[]) {
  const out = new Set<string>();
  const stack = [...edges(id)];
  while (stack.length) {
    const x = stack.pop()!;
    if (out.has(x)) continue;
    out.add(x);
    stack.push(...edges(x));
  }
  return out;
}

type View = "tower" | "grid";

export function Roadmap({ index, done, mods, onSelect }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void }) {
  const g = useMemo(() => buildGraph(index), [index]);
  const state = useMemo(() => Object.fromEntries(index.modules.map((m) => [m.id, moduleState(m, done)])) as Record<string, ModuleState>, [index, done]);
  const [view, setView] = useState<View>(() => (typeof window !== "undefined" && window.matchMedia?.("(max-width: 700px)").matches ? "grid" : "tower"));
  const [focus, setFocus] = useState<string | null>(null);
  const chain = useMemo(() => {
    if (!focus || !g.byId[focus]) return null;
    const before = reach(focus, (id) => (g.byId[id]?.prereq ?? []).filter((p) => g.byId[p]));
    const after = reach(focus, (id) => g.next[id] ?? []);
    return { before, after };
  }, [focus, g]);
  const counts = useMemo(() => {
    const c = { done: 0, open: 0, locked: 0 };
    for (const s of Object.values(state)) c[s]++;
    return c;
  }, [state]);

  return (
    <section className="roadmap">
      <div className="rmp-stage">
        <div className="rmp-bar">
          <div className="rmp-views" role="tablist" aria-label="תצוגת המפה">
            {(["tower", "grid"] as View[]).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} className={view === v ? "is-on" : ""} onClick={() => setView(v)}>
                {v === "tower" ? "מגדל בתלת־ממד" : "שכבות"}
              </button>
            ))}
          </div>
          <ul className="rmp-legend">
            <li className="st-done">נלמד {counts.done}</li>
            <li className="st-open">פתוח עכשיו {counts.open}</li>
            <li className="st-locked">נעול {counts.locked}</li>
          </ul>
        </div>
        {view === "tower" ? (
          <Tower g={g} state={state} focus={focus} chain={chain} onPick={setFocus} />
        ) : (
          <LayerGrid g={g} state={state} focus={focus} chain={chain} onPick={setFocus} />
        )}
        <p className="rmp-hint">
          {view === "tower"
            ? "גובה = שכבה. גרור כדי לסובב, גלגלת כדי להתקרב, לחיצה על נקודה מציגה את השרשרת שלה."
            : "כל עמודה היא שכבה: מודולים באותה עמודה לא תלויים זה בזה. לחיצה על מודול מציגה את השרשרת שלו."}
        </p>
      </div>
      <aside className="rmp-panel">
        {focus && g.byId[focus] ? (
          <Focus g={g} id={focus} state={state} mods={mods} chain={chain!} onPick={setFocus} onOpen={(id) => onSelect({ moduleId: id })} onClear={() => setFocus(null)} />
        ) : (
          <OpenNow g={g} state={state} mods={mods} onPick={setFocus} onOpen={(id) => onSelect({ moduleId: id })} />
        )}
      </aside>
    </section>
  );
}

/* ---------------- side panel ---------------- */

function ModRow({ m, st, mods, onClick }: { m: Module; st: ModuleState; mods: Record<string, ModuleProgress>; onClick: () => void }) {
  const p = mods[m.id];
  return (
    <li>
      <button className={`rmp-mod st-${st}`} onClick={onClick}>
        <span className="rmp-dot" />
        <span className="mod-id" dir="ltr">
          {m.id}
        </span>
        <span className="mod-title">{m.title}</span>
        <span className={`tier tier-${m.tier}`}>{TIER_LABEL[m.tier]}</span>
        {p?.lessons?.length && st !== "done" ? <span className="rmp-prog">{`${p.done?.length ?? 0}/${p.lessons.length}`}</span> : null}
      </button>
    </li>
  );
}

function OpenNow({ g, state, mods, onPick, onOpen }: { g: Graph; state: Record<string, ModuleState>; mods: Record<string, ModuleProgress>; onPick: (id: string) => void; onOpen: (id: string) => void }) {
  const tracks = g.parts
    .map((p) => ({ p, ms: Object.values(g.byId).filter((m) => m.part === p.id && state[m.id] === "open") }))
    .filter((t) => t.ms.length);
  return (
    <>
      <h3 className="rmp-h">פתוח עכשיו במקביל</h3>
      <p className="rmp-sub">
        {tracks.length} מסלולים פתוחים. אפשר לגוון ביניהם בלי לחכות: מודולים במסלולים שונים לא תלויים זה בזה. לחיצה פותחת את המודול, והנקודה
        שלידו מסמנת אותו במפה.
      </p>
      <div className="rmp-tracks">
        {tracks.map(({ p, ms }) => (
          <div key={p.id} className="rmp-track">
            <div className="rmp-track-h">
              <bdi dir="ltr">{p.id}</bdi> {p.title}
            </div>
            <ul className="rmp-list">
              {ms.map((m) => (
                <li key={m.id} className="rmp-open-row">
                  <button className="rmp-locate" title="סמן במפה" aria-label={`סמן את ${m.id} במפה`} onClick={() => onPick(m.id)}>
                    ◎
                  </button>
                  <ul className="rmp-inner">
                    <ModRow m={m} st="open" mods={mods} onClick={() => onOpen(m.id)} />
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function Focus({
  g,
  id,
  state,
  mods,
  chain,
  onPick,
  onOpen,
  onClear,
}: {
  g: Graph;
  id: string;
  state: Record<string, ModuleState>;
  mods: Record<string, ModuleProgress>;
  chain: { before: Set<string>; after: Set<string> };
  onPick: (id: string) => void;
  onOpen: (id: string) => void;
  onClear: () => void;
}) {
  const m = g.byId[id];
  const direct = (m.prereq ?? []).filter((p) => g.byId[p]);
  const opens = g.next[id] ?? [];
  const missing = [...chain.before].filter((x) => state[x] !== "done");
  const part = g.parts.find((p) => p.id === m.part);
  const list = (ids: string[]) => (
    <ul className="rmp-list">
      {ids.map((x) => (
        <ModRow key={x} m={g.byId[x]} st={state[x]} mods={mods} onClick={() => onPick(x)} />
      ))}
    </ul>
  );
  return (
    <>
      <button className="rmp-back" onClick={onClear}>
        → חזרה לפתוח עכשיו
      </button>
      <h3 className="rmp-h">
        <bdi dir="ltr">{m.id}</bdi> {m.title}
      </h3>
      <p className="rmp-sub">
        <span className={`state state-${state[id]}`}>{STATE_LABEL[state[id]]}</span> · שכבה {g.layer[id]} · {part ? `${part.id} ${part.title}` : m.part}
      </p>
      <button className="btn primary rmp-go" onClick={() => onOpen(id)}>
        פתח את המודול
      </button>
      {state[id] === "locked" && (
        <p className="rmp-sub">
          חסרים עוד {missing.length} מודולים בשרשרת שלפניו. הקרובים ביותר: {direct.filter((p) => state[p] !== "done").join(", ") || "—"}.
        </p>
      )}
      <h4 className="rmp-h4">דורש ({direct.length})</h4>
      {direct.length ? list(direct) : <p className="rmp-sub">אין דרישות קדם: אפשר להתחיל ממנו.</p>}
      <h4 className="rmp-h4">פותח ({opens.length})</h4>
      {opens.length ? list(opens) : <p className="rmp-sub">שום מודול לא נשען עליו ישירות.</p>}
      <p className="rmp-sub">
        בשרשרת כולה: {chain.before.size} מודולים לפניו ו-{chain.after.size} אחריו.
      </p>
    </>
  );
}

/* ---------------- the flat grid: parts by layers ---------------- */

function LayerGrid({ g, state, focus, chain, onPick }: { g: Graph; state: Record<string, ModuleState>; focus: string | null; chain: { before: Set<string>; after: Set<string> } | null; onPick: (id: string) => void }) {
  const cells = useMemo(() => {
    const c: Record<string, Module[]> = {};
    for (const m of Object.values(g.byId)) (c[`${m.part}|${g.layer[m.id]}`] ??= []).push(m);
    return c;
  }, [g]);
  const cls = (id: string) =>
    `rmp-chip st-${state[id]}` + (focus === id ? " is-focus" : chain ? (chain.before.has(id) ? " is-before" : chain.after.has(id) ? " is-after" : " is-dim") : "");
  return (
    <div className="rmp-grid-wrap">
      <div className="rmp-grid" style={{ ["--cols" as string]: `9.5rem repeat(${g.layers}, 46px)` }}>
        <div className="rmp-row rmp-head">
          <div className="rmp-corner">חלק \ שכבה</div>
          {Array.from({ length: g.layers }, (_, i) => (
            <div key={i} className="rmp-colh">
              {i}
            </div>
          ))}
        </div>
        {g.parts.map((p) => (
          <div key={p.id} className="rmp-row">
            <div className="rmp-rowh" title={p.title}>
              <bdi dir="ltr">{p.id}</bdi> {p.title}
            </div>
            {Array.from({ length: g.layers }, (_, i) => (
              <div key={i} className="rmp-cell">
                {(cells[`${p.id}|${i}`] ?? []).map((m) => (
                  <button key={m.id} className={cls(m.id)} title={`${m.id} ${m.title}`} onClick={() => onPick(m.id)} dir="ltr">
                    {m.id.replace(/^M/, "")}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- the tower: a small 3D renderer on a canvas ---------------- */

interface Node3 {
  id: string;
  x: number;
  y: number;
  z: number;
}

function towerLayout(g: Graph): Node3[] {
  const P = g.parts.length;
  const cells: Record<string, string[]> = {};
  for (const m of Object.values(g.byId)) (cells[`${m.part}|${g.layer[m.id]}`] ??= []).push(m.id);
  const R = 1;
  const H = 2.6 / Math.max(1, g.layers - 1);
  const out: Node3[] = [];
  g.parts.forEach((p, pi) => {
    const a0 = (2 * Math.PI * pi) / P;
    for (let L = 0; L < g.layers; L++) {
      const ids = cells[`${p.id}|${L}`] ?? [];
      ids.forEach((id, k) => {
        // spread a crowded cell across the part's sector and slightly outward
        const t = ids.length > 1 ? k / (ids.length - 1) - 0.5 : 0;
        const a = a0 + t * Math.min((1.8 * Math.PI) / P, 0.06 * ids.length);
        const r = R * (0.84 + 0.08 * (k % 3));
        out.push({ id, x: r * Math.cos(a), y: L * H - 1.3, z: r * Math.sin(a) });
      });
    }
  });
  return out;
}

function Tower({ g, state, focus, chain, onPick }: { g: Graph; state: Record<string, ModuleState>; focus: string | null; chain: { before: Set<string>; after: Set<string> } | null; onPick: (id: string) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const nodes = useMemo(() => towerLayout(g), [g]);
  const cam = useRef({ yaw: 0.6, pitch: 0.5, zoom: 1, spin: true });
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const proj = useRef<{ id: string; sx: number; sy: number }[]>([]);
  const live = useRef({ state, focus, chain, hover: null as string | null });
  live.current = { state, focus, chain, hover: hover?.id ?? null };

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) cam.current.spin = false;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const partAngle = g.parts.map((p, i) => ({ id: p.id, a: (2 * Math.PI * i) / g.parts.length, hue: (360 * i) / g.parts.length }));
    const hueOf = Object.fromEntries(g.parts.map((p, i) => [p.id, (360 * i) / g.parts.length]));
    let raf = 0;
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    const draw = () => {
      const css = getComputedStyle(cv);
      const v = (n: string) => css.getPropertyValue(n).trim() || "#888";
      const col = { done: v("--ok"), open: v("--accent"), locked: v("--line-strong"), ink: v("--ink"), muted: v("--muted"), grid: v("--grid-major"), paper: v("--paper"), blue: v("--blue") };
      const { yaw, pitch, zoom } = cam.current;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const scale = (Math.min(w, h * 1.1) / 3.1) * zoom;
      const P = (x: number, y: number, z: number) => {
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const f = 4 / (4 + z2);
        return { sx: w / 2 + x1 * scale * f, sy: h / 2 - y1 * scale * f, z: z2, f };
      };
      ctx.clearRect(0, 0, w, h);
      const { state, focus, chain, hover } = live.current;
      const lit = (id: string) => !chain || id === focus || chain.before.has(id) || chain.after.has(id);

      // layer rings and the axis
      const H = 2.6 / Math.max(1, g.layers - 1);
      ctx.lineWidth = 1;
      for (let L = 0; L < g.layers; L++) {
        ctx.beginPath();
        for (let i = 0; i <= 48; i++) {
          const a = (2 * Math.PI * i) / 48;
          const p = P(Math.cos(a), L * H - 1.3, Math.sin(a));
          i ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy);
        }
        ctx.strokeStyle = col.grid;
        ctx.globalAlpha = L % 5 === 0 ? 0.9 : 0.4;
        ctx.stroke();
        if (L % 5 === 0) {
          const p = P(-1.25, L * H - 1.3, 0);
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = col.muted;
          ctx.font = "10px var(--mono, monospace)";
          ctx.fillText(`L${L}`, p.sx, p.sy);
        }
      }
      // part labels around the base
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = col.ink;
      ctx.font = "10px var(--mono, monospace)";
      ctx.textAlign = "center";
      for (const { id, a, hue } of partAngle) {
        const p = P(1.24 * Math.cos(a), -1.45, 1.24 * Math.sin(a));
        if (p.z > 0.35) continue; // the far side would print over the near side
        ctx.fillStyle = `hsl(${hue} 55% 42%)`;
        ctx.fillText(id, p.sx, p.sy);
      }
      // edges: prerequisite to module
      const pr = Object.fromEntries(nodes.map((n) => [n.id, P(n.x, n.y, n.z)]));
      for (const n of nodes) {
        for (const q of g.byId[n.id].prereq ?? []) {
          const a = pr[q];
          if (!a || !byId[q]) continue;
          const b = pr[n.id];
          const on = chain && lit(n.id) && lit(q);
          ctx.globalAlpha = chain ? (on ? 0.9 : 0.03) : 0.06;
          ctx.strokeStyle = on ? col.blue : col.muted;
          ctx.lineWidth = on ? 1.4 : 0.8;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
      // nodes, far to near
      const order = nodes.map((n) => ({ n, p: pr[n.id] })).sort((a, b) => b.p.z - a.p.z);
      proj.current = order.map(({ n, p }) => ({ id: n.id, sx: p.sx, sy: p.sy }));
      for (const { n, p } of order) {
        const st = state[n.id];
        const r = (st === "open" ? 4.2 : 3.2) * p.f * Math.sqrt(zoom) + (n.id === focus ? 3 : 0);
        ctx.globalAlpha = lit(n.id) ? 1 : 0.12;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, 2 * Math.PI);
        const hue = hueOf[g.byId[n.id].part];
        ctx.fillStyle = st === "done" ? col.done : st === "open" ? col.open : `hsla(${hue}, 45%, 58%, 0.55)`;
        ctx.fill();
        ctx.lineWidth = n.id === focus || n.id === hover ? 2 : 0.8;
        ctx.strokeStyle = st === "locked" ? `hsl(${hue} 40% 40%)` : col.ink;
        ctx.stroke();
        if ((st === "open" || n.id === focus) && lit(n.id)) {
          ctx.fillStyle = col.ink;
          ctx.font = "600 10px var(--mono, monospace)";
          ctx.fillText(n.id, p.sx + r + 3, p.sy + 3);
        }
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "start";
    };

    const tick = () => {
      if (cam.current.spin && !live.current.focus) cam.current.yaw += 0.0025;
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // drag to rotate, wheel or pinch-less buttons to zoom, click to pick
    let drag: { x: number; y: number; moved: boolean } | null = null;
    const pick = (ev: PointerEvent | MouseEvent) => {
      const r = cv.getBoundingClientRect();
      const x = ev.clientX - r.left;
      const y = ev.clientY - r.top;
      let best: string | null = null;
      let bd = 12 * 12;
      for (const q of proj.current) {
        const d = (q.sx - x) ** 2 + (q.sy - y) ** 2;
        if (d <= bd) (bd = d), (best = q.id);
      }
      return { best, x, y };
    };
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, moved: false };
      cv.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        cam.current.yaw -= dx * 0.008;
        cam.current.pitch = Math.max(-0.2, Math.min(1.3, cam.current.pitch + dy * 0.006));
        cam.current.spin = false;
        drag.x = e.clientX;
        drag.y = e.clientY;
        return;
      }
      const { best, x, y } = pick(e);
      setHover((h) => (best ? (h?.id === best ? h : { id: best, x, y }) : null));
      cv.style.cursor = best ? "pointer" : "grab";
    };
    const up = (e: PointerEvent) => {
      if (drag && !drag.moved) {
        const { best } = pick(e);
        if (best) onPick(best);
      }
      drag = null;
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      cam.current.zoom = Math.max(0.6, Math.min(3, cam.current.zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointerleave", () => setHover(null));
    cv.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("wheel", wheel);
    };
  }, [g, nodes, onPick]);

  const hm = hover ? g.byId[hover.id] : null;
  return (
    <div className="rmp-tower">
      <canvas ref={canvas} role="img" aria-label="מפת השכבות בתלת־ממד: גובה הוא שכבה, כל חלק בכיוון משלו" />
      <div className="rmp-zoom">
        <button aria-label="התקרב" onClick={() => (cam.current.zoom = Math.min(3, cam.current.zoom * 1.2))}>
          +
        </button>
        <button aria-label="התרחק" onClick={() => (cam.current.zoom = Math.max(0.6, cam.current.zoom / 1.2))}>
          −
        </button>
        <button aria-label="סיבוב אוטומטי" onClick={() => (cam.current.spin = !cam.current.spin)}>
          ⟳
        </button>
      </div>
      {hm && hover && (
        <div className="rmp-tip" style={{ insetInlineStart: undefined, left: hover.x + 12, top: hover.y + 8 }}>
          <b dir="ltr">{hm.id}</b> {hm.title}
          <span>
            {STATE_LABEL[state[hm.id]]} · שכבה {g.layer[hm.id]}
          </span>
        </div>
      )}
    </div>
  );
}
