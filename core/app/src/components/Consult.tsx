// Consultation cards: a question about one paragraph of the lesson, answered in a card that opens
// right under that paragraph, so the reading place never moves. Marked text gets a small toolbar
// ("הסבר פשוט", "למה?", "דוגמה", "בדוק אותי", "שאל…"); the rail on the right asks about the paragraph
// at the top of the view. Each answer has a level, L0 (one sentence) to L3 (a lesson-grade treatment
// of the point), short by default; the length is held both in the instructions and here, by stopping
// the stream a little past the level's budget (it can be continued). "דיון" turns the same card into
// a short discussion of the point. The quick model answers L0 only; every other level is the main
// tutor at an effort that grows with the level. Context: the section being read, the course memory
// (read only), where he was sure and wrong in this module, and the card's own thread; never the
// lesson rules or the lesson itself. Cards are kept per lesson (events.ts) and come back, folded to
// their first line, under the same paragraphs when the lesson is opened again. Replaces the old
// "הסבר פשוט" side panel. Same file in both labs.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { Runtime, SampleTool } from "../runtime";
import { runCompute } from "../tutor";
import { Markdown, MdContext } from "./Markdown";
import { Icon } from "./Icon";
import { sectionAt, textOf } from "./lessonText";
import { allCalib, calibNote, loadConsults, logEvent, saveConsult, type ConsultCard, type ConsultKind, type ConsultLevel, type ConsultRequest, type ConsultTurn, type LessonPlace } from "../events";
import { consultPrompt, firstLine, LEVEL_HINT, LEVEL_LABEL, LEVEL_WORDS, splitMore } from "../consultPrompt";
import "../consult.css";

const QUICK_MODEL = "claude-haiku-5-5";
const MAIN_MODEL = "claude-opus-5-5";
const EFFORT: Record<ConsultLevel, "low" | "medium" | "high"> = { 0: "low", 1: "low", 2: "medium", 3: "high" };
/** turns of the card's thread sent with a new question */
const KEEP_TURNS = 6;
/** the stream is stopped this far past the level's budget (in words) */
const SLACK = 1.4;

const KIND_LABEL: Record<ConsultKind, string> = { explain: "הסבר פשוט", why: "למה?", example: "דוגמה", check: "בדוק אותי", ask: "שאלה" };
const KIND_Q: Record<ConsultKind, string> = {
  explain: "הסבר את הקטע המסומן.",
  why: "למה זה נכון?",
  example: "תן דוגמה לקטע המסומן.",
  check: "",
  ask: "",
};
const LESSON_PROSE = ".msg-assistant > .prose";

const words = (s: string) => (s.match(/\S+/g) ?? []).length;
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** The top-level block of the lesson (a paragraph, a list, a block frame) that holds a node. */
function blockOf(node: Node | null): HTMLElement | null {
  let el: HTMLElement | null = node ? (node.nodeType === 1 ? (node as HTMLElement) : node.parentElement) : null;
  if (el?.closest(".consult-host")) return null;
  while (el && !(el.parentElement && el.parentElement.matches(LESSON_PROSE))) el = el.parentElement;
  return el;
}

/** A block's own text, without the app's controls (a think question's buttons change after it is answered). */
function contentText(el: HTMLElement) {
  if (!el.querySelector("button, textarea, .commit, .block-head")) return norm(el.textContent ?? "");
  const c = el.cloneNode(true) as HTMLElement;
  c.querySelectorAll("button, textarea, .commit, .block-head, .consult-host").forEach((x) => x.remove());
  return norm(c.textContent ?? "");
}

/** The block that holds an anchor quote; null when the lesson no longer has that text. */
function findBlock(root: HTMLElement, anchor: string): HTMLElement | null {
  if (!anchor) return null;
  for (const prose of root.querySelectorAll<HTMLElement>(LESSON_PROSE))
    for (const el of prose.children) {
      if (!(el instanceof HTMLElement) || el.classList.contains("consult-host")) continue;
      if (contentText(el).includes(anchor)) return el;
    }
  return null;
}

/** An anchor for a block: a quote from its text that is long enough to find it again. */
function anchorOf(block: HTMLElement) {
  return contentText(block).slice(0, 90);
}

/** The block at the top of the view. */
function blockAtTop(scroll: HTMLElement): HTMLElement | null {
  const top = scroll.getBoundingClientRect().top;
  for (const prose of scroll.querySelectorAll<HTMLElement>(LESSON_PROSE))
    for (const el of prose.children) {
      if (!(el instanceof HTMLElement) || el.classList.contains("consult-host")) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom > top + 40 && norm(el.textContent ?? "").length > 20) return el;
    }
  return null;
}

/** Answers keep the card's own shape: no headings that would enter the lesson's table of contents. */
const tame = (s: string) => s.replace(/^#{1,6}\s+(.+)$/gm, "**$1**");

interface Ui {
  open: boolean;
  level: ConsultLevel;
  discuss: boolean;
  draft: string;
  err: string;
  /** focus the question box once */
  focus?: boolean;
}
const UI0: Ui = { open: true, level: 1, discuss: false, draft: "", err: "" };

export function ConsultLayer({
  rt,
  scrollRef,
  lessonKey,
  place,
  lessonTitle,
  memory = "",
  version,
  onOpenSource,
}: {
  rt: Runtime | null;
  scrollRef: RefObject<HTMLDivElement | null>;
  /** `<module>__<lesson>`: where the cards are kept */
  lessonKey: string;
  place: LessonPlace;
  lessonTitle: string;
  memory?: string;
  /** changes whenever the lesson's text changes, so the cards find their paragraphs again */
  version: unknown;
  onOpenSource?: (doc: string, page: number) => void;
}) {
  const [cards, setCards] = useState<ConsultCard[]>([]);
  const [ui, setUi] = useState<Record<string, Ui>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [hosts, setHosts] = useState<Record<string, HTMLElement>>({});
  const [bar, setBar] = useState<{ top: number; left: number; text: string; block: HTMLElement } | null>(null);
  const [calib, setCalib] = useState("");
  /** bumped to look again for paragraphs that were not drawn yet */
  const [tick, setTick] = useState(0);
  const tries = useRef(0);
  const ctl = useRef<AbortController | null>(null);
  const hostEls = useRef(new Map<string, HTMLElement>());
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  const patchUi = useCallback((id: string, p: Partial<Ui>) => setUi((all) => ({ ...all, [id]: { ...(all[id] ?? UI0), ...p } })), []);

  // a lesson: its cards, folded to their first line
  useEffect(() => {
    let alive = true;
    ctl.current?.abort();
    tries.current = 0;
    setCards([]);
    setUi({});
    setBusy(null);
    loadConsults(lessonKey)
      .then((list) => {
        if (!alive) return;
        const shown = list.filter((c) => !c.hidden && c.turns?.length);
        setCards(shown);
        setUi(Object.fromEntries(shown.map((c) => [c.id, { ...UI0, open: false }])));
      })
      .catch(() => {});
    const loadCalib = () =>
      allCalib()
        .then((l) => alive && setCalib(calibNote(l, place.moduleId)))
        .catch(() => {});
    void loadCalib();
    // a think question answered in this lesson counts at once
    window.addEventListener("calib:changed", loadCalib);
    return () => {
      alive = false;
      window.removeEventListener("calib:changed", loadCalib);
    };
  }, [lessonKey, place.moduleId]);

  // each card in its own small host right after its paragraph (and after the cards already there)
  useLayoutEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const map = hostEls.current;
    for (const [id, h] of map)
      if (!cards.some((c) => c.id === id)) {
        h.remove();
        map.delete(id);
      }
    let lost = 0;
    for (const c of cards) {
      let host = map.get(c.id);
      if (!host) {
        host = document.createElement("div");
        host.className = "consult-host no-copy";
        host.dataset.card = c.id;
        map.set(c.id, host);
      }
      const found = findBlock(root, c.anchor);
      if (!found) lost++;
      // a paragraph that is not there (yet, or any more): the card waits at the end of the lesson
      const block = found ?? [...root.querySelectorAll<HTMLElement>(LESSON_PROSE)].pop()?.lastElementChild ?? null;
      if (!(block instanceof HTMLElement)) continue;
      // already in place: walking back over other cards reaches the paragraph
      let back = host.previousElementSibling;
      while (back?.classList.contains("consult-host")) back = back.previousElementSibling;
      if (host.isConnected && back === block) continue;
      let after: Element = block;
      while (after.nextElementSibling?.classList.contains("consult-host") && after.nextElementSibling !== host) after = after.nextElementSibling;
      after.after(host);
    }
    setHosts((old) => {
      const next = Object.fromEntries(map);
      return Object.keys(old).length === map.size && [...map].every(([k, v]) => old[k] === v) ? old : next;
    });
    if (lost && tries.current < 20) {
      tries.current++;
      const t = setTimeout(() => setTick((n) => n + 1), 500);
      return () => clearTimeout(t);
    }
  }, [cards, version, scrollRef, tick]);
  // leaving the lesson: the hosts go with it
  useEffect(() => {
    const map = hostEls.current;
    return () => {
      for (const h of map.values()) h.remove();
      map.clear();
    };
  }, [lessonKey]);

  // marked text in the lesson: the small toolbar above it
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const check = () => {
      // text marked while writing (an answer to a think question) is not a question about the lesson
      if (document.activeElement?.matches("textarea, input")) return setBar(null);
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return setBar(null);
      const r = sel.getRangeAt(0);
      const block = blockOf(r.startContainer);
      if (!block || !scroll.contains(block)) return setBar(null);
      const text = textOf(r);
      if (!text.trim()) return setBar(null);
      const rect = r.getBoundingClientRect();
      const w = Math.min(window.innerWidth - 16, 360);
      setBar({ top: Math.max(8, rect.top - 46), left: Math.min(window.innerWidth - w - 8, Math.max(8, rect.left + rect.width / 2 - w / 2)), text: text.slice(0, 3000), block });
    };
    const up = () => setTimeout(check, 0);
    const hide = () => setBar(null);
    scroll.addEventListener("mouseup", up);
    scroll.addEventListener("keyup", up);
    scroll.addEventListener("touchend", up);
    scroll.addEventListener("scroll", hide, { passive: true });
    return () => {
      scroll.removeEventListener("mouseup", up);
      scroll.removeEventListener("keyup", up);
      scroll.removeEventListener("touchend", up);
      scroll.removeEventListener("scroll", hide);
    };
  }, [scrollRef]);

  const store = useCallback(
    (card: ConsultCard) => {
      const count = cardsRef.current.filter((c) => !c.hidden).length;
      saveConsult(lessonKey, card, count).catch(() => {});
    },
    [lessonKey],
  );

  const setCard = useCallback((id: string, f: (c: ConsultCard) => ConsultCard) => {
    setCards((all) => all.map((c) => (c.id === id ? f(c) : c)));
  }, []);

  /** Asks the tutor on a card: a new turn, or (continuing) the rest of the last answer. */
  const ask = useCallback(
    async (id: string, question: string, level: ConsultLevel, discuss: boolean, continuing = false) => {
      const scroll = scrollRef.current;
      const card = cardsRef.current.find((c) => c.id === id);
      if (!rt?.sample || !scroll || !card || busy) return;
      if (!continuing && !question.trim()) return;
      ctl.current?.abort();
      const c = new AbortController();
      ctl.current = c;
      const block = findBlock(scroll, card.anchor);
      const section = sectionAt(scroll, block);
      const prev = continuing ? card.turns[card.turns.length - 1] : null;
      const thread = (continuing ? card.turns.slice(0, -1) : card.turns).slice(-KEEP_TURNS).map((t) => ({ q: t.q, a: splitMore(t.a).body.slice(0, 2500) }));
      const lvl = prev ? prev.level : level;
      const prompt = consultPrompt({
        kind: card.kind,
        level: lvl,
        discuss: prev ? !!prev.discuss : discuss,
        lessonTitle,
        section,
        anchor: card.anchor,
        quote: card.quote,
        memory,
        calibration: calib,
        thread,
        question: prev ? prev.q : question.trim(),
        continuing: prev?.a,
      });
      const base = prev?.a ? prev.a + "\n\n" : "";
      const turn: ConsultTurn = prev ? { ...prev, cut: false } : { q: question.trim(), a: "", level: lvl, discuss: discuss || undefined, ts: Date.now() };
      const write = (t: ConsultTurn) => setCard(id, (x) => ({ ...x, turns: continuing ? [...x.turns.slice(0, -1), t] : [...x.turns.filter((y) => y.ts !== turn.ts), t], updatedAt: Date.now() }));
      write(turn);
      patchUi(id, { err: "", open: true, draft: "" });
      setBusy(id);
      const cap = Math.round(LEVEL_WORDS[lvl] * SLACK) + 20;
      let stopped = false;
      let shown = "";
      const tools: SampleTool[] | undefined =
        lvl >= 1 && rt.canUseTools
          ? [
              {
                name: "compute",
                description: "Evaluate a math.js script, one statement per line (units, complex numbers, matrices). Returns every line with its value.",
                inputSchema: { type: "object", properties: { script: { type: "string" } }, required: ["script"] },
                execute: (input) => runCompute(String(input.script ?? "")).output || "(no output)",
              },
            ]
          : undefined;
      const run = (model: string) =>
        rt.sample!(prompt, {
          model,
          modelTier: lvl === 0 ? "quick" : lvl === 1 ? "default" : "complex",
          effort: EFFORT[lvl],
          signal: c.signal,
          cache: false,
          tools: model === QUICK_MODEL ? undefined : tools,
          onText: ({ text }) => {
            shown = text;
            write({ ...turn, a: base + text });
            if (!stopped && words(text) > cap) {
              stopped = true;
              c.abort();
            }
          },
        });
      const finish = (text: string, cut: boolean, model?: string) => {
        let body = text;
        if (cut) {
          // end at the last paragraph (or sentence) that was written whole
          const para = body.lastIndexOf("\n\n");
          const sent = Math.max(body.lastIndexOf(". "), body.lastIndexOf(".\n"));
          body = para > body.length * 0.5 ? body.slice(0, para) : sent > body.length * 0.5 ? body.slice(0, sent + 1) : body;
        }
        const done: ConsultTurn = { ...turn, a: (base + body).trim(), cut: cut || undefined, model: model ?? turn.model };
        write(done);
        const latest = cardsRef.current.find((x) => x.id === id);
        if (latest) store({ ...latest, turns: continuing ? [...latest.turns.slice(0, -1), done] : [...latest.turns.filter((t) => t.ts !== turn.ts), done], updatedAt: Date.now() });
        logEvent(continuing ? "consult.more" : "consult.ask", place, { card: id, kind: card.kind, level: lvl, discuss: !!turn.discuss, words: words(body), cut: !!cut, model: model ?? "" });
      };
      try {
        let res;
        const first = lvl === 0 ? QUICK_MODEL : MAIN_MODEL;
        try {
          res = await run(first);
        } catch (e) {
          if (c.signal.aborted) throw e;
          // the quick model may not be served here; and an empty or refused answer gets one more try
          res = await run(MAIN_MODEL);
        }
        if (!res.text.trim()) res = await run(MAIN_MODEL);
        if (!res.text.trim()) throw { message: "empty" };
        finish(res.text, res.truncated, res.modelApplied);
      } catch (e) {
        if (stopped) finish(shown, true);
        else if (c.signal.aborted) {
          if (shown.trim()) finish(shown, true);
          else setCard(id, (x) => ({ ...x, turns: continuing ? x.turns : x.turns.filter((t) => t.ts !== turn.ts) }));
        } else {
          // nothing is lost: the question goes back into the box
          setCard(id, (x) => ({ ...x, turns: continuing ? [...x.turns.slice(0, -1), { ...turn, a: prev?.a ?? "", cut: true }] : x.turns.filter((t) => t.ts !== turn.ts) }));
          patchUi(id, { err: "התשובה לא הגיעה. אפשר לנסות שוב.", draft: continuing ? "" : question, discuss: discuss || !continuing });
          void e;
        }
      } finally {
        if (ctl.current === c) {
          ctl.current = null;
          setBusy(null);
        }
      }
    },
    [rt, scrollRef, busy, lessonTitle, memory, calib, setCard, patchUi, store, place],
  );

  /** A new card under a block; asks at once when there is a question, else opens the box for one. */
  const openCard = useCallback(
    (block: HTMLElement, kind: ConsultKind, quote?: string, question?: string, level: ConsultLevel = 1) => {
      const now = Date.now();
      const card: ConsultCard = { id: `c${now.toString(36)}${Math.random().toString(36).slice(2, 5)}`, anchor: anchorOf(block), quote: quote?.trim() || undefined, kind, turns: [], ts: now, updatedAt: now };
      const q = question ?? KIND_Q[kind];
      setCards((all) => [...all, card]);
      cardsRef.current = [...cardsRef.current, card];
      setUi((all) => ({ ...all, [card.id]: { ...UI0, level, discuss: !q, draft: q || (kind === "check" ? "אז אם הבנתי: " : ""), focus: !q } }));
      window.getSelection()?.removeAllRanges();
      setBar(null);
      if (q) void ask(card.id, q, level, false);
    },
    [ask],
  );

  // a card asked for from elsewhere in the lesson (a think question)
  const openRef = useRef(openCard);
  openRef.current = openCard;
  useEffect(() => {
    const on = (e: Event) => {
      const r = (e as CustomEvent<ConsultRequest>).detail;
      const scroll = scrollRef.current;
      if (!scroll || !r) return;
      const block = (r.el && blockOf(r.el)) || findBlock(scroll, norm(r.anchor)) || blockAtTop(scroll);
      if (block) openRef.current(block, r.kind, r.quote, r.q, r.level ?? 1);
    };
    window.addEventListener("consult:open", on);
    return () => window.removeEventListener("consult:open", on);
  }, [scrollRef]);

  const hide = (id: string) => {
    const card = cardsRef.current.find((c) => c.id === id);
    if (!card) return;
    if (busy === id) ctl.current?.abort();
    setCards((all) => all.filter((c) => c.id !== id));
    if (card.turns.length) store({ ...card, hidden: true, updatedAt: Date.now() });
  };

  const toolbar = bar && (
    <div className="consult-bar" style={{ top: bar.top, left: bar.left }} role="toolbar" aria-label="שאלה על הקטע המסומן" onMouseDown={(e) => e.preventDefault()}>
      <button className="consult-bar-main" onClick={() => openCard(bar.block, "explain", bar.text)}>
        <Icon name="think" size={14} /> הסבר פשוט
      </button>
      <button onClick={() => openCard(bar.block, "why", bar.text)}>למה?</button>
      <button onClick={() => openCard(bar.block, "example", bar.text)}>דוגמה</button>
      <button onClick={() => openCard(bar.block, "check", bar.text, "")}>בדוק אותי</button>
      <button onClick={() => openCard(bar.block, "ask", bar.text, "")}>שאל…</button>
    </div>
  );

  return (
    <>
      <button
        className="consult-rail"
        onClick={() => {
          const scroll = scrollRef.current;
          const block = scroll && blockAtTop(scroll);
          if (block) openCard(block, "ask", undefined, "");
        }}
        aria-label="שאלה על הפסקה שבראש המסך"
        title="שאלה על הפסקה שבראש המסך. אפשר גם לסמן טקסט בשיעור."
      >
        <Icon name="think" size={16} />
        <span>שאלה על הפסקה</span>
      </button>
      {toolbar}
      {cards.map((c) =>
        hosts[c.id]
          ? createPortal(
              <CardView
                card={c}
                ui={ui[c.id] ?? UI0}
                live={busy === c.id}
                locked={!!busy && busy !== c.id}
                canAsk={!!rt?.sample}
                onUi={(p) => patchUi(c.id, p)}
                onAsk={(q, level, discuss) => void ask(c.id, q, level, discuss)}
                onMore={() => void ask(c.id, "", 1, false, true)}
                onStop={() => ctl.current?.abort()}
                onHide={() => hide(c.id)}
                onOpenSource={onOpenSource}
              />,
              hosts[c.id],
              c.id,
            )
          : null,
      )}
    </>
  );
}

function CardView({
  card,
  ui,
  live,
  locked,
  canAsk,
  onUi,
  onAsk,
  onMore,
  onStop,
  onHide,
  onOpenSource,
}: {
  card: ConsultCard;
  ui: Ui;
  live: boolean;
  locked: boolean;
  canAsk: boolean;
  onUi: (p: Partial<Ui>) => void;
  onAsk: (q: string, level: ConsultLevel, discuss: boolean) => void;
  onMore: () => void;
  onStop: () => void;
  onHide: () => void;
  onOpenSource?: (doc: string, page: number) => void;
}) {
  const box = useRef<HTMLTextAreaElement>(null);
  const last = card.turns[card.turns.length - 1];
  const { more } = useMemo(() => splitMore(last?.a ?? ""), [last?.a]);
  const ctx = useMemo(() => ({ live, idPrefix: `cs-${card.id}`, openSource: onOpenSource ?? (() => {}) }), [live, card.id, onOpenSource]);
  const title = last?.a ? firstLine(last.a) : card.quote ? `«${norm(card.quote).slice(0, 70)}${card.quote.length > 70 ? "…" : ""}»` : "שאלה על הפסקה";
  const disabled = !canAsk || live || locked;
  useEffect(() => {
    if (ui.focus && box.current) {
      box.current.focus();
      box.current.setSelectionRange(box.current.value.length, box.current.value.length);
      onUi({ focus: false });
    }
  }, [ui.focus, onUi]);

  const send = () => {
    const q = ui.draft.trim();
    if (!q || disabled) return;
    onAsk(q, ui.level, ui.discuss || card.turns.length > 0);
  };
  const setLevel = (l: ConsultLevel) => {
    onUi({ level: l });
    // with an answer on the card and nothing typed: the same question again, at the new level
    if (last && !ui.draft.trim() && l !== last.level && !disabled) onAsk(last.q, l, !!last.discuss);
  };
  const shownTurns = ui.discuss ? card.turns : card.turns.slice(-1);
  const earlier = ui.discuss ? 0 : card.turns.length - 1;

  return (
    <section className={`consult-card ${ui.open ? "is-open" : ""} ${live ? "is-live" : ""}`} aria-label={`התייעצות: ${KIND_LABEL[card.kind]}`}>
      <header className="consult-head">
        <button className="consult-toggle" onClick={() => onUi({ open: !ui.open })} aria-expanded={ui.open}>
          <span className="consult-kind">{ui.discuss ? "דיון" : KIND_LABEL[card.kind]}</span>
          <span className="consult-title">
            <Markdown text={title} inline />
          </span>
          {card.turns.length > 1 && <span className="consult-count">{card.turns.length}</span>}
          <span className="consult-caret" aria-hidden>▾</span>
        </button>
        <button className="icon-btn consult-x" onClick={onHide} aria-label="הסר את הכרטיס מהשיעור" title="הסר מהשיעור">
          <Icon name="close" size={13} />
        </button>
      </header>
      {ui.open && (
        <div className="consult-body">
          {card.quote && !ui.discuss && <blockquote className="consult-quote">{card.quote.length > 240 ? card.quote.slice(0, 240) + "…" : card.quote}</blockquote>}
          {earlier > 0 && (
            <button className="link consult-earlier" onClick={() => onUi({ discuss: true })}>
              {earlier === 1 ? "תשובה קודמת אחת" : `${earlier} תשובות קודמות`} (בדיון)
            </button>
          )}
          {shownTurns.map((t, i) => {
            const isLast = t === last;
            const body = splitMore(t.a).body;
            const showQ = ui.discuss || (t.q && t.q !== KIND_Q[card.kind]);
            return (
              <div key={t.ts + ":" + i} className={`consult-turn ${t.discuss ? "is-discuss" : ""}`}>
                {showQ && (
                  <div className="consult-q">
                    {i > 0 && t.q === shownTurns[i - 1].q ? "אותה שאלה" : t.q.length > 280 ? t.q.slice(0, 280) + "…" : t.q}
                    <span className="consult-lvl" title={LEVEL_HINT[t.level]}>
                      {LEVEL_LABEL[t.level]}
                    </span>
                  </div>
                )}
                {isLast && live && !t.a.trim() && <div className="consult-wait">{t.level === 0 ? "משפט אחד…" : "המורה עונה…"}</div>}
                {body.trim() && (
                  <MdContext.Provider value={isLast ? ctx : { ...ctx, live: false }}>
                    <div className="prose consult-answer">
                      <Markdown text={tame(body)} />
                    </div>
                  </MdContext.Provider>
                )}
                {isLast && t.cut && !live && (
                  <button className="btn small consult-more" onClick={onMore} disabled={disabled}>
                    המשך את התשובה
                  </button>
                )}
              </div>
            );
          })}
          {ui.err && <div className="consult-err">{ui.err}</div>}
          {last && !live && (more.length > 0 || last.level < 3) && (
            <div className="consult-chips">
              {more.map((m) => (
                <button key={m} className="consult-chip" disabled={disabled} onClick={() => onAsk(m, Math.max(2, last.level) as ConsultLevel, !!last.discuss)}>
                  {m}
                </button>
              ))}
              {last.level < 3 && (
                <button className="consult-chip is-fixed" disabled={disabled} onClick={() => (onUi({ level: (last.level + 1) as ConsultLevel }), onAsk(last.q, (last.level + 1) as ConsultLevel, !!last.discuss))}>
                  עמוק יותר
                </button>
              )}
              <button className="consult-chip is-fixed" disabled={disabled} onClick={() => onAsk("אותה נקודה במילים אחרות: דרך אחרת (גאומטרית, אלגברית או פיזיקלית), באותה רמה.", last.level, !!last.discuss)}>
                במילים אחרות
              </button>
            </div>
          )}
          <div className="consult-foot">
            <div className="consult-levels" role="radiogroup" aria-label="רמת התשובה">
              {([0, 1, 2, 3] as ConsultLevel[]).map((l) => (
                <button key={l} role="radio" aria-checked={ui.level === l} className={ui.level === l ? "is-on" : ""} title={LEVEL_HINT[l]} disabled={live} onClick={() => setLevel(l)}>
                  <b dir="ltr">L{l}</b> {LEVEL_LABEL[l]}
                </button>
              ))}
            </div>
            <button className={`consult-discuss ${ui.discuss ? "is-on" : ""}`} aria-pressed={ui.discuss} onClick={() => onUi({ discuss: !ui.discuss, focus: !ui.discuss })}>
              דיון
            </button>
            {live && (
              <button className="btn small" onClick={onStop}>
                עצור
              </button>
            )}
          </div>
          {(ui.discuss || !card.turns.length || ui.err) && (
            <form
              className="consult-ask"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <textarea
                ref={box}
                rows={2}
                value={ui.draft}
                placeholder={card.turns.length ? "המשך הדיון: שאלה, טענה או אי-הסכמה…" : card.kind === "check" ? "נסח במילים שלך מה הבנת, והמורה יבדוק" : "שאלה על הפסקה הזו"}
                onChange={(e) => onUi({ draft: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button className="btn small primary" disabled={disabled || !ui.draft.trim()}>
                שלח
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
