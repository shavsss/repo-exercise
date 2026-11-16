import { useMemo } from "react";
import { moduleState, type LibraryIndex, type Module } from "../library";
import type { ModuleProgress } from "../types";
import { TIER_LABEL, type Selection } from "./ModuleMap";
import "./roadmap.css";

/**
 * The learner's place on the course, for deciding what to study today:
 * - a strip of every module in study order, with "you are here";
 * - the module in progress and, beside it, open modules of other subjects that do not
 *   depend on it, so two different subjects can be learned on the same day;
 * - what finishing the current module opens, and the next modules in line with what
 *   each locked one still waits for.
 * index.modules is already in study order (the syllabus sorts it by the plan).
 */
type Step = "done" | "now" | "open" | "locked";

const STEP_LABEL: Record<Step, string> = { done: "נלמד", now: "בלמידה", open: "פתוח", locked: "נעול" };
const SECOND_SUBJECTS = 6;
const NEXT_IN_LINE = 8;

function started(p?: ModuleProgress) {
  return !!(p?.done?.length || Object.keys(p?.convs ?? {}).length);
}

export function Roadmap({ index, done, mods, onSelect }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void }) {
  const v = useMemo(() => {
    const byId = new Map(index.modules.map((m) => [m.id, m]));
    const part = new Map(index.parts.map((p) => [p.id, p.title]));
    const step = (m: Module): Step => {
      const s = moduleState(m, done);
      return s === "open" && started(mods[m.id]) ? "now" : s;
    };
    const steps = index.modules.map((m) => ({ m, s: step(m) }));
    const nowMods = steps
      .filter((x) => x.s === "now")
      .map((x) => x.m)
      .sort((a, b) => (mods[b.id]?.updatedAt ?? 0) - (mods[a.id]?.updatedAt ?? 0));
    // "here" is the module in progress, else the first open one in study order
    const here = nowMods[0] ?? steps.find((x) => x.s === "open")?.m;
    const hereAt = here ? index.modules.indexOf(here) : -1;
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
    const missing = (m: Module) => (m.prereq ?? []).filter((p) => byId.has(p) && !done.has(p));
    const unlocks = steps.filter((x) => x.s === "locked" && missing(x.m).length && missing(x.m).every((p) => busy.has(p))).map((x) => x.m);
    const nextInLine = steps.filter((x, i) => i > hereAt && x.s !== "done" && !busy.has(x.m.id)).slice(0, NEXT_IN_LINE);
    return { byId, part, steps, nowMods, here, hereAt, second, unlocks, nextInLine, missing, doneCount: steps.filter((x) => x.s === "done").length };
  }, [index, done, mods]);

  const open = (id: string) => onSelect({ moduleId: id });
  const partOf = (m: Module) => v.part.get(m.part) ?? m.part;

  return (
    <section className="roadmap">
      <div className="rmp-where">
        <p className="rmp-lead">
          נלמדו <b>{v.doneCount}</b> מתוך <b>{index.modules.length}</b> מודולים.
          {v.here ? (
            <>
              {" "}
              אתה ב-<bdi dir="ltr">{v.here.id}</bdi> {v.here.title}, מקום {v.hereAt + 1} בסדר הלימוד.
            </>
          ) : null}
        </p>
        <div className="rmp-strip" role="img" aria-label={`נלמדו ${v.doneCount} מתוך ${index.modules.length} מודולים`}>
          {v.steps.map(({ m, s }, i) => (
            <button key={m.id} tabIndex={-1} className={`rmp-cell st-${s}${i === v.hereAt ? " is-here" : ""}`} title={`${m.id} ${m.title} · ${STEP_LABEL[s]}`} aria-label={`${m.id} ${STEP_LABEL[s]}`} onClick={() => open(m.id)} />
          ))}
        </div>
        <ul className="rmp-legend">
          {(["done", "now", "open", "locked"] as Step[]).map((s) => (
            <li key={s} className={`st-${s}`}>
              {STEP_LABEL[s]}
            </li>
          ))}
          <li className="rmp-here-key">אתה כאן</li>
        </ul>
      </div>

      <div className="rmp-today">
        <div className="rmp-col">
          <h3 className="rmp-h">המודול הנוכחי</h3>
          {v.nowMods.length ? (
            <ul className="rmp-list">
              {v.nowMods.map((m) => (
                <Card key={m.id} m={m} subject={partOf(m)} mods={mods} step="now" onClick={() => open(m.id)} />
              ))}
            </ul>
          ) : (
            <p className="rmp-sub">אין מודול בלמידה. כל מודול פתוח מימין טוב להתחלה.</p>
          )}
        </div>
        <div className="rmp-col">
          <h3 className="rmp-h">מקצוע שני להיום</h3>
          <p className="rmp-sub">
            {v.nowMods.length
              ? `לא צריך לסיים את ${v.nowMods.map((m) => m.id).join(", ")} כדי להתחיל אותם: הם מתחום אחר ולא תלויים בו.`
              : "מודולים פתוחים, אחד מכל תחום, לפי סדר הלימוד."}
          </p>
          <ul className="rmp-list">
            {v.second.slice(0, SECOND_SUBJECTS).map((m) => (
              <Card key={m.id} m={m} subject={partOf(m)} mods={mods} step="open" onClick={() => open(m.id)} />
            ))}
          </ul>
          {v.second.length > SECOND_SUBJECTS && <p className="rmp-sub">ועוד {v.second.length - SECOND_SUBJECTS} תחומים פתוחים ברשימת המודולים.</p>}
        </div>
      </div>

      <div className="rmp-today">
        <div className="rmp-col">
          <h3 className="rmp-h">{v.nowMods.length ? `נפתח כשתסיים את ${v.nowMods.map((m) => m.id).join(", ")}` : "נפתח בהמשך"}</h3>
          {v.unlocks.length ? (
            <ul className="rmp-list">
              {v.unlocks.map((m) => (
                <Card key={m.id} m={m} subject={partOf(m)} mods={mods} step="locked" onClick={() => open(m.id)} />
              ))}
            </ul>
          ) : (
            <p className="rmp-sub">שום מודול לא מחכה רק לו.</p>
          )}
        </div>
        <div className="rmp-col">
          <h3 className="rmp-h">הבאים בתור במסלול</h3>
          <ol className="rmp-list rmp-line">
            {v.nextInLine.map(({ m, s }) => (
              <Card key={m.id} m={m} subject={partOf(m)} mods={mods} step={s} onClick={() => open(m.id)} wait={s === "locked" ? v.missing(m) : undefined} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Card({ m, subject, mods, step, wait, onClick }: { m: Module; subject: string; mods: Record<string, ModuleProgress>; step: Step; wait?: string[]; onClick: () => void }) {
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
          {wait?.length ? (
            <span className="rmp-wait">
              מחכה ל-<bdi dir="ltr">{wait.join(", ")}</bdi>
            </span>
          ) : null}
        </span>
        <span className={`tier tier-${m.tier}`}>{TIER_LABEL[m.tier]}</span>
        {p?.lessons?.length ? <span className="rmp-prog">{`${p.done?.length ?? 0}/${p.lessons.length}`}</span> : null}
      </button>
    </li>
  );
}
