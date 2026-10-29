import { DEFAULT_READING, setReading, useReading, type Reading } from "../reading";
import { Icon } from "./Icon";

const OPTIONS: { key: keyof Reading; label: string; values: [string, string][] }[] = [
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
      <p className="reading-sample">
        כשמכפילים את המוטה ומשאירים את העילוי קבוע, הגרר המושרה יורד פי ארבעה, כי הוא הפוך לריבוע המוטה.
      </p>
      <button className="link" onClick={() => setReading(DEFAULT_READING)}>
        חזרה לברירת המחדל
      </button>
    </div>
  );
}
