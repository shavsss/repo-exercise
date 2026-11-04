// The line that says whether the open lesson was checked against its sources (lessonAudit.ts), and for a lesson
// written before the check existed, the button that checks it and adds what is missing as a supplement at its end.
// In the book the line floats over the pages, so once the check is done it says so for a few seconds and goes.
// Same file in both apps.
import { useEffect, useState } from "react";
import type { AuditMark } from "../lessonAudit";

const COUNT: Record<string, string> = { missing: "חסרים", thin: "דלים", deferrals: "הפניות", questions: "שאלות", keep: "לסיכום", errors: "טעויות" };

export function AuditBar({ mark, running, status, onRun, fade }: { mark?: AuditMark; running: boolean; status?: string; onRun?: () => void; fade?: boolean }) {
  const [gone, setGone] = useState<number | string | null>(null);
  const at = mark?.at ?? 0;
  useEffect(() => {
    if (!fade || !at || running) return;
    const t = setTimeout(() => setGone(at), 8000);
    return () => clearTimeout(t);
  }, [fade, at, running]);
  if (running)
    return (
      <div className="audit-bar is-running" role="status">
        <b>בודק את השיעור מול המקור</b>
        <span>{status || "קורא את השיעור ואת עמודי המקור"}</span>
      </div>
    );
  if (!mark)
    return onRun ? (
      <div className="audit-bar is-todo" role="note">
        <b>השיעור הזה עוד לא נבדק מול המקור.</b>
        <span>הבדיקה קוראת אותו מול עמודי המקור ותוכנית הלימודים, ומוסיפה בסופו השלמה לכל מה שחסר, דל, הופנה בטעות או לא הוכן לשאלה, ובלוק "לסיכום" מלא.</span>
        <button className="btn small primary" onClick={onRun}>
          בדוק והשלם
        </button>
      </div>
    ) : null;
  // over the pages it is a passing word; the full line (and "בדוק שוב") stays in the scrolling view
  if (fade && gone === at) return null;
  const found = Object.entries(mark.counts ?? {})
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${COUNT[k] ?? k}: ${n}`)
    .join(" · ");
  const how = mark.verdict === "pass" ? "לא נמצא חוסר" : mark.verdict === "fixed" ? (mark.mode === "supplement" ? "ההשלמה בסוף השיעור" : "תוקן לפני הקריאה") : `תוקן בחלקו: אחרי ${mark.rounds} סבבים חלק מהממצאים נשארו`;
  return (
    <div className={`audit-bar is-done v-${mark.verdict}`} role="note" title={found || undefined}>
      <b>נבדק מול המקור</b>
      <span>
        {how}
        {found ? ` (נמצאו: ${found})` : ""}
      </span>
      {mark.verdict === "partly" && onRun && (
        <button className="link" onClick={onRun}>
          בדוק שוב
        </button>
      )}
      {mark.verdict === "partly" && !!mark.open?.length && !fade && (
        <details className="audit-open">
          <summary>מה עוד פתוח ({mark.open.length})</summary>
          <ul>
            {mark.open.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
