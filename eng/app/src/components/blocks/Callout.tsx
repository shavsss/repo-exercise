import type { ReactNode } from "react";
import { Markdown } from "../Markdown";
import { Icon } from "../Icon";

/** Block kinds: label, line icon, and the frame color (a CSS token per kind). */
export const CALLOUTS: Record<string, { label: string; icon: string }> = {
  plan: { label: "מקום השיעור בתוכנית", icon: "plan" },
  story: { label: "פתיחה", icon: "story" },
  history: { label: "רקע: מי, מתי ולמה", icon: "history" },
  definition: { label: "הגדרה", icon: "formula" },
  formula: { label: "נוסחת מפתח", icon: "formula" },
  refresh: { label: "רענון כלי", icon: "refresh" },
  domain: { label: "חיבור לתחום", icon: "domain" },
  fieldmap: { label: "איפה הנוסחה עובדת", icon: "domain" },
  casestudy: { label: "מקרה הנדסי", icon: "casestudy" },
  model: { label: "בניית מודל", icon: "model" },
  erratum: { label: "תיקון", icon: "erratum" },
  fieldsystems: { label: "מערכות בשטח", icon: "fieldsystems" },
  today: { label: "העולם של היום", icon: "fieldsystems" },
  derivation: { label: "גזירה", icon: "formula" },
  coverage: { label: "בדיקת כיסוי", icon: "coverage" },
  keep: { label: "לסיכום: מה צריך לזכור", icon: "coverage" },
};

export const FIELDS: Record<string, string> = {
  signals: "אותות ומערכות",
  control: "בקרה ושערוך",
  probability: "הסתברות ואינפורמציה",
  linalg: "אלגברה לינארית ואופטימיזציה",
  fields: "משוואות שדה וסימולציה",
  electronics: "אלקטרוניקה",
  motors: "מנועים והנעה",
  thermo: "תרמודינמיקה ואנרגיה",
  heat: "מעבר חום",
  aero: "זורמים ואווירונאוטיקה",
  structures: "מבנים וחומרים",
  ml: "למידת מכונה",
  rl: "למידה מחיזוקים",
  robotics: "רובוטיקה",
  computing: "מחשוב ואלגוריתמים",
  comms: "תקשורת",
  physics: "פיזיקה מודרנית",
  chips: "שבבים",
  systems: "הנדסת מערכות",
  other: "תחום נוסף",
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

/** A dashed frame with a label tab; the color depends on the kind. */
export function Frame({ kind, label, icon, title, meta, children }: { kind: string; label: string; icon: string; title?: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <section className={`block block-${kind}`} data-block={kind}>
      <header className="block-head">
        <span className="block-tab">
          <Icon name={icon} size={15} />
          {label}
        </span>
        {title && (
          <h4 className="block-title">
            <Markdown text={title} inline />
          </h4>
        )}
      </header>
      {meta && <div className="block-meta">{meta}</div>}
      <div className="block-body">{children}</div>
    </section>
  );
}

export function Callout({ kind, headers, children }: { kind: string; headers: Record<string, string>; children: ReactNode }) {
  const def = CALLOUTS[kind];
  let label = def.label;
  if (kind === "domain") label = `חיבור: ${FIELDS[headers.field?.toLowerCase() ?? ""] ?? headers.field ?? FIELDS.other}`;
  if (kind === "today" && headers.asof) label = `העולם של היום · ידע עד ${headers.asof}`;
  const meta = [headers.who, headers.when, headers.company].filter(Boolean).join(" · ");
  return (
    <Frame
      kind={kind}
      label={label}
      icon={def.icon}
      title={headers.title ?? (kind === "fieldmap" ? headers.formula : undefined)}
      meta={
        meta || headers.first || headers.page ? (
          <>
            {meta && <Markdown text={meta} inline />}
            {headers.first && (
              <span>
                נפגשנו לראשונה: <Markdown text={headers.first} inline />
              </span>
            )}
            {headers.page && <Markdown text={`[[${headers.page.replace(/^\[\[|\]\]$/g, "")}]]`} inline />}
          </>
        ) : undefined
      }
    >
      {children}
    </Frame>
  );
}
