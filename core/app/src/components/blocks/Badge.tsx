// Inline [[...]] tags other than source pages: certainty, hypothetical, external source, score.
export function Badge({ text }: { text: string }) {
  const t = text.trim();
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
