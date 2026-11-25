// Unit tests of src/texfix.ts: display-math fences put on lines of their own before parsing.
import { build } from "esbuild";
import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../src/texfix.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const T = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

test("a closing $$ on the formula's line gets a line of its own (25.11: the rest of the lesson was swallowed)", () => {
  assert.equal(T.fixMathFences("$$\np=nkT\\tag{5}$$\n\nטקסט"), "$$\np=nkT\\tag{5}\n$$\n\nטקסט");
  assert.equal(T.fixMathFences("$$p=nkT\n$$"), "$$\np=nkT\n$$");
});

test("a block left open is closed at the next blank line, so it costs one paragraph at most", () => {
  assert.equal(T.fixMathFences("$$\na=b\n\nטקסט $x$"), "$$\na=b\n$$\n\nטקסט $x$");
});

test("well-formed text is unchanged", () => {
  for (const s of ["$$\na=b\n$$", "$$a=b$$", "טקסט $x$ ו-$$y$$ באמצע", "בלי מתמטיקה"]) assert.equal(T.fixMathFences(s), s);
});
