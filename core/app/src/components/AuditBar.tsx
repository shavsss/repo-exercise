// The line that says whether the open lesson was checked against its sources (lessonAudit.ts), and for a lesson
// written before the check existed, the button that checks it and adds what is missing as a supplement at its end.
// Same file in both apps.
import type { AuditMark } from "../lessonAudit";

const COUNT: Record<string, string> = { missing: "חסרים", thin: "דלים", deferrals: "הפניות", questions: "שאלות", keep: "לסיכום", errors: "טעויות" };

export function AuditBar({ mark, running, status, onRun }: { mark?: AuditMark; running: boolean; status?: string; onRun?: () => void }) {
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
  const found = Object.entries(mark.counts ?? {})
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${COUNT[k] ?? k}: ${n}`)
    .join(" · ");
  const how = mark.verdict === "pass" ? "לא נמצא חוסר" : mark.verdict === "fixed" ? (mark.mode === "supplement" ? "ההשלמה בסוף השיעור" : "תוקן לפני הקריאה") : "תוקן בחלקו: חלק מהממצאים נשארו";
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
    </div>
  );
}
