// The top of the home screen (the lab's front page): what waits today and what it will open. A warm band with the
// next lesson, the topics it teaches, the modules it unlocks, one module just beyond reach (a different one each
// day), and the last line he wrote about a reading. Everything comes from the library and his progress; nothing is
// generated. Same file in both apps (the lab's name and line come from App.tsx); styles in labtabs/vivid.css.
import { useMemo } from "react";
import { moduleState, type LibraryIndex, type Module } from "../library";
import type { ModuleProgress } from "../types";
import type { Selection } from "./ModuleMap";
import { useReadLog } from "../readlog";
import { hueOf } from "../labtabs/portraits";
import "../labtabs/vivid.css";

const dayNo = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60_000) / 86_400_000);

export function HomeHero({
  code,
  title,
  sub,
  index,
  done,
  mods,
  onSelect,
}: {
  code: string;
  title: string;
  sub: string;
  index: LibraryIndex;
  done: Set<string>;
  mods: Record<string, ModuleProgress>;
  onSelect: (s: Selection) => void;
}) {
  const log = useReadLog();
  const v = useMemo(() => {
    const byId = new Map(index.modules.map((m) => [m.id, m]));
    const open = index.modules.filter((m) => moduleState(m, done) === "open");
    const started = open
      .filter((m) => mods[m.id]?.lessons?.length)
      .sort((a, b) => (mods[b.id]?.updatedAt ?? 0) - (mods[a.id]?.updatedAt ?? 0));
    const next: Module | undefined = started[0] ?? open.find((m) => m.tier === "core") ?? open[0];
    let lesson: { i: number; title: string } | null = null;
    if (next && mods[next.id]?.lessons?.length) {
      const p = mods[next.id];
      const i = p.lessons!.findIndex((_, k) => !p.done?.includes(k));
      if (i >= 0) lesson = { i, title: p.lessons![i].title };
    }
    const items = (next?.items ?? [])
      .slice()
      .sort((a, b) => "KSC".indexOf(a.imp) - "KSC".indexOf(b.imp))
      .slice(0, 4)
      .map((x) => x.n);
    const unlocks = next ? index.modules.filter((m) => m.prereq?.includes(next.id)) : [];
    // just beyond reach: locked, but every prerequisite is learned or open now
    const near = index.modules.filter((m) => moduleState(m, done) === "locked" && m.id !== next?.id && (m.prereq ?? []).every((q) => done.has(q) || (byId.has(q) && moduleState(byId.get(q)!, done) === "open")));
    const far = near.length ? near[dayNo() % near.length] : undefined;
    const counts = { done: done.size, open: open.length, locked: index.modules.length - done.size - open.length };
    return { next, lesson, items, unlocks, far, counts };
  }, [index, done, mods]);

  const reads = log ? Object.values(log).sort((a, b) => b.at - a.at) : [];
  const insight = reads.find((e) => e.note?.trim());
  const pct = (n: number) => `${(n / Math.max(1, index.modules.length)) * 100}%`;

  return (
    <section className="hh" aria-label="היום">
      <div className="hh-kicker">
        <span dir="ltr">{code}</span>
        <span>{new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>
      <h1 className="hh-title">{title}</h1>
      <p className="hh-sub">{sub}</p>

      <div className="hh-grid">
        {v.next && (
          <button className="hh-next" onClick={() => onSelect(v.lesson ? { moduleId: v.next!.id, lesson: v.lesson.i } : { moduleId: v.next!.id })}>
            <span className="hh-label">{v.lesson ? "מחכה לך" : "אפשר להתחיל"}</span>
            <span className="hh-next-t">{v.lesson ? `שיעור ${v.lesson.i + 1}: ${v.lesson.title}` : v.next.title}</span>
            <span className="hh-next-m">
              <b dir="ltr">{v.next.id}</b> {v.lesson ? v.next.title : v.next.en}
            </span>
            {v.items.length > 0 && (
              <span className="hh-learn">
                <span className="hh-label">אחרי זה תדע</span>
                <span className="hh-pills">
                  {v.items.map((n) => (
                    <span key={n} className="hh-pill" style={{ ["--h" as string]: String(hueOf(n)) }}>
                      {n}
                    </span>
                  ))}
                </span>
              </span>
            )}
            <span className="hh-go">{v.lesson ? "להמשיך" : "לפתוח"} ←</span>
          </button>
        )}

        <div className="hh-side">
          {v.unlocks.length > 0 && (
            <div className="hh-card hh-unlocks">
              <span className="hh-label">{v.unlocks.length === 1 ? "זה פותח" : `זה פותח ${v.unlocks.length} מודולים`}</span>
              <ul>
                {v.unlocks.slice(0, 3).map((m) => (
                  <li key={m.id}>
                    <button className="link" onClick={() => onSelect({ moduleId: m.id })}>
                      <b dir="ltr">{m.id}</b> {m.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {v.far && (
            <button className="hh-card hh-far" onClick={() => onSelect({ moduleId: v.far!.id })}>
              <span className="hh-label">קרוב להיפתח</span>
              <span className="hh-far-t">{v.far.title}</span>
              <span className="hh-far-en" dir="ltr">
                {v.far.id} · {v.far.en}
              </span>
            </button>
          )}
          {insight && (
            <figure className="hh-card hh-quote" style={{ ["--h" as string]: String(hueOf(insight.a || insight.t)) }}>
              <span className="hh-label">מה לקחת לאחרונה</span>
              <blockquote dir="auto">{insight.note}</blockquote>
              <figcaption dir="auto">{[insight.a, insight.t].filter(Boolean).join(" · ")}</figcaption>
            </figure>
          )}
        </div>
      </div>

      <div className="hh-progress" aria-label={`נלמדו ${v.counts.done}, זמינים ${v.counts.open}, נעולים ${v.counts.locked}`}>
        <span className="hh-bar">
          <i className="b-done" style={{ width: pct(v.counts.done) }} />
          <i className="b-open" style={{ width: pct(v.counts.open) }} />
        </span>
        <span className="hh-legend">
          <span><i className="b-done" /> נלמד <b dir="ltr">{v.counts.done}</b></span>
          <span><i className="b-open" /> זמין <b dir="ltr">{v.counts.open}</b></span>
          <span><i className="b-locked" /> נעול <b dir="ltr">{v.counts.locked}</b></span>
          {reads.length > 0 && <span><i className="b-read" /> נקראו <b dir="ltr">{reads.length}</b></span>}
        </span>
      </div>
    </section>
  );
}
