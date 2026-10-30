import { useEffect, useState } from "react";
import { Markdown } from "./Markdown";
import { Icon } from "./Icon";
import type { Store } from "../runtime";
import { liveUsage, summarize, type UsageDoc, type UsageSummary } from "../usage";
import "./memory-panel.css";

type Version = { id: string; memory: string; reason: string; at: number };
type View = "memory" | "versions" | "usage";

const when = (t: number) => new Date(t).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
const modelName = (k: string) => k.replace(/^tier:/, "רמה ").replace(/^claude-/, "").replace(/-(\d+)-(\d+)$/, " $1.$2");

function UsageTable({ s, title }: { s: UsageSummary; title: string }) {
  const calls = Object.entries(s.calls).sort((a, b) => b[1] - a[1]);
  const errors = Object.entries(s.errors);
  return (
    <section className="mem-usage">
      <h4>{title}</h4>
      <dl>
        <dt>קריאות</dt>
        <dd>{calls.length ? calls.map(([k, v]) => `${modelName(k)}: ${v}`).join(" · ") : "0"}</dd>
        <dt>זמן כתיבה</dt>
        <dd>{s.minutes} דק׳</dd>
        <dt>שיעורים</dt>
        <dd>{s.lessons ? `${s.lessons}, כ-${s.wordsPerLesson.toLocaleString("he-IL")} מילים וכ-${s.lessonMinutes} דק׳ כתיבה לשיעור` : "0"}</dd>
        {errors.length > 0 && (
          <>
            <dt>קריאות שנעצרו</dt>
            <dd>{errors.map(([k, v]) => `${k}: ${v}`).join(" · ")}</dd>
          </>
        )}
      </dl>
    </section>
  );
}

export function MemoryPanel({ memory, busy, canSave, store, onClose, onSave }: { memory: string; busy: boolean; canSave: boolean; store?: Store | null; onClose: () => void; onSave: (text: string, reason?: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memory);
  const [view, setView] = useState<View>("memory");
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [shown, setShown] = useState<Version | null>(null);
  const [usage, setUsage] = useState<Partial<UsageDoc>[] | null>(null);

  useEffect(() => {
    if (!store) return;
    if (view === "versions") store.loadMemoryLog().then(setVersions, () => setVersions([]));
    if (view === "usage") store.loadUsage().then((d) => setUsage(d as Partial<UsageDoc>[]), () => setUsage([]));
  }, [view, store, memory]);

  // this session's counts are added to what the db already holds for it
  const usageDocs = usage ? [...usage.filter((d) => !(d.session === liveUsage().session && d.day === liveUsage().day)), liveUsage()] : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label="זיכרון הקורס" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <span className="modal-title">זיכרון הקורס</span>
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            <Icon name="close" />
          </button>
        </header>
        <div className="modal-tools">
          <span className="muted">{busy ? "מתעדכן עכשיו לפי השיעור האחרון…" : "המורה קורא את זה לפני כל תשובה. הזיכרון מתעדכן אחרי כל שיעור, ואפשר לתקן אותו ידנית. כל גרסה קודמת נשמרת."}</span>
          {canSave && view === "memory" &&
            (editing ? (
              <>
                <button className="btn small primary" onClick={() => (onSave(draft, "לפני עריכה ידנית"), setEditing(false))}>
                  שמור
                </button>
                <button className="btn small" onClick={() => (setDraft(memory), setEditing(false))}>
                  ביטול
                </button>
              </>
            ) : (
              <button className="btn small" onClick={() => (setDraft(memory), setEditing(true))} disabled={busy}>
                עריכה
              </button>
            ))}
          {store && !editing && (
            <span className="mem-tabs" role="tablist">
              {(
                [
                  ["memory", "הזיכרון"],
                  ["versions", "גרסאות קודמות"],
                  ["usage", "שימוש ב-Claude"],
                ] as [View, string][]
              ).map(([v, label]) => (
                <button key={v} role="tab" aria-selected={view === v} className={`btn small${view === v ? " on" : ""}`} onClick={() => (setView(v), setShown(null))}>
                  {label}
                </button>
              ))}
            </span>
          )}
        </div>
        {editing ? (
          <textarea className="memory-edit" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="עריכת הזיכרון" />
        ) : view === "versions" ? (
          <div className="modal-body mem-versions">
            {shown ? (
              <>
                <div className="mem-version-bar">
                  <button className="btn small" onClick={() => setShown(null)}>
                    חזרה לרשימה
                  </button>
                  <span className="muted">
                    {when(shown.at)} · {shown.reason}
                  </span>
                  {canSave && (
                    <button className="btn small primary" disabled={busy} onClick={() => (onSave(shown.memory, `לפני שחזור הגרסה מ-${when(shown.at)}`), setShown(null), setView("memory"))}>
                      שחזר את הגרסה הזו
                    </button>
                  )}
                </div>
                <div className="prose">
                  <Markdown text={shown.memory} />
                </div>
              </>
            ) : versions === null ? (
              <p className="muted">טוען…</p>
            ) : versions.length ? (
              <ol className="mem-version-list">
                {versions.map((v) => (
                  <li key={v.id}>
                    <button className="mem-version" onClick={() => setShown(v)}>
                      <span className="mem-when">{when(v.at)}</span>
                      <span className="mem-reason">{v.reason}</span>
                      <span className="mem-size">{v.memory.length.toLocaleString("he-IL")} תווים</span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">הגרסאות יופיעו כאן מהעדכון הבא של הזיכרון: לפני כל החלפה, הנוסח הקודם נשמר כאן.</p>
            )}
          </div>
        ) : view === "usage" ? (
          <div className="modal-body">
            {usage === null ? (
              <p className="muted">טוען…</p>
            ) : (
              <>
                <UsageTable s={summarize(usageDocs, 1)} title="היום" />
                <UsageTable s={summarize(usageDocs, 7)} title="7 הימים האחרונים" />
                <p className="muted mem-note">כל קריאה של הדף ל-Claude נספרת לפי המודל שענה עליה. המספרים נאספים מאז שהמונה נוסף לדף.</p>
              </>
            )}
          </div>
        ) : (
          <div className="modal-body prose">
            <Markdown text={memory} />
          </div>
        )}
      </div>
    </div>
  );
}
