// "הסבר פשוט": a small side panel beside the lesson. A marked term or paragraph gets the
// simplest explanation (terms, the idea, a small example); a typed question gets a short
// conversation, which may tie the idea to earlier lessons (the course memory, read only) and to
// the world. A cheap, quick model; the section being read and the last few turns as context;
// nothing saved, and a new lesson starts a new conversation. The main tutor is not touched.
// Same file in both labs.
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Runtime } from "../runtime";
import { Markdown, MdContext } from "./Markdown";
import { Icon } from "./Icon";

const EXPLAIN_MODEL = "claude-haiku-5-5";
/** if the quick model is not available here, the usual one answers (and the panel says so) */
const FALLBACK_MODEL = "claude-opus-5-5";
const SECTION_CHARS = 12_000;
const MEMORY_CHARS = 6_000;
/** turns of this conversation sent with a new question */
const KEEP_TURNS = 4;

const COMMON = `אתה עוזר קטן שיושב בצד של שיעור, ומדבר עם הלומד בעברית פשוטה וחמה, כמו חבר שמבין בחומר. המורה הראשי כותב את השיעור; אתה רק עוזר להבין אותו.
יש לך: את הסעיף שהלומד קורא (<section>), את זיכרון הקורס (<course_memory>: מה כבר נלמד בשיעורים קודמים), ואת השיחה הקצרה שלכם עד עכשיו (<conversation>).
נוסחאות ב-$…$. בלי פתיח ובלי סיכום. אל תמציא: אם משהו לא בסעיף, לא בזיכרון הקורס ולא ידע כללי מוכר, אמור שאתה לא בטוח והצע לשאול את המורה בצאט הראשי.`;

const EXCERPT = `${COMMON}
הלומד סימן קטע שלא הבין (<question>). ענה קצר (בערך 120–220 מילים), במבנה הזה:
**מושגים:** הגדרה קלאסית קצרה לכל מושג שעלול להיות לא מובן בקטע, שורה לכל מושג.
**הרעיון בפשטות:** 2–4 משפטים שאומרים מה הקטע אומר, בלי ז'רגון.
**דוגמה קטנה:** דוגמה מספרית אחת, או טבלה זעירה, שמראה את הרעיון.`;

const CHAT = `${COMMON}
הלומד שאל שאלה (<question>), אולי המשך לשיחה. ענה כמו בשיחה: ישר לעניין, בערך 60–180 מילים, בלי כותרות ובלי מבנה קבוע.
- שאלה רעיונית ("זה קשור ל…?", "למה זה ככה?", "איפה רואים את זה בעולם?"): ענה על הקשר עצמו. חבר לשיעורים קודמים רק אם הם באמת מופיעים בזיכרון הקורס, ואמור באיזה שיעור או נושא. חבר לעולם בדוגמה אחת מוחשית.
- אם הלומד טועה, אמור את זה בעדינות ותקן.
- מותר לשאול בחזרה שאלה קצרה אחת אם השאלה לא ברורה.`;

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
export function sectionAt(scroll: HTMLElement, at: Node | null) {
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

interface Turn {
  q: string;
  a: string;
  /** a marked excerpt (explained by the fixed structure), or a question in the conversation */
  kind: "excerpt" | "chat";
  model?: string;
}

export function ExplainPanel({ rt, scrollRef, lessonKey, lessonTitle, memory = "" }: { rt: Runtime | null; scrollRef: RefObject<HTMLDivElement | null>; lessonKey: string; lessonTitle: string; memory?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const [chip, setChip] = useState<{ top: number; left: number; text: string; node: Node } | null>(null);
  const ctl = useRef<AbortController | null>(null);

  // a new lesson: a new conversation
  useEffect(() => {
    ctl.current?.abort();
    setQ("");
    setTurns([]);
    setErr("");
  }, [lessonKey]);
  // the newest answer in view
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [turns]);

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

  const ask = async (question: string, at: Node | null, kind: Turn["kind"]) => {
    const scroll = scrollRef.current;
    if (!rt?.sample || !scroll || !question.trim() || busy) return;
    ctl.current?.abort();
    const c = new AbortController();
    ctl.current = c;
    const sec = sectionAt(scroll, at);
    const past = turns.slice(-KEEP_TURNS).filter((t) => t.a);
    const conversation = past.length ? `<conversation>\n${past.map((t) => `הלומד: ${t.q}\nאתה: ${t.a}`).join("\n\n")}\n</conversation>\n\n` : "";
    const mem = memory.trim() ? `<course_memory>\n${memory.length > MEMORY_CHARS ? memory.slice(0, MEMORY_CHARS) + "\n…" : memory}\n</course_memory>\n\n` : "";
    const prompt = `${kind === "excerpt" ? EXCERPT : CHAT}\n\n<lesson>${lessonTitle}</lesson>\n<section title="${sec.title.replace(/"/g, "'")}">\n${sec.text}\n</section>\n\n${mem}${conversation}<question>\n${question.trim()}\n</question>`;
    const turn: Turn = { q: question.trim(), a: "", kind };
    setTurns((ts) => [...ts, turn]);
    const setLast = (patch: Partial<Turn>) => setTurns((ts) => ts.map((t, i) => (i === ts.length - 1 ? { ...t, ...patch } : t)));
    setErr("");
    setBusy(true);
    const run = (m: string) => rt.sample!(prompt, { model: m, modelTier: "quick", effort: "low", signal: c.signal, onText: ({ text }) => setLast({ a: text }) });
    try {
      let res;
      try {
        res = await run(EXPLAIN_MODEL);
      } catch (e) {
        if (c.signal.aborted) throw e;
        res = await run(FALLBACK_MODEL);
      }
      setLast({ a: res.text, model: res.modelApplied ?? "" });
    } catch (e) {
      if (!c.signal.aborted) {
        setErr((e as { message?: string })?.message ?? "ההסבר לא הגיע. נסה שוב.");
        setTurns((ts) => (ts.length && !ts[ts.length - 1].a ? ts.slice(0, -1) : ts));
      }
    } finally {
      if (ctl.current === c) setBusy(false);
    }
  };
  const send = () => {
    void ask(q, null, "chat");
    setQ("");
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
        void ask(chip.text, chip.node, "excerpt");
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
        <div className="explain-body" ref={bodyRef}>
          {!turns.length && (
            <p className="explain-hint">
              סמן קטע בשיעור ולחץ "הסבר פשוט" להסבר קצר (מושגים, הרעיון, דוגמה), או שאל כאן כמו בשיחה: "זה קשור למה שלמדנו על…?", "איפה רואים את זה בעולם?". השיחה נמחקת כשעוברים שיעור ולא נשמרת.
            </p>
          )}
          {turns.map((t, i) => (
            <div key={i} className="explain-turn">
              <blockquote className="explain-q">{t.q.length > 220 ? t.q.slice(0, 220) + "…" : t.q}</blockquote>
              {busy && i === turns.length - 1 && !t.a && <div className="explain-wait">חושב…</div>}
              {t.a && (
                <MdContext.Provider value={{ live: busy && i === turns.length - 1, idPrefix: `ex${i}`, openSource: () => {} }}>
                  <div className="prose explain-answer">
                    <Markdown text={t.a} />
                  </div>
                </MdContext.Provider>
              )}
              {t.model && !/haiku/i.test(t.model) && <div className="explain-model">המודל הרגיל ({t.model}), כי Haiku לא זמין כאן</div>}
            </div>
          ))}
          {err && <div className="banner banner-error">{err}</div>}
        </div>
        <form
          className="explain-ask"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={q}
            rows={2}
            placeholder={turns.length ? "שאלת המשך…" : "שאלה, מושג או קשר לחומר קודם"}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
          />
          <div className="explain-actions">
            <button className="btn small primary" disabled={!q.trim() || !rt?.sample || busy}>
              שלח
            </button>
            {turns.length > 0 && (
              <button type="button" className="btn small" onClick={() => (ctl.current?.abort(), setTurns([]), setErr(""))}>
                שיחה חדשה
              </button>
            )}
          </div>
        </form>
      </aside>
      {chipEl}
    </>
  );
}
