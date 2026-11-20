# השבועון: מבנה הגיליון במסד הנתונים

הלשונית "עיתון" בשתי האפליקציות (`src/labtabs/News.tsx`, זהה בשתיהן) קוראת גיליון שבועי שכותבת משימה מתוזמנת, אחת לכל אפליקציה. העיצוב והתהליך המלא ב-`docs/research/round4/news/N_design.md`; כאן החוזה המדויק בין המשימה לדף. גילואה היא עיתון הנדסי (בלי מקורות ביטחוניים); לנצ'סטר היא הצבאית-טכנית.

## איפה כותבים

| מה | ArtifactData `collection` | `doc_id` | מי כותב |
|---|---|---|---|
| הגיליון | `data/users/me/profile/news` | `2026-W44` (שבוע ISO: `YYYY-Www`) | המשימה, `set` |
| רשימת הגיליונות | `data/users/me/profile/news` | `_index` | המשימה, `set` (רשות, מומלץ) |
| מצב הריצה | `data/users/me/profile/news` | `_status` | המשימה, `set` (רשות) |
| הטקסט המלא של כתבה (העמוד הפנימי) | `data/users/me/profile/newstext` | `<YYYY-Www>__<item id>`, למשל `2026-W47__n12` | המשימה, `set` |
| מה הלומד קרא ודירג | `data/users/me/profile/newsfb` | אותו `YYYY-Www` | הדף בלבד |

- הכתובות: גילואה https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k, לנצ'סטר https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9. כל גיליון נכתב רק למסד של האפליקציה שלו.
- רק הוספה: גיליון של שבוע שכבר נכתב לא נמחק. ריצה חוזרת באותו שבוע כותבת שוב את אותו `doc_id` (`set` מחליף את כל המסמך). אסור לגעת ב-`newsfb`.
- גודל: עד 230 KB למסמך (מגבלת המסמך 256 KiB), גם לגיליון וגם לכל טקסט מלא. מהדורת סוף שבוע (מ-20.11): 50–80 פריטים, כולל המבט העולמי; שבוע דל נותן גיליון קצר (לפחות 8), לא מילוי. תמונות אף פעם לא בתוך המסמך (ראו "תמונות" למטה).
- כשיש `_index`, הדף קורא ממנו את רשימת הגיליונות ולא טוען את כל האוסף. בלעדיו הדף מונה את האוסף (טוב לשבועות הראשונים). לכן אחרי כל גיליון מעדכנים את `_index` (הישן + החדש בראש).
- סדר הכתיבה: קודם הטקסטים המלאים (`newstext`, ב-batch), אחר כך הגיליון, אחר כך `_index`, ואחרון `_status`. כך פריט עם `full` לא מופיע לפני שהטקסט שלו נשמר.

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
  edition?: string;              // שם המהדורה בראש העמוד, למשל "מהדורת סוף שבוע"
  example?: true;                // רק בדוגמאות של הבדיקות; הריצה האמיתית לא כותבת את זה
}

interface NewsItem {
  id: string;                    // ייחודי בגיליון, למשל "n1"
  kind: "paper" | "report" | "system" | "standard" | "data" | "event";
  domain: string;                // id של מדור
  headline: string;              // עברית
  dek: string;                   // שורת משנה, עברית
  body: string;                  // Markdown עברי; משוואות ב-$…$. כשיש full: הפתיחה שמוצגת בעמוד הראשי (lead 150–250 מילים, השאר 60–150). בלי full (גיליון ישן, number, post): הגוף כולו
  why: string;                   // הערת העורך בשוליים: הקשר לחומר הלימוד, 1-3 שורות, Markdown
  certainty: "official" | "peer" | "preprint" | "single" | "corroborated" | "vendor" | "disputed";
  sanity?: { check: string; result: "pass" | "fail" | "na"; note: string };   // בדיקת סדר גודל
  sources: {                     // ממולא בקוד מתוך מה שנשלף השבוע, לא על ידי המודל
    url: string; title: string; publisher: string; tier: "A" | "B" | "C" | "D";
    publishedAt: string;         // ISO date
    fetchedAt?: number; httpStatus?: number; sha256?: string;
    quote?: string;              // ציטוט מילולי (עד 40 מילים) שנמצא בטקסט שנשלף
    openAccess?: boolean;
    license?: string;            // הרישיון כפי שנכתב בדף שנשלף (CC BY 4.0, Public domain…); חובה כש-full הוא translation
    stateMedia?: boolean;        // כלי תקשורת ממשלתי (שינחואה, TRT, RT, IRNA, CGTN…): מוצג עם תגית, והפריט חייב מקור נוסף ובלתי תלוי
  }[];
  connects: { moduleId: string; rel: "learned" | "current" | "next" | "later" | "outside"; concept: string; why: string }[];
  textbookUpdate?: { book: string; page: number; edition: number; old: string; now: string; status: "superseded" | "refined" | "confirmed" };
  idea?: { title: string; kind: "project" | "product" | "article" | "interview"; pitch: string; hours: number; uses: string[] };
  read10?: { minutes: number };
  oldButNew?: true;              // מחוץ לחלון התאריכים, חדש ללומד (עד 2 בגיליון)
  crossRef?: { app: "eng" | "core"; issueId: string; itemId: string };   // אותה ידיעה בעיתון של האפליקציה השנייה

  // המהדורה המודפסת (כל השדות רשות; גיליון בלעדיהם מוצג כמו קודם)
  role?: "lead" | "feature" | "brief" | "number" | "world" | "geo" | "econ" | "post" | "lab" | "globe";
  full?: "translation" | "walkthrough" | "report";          // יש טקסט מלא ב-newstext/<issue>__<id>, ובאיזה אופן (ראו "הטקסט המלא")
  region?: "US" | "EU" | "UK" | "IL" | "TR" | "CN" | "TW" | "JP" | "KR" | "IN" | "RU" | "UA" | "GULF" | "IR" | "AF" | "INTL";
  images?: { url: string; caption: string; credit: string; license: string; sourcePage: string; alt?: string }[];
  chart?: {
    kind: "bar" | "line";
    title: string; unit: string;
    x: (string | number)[];                                  // קטגוריות (bar) או ערכי ציר x (line), לפי הסדר
    series: { name: string; values: (number | null)[] }[];   // 1–3 סדרות, כל אחת באורך x
    source: { publisher: string; url: string; note?: string };   // url חייב להיות אחד מ-sources[] של הפריט
  };
  post?: { network: "x" | "bluesky" | "mastodon"; handle: string; author: string; text: string; url: string; postedAt?: string };
  number?: { value: string; unit: string; calc: string };   // מספר השבוע: הערך, היחידה, והחישוב (Markdown, $…$)
  world?: { topic: string; pair: string };                  // "מבט מהעולם": שני פריטים על אותו נושא משתי מדינות; pair = ה-id של השני
}
```

### המהדורה המודפסת: role ומה מוצג איפה

| role | איפה בדף | כמה בגיליון |
|---|---|---|
| `lead` | העמוד הראשון, רחב, עם תמונה, גוף פתוח והערת העורך בשוליים. אותו id כמו `lead` של הגיליון | 1 |
| `feature` | עמודת הצד של העמוד הראשון: כתבות עומק, נפתחות במקום | 3–4 |
| `brief` (או בלי role) | המדורים, 3 עמודות עם קו כותרת | רוב הגיליון |
| `number` | "מספר השבוע" בעמודת הצד: `number.value` גדול, `headline` כתווית, `number.calc` כחישוב | 1 |
| `world` | "מבט מהעולם": זוג פריטים מ-`region` שונים עם אותו `world.topic` | 1–2 זוגות |
| `geo` | "הפינה הגאופוליטית" (לנצ'סטר בלבד): ניתוח מקורות פתוחים, בלי מעקב מבצעי | 1–2 |
| `econ` | "כלכלת הטכנולוגיה" (גילואה בלבד) | 1–2 |
| `lab` | "מהמעבדות": מחקר מקבוצה או ממעבדה, קצר | 2–4 |
| `globe` | "מבט עולמי": הסיפורים המרכזיים של השבוע, מדינה אחר מדינה (לפי `region`, בסדר ארה"ב, סין, אירופה, בריטניה, רוסיה, הודו, יפן, קוריאה, טייוואן, ישראל, אוקראינה, טורקיה, המפרץ, איראן, אפריקה). כותרת ושורת משנה, ולחיצה פותחת את הכתבה בעמוד פנימי | 2–4 לכל מדינה מרכזית, 20–35 בסך הכל |
| `post` | "ברשתות": פוסט מ-X, Bluesky או Mastodon, מצוטט מילה במילה מדף שנטען בריצה (`post.text` מופיע בטקסט שנשלף; `sources[0].url` = `post.url`) | 0–4 |

- פריטים עם role של פינה (`number`, `world`, `geo`, `econ`, `lab`, `post`, `globe`) לא חייבים להופיע ב-`sections`; הדף מציג אותם בפינות ולא במדורים. `lead` ו-`feature` מופיעים במדור שלהם אבל לא חוזרים שם בתצוגה.
- גיליון בלי role בכלל (W45, W46): שני הפריטים הראשונים אחרי הכתבה הראשית עולים לעמודת הצד, והשאר במדורים.
- `region`: ארה"ב (`US`) לכל היותר 40% מהפריטים. `INTL` לגוף בין-לאומי (ITU, IEA, ארגון תקינה).

### הטקסט המלא: `newstext/<YYYY-Www>__<item id>` (מ-20.11)

לחיצה על כתבה פותחת אותה בעמוד פנימי משלה, כמו באתר חדשות. כשלפריט יש `full`, העמוד טוען את המסמך הזה ומציג אותו במקום `body`, עם שורה שאומרת באיזה אופן הוא כתוב. בלי `full` העמוד מציג את `body`.

```ts
interface NewsFull {
  body: string;                                     // Markdown עברי, משוואות ב-$…$; עד 230 KB
  mode: "translation" | "walkthrough" | "report";   // זהה ל-full של הפריט
}
```

הטקסט המלא אינו סיכום. סיכום של מאמר או כתבה בשתי פסקאות לא עומד בדרישה (הלומד, 20.11): עוברים על המקור רעיון אחר רעיון ופסקה אחר פסקה, בסדר שלו ובסגנון הכתיבה שלו, ולא משמיטים שום דבר מרכזי. שלושה אופנים, לפי הרישיון של המקור:

| mode | מתי | מה כותבים |
|---|---|---|
| `translation` | רק כשהרישיון מתיר תרגום ושימוש חוזר: נחלת הכלל (למשל עבודות של הממשל הפדרלי בארה"ב), CC0, CC BY, CC BY-SA, הודעה רשמית לעיתונות או הצהרה ממשלתית. הרישיון נרשם ב-`sources[0].license` מתוך הדף שנשלף | תרגום מלא לעברית, פסקה מול פסקה, באותו טון ובאותו סדר |
| `walkthrough` | מאמר, דוח, תקן או מסמך ארוך, בכל רישיון | מעבר על המקור סעיף אחר סעיף ורעיון אחר רעיון, בסדר שלו: לכל רעיון פסקה אחת או יותר, עם הטיעון, המשוואות, המספרים והאיורים שהוא נשען עליהם, ומה המחברים עצמם אומרים על המגבלות. במילים שלנו, עם ציטוטים קצרים (עד 40 מילים כל אחד) |
| `report` | כתבה חדשותית מכלי תקשורת מסחרי (זכויות יוצרים) | כתבה עברית מלאה בסגנון עיתונאי, שמכסה כל עובדה, טענה, מספר, אדם בשם והסתייגות של המקור, בסדר שבו הם מופיעים בו, פסקה כנגד פסקה בתוכן. במילים שלנו, לא תרגום צמוד, עם ציטוטים קצרים ומיוחסים |

- אורך: לפי המקור, לא לפי תבנית. `report` הוא בערך 70–100% מאורך המקור, ולפחות 300 מילים. `walkthrough` הוא לפחות פסקה לכל סעיף או רעיון של המקור (בדרך כלל 800–2500 מילים). מקור שארוך מ-230 KB גם אחרי זה: הסעיפים העיקריים במלואם, ושורה לכל סעיף שנשאר, עם הפניה למקור.
- המקור עצמו (`sources[0].url`) מופיע בראש העמוד הפנימי ובסופו, כדי שאפשר יהיה לקרוא אותו במלואו.
- כל משפט עובדתי בטקסט המלא עובר את אותה בדיקה כמו `body`: נתמך בטקסט שנשלף, מספרים מדויקים.
- לכל הפריטים חוץ מ-`number` ו-`post` יש טקסט מלא כשהמקור נשלף במלואו. מקור שנחסם בחומת תשלום: אין `full`, ו-`body` כותב רק את מה שנשלף.

### תמונות

- תמונה רלוונטית לנושא, לא חייבת להיות מהכתבה עצמה: Wikimedia Commons, NASA, ESA, NOAA, DVIDS (לנצ'סטר בלבד), אתרי ממשל עם נחלת הכלל. רק רישיון חופשי (נחלת הכלל, CC0, CC BY, CC BY-SA) או תמונה רשמית ששימוש בה מותר עם קרדיט. `credit`, `license` ו-`sourcePage` (דף הקובץ שממנו ירדה) חובה; `caption` אומר מה רואים, ו"להמחשה" כשהתמונה לא מהאירוע עצמו.
- ה-CSP של Artifact חוסם תמונות מאתרים חיצוניים, ולכן הדף מציג רק `url` שמתחיל ב-`/_blob/` (מאגר הקבצים של ה-Artifact), נתיב יחסי לקובץ שפורסם עם הדף, או `data:image/`. כל `url` אחר לא מוצג.
- הדרך של המשימה: מורידים את הקובץ (עדיף גרסה מוקטנת, רוחב 800–1200 פיקסלים, JPEG עד כ-250KB), ומעלים אותו למאגר הקבצים: `Artifact` publish עם `url` של האפליקציה, `file_path` של התמונה ו-`asset: true` (בשתי האפליקציות יש הרשאת `assets`). התוצאה נותנת `url` מהצורה `/_blob/<id>`, ואותו כותבים ב-`images[].url` כמו שהוא. אותו מנגנון משמש לתמונות בסיכומים ולדיוקנאות ב"מה קראתי" (`src/labtabs/portraits.ts`).
- לא מכניסים תמונה כ-data URI לתוך הגיליון (מגבלת 230KB). הדוגמאות של הבדיקות משתמשות ב-SVG קטן כ-data URI רק כי בבדיקה המקומית אין מאגר קבצים.

### גרפים

- רק ממספרים שמופיעים בטקסט שנשלף בריצה (טבלה, דוח, מאגר נתונים). `chart.source.url` הוא אחד מ-`sources[]` של הפריט; אסור להשלים, לאמוד או "להחליק" ערכים. ערך חסר הוא `null`.
- הדף מצייר SVG בשחור-לבן (עד 3 סדרות), עם כותרת, יחידה ושורת מקור.

איך הדף משתמש בשדות:

- `region` ו-`stateMedia` מוצגים בשורת התגיות הקטנה של הפריט (למשל "סין · תקשורת ממשלתית").

- `connects[].moduleId` חייב להיות מודול קיים באינדקס של האפליקציה (`lib/index.json`). שבב החיבור פותח את המודול. הדף מעדכן את `rel` לפי ההתקדמות של היום: מודול שנלמד מאז מוצג "נלמד".
- `certainty` מוצג כמילה בשורת התגיות (רשמי, שפוט, מאמר לא שפוט, דיווח יחיד, מאומת בשני מקורות, טענת יצרן, שנוי במחלוקת). קישור arXiv אף פעם לא "peer".
- `sources[0]` נותן את רמת המקור, התאריך והציטוט; כל המקורות מוצגים כקישורים, ומקור ממשלתי מסומן.
- פריט שמופיע ב-`sections` אבל לא ב-`items` מדולג בשקט. `lead`, `feature` ופריטי הפינות לא חוזרים בתוך המדורים בתצוגה.
- `why` ו-`connects` מוצגים כהערת עורך בשוליים ("לחומר הלימוד"); שבבי המודולים פותחים את המודול, ונוסחאות בשם המודול מוצגות כנוסחאות.
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

גיליון לדוגמה לכל אפליקציה: `core/app/tools/test/samples/news.json`, `eng/app/tools/test/samples/news.json` (עם `example: true`; בכל אחת מופיע כל שדה של המהדורה המודפסת). הבדיקה המקומית מוסיפה אותם למסד המדומה כשהכתובת היא `test.html?seed`.

## כתיבה מהמשימה (ArtifactData)

```text
ArtifactData set   url=<כתובת האפליקציה>  collection="data/users/me/profile/news"  doc_id="2026-W44"  data=<NewsIssue>
ArtifactData set   url=<...>              collection="data/users/me/profile/news"  doc_id="_index"    data={ issues: [...] }
ArtifactData set   url=<...>              collection="data/users/me/profile/news"  doc_id="_status"   data={ ... }
```

או `batch` אחד עם שלוש פעולות `set`. לפני הכתיבה: בדיקת סכמה, ids של מודולים קיימים, וגודל (`N_design` §1.10).
