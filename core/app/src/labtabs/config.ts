// What differs between the two labs in the tabs beside the lessons. The components
// are the same file in both apps; they read the lab's entry here.
// Sources: docs/research/round4/news/N_design.md (days, sections), round5/expert/E2_domain_targets.json
// (legal_he per domain), E6_projects_products.md §3 (the law and export), S2_product_track.md §2/§4
// (the monthly cycle, the verification rule), S3_no_tradeoff.md §4 (the GitHub checklist).

export type Lab = "core" | "eng";

export interface LegalQuestion {
  id: string;
  q: string;
  /** what the answer usually is, and who decides when it is not clear */
  hint: string;
}

export interface LabConfig {
  name: string;
  /** when the first weekly issue arrives (the scheduled news session) */
  newsArrives: string;
  /** when the first weekly external review arrives (the scheduled review session) */
  reviewArrives: string;
  newsSub: string;
  legal: LegalQuestion[];
  /** E2 legal_he, by domain: shown beside the questions so the idea is checked against its own domains */
  domainLegal: { domain: string; note: string }[];
}

/** Questions for every product, in both labs (E6 §3, S3 §4 "legal"). */
const LEGAL_COMMON: LegalQuestion[] = [
  { id: "transmit", q: "האם משהו במוצר משדר בתדר רדיו?", hint: "קליטה בלבד מותרת. שידור: בכבל עם מנחתים, בכלוב מסוכך, בפס ISM בגבולות ההספק, או ברישיון משרד התקשורת (פקודת הטלגרף האלחוטי)." },
  { id: "typeApproval", q: "האם יש בו ציוד רדיו שצריך אישור סוג?", hint: "עובדים עם מודולים מאושרים, או בכבל. מכ\"ם קצר טווח רק בפסים ובאישורי הסוג המותרים בישראל." },
  { id: "content", q: "האם הוא מפענח תוכן של תקשורת?", hint: "רק מאפייני שכבה פיזית ומטא-נתונים ששודרו לציבור (למשל ADS-B). פענוח תוכן נוגע בחוק האזנת סתר." },
  { id: "gnss", q: "האם הוא נוגע בשידור GNSS (שיבוש או הטעיה)?", hint: "אסור לשדר. עובדים ממאגרים פתוחים, מהקלטות, או בכבל עם מנחתים." },
  { id: "drones", q: "האם יש טיסה של רחפן או כלי טיס?", hint: "לפי כללי רת\"א: רישום ואזורי טיסה. בהתחלה עובדים מהקלטות." },
  { id: "export", q: "האם המוצר או הידע שבו יכולים להיחשב ביטחוניים או דו-שימושיים?", hint: "ביטחוני: חוק הפיקוח על יצוא ביטחוני (2007), אפ\"י (DECA), כולל רישיון שיווק. דו-שימושי: משרד הכלכלה, לפי רשימות Wassenaar. קודם גרסה אזרחית, ולפני לקוח זר ראשון פגישת סיווג. בקוד פתוח בודקים את פטור public domain." },
  { id: "openSources", q: "האם כל הידע מגיע ממקורות פתוחים, ומה מתפרסם על ישראל?", hint: "מפרסמים רק מה שנגזר ממקורות פתוחים. פרסום בנושאים ביטחוניים על ישראל עובר דרך הצנזורה הצבאית." },
  { id: "software", q: "האם רישיונות התוכנה מתירים שימוש מסחרי?", hint: "רישיונות Home ו-Student (MATLAB Home, Ansys Student) אסורים בשימוש מסחרי. בתלויות פתוחות בודקים התאמה של הרישיון (GPL, Apache, MIT) לרישיון המוצר." },
  { id: "data", q: "האם הנתונים מותרים לשימוש, גם מסחרי, ובלי מידע אישי?", hint: "בודקים את תנאי השימוש של כל מאגר (OpenSky, ADS-B Exchange, NASA) ואם יש בו מידע אישי." },
];

/** Gilua's products are engineering products; Lanchester's stay at the analysis level (N_design §1.7). */
const LEGAL_CORE_EXTRA: LegalQuestion[] = [
  { id: "analysisLevel", q: "האם המוצר נשאר ברמת ניתוח, מודל או סימולציה של משוואות שפורסמו?", hint: "המוצרים במעבדה הזו הם מודלים, מחקרי עלות, סימולציות של משוואות פתוחות וזוויות למאמר. בלי בנייה, שינוי או ניטרול של מערכות נשק." },
  { id: "interviews", q: "האם יש ראיונות או מידע ממומחים?", hint: "רק מידע לא מסווג." },
];

const DOMAIN_LEGAL_ENG = [
  { domain: "פיזיקה", note: "מדידות קרינה רק בקליטה או בעוצמה נמוכה בפס ISM מאושר; עדיף בכבלים ומנחתים." },
  { domain: "אותות ומערכות", note: "קליטה מותרת; שידור רק ברישיון. בדיקות שידור בלולאת כבל עם מנחתים." },
  { domain: "תורת המידע ותקשורת", note: "שידור רק בכבל, בכלוב מסוכך, או בפס ISM בתוך מגבלות ההספק." },
  { domain: "אלקטרוניקה ומעגלים", note: "ציוד רדיו שמשדר דורש אישור סוג; לעבוד עם מודולים מאושרים או בכבל." },
  { domain: "זורמים, אווירודינמיקה והנעה", note: "טיסה לפי כללי רת\"א לרחפנים; לבדוק רישום ואזורי טיסה." },
  { domain: "רובוטיקה", note: "טיסה לפי כללי רת\"א." },
];

const RF_MIL = "קליטה בלבד מותרת; כל שידור, ובוודאי שיבוש או הטעיית GNSS, רק בכבל עם מנחתים או בכלוב מסוכך, או ברישיון משרד התקשורת. ידע ביטחוני שמועבר לגורם זר נחשב יצוא ודורש רישיון אפ\"י (DECA), גם בתוך ישראל; לכן מפרסמים רק מה שנגזר ממקורות פתוחים.";
const DOMAIN_LEGAL_CORE = [
  { domain: "אנטנות והתפשטות, ל\"א, תקשורת ו-PNT", note: RF_MIL },
  { domain: "מכ\"ם", note: RF_MIL + " מודולי מכ\"ם רק בפסים ובאישורי סוג המותרים בישראל." },
  { domain: "טילים", note: "רק מקורות פתוחים; לא לפרסם תכן ספציפי שעלול להיות ידע ביטחוני מפוקח." },
  { domain: "הגנה אווירית וטילית", note: "מקורות פתוחים בלבד; צנזורה צבאית בפרסום על ישראל." },
  { domain: "C4ISR", note: "ראיונות רק במידע לא מסווג." },
  { domain: "מערכות חלל", note: "קליטה בלבד." },
  { domain: "כטב\"מים ונגד-כטב\"מ", note: "טיסה לפי כללי רת\"א (רישום, אזורים); בלי שיבוש." },
  { domain: "מלאכת הניתוח: OSINT", note: "צנזורה צבאית על פרסום בנושאי ישראל." },
];

export const LAB: Record<Lab, LabConfig> = {
  eng: {
    name: "גילואה",
    newsArrives: "ביום שישי לפנות בוקר",
    reviewArrives: "ביום ראשון בבוקר",
    newsSub: "השבועון ההנדסי: מחקר, תקנים ומערכות חדשות, מחוברים למה שאתה לומד",
    legal: LEGAL_COMMON,
    domainLegal: DOMAIN_LEGAL_ENG,
  },
  core: {
    name: "לנצ'סטר",
    newsArrives: "ביום שישי לפנות בוקר",
    reviewArrives: "ביום ראשון בבוקר",
    newsSub: "השבועון הצבאי-טכני: דוחות פתוחים, מחקר ותקנים, מחוברים למה שאתה לומד",
    legal: [...LEGAL_COMMON, ...LEGAL_CORE_EXTRA],
    domainLegal: DOMAIN_LEGAL_CORE,
  },
};

/** "best GitHub projects" (S3 §4), plus the product page of S2 §2 step 6. */
export const GITHUB_CHECKLIST: { id: string; label: string }[] = [
  { id: "readme", label: "README עם דמו ותוצאות" },
  { id: "license", label: "רישיון" },
  { id: "tests", label: "בדיקות אוטומטיות ו-CI" },
  { id: "repro", label: "שחזור בפקודה אחת" },
  { id: "docs", label: "תיעוד ומסמך תכן" },
  { id: "validation", label: "דוח אימות מול baseline" },
  { id: "versions", label: "גרסאות ויומן שינויים" },
  { id: "contributing", label: "מדריך תרומה" },
  { id: "productPage", label: "דף מוצר עם מחיר ניסיוני" },
];

/** The verification rule (S2 §4): every central result passes at least two of these, independent of each other. */
export const CHECK_KINDS: { id: string; label: string }[] = [
  { id: "analytic", label: "מקרה אנליטי או ספרותי ידוע" },
  { id: "solver", label: "פותר שני, בלתי תלוי" },
  { id: "data", label: "נתון אמיתי ציבורי" },
  { id: "measure", label: "מדידה זולה" },
];
