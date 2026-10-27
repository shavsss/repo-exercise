// "מחברת": the lesson's scratch notebook, on the left of the lesson. Pages of drawings (pen,
// line, arrow, eraser; mouse, pen or touch) and worked solutions (lines of text and equations,
// with the summaries' equation editor). Saved per lesson in profile/scratch/<module>__<lesson>,
// apart from the summaries. "בדוק את הפתרון" sends the page (drawings as pictures) to the
// main model in a call of its own, which does not enter the lesson's conversation.
// Same file in both labs.
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Runtime } from "../runtime";
import { Markdown, MdContext } from "./Markdown";
import { Icon } from "./Icon";
import { MathEditor, MathView } from "../summaries/MathEdit";
import { sectionAt } from "./Explain";

const CHECK_MODEL = "claude-opus-5-5";
const VB_W = 1000;

type Tool = "pen" | "line" | "arrow" | "erase";
type Bg = "plain" | "grid" | "axes";
interface Stroke {
  c: string;
  w: number;
  /** x, y, x, y, … in the drawing's own units (1000 wide) */
  pts: number[];
  k?: "line" | "arrow";
}
type PadBlock = { id: string; t: "draw"; h: number; bg: Bg; strokes: Stroke[] } | { id: string; t: "text"; text: string } | { id: string; t: "math"; latex: string };
interface Page {
  id: string;
  title: string;
  blocks: PadBlock[];
  /** the last check of this page */
  check?: string;
}
interface Pad {
  pages: Page[];
  updatedAt: number;
}

const COLORS = ["#22261d", "#b3261e", "#1f6fb2", "#2e7d32", "#b0590c"];
const uid = () => Math.random().toString(36).slice(2, 10);
const newPage = (n: number): Page => ({ id: uid(), title: `דף ${n}`, blocks: [{ id: uid(), t: "draw", h: 420, bg: "grid", strokes: [] }, { id: uid(), t: "text", text: "" }] });
const emptyPad = (): Pad => ({ pages: [newPage(1)], updatedAt: 0 });

const pathOf = (s: Stroke) => {
  const p = s.pts;
  if (p.length < 2) return "";
  let d = `M${p[0]} ${p[1]}`;
  // a pen stroke is smoothed through the midpoints; a line or an arrow is straight
  if (s.k) d += ` L${p[p.length - 2]} ${p[p.length - 1]}`;
  else
    for (let i = 2; i < p.length - 2; i += 2) d += ` Q${p[i]} ${p[i + 1]} ${(p[i] + p[i + 2]) / 2} ${(p[i + 1] + p[i + 3]) / 2}`;
  if (!s.k && p.length >= 4) d += ` L${p[p.length - 2]} ${p[p.length - 1]}`;
  return d;
};
const arrowHead = (s: Stroke) => {
  const p = s.pts;
  if (s.k !== "arrow" || p.length < 4) return "";
  const [x1, y1, x2, y2] = [p[0], p[1], p[p.length - 2], p[p.length - 1]];
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = 10 + s.w * 3;
  return `M${x2} ${y2} L${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} M${x2} ${y2} L${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)}`;
};

function BgPattern({ bg, h }: { bg: Bg; h: number }) {
  if (bg === "plain") return null;
  const lines = [];
  for (let x = 25; x < VB_W; x += 25) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={h} />);
  for (let y = 25; y < h; y += 25) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={VB_W} y2={y} />);
  return (
    <g className="pad-bg">
      {lines}
      {bg === "axes" && (
        <g className="pad-axes">
          <line x1={40} y1={h / 2} x2={VB_W - 20} y2={h / 2} />
          <line x1={VB_W / 2} y1={h - 20} x2={VB_W / 2} y2={20} />
          <path d={`M${VB_W - 20} ${h / 2} l-12 -6 M${VB_W - 20} ${h / 2} l-12 6 M${VB_W / 2} 20 l-6 12 M${VB_W / 2} 20 l6 12`} />
        </g>
      )}
    </g>
  );
}

/** One drawing: an SVG the pointer draws on. */
function Drawing({ b, onChange }: { b: Extract<PadBlock, { t: "draw" }>; onChange: (p: Partial<Extract<PadBlock, { t: "draw" }>>) => void }) {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(2.5);
  const [live, setLive] = useState<Stroke | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const penActive = useRef(false);
  const at = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const k = VB_W / r.width;
    return [Math.round((e.clientX - r.left) * k * 10) / 10, Math.round((e.clientY - r.top) * k * 10) / 10];
  };
  const eraseAt = (x: number, y: number) => {
    const keep = b.strokes.filter((s) => {
      for (let i = 0; i < s.pts.length; i += 2) if (Math.hypot(s.pts[i] - x, s.pts[i + 1] - y) < 14) return false;
      // a straight line is hit along its length too
      if (s.k && s.pts.length >= 4) {
        const [x1, y1, x2, y2] = [s.pts[0], s.pts[1], s.pts[s.pts.length - 2], s.pts[s.pts.length - 1]];
        const L2 = (x2 - x1) ** 2 + (y2 - y1) ** 2 || 1;
        const t = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / L2));
        if (Math.hypot(x1 + t * (x2 - x1) - x, y1 + t * (y2 - y1) - y) < 12) return false;
      }
      return true;
    });
    if (keep.length !== b.strokes.length) onChange({ strokes: keep });
  };
  return (
    <div className="pad-draw">
      <div className="pad-tools" role="toolbar" aria-label="כלי שרטוט">
        {(
          [
            ["pen", "עט"],
            ["line", "קו"],
            ["arrow", "חץ"],
            ["erase", "מחק"],
          ] as [Tool, string][]
        ).map(([t, name]) => (
          <button key={t} className="pad-tbtn" aria-pressed={tool === t} onClick={() => setTool(t)}>
            {name}
          </button>
        ))}
        <span className="pad-sep" />
        {COLORS.map((c) => (
          <button key={c} className="pad-color" style={{ background: c }} aria-pressed={color === c} aria-label="צבע" onClick={() => (setColor(c), tool === "erase" && setTool("pen"))} />
        ))}
        <span className="pad-sep" />
        {[1.5, 2.5, 5].map((w) => (
          <button key={w} className="pad-tbtn pad-width" aria-pressed={width === w} title="עובי" onClick={() => setWidth(w)}>
            <i style={{ height: w }} />
          </button>
        ))}
        <span className="pad-sep" />
        <select className="pad-select" value={b.bg} aria-label="רקע" onChange={(e) => onChange({ bg: e.target.value as Bg })}>
          <option value="grid">משבצות</option>
          <option value="axes">צירים</option>
          <option value="plain">חלק</option>
        </select>
        <button className="pad-tbtn" title="הגדל את השטח" onClick={() => onChange({ h: Math.min(2000, b.h + 160) })}>
          ↕+
        </button>
        <button className="pad-tbtn" title="נקה את השרטוט" disabled={!b.strokes.length} onClick={() => onChange({ strokes: [] })}>
          נקה
        </button>
        <button className="pad-tbtn" title="בטל את הקו האחרון" disabled={!b.strokes.length} onClick={() => onChange({ strokes: b.strokes.slice(0, -1) })}>
          ↶
        </button>
      </div>
      <svg
        ref={svg}
        className={`pad-svg tool-${tool}`}
        viewBox={`0 0 ${VB_W} ${b.h}`}
        style={{ aspectRatio: `${VB_W} / ${b.h}` }}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          // no text selection or dragging starts here (a drag of the selection cancelled the next stroke)
          e.preventDefault();
          window.getSelection()?.removeAllRanges();
          // with a pen in use, the hand resting on the screen draws nothing
          if (e.pointerType === "pen") penActive.current = true;
          else if (e.pointerType === "touch" && penActive.current) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          const [x, y] = at(e);
          if (tool === "erase") return eraseAt(x, y);
          setLive({ c: color, w: width, pts: [x, y, x, y], ...(tool === "line" || tool === "arrow" ? { k: tool } : {}) });
        }}
        onPointerMove={(e) => {
          if (!(e.buttons & 1) && e.pointerType === "mouse") return;
          const [x, y] = at(e);
          if (tool === "erase") {
            if (e.buttons & 1 || e.pointerType !== "mouse") eraseAt(x, y);
            return;
          }
          if (!live) return;
          if (live.k) setLive({ ...live, pts: [live.pts[0], live.pts[1], x, y] });
          else {
            const p = live.pts;
            if (Math.hypot(p[p.length - 2] - x, p[p.length - 1] - y) > 1.5) setLive({ ...live, pts: [...p, x, y] });
          }
        }}
        onPointerUp={() => {
          if (live && live.pts.length >= 4) onChange({ strokes: [...b.strokes, live] });
          setLive(null);
        }}
        onPointerCancel={() => setLive(null)}
      >
        <rect x={0} y={0} width={VB_W} height={b.h} fill="var(--pad-paper)" />
        <BgPattern bg={b.bg} h={b.h} />
        {[...b.strokes, ...(live ? [live] : [])].map((s, i) => (
          <g key={i} stroke={s.c} strokeWidth={s.w} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={pathOf(s)} />
            {s.k === "arrow" && <path d={arrowHead(s)} />}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** A drawing as a PNG, for the check (white paper, the grid kept). */
async function drawingPng(svgEl: SVGSVGElement): Promise<Blob | null> {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.querySelectorAll("rect").forEach((r) => r.setAttribute("fill", "#ffffff"));
  clone.querySelectorAll(".pad-bg line").forEach((l) => l.setAttribute("stroke", "#e3e3e3"));
  clone.querySelectorAll(".pad-axes line, .pad-axes path").forEach((l) => (l.setAttribute("stroke", "#888"), l.setAttribute("fill", "none")));
  const [, , w, h] = (clone.getAttribute("viewBox") ?? "0 0 1000 400").split(" ").map(Number);
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise((ok, bad) => ((img.onload = ok), (img.onerror = bad), (img.src = url)));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(img, 0, 0);
    return await new Promise((ok) => c.toBlob(ok, "image/png"));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const CHECK = `אתה בודק פתרון שהלומד כתב במחברת שליד שיעור. ענה בעברית, קצר (עד כ-200 מילים):
1. מה נכון בפתרון (משפט אחד).
2. הטעות הראשונה, אם יש: באיזו שורה או באיזה חלק של השרטוט, מה לא נכון ולמה.
3. איך מתקנים, ברמז או בצעד אחד, בלי לפתור את כל התרגיל מחדש (אלא אם הלומד ביקש פתרון מלא).
אם הכל נכון, אמור זאת והוסף בדיקה אחת (ממדים, מקרה קצה או סדר גודל) שמאשרת את התוצאה. נוסחאות ב-$…$. השרטוטים מצורפים כתמונות, לפי הסדר.`;

export function Scratchpad({ rt, scrollRef, lessonKey, lessonTitle, onClose }: { rt: Runtime | null; scrollRef: RefObject<HTMLDivElement | null>; lessonKey: string; lessonTitle: string; onClose: () => void }) {
  const [pad, setPad] = useState<Pad | null>(null);
  const [pageId, setPageId] = useState<string>("");
  const [size, setSize] = useState<"normal" | "wide" | "full">(() => {
    try {
      return (localStorage.getItem("pad-size") as "normal" | "wide" | "full") || "normal";
    } catch {
      return "normal";
    }
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [err, setErr] = useState("");
  const key = lessonKey.replace(/[^A-Za-z0-9_.-]/g, "_");
  const saveTimer = useRef(0);
  const body = useRef<HTMLDivElement>(null);

  // the lesson's notebook
  useEffect(() => {
    let off = false;
    setPad(null);
    (async () => {
      const d = rt?.store ? await rt.store.loadScratch(key).catch(() => null) : null;
      const p = d && Array.isArray((d as unknown as Pad).pages) && (d as unknown as Pad).pages.length ? (d as unknown as Pad) : emptyPad();
      if (!off) {
        setPad(p);
        setPageId(p.pages[0].id);
      }
    })();
    return () => {
      off = true;
    };
  }, [key, rt]);

  const change = (fn: (p: Pad) => Pad) =>
    setPad((old) => {
      if (!old) return old;
      const next = { ...fn(old), updatedAt: Date.now() };
      clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => void rt?.store?.saveScratch(key, next as unknown as Record<string, unknown>).catch(() => {}), 800);
      return next;
    });
  const page = pad?.pages.find((p) => p.id === pageId) ?? pad?.pages[0];
  const setPage = (fn: (p: Page) => Page) => change((d) => ({ ...d, pages: d.pages.map((p) => (p.id === page?.id ? fn(p) : p)) }));
  const setBlock = (id: string, patch: Partial<PadBlock>) => setPage((p) => ({ ...p, blocks: p.blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as PadBlock) : b)) }));
  const add = (b: PadBlock) => {
    setPage((p) => ({ ...p, blocks: [...p.blocks, b] }));
    if (b.t === "math") setEditing(b.id);
    requestAnimationFrame(() => body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" }));
  };
  const resize = (s: typeof size) => {
    setSize(s);
    try {
      localStorage.setItem("pad-size", s);
    } catch {
      // for this visit only
    }
  };

  const check = async () => {
    if (!rt?.sample || !page) return;
    setErr("");
    setChecking(true);
    try {
      const lines: string[] = [];
      const images: Blob[] = [];
      let n = 0;
      const svgs = Array.from(body.current?.querySelectorAll<SVGSVGElement>(".pad-svg") ?? []);
      for (const b of page.blocks) {
        if (b.t === "text" && b.text.trim()) lines.push(b.text.trim());
        if (b.t === "math" && b.latex.trim()) lines.push(`$$${b.latex}$$`);
        if (b.t === "draw" && b.strokes.length) {
          const el = svgs[page.blocks.filter((x) => x.t === "draw").indexOf(b)];
          const png = el && rt.canSendImages ? await drawingPng(el) : null;
          if (png) {
            images.push(png);
            lines.push(`[שרטוט ${++n}: התמונה המצורפת מספר ${images.length}]`);
          } else lines.push(`[שרטוט ${++n}: לא נשלח כתמונה]`);
        }
      }
      if (!lines.length) return setErr("הדף ריק: אין מה לבדוק.");
      const sec = scrollRef.current ? sectionAt(scrollRef.current, null) : { title: "", text: "" };
      const prompt = `${CHECK}\n\n<lesson>${lessonTitle}</lesson>\n<section title="${sec.title.replace(/"/g, "'")}">\n${sec.text.slice(0, 8000)}\n</section>\n\n<page title="${page.title}">\n${lines.join("\n")}\n</page>`;
      setPage((p) => ({ ...p, check: "" }));
      const res = await rt.sample([{ role: "user", content: prompt }], {
        model: CHECK_MODEL,
        effort: "low",
        ...(images.length ? { images } : {}),
        onText: ({ text }) => setPage((p) => ({ ...p, check: text })),
      });
      setPage((p) => ({ ...p, check: res.text }));
    } catch (e) {
      setErr((e as { message?: string })?.message ?? "הבדיקה לא הגיעה. נסה שוב.");
    } finally {
      setChecking(false);
    }
  };

  const pageNo = useMemo(() => (pad && page ? pad.pages.indexOf(page) : 0), [pad, page]);
  return (
    <aside className={`pad-panel pad-${size}`} aria-label="מחברת">
      <header className="pad-head">
        <span className="pad-title">מחברת</span>
        {pad && page && (
          <span className="pad-pages">
            <select value={page.id} aria-label="דף" onChange={(e) => setPageId(e.target.value)}>
              {pad.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button
              className="pad-tbtn"
              title="דף חדש"
              onClick={() => {
                const np = newPage(pad.pages.length + 1);
                change((d) => ({ ...d, pages: [...d.pages, np] }));
                setPageId(np.id);
              }}
            >
              + דף
            </button>
          </span>
        )}
        <span className="pad-size" role="group" aria-label="גודל">
          {(
            [
              ["normal", "צר"],
              ["wide", "רחב"],
              ["full", "מלא"],
            ] as const
          ).map(([s, name]) => (
            <button key={s} className="pad-tbtn" aria-pressed={size === s} onClick={() => resize(s)}>
              {name}
            </button>
          ))}
        </span>
        <button className="icon-btn" onClick={onClose} aria-label="סגור את המחברת" title="סגור">
          <Icon name="close" size={14} />
        </button>
      </header>
      {!pad || !page ? (
        <div className="pad-body">
          <p className="explain-wait">טוען…</p>
        </div>
      ) : (
        <>
          <div className="pad-body" ref={body}>
            <input className="pad-page-title" value={page.title} aria-label="שם הדף" onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))} />
            {page.blocks.map((b) => (
              <div key={b.id} className={`pad-block is-${b.t}`}>
                {b.t === "draw" && <Drawing b={b} onChange={(p) => setBlock(b.id, p)} />}
                {b.t === "text" && (
                  <textarea
                    className="pad-text"
                    value={b.text}
                    rows={Math.max(2, b.text.split("\n").length)}
                    placeholder="שורת פתרון, הסבר או תוצאה. משוואה: + משוואה"
                    onChange={(e) => setBlock(b.id, { text: e.target.value })}
                  />
                )}
                {b.t === "math" &&
                  (editing === b.id ? (
                    <MathEditor latex={b.latex} onChange={(v) => setBlock(b.id, { latex: v })} onDone={() => setEditing(null)} />
                  ) : (
                    <button className="pad-math" onClick={() => setEditing(b.id)} title="לחץ לעריכה">
                      {b.latex.trim() ? <MathView latex={b.latex} /> : <span className="muted">לחץ כדי לכתוב משוואה</span>}
                    </button>
                  ))}
                <button className="pad-del" title="מחק את הבלוק" aria-label="מחק את הבלוק" onClick={() => setPage((p) => ({ ...p, blocks: p.blocks.filter((x) => x.id !== b.id) }))}>
                  ×
                </button>
              </div>
            ))}
            {(page.check || checking || err) && (
              <section className="pad-check" aria-live="polite">
                <h4>בדיקת הפתרון</h4>
                {checking && !page.check && <div className="explain-wait">בודק…</div>}
                {page.check && (
                  <MdContext.Provider value={{ live: checking, idPrefix: `pad${pageNo}`, openSource: () => {} }}>
                    <div className="prose explain-answer">
                      <Markdown text={page.check} />
                    </div>
                  </MdContext.Provider>
                )}
                {err && <div className="banner banner-error">{err}</div>}
              </section>
            )}
          </div>
          <footer className="pad-foot">
            <button className="pad-tbtn" onClick={() => add({ id: uid(), t: "draw", h: 360, bg: "grid", strokes: [] })}>
              + שרטוט
            </button>
            <button className="pad-tbtn" onClick={() => add({ id: uid(), t: "text", text: "" })}>
              + טקסט
            </button>
            <button className="pad-tbtn" onClick={() => add({ id: uid(), t: "math", latex: "" })}>
              + משוואה
            </button>
            <span className="pad-grow" />
            <button className="btn small primary" disabled={checking || !rt?.sample} onClick={() => void check()} title="המורה בודק את הדף, בשיחה נפרדת שלא נכנסת לשיעור">
              {checking ? "בודק…" : "בדוק את הפתרון"}
            </button>
          </footer>
        </>
      )}
    </aside>
  );
}
