// The weekly paper (docs/research/round4/news/N_design.md §2, docs/NEWS_SCHEMA.md): one issue per week at
// profile/news/<YYYY-Www>, written by the scheduled news session. Read here as a printed edition: a masthead, a
// front page (the lead, features and the number of the week), sections in three columns, and the corners.
// What the learner read, saved and rated goes to profile/newsfb/<YYYY-Www>. Same file in both apps.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Markdown } from "../components/Markdown";
import { LAB } from "./config";
import { dateRange, listIssues, loadFb, loadFull, loadIssue, saveFb, shortDate, type FullMode, type IssueEntry, type ItemFb, type NewsChart, type NewsFb, type NewsFull, type NewsImage, type NewsIssue, type NewsItem, type NewsRole, type Region, type Rel } from "./data";
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
const REGION: Record<Region, string> = {
  US: "ארה\"ב",
  EU: "אירופה",
  UK: "בריטניה",
  IL: "ישראל",
  TR: "טורקיה",
  CN: "סין",
  TW: "טייוואן",
  JP: "יפן",
  KR: "קוריאה",
  IN: "הודו",
  RU: "רוסיה",
  UA: "אוקראינה",
  GULF: "המפרץ",
  IR: "איראן",
  AF: "אפריקה",
  INTL: "בין-לאומי",
};
const REL: Record<Rel, string> = { learned: "נלמד", current: "עכשיו", next: "בקרוב", later: "בהמשך הקורס", outside: "מחוץ לתוכנית" };
const SANITY = { pass: "עובר", fail: "לא עובר", na: "לא נבדק" };
const TB = { superseded: "התיישן", refined: "דויק", confirmed: "אושר" };
const IDEA = { project: "פרויקט", product: "מוצר", article: "מאמר", interview: "ראיון" };
const NETWORK = { x: "X", bluesky: "Bluesky", mastodon: "Mastodon" };
/** roles drawn in a corner of the edition, not in the sections */
const CORNER: NewsRole[] = ["number", "world", "geo", "econ", "post", "lab", "globe"];
/** the world desk, country by country, in this order; a region without stories is left out */
const GLOBE_ORDER: Region[] = ["US", "CN", "EU", "UK", "RU", "IN", "JP", "KR", "TW", "IL", "UA", "TR", "GULF", "IR", "AF", "INTL"];
/** the index's filter value for the world desk (not a section id of the issue) */
const GLOBE = "__globe";
const FULL: Record<FullMode, string> = {
  translation: "תרגום מלא של המקור",
  walkthrough: "המקור רעיון אחר רעיון, בסדר שבו נכתב",
  report: "כתבה מלאה על פי המקור, בסדר הדברים שבו",
};

const heDate = (t: number) => {
  try {
    return new Intl.DateTimeFormat("he-IL-u-ca-hebrew", { day: "numeric", month: "long", year: "numeric" }).format(t);
  } catch {
    return "";
  }
};
/** The element that scrolls the tab (the page itself in a plain window, a container inside the app). */
function scroller(el: HTMLElement | null): HTMLElement {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
  }
  return (document.scrollingElement as HTMLElement) ?? document.documentElement;
}

const grDate = (t: number) => new Intl.DateTimeFormat("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(t);

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
  /** the story open on a page of its own, like turning to the inside page of a paper */
  const [pageId, setPageId] = useState<string | null>(null);
  /** where the front page was scrolled when a story was opened */
  const backY = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  // a story opens at its top; closing it returns to where the front page was
  useLayoutEffect(() => {
    const sc = scroller(wrap.current);
    if (pageId) wrap.current?.scrollIntoView({ block: "start" });
    else sc.scrollTop = backY.current;
  }, [pageId]);

  // the browser's back button (and the phone's back gesture) closes the story, as on a news site
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const to = (e.state as { npPage?: string } | null)?.npPage ?? null;
      setPageId(to);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

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
    setPageId(null);
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

  const openPage = (itemId: string) => {
    if (!pageId) backY.current = scroller(wrap.current).scrollTop;
    try {
      // from the front page a new entry, between stories the same one: one "back" always returns to the front page
      if (pageId) history.replaceState({ npPage: itemId }, "");
      else history.pushState({ npPage: itemId }, "");
    } catch {
      /* a sandboxed frame without history: the page's own back button still works */
    }
    setPageId(itemId);
    if (!fb.items[itemId]?.read) setItemFb(itemId, { read: Date.now() });
  };
  const closePage = () => {
    if ((history.state as { npPage?: string } | null)?.npPage) {
      history.back();
      return;
    }
    setPageId(null);
  };

  /** the relation as it is today: what was learned since the issue was written counts as learned */
  const relNow = (moduleId: string, rel: Rel): Rel => (done.has(moduleId) ? "learned" : moduleId === current ? "current" : rel);
  const title = (moduleId: string) => index?.modules.find((m) => m.id === moduleId)?.title ?? "";

  const ed = useMemo(() => edition(issue), [issue]);

  if (!store)
    return (
      <div className="lt-wrap news">
        <p className="lt-empty">העיתון נשמר בחשבון שלך ב-claude.ai, ויופיע כאן כשהדף פתוח שם עם הרשאת כתיבה.</p>
      </div>
    );
  if (issues === null)
    return (
      <div className="lt-wrap news">
        <p className="lt-empty">טוען…</p>
      </div>
    );
  if (!issues.length)
    return (
      <div className="lt-wrap news">
        <Masthead name={cfg.name} sub={cfg.newsSub} />
        <p className="lt-empty">הגיליון הראשון יגיע {cfg.newsArrives}.</p>
        {err && <p className="lt-err">{err}</p>}
      </div>
    );

  const mine = (it: NewsItem) => !mineOnly || it.connects.some((c) => ["learned", "current"].includes(relNow(c.moduleId, c.rel)));
  const readCount = issue ? issue.items.filter((it) => fb.items[it.id]?.read).length : 0;
  const story = { fb, setItemFb, relNow, title, onOpenModule, kicker: ed?.kicker ?? (() => ""), onOpen: openPage };
  const pageItem = pageId && issue ? issue.items.find((it) => it.id === pageId) : undefined;
  if (pageItem && issue)
    return (
      <div className="lt-wrap news np-pagewrap" ref={wrap}>
        <Masthead name={cfg.name} sub={cfg.newsSub} issue={issue} />
        <ArticlePage issue={issue} it={pageItem} store={store} onBack={closePage} story={story} />
      </div>
    );
  const corner = (role: NewsRole) => (ed?.corners.get(role) ?? []).filter(mine);
  const cornerName = lab === "core" ? "הפינה הגאופוליטית" : "כלכלת הטכנולוגיה";
  const analysis = corner(lab === "core" ? "geo" : "econ");
  const worlds = worldPairs(corner("world"));
  const labs = corner("lab");
  const posts = corner("post");
  const numbers = corner("number");
  const features = (ed?.features ?? []).filter(mine);
  const globe = GLOBE_ORDER.map((r) => [r, corner("globe").filter((it) => (it.region ?? "INTL") === r)] as const).filter(([, l]) => l.length);

  return (
    <div className="lt-wrap news" ref={wrap}>
      <Masthead name={cfg.name} sub={cfg.newsSub} issue={issue} />

      <nav className="np-index" aria-label="בגיליון זה">
        {issue && ed ? (
          <>
            <span className="np-index-h">בגיליון זה</span>
            <button className="np-ix" aria-pressed={!section} onClick={() => setSection("")}>
              הכל
            </button>
            {ed.sections.map((s) => (
              <button key={s.id} className="np-ix" aria-pressed={section === s.id} onClick={() => setSection(section === s.id ? "" : s.id)}>
                {s.title}
                <span className="np-n">{s.items.length}</span>
              </button>
            ))}
            {globe.length > 0 && (
              <button className="np-ix" aria-pressed={section === GLOBE} onClick={() => setSection(section === GLOBE ? "" : GLOBE)}>
                מבט עולמי
                <span className="np-n">{globe.reduce((n, [, l]) => n + l.length, 0)}</span>
              </button>
            )}
          </>
        ) : (
          loading && <span>טוען את הגיליון…</span>
        )}
      </nav>
      <div className="np-controls">
        {issue && (
          <span>
            {dateRange(issue.window.from, issue.window.to)} · נקראו {readCount} מתוך {issue.items.length}
          </span>
        )}
        <label className="lt-check">
          <input type="checkbox" checked={mineOnly} onChange={(e) => setMineOnly(e.target.checked)} />
          רק מה שקשור למה שלמדתי
        </label>
        <span className="lt-spacer" />
        {issues.length > 1 && (
          <label className="lt-picker">
            <span>גיליון</span>
            <select value={id ?? ""} onChange={(e) => setId(e.target.value)}>
              {issues.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.number ? `${e.number} · ` : ""}
                  {e.window ? dateRange(e.window.from, e.window.to) : e.id}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {err && <p className="lt-err">{err}</p>}
      {issue?.example && <p className="np-example">גיליון לדוגמה: מבנה העיתון, לא חדשות אמיתיות.</p>}
      {!loading && !issue && !err && <p className="lt-empty">הגיליון הזה עוד לא נשמר במלואו. אפשר לבחור גיליון אחר.</p>}

      {issue && ed && (
        <>
          {!section && (
            <div className="np-front">
              {ed.lead && (
                <article className="np-lead">
                  <Story it={ed.lead} variant="lead" {...story} />
                </article>
              )}
              {(features.length > 0 || numbers.length > 0) && (
                <aside className="np-side">
                  {features.map((it) => (
                    <article key={it.id} className="np-feature">
                      <Story it={it} variant="feature" {...story} />
                    </article>
                  ))}
                  {numbers.map((it) => (
                    <NumberBox key={it.id} it={it} />
                  ))}
                </aside>
              )}
            </div>
          )}

          {groupSections(ed.sections.filter((s) => !section || s.id === section).map((s) => ({ ...s, items: s.items.filter(mine) }))).map((g) =>
            g.length === 1 && g[0].items.length > 2 ? (
              <section key={g[0].id} className="np-sec">
                <SecHead title={g[0].title} n={g[0].items.length} />
                <div className="np-cols">
                  {g[0].items.map((it) => (
                    <article key={it.id} className="np-brief">
                      <Story it={it} variant="brief" {...story} />
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <div key={g[0].id} className="np-secrow">
                {g.map((s) => (
                  <section key={s.id} className="np-sec">
                    <SecHead title={s.title} n={s.items.length} />
                    {s.items.map((it) => (
                      <article key={it.id} className="np-brief">
                        <Story it={it} variant="brief" {...story} />
                      </article>
                    ))}
                  </section>
                ))}
              </div>
            ),
          )}

          {(!section || section === GLOBE) && globe.length > 0 && (
            <section className="np-sec np-globe" id="np-globe">
              <SecHead title="מבט עולמי" note="הסיפורים המרכזיים של השבוע, מדינה אחר מדינה" />
              <div className="np-globe-grid">
                {globe.map(([r, list]) => (
                  <div key={r} className="np-country">
                    <h4>{REGION[r] ?? r}</h4>
                    {list.map((it) => (
                      <article key={it.id} className="np-gitem">
                        <div className="np-kick">{story.kicker(it)}</div>
                        <h5>
                          <button className="np-hl-link" onClick={() => openPage(it.id)}>
                            {it.headline}
                          </button>
                        </h5>
                        {it.dek && <p className="np-dek">{it.dek}</p>}
                        {fb.items[it.id]?.read ? <div className="np-meta">נקרא</div> : null}
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!section && (
            <>
              {(analysis.length > 0 || labs.length > 0 || posts.length > 0) && (
                <div className="np-pair">
                  {analysis.length > 0 && (
                    <section className="np-sec">
                      <SecHead title={cornerName} note={lab === "core" ? "ניתוח של מקורות פתוחים" : undefined} />
                      <div className={analysis.length > 1 ? "np-cols np-cols-2" : undefined}>
                        {analysis.map((it) => (
                          <article key={it.id} className="np-brief">
                            <Story it={it} variant="corner" {...story} />
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                  {(labs.length > 0 || posts.length > 0) && (
                    <div className="np-stack">
                      {labs.length > 0 && (
                        <section className="np-sec">
                          <SecHead title="מהמעבדות" />
                          {labs.map((it) => (
                            <article key={it.id} className="np-brief">
                              <Story it={it} variant="brief" {...story} />
                            </article>
                          ))}
                        </section>
                      )}
                      {posts.length > 0 && (
                        <section className="np-sec">
                          <SecHead title="ברשתות" />
                          {posts.map((it) => (
                            <Post key={it.id} it={it} />
                          ))}
                        </section>
                      )}
                    </div>
                  )}
                </div>
              )}
              {worlds.length > 0 && (
                <section className="np-sec">
                  <SecHead title="מבט מהעולם" />
                  {worlds.map(([a, b]) => (
                    <div key={a.id} className="np-world">
                      <div className="np-world-h">{a.world?.topic}</div>
                      <div className="np-cols np-cols-2">
                        {[a, b].filter((x): x is NewsItem => !!x).map((it) => (
                          <article key={it.id} className="np-brief">
                            <div className="np-place">{it.region ? REGION[it.region] ?? it.region : ""}</div>
                            <Story it={it} variant="brief" {...story} />
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}
              <Colophon issue={issue} byId={ed.byId} fb={fb} />
            </>
          )}
        </>
      )}
    </div>
  );
}

/** The issue laid out as an edition: which story goes where. Old issues (no roles) get the first two stories as features. */
function edition(issue: NewsIssue | null) {
  if (!issue) return null;
  const byId = new Map(issue.items.map((it) => [it.id, it]));
  const lead = byId.get(issue.lead);
  const hasRoles = issue.items.some((it) => it.role);
  const corners = new Map<NewsRole, NewsItem[]>();
  for (const it of issue.items) if (it.role && CORNER.includes(it.role) && it.id !== issue.lead) corners.set(it.role, [...(corners.get(it.role) ?? []), it]);
  const inSections = issue.sections.flatMap((s) => s.items.map((x) => byId.get(x)).filter((it): it is NewsItem => !!it && it.id !== issue.lead && !(it.role && CORNER.includes(it.role))));
  const features = hasRoles ? issue.items.filter((it) => it.role === "feature" && it.id !== issue.lead) : inSections.slice(0, 2);
  const onFront = new Set([issue.lead, ...features.map((f) => f.id)]);
  const sections = issue.sections
    .map((s) => ({ id: s.id, title: s.title, items: s.items.map((x) => byId.get(x)).filter((it): it is NewsItem => !!it && !onFront.has(it.id) && !(it.role && CORNER.includes(it.role))) }))
    .filter((s) => s.items.length);
  const secOf = new Map(issue.sections.flatMap((s) => s.items.map((x) => [x, s.title] as const)));
  const kicker = (it: NewsItem) => secOf.get(it.id) ?? issue.sections.find((s) => s.id === it.domain)?.title ?? "";
  return { byId, lead, features, sections, corners, kicker };
}

/** Sections of three stories or more run across three columns; shorter ones share a row, up to three side by side. */
function groupSections<T extends { id: string; items: unknown[] }>(sections: T[]): T[][] {
  const out: T[][] = [];
  let row: T[] = [];
  for (const s of sections) {
    if (!s.items.length) continue;
    if (s.items.length > 2) {
      if (row.length) out.push(row), (row = []);
      out.push([s]);
    } else {
      row.push(s);
      if (row.length === 3) out.push(row), (row = []);
    }
  }
  if (row.length) out.push(row);
  return out;
}

/** "מבט מהעולם": each pair once, in the order of the first item. */
function worldPairs(items: NewsItem[]): [NewsItem, NewsItem | undefined][] {
  const seen = new Set<string>();
  const out: [NewsItem, NewsItem | undefined][] = [];
  for (const it of items) {
    if (seen.has(it.id)) continue;
    const other = items.find((x) => x.id === it.world?.pair && !seen.has(x.id));
    seen.add(it.id);
    if (other) seen.add(other.id);
    out.push([it, other]);
  }
  return out;
}

function Masthead({ name, sub, issue }: { name: string; sub: string; issue?: NewsIssue | null }) {
  const t = issue?.publishedAt;
  return (
    <header className="np-mast">
      <div className="np-ear">
        <span>{t ? heDate(t) : name}</span>
        <span>{issue ? [issue.edition, `גיליון ${issue.number}`].filter(Boolean).join(" · ") : ""}</span>
        <span>{t ? grDate(t) : ""}</span>
      </div>
      <h1>השבועון</h1>
      <div className="np-tag">
        {name} · {sub}
      </div>
    </header>
  );
}

function SecHead({ title, n, note }: { title: string; n?: number; note?: string }) {
  return (
    <div className="np-sec-h">
      <h3>{title}</h3>
      {note && <span>{note}</span>}
      {n !== undefined && <span className="np-n">{n}</span>}
    </div>
  );
}

type StoryProps = {
  it: NewsItem;
  variant: "lead" | "feature" | "brief" | "corner" | "page";
  fb: NewsFb;
  setItemFb: (id: string, p: ItemFb) => void;
  relNow: (m: string, r: Rel) => Rel;
  title: (m: string) => string;
  onOpenModule: (m: string) => void;
  kicker: (it: NewsItem) => string;
  /** opens the story on a page of its own */
  onOpen?: (id: string) => void;
  /** the page variant: the story's full text, once loaded */
  fullText?: NewsFull | null;
};

function Story({ it, variant, fb, setItemFb, relNow, title, onOpenModule, kicker, onOpen, fullText }: StoryProps) {
  const lead = variant === "lead";
  const page = variant === "page";
  const wide = lead || page;
  const open = lead || page || variant === "corner";
  const f = fb.items[it.id] ?? {};
  const src = it.sources[0];
  const img = it.images?.[0];
  const state = it.sources.some((s) => s.stateMedia);
  const meta = [
    KIND[it.kind] ?? it.kind,
    CERT[it.certainty] ?? it.certainty,
    it.region ? REGION[it.region] ?? it.region : "",
    src ? `מקור ${src.tier}` : "",
    it.oldButNew ? "ישן אך חדש לך" : "",
  ].filter(Boolean);
  const H = wide ? "h2" : "h3";
  const note = <EditorNote it={it} open={open} relNow={relNow} title={title} onOpenModule={onOpenModule} />;
  return (
    <>
      <div className="np-kick">{kicker(it)}</div>
      <H className="np-hl">
        {onOpen && !wide ? (
          <button className="np-hl-link" onClick={() => onOpen(it.id)}>
            {it.headline}
          </button>
        ) : (
          it.headline
        )}
      </H>
      {it.dek && <p className="np-dek">{it.dek}</p>}
      {img && (wide || variant === "feature" || open) && <Figure img={img} small={!wide && variant !== "corner"} />}
      <div className="np-meta">
        {meta.join(" · ")}
        {state && <span className="np-flag">תקשורת ממשלתית</span>}
        {it.sanity && (
          <span title={`${it.sanity.check}: ${it.sanity.note}`}>
            {" · "}סדר גודל: {SANITY[it.sanity.result]}
          </span>
        )}
        {src?.publishedAt && (
          <>
            {" · "}
            <span dir="ltr">{shortDate(src.publishedAt)}</span>
          </>
        )}
        {f.read ? <span> · נקרא</span> : null}
      </div>
      {page && src && (
        <div className="np-srcline">
          המקור:{" "}
          <a href={src.url} target="_blank" rel="noreferrer" dir="auto">
            {src.publisher || src.title}
          </a>
          {src.license ? ` · ${src.license}` : ""}
        </div>
      )}
      <div className={wide ? "np-lead-grid" : undefined}>
        <div className="np-copy">
          {open ? (
            <>
              {page && fullText && <div className="np-fullmode">{FULL[fullText.mode]}</div>}
              <div className={`np-body prose ${wide ? "np-drop" : ""}`}>
                <Markdown text={(page && fullText?.body) || it.body} />
              </div>
              {!page && it.full && onOpen && (
                <button className="np-more" onClick={() => onOpen(it.id)}>
                  לכתבה המלאה
                </button>
              )}
            </>
          ) : (
            <button className="np-more" onClick={() => onOpen?.(it.id)}>
              המשך קריאה
            </button>
          )}
          {it.chart && open && <Chart c={it.chart} />}
          {open && it.textbookUpdate && (
            <Box head={`עדכון לספר · ${TB[it.textbookUpdate.status]} · ${it.textbookUpdate.book}, עמ' ${it.textbookUpdate.page} (${it.textbookUpdate.edition})`}>
              <p>
                <span className="np-mute">בספר:</span> {it.textbookUpdate.old}
              </p>
              <p>
                <span className="np-mute">היום:</span> {it.textbookUpdate.now}
              </p>
            </Box>
          )}
          {open && it.idea && (
            <Box head={`רעיון ל${IDEA[it.idea.kind]} · כ-${it.idea.hours} שעות`}>
              <p>
                <b>{it.idea.title}.</b> {it.idea.pitch}
              </p>
              {!!it.idea.uses?.length && (
                <p className="np-mute" dir="auto">
                  משתמש ב: {it.idea.uses.join(", ")}
                </p>
              )}
            </Box>
          )}
          {open && src?.quote && (
            <blockquote className="np-quote" dir="auto">
              “{src.quote}”
            </blockquote>
          )}
          {!wide && note}
        </div>
        {wide && note}
      </div>
      <div className="np-foot">
        <span className="np-srcs">
          {it.sources.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noreferrer" dir="auto">
              {s.publisher || s.title}
              {s.stateMedia ? " (ממשלתי)" : ""}
            </a>
          ))}
        </span>
        {it.crossRef && <span className="np-mute">גם בשבועון של {it.crossRef.app === "core" ? "לנצ'סטר" : "גילואה"}</span>}
        <span className="lt-spacer" />
        <span className="np-acts">
          <button aria-pressed={!!f.read} onClick={() => setItemFb(it.id, { read: f.read ? 0 : Date.now() })}>
            {f.read ? "נקרא" : "סמן כנקרא"}
          </button>
          <button aria-pressed={!!f.saved} onClick={() => setItemFb(it.id, { saved: !f.saved })}>
            {f.saved ? "נשמר" : "שמור"}
          </button>
          <button aria-pressed={f.useful === 1} onClick={() => setItemFb(it.id, { useful: f.useful === 1 ? 0 : 1 })}>
            מועיל
          </button>
          <button aria-pressed={f.useful === -1} onClick={() => setItemFb(it.id, { useful: f.useful === -1 ? 0 : -1 })}>
            פחות רלוונטי
          </button>
        </span>
      </div>
    </>
  );
}

/** The connection to the study modules, as an editor's note in the margin (in place of the old "why" box). */
function EditorNote({ it, open, relNow, title, onOpenModule }: { it: NewsItem; open: boolean; relNow: (m: string, r: Rel) => Rel; title: (m: string) => string; onOpenModule: (m: string) => void }) {
  if (!it.why && !it.connects.length) return null;
  return (
    <aside className="np-note">
      <div className="np-note-h">לחומר הלימוד</div>
      {it.why && <Markdown text={it.why} />}
      {!!it.connects.length && (
        <ul className="np-mods">
          {it.connects.map((c, i) => {
            const r = relNow(c.moduleId, c.rel);
            return (
              <li key={i}>
                <button className={`np-mod r-${r}`} onClick={() => onOpenModule(c.moduleId)} title={c.why}>
                  <b dir="ltr">{c.moduleId}</b> <Markdown text={title(c.moduleId) || c.concept} inline />
                </button>
                <span className="np-rel"> · {REL[r]}</span>
                {open && c.why && (
                  <div className="np-mod-why">
                    <Markdown text={c.why} inline />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

function Box({ head, children }: { head: string; children: ReactNode }) {
  return (
    <div className="np-box">
      <div className="np-box-h">{head}</div>
      {children}
    </div>
  );
}

function Figure({ img, small }: { img: NewsImage; small?: boolean }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <figure className={`np-fig ${small ? "is-small" : ""}`}>
      <img src={img.url} alt={img.alt ?? img.caption} loading="lazy" onError={() => setBroken(true)} />
      <figcaption>
        {img.caption}{" "}
        <span className="np-credit">
          {img.sourcePage ? (
            <a href={img.sourcePage} target="_blank" rel="noreferrer" dir="auto">
              {img.credit}
            </a>
          ) : (
            img.credit
          )}
          {img.license ? ` · ${img.license}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

function NumberBox({ it }: { it: NewsItem }) {
  const n = it.number;
  const src = it.sources[0];
  return (
    <div className="np-number">
      <div className="np-note-h">מספר השבוע</div>
      <div className="np-num" dir="ltr">
        {n?.value ?? "—"}
        {n?.unit && <span className="np-unit"> {n.unit}</span>}
      </div>
      <div className="np-num-l">{it.headline}</div>
      {it.body && (
        <div className="np-num-b">
          <Markdown text={it.body} />
        </div>
      )}
      {n?.calc && (
        <div className="np-calc">
          <Markdown text={n.calc} />
        </div>
      )}
      {src && (
        <a className="np-srcline" href={src.url} target="_blank" rel="noreferrer" dir="auto">
          {src.publisher || src.title}
        </a>
      )}
    </div>
  );
}

function Post({ it }: { it: NewsItem }) {
  const p = it.post;
  if (!p) return null;
  return (
    <figure className="np-post">
      <blockquote dir="auto">{p.text}</blockquote>
      <figcaption>
        <b>{p.author}</b>{" "}
        <span dir="ltr" className="np-mute">
          {p.handle}
        </span>
        {" · "}
        <a href={p.url} target="_blank" rel="noreferrer">
          {NETWORK[p.network] ?? p.network}
          {p.postedAt ? `, ${shortDate(p.postedAt)}` : ""}
        </a>
      </figcaption>
      {it.dek && <p className="np-mute np-post-ctx">{it.dek}</p>}
    </figure>
  );
}

/** A bar or line chart from numbers in a fetched source: ink on paper, at most three series, a native tooltip per mark. */
function Chart({ c }: { c: NewsChart }) {
  const W = 560,
    H = 240,
    m = { t: 16, r: 14, b: 34, l: 44 };
  const series = c.series.slice(0, 3);
  const vals = series.flatMap((s) => s.values.filter((v): v is number => typeof v === "number" && isFinite(v)));
  if (!vals.length) return null;
  const lo = Math.min(0, ...vals),
    hi = Math.max(...vals);
  const step = niceStep((hi - lo) / 4 || 1);
  const top = Math.ceil(hi / step) * step,
    bot = Math.floor(lo / step) * step;
  const y = (v: number) => m.t + ((top - v) / (top - bot || 1)) * (H - m.t - m.b);
  const ticks: number[] = [];
  for (let v = bot; v <= top + step / 2; v += step) ticks.push(+v.toFixed(6));
  const pw = W - m.l - m.r;
  const n = c.x.length;
  const fmt = (v: number) => (Math.abs(v) >= 1000 ? v.toLocaleString("en-US") : String(+v.toFixed(2)));
  const shade = ["var(--np-ink)", "var(--np-mute)", "var(--np-rule-strong)"];
  return (
    <figure className="np-chart">
      <figcaption className="np-chart-t">
        {c.title}
        {c.unit && <span className="np-mute"> ({c.unit})</span>}
      </figcaption>
      {series.length > 1 && (
        <div className="np-legend">
          {series.map((s, i) => (
            <span key={i}>
              <i style={{ background: shade[i], ...(i === 2 ? { backgroundImage: "repeating-linear-gradient(90deg, var(--np-paper) 0 3px, transparent 3px 6px)" } : {}) }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={c.title} direction="ltr">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} className={t === 0 ? "np-axis" : "np-grid"} />
            <text x={m.l - 6} y={y(t) + 4} textAnchor="end" className="np-tick">
              {fmt(t)}
            </text>
          </g>
        ))}
        {c.kind === "bar"
          ? (() => {
              const band = pw / n;
              const bw = Math.min(56, (band * 0.7) / series.length);
              return c.x.map((x, i) =>
                series.map((s, k) => {
                  const v = s.values[i];
                  if (typeof v !== "number") return null;
                  const x0 = m.l + band * i + (band - bw * series.length) / 2 + k * bw;
                  const y0 = y(Math.max(0, v)),
                    h = Math.abs(y(v) - y(0));
                  return (
                    <g key={`${i}-${k}`}>
                      <rect x={x0 + 1} y={y0} width={bw - 2} height={Math.max(1, h)} fill={shade[k]} className="np-mark">
                        <title>{`${x} · ${s.name}: ${fmt(v)} ${c.unit}`}</title>
                      </rect>
                      {series.length === 1 && (
                        <text x={x0 + bw / 2} y={y0 - 5} textAnchor="middle" className="np-val">
                          {fmt(v)}
                        </text>
                      )}
                    </g>
                  );
                }),
              );
            })()
          : series.map((s, k) => {
              const px = (i: number) => m.l + (n === 1 ? pw / 2 : (pw * i) / (n - 1));
              const pts = s.values.map((v, i) => (typeof v === "number" ? [px(i), y(v), v] : null));
              const d = pts.reduce((acc, p, i) => (p ? acc + `${acc && pts[i - 1] ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}` : acc), "");
              const last = [...pts].reverse().find(Boolean);
              return (
                <g key={k}>
                  <path d={d} fill="none" stroke={shade[k]} strokeWidth={2} strokeDasharray={k === 2 ? "5 4" : undefined} />
                  {pts.map((p, i) =>
                    p ? (
                      <circle key={i} cx={p[0]} cy={p[1]} r={4} fill={shade[k]} stroke="var(--np-paper)" strokeWidth={2} className="np-mark">
                        <title>{`${c.x[i]} · ${s.name}: ${fmt(p[2])} ${c.unit}`}</title>
                      </circle>
                    ) : null,
                  )}
                  {last && (
                    <text x={last[0]} y={last[1] - 9} textAnchor="end" className="np-val">
                      {fmt(last[2])}
                    </text>
                  )}
                </g>
              );
            })}
        {c.x.map((x, i) => {
          const cx = c.kind === "bar" ? m.l + (pw / n) * (i + 0.5) : m.l + (n === 1 ? pw / 2 : (pw * i) / (n - 1));
          return (
            <text key={i} x={cx} y={H - m.b + 18} textAnchor="middle" className="np-tick">
              {`\u2068${x}\u2069`}
            </text>
          );
        })}
      </svg>
      <div className="np-srcline">
        מקור:{" "}
        <a href={c.source.url} target="_blank" rel="noreferrer" dir="auto">
          {c.source.publisher}
        </a>
        {c.source.note ? `, ${c.source.note}` : ""}
      </div>
    </figure>
  );
}

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

/** The bottom of the last page: reading in ten minutes, what was saved, how the stories were chosen. */
function Colophon({ issue, byId, fb }: { issue: NewsIssue; byId: Map<string, NewsItem>; fb: NewsFb }) {
  const picks = (issue.picks10 ?? []).map((x) => byId.get(x)).filter((it): it is NewsItem => !!it);
  const saved = issue.items.filter((it) => fb.items[it.id]?.saved);
  if (!picks.length && !saved.length && !issue.stats) return null;
  return (
    <footer className="np-colophon">
      {picks.length > 0 && (
        <div>
          <h4>לקרוא ב-10 דקות</h4>
          <ul className="np-list">
            {picks.map((it) => (
              <li key={it.id}>
                <a href={it.sources[0]?.url} target="_blank" rel="noreferrer">
                  {it.headline}
                </a>
                {it.read10?.minutes ? <span className="np-mute"> · {it.read10.minutes} דק'</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {saved.length > 0 && (
        <div>
          <h4>שמרת</h4>
          <ul className="np-list">
            {saved.map((it) => (
              <li key={it.id}>{it.headline}</li>
            ))}
          </ul>
        </div>
      )}
      {issue.stats && (
        <div>
          <h4>איך נבחרו</h4>
          <p className="np-mute">
            {issue.stats.candidates} מועמדים, {issue.stats.fetched} נקראו במלואם, {issue.stats.verified} עברו אימות מול המקור שנקרא השבוע. נבנה ב-<span dir="ltr">{shortDate(issue.publishedAt)}</span>.
          </p>
        </div>
      )}
    </footer>
  );
}

/** A story on its own inside page: its full text when the issue has one, the sources up front, and the next story. */
function ArticlePage({ issue, it, store, onBack, story }: { issue: NewsIssue; it: NewsItem; store: Parameters<typeof loadFull>[0]; onBack: () => void; story: Omit<StoryProps, "it" | "variant"> }) {
  const [full, setFull] = useState<NewsFull | null | undefined>(it.full ? undefined : null);
  useEffect(() => {
    if (!it.full) return setFull(null);
    let live = true;
    setFull(undefined);
    loadFull(store, issue.id, it.id)
      .then((f) => live && setFull(f))
      .catch(() => live && setFull(null));
    return () => {
      live = false;
    };
  }, [store, issue.id, it.id, it.full]);
  const order = [issue.lead, ...issue.sections.flatMap((s) => s.items), ...issue.items.map((x) => x.id)].filter((x, i, a) => a.indexOf(x) === i && issue.items.some((y) => y.id === x && y.role !== "post" && y.role !== "number"));
  const at = order.indexOf(it.id);
  const step = (d: number) => (at >= 0 ? order[at + d] : undefined);
  const label = (x: string) => issue.items.find((y) => y.id === x)?.headline ?? "";
  const next = step(1);
  const prev = step(-1);
  return (
    <>
      <div className="np-pagebar">
        <button className="np-back" onClick={onBack}>
          חזרה לעמוד הראשי
        </button>
        <span>
          {dateRange(issue.window.from, issue.window.to)} · גיליון {issue.number}
        </span>
      </div>
      <article className="np-article" key={it.id}>
        {full === undefined ? <p className="lt-empty">טוען את הכתבה המלאה…</p> : <Story it={it} variant="page" {...story} fullText={full} />}
      </article>
      <nav className="np-pagenav" aria-label="כתבות בגיליון">
        {next ? (
          <button onClick={() => story.onOpen?.(next)}>
            <span>הכתבה הבאה</span>
            {label(next)}
          </button>
        ) : (
          <span />
        )}
        {prev ? (
          <button onClick={() => story.onOpen?.(prev)}>
            <span>הכתבה הקודמת</span>
            {label(prev)}
          </button>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
