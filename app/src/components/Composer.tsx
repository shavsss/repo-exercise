import { useRef, useState } from "react";
import type { Effort, Mode } from "../types";

export interface QuickAction {
  label: string;
  text: string;
  mode: Mode;
  /** Title for the conversation when this starts it. */
  title?: string;
}

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "lesson", label: "📚 שיעור על סעיף", hint: "מבנה מלא, 4000+ מילים" },
  { id: "clarify", label: "🔎 שאלת הבהרה", hint: "עומק מלא, בלי פיגומים" },
  { id: "free", label: "💬 חופשי", hint: "" },
];

const EFFORTS: { id: Effort; label: string }[] = [
  { id: "low", label: "נמוך" },
  { id: "medium", label: "בינוני" },
  { id: "high", label: "גבוה" },
];

export function Composer({
  busy,
  onSend,
  onStop,
  onQuick,
  quick,
  mode,
  setMode,
  effort,
  setEffort,
  canAttach,
}: {
  busy: boolean;
  onSend: (text: string, images: File[]) => void;
  onStop: () => void;
  onQuick: (q: QuickAction) => void;
  quick: QuickAction[];
  mode: Mode;
  setMode: (m: Mode) => void;
  effort: Effort;
  setEffort: (e: Effort) => void;
  canAttach: boolean;
}) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (busy || (!text.trim() && !images.length)) return;
    onSend(text.trim(), images.map((im) => im.file));
    setText("");
    setImages([]);
    if (taRef.current) taRef.current.style.height = "";
  };

  const addFiles = (files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      if (!canAttach || !f.type.startsWith("image/")) continue;
      setImages((im) => [...im, { file: f, url: URL.createObjectURL(f) }]);
    }
  };

  return (
    <div className="composer-wrap">
      {quick.length > 0 && !busy && !text && (
        <div className="quick-row">
          {quick.map((q) => (
            <button key={q.label} className={`chip quick-chip mode-${q.mode}`} onClick={() => onQuick(q)}>
              {q.label}
            </button>
          ))}
        </div>
      )}
      <div className={`composer mode-${mode}`}>
        {images.length > 0 && (
          <div className="composer-images">
            {images.map((im, i) => (
              <button key={i} className="thumb" onClick={() => setImages((all) => all.filter((_, j) => j !== i))} title="הסר">
                <img src={im.url} alt="" />
                <span>✕</span>
              </button>
            ))}
          </div>
        )}
        <textarea
          id="composer-text"
          ref={taRef}
          className="composer-input"
          rows={1}
          value={text}
          placeholder={mode === "lesson" ? "איזה סעיף נלמד? למשל: ״המשך מעמוד 240, סעיף 12״" : mode === "clarify" ? "מה לא היה ברור? אפשר להדביק משפט מהספר או לצרף צילום של עמוד" : "כתבו הודעה…"}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "";
            e.target.style.height = Math.min(e.target.scrollHeight, 220) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData.files);
            if (files.length) addFiles(files);
          }}
        />
        <div className="composer-tools">
          <div className="mode-switch" role="radiogroup" aria-label="סוג ההודעה">
            {MODES.map((m) => (
              <button key={m.id} role="radio" aria-checked={mode === m.id} className={`mode-btn mode-${m.id} ${mode === m.id ? "is-on" : ""}`} onClick={() => setMode(m.id)} title={m.hint}>
                {m.label}
              </button>
            ))}
          </div>
          <span className="composer-spacer" />
          {canAttach && (
            <>
              <button className="icon-btn icon-btn-plain" onClick={() => fileRef.current?.click()} title="צרף תמונה (למשל צילום עמוד)" aria-label="צרף תמונה">
                🖼️
              </button>
              <input ref={fileRef} id="composer-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
            </>
          )}
          <label className="effort" title="עומק החשיבה של המודל">
            <span>חשיבה</span>
            <select id="composer-effort" value={effort} onChange={(e) => setEffort(e.target.value as Effort)}>
              {EFFORTS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
          {busy ? (
            <button className="send-btn is-stop" onClick={onStop} aria-label="עצור" title="עצור">
              ■
            </button>
          ) : (
            <button className="send-btn" onClick={submit} disabled={!text.trim() && !images.length} aria-label="שלח" title="שלח (Enter)">
              ↑
            </button>
          )}
        </div>
      </div>
      <div className="composer-hint">Enter לשליחה · Shift+Enter לשורה חדשה · התשובות נשמרות תוך כדי כתיבה</div>
    </div>
  );
}
