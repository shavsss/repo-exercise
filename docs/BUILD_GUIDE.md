# איך נבנתה מעבדת הלמידה (ואיך לבנות עוד אפליקציה כזו)

המסמך מתעד את הבנייה עד הפרט האחרון: מה נבנה, למה כל החלטה התקבלה, אילו מגבלות של claude.ai גילינו בדרך, ומה צריך כדי לחזור על זה במאגר חדש. בסוף יש הנחיה מוכנה להדבקה לסשן חדש של Claude Code.

---

## 1. התמונה הכללית

| שכבה | מה יש בה |
|---|---|
| **דף** | אפליקציית React שנבנית ל-JS אחד ול-CSS אחד, ומתפרסמת כ-Artifact פרטי ב-claude.ai, תמיד באותה כתובת |
| **Claude** | `claude.use("sample")`. הקריאה רצה על החשבון של מי שצופה, ולכן אין מפתח API ואין שרת |
| **נתונים** | `claude.use("db")` ו-`claude.use("user")`. כל משתמש מקבל תיקייה פרטית `data/users/<id>/...` |
| **תוכן גדול** (הספרים) | קובצי JSON שמתפרסמים ליד הדף (`books/*.json`) ונקראים ב-`fetch` יחסי |
| **גיבוי** | משימה מתוזמנת ב-Claude Code שקוראת את ה-db עם ArtifactData, כותבת MD ו-JSON, ועושה commit לענף `study-notes` |

### למה Artifact ולא שרת

הגרסה הראשונה הייתה Express עם Anthropic SDK. היא עבדה, אבל דרשה מפתח API, הרצה מקומית ותשלום נפרד. ב-Artifact הקריאות ל-Claude נספרות מהמנוי, הנתונים נשמרים בענן של claude.ai, והקישור עובד מכל מכשיר. המחיר הוא כמה מגבלות (סעיף 3), ובשבילן נבנו הפתרונות שבסעיף 5.

---

## 2. מבנה הקבצים

```
app/
  artifact/index.html        הדף שמתפרסם (בלי doctype/head; הכלי עוטף אותו)
  artifact/books/*.json      הטקסט המחולץ של הספרים: {pages:[{pdf,label,text}]}
  src/main.tsx               נקודת כניסה; dir="rtl" ו-lang="he" על <html>
  src/App.tsx                מצב האפליקציה: שיחות, שליחה, טיוטות, זיכרון
  src/runtime.ts             עטיפה ל-claude.use: sample / db / user, ומחלקת Store
  src/tutor.ts               כל הקריאות ל-Claude: הקשר, היסטוריה, כלים, שיעור בחלקים, זיכרון
  src/prompt.ts              ההנחיות למורה (כללי הלימוד ופרוטוקול התצוגה)
  src/books.ts               קטלוג, טעינה, חילוץ PDF (pdf.js), קריאה וחיפוש
  src/segments.ts            הודעות שמורות → פריטי תצוגה; ספירת מילים ובדיקת רף
  src/components/            Sidebar, Hud, Composer, Message, BookViewer, MemoryPanel, FlowField
  src/components/blocks/     Callout, Think, Exercise, DataBlocks (chart/table), Interactive, Mermaid, SvgBlock, Badge
  src/styles.css             כל העיצוב (טוקנים בהיר/כהה)
  scripts/escape-bundle.mjs  תיקון אחרי build (סעיף 3)
  tools/backup/export.mjs    db → notes/*.md + backup/db
  tools/test/stub.js         runtime מדומה לבדיקות מקומיות
  tools/test/make-harness.mjs  בונה test.html עם ה-stub
  vite.config.ts             build לקובץ אחד
```

---

## 3. מה שגילינו על Artifacts (המגבלות, והתגובה לכל אחת)

| מגבלה | מה עשינו |
|---|---|
| סקריפטים חיצוניים רק מ-cdnjs, jsdelivr/npm, unpkg; סגנונות רק מ-Google Fonts; `fetch` חיצוני חסום | הכול נארז ב-bundle. pdf.js נטען מ-cdnjs רק כשצריך. גופנים מ-Google Fonts. גופני KaTeX מוטמעים ב-CSS (`assetsInlineLimit: () => true`) |
| הפרסום דוחה קבצים עם התו U+FFFD | `scripts/escape-bundle.mjs` מחליף אותו ב-`�` אחרי build. ספריות markdown משתמשות בו בכוונה |
| `confirm()`, `alert()` ו-`prompt()` לא עובדים | אישור בתוך הדף (למשל "מחק / ביטול" בשורת השיחה) |
| ל-`sample` אין system prompt | ההנחיות נשלחות כ"תור משתמש" ראשון בכל קריאה |
| `sample` לא זוכר כלום בין קריאות | כל קריאה בונה מחדש: הנחיות, זיכרון קורס, היסטוריה שנכנסת, והתור החדש |
| קלט עד 256KB לכל קריאה (כולל תוצאות כלים) | תקציב של 170KB להיסטוריה. ההודעות הישנות נחתכות ראשונות, וזיכרון הקורס משלים את מה שנחתך |
| כל סבב מוגבל לכ-5 דקות; תשובה ארוכה נקטעת (`truncated`) | שיעור נכתב בחלקים (סעיף 5.2), ותשובה שנקטעת ממשיכה לבד (5.3) |
| כלים: מספר סבבים קטן, תוצאה עד 32KB לכלי | כלים מעטים: read_book_pages (כ-8 עמודים), search_book, compute, record_progress. העמודים שסביב המיקום נשלחים מראש בהקשר, כדי לחסוך סבבים |
| אין Python ואין אינטרנט בתוך הדף | חישובים ב-math.js, גם בכלי `compute` וגם בגרפים ובטבלאות, שמוגדרים כביטויים והדף מחשב אותם |
| מסמך db עד 256KB; עד 25,000 מסמכים; זוגיות נתיבים (זוגי = מסמך, אי-זוגי = אוסף) | מסמך לכל הודעה: `data/users/<id>/profile/convs/<cid>/msgs/<mid>` |
| `data/users/<id>` פרטי לגמרי, גם מהבעלים; `<id>` = `await user.id()` | צריך להצהיר על `user` ליד `db` |
| הצופה קובע את ערכת הצבעים (`data-theme` על השורש) | אין מתג צבעים בדף. `theme.ts` מאזין ל-`data-theme` ול-`prefers-color-scheme` |
| `localStorage`/IndexedDB רק לנוחות מקומית | רק לבחירות קטנות (ספר פעיל, מצב, תרגילים שנפתרו). כל מה שחשוב שמור ב-db |

---

## 4. הבנייה, צעד אחר צעד

### 4.1 שלד

```bash
npm create vite@latest app -- --template react-ts   # או ידנית כמו כאן
cd app
npm i react react-dom react-markdown remark-gfm remark-math rehype-katex katex mathjs recharts mermaid dompurify
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/dompurify @types/node
```

### 4.2 build לקובץ אחד: `vite.config.ts`

```ts
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    assetsInlineLimit: () => true,        // גופנים ותמונות בתוך ה-CSS/JS
    cssCodeSplit: false,
    rolldownOptions: {
      input: "src/main.tsx",
      output: { inlineDynamicImports: true, entryFileNames: "app.js", assetFileNames: "app[extname]" },
    },
  },
});
```

ב-`package.json`: `"build": "vite build && node scripts/escape-bundle.mjs"`.

### 4.3 הדף: `artifact/index.html`

בלי `<!doctype>`, `<html>`, `<head>` ו-`<body>`, כי כלי הפרסום מוסיף אותם:

```html
<title>שם קצר</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=…&display=swap">
<link rel="stylesheet" href="app.css">
<style>html,body,#root{height:100%}</style>
<div id="root" dir="rtl" lang="he"></div>
<script type="module" src="app.js"></script>
```

### 4.4 החיבור ל-runtime: `src/runtime.ts`

הדפוס:

```ts
const use = (n) => window.claude?.use(n).catch(() => null) ?? Promise.resolve(null);
const [sample, db, user] = await Promise.all([use("sample"), use("db"), use("user")]);
const uid = user ? await user.id() : null;
const store = db && uid ? new Store(db, uid) : null;   // null → האפליקציה עובדת בלי שמירה
```

- כל יכולת יכולה להיות `null`. הדף מציג הודעה ולא נשבר.
- `Store` עוטף את הנתיבים: `profile` (התקדמות וזיכרון), `convs`, `msgs`. מנויים (`onSnapshot`) נפתחים פעם אחת בלבד, ב-`useEffect`.
- כתיבה אחת בכל פעם לכל מסמך. כאן זה נעשה עם שרשרת promise.

### 4.5 הקריאה ל-Claude: `src/tutor.ts`

```ts
sample([{ role: "user", content: SYSTEM_PROMPT }, ...history, { role: "user", content: studyContext + text }], {
  model: "claude-opus-5-5", modelTier: "complex", effort,   // מודל בשם רק כי המשתמש ביקש אותו
  signal, tools, onText: ({ text }) => render(text),         // text = כל התשובה עד עכשיו
});
```

- `onText` מקבל את **כל** הטקסט עד עכשיו, ולכן מציבים אותו ולא מוסיפים.
- `tools`: לכל כלי `name`, `description`, `inputSchema` ו-`execute`. `execute` רץ בדף ומחזיר נתונים קטנים, ושגיאה זורקים.
- עם `tools` אסור `cache` (מלבד `false`).
- שגיאות מגיעות כ-`{code, message, text?}`. מטפלים לפי `code`, ולא מנסים שוב בלולאה.

### 4.6 התצוגה

- Markdown עם KaTeX (`remark-math` + `rehype-katex`). מעטפת RTL, ו-`.katex { direction: ltr }`.
- **בלוקים מותאמים:** fence עם שם (```` ```story ````), כותרות `@key: value` בראש הבלוק, וגוף Markdown. הרכיב `pre` ב-react-markdown מנתב לפי השפה.
- **תגיות בתוך הטקסט** (`[[ודאות: גבוהה]]`): לפני הפענוח הן הופכות ל-inline code עם סימן, ונצבעות כ-pill.
- **גרפים וטבלאות:** JSON עם ביטויי math.js, והדף מחשב את הערכים. כך אי אפשר "להקליד" מספר לגרף.
- **אינטראקטיבי:** מחוונים, ועקומים מפורשים, פרמטריים או מובלעים (marching squares) ב-SVG.

---

## 5. הפתרונות שחשובים לכל אפליקציה כזו

### 5.1 הנחיות כתור ראשון, והקשר בתור האחרון

ההנחיות קבועות. כל מה שמשתנה (תאריך, מיקום בספר, זיכרון, עמודים) נכנס לבלוק `<study_context>` בתחילת התור האחרון, וההנחיות אומרות למודל להתייחס אליו כמצב של האפליקציה.

### 5.2 תוכן ארוך: תכנון ואז חלקים (`composeLesson`)

1. קריאת `sample.json` עם כלים, שמחזירה תוכנית: חלקים עם כותרת, מה כל חלק מכסה, אילו בלוקים יופיעו, יעד מילים, ועובדות מחושבות.
2. קריאה נפרדת לכל חלק. כל אחת מקבלת את התוכנית ואת כל הטקסט שנכתב עד עכשיו, עם הוראה להמשיך מהמשפט האחרון בלי לחזור על כלום.
3. החלק האחרון סוגר: תרגילים, מוצר, משפט על ההודעה הבאה, ו-`record_progress`.

ככה האורך מובטח בתוכנית, ואף קריאה לא מתקרבת למגבלת הזמן.

### 5.3 המשך אוטומטי

אם `truncated: true`, נשלחת קריאה נוספת: ההיסטוריה, התשובה החלקית כתור assistant, והוראת "המשך בדיוק מהמקום שנעצרת". התוצאה מצורפת להודעה. עד 4 חלקים.

### 5.4 טיוטות ושחזור

- כל תשובה נשמרת כמסמך עם `draft: true`: מיד בהתחלה, אחרי התוכנית, אחרי כל חלק, וכל 8 שניות של טקסט.
- טיוטה שנמצאת בפתיחה = תשובה שנקטעה. "המשך" קורא ל-`generate` עם `resume`: בשיעור הוא ממשיך מהחלק `partsDone` לפי אותה `plan`, ובתשובה רגילה ממשיך את הטקסט.
- בסיום הטיוטה הופכת להודעה רגילה (`draft`, `plan` ו-`partsDone` נמחקים).

### 5.5 זיכרון מתגלגל

אחרי כל שיעור, קריאה קצרה (`modelTier: "default"`) מקבלת את הזיכרון הקיים ואת השיעור, ומחזירה זיכרון מעודכן עם סעיפים קבועים. הזיכרון נשמר ב-`profile.memory`, נשלח בכל בקשה, ואפשר לערוך אותו בממשק.

### 5.6 שיחה לכל סעיף

"השיעור הבא" פותח שיחה חדשה, חוץ מכשהסעיף האחרון נשמר עם "(חלק k/n)" ו-k קטן מ-n. ההיסטוריה נשארת קצרה, והרציפות עוברת דרך הזיכרון.

---

## 6. בדיקה מקומית

```bash
cd app
npm run build
node tools/test/make-harness.mjs /tmp/harness
cd /tmp/harness && python3 -m http.server 5190     # http://localhost:5190/test.html
```

ה-stub מחקה את `sample` (כולל `json` וכלים), את `db` (נשמר ב-localStorage בין טעינות, כך שאפשר לבדוק סגירה ופתיחה) ואת `user`. את המסלולים בדקנו עם Playwright (מותקן מראש בסביבת הענן):

- טעינת PDF ומספור עמודים
- שיעור בחלקים, כולל חלק שנקטע וממשיך
- שמירת התקדמות וזיכרון
- סגירה באמצע ושחזור
- גרף וטבלה מחושבים

ה-stub לא מחליף בדיקה אמיתית ב-claude.ai, כי אישורי ההרשאה, מגבלות הזמן והתוכן האמיתי של Claude קיימים רק שם.

---

## 7. פרסום

עם כלי Artifact של Claude Code:

| פעולה | מה עושים |
|---|---|
| פרסום ראשון | `file_path: app/artifact/index.html`, `files: {"app.js": "app/dist/app.js", "app.css": "app/dist/app.css", "books/x.json": "…"}`, `capabilities: {sample: {images: true}, db: {}, user: {}}`, `icon: "book"`, `description` |
| עדכון | אותו `file_path` באותו סשן, או `url` של ה-Artifact מסשן אחר (אחרי `action: "read"`). בלי `capabilities` ובלי `icon`, כדי שיישמרו. קבצים שלא שולחים נשארים מהגרסה הקודמת |
| בדיקה אחרי פרסום | ArtifactData `list` על `data/users/me` (המילה `me` מתורגמת ל-id שלך) |

---

## 8. גיבוי לגיט

- **הסקריפט:** `tools/backup/export.mjs <dump> <repo>` כותב `notes/MEMORY.md`, `notes/PROGRESS.md`, `notes/lessons/*.md` ו-`backup/db/`.
- **המשימה המתוזמנת** (create_trigger, סשן חדש בכל הפעלה) מריצה כל לילה:
  1. checkout לענף `study-notes`.
  2. ArtifactData `list` עם `out_dir` לפרופיל, לשיחות ולהודעות.
  3. הרצת הסקריפט.
  4. commit ו-push, רק אם משהו השתנה.

פרטים בקובץ [BACKUP.md](BACKUP.md).

---

## 9. אפליקציה חדשה: מאגר חדש או כאן?

- **אותו סוג אפליקציה (מורה) לספרים או נושאים אחרים:** עדיף להישאר כאן ולהרחיב את אותה אפליקציה:
  - מוסיפים ספר ל-`BOOKS` ב-`src/books.ts`, ואת ה-JSON שלו ל-`artifact/books/`. הסקריפט `git show 50578ee:app/scripts/extract-books.mjs` מחלץ PDF בעזרת `pdftotext`.
  - אם צריך כללים שונים לנושא, מוסיפים את זה כ"סוג קורס" ב-`prompt.ts`.
  - הזיכרון, הגיבוי והשחזור כבר עובדים, ונשארים בכתובת אחת.
- **אפליקציה מסוג אחר:** מאגר חדש. מעתיקים את `app/` כנקודת פתיחה, מוחקים את `books.ts`, `prompt.ts` ו-`tutor.ts`, ושומרים את `runtime.ts`, `vite.config.ts`, `scripts/`, `tools/test/` ואת דפוסי סעיף 5.

---

## 10. הנחיה מוכנה לסשן חדש

```text
אני רוצה לבנות אפליקציה חדשה כ-Artifact ב-claude.ai, באותה שיטה כמו מעבדת הלמידה.
קרא קודם את המדריך: https://github.com/shavsss/repo-exercise/blob/claude/compassionate-meitner-dx0zxf/docs/BUILD_GUIDE.md
ואת הקוד ב-app/ באותו ענף (runtime.ts, tutor.ts, vite.config.ts, scripts/, tools/test/).

האפליקציה: <תיאור: מה היא עושה, למי, מה נשמר>.
דרישות קבועות:
- Artifact פרטי שמתפרסם תמיד לאותה כתובת; Claude רק דרך claude.use("sample") עם model "claude-opus-5-5"; אין מפתח API.
- נתונים ב-db עם user, תחת data/users/<id>/.
- תוכן ארוך: תכנון ואז חלקים; המשך אוטומטי כשתשובה נקטעת; שמירת טיוטות והמשך אחרי סגירת דפדפן.
- זיכרון מתגלגל שנשלח בכל בקשה; גיבוי לילי לגיט כ-MD.
- עברית ו-RTL, בהיר וכהה, נייד; עיצוב צבעוני ברמה של מעבדת הלמידה.
- בדיקה מקומית עם ה-stub ו-Playwright לפני כל פרסום; CLAUDE.md ו-docs/ מעודכנים.
```
