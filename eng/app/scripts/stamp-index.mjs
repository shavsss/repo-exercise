// After the build: point artifact/index.html at app.js and app.css with a version query, so an
// open tab that reloads after a publish loads the new bundle and not a cached copy.
import { readFileSync, writeFileSync } from "node:fs";
const path = new URL("../artifact/index.html", import.meta.url);
const v = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
const html = readFileSync(path, "utf8").replace(/(href|src)="(app\.(?:css|js))(?:\?v=\d+)?"/g, `$1="$2?v=${v}"`);
writeFileSync(path, html);
console.log(`index.html → ?v=${v}`);
