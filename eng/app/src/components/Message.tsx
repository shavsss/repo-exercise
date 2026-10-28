import { useMemo, useRef } from "react";
import { countWords, depthBar, type Item, type Segment } from "../segments";
import { MODE_LABEL } from "../runtime";
import { Markdown, MdContext, slug } from "./Markdown";
import { ActivitySeg } from "./Segments";
import { CALLOUTS } from "./blocks/Callout";
import { Icon } from "./Icon";
import { MarginNotes } from "./MarginNotes";
import type { LessonNote } from "../types";

export function UserBubble({ item }: { item: Extract<Item, { kind: "user" }> }) {
  return (
    <div className="msg-user">
      <div className="user-bubble">
        <span className="user-mode">{MODE_LABEL[item.mode]}</span>
        {item.images > 0 && <span className="user-mode">{item.images} תמונות</span>}
        <div className="user-text">{item.text}</div>
      </div>
    </div>
  );
}

/** A dimension line: |←— M2.9 · title —→| */
export function DimensionHead({ code, title, sub }: { code: string; title: string; sub?: string }) {
  return (
    <header className="dimhead">
      <div className="dimline" aria-hidden>
        <span className="dim-tick" />
        <span className="dim-rule" />
        <span className="dim-code" dir="ltr">
          {code}
        </span>
        <span className="dim-rule" />
        <span className="dim-tick" />
      </div>
      <h1 className="dim-title">{title}</h1>
      {sub && <div className="dim-sub">{sub}</div>}
    </header>
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

const MAP_BLOCKS: [string, string][] = [
  ["story", "פתיחה"],
  ["think", "עצירות"],
  ["history", "רקע"],
  ["figure", "איורים"],
  ["scene3d", "תלת-ממד"],
  ["sim", "סימולטורים"],
  ["casestudy", "מקרה הנדסי"],
  ["domain", "חיבורים"],
  ["fieldmap", "איפה הנוסחה עובדת"],
  ["today", "העולם של היום"],
  ["notebook", "מחברת"],
  ["erratum", "תיקונים"],
  ["coverage", "כיסוי"],
  ["exercise", "תרגילים"],
];
const MAP_ICON: Record<string, string> = { think: "think", figure: "figure", sim: "sim", scene3d: "sim", exercise: "exercise", notebook: "calc" };

export function AssistantTurn({
  item,
  live,
  header,
  fullBar,
  onOpenSource,
  onFillGaps,
  onContinue,
  notes,
  onNoteSave,
  onNoteDelete,
}: {
  item: Extract<Item, { kind: "assistant" }>;
  live: boolean;
  /** shown above a lesson: module code and lesson title */
  header?: { code: string; title: string; sub?: string };
  /** core/advanced lesson: the full depth bar */
  fullBar: boolean;
  onOpenSource: (doc: string, page: number) => void;
  onFillGaps: (missing: string[]) => void;
  onContinue?: () => void;
  /** the sticky notes the learner pulled into this lesson's margin */
  notes?: LessonNote[];
  onNoteSave?: (id: string, patch: Partial<LessonNote>) => void;
  onNoteDelete?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const words = useMemo(() => countWords(item.segments), [item.segments]);
  const heads = useMemo(() => headingsOf(item.segments), [item.segments]);
  const blocks = useMemo(() => blocksOf(item.segments), [item.segments]);
  const bar = item.mode === "lesson" && !live && words > 0 ? depthBar(item.segments, fullBar) : null;
  const ctx = useMemo(() => ({ live, idPrefix: item.key, openSource: onOpenSource }), [live, item.key, onOpenSource]);
  const activity = item.segments.filter((s): s is Extract<Segment, { t: "activity" }> => s.t === "activity");
  const text = item.segments.find((s): s is Extract<Segment, { t: "text" }> => s.t === "text")?.text ?? "";

  const scrollTo = (selector: string) => ref.current?.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const showMap = !live && (heads.length >= 3 || Object.keys(blocks).length >= 4) && words > 600;

  return (
    <article className={`msg-assistant ${live ? "is-live" : ""}`} ref={ref} data-key={item.key}>
      {header && item.mode === "lesson" && <DimensionHead {...header} />}
      {!live && item.mode === "lesson" && notes?.length && onNoteSave && onNoteDelete ? <MarginNotes root={ref} notes={notes} version={item.segments} onSave={onNoteSave} onDelete={onNoteDelete} /> : null}
      <div className="msg-meta">
        <span>{MODE_LABEL[item.mode]}</span>
        {words > 0 && <span dir="ltr">{words.toLocaleString("he-IL")} מילים</span>}
      </div>

      {showMap && (
        <nav className="lesson-map" aria-label="מפת השיעור">
          <div className="lesson-map-chips">
            {MAP_BLOCKS.filter(([k]) => blocks[k]).map(([k, label]) => (
              <button key={k} className={`chip chip-${k}`} onClick={() => scrollTo(`[data-block="${k}"]`)}>
                <Icon name={MAP_ICON[k] ?? CALLOUTS[k]?.icon ?? "dot"} size={13} />
                {label}
                {blocks[k] > 1 && <b>{blocks[k]}</b>}
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
                <ActivitySeg key={i} a={s.a} onOpenSource={onOpenSource} />
              ))}
            </div>
          )}
          {text ? (
            <Markdown text={text} />
          ) : live ? (
            <div className="typing">
              {item.mode === "lesson"
                ? "שיעור נכתב בחלקים: קודם תכנון וחישובים, אחר כך חלק אחרי חלק. הטקסט מתחיל להופיע אחרי כמה דקות."
                : "המורה קורא את המקורות ומתכנן את התשובה. היא יכולה להתחיל אחרי דקה או שתיים."}
            </div>
          ) : null}
          {live && text && <span className="caret" aria-hidden />}
        </div>
      </MdContext.Provider>

      {(item.truncated || item.interrupted) && !live && (
        <div className="banner banner-warn">
          {item.truncated ? "התשובה הגיעה לאורך המרבי ונקטעה." : "התשובה נקטעה לפני שהסתיימה (למשל כי הדפדפן נסגר). מה שנכתב נשמר."}
          {onContinue && (
            <button className="btn small primary" onClick={onContinue}>
              המשך מהמקום שנעצר
            </button>
          )}
        </div>
      )}

      {bar && (
        <footer className="depth-bar">
          <div className="depth-title">
            בדיקת רף אוטומטית
            <span className="depth-score" dir="ltr">
              {bar.filter((b) => b.ok).length}/{bar.length}
            </span>
          </div>
          <div className="depth-items">
            {bar.map((b) => (
              <span key={b.key} className={`depth-item ${b.ok ? "ok" : "miss"}`}>
                <Icon name={b.ok ? "check" : "close"} size={12} />
                {b.label}
                {b.detail && <em>{b.detail}</em>}
              </span>
            ))}
          </div>
          {bar.some((b) => !b.ok) && (
            <button className="btn small" onClick={() => onFillGaps(bar.filter((b) => !b.ok).map((b) => b.label))}>
              השלם את מה שחסר
            </button>
          )}
        </footer>
      )}
      {!live && item.model && <div className="msg-foot" dir="ltr">{item.model}</div>}
    </article>
  );
}
