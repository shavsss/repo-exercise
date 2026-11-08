import { useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { MdContext, Markdown } from "./Markdown";
import { answeredCount, composeAnswers, parseAnswers, parseQuiz, type QuizQuestion } from "../quiz";
import { Icon } from "./Icon";
import "../quiz.css";

/** What the open conversation tells a ```quiz block (App.tsx, through AssistantTurn). */
export interface QuizCtx {
  /** localStorage key of this quiz's draft answers (per conversation) */
  storeKey: string;
  /** the learner already answered (a later quiz message in the conversation) */
  locked: boolean;
  /** that answer's text, to show the chosen answers */
  submitted?: string;
  /** sends the composed answers in mode "quiz" (the composer's send path) */
  onSubmit?: (text: string, images: File[]) => void;
  /** a reply is being written (no submit meanwhile) */
  busy?: boolean;
  canAttach?: boolean;
}

function readDraft(key: string): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}
function writeDraft(key: string, v: Record<string, string>) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* private window or blocked storage: the form still works, the draft is not kept */
  }
}

const KIND_LABEL: Record<QuizQuestion["kind"], string> = { mc: "בחירה", short: "תשובה קצרה", problem: "בעיה" };

/** Grows a textarea with its text, up to `max` lines. */
function fit(el: HTMLTextAreaElement | null, max: number) {
  if (!el) return;
  el.style.height = "auto";
  const lh = parseFloat(getComputedStyle(el).lineHeight) || 24;
  const pad = el.offsetHeight - el.clientHeight + parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom);
  el.style.height = `${Math.min(el.scrollHeight, lh * max + pad)}px`;
}

function Choice({ q, value, disabled, onPick }: { q: QuizQuestion; value: string; disabled: boolean; onPick: (l: string) => void }) {
  return (
    <div className="qz-options" role="radiogroup" aria-labelledby={`qz-q${q.n}`}>
      {q.options.map((o) => {
        const on = value === o.letter;
        return (
          <label key={o.letter} className={`qz-opt ${on ? "is-on" : ""} ${disabled ? "is-locked" : ""}`}>
            <input type="radio" name={`qz-${q.n}`} value={o.letter} checked={on} disabled={disabled} onChange={() => onPick(o.letter)} />
            <span className="qz-letter" aria-hidden>
              {o.letter}
            </span>
            <span className="qz-opt-text">
              <Markdown text={o.text} inline />
            </span>
            {on && <Icon name="check" size={16} />}
          </label>
        );
      })}
    </div>
  );
}

function TextAnswer({ q, value, disabled, canAttach, onChange }: { q: QuizQuestion; value: string; disabled: boolean; canAttach: boolean; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const short = q.kind === "short";
  useEffect(() => fit(ref.current, short ? 2 : 14), [value, short]);
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // a short answer is one line: Enter goes to the next question instead of a new line
    if (!short || e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    const next = e.currentTarget.closest(".qz-q")?.nextElementSibling;
    next?.querySelector<HTMLElement>("textarea, input[type=radio]:checked, input[type=radio]")?.focus();
  };
  return (
    <div className="qz-text">
      <textarea
        ref={ref}
        className={`qz-input ${short ? "is-short" : "is-problem"}`}
        rows={short ? 1 : 5}
        dir="auto"
        value={value}
        disabled={disabled}
        aria-labelledby={`qz-q${q.n}`}
        placeholder={short ? "התשובה שלך" : "הפתרון שלך, צעד אחרי צעד: מה נתון, באיזו נוסחה, החישוב והיחידות"}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
      />
      {!short && !disabled && canAttach && <div className="qz-hint">פתרון על דף? צלמו אותו וצרפו בכפתור התמונה שליד "הגש את המבחן", וכתבו כאן "בצילום".</div>}
    </div>
  );
}

export function QuizForm({ source }: { source: string }) {
  const { live, quiz } = useContext(MdContext);
  const questions = useMemo(() => parseQuiz(source), [source]);
  const key = quiz?.storeKey ?? "";
  const [answers, setAnswers] = useState<Record<string, string>>(() => (key ? readDraft(key) : {}));
  const [sent, setSent] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => setAnswers(key ? readDraft(key) : {}), [key]);

  // the bar sits above the reading bar (both stick to the bottom of the scrolling text)
  useEffect(() => {
    const bar = barRef.current;
    const dock = bar?.closest(".scroll")?.querySelector<HTMLElement>(":scope > .reading-dock");
    if (!bar || !dock || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => bar.style.setProperty("--qz-dock", `${dock.offsetHeight}px`));
    ro.observe(dock);
    return () => ro.disconnect();
  });

  if (!questions.length) return <Markdown text={source} />;

  const locked = !!quiz?.locked || sent || !quiz?.onSubmit;
  // a locked form shows what was sent (the message), else the saved draft
  const shown = quiz?.submitted ? { ...answers, ...parseAnswers(quiz.submitted, questions) } : answers;
  const done = answeredCount(questions, shown);
  const total = questions.length;
  const set = (n: number, v: string) => {
    const next = { ...answers, [String(n)]: v };
    setAnswers(next);
    if (key) writeDraft(key, next);
    setConfirm(false);
  };
  const submit = (force = false) => {
    if (locked || quiz?.busy || !quiz?.onSubmit) return;
    if (done < total && !force) return setConfirm(true);
    setSent(true);
    setConfirm(false);
    quiz.onSubmit(composeAnswers(questions, answers), images);
  };

  return (
    <section className={`qz-form ${locked ? "is-locked" : ""} ${live ? "is-live" : ""}`} data-block="quiz" aria-label="המבחן המסכם">
      <ol className="qz-list">
        {questions.map((q) => {
          const v = shown[String(q.n)] ?? "";
          return (
            <li key={q.n} className={`qz-q qz-${q.kind} ${v.trim() ? "is-answered" : ""}`}>
              <div className="qz-head">
                <span className="qz-num" dir="ltr">
                  {q.n}
                </span>
                <span className="qz-kind">{KIND_LABEL[q.kind]}</span>
              </div>
              <div className="qz-body" id={`qz-q${q.n}`}>
                <Markdown text={q.text} />
              </div>
              {live ? (
                q.kind === "mc" ? (
                  <ul className="qz-options is-preview">
                    {q.options.map((o) => (
                      <li key={o.letter} className="qz-opt is-locked">
                        <span className="qz-letter">{o.letter}</span>
                        <span className="qz-opt-text">
                          <Markdown text={o.text} inline />
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null
              ) : q.kind === "mc" ? (
                <Choice q={q} value={v} disabled={locked} onPick={(l) => set(q.n, l)} />
              ) : locked ? (
                <div className={`qz-given ${v.trim() ? "" : "is-empty"}`} dir="auto">
                  {v.trim() || "לא נענתה"}
                </div>
              ) : (
                <TextAnswer q={q} value={v} disabled={locked} canAttach={!!quiz?.canAttach} onChange={(t) => set(q.n, t)} />
              )}
            </li>
          );
        })}
      </ol>

      {!live && (
        <div className="qz-bar" ref={barRef} role="region" aria-label="הגשת המבחן">
          {locked ? (
            <div className="qz-bar-row">
              <span className="qz-status">
                <Icon name="check" size={16} />
                {quiz?.onSubmit || sent ? "המבחן הוגש. התשובות נעולות." : "תשובות המבחן"}
                <span className="qz-count">
                  {done}/{total}
                </span>
              </span>
            </div>
          ) : confirm ? (
            <div className="qz-bar-row">
              <span className="qz-status is-warn">
                {total - done === 1 ? "שאלה אחת עוד בלי תשובה." : `${total - done} שאלות עוד בלי תשובה.`} להגיש בכל זאת?
              </span>
              <span className="qz-bar-actions">
                <button className="btn small" onClick={() => setConfirm(false)}>
                  חזרה למבחן
                </button>
                <button className="btn small primary" onClick={() => submit(true)}>
                  הגש בכל זאת
                </button>
              </span>
            </div>
          ) : (
            <div className="qz-bar-row">
              <span className="qz-status">
                ענית על {done} מתוך {total}
                <span className="qz-meter" aria-hidden>
                  <i style={{ width: `${(done / Math.max(1, total)) * 100}%` }} />
                </span>
              </span>
              <span className="qz-bar-actions">
                {quiz?.canAttach && (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        setImages([...images, ...Array.from(e.target.files ?? [])].slice(0, 5));
                        e.target.value = "";
                      }}
                    />
                    <button
                      className="btn small qz-attach"
                      onClick={() => (images.length ? setImages([]) : fileRef.current?.click())}
                      title={images.length ? "הסר את הצילומים" : "צילום של דף פתרון"}
                      aria-label={images.length ? `${images.length} צילומים, הסר` : "צרף צילום של דף פתרון"}
                    >
                      <Icon name={images.length ? "close" : "image"} size={14} />
                      <span className="qz-attach-label">{images.length ? `${images.length} צילומים` : "צרף צילום"}</span>
                    </button>
                  </>
                )}
                <button className="btn primary" disabled={!!quiz?.busy} onClick={() => submit()}>
                  הגש את המבחן
                </button>
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
