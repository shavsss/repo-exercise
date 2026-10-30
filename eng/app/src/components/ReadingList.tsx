// The module page's curriculum: the fixed reading list, the topic items the tutor adds beyond
// the pages, and the sections opened with a short diagnostic (test-out) or as a brief overview.
// Data: the optional fields of each module in lib/index.json (src/curriculum.ts). Same file in both apps.
import { sourceless, type ReadingItem, type SectionRef, type TopicItem } from "../curriculum";
import type { Module } from "../library";
import "./curriculum.css";

const IMP: Record<string, string> = { K: "חובה", S: "חשוב", C: "להכיר" };
const KIND: Record<TopicItem["k"], string> = { new: "נושא חדש", deepen: "העמקה", delta: "בהרחבה במודול אחר", mention: "אזכור" };
const ORDER: Record<string, number> = { K: 0, S: 1, C: 2 };

const pages = (s: SectionRef) => (s.d && s.p ? `${s.d} ${s.p[0]}${s.p[1] > s.p[0] ? `–${s.p[1]}` : ""}` : "");
const hours = (h: number) => (h < 1 ? `${Math.round(h * 60)} דק'` : `${Number(h.toFixed(1))} ש'`);

function Reading({ r }: { r: ReadingItem }) {
  return (
    <li className={`rl-item ${r.core ? "is-core" : ""}`}>
      <div className="rl-head">
        <a className="rl-title" href={r.u} target="_blank" rel="noopener noreferrer" dir="auto">
          {r.t}
        </a>
        <span className="rl-badges">
          <span className={`rl-badge ${r.core ? "rl-core" : ""}`}>{r.core ? "עם המודול" : "לפי הצורך"}</span>
          {r.p2h ? <span className="rl-badge rl-p2h">מקור מחוזק</span> : null}
          <span className="rl-badge" dir="ltr">
            {hours(r.h)}
          </span>
        </span>
      </div>
      <div className="rl-meta" dir="ltr">
        {[r.a, r.o, r.y].filter(Boolean).join(" · ")}
        <span className="rl-id"> · {r.id}</span>
      </div>
      {r.topic && (
        <div className="rl-topic">
          נושא: <bdi dir="auto">{r.topic}</bdi>
        </div>
      )}
      <p className="rl-why" dir="auto">
        {r.why}
      </p>
      <div className="rl-label">מה לקרוא</div>
      <p className="rl-focus" dir="auto">
        {r.focus}
      </p>
      {(r.pay || r.alt || r.st === "blocked" || r.st === "timeout") && (
        <p className="rl-note">
          {r.pay ? "בהוצאה לאור (גישה דרך ספרייה). " : ""}
          {r.alt && (
            <>
              <a href={r.alt} target="_blank" rel="noopener noreferrer">
                עותק פתוח
              </a>
              {". "}
            </>
          )}
          {r.st === "blocked" || r.st === "timeout" ? "האתר נפתח בדפדפן (בדיקה אוטומטית לא עוברת בו)." : ""}
        </p>
      )}
    </li>
  );
}

/** The module's fixed reading list: core items first. */
export function ReadingList({ m }: { m: Module }) {
  const items = [...(m.reading ?? [])].sort((a, b) => Number(b.core) - Number(a.core));
  if (!items.length) return null;
  const core = items.filter((r) => r.core);
  return (
    <section className="rl" aria-label="רשימת קריאה">
      <h2 className="section-title">
        רשימת קריאה
        <span className="rl-count" dir="ltr">
          {items.length} · {hours(core.reduce((s, r) => s + r.h, 0))}
        </span>
      </h2>
      <p className="muted rl-intro">קבועה מראש: פריטי "עם המודול" נקראים כשהמודול נלמד, והמורה מציע כל פריט ברגע שהוא עונה על שאלה מהשיעור. קוראים רק את החלק שבשורה "מה לקרוא".</p>
      <ul className="rl-list">
        {items.map((r) => (
          <Reading key={r.id} r={r} />
        ))}
      </ul>
    </section>
  );
}

/** Topic items beyond the pages, and the test-out and brief sections. */
export function ModuleTopics({ m }: { m: Module }) {
  const items = [...(m.items ?? [])].sort((a, b) => (ORDER[a.imp] ?? 3) - (ORDER[b.imp] ?? 3));
  const testout = m.testout ?? [];
  const brief = m.brief ?? [];
  if (!items.length && !testout.length && !brief.length) return null;
  return (
    <section className="mt" aria-label="נושאי הלימוד">
      {sourceless(m) && items.length > 0 && (
        <p className="mt-lead">המורה מלמד את המודול הזה מנושאי הלימוד שלמטה, מהידע שלו ומרשימת הקריאה, באותו רף עומק של כל מודול.</p>
      )}
      {items.length > 0 && (
        <details className="mt-group" open={sourceless(m)}>
          <summary>
            נושאי לימוד שהמורה מוסיף ({items.length})
          </summary>
          <ul className="mt-list">
            {items.map((x) => (
              <li key={x.id} className={`mt-item imp-${x.imp}`}>
                <span className="mt-imp">{IMP[x.imp] ?? x.imp}</span>
                <span className="mt-body">
                  <span className="mt-name" dir="auto">
                    {x.n}
                  </span>
                  <span className="mt-kind">
                    {KIND[x.k]}
                    {x.primary ? (
                      <>
                        {" "}
                        (<bdi dir="ltr">{x.primary.split(":").pop()}</bdi>)
                      </>
                    ) : null}
                    {x.to ? " · מבחן דילוג" : ""}
                  </span>
                  {x.teach && (
                    <span className="mt-teach" dir="auto">
                      {x.teach}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
      {testout.length > 0 && (
        <details className="mt-group">
          <summary>מבחני דילוג ({testout.length})</summary>
          <p className="muted mt-explain">כל אחד מאלה נפתח בשיעור בשתיים-שלוש שאלות אבחון. עונים נכון: גרסה מרוכזת, הטקסט המלא בלחיצה על תגית העמוד, ובדיקה חוזרת בהמשך. אחרת: השיעור המלא.</p>
          <ul className="mt-secs">
            {testout.map((s, i) => (
              <li key={i}>
                <span dir="auto">{s.t}</span>
                {pages(s) && (
                  <span className="mt-pages" dir="ltr">
                    {pages(s)}
                  </span>
                )}
                {s.sub ? <span className="mt-pages">נושא</span> : null}
              </li>
            ))}
          </ul>
        </details>
      )}
      {brief.length > 0 && (
        <details className="mt-group">
          <summary>סקירה מקוצרת ({brief.length})</summary>
          <p className="muted mt-explain">סעיפים שנלמדים בפסקה או שתיים, עם תגית העמוד לטקסט המלא.</p>
          <ul className="mt-secs">
            {brief.map((s, i) => (
              <li key={i}>
                <span dir="auto">{s.t}</span>
                {pages(s) && (
                  <span className="mt-pages" dir="ltr">
                    {pages(s)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
