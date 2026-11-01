# check.mjs: בדיקת עשן וצילומי מסך ללנצ'סטר ולגילואה

מריץ את דף הבדיקה של האפליקציה עצמה (`<app>/tools/test/make-harness.mjs` ו-`stub.js`) ב-Chromium בלי מסך, בהיר וכהה, ב-1300px וב-400px: בית, מודול, שיעור 1 נכתב (חלק 2 נקטע וממשיך), בלוקים, קנבס ומחברת הסיכומים. לא בונה: קודם `npm run build`.

```bash
cd core/app && npm run build
node ../tools/test-check/check.mjs core <outdir>                     # או eng; --app <תיקיית app> לעותק אחר (worktree)
HARNESS_LIB=<תיקייה> node core/tools/test-check/check.mjs eng <outdir>   # כש-artifact/lib לא על הדיסק
```

מדפיס JSON (`pass`, `pageErrors`, `consoleErrors`, `failedRequests`, `screenshots`); יציאה 0 עובר, 1 שגיאה בדף או בצעד, 2 בעיית הכנה. צריך `artifact/lib/index.json` (הספרייה לא ב-git): אם אין, קישור לעותק חלקי מהגרסה שפורסמה, `<HARNESS_LIB>/<core|eng>/lib` (ו-`dict/he.txt` לידו), שנמשך עם Artifact `action: "read"` ו-`paths`. לא מפרסמים מעץ שבו `artifact/lib` הוא העותק החלקי. Playwright נלקח מ-`node_modules` או מ-`/opt/node-tools`.

## book.mjs: השיעור כספר (סבב 6)

אותו דף בדיקה, עם תצוגת ספר דולקת ושיעור שמור (`docs/research/round6/book/research/sample_lesson.md` ואחריו השיעור של דף הבדיקה עם כל סוגי הבלוקים). בהיר וכהה, 1300px ו-400px: פתיחת הספר, היפוך (ופריים באמצע היפוך), שלוש לחיצות מהירות שנכנסות לתור, שאלת think עם ביטחון (בלי שהעמוד זז), פתק בשוליים, כרטיס התייעצות ודיון בעמוד שמול (גם אחרי היפוך, והחלפת צד), תוכן השיעור, קפיצה וחזרה (Backspace), לוח סצנה שנפתח בעמוד שמול, המחברת, סוף הספר, שיעור שנכתב בזמן הקריאה (עמוד שנראה לא משתנה), תנועה מופחתת (דהייה ולא תלת-ממד) ושינוי גודל חלון ששומר את מקום הקריאה. בכל פריים: אין גלילה לרוחב, אין בלוק חתוך בלי סימון, ושום חלון של בלוק לא יוצא מהעמוד. ובפתיחה: מילוי כל עמוד (`window.__bookFill`, נשמר ב-`<outdir>/<app>-<tag>-fill.json` ומסוכם ב-`fills`). עמוד שנגמר באמצע הזרימה צריך להיות מלא לפחות 80%; החריגים היחידים הם סוף סעיף (`section`) ועמוד שנגמר לפני בלוק שהלומד עובד בו (`think`), שנשאר במקומו. `--pages <n>` מצלם גם כל פריסה (או עמוד בטלפון) עד עמוד n.

```bash
node core/tools/test-check/book.mjs core <outdir>      # או eng --app eng/app; --only dark-wide; --quick; --pages 16
```
