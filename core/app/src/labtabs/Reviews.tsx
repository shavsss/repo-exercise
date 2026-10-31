// The weekly external review (NIGHT_PLAN P2-E, docs/REVIEW_SCHEMA.md): independent
// reviewer sessions score the week's lessons, answers, calibration, product and the
// lead-and-decide track against the domain targets (E2, LV2), and write one Hebrew
// report to profile/reviews/<YYYY-Www>. Read-only here.
import { useEffect, useState } from "react";
import { Markdown } from "../components/Markdown";
import { LAB } from "./config";
import { listReviews, loadReview, monthLabel, shortDate, type Persona, type ReviewDomain, type WeeklyReview } from "./data";
import type { LabTabProps } from "./LabTabs";

const PERSONA: Record<Persona, string> = { senior_engineer: "מהנדס בכיר", domain_expert: "מומחה תחום", systems_lead: "מוביל מערכות", human: "סוקר אנושי" };
const CONF = { low: "ודאות נמוכה", medium: "ודאות בינונית", high: "ודאות גבוהה" };
const TREND = { up: "במגמת עלייה", flat: "יציב", down: "במגמת ירידה" };
const LD_KIND = { trade: "מחקר פשרות", architecture: "בחירת ארכיטקטורה", review: "ביקורת תכן", agents: "הובלת צוות סוכנים" };
const HUMAN = { mentor: "מנטור", pr: "PR שמוזג", benchmark: "בנצ'מרק ציבורי", exam: "בחינה" };

export function ReviewsTab({ lab, rt, onOpenModule }: LabTabProps) {
  const store = rt?.store ?? null;
  const cfg = LAB[lab];
  const [ids, setIds] = useState<string[] | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [r, setR] = useState<WeeklyReview | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!store) return;
    listReviews(store)
      .then((l) => {
        setIds(l);
        setId((cur) => cur ?? l[0] ?? null);
      })
      .catch(() => (setIds([]), setErr("הביקורות לא נטענו. אפשר לרענן את הדף.")));
  }, [store]);

  useEffect(() => {
    if (!store || !id) return;
    let live = true;
    setR(null);
    loadReview(store, id)
      .then((v) => live && setR(v))
      .catch(() => live && setErr("הביקורת לא נטענה. אפשר לרענן את הדף."));
    return () => {
      live = false;
    };
  }, [store, id]);

  const head = (
    <div>
      <div className="lt-kicker">{cfg.name} · ביקורת שבועית</div>
      <h1>{r ? `שבוע ${shortDate(r.week.from)}–${shortDate(r.week.to)}` : "ביקורת שבועית"}</h1>
      <div className="muted">סוקרים בלתי תלויים בודקים את השיעורים, התשובות, הכיול והמוצר מול יעדי התחומים.</div>
    </div>
  );

  if (!store)
    return (
      <div className="lt-wrap">
        <header className="lt-head">{head}</header>
        <p className="lt-empty">הביקורות נשמרות בחשבון שלך ב-claude.ai, ויופיעו כאן כשהדף פתוח שם עם הרשאת כתיבה.</p>
      </div>
    );
  if (ids === null) return <div className="lt-wrap"><p className="lt-empty">טוען…</p></div>;

  return (
    <div className="lt-wrap rev">
      <header className="lt-head">
        {head}
        {ids.length > 1 && (
          <div className="lt-head-side">
            <label className="lt-picker">
              <span>שבוע</span>
              <select value={id ?? ""} onChange={(e) => setId(e.target.value)}>
                {ids.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </header>
      {err && <p className="lt-err">{err}</p>}
      {!ids.length && <p className="lt-empty">הביקורת השבועית הראשונה תגיע {cfg.reviewArrives}.</p>}
      {!!ids.length && !r && !err && <p className="lt-empty">טוען…</p>}
      {r && (
        <>
          {r.example && <p className="lt-example">ביקורת לדוגמה: מבנה הדוח, לא ציונים אמיתיים.</p>}
          <section className="rev-summary">
            {r.trend && <span className={`lt-tag t-${r.trend}`}>{TREND[r.trend]}</span>}
            <div className="prose">
              <Markdown text={r.summary} />
            </div>
            {r.scope && (
              <p className="muted rev-scope">
                נבדקו {r.scope.lessons.length} שיעורים ו-{r.scope.answers} תשובות
                {r.scope.lessons.length ? ": " : ""}
                {r.scope.lessons.map((l, i) => (
                  <span key={i}>
                    {i ? ", " : ""}
                    <button className="link" onClick={() => onOpenModule(l.moduleId)}>
                      <span dir="ltr">{l.moduleId}</span>
                    </button>{" "}
                    {l.title}
                  </span>
                ))}
              </p>
            )}
          </section>

          <section>
            <h2 className="lt-h2">תחומים מול היעד</h2>
            <div className="rev-legend muted">
              <span className="rev-key now" /> עכשיו <span className="rev-key target" /> יעד · סולם אחד: 1 ג'וניור, 2 ביניים, 3 סניור, 4 מומחה, 5 מוביל תחום
            </div>
            <ul className="rev-domains">
              {r.domains.map((d) => (
                <DomainRow key={d.id} d={d} />
              ))}
            </ul>
          </section>

          <div className="rev-cards">
            {r.calibration && (
              <div className="lt-card">
                <h4>כיול</h4>
                <dl className="rev-dl">
                  <div>
                    <dt>תחזיות</dt>
                    <dd>{r.calibration.predictions}</dd>
                  </div>
                  {r.calibration.brier !== undefined && (
                    <div>
                      <dt>Brier</dt>
                      <dd dir="ltr">{r.calibration.brier.toFixed(2)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>בטוח וטעה</dt>
                    <dd>{r.calibration.confidentWrong}</dd>
                  </div>
                </dl>
                <Markdown text={r.calibration.note} />
              </div>
            )}
            {r.product && (
              <div className="lt-card">
                <h4>
                  מוצר החודש · {monthLabel(r.product.month)}
                  {r.product.title ? ` · ${r.product.title}` : ""}
                </h4>
                <Score v={r.product.score} />
                <p className="muted">
                  שלב: {r.product.stage}
                  {r.product.checklist ? ` · רשימת GitHub: ${r.product.checklist.passed}/${r.product.checklist.total}` : ""}
                </p>
                <Markdown text={r.product.notes} />
              </div>
            )}
            {r.leadDecide && (
              <div className="lt-card">
                <h4>להוביל ולהחליט</h4>
                <Score v={r.leadDecide.score} />
                {!!r.leadDecide.items.length && (
                  <ul className="rev-ld">
                    {r.leadDecide.items.map((x, i) => (
                      <li key={i}>
                        <span className="lt-tag">{LD_KIND[x.kind] ?? x.kind}</span> <b>{x.title}</b> <span className="lt-n">{x.score}/10</span>
                        <div className="muted">{x.note}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <Markdown text={r.leadDecide.note} />
              </div>
            )}
            {!!r.actions?.length && (
              <div className="lt-card">
                <h4>לשבוע הבא</h4>
                <ol>
                  {r.actions.map((a, i) => (
                    <li key={i}>
                      {a.text}
                      {a.domain ? <span className="muted"> · {a.domain}</span> : null}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {!!r.reviewers.length && (
            <section>
              <h2 className="lt-h2">הסוקרים</h2>
              <div className="rev-reviewers">
                {r.reviewers.map((v) => (
                  <article key={v.id} className="lt-card rev-reviewer">
                    <div className="rev-persona">
                      <span className="lt-tag">{PERSONA[v.persona] ?? v.persona}</span> <b>{v.title}</b>
                    </div>
                    <div className="muted">{v.focus}</div>
                    <div className="prose">
                      <Markdown text={v.notes} />
                    </div>
                    {v.verdict && <p className="rev-verdict">{v.verdict}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {!!r.human?.length && (
            <section>
              <h2 className="lt-h2">ביקורת אנושית</h2>
              <ul className="rev-human">
                {r.human.map((h, i) => (
                  <li key={i}>
                    <span className="lt-tag">{HUMAN[h.source] ?? h.source}</span>{" "}
                    {h.url ? (
                      <a href={h.url} target="_blank" rel="noreferrer">
                        {h.title}
                      </a>
                    ) : (
                      h.title
                    )}{" "}
                    <span className="muted">{h.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className="muted rev-foot">נכתב ב-{shortDate(r.createdAt)}</p>
        </>
      )}
    </div>
  );
}

function Score({ v }: { v: number }) {
  return (
    <div className="rev-score">
      <span className="rev-score-n" dir="ltr">
        <b>{v}</b>/10
      </span>
      <span className="rev-score-bar">
        <span style={{ width: `${Math.max(0, Math.min(10, v)) * 10}%` }} />
      </span>
    </div>
  );
}

function DomainRow({ d }: { d: ReviewDomain }) {
  const [open, setOpen] = useState(false);
  const pct = (x: number) => `${(Math.max(0, Math.min(5, x)) / 5) * 100}%`;
  const label = (o: ReviewDomain["now"] = {}) =>
    (
      [
        ["ידע", o.knowledge],
        ["שטף", o.fluency],
        ["תפקיד", o.industry],
      ] as const
    )
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");
  return (
    <li className="rev-domain">
      <button className="rev-domain-row" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="rev-domain-name">{d.name}</span>
        <span className="rev-bar" aria-label={`עכשיו ${d.score} מתוך 5, היעד ${d.targetScore}`}>
          <span className="rev-bar-now" style={{ width: pct(d.score) }} />
          <span className="rev-bar-target" style={{ insetInlineStart: pct(d.targetScore) }} />
        </span>
        <span className="rev-num" dir="ltr">
          {d.score.toFixed(1)}
          {d.delta ? <span className={d.delta > 0 ? "up" : "down"}>{d.delta > 0 ? ` +${d.delta.toFixed(1)}` : ` ${d.delta.toFixed(1)}`}</span> : null}
        </span>
      </button>
      {open && (
        <div className="rev-domain-more">
          <p>
            <span className="muted">עכשיו:</span> <span>{label(d.now) || "-"}</span>
            <br />
            <span className="muted">יעד:</span> <span>{label(d.target) || "-"}</span>
          </p>
          <p>
            <span className="muted">על סמך:</span> {d.evidence}
          </p>
          {d.gap && (
            <p>
              <span className="muted">הפער:</span> {d.gap}
            </p>
          )}
          {d.next && (
            <p>
              <span className="muted">הצעד הבא:</span> {d.next}
            </p>
          )}
          <p className="muted">{CONF[d.confidence]}</p>
        </div>
      )}
    </li>
  );
}
