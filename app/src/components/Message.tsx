import { useMemo, useRef } from "react";
import { countWords, depthBar, type Item, type Segment } from "../segments";
import { MODE_LABEL } from "../runtime";
import { Markdown, MdContext, slug } from "./Markdown";
import { ActivitySeg } from "./Segments";
import { CALLOUTS } from "./blocks/Callout";

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

export function headingsOf(segments: Segment[]) {
  const out: { level: 2 | 3; text: string }[] = [];
  for (const s of segments) {
    if (s.t !== "text") continue;
    const noFences = s.text.replace(/```[\s\S]*?(```|$)/g, "");
    for (const m of noFences.matchAll(/^(##|###)\s+(.+)$/gm)) out.push({ level: m[1].length as 2 | 3, text: m[2].trim() });
  }
  return out;
}

export function blocksOf(segments: Segment[]) {
  const counts: Record<string, number> = {};
  for (const s of segments) if (s.t === "text") for (const m of s.text.matchAll(/```(\w+)/g)) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  return counts;
}

export const MAP_BLOCKS: [string, string, string][] = [
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
  onOpenBook,
  onFillGaps,
  onContinue,
  author,
}: {
  author: string;
  item: Extract<Item, { kind: "assistant" }>;
  live: boolean;
  onOpenBook: (bookId: string, page: string, by: "label" | "pdf") => void;
  onFillGaps: (missing: string[]) => void;
  onContinue?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const words = useMemo(() => countWords(item.segments), [item.segments]);
  const heads = useMemo(() => headingsOf(item.segments), [item.segments]);
  const blocks = useMemo(() => blocksOf(item.segments), [item.segments]);
  const bar = item.mode === "lesson" && !live && words > 0 ? depthBar(item.segments) : null;
  const ctx = useMemo(() => ({ live, idPrefix: item.key }), [live, item.key]);
  const activity = item.segments.filter((s): s is Extract<Segment, { t: "activity" }> => s.t === "activity");
  const text = item.segments.find((s): s is Extract<Segment, { t: "text" }> => s.t === "text")?.text ?? "";

  const scrollTo = (selector: string) => ref.current?.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const showMap = !live && (heads.length >= 3 || Object.keys(blocks).length >= 4) && words > 600;

  return (
    <article className={`msg-assistant ${live ? "is-live" : ""}`} ref={ref} data-key={item.key}>
      <div className="msg-paper">
        <div className="paper-head">
          <span className="avatar" aria-hidden>
            <span>📖</span>
          </span>
          <span className="paper-who">{author}</span>
          <span className="pill pill-mini">{MODE_LABEL[item.mode]}</span>
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
            {live && item.status && (
              <div className="live-status">
                <span className="spinner" />
                {item.status}
              </div>
            )}
            {activity.length > 0 && (
              <div className="activity">
                {activity.map((s, i) => (
                  <ActivitySeg key={i} a={s.a} onOpenBook={onOpenBook} />
                ))}
              </div>
            )}
            {text ? (
              <Markdown text={text} />
            ) : live ? (
              <div className="typing">
                <span />
                <span />
                <span />
                {item.mode === "lesson" ? "שיעור נכתב בכמה חלקים: קודם תכנון וחישובים, אחר כך חלק אחרי חלק. הטקסט יתחיל להופיע אחרי כמה דקות." : "המורה קורא ומתכנן את התשובה. היא יכולה להתחיל אחרי דקה או שתיים."}
              </div>
            ) : null}
            {live && text && <span className="caret-blink" aria-hidden />}
          </div>
        </MdContext.Provider>

        {(item.truncated || item.interrupted) && !live && (
          <div className="banner banner-warn turn-note">
            {item.truncated ? "התשובה הגיעה לאורך המרבי ונקטעה." : "התשובה נקטעה לפני שהסתיימה (למשל כי הדפדפן נסגר). מה שנכתב עד עכשיו נשמר."}
            {onContinue && (
              <button className="btn btn-small" onClick={onContinue}>
                המשך מהמקום שנעצר ←
              </button>
            )}
          </div>
        )}

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
        {!live && item.model && <div className="paper-foot">{item.model}</div>}
      </div>
    </article>
  );
}
