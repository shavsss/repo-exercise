# המדף: שיעורים שנכתבו בלילה, ורמת התחומים

משימה מתוזמנת בלילה ("מפעל השיעורים", `docs/research/round2/A3_factory.md`) כותבת מראש את השיעור הבא או שניים בכל אפליקציה, בודקת אותם בבדיקה נפרדת ומניחה אותם על "המדף" במסד הנתונים של האפליקציה. כשהלומד פותח שיעור שעוד אין לו שיחה, והמדף מחזיק שיעור שנכתב בשבילו, הדף מציע "שיעור מוכן מהמדף". לחיצה הופכת אותו לשיחה של השיעור, בדיוק כמו שיעור שנכתב מראש בדף (`src/prefetch.ts`): הודעת "כתוב את שיעור N…" והשיעור הגמור עם `prefetched: true`. משם הכל כרגיל: `useSettlePrefetched` מסמן את השיעור כנלמד ומעדכן את זיכרון הקורס, ושאלות, פתקים, מחברת ו"המשך" עובדים כמו בכל שיעור. הקוד: `src/shelf.ts`, `src/components/ShelfOffer.tsx`, `src/shelf.css`, זהה בשתי האפליקציות. באותו לילה המשימה גם מעדכנת את הרמה החיה בכל תחום (`profile/levels`, למטה).

## איפה כותבים

| מה | ArtifactData `collection` | `doc_id` | מי כותב |
|---|---|---|---|
| שיעור על המדף | `data/users/me/profile/shelf` | `<moduleId>__<lessonIdx>`, למשל `M2.1__3` (האינדקס מ-0, כמו ב-`modules/<id>.lessons`) | המשימה (`set`); הדף רק מסמן `adopted` |
| המשך הטקסט | `data/users/me/profile/shelf/<moduleId>__<lessonIdx>/more` | `1`, `2`, … | המשימה |
| מצב הריצה | `data/users/me/profile/shelf` | `_status` | המשימה |
| בדיקת הכתיבה הראשונה | `data/users/me/profile/shelf` | `_probe` | המשימה, פעם אחת |
| הרמה החיה לכל תחום | `data/users/me/profile/levels` | `current` | המשימה |
| תמונת שבוע של הרמה | `data/users/me/profile/levels` | `YYYY-Www` | המשימה (אותו מסמך נכתב מחדש כל לילה באותו שבוע) |

- הכתובות: גילואה https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k, לנצ'סטר https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9. כל שיעור נכתב רק למסד של האפליקציה שלו.
- רק הוספה. המשימה לא נוגעת באף מסמך שהדף כותב (`modules`, `convs`, `notes`, `summaries`, `memory` ועוד), ולא מוחקת כלום. מסמך מדף עם `status: "adopted"` לא נכתב מחדש לעולם. מסמך `ready` שעוד לא נלקח מותר להחליף בגרסה טובה יותר, או לסמן `superseded` כשתוכנית המודול השתנתה.
- גודל: עד 230 KB למסמך. `text` עד 60,000 תווים; מה שמעבר לזה הולך ל-`more/<n>`, עד 70,000 תווים לכל אחד (עברית היא 2 בתים לתו, כלומר עד כ-140 KB). כותבים קודם את מסמכי `more`, ואחרון את המסמך הראשי, כדי שהדף לא יראה שיעור שחסרים לו חלקים.
- מספר המסמכים חסום: לכל היותר 2 שיעורים חדשים לכל אפליקציה בלילה, וכל אחד מסמך ראשי ועוד 0–2 מסמכי `more`. גם אחרי שנה זה פחות מ-2,500 מסמכים, הרבה מתחת ל-25,000. ב-`levels` יש מסמך אחד ועוד אחד לשבוע.

## השיעור: `shelf/<moduleId>__<lessonIdx>`

```ts
interface ShelfDoc {
  v: 1;
  app: "core" | "eng";
  moduleId: string;
  lesson: number;                 // אינדקס השיעור ב-profile/modules/<moduleId>.lessons, מ-0
  spec: {                         // הועתק כמו שהוא מ-profile/modules/<moduleId>.lessons[lesson]
    title: string;
    sources?: { doc: string; pages: [number, number] }[];
  };
  title: string;                  // = spec.title
  text: string;                   // ה-Markdown של השיעור (או החלק הראשון שלו כש-parts > 0), באותו פורמט שהמורה בדף כותב
  parts?: number;                 // כמה מסמכי more/<n> ממשיכים את הטקסט (0 או חסר: הכל ב-text)
  plan?: PartPlan;                // תוכנית החלקים, באותה צורה כמו PartPlan ב-src/tutor.ts
  words?: number;
  createdAt: number;              // ms since epoch
  pipeline?: string;              // "factory@<git sha קצר>" — בלי שם מודל
  verify?: {
    verdict: "pass" | "pass-with-notes";
    depth?: { results?: number; units?: number; l25Missing?: string[]; words?: number };
    facts?: { checked?: number; fixed?: number };      // מספרים שחושבו מחדש ב-Python
    sources?: { checked?: number; unsupported?: number };   // הפניות [[DOC:PAGE]] שנבדקו מול העמוד
    refusalSafe?: boolean;        // נבדק שהשיעור והתוכנית בשפה הנדסית וניתוחית (CLAUDE.md, "סירוב של Claude")
    notes?: string[];             // עברית, שורה לכל דבר שהבדיקה תיקנה או הוסיפה (עד 8 מוצגות)
  };
  status: "ready" | "adopted" | "superseded";
  adoptedAt?: number;             // נכתב בדף כשהלומד לוקח את השיעור
  convId?: string;                // נכתב בדף: השיחה שנוצרה ממנו
}

// shelf/<moduleId>__<lessonIdx>/more/<n>
{ text: string }
```

איך הדף משתמש בשדות:

- ההצעה מוצגת רק כשלשיעור אין שיחה (`modules/<id>.convs[idx]` ריק), `status` הוא `ready` (או חסר), ו-`spec.title` שווה לכותרת השיעור בתוכנית השמורה. כשיש `spec.sources`, גם הם צריכים להיות זהים לתוכנית השמורה (כולל עמודים שהדף צירף לשיעור). תוכנית שהשתנתה מסתירה את ההצעה בשקט. לכן מעתיקים את `spec` כמו שהוא מהמסמך של המודול.
- הכתיבה מראש בדף (`prefetch.ts`) מדלגת על שיעור שיש לו מסמך מדף מתאים, כדי לא לכתוב אותו פעמיים.
- כפתור "כתוב את שיעור N" נשאר: הלומד יכול תמיד לכתוב את השיעור בזמן אמת במקום.
- בלקיחה: נוצרת שיחה, נשמרות שתי ההודעות (`model: "shelf · <pipeline>"`, `prefetched: true`, `shelf: { id, createdAt, verdict }`), `convs[idx]` מתעדכן, והמסמך מקבל `status: "adopted"`, `adoptedAt`, `convId`. המסמך לא נמחק.
- `createdAt`, `words`, `verify.verdict`, `verify.facts.checked`, `verify.sources.checked` ו-`verify.notes` מוצגים בכרטיס ההצעה.

## `shelf/_status`

```ts
{ night: string /* YYYY-MM-DD */; lastRun: number; ok: boolean;
  built: string[];                               // ids שנכתבו הלילה
  skipped: { id: string; why: string }[];        // למשל "needs-live: refusal at write", "plan changed"
  probes?: { write: boolean; minutes: number; usageNote: string };
  usage: { lessons: number; minutes: number } }
```

לא מוצג בדף. נכתב אחרון בכל ריצה.

## הרמה החיה: `levels/current` ו-`levels/<YYYY-Www>`

```ts
interface LiveLevels {
  app: "core" | "eng";
  updatedAt: number;
  week: string;                                  // YYYY-Www
  domains: {
    id: string;                                  // ה-id המדויק מ-E2/LV2, למשל "MIL · Radar"
    name: string;                                // name_he מ-LV2
    score: number;                               // 0-5, אותו סולם כמו ב-REVIEW_SCHEMA (A1=1 … A5=5)
    targetScore: number;                         // היעד מ-LV2
    confidence: "low" | "medium" | "high";
    evidence: string;                            // עברית, משפט: על סמך מה (תשובות think, level3, כיול, מבחן)
    lastEvidenceAt?: number;
    trend?: "up" | "flat" | "down";              // מול תמונת השבוע הקודם
  }[];                                           // רק תחומים שיש להם ראיה; לכל היותר 36
  note?: string;                                 // עברית, שורה אחת
}
```

מסמך אחד שנכתב מחדש כל לילה, ועוד מסמך לשבוע (אותו תוכן, לגרף מגמה). הביקורת השבועית קוראת אותם כנקודת פתיחה, אבל נותנת ציון משלה.

## דוגמה ובדיקה

`core/app/tools/test/samples/shelf.json`, `eng/app/tools/test/samples/shelf.json`: שיעור מדף עם חלק המשך אחד. הבדיקה המקומית מוסיפה אותו לשיעור 2 של המודול בבדיקה כשהכתובת היא `test.html?seed`.

## כתיבה מהמשימה (ArtifactData)

```text
ArtifactData set  url=<כתובת האפליקציה>  collection="data/users/me/profile/shelf/M2.1__3/more"  doc_id="1"       data={ text }
ArtifactData set  url=<...>              collection="data/users/me/profile/shelf"             doc_id="M2.1__3" data=<ShelfDoc>
ArtifactData set  url=<...>              collection="data/users/me/profile/levels"            doc_id="current" data=<LiveLevels>
ArtifactData set  url=<...>              collection="data/users/me/profile/shelf"             doc_id="_status" data={ ... }
```

או `batch` אחד (עד 50 פעולות ועד 1 MiB), בסדר הזה. לפני `set` על מסמך מדף קיים: `get`, ואם `status` הוא `adopted`, לא כותבים.
