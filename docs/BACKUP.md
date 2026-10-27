# גיבוי וזיכרון

## שתי שכבות של זיכרון

1. **זיכרון הקורס באפליקציה:** אחרי כל שיעור על סעיף, קריאה קצרה ל-Claude ממזגת את השיעור לתוך מסמך הזיכרון. המסמך כולל מה נלמד, כלים ומושגים עם המספר מהדוגמה הראשונה, סימונים, מקרי בוחן ותחומים שכבר שימשו, טעויות בספר, וקשיים והעדפות. המורה מקבל אותו בכל בקשה, ולכן גם שיחה חדשה יודעת מה היה קודם. אפשר לצפות בו ולערוך אותו מהכפתור 🧠 במדף.
2. **המחברת בגיט:** משימה מתוזמנת ב-Claude Code מייצאת כל לילה את מסד הנתונים של ה-Artifact לקובצי MD במאגר.

## הגיבוי הלילי

- **מתי:** כל לילה ב-22:47, שעון ישראל.
- **לאן:** הענף `study-notes` במאגר הזה.
- **שלבים:**
  1. קריאת המסמכים עם הכלי ArtifactData, עם `out_dir`, לתיקייה זמנית:
     - `data/users/me` (הפרופיל, כולל ההתקדמות והזיכרון)
     - `data/users/me/profile/convs` (השיחות)
     - `data/users/me/profile/convs/<cid>/msgs` לכל שיחה (ההודעות)
  2. `node app/tools/backup/export.mjs <dump> .` כותב:
     - `notes/MEMORY.md`, `notes/PROGRESS.md` ו-`notes/README.md`
     - `notes/lessons/*.md`, קובץ לכל שיחה
     - `backup/db/`, עותק JSON גולמי
  3. commit ו-push, רק אם משהו השתנה.
- שיחה שנמחקה באפליקציה נמחקת גם מ-`notes/lessons`, אבל נשארת בהיסטוריה של git.

## שחזור

אם מסד הנתונים של ה-Artifact אבד, אפשר לבקש מ-Claude Code: "שחזר את מעבדת הלמידה מ-`backup/db`". זה נעשה עם ArtifactData `batch` (עד 50 מסמכים בכל קריאה). כל קובץ `backup/db/<collection>/<doc>.json` חוזר ל-`<collection>` עם `doc_id` = שם הקובץ, ו-`data/users/me` מפנה לחשבון שלך.

## מעבדת הליבה

מעבדת הליבה היא Artifact נפרד עם מסד נתונים משלו, ולכן יש לה גיבוי משלה, באותה שיטה:

- **מתי:** כל לילה ב-23:13, שעון ישראל (אחרי הגיבוי של מעבדת הלמידה).
- **לאן:** אותו ענף `study-notes`, בתיקייה `core/`, כדי שהמחברות לא יתערבבו.
- **מה:** הפרופיל, המודולים, מחברת השיעורים (`profile/notes`), הסיכומים (`profile/summaries`, לקובץ `core/notes/SUMMARIES.md`), מחברת השרטוטים והפתרונות (`profile/scratch`, לקובץ `core/notes/SCRATCH.md`, וכל שרטוט כקובץ SVG ב-`core/notes/scratch/`) והשיחות. הסקריפט והתוכנית נלקחים בכל ריצה מענף הפיתוח.
- **שלבים:**
  1. ArtifactData `list` עם `out_dir`, מה-Artifact של מעבדת הליבה (הכתובת ב-`CLAUDE.md`):
     - `data/users/me` (הפרופיל: זיכרון, מודולים שנלמדו, מודול נוכחי)
     - `data/users/me/profile/modules` (חלוקת השיעורים וההתקדמות בכל מודול)
     - `data/users/me/profile/convs`, ואחר כך `data/users/me/profile/convs/<cid>/msgs` לכל שיחה
  2. `node core/app/tools/backup/export.mjs <dump> .` כותב:
     - `core/notes/MEMORY.md`, `core/notes/PROGRESS.md` (טבלה לכל חלק: מצב, שיעורים, ציון) ו-`core/notes/README.md`
     - `core/notes/lessons/*.md`, קובץ לכל שיחה, לפי מודול ושיעור
     - `core/backup/db/`, עותק JSON גולמי
  3. commit ו-push, רק אם משהו השתנה.
- **שחזור:** כמו במעבדת הלמידה, עם ArtifactData `batch` מתוך `core/backup/db` אל ה-Artifact של מעבדת הליבה.

## גילואה

גם לגילואה (מעבדת ההנדסה) גיבוי משלה, באותה שיטה:

- **מתי:** כל לילה ב-23:37, שעון ישראל.
- **לאן:** הענף `study-notes`, בתיקייה `eng/`.
- **מה:** כמו בלנצ'סטר: `data/users/me`, `profile/modules`, `profile/notes`, `profile/summaries`, `profile/scratch`, `profile/convs` וההודעות, ואז `node eng/app/tools/backup/export.mjs <dump> .`, שכותב את `eng/notes/` (כולל `SUMMARIES.md`, `NOTEBOOK.md`, ו-`SCRATCH.md` עם השרטוטים כ-SVG ב-`scratch/`) ואת `eng/backup/db/`.
