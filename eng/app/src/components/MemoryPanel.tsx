import { useState } from "react";
import { Markdown } from "./Markdown";
import { Icon } from "./Icon";

export function MemoryPanel({ memory, busy, canSave, onClose, onSave }: { memory: string; busy: boolean; canSave: boolean; onClose: () => void; onSave: (text: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memory);
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
          <span className="muted">{busy ? "מתעדכן עכשיו לפי השיעור האחרון…" : "המורה קורא את זה לפני כל תשובה. הזיכרון מתעדכן אחרי כל שיעור, ואפשר לתקן אותו ידנית."}</span>
          {canSave &&
            (editing ? (
              <>
                <button className="btn small primary" onClick={() => (onSave(draft), setEditing(false))}>
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
        </div>
        {editing ? (
          <textarea className="memory-edit" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="עריכת הזיכרון" />
        ) : (
          <div className="modal-body prose">
            <Markdown text={memory} />
          </div>
        )}
      </div>
    </div>
  );
}
