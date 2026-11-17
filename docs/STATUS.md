# מצב הפרויקט

עדכן אחרי כל שינוי בקוד. הקובץ הזה הוא הדרך הקצרה להבין איפה אנחנו בשיחה חדשה.

## מבנה התיקיות
(מה כל תיקייה מכילה)

## מה נעשה
- 17.11: "העבר את השיעור" בלנצ'סטר ובגילואה. הלומד מסביר בקול בסוף שיעור או יום (`dictation`), המורה בודק מול השיעור והמקורות, מקריא את התשובות (`tts`) ומנהל שיחה פתוחה. הפערים עוברים למחברת. קבצים: `src/teachback.ts`, `src/components/TeachBack.tsx`, `src/teachback.css`, `teachBackTurn`/`teachBackVerdict` ב-`tutor.ts`, `TEACHBACK_RULES` ב-`prompt.ts`. נבנה ועבר בדיקות.

## מה עוד לא
- לפרסם את שתי האפליקציות עם ההרשאות `dictation` ו-`tts` (רשימה מלאה: `sample: {images: true}`, `db`, `user`, `assets`, `downloads`, `dictation`, `tts`), ולבדוק את ההקלטה ב-Chrome.
- `export.mjs` עוד לא כותב `TEACHBACK.md` (בינתיים הגיבוי גולמי).

## באגים פתוחים
-
