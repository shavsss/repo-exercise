// The artifact publisher rejects literal U+FFFD characters; libraries use them on
// purpose (as the "invalid character" stand-in), so write them as escapes instead.
import fs from "node:fs";

for (const file of ["dist/app.js", "dist/app.css"]) {
  const src = fs.readFileSync(file, "utf8");
  const out = file.endsWith(".js") ? src.replaceAll("�", "\\uFFFD") : src.replaceAll("�", "\\FFFD");
  if (out !== src) fs.writeFileSync(file, out);
}
