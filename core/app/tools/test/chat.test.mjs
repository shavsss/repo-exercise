// Unit tests of src/chatContext.ts: what a question in a lesson's conversation sends of the lesson.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/chatContext.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const C = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

const filler = (w, n) => Array.from({ length: n }, () => `${w} ומשפט נוסף שממלא את הפרק בטקסט רגיל.`).join("\n");
const lesson = [
  "פתיחה קצרה.",
  "## 1. רעש תרמי",
  filler("רעש תרמי בנגד", 300),
  "## 2. יחס אות לרעש",
  filler("יחס אות לרעש במקלט", 300),
  "```svg",
  "<svg>" + "x".repeat(20000) + "</svg>",
  "```",
  "## 3. טווח גילוי",
  filler("טווח הגילוי של המכ\"ם", 300),
  "```keep",
  "- טווח: …",
  "```",
].join("\n");
const bytes = (s) => new TextEncoder().encode(s).length;

test("chapters: cut at ## outside fences, with the opening", () => {
  const ch = C.lessonChapters(lesson);
  assert.deepEqual(ch.map((c) => c.head), ["פתיחה", "1. רעש תרמי", "2. יחס אות לרעש", "3. טווח גילוי"]);
});

test("a long lesson: the chapter the question is about, the list of all, under the budget", () => {
  const f = C.focusLesson(lesson, "למה יחס האות לרעש יורד כשהרוחב גדל?", 30000);
  assert.ok(bytes(f) <= 32000, `bytes ${bytes(f)}`);
  assert.match(f, /2\. יחס אות לרעש \(included below\)/);
  assert.match(f, /section 2 "1\. רעש תרמי" not included/);
  assert.ok(f.includes("יחס אות לרעש במקלט"));
  assert.ok(!f.includes("x".repeat(100)), "drawing code is not sent");
  assert.match(f, /read_lesson_chapter/);
});

test("no shared term: the last chapter, which holds the keep block", () => {
  const f = C.focusLesson(lesson, "zzz qqq", 30000);
  assert.match(f, /3\. טווח גילוי \(included below\)/);
  assert.ok(f.includes("```keep"));
});

test("a short lesson goes out whole", () => {
  const short = "## 1. א\nטקסט.\n## 2. ב\nעוד טקסט.";
  assert.equal(C.focusLesson(short, "שאלה", 30000), short);
});

test("history: only lesson answers are focused; a continuation keeps the question asked", () => {
  const h = [
    { role: "user", text: "שיעור", mode: "lesson", ts: 1 },
    { role: "assistant", text: lesson, mode: "lesson", ts: 2 },
    { role: "user", text: "מה זה טווח גילוי?", mode: "clarify", ts: 3 },
    { role: "assistant", text: "תשובה", mode: "clarify", ts: 4 },
  ];
  const q = C.questionOf(h, "המשך", true);
  assert.equal(q, "מה זה טווח גילוי?");
  const r = C.focusHistory(h, q);
  assert.equal(r.chapters.length, 4);
  assert.ok(bytes(r.history[1].text) < bytes(lesson) / 2);
  assert.equal(r.history[3].text, "תשובה");
});
