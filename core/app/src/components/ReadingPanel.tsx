import { DEFAULT_READING, setReading, useReading, type Reading } from "../reading";
import { play } from "../sound";
import { Icon } from "./Icon";

const OPTIONS: { key: Exclude<keyof Reading, "volume">; label: string; values: [string, string][] }[] = [
  { key: "font", label: "גופן", values: [["plex", "IBM Plex"], ["frank", "פרנק-רוהל"], ["assistant", "Assistant"]] },
  { key: "size", label: "גודל", values: [["s", "קטן"], ["m", "בינוני"], ["l", "גדול"], ["xl", "גדול מאוד"]] },
  { key: "space", label: "ריווח שורות", values: [["normal", "רגיל"], ["airy", "מרווח"]] },
  { key: "width", label: "רוחב הטור", values: [["narrow", "צר"], ["medium", "בינוני"], ["wide", "רחב"]] },
  { key: "surface", label: "רקע הקריאה", values: [["theme", "לפי בהיר/כהה"], ["paper", "נייר"], ["warm", "נייר חם"], ["soft", "כהה רך"]] },
  { key: "focus", label: "מצב ריכוז (בלי המפה ובלי כפתורי העזר)", values: [["off", "כבוי"], ["on", "פועל"]] },
  { key: "sound", label: "צלילים", values: [["soft", "רכים"], ["off", "כבויים"]] },
  { key: "cursor", label: "מצביע", values: [["lab", "של המעבדה"], ["system", "רגיל"]] },
];

/** Reading settings: a small popover under the top bar. */
export function ReadingPanel({ onClose }: { onClose: () => void }) {
  const r = useReading();
  const nudge = (d: number) => {
    setReading({ volume: Math.min(100, Math.max(0, r.volume + d)) });
    play("key");
  };
  return (
    <div className="reading-pop" role="dialog" aria-label="תצוגת קריאה">
      <header className="reading-head">
        <span>תצוגת קריאה</span>
        <button className="icon-btn" onClick={onClose} aria-label="סגור">
          <Icon name="close" size={16} />
        </button>
      </header>
      {OPTIONS.map((o) => (
        <div key={o.key} className="reading-row">
          <span className="reading-label">{o.label}</span>
          <div className="seg" role="group" aria-label={o.label}>
            {o.values.map(([v, l]) => (
              <button key={v} aria-pressed={r[o.key] === v} onClick={() => setReading({ [o.key]: v } as Partial<Reading>)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="reading-row">
        <span className="reading-label">עוצמת הצלילים</span>
        <div className="reading-vol">
          <button className="icon-btn" aria-label="חלש יותר" onClick={() => nudge(-10)} disabled={r.volume <= 0}>
            −
          </button>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={r.volume}
            aria-label="עוצמת הצלילים"
            disabled={r.sound === "off"}
            onChange={(e) => setReading({ volume: Number(e.target.value) })}
            onPointerUp={() => play("key")}
            onKeyUp={() => play("key")}
          />
          <button className="icon-btn" aria-label="חזק יותר" onClick={() => nudge(10)} disabled={r.volume >= 100}>
            +
          </button>
          <span className="reading-vol-num">{r.volume}</span>
        </div>
      </div>
      <p className="reading-sample">
        כשמכפילים את המוטה ומשאירים את העילוי קבוע, הגרר המושרה יורד פי ארבעה, כי הוא הפוך לריבוע המוטה.
      </p>
      <button className="link" onClick={() => setReading(DEFAULT_READING)}>
        חזרה לברירת המחדל
      </button>
    </div>
  );
}
