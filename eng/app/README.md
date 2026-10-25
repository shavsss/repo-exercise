# מעבדת ההנדסה · Engineering Lab

מורה פרטי שמלמד הנדסה ברמת עילית טכנולוגית מתוך הספרייה שב-`library/engineering/` (ועמוד השדרה ב-`library/math-physics/`), מודול אחר מודול, לפי תוכנית הלימודים (`library/engineering/syllabus/`). האפליקציה בנויה על הקוד של מעבדת הליבה (`core/app/`) ורצה כ-Artifact ב-claude.ai: אין שרת ואין מפתח API, והיא פונה ל-Claude דרך `claude.use("sample")` ומבקשת את Claude Opus 5.5. כללי הלימוד נמצאים ב-[`src/prompt.ts`](src/prompt.ts) ובעברית ב-[`docs/ENG_TEACHING_RULES.md`](../../docs/ENG_TEACHING_RULES.md). החלטות התכנון: [`docs/ENG_LAB_PLAN.md`](../../docs/ENG_LAB_PLAN.md).

## מה שונה ממעבדת הליבה

- **רמה 2.5:** שבעת הסעיפים (מבנה, מקור, גבולות, סדר גודל, פשרה, מבנה משותף, ביקורת) מסומנים בתגיות בתוך הטקסט (`[[2.5: מבנה]]`), והבדיקה האוטומטית בסוף השיעור מוודאת שכולם הופיעו.
- **העולם של היום:** בלוק `today` קבוע בסוף כל שיעור, עם תווית ודאות לכל טענה ותאריך הידע.
- **תלת-ממד:** בלוק `scene3d`, מהרכיב המשותף ב-[`shared/scene3d/`](../../shared/scene3d). המורה קורא לסצנה בדוקה מהספרייה (13 סצנות, עם מחוונים, מספרים בפינה וסיור מודרך) או כותב מפרט JSON משלו, שמסומן כ"סצנה של המורה". לחיצה קצרה על חלק בסצנה מראה מהו; לכל סצנה הסבר שאפשר לסגור, וכפתור למסך מלא. three.js נטען מה-CDN רק כשיש סצנה בשיעור, וכל הסצנות בדף מצוירות ב-renderer אחד.
- **מסלול מעשי:** בלוק `notebook` הופך למחברת Jupyter שהלומד מוריד (בתוך zip, כי ההורדות של ה-Artifact לא מקבלות ipynb) ומריץ ב-Colab.
- **מפת טבעות:** בדף הפתיחה, עמוד השדרה במרכז, הצמתים סביבו, הגשרים והפריפריה בחוץ, עם קווי דרישות מוקדמות. לחיצה על חלק מציגה את המודולים שלו.
- **מקורות:** תפקיד נוסף, `ex` (תרגילים): עמודי הבעיות של הספרים, וספר הפתרונות של חוזק חומרים. הם לא נכנסים לחלוקת השיעורים, והמורה לוקח מהם תרגילים. מציג המקורות מתקפל לפס צר בצד.
- **סעיפים:** כותרות הסעיפים של כל מודול באות ממפות תוכנית הלימודים (`toc/`), שנבדקו ידנית.

## הספרייה בדף

אותו פורמט כמו במעבדת הליבה (`lib/index.json`, `lib/text/`, `lib/fig/`, `lib/pg/`). קולמוגורוב ופיינמן I–II נלקחים מקבצי הטקסט של מעבדת הלמידה (`app/artifact/books/`); לעמודי קולמוגורוב, שעברו OCR, נוספות תמונות עמוד.

```bash
python3 -m venv ~/ocr-venv && ~/ocr-venv/bin/pip install rapidocr_onnxruntime scipy pillow numpy pypdf pymupdf
~/ocr-venv/bin/python eng/tools/extract.py [DOC ...]   # כל המסמכים, או רשימה; ממשיך מאיפה שנעצר
~/ocr-venv/bin/python eng/tools/pack.py                # כותב את eng/app/artifact/lib/
```

החילוץ של כ-20,000 עמודים לוקח כשעה וחצי בארבעה תהליכים מקבילים. `eng/build/` ו-`eng/app/artifact/lib/` לא נשמרים ב-git.

## פיתוח ובדיקה

```bash
cd eng/app
npm install
npm run build                                   # dist/app.js + dist/app.css
node tools/test/make-harness.mjs /tmp/harness   # דף בדיקה עם runtime מדומה
cd /tmp/harness && python3 -m http.server 5190  # http://localhost:5190/test.html
```

## פרסום

הדף הוא `artifact/index.html`, עם `dist/app.js`, `dist/app.css` והקבצים שב-`artifact/lib/`, בכמה פעימות לאותה כתובת (עד 64MB בכל פעימה). ההרשאות: `sample` (עם תמונות), `db`, `user` ו-`downloads`.
