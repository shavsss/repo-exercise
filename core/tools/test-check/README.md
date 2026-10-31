# check.mjs: בדיקת עשן וצילומי מסך ללנצ'סטר ולגילואה

מריץ את דף הבדיקה של האפליקציה עצמה (`<app>/tools/test/make-harness.mjs` ו-`stub.js`) ב-Chromium בלי מסך, בהיר וכהה, ב-1300px וב-400px: בית, מודול, שיעור 1 נכתב (חלק 2 נקטע וממשיך), בלוקים, קנבס ומחברת הסיכומים. לא בונה: קודם `npm run build`.

```bash
cd core/app && npm run build
node ../tools/test-check/check.mjs core <outdir>                     # או eng; --app <תיקיית app> לעותק אחר (worktree)
HARNESS_LIB=<תיקייה> node core/tools/test-check/check.mjs eng <outdir>   # כש-artifact/lib לא על הדיסק
```

מדפיס JSON (`pass`, `pageErrors`, `consoleErrors`, `failedRequests`, `screenshots`); יציאה 0 עובר, 1 שגיאה בדף או בצעד, 2 בעיית הכנה. צריך `artifact/lib/index.json` (הספרייה לא ב-git): אם אין, קישור לעותק חלקי מהגרסה שפורסמה, `<HARNESS_LIB>/<core|eng>/lib` (ו-`dict/he.txt` לידו), שנמשך עם Artifact `action: "read"` ו-`paths`. לא מפרסמים מעץ שבו `artifact/lib` הוא העותק החלקי. Playwright נלקח מ-`node_modules` או מ-`/opt/node-tools`.
