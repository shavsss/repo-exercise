// The level-3 blocks (predict, errorhunt, verify, lab) and the lead-and-decide block (decide).
// Each is a quiet panel with a side bar. Where the learner commits first (predict, errorhunt,
// decide), the reference answer after the "---" line opens only after they wrote something;
// their answers are kept per lesson (level3.ts). Identical in both apps.
import { useContext, useEffect, useState, type ReactNode } from "react";
import { Markdown } from "../Markdown";
import { parseHeaders } from "./Callout";
import { blockKey, useL3, type L3Answer } from "../../level3";
import { CONF_LABEL, GRADE_LABEL, LessonPlaceCtx, logEvent, saveCalib, thinkId, type CalibRecord, type Conf, type Grade } from "../../events";
import "../../consult.css";
import { useBookMeasure } from "../../book/context";

const DECIDE_LABEL: Record<string, string> = {
  trade: "מוביל ומחליט: ניתוח פשרות בין תחומים",
  architecture: "מוביל ומחליט: בחירת ארכיטקטורה",
  review: "מוביל ומחליט: ביקורת תכן",
  agents: "מוביל ומחליט: הובלת צוות סוכנים",
};

function Panel({ kind, label, title, meta, children }: { kind: string; label: string; title?: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <section className={`b3 b3-${kind}`} data-block={kind}>
      <header className="b3-head">
        <span className="b3-label">{label}</span>
        {title && (
          <h4 className="b3-title">
            <Markdown text={title} inline />
          </h4>
        )}
      </header>
      {meta && <div className="b3-meta">{meta}</div>}
      <div className="b3-body">{children}</div>
    </section>
  );
}

/** The body before the first "---" line, and the hidden reference answer after it. */
function split(body: string) {
  const [shown, ...rest] = body.split(/^\s*---\s*$/m);
  return { shown: shown.trim(), hidden: rest.join("\n---\n").trim() };
}

/** A text draft that starts from the stored answer, also when the stored copy arrives late. */
function useDraft(saved: L3Answer | undefined, field: "text" | "low" | "high") {
  const [v, setV] = useState(saved?.[field] ?? "");
  const stored = saved?.[field];
  useEffect(() => {
    if (stored !== undefined) setV((cur) => (cur ? cur : stored));
  }, [stored]);
  return [v, setV] as const;
}

const num = (s?: string) => {
  const x = Number(String(s ?? "").replace(/,/g, "").replace(/[^\d.eE+-]/g, ""));
  return s && Number.isFinite(x) ? x : NaN;
};

// Predict: the learner locks an estimate (and a 90% range) and says how sure he is; that press opens
// the calculation, as in the think questions. With a value in the block the range grades it by itself;
// otherwise he marks how it went. The record joins the calibration picture (events.ts) like a think question.
export function Predict({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const { shown, hidden } = split(body);
  const place = useContext(LessonPlaceCtx);
  const { answer, set } = useL3("predict", blockKey("predict", source));
  const [text, setText] = useDraft(answer, "text");
  const [low, setLow] = useDraft(answer, "low");
  const [high, setHigh] = useDraft(answer, "high");
  const open = !!answer?.revealed;
  const ready = text.trim().length > 0 || (low.trim() && high.trim());
  const value = num(headers.value);
  const rangeOf = (l?: string, h?: string) => [Math.min(num(l), num(h)), Math.max(num(l), num(h))] as const;
  const judge = (l?: string, h?: string) => {
    const [a, b] = rangeOf(l, h);
    return Number.isFinite(value) && Number.isFinite(a) && Number.isFinite(b) ? value >= a && value <= b : null;
  };
  const inRange = open ? judge(answer?.low, answer?.high) : null;
  const unit = headers.unit ? ` ${headers.unit}` : "";
  const qid = thinkId(place, `predict: ${(headers.title || shown).replace(/\s+/g, " ").trim().slice(0, 300)}`);
  const record = (conf: Conf, grade?: Grade): CalibRecord => ({
    id: qid,
    moduleId: place?.moduleId ?? "",
    lesson: place?.lesson ?? -1,
    lessonTitle: place?.title,
    q: `חזו לפני החישוב: ${(headers.title || shown).replace(/\s+/g, " ").trim().slice(0, 380)}`,
    answer: [text.trim(), low.trim() && high.trim() ? `טווח 90%: ${low.trim()}–${high.trim()}${unit}` : ""].filter(Boolean).join(" · ").slice(0, 1500) || undefined,
    conf,
    grade,
    ts: Date.now(),
    gradedAt: grade ? Date.now() : undefined,
  });
  const commit = (c: Conf) => {
    const auto = judge(low, high);
    const grade: Grade | undefined = auto === null ? undefined : auto ? "right" : "wrong";
    set({ text, low, high, revealed: true, conf: c, grade });
    if (place) saveCalib(record(c, grade)).catch(() => {});
    logEvent("predict.commit", place, { q: qid, conf: c, range: !!(low.trim() && high.trim()), auto: grade ?? null });
  };
  const mark = (g: Grade) => {
    set({ grade: g });
    if (place && answer?.conf) saveCalib(record(answer.conf, g)).catch(() => {});
    logEvent("predict.grade", place, { q: qid, conf: answer?.conf ?? null, grade: g });
  };
  // in the copy the book measures: the open state with the grade row, so the page keeps room and nothing moves
  const measure = useBookMeasure();
  const shownOpen = measure || open;
  const conf = measure ? 2 : answer?.conf;
  const grade = measure ? undefined : answer?.grade;
  const hot = conf === 3 && grade === "wrong";
  return (
    <Panel kind="predict" label="חזו לפני החישוב" title={headers.title}>
      <Markdown text={shown} />
      {!shownOpen ? (
        <div className="b3-form">
          <label className="b3-field">
            <span>האומדן שלי, והנימוק בשורה</span>
            <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text !== (answer?.text ?? "") && set({ text })} />
          </label>
          <div className="b3-range">
            <span>טווח 90%: מ-</span>
            <input dir="ltr" inputMode="decimal" value={low} onChange={(e) => setLow(e.target.value)} onBlur={() => set({ low })} aria-label="הקצה התחתון של הטווח" />
            <span>עד</span>
            <input dir="ltr" inputMode="decimal" value={high} onChange={(e) => setHigh(e.target.value)} onBlur={() => set({ high })} aria-label="הקצה העליון של הטווח" />
            {unit && <span>{unit}</span>}
          </div>
          {hidden && (
            <>
              <div className="commit-conf" role="group" aria-label="כמה אתה בטוח בתחזית? הבחירה נועלת אותה ופותחת את החישוב">
                {([1, 2, 3] as Conf[]).map((c) => (
                  <button key={c} disabled={!ready} onClick={() => commit(c)}>
                    <span className={`conf-bars l${c}`} aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                    {CONF_LABEL[c]}
                  </button>
                ))}
              </div>
              <div className="commit-hint">{ready ? "כמה אתה בטוח? הבחירה נועלת את התחזית ופותחת את החישוב." : "כתבו תחזית או טווח, ואז בחרו כמה אתם בטוחים."}</div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="b3-mine">
            <span className="b3-mine-label">התחזית שלכם{conf ? ` · ${CONF_LABEL[conf]}` : ""}</span>
            {/* measured with a line of prediction and a range, the usual size of what the learner writes */}
            {measure ? <Markdown text="תחזית של שורה אחת, עם הנימוק שלה בקצרה" /> : answer?.text && <Markdown text={answer.text} />}
            {(measure || (answer?.low && answer?.high)) && (
              <span className="b3-mine-range" dir="ltr">
                [{measure ? "0" : answer?.low} – {measure ? "0" : answer?.high}]{unit}
              </span>
            )}
            {inRange !== null && <span className={`b3-verdict ${inRange ? "in" : "out"}`}>{inRange ? "הערך המחושב בתוך הטווח" : "הערך המחושב מחוץ לטווח"}</span>}
          </div>
          <div className="b3-reveal">
            <Markdown text={hidden} />
          </div>
          {conf && !grade && (
            <div className="commit-grade" role="group" aria-label="איך הלך?">
              <span>איך הלך?</span>
              {(["right", "partial", "wrong"] as Grade[]).map((g) => (
                <button key={g} className={`is-${g}`} onClick={() => mark(g)} disabled={measure}>
                  {g === "right" ? "✓" : g === "partial" ? "◐" : "✗"} {GRADE_LABEL[g]}
                </button>
              ))}
            </div>
          )}
          {grade && !hot && (
            <div className={`commit-verdict is-${grade}`}>
              {grade === "right" ? "✓ צדקת" : grade === "partial" ? "◐ בחלקו" : "✗ לא הפעם"}
              {conf ? ` · ${CONF_LABEL[conf]}` : ""}
            </div>
          )}
          {hot && (
            <div className="commit-hot" role="note">
              <div className="commit-hot-h">◆ הייתי בטוח וטעיתי · זה הרגע הכי טוב ללמוד</div>
              <div>
                <b>מה לבדוק שוב:</b> איזו הנחה בתחזית שלך לא החזיקה? מצא את הגורם בחישוב שהשפיע יותר ממה שחשבת, ונסה להסביר במשפט אחד למה.
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

export function ErrorHunt({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const { shown, hidden } = split(body);
  const { answer, set } = useL3("errorhunt", blockKey("errorhunt", source));
  const [text, setText] = useDraft(answer, "text");
  const open = !!answer?.revealed;
  return (
    <Panel kind="errorhunt" label="ציד טעויות: פלט של AI" title={headers.title}>
      <div className="b3-output">
        <Markdown text={shown} />
      </div>
      {!open ? (
        <div className="b3-form">
          <label className="b3-field">
            <span>איפה הטעות, איך תפסתם, ואיזו בדיקה הייתה תופסת אותה</span>
            <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text !== (answer?.text ?? "") && set({ text })} />
          </label>
          {hidden && (
            <div className="b3-actions">
              <button className="b3-btn" disabled={!text.trim()} onClick={() => set({ text, noError: false, revealed: true })}>
                מצאתי. הראו את הפתרון
              </button>
              <button className="b3-btn b3-btn-quiet" onClick={() => set({ text, noError: true, revealed: true })}>
                לדעתי אין כאן טעות
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="b3-mine">
            <span className="b3-mine-label">התשובה שלכם</span>
            {answer?.noError ? <p>אין כאן טעות.</p> : null}
            {answer?.text && <Markdown text={answer.text} />}
          </div>
          <div className="b3-reveal">
            <Markdown text={hidden} />
          </div>
        </>
      )}
    </Panel>
  );
}

/** The checks of a verify block: its list lines; the other lines stay as text around them. */
function checksOf(body: string) {
  const intro: string[] = [];
  const outro: string[] = [];
  const checks: string[] = [];
  for (const line of body.split("\n")) {
    const m = /^\s*(?:[-*]|\d+[.)])\s+(.*)$/.exec(line);
    if (m) checks.push(m[1]);
    else if (checks.length && /^\s+\S/.test(line)) checks[checks.length - 1] += " " + line.trim();
    else (checks.length ? outro : intro).push(line);
  }
  return { intro: intro.join("\n").trim(), checks, outro: outro.join("\n").trim() };
}

export function Verify({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const { intro, checks, outro } = checksOf(body);
  const { answer, set } = useL3("verify", blockKey("verify", source));
  const checked = new Set(answer?.checked ?? []);
  const toggle = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    set({ checked: [...next].sort((a, b) => a - b) });
  };
  const k = checks.filter((_, i) => checked.has(i)).length;
  return (
    <Panel kind="verify" label="אימות: בדיקות בלתי תלויות" title={headers.title} meta={headers.result ? <Markdown text={`על: ${headers.result}`} inline /> : undefined}>
      {intro && <Markdown text={intro} />}
      <ul className="b3-checks">
        {checks.map((c, i) => (
          <li key={i} className={checked.has(i) ? "is-done" : ""}>
            <label>
              <input type="checkbox" checked={checked.has(i)} onChange={() => toggle(i)} />
              <span>
                <Markdown text={c} inline />
              </span>
            </label>
          </li>
        ))}
      </ul>
      {outro && <Markdown text={outro} />}
      <div className="b3-count">
        {k} מתוך {checks.length} בדיקות נעשו{k >= 3 ? " · שלוש בדיקות בלתי תלויות ומעלה: אפשר להסיק מהתוצאה" : " · מסיקים מהתוצאה אחרי שלוש בדיקות בלתי תלויות"}
      </div>
    </Panel>
  );
}

/** Plain text of a lab task, to paste into an AI session. */
function labText(headers: Record<string, string>, body: string) {
  return [headers.title ? `# ${headers.title}` : "", headers.tools ? `כלים: ${headers.tools}` : "", headers.time ? `זמן משוער: ${headers.time}` : "", headers.product ? `מזין את המוצר: ${headers.product}` : "", "", body]
    .filter((x, i) => x || i === 4)
    .join("\n")
    .trim();
}

async function copyText(s: string) {
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    // the sandboxed page may block the clipboard API: fall back to a selected textarea
    const ta = document.createElement("textarea");
    ta.value = s;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export function Lab({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const { answer, set } = useL3("lab", blockKey("lab", source));
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const copy = async () => {
    setCopied((await copyText(labText(headers, body))) ? "ok" : "fail");
    setTimeout(() => setCopied(""), 2500);
  };
  const meta = [headers.tools && `כלים: ${headers.tools}`, headers.time && `זמן: ${headers.time}`, headers.product && `מוצר: ${headers.product}`].filter(Boolean).join(" · ");
  return (
    <Panel kind="lab" label="משימה מובלת: אתם מובילים, ה-AI מבצע" title={headers.title} meta={meta ? <Markdown text={meta} inline /> : undefined}>
      <Markdown text={body} />
      <div className="b3-actions">
        <button className="b3-btn" onClick={copy}>
          {copied === "ok" ? "המשימה הועתקה" : copied === "fail" ? "סמנו את הטקסט והעתיקו ידנית" : "העתיקו את המשימה"}
        </button>
        <label className="b3-done">
          <input type="checkbox" checked={!!answer?.done} onChange={(e) => set({ done: e.target.checked })} />
          <span>המשימה בוצעה ואומתה</span>
        </label>
      </div>
    </Panel>
  );
}

export function Decide({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const { shown, hidden } = split(body);
  const { answer, set } = useL3("decide", blockKey("decide", source));
  const [text, setText] = useDraft(answer, "text");
  const open = !!answer?.revealed;
  const label = DECIDE_LABEL[headers.kind?.trim().toLowerCase() ?? ""] ?? "מוביל ומחליט";
  return (
    <Panel kind="decide" label={label} title={headers.title}>
      <Markdown text={shown} />
      {!open ? (
        <div className="b3-form">
          <label className="b3-field">
            <span>ההחלטה שלי, החלופות, המספרים והנימוק</span>
            <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} onBlur={() => text !== (answer?.text ?? "") && set({ text })} />
          </label>
          {hidden && (
            <button className="b3-btn" disabled={!text.trim()} onClick={() => set({ text, revealed: true })}>
              {text.trim() ? "הגשתי. הראו את ניתוח הרפרנס" : "כתבו את ההחלטה, והניתוח ייפתח"}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="b3-mine">
            <span className="b3-mine-label">ההחלטה שלכם</span>
            {answer?.text && <Markdown text={answer.text} />}
          </div>
          <div className="b3-reveal">
            <Markdown text={hidden} />
          </div>
        </>
      )}
    </Panel>
  );
}
