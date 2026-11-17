// The engineering case (docs/ENGINEERING_CASE.md, "התכנון הטכני"): the card at the end of the lesson, and the
// design-review room it opens, full screen and outside the book. The room is a design doc: a header (doc number,
// status, owner, reviewers), the stages as its sections on the side rail, and per stage the learner's proposal with
// his confidence, a review thread with the reviewer in the stage's role (with compute cells he delegates), his
// commit, the expert reasoning aloud with the rubric, and what he saw only after it. A decision log, a numbers
// ledger and the open assumptions on the other side; at the end an ADR and a post-mortem style debrief; the ideas
// board from anywhere. The work is kept per lesson (caseStore.ts). Same file in both apps.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Runtime } from "../runtime";
import { parseCase, stageRole, STAGE_NAMES, type CaseBlock, type CaseStage } from "../caseBlock";
import {
  adrNumber,
  cellResult,
  closedCount,
  confLevel,
  currentStage,
  docNumber,
  docStatus,
  emptyDoc,
  emptyStage,
  parseExpert,
  parseReview,
  rubricGrade,
  sectionStatus,
  type CaseAdr,
  type CaseCell,
  type CaseDoc,
  type CaseTurn,
  type StageWork,
} from "../caseDoc";
import { peekCase, updateCase, useCaseDoc } from "../caseStore";
import { computePrompt, debriefPrompt, expertPrompt, reviewPrompt, type CaseCtx } from "../casePrompt";
import { CONF_LABEL, GRADE_LABEL, logEvent, saveCalib, type LessonPlace } from "../events";
import { loadIdeas, saveIdea, type Idea } from "../ideas";
import { computeTool, sampleWithFallback } from "../sampleRun";
import { runCompute } from "../tutor";
import { Markdown } from "./Markdown";
import "../case.css";

const MAIN_MODEL = "claude-opus-5-5";
const FALLBACK_MODEL = "claude-sonnet-5-5";

const STATUS_LABEL = { draft: "טיוטה", review: "בסקירה", approved: "אושר" } as const;
const SECTION_LABEL = { open: "פתוח", review: "בסקירה", closed: "סגור" } as const;
const STATUS_STEPS = ["draft", "review", "approved"] as const;

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
/** "§3", kept in that order inside Hebrew text */
const stageNo = (s: CaseStage) => `\u2066§${s === "fault" ? "0" : s}\u2069`;
const stageTitle = (s: CaseStage) => `${stageNo(s)} ${STAGE_NAMES[s]}`;
/** A role as a tone: the customer, the red team, the competitor, the senior engineer. */
const roleTone = (r: string) => (/דרישה|לקוח/.test(r) ? "owner" : /אדום/.test(r) ? "red" : /אחרת|מתחר/.test(r) ? "rival" : "senior");
const initials = (r: string) =>
  r
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/* ------------------------------------------------------------------ the card in the lesson ------------------------------------------------------------------ */

/** Opens the room for a case block (the host in App.tsx listens). */
export const openCaseRoom = (source: string) => window.dispatchEvent(new CustomEvent("case:open", { detail: { source } }));

/** The case at the end of the lesson: a card of a fixed height (an action never changes the text's height). */
export function CaseCard({ source }: { source: string }) {
  const c = useMemo(() => parseCase(source), [source]);
  const d = useCaseDoc(c.id) ?? emptyDoc(c);
  const status = docStatus(c, d);
  const done = closedCount(c, d);
  const cur = currentStage(c, d);
  const next = cur ? `${d.stages[cur] && d.stages[cur]!.phase !== "draft" ? "בעבודה" : "הסעיף הבא"}: ${stageTitle(cur)}` : d.adr ? "כל הסעיפים סגורים · ADR נכתב" : "כל הסעיפים סגורים · נשאר ADR";
  return (
    <section className="case-card no-copy" data-block="case" aria-label="המקרה ההנדסי">
      <header className="case-card-head">
        <span className="case-card-kicker">המקרה ההנדסי</span>
        <span className="case-docid" dir="ltr">
          {docNumber(c.id)}
        </span>
        <span className={`case-status s-${status}`}>{STATUS_LABEL[status]}</span>
      </header>
      <h4 className="case-card-title">
        <Markdown text={c.title || "מקרה הנדסי"} inline />
      </h4>
      <ol className="case-strip" style={{ gridTemplateColumns: `repeat(${Math.max(1, c.stages.length)}, 1fr)` }}>
        {c.stages.map((s) => {
          const st = sectionStatus(d.stages[s]);
          return (
            <li key={s} className={`st-${st}${s === cur ? " is-cur" : ""}`} title={`${stageTitle(s)} · ${SECTION_LABEL[st]}`}>
              <span className="case-strip-no">{stageNo(s)}</span>
              <span className="case-strip-name">{STAGE_NAMES[s]}</span>
            </li>
          );
        })}
      </ol>
      <div className="case-card-foot">
        <div className="case-progress" role="progressbar" aria-valuemin={0} aria-valuemax={c.stages.length} aria-valuenow={done}>
          <span style={{ width: `${c.stages.length ? (100 * done) / c.stages.length : 0}%` }} />
        </div>
        <span className="case-card-next">
          {done}/{c.stages.length} סגורים · {next}
        </span>
        <button className="case-open" onClick={() => openCaseRoom(source)}>
          פתח את חדר העבודה
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the host ------------------------------------------------------------------ */

/** Listens for a card's request and draws the room over the whole app. */
export function CaseRoomHost({ rt, memory, place }: { rt: Runtime | null; memory: string; place: LessonPlace | null }) {
  const [source, setSource] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => setSource((e as CustomEvent<{ source: string }>).detail?.source ?? null);
    window.addEventListener("case:open", on);
    return () => window.removeEventListener("case:open", on);
  }, []);
  useEffect(() => setSource(null), [place?.moduleId, place?.lesson]);
  if (!source || !place) return null;
  return createPortal(<CaseRoom c={parseCase(source)} rt={rt} memory={memory} place={place} onClose={() => setSource(null)} />, document.body);
}

/* ------------------------------------------------------------------ the room ------------------------------------------------------------------ */

type View = "brief" | "adr" | CaseStage;
interface Live {
  stage: CaseStage | "debrief";
  kind: "review" | "cell" | "expert" | "debrief";
  text: string;
}

/** The ideas: the db's document, or a copy in this browser. */
function ideaStore(rt: Runtime | null) {
  if (rt?.store) return rt.store;
  return {
    loadIdeas: async () => {
      try {
        return JSON.parse(localStorage.getItem("ideas:local") ?? "null");
      } catch {
        return null;
      }
    },
    saveIdeas: async (d: Record<string, unknown>) => {
      try {
        localStorage.setItem("ideas:local", JSON.stringify(d));
      } catch {
        /* this view only */
      }
    },
  };
}

export function CaseRoom({ c, rt, memory, place, onClose }: { c: CaseBlock; rt: Runtime | null; memory: string; place: LessonPlace; onClose: () => void }) {
  const d = useCaseDoc(c.id) ?? emptyDoc(c);
  /** the work now: a turn sent right after a change must see it */
  const now = () => peekCase(c.id) ?? emptyDoc(c);
  const cur = currentStage(c, d);
  const [view, setView] = useState<View>(() => cur ?? (c.stages.length ? "adr" : "brief"));
  const [live, setLive] = useState<Live | null>(null);
  const [err, setErr] = useState("");
  const [board, setBoard] = useState(false);
  const [ideaDraft, setIdeaDraft] = useState<string | null>(null);
  const ctl = useRef<AbortController | null>(null);
  const canAsk = !!rt?.sample;
  const ideas = useMemo(() => ideaStore(rt), [rt]);

  const update = useCallback((f: (d: CaseDoc) => CaseDoc) => updateCase({ caseId: c.id, title: c.title }, f), [c.id, c.title]);
  const setStage = useCallback((s: CaseStage, f: (w: StageWork) => StageWork) => update((x) => ({ ...x, stages: { ...x.stages, [s]: f(x.stages[s] ?? emptyStage()) } })), [update]);
  const work = (s: CaseStage) => now().stages[s] ?? emptyStage();
  const notes = (s: CaseStage) => c.notes.find((n) => n.stage === s);

  // leaving: nothing keeps streaming; Escape closes (the board first)
  useEffect(() => () => ctl.current?.abort(), []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (board) setBoard(false);
      else if (ideaDraft !== null) setIdeaDraft(null);
      else onClose();
    };
    window.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
    };
  }, [board, ideaDraft, onClose]);

  /** What every call carries: the brief, the stage, the decisions so far, the course memory, the thread. */
  const ctx = (s: CaseStage): CaseCtx => {
    const before = c.stages.slice(0, c.stages.indexOf(s));
    const earlier = before
      .map((x) => {
        const w = now().stages[x];
        if (!w?.commit) return "";
        return `${stageTitle(x)}: ${w.commit.decision} (ביטחון ${w.commit.confidence}%${w.grade ? `, דירוג במחוון: ${GRADE_LABEL[w.grade]}` : ""})${w.reflection ? `\nמה ראה רק אחרי נימוק המומחה: ${w.reflection}` : ""}`;
      })
      .filter(Boolean)
      .join("\n");
    const w = work(s);
    const thread = [
      `הצעת הלומד (ביטחון ${w.confidence ?? "?"}%):\n${w.proposal}`,
      ...w.turns.map((t) =>
        t.who === "reviewer"
          ? `הסוקר (${t.role}):\n${t.text}`
          : t.who === "cell"
            ? `חישוב שהלומד ביקש: ${t.cell?.map((x) => x.ask).join("; ")}\n${t.cell?.map((x) => x.output).join("\n")}\n${t.text}`
            : `הלומד:\n${t.text}`,
      ),
    ].join("\n\n");
    return { title: c.title, brief: c.brief, stageName: stageTitle(s), role: stageRole(c, s), ask: notes(s)?.ask ?? "", earlier, memory, thread };
  };

  /** One model turn, streamed into `live`; the text at its end (null when it failed or was stopped). */
  const call = async (l: Omit<Live, "text">, prompt: string, effort: "medium" | "high", tools?: ReturnType<typeof computeTool>[]) => {
    if (!rt?.sample) return null;
    ctl.current?.abort();
    const a = new AbortController();
    ctl.current = a;
    setErr("");
    setLive({ ...l, text: "" });
    try {
      const res = await sampleWithFallback(rt, prompt, MAIN_MODEL, FALLBACK_MODEL, {
        modelTier: "complex",
        effort,
        signal: a.signal,
        cache: false,
        tools: tools && rt.canUseTools ? tools : undefined,
        onText: ({ text }) => setLive({ ...l, text }),
      });
      return res;
    } catch {
      if (!a.signal.aborted) setErr("התשובה לא הגיעה. אפשר לנסות שוב.");
      return null;
    } finally {
      if (ctl.current === a) {
        ctl.current = null;
        setLive(null);
      }
    }
  };

  const review = async (s: CaseStage) => {
    const n = notes(s);
    const role = stageRole(c, s);
    const res = await call({ stage: s, kind: "review" }, reviewPrompt({ ...ctx(s), anchors: n?.anchors ?? [] }), "medium", [computeTool()]);
    if (!res) return;
    const r = parseReview(res.text);
    setStage(s, (w) => ({
      ...w,
      turns: [...w.turns, { id: uid(), who: "reviewer", role, text: r.body, ts: Date.now(), model: res.model, cut: res.truncated || undefined }],
      numbers: [...new Set([...(w.numbers ?? []), ...r.numbers])],
      assumptions: [...(w.assumptions ?? []), ...r.assumptions.filter((a) => !w.assumptions?.some((x) => x.text === a)).map((text) => ({ text }))],
    }));
  };

  const submit = (s: CaseStage) => {
    setStage(s, (w) => ({ ...w, phase: "review" }));
    void review(s);
  };

  const reply = (s: CaseStage, text: string) => {
    setStage(s, (w) => ({ ...w, turns: [...w.turns, { id: uid(), who: "learner", text, ts: Date.now() }] }));
    void review(s);
  };

  /** "חשב / דמה לי": a math.js script runs as it is; words go to the model, which writes the script and runs it. */
  const compute = async (s: CaseStage, ask: string) => {
    const add = (cells: CaseCell[], text: string, model?: string) =>
      setStage(s, (w) => ({
        ...w,
        turns: [...w.turns, { id: uid(), who: "cell", text, ts: Date.now(), cell: cells, model }],
        numbers: [...new Set([...(w.numbers ?? []), ...cells.map((x) => cellResult(x.output)).filter(Boolean)])],
      }));
    if (!/[֐-׿]/.test(ask)) {
      const r = runCompute(ask);
      if (r.ok || !canAsk) return add([{ ask, script: ask, output: r.output, ok: r.ok }], "");
    }
    const cells: CaseCell[] = [];
    const res = await call({ stage: s, kind: "cell" }, computePrompt({ ...ctx(s), request: ask }), "medium", [computeTool((script, output, ok) => cells.push({ ask, script, output, ok }))]);
    if (res) add(cells.length ? cells : [{ ask, script: "", output: "", ok: false }], res.text.trim(), res.model);
  };

  const record = (s: CaseStage, w: StageWork) => {
    if (!w.commit || !w.grade) return;
    saveCalib({
      id: `${place.moduleId}__${place.lesson}__case-${s}`,
      moduleId: place.moduleId,
      lesson: place.lesson,
      lessonTitle: place.title,
      q: `${stageTitle(s)}: ${(notes(s)?.ask ?? "").slice(0, 200)}`,
      answer: w.commit.decision.slice(0, 1000),
      conf: confLevel(w.commit.confidence),
      grade: w.grade,
      kind: "case",
      ts: w.commit.at,
      gradedAt: Date.now(),
    }).catch(() => {});
  };

  const expert = async (s: CaseStage) => {
    const n = notes(s);
    const w0 = work(s);
    if (!n || !w0.commit) return;
    const nx = c.stages[c.stages.indexOf(s) + 1];
    const res = await call(
      { stage: s, kind: "expert" },
      expertPrompt({ ...ctx(s), expert: n.expert, rubric: n.rubric, commit: `${w0.commit.decision} (ביטחון ${w0.commit.confidence}%)`, next: nx ? stageTitle(nx) : "" }),
      "high",
    );
    if (!res) return;
    const p = parseExpert(res.text, n.rubric.length);
    const met = p.met ?? n.rubric.map(() => false);
    const grade = rubricGrade(n.rubric, met);
    setStage(s, (w) => {
      const next = { ...w, phase: "reflect" as const, expert: p.body, rubric: met, disputed: p.met ? undefined : true, grade };
      record(s, next);
      return next;
    });
  };

  const commit = (s: CaseStage, decision: string, confidence: number) => {
    setStage(s, (w) => ({ ...w, phase: "expert", commit: { decision, confidence, at: Date.now() } }));
    logEvent("case.commit", place, { stage: s, confidence, caseId: c.id });
    void expert(s);
  };

  const toggleRubric = (s: CaseStage, i: number) => {
    const n = notes(s);
    if (!n) return;
    setStage(s, (w) => {
      const met = (w.rubric ?? n.rubric.map(() => false)).map((v, k) => (k === i ? !v : v));
      const next = { ...w, rubric: met, disputed: true, grade: rubricGrade(n.rubric, met) };
      record(s, next);
      return next;
    });
  };

  const close = (s: CaseStage, reflection: string) => {
    setStage(s, (w) => ({ ...w, phase: "closed", reflection }));
    const nx = c.stages[c.stages.indexOf(s) + 1];
    setView(nx ?? "adr");
  };

  const debrief = async () => {
    const x = now();
    if (!x.adr) return;
    const stages = c.stages
      .map((s) => {
        const w = x.stages[s];
        return `${stageTitle(s)}: ${w?.commit?.decision ?? "—"} · ביטחון ${w?.commit?.confidence ?? "?"}% · דירוג ${w?.grade ? GRADE_LABEL[w.grade] : "?"}${w?.reflection ? ` · ראה אחר כך: ${w.reflection}` : ""}`;
      })
      .join("\n");
    const a = x.adr;
    const res = await call(
      { stage: "debrief", kind: "debrief" },
      debriefPrompt({ title: c.title, brief: c.brief, memory, stages, adr: `הקשר: ${a.context}\nהחלטה: ${a.decision}\nחלופות שנדחו: ${a.alternatives}\nהשלכות: ${a.consequences}\nמה יהפוך אותה: ${a.reversal}`, decisions: c.decisions }),
      "high",
    );
    if (res) update((y) => ({ ...y, debrief: res.text.trim() }));
  };

  const saveAdr = (adr: CaseAdr) => {
    update((y) => ({ ...y, adr, debrief: undefined }));
    void debrief();
  };

  const keepIdea = async (text: string) => {
    const s = cur ?? c.stages[c.stages.length - 1];
    await saveIdea(ideas, { id: `i${uid()}`, text, moduleId: place.moduleId, lesson: place.lesson, caseId: c.id, stage: s, status: "seed", at: Date.now() }).catch(() => {});
    setIdeaDraft(null);
  };

  const status = docStatus(c, d);
  const roles = [...new Set(c.stages.map((s) => stageRole(c, s)))];
  const busy = !!live;
  const allClosed = c.stages.length > 0 && !cur;

  return (
    <div className="cr" role="dialog" aria-modal="true" aria-label={`חדר העבודה: ${c.title}`}>
      <header className="cr-head">
        <div className="cr-head-main">
          <div className="cr-kicker">
            <span className="case-docid" dir="ltr">
              {docNumber(c.id)}
            </span>
            <span>מסמך תכן · המקרה ההנדסי</span>
          </div>
          <h1 className="cr-title">
            <Markdown text={c.title || "מקרה הנדסי"} inline />
          </h1>
        </div>
        <dl className="cr-meta">
          <div>
            <dt>סטטוס</dt>
            <dd className="cr-flow">
              {STATUS_STEPS.map((k, i) => (
                <span key={k} className={`cr-flow-step${k === status ? " is-on" : ""}${STATUS_STEPS.indexOf(status) > i ? " is-past" : ""}`}>
                  {STATUS_LABEL[k]}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>בעלים</dt>
            <dd>
              <span className="cr-avatar t-owner-self">ל</span> הלומד
            </dd>
          </div>
          <div>
            <dt>סוקרים</dt>
            <dd className="cr-roles">
              {roles.map((r) => (
                <span key={r} className={`cr-role t-${roleTone(r)}`}>
                  {r}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <div className="cr-actions">
          <button onClick={() => setIdeaDraft("")}>שמור רעיון</button>
          <button onClick={() => setBoard(true)}>מחסן הרעיונות</button>
          <button className="cr-x" onClick={onClose} aria-label="סגור את חדר העבודה" title="סגור (Esc)">
            ✕
          </button>
        </div>
      </header>

      <div className="cr-grid">
        <nav className="cr-rail" aria-label="סעיפי המסמך">
          <div className="cr-rail-h">סעיפים</div>
          <button className={`cr-sec${view === "brief" ? " is-on" : ""}`} onClick={() => setView("brief")}>
            <span className="cr-sec-no">0</span>
            <span className="cr-sec-name">תקציר המקרה</span>
          </button>
          {c.stages.map((s) => {
            const st = sectionStatus(d.stages[s]);
            const locked = !!cur && c.stages.indexOf(s) > c.stages.indexOf(cur);
            return (
              <button key={s} className={`cr-sec st-${st}${view === s ? " is-on" : ""}`} disabled={locked} onClick={() => setView(s)} title={locked ? "נפתח אחרי שהסעיף הקודם נסגר" : undefined}>
                <span className="cr-sec-no">{stageNo(s)}</span>
                <span className="cr-sec-name">{STAGE_NAMES[s]}</span>
                <span className={`cr-sec-st st-${st}`}>{locked ? "נעול" : SECTION_LABEL[st]}</span>
              </button>
            );
          })}
          <button className={`cr-sec${view === "adr" ? " is-on" : ""}`} disabled={!allClosed} onClick={() => setView("adr")}>
            <span className="cr-sec-no">✎</span>
            <span className="cr-sec-name">ADR ותחקיר</span>
            <span className={`cr-sec-st st-${d.adr ? "closed" : "open"}`}>{d.adr ? "נכתב" : allClosed ? "פתוח" : "נעול"}</span>
          </button>
          <div className="cr-rail-prog">
            <div className="case-progress">
              <span style={{ width: `${c.stages.length ? (100 * closedCount(c, d)) / c.stages.length : 0}%` }} />
            </div>
            {closedCount(c, d)}/{c.stages.length} סעיפים סגורים
          </div>
        </nav>

        <main className="cr-main">
          {err && (
            <div className="cr-err" role="alert">
              {err}
            </div>
          )}
          {!canAsk && <div className="cr-err">אין כאן חיבור למודל: אפשר לכתוב ולחשב, אבל הסוקר והמומחה לא יענו.</div>}
          {view === "brief" ? (
            <BriefView c={c} onStart={() => setView(cur ?? "adr")} started={status !== "draft"} />
          ) : view === "adr" ? (
            <AdrView c={c} d={d} live={live?.kind === "debrief" ? live.text : null} busy={busy} canAsk={canAsk} onSave={saveAdr} onDebrief={() => void debrief()} />
          ) : (
            <StageView
              key={view}
              c={c}
              s={view}
              w={d.stages[view] ?? emptyStage()}
              live={live && live.stage === view ? live : null}
              busy={busy}
              canAsk={canAsk}
              onSubmit={() => submit(view)}
              onDraft={(p) => setStage(view, (w) => ({ ...w, ...p }))}
              onReply={(t) => reply(view, t)}
              onReview={() => void review(view)}
              onCompute={(t) => void compute(view, t)}
              onCommit={(dec, conf) => commit(view, dec, conf)}
              onExpert={() => void expert(view)}
              onToggle={(i) => toggleRubric(view, i)}
              onResolve={(id) => setStage(view, (w) => ({ ...w, turns: w.turns.map((t) => (t.id === id ? { ...t, resolved: !t.resolved } : t)) }))}
              onClose={(r) => close(view, r)}
              onIdea={(t) => setIdeaDraft(t)}
              onStop={() => ctl.current?.abort()}
            />
          )}
        </main>

        <aside className="cr-side" aria-label="יומן ההחלטות, ספר המספרים וההנחות">
          <SidePanel c={c} d={d} onGo={setView} onAssumption={(s, i) => setStage(s, (w) => ({ ...w, assumptions: (w.assumptions ?? []).map((a, k) => (k === i ? { ...a, closed: !a.closed } : a)) }))} />
        </aside>
      </div>

      {ideaDraft !== null && <IdeaForm initial={ideaDraft} stage={cur} onSave={(t) => void keepIdea(t)} onCancel={() => setIdeaDraft(null)} />}
      {board && <IdeasBoard store={ideas} onClose={() => setBoard(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ the brief ------------------------------------------------------------------ */

function BriefView({ c, onStart, started }: { c: CaseBlock; onStart: () => void; started: boolean }) {
  return (
    <article className="cr-doc">
      <div className="cr-sec-head">
        <span className="cr-sec-tag">0</span>
        <h2>תקציר המקרה</h2>
      </div>
      <div className="cr-brief prose">
        <Markdown text={c.brief} />
      </div>
      <div className="cr-process">
        <div className="cr-process-h">איך עובדים כאן</div>
        <ol>
          <li>בכל סעיף: הצעה ונימוק בכתב, עם אחוז ביטחון.</li>
          <li>הסוקר בתפקיד הסעיף מאתגר עם נתונים; מגנים, משנים או מתעקשים, כמה סבבים שצריך. "חשב / דמה לי" מריץ חישוב.</li>
          <li>"פתרתי ומתחייב" נועל את הסעיף; אז נימוק המומחה והמחוון, ואתה כותב מה הוא ראה שאתה לא.</li>
          <li>בסוף: רשומת החלטה (ADR) ותחקיר.</li>
        </ol>
      </div>
      <button className="cr-primary" onClick={onStart}>
        {started ? "המשך לסעיף הפתוח" : "התחל: הסעיף הראשון"}
      </button>
    </article>
  );
}

/* ------------------------------------------------------------------ a stage ------------------------------------------------------------------ */

function ConfInput({ value, onChange, label = "ביטחון" }: { value?: number; onChange: (v: number) => void; label?: string }) {
  const set = value !== undefined;
  return (
    <label className={`cr-conf${set ? "" : " is-unset"}`}>
      <span className="cr-conf-l">{label}</span>
      <input type="range" min={0} max={100} step={5} value={value ?? 50} onChange={(e) => onChange(Number(e.target.value))} onClick={(e) => onChange(Number((e.target as HTMLInputElement).value))} aria-label={`${label} באחוזים`} />
      <span className="cr-conf-v" dir="ltr">
        {set ? `${value}%` : "—"}
      </span>
      <span className="cr-conf-band">{set ? CONF_LABEL[confLevel(value!)] : "חובה"}</span>
    </label>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`cr-avatar t-${roleTone(role)}`} aria-hidden>
      {initials(role)}
    </span>
  );
}

function Cells({ cells, base }: { cells: CaseCell[]; base: number }) {
  return (
    <>
      {cells.map((x, i) => (
        <div className="cr-cell" key={i}>
          <div className="cr-cell-row">
            <span className="cr-cell-p" dir="ltr">
              In [{base + i}]
            </span>
            <pre dir="ltr">{x.script || x.ask}</pre>
          </div>
          <div className="cr-cell-row is-out">
            <span className="cr-cell-p" dir="ltr">
              Out[{base + i}]
            </span>
            <pre dir="ltr" className={x.ok ? "" : "is-err"}>
              {x.output || "(אין פלט)"}
            </pre>
          </div>
        </div>
      ))}
    </>
  );
}

function Turn({ t, round, cellBase, onResolve }: { t: CaseTurn; round: number; cellBase: number; onResolve?: () => void }) {
  if (t.who === "cell")
    return (
      <div className="cr-nb">
        <div className="cr-nb-h">
          <span className="cr-nb-tag">מחברת</span> חשב / דמה לי: <b>{t.cell?.[0]?.ask}</b>
        </div>
        <Cells cells={t.cell ?? []} base={cellBase} />
        {t.text && (
          <div className="cr-nb-note prose">
            <Markdown text={t.text} />
          </div>
        )}
      </div>
    );
  const rev = t.who === "reviewer";
  return (
    <div className={`cr-cmt ${rev ? "is-rev" : "is-me"}${t.resolved ? " is-resolved" : ""}`}>
      <div className="cr-cmt-h">
        {rev ? <RoleBadge role={t.role ?? ""} /> : <span className="cr-avatar t-owner-self">ל</span>}
        <b>{rev ? t.role : "הלומד"}</b>
        <span className={`cr-pill ${rev ? `t-${roleTone(t.role ?? "")}` : ""}`}>{rev ? "סוקר" : "בעלים"}</span>
        <span className="cr-cmt-round">סבב {round}</span>
        {rev && onResolve && (
          <button className="cr-resolve" onClick={onResolve}>
            {t.resolved ? "פתח מחדש" : "סמן כנפתר"}
          </button>
        )}
      </div>
      {t.resolved ? (
        <div className="cr-cmt-folded">{t.text.replace(/\s+/g, " ").slice(0, 120)}…</div>
      ) : (
        <div className="cr-cmt-b prose">
          <Markdown text={t.text} />
          {t.cut && <div className="cr-cut">(נעצר באמצע)</div>}
        </div>
      )}
    </div>
  );
}

interface StageProps {
  c: CaseBlock;
  s: CaseStage;
  w: StageWork;
  live: Live | null;
  busy: boolean;
  canAsk: boolean;
  onSubmit(): void;
  onDraft(p: Partial<StageWork>): void;
  onReply(t: string): void;
  onReview(): void;
  onCompute(t: string): void;
  onCommit(decision: string, confidence: number): void;
  onExpert(): void;
  onToggle(i: number): void;
  onResolve(id: string): void;
  onClose(reflection: string): void;
  onIdea(t: string): void;
  onStop(): void;
}

function StageView(p: StageProps) {
  const { c, s, w, live, busy, canAsk } = p;
  const n = c.notes.find((x) => x.stage === s);
  const role = stageRole(c, s);
  const [mode, setMode] = useState<"reply" | "compute">("reply");
  const [draft, setDraft] = useState("");
  const [signing, setSigning] = useState(false);
  const [decision, setDecision] = useState("");
  const [finalConf, setFinalConf] = useState<number | undefined>(undefined);
  const [reflection, setReflection] = useState(w.reflection ?? "");
  const st = sectionStatus(w);
  const reviewed = w.turns.some((t) => t.who === "reviewer");
  const lastLearner = w.turns.length > 0 && w.turns[w.turns.length - 1].who === "learner";
  const canSubmit = w.proposal.trim().length >= 20 && w.confidence !== undefined && !busy;
  let round = 0;
  let cells = 1;
  const locked = w.phase !== "draft" && w.phase !== "review";
  const reviewLive = live && (live.kind === "review" || live.kind === "cell");
  const expertText = live?.kind === "expert" ? live.text : w.expert;

  return (
    <article className="cr-doc">
      <div className="cr-sec-head">
        <span className="cr-sec-tag">{stageNo(s)}</span>
        <h2>{STAGE_NAMES[s]}</h2>
        <span className={`cr-sec-st st-${st}`}>{SECTION_LABEL[st]}</span>
        <span className="cr-sec-rev">
          סוקר: <RoleBadge role={role} /> <span className={`cr-role t-${roleTone(role)}`}>{role}</span>
        </span>
      </div>
      <div className="cr-ask">
        <span className="cr-ask-l">השאלה</span>
        <Markdown text={n?.ask || "—"} />
      </div>

      {w.phase === "draft" ? (
        <div className="cr-propose">
          <label className="cr-field">
            <span>ההצעה שלך והנימוק</span>
            <textarea
              rows={7}
              value={w.proposal}
              onChange={(e) => p.onDraft({ proposal: e.target.value })}
              placeholder="מה אתה מציע, ולמה. מספרים, הנחות, מה שקלת ודחית."
            />
          </label>
          <div className="cr-propose-foot">
            <ConfInput value={w.confidence} onChange={(v) => p.onDraft({ confidence: v })} />
            {s === "8" && (
              <button disabled={w.proposal.trim().length < 10} onClick={() => p.onIdea(w.proposal)}>
                שמור כרעיון
              </button>
            )}
            <button className="cr-primary" disabled={!canSubmit} onClick={p.onSubmit} title={w.confidence === undefined ? "בלי אחוז ביטחון אי אפשר לשלוח" : undefined}>
              שלח לסקירה
            </button>
          </div>
          {w.confidence === undefined && <div className="cr-hint">בלי אחוז ביטחון אי אפשר לשלוח. ההצעה נשמרת תוך כדי כתיבה.</div>}
        </div>
      ) : (
        <>
          <div className="cr-proposal">
            <div className="cr-proposal-h">
              <span className="cr-avatar t-owner-self">ל</span>
              <b>ההצעה</b>
              <span className="cr-pill">ביטחון {w.confidence}%</span>
            </div>
            <div className="prose">
              <Markdown text={w.proposal} />
            </div>
          </div>

          <div className="cr-thread-h">שרשור הסקירה</div>
          <div className="cr-thread">
            {w.turns.map((t) => {
              if (t.who !== "cell") round += t.who === "reviewer" ? 1 : 0;
              const base = cells;
              cells += t.cell?.length ?? 0;
              return <Turn key={t.id} t={t} round={Math.max(1, round)} cellBase={base} onResolve={!locked || t.resolved ? () => p.onResolve(t.id) : undefined} />;
            })}
            {reviewLive && (
              <div className={live!.kind === "cell" ? "cr-nb is-live" : "cr-cmt is-rev is-live"}>
                <div className="cr-cmt-h">
                  {live!.kind === "cell" ? <span className="cr-nb-tag">מחברת</span> : <RoleBadge role={role} />}
                  <b>{live!.kind === "cell" ? "מחשב…" : role}</b>
                  <span className="cr-typing">כותב…</span>
                  <button className="cr-resolve" onClick={p.onStop}>
                    עצור
                  </button>
                </div>
                <div className="cr-cmt-b prose">
                  <Markdown text={parseReview(live!.text).body || "…"} />
                </div>
              </div>
            )}
          </div>

          {w.phase === "review" && !busy && lastLearner && canAsk && (
            <button className="cr-ghost" onClick={p.onReview}>
              בקש את תגובת הסוקר
            </button>
          )}
          {w.phase === "review" && !reviewed && !busy && !lastLearner && canAsk && (
            <button className="cr-ghost" onClick={p.onReview}>
              בקש את הסקירה
            </button>
          )}

          {w.phase === "review" && !signing && (
            <div className="cr-composer">
              <div className="cr-tabs" role="tablist">
                <button role="tab" aria-selected={mode === "reply"} className={mode === "reply" ? "is-on" : ""} onClick={() => setMode("reply")}>
                  השב לסוקר
                </button>
                <button role="tab" aria-selected={mode === "compute"} className={mode === "compute" ? "is-on" : ""} onClick={() => setMode("compute")}>
                  חשב / דמה לי
                </button>
              </div>
              <textarea
                rows={mode === "reply" ? 4 : 2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                dir={mode === "compute" && draft && !/[֐-׿]/.test(draft) ? "ltr" : undefined}
                placeholder={mode === "reply" ? "הגן, שנה או התעקש, עם נימוק." : 'מה לחשב או לדמות, במילים ("טווח הגילוי אם ה-RCS יורד פי 10"), או סקריפט math.js'}
              />
              <div className="cr-composer-foot">
                <button
                  className={mode === "reply" ? "cr-primary" : "cr-cellbtn"}
                  disabled={busy || !draft.trim() || (mode === "reply" && !canAsk)}
                  onClick={() => {
                    if (mode === "reply") p.onReply(draft.trim());
                    else p.onCompute(draft.trim());
                    setDraft("");
                  }}
                >
                  {mode === "reply" ? "השב" : "▶ הרץ"}
                </button>
                <span className="cr-grow" />
                <button
                  className="cr-commit"
                  disabled={busy || !reviewed}
                  title={reviewed ? undefined : "קודם סבב סקירה אחד לפחות"}
                  onClick={() => {
                    setDecision(w.proposal.split("\n").find((l) => l.trim())?.slice(0, 200) ?? "");
                    setFinalConf(w.confidence);
                    setSigning(true);
                  }}
                >
                  פתרתי ומתחייב
                </button>
              </div>
            </div>
          )}

          {w.phase === "review" && signing && (
            <div className="cr-sign">
              <div className="cr-sign-h">התחייבות (sign-off) · {stageTitle(s)}</div>
              <label className="cr-field">
                <span>ההחלטה, בשורה אחת (תיכנס ליומן ההחלטות)</span>
                <input value={decision} onChange={(e) => setDecision(e.target.value)} />
              </label>
              <div className="cr-propose-foot">
                <ConfInput value={finalConf} onChange={setFinalConf} label="ביטחון סופי" />
                <button onClick={() => setSigning(false)}>חזרה לסקירה</button>
                <button className="cr-commit" disabled={!decision.trim() || finalConf === undefined} onClick={() => p.onCommit(decision.trim(), finalConf!)}>
                  התחייב ונעל
                </button>
              </div>
            </div>
          )}

          {w.commit && (
            <div className="cr-locked">
              <span className="cr-lock">נעול</span>
              <span className="cr-locked-t">{w.commit.decision}</span> <span className="cr-pill">ביטחון {w.commit.confidence}%</span>
            </div>
          )}

          {locked && (
            <section className="cr-expert">
              <div className="cr-expert-h">
                <RoleBadge role="מהנדס בכיר" />
                <b>נימוק המומחה, בקול רם</b>
                {live?.kind === "expert" && <span className="cr-typing">כותב…</span>}
              </div>
              {expertText ? (
                <div className="prose">
                  <Markdown text={parseExpert(expertText, n?.rubric.length ?? 0).body} />
                </div>
              ) : (
                !busy && (
                  <button className="cr-ghost" disabled={!canAsk} onClick={p.onExpert}>
                    הפק את נימוק המומחה
                  </button>
                )
              )}
            </section>
          )}

          {w.rubric && n && (
            <section className="cr-rubric">
              <div className="cr-rubric-h">
                <b>המחוון</b>
                <span className={`cr-grade g-${w.grade}`}>{w.grade ? GRADE_LABEL[w.grade] : ""}</span>
                <span className="cr-calib">
                  ביטחון {w.commit?.confidence}% ({w.commit ? CONF_LABEL[confLevel(w.commit.confidence)] : ""}){w.disputed ? " · עודכן ידנית" : ""}
                </span>
              </div>
              <ul>
                {n.rubric.map((r, i) => (
                  <li key={i} className={`${r.decisive ? "is-decisive " : ""}${w.rubric![i] ? "is-met" : "is-miss"}`}>
                    <button className="cr-check" onClick={() => p.onToggle(i)} disabled={w.phase === "closed"} aria-label={w.rubric![i] ? "עמד" : "לא עמד"} title="ערער: שנה את הסימון">
                      {w.rubric![i] ? "✓" : "✗"}
                    </button>
                    <span>{r.text}</span>
                    {r.decisive && <span className="cr-decisive">ההחלטה המכריעה</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {w.phase === "reflect" && (
            <div className="cr-reflect">
              <label className="cr-field">
                <span>מה המומחה ראה שאני לא</span>
                <textarea rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="במשפט או שניים: מה פספסת, ולמה." />
              </label>
              <button className="cr-primary" disabled={reflection.trim().length < 15} onClick={() => p.onClose(reflection.trim())}>
                סגור את הסעיף והמשך
              </button>
            </div>
          )}
          {w.phase === "closed" && w.reflection && (
            <div className="cr-reflect is-done">
              <span className="cr-ask-l">מה המומחה ראה שאני לא</span>
              <p>{w.reflection}</p>
            </div>
          )}
        </>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ the side panel ------------------------------------------------------------------ */

function SidePanel({ c, d, onGo, onAssumption }: { c: CaseBlock; d: CaseDoc; onGo: (s: CaseStage) => void; onAssumption: (s: CaseStage, i: number) => void }) {
  const log = c.stages.filter((s) => d.stages[s]?.commit);
  const numbers = c.stages.flatMap((s) => (d.stages[s]?.numbers ?? []).map((x) => ({ s, x })));
  const assumptions = c.stages.flatMap((s) => (d.stages[s]?.assumptions ?? []).map((a, i) => ({ s, a, i })));
  const open = assumptions.filter((x) => !x.a.closed).length;
  return (
    <>
      <Panel title="יומן החלטות" count={log.length}>
        {log.length ? (
          <ol className="cr-log">
            {log.map((s) => {
              const w = d.stages[s]!;
              return (
                <li key={s}>
                  <button onClick={() => onGo(s)}>
                    <span className="cr-log-no">{stageNo(s)}</span>
                    <span className="cr-log-t">{w.commit!.decision}</span>
                    <span className="cr-log-m">
                      {w.commit!.confidence}%{w.grade && <i className={`g-${w.grade}`}> · {GRADE_LABEL[w.grade]}</i>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="cr-empty">שורה לכל סעיף שננעל.</div>
        )}
      </Panel>
      <Panel title="ספר המספרים" count={numbers.length}>
        {numbers.length ? (
          <ul className="cr-ledger">
            {numbers.map(({ s, x }, i) => (
              <li key={i}>
                <span className="cr-log-no">{stageNo(s)}</span>
                <span className="cr-ledger-x">
                  <Markdown text={x} inline />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="cr-empty">גבולות ופערים שעלו בסקירה ובחישובים.</div>
        )}
      </Panel>
      <Panel title="הנחות פתוחות" count={open}>
        {assumptions.length ? (
          <ul className="cr-assume">
            {assumptions.map(({ s, a, i }) => (
              <li key={`${s}-${i}`} className={a.closed ? "is-closed" : ""}>
                <label>
                  <input type="checkbox" checked={!!a.closed} onChange={() => onAssumption(s, i)} />
                  <span className="cr-log-no">{stageNo(s)}</span>
                  <span>{a.text}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <div className="cr-empty">הנחות שלא נבדקו; סמן כשבדקת.</div>
        )}
      </Panel>
    </>
  );
}

function Panel({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="cr-panel">
      <h3>
        {title} <span className="cr-count">{count}</span>
      </h3>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ the ADR and the debrief ------------------------------------------------------------------ */

const ADR_FIELDS: { k: keyof Omit<CaseAdr, "at">; label: string; hint: string; need?: boolean }[] = [
  { k: "context", label: "הקשר", hint: "הבעיה, הכוחות והאילוצים שהכריעו; המספרים מספר המספרים.", need: true },
  { k: "decision", label: "החלטה", hint: "מה החלטת, בלשון פעילה (\"נבחר…\").", need: true },
  { k: "alternatives", label: "חלופות שנדחו", hint: "כל חלופה ולמה נדחתה.", need: true },
  { k: "consequences", label: "השלכות", hint: "מה נעשה קל יותר, מה קשה יותר, איזה סיכון נלקח." },
  { k: "reversal", label: "מה יהפוך אותה", hint: "איזו תוצאה או נתון יחזירו את ההחלטה לשולחן." },
];

function AdrView({ c, d, live, busy, canAsk, onSave, onDebrief }: { c: CaseBlock; d: CaseDoc; live: string | null; busy: boolean; canAsk: boolean; onSave: (a: CaseAdr) => void; onDebrief: () => void }) {
  const [edit, setEdit] = useState(!d.adr);
  const [f, setF] = useState<Omit<CaseAdr, "at">>(() => d.adr ?? { context: "", decision: "", alternatives: "", consequences: "", reversal: "" });
  const ok = ADR_FIELDS.every((x) => !x.need || f[x.k].trim().length >= 10);
  const no = adrNumber(c.id);
  const debrief = live ?? d.debrief;
  return (
    <article className="cr-doc">
      <div className="cr-sec-head">
        <span className="cr-sec-tag">✎</span>
        <h2>רשומת החלטה ותחקיר</h2>
      </div>
      {edit ? (
        <div className="cr-adr-form">
          <div className="cr-hint">
            ההחלטות שננעלו (מיומן ההחלטות):{" "}
            {c.stages
              .map((s) => d.stages[s]?.commit?.decision)
              .filter(Boolean)
              .join(" · ")}
          </div>
          {ADR_FIELDS.map((x) => (
            <label className="cr-field" key={x.k}>
              <span>
                {x.label}
                {x.need ? " *" : ""} <em>{x.hint}</em>
              </span>
              <textarea rows={x.k === "context" ? 4 : 3} value={f[x.k]} onChange={(e) => setF({ ...f, [x.k]: e.target.value })} />
            </label>
          ))}
          <button
            className="cr-primary"
            disabled={!ok}
            onClick={() => {
              onSave({ ...f, at: Date.now() });
              setEdit(false);
            }}
          >
            הפק את {no}
          </button>
        </div>
      ) : (
        d.adr && (
          <div className="cr-adr">
            <div className="cr-adr-top">
              <span className="case-docid" dir="ltr">
                {no}
              </span>
              <span className="case-status s-approved">התקבל</span>
              <span className="cr-adr-date">{new Date(d.adr.at).toLocaleDateString("he-IL")}</span>
              <button className="cr-resolve" onClick={() => setEdit(true)}>
                ערוך
              </button>
            </div>
            <h3 className="cr-adr-title">
              <Markdown text={c.title} inline />
            </h3>
            <dl className="cr-adr-meta">
              <div>
                <dt>החליט</dt>
                <dd>הלומד</dd>
              </div>
              <div>
                <dt>נסקר ע"י</dt>
                <dd>{[...new Set(c.stages.map((s) => stageRole(c, s)))].join(", ")}</dd>
              </div>
              <div>
                <dt>מסמך תכן</dt>
                <dd dir="ltr">{docNumber(c.id)}</dd>
              </div>
            </dl>
            {ADR_FIELDS.map((x) =>
              d.adr![x.k].trim() ? (
                <section key={x.k}>
                  <h4>{x.label}</h4>
                  <Markdown text={d.adr![x.k]} />
                </section>
              ) : null,
            )}
          </div>
        )
      )}
      {d.adr && !edit && (
        <section className="cr-pm">
          <div className="cr-pm-h">
            <span className="cr-nb-tag">תחקיר</span> <b>post-mortem</b> <span className="cr-hint">ללא האשמה · מה עבד, איפה סטית, מה הוחמץ, מה לוקחים</span>
            {live !== null && <span className="cr-typing">כותב…</span>}
          </div>
          {debrief ? (
            <div className="prose">
              <Markdown text={debrief.replace(/^(\*\*[^*\n]+\*\*)[ \t]*\n(?!\n)/gm, "$1\n\n")} />
            </div>
          ) : (
            !busy && (
              <button className="cr-ghost" disabled={!canAsk} onClick={onDebrief}>
                הפק את התחקיר
              </button>
            )
          )}
        </section>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ ideas ------------------------------------------------------------------ */

function IdeaForm({ initial, stage, onSave, onCancel }: { initial: string; stage: CaseStage | null; onSave: (t: string) => void; onCancel: () => void }) {
  const [t, setT] = useState(initial);
  return (
    <div className="cr-modal" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="cr-modal-box" role="dialog" aria-label="שמור רעיון">
        <h3>שמור רעיון {stage ? <span className="cr-hint">· מ{stageTitle(stage)}</span> : null}</h3>
        <textarea rows={5} value={t} onChange={(e) => setT(e.target.value)} placeholder="מה היית עושה אחרת? הרעיון נכנס למחסן כזרע." autoFocus />
        <div className="cr-propose-foot">
          <span className="cr-grow" />
          <button onClick={onCancel}>ביטול</button>
          <button className="cr-primary" disabled={t.trim().length < 5} onClick={() => onSave(t.trim())}>
            שמור כזרע
          </button>
        </div>
      </div>
    </div>
  );
}

const COLUMNS: { k: Idea["status"]; label: string; hint: string }[] = [
  { k: "seed", label: "זרע", hint: "רעיון גולמי" },
  { k: "growing", label: "מבשיל", hint: "נבדק, יש לו מספרים" },
  { k: "project", label: "פרויקט", hint: "שווה זמן עבודה" },
];

type IdeaStoreLike = Parameters<typeof loadIdeas>[0] & Parameters<typeof saveIdea>[0];

export function IdeasBoard({ store, onClose }: { store: IdeaStoreLike; onClose: () => void }) {
  const [items, setItems] = useState<Idea[] | null>(null);
  useEffect(() => {
    loadIdeas(store)
      .then(setItems)
      .catch(() => setItems([]));
  }, [store]);
  const move = async (i: Idea, dir: 1 | -1) => {
    const k = COLUMNS.findIndex((x) => x.k === i.status) + dir;
    if (k < 0 || k >= COLUMNS.length) return;
    setItems(await saveIdea(store, { ...i, status: COLUMNS[k].k }).catch(() => items));
  };
  return (
    <div className="cr-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cr-board" role="dialog" aria-label="מחסן הרעיונות">
        <header className="cr-board-h">
          <h3>מחסן הרעיונות</h3>
          <span className="cr-hint">רעיונות שנולדו במקרים ההנדסיים, מזרע ועד פרויקט. הזז כשהרעיון מבשיל.</span>
          <span className="cr-grow" />
          <button className="cr-x" onClick={onClose} aria-label="סגור">
            ✕
          </button>
        </header>
        <div className="cr-cols">
          {COLUMNS.map((col, ci) => {
            const list = (items ?? []).filter((i) => i.status === col.k).sort((a, b) => b.at - a.at);
            return (
              <section key={col.k} className={`cr-col c-${col.k}`}>
                <h4>
                  {col.label} <span className="cr-count">{list.length}</span> <em>{col.hint}</em>
                </h4>
                {items === null ? <div className="cr-empty">טוען…</div> : !list.length && <div className="cr-empty">ריק</div>}
                {list.map((i) => (
                  <div key={i.id} className="cr-idea">
                    <p>{i.text}</p>
                    <div className="cr-idea-f">
                      <span className="cr-idea-src" dir="ltr">
                        {i.moduleId} · L{i.lesson + 1}
                        {i.stage ? ` · §${i.stage}` : ""}
                      </span>
                      <span className="cr-grow" />
                      {ci > 0 && (
                        <button onClick={() => void move(i, -1)} title={`חזרה ל${COLUMNS[ci - 1].label}`}>
                          → {COLUMNS[ci - 1].label}
                        </button>
                      )}
                      {ci < COLUMNS.length - 1 && (
                        <button className="cr-fwd" onClick={() => void move(i, 1)} title={`קדם ל${COLUMNS[ci + 1].label}`}>
                          {COLUMNS[ci + 1].label} ←
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
