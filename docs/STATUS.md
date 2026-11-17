# מצב הפרויקט

עדכן אחרי כל שינוי בקוד. הקובץ הזה הוא הדרך הקצרה להבין איפה אנחנו בשיחה חדשה.

## מבנה התיקיות
(מה כל תיקייה מכילה)

## מה נעשה
- **המקרה ההנדסי, תת-שלב 1 (17.11): כללים ויצירת השיעור** (לנצ'סטר וגילואה, `docs/ENGINEERING_CASE.md`):
  - כללים: סעיף "המקרה ההנדסי בסוף השיעור" ב-`docs/CORE_TEACHING_RULES.md` וב-`docs/ENG_TEACHING_RULES.md`, ובשני ה-`prompt.ts` (לנצ'סטר: סעיף יא, כללים 46–49; גילואה: סעיף ח, כללים 28–31), ושורה על הבלוק ב-rendering_protocol.
  - יצירה: המתכנן שומר `case` ב-"blocks" של החלק האחרון ובשדה `case` של התוכנית (`CASE_PLAN`); החלק האחרון כותב keep ← משפט על השיעור הבא ← בלוק case אחד (`CASE_PART`, ב-`bookRules.ts`). הפורמט והבדיקה ב-`src/caseBlock.ts` (חדש, זהה בשתיהן). ה-LessonFeature `decide` הוחלף ב-`case`; `decideSlot`/`decideLine`/DECIDE_PART נמחקו. הרכיבים Decide ו-ErrorHunt נשארו לשיעורים שמורים.
  - בדיקה: `lessonAudit` בודק את המספרים והמקורות של המקרה (סעיף 6 בבדיקה) ואת המבנה בתוכנה (`caseFindings`); בדיקת הקורא רואה רק את התרחיש; keep חדש ותוספות נכנסים לפני המקרה. `wordCount` לא סופר את המקרה.
  - מחסן רעיונות: `src/ideas.ts` (חדש), `Store.loadIdeas/saveIdeas` (`profile/ideas/store`), ו-`<idea_store>` ב-`studyContext`. `composeLesson` טוען אותו מה-store כשלא הועבר, כך שהוא מגיע לתכנון מ-App, מ-prefetch ומהספסל.
  - תצוגה זמנית: `CasePreview` ב-`Markdown.tsx` מציג רק את התרחיש (יוחלף ב-CaseStudy.tsx). `case` נוסף ל-INTERACTIVE.
  - בדיקות: `tools/test/case.test.mjs` (חדש, בשתיהן); כל בדיקות היחידה ו-`tsc` עוברים בשתי האפליקציות.

## מה עוד לא
- המקרה ההנדסי, תת-שלב 2: `CaseStudy.tsx` ו-`casePrompt.ts` (חדר סקירת התכן, הדיאלוג, ADR, תחקיר), אחסון `profile/cases/<module>__<lesson>`, אירוע `case.commit` ויומן כיול, לוח מחסן הרעיונות. תת-שלב 3: בנייה ופרסום של שתי האפליקציות.
- עוד לא נכתב שיעור אמיתי עם בלוק case: הפורמט נבדק רק בבדיקות היחידה.

## באגים פתוחים
-
