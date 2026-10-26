import { useEffect, useMemo, useRef } from "react";
import katex from "katex";
import { MathfieldElement } from "mathlive";

// MathLive's fonts are KaTeX's, which the app already carries (katex.min.css, inlined);
// it must not fetch its own, and it plays no sounds.
MathfieldElement.fontsDirectory = null;
MathfieldElement.soundsDirectory = null;

/** A display equation as the reader sees it. */
export function MathView({ latex, display = true }: { latex: string; display?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode: display, throwOnError: false, strict: "ignore" });
    } catch {
      return "";
    }
  }, [latex, display]);
  return html ? <span className="sm-math" dir="ltr" dangerouslySetInnerHTML={{ __html: html }} /> : <code dir="ltr">{latex}</code>;
}

/**
 * The visual equation editor (MathLive): / makes a fraction, ^ a power, _ a subscript,
 * \sigma a Greek letter, and LaTeX can be pasted. Enter or Escape finishes.
 */
export function MathEditor({ latex, onChange, onDone, autoFocus = true }: { latex: string; onChange: (v: string) => void; onDone: (how: "enter" | "escape" | "blur") => void; autoFocus?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const cb = useRef({ onChange, onDone });
  cb.current = { onChange, onDone };
  useEffect(() => {
    const mf = new MathfieldElement();
    mf.value = latex;
    mf.smartFence = true;
    mf.mathVirtualKeyboardPolicy = "auto";
    mf.setAttribute("dir", "ltr");
    mf.className = "sm-mathfield";
    let done = false;
    const finish = (how: "enter" | "escape" | "blur") => {
      if (done) return;
      done = true;
      cb.current.onDone(how);
    };
    mf.addEventListener("input", () => cb.current.onChange(mf.value));
    mf.addEventListener("change", () => finish("enter"));
    mf.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finish("escape");
      }
    });
    mf.addEventListener("focusout", () => setTimeout(() => !mf.hasFocus() && finish("blur"), 120));
    box.current!.appendChild(mf);
    if (autoFocus) {
      // at once, so the first key typed after "$$" lands in the field; again after layout
      mf.focus();
      requestAnimationFrame(() => !mf.hasFocus() && mf.focus());
    }
    return () => mf.remove();
    // the field owns its value while it is open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div ref={box} className="sm-mathedit" />;
}
