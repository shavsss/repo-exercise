// The lesson map in the page (guide.ts has the pure parts): the map of the open lesson, made once by one separate
// call and kept in profile/guides/<module>__<lesson>; a quiet tag beside each heading it names, a dot in the
// contents, and the "מפת השיעור" card under the lesson's title. Nothing here blocks the lesson: when the call
// fails, is refused or answers something unusable, nothing is stored and nothing is shown. Identical in both labs.
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Runtime } from "../runtime";
import type { StoredMessage } from "../types";
import { asGuide, findSection, guidePrompt, hastKey, headKey, lessonHeadings, parseGuide, tagLabel, tagText, type GuideInput, type GuideSection, type LessonGuide } from "../guide";
import { Markdown } from "./Markdown";
import { useBookMeasure } from "../book/context";
import "../guide.css";

const GUIDE_MODEL = "claude-opus-5-5";

export interface GuideCtxValue {
  guide: LessonGuide | null;
  /** the open lesson (<module>__<lesson>); empty outside a lesson, where no card is drawn */
  lessonKey?: string;
  /** opens a module's page (the module id in a tag is a link only when this is given) */
  onOpenModule?: (id: string) => void;
  titleOf?: (id: string) => string | undefined;
}
export const GuideCtx = createContext<GuideCtxValue>({ guide: null });

/** The map's entry for a heading drawn by react-markdown (its hast node). */
export function useHeadGuide(node: unknown): GuideSection | null {
  const { guide } = useContext(GuideCtx);
  if (!guide) return null;
  return findSection(guide, hastKey(node as Parameters<typeof hastKey>[0]));
}

/** The map's entry for a heading written in Markdown (the book's contents). */
export const sectionOfSource = (guide: LessonGuide | null, src: string) => findSection(guide, headKey(src));

/* ------------------------------------------------------------------ making it ------------------------------------------------------------------ */

/** calls in flight, by lesson key: a lesson opened again while its map is being made waits for the same call */
const pending = new Map<string, Promise<LessonGuide | null>>();
/** lessons whose call was made in this visit (failed or not): never called twice */
const tried = new Set<string>();

async function makeGuide(rt: Runtime, key: string, text: string, input: Omit<GuideInput, "heads">): Promise<LessonGuide | null> {
  const heads = lessonHeadings(text);
  if (!heads.length || !rt.sample || !rt.store) return null;
  const res = await rt.sample(guidePrompt({ ...input, heads }), { model: GUIDE_MODEL, modelTier: "default", effort: "low", cache: false });
  const g = parseGuide(res.text, heads, input.modules.map((m) => m.id), input.moduleId);
  if (!g) return null;
  await rt.store.saveGuide(key, g as unknown as Record<string, unknown>);
  return g;
}

/**
 * The map of the open lesson. `ready`: the messages on hand are this lesson's (not the lesson left a moment ago),
 * the lesson has been written to the end and nothing is being written now
 * (a new lesson gets its map right after it is finished; a lesson written before this feature, the first time it
 * is opened). One call per lesson, never again once a map is stored.
 */
export function useLessonGuide(o: { rt: Runtime | null; lessonKey: string; ready: boolean; messages: StoredMessage[]; input: Omit<GuideInput, "heads"> | null }): LessonGuide | null {
  const [state, setState] = useState<{ key: string; g: LessonGuide } | null>(null);
  const latest = useRef(o);
  latest.current = o;
  const { rt, lessonKey, ready } = o;
  useEffect(() => {
    const store = rt?.store;
    if (!lessonKey || !store) return;
    let alive = true;
    (async () => {
      let doc: Record<string, unknown> | null;
      try {
        doc = await store.loadGuide(lessonKey);
      } catch {
        return;
      }
      if (!alive) return;
      const stored = asGuide(doc);
      if (stored) return setState({ key: lessonKey, g: stored });
      if (doc || !ready || !rt?.sample) return;
      let job = pending.get(lessonKey);
      if (!job) {
        if (tried.has(lessonKey)) return;
        const { messages, input } = latest.current;
        const text = messages
          .filter((m) => m.role === "assistant" && m.mode === "lesson" && !m.draft && !m.interrupted && m.text)
          .map((m) => m.text)
          .join("\n\n");
        if (!input || !text) return;
        tried.add(lessonKey);
        job = makeGuide(rt, lessonKey, text, input).catch(() => null);
        pending.set(lessonKey, job);
        job.finally(() => pending.delete(lessonKey));
      }
      const g = await job;
      if (g && alive) setState({ key: lessonKey, g });
    })();
    return () => {
      alive = false;
    };
  }, [rt, lessonKey, ready]);
  return state && state.key === lessonKey ? state.g : null;
}

/* ------------------------------------------------------------------ showing it ------------------------------------------------------------------ */

/** The quiet tag beside a heading. Its words are drawn by CSS (attr), so they never enter the heading's text. */
export function GuideTag({ sec }: { sec: GuideSection }) {
  const { onOpenModule, titleOf } = useContext(GuideCtx);
  const t = tagLabel(sec);
  const label = [t.kind, t.rest].filter(Boolean).join(" · ");
  const full = tagText(sec);
  const modTitle = t.module ? titleOf?.(t.module) : undefined;
  return (
    <span className={`gtag k-${sec.kind}`} data-l={label} title={sec.note ? `${full}: ${sec.note}` : full} aria-label={full} role="note">
      {t.module &&
        (onOpenModule ? (
          <button
            type="button"
            className="gtag-mod"
            data-l={`נלמד ב-${t.module}`}
            title={`פתח את ${t.module}${modTitle ? ` · ${modTitle}` : ""}`}
            aria-label={`פתח את ${t.module}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenModule(t.module!);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="gtag-mod" data-l={`נלמד ב-${t.module}`} />
        ))}
    </span>
  );
}

/** A small dot for the contents, in the tag's color. */
export function GuideDot({ kind, module }: { kind?: string; module?: string }) {
  if (kind !== "core" && kind !== "preview" && kind !== "example") return null;
  const text = tagText({ kind, module });
  return <i className={`gdot k-${kind}`} title={text} aria-label={text} role="img" />;
}

/** lessons whose map card was opened once (this browser): folded from then on */
const seenKey = () => `${document.documentElement.dataset.lab === "eng" ? "eng" : "core"}-lab:guide-seen`;
function seen(key: string) {
  try {
    return !!(JSON.parse(localStorage.getItem(seenKey()) ?? "{}") as Record<string, number>)[key];
  } catch {
    return false;
  }
}
function markSeen(key: string) {
  try {
    const all = JSON.parse(localStorage.getItem(seenKey()) ?? "{}") as Record<string, number>;
    if (all[key]) return;
    all[key] = Date.now();
    const keys = Object.keys(all);
    if (keys.length > 400) delete all[keys[0]];
    localStorage.setItem(seenKey(), JSON.stringify(all));
  } catch {
    // remembered for this visit only
  }
}

/**
 * The card under the lesson's title: what to copy, and the previews and illustrations with where they are taught.
 * Open the first time a lesson's map is shown, folded after that. In the book (`floating`) the open card lies over
 * the page, so the page's lay-out never moves.
 */
export function GuideCard({ floating = false }: { floating?: boolean }) {
  const { guide, lessonKey = "", onOpenModule, titleOf } = useContext(GuideCtx);
  const [open, setOpen] = useState(() => !seen(lessonKey));
  const measuring = useBookMeasure();
  useEffect(() => {
    if (guide && open && lessonKey && !measuring) markSeen(lessonKey);
  }, [guide, open, lessonKey, measuring]);
  // the book: where the open card lies (under the row, over the page), kept in place while the window changes
  const headRef = useRef<HTMLButtonElement>(null);
  const [at, setAt] = useState<{ top: number; left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    if (!floating || !open || measuring || !guide) return;
    const place = () => {
      const r = headRef.current?.closest(".lguide-wrap")?.getBoundingClientRect();
      if (r && r.width) setAt((o) => (o && o.top === r.top && o.left === r.left && o.width === r.width ? o : { top: r.top, left: r.left, width: r.width }));
    };
    place();
    const t = window.setInterval(place, 400);
    window.addEventListener("resize", place);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const away = (e: PointerEvent) => !(e.target as HTMLElement).closest?.(".lguide-pop, .lguide-wrap") && setOpen(false);
    window.addEventListener("keydown", esc);
    document.addEventListener("pointerdown", away);
    return () => {
      clearInterval(t);
      window.removeEventListener("resize", place);
      window.removeEventListener("keydown", esc);
      document.removeEventListener("pointerdown", away);
    };
  }, [floating, open, measuring, guide]);
  if (!lessonKey) return null;
  if (!guide) return floating ? <div className="lguide-slot" aria-hidden /> : null;
  const n = (k: string) => guide.sections.filter((s) => s.kind === k).length;
  const others = guide.sections.filter((s) => s.kind !== "core");
  const summary = [n("core") && `${n("core")} לסיכום`, n("preview") && `${n("preview")} הכרות`, n("example") && `${n("example")} המחשה`].filter(Boolean).join(" · ");
  const where = (s: GuideSection) =>
    s.module ? (
      onOpenModule ? (
        <button type="button" className="lguide-mod" onClick={() => onOpenModule(s.module!)} title={titleOf?.(s.module)}>
          {s.kind === "preview" ? "נלמד ב-" : "התחום נלמד ב-"}
          {s.module}
        </button>
      ) : (
        <span className="lguide-mod">
          {s.kind === "preview" ? "נלמד ב-" : "התחום נלמד ב-"}
          {s.module}
        </span>
      )
    ) : s.kind === "example" ? (
      <span className="lguide-mod is-quiet">לא להעתיק</span>
    ) : null;
  const body = (
    <div className="lguide-body" onPointerDown={(e) => e.stopPropagation()}>
      {guide.copy.length > 0 && (
        <div className="lguide-part k-core">
          <div className="lguide-label">מה להעתיק לסיכום</div>
          <ul>
            {guide.copy.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
      {others.length > 0 && (
        <div className="lguide-part">
          <div className="lguide-label">להבין בלבד</div>
          <ul className="lguide-others">
            {others.map((s, i) => (
              <li key={i} className={`k-${s.kind}`}>
                <i className={`gdot k-${s.kind}`} aria-hidden />
                <span className="lguide-kind">{s.kind === "preview" ? "הכרות" : "המחשה"}</span>
                <span className="lguide-h">
                  <Markdown text={s.head} inline />
                </span>
                {where(s)}
                {s.note && <span className="lguide-note">{s.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="lguide-key">
        <span><i className="gdot k-core" aria-hidden /> לב השיעור: ללמוד ולהעתיק</span>
        <span><i className="gdot k-preview" aria-hidden /> הכרות: נלמד במלואו בהמשך</span>
        <span><i className="gdot k-example" aria-hidden /> המחשה: לא להעתיק נוסחאות</span>
      </p>
    </div>
  );
  const head = (
    // its words are drawn by CSS (attr), like the tags: in the book this row sits inside the lesson's text, whose
    // words must not change once a page was shown
    <button type="button" ref={headRef} className="lguide-head" aria-expanded={open} aria-label={`מפת השיעור: ${summary}`} onClick={() => setOpen((x) => !x)} onPointerDown={(e) => e.stopPropagation()}>
      <span className="lguide-title" data-l="מפת השיעור" />
      <span className="lguide-sum" data-l={summary} />
      <span className="lguide-caret" data-l={open ? "▴" : "▾"} aria-hidden />
    </button>
  );
  if (!floating)
    return (
      <div className="lguide-wrap">
        <section className={`lguide ${open ? "is-open" : ""}`} aria-label="מפת השיעור">
          {head}
          {open && body}
        </section>
      </div>
    );
  // in the book the row stays one line high; the open card is drawn over the page, outside the page's windows
  return (
    <div className="lguide-wrap is-floating">
      <section className={`lguide ${open && !measuring ? "is-open" : ""}`} aria-label="מפת השיעור">
        {head}
      </section>
      {open && !measuring && at && createPortal(
        <section className="lguide lguide-pop is-open" dir="rtl" aria-label="מפת השיעור" style={{ top: at.top, left: at.left, width: at.width }}>
          {head}
          {body}
        </section>,
        document.body,
      )}
    </div>
  );
}
