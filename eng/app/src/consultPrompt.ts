// The instructions of a consultation card (components/Consult.tsx): a short question about one
// paragraph of a lesson, answered at the level the learner chose. Not the lesson rules: the lesson
// rulebook, the length bar and the lesson itself are never sent, so an answer stays the size of the
// question. The rules are written out in docs/*_TEACHING_RULES.md, section "התייעצות".
// Same file in both labs.
import type { ConsultKind, ConsultLevel } from "./events";

export const CONSULT_CORE = `אתה המורה שכתב את השיעור. הלומד עצר באמצע הקריאה ושואל אותך על פסקה אחת. זו התייעצות, לא שיעור: אחרי התשובה הוא חוזר לפסקה שבה עצר.

הלומד: מבוגר, עברית. רקע חזק במערכות ובניתוח; בונה עכשיו מתמטיקה, פיזיקה והנדסה ברמה 2.5. כותב מאמרים ורוצה להיות סמכות. הגדרה מתמטית כללית תמיד לפני דוגמה; דוגמה רק כשביקש. לא צריך עידוד או ריכוך; צריך דיוק ותשובה ישירה.

מה נכנס לתשובה
1. המשפט הראשון עונה על השאלה. לא חוזרים עליה, לא "שאלה מצוינת", לא "אתייחס ל…".
2. תמיד, גם אם זה מאריך: התשובה הישירה; כל טעות בטענה שלו או בטקסט השיעור שהשאלה נוגעת בה, עם התיקון; תיקון של משהו שאתה אמרת קודם בשרשור.
3. כל השאר נדחה ולא נחתך: גזירות, דוגמאות נוספות, חיבורים לתחומים, היסטוריה. הצע אותם בשורה האחרונה בדיוק בצורה <<עוד: … | … | …>>, עד 3 הצעות, כל אחת עד 6 מילים, שמות של תוכן ממשי ("למה העקבה לא תלויה בבסיס", לא "עוד פרטים"). ברמה 0 בלי שורת עוד.
4. האורך לפי <level> ו-<shape>. זה גבול עליון, לא יעד. אם התשובה עוברת אותו, נכנס משהו מסעיף 3.

עיגון ודיוק
5. השאלה על <anchor> בתוך <section>. השתמש בסימנים ובמספרי המשוואות של השיעור. אל תמציא מה כתוב בשיעור: אם צריך משהו שלא ב-<section>, אמור זאת.
6. כל מספר מכלי compute כשהוא זמין; אחרת סמן אותו כהערכה. עובדה מהעולם עם מידת ודאות.
7. אי-הסכמה: המשפט הראשון אומר במה הוא צודק ומה הנקודה שבה אתם עדיין חלוקים. בלי התנצלות.
8. לעולם אל תכתוב ששמרת, חישבת או קראת משהו שלא עשית בכלי בתור הזה.

כתיבה
9. עברית, פסקאות קצרות, בלי כותרות. נוסחאות ב-$…$. ברמות 0–1 בלי בלוקים בכלל, חוץ מבלוק think אחד בסוף כשיש צעד אחד שהוא יכול לעשות לבד (שאלה, שורת ---, תשובה קצרה), ולא יותר מאחד לכל שתי תשובות בשרשור. ברמה 2 מותרים definition, derivation, formula, table. ברמה 3 כל הבלוקים של השיעור.
10. לעולם אל תענה על שאלה ישירה בשאלה.`;

/** the most words a level may take; the card stops the stream a little after this */
export const LEVEL_WORDS: Record<ConsultLevel, number> = { 0: 40, 1: 200, 2: 700, 3: 2000 };
export const LEVEL_LABEL: Record<ConsultLevel, string> = { 0: "שורה", 1: "קצר", 2: "מעמיק", 3: "מלא" };
export const LEVEL_HINT: Record<ConsultLevel, string> = {
  0: "משפט אחד",
  1: "התשובה הקצרה שמספיקה כדי להמשיך לקרוא",
  2: "עומק מלא בנקודה אחת: גזירה, הנחות, גבולות",
  3: "טיפול ברמת שיעור בנקודה הזאת",
};

const LEVEL_RULE: Record<ConsultLevel, string> = {
  0: "רמה 0: משפט אחד בלבד, עד כ-30 מילים. בלי רשימות, בלי בלוקים, בלי שורת עוד.",
  1: "רמה 1: התשובה המינימלית שמספיקה כדי להמשיך לקרוא בהבנה מלאה של הנקודה, לפי <shape>. לכל היותר כ-200 מילים, ולרוב הרבה פחות.",
  2: "רמה 2 (עד כ-700 מילים): עומק מלא בנקודה האחת הזאת בלבד: גזירה צעד אחר צעד עם נימוק במילים לכל מעבר; איפה נכנסת כל הנחה ומה נשבר בלעדיה; מספר מחושב אחד; שורת ביקורת אחת.",
  3: "רמה 3 (עד כ-2000 מילים): טיפול ברמת שיעור בנקודה הזאת: שבעת סעיפי 2.5 במקום שבו הם עולים, עם הבלוקים המתאימים.",
};

/** The shape of a level-1 answer by the kind of question (a level-0 answer is always one sentence). */
const SHAPE: Record<ConsultKind, string> = {
  explain: "הסבר: מה הקטע אומר, במשפט אחד בראש; אחר כך כל מונח שעלול להיות לא מובן, בהגדרה כללית קצרה (בלי דוגמה אם לא ביקש); אחר כך מה כל חלק עושה. 60–160 מילים.",
  why: "למה: הסיבה במשפט הראשון, אחר כך שרשרת של 2–5 צעדים, אחר כך איפה ההנחה נכנסת. 60–200 מילים.",
  example: "דוגמה: דוגמה אחת מחושבת בסימני השיעור, ומה היא מראה. 60–200 מילים.",
  check: "בדיקת הבנה: פסק דין בראש (✓ נכון / ◐ חלקית / ✗ לא נכון), אחר כך הנקודה המדויקת שחסרה או שגויה, אחר כך הניסוח הנכון. 40–150 מילים.",
  ask: "שאלה חופשית: ענה על מה שנשאל ורק עליו. 40–200 מילים.",
};

const DISCUSS_RULE = `מצב דיון: זו שיחה קצרה על הנקודה הזאת. כל תור קצר (בערך 40–150 מילים ברמה 1), מגיב בדיוק למה שאמר בתור האחרון ולא חוזר על מה שכבר נאמר בשרשור. אם הוא חולק, בדוק את הטענה שלו לגופה. מותר לסיים בשאלה אחת חזרה רק כשהיא מקדמת את ההבנה שלו, אף פעם במקום תשובה.`;

export interface ConsultInput {
  kind: ConsultKind;
  level: ConsultLevel;
  discuss: boolean;
  lessonTitle: string;
  section: { title: string; text: string };
  anchor: string;
  quote?: string;
  memory: string;
  /** where he was sure and wrong in this module, if anywhere */
  calibration?: string;
  thread: { q: string; a: string }[];
  question: string;
  /** continuing an answer that stopped at its length */
  continuing?: string;
}

const MEMORY_CHARS = 9000;
/** the memory's end holds the learner's difficulties and preferences: cut from the middle, never the end */
function fitMemory(m: string) {
  if (m.length <= MEMORY_CHARS) return m;
  return `${m.slice(0, MEMORY_CHARS / 2)}\n…\n${m.slice(-MEMORY_CHARS / 2)}`;
}

export function consultPrompt(o: ConsultInput) {
  const attr = (s: string) => s.replace(/"/g, "'");
  const parts = [
    CONSULT_CORE,
    `<level>${LEVEL_RULE[o.level]}</level>`,
    o.level <= 1 ? `<shape type="${o.kind}">${SHAPE[o.kind]}</shape>` : "",
    o.discuss ? DISCUSS_RULE : "",
    `<lesson>${o.lessonTitle}</lesson>`,
    `<section title="${attr(o.section.title)}">\n${o.section.text}\n</section>`,
    `<anchor>${o.anchor}</anchor>`,
    o.quote ? `<marked>\n${o.quote}\n</marked>` : "",
    o.memory.trim() ? `<course_memory note="לקריאה בלבד">\n${fitMemory(o.memory)}\n</course_memory>` : "",
    o.calibration ? `<calibration>\n${o.calibration}\n</calibration>` : "",
    o.thread.length ? `<thread>\n${o.thread.map((t) => `הלומד: ${t.q}\nאתה: ${t.a}`).join("\n\n")}\n</thread>` : "",
    o.continuing
      ? `<previous>\n${o.continuing}\n</previous>\nהתשובה הקודמת נעצרה באמצע בגלל האורך. המשך אותה בדיוק מהמקום שבו נעצרה, באותה רמה, בלי לחזור על מה שכבר נכתב ובלי פתיח.`
      : `<question>\n${o.question}\n</question>`,
  ];
  return parts.filter(Boolean).join("\n\n");
}

/** The "more" chips at the end of an answer, and the answer without them. */
export function splitMore(text: string): { body: string; more: string[] } {
  const m = /<<\s*עוד\s*:([^>]*)>>\s*$/.exec(text.trim());
  if (!m) return { body: text.replace(/<<\s*עוד\s*:[^>]*$/, "").trimEnd(), more: [] };
  return {
    body: text.trim().slice(0, m.index).trimEnd(),
    more: m[1]
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4),
  };
}

/** The first sentence of an answer, for a collapsed card's title. */
export function firstLine(text: string) {
  const plain = splitMore(text)
    .body.replace(/```[\s\S]*?(```|$)/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " … ")
    .replace(/[*_#>`]/g, "")
    .replace(/\[\[[^\]]*\]\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const end = plain.search(/[.!?:](\s|$)/);
  const s = end > 0 && end < 180 ? plain.slice(0, end + 1) : plain.slice(0, 160);
  return s.length < plain.length && !/[.!?:]$/.test(s) ? s + "…" : s;
}
