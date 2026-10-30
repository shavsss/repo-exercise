import { useEffect, useState } from "react";
import type { Runtime } from "../runtime";
import type { ModuleProgress } from "../types";
import { dayKey, dayTitle, gatherRecall, lastDay, morningSkipped, rememberedSelection, skipMorning, stopOf, useDay, type DayDoc, type DayStop, type RecallQuestion } from "../day";
import { Markdown } from "./Markdown";
import { getDeck, gradeCard, queueOf, type Deck } from "../review/deck";
import { estSec, minutesLabel } from "../review/cards";
import { whenLabel, type Rating } from "../review/fsrs";
import { GRADES } from "../review/Review";
import { play } from "../sound";
import "../flow.css";

/** a morning question; from the review queue when it has a card id (graded here as in the review tab) */
type MorningQ = RecallQuestion & { cardId?: string };

// One card on the home screen (docs/research/round5/ux, r5-morning; proto_day.html#warm): where he stopped, two
// questions (the first due cards of the review queue, src/review/; else his recent lessons' think questions and keep
// lines), and the step he wrote when he closed the day. Nothing is generated in the morning, so it never waits for a model. Skipped with one click
// for the day (N4). Identical in both labs.

function when(ts: number) {
  const d = new Date(ts);
  const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const key = dayKey(d);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return key === dayKey() ? `היום ב-${hm}` : key === dayKey(y) ? `אתמול ב-${hm}` : `ב-${d.getDate()}.${d.getMonth() + 1}, ${hm}`;
}

export function MorningCard({
  rt,
  modules,
  mods,
  onGo,
  onReview,
}: {
  rt: Runtime | null;
  modules: { id: string; title: string }[];
  mods: Record<string, ModuleProgress>;
  onGo: (s: { moduleId: string; lesson?: number }) => void;
  /** opens the review tab */
  onReview?: () => void;
}) {
  useDay();
  const [day, setDay] = useState<DayDoc | null | undefined>(undefined);
  const [recall, setRecall] = useState<MorningQ[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [graded, setGraded] = useState<Record<number, number>>({});
  const [openedAt, setOpenedAt] = useState<Record<number, number>>({});
  const hasMods = Object.keys(mods).length > 0;

  useEffect(() => {
    const store = rt?.store;
    if (!store || !hasMods) return;
    let alive = true;
    (async () => {
      const d = await lastDay(store).catch(() => null);
      if (!alive) return;
      setDay(d);
      // the review queue first: its first due cards are the morning's questions
      const dk = await getDeck(store, mods).catch(() => null);
      if (!alive) return;
      setDeck(dk);
      const fromDeck: MorningQ[] = dk ? queueOf(dk).cards.slice(0, 2).map((c) => ({ q: c.ask || c.front, a: c.back, src: c.src, cardId: c.id })) : [];
      const q = fromDeck.length >= 2 ? [] : d?.recall?.length ? d.recall : await gatherRecall(store, mods).catch(() => []);
      if (alive) setRecall([...fromDeck, ...q.filter((x) => !fromDeck.some((f) => f.q === x.q))].slice(0, 2));
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
  // what is left of today's review after the morning questions, as a calm estimate (never a count, N5)
  const rest = deck ? queueOf(deck).cards.filter((c) => !recall.some((q) => q.cardId === c.id)) : [];
  const restSec = rest.reduce((s, c) => s + estSec(c), 0);

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
          <span className="flow-kicker">{recall[0]?.cardId ? (recall.length > 1 ? "שתי שאלות מהחזרה, לפני שממשיכים" : "שאלה מהחזרה, לפני שממשיכים") : recall.length > 1 ? "שתי שאלות מהשיעורים האחרונים, לפני שממשיכים" : "שאלה מהשיעור האחרון, לפני שממשיכים"}</span>
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
                <button className="btn small" onClick={() => (setOpen([...open, i]), setOpenedAt({ ...openedAt, [i]: Date.now() }))}>
                  חשבתי. הצג תשובה
                </button>
              )}
              {open.includes(i) &&
                q.cardId &&
                rt?.store &&
                deck &&
                (graded[i] ? (
                  <span className="flow-src">נרשם. הכרטיס יחזור {whenLabel(graded[i], Date.now())}.</span>
                ) : (
                  <div className="rv-mini" data-silent role="group" aria-label="כמה זכרת">
                    {GRADES.map(({ g, label }) => (
                      <button
                        key={g}
                        className="btn small"
                        onClick={async () => {
                          play(g >= 3 ? "right" : "click");
                          // the thinking before the answer is not measured here: about 15 seconds are added
                          const sec = (Date.now() - (openedAt[i] ?? Date.now())) / 1000 + 15;
                          const c = await gradeCard(rt.store!, deck, q.cardId!, g as Rating, sec);
                          if (c) setGraded((x) => ({ ...x, [i]: c.due }));
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ))}
              {q.src && <span className="flow-src">מתוך {q.src}</span>}
            </div>
          ))}
        </div>
      )}
      {onReview && rest.length > 0 && (
        <div className="flow-review">
          <span className="flow-kicker">חזרה להיום, {minutesLabel(restSec)}</span>
          <button className="btn small" onClick={onReview}>
            לחזרה
          </button>
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
