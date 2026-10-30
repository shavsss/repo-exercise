import { useEffect, useMemo, useRef, useState } from "react";
import type { Runtime } from "../runtime";
import type { LessonSpec, StoredMessage } from "../types";
import type { PartPlan } from "../tutor";
import { recallFrom } from "../day";
import { Markdown } from "./Markdown";
import "../flow.css";

// While a lesson is written (docs/research/round5/ux, r5-plan-wait and r5-stream): instead of a spinner, the
// lesson's plan and one question to think about. While the tutor plans: what the lesson covers, then the parts as
// soon as the plan exists, and a pre-question (asking before learning helps keep what was asked). While a part is
// written: a calm line with the part and one question from the part before it. Nothing moves and nothing loops.
// Identical in both labs.

const PRE_MODEL = "claude-haiku-5-5";
const asked = new Map<string, string>();

function fallbackQuestion(spec: LessonSpec | undefined) {
  return spec ? `לפני שהשיעור נפתח: מה לדעתך יהיה הרעיון המרכזי ב«${spec.title}», ולמה? משפט אחד מספיק, בראש או על דף.` : "לפני שהשיעור נפתח: מה אתה כבר יודע על הנושא, ומה היית רוצה שיוסבר?";
}

/** one short pre-question for the lesson, from the quick model; a fixed one when it is not there */
function usePreQuestion(rt: Runtime | null, lessonKey: string, spec: LessonSpec | undefined, moduleTitle: string) {
  const [q, setQ] = useState(() => asked.get(lessonKey) ?? "");
  useEffect(() => {
    if (asked.has(lessonKey)) return setQ(asked.get(lessonKey)!);
    const fixed = fallbackQuestion(spec);
    if (!rt?.sample || !spec) {
      setQ(fixed);
      return;
    }
    const c = new AbortController();
    const prompt = `A learner is about to read a lesson in an engineering course (in Hebrew). Lesson: «${spec.title}» in the module «${moduleTitle}». It covers: ${spec.covers.join("; ")}. ${spec.focus ?? ""}
Write ONE pre-question in Hebrew that he answers in a sentence from intuition before reading: ask him to predict or estimate something central the lesson will teach (a trend, an order of magnitude, which of two options, why something is hard). Engineering register only. At most 30 words. Reply with the question only.`;
    rt.sample([{ role: "user", content: prompt }], { model: PRE_MODEL, modelTier: "quick", effort: "low", cache: false, signal: c.signal })
      .then((r) => {
        const t = r.text.trim().replace(/^["«]|["»]$/g, "");
        const ok = t.length > 10 && t.length < 400 && /\?/.test(t);
        asked.set(lessonKey, ok ? t : fixed);
        setQ(ok ? t : fixed);
      })
      .catch(() => !c.signal.aborted && setQ(fixed));
    setQ(fixed);
    return () => c.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonKey, rt]);
  return q;
}

const words = (s: string) => (s.match(/[^\s]+/g) ?? []).length;

export function WaitPanel({ rt, live, spec, lessonKey, moduleTitle }: { rt: Runtime | null; live: StoredMessage; spec: LessonSpec | undefined; lessonKey: string; moduleTitle: string }) {
  const plan = live.plan as PartPlan | undefined;
  const partsDone = live.partsDone ?? 0;
  const text = live.text ?? "";
  const pre = usePreQuestion(rt, lessonKey, spec, moduleTitle);
  // where the part being written began, so the question comes from the part before it
  const partStart = useRef<{ k: number; at: number }>({ k: -1, at: 0 });
  if (partStart.current.k !== partsDone) partStart.current = { k: partsDone, at: text.length };
  const fromPrev = useMemo(() => {
    if (!partsDone) return null;
    const { think } = recallFrom(text.slice(0, partStart.current.at), "");
    return think.at(-1) ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partsDone, partStart.current.at]);
  const [shown, setShown] = useState("");

  const writing = plan ? plan.parts[partsDone] : undefined;
  const partWords = writing ? Math.max(0, words(text) - words(text.slice(0, partStart.current.at))) : 0;
  const target = writing?.words ?? 1100;
  const question = fromPrev ? { q: fromPrev.q, a: fromPrev.a, k: "מהחלק הקודם" } : { q: pre, a: "", k: "שאלה מקדימה" };

  return (
    <aside className="flow-wait" aria-live="polite">
      {!plan ? (
        <>
          <div className="flow-kicker">השיעור נכתב · קודם תכנון וחישובים, אחר כך חלק אחרי חלק</div>
          {spec && (
            <>
              <div className="flow-wait-title">{spec.title}</div>
              <ul className="flow-wait-covers">
                {spec.covers.slice(0, 8).map((c, i) => (
                  <li key={i} dir="auto">
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flow-kicker">
            {writing ? `חלק ${partsDone + 1} מתוך ${plan.parts.length} נכתב` : "השיעור נכתב עד הסוף"}
            {writing && <span> · {writing.title}</span>}
          </div>
          {writing && (
            <div className="flow-bar" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(partWords, target)} aria-label="התקדמות החלק">
              <i style={{ width: `${Math.min(100, (partWords / target) * 100)}%` }} />
            </div>
          )}
          <ol className="flow-parts">
            {plan.parts.map((p, i) => (
              <li key={i} className={i < partsDone ? "is-done" : i === partsDone ? "is-now" : ""}>
                <span className="flow-mark" aria-hidden="true">
                  {i < partsDone ? "✓" : i + 1}
                </span>
                {p.title}
              </li>
            ))}
          </ol>
        </>
      )}
      {question.q && (
        <div className="flow-q">
          <span className="flow-kicker">{question.k}</span>
          <Markdown text={question.q} />
          {question.a ? (
            shown === question.q ? (
              <div className="flow-a">
                <Markdown text={question.a} />
              </div>
            ) : (
              <button className="btn small" onClick={() => setShown(question.q)}>
                הצג תשובה
              </button>
            )
          ) : (
            <span className="flow-hint">תשובה בראש מספיקה. השיעור יענה עליה.</span>
          )}
        </div>
      )}
    </aside>
  );
}
