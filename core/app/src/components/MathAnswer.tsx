// The answer field of every question and of the consultation (24.11, his request: the boxes were plain and
// took no equations or complex numbers). A text box that grows with its text, a row of quick symbols, and
// "משוואה", which opens the visual equation editor (MathLive, the one of the notebook) and puts what was built
// at the caret as $…$. Under the box, what was written as it will be read: the math rendered, and in a
// numeric answer the value it was read as (3+4j = 5∠53.13°), or that it is not a number yet. Same file in both labs.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MathEditor } from "../summaries/MathEdit";
import { Markdown } from "./Markdown";
import { parseValue, valueTex } from "../answerValue";
import "../mathAnswer.css";

type Mode = "text" | "value";

const SYMBOLS: Record<Mode, [string, string, string?][]> = {
  // [inserted, title, shown when it is not what is inserted]
  value: [["j", "היחידה המדומה"], ["∠", "זווית (צורה קוטבית)"], ["°", "מעלות"], ["π", "פאי"], ["√(", "שורש", "√"], ["^", "חזקה", "xⁿ"], ["×10^", "כפול 10 בחזקת", "×10ⁿ"]],
  text: [["π", "פאי"], ["√", "שורש"], ["²", "בריבוע"], ["≈", "בערך"], ["±", "פלוס מינוס"], ["·", "כפל"], ["→", "חץ"], ["∠", "זווית"], ["°", "מעלות"], ["Δ", "דלתא"]],
};

const MAX_LINES = { text: 14, value: 3 };

/**
 * Grows a textarea with its text, from its rows up to `max` lines. A box that is not laid out (a closed
 * sitting, the book's hidden copy) measures 0 and is left to its rows; it was locked at 0 there (24.11).
 */
function fit(el: HTMLTextAreaElement | null, max: number) {
  if (!el) return;
  if (!el.getClientRects().length) {
    el.style.height = "";
    return;
  }
  el.style.height = "auto";
  const cs = getComputedStyle(el);
  const lh = parseFloat(cs.lineHeight) || 24;
  const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
  const extra = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + border;
  const least = lh * Math.max(1, el.rows) + extra;
  el.style.height = `${Math.max(least, Math.min(el.scrollHeight + border, lh * max + extra))}px`;
}

export interface MathAnswerProps {
  value: string;
  onChange: (v: string) => void;
  /** "value": a numeric answer (one line, read as a number); "text": words and equations */
  mode?: Mode;
  placeholder?: string;
  rows?: number;
  maxLines?: number;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  /** Enter (without Shift) calls it; Shift+Enter is a new line */
  onEnter?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  /** the unit of a numeric answer, at the end of the tools row */
  unit?: string;
  /** at the end of the tools row: a send button */
  action?: ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /** no preview line under the box (the caller shows the answer itself) */
  noPreview?: boolean;
}

export const MathAnswer = forwardRef<HTMLTextAreaElement, MathAnswerProps>(function MathAnswer(
  { value, onChange, mode = "text", placeholder, rows, maxLines, disabled, readOnly, autoFocus, onEnter, onKeyDown, onBlur, unit, action, className = "", ariaLabel, ariaLabelledBy, noPreview },
  outer,
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(outer, () => ref.current!, []);
  const caret = useRef<[number, number] | null>(null);
  const [eq, setEq] = useState(false);
  const eqTex = useRef("");
  const max = maxLines ?? MAX_LINES[mode];
  useEffect(() => fit(ref.current, max), [value, max]);
  // again when the box is shown or its width changes (the text wraps differently)
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let w = -1;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === w) return;
      w = el.clientWidth;
      fit(el, max);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);

  const remember = () => {
    const el = ref.current;
    if (el) caret.current = [el.selectionStart, el.selectionEnd];
  };
  const insert = (s: string, pad = false) => {
    const el = ref.current;
    const [a, b] = caret.current ?? [value.length, value.length];
    const before = value.slice(0, a);
    const after = value.slice(b);
    const text = pad ? `${before && !/\s$/.test(before) ? " " : ""}${s}${after && !/^\s/.test(after) ? " " : ""}` : s;
    onChange(before + text + after);
    const at = before.length + text.length;
    caret.current = [at, at];
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(at, at);
    });
  };
  const openEq = () => {
    remember();
    eqTex.current = "";
    setEq(true);
  };
  const closeEq = (put: boolean) => {
    const tex = eqTex.current.trim();
    setEq(false);
    if (put && tex) insert(`$${tex}$`, mode === "text");
    else requestAnimationFrame(() => ref.current?.focus());
  };

  const val = mode === "value" && value.trim() ? parseValue(value) : null;
  const hasMath = /\$[^$]+\$/.test(value);
  const off = disabled || readOnly;

  return (
    <div className={`ma ma-${mode} ${eq ? "is-eq" : ""} ${off ? "is-off" : ""} ${className}`}>
      <div className="ma-box">
        <textarea
          ref={ref}
          className="ma-input"
          dir="auto"
          rows={rows ?? (mode === "value" ? 1 : 3)}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          inputMode={mode === "value" ? "text" : undefined}
          spellCheck={mode === "text"}
          onChange={(e) => onChange(e.target.value)}
          onSelect={remember}
          onBlur={() => (remember(), onBlur?.())}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            if (onEnter && e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onEnter();
            }
          }}
        />
        {!off && (
          // mousedown is kept from the box, so the caret stays where it was
          <div className="ma-tools" onMouseDown={(e) => e.preventDefault()}>
            <button type="button" className={`ma-eqbtn ${eq ? "is-on" : ""}`} aria-expanded={eq} onClick={() => (eq ? closeEq(false) : openEq())} title="עורך משוואות: שבר ב-/, חזקה ב-^, אות יוונית ב-\alpha">
              <span className="ma-eqglyph" aria-hidden>
                ∑
              </span>
              משוואה
            </button>
            <span className="ma-syms" role="toolbar" aria-label="סימנים">
              {SYMBOLS[mode].map(([s, title, shown]) => (
                <button type="button" key={s} className="ma-sym" title={title} aria-label={title} onClick={() => (remember(), insert(s))}>
                  {shown ?? s}
                </button>
              ))}
            </span>
            {unit && <span className="ma-unit">{unit}</span>}
            {action && <span className="ma-action">{action}</span>}
          </div>
        )}
        {off && unit && <span className="ma-unit is-alone">{unit}</span>}
      </div>
      {eq && (
        <div className="ma-eq">
          {/* leaving the editor (a click elsewhere) keeps it open; Enter, Esc and the buttons close it */}
          <MathEditor latex="" onChange={(v) => (eqTex.current = v)} onDone={(how) => how !== "blur" && closeEq(how === "enter")} />
          <div className="ma-eq-actions" onMouseDown={(e) => e.preventDefault()}>
            <span className="ma-eq-hint">Enter מוסיף · Esc סוגר · Tab עובר בין המשבצות</span>
            <button type="button" className="btn small" onClick={() => closeEq(false)}>
              ביטול
            </button>
            <button type="button" className="btn small primary" onClick={() => closeEq(true)}>
              הוסף לתשובה
            </button>
          </div>
        </div>
      )}
      {!noPreview && mode === "value" && value.trim() && (
        <div className={`ma-read ${val ? "" : "is-bad"}`} aria-live="polite">
          {val ? (
            <>
              <span>נקרא כ:</span> <Markdown text={`$${valueTex(val)}$`} inline />
            </>
          ) : (
            "עוד לא מספר. אפשר: 0.25, 1.2e-3, 3+4j, 5∠53°, sqrt(2)/2"
          )}
        </div>
      )}
      {!noPreview && mode === "text" && hasMath && (
        <div className="ma-preview" aria-label="תצוגה מקדימה">
          <span className="ma-preview-h">כך זה ייקרא</span>
          <Markdown text={value} />
        </div>
      )}
    </div>
  );
});
