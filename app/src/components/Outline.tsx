import { useMemo } from "react";
import type { Item } from "../segments";
import { blocksOf, headingsOf, MAP_BLOCKS } from "./Message";
import { slug } from "./Markdown";
import { CALLOUTS } from "./blocks/Callout";

/** The side panel that maps the open conversation: each answer's headings and blocks. */
export function Outline({ items, onClose, onNavigate }: { items: Item[]; onClose: () => void; onNavigate: () => void }) {
  const entries = useMemo(() => {
    const out: { key: string; ask: string; heads: ReturnType<typeof headingsOf>; blocks: Record<string, number> }[] = [];
    let ask = "";
    for (const it of items) {
      if (it.kind === "user") ask = it.text;
      else out.push({ key: it.key, ask, heads: headingsOf(it.segments), blocks: blocksOf(it.segments) });
    }
    return out;
  }, [items]);

  const go = (selector: string, within?: string) => {
    const root = within ? document.querySelector(`[data-key="${within}"]`) : document;
    root?.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    onNavigate();
  };

  return (
    <aside className="outline">
      <div className="outline-head">
        <span className="pill pill-label">מפת השיעור</span>
        <button className="icon-btn icon-btn-plain" onClick={onClose} aria-label="סגור">
          ✕
        </button>
      </div>
      {entries.length === 0 && <p className="outline-empty">כאן תופיע מפת התשובות של השיחה: כותרות, סיפורים, מקרי בוחן ותרגילים, עם קפיצה לכל אחד.</p>}
      {entries.map((e, n) => (
        <section key={e.key} className="outline-entry">
          <button className="outline-ask" onClick={() => go(`[data-key="${e.key}"]`)}>
            <span className="outline-num">{n + 1}</span>
            {e.ask.slice(0, 70) || "תשובה"}
          </button>
          {e.heads.length > 0 && (
            <ol className="outline-heads">
              {e.heads.map((h, i) => (
                <li key={i} className={`lvl-${h.level}`}>
                  <button onClick={() => go(`#${CSS.escape(`${e.key}-${slug(h.text)}`)}`)}>{h.text.replace(/[*_`$]/g, "")}</button>
                </li>
              ))}
            </ol>
          )}
          <div className="outline-chips">
            {MAP_BLOCKS.filter(([k]) => e.blocks[k]).map(([k, icon, label]) => (
              <button key={k} className={`chip tone-chip-${CALLOUTS[k]?.tone ?? "ink"}`} onClick={() => go(`[data-block="${k}"]`, e.key)} title={label}>
                {icon}
                {e.blocks[k] > 1 && <b>{e.blocks[k]}</b>}
              </button>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}
