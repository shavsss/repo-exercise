export function Badge({ text }: { text: string }) {
  const t = text.trim();
  const certainty = /^ודאות\s*:\s*(.+)$/.exec(t);
  if (certainty) {
    const v = certainty[1].trim();
    const tone = v.startsWith("גבוה") ? "high" : v.startsWith("בינוני") ? "mid" : "low";
    const dots = tone === "high" ? 3 : tone === "mid" ? 2 : 1;
    return (
      <span className={`badge badge-cert cert-${tone}`} title="רמת ודאות">
        <span className="cert-dots">{"●".repeat(dots) + "○".repeat(3 - dots)}</span> ודאות {v}
      </span>
    );
  }
  const source = /^מקור\s*:\s*([^|]+?)\s*(?:\|\s*(\S+))?$/.exec(t);
  if (source) {
    const [, title, url] = source;
    return url ? (
      <a className="badge badge-src" href={url} target="_blank" rel="noreferrer" title={url}>
        🔗 {title}
      </a>
    ) : (
      <span className="badge badge-src">🔗 {title}</span>
    );
  }
  const page = /^עמ['׳]?\s*(.+)$/.exec(t);
  if (page)
    return (
      <span className="badge badge-page" title="העמוד בספר המודפס">
        📄 עמ' <bdi dir="ltr">{page[1]}</bdi>
      </span>
    );
  if (t.startsWith("מהספר")) return <span className="badge badge-book">📘 {t}</span>;
  if (t.startsWith("תוספת")) return <span className="badge badge-add">➕ {t}</span>;
  if (t.startsWith("היפותטי")) return <span className="badge badge-hypo">≈ {t}</span>;
  return <span className="badge">{t}</span>;
}
