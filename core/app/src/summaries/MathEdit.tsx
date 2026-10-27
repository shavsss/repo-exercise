import { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";
import { MathfieldElement } from "mathlive";
import { tidyTex } from "./rich";

// MathLive's fonts are KaTeX's, which the app already carries (katex.min.css, inlined);
// it must not fetch its own, and it plays no sounds.
MathfieldElement.fontsDirectory = null;
MathfieldElement.soundsDirectory = null;

/** A display equation as the reader sees it. */
export function MathView({ latex, display = true }: { latex: string; display?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(display ? latex.replace(/\\_/g, "_").replace(/\\placeholder(?:\[[^\]]*\])?\{[^}]*\}/g, "\\square") : tidyTex(latex), { displayMode: display, throwOnError: false, strict: "ignore" });
    } catch {
      return "";
    }
  }, [latex, display]);
  return html ? <span className="sm-math" dir="ltr" dangerouslySetInnerHTML={{ __html: html }} /> : <code dir="ltr">{latex}</code>;
}

/* ---------------- the equation ribbon (as in Word: structures to insert) ---------------- */
// #@ takes what is selected in the field (or is an empty slot), #? is an empty slot; Tab moves between slots.
type Tpl = [string, string?];
const EQ_GROUPS: { label: string; icon: string; items: Tpl[] }[] = [
  { label: "שבר", icon: "\\frac{x}{y}", items: [["\\frac{#@}{#?}"], ["#@/#?", "x/y"], ["\\tfrac{#@}{#?}"], ["\\binom{#?}{#?}"], ["\\frac{1}{#?}"], ["\\frac{\\pi}{2}"]] },
  { label: "עילי/תחתי", icon: "e^x", items: [["#@^{#?}"], ["#@_{#?}"], ["#@_{#?}^{#?}"], ["{}_{#?}^{#?}#@"], ["e^{#?}"], ["x^{2}"], ["x_{i}"], ["10^{#?}"]] },
  { label: "שורש", icon: "\\sqrt[n]{x}", items: [["\\sqrt{#@}"], ["\\sqrt[#?]{#@}"], ["\\sqrt[3]{#@}"], ["\\sqrt{#?^2+#?^2}"]] },
  { label: "אינטגרל", icon: "\\int_{-x}^{x}", items: [["\\int #@\\,d#?"], ["\\int_{#?}^{#?} #@\\,d#?"], ["\\int_{-\\infty}^{\\infty} #@\\,d#?"], ["\\iint #@\\,d#?\\,d#?"], ["\\iiint #@\\,dV"], ["\\oint #@\\,d#?"], ["\\oint_{C} #@\\cdot d\\vec{l}"]] },
  { label: "אופרטור גדול", icon: "\\sum_{i=0}^{n}", items: [["\\sum_{#?}^{#?} #@"], ["\\sum_{i=1}^{n} #@"], ["\\sum_{n=0}^{\\infty} #@"], ["\\prod_{#?}^{#?} #@"], ["\\bigcup_{#?} #@"], ["\\bigcap_{#?} #@"]] },
  { label: "סוגר", icon: "\\{()\\}", items: [["\\left(#@\\right)"], ["\\left[#@\\right]"], ["\\left\\{#@\\right\\}"], ["\\left|#@\\right|"], ["\\left\\|#@\\right\\|"], ["\\left\\langle #@\\right\\rangle"], ["\\left\\lfloor #@\\right\\rfloor"], ["\\left\\lceil #@\\right\\rceil"], ["\\begin{cases}#? & #?\\\\ #? & #?\\end{cases}"]] },
  { label: "פונקציה", icon: "\\sin\\theta", items: [["\\sin #@"], ["\\cos #@"], ["\\tan #@"], ["\\sin^{-1} #@"], ["\\sinh #@"], ["\\ln #@"], ["\\log_{#?} #@"], ["\\exp\\left(#@\\right)"], ["f\\left(#@\\right)"]] },
  { label: "הטעמה", icon: "\\ddot{a}", items: [["\\dot{#@}"], ["\\ddot{#@}"], ["\\hat{#@}"], ["\\bar{#@}"], ["\\overline{#@}"], ["\\vec{#@}"], ["\\tilde{#@}"], ["\\overrightarrow{#@}"], ["\\underbrace{#@}_{#?}"], ["\\overbrace{#@}^{#?}"]] },
  { label: "גבול ולוג", icon: "\\lim_{n\\to\\infty}", items: [["\\lim_{#?\\to #?} #@"], ["\\lim_{n\\to\\infty} #@"], ["\\lim_{x\\to 0} #@"], ["\\log_{#?} #@"], ["\\log_{2} #@"], ["\\ln #@"], ["\\max_{#?} #@"], ["\\min_{#?} #@"], ["\\sup_{#?} #@"]] },
  { label: "נגזרת", icon: "\\frac{dy}{dx}", items: [["\\frac{d#?}{d#?}"], ["\\frac{d^{2}#?}{d#?^{2}}"], ["\\frac{\\partial #?}{\\partial #?}"], ["\\frac{\\partial^{2} #?}{\\partial #?^{2}}"], ["\\nabla #@"], ["\\nabla\\cdot #@"], ["\\nabla\\times #@"], ["\\dot{#@}"]] },
  { label: "אופרטור", icon: "\\stackrel{\\Delta}{=}", items: [["\\approx"], ["\\ne"], ["\\le"], ["\\ge"], ["\\equiv"], ["\\propto"], ["\\sim"], ["\\pm"], ["\\times"], ["\\cdot"], ["\\to"], ["\\Rightarrow"], ["\\Leftrightarrow"], ["\\stackrel{\\text{def}}{=}"], ["\\xrightarrow{#?}"], ["\\infty"]] },
  { label: "מטריצה", icon: "\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}", items: [["\\begin{pmatrix}#?&#?\\\\#?&#?\\end{pmatrix}"], ["\\begin{bmatrix}#?&#?\\\\#?&#?\\end{bmatrix}"], ["\\begin{vmatrix}#?&#?\\\\#?&#?\\end{vmatrix}"], ["\\begin{pmatrix}#?&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{pmatrix}"], ["\\begin{pmatrix}#?\\\\#?\\end{pmatrix}"], ["\\begin{pmatrix}#?\\\\#?\\\\#?\\end{pmatrix}"], ["\\begin{pmatrix}#?&#?\\end{pmatrix}"]] },
];
const preview = (tex: string) => {
  try {
    return katex.renderToString(tex.replace(/#[@?]/g, "\\square"), { throwOnError: false, strict: "ignore" });
  } catch {
    return tex;
  }
};

/** A row of structures above the equation field; each opens a list of templates. */
function EqRibbon({ onInsert }: { onInsert: (tex: string) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const icons = useMemo(() => EQ_GROUPS.map((g) => preview(g.icon)), []);
  return (
    // mousedown is kept from the field, so it does not lose the caret (or close)
    <div className="sm-eqbar" onMouseDown={(e) => e.preventDefault()} role="toolbar" aria-label="מבנים">
      {EQ_GROUPS.map((g, i) => (
        <span key={g.label} className="sm-eqgroup">
          <button type="button" className="sm-eqbtn" aria-expanded={open === i} title={g.label} onClick={() => setOpen(open === i ? null : i)}>
            <span className="sm-eqicon" dir="ltr" dangerouslySetInnerHTML={{ __html: icons[i] }} />
            <span className="sm-eqlabel">{g.label} ▾</span>
          </button>
          {open === i && (
            <span className={`sm-eqpop ${i >= EQ_GROUPS.length / 2 ? "to-end" : ""}`} role="listbox">
              {g.items.map(([tex, shown]) => (
                <button
                  type="button"
                  key={tex}
                  title={tex.replace(/#[@?]/g, "□")}
                  onClick={() => {
                    onInsert(tex);
                    setOpen(null);
                  }}
                >
                  <span dir="ltr" dangerouslySetInnerHTML={{ __html: shown ? shown : preview(tex) }} />
                </button>
              ))}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * The visual equation editor (MathLive): / makes a fraction, ^ a power, _ a subscript,
 * \sigma a Greek letter, and LaTeX can be pasted. Enter or Escape finishes.
 */
export function MathEditor({ latex, onChange, onDone, autoFocus = true }: { latex: string; onChange: (v: string) => void; onDone: (how: "enter" | "escape" | "blur") => void; autoFocus?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<MathfieldElement | null>(null);
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
      // the field's final value, whatever events came before (a template inserted, then typed in)
      if (how !== "escape") cb.current.onChange(mf.value);
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
    field.current = mf;
    if (autoFocus) {
      // at once, so the first key typed after "$$" lands in the field; again after layout
      mf.focus();
      requestAnimationFrame(() => !mf.hasFocus() && mf.focus());
    }
    return () => mf.remove();
    // the field owns its value while it is open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="sm-mathedit-wrap">
      <EqRibbon
        onInsert={(tex) => {
          const mf = field.current;
          if (!mf) return;
          mf.focus();
          mf.insert(tex, { selectionMode: "placeholder", format: "latex" });
          cb.current.onChange(mf.value);
        }}
      />
      <div ref={box} className="sm-mathedit" />
    </div>
  );
}
