// claude.ai rejects a request whose tool description is longer than 1024 characters (invalid_request, seen 3.11
// after the notebook tool's description grew to 1107): every tool description in the source stays under it.
import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src");
const files = fs.readdirSync(src, { recursive: true }).filter((f) => /\.tsx?$/.test(f));

test("tool descriptions stay under 1024 characters", () => {
  let n = 0;
  for (const f of files) {
    const s = fs.readFileSync(path.join(src, f), "utf8");
    for (const m of s.matchAll(/name:\s*"(\w+)",\s*description:\s*"((?:[^"\\]|\\.)*)"/g)) {
      n++;
      assert.ok(m[2].length < 1024, `${f}: ${m[1]} is ${m[2].length} characters`);
    }
  }
  assert.ok(n > 0);
});
