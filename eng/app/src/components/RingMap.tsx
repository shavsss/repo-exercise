import { useMemo, useState } from "react";
import { moduleState, type LibraryIndex } from "../library";
import type { ModuleProgress } from "../types";
import { STATE_LABEL, TIER_LABEL, type Selection } from "./ModuleMap";

/** The rings of the course, from the middle out. */
const RINGS: { label: string; parts: string[] }[] = [
  { label: "עמוד השדרה", parts: ["P0", "P1", "P2", "P3"] },
  { label: "חמשת הצמתים", parts: ["P4", "P5", "P6", "P7", "P8", "P9", "P10"] },
  { label: "גשרים", parts: ["P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P27"] },
  { label: "פריפריה והעשרה", parts: ["P20", "P21", "P22", "P23", "P24", "P25", "P26"] },
];
const R = [24, 74, 128, 178];
const SIZE = 420;

/**
 * Overview map: the spine in the middle, the hubs around it, the bridges and the
 * periphery outside, with lines along the prerequisites between parts. Each part
 * shows how much of it is learned; clicking one lists its modules below.
 */
export function RingMap({ index, done, mods, onSelect }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void }) {
  const [part, setPart] = useState<string | null>(null);
  const partOf = useMemo(() => Object.fromEntries(index.modules.map((m) => [m.id, m.part])), [index]);
  const stats = useMemo(() => {
    const s: Record<string, { n: number; done: number; open: number }> = {};
    for (const m of index.modules) {
      const x = (s[m.part] ??= { n: 0, done: 0, open: 0 });
      x.n++;
      const st = moduleState(m, done);
      if (st === "done") x.done++;
      if (st === "open") x.open++;
    }
    return s;
  }, [index, done]);
  const pos = useMemo(() => {
    const p: Record<string, [number, number]> = {};
    RINGS.forEach((ring, ri) =>
      ring.parts.forEach((id, i) => {
        if (ri === 0) {
          const a = -Math.PI / 2 + (2 * Math.PI * i) / ring.parts.length;
          p[id] = [SIZE / 2 + R[0] * Math.cos(a), SIZE / 2 + R[0] * Math.sin(a)];
        } else {
          const a = -Math.PI / 2 + (2 * Math.PI * i) / ring.parts.length + (ri % 2 ? 0 : Math.PI / ring.parts.length);
          p[id] = [SIZE / 2 + R[ri] * Math.cos(a), SIZE / 2 + R[ri] * Math.sin(a)];
        }
      }),
    );
    return p;
  }, []);
  // links between parts: a module in one part that needs a module in another
  const links = useMemo(() => {
    const set = new Set<string>();
    for (const m of index.modules)
      for (const q of m.prereq ?? []) {
        const a = partOf[q];
        if (a && a !== m.part && pos[a] && pos[m.part]) set.add([a, m.part].sort().join("|"));
      }
    return [...set].map((k) => k.split("|"));
  }, [index, partOf, pos]);
  const title = (id: string) => index.parts.find((p) => p.id === id)?.title ?? id;
  const sel = part ? index.modules.filter((m) => m.part === part) : [];

  return (
    <section className="ringmap">
      <div className="ringmap-svg">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="מפת תוכנית הלימודים">
          {R.slice(1).map((r, i) => (
            <circle key={i} cx={SIZE / 2} cy={SIZE / 2} r={r} className="rm-ring" />
          ))}
          <g className="rm-links">
            {links.map(([a, b]) => (
              <line key={a + b} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} className={part && (a === part || b === part) ? "is-hot" : ""} />
            ))}
          </g>
          {Object.entries(pos).map(([id, [x, y]]) => {
            const s = stats[id];
            if (!s) return null;
            const ring = RINGS.findIndex((r) => r.parts.includes(id));
            const rad = ring === 0 ? 13 : ring === 1 ? 16 : 13;
            const f = s.done / s.n;
            const end = [x + rad * Math.sin(2 * Math.PI * f), y - rad * Math.cos(2 * Math.PI * f)];
            return (
              <g
                key={id}
                className={`rm-node ring-${ring} ${part === id ? "is-sel" : ""} ${s.open ? "has-open" : ""}`}
                onClick={() => setPart(part === id ? null : id)}
                role="button"
                tabIndex={0}
                aria-label={`${id} ${title(id)}: ${s.done} מתוך ${s.n} נלמדו`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setPart(part === id ? null : id))}
              >
                <title>{`${id} ${title(id)} · ${s.done}/${s.n}`}</title>
                <circle cx={x} cy={y} r={rad} className="rm-dot" />
                {f >= 1 ? <circle cx={x} cy={y} r={rad} className="rm-fill" /> : f > 0 ? <path d={`M${x} ${y - rad} A${rad} ${rad} 0 ${f > 0.5 ? 1 : 0} 1 ${end[0]} ${end[1]} L${x} ${y}Z`} className="rm-fill" /> : null}
                <text x={x} y={y + rad + 11} className="rm-label">
                  {id}
                </text>
              </g>
            );
          })}
        </svg>
        <ul className="ringmap-legend">
          {RINGS.map((r, i) => (
            <li key={i} className={`ring-${i}`}>
              <span className="rm-sw" />
              {r.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="ringmap-list">
        {part ? (
          <>
            <h3 className="ringmap-title">
              <bdi dir="ltr">{part}</bdi> {title(part)}
            </h3>
            <ul className="ringmap-mods">
              {sel.map((m) => {
                const st = moduleState(m, done);
                const p = mods[m.id];
                return (
                  <li key={m.id}>
                    <button className={`rm-mod st-${st}`} onClick={() => onSelect({ moduleId: m.id })}>
                      <span className="mod-id" dir="ltr">
                        {m.id}
                      </span>
                      <span className="mod-title">{m.title}</span>
                      <span className={`tier tier-${m.tier}`}>{TIER_LABEL[m.tier]}</span>
                      <span className={`state state-${st}`}>{p?.lessons?.length && st !== "done" ? `${p.done?.length ?? 0}/${p.lessons.length}` : STATE_LABEL[st]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="muted">לחץ על חלק במפה כדי לראות את המודולים שלו. הקווים מחברים חלקים שיש ביניהם דרישות מוקדמות, והמילוי הירוק הוא החלק שנלמד.</p>
        )}
      </div>
    </section>
  );
}
