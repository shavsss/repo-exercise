# repo-exercise: הקשר לעבודה עם Claude

מאגר אישי ללימוד מתמטיקה ופיזיקה מתוך ספרים, ומעבדת הלמידה: מורה פרטי שרץ כ-Artifact ב-claude.ai.

## מה יש כאן

| נתיב | מה זה |
|---|---|
| `library/math-physics/` | הספרים: Mathematics: Its Content, Methods and Meaning (כרכים 1–3) והרצאות פיינמן (כרכים I–III) |
| `library/military/` | הליבה הצבאית (אפליקציה נפרדת, בתכנון): ספרים ממוספרים, מאמרים, דוקטרינה. מפתח ב-`library/README.md` |
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

## מוסכמות

- הלומד כותב בעברית. תשובות, ממשק ומסמכים בעברית; קוד ושמות מזהים באנגלית.
- הלומד נמצא כרגע בעמ' 240 בכרך א' של המתמטיקה (פרק III, §12). בפיזיקה עוד לא התחיל. המצב העדכני נמצא ב-`notes/PROGRESS.md` וב-`notes/MEMORY.md`.
- לא לכתוב מזהה מודל בהודעות commit.
- כל שינוי בכללי הלימוד נעשה גם ב-`app/src/prompt.ts` וגם ב-`docs/TEACHING_RULES.md`.
