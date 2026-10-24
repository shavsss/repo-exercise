import { useRef, useState } from "react";
import type { Effort, Mode } from "../api";

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
  { id: "medium", label: "בינוני" },
  { id: "high", label: "גבוה" },
  { id: "xhigh", label: "גבוה מאוד" },
  { id: "max", label: "מקסימום" },
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
}: {
  busy: boolean;
  onSend: (text: string, images: { media_type: string; data: string }[]) => void;
  onStop: () => void;
  onQuick: (q: QuickAction) => void;
  quick: QuickAction[];
  mode: Mode;
  setMode: (m: Mode) => void;
  effort: Effort;
  setEffort: (e: Effort) => void;
}) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ media_type: string; data: string; url: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (busy || (!text.trim() && !images.length)) return;
    onSend(text.trim(), images.map(({ media_type, data }) => ({ media_type, data })));
    setText("");
    setImages([]);
    if (taRef.current) taRef.current.style.height = "";
  };

  const addFiles = (files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        setImages((im) => [...im, { media_type: f.type, data: url.split(",")[1], url }]);
      };
      reader.readAsDataURL(f);
    }
  };

  return (
    <div className="composer-wrap">
      {quick.length > 0 && !busy && (
        <div className="quick-row">
          {quick.map((q) => (
            <button key={q.label} className={`chip quick-chip mode-${q.mode}`} onClick={() => onQuick(q)}>
              {q.label}
            </button>
          ))}
        </div>
      )}
      <div className="composer window">
        <div className="window-bar">
          <span className="window-stripes" aria-hidden />
          <div className="mode-switch" role="radiogroup" aria-label="סוג ההודעה">
            {MODES.map((m) => (
              <button key={m.id} role="radio" aria-checked={mode === m.id} className={`mode-btn mode-${m.id} ${mode === m.id ? "is-on" : ""}`} onClick={() => setMode(m.id)} title={m.hint}>
                {m.label}
              </button>
            ))}
          </div>
          <span className="window-stripes" aria-hidden />
        </div>
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
          ref={taRef}
          className="composer-input"
          rows={1}
          value={text}
          placeholder={mode === "lesson" ? "איזה סעיף נלמד? למשל: ״המשך מעמוד 240 — סעיף 12, תורת האינווריאנטים״" : mode === "clarify" ? "מה לא היה ברור? אפשר להדביק משפט מהספר או לצרף צילום של עמוד" : "כתבו הודעה…"}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = "";
            e.target.style.height = Math.min(e.target.scrollHeight, 260) + "px";
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
          <button className="icon-btn" onClick={() => fileRef.current?.click()} title="צרף תמונה (למשל צילום עמוד)">
            🖼️
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <label className="effort">
            <span>עומק חשיבה</span>
            <select value={effort} onChange={(e) => setEffort(e.target.value as Effort)}>
              {EFFORTS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
          <span className="composer-hint">Enter לשליחה · Shift+Enter לשורה חדשה</span>
          {busy ? (
            <button className="btn btn-stop" onClick={onStop}>
              ■ עצור
            </button>
          ) : (
            <button className="btn btn-send" onClick={submit} disabled={!text.trim() && !images.length}>
              שלח ←
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
