// The month's product workspace (S2_product_track.md §2): seven stages, saved as the
// learner types to profile/products/<YYYY-MM>. The legality check comes before the idea
// goes on: the stages after it open once it is signed off.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Markdown } from "../components/Markdown";
import { CHECK_KINDS, GITHUB_CHECKLIST, LAB } from "./config";
import { monthId, monthLabel, shortDate } from "./data";
import { critiqueStage } from "./critique";
import {
  LEGAL_ANSWERS,
  STAGES,
  emptyProduct,
  independentChecks,
  legalState,
  listProducts,
  loadProduct,
  saveProduct,
  stageProgress,
  type Check,
  type Competitor,
  type Prediction,
  type Product,
  type StageId,
} from "./products";
import type { LabTabProps } from "./LabTabs";

const SAVE_AFTER = 1000;
const NEXT_LABEL = { users: "משתמשים", v2: "גרסה 2", sale: "מכירה", close: "נסגר כאן" } as const;

export function ProductsTab({ lab, rt }: LabTabProps) {
  const store = rt?.store ?? null;
  const cfg = LAB[lab];
  const thisMonth = monthId();
  const [months, setMonths] = useState<{ month: string; title: string }[] | null>(null);
  const [month, setMonth] = useState(thisMonth);
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<StageId>("idea");
  const [saved, setSaved] = useState<"" | "saving" | "saved" | "error">("");
  const timer = useRef<number | undefined>(undefined);
  const pending = useRef<Product | null>(null);

  useEffect(() => {
    if (!store) return setMonths([]);
    listProducts(store)
      .then(setMonths)
      .catch(() => setMonths([]));
  }, [store]);

  useEffect(() => {
    let live = true;
    setLoading(true);
    (store ? loadProduct(store, month) : Promise.resolve(null))
      .then((doc) => {
        if (!live) return;
        setP(doc);
        setLoading(false);
        if (doc) {
          // open at the first stage that is not done yet
          const prog = stageProgress(doc, cfg.legal);
          const first = STAGES.find((s) => prog[s.id] < 1);
          setStage(first?.id ?? "retro");
        }
      })
      .catch(() => live && (setLoading(false), setSaved("error")));
    return () => {
      live = false;
    };
  }, [store, month, cfg.legal]);

  const flush = () => {
    window.clearTimeout(timer.current);
    const doc = pending.current;
    pending.current = null;
    if (!doc || !store) return;
    setSaved("saving");
    saveProduct(store, doc)
      .then(() => setSaved("saved"))
      .catch(() => setSaved("error"));
  };
  // what was typed is saved before leaving the tab or the page
  useEffect(() => {
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const update = (fn: (d: Product) => Product) => {
    setP((cur) => {
      if (!cur) return cur;
      const next = fn(cur);
      pending.current = next;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, SAVE_AFTER);
      return next;
    });
  };

  const start = () => {
    const doc = emptyProduct(month);
    setP(doc);
    setStage("idea");
    pending.current = doc;
    flush();
    setMonths((m) => (m && !m.some((x) => x.month === month) ? [{ month, title: "" }, ...m] : m));
  };

  const prog = useMemo(() => (p ? stageProgress(p, cfg.legal) : null), [p, cfg.legal]);
  const legal = p ? legalState(p, cfg.legal) : null;
  const monthList = useMemo(() => {
    const l = months ?? [];
    return l.some((x) => x.month === thisMonth) ? l : [{ month: thisMonth, title: "" }, ...l];
  }, [months, thisMonth]);

  return (
    <div className="lt-wrap prod">
      <header className="lt-head">
        <div>
          <div className="lt-kicker">{cfg.name} · מוצר החודש</div>
          <h1>{p?.title.trim() || monthLabel(month)}</h1>
          <div className="muted">מתכן, דרך סימולציה ואימות, עד מוצר שאפשר למכור. הרעיון שלך; הבנייה עם סוכנים.</div>
        </div>
        <div className="lt-head-side">
          {monthList.length > 1 && (
            <label className="lt-picker">
              <span>חודש</span>
              <select value={month} onChange={(e) => (flush(), setMonth(e.target.value))}>
                {monthList.map((m) => (
                  <option key={m.month} value={m.month}>
                    {monthLabel(m.month)}
                    {m.title ? ` · ${m.title}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          {p && <span className={`lt-saved ${saved}`}>{!store ? "לא נשמר בתצוגה הזו" : saved === "saving" ? "שומר…" : saved === "error" ? "השמירה לא הצליחה; מנסה שוב בשינוי הבא" : saved === "saved" ? "נשמר" : ""}</span>}
        </div>
      </header>

      {loading ? (
        <p className="lt-empty">טוען…</p>
      ) : !p ? (
        <div className="prod-start">
          <p className="lt-empty">המוצר של {monthLabel(month)} מתחיל ברעיון: שאלה, למי זה, ובמה זה טוב יותר ממה שקיים.</p>
          <button className="btn primary" onClick={start}>
            התחל את מוצר החודש
          </button>
          {!store && <p className="muted">בתצוגה הזו העבודה לא נשמרת. ב-claude.ai, עם הרשאת כתיבה, היא נשמרת בחשבון שלך.</p>}
        </div>
      ) : (
        <>
          <ol className="prod-rail" aria-label="שלבים">
            {STAGES.map((s, i) => {
              const locked = i > 1 && !legal!.done;
              const v = prog![s.id];
              return (
                <li key={s.id}>
                  <button className={`prod-step ${stage === s.id ? "is-on" : ""} ${v >= 1 ? "is-done" : v > 0 ? "is-part" : ""} ${locked ? "is-wait" : ""}`} onClick={() => setStage(s.id)} aria-current={stage === s.id ? "step" : undefined}>
                    <span className="prod-step-n">{v >= 1 ? "✓" : i + 1}</span>
                    <span className="prod-step-l">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <StagePanel
            key={stage}
            stage={stage}
            p={p}
            update={update}
            lab={lab}
            rt={rt}
            locked={STAGES.findIndex((s) => s.id === stage) > 1 && !legal!.done}
            onToLegal={() => setStage("legal")}
          />
        </>
      )}
    </div>
  );
}

function StagePanel({ stage, p, update, lab, rt, locked, onToLegal }: { stage: StageId; p: Product; update: (fn: (d: Product) => Product) => void; lab: LabTabProps["lab"]; rt: LabTabProps["rt"]; locked: boolean; onToLegal: () => void }) {
  const cfg = LAB[lab];
  const st = STAGES.find((s) => s.id === stage)!;
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState("");
  const [err, setErr] = useState("");
  const ctl = useRef<AbortController | null>(null);
  useEffect(() => () => ctl.current?.abort(), []);

  const set = <K extends keyof Product>(k: K, patch: Partial<Product[K]>) => update((d) => ({ ...d, [k]: { ...(d[k] as object), ...patch } }));

  const critique = async () => {
    if (!rt?.sample || busy) return;
    setBusy(true);
    setErr("");
    setLive("");
    const c = new AbortController();
    ctl.current = c;
    try {
      const text = await critiqueStage({ rt, lab, product: p, stage, legal: cfg.legal, signal: c.signal, onText: setLive });
      update((d) => ({ ...d, critiques: { ...d.critiques, [stage]: { text, at: Date.now() } } }));
      setLive("");
    } catch (e) {
      if (!c.signal.aborted) setErr((e as { code?: string })?.code === "rate_limited" ? "הגעת למגבלת השימוש כרגע. אפשר לנסות שוב בעוד כמה דקות." : "הביקורת לא הגיעה. אפשר לנסות שוב.");
    } finally {
      setBusy(false);
    }
  };

  const saved = p.critiques[stage];
  return (
    <section className="prod-panel">
      <header className="prod-panel-head">
        <div>
          <h2>{st.label}</h2>
          <div className="muted">{st.sub}</div>
        </div>
        {!locked && (
          <button className="btn small" onClick={critique} disabled={!rt?.sample || busy} title="ביקורת קצרה ומובנית על השלב הזה, מהמודל הראשי">
            {busy ? "כותב ביקורת…" : "בקש ביקורת"}
          </button>
        )}
      </header>

      {locked && (
        <div className="lt-note">
          השלבים מכאן נפתחים אחרי בדיקת החוקיות.{" "}
          <button className="link" onClick={onToLegal}>
            לבדיקת החוקיות
          </button>
        </div>
      )}

      <fieldset className="prod-fields" disabled={locked}>
        {stage === "idea" && (
          <>
            <Field label="שם המוצר" value={p.title} onChange={(v) => update((d) => ({ ...d, title: v }))} single />
            <Field label="השאלה" hint="מה המוצר עונה עליו, במשפט אחד שאפשר למדוד" value={p.idea.question} onChange={(v) => set("idea", { question: v })} />
            <Field label="למי זה" value={p.idea.forWhom} onChange={(v) => set("idea", { forWhom: v })} />
            <Field label="במה זה טוב יותר ממה שקיים" hint="בטענה שאפשר לבדוק במספר" value={p.idea.better} onChange={(v) => set("idea", { better: v })} />
            <Field label="מה מהשיעורים של החודש הוא בונה" hint="משימות ה-lab של השיעורים בונות חלקים מהמוצר" value={p.idea.fromLessons} onChange={(v) => set("idea", { fromLessons: v })} />
          </>
        )}

        {stage === "legal" && <LegalStage p={p} update={update} lab={lab} />}

        {stage === "spec" && (
          <>
            <Field label="המפרט" hint="מה המוצר עושה, בדרישות שאפשר לבדוק" value={p.spec.spec} onChange={(v) => set("spec", { spec: v })} rows={5} />
            <Rows<Competitor>
              label="שלושה עד חמישה מתחרים או baselines"
              rows={p.spec.competitors}
              onChange={(competitors) => set("spec", { competitors })}
              blank={{ name: "", url: "", note: "" }}
              cols={[
                { k: "name", label: "שם" },
                { k: "url", label: "קישור", ltr: true },
                { k: "note", label: "במה הוא טוב, ומה חסר בו" },
              ]}
            />
            <Field label="הבנצ'מרק שמולו נמדדים" hint="ציבורי והוגן: מאגר, בעיה או מדד מוכר" value={p.spec.benchmark} onChange={(v) => set("spec", { benchmark: v })} />
            <Field label="השערת מחיר ולקוח" value={p.spec.price} onChange={(v) => set("spec", { price: v })} single />
          </>
        )}

        {stage === "design" && (
          <>
            <Field label="ההחלטות" hint="מה נבחר, ומול אילו חלופות" value={p.design.decisions} onChange={(v) => set("design", { decisions: v })} rows={5} />
            <Field label="הפשרות" hint="מה משלמים על כל החלטה" value={p.design.tradeoffs} onChange={(v) => set("design", { tradeoffs: v })} />
            <Rows<Prediction>
              label="תחזיות לפני שהסוכנים מריצים"
              hint="תחזית מספרית לכל תוצאה מרכזית, עם הבסיס שלה. את העמודה 'בפועל' ממלאים אחרי האימות."
              rows={p.design.predictions}
              onChange={(predictions) => set("design", { predictions })}
              blank={{ quantity: "", value: "", basis: "", actual: "" }}
              cols={[
                { k: "quantity", label: "גודל" },
                { k: "value", label: "תחזית", ltr: true },
                { k: "basis", label: "על סמך" },
                { k: "actual", label: "בפועל", ltr: true },
              ]}
            />
          </>
        )}

        {stage === "verify" && (
          <>
            <div className={`lt-meter ${independentChecks(p) >= 2 ? "is-ok" : ""}`}>
              סוגי בדיקה בלתי תלויים: {independentChecks(p)} מתוך 2 לפחות
              <span className="muted"> · {CHECK_KINDS.map((k) => k.label).join(" · ")}</span>
            </div>
            <Rows<Check>
              label="בדיקות"
              hint="כל תוצאה מרכזית עוברת לפחות שתיים מהסוגים, שלא חולקים את אותה טעות"
              rows={p.verify.checks}
              onChange={(checks) => set("verify", { checks })}
              blank={{ result: "", kind: "", how: "", pass: "", status: "planned" }}
              cols={[
                { k: "result", label: "התוצאה שנבדקת" },
                { k: "kind", label: "סוג", options: CHECK_KINDS.map((k) => ({ value: k.id, label: k.label })) },
                { k: "how", label: "איך (כלי, מאגר, מקרה)" },
                { k: "pass", label: "עובר אם", ltr: true },
                {
                  k: "status",
                  label: "מצב",
                  options: [
                    { value: "planned", label: "מתוכנן" },
                    { value: "passed", label: "עבר" },
                    { value: "failed", label: "נכשל" },
                  ],
                },
              ]}
            />
            <Field label="ה-baseline שמולו משווים במספרים" value={p.verify.baseline} onChange={(v) => set("verify", { baseline: v })} single />
          </>
        )}

        {stage === "package" && (
          <>
            <div className="lt-meter">
              {GITHUB_CHECKLIST.filter((c) => p.package.checklist[c.id]).length} מתוך {GITHUB_CHECKLIST.length}
            </div>
            <ul className="prod-check">
              {GITHUB_CHECKLIST.map((c) => (
                <li key={c.id}>
                  <label>
                    <input type="checkbox" checked={!!p.package.checklist[c.id]} onChange={(e) => set("package", { checklist: { ...p.package.checklist, [c.id]: e.target.checked } })} />
                    {c.label}
                  </label>
                </li>
              ))}
            </ul>
            <Field label="המאגר" value={p.package.repo} onChange={(v) => set("package", { repo: v })} single ltr />
            <Rows<Competitor>
              label="שלושה עד חמישה פרויקטים מובילים בתחום, להשוואה"
              rows={p.package.comparables}
              onChange={(comparables) => set("package", { comparables })}
              blank={{ name: "", url: "", note: "" }}
              cols={[
                { k: "name", label: "פרויקט" },
                { k: "url", label: "קישור", ltr: true },
                { k: "note", label: "מה לקחת מהם" },
              ]}
            />
          </>
        )}

        {stage === "retro" && (
          <>
            <Field label="מה עבד" value={p.retro.worked} onChange={(v) => set("retro", { worked: v })} />
            <Field label="מה נכשל, ולמה" hint="אילו תחזיות לא החזיקו, ומה ההסבר" value={p.retro.failed} onChange={(v) => set("retro", { failed: v })} />
            <Field label="מה לוקחים לחודש הבא" value={p.retro.learned} onChange={(v) => set("retro", { learned: v })} />
            <div className="prod-next">
              <span>בכל רבעון אחד המוצרים ממשיך:</span>
              {(Object.keys(NEXT_LABEL) as (keyof typeof NEXT_LABEL)[]).map((k) => (
                <button key={k} type="button" className="lt-chip" aria-pressed={p.retro.next === k} onClick={() => set("retro", { next: p.retro.next === k ? "" : k })}>
                  {NEXT_LABEL[k]}
                </button>
              ))}
            </div>
          </>
        )}
      </fieldset>

      {(live || saved || err) && (
        <div className="lt-box critique">
          <div className="lt-box-h">ביקורת{saved && !live ? ` · ${shortDate(saved.at)}` : ""}</div>
          {err ? <p className="lt-err">{err}</p> : <div className="prose"><Markdown text={live || saved!.text} /></div>}
        </div>
      )}
    </section>
  );
}

function LegalStage({ p, update, lab }: { p: Product; update: (fn: (d: Product) => Product) => void; lab: LabTabProps["lab"] }) {
  const cfg = LAB[lab];
  const s = legalState(p, cfg.legal);
  const setLegal = (patch: Partial<Product["legal"]>) => update((d) => ({ ...d, legal: { ...d.legal, ...patch } }));
  return (
    <>
      <details className="prod-domains">
        <summary>הערות החוק לפי תחום</summary>
        <ul>
          {cfg.domainLegal.map((d) => (
            <li key={d.domain}>
              <b>{d.domain}:</b> {d.note}
            </li>
          ))}
        </ul>
      </details>
      <ol className="prod-legal">
        {cfg.legal.map((q) => (
          <li key={q.id} className={`a-${p.legal.answers[q.id] || "none"}`}>
            <div className="prod-legal-q">{q.q}</div>
            <div className="prod-legal-hint muted">{q.hint}</div>
            <div className="prod-legal-a" role="radiogroup" aria-label={q.q}>
              {LEGAL_ANSWERS.map((a) => (
                <button key={a.id} type="button" role="radio" aria-checked={p.legal.answers[q.id] === a.id} className="lt-chip" onClick={() => setLegal({ answers: { ...p.legal.answers, [q.id]: a.id }, ...(p.legal.answers[q.id] !== a.id ? { doneAt: null } : {}) })}>
                  {a.label}
                </button>
              ))}
            </div>
            {p.legal.answers[q.id] && p.legal.answers[q.id] !== "na" && (
              <input className="lt-input" value={p.legal.notes[q.id] ?? ""} onChange={(e) => setLegal({ notes: { ...p.legal.notes, [q.id]: e.target.value } })} placeholder="איך, ועל סמך מה" aria-label="הערה" />
            )}
          </li>
        ))}
      </ol>
      {!!s.adjusting.length && <Field label="ההתאמות" hint="מה משתנה במוצר כדי שיעמוד בכללים (למשל קליטה בלבד, כבל ומנחתים, גרסה אזרחית)" value={p.legal.adjustments} onChange={(v) => setLegal({ adjustments: v })} />}
      <div className="prod-legal-foot">
        <span>
          נענו {s.answered} מתוך {s.total}
        </span>
        {!!s.asking.length && <span className="muted">לברר לפני שממשיכים: {s.asking.map((q) => q.q).join(" · ")}</span>}
        <span className="lt-spacer" />
        {s.done ? (
          <>
            <span className="lt-ok">✓ נבדק ב-{shortDate(p.legal.doneAt!)}</span>
            <button type="button" className="btn small" onClick={() => setLegal({ doneAt: null })}>
              לפתוח שוב
            </button>
          </>
        ) : (
          <button type="button" className="btn small primary" disabled={!s.ready} onClick={() => setLegal({ doneAt: Date.now() })}>
            הבדיקה הושלמה: אפשר להמשיך
          </button>
        )}
      </div>
    </>
  );
}

function Field({ label, hint, value, onChange, rows = 3, single, ltr }: { label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number; single?: boolean; ltr?: boolean }) {
  return (
    <label className="lt-field">
      <span className="lt-field-l">{label}</span>
      {hint && <span className="lt-field-h">{hint}</span>}
      {single ? <input className="lt-input" value={value} onChange={(e) => onChange(e.target.value)} dir={ltr ? "ltr" : "auto"} /> : <textarea className="lt-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} dir="auto" />}
    </label>
  );
}

type Col<T> = { k: keyof T & string; label: string; ltr?: boolean; options?: { value: string; label: string }[] };

function Rows<T extends Record<string, string>>({ label, hint, rows, onChange, blank, cols }: { label: string; hint?: string; rows: T[]; onChange: (r: T[]) => void; blank: T; cols: Col<T>[] }): ReactNode {
  const setCell = (i: number, k: keyof T, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="lt-field">
      <span className="lt-field-l">{label}</span>
      {hint && <span className="lt-field-h">{hint}</span>}
      <div className="lt-rows">
        {rows.map((r, i) => (
          <div key={i} className="lt-row" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr)) auto` }}>
            {cols.map((c) =>
              c.options ? (
                <select key={c.k} className="lt-input" value={r[c.k] ?? ""} onChange={(e) => setCell(i, c.k, e.target.value)} aria-label={c.label}>
                  <option value="">{c.label}</option>
                  {c.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input key={c.k} className="lt-input" value={r[c.k] ?? ""} placeholder={c.label} aria-label={c.label} dir={c.ltr ? "ltr" : "auto"} onChange={(e) => setCell(i, c.k, e.target.value)} />
              ),
            )}
            <button type="button" className="icon-btn lt-del" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="הסר שורה" title="הסר שורה">
              ×
            </button>
          </div>
        ))}
        <button type="button" className="btn small lt-add" onClick={() => onChange([...rows, { ...blank }])}>
          הוסף שורה
        </button>
      </div>
    </div>
  );
}
