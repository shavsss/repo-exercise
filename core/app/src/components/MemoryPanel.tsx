import { useState } from "react";
import { Markdown } from "./Markdown";

export function MemoryPanel({ memory, busy, canSave, onClose, onSave }: { memory: string; busy: boolean; canSave: boolean; onClose: () => void; onSave: (text: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memory);
  return (
    <div className="viewer-backdrop" onClick={onClose}>
      <div className="viewer window memory-panel" onClick={(e) => e.stopPropagation()}>
        <div className="window-bar">
          <span className="window-stripes" aria-hidden />
          <span className="window-title">🧠 זיכרון הקורס</span>
          <span className="window-stripes" aria-hidden />
          <button className="icon-btn" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </div>
        <div className="viewer-tools">
          <span className="memory-note">{busy ? "מתעדכן עכשיו לפי השיעור האחרון…" : "המורה קורא את זה לפני כל תשובה. הוא מתעדכן אוטומטית אחרי כל שיעור, ואפשר לתקן ידנית."}</span>
          {canSave &&
            (editing ? (
              <>
                <button className="btn btn-small btn-send" onClick={() => (onSave(draft), setEditing(false))}>
                  שמור
                </button>
                <button className="btn btn-small" onClick={() => (setDraft(memory), setEditing(false))}>
                  ביטול
                </button>
              </>
            ) : (
              <button className="btn btn-small" onClick={() => (setDraft(memory), setEditing(true))} disabled={busy}>
                ✎ עריכה
              </button>
            ))}
        </div>
        {editing ? (
          <textarea id="memory-edit" className="memory-edit" value={draft} onChange={(e) => setDraft(e.target.value)} />
        ) : (
          <div className="memory-view prose">
            <Markdown text={memory} />
          </div>
        )}
      </div>
    </div>
  );
}
