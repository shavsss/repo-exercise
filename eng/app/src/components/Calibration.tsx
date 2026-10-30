// "איפה אני בטוח ונכון": the calibration of the think questions, shown quietly under the course
// memory. Information about quality, not a score: no single summary number and no trend over time,
// so there is nothing to improve by pressing "guessing". The sure-and-wrong questions are listed,
// newest first, because they are the best ones to go back to. Same file in both labs.
import { useEffect, useState } from "react";
import { allCalib, calibTable, CONF_LABEL, type CalibRecord, type Conf } from "../events";
import "../consult.css";

export function CalibView({ onOpen }: { onOpen?: (moduleId: string, lesson: number) => void }) {
  const [list, setList] = useState<CalibRecord[] | null>(null);
  useEffect(() => {
    let alive = true;
    allCalib()
      .then((l) => alive && setList(l))
      .catch(() => alive && setList([]));
    return () => {
      alive = false;
    };
  }, []);
  if (!list) return null;
  const t = calibTable(list);
  const hot = list.filter((r) => r.conf === 3 && r.grade === "wrong").sort((a, b) => b.ts - a.ts);
  return (
    <section className="calib" aria-label="תמונת כיול">
      <h3 className="calib-h">איפה אני בטוח ונכון</h3>
      {list.length === 0 ? (
        <p className="calib-note">בשאלות "עצרו וחשבו" בוחרים כמה אתה בטוח לפני שהתשובה נפתחת. כאן תופיע התמונה: איפה היית בטוח וצדקת, איפה בטוח וטעית, ואיפה ניחשת.</p>
      ) : (
        <>
          <table className="calib-table">
            <thead>
              <tr>
                <th />
                <th>צדקתי</th>
                <th>בחלקו</th>
                <th>טעיתי</th>
                <th>בלי סימון</th>
              </tr>
            </thead>
            <tbody>
              {([3, 2, 1] as Conf[]).map((c) => (
                <tr key={c}>
                  <th>{CONF_LABEL[c]}</th>
                  <td>{t[c].right}</td>
                  <td>{t[c].partial}</td>
                  <td className={c === 3 && t[c].wrong ? "is-hot" : ""}>{t[c].wrong}</td>
                  <td className="is-muted">{t[c].open}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="calib-note">טעות בביטחון היא המקום הכי טוב ללמוד ממנו: היא נזכרת ומתוקנת טוב יותר מכל טעות אחרת.</p>
          {hot.length > 0 && (
            <ul className="calib-hot">
              {hot.slice(0, 12).map((r) => (
                <li key={r.id}>
                  <button className="link" onClick={() => onOpen?.(r.moduleId, r.lesson)} disabled={!onOpen}>
                    {r.moduleId} · {r.lesson < 0 ? "מבחן מסכם" : `שיעור ${r.lesson + 1}`}
                  </button>{" "}
                  {r.q.length > 160 ? r.q.slice(0, 160) + "…" : r.q}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
