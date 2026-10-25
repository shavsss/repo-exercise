import type { ReactNode } from "react";
import { Markdown } from "../Markdown";

export const CALLOUTS: Record<string, { icon: string; label: string; tone: string }> = {
  plan: { icon: "🗺️", label: "מפת הסעיף", tone: "ink" },
  story: { icon: "📜", label: "סיפור פתיחה", tone: "amber" },
  history: { icon: "🕰️", label: "רקע: מי, מתי ולמה", tone: "violet" },
  formula: { icon: "∑", label: "נוסחת מפתח", tone: "blue" },
  refresh: { icon: "🔁", label: "רענון כלי", tone: "yellow" },
  domain: { icon: "✨", label: "תחום נוסף", tone: "teal" },
  casestudy: { icon: "🔬", label: "מקרה בוחן", tone: "cyan" },
  model: { icon: "🧩", label: "בניית מודל", tone: "lime" },
  erratum: { icon: "⚠️", label: "טעות בספר", tone: "red" },
  product: { icon: "🏭", label: "מוצר בעולם האמיתי", tone: "pink" },
};

export const FIELDS: Record<string, { icon: string; label: string; tone: string }> = {
  engineering: { icon: "⚙️", label: "הנדסה", tone: "orange" },
  cs: { icon: "💻", label: "מדעי המחשב", tone: "blue" },
  ai: { icon: "🧠", label: "בינה מלאכותית", tone: "violet" },
  physics: { icon: "⚛️", label: "פיזיקה", tone: "cyan" },
  medicine: { icon: "🩺", label: "רפואה", tone: "pink" },
  economics: { icon: "📈", label: "כלכלה", tone: "lime" },
  finance: { icon: "💹", label: "פיננסים", tone: "lime" },
  cyber: { icon: "🛡️", label: "סייבר", tone: "red" },
  biology: { icon: "🧬", label: "ביולוגיה", tone: "teal" },
  chemistry: { icon: "⚗️", label: "כימיה", tone: "yellow" },
  military: { icon: "🎖️", label: "צבא", tone: "ink" },
  art: { icon: "🎨", label: "אמנות", tone: "amber" },
  other: { icon: "✨", label: "תחום נוסף", tone: "teal" },
};

/** Leading "@key: value" lines of a fenced block, then the Markdown body. */
export function parseHeaders(src: string) {
  const headers: Record<string, string> = {};
  const lines = src.split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^@(\w+):\s*(.*)$/.exec(lines[i].trim());
    if (!m) break;
    headers[m[1]] = m[2];
  }
  return { headers, body: lines.slice(i).join("\n").trim() };
}

export function Callout({ kind, headers, children }: { kind: string; headers: Record<string, string>; children: ReactNode }) {
  let { icon, label, tone } = CALLOUTS[kind];
  if (kind === "domain") ({ icon, label, tone } = FIELDS[headers.field?.toLowerCase()] ?? FIELDS.other);
  const meta = [headers.who, headers.when, headers.company, headers.page && `עמ' ${headers.page}`].filter(Boolean);
  return (
    <section className={`callout callout-${kind} tone-${tone}`} data-block={kind}>
      <header className="callout-head">
        <span className="pill pill-solid">
          <span className="pill-icon">{icon}</span>
          {label}
        </span>
        {headers.title && (
          <h4 className="callout-title">
            <Markdown text={headers.title} inline />
          </h4>
        )}
      </header>
      {meta.length > 0 && (
        <div className="callout-meta">
          <Markdown text={meta.join(" · ")} inline />
        </div>
      )}
      {headers.first && (
        <div className="callout-meta callout-first">
          🔙 נפגשנו לראשונה: <Markdown text={headers.first} inline />
        </div>
      )}
      <div className="callout-body">{children}</div>
    </section>
  );
}
