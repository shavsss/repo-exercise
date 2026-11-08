import { useEffect, useMemo, useState } from "react";
import { moduleState, type LibraryIndex, type Module, type ModuleState } from "../library";
import type { ModuleProgress } from "../types";
import { Icon } from "./Icon";

export const STATE_LABEL: Record<ModuleState, string> = { done: "נלמד", open: "זמין", locked: "נעול" };
export const TIER_LABEL: Record<Module["tier"], string> = { core: "ליבה", adv: "מתקדם", ref: "עיון" };

export interface Selection {
  moduleId: string;
  /** lesson index; -1 = the module quiz; undefined = the module page */
  lesson?: number;
}

/** Lessons finished in a module (indices). */
export function lessonsDone(p: ModuleProgress | undefined) {
  return new Set(p?.done ?? []);
}

export function ModuleMap({
  index,
  done,
  progress,
  selection,
  onSelect,
  open,
  onClose,
}: {
  index: LibraryIndex;
  done: Set<string>;
  progress: Record<string, ModuleProgress>;
  selection: Selection | null;
  onSelect: (s: Selection) => void;
  open: boolean;
  onClose: () => void;
}) {
  const current = selection ? index.modules.find((m) => m.id === selection.moduleId) : undefined;
  const [openParts, setOpenParts] = useState<Set<string>>(() => new Set([current?.part ?? index.parts[0]?.id]));
  const [why, setWhy] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (current) setOpenParts((s) => (s.has(current.part) ? s : new Set([...s, current.part])));
  }, [current]);

  const byPart = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const map = new Map<string, Module[]>();
    for (const m of index.modules) {
      if (q && !`${m.id} ${m.title} ${m.en}`.toLowerCase().includes(q)) continue;
      map.set(m.part, [...(map.get(m.part) ?? []), m]);
    }
    return map;
  }, [index, filter]);

  const reveal = (id: string) => {
    const m = index.modules.find((x) => x.id === id);
    if (!m) return;
    setFilter("");
    setOpenParts((s) => new Set([...s, m.part]));
    setFlash(id);
    setTimeout(() => document.getElementById(`mod-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    setTimeout(() => setFlash(null), 1800);
  };

  const learned = index.modules.filter((m) => done.has(m.id)).length;

  return (
    <nav className={`sidebar ${open ? "is-open" : ""}`} aria-label="מפת המודולים">
      <div className="side-head">
        <div className="side-title">
          מפת המודולים
          <span className="side-count" dir="ltr">
            {learned}/{index.modules.length}
          </span>
        </div>
        <button className="icon-btn narrow-only" onClick={onClose} aria-label="סגור">
          <Icon name="close" />
        </button>
      </div>
      <input className="side-filter" type="search" placeholder="חיפוש מודול" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="חיפוש מודול" />
      <div className="side-scroll">
        {index.parts.map((part) => {
          const mods = byPart.get(part.id) ?? [];
          if (!mods.length) return null;
          const isOpen = openParts.has(part.id) || !!filter.trim();
          const partDone = mods.filter((m) => done.has(m.id)).length;
          return (
            <section key={part.id} className="part">
              <button
                className="part-head"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenParts((s) => {
                    const n = new Set(s);
                    if (n.has(part.id)) n.delete(part.id);
                    else n.add(part.id);
                    return n;
                  })
                }
              >
                <span className="part-id" dir="ltr">
                  {part.id}
                </span>
                <span className="part-title">{part.title}</span>
                <span className="part-count" dir="ltr">
                  {partDone}/{mods.length}
                </span>
              </button>
              {isOpen && (
                <ul className="mods">
                  {mods.map((m) => {
                    const st = moduleState(m, done);
                    const sel = selection?.moduleId === m.id;
                    const p = progress[m.id];
                    const missing = (m.prereq ?? []).filter((x) => !done.has(x));
                    return (
                      <li key={m.id} id={`mod-${m.id}`} className={`mod st-${st} ${sel ? "is-sel" : ""} ${flash === m.id ? "is-flash" : ""}`}>
                        <button
                          className="mod-row"
                          onClick={() => {
                            if (st === "locked") setWhy(why === m.id ? null : m.id);
                            else {
                              setWhy(null);
                              onSelect({ moduleId: m.id });
                            }
                          }}
                          aria-expanded={st === "locked" ? why === m.id : undefined}
                        >
                          <span className="mod-id" dir="ltr">
                            {m.id}
                          </span>
                          <span className="mod-title">{m.title}</span>
                          <span className={`state state-${st}`}>{STATE_LABEL[st]}</span>
                        </button>
                        <div className="mod-sub">
                          <span className={`tier tier-${m.tier}`}>{TIER_LABEL[m.tier]}</span>
                          {p?.lessons?.length ? (
                            <span dir="ltr">
                              {(p.done ?? []).length}/{p.lessons.length} שיעורים
                            </span>
                          ) : null}
                          {p?.quizScore && <span>מבחן {p.quizScore}</span>}
                        </div>
                        {why === m.id && (
                          <div className="why">
                            <Icon name="lock" size={14} />
                            <div>
                              המודול ייפתח אחרי שיילמדו:
                              <ul>
                                {missing.map((x) => {
                                  const pm = index.modules.find((y) => y.id === x);
                                  return (
                                    <li key={x}>
                                      <button className="link" onClick={() => reveal(x)}>
                                        <bdi dir="ltr">{x}</bdi> {pm?.title}
                                      </button>
                                      {pm && <span className={`state state-${moduleState(pm, done)}`}>{STATE_LABEL[moduleState(pm, done)]}</span>}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                        {sel && p?.lessons?.length ? (
                          <ol className="lessons">
                            {p.lessons.map((l, i) => {
                              const isDone = (p.done ?? []).includes(i);
                              return (
                                <li key={i}>
                                  <button className={`lesson-row ${selection?.lesson === i ? "is-sel" : ""}`} onClick={() => onSelect({ moduleId: m.id, lesson: i })}>
                                    <span className="lesson-no" dir="ltr">
                                      {i + 1}
                                    </span>
                                    <span className="lesson-title">{l.title}</span>
                                    {isDone && <Icon name="check" size={13} />}
                                  </button>
                                </li>
                              );
                            })}
                            <li>
                              <button className={`lesson-row quiz-row ${selection?.lesson === -1 ? "is-sel" : ""}`} onClick={() => onSelect({ moduleId: m.id, lesson: -1 })}>
                                <span className="lesson-no">
                                  <Icon name="quiz" size={13} />
                                </span>
                                <span className="lesson-title">מבחן מסכם</span>
                                {p.quizScore && <span className="quiz-score">{p.quizScore}</span>}
                              </button>
                            </li>
                          </ol>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </nav>
  );
}
