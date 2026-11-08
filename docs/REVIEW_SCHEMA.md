# הביקורת השבועית: מבנה הדוח במסד הנתונים

הלשונית "ביקורת שבועית" בשתי האפליקציות (`src/labtabs/Reviews.tsx`, זהה בשתיהן) קוראת דוח שבועי שכותבת משימה מתוזמנת. בכל שבוע סוקרים בלתי תלויים (מהנדס בכיר, מומחה תחום) בודקים את השיעורים של השבוע, את התשובות של הלומד והכיול שלו, את מוצר החודש ואת מסלול "להוביל ולהחליט", ונותנים ציון מול יעדי התחומים (`docs/research/round5/expert/E2_domain_targets.json`, `LV2_benchmark.json`). כשיש ביקורת אנושית (מנטור, PR שמוזג, בנצ'מרק ציבורי, `E4_external_validation.md`), היא נכנסת לאותו דוח. הדף רק קורא.

## איפה כותבים

| מה | ArtifactData `collection` | `doc_id` | מי כותב |
|---|---|---|---|
| הדוח | `data/users/me/profile/reviews` | `2026-W44` (שבוע ISO של השבוע שנבדק: `YYYY-Www`) | המשימה, `set` |

- כל אפליקציה במסד שלה: גילואה https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k (תחומי `ENG · ...`), לנצ'סטר https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9 (תחומי `MIL · ...`, ומה שנלמד מ-ENG אם יש).
- רק הוספה: דוח של שבוע קודם לא נמחק. ריצה חוזרת על אותו שבוע כותבת שוב את אותו `doc_id`.
- גודל: עד 200 KB. הדף מונה את האוסף (עד 200 דוחות) ומציג את האחרון.
- את מה שהמשימה קוראת היא קוראת מהמסמכים שהדף כבר כותב: `data/users/me` (הזיכרון, `done`), `profile/modules`, `profile/convs` + `msgs` של השבוע (השיעורים והתשובות), `profile/notes`, `profile/products/<YYYY-MM>` (מוצר החודש, `src/labtabs/products.ts`), `profile/summaries`.

## הדוח: `reviews/<YYYY-Www>`

```ts
interface WeeklyReview {
  id: string;                         // = doc_id
  app: "eng" | "core";
  week: { from: string; to: string }; // ISO dates, ראשון עד שבת
  createdAt: number;                  // ms since epoch
  generator?: { sha?: string; runId?: string };
  summary: string;                    // Markdown עברי: השורה התחתונה, 2-4 משפטים
  trend?: "up" | "flat" | "down";
  scope?: { lessons: { moduleId: string; lesson: number; title: string }[]; answers: number; notes?: string };

  domains: {                          // רק התחומים שהשבוע נגע בהם, או שיש להם ראיה חדשה
    id: string;                       // ה-id המדויק מ-E2/LV2, למשל "ENG · Signals and systems"
    name: string;                     // name_he מ-LV2
    target: { knowledge?: string; fluency?: string; industry?: string };   // מ-LV2 target, בקיצור
    now:    { knowledge?: string; fluency?: string; industry?: string };   // ההערכה של השבוע, באותו סולם
    score: number;                    // 0-5, ראו הסולם למטה
    targetScore: number;              // 0-5
    delta?: number;                   // מול הדוח הקודם
    evidence: string;                 // על סמך מה: תשובה, תרגיל, מוצר (עברית, משפט או שניים)
    gap?: string;
    next?: string;                    // הצעד הבא בתחום
    confidence: "low" | "medium" | "high";
    reviewer?: string;                // id של סוקר מ-reviewers
  }[];

  reviewers: {
    id: string;
    persona: "senior_engineer" | "domain_expert" | "systems_lead" | "human";
    title: string;                    // "מומחה מכ\"ם ותקשורת"
    focus: string;                    // מה הוא בדק
    notes: string;                    // Markdown עברי: רשימה ממוספרת, קונקרטית, עם ציטוט מהתשובה כשצריך
    verdict?: string;                 // שורה אחת
  }[];

  calibration?: { predictions: number; brier?: number; confidentWrong: number; overconfident?: number; underconfident?: number; note: string };
  product?: { month: string /* YYYY-MM */; title?: string; stage: string; score: number /* 0-10 */; checklist?: { passed: number; total: number }; notes: string };
  leadDecide?: {                      // מסלול "להוביל ולהחליט" (NIGHT_PLAN P2-G)
    score: number;                    // 0-10
    items: { kind: "trade" | "architecture" | "review" | "agents"; title: string; score: number /* 0-10 */; note: string }[];
    note: string;
  };
  actions?: { text: string; domain?: string }[];   // עד 3 לשבוע הבא
  human?: { source: "mentor" | "pr" | "benchmark" | "exam"; title: string; url?: string; note: string }[];
  example?: true;                     // רק בדוגמאות של הבדיקות
}
```

### הסולם (0-5) לפס של כל תחום

סולם אחד לידע, לשטף ולתפקיד, כדי שהפס יהיה בר-השוואה:

| ציון | אקדמיה (LV2) | תעשייה |
|---|---|---|
| 1 | A1 | junior |
| 2 | A2 | mid |
| 3 | A3 | senior |
| 4 | A4 | expert |
| 5 | A5 / מעבר ל-MSc | principal |

`score` הוא ההערכה המשוקללת של השבוע (מותר שבר, למשל 1.6); `targetScore` הוא היעד של התחום ב-LV2 באותו סולם (A4 = 4, "A4–A5" = 4.5). הפס מציג את `score`, וקו אדום ב-`targetScore`. `now` ו-`target` מוצגים כטקסט כשפותחים את השורה.

### כללים לסוקרים

- כל ציון עם ראיה מהשבוע (`evidence`). תחום בלי ראיה חדשה לא נכנס.
- שני סוקרים לפחות, בלתי תלויים: כל אחד רואה רק את החומר שלו, לא את הטקסט של השני.
- `calibration`: מהתחזיות של הלומד לפני חישוב (בלוקי `predict` ו-commit-before-reveal) מול התוצאה; Brier כשיש הסתברויות.
- `product.checklist`: מול רשימת הבדיקה של הפרויקטים הטובים ב-GitHub (`src/labtabs/config.ts`, `GITHUB_CHECKLIST`, 9 סעיפים).
- בלנצ'סטר: משלב הנדסי וניתוחי, כמו בשיעורים (CLAUDE.md, "סירוב של Claude").
- הטון: ישיר, בלי שבחים ריקים, ובלי "לא" ו"חסר" כמסגור; מה שחשוב פשוט נכתב כצעד הבא.

## דוגמה

`core/app/tools/test/samples/review.json`, `eng/app/tools/test/samples/review.json` (עם `example: true`). הבדיקה המקומית מוסיפה אותם למסד המדומה כשהכתובת היא `test.html?seed`.

## כתיבה מהמשימה (ArtifactData)

```text
ArtifactData set  url=<כתובת האפליקציה>  collection="data/users/me/profile/reviews"  doc_id="2026-W44"  data=<WeeklyReview>
```
