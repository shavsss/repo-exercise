// The review tab (NIGHT_PLAN P2-A): one card per screen, front → "הצג תשובה" → four grades, built for the phone hour
// at 400 px (big targets at the bottom, within the thumb's reach, no horizontal scroll). About 25 minutes a day;
// what is left waits for the next days and is never shown as a number (F2 anti-nag N1, N4, N5, N8: a calm
// line, never a lock). Same file in both labs.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Markdown } from "../components/Markdown";
import { LAB } from "../labtabs/config";
import type { LabTabProps } from "../labtabs/LabTabs";
import { play } from "../sound";
import { addMinutes, getDeck, gradeCard, onDeck, patchCard, queueOf, type Deck } from "./deck";
import { minutesLabel, estSec, type Card, type CardKind } from "./cards";
import { preview, whenLabel, type Rating } from "./fsrs";
import "./review.css";

const KIND: Record<CardKind, string> = { keep: "לסיכום", keepAll: "לסיכום", def: "הגדרה", formula: "נוסחה", think: "שאלה מהשיעור", note: "הפתק שלך" };
export const GRADES: { g: Rating; label: string }[] = [
  { g: 1, label: "שכחתי" },
  { g: 2, label: "קשה" },
  { g: 3, label: "טוב" },
  { g: 4, label: "קל" },
];

/** the quick model's retrieval question for a card whose front is generic ("נסח לי שאלה") */
export async function askFor(sample: NonNullable<LabTabProps["rt"]>["sample"], c: Card) {
  if (!sample) return "";
  const prompt = `כתוב שאלת שליפה אחת, קצרה וממוקדת, בעברית, שהתשובה עליה היא הטקסט שבתגית <answer>. השאלה צריכה לבקש לשחזר את העיקר (נוסחה, הגדרה ותנאי תקפות, או מנגנון), בלי לרמוז על התשובה ובלי לצטט אותה. סימנים מתמטיים ב-$...$. החזר רק את השאלה, בשורה אחת.\n\n<context>${c.src}</context>\n<answer>\n${c.back}\n</answer>`;
  const res = await sample(prompt, { modelTier: "quick", effort: "low", cache: false });
  return (res.text.trim().split("\n").find((l) => l.trim()) ?? "").replace(/^#+\s*|^\*\*|\*\*$/g, "").trim().slice(0, 400);
}

type Phase = "loading" | "card" | "back" | "end";

export function ReviewTab({ lab, rt, onOpenModule }: LabTabProps) {
  const store = rt?.store ?? null;
  const cfg = LAB[lab];
  const [deck, setDeck] = useState<Deck | null>(null);
  const [, setTick] = useState(0);
  const [queue, setQueue] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [doneNow, setDoneNow] = useState({ n: 0, sec: 0 });
  const [asking, setAsking] = useState(false);
  const [err, setErr] = useState("");
  const shownAt = useRef(Date.now());
  const total = useRef(0);
  const gradedId = useRef("");

  const start = useCallback((d: Deck) => {
    const q = queueOf(d);
    setQueue(q.cards);
    total.current = q.cards.length;
    setPhase(q.cards.length ? "card" : "end");
    shownAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!store) return;
    let live = true;
    getDeck(store, undefined, true)
      .then((d) => {
        if (!live) return;
        setDeck(d);
        start(d);
      })
      .catch(() => live && (setErr("הכרטיסים לא נטענו. אפשר לרענן את הדף."), setPhase("end")));
    const off = onDeck(() => setTick((t) => t + 1));
    return () => {
      live = false;
      off();
    };
  }, [store, start]);

  const card = queue[0] ? (deck?.cards.get(queue[0].id) ?? queue[0]) : null;
  const now = Date.now();
  const nexts = useMemo(() => (card ? preview(card, Date.now(), card.id) : null), [card]);

  const reveal = useCallback(() => setPhase((p) => (p === "card" ? "back" : p)), []);
  const grade = useCallback(
    async (g: Rating) => {
      // a second tap before the next card shows grades nothing
      if (!store || !deck || !card || phase !== "back" || gradedId.current === card.id + card.reps) return;
      gradedId.current = card.id + card.reps;
      const sec = (Date.now() - shownAt.current) / 1000;
      play(g >= 3 ? "right" : "click");
      const next = await gradeCard(store, deck, card.id, g, sec);
      setDoneNow((d) => ({ n: d.n + 1, sec: d.sec + Math.min(240, sec) }));
      let rest = queue.slice(1);
      // forgotten: back in this session after two other cards (one correct retrieval per session)
      if (next?.relearn) rest = [...rest.slice(0, 2), next, ...rest.slice(2)];
      setQueue(rest);
      shownAt.current = Date.now();
      if (rest.length) setPhase("card");
      else {
        setPhase("end");
        play("done");
      }
    },
    [store, deck, card, phase, queue],
  );

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable='true'], math-field")) return;
      if (phase === "card" && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        reveal();
      } else if (phase === "back" && /^[1-4]$/.test(e.key)) grade(Number(e.key) as Rating);
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [phase, reveal, grade]);

  const head = (
    <div className="rv-head">
      <div className="lt-kicker">{cfg.name} · חזרה</div>
      <h1>חזרה</h1>
    </div>
  );

  if (!store)
    return (
      <div className="lt-wrap rv-wrap">
        {head}
        <p className="lt-empty">כרטיסי החזרה נשמרים בחשבון שלך ב-claude.ai, ויופיעו כאן כשהדף פתוח שם עם הרשאת כתיבה.</p>
      </div>
    );

  if (phase === "loading")
    return (
      <div className="lt-wrap rv-wrap">
        {head}
        <p className="rv-calm">מכין את הכרטיסים מהשיעורים שקראת…</p>
      </div>
    );

  if (phase === "end" || !card) {
    const all = deck ? [...deck.cards.values()].filter((c) => !c.off) : [];
    const q = deck ? queueOf(deck) : null;
    const nextDue = all.filter((c) => c.reps > 0 || c.due > now).reduce((m, c) => Math.min(m, c.due), Infinity);
    return (
      <div className="lt-wrap rv-wrap">
        {head}
        <section className="rv-end" aria-live="polite">
          {err ? (
            <p>{err}</p>
          ) : !all.length ? (
            <>
              <p className="rv-big">הכרטיסים יופיעו כאן אחרי השיעור הראשון.</p>
              <p className="rv-calm">הכרטיסים נבנים לבד מהשיעורים שקראת: שורות «לסיכום», הגדרות ונוסחאות מרכזיות, שאלות שטעית בהן או ניחשת, והפתקים שלך בשוליים. כל כרטיס מגיע מהיום שאחרי השיעור, אחרי לילה של שינה.</p>
            </>
          ) : doneNow.n > 0 ? (
            <>
              <p className="rv-big">החזרה של עכשיו נגמרה.</p>
              <p className="rv-calm">
                {doneNow.n === 1 ? "כרטיס אחד" : `${doneNow.n} כרטיסים`}, {minutesLabel(doneNow.sec)}. {Number.isFinite(nextDue) ? `הכרטיס הבא: ${whenLabel(nextDue, now)}.` : ""}
              </p>
            </>
          ) : q?.rested ? (
            <>
              <p className="rv-big">לחזרה של היום הספיק.</p>
              <p className="rv-calm">מה שנשאר מחכה לימים הבאים, והסדר נשמר לפי מה שהכי קרוב להישכח.</p>
            </>
          ) : (
            <>
              <p className="rv-big">החזרה של היום מעודכנת.</p>
              <p className="rv-calm">{Number.isFinite(nextDue) ? `הכרטיס הבא: ${whenLabel(nextDue, now)}.` : ""}</p>
            </>
          )}
          <div className="rv-end-actions">
            {q && q.cards.length > 0 && !q.rested && (
              <button className="btn primary" onClick={() => deck && start(deck)}>
                עוד סבב, {minutesLabel(q.sec)}
              </button>
            )}
            {q?.rested && deck && (
              <button
                className="btn"
                onClick={async () => {
                  await addMinutes(store, deck, 5);
                  start(deck);
                }}
              >
                עוד 5 דקות בכל זאת
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }

  const leftSec = queue.reduce((s, c) => s + estSec(c), 0);
  const pos = Math.max(0, total.current - queue.length);
  const generic = card.kind !== "think" && card.kind !== "note";
  return (
    <div className="lt-wrap rv-wrap rv-session">
      <div className="rv-top">
        <span className="lt-kicker">{cfg.name} · חזרה</span>
        <span className="rv-left">{minutesLabel(leftSec)}</span>
      </div>
      <div className="rv-bar" aria-hidden="true">
        <i style={{ width: `${total.current ? Math.min(100, (pos / Math.max(total.current, pos + queue.length)) * 100) : 0}%` }} />
      </div>
      <article className={`rv-card k-${card.kind}`} key={card.id + card.reps}>
        <div className="rv-meta">
          <span className="rv-kind">{KIND[card.kind]}</span>
          <button className="link rv-src" onClick={() => onOpenModule(card.moduleId)} title="לשיעור">
            {card.src}
          </button>
        </div>
        <div className="rv-front">
          <Markdown text={card.ask || card.front} />
          {card.ask && <div className="rv-orig">{card.front}</div>}
        </div>
        {generic && !card.ask && rt?.sample && phase === "card" && (
          <button
            className="link rv-ask"
            disabled={asking}
            onClick={async () => {
              setAsking(true);
              try {
                const ask = await askFor(rt.sample, card);
                if (ask && deck) await patchCard(store, deck, card.id, { ask });
              } catch {
                // the card's own question stays
              }
              setAsking(false);
            }}
          >
            {asking ? "מנסח…" : "נסח לי שאלה"}
          </button>
        )}
        {phase === "back" && (
          <div className="rv-back">
            <Markdown text={card.back} />
          </div>
        )}
      </article>
      <div className="rv-dock">
        {phase === "card" ? (
          <button className="btn primary rv-reveal" onClick={reveal}>
            הצג תשובה
          </button>
        ) : (
          <div className="rv-grades" data-silent role="group" aria-label="כמה זכרת">
            {GRADES.map(({ g, label }) => (
              <button key={g} className={`rv-grade g${g}`} onClick={() => grade(g)}>
                <b>{label}</b>
                <small>{nexts ? whenLabel(nexts[g], now) : ""}</small>
              </button>
            ))}
          </div>
        )}
        <div className="rv-foot">
          <button
            className="link"
            onClick={async () => {
              if (!deck) return;
              await patchCard(store, deck, card.id, { off: true });
              const rest = queue.slice(1);
              setQueue(rest);
              setPhase(rest.length ? "card" : "end");
              shownAt.current = Date.now();
            }}
          >
            הוצא את הכרטיס מהחזרה
          </button>
        </div>
      </div>
    </div>
  );
}
