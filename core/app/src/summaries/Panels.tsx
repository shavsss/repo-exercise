import { useMemo, useRef, useState } from "react";
import { Markdown } from "../components/Markdown";
import type { Runtime } from "../runtime";
import type { Module } from "../library";
import type { LessonNote, LessonSpec, NoteKind } from "../types";
import { NOTE_KIND_LABEL } from "../types";
import { checkSummaryAnswer, quizFromSummary, reviewSummary, type SummaryQuestion } from "../tutor";

const KINDS = Object.keys(NOTE_KIND_LABEL) as NoteKind[];
const errText = (e: unknown) => ((e as { code?: string })?.code === "not_granted" ? "אין חיבור ל-Claude בתצוגה הזו." : ((e as Error)?.message ?? "משהו נכשל. נסה שוב."));

/* ---------------- the tutor, on request ---------------- */
export function TutorPanel({ rt, module: m, lessons, memory, summaryMd }: { rt: Runtime | null; module: Module; lessons?: LessonSpec[]; memory: string; summaryMd: () => string }) {
  const [review, setReview] = useState<{ text: string; busy: boolean; err?: string } | null>(null);
  const [quiz, setQuiz] = useState<{ items: (SummaryQuestion & { ans: string; fb?: string; busy?: boolean; show?: boolean })[]; busy: boolean; err?: string } | null>(null);
  const ctl = useRef<AbortController | null>(null);
  const can = !!rt?.sample;
  const runReview = async () => {
    ctl.current?.abort();
    ctl.current = new AbortController();
    setReview({ text: "", busy: true });
    try {
      const text = await reviewSummary({ rt: rt!, module: m, lessons, summary: summaryMd(), memory, signal: ctl.current.signal, onText: (t) => setReview({ text: t, busy: true }) });
      setReview({ text, busy: false });
    } catch (e) {
      setReview((r) => ({ text: r?.text ?? "", busy: false, err: errText(e) }));
    }
  };
  const runQuiz = async () => {
    ctl.current?.abort();
    ctl.current = new AbortController();
    setQuiz({ items: [], busy: true });
    try {
      const items = await quizFromSummary({ rt: rt!, module: m, summary: summaryMd(), signal: ctl.current.signal });
      setQuiz({ items: items.map((q) => ({ ...q, ans: "" })), busy: false });
    } catch (e) {
      setQuiz({ items: [], busy: false, err: errText(e) });
    }
  };
  const check = async (i: number) => {
    if (!quiz) return;
    const it = quiz.items[i];
    const set = (p: Partial<(typeof quiz.items)[number]>) => setQuiz((q) => q && { ...q, items: q.items.map((x, j) => (j === i ? { ...x, ...p } : x)) });
    set({ busy: true });
    try {
      set({ fb: await checkSummaryAnswer({ rt: rt!, question: it, answer: it.ans, signal: new AbortController().signal }), busy: false });
    } catch (e) {
      set({ fb: errText(e), busy: false });
    }
  };
  return (
    <div className="sm-aux-body">
      <p className="muted">המורה עובד רק כשמבקשים, ולא כותב לתוך הסיכום.</p>
      <div className="sm-aux-actions">
        <button className="btn" disabled={!can || review?.busy} onClick={runReview}>
          בדוק את הסיכום
        </button>
        <button className="btn" disabled={!can || quiz?.busy} onClick={runQuiz}>
          שאלות חזרה מהסיכום
        </button>
      </div>
      {!can && <p className="muted">אין כאן חיבור ל-Claude.</p>}
      {review && (
        <section className="sm-aux-sec">
          <h4>בדיקת הסיכום {review.busy && <span className="muted">· המורה קורא…</span>}</h4>
          {review.text && <Markdown text={review.text} />}
          {review.err && <p className="sm-err">{review.err}</p>}
        </section>
      )}
      {quiz && (
        <section className="sm-aux-sec">
          <h4>שאלות חזרה {quiz.busy && <span className="muted">· מכין…</span>}</h4>
          {quiz.err && <p className="sm-err">{quiz.err}</p>}
          <ol className="sm-quiz">
            {quiz.items.map((it, i) => (
              <li key={i}>
                <Markdown text={it.q} />
                <textarea
                  value={it.ans}
                  rows={2}
                  placeholder="התשובה שלך"
                  onChange={(e) => setQuiz((q) => q && { ...q, items: q.items.map((x, j) => (j === i ? { ...x, ans: e.target.value } : x)) })}
                />
                <div className="sm-quiz-row">
                  <button className="btn small" disabled={!it.ans.trim() || it.busy} onClick={() => check(i)}>
                    {it.busy ? "בודק…" : "בדוק"}
                  </button>
                  <button className="link" onClick={() => setQuiz((q) => q && { ...q, items: q.items.map((x, j) => (j === i ? { ...x, show: !x.show } : x)) })}>
                    {it.show ? "הסתר תשובה" : "הראה תשובה"}
                  </button>
                </div>
                {it.fb && <Markdown text={it.fb} />}
                {it.show && (
                  <div className="sm-quiz-a">
                    <Markdown text={it.a} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

/* ---------------- the notebook: articles, interviews, points to deepen, notes ---------------- */
function NoteItem({ n, onUpdate, onDelete, onInsert, moduleTitle }: { n: LessonNote; onUpdate: (id: string, patch: Partial<LessonNote>) => void; onDelete: (id: string) => void; onInsert?: (n: LessonNote) => void; moduleTitle?: string }) {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(n.text);
  const [confirm, setConfirm] = useState(false);
  const lines = n.text.split("\n");
  const head = lines[0];
  const points = lines.slice(1).filter((l) => l.trim());
  return (
    <li className={`sm-note kind-${n.kind}`}>
      <div className="sm-note-meta">
        <span className={`chip kind-${n.kind}`}>{NOTE_KIND_LABEL[n.kind]}</span>
        <span className="muted">
          {n.moduleId}
          {moduleTitle ? ` · ${moduleTitle}` : ""} · {n.who === "tutor" ? "המורה" : "אני"} · {new Date(n.ts).toLocaleDateString("he-IL")}
        </span>
      </div>
      {edit ? (
        <>
          <textarea value={text} rows={Math.min(14, Math.max(3, text.split("\n").length + 1))} onChange={(e) => setText(e.target.value)} autoFocus />
          <div className="sm-quiz-row">
            <button className="btn small primary" onClick={() => (onUpdate(n.id!, { text }), setEdit(false))}>
              שמור
            </button>
            <button className="link" onClick={() => (setText(n.text), setEdit(false))}>
              בטל
            </button>
          </div>
        </>
      ) : (
        <div className="sm-note-body" onDoubleClick={() => setEdit(true)}>
          <p>{head}</p>
          {points.length > 0 && (
            <ol className="sm-note-points">
              {points.map((p, i) => (
                <li key={i}>{p.replace(/^\s*[-•]\s*/, "")}</li>
              ))}
            </ol>
          )}
        </div>
      )}
      {!edit && (
        <div className="sm-note-actions">
          <button className="link" onClick={() => setEdit(true)}>
            ערוך
          </button>
          {onInsert && (
            <button className="link" onClick={() => onInsert(n)}>
              הכנס לסיכום
            </button>
          )}
          {confirm ? (
            <>
              <button className="link danger" onClick={() => onDelete(n.id!)}>
                כן, למחוק
              </button>
              <button className="link" onClick={() => setConfirm(false)}>
                לא
              </button>
            </>
          ) : (
            <button className="link danger" onClick={() => setConfirm(true)}>
              מחק
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** The whole notebook, as its own tab: by kind, searchable, editable. */
export function NotebookView({
  notes,
  titles,
  currentModule,
  onAdd,
  onUpdate,
  onDelete,
}: {
  notes: LessonNote[];
  titles: Record<string, string>;
  currentModule: string | null;
  onAdd: (kind: NoteKind, text: string) => void;
  onUpdate: (id: string, patch: Partial<LessonNote>) => void;
  onDelete: (id: string) => void;
}) {
  const [kind, setKind] = useState<NoteKind | "all">("all");
  const [q, setQ] = useState("");
  const [newKind, setNewKind] = useState<NoteKind>("article");
  const [draft, setDraft] = useState("");
  const list = useMemo(
    () => notes.filter((n) => (kind === "all" || n.kind === kind) && (!q.trim() || n.text.includes(q.trim()) || n.moduleId.includes(q.trim()))).sort((a, b) => b.ts - a.ts),
    [notes, kind, q],
  );
  return (
    <div className="sm-notebook">
      <header className="sm-notebook-head">
        <h2>המחברת</h2>
        <p className="muted">רעיונות למאמרים, שאלות לראיונות, נקודות להעמקה והערות, מכל השיעורים. בשיעור אפשר לבקש מהמורה "תוסיף למחברת", או "תוסיף את זה כנקודה למאמר על…", והוא יוסיף לכאן.</p>
        <div className="sm-notebook-tools">
          <div className="seg" role="group" aria-label="סוג">
            <button aria-pressed={kind === "all"} onClick={() => setKind("all")}>
              הכל ({notes.length})
            </button>
            {KINDS.map((k) => (
              <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)}>
                {NOTE_KIND_LABEL[k]} ({notes.filter((n) => n.kind === k).length})
              </button>
            ))}
          </div>
          <input className="sm-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש במחברת" />
        </div>
      </header>
      <div className="sm-note-new">
        <select value={newKind} onChange={(e) => setNewKind(e.target.value as NoteKind)} aria-label="סוג הפריט">
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {NOTE_KIND_LABEL[k]}
            </option>
          ))}
        </select>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder={newKind === "article" ? "שם המאמר בשורה הראשונה, ונקודה בכל שורה אחריה" : "כתוב כאן"} />
        <button
          className="btn primary"
          disabled={!draft.trim()}
          onClick={() => {
            onAdd(newKind, draft.trim());
            setDraft("");
          }}
        >
          הוסף{currentModule ? ` (${currentModule})` : ""}
        </button>
      </div>
      <ul className="sm-notes">
        {list.map((n) => (
          <NoteItem key={n.id} n={n} moduleTitle={titles[n.moduleId]} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
        {!list.length && <li className="muted">אין פריטים.</li>}
      </ul>
    </div>
  );
}

/** The notebook items of one module, beside the summary, ready to bring in. */
export function ModuleNotes({ notes, onInsert, onUpdate, onDelete }: { notes: LessonNote[]; onInsert: (n: LessonNote) => void; onUpdate: (id: string, patch: Partial<LessonNote>) => void; onDelete: (id: string) => void }) {
  return (
    <div className="sm-aux-body">
      {!notes.length && <p className="muted">אין עדיין פריטים במחברת של המודול הזה.</p>}
      <ul className="sm-notes">
        {notes.map((n) => (
          <NoteItem key={n.id} n={n} onUpdate={onUpdate} onDelete={onDelete} onInsert={onInsert} />
        ))}
      </ul>
    </div>
  );
}
