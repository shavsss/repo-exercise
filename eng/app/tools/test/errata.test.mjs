// Unit tests of src/errata.ts (corrections shown on lessons already written).
// Run from the app folder: node tools/test/errata.test.mjs [path to a dumped lesson message .json ...]
import { build } from "esbuild";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/errata.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const { ERRATA, applyErrata } = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

const scene = ERRATA.find((e) => e.find);
const drag = ERRATA[0];

// a paragraph with the quote, then the next paragraph: the block lands between them
const text = `פתיחה.\n\nעם גרר הזווית זזה. ${drag.quote}\n\nהפסקה הבאה.`;
const shown = applyErrata(text);
assert.ok(shown.includes(`${drag.quote}\n\n\`\`\`erratum\n@title:`), "block after the paragraph");
assert.ok(shown.endsWith("```\n\nהפסקה הבאה."), "the next paragraph follows the block");
assert.equal(applyErrata("שיעור אחר לגמרי."), "שיעור אחר לגמרי.", "no quote, no change");

// the scene: its numbers are replaced and the note comes after the paragraph of the quote
const lesson = `\`\`\`scene3d\n{"objects": [{"type": "vector", ${scene.find}, "label": "∇V"}]}\n\`\`\`\n\nבסצנה... ${scene.quote} עוד.\n\n### הבא`;
const s2 = applyErrata(lesson);
assert.ok(s2.includes(scene.replace) && !s2.includes(scene.find), "scene numbers replaced");
assert.ok(s2.indexOf("```erratum") > s2.indexOf(scene.quote), "note after the quote");
assert.ok(s2.indexOf("```erratum") < s2.indexOf("### הבא"), "note before the next heading");
// the drawn ratio is now λ = 3.69: |∇S| = |(0.388, 0.097)|, |∇V| from the replaced numbers
const [vx, vy] = [...scene.replace.matchAll(/\+(0\.\d+)/g)].map((m) => +m[1]);
const ratio = Math.hypot(0.388, 0.097) / Math.hypot(vx, vy);
assert.ok(Math.abs(ratio - 3.6905) < 0.01, `arrow ratio ${ratio}`);

// every quote is unique in the lessons it was taken from (optional: dumped messages as arguments)
for (const f of process.argv.slice(2)) {
  const t = JSON.parse(fs.readFileSync(f, "utf8")).text ?? "";
  for (const e of ERRATA) {
    const n = t.split(e.quote).length - 1;
    if (n) {
      assert.equal(n, 1, `quote occurs once: ${e.where}`);
      const a = applyErrata(t);
      assert.equal(a.split("```erratum").length - t.split("```erratum").length, ERRATA.filter((x) => t.includes(x.quote)).length);
      console.log("ok in", f.split("/").pop(), "—", e.where.split(" (")[0]);
    }
  }
}
console.log("errata tests passed");
