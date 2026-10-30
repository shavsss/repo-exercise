import { useEffect, useState } from "react";
import type { Runtime } from "../runtime";
import type { ModuleProgress } from "../types";
import { dayKey, dayTitle, gatherRecall, lastDay, morningSkipped, rememberedSelection, skipMorning, stopOf, useDay, type DayDoc, type DayStop, type RecallQuestion } from "../day";
import { Markdown } from "./Markdown";
import "../flow.css";

// One card on the home screen (docs/research/round5/ux, r5-morning; proto_day.html#warm): where he stopped, two
// questions from his recent lessons (their think questions, else their keep lines), and the step he wrote when he
// closed the day. Nothing is generated in the morning, so it never waits for a model. Skipped with one click
// for the day (N4). Identical in both labs.

function when(ts: number) {
  const d = new Date(ts);
  const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const key = dayKey(d);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return key === dayKey() ? `היום ב-${hm}` : key === dayKey(y) ? `אתמול ב-${hm}` : `ב-${d.getDate()}.${d.getMonth() + 1}, ${hm}`;
}

export function MorningCard({ rt, modules, mods, onGo }: { rt: Runtime | null; modules: { id: string; title: string }[]; mods: Record<string, ModuleProgress>; onGo: (s: { moduleId: string; lesson?: number }) => void }) {
  useDay();
  const [day, setDay] = useState<DayDoc | null | undefined>(undefined);
  const [recall, setRecall] = useState<RecallQuestion[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const hasMods = Object.keys(mods).length > 0;

  useEffect(() => {
    const store = rt?.store;
    if (!store || !hasMods) return;
    let alive = true;
    (async () => {
      const d = await lastDay(store).catch(() => null);
      if (!alive) return;
      setDay(d);
      const q = d?.recall?.length ? d.recall : await gatherRecall(store, mods).catch(() => []);
      if (alive) setRecall(q.slice(0, 2));
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rt, hasMods]);

  if (morningSkipped() || day === undefined) return null;
  const stop: DayStop | null = day?.stop ?? stopOf(rememberedSelection(), modules, mods);
  const next = day?.next;
  if (!stop && !recall.length && !next) return null;

  return (
    <section className="flow-morning" aria-label="פתיחת היום">
      <div className="flow-morning-head">
        <span className="flow-kicker">{dayTitle()}</span>
        <button className="link flow-skip" onClick={skipMorning}>
          דלג להיום
        </button>
      </div>
      {stop && (
        <div className="flow-where">
          <span>
            עצרת ב-<b>{stop.label}</b>
          </span>
          <button className="btn small" onClick={() => onGo({ moduleId: stop.moduleId, ...(stop.lesson !== undefined ? { lesson: stop.lesson } : {}) })}>
            קח אותי לשם
          </button>
        </div>
      )}
      {recall.length > 0 && (
        <div className="flow-mq">
          <span className="flow-kicker">{recall.length > 1 ? "שתי שאלות מהשיעורים האחרונים, לפני שממשיכים" : "שאלה מהשיעור האחרון, לפני שממשיכים"}</span>
          {recall.map((q, i) => (
            <div key={i} className="flow-q">
              <span className="flow-n">
                {i + 1}/{recall.length}
              </span>
              <Markdown text={q.q} />
              {open.includes(i) ? (
                <div className="flow-a">
                  <Markdown text={q.a} />
                </div>
              ) : (
                <button className="btn small" onClick={() => setOpen([...open, i])}>
                  חשבתי. הצג תשובה
                </button>
              )}
              {q.src && <span className="flow-src">מתוך {q.src}</span>}
            </div>
          ))}
        </div>
      )}
      {next && (
        <div className="flow-step">
          <span className="flow-kicker">הצעד שכתבת{day?.closedAt ? ` ${when(day.closedAt)}` : ""}</span>
          <q>{next}</q>
        </div>
      )}
    </section>
  );
}
