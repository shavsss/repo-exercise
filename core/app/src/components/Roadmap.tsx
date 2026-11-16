import { useEffect, useMemo, useState } from "react";
import { moduleState, type LibraryIndex, type Module } from "../library";
import type { ModuleProgress } from "../types";
import { TIER_LABEL, type Selection } from "./ModuleMap";
import "./roadmap.css";

/**
 * The learner's road through the course, answering three questions:
 * 1. Where am I: every module in study order as a road, with a "you are here" pin.
 * 2. What else can I study today: open modules of other subjects, each with the modules it builds on
 *    (already learned), so two subjects can be learned on the same day.
 * 3. What builds on what: an animated map around one module (what it builds on, what it opens),
 *    and the bottlenecks, the unlearned modules that most later modules wait for.
 * index.modules is already in study order (the syllabus sorts it by the plan).
 */
type Step = "done" | "now" | "open" | "locked";

const STEP_LABEL: Record<Step, string> = { done: "נלמד", now: "בלמידה", open: "פתוח", locked: "נעול" };
const SECOND_SUBJECTS = 6;
const NEXT_IN_LINE = 6;
const BOTTLENECKS = 6;
const PER_COLUMN = 6;
const ROW = 72;

function started(p?: ModuleProgress) {
  return !!(p?.done?.length || Object.keys(p?.convs ?? {}).length);
}

function useNarrow() {
  const q = "(max-width: 640px)";
  const [narrow, setNarrow] = useState(() => typeof matchMedia !== "undefined" && matchMedia(q).matches);
  useEffect(() => {
    const m = matchMedia(q);
    const on = () => setNarrow(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
}

export function Roadmap({ index, done, mods, onSelect }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void }) {
  const v = useMemo(() => {
    const byId = new Map(index.modules.map((m) => [m.id, m]));
    const part = new Map(index.parts.map((p) => [p.id, p.title]));
    const step = new Map<string, Step>();
    for (const m of index.modules) {
      const s = moduleState(m, done);
      step.set(m.id, s === "open" && started(mods[m.id]) ? "now" : s);
    }
    const steps = index.modules.map((m) => ({ m, s: step.get(m.id)! }));
    const nowMods = steps
      .filter((x) => x.s === "now")
      .map((x) => x.m)
      .sort((a, b) => (mods[b.id]?.updatedAt ?? 0) - (mods[a.id]?.updatedAt ?? 0));
    // "here" is the module in progress, else the first open one in study order
    const here = nowMods[0] ?? steps.find((x) => x.s === "open")?.m;
    const hereAt = here ? index.modules.indexOf(here) : -1;
    const prereqs = (m: Module) => (m.prereq ?? []).filter((p) => byId.has(p));
    const users = new Map<string, string[]>();
    for (const m of index.modules) for (const p of prereqs(m)) users.set(p, [...(users.get(p) ?? []), m.id]);
    // every module that waits for this one, directly or through others
    const reach = new Map<string, Set<string>>();
    const reachOf = (id: string): Set<string> => {
      const have = reach.get(id);
      if (have) return have;
      const out = new Set<string>();
      reach.set(id, out); // a cycle in the data stops here instead of looping
      for (const u of users.get(id) ?? []) {
        out.add(u);
        for (const x of reachOf(u)) out.add(x);
      }
      return out;
    };
    const waiting = new Map(index.modules.map((m) => [m.id, [...reachOf(m.id)].filter((x) => !done.has(x)).length]));
    const busyParts = new Set(nowMods.map((m) => m.part));
    // one open module per other subject: the first of that subject in study order
    const seen = new Set<string>();
    const second: Module[] = [];
    for (const { m, s } of steps) {
      if (s !== "open" || busyParts.has(m.part) || seen.has(m.part)) continue;
      seen.add(m.part);
      second.push(m);
    }
    const busy = new Set(nowMods.map((m) => m.id));
    const nextInLine = steps.filter((x, i) => i > hereAt && x.s !== "done" && !busy.has(x.m.id)).slice(0, NEXT_IN_LINE);
    const bottlenecks = index.modules
      .filter((m) => !done.has(m.id) && (waiting.get(m.id) ?? 0) > 0)
      .sort((a, b) => waiting.get(b.id)! - waiting.get(a.id)!)
      .slice(0, BOTTLENECKS);
    return { byId, part, step, steps, nowMods, here, hereAt, second, nextInLine, prereqs, users, waiting, bottlenecks, doneCount: steps.filter((x) => x.s === "done").length };
  }, [index, done, mods]);

  const [focusId, setFocusId] = useState<string>();
  const focus = (focusId && v.byId.get(focusId)) || v.here;
  const open = (id: string) => onSelect({ moduleId: id });
  const partOf = (m: Module) => v.part.get(m.part) ?? m.part;
  const hereRight = v.hereAt < 0 ? 0 : ((v.hereAt + 0.5) / index.modules.length) * 100;

  return (
    <section className="roadmap">
      <div className="rmp-box">
        <h3 className="rmp-h">1. איפה אני</h3>
        <p className="rmp-lead">
          נלמדו <b>{v.doneCount}</b> מתוך <b>{index.modules.length}</b> מודולים.
          {v.here ? (
            <>
              {" "}
              אתה ב-<bdi dir="ltr">{v.here.id}</bdi> {v.here.title}, תחנה {v.hereAt + 1} בדרך.
            </>
          ) : null}
        </p>
        <div className="rmp-road">
          {v.here && (
            <>
              {/* the label stays inside the road's width; its tip points at the module */}
              <span className="rmp-pin" style={{ right: `clamp(0px, calc(${hereRight}% - 32px), calc(100% - 64px))` }} aria-hidden="true">
                אתה כאן
              </span>
              <span className="rmp-tip" style={{ right: `${hereRight}%` }} aria-hidden="true" />
            </>
          )}
          <div className="rmp-strip" role="img" aria-label={`נלמדו ${v.doneCount} מתוך ${index.modules.length} מודולים`}>
            {v.steps.map(({ m, s }) => (
              <button key={m.id} tabIndex={-1} className={`rmp-cell st-${s}`} title={`${m.id} ${m.title} · ${STEP_LABEL[s]}`} aria-label={`${m.id} ${STEP_LABEL[s]}`} onClick={() => setFocusId(m.id)} />
            ))}
          </div>
        </div>
        <ul className="rmp-legend">
          {(["done", "now", "open", "locked"] as Step[]).map((s) => (
            <li key={s} className={`st-${s}`}>
              {STEP_LABEL[s]}
            </li>
          ))}
        </ul>
        {v.nextInLine.length > 0 && (
          <p className="rmp-next">
            הבאים בדרך:{" "}
            {v.nextInLine.map(({ m, s }) => (
              <button key={m.id} className={`rmp-chip st-${s}`} onClick={() => setFocusId(m.id)} title={m.title}>
                <bdi dir="ltr">{m.id}</bdi>
              </button>
            ))}
          </p>
        )}
      </div>

      <div className="rmp-box">
        <h3 className="rmp-h">2. מה עוד אפשר ללמוד היום, במקביל</h3>
        <p className="rmp-sub">
          {v.nowMods.length
            ? `כל מודול כאן נשען רק על מה שכבר למדת, ולא על ${v.nowMods.map((m) => m.id).join(", ")}. אפשר לשלב אותו באותו יום עם המודול הנוכחי.`
            : "מודולים פתוחים, אחד מכל תחום, לפי סדר הלימוד. כל אחד נשען רק על מה שכבר למדת."}
        </p>
        <ul className="rmp-list">
          {v.nowMods.map((m) => (
            <Card key={m.id} m={m} subject={partOf(m)} mods={mods} step="now" note="המודול הנוכחי" onClick={() => open(m.id)} />
          ))}
          {v.second.slice(0, SECOND_SUBJECTS).map((m) => (
            <Card key={m.id} m={m} subject={partOf(m)} mods={mods} step="open" note={v.prereqs(m).length ? `נשען על ${v.prereqs(m).join(", ")}, שכבר נלמדו` : "לא דורש מודול קודם"} onClick={() => open(m.id)} />
          ))}
        </ul>
        {v.second.length > SECOND_SUBJECTS && <p className="rmp-sub">ועוד {v.second.length - SECOND_SUBJECTS} תחומים פתוחים ברשימת המודולים.</p>}
      </div>

      <div className="rmp-box">
        <h3 className="rmp-h">3. מה נשען על מה</h3>
        <p className="rmp-sub">מימין: על מה המודול נשען. משמאל: מה הוא פותח. המספר הכתום: כמה מודולים שעוד לא נלמדו מחכים לו בהמשך. קו כתום: דרישה שעוד לא נלמדה. לחיצה על מודול מעבירה אליו את המפה, ולחיצה נוספת פותחת אותו.</p>
        {v.bottlenecks.length > 0 && (
          <p className="rmp-next">
            צווארי בקבוק:{" "}
            {v.bottlenecks.map((m) => (
              <button key={m.id} className={`rmp-chip st-${v.step.get(m.id)}`} onClick={() => setFocusId(m.id)} title={`${m.title}: ${v.waiting.get(m.id)} מודולים מחכים לו`}>
                <bdi dir="ltr">{m.id}</bdi> · {v.waiting.get(m.id)}
              </button>
            ))}
          </p>
        )}
        {focus && <Graph focus={focus} v={v} onFocus={setFocusId} onOpen={open} />}
      </div>
    </section>
  );
}

type Model = {
  byId: Map<string, Module>;
  step: Map<string, Step>;
  prereqs: (m: Module) => string[];
  users: Map<string, string[]>;
  waiting: Map<string, number>;
};

/** Columns around the focus, right to left: what its prerequisites build on, its prerequisites, the
 * module, what it opens, and what those open. Nodes slide to their new places when the focus moves. */
function Graph({ focus, v, onFocus, onOpen }: { focus: Module; v: Model; onFocus: (id: string) => void; onOpen: (id: string) => void }) {
  const narrow = useNarrow();
  const depth = narrow ? 1 : 2;
  const { cols, edges, height } = useMemo(() => {
    const shown = new Set([focus.id]);
    const byWait = (a: string, b: string) => (v.waiting.get(b) ?? 0) - (v.waiting.get(a) ?? 0);
    const next = (ids: string[], of: (id: string) => string[]) => {
      const out: string[] = [];
      for (const id of ids)
        for (const x of of(id))
          if (!shown.has(x)) {
            shown.add(x);
            out.push(x);
          }
      return out.sort(byWait);
    };
    const back = (id: string) => v.prereqs(v.byId.get(id)!);
    const fwd = (id: string) => v.users.get(id) ?? [];
    const right: string[][] = [];
    const left: string[][] = [];
    let a = [focus.id];
    let b = [focus.id];
    for (let d = 0; d < depth; d++) {
      a = next(a.slice(0, PER_COLUMN), back);
      b = next(b.slice(0, PER_COLUMN), fwd);
      right.unshift(a);
      left.push(b);
    }
    // column 0 is the rightmost: the deepest prerequisites
    const cols = [...right, [focus.id], ...left].map((c) => ({ ids: c.slice(0, PER_COLUMN), more: Math.max(0, c.length - PER_COLUMN) }));
    const slots = (c: { ids: string[]; more: number }) => c.ids.length + (c.more ? 1 : 0);
    const height = Math.max(1, ...cols.map(slots)) * ROW;
    const top = (ci: number, i: number) => (height - slots(cols[ci]) * ROW) / 2 + i * ROW;
    const pos = new Map<string, { c: number; y: number }>();
    cols.forEach((c, ci) => c.ids.forEach((id, i) => pos.set(id, { c: ci, y: top(ci, i) })));
    const edges: { key: string; c: number; y1: number; y2: number; blocking: boolean }[] = [];
    for (const [id, p] of pos)
      for (const q of v.prereqs(v.byId.get(id)!)) {
        const pq = pos.get(q);
        if (pq && pq.c === p.c - 1) edges.push({ key: `${q}>${id}`, c: pq.c, y1: pq.y + ROW / 2, y2: p.y + ROW / 2, blocking: v.step.get(q) !== "done" });
      }
    return { cols: cols.map((c, ci) => ({ ...c, top: (i: number) => top(ci, i) })), edges, height };
  }, [focus, v, depth]);

  const n = cols.length;
  const w = 100 / n; // column width, percent
  const gap = narrow ? 3 : 2; // percent kept free on each side of a node
  const leftOf = (ci: number) => (n - 1 - ci) * w; // column 0 at the right (RTL)
  const lonely = cols.every((c, ci) => ci === depth || !c.ids.length);
  return (
    <div className="rmg" style={{ height: height + 8 }}>
      <svg className="rmg-edges" viewBox={`0 0 100 ${height + 8}`} preserveAspectRatio="none" aria-hidden="true">
        {edges.map((e) => {
          const x1 = leftOf(e.c) + gap; // the prerequisite's left side
          const x2 = leftOf(e.c + 1) + w - gap; // the dependent's right side
          const mx = (x1 + x2) / 2;
          return <path key={e.key} className={`rmg-edge${e.blocking ? " is-blocking" : ""}`} d={`M${x1},${e.y1 + 4} C${mx},${e.y1 + 4} ${mx},${e.y2 + 4} ${x2},${e.y2 + 4}`} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {cols.flatMap((c, ci) => [
        ...c.ids.map((id, i) => {
          const m = v.byId.get(id)!;
          const s = v.step.get(id)!;
          const wait = v.waiting.get(id) ?? 0;
          const isFocus = id === focus.id;
          return (
            <button
              key={id}
              className={`rmg-node st-${s}${isFocus ? " is-focus" : ""}`}
              style={{ left: `${leftOf(ci) + gap}%`, width: `${w - 2 * gap}%`, top: c.top(i) + 8 }}
              title={`${m.id} ${m.title} · ${STEP_LABEL[s]}${wait ? ` · ${wait} מודולים מחכים לו` : ""}`}
              onClick={() => (isFocus ? onOpen(id) : onFocus(id))}
            >
              <span className="rmg-id">
                <bdi dir="ltr">{m.id}</bdi>
                {wait > 0 && <span className="rmg-wait">{wait}</span>}
                {isFocus && <span className="rmg-open">פתח ←</span>}
              </span>
              <span className="rmg-title">{m.title}</span>
            </button>
          );
        }),
        c.more > 0 && (
          <span key={`more-${ci}`} className="rmg-more" style={{ left: `${leftOf(ci) + gap}%`, width: `${w - 2 * gap}%`, top: c.top(c.ids.length) + 8 }}>
            ועוד {c.more}
          </span>
        ),
      ])}
      {lonely && <p className="rmg-alone">המודול הזה לא נשען על מודול אחר, ושום מודול לא נשען עליו.</p>}
    </div>
  );
}

function Card({ m, subject, mods, step, note, onClick }: { m: Module; subject: string; mods: Record<string, ModuleProgress>; step: Step; note?: string; onClick: () => void }) {
  const p = mods[m.id];
  return (
    <li>
      <button className={`rmp-mod st-${step}`} onClick={onClick}>
        <span className="rmp-dot" />
        <span className="rmp-body">
          <span className="rmp-subject">{subject}</span>
          <span className="rmp-title">
            <bdi dir="ltr" className="mod-id">
              {m.id}
            </bdi>{" "}
            {m.title}
          </span>
          {note && <span className="rmp-note">{note}</span>}
        </span>
        <span className={`tier tier-${m.tier}`}>{TIER_LABEL[m.tier]}</span>
        {p?.lessons?.length ? <span className="rmp-prog">{`${p.done?.length ?? 0}/${p.lessons.length}`}</span> : null}
      </button>
    </li>
  );
}
