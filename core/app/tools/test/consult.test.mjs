// Unit tests of src/consultPrompt.ts: the instructions of a consultation card (10.11).
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const out = await build({ entryPoints: [fileURLToPath(new URL("../../src/consultPrompt.ts", import.meta.url))], bundle: true, format: "esm", write: false, platform: "neutral", logLevel: "silent" });
const C = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

const base = {
  kind: "ask",
  level: 1,
  discuss: true,
  lessonTitle: "M0.1 · שיעור 3",
  section: { title: "4.3 וקטור פוינטינג", text: "טקסט הסעיף", outline: "4.2 הגל\n4.3 וקטור פוינטינג  ← נקרא עכשיו", before: "סוף 4.2" },
  anchor: "עכבת המרחב החופשי",
  memory: "",
  thread: [],
  question: "מה זה נותן לי בעצם",
};

test("the card gets the lesson's headings and the end of the section before", () => {
  const p = C.consultPrompt(base);
  assert.match(p, /<lesson_outline>\n4\.2 הגל\n4\.3 וקטור פוינטינג {2}← נקרא עכשיו\n<\/lesson_outline>/);
  assert.match(p, /<before>\nסוף 4\.2\n<\/before>/);
  assert.ok(p.indexOf("<before>\n") < p.indexOf("<section title"));
});

test("meaning before glossary: no forced list of terms, drawings allowed from level 1, examples welcome", () => {
  const p = C.consultPrompt(base);
  assert.doesNotMatch(p, /דוגמה רק כשביקש/);
  assert.doesNotMatch(p, /ברמות 0–1 בלי בלוקים בכלל/);
  assert.match(p, /מה זה נותן לי/);
  assert.match(p, /svg/);
  assert.match(p, /אף פעם לא רשימת מונחים/);
});

test("said twice he did not understand: start over as a story, not a list of concepts", () => {
  const p = C.consultPrompt({ ...base, thread: [{ q: "לא הבנתי", a: "…" }], question: "לא הבנתי עדיין" });
  assert.match(p, /ספר את זה מחדש כסיפור קצר ורציף/);
  assert.doesNotMatch(p, /בלי אנלוגיה במקום הפיתוח/);
});

test("without the new fields the prompt is as before (no empty tags)", () => {
  const p = C.consultPrompt({ ...base, section: { title: "t", text: "x" } });
  assert.doesNotMatch(p, /<lesson_outline>\n|<before>\n/);
});
