// The weekly paper (docs/research/round4/news/N_design.md §2): one issue per week at
// profile/news/<YYYY-Www>, written by the scheduled news session. Read here; what the
// learner read, saved and rated goes to profile/newsfb/<YYYY-Www>.
import { useEffect, useMemo, useState } from "react";
import { Markdown } from "../components/Markdown";
import { LAB } from "./config";
import { listIssues, loadFb, loadIssue, saveFb, shortDate, type IssueEntry, type ItemFb, type NewsFb, type NewsIssue, type NewsItem, type Rel } from "./data";
import type { LabTabProps } from "./LabTabs";

const KIND: Record<NewsItem["kind"], string> = { paper: "מאמר", report: "דוח", system: "מערכת", standard: "תקן", data: "נתונים", event: "אירוע" };
const CERT: Record<NewsItem["certainty"], string> = {
  official: "רשמי",
  peer: "שפוט",
  preprint: "מאמר לא שפוט",
  single: "דיווח יחיד",
  corroborated: "מאומת בשני מקורות",
  vendor: "טענת יצרן",
  disputed: "שנוי במחלוקת",
};
const REL: Record<Rel, string> = { learned: "נלמד", current: "עכשיו", next: "בקרוב", later: "בהמשך הקורס", outside: "מחוץ לתוכנית" };
const SANITY = { pass: "עובר", fail: "לא עובר", na: "לא נבדק" };
const TB = { superseded: "התיישן", refined: "דויק", confirmed: "אושר" };
const IDEA = { project: "פרויקט", product: "מוצר", article: "מאמר", interview: "ראיון" };

export function NewsTab({ lab, rt, index, done, current, onOpenModule }: LabTabProps) {
  const store = rt?.store ?? null;
  const cfg = LAB[lab];
  const [issues, setIssues] = useState<IssueEntry[] | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [issue, setIssue] = useState<NewsIssue | null>(null);
  const [fb, setFb] = useState<NewsFb>({ items: {} });
  const [section, setSection] = useState<string>("");
  const [mineOnly, setMineOnly] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!store) return;
    listIssues(store)
      .then((l) => {
        setIssues(l);
        setId((cur) => cur ?? l[0]?.id ?? null);
      })
      .catch(() => (setIssues([]), setErr("הגיליונות לא נטענו. אפשר לרענן את הדף.")));
  }, [store]);

  useEffect(() => {
    if (!store || !id) return;
    let live = true;
    setIssue(null);
    setLoading(true);
    setSection("");
    Promise.all([loadIssue(store, id), loadFb(store, id)])
      .then(([is, f]) => {
        if (!live) return;
        setLoading(false);
        setIssue(is);
        setFb(f);
        // the issue counts as opened (the tab's dot goes away)
        if (is && !f.openedAt) {
          const next = { ...f, openedAt: Date.now() };
          setFb(next);
          saveFb(store, id, next).catch(() => {});
        }
      })
      .catch(() => live && (setLoading(false), setErr("הגיליון לא נטען. אפשר לרענן את הדף.")));
    return () => {
      live = false;
    };
  }, [store, id]);

  const setItemFb = (itemId: string, patch: ItemFb) => {
    if (!id) return;
    setFb((cur) => {
      const next: NewsFb = { ...cur, items: { ...cur.items, [itemId]: { ...cur.items[itemId], ...patch } } };
      if (store) saveFb(store, id, next).catch(() => setErr("השמירה לא הצליחה. הסימון נשאר בדף הזה."));
      return next;
    });
  };

  /** the relation as it is today: what was learned since the issue was written counts as learned */
  const relNow = (moduleId: string, rel: Rel): Rel => (done.has(moduleId) ? "learned" : moduleId === current ? "current" : rel);
  const title = (moduleId: string) => index?.modules.find((m) => m.id === moduleId)?.title ?? "";

  const byId = useMemo(() => new Map((issue?.items ?? []).map((it) => [it.id, it])), [issue]);
  const visible = (it: NewsItem) => (!mineOnly || it.connects.some((c) => ["learned", "current"].includes(relNow(c.moduleId, c.rel)))) && it.id !== issue?.lead;

  if (!store)
    return (
      <div className="lt-wrap">
        <p className="lt-empty">העיתון נשמר בחשבון שלך ב-claude.ai, ויופיע כאן כשהדף פתוח שם עם הרשאת כתיבה.</p>
      </div>
    );
  if (issues === null) return <div className="lt-wrap"><p className="lt-empty">טוען…</p></div>;
  if (!issues.length)
    return (
      <div className="lt-wrap">
        <Masthead name={cfg.name} sub={cfg.newsSub} />
        <p className="lt-empty">הגיליון הראשון יגיע {cfg.newsArrives}.</p>
        {err && <p className="lt-err">{err}</p>}
      </div>
    );

  const lead = issue ? byId.get(issue.lead) : undefined;
  const sections = issue?.sections.filter((s) => s.items.some((x) => byId.has(x))) ?? [];
  const readCount = issue ? issue.items.filter((it) => fb.items[it.id]?.read).length : 0;
  const itemProps = { fb, setItemFb, relNow, title, onOpenModule };

  return (
    <div className="lt-wrap news">
      <Masthead name={cfg.name} sub={cfg.newsSub} />
      <div className="news-meta">
        {issue ? (
          <>
            <span>גיליון {issue.number}</span>
            <span>{shortDate(issue.window.from)}–{shortDate(issue.window.to)}</span>
            <span>נבנה ב-{shortDate(issue.publishedAt)}</span>
            <span>
              נקראו {readCount} מתוך {issue.items.length}
            </span>
          </>
        ) : (
          loading && <span>טוען את הגיליון…</span>
        )}
        <span className="lt-spacer" />
        {issues.length > 1 && (
          <label className="lt-picker">
            <span>גיליון</span>
            <select value={id ?? ""} onChange={(e) => setId(e.target.value)}>
              {issues.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.number ? `${e.number} · ` : ""}
                  {e.window ? `${shortDate(e.window.from)}–${shortDate(e.window.to)}` : e.id}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {err && <p className="lt-err">{err}</p>}
      {issue?.example && <p className="lt-example">גיליון לדוגמה: מבנה העיתון, לא חדשות אמיתיות.</p>}
      {!loading && !issue && !err && <p className="lt-empty">הגיליון הזה עוד לא נשמר במלואו. אפשר לבחור גיליון אחר.</p>}

      {issue && (
        <>
          {lead && (
            <article className="news-lead">
              <ItemBody it={lead} {...itemProps} lead />
            </article>
          )}
          <div className="news-filters">
            <button className="lt-chip" aria-pressed={!section} onClick={() => setSection("")}>
              הכל
            </button>
            {sections.map((s) => (
              <button key={s.id} className="lt-chip" aria-pressed={section === s.id} onClick={() => setSection(section === s.id ? "" : s.id)}>
                {s.title}
                <span className="lt-n">{s.items.filter((x) => byId.has(x)).length}</span>
              </button>
            ))}
            <label className="lt-check">
              <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
              רק מה שקשור למה שלמדתי
            </label>
          </div>
          <div className="news-layout">
            <div className="news-flow">
              {sections
                .filter((s) => !section || s.id === section)
                .map((s) => {
                  const items = s.items.map((x) => byId.get(x)!).filter((it) => it && visible(it));
                  if (!items.length) return null;
                  return (
                    <section key={s.id} className="news-section">
                      <h3>
                        {s.title}
                        <span className="lt-n">{items.length}</span>
                      </h3>
                      {items.map((it) => (
                        <article key={it.id} className="news-item">
                          <ItemBody it={it} {...itemProps} />
                        </article>
                      ))}
                    </section>
                  );
                })}
            </div>
            <aside className="news-side">
              {!!issue.picks10?.length && (
                <div className="lt-card">
                  <h4>לקרוא ב-10 דקות</h4>
                  <ul>
                    {issue.picks10.map((x) => byId.get(x)).filter(Boolean).map((it) => (
                      <li key={it!.id}>
                        <a href={it!.sources[0]?.url} target="_blank" rel="noreferrer">
                          {it!.headline}
                        </a>
                        {it!.read10?.minutes ? <span className="lt-n">{it!.read10.minutes} דק'</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {issue.items.some((it) => fb.items[it.id]?.saved) && (
                <div className="lt-card">
                  <h4>שמרת</h4>
                  <ul>
                    {issue.items.filter((it) => fb.items[it.id]?.saved).map((it) => (
                      <li key={it.id}>{it.headline}</li>
                    ))}
                  </ul>
                </div>
              )}
              {issue.stats && (
                <div className="lt-card news-stats">
                  <h4>איך נבחרו</h4>
                  <p>
                    {issue.stats.candidates} מועמדים, {issue.stats.fetched} נקראו במלואם, {issue.stats.verified} עברו אימות מול המקור שנקרא השבוע.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function Masthead({ name, sub }: { name: string; sub: string }) {
  return (
    <header className="news-mast">
      <div className="news-kicker">{name}</div>
      <h1>השבועון</h1>
      <div className="news-sub">{sub}</div>
    </header>
  );
}

function ItemBody({
  it,
  lead,
  fb,
  setItemFb,
  relNow,
  title,
  onOpenModule,
}: {
  it: NewsItem;
  lead?: boolean;
  fb: NewsFb;
  setItemFb: (id: string, p: ItemFb) => void;
  relNow: (m: string, r: Rel) => Rel;
  title: (m: string) => string;
  onOpenModule: (m: string) => void;
}) {
  const [open, setOpen] = useState(!!lead);
  const f = fb.items[it.id] ?? {};
  const src = it.sources[0];
  return (
    <>
      <div className="news-tags">
        <span className="lt-tag">{KIND[it.kind] ?? it.kind}</span>
        <span className={`lt-tag c-${it.certainty}`}>{CERT[it.certainty] ?? it.certainty}</span>
        {src && <span className="lt-tag">רמת מקור {src.tier}</span>}
        {it.sanity && <span className={`lt-tag s-${it.sanity.result}`} title={`${it.sanity.check}: ${it.sanity.note}`}>סדר גודל: {SANITY[it.sanity.result]}</span>}
        {it.oldButNew && <span className="lt-tag">ישן אך חדש לך</span>}
        {src?.publishedAt && <span className="lt-date" dir="ltr">{shortDate(src.publishedAt)}</span>}
        {f.read ? <span className="lt-date">✓ נקרא</span> : null}
      </div>
      {lead ? <h2>{it.headline}</h2> : <h4>{it.headline}</h4>}
      <p className="news-dek">{it.dek}</p>
      {open ? (
        <div className="news-body prose">
          <Markdown text={it.body} />
        </div>
      ) : (
        <button
          className="link"
          onClick={() => {
            setOpen(true);
            if (!f.read) setItemFb(it.id, { read: Date.now() });
          }}
        >
          קרא עוד
        </button>
      )}
      {it.why && (
        <div className="news-why">
          <div className="news-why-h">למה זה חשוב לך</div>
          <Markdown text={it.why} />
        </div>
      )}
      {!!it.connects.length && (
        <div className="news-conn">
          <div className="news-conn-h">מתחבר למה שלמדת</div>
          <div className="news-chips">
            {it.connects.map((c, i) => {
              const r = relNow(c.moduleId, c.rel);
              return (
                <button key={i} className={`news-chip r-${r}`} onClick={() => onOpenModule(c.moduleId)} title={c.why}>
                  <b dir="ltr">{c.moduleId}</b> {title(c.moduleId) || c.concept}
                  <span className="news-rel">{REL[r]}</span>
                </button>
              );
            })}
          </div>
          {open && (
            <ul className="news-conn-why">
              {it.connects.map((c, i) => (
                <li key={i}>
                  <b dir="ltr">{c.moduleId}</b> · {c.concept}: {c.why}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {open && it.textbookUpdate && (
        <div className="lt-box tb">
          <div className="lt-box-h">
            עדכון לספר · {TB[it.textbookUpdate.status]} · {it.textbookUpdate.book}, עמ' {it.textbookUpdate.page} ({it.textbookUpdate.edition})
          </div>
          <p>
            <span className="muted">בספר:</span> {it.textbookUpdate.old}
          </p>
          <p>
            <span className="muted">היום:</span> {it.textbookUpdate.now}
          </p>
        </div>
      )}
      {open && it.idea && (
        <div className="lt-box idea">
          <div className="lt-box-h">
            רעיון ל{IDEA[it.idea.kind]} · כ-{it.idea.hours} שעות
          </div>
          <p>
            <b>{it.idea.title}.</b> {it.idea.pitch}
          </p>
          {!!it.idea.uses?.length && <p className="muted" dir="auto">משתמש ב: {it.idea.uses.join(", ")}</p>}
        </div>
      )}
      {open && src?.quote && (
        <blockquote className="news-quote" dir="auto">
          “{src.quote}”
        </blockquote>
      )}
      <div className="news-foot">
        {it.sources.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noreferrer" className="news-src" dir="auto">
            {s.publisher || s.title}
          </a>
        ))}
        {it.crossRef && <span className="lt-date">גם בשבועון של {it.crossRef.app === "core" ? "לנצ'סטר" : "גילואה"}</span>}
        <span className="lt-spacer" />
        <button className="lt-act" aria-pressed={!!f.read} onClick={() => setItemFb(it.id, { read: f.read ? 0 : Date.now() })}>
          {f.read ? "נקרא" : "סמן כנקרא"}
        </button>
        <button className="lt-act" aria-pressed={!!f.saved} onClick={() => setItemFb(it.id, { saved: !f.saved })}>
          {f.saved ? "נשמר" : "שמור"}
        </button>
        <button className="lt-act" aria-pressed={f.useful === 1} onClick={() => setItemFb(it.id, { useful: f.useful === 1 ? 0 : 1 })}>
          מועיל
        </button>
        <button className="lt-act" aria-pressed={f.useful === -1} onClick={() => setItemFb(it.id, { useful: f.useful === -1 ? 0 : -1 })}>
          פחות רלוונטי
        </button>
      </div>
    </>
  );
}
