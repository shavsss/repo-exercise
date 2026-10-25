import { useMemo, useState } from "react";
import { NOTE_KIND_LABEL, type LessonNote, type NoteKind } from "../types";
import { Markdown } from "./Markdown";
import { Icon } from "./Icon";

const KINDS = Object.keys(NOTE_KIND_LABEL) as NoteKind[];

/** Markdown of a list of notes, grouped by module and lesson, for download. */
function toMarkdown(notes: LessonNote[], title: string) {
  const groups = new Map<string, LessonNote[]>();
  for (const n of [...notes].sort((a, b) => a.ts - b.ts)) {
    const k = `${n.moduleId} · ${n.lesson === -1 ? "מבחן מסכם" : `שיעור ${n.lesson + 1}${n.lessonTitle ? `: ${n.lessonTitle}` : ""}`}`;
    groups.set(k, [...(groups.get(k) ?? []), n]);
  }
  const body = [...groups]
    .map(([k, list]) => `## ${k}\n\n${list.map((n) => `- **${NOTE_KIND_LABEL[n.kind]}** (${n.who === "tutor" ? "המורה" : "אני"}, ${new Date(n.ts).toLocaleDateString("he-IL")}): ${n.text.replace(/\n+/g, " ")}`).join("\n")}`)
    .join("\n\n");
  return `# ${title}\n\n${body || "אין עדיין פריטים."}\n`;
}

/**
 * The lesson's shared notebook: ideas for articles, interview questions, points to
 * deepen later and notes, written by the learner and by the tutor (through its
 * save_lesson_note tool). "All" shows every lesson's notebook, for writing later.
 */
export function NotesPanel({
  notes,
  here,
  hereLabel,
  canWrite,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
  onOpen,
}: {
  notes: LessonNote[];
  /** the current lesson, if one is open */
  here: { moduleId: string; lesson: number } | null;
  hereLabel: string;
  canWrite: boolean;
  onAdd: (kind: NoteKind, text: string) => void;
  onUpdate: (id: string, patch: Partial<LessonNote>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onOpen: (moduleId: string, lesson: number) => void;
}) {
  const [scope, setScope] = useState<"here" | "all">(here ? "here" : "all");
  const [filter, setFilter] = useState<NoteKind | "">("");
  const [kind, setKind] = useState<NoteKind>("deepen");
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [msg, setMsg] = useState("");

  const shown = useMemo(
    () => notes.filter((n) => (scope === "all" || (here && n.moduleId === here.moduleId && n.lesson === here.lesson)) && (!filter || n.kind === filter)),
    [notes, scope, here, filter],
  );

  const exportMd = async () => {
    const dl = window.__downloads;
    if (!dl) return setMsg("ההורדה לא זמינה בתצוגה הזו.");
    const title = scope === "all" ? "מחברת השיעורים: כל הפריטים" : `מחברת השיעור: ${hereLabel}`;
    try {
      const r = await dl.save({ filename: scope === "all" ? "lesson-notebook.md" : "lesson-notes.md", data: toMarkdown(shown, title) });
      setMsg(r.status === "saved" ? "נשמר." : "");
    } catch (e) {
      const c = (e as { code?: string }).code;
      setMsg(c === "declined" ? "" : "ההורדה לא הצליחה בתצוגה הזו.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal notes-modal" role="dialog" aria-label="מחברת השיעור" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <span className="modal-title">מחברת השיעור</span>
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            <Icon name="close" />
          </button>
        </header>
        <div className="modal-tools notes-tools">
          <div className="seg" role="group" aria-label="מה להציג">
            <button aria-pressed={scope === "here"} onClick={() => setScope("here")} disabled={!here}>
              השיעור הזה
            </button>
            <button aria-pressed={scope === "all"} onClick={() => setScope("all")}>
              כל השיעורים
            </button>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as NoteKind | "")} aria-label="סינון לפי סוג">
            <option value="">כל הסוגים</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {NOTE_KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <button className="btn small" onClick={exportMd} disabled={!shown.length}>
            ייצוא ל-Markdown
          </button>
          {msg && <span className="muted">{msg}</span>}
        </div>
        <div className="modal-body">
          {here && scope === "here" && canWrite && (
            <form
              className="note-add"
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                onAdd(kind, text.trim());
                setText("");
              }}
            >
              <div className="note-kinds" role="group" aria-label="סוג">
                {KINDS.map((k) => (
                  <button type="button" key={k} className={`chip note-k-${k}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
                    {NOTE_KIND_LABEL[k]}
                  </button>
                ))}
              </div>
              <textarea id="note-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="רעיון, שאלה לראיון, נקודה לחזור אליה…" rows={3} aria-label="פריט חדש" />
              <button className="btn small primary" type="submit" disabled={!text.trim()}>
                הוסף
              </button>
            </form>
          )}
          {!shown.length ? (
            <p className="muted">
              {scope === "here"
                ? "עוד אין פריטים בשיעור הזה. המורה מוסיף כאן רעיונות למאמרים, שאלות לראיונות ונקודות להעמקה תוך כדי השיעור, ואתה יכול להוסיף משלך."
                : "עוד אין פריטים במחברת."}
            </p>
          ) : (
            <ul className="notes">
              {shown.map((n) => (
                <li key={n.id} className={`note note-k-${n.kind}`}>
                  <div className="note-head">
                    <span className="note-kind">{NOTE_KIND_LABEL[n.kind]}</span>
                    <span className="note-who">{n.who === "tutor" ? "המורה" : "אני"}</span>
                    {scope === "all" && (
                      <button className="link" onClick={() => onOpen(n.moduleId, n.lesson)}>
                        <bdi dir="ltr">{n.moduleId}</bdi> · {n.lesson === -1 ? "מבחן" : `שיעור ${n.lesson + 1}`}
                      </button>
                    )}
                    <span className="note-date">{new Date(n.ts).toLocaleDateString("he-IL")}</span>
                    {canWrite && n.id && editing !== n.id && (
                      <span className="note-actions">
                        <button className="link" onClick={() => (setEditing(n.id!), setDraft(n.text))}>
                          עריכה
                        </button>
                        <button className="link" onClick={() => onDelete(n.id!)}>
                          מחיקה
                        </button>
                      </span>
                    )}
                  </div>
                  {editing === n.id ? (
                    <div className="note-edit">
                      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} aria-label="עריכת הפריט" />
                      <button className="btn small primary" onClick={() => (onUpdate(n.id!, { text: draft.trim() }), setEditing(null))} disabled={!draft.trim()}>
                        שמור
                      </button>
                      <button className="btn small" onClick={() => setEditing(null)}>
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <div className="note-text">
                      <Markdown text={n.text} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
