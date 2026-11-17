# HANDOFF (17.11): דחוף, שחזור לנצ'סטר וגילואה

## מה קרה
בנינו את "העבר את השיעור" (שיחה קולית, commits בענף `claude/loving-clarke-rzn8b2`) על בסיס `main` (89a1101).
הפרסום החליף את `app.js`/`app.css` בשתי האפליקציות, ודרס שינויים מסשנים קודמים שפורסמו מענפים אחרים ולא מוזגו ל-main.
- לנצ'סטר https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9: הגרסה הטובה האחרונה היא version id `1794839242-4b41` (v154). הגרסה שלנו (הרסנית) היא v155.
- גילואה https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k: הגרסה הטובה היא `1794839240-64c1` (v138). שלנו: v139.
- ההרשאות עכשיו כוללות גם `dictation` ו-`tts` (לא מזיק).
- ניסיון להעתיק את app.js מגרסה קודמת של אותו Artifact נכשל (`from.slug must name another artifact`).

## מה לעשות
1. מהר: לשחזר. אפשרות א': הלומד מחזיר גרסה מתפריט הגרסאות של ה-Artifact ב-claude.ai (v154 / v138). אפשרות ב': למצוא את הענף שממנו פורסמו v154/v138 (`git ls-remote --heads origin`, לבדוק ענפי `claude/*` האחרונים, למשל magical-albattani, relaxed-rubin, eager-curie, quirky-mayer; להשוות `git log` של `core/app/src`), לבנות ממנו ולפרסם.
2. אחר כך: למזג את הענף הזה (`claude/loving-clarke-rzn8b2`, 3 commits: teachback) לתוך הענף העדכני, לפתור קונפליקטים ב-`App.tsx`, `CloseDay.tsx`, `tutor.ts`, `prompt.ts`, לבנות את שתיהן, להריץ `tools/test/*.test.mjs` ולפרסם עם `capabilities` מלאות: `{assets:{}, db:{}, downloads:{}, sample:{images:true}, user:{}, dictation:{}, tts:{}}`.
3. כלל חדש לפרויקט: לפני פרסום לבדוק שהענף מכיל את כל מה שפורסם (מאיזה ענף פורסמה הגרסה החיה). להוסיף ל-CLAUDE.md.
