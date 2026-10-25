# repo-exercise: הקשר לעבודה עם Claude

מאגר אישי ללימוד מתמטיקה ופיזיקה מתוך ספרים, ומעבדת הלמידה: מורה פרטי שרץ כ-Artifact ב-claude.ai.

## מה יש כאן

| נתיב | מה זה |
|---|---|
| `library/math-physics/` | הספרים: Mathematics: Its Content, Methods and Meaning (כרכים 1–3) והרצאות פיינמן (כרכים I–III) |
| `library/military/` | הליבה הצבאית: ספרים ממוספרים, מאמרים, דוקטרינה ותוכנית הלימודים (`syllabus/`). מפתח ב-`library/README.md` |
| `core/` | לנצ'סטר (מעבדת הליבה): אפליקציה נפרדת שמלמדת את `library/military/`. ראו [`core/app/README.md`](core/app/README.md) |
| `docs/CORE_LAB_PLAN.md` | החלטות התכנון והעיצוב של מעבדת הליבה |
| `docs/CORE_TEACHING_RULES.md` | כללי הלימוד של מעבדת הליבה, בעברית |
| `library/engineering/` | ספריית ההנדסה: הספרים (`books/`, E01–E26) ותוכנית הלימודים (`syllabus/`, 316 מודולים). מפתח ב-`library/engineering/README.md` |
| `eng/` | גילואה (מעבדת ההנדסה): אפליקציה שלישית, על הקוד של מעבדת הליבה. ראו [`eng/app/README.md`](eng/app/README.md) |
| `docs/ENG_LAB_PLAN.md` | החלטות התכנון והעיצוב של מעבדת ההנדסה |
| `docs/ENG_TEACHING_RULES.md` | כללי הלימוד של מעבדת ההנדסה (רמה 2.5), בעברית |
| `shared/scene3d/` | רכיב התלת-ממד המשותף: מנוע, ספריית סצנות בדוקות ופורמט המפרט של המורה |
| `app/` | קוד האפליקציה (React + Vite), ראו [`app/README.md`](app/README.md) |
| `app/src/prompt.ts` | ההנחיות שהמורה מקבל בכל קריאה, כולל כללי הלימוד |
| `app/artifact/` | הדף שמתפרסם, והטקסט המחולץ של הספרים (`books/*.json`) |
| `docs/TEACHING_RULES.md` | כללי הלימוד של הלומד, בעברית |
| `docs/BACKUP.md` | איך עובדים הגיבוי והזיכרון, ואיך משחזרים |
| `docs/BUILD_GUIDE.md` | איך האפליקציה נבנתה, מגבלות ה-Artifact, ואיך לבנות עוד אחת |
| `app/tools/test/` | runtime מדומה ובונה דף בדיקה מקומי |
| `notes/` | המחברת: זיכרון הקורס, התקדמות, וכל שיחה כקובץ MD (נוצר אוטומטית) |
| `backup/db/` | עותק גולמי של מסד הנתונים של ה-Artifact, לשחזור מלא |

## האפליקציה

- כתובת קבועה: https://claude.ai/artifact/GQEfh2pKMGTUE5ARKh5rPb. כל עדכון מתפרסם לאותה כתובת. מתוך שיחה אחרת מפרסמים עם `url` הזה, אחרי `action: "read"`.
- פרסום: `cd app && npm run build`, ואז Artifact publish של `app/artifact/index.html` עם הקבצים `app.js` ו-`app.css` מ-`app/dist/`. הקבצים `books/*.json` כבר מפורסמים ונשמרים בין גרסאות, ומפרסמים אותם מחדש רק אם הם משתנים. ההרשאות: `sample` (עם תמונות), `db` ו-`user`.
- אין שרת ואין מפתח API. Claude נקרא דרך `claude.use("sample")` עם `model: "claude-opus-5-5"`.
- שיעור על סעיף נכתב בחלקים: קריאת תכנון (JSON עם 3–5 חלקים, לפחות 4200 מילים) ואחריה קריאה לכל חלק. ראו `composeLesson` ב-`app/src/tutor.ts`.
- תשובה נשמרת כטיוטה בזמן שהיא נכתבת: אחרי התכנון, אחרי כל חלק, וכל 8 שניות של טקסט. הטיוטה נשמרת עם `draft: true`, ובשיעור גם `plan` ו-`partsDone`. טיוטה שנמצאת בפתיחה מוצגת כתשובה שנקטעה, וכפתור "המשך" ממשיך אותה במקום (`resumeLast` ב-`app/src/App.tsx`), בלי לתכנן מחדש.
- זיכרון הקורס נשמר במסמך `data/users/<id>/profile` (שדה `memory`), מתעדכן אחרי כל שיעור, ונשלח למורה בכל בקשה.

## לנצ'סטר (מעבדת הליבה)

- כתובת קבועה: https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9. אפליקציה נפרדת ממעבדת הלמידה, ולא מפרסמים אחת לכתובת של השנייה.
- הקוד ב-`core/app/`, וההנחיות למורה ב-`core/app/src/prompt.ts`. כל שינוי בכללים נעשה גם שם וגם ב-`docs/CORE_TEACHING_RULES.md`.
- הספרייה בדף (`core/app/artifact/lib/`) נוצרת מה-PDF: `core/tools/extract/extract.py` ואז `core/tools/pack.py`. התוצרים לא ב-git; אם `core/build/` חסר, מריצים את החילוץ מחדש.
- פרסום: `cd core/app && npm run build`, ואז Artifact publish של `core/app/artifact/index.html` עם `app.js` ו-`app.css` מ-`dist/`. קבצי `lib/` כבר מפורסמים ונשמרים בין גרסאות, ומפרסמים אותם מחדש רק אם הם משתנים (בכמה פעימות, עד 64MB לפעימה). האיורים ותמונות העמודים של SMAD נמצאים במאגר הקבצים של ה-Artifact, והכתובות שלהם ב-`core/tools/asset_urls.json` (BUILD_GUIDE, סעיף 11.5). ההרשאות: `sample` (עם תמונות), `db`, `user`, `assets` ו-`downloads` (ייצוא מחברת השיעור).
- תצוגת קריאה (כפתור Aa): גופן, גודל, ריווח, רוחב, רקע ומצב ריכוז, ב-`src/reading.ts` וב-`src/reading.css`. בשיעור: פס התקדמות, חזרה למקום שבו הפסיקו לקרוא (לכל שיעור, בדפדפן), ותוכן שיעור צף עם זמן הקריאה שנשאר (`src/components/ReadingAids.tsx`). אותו קוד בשתי האפליקציות.
- תלת-ממד: בלוק `scene3d` מהרכיב המשותף `shared/scene3d/` (אותו קוד כמו במעבדת ההנדסה). הסצנות של לנצ'סטר מסומנות ב-`CORE` בשדה `modules` (עשר: ארבע משותפות ושש ב-`scenes_core.ts`). מחברת שיעור משותפת ללומד ולמורה ב-`profile/notes/`.
- הנתונים: `data/users/<id>/profile` (זיכרון, מודולים שנלמדו), `profile/modules/<מודול>` (שיעורים, ציון מבחן), `profile/convs/...` (שיחה לכל שיעור), `profile/notes/...` (מחברת השיעורים).

## גילואה (מעבדת ההנדסה)

- כתובת קבועה: https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k. אפליקציה שלישית, נפרדת משתי האחרות. החלטות התכנון ב-`docs/ENG_LAB_PLAN.md`.
- הקוד ב-`eng/app/` (על הקוד של מעבדת הליבה), וההנחיות למורה ב-`eng/app/src/prompt.ts`. כל שינוי בכללים נעשה גם שם וגם ב-`docs/ENG_TEACHING_RULES.md`.
- הספרייה: `eng/tools/extract.py` ואז `eng/tools/pack.py`. התוצרים (`eng/build/`, `eng/app/artifact/lib/`, `eng/app/artifact/assets/`) לא ב-git. תשעה מסמכים כבדים (E09, E09a, E12, E13, E15, E25, K1–K3) נמצאים במאגר הקבצים של ה-Artifact, והכתובות שלהם ב-`eng/tools/asset_urls.json`.
- פרסום: `cd eng/app && npm run build`, ואז Artifact publish של `eng/app/artifact/index.html` עם `app.js` ו-`app.css` מ-`dist/`. קבצי `lib/` נשמרים בין גרסאות. ההרשאות: `sample` (עם תמונות), `db`, `user`, `downloads` ו-`assets`.
- תלת-ממד: הרכיב המשותף `shared/scene3d/`, שגם לנצ'סטר משתמשת בו. שינוי בו משפיע על שתי האפליקציות, וצריך לבנות ולפרסם את שתיהן.
- הנתונים: כמו במעבדת הליבה (`profile`, `profile/modules/`, `profile/convs/`, `profile/notes/`), במסד הנתונים של ה-Artifact הזה.

## מוסכמות

- הלומד כותב בעברית. תשובות, ממשק ומסמכים בעברית; קוד ושמות מזהים באנגלית.
- הלומד נמצא כרגע בעמ' 240 בכרך א' של המתמטיקה (פרק III, §12). בפיזיקה עוד לא התחיל. המצב העדכני נמצא ב-`notes/PROGRESS.md` וב-`notes/MEMORY.md`.
- לא לכתוב מזהה מודל בהודעות commit.
- כל שינוי בכללי הלימוד נעשה גם ב-`app/src/prompt.ts` וגם ב-`docs/TEACHING_RULES.md`.
