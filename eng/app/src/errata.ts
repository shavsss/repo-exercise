// Corrections to lessons that were already written (identical in both apps). A stored lesson
// is never rewritten: each erratum is found by an exact quote from the lesson, and when the
// lesson is shown, an `erratum` block (תיקון) is added after the paragraph that holds the
// quote. Where a drawing itself is wrong (a scene's numbers), `replace` fixes the shown text.
// Entries are matched by their quote alone, so they apply in whichever app holds the lesson.

export interface Erratum {
  /** where it was found (for the record): app, conversation/message, review */
  where: string;
  /** an exact quote from the lesson, unique in it */
  quote: string;
  /** the correction, in Hebrew Markdown, shown in a תיקון block after the paragraph */
  note: string;
  /** optional exact text to replace when shown (the quote itself unless `find` is given) */
  find?: string;
  replace?: string;
}

export const ERRATA: Erratum[] = [
  {
    where: "Gilua M0.1 lesson 3 (conv 06x36q0uxkua5ggoifkz, msg 23a0in5aj0bt9c4hq8sh), docs/research/C_lesson_critique.md §2.1",
    quote: "באוויר צפוף היא יורדת מתחת ל-45°, כדי לקצר את הדרך שהפגז עובר באוויר.",
    note: `@title: לאיזה כיוון זזה הזווית עם גרר
המשפט "באוויר צפוף היא יורדת מתחת ל-45°" נכון רק לקליע איטי: כדור, קליע של נשק קל, פצצת מרגמה במטען נמוך. שם הגרר אוכל את המהירות לאורך כל המסלול, ומסלול שטוח יותר מקצר את הדרך באוויר.
בפגז ארטילרי מהיר, כמו ה-155 מ"מ של הדוגמה שלנו, הזווית לטווח מרבי היא בדרך כלל **מעל** 45°: מסלול תלול מעלה את הפגז מהר יותר לאוויר דליל, שבו הגרר קטן בהרבה, ושם הוא עובר את רוב הדרך. תותח פריז, בפסקה הבאה, ירה בכ-50° בדיוק מהסיבה הזאת.
הכלל שכדאי לזכור: הגרר מזיז את הזווית האופטימלית, והכיוון תלוי במהירות ובמבנה האטמוספרה. בלי חישוב של המסלול עם גרר אי אפשר לדעת מראש אם היא מתחת ל-45° או מעליה.`,
  },
  {
    where: "Gilua M0.1 lesson 3, the scene «המכל האופטימלי» (conv 06x36q0uxkua5ggoifkz), docs/research/round2/J3_judge.md §4",
    quote: "הנגיעה היא בדיוק התנאי (28): שני הגרדיאנטים מקבילים, והיחס בין אורכיהם הוא $\\lambda$.",
    find: '"to": ["(V/(2*pi))^(1/3)+0.213", "2*(V/(2*pi))^(1/3)+0.053", 0.03]',
    replace: '"to": ["(V/(2*pi))^(1/3)+0.1051", "2*(V/(2*pi))^(1/3)+0.0263", 0.03]',
    note: `@title: החצים בסצנה, עכשיו בקנה מידה
בגרסה הראשונה של הסצנה החץ של $\\nabla V$ צויר ארוך מדי: יחס האורכים בציור היה $0.388/0.213\\approx1.82$, ולא $\\lambda=3.69$ כמו בטקסט. עכשיו שני החצים מצוירים באותו קנה מידה, והחץ של $\\nabla V$ קצר פי $3.69$ מהחץ של $\\nabla S$, כך שהיחס שרואים הוא בדיוק $\\lambda$.`,
  },
  {
    where: "Gilua M0.1 lesson 1 (conv ktrbl523bg4ofmod6i5b, msg 279ufb382aqloa3frw47), docs/research/C_lesson_critique.md §2.3",
    quote: "מערכת הנדסית אחת עובדת היום רק משום שהיא מתקנת לפי הגאומטריה הזאת: מערכת ה-GPS.",
    note: `@title: GPS והגאומטריה של לובצ'בסקי
התיקונים של שעוני GPS אינם באים מהגאומטריה ההיפרבולית של לובצ'בסקי. הם באים מתורת היחסות: השעון בלוויין מקדים בכ-45 מיקרו-שניות ביום בגלל הכבידה החלשה יותר בגובה (יחסות כללית), ומאחר בכ-7 מיקרו-שניות ביום בגלל המהירות (יחסות פרטית), ובסך הכול מקדים בכ-38 מיקרו-שניות ביום. המתמטיקה של התיקון היא גאומטריה פסאודו-רימנית של מרחב-זמן ארבע-ממדי.
הקשר ללובצ'בסקי עקיף: הוא הראה שגאומטריה עקבית אפשרית גם בלי אקסיומת המקבילים, ומשם צמחה הגאומטריה הרימנית שעליה בנויה היחסות הכללית. מי שכותב או מדבר על הנושא צריך להפריד בין שני הדברים.`,
  },
  {
    where: "Lanchester M0.1 lesson 2 (conv jf4i0q22nh5mfqcytk2m, msg 7xvxnixaou1urxlmd63a), docs/research/C_lesson_critique.md §2.2",
    quote: "כאן $P_T$ הוא הספק המשדר ב-dBm ו-$G_T$ הוא הגבר אנטנת השידור ב-dB (ביחס לאיזוטרופית, כלומר dBi).",
    note: `@title: ERP או EIRP: לאיזו אנטנה מתייחסים
הספר (Adamy) מגדיר ERP ביחס לאנטנה איזוטרופית, וכך גם השיעור. בתקנים (ITU, FCC, ורוב דפי הנתונים ורישיונות התדר) זה נקרא **EIRP**, ואילו **ERP** מתייחס לדיפול חצי-גל, שההגבר שלו 2.15 dBi. לכן:
$$EIRP = ERP + 2.15\\ \\text{dB}$$
כשמשווים נתון ERP ממקור חיצוני לחישוב כאן, בודקים קודם לאיזו אנטנת ייחוס הוא מתייחס. הפער של 2.15 dB הוא בדיוק מה שכלל הביקורת מבקש לתפוס בספר.`,
  },
];

/** Where the paragraph that holds position i ends (after its fenced block, if it is inside one). */
function paragraphEnd(text: string, i: number) {
  let at = i;
  // inside a fenced block: move past its closing fence
  const fences = (text.slice(0, i).match(/^\s*```/gm) ?? []).length;
  if (fences % 2) {
    const close = /^\s*```\s*$/m.exec(text.slice(i));
    at = close ? i + close.index + close[0].length : text.length;
  }
  const blank = text.indexOf("\n\n", at);
  return blank < 0 ? text.length : blank;
}

/** The lesson text as shown: each erratum whose quote it holds adds its תיקון block. */
export function applyErrata(text: string, list: Erratum[] = ERRATA) {
  if (!text) return text;
  let out = text;
  for (const e of list) {
    if (!out.includes(e.quote)) continue;
    // `find` is a second place (a drawing's numbers); without it the quote itself is replaced
    if (e.replace !== undefined) out = out.replace(e.find ?? e.quote, () => e.replace!);
    const anchor = e.replace !== undefined && !e.find ? e.replace : e.quote;
    const end = paragraphEnd(out, out.indexOf(anchor) + anchor.length);
    out = `${out.slice(0, end)}\n\n\`\`\`erratum\n${e.note}\n\`\`\`${out.slice(end)}`;
  }
  return out;
}
