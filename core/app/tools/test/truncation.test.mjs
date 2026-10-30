// Unit tests of src/truncation.ts (the cut-text detector and the continuation join).
// Run from the app folder: node tools/test/truncation.test.mjs
// The TypeScript module is bundled on the fly with the esbuild that Vite already installs.
import { build } from "esbuild";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/truncation.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const { looksCut, joinContinuation } = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

let n = 0;
const t = (name, fn) => {
  fn();
  n++;
  console.log("ok", name);
};

/* ---- looksCut: finished texts ---- */
t("sentence with a period", () => assert.equal(looksCut("זו פסקה שלמה. והנה עוד משפט.").cut, false));
t("question", () => assert.equal(looksCut("מה קורה כשמכפילים את הנפח?").cut, false));
t("closed fence at the end", () => assert.equal(looksCut("טקסט.\n\n```think\nמה התשובה?\n```").cut, false));
t("closed display math at the end", () => assert.equal(looksCut("הנוסחה:\n\n$$S = 2\\pi r^2 + 2\\pi r h \\tag{3}$$").cut, false));
t("list item without a period", () => assert.equal(looksCut("שלושה דברים:\n- מבנה\n- מקור\n- גבולות").cut, false));
t("table row", () => assert.equal(looksCut("| a | b |\n|---|---|\n| 1 | 2 |").cut, false));
t("ends with a tag", () => assert.equal(looksCut("כך כתוב בספר [[E03:115]]").cut, false));
t("trailing spaces", () => assert.equal(looksCut("משפט שלם.   \n\n").cut, false));
t("bold at the end", () => assert.equal(looksCut("וזה **העיקר**").cut, false));
t("empty", () => assert.equal(looksCut("").cut, false));
t("inline math in a finished sentence", () => assert.equal(looksCut("היחס הוא $3.69$.").cut, false));

/* ---- looksCut: cut texts ---- */
t("mid-sentence", () => assert.deepEqual(looksCut("הפגז טיפס במהירות דרך האוויר הצפוף אל"), { cut: true, reason: "sentence" }));
t("ends with a comma", () => assert.equal(looksCut("ראשית, הגבר האנטנה,").reason, "sentence"));
t("ends with a colon", () => assert.equal(looksCut("ונהוג לרשום אותו ב-dBm:").reason, "sentence"));
t("ends with an ellipsis mid-exercise (G3)", () => assert.equal(looksCut("```exercise\nחשבו את הגובה.\n```\n\n**תרגיל 4.** מכל נפט בנפח 5000 מ\"ק …").reason, "sentence"));
t("open exercise fence", () => assert.equal(looksCut("טקסט.\n\n```exercise\nחשבו את").reason, "fence"));
t("open scene JSON", () => assert.equal(looksCut('```scene3d\n{"title": "המכל", "objects": [').reason, "fence"));
t("open display math", () => assert.equal(looksCut("ולכן\n\n$$S = 2\\pi r^2 +").reason, "math"));
t("open tag", () => assert.equal(looksCut("ההספק נקרא [[מונח: ERP | ההספק").reason, "tag"));
t("heading as the last line", () => assert.equal(looksCut("סוף הסעיף.\n\n## המינימום השטוח").reason, "heading"));
t("$$ inside a code fence does not count", () => assert.equal(looksCut("```python\nprint('$$')\n```\n\nסוף.").cut, false));
t("list item ending with a comma", () => assert.equal(looksCut("- מבנה,").reason, "sentence"));

/* ---- joinContinuation ---- */
t("mid-sentence join with one space", () => assert.equal(joinContinuation("הפגז טיפס אל", "הסטרטוספרה, ושם עבר."), "הפגז טיפס אל הסטרטוספרה, ושם עבר."));
t("drops a repeated overlap", () => assert.equal(joinContinuation("הפגז טיפס במהירות דרך האוויר הצפוף אל", "דרך האוויר הצפוף אל הסטרטוספרה."), "הפגז טיפס במהירות דרך האוויר הצפוף אל הסטרטוספרה."));
t("drops a restarted last line", () =>
  assert.equal(joinContinuation("פסקה ראשונה.\n\nהפגז טיפס במהירות דרך", "הפגז טיפס במהירות דרך האוויר."), "פסקה ראשונה.\n\nהפגז טיפס במהירות דרך האוויר."));
t("punctuation joins directly", () => assert.equal(joinContinuation("ראשית הגבר", ", ואחר כך האובדנים."), "ראשית הגבר, ואחר כך האובדנים."));
t("inside a fence continues exactly", () => assert.equal(joinContinuation('```scene3d\n{"title": "המ', 'כל"}\n```'), '```scene3d\n{"title": "המכל"}\n```'));
t("inside a fence after a full line", () => assert.equal(joinContinuation("```exercise\nשורה ראשונה\n", "שורה שנייה\n```"), "```exercise\nשורה ראשונה\nשורה שנייה\n```"));
t("finished text gets a new paragraph", () => assert.equal(joinContinuation("סוף החלק.", "החלק הבא."), "סוף החלק.\n\nהחלק הבא."));
t("keeps the model's line breaks", () => assert.equal(joinContinuation("סוף החלק.", "\n\n## כותרת"), "סוף החלק.\n\n## כותרת"));
t("ellipsis cut mark is dropped", () => assert.equal(joinContinuation("מכל נפט בנפח …", "5000 מ\"ק."), "מכל נפט בנפח 5000 מ\"ק."));
t("empty continuation", () => assert.equal(joinContinuation("טקסט", "  "), "טקסט"));
t("continuation that only repeats", () => assert.equal(joinContinuation("הפגז טיפס במהירות דרך", "הפגז טיפס במהירות דרך"), "הפגז טיפס במהירות דרך"));
t("joined text is no longer cut", () => assert.equal(looksCut(joinContinuation("```exercise\nחשבו את", " הגובה.\n```")).cut, false));

console.log(`\n${n} tests passed`);
