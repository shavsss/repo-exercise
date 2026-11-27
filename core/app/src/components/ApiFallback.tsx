import { useState } from "react";
import { apiReason, loadFallback, saveFallback } from "../fallback";

// The #api page (identical in both apps): the Claude API key for the fallback, the weekly budget of
// subscription calls, and where calls go now. The key is kept only in this browser.
export function ApiFallback() {
  const [s, setS] = useState(loadFallback);
  const [key, setKey] = useState("");
  const [budget, setBudget] = useState(String(s.weeklyBudget || ""));
  const reason = apiReason(s);
  const save = () => setS(saveFallback({ ...(key.trim() ? { apiKey: key.trim() } : {}), weeklyBudget: Math.max(0, Number(budget) || 0) }));
  const row = { display: "flex", gap: 8, alignItems: "center", margin: "10px 0" } as const;
  return (
    <div dir="rtl" style={{ maxWidth: 760, margin: "32px auto", padding: "0 16px", lineHeight: 1.7 }}>
      <h2>גיבוי ל-Claude API</h2>
      <p>
        כשהשימוש השבועי עובר 90% מהתקציב, או כשמתקבלת שגיאת מכסה (429), הבקשות עוברות ל-Claude API עם המפתח שלך (בתשלום לפי שימוש). המפתח נשמר רק בדפדפן
        הזה. השבוע מתאפס ביום ראשון.
      </p>
      <div style={row}>
        <label style={{ minWidth: 150 }}>מפתח API</label>
        <input type="password" dir="ltr" style={{ flex: 1 }} value={key} onChange={(e) => setKey(e.target.value)} placeholder={s.apiKey ? `שמור (…${s.apiKey.slice(-4)})` : "sk-ant-…"} />
      </div>
      <div style={row}>
        <label style={{ minWidth: 150 }}>תקציב שבועי (בקשות)</label>
        <input type="number" min={0} dir="ltr" style={{ width: 120 }} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0" />
        <span>0 = רק שגיאת מכסה מעבירה</span>
      </div>
      <div style={row}>
        <button onClick={save}>שמירה</button>
        {s.apiKey && <button onClick={() => setS(saveFallback({ apiKey: "" }))}>מחיקת המפתח</button>}
        {s.apiUntil > Date.now() && <button onClick={() => setS(saveFallback({ apiUntil: 0 }))}>חזרה למנוי עכשיו</button>}
      </div>
      <p>
        השבוע (מ-{s.week}): {s.subCalls} בקשות במנוי{s.weeklyBudget ? ` מתוך ${s.weeklyBudget} (${Math.round((100 * s.subCalls) / s.weeklyBudget)}%)` : ""}, {s.apiCalls} ב-API.
        <br />
        עכשיו הבקשות הולכות ל: <b>{reason ? `Claude API (${reason})` : s.apiKey ? "המנוי" : "המנוי (אין מפתח, אין גיבוי)"}</b>
      </p>
      <p>
        <a href="#">חזרה לאפליקציה</a>
      </p>
    </div>
  );
}
