# השבועון: מבנה הגיליון במסד הנתונים

הלשונית "עיתון" בשתי האפליקציות (`src/labtabs/News.tsx`, זהה בשתיהן) קוראת גיליון שבועי שכותבת משימה מתוזמנת, אחת לכל אפליקציה. העיצוב והתהליך המלא ב-`docs/research/round4/news/N_design.md`; כאן החוזה המדויק בין המשימה לדף. גילואה היא עיתון הנדסי (בלי מקורות ביטחוניים); לנצ'סטר היא הצבאית-טכנית.

## איפה כותבים

| מה | ArtifactData `collection` | `doc_id` | מי כותב |
|---|---|---|---|
| הגיליון | `data/users/me/profile/news` | `2026-W44` (שבוע ISO: `YYYY-Www`) | המשימה, `set` |
| רשימת הגיליונות | `data/users/me/profile/news` | `_index` | המשימה, `set` (רשות, מומלץ) |
| מצב הריצה | `data/users/me/profile/news` | `_status` | המשימה, `set` (רשות) |
| מה הלומד קרא ודירג | `data/users/me/profile/newsfb` | אותו `YYYY-Www` | הדף בלבד |

- הכתובות: גילואה https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k, לנצ'סטר https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9. כל גיליון נכתב רק למסד של האפליקציה שלו.
- רק הוספה: גיליון של שבוע שכבר נכתב לא נמחק. ריצה חוזרת באותו שבוע כותבת שוב את אותו `doc_id` (`set` מחליף את כל המסמך). אסור לגעת ב-`newsfb`.
- גודל: עד 230 KB למסמך (מגבלת המסמך 256 KiB). 10–20 פריטים; שבוע דל נותן גיליון קצר (לפחות 6), לא מילוי.
- כשיש `_index`, הדף קורא ממנו את רשימת הגיליונות ולא טוען את כל האוסף. בלעדיו הדף מונה את האוסף (טוב לשבועות הראשונים). לכן אחרי כל גיליון מעדכנים את `_index` (הישן + החדש בראש).
- סדר הכתיבה: קודם הגיליון, אחר כך `_index`, ואחרון `_status`.

## הגיליון: `news/<YYYY-Www>`

```ts
interface NewsIssue {
  id: string;                    // = doc_id, "2026-W44"
  app: "eng" | "core";
  number: number;                // מספר רץ, מ-1
  window: { from: string; to: string };          // ISO "2026-10-23" .. "2026-10-29" (שישי עד חמישי)
  publishedAt: number;           // ms since epoch
  generator?: { sha?: string; runId?: string };  // הקומיט של news/RUNBOOK.md ומזהה הריצה
  snapshot?: { current: string | null; done: number; upcoming: string[] };   // מצב הלומד בזמן הכתיבה
  lead: string;                  // id של פריט מתוך items: הכתבה הראשית
  sections: { id: string; title: string; items: string[] }[];   // מדורים, בסדר התצוגה; items = ids
  picks10?: string[];            // 2-3 ids ל"לקרוא ב-10 דקות"
  items: NewsItem[];
  stats?: { candidates: number; fetched: number; verified: number; dropped?: Record<string, number> };
  example?: true;                // רק בדוגמאות של הבדיקות; הריצה האמיתית לא כותבת את זה
}

interface NewsItem {
  id: string;                    // ייחודי בגיליון, למשל "n1"
  kind: "paper" | "report" | "system" | "standard" | "data" | "event";
  domain: string;                // id של מדור
  headline: string;              // עברית
  dek: string;                   // שורת משנה, עברית
  body: string;                  // Markdown עברי, עד 220 מילים; משוואות ב-$…$
  why: string;                   // "למה זה חשוב לך": 1-3 שורות, Markdown
  certainty: "official" | "peer" | "preprint" | "single" | "corroborated" | "vendor" | "disputed";
  sanity?: { check: string; result: "pass" | "fail" | "na"; note: string };   // בדיקת סדר גודל
  sources: {                     // ממולא בקוד מתוך מה שנשלף השבוע, לא על ידי המודל
    url: string; title: string; publisher: string; tier: "A" | "B" | "C" | "D";
    publishedAt: string;         // ISO date
    fetchedAt?: number; httpStatus?: number; sha256?: string;
    quote?: string;              // ציטוט מילולי (עד 40 מילים) שנמצא בטקסט שנשלף
    openAccess?: boolean;
  }[];
  connects: { moduleId: string; rel: "learned" | "current" | "next" | "later" | "outside"; concept: string; why: string }[];
  textbookUpdate?: { book: string; page: number; edition: number; old: string; now: string; status: "superseded" | "refined" | "confirmed" };
  idea?: { title: string; kind: "project" | "product" | "article" | "interview"; pitch: string; hours: number; uses: string[] };
  read10?: { minutes: number };
  oldButNew?: true;              // מחוץ לחלון התאריכים, חדש ללומד (עד 2 בגיליון)
  crossRef?: { app: "eng" | "core"; issueId: string; itemId: string };   // אותה ידיעה בעיתון של האפליקציה השנייה
}
```

איך הדף משתמש בשדות:

- `connects[].moduleId` חייב להיות מודול קיים באינדקס של האפליקציה (`lib/index.json`). שבב החיבור פותח את המודול. הדף מעדכן את `rel` לפי ההתקדמות של היום: מודול שנלמד מאז מוצג "נלמד".
- `certainty` מוצג כתגית בצבע (רשמי, שפוט, מאמר לא שפוט, דיווח יחיד, מאומת בשני מקורות, טענת יצרן, שנוי במחלוקת). קישור arXiv אף פעם לא "peer".
- `sources[0]` נותן את רמת המקור, התאריך והציטוט; כל המקורות מוצגים כקישורים.
- פריט שמופיע ב-`sections` אבל לא ב-`items` מדולג בשקט. `lead` לא חוזר בתוך המדורים בתצוגה.
- שמות המדורים באים מהגיליון, לא מהקוד. גילואה: מתמטיקה ופיזיקה, אותות ובקרה, תקשורת, אלקטרוניקה ושבבים, הספק ואנרגיה, תרמו זרימה ואווירו, מבנים וחומרים, ML/AI ורובוטיקה, הנדסת מערכות ותקנים, חלל כהנדסה. לנצ'סטר: מכ"ם ול"א, טילים והגנה אווירית, חלל, כטב"מים ואוטונומיה, עלות ובדיקות, מודלים מבצעיים ותקנים.

## `news/_index` ו-`news/_status`

```ts
// news/_index — הגיליונות, החדש ראשון
{ issues: { id: string; number: number; window: { from: string; to: string }; lead: string /* כותרת הכתבה הראשית */; count: number }[] }

// news/_status — לא מוצג בדף; לבדיקה ולמשימה הבאה
{ lastRun: number; ok: boolean; issueId: string | null; counts: Record<string, number>;
  dropped: Record<string, number>; refusals: { source: string; stage: string }[]; usageEstimate?: string }
```

## מה הדף כותב: `newsfb/<YYYY-Www>`

```ts
{ openedAt?: number;                                    // הפעם הראשונה שהגיליון נפתח (הנקודה על הלשונית נעלמת)
  items: { [itemId: string]: { read?: number /* ms, 0 = לא נקרא */; useful?: -1 | 0 | 1; saved?: boolean } } }
```

המשימה קוראת את ארבעת ה-`newsfb` האחרונים כדי לכוונן מקורות ותחומים (לכל היותר ±20% בשבוע, N_design §1.4).

## דוגמה

גיליון לדוגמה לכל אפליקציה: `core/app/tools/test/samples/news.json`, `eng/app/tools/test/samples/news.json` (עם `example: true`). הבדיקה המקומית מוסיפה אותם למסד המדומה כשהכתובת היא `test.html?seed`.

## כתיבה מהמשימה (ArtifactData)

```text
ArtifactData set   url=<כתובת האפליקציה>  collection="data/users/me/profile/news"  doc_id="2026-W44"  data=<NewsIssue>
ArtifactData set   url=<...>              collection="data/users/me/profile/news"  doc_id="_index"    data={ issues: [...] }
ArtifactData set   url=<...>              collection="data/users/me/profile/news"  doc_id="_status"   data={ ... }
```

או `batch` אחד עם שלוש פעולות `set`. לפני הכתיבה: בדיקת סכמה, ids של מודולים קיימים, וגודל (`N_design` §1.10).
