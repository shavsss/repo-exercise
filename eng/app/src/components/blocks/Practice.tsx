// The practice questions of a lesson (5.11, after the learner skipped questions he had to grade himself):
// a multiple-choice question whose every option has its explanation, a numeric answer checked against a
// tolerance (with the typical wrong values diagnosed), and a short written explanation graded by Sonnet
// against the key ideas. The system grades, never the learner; how sure he was is an optional choice
// before he answers. Each answer is kept in the calib record of the question (events.ts), and the lesson
// below an unanswered question stays closed until he answers or skips it (practice.ts). Same file in both labs.
import { useContext, useEffect, useRef, useState } from "react";
import { Markdown } from "../Markdown";
import { Frame, parseHeaders } from "./Callout";
import { CONF_LABEL, LessonPlaceCtx, loadCalib, logEvent, saveCalib, thinkId, type CalibRecord, type Conf, type Grade } from "../../events";
import { parseExplain, parseMcq, parseNumeric, gradeNumeric, practiceQuestion } from "../../practice";
import { useBookMeasure } from "../../book/context";

/** In the copy the book measures, a question draws its largest state (answered, with all feedback), so the page keeps room for it. */
const MEASURE_REC = (kind: CalibRecord["kind"]): CalibRecord => ({ id: "", moduleId: "", lesson: 0, q: "", ts: 0, kind, grade: "wrong", conf: 3, answer: "0", feedback: "משוב של שתיים או שלוש שורות שמסביר מה חסר בתשובה ולמה, כדי שהעמוד ישאיר לו מקום מראש, בגובה של המשוב האמיתי בערך." });

const GRADE_TEXT: Record<Grade, string> = { right: "נכון", partial: "נכון בחלקו", wrong: "לא נכון" };
const LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];

/** The record of one practice question, loaded and saved (the gate listens to calib:changed). */
function useRecord(kind: CalibRecord["kind"], source: string) {
  const place = useContext(LessonPlaceCtx);
  const q = practiceQuestion(kind!, source);
  const id = thinkId(place, q);
  const [rec, setRec] = useState<CalibRecord | null>(null);
  useEffect(() => {
    let alive = true;
    loadCalib(id).then((r) => alive && r && setRec(r));
    return () => {
      alive = false;
    };
  }, [id]);
  const save = async (patch: Partial<CalibRecord>) => {
    const r: CalibRecord = { id, moduleId: place?.moduleId ?? "", lesson: place?.lesson ?? -1, lessonTitle: place?.title, q: q.slice(0, 300), kind, ts: Date.now(), ...rec, ...patch };
    setRec(r);
    logEvent(r.skipped ? "practice.skip" : "practice.answer", place, { id, kind, grade: r.grade, conf: r.conf });
    await saveCalib(r).catch(() => {});
  };
  return { rec, save, place };
}

function ConfPick({ conf, setConf }: { conf: Conf | null; setConf: (c: Conf | null) => void }) {
  return (
    <div className="pr-conf" role="group" aria-label="כמה אתה בטוח">
      <span>כמה אתה בטוח? (לא חובה)</span>
      {([1, 2, 3] as Conf[]).map((c) => (
        <button key={c} className={`pr-chip ${conf === c ? "on" : ""}`} onClick={() => setConf(conf === c ? null : c)}>
          {CONF_LABEL[c]}
        </button>
      ))}
    </div>
  );
}

function Verdict({ rec }: { rec: CalibRecord }) {
  if (rec.skipped) return <div className="pr-verdict v-skip">דילגת על השאלה. היא תחזור בחזרה המרווחת.</div>;
  if (!rec.grade) return null;
  return (
    <div className={`pr-verdict v-${rec.grade}`}>
      <b>{GRADE_TEXT[rec.grade]}</b>
      {rec.conf === 3 && rec.grade === "wrong" && <span> · היית בטוח וטעית: זו הנקודה הכי שווה לעבור עליה שוב.</span>}
    </div>
  );
}

function Skip({ onSkip }: { onSkip: () => void }) {
  return (
    <button className="link pr-skip" onClick={onSkip}>
      דלג על השאלה
    </button>
  );
}

/* ---------------- multiple choice ---------------- */
export function McqBlock({ source }: { source: string }) {
  const m = parseMcq(source);
  const { rec: real, save } = useRecord("mcq", source);
  const measure = useBookMeasure();
  const rec = measure ? MEASURE_REC("mcq") : real;
  const [pick, setPick] = useState<number | null>(null);
  const [conf, setConf] = useState<Conf | null>(null);
  const done = !!rec && (!!rec.grade || !!rec.skipped);
  const chosen = done ? Number(rec!.answer ?? -1) : pick;
  const submit = () => {
    if (pick === null) return;
    const opt = m.options[pick];
    save({ answer: String(pick), grade: opt?.correct ? "right" : "wrong", conf: conf ?? undefined, gradedAt: Date.now(), feedback: opt?.why, skipped: false });
  };
  return (
    <Frame kind="mcq" label="שאלה" icon="think" title={m.title}>
      <Markdown text={m.question} />
      <ol className="pr-options">
        {m.options.map((o, i) => {
          const state = done ? (o.correct ? "is-right" : i === chosen ? "is-wrong" : "") : i === pick ? "is-picked" : "";
          return (
            <li key={i} className={state}>
              <button className="pr-option" disabled={done} onClick={() => setPick(i)}>
                <span className="pr-letter">{LETTERS[i]}</span>
                <Markdown text={o.text} inline />
              </button>
              {done && (measure || o.correct || i === chosen) && o.why && (
                <div className="pr-why">
                  <Markdown text={o.why} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {done ? (
        <Verdict rec={rec!} />
      ) : (
        <div className="pr-actions">
          <ConfPick conf={conf} setConf={setConf} />
          <button className="btn small primary" disabled={pick === null} onClick={submit}>
            בדוק
          </button>
          <Skip onSkip={() => save({ skipped: true, gradedAt: Date.now() })} />
        </div>
      )}
    </Frame>
  );
}

/* ---------------- a numeric answer ---------------- */
export function NumericBlock({ source }: { source: string }) {
  const n = parseNumeric(source);
  const { rec: real, save } = useRecord("numeric", source);
  const rec = useBookMeasure() ? MEASURE_REC("numeric") : real;
  const [value, setValue] = useState("");
  const [conf, setConf] = useState<Conf | null>(null);
  const done = !!rec && (!!rec.grade || !!rec.skipped);
  const submit = () => {
    const g = gradeNumeric(n, value);
    if (!g) return;
    save({ answer: value.trim(), grade: g.grade, conf: conf ?? undefined, gradedAt: Date.now(), feedback: g.feedback, skipped: false });
  };
  return (
    <Frame kind="numeric" label="חשבו" icon="think" title={n.title}>
      <Markdown text={n.question} />
      {done ? (
        <>
          {!rec!.skipped && (
            <p className="pr-mine">
              התשובה שלך: <b dir="ltr">{rec!.answer}</b> {n.unit} · התשובה: <b dir="ltr">{n.answerText}</b> {n.unit}
            </p>
          )}
          <Verdict rec={rec!} />
          {rec!.feedback && (
            <div className="pr-why">
              <Markdown text={rec!.feedback} />
            </div>
          )}
          {n.solution && (
            <details className="pr-solution" open={rec!.grade !== "right"}>
              <summary>הפתרון</summary>
              <Markdown text={n.solution} />
            </details>
          )}
        </>
      ) : (
        <div className="pr-actions">
          <label className="pr-input">
            <input dir="ltr" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="מספר" />
            {n.unit && <span>{n.unit}</span>}
          </label>
          <ConfPick conf={conf} setConf={setConf} />
          <button className="btn small primary" disabled={!gradeNumeric(n, value)} onClick={submit}>
            בדוק
          </button>
          <Skip onSkip={() => save({ skipped: true, gradedAt: Date.now() })} />
        </div>
      )}
    </Frame>
  );
}

/* ---------------- a short written explanation, graded by Sonnet ---------------- */
const GRADER = "claude-sonnet-5-5";

function graderPrompt(question: string, ideas: string[], model: string, answer: string) {
  return `You grade one answer of a learner in a Hebrew self-study course (engineering and physics). Be fair and precise: judge the ideas, not the wording or spelling.
Question:
${question}
Key ideas a full answer must contain:
${ideas.map((k, i) => `${i + 1}. ${k}`).join("\n")}
Model answer:
${model}
The learner's answer:
${answer}

Reply with ONLY one JSON object: {"verdict": "right|partial|wrong", "missing": ["the key ideas he missed, short, in Hebrew"], "wrong": "a wrong claim in his answer and its correction, in Hebrew, or empty", "feedback": "two to four sentences in Hebrew, addressed to him: what he got right, what is missing or wrong and why"}. "right" only when every key idea is there and nothing is wrong.`;
}

export function ExplainBlock({ source }: { source: string }) {
  const e = parseExplain(source);
  const { rec: real, save } = useRecord("explain", source);
  const measure = useBookMeasure();
  const rec = measure ? { ...MEASURE_REC("explain"), answer: "תשובה כתובה של שתיים או שלוש שורות, בגובה של תשובה אמיתית של הלומד, כדי שהעמוד ישאיר לה מקום מראש ולא יזוז כשהיא נשלחת לבדיקה." } : real;
  const [text, setText] = useState("");
  const [conf, setConf] = useState<Conf | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const alive = useRef(true);
  useEffect(() => () => void (alive.current = false), []);
  const done = !!rec && (!!rec.grade || !!rec.skipped);
  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      const sample = await window.claude?.use("sample").catch(() => null);
      if (!sample) throw new Error("no sample");
      const res = await sample([{ role: "user", content: graderPrompt(e.question, e.ideas, e.model, text.trim()) }], { model: GRADER, effort: "low", cache: false });
      const raw = String(res?.text ?? "");
      const j = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)) as { verdict?: string; missing?: string[]; wrong?: string; feedback?: string };
      const grade: Grade = j.verdict === "right" ? "right" : j.verdict === "partial" ? "partial" : "wrong";
      const parts = [j.feedback ?? "", j.missing?.length ? `**מה חסר:** ${j.missing.join("; ")}` : "", j.wrong ? `**לתיקון:** ${j.wrong}` : ""].filter(Boolean);
      await save({ answer: text.trim(), grade, conf: conf ?? undefined, gradedAt: Date.now(), feedback: parts.join("\n\n"), skipped: false });
    } catch {
      if (alive.current) setErr("הבדיקה לא הצליחה. אפשר לנסות שוב, או לדלג.");
    } finally {
      if (alive.current) setBusy(false);
    }
  };
  return (
    <Frame kind="explain" label="הסבירו" icon="think" title={e.title}>
      <Markdown text={e.question} />
      {done ? (
        <>
          {!rec!.skipped && <blockquote className="pr-mine">{rec!.answer}</blockquote>}
          <Verdict rec={rec!} />
          {rec!.feedback && (
            <div className="pr-why">
              <Markdown text={rec!.feedback} />
            </div>
          )}
          {e.model && (
            <details className="pr-solution" open={rec!.grade !== "right"}>
              <summary>תשובה לדוגמה</summary>
              <Markdown text={e.model} />
            </details>
          )}
        </>
      ) : (
        <div className="pr-actions is-col">
          <textarea className="pr-text" rows={3} value={text} onChange={(ev) => setText(ev.target.value)} placeholder="התשובה שלך, במילים שלך" />
          <div className="pr-actions">
            <ConfPick conf={conf} setConf={setConf} />
            <button className="btn small primary" disabled={!text.trim() || busy} onClick={submit}>
              {busy ? "בודק…" : "שלח לבדיקה"}
            </button>
            <Skip onSkip={() => save({ skipped: true, gradedAt: Date.now() })} />
          </div>
          {err && <div className="pr-err">{err}</div>}
        </div>
      )}
    </Frame>
  );
}

export { parseHeaders };
