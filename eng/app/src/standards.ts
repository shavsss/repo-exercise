// The published templates the learner's work is compared with after he commits ("השוואה לסטנדרט",
// docs/ENGINEERING_CASE.md): per stage of the engineering case, and at its close the ADR, the design doc as a whole and
// the review. Never shown before he commits (his own thinking first; the worked example is our own, not a company's).
// Every standard carries its source, where in it, and a certainty label; the verification is in
// docs/research/reports/אימות התבנית מול המקורות.md. Pure data and pure helpers: the room (components/CaseRoom.tsx),
// the prompt (casePrompt.ts standardPrompt) and the tests share it. Same file in both apps.
import type { CaseStage } from "./caseBlock";

export interface StandardItem {
  /** what the standard asks for, in Hebrew, with the source's own term in parentheses */
  text: string;
  /** where in the source (a table row, a criterion number), when the standard has several parts */
  ref?: string;
}
export interface Standard {
  id: string;
  name: string;
  /** the citation: author or body, title, year, the table or section */
  source: string;
  url: string;
  certainty: "גבוהה" | "בינונית–גבוהה" | "בינונית";
  items: StandardItem[];
  /** where our template differs from it on purpose, or what in it is our inference */
  differs?: string;
}

const SEH = "https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf";
const NPR = "https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=AppendixG";
const GOOGLE = "https://www.industrialempathy.com/posts/design-docs-at-google/";
const STARBASE = "https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021";

export const STANDARDS: Record<string, Standard> = {
  "nasa-req": {
    id: "nasa-req",
    name: "מטא-נתוני דרישה של NASA",
    source: "NASA Systems Engineering Handbook, SP-2016-6105 Rev2, טבלה 4.2-2 (Requirements Metadata), עמ' 58",
    url: SEH,
    certainty: "גבוהה",
    items: [
      { text: "לכל דרישה בעלים: אדם או גוף שכותב, מנהל ומאשר שינויים בה (Owner)" },
      { text: "נימוק: למה הדרישה קיימת, ואילו הנחות ואילוצים עומדים מאחוריה (Rationale)" },
      { text: "מקור: מאיזו דרישת אב או צורך היא נגזרת (Traced from)" },
      { text: "שיטת אימות שנקבעת כבר עם הדרישה: ניסוי, בדיקה, אנליזה או הדגמה (Verification method)" },
    ],
  },
  "musk-req": {
    id: "musk-req",
    name: "האלגוריתם של SpaceX, צעדים 1–2",
    source: "Elon Musk, סיור Starbase עם Everyday Astronaut, 2021 (תמליל)",
    url: STARBASE,
    certainty: "בינונית–גבוהה",
    items: [
      { text: "כל דרישה באה עם שם של אדם, לא של מחלקה (\"make your requirements less dumb\")" },
      { text: "ניסיון אמיתי למחוק דרישה, חלק או שלב בתהליך (\"try very hard to delete\")" },
      { text: "מחיקה לפני ייעול: לא מייעלים משהו שלא צריך להתקיים" },
    ],
    differs: "משפט ה-10% (מי שלא מחזיר 10% ממה שמחק, לא מחק מספיק) מוכר רק מהביוגרפיה של Isaacson (2023): ודאות בינונית.",
  },
  "google-goals": {
    id: "google-goals",
    name: "יעדים ויעדים שאינם יעדים (מסמך תכן בסגנון Google)",
    source: "Malte Ubl, \"Design Docs at Google\", 2020, הסעיף Goals and non-goals",
    url: GOOGLE,
    certainty: "גבוהה",
    items: [
      { text: "יעדים מפורשים, ברשימה קצרה (Goals)" },
      { text: "יעדים שאינם יעדים: דברים שיכלו להיות יעד ונבחר במפורש שלא (Non-goals); לא שלילה כמו \"שלא יקרוס\"" },
    ],
  },
  roofline: {
    id: "roofline",
    name: "Roofline",
    source: "Williams, Waterman & Patterson, \"Roofline\", Communications of the ACM 52(4), 2009",
    url: "https://www.cs.colostate.edu/~cs475/f19/more_assignments/Labs/L10/RooflineCACM2009.pdf",
    certainty: "גבוהה",
    items: [
      { text: "הביצוע האפשרי הוא המינימום של כמה גגות בעלי שם (Attainable = min(…))" },
      { text: "איזה גג מגביל עכשיו, ובאיזו נקודה הגג המגביל מתחלף (ridge point)" },
      { text: "לכל פער מתחת לגג שם ותקרה משלו, ומהם סדר התקיפה: אי אפשר לעבור תקרה בלי האופטימיזציה שלה (ceilings)" },
    ],
    differs: "Roofline הוא מודל של מחשוב (פעולות לבית). ההחלה על טווח מכ\"ם, הספק או רוחב סרט היא אנלוגיה שלנו, לא חלק מהמקור.",
  },
  "google-design": {
    id: "google-design",
    name: "מסמך תכן בסגנון Google: התכן והחלופות",
    source: "Malte Ubl, \"Design Docs at Google\", 2020, הסעיפים The actual design, Alternatives considered, Cross-cutting concerns",
    url: GOOGLE,
    certainty: "גבוהה",
    items: [
      { text: "התכן כתוב כ-trade-offs: מה נקנה ובמה שילמו (The actual design)" },
      { text: "חלופות שנשקלו, כל אחת עם ה-trade-offs שלה, ולא רק \"למה שלי טובה\" (Alternatives considered)" },
      { text: "שיקולי רוחב: אצל Google אבטחה, פרטיות ונראות; אצלנו בטיחות, אבטחה ואחזקה (Cross-cutting concerns)" },
    ],
  },
  "nasa-sdr": {
    id: "nasa-sdr",
    name: "סקירת הגדרת המערכת של NASA (MDR/SDR)",
    source: "NASA SE Handbook SP-2016-6105 Rev2, טבלה 6.7-1, עמ' 161; NPR 7123.1D טבלה G-4; §6.8",
    url: SEH,
    certainty: "גבוהה",
    items: [
      { text: "הארכיטקטורה עונה לדרישות הפונקציונליות והביצועים", ref: "6.7-1, MDR/SDR" },
      { text: "הדרישות הוקצו לכל הרכיבים של המערכת", ref: "6.7-1, MDR/SDR" },
      { text: "הממשקים זוהו: עם העולם שבחוץ ובין הרכיבים הפנימיים", ref: "G-4 #4" },
      { text: "\"לא לעשות כלום\" או להשתמש במה שקיים נשקלו כחלופה", ref: "§6.8" },
    ],
  },
  "nasa-decision": {
    id: "nasa-decision",
    name: "דוח החלטה של NASA",
    source: "NASA SE Handbook SP-2016-6105 Rev2, §6.8 וטבלה 6.8-1 (Typical Information to Capture in a Decision Report), עמ' 171",
    url: SEH,
    certainty: "גבוהה",
    items: [
      { text: "קריטריונים מפורשים ובני מדידה, ומה מהם חובה (mandatory) ומה משפר (enhancing)", ref: "6.8-1 #3" },
      { text: "החלופות שנבחנו ושיטת ההערכה של כל אחת", ref: "6.8-1 #3–4" },
      { text: "סיכונים ותועלות של כל חלופה סופית", ref: "6.8-1 #6" },
      { text: "המלצה ונימוק: למה החלופה הזאת", ref: "6.8-1 #7" },
      { text: "מבחן אי-ודאות: האם צמצום אי-הוודאות יכול להפוך את הדירוג", ref: "§6.8" },
    ],
    differs: "\"איפה השיטה נשברת\" (תחום תקפות) הוא דרישה שלנו; המקור שלה (NASA-STD-7009, VV&A) לא נבדק בסבב הזה.",
  },
  heritage: {
    id: "heritage",
    name: "הערכת מה שקיים (heritage) בקריטריוני PDR",
    source: "NPR 7123.1D, נספח G, טבלה G-6 (PDR), קריטריונים 6 ו-16; Google, Alternatives considered",
    url: NPR,
    certainty: "גבוהה",
    items: [
      { text: "תכנים קיימים נבחנו להתאמה לתנאים שלך, לא רק נמנו", ref: "G-6 #16" },
      { text: "טכנולוגיה חדשה: בשלה מספיק, או שיש חלופת גיבוי ממשית", ref: "G-6 #6" },
      { text: "למה מי שבחר אחרת בחר כך: ה-trade-offs שלו, לא רק מי עושה מה", ref: "Google" },
    ],
  },
  premortem: {
    id: "premortem",
    name: "Pre-mortem של Klein",
    source: "Gary Klein, \"Performing a Project Premortem\", Harvard Business Review, ספטמבר 2007",
    url: "https://hbr.org/2007/09/performing-a-project-premortem",
    certainty: "בינונית–גבוהה",
    items: [
      { text: "נקודת המוצא: הפרויקט כבר נכשל, באופן מוחלט (\"has failed spectacularly\")" },
      { text: "כל אחד כותב בעצמו ובנפרד את סיבות הכישלון, לפני שמישהו מדבר" },
      { text: "הרשימה מלאה: כל הסיבות שעולות, לא רק החזקה" },
      { text: "חוזרים לתוכנית ומחזקים אותה: שינוי לסיבות המובילות (\"ways to strengthen the plan\")" },
    ],
    differs: "הנוהל נבדק בשני העתקים של המאמר (הדף של HBR נעול). נתון ה-30% (Mitchell, Russo & Pennington 1989) מדד את מספר הסיבות, לא את דיוק החיזוי. אצלנו הצוות האדום מוסיף אחרי הכתיבה העצמאית.",
  },
  verification: {
    id: "verification",
    name: "אימות דרישות של NASA",
    source: "NASA SE Handbook SP-2016-6105 Rev2, טבלה 4.2-2; NPR 7123.1D טבלה G-7 (CDR) #6",
    url: SEH,
    certainty: "גבוהה",
    items: [
      { text: "הניסוי מאמת דרישה מסוימת, ואפשר לעקוב אליה", ref: "4.2-2, Traced from" },
      { text: "שיטת האימות מוגדרת: ניסוי, בדיקה, אנליזה או הדגמה", ref: "4.2-2" },
      { text: "באיזו רמה מאמתים (מערכת, תת-מערכת, רכיב)", ref: "4.2-2, Verification level" },
      { text: "גישת הניסוי מקיפה: מה עוד לא נבדק ומתי ייבדק", ref: "G-7 #6" },
    ],
    differs: "\"התוצאה שהורגת את התכן\" (קריטריון כישלון שנקבע מראש) היא דרישה שלנו; אצל NASA המקבילה היא קריטריון הצלחה לכל אימות.",
  },
  "musk-algorithm": {
    id: "musk-algorithm",
    name: "האלגוריתם של SpaceX, חמשת הצעדים בסדרם",
    source: "Elon Musk, סיור Starbase עם Everyday Astronaut, 2021 (תמליל)",
    url: STARBASE,
    certainty: "בינונית–גבוהה",
    items: [
      { text: "הרעיון שואל קודם אם הדרישה או החלק צריכים להתקיים (צעדים 1–2)" },
      { text: "מפשט או מייעל רק את מה ששרד את המחיקה (צעד 3)" },
      { text: "מאיץ את המחזור או ממכן רק אחרי שלושת הראשונים (צעדים 4–5: \"don't go faster until…\")" },
    ],
  },
  mishap: {
    id: "mishap",
    name: "חקירת תקלה (הפורמט הציבורי של SpaceX ו-FAA)",
    source: "FAA, סגירת חקירת Starship Flight 1 (2023); NASA, ממצאי CRS-7 המוקדמים (2015)",
    url: "https://www.faa.gov/newsroom/faa-closes-spacex-starship-mishap-investigation",
    certainty: "בינונית",
    items: [
      { text: "הסיבה הקרובה הסבירה ביותר, מסומנת כלא סופית (\"most probable, but not definitive\")" },
      { text: "שורש הסיבה, בנפרד מהסיבה הקרובה" },
      { text: "גורמים תורמים" },
      { text: "פעולות מתקנות ממוספרות, לכל אחת בעלים" },
    ],
    differs: "אין תקן כתוב של SpaceX; זו התבנית שחוזרת בפרסומים. NASA ראתה ב-CRS-7 שגיאת תכן, לא רק פגם חומר.",
  },
  nygard: {
    id: "nygard",
    name: "ADR של Nygard",
    source: "Michael Nygard, \"Documenting Architecture Decisions\", Cognitect, 2011",
    url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions",
    certainty: "גבוהה",
    items: [
      { text: "כותרת: צירוף שמני קצר (Title)" },
      { text: "הקשר: הכוחות שפועלים, בניסוח ניטרלי (Context, \"value-neutral\")" },
      { text: "החלטה: משפטים מלאים בלשון פעילה, \"נבחר…\" (Decision, \"We will…\")" },
      { text: "סטטוס: מוצע, התקבל, הוצא משימוש או הוחלף (Status)" },
      { text: "השלכות: כולן, לא רק החיוביות (Consequences)" },
    ],
    differs: "Nygard לא מבקש חלופות; הן מ-MADR. \"מה יהפוך אותה\" הוא שדה שלנו (קרוב ל-Confirmation של MADR ולמבחן אי-הוודאות של NASA). Nygard ממספר ADR ברצף ולא מוחק: החלטה שהתהפכה מסומנת \"הוחלף\".",
  },
  madr: {
    id: "madr",
    name: "MADR 4.0",
    source: "Markdown Architectural Decision Records, גרסה 4.0.0, 2024",
    url: "https://adr.github.io/madr/",
    certainty: "גבוהה",
    items: [
      { text: "הקשר והצגת הבעיה (Context and Problem Statement)" },
      { text: "הכוחות המכריעים (Decision Drivers, רשות)" },
      { text: "החלופות שנשקלו (Considered Options)" },
      { text: "התוצאה והשלכותיה (Decision Outcome, Consequences)" },
      { text: "איך נוודא שההחלטה מיושמת ומחזיקה (Confirmation, רשות)" },
    ],
  },
  "google-doc": {
    id: "google-doc",
    name: "מסמך תכן בסגנון Google",
    source: "Malte Ubl, \"Design Docs at Google\", 2020",
    url: GOOGLE,
    certainty: "גבוהה",
    items: [
      { text: "הקשר והיקף, בקצרה (Context and scope)" },
      { text: "יעדים ויעדים שאינם יעדים (Goals and non-goals)" },
      { text: "התכן עצמו, כ-trade-offs (The actual design)" },
      { text: "חלופות שנשקלו (Alternatives considered)" },
      { text: "שיקולי רוחב (Cross-cutting concerns)" },
    ],
    differs: "Google לא מציבה פרק \"גבול פיזיקלי\" או \"שבירה\"; אצלנו הם פרקים, כי הלומד מתאמן בהחלטות האלה. מסמך מקוצר של 1–3 עמודים לגיטימי במקור.",
  },
  "nasa-pdr": {
    id: "nasa-pdr",
    name: "קריטריוני הצלחה של PDR (NASA), תת-קבוצה",
    source: "NPR 7123.1D, נספח G, טבלה G-6 (PDR Success Criteria); המטרה: SE Handbook טבלה 6.7-1",
    url: NPR,
    certainty: "גבוהה",
    items: [
      { text: "דרישות העל מוסכמות, ברורות ועקביות עם התכן", ref: "G-6 #1" },
      { text: "הדרישות עוקבות לדרישות האב ולמטרות", ref: "G-6 #2" },
      { text: "התכן צפוי לעמוד בדרישות ברמת סיכון מקובלת", ref: "G-6 #4" },
      { text: "הממשקים מוגדרים, חיצוניים ופנימיים", ref: "G-6 #5" },
      { text: "הסיכונים מובנים ומוערכים, ויש תוכנית לנהל אותם", ref: "G-6 #7" },
      { text: "מרווחים טכניים מספיקים (מסה, הספק, זמן, dB)", ref: "G-6 #9" },
      { text: "מחקרי ה-trade כמעט גמורים, ומה שנשאר מזוהה עם תוכנית לסגירה", ref: "G-6 #11" },
      { text: "פריטים פתוחים (TBD/TBR) מזוהים בבירור, עם תוכנית", ref: "G-6 #13" },
    ],
    differs: "בטבלה G-6 יש 21 קריטריונים. כאן מופיעים 8 שתרגיל של 20 דקות יכול לעמוד בהם; עלות, לוח זמנים, בטיחות ותוכנה נשארים בחוץ. \"שלושת קריטריוני ה-PDR\" מהדוח הקודם (אפשרויות נבחרו, ממשקים זוהו, שיטות אימות תוארו) הם עמודת המטרה בטבלה 6.7-1 של המדריך, לא קריטריוני ההצלחה.",
  },
};

/** What is compared after a commit: a stage, and at the close the ADR, the design doc and the review. */
export type StandardTarget = CaseStage | "adr" | "doc" | "review";

const BY_TARGET: Record<StandardTarget, string[]> = {
  fault: ["mishap"],
  "1": ["nasa-req", "musk-req", "google-goals"],
  "2": ["roofline"],
  "3": ["google-design", "nasa-sdr"],
  "4": ["nasa-decision"],
  "5": ["heritage"],
  "6": ["premortem"],
  "7": ["verification"],
  "8": ["musk-algorithm"],
  adr: ["nygard", "madr"],
  doc: ["google-doc"],
  review: ["nasa-pdr"],
};

export const TARGET_LABEL: Record<"adr" | "doc" | "review", string> = { adr: "רשומת ההחלטה", doc: "מסמך התכן כולו", review: "הסקירה כולה" };

export function standardsFor(t: StandardTarget): Standard[] {
  return BY_TARGET[t].map((id) => STANDARDS[id]);
}

/* ---------------- the check: per standard, per item: met, partly, missing; and what differs ---------------- */

export type StdMark = "yes" | "part" | "no";
export interface StdCheck {
  id: string;
  marks: StdMark[];
  /** what is missing or different, in one or two Hebrew sentences */
  gap: string;
  /** who marked it: the reviewer (a model turn) or the learner himself */
  by: "model" | "self";
  at: number;
}

const MARK: Record<string, StdMark> = { yes: "yes", כן: "yes", part: "part", partial: "part", חלקי: "part", no: "no", לא: "no", missing: "no", חסר: "no" };

function jsonOf(raw: string): unknown {
  const t = raw.replace(/```(?:json)?/gi, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch {
    return null;
  }
}

/** The reviewer's check (casePrompt.ts standardPrompt): {"checks": [{"id", "marks": ["yes"|"part"|"no", …], "gap"}]}.
 * One check per standard of the list, in its order; a standard the answer skips or garbles is null (the learner marks it). */
export function parseStdChecks(raw: string, list: Standard[], at = Date.now()): (StdCheck | null)[] {
  const o = jsonOf(raw) as { checks?: unknown } | null;
  const got = Array.isArray(o?.checks) ? (o!.checks as Record<string, unknown>[]) : [];
  return list.map((s) => {
    const c = got.find((x) => x && x.id === s.id);
    if (!c || !Array.isArray(c.marks)) return null;
    const marks = (c.marks as unknown[]).map((m) => MARK[String(m).trim().toLowerCase()]);
    if (marks.length !== s.items.length || marks.some((m) => !m)) return null;
    return { id: s.id, marks: marks as StdMark[], gap: typeof c.gap === "string" ? c.gap.trim().slice(0, 600) : "", by: "model", at };
  });
}

/** A check the learner fills himself (no model here, or the answer failed): every item still missing. */
export const selfCheck = (s: Standard, at = Date.now()): StdCheck => ({ id: s.id, marks: s.items.map(() => "no"), gap: "", by: "self", at });

/** One item's mark moved by a click: missing → partly → met → missing. The check becomes the learner's own. */
export function cycleMark(c: StdCheck, i: number): StdCheck {
  const next: Record<StdMark, StdMark> = { no: "part", part: "yes", yes: "no" };
  return { ...c, marks: c.marks.map((m, k) => (k === i ? next[m] : m)), by: "self" };
}

/** How much of a standard the work covers: met counts 1, partly a half. */
export function stdScore(c: StdCheck): { met: number; part: number; missing: number; share: number } {
  const met = c.marks.filter((m) => m === "yes").length;
  const part = c.marks.filter((m) => m === "part").length;
  const missing = c.marks.length - met - part;
  return { met, part, missing, share: c.marks.length ? (met + part / 2) / c.marks.length : 0 };
}

/** The items the work misses or only partly covers, as short lines (for the debrief and the research proposal). */
export function stdMissing(c: StdCheck, s: Standard): string[] {
  return s.items.flatMap((it, i) => (c.marks[i] === "yes" ? [] : [`${s.name}: ${it.text}${c.marks[i] === "part" ? " (חלקי)" : ""}`]));
}
