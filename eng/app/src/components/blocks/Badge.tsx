// Inline [[...]] tags other than source pages: the seven level-2.5 sections, certainty,
// hypothetical, external source, score.
export const L25: Record<string, string> = {
  מבנה: "structure",
  מקור: "origin",
  גבולות: "limits",
  "סדר גודל": "magnitude",
  פשרה: "tradeoff",
  "מבנה משותף": "shared",
  ביקורת: "critique",
};
const L25_HINT: Record<string, string> = {
  structure: "איך הנוסחה בנויה ואילו גדלים שולטים בתוצאה",
  origin: "שלד הגזירה, ובאיזה שלב נכנסת כל הנחה",
  limits: "מתי המודל נשבר ומה בא במקומו",
  magnitude: "מספרים טיפוסיים ואומדן בראש",
  tradeoff: "מה מרוויחים, מה משלמים, ואיך זה נראה במערכות אמיתיות",
  shared: "אותה משוואה בתחום אחר",
  critique: "איך תופסים טעות בעזרת ממדים, גבולות וסדרי גודל",
};

export function Badge({ text }: { text: string }) {
  const t = text.trim();
  const l25 = /^2\.5\s*:\s*(.+)$/.exec(t);
  if (l25) {
    const label = l25[1].trim();
    const key = L25[label] ?? Object.entries(L25).find(([k]) => label.startsWith(k))?.[1] ?? "structure";
    return (
      <span className={`badge badge-l25 l25-${key}`} title={L25_HINT[key]}>
        {label}
      </span>
    );
  }
  const term = /^מונח\s*:\s*([^|]+?)\s*\|\s*(.+)$/.exec(t);
  if (term)
    return (
      <span className="term" tabIndex={0} data-def={term[2].trim()}>
        {term[1]}
      </span>
    );
  const certainty = /^ודאות\s*:\s*(.+)$/.exec(t);
  if (certainty) {
    const v = certainty[1].trim();
    const tone = v.startsWith("גבוה") ? "high" : v.startsWith("בינוני") ? "mid" : "low";
    return (
      <span className={`badge badge-cert cert-${tone}`} title="רמת ודאות">
        ודאות {v}
      </span>
    );
  }
  const source = /^מקור\s*:\s*([^|]+?)\s*(?:\|\s*(\S+))?$/.exec(t);
  if (source) {
    const [, title, url] = source;
    return url && /^https:\/\//.test(url) ? (
      <a className="badge badge-src" href={url} target="_blank" rel="noreferrer" title={url}>
        מקור: {title}
      </a>
    ) : (
      <span className="badge badge-src">מקור: {title}</span>
    );
  }
  const score = /^ציון\s*:\s*(.+)$/.exec(t);
  if (score) return <span className="badge badge-score">ציון {score[1]}</span>;
  if (t.startsWith("היפותטי")) return <span className="badge badge-hypo">{t}</span>;
  return <span className="badge">{t}</span>;
}
