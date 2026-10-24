import { useMemo, useRef } from "react";
import type { Book } from "../api";
import { countWords, depthBar, type Item, type Segment } from "../segments";
import { Markdown, MdContext, slug } from "./Markdown";
import { CodeSeg, SearchSeg, ThinkingSeg, ToolSeg } from "./Segments";
import { CALLOUTS } from "./blocks/Callout";

const MODE_LABEL = { lesson: "שיעור על סעיף", clarify: "שאלת הבהרה", free: "חופשי" } as const;

export function UserBubble({ item }: { item: Extract<Item, { kind: "user" }> }) {
  return (
    <div className="msg-user">
      <div className={`user-bubble mode-${item.mode}`}>
        <span className="pill pill-mini user-mode">{MODE_LABEL[item.mode]}</span>
        {item.images > 0 && <span className="pill pill-mini">🖼️ {item.images}</span>}
        <div className="user-text">{item.text}</div>
      </div>
    </div>
  );
}

function headingsOf(segments: Segment[]) {
  const out: { level: 2 | 3; text: string }[] = [];
  for (const s of segments) {
    if (s.t !== "text") continue;
    const noFences = s.text.replace(/```[\s\S]*?(```|$)/g, "");
    for (const m of noFences.matchAll(/^(##|###)\s+(.+)$/gm)) out.push({ level: m[1].length as 2 | 3, text: m[2].trim() });
  }
  return out;
}

function blocksOf(segments: Segment[]) {
  const counts: Record<string, number> = {};
  for (const s of segments) if (s.t === "text") for (const m of s.text.matchAll(/```(\w+)/g)) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  return counts;
}

const MAP_BLOCKS: [string, string, string][] = [
  ["story", "📜", "סיפור"],
  ["think", "🤔", "עצירות"],
  ["history", "🕰️", "רקע"],
  ["casestudy", "🔬", "מקרה בוחן"],
  ["domain", "🌍", "תחומים"],
  ["interactive", "🎛️", "אינטראקטיבי"],
  ["chart", "📈", "גרפים"],
  ["erratum", "⚠️", "טעויות"],
  ["product", "🏭", "מוצר"],
  ["exercise", "✏️", "תרגילים"],
];

export function AssistantTurn({
  item,
  live,
  registry,
  books,
  onOpenBook,
  onFillGaps,
}: {
  item: Extract<Item, { kind: "assistant" }>;
  live: boolean;
  registry: Map<string, any>;
  books: Book[];
  onOpenBook: (bookId: string, page: string, by: "label" | "pdf") => void;
  onFillGaps: (missing: string[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const words = useMemo(() => countWords(item.segments), [item.segments]);
  const heads = useMemo(() => headingsOf(item.segments), [item.segments]);
  const blocks = useMemo(() => blocksOf(item.segments), [item.segments]);
  const bar = item.mode === "lesson" && !live ? depthBar(item.segments) : null;
  const ctx = useMemo(() => ({ registry, live, idPrefix: item.key }), [registry, live, item.key]);

  const scrollTo = (selector: string) => ref.current?.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Consecutive tool activity is grouped into one strip.
  const groups: { kind: "text" | "activity"; segs: Segment[] }[] = [];
  for (const s of item.segments) {
    const kind = s.t === "text" ? "text" : "activity";
    const last = groups[groups.length - 1];
    if (last && last.kind === kind && kind === "activity") last.segs.push(s);
    else groups.push({ kind, segs: [s] });
  }

  const showMap = !live && (heads.length >= 3 || Object.keys(blocks).length >= 4) && words > 600;

  return (
    <article className={`msg-assistant ${live ? "is-live" : ""}`} ref={ref}>
      <div className="msg-paper">
        <div className="paper-head">
          <span className="avatar" aria-hidden>
            <span>∂</span>
          </span>
          <span className="paper-who">המורה</span>
          <span className="pill pill-mini">{MODE_LABEL[item.mode]}</span>
          {item.demo && <span className="pill pill-mini pill-demo">הדגמה</span>}
          <span className="paper-spacer" />
          {words > 0 && <span className="paper-stat">{words.toLocaleString("he-IL")} מילים</span>}
        </div>

        {showMap && (
          <nav className="lesson-map">
            <div className="lesson-map-title">🧭 מפת התשובה</div>
            <div className="lesson-map-chips">
              {MAP_BLOCKS.filter(([k]) => blocks[k]).map(([k, icon, label]) => (
                <button key={k} className={`chip tone-chip-${CALLOUTS[k]?.tone ?? "ink"}`} onClick={() => scrollTo(`[data-block="${k}"]`)}>
                  {icon} {label}
                  {blocks[k] > 1 && <b>×{blocks[k]}</b>}
                </button>
              ))}
            </div>
            {heads.length > 0 && (
              <ol className="lesson-map-heads">
                {heads.map((h, i) => (
                  <li key={i} className={`lvl-${h.level}`}>
                    <button onClick={() => scrollTo(`#${CSS.escape(`${item.key}-${slug(h.text)}`)}`)}>{h.text.replace(/[*_`$]/g, "")}</button>
                  </li>
                ))}
              </ol>
            )}
          </nav>
        )}

        <MdContext.Provider value={ctx}>
          <div className="prose">
            {groups.map((g, gi) =>
              g.kind === "text" ? (
                <Markdown key={gi} text={(g.segs[0] as Extract<Segment, { t: "text" }>).text} />
              ) : (
                <div key={gi} className="activity">
                  {g.segs.map((s, si) =>
                    s.t === "thinking" ? (
                      <ThinkingSeg key={si} seg={s} />
                    ) : s.t === "tool" ? (
                      <ToolSeg key={si} seg={s} books={books} onOpenBook={onOpenBook} />
                    ) : s.t === "code" ? (
                      <CodeSeg key={si} seg={s} />
                    ) : s.t === "search" ? (
                      <SearchSeg key={si} seg={s} />
                    ) : s.t === "note" ? (
                      <div key={si} className="seg-note">ℹ️ {s.text}</div>
                    ) : null,
                  )}
                </div>
              ),
            )}
            {live && <span className="caret-blink" aria-hidden />}
          </div>
        </MdContext.Provider>

        {bar && (
          <footer className="depth-bar">
            <div className="depth-title">
              בדיקת רף אוטומטית
              <span className="depth-score">
                {bar.filter((b) => b.ok).length}/{bar.length}
              </span>
            </div>
            <div className="depth-items">
              {bar.map((b) => (
                <span key={b.key} className={`depth-item ${b.ok ? "ok" : "miss"}`}>
                  {b.ok ? "✓" : "✗"} {b.label}
                  {b.detail && <em>{b.detail}</em>}
                </span>
              ))}
            </div>
            {bar.some((b) => !b.ok) && (
              <button className="btn btn-accent" onClick={() => onFillGaps(bar.filter((b) => !b.ok).map((b) => b.label))}>
                ⚡ השלם את מה שחסר
              </button>
            )}
          </footer>
        )}
        {!live && (item.usage.output > 0 || item.models.length > 0) && !item.demo && (
          <div className="paper-foot">
            {item.models.join(" → ")} · קלט {item.usage.input.toLocaleString()} (מטמון {item.usage.cacheRead.toLocaleString()}) · פלט {item.usage.output.toLocaleString()} טוקנים
          </div>
        )}
      </div>
    </article>
  );
}
