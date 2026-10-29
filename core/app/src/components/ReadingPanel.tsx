import { DEFAULT_READING, setReading, useReading, type Reading } from "../reading";
import { play } from "../sound";
import { Icon } from "./Icon";

type Choice = Exclude<keyof Reading, "volume" | "noiseVolume" | "noiseKind">;
const OPTIONS: { key: Choice; label: string; values: [string, string][] }[] = [
  { key: "font", label: "גופן", values: [["plex", "IBM Plex"], ["frank", "פרנק-רוהל"], ["assistant", "Assistant"]] },
  { key: "size", label: "גודל", values: [["s", "קטן"], ["m", "בינוני"], ["l", "גדול"], ["xl", "גדול מאוד"]] },
  { key: "space", label: "ריווח שורות", values: [["normal", "רגיל"], ["airy", "מרווח"]] },
  { key: "width", label: "רוחב הטור", values: [["narrow", "צר"], ["medium", "בינוני"], ["wide", "רחב"]] },
  { key: "surface", label: "רקע הקריאה", values: [["theme", "לפי בהיר/כהה"], ["paper", "נייר"], ["warm", "נייר חם"], ["soft", "כהה רך"]] },
  { key: "focus", label: "מצב ריכוז (בלי המפה ובלי כפתורי העזר)", values: [["off", "כבוי"], ["on", "פועל"]] },
  { key: "sound", label: "צלילים", values: [["soft", "רכים"], ["off", "כבויים"]] },
  { key: "cursor", label: "מצביע", values: [["lab", "של המעבדה"], ["system", "רגיל"]] },
  { key: "noise", label: "רעש רקע בקריאה", values: [["off", "כבוי"], ["brown", "חום (עמוק)"], ["pink", "ורוד"], ["rain", "גשם"]] },
];

/** A 0–100 slider with − and + beside it. */
function Volume({ label, value, set, disabled, onTry }: { label: string; value: number; set: (v: number) => void; disabled?: boolean; onTry?: () => void }) {
  const nudge = (d: number) => {
    set(Math.min(100, Math.max(0, value + d)));
    onTry?.();
  };
  return (
    <div className="reading-row">
      <span className="reading-label">{label}</span>
      <div className="reading-vol">
        <button className="icon-btn" aria-label={`${label}: חלש יותר`} onClick={() => nudge(-10)} disabled={disabled || value <= 0}>
          −
        </button>
        <input type="range" min={0} max={100} step={5} value={value} aria-label={label} disabled={disabled} onChange={(e) => set(Number(e.target.value))} onPointerUp={onTry} onKeyUp={onTry} />
        <button className="icon-btn" aria-label={`${label}: חזק יותר`} onClick={() => nudge(10)} disabled={disabled || value >= 100}>
          +
        </button>
        <span className="reading-vol-num">{value}</span>
      </div>
    </div>
  );
}

/** Reading settings: a small popover under the top bar. */
export function ReadingPanel({ onClose }: { onClose: () => void }) {
  const r = useReading();
  const pick = (key: Choice, v: string) => setReading((key === "noise" && v !== "off" ? { noise: v, noiseKind: v } : { [key]: v }) as Partial<Reading>);
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
              <button key={v} aria-pressed={r[o.key] === v} onClick={() => pick(o.key, v)}>
                {l}
              </button>
            ))}
          </div>
          {o.key === "sound" && <Volume label="עוצמת הצלילים" value={r.volume} set={(volume) => setReading({ volume })} disabled={r.sound === "off"} onTry={() => play("key")} />}
          {o.key === "noise" && <Volume label="עוצמת רעש הרקע" value={r.noiseVolume} set={(noiseVolume) => setReading({ noiseVolume })} disabled={r.noise === "off"} />}
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
