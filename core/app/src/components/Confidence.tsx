// Commit before reveal, on the think questions: the learner writes (or only thinks) an answer, says
// how sure he is with one of three buttons, and that press opens the answer. Then he marks how it
// went. Sure and wrong is the best moment to learn (the hypercorrection effect), so it gets a quiet
// amber card with what to check again, and a way to ask the tutor where it went wrong (a consultation
// card under the question). Every step goes to the events log, and the question's latest state to
// the calibration record (events.ts), so it comes back as it was when the lesson is opened again.
// "Show without choosing" stays one click away. Same file in both labs.
import { useContext, useEffect, useRef, useState } from "react";
import { Markdown, MdContext } from "./Markdown";
import { CONF_LABEL, GRADE_LABEL, LessonPlaceCtx, loadCalib, logEvent, requestConsult, saveCalib, thinkId, type CalibRecord, type Conf, type Grade } from "../events";
import "../consult.css";

type Stage = "ask" | "shown" | "graded";

function Bars({ n }: { n: Conf }) {
  return (
    <span className={`conf-bars l${n}`} aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

export function ThinkCommit({ question, answer }: { question: string; answer: string }) {
  const place = useContext(LessonPlaceCtx);
  const { live } = useContext(MdContext);
  const id = thinkId(place, question);
  const [stage, setStage] = useState<Stage>("ask");
  const [mine, setMine] = useState("");
  const [conf, setConf] = useState<Conf | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [writing, setWriting] = useState(false);
  const rec = useRef<CalibRecord | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const shownAt = useRef(0);

  // the question's state from an earlier reading
  useEffect(() => {
    if (live || !place) return;
    let alive = true;
    loadCalib(id).then((r) => {
      if (!alive || !r) return;
      rec.current = r;
      setMine(r.answer ?? "");
      setConf(r.conf);
      setGrade(r.grade ?? null);
      setStage(r.grade ? "graded" : "shown");
    });
    return () => {
      alive = false;
    };
  }, [id, live, place]);

  const commit = (c: Conf) => {
    setConf(c);
    setStage("shown");
    shownAt.current = Date.now();
    const r: CalibRecord = { id, moduleId: place?.moduleId ?? "", lesson: place?.lesson ?? -1, lessonTitle: place?.title, q: question.replace(/\s+/g, " ").trim().slice(0, 400), answer: mine.trim().slice(0, 1500) || undefined, conf: c, ts: Date.now() };
    rec.current = r;
    if (place) saveCalib(r).catch(() => {});
    logEvent("think.commit", place, { q: id, conf: c, wrote: !!mine.trim(), chars: mine.trim().length });
  };
  const skip = () => {
    setStage("shown");
    setConf(null);
    logEvent("think.skip", place, { q: id });
  };
  const mark = (g: Grade) => {
    setGrade(g);
    setStage("graded");
    if (rec.current && place) {
      rec.current = { ...rec.current, grade: g, gradedAt: Date.now() };
      saveCalib(rec.current).catch(() => {});
    }
    logEvent("think.grade", place, { q: id, conf, grade: g, readMs: shownAt.current ? Date.now() - shownAt.current : null });
  };
  const reset = () => {
    setStage("ask");
    setConf(null);
    setGrade(null);
    logEvent("think.reset", place, { q: id });
  };
  const askWhere = () =>
    requestConsult({
      anchor: question.slice(0, 80),
      kind: "check",
      level: 1,
      q: `שאלת think מהשיעור: ${question.trim()}\n\nהתשובה שלי (הייתי בטוח): ${mine.trim() || "(לא כתבתי; חשבתי על תשובה אחרת מזו שבשיעור)"}\n\nהתשובה בשיעור: ${answer.trim()}\n\nאיפה בדיוק טעיתי, ומה לבדוק שוב?`,
      el: root.current,
    });

  const hot = conf === 3 && grade === "wrong";

  return (
    <div className="commit" ref={root}>
      {stage === "ask" && (
        <>
          {writing || mine ? (
            <textarea className="commit-mine" rows={2} value={mine} autoFocus={writing && !mine} placeholder="התשובה שלי, בקצרה" onChange={(e) => setMine(e.target.value)} aria-label="התשובה שלי" />
          ) : (
            <button className="link commit-write" onClick={() => setWriting(true)}>
              לכתוב תשובה
            </button>
          )}
          <div className="commit-conf" role="group" aria-label="כמה אתה בטוח? הבחירה פותחת את התשובה">
            {([1, 2, 3] as Conf[]).map((c) => (
              <button key={c} onClick={() => commit(c)} disabled={live}>
                <Bars n={c} />
                {CONF_LABEL[c]}
              </button>
            ))}
          </div>
          <div className="commit-hint">
            ענה בראש או בכתב, ואז בחר כמה אתה בטוח. הבחירה פותחת את התשובה.{" "}
            <button className="link" onClick={skip}>
              הצג בלי לבחור
            </button>
          </div>
        </>
      )}
      {stage !== "ask" && (
        <>
          {mine.trim() && (
            <div className="commit-yours">
              <span>התשובה שלך{conf ? ` · ${CONF_LABEL[conf]}` : ""}</span>
              {mine.trim()}
            </div>
          )}
          {!mine.trim() && conf && <div className="commit-yours is-short">ענית בראש · {CONF_LABEL[conf]}</div>}
          <div className="reveal">
            <Markdown text={answer} />
          </div>
          {stage === "shown" && conf && (
            <div className="commit-grade" role="group" aria-label="איך הלך?">
              <span>איך הלך?</span>
              {(["right", "partial", "wrong"] as Grade[]).map((g) => (
                <button key={g} className={`is-${g}`} onClick={() => mark(g)}>
                  {g === "right" ? "✓" : g === "partial" ? "◐" : "✗"} {GRADE_LABEL[g]}
                </button>
              ))}
            </div>
          )}
          {stage === "graded" && grade && !hot && (
            <div className={`commit-verdict is-${grade}`}>
              {grade === "right" ? "✓ צדקת" : grade === "partial" ? "◐ בחלקו" : "✗ לא הפעם"}
              {conf ? ` · ${CONF_LABEL[conf]}` : ""}
              {grade === "right" && conf === 1 && <span> · ניחוש שיצא נכון: כדאי לקרוא את התשובה עד הסוף.</span>}
            </div>
          )}
          {hot && (
            <div className="commit-hot" role="note">
              <div className="commit-hot-h">◆ הייתי בטוח וטעיתי · זה הרגע הכי טוב ללמוד</div>
              <div>
                <b>מה לבדוק שוב:</b> השווה את התשובה שלך לתשובה שבשיעור צעד אחר צעד, ומצא את הצעד הראשון שבו הן נפרדות. שם יושבת ההנחה שנראתה מובנת מאליה. אחר כך קרא שוב את הפסקה שלפני השאלה.
              </div>
              <div className="commit-hot-actions">
                <button className="btn small" onClick={askWhere}>
                  שאל את המורה איפה טעיתי
                </button>
              </div>
            </div>
          )}
          <div className="commit-hint">
            <button className="link" onClick={reset}>
              {stage === "graded" ? "לענות שוב" : "הסתר את התשובה"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
