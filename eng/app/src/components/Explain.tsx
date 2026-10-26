// "הסבר פשוט": a small side panel beside the lesson that explains a term or a paragraph the
// learner did not follow, in the simplest words. A cheap, quick model; only the section being
// read as context; no memory, no history, nothing saved. The main tutor is not touched.
// Same file in both labs.
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Runtime } from "../runtime";
import { Markdown, MdContext } from "./Markdown";
import { Icon } from "./Icon";

const EXPLAIN_MODEL = "claude-haiku-5-5";
/** if the quick model is not available here, the usual one answers (and the panel says so) */
const FALLBACK_MODEL = "claude-opus-5-5";
const SECTION_CHARS = 12_000;

const INSTRUCTIONS = `אתה עוזר הסבר קצר שיושב בצד של שיעור. הלומד סימן ביטוי או פסקה שלא הבין, או שאל שאלה פשוטה.
ענה בעברית, קצר (בערך 120–220 מילים), בדיוק במבנה הזה:
**מושגים:** הגדרה קלאסית קצרה לכל מושג שעלול להיות לא מובן בקטע, שורה לכל מושג.
**הרעיון בפשטות:** 2–4 משפטים שאומרים מה הקטע אומר, בלי ז'רגון.
**דוגמה קטנה:** דוגמה מספרית אחת, או טבלה זעירה, שמראה את הרעיון.
כללים: הסתמך על הסעיף שבהקשר ועל הגדרות בסיס מוכרות בלבד; אל תוסיף עובדות חדשות על הנושא ואל תרחיב מעבר לשאלה. נוסחאות ב-$…$. בלי פתיח, בלי סיכום ובלי שאלות חזרה.`;

/** Text of a range, with each equation as $…$ (KaTeX keeps its LaTeX in an annotation). */
function textOf(r: Range) {
  const box = document.createElement("div");
  box.appendChild(r.cloneContents());
  box.querySelectorAll(".katex-display, .katex").forEach((k) => {
    if (!box.contains(k)) return;
    const tex = k.querySelector('annotation[encoding="application/x-tex"]')?.textContent?.trim();
    k.replaceWith(tex ? (k.classList.contains("katex-display") ? `\n$$${tex}$$\n` : `$${tex}$`) : "");
  });
  box.querySelectorAll("button, svg, script, style, .no-copy").forEach((x) => x.remove());
  box.querySelectorAll("br").forEach((x) => x.replaceWith("\n"));
  box.querySelectorAll("p, div, li, h2, h3, h4, tr, pre, blockquote").forEach((x) => x.append("\n"));
  return (box.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * The section of the lesson that holds a point: from the heading above it to the next heading
 * of the same or a higher level. With no point, the section being read (the last heading above
 * the top of the view).
 */
function sectionAt(scroll: HTMLElement, at: Node | null) {
  const heads = [...scroll.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]")];
  let head: HTMLElement | null = null;
  if (at) {
    for (const h of heads) if (h.compareDocumentPosition(at) & Node.DOCUMENT_POSITION_FOLLOWING) head = h;
  } else {
    const top = scroll.getBoundingClientRect().top + 90;
    for (const h of heads) if (h.getBoundingClientRect().top <= top) head = h;
  }
  const r = document.createRange();
  if (head) {
    r.setStartBefore(head);
    const lvl = head.tagName;
    const next = heads.slice(heads.indexOf(head) + 1).find((h) => h.tagName <= lvl || h.tagName === "H2");
    const end = next ?? head.closest(".prose") ?? scroll;
    if (next) r.setEndBefore(next);
    else r.setEndAfter(end.lastChild ?? end);
  } else {
    r.selectNodeContents(scroll.querySelector(".prose") ?? scroll);
  }
  const t = textOf(r);
  return { title: head?.textContent?.trim() ?? "", text: t.length > SECTION_CHARS ? t.slice(0, SECTION_CHARS) + "\n…" : t };
}

export function ExplainPanel({ rt, scrollRef, lessonKey, lessonTitle }: { rt: Runtime | null; scrollRef: RefObject<HTMLDivElement | null>; lessonKey: string; lessonTitle: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [model, setModel] = useState("");
  const [chip, setChip] = useState<{ top: number; left: number; text: string; node: Node } | null>(null);
  const ctl = useRef<AbortController | null>(null);

  // a new lesson: nothing carries over
  useEffect(() => {
    ctl.current?.abort();
    setQ("");
    setAsked("");
    setAnswer("");
    setErr("");
    setModel("");
  }, [lessonKey]);

  // text selected in the lesson: a small "הסבר" button beside it
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const check = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return setChip(null);
      const r = sel.getRangeAt(0);
      if (!scroll.contains(r.commonAncestorContainer) || !(r.commonAncestorContainer.parentElement ?? r.commonAncestorContainer as Element)?.closest?.(".prose")) return setChip(null);
      const text = textOf(r);
      if (!text.trim() || text.length > 3000) return setChip(null);
      const rect = r.getBoundingClientRect();
      setChip({ top: Math.max(8, rect.top - 40), left: Math.min(window.innerWidth - 110, Math.max(8, rect.left + rect.width / 2 - 45)), text, node: r.startContainer });
    };
    const up = () => setTimeout(check, 0);
    const hide = () => setChip(null);
    scroll.addEventListener("mouseup", up);
    scroll.addEventListener("keyup", up);
    scroll.addEventListener("scroll", hide, { passive: true });
    return () => {
      scroll.removeEventListener("mouseup", up);
      scroll.removeEventListener("keyup", up);
      scroll.removeEventListener("scroll", hide);
    };
  }, [scrollRef]);

  const ask = async (question: string, at: Node | null) => {
    const scroll = scrollRef.current;
    if (!rt?.sample || !scroll || !question.trim()) return;
    ctl.current?.abort();
    const c = new AbortController();
    ctl.current = c;
    const sec = sectionAt(scroll, at);
    const prompt = `${INSTRUCTIONS}\n\n<lesson>${lessonTitle}</lesson>\n<section title="${sec.title.replace(/"/g, "'")}">\n${sec.text}\n</section>\n\n<question>\n${question.trim()}\n</question>`;
    setAsked(question.trim());
    setAnswer("");
    setErr("");
    setModel("");
    setBusy(true);
    const run = (m: string) => rt.sample!(prompt, { model: m, modelTier: "quick", effort: "low", signal: c.signal, onText: ({ text }) => setAnswer(text) });
    try {
      let res;
      try {
        res = await run(EXPLAIN_MODEL);
      } catch (e) {
        if (c.signal.aborted) throw e;
        res = await run(FALLBACK_MODEL);
      }
      setAnswer(res.text);
      setModel(res.modelApplied ?? "");
    } catch (e) {
      if (!c.signal.aborted) setErr((e as { message?: string })?.message ?? "ההסבר לא הגיע. נסה שוב.");
    } finally {
      if (ctl.current === c) setBusy(false);
    }
  };

  const chipEl = chip && (
    <button
      className="explain-chip"
      style={{ top: chip.top, left: chip.left }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        setOpen(true);
        setQ("");
        setChip(null);
        void ask(chip.text, chip.node);
      }}
    >
      <Icon name="think" size={14} /> הסבר פשוט
    </button>
  );

  if (!open)
    return (
      <>
        <button className="explain-rail" onClick={() => setOpen(true)} aria-label="הסבר פשוט: ביטוי או פסקה שלא הבנת" title="הסבר פשוט: ביטוי או פסקה שלא הבנת. אפשר גם לסמן טקסט בשיעור.">
          <Icon name="think" size={16} />
          <span>הסבר פשוט</span>
        </button>
        {chipEl}
      </>
    );
  return (
    <>
      <aside className="explain-panel" aria-label="הסבר פשוט">
        <header className="explain-head">
          <span>הסבר פשוט</span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="סגור" title="סגור">
            <Icon name="close" size={14} />
          </button>
        </header>
        <form
          className="explain-ask"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(q, null);
            setQ("");
          }}
        >
          <textarea
            value={q}
            rows={3}
            placeholder="מושג או משפט שלא הבנת, או סמן טקסט בשיעור"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void ask(q, null);
                setQ("");
              }
            }}
          />
          <button className="btn small primary" disabled={!q.trim() || !rt?.sample}>
            הסבר
          </button>
        </form>
        <div className="explain-body">
          {!asked && <p className="explain-hint">הסבר קצר: הגדרות, הרעיון בפשטות ודוגמה קטנה. מקבל רק את הסעיף שאתה קורא, לא זוכר שאלות קודמות ולא נשמר.</p>}
          {asked && <blockquote className="explain-q">{asked.length > 220 ? asked.slice(0, 220) + "…" : asked}</blockquote>}
          {busy && !answer && <div className="explain-wait">חושב…</div>}
          {answer && (
            <MdContext.Provider value={{ live: busy, idPrefix: "ex", openSource: () => {} }}>
              <div className="prose explain-answer">
                <Markdown text={answer} />
              </div>
            </MdContext.Provider>
          )}
          {err && <div className="banner banner-error">{err}</div>}
          {model && !busy && <div className="explain-model">{/haiku/i.test(model) ? "Haiku" : `המודל הרגיל (${model}), כי Haiku לא זמין כאן`}</div>}
        </div>
      </aside>
      {chipEl}
    </>
  );
}
