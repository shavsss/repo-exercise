import { useRef, useState, type MouseEvent } from "react";
import type { Effort, Mode } from "../types";
import { MODE_LABEL } from "../runtime";
import { Icon } from "./Icon";

export interface QuickAction {
  label: string;
  text: string;
  mode: Mode;
  primary?: boolean;
}

const EFFORTS: { id: Effort; label: string }[] = [
  { id: "low", label: "נמוך" },
  { id: "medium", label: "בינוני" },
  { id: "high", label: "גבוה" },
];

const PLACEHOLDER: Partial<Record<Mode, string>> = {
  clarify: "מה לא היה ברור? אפשר להדביק משפט מהמקור או לצרף צילום",
  free: "כתבו הודעה, או הדביקו מקור שתרצו שהמורה יתייחס אליו",
  quiz: "התשובות שלכם למבחן, בהודעה אחת",
  lesson: "בקשה לשיעור (לא חובה)",
};

export function Composer({
  busy,
  onSend,
  onStop,
  quick,
  modes,
  mode,
  setMode,
  effort,
  setEffort,
  canAttach,
  disabled,
}: {
  busy: boolean;
  onSend: (text: string, images: File[]) => void;
  onStop: () => void;
  quick: QuickAction[];
  modes: Mode[];
  mode: Mode;
  setMode: (m: Mode) => void;
  effort: Effort;
  setEffort: (e: Effort) => void;
  canAttach: boolean;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [allQuick, setAllQuick] = useState(false);
  // a long row of shortcuts takes height from the text; the first ones stay, the rest wait
  const shown = allQuick || quick.length <= 3 ? quick : quick.slice(0, 2);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (busy || disabled || (!text.trim() && !images.length)) return;
    onSend(text.trim(), images.map((im) => im.file));
    setText("");
    setImages([]);
    if (taRef.current) taRef.current.style.height = "";
  };

  // on a phone the extra chips show only while the composer is in use (polish2.css): a press on one
  // keeps the focus in the text, so the row does not fold away under the finger
  const keepFocus = (e: MouseEvent) => {
    if (document.activeElement === taRef.current) e.preventDefault();
  };
  const [focused, setFocused] = useState(false);
  const short = !focused && !text && (mode === "clarify" || mode === "free") && window.matchMedia?.("(max-width: 700px)").matches;

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
          {shown.map((q) => (
            <button key={q.label} className={`btn small ${q.primary ? "primary" : ""}`} disabled={disabled} onMouseDown={keepFocus} onClick={() => onSend(q.text, [])} data-mode={q.mode}>
              {q.label}
            </button>
          ))}
          {shown.length < quick.length && (
            <button className="btn small ghost quick-more" onMouseDown={keepFocus} onClick={() => setAllQuick(true)}>
              עוד {quick.length - shown.length}…
            </button>
          )}
        </div>
      )}
      <div className="composer">
        {images.length > 0 && (
          <div className="composer-images">
            {images.map((im, i) => (
              <button key={i} className="thumb" onClick={() => setImages((all) => all.filter((_, j) => j !== i))} title="הסר">
                <img src={im.url} alt="" />
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
          placeholder={short ? "שאל…" : PLACEHOLDER[mode]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
          {modes.length > 1 && (
            <div className="seg" role="radiogroup" aria-label="סוג ההודעה">
              {modes.map((m) => (
                <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? "is-on" : ""} onClick={() => setMode(m)}>
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
          )}
          <span className="composer-spacer" />
          {canAttach && (
            <>
              <button className="icon-btn" onClick={() => fileRef.current?.click()} title="צרף תמונה" aria-label="צרף תמונה">
                <Icon name="image" />
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
            </>
          )}
          <label className="effort" title="עומק החשיבה של המודל">
            <span>חשיבה</span>
            <select value={effort} onChange={(e) => setEffort(e.target.value as Effort)}>
              {EFFORTS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
          {busy ? (
            <button className="send-btn is-stop" onClick={onStop} aria-label="עצור" title="עצור">
              <Icon name="stop" />
            </button>
          ) : (
            <button className="send-btn" onClick={submit} disabled={disabled || (!text.trim() && !images.length)} aria-label="שלח" title="שלח (Enter)">
              <Icon name="send" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
