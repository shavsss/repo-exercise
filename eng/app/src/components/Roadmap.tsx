import { useMemo, useState } from "react";
import { moduleState, type LibraryIndex, type Module } from "../library";
import type { ModuleProgress } from "../types";
import type { Selection } from "./ModuleMap";
import "./roadmap.css";

/**
 * The learner's road through the course, by stages (the syllabus parts):
 * 1. Where am I: the stages in study order as a road; each fills as its core modules are learned, and
 *    the current one carries the lab's own animation (a radar sweep or a signal wave).
 * 2. What else can I study today: open stages of other subjects, and what each builds on.
 * 3. The stage map: what each stage builds on (which stage, up to which module), what it opens, and
 *    the stages that are about to open ("3 more radar modules, up to M2.15, open electronic warfare").
 * index.modules is already in study order (the syllabus sorts it by the plan).
 */
type Step = "done" | "now" | "open" | "locked";
export type RoadMotif = "radar" | "wave";

const STEP_LABEL: Record<Step, string> = { done: "הושלם", now: "בלמידה", open: "פתוח", locked: "נעול" };
const PARALLEL = 6;
const SOON = 4;
const ROW = 96;
const COL_MIN = 150; // px: below this the map scrolls sideways instead of squeezing the names
// the syllabus's category prefix ("צומת 4:", "גשר:", ...) says nothing on the map
const shortTitle = (t: string) => t.replace(/^(צומת [^:]+|גשר|פריפריה|עמוד השדרה|שער): /, "");
// one colour per stage, for its number badge and the links that leave it (distinct in light and dark)
const PALETTE = ["#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4", "#0fa3b1", "#f032e6", "#9a6324", "#469990", "#b59f00", "#5a5ad6", "#d1495b", "#2a9d8f", "#e76f51", "#6a4c93"];
const colorOf = (v: Model, id: string) => PALETTE[v.list.findIndex((s) => s.id === id) % PALETTE.length];
const numOf = (v: Model, id: string) => v.list.findIndex((s) => s.id === id) + 1;

function started(p?: ModuleProgress) {
  return !!(p?.done?.length || Object.keys(p?.convs ?? {}).length);
}

type Need = { part: string; upTo: Module; missing: number };
type Stage = {
  id: string;
  title: string;
  core: Module[]; // the modules the stage requires (the rest is enrichment)
  extra: number;
  done: number;
  step: Step;
  next?: Module; // the first core module not yet learned
  needs: Need[]; // what is still missing before the next module opens, by stage
  from: Map<string, Module>; // stages it builds on → the last module it needs from each
  opens: string[];
  depth: number;
};

export function Roadmap({ index, done, mods, onSelect, motif }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void; motif: RoadMotif }) {
  const v = useMemo(() => {
    const byId = new Map(index.modules.map((m) => [m.id, m]));
    const pos = new Map(index.modules.map((m, i) => [m.id, i]));
    const title = new Map(index.parts.map((p) => [p.id, p.title]));
    const modStep = (m: Module): Step => {
      const s = moduleState(m, done);
      return s === "open" && started(mods[m.id]) ? "now" : s;
    };
    const anc = new Map<string, Set<string>>();
    const ancOf = (id: string): Set<string> => {
      const have = anc.get(id);
      if (have) return have;
      const out = new Set<string>();
      anc.set(id, out); // a cycle in the data stops here instead of looping
      for (const p of byId.get(id)?.prereq ?? []) {
        if (!byId.has(p)) continue;
        out.add(p);
        for (const x of ancOf(p)) out.add(x);
      }
      return out;
    };
    // stages in study order, by where their first core module sits
    const byPart = new Map<string, Module[]>();
    for (const m of index.modules) byPart.set(m.part, [...(byPart.get(m.part) ?? []), m]);
    const coreOf = (ms: Module[]) => (ms.some((m) => m.tier !== "ref") ? ms.filter((m) => m.tier !== "ref") : ms);
    const order = [...byPart.keys()].sort((a, b) => pos.get(coreOf(byPart.get(a)!)[0].id)! - pos.get(coreOf(byPart.get(b)!)[0].id)!);
    const rank = new Map(order.map((p, i) => [p, i]));
    const stages = new Map<string, Stage>();
    for (const pid of order) {
      const all = byPart.get(pid)!;
      const core = coreOf(all);
      const doneN = core.filter((m) => done.has(m.id)).length;
      const next = core.find((m) => !done.has(m.id));
      const steps = core.map(modStep);
      const step: Step = doneN === core.length ? "done" : steps.includes("now") || doneN > 0 ? "now" : next && modStep(next) === "open" ? "open" : "locked";
      // what is missing before the next module opens, grouped by stage, with the last module needed in each
      const needs = new Map<string, Need>();
      for (const a of next ? ancOf(next.id) : []) {
        if (done.has(a)) continue;
        const m = byId.get(a)!;
        const n = needs.get(m.part);
        if (!n) needs.set(m.part, { part: m.part, upTo: m, missing: 1 });
        else {
          n.missing++;
          if (pos.get(a)! > pos.get(n.upTo.id)!) n.upTo = m;
        }
      }
      // the stages it builds on: direct prerequisites of its core modules in stages earlier on the road
      const from = new Map<string, Module>();
      for (const m of core)
        for (const p of m.prereq ?? []) {
          const pm = byId.get(p);
          if (!pm || pm.part === pid || rank.get(pm.part)! > rank.get(pid)!) continue;
          const have = from.get(pm.part);
          if (!have || pos.get(p)! > pos.get(have.id)!) from.set(pm.part, pm);
        }
      stages.set(pid, { id: pid, title: title.get(pid) ?? pid, core, extra: all.length - core.length, done: doneN, step, next, needs: [...needs.values()].sort((a, b) => rank.get(a.part)! - rank.get(b.part)!), from, opens: [], depth: 0 });
    }
    for (const s of stages.values()) {
      for (const p of s.from.keys()) stages.get(p)!.opens.push(s.id);
      s.depth = Math.max(0, ...[...s.from.keys()].map((p) => stages.get(p)!.depth + 1));
    }
    const list = order.map((p) => stages.get(p)!);
    const busy = index.modules.filter((m) => modStep(m) === "now").sort((a, b) => (mods[b.id]?.updatedAt ?? 0) - (mods[a.id]?.updatedAt ?? 0));
    const here = busy[0] ?? index.modules.find((m) => modStep(m) === "open");
    const hereStage = here ? stages.get(here.part) : undefined;
    const parallel = list.filter((s) => s !== hereStage && (s.step === "open" || s.step === "now") && s.next && modStep(s.next) !== "locked").slice(0, PARALLEL);
    const soon = list
      .filter((s) => s.step === "locked" && s.needs.length)
      .map((s) => ({ s, missing: s.needs.reduce((n, x) => n + x.missing, 0) }))
      .sort((a, b) => a.missing - b.missing || rank.get(a.s.id)! - rank.get(b.s.id)!)
      .slice(0, SOON);
    const coreDone = list.reduce((n, s) => n + s.done, 0);
    const coreAll = list.reduce((n, s) => n + s.core.length, 0);
    return { stages, list, here, hereStage, parallel, soon, coreDone, coreAll, modStep };
  }, [index, done, mods]);

  const [selId, setSelId] = useState<string>();
  const sel = (selId && v.stages.get(selId)) || v.hereStage || v.list[0];
  const open = (m?: Module) => m && onSelect({ moduleId: m.id });
  const name = (pid: string) => v.stages.get(pid)?.title ?? pid;
  // what the stage's next module builds on outside the stage (all of it already learned, since it is open)
  const nextBase = (s: Stage) => {
    const parts = [...new Set((s.next?.prereq ?? []).map((p) => index.modules.find((m) => m.id === p)?.part).filter((p): p is string => !!p && p !== s.id))];
    return parts.length ? `נשען על מה שלמדת ב: ${parts.map(name).join(" · ")}` : "לא דורש שלב אחר";
  };

  // the road: each stage's share of the width is its number of core modules
  let acc = 0;
  const road = v.list.map((s) => {
    const at = acc;
    acc += s.core.length;
    return { s, at };
  });
  const hereAt = v.hereStage ? road.find((r) => r.s === v.hereStage)! : undefined;
  const herePct = hereAt ? ((hereAt.at + Math.min(hereAt.s.done + 0.5, hereAt.s.core.length)) / acc) * 100 : 0;

  return (
    <section className={`roadmap motif-${motif}`}>
      <div className="rmp-box">
        <h3 className="rmp-h">1. איפה אני</h3>
        <p className="rmp-lead">
          נלמדו <b>{v.coreDone}</b> מתוך <b>{v.coreAll}</b> מודולי חובה.
          {v.hereStage && v.here ? (
            <>
              {" "}
              אתה בשלב <b>{v.hereStage.title}</b> ({v.hereStage.done}/{v.hereStage.core.length}), במודול <bdi dir="ltr">{v.here.id}</bdi> {v.here.title}.
            </>
          ) : null}
        </p>
        <div className="rmp-road">
          {hereAt && (
            <span className="rmp-motif" style={{ right: `clamp(26px, ${herePct}%, calc(100% - 26px))` }} aria-hidden="true">
              {motif === "radar" ? <RadarMotif /> : <WaveMotif />}
            </span>
          )}
          <div className="rmp-lane">
            {hereAt && <span className="rmp-runner" style={{ ["--to" as string]: `${herePct}%` }} aria-hidden="true" />}
            {road.map(({ s }) => (
              <button key={s.id} className={`rmp-seg st-${s.step}${s === v.hereStage ? " is-here" : ""}${s === sel ? " is-sel" : ""}`} style={{ flexGrow: s.core.length }} title={`שלב ${numOf(v, s.id)}: ${s.title} · ${STEP_LABEL[s.step]} · ${s.done}/${s.core.length}`} onClick={() => setSelId(s.id)}>
                <span className="rmp-fill" style={{ width: `${(s.done / s.core.length) * 100}%` }} />
              </button>
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
      </div>

      <div className="rmp-box">
        <h3 className="rmp-h">2. מה עוד אפשר ללמוד היום, במקביל</h3>
        <p className="rmp-sub">
          {v.hereStage ? `שלבים מתחום אחר שכבר פתוחים: הם נשענים רק על מה שלמדת, ולא על ${v.hereStage.title}. אפשר לשלב אחד מהם באותו יום.` : "שלבים פתוחים, לפי סדר הלימוד."}
        </p>
        <ul className="rmp-list">
          {v.parallel.map((s) => (
            <li key={s.id}>
              <button className={`rmp-mod st-${s.step}`} onClick={() => open(s.next)}>
                <span className="rmp-dot" />
                <span className="rmp-body">
                  <span className="rmp-subject">
                    {s.title} · {s.done}/{s.core.length}
                  </span>
                  <span className="rmp-title">
                    <bdi dir="ltr" className="mod-id">
                      {s.next?.id}
                    </bdi>{" "}
                    {s.next?.title}
                  </span>
                  <span className="rmp-note">{nextBase(s)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rmp-box">
        <h3 className="rmp-h">3. מפת השלבים: מה נשען על מה</h3>
        {v.soon.length > 0 && (
          <ul className="rmp-soon">
            {v.soon.map(({ s }) => (
              <li key={s.id}>
                <button onClick={() => setSelId(s.id)}>
                  {s.needs.map((n, i) => (
                    <span key={n.part}>
                      {i > 0 && " + "}
                      עוד {n.missing} ב{name(n.part)} (עד <bdi dir="ltr">{n.upTo.id}</bdi>)
                    </span>
                  ))}
                  <span className="rmp-arrow"> ← נפתח: </span>
                  <b>{s.title}</b>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="rmp-sub">כל ריבוע הוא שלב, והפס בו מראה כמה ממודולי החובה נלמדו. מימין השלבים שהקורס נשען עליהם, ומשמאל מה שבא אחריהם. לחיצה על שלב מראה מה הוא צריך ומה הוא פותח.</p>
        <StageMap v={v} sel={sel} onSel={setSelId} />
        {sel && <StageCard s={sel} v={v} name={name} onSel={setSelId} onOpen={open} />}
      </div>
    </section>
  );
}

type Model = { stages: Map<string, Stage>; list: Stage[] };

/** Stages in columns by depth (right: what the course builds on), with links to the stages they open. */
function StageMap({ v, sel, onSel }: { v: Model; sel?: Stage; onSel: (id: string) => void }) {
  const { cols, height, nodes } = useMemo(() => {
    const cols: Stage[][] = [];
    for (const s of v.list) (cols[s.depth] ??= []).push(s);
    const height = Math.max(...cols.map((c) => c.length)) * ROW;
    const nodes = new Map<string, { c: number; y: number }>();
    cols.forEach((c, ci) => c.forEach((s, i) => nodes.set(s.id, { c: ci, y: (height - c.length * ROW) / 2 + i * ROW })));
    return { cols, height, nodes };
  }, [v]);
  const n = cols.length;
  const w = 100 / n;
  const gap = 0.9;
  const leftOf = (c: number) => (n - 1 - c) * w; // column 0 at the right (RTL)
  const near = (a: string, b: string) => !!sel && (a === sel.id || b === sel.id);
  return (
    <div className="rms-scroll">
    <div className="rms" style={{ height, minWidth: n * COL_MIN }}>
      <svg className="rms-links" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {v.list.flatMap((s) =>
          [...s.from.entries()].map(([p, upTo]) => {
            const a = nodes.get(p)!;
            const b = nodes.get(s.id)!;
            const x1 = leftOf(a.c) + gap;
            const x2 = leftOf(b.c) + w - gap;
            const mx = (x1 + x2) / 2;
            const met = v.stages.get(p)!.step === "done" || v.stages.get(p)!.core.findIndex((m) => m.id === upTo.id) < v.stages.get(p)!.done;
            return <path key={`${p}>${s.id}`} className={`rms-link${met ? " is-met" : ""}${near(p, s.id) ? " is-near" : ""}`} style={{ stroke: colorOf(v, p) }} d={`M${x1},${a.y + ROW / 2} C${mx},${a.y + ROW / 2} ${mx},${b.y + ROW / 2} ${x2},${b.y + ROW / 2}`} vectorEffect="non-scaling-stroke" />;
          }),
        )}
      </svg>
      {v.list.map((s) => {
        const p = nodes.get(s.id)!;
        return (
          <button key={s.id} className={`rms-node st-${s.step}${s === sel ? " is-sel" : ""}`} style={{ left: `${leftOf(p.c) + gap}%`, width: `${w - 2 * gap}%`, top: p.y + 6 }} onClick={() => onSel(s.id)} title={`${s.title} · ${STEP_LABEL[s.step]}`}>
            <span className="rms-num rms-corner" style={{ background: colorOf(v, s.id) }}>
              {numOf(v, s.id)}
            </span>
            <span className="rms-title">{shortTitle(s.title)}</span>
            <span className="rms-bar">
              <span style={{ width: `${(s.done / s.core.length) * 100}%` }} />
            </span>
            <span className="rms-count">
              {s.done}/{s.core.length} חובה · {STEP_LABEL[s.step]}
            </span>
          </button>
        );
      })}
    </div>
    </div>
  );
}

function StageCard({ s, v, name, onSel, onOpen }: { s: Stage; v: Model; name: (p: string) => string; onSel: (id: string) => void; onOpen: (m?: Module) => void }) {
  return (
    <div className={`rms-card st-${s.step}`}>
      <div className="rms-card-head">
        <span className="rms-num" style={{ background: colorOf(v, s.id) }}>
          {numOf(v, s.id)}
        </span>
        <h4>{s.title}</h4>
        <span className={`rms-chip st-${s.step}`}>{STEP_LABEL[s.step]}</span>
      </div>
      <p>
        {s.done} מתוך {s.core.length} מודולי חובה נלמדו{s.extra ? `, ועוד ${s.extra} מודולי העשרה ("שאר הספר") בסוף הדרך` : ""}.
      </p>
      {s.step === "locked" && s.needs.length > 0 && (
        <p>
          <b>כדי לפתוח:</b>{" "}
          {s.needs.map((n, i) => (
            <span key={n.part}>
              {i > 0 && " · "}
              <button className="rms-link-btn" onClick={() => onSel(n.part)}>
                {name(n.part)}
              </button>{" "}
              עד <bdi dir="ltr">{n.upTo.id}</bdi> (נשארו {n.missing})
            </span>
          ))}
        </p>
      )}
      <p>
        <b>נשען על:</b>{" "}
        {s.from.size
          ? [...s.from.entries()].map(([p, upTo], i) => (
              <span key={p}>
                {i > 0 && " · "}
                <button className="rms-link-btn" onClick={() => onSel(p)}>
                  {numOf(v, p)}. {name(p)}
                </button>{" "}
                עד <bdi dir="ltr">{upTo.id}</bdi>
              </span>
            ))
          : "שום שלב, אפשר להתחיל מיד"}
      </p>
      <p>
        <b>פותח את:</b>{" "}
        {s.opens.length
          ? s.opens.map((o, i) => (
              <span key={o}>
                {i > 0 && " · "}
                <button className="rms-link-btn" onClick={() => onSel(o)}>
                  {numOf(v, o)}. {name(o)}
                </button>
              </span>
            ))
          : "אין שלב שנשען עליו"}
      </p>
      {s.next && (
        <button className={`rms-go st-${s.step}`} onClick={() => onOpen(s.next)}>
          {s.step === "locked" ? "לצפייה במודול הבא" : s.done ? "להמשיך" : "להתחיל"}: <bdi dir="ltr">{s.next.id}</bdi> {s.next.title} ←
        </button>
      )}
    </div>
  );
}

/** Lanchester: a radar sweep with returning pulses. */
function RadarMotif() {
  return (
    <svg viewBox="0 0 44 44" className="rmp-radar">
      <circle className="rr-ring" cx="22" cy="22" r="20" />
      <circle className="rr-ring" cx="22" cy="22" r="12" />
      <circle className="rr-pulse" cx="22" cy="22" r="6" />
      <path className="rr-sweep" d="M22 22 L22 2 A20 20 0 0 1 39.3 12 Z" />
      <circle className="rr-blip" cx="31" cy="11" r="1.8" />
      <circle className="rr-hub" cx="22" cy="22" r="2.2" />
    </svg>
  );
}

/** Gilua: a signal running on an oscilloscope trace. */
function WaveMotif() {
  return (
    <svg viewBox="0 0 64 30" className="rmp-wave">
      <rect className="rw-screen" x="0.5" y="0.5" width="63" height="29" rx="4" />
      <g className="rw-trace">
        <path d="M-32 15 q4 -11 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" />
      </g>
    </svg>
  );
}
